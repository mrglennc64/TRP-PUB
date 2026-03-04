'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ISRCConfirmationModal from '@/components/ISRCConfirmationModal';

interface AuditResult {
  score: number;
  status: string;
  risk_level: string;
  risk_color: string;
  summary: string;
  estimated_loss: string;
  flags: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  revenue_impact: any;
  action_items: string[];
  song_title: string;
  artist: string;
  mbid?: string;
  recording_id?: string;
  streaming_stats: any;
  isrc: string;
  resolution?: {
    method: string;
    confidence: string;
    original_isrc: string;
    working_isrc?: string;
    mapping_id?: number;
    usage_count?: number;
  };
  from_mapping?: boolean;
}

export default function RoyaltyFinderPage() {
  const [searchType, setSearchType] = useState('isrc');
  const [isrc, setIsrc] = useState('');
  const [artist, setArtist] = useState('');
  const [track, setTrack] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AuditResult | null>(null);
  const [error, setError] = useState('');
  
  // Confirmation modal state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingMapping, setPendingMapping] = useState<{
    originalIsrc: string;
    suggestedTrack: {
      title: string;
      artist: string;
      isrc: string;
      mbid?: string;
      recording_id?: string;
      confidence?: string;
    };
  } | null>(null);

  // Load recent ISRCs from localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  useEffect(() => {
    const stored = localStorage.getItem('recentIsrcs');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  const saveRecentSearch = (isrc: string) => {
    const updated = [isrc, ...recentSearches.filter(s => s !== isrc)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentIsrcs', JSON.stringify(updated));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);
    setPendingMapping(null);

    try {
      let payload: any = {};
      
      if (searchType === 'isrc') {
        if (!isrc.trim()) throw new Error('Please enter an ISRC code');
        const cleanIsrc = isrc.toUpperCase().replace(/-/g, '').trim();
        payload.isrc = cleanIsrc;
        saveRecentSearch(cleanIsrc);
      } else {
        if (!artist.trim() || !track.trim()) throw new Error('Please enter both artist and track');
        payload.artist = artist.trim();
        payload.track = track.trim();
      }

      console.log('Searching with payload:', payload);

      const response = await fetch('/api/royalty-finder/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Search failed');
      }

      console.log('Got results:', data);

      // Check if we need confirmation (resolution found but not strict match and not saved mapping)
      if (data.resolution && 
          data.resolution.method !== 'strict_isrc' && 
          data.resolution.method !== 'saved_mapping' &&
          data.resolution.working_isrc) {
        
        // Show confirmation modal
        setPendingMapping({
          originalIsrc: payload.isrc,
          suggestedTrack: {
            title: data.song_title,
            artist: data.artist,
            isrc: data.resolution.working_isrc,
            mbid: data.mbid,
            recording_id: data.recording_id,
            confidence: data.resolution.confidence
          }
        });
        setShowConfirmation(true);
      }

      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmMapping = async () => {
    // After confirmation, refresh the search to show the saved mapping working
    if (pendingMapping) {
      setLoading(true);
      try {
        const response = await fetch('/api/royalty-finder/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isrc: pendingMapping.originalIsrc })
        });
        const data = await response.json();
        setResults(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const getRiskBadge = (color: string, level: string) => {
    const colors = {
      green: 'bg-green-100 text-green-800 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      red: 'bg-red-100 text-red-800 border-red-200'
    };
    const icons = {
      green: '✅',
      yellow: '⚠️',
      red: '🚨'
    };
    
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${colors[color as keyof typeof colors] || colors.green}`}>
        <span>{icons[color as keyof typeof icons]}</span>
        <span className="font-medium">{level}</span>
        <span className="text-sm opacity-75">Score: {results?.score}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block font-medium">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Royalty Finder</h1>
          <p className="text-lg text-gray-800 flex items-center gap-2">
            Search MusicBrainz for recordings, ISRCs, and metadata gaps.
            {results?.from_mapping && (
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ✅ Resolved from saved mapping
              </span>
            )}
          </p>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mb-4 flex items-center gap-2 text-sm">
            <span className="text-gray-600">Recent:</span>
            {recentSearches.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsrc(s);
                  setSearchType('isrc');
                }}
                className="px-3 py-1 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSearchType('isrc')}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                searchType === 'isrc' 
                  ? 'bg-indigo-900 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              🔍 Search by ISRC
            </button>
            <button
              onClick={() => setSearchType('artist')}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                searchType === 'artist' 
                  ? 'bg-indigo-900 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              🎤 Search by Artist + Track
            </button>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            {searchType === 'isrc' ? (
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  ISRC Code
                </label>
                <input
                  type="text"
                  value={isrc}
                  onChange={(e) => setIsrc(e.target.value)}
                  placeholder="e.g., USUM71703861"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white placeholder-gray-500"
                  required
                />
                <p className="text-sm text-gray-600 mt-2">
                  Example: USUM71703861 (Carly Rae Jepsen - Cut to the Feeling)
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="Future"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white placeholder-gray-500"
                    required={searchType === 'artist'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Track Title
                  </label>
                  <input
                    type="text"
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    placeholder="Mask Off"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white placeholder-gray-500"
                    required={searchType === 'artist'}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-800 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching MusicBrainz...
                </>
              ) : (
                '🔍 Find Royalties'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium flex items-center gap-2">
                <span>❌</span> {error}
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        {results && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Audit Results</h2>
              {results.risk_color && getRiskBadge(results.risk_color, results.risk_level)}
            </div>
            
            {/* Risk Summary */}
            {results.risk_level && (
              <div className={`mb-6 p-4 rounded-lg border ${
                results.risk_color === 'green' ? 'bg-green-50 border-green-200' :
                results.risk_color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                'bg-red-50 border-red-200'
              }`}>
                <p className="text-sm font-medium">{results.summary}</p>
                {results.estimated_loss && (
                  <p className="text-sm mt-2 font-bold">
                    Estimated Loss: {results.estimated_loss}
                  </p>
                )}
              </div>
            )}

            {/* Track Info */}
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  <span className="font-medium">Track:</span> {results.song_title || 'Unknown'}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Artist:</span> {results.artist || 'Unknown'}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">ISRC:</span> {results.isrc || 'Unknown'}
                </p>
                {results.mbid && (
                  <p className="text-xs text-gray-500 mt-2 font-mono">
                    MBID: {results.mbid}
                  </p>
                )}
              </div>

              {/* Resolution Info */}
              {results.resolution && results.resolution.method !== 'strict_isrc' && (
                <div className={`p-4 rounded-lg border ${
                  results.resolution.method === 'saved_mapping' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <p className="font-medium flex items-center gap-2">
                    {results.resolution.method === 'saved_mapping' ? '✅' : '🔍'} 
                    Resolution Method: {results.resolution.method === 'saved_mapping' ? 'Saved Mapping' : 'Fuzzy Match'}
                  </p>
                  {results.resolution.working_isrc && (
                    <p className="text-sm mt-1">
                      Working ISRC: <span className="font-mono">{results.resolution.working_isrc}</span>
                    </p>
                  )}
                  {results.resolution.usage_count && (
                    <p className="text-xs text-gray-500 mt-1">
                      Used {results.resolution.usage_count} times
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Flags/Issues */}
            {results.flags && results.flags.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>🚩</span> Detected Issues
                </h3>
                <div className="space-y-2">
                  {results.flags.map((flag, idx) => (
                    <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
                      <span className="font-medium text-red-800">{flag.icon} {flag.title}</span>
                      <p className="text-red-700 mt-1">{flag.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items */}
            {results.action_items && results.action_items.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📋</span> Recommended Actions
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {results.action_items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Global PRO Coverage</h3>
            <p className="text-gray-700">
              Scans MusicBrainz + direct links to ASCAP, BMI, SOCAN, PRS.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="text-3xl mb-3">🎫</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart ISRC Resolution</h3>
            <p className="text-gray-700">
              Finds matches even when ISRC isn't in MusicBrainz.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="text-3xl mb-3">💾</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Self-Learning Database</h3>
            <p className="text-gray-700">
              Your confirmations make future searches faster.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {pendingMapping && (
        <ISRCConfirmationModal
          isOpen={showConfirmation}
          onClose={() => {
            setShowConfirmation(false);
            setPendingMapping(null);
          }}
          onConfirm={handleConfirmMapping}
          originalIsrc={pendingMapping.originalIsrc}
          suggestedTrack={pendingMapping.suggestedTrack}
        />
      )}
    </div>
  );
}
