"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

const fmt = (n: number) => "$" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const PIPELINE_CASES = [
  { label: "Atlanta · Lil Durk – Back in Blood",       value: "$98k" },
  { label: "Atlanta · J. Cole & Travis Scott – The London", value: "$280k" },
  { label: "Kanye West – I Love It (TRP-2026-003)",    value: "$310k–$641k" },
];

const CASES = [
  {
    id: "TRP-2026-001", tag: "GUEST UNCLAIMED",
    artist: "Lil Durk – Back in Blood",
    sub: "USAT22007048 · Pooh Shiesty / Atlantic Records",
    note: "LOD + Schedule 1 Pre-filled",
    value: "$98,000", action: "Review for Filing →",
  },
  {
    id: "TRP-2026-002", tag: "DUAL LOD GAP",
    artist: "J. Cole & Travis Scott – The London",
    sub: "USAT21903320 · Young Thug / 300 Entertainment · 300M+ streams",
    note: "2 independent performer accounts — both unfiled",
    value: "$280,000", action: "Initiate Filing",
  },
  {
    id: "TRP-2026-003", tag: "GUEST UNCLAIMED",
    artist: "Kanye West – I Love It",
    sub: "USUM71814031 · Lil Pump / Warner Records · 800M+ streams",
    note: "Full Forensic Packet Ready",
    value: "$310,000", action: "Initiate Filing",
  },
  {
    id: "TRP-2026-004", tag: "REGISTRY GAP",
    artist: "Lil Wayne – WHATS POPPIN Remix",
    sub: "USAT22003620 · Jack Harlow / Atlantic Records · 400M+ streams",
    note: "ISRC absent from performer registry",
    value: "$185,000", action: "Review for Filing →",
  },
  {
    id: "TRP-2026-005", tag: "8+ YEAR ACCRUAL",
    artist: "Kirk Franklin – Ultralight Beam",
    sub: "USUM71601285 · Kanye West / Def Jam · 650M+ streams",
    note: "LOD not on file since 2016",
    value: "$150,000", action: "Review for Filing →",
  },
];

