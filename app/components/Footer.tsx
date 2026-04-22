'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black/90 text-gray-400 py-12 border-t border-purple-900/50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">VerseIQ</h3>
            <p className="text-sm">The protocol that powers transparent music royalties.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/free-audit" className="hover:text-purple-400">Free Audit</Link></li>
              <li><Link href="/founding-member" className="hover:text-purple-400">Founding Member</Link></li>
              <li><Link href="/label" className="hover:text-purple-400">Label Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-purple-400">About</Link></li>
              <li><Link href="#" className="hover:text-purple-400">Blog</Link></li>
              <li><Link href="#" className="hover:text-purple-400">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-purple-400">Terms</Link></li>
              <li><Link href="#" className="hover:text-purple-400">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          © 2026 VerseIQ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
