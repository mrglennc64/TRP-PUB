'use client';

import { useState, useEffect } from 'react';

export default function TestSoundcharts() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const response = await fetch('/api/soundcharts/test');
      const result = await response.json();
      
      if (result.success) {
        setStatus('success');
        setData(result);
      } else {
        setStatus('error');
        setError(result.error);
      }
    } catch (err: any) {
      setStatus('error');
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Soundcharts API Test</h1>
        
        {status === 'loading' && (
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Testing connection...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center space-x-2 text-green-600 mb-4">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <span className="font-medium">Connected Successfully</span>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-500">Found {data.artistCount} artists for "Kendrick Lamar"</p>
                {data.firstArtist && (
                  <div className="mt-2">
                    <p className="font-medium">{data.firstArtist.name}</p>
                    <p className="text-xs text-gray-400">UUID: {data.firstArtist.uuid}</p>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-gray-600">
                <p>✅ API Key working</p>
                <p>✅ App ID working</p>
                <p>✅ Can search artists</p>
              </div>
            </div>
          </div>
        )}
        
        {status === 'error' && (
          <div className="bg-white rounded-xl p-6 border-l-4 border-red-500">
            <h2 className="text-red-600 font-semibold mb-2">Connection Failed</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <div className="bg-red-50 p-4 rounded text-sm">
              <p className="font-medium mb-2">Troubleshooting:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Check that SOUNDCHARTS_APP_ID is set correctly</li>
                <li>Check that SOUNDCHARTS_API_KEY is set correctly</li>
                <li>Verify your API key has the right permissions</li>
                <li>Check if you're behind a corporate firewall</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
