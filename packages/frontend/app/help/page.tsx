"use client";

import { useState } from 'react';
import Link from 'next/link';

const WORKFLOW_STEPS = [
  {
    num: '01',
    title: 'Audit Review',
    desc: 'Our engine identifies the Registration Gap — ISRCs with high stream volume but no registered claimant at SoundExchange. Flagged as Black Box / Statutory Suspense.',
  },
  {
    num: '02',
    title: 'Biometric Signature',
    desc: 'Artist completes a 5-second liveness check. We generate a SHA-256 hash anchoring the LOD Part 1 Agreement to a verified, on-chain identity.',
  },
  {
    num: '03',
    title: 'Auto-Fill Schedule 1',
    desc: 'Payment unlocks a pre-filled LOD Part 2 Repertoire Chart. No manual data entry for your paralegals. Reduces filing errors to near zero.',
  },
  {
    num: '04',
    title: 'Submission',
    desc: 'Your firm files the packet with SoundExchange. The Forensic Audit serves as Evidence of Discrepancy required to support release of Suspense funds.',
  },
];

const BENCHMARKS = [
  { label: 'Avg. Recovery Cycle', value: '45–90 Days' },
  { label: 'Statutory Basis',     value: '17 U.S.C. §114' },
  { label: 'Admin Fee',           value: '$150 Flat' },
  { label: 'Royalty % Taken',     value: '0%' },
];

const FAQ_ITEMS = [
  {
    tag: 'Methodology',
    q: 'Why was this asset flagged?',
    a: "Our SMTP Protocol cross-references distribution logs against SoundExchange's ISRC registry. When a recording generates significant digital performance royalties but has no registered claimant, it enters Statutory Suspense — a holding account commonly called \"Black Box.\" Our engine flags these ISRCs automatically.",
  },
  {
    tag: 'Legal Standing',
    q: "Is this a legal filing? What is TrapRoyalties' role?",
    a: "No. TrapRoyalties Pro is a technical data vendor. We provide the forensic evidence package and pre-populated LOD documentation. Your firm remains the filer of record with SoundExchange. We do not provide legal advice or act as counsel.",
  },
  {
    tag: '17 U.S.C. §114',
    q: 'What is the statutory basis for this claim?',
    a: "17 U.S.C. §114 mandates payment of digital performance royalties for sound recordings. Under the Music Modernization Act (MMA, 2018) and the AMP Act, SoundExchange is required to hold and distribute these funds. Our audit proves the discrepancy between the statutory mandate and the current registration state, creating the legal basis for the LOD filing.",
  },
  {
    tag: 'Identity Attestation',
    q: 'Why does the artist need to do a biometric scan?',
    a: "SoundExchange's LOD process requires identity verification from the rights holder. Our liveness check generates a SHA-256 cryptographic hash anchored to the Monad blockchain, creating a tamper-proof digital signature. This replaces the need for a notarized signature in the initial filing stage and speeds up processing significantly.",
  },
  {
    tag: 'Fee Transparency',
    q: 'Why the $150 fee? What does it cover?',
    a: "The flat $150 is an administrative processing fee covering: (1) SHA-256 cryptographic anchoring on Monad blockchain, (2) biometric identity attestation, (3) manual mapping of ISRC metadata into submission-ready Schedule 1 format, and (4) generation of the 4-page Certified Forensic Audit PDF. TrapRoyalties Pro takes 0% of recovered royalties — the artist keeps everything.",
  },
  {
    tag: 'Timeline',
    q: 'How long does recovery take?',
    a: "Once the Certified Audit Packet is submitted to SoundExchange, funds are typically released in the next distribution cycle — approximately 45 to 90 days — pending registry processing and any identity verification by SoundExchange. The MMA requires SoundExchange to make reasonable efforts to identify and pay rights holders.",
  },
  {
    tag: 'Data Security',
    q: 'How is data integrity guaranteed?',
    a: "All audit findings are secured via SHA-256 hashing anchored on the Monad blockchain at two points: (1) when the artist completes biometric attestation, and (2) when the PDF is downloaded. The on-chain transaction hash is displayed on the lawyer page and can be verified independently at testnet.monadexplorer.com.",
  },
  {
    tag: 'Adjudication Guarantee',
    q: 'What if SoundExchange rejects the mapping?',
    a: "If SoundExchange rejects the identified ISRC mapping as \"Previously Registered\" — meaning the asset was already claimed by another party — a full automated refund of the $150 fee is processed within 14 days. This guarantee is stated on the payment page.",
  },
];

export default function HelpPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">

      {/* Header */}
      <div className="bg-[#0a0f1e] border-b border-slate-800 py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">
            TrapRoyalties Forensic Unit · Technical FAQ &amp; Regulatory Compliance
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
            Recovery Workflow &amp; Compliance FAQ
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            How TrapRoyalties Pro converts a detected ISRC registration gap into a SoundExchange-ready
            recovery packet — and answers to every question your compliance team will ask.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">

        {/* Info banner */}
        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-2xl p-6 text-sm text-slate-300 leading-relaxed">
          When our SMTP engine detects a <strong className="text-white">Registration Gap</strong> — high-volume ISRCs
          with no registered claimant at SoundExchange — we follow a four-step process to verify identity,
          generate compliant paperwork, and support escrow release.{' '}
          <span className="text-indigo-300 font-semibold">The $150 fee covers all four steps.</span>
        </div>

        {/* 4-Step Workflow */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">4-Step Escrow Release Workflow</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {WORKFLOW_STEPS.map(step => (
              <div key={step.num} className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
                <p className="text-4xl font-black text-indigo-600/40 mb-3 leading-none">{step.num}</p>
                <p className="font-bold text-white mb-2">{step.title}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Protocol Benchmarks */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Protocol Benchmarks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BENCHMARKS.map(b => (
              <div key={b.label} className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 text-center">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{b.label}</p>
                <p className="text-xl font-black text-emerald-400">{b.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Compliance FAQ */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Compliance &amp; Protocol FAQ</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`bg-[#0f172a] border rounded-2xl overflow-hidden transition-all duration-200 ${
                  openIdx === i ? 'border-indigo-500/40 shadow-lg shadow-indigo-900/20' : 'border-slate-800'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-600/20 border border-indigo-500/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {item.tag}
                    </span>
                    <span className="font-semibold text-white text-sm">{item.q}</span>
                  </div>
                  <span className={`flex-shrink-0 ml-4 w-7 h-7 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-200 ${
                    openIdx === i ? 'bg-indigo-600 text-white rotate-45' : 'bg-slate-800 text-slate-500'
                  }`}>+</span>
                </button>
                {openIdx === i && (
                  <div className="px-6 pb-6 border-t border-slate-800/60 pt-4">
                    <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-[#0f172a] border border-slate-700 rounded-2xl p-8 text-center">
          <p className="text-slate-400 text-sm mb-5">
            Ready to file? Return to the case file to complete payment and download the
            Certified Forensic Audit Packet.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/attorney-portal/lead-intelligence"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition"
            >
              View Lead Intelligence →
            </Link>
            <Link
              href="/attorney-portal"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition"
            >
              Attorney Portal
            </Link>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-700 pb-4">
          Confidential · TrapRoyaltiesPro · Technical FAQ V1 · Not legal advice
        </p>

      </div>
    </div>
  );
}
