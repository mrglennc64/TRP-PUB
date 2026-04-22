import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'TrapRoyaltiesPro · Recover Missing Royalties from Your Catalog',
  description:
    "You're getting streams. You're not getting paid for all of them. TrapRoyaltiesPro identifies blocked revenue, unmatched recordings, and metadata gaps across DSPs, PROs, MLC, SoundExchange, and foreign societies.",
};

const CSS = `
.lp-root { --bg:#020617; --bg-elev:#0f172a; --bg-card:#1e293b; --border-subtle:rgba(255,255,255,0.08); --border-mid:rgba(255,255,255,0.1); --accent:#6366f1; --accent-hi:#818cf8; --accent-soft:rgba(99,102,241,0.14); --text-main:#f1f5f9; --text-muted:#cbd5e1; --text-soft:#64748b; --danger:#f43f5e; --success:#10b981; --gold:#facc15;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: radial-gradient(circle at 50% 0%, #1e293b 0, #0f172a 30%, #020617 70%);
  color: var(--text-main);
  min-height: 100vh;
  padding-bottom: 1px;
}
.lp-root *, .lp-root *::before, .lp-root *::after { box-sizing: border-box; }
.lp-root a { color: inherit; text-decoration: none; }
.lp-page { max-width: 1200px; margin: 0 auto; padding: 28px 20px 64px; }

.lp-hero-eyebrow { display:inline-flex; align-items:center; gap:8px; font-size:12px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#c7d2fe; background:var(--accent-soft); border:1px solid rgba(99,102,241,0.4); padding:7px 14px; border-radius:999px; margin-bottom:20px; }

.lp-hero { display:grid; grid-template-columns: minmax(0,1.4fr) minmax(0,1fr); gap:40px; align-items:center; margin-bottom:56px; }
.lp-hero-title { font-size:44px; line-height:1.1; font-weight:700; letter-spacing:-0.02em; margin:0 0 18px; }
.lp-hero-title .accent { background: linear-gradient(135deg,#818cf8,#6366f1); background-clip:text; -webkit-background-clip:text; color:transparent; }
.lp-hero-sub { font-size:17px; line-height:1.6; color:var(--text-muted); max-width:560px; margin:0 0 22px; }
.lp-hero-ctas { display:flex; flex-wrap:wrap; gap:12px; margin-bottom:18px; }
.lp-btn-primary { padding:13px 22px; border-radius:999px; background:var(--accent); color:#fff !important; font-size:14px; font-weight:700; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:8px; transition:filter 0.15s; }
.lp-btn-primary:hover { filter:brightness(1.15); }
.lp-btn-secondary { padding:12px 18px; border-radius:999px; background:rgba(17,17,25,0.9); color:var(--text-main); font-size:14px; font-weight:600; border:1px solid var(--border-subtle); cursor:pointer; display:inline-flex; align-items:center; gap:8px; }
.lp-btn-secondary:hover { border-color:var(--accent); color:#fff; }
.lp-hero-footnote { font-size:12px; color:var(--text-soft); }

.lp-hero-panel { background: linear-gradient(155deg, rgba(99,102,241,0.16) 0%, rgba(10,10,20,0.9) 60%); border-radius:20px; border:1px solid rgba(129,140,248,0.28); padding:26px 24px; box-shadow: 0 30px 70px rgba(99,102,241,0.18), 0 0 60px rgba(99,102,241,0.12); position:relative; overflow:hidden; }
.lp-hero-panel::before { content:''; position:absolute; top:-100px; right:-100px; width:260px; height:260px; background:radial-gradient(circle,rgba(129,140,248,0.35) 0%,transparent 70%); border-radius:50%; pointer-events:none; }
.lp-hero-panel-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; position:relative; }
.lp-hero-panel-title { font-size:12px; color:var(--text-soft); letter-spacing:0.04em; text-transform:uppercase; font-weight:700; }
.lp-hero-panel-pill { font-size:11px; padding:4px 10px; border-radius:999px; background:var(--accent-soft); color:#c7d2fe; border:1px solid rgba(99,102,241,0.45); font-weight:600; }
.lp-hero-panel-amount-lbl { font-size:12px; color:var(--text-soft); text-transform:uppercase; letter-spacing:0.1em; font-weight:700; margin-bottom:6px; }
.lp-hero-panel-amount { font-size:44px; font-weight:800; letter-spacing:-0.03em; line-height:1; color:#fff; text-shadow: 0 0 28px rgba(129,140,248,0.45); margin-bottom:6px; }
.lp-hero-panel-amount-sub { font-size:13px; color:var(--text-muted); margin-bottom:16px; }
.lp-hero-panel-tags { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px; }
.lp-hero-panel-tag { padding:5px 10px; border-radius:999px; border:1px solid rgba(129,140,248,0.3); font-size:11px; color:#c7d2fe; background:rgba(99,102,241,0.08); font-weight:600; }
.lp-hero-panel-score { display:flex; justify-content:space-between; align-items:center; padding-top:14px; border-top:1px solid rgba(129,140,248,0.2); }
.lp-hero-panel-score-lbl { font-size:12px; color:var(--text-soft); }
.lp-hero-panel-score-val { font-size:16px; font-weight:700; color:#fff; }
.lp-hero-panel-score-val span { color:var(--danger); }
.lp-hero-panel-footer { margin-top:14px; font-size:11px; color:var(--text-soft); line-height:1.5; }

.lp-likely { margin-top:12px; margin-bottom:48px; background:var(--bg-elev); border:1px solid var(--border-subtle); border-radius:18px; padding:28px 26px; }
.lp-likely h2 { font-size:22px; font-weight:700; margin:0 0 6px; letter-spacing:-0.01em; color:#fff; }
.lp-likely-lead { font-size:14px; color:var(--text-muted); margin:0 0 18px; max-width:640px; }
.lp-likely-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(240px,1fr)); gap:10px; margin-bottom:18px; }
.lp-likely-item { display:flex; align-items:flex-start; gap:10px; padding:12px 14px; background:rgba(244,63,94,0.06); border:1px solid rgba(244,63,94,0.18); border-radius:10px; font-size:13px; color:#fda4af; font-weight:500; }
.lp-likely-item svg { color:var(--danger); flex-shrink:0; margin-top:2px; }
.lp-likely-kicker { background: linear-gradient(90deg, rgba(250,204,21,0.12), rgba(244,63,94,0.08)); border:1px solid rgba(250,204,21,0.28); border-radius:10px; padding:14px 18px; font-size:15px; font-weight:700; color:#facc15; text-align:center; }

.lp-section { margin-top:64px; }
.lp-section-header { margin-bottom:22px; }
.lp-section-title { font-size:26px; font-weight:700; margin:0 0 8px; letter-spacing:-0.02em; color:#fff; }
.lp-section-sub { font-size:15px; color:var(--text-muted); max-width:680px; margin:0; }

.lp-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(240px,1fr)); gap:18px; }
.lp-card { background:var(--bg-card); border-radius:14px; border:1px solid var(--border-subtle); padding:20px 18px; font-size:13px; color:var(--text-muted); line-height:1.55; }
.lp-card h3 { margin:0 0 8px; font-size:15px; color:#fff; font-weight:700; letter-spacing:-0.005em; }
.lp-card-step { display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border-radius:8px; background:var(--accent-soft); border:1px solid rgba(99,102,241,0.35); color:#c7d2fe; font-size:12px; font-weight:800; margin-bottom:12px; }
.lp-card-metric { font-size:24px; font-weight:800; margin:2px 0 4px; color:#fff; letter-spacing:-0.02em; }
.lp-card-metric.gold { color:var(--gold); text-shadow: 0 0 18px rgba(250,204,21,0.35); }
.lp-card-label { font-size:12px; color:var(--text-soft); margin-bottom:10px; font-weight:600; }
.lp-card p { margin:0; }

.lp-dominant { margin-top:20px; background: linear-gradient(140deg, rgba(129,140,248,0.18) 0%, rgba(10,10,25,0.92) 60%); border-radius:22px; border:1px solid rgba(129,140,248,0.32); padding:40px 38px; position:relative; overflow:hidden; box-shadow: 0 30px 80px rgba(99,102,241,0.22), 0 0 60px rgba(129,140,248,0.12); }
.lp-dominant::before { content:''; position:absolute; top:-120px; right:-60px; width:320px; height:320px; background:radial-gradient(circle,rgba(129,140,248,0.28) 0%,transparent 70%); border-radius:50%; pointer-events:none; }
.lp-dominant-inner { position:relative; display:grid; grid-template-columns:1.2fr 1fr; gap:36px; align-items:center; }
.lp-dominant-eye { display:inline-block; font-size:11px; font-weight:800; letter-spacing:0.14em; text-transform:uppercase; color:#c7d2fe; background:rgba(99,102,241,0.18); border:1px solid rgba(129,140,248,0.4); padding:5px 12px; border-radius:999px; margin-bottom:14px; }
.lp-dominant h2 { font-size:28px; font-weight:800; letter-spacing:-0.02em; margin:0 0 8px; color:#fff; }
.lp-dominant-sub { font-size:14px; color:var(--text-muted); margin:0 0 16px; }
.lp-dominant-number { font-size:64px; font-weight:900; letter-spacing:-0.04em; line-height:1; color:#fff; text-shadow: 0 0 40px rgba(129,140,248,0.55); margin-bottom:6px; }
.lp-dominant-caption { font-size:13px; color:var(--text-muted); margin-bottom:14px; }
.lp-dominant-break { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
.lp-dominant-break-cell { background:rgba(255,255,255,0.04); border:1px solid rgba(129,140,248,0.18); border-radius:10px; padding:10px 12px; }
.lp-dominant-break-cell .bn-lbl { font-size:10px; text-transform:uppercase; letter-spacing:0.1em; color:var(--text-soft); font-weight:700; margin-bottom:2px; }
.lp-dominant-break-cell .bn-val { font-size:16px; font-weight:700; color:#fff; }

.lp-before-after { display:grid; grid-template-columns: repeat(auto-fit, minmax(280px,1fr)); gap:20px; }
.lp-ba-col { background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:14px; padding:20px 20px; }
.lp-ba-col.before { border-color: rgba(244,63,94,0.25); }
.lp-ba-col.after { border-color: rgba(99,102,241,0.35); }
.lp-ba-col h3 { margin:0 0 12px; font-size:15px; font-weight:800; letter-spacing:0.02em; text-transform:uppercase; }
.lp-ba-col.before h3 { color:var(--danger); }
.lp-ba-col.after h3 { color:#c7d2fe; }
.lp-ba-col ul { list-style:none; padding:0; margin:0; font-size:13px; color:var(--text-muted); }
.lp-ba-col li { padding:8px 0 8px 26px; position:relative; border-bottom:1px dashed rgba(255,255,255,0.06); }
.lp-ba-col li:last-child { border-bottom:0; }
.lp-ba-col li svg { position:absolute; left:0; top:10px; }
.lp-ba-col.before li svg { color:var(--danger); }
.lp-ba-col.after li svg { color:#6ee7b7; }

.lp-trust-strip { margin-top:44px; display:flex; justify-content:center; flex-wrap:wrap; gap:10px 16px; padding:18px 20px; background:rgba(17,17,25,0.6); border:1px solid var(--border-subtle); border-radius:14px; }
.lp-trust-strip span { font-size:12px; color:var(--text-muted); display:inline-flex; align-items:center; gap:6px; font-weight:600; }
.lp-trust-strip svg { color:#6ee7b7; }

.lp-workspaces { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
.lp-ws-card { background: linear-gradient(160deg, rgba(99,102,241,0.08) 0%, var(--bg-card) 70%); border-radius:16px; border:1px solid var(--border-subtle); padding:24px 22px; }
.lp-ws-card h3 { font-size:17px; font-weight:700; color:#fff; margin:0 0 4px; letter-spacing:-0.01em; }
.lp-ws-card .ws-focus { font-size:13px; color:var(--text-soft); margin:0 0 12px; }
.lp-ws-card ul { list-style:none; padding:0; margin:0 0 16px; font-size:13px; color:var(--text-muted); }
.lp-ws-card li { padding:4px 0 4px 20px; position:relative; }
.lp-ws-card li svg { position:absolute; left:0; top:6px; color:#6ee7b7; }
.lp-ws-btn { display:inline-flex; align-items:center; gap:6px; font-size:13px; color:#c7d2fe; font-weight:700; padding:8px 14px; border:1px solid rgba(129,140,248,0.4); border-radius:999px; background:rgba(99,102,241,0.1); }
.lp-ws-btn:hover { background:rgba(99,102,241,0.2); color:#fff; }

.lp-pricing { display:grid; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); gap:18px; }
.lp-pricing-card { background:var(--bg-card); border-radius:14px; border:1px solid var(--border-subtle); padding:22px 20px; font-size:13px; color:var(--text-muted); line-height:1.55; position:relative; }
.lp-pricing-card.featured { border-color: rgba(129,140,248,0.45); background: linear-gradient(160deg, rgba(99,102,241,0.12) 0%, var(--bg-card) 70%); }
.lp-pricing-tag { display:inline-block; font-size:10px; padding:3px 9px; border-radius:999px; border:1px solid var(--border-subtle); color:var(--text-soft); margin-bottom:10px; letter-spacing:0.06em; text-transform:uppercase; font-weight:700; }
.lp-pricing-tag.hot { border-color: rgba(129,140,248,0.5); color:#c7d2fe; background:var(--accent-soft); }
.lp-pricing-card h3 { margin:0 0 8px; font-size:17px; color:#fff; font-weight:800; }

.lp-final { margin-top:56px; text-align:center; padding:44px 30px; background: linear-gradient(140deg, rgba(99,102,241,0.16) 0%, rgba(10,10,25,0.9) 60%); border:1px solid rgba(129,140,248,0.32); border-radius:20px; }
.lp-final h2 { font-size:28px; font-weight:800; color:#fff; margin:0 0 10px; letter-spacing:-0.01em; }
.lp-final p { font-size:14px; color:var(--text-muted); margin:0 0 20px; }
.lp-final-ctas { display:inline-flex; gap:12px; flex-wrap:wrap; justify-content:center; }

.lp-footer { margin-top:44px; padding-top:22px; border-top:1px solid rgba(255,255,255,0.06); font-size:12px; color:var(--text-soft); text-align:center; }
.lp-footer .pos { display:inline-block; margin-bottom:6px; font-weight:600; color:var(--text-muted); }

@media (max-width:880px){
  .lp-hero { grid-template-columns: 1fr; gap:24px; }
  .lp-hero-title { font-size:30px; }
  .lp-dominant-inner { grid-template-columns:1fr; gap:20px; }
  .lp-dominant-number { font-size:44px; }
  .lp-workspaces { grid-template-columns:1fr; }
  .lp-section-title, .lp-dominant h2, .lp-final h2 { font-size:22px; }
}
`;

