"use client";

import { useState, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemoMode } from "../lib/DemoModeProvider";

type IconName = "currency" | "scales" | "folder" | "clipboard" | "building" | "bolt" | "film" | "book";

const ICON_PATHS: Record<IconName, ReactNode> = {
  currency: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9a2 2 0 00-2-2h-2a2 2 0 000 4h2a2 2 0 010 4h-2a2 2 0 01-2-2" />
      <path d="M12 6v1" />
      <path d="M12 17v1" />
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
  folder: (
    <>
      <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
      <path d="M8 11h8" />
    </>
  ),
  clipboard: (
    <>
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" />
      <path d="M9 11h6" />
      <path d="M9 15h4" />
    </>
  ),
  building: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M9 7h2" />
      <path d="M13 7h2" />
      <path d="M9 11h2" />
      <path d="M13 11h2" />
      <path d="M9 15h2" />
      <path d="M13 15h2" />
      <path d="M10 21v-3h4v3" />
    </>
  ),
  bolt: <path d="M13 3L4 14h7l-1 7 9-12h-7l1-6z" />,
  book: (
    <>
      <path d="M4 4a2 2 0 012-2h12v18H6a2 2 0 01-2-2V4z" />
      <path d="M4 18a2 2 0 012-2h12" />
      <path d="M8 7h6" />
      <path d="M8 11h6" />
    </>
  ),
  film: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M7 6v12" />
      <path d="M17 6v12" />
      <path d="M7 9h2" />
      <path d="M7 15h2" />
      <path d="M15 9h2" />
      <path d="M15 15h2" />
    </>
  ),
};

function Icon({ name, size = 14, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

function StatusDot({ className = "" }: { className?: string }) {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true" className={className}>
      <circle cx="4" cy="4" r="3" fill="currentColor" />
    </svg>
  );
}

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const path = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const { demoMode, probesRemaining, setDemoMode, unlockLive } = useDemoMode();

  const handleLiveClick = () => {
    setPasswordInput('');
    setPasswordError(false);
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = unlockLive(passwordInput);
    if (ok) {
      setShowPasswordModal(false);
      setPasswordInput('');
    } else {
      setPasswordError(true);
    }
  };

  return (
    <>
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-[9000] bg-[#0f172a] border-b border-white/10 shadow-xl">
        <div className="px-4 flex items-center h-12 gap-2 overflow-visible">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 mr-3">
            <span className="text-base font-black text-indigo-400 tracking-tight">TRP</span>
            <span className="hidden lg:block text-xs text-slate-500 font-medium">TrapRoyaltiesPro</span>
          </Link>

          {/* Desktop nav — two primary portal links */}
          <div className="hidden md:flex items-center gap-2 flex-1">
            <Link
              href="/attorney-portal"
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                path?.startsWith("/attorney-portal")
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400"
                  : "text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              <Icon name="scales" size={14} />
              Attorney Portal
            </Link>
            <Link
              href="/publisher-portal"
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                path?.startsWith("/publisher-portal")
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400"
                  : "text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              <Icon name="book" size={14} />
              Publishing Portal
            </Link>
          </div>

          {/* Demo / Live toggle — always visible */}
          <div className="flex items-center gap-1 ml-auto flex-shrink-0">
            <button
              onClick={() => setDemoMode(true)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition border ${
                demoMode
                  ? 'bg-amber-500 text-black border-amber-400'
                  : 'bg-white/5 text-slate-500 border-white/10 hover:bg-white/10 hover:text-slate-300'
              }`}
            >
              <Icon name="film" size={12} />
              Demo
            </button>
            <button
              onClick={demoMode ? handleLiveClick : undefined}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition border whitespace-nowrap ${
                !demoMode
                  ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 cursor-default'
                  : 'bg-white/5 text-slate-500 border-white/10 hover:bg-white/10 hover:text-slate-300'
              }`}
            >
              <StatusDot className={!demoMode ? 'text-emerald-400' : 'text-rose-500'} />
              {!demoMode
                ? `Live${probesRemaining !== null ? ` · ${probesRemaining} left` : ''}`
                : 'Live'}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col gap-1 p-1.5 ml-1" aria-label="Menu">
            <span className={`block w-5 h-0.5 bg-slate-300 transition-transform duration-200 ${open ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block w-5 h-0.5 bg-slate-300 transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-slate-300 transition-transform duration-200 ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden bg-[#0a0f1e] border-t border-white/10 px-4 py-3 space-y-2">
            <Link
              href="/attorney-portal"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                path?.startsWith("/attorney-portal") ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-white/10"
              }`}
            >
              <Icon name="scales" size={14} />
              Attorney Portal
            </Link>
            <Link
              href="/publisher-portal"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                path?.startsWith("/publisher-portal") ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-white/10"
              }`}
            >
              <Icon name="book" size={14} />
              Publishing Portal
            </Link>
          </div>
        )}
      </nav>

      {/* Live Mode Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Live Data Access</p>
            <h2 className="text-xl font-black text-white mb-1">Enter Access Code</h2>
            <p className="text-slate-500 text-xs mb-6">Enter your access key to activate live data probes. Trial key: <span className="font-mono text-slate-400">TRP-LIVE-2026</span> (5 probes / 14 days).</p>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                value={passwordInput}
                onChange={e => { setPasswordInput(e.target.value); setPasswordError(false); }}
                placeholder="Access code"
                autoFocus
                className={`w-full px-4 py-3 bg-slate-800 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
                  passwordError ? 'border-rose-500' : 'border-slate-700'
                }`}
              />
              {passwordError && (
                <p className="text-rose-400 text-xs font-bold">Incorrect access code.</p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 text-sm font-bold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-black rounded-xl transition"
                >
                  Unlock Live
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="M13 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
