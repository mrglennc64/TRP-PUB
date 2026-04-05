import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const logPath = path.join(process.cwd(), 'intake_submissions.jsonl');
    if (!fs.existsSync(logPath)) {
      return NextResponse.json([]);
    }
    const lines = fs.readFileSync(logPath, 'utf-8')
      .split('\n')
      .filter(l => l.trim())
      .map(l => JSON.parse(l));
    // Return newest first
    return NextResponse.json(lines.reverse());
  } catch (e) {
    return NextResponse.json([]);
  }
}
