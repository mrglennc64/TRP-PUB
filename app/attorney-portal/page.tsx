"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

const RISK_TRACKS = [
  { title: 'Mask Off', artist: 'Future', isrc: 'US-S1Z-17-00001', risk: 'critical', score: 12, leakage: '$42,100', rival: 'Sony/ATV', conflict: 'CF-8821' },
  { title: 'Jumpman', artist: 'Metro Boomin', isrc: 'US-S1Z-15-00001', risk: 'critical', score: 28, leakage: '$12,400', rival: 'Internal', conflict: 'CF-9012' },
  { title: 'Low Life', artist: 'Future', isrc: 'US-S1Z-16-00092', risk: 'warning', score: 54, leakage: '$8,900', rival: 'Orphan', conflict: 'CF-9301' },
  { title: 'Knife Talk', artist: '21 Savage', isrc: 'US-S1Z-21-00812', risk: 'warning', score: 61, leakage: '$14,200', rival: 'Black Box', conflict: 'CF-9445' },
  { title: 'Creepin', artist: '21 Savage', isrc: 'US-S1Z-22-00442', risk: 'secure', score: 94, leakage: '$0', rival: '—', conflict: '—' },
];

const INTAKE_QUEUE = [
  { name: 'Mask_Off_Master_Agreement.pdf', size: '2.4 MB', uploaded: '2 min ago', status: 'analyzing', pages: 8 },
  { name: 'Jumpman_SplitSheet_2015.pdf', size: '1.1 MB', uploaded: '18 min ago', status: 'queued', pages: 3 },
  { name: 'LowLife_Publishing_Deal.pdf', size: '4.7 MB', uploaded: '1 hr ago', status: 'ready', pages: 14 },
  { name: 'KnifeTalk_ProducerAgreement.pdf', size: '890 KB', uploaded: '3 hr ago', status: 'ready', pages: 5 },
];

const DISPUTES = [
  { id: 'CL-99021', track: 'Mask Off', rival: 'Sony/ATV Music Publishing', gap: '12.5%', atRisk: '$42,100', stage: 'Evidence Collection', urgency: 'critical' },
  { id: 'CL-99034', track: 'Jumpman', rival: 'Internal Metadata Error', gap: '15.0%', atRisk: '$12,400', stage: 'Awaiting Counter-Party', urgency: 'high' },
  { id: 'CL-99041', track: 'Low Life', rival: 'Orphan Works Registry', gap: 'UNKNOWN', atRisk: '$8,900', stage: 'Pre-Filing Review', urgency: 'medium' },
];

const LOD_STATUS = [
  { artist: 'Future', tracks: 12, signed: 12, pending: 0, status: 'complete' },
  { artist: 'Metro Boomin', tracks: 8, signed: 6, pending: 2, status: 'partial' },
  { artist: '21 Savage', tracks: 9, signed: 4, pending: 5, status: 'urgent' },
  { artist: 'Gunna', tracks: 5, signed: 0, pending: 5, status: 'urgent' },
  { artist: 'Young Thug', tracks: 11, signed: 11, pending: 0, status: 'complete' },
];

const DISCREPANCIES = [
  { id: 1, severity: 'critical', clause: 'Section 4.2 — Royalty Split', issue: 'Split percentage (45%) conflicts with signed amendment dated Feb 2024 (50%).', confidence: 97 },
  { id: 2, severity: 'warning', clause: 'Section 7.1 — Territory Rights', issue: 'Territory defined as "North America" but ISRC registration covers Global.', confidence: 84 },
  { id: 3, severity: 'info', clause: 'Section 11 — Term Duration', issue: 'Contract expires March 2026 — renewal clause not yet triggered.', confidence: 91 },
];

