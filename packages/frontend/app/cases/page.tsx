"use client";

import { useState } from 'react';
import Script from 'next/script';

const CASES = [
  {
    ref: 'TR-LD-001',
    isrc: 'USAT22007048',
    artist: 'Lil Durk',
    recording: 'Back in Blood',
    credit: 'Pooh Shiesty ft. Lil Durk',
    legalName: 'Durk Derrick Banks',
    label: 'Only The Family / Alamo',
    year: '2021',
    streams: '650M+',
    share: '45%',
    conservative: '$98K',
    optimized: '$204K',
    files: [
      { key: 'FILE1', label: 'LOD Part 1', name: 'TR-LD-001_FILE1_LOD-PART1.html' },
      { key: 'FILE2', label: 'Schedule 1', name: 'TR-LD-001_FILE2_SCHEDULE1.html' },
      { key: 'FILE3', label: 'Identity Certificate', name: 'TR-LD-001_FILE3_IDENTITY-CERT.html' },
      { key: 'FILE4', label: 'Chain-of-Custody', name: 'TR-LD-001_FILE4_CHAIN-OF-CUSTODY.html' },
      { key: 'FILE5', label: 'Forensic Audit', name: 'TR-LD-001_FILE5_FORENSIC-AUDIT.html' },
    ],
  },
  {
    ref: 'TR-JC-002',
    isrc: 'USAT21903320',
    artist: 'J. Cole & Travis Scott',
    recording: 'The London',
    credit: 'Young Thug ft. J. Cole & Travis Scott',
    legalName: 'Jermaine Lamarr Cole / Jacques Bermon Webster II',
    label: 'Epic / Dreamville / Cactus Jack',
    year: '2019',
    streams: '600M+',
    share: '45% Split',
    conservative: '$280K',
    optimized: '$580K',
    files: [
      { key: 'FILE1A', label: 'LOD Part 1 — J. Cole', name: 'TR-JC-002_FILE1A_LOD-PART1-JCOLE.html' },
      { key: 'FILE1B', label: 'LOD Part 1 — Travis Scott', name: 'TR-JC-002_FILE1B_LOD-PART1-TRAVISSCOTT.html' },
      { key: 'FILE2', label: 'Schedule 1', name: 'TR-JC-002_FILE2_SCHEDULE1.html' },
      { key: 'FILE3', label: 'Identity Certificate', name: 'TR-JC-002_FILE3_IDENTITY-CERT.html' },
      { key: 'FILE4', label: 'Chain-of-Custody', name: 'TR-JC-002_FILE4_CHAIN-OF-CUSTODY.html' },
      { key: 'FILE5', label: 'Forensic Audit', name: 'TR-JC-002_FILE5_FORENSIC-AUDIT.html' },
    ],
  },
  {
    ref: 'TR-KF-003',
    isrc: 'USRC11900001',
    artist: 'Kirk Franklin',
    recording: 'Love Theory',
    credit: 'Kirk Franklin',
    legalName: 'Kirk Dewayne Franklin',
    label: 'Fo Yo Soul / RCA Inspiration',
    year: '2019',
    streams: '120M+',
    share: '45%',
    conservative: '$180K',
    optimized: '$372K',
    files: [
      { key: 'FILE1', label: 'LOD Part 1', name: 'TR-KF-003_FILE1_LOD-PART1.html' },
      { key: 'FILE2', label: 'Schedule 1', name: 'TR-KF-003_FILE2_SCHEDULE1.html' },
      { key: 'FILE3', label: 'Identity Certificate', name: 'TR-KF-003_FILE3_IDENTITY-CERT.html' },
      { key: 'FILE4', label: 'Chain-of-Custody', name: 'TR-KF-003_FILE4_CHAIN-OF-CUSTODY.html' },
      { key: 'FILE5', label: 'Forensic Audit', name: 'TR-KF-003_FILE5_FORENSIC-AUDIT.html' },
    ],
  },
  {
    ref: 'TR-KW-003',
    isrc: 'USUM71814031',
    artist: 'Kanye West',
    recording: 'I Love It',
    credit: 'Kanye West & Lil Pump ft. Adele Givens',
    legalName: 'Kanye Omari West',
    label: 'GOOD Music / Def Jam',
    year: '2018',
    streams: '800M+',
    share: '45%',
    conservative: '$310K',
    optimized: '$641K',
    files: [
      { key: 'FILE1', label: 'LOD Part 1', name: 'TR-KW-003_FILE1_LOD-PART1.html' },
      { key: 'FILE2', label: 'Schedule 1', name: 'TR-KW-003_FILE2_SCHEDULE1.html' },
      { key: 'FILE3', label: 'Identity Certificate', name: 'TR-KW-003_FILE3_IDENTITY-CERT.html' },
      { key: 'FILE4', label: 'Chain-of-Custody', name: 'TR-KW-003_FILE4_CHAIN-OF-CUSTODY.html' },
      { key: 'FILE5', label: 'Forensic Audit', name: 'TR-KW-003_FILE5_FORENSIC-AUDIT.html' },
    ],
  },
  {
    ref: 'TR-LW-004',
    isrc: 'USAT22003620',
    artist: 'Lil Wayne',
    recording: "What's Poppin (Remix)",
    credit: 'Jack Harlow ft. DaBaby, Tory Lanez & Lil Wayne',
    legalName: 'Dwayne Michael Carter Jr.',
    label: 'Atlantic Records / Generation Now',
    year: '2020',
    streams: '400M+',
    share: '45%',
    conservative: '$185K',
    optimized: '$383K',
    files: [
      { key: 'FILE1', label: 'LOD Part 1', name: 'TR-LW-004_FILE1_LOD-PART1.html' },
      { key: 'FILE2', label: 'Schedule 1', name: 'TR-LW-004_FILE2_SCHEDULE1.html' },
      { key: 'FILE3', label: 'Identity Certificate', name: 'TR-LW-004_FILE3_IDENTITY-CERT.html' },
      { key: 'FILE4', label: 'Chain-of-Custody', name: 'TR-LW-004_FILE4_CHAIN-OF-CUSTODY.html' },
      { key: 'FILE5', label: 'Forensic Audit', name: 'TR-LW-004_FILE5_FORENSIC-AUDIT.html' },
    ],
  },
  {
    ref: 'TR-KF-005',
    isrc: 'USUM71601285',
    artist: 'Kirk Franklin',
    recording: 'Ultralight Beam',
    credit: 'Kanye West ft. Kirk Franklin, The-Dream & Kelly Price',
    legalName: 'Kirk Dewayne Franklin',
    label: 'GOOD Music / Def Jam',
    year: '2016',
    streams: '650M+',
    share: '45%',
    conservative: '$150K',
    optimized: '$310K',
    files: [
      { key: 'FILE1', label: 'LOD Part 1', name: 'TR-KF-005_FILE1_LOD-PART1.html' },
      { key: 'FILE2', label: 'Schedule 1', name: 'TR-KF-005_FILE2_SCHEDULE1.html' },
      { key: 'FILE3', label: 'Identity Certificate', name: 'TR-KF-005_FILE3_IDENTITY-CERT.html' },
      { key: 'FILE4', label: 'Chain-of-Custody', name: 'TR-KF-005_FILE4_CHAIN-OF-CUSTODY.html' },
      { key: 'FILE5', label: 'Forensic Audit', name: 'TR-KF-005_FILE5_FORENSIC-AUDIT.html' },
    ],
  },
  {
    ref: 'TR-7023BE7C0DCC',
    isrc: 'USRC12302416-RMX',
    artist: 'Doja Cat',
    recording: 'Agora Hills (Remix)',
    credit: 'Doja Cat',
    legalName: 'Amala Ratna Zandile Dlamini',
    label: 'RCA Records / Kemosabe',
    year: '2023',
    streams: '45M+',
    share: '45%',
    conservative: '$67.5K',
    optimized: '$139.5K',
    files: [
      { key: 'FILE1', label: 'LOD Part 1', name: 'TR-7023BE7C0DCC_FILE1_LOD-PART1.html' },
      { key: 'FILE2', label: 'Schedule 1', name: 'TR-7023BE7C0DCC_FILE2_SCHEDULE1.html' },
      { key: 'FILE3', label: 'Identity Certificate', name: 'TR-7023BE7C0DCC_FILE3_IDENTITY-CERT.html' },
      { key: 'FILE4', label: 'Chain-of-Custody', name: 'TR-7023BE7C0DCC_FILE4_CHAIN-OF-CUSTODY.html' },
      { key: 'FILE5', label: 'Forensic Audit', name: 'TR-7023BE7C0DCC_FILE5_FORENSIC-AUDIT.html' },
    ],
  },
];

