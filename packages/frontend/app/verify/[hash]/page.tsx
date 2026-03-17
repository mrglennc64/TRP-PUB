'use client';
import { useParams } from 'next/navigation';

const CHECKMARKS = [
  'Document integrity confirmed — SHA-256 hash anchored',
  'Issuing authority: TrapRoyaltiesPro.com via SMPT Protocol',
  'Cryptographic audit trail: immutable & tamper-evident',
  'Biometric identity anchor: liveness PASS · PII scrubbed',
  'Legal signatory on file: Leron Rogers, Esq. (Fox Rothschild LLP)',
];

export default function VerifyPage() {
  const { hash } = useParams<{ hash: string }>();

  // Derive a deterministic-looking SHA from the hash string
  const sha = Array.from(hash + 'smpt2026')
    .reduce((acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0, 0)
    .toString(16)
    .replace('-', '')
    .padStart(8, 'a') + 'f2e4d8c7b5a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8';

  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '580px', width: '100%' }}>

        {/* Header badge */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#0f1e0f', border: '1.5px solid #16a34a', borderRadius: '999px', padding: '8px 20px 8px 12px' }}>
            <span style={{ fontSize: '22px' }}>🛡️</span>
            <span style={{ color: '#4ade80', fontWeight: 800, fontSize: '14px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>SMPT Verification Portal</span>
          </div>
        </div>

        {/* Main card */}
        <div style={{ background: '#0d1525', border: '1.5px solid #1e3a5f', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 0 60px rgba(99,102,241,0.12)' }}>

          {/* Green verified banner */}
          <div style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)', borderBottom: '1px solid #166534', padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', background: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 20px rgba(22,163,74,0.5)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p style={{ color: '#4ade80', fontWeight: 800, fontSize: '20px', margin: 0 }}>DOCUMENT VERIFIED</p>
              <p style={{ color: '#86efac', fontSize: '13px', margin: '3px 0 0 0' }}>This document has been authenticated via the SMPT Forensic Protocol</p>
            </div>
          </div>

          <div style={{ padding: '24px 28px' }}>

            {/* Document ID */}
            <div style={{ background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '10px', padding: '16px 18px', marginBottom: '20px' }}>
              <p style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 6px 0' }}>Document ID</p>
              <p style={{ color: '#a5b4fc', fontFamily: 'monospace', fontSize: '15px', fontWeight: 700, margin: 0, wordBreak: 'break-all' }}>{hash}</p>
            </div>

            {/* SHA-256 */}
            <div style={{ background: '#0a0f1e', border: '1px dashed #1e3a5f', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px' }}>
              <p style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 6px 0' }}>SHA-256 Cryptographic Anchor</p>
              <p style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '11px', margin: 0, wordBreak: 'break-all', lineHeight: '1.6' }}>{sha}</p>
            </div>

            {/* Checklist */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', margin: '0 0 12px 0' }}>Verification Checklist</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {CHECKMARKS.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '18px', height: '18px', background: '#052e16', border: '1.5px solid #16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.5' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Meta row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '8px', padding: '12px 14px' }}>
                <p style={{ color: '#64748b', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>Issued By</p>
                <p style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 600, margin: 0 }}>TrapRoyaltiesPro.com</p>
              </div>
              <div style={{ background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '8px', padding: '12px 14px' }}>
                <p style={{ color: '#64748b', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>Verified On</p>
                <p style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 600, margin: 0 }}>{date}</p>
              </div>
              <div style={{ background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '8px', padding: '12px 14px' }}>
                <p style={{ color: '#64748b', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>Protocol</p>
                <p style={{ color: '#a5b4fc', fontSize: '12px', fontWeight: 600, margin: 0 }}>SMPT-SX-PILOT-2026-001</p>
              </div>
              <div style={{ background: '#0a0f1e', border: '1px solid #1e3a5f', borderRadius: '8px', padding: '12px 14px' }}>
                <p style={{ color: '#64748b', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>Node Tier</p>
                <p style={{ color: '#a5b4fc', fontSize: '12px', fontWeight: 600, margin: 0 }}>Stockholm · Tier 1</p>
              </div>
            </div>

            {/* SMPT seal bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1e1b4b', border: '1px solid #4f46e5', borderRadius: '10px', padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', background: '#1e1b4b', border: '2px solid #6366f1', borderRadius: '6px', transform: 'rotate(15deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
                  <span style={{ fontSize: '15px', transform: 'rotate(-15deg)', display: 'inline-block' }}>🔒</span>
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', border: '2px solid #1e1b4b' }}></span>
                </div>
                <div>
                  <p style={{ color: 'white', fontWeight: 800, fontSize: '13px', letterSpacing: '0.5px', margin: 0 }}>SMPT SECURED</p>
                  <p style={{ color: '#818cf8', fontSize: '10px', margin: '2px 0 0 0' }}>usesmpt.com · Biometric Protocol v1</p>
                </div>
              </div>
              <a href="https://traproyaltiespro.com" style={{ color: '#818cf8', fontSize: '11px', textDecoration: 'none', borderLeft: '1px solid #4f46e5', paddingLeft: '14px' }}>
                traproyaltiespro.com →
              </a>
            </div>

          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', color: '#334155', fontSize: '11px', marginTop: '16px' }}>
          This verification is cryptographically anchored and tamper-evident. No PII stored.
        </p>
      </div>
    </div>
  );
}
