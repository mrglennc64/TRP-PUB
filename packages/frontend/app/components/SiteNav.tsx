"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MODULES = [
  {
    label: "Royalty Recovery",
    icon: "💰",
    items: [
      { href: "/royalty-finder", label: "Royalty Finder" },
      { href: "/free-audit",     label: "Free Royalty Audit" },
      { href: "/mlc-search",     label: "MLC Database Search" },
    ],
  },
  {
    label: "Legal Tools",
    icon: "⚖️",
    items: [
      { href: "/attorney-portal",                label: "Attorney Portal" },
      { href: "/lod-generator",                  label: "Legal Demand Letter" },
      { href: "/attorney-portal/command-center", label: "Firm View" },
    ],
  },
  {
    label: "Catalog",
    icon: "🗂️",
    items: [
      { href: "/ingest",             label: "Upload Your Catalog" },
      { href: "/schema-parser",      label: "Metadata Cleaner" },
      { href: "/split-verification", label: "Split Sheet Verifier" },
      { href: "/catalog-staging",    label: "Staging" },
    ],
  },
  {
    label: "Rights",
    icon: "📋",
    items: [
      { href: "/cwr-generator",  label: "Copyright Registration" },
      { href: "/master-catalog", label: "Global Royalty Verification" },
      { href: "/forensic-audit", label: "Royalty Audit Report" },
    ],
  },
  {
    label: "Label Ops",
    icon: "🏢",
    items: [
      { href: "/label",         label: "Label Portal" },
      { href: "/artist-portal", label: "Artist Portal" },
    ],
  },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const path = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-[9000] bg-[#0f172a] border-b border-white/10 shadow-xl">
      <div className="px-4 flex items-center h-12 gap-2 overflow-visible">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 mr-3">
          <span className="text-base font-black text-indigo-400 tracking-tight">TRP</span>
          <span className="hidden lg:block text-xs text-slate-500 font-medium">TrapRoyaltiesPro</span>
        </Link>

        {/* Desktop: Enter Data CTA + 5 module dropdowns */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 flex-shrink-0 ${
              path === "/dashboard"
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-indigo-400"
                : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/20"
            }`}
          >
            <span className="text-sm leading-none">⚡</span>
            Enter Data
          </Link>

          {MODULES.map((mod, i) => {
            const isActive = mod.items.some(
              (item) => path === item.href || path?.startsWith(item.href + "/")
            );
            return (
              <div key={i} className="relative flex-shrink-0">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === i ? null : i)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                    isActive || activeDropdown === i
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                      : "text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="text-sm leading-none">{mod.icon}</span>
                  {mod.label}
                  <svg
                    className={`w-3 h-3 transition-transform ${activeDropdown === i ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {activeDropdown === i && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 py-1 z-[9999]">
                    {mod.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setActiveDropdown(null)}
                        className={`block px-4 py-2.5 text-xs font-medium transition-colors ${
                          path === item.href || path?.startsWith(item.href + "/")
                            ? "text-indigo-400 bg-indigo-600/20"
                            : "text-slate-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile: Enter Data + hamburger */}
        <div className="md:hidden flex items-center gap-2 ml-auto">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg"
          >
            ⚡ Enter Data
          </Link>
          <button onClick={() => setOpen(!open)} className="flex flex-col gap-1 p-1.5" aria-label="Menu">
            <span className={`block w-5 h-0.5 bg-slate-300 transition-transform duration-200 ${open ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block w-5 h-0.5 bg-slate-300 transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-slate-300 transition-transform duration-200 ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown - grouped by module */}
      {open && (
        <div className="md:hidden bg-[#0a0f1e] border-t border-white/10 px-4 py-3 space-y-4">
          {MODULES.map((mod, i) => (
            <div key={i}>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2 px-1">
                {mod.icon} {mod.label}
              </p>
              <div className="grid grid-cols-2 gap-1">
                {mod.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
                      path === item.href ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
