from fastapi import APIRouter, HTTPException
from typing import Optional

router = APIRouter()

# In-memory storage for handshakes (replace with database in production)
handshakes = {}

@router.post("/api/digital-handshake/create")
async def create_handshake(
    track_name: str,
    artist: str,
    recipient_email: str,
    percentage: float,
    message: Optional[str] = None
):
    """
    Create a new digital handshake request
    """
    import uuid
    from datetime import datetime
    
    handshake_id = str(uuid.uuid4())
    handshake = {
        "id": handshake_id,
        "track_name": track_name,
        "artist": artist,
        "recipient_email": recipient_email,
        "percentage": percentage,
        "message": message,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat(),
        "verified_at": None
    }
    
    handshakes[handshake_id] = handshake
    
    # TODO: Send email to recipient with verification link
    
    return {
        "success": True,
        "handshake_id": handshake_id,
        "message": "Digital handshake created successfully"
    }

@router.get("/api/digital-handshake/verify/{handshake_id}")
async def verify_handshake(handshake_id: str):
    """
    Verify a digital handshake
    """
    if handshake_id not in handshakes:
        raise HTTPException(status_code=404, detail="Handshake not found")
    
    handshake = handshakes[handshake_id]
    
    if handshake["status"] == "verified":
        return {
            "success": True,
            "message": "Handshake already verified",
            "handshake": handshake
        }
    
    from datetime import datetime
    handshake["status"] = "verified"
    handshake["verified_at"] = datetime.utcnow().isoformat()
    
    return {
        "success": True,
        "message": "Digital handshake verified successfully",
        "handshake": handshake
    }

@router.get("/api/digital-handshake/status/{handshake_id}")
async def get_handshake_status(handshake_id: str):
    """
    Get the status of a digital handshake
    """
    if handshake_id not in handshakes:
        raise HTTPException(status_code=404, detail="Handshake not found")
    
    return {
        "success": True,
        "handshake": handshakes[handshake_id]
    }

@router.get("/api/digital-handshake/list")
async def list_handshakes(email: Optional[str] = None):
    """
    List all digital handshakes, optionally filter by email
    """
    if email:
        filtered = [
            h for h in handshakes.values() 
            if h["recipient_email"] == email
        ]
        return {
            "success": True,
            "handshakes": filtered,
            "count": len(filtered)
        }
    
    return {
        "success": True,
        "handshakes": list(handshakes.values()),
        "count": len(handshakes)
    }

@router.get("/api/digital-handshake/health")
async def handshake_health():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "service": "digital-handshake",
        "handshakes_count": len(handshakes)
    }
