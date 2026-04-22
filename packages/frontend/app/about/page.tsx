import Link from 'next/link'
import Image from 'next/image'

export const metadata = { title: 'TrapRoyaltiesPro · About Us · The Carter Brothers' }

export default function AboutPage() {
  return (
    <div style={{ background: '#030712', color: '#e5e7eb', minHeight: '100vh' }}>

      {/* HERO — two-column: text left, photo right */}
      <section className="max-w-6xl mx-auto px-6 pt-28 pb-12">
        <div className="flex flex-col md:flex-row gap-12 items-center">

          {/* LEFT — intro text */}
          <div className="flex-1 min-w-0">
            <div className="inline-block bg-[#1e293b] border border-[#334155] rounded-full px-5 py-1.5 text-[0.75rem] text-[#cbd5e1] mb-6 uppercase tracking-widest font-semibold">
              The Carter Brothers · Sweden–Atlanta Axis
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-br from-white to-[#a78bfa] bg-clip-text text-transparent">
                40+ Years of Music
              </span>
              <br />
              &amp; Infrastructure Heritage
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Two brothers, one mission: eliminate the &quot;Black Box&quot; by rebuilding the backend of the music industry.
              Jerome brings the global systems architecture; Glenn brings the studio DNA.
              Together, they are deploying Swedish technical rigor into the heart of the Atlanta music scene.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="bg-purple-400/10 border border-purple-400/20 text-purple-300 rounded-full px-3 py-1 font-semibold">Swedish Engineering</span>
              <span className="bg-purple-400/10 border border-purple-400/20 text-purple-300 rounded-full px-3 py-1 font-semibold">GDPR Compliant</span>
              <span className="bg-purple-400/10 border border-purple-400/20 text-purple-300 rounded-full px-3 py-1 font-semibold">Atlanta Music Scene</span>
              <span className="bg-purple-400/10 border border-purple-400/20 text-purple-300 rounded-full px-3 py-1 font-semibold">Black Box Elimination</span>
            </div>
          </div>

          {/* RIGHT — photo (40-50% width) */}
          <div className="w-full md:w-[44%] flex-shrink-0">
            <div className="rounded-2xl overflow-hidden border border-[#1e293b] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)]">
              <Image
                src="/images/jeromeglenn.png"
                alt="Jerome & Glenn Carter"
                width={800}
                height={600}
                className="w-full object-cover"
                priority
              />
            </div>
            <div className="text-center mt-3">
              <p className="text-white font-semibold text-sm">Jerome &amp; Glenn Carter</p>
              <p className="text-gray-500 text-xs mt-0.5">Co‑Founders, SMPT — Secured Music Protocol Technology</p>
            </div>
          </div>

        </div>
      </section>

      {/* BROTHER CARDS */}
      <section className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-2 gap-8">

        {/* Jerome Carter */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-8 transition-all duration-300 hover:border-[#8b5cf6] hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_#000]">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-400/10 border border-purple-400/20 rounded-full px-3 py-1">20+ yrs · Sweden</span>
          </div>
          <h2 className="text-lg font-bold mb-0.5">Jerome Carter</h2>
          <p className="text-purple-400 text-sm font-semibold mb-4">Co-Founder, Chief Technical Architect</p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Jerome has spent four decades architecting large‑scale distributed systems and financial infrastructure.
            Having lived and worked in Sweden for over 20 years — the global epicenter of music‑tech (Spotify, SoundCloud) —
            Jerome has built TrapRoyalties Pro with a <strong className="text-white">&ldquo;Swedish Engineering&rdquo;</strong> mindset.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            His expertise ensures that the SMPT framework adheres to the strictest global data standards (GDPR) and banking‑level security protocols.
          </p>
          <div className="border-t border-gray-800 pt-5">
            <p className="text-xs text-gray-600 uppercase tracking-widest mb-3 font-semibold">Specialties</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-900 px-3 py-2 rounded-lg text-center"><span className="text-purple-300 font-semibold">Distributed Systems</span></div>
              <div className="bg-gray-900 px-3 py-2 rounded-lg text-center"><span className="text-purple-300 font-semibold">GDPR Compliance</span></div>
              <div className="bg-gray-900 px-3 py-2 rounded-lg text-center"><span className="text-purple-300 font-semibold">Blockchain Architecture</span></div>
              <div className="bg-gray-900 px-3 py-2 rounded-lg text-center"><span className="text-purple-300 font-semibold">Payment Rails</span></div>
            </div>
          </div>
        </div>

        {/* Glenn Carter */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-8 transition-all duration-300 hover:border-[#8b5cf6] hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_#000]">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-full px-3 py-1">20+ yrs · Music Industry</span>
          </div>
          <h2 className="text-lg font-bold mb-0.5">Glenn Carter</h2>
          <p className="text-purple-400 text-sm font-semibold mb-4">Co-Founder, Music Industry Strategy</p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            A 20‑year veteran of the international music field, Glenn has lived the royalty crisis from both the studio floor
            and the executive boardroom. Based in Sweden for two decades, Glenn witnessed the digital revolution firsthand —
            seeing exactly how metadata &ldquo;leakage&rdquo; destroys the wealth of creators.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Now focusing on the Atlanta legal and creative market, Glenn acts as the bridge between the artist&apos;s output
            and the attorney&apos;s audit — ensuring SMPT has credibility with the producers and lawyers who are tired of leaving money on the table.
          </p>
          <div className="border-t border-gray-800 pt-5">
            <p className="text-xs text-gray-600 uppercase tracking-widest mb-3 font-semibold">Specialties</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-900 px-3 py-2 rounded-lg text-center"><span className="text-rose-300 font-semibold">Forensic Recovery</span></div>
              <div className="bg-gray-900 px-3 py-2 rounded-lg text-center"><span className="text-rose-300 font-semibold">Studio Workflow</span></div>
              <div className="bg-gray-900 px-3 py-2 rounded-lg text-center"><span className="text-rose-300 font-semibold">International Labels</span></div>
              <div className="bg-gray-900 px-3 py-2 rounded-lg text-center"><span className="text-rose-300 font-semibold">Artist Advocacy</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* FORENSIC PHILOSOPHY QUOTE */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="border-l-4 border-[#8b5cf6] bg-[#1e1b4b1a] p-8 rounded-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-4">Our &ldquo;Forensic&rdquo; Philosophy</p>
          <p className="text-sm text-gray-300 leading-relaxed italic mb-6">
            &ldquo;We don&apos;t just &lsquo;scrape&rsquo; data; we validate it. By combining our Swedish technical history with the cultural
            energy of Atlanta, we&apos;ve built the industry&apos;s first True‑Trust Layer. With KYC identity verification and
            SHA‑256 Hashed Agreements, we aren&apos;t just fixing splits — we&apos;re creating an immutable record of ownership
            that Performance Rights Organizations can trust.&rdquo;
          </p>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-rose-500 flex-shrink-0"></div>
            <div>
              <p className="font-bold text-white text-sm">Jerome &amp; Glenn Carter</p>
              <p className="text-gray-500 text-xs">Co‑Founders, SMPT — Secured Music Protocol Technology</p>
            </div>
          </div>
        </div>
      </section>

      {/* SWEDEN-ATLANTA SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-3">The Sweden–Atlanta Connection</p>
          <h3 className="text-lg font-bold text-white mb-4">Engineered in Stockholm · Deployed in Atlanta</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            While the technical architecture is refined in Sweden to meet the world&apos;s highest data security standards,
            our operational heart is in Atlanta. We are bridging the gap between the world&apos;s most advanced music‑tech
            infrastructure and the world&apos;s most influential creative culture.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-10">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Start with proof</span>
          <h2 className="text-2xl font-bold mt-3 mb-3">See what&apos;s missing from your catalog</h2>
          <p className="text-gray-400 text-sm mb-6">Free audit of your first 100 tracks — no strings attached. Glenn and Jerome will personally review the findings with you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/free-audit" className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full font-bold text-sm transition">Start Free Audit</Link>
            <Link href="/gap-finder" className="border border-purple-700 hover:bg-purple-900/30 px-8 py-3 rounded-full font-bold text-sm transition">Try Demo</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-8 border-t border-gray-900 text-center">
        <div className="text-xs text-gray-600 font-bold uppercase tracking-[0.4em] mb-2">TrapRoyaltiesPro</div>
        <div className="text-[10px] text-gray-700 mb-8">Engineered in Stockholm · Deployed in Atlanta</div>
        <div className="flex justify-center gap-10 text-[10px] font-bold text-gray-500 uppercase">
          <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition">Terms</Link>
          <Link href="/data-addendum" className="hover:text-white transition">DPA</Link>
          <Link href="/cookies" className="hover:text-white transition">Cookies</Link>
          <Link href="/about" className="text-white">About Us</Link>
        </div>
      </footer>
    </div>
  )
}
