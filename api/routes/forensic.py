from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/forensic", tags=["forensic"])


class ForensicRequest(BaseModel):
    isrc: str


@router.post("/audit")
async def forensic_audit(request: ForensicRequest):
    """
    4-step forensic royalty audit:
    Probe → Verify → Streams → Detect Black Box
    """
    if not request.isrc:
        raise HTTPException(status_code=400, detail="ISRC required")
    try:
        from api.services.forensic_pipeline import run_forensic_audit
        clean = request.isrc.strip().replace("-", "").upper()
        result = await run_forensic_audit(clean)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
