"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const FEATURES = [
  { id: 'audit',      name: 'Catalog Audit',      icon: '🔍', color: 'from-blue-500 to-indigo-600',    active: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' },
  { id: 'upload',     name: 'MP3 Upload',          icon: '🎵', color: 'from-purple-500 to-pink-600',    active: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg' },
  { id: 'split',      name: 'Split Verification',  icon: '💰', color: 'from-green-500 to-emerald-600',  active: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' },
  { id: 'royalty',    name: 'Royalty Finder',      icon: '📊', color: 'from-orange-500 to-red-600',     active: 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg' },
  { id: 'onboarding', name: 'Artist Onboarding',   icon: '🤝', color: 'from-indigo-500 to-blue-600',   active: 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg' },
  { id: 'handshake',  name: 'Digital Handshake',   icon: '✍️', color: 'from-purple-500 to-violet-600', active: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg' },
];

type FeatureId = 'audit' | 'upload' | 'split' | 'royalty' | 'onboarding' | 'handshake';

const STEPS: Record<FeatureId, { number: number; title: string; description: string; icon: string; detail: string }[]> = {
  audit: [
    { number: 1, title: 'Upload Your Catalog', description: 'Upload a CSV or connect your distributor. Include ISRCs, track titles, artists, and release dates.', icon: '📁', detail: 'Bulk upload up to 10,000 tracks at once' },
    { number: 2, title: 'We Scan Metadata',    description: 'Our engine cross-references MusicBrainz and 15+ databases to check completeness and accuracy.',    icon: '🔎', detail: 'Checks ISRCs, artist names, album titles, and more' },
    { number: 3, title: 'Get Your Risk Report', description: 'Download a court-ready PDF with risk scores, missing revenue estimates, and QR verification.',      icon: '📋', detail: 'Green (safe), Yellow (at risk), Red (critical)' },
  ],
  upload: [
    { number: 1, title: 'Drag & Drop MP3s',     description: 'Upload individual tracks or entire folders. We support MP3, WAV, FLAC, and AIFF.',          icon: '🎯', detail: 'Batch upload up to 100 files at once' },
    { number: 2, title: 'Auto-Extract Metadata', description: 'We read ID3 tags and compare against our database. Missing or incorrect tags are flagged.',   icon: '🏷️', detail: 'Extracts ISRC, artist, album, genre, and more' },
    { number: 3, title: 'Get Clean Files',       description: 'Download your files with corrected metadata, or get a report of what needs fixing.',          icon: '✅', detail: 'Export with DDEX-compliant tags' },
  ],
  split: [
    { number: 1, title: 'Enter Split Percentages', description: 'Add all stakeholders: artists, producers, songwriters, labels. Enter their ownership percentages.', icon: '📊', detail: 'Supports complex splits with multiple parties' },
    { number: 2, title: 'Digital Handshake',       description: 'Each party gets a secure link to review and sign. Blockchain timestamps every signature.',         icon: '🤝', detail: 'SHA-256 hash + QR code on final document' },
    { number: 3, title: 'Get Legal Agreement',     description: 'Download a court-admissible PDF with all signatures, hashes, and verification QR codes.',          icon: '⚖️', detail: 'FRE 901(b)(9) compliant' },
  ],
  royalty: [
    { number: 1, title: 'Upload Statements',    description: 'Upload your royalty statements from DSPs (Spotify, Apple, YouTube) or distributors.',  icon: '📄', detail: 'Supports CSV, PDF, and Excel formats' },
    { number: 2, title: 'Match & Verify',       description: 'We compare statement data against your registered metadata and expected splits.',       icon: '🔄', detail: 'Finds missing payments and discrepancies' },
    { number: 3, title: 'Recover Missing Revenue', description: 'Get a report of underpayments and missing royalties, ready to send to DSPs or labels.', icon: '💰', detail: 'Includes calculation of lost revenue' },
  ],
  onboarding: [
    { number: 1, title: 'Artist Creates Profile', description: 'Artist signs up and connects their streaming profiles. Basic info takes 2 minutes.',       icon: '👤', detail: 'Name, IPI/ISNI, social links' },
    { number: 2, title: 'Add Collaborators',      description: 'Producers, songwriters, and featured artists get invited. Each confirms their role.',     icon: '👥', detail: 'Automatic split suggestions based on genre' },
    { number: 3, title: 'Verify Ownership',       description: 'All parties digitally sign off on splits. Legal record is created instantly.',            icon: '🔐', detail: 'Blockchain timestamped and court-ready' },
  ],
  handshake: [
    { number: 1, title: 'Create Agreement',     description: 'Choose template (producer, feature, remix, etc.). Add parties and split percentages.',    icon: '📝', detail: 'Customizable legal templates included' },
    { number: 2, title: 'Collect Signatures',   description: 'Send to all parties. Each signs digitally. We timestamp and hash the document.',         icon: '✍️', detail: 'Email + SMS reminders automated' },
    { number: 3, title: 'Download Signed PDF',  description: 'Get your final agreement with QR codes on every page for instant verification.',          icon: '📎', detail: 'Verifiable by anyone, forever' },
  ],
};

const HIGHLIGHTS = [
  { icon: '⚖️', text: 'Court-admissible reports' },
  { icon: '🔐', text: 'SHA-256 hash verification' },
  { icon: '📱', text: 'QR codes on every page' },
  { icon: '⛓️', text: 'Blockchain timestamps' },
  { icon: '🎯', text: '99.9% accuracy rate' },
  { icon: '🚀', text: 'Batch processing up to 10k' },
  { icon: '🌐', text: 'MusicBrainz integrated' },
  { icon: '💎', text: 'Self-learning database' },
];

export default function HowItWorksPage() {
  const [active, setActive] = useState<FeatureId>('audit');
  const [animKey, setAnimKey] = useState(0);

  const switchFeature = (id: FeatureId) => {
    setActive(id);
    setAnimKey(k => k + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }
        .fade-up-1 { animation: fadeUp 0.45s 0.00s ease both; }
        .fade-up-2 { animation: fadeUp 0.45s 0.12s ease both; }
        .fade-up-3 { animation: fadeUp 0.45s 0.24s ease both; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.5s 0.6s ease both; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Hero */}
      <div className="bg-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h1>
          <p className="text-xl text-indigo-200">Three simple steps for every feature</p>
        </div>
      </div>

      {/* Feature tab bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto py-4 gap-3 scrollbar-hide">
            {FEATURES.map(f => (
              <button key={f.id} onClick={() => switchFeature(f.id as FeatureId)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap font-medium transition-all duration-200 hover:scale-105 text-sm ${
                  active === f.id ? f.active : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                <span className="text-xl">{f.icon}</span>
                {f.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div key={animKey} className="grid md:grid-cols-3 gap-8">
          {STEPS[active].map((step, i) => (
            <div key={step.number} className={`relative fade-up-${i + 1}`}>
              {/* Step number badge */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg z-10">
                {step.number}
              </div>

              {/* Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 pt-10 border border-gray-100 h-full hover:shadow-2xl transition-shadow duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <span className="text-4xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{step.title}</h3>
                <p className="text-gray-600 text-center mb-4">{step.description}</p>
                <div className="bg-indigo-50 rounded-lg p-3 mt-4">
                  <p className="text-sm text-indigo-700 text-center font-medium">{step.detail}</p>
                </div>
              </div>

              {/* Arrow connector */}
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-5 text-2xl text-gray-300 pointer-events-none">→</div>
              )}
            </div>
          ))}
        </div>

        {/* Feature highlights */}
        <div className="fade-in mt-20 bg-white rounded-2xl shadow-lg p-10 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why choose TrapRoyaltiesPro?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {HIGHLIGHTS.map(h => (
              <div key={h.text} className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 hover:bg-indigo-50 transition-colors duration-200 cursor-default group">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{h.icon}</span>
                <span className="font-medium text-gray-700 text-sm">{h.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Demo flow */}
        <div className="fade-in mt-16 bg-white rounded-2xl shadow-lg p-10 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">5-Minute Demo Flow</h2>
          <p className="text-gray-500 text-center mb-8">Open pages in this order for a perfect pitch</p>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: '01', label: 'Label Dashboard', sub: '$142k found', href: '/label', color: 'bg-purple-50 border-purple-200' },
              { step: '02', label: 'Conflict Center', sub: 'Global heatmap', href: '/label/conflict', color: 'bg-red-50 border-red-200' },
              { step: '03', label: 'Settlement Rails', sub: 'Bypass 50% fees', href: '/label/settlement', color: 'bg-green-50 border-green-200' },
              { step: '04', label: 'Contract Auditor', sub: '12.5% Sony gap', href: '/attorney-portal', color: 'bg-amber-50 border-amber-200' },
              { step: '05', label: 'War Room', sub: 'Dispatch C&D', href: '/attorney-portal', color: 'bg-orange-50 border-orange-200' },
            ].map((d, i) => (
              <Link key={d.step} href={d.href}
                className={`${d.color} border rounded-xl p-4 text-center hover:shadow-md transition-all duration-200 hover:-translate-y-1 block`}>
                <div className="text-xs font-black text-gray-400 mb-1">STEP {d.step}</div>
                <div className="font-bold text-gray-900 text-sm mb-1">{d.label}</div>
                <div className="text-xs text-gray-500">{d.sub}</div>
                {i < 4 && <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 text-gray-300 text-lg">→</div>}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="fade-in mt-16 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl text-indigo-100 mb-8">Try any feature free. No credit card required.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/free-audit" className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-100 transition duration-200 hover:scale-105">
                Start Free Audit
              </Link>
              <Link href="/attorney-portal" className="px-8 py-4 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-400 transition duration-200 hover:scale-105 border border-white/30">
                Open Attorney Portal
              </Link>
            </div>
            <p className="text-sm text-indigo-200 mt-6">support@traproyaltiespro.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
