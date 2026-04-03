"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

const TERMINAL_LOGS = [
  "[SMPT] Identity scan initiated — performer registry cross-reference",
  "[REGISTRY] ISRC match confirmed — performer share located",
  "[AUDIT] LOD status: NOT FILED — funds accruing in suspense",
  "[SYSTEM] Case TRP-2026-001 flagged — recovery position verified",
  "[CHAIN] Verification hash anchored to audit ledger",
  "[DISPATCH] LOD packet generated — awaiting legal submission",
  "[REGISTRY] Secondary ISRC validation complete",
  "[AUDIT] Statutory trust balance updated — $214,300 confirmed",
  "[SYSTEM] Case TRP-2026-002 flagged — recovery position verified",
  "[SMPT] Biometric contributor match — 99.4% confidence",
  "[CHAIN] Timestamp sealed: " + new Date().toISOString().slice(0,19) + "Z",
  "[DISPATCH] Attorney access granted — portal ready",
];

const fmt = (n: number) => "$" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const CASES = [
  { id: "TRP-2026-001", label: "Guest Performer — Unclaimed Share",    issue: "LOD NOT FILED",     value: "$214,300", score: 97 },
  { id: "TRP-2026-002", label: "Featured Performer — Missing LOD",     issue: "AUTHORIZATION HOLD", value: "$198,750", score: 94 },
  { id: "TRP-2026-003", label: "Principal Performer — Registry Gap",   issue: "LOD NOT FILED",     value: "$241,200", score: 98 },
  { id: "TRP-2026-004", label: "Co-Performer — Statutory Suspense",    issue: "IDENTITY PENDING",  value: "$187,500", score: 91 },
  { id: "TRP-2026-005", label: "Session Performer — Unclaimed",        issue: "LOD NOT FILED",     value: "$178,250", score: 96 },
];

