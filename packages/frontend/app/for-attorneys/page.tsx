"use client";

import Link from 'next/link';

const CASES = [
  { id: "TRP-2026-001", artist: "Artist A", amount: "$214,300", source: "SoundExchange", status: "Documented" },
  { id: "TRP-2026-002", artist: "Artist B", amount: "$198,750", source: "SoundExchange", status: "Documented" },
  { id: "TRP-2026-003", artist: "Artist C", amount: "$241,200", source: "SoundExchange", status: "Documented" },
  { id: "TRP-2026-004", artist: "Artist D", amount: "$187,500", source: "SoundExchange", status: "Documented" },
  { id: "TRP-2026-005", artist: "Artist E", amount: "$178,250", source: "SoundExchange", status: "Documented" },
];

export default function ForAttorneysPage() {
  return (
    <div style={{ background: "#05070f", color: "#e2e8f0", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif" }}>

      {/* Hero */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 32px 64px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1e1b4b", border: "1px solid #4338ca", borderRadius: 999, padding: "6px 16px", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#a5b4fc", textTransform: "uppercase", marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block" }} />
          SMPT Certified · Entertainment Law Division
        </div>

        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.03em" }}>
          We've identified{" "}
          <span style={{ color: "#818cf8" }}>$1,020,000</span>
          <br />in unmatched royalties.
          <br />
          <span style={{ color: "#94a3b8", fontSize: "0.65em", fontWeight: 600 }}>Across 5 documented cases. Your clients may be owed.</span>
        </h1>

        <p style={{ fontSize: 17, color: "#94a3b8", maxWidth: 620, margin: "0 auto 40px", lineHeight: 1.7 }}>
          TrapRoyaltiesPRO uses forensic-grade data scraping and SMPT verification to identify unclaimed SoundExchange royalties.
          Every case is documented, timestamped, and ready for legal action.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/attorney-portal" style={{
            background: "#4f46e5", color: "#fff", padding: "14px 32px", borderRadius: 10,
            fontWeight: 800, fontSize: 14, textDecoration: "none", letterSpacing: "0.04em"
          }}>
            Access Attorney Portal →
          </Link>
          <Link href="/cases" style={{
            background: "transparent", color: "#a5b4fc", padding: "14px 32px", borderRadius: 10,
            fontWeight: 700, fontSize: 14, textDecoration: "none", border: "1px solid #312e81"
          }}>
            View Case Files
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #312e81, transparent)", maxWidth: 800, margin: "0 auto" }} />

      {/* Stats row */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "48px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24, textAlign: "center" }}>
        {[
          { value: "$1,020,000", label: "Documented Unmatched Royalties" },
          { value: "5", label: "Active Cases" },
          { value: "SoundExchange", label: "Primary Source" },
          { value: "SMPT Verified", label: "Verification Standard" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "24px 16px", background: "#0d1117", border: "1px solid #1e293b", borderRadius: 12 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#818cf8", marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* Case evidence table */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "0 32px 64px" }}>
        <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#e2e8f0", marginBottom: 4 }}>Evidence Chain Summary</h2>
            <p style={{ fontSize: 12, color: "#475569", fontWeight: 500 }}>5 cases · All amounts verified via SMPT forensic audit · Artist identities protected pending counsel engagement</p>
          </div>
          <Link href="/cases" style={{ fontSize: 12, color: "#818cf8", textDecoration: "none", fontWeight: 700, border: "1px solid #312e81", padding: "8px 16px", borderRadius: 8 }}>
            Full Case Files →
          </Link>
        </div>

        <div style={{ border: "1px solid #1e293b", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0f172a", borderBottom: "1px solid #1e293b" }}>
                {["Case ID", "Artist", "Documented Amount", "Source", "Status"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#475569", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CASES.map((c, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #0f172a", background: i % 2 === 0 ? "#080d14" : "#0a1020" }}>
                  <td style={{ padding: "14px 16px", fontFamily: "monospace", color: "#6366f1", fontWeight: 700 }}>{c.id}</td>
                  <td style={{ padding: "14px 16px", color: "#94a3b8" }}>{c.artist}</td>
                  <td style={{ padding: "14px 16px", color: "#34d399", fontWeight: 800 }}>{c.amount}</td>
                  <td style={{ padding: "14px 16px", color: "#94a3b8" }}>{c.source}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ background: "#14532d", color: "#86efac", padding: "3px 10px", borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em" }}>
                      ✓ {c.status}
                    </span>
                  </td>
                </tr>
              ))}
              <tr style={{ background: "#0f172a", borderTop: "2px solid #1e293b" }}>
                <td colSpan={2} style={{ padding: "14px 16px", fontWeight: 800, color: "#e2e8f0" }}>TOTAL</td>
                <td style={{ padding: "14px 16px", color: "#818cf8", fontWeight: 900, fontSize: 16 }}>$1,020,000</td>
                <td colSpan={2} />
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* What attorneys get */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #312e81, transparent)", maxWidth: 800, margin: "0 auto" }} />
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "64px 32px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#e2e8f0", marginBottom: 8 }}>Built for Attorney Use</h2>
        <p style={{ fontSize: 14, color: "#475569", marginBottom: 40 }}>Everything in the portal is designed for legal review, not just data browsing.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[
            { icon: "🔐", title: "Password-Protected Portal", desc: "Dedicated attorney access. Client data never exposed publicly." },
            { icon: "📄", title: "PDF Case Files", desc: "Download court-ready PDFs for each case — timestamped, hashed, SMPT verified." },
            { icon: "🔗", title: "Evidence Chain", desc: "Full audit trail from SoundExchange data to documented claim amount." },
            { icon: "📋", title: "LOD Generator", desc: "Auto-generate Letters of Direction with embedded case evidence." },
            { icon: "🔬", title: "Forensic Audit Reports", desc: "SMPT-certified methodology. Cross-referenced across PRO databases." },
            { icon: "⚖️", title: "Demand Letter Templates", desc: "Pre-built legal templates with your evidence pre-populated." },
          ].map((item, i) => (
            <div key={i} style={{ background: "#0d1117", border: "1px solid #1e293b", borderRadius: 12, padding: "24px 20px" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#c7d2fe", marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 860, margin: "0 auto 80px", padding: "0 32px" }}>
        <div style={{ background: "#0d1117", border: "1px solid #312e81", borderRadius: 16, padding: "48px 40px", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#6366f1", textTransform: "uppercase", marginBottom: 16 }}>Ready to Review the Evidence?</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: "#e2e8f0", marginBottom: 12, letterSpacing: "-0.02em" }}>
            Your clients' money is sitting in a black box.<br />
            <span style={{ color: "#818cf8" }}>We've already found it.</span>
          </h2>
          <p style={{ fontSize: 14, color: "#475569", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
            Request access to the full case files and attorney portal. All cases are documented and ready for legal engagement.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/attorney-portal" style={{
              background: "#4f46e5", color: "#fff", padding: "14px 36px", borderRadius: 10,
              fontWeight: 800, fontSize: 14, textDecoration: "none", letterSpacing: "0.04em"
            }}>
              Enter Attorney Portal →
            </Link>
            <a href="mailto:contact@traproyaltiespro.com" style={{
              background: "transparent", color: "#a5b4fc", padding: "14px 32px", borderRadius: 10,
              fontWeight: 700, fontSize: 14, textDecoration: "none", border: "1px solid #312e81"
            }}>
              Contact Directly
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1e293b", padding: "32px", textAlign: "center", fontSize: 11, color: "#334155" }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: "#4f46e5", fontWeight: 800 }}>TrapRoyalties</span>
          <span style={{ color: "#818cf8", fontWeight: 900 }}>PRO</span>
          <span style={{ marginLeft: 16 }}>· SMPT Certified Verification & Audit ·</span>
          <span style={{ marginLeft: 16 }}>© 2026</span>
        </div>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/cases" style={{ color: "#475569", textDecoration: "none" }}>Case Files</Link>
          <Link href="/attorney-portal" style={{ color: "#475569", textDecoration: "none" }}>Attorney Portal</Link>
          <Link href="/privacy" style={{ color: "#475569", textDecoration: "none" }}>Privacy</Link>
          <Link href="/terms" style={{ color: "#475569", textDecoration: "none" }}>Terms</Link>
        </div>
      </footer>

    </div>
  );
}
