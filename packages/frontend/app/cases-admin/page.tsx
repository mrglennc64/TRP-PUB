"use client";

import { useEffect, useState } from 'react';

const ADMIN_KEY = 'TRP-ADMIN-2026';

interface Event {
  type: string;
  key: string;
  detail?: string;
  ip: string;
  ua: string;
  ts: string;
}

export default function CasesAdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState('');
  const [err, setErr] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  function unlock() {
    if (input.trim() === ADMIN_KEY) { setUnlocked(true); setErr(false); }
    else setErr(true);
  }

  useEffect(() => {
    if (!unlocked) return;
    setLoading(true);
    fetch('/api/cases-events')
      .then(r => r.json())
      .then(d => { setEvents(d.events || []); setLoading(false); });
  }, [unlocked]);

  function refresh() {
    setLoading(true);
    fetch('/api/cases-events')
      .then(r => r.json())
      .then(d => { setEvents(d.events || []); setLoading(false); });
  }

  if (!unlocked) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#0f172a', border: '1px solid rgba(79,70,229,0.3)', borderRadius: '12px', padding: '40px', width: '380px', textAlign: 'center' }}>
        <div style={{ fontSize: '22px', color: '#e2e8f0', fontWeight: 700, marginBottom: '6px' }}>Cases Admin</div>
        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '24px' }}>Login &amp; Download Activity Log</div>
        <input type="password" value={input} onChange={e => { setInput(e.target.value); setErr(false); }}
          onKeyDown={e => e.key === 'Enter' && unlock()} placeholder="Admin key"
          style={{ width: '100%', background: '#0a0f1e', border: `1px solid ${err ? '#ef4444' : 'rgba(79,70,229,0.25)'}`, color: '#e2e8f0', padding: '11px 14px', fontSize: '13px', borderRadius: '6px', outline: 'none', marginBottom: '10px' }} />
        {err && <div style={{ color: '#ef4444', fontSize: '11px', marginBottom: '8px' }}>Incorrect key.</div>}
        <button onClick={unlock} style={{ width: '100%', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none', color: '#fff', padding: '11px', fontSize: '13px', fontWeight: 600, borderRadius: '6px', cursor: 'pointer' }}>Enter</button>
      </div>
    </div>
  );

  const logins = events.filter(e => e.type === 'login');
  const downloads = events.filter(e => e.type === 'download');
  const leraeEvents = events.filter(e => e.key === 'Lerae');

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', fontFamily: 'sans-serif', color: '#e2e8f0', padding: '32px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 700 }}>Cases Activity Log</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>traproyaltiespro.com/cases</div>
          </div>
          <button onClick={refresh} style={{ background: 'rgba(79,70,229,0.15)', border: '1px solid rgba(79,70,229,0.3)', color: '#818cf8', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '28px' }}>
          {[
            { label: 'Total Logins', val: logins.length, color: '#818cf8' },
            { label: 'Total Downloads', val: downloads.length, color: '#4ade80' },
            { label: 'Lerae Activity', val: leraeEvents.length, color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} style={{ background: '#0f172a', border: '1px solid rgba(79,70,229,0.15)', borderRadius: '8px', padding: '16px 20px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '1px', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>{s.label}</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Event Table */}
        <div style={{ background: '#0f172a', border: '1px solid rgba(79,70,229,0.15)', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(79,70,229,0.15)', fontSize: '12px', fontWeight: 600, color: '#64748b', display: 'grid', gridTemplateColumns: '90px 80px 90px 1fr 140px', gap: '12px' }}>
            <span>TIME</span><span>TYPE</span><span>KEY</span><span>DETAIL</span><span>IP</span>
          </div>
          {loading && <div style={{ padding: '24px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>Loading…</div>}
          {!loading && events.length === 0 && <div style={{ padding: '24px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>No events yet.</div>}
          {!loading && events.map((e, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '90px 80px 90px 1fr 140px', gap: '12px',
              padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)',
              background: e.key === 'Lerae' ? 'rgba(245,158,11,0.06)' : 'transparent',
            }}>
              <span style={{ fontSize: '11px', color: '#475569' }}>{new Date(e.ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              <span style={{
                fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', alignSelf: 'center',
                background: e.type === 'login' ? 'rgba(99,102,241,0.15)' : 'rgba(74,222,128,0.1)',
                color: e.type === 'login' ? '#818cf8' : '#4ade80',
                border: `1px solid ${e.type === 'login' ? 'rgba(99,102,241,0.3)' : 'rgba(74,222,128,0.2)'}`,
              }}>{e.type.toUpperCase()}</span>
              <span style={{ fontSize: '12px', color: e.key === 'Lerae' ? '#f59e0b' : '#94a3b8', fontWeight: e.key === 'Lerae' ? 700 : 400 }}>{e.key}</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>{e.detail || '—'}</span>
              <span style={{ fontSize: '10px', color: '#334155', fontFamily: 'monospace' }}>{e.ip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
