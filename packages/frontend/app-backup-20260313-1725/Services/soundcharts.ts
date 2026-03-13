export interface Artist {
  uuid: string;
  name: string;
  image?: string;
  followers?: number;
  tracks?: Track[];
}

export interface Track {
  uuid: string;
  title: string;
  isrc?: string;
}

export interface RoyaltyEstimate {
  trackUuid: string;
  trackName: string;
  artistName: string;
  totalStreams: number;
  estimatedRoyalty: number;
  confidence: 'high' | 'medium' | 'low';
  platforms?: Record<string, number>;
}

class SoundchartsService {
  
  async searchArtists(query: string): Promise<Artist[]> {
    try {
      const response = await fetch(`/api/soundcharts/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data.artists || [];
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }

  async getArtist(uuid: string): Promise<Artist | null> {
    try {
      const response = await fetch(`/api/soundcharts/artist/${uuid}`);
      const data = await response.json();
      return data.artist || null;
    } catch (error) {
      console.error('Failed to get artist:', error);
      return null;
    }
  }

  async estimateRoyalties(artistName: string, tracks: Track[]): Promise<RoyaltyEstimate[]> {
    try {
      const response = await fetch('/api/soundcharts/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artistName, tracks })
      });
      const data = await response.json();
      return data.estimates || [];
    } catch (error) {
      console.error('Failed to estimate royalties:', error);
      return [];
    }
  }
}

export const soundchartsApi = new SoundchartsService();