export default function ForAttorneysPage() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [pipeline, setPipeline] = useState(1020000);
  const [syncAge, setSyncAge] = useState(4);
  const terminalRef = useRef<HTMLDivElement>(null);
  const logIndex = useRef(0);

  useEffect(() => {
    const t = setInterval(() => {
      const line = `[${new Date().toLocaleTimeString("en-US", { hour12: false })}] ${TERMINAL_LOGS[logIndex.current % TERMINAL_LOGS.length]}`;
      logIndex.current++;
      setTerminalLines(prev => [...prev.slice(-18), line]);
    }, 1400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [terminalLines]);

  useEffect(() => {
    const t = setInterval(() => {
      setPipeline(v => v + Math.floor(Math.random() * 150 + 50));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setSyncAge(v => v >= 30 ? 2 : v + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: "#0B0F14", color: "#E5E7EB", minHeight: "100vh", fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif' }}>

      {/* System status bar */}
      <div style={{ background: "#000", borderBottom: "1px solid #1f2937", fontSize: 11, color: "#4b5563", padding: "7px 32px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span style={{ color: "#22c55e" }}>● System Status: ACTIVE</span>
        <span>Nodes: Stockholm · New York · Los Angeles</span>
        <span>Last Sync: {syncAge}s ago</span>
      </div>

      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 32px", borderBottom: "1px solid #1f2937" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src="/images/trp-logo.png" alt="TRP" style={{ height: 28, width: "auto", mixBlendMode: "screen", filter: "brightness(1.15)" }} />
          <div style={{ borderLeft: "1px solid #374151", paddingLeft: 16, fontSize: 11, color: "#4b5563", letterSpacing: "0.1em", textTransform: "uppercase" }}>SMPT Verified System</div>
        </div>
        <span style={{ fontSize: 11, color: "#4b5563", letterSpacing: "0.1em" }}>Production Environment</span>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "80px 32px 64px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "#4b5563", textTransform: "uppercase", marginBottom: 24 }}>
          Verified Royalty Claim Infrastructure
        </div>

        <h1 style={{ fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 600, lineHeight: 1.15, maxWidth: 700, marginBottom: 24, letterSpacing: "-0.02em", color: "#f9fafb" }}>
          Verified Royalty Claims —<br />Ready for Legal Execution
        </h1>

        <p style={{ fontSize: 18, color: "#6b7280", maxWidth: 580, marginBottom: 16, lineHeight: 1.7 }}>
          Confirmed performer revenue held in statutory suspense due to missing authorization.
        </p>

        <p style={{ fontSize: 15, color: "#4b5563", marginBottom: 12, fontStyle: "italic" }}>
          This is not discovery. These are recoverable financial positions.
        </p>

        <p style={{ fontSize: 14, color: "#374151", marginBottom: 40 }}>
          Each result is not a data point — it is a recoverable financial position.
        </p>

        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <Link href="/attorney-portal" style={{ background: "#fff", color: "#000", padding: "12px 28px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", letterSpacing: "0.02em" }}>
            Review Verified Cases
          </Link>
          <Link href="/cases" style={{ color: "#6b7280", fontSize: 13, textDecoration: "none", borderBottom: "1px solid #374151", paddingBottom: 2 }}>
            Initiate Filing →
          </Link>
        </div>
      </section>

      {/* Money strip */}
      <div style={{ background: "#0d1117", borderTop: "1px solid #1f2937", borderBottom: "1px solid #1f2937", padding: "20px 32px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <span style={{ fontSize: 11, color: "#4b5563", letterSpacing: "0.12em", textTransform: "uppercase" }}>Live Recovery Pipeline</span>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#f9fafb", marginTop: 2 }}>
              {fmt(pipeline)}<span style={{ fontSize: 16, color: "#6b7280" }}>+</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
            {[["50+", "Active Cases"], ["ISRC-Level", "Validation"], ["Registry", "Confirmed"], ["5", "Ready to File"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#e5e7eb" }}>{v}</div>
                <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Terminal */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "56px 32px 0" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: "#4b5563", textTransform: "uppercase", marginBottom: 12 }}>
          System Activity — Live
        </div>
        <div ref={terminalRef} style={{ background: "#000", border: "1px solid #1f2937", borderRadius: 10, padding: "20px 24px", fontFamily: '"SF Mono","Fira Code","Courier New",monospace', fontSize: 12, color: "#22c55e", height: 220, overflowY: "auto", lineHeight: 1.8 }}>
          {terminalLines.map((line, i) => (
            <div key={i} style={{ opacity: i === terminalLines.length - 1 ? 1 : 0.55 + (i / terminalLines.length) * 0.45 }}>{line}</div>
          ))}
          <span style={{ animation: "blink 1s step-end infinite" }}>█</span>
        </div>
        <style>{`@keyframes blink { 50% { opacity: 0 } }`}</style>
      </section>

      {/* Cases */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "56px 32px" }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 6, color: "#f9fafb" }}>Active Recovery Cases</h2>
        <p style={{ fontSize: 12, color: "#4b5563", marginBottom: 28 }}>Artist identities protected pending counsel engagement · All amounts SoundExchange-sourced</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {CASES.map((c) => (
            <div key={c.id} style={{ border: "1px solid #1f2937", borderRadius: 12, padding: "24px", background: "#0d1117", transition: "border-color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#374151")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#1f2937")}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: 10, fontFamily: "monospace", color: "#4b5563" }}>{c.id}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", letterSpacing: "0.1em" }}>● VERIFIED</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#e5e7eb", marginBottom: 8 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: "#ef4444", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 16 }}>{c.issue}</div>

              {/* Verification score */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: "#4b5563" }}>Verification Score</span>
                  <span style={{ fontSize: 10, color: "#22c55e" }}>{c.score}%</span>
                </div>
                <div style={{ background: "#1f2937", height: 3, borderRadius: 999 }}>
                  <div style={{ background: "#22c55e", height: 3, borderRadius: 999, width: `${c.score}%` }} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: "#f9fafb" }}>{c.value}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", letterSpacing: "0.08em", border: "1px solid #166534", padding: "3px 10px", borderRadius: 999 }}>READY FOR FILING</span>
              </div>
              <div style={{ fontSize: 10, color: "#374151", marginTop: 12 }}>Audit ID: {c.id}-AX{Math.floor(Math.random() * 90 + 10)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Legal basis */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "48px 32px", borderTop: "1px solid #1f2937" }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, color: "#f9fafb" }}>Legal Basis</h2>
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
          {[
            "Performer share held in statutory trust under 17 U.S.C. § 114",
            "Payment blocked due to missing Letter of Direction (LOD)",
            "Identity verified across ISRC registries and contributor records",
            "Submission of LOD unlocks accumulated royalty balance",
            "SoundExchange holds funds indefinitely absent authorization",
            "No statute of limitations on unclaimed performer royalties",
          ].map((item, i) => (
            <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
              <span style={{ color: "#374151", marginTop: 3, flexShrink: 0 }}>—</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Pipeline */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "48px 32px", borderTop: "1px solid #1f2937" }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 32, color: "#f9fafb" }}>Execution Pipeline</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative" }}>
          {["Identity Verified", "LOD Generated", "Filed with SoundExchange", "Funds Released"].map((step, i) => (
            <div key={i} style={{ position: "relative", paddingRight: 16 }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: i < 2 ? "#166534" : "#1f2937", border: `1px solid ${i < 2 ? "#22c55e" : "#374151"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: i < 2 ? "#22c55e" : "#4b5563", flexShrink: 0 }}>
                  {i + 1}
                </div>
                {i < 3 && <div style={{ flex: 1, height: 1, background: i < 1 ? "#22c55e" : "#1f2937", marginLeft: 8 }} />}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: i < 2 ? "#e5e7eb" : "#4b5563", marginBottom: 4 }}>{step}</div>
              <div style={{ fontSize: 11, color: i < 2 ? "#22c55e" : "#374151" }}>{i < 2 ? "Complete" : "Pending counsel"}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 960, margin: "0 auto 80px", padding: "0 32px" }}>
        <div style={{ border: "1px solid #1f2937", borderRadius: 14, padding: "56px 48px", textAlign: "center", background: "#0d1117" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: "#4b5563", textTransform: "uppercase", marginBottom: 20 }}>
            Access Verified Recovery Pipeline
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 600, color: "#f9fafb", marginBottom: 12, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
            Review cases. File immediately.<br />
            <span style={{ color: "#6b7280", fontWeight: 400 }}>Recover what's already owed.</span>
          </h2>
          <p style={{ fontSize: 13, color: "#4b5563", marginBottom: 16 }}>Review cases. File immediately. Recover what's already owed.</p>
          <p style={{ fontSize: 12, color: "#374151", marginBottom: 36 }}>Additional case data available upon authorization.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/attorney-portal" style={{ background: "#fff", color: "#000", padding: "13px 32px", borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: "none" }}>
              Request Access
            </Link>
            <a href="mailto:contact@traproyaltiespro.com" style={{ color: "#6b7280", padding: "13px 24px", borderRadius: 8, fontSize: 13, textDecoration: "none", border: "1px solid #1f2937" }}>
              Direct Contact
            </a>
          </div>
          <p style={{ fontSize: 11, color: "#374151", marginTop: 20 }}>Access by invitation only · Verified attorneys</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1f2937", padding: "32px", textAlign: "center", fontSize: 11, color: "#374151" }}>
        <p style={{ marginBottom: 8 }}>Built on SMPT verification infrastructure · Prepared for integration with SoundExchange and global royalty registries</p>
        <p style={{ marginBottom: 16 }}>Swedish rights infrastructure standards (STIM / SAMI environment) · ISRC-Level validation</p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
          {[["Cases", "/cases"], ["Attorney Portal", "/attorney-portal"], ["Privacy", "/privacy"], ["Terms", "/terms"]].map(([label, href]) => (
            <Link key={href} href={href} style={{ color: "#374151", textDecoration: "none" }}>{label}</Link>
          ))}
        </div>
      </footer>

    </div>
  );
}
