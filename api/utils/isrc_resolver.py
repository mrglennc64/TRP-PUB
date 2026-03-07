import musicbrainzngs as mb
import requests
import re
from typing import Dict, List, Optional, Tuple
import logging

logger = logging.getLogger(__name__)

# Set up MusicBrainz user agent
mb.set_useragent("TrapRoyaltiesPro", "1.0", "contact@traproyaltiespro.com")

class ISRCResolver:
    """
    Intelligent ISRC resolver with fallback logic:
    1. Strict ISRC lookup
    2. Fuzzy search by artist + title
    3. Multiple version detection
    """
    
    # Known major label registrant codes
    LABEL_REGISTRANTS = {
        'UMG': ['UMG', 'UM7', 'UM1'],  # Universal
        'SMG': ['SMG', 'SM1', 'SM2'],  # Sony
        'WMG': ['WMG', 'WM1', 'WM2'],  # Warner
        'IND': ['IND', 'INA', 'INB'],  # Independent variations
    }
    
    @staticmethod
    def clean_isrc(isrc: str) -> str:
        """Remove hyphens and convert to uppercase"""
        return isrc.replace('-', '').upper().strip()
    
    @staticmethod
    def extract_isrc_components(isrc: str) -> Dict:
        """Extract country, registrant, year from ISRC"""
        clean = ISRCResolver.clean_isrc(isrc)
        if len(clean) != 12:
            return {}
        
        return {
            'country': clean[0:2],
            'registrant': clean[2:5],
            'year': clean[5:7],
            'designation': clean[7:12],
            'full': clean
        }
    
    @staticmethod
    def is_same_recording(isrc1: str, isrc2: str) -> bool:
        """Check if two ISRCs likely represent the same recording"""
        comp1 = ISRCResolver.extract_isrc_components(isrc1)
        comp2 = ISRCResolver.extract_isrc_components(isrc2)
        
        if not comp1 or not comp2:
            return False
        
        # Same country, registrant, and designation? Definitely same
        if (comp1['country'] == comp2['country'] and 
            comp1['registrant'] == comp2['registrant'] and 
            comp1['designation'] == comp2['designation']):
            return True
        
        # Different registrant but same designation? Could be different version
        if (comp1['designation'] == comp2['designation'] and
            comp1['country'] == comp2['country']):
            return True  # Probably same recording, different registrant code
        
        return False
    
    @staticmethod
    async def strict_isrc_lookup(isrc: str) -> Optional[Dict]:
        """
        Attempt 1: Strict ISRC lookup in MusicBrainz
        """
        try:
            clean = ISRCResolver.clean_isrc(isrc)
            result = mb.search_recordings(isrc=clean, limit=5)
            
            if result.get('recording-list') and len(result['recording-list']) > 0:
                recording = result['recording-list'][0]
                return {
                    'method': 'strict_isrc',
                    'found': True,
                    'confidence': 'high',
                    'recording': recording,
                    'match_type': 'exact'
                }
            return None
        except Exception as e:
            logger.warning(f"Strict ISRC lookup failed for {isrc}: {e}")
            return None
    
    @staticmethod
    async def search_by_metadata(artist: str, title: str) -> List[Dict]:
        """
        Attempt 2: Search by artist and title
        """
        try:
            # Build search query
            query = f'artist:"{artist}" AND recording:"{title}"'
            result = mb.search_recordings(query=query, limit=20)
            
            matches = []
            if result.get('recording-list'):
                for recording in result['recording-list']:
                    # Extract ISRCs from this recording
                    if recording.get('isrc-list'):
                        for isrc in recording['isrc-list']:
                            matches.append({
                                'method': 'artist_title_search',
                                'found': True,
                                'confidence': 'medium',
                                'recording': recording,
                                'isrc': isrc,
                                'match_type': 'metadata_match'
                            })
            return matches
        except Exception as e:
            logger.warning(f"Metadata search failed for {artist} - {title}: {e}")
            return []
    
    @staticmethod
    async def find_alternative_versions(isrc: str, artist: str = None, title: str = None) -> List[Dict]:
        """
        Attempt 3: Find alternative versions/registrations of the same song
        """
        versions = []
        components = ISRCResolver.extract_isrc_components(isrc)
        
        if not components:
            return versions
        
        try:
            # Search for recordings by the same artist with similar titles
            if artist and title:
                # Remove common version indicators
                clean_title = re.sub(r'\s*\([^)]*\)\s*', '', title).strip()
                clean_title = re.sub(r'\s*-\s*(Radio Edit|Remix|Live|Acoustic).*$', '', clean_title, flags=re.IGNORECASE)
                
                query = f'artist:"{artist}" AND recording:"{clean_title}"'
                result = mb.search_recordings(query=query, limit=50)
                
                if result.get('recording-list'):
                    for recording in result['recording-list']:
                        if recording.get('isrc-list'):
                            for alt_isrc in recording['isrc-list']:
                                if alt_isrc != isrc and ISRCResolver.is_same_recording(isrc, alt_isrc):
                                    versions.append({
                                        'method': 'version_discovery',
                                        'found': True,
                                        'confidence': 'medium',
                                        'recording': recording,
                                        'isrc': alt_isrc,
                                        'match_type': 'alternative_version',
                                        'version': recording.get('title', '').replace(clean_title, '').strip()
                                    })
        except Exception as e:
            logger.warning(f"Version discovery failed: {e}")
        
        return versions
    
    @staticmethod
    async def resolve_isrc(isrc: str, artist: str = None, title: str = None) -> Dict:
        """
        Main resolver with fallback logic
        """
        result = {
            'isrc': isrc,
            'resolved': False,
            'attempts': [],
            'best_match': None,
            'alternative_versions': [],
            'recommendations': []
        }
        
        # Attempt 1: Strict ISRC lookup
        strict = await ISRCResolver.strict_isrc_lookup(isrc)
        if strict:
            result['resolved'] = True
            result['best_match'] = strict
            result['attempts'].append({'method': 'strict_isrc', 'success': True})
            
            # Get artist/title from the match for further searches
            recording = strict['recording']
            if recording.get('artist-credit-phrase'):
                artist = recording['artist-credit-phrase']
            if recording.get('title'):
                title = recording['title']
        else:
            result['attempts'].append({'method': 'strict_isrc', 'success': False})
        
        # If we have artist/title, try metadata search (even if strict succeeded, to find alternatives)
        if artist and title:
            # Attempt 2: Search by metadata
            metadata_matches = await ISRCResolver.search_by_metadata(artist, title)
            if metadata_matches:
                result['attempts'].append({'method': 'metadata_search', 'success': True, 'count': len(metadata_matches)})
                
                # If strict failed, use the first metadata match as best
                if not result['best_match'] and metadata_matches:
                    result['resolved'] = True
                    result['best_match'] = metadata_matches[0]
                
                # Store all matches for reference
                for match in metadata_matches:
                    if match not in result['alternative_versions']:
                        result['alternative_versions'].append(match)
            else:
                result['attempts'].append({'method': 'metadata_search', 'success': False})
            
            # Attempt 3: Find alternative versions
            versions = await ISRCResolver.find_alternative_versions(isrc, artist, title)
            if versions:
                result['attempts'].append({'method': 'version_discovery', 'success': True, 'count': len(versions)})
                result['alternative_versions'].extend(versions)
        
        # Generate recommendations
        if not result['resolved']:
            result['recommendations'].append({
                'priority': 'HIGH',
                'action': 'Search by artist and title instead',
                'reason': 'ISRC lookup failed, but the song might exist under a different ISRC'
            })
        elif len(result['alternative_versions']) > 0:
            result['recommendations'].append({
                'priority': 'MEDIUM',
                'action': 'Review alternative versions',
                'reason': f'Found {len(result["alternative_versions"])} alternative ISRCs for this song'
            })
        
        return result


