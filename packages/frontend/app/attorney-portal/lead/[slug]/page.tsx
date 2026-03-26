"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const ALL_LEADS = [
  { artist: "Doja Cat", track: "MASC (Remix)", value: 145000, tag: "remix", streams: "45,000,000+", tier: "TIER 1 — PLATINUM" },
  { artist: "Doja Cat", track: "Agora Hills ft. Buss Ross", value: 138000, tag: "remix", streams: "41,000,000+", tier: "TIER 1 — PLATINUM" },
  { artist: "Doja Cat, Nicki Minaj", track: "Agora Hills Remix ft. Nicki Minaj", value: 145000, tag: "remix", streams: "45,000,000+", tier: "TIER 1 — PLATINUM" },
  { artist: "Doja Cat", track: "Attention (Remix)", value: 129000, tag: "remix", streams: "38,000,000+", tier: "TIER 1 — PLATINUM" },
  { artist: "Nicki Minaj", track: "Pink Friday Girls (Remix)", value: 127000, tag: "remix", streams: "36,000,000+", tier: "TIER 1 — PLATINUM" },
  { artist: "GloRilla", track: "TGIF (Remix)", value: 118000, tag: "remix", streams: "33,000,000+", tier: "TIER 1 — PLATINUM" },
  { artist: "GloRilla", track: "Never Lose Me (Remix)", value: 112000, tag: "remix", streams: "31,000,000+", tier: "TIER 1 — GOLD" },
  { artist: "Latto", track: "Big Energy (Remix)", value: 107000, tag: "remix", streams: "29,000,000+", tier: "TIER 1 — GOLD" },
  { artist: "Latto", track: "Sunday Service ft. Cardi B", value: 98000, tag: "atl", streams: "26,000,000+", tier: "TIER 1 — GOLD" },
  { artist: "Sexyy Red", track: "Get It Sexyy (Remix)", value: 91000, tag: "remix", streams: "24,000,000+", tier: "TIER 1 — GOLD" },
  { artist: "Sexyy Red", track: "SkeeYee (Remix)", value: 88000, tag: "remix", streams: "22,000,000+", tier: "TIER 1 — GOLD" },
  { artist: "Megan Thee Stallion", track: "Cobra (Remix)", value: 85000, tag: "remix", streams: "20,000,000+", tier: "TIER 1 — GOLD" },
  { artist: "Flo Milli", track: "Never Lose Me (Remix)", value: 79000, tag: "remix", streams: "18,000,000+", tier: "TIER 2 — SILVER" },
  { artist: "Flo Milli", track: "Never Lose Me ft. Pink Pantheress", value: 74000, tag: "remix", streams: "16,000,000+", tier: "TIER 2 — SILVER" },
  { artist: "Flo Milli", track: "Fruit Punch", value: 68000, tag: "atl", streams: "14,000,000+", tier: "TIER 2 — SILVER" },
  { artist: "BIA", track: "Whole Lotta Money (Remix)", value: 64000, tag: "remix", streams: "13,000,000+", tier: "TIER 2 — SILVER" },
  { artist: "Anycia", track: "Back Outside ft. GloRilla", value: 59000, tag: "atl", streams: "12,000,000+", tier: "TIER 2 — SILVER" },
  { artist: "KARAABOO", track: "Sky Gen Quincy", value: 53000, tag: "atl", streams: "10,000,000+", tier: "TIER 2 — SILVER" },
  { artist: "KARAABOO", track: "Splash Brothers", value: 48000, tag: "atl", streams: "9,000,000+", tier: "TIER 2" },
  { artist: "KARAABOO", track: "Say Sum (Remix)", value: 43000, tag: "atl", streams: "8,000,000+", tier: "TIER 2" },
  { artist: "Mondes", track: "New Era", value: 39000, tag: "atl", streams: "7,000,000+", tier: "TIER 2" },
  { artist: "Yung Miami", track: "360 ft. Cardi B", value: 37000, tag: "atl", streams: "6,500,000+", tier: "TIER 2" },
  { artist: "Yung Miami", track: "Like What (Freestyle)", value: 34000, tag: "atl", streams: "6,000,000+", tier: "TIER 2" },
  { artist: "SZA", track: "Snooze (Remix)", value: 31000, tag: "remix", streams: "5,000,000+", tier: "TIER 3" },
  { artist: "Cuban Doll", track: "Bankrupt ft. Lakeyah", value: 28000, tag: "gospel", streams: "4,500,000+", tier: "TIER 3" },
  { artist: "Mulatto Witch", track: "Witch Party", value: 24000, tag: "gospel", streams: "4,000,000+", tier: "TIER 3" },
  { artist: "Mulatto Witch", track: "Red Girls (Remix)", value: 21000, tag: "gospel", streams: "3,500,000+", tier: "TIER 3" },
  { artist: "YEAUX", track: "Therapy", value: 18000, tag: "gospel", streams: "3,000,000+", tier: "TIER 3" },
  { artist: "YEAUX", track: "All The Way Up (Remix)", value: 15000, tag: "gospel", streams: "2,500,000+", tier: "TIER 3" },
  { artist: "Tyga Box", track: "Off My Dizney", value: 12000, tag: "atl", streams: "2,000,000+", tier: "TIER 3" },
  { artist: "Bunny Barr", track: "Drop City", value: 9000, tag: "atl", streams: "1,500,000+", tier: "TIER 3" },
];

