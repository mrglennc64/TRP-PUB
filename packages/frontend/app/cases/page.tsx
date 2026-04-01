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

const ACCESS_KEY = 'TRP-ATT-2026';

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
    if (keyInput.trim() === ACCESS_KEY) {
      setUnlocked(true);
      setError(false);
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
          const res = await fetch(`/cases/${f.name}`);
          const text = await res.text();
          zip.file(f.name, text);
        })
      );
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${c.ref}_${c.artist.replace(/[^a-zA-Z0-9]/g, '-')}_Package.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(null);
    }
  }

  if (!unlocked) {
    return (
      <>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js" onLoad={() => setJszipReady(true)} />
        <div style={{ minHeight: '100vh', background: '#0f1a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Courier New', monospace" }}>
          <div style={{ background: '#0a1a0a', border: '1px solid #1a3a1a', padding: '44px 48px', width: '400px', textAlign: 'center' }}>
            <div style={{ background: '#1a3a1a', borderRadius: '50%', width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: '#7fff7f' }}>
              <ShieldIcon size={24} />
            </div>
            <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#4a7a4a', textTransform: 'uppercase', marginBottom: '6px' }}>TrapRoyalties Pro</div>
            <div style={{ fontSize: '16px', color: '#f0f0f0', fontWeight: 'bold', marginBottom: '4px' }}>Attorney Case Review</div>
            <div style={{ fontSize: '10px', color: '#4a7a4a', marginBottom: '28px' }}>Enter your access key to view cases</div>
            <input
              type="password"
              value={keyInput}
              onChange={e => { setKeyInput(e.target.value); setError(false); }}
              onKeyDown={e => e.key === 'Enter' && handleUnlock()}
              placeholder="Access key"
              style={{ width: '100%', background: '#111f11', border: `1px solid ${error ? '#dc2626' : '#1a3a1a'}`, color: '#d4d4d4', padding: '10px 14px', fontFamily: "'Courier New', monospace", fontSize: '11px', marginBottom: '8px', outline: 'none' }}
            />
            {error && <div style={{ color: '#dc2626', fontSize: '10px', marginBottom: '8px' }}>Incorrect key. Contact glenn@traproyaltiespro.com</div>}
            <button
              onClick={handleUnlock}
              style={{ width: '100%', background: '#1a3a1a', border: '1px solid #7fff7f', color: '#7fff7f', padding: '10px', fontFamily: "'Courier New', monospace", fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}
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
      <div style={{ minHeight: '100vh', background: '#0f1a0f', fontFamily: "'Courier New', monospace", color: '#d4d4d4' }}>

        {/* TOPBAR */}
        <div style={{ background: '#0a120a', borderBottom: '1px solid #1a3a1a', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ color: '#7fff7f' }}><ShieldIcon size={16} /></div>
            <div>
              <div style={{ fontSize: '12px', letterSpacing: '3px', color: '#7fff7f', textTransform: 'uppercase', fontWeight: 'bold' }}>TrapRoyalties</div>
              <div style={{ fontSize: '9px', letterSpacing: '2px', color: '#4a7a4a' }}>SMPT · Statutory Recovery Division</div>
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '9px', color: '#4a7a4a', lineHeight: 1.8 }}>
            <div>Prepared: <span style={{ color: '#7fff7f' }}>April 1, 2026</span></div>
            <div>Classification: <span style={{ color: '#7fff7f' }}>ATTORNEY REVIEW — CONFIDENTIAL</span></div>
          </div>
        </div>

        {/* HERO */}
        <div style={{ padding: '36px 32px 24px', borderBottom: '1px solid #1a3a1a' }}>
          <div style={{ fontSize: '9px', letterSpacing: '3px', color: '#4a7a4a', textTransform: 'uppercase', marginBottom: '8px' }}>SoundExchange LOD Submission Package</div>
          <div style={{ fontSize: '22px', color: '#f0f0f0', fontWeight: 'bold', letterSpacing: '0.5px', marginBottom: '6px' }}>Featured Performer Recovery — Master Index</div>
          <div style={{ fontSize: '11px', color: '#6a9a6a', marginBottom: '24px', lineHeight: 1.7 }}>
            All cases involve unregistered featured performer royalties accruing in SoundExchange Suspense under 17 U.S.C. §114.<br />
            Each case includes the 5 required LOD submission documents. Click any document to open it, or use <strong style={{ color: '#7fff7f' }}>Download Package</strong> to get a zip for that case.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', maxWidth: '820px' }}>
            {[
              { label: 'Total Cases', val: '7', sub: 'Active recovery claims' },
              { label: 'Total Documents', val: '37', sub: 'Across all packages' },
              { label: 'Conservative Floor', val: '$1.27M', sub: 'At $0.0015 / stream' },
              { label: 'Optimized Ceiling', val: '$2.63M', sub: 'At $0.0031 / stream' },
            ].map(s => (
              <div key={s.label} style={{ background: '#0a1a0a', border: '1px solid #1a3a1a', padding: '14px 16px' }}>
                <div style={{ fontSize: '8px', letterSpacing: '2px', color: '#4a7a4a', textTransform: 'uppercase', marginBottom: '5px' }}>{s.label}</div>
                <div style={{ fontSize: '20px', color: '#7fff7f', fontWeight: 'bold' }}>{s.val}</div>
                <div style={{ fontSize: '8px', color: '#4a7a4a', marginTop: '3px' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CASES */}
        <div style={{ padding: '16px 32px 48px' }}>
          {CASES.map(c => (
            <div key={c.ref} style={{ background: '#0a1a0a', border: '1px solid #1a3a1a', marginBottom: '14px' }}>
              {/* Case header */}
              <div style={{ background: '#1a3a1a', padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '9px', letterSpacing: '2px', color: '#4aaa4a' }}>{c.ref} · ISRC: {c.isrc}</div>
                  <div style={{ fontSize: '13px', color: '#f0f0f0', fontWeight: 'bold', margin: '2px 0' }}>{c.artist} — {c.recording}</div>
                  <div style={{ fontSize: '10px', color: '#6aaa6a', fontStyle: 'italic' }}>{c.credit} · Featured Performer {c.share}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '8px', color: '#4a7a4a', letterSpacing: '1px' }}>Recovery Range</div>
                    <div style={{ fontSize: '13px', color: '#7fff7f', fontWeight: 'bold' }}>{c.conservative} – {c.optimized}</div>
                  </div>
                  <button
                    onClick={() => downloadCase(c)}
                    disabled={!jszipReady || downloading === c.ref}
                    style={{
                      background: downloading === c.ref ? '#0a1a0a' : 'transparent',
                      border: '1px solid #7fff7f',
                      color: '#7fff7f',
                      padding: '7px 14px',
                      fontFamily: "'Courier New', monospace",
                      fontSize: '9px',
                      letterSpacing: '1px',
                      cursor: jszipReady ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <DownloadIcon />
                    {downloading === c.ref ? 'Zipping…' : 'Download Package'}
                  </button>
                </div>
              </div>
              {/* Case body */}
              <div style={{ padding: '12px 18px' }}>
                <div style={{ display: 'flex', gap: '18px', marginBottom: '10px', fontSize: '9px', color: '#4a7a4a' }}>
                  <span><strong style={{ color: '#6aaa6a' }}>Legal Name:</strong> {c.legalName}</span>
                  <span><strong style={{ color: '#6aaa6a' }}>Label:</strong> {c.label}</span>
                  <span><strong style={{ color: '#6aaa6a' }}>Release:</strong> {c.year}</span>
                  <span><strong style={{ color: '#6aaa6a' }}>Streams:</strong> {c.streams}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '6px' }}>
                  {c.files.map(f => (
                    <a
                      key={f.key}
                      href={`/cases/${f.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#111f11', border: '1px solid #1a3a1a', padding: '8px 12px', textDecoration: 'none', color: '#d4d4d4', transition: 'border-color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#7fff7f')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a3a1a')}
                    >
                      <div style={{ width: '22px', height: '22px', background: '#1a3a1a', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7fff7f', flexShrink: 0 }}>
                        <DocIcon />
                      </div>
                      <div>
                        <div style={{ fontSize: '8px', letterSpacing: '1px', color: '#4a7a4a', textTransform: 'uppercase' }}>{f.key}</div>
                        <div style={{ fontSize: '10px', color: '#c0c0c0' }}>{f.label}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div style={{ borderTop: '1px solid #1a3a1a', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#2a4a2a' }}>
          <div>TrapRoyalties · SMPT — Secured Music Protocol Technology · Attorney Review Package</div>
          <div>Prepared April 1, 2026 · Protocol TR-V1.2 · 7 Cases · 37 Documents · CONFIDENTIAL</div>
        </div>
      </div>
    </>
  );
}
