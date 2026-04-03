"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemoMode } from "../lib/DemoModeProvider";

const LEGAL_TOOLS_ITEMS = [
  { href: "/attorney-portal",                label: "Attorney Portal",      group: "portal" },
  { href: "/attorney-portal/command-center", label: "Firm View",            group: "portal" },
  { href: "/cwr-generator",                  label: "📋 CWR Generator",     group: "tools" },
  { href: "/master-catalog",                 label: "📂 Master Catalog",    group: "tools" },
  { href: "/forensic-audit",                 label: "🔬 Audit PDF",         group: "tools" },
  { href: "/lod-generator",                  label: "📜 LOD Generator",     group: "tools" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const path = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const { demoMode, probesRemaining, setDemoMode, unlockLive } = useDemoMode();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setLegalOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

  const isLegalActive = LEGAL_TOOLS_ITEMS.some(
    item => path === item.href || path?.startsWith(item.href + "/")
  );

  return (
    <>
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-[9000] bg-[#0f172a] border-b border-white/10 shadow-xl">
        <div className="px-4 flex items-center h-12 gap-2 overflow-visible">

          {/* Logo - revert: git checkout b0fa256 -- packages/frontend/app/components/SiteNav.tsx */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0" style={{textDecoration:"none"}}>
            <img src="/images/trp-logo.png" alt="TRP" style={{height:"34px",width:"auto",flexShrink:0,mixBlendMode:"screen",filter:"brightness(1.15) contrast(1.05)"}} />
            <div style={{display:"flex",flexDirection:"column",gap:"3px"}}>
              <div style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                <span style={{fontFamily:"Inter,-apple-system,sans-serif",fontWeight:800,fontSize:"16.5px",color:"#c7d2fe",letterSpacing:"-0.04em",whiteSpace:"nowrap",lineHeight:1}}>TrapRoyalties<span style={{fontWeight:900,color:"#818cf8",letterSpacing:"0.04em"}}>PRO</span></span>
                <div style={{height:"1px",background:"linear-gradient(90deg,transparent,#6366f1 20%,#818cf8 55%,transparent)",width:"88%",alignSelf:"center"}} />
              </div>
              <span style={{fontFamily:"Inter,-apple-system,sans-serif",fontWeight:600,fontSize:"7px",color:"#4f5b8a",letterSpacing:"0.2em",whiteSpace:"nowrap",lineHeight:1,textTransform:"uppercase"}}>SMPT Verified System</span>
            </div>
          </Link>

                    {/* Desktop nav — Legal Tools only */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setLegalOpen(v => !v)}
                className={"flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 " +
                  (isLegalActive || legalOpen
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/10")}
              >
                <span className="text-sm leading-none">⚖️</span>
                Legal Tools
                <svg className={"w-3 h-3 transition-transform " + (legalOpen ? "rotate-180" : "")}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {legalOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 py-2 z-[9999]">
                  <p className="px-4 pb-1 text-[9px] uppercase tracking-widest text-slate-600 font-bold">Portal</p>
                  {LEGAL_TOOLS_ITEMS.filter(i => i.group === 'portal').map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setLegalOpen(false)}
                      className={"block px-4 py-2.5 text-xs font-medium transition-colors " +
                        (path === item.href || path?.startsWith(item.href + "/")
                          ? "text-indigo-400 bg-indigo-600/20"
                          : "text-slate-400 hover:text-white hover:bg-white/10")}>
                      {item.label}
                    </Link>
                  ))}
                  <div className="my-1 border-t border-white/5" />
                  <p className="px-4 pb-1 text-[9px] uppercase tracking-widest text-slate-600 font-bold">Tools</p>
                  {LEGAL_TOOLS_ITEMS.filter(i => i.group === 'tools').map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setLegalOpen(false)}
                      className={"block px-4 py-2.5 text-xs font-medium transition-colors " +
                        (path === item.href
                          ? "text-indigo-400 bg-indigo-600/20"
                          : "text-slate-400 hover:text-white hover:bg-white/10")}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Demo / Live toggle */}
          <div className="flex items-center gap-1 ml-auto flex-shrink-0">
            <button
              onClick={() => setDemoMode(true)}
              className={"px-3 py-1.5 rounded-lg text-xs font-black transition border " +
                (demoMode
                  ? 'bg-amber-500 text-black border-amber-400'
                  : 'bg-white/5 text-slate-500 border-white/10 hover:bg-white/10 hover:text-slate-300')}>
              🎬 Demo
            </button>
            <button
              onClick={demoMode ? handleLiveClick : undefined}
              className={"px-3 py-1.5 rounded-lg text-xs font-black transition border whitespace-nowrap " +
                (!demoMode
                  ? 'bg-green-600/20 text-green-300 border-green-500/40 cursor-default'
                  : 'bg-white/5 text-slate-500 border-white/10 hover:bg-white/10 hover:text-slate-300')}>
              {!demoMode
                ? `🟢 Live${probesRemaining !== null ? ` · ${probesRemaining} left` : ''}`
                : '🔴 Live'}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col gap-1 p-1.5 ml-1" aria-label="Menu">
            <span className={"block w-5 h-0.5 bg-slate-300 transition-transform duration-200 " + (open ? "rotate-45 translate-y-1.5" : "")} />
            <span className={"block w-5 h-0.5 bg-slate-300 transition-opacity duration-200 " + (open ? "opacity-0" : "")} />
            <span className={"block w-5 h-0.5 bg-slate-300 transition-transform duration-200 " + (open ? "-rotate-45 -translate-y-1.5" : "")} />
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden bg-[#0a0f1e] border-t border-white/10 px-4 py-3 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2 px-1">⚖️ Legal Tools</p>
            {LEGAL_TOOLS_ITEMS.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className={"flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition " +
                  (path === item.href ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-white/10")}>
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Live Mode Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-green-400 mb-1">Live Data Access</p>
            <h2 className="text-xl font-black text-white mb-1">Enter Access Code</h2>
            <p className="text-slate-500 text-xs mb-6">Enter your access key to activate live data probes.</p>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input type="password" value={passwordInput}
                onChange={e => { setPasswordInput(e.target.value); setPasswordError(false); }}
                placeholder="Access code" autoFocus
                className={"w-full px-4 py-3 bg-slate-800 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm " +
                  (passwordError ? 'border-red-500' : 'border-slate-700')} />
              {passwordError && <p className="text-red-400 text-xs font-bold">Incorrect access code.</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 text-sm font-bold rounded-xl transition">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-black rounded-xl transition">
                  Unlock Live →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
