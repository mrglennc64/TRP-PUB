export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

// Mock artist data
const mockArtists: Record<string, any> = {
  'artist-123': {
    uuid: 'artist-123',
    name: 'Kendrick Lamar',
    followers: 15000000,
  },
  'artist-456': {
    uuid: 'artist-456',
    name: 'Jay Rock',
    followers: 2000000,
  }
};

export async function GET(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  try {
    // Get UUID from params
    const uuid = params.uuid;
    
    if (!uuid) {
      return NextResponse.json(
        { error: 'UUID parameter is missing' },
        { status: 400 }
      );
    }

    // Try to find the artist
    const artist = mockArtists[uuid];
    
    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ artist });
  } catch (error) {
    console.error('Error in artist route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
