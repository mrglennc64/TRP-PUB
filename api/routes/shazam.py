from fastapi import APIRouter
from api.db import database
from datetime import date, timedelta

router = APIRouter(prefix="/api/shazam", tags=["shazam"])

@router.get("/spikes")
async def get_recent_spikes(days: int = 7):
    """Get all tracks with recent Shazam spikes"""
    
    try:
        if not database.is_connected:
            await database.connect()
            
        cutoff = date.today() - timedelta(days=days)
        
        spikes = await database.fetch_all(
            """
            SELECT 
                s.shazam_id,
                st.track_id,
                st.title,
                st.artist,
                s.spike_date,
                s.spike_factor,
                s.current_count
            FROM shazam_spikes s
            LEFT JOIN shazam_tracks st ON s.shazam_id = st.shazam_id
            WHERE s.spike_date >= $1
            ORDER BY s.spike_factor DESC
            """,
            [cutoff]
        )
        
        return {"spikes": spikes}
    except Exception as e:
        return {"error": str(e), "spikes": []}

@router.get("/track/{track_id}")
async def get_track_shazam(track_id: str):
    """Get Shazam data for a specific track"""
    
    try:
        if not database.is_connected:
            await database.connect()
        
        shazam = await database.fetch_one(
            "SELECT shazam_id FROM shazam_tracks WHERE track_id = $1",
            [track_id]
        )
        
        if not shazam:
            return {"has_data": False}
        
        shazam_id = shazam["shazam_id"]
        
        # Get daily counts
        daily = await database.fetch_all(
            """
            SELECT date, count, rank, region
            FROM shazam_daily
            WHERE shazam_id = $1
            ORDER BY date DESC
            LIMIT 30
            """,
            [shazam_id]
        )
        
        # Get spikes
        spikes = await database.fetch_all(
            """
            SELECT spike_date, spike_factor
            FROM shazam_spikes
            WHERE shazam_id = $1
            ORDER BY spike_date DESC
            LIMIT 5
            """,
            [shazam_id]
        )
        
        total = sum(d["count"] for d in daily) if daily else 0
        
        return {
            "has_data": True,
            "shazam_id": shazam_id,
            "daily": daily,
            "spikes": spikes,
            "total": total
        }
    except Exception as e:
        return {"error": str(e), "has_data": False}

@router.get("/catalog")
async def get_catalog_shazam(artist_id: str):
    """Get Shazam data for an entire catalog"""
    
    try:
        if not database.is_connected:
            await database.connect()
        
        # Get all tracks for artist
        tracks = await database.fetch_all(
            """
            SELECT track_id, isrc
            FROM track_metadata
            WHERE artist_id = $1
            """,
            [artist_id]
        )
        
        if not tracks:
            return {"tracks": {}, "total_shazams": 0, "spike_count": 0, "timeline": {}}
        
        result = {
            "tracks": {},
            "total_shazams": 0,
            "spike_count": 0,
            "timeline": {}
        }
        
        for t in tracks:
            track_id = t["track_id"]
            
            # Get Shazam track mapping
            shazam = await database.fetch_one(
                "SELECT shazam_id FROM shazam_tracks WHERE track_id = $1",
                [track_id]
            )
            
            if not shazam:
                continue
                
            shazam_id = shazam["shazam_id"]
            
            # Get daily counts for last 30 days
            cutoff_30 = date.today() - timedelta(days=30)
            daily = await database.fetch_all(
                """
                SELECT date, count
                FROM shazam_daily
                WHERE shazam_id = $1
                  AND date >= $2
                ORDER BY date
                """,
                [shazam_id, cutoff_30]
            )
            
            # Check for spikes
            cutoff_14 = date.today() - timedelta(days=14)
            spike = await database.fetch_one(
                """
                SELECT 1 FROM shazam_spikes
                WHERE shazam_id = $1
                  AND spike_date >= $2
                LIMIT 1
                """,
                [shazam_id, cutoff_14]
            )
            
            # Calculate week-over-week change
            cutoff_7 = date.today() - timedelta(days=7)
            cutoff_14_ago = date.today() - timedelta(days=14)
            
            recent = [d for d in daily if d["date"] >= cutoff_7]
            previous = [d for d in daily if d["date"] < cutoff_7 and d["date"] >= cutoff_14_ago]
            
            recent_avg = sum(d["count"] for d in recent) / len(recent) if recent else 0
            prev_avg = sum(d["count"] for d in previous) / len(previous) if previous else 0
            
            week_change = ((recent_avg - prev_avg) / prev_avg * 100) if prev_avg > 0 else 0
            
            # Current count
            current = daily[-1]["count"] if daily else 0
            
            result["tracks"][track_id] = {
                "count": current,
                "week_change": round(week_change, 1),
                "has_spike": bool(spike),
                "daily": [{"date": d["date"].isoformat(), "count": d["count"]} for d in daily[-7:]]
            }
            
            result["total_shazams"] += current
            if spike:
                result["spike_count"] += 1
                
            # Build timeline
            for d in daily:
                date_str = d["date"].isoformat()
                if date_str not in result["timeline"]:
                    result["timeline"][date_str] = 0
                result["timeline"][date_str] += d["count"]
        
        return result
    except Exception as e:
        return {"error": str(e), "tracks": {}, "total_shazams": 0, "spike_count": 0}
