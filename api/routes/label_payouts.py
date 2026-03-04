from fastapi import APIRouter, HTTPException, Query, BackgroundTasks, Request
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime, timedelta
import stripe
import os
import hmac
import hashlib
import json

router = APIRouter(prefix="/api/label", tags=["label"])

# Stripe configuration (set these in your environment variables)
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET')
STRIPE_CLIENT_ID = os.getenv('STRIPE_CLIENT_ID')

# In-memory storage (replace with database later)
payouts_store = {}
connected_accounts_store = {}
payment_batches_store = {}

# Pydantic models
class ConnectedAccountBase(BaseModel):
    artist_id: int
    artist_name: str
    stripe_account_id: str
    payout_method: str = "standard"  # 'standard' or 'express'
    payout_schedule: str = "monthly"  # 'monthly', 'quarterly', 'on-demand'
    payout_percentage: float = 100.0  # Percentage of earnings to pay out

class ConnectedAccountResponse(ConnectedAccountBase):
    id: int
    connected_at: str
    updated_at: str
    status: str  # 'active', 'pending', 'incomplete'
    payouts_enabled: bool
    charges_enabled: bool
    details_submitted: bool

class PayoutRequest(BaseModel):
    artist_ids: List[int]  # Empty list means all artists
    amount: Optional[float] = None  # If None, pays full available balance
    scheduled_date: Optional[str] = None  # For future scheduling
    description: str = "Royalty payout"

class PayoutBatch(BaseModel):
    id: str
    label_id: int
    artist_count: int
    total_amount: float
    currency: str = "usd"
    status: str  # 'pending', 'processing', 'completed', 'failed'
    created_at: str
    completed_at: Optional[str] = None
    payout_ids: List[str]

class SinglePayout(BaseModel):
    id: str
    artist_id: int
    artist_name: str
    amount: float
    currency: str = "usd"
    status: str  # 'pending', 'in_transit', 'paid', 'failed'
    stripe_transfer_id: Optional[str] = None
    created_at: str
    completed_at: Optional[str] = None
    failure_reason: Optional[str] = None

class PayoutSummary(BaseModel):
    total_artists: int
    total_payable: int
    total_pending: int
    total_balance: float
    total_payable_balance: float
    currency: str = "usd"
    estimated_fees: float

# Helper functions
def get_next_connected_account_id():
    return len(connected_accounts_store) + 1

def get_next_payout_id():
    return f"payout_{len(payouts_store) + 1}_{datetime.now().strftime('%Y%m%d')}"

def get_next_batch_id():
    return f"batch_{len(payment_batches_store) + 1}_{datetime.now().strftime('%Y%m%d')}"

def calculate_artist_balance(artist_id: int) -> float:
    """
    Calculate available balance for an artist (earnings - expenses - previous payouts)
    This would normally come from your database
    """
    # Mock implementation - replace with real data
    from .label_recoupment import earnings_store, expenses_store
    
    artist_earnings = sum(e['amount'] for e in earnings_store.values() if e.get('artist_id') == artist_id)
    artist_expenses = sum(e['amount'] for e in expenses_store.values() if e.get('artist_id') == artist_id)
    
    # Subtract previous payouts
    previous_payouts = sum(p['amount'] for p in payouts_store.values() 
                          if p.get('artist_id') == artist_id and p['status'] == 'paid')
    
    return artist_earnings - artist_expenses - previous_payouts

# API Endpoints
@router.post("/payouts/connect-account", response_model=ConnectedAccountResponse)
async def create_connected_account(account: ConnectedAccountBase):
    """
    Create or link a Stripe connected account for an artist
    """
    try:
        # Check if artist already has a connected account
        existing = [a for a in connected_accounts_store.values() if a.get('artist_id') == account.artist_id]
        if existing:
            raise HTTPException(status_code=400, detail="Artist already has a connected account")
        
        # Verify the Stripe account exists
        try:
            stripe_account = stripe.Account.retrieve(account.stripe_account_id)
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=f"Invalid Stripe account: {str(e)}")
        
        account_id = get_next_connected_account_id()
        now = datetime.utcnow().isoformat()
        
        account_data = {
            "id": account_id,
            "artist_id": account.artist_id,
            "artist_name": account.artist_name,
            "stripe_account_id": account.stripe_account_id,
            "payout_method": account.payout_method,
            "payout_schedule": account.payout_schedule,
            "payout_percentage": account.payout_percentage,
            "connected_at": now,
            "updated_at": now,
            "status": "active" if stripe_account.get('charges_enabled') else "pending",
            "payouts_enabled": stripe_account.get('payouts_enabled', False),
            "charges_enabled": stripe_account.get('charges_enabled', False),
            "details_submitted": stripe_account.get('details_submitted', False)
        }
        
        connected_accounts_store[account_id] = account_data
        return account_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/payouts/connect-accounts", response_model=List[ConnectedAccountResponse])
