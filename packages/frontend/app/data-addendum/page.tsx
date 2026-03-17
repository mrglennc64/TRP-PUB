import Link from 'next/link'

const sectionTitle = 'text-[1.2rem] font-semibold mb-6 text-white border-l-4 border-[#a78bfa] pl-4'
const legalText = 'text-[#aaa] leading-[1.8] text-[0.95rem]'

export const metadata = { title: 'TRP · Data Protection Addendum' }

export default function DataAddendumPage() {
  return (
    <div style={{ background: '#030303', color: '#e5e5e5', minHeight: '100vh' }}>

      {/* HEADER */}
      <header className="pt-32 pb-16 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-block bg-[#1a1a1a] border border-[#333] rounded-full px-5 py-1 text-[0.7rem] text-[#aaa] mb-6">
          Effective: March 15, 2026 · GDPR Ready
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-6">
          Data Protection Addendum
        </h1>
        <p className="text-gray-500 text-sm">For EU/UK customers · Incorporates Standard Contractual Clauses</p>
      </header>

      {/* CONTENT */}
      <main className={`max-w-3xl mx-auto px-6 pb-32 ${legalText}`}>

        <p className="text-sm text-gray-600 border border-gray-900 p-4 rounded mb-12">
          This DPA forms part of the Terms of Service between TrapRoyaltiesPro and you (the Controller) when processing EU/UK personal data.
        </p>

        <div className="mb-12">
          <h2 className={sectionTitle}>1. Definitions</h2>
          <p>&quot;Controller&quot;, &quot;Processor&quot;, &quot;Personal Data&quot;, &quot;Processing&quot;, &quot;Subprocessor&quot; have the meanings given in the GDPR (Regulation 2016/679).</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>2. Processing Details</h2>
          <p>
            <strong className="text-white font-semibold">Subject matter:</strong> Royalty auditing, split verification, and forensic documentation.<br />
            <strong className="text-white font-semibold">Duration:</strong> Until account termination + 7 years legal hold.<br />
            <strong className="text-white font-semibold">Categories of data:</strong> Names, IPI numbers, email, royalty statements, contracts.<br />
            <strong className="text-white font-semibold">Purpose:</strong> Providing the Service as requested by Controller.
          </p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>3. Processor Obligations</h2>
          <ul className="list-disc pl-8 space-y-1">
            <li>Process only on Controller&apos;s documented instructions.</li>
            <li>Ensure confidentiality of personnel.</li>
            <li>Implement appropriate technical/organisational measures (Art. 32).</li>
            <li>Assist Controller in responding to data subject requests.</li>
            <li>Notify Controller of any personal data breach without undue delay.</li>
            <li>Return or delete data at termination.</li>
          </ul>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>4. Subprocessors</h2>
          <p>Controller authorizes engagement of subprocessors listed below. Notice of changes will be given (30 days) and Controller may object.</p>
          <ul className="list-disc pl-8 mt-2 space-y-1">
            <li><strong className="text-white font-semibold">Hostinger</strong> (infrastructure) – EU</li>
            <li><strong className="text-white font-semibold">Stripe</strong> (payments) – USA (Privacy Shield)</li>
            <li><strong className="text-white font-semibold">SendGrid</strong> (email) – USA (SCCs)</li>
            <li><strong className="text-white font-semibold">PostgreSQL</strong> (database) – EU</li>
          </ul>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>5. Data Subject Rights</h2>
          <p>Processor shall provide Controller with tools to access, rectify, delete, or port data via the dashboard. For complex requests, Processor will assist as required by Art. 28.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>6. International Transfers</h2>
          <p>For transfers from EEA to third countries, the parties enter into the EU Standard Contractual Clauses (Module 2 – Controller to Processor). Controller acknowledges that transfers to Hostinger servers within EEA remain intra‑EU.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>7. Audit Rights</h2>
          <p>Controller may request an audit (at Controller&apos;s expense) of Processor&apos;s compliance, limited to once per year. Processor may provide a SOC2 report in lieu of on‑site audit.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>8. Liability</h2>
          <p>Each party&apos;s liability under this DPA is subject to the limitations in the Terms of Service. Processor&apos;s liability shall be several, not joint.</p>
        </div>

        <div className="mb-12 p-6 bg-[#0a0a0a] border border-gray-900 rounded">
          <h2 className="text-white font-bold mb-3">📬 DPA Execution</h2>
          <p className="text-sm text-gray-400">
            By using the Service, you agree to this DPA. For signed copies, email <a href="mailto:dpa@traproyaltiespro.com" className="text-[#a78bfa] underline">dpa@traproyaltiespro.com</a>.
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
          <Link href="/terms" className="hover:text-white transition">Terms</Link>
          <Link href="/data-addendum" className="text-white">DPA</Link>
          <Link href="/cookies" className="hover:text-white transition">Cookies</Link>
        </div>
      </footer>
    </div>
  )
}
