"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const ALL_LEADS = [
  { artist: "Doja Cat, Nicki Minaj", track: "Agora Hills (Remix)", value: 600000, tag: "remix" },
  { artist: "Maverick City Music", track: "Talking to Jesus ft. Elevation Worship", value: 320000, tag: "gospel" },
  { artist: "Elevation Worship", track: "O Come to the Altar (Remix)", value: 280000, tag: "gospel" },
  { artist: "Doja Cat", track: "MASC (Remix)", value: 145000, tag: "remix" },
  { artist: "Doja Cat", track: "Agora Hills ft. Buss Ross", value: 138000, tag: "remix" },
  { artist: "Brandon Lake", track: "Gratitude (Remix)", value: 130000, tag: "gospel" },
  { artist: "JT (City Girls)", track: "Do We Have A Problem ft. Nicki Minaj", value: 130000, tag: "atl" },
  { artist: "Doja Cat", track: "Attention (Remix)", value: 129000, tag: "remix" },
  { artist: "Nicki Minaj", track: "Pink Friday Girls (Remix)", value: 127000, tag: "remix" },
  { artist: "Kirk Franklin", track: "Revolution (Remix) ft. Ledisi", value: 120000, tag: "gospel" },
  { artist: "Tamela Mann", track: "Take Me to the King (Remix)", value: 110000, tag: "gospel" },
  { artist: "Lecrae", track: "Blessings ft. Andy Mineo", value: 100000, tag: "gospel" },
  { artist: "Travis Greene", track: "Made a Way (Remix)", value: 100000, tag: "gospel" },
  { artist: "Sexyy Red", track: "U My Everything ft. SZA", value: 91000, tag: "atl" },
  { artist: "Sexyy Red", track: "Get It Sexyy (Remix)", value: 91000, tag: "remix" },
  { artist: "Lecrae", track: "Can't Stop Me Now ft. Trip Lee", value: 90000, tag: "gospel" },
  { artist: "Travis Greene", track: "Intentional (Remix)", value: 90000, tag: "gospel" },
  { artist: "Sexyy Red", track: "SkeeYee (Remix)", value: 88000, tag: "remix" },
  { artist: "Travis Greene", track: "You Waited (Remix)", value: 75000, tag: "gospel" },
  { artist: "Travis Greene", track: "While I'm Waiting (Remix)", value: 75000, tag: "gospel" },
  { artist: "BIA", track: "Whole Lotta Money (Remix)", value: 64000, tag: "remix" },
  { artist: "William McDowell", track: "Sounds of Heaven (Remix)", value: 60000, tag: "gospel" },
  { artist: "Anycia", track: "Back Outside ft. GloRilla", value: 59000, tag: "atl" },
  { artist: "Mali Music", track: "Beautiful (Remix)", value: 55000, tag: "gospel" },
  { artist: "KARRAHBOOO", track: "Sky Gen Quincy", value: 53000, tag: "atl" },
  { artist: "Mali Music", track: "Make Room (Remix) ft. Jonathan McReynolds", value: 48000, tag: "gospel" },
  { artist: "KARRAHBOOO", track: "Splash Brothers", value: 48000, tag: "atl" },
  { artist: "Kierra Sheard", track: "It Keeps Happening (Remix)", value: 45000, tag: "gospel" },
  { artist: "KARRAHBOOO", track: "Say Sum (Remix)", value: 43000, tag: "atl" },
  { artist: "Monaleo", track: "Here We Go", value: 38000, tag: "atl" },
  { artist: "Le'Andria Johnson", track: "Jesus (Remix)", value: 38000, tag: "gospel" },
  { artist: "Yung Miami", track: "360 ft. Cardi B", value: 37000, tag: "atl" },
  { artist: "Yung Miami", track: "Praising Him ft. Kodak Black", value: 35000, tag: "atl" },
  { artist: "Yung Miami", track: "Like What (Freestyle)", value: 34000, tag: "atl" },
  { artist: "Le'Andria Johnson", track: "I Need Your Glory (Remix)", value: 32000, tag: "gospel" },
  { artist: "Mali Music", track: "Ready Aim (Remix)", value: 32000, tag: "gospel" },
  { artist: "SZA", track: "Snooze (Remix)", value: 31000, tag: "remix" },
  { artist: "Cuban Doll", track: "Bankrupt ft. Lakeyah", value: 28000, tag: "atl" },
  { artist: "Tyga Box", track: "Off My Dizney", value: 12000, tag: "atl" },
  { artist: "Bunny Barr", track: "Drop City", value: 9000, tag: "atl" },
  { artist: "Bktherula", track: "Arc'teryx", value: 80000, tag: "atl" },
  { artist: "Bktherula", track: "Prada Or Celine", value: 50000, tag: "atl" },
  { artist: "TiaCorine", track: "Boat", value: 50000, tag: "atl" },
  { artist: "TiaCorine", track: "Thunder", value: 40000, tag: "atl" },
  { artist: "Monaleo", track: "Like That", value: 40000, tag: "atl" },
  { artist: "YKNIECE", track: "YK Flow", value: 30000, tag: "atl" },
  { artist: "Karrahbooo", track: "ATL Drill", value: 30000, tag: "atl" },
  { artist: "YKNIECE", track: "Hardest Female", value: 20000, tag: "atl" },
  { artist: "Molly Santana", track: "FLAMMABLE", value: 20000, tag: "atl" },
  { artist: "FattMack", track: "FDO", value: 10000, tag: "atl" },
];