async def list_connected_accounts(
    label_id: int,
    status: Optional[str] = None
):
    """
    List all connected accounts for a label
    """
    try:
        # Filter by label_id (assuming artists belong to label)
        accounts = list(connected_accounts_store.values())
        
        if status:
            accounts = [a for a in accounts if a.get('status') == status]
        
        return accounts
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/payouts/create-batch", response_model=PayoutBatch)
async def create_payout_batch(
    background_tasks: BackgroundTasks,
    request: PayoutRequest,
    label_id: int
):
    """
    Create a mass payout batch for multiple artists
    """
    try:
        # Get all connected accounts for the label
        all_accounts = list(connected_accounts_store.values())
        
        # Filter by requested artist IDs
        if request.artist_ids:
            accounts_to_pay = [a for a in all_accounts if a['artist_id'] in request.artist_ids]
        else:
            accounts_to_pay = all_accounts
        
        if not accounts_to_pay:
            raise HTTPException(status_code=404, detail="No eligible artists found")
        
        # Calculate amounts for each artist
        payouts = []
        total_amount = 0
        
        for account in accounts_to_pay:
            # Get available balance
            available_balance = calculate_artist_balance(account['artist_id'])
            
            if available_balance <= 0:
                continue
            
            # Apply payout percentage
            payout_amount = available_balance * (account['payout_percentage'] / 100)
            
            # If specific amount requested, use that instead
            if request.amount:
                payout_amount = min(payout_amount, request.amount / len(accounts_to_pay))
            
            if payout_amount <= 0:
                continue
            
            payout_id = get_next_payout_id()
            now = datetime.utcnow().isoformat()
            
            payout_data = {
                "id": payout_id,
                "artist_id": account['artist_id'],
                "artist_name": account['artist_name'],
                "amount": payout_amount,
                "currency": "usd",
                "status": "pending",
                "stripe_transfer_id": None,
                "stripe_account_id": account['stripe_account_id'],
                "created_at": now,
                "completed_at": None,
                "failure_reason": None
            }
            
            payouts_store[payout_id] = payout_data
            payouts.append(payout_data)
            total_amount += payout_amount
        
        if not payouts:
            raise HTTPException(status_code=400, detail="No artists have available balance")
        
        # Create batch record
        batch_id = get_next_batch_id()
        now = datetime.utcnow().isoformat()
        
        batch_data = {
            "id": batch_id,
            "label_id": label_id,
            "artist_count": len(payouts),
            "total_amount": total_amount,
            "currency": "usd",
            "status": "pending",
            "created_at": now,
            "completed_at": None,
            "payout_ids": [p['id'] for p in payouts]
        }
        
        payment_batches_store[batch_id] = batch_data
        
        # Process payouts in background
        background_tasks.add_task(process_payout_batch, batch_id)
        
        return batch_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def process_payout_batch(batch_id: str):
    """
    Background task to process all payouts in a batch
    """
    try:
        batch = payment_batches_store.get(batch_id)
        if not batch:
            return
        
        batch['status'] = 'processing'
        successful_payouts = []
        failed_payouts = []
        
        for payout_id in batch['payout_ids']:
            payout = payouts_store.get(payout_id)
            if not payout:
                continue
            
            try:
                # Create a transfer to the connected account
                # Using Stripe Connect's destination charges model 
                transfer = stripe.Transfer.create(
                    amount=int(payout['amount'] * 100),  # Convert to cents
                    currency=payout['currency'],
                    destination=payout['stripe_account_id'],
                    transfer_group=f"batch_{batch_id}",
                    metadata={
                        "artist_id": payout['artist_id'],
                        "artist_name": payout['artist_name'],
                        "batch_id": batch_id
                    }
                )
                
                payout['status'] = 'paid'
                payout['stripe_transfer_id'] = transfer.id
                payout['completed_at'] = datetime.utcnow().isoformat()
                successful_payouts.append(payout)
                
            except stripe.error.StripeError as e:
                payout['status'] = 'failed'
                payout['failure_reason'] = str(e)
                failed_payouts.append(payout)
            
            payouts_store[payout_id] = payout
        
        # Update batch status
        if failed_payouts:
            batch['status'] = 'partially_completed' if successful_payouts else 'failed'
        else:
            batch['status'] = 'completed'
        
        batch['completed_at'] = datetime.utcnow().isoformat()
        payment_batches_store[batch_id] = batch
        
    except Exception as e:
        print(f"Error processing batch {batch_id}: {e}")
        if batch:
            batch['status'] = 'failed'
            payment_batches_store[batch_id] = batch

