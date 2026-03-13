import { NextResponse } from 'next/server';

// Mock data for development - replace with real API calls when you have credentials
const mockArtists: Record<string, any> = {
  'kendrick': {
    uuid: 'artist-123',
    name: 'Kendrick Lamar',
    image: 'https://i.scdn.co/image/ab6761610000e5eb437b9e4a5846a2456c2b5c0e',
    followers: 15000000,
    tracks: [
      { uuid: 'track-1', title: 'HUMBLE.', isrc: 'USUM71703861' },
      { uuid: 'track-2', title: 'DNA.', isrc: 'USUM71703862' },
      { uuid: 'track-3', title: 'LOYALTY.', isrc: 'USUM71703863' },
      { uuid: 'track-4', title: 'ELEMENT.', isrc: 'USUM71703864' },
    ]
  },
  'jay rock': {
    uuid: 'artist-456',
    name: 'Jay Rock',
    image: 'https://i.scdn.co/image/ab6761610000e5eb1b6f9c8c6e9d4b5f3a2c1d0e',
    followers: 2000000,
    tracks: [
      { uuid: 'track-5', title: 'MIDNIGHT DRIVE', isrc: 'US-TDE-24-00123' },
      { uuid: 'track-6', title: 'VICE CITY', isrc: 'US-TDE-24-00124' },
      { uuid: 'track-7', title: 'ELEMENT.', isrc: 'US-TDE-24-00125' },
    ]
  },
  'schoolboy q': {
    uuid: 'artist-789',
    name: 'Schoolboy Q',
    image: 'https://i.scdn.image/ab6761610000e5eb2c4a9d8f7e6b5a4c3d2e1f0g',
    followers: 3500000,
    tracks: [
      { uuid: 'track-8', title: 'WEST COAST', isrc: 'US-TDE-24-00126' },
      { uuid: 'track-9', title: 'BLOW FOR BLOW', isrc: 'US-TDE-24-00127' },
    ]
  },
  'sza': {
    uuid: 'artist-101',
    name: 'SZA',
    image: 'https://i.scdn.image/ab6761610000e5eb1a2b3c4d5e6f7g8h9i0j1k2l',
    followers: 8500000,
    tracks: [
      { uuid: 'track-10', title: 'KILL BILL', isrc: 'USRC12300001' },
      { uuid: 'track-11', title: 'SNOOZE', isrc: 'USRC12300002' },
      { uuid: 'track-12', title: 'GOOD DAYS', isrc: 'USRC12300003' },
    ]
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';

  if (!query || query.length < 2) {
    return NextResponse.json({ artists: [] });
  }

  // Search through mock artists
  const results = Object.values(mockArtists).filter(artist => 
    artist.name.toLowerCase().includes(query)
  );

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json({ artists: results });
}