async def enhanced_audit_with_fallback(isrc: str, artist: str = None, title: str = None) -> Dict:
    """
    Complete audit with intelligent ISRC resolution
    """
    from .musicbrainz_audit import perform_enhanced_audit
    
    # Step 1: Resolve the ISRC
    resolution = await ISRCResolver.resolve_isrc(isrc, artist, title)
    
    # Step 2: If resolved, perform deep audit on the best match
    if resolution['resolved'] and resolution['best_match']:
        best_match = resolution['best_match']
        recording = best_match['recording']
        
        # Extract the actual ISRC that worked
        if best_match['method'] == 'strict_isrc':
            working_isrc = isrc
        elif recording.get('isrc-list'):
            working_isrc = recording['isrc-list'][0]
        else:
            working_isrc = isrc
        
        # Perform the deep audit
        audit_result = perform_enhanced_audit(working_isrc)
        
        # Enhance with resolution info
        audit_result['resolution'] = {
            'original_isrc': isrc,
            'working_isrc': working_isrc,
            'method': best_match['method'],
            'confidence': best_match['confidence'],
            'alternative_versions': [
                {
                    'isrc': v['isrc'],
                    'version': v.get('version', 'Unknown version'),
                    'title': v['recording'].get('title', 'Unknown')
                }
                for v in resolution['alternative_versions'][:5]
            ]
        }
        
        return audit_result
    
    # Step 3: If still not found, return helpful error
    return {
        'score': 0,
        'status': 'UNRESOLVED',
        'risk_level': '⚠️ ISRC NOT FOUND',
        'risk_color': 'yellow',
        'summary': 'Could not resolve this ISRC to a recording',
        'estimated_loss': 'Unknown',
        'flags': [{
            'type': 'warning',
            'icon': '⚠️',
            'title': 'ISRC Resolution Failed',
            'description': f'Could not find a match for ISRC: {isrc}',
            'impact': 'Unable to audit',
            'fix': 'Try searching by artist and title instead'
        }],
        'resolution': resolution,
        'revenue_impact': {"streaming": 0, "mechanical": 0, "performance": 0, "sync": 0, "total": 0},
        'action_items': ['Search by artist and title', 'Check if this ISRC is correct'],
        'song_title': 'Unknown',
        'artist': 'Unknown',
        'isrc': isrc
    }
