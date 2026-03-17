'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md text-white py-4 border-b border-purple-900/50">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold neon-purple">
          TrapRoyalties Pro
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="#features" className="text-gray-300 hover:text-purple-400 transition relative group">
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/attorney-portal#digital-handshake" className="text-indigo-400 hover:text-indigo-300 font-medium transition relative group">
            🤝 Digital Handshake
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/split-verification" className="text-green-400 hover:text-green-300 font-medium transition relative group">
            ✅ Split Verification
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/label" className="text-gray-300 hover:text-blue-400 transition relative group">
            🏷️ Labels &amp; Managers
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/for-attorneys" className="text-amber-400 font-bold hover:text-amber-300 transition relative group">
            ⚖️ For Attorneys
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/free-audit"
            className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-full font-semibold transition transform hover:scale-105 hover:shadow-lg hover:shadow-purple-600/50"
          >
            Start Free Audit
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 border-t border-purple-900/40 px-6 py-4 flex flex-col space-y-4 text-sm font-medium">
          <Link href="#features" onClick={() => setMenuOpen(false)} className="hover:text-purple-400 transition">Features</Link>
          <Link href="/attorney-portal#digital-handshake" onClick={() => setMenuOpen(false)} className="text-indigo-400 hover:text-indigo-300 transition">🤝 Digital Handshake</Link>
          <Link href="/split-verification" onClick={() => setMenuOpen(false)} className="text-green-400 hover:text-green-300 transition">✅ Split Verification</Link>
          <Link href="/label" onClick={() => setMenuOpen(false)} className="hover:text-blue-400 transition">🏷️ Labels &amp; Managers</Link>
          <Link href="/for-attorneys" onClick={() => setMenuOpen(false)} className="text-amber-400 hover:text-amber-300 font-bold transition">⚖️ For Attorneys</Link>
          <Link
            href="/free-audit"
            onClick={() => setMenuOpen(false)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2 rounded-full font-semibold text-center transition"
          >
            Start Free Audit
          </Link>
        </div>
      )}
    </header>
  );
}
