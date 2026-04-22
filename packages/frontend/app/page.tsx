import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TrapRoyaltiesPro Workspaces · Metadata Integrity & Rights Verification',
  description:
    'One platform powering metadata integrity, rights verification, and royalty recovery across global publishing and legal workflows.',
};

const CSS = `
.wsc { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #fafcff; color: #0a2a32; line-height: 1.45; min-height: 100vh; }
.wsc *, .wsc *::before, .wsc *::after { box-sizing: border-box; }
.wsc a { text-decoration: none; color: inherit; }
.wsc-container { max-width: 1280px; margin: 0 auto; padding: 1.8rem 2rem 3rem; }
.wsc-header { text-align: center; margin-bottom: 2.5rem; }
.wsc-logo { font-size: 1.8rem; font-weight: 800; background: linear-gradient(135deg, #0c4e3a, #1e7a5c); background-clip: text; -webkit-background-clip: text; color: transparent; letter-spacing: -0.02em; }
.wsc-tagline { font-size: 1rem; color: #2b6e58; margin-top: 0.2rem; font-weight: 500; }
.wsc-hero-title { font-size: 2.4rem; font-weight: 800; line-height: 1.2; margin: 1rem 0 0.5rem; }
.wsc-hero-sub { color: #3f6f7c; max-width: 680px; margin: 0 auto; }
.wsc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin: 2.5rem 0 2rem; }
.wsc-card { background: white; border-radius: 2rem; padding: 1.8rem 2rem; border: 1px solid #e0ede8; box-shadow: 0 8px 20px rgba(0,0,0,0.02); transition: all 0.2s; }
.wsc-card:hover { border-color: #caddd6; box-shadow: 0 12px 24px -12px rgba(0,0,0,0.08); }
.wsc-badge { display: inline-block; background: #eaf6f1; padding: 0.2rem 1rem; border-radius: 40px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.4px; color: #1e6e58; margin-bottom: 1rem; }
.wsc-card h2 { font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem; }
.wsc-sub { color: #4a7b6b; font-size: 0.85rem; margin-bottom: 1.2rem; border-left: 2px solid #9ecfbd; padding-left: 0.8rem; }
.wsc-lead { font-size: 0.9rem; margin-bottom: 0.8rem; }
.wsc-section-head { font-weight: 700; margin: 0.8rem 0 0.2rem; }
.wsc-features { list-style: none; margin: 1rem 0; padding: 0; }
.wsc-features li { padding: 0.4rem 0; font-size: 0.85rem; display: flex; align-items: center; gap: 0.6rem; }
.wsc-features li::before { content: "\\2713"; color: #2c9b7a; font-weight: 800; }
.wsc-includes { margin-top: 1.2rem; background: #f8fefb; border-radius: 1rem; padding: 0.8rem 1rem; font-size: 0.75rem; font-weight: 600; color: #1e6e58; display: inline-block; width: 100%; }
.wsc-btn { display: inline-block; background: #0f4f3e; color: white !important; padding: 0.7rem 1.5rem; border-radius: 60px; font-weight: 600; margin-top: 1.2rem; transition: 0.15s; }
.wsc-btn:hover { background: #0a3f31; transform: translateY(-1px); }
.wsc-why { background: #f2f8f5; border-radius: 2rem; padding: 2rem 2rem; margin: 2rem 0; border: 1px solid #d4e5de; }
.wsc-why h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; }
.wsc-intro { margin-bottom: 1rem; }
.wsc-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem; }
.wsc-origin { background: white; border-radius: 1.2rem; padding: 1.2rem; }
.wsc-origin p { font-weight: 700; margin-bottom: 0.5rem; }
.wsc-origin .wsc-note { margin-top: 0.8rem; color: #1a6e56; }
.wsc-result { background: #eef3f0; border-radius: 1rem; padding: 1rem; text-align: center; margin-top: 1.2rem; }
.wsc-result-title { font-weight: 800; font-size: 1.1rem; }
.wsc-result-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 1.2rem; margin-top: 0.6rem; }
.wsc-built { background: white; border-radius: 1.6rem; padding: 1.5rem; border: 1px solid #d7e6e0; text-align: center; }
.wsc-built-title { font-weight: 800; }
.wsc-built-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin-top: 0.6rem; font-size: 0.85rem; }
.wsc-position { margin: 2rem 0 0.5rem; text-align: center; }
.wsc-position-pill { font-weight: 800; font-size: 1.1rem; background: #EFF7F4; display: inline-block; padding: 0.4rem 1.8rem; border-radius: 60px; color: #146b54; }
.wsc-footer-note { margin-top: 3rem; padding-top: 1.5rem; text-align: center; font-size: 0.75rem; color: #648e7e; border-top: 1px solid #d0e2db; }
@media (max-width: 780px) {
  .wsc-container { padding: 1rem 1.2rem 2rem; }
  .wsc-grid { grid-template-columns: 1fr; }
  .wsc-hero-title { font-size: 1.8rem; }
  .wsc-2col { grid-template-columns: 1fr; }
}
`;

