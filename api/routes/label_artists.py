from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import databases
import sqlalchemy
import os

router = APIRouter(prefix="/api/label", tags=["label"])

# In-memory storage for now (replace with database later)
artists_store = {}
expenses_store = {}

# Pydantic models
class ArtistBase(BaseModel):
    name: str
    label_id: int
    email: Optional[str] = None
    ipi_number: Optional[str] = None
    isni_number: Optional[str] = None
    advance_paid: float = 0
    recoupment_rate: float = 100  # Percentage of earnings that go to recoupment

class ArtistCreate(ArtistBase):
    pass

class ArtistUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    ipi_number: Optional[str] = None
    isni_number: Optional[str] = None
    advance_paid: Optional[float] = None
    recoupment_rate: Optional[float] = None

class ArtistResponse(ArtistBase):
    id: int
    total_earnings: float = 0
    total_expenses: float = 0
    recouped: bool = False
    created_at: str
    updated_at: str
    
    class Config:
        orm_mode = True

class ArtistListResponse(BaseModel):
    artists: List[ArtistResponse]
    total: int
    page: int
    size: int

class ExpenseCreate(BaseModel):
    artist_id: int
    amount: float
    description: str
    expense_type: str  # 'advance', 'video', 'marketing', 'studio', 'other'

class ExpenseResponse(BaseModel):
    id: int
    artist_id: int
    amount: float
    description: str
    expense_type: str
    date_incurred: str
    recouped: bool

# Helper functions
def get_next_artist_id():
    return len(artists_store) + 1

def get_next_expense_id():
    return len(expenses_store) + 1

def calculate_artist_stats(artist_id: int):
    """Calculate total earnings, expenses, and recoupment status"""
    artist = artists_store.get(artist_id)
    if not artist:
        return None
    
    # In a real implementation, this would query a database
    # For now, we'll use mock data
    artist_expenses = [e for e in expenses_store.values() if e['artist_id'] == artist_id]
    total_expenses = sum(e['amount'] for e in artist_expenses)
    
    # Mock earnings (replace with real royalty data)
    total_earnings = artist.get('total_earnings', 0)
    if total_earnings == 0:
        # Generate some mock earnings based on artist name
        mock_earnings = {
            'Drake': 1250000,
            'Travis Scott': 950000,
            '21 Savage': 750000,
            'Metro Boomin': 450000
        }.get(artist['name'], 500000)
        total_earnings = mock_earnings
    
    recouped = total_earnings >= total_expenses
    
    return {
        'total_earnings': total_earnings,
        'total_expenses': total_expenses,
        'recouped': recouped
    }

