"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LabelPortalPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc]">
      <nav className="border-b border-slate-800 px-8 py-4 flex justify-between items-center glass sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <span className="text-purple-500 font-extrabold tracking-tighter text-xl">TRAPROYALTIES PRO</span>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
            <Link href="/label" className="text-white border-b-2 border-purple-500 pb-1">Portfolio Summary</Link>
            <Link href="/label/conflict" className="hover:text-white transition">Conflict Center</Link>
            <Link href="/label/settlement" className="hover:text-white transition">Settlement Rails</Link>
            <Link href="/label/vault" className="hover:text-white transition">Legal Vault</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 mono">Node: Atlanta-Secure-01</span>
          <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center font-bold text-xs uppercase">LC</div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8">

        {/* KPI Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass p-6 rounded-2xl">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Catalog Integrity</p>
            <h3 className="text-4xl font-black text-green-400 mono">94.2%</h3>
            <div className="w-full bg-slate-800 h-1.5 mt-4 rounded-full">
              <div className="bg-green-400 h-full rounded-full" style={{ width: '94%', boxShadow: '0 0 10px #4ade80' }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-4">Verified against 14 Global Databases</p>
          </div>

          <div className="glass p-6 rounded-2xl">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Identified Recovery</p>
            <h3 className="text-4xl font-black text-purple-400 mono">$142,850</h3>
            <Link href="/label/settlement" className="text-xs text-purple-400 mt-4 font-semibold hover:underline block">Initiate Bulk Collection →</Link>
          </div>

          <div className="glass p-6 rounded-2xl active-conflict-card">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Active Conflicts</p>
            <div className="flex items-center gap-3">
              <h3 className="text-4xl font-black text-red-400 mono">14</h3>
              <span className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] rounded uppercase font-bold">Action Required</span>
            </div>
            <Link href="/label/conflict" className="text-xs text-slate-500 mt-4 hover:text-white transition block">Resolve Critical Gaps →</Link>
          </div>

          <div className="glass p-6 rounded-2xl flex flex-col justify-between" style={{ borderColor: 'rgba(168,85,247,0.3)' }}>
            <button
              onClick={() => router.push('/label-workspace')}
              className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl font-bold text-sm transition shadow-lg shadow-purple-900/40"
            >
              Run New Catalog Audit
            </button>
            <button className="w-full border border-slate-700 hover:bg-slate-800 py-3 rounded-xl font-bold text-sm transition mt-2">
              Export Compliance PDF
            </button>
          </div>
        </div>

        {/* Heatmap + Conflict Priority */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass p-8 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">Global Revenue Leakage</h2>
                <p className="text-sm text-slate-500">Uncollected royalties by territory</p>
              </div>
            </div>
            <div className="heatmap-container relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20 bg-center bg-no-repeat bg-contain"
                style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')" }}
              ></div>
              {/* US hotspot */}
              <div className="absolute group" style={{ top: '40%', left: '20%' }}>
                <div className="h-4 w-4 bg-red-500 rounded-full animate-ping"></div>
                <div className="hidden group-hover:block absolute top-6 bg-slate-900 border border-slate-700 p-2 rounded text-[10px] w-24 z-10">
                  US: $42.1k Gap
                </div>
              </div>
              {/* UK hotspot */}
              <div className="absolute group" style={{ top: '45%', left: '48%' }}>
                <div className="h-3 w-3 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="hidden group-hover:block absolute top-6 bg-slate-900 border border-slate-700 p-2 rounded text-[10px] w-24 z-10">
                  UK: $12.4k Gap
                </div>
              </div>
              {/* DE hotspot */}
              <div className="absolute group" style={{ top: '42%', left: '52%' }}>
                <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <div className="hidden group-hover:block absolute top-5 bg-slate-900 border border-slate-700 p-2 rounded text-[10px] w-24 z-10">
                  DE: $8.2k Gap
                </div>
              </div>
              {/* CA hotspot */}
              <div className="absolute group" style={{ top: '38%', left: '17%' }}>
                <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse"></div>
                <div className="hidden group-hover:block absolute top-5 bg-slate-900 border border-slate-700 p-2 rounded text-[10px] w-24 z-10">
                  CA: $5.1k Gap
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-2xl">
            <h2 className="text-xl font-bold mb-6">Conflict Priority</h2>
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 rounded-xl border border-red-500/20 hover:border-red-500/50 transition active-conflict-card">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-white">Mask Off - Future</span>
                  <span className="text-[10px] text-red-400 uppercase">12.5% Overlap</span>
                </div>
                <p className="text-[10px] text-slate-500 mb-3 uppercase">Rival: Sony Music Ent.</p>
                <div className="flex gap-2">
                  <Link href="/label/conflict" className="flex-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 py-1.5 rounded text-[10px] font-bold transition text-center">View Forensic</Link>
                  <Link href="/label/vault" className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-slate-400 py-1.5 rounded text-[10px] font-bold transition text-center">Legal Vault</Link>
                </div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-yellow-500/20 hover:border-yellow-500/50 transition">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold text-white">Jumpman - Metro Boomin</span>
                  <span className="text-[10px] text-yellow-400 uppercase">5.0% Overlap</span>
                </div>
                <p className="text-[10px] text-slate-500 mb-3 uppercase">Internal Registry Error</p>
                <div className="flex gap-2">
                  <Link href="/label/conflict" className="flex-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 py-1.5 rounded text-[10px] font-bold transition text-center">View Forensic</Link>
                  <Link href="/label/vault" className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-slate-400 py-1.5 rounded text-[10px] font-bold transition text-center">Legal Vault</Link>
                </div>
              </div>
            </div>
            <Link href="/label/conflict" className="w-full block text-center mt-6 text-xs text-slate-500 hover:text-white transition font-bold uppercase tracking-widest">View All 14 Conflicts →</Link>
          </div>
        </div>

        {/* Immutable Ledger */}
        <div className="glass p-8 rounded-2xl overflow-hidden mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Immutable Settlement Ledger</h2>
            <Link href="/label/settlement" className="text-xs text-purple-400 font-bold hover:underline">Go to Rails →</Link>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="pb-4">Transaction ID</th>
                <th className="pb-4">Asset / Artist</th>
                <th className="pb-4">Action</th>
                <th className="pb-4">Territory</th>
                <th className="pb-4 text-right">Settled Amount</th>
              </tr>
            </thead>
            <tbody className="text-slate-300 mono text-xs">
              <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                <td className="py-4 text-purple-500">0x71a...f21</td>
                <td className="py-4">Jumpman / Metro Boomin</td>
                <td className="py-4">Auto-Fix Registry</td>
                <td className="py-4">USA (ASCAP)</td>
                <td className="py-4 text-right text-green-400">+$2,412.00</td>
              </tr>
              <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition">
                <td className="py-4 text-purple-500">0x82b...e44</td>
                <td className="py-4 text-white">Creepin / Metro Boomin</td>
                <td className="py-4">Weekly Settlement</td>
                <td className="py-4">Global (DSP)</td>
                <td className="py-4 text-right text-green-400">+$18,920.12</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition">
                <td className="py-4 text-purple-500">0x93c...b77</td>
                <td className="py-4">Mask Off / Future</td>
                <td className="py-4">Conflict Resolved</td>
                <td className="py-4">Global (PRO)</td>
                <td className="py-4 text-right text-green-400">+$9,100.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Enterprise Pilot CTA */}
        <section className="mb-20">
          <div className="glass p-12 rounded-3xl bg-gradient-to-br from-slate-900 to-purple-900/10" style={{ borderColor: 'rgba(168,85,247,0.3)' }}>
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">Join the Enterprise Pilot</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                We are currently onboarding a select group of independent labels for our Q2 2026 Settlement Protocol.
                Secure your catalog&apos;s seat in the next weekly settlement cycle.
              </p>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Label Name" className="bg-slate-800 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none text-white" />
                <input type="email" placeholder="Executive Email" className="bg-slate-800 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none text-white" />
                <select className="bg-slate-800 border-none rounded-xl p-4 text-sm text-slate-400 outline-none md:col-span-2">
                  <option>Estimated Catalog Size (Tracks)</option>
                  <option>100 - 1,000</option>
                  <option>1,000 - 10,000</option>
                  <option>10,000+</option>
                </select>
                <button type="button" className="md:col-span-2 bg-purple-600 hover:bg-purple-500 py-4 rounded-xl font-bold text-sm transition shadow-xl shadow-purple-900/20 uppercase tracking-widest">
                  Request Partner Access
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
