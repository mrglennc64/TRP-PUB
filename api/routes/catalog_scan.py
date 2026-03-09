"""
Catalog Scan — Batch Forensic Audit
Accepts up to 25 ISRCs, runs the forensic pipeline in parallel,
returns a Catalog Health Score + ranked claims sorted by estimated revenue.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import asyncio

router = APIRouter(prefix="/api/catalog-scan", tags=["catalog-scan"])


class CatalogScanRequest(BaseModel):
    isrcs: List[str]
    label: Optional[str] = None  # Optional client/catalog label for the report


@router.post("/scan")
async def scan_catalog(request: CatalogScanRequest):
    if not request.isrcs:
        raise HTTPException(status_code=400, detail="No ISRCs provided")
    if len(request.isrcs) > 25:
        raise HTTPException(status_code=400, detail="Maximum 25 ISRCs per scan. Use batch mode for larger catalogs.")

    from api.services.forensic_pipeline import run_forensic_audit

    # Normalize ISRCs
    isrcs = [i.strip().replace("-", "").upper() for i in request.isrcs if i.strip()]
    isrcs = list(dict.fromkeys(isrcs))  # deduplicate while preserving order

    # Run all audits in parallel
    tasks = [run_forensic_audit(isrc) for isrc in isrcs]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    tracks = []
    total_estimated = 0
    at_risk_count = 0
    actionable_count = 0
    black_box_count = 0

    for i, result in enumerate(results):
        if isinstance(result, Exception):
            tracks.append({
                "isrc": isrcs[i],
                "status": "error",
                "error": str(result),
                "song_title": "—",
                "artist": "—",
                "verdict_level": "ERROR",
                "verdict_color": "grey",
                "black_box": False,
                "mlc_matched": False,
                "listens": 0,
                "estimated_revenue": 0,
                "has_iswc": False,
                "findings_count": 0,
                "critical_count": 0,
            })
            continue

        steps = result.get("steps", {})
        streaming = steps.get("detect", {}).get("streaming", {})
        listens = streaming.get("total_listens", 0)
        estimated = round(listens * 0.003)
        verdict = result.get("verdict", {})
        black_box = steps.get("detect", {}).get("black_box", False)
        mlc_matched = steps.get("verify", {}).get("matched", False)
        findings = steps.get("detect", {}).get("findings", [])

        probe_data = steps.get("probe", {}).get("data", {}) or {}
        verify_data = steps.get("verify", {}) or {}
        has_iswc = bool(probe_data.get("iswc") or verify_data.get("iswc"))

        is_at_risk = verdict.get("color") in ("red", "yellow")
        is_actionable = not mlc_matched and listens > 0

        if is_at_risk:
            at_risk_count += 1
        if is_actionable:
            actionable_count += 1
            total_estimated += estimated
        if black_box:
            black_box_count += 1

        tracks.append({
            "isrc": isrcs[i],
            "status": "ok",
            "song_title": result.get("song_title", "Unknown"),
            "artist": result.get("artist", "Unknown"),
            "verdict_level": verdict.get("level"),
            "verdict_color": verdict.get("color"),
            "black_box": black_box,
            "mlc_matched": mlc_matched,
            "listens": listens,
            "estimated_revenue": estimated,
            "has_iswc": has_iswc,
            "findings_count": len(findings),
            "critical_count": sum(1 for f in findings if f.get("severity") == "critical"),
        })

    # Sort: black box + highest revenue first
    tracks.sort(key=lambda t: (t["black_box"], t["estimated_revenue"]), reverse=True)

    total = len(tracks)
    exposure_rate = round((at_risk_count / total) * 100) if total > 0 else 0
    health_score = max(0, 100 - exposure_rate)

    return {
        "label": request.label or "Unnamed Catalog",
        "total_tracks": total,
        "health_score": health_score,
        "leakage_total": total_estimated,
        "exposure_rate": exposure_rate,
        "actionable_claims": actionable_count,
        "black_box_count": black_box_count,
        "tracks": tracks,
    }
