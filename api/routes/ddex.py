"""
DDEX API Routes for TrapRoyaltiesPro.

Endpoints:
  POST /api/ddex/generate         - Generate ERN XML from release data
  POST /api/ddex/validate         - Validate ERN XML
  POST /api/ddex/import-dsr       - Import & verify a DSR file
  GET  /api/ddex/releases         - List generated DDEX releases
  GET  /api/ddex/releases/{id}    - Get a specific release + XML
  GET  /api/ddex/deliveries       - List deliveries
  POST /api/ddex/from-handshake/{handshake_id}  - Generate from existing handshake
  POST /api/ddex/from-splits/{agreement_id}     - Generate from split agreement
"""

import uuid
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import APIRouter, HTTPException, UploadFile, File, Query
from fastapi.responses import Response

from api.ddex.generator import DDEXGenerator
from api.ddex.parser import DSRParser, DSRVerifier
from api.ddex.validator import validate_ern, validate_release_data
from api.models.ddex_release import (
    DDEXReleaseInput,
    DDEXReleaseRecord,
    DDEXDelivery,
    DSRImportResult,
    DDEXGenerateResponse,
    DSRVerifyResponse,
)

router = APIRouter(prefix="/api/ddex", tags=["ddex"])

# In-memory stores (replace with DB in production)
_releases: Dict[str, dict] = {}
_release_xml: Dict[str, str] = {}
_deliveries: Dict[str, dict] = {}
_dsr_imports: Dict[str, dict] = {}


# ------------------------------------------------------------------
# Generate DDEX ERN
# ------------------------------------------------------------------

@router.post("/generate", response_model=DDEXGenerateResponse)
async def generate_ddex(
    release_input: DDEXReleaseInput,
    include_xml: bool = Query(False, description="Include full XML in response"),
):
    """
    Generate a DDEX ERN XML message from release data.
    Validates input, generates XML, hashes it, stores for retrieval.
    """
    # Validate input
    data = release_input.dict()
    is_valid, errors = validate_release_data(data)
    if not is_valid:
        return DDEXGenerateResponse(
            success=False,
            message_id="",
            hash="",
            version=release_input.version,
            generated_at=datetime.utcnow().isoformat(),
            validation_errors=errors,
        )

    # Normalise territory deals from Pydantic models to dicts
    if data.get("territory_deals"):
        data["territory_deals"] = {
            k: v if isinstance(v, dict) else v.dict()
            for k, v in data["territory_deals"].items()
        }

    generator = DDEXGenerator(version=release_input.version)
    result = generator.generate(data)

    release_id = str(uuid.uuid4())
    record = {
        "id": release_id,
        "release_title": release_input.title,
        "artist": release_input.artist,
        "label_id": release_input.label_id,
        "message_id": result["message_id"],
        "version": result["version"],
        "xml_hash": result["hash"],
        "generated_at": result["generated_at"],
        "delivery_status": "pending",
        "handshake_id": release_input.handshake_id,
        "split_agreement_id": release_input.split_agreement_id,
    }

    _releases[release_id] = record
    _release_xml[release_id] = result["xml"]

    return DDEXGenerateResponse(
        success=True,
        message_id=result["message_id"],
        hash=result["hash"],
        version=result["version"],
        generated_at=result["generated_at"],
        xml=result["xml"] if include_xml else None,
        validation_errors=[],
    )


# ------------------------------------------------------------------
# Download XML for a stored release
# ------------------------------------------------------------------