export default function AttorneyPortalPage() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [warRoom, setWarRoom] = useState<typeof DISPUTES[0] | null>(null);
  const [activeDoc, setActiveDoc] = useState('Mask_Off_Master_Agreement.pdf');
  const [selectedClause, setSelectedClause] = useState<number | null>(1);
  const [dhTrack, setDhTrack] = useState('');
  const [dhIsrc, setDhIsrc] = useState('');
  const [dhRights, setDhRights] = useState('all-in');
  const [dhRevenue, setDhRevenue] = useState('net');
  const [dhJurisdiction, setDhJurisdiction] = useState('georgia');
  const [dhCollaborators, setDhCollaborators] = useState([{ name: '', email: '', pct: '', role: 'Artist' }]);
  const [spinPulse, setSpinPulse] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#digital-handshake') {
      setActiveSection('digital-handshake');
    }
    const t = setInterval(() => setSpinPulse(p => !p), 1800);
    return () => clearInterval(t);
  }, []);

  const totalAtRisk = 77400;

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc]">

      {/* System status banner */}
      <div className="bg-gradient-to-r from-red-900/20 via-slate-900 to-purple-900/20 border-b border-slate-800 px-8 py-2 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 text-green-400"><span className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></span>Secure Node · Active</span>
          <span className="text-slate-500">Legal-Vault-Alpha · Encrypted</span>
          <span className="text-slate-500">Session: Leron Rogers (Fox Rothschild)</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-red-400 flex items-center gap-2"><span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse"></span>${totalAtRisk.toLocaleString()} At Risk</span>
          <span className="text-slate-500">AI Analysis <span className={spinPulse ? 'inline-block animate-spin' : 'inline-block'}>⟳</span> Running</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="border-b border-slate-800 px-8 py-4 flex justify-between items-center glass sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-purple-500 font-extrabold tracking-tighter text-xl">TRAPROYALTIES PRO</Link>
          <div className="flex gap-5 text-sm font-medium text-slate-400">
            {[
              { id: 'dashboard', label: '⚡ War Room', color: 'border-red-500' },
              { id: 'digital-handshake', label: '🤝 Digital Handshake', color: 'border-indigo-400' },
              { id: 'auditor', label: 'Contract Auditor', color: 'border-amber-500' },
              { id: 'due-diligence', label: 'Due Diligence', color: 'border-amber-500' },
              { id: 'reports', label: 'Court Reports', color: 'border-amber-500' },
            ].map(({ id, label, color }) => (
              <button key={id} onClick={() => setActiveSection(id)}
                className={`transition pb-1 ${activeSection === id ? `text-white border-b-2 ${color}` : 'hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 mono hidden lg:block">Leron Rogers · Fox Rothschild</span>
          <Link href="/" className="px-4 py-2 bg-red-600/20 border border-red-600/30 text-red-400 rounded-lg text-xs font-bold hover:bg-red-600/30 transition">Logout</Link>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8">

        {/* ── DASHBOARD (WAR ROOM) ─────────────────────────────── */}
        {activeSection === 'dashboard' && (
          <div>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
                  <span className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                  Attorney Mission Control
                </h1>
                <p className="text-slate-500 text-sm">Legal Threats vs. Opportunities — Real-Time Triage</p>
              </div>
              <div className="flex gap-3">
                <div className="glass px-5 py-3 rounded-xl text-center">
                  <p className="text-[9px] text-slate-500 uppercase font-bold">At Risk</p>
                  <p className="text-lg font-black text-red-400 mono">$77,400</p>
                </div>
                <div className="glass px-5 py-3 rounded-xl text-center">
                  <p className="text-[9px] text-slate-500 uppercase font-bold">Active Claims</p>
                  <p className="text-lg font-black text-amber-400 mono">3</p>
                </div>
                <div className="glass px-5 py-3 rounded-xl text-center">
                  <p className="text-[9px] text-slate-500 uppercase font-bold">Catalog Score</p>
                  <p className="text-lg font-black text-purple-400 mono">58/100</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">

              {/* PILLAR 1 — Risk Heatmap */}
              <div className="glass rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Risk Heatmap</span>
                  <span className="text-[9px] text-purple-400 mono">AI-Scored</span>
                </div>
                <div className="p-6 space-y-3">
                  {RISK_TRACKS.map(t => (
                    <div key={t.isrc} className="flex items-center gap-4 group">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${t.risk === 'critical' ? 'bg-red-500 animate-pulse' : t.risk === 'warning' ? 'bg-amber-400' : 'bg-green-500'}`}></span>
                            <span className="text-xs font-bold text-white">{t.title}</span>
                            <span className="text-[10px] text-slate-500">{t.artist}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {t.risk !== 'secure' && (
                              <span className="text-[10px] text-red-400 mono font-bold">{t.leakage}</span>
                            )}
                            <span className={`text-[10px] font-bold mono ${t.risk === 'critical' ? 'text-red-400' : t.risk === 'warning' ? 'text-amber-400' : 'text-green-400'}`}>{t.score}</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${t.risk === 'critical' ? 'bg-red-500' : t.risk === 'warning' ? 'bg-amber-400' : 'bg-green-500'}`} style={{ width: `${t.score}%` }}></div>
                        </div>
                      </div>
                      {t.risk !== 'secure' && (
                        <button onClick={() => { const d = DISPUTES.find(d => d.id.includes(t.conflict.replace('CF-', 'CL-9'))) || DISPUTES[0]; setWarRoom(d); }}
                          className="text-[9px] font-black uppercase px-3 py-1.5 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition whitespace-nowrap opacity-0 group-hover:opacity-100">
                          Open War Room
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* PILLAR 2 — Contract Intake Queue */}
              <div className="glass rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contract Intake Queue</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${spinPulse ? 'bg-purple-900/30 text-purple-400 border-purple-900/50' : 'bg-slate-800 text-slate-400 border-slate-700'} transition-all`}>AI Redline Active</span>
                </div>
                <div className="divide-y divide-slate-800/50">
                  {INTAKE_QUEUE.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-slate-800/30 transition group">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-slate-800 rounded-lg flex items-center justify-center text-red-400 text-xs font-black">PDF</div>
                        <div>
                          <p className="text-xs font-bold text-white">{doc.name}</p>
                          <p className="text-[10px] text-slate-500 mono">{doc.pages}pp · {doc.size} · {doc.uploaded}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                          doc.status === 'analyzing' ? 'bg-purple-900/20 text-purple-400 border-purple-900/40 animate-pulse' :
                          doc.status === 'ready' ? 'bg-green-900/20 text-green-400 border-green-900/40' :
                          'bg-slate-800 text-slate-500 border-slate-700'
                        }`}>
                          {doc.status === 'analyzing' ? `⟳ Analyzing` : doc.status === 'ready' ? '✓ Ready' : 'Queued'}
                        </span>
                        {doc.status === 'ready' && (
                          <button onClick={() => setActiveSection('auditor')} className="text-[9px] text-purple-400 font-bold hover:text-purple-300 opacity-0 group-hover:opacity-100 transition">
                            Audit →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

              {/* PILLAR 3 — Active Dispute Triage */}
              <div className="glass rounded-2xl overflow-hidden" style={{ boxShadow: '0 0 30px rgba(239,68,68,0.08)' }}>
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-red-900/10 to-transparent">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse"></span>
                    Active Dispute Triage
                  </span>
                  <span className="text-[9px] text-slate-500 mono">{DISPUTES.length} Live Claims</span>
                </div>
                <div className="divide-y divide-slate-800/50">
                  {DISPUTES.map(d => (
                    <div key={d.id} className="px-6 py-5 hover:bg-red-900/5 transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                              d.urgency === 'critical' ? 'bg-red-900/30 text-red-400' :
                              d.urgency === 'high' ? 'bg-orange-900/30 text-orange-400' :
                              'bg-yellow-900/30 text-yellow-400'
                            }`}>{d.urgency}</span>
                            <span className="text-[10px] text-slate-500 mono">{d.id}</span>
                          </div>
                          <p className="text-sm font-bold text-white">{d.track}</p>
                          <p className="text-[10px] text-slate-500">vs. {d.rival}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-red-400 mono">{d.atRisk}</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">{d.gap} Gap</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500">Stage: <span className="text-slate-300">{d.stage}</span></span>
                        <button
                          onClick={() => setWarRoom(d)}
                          className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition shadow-lg shadow-red-900/40"
                        >
                          Open War Room
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PILLAR 4 — LOD Status */}
              <div className="glass rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">LOD Status</span>
                  <span className="text-[9px] text-slate-500">Letter of Direction · Digital Auth</span>
                </div>
                <div className="divide-y divide-slate-800/50">
                  {LOD_STATUS.map(a => (
                    <div key={a.artist} className="flex items-center gap-4 px-6 py-4">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-xs font-black flex-shrink-0">
                        {a.artist[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-bold text-white">{a.artist}</span>
                          <span className={`text-[10px] font-bold ${a.status === 'complete' ? 'text-green-400' : a.status === 'partial' ? 'text-amber-400' : 'text-red-400'}`}>
                            {a.signed}/{a.tracks} signed
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${a.status === 'complete' ? 'bg-green-500' : a.status === 'partial' ? 'bg-amber-400' : 'bg-red-500'}`}
                            style={{ width: `${(a.signed / a.tracks) * 100}%` }}></div>
                        </div>
                      </div>
                      {a.pending > 0 && (
                        <button className="text-[9px] text-amber-400 border border-amber-400/30 px-3 py-1 rounded font-bold hover:bg-amber-400/10 transition whitespace-nowrap">
                          Send LOD ({a.pending})
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 border-t border-slate-800">
                  <button onClick={() => setActiveSection('digital-handshake')}
                    className="w-full py-2.5 bg-purple-600/20 border border-purple-500/30 text-purple-400 rounded-xl text-xs font-bold hover:bg-purple-600/30 transition">
                    Create Digital Handshake for Unsigned Artists →
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── DIGITAL HANDSHAKE ──────────────────────────────────── */}
        {activeSection === 'digital-handshake' && (
          <div id="digital-handshake">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase">Digital Handshake</h1>
                <p className="text-slate-500">Create court-admissible royalty split agreements — Georgia Law compliant</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass rounded-2xl p-8">
                <h2 className="text-lg font-bold mb-6">Create New Split Agreement</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Track / Project Name</label>
                    <input type="text" placeholder="e.g. Neon Dreams (Rough Mix v3)" value={dhTrack} onChange={e => setDhTrack(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white outline-none focus:border-purple-500 transition" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">ISRC / ISWC (optional)</label>
                    <input type="text" placeholder="e.g. USUM72212345" value={dhIsrc} onChange={e => setDhIsrc(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white outline-none focus:border-purple-500 transition mono" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Rights Type</label>
                    <select value={dhRights} onChange={e => setDhRights(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 outline-none focus:border-purple-500 transition">
                      <option value="all-in">All-In (Master + Publishing)</option>
                      <option value="master">Master Only</option>
                      <option value="publishing">Publishing Only</option>
                      <option value="sync">Sync License</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Revenue Basis</label>
                    <select value={dhRevenue} onChange={e => setDhRevenue(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 outline-none focus:border-purple-500 transition">
                      <option value="net">Net Receipts</option>
                      <option value="gross">Gross Receipts</option>
                      <option value="adjusted">Adjusted Gross</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Jurisdiction</label>
                    <select value={dhJurisdiction} onChange={e => setDhJurisdiction(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 outline-none focus:border-purple-500 transition">
                      <option value="georgia">Georgia Law (Atlanta)</option>
                      <option value="california">California Law (LA)</option>
                      <option value="new-york">New York Law (NYC)</option>
                      <option value="tennessee">Tennessee Law (Nashville)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Collaborator Details</label>
                    {dhCollaborators.map((col, i) => (
                      <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                        <input type="text" placeholder="Name" value={col.name}
                          onChange={e => { const u = [...dhCollaborators]; u[i] = { ...u[i], name: e.target.value }; setDhCollaborators(u); }}
                          className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-purple-500" />
                        <input type="text" placeholder="%" value={col.pct}
                          onChange={e => { const u = [...dhCollaborators]; u[i] = { ...u[i], pct: e.target.value }; setDhCollaborators(u); }}
                          className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-purple-500 mono" />
                        <select value={col.role} onChange={e => { const u = [...dhCollaborators]; u[i] = { ...u[i], role: e.target.value }; setDhCollaborators(u); }}
                          className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none">
                          <option>Artist</option><option>Producer</option><option>Feature</option><option>Songwriter</option><option>Label</option>
                        </select>
                      </div>
                    ))}
                    <button onClick={() => setDhCollaborators([...dhCollaborators, { name: '', email: '', pct: '', role: 'Artist' }])}
                      className="text-xs text-purple-400 hover:text-purple-300 mt-1 font-bold">+ Add Collaborator</button>
                  </div>
                  <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-sm transition shadow-lg shadow-purple-900/40 mt-2">
                    Generate Digital Handshake
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                <div className="glass rounded-2xl p-8">
                  <h2 className="text-lg font-bold mb-6">Agreement Preview</h2>
                  <div className="bg-slate-900 rounded-xl p-5 border border-slate-700 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-white">{dhTrack || 'Track Name'}</span>
                      <span className="px-2 py-0.5 bg-yellow-900/20 text-yellow-400 border border-yellow-900/40 rounded text-[9px] font-bold uppercase">PENDING</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {[['Rights Type', dhRights], ['Revenue Basis', dhRevenue], ['Jurisdiction', dhJurisdiction]].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-slate-400"><span>{k}</span><span className="text-white mono">{v}</span></div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-amber-900/10 border border-amber-500/20 rounded-xl p-5">
                    <p className="text-xs font-bold text-amber-400 mb-3">Georgia Court Requirements:</p>
                    <ul className="space-y-1.5 text-[11px] text-slate-400">
                      {['Rights type defined', 'Revenue basis specified', 'Jurisdiction locked', 'Timestamp + IP metadata attached', 'Hash seal on execution'].map(r => (
                        <li key={r} className="flex items-center gap-2"><span className="text-green-400">✓</span> {r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="glass rounded-2xl p-6">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-3">Export Options</p>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition">
                      <span className="text-xs font-bold">Export Affidavit (PDF)</span><span className="text-purple-400 text-xs">→</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition">
                      <span className="text-xs font-bold">Export with Hash Seal</span><span className="text-purple-400 text-xs">→</span>
                    </button>
                    <Link href="/split-verification" className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition">
                      <span className="text-xs font-bold">Pre-Release Split Verification</span><span className="text-purple-400 text-xs">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CONTRACT AUDITOR ───────────────────────────────────── */}
        {activeSection === 'auditor' && (
          <>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase">Contract Auditor</h1>
                <p className="text-slate-500">AI-Powered Forensic Analysis &amp; Discrepancy Detection</p>
              </div>
              <div className="flex gap-3">
                <Link href="/label/conflict" className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-700 transition">Conflict Center →</Link>
                <Link href="/label/vault" className="px-4 py-2 bg-purple-600 rounded-lg text-xs font-bold hover:bg-purple-500 transition shadow-lg shadow-purple-900/40">Legal Vault →</Link>
              </div>
            </div>
            <div className="flex gap-3 mb-6">
              {['Mask_Off_Master_Agreement.pdf', 'Jumpman_Split_Sheet.pdf', 'Creepin_Publishing_Deal.pdf'].map(doc => (
                <button key={doc} onClick={() => setActiveDoc(doc)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeDoc === doc ? 'bg-purple-600 text-white' : 'bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700'}`}>
                  {doc}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Document Viewer</span>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-green-900/20 text-green-400 border border-green-900/40 rounded text-[9px] font-bold uppercase">SHA-256 Verified</span>
                    <span className="px-2 py-0.5 bg-purple-900/20 text-purple-400 border border-purple-900/40 rounded text-[9px] font-bold uppercase">PDF/A</span>
                  </div>
                </div>
                <div className="pdf-page m-6 p-8 rounded-lg relative" style={{ minHeight: '500px', background: 'white', color: '#334155', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  <div className="scan-line" style={{ position: 'absolute', left: 0, right: 0 }}></div>
                  {selectedClause === 1 && (
                    <div style={{ position: 'absolute', top: '170px', left: '24px', right: '24px', height: '48px', background: 'rgba(147,51,234,0.15)', borderLeft: '3px solid #9333ea' }}></div>
                  )}
                  <div className="text-xs font-bold text-right mb-6 font-sans uppercase">Date: January 12, 2017</div>
                  <h3 className="font-bold text-lg mb-4 text-center font-sans">MASTER RECORDING AGREEMENT</h3>
                  <p className="mb-3 text-sm">This Agreement is entered into between <strong>Theel Good Music LLC</strong> and <strong>Future Hendrix, Inc.</strong></p>
                  <h4 className="font-bold mt-4 mb-2 text-sm">Section 4.2 — Royalty Split</h4>
                  <p className="mb-3 text-sm">Artist shall receive royalties equal to <strong>45%</strong> of net receipts...</p>
                  <h4 className="font-bold mt-4 mb-2 text-sm">Section 7.1 — Territory Rights</h4>
                  <p className="mb-3 text-sm">Rights limited to the territory of <strong>North America</strong>...</p>
                  <h4 className="font-bold mt-4 mb-2 text-sm">Section 11 — Term Duration</h4>
                  <p className="mb-3 text-sm">This Agreement expires <strong>March 2026</strong>...</p>
                  <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-400">
                    <span>Page 1 of 8</span><span className="font-mono">Hash: 0x7a3f...d92e</span>
                  </div>
                </div>
              </div>
              <div className="glass rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Audit Discrepancies</span>
                  <span className="px-2 py-0.5 bg-red-900/20 text-red-400 border border-red-900/40 rounded text-[9px] font-bold uppercase animate-pulse">{DISCREPANCIES.length} Issues</span>
                </div>
                <div className="p-6 space-y-4">
                  {DISCREPANCIES.map(d => (
                    <button key={d.id} onClick={() => setSelectedClause(d.id)}
                      className={`w-full text-left p-4 rounded-xl border transition ${selectedClause === d.id ? 'border-purple-500/50 bg-purple-900/10' : d.severity === 'critical' ? 'border-red-500/20 bg-red-900/5 hover:border-red-500/40' : d.severity === 'warning' ? 'border-yellow-500/20 bg-yellow-900/5 hover:border-yellow-500/40' : 'border-blue-500/20 bg-blue-900/5 hover:border-blue-500/40'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${d.severity === 'critical' ? 'bg-red-900/30 text-red-400' : d.severity === 'warning' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-blue-900/30 text-blue-400'}`}>{d.severity}</span>
                        <span className="text-[10px] text-slate-500 mono">{d.confidence}% confidence</span>
                      </div>
                      <p className="text-xs font-bold text-white mb-1">{d.clause}</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{d.issue}</p>
                    </button>
                  ))}
                  <div className="border-t border-slate-800 pt-4 space-y-2">
                    <Link href="/label/vault" className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition">
                      <span className="text-xs font-bold">Draft Dispute Letter</span><span className="text-purple-400 text-xs">→</span>
                    </Link>
                    <Link href="/split-verification" className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition">
                      <span className="text-xs font-bold">Verify Split Sheet</span><span className="text-purple-400 text-xs">→</span>
                    </Link>
                    <div className="flex gap-3 pt-2">
                      <button className="flex-1 px-4 py-2 border border-slate-700 rounded-lg text-xs font-bold text-slate-400 hover:bg-slate-800 transition">Export Findings</button>
                      <button onClick={() => setWarRoom(DISPUTES[0])} className="flex-1 px-4 py-2 bg-red-600 rounded-lg text-xs font-bold hover:bg-red-500 transition">Open War Room</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'due-diligence' && (
          <div className="max-w-2xl mx-auto mt-16 text-center">
            <div className="glass p-12 rounded-2xl">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Catalog Due Diligence</h2>
              <p className="text-slate-500 mb-8">Start a forensic scan on a client catalog to identify ownership gaps, split discrepancies, and PRO registration issues.</p>
              <Link href="/label-workspace" className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold transition shadow-lg shadow-purple-900/40">Launch Label Workspace →</Link>
            </div>
          </div>
        )}

        {activeSection === 'reports' && (
          <div className="max-w-2xl mx-auto mt-16 text-center">
            <div className="glass p-12 rounded-2xl">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Court-Ready Reports</h2>
              <p className="text-slate-500 mb-8">Generate Bates-stamped audit reports with immutable blockchain proof, suitable for legal proceedings.</p>
              <div className="flex gap-4 justify-center">
                <button className="px-8 py-4 border border-slate-700 rounded-xl font-bold text-slate-300 hover:bg-slate-800 transition">Generate PDF Report</button>
                <Link href="/label/vault" className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold transition shadow-lg shadow-purple-900/40">View Legal Vault →</Link>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ── WAR ROOM OVERLAY ───────────────────────────────────── */}
      {warRoom && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="glass max-w-5xl w-full rounded-3xl flex flex-col overflow-hidden" style={{ height: '85vh', borderColor: 'rgba(239,68,68,0.3)', boxShadow: '0 0 100px rgba(239,68,68,0.15)' }}>

            {/* War Room Header */}
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-red-900/10 to-transparent">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                  <h2 className="text-2xl font-black tracking-tighter uppercase">Dispute War Room: #{warRoom.id}</h2>
                </div>
                <p className="text-xs text-slate-500 mono uppercase tracking-widest">Asset: {warRoom.track} | Rival: {warRoom.rival}</p>
              </div>
              <button onClick={() => setWarRoom(null)} className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-800 transition text-2xl text-slate-400 hover:text-white">&times;</button>
            </div>

            {/* Split-screen combat */}
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Left — Your Truth */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest">Your Verified Truth</h3>
                  <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-1 rounded border border-purple-500/30">Immutable Ledger</span>
                </div>
                <div className="glass p-6 rounded-2xl bg-slate-900/40">
                  <p className="text-[10px] text-slate-500 uppercase mb-4">Primary Evidence: Executed Split Sheet</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-6xl font-black text-white mono">100%</span>
                    <span className="text-xs text-slate-400 font-bold uppercase">Master Ownership</span>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-sm mt-0.5">✓</span>
                      <p className="text-xs text-slate-300">Contract signed by <span className="text-white font-bold underline">Leland Wayne</span> on 01/12/2017.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-sm mt-0.5">✓</span>
                      <p className="text-xs text-slate-300">No &ldquo;Work for Hire&rdquo; exclusions detected in Clause 14.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-sm mt-0.5">✓</span>
                      <p className="text-xs text-slate-300">SHA-256 Hash: <span className="text-purple-400 mono">0x7a3f...d92e</span> — Tamper-proof.</p>
                    </li>
                  </ul>
                </div>
                <div className="glass p-5 rounded-xl">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-3">Supporting Evidence</p>
                  <div className="space-y-2">
                    {['Original_SplitSheet_2017.pdf', 'PRO_Registration_BMI.pdf', 'ISRC_Confirmation_GRD.pdf'].map(f => (
                      <div key={f} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 text-[10px] font-black">PDF</span>
                          <span className="text-[11px] text-slate-300">{f}</span>
                        </div>
                        <span className="text-[10px] text-green-400">✓ Verified</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — Rival Error */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest">Rival Error ({warRoom.rival})</h3>
                  <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30">Registry Conflict</span>
                </div>
                <div className="glass p-6 rounded-2xl bg-red-950/10" style={{ borderColor: 'rgba(239,68,68,0.3)' }}>
                  <p className="text-[10px] text-slate-500 uppercase mb-4">Conflict Source: HFA/Mechanical Registry</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-6xl font-black text-red-500 mono">{warRoom.gap}</span>
                    <span className="text-xs text-red-400 font-bold uppercase tracking-tighter">Double Attribution Gap</span>
                  </div>
                  <div className="p-4 bg-red-950/20 rounded-xl border border-red-900/20 mb-4">
                    <p className="text-xs text-red-200 leading-relaxed">
                      <strong>AI AUDIT:</strong> {warRoom.rival} is claiming a legacy derivative share that was terminated via the 2017 Master Agreement. They are effectively &ldquo;double dipping&rdquo; on the producer&apos;s share.
                    </p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-red-400 mono">{warRoom.atRisk}</span>
                    <span className="text-xs text-slate-400">estimated revenue withheld</span>
                  </div>
                </div>
                <div className="glass p-5 rounded-xl">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-3">Conflict Timeline</p>
                  <div className="space-y-3">
                    {[
                      { date: 'Jan 12, 2017', event: 'Master Agreement executed — 100% ownership established', color: 'text-green-400' },
                      { date: 'Mar 04, 2022', event: 'Rival claim filed at HFA — 12.5% legacy share asserted', color: 'text-red-400' },
                      { date: 'Mar 06, 2026', event: 'TrapRoyalties AI flagged discrepancy — War Room initiated', color: 'text-purple-400' },
                    ].map((ev, i) => (
                      <div key={i} className="flex gap-3">
                        <span className={`text-[9px] font-bold mono ${ev.color} whitespace-nowrap mt-0.5`}>{ev.date}</span>
                        <p className="text-[11px] text-slate-400">{ev.event}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="p-8 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center">
              <div className="flex gap-3">
                <button className="px-5 py-3 border border-slate-700 rounded-xl text-xs font-black uppercase text-slate-400 hover:bg-slate-800 transition">Download Evidence Bundle</button>
                <button className="px-5 py-3 border border-slate-700 rounded-xl text-xs font-black uppercase text-slate-400 hover:bg-slate-800 transition">Internal Legal Memo</button>
              </div>
              <button className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-900/40 transition">
                Dispatch Formal Cease &amp; Desist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
