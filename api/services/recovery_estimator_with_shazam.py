# File: services/recovery_estimator_with_shazam.py

from db import database
from datetime import date, timedelta

async def get_shazam_multiplier(track_id):
    """Calculate Shazam-based multiplier for recovery"""
    
    # Check for recent spikes
    shazam_track = await database.fetch_one(
        "SELECT shazam_id FROM shazam_tracks WHERE track_id = :track_id",
        {"track_id": track_id}
    )
    
    if not shazam_track:
        return 1.0
    
    # Check for spikes in last 14 days
    spike = await database.fetch_one(
        """
        SELECT spike_factor 
        FROM shazam_spikes 
        WHERE shazam_id = :shazam_id 
          AND spike_date >= :cutoff
        ORDER BY spike_factor DESC
        LIMIT 1
        """,
        {
            "shazam_id": shazam_track["shazam_id"],
            "cutoff": date.today() - timedelta(days=14)
        }
    )
    
    if spike:
        # Spike multiplier (capped at 3x)
        return min(1.0 + (spike["spike_factor"] / 10), 3.0)
    
    # Get recent average
    avg = await database.fetch_one(
        """
        SELECT AVG(count) as avg_count
        FROM shazam_daily
        WHERE shazam_id = :shazam_id
          AND date >= :cutoff
        """,
        {
            "shazam_id": shazam_track["shazam_id"],
            "cutoff": date.today() - timedelta(days=30)
        }
    )
    
    if avg and avg["avg_count"] > 100:
        return 1.5  # Moderate boost for consistent Shazam activity
    elif avg and avg["avg_count"] > 50:
        return 1.2  # Small boost
    
    return 1.0

async def estimate_recovery_with_shazam(catalog_tracks):
    """Enhanced recovery estimation with Shazam multipliers"""
    
    traction_value = 0
    publishing_loss = 0
    mlc_loss = 0
    pro_loss = 0
    neighboring_rights_loss = 0
    velocity_loss = 0
    shazam_premium = 0  # New: Shazam-based premium
    
    for t in catalog_tracks:
        track_id = t["track_id"]
        gaps = t["metadata_gaps"]
        traction = t["traction_score"]
        playlists = t["playlists"]
        
        # Get Shazam multiplier for this track
        shazam_mult = await get_shazam_multiplier(track_id)
        
        # Base values
        traction_value += traction * 0.015 * shazam_mult
        
        if any(gaps.values()):
            publishing_loss += 50 * shazam_mult
            
        if any(p["type"] == "editorial" for p in playlists) and (gaps["missing_pro"] or gaps["missing_mlc"]):
            mlc_loss += 25 * shazam_mult
            pro_loss += 35 * shazam_mult
            
        if t.get("isrc_mismatch"):
            neighboring_rights_loss += 60 * shazam_mult
            
        if t["velocity_score"] > 0 and (gaps["missing_pro"] or gaps["missing_mlc"]):
            velocity_loss += 20 * shazam_mult
            
        # Add Shazam premium for tracks with high Shazam but low traction
        shazam_index = await get_shazam_index(track_id)  # From previous function
        if shazam_index > 50 and traction < 30:
            # Track is Shazaming but not yet streaming - high potential
            shazam_premium += 25 * (shazam_index / 50)

    total = (
        traction_value +
        publishing_loss +
        mlc_loss +
        pro_loss +
        neighboring_rights_loss +
        velocity_loss +
        shazam_premium
    )

    return {
        "traction_value": round(traction_value, 2),
        "publishing_loss": round(publishing_loss, 2),
        "mlc_loss": round(mlc_loss, 2),
        "pro_loss": round(pro_loss, 2),
        "neighboring_rights_loss": round(neighboring_rights_loss, 2),
        "velocity_loss": round(velocity_loss, 2),
        "shazam_premium": round(shazam_premium, 2),
        "total_recovery_estimate": round(total, 2)
    }