export default function HomePage() {
  return (
    <div className="wsc">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wsc-container">
        <div className="wsc-header">
          <div className="wsc-logo">TrapRoyaltiesPro</div>
          <div className="wsc-tagline">Fix Metadata. Verify Rights. Recover Revenue.</div>
          <div className="wsc-hero-title">
            One platform powering metadata integrity, rights verification,<br />
            and royalty recovery across global publishing and legal workflows.
          </div>
          <div className="wsc-hero-sub">Choose your workspace</div>
        </div>

        <div className="wsc-grid">
          {/* Publishing Portal */}
          <div className="wsc-card">
            <div className="wsc-badge">📘 For publishers &amp; rights managers</div>
            <h2>🧾 Publishing Portal</h2>
            <div className="wsc-sub">
              For publishers, catalog owners, administrators, and rights managers
            </div>
            <p className="wsc-lead">
              Identify metadata gaps, prevent rejected registrations, and ensure your catalog is
              clean, compliant, and revenue-ready before submission to CMOs and DSP-linked systems.
            </p>
            <div className="wsc-section-head">🔓 What this unlocks</div>
            <ul className="wsc-features">
              <li>Detect missing or inconsistent metadata</li>
              <li>Eliminate split conflicts before submission</li>
              <li>Reduce rejected works and processing delays</li>
              <li>Maintain a continuously verified catalog</li>
            </ul>
            <div className="wsc-includes">
              📦 Includes: Metadata Dry Cleaning · Publishing Health Dashboard · CWR Pre-Flight
              Validation · CWR v2.1 Packet Generation · ACK/XRF Auto-Sync · Publisher Scorecard ·
              Pilot Program
            </div>
            <a href="/publisher-portal" className="wsc-btn">
              👉 Enter Publishing Portal →
            </a>
          </div>

          {/* Attorney Portal */}
          <div className="wsc-card">
            <div className="wsc-badge">⚖️ For legal &amp; rights verification</div>
            <h2>⚖️ Attorney Portal</h2>
            <div className="wsc-sub">
              For attorneys, legal teams, and rights-verification workflows
            </div>
            <p className="wsc-lead">
              Establish clear ownership, defensible splits, and audit-ready documentation for
              disputes, catalog acquisitions, and rights enforcement.
            </p>
            <div className="wsc-section-head">⚙️ What this enables</div>
            <ul className="wsc-features">
              <li>Verify chain-of-title across works</li>
              <li>Validate ownership splits with supporting data</li>
              <li>Prepare documentation for disputes or transactions</li>
              <li>Generate legally structured metadata reports</li>
            </ul>
            <div className="wsc-includes">
              📦 Includes: Split Verification · Chain-of-Title Review · Rights Documentation ·
              Contributor Validation · Exportable Legal Packets · Case-Ready Metadata Reports
            </div>
            <a href="/forensic" className="wsc-btn">
              👉 Enter Attorney Portal →
            </a>
          </div>
        </div>

        <div className="wsc-why">
          <h3>🧠 Why this platform exists</h3>
          <p className="wsc-intro">
            Most royalty and rights issues don&rsquo;t start in payments.
            <br />
            They start in:
          </p>
          <div className="wsc-2col">
            <div className="wsc-origin">
              <p>❌ Broken metadata</p>
              <p>❌ Inconsistent ownership records</p>
              <p>❌ Missing registrations</p>
              <p>❌ Unverified splits</p>
              <p className="wsc-note">
                <strong>TrapRoyaltiesPro fixes the problem upstream</strong>
              </p>
            </div>
            <div className="wsc-origin">
              <p>⏱️ Delayed royalties</p>
              <p>⚖️ Legal disputes</p>
              <p>💰 Lost revenue</p>
              <p>📋 Administrative overload</p>
            </div>
          </div>
          <div className="wsc-result">
            <p className="wsc-result-title">💰 The result</p>
            <div className="wsc-result-row">
              <span>✅ Cleaner submissions</span>
              <span>⚡ Faster royalty flows</span>
              <span>🔍 Verifiable ownership records</span>
              <span>🛡️ Reduced operational and legal risk</span>
            </div>
          </div>
        </div>

        <div className="wsc-built">
          <p className="wsc-built-title">🔒 Built for real-world workflows</p>
          <div className="wsc-built-row">
            <span>🚫 No forced integrations</span>
            <span>✋ No automatic data changes</span>
            <span>🎛️ Full user control</span>
            <span>📄 Audit-ready outputs</span>
          </div>
        </div>

        <div className="wsc-position">
          <div className="wsc-position-pill">
            ⚡ TrapRoyaltiesPro — Metadata Integrity &amp; Rights Verification Infrastructure
          </div>
        </div>

        <div className="wsc-footer-note">
          All demo data unless otherwise stated
          <br />
          &copy; 2026 TrapRoyaltiesPro
        </div>
      </div>
    </div>
  );
}
