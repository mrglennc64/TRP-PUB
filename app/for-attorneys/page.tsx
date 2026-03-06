'use client';

import Link from 'next/link';

export default function ForAttorneysPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black text-white overflow-hidden relative">

      {/* Nav */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-xl border-b border-amber-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold group">
            <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">TrapRoyalties</span>
            <span className="text-amber-300 group-hover:text-yellow-300 transition-colors">Pro</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-amber-400 transition relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/for-attorneys" className="text-amber-400 font-bold relative group">
              ⚖️ For Attorneys
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-400"></span>
            </Link>
            <Link href="/free-audit" className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 px-6 py-2 rounded-full font-semibold transition transform hover:scale-105 hover:shadow-lg hover:shadow-amber-600/50">
              Free Audit
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="flex justify-center gap-4 mb-8">
            <span className="px-4 py-1.5 bg-amber-900/40 border border-amber-700/50 rounded-full text-sm font-bold text-amber-400 uppercase tracking-widest">
              Attorney-Exclusive Portal
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="relative inline-block">
              <span className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-yellow-600 blur-2xl opacity-50 animate-pulse"></span>
              <span className="relative bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">Prevent Royalty Disputes</span>
            </span>
            <br />
            <span className="text-white">Before They Become Lawsuits</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Built specifically for <span className="text-amber-400 font-bold">entertainment attorneys</span> representing hip-hop and R&amp;B artists. Verifiable ownership records, court-admissible reports, and tamper-proof blockchain evidence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/attorney-portal#dashboard" className="group relative bg-gradient-to-r from-amber-600 to-yellow-600 text-black font-bold py-5 px-10 rounded-full text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-600/50">
              <span className="relative z-10">⚖️ Access Attorney Portal</span>
            </Link>
            <Link href="#sample-report" className="border-2 border-amber-500 text-amber-400 hover:bg-amber-500/10 font-bold py-5 px-10 rounded-full text-xl transition transform hover:scale-105">
              View Sample Report
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-12 px-6 border-y border-amber-900/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-yellow-900/20 to-amber-900/20 animate-pulse"></div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6 text-center relative z-10">
          {[
            { value: '$1.2M+', label: 'Recovered for Clients' },
            { value: '47%', label: 'Avg Split Error Rate' },
            { value: '30d', label: 'Dispute Resolution' },
            { value: '4', label: 'PROs Monitored' },
          ].map((s) => (
            <div key={s.label} className="group">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400 mb-2 group-hover:scale-110 transition-transform duration-300">{s.value}</div>
              <div className="text-gray-400 text-sm group-hover:text-amber-300 transition">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 relative">
            <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">What Entertainment Attorneys Get</span>
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 w-24 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { href: '/attorney-portal#pre-release-verify', title: 'Pre-Release Split Verification', desc: 'Catch over/under splits and uncleared features before release — prevent disputes with blockchain proofs.' },
              { href: '/attorney-portal#run-due-diligence', title: 'Catalog Due Diligence', desc: 'Audit full catalogs for black-box leakage, PRO gaps, and 360 deal risks before syncs or deals.' },
              { href: '/attorney-portal#generate-court-report', title: 'Court-Ready Reports', desc: 'Generate sealed, hashed audit reports with Monad verification — admissible evidence.' },
              { href: '/attorney-portal#create-demand-letter', title: 'Demand Letter Generator', desc: 'Auto-generate demand letters with embedded audit evidence and verification hashes.' },
            ].map((f) => (
              <Link key={f.href} href={f.href} className="group bg-indigo-950/70 p-6 rounded-xl border border-indigo-800 hover:border-amber-500 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-600/20">
                <h3 className="text-xl font-bold text-amber-400 mb-3 group-hover:text-yellow-400 transition">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Report */}
      <section id="sample-report" className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-indigo-950/50"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-center text-amber-400 mb-12">Court-Admissible Audit Report</h2>
          <div className="bg-indigo-900/50 backdrop-blur-sm rounded-2xl border border-amber-500/30 overflow-hidden hover:shadow-2xl hover:shadow-amber-600/20 transition-all duration-500">
            <div className="h-2 bg-gradient-to-r from-amber-500 to-yellow-500 animate-pulse"></div>
            <div className="p-8">
              <div className="flex justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">Catalog Audit Report</h3>
                  <p className="text-gray-400">Metro Boomin – Creepin&apos; Dispute · Feb 22, 2026</p>
                </div>
                <span className="bg-amber-500/20 text-amber-400 px-4 py-2 rounded-lg border border-amber-500/50 font-bold self-start">MONAD VERIFIED</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-black/40 p-4 rounded-xl border border-amber-500/20 hover:border-amber-400 transition">
                  <p className="text-amber-400 text-sm mb-1">Ownership Verified</p>
                  <p className="text-2xl font-bold">4 Contributors</p>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-yellow-500/20 hover:border-yellow-400 transition">
                  <p className="text-yellow-400 text-sm mb-1">Split Inconsistencies</p>
                  <p className="text-2xl font-bold">2 Flagged</p>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-green-500/20 hover:border-green-400 transition">
                  <p className="text-green-400 text-sm mb-1">Verification Hash</p>
                  <p className="text-sm font-mono text-green-400">0x7f3a...8e9d</p>
                </div>
              </div>
              <div className="border-t border-amber-900/30 pt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-amber-400 mb-4">Ownership Breakdown</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-300"><span>Metro Boomin (Producer)</span><span className="text-green-400 font-bold">50% ✓</span></div>
                      <div className="flex justify-between text-gray-300"><span>The Weeknd (Feature)</span><span className="text-yellow-400 font-bold">20% ⚠️</span></div>
                      <div className="flex justify-between text-gray-300"><span>Label</span><span className="text-green-400 font-bold">25% ✓</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-400 mb-4">Evidence Chain</h4>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div>• ASCAP Registration: Complete</div>
                      <div>• BMI Registration: Missing Feature</div>
                      <div>• Spotify Streams: Verified (2.4M)</div>
                      <div>• Timestamp: Feb 22, 2026 14:32 UTC</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 text-center">
                <Link href="/attorney-portal#view-audit-report" className="inline-block text-amber-400 hover:text-amber-300 font-bold transition group">
                  Access Full Report in Portal <span className="inline-block group-hover:translate-x-2 transition">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-indigo-950/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-amber-400 mb-12">Questions From Entertainment Lawyers</h2>
          <div className="space-y-4">
            {[
              { q: 'Are these reports admissible in court?', a: 'Yes. Each report includes a cryptographic timestamp and verification hash that can be independently validated. We provide documentation on our verification methodology.' },
              { q: 'How do you verify splits across different PROs?', a: 'Our system cross-references submissions against ASCAP, BMI, SOCAN, and PRS databases, flagging inconsistencies and missing registrations.' },
              { q: 'Can I use this for due diligence before an acquisition?', a: 'Absolutely. Many entertainment attorneys use our platform to audit catalogs before deals, sync licensing, or publishing acquisitions.' },
            ].map((faq) => (
              <div key={faq.q} className="group bg-black/40 border border-amber-900/30 rounded-xl p-6 hover:border-amber-500 transition-all duration-300">
                <h3 className="font-bold text-lg text-amber-400 mb-3 group-hover:text-yellow-400 transition">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/30 via-yellow-900/30 to-amber-900/30 animate-pulse"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Ready to Strengthen Your Cases?</h2>
          <p className="text-2xl text-amber-200 mb-10">Join leading entertainment attorneys using TrapRoyalties Pro</p>
          <Link href="/attorney-portal#dashboard" className="group relative bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold py-6 px-16 rounded-full text-2xl hover:scale-105 transition-all duration-300 shadow-2xl inline-block">
            <span className="relative z-10">⚖️ Enter Attorney Portal</span>
          </Link>
          <p className="text-gray-400 mt-6 text-sm">Limited spots available for early-access firms</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black/80 border-t border-amber-900/30 text-center text-gray-500">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center space-x-8 mb-8">
            <Link href="/privacy" className="hover:text-amber-400 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-amber-400 transition">Terms</Link>
            <Link href="/for-attorneys" className="text-amber-400 hover:text-amber-300 font-bold transition">⚖️ For Attorneys</Link>
            <Link href="/contact" className="hover:text-amber-400 transition">Contact</Link>
          </div>
          <p className="text-sm">© 2026 TrapRoyalties Pro. Built for the culture. All rights reserved.</p>
          <p className="text-xs mt-4 text-gray-600">Data Sources: ASCAP · BMI · SOCAN · PRS for Music · Monad Blockchain</p>
        </div>
      </footer>

    </div>
  );
}
