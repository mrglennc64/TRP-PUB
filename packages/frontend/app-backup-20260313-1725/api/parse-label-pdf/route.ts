import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('pdf') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Here you would integrate with a PDF parsing service
    // For demo, return mock data
    
    // Mock extracted data
    const extractedData = {
      artist: 'Kendrick Lamar',
      title: 'Summer Nights',
      isrc: 'US-TDE-24-00123',
      amount: 8420.50,
      period: 'January 2026',
      earnings: [
        { source: 'Spotify', amount: 4250.20, plays: 845000 },
        { source: 'Apple Music', amount: 2850.30, plays: 420000 },
        { source: 'Tidal', amount: 1320.00, plays: 185000 }
      ],
      splits: [
        { address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', percentage: 50, name: 'Kendrick Lamar', role: 'artist' },
        { address: '0x1234...5678', percentage: 30, name: 'Baby Keem', role: 'producer' },
        { address: '0x8765...4321', percentage: 20, name: 'Top Dawg Ent', role: 'label' }
      ]
    };

    return NextResponse.json(extractedData);
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to parse PDF' },
      { status: 500 }
    );
  }
}
