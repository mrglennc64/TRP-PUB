# /root/traproyalties-new/api/routes/royalty_finder.py

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import logging
import os
import requests
from sqlalchemy.orm import Session
from datetime import datetime

# Import from our models
from api.models.isrc_mapping import get_db, ISRCMapping, ISRCAudit, ISRCMismatch, init_isrc_mappings_db

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize database - call without arguments to use the global engine
try:
    init_isrc_mappings_db()
    logger.info("✅ ISRC mappings database initialized")
except Exception as e:
    logger.error(f"❌ Failed to initialize ISRC mappings database: {e}")
    # Continue - the app might still work

router = APIRouter(prefix="/api/royalty-finder", tags=["royalty-finder"])

# Request/Response models
class ISRCLookupRequest(BaseModel):
    isrc: str
    source: Optional[str] = "api_request"

class ISRCLookupResponse(BaseModel):
    isrc: str
    track_title: Optional[str] = None
    artist_name: Optional[str] = None
    album_name: Optional[str] = None
    work_id: Optional[str] = None
    composers: Optional[str] = None
    publishers: Optional[str] = None
    source: str
    confidence: int
    verified: bool
    found: bool
    message: Optional[str] = None

class ISRCMismatchReport(BaseModel):
    isrc: str
    source_a: str
    source_b: str
    data_a: Dict[str, Any]
    data_b: Dict[str, Any]
    notes: Optional[str] = None