@router.get("/payouts/batches", response_model=List[PayoutBatch])
async def list_payout_batches(
    label_id: int,
    status: Optional[str] = None,
    limit: int = Query(10, ge=1, le=100)
):
    """
    List all payout batches for a label
    """
    try:
        batches = [b for b in payment_batches_store.values() if b.get('label_id') == label_id]
        batches.sort(key=lambda x: x['created_at'], reverse=True)
        
        if status:
            batches = [b for b in batches if b['status'] == status]
        
        return batches[:limit]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/payouts/batches/{batch_id}", response_model=PayoutBatch)
async def get_payout_batch(batch_id: str):
    """
    Get details of a specific payout batch
    """
    try:
        if batch_id not in payment_batches_store:
            raise HTTPException(status_code=404, detail="Batch not found")
        
        return payment_batches_store[batch_id]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/payouts/artists/{artist_id}/history", response_model=List[SinglePayout])
async def get_artist_payout_history(artist_id: int, limit: int = Query(10, le=100)):
    """
    Get payout history for a specific artist
    """
    try:
        artist_payouts = [p for p in payouts_store.values() if p.get('artist_id') == artist_id]
        artist_payouts.sort(key=lambda x: x['created_at'], reverse=True)
        
        return artist_payouts[:limit]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/payouts/summary", response_model=PayoutSummary)
async def get_payout_summary(label_id: int):
    """
    Get summary of payout status for all artists
    """
    try:
        accounts = list(connected_accounts_store.values())
        
        total_balance = 0
        total_payable_balance = 0
        total_payable = 0
        
        for account in accounts:
            balance = calculate_artist_balance(account['artist_id'])
            total_balance += balance
            
            if balance > 0 and account['status'] == 'active':
                total_payable += 1
                total_payable_balance += balance * (account['payout_percentage'] / 100)
        
        # Calculate Stripe fees (approximately 2.9% + $0.30 per payout) 
        estimated_fees = (total_payable_balance * 0.029) + (total_payable * 0.30)
        
        return {
            "total_artists": len(accounts),
            "total_payable": total_payable,
            "total_pending": len(accounts) - total_payable,
            "total_balance": total_balance,
            "total_payable_balance": total_payable_balance,
            "currency": "usd",
            "estimated_fees": estimated_fees
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/payouts/webhook")
async def stripe_webhook(request: Request):
    """
    Handle Stripe webhook events for payout updates
    """
    try:
        payload = await request.body()
        sig_header = request.headers.get('stripe-signature')
        
        if not STRIPE_WEBHOOK_SECRET:
            return {"status": "ignored", "message": "Webhook secret not configured"}
        
        # Verify webhook signature
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Handle different event types
        if event['type'] == 'transfer.paid':
            transfer = event['data']['object']
            # Update payout status in your database
            for payout_id, payout in payouts_store.items():
                if payout.get('stripe_transfer_id') == transfer['id']:
                    payout['status'] = 'paid'
                    payout['completed_at'] = datetime.utcnow().isoformat()
                    payouts_store[payout_id] = payout
                    break
        
        elif event['type'] == 'transfer.failed':
            transfer = event['data']['object']
            for payout_id, payout in payouts_store.items():
                if payout.get('stripe_transfer_id') == transfer['id']:
                    payout['status'] = 'failed'
                    payout['failure_reason'] = transfer.get('failure_message', 'Unknown error')
                    payouts_store[payout_id] = payout
                    break
        
        return {"status": "success", "received": True}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Seed mock data for testing
def seed_mock_payouts():
    """Add some mock data for testing"""
    now = datetime.utcnow().isoformat()
    
    mock_accounts = [
        {
            "artist_id": 1,
            "artist_name": "Drake",
            "stripe_account_id": "acct_mock_1",
            "payout_method": "standard",
            "payout_schedule": "monthly",
            "payout_percentage": 100,
            "status": "active",
            "payouts_enabled": True,
            "charges_enabled": True,
            "details_submitted": True
        },
        {
            "artist_id": 2,
            "artist_name": "Travis Scott",
            "stripe_account_id": "acct_mock_2",
            "payout_method": "express",
            "payout_schedule": "quarterly",
            "payout_percentage": 100,
            "status": "active",
            "payouts_enabled": True,
            "charges_enabled": True,
            "details_submitted": True
        }
    ]
    
    for account in mock_accounts:
        account_id = get_next_connected_account_id()
        account_data = {
            "id": account_id,
            **account,
            "connected_at": now,
            "updated_at": now
        }
        connected_accounts_store[account_id] = account_data

# Seed mock data on startup
seed_mock_payouts()
