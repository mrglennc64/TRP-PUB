'use client';

import Link from 'next/link';
import { useState } from 'react';

function LiveModal({ onClose }: { onClose: () => void }) {
  const [val, setVal] = useState('');
  const [err, setErr] = useState(false);
  const submit = () => {
    if (val === 'stockholm1' || val === 'trap') {
      localStorage.setItem('tpLiveMode', val);
      onClose();
      window.location.href = '/split-verification';
    } else { setErr(true); setVal(''); }
  };
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#0d0020',border:'1px solid rgba(168,85,247,0.35)',borderRadius:16,padding:'36px 32px',minWidth:300,textAlign:'center'}}>
        <div style={{fontSize:22,marginBottom:8}}>🔴 Live Mode</div>
        <p style={{color:'rgba(224,224,224,0.45)',fontSize:13,margin:'0 0 20px'}}>Enter access code</p>
        <input type="password" value={val} onChange={e=>{setVal(e.target.value);setErr(false);}}
          onKeyDown={e=>e.key==='Enter'&&submit()} placeholder="Access code" autoFocus
          style={{width:'100%',boxSizing:'border-box',padding:'10px 14px',borderRadius:8,border:'1px solid rgba(168,85,247,0.35)',background:'rgba(0,0,0,0.4)',color:'#e0e0e0',fontSize:15,outline:'none',marginBottom:12,fontFamily:'Inter,sans-serif'}}/>
        {err && <p style={{color:'#f87171',fontSize:13,marginBottom:10}}>Incorrect code</p>}
        <div style={{display:'flex',gap:10}}>
          <button onClick={submit} style={{flex:1,padding:10,background:'linear-gradient(135deg,#dc2626,#ef4444)',color:'#fff',border:'none',borderRadius:8,fontSize:14,cursor:'pointer'}}>Enter</button>
          <button onClick={onClose} style={{flex:1,padding:10,background:'rgba(168,85,247,0.1)',color:'#e0e0e0',border:'1px solid rgba(168,85,247,0.3)',borderRadius:8,fontSize:14,cursor:'pointer'}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLive, setShowLive] = useState(false);

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
          <Link href="/split-verification" className="bg-amber-500 hover:bg-amber-400 text-black px-5 py-2 rounded-full font-semibold transition text-sm">🎬 Demo</Link>
          <button onClick={() => setShowLive(true)} className="border border-white/20 hover:border-red-500 text-white px-5 py-2 rounded-full font-semibold transition text-sm flex items-center gap-1.5">🔴 Live</button>
        </nav>
        {showLive && <LiveModal onClose={() => setShowLive(false)} />}

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
