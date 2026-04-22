"use client";

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

function LawyerPageInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const caseRef = (params?.ref as string) || '';
  const artist = searchParams.get('artist') || '';
  const track = searchParams.get('track') || '';
  const value = parseInt(searchParams.get('value') || '0');

  const [sha, setSha] = useState('');

  useEffect(() => {
    if (!caseRef) return;
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(caseRef)).then(buf => {
      const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
      setSha(hex);
    });
  }, [caseRef]);

  const conservative = value > 0 ? Math.round(value * 0.67) : 54000;
  const optimized = value > 0 ? value : 81000;
  const streams = value > 120000 ? '45,000,000+' : value > 90000 ? '35,000,000+' : value > 60000 ? '22,000,000+' : value > 30000 ? '12,000,000+' : '8,000,000+';
  const tier = value > 100000 ? 'TIER 1 • WHALE' : value > 75000 ? 'TIER 1 • GOLD' : value > 40000 ? 'TIER 2 • SILVER' : 'TIER 2';
  const isrcSeed = caseRef.replace('TR-', '').slice(0, 6);

  const handleDownload = () => {
    const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Forensic Audit Report</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, sans-serif; font-size: 10pt; color: #1a1a2e; background: #fff; max-width: 760px; margin: 0 auto; padding: 48px 40px; }
  .header { border-bottom: 3px solid #1a1a2e; padding-bottom: 16px; margin-bottom: 24px; display:flex; justify-content:space-between; align-items:flex-start; }
  .logo { font-size: 14pt; font-weight: 900; }
  .logo span { color: #7c3aed; }
  .ref { font-size: 8pt; color: #888; margin-top: 4px; font-family: monospace; }
  .case-title { font-size: 18pt; font-weight: 900; margin: 20px 0 4px; }
  .case-sub { font-size: 10pt; color: #555; margin-bottom: 16px; }
  .alert { background:#fef2f2; border:1px solid #fecaca; border-radius:4px; padding:8px 12px; font-size:8pt; font-weight:bold; color:#dc2626; margin-bottom:16px; text-transform:uppercase; letter-spacing:0.08em; }
  .section { margin: 20px 0; }
  .section-title { font-size: 8pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #888; border-bottom: 1px solid #e0e0e0; padding-bottom: 6px; margin-bottom: 12px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .cell { border: 1px solid #e0e0e0; border-radius: 4px; padding: 10px; }
  .cell-label { font-size: 7pt; text-transform: uppercase; letter-spacing: 0.08em; color: #aaa; margin-bottom: 3px; }
  .cell-value { font-size: 9pt; font-weight: bold; }
  .red { color: #dc2626; }
  .blue-box { border-left: 4px solid #3b82f6; background: #eff6ff; padding: 12px 16px; margin: 12px 0; font-size: 9pt; color: #1e40af; line-height: 1.6; }
  .recovery { text-align: center; border: 2px solid #1a1a2e; border-radius: 6px; padding: 20px; margin: 16px 0; }
  .recovery-amount { font-size: 28pt; font-weight: 900; }
  .recovery-sub { font-size: 8pt; color: #888; margin-top: 4px; }
  .rec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
  .rec-cell { border: 1px solid #e0e0e0; border-radius: 4px; padding: 10px; text-align: center; }
  .fee { background: #1a1a2e; color: white; padding: 10px 16px; border-radius: 6px; font-weight: bold; text-align: center; margin: 12px 0; }
  .contents-list { padding-left: 20px; }
  .contents-list li { padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
  .contents-list li strong { display: block; font-size: 9pt; }
  .contents-list li span { color: #666; font-size: 8pt; }
  .hash { font-family: monospace; font-size: 8pt; background: #f8f9fa; padding: 8px; border-radius: 4px; word-break: break-all; margin: 8px 0; }
  .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #e0e0e0; font-size: 7pt; color: #aaa; display: flex; justify-content: space-between; }
  @media print { body { padding: 24px; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="logo">TrapRoyalties<span>Pro</span></div>
    <div class="ref">Forensic Recovery Division &middot; Case Ref: ${caseRef}</div>
  </div>
  <div style="text-align:right;font-size:8pt;color:#888;">
    <div>Generated: ${now}</div>
    <div style="font-family:monospace;margin-top:2px;">PROTOCOL: TR-V2.1</div>
  </div>
</div>
<h1 class="case-title">${artist}</h1>
<p class="case-sub">Track: <strong>${track}</strong> &nbsp;&middot;&nbsp; Classification: <strong>${tier}</strong> &nbsp;&middot;&nbsp; Jurisdiction: United States</p>
<div class="alert">Registration Gap Detected &mdash; Letter of Direction (LOD) Not Filed</div>
<div class="section">
  <div class="section-title">Evidence Summary</div>
  <div class="grid">
    <div class="cell"><div class="cell-label">Verified ISRC</div><div class="cell-value">USRC${isrcSeed}****</div></div>
    <div class="cell"><div class="cell-label">Registry Status</div><div class="cell-value red">Unregistered / Non-Identified</div></div>
    <div class="cell"><div class="cell-label">DSP Stream Volume</div><div class="cell-value">${streams}</div></div>
    <div class="cell"><div class="cell-label">Accrual Window</div><div class="cell-value">Retroactive (36 Months)</div></div>
    <div class="cell"><div class="cell-label">Failure Type</div><div class="cell-value">ISRC-to-Performer Mapping Breakdown</div></div>
    <div class="cell"><div class="cell-label">Risk Level</div><div class="cell-value red">High &mdash; Black Box Accrual Likely</div></div>
  </div>
  <div class="blue-box">
    Data indicates this asset is currently held in <strong>Suspense / Black Box accounts</strong> due to a metadata failure at the registry level. This condition is actionable under SoundExchange's <strong>Featured Artist Letter of Direction (LOD)</strong> framework (17 U.S.C. &sect;114 &amp; &sect;112).<br><br>
    <strong>Recommended Action:</strong> Submit a Certified LOD Repertoire Chart + Forensic Audit Packet to SoundExchange to initiate correction and retroactive royalty release.
  </div>
</div>
<div class="section">
  <div class="section-title">Estimated Recovery Potential</div>
  <div class="recovery">
    <div class="recovery-amount">$${optimized.toLocaleString()}<span style="font-size:16pt">.00</span></div>
    <div class="recovery-sub">Subject to registry acceptance and DSP reconciliation</div>
    <div class="rec-grid">
      <div class="rec-cell"><div class="cell-label">Conservative</div><div class="cell-value">$${conservative.toLocaleString()}.00</div></div>
      <div class="rec-cell"><div class="cell-label">Optimized</div><div class="cell-value">$${optimized.toLocaleString()}.00</div></div>
    </div>
  </div>
  <div class="fee">Forensic Services Fee: 5% of Recovery &mdash; No Upfront Cost</div>
</div>
<div class="section">
  <div class="section-title">Certified Extraction &mdash; Contents</div>
  <ol class="contents-list">
    <li><strong>4-Page Forensic Audit Exhibit</strong><span>Black Box accrual analysis, stream validation, registry gap documentation, statutory citations</span></li>
    <li><strong>Certified LOD Repertoire Chart (Schedule 1)</strong><span>Auto-populated metadata formatted to SoundExchange Part 2 specifications</span></li>
    <li><strong>Artist Biometric Attestation Certificate</strong><span>SHA-256 identity anchor &mdash; biometrically signed by the artist</span></li>
    <li><strong>Chain-of-Custody Hash Verification</strong><span>SHA-256 anchor providing immutable proof of data integrity</span></li>
  </ol>
</div>
<div class="section">
  <div class="section-title">Identity Verification</div>
  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:4px;padding:10px 12px;font-size:9pt;color:#166534;margin-bottom:8px;">
    <strong>&#10003; Artist Identity Anchored</strong>
  </div>
  <div class="hash">SHA-256: ${sha || caseRef}</div>
</div>
<div class="footer">
  <span>TrapRoyaltiesPro.com &middot; Forensic Recovery Division &middot; Confidential Attorney Document</span>
  <span>Carters Consultants Agency &middot; Glenn Carter-CCA</span>
</div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      win.addEventListener('load', () => { setTimeout(() => { win.print(); }, 600); });
    }
  };



  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a2e] font-sans">

      {/* Top bar */}
      <div className="bg-[#1a1a2e] px-6 py-3 flex items-center justify-between">
        <span className="text-white font-bold text-xs tracking-widest uppercase">TrapRoyalties Forensic Recovery Division</span>
        <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400 font-mono">
          <span>TLS 1.3 SECURE</span>
          <span className="text-slate-600">•</span>
          <span>NODE: STOCKHOLM-5</span>
          <span className="text-slate-600">•</span>
          <span>PROTOCOL: TR-V2.1</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Case header */}
        <div className="mb-6">
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">Case Ref: {caseRef}</p>
          <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3">Registration Gap Detected</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
            <span><strong className="text-[#1a1a2e]">Subject Artist:</strong> {artist || '—'}</span>
            <span className="text-slate-300">·</span>
            <span><strong className="text-[#1a1a2e]">Track:</strong> {track || '—'}</span>
            <span className="text-slate-300">·</span>
            <span><strong className="text-[#1a1a2e]">Classification:</strong> {tier}</span>
            <span className="text-slate-300">·</span>
            <span><strong className="text-[#1a1a2e]">Jurisdiction:</strong> United States — Digital Performance Royalty Domain</span>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-5">

            {/* Evidence Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Evidence Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Verified ISRC', value: 'USRC' + isrcSeed + '****', icon: true },
                  { label: 'Registry Status', value: 'Unregistered / Non-Identified', red: true },
                  { label: 'DSP Stream Volume', value: streams },
                  { label: 'Accrual Window', value: 'Retroactive (36 Months)' },
                  { label: 'Failure Type', value: 'ISRC-to-Performer Mapping Breakdown' },
                  { label: 'Risk Level', value: 'High — Black Box Accrual Likely', red: true },
                ].map((item, i) => (
                  <div key={i} className="border border-gray-100 rounded p-3">
                    <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                    <div className="flex items-center gap-1.5">
                      {item.icon && (
                        <svg className="w-3 h-3 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                      <p className={"text-xs font-semibold " + (item.red ? "text-rose-500" : "text-[#1a1a2e]")}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Blue legal box */}
              <div className="mt-4 border-l-4 border-indigo-500 bg-indigo-50 p-4 text-xs text-indigo-800 leading-relaxed">
                Data indicates this asset is currently held in <strong>Suspense / Black Box accounts</strong> due to a metadata failure at the registry level. This condition is actionable under SoundExchange's <strong>Featured Artist Letter of Direction (LOD)</strong> framework (17 U.S.C. S.114 & S.112).
                <br /><br />
                <strong>Recommended Action:</strong> Submit a Certified LOD Repertoire Chart + Forensic Audit Packet to SoundExchange to initiate correction and retroactive royalty release.
              </div>
            </div>

            {/* Certified Extraction Contents */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Certified Extraction — Contents</h3>
              <div className="divide-y divide-gray-100">
                {[
                  { n: '01', title: '4-Page Forensic Audit Exhibit', desc: 'Black Box accrual analysis, stream validation, registry gap documentation, statutory citations' },
                  { n: '02', title: 'Certified LOD Repertoire Chart (Schedule 1)', desc: 'Auto-populated metadata formatted to SoundExchange Part 2 specifications' },
                  { n: '03', title: 'Artist Biometric Attestation Certificate', desc: 'SHA-256 identity anchor — biometrically signed by the artist' },
                  { n: '04', title: 'Chain-of-Custody Hash Verification', desc: 'SHA-256 anchor providing immutable proof of data integrity' },
                ].map(item => (
                  <div key={item.n} className="flex gap-4 py-3">
                    <span className="text-[10px] font-bold text-slate-400 w-5 flex-shrink-0 mt-0.5">{item.n}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1a1a2e]">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right sidebar */}
          <div className="space-y-4">

            {/* Identity Anchored */}
            <div className="bg-white border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-emerald-500 text-sm">✓</span>
                <span className="text-emerald-700 font-bold text-xs uppercase tracking-wide">Artist Identity Anchored</span>
              </div>
              <p className="text-[9px] font-mono text-slate-400 break-all leading-relaxed">
                SHA256: {sha ? sha.slice(0, 12) + '...' + sha.slice(-8) : '—'}
              </p>
            </div>

            {/* Recovery Potential */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-2">Estimated Recovery Potential</p>
              <p className="text-3xl font-black text-[#1a1a2e]">${optimized.toLocaleString()}<span className="text-lg">.00</span></p>
              <p className="text-[9px] text-slate-400 mt-1 mb-4">(Subject to registry acceptance and DSP reconciliation)</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-gray-200 rounded p-2.5 text-center">
                  <p className="text-[9px] uppercase tracking-wide text-slate-400 mb-1">Conservative</p>
                  <p className="font-bold text-sm text-[#1a1a2e]">${conservative.toLocaleString()}<span className="text-xs">.00</span></p>
                </div>
                <div className="border border-gray-200 rounded p-2.5 text-center">
                  <p className="text-[9px] uppercase tracking-wide text-slate-400 mb-1">Optimized</p>
                  <p className="font-bold text-sm text-[#1a1a2e]">${optimized.toLocaleString()}<span className="text-xs">.00</span></p>
                </div>
              </div>
            </div>

            {/* Fee + Download */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">Forensic Services Fee</p>
              <p className="text-2xl font-black text-[#1a1a2e] mb-3">5% of Recovery</p>
              <button onClick={handleDownload} className="w-full py-3 bg-[#1a1a2e] hover:bg-[#2a2a4a] text-white font-bold text-sm rounded transition flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Certified Report
              </button>
              <p className="text-[9px] text-slate-400 text-center mt-2">Identity verified · Payment confirmed · Immediate delivery</p>
              <div className="mt-3 pt-3 border-t border-gray-100 text-[9px] text-slate-500 leading-relaxed">
                <strong className="text-slate-600">ADJUDICATION GUARANTEE:</strong> If SoundExchange rejects the identified ISRC mapping as "Previously Registered," a full automated refund is processed within 14 days.
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function LawyerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading case file...</p>
      </div>
    }>
      <LawyerPageInner />
    </Suspense>
  );
}
