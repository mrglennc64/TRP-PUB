'use client';
import { useState } from 'react';
import Link from 'next/link';
import RiskAuditDisplay from '@/components/RiskAuditDisplay';

export default function FreeAuditPage() {
  const [searchMethod, setSearchMethod] = useState<'isrc' | 'artist'>('isrc');
  const [isrc, setIsrc] = useState('');
  const [artist, setArtist] = useState('');
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [artistResults, setArtistResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAuditResult(null);
    setArtistResults([]);

    try {
      if (searchMethod === 'isrc') {
        // --- ISRC path: full metadata audit ---
        const clean = isrc.trim().replace(/-/g, '').toUpperCase();
        if (!clean) throw new Error('Enter an ISRC code');

        const res = await fetch('/api/royalty-finder/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isrc: clean }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Audit failed');
        setAuditResult(data);

      } else {
        // --- Artist name path: search SMPT for matching artists ---
        const q = artist.trim();
        if (!q) throw new Error('Enter an artist or song name');

        const res = await fetch(`/api/royalty-finder/search/artist?query=${encodeURIComponent(q)}&limit=8`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Search failed');
        setArtistResults(data.artists || []);
        if (!data.artists?.length) setError('No artists found. Try a different spelling or switch to ISRC search.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white py-12">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="text-xs text-indigo-400 hover:text-indigo-300 mb-4 inline-block">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Free Royalty Audit</h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Enter an ISRC to run a metadata audit across SMPT, ASCAP, BMI, and SoundExchange.
            Or search by name to find registrations, then look up ISRCs and check MLC.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setSearchMethod('isrc'); setError(''); setArtistResults([]); setAuditResult(null); }}
            className={`px-5 py-2 rounded text-sm font-medium transition ${
              searchMethod === 'isrc'
                ? 'bg-indigo-600 text-white'
                : 'bg-[#1e293b] text-slate-300 hover:bg-slate-700'
            }`}
          >
            Search by ISRC
          </button>
          <button
            onClick={() => { setSearchMethod('artist'); setError(''); setArtistResults([]); setAuditResult(null); }}
            className={`px-5 py-2 rounded text-sm font-medium transition ${
              searchMethod === 'artist'
                ? 'bg-indigo-600 text-white'
                : 'bg-[#1e293b] text-slate-300 hover:bg-slate-700'
            }`}
          >
            Search by Artist / Song Name
          </button>
        </div>

        {/* Form */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {searchMethod === 'isrc' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  ISRC Code
                </label>
                <input
                  type="text"
                  value={isrc}
                  onChange={(e) => setIsrc(e.target.value)}
                  placeholder="e.g. USUM71703861"
                  className="w-full px-4 py-2.5 bg-[#0a0f1e] border border-slate-700 text-slate-200 placeholder-slate-600 text-sm rounded focus:outline-none focus:border-indigo-500 transition"
                />
                <p className="text-xs text-slate-600 mt-2">
                  Example: USUM71703861 — Carly Rae Jepsen · Cut to the Feeling
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Artist or Song Name
                </label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="e.g. Carly Rae Jepsen, Drake, SZA..."
                  className="w-full px-4 py-2.5 bg-[#0a0f1e] border border-slate-700 text-slate-200 placeholder-slate-600 text-sm rounded focus:outline-none focus:border-indigo-500 transition"
                />
                <p className="text-xs text-slate-600 mt-2">
                  Returns matching artists from SMPT. Select one to look up their ISRCs and MLC registration.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded transition disabled:opacity-50"
            >
              {loading
                ? (searchMethod === 'isrc' ? 'Scanning SMPT...' : 'Searching...')
                : (searchMethod === 'isrc' ? 'Run Audit' : 'Find Artist')}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* ISRC Audit Results */}
        {auditResult && (
          <div className="mb-6">
            <RiskAuditDisplay auditResult={auditResult} />
            {/* MLC cross-check CTA */}
            <div className="mt-4 p-4 bg-[#0f172a] border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300 font-medium">Check MLC for unclaimed mechanical royalties</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  ISRC: {auditResult.isrc} · Song: {auditResult.song_title}
                </p>
              </div>
              <Link
                href={`/mlc-search?q=${encodeURIComponent(auditResult.isrc)}`}
                className="flex-shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded transition"
              >
                Search MLC →
              </Link>
            </div>
          </div>
        )}

        {/* Artist Search Results */}
        {artistResults.length > 0 && (
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg overflow-hidden mb-6">
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-800/30">
              <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                {artistResults.length} Artists Found — Select to check MLC &amp; ISRC registrations
              </p>
            </div>
            <div className="divide-y divide-slate-800">
              {artistResults.map((a: any) => (
                <div key={a.mbid} className="flex items-center justify-between px-4 py-3 hover:bg-slate-800/20 transition">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{a.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {[a.type, a.country, a.disambiguation].filter(Boolean).join(' · ')}
                    </p>
                    <p className="text-[10px] font-mono text-slate-700 mt-0.5">MBID: {a.mbid}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    {/* MLC lookup by name */}
                    <Link
                      href={`/mlc-search?q=${encodeURIComponent(a.name)}`}
                      className="px-3 py-1.5 bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-semibold rounded transition"
                    >
                      MLC →
                    </Link>
                    {/* Royalty finder for full metadata */}
                    <Link
                      href={`/royalty-finder?q=${encodeURIComponent(a.name)}`}
                      className="px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold rounded transition"
                    >
                      ISRCs →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-slate-800 bg-slate-800/10">
              <p className="text-xs text-slate-600">
                Once you have an ISRC, come back and run a full metadata audit using "Search by ISRC" above.
              </p>
            </div>
          </div>
        )}

        {/* Bottom info row */}
        <div className="grid grid-cols-3 gap-4 mt-8 text-center">
          {[
            ['SMPT', 'Global recording registry · 2M+ artists'],
            ['MLC Database', 'US mechanical royalties · 5.7M+ songs'],
            ['PRO Coverage', 'ASCAP · BMI · SESAC · SOCAN · PRS'],
          ].map(([title, sub]) => (
            <div key={title} className="bg-[#0f172a] border border-slate-800 p-4 rounded-lg">
              <p className="text-xs font-semibold text-slate-300">{title}</p>
              <p className="text-[11px] text-slate-600 mt-1">{sub}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
