import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import path from 'path';

export const maxDuration = 45;

function runProbe(args: string[]): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const script = path.join(process.cwd(), 'scripts', 'sx-probe.mjs');
    execFile('node', [script, ...args], { timeout: 40000 }, (err, stdout, stderr) => {
      if (err && !stdout) { reject(new Error(stderr || String(err))); return; }
      try { resolve(JSON.parse(stdout)); }
      catch { reject(new Error('Bad JSON: ' + stdout.slice(0, 200))); }
    });
  });
}

export async function GET(req: NextRequest) {
  const isrc   = req.nextUrl.searchParams.get('isrc');
  const artist = req.nextUrl.searchParams.get('artist');
  const title  = req.nextUrl.searchParams.get('title');

  if (!isrc && !artist) {
    return NextResponse.json({ error: 'isrc or artist required' }, { status: 400 });
  }

  const args: string[] = [];
  if (isrc)   { args.push('--isrc',   isrc); }
  if (artist) { args.push('--artist', artist); }
  if (title)  { args.push('--title',  title); }

  try {
    const result = await runProbe(args);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
