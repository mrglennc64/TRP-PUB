"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from './components/Footer';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/royalty-finder?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/royalty-finder');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-200">

      {/* Hero */}
      <section className="pt-36 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-4">
            Music Rights Forensic Platform
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
            Identify, Document, and Recover<br className="hidden md:block" />
            Unclaimed Music Royalties
          </h1>
          <p className="text-sm text-slate-400 mb-8 max-w-2xl leading-relaxed">
            ISRC-level forensic analysis via MusicBrainz and ListenBrainz — confirmed data only.
            Generates verifiable reports accepted as evidence in royalty dispute proceedings.
          </p>

          {/* ISRC Search */}
          <form onSubmit={handleScan} className="flex gap-2 max-w-xl mb-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ISRC (e.g. USUM71703861) or artist name"
              className="flex-1 px-4 py-2.5 bg-[#0f172a] border border-slate-700 text-slate-200 placeholder-slate-600 text-sm rounded focus:outline-none focus:border-indigo-500 transition"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded transition whitespace-nowrap"
            >
              Run Scan →
            </button>
          </form>
          <p className="text-xs text-slate-600">
            No account required — queries SMPT global registry
          </p>
        </div>
      </section>

      {/* FOR ENTERTAINMENT ATTORNEYS — 3 Free Forensic Searches */}
      <section className="py-16 px-6 border-t border-slate-800/60 bg-[#070b17]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-10">

            {/* Left: copy */}
            <div className="flex-1">
              <span className="inline-block bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-5">
                For Entertainment Attorneys
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                3 Free Forensic Searches
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-lg">
                As a licensed attorney, you get <strong className="text-white">3 completely free</strong> forensic
                scans with full evidence packages, hash verification, Monad Blockchain verification,
                and ready-to-file Letters of Direction.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  'Unregistered ISRC detection',
                  'Performer share gaps',
                  'Court-ready documentation',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/attorney-portal/lead-intelligence"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition text-sm">
                Start My 3 Free Attorney Searches →
              </Link>
            </div>

            {/* Right: sample evidence card */}
            <div className="flex-shrink-0 w-full md:w-72">
              <div className="bg-[#0f172a] border border-white/15 rounded-2xl p-5 shadow-xl">
                <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-3">Sample Evidence Package</p>
                <p className="text-base font-bold text-white mb-1">Agora Hills Remix ft. Nicki Minaj</p>
                <p className="text-xs text-slate-500 mb-2">Doja Cat</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Est. Recovery Value</p>
                <p className="text-2xl font-black text-emerald-400 mb-1">$145,000</p>
                <p className="text-xs text-slate-600 mb-4">36-month retroactive accrual</p>
                <Link href="/attorney-portal/lead/doja_cat_nicki_minaj_agora_hills_remix"
                  className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 rounded-xl text-xs text-indigo-300 hover:text-white transition font-medium">
                  Open Case File →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Forensic Documentation & Chain of Custody */}
      <section className="py-16 px-6 border-t border-slate-700/40 bg-[#080d1a]">
        <div className="max-w-5xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-start gap-8 mb-10">
            <div className="flex-1">
              <p className="text-xs font-bold tracking-widest text-amber-500 uppercase mb-2">
                For Entertainment Attorneys
              </p>
              <h2 className="text-xl font-bold text-white mb-3">
                Forensic Documentation &amp; Chain of Custody
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                Every diagnostic generates a hash-verified evidence package with immutable ownership
                chains, split discrepancy analysis, and multi-node registry verification —
                engineered for pre-dispute resolution and civil litigation.
              </p>
            </div>


          </div>

          {/* Forensic services table */}
          <div className="border border-slate-800 rounded overflow-hidden text-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0f1623] border-b border-slate-800">
                  <th className="text-left px-4 py-3 text-xs font-bold tracking-wider text-slate-500 uppercase">Forensic Service</th>
                  <th className="text-left px-4 py-3 text-xs font-bold tracking-wider text-slate-500 uppercase hidden md:table-cell">Data Source</th>
                  <th className="text-left px-4 py-3 text-xs font-bold tracking-wider text-slate-500 uppercase">Deliverable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {[
                  ['Ownership Verification', 'MusicBrainz SMPT probe', 'Signed PDF, hash-verified'],
                  ['Split Discrepancy Analysis', 'Ledger vs. market consumption data', '15–40% avg. gap documented'],
                  ['Forensic Discovery', 'Automated schema parsing engine', 'Minutes vs. months manually'],
                  ['Black Box Royalties', 'ISRC + ListenBrainz gap analysis', 'Claim documentation package'],
                  ['ISRC Gap Detection', 'Registry existence check', 'Missing registration report'],
                  ['Automated CWR Registration', 'Multi-Node Registry Verification', 'Audit-Ready Registration File'],
                ].map(([service, source, deliverable], i) => (
                  <tr key={i} className="hover:bg-slate-800/20 transition">
                    <td className="px-4 py-3 text-slate-200">{service}</td>
                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{source}</td>
                    <td className="px-4 py-3 text-slate-400">{deliverable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-700 mt-3">
            * Audit results vary based on catalog registration status and PRO data availability.
          </p>
        </div>
      </section>

      {/* Entertainment Attorneys CTA */}
      <section className="py-16 px-6 border-t border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="border-l-2 border-amber-500 pl-4">
            <p className="text-sm font-semibold text-slate-200 mb-1">Entertainment Attorneys</p>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Court-admissible audit packages, evidence documentation, and dispute support tools.
            </p>
            <Link href="/attorney-portal" className="text-xs text-amber-400 hover:text-amber-300 transition">
              Attorney access →
            </Link>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
