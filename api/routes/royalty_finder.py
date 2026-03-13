from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
import requests
from api.utils.musicbrainz_audit import perform_enhanced_audit, get_risk_color, get_risk_message
from api.utils.isrc_resolver import enhanced_audit_with_fallback

router = APIRouter(prefix="/api/royalty-finder", tags=["royalty-finder"])

class AuditRequest(BaseModel):
    isrc: Optional[str] = None
    artist: Optional[str] = None
    track: Optional[str] = None

class AuditResponse(BaseModel):
    score: int
    status: str
    risk_level: str
    risk_color: str
    summary: str
    estimated_loss: str
    flags: List[dict]
    revenue_impact: dict
    action_items: List[str]
    song_title: str
    artist: str
    mbid: Optional[str] = None
    recording_id: Optional[str] = None
    streaming_stats: dict
    isrc: str
    resolution: Optional[dict] = None

@router.get("/search/artist")
async def search_artist(
    query: str = Query(..., description="Artist name to search"),
    limit: int = Query(10, ge=1, le=100)
):
    """
    Search for artists in MusicBrainz database
    Returns real artist data including MBID, country, type
    """
    try:
        url = "https://musicbrainz.org/ws/2/artist"
        params = {
            "query": query,
            "fmt": "json",
            "limit": limit
        }
        
        response = requests.get(url, params=params)
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="MusicBrainz API error")
        
        data = response.json()
        
        artists = []
        for artist in data.get('artists', []):
            artists.append({
                "mbid": artist.get('id'),
                "name": artist.get('name'),
                "sort_name": artist.get('sort-name'),
                "type": artist.get('type', 'Unknown'),
                "country": artist.get('country', 'Unknown'),
                "disambiguation": artist.get('disambiguation', ''),
                "score": artist.get('score', 0),
                "life_span": artist.get('life-span', {})
            })
        
        return {
            "count": len(artists),
            "artists": artists
        }
        
    except ImportError:
        raise HTTPException(status_code=500, detail="requests library not installed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/audit", response_model=AuditResponse)
async def audit_track(request: AuditRequest):
    """
    Perform an enhanced metadata audit with detailed risk scoring
    Shows users exactly why they're losing money and how to fix it
    """
    try:
        # Validate ISRC is provided
        if not request.isrc:
            raise HTTPException(status_code=400, detail="ISRC is required for audit")
        
        # Use enhanced audit from musicbrainz_audit.py
        result = perform_enhanced_audit(request.isrc)
        
        # Check for errors
        if result["status"] == "ERROR":
            error_message = result.get("flags", [{}])[0].get("description", "Unknown error")
            raise HTTPException(status_code=500, detail=error_message)
        
        # Add color and message for UI
        result["color"] = get_risk_color(result["score"])
        result["message"] = get_risk_message(result["score"])
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/audit-smart", response_model=AuditResponse)
async def audit_track_smart(request: AuditRequest):
    """
    Smart audit with fallback logic:
    - Tries strict ISRC lookup
    - Falls back to artist/title search
    - Finds alternative versions
    - Handles multiple ISRCs for same song
    """
    try:
        if not request.isrc:
            raise HTTPException(status_code=400, detail="ISRC is required")
        
        result = await enhanced_audit_with_fallback(
            request.isrc, 
            request.artist, 
            request.track
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/validate-isrc")
async def validate_isrc(request: AuditRequest):
    """
    Comprehensive two-step ISRC validation:
    - Format check
    - Registry existence
    - MusicBrainz audit
    """
    try:
        if not request.isrc:
            raise HTTPException(status_code=400, detail="ISRC is required")
        
        from api.utils.isrc_validator import enhanced_isrc_audit
        result = await enhanced_isrc_audit(request.isrc)
        
        if result.get('error'):
            raise HTTPException(status_code=400, detail=result['message'])
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/artist/{mbid}/recordings")
async def get_artist_recordings(
    mbid: str,
    limit: int = Query(10, ge=1, le=50)
):
    """
    Fetch an artist's recordings from MusicBrainz, extracting ISRCs.
    Used to drill into an artist and run per-recording forensic audits.
    """
    try:
        url = f"https://musicbrainz.org/ws/2/recording"
        params = {
            "artist": mbid,
            "fmt": "json",
            "limit": limit,
            "inc": "isrcs",
        }
        headers = {"User-Agent": "TrapRoyaltiesPro/1.0 (contact@traproyaltiespro.com)"}
        r = requests.get(url, params=params, headers=headers, timeout=10)
        if r.status_code != 200:
            raise HTTPException(status_code=r.status_code, detail="SMPT API error")
        data = r.json()
        recordings = []
        for rec in data.get("recordings", []):
            isrcs = rec.get("isrcs", [])
            recordings.append({
                "id": rec.get("id"),
                "title": rec.get("title"),
                "length_ms": rec.get("length"),
                "isrcs": isrcs,
                "primary_isrc": isrcs[0] if isrcs else None,
            })
        return {"mbid": mbid, "count": len(recordings), "recordings": recordings}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/risk-categories")
async def get_risk_categories():
    """Return risk level categories for UI display"""
    return {
        "SECURE": {
            "range": "90-100", 
            "color": "green", 
            "message": "Metadata is complete. All royalty paths should be open."
        },
        "AT_RISK": {
            "range": "70-89", 
            "color": "yellow", 
            "message": "Missing identifiers detected. International royalties may be delayed."
        },
        "CRITICAL": {
            "range": "0-69", 
            "color": "red", 
            "message": "Critical issues found. Revenue leakage likely."
        }
    }
