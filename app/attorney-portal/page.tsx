"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

const DISCREPANCIES = [
  {
    id: 1,
    severity: 'critical',
    clause: 'Section 4.2 — Royalty Split',
    issue: 'Split percentage (45%) conflicts with signed amendment dated Feb 2024 (50%).',
    confidence: 97,
  },
  {
    id: 2,
    severity: 'warning',
    clause: 'Section 7.1 — Territory Rights',
    issue: 'Territory defined as "North America" but ISRC registration covers Global.',
    confidence: 84,
  },
  {
    id: 3,
    severity: 'info',
    clause: 'Section 11 — Term Duration',
    issue: 'Contract expires March 2026 — renewal clause not yet triggered.',
    confidence: 91,
  },
];

export default function AttorneyPortalPage() {
  const [activeDoc, setActiveDoc] = useState('Mask_Off_Master_Agreement.pdf');
  const [selectedClause, setSelectedClause] = useState<number | null>(1);
  const [activeSection, setActiveSection] = useState('auditor');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#digital-handshake') {
      setActiveSection('digital-handshake');
    }
  }, []);

  // Digital Handshake form state
  const [dhTrack, setDhTrack] = useState('');
  const [dhIsrc, setDhIsrc] = useState('');
  const [dhRights, setDhRights] = useState('all-in');
  const [dhRevenue, setDhRevenue] = useState('net');
  const [dhJurisdiction, setDhJurisdiction] = useState('georgia');
  const [dhCollaborators, setDhCollaborators] = useState([
    { name: '', email: '', pct: '', role: 'Artist' },
  ]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc]">
      {/* Top banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-8 py-2 text-center">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
          Attorney Portal — Secure Encrypted Session | Hash-Verified
        </span>
      </div>

      {/* Nav */}
      <nav className="border-b border-slate-800 px-8 py-4 flex justify-between items-center glass sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-purple-500 font-extrabold tracking-tighter text-xl">TRAPROYALTIES PRO</Link>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <button
              onClick={() => setActiveSection('digital-handshake')}
              className={`transition pb-1 ${activeSection === 'digital-handshake' ? 'text-white border-b-2 border-indigo-400' : 'hover:text-white'}`}
            >
              🤝 Digital Handshake
            </button>
            <button
              onClick={() => setActiveSection('auditor')}
              className={`transition pb-1 ${activeSection === 'auditor' ? 'text-white border-b-2 border-amber-500' : 'hover:text-white'}`}
            >
              Contract Auditor
            </button>
            <button
              onClick={() => setActiveSection('due-diligence')}
              className={`transition pb-1 ${activeSection === 'due-diligence' ? 'text-white border-b-2 border-amber-500' : 'hover:text-white'}`}
            >
              Due Diligence
            </button>
            <button
              onClick={() => setActiveSection('reports')}
              className={`transition pb-1 ${activeSection === 'reports' ? 'text-white border-b-2 border-amber-500' : 'hover:text-white'}`}
            >
              Court Reports
            </button>
            <Link href="/label/vault" className="hover:text-white transition">Legal Vault</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 mono">Leron Rogers (Fox Rothschild)</span>
          <Link href="/" className="px-4 py-2 bg-red-600/20 border border-red-600/30 text-red-400 rounded-lg text-xs font-bold hover:bg-red-600/30 transition">
            Logout
          </Link>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-8">

        {activeSection === 'digital-handshake' && (
          <div id="digital-handshake">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase">Digital Handshake</h1>
                <p className="text-slate-500">Create court-admissible royalty split agreements — Georgia Law compliant</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <div className="glass rounded-2xl p-8">
                <h2 className="text-lg font-bold mb-6">Create New Split Agreement</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Track / Project Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Neon Dreams (Rough Mix v3)"
                      value={dhTrack}
                      onChange={e => setDhTrack(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white outline-none focus:border-purple-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">ISRC / ISWC (optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. USUM72212345"
                      value={dhIsrc}
                      onChange={e => setDhIsrc(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white outline-none focus:border-purple-500 transition mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Rights Type</label>
                    <select
                      value={dhRights}
                      onChange={e => setDhRights(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 outline-none focus:border-purple-500 transition"
                    >
                      <option value="all-in">All-In (Master + Publishing)</option>
                      <option value="master">Master Only</option>
                      <option value="publishing">Publishing Only</option>
                      <option value="sync">Sync License</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Revenue Basis</label>
                    <select
                      value={dhRevenue}
                      onChange={e => setDhRevenue(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 outline-none focus:border-purple-500 transition"
                    >
                      <option value="net">Net Receipts</option>
                      <option value="gross">Gross Receipts</option>
                      <option value="adjusted">Adjusted Gross</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Jurisdiction</label>
                    <select
                      value={dhJurisdiction}
                      onChange={e => setDhJurisdiction(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 outline-none focus:border-purple-500 transition"
                    >
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
                        <input
                          type="text"
                          placeholder="Name"
                          value={col.name}
                          onChange={e => {
                            const updated = [...dhCollaborators];
                            updated[i] = { ...updated[i], name: e.target.value };
                            setDhCollaborators(updated);
                          }}
                          className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-purple-500"
                        />
                        <input
                          type="text"
                          placeholder="%"
                          value={col.pct}
                          onChange={e => {
                            const updated = [...dhCollaborators];
                            updated[i] = { ...updated[i], pct: e.target.value };
                            setDhCollaborators(updated);
                          }}
                          className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-purple-500 mono"
                        />
                        <select
                          value={col.role}
                          onChange={e => {
                            const updated = [...dhCollaborators];
                            updated[i] = { ...updated[i], role: e.target.value };
                            setDhCollaborators(updated);
                          }}
                          className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none"
                        >
                          <option>Artist</option>
                          <option>Producer</option>
                          <option>Feature</option>
                          <option>Songwriter</option>
                          <option>Label</option>
                        </select>
                      </div>
                    ))}
                    <button
                      onClick={() => setDhCollaborators([...dhCollaborators, { name: '', email: '', pct: '', role: 'Artist' }])}
                      className="text-xs text-purple-400 hover:text-purple-300 mt-1 font-bold"
                    >
                      + Add Collaborator
                    </button>
                  </div>

                  <button className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-sm transition shadow-lg shadow-purple-900/40 mt-2">
                    Generate Digital Handshake
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-6">
                <div className="glass rounded-2xl p-8">
                  <h2 className="text-lg font-bold mb-6">Agreement Preview</h2>
                  <div className="bg-slate-900 rounded-xl p-5 border border-slate-700 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-white">{dhTrack || 'Track Name'}</span>
                      <span className="px-2 py-0.5 bg-yellow-900/20 text-yellow-400 border border-yellow-900/40 rounded text-[9px] font-bold uppercase">PENDING</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Rights Type</span>
                        <span className="text-white mono">{dhRights}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Revenue Basis</span>
                        <span className="text-white mono">{dhRevenue}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Jurisdiction</span>
                        <span className="text-white mono">{dhJurisdiction}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-900/10 border border-amber-500/20 rounded-xl p-5">
                    <p className="text-xs font-bold text-amber-400 mb-3">Georgia Court Requirements:</p>
                    <ul className="space-y-1.5 text-[11px] text-slate-400">
                      <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Rights type defined</li>
                      <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Revenue basis specified</li>
                      <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Jurisdiction locked</li>
                      <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Timestamp + IP metadata attached</li>
                      <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Hash seal on execution</li>
                    </ul>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-3">Export Options</p>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition">
                      <span className="text-xs font-bold">Export Affidavit (PDF)</span>
                      <span className="text-purple-400 text-xs">→</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition">
                      <span className="text-xs font-bold">Export with Hash Seal</span>
                      <span className="text-purple-400 text-xs">→</span>
                    </button>
                    <Link href="/split-verification" className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition">
                      <span className="text-xs font-bold">Pre-Release Split Verification</span>
                      <span className="text-purple-400 text-xs">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'auditor' && (
          <>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase">Contract Auditor</h1>
                <p className="text-slate-500">AI-Powered Forensic Analysis &amp; Discrepancy Detection</p>
              </div>
              <div className="flex gap-3">
                <Link href="/label/conflict" className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-slate-300 hover:bg-slate-700 transition">
                  Conflict Center →
                </Link>
                <Link href="/label/vault" className="px-4 py-2 bg-purple-600 rounded-lg text-xs font-bold hover:bg-purple-500 transition shadow-lg shadow-purple-900/40">
                  Legal Vault →
                </Link>
              </div>
            </div>

            {/* Document selector */}
            <div className="flex gap-3 mb-6">
              {['Mask_Off_Master_Agreement.pdf', 'Jumpman_Split_Sheet.pdf', 'Creepin_Publishing_Deal.pdf'].map(doc => (
                <button
                  key={doc}
                  onClick={() => setActiveDoc(doc)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                    activeDoc === doc
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {doc}
                </button>
              ))}
            </div>

            {/* Split-view */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* PDF Viewer */}
              <div className="glass rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Document Viewer</span>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-green-900/20 text-green-400 border border-green-900/40 rounded text-[9px] font-bold uppercase">SHA-256 Verified</span>
                    <span className="px-2 py-0.5 bg-purple-900/20 text-purple-400 border border-purple-900/40 rounded text-[9px] font-bold uppercase">PDF/A</span>
                  </div>
                </div>

                <div className="pdf-page m-6 p-8 rounded-lg relative" style={{ minHeight: '500px', background: 'white', color: '#334155', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  {/* Scan line animation */}
                  <div className="scan-line" style={{ position: 'absolute', left: 0, right: 0 }}></div>

                  {/* AI highlight on clause 1 */}
                  {selectedClause === 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '170px',
                      left: '24px',
                      right: '24px',
                      height: '48px',
                      background: 'rgba(147,51,234,0.15)',
                      borderLeft: '3px solid #9333ea',
                    }}></div>
                  )}

                  <div className="text-xs font-bold text-right mb-6 font-sans uppercase">Date: January 12, 2017</div>
                  <h3 className="font-bold text-lg mb-4 text-center font-sans">MASTER RECORDING AGREEMENT</h3>
                  <p className="mb-3 text-sm">This Master Recording Agreement (&ldquo;Agreement&rdquo;) is entered into as of the date above between <strong>Theel Good Music LLC</strong> (&ldquo;Label&rdquo;) and <strong>Future Hendrix, Inc.</strong> (&ldquo;Artist&rdquo;).</p>

                  <h4 className="font-bold mt-4 mb-2 text-sm">Section 1 — Grant of Rights</h4>
                  <p className="mb-3 text-sm">Artist hereby grants to Label the exclusive right to manufacture, distribute, and sell phonorecords embodying the master recordings...</p>

                  <h4 className="font-bold mt-4 mb-2 text-sm">Section 4.2 — Royalty Split</h4>
                  <p className="mb-3 text-sm font-serif">Artist shall be entitled to receive royalties equal to <strong>45%</strong> of net receipts derived from exploitation of the master recordings in all territories...</p>

                  <h4 className="font-bold mt-4 mb-2 text-sm">Section 7.1 — Territory Rights</h4>
                  <p className="mb-3 text-sm">The rights granted herein are limited to the territory of <strong>North America</strong> unless otherwise agreed in writing...</p>

                  <h4 className="font-bold mt-4 mb-2 text-sm">Section 11 — Term Duration</h4>
                  <p className="mb-3 text-sm">This Agreement shall commence on the date hereof and shall continue for a period of <strong>nine (9) years</strong>, expiring March 2026, unless sooner terminated...</p>

                  <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-400">
                    <span>Page 1 of 8</span>
                    <span className="font-mono">Hash: 0x7a3f...d92e</span>
                  </div>
                </div>
              </div>

              {/* Discrepancies Panel */}
              <div className="glass rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Audit Discrepancies</span>
                  <span className="px-2 py-0.5 bg-red-900/20 text-red-400 border border-red-900/40 rounded text-[9px] font-bold uppercase animate-pulse">
                    {DISCREPANCIES.length} Issues Found
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  {DISCREPANCIES.map(d => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedClause(d.id)}
                      className={`w-full text-left p-4 rounded-xl border transition ${
                        selectedClause === d.id
                          ? 'border-purple-500/50 bg-purple-900/10'
                          : d.severity === 'critical'
                          ? 'border-red-500/20 bg-red-900/5 hover:border-red-500/40'
                          : d.severity === 'warning'
                          ? 'border-yellow-500/20 bg-yellow-900/5 hover:border-yellow-500/40'
                          : 'border-blue-500/20 bg-blue-900/5 hover:border-blue-500/40'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                          d.severity === 'critical' ? 'bg-red-900/30 text-red-400' :
                          d.severity === 'warning' ? 'bg-yellow-900/30 text-yellow-400' :
                          'bg-blue-900/30 text-blue-400'
                        }`}>
                          {d.severity}
                        </span>
                        <span className="text-[10px] text-slate-500 mono">{d.confidence}% confidence</span>
                      </div>
                      <p className="text-xs font-bold text-white mb-1">{d.clause}</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{d.issue}</p>
                    </button>
                  ))}

                  <div className="border-t border-slate-800 pt-4 mt-6">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-3">Recommended Actions</p>
                    <div className="space-y-2">
                      <Link href="/label/vault" className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition">
                        <span className="text-xs font-bold">Draft Dispute Letter</span>
                        <span className="text-purple-400 text-xs">→</span>
                      </Link>
                      <Link href="/split-verification" className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition">
                        <span className="text-xs font-bold">Verify Split Sheet</span>
                        <span className="text-purple-400 text-xs">→</span>
                      </Link>
                      <button className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition">
                        <span className="text-xs font-bold">Generate Court Report</span>
                        <span className="text-purple-400 text-xs">→</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button className="flex-1 px-4 py-2 border border-slate-700 rounded-lg text-xs font-bold text-slate-400 hover:bg-slate-800 transition">
                      Export Findings
                    </button>
                    <button className="flex-1 px-4 py-2 bg-purple-600 rounded-lg text-xs font-bold hover:bg-purple-500 transition shadow-lg shadow-purple-900/40">
                      Flag for Litigation
                    </button>
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
              <Link href="/label-workspace" className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold transition shadow-lg shadow-purple-900/40">
                Launch Label Workspace →
              </Link>
            </div>
          </div>
        )}

        {activeSection === 'reports' && (
          <div className="max-w-2xl mx-auto mt-16 text-center">
            <div className="glass p-12 rounded-2xl">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Court-Ready Reports</h2>
              <p className="text-slate-500 mb-8">Generate Bates-stamped audit reports with immutable blockchain proof, suitable for legal proceedings and board presentations.</p>
              <div className="flex gap-4 justify-center">
                <button className="px-8 py-4 border border-slate-700 rounded-xl font-bold text-slate-300 hover:bg-slate-800 transition">
                  Generate PDF Report
                </button>
                <Link href="/label/vault" className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold transition shadow-lg shadow-purple-900/40">
                  View Legal Vault →
                </Link>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
