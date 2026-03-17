import Link from 'next/link'

const sectionTitle = 'text-[1.2rem] font-semibold mb-6 text-white border-l-4 border-[#a78bfa] pl-4'
const legalText = 'text-[#aaa] leading-[1.8] text-[0.95rem]'

export const metadata = { title: 'TRP · Cookie Policy' }

export default function CookiesPage() {
  return (
    <div style={{ background: '#030303', color: '#e5e5e5', minHeight: '100vh' }}>

      {/* HEADER */}
      <header className="pt-32 pb-16 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-block bg-[#1a1a1a] border border-[#333] rounded-full px-5 py-1 text-[0.7rem] text-[#aaa] mb-6">
          Last updated: March 2026
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-6">
          Cookie Policy
        </h1>
        <p className="text-gray-500 text-sm">How we use cookies and similar technologies</p>
      </header>

      {/* CONTENT */}
      <main className={`max-w-3xl mx-auto px-6 pb-32 ${legalText}`}>

        <p className="text-sm text-gray-600 border border-gray-900 p-4 rounded mb-12">
          TrapRoyaltiesPro uses only essential cookies. We do not use tracking or advertising cookies.
        </p>

        <div className="mb-12">
          <h2 className={sectionTitle}>1. What Are Cookies</h2>
          <p>Cookies are small text files stored on your device. They help us keep you logged in, remember your preferences, and secure your session.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>2. Cookies We Use</h2>
          <div className="overflow-x-auto my-6">
            <table className="w-full border-collapse text-[0.9rem]">
              <thead>
                <tr>
                  <th className="bg-[#1a1a1a] text-[#ddd] px-3 py-3 text-left border-b-2 border-[#333]">Name</th>
                  <th className="bg-[#1a1a1a] text-[#ddd] px-3 py-3 text-left border-b-2 border-[#333]">Purpose</th>
                  <th className="bg-[#1a1a1a] text-[#ddd] px-3 py-3 text-left border-b-2 border-[#333]">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-3 border-b border-[#2a2a2a] text-[#bbb]">sessionid</td>
                  <td className="px-3 py-3 border-b border-[#2a2a2a] text-[#bbb]">Maintains your logged‑in session</td>
                  <td className="px-3 py-3 border-b border-[#2a2a2a] text-[#bbb]">Session</td>
                </tr>
                <tr>
                  <td className="px-3 py-3 border-b border-[#2a2a2a] text-[#bbb]">csrf_token</td>
                  <td className="px-3 py-3 border-b border-[#2a2a2a] text-[#bbb]">Prevents cross‑site request forgery</td>
                  <td className="px-3 py-3 border-b border-[#2a2a2a] text-[#bbb]">Session</td>
                </tr>
                <tr>
                  <td className="px-3 py-3 border-b border-[#2a2a2a] text-[#bbb]">preferences</td>
                  <td className="px-3 py-3 border-b border-[#2a2a2a] text-[#bbb]">Stores UI preferences (dark mode, etc.)</td>
                  <td className="px-3 py-3 border-b border-[#2a2a2a] text-[#bbb]">1 year</td>
                </tr>
                <tr>
                  <td className="px-3 py-3 border-b border-[#2a2a2a] text-[#bbb]">analytics_consent</td>
                  <td className="px-3 py-3 border-b border-[#2a2a2a] text-[#bbb]">Stores your cookie consent choice</td>
                  <td className="px-3 py-3 border-b border-[#2a2a2a] text-[#bbb]">1 year</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm">No third‑party advertising cookies are used.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>3. Analytics</h2>
          <p>We use self‑hosted, anonymized analytics (Plausible) that do not use cookies. No personal data is sent to external analytics platforms.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>4. Consent</h2>
          <p>Essential cookies are necessary for the Service and cannot be disabled. By continuing to use the site, you consent to their use. For any non‑essential cookies (none at present), we would obtain explicit consent via a banner.</p>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>5. Managing Cookies</h2>
          <p>You can delete or block cookies via your browser settings. However, blocking essential cookies will prevent login and core functionality. Instructions for common browsers:</p>
          <ul className="list-disc pl-8 mt-2 space-y-1">
            <li>Chrome: Settings → Privacy and Security → Cookies</li>
            <li>Firefox: Options → Privacy &amp; Security → Cookies</li>
            <li>Safari: Preferences → Privacy → Manage Website Data</li>
            <li>Edge: Settings → Cookies and site permissions</li>
          </ul>
        </div>

        <div className="mb-12">
          <h2 className={sectionTitle}>6. Changes</h2>
          <p>We may update this policy. Material changes will be notified via email or website notice.</p>
        </div>

        <div className="mb-12 p-6 bg-[#0a0a0a] border border-gray-900 rounded">
          <h2 className="text-white font-bold mb-3">📬 Cookie Questions</h2>
          <p className="text-sm text-gray-400">
            Email: <a href="mailto:privacy@traproyaltiespro.com" className="text-[#a78bfa] underline">privacy@traproyaltiespro.com</a>
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
          <Link href="/data-addendum" className="hover:text-white transition">DPA</Link>
          <Link href="/cookies" className="text-white">Cookies</Link>
        </div>
      </footer>
    </div>
  )
}
