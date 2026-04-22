'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black/90 text-gray-400 py-12 border-t border-purple-900/50">
      <div className="container mx-auto px-6">

        {/* Brand row */}
        <div className="mb-10">
          <h3 className="text-white font-bold text-lg mb-1">VerseIQ</h3>
          <p className="text-sm max-w-xs">The protocol that powers transparent music royalties.</p>
          <a
            href="https://usesmpt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition"
          >
            Powered by SMPT Protocol ↗
          </a>
        </div>

        {/* 3-column link grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-10">

          {/* Column 1 — Legal & Compliance */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal &amp; Compliance</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-purple-400 transition">About Us</Link></li>
              <li><Link href="/privacy" className="hover:text-purple-400 transition">Privacy Policy (GDPR/CCPA)</Link></li>
              <li><Link href="/terms" className="hover:text-purple-400 transition">Terms of Use</Link></li>
              <li><Link href="/data-addendum" className="hover:text-purple-400 transition">Data Protection Addendum</Link></li>
              <li><Link href="/faq" className="hover:text-purple-400 transition">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 2 — Attorney Tools */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Attorney Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/attorney-portal" className="hover:text-purple-400 transition">Attorney Portal</Link></li>
              <li><Link href="/attorney-portal/command-center" className="hover:text-purple-400 transition">Firm View</Link></li>
              <li><Link href="/cwr-generator" className="hover:text-purple-400 transition">CWR Generator</Link></li>
            </ul>
          </div>

          {/* Column 3 — Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://usesmpt.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition">
                  SMPT Protocol Specs ↗
                </a>
              </li>
              <li><Link href="/api-docs" className="hover:text-purple-400 transition">API Documentation</Link></li>
              <li><Link href="/help" className="hover:text-purple-400 transition">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-purple-400 transition">Contact Support</Link></li>
              <li>
                <a href="https://traproyalties.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition">
                  traproyalties.com ↗
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p>© 2026 VerseIQ. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/about" className="hover:text-purple-400 transition">About Us</Link>
            <Link href="/privacy" className="hover:text-purple-400 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-purple-400 transition">Terms</Link>
            <a href="https://usesmpt.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition">
              usesmpt.com
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
