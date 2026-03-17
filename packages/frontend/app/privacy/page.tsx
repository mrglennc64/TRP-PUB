import Link from 'next/link'

const sectionTitle = 'text-[1.2rem] font-semibold mb-6 text-white border-l-4 border-[#a78bfa] pl-4'
const legalText = 'text-[#aaa] leading-[1.8] text-[0.95rem]'

export const metadata = { title: 'TrapRoyaltiesPro · Privacy Policy' }

export default function PrivacyPage() {
  return (
    <div style={{ background: '#030303', color: '#e5e5e5', minHeight: '100vh' }}>

      {/* HEADER */}
      <header className="pt-32 pb-16 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-block bg-[#1a1a1a] border border-[#333] rounded-full px-5 py-1 text-[0.7rem] text-[#aaa] mb-6">
          Effective: March 15, 2026 · v2.1.0
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-6">
          Privacy Policy
        </h1>
        <p className="text-gray-500 text-sm max-w-2xl mx-auto">TrapRoyaltiesPro · Last updated 2026‑03‑15</p>
      </header>

      {/* CONTENT */}
      <main className={`max-w-3xl mx-auto px-6 pb-32 ${legalText}`}>

        <p className="text-sm text-gray-600 border border-gray-900 p-4 rounded mb-12">
          <span className="font-bold text-gray-300">GDPR · CCPA · Global Compliance</span> — This policy describes how TrapRoyaltiesPro collects, uses, and protects your data when you use our forensic platform, API, and related services.
        </p>

        <div className="mb-12">
          <h2 className={sectionTitle}>1. Scope &amp; Controller</h2>
          <p>TrapRoyaltiesPro (TRP) is the data controller for personal data collected through our website, API, node network, and legal portals. Our data protection officer can be reached at <a href="mailto:dpo@traproyaltiespro.com" className="text-[#a78bfa] underline underline-offset-[3px] hover:text-[#c4b5fd]">dpo@traproyaltiespro.com</a>.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>2. Data We Collect</h2>
          <p className="mb-3"><strong className="text-white font-semibold">2.1 Account &amp; Profile Data</strong><br />When you register for an attorney or label account, we collect name, email, firm/company name, and professional credentials. Payment information is processed by Stripe and not stored by us.</p>
          <p className="mb-3"><strong className="text-white font-semibold">2.2 Metadata &amp; Catalog Data</strong><br />All ISRCs, ISWCs, split sheets, contracts, and royalty statements you upload are processed solely for your internal use. This data remains yours and is never shared with third parties without your explicit instruction.</p>
          <p className="mb-3"><strong className="text-white font-semibold">2.3 Node Operator Data</strong><br />If you run an SMPT verification node, we collect node ID, IP address, stake wallet address (public), and uptime statistics — all used to maintain network integrity.</p>
          <p><strong className="text-white font-semibold">2.4 Technical Data</strong><br />IP addresses, browser fingerprints, and usage logs are collected for security and performance monitoring. Logs are anonymized after 14 days.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>3. Legal Basis (GDPR)</h2>
          <ul className="list-disc pl-8 space-y-1">
            <li><strong className="text-white font-semibold">Contract performance</strong> — Providing the forensic tools you request.</li>
            <li><strong className="text-white font-semibold">Legitimate interest</strong> — Network security, fraud prevention, product improvement.</li>
            <li><strong className="text-white font-semibold">Legal obligation</strong> — Compliance with court orders, anti‑money laundering checks.</li>
            <li><strong className="text-white font-semibold">Consent</strong> — Marketing communications (opt‑in only).</li>
          </ul>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>4. Data Sharing &amp; Third Parties</h2>
          <p>We do not sell your data. We share only as necessary for:</p>
          <ul className="list-disc pl-8 space-y-1 mt-2">
            <li><strong className="text-white font-semibold">PRO databases</strong> — When you initiate a cross‑reference check (e.g., ASCAP, BMI).</li>
            <li><strong className="text-white font-semibold">Legal authorities</strong> — If required by subpoena or court order.</li>
            <li><strong className="text-white font-semibold">Service providers</strong> — Hosting (Hostinger), email (SendGrid), payments (Stripe) — all GDPR‑compliant.</li>
          </ul>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>5. International Data Transfers</h2>
          <p>Your data is primarily processed on servers in the EU (Frankfurt/London). For transfers outside the EEA, we rely on Standard Contractual Clauses and adequacy decisions. Node operators outside the EU explicitly consent to cross‑border data transmission.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>6. Your Rights (GDPR / CCPA)</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-8 space-y-1 mt-2">
            <li><strong className="text-white font-semibold">Access</strong> — Request a copy of your personal data.</li>
            <li><strong className="text-white font-semibold">Rectification</strong> — Correct inaccurate information.</li>
            <li><strong className="text-white font-semibold">Erasure</strong> — Request deletion (subject to legal holds).</li>
            <li><strong className="text-white font-semibold">Restriction / Portability</strong> — Limit processing or receive data in machine‑readable format.</li>
            <li><strong className="text-white font-semibold">Object</strong> — Object to processing based on legitimate interests.</li>
          </ul>
          <p className="mt-3">To exercise rights, contact <a href="mailto:privacy@traproyaltiespro.com" className="text-[#a78bfa] underline underline-offset-[3px] hover:text-[#c4b5fd]">privacy@traproyaltiespro.com</a>. We respond within 30 days.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>7. Data Retention</h2>
          <ul className="list-disc pl-8 space-y-1">
            <li>Account data: retained until account deletion + 30 days grace.</li>
            <li>Uploaded royalty statements: 7 years (legal statute of limitations).</li>
            <li>Node operator logs: 90 days.</li>
            <li>On‑chain data (hashes) are permanent and cannot be deleted.</li>
          </ul>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>8. Cookies</h2>
          <p>We use only essential cookies for authentication and security. No tracking or advertising cookies are used. See our <Link href="/cookies" className="text-[#a78bfa] underline underline-offset-[3px] hover:text-[#c4b5fd]">Cookie Policy</Link> for details.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>9. Children&apos;s Privacy</h2>
          <p>TRP is not directed at individuals under 16. We do not knowingly collect data from children.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>10. Changes to This Policy</h2>
          <p>Material changes will be announced via email and website notice. Continued use after changes constitutes acceptance.</p>
        </div>

        <div className="mb-12 p-6 bg-[#0a0a0a] border border-gray-900 rounded">
          <h2 className="text-white font-bold mb-3">📬 Data Protection Contact</h2>
          <p className="text-sm text-gray-400">
            TrapRoyaltiesPro<br />
            Attn: Data Protection Officer<br />
            Email: <a href="mailto:dpo@traproyaltiespro.com" className="text-[#a78bfa] underline">dpo@traproyaltiespro.com</a><br />
            For California residents: CCPA requests to <a href="mailto:ccpa@traproyaltiespro.com" className="text-[#a78bfa] underline">ccpa@traproyaltiespro.com</a>
          </p>
        </div>

        <div className="text-center mt-20">
          <Link href="/" className="text-xs text-gray-600 hover:text-gray-400 transition uppercase tracking-widest">← Return to Home</Link>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-16 px-8 border-t border-gray-900 text-center">
        <div className="text-xs text-gray-600 font-bold uppercase tracking-[0.4em] mb-8">TrapRoyaltiesPro</div>
        <div className="flex justify-center gap-10 text-[10px] font-bold text-gray-500 uppercase">
          <Link href="/privacy" className="text-white">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition">Terms</Link>
          <Link href="/data-addendum" className="hover:text-white transition">DPA</Link>
          <Link href="/cookies" className="hover:text-white transition">Cookies</Link>
        </div>
      </footer>
    </div>
  )
}
