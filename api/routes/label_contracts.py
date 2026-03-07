from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
import os
import tempfile
import json
import re
import PyPDF2
import openai  # You'll need to install: pip install openai

router = APIRouter(prefix="/api/label", tags=["label"])

# In-memory storage (replace with database later)
contracts_store = {}
extracted_splits_store = {}

# OpenAI API key (set this in your environment variables)
openai.api_key = os.getenv('OPENAI_KEY', '')

# Pydantic models
class SplitInfo(BaseModel):
    name: str
    role: str  # 'artist', 'producer', 'writer', 'label', 'publisher'
    percentage: float
    ipi: Optional[str] = None
    isni: Optional[str] = None
    email: Optional[str] = None

class ContractExtractedData(BaseModel):
    artist_name: str
    label_name: Optional[str] = None
    contract_date: Optional[str] = None
    term_years: Optional[int] = None
    advance_amount: float = 0
    recoupable_expenses: List[str] = []
    
    # Split information
    master_split: Dict[str, float] = {}  # e.g., {"artist": 50, "label": 50}
    publishing_split: Dict[str, float] = {}  # e.g., {"writer": 50, "publisher": 50}
    
    # Producer/writer splits if specified
    participants: List[SplitInfo] = []
    
    # Territories
    territories: List[str] = []
    
    # Rights granted
    rights_granted: List[str] = []

class ContractResponse(BaseModel):
    id: int
    filename: str
    artist_id: Optional[int] = None
    artist_name: Optional[str] = None
    extracted_data: ContractExtractedData
    status: str  # 'pending', 'processed', 'applied', 'rejected'
    created_at: str
    updated_at: str

class ApplyContractRequest(BaseModel):
    contract_id: int
    artist_id: int
    apply_to_all_isrcs: bool = True
    specific_isrcs: Optional[List[str]] = None

# Helper functions
def get_next_contract_id():
    return len(contracts_store) + 1

def get_next_split_id():
    return len(extracted_splits_store) + 1

