'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black/90 text-gray-400 py-12 border-t border-purple-900/50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-3 neon-purple text-lg">TrapRoyalties Pro</h3>
            <p className="text-sm mb-4">The protocol that powers transparent music royalties for hip-hop &amp; R&amp;B creators.</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 bg-gray-900 rounded border border-gray-700">ASCAP</span>
              <span className="px-2 py-1 bg-gray-900 rounded border border-gray-700">BMI</span>
              <span className="px-2 py-1 bg-gray-900 rounded border border-gray-700">SOCAN</span>
              <span className="px-2 py-1 bg-gray-900 rounded border border-gray-700">PRS</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/free-audit" className="hover:text-purple-400 transition">Free Audit</Link></li>
              <li><Link href="/royalty-finder" className="hover:text-purple-400 transition">Missing Royalties</Link></li>
              <li><Link href="/split-verification" className="hover:text-purple-400 transition">Split Verification</Link></li>
              <li><Link href="/founding-member" className="hover:text-purple-400 transition">Founding Member</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Portals</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/label" className="hover:text-purple-400 transition">Labels &amp; Managers</Link></li>
              <li><Link href="/attorney-portal" className="hover:text-purple-400 transition">For Attorneys</Link></li>
              <li><Link href="/label/ddex" className="hover:text-cyan-400 transition">DDEX Distribution</Link></li>
              <li><Link href="/free-audit" className="hover:text-purple-400 transition">Test MP3 Upload</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-purple-400 transition">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-purple-400 transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-purple-400 transition">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <span>© 2026 TrapRoyalties Pro. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-purple-400 transition">Privacy</Link>
            <Link href="#" className="hover:text-purple-400 transition">Terms</Link>
            <Link href="#" className="hover:text-purple-400 transition">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
