# File: services/traction_score_with_shazam.py

from db import database
from datetime import date, timedelta

EDITORIAL_WEIGHT = 5
ALGO_WEIGHT = 3
USER_WEIGHT = 1
FOLLOWER_WEIGHT = 0.0001
VELOCITY_WEIGHT = 2
SHAZAM_WEIGHT = 0.3  # New Shazam weight

async def get_shazam_index(track_id, days=30):
    """Calculate Shazam index for a track (0-100)"""
    
    # Get Shazam track ID
    shazam_track = await database.fetch_one(
        "SELECT shazam_id FROM shazam_tracks WHERE track_id = :track_id",
        {"track_id": track_id}
    )
    
    if not shazam_track:
        return 0
    
    # Get Shazam counts for last 30 days
    counts = await database.fetch_all(
        """
        SELECT date, count 
        FROM shazam_daily 
        WHERE shazam_id = :shazam_id 
          AND date >= :start_date
        ORDER BY date
        """,
        {
            "shazam_id": shazam_track["shazam_id"],
            "start_date": date.today() - timedelta(days=days)
        }
    )
    
    if not counts:
        return 0
    
    # Calculate weighted average (more weight to recent days)
    total_weighted = 0
    total_weight = 0
    max_count = max(c["count"] for c in counts) or 1
    
    for i, c in enumerate(counts):
        # Linear decay weight (most recent = highest)
        weight = (i + 1) / len(counts)
        total_weighted += (c["count"] / max_count) * weight * 100
        total_weight += weight
    
    return total_weighted / total_weight if total_weight > 0 else 0

async def get_shazam_velocity(track_id, days=7):
    """Calculate Shazam velocity (rate of change)"""
    
    shazam_track = await database.fetch_one(
        "SELECT shazam_id FROM shazam_tracks WHERE track_id = :track_id",
        {"track_id": track_id}
    )
    
    if not shazam_track:
        return 0
    
    # Get recent counts
    recent = await database.fetch_all(
        """
        SELECT count 
        FROM shazam_daily 
        WHERE shazam_id = :shazam_id 
          AND date >= :start_date
        ORDER BY date
        """,
        {
            "shazam_id": shazam_track["shazam_id"],
            "start_date": date.today() - timedelta(days=days)
        }
    )
    
    if len(recent) < 2:
        return 0
    
    # Linear regression slope or simple first/last difference
    first = recent[0]["count"]
    last = recent[-1]["count"]
    
    if first == 0:
        return last * 0.1  # Small boost if starting from zero
    
    return (last - first) / first * 10  # Scaled velocity

async def calculate_traction_with_shazam(track_id):
    """Enhanced traction score including Shazam"""
    
    # Get existing traction data
    rows = await database.fetch_all(
        """
        SELECT p.type, p.followers
        FROM playlist_tracks pt
        JOIN tracked_playlists p ON p.playlist_id = pt.playlist_id
        WHERE pt.track_id = :track_id AND pt.date_removed IS NULL
        """,
        {"track_id": track_id},
    )

    editorial = sum(1 for r in rows if r["type"] == "editorial")
    algorithmic = sum(1 for r in rows if r["type"] == "algorithmic")
    user = sum(1 for r in rows if r["type"] == "user")
    followers = sum(r["followers"] for r in rows)

    # Compute existing velocity
    velocity = await compute_velocity(track_id)
    
    # Get Shazam metrics
    shazam_index = await get_shazam_index(track_id)
    shazam_velocity = await get_shazam_velocity(track_id)

    traction_score = (
        EDITORIAL_WEIGHT * editorial +
        ALGO_WEIGHT * algorithmic +
        USER_WEIGHT * user +
        FOLLOWER_WEIGHT * followers +
        VELOCITY_WEIGHT * velocity +
        SHAZAM_WEIGHT * shazam_index +
        0.1 * shazam_velocity  # Small boost from Shazam velocity
    )

    await database.execute(
        """
        INSERT INTO track_traction (track_id, traction_score, velocity_score, last_calculated)
        VALUES (:track_id, :traction_score, :velocity, NOW())
        ON CONFLICT (track_id)
        DO UPDATE SET
            traction_score = EXCLUDED.traction_score,
            velocity_score = EXCLUDED.velocity_score,
            last_calculated = NOW()
        """,
        {
            "track_id": track_id,
            "traction_score": traction_score,
            "velocity": velocity,
        },
    )
    
    return traction_score
