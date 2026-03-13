import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const role = formData.get('role') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Please upload a CSV file' },
        { status: 400 }
      );
    }

    // Read file content
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const content = buffer.toString();

    // Parse CSV
    let records = [];
    try {
      records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid CSV format' },
        { status: 400 }
      );
    }

    // Limit to 10 tracks for free audit
    const tracks = records.slice(0, 10);

    // Simulate PRO scanning results
    const results = tracks.map((track: any) => {
      const issues = [];
      const random = Math.random();
      
      // Determine severity and issues based on track data
      let severity: 'high' | 'medium' | 'low' = 'low';
      let issue = '';
      let estimatedAmount = 0;

      if (random < 0.3) {
        severity = 'high';
        issue = 'BMI registration missing on feature';
        estimatedAmount = Math.floor(Math.random() * 5000) + 3000;
      } else if (random < 0.6) {
        severity = 'medium';
        issue = 'Split mismatch: producer share incomplete';
        estimatedAmount = Math.floor(Math.random() * 3000) + 1000;
      } else {
        severity = 'low';
        issue = 'ASCAP registration pending';
        estimatedAmount = Math.floor(Math.random() * 1000) + 100;
      }

      return {
        title: track.Title || track.title || 'Unknown Track',
        artist: track.Artist || track.artist || 'Unknown Artist',
        isrc: track.ISRC || track.isrc || null,
        issue,
        severity,
        estimatedAmount: estimatedAmount.toLocaleString(),
        proStatus: {
          ascap: Math.random() > 0.5,
          bmi: Math.random() > 0.5,
          socan: Math.random() > 0.7,
          prs: Math.random() > 0.8
        }
      };
    });

    const totalMissing = results.reduce((sum, r) => sum + parseInt(r.estimatedAmount.replace(',', '')), 0);

    return NextResponse.json({
      tracksScanned: tracks.length,
      issuesFound: results.filter(r => r.severity !== 'low').length,
      missingPROs: results.filter(r => !r.proStatus.ascap || !r.proStatus.bmi).length,
      estimatedMissing: totalMissing.toLocaleString(),
      results: results
    });

  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { error: 'Failed to scan catalog' },
      { status: 500 }
    );
  }
}