import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }

  try {
    const results = [];

    // Mock data for demonstration - replace with actual Soundcharts API later
    if (type === 'artist') {
      // Simulate artist search results
      const mockArtists = [
        { name: 'Kendrick Lamar', matches: 12, confidence: 'high' },
        { name: 'Jay Rock', matches: 8, confidence: 'high' },
        { name: 'Schoolboy Q', matches: 7, confidence: 'medium' },
        { name: 'SZA', matches: 15, confidence: 'high' }
      ].filter(a => a.name.toLowerCase().includes(query.toLowerCase()));

      for (const artist of mockArtists) {
        results.push({
          track: `${artist.name} Catalog`,
          artist: artist.name,
          source: 'Soundcharts Database',
          estimatedAmount: `$${(Math.random() * 10000 + 1000).toFixed(0)}`,
          confidence: artist.confidence,
          streams: `${(Math.random() * 10 + 1).toFixed(1)}M`,
          platforms: 'Spotify, Apple Music, Tidal',
          type: 'soundcharts'
        });
      }
    }

    // Check internal database for unclaimed royalties (SQLite compatible)
    const unclaimed = await prisma.unclaimedRoyalty.findMany({
      where: {
        OR: [
          {
            artistName: {
              contains: query.toLowerCase()
            }
          },
          {
            writerName: {
              contains: query.toLowerCase()
            }
          }
        ]
      }
    });

    // Add unclaimed royalties to results
    for (const item of unclaimed) {
      results.push({
        track: item.songTitle || 'Unknown Track',
        artist: item.artistName,
        writer: item.writerName,
        source: 'Internal Unclaimed Royalties Database',
        estimatedAmount: item.amount ? `$${item.amount}` : 'Pending review',
        confidence: 'high', // Internal data is reliable
        status: item.status,
        identifier: item.identifier,
        type: 'unclaimed'
      });
    }

    // If no results found, return a helpful message
    if (results.length === 0) {
      return NextResponse.json({ 
        message: 'No results found',
        results: [] 
      });
    }

    return NextResponse.json({ 
      results,
      total: results.length
    });

  } catch (error) {
    console.error('Royalty finder error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch royalty data' }, 
      { status: 500 }
    );
  }
}
