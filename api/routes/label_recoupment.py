from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import databases
import sqlalchemy
import os

router = APIRouter(prefix="/api/label", tags=["label"])

# In-memory storage (replace with database later)
recoupment_store = {}
expenses_store = {}
earnings_store = {}

# Pydantic models
class RecoupmentSummary(BaseModel):
    artist_id: int
    artist_name: str
    total_earnings: float
    total_expenses: float
    current_balance: float
    recouped: bool
    recoupment_percentage: float
    projected_recoupment_date: Optional[str] = None

class ExpenseBase(BaseModel):
    artist_id: int
    amount: float
    description: str
    expense_type: str  # 'advance', 'video', 'marketing', 'studio', 'other'
    date_incurred: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    amount: Optional[float] = None
    description: Optional[str] = None
    expense_type: Optional[str] = None
    recouped: Optional[bool] = None

class ExpenseResponse(ExpenseBase):
    id: int
    date_incurred: str
    recouped: bool
    created_at: str
    updated_at: str

class EarningsBase(BaseModel):
    artist_id: int
    amount: float
    source: str  # 'streaming', 'sync', 'mechanical', 'performance', 'other'
    period_start: str
    period_end: str
    notes: Optional[str] = None

class EarningsCreate(EarningsBase):
    pass

class EarningsResponse(EarningsBase):
    id: int
    created_at: str
    updated_at: str

class RecoupmentTransaction(BaseModel):
    id: int
    artist_id: int
    type: str  # 'expense' or 'earning'
    amount: float
    description: str
    date: str
    balance_after: float

class RecoupmentReport(BaseModel):
    artist_id: int
    artist_name: str
    summary: RecoupmentSummary
    transactions: List[RecoupmentTransaction]
    expenses: List[ExpenseResponse]
    earnings: List[EarningsResponse]

# Helper functions
def get_next_expense_id():
    return len(expenses_store) + 1

def get_next_earnings_id():
    return len(earnings_store) + 1

def calculate_artist_balance(artist_id: int):
    """Calculate current balance for an artist"""
    artist_expenses = [e for e in expenses_store.values() if e['artist_id'] == artist_id]
    artist_earnings = [e for e in earnings_store.values() if e['artist_id'] == artist_id]
    
    total_expenses = sum(e['amount'] for e in artist_expenses)
    total_earnings = sum(e['amount'] for e in artist_earnings)
    
    return {
        'total_expenses': total_expenses,
        'total_earnings': total_earnings,
        'balance': total_earnings - total_expenses,
        'recouped': total_earnings >= total_expenses
    }

def calculate_recoupment_percentage(artist_id: int):
    """Calculate what percentage of expenses have been recouped"""
    balance_info = calculate_artist_balance(artist_id)
    
    if balance_info['total_expenses'] == 0:
        return 100.0
    
    if balance_info['recouped']:
        return 100.0
    
    return (balance_info['total_earnings'] / balance_info['total_expenses']) * 100

def calculate_projected_recoupment_date(artist_id: int, avg_monthly_earnings: float = None):
    """Estimate when artist will recoup based on average earnings"""
    balance_info = calculate_artist_balance(artist_id)
    
    if balance_info['recouped']:
        return None
    
    if avg_monthly_earnings is None or avg_monthly_earnings <= 0:
        # Calculate average from last 3 months of earnings
        artist_earnings = [e for e in earnings_store.values() if e['artist_id'] == artist_id]
        if len(artist_earnings) == 0:
            return None
        
        # Sort by date
        sorted_earnings = sorted(artist_earnings, key=lambda x: x['period_end'])
        recent_earnings = sorted_earnings[-3:] if len(sorted_earnings) >= 3 else sorted_earnings
        
        if len(recent_earnings) == 0:
            return None
        
        total_recent = sum(e['amount'] for e in recent_earnings)
        avg_monthly_earnings = total_recent / len(recent_earnings)
    
    if avg_monthly_earnings <= 0:
        return None
    
    remaining = balance_info['total_expenses'] - balance_info['total_earnings']
    months_needed = remaining / avg_monthly_earnings
    
    if months_needed > 120:  # More than 10 years
        return None
    
    projected_date = datetime.now() + timedelta(days=months_needed * 30)
    return projected_date.isoformat()

