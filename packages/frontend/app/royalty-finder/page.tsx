'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function RoyaltyFinderPage() {
  const [searchType, setSearchType] = useState('artist');
  const [artistQuery, setArtistQuery] = useState('');
  const [isrc, setIsrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);

    try {
      let url = '';
      const options: RequestInit = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      };

      if (searchType === 'artist') {
        if (!artistQuery.trim()) {
          throw new Error('Please enter an artist name');
        }
        url = `/api/royalty-finder/search/artist?query=${encodeURIComponent(artistQuery)}`;
      } else {
        if (!isrc.trim()) {
          throw new Error('Please enter an ISRC code');
        }
        url = `/api/royalty-finder/audit`;
        options.method = 'POST';
        options.body = JSON.stringify({ isrc: isrc.toUpperCase().replace(/-/g, '') });
      }

      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Search failed');
      }

      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Missing Royalties</h1>
          <p className="text-lg text-gray-800">
            Hunt down unclaimed bags from streams, syncs, performances & playlists. 
            Scan MusicBrainz for recordings, ISRCs, and rights gaps — built for hip hop & R&B creators.
          </p>
        </div>

        {/* Search Type Toggle */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSearchType('artist')}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                searchType === 'artist' 
                  ? 'bg-indigo-900 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Search by Artist
            </button>
            <button
              onClick={() => setSearchType('isrc')}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                searchType === 'isrc' 
                  ? 'bg-indigo-900 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Lookup by ISRC
            </button>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            {searchType === 'artist' ? (
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Artist Name
                </label>
                <input
                  type="text"
                  value={artistQuery}
                  onChange={(e) => setArtistQuery(e.target.value)}
                  placeholder="e.g., Drake, Travis Scott, Kendrick Lamar"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white placeholder-gray-500"
                  required
                />
                <p className="text-sm text-gray-600 mt-2">
                  Search MusicBrainz for artist information
                </p>
              </div>
            ) : (
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
                  Example: USUM71703861 (Drake - God's Plan)
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-800 disabled:opacity-50 transition"
            >
              {loading ? '🔍 Searching MusicBrainz...' : '🔍 Find Royalties'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {results && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Results from MusicBrainz</h2>
            
            {searchType === 'artist' && results.artists && (
              <div className="space-y-4">
                {results.artists.map((artist: any) => (
                  <div key={artist.mbid} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <h3 className="text-xl font-semibold text-indigo-900">{artist.name}</h3>
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <span className="text-gray-600">MBID:</span>
                        <span className="ml-2 font-mono text-xs text-gray-800">{artist.mbid}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <span className="ml-2 text-gray-800">{artist.type || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Country:</span>
                        <span className="ml-2 text-gray-800">{artist.country || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Score:</span>
                        <span className="ml-2 text-gray-800">{artist.score}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchType === 'isrc' && results && (
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 text-lg mb-3">Recording Found</h3>
                <div className="space-y-2 text-gray-800">
                  <p><span className="font-medium">Title:</span> {results.song_title}</p>
                  {results.artist && (
                    <p><span className="font-medium">Artist:</span> {results.artist}</p>
                  )}
                  {results.isrc && (
                    <p><span className="font-medium">ISRC:</span> {results.isrc}</p>
                  )}
                  <p className="text-sm text-gray-700 mt-2">Risk Score: {results.score}/100</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feature Cards - All black text */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Global PRO Coverage</h3>
            <p className="text-gray-700">
              Scans MusicBrainz + direct links to ASCAP, BMI, SOCAN, PRS — find unclaimed from viral TikToks to radio spins.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">🎫</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real ISRC Data</h3>
            <p className="text-gray-700">
              Pull real ISRCs from MusicBrainz to verify neighboring rights and SoundExchange claims.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Claim Your Bag</h3>
            <p className="text-gray-700">
              Direct links to every PRO and rights org — no more guessing where to go.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
