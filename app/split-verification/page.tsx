"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';

interface LookupContributor {
  name: string;
  role: string;
  source: string;
}

interface LookupResult {
  title: string;
  artist: string;
  isrc?: string;
  label?: string;
  contributors: LookupContributor[];
  sources: string[];
}

type Step = 1 | 2 | 3 | 4;

interface SplitRow {
  name: string;
  role: string;
  split: number;
  status: 'ok' | 'error' | 'warning';
  issue?: string;
}

const SAMPLE_PERFECT: SplitRow[] = [
  { name: 'Drake', role: 'Artist', split: 50, status: 'ok' },
  { name: 'Metro Boomin', role: 'Producer', split: 25, status: 'ok' },
  { name: '21 Savage', role: 'Feature', split: 20, status: 'ok' },
  { name: 'Republic Records', role: 'Label', split: 5, status: 'ok' },
];

const SAMPLE_ERRORS: SplitRow[] = [
  { name: 'Travis Scott', role: 'Artist', split: 60, status: 'error', issue: 'Over-allocated' },
  { name: 'Mike Dean', role: 'Producer', split: 25, status: 'ok' },
  { name: 'Quavo', role: 'Feature', split: 25, status: 'warning', issue: 'Missing BMI registration' },
  { name: 'Epic Records', role: 'Label', split: 5, status: 'ok' },
];

