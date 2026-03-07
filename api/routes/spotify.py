from fastapi import APIRouter
from api.db import database

router = APIRouter(prefix="/api/spotify", tags=["spotify"])

@router.get("/stats")
async def get_spotify_stats():
    """Get overall Spotify stats"""
    try:
        if not database.is_connected:
            await database.connect()
        
        # Simple test query
        result = await database.fetch_one("SELECT 1 as test")
        return {
            "status": "connected",
            "test": result["test"] if result else None,
            "total_playlists": 0,
            "total_tracks": 0,
            "avg_popularity": 0,
            "recent_adds": 0
        }
    except Exception as e:
        return {"error": str(e)}

@router.get("/playlists")
async def get_playlists():
    """Get all tracked playlists"""
    try:
        if not database.is_connected:
            await database.connect()
        
        playlists = await database.fetch_all("SELECT * FROM tracked_playlists LIMIT 5")
        return {"playlists": playlists}
    except Exception as e:
        return {"error": str(e), "playlists": []}

@router.get("/tracks")
async def get_tracks():
    """Get track popularity data with leak detection"""
    try:
        if not database.is_connected:
            await database.connect()
        
        tracks = await database.fetch_all("""
            SELECT 
                tm.track_id,
                tm.title as name,
                tm.artist,
                tm.popularity,
                COUNT(DISTINCT pt.playlist_id) as playlist_count,
                SUM(CASE WHEN pt.date_added >= NOW() - INTERVAL '30 days' THEN 1 ELSE 0 END) as recent_adds
            FROM track_metadata tm
            LEFT JOIN playlist_tracks pt ON tm.track_id = pt.track_id
            GROUP BY tm.track_id, tm.title, tm.artist, tm.popularity
            ORDER BY tm.popularity DESC
            LIMIT 20
        """)
        
        return {"tracks": tracks}
    except Exception as e:
        print(f"Error in tracks endpoint: {e}")
        return {"tracks": [], "error": str(e)}
