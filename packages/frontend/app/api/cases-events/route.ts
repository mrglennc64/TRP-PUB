import { NextRequest, NextResponse } from 'next/server';
import { appendFileSync } from 'fs';
import { join } from 'path';

const LOG_FILE = join(process.cwd(), 'cases_events.jsonl');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const ua = req.headers.get('user-agent') || 'unknown';
    const event = {
      ...body,
      ip,
      ua,
      ts: new Date().toISOString(),
    };
    appendFileSync(LOG_FILE, JSON.stringify(event) + '\n');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { readFileSync, existsSync } = await import('fs');
    if (!existsSync(LOG_FILE)) return NextResponse.json({ events: [] });
    const lines = readFileSync(LOG_FILE, 'utf8').trim().split('\n').filter(Boolean);
    const events = lines.map(l => JSON.parse(l)).reverse();
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: [] });
  }
}