const VALID_KEYS = ['TRP-ATT-2026', 'Lerae'];

async function logEvent(type: string, key: string, detail?: string) {
  try {
    await fetch('/api/cases-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, key, detail }),
    });
  } catch {}
}

function ShieldIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 20h14v-2H5m14-9h-4V3H9v6H5l7 7 7-7z" />
    </svg>
  );
}

export default function CasesPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [jszipReady, setJszipReady] = useState(false);

  function handleUnlock() {
    if (VALID_KEYS.includes(keyInput.trim())) {
      setUnlocked(true);
      setError(false);
      // Set session cookie so server-side PDF route allows downloads
      document.cookie = `trp_cases_session=${keyInput.trim()}; path=/; SameSite=Strict`;
      logEvent('login', keyInput.trim());
    } else {
      setError(true);
    }
  }

  async function downloadCase(c: typeof CASES[0]) {
    if (!(window as any).JSZip) return;
    setDownloading(c.ref);
    try {
      const JSZip = (window as any).JSZip;
      const zip = new JSZip();
      await Promise.all(
        c.files.map(async (f) => {
          const pdfName = f.name.replace('.html', '.pdf');
          const res = await fetch(`/api/cases-file/${pdfName}`);
          if (!res.ok) throw new Error(`Failed to fetch ${pdfName}`);
          const blob = await res.blob();
          zip.file(pdfName, blob);
        })
      );
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${c.ref}_${c.artist.replace(/[^a-zA-Z0-9]/g, '-')}_Package_PDFs.zip`;
      a.click();
      URL.revokeObjectURL(url);
      logEvent('download', keyInput.trim() || 'unknown', `${c.ref} — ${c.artist} — ${c.recording}`);
    } finally {
      setDownloading(null);
    }
  }

  if (!unlocked) {
    return (
      <>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js" onLoad={() => setJszipReady(true)} />
        <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(79,70,229,0.3)', padding: '44px 48px', width: '420px', textAlign: 'center', borderRadius: '12px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
            <div style={{
              background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#fff',
              boxShadow: '0 0 24px rgba(79,70,229,0.4)',
            }}>
              <ShieldIcon size={26} />
            </div>
            <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#6366f1', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>TrapRoyalties Pro</div>
            <div style={{ fontSize: '18px', color: '#e2e8f0', fontWeight: 700, marginBottom: '6px' }}>Attorney Case Review</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '32px' }}>Enter your access key to view cases</div>
            <input
              type="password"
              value={keyInput}
              onChange={e => { setKeyInput(e.target.value); setError(false); }}
              onKeyDown={e => e.key === 'Enter' && handleUnlock()}
              placeholder="Access key"
              style={{
                width: '100%',
                background: '#0a0f1e',
                border: `1px solid ${error ? '#ef4444' : 'rgba(79,70,229,0.3)'}`,
                color: '#e2e8f0',
                padding: '12px 16px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                marginBottom: '10px',
                outline: 'none',
                borderRadius: '6px',
              }}
            />
            {error && <div style={{ color: '#ef4444', fontSize: '11px', marginBottom: '10px' }}>Incorrect key. Contact glenn@traproyaltiespro.com</div>}
            <button
              onClick={handleUnlock}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                border: 'none',
                color: '#fff',
                padding: '12px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                cursor: 'pointer',
                borderRadius: '6px',
                boxShadow: '0 4px 16px rgba(79,70,229,0.35)',
              }}
            >
              Unlock
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js" onLoad={() => setJszipReady(true)} />
      <div style={{ minHeight: '100vh', background: '#0a0f1e', fontFamily: "'Inter', 'Segoe UI', sans-serif", color: '#e2e8f0' }}>

        {/* TOPBAR */}
        <div style={{
          background: '#070b17',
          borderBottom: '1px solid rgba(79,70,229,0.25)',
          padding: '14px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
              borderRadius: '8px',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}>
              <ShieldIcon size={16} />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#e2e8f0', fontWeight: 700, letterSpacing: '0.3px' }}>
                TrapRoyalties<span style={{ color: '#818cf8' }}>Pro</span>
              </div>
              <div style={{ fontSize: '10px', color: '#475569', letterSpacing: '1px' }}>SMPT · Statutory Recovery Division</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right', fontSize: '10px', color: '#475569', lineHeight: 1.8 }}>
              <div>Prepared: <span style={{ color: '#818cf8' }}>April 1, 2026</span></div>
              <div>Protocol: <span style={{ color: '#818cf8' }}>TR-V1.2</span></div>
            </div>
            <div style={{
              background: 'rgba(74,222,128,0.1)',
              border: '1px solid rgba(74,222,128,0.3)',
              borderRadius: '4px',
              padding: '4px 10px',
              fontSize: '9px',
              letterSpacing: '1.5px',
              color: '#4ade80',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>
              Confidential
            </div>
          </div>
        </div>

        {/* HERO */}
        <div style={{ padding: '40px 32px 28px', borderBottom: '1px solid rgba(79,70,229,0.15)' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(79,70,229,0.15)',
            border: '1px solid rgba(79,70,229,0.3)',
            borderRadius: '20px',
            padding: '4px 14px',
            fontSize: '10px',
            color: '#818cf8',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '14px',
            fontWeight: 600,
          }}>
            SoundExchange LOD Submission Package
          </div>
          <div style={{
            fontSize: '26px',
            fontWeight: 800,
            background: 'linear-gradient(135deg,#e2e8f0,#818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '10px',
            letterSpacing: '-0.3px',
          }}>
            Featured Performer Recovery — Master Index
          </div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '28px', lineHeight: 1.7, maxWidth: '680px' }}>
            All cases involve unregistered featured performer royalties accruing in SoundExchange Suspense under 17 U.S.C. §114.
            Each case includes the 5 required LOD submission documents. Click any document to open it, or use{' '}
            <span style={{ color: '#818cf8', fontWeight: 600 }}>Download Package</span> to get a zip for that case.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', maxWidth: '860px' }}>
            {[
              { label: 'Total Cases', val: '7', sub: 'Active recovery claims' },
              { label: 'Total Documents', val: '37', sub: 'Across all packages' },
              { label: 'Conservative Floor', val: '$1.27M', sub: 'At $0.0015 / stream' },
              { label: 'Optimized Ceiling', val: '$2.63M', sub: 'At $0.0031 / stream' },
            ].map(s => (
              <div key={s.label} style={{
                background: '#0f172a',
                border: '1px solid rgba(79,70,229,0.2)',
                padding: '16px 18px',
                borderRadius: '8px',
              }}>
                <div style={{ fontSize: '9px', letterSpacing: '1.5px', color: '#475569', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: '22px', color: '#4ade80', fontWeight: 800 }}>{s.val}</div>
                <div style={{ fontSize: '10px', color: '#334155', marginTop: '4px' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CASES */}
        <div style={{ padding: '20px 32px 56px' }}>
          {CASES.map(c => (
            <div key={c.ref} style={{
              background: '#0f172a',
              border: '1px solid rgba(79,70,229,0.2)',
              marginBottom: '16px',
              borderRadius: '10px',
              overflow: 'hidden',
            }}>
              {/* Case header */}
              <div style={{
                background: 'linear-gradient(135deg,rgba(79,70,229,0.2),rgba(124,58,237,0.12))',
                borderBottom: '1px solid rgba(79,70,229,0.25)',
                padding: '14px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: '9px', letterSpacing: '1.5px', color: '#6366f1', textTransform: 'uppercase', marginBottom: '3px', fontWeight: 600 }}>
                    {c.ref} · ISRC: {c.isrc}
                  </div>
                  <div style={{ fontSize: '15px', color: '#e2e8f0', fontWeight: 700, margin: '2px 0' }}>
                    {c.artist} — {c.recording}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                    {c.credit} · Featured Performer {c.share}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '9px', color: '#475569', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '3px' }}>Recovery Range</div>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: 800,
                      background: 'linear-gradient(135deg,#4ade80,#22d3ee)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      {c.conservative} – {c.optimized}
                    </div>
                  </div>
                  <button
                    onClick={() => downloadCase(c)}
                    disabled={!jszipReady || downloading === c.ref}
                    style={{
                      background: downloading === c.ref ? 'rgba(79,70,229,0.1)' : 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                      border: downloading === c.ref ? '1px solid rgba(79,70,229,0.3)' : 'none',
                      color: '#fff',
                      padding: '8px 16px',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: jszipReady ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      whiteSpace: 'nowrap',
                      borderRadius: '6px',
                      boxShadow: downloading === c.ref ? 'none' : '0 4px 12px rgba(79,70,229,0.3)',
                    }}
                  >
                    <DownloadIcon />
                    {downloading === c.ref ? 'Zipping…' : 'Download Package'}
                  </button>
                </div>
              </div>
              {/* Case body */}
              <div style={{ padding: '14px 20px' }}>
                <div style={{ display: 'flex', gap: '24px', marginBottom: '12px', fontSize: '10px', color: '#475569', flexWrap: 'wrap' }}>
                  <span><strong style={{ color: '#64748b' }}>Legal Name:</strong> {c.legalName}</span>
                  <span><strong style={{ color: '#64748b' }}>Label:</strong> {c.label}</span>
                  <span><strong style={{ color: '#64748b' }}>Release:</strong> {c.year}</span>
                  <span><strong style={{ color: '#64748b' }}>Streams:</strong> {c.streams}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '6px' }}>
                  {c.files.map(f => (
                    <a
                      key={f.key}
                      href={`/cases/${f.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'rgba(15,23,42,0.8)',
                        border: '1px solid rgba(79,70,229,0.15)',
                        padding: '9px 12px',
                        textDecoration: 'none',
                        color: '#cbd5e1',
                        borderRadius: '6px',
                        transition: 'border-color 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(79,70,229,0.15)')}
                    >
                      <div style={{
                        width: '24px',
                        height: '24px',
                        background: 'rgba(79,70,229,0.2)',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#818cf8',
                        flexShrink: 0,
                      }}>
                        <DocIcon />
                      </div>
                      <div>
                        <div style={{ fontSize: '8px', letterSpacing: '1px', color: '#475569', textTransform: 'uppercase', fontWeight: 600 }}>{f.key}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{f.label}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div style={{
          borderTop: '1px solid rgba(79,70,229,0.15)',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: '#334155',
        }}>
          <div>TrapRoyalties Pro · SMPT — Secured Music Protocol Technology · Attorney Review Package</div>
          <div>Prepared April 1, 2026 · Protocol TR-V1.2 · 7 Cases · 37 Documents · CONFIDENTIAL</div>
        </div>
      </div>
    </>
  );
}
