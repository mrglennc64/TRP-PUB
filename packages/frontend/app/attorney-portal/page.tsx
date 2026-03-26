"use client";
import React from 'react';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Activity, FileSearch, Mic, ClipboardCheck } from 'lucide-react';

function useCountUp(target: number, duration = 1800, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return val;
}

const SECONDARY_METRICS = [
  { icon: Activity,       value: 470000000, label: 'DSPs Processed',      sub: 'Cross-Platform Stream Ingestion',    fmt: (n: number) => n >= 1000000 ? (n/1000000).toFixed(0)+'M' : n.toLocaleString() },
  { icon: FileSearch,     value: 1247,      label: 'PRO Matches',          sub: 'BMI / ASCAP / SESAC Registrations',  fmt: (n: number) => n.toLocaleString() },
  { icon: Mic,            value: 282,       label: 'Studio Links',         sub: 'Verified Session Log Handshakes',    fmt: (n: number) => n.toLocaleString() },
  { icon: ClipboardCheck, value: 156,       label: 'Split Sheets',         sub: 'AI-Parsed Legal Metadata',           fmt: (n: number) => n.toLocaleString() },
];

// ─── SVG CHARTS ──────────────────────────────────────────────────────────────
function IdentityDonut() {
  const segments = [
    { label: 'Verified',    value: 330, color: '#10b981' },
    { label: 'Pending KYC', value: 130, color: '#6366f1' },
    { label: 'High Risk',   value: 40,  color: '#f43f5e' },
  ];
  const total = segments.reduce((a, b) => a + b.value, 0);
  let cumulative = 0;
  const r = 52, cx = 70, cy = 70, stroke = 18;
  const circumference = 2 * Math.PI * r;
  const arcs = segments.map(s => {
    const pct = s.value / total;
    const arc = { offset: cumulative, pct, color: s.color, label: s.label, value: s.value };
    cumulative += pct;
    return arc;
  });
  return (
    <div className="bg-[#020617] border border-white/8 rounded-2xl p-5">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Identity Donut — 500 Nodes</p>
      <div className="flex items-center gap-6">
        <svg width={140} height={140} viewBox="0 0 140 140">
          {arcs.map((a, i) => (
            <circle key={i} cx={cx} cy={cy} r={r}
              fill="none" stroke={a.color} strokeWidth={stroke}
              strokeDasharray={`${a.pct * circumference} ${circumference}`}
              strokeDashoffset={-a.offset * circumference}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ filter: `drop-shadow(0 0 6px ${a.color}88)` }}
            />
          ))}
          <text x={cx} y={cy - 6} textAnchor="middle" fill="#f1f5f9" fontSize={22} fontWeight={900}>500</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fill="#475569" fontSize={9}>NODES</text>
        </svg>
        <div className="space-y-2.5">
          {segments.map((s, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
              <div>
                <p className="text-sm font-black text-slate-200">{s.value}</p>
                <p className="text-[10px] text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecoveryBarChart() {
  const bars = [
    { name: 'Metro',    val: 85, label: '$85k' },
    { name: 'Future',   val: 62, label: '$62k' },
    { name: 'Wheezy',   val: 48, label: '$48k' },
    { name: 'Southside',val: 35, label: '$35k' },
    { name: '21 Savage',val: 22, label: '$22k' },
  ];
  const max = 85;
  return (
    <div className="bg-[#020617] border border-white/8 rounded-2xl p-5">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Recovery — Money on the Table</p>
      <div className="space-y-2.5">
        {bars.map((b, i) => (
          <div key={i} className="flex items-center gap-3">
            <p className="text-[10px] text-slate-400 w-16 text-right flex-shrink-0">{b.name}</p>
            <div className="flex-1 bg-[#0f172a] rounded-full h-5 overflow-hidden">
              <div className="h-5 rounded-full flex items-center justify-end pr-2"
                style={{ width: `${(b.val/max)*100}%`, background: `linear-gradient(90deg, #6366f1, #10b981)`, boxShadow: '0 0 8px #10b98166' }}>
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-300 w-8 flex-shrink-0">{b.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GrowthLineChart() {
  const pts = [{ x: 0, v: 12 }, { x: 1, v: 45 }, { x: 2, v: 342 }];
  const months = ['Jan', 'Feb', 'Mar'];
  const W = 260, H = 90, PAD = 10;
  const maxV = 342;
  const toX = (i: number) => PAD + (i / (pts.length - 1)) * (W - PAD * 2);
  const toY = (v: number) => H - PAD - (v / maxV) * (H - PAD * 2);
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(p.v)}`).join(' ');
  const areaD = `${pathD} L ${toX(pts.length - 1)} ${H} L ${toX(0)} ${H} Z`;
  return (
    <div className="bg-[#020617] border border-white/8 rounded-2xl p-5">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Stockholm Velocity — Recovery Growth</p>
      <p className="text-2xl font-black text-emerald-400 mb-3" style={{ textShadow: '0 0 12px #10b981' }}>$342k <span className="text-sm font-normal text-slate-500">projected Mar</span></p>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d={areaD} fill="url(#areaGrad)" />
        <path d={pathD} fill="none" stroke="#10b981" strokeWidth={2.5} filter="url(#glow)" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={toX(i)} cy={toY(p.v)} r={4} fill="#10b981" filter="url(#glow)" />
            <text x={toX(i)} y={H + 12} textAnchor="middle" fill="#475569" fontSize={9}>{months[i]}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function PilotTracker() {
  const phases = [
    { label: 'Data Ingestion',              sub: 'Awaiting SoundExchange Export', done: false },
    { label: 'Stockholm Node Alignment',    sub: 'Pending',                       done: false },
    { label: 'Biometric Anchoring',         sub: 'Pending',                       done: false },
    { label: 'Forensic Payout Authorization',sub: 'Pending',                      done: false },
  ];
  return (
    <div className="border-2 border-dashed border-slate-700/50 rounded-2xl p-5 bg-[#0a0f1e]/40">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tier 2 Urban Pilot</p>
      <p className="text-xs text-slate-400 font-semibold mb-4">Batch #001</p>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Cases Loaded</p>
          <p className="text-[10px] font-bold text-slate-600">0 / 50</p>
        </div>
        <div className="h-2 bg-slate-800 rounded-full">
          <div className="h-2 rounded-full bg-slate-700 w-0" />
        </div>
        <p className="text-[10px] text-slate-600 mt-1">Waiting for SoundExchange data export</p>
      </div>
      <div className="space-y-3">
        {phases.map((p, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-0.5 w-4 h-4 rounded-full border border-dashed border-slate-600 flex items-center justify-center flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">{p.label}</p>
              <p className="text-[10px] text-slate-600">{p.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BatchOverview() {
  const [batch, setBatch] = useState('001');
  const stages = [
    { label: 'Ingested',              pct: 30, color: '#10b981' },
    { label: 'Node Matched',          pct: 15, color: '#6366f1' },
    { label: 'Biometrically Anchored',pct: 5,  color: '#f59e0b' },
    { label: 'LOD Dispatched',        pct: 0,  color: '#ef4444' },
  ];
  return (
    <div className="bg-[#0a0f1e] border border-white/10 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Batch Overview</p>
        <select value={batch} onChange={e => setBatch(e.target.value)}
          className="px-3 py-1.5 bg-[#1e293b] border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500">
          <option value="001">Batch #001: 50 Case Pilot (Active)</option>
          <option value="002">Batch #002: 1,000 Case Urban 2024 (Pending)</option>
        </select>
      </div>
      {/* Segmented progress bar */}
      <div className="mb-4">
        <div className="flex h-3 rounded-full overflow-hidden bg-[#0f172a] mb-3">
          {stages.map((s, i) => (
            <div key={i} style={{ width: `${s.pct || 1}%`, background: s.pct > 0 ? s.color : 'transparent', opacity: s.pct > 0 ? 1 : 0.3, boxShadow: s.pct > 0 ? `0 0 8px ${s.color}88` : 'none' }}
              className="transition-all duration-700" />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {stages.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">{s.label}</p>
                <p className="text-[10px] font-black" style={{ color: s.color }}>{s.pct}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button className="w-full py-3 font-black text-sm text-white uppercase tracking-widest rounded-xl transition"
        style={{ background: 'linear-gradient(135deg,#065f46,#064e3b)', border: '1px solid rgba(16,185,129,0.3)', boxShadow: '0 0 20px rgba(16,185,129,0.1)' }}>
        Generate Batch Forensic Reports
      </button>
    </div>
  );
}

function HeadhunterPilot() {
  const [scanPos, setScanPos] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setScanPos(p => (p + 1) % 4), 3000);
    return () => clearInterval(t);
  }, []);
  const logLines = [
    '[SYSTEM]: All 34 Stockholm Nodes online...',
    '[SYSTEM]: Waiting for data stream...',
    '[BRIDGE]: Peer-to-Peer Identity Bridge ACTIVE',
  ];
  return (
    <div className="mb-8 rounded-2xl border border-amber-500/20 bg-[#0a0a00]/60 overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/10">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black text-white tracking-tight">Headhunter Pilot</h2>
          <span className="text-slate-500 text-xs">Batch #SX-PILOT-001 · Urban Tier 2 Jungle</span>
        </div>
        {/* Pulsing READY FOR INGRESS badge */}
        <span className="relative flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/50 bg-amber-500/10"
          style={{ boxShadow: '0 0 16px rgba(251,191,36,0.35), 0 0 32px rgba(251,191,36,0.12)' }}>
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" style={{ boxShadow: '0 0 8px #fbbf24' }} />
          <span className="text-xs font-black tracking-widest text-amber-300 uppercase">Ready for Ingress</span>
        </span>
      </div>

      <div className="px-6 pt-6 pb-4">
        {/* 0/50 KPI */}
        <div className="text-center mb-8">
          <p className="text-[80px] font-black leading-none text-white tracking-tight">
            0 <span className="text-slate-600">/</span> <span className="text-slate-500">50</span>
          </p>
          <p className="text-slate-400 text-sm mt-2 uppercase tracking-widest font-semibold">Resolved · Batch #SX-PILOT-001 · Urban Tier 2 Jungle</p>
        </div>

        {/* 50-slot placeholder grid */}
        <div className="relative mb-8">
          <div className="grid grid-cols-10 gap-1.5 opacity-30">
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="h-10 rounded border border-dashed border-slate-600 bg-slate-900/40 flex items-center justify-center">
                <span className="text-[8px] text-slate-700 font-mono">{String(i + 1).padStart(2, '0')}</span>
              </div>
            ))}
          </div>
          {/* Watermark overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-slate-600/40 text-[11px] font-black uppercase tracking-[0.3em] text-center leading-relaxed select-none">
              AWAITING<br />SOUNDEXCHANGE<br />TIER 2 CSV EXPORT
            </p>
          </div>
        </div>

        {/* CTA Button with scan light */}
        <div className="flex justify-center mb-8">
          <div className="relative overflow-hidden rounded-2xl" style={{ boxShadow: '0 0 40px rgba(79,70,229,0.4)' }}>
            <button className="relative px-16 py-5 bg-[#4F46E5] text-white font-black text-lg uppercase tracking-widest rounded-2xl">
              Start Headhunter Pilot
            </button>
            {/* Scan sweep */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
              <div
                className="absolute top-0 bottom-0 w-16 -skew-x-12"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
                  left: `${scanPos * 33}%`,
                  transition: 'left 0.6s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Terminal log */}
        <div className="bg-[#020617] border border-green-900/40 rounded-xl p-4 font-mono">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-green-600 uppercase tracking-widest font-bold">System Console</span>
          </div>
          <div className="space-y-1">
            {logLines.map((line, i) => (
              <div key={i} className="flex gap-3 text-xs">
                <span className="text-green-600/70 flex-shrink-0">{'>'}</span>
                <span className="text-green-400/80">{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SecondaryMetrics() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const counts = [
    useCountUp(SECONDARY_METRICS[0].value, 2200, active),
    useCountUp(SECONDARY_METRICS[1].value, 1800, active),
    useCountUp(SECONDARY_METRICS[2].value, 1600, active),
    useCountUp(SECONDARY_METRICS[3].value, 1400, active),
  ];
  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {SECONDARY_METRICS.map((m, i) => {
        const Icon = m.icon;
        return (
          <div key={i} className="relative bg-[#0f172a] border border-white/8 rounded-xl p-4 overflow-hidden">
            <Icon className="absolute top-3 right-3 w-8 h-8 text-slate-400 opacity-[0.12]" strokeWidth={1.5} />
            <p className="text-2xl font-black text-slate-200 tabular-nums">{m.fmt(counts[i])}</p>
            <p className="text-[11px] font-semibold text-slate-400 mt-1">{m.label}</p>
            <p className="text-[10px] text-slate-600 mt-0.5">{m.sub}</p>
          </div>
        );
      })}
    </div>
  );
}

const QRCode = ({ value, size = 120 }: { value: string; size?: number }) => (
  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`} alt="QR" width={size} height={size} style={{ borderRadius: '0.5rem' }} />
);

const MATTERS = [
  { id: 1, name: "Metro Boomin - Creepin Dispute", amount: "$187,200", status: "Urgent", leakage: "31%", issues: 5 },
  { id: 2, name: "B.o.B Estate - 360 Deal Audit", amount: "$450,000", status: "In Progress", leakage: "22%", issues: 8 },
  { id: 3, name: "Future - Publishing Rights", amount: "$92,500", status: "Ready", leakage: "15%", issues: 3 },
];

const PILOT_DATA = [
  {
    isrc: 'US-ATL-23-001', alias: 'Zaytoven', legalName: 'Xavier Dotson', ipi: '00451554668',
    status: 'VERIFIED', action: 'View Report', settlement: '$24,500',
    note: 'Legacy ISWC mapping inconsistency',
  },
  {
    isrc: 'US-S3W-24-042', alias: 'Metro Boomin', legalName: 'Leland Wayne', ipi: '00690060591',
    status: 'VERIFIED', action: 'View Report', settlement: '$28,000',
    note: 'Featured Artist vs Producer tag conflict',
  },
  {
    isrc: 'US-UG-22-901', alias: 'Wheezy', legalName: 'Wesley Glass', ipi: '00658428135',
    status: 'PENDING KYC', action: 'Resume KYC', settlement: '$8,750',
    note: 'Unlinked secondary producer credits',
  },
  {
    isrc: 'US-CAS-23-115', alias: 'Southside', legalName: 'Joshua Luellen', ipi: '00609325985',
    status: 'VERIFIED', action: 'View Report', settlement: '$19,200',
    note: '808 Mafia/Solo credit fragmentation',
  },
  {
    isrc: 'US-NYC-24-882', alias: 'Tity Boi', legalName: 'Tauheed Epps (2 Chainz)', ipi: '00488661706',
    status: 'HIGH RISK', action: 'Escalate', settlement: null,
    note: "Legacy 'Tity Boi' alias bridging required",
  },
];

function buildContent(type: string, name: string, amount: string, leakage: string, issues: number) {
  if (type === 'court') {
    return `<div class="section"><h2>Executive Summary</h2><p>Forensic audit for ${name}.</p><table><tr><th>Metric</th><th>Value</th></tr><tr><td>Unclaimed</td><td class="highlight">${amount}</td></tr><tr><td>Leakage</td><td class="danger">${leakage}</td></tr><tr><td>Issues</td><td class="warning">${issues}</td></tr></table></div><div class="section"><h2>Ownership</h2><table><tr><th>Party</th><th>Claimed</th><th>Verified</th><th>Status</th></tr><tr><td>Artist</td><td>50%</td><td class="highlight">50%</td><td class="highlight">Verified</td></tr><tr><td>Producer</td><td>30%</td><td class="warning">25%</td><td class="warning">Under-claimed</td></tr><tr><td>Co-Writer</td><td>20%</td><td class="danger">15%</td><td class="danger">Disputed</td></tr></table></div>`;
  }
  if (type === 'demand') {
    const d = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
    return `<div class="section"><p><b>Date:</b> ${d}</p><p>Republic Records, Attn: Legal Department</p></div><div class="section"><p><b>RE: DEMAND FOR UNPAID ROYALTIES</b></p><p>Matter: ${name}</p><p>Amount: ${amount}</p><br><p>Dear Sir or Madam:</p><br><p>This firm demands immediate payment of ${amount} in unpaid royalties. Failure to remit within 30 days will result in legal proceedings.</p><br><p>Respectfully,<br>Leron Rogers, Esq.<br>Carter Woodard, LLC. Attorney Advertising</p></div>`;
  }
  if (type === 'affidavit') {
    const d = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
    return `<div class="section"><h2>AFFIDAVIT OF LERON ROGERS, ESQ.</h2><p>STATE OF _____________)</p><br><p>I, Leron Rogers, being duly sworn, state:</p><ol><li>I am counsel for ${name}.</li><li>Forensic audit confirms ${amount} in unpaid royalties.</li><li>${issues} material discrepancies identified. Leakage: ${leakage}.</li><li>All findings verified via the TrapRoyaltiesPro audit system.</li></ol><br><p>Executed: ${d}</p><br><p>___________________________<br>Leron Rogers, Esq.</p><br><p>___________________________<br>Notary Public</p></div>`;
  }
  return `<div class="section"><h2>Custom Report</h2><p>Matter: ${name}</p><table><tr><th>Category</th><th>Finding</th><th>Impact</th></tr><tr><td>Streaming</td><td class="warning">Underreported Q3-Q4</td><td class="danger">-$45,200</td></tr><tr><td>Sync</td><td class="highlight">Verified</td><td>+$0</td></tr><tr><td>Performance</td><td class="danger">No ASCAP registration</td><td class="danger">${amount}</td></tr></table></div>`;
}

function generatePDF(title: string, content: string, matterName: string, matterId: number) {
  const hash = 'TRP-' + matterId + '-' + Date.now().toString(36).toUpperCase();
  const url = 'https://traproyaltiespro.com/verify/' + hash;
  const sha = Array.from({length:64},()=>Math.floor(Math.random()*16).toString(16)).join('');
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#1a1a1a}.section{margin:24px 0;padding:16px;background:#f9fafb;border-radius:8px;border-left:4px solid #4f46e5}table{width:100%;border-collapse:collapse;margin:16px 0}th{background:#eef2ff;padding:10px;text-align:left;color:#4f46e5}td{padding:10px;border-bottom:1px solid #e5e7eb}.qr{display:flex;align-items:center;gap:20px;padding:16px;background:#f0fdf4;border-radius:8px;border:1px solid #86efac;margin-top:24px}.footer{margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:.75rem;color:#9ca3af;text-align:center}.highlight{color:#16a34a;font-weight:bold}.warning{color:#d97706;font-weight:bold}.danger{color:#dc2626;font-weight:bold}h2{color:#1e1b4b}</style></head><body><h1 style="color:#1e1b4b">${title}</h1><p style="color:#6b7280">Matter: ${matterName} | Carter Woodard, LLC. Attorney Advertising | Leron Rogers, Esq. | ID: ${hash}</p>${content}<div class="qr"><img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(url)}" width="100" height="100" style="border-radius:8px"/><div><div style="font-weight:bold;color:#166534">QR Verification Seal</div><div style="font-size:.8rem;margin:4px 0">Scan to verify authenticity</div><div style="font-size:.7rem;color:#6b7280">${url}</div><div style="font-family:monospace;font-size:.7rem;background:#f3f4f6;padding:6px;border-radius:4px;margin-top:6px;word-break:break-all">SHA-256: ${sha}</div></div></div><div class="footer">TrapRoyaltiesPro.com | Confidential | Verify: ${url}</div></body></html>`;
  const blob = new Blob([html], {type:'text/html'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = title.replace(/\s+/g,'-') + '-' + hash + '.html';
  a.click();
}




// ─── Lead Intelligence Dashboard ─────────────────────────────────────────────

function toLeadSlug(artist: string, track: string) {
  return (artist + '_' + track).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+$/, '');
}

const ALL_LEADS = [
  { artist: "Doja Cat, Nicki Minaj", track: "Agora Hills (Remix)", value: 600000, tag: "remix" },
  { artist: "Doja Cat", track: "MASC (Remix)", value: 145000, tag: "remix" },
  { artist: "Doja Cat", track: "Agora Hills ft. Buss Ross", value: 138000, tag: "remix" },
  { artist: "Doja Cat", track: "Attention (Remix)", value: 129000, tag: "remix" },
  { artist: "Nicki Minaj", track: "Pink Friday Girls (Remix)", value: 127000, tag: "remix" },
  { artist: "Latto", track: "Sunday Service ft. Cardi B", value: 98000, tag: "atl" },
  { artist: "Sexyy Red", track: "Get It Sexyy (Remix)", value: 91000, tag: "remix" },
  { artist: "Sexyy Red", track: "SkeeYee (Remix)", value: 88000, tag: "remix" },
  { artist: "Bktherula", track: "Arc'teryx", value: 80000, tag: "atl" },
  { artist: "Flo Milli", track: "Never Lose Me ft. Pink Pantheress", value: 74000, tag: "remix" },
  { artist: "BIA", track: "Whole Lotta Money (Remix)", value: 64000, tag: "remix" },
  { artist: "Anycia", track: "Back Outside ft. GloRilla", value: 59000, tag: "atl" },
  { artist: "KARAABOO", track: "Sky Gen Quincy", value: 53000, tag: "atl" },
  { artist: "Bktherula", track: "Prada Or Celine", value: 50000, tag: "atl" },
  { artist: "TiaCorine", track: "Boat", value: 50000, tag: "atl" },
  { artist: "KARAABOO", track: "Splash Brothers", value: 48000, tag: "atl" },
  { artist: "KARAABOO", track: "Say Sum (Remix)", value: 43000, tag: "atl" },
  { artist: "TiaCorine", track: "Thunder", value: 40000, tag: "atl" },
  { artist: "Monaleo", track: "Like That", value: 40000, tag: "atl" },
  { artist: "Mondes", track: "New Era", value: 39000, tag: "atl" },
  { artist: "Yung Miami", track: "360 ft. Cardi B", value: 37000, tag: "atl" },
  { artist: "Yung Miami", track: "Like What (Freestyle)", value: 34000, tag: "atl" },
  { artist: "SZA", track: "Snooze (Remix)", value: 31000, tag: "remix" },
  { artist: "YKNIECE", track: "YK Flow", value: 30000, tag: "atl" },
  { artist: "Karrahbooo", track: "ATL Drill", value: 30000, tag: "atl" },
  { artist: "Cuban Doll", track: "Bankrupt ft. Lakeyah", value: 28000, tag: "gospel" },
  { artist: "Mulatto Witch", track: "Witch Party", value: 24000, tag: "gospel" },
  { artist: "Mulatto Witch", track: "Red Girls (Remix)", value: 21000, tag: "gospel" },
  { artist: "YKNIECE", track: "Hardest Female", value: 20000, tag: "atl" },
  { artist: "Molly Santana", track: "FLAMMABLE", value: 20000, tag: "atl" },
  { artist: "YEAUX", track: "Therapy", value: 18000, tag: "gospel" },
  { artist: "YEAUX", track: "All The Way Up (Remix)", value: 15000, tag: "gospel" },
  { artist: "Tyga Box", track: "Off My Dizney", value: 12000, tag: "atl" },
  { artist: "FattMack", track: "FDO", value: 10000, tag: "atl" },
  { artist: "Bunny Barr", track: "Drop City", value: 9000, tag: "atl" },
];

function genToken() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function BiometricModal({ lead, onClose }: { lead: typeof ALL_LEADS[0], onClose: () => void }) {
  const token = React.useMemo(() => genToken(), []);
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://traproyaltiespro.com';
  const link = base + '/artist-intake?artist=' + encodeURIComponent(lead.artist) + '&track=' + encodeURIComponent(lead.track) + '&ref=' + token;
  const [copied, setCopied] = React.useState(false);

  const copy = () => {
    navigator.clipboard.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#0f172a] border border-white/15 rounded-2xl p-7 max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Send Biometric Intake Link</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition text-xl leading-none">&times;</button>
        </div>

        <div className="mb-5">
          <p className="text-sm font-semibold text-white">{lead.artist}</p>
          <p className="text-xs text-slate-500">{lead.track} &mdash; Est. ${lead.value.toLocaleString()} recovery</p>
        </div>

        <div className="bg-[#1e293b]/80 border border-white/10 rounded-xl p-4 mb-5">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Secure Intake Link</p>
          <p className="font-mono text-xs text-indigo-300 break-all leading-relaxed">{link}</p>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-xs text-slate-500">This link will take the artist to a secure form to submit:</p>
          <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
            <li>Full legal name + stage name</li>
            <li>SSN or EIN (for W-9 filing)</li>
            <li>Bank account for direct deposit</li>
            <li>Electronic authorization signature</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button onClick={copy}
            className={"flex-1 py-3 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 " +
              (copied ? "bg-emerald-600 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white")}>
            {copied ? (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Copied!</>
            ) : (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copy Link</>
            )}
          </button>
          <a href={"mailto:?subject=Action Required: Claim Your Unclaimed Royalties&body=Hi " + encodeURIComponent(lead.artist) + ",%0D%0A%0D%0AYour attorney has identified unclaimed royalties on " + encodeURIComponent(lead.track) + ".%0D%0A%0D%0APlease complete the secure intake form to authorize recovery:%0D%0A" + encodeURIComponent(link)}
            className="px-5 py-3 rounded-xl text-sm font-medium bg-[#1e293b]/80 border border-white/10 text-slate-300 hover:text-white hover:border-indigo-500/40 transition">
            Email
          </a>
        </div>
      </div>
    </div>
  );
}

function LeadIntelligenceDashboard() {
  const [filter, setFilter] = React.useState<string>("all");
  const [claimed, setClaimed] = React.useState<Record<number, boolean>>({});
  const [showAll, setShowAll] = React.useState(false);
  const [lastRefresh, setLastRefresh] = React.useState(new Date());
  const [bioModal, setBioModal] = React.useState<typeof ALL_LEADS[0] | null>(null);

  React.useEffect(() => {
    const timer = setInterval(() => setLastRefresh(new Date()), 300000);
    return () => clearInterval(timer);
  }, []);

  const filtered = filter === "all" ? ALL_LEADS
    : filter === "high" ? ALL_LEADS.filter(l => l.value >= 10000)
    : ALL_LEADS.filter(l => l.tag === filter);

  const visible = showAll ? filtered : filtered.slice(0, 5);
  const totalPipeline = ALL_LEADS.reduce((a, b) => a + b.value, 0);
  const totalRecovery = Math.round(totalPipeline * 2.73);
  const unclaimed = ALL_LEADS.filter((_, i) => !claimed[i]).length;

  const FILTERS = [
    { key: "all", label: "All Leads (" + ALL_LEADS.length + ")" },
    { key: "high", label: "High Value ($10k+)" },
    { key: "remix", label: "Remixes Only" },
    { key: "atl", label: "ATL Female" },
    { key: "gospel", label: "Gospel / Soul" },
  ];

  return (
    <div>
      {bioModal && <BiometricModal lead={bioModal} onClose={() => setBioModal(null)} />}

      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-3xl font-bold text-white">Lead Intelligence Dashboard</h1>
          <p className="text-slate-400 mt-1">
            {unclaimed} new recovery opportunities &mdash; Last refreshed {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <span className="text-[10px] text-slate-500 mt-2">Auto-refreshes every 5 min</span>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6 mb-8">
        {[
          { label: "TOTAL PIPELINE VALUE", value: "$" + (totalPipeline / 1000).toFixed(0) + "k", color: "text-emerald-400" },
          { label: "EST. TOTAL RECOVERY", value: "$" + (totalRecovery / 1000000).toFixed(2) + "M", color: "text-emerald-400" },
          { label: "AVG FEE PER LEAD", value: "$150", color: "text-white" },
          { label: "LEADS READY", value: String(unclaimed), color: "text-indigo-400" },
        ].map((s, i) => (
          <div key={i} className="bg-[#1e293b]/60 border border-white/10 rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{s.label}</p>
            <p className={"text-4xl font-black " + s.color}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => { setFilter(f.key); setShowAll(false); }}
            className={"px-5 py-2 rounded-xl text-sm font-medium transition " +
              (filter === f.key
                ? "bg-indigo-600 text-white"
                : "bg-[#1e293b]/60 border border-white/10 text-slate-400 hover:text-white hover:border-indigo-500/40")}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-[#1e293b]/60 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-slate-500">
              <th className="py-4 px-5 text-left w-8">#</th>
              <th className="py-4 px-5 text-left">Artist / Track</th>
              <th className="py-4 px-5 text-left">ISRC Status</th>
              <th className="py-4 px-5 text-left">Est. Recovery</th>
              <th className="py-4 px-5 text-left">Registry Status</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {visible.map((lead, idx) => {
              const globalIdx = ALL_LEADS.indexOf(lead);
              return (
                <tr key={idx} className="hover:bg-white/5 transition">
                  <td className="py-4 px-5 text-slate-600 text-xs">{globalIdx + 1}</td>
                  <td className="py-4 px-5">
                    <p className="font-semibold text-white">{lead.artist}</p>
                    <p className="text-xs text-slate-500">{lead.track}</p>
                  </td>
                  <td className="py-4 px-5">
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-3 py-1 rounded-full font-medium">
                      NOT REGISTERED
                    </span>
                  </td>
                  <td className="py-4 px-5 font-bold text-emerald-400">
                    ${lead.value.toLocaleString()}
                  </td>
                  <td className="py-4 px-5">
                    {claimed[globalIdx]
                      ? <span className="text-emerald-400 text-xs font-medium">Claimed</span>
                      : <span className="text-red-400 text-xs font-medium">NOT YET ASSIGNED</span>}
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setBioModal(lead)}
                        className="bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-500/50 text-white text-xs px-4 py-2 rounded-xl font-medium transition whitespace-nowrap">
                        Send Biometric Link
                      </button>
                      <a href={"/attorney-portal/lead/" + toLeadSlug(lead.artist, lead.track)}
                        className="bg-red-600/70 hover:bg-red-600 border border-red-500/40 text-white text-xs px-4 py-2 rounded-xl font-medium transition whitespace-nowrap inline-block">
                        Show Details
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!showAll && filtered.length > 25 && (
          <div className="border-t border-white/10 p-5 flex justify-center">
            <button onClick={() => setShowAll(true)}
              className="flex items-center gap-2 px-8 py-3 bg-[#0f172a] hover:bg-[#1e293b] border border-white/10 rounded-xl text-sm text-slate-300 font-medium transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Load More Leads ({filtered.length - 25} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


export default function AttorneyPortal() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedMatter, setSelectedMatter] = useState(1);
  const [scanRunning, setScanRunning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [splitStep, setSplitStep] = useState<number>(0);
  const [splitData, setSplitData] = useState<any[]>([]);
  const [splitErrors, setSplitErrors] = useState<string[]>([]);
  const [splitVerifyId, setSplitVerifyId] = useState<string>('');
  const [splitTimestamp, setSplitTimestamp] = useState<string>('');
  const [splitPayAmount, setSplitPayAmount] = useState<number>(50000);
  const [handshakeTrack, setHandshakeTrack] = useState('');
  const [handshakeEmail, setHandshakeEmail] = useState('');
  const [handshakePercentage, setHandshakePercentage] = useState('');
  const [handshakeName, setHandshakeName] = useState('');
  const [handshakeRole, setHandshakeRole] = useState('artist');
  const [handshakeISRC, setHandshakeISRC] = useState('');
  const [handshakeRightsType, setHandshakeRightsType] = useState('all-in');
  const [handshakeRevenueBasis, setHandshakeRevenueBasis] = useState('net');
  const [handshakeJurisdiction, setHandshakeJurisdiction] = useState('georgia');
  const [verifyModal, setVerifyModal] = useState<{ name: string; ipi: string; alias?: string; isrc?: string } | null>(null);
  const [simRunning, setSimRunning] = useState(false);
  const [simComplete, setSimComplete] = useState(false);
  const [copied, setCopied] = useState(false);
  const [forensicModal, setForensicModal] = useState<{ name: string; ipi: string; alias?: string; isrc?: string } | null>(null);
  const [hashCopied, setHashCopied] = useState(false);
  const [dispatchModal, setDispatchModal] = useState<{ name: string; ipi: string; alias?: string; isrc?: string } | null>(null);
  const [dispatchConfirmed, setDispatchConfirmed] = useState(false);
  const [dispatchTracking, setDispatchTracking] = useState('');
  const openDispatch = (row: typeof PILOT_DATA[0]) => {
    setDispatchModal({ name: row.legalName, ipi: row.ipi, alias: row.alias, isrc: row.isrc });
    setDispatchConfirmed(false);
    setDispatchTracking('');
  };
  const downloadForensicPacket = (modal: { name: string; ipi: string; alias?: string; isrc?: string }, tracking?: string) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://usesmpt.com/smpt-verify.html?ipi=${modal.ipi}`;
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<title>Forensic Verification Packet — ${modal.name}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Georgia,serif;font-size:11px;color:#1a1a1a;background:#fff;padding:40px}
  h1{font-size:15px;font-weight:900;text-transform:uppercase;letter-spacing:.04em}
  h2{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#666;margin:18px 0 6px}
  .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #166534;padding-bottom:14px;margin-bottom:16px}
  .seal{background:#166534;color:#fff;border-radius:8px;padding:8px 10px;text-align:center;font-size:7px;font-weight:900;text-transform:uppercase;line-height:1.4}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .field label{font-size:9px;color:#666}
  .field span{font-weight:600}
  .mono{font-family:monospace;background:#f3f4f6;padding:1px 5px;border-radius:3px;font-size:9px}
  .badge{background:#166534;color:#fff;font-size:7px;font-weight:700;padding:1px 6px;border-radius:3px;text-transform:uppercase}
  .section{border:1px solid #e5e7eb;border-radius:6px;padding:12px;margin-bottom:10px}
  .legal-text{border:1px solid #d1d5db;border-radius:4px;padding:10px;font-style:italic;color:#374151;line-height:1.7;font-size:10px}
  .auth-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px}
  .auth-cell{background:#f9fafb;border:1px solid #e5e7eb;border-radius:4px;padding:8px}
  .auth-cell .label{font-size:8px;text-transform:uppercase;letter-spacing:.06em;color:#9ca3af;margin-bottom:2px}
  .auth-cell .val{font-size:9px;font-weight:700}
  .green{color:#166534}
  .node-seal{background:#f0fdf4;border:1px solid #86efac;border-radius:6px;padding:10px;display:flex;gap:10px;align-items:flex-start;margin-bottom:12px;font-size:8.5px;color:#166534}
  .sig-line{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:14px;padding-top:10px;border-top:1px solid #e5e7eb;font-size:8px;color:#6b7280;text-align:center}
  .cover{border:1px solid #e0e7ff;border-radius:8px;padding:16px;margin-bottom:20px;font-size:10.5px;line-height:1.8}
  .cover .meta{border-bottom:1px solid #e0e7ff;padding-bottom:10px;margin-bottom:12px;font-size:10px}
  .cover .meta p{margin-bottom:3px}
  .cover .meta span.label{color:#6b7280;display:inline-block;width:70px}
  .cover ul{padding-left:14px;margin:8px 0}
  .cover ul li{margin-bottom:4px}
  .action{color:#b45309;font-weight:700}
  .tracking{text-align:center;margin:16px 0;padding:10px;background:#f0fdf4;border:1px solid #86efac;border-radius:6px;font-size:11px}
  .page-break{page-break-before:always}
  @media print{body{padding:20px}}
</style></head><body>

<div class="cover">
  <div class="meta">
    <p><span class="label">To:</span> <strong>SoundExchange Claims / Legal Dept.</strong></p>
    <p><span class="label">From:</span> Leron Rogers | Carter Woodard, LLC. Attorney Advertising</p>
    <p><span class="label">Subject:</span> <strong>PRIORITY: Biometrically Verified LOD | Claim #${modal.isrc} | Artist: ${modal.alias}</strong></p>
  </div>
  <p>To the SoundExchange Claims Team,</p><br/>
  <p>Please find the attached Forensic Verification Packet for my client, <strong>${modal.name} (${modal.alias})</strong>, regarding the unresolved royalties for the associated ISRCs in the Urban Tier 2 bucket.</p><br/>
  <p>This claim has been processed via the SMPT Stockholm Node Protocol and includes:</p>
  <ul>
    <li><strong>Biometric Anchor:</strong> A 3D-Liveness verified signature (attached as a cryptographically sealed LOD).</li>
    <li><strong>Forensic Audit Trail:</strong> Verified GPS, Timestamp, and Device Integrity data.</li>
    <li><strong>Conflict Resolution:</strong> My office has reviewed the metadata matching and confirms this is the authoritative claimant.</li>
  </ul><br/>
  <p><span class="action">Action Required:</span> Please update the payment instructions in the <strong>${modal.alias}</strong> account to reflect the attached Banking Directive and clear the current "Black Box" status for these works.</p><br/>
  <p>Best Regards,<br/><strong>Leron Rogers</strong><br/><span style="color:#6b7280;font-size:9px">Managing Partner · Carter Woodard, LLC. Attorney Advertising</span></p>
  ${tracking ? `<div class="tracking">Dispatch Tracking: <strong>${tracking}</strong> · Tethered to Blockchain · Chain: Polygon PoS</div>` : ''}
</div>

<div class="page-break"></div>

<div class="header">
  <div>
    <h1>Irrevocable Letter of Direction<br/>&amp; Identity Attestation</h1>
    <p style="font-size:9px;color:#666;margin-top:4px">Protocol Reference: SMPT-SX-PILOT-2026-001</p>
    <p style="font-size:9px;color:#666">Date of Execution: March 18, 2026 · Jurisdiction: United States</p>
  </div>
  <div class="seal">SMPT<br/>BIOMETRIC<br/>SECURITY<br/>SEAL</div>
</div>

<h2>1. Rights Holder Identification</h2>
<div class="section grid2" style="margin-bottom:12px">
  <div class="field"><label>Legal Name</label><br/><span>${modal.name}</span></div>
  <div class="field"><label>IPI Number</label><br/><span class="mono">${modal.ipi}</span></div>
  <div class="field"><label>Professional Alias</label><br/><span>${modal.alias}</span></div>
  <div class="field"><label>Verification Hash</label><br/><span class="mono">SHA256: 77e1...92b</span> <span class="badge">Biometrically Anchored</span></div>
</div>

<h2>2. Asset Metadata</h2>
<div class="section grid2" style="margin-bottom:12px">
  <div class="field"><label>ISRC</label><br/><span class="mono">${modal.isrc}</span></div>
  <div class="field"><label>Claim Share</label><br/><span>25% of Contributor Royalties</span></div>
</div>

<h2>3. Direct Payment Instruction</h2>
<div class="legal-text" style="margin-bottom:12px">"I, the undersigned Rights Holder, hereby irrevocably authorize and direct SoundExchange, Inc. to adjust the metadata for the above-referenced ISRC to reflect my legal ownership. Furthermore, I direct that all past, present, and future royalties held in suspense or 'Black Box' accounts associated with this ISRC be released for payment to my designated legal representative or account of record, as verified via the SMPT Protocol."</div>

<h2>4. Forensic Authentication</h2>
<div class="auth-grid">
  <div class="auth-cell"><div class="label">Biometric Liveness Check</div><div class="val green">PASSED — Timestamp: March 18, 2026</div></div>
  <div class="auth-cell"><div class="label">ID Document Verification</div><div class="val green">VERIFIED · PII SCRUBBED</div></div>
  <div class="auth-cell"><div class="label">Legal Signatory</div><div class="val">Leron Rogers (Carter Woodard, LLC. Attorney Advertising)</div></div>
  <div class="auth-cell"><div class="label">SMPT Attestation ID</div><div class="val mono">SMPT-2026-ATT-00119</div></div>
</div>

<div class="node-seal">
  <div style="font-weight:900;font-size:10px">SMPT NODE SECURITY SEAL · DIGITAL ATTESTATION ANCHOR<br/>
  <span style="font-weight:400;font-size:8.5px">Node: Stockholm-1 · MusicBrainz IPI Registry<br/>
  Chain Anchor: 0x71D4a9b3...e3d1e42 · Protocol: SMPT-SX-PILOT-2026-001 · Issued via usesmpt.com</span></div>
  <span style="margin-left:auto;font-weight:900;font-size:8px;border:1px solid #166534;padding:1px 6px;border-radius:3px">LIVE</span>
</div>

<div style="text-align:center;margin:10px 0">
  <img src="${qrUrl}" width="80" height="80"/><br/>
  <span style="font-size:8px;color:#9ca3af">SCAN TO VERIFY BIOMETRIC INTEGRITY · usesmpt.com</span>
</div>

<div class="sig-line">
  <div>Rights Holder Signature &amp; Date</div>
  <div>Legal Representative Signature &amp; Date</div>
</div>

</body></html>`;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 600);
  };

  const confirmDispatch = () => {
    const id = 'TRP-' + Math.random().toString(36).slice(2,8).toUpperCase() + '-' + Date.now().toString().slice(-4);
    setDispatchTracking(id);
    setDispatchConfirmed(true);
  };

  const openVerifyModal = (name: string, ipi: string, alias?: string, isrc?: string) => {
    setVerifyModal({ name, ipi, alias, isrc });
    setSimRunning(false);
    setSimComplete(false);
  };
  const closeVerifyModal = () => setVerifyModal(null);
  const simulateCompletion = () => {
    setSimRunning(true);
    setTimeout(() => { setSimRunning(false); setSimComplete(true); }, 2200);
  };
  const copyLink = () => {
    navigator.clipboard.writeText('https://usesmpt.com/smpt-verify.html');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const matter = MATTERS.find(m => m.id === selectedMatter) || MATTERS[0];

  const runScan = () => {
    setScanRunning(true);
    setScanComplete(false);
    setTimeout(() => { setScanRunning(false); setScanComplete(true); }, 2500);
  };

  const handleDownload = (type: string, title: string) => {
    setDownloading(type);
    setTimeout(() => {
      generatePDF(title, buildContent(type, matter.name, matter.amount, matter.leakage, matter.issues), matter.name, matter.id);
      setDownloading(null);
    }, 800);
  };

  const showBar = !['dashboard', 'war-room', 'new-matter', 'secure-message', 'digital-handshake', 'lead-intelligence'].includes(activeSection);

  const navGroups = [
    { label: "Lead Intelligence", items: [
      { id: 'lead-intelligence', label: 'Lead Intelligence Dashboard', icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", badge: "28" },
    ]},
    { label: "Matter Management", items: [
      { id: 'dashboard', label: 'Mission Control', icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
      { id: 'war-room', label: 'War Room', icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
      { id: 'new-matter', label: 'New Matter', icon: "M12 4v16m8-8H4" },
    ]},
    { label: "Digital Handshake", items: [
      { id: 'digital-handshake', label: 'Digital Handshake', icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    ]},
    { label: "Audit & Due Diligence", items: [
      { id: 'run-due-diligence', label: 'Run Catalog Due Diligence', icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
      { id: 'pre-release-verify', label: 'Pre-Release Split Verification', icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
      { id: 'pilot-dashboard', label: 'Pilot Dashboard', icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" },
    ]},
    { label: "Reports & Documents", items: [
      { id: 'view-audit-report', label: 'View Audit Report', icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
      { id: 'generate-court-report', label: 'Generate Court-Ready Report', icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
      { id: 'generate-custom-report', label: 'Generate Custom Report', icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
    ]},
    { label: "Legal Actions", items: [
      { id: 'create-demand-letter', label: 'Create Demand Letter', icon: "M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
      { id: 'export-affidavit', label: 'Export Affidavit', icon: "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" },
      { id: 'export-hash-seal', label: 'Export with Hash Seal', icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
    ]},
    { label: "Communication", items: [
      { id: 'secure-message', label: 'Secure Client Message', icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", badge: "2" },
    ]},
    { label: "Lead Intelligence", items: [
      { id: 'lead-intelligence', label: 'Lead Intelligence Dashboard', icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", badge: "28" },
    ]},
  ];

  const handleHandshakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/create-handshake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track_name: handshakeTrack,
          isrc: handshakeISRC,
          rights_type: handshakeRightsType,
          revenue_basis: handshakeRevenueBasis,
          jurisdiction: handshakeJurisdiction,
          created_by: 'leron.rogers@foxrothschild.com',
          created_by_name: 'Leron Rogers',
          participants: [{ name: handshakeName || 'Collaborator', email: handshakeEmail, percentage: parseInt(handshakePercentage), role: handshakeRole }]
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Digital Handshake sent to ' + handshakeEmail);
        setHandshakeTrack(''); setHandshakeEmail(''); setHandshakePercentage(''); setHandshakeName('');
      } else { alert('Error: ' + (data.error || 'Unknown error')); }
    } catch (err) { alert('Error connecting to server'); }
  };

  const PERFECT_SPLIT = [
    { name: "James Carter", role: "Composer", percentage: 50, ipi: "00624789341" },
    { name: "Toya Williams", role: "Lyricist", percentage: 30, ipi: "00472915682" },
    { name: "DJ Premier", role: "Producer", percentage: 20, ipi: "00836125497" }
  ];
  const ERROR_SPLIT = [
    { name: "James Carter", role: "Composer", percentage: 60, ipi: "" },
    { name: "", role: "Lyricist", percentage: 25, ipi: "00472915682" },
    { name: "DJ Premier", role: "Producer", percentage: 20, ipi: "invalid" },
    { name: "Extra", role: "Writer", percentage: 10, ipi: "" }
  ];
  const validateSplit = (data: any[]) => {
    const errs: string[] = [];
    let total = 0;
    data.forEach((item: any, i: number) => {
      total += item.percentage || 0;
      if (!item.name || item.name.trim() === '') errs.push("Contributor " + (i+1) + " missing name");
      if (!item.ipi || item.ipi.trim() === '' || item.ipi === 'invalid') errs.push((item.name || 'Contributor') + " missing/invalid IPI");
    });
    if (Math.abs(total - 100) > 0.1) errs.push("Total split is " + total + "%, must equal 100%");
    return errs;
  };
  const loadPerfectSplit = () => { setSplitData(PERFECT_SPLIT); setSplitErrors([]); setSplitStep(1); };
  const loadErrorSplit = () => { const errs = validateSplit(ERROR_SPLIT); setSplitData(ERROR_SPLIT); setSplitErrors(errs); setSplitStep(2); };
  const autoFixSplit = () => {
    const fixed = splitData.map((item: any, i: number) => ({
      ...item,
      name: item.name || ("Contributor " + (i+1)),
      ipi: (!item.ipi || item.ipi === 'invalid') ? ("AUTO-" + Math.floor(Math.random()*90000+10000)) : item.ipi,
    }));
    const total = fixed.reduce((s: number, i: any) => s + i.percentage, 0);
    if (Math.abs(total - 100) > 0.1) { const factor = 100/total; fixed.forEach((i: any) => { i.percentage = Math.round(i.percentage*factor*10)/10; }); }
    setSplitData(fixed); setSplitErrors(validateSplit(fixed)); setSplitStep(1);
  };
  const startSplitVerification = () => {
    const id = Math.random().toString(36).substr(2,16).toUpperCase();
    setSplitVerifyId(id);
    setSplitTimestamp(new Date().toISOString().replace('T',' ').substring(0,16) + ' UTC');
    setSplitStep(2);
  };
  const downloadSplitReport = () => {
    const rows = splitData.map((i: any) => {
      const g = splitPayAmount*i.percentage/100;
      return "<tr><td>"+i.name+"</td><td>"+i.role+"</td><td>"+i.ipi+"</td><td>"+i.percentage+"%</td><td>$"+g.toLocaleString()+"</td><td>-$"+(g*0.25).toLocaleString()+"</td><td>$"+(g*0.75).toLocaleString()+"</td></tr>";
    }).join('');
    const html = "<html><body style='font-family:Arial;padding:30px'><h1 style='color:#312e81'>TrapRoyaltiesPro - Split Verification Report</h1><p><b>ID:</b> TRP-"+splitVerifyId+"</p><p><b>Time:</b> "+splitTimestamp+"</p><p><b>Gross:</b> $"+splitPayAmount.toLocaleString()+"</p><p><b>Net:</b> $"+(splitPayAmount*0.75).toLocaleString()+"</p><table border='1' cellpadding='8' style='width:100%;border-collapse:collapse'><tr style='background:#eef2ff'><th>Name</th><th>Role</th><th>IPI</th><th>%</th><th>Gross</th><th>Tax</th><th>Net</th></tr>"+rows+"</table></body></html>";
    const blob = new Blob([html],{type:'text/html'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download="TRP-Split-Report.html"; a.click();
  };
  const resetSplitWorkflow = () => { setSplitStep(0); setSplitData([]); setSplitErrors([]); setSplitVerifyId(''); setSplitPayAmount(50000); };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">

      {/* ── Verification Command Center Modal ── */}
      {verifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-indigo-500/30 rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border-b border-white/10 px-6 py-4 flex items-start justify-between">
              <div>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1">Identity Anchoring</p>
                <p className="font-black text-white text-base">{verifyModal.name}</p>
                <p className="font-mono text-xs text-slate-400 mt-0.5">IPI: {verifyModal.ipi}</p>
              </div>
              <button onClick={closeVerifyModal} className="text-slate-500 hover:text-white transition text-xl leading-none mt-1">×</button>
            </div>

            {/* Steps */}
            <div className="px-6 py-5 space-y-4">
              {/* Step 1 — Success */}
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-400">Stockholm Node Match Found</p>
                  <p className="text-xs text-slate-500 mt-0.5">IPI cross-referenced against MusicBrainz registry — confirmed</p>
                </div>
              </div>

              {/* Step 2 — Active / pulsing */}
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/60 flex items-center justify-center flex-shrink-0 mt-0.5 relative">
                  <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
                  <span className="w-3 h-3 rounded-full bg-indigo-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-indigo-300">Biometric Link Generated</p>
                  <div className="flex items-center gap-2 mt-1.5 bg-[#1e293b] border border-white/10 rounded-lg px-3 py-2">
                    <span className="font-mono text-xs text-indigo-300 flex-1">https://usesmpt.com/smpt-verify.html</span>
                    <button onClick={copyLink} className="text-slate-400 hover:text-white transition text-xs">
                      {copied ? <span className="text-green-400 font-bold">✓</span> : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3 — Pending / complete after sim */}
              <div className="flex items-start gap-4">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border transition-all ${simComplete ? 'bg-green-500/20 border-green-500/50' : 'bg-slate-800 border-slate-600'}`}>
                  {simRunning ? (
                    <svg className="w-4 h-4 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  ) : simComplete ? (
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <span className="w-3 h-3 rounded-full bg-slate-600" />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-semibold transition-colors ${simComplete ? 'text-green-400' : 'text-slate-400'}`}>Awaiting Artist/Legal Handshake</p>
                  <p className="text-xs text-slate-600 mt-0.5">Link sent to: Leron Rogers, Esq. (Carter Woodard, LLC. Attorney Advertising)</p>
                </div>
              </div>

              {/* Step 4 — Locked / complete after sim */}
              <div className="flex items-start gap-4">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 border transition-all ${simComplete ? 'bg-green-500/20 border-green-500/50' : 'bg-slate-800 border-slate-700'}`}>
                  {simComplete ? (
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-semibold transition-colors ${simComplete ? 'text-green-400' : 'text-slate-600'}`}>Forensic LOD Generation</p>
                  <p className="text-xs text-slate-700 mt-0.5">Identity-anchored Letter of Direction — SHA-256 sealed</p>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="border-t border-white/10 px-6 py-4 space-y-3">
              {!simComplete ? (
                <button onClick={simulateCompletion} disabled={simRunning}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition">
                  {simRunning ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      Syncing Biometric Result...
                    </span>
                  ) : 'Sync Biometric Result'}
                </button>
              ) : (
                <a href={`/forensic-lod.html?name=${encodeURIComponent(verifyModal.name)}&ipi=${encodeURIComponent(verifyModal.ipi)}&alias=${encodeURIComponent(verifyModal.alias || '')}&isrc=${encodeURIComponent(verifyModal.isrc || '')}`} target="_blank"
                  className="block w-full py-3 bg-green-600 hover:bg-green-500 text-white font-black text-sm rounded-xl transition text-center">
                  ↓ Download Forensic LOD
                </a>
              )}
              <button onClick={closeVerifyModal} className="w-full py-2 text-slate-500 hover:text-slate-300 text-sm transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Legal Dispatch Modal ── */}
      {dispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => !dispatchConfirmed && setDispatchModal(null)}>
          <div className="bg-[#0a0f1e] border border-indigo-500/30 rounded-2xl w-full max-w-5xl mx-4 overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.2)]"
            onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-indigo-500/20 bg-indigo-500/5">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Preparing Forensic Packet</p>
                <p className="text-white font-black text-lg">For Leron Rogers, Esq. · Carter Woodard, LLC. Attorney Advertising</p>
              </div>
              {!dispatchConfirmed && (
                <button onClick={() => setDispatchModal(null)} className="ml-auto text-slate-600 hover:text-slate-300 transition text-xl">×</button>
              )}
            </div>

            {!dispatchConfirmed ? (
              <div className="p-6 grid grid-cols-5 gap-5 max-h-[80vh] overflow-y-auto">

                {/* LEFT col (3/5) — Cover Letter + LOD */}
                <div className="col-span-3 space-y-4">

                  {/* Cover Letter */}
                  <div className="bg-[#0f172a] border border-indigo-500/20 rounded-xl p-5 text-xs text-slate-300 space-y-3">
                    <div className="border-b border-white/8 pb-3 space-y-0.5">
                      <p><span className="text-slate-500">To:</span> <span className="font-semibold text-white">SoundExchange Claims / Legal Dept.</span></p>
                      <p><span className="text-slate-500">From:</span> Leron Rogers | Carter Woodard, LLC. Attorney Advertising</p>
                      <p><span className="text-slate-500">Subject:</span> <span className="text-amber-300 font-semibold">PRIORITY: Biometrically Verified LOD | Claim #{dispatchModal.isrc} | Artist: {dispatchModal.alias}</span></p>
                    </div>
                    <p className="text-slate-400 leading-relaxed">To the SoundExchange Claims Team,</p>
                    <p className="text-slate-400 leading-relaxed">
                      Please find the attached Forensic Verification Packet for my client, <span className="text-white font-semibold">{dispatchModal.name} ({dispatchModal.alias})</span>, regarding the unresolved royalties for the associated ISRCs in the Urban Tier 2 bucket.
                    </p>
                    <p className="text-slate-400 leading-relaxed">This claim has been processed via the SMPT Stockholm Node Protocol and includes:</p>
                    <ul className="space-y-2 text-slate-400">
                      <li className="flex gap-2"><span className="text-indigo-400 flex-shrink-0">▸</span><span><span className="text-white font-semibold">Biometric Anchor:</span> A 3D-Liveness verified signature (attached as a cryptographically sealed LOD).</span></li>
                      <li className="flex gap-2"><span className="text-indigo-400 flex-shrink-0">▸</span><span><span className="text-white font-semibold">Forensic Audit Trail:</span> Verified GPS, Timestamp, and Device Integrity data.</span></li>
                      <li className="flex gap-2"><span className="text-indigo-400 flex-shrink-0">▸</span><span><span className="text-white font-semibold">Conflict Resolution:</span> My office has reviewed the metadata matching and confirms this is the authoritative claimant.</span></li>
                    </ul>
                    <p className="text-slate-400 leading-relaxed">
                      <span className="text-amber-300 font-semibold">Action Required:</span> Please update the payment instructions in the <span className="text-white">{dispatchModal.alias}</span> account to reflect the attached Banking Directive and clear the current "Black Box" status for these works.
                    </p>
                    <div className="border-t border-white/8 pt-3">
                      <p className="text-slate-400">Best Regards,</p>
                      <p className="text-white font-bold mt-1">Leron Rogers</p>
                      <p className="text-slate-500 text-[10px]">Managing Partner · Carter Woodard, LLC. Attorney Advertising</p>
                    </div>
                  </div>

                  {/* LOD Preview */}
                  <div className="bg-white text-gray-800 rounded-xl p-5 text-[10px] leading-relaxed font-serif border border-gray-200">
                    {/* LOD header */}
                    <div className="flex items-start justify-between border-b border-gray-300 pb-3 mb-3">
                      <div>
                        <p className="font-black text-[13px] text-gray-900 leading-tight">IRREVOCABLE LETTER OF DIRECTION<br />&amp; IDENTITY ATTESTATION</p>
                        <p className="text-gray-500 text-[9px] mt-1">Protocol Reference: SMPT-SX-PILOT-2026-001</p>
                        <p className="text-gray-500 text-[9px]">Date of Execution: March 18, 2026 · Jurisdiction: United States</p>
                      </div>
                      <div className="bg-green-700 text-white rounded-lg p-2 text-center text-[7px] font-bold uppercase leading-tight flex-shrink-0">
                        <div className="w-8 h-8 flex items-center justify-center mx-auto mb-1">
                          <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/></svg>
                        </div>
                        SMPT<br/>BIOMETRIC<br/>SECURITY<br/>SEAL
                      </div>
                    </div>
                    {/* Section 1 */}
                    <p className="font-black text-[9px] uppercase tracking-wider text-gray-500 mb-2">1. Rights Holder Identification</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3 text-[9px]">
                      <div><span className="text-gray-500">Legal Name:</span> <span className="font-semibold">{dispatchModal.name}</span></div>
                      <div><span className="text-gray-500">IPI Number:</span> <span className="font-mono bg-gray-100 px-1 rounded">{dispatchModal.ipi}</span></div>
                      <div><span className="text-gray-500">Professional Alias:</span> <span className="font-semibold">{dispatchModal.alias}</span></div>
                      <div className="flex items-center gap-1"><span className="text-gray-500">Verification Hash:</span> <span className="font-mono bg-gray-100 px-1 rounded text-[8px]">SHA256: 77e1...92b</span> <span className="bg-green-600 text-white text-[7px] px-1 rounded font-bold">Biometrically Anchored</span></div>
                    </div>
                    {/* Section 2 */}
                    <p className="font-black text-[9px] uppercase tracking-wider text-gray-500 mb-2">2. Asset Metadata</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3 text-[9px]">
                      <div><span className="text-gray-500">ISRC:</span> <span className="font-mono bg-gray-100 px-1 rounded">{dispatchModal.isrc}</span></div>
                      <div><span className="text-gray-500">Claim Share:</span> 25% of Contributor Royalties</div>
                    </div>
                    {/* Section 3 */}
                    <p className="font-black text-[9px] uppercase tracking-wider text-gray-500 mb-2">3. Direct Payment Instruction</p>
                    <div className="border border-gray-300 rounded p-2 mb-3 italic text-gray-700 text-[9px] leading-relaxed">
                      "I, the undersigned Rights Holder, hereby irrevocably authorize and direct SoundExchange, Inc. to adjust the metadata for the above-referenced ISRC to reflect my legal ownership. Furthermore, I direct that all past, present, and future royalties held in suspense or 'Black Box' accounts associated with this ISRC be released for payment to my designated legal representative or account of record, as verified via the SMPT Protocol."
                    </div>
                    {/* Section 4 */}
                    <p className="font-black text-[9px] uppercase tracking-wider text-gray-500 mb-2">4. Forensic Authentication</p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {[
                        { h: 'Biometric Liveness Check', v: 'PASSED — Timestamp: March 18, 2026', c: 'text-green-700 font-bold' },
                        { h: 'ID Document Verification', v: 'VERIFIED · PII SCRUBBED', c: 'text-green-700 font-bold' },
                        { h: 'Legal Signatory', v: 'Leron Rogers (Carter Woodard, LLC. Attorney Advertising)', c: '' },
                        { h: 'SMPT Attestation ID', v: 'SMPT-2026-ATT-00119', c: 'font-mono' },
                      ].map((r, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-200 rounded p-2">
                          <p className="text-[8px] text-gray-500 uppercase tracking-wide">{r.h}</p>
                          <p className={`text-[9px] mt-0.5 ${r.c}`}>{r.v}</p>
                        </div>
                      ))}
                    </div>
                    {/* Node seal */}
                    <div className="bg-green-50 border border-green-300 rounded p-2 flex items-center gap-3">
                      <svg viewBox="0 0 24 24" fill="#15803d" className="w-6 h-6 flex-shrink-0"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/></svg>
                      <div className="text-[8px] flex-1">
                        <p className="font-black text-green-800 text-[9px]">SMPT NODE SECURITY SEAL · DIGITAL ATTESTATION ANCHOR</p>
                        <p className="text-green-700">Node: Stockholm-1 · MusicBrainz IPI Registry</p>
                        <p className="text-green-700">Chain Anchor: 0x71D4a9b3...e3d1e42 · Protocol: SMPT-SX-PILOT-2026-001 · Issued via usesmpt.com</p>
                      </div>
                      <span className="text-[8px] font-black text-green-600 border border-green-400 px-1 rounded">LIVE</span>
                    </div>
                    {/* Signature line */}
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-gray-300 text-[8px] text-gray-500 text-center">
                      <div>Rights Holder Signature &amp; Date</div>
                      <div>Legal Representative Signature &amp; Date</div>
                    </div>
                    {/* QR */}
                    <div className="flex justify-center mt-3">
                      <div className="text-center">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=https://usesmpt.com/smpt-verify.html?ipi=${dispatchModal.ipi}`} alt="QR" width={64} height={64} className="mx-auto" />
                        <p className="text-[7px] text-gray-400 mt-1">SCAN TO VERIFY BIOMETRIC INTEGRITY</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT col (2/5) — Forensic checklist + CTA */}
                <div className="col-span-2 space-y-3 flex flex-col">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Forensic Attachments</p>
                  {[
                    { label: 'Biometric Hash (SHA-256)',  value: '77e1a3f8...92b'                       },
                    { label: 'GPS Tag',                   value: '33.7490° N, 84.3880° W (ATL)'         },
                    { label: 'IPI Validation',            value: dispatchModal.ipi                       },
                    { label: 'Stockholm Node ID',         value: 'STL-NODE-ATL-402'                      },
                    { label: 'ISRC Confirmed',            value: dispatchModal.isrc || 'US-ATL-23-001'   },
                    { label: 'Liveness Score',            value: '99.8% — 3D Depth Map'                  },
                    { label: 'Device Integrity',          value: 'Secure Enclave · Verified'             },
                    { label: 'SMPT Monitoring Node',      value: 'Active · Hash Watchdog ON'             },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 bg-[#0f172a] border border-white/5 rounded-xl p-3">
                      <div className="w-4 h-4 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-2.5 h-2.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-slate-300">{item.label}</p>
                        <p className="text-[9px] font-mono text-slate-500 truncate">{item.value}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex-1" />
                  <button onClick={() => downloadForensicPacket(dispatchModal)}
                    className="w-full py-3 font-bold text-sm text-slate-300 rounded-xl border border-slate-600 hover:border-indigo-500/60 hover:text-white transition flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Forensic Packet (PDF)
                  </button>
                  <button onClick={confirmDispatch}
                    className="w-full py-4 font-black text-sm uppercase tracking-widest text-white rounded-xl transition"
                    style={{ background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
                    Confirm &amp; Secure Dispatch
                  </button>
                </div>
              </div>
            ) : (
              /* Success state */
              <div className="p-10 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center"
                    style={{ boxShadow: '0 0 40px rgba(16,185,129,0.3)' }}>
                    <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 animate-ping" />
                </div>
                <p className="text-xs font-bold text-green-500 uppercase tracking-widest mb-2">Document Tethered to Blockchain</p>
                <p className="text-2xl font-black text-white mb-1">Packet Dispatched</p>
                <p className="text-slate-400 text-sm mb-6">Forensic Verification Packet secured and routed to counsel</p>
                <div className="bg-[#020617] border border-green-500/30 rounded-xl px-8 py-4 mb-6" style={{ boxShadow: '0 0 20px rgba(16,185,129,0.1)' }}>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Tracking Number</p>
                  <p className="text-xl font-black font-mono text-green-400">{dispatchTracking}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full mb-6 text-xs">
                  {[
                    { label: 'Block Height',  value: '#' + (Math.floor(Math.random() * 9000000) + 1000000) },
                    { label: 'Chain',         value: 'Polygon · PoS' },
                    { label: 'Confirmations', value: '12 / 12 ✓' },
                  ].map((s, i) => (
                    <div key={i} className="bg-[#0f172a] border border-white/5 rounded-lg p-3">
                      <p className="text-slate-500 text-[9px] uppercase tracking-wider">{s.label}</p>
                      <p className="text-slate-200 font-mono font-bold mt-0.5">{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => downloadForensicPacket(dispatchModal, dispatchTracking)}
                    className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </button>
                  <button onClick={() => setDispatchModal(null)}
                    className="px-8 py-3 border border-white/10 text-slate-400 rounded-xl hover:border-indigo-500/40 hover:text-indigo-300 transition text-sm">
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Forensic Audit Trail Modal ── */}
      {forensicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setForensicModal(null)}>
          <div className="relative bg-[#020617] border border-green-500/30 rounded-2xl w-full max-w-2xl mx-4 overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.15)]"
            onClick={e => e.stopPropagation()}>
            {/* Seal watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <svg viewBox="0 0 200 200" className="w-72 h-72" fill="white">
                <path d="M100 10 L120 40 L155 30 L145 65 L175 80 L155 105 L165 140 L130 140 L115 172 L100 150 L85 172 L70 140 L35 140 L45 105 L25 80 L55 65 L45 30 L80 40 Z"/>
              </svg>
            </div>
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-green-500/20 bg-green-500/5">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="text-xs font-bold text-green-600 uppercase tracking-widest">SMPT Forensic Verification Report</p>
                <p className="text-white font-black text-lg">{forensicModal.name} <span className="text-slate-500 font-normal text-sm">· {forensicModal.alias}</span></p>
              </div>
              <button onClick={() => setForensicModal(null)} className="ml-auto text-slate-600 hover:text-slate-300 transition text-xl leading-none">×</button>
            </div>
            {/* Body */}
            <div className="p-6 font-mono text-xs space-y-0">
              {[
                { layer: 'Biometric Anchor',   value: `SHA-256: 77e1a3f8b2c9d4e5...92b`,     verified: true, copyable: true },
                { layer: 'Liveness Check',     value: 'PASSED (3D Depth Map + IR Refraction)', verified: true },
                { layer: 'Stockholm Logic ID', value: 'STL-NODE-ATL-402',                      verified: true },
                { layer: 'ISRC / IPI Align',   value: `${forensicModal.isrc || 'US-SM1-19-00632'} → ${forensicModal.ipi}`, verified: true },
                { layer: 'Network Origin',     value: 'IP: 104.28.42.11 · VPN/Proxy: NO',     verified: true },
                { layer: 'Geolocation',        value: '33.7490° N, 84.3880° W (Atlanta, GA)',  verified: true },
                { layer: 'Device Integrity',   value: 'iPhone 15 Pro · Secure Enclave Active', verified: true },
                { layer: 'Timestamp',          value: '2026-03-18 14:22:10 UTC',               verified: true },
              ].map((row, i) => (
                <div key={i} className={`grid grid-cols-2 gap-4 py-3 ${i < 7 ? 'border-b border-white/5' : ''}`}>
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-400">{row.layer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-300 break-all">{row.value}</span>
                    {row.copyable && (
                      <button onClick={() => { navigator.clipboard.writeText('77e1a3f8b2c9d4e592b'); setHashCopied(true); setTimeout(() => setHashCopied(false), 2000); }}
                        className="flex-shrink-0 px-2 py-0.5 rounded text-[9px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition whitespace-nowrap">
                        {hashCopied ? '✓ Copied' : 'Copy Hash'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Footer disclaimer */}
            <div className="mx-6 mb-6 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
              <p className="text-[10px] text-red-400/80 leading-relaxed">
                <span className="font-bold text-red-400">Security Notice:</span> This document is cryptographically tethered to the original biometric session. Any unauthorized modification to the beneficiary name or payout percentage will invalidate the SHA-256 seal and alert the SMPT Monitoring Node.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-indigo-700 to-purple-900 text-white py-2 px-6 text-center text-sm font-medium">
        Attorney Portal - Secure Session - Verified &amp; Documented
      </div>
      <header className="sticky top-0 z-50 bg-[#0a0f1e] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-indigo-300">TrapRoyalties<span className="text-indigo-400">Pro</span></Link>
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm rounded-full font-medium">Attorney Portal</span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm text-slate-400">Leron Rogers (Carter Woodard, LLC. Attorney Advertising)</span>
            <Link href="/" className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-300 rounded-lg text-sm transition">Logout</Link>
          </div>
        </div>
      </header>

      <div className="flex">
        <div className="w-72 bg-[#0a0f1e] border-r border-white/10 min-h-screen p-6">
          <div className="space-y-8">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">{group.label}</p>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <button key={item.id} onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${activeSection === item.id ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                      <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      <span className="text-left text-sm flex-1">{item.label}</span>
                      {(item as any).badge && <span className="ml-auto bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full">{(item as any).badge}</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-8">
          {showBar && (
            <div className="mb-6 flex items-center gap-4 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <span className="text-sm font-medium text-indigo-300 whitespace-nowrap">Active Matter:</span>
              <select value={selectedMatter} onChange={(e) => { setSelectedMatter(Number(e.target.value)); setScanComplete(false); }}
                className="flex-1 px-4 py-2 border border-indigo-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-[#0f172a] text-white placeholder-slate-600">
                {MATTERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${matter.status === 'Urgent' ? 'bg-red-500/20 text-red-300' : matter.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>
                {matter.status}
              </span>
            </div>
          )}

          {activeSection === 'digital-handshake' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Digital Handshake</h1>
              <p className="text-slate-400 mb-6">Create court-admissible royalty split agreements - Georgia Law compliant</p>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#1e293b]/60 border border-white/10 rounded-xl p-8">
                  <h3 className="text-xl font-bold mb-6 text-white">Create New Split Agreement</h3>
                  <form onSubmit={handleHandshakeSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-1">Track / Project Name</label>
                      <input type="text" value={handshakeTrack} onChange={e => setHandshakeTrack(e.target.value)} placeholder="e.g. Neon Dreams (Rough Mix v3)" className="w-full px-4 py-3 bg-[#0f172a] border border-white/20 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-1">ISRC / ISWC (optional)</label>
                      <input type="text" value={handshakeISRC} onChange={e => setHandshakeISRC(e.target.value)} placeholder="e.g. USUM72212345" className="w-full px-4 py-3 bg-[#0f172a] border border-white/20 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-1">Rights Type</label>
                      <select value={handshakeRightsType} onChange={e => setHandshakeRightsType(e.target.value)} className="w-full px-4 py-3 bg-[#0f172a] border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="all-in">All-In (Master + Publishing)</option>
                        <option value="master">Master Only (Sound Recording)</option>
                        <option value="publishing">Publishing Only (Composition)</option>
                        <option value="mechanical">Mechanicals Only</option>
                        <option value="sync">Sync Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-1">Revenue Basis</label>
                      <select value={handshakeRevenueBasis} onChange={e => setHandshakeRevenueBasis(e.target.value)} className="w-full px-4 py-3 bg-[#0f172a] border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="net">Net Receipts</option>
                        <option value="gross">Gross Receipts</option>
                        <option value="nps">Net Publisher Share</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-1">Jurisdiction</label>
                      <select value={handshakeJurisdiction} onChange={e => setHandshakeJurisdiction(e.target.value)} className="w-full px-4 py-3 bg-[#0f172a] border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="georgia">Georgia Law (Atlanta)</option>
                        <option value="california">California Law (LA)</option>
                        <option value="new-york">New York Law</option>
                        <option value="tennessee">Tennessee Law (Nashville)</option>
                      </select>
                    </div>
                    <div className="border-t pt-4">
                      <label className="block text-sm font-semibold text-slate-300 mb-3">Collaborator Details</label>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <input type="text" placeholder="Name" value={handshakeName} onChange={e => setHandshakeName(e.target.value)} className="px-3 py-2 bg-[#0f172a] border border-white/20 rounded-lg text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <input type="email" placeholder="Email" value={handshakeEmail} onChange={e => setHandshakeEmail(e.target.value)} className="px-3 py-2 bg-[#0f172a] border border-white/20 rounded-lg text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                        <input type="number" placeholder="%" value={handshakePercentage} onChange={e => setHandshakePercentage(e.target.value)} className="px-3 py-2 bg-[#0f172a] border border-white/20 rounded-lg text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                      </div>
                      <select value={handshakeRole} onChange={e => setHandshakeRole(e.target.value)} className="w-full px-3 py-2 bg-[#0f172a] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="artist">Artist</option>
                        <option value="producer">Producer</option>
                        <option value="co-writer">Co-Writer</option>
                        <option value="featuring">Featuring Artist</option>
                        <option value="publisher">Publisher</option>
                        <option value="sample-clearance">Sample Clearance</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition">Send Digital Handshake</button>
                  </form>
                </div>
                <div className="bg-[#0f172a] rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold mb-4 text-white">Agreement Preview</h3>
                  <div className="bg-[#1e293b]/60 border border-white/10 rounded-xl border border-indigo-500/30 p-6 space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <span className="font-bold text-white text-lg">{handshakeTrack || 'Track Name'}</span>
                      <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full font-bold">PENDING</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Rights Type</span><span className="font-medium text-white">{handshakeRightsType}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Revenue Basis</span><span className="font-medium text-white">{handshakeRevenueBasis}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Jurisdiction</span><span className="font-medium text-white">{handshakeJurisdiction}</span></div>
                      {handshakeISRC && <div className="flex justify-between"><span className="text-slate-500">ISRC</span><span className="font-mono text-xs text-white">{handshakeISRC}</span></div>}
                    </div>
                    {handshakeName && (
                      <div className="border-t pt-3">
                        <p className="text-xs font-semibold text-slate-500 mb-2">COLLABORATOR</p>
                        <div className="flex justify-between items-center p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                          <div>
                            <span className="text-sm font-medium text-white">{handshakeName}</span>
                            <span className="text-xs text-slate-500 ml-2">({handshakeRole})</span>
                          </div>
                          <span className="text-sm font-bold text-yellow-400">{handshakePercentage || 0}% - PENDING</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs font-bold text-amber-800 mb-1">Georgia Court Requirements:</p>
                    <ul className="text-xs text-amber-700 space-y-1">
                      <li>&#10003; Rights type defined</li>
                      <li>&#10003; Revenue basis specified</li>
                      <li>&#10003; Jurisdiction locked</li>
                      <li>&#10003; Timestamp + IP metadata attached</li>
                      <li>&#10003; Verification seal on execution</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeSection === 'dashboard' && (
            <div className="min-h-screen bg-[#0a0f1e] text-white -m-8 p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="mc-pulse text-purple-400 text-xs">●</span>
                    <span className="text-[10px] font-black mc-mono uppercase tracking-[0.25em] text-slate-500">FOX ROTHSCHILD LLP — SECURE SESSION</span>
                  </div>
                  <h1 className="text-4xl font-black tracking-tight uppercase italic">
                    Attorney <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Mission Control</span>
                  </h1>
                  <p className="text-slate-500 mc-mono text-xs mt-1">Leron Rogers, Esq. — Active Matters: 12 — Firm Recovery Pipeline: $1,482,900</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-600 mc-mono mb-1 uppercase">Total Black Box Value</div>
                  <div className="text-4xl font-black text-green-400 mc-mono">$1.2M</div>
                  <div className="text-[10px] text-slate-500 mc-mono">unclaimed — ready to dispute</div>
                </div>
              </div>

              {/* KPI Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { l:"Active Matters", v:"12", s:"+3 this month", col:"text-white" },
                  { l:"Pending Audits", v:"8",  s:"4 require review", col:"text-yellow-400" },
                  { l:"Active Disputes", v:"3", s:"2 urgent", col:"text-red-400" },
                  { l:"Settlements Pending", v:"$487k", s:"awaiting DSP response", col:"text-purple-400" },
                ].map((s,i) => (
                  <div key={i} className="bg-[#1e293b]/60 border border-white/10 rounded-xl p-5">
                    <p className="text-[10px] mc-mono uppercase text-slate-500 mb-1">{s.l}</p>
                    <p className={`text-3xl font-black mc-mono ${s.col}`}>{s.v}</p>
                    <p className="text-xs text-slate-500 mt-1">{s.s}</p>
                  </div>
                ))}
              </div>

              {/* Active Matters — War Room table */}
              <div className="bg-[#1e293b]/60 border border-white/10 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xs font-black mc-mono uppercase tracking-widest text-slate-400">Active Matters — Select to Enter War Room</h2>
                  <button onClick={() => setActiveSection('new-matter')}
                    className="text-xs px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition">
                    + New Matter
                  </button>
                </div>
                <div className="space-y-3">
                  {MATTERS.map(m => (
                    <div key={m.id}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all group ${
                        m.status === 'Urgent'
                          ? 'border-red-500/40 bg-red-500/10 hover:bg-red-500/20'
                          : m.status === 'In Progress'
                            ? 'border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20'
                            : 'border-green-500/20 bg-green-500/10 hover:bg-green-500/20'
                      }`}
                      onClick={() => { setSelectedMatter(m.id); setActiveSection('war-room'); }}>
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-10 rounded-full flex-shrink-0 ${m.status === 'Urgent' ? 'bg-red-500' : m.status === 'In Progress' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                        <div>
                          <p className="font-bold text-sm">{m.name}</p>
                          <p className="text-xs text-slate-400 mc-mono">{m.issues} issues · leakage {m.leakage}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-lg font-black text-green-400 mc-mono">{m.amount}</p>
                          <p className="text-[10px] text-slate-500">at risk</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-black mc-mono ${
                          m.status === 'Urgent' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          m.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                          'bg-green-500/20 text-green-300 border border-green-500/30'
                        }`}>{m.status}</span>
                        <span className="text-slate-600 group-hover:text-purple-400 transition font-black text-lg">→</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id:'run-due-diligence', icon:"🔬", l:"Forensic Audit", d:"Full catalog scan — ASCAP, BMI, SoundExchange" },
                  { id:'generate-court-report', icon:"📋", l:"Court-Ready Report", d:"Hash-sealed, QR-verified PDF evidence package" },
                  { id:'digital-handshake', icon:"🤝", l:"Digital Handshake", d:"Verified and documented split agreement" },
                ].map(a => (
                  <button key={a.id} onClick={() => setActiveSection(a.id)}
                    className="flex items-center gap-4 p-5 bg-[#1e293b]/60 border border-white/10 rounded-xl hover:border-indigo-500/50 hover:bg-[#1e293b] transition text-left group">
                    <span className="text-3xl">{a.icon}</span>
                    <div>
                      <p className="font-black text-sm">{a.l}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{a.d}</p>
                    </div>
                    <span className="ml-auto text-slate-600 group-hover:text-indigo-400 transition font-black">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'war-room' && (
            <div className="min-h-screen bg-[#0a0f1e] text-white -m-8 p-8">
              {/* Back + header */}
              <button onClick={() => setActiveSection('dashboard')}
                className="flex items-center gap-2 text-slate-500 hover:text-white text-sm mb-6 transition">
                ← Back to Mission Control
              </button>

              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="text-[10px] font-black text-red-400 wr-mono uppercase mb-1 tracking-widest">⚠ WAR ROOM — ACTIVE DISPUTE</div>
                  <h1 className="text-3xl font-black">{matter.name}</h1>
                  <p className="text-slate-400 wr-mono text-sm mt-1">{matter.issues} issues flagged · Leakage: {matter.leakage}</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 wr-mono mb-1">Recovery Target</div>
                  <div className="text-4xl font-black text-green-400 wr-mono">{matter.amount}</div>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-black wr-mono ${
                    matter.status === 'Urgent' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    matter.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                    'bg-green-500/20 text-green-300 border border-green-500/30'
                  }`}>{matter.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Evidence status */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-[#1e293b]/60 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xs font-black wr-mono uppercase tracking-widest text-slate-400 mb-4">Forensic Evidence Stack</h3>
                    <div className="space-y-3">
                      {[
                        { check:"ASCAP Registration", finding:"Missing publisher registration", sev:"critical" },
                        { check:"BMI PRO Status",     finding:"IPI mismatch on co-writer",     sev:"warning" },
                        { check:"SoundExchange",      finding:"No neighboring rights claim",    sev:"critical" },
                        { check:"PRS / SOCAN",        finding:"International registrations current", sev:"ok" },
                        { check:"Split Verification", finding:"Over-allocation detected (108%)", sev:"critical" },
                        { check:"ISRC Verification",  finding:"2 tracks missing ISRC",          sev:"warning" },
                      ].map((item,i) => (
                        <div key={i} className={`flex justify-between items-center p-3 rounded-xl border-l-4 ${
                          item.sev === 'critical' ? 'border-red-500 bg-red-500/10' :
                          item.sev === 'warning'  ? 'border-yellow-500 bg-yellow-500/10' :
                          'border-green-500 bg-green-500/10'
                        }`}>
                          <span className="font-bold text-sm">{item.check}</span>
                          <span className={`text-xs wr-mono font-bold ${
                            item.sev === 'critical' ? 'text-red-400' :
                            item.sev === 'warning'  ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>{item.finding}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scan + actions */}
                  <div className="bg-[#1e293b]/60 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xs font-black wr-mono uppercase tracking-widest text-slate-400 mb-4">Run Full Forensic Scan</h3>
                    {!scanRunning && !scanComplete && (
                      <button onClick={runScan}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition text-base">
                        🔬 Start Forensic Scan — {matter.name}
                      </button>
                    )}
                    {scanRunning && (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent mb-4" />
                        <p className="font-bold text-indigo-300">Running forensic scan...</p>
                        <p className="text-xs text-slate-500 mt-1 wr-mono">Querying ASCAP · BMI · PRS · SOCAN · SoundExchange</p>
                      </div>
                    )}
                    {scanComplete && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
                          <span className="text-green-400 text-xl">✓</span>
                          <p className="font-bold text-green-300 text-sm">Scan complete — evidence locked and timestamped</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 bg-red-500/20 border border-red-500/20 rounded-xl text-center"><p className="text-2xl font-black text-red-400 wr-mono">{matter.amount}</p><p className="text-xs text-slate-500">Unclaimed</p></div>
                          <div className="p-3 bg-yellow-500/20 border border-yellow-500/20 rounded-xl text-center"><p className="text-2xl font-black text-yellow-400 wr-mono">{matter.leakage}</p><p className="text-xs text-slate-500">Leakage</p></div>
                          <div className="p-3 bg-indigo-500/20 border border-indigo-500/20 rounded-xl text-center"><p className="text-2xl font-black text-indigo-400 wr-mono">{matter.issues}</p><p className="text-xs text-slate-500">Issues</p></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: War Room actions */}
                <div className="space-y-4">
                  <div className="bg-[#1e293b]/60 border border-red-500/20 rounded-2xl p-6">
                    <h3 className="text-xs font-black text-red-400 wr-mono uppercase tracking-widest mb-4">War Room Actions</h3>
                    <div className="space-y-3">
                      <button onClick={() => setActiveSection('run-due-diligence')}
                        className="w-full py-3 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold rounded-xl hover:bg-indigo-600/40 transition text-sm">
                        🔬 Full Catalog Due Diligence
                      </button>
                      <button onClick={() => handleDownload('demand', 'Demand Letter')}
                        disabled={downloading === 'demand'}
                        className="w-full py-3 bg-red-600/20 border border-red-500/30 text-red-300 font-bold rounded-xl hover:bg-red-600/40 transition text-sm disabled:opacity-50">
                        {downloading === 'demand' ? 'Generating...' : '📨 Generate Demand Letter'}
                      </button>
                      <button onClick={() => setActiveSection('generate-court-report')}
                        className="w-full py-3 bg-purple-600/20 border border-purple-500/30 text-purple-300 font-bold rounded-xl hover:bg-purple-600/40 transition text-sm">
                        ⚖️ Court-Ready Evidence Bundle
                      </button>
                      <button onClick={() => handleDownload('affidavit', 'Attorney Affidavit')}
                        disabled={downloading === 'affidavit'}
                        className="w-full py-3 bg-white/5 border border-white/10 text-slate-300 font-bold rounded-xl hover:bg-white/10 transition text-sm disabled:opacity-50">
                        {downloading === 'affidavit' ? 'Generating...' : '📄 Export Affidavit'}
                      </button>
                      <button onClick={() => setActiveSection('export-hash-seal')}
                        className="w-full py-3 bg-green-600/10 border border-green-500/20 text-green-300 font-bold rounded-xl hover:bg-green-600/20 transition text-sm">
                        🔐 Hash Seal & Export
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#1e293b]/60 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-xs font-black wr-mono uppercase tracking-widest text-slate-400 mb-3">Evidence Hash</h3>
                    <div className="bg-[#0f172a] border border-white/10 rounded-lg p-3">
                      <p className="text-[10px] text-slate-500 wr-mono break-all">
                        TRP-{matter.id}-{Date.now().toString(36).toUpperCase().slice(-8)}<br/>
                        SHA-256: {Array.from({length:32},()=>Math.floor(Math.random()*16).toString(16)).join('')}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-600 wr-mono mt-2">Verified. Court-admissible.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'run-due-diligence' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Run Catalog Due Diligence</h1>
              <p className="text-slate-400 mb-8">Forensic audit for: <strong>{matter.name}</strong></p>
              <div className="bg-[#1e293b]/60 border border-white/10 rounded-xl p-8">
                <h2 className="text-lg font-semibold mb-4">Audit Scope</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {["Streaming Royalties","Sync Licensing","Performance Rights","360 Deal (All Revenue)"].map((s,i) => (
                    <label key={s} className="flex items-center space-x-3 p-3 border border-white/10 rounded-lg cursor-pointer hover:bg-indigo-500/20">
                      <input type="checkbox" className="h-4 w-4 text-indigo-400 rounded" defaultChecked={i===3}/><span>{s}</span>
                    </label>
                  ))}
                </div>
                <h2 className="text-lg font-semibold mb-4">Upload Catalog (Optional)</h2>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center mb-8 hover:border-indigo-500 transition">
                  <p className="text-slate-400 mb-1">Drop catalog file here or <span className="text-indigo-400 font-medium cursor-pointer">browse</span></p>
                  <p className="text-sm text-slate-500">CSV, Excel, PDF up to 50MB</p>
                </div>
                {!scanRunning && !scanComplete && (
                  <button onClick={runScan} className="w-full py-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition text-lg">
                    Start Forensic Scan for {matter.name}
                  </button>
                )}
                {scanRunning && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-900 border-t-transparent mb-4"></div>
                    <p className="text-lg font-medium text-indigo-300">Running forensic scan...</p>
                    <p className="text-sm text-slate-500 mt-2">Checking ASCAP, BMI, PRS, SOCAN</p>
                  </div>
                )}
                {scanComplete && (
                  <div>
                    <div className="flex items-center gap-3 mb-6 p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                      <span className="text-2xl">&#10003;</span>
                      <p className="font-bold text-green-300">Scan Complete - {matter.name}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/30 text-center"><p className="text-3xl font-bold text-red-600">{matter.amount}</p><p className="text-sm text-slate-400 mt-1">Unclaimed Royalties</p></div>
                      <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30 text-center"><p className="text-3xl font-bold text-yellow-600">{matter.leakage}</p><p className="text-sm text-slate-400 mt-1">Leakage Rate</p></div>
                      <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/30 text-center"><p className="text-3xl font-bold text-orange-600">{matter.issues}</p><p className="text-sm text-slate-400 mt-1">Issues Flagged</p></div>
                    </div>
                    <div className="space-y-3 mb-6">
                      {[{l:"ASCAP Registration",s:"Missing publisher registration",c:"red"},{l:"BMI PRO Status",s:"IPI mismatch on co-writer",c:"yellow"},{l:"SoundExchange",s:"No neighboring rights claim",c:"red"},{l:"PRS/SOCAN",s:"International registrations current",c:"green"},{l:"Split Verification",s:"Over-allocation detected (108%)",c:"red"}].map((item,i) => (
                        <div key={i} className={`flex justify-between p-3 rounded-lg ${item.c==='red'?'bg-red-500/10':item.c==='yellow'?'bg-yellow-500/10':'bg-green-500/10'}`}>
                          <span className="font-medium">{item.l}</span>
                          <span className={`font-bold ${item.c==='red'?'text-red-600':item.c==='yellow'?'text-yellow-600':'text-green-400'}`}>{item.s}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <button onClick={() => setActiveSection('generate-court-report')} className="py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition">Generate Court Report</button>
                      <button onClick={() => setActiveSection('create-demand-letter')} className="py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">Create Demand Letter</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'generate-court-report' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Generate Court-Ready Report</h1>
              <p className="text-slate-400 mb-8">For: <strong>{matter.name}</strong></p>
              <div className="bg-[#1e293b]/60 border border-white/10 rounded-xl p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4">Select Sections</h3>
                    <div className="space-y-3 mb-6">
                      {["Ownership Breakdown","Split Inconsistencies","Registration Status (PROs)","Black Box Leakage","ISRC Verification","Audit Trail"].map((s,i) => (
                        <label key={s} className="flex items-center space-x-3 p-3 border border-white/10 rounded-lg cursor-pointer hover:bg-indigo-500/20">
                          <input type="checkbox" className="h-4 w-4 text-indigo-400" defaultChecked={i<4}/><span>{s}</span>
                        </label>
                      ))}
                    </div>
                    <button onClick={() => handleDownload('court','Court-Ready Audit Report')} disabled={downloading==='court'} className="w-full py-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition disabled:opacity-50">
                      {downloading==='court'?'Generating...':' Download Court-Ready Report'}
                    </button>
                  </div>
                  <div className="bg-[#0f172a] rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Preview</h3>
                    <p className="font-medium text-sm">{matter.name}</p>
                    <p className="text-green-400 text-sm mt-1">Hash Verified</p>
                    <p className="text-sm mt-1">Unclaimed: <strong className="text-green-400">{matter.amount}</strong></p>
                    <p className="text-sm">Leakage: <strong className="text-red-600">{matter.leakage}</strong></p>
                    <div className="flex items-center gap-3 p-3 bg-[#1e293b]/60 rounded-lg border border-white/10 mt-4">
                      <QRCode value={`https://traproyaltiespro.com/verify/TRP-COURT-${selectedMatter}`} size={80}/>
                      <div><p className="text-xs font-bold text-green-400">QR Verification Seal</p><p className="text-xs text-slate-500">Included on all exports</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'create-demand-letter' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Create Legal Demand Letter</h1>
              <p className="text-slate-400 mb-8">For: <strong>{matter.name}</strong></p>
              <div className="bg-[#1e293b]/60 border border-white/10 rounded-xl p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-slate-300 mb-2">Recipient</label><input type="text" className="w-full px-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue="Republic Records"/></div>
                    <div><label className="block text-sm font-medium text-slate-300 mb-2">Amount</label><input type="text" className="w-full px-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue={matter.amount}/></div>
                    <div><label className="block text-sm font-medium text-slate-300 mb-2">Deadline (Days)</label><input type="number" className="w-full px-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue={30}/></div>
                    <button onClick={() => handleDownload('demand','Legal Demand Letter')} disabled={downloading==='demand'} className="w-full py-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50">
                      {downloading==='demand'?'Generating...':' Download Demand Letter'}
                    </button>
                  </div>
                  <div className="bg-[#0f172a] rounded-xl p-6">
                    <h3 className="font-semibold mb-3">Preview</h3>
                    <p className="text-sm font-medium">RE: Unpaid Royalties - {matter.name}</p>
                    <p className="text-sm text-slate-400 mt-2">We demand payment of <strong>{matter.amount}</strong> within 30 days.</p>
                    <p className="text-sm text-slate-400 mt-2">Leron Rogers, Esq. - Carter Woodard, LLC. Attorney Advertising</p>
                    <div className="flex items-center gap-3 p-3 bg-[#1e293b]/60 rounded-lg border border-white/10 mt-4">
                      <QRCode value={`https://traproyaltiespro.com/verify/TRP-DEMAND-${selectedMatter}`} size={80}/>
                      <div><p className="text-xs font-bold text-green-400">QR Verification Seal</p><p className="text-xs text-slate-500">Included on export</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'export-affidavit' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Export Affidavit</h1>
              <p className="text-slate-400 mb-8">For: <strong>{matter.name}</strong></p>
              <div className="bg-[#1e293b]/60 border border-white/10 rounded-xl p-8 max-w-3xl">
                <div className="bg-[#0f172a] rounded-xl p-6 mb-6">
                  <p className="font-medium">AFFIDAVIT OF LERON ROGERS, ESQ.</p>
                  <p className="text-sm text-slate-400 mt-2">1. I am counsel for {matter.name}...</p>
                  <p className="text-sm text-slate-400">2. Unpaid royalties of {matter.amount} verified...</p>
                  <p className="text-sm text-slate-400">3. {matter.issues} material discrepancies identified...</p>
                  <p className="text-sm text-slate-400 mt-4">___________________________<br/>Notary Public</p>
                </div>
                <div className="flex items-center gap-4 p-4 bg-green-500/10 rounded-xl border border-green-500/30 mb-6">
                  <QRCode value={`https://traproyaltiespro.com/verify/TRP-AFF-${selectedMatter}`} size={100}/>
                  <div><p className="font-bold text-green-300">QR Verification Seal</p><p className="text-sm text-slate-400">Printed on exported affidavit</p></div>
                </div>
                <button onClick={() => handleDownload('affidavit','Affidavit of Counsel')} disabled={downloading==='affidavit'} className="w-full py-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition disabled:opacity-50">
                  {downloading==='affidavit'?'Generating...':' Export Affidavit PDF'}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'generate-custom-report' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Generate Custom Report</h1>
              <p className="text-slate-400 mb-8">For: <strong>{matter.name}</strong></p>
              <div className="bg-[#1e293b]/60 border border-white/10 rounded-xl p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <select className="w-full px-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Full Audit Report</option><option>Executive Summary</option><option>Black Box Analysis</option><option>PRO Registration Status</option>
                    </select>
                    <div className="grid grid-cols-2 gap-3">
                      {["Ownership","Splits","PRO Status","ISRC Data","Black Box","Audit Trail"].map((o,i) => (
                        <label key={o} className="flex items-center space-x-2 p-3 border border-white/10 rounded-lg cursor-pointer hover:bg-indigo-500/20">
                          <input type="checkbox" className="h-4 w-4 text-indigo-400" defaultChecked={i<4}/><span className="text-sm">{o}</span>
                        </label>
                      ))}
                    </div>
                    <button onClick={() => handleDownload('custom','Custom Audit Report')} disabled={downloading==='custom'} className="w-full py-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition disabled:opacity-50">
                      {downloading==='custom'?'Generating...':' Download Custom Report'}
                    </button>
                  </div>
                  <div className="bg-[#0f172a] rounded-xl p-6">
                    <p className="font-medium mb-1">Preview</p>
                    <p className="text-sm text-slate-500">{matter.name}</p>
                    <p className="text-green-400 text-sm mt-1">Hash Verified</p>
                    <div className="flex items-center gap-3 p-3 bg-[#1e293b]/60 rounded-lg border border-white/10 mt-4">
                      <QRCode value={`https://traproyaltiespro.com/verify/TRP-CUSTOM-${selectedMatter}`} size={80}/>
                      <div><p className="text-xs font-bold text-green-400">QR Verification Seal</p><p className="text-xs text-slate-500">Included on export</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'export-hash-seal' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Export with Hash Seal</h1>
              <p className="text-slate-400 mb-8">For: <strong>{matter.name}</strong></p>
              <div className="bg-[#1e293b]/60 border border-white/10 rounded-xl p-8 text-center max-w-2xl mx-auto">
                <div className="text-6xl mb-4">&#10003;</div>
                <h2 className="text-2xl font-bold mb-2">Ready to Export</h2>
                <div className="bg-[#0f172a] rounded-xl p-6 mb-6">
                  <p className="font-bold text-indigo-300 mb-3">Hash Seal Verification</p>
                  <div className="flex justify-center mb-3"><QRCode value={`https://traproyaltiespro.com/verify/TRP-SEAL-${selectedMatter}`} size={120}/></div>
                  <p className="text-xs text-slate-500">Scan to verify authenticity</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => handleDownload('court','Hash-Sealed Audit Report')} disabled={downloading==='court'} className="flex-1 py-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition disabled:opacity-50">
                    {downloading==='court'?'Generating...':' Download Sealed PDF'}
                  </button>
                  <button className="flex-1 py-4 border border-white/10 rounded-lg font-medium hover:bg-[#0f172a] transition">Share Secure Link</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'view-audit-report' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Audit Report</h1>
              <p className="text-slate-400 mb-8">{matter.name}</p>
              <div className="bg-[#1e293b]/60 border border-white/10 rounded-xl p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-sm text-slate-500">Generated: {new Date().toLocaleDateString()} | ID: TRP-AUDIT-2026-0{selectedMatter}</p>
                    <p className="text-green-400 font-medium mt-2">Hash Verified</p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <QRCode value={`https://traproyaltiespro.com/verify/TRP-AUDIT-${selectedMatter}`} size={80}/>
                    <button onClick={() => handleDownload('court','Audit Report')} disabled={downloading==='court'} className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition disabled:opacity-50">
                      {downloading==='court'?'...':' Download PDF'}
                    </button>
                  </div>
                </div>
                <table className="w-full">
                  <thead className="bg-[#0f172a]"><tr><th className="p-3 text-left">Party</th><th className="p-3 text-left">Claimed</th><th className="p-3 text-left">Verified</th><th className="p-3 text-left">Status</th></tr></thead>
                  <tbody className="divide-y divide-white/10">
                    <tr><td className="p-3">Artist (Primary)</td><td className="p-3">50%</td><td className="p-3 text-green-400">50%</td><td className="p-3 text-green-400">Verified</td></tr>
                    <tr><td className="p-3">Producer</td><td className="p-3">30%</td><td className="p-3 text-yellow-600">25%</td><td className="p-3 text-yellow-600">Under-claimed</td></tr>
                    <tr><td className="p-3">Co-Writer</td><td className="p-3">20%</td><td className="p-3 text-red-600">15%</td><td className="p-3 text-red-600">Disputed</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'new-matter' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Create New Matter</h1>
              <p className="text-slate-400 mb-8">Add a new client matter for royalty audit or dispute</p>
              <div className="bg-[#1e293b]/60 border border-white/10 rounded-xl p-8 max-w-3xl">
                <form className="space-y-6" onSubmit={e => { e.preventDefault(); setActiveSection('run-due-diligence'); }}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium text-slate-300 mb-2">Client Name</label><input type="text" className="w-full px-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Artist / Estate Name"/></div>
                    <div><label className="block text-sm font-medium text-slate-300 mb-2">Matter Type</label><select className="w-full px-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"><option>Royalty Dispute</option><option>Catalog Due Diligence</option><option>360 Deal Audit</option><option>Pre-Release Verification</option></select></div>
                  </div>
                  <div><label className="block text-sm font-medium text-slate-300 mb-2">Project / Release Name</label><input type="text" className="w-full px-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Album, single, or dispute title"/></div>
                  <div><label className="block text-sm font-medium text-slate-300 mb-2">Key ISRCs / UPCs</label><input type="text" className="w-full px-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="USUM72212345"/></div>
                  <div><label className="block text-sm font-medium text-slate-300 mb-2">Notes</label><textarea rows={4} className="w-full px-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Unpaid streaming royalties..."></textarea></div>
                  <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition">Create Matter and Start Audit</button>
                </form>
              </div>
            </div>
          )}

          {activeSection === 'pre-release-verify' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Pre-Release Split Verification</h1>
              <p className="text-slate-400 mb-6">Upload &rarr; Detect issues &rarr; Verify &rarr; Calculate payment &rarr; Download PDF</p>

              {/* Before/After */}
              <div className="grid grid-cols-2 gap-6 bg-[#1e293b]/60 border border-white/10 rounded-2xl p-5 mb-6 ">
                <div className="border-r border-red-500/20 pr-6">
                  <h3 className="text-red-600 font-bold mb-2">Before TrapRoyaltiesPro</h3>
                  <div className="flex items-center gap-2 flex-wrap text-sm">
                    <span className="bg-[#1e293b] px-3 py-1 rounded-full">Publisher</span>
                    <span className="text-slate-600">&rarr;</span>
                    <span className="bg-red-500/20 text-red-600 px-3 py-1 rounded-full">Issues</span>
                    <span className="text-slate-600">&rarr;</span>
                    <span className="bg-[#1e293b] px-3 py-1 rounded-full">PRO</span>
                    <span className="text-slate-600">&rarr;</span>
                    <span className="bg-[#1e293b] px-3 py-1 rounded-full">Delay</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-indigo-300 font-bold mb-2">With TrapRoyaltiesPro</h3>
                  <div className="flex items-center gap-2 flex-wrap text-sm">
                    <span className="bg-[#1e293b] px-3 py-1 rounded-full">Publisher</span>
                    <span className="text-slate-600">&rarr;</span>
                    <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">TRP Verified</span>
                    <span className="text-slate-600">&rarr;</span>
                    <span className="bg-[#1e293b] px-3 py-1 rounded-full">PRO</span>
                    <span className="text-slate-600">&rarr;</span>
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">Fast Payment</span>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="flex items-center justify-center mb-6 max-w-2xl mx-auto">
                {['Upload Data','Issues Detected','Data Verified','Payment Ready'].map((label, i) => (
                  <div key={i} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={"w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 " + (splitStep > i || splitStep === i ? 'bg-indigo-600 border-indigo-900 text-white' : 'bg-[#1e293b] border-white/20 text-slate-600')}>{i+1}</div>
                      <span className={"text-xs mt-1 " + (splitStep === i ? 'text-indigo-300 font-semibold' : 'text-slate-600')}>{label}</span>
                    </div>
                    {i < 3 && <div className={"w-12 h-1 mb-4 " + (splitStep > i ? 'bg-indigo-600' : 'bg-white/10')}></div>}
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* LEFT: Upload */}
                <div className="bg-[#1e293b]/60 rounded-2xl border border-white/10 p-6 ">
                  <h2 className="text-lg font-bold mb-4 text-white">Step 1: Upload Split Sheet</h2>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-500/20 transition-all mb-4"
                    onClick={() => { const el = document.getElementById('prvPortalFile') as HTMLInputElement; if(el) el.click(); }}>
                    <p className="font-semibold text-slate-300 mb-1">Drop your split sheet here</p>
                    <p className="text-sm text-slate-600">CSV, Excel, or PDF</p>
                    <input type="file" id="prvPortalFile" className="hidden" accept=".csv,.xlsx,.xls,.pdf" onChange={() => loadPerfectSplit()} />
                  </div>
                  <div className="flex justify-center gap-6 text-sm mb-4">
                    <button onClick={loadPerfectSplit} className="text-indigo-400 hover:underline font-medium">Load perfect sample</button>
                    <button onClick={loadErrorSplit} className="text-red-500 hover:underline font-medium">Load sample with errors</button>
                  </div>
                  {splitErrors.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
                      <p className="text-red-400 font-bold mb-2">{splitErrors.length} Issue{splitErrors.length > 1 ? 's' : ''} Detected</p>
                      <div className="text-sm text-red-600 mb-3 space-y-1">{splitErrors.map((e: string, i: number) => <p key={i}>- {e}</p>)}</div>
                      <button onClick={autoFixSplit} className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-500">&#10024; Auto-Fix Issues</button>
                    </div>
                  )}
                  {splitData.length > 0 && (
                    <div className="bg-[#0f172a] rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/10">
                        <span className="font-semibold text-white">Split Table</span>
                        <span className={"text-xs px-2 py-1 rounded-full font-bold " + (splitErrors.length === 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-600')}>{splitErrors.length === 0 ? 'Ready' : splitErrors.length + " issues"}</span>
                      </div>
                      {splitData.map((item: any, i: number) => (
                        <div key={i} className={"flex justify-between items-center py-3 border-b border-white/10 " + (!item.ipi || !item.name ? 'bg-red-500/10 -mx-4 px-4' : '')}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-300 font-bold text-sm">{(item.name||'?')[0]}</div>
                            <div>
                              <p className="font-medium text-sm text-white">{item.name||'Unknown'}</p>
                              <p className="text-xs text-slate-600">{item.role} - IPI: {item.ipi||'Missing'}</p>
                            </div>
                          </div>
                          <span className={"font-bold text-sm " + (!item.ipi||!item.name ? 'text-red-600' : 'text-indigo-300')}>{item.percentage}%</span>
                        </div>
                      ))}
                      <div className="text-right text-sm text-slate-500 mt-2">Total: <span className="font-bold text-white">{splitData.reduce((s: number, i: any) => s+(i.percentage||0), 0).toFixed(1)}%</span></div>
                    </div>
                  )}
                  {splitData.length > 0 && splitErrors.length === 0 && splitStep < 2 && (
                    <button onClick={startSplitVerification} className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-500 transition">Start Verification</button>
                  )}
                </div>

                {/* RIGHT: Verify + Payment */}
                <div className="bg-[#1e293b]/60 rounded-2xl border border-white/10 p-6 ">
                  <h2 className="text-lg font-bold mb-4 text-white">Steps 2-4: Verify &amp; Calculate Payment</h2>
                  {splitStep === 0 && <div className="text-center py-12 text-slate-600"><p>Upload a split sheet to begin</p></div>}
                  {splitStep >= 2 && (
                    <div className="bg-[#0f172a] rounded-xl p-4 mb-4">
                      <h3 className="font-semibold text-white mb-3">Verification Record</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-500">Verification ID</span><span className="font-mono text-xs text-indigo-700">TRP-{splitVerifyId}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Timestamp</span><span className="text-white">{splitTimestamp}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="text-green-400 font-bold">Verified &#10003;</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Jurisdiction</span><span className="text-white">Georgia Law</span></div>
                      </div>
                      <div className="mt-3 p-2 bg-indigo-500/10 rounded-lg font-mono text-xs text-indigo-400 break-all">sha256: {splitVerifyId}...trp_verified</div>
                    </div>
                  )}
                  {splitStep >= 2 && splitStep < 3 && (
                    <button onClick={() => setSplitStep(3)} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-500 transition mb-4">Calculate Payment</button>
                  )}
                  {splitStep >= 3 && (
                    <div className="bg-[#0f172a] rounded-xl p-4 border border-white/10 mb-4">
                      <h3 className="font-semibold text-white mb-3">Enter Payment Amount</h3>
                      <div className="flex gap-3 items-center">
                        <div className="relative flex-1">
                          <span className="absolute left-4 top-3 text-slate-600">$</span>
                          <input type="number" value={splitPayAmount} onChange={(e) => setSplitPayAmount(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 bg-[#0f172a] border border-white/20 rounded-full text-lg font-bold text-white focus:outline-none focus:border-indigo-400" />
                        </div>
                        <button onClick={() => setSplitStep(4)} className="bg-indigo-600 text-white px-5 py-3 rounded-full font-medium hover:bg-indigo-500">Calculate</button>
                      </div>
                      <p className="text-xs text-slate-600 mt-2">25% tax withholding auto-calculated</p>
                    </div>
                  )}
                  {splitStep >= 4 && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-green-300">Payment Summary</span>
                        <span className="text-2xl font-bold text-green-400">${splitPayAmount.toLocaleString()}</span>
                      </div>
                      <div className="bg-[#1e293b]/60 rounded-lg p-3 mb-3 space-y-2 text-sm border border-white/10">
                        <div className="flex justify-between"><span className="text-slate-500">Gross Royalties</span><span className="font-semibold">${splitPayAmount.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Tax (25%)</span><span className="font-semibold text-red-600">-${(splitPayAmount*0.25).toLocaleString()}</span></div>
                        <div className="flex justify-between border-t pt-2"><span className="font-bold text-white">Net Payment</span><span className="font-bold text-green-400">${(splitPayAmount*0.75).toLocaleString()}</span></div>
                      </div>
                      <div className="space-y-2">
                        {splitData.map((item: any, i: number) => {
                          const gross = splitPayAmount*(item.percentage/100);
                          return (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-green-500/20">
                              <span className="text-sm text-white">{item.name} ({item.percentage}%)</span>
                              <div className="text-right">
                                <div className="font-bold text-green-400 text-sm">${gross.toLocaleString()}</div>
                                <div className="text-xs text-red-400">-${(gross*0.25).toLocaleString()} tax</div>
                                <div className="text-xs text-green-400 font-semibold">${(gross*0.75).toLocaleString()} net</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <button onClick={downloadSplitReport} className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-500 transition">&#128196; Download Payment Report</button>
                    </div>
                  )}
                  {splitStep >= 4 && (
                    <button onClick={resetSplitWorkflow} className="w-full py-3 border border-white/10 text-slate-500 rounded-xl font-medium hover:border-indigo-500/40 hover:text-indigo-400 mt-2">&#8635; Start New Verification</button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'pilot-dashboard' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">Pilot Dashboard</h1>
                  <p className="text-slate-400 text-sm">Identity resolution status across active ISRC nodes — SMPT Biometric Protocol v1</p>
                </div>
                <span className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 border border-indigo-500/40 rounded-lg text-indigo-300 text-xs font-bold">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  SMPT SECURED
                </span>
              </div>

              {/* Batch Overview */}
              <BatchOverview />

              {/* Headhunter Pilot — Empty State for SoundExchange */}
              <HeadhunterPilot />

              {/* IdentityGraphEngine — KPI Cards */}
              {/* Recoverable — Hero Card */}
              <div className="bg-gradient-to-br from-[#0d1f12] to-[#0a1a0f] border-2 border-green-500/40 rounded-2xl p-6 mb-4 flex items-center justify-between shadow-[0_0_32px_rgba(34,197,94,0.12)]">
                <div>
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">Recoverable — Pilot Phase 1</p>
                  <p className="text-5xl font-black text-green-400 tracking-tight">$342,500</p>
                  <p className="text-sm text-green-600 mt-2 font-semibold">Black Box Capital Identified</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    <span className="text-green-300 font-black text-lg">$10.5K</span>
                    <span className="text-green-600 text-xs font-semibold">this week</span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-2 uppercase tracking-wider">90-Day ATL Pilot · SMPT Protocol</p>
                </div>
              </div>

              {/* Node Stats — 4 cards */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-[#0f172a] border border-white/10 rounded-xl p-5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Total Nodes</p>
                  <p className="text-3xl font-black text-white">500</p>
                  <p className="text-xs text-slate-500 mt-1.5">Focused ATL Pilot Batch</p>
                </div>
                <div className="bg-[#0a1a0f] border border-green-500/25 rounded-xl p-5">
                  <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-2">Verified</p>
                  <p className="text-3xl font-black text-green-400">330</p>
                  <p className="text-xs text-green-700 mt-1.5">66% Automated Resolution</p>
                </div>
                <div className="bg-[#1a1500] border border-yellow-500/25 rounded-xl p-5">
                  <p className="text-[10px] font-bold text-yellow-700 uppercase tracking-widest mb-2">Pending KYC</p>
                  <p className="text-3xl font-black text-yellow-400">130</p>
                  <p className="text-xs text-yellow-700 mt-1.5">Awaiting Artist Anchor</p>
                </div>
                <div className="bg-[#1a0a0a] border border-red-500/25 rounded-xl p-5">
                  <p className="text-[10px] font-bold text-red-700 uppercase tracking-widest mb-2">High Risk</p>
                  <p className="text-3xl font-black text-red-400">40</p>
                  <p className="text-xs text-red-700 mt-1.5">Flagged for Legal Review</p>
                </div>
              </div>

              {/* Secondary Metrics */}
              <SecondaryMetrics />

              {/* Charts + Pilot Tracker */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <IdentityDonut />
                <RecoveryBarChart />
                <GrowthLineChart />
              </div>

              {/* Pilot Tracker */}
              <div className="mb-6">
                <PilotTracker />
              </div>

              {/* Pilot Table */}
              <div className="bg-[#1e293b]/60 border border-white/10 rounded-2xl overflow-hidden mb-6">
                <div className="px-6 py-3 border-b border-white/10">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pilot Status — 5 Registered Signals</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] text-slate-500 uppercase tracking-widest">
                        <th className="px-4 py-3 text-left">ISRC</th>
                        <th className="px-4 py-3 text-left">Detected Signal (Alias)</th>
                        <th className="px-4 py-3 text-left">Resolved Legal Name</th>
                        <th className="px-4 py-3 text-left">IPI Number</th>
                        <th className="px-4 py-3 text-left">Biometric Status</th>
                        <th className="px-4 py-3 text-left">Action</th>
                        <th className="px-4 py-3 text-left">Settlement Status</th>
                        <th className="px-4 py-3 text-left">Delivery Route</th>
                        <th className="px-4 py-3 text-left">Metadata Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {PILOT_DATA.map((row, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 font-mono text-indigo-300 text-xs">{row.isrc}</td>
                          <td className="px-4 py-3 text-slate-300 italic">{row.alias}</td>
                          <td className={`px-4 py-3 font-semibold ${row.status === 'HIGH RISK' ? 'text-red-400' : row.status === 'PENDING KYC' ? 'text-yellow-400' : 'text-white'}`}>
                            {row.legalName}
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-400 text-xs">{row.ipi}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => openVerifyModal(row.legalName, row.ipi, row.alias, row.isrc)}
                              className={`px-2 py-1 rounded-full text-[10px] font-bold cursor-pointer hover:opacity-80 transition ${
                                row.status === 'VERIFIED' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                row.status === 'PENDING KYC' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                                'bg-red-500/20 text-red-300 border border-red-500/30'
                              }`}>{row.status}</button>
                          </td>
                          <td className="px-4 py-3">
                            {row.status === 'PENDING KYC' ? (
                              <div className="relative group">
                                <button
                                  onClick={() => openVerifyModal(row.legalName, row.ipi, row.alias, row.isrc)}
                                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition whitespace-nowrap">
                                  Initialize Biometric Anchor
                                </button>
                                <div className="absolute bottom-full left-0 mb-1.5 hidden group-hover:block z-10 w-56 px-3 py-2 bg-[#0f172a] border border-indigo-500/30 rounded-lg text-xs text-slate-300 shadow-xl">
                                  Secure handoff to legal representative for identity anchoring.
                                </div>
                              </div>
                            ) : (
                              <button className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                                row.status === 'VERIFIED' ? 'bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50' :
                                'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                              }`}>{row.action}</button>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {row.settlement ? (
                              <span className="text-green-400 font-bold text-xs">Verification Fee Accrued: {row.settlement}</span>
                            ) : (
                              <span className="text-red-400 text-xs">LOD Required</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {row.status === 'VERIFIED' ? (
                              <div className="space-y-1.5">
                                <span className="block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 whitespace-nowrap">Ready for Legal Dispatch</span>
                                <button onClick={() => openDispatch(row)}
                                  className="w-full px-2 py-1 rounded text-[9px] font-black bg-indigo-600 text-white hover:bg-indigo-500 transition whitespace-nowrap uppercase tracking-wide">
                                  Generate &amp; Dispatch to Counsel
                                </button>
                                <button
                                  onClick={() => setForensicModal({ name: row.legalName, ipi: row.ipi, alias: row.alias, isrc: row.isrc })}
                                  className="w-full px-2 py-1 rounded text-[9px] font-semibold bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition whitespace-nowrap">
                                  View Audit Trail
                                </button>
                              </div>
                            ) : row.status === 'PENDING KYC' ? (
                              <span className="text-[10px] text-yellow-600">KYC Required First</span>
                            ) : (
                              <span className="text-[10px] text-red-700">Escalation Pending</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-500 text-xs max-w-[180px]">{row.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
                  <span>Powered by usesmpt.com — SMPT Biometric Protocol v1</span>
                  <div className="flex gap-4">
                    <button className="text-indigo-400 hover:text-indigo-300 transition">↓ Secure Batch Ingestion</button>
                    <button className="text-indigo-400 hover:text-indigo-300 transition">↓ Download Term Sheet PDF</button>
                    <button className="text-indigo-400 hover:text-indigo-300 transition font-bold">Generate Full Forensic Report →</button>
                  </div>
                </div>
                <div className="px-6 py-3 border-t border-white/5">
                  <p className="text-[10px] text-slate-600 leading-relaxed">
                    <span className="text-slate-500 font-semibold">Data Sources:</span> Aggregated Public DSP Metadata, ACRCloud Audio Fingerprinting, PRO Open-Access Registries (ASCAP / BMI / SESAC), and Verified Studio Session Ingress.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'lead-intelligence' && (
            <LeadIntelligenceDashboard />
          )}

          {activeSection === 'secure-message' && (
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Secure Client Message</h1>
              <p className="text-slate-400 mb-8">End-to-end encrypted</p>
              <div className="bg-[#1e293b]/60 border border-white/10 rounded-xl p-6 h-[600px] flex flex-col">
                <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-white/10">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">M</div>
                  <div><p className="font-bold">Metro Boomin</p><p className="text-sm text-slate-500">Online - End-to-End Encrypted</p></div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  <div className="flex justify-end"><div className="bg-indigo-600 text-white p-4 rounded-2xl max-w-lg"><p>Ready to send demand letter?</p></div></div>
                  <div className="flex justify-start"><div className="bg-[#1e293b] p-4 rounded-2xl max-w-lg"><p>Lets move forward. Can we add merch gap?</p></div></div>
                </div>
                <div className="flex gap-4">
                  <input type="text" placeholder="Type your message..." className="flex-1 px-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                  <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition">Send</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
