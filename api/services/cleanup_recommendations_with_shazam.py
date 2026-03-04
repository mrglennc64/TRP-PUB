# File: services/cleanup_recommendations_with_shazam.py

async def generate_cleanup_recommendations_with_shazam(catalog_tracks):
    """Enhanced cleanup list with Shazam-based prioritization"""
    
    # First, calculate priority scores for each track
    track_priorities = []
    
    for t in catalog_tracks:
        track_id = t["track_id"]
        title = t["title"]
        gaps = t["metadata_gaps"]
        traction = t["traction_score"]
        playlists = t["playlists"]
        velocity = t["velocity_score"]
        
        # Get Shazam metrics
        shazam_index = await get_shazam_index(track_id)
        shazam_velocity = await get_shazam_velocity(track_id)
        
        # Check for recent spike
        shazam_track = await database.fetch_one(
            "SELECT shazam_id FROM shazam_tracks WHERE track_id = :track_id",
            {"track_id": track_id}
        )
        
        has_spike = False
        if shazam_track:
            spike = await database.fetch_one(
                """
                SELECT 1 FROM shazam_spikes
                WHERE shazam_id = :shazam_id
                  AND spike_date >= :cutoff
                LIMIT 1
                """,
                {
                    "shazam_id": shazam_track["shazam_id"],
                    "cutoff": date.today() - timedelta(days=14)
                }
            )
            has_spike = bool(spike)
        
        # Calculate priority score (0-100)
        priority = 0
        
        # Base: metadata gaps
        if gaps["missing_writers"] or gaps["missing_publishers"]:
            priority += 20
        if gaps["missing_pro"]:
            priority += 15
        if gaps["missing_mlc"]:
            priority += 15
        if t.get("isrc_mismatch"):
            priority += 25
            
        # Traction multiplier
        priority *= (1 + (traction / 100))
        
        # Shazam boost
        if has_spike:
            priority *= 3  # 3x priority if Shazam spike
        elif shazam_index > 50:
            priority *= 2  # 2x if high Shazam
        elif shazam_index > 20:
            priority *= 1.5  # 1.5x if moderate Shazam
            
        # Velocity boost
        priority *= (1 + (velocity / 50))
        
        track_priorities.append({
            "track_id": track_id,
            "title": title,
            "priority": priority,
            "gaps": gaps,
            "traction": traction,
            "shazam_index": shazam_index,
            "has_spike": has_spike,
            "playlists": playlists,
            "velocity": velocity
        })
    
    # Sort by priority (highest first)
    track_priorities.sort(key=lambda x: x["priority"], reverse=True)
    
    # Generate recommendations in priority order
    recommendations = []
    
    for t in track_priorities:
        title = t["title"]
        gaps = t["gaps"]
        
        # Shazam spike warning
        if t["has_spike"]:
            recommendations.append(f"🚨 URGENT - SHAZAM SPIKE: '{title}' is spiking - fix metadata NOW")
        
        # Track-specific fixes
        if gaps["missing_writers"]:
            recommendations.append(f"Add missing writers for '{title}' (Priority: {t['priority']:.0f})")
            
        if gaps["missing_publishers"]:
            recommendations.append(f"Add missing publishers for '{title}'")
            
        if gaps["missing_pro"]:
            urgency = "URGENT - SHAZAM SPIKE" if t["has_spike"] else "Needed"
            recommendations.append(f"{urgency}: Register '{title}' with PRO")
            
        if gaps["missing_mlc"]:
            urgency = "URGENT - SHAZAM SPIKE" if t["has_spike"] else "Needed"
            recommendations.append(f"{urgency}: Register '{title}' with MLC")
            
        if t.get("isrc_mismatch"):
            urgency = "URGENT - SHAZAM SPIKE" if t["has_spike"] else "Needed"
            recommendations.append(f"{urgency}: Correct ISRC mismatch for '{title}'")
            
        if t["traction"] > 50 and (gaps["missing_pro"] or gaps["missing_mlc"]):
            recommendations.append(f"HIGH TRACKING + SHAZAM: '{title}' missing PRO/MLC registration")
            
        if any(p["type"] == "editorial" for p in t["playlists"]) and gaps["missing_pro"]:
            recommendations.append(f"EDITORIAL TRACK + SHAZAM: '{title}' missing PRO registration")
    
    return recommendations