async def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text content from PDF file"""
    text = ""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n"
        return text
    except Exception as e:
        raise Exception(f"Failed to extract PDF text: {str(e)}")

async def parse_contract_with_ai(contract_text: str) -> Dict:
    """
    Use OpenAI to extract structured data from contract text
    """
    if not openai.api_key:
        # If no API key, use regex-based extraction
        return await parse_contract_with_regex(contract_text)
    
    try:
        prompt = f"""
        Extract the following information from this music contract. Return ONLY a JSON object with these fields:
        
        1. artist_name: The name of the artist
        2. label_name: The name of the record label
        3. contract_date: Date of contract (YYYY-MM-DD format if possible)
        4. term_years: Number of years the contract is valid for
        5. advance_amount: Advance amount paid to artist (numeric only)
        6. recoupable_expenses: List of expenses that are recoupable (e.g., ["video", "marketing", "studio"])
        7. master_split: Object with percentages for master recording (e.g., {{"artist": 50, "label": 50}})
        8. publishing_split: Object with percentages for publishing (e.g., {{"writer": 50, "publisher": 50}})
        9. participants: List of objects with name, role, percentage, ipi, isni, email
        10. territories: List of territories covered (e.g., ["Worldwide", "US", "Europe"])
        11. rights_granted: List of rights granted (e.g., ["Mechanical", "Performance", "Synchronization"])
        
        Contract text:
        {contract_text[:4000]}
        
        Return ONLY valid JSON, no other text.
        """
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a contract parsing assistant. Extract structured data from music contracts."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1500
        )
        
        result = response.choices[0].message.content
        
        # Clean up response (remove markdown code blocks if present)
        result = result.replace('```json', '').replace('```', '').strip()
        
        return json.loads(result)
        
    except Exception as e:
        print(f"AI parsing failed: {e}, falling back to regex")
        return await parse_contract_with_regex(contract_text)

async def parse_contract_with_regex(contract_text: str) -> Dict:
    """
    Fallback method using regex patterns to extract contract info
    """
    result = {
        "artist_name": "",
        "label_name": "",
        "contract_date": "",
        "term_years": 0,
        "advance_amount": 0,
        "recoupable_expenses": [],
        "master_split": {},
        "publishing_split": {},
        "participants": [],
        "territories": [],
        "rights_granted": []
    }
    
    # Look for artist name
    artist_patterns = [
        r'artist[:\s]+([A-Za-z0-9\s\.]+)',
        r'performer[:\s]+([A-Za-z0-9\s\.]+)',
        r'between\s+([A-Za-z0-9\s\.]+)\s+and',
    ]
    for pattern in artist_patterns:
        match = re.search(pattern, contract_text, re.IGNORECASE)
        if match:
            result['artist_name'] = match.group(1).strip()
            break
    
    # Look for label name
    label_patterns = [
        r'label[:\s]+([A-Za-z0-9\s\.]+)',
        r'company[:\s]+([A-Za-z0-9\s\.]+)',
        r'record\s+company[:\s]+([A-Za-z0-9\s\.]+)',
    ]
    for pattern in label_patterns:
        match = re.search(pattern, contract_text, re.IGNORECASE)
        if match:
            result['label_name'] = match.group(1).strip()
            break
    
    # Look for advance amount
    advance_patterns = [
        r'advance\s+\$?([0-9,]+)',
        r'payment\s+of\s+\$?([0-9,]+)',
        r'\$?([0-9,]+)\s+advance',
    ]
    for pattern in advance_patterns:
        match = re.search(pattern, contract_text, re.IGNORECASE)
        if match:
            amount_str = match.group(1).replace(',', '')
            try:
                result['advance_amount'] = float(amount_str)
            except:
                pass
            break
    
    # Look for percentages
    percent_patterns = [
        r'([0-9]+)%\s*(?:to|for|artist)',
        r'artist\s*:\s*([0-9]+)%',
        r'label\s*:\s*([0-9]+)%',
    ]
    
    # This is simplified - in reality you'd need more sophisticated parsing
    
    return result

async def apply_splits_to_isrcs(artist_id: int, splits: Dict, isrc_list: List[str]):
    """
    Apply extracted splits to all ISRCs for an artist
    """
    # This would update your database
    # For now, just return success
    return {
        "success": True,
        "artist_id": artist_id,
        "isrc_count": len(isrc_list),
        "splits_applied": splits
    }

# API Endpoints
@router.post("/contracts/upload")
async def upload_contract(
    file: UploadFile = File(...),
    label_id: int = Form(...),
    artist_id: Optional[int] = Form(None),
    artist_name: Optional[str] = Form(None)
):
    """
    Upload a contract PDF, parse it, and extract split information
    """
    temp_file_path = None
    try:
        # Validate file type
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            content = await file.read()
            tmp.write(content)
            temp_file_path = tmp.name
        
        # Extract text from PDF
        contract_text = await extract_text_from_pdf(temp_file_path)
        
        if not contract_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        # Parse contract with AI
        extracted_data = await parse_contract_with_ai(contract_text)
        
        # Create contract record
        contract_id = get_next_contract_id()
        now = datetime.utcnow().isoformat()
        
        contract_data = {
            "id": contract_id,
            "filename": file.filename,
            "label_id": label_id,
            "artist_id": artist_id,
            "artist_name": artist_name or extracted_data.get('artist_name', ''),
            "extracted_data": extracted_data,
            "status": "processed",
            "created_at": now,
            "updated_at": now
        }
        
        contracts_store[contract_id] = contract_data
        
        # Clean up temp file
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        
        return {
            "success": True,
            "contract_id": contract_id,
            "filename": file.filename,
            "extracted_data": extracted_data,
            "message": "Contract processed successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        # Clean up temp file on error
        if temp_file_path and os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/contracts/{contract_id}/apply", response_model=Dict)
async def apply_contract_splits(
    contract_id: int,
    request: ApplyContractRequest
):
    """
    Apply extracted splits from a contract to an artist's catalog
    """
    try:
        if contract_id not in contracts_store:
            raise HTTPException(status_code=404, detail="Contract not found")
        
        contract = contracts_store[contract_id]
        
        # Get artist's ISRCs (this would come from database)
        # For demo, create mock ISRCs
        mock_isrcs = [
            "USUM71703861",
            "USUM71802934",
            "USUM71904567"
        ]
        
        isrc_list = request.specific_isrcs if request.specific_isrcs else mock_isrcs
        
        # Apply splits
        result = await apply_splits_to_isrcs(
            request.artist_id,
            contract['extracted_data'],
            isrc_list
        )
        
        # Update contract status
        contract['status'] = 'applied'
        contract['updated_at'] = datetime.utcnow().isoformat()
        contract['applied_to_artist'] = request.artist_id
        contracts_store[contract_id] = contract
        
        return {
            "success": True,
            "contract_id": contract_id,
            "artist_id": request.artist_id,
            "isrcs_updated": isrc_list,
            "splits": contract['extracted_data'].get('participants', []),
            "message": f"Successfully applied splits to {len(isrc_list)} tracks"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/contracts", response_model=List[ContractResponse])
async def get_contracts(
    label_id: int,
    artist_id: Optional[int] = None,
    status: Optional[str] = None
):
    """
    Get all contracts for a label, optionally filtered by artist or status
    """
    try:
        label_contracts = [c for c in contracts_store.values() if c.get('label_id') == label_id]
        
        if artist_id:
            label_contracts = [c for c in label_contracts if c.get('artist_id') == artist_id]
        
        if status:
            label_contracts = [c for c in label_contracts if c.get('status') == status]
        
        return label_contracts
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/contracts/{contract_id}", response_model=ContractResponse)
async def get_contract(contract_id: int):
    """
    Get a specific contract by ID
    """
    try:
        if contract_id not in contracts_store:
            raise HTTPException(status_code=404, detail="Contract not found")
        
        return contracts_store[contract_id]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/contracts/{contract_id}")
async def delete_contract(contract_id: int):
    """
    Delete a contract
    """
    try:
        if contract_id not in contracts_store:
            raise HTTPException(status_code=404, detail="Contract not found")
        
        del contracts_store[contract_id]
        
        return {"success": True, "message": "Contract deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/contracts/{contract_id}/reject")
async def reject_contract(contract_id: int, reason: str = ""):
    """
    Mark a contract as rejected (incorrect parsing)
    """
    try:
        if contract_id not in contracts_store:
            raise HTTPException(status_code=404, detail="Contract not found")
        
        contract = contracts_store[contract_id]
        contract['status'] = 'rejected'
        contract['rejection_reason'] = reason
        contract['updated_at'] = datetime.utcnow().isoformat()
        contracts_store[contract_id] = contract
        
        return {
            "success": True,
            "contract_id": contract_id,
            "status": "rejected",
            "message": "Contract rejected"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Seed mock data for testing
def seed_mock_contracts():
    """Add some mock contracts for testing"""
    now = datetime.utcnow().isoformat()
    
    mock_contracts = [
        {
            "id": 1,
            "filename": "drake_contract_2025.pdf",
            "label_id": 1,
            "artist_id": 1,
            "artist_name": "Drake",
            "extracted_data": {
                "artist_name": "Drake",
                "label_name": "OVO Sound",
                "contract_date": "2025-01-15",
                "term_years": 3,
                "advance_amount": 800000,
                "recoupable_expenses": ["video", "marketing", "studio"],
                "master_split": {"artist": 50, "label": 50},
                "publishing_split": {"writer": 50, "publisher": 50},
                "participants": [
                    {"name": "Drake", "role": "artist", "percentage": 50, "ipi": "00624789341"},
                    {"name": "OVO Sound", "role": "label", "percentage": 50}
                ],
                "territories": ["Worldwide"],
                "rights_granted": ["Mechanical", "Performance", "Synchronization"]
            },
            "status": "processed",
            "created_at": now,
            "updated_at": now
        },
        {
            "id": 2,
            "filename": "travis_scott_contract_2025.pdf",
            "label_id": 1,
            "artist_id": 2,
            "artist_name": "Travis Scott",
            "extracted_data": {
                "artist_name": "Travis Scott",
                "label_name": "Cactus Jack",
                "contract_date": "2025-02-20",
                "term_years": 4,
                "advance_amount": 1200000,
                "recoupable_expenses": ["video", "marketing", "tour support"],
                "master_split": {"artist": 60, "label": 40},
                "publishing_split": {"writer": 60, "publisher": 40},
                "participants": [
                    {"name": "Travis Scott", "role": "artist", "percentage": 60, "ipi": "00765432109"},
                    {"name": "Cactus Jack", "role": "label", "percentage": 40}
                ],
                "territories": ["Worldwide"],
                "rights_granted": ["Mechanical", "Performance", "Synchronization"]
            },
            "status": "processed",
            "created_at": now,
            "updated_at": now
        }
    ]
    
    for contract in mock_contracts:
        if contract['id'] not in contracts_store:
            contracts_store[contract['id']] = contract

# Seed mock data on startup
seed_mock_contracts()