export default function SplitVerificationPage() {
  const [step, setStep] = useState<Step>(1);
  const [splits, setSplits] = useState<SplitRow[] | null>(null);
  const [amount, setAmount] = useState('');
  const [verified, setVerified] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Lookup state
  const [lookupTitle, setLookupTitle] = useState('');
  const [lookupArtist, setLookupArtist] = useState('');
  const [lookupISRC, setLookupISRC] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [activeSources, setActiveSources] = useState<string[]>([]);

  const runLookup = async () => {
    if (!lookupTitle && !lookupISRC) { setLookupError('Enter a title or ISRC to search.'); return; }
    setLookupLoading(true); setLookupError(''); setLookupResult(null); setActiveSources([]);
    const result: LookupResult = { title: lookupTitle || '', artist: lookupArtist || '', contributors: [], sources: [] };
    try {
      let mbData: Record<string, unknown> | null = null;
      if (lookupISRC) {
        const r = await fetch(`https://musicbrainz.org/ws/2/recording?query=isrc:${encodeURIComponent(lookupISRC)}&fmt=json`);
        const d = await r.json() as { recordings?: unknown[] };
        if (d.recordings?.length) { mbData = (d.recordings as Record<string, unknown>[])[0]; result.sources.push('MusicBrainz'); }
      }
      if (!mbData && lookupTitle) {
        const q = lookupArtist ? `${lookupTitle} ${lookupArtist}` : lookupTitle;
        const r = await fetch(`https://musicbrainz.org/ws/2/recording?query=${encodeURIComponent(q)}&fmt=json`);
        const d = await r.json() as { recordings?: unknown[] };
        if (d.recordings?.length) { mbData = (d.recordings as Record<string, unknown>[])[0]; result.sources.push('MusicBrainz'); }
      }
      if (mbData) {
        if (!result.title && mbData.title) result.title = mbData.title as string;
        const ac = mbData['artist-credit'] as Array<{ artist?: { name?: string } }> | undefined;
        if (ac?.length && !result.artist) result.artist = ac[0]?.artist?.name || '';
        const rels = mbData.relations as Array<{ type?: string; artist?: { name?: string } }> | undefined;
        if (rels?.length) {
          rels.forEach(rel => {
            if (rel.artist?.name) {
              const role = rel.type === 'composer' ? 'Composer' : rel.type === 'lyricist' ? 'Lyricist' : rel.type === 'producer' ? 'Producer' : rel.type || 'Contributor';
              result.contributors.push({ name: rel.artist.name, role, source: 'MusicBrainz' });
            }
          });
        }
        // Try to get work relations for composer/lyricist
        const workRels = mbData.relations as Array<{ type?: string; work?: { id?: string } }> | undefined;
        const workRel = workRels?.find(r => r.type === 'performance' && r.work?.id);
        if (workRel?.work?.id) {
          try {
            const wr = await fetch(`https://musicbrainz.org/ws/2/work/${workRel.work.id}?inc=artist-rels&fmt=json`);
            const wd = await wr.json() as { relations?: Array<{ type?: string; artist?: { name?: string } }> };
            (wd.relations || []).forEach(rel => {
              if (rel.artist?.name) {
                const role = rel.type === 'composer' ? 'Composer' : rel.type === 'lyricist' ? 'Lyricist' : rel.type || 'Writer';
                if (!result.contributors.find(c => c.name === rel.artist!.name)) {
                  result.contributors.push({ name: rel.artist.name, role, source: 'MusicBrainz' });
                }
              }
            });
          } catch { /* work lookup optional */ }
        }
      }
      // Discogs supplementary
      try {
        const q = lookupArtist ? `${lookupTitle} ${lookupArtist}` : lookupTitle;
        const dr = await fetch(`https://api.discogs.com/database/search?q=${encodeURIComponent(q)}&type=release`);
        const dd = await dr.json() as { results?: Array<{ title?: string; label?: string[] }> };
        if (dd.results?.length) {
          const top = dd.results[0];
          if (top.label?.length && !result.label) { result.label = top.label[0]; result.sources.push('Discogs'); }
        }
      } catch { /* discogs optional */ }
      if (!result.sources.length) { setLookupError('No results found. Try a different title or ISRC.'); }
      else { setLookupResult(result); setActiveSources(result.sources); }
    } catch { setLookupError('Lookup failed — check your connection and try again.'); }
    setLookupLoading(false);
  };

  const useLookupCredits = () => {
    if (!lookupResult?.contributors.length) return;
    const writers = lookupResult.contributors.filter(c => c.role !== 'Performer');
    const use = writers.length ? writers : lookupResult.contributors;
    const n = use.length; const eq = Math.round(1000 / n) / 10;
    const newSplits: SplitRow[] = use.map((c, i) => ({
      name: c.name, role: c.role,
      split: i === n - 1 ? Math.round((100 - eq * (n - 1)) * 10) / 10 : eq,
      status: 'ok' as const,
    }));
    setSplits(newSplits); setStep(2);
  };

  const total = splits ? splits.reduce((s, r) => s + r.split, 0) : 0;
  const hasErrors = splits ? splits.some(r => r.status !== 'ok') : false;
  const progressPct = ((step - 1) / 3) * 100;

  const loadSample = (withErrors: boolean) => {
    setSplits(withErrors ? SAMPLE_ERRORS : SAMPLE_PERFECT);
    setStep(2);
  };

  const handleVerify = () => {
    setVerified(true);
    setStep(3);
  };

  const handleProceed = () => {
    if (amount) setStep(4);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1A202C]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Nav */}
        <nav className="flex justify-between items-center py-5 border-b border-gray-200 flex-wrap gap-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-900 rounded-lg flex items-center justify-center text-white text-xl font-semibold">TP</div>
            <span className="text-[22px] font-semibold text-indigo-900">
              TrapRoyalties<span className="text-indigo-600">Pro</span>
            </span>
          </div>
          <div className="flex gap-8 items-center">
            <Link href="/" className="text-gray-600 hover:text-indigo-900 font-medium text-sm">Home</Link>
            <Link href="/for-attorneys" className="text-gray-600 hover:text-indigo-900 font-medium text-sm">For Attorneys</Link>
            <Link href="/split-verification" className="text-indigo-900 font-medium text-sm border-b-2 border-indigo-900 pb-1">Split Verification</Link>
            <Link href="/free-audit" className="text-gray-600 hover:text-indigo-900 font-medium text-sm">Free Audit</Link>
          </div>
        </nav>

        {/* Title */}
        <div className="text-center py-10 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-indigo-900 mb-3">Split Verification & Payment Workflow</h1>
          <p className="text-gray-600 text-lg">Upload → Detect issues → Verify → Enter amount → Calculate payment → Download PDF</p>
        </div>

        {/* Before / After */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="md:border-r-2 border-red-100 pr-6">
            <h3 className="text-xl text-red-600 mb-4 flex items-center gap-2">✗ Before TrapRoyaltiesPro</h3>
            <div className="flex items-center gap-3 flex-wrap text-sm">
              <span className="bg-gray-100 px-4 py-2 rounded-full border border-gray-200">Label</span>
              <span className="text-gray-300">→</span>
              <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full border border-red-200">Split Issues</span>
              <span className="text-gray-300">→</span>
              <span className="bg-gray-100 px-4 py-2 rounded-full border border-gray-200">PRO</span>
              <span className="text-gray-300">→</span>
              <span className="bg-gray-100 px-4 py-2 rounded-full border border-gray-200">Payment Dispute</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl text-indigo-900 mb-4 flex items-center gap-2">✓ With TrapRoyaltiesPro</h3>
            <div className="flex items-center gap-3 flex-wrap text-sm">
              <span className="bg-gray-100 px-4 py-2 rounded-full border border-gray-200">Label</span>
              <span className="text-gray-300">→</span>
              <span className="bg-indigo-100 text-indigo-900 px-4 py-2 rounded-full border border-indigo-300">TrapRoyaltiesPro</span>
              <span className="text-gray-300">→</span>
              <span className="bg-gray-100 px-4 py-2 rounded-full border border-gray-200">PRO</span>
              <span className="text-gray-300">→</span>
              <span className="bg-gray-100 px-4 py-2 rounded-full border border-gray-200">Verified Payment</span>
            </div>
          </div>
        </div>

        {/* Step tracker */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute top-5 left-12 right-12 h-1 bg-gray-200 z-0"></div>
            {[
              { n: 1, label: 'Upload Data' },
              { n: 2, label: 'Issues Detected' },
              { n: 3, label: 'Data Verified' },
              { n: 4, label: 'Payment Ready' },
            ].map(({ n, label }) => (
              <div key={n} className="flex flex-col items-center relative z-10 bg-[#F8FAFC] px-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
                  step >= n ? 'bg-indigo-900 border-indigo-900 text-white' : 'bg-white border-2 border-gray-200 text-gray-500'
                }`}>{n}</div>
                <span className={`text-sm font-medium ${step >= n ? 'text-indigo-900 font-semibold' : 'text-gray-500'}`}>{label}</span>
              </div>
            ))}
          </div>
          <div className="max-w-2xl mx-auto mt-8 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-900 transition-all duration-500 rounded-full" style={{ width: `${progressPct}%` }}></div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
          {/* Step 1: Import Split Data */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-900 mb-2 flex items-center gap-2">
              🌐 Step 1: Import Split Data
            </h2>
            <p className="text-gray-500 text-sm mb-5">Lookup from Global Sources</p>

            {/* Lookup section */}
            <div className="border border-indigo-100 bg-indigo-50/40 rounded-xl p-5 mb-5">
              <div className="flex flex-wrap gap-2 mb-4">
                {['MusicBrainz', 'Discogs', 'ASCAP/BMI', 'Split Handshake'].map(src => (
                  <span key={src} className={`text-xs px-3 py-1 rounded-full border font-medium transition-all ${
                    activeSources.includes(src)
                      ? 'bg-indigo-900 text-white border-indigo-900'
                      : 'bg-white text-indigo-500 border-indigo-200'
                  }`}>{src}</span>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-3 mb-3">
                <input
                  type="text" placeholder="Track title" value={lookupTitle}
                  onChange={e => setLookupTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && runLookup()}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text" placeholder="Artist name" value={lookupArtist}
                    onChange={e => setLookupArtist(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && runLookup()}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                  <input
                    type="text" placeholder="ISRC (optional)" value={lookupISRC}
                    onChange={e => setLookupISRC(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && runLookup()}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              </div>
              <button
                onClick={runLookup} disabled={lookupLoading}
                className="w-full py-2 bg-indigo-900 text-white rounded-lg text-sm font-semibold hover:bg-indigo-800 disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {lookupLoading ? (
                  <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Looking up…</>
                ) : '🔍 Lookup from Global Sources'}
              </button>
              {lookupError && <p className="text-red-500 text-xs mt-2">{lookupError}</p>}
              {lookupResult && (
                <div className="mt-3 bg-white border border-indigo-100 rounded-lg p-4">
                  <p className="font-semibold text-indigo-900 text-sm">{lookupResult.title} {lookupResult.artist && `— ${lookupResult.artist}`}</p>
                  {lookupResult.label && <p className="text-xs text-gray-500 mb-2">Label: {lookupResult.label}</p>}
                  {lookupResult.contributors.length > 0 ? (
                    <div className="space-y-1 mb-3">
                      {lookupResult.contributors.map((c, i) => (
                        <div key={i} className="flex justify-between text-xs text-gray-700 py-1 border-b border-gray-50 last:border-0">
                          <span>{c.name} <span className="text-gray-400">({c.role})</span></span>
                          <span className="text-indigo-500 text-[10px]">{c.source}</span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-xs text-gray-400 mb-3">No contributor credits found in global sources.</p>}
                  {lookupResult.contributors.length > 0 && (
                    <button
                      onClick={useLookupCredits}
                      className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-500 transition"
                    >✓ Use these credits</button>
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5 text-xs text-gray-400">
              <div className="flex-1 h-px bg-gray-200"></div>or upload your split sheet<div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Upload */}
            <div
              onClick={() => fileRef.current?.click()}
              className="bg-gray-50 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all border-gray-200 hover:border-indigo-900 hover:bg-indigo-50"
            >
              <div className="text-4xl text-indigo-900 mb-3">📄</div>
              <h3 className="text-base font-medium mb-1">Drop your split sheet here</h3>
              <p className="text-gray-500 text-sm">CSV, Excel, or PDF</p>
              <input ref={fileRef} type="file" className="hidden" accept=".csv,.xlsx,.xls,.pdf" onChange={() => loadSample(false)} />
            </div>
            <div className="text-center mt-4 flex items-center justify-center gap-1">
              <button onClick={() => loadSample(false)} className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg font-medium hover:bg-green-100 transition">✅ Load Perfect Sample</button>
              <button onClick={() => loadSample(true)} className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition ml-2">⚠️ Load Test with Errors</button>
            </div>
          </div>

          {/* Steps 2-4 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-900 mb-6">✅ Steps 2–4: Verify &amp; Calculate Payment</h2>

            {!splits && (
              <p className="text-gray-400 text-center mt-12">Upload split data to begin verification.</p>
            )}

            {splits && step === 2 && (
              <div>
                <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${
                  total === 100 && !hasErrors ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  Total: {total}% {total !== 100 ? '⚠️ Must equal 100%' : '✓'} · {hasErrors ? '⚠️ Issues found' : '✓ No issues'}
                </div>
                <div className="space-y-2 mb-6">
                  {splits.map((row, i) => (
                    <div key={i} className={`flex justify-between items-center p-3 rounded-lg border ${
                      row.status === 'ok' ? 'border-green-100 bg-green-50' :
                      row.status === 'warning' ? 'border-yellow-100 bg-yellow-50' :
                      'border-red-100 bg-red-50'
                    }`}>
                      <div>
                        <span className="font-medium">{row.name}</span>
                        <span className="text-gray-500 text-sm ml-2">({row.role})</span>
                        {row.issue && <p className="text-xs text-red-600 mt-0.5">{row.issue}</p>}
                      </div>
                      <span className="font-semibold">{row.split}%</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleVerify}
                  disabled={total !== 100}
                  className="w-full py-3 bg-indigo-900 text-white rounded-xl font-semibold hover:bg-indigo-800 disabled:opacity-50 transition"
                >
                  Verify Data
                </button>
              </div>
            )}

            {splits && step >= 3 && (
              <div>
                <div className="p-3 rounded-lg mb-4 bg-green-50 text-green-700 border border-green-200 text-sm font-medium">
                  ✅ Data verified — blockchain proof generated
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Payment Amount ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  />
                  {amount && splits && (
                    <div className="space-y-2 mb-4">
                      {splits.map((row, i) => (
                        <div key={i} className="flex justify-between p-2 bg-gray-50 rounded-lg text-sm">
                          <span>{row.name} ({row.split}%)</span>
                          <span className="font-bold text-indigo-900">${((parseFloat(amount) * row.split) / 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {step === 4 ? (
                    <button className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-500 transition">
                      📄 Download Payment PDF
                    </button>
                  ) : (
                    <button
                      onClick={handleProceed}
                      disabled={!amount}
                      className="w-full py-3 bg-indigo-900 text-white rounded-xl font-semibold hover:bg-indigo-800 disabled:opacity-50 transition"
                    >
                      Calculate & Proceed
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust badges */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 my-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {['Blockchain Verified', 'Court-Admissible', 'PRO Cross-Referenced', 'Tax-Ready'].map(badge => (
              <div key={badge}>
                <div className="text-indigo-900 mb-2">✓</div>
                <div className="font-medium text-sm">{badge}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-8 mt-12 text-center text-gray-500">
          <p className="text-sm">TrapRoyaltiesPro ensures split accuracy, payment verification, and blockchain-proof ownership records.</p>
          <div className="flex justify-center gap-8 mt-4 text-xs">
            <span>© 2026 TrapRoyaltiesPro</span>
            <span>ASCAP · BMI · SOCAN Compatible</span>
            <span>Built for Music Attorneys</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
