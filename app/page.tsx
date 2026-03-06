"use client";

import { useState } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyNow = () => {
    setIsLoading(true);
    window.location.href = '/founding-member';
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <main>
        {/* Hero Section */}
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#a855f7_0%,transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,#06b6d4_0%,transparent_50%)]"></div>
          </div>

          <div className="container mx-auto px-6 py-24 md:py-32 text-center relative z-10">
            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="bg-purple-900/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-purple-500/50 animate-pulse">
                🔥 50K+ tracks scanned
              </span>
              <span className="bg-cyan-900/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-cyan-500/50 animate-pulse" style={{animationDelay:'0.2s'}}>
                ⚡ Monad-powered
              </span>
              <span className="bg-pink-900/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm border border-pink-500/50 animate-pulse" style={{animationDelay:'0.4s'}}>
                🎵 Hip-hop &amp; R&amp;B focused
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 neon-cyan">
              Get Your Bag<br/>From Every Stream,<br/>Sync, &amp; Performance
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Stop leaving money on the table. TrapRoyalties Pro scans PROs, verifies splits with crypto proofs, and recovers your royalties — built for hip hop &amp; R&amp;B creators who hustle.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                href="/free-audit"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-5 px-10 rounded-full text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-600/50"
              >
                Start Free Catalog Audit
              </Link>
              <Link
                href="/founding-member"
                className="border-2 border-purple-500 text-purple-400 hover:bg-purple-900/30 font-bold py-5 px-10 rounded-full text-xl transition transform hover:scale-105"
              >
                Join Royalty Accelerator
              </Link>
            </div>
          </div>
        </header>

        {/* Stats Bar */}
        <section className="py-14 bg-black/40 border-y border-purple-900/30">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold neon-cyan mb-2">50K+</div>
                <div className="text-gray-400 text-sm">Tracks Monitored</div>
              </div>
              <div>
                <div className="text-4xl font-bold neon-purple mb-2">$2.4M+</div>
                <div className="text-gray-400 text-sm">Royalties Recovered</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-pink-400 mb-2" style={{textShadow:'0 0 10px #ec4899,0 0 20px #ec4899'}}>4</div>
                <div className="text-gray-400 text-sm">PROs: ASCAP, BMI, SOCAN, PRS</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2" style={{textShadow:'0 0 10px #22c55e,0 0 20px #22c55e'}}>30</div>
                <div className="text-gray-400 text-sm">Days Avg. Dispute Resolution</div>
              </div>
            </div>
          </div>
        </section>

        {/* Attorney-Exclusive Section */}
        <section className="py-24 bg-gradient-to-b from-black/60 to-purple-950/20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-14">
              <div className="inline-block px-4 py-1.5 bg-red-900/40 border border-red-700/50 rounded-full text-red-400 text-xs font-bold uppercase tracking-widest mb-6">
                Attorney-Exclusive
              </div>
              <h2 className="text-4xl md:text-5xl font-bold neon-purple mb-6">
                Stop Royalty Disputes Before They Become Lawsuits
              </h2>
              <p className="text-xl text-gray-300">
                Verifiable ownership records, court-admissible audit reports, and tamper-proof blockchain evidence — everything your attorney needs to win.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl border border-purple-900/50 hover:border-purple-500 transition text-center">
                <div className="text-5xl font-bold text-yellow-400 mb-3" style={{textShadow:'0 0 10px #eab308'}}>$1.2B+</div>
                <h3 className="text-lg font-bold text-white mb-2">Black Box Royalties</h3>
                <p className="text-gray-400 text-sm">Unclaimed royalties sitting in PRO black boxes — we find yours.</p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl border border-purple-900/50 hover:border-purple-500 transition text-center">
                <div className="text-5xl font-bold text-red-400 mb-3" style={{textShadow:'0 0 10px #f87171'}}>23%</div>
                <h3 className="text-lg font-bold text-white mb-2">Industry Split Error Rate</h3>
                <p className="text-gray-400 text-sm">Our blockchain verification eliminates it entirely.</p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl border border-purple-900/50 hover:border-purple-500 transition text-center">
                <div className="text-5xl font-bold text-green-400 mb-3" style={{textShadow:'0 0 10px #4ade80'}}>30</div>
                <h3 className="text-lg font-bold text-white mb-2">Days to Resolution</h3>
                <p className="text-gray-400 text-sm">Court-ready reports with QR verification cut dispute timelines dramatically.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link
                href="/attorney-portal"
                className="bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg shadow-purple-900/50 transition transform hover:scale-105 text-center"
              >
                Attorney Portal Access
              </Link>
              <Link
                href="/attorney-portal"
                className="border-2 border-purple-500 text-purple-300 hover:bg-purple-900/30 font-bold py-4 px-10 rounded-full text-lg transition text-center"
              >
                View Sample Report
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16 neon-purple">Why TrapRoyalties Pro?</h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl border border-purple-900/50 hover:border-purple-500 transition">
              <div className="text-3xl mb-4">&#128269;</div>
              <h3 className="text-2xl font-bold mb-4 neon-cyan">PRO Scanner + Gap Finder</h3>
              <p className="text-gray-300">Continuous monitoring of ASCAP, BMI, SOCAN, PRS. Find unclaimed tracks from viral TikToks, playlists, sync deals — get paid what's yours.</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl border border-purple-900/50 hover:border-purple-500 transition">
              <div className="text-3xl mb-4">&#9741;</div>
              <h3 className="text-2xl font-bold mb-4 neon-cyan">Crypto-Verified Splits</h3>
              <p className="text-gray-300">Enforce 100% accurate splits with blockchain proofs (Monad-powered). No more "he said/she said" on features, producers, or writers.</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl border border-purple-900/50 hover:border-purple-500 transition">
              <div className="text-3xl mb-4">&#128196;</div>
              <h3 className="text-2xl font-bold mb-4 neon-cyan">Attorney-Ready Reports</h3>
              <p className="text-gray-300">Generate court-admissible PDF reports with SHA-256 verification hashes and QR codes. Built for litigation from day one.</p>
            </div>
          </div>
        </section>

        {/* Demo Splits Section */}
        <section className="py-20 bg-black/60">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 neon-purple">Real Split Verification Examples</h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 p-6 rounded-xl border border-purple-700/50">
                <h3 className="text-xl font-bold mb-2">DRIP TOO HARD</h3>
                <p className="text-sm text-gray-400 mb-4">ISRC: US-XYZ-25-01234</p>
                <div className="text-3xl font-bold text-green-400">100% Verified</div>
                <p className="text-sm mt-2">All splits locked — producer, feature, writers confirmed.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 p-6 rounded-xl border border-purple-700/50">
                <h3 className="text-xl font-bold mb-2">STREET RUNNER</h3>
                <p className="text-sm text-gray-400 mb-4">ISRC: US-XYZ-25-05678</p>
                <div className="text-3xl font-bold text-yellow-400">78% Gaps Found</div>
                <p className="text-sm mt-2">$4.2K unclaimed — missing BMI reg on hook writer.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 p-6 rounded-xl border border-purple-700/50">
                <h3 className="text-xl font-bold mb-2">LATE NIGHT VIBES</h3>
                <p className="text-sm text-gray-400 mb-4">ISRC: US-XYZ-25-09876</p>
                <div className="text-3xl font-bold text-red-400">112% Over-Split</div>
                <p className="text-sm mt-2">Fix before payout — duplicate feature claims detected.</p>
              </div>
            </div>
          </div>
        </section>

        {/* User Type Cards */}
        <section className="py-24 container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 neon-cyan">Built For Every Role</h2>
          <p className="text-center text-gray-400 mb-16 text-lg">One platform — tailored tools for artists, labels, and attorneys.</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-900/40 to-black/60 rounded-2xl border border-purple-800/50 hover:border-purple-500 transition p-8 flex flex-col">
              <div className="text-5xl mb-5">&#127932;</div>
              <h3 className="text-2xl font-bold text-white mb-3">Artist</h3>
              <p className="text-gray-400 mb-6 flex-1">Find missing royalties from streams, syncs, and performances. Verify your splits are airtight before your next release.</p>
              <ul className="space-y-2 text-sm text-gray-300 mb-8">
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> ISRC audit &amp; royalty gap finder</li>
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> Split agreement verification</li>
                <li className="flex items-center gap-2"><span className="text-green-400">&#10003;</span> PRO registration check</li>
              </ul>
              <Link href="/free-audit" className="block text-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-bold py-3 px-6 rounded-full transition">
                Start Free Audit
              </Link>
            </div>

            <div className="bg-gradient-to-br from-cyan-900/30 to-black/60 rounded-2xl border border-cyan-800/50 hover:border-cyan-500 transition p-8 flex flex-col">
              <div className="text-5xl mb-5">&#127968;</div>
              <h3 className="text-2xl font-bold text-white mb-3">Label / Manager</h3>
              <p className="text-gray-400 mb-6 flex-1">Manage your full catalog, track royalty payouts, enforce split agreements, and monitor every artist in your roster.</p>
              <ul className="space-y-2 text-sm text-gray-300 mb-8">
                <li className="flex items-center gap-2"><span className="text-cyan-400">&#10003;</span> Full catalog management</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">&#10003;</span> Bulk ISRC auditing</li>
                <li className="flex items-center gap-2"><span className="text-cyan-400">&#10003;</span> DDEX distribution &amp; DSR import</li>
              </ul>
              <Link href="/label" className="block text-center bg-gradient-to-r from-cyan-700 to-cyan-600 hover:from-cyan-600 hover:to-cyan-500 font-bold py-3 px-6 rounded-full transition">
                Label Portal
              </Link>
            </div>

            <div className="bg-gradient-to-br from-pink-900/30 to-black/60 rounded-2xl border border-pink-800/50 hover:border-pink-500 transition p-8 flex flex-col">
              <div className="text-5xl mb-5">&#9878;</div>
              <h3 className="text-2xl font-bold text-white mb-3">Attorney</h3>
              <p className="text-gray-400 mb-6 flex-1">Court-ready reports and audit tools built for litigation. Tamper-proof blockchain evidence with QR verification for any dispute.</p>
              <ul className="space-y-2 text-sm text-gray-300 mb-8">
                <li className="flex items-center gap-2"><span className="text-pink-400">&#10003;</span> Court-admissible PDF reports</li>
                <li className="flex items-center gap-2"><span className="text-pink-400">&#10003;</span> SHA-256 hash verification</li>
                <li className="flex items-center gap-2"><span className="text-pink-400">&#10003;</span> Chain of custody documentation</li>
              </ul>
              <Link href="/attorney-portal" className="block text-center bg-gradient-to-r from-pink-700 to-pink-600 hover:from-pink-600 hover:to-pink-500 font-bold py-3 px-6 rounded-full transition">
                Attorney Portal
              </Link>
            </div>
          </div>
        </section>

        {/* Accelerator CTA Section */}
        <section id="accelerator" className="py-24 container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-8 neon-cyan">Royalty Accelerator Program</h2>
          <p className="text-2xl mb-6 text-gray-200">Lifetime 50% discount + priority onboarding + free advanced audits</p>
          <p className="text-xl mb-10 text-purple-300">Limited to 50 labels & 500 artists — spots filling fast.</p>
          
          <button 
            onClick={handleApplyNow}
            disabled={isLoading}
            className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-6 px-12 rounded-full text-2xl shadow-2xl shadow-pink-900/50 transition transform hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Apply Now – Only 50 Spots Left'}
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}