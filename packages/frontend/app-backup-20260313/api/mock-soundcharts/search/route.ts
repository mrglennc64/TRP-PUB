import { NextResponse } from 'next/server';

// Mock data for development
const mockArtists = {
  'Kendrick Lamar': {
    uuid: 'artist-123',
    name: 'Kendrick Lamar',
    image: 'https://...',
    followers: 15000000,
    tracks: [
      { uuid: 'track-1', title: 'HUMBLE.', streams: 1500000000 },
      { uuid: 'track-2', title: 'DNA.', streams: 800000000 },
      { uuid: 'track-3', title: 'LOYALTY.', streams: 600000000 },
    ]
  },
  'Jay Rock': {
    uuid: 'artist-456',
    name: 'Jay Rock',
    followers: 2000000,
    tracks: [
      { uuid: 'track-4', title: 'MIDNIGHT DRIVE', streams: 50000000 },
      { uuid: 'track-5', title: 'WIN', streams: 100000000 },
    ]
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  
  if (!name) {
    return NextResponse.json({ error: 'Name required' }, { status: 400 });
  }
  
  // Return mock data based on search
  if (name.includes('Kendrick')) {
    return NextResponse.json({
      success: true,
      data: [mockArtists['Kendrick Lamar']]
    });
  } else if (name.includes('Jay Rock')) {
    return NextResponse.json({
      success: true,
      data: [mockArtists['Jay Rock']]
    });
  }
  
  return NextResponse.json({
    success: true,
    data: []
  });
}