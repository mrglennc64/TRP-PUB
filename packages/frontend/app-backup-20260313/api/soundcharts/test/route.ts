import { NextResponse } from 'next/server';
import { soundcharts } from '@/lib/soundcharts';

export async function GET() {
  const appId = process.env.SOUNDCHARTS_APP_ID;
  const apiKey = process.env.SOUNDCHARTS_API_KEY;
  if (!appId || !apiKey) {
    return NextResponse.json({
      success: false,
      error: 'Missing credentials',
      details: {
        appId: appId ? 'present' : 'missing',
        apiKey: apiKey ? 'present' : 'missing'
      }
    }, { status: 400 });
  }
  const baseUrls = [
    'https://api.soundcharts.com/api/v2',
    'https://api.soundcharts.com/v2',
    'https://api.soundcharts.com/api/v1',
    'https://api.soundcharts.com/v1',
  ];
  const endpoints = [
    '/artist/search?name=Kendrick%20Lamar',
    '/search/artist?q=Kendrick%20Lamar',
    '/artists?search=Kendrick%20Lamar',
    '/artist?name=Kendrick%20Lamar',
  ];
  const results = [];
  for (const baseUrl of baseUrls) {
    for (const endpoint of endpoints) {
      const url = `${baseUrl}${endpoint}`;
      try {
        console.log(`Testing: ${url}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(url, {
          headers: {
            'x-api-key': apiKey,
            'x-app-id': appId,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        let data = null;
        let text = null;
        try {
          text = await response.text();
          data = JSON.parse(text);
        } catch {
          // Not JSON
        }
        results.push({
          url,
          status: response.status,
          ok: response.ok,
          dataType: data ? 'json' : 'text',
          sample: data ? JSON.stringify(data).substring(0, 200) : text?.substring(0, 200),
        });
        if (response.ok) {
          break;
        }
      } catch (error: any) {
        results.push({
          url,
          error: error.message,
        });
      }
    }
  }
  const workingEndpoint = results.find(r => r.ok);
  return NextResponse.json({
    credentials: {
      appId: appId.substring(0, 5) + '...',
      apiKey: apiKey.substring(0, 3) + '...',
    },
    working: workingEndpoint ? {
      url: workingEndpoint.url,
      status: workingEndpoint.status,
      sample: workingEndpoint.sample
    } : null,
    allTests: results
  });
}
