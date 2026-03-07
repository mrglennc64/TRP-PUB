"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/dashboard",                        label: "Enter Data",    icon: "⚡", cta: true },
  { href: "/label",                            label: "Label",         icon: "🏢" },
  { href: "/attorney-portal",                  label: "Attorney",      icon: "⚖️" },
  { href: "/attorney-portal/command-center",   label: "Firm View",     icon: "🖥️" },
  { href: "/artist-portal",                    label: "Artists",       icon: "🎤" },
  { href: "/free-audit",                       label: "Free Audit",    icon: "🔍" },
  { href: "/onboarding",                       label: "How It Works",  icon: "📖" },
  { href: "/faq",                              label: "FAQ",           icon: "❓" },
  { href: "/partnership",                      label: "Partnership",   icon: "🤝" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a] border-b border-white/10 shadow-xl">
      <div className="px-4 flex items-center h-12 gap-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 mr-3">
          <span className="text-base font-black text-indigo-400 tracking-tight">TRP</span>
          <span className="hidden lg:block text-xs text-slate-500 font-medium">TrapRoyaltiesPro</span>
        </Link>

        {/* Desktop links — scrollable, fills all space */}
        <div className="hidden md:flex items-center gap-1 flex-1 overflow-x-auto scrollbar-hide min-w-0">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 flex-shrink-0 ${
                l.cta
                  ? path === l.href
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-indigo-400"
                    : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/20"
                  : path === l.href || path?.startsWith(l.href + "/")
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="text-sm leading-none">{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile: show "Data Hub" pill + hamburger */}
        <div className="md:hidden flex items-center gap-2 ml-auto">
          <Link href="/dashboard"
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg">
            ⚡ Enter Data
          </Link>
          <button onClick={() => setOpen(!open)} className="flex flex-col gap-1 p-1.5" aria-label="Menu">
            <span className={`block w-5 h-0.5 bg-slate-300 transition-transform duration-200 ${open ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block w-5 h-0.5 bg-slate-300 transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-slate-300 transition-transform duration-200 ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-[#0a0f1e] border-t border-white/10 px-4 py-3 grid grid-cols-2 gap-2">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                path === l.href ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-white/10"
              }`}>
              <span>{l.icon}</span>{l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </nav>
  );
}
