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
    <div className="min-h-screen bg-[#0a0f1e] py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">Find Missing Royalties</h1>
          <p className="text-lg text-slate-300">
            Hunt down unclaimed bags from streams, syncs, performances & playlists. 
            Scan MusicBrainz for recordings, ISRCs, and rights gaps — built for hip hop & R&B creators.
          </p>
        </div>

        {/* Search Type Toggle */}
        <div className="bg-[#0f172a] rounded-xl shadow-lg p-6 mb-8 border border-white/10">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSearchType('artist')}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                searchType === 'artist' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              Search by Artist
            </button>
            <button
              onClick={() => setSearchType('isrc')}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                searchType === 'isrc' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              Lookup by ISRC
            </button>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            {searchType === 'artist' ? (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Artist Name
                </label>
                <input
                  type="text"
                  value={artistQuery}
                  onChange={(e) => setArtistQuery(e.target.value)}
                  placeholder="e.g., Drake, Travis Scott, Kendrick Lamar"
                  className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white bg-[#0f172a] placeholder-slate-500"
                  required
                />
                <p className="text-sm text-slate-400 mt-2">
                  Search MusicBrainz for artist information
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  ISRC Code
                </label>
                <input
                  type="text"
                  value={isrc}
                  onChange={(e) => setIsrc(e.target.value)}
                  placeholder="e.g., USUM71703861"
                  className="w-full px-4 py-3 border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 text-white bg-[#0f172a] placeholder-slate-500"
                  required
                />
                <p className="text-sm text-slate-400 mt-2">
                  Example: USUM71703861 (Drake - God's Plan)
                </p>
                {/* MLC cross-link */}
                <div className="mt-3 flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <span className="text-indigo-400 text-sm">🔎 Also check for unclaimed mechanical royalties in the MLC database:</span>
                  <Link
                    href={`/mlc-search${isrc ? `?q=${encodeURIComponent(isrc)}` : ''}`}
                    className="flex-shrink-0 px-3 py-1.5 bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition"
                  >
                    Search MLC →
                  </Link>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
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
          <div className="bg-[#0f172a] rounded-xl shadow-lg p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Results from MusicBrainz</h2>
            
            {searchType === 'artist' && results.artists && (
              <div className="space-y-4">
                {results.artists.map((artist: any) => (
                  <div key={artist.mbid} className="border border-white/10 rounded-lg p-4 hover:shadow-md transition">
                    <h3 className="text-xl font-semibold text-indigo-400">{artist.name}</h3>
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <span className="text-slate-400">MBID:</span>
                        <span className="ml-2 font-mono text-xs text-slate-300">{artist.mbid}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Type:</span>
                        <span className="ml-2 text-slate-300">{artist.type || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Country:</span>
                        <span className="ml-2 text-slate-300">{artist.country || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Score:</span>
                        <span className="ml-2 text-slate-300">{artist.score}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchType === 'isrc' && results && (
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 text-lg mb-3">Recording Found</h3>
                <div className="space-y-2 text-slate-300">
                  <p><span className="font-medium">Title:</span> {results.song_title}</p>
                  {results.artist && (
                    <p><span className="font-medium">Artist:</span> {results.artist}</p>
                  )}
                  {results.isrc && (
                    <p><span className="font-medium">ISRC:</span> {results.isrc}</p>
                  )}
                  <p className="text-sm text-slate-300 mt-2">Risk Score: {results.score}/100</p>
                </div>
                {/* MLC cross-check after result */}
                <div className="mt-4 pt-4 border-t border-green-200 flex flex-wrap items-center gap-3">
                  <span className="text-sm text-green-800 font-medium">Next steps for this ISRC:</span>
                  <Link href={`/mlc-search`}
                    className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition">
                    🔎 Check MLC for unclaimed mechanicals
                  </Link>
                  <Link href="/cwr-generator"
                    className="px-3 py-1.5 bg-[#0f172a] hover:bg-[#0a0f1e] text-indigo-400 text-xs font-bold rounded-lg border border-indigo-300 transition">
                    📋 Register via CWR
                  </Link>
                  <Link href="/forensic-audit"
                    className="px-3 py-1.5 bg-[#0f172a] hover:bg-[#0a0f1e] text-slate-300 text-xs font-bold rounded-lg border border-white/10 transition">
                    🔬 Full Audit
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feature Cards - All black text */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-[#0f172a] p-6 rounded-xl shadow-sm border border-white/10">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-white mb-2">Global PRO Coverage</h3>
            <p className="text-slate-300">
              Scans MusicBrainz + direct links to ASCAP, BMI, SOCAN, PRS — find unclaimed from viral TikToks to radio spins.
            </p>
          </div>
          <div className="bg-[#0f172a] p-6 rounded-xl shadow-sm border border-white/10">
            <div className="text-3xl mb-3">🎫</div>
            <h3 className="text-lg font-semibold text-white mb-2">Real ISRC Data</h3>
            <p className="text-slate-300">
              Pull real ISRCs from MusicBrainz to verify neighboring rights and SoundExchange claims.
            </p>
          </div>
          <div className="bg-[#0f172a] p-6 rounded-xl shadow-sm border border-white/10">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-lg font-semibold text-white mb-2">Claim Your Bag</h3>
            <p className="text-slate-300">
              Direct links to every PRO and rights org — no more guessing where to go.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