@router.get("/releases/{release_id}/xml")
async def download_release_xml(release_id: str):
    """Download the DDEX ERN XML file for a stored release."""
    if release_id not in _releases:
        raise HTTPException(404, "Release not found")
    xml = _release_xml.get(release_id, "")
    filename = f"{_releases[release_id].get('release_title', release_id)}_ddex.xml"
    filename = filename.replace(" ", "_")
    return Response(
        content=xml,
        media_type="application/xml",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


# ------------------------------------------------------------------
# Validate ERN XML
# ------------------------------------------------------------------

@router.post("/validate")
async def validate_ddex_xml(file: UploadFile = File(...)):
    """Validate an uploaded DDEX ERN XML file."""
    raw = await file.read()
    xml_str = raw.decode("utf-8", errors="replace")
    is_valid, errors = validate_ern(xml_str)
    return {
        "valid": is_valid,
        "errors": errors,
        "filename": file.filename,
    }


# ------------------------------------------------------------------
# Import DSR (Digital Sales Report)
# ------------------------------------------------------------------

@router.post("/import-dsr", response_model=DSRVerifyResponse)
async def import_dsr(
    file: UploadFile = File(...),
    label_id: str = Query(..., description="Your label ID"),
):
    """
    Import a DDEX DSR file from a DSP and cross-check against split agreements.
    Returns discrepancies with court-admissible verification hash.
    """
    raw = await file.read()
    tmp_path = f"/tmp/dsr_{uuid.uuid4()}.xml"

    try:
        with open(tmp_path, "wb") as f:
            f.write(raw)

        parser = DSRParser()
        report = parser.parse_file(tmp_path)

        # Load splits for this label from in-memory store (replace with DB)
        splits_by_isrc = _load_splits_for_label(label_id)

        verifier = DSRVerifier()
        result = verifier.verify(report, splits_by_isrc, label_id)

        # Store import record
        import_id = str(uuid.uuid4())
        _dsr_imports[import_id] = {
            "id": import_id,
            "label_id": label_id,
            **result,
            "imported_at": datetime.utcnow().isoformat(),
            "filename": file.filename,
        }

        return DSRVerifyResponse(
            success=True,
            **result,
        )

    except Exception as e:
        raise HTTPException(500, f"DSR import failed: {str(e)}")
    finally:
        import os
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


# ------------------------------------------------------------------
# List releases
# ------------------------------------------------------------------

@router.get("/releases")
async def list_releases(
    label_id: Optional[str] = None,
    limit: int = Query(50, le=200),
):
    """List all generated DDEX releases."""
    releases = list(_releases.values())
    if label_id:
        releases = [r for r in releases if r.get("label_id") == label_id]
    releases.sort(key=lambda r: r.get("generated_at", ""), reverse=True)
    return {"releases": releases[:limit], "total": len(releases)}


@router.get("/releases/{release_id}")
async def get_release(release_id: str):
    """Get a specific DDEX release record."""
    if release_id not in _releases:
        raise HTTPException(404, "Release not found")
    return _releases[release_id]


# ------------------------------------------------------------------
# Deliveries
# ------------------------------------------------------------------

@router.get("/deliveries")
async def list_deliveries(label_id: Optional[str] = None):
    """List all DSP deliveries."""
    deliveries = list(_deliveries.values())
    if label_id:
        release_ids = {r["id"] for r in _releases.values() if r.get("label_id") == label_id}
        deliveries = [d for d in deliveries if d.get("release_id") in release_ids]
    return {"deliveries": deliveries, "total": len(deliveries)}


@router.post("/deliveries/{release_id}/mark-sent")
async def mark_delivery_sent(release_id: str, dsp: str = Query(...)):
    """Mark a release as sent to a DSP."""
    if release_id not in _releases:
        raise HTTPException(404, "Release not found")

    delivery_id = str(uuid.uuid4())
    delivery = {
        "id": delivery_id,
        "release_id": release_id,
        "dsp": dsp,
        "delivery_method": "Manual",
        "status": "sent",
        "sent_at": datetime.utcnow().isoformat(),
        "confirmed_at": None,
        "rejection_reason": None,
        "retry_count": 0,
    }
    _deliveries[delivery_id] = delivery
    _releases[release_id]["delivery_status"] = "sent"

    return {"success": True, "delivery": delivery}


# ------------------------------------------------------------------
# Generate from existing handshake / split agreement
# ------------------------------------------------------------------

@router.post("/from-handshake/{handshake_id}")
async def generate_from_handshake(
    handshake_id: str,
    extra: DDEXReleaseInput,
):
    """
    Generate DDEX ERN from an existing Digital Handshake.
    Pulls party/contributor data from the handshake and merges with provided release info.
    """
    # In production, load handshake from DB.
    # Here we merge handshake_id into the extra data.
    extra.handshake_id = handshake_id

    # Build contributor data from handshake fields if supplied
    data = extra.dict()
    data["territory_deals"] = {
        k: v if isinstance(v, dict) else v.dict()
        for k, v in (extra.territory_deals or {}).items()
    }

    is_valid, errors = validate_release_data(data)
    if not is_valid:
        raise HTTPException(400, {"errors": errors})

    generator = DDEXGenerator(version=extra.version)
    result = generator.generate(data)

    release_id = str(uuid.uuid4())
    _releases[release_id] = {
        "id": release_id,
        "release_title": extra.title,
        "artist": extra.artist,
        "label_id": extra.label_id,
        "message_id": result["message_id"],
        "version": result["version"],
        "xml_hash": result["hash"],
        "generated_at": result["generated_at"],
        "delivery_status": "pending",
        "handshake_id": handshake_id,
    }
    _release_xml[release_id] = result["xml"]

    return {
        "success": True,
        "release_id": release_id,
        "message_id": result["message_id"],
        "hash": result["hash"],
        "generated_at": result["generated_at"],
    }


# ------------------------------------------------------------------
# DSR import list
# ------------------------------------------------------------------

@router.get("/dsr-imports")
async def list_dsr_imports(label_id: Optional[str] = None):
    """List all DSR import results."""
    imports = list(_dsr_imports.values())
    if label_id:
        imports = [i for i in imports if i.get("label_id") == label_id]
    imports.sort(key=lambda i: i.get("imported_at", ""), reverse=True)
    return {"imports": imports, "total": len(imports)}


# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------

def _load_splits_for_label(label_id: str) -> Dict[str, List[dict]]:
    """
    Load split agreements indexed by ISRC for a given label.
    In production this would query the splits database table.
    Returns { isrc: [{ role, percentage, party_id }] }
    """
    # Placeholder: return empty dict. In production, query DB.
    return {}
