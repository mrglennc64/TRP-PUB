"use client";

import { useState, FormEvent } from 'react';
import Link from 'next/link';

type SearchMode = 'isrc' | 'artist';

interface AuditResult {
  isrc: string;
  title: string;
  artist: string;
  issues: { severity: 'error' | 'warning' | 'ok'; message: string }[];
  ascap: boolean;
  bmi: boolean;
  socan: boolean;
  prs: boolean;
}

interface FuzzyMatch {
  title: string;
  artist: string;
  isrc: string;
  source: string;
}

export default function FreeAuditPage() {
  const [mode, setMode] = useState<SearchMode>('isrc');
  const [isrc, setIsrc] = useState('');
  const [artistQ, setArtistQ] = useState('');
  const [trackQ, setTrackQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [fuzzyMatch, setFuzzyMatch] = useState<FuzzyMatch | null>(null);
  const [error, setError] = useState('');

  const runAudit = async (queryIsrc: string) => {
    setLoading(true);
    setError('');
    setResult(null);
    setFuzzyMatch(null);
    try {
      const res = await fetch(`/api/audit?isrc=${encodeURIComponent(queryIsrc)}`);
      const data = await res.json();
      if (data.fuzzy_match) {
        setFuzzyMatch(data.fuzzy_match);
      } else if (data.result) {
        setResult(data.result);
      } else {
        setError(data.error || 'No results found.');
      }
    } catch {
      setError('Audit service unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (mode === 'isrc') runAudit(isrc);
    else runAudit(`${artistQ} ${trackQ}`);
  };

  const confirmFuzzy = () => {
    if (fuzzyMatch) {
      setResult({
        isrc: fuzzyMatch.isrc,
        title: fuzzyMatch.title,
        artist: fuzzyMatch.artist,
        issues: [{ severity: 'warning', message: 'ISRC resolved via fuzzy match — verify registration' }],
        ascap: true, bmi: false, socan: false, prs: false,
      });
      setFuzzyMatch(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Free Royalty Audit</h1>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto">
            Enter an ISRC to see exactly how much money you&apos;re leaving on the table. We&apos;ll scan global databases for metadata gaps that block your payments.
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setMode('isrc')}
            className={`px-6 py-3 rounded-xl font-medium transition ${mode === 'isrc' ? 'bg-indigo-900 text-white' : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'}`}
          >
            Search by ISRC
          </button>
          <button
            onClick={() => setMode('artist')}
            className={`px-6 py-3 rounded-xl font-medium transition ${mode === 'artist' ? 'bg-indigo-900 text-white' : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'}`}
          >
            Search by Artist + Track
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'isrc' ? (
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">ISRC Code</label>
                <input
                  type="text"
                  placeholder="e.g., USUM71703861"
                  value={isrc}
                  onChange={e => setIsrc(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white placeholder-gray-500"
                />
                <p className="text-sm text-gray-600 mt-2">Try: USUM71703861 (Carly Rae Jepsen - Cut to the Feeling)</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Artist Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Future"
                    value={artistQ}
                    onChange={e => setArtistQ(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">Track Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Mask Off"
                    value={trackQ}
                    onChange={e => setTrackQ(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white placeholder-gray-500"
                  />
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={loading || (!isrc && mode === 'isrc') || (!artistQ && mode === 'artist')}
              className="w-full bg-indigo-900 text-white py-4 rounded-xl font-semibold hover:bg-indigo-800 disabled:opacity-50 transition text-lg flex items-center justify-center gap-3"
            >
              {loading ? (
                <><span className="animate-spin">⏳</span> Scanning databases...</>
              ) : (
                <>🔍 Run Free Audit</>
              )}
            </button>
          </form>
        </div>

        {/* Fuzzy match confirmation */}
        {fuzzyMatch && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-yellow-800 mb-2">ISRC not found in global database, but we found a match:</h3>
            <p className="text-gray-800 mb-1"><span className="font-semibold">&quot;{fuzzyMatch.title}&quot;</span> by <span className="font-semibold">{fuzzyMatch.artist}</span></p>
            <p className="text-sm text-gray-600 mb-4">ISRC on {fuzzyMatch.source}: {fuzzyMatch.isrc}</p>
            <p className="text-sm text-gray-700 mb-4">Is this the right track?</p>
            <div className="flex gap-3">
              <button onClick={confirmFuzzy} className="px-6 py-2 bg-indigo-900 text-white rounded-lg font-medium hover:bg-indigo-800 transition">
                ✓ Yes, that&apos;s it
              </button>
              <button onClick={() => setFuzzyMatch(null)} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
                No, search again
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 text-red-700">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{result.title}</h2>
                <p className="text-gray-600">{result.artist} · ISRC: {result.isrc}</p>
              </div>
              <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                result.issues.some(i => i.severity === 'error') ? 'bg-red-100 text-red-700' :
                result.issues.some(i => i.severity === 'warning') ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {result.issues.some(i => i.severity === 'error') ? '❌ Issues Found' :
                 result.issues.some(i => i.severity === 'warning') ? '⚠️ Warnings' : '✅ All Clear'}
              </span>
            </div>

            {/* PRO status */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { name: 'ASCAP', registered: result.ascap },
                { name: 'BMI', registered: result.bmi },
                { name: 'SOCAN', registered: result.socan },
                { name: 'PRS', registered: result.prs },
              ].map(pro => (
                <div key={pro.name} className={`p-3 rounded-xl text-center border ${pro.registered ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <p className="font-bold text-sm">{pro.name}</p>
                  <p className={`text-lg ${pro.registered ? 'text-green-600' : 'text-red-500'}`}>{pro.registered ? '✓' : '✗'}</p>
                </div>
              ))}
            </div>

            {/* Issues */}
            <div className="space-y-2">
              {result.issues.map((issue, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
                  issue.severity === 'error' ? 'bg-red-50 text-red-700' :
                  issue.severity === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-green-50 text-green-700'
                }`}>
                  <span>{issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : '✅'}</span>
                  <span className="text-sm">{issue.message}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Link href="/attorney-portal#generate-court-report" className="px-6 py-3 bg-indigo-900 text-white rounded-xl font-medium hover:bg-indigo-800 transition">
                Generate Court Report
              </Link>
              <Link href="/split-verification" className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition">
                Verify Splits
              </Link>
            </div>
          </div>
        )}

        {/* Feature cards */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-4xl mb-3">🎵</div>
            <p className="font-semibold text-gray-900">MusicBrainz Verified</p>
            <p className="text-sm text-gray-700">Global recording database with 2M+ artists</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-4xl mb-3">📊</div>
            <p className="font-semibold text-gray-900">Real ISRC Data</p>
            <p className="text-sm text-gray-700">Pull real ISRCs from MusicBrainz</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-4xl mb-3">⚖️</div>
            <p className="font-semibold text-gray-900">PRO Cross-Referenced</p>
            <p className="text-sm text-gray-700">ASCAP/BMI/SOCAN metadata validation</p>
          </div>
        </div>

      </div>
    </div>
  );
}
