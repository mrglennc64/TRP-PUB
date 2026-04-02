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

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0" style={{textDecoration:"none"}}>
            <svg width="36" height="36" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{flexShrink:0}}>
              <path d="M223.0,49.8 A152,152 0 0,1 290.0,77.5" stroke="#FFFFFF" strokeWidth="5" fill="none"/>
              <path d="M322.5,110.0 A152,152 0 0,1 350.2,177.0" stroke="#FFFFFF" strokeWidth="5" fill="none"/>
              <path d="M350.2,223.0 A152,152 0 0,1 322.5,290.0" stroke="#FFFFFF" strokeWidth="5" fill="none"/>
              <path d="M290.0,322.5 A152,152 0 0,1 223.0,350.2" stroke="#FFFFFF" strokeWidth="5" fill="none"/>
              <path d="M177.0,350.2 A152,152 0 0,1 110.0,322.5" stroke="#FFFFFF" strokeWidth="5" fill="none"/>
              <path d="M77.5,290.0 A152,152 0 0,1 49.8,223.0" stroke="#FFFFFF" strokeWidth="5" fill="none"/>
              <path d="M49.8,177.0 A152,152 0 0,1 77.5,110.0" stroke="#FFFFFF" strokeWidth="5" fill="none"/>
              <path d="M110.0,77.5 A152,152 0 0,1 177.0,49.8" stroke="#FFFFFF" strokeWidth="5" fill="none"/>
              <line x1="200.0" y1="102.0" x2="200.0" y2="73.0" stroke="#FFFFFF" strokeWidth="4"/>
              <line x1="269.3" y1="130.7" x2="289.8" y2="110.2" stroke="#FFFFFF" strokeWidth="4"/>
              <line x1="298.0" y1="200.0" x2="327.0" y2="200.0" stroke="#FFFFFF" strokeWidth="4"/>
              <line x1="269.3" y1="269.3" x2="289.8" y2="289.8" stroke="#FFFFFF" strokeWidth="4"/>
              <line x1="200.0" y1="298.0" x2="200.0" y2="327.0" stroke="#FFFFFF" strokeWidth="4"/>
              <line x1="130.7" y1="269.3" x2="110.2" y2="289.8" stroke="#FFFFFF" strokeWidth="4"/>
              <line x1="102.0" y1="200.0" x2="73.0" y2="200.0" stroke="#FFFFFF" strokeWidth="4"/>
              <line x1="130.7" y1="130.7" x2="110.2" y2="110.2" stroke="#FFFFFF" strokeWidth="4"/>
              <circle cx="200" cy="200" r="98" stroke="#FFFFFF" strokeWidth="5" fill="none"/>
              <circle cx="200.0" cy="102.0" r="3.5" fill="#FFFFFF"/>
              <circle cx="269.3" cy="130.7" r="3.5" fill="#FFFFFF"/>
              <circle cx="298.0" cy="200.0" r="3.5" fill="#FFFFFF"/>
              <circle cx="269.3" cy="269.3" r="3.5" fill="#FFFFFF"/>
              <circle cx="200.0" cy="298.0" r="3.5" fill="#FFFFFF"/>
              <circle cx="130.7" cy="269.3" r="3.5" fill="#FFFFFF"/>
              <circle cx="102.0" cy="200.0" r="3.5" fill="#FFFFFF"/>
              <circle cx="130.7" cy="130.7" r="3.5" fill="#FFFFFF"/>
              <circle cx="200.0" cy="48.0" r="23" stroke="#FFFFFF" strokeWidth="5" fill="none"/>
              <ellipse cx="200.0" cy="42.0" rx="9" ry="3.5" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
              <ellipse cx="200.0" cy="54.0" rx="9" ry="3.5" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
              <line x1="191.0" y1="42.0" x2="191.0" y2="54.0" stroke="#FFFFFF" strokeWidth="3"/>
              <line x1="209.0" y1="42.0" x2="209.0" y2="54.0" stroke="#FFFFFF" strokeWidth="3"/>
              <circle cx="307.5" cy="92.5" r="23" stroke="#FFFFFF" strokeWidth="5" fill="none"/>
              <circle cx="307.5" cy="92.5" r="9" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
              <circle cx="307.5" cy="92.5" r="4" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
              <circle cx="352.0" cy="200.0" r="23" stroke="#FFFFFF" strokeWidth="5" fill="none"/>
              <ellipse cx="352.0" cy="194.0" rx="9" ry="3.5" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
              <ellipse cx="352.0" cy="206.0" rx="9" ry="3.5" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
              <line x1="343.0" y1="194.0" x2="343.0" y2="206.0" stroke="#FFFFFF" strokeWidth="3"/>
              <line x1="361.0" y1="194.0" x2="361.0" y2="206.0" stroke="#FFFFFF" strokeWidth="3"/>
              <circle cx="307.5" cy="307.5" r="23" stroke="#FFFFFF" strokeWidth="5" fill="none"/>
              <ellipse cx="307.5" cy="301.5" rx="9" ry="3.5" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
              <ellipse cx="307.5" cy="313.5" rx="9" ry="3.5" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
              <line x1="298.5" y1="301.5" x2="298.5" y2="313.5" stroke="#FFFFFF" strokeWidth="3"/>
              <line x1="316.5" y1="301.5" x2="316.5" y2="313.5" stroke="#FFFFFF" strokeWidth="3"/>
              <circle cx="200.0" cy="352.0" r="23" stroke="#FFFFFF" strokeWidth="5" fill="none"/>
              <path d="M194.0,344.0 L201.0,344.0 L206.0,349.0 L206.0,360.0 L194.0,360.0 Z" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
              <path d="M201.0,344.0 L201.0,349.0 L206.0,349.0" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
              <line x1="197.0" y1="350.0" x2="201.0" y2="350.0" stroke="#FFFFFF" strokeWidth="3"/>
              <line x1="197.0" y1="354.0" x2="201.0" y2="354.0" stroke="#FFFFFF" strokeWidth="3"/>
              <line x1="197.0" y1="358.0" x2="201.0" y2="358.0" stroke="#FFFFFF" strokeWidth="3"/>
              <circle cx="92.5" cy="307.5" r="23" stroke="#FFFFFF" strokeWidth="5" fill="none"/>
              <ellipse cx="92.5" cy="301.5" rx="9" ry="3.5" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
              <ellipse cx="92.5" cy="313.5" rx="9" ry="3.5" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
              <line x1="83.5" y1="301.5" x2="83.5" y2="313.5" stroke="#FFFFFF" strokeWidth="3"/>
              <line x1="101.5" y1="301.5" x2="101.5" y2="313.5" stroke="#FFFFFF" strokeWidth="3"/>
              <circle cx="48.0" cy="200.0" r="23" stroke="#FFFFFF" strokeWidth="5" fill="none"/>
              <path d="M42.0,192.0 L49.0,192.0 L54.0,197.0 L54.0,208.0 L42.0,208.0 Z" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
              <path d="M49.0,192.0 L49.0,197.0 L54.0,197.0" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
              <line x1="45.0" y1="198.0" x2="49.0" y2="198.0" stroke="#FFFFFF" strokeWidth="3"/>
              <line x1="45.0" y1="202.0" x2="49.0" y2="202.0" stroke="#FFFFFF" strokeWidth="3"/>
              <line x1="45.0" y1="206.0" x2="49.0" y2="206.0" stroke="#FFFFFF" strokeWidth="3"/>
              <circle cx="92.5" cy="92.5" r="23" stroke="#FFFFFF" strokeWidth="5" fill="none"/>
              <circle cx="92.5" cy="92.5" r="9" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
              <circle cx="92.5" cy="92.5" r="4" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
              <polygon points="200.0,142.0 250.2,171.0 250.2,229.0 200.0,258.0 149.8,229.0 149.8,171.0" stroke="#FFFFFF" strokeWidth="3" fill="none"/>
              <circle cx="252.0" cy="246.8" r="26" stroke="#FFFFFF" strokeWidth="5" fill="none"/>
              <polyline points="240.0,248.8 249.0,257.8 265.0,236.8" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
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
            <p className="text-slate-500 text-xs mb-6">Enter your access key to activate live data probes. Trial key: <span className="font-mono text-slate-400">TRP-LIVE-2026</span> (5 probes / 14 days).</p>
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
