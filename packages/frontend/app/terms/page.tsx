import Link from 'next/link'

const sectionTitle = 'text-[1.2rem] font-semibold mb-6 text-white border-l-4 border-[#a78bfa] pl-4'
const legalText = 'text-[#aaa] leading-[1.8] text-[0.95rem]'

export const metadata = { title: 'TrapRoyaltiesPro · Terms of Use' }

export default function TermsPage() {
  return (
    <div style={{ background: '#030303', color: '#e5e5e5', minHeight: '100vh' }}>

      {/* HEADER */}
      <header className="pt-32 pb-16 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-block bg-[#1a1a1a] border border-[#333] rounded-full px-5 py-1 text-[0.7rem] text-[#aaa] mb-6">
          Effective: March 15, 2026 · v2.1.0
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-6">
          Terms of Use
        </h1>
        <p className="text-gray-500 text-sm max-w-2xl mx-auto">TrapRoyaltiesPro · Binding Agreement</p>
      </header>

      {/* CONTENT */}
      <main className={`max-w-3xl mx-auto px-6 pb-32 ${legalText}`}>

        <p className="text-sm text-gray-600 border border-gray-900 p-4 rounded mb-12">
          By accessing or using TrapRoyaltiesPro, you agree to be bound by these Terms. If you are using our services on behalf of a law firm or label, you represent that you have authority to bind that entity.
        </p>

        <div className="mb-12">
          <h2 className={sectionTitle}>1. Acceptance</h2>
          <p>These Terms govern your use of the TrapRoyaltiesPro website, API, forensic tools, node software, and related services (the &quot;Service&quot;). By creating an account or using the Service, you acknowledge that you have read, understood, and agree to be bound.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>2. Accounts &amp; Eligibility</h2>
          <p>You must be at least 18 years old and have authority to bind your organization. You are responsible for maintaining the security of your account credentials and for all activities under your account. Notify us immediately of unauthorized use.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>3. Forensic &amp; Legal Services</h2>
          <p>TRP provides metadata auditing, split verification, and evidence documentation tools. We do not provide legal advice. Reports generated are tools for your use; you remain responsible for legal strategy and filing. &quot;Court‑admissible&quot; refers to evidentiary format — admissibility is ultimately determined by a court.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>4. Fees &amp; Subscriptions</h2>
          <p>Fees are as described on our pricing page. Unless otherwise stated, they are non‑refundable. We may change fees with 30 days notice. Enterprise plans are governed by separate agreements.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>5. Ownership of Your Data</h2>
          <p>You retain all rights to your ISRCs, splits, contracts, and statements. You grant us a license to process this data solely to provide the Service. We do not use your data for training AI models or any purpose beyond your direct instructions.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>6. Acceptable Use</h2>
          <p>You may not:</p>
          <ul className="list-disc pl-8 mt-2 space-y-1">
            <li>Use the Service for any illegal purpose</li>
            <li>Attempt to reverse‑engineer or abuse the node network</li>
            <li>Upload malicious files or attempt to breach security</li>
            <li>Use automated means to access the API beyond rate limits</li>
          </ul>
        </div>

        <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-6 my-8">
          <h2 className="text-white font-bold mb-3 text-lg">7. Disclaimer of Warranties</h2>
          <p className="text-gray-300 text-sm leading-relaxed">THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;. TRP DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON‑INFRINGEMENT. WE DO NOT GUARANTEE THAT AUDIT REPORTS WILL BE ACCEPTED BY ANY COURT OR PRO.</p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-6 my-8">
          <h2 className="text-white font-bold mb-3 text-lg">8. Limitation of Liability</h2>
          <p className="text-gray-300 text-sm leading-relaxed">TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRP SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS OR LOST DATA, ARISING OUT OF THESE TERMS OR USE OF THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY. OUR TOTAL LIABILITY SHALL NOT EXCEED THE FEES PAID IN THE PRIOR 12 MONTHS.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>9. Indemnification</h2>
          <p>You agree to indemnify TRP against claims arising from your misuse of the Service, violation of law, or infringement of third‑party rights.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>10. Termination</h2>
          <p>We may suspend or terminate your account for breach of these Terms. You may cancel at any time. Upon termination, your data will be deleted within 30 days unless required for legal holds.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>11. Governing Law</h2>
          <p>These Terms are governed by the laws of Sweden, without regard to conflict of law principles. Any dispute shall be resolved exclusively in the courts of Stockholm, Sweden.</p>
        </div>

        <div className="mb-12 p-6 bg-[#0a0a0a] border border-gray-900 rounded">
          <h2 className="text-white font-bold mb-3">📬 Legal Notices</h2>
          <p className="text-sm text-gray-400">
            Send legal correspondence to:<br />
            TrapRoyaltiesPro AB<br />
            Attn: Legal Department<br />
            Email: <a href="mailto:legal@traproyaltiespro.com" className="text-[#a78bfa] underline">legal@traproyaltiespro.com</a>
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
          <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link href="/terms" className="text-white">Terms</Link>
          <Link href="/data-addendum" className="hover:text-white transition">DPA</Link>
          <Link href="/cookies" className="hover:text-white transition">Cookies</Link>
        </div>
      </footer>
    </div>
  )
}
