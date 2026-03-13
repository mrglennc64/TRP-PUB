import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Log the application (in production, save to database)
    console.log('Founding member application:', {
      name: body.name,
      email: body.email,
      catalogSize: body.catalogSize,
      referral: body.referral,
      headache: body.headache,
      timestamp: new Date().toISOString()
    });

    // Here you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Add to CRM
    // 4. Forward to Python backend if needed

    return NextResponse.json({ 
      success: true, 
      message: 'Application received successfully' 
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}