export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    // In Next.js App Router, params might be a Promise that needs awaiting
    const { uuid } = await params;
    
    if (!uuid) {
      return NextResponse.json(
        { error: 'UUID parameter is missing' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      uuid,
      message: 'Artist API route working'
    });
  } catch (error) {
    console.error('Error in artist route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