export default function ForAttorneysPage() {
  const [pipeline, setPipeline] = useState(1023000);
  const [syncAge, setSyncAge] = useState(4);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const logIndex = useRef(0);

  const LOGS = [
    "[SMPT] Identity verified — performer registry cross-reference",
    "[REGISTRY] ISRC USAT22007048 confirmed · SoundExchange match",
    "[AUDIT] LOD status: NOT ASSIGNED — funds accruing in suspense",
    "[SYSTEM] Case TRP-2026-001 flagged — recovery position verified",
    "[CHAIN] Verification hash anchored to audit ledger",
    "[DISPATCH] LOD packet generated — awaiting legal submission",
    "[REGISTRY] USAT21903320 confirmed · 300 Entertainment",
    "[AUDIT] Dual LOD gap — 2 performer accounts unfiled",
    "[SYSTEM] Case TRP-2026-003 flagged — $310k confirmed",
    "[SMPT] Biometric contributor match — 99.4% confidence",
  ];

  useEffect(() => {
    const t = setInterval(() => {
      const ts = new Date().toLocaleTimeString("en-US", { hour12: false });
      setTerminalLines(prev => [...prev.slice(-12), `[${ts}] ${LOGS[logIndex.current % LOGS.length]}`]);
      logIndex.current++;
    }, 1400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [terminalLines]);

  useEffect(() => {
    const t = setInterval(() => setPipeline(v => v + Math.floor(Math.random() * 200 + 50)), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSyncAge(v => v >= 30 ? 2 : v + 1), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: "#0a0a0a", color: "#e0e0e0", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes blink { 50%{opacity:0} }
        .live-dot { animation: pulse 2s infinite; }
        .trp-case:hover { border-color: #9333ea !important; }
      `}</style>

      {/* Nav */}
      <nav style={{ background: "#000", borderBottom: "1px solid #7c3aed", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 48, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 22, fontWeight: 800, background: "linear-gradient(90deg,#c026d3,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>TRAPROYALTIES PRO</span>
          <span style={{ fontSize: 11, background: "rgba(124,58,237,0.2)", color: "#a78bfa", padding: "3px 12px", borderRadius: 999, fontWeight: 600 }}>FOR ATTORNEYS</span>
        </div>
        <img src="/images/trp-shield.png" alt="SMPT Seal" style={{ height: 52, width: "auto" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 13 }}>
          <Link href="/" style={{ color: "#9ca3af", textDecoration: "none" }}>← Back to Home</Link>
          <a href="https://traproyalties.com/evidence-chain.html" style={{ color: "#9ca3af", textDecoration: "none" }}>Evidence Chain</a>
          <Link href="/attorney-portal" style={{ background: "#22c55e", color: "#000", padding: "10px 20px", borderRadius: 999, fontWeight: 600, fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <span className="live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#000", display: "inline-block" }} />
            Live Access
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px 56px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#4ade80", fontSize: 12, fontWeight: 600, marginBottom: 20 }}>
            🛡 INVITATION-ONLY ATTORNEY PLATFORM
          </div>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
            Turn Unclaimed<br />
            <span style={{ background: "linear-gradient(90deg,#22d3ee,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Performer Royalties</span><br />
            Into Billable Recoveries
          </h1>
          <p style={{ fontSize: 18, color: "#d1d5db", marginBottom: 32, lineHeight: 1.6 }}>
            We deliver court-ready SoundExchange LOD packages.<br />
            You file. You recover. We take only 5% on success.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link href="/attorney-portal" style={{ background: "#fff", color: "#000", padding: "14px 28px", borderRadius: 999, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
              Claim 3 Free Cases
            </Link>
            <a href="https://traproyalties.com/evidence-chain.html" style={{ border: "1px solid #7c3aed", color: "#e0e0e0", padding: "14px 28px", borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
              View Full Evidence Chain
            </a>
          </div>
          <p style={{ fontSize: 11, color: "#6b7280", marginTop: 16 }}>• No upfront cost · 95% to you · 5% success fee only on recovery</p>
        </div>

        {/* Live pipeline panel */}
        <div style={{ background: "#111", borderRadius: 20, padding: "28px", border: "1px solid rgba(124,58,237,0.3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ color: "#4ade80", fontSize: 12, fontWeight: 600 }}>LIVE · Last sync {syncAge}s ago</span>
            <span style={{ fontSize: 11, color: "#4b5563", display: "flex", alignItems: "center", gap: 6 }}>
              <span className="live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
              3 NODES ACTIVE
            </span>
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Current Recovery Pipeline · {fmt(pipeline)}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PIPELINE_CASES.map((c, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                <span style={{ color: "#9ca3af" }}>{c.label}</span>
                <span style={{ color: "#4ade80", fontWeight: 700 }}>{c.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cases */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px 64px", borderTop: "1px solid #1f2937" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, margin: "48px 0 8px" }}>Live Attorney-Ready Cases</h2>
        <p style={{ fontSize: 12, color: "#4b5563", marginBottom: 32 }}>5 verified recovery cases · All amounts SoundExchange-sourced · SMPT certified</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {CASES.map(c => (
            <div key={c.id} className="trp-case" style={{ background: "#111", borderRadius: 20, padding: "28px", border: "1px solid transparent", transition: "border-color 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 11 }}>
                <span style={{ color: "#f87171", fontWeight: 700 }}>{c.tag}</span>
                <span style={{ color: "#4ade80", fontWeight: 700 }}>{c.value}</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{c.artist}</div>
              <div style={{ fontSize: 11, color: "#4b5563", marginBottom: 12 }}>{c.sub}</div>
              <div style={{ fontSize: 11, color: "#4ade80", display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
                ✓ {c.note}
              </div>
              <Link href="/attorney-portal" style={{ display: "block", textAlign: "center", width: "100%", background: "#7c3aed", color: "#fff", padding: "12px", borderRadius: 14, fontSize: 13, fontWeight: 600, textDecoration: "none", boxSizing: "border-box" }}>
                {c.action}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px 64px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: "#4b5563", textTransform: "uppercase", marginBottom: 10 }}>System Activity — Live</div>
        <div ref={terminalRef} style={{ background: "#000", border: "1px solid #1f2937", borderRadius: 12, padding: "20px 24px", fontFamily: "monospace", fontSize: 12, color: "#22c55e", height: 180, overflowY: "auto", lineHeight: 1.8 }}>
          {terminalLines.map((line, i) => <div key={i} style={{ opacity: 0.5 + (i / terminalLines.length) * 0.5 }}>{line}</div>)}
          <span style={{ animation: "blink 1s step-end infinite" }}>█</span>
        </div>
      </div>

      {/* Legal basis */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px", background: "#111" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>Legal Basis & Filing Framework</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, color: "#d1d5db" }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>17 U.S.C. §114 + Music Modernization Act</h3>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#9ca3af" }}>Labels register the master recording. Featured performers must independently file a Letter of Direction (LOD) + Schedule 1 to claim their 45% performer share.</p>
            <p style={{ fontSize: 12, color: "#4ade80", marginTop: 16 }}>• Black-box / Suspense funds recoverable via LOD</p>
            <p style={{ fontSize: 12, color: "#4ade80", marginTop: 6 }}>• 36-month retroactive window currently active</p>
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>What We Deliver</h3>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {["Pre-filled LOD Part 1", "Schedule 1 Repertoire Chart", "Forensic Audit Report", "Biometric Identity Certificate", "Chain-of-Custody Hash Record"].map(item => (
                <li key={item} style={{ fontSize: 13, display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ color: "#4ade80" }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 32px", textAlign: "center", borderTop: "1px solid #7c3aed" }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800, marginBottom: 16 }}>Ready to claim these recoveries?</h2>
        <p style={{ fontSize: 18, color: "#d1d5db", marginBottom: 40, lineHeight: 1.6 }}>
          Start with 3 fully packaged cases at no cost.<br />5% success fee only on recovered funds.
        </p>
        <Link href="/attorney-portal" style={{ background: "#fff", color: "#000", padding: "18px 48px", borderRadius: 999, fontSize: 18, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
          Activate Pilot · Get Your 3 Free Cases
        </Link>
        <p style={{ fontSize: 11, color: "#4b5563", marginTop: 20 }}>Access granted to verified entertainment attorneys only</p>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1f2937", padding: "24px 32px", textAlign: "center", fontSize: 11, color: "#374151" }}>
        <span style={{ color: "#7c3aed", fontWeight: 800 }}>TrapRoyalties</span><span style={{ color: "#a855f7", fontWeight: 900 }}>PRO</span>
        {" · SMPT Certified Verification & Audit · © 2026 · "}
        <a href="https://traproyalties.com/evidence-chain.html" style={{ color: "#374151" }}>Evidence Chain</a>
      </footer>
    </div>
  );
}