const PATHS: Record<string, ReactNode> = {
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </>
  ),
  check: <path d="M5 12l4 4 10-10" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-6" />
    </>
  ),
  x: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ),
  alert: (
    <>
      <path d="M10.3 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  shield: <path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" />,
  bolt: <path d="M13 3L4 14h7l-1 7 9-12h-7l1-6z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 010 18" />
      <path d="M12 3a15 15 0 000 18" />
    </>
  ),
  doc: (
    <>
      <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z" />
      <path d="M14 3v6h6" />
    </>
  ),
  scales: (
    <>
      <path d="M12 3v18" />
      <path d="M5 6h14" />
      <path d="M5 6l-2 6a3 3 0 006 0z" />
      <path d="M19 6l-2 6a3 3 0 006 0z" />
      <path d="M8 21h8" />
    </>
  ),
};

function Icon({ name, size = 16, className = '' }: { name: keyof typeof PATHS; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="lp-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="lp-page">

        {/* HERO */}
        <section className="lp-hero">
          <div>
            <span className="lp-hero-eyebrow">
              <Icon name="bolt" size={14} />
              Royalty Intelligence for Modern Catalogs
            </span>
            <h1 className="lp-hero-title">
              You&rsquo;re getting streams.<br />
              <span className="accent">You&rsquo;re not getting paid for all of them.</span>
            </h1>
            <p className="lp-hero-sub">
              TrapRoyaltiesPro identifies <strong style={{ color: '#fff' }}>blocked revenue</strong>, unmatched
              recordings, and metadata gaps across DSPs, PROs, MLC, SoundExchange, and foreign
              societies &mdash; then turns each one into recovered income.
            </p>

            <div className="lp-hero-ctas">
              <a className="lp-btn-primary" href="/publisher-portal/pages/cleaning-wizard.html">
                Scan My Catalog for Missing Royalties <Icon name="arrowRight" size={16} />
              </a>
              <a className="lp-btn-secondary" href="mailto:hello@traproyaltiespro.com?subject=TrapRoyaltiesPro%20demo">
                See Demo
              </a>
            </div>

            <div className="lp-hero-footnote">
              No integrations. CWR, DDEX, Excel, or split sheets accepted. Confidential.
            </div>
          </div>

          <aside className="lp-hero-panel" aria-label="Example catalog scan summary">
            <div className="lp-hero-panel-header">
              <div className="lp-hero-panel-title">Revenue currently not reaching you</div>
              <div className="lp-hero-panel-pill">Catalog scan sample</div>
            </div>
            <div className="lp-hero-panel-amount-lbl">Estimated unpaid royalties</div>
            <div className="lp-hero-panel-amount">$47,000</div>
            <div className="lp-hero-panel-amount-sub">Across 3 collection points, 12 tracks, 18,000 streams.</div>
            <div className="lp-hero-panel-tags">
              <span className="lp-hero-panel-tag">SoundExchange</span>
              <span className="lp-hero-panel-tag">Foreign societies</span>
              <span className="lp-hero-panel-tag">Unmatched ISRCs</span>
            </div>
            <div className="lp-hero-panel-score">
              <div className="lp-hero-panel-score-lbl">Royalty confidence</div>
              <div className="lp-hero-panel-score-val">
                Only <span>61%</span> of this catalog is actually getting paid
              </div>
            </div>
            <div className="lp-hero-panel-footer">
              Unmatched ISRCs &middot; Missing contributors &middot; Foreign society gaps &middot; Neighboring rights
            </div>
          </aside>
        </section>

        {/* WHO IT'S FOR */}
        <section id="who" className="lp-section">
          <div className="lp-section-header">
            <h2 className="lp-section-title">Built for operations and legal workflows</h2>
            <p className="lp-section-sub">
              For teams who need defensible, auditable answers &mdash; not dashboards that look good and stop there.
            </p>
          </div>
          <div className="lp-workspaces">
            <div className="lp-ws-card">
              <h3>Publishers &amp; rights teams</h3>
              <div className="ws-focus">Fix metadata &middot; prevent revenue delays</div>
              <ul>
                <li><Icon name="check" size={14} /> Clean submissions to CMOs and DSPs</li>
                <li><Icon name="check" size={14} /> Faster payouts, fewer rejections</li>
                <li><Icon name="check" size={14} /> Continuous catalog health tracking</li>
                <li><Icon name="check" size={14} /> PRO-ready CWR v2.1 exports</li>
              </ul>
              <a href="/publisher-portal" className="lp-ws-btn">Enter Publishing Portal <Icon name="arrowRight" size={14} /></a>
            </div>
            <div className="lp-ws-card">
              <h3>Attorneys &amp; forensic advisors</h3>
              <div className="ws-focus">Verify ownership &middot; protect rights</div>
              <ul>
                <li><Icon name="check" size={14} /> Chain-of-title verification</li>
                <li><Icon name="check" size={14} /> Legal documentation &amp; packets</li>
                <li><Icon name="check" size={14} /> Dispute readiness</li>
                <li><Icon name="check" size={14} /> Exportable forensic reports</li>
              </ul>
              <a href="/forensic" className="lp-ws-btn">Enter Attorney Portal <Icon name="arrowRight" size={14} /></a>
            </div>
          </div>
        </section>

        {/* WHAT YOU'RE LIKELY MISSING */}
        <section className="lp-likely">
          <h2>What You&rsquo;re Likely Missing Right Now</h2>
          <p className="lp-likely-lead">
            These are the revenue leaks we surface in almost every catalog &mdash; quiet, systemic,
            and usually unseen until the money is already gone.
          </p>
          <div className="lp-likely-grid">
            <div className="lp-likely-item"><Icon name="alert" size={16} /> Unregistered SoundExchange recordings</div>
            <div className="lp-likely-item"><Icon name="alert" size={16} /> Missing ISRC matches blocking payouts</div>
            <div className="lp-likely-item"><Icon name="alert" size={16} /> Foreign royalties not routed correctly</div>
            <div className="lp-likely-item"><Icon name="alert" size={16} /> Neighboring rights not collected</div>
            <div className="lp-likely-item"><Icon name="alert" size={16} /> Metadata mismatches preventing distribution</div>
          </div>
          <div className="lp-likely-kicker">
            Most catalogs we scan have <span style={{ color: '#fff' }}>20&ndash;40% revenue leakage.</span>
          </div>
        </section>

        {/* TRUST STRIP */}
        <div className="lp-trust-strip">
          <span><Icon name="checkCircle" size={14} /> Built for publishers, rights teams, and catalog owners</span>
          <span><Icon name="checkCircle" size={14} /> Supports CWR, DDEX, and PRO workflows</span>
          <span><Icon name="checkCircle" size={14} /> Used across US &amp; EU rights ecosystems</span>
        </div>

        {/* HOW IT WORKS */}
        <section id="how" className="lp-section">
          <div className="lp-section-header">
            <h2 className="lp-section-title">How TrapRoyaltiesPro recovers your royalties</h2>
            <p className="lp-section-sub">
              A structured, audit-ready workflow that identifies blocked revenue and prepares
              your catalog for clean, compliant registrations.
            </p>
          </div>
          <div className="lp-grid">
            <div className="lp-card">
              <span className="lp-card-step">01</span>
              <h3>Upload your catalog</h3>
              <p>Works in CWR, DDEX, Excel, or split sheet format. No engineering or system integration.</p>
            </div>
            <div className="lp-card">
              <span className="lp-card-step">02</span>
              <h3>We identify blocked revenue</h3>
              <p>Unmatched ISRCs, missing contributors, foreign society gaps, neighboring rights issues, and structural metadata problems.</p>
            </div>
            <div className="lp-card">
              <span className="lp-card-step">03</span>
              <h3>See where money is trapped</h3>
              <p>Financial impact view, confidence score, and platform-level breakdown of where royalties are not reaching you.</p>
            </div>
            <div className="lp-card">
              <span className="lp-card-step">04</span>
              <h3>Unlock unpaid earnings</h3>
              <p>Upgrade for guided metadata cleaning, PRO-ready CWR generation, and task lists your team can execute.</p>
            </div>
          </div>
        </section>

        {/* DOMINANT: ESTIMATED MISSING REVENUE */}
        <section id="insights" className="lp-section">
          <div className="lp-dominant">
            <div className="lp-dominant-inner">
              <div>
                <span className="lp-dominant-eye">Estimated Missing Revenue</span>
                <h2>This is what a typical scan uncovers.</h2>
                <p className="lp-dominant-sub">
                  A live scan of one mid-size publishing catalog. Your numbers will vary &mdash; but the pattern rarely does.
                </p>
                <div className="lp-dominant-number">$47,000</div>
                <div className="lp-dominant-caption">in royalties currently not reaching this catalog.</div>
                <a className="lp-btn-primary" href="/publisher-portal/pages/cleaning-wizard.html">
                  See what your catalog is missing <Icon name="arrowRight" size={16} />
                </a>
              </div>
              <div className="lp-dominant-break">
                <div className="lp-dominant-break-cell">
                  <div className="bn-lbl">Catalog size</div>
                  <div className="bn-val">48 works</div>
                </div>
                <div className="lp-dominant-break-cell">
                  <div className="bn-lbl">Getting paid</div>
                  <div className="bn-val">61%</div>
                </div>
                <div className="lp-dominant-break-cell">
                  <div className="bn-lbl">Unmatched recordings</div>
                  <div className="bn-val">14</div>
                </div>
                <div className="lp-dominant-break-cell">
                  <div className="bn-lbl">Annual potential</div>
                  <div className="bn-val">$10k&ndash;$25k</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SUBMISSION READINESS */}
        <section className="lp-section">
          <div className="lp-section-header">
            <h2 className="lp-section-title">Submission readiness &amp; metadata health</h2>
            <p className="lp-section-sub">
              Your free scan doesn&rsquo;t just show missing money. It also reveals how close your catalog is to being clean, compliant, and registration-ready.
            </p>
          </div>
          <div className="lp-grid">
            <div className="lp-card">
              <h3>Overall health score</h3>
              <div className="lp-card-metric gold">73 / 100</div>
              <div className="lp-card-label">Needs minor fixes before submission</div>
              <p>A single score summarizing metadata completeness and registration readiness across your catalog.</p>
            </div>
            <div className="lp-card">
              <h3>CWR readiness</h3>
              <div className="lp-card-metric">37 of 48 works</div>
              <div className="lp-card-label">Clean enough to submit</div>
              <p>Separates works that are ready to move into registration from those that will trigger rejections.</p>
            </div>
            <div className="lp-card">
              <h3>Issue breakdown</h3>
              <div className="lp-card-label">Examples of blocking issues</div>
              <p>Missing ISWC, missing publishers, missing writers, broken shares, invalid IPIs, and duplicate works &mdash; each with clear counts.</p>
            </div>
          </div>
        </section>

        {/* BEFORE / AFTER */}
        <section className="lp-section">
          <div className="lp-section-header">
            <h2 className="lp-section-title">Before and after TrapRoyaltiesPro</h2>
            <p className="lp-section-sub">The difference is not just visibility &mdash; it&rsquo;s the ability to act on what you see with confidence.</p>
          </div>
          <div className="lp-before-after">
            <div className="lp-ba-col before">
              <h3>Before</h3>
              <ul>
                <li><Icon name="x" size={14} /> Unmatched ISRCs across platforms</li>
                <li><Icon name="x" size={14} /> Inconsistent writer &amp; publisher data</li>
                <li><Icon name="x" size={14} /> Broken splits, unclear chain-of-title</li>
                <li><Icon name="x" size={14} /> Rejections &amp; delays from societies</li>
                <li><Icon name="x" size={14} /> Manual spreadsheet work, no priority</li>
              </ul>
            </div>
            <div className="lp-ba-col after">
              <h3>After</h3>
              <ul>
                <li><Icon name="check" size={14} /> Structured view of blocked royalties</li>
                <li><Icon name="check" size={14} /> Clean, registration-aligned metadata</li>
                <li><Icon name="check" size={14} /> Higher match rates, fewer rejections</li>
                <li><Icon name="check" size={14} /> Submission-ready CWR exports</li>
                <li><Icon name="check" size={14} /> Prioritized task lists your team can ship</li>
              </ul>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="lp-section">
          <div className="lp-section-header">
            <h2 className="lp-section-title">Simple, transparent tiers</h2>
            <p className="lp-section-sub">Start with a free scan. Upgrade when you&rsquo;re ready to operationalize recovery and run ongoing workflows.</p>
          </div>
          <div className="lp-pricing">
            <div className="lp-pricing-card">
              <span className="lp-pricing-tag">Entry</span>
              <h3>Free Scan</h3>
              <p>High-level royalty gaps, readiness score, issue breakdown, and a sample of work-level findings.</p>
            </div>
            <div className="lp-pricing-card featured">
              <span className="lp-pricing-tag hot">Most popular</span>
              <h3>Pro</h3>
              <p>Full fix-it workflow, complete work-level detail, guided metadata cleaning, and PRO-ready CWR exports.</p>
            </div>
            <div className="lp-pricing-card">
              <span className="lp-pricing-tag">For teams</span>
              <h3>Enterprise</h3>
              <p>High-volume catalogs, multi-stakeholder workflows, legal &amp; audit use cases, dedicated implementation support.</p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="lp-final">
          <h2>Your catalog is almost certainly leaving money on the table.</h2>
          <p>Run a free scan. See the number. Then decide what to do next.</p>
          <div className="lp-final-ctas">
            <a className="lp-btn-primary" href="/publisher-portal/pages/cleaning-wizard.html">
              Scan My Catalog for Missing Royalties <Icon name="arrowRight" size={16} />
            </a>
            <a className="lp-btn-secondary" href="mailto:hello@traproyaltiespro.com?subject=TrapRoyaltiesPro%20demo">
              See Demo
            </a>
          </div>
        </section>

        <div className="lp-footer">
          <div className="pos">TrapRoyaltiesPro &middot; Royalty Intelligence &amp; Metadata Health Infrastructure</div>
          <div>All example figures illustrative unless otherwise stated &middot; &copy; 2026 TrapRoyaltiesPro</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
