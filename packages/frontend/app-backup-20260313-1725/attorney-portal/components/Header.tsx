"use client";

import Link from 'next/link';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <>
      {/* Top Bar */}
      <div className="gradient-bg text-white py-2 px-6 text-center text-sm font-medium">
        Attorney Portal – Secure Session | Encrypted & Monad-Verified
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/attorney-portal" className="text-2xl font-bold text-indigo-900">
              TrapRoyalties<span className="text-indigo-600">Pro</span>
            </Link>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full font-medium">
              Attorney Portal
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <span className="text-sm text-gray-600">Leron Rogers (Fox Rothschild)</span>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Page Title (if provided) */}
      {title && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
          </div>
        </div>
      )}
    </>
  );
}