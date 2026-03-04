from fastapi import APIRouter
from api.db import database
from datetime import date, timedelta

router = APIRouter(prefix="/api/test", tags=["test"])

@router.get("/db")
async def test_db():
    try:
        if not database.is_connected:
            await database.connect()
        result = await database.fetch_one("SELECT 1 as test")
        return {"status": "connected", "result": result["test"] if result else None}
    except Exception as e:
        return {"status": "error", "error": str(e)}

@router.get("/shazam-simple")
async def test_shazam_simple():
    try:
        if not database.is_connected:
            await database.connect()
        result = await database.fetch_one("SELECT COUNT(*) as count FROM shazam_tracks")
        return {"status": "ok", "count": result["count"] if result else 0}
    except Exception as e:
        return {"status": "error", "error": str(e)}