# MusicBrainz API integration
def lookup_musicbrainz(isrc: str) -> Dict[str, Any]:
    """Look up ISRC in MusicBrainz database"""
    try:
        # MusicBrainz API endpoint
        url = f"https://musicbrainz.org/ws/2/recording/?query=isrc:{isrc}&fmt=json"
        
        headers = {
            'User-Agent': 'TrapRoyaltiesPro/1.0 (contact@traproyaltiespro.com)'
        }
        
        logger.info(f"🔍 Looking up ISRC {isrc} in MusicBrainz")
        logger.info(f"URL: {url}")
        
        response = requests.get(url, headers=headers, timeout=10)
        logger.info(f"Response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            logger.info(f"Response keys: {data.keys()}")
            
            # The recordings are directly in the 'recordings' key
            recordings = data.get('recordings', [])
            logger.info(f"Found {len(recordings)} recordings")
            
            if recordings:
                recording = recordings[0]
                logger.info(f"First recording: {recording.get('title')}")
                
                # Extract artist name properly
                artist_name = None
                if recording.get('artist-credit'):
                    artist_credit = recording['artist-credit'][0]
                    if isinstance(artist_credit, dict):
                        artist_name = artist_credit.get('name') or artist_credit.get('artist', {}).get('name')
                
                # Get the first ISRC from the list
                isrcs = recording.get('isrcs', [])
                first_isrc = isrcs[0] if isrcs else isrc
                
                # Get release/album info if available
                album_name = None
                releases = recording.get('releases', [])
                if releases:
                    album_name = releases[0].get('title')
                
                # Get work ID if available
                work_id = None
                works = recording.get('works', [])
                if works:
                    work_id = works[0].get('id')
                
                result = {
                    'found': True,
                    'track_title': recording.get('title'),
                    'artist_name': artist_name,
                    'album_name': album_name,
                    'work_id': work_id,
                    'isrc': first_isrc,
                    'source': 'musicbrainz',
                    'confidence': 90,
                    'raw_data': recording
                }
                logger.info(f"✅ Found track: {result['track_title']} by {result['artist_name']}")
                return result
            else:
                logger.info(f"No recordings found for ISRC {isrc}")
        else:
            logger.error(f"MusicBrainz API error: {response.status_code}")
            logger.error(f"Response text: {response.text[:200]}")
        
        return {
            'found': False,
            'source': 'musicbrainz',
            'confidence': 0
        }
    except Exception as e:
        logger.error(f"MusicBrainz lookup error for ISRC {isrc}: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return {
            'found': False,
            'source': 'musicbrainz',
            'confidence': 0,
            'error': str(e)
        }

# Check local database first
def lookup_local_db(db: Session, isrc: str) -> Optional[ISRCMapping]:
    """Check if ISRC exists in local database"""
    try:
        return db.query(ISRCMapping).filter(ISRCMapping.isrc == isrc).first()
    except Exception as e:
        logger.error(f"Local DB lookup error for ISRC {isrc}: {e}")
        return None

# Save to local database
def save_to_local_db(db: Session, isrc: str, data: Dict[str, Any], source: str):
    """Save or update ISRC mapping in local database"""
    try:
        mapping = db.query(ISRCMapping).filter(ISRCMapping.isrc == isrc).first()
        
        if mapping:
            # Update existing
            mapping.track_title = data.get('track_title', mapping.track_title)
            mapping.artist_name = data.get('artist_name', mapping.artist_name)
            mapping.album_name = data.get('album_name', mapping.album_name)
            mapping.work_id = data.get('work_id', mapping.work_id)
            mapping.composers = data.get('composers', mapping.composers)
            mapping.publishers = data.get('publishers', mapping.publishers)
            mapping.source = source
            mapping.confidence = data.get('confidence', mapping.confidence)
            mapping.updated_at = datetime.utcnow()
        else:
            # Create new
            mapping = ISRCMapping(
                isrc=isrc,
                track_title=data.get('track_title'),
                artist_name=data.get('artist_name'),
                album_name=data.get('album_name'),
                work_id=data.get('work_id'),
                composers=data.get('composers'),
                publishers=data.get('publishers'),
                source=source,
                confidence=data.get('confidence', 70),
                verified=False
            )
            db.add(mapping)
        
        db.commit()
        
        # Create audit log
        audit = ISRCAudit(
            isrc=isrc,
            audit_type='lookup',
            new_data=str(data),
            notes=f"Looked up via {source}"
        )
        db.add(audit)
        db.commit()
        
        return mapping
    except Exception as e:
        logger.error(f"Error saving to local DB for ISRC {isrc}: {e}")
        db.rollback()
        return None

# ==================== ENDPOINTS WITH ROUTER DECORATORS ====================

@router.post("/lookup", response_model=ISRCLookupResponse)
async def lookup_isrc(request: ISRCLookupRequest, db: Session = Depends(get_db)):
    """Look up ISRC information from various sources"""
    logger.info(f"Looking up ISRC: {request.isrc}")
    
    # First check local database
    local_result = lookup_local_db(db, request.isrc)
    if local_result:
        logger.info(f"Found ISRC {request.isrc} in local database")
        return ISRCLookupResponse(
            isrc=local_result.isrc,
            track_title=local_result.track_title,
            artist_name=local_result.artist_name,
            album_name=local_result.album_name,
            work_id=local_result.work_id,
            composers=local_result.composers,
            publishers=local_result.publishers,
            source=local_result.source,
            confidence=local_result.confidence,
            verified=local_result.verified,
            found=True,
            message="Retrieved from local database"
        )
    
    # If not in local DB, try MusicBrainz
    logger.info(f"ISRC {request.isrc} not in local DB, trying MusicBrainz")
    mb_result = lookup_musicbrainz(request.isrc)
    
    if mb_result['found']:
        # Save to local database
        saved = save_to_local_db(db, request.isrc, mb_result, 'musicbrainz')
        
        if saved:
            return ISRCLookupResponse(
                isrc=saved.isrc,
                track_title=saved.track_title,
                artist_name=saved.artist_name,
                album_name=saved.album_name,
                work_id=saved.work_id,
                composers=saved.composers,
                publishers=saved.publishers,
                source='musicbrainz',
                confidence=saved.confidence,
                verified=False,
                found=True,
                message="Retrieved from MusicBrainz and saved to local database"
            )
    
    # Not found anywhere
    return ISRCLookupResponse(
        isrc=request.isrc,
        source='none',
        confidence=0,
        verified=False,
        found=False,
        message="ISRC not found in any database"
    )

@router.post("/audit", response_model=ISRCLookupResponse)
async def audit_isrc(request: ISRCLookupRequest, db: Session = Depends(get_db)):
    """Alias for lookup - maintains compatibility with frontend"""
    logger.info(f"Audit request for ISRC: {request.isrc}")
    return await lookup_isrc(request, db)

@router.post("/mismatch/report")
async def report_mismatch(report: ISRCMismatchReport, db: Session = Depends(get_db)):
    """Report an ISRC mismatch between sources"""
    try:
        mismatch = ISRCMismatch(
            isrc=report.isrc,
            source_a=report.source_a,
            source_b=report.source_b,
            data_a=str(report.data_a),
            data_b=str(report.data_b),
            notes=report.notes,
            resolved=False
        )
        db.add(mismatch)
        db.commit()
        
        # Also create audit
        audit = ISRCAudit(
            isrc=report.isrc,
            audit_type='mismatch_report',
            notes=f"Mismatch reported between {report.source_a} and {report.source_b}"
        )
        db.add(audit)
        db.commit()
        
        return {
            "status": "success",
            "message": "Mismatch reported successfully",
            "mismatch_id": mismatch.id
        }
    except Exception as e:
        logger.error(f"Error reporting mismatch: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search/{isrc}")
async def search_isrc(isrc: str, db: Session = Depends(get_db)):
    """Simplified GET endpoint for ISRC lookup"""
    request = ISRCLookupRequest(isrc=isrc)
    return await lookup_isrc(request, db)

@router.get("/test/{isrc}")
async def test_musicbrainz(isrc: str):
    """Test endpoint to directly query MusicBrainz"""
    result = lookup_musicbrainz(isrc)
    return result
