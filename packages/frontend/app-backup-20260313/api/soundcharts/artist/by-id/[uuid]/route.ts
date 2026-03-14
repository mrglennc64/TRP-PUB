export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { uuid: string } }
) {
  console.log('Artist by-id API called with params:', JSON.stringify(params));
  
  try {
    // More robust params extraction
    const uuid = params?.uuid;
    
    if (!uuid) {
      console.error('No UUID provided in params');
      return NextResponse.json(
        { error: 'UUID parameter is missing', params },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      uuid: uuid,
      message: 'Artist API working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in artist route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
