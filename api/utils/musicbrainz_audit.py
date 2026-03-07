import musicbrainzngs as mb
import requests
from typing import Dict, List, Optional
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set up MusicBrainz user agent
mb.set_useragent("TrapRoyaltiesPro", "1.0", "contact@traproyaltiespro.com")

def perform_enhanced_audit(isrc: str) -> Dict:
    """
    Perform a comprehensive metadata audit using MusicBrainz
    Returns a detailed risk score with specific revenue leakage warnings
    """
    try:
        # Clean ISRC
        clean_isrc = isrc.replace('-', '').upper()
        logger.info(f"🔍 Auditing ISRC: {clean_isrc}")
        
        # Search for the recording
        result = mb.search_recordings(isrc=clean_isrc)
        
        if not result.get('recording-list') or len(result['recording-list']) == 0:
            return {
                "score": 0,
                "status": "CRITICAL",
                "risk_level": "🚨 CRITICAL",
                "risk_color": "red",
                "summary": "No global registration found",
                "estimated_loss": "100% of potential revenue",
                "flags": [
                    {
                        "type": "error",
                        "icon": "❌",
                        "title": "No MusicBrainz Registration",
                        "description": "This recording doesn't exist in the global database. Streaming platforms can't identify or pay for this track.",
                        "impact": "100% revenue loss",
                        "fix": "Register with a distributor that sends data to MusicBrainz"
                    }
                ],
                "revenue_impact": {
                    "streaming": 0,
                    "mechanical": 0,
                    "performance": 0,
                    "sync": 0,
                    "total": 0
                },
                "action_items": [
                    "Register this track with a music distributor",
                    "Ensure ISRC is properly embedded in the audio file",
                    "Submit metadata to all major streaming platforms"
                ],
                "song_title": "Unknown",
                "artist": "Unknown",
                "mbid": None,
                "recording_id": None,
                "streaming_stats": {"total_listens": 0, "unique_listeners": 0},
                "isrc": isrc
            }
        
        recording = result['recording-list'][0]
        recording_id = recording.get('id')
        song_title = recording.get('title', 'Unknown')
        
        # Initialize risk factors
        risk_factors = []
        score = 100
        estimated_loss = 0
        
        # Get artist information
        artist_mbid = None
        artist_name = "Unknown"
        if recording.get('artist-credit') and len(recording['artist-credit']) > 0:
            artist_credit = recording['artist-credit'][0]
            if isinstance(artist_credit, dict) and artist_credit.get('artist'):
                artist = artist_credit['artist']
                artist_name = artist.get('name', 'Unknown')
                artist_mbid = artist.get('id')
        
        # RISK 1: No work relationship (mechanical royalties)
        try:
            if recording_id:
                recording_detail = mb.get_recording_by_id(recording_id, includes=["work-rels", "artist-rels"])
                if recording_detail.get('recording', {}).get('work-relation-list'):
                    pass  # Has work relationship, good
                else:
                    score -= 35
                    estimated_loss += 35
                    risk_factors.append({
                        "type": "critical",
                        "icon": "⚠️",
                        "title": "Missing Work Relationship",
                        "description": "This recording isn't linked to a composition (ISWC). Mechanical royalties from streaming and downloads are blocked.",
                        "impact": "35% revenue loss",
                        "fix": "Register the composition with a PRO (ASCAP/BMI) and link it to this recording"
                    })
        except:
            score -= 35
            estimated_loss += 35
            risk_factors.append({
                "type": "critical",
                "icon": "⚠️",
                "title": "Work Relationship Error",
                "description": "Unable to verify work relationship. Mechanical royalties may be at risk.",
                "impact": "35% potential loss",
                "fix": "Check composition registration with your PRO"
            })
        
        # RISK 2: Artist missing identifiers
        if artist_mbid:
            try:
                artist_info = mb.get_artist_by_id(artist_mbid, includes=["artist-rels", "isnis"])
                has_ipi = bool(artist_info['artist'].get('ipi-list'))
                has_isni = bool(artist_info['artist'].get('isni-list'))
                
                if not has_ipi and not has_isni:
                    score -= 20
                    estimated_loss += 20
                    risk_factors.append({
                        "type": "warning",
                        "icon": "⚠️",
                        "title": "Artist Missing PRO Identifiers",
                        "description": f"{artist_name} has no IPI or ISNI numbers. Performance royalties can't be matched to this artist.",
                        "impact": "20% revenue loss",
                        "fix": "Register with a PRO and get an IPI number, then add it to MusicBrainz"
                    })
                elif not has_ipi:
                    score -= 10
                    estimated_loss += 10
                    risk_factors.append({
                        "type": "warning",
                        "icon": "⚠️",
                        "title": "Missing IPI Number",
                        "description": f"{artist_name} has no IPI number. Performance royalties may be delayed.",
                        "impact": "10% revenue loss",
                        "fix": "Get an IPI number from your PRO and add it to MusicBrainz"
                    })
            except:
                score -= 15
                estimated_loss += 15
                risk_factors.append({
                    "type": "warning",
                    "icon": "⚠️",
                    "title": "Artist Lookup Failed",
                    "description": "Could not verify artist identifiers.",
                    "impact": "15% potential loss",
                    "fix": "Manually verify artist registration with PROs"
                })
        
        # RISK 3: Check for multiple releases (catalog depth)
        try:
            if artist_mbid:
                releases = mb.get_artist_by_id(artist_mbid, includes=["release-groups"])
                release_count = len(releases['artist'].get('release-group-list', []))
                if release_count == 0:
                    score -= 15
                    estimated_loss += 15
                    risk_factors.append({
                        "type": "warning",
                        "icon": "📉",
                        "title": "No Releases Found",
                        "description": "This artist has no releases in MusicBrainz. Streaming platforms may not display properly.",
                        "impact": "15% revenue loss",
                        "fix": "Add releases to MusicBrainz or use a distributor that does"
                    })
                elif release_count < 3:
                    score -= 5
                    estimated_loss += 5
                    risk_factors.append({
                        "type": "info",
                        "icon": "ℹ️",
                        "title": "Limited Catalog",
                        "description": f"Only {release_count} releases found. Emerging artist with growth potential.",
                        "impact": "5% revenue loss",
                        "fix": "Build catalog and ensure all releases are properly registered"
                    })
        except:
            pass
        
        # RISK 4: Check recording duration (some platforms require this) - FIXED STRING DIVISION
        if recording.get('length'):
            try:
                # Length in milliseconds - convert to float first
                length = float(recording['length'])
                minutes = length / 60000
                if minutes < 2:
                    score -= 5
                    estimated_loss += 5
                    risk_factors.append({
                        "type": "info",
                        "icon": "ℹ️",
                        "title": "Short Recording",
                        "description": f"Track length: {minutes:.1f} minutes. Some platforms have minimum play time requirements.",
                        "impact": "5% potential loss",
                        "fix": "Ensure track meets platform requirements (>2 minutes recommended)"
                    })
            except (ValueError, TypeError):
                # If conversion fails, skip this risk factor
                pass
        
        # Get streaming stats from ListenBrainz
        streaming_stats = {"total_listens": 0, "unique_listeners": 0}
        if artist_mbid:
            try:
                lb_url = "https://api.listenbrainz.org/1/popularity/artist"
                lb_response = requests.post(lb_url, json={"artist_mbids": [artist_mbid]}, timeout=5)
                if lb_response.status_code == 200:
                    stats = lb_response.json()
                    if stats and len(stats) > 0:
                        streaming_stats = {
                            "total_listens": stats[0].get('listen_count', 0),
                            "unique_listeners": stats[0].get('listener_count', 0)
                        }
                        
                        # Add streaming insight
                        if streaming_stats['total_listens'] > 100000:
                            risk_factors.append({
                                "type": "success",
                                "icon": "🔥",
                                "title": "High Streaming Activity",
                                "description": f"{streaming_stats['total_listens']:,} total plays detected!",
                                "impact": "All this traffic is currently at risk",
                                "fix": "Fix metadata issues to capture this revenue"
                            })
            except:
                pass
        
        # Calculate risk level
        if score >= 90:
            risk_level = "✅ SECURE"
            risk_color = "green"
            summary = "Metadata is complete. All royalty paths should be open."
        elif score >= 70:
            risk_level = "⚠️ AT RISK"
            risk_color = "yellow"
            summary = f"Missing identifiers detected. You're losing approximately {estimated_loss}% of potential revenue."
        else:
            risk_level = "🚨 CRITICAL"
            risk_color = "red"
            summary = f"Critical issues found. Estimated {estimated_loss}% revenue leakage."
        
        # Calculate revenue impact by category
        revenue_impact = {
            "streaming": round(estimated_loss * 0.4, 1),  # 40% of loss from streaming
            "mechanical": round(estimated_loss * 0.3, 1), # 30% from mechanical
            "performance": round(estimated_loss * 0.2, 1), # 20% from performance
            "sync": round(estimated_loss * 0.1, 1),       # 10% from sync
            "total": estimated_loss
        }
        
        # Generate action items
        action_items = []
        for factor in risk_factors:
            if factor['type'] in ['critical', 'warning']:
                action_items.append(factor['fix'])
        
        return {
            "score": max(score, 0),
            "status": get_risk_status(score),
            "risk_level": risk_level,
            "risk_color": risk_color,
            "summary": summary,
            "estimated_loss": f"{estimated_loss}%",
            "flags": risk_factors,
            "revenue_impact": revenue_impact,
            "action_items": list(set(action_items))[:3],  # Top 3 unique actions
            "song_title": song_title,
            "artist": artist_name,
            "mbid": artist_mbid,
            "recording_id": recording_id,
            "streaming_stats": streaming_stats,
            "isrc": isrc
        }
        
    except mb.ResponseError as e:
        return {
            "score": 0,
            "status": "ERROR",
            "risk_level": "🚨 ERROR",
            "risk_color": "red",
            "summary": f"MusicBrainz lookup failed",
            "estimated_loss": "Unknown",
            "flags": [{
                "type": "error",
                "icon": "❌",
                "title": "API Error",
                "description": str(e),
                "impact": "Unable to scan",
                "fix": "Try again later or contact support"
            }],
            "revenue_impact": {
                "streaming": 0,
                "mechanical": 0,
                "performance": 0,
                "sync": 0,
                "total": 0
            },
            "action_items": ["Retry search", "Check ISRC format"],
            "song_title": "Error",
            "artist": "Unknown",
            "mbid": None,
            "recording_id": None,
            "streaming_stats": {"total_listens": 0, "unique_listeners": 0},
            "isrc": isrc
        }
    except Exception as e:
        logger.error(f"Audit failed: {e}")
        return {
            "score": 0,
            "status": "ERROR",
            "risk_level": "🚨 ERROR",
            "risk_color": "red",
            "summary": f"Audit failed: {str(e)}",
            "estimated_loss": "Unknown",
            "flags": [{
                "type": "error",
                "icon": "❌",
                "title": "System Error",
                "description": str(e),
                "impact": "Scan incomplete",
                "fix": "Contact support"
            }],
            "revenue_impact": {
                "streaming": 0,
                "mechanical": 0,
                "performance": 0,
                "sync": 0,
                "total": 0
            },
            "action_items": ["Try again", "Contact support"],
            "song_title": "Error",
            "artist": "Unknown",
            "mbid": None,
            "recording_id": None,
            "streaming_stats": {"total_listens": 0, "unique_listeners": 0},
            "isrc": isrc
        }

def get_risk_status(score: int) -> str:
    if score >= 90:
        return "SECURE"
    elif score >= 70:
        return "AT_RISK"
    else:
        return "CRITICAL"

def get_risk_color(score: int) -> str:
    if score >= 90:
        return "green"
    elif score >= 70:
        return "yellow"
    else:
        return "red"

def get_risk_message(score: int) -> str:
    if score >= 90:
        return "✅ Metadata is complete. All royalty paths should be open."
    elif score >= 70:
        return "⚠️ Some identifiers missing. International royalties may be delayed."
    else:
        return "🚨 Critical issues found. Revenue leakage likely."
