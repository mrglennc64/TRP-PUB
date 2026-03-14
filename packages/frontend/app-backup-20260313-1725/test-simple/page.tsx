'use client';

import { useState } from 'react';

export default function SimpleTest() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runTest = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/soundcharts/test');
      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Simple Soundcharts Test</h1>
        <button
          onClick={runTest}
          disabled={loading}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 mb-8"
        >
          {loading ? 'Testing...' : 'Run Test'}
        </button>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {results && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h2 className="font-semibold mb-4">Credentials</h2>
              <pre className="bg-gray-50 p-4 rounded text-sm">
                {JSON.stringify(results.credentials, null, 2)}
              </pre>
            </div>
            {results.working && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="font-semibold text-green-800 mb-4">✅ Working Endpoint Found</h2>
                <pre className="bg-white p-4 rounded text-sm">
                  {JSON.stringify(results.working, null, 2)}
                </pre>
              </div>
            )}
            <div className="bg-white rounded-lg p-6">
              <h2 className="font-semibold mb-4">All Test Results</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {results.allTests.map((test: any, i: number) => (
                  <div key={i} className={`p-4 rounded ${
                    test.ok ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <p className="font-mono text-sm break-all">{test.url}</p>
                    <p className="text-sm mt-1">
                      Status: {test.status || 'Error'} - {test.ok ? 'OK' : 'Failed'}
                    </p>
                    {test.error && (
                      <p className="text-sm text-red-600 mt-1">Error: {test.error}</p>
                    )}
                    {test.sample && (
                      <pre className="text-xs mt-2 bg-white/50 p-2 rounded overflow-x-auto">
                        {test.sample}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