# API Endpoints
@router.get("/artists", response_model=ArtistListResponse)
async def get_artists(
    label_id: int = Query(..., description="Label ID"),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    recouped_only: Optional[bool] = None
):
    """
    Get all artists for a label with pagination and filtering
    """
    try:
        # Filter artists by label_id
        label_artists = [a for a in artists_store.values() if a['label_id'] == label_id]
        
        # Apply search filter
        if search:
            label_artists = [a for a in label_artists if search.lower() in a['name'].lower()]
        
        # Apply recouped filter
        if recouped_only is not None:
            filtered = []
            for a in label_artists:
                stats = calculate_artist_stats(a['id'])
                if stats['recouped'] == recouped_only:
                    filtered.append(a)
            label_artists = filtered
        
        # Calculate stats for each artist
        artists_with_stats = []
        for a in label_artists:
            stats = calculate_artist_stats(a['id'])
            artists_with_stats.append({
                **a,
                'total_earnings': stats['total_earnings'],
                'total_expenses': stats['total_expenses'],
                'recouped': stats['recouped']
            })
        
        # Pagination
        start = (page - 1) * size
        end = start + size
        paginated_artists = artists_with_stats[start:end]
        
        return {
            "artists": paginated_artists,
            "total": len(label_artists),
            "page": page,
            "size": size
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/artists/{artist_id}", response_model=ArtistResponse)
async def get_artist(artist_id: int):
    """
    Get a single artist by ID
    """
    try:
        if artist_id not in artists_store:
            raise HTTPException(status_code=404, detail="Artist not found")
        
        artist = artists_store[artist_id]
        stats = calculate_artist_stats(artist_id)
        
        return {
            **artist,
            'total_earnings': stats['total_earnings'],
            'total_expenses': stats['total_expenses'],
            'recouped': stats['recouped']
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/artists", response_model=ArtistResponse)
async def create_artist(artist: ArtistCreate):
    """
    Create a new artist
    """
    try:
        artist_id = get_next_artist_id()
        now = datetime.utcnow().isoformat()
        
        artist_data = {
            "id": artist_id,
            "name": artist.name,
            "label_id": artist.label_id,
            "email": artist.email,
            "ipi_number": artist.ipi_number,
            "isni_number": artist.isni_number,
            "advance_paid": artist.advance_paid,
            "recoupment_rate": artist.recoupment_rate,
            "total_earnings": 0,
            "created_at": now,
            "updated_at": now
        }
        
        artists_store[artist_id] = artist_data
        
        # If there's an advance, create an expense for it
        if artist.advance_paid > 0:
            expense_id = get_next_expense_id()
            expenses_store[expense_id] = {
                "id": expense_id,
                "artist_id": artist_id,
                "amount": artist.advance_paid,
                "description": "Initial advance",
                "expense_type": "advance",
                "date_incurred": now,
                "recouped": False
            }
        
        stats = calculate_artist_stats(artist_id)
        
        return {
            **artist_data,
            'total_earnings': stats['total_earnings'],
            'total_expenses': stats['total_expenses'],
            'recouped': stats['recouped']
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/artists/{artist_id}", response_model=ArtistResponse)
async def update_artist(artist_id: int, artist_update: ArtistUpdate):
    """
    Update an artist's information
    """
    try:
        if artist_id not in artists_store:
            raise HTTPException(status_code=404, detail="Artist not found")
        
        artist = artists_store[artist_id]
        now = datetime.utcnow().isoformat()
        
        # Update only provided fields
        if artist_update.name is not None:
            artist['name'] = artist_update.name
        if artist_update.email is not None:
            artist['email'] = artist_update.email
        if artist_update.ipi_number is not None:
            artist['ipi_number'] = artist_update.ipi_number
        if artist_update.isni_number is not None:
            artist['isni_number'] = artist_update.isni_number
        if artist_update.advance_paid is not None:
            artist['advance_paid'] = artist_update.advance_paid
        if artist_update.recoupment_rate is not None:
            artist['recoupment_rate'] = artist_update.recoupment_rate
        
        artist['updated_at'] = now
        artists_store[artist_id] = artist
        
        stats = calculate_artist_stats(artist_id)
        
        return {
            **artist,
            'total_earnings': stats['total_earnings'],
            'total_expenses': stats['total_expenses'],
            'recouped': stats['recouped']
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/artists/{artist_id}")
async def delete_artist(artist_id: int):
    """
    Delete an artist
    """
    try:
        if artist_id not in artists_store:
            raise HTTPException(status_code=404, detail="Artist not found")
        
        del artists_store[artist_id]
        
        # Also delete associated expenses
        expenses_to_delete = [e_id for e_id, e in expenses_store.items() if e['artist_id'] == artist_id]
        for e_id in expenses_to_delete:
            del expenses_store[e_id]
        
        return {"success": True, "message": "Artist deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/artists/{artist_id}/expenses")
async def get_artist_expenses(artist_id: int):
    """
    Get all expenses for a specific artist
    """
    try:
        if artist_id not in artists_store:
            raise HTTPException(status_code=404, detail="Artist not found")
        
        artist_expenses = [e for e in expenses_store.values() if e['artist_id'] == artist_id]
        
        return {
            "artist_id": artist_id,
            "expenses": artist_expenses,
            "total": len(artist_expenses),
            "total_amount": sum(e['amount'] for e in artist_expenses)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/artists/{artist_id}/expenses", response_model=ExpenseResponse)
async def add_artist_expense(artist_id: int, expense: ExpenseCreate):
    """
    Add a new expense for an artist
    """
    try:
        if artist_id not in artists_store:
            raise HTTPException(status_code=404, detail="Artist not found")
        
        expense_id = get_next_expense_id()
        now = datetime.utcnow().isoformat()
        
        expense_data = {
            "id": expense_id,
            "artist_id": artist_id,
            "amount": expense.amount,
            "description": expense.description,
            "expense_type": expense.expense_type,
            "date_incurred": now,
            "recouped": False
        }
        
        expenses_store[expense_id] = expense_data
        
        return expense_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Seed some mock data for testing
def seed_mock_data():
    """Add some mock artists for testing"""
    mock_artists = [
        {"id": 1, "name": "Drake", "label_id": 1, "advance_paid": 800000},
        {"id": 2, "name": "Travis Scott", "label_id": 1, "advance_paid": 1200000},
        {"id": 3, "name": "21 Savage", "label_id": 1, "advance_paid": 450000},
        {"id": 4, "name": "Metro Boomin", "label_id": 1, "advance_paid": 600000},
    ]
    
    for artist in mock_artists:
        if artist['id'] not in artists_store:
            now = datetime.utcnow().isoformat()
            artists_store[artist['id']] = {
                "id": artist['id'],
                "name": artist['name'],
                "label_id": artist['label_id'],
                "email": f"{artist['name'].lower().replace(' ', '')}@example.com",
                "ipi_number": f"IPI{artist['id']:08d}",
                "isni_number": f"ISNI{artist['id']:08d}",
                "advance_paid": artist['advance_paid'],
                "recoupment_rate": 100,
                "created_at": now,
                "updated_at": now
            }
            
            # Add advance as expense
            expense_id = len(expenses_store) + 1
            expenses_store[expense_id] = {
                "id": expense_id,
                "artist_id": artist['id'],
                "amount": artist['advance_paid'],
                "description": "Initial advance",
                "expense_type": "advance",
                "date_incurred": now,
                "recouped": False
            }

# Seed mock data on startup
seed_mock_data()