function toSlug(artist: string, track: string) {
  return (artist + '_' + track).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+$/, '');
}

function genToken() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function BiometricModal({ lead, onClose }: { lead: typeof ALL_LEADS[0]; onClose: () => void }) {
  const token = React.useMemo(() => genToken(), []);
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://traproyaltiespro.com';
  const link = base + '/artist-intake?artist=' + encodeURIComponent(lead.artist) + '&track=' + encodeURIComponent(lead.track) + '&ref=' + token;
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#0f172a] border border-white/15 rounded-2xl p-7 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Send Biometric Intake Link</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition text-2xl leading-none">&times;</button>
        </div>
        <div className="mb-5">
          <p className="text-sm font-semibold text-white">{lead.artist}</p>
          <p className="text-xs text-slate-500">{lead.track} &mdash; Est. ${lead.value.toLocaleString()} recovery</p>
        </div>
        <div className="bg-[#1e293b]/80 border border-white/10 rounded-xl p-4 mb-5">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Secure Intake Link</p>
          <p className="font-mono text-xs text-indigo-300 break-all leading-relaxed">{link}</p>
        </div>
        <div className="space-y-2 mb-6">
          <p className="text-xs text-slate-500">This link takes the artist to a secure form to submit:</p>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
            <li>Full legal name + stage name</li>
            <li>SSN or EIN (for W-9 filing)</li>
            <li>Face scan biometric verification</li>
            <li>Electronic authorization signature</li>
          </ul>
        </div>
        <div className="flex gap-3">
          <button onClick={copy}
            className={"flex-1 py-3 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 " +
              (copied ? "bg-emerald-600 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white")}>
            {copied
              ? <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Copied!</>
              : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copy Link</>
            }
          </button>
          <a href={"mailto:?subject=Action Required: Claim Your Unclaimed Royalties&body=Hi " + encodeURIComponent(lead.artist) + ",%0D%0A%0D%0AYour attorney has identified unclaimed royalties on " + encodeURIComponent(lead.track) + ".%0D%0A%0D%0APlease complete the secure intake form:%0D%0A" + encodeURIComponent(link)}
            className="px-5 py-3 rounded-xl text-sm font-medium bg-[#1e293b]/80 border border-white/10 text-slate-300 hover:text-white hover:border-indigo-500/40 transition">
            Email
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LeadIntelligencePage() {
  const [filter, setFilter] = useState('all');
  const [claimed, setClaimed] = useState<Record<number, boolean>>({});
  const [showAll, setShowAll] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [bioModal, setBioModal] = useState<typeof ALL_LEADS[0] | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setLastRefresh(new Date()), 300000);
    return () => clearInterval(timer);
  }, []);

  const filtered = filter === 'all' ? ALL_LEADS
    : filter === 'high' ? ALL_LEADS.filter(l => l.value >= 10000)
    : ALL_LEADS.filter(l => l.tag === filter);

  const visible = showAll ? filtered : filtered.slice(0, 5);
  const totalPipeline = ALL_LEADS.reduce((a, b) => a + b.value, 0);
  const totalRecovery = Math.round(totalPipeline * 2.73);
  const unclaimed = ALL_LEADS.filter((_, i) => !claimed[i]).length;

  const FILTERS = [
    { key: 'all',    label: 'All Leads (' + ALL_LEADS.length + ')' },
    { key: 'high',   label: 'High Value ($10k+)' },
    { key: 'remix',  label: 'Remixes Only' },
    { key: 'atl',    label: 'ATL Female' },
    { key: 'gospel', label: 'Gospel / Soul' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {bioModal && <BiometricModal lead={bioModal} onClose={() => setBioModal(null)} />}

      {/* Page header */}
      <div className="bg-[#0f172a] border-b border-white/10 px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/attorney-portal" className="text-slate-500 hover:text-white text-sm transition flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Attorney Portal
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-white text-sm font-semibold">Lead Intelligence Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Auto-refreshes every 5 min</span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-3 py-1 rounded-full font-bold">
              {unclaimed} LIVE LEADS
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Title + refresh */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Lead Intelligence Dashboard</h1>
            <p className="text-slate-400 mt-1 text-sm">
              {unclaimed} new recovery opportunities &mdash; Last refreshed {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'TOTAL PIPELINE VALUE', value: '$' + (totalPipeline / 1000).toFixed(0) + 'k', color: 'text-emerald-400' },
            { label: 'EST. TOTAL RECOVERY',  value: '$' + (totalRecovery / 1000000).toFixed(2) + 'M', color: 'text-emerald-400' },
            { label: 'AVG FEE PER LEAD',     value: '$150', color: 'text-white' },
            { label: 'LEADS READY',          value: String(unclaimed), color: 'text-indigo-400' },
          ].map((s, i) => (
            <div key={i} className="bg-[#1e293b]/60 border border-white/10 rounded-2xl p-5">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{s.label}</p>
              <p className={'text-4xl font-black ' + s.color}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-5">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => { setFilter(f.key); setShowAll(false); }}
              className={'px-5 py-2 rounded-xl text-sm font-medium transition ' +
                (filter === f.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#1e293b]/60 border border-white/10 text-slate-400 hover:text-white hover:border-indigo-500/40')}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-[#1e293b]/60 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-slate-500">
                <th className="py-4 px-5 text-left w-8">#</th>
                <th className="py-4 px-5 text-left">Artist / Track</th>
                <th className="py-4 px-5 text-left">ISRC Status</th>
                <th className="py-4 px-5 text-left">Est. Recovery</th>
                <th className="py-4 px-5 text-left">Registry Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {visible.map((lead, idx) => {
                const globalIdx = ALL_LEADS.indexOf(lead);
                return (
                  <tr key={idx} className="hover:bg-white/5 transition">
                    <td className="py-4 px-5 text-slate-600 text-xs">{globalIdx + 1}</td>
                    <td className="py-4 px-5">
                      <p className="font-semibold text-white">{lead.artist}</p>
                      <p className="text-xs text-slate-500">{lead.track}</p>
                    </td>
                    <td className="py-4 px-5">
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-3 py-1 rounded-full font-medium">
                        NOT REGISTERED
                      </span>
                    </td>
                    <td className="py-4 px-5 font-bold text-emerald-400">
                      ${lead.value.toLocaleString()}
                    </td>
                    <td className="py-4 px-5">
                      {claimed[globalIdx]
                        ? <span className="text-emerald-400 text-xs font-medium">Claimed</span>
                        : <span className="text-red-400 text-xs font-medium">NOT YET ASSIGNED</span>}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setBioModal(lead)}
                          className="bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-500/50 text-white text-xs px-4 py-2 rounded-xl font-medium transition whitespace-nowrap">
                          Send Biometric Link
                        </button>
                        <Link href={'/attorney-portal/lead/' + toSlug(lead.artist, lead.track)}
                          className="bg-red-600/70 hover:bg-red-600 border border-red-500/40 text-white text-xs px-4 py-2 rounded-xl font-medium transition whitespace-nowrap">
                          Show Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!showAll && filtered.length > 5 && (
            <div className="border-t border-white/10 p-5 flex justify-center">
              <button onClick={() => setShowAll(true)}
                className="flex items-center gap-2 px-8 py-3 bg-[#0f172a] hover:bg-[#1e293b] border border-white/10 rounded-xl text-sm text-slate-300 font-medium transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Load More Leads ({filtered.length - 5} remaining)
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
