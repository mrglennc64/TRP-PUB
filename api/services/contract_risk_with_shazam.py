# File: services/contract_risk_with_shazam.py

async def calculate_contract_risk_with_shazam(catalog_tracks):
    """Enhanced contract risk including Shazam exposure"""
    
    split_errors = 0
    isrc_mismatches = 0
    missing_writers = 0
    missing_publishers = 0
    missing_pro = 0
    missing_mlc = 0
    shazam_exposure = 0  # New: tracks with Shazam activity but missing metadata
    
    for t in catalog_tracks:
        track_id = t["track_id"]
        gaps = t["metadata_gaps"]
        
        # Track base errors
        if gaps.get("missing_writers") or gaps.get("missing_publishers"):
            split_errors += 1
            
        if t.get("isrc_mismatch"):
            isrc_mismatches += 1
            
        if gaps["missing_writers"]:
            missing_writers += 1
            
        if gaps["missing_publishers"]:
            missing_publishers += 1
            
        if gaps["missing_pro"]:
            missing_pro += 1
            
        if gaps["missing_mlc"]:
            missing_mlc += 1
            
        # Check for Shazam activity with metadata gaps
        shazam_track = await database.fetch_one(
            "SELECT shazam_id FROM shazam_tracks WHERE track_id = :track_id",
            {"track_id": track_id}
        )
        
        if shazam_track:
            # Check recent Shazam activity
            recent = await database.fetch_one(
                """
                SELECT COUNT(*) as activity
                FROM shazam_daily
                WHERE shazam_id = :shazam_id
                  AND date >= :cutoff
                  AND count > 10
                """,
                {
                    "shazam_id": shazam_track["shazam_id"],
                    "cutoff": date.today() - timedelta(days=30)
                }
            )
            
            if recent and recent["activity"] > 0:
                # Track is being Shazamed - missing metadata = legal exposure
                if any(gaps.values()):
                    shazam_exposure += 1

    risk = (
        2 * split_errors +
        2 * isrc_mismatches +
        1 * missing_writers +
        1 * missing_publishers +
        1 * missing_pro +
        1 * missing_mlc +
        3 * shazam_exposure  # Shazam exposure weighted higher
    )

    return min(risk, 100)
