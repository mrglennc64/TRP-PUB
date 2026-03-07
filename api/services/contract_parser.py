# /root/traproyalties-new/api/services/contract_parser.py
import re
import PyPDF2
import openai
from typing import Dict, List, Optional

class ContractParser:
    """
    AI-powered contract parser to extract split points from PDF deal memos
    """
    
    def __init__(self):
        # Configure OpenAI for GPT-4 extraction
        openai.api_key = os.getenv('OPENAI_KEY')
        
    async def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text from uploaded contract PDF"""
        text = ""
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text()
        return text
    
    async def parse_contract(self, contract_text: str) -> Dict:
        """
        Use GPT-4 to extract:
        - Artist name
        - Master split percentage
        - Publishing split percentage
        - Advance amount
        - Recoupable expenses
        - Term length
        """
        prompt = f"""
        Extract the following information from this music contract:
        - Artist name
        - Master recording split (percentage to label, percentage to artist)
        - Publishing split (percentage to publisher, percentage to writer)
        - Advance amount paid
        - Recoupable expenses
        - Contract term
        
        Contract text:
        {contract_text[:4000]}
        
        Return as JSON.
        """
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        
        return json.loads(response.choices[0].message.content)
    
    async def apply_to_isrcs(self, artist_name: str, splits: Dict, isrc_list: List[str]):
        """
        Automatically apply extracted splits to all ISRCs for this artist
        """
        for isrc in isrc_list:
            await self.update_split_for_isrc(isrc, splits)
        
        return {"status": "success", "updated_count": len(isrc_list)}