function toSlug(artist: string, track: string) {
  return (artist + '_' + track).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+$/, '');
}

function genToken() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export default function LeadCasePage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const lead = useMemo(() => ALL_LEADS.find(l => toSlug(l.artist, l.track) === slug) || ALL_LEADS[0], [slug]);
  const token = useMemo(() => genToken(), []);
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://traproyaltiespro.com';
  const bioLink = base + '/artist-intake?artist=' + encodeURIComponent(lead.artist) + '&track=' + encodeURIComponent(lead.track) + '&ref=' + token;

  const [copied, setCopied] = useState(false);
  const [scanStatus, setScanStatus] = useState<'waiting' | 'scanning' | 'complete'>('waiting');

  const copy = () => {
    navigator.clipboard.writeText(bioLink).then(() => {
      setCopied(true);
      setScanStatus('scanning');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const caseRef = toSlug(lead.artist, lead.track);

  return (
    <div className="min-h-screen bg-white text-[#1a1a2e] font-sans">

      {/* Top bar */}
      <div className="bg-[#1a1a2e] px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/attorney-portal" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Lead Intelligence
          </Link>
        </div>
        <span className="text-xs text-slate-500">TrapRoyaltiesPro — Attorney Case View</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Case header */}
        <div className="border border-gray-200 rounded-lg p-5 mb-6">
          <div className="text-xs font-mono text-gray-500 mb-1">CASE REF: {caseRef}</div>
          <div className="text-red-600 font-bold text-sm mb-3 tracking-wide">REGISTRATION GAP DETECTED</div>
          <div className="text-xs text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
            <span><strong>Subject Artist:</strong> {lead.artist}</span>
            <span className="text-gray-300">·</span>
            <span><strong>Track:</strong> {lead.track}</span>
            <span className="text-gray-300">·</span>
            <span><strong>Classification:</strong> {lead.tier}</span>
            <span className="text-gray-300">·</span>
            <span><strong>Jurisdiction:</strong> United States — Digital Performance Royalty Domain</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* Left: Evidence + Documents */}
          <div className="col-span-2 space-y-5">

            {/* Evidence Summary */}
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-4">Evidence Summary</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'VERIFIED ISRC', value: 'XXXXXXXXX 🔑', mono: true },
                  { label: 'REGISTRY STATUS', value: 'Unregistered / Non-Identified', red: true },
                  { label: 'DSP STREAM VOLUME', value: lead.streams },
                  { label: 'ACCRUAL WINDOW', value: 'Retroactive (36 Months)' },
                  { label: 'FAILURE TYPE', value: 'ISRC-to-Performer Mapping Breakdown' },
                  { label: 'RISK LEVEL', value: 'High — Black Box Accrual Likely', red: true },
                ].map((item, i) => (
                  <div key={i} className="border border-gray-100 rounded p-3 bg-gray-50">
                    <div className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">{item.label}</div>
                    <div className={"text-sm font-medium " + (item.red ? "text-red-600" : "text-gray-800") + (item.mono ? " font-mono" : "")}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legal notice */}
              <div className="mt-4 p-4 border-l-4 border-blue-200 bg-blue-50 rounded-r text-xs text-gray-700 leading-relaxed">
                <p className="mb-2">
                  Data indicates this asset is currently held in <strong>Suspense / Black Box accounts</strong> due to a
                  metadata failure at the registry level. This condition is actionable under SoundExchange's{' '}
                  <strong>Featured Artist Letter of Direction (LOD)</strong> framework (17 U.S.C. S.114 & S.112).
                </p>
                <p>
                  <strong>Recommended Action:</strong> Submit a Certified LOD Repertoire Chart + Forensic Audit
                  Packet to SoundExchange to initiate correction and retroactive royalty release.
                </p>
              </div>
            </div>

            {/* Certified Extraction */}
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-4">Certified Extraction — Contents</div>
              <div className="space-y-3">
                {[
                  { n: '01', title: '4-Page Forensic Audit Exhibit', desc: 'Black Box accrual analysis, stream validation, registry gap documentation, statutory citations' },
                  { n: '02', title: 'Certified LOD Repertoire Chart (Schedule 1)', desc: 'Auto-populated metadata formatted to SoundExchange Part 2 specifications' },
                  { n: '03', title: 'Artist Biometric Attestation Certificate', desc: 'SHA-256 identity anchor — biometrically signed by the artist' },
                  { n: '04', title: 'Chain-of-Custody Hash Verification', desc: 'SHA-256 anchor providing immutable proof of data integrity' },
                ].map((item) => (
                  <div key={item.n} className="flex items-start gap-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                    <span className="text-xs font-mono text-gray-400 w-5 flex-shrink-0 mt-0.5">{item.n}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      {scanStatus === 'complete' ? (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">Ready</span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-400 px-3 py-1 rounded-full">Awaiting biometric</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {scanStatus === 'complete' && (
                <button className="mt-4 w-full py-3 bg-[#1a1a2e] text-white rounded-lg text-sm font-semibold hover:bg-[#2d2d5e] transition">
                  Download Full Forensic Package (PDF)
                </button>
              )}
            </div>
          </div>

          {/* Right: Identity Verification */}
          <div className="col-span-1">
            <div className="border-2 border-amber-200 bg-amber-50 rounded-lg p-5 sticky top-6">
              <div className="text-[10px] uppercase tracking-widest text-amber-700 font-bold mb-3">Step 1 — Identity Verification</div>
              <p className="text-xs text-gray-700 mb-4 leading-relaxed">
                Send this link to <strong>{lead.artist}</strong> to complete a biometric face scan on their phone.
                The forensic package unlocks automatically once they scan.
              </p>

              {/* Link box */}
              <div className="bg-white border border-gray-200 rounded p-3 mb-3">
                <p className="font-mono text-[10px] text-gray-500 break-all leading-relaxed">{bioLink.slice(0, 60)}...</p>
              </div>

              <button onClick={copy}
                className={"w-full py-2.5 rounded text-sm font-semibold transition mb-3 " +
                  (copied ? "bg-emerald-600 text-white" : "bg-[#1a1a2e] text-white hover:bg-[#2d2d5e]")}>
                {copied ? '✓ Copied!' : 'Copy Link'}
              </button>

              <a href={"mailto:?subject=Identity Verification Required — " + encodeURIComponent(lead.track) + "&body=Hi " + encodeURIComponent(lead.artist) + ",%0D%0A%0D%0APlease complete a quick biometric verification to unlock your royalty recovery packet:%0D%0A%0D%0A" + encodeURIComponent(bioLink) + "%0D%0A%0D%0AThis takes less than 60 seconds on your phone."}
                className="block w-full py-2.5 border border-gray-300 text-center rounded text-sm text-gray-600 hover:bg-gray-50 transition mb-4">
                Send via Email
              </a>

              {/* Status */}
              <div className="flex items-center gap-2 text-xs">
                {scanStatus === 'waiting' && (
                  <><span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span><span className="text-amber-700">Waiting for artist scan...</span></>
                )}
                {scanStatus === 'scanning' && (
                  <><span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span><span className="text-blue-700">Link sent — waiting for completion...</span></>
                )}
                {scanStatus === 'complete' && (
                  <><span className="w-2 h-2 bg-emerald-400 rounded-full"></span><span className="text-emerald-700">Biometric verified — package unlocked</span></>
                )}
              </div>

              {/* Dev: simulate completion */}
              {scanStatus !== 'complete' && (
                <button onClick={() => setScanStatus('complete')}
                  className="mt-4 w-full py-2 border border-dashed border-gray-300 text-xs text-gray-400 rounded hover:text-gray-600 transition">
                  [Demo: simulate artist scan]
                </button>
              )}
            </div>

            {/* Recovery value */}
            <div className="mt-4 border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Est. Recovery Value</div>
              <div className="text-3xl font-black text-emerald-600">${lead.value.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">36-month retroactive accrual</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-[10px] text-gray-400">
          <p>TrapRoyaltiesPro — Rights & Royalty Intelligence</p>
          <p>Forensic Audit Division · Compliance & Metadata Correction</p>
        </div>

      </div>
    </div>
  );
}
