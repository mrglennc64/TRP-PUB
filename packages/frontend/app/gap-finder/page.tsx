"use client";

import Link from 'next/link';
import { useState } from 'react';

const TRACK = {
  title: 'Atlanta Heat (Viral Edit)',
  artist: 'TrapArchitect',
  isrc: 'USATL2300001',
  severity: 'X CRITICAL',
  annualLoss: '$30,458',
  lbListens: '48,500,000',
  iswc: '—',
  artistIpi: '—',
  leakageRate: '31.4%',
  missingIswcCount: 42,
  projection: '$30,458',
  confidenceRange: '$26k — $35k',
};

const GAPS = [
  {
    level: 'CRITICAL',
    type: 'LINKAGE GAP',
    color: 'red',
    description:
      'Unmapped ISRC: Market Signal Detected (External) | Registry Status: Unclaimed. No corresponding Neighboring Rights claim at Rights Administrator — est. $14,000+ in Black Box revenue.',
    action: 'Register ISRC →',
  },
  {
    level: 'CRITICAL',
    type: 'IDENTITY GAP',
    color: 'red',
    description:
      'Public Data Gap Detected: Master Recording (ISRC) lacks verified association. High potential for Unclaimed Neighboring Rights via Rights Administrator.',
    action: 'Add IPI →',
  },
  {
    level: 'HIGH',
    type: 'ISWC GAP',
    color: 'orange',
    description:
      'No ISWC linked — 100% of publishing royalties unroutable to performing rights organizations.',
    action: 'Link via CWR →',
  },
];

const gapColor = (color: string) => {
  if (color === 'red') return { dot: 'bg-rose-500', badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30', btn: 'bg-indigo-600/80 hover:bg-indigo-600 text-white' };
  return { dot: 'bg-amber-400', badge: 'bg-amber-400/20 text-amber-400 border-amber-400/30', btn: 'bg-indigo-600/80 hover:bg-indigo-600 text-white' };
};

export default function GapFinder() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0f1e]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-indigo-300">
              TrapRoyalties<span className="text-indigo-400">Pro</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-sm text-slate-400">Gap Finder</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/attorney-portal" className="text-sm text-slate-400 hover:text-white transition">Attorney Portal</Link>
            <Link href="/graph-demo" className="text-sm text-slate-400 hover:text-white transition">Identity Graph</Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Track Card */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              {/* Status dots */}
              <div className="flex flex-col gap-1.5 mt-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-slate-700 inline-block" />
                <span className="w-3 h-3 rounded-full bg-slate-700 inline-block" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-black">{TRACK.title}</h1>
                  <span className="px-2 py-0.5 bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold rounded">
                    {TRACK.severity}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">{TRACK.artist}</p>
                <p className="font-mono text-xs text-slate-500 mt-0.5">{TRACK.isrc}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-rose-400">{TRACK.annualLoss}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider mt-0.5">Est. Annual Loss</p>
              <div className="mt-2 flex items-center gap-1.5 justify-end px-3 py-1.5 bg-indigo-500/20 border border-indigo-500/40 rounded-lg text-indigo-300 text-xs font-bold">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                SMPT SECURED
              </div>
            </div>
          </div>

          {/* Gap count banner */}
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-2 mb-5">
            <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">{GAPS.length} Gaps Detected</p>
          </div>

          {/* Gaps */}
          <div className="space-y-4 mb-6">
            {GAPS.map((gap, i) => {
              const c = gapColor(gap.color);
              return (
                <div key={i} className="flex items-start gap-4 bg-[#0f172a] border border-white/5 rounded-xl p-4">
                  <span className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${c.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 border rounded text-[10px] font-bold ${c.badge}`}>
                        {gap.level} — {gap.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{gap.description}</p>
                  </div>
                  <button className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${c.btn}`}>
                    {gap.action}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Gaps', value: GAPS.length.toString() },
              { label: 'LB Listens', value: TRACK.lbListens, color: 'text-indigo-400' },
              { label: 'ISWC', value: TRACK.iswc },
              { label: 'Artist IPI', value: TRACK.artistIpi },
            ].map((s, i) => (
              <div key={i} className="bg-[#0a0f1e] border border-white/5 rounded-xl p-4 text-center">
                <p className={`text-xl font-black ${s.color || 'text-white'}`}>{s.value}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Revenue Recovery Dashboard */}
          <div className="bg-[#0f172a] border border-rose-500/20 rounded-2xl p-6 mb-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Revenue Recovery Dashboard</p>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-3xl font-black text-rose-400">{TRACK.projection}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Current Unclaimed Projection</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">{TRACK.confidenceRange}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Confidence Range (±15%)</p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-black text-rose-400">{TRACK.leakageRate}</p>
                  <span className="px-2 py-0.5 bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-bold rounded">CRITICAL</span>
                </div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Leakage Rate</p>
              </div>
            </div>
          </div>

          {/* Wheezy-specific analysis */}
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 mb-6">
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Analysis — Wesley Glass (Wheezy)</p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Conflict detected: 14% of digital performance assets are currently missing primary Producer IPI{' '}
              <span className="font-mono text-indigo-300">00658428135</span> in ingestion metadata.{' '}
              <span className="text-yellow-400 font-semibold">{TRACK.missingIswcCount} tracks</span> identified with missing ISWC links.
              Leakage rate of <span className="text-rose-400 font-semibold">{TRACK.leakageRate}</span> indicates unroutable publishing royalties
              across PRO pipelines.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={handleGenerate}
            disabled={generating || generated}
            className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-white font-black text-sm rounded-xl transition uppercase tracking-widest"
          >
            {generated ? '✓ Recovery Directive Generated' : generating ? 'Generating...' : 'Generate Recovery Directive →'}
          </button>

          {generated && (
            <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-sm text-emerald-300">
              <p className="font-bold mb-1">Recovery Directive Ready</p>
              <p className="text-xs text-emerald-400/80">
                3 action items queued: ISRC registration, IPI linkage for Wesley Glass (00658428135), CWR submission for {TRACK.missingIswcCount} unlinked works.
                Est. recovery window: 60–90 days.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
