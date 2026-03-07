'use client';
import { useState } from 'react';
import RiskAuditDisplay from '@/components/RiskAuditDisplay';

export default function FreeAuditPage() {
  const [searchMethod, setSearchMethod] = useState('isrc');
  const [isrc, setIsrc] = useState('');
  const [artist, setArtist] = useState('');
  const [track, setTrack] = useState('');
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAuditResult(null);

    try {
      let payload: any = {};
      
      if (searchMethod === 'isrc' && isrc) {
        payload.isrc = isrc.toUpperCase();
      } else if (searchMethod === 'artist' && artist && track) {
        payload.artist = artist;
        payload.track = track;
      } else {
        throw new Error('Please provide search criteria');
      }

      // Using relative URL - will be proxied by Next.js
      const response = await fetch('/api/royalty-finder/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Audit failed');
      }

      setAuditResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white bg-[#0a0f1e] text-white py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Free Royalty Audit</h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto">
            Enter an ISRC to see exactly how much money you're leaving on the table. 
            We'll scan global databases for metadata gaps that block your payments.
          </p>
        </div>

        {/* Search Method Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setSearchMethod('isrc')}
            className={`px-6 py-3 rounded-xl font-medium transition ${
              searchMethod === 'isrc' 
                ? 'bg-indigo-900 text-white' 
                : 'bg-[#1e293b] text-slate-200 border border-white/20 hover:bg-[#0a0f1e]'
            }`}
          >
            Search by ISRC
          </button>
          <button
            onClick={() => setSearchMethod('artist')}
            className={`px-6 py-3 rounded-xl font-medium transition ${
              searchMethod === 'artist' 
                ? 'bg-indigo-900 text-white' 
                : 'bg-[#1e293b] text-slate-200 border border-white/20 hover:bg-[#0a0f1e]'
            }`}
          >
            Search by Artist + Track
          </button>
        </div>

        {/* Audit Form */}
        <div className="bg-[#1e293b] rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {searchMethod === 'isrc' ? (
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  ISRC Code
                </label>
                <input
                  type="text"
                  value={isrc}
                  onChange={(e) => setIsrc(e.target.value)}
                  placeholder="e.g., USUM71703861"
                  className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white bg-[#1e293b] placeholder-slate-600"
                />
                <p className="text-sm text-slate-400 mt-2">
                  Try: USUM71703861 (Carly Rae Jepsen - Cut to the Feeling)
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="Carly Rae Jepsen"
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white bg-[#1e293b] placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Track Title
                  </label>
                  <input
                    type="text"
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    placeholder="Cut to the Feeling"
                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 text-white bg-[#1e293b] placeholder-slate-600"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-900 text-white py-4 rounded-xl font-semibold hover:bg-indigo-800 disabled:opacity-50 transition text-lg flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scanning MusicBrainz...
                </>
              ) : (
                '🔍 Run Free Audit'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-200 rounded-xl">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Audit Results */}
        {auditResult && <RiskAuditDisplay auditResult={auditResult} />}

        {/* Trust Signals */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div className="bg-[#1e293b] p-6 rounded-xl shadow-sm">
            <div className="text-4xl mb-3">🎵</div>
            <p className="font-semibold text-white">MusicBrainz Verified</p>
            <p className="text-sm text-slate-300">Global recording database with 2M+ artists</p>
          </div>
          <div className="bg-[#1e293b] p-6 rounded-xl shadow-sm">
            <div className="text-4xl mb-3">📊</div>
            <p className="font-semibold text-white">Real ISRC Data</p>
            <p className="text-sm text-slate-300">Pull real ISRCs from MusicBrainz</p>
          </div>
          <div className="bg-[#1e293b] p-6 rounded-xl shadow-sm">
            <div className="text-4xl mb-3">⚖️</div>
            <p className="font-semibold text-white">PRO Cross-Referenced</p>
            <p className="text-sm text-slate-300">ASCAP/BMI/SOCAN metadata validation</p>
          </div>
        </div>
      </div>
    </div>
  );
}


