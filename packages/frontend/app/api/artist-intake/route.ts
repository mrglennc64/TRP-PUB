import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const timestamp = new Date().toISOString();
    const entry = { ...data, received_at: timestamp };
    
    // Store to a JSON log file (in production use a proper DB)
    const logPath = path.join(process.cwd(), 'intake_submissions.jsonl');
    fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');
    
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
