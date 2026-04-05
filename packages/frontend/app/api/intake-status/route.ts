import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function fuzzyMatch(a: string, b: string) {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na || !nb) return false;
  return na.includes(nb) || nb.includes(na);
}

export async function GET(req: NextRequest) {
  const artist = req.nextUrl.searchParams.get('artist') || '';
  const track = req.nextUrl.searchParams.get('track') || '';

  if (!artist && !track) {
    return NextResponse.json({ submitted: false });
  }

  try {
    const logPath = path.join(process.cwd(), 'intake_submissions.jsonl');
    if (!fs.existsSync(logPath)) {
      return NextResponse.json({ submitted: false });
    }

    const lines = fs.readFileSync(logPath, 'utf-8').trim().split('\n').filter(Boolean);

    // Search newest first
    for (const line of [...lines].reverse()) {
      try {
        const entry = JSON.parse(line);
        const artistMatch = !artist || fuzzyMatch(entry.artist_query || '', artist);
        const trackMatch = !track || fuzzyMatch(entry.track_query || '', track);
        if (artistMatch && trackMatch) {
          return NextResponse.json({
            submitted: true,
            case_ref: entry.case_ref || null,
            received_at: entry.received_at || null,
          });
        }
      } catch {}
    }

    return NextResponse.json({ submitted: false });
  } catch {
    return NextResponse.json({ submitted: false });
  }
}
