import requests
import json
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime
import os

logger = logging.getLogger(__name__)

class ShazamClient:
    """
    Client for interacting with Shazam API to fetch track recognition data
    """
    
    def __init__(self):
        self.base_url = "https://shazam.p.rapidapi.com"
        self.rapidapi_key = os.getenv('RAPIDAPI_KEY', '')
        self.rapidapi_host = "shazam.p.rapidapi.com"
        
    def search_track(self, query: str) -> List[Dict[str, Any]]:
        """
        Search for tracks by name or artist
        """
        if not self.rapidapi_key:
            logger.warning("RAPIDAPI_KEY not set, using mock data")
            return self._get_mock_search_results(query)
            
        try:
            headers = {
                'x-rapidapi-key': self.rapidapi_key,
                'x-rapidapi-host': self.rapidapi_host
            }
            
            response = requests.get(
                f"{self.base_url}/search",
                headers=headers,
                params={'term': query, 'locale': 'en-US'}
            )
            
            if response.status_code == 200:
                data = response.json()
                return self._parse_search_results(data)
            else:
                logger.error(f"Shazam API error: {response.status_code}")
                return []
                
        except Exception as e:
            logger.error(f"Error searching Shazam: {str(e)}")
            return []
    
    def get_track_details(self, shazam_id: str) -> Optional[Dict[str, Any]]:
        """
        Get detailed track information by Shazam ID
        """
        try:
            headers = {
                'x-rapidapi-key': self.rapidapi_key,
                'x-rapidapi-host': self.rapidapi_host
            }
            
            response = requests.get(
                f"{self.base_url}/songs/get-details",
                headers=headers,
                params={'key': shazam_id, 'locale': 'en-US'}
            )
            
            if response.status_code == 200:
                data = response.json()
                return self._parse_track_details(data)
            else:
                logger.error(f"Shazam API error: {response.status_code}")
                return None
                
        except Exception as e:
            logger.error(f"Error getting track details: {str(e)}")
            return None
    
    def _parse_search_results(self, data: Dict) -> List[Dict]:
        """Parse search results from Shazam API"""
        tracks = []
        try:
            if 'tracks' in data and 'hits' in data['tracks']:
                for hit in data['tracks']['hits']:
                    track = hit.get('track', {})
                    tracks.append({
                        'shazam_id': track.get('key'),
                        'title': track.get('title'),
                        'artist': track.get('subtitle'),
                        'isrc': track.get('isrc'),
                        'images': track.get('images', {}),
                        'url': track.get('url')
                    })
        except Exception as e:
            logger.error(f"Error parsing search results: {str(e)}")
        return tracks
    
    def _parse_track_details(self, data: Dict) -> Dict:
        """Parse track details from Shazam API"""
        return {
            'shazam_id': data.get('key'),
            'title': data.get('title'),
            'artist': data.get('subtitle'),
            'isrc': data.get('isrc'),
            'genres': data.get('genres', {}),
            'sections': data.get('sections', []),
            'url': data.get('url')
        }
    
    def _get_mock_search_results(self, query: str) -> List[Dict]:
        """Return mock search results for testing"""
        return [
            {
                'shazam_id': f'mock-{hash(query) % 1000}',
                'title': f'Mock Track: {query}',
                'artist': 'Mock Artist',
                'isrc': 'US-MOCK-23-00123',
                'url': 'https://shazam.com/track/mock-123'
            }
        ]

# Singleton instance
shazam_client = ShazamClient()
