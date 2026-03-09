'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const ISRC_RE = /^[A-Z]{2}[A-Z0-9]{3}\d{2}\d{5}$/i;

export default function RoyaltyFinderPage() {
  return (
    <Suspense>
      <RoyaltyFinderContent />
    </Suspense>
  );
}

function RoyaltyFinderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchType, setSearchType] = useState('artist');
  const [artistQuery, setArtistQuery] = useState('');
  const [isrc, setIsrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');

  // Per-artist expanded state: mbid → { open, loadingIsrcs, recordings }
  const [expanded, setExpanded] = useState<Record<string, { open: boolean; loading: boolean; recordings: any[] }>>({});

  const toggleArtist = async (mbid: string) => {
    if (expanded[mbid]?.open) {
      setExpanded(p => ({ ...p, [mbid]: { ...p[mbid], open: false } }));
      return;
    }
    if (expanded[mbid]?.recordings?.length) {
      setExpanded(p => ({ ...p, [mbid]: { ...p[mbid], open: true } }));
      return;
    }
    // Fetch ISRCs
    setExpanded(p => ({ ...p, [mbid]: { open: true, loading: true, recordings: [] } }));
    try {
      const res = await fetch(`/api/royalty-finder/artist/${mbid}/recordings?limit=15`);
      const data = await res.json();
      setExpanded(p => ({ ...p, [mbid]: { open: true, loading: false, recordings: data.recordings || [] } }));
    } catch {
      setExpanded(p => ({ ...p, [mbid]: { open: true, loading: false, recordings: [] } }));
    }
  };

  // Pre-populate from landing page query and auto-search
  useEffect(() => {
    const q = searchParams.get('q');
    if (!q) return;
    const clean = q.trim().replace(/-/g, '').toUpperCase();
    if (ISRC_RE.test(clean)) {
      setSearchType('isrc');
      setIsrc(q.trim());
      // auto-trigger search
      setTimeout(() => document.getElementById('search-btn')?.click(), 100);
    } else {
      setSearchType('artist');
      setArtistQuery(q.trim());
      setTimeout(() => document.getElementById('search-btn')?.click(), 100);
    }
  }, [searchParams]);

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
            Scan SMPT for recordings, ISRCs, and rights gaps — built for hip hop & R&B creators.
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
                  Search SMPT for artist information
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
              id="search-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {loading ? '🔍 Searching SMPT...' : '🔍 Find Royalties'}
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
            <h2 className="text-2xl font-bold text-white mb-6">Results from SMPT</h2>
            
            {searchType === 'artist' && results.artists && (
              <div className="space-y-3">
                {results.artists.map((artist: any) => {
                  const state = expanded[artist.mbid];
                  return (
                    <div key={artist.mbid} className="border border-slate-700 rounded-lg overflow-hidden">
                      {/* Artist row — click to expand */}
                      <button
                        onClick={() => toggleArtist(artist.mbid)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800/40 transition text-left"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-100">{artist.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {[artist.type, artist.country, artist.disambiguation].filter(Boolean).join(' · ')}
                            {' · '}
                            <span className="font-mono">{artist.mbid.slice(0,8)}…</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                          <span className="text-[11px] font-bold text-indigo-400">{artist.score}%</span>
                          <span className="text-xs text-slate-400 border border-slate-600 px-2 py-0.5 rounded">
                            {state?.open ? '▲ Hide ISRCs' : '▼ Get ISRCs'}
                          </span>
                        </div>
                      </button>

                      {/* Expanded: recordings / ISRCs */}
                      {state?.open && (
                        <div className="border-t border-slate-700 bg-[#080d1a]">
                          {state.loading && (
                            <p className="px-4 py-3 text-xs text-slate-400">Loading recordings from SMPT...</p>
                          )}
                          {!state.loading && state.recordings.length === 0 && (
                            <p className="px-4 py-3 text-xs text-slate-500">No ISRC-linked recordings found in SMPT.</p>
                          )}
                          {!state.loading && state.recordings.map((rec: any) => (
                            <div key={rec.id} className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/60 last:border-0 hover:bg-slate-800/20 transition">
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-slate-200 truncate">{rec.title}</p>
                                {rec.primary_isrc ? (
                                  <p className="text-[10px] font-mono text-indigo-400 mt-0.5">{rec.primary_isrc}</p>
                                ) : (
                                  <p className="text-[10px] text-slate-600 mt-0.5">No ISRC on record</p>
                                )}
                              </div>
                              {rec.primary_isrc && (
                                <button
                                  onClick={() => router.push(`/free-audit?isrc=${rec.primary_isrc}`)}
                                  className="ml-3 flex-shrink-0 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded transition"
                                >
                                  Forensic Audit →
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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
              Scans SMPT + direct links to ASCAP, BMI, SOCAN, PRS — find unclaimed from viral TikToks to radio spins.
            </p>
          </div>
          <div className="bg-[#0f172a] p-6 rounded-xl shadow-sm border border-white/10">
            <div className="text-3xl mb-3">🎫</div>
            <h3 className="text-lg font-semibold text-white mb-2">Real ISRC Data</h3>
            <p className="text-slate-300">
              Pull real ISRCs from SMPT to verify neighboring rights and SoundExchange claims.
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