# API Endpoints
@router.get("/recoupment/artists", response_model=List[RecoupmentSummary])
async def get_all_recoupment_summaries(
    label_id: int = Query(..., description="Label ID"),
    recouped_only: Optional[bool] = None
):
    """
    Get recoupment summaries for all artists in a label
    """
    try:
        # This would normally query a database
        # For now, we'll use the mock data from our store
        from .label_artists import artists_store as artist_store
        
        label_artists = [a for a in artist_store.values() if a.get('label_id') == label_id]
        
        summaries = []
        for artist in label_artists:
            balance_info = calculate_artist_balance(artist['id'])
            recoupment_pct = calculate_recoupment_percentage(artist['id'])
            projected_date = calculate_projected_recoupment_date(artist['id'])
            
            summary = RecoupmentSummary(
                artist_id=artist['id'],
                artist_name=artist['name'],
                total_earnings=balance_info['total_earnings'],
                total_expenses=balance_info['total_expenses'],
                current_balance=balance_info['balance'],
                recouped=balance_info['recouped'],
                recoupment_percentage=recoupment_pct,
                projected_recoupment_date=projected_date
            )
            
            if recouped_only is None or summary.recouped == recouped_only:
                summaries.append(summary)
        
        return summaries
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recoupment/artists/{artist_id}", response_model=RecoupmentReport)
async def get_artist_recoupment_report(artist_id: int):
    """
    Get detailed recoupment report for a specific artist
    """
    try:
        from .label_artists import artists_store as artist_store
        
        if artist_id not in artist_store:
            raise HTTPException(status_code=404, detail="Artist not found")
        
        artist = artist_store[artist_id]
        balance_info = calculate_artist_balance(artist_id)
        recoupment_pct = calculate_recoupment_percentage(artist_id)
        projected_date = calculate_projected_recoupment_date(artist_id)
        
        # Get all expenses for this artist
        artist_expenses = [e for e in expenses_store.values() if e['artist_id'] == artist_id]
        
        # Get all earnings for this artist
        artist_earnings = [e for e in earnings_store.values() if e['artist_id'] == artist_id]
        
        # Create transaction history
        transactions = []
        running_balance = 0
        
        # Combine and sort by date
        all_items = []
        
        for e in artist_expenses:
            all_items.append({
                'id': e['id'],
                'type': 'expense',
                'amount': -e['amount'],
                'description': e['description'],
                'date': e['date_incurred'],
                'data': e
            })
        
        for e in artist_earnings:
            all_items.append({
                'id': e['id'],
                'type': 'earning',
                'amount': e['amount'],
                'description': f"Earnings: {e['source']} ({e['period_start']} to {e['period_end']})",
                'date': e['created_at'],
                'data': e
            })
        
        # Sort by date
        all_items.sort(key=lambda x: x['date'])
        
        for item in all_items:
            running_balance += item['amount']
            transactions.append(RecoupmentTransaction(
                id=item['id'],
                artist_id=artist_id,
                type=item['type'],
                amount=abs(item['amount']),
                description=item['description'],
                date=item['date'],
                balance_after=running_balance
            ))
        
        summary = RecoupmentSummary(
            artist_id=artist_id,
            artist_name=artist['name'],
            total_earnings=balance_info['total_earnings'],
            total_expenses=balance_info['total_expenses'],
            current_balance=balance_info['balance'],
            recouped=balance_info['recouped'],
            recoupment_percentage=recoupment_pct,
            projected_recoupment_date=projected_date
        )
        
        return RecoupmentReport(
            artist_id=artist_id,
            artist_name=artist['name'],
            summary=summary,
            transactions=transactions,
            expenses=artist_expenses,
            earnings=artist_earnings
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recoupment/artists/{artist_id}/balance")
async def get_artist_balance(artist_id: int):
    """
    Get current balance for an artist
    """
    try:
        from .label_artists import artists_store as artist_store
        
        if artist_id not in artist_store:
            raise HTTPException(status_code=404, detail="Artist not found")
        
        balance_info = calculate_artist_balance(artist_id)
        
        return {
            "artist_id": artist_id,
            "artist_name": artist_store[artist_id]['name'],
            "total_earnings": balance_info['total_earnings'],
            "total_expenses": balance_info['total_expenses'],
            "current_balance": balance_info['balance'],
            "recouped": balance_info['recouped']
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recoupment/artists/{artist_id}/expenses")
async def get_artist_expenses(
    artist_id: int,
    expense_type: Optional[str] = None,
    recouped_only: Optional[bool] = None
):
    """
    Get all expenses for an artist with optional filtering
    """
    try:
        from .label_artists import artists_store as artist_store
        
        if artist_id not in artist_store:
            raise HTTPException(status_code=404, detail="Artist not found")
        
        artist_expenses = [e for e in expenses_store.values() if e['artist_id'] == artist_id]
        
        if expense_type:
            artist_expenses = [e for e in artist_expenses if e['expense_type'] == expense_type]
        
        if recouped_only is not None:
            artist_expenses = [e for e in artist_expenses if e['recouped'] == recouped_only]
        
        return {
            "artist_id": artist_id,
            "artist_name": artist_store[artist_id]['name'],
            "expenses": artist_expenses,
            "total": len(artist_expenses),
            "total_amount": sum(e['amount'] for e in artist_expenses)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recoupment/artists/{artist_id}/earnings")
async def get_artist_earnings(
    artist_id: int,
    source: Optional[str] = None,
    from_date: Optional[str] = None,
    to_date: Optional[str] = None
):
    """
    Get all earnings for an artist with optional filtering
    """
    try:
        from .label_artists import artists_store as artist_store
        
        if artist_id not in artist_store:
            raise HTTPException(status_code=404, detail="Artist not found")
        
        artist_earnings = [e for e in earnings_store.values() if e['artist_id'] == artist_id]
        
        if source:
            artist_earnings = [e for e in artist_earnings if e['source'] == source]
        
        if from_date:
            artist_earnings = [e for e in artist_earnings if e['period_end'] >= from_date]
        
        if to_date:
            artist_earnings = [e for e in artist_earnings if e['period_start'] <= to_date]
        
        return {
            "artist_id": artist_id,
            "artist_name": artist_store[artist_id]['name'],
            "earnings": artist_earnings,
            "total": len(artist_earnings),
            "total_amount": sum(e['amount'] for e in artist_earnings)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recoupment/artists/{artist_id}/expenses", response_model=ExpenseResponse)
async def add_artist_expense(artist_id: int, expense: ExpenseCreate):
    """
    Add a new expense for an artist
    """
    try:
        from .label_artists import artists_store as artist_store
        
        if artist_id not in artist_store:
            raise HTTPException(status_code=404, detail="Artist not found")
        
        expense_id = get_next_expense_id()
        now = datetime.utcnow().isoformat()
        
        expense_data = {
            "id": expense_id,
            "artist_id": artist_id,
            "amount": expense.amount,
            "description": expense.description,
            "expense_type": expense.expense_type,
            "date_incurred": expense.date_incurred or now,
            "recouped": False,
            "created_at": now,
            "updated_at": now
        }
        
        expenses_store[expense_id] = expense_data
        
        return expense_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/recoupment/expenses/{expense_id}", response_model=ExpenseResponse)
async def update_expense(expense_id: int, expense_update: ExpenseUpdate):
    """
    Update an existing expense
    """
    try:
        if expense_id not in expenses_store:
            raise HTTPException(status_code=404, detail="Expense not found")
        
        expense = expenses_store[expense_id]
        now = datetime.utcnow().isoformat()
        
        if expense_update.amount is not None:
            expense['amount'] = expense_update.amount
        if expense_update.description is not None:
            expense['description'] = expense_update.description
        if expense_update.expense_type is not None:
            expense['expense_type'] = expense_update.expense_type
        if expense_update.recouped is not None:
            expense['recouped'] = expense_update.recouped
        
        expense['updated_at'] = now
        expenses_store[expense_id] = expense
        
        return expense
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/recoupment/expenses/{expense_id}")
async def delete_expense(expense_id: int):
    """
    Delete an expense
    """
    try:
        if expense_id not in expenses_store:
            raise HTTPException(status_code=404, detail="Expense not found")
        
        del expenses_store[expense_id]
        
        return {"success": True, "message": "Expense deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/recoupment/artists/{artist_id}/earnings", response_model=EarningsResponse)
async def add_artist_earnings(artist_id: int, earnings: EarningsCreate):
    """
    Add earnings for an artist
    """
    try:
        from .label_artists import artists_store as artist_store
        
        if artist_id not in artist_store:
            raise HTTPException(status_code=404, detail="Artist not found")
        
        earnings_id = get_next_earnings_id()
        now = datetime.utcnow().isoformat()
        
        earnings_data = {
            "id": earnings_id,
            "artist_id": artist_id,
            "amount": earnings.amount,
            "source": earnings.source,
            "period_start": earnings.period_start,
            "period_end": earnings.period_end,
            "notes": earnings.notes,
            "created_at": now,
            "updated_at": now
        }
        
        earnings_store[earnings_id] = earnings_data
        
        return earnings_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Seed some mock data for testing
def seed_mock_data():
    """Add some mock expenses and earnings for testing"""
    from .label_artists import artists_store as artist_store
    
    now = datetime.utcnow().isoformat()
    last_month = (datetime.utcnow() - timedelta(days=30)).isoformat()
    two_months_ago = (datetime.utcnow() - timedelta(days=60)).isoformat()
    
    mock_expenses = [
        {"artist_id": 1, "amount": 800000, "description": "Initial advance", "expense_type": "advance", "date_incurred": two_months_ago},
        {"artist_id": 1, "amount": 50000, "description": "Music video - Gods Plan", "expense_type": "video", "date_incurred": last_month},
        {"artist_id": 1, "amount": 25000, "description": "Marketing campaign", "expense_type": "marketing", "date_incurred": last_month},
        {"artist_id": 2, "amount": 1200000, "description": "Initial advance", "expense_type": "advance", "date_incurred": two_months_ago},
        {"artist_id": 2, "amount": 75000, "description": "Studio time", "expense_type": "studio", "date_incurred": last_month},
        {"artist_id": 3, "amount": 450000, "description": "Initial advance", "expense_type": "advance", "date_incurred": two_months_ago},
        {"artist_id": 4, "amount": 600000, "description": "Initial advance", "expense_type": "advance", "date_incurred": two_months_ago},
    ]
    
    for exp in mock_expenses:
        if exp['artist_id'] in artist_store:
            expense_id = len(expenses_store) + 1
            expenses_store[expense_id] = {
                "id": expense_id,
                "artist_id": exp['artist_id'],
                "amount": exp['amount'],
                "description": exp['description'],
                "expense_type": exp['expense_type'],
                "date_incurred": exp['date_incurred'],
                "recouped": False,
                "created_at": now,
                "updated_at": now
            }
    
    mock_earnings = [
        {"artist_id": 1, "amount": 1250000, "source": "streaming", "period_start": last_month, "period_end": now, "notes": "Monthly streaming revenue"},
        {"artist_id": 2, "amount": 950000, "source": "streaming", "period_start": last_month, "period_end": now, "notes": "Monthly streaming revenue"},
        {"artist_id": 3, "amount": 750000, "source": "streaming", "period_start": last_month, "period_end": now, "notes": "Monthly streaming revenue"},
        {"artist_id": 4, "amount": 450000, "source": "streaming", "period_start": last_month, "period_end": now, "notes": "Monthly streaming revenue"},
    ]
    
    for earn in mock_earnings:
        if earn['artist_id'] in artist_store:
            earnings_id = len(earnings_store) + 1
            earnings_store[earnings_id] = {
                "id": earnings_id,
                "artist_id": earn['artist_id'],
                "amount": earn['amount'],
                "source": earn['source'],
                "period_start": earn['period_start'],
                "period_end": earn['period_end'],
                "notes": earn['notes'],
                "created_at": now,
                "updated_at": now
            }

# Seed mock data on startup
seed_mock_data()
