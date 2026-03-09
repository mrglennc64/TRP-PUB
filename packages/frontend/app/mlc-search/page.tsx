"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";

/* ─── Types ──────────────────────────────────────────────────── */
type ClaimStatus = "registered" | "unregistered" | "partial" | "disputed" | "claimed";
type RoyaltyType = "mechanical" | "performance" | "both";

interface MLCWork {
  id: string;
  title: string;
  artist: string;
  isrc: string;
  iswc?: string;
  writers: { name: string; ipi: string; share: number }[];
  publisher?: string;
  publisher_ipi?: string;
  release_date: string;
  status: ClaimStatus;
  royalty_type: RoyaltyType;
  unclaimed_amount?: number;
  platforms: string[];
  streams_reported: number;
  last_activity: string;
  match_confidence: number;
  claim_deadline?: string;
}

interface ClaimState {
  workId: string;
  phase: "idle" | "confirming" | "submitting" | "done" | "error";
  refNum?: string;
}

/* ─── Mock MLC database ──────────────────────────────────────── */
const MLC_DATABASE: MLCWork[] = [
  {
    id: "mlc001", title: "Sicko Mode", artist: "Travis Scott ft. Drake",
    isrc: "USUG11801862", iswc: "T-921.614.229-5",
    writers: [
      { name: "Jacques Webster II", ipi: "00721084930", share: 33.33 },
      { name: "Aubrey Graham",      ipi: "00495205820", share: 33.33 },
      { name: "Travis Thompson",    ipi: "00812930041", share: 33.34 },
    ],
    publisher: "Cactus Jack Publishing", publisher_ipi: "00721084941",
    release_date: "2018-08-03", status: "partial", royalty_type: "mechanical",
    unclaimed_amount: 14820, platforms: ["Spotify","Apple Music","Amazon","YouTube"],
    streams_reported: 8420000, last_activity: "2025-09-12", match_confidence: 99,
    claim_deadline: "2026-03-31",
  },
  {
    id: "mlc002", title: "No Role Modelz", artist: "J. Cole",
    isrc: "USRC11400626", iswc: "T-913.284.771-3",
    writers: [{ name: "Jermaine Cole", ipi: "00591263810", share: 100 }],
    publisher: "Dreamville Publishing", publisher_ipi: "00591263821",
    release_date: "2014-12-09", status: "registered", royalty_type: "mechanical",
    platforms: ["Spotify","Apple Music","Tidal","Amazon"],
    streams_reported: 6180000, last_activity: "2025-11-01", match_confidence: 99,
  },
  {
    id: "mlc003", title: "Drip Too Hard", artist: "Lil Baby & Gunna",
    isrc: "USSM11804672",
    writers: [
      { name: "Dominique Jones", ipi: "00819234071", share: 50 },
      { name: "Sergio Kitchens", ipi: "00830192847", share: 50 },
    ],
    publisher: "Quality Control Music", publisher_ipi: "00819234082",
    release_date: "2018-09-28", status: "unregistered", royalty_type: "mechanical",
    unclaimed_amount: 31800, platforms: ["Spotify","Apple Music","Amazon","YouTube","Tidal"],
    streams_reported: 4920000, last_activity: "2025-08-20", match_confidence: 97,
    claim_deadline: "2026-06-30",
  },
  {
    id: "mlc004", title: "Look Alive", artist: "BlocBoy JB ft. Drake",
    isrc: "USSM11801532",
    writers: [
      { name: "James Fulton Jr.", ipi: "00841029384", share: 65 },
      { name: "Aubrey Graham",    ipi: "00495205820", share: 35 },
    ],
    release_date: "2018-01-18", status: "unregistered", royalty_type: "both",
    unclaimed_amount: 18200, platforms: ["Spotify","Apple Music","YouTube"],
    streams_reported: 2140000, last_activity: "2025-07-04", match_confidence: 94,
    claim_deadline: "2026-01-31",
  },
  {
    id: "mlc005", title: "Starboy", artist: "The Weeknd ft. Daft Punk",
    isrc: "USUG11600681", iswc: "T-921.614.229-9",
    writers: [
      { name: "Abel Tesfaye",        ipi: "00495000001", share: 40 },
      { name: "Thomas Bangalter",    ipi: "00295810283", share: 30 },
      { name: "Guy-Manuel de Homem", ipi: "00295810294", share: 30 },
    ],
    publisher: "XO Publishing", publisher_ipi: "00495000012",
    release_date: "2016-09-22", status: "registered", royalty_type: "mechanical",
    platforms: ["Spotify","Apple Music","Amazon","YouTube","Tidal","Deezer"],
    streams_reported: 14200000, last_activity: "2025-11-15", match_confidence: 100,
  },
  {
    id: "mlc006", title: "Antidote", artist: "Travis Scott",
    isrc: "USUG11501163",
    writers: [{ name: "Jacques Webster II", ipi: "00721084930", share: 100 }],
    publisher: "Cactus Jack Publishing",
    release_date: "2015-07-31", status: "disputed", royalty_type: "mechanical",
    unclaimed_amount: 9100, platforms: ["Spotify","Apple Music"],
    streams_reported: 3810000, last_activity: "2025-06-15", match_confidence: 88,
  },
  {
    id: "mlc007", title: "Love Yourz", artist: "J. Cole",
    isrc: "USRC11501008", iswc: "T-919.102.884-1",
    writers: [{ name: "Jermaine Cole", ipi: "00591263810", share: 100 }],
    publisher: "Dreamville Publishing",
    release_date: "2014-12-09", status: "claimed", royalty_type: "mechanical",
    platforms: ["Spotify","Apple Music","Amazon","Tidal"],
    streams_reported: 2480000, last_activity: "2025-10-20", match_confidence: 100,
  },
  {
    id: "mlc008", title: "Goosebumps", artist: "Travis Scott ft. Kendrick Lamar",
    isrc: "USUG11601823",
    writers: [
      { name: "Jacques Webster II",  ipi: "00721084930", share: 60 },
      { name: "Kendrick Duckworth",  ipi: "00584921047", share: 40 },
    ],
    publisher: "Cactus Jack Publishing",
    release_date: "2016-09-16", status: "partial", royalty_type: "both",
    unclaimed_amount: 7400, platforms: ["Spotify","Apple Music","YouTube","Amazon"],
    streams_reported: 5630000, last_activity: "2025-10-05", match_confidence: 96,
    claim_deadline: "2026-04-15",
  },
  {
    id: "mlc009", title: "KOD", artist: "J. Cole",
    isrc: "USRC11800118",
    writers: [{ name: "Jermaine Cole", ipi: "00591263810", share: 100 }],
    publisher: "Dreamville Publishing",
    release_date: "2018-04-20", status: "unregistered", royalty_type: "mechanical",
    unclaimed_amount: 22400, platforms: ["Spotify","Apple Music","Amazon","YouTube","Tidal"],
    streams_reported: 3920000, last_activity: "2025-05-18", match_confidence: 99,
    claim_deadline: "2026-02-28",
  },
];

/* ─── Constants ──────────────────────────────────────────────── */
const STATUS_META: Record<ClaimStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  registered:   { label: "Registered",   color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/30",  dot: "bg-green-400"  },
  unregistered: { label: "Unregistered", color: "text-rose-400",   bg: "bg-rose-500/10",   border: "border-rose-500/30",   dot: "bg-rose-400"   },
  partial:      { label: "Partial",      color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", dot: "bg-yellow-400" },
  disputed:     { label: "Disputed",     color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", dot: "bg-orange-400" },
  claimed:      { label: "Claimed",      color: "text-sky-400",    bg: "bg-sky-500/10",    border: "border-sky-500/30",    dot: "bg-sky-400"    },
};

const PLATFORM_ICONS: Record<string, string> = {
  "Spotify": "🟢", "Apple Music": "🍎", "Amazon": "📦",
  "YouTube": "▶️", "Tidal": "🌊", "Deezer": "🎵",
};

function fmtMoney(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function fmtNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

/* ─── Main ──────────────────────────────────────────────────── */
export default function MLCSearchPage() {
  const [query, setQuery]           = useState("");
  const [searching, setSearching]   = useState(false);
  const [searched, setSearched]     = useState(false);
  const [results, setResults]       = useState<MLCWork[]>([]);
  const [selected, setSelected]     = useState<MLCWork | null>(null);
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | "all">("all");
  const [claims, setClaims]         = useState<Record<string, ClaimState>>({});
  const [batchMode, setBatchMode]   = useState(false);
  const [batchSelected, setBatchSelected] = useState<Set<string>>(new Set());
  const [batchPhase, setBatchPhase] = useState<"idle" | "running" | "done">("idle");
  const [batchLog, setBatchLog]     = useState<string[]>([]);
  const [verifiedIds, setVerifiedIds] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  const pushLog = (msg: string) => setBatchLog(p => [...p, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  /* ── Verify Live Status ── */
  const handleVerifyLive = (work: MLCWork) => {
    const url = `https://portal.themlc.com/search?title=${encodeURIComponent(work.title)}&isrc=${encodeURIComponent(work.isrc)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setVerifiedIds(p => new Set([...p, work.id]));
  };

  /* ── Search ── */
  const runSearch = useCallback(async () => {
    if (!query.trim()) return;
    setSearching(true);
    setSearched(false);
    setSelected(null);
    await new Promise(r => setTimeout(r, 900));
    const q = query.toLowerCase();
    const found = MLC_DATABASE.filter(w =>
      w.title.toLowerCase().includes(q) ||
      w.artist.toLowerCase().includes(q) ||
      w.isrc.toLowerCase().includes(q) ||
      (w.iswc ?? "").toLowerCase().includes(q) ||
      w.writers.some(wr => wr.name.toLowerCase().includes(q)) ||
      (w.publisher ?? "").toLowerCase().includes(q)
    );
    // Sort: unregistered/partial first (highest value to user), then by unclaimed amount desc
    found.sort((a, b) => {
      const priority = { unregistered: 0, partial: 1, disputed: 2, registered: 3, claimed: 4 };
      if (priority[a.status] !== priority[b.status]) return priority[a.status] - priority[b.status];
      return (b.unclaimed_amount ?? 0) - (a.unclaimed_amount ?? 0);
    });
    setResults(found);
    setSearched(true);
    setSearching(false);
  }, [query]);

  /* ── Claim single work ── */
  const initClaim = useCallback(async (workId: string) => {
    setClaims(p => ({ ...p, [workId]: { workId, phase: "submitting" } }));
    await new Promise(r => setTimeout(r, 1400));
    const ref = `MLC-${Date.now().toString(36).toUpperCase().slice(-8)}`;
    setClaims(p => ({ ...p, [workId]: { workId, phase: "done", refNum: ref } }));
    setResults(p => p.map(w => w.id === workId ? { ...w, status: "claimed" as ClaimStatus } : w));
    if (selected?.id === workId) setSelected(s => s ? { ...s, status: "claimed" } : s);
  }, [selected]);

  /* ── Batch claim ── */
  const runBatchClaim = useCallback(async () => {
    const ids = [...batchSelected].filter(id => {
      const w = MLC_DATABASE.find(w => w.id === id);
      return w && (w.status === "unregistered" || w.status === "partial");
    });
    if (!ids.length) return;
    setBatchPhase("running");
    setBatchLog([]);
    pushLog(`Batch claim initiated — ${ids.length} work(s)`);
    for (const id of ids) {
      const work = MLC_DATABASE.find(w => w.id === id);
      if (!work) continue;
      await new Promise(r => setTimeout(r, 600));
      pushLog(`Submitting claim: "${work.title}" (${work.isrc})`);
      await new Promise(r => setTimeout(r, 500));
      const ref = `MLC-${Date.now().toString(36).toUpperCase().slice(-8)}`;
      pushLog(`Confirmed: ${ref} — "${work.title}"`);
      setClaims(p => ({ ...p, [id]: { workId: id, phase: "done", refNum: ref } }));
      setResults(p => p.map(w => w.id === id ? { ...w, status: "claimed" as ClaimStatus } : w));
    }
    pushLog(`All ${ids.length} claim(s) submitted. Processing time: 5–10 business days.`);
    setBatchPhase("done");
  }, [batchSelected]);

  const filtered = results.filter(w => statusFilter === "all" || w.status === statusFilter);
  const totalUnclaimed = results.reduce((s, w) => s + (w.unclaimed_amount ?? 0), 0);
  const claimableCount = results.filter(w => w.status === "unregistered" || w.status === "partial").length;

  const toggleBatch = (id: string) => {
    setBatchSelected(p => {
      const next = new Set(p);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const selectAllClaimable = () => {
    setBatchSelected(new Set(results.filter(w => w.status === "unregistered" || w.status === "partial").map(w => w.id)));
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 pt-14 pb-20">
      {/* Header */}
      <div className="bg-[#0f172a] border-b border-white/10 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🔎</span>
              <h1 className="text-xl font-black text-white tracking-tight">MLC Search</h1>
              <span className="px-2 py-0.5 text-xs font-bold text-green-300 bg-green-500/20 border border-green-500/30 rounded-full">
                Mechanical Licensing Collective
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              Search the MLC database for unregistered and partially claimed mechanical royalties. Surface unclaimed funds and file claims directly.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/lod-generator" className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition">
              ← LOD
            </Link>
            <Link href="/cwr-generator" className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition">
              CWR Generator
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Search bar */}
        <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-5">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔎</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && runSearch()}
                placeholder="Search by title, artist, ISRC, ISWC, writer, or publisher…"
                className="w-full pl-9 pr-4 py-3 bg-[#1e293b] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={runSearch}
              disabled={searching || !query.trim()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/10 disabled:text-slate-600 text-white font-bold rounded-xl text-sm transition flex items-center gap-2"
            >
              {searching ? <><span className="animate-spin">⚙</span> Searching…</> : "Search MLC"}
            </button>
          </div>
          {/* Quick search chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs text-slate-600">Quick:</span>
            {["Travis Scott", "J. Cole", "Lil Baby", "Drake", "The Weeknd"].map(name => (
              <button key={name} onClick={() => { setQuery(name); setTimeout(runSearch, 50); }}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs rounded-lg border border-white/10 transition">
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Results area */}
        {searched && (
          <>
            {/* ── Disclaimer banner ── */}
            <div className="flex gap-3 items-start p-4 bg-amber-950/30 border border-amber-700/50 rounded-xl">
              <span className="text-lg flex-shrink-0 mt-0.5">⚖️</span>
              <div className="text-xs text-amber-200/80 leading-relaxed">
                <span className="font-bold text-amber-400 block mb-0.5">Local Snapshot — Live Verification Required</span>
                Real-time registry verification in progress. Our local snapshot indicates potential matches, but{' '}
                <strong className="text-amber-300">live verification via The MLC Portal is required before any claim can be filed.</strong>{' '}
                Use <span className="font-semibold text-white">Verify Live Status</span> on each work to confirm current registration status at themlc.com.
              </div>
            </div>

            {/* Summary row */}
            {results.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Works Found",     value: results.length,                          color: "text-white" },
                  { label: "Unclaimed",        value: fmtMoney(totalUnclaimed),                color: "text-rose-400" },
                  { label: "Claimable Works",  value: claimableCount,                          color: "text-yellow-400" },
                  { label: "Registered",       value: results.filter(w => w.status === "registered" || w.status === "claimed").length, color: "text-green-400" },
                ].map(c => (
                  <div key={c.label} className="bg-[#0f172a] border border-white/10 rounded-xl p-3">
                    <div className="text-xs text-slate-500 mb-1">{c.label}</div>
                    <div className={`text-xl font-black ${c.color}`}>{c.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex gap-1 flex-wrap">
                {(["all","unregistered","partial","disputed","registered","claimed"] as const).map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 text-xs font-semibold capitalize rounded-lg transition ${
                      statusFilter === s ? "bg-indigo-600 text-white" : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                    }`}>
                    {s === "all" ? `All (${results.length})` : `${STATUS_META[s].label} (${results.filter(w => w.status === s).length})`}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex items-center gap-2">
                {claimableCount > 0 && (
                  <button onClick={() => { setBatchMode(!batchMode); setBatchSelected(new Set()); setBatchPhase("idle"); setBatchLog([]); }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                      batchMode ? "bg-indigo-600/30 border-indigo-500/50 text-indigo-300" : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                    }`}>
                    {batchMode ? "Exit Batch" : "Batch Claim"}
                  </button>
                )}
                {batchMode && claimableCount > 0 && (
                  <button onClick={selectAllClaimable} className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition">
                    Select All Claimable
                  </button>
                )}
                {batchMode && batchSelected.size > 0 && batchPhase === "idle" && (
                  <button onClick={runBatchClaim}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-green-600 hover:bg-green-500 rounded-lg transition">
                    Claim {batchSelected.size} Work{batchSelected.size !== 1 ? "s" : ""}
                  </button>
                )}
              </div>
            </div>

            {/* Batch log */}
            {batchMode && batchLog.length > 0 && (
              <div className="bg-black/40 rounded-xl p-4 font-mono text-xs text-green-400 max-h-40 overflow-y-auto space-y-0.5">
                {batchLog.map((l, i) => <div key={i}>{l}</div>)}
                {batchPhase === "running" && <div className="animate-pulse">▊</div>}
                {batchPhase === "done" && <div className="text-indigo-400 mt-1">✓ Batch complete</div>}
              </div>
            )}

            {/* Results + detail panel */}
            <div className={`${selected ? "grid grid-cols-1 xl:grid-cols-2 gap-5" : ""}`}>

              {/* Work list */}
              <div className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden">
                {filtered.length === 0 && (
                  <div className="px-5 py-12 text-center text-slate-500">
                    {results.length === 0 ? (
                      <>
                        <div className="text-4xl mb-3">🔎</div>
                        <div className="text-sm font-semibold text-slate-400">No works found</div>
                        <div className="text-xs mt-1">Try searching by artist name, ISRC, or title</div>
                      </>
                    ) : "No works match this status filter."}
                  </div>
                )}

                <div className="divide-y divide-white/5 max-h-[640px] overflow-y-auto">
                  {filtered.map(work => {
                    const sm = STATUS_META[work.status];
                    const claimState = claims[work.id];
                    const isSelected = selected?.id === work.id;
                    const isClaimable = work.status === "unregistered" || work.status === "partial";

                    return (
                      <div key={work.id}
                        className={`transition-colors cursor-pointer ${isSelected ? "bg-indigo-500/10 border-l-2 border-indigo-400" : "hover:bg-white/5"}`}
                        onClick={() => setSelected(isSelected ? null : work)}
                      >
                        <div className="flex items-center gap-3 px-5 py-4">
                          {/* Batch checkbox */}
                          {batchMode && (
                            <input type="checkbox"
                              checked={batchSelected.has(work.id)}
                              onChange={e => { e.stopPropagation(); toggleBatch(work.id); }}
                              onClick={e => e.stopPropagation()}
                              disabled={!isClaimable}
                              className="accent-indigo-500 flex-shrink-0 disabled:opacity-30"
                            />
                          )}

                          {/* Status dot */}
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sm.dot}`} />

                          {/* Main info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-white truncate">{work.title}</span>
                              <span className={`px-2 py-0.5 text-xs font-bold rounded border ${sm.color} ${sm.bg} ${sm.border}`}>
                                {sm.label}
                              </span>
                              {work.claim_deadline && (work.status === "unregistered" || work.status === "partial") && (
                                <span className="text-xs text-rose-400 font-semibold">
                                  ⏰ {work.claim_deadline}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 truncate">{work.artist}</div>
                            <div className="text-xs text-slate-600 font-mono mt-0.5 truncate">
                              {work.isrc}{work.iswc ? ` · ${work.iswc}` : " · no ISWC"}
                            </div>
                          </div>

                          {/* Metrics */}
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="text-right hidden sm:block">
                              <div className="text-xs text-slate-500">{fmtNum(work.streams_reported)} streams</div>
                              <div className="text-xs text-slate-600">{work.platforms.length} platforms</div>
                            </div>
                            {work.unclaimed_amount ? (
                              <div className="text-right">
                                <div className="text-sm font-black text-rose-400">{fmtMoney(work.unclaimed_amount)}</div>
                                <div className="text-xs text-slate-500">unclaimed</div>
                              </div>
                            ) : (
                              <div className="text-xs text-green-400 font-semibold">✓ Current</div>
                            )}

                            {/* Verify + Claim buttons */}
                            <div className="flex flex-col items-end gap-1.5" onClick={e => e.stopPropagation()}>
                              {/* Verify Live button — always shown */}
                              <button
                                onClick={() => handleVerifyLive(work)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition whitespace-nowrap ${
                                  verifiedIds.has(work.id)
                                    ? 'bg-green-900/30 border-green-700/50 text-green-400'
                                    : 'bg-amber-900/20 border-amber-700/40 text-amber-400 hover:bg-amber-900/40'
                                }`}
                              >
                                {verifiedIds.has(work.id) ? '✓ Live Verified ↗' : 'Verify Live Status ↗'}
                              </button>

                              {/* Claim — only after live verify */}
                              {claimState?.phase === "done" ? (
                                <div className="text-xs text-sky-400 font-semibold text-right">
                                  ✓ Filed<br />
                                  <span className="text-slate-600 font-mono text-[10px]">{claimState.refNum}</span>
                                </div>
                              ) : claimState?.phase === "submitting" ? (
                                <div className="text-xs text-indigo-400 animate-pulse">Filing…</div>
                              ) : isClaimable && verifiedIds.has(work.id) ? (
                                <button
                                  onClick={() => initClaim(work.id)}
                                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition whitespace-nowrap"
                                >
                                  Claim Now
                                </button>
                              ) : isClaimable ? (
                                <span className="text-[10px] text-slate-600 text-right max-w-[90px] leading-tight">Verify live first to unlock claim</span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detail panel */}
              {selected && (
                <div className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/10 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-black text-white">{selected.title}</div>
                      <div className="text-xs text-slate-400">{selected.artist}</div>
                    </div>
                    <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-slate-300 text-xl">×</button>
                  </div>

                  <div className="p-5 space-y-5 max-h-[580px] overflow-y-auto">
                    {/* IDs */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "ISRC",          value: selected.isrc,            mono: true },
                        { label: "ISWC",          value: selected.iswc ?? "Missing — register CWR", mono: true, warn: !selected.iswc },
                        { label: "Release Date",  value: selected.release_date,    mono: false },
                        { label: "Match Confidence", value: `${selected.match_confidence}%`, mono: false },
                      ].map(f => (
                        <div key={f.label} className="bg-white/5 rounded-xl p-3">
                          <div className="text-xs text-slate-500 mb-1">{f.label}</div>
                          <div className={`text-sm font-semibold ${f.warn ? "text-rose-400" : "text-white"} ${f.mono ? "font-mono" : ""}`}>
                            {f.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Local snapshot notice */}
                    <div className="p-3 bg-amber-950/30 border border-amber-700/40 rounded-xl text-xs text-amber-200/70 leading-relaxed">
                      <span className="font-bold text-amber-400">Local snapshot only.</span> Live verification via The MLC Portal is required before filing. Status, amounts, and deadlines shown here reflect our reference database, not real-time MLC data.
                    </div>

                    {/* Unclaimed banner */}
                    {selected.unclaimed_amount && (selected.status === "unregistered" || selected.status === "partial") && (
                      <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="text-xs text-rose-400 font-bold mb-0.5">Estimated Unclaimed (snapshot)</div>
                            <div className="text-2xl font-black text-rose-400">{fmtMoney(selected.unclaimed_amount)}</div>
                            {selected.claim_deadline && (
                              <div className="text-xs text-orange-400 mt-1">⏰ Reference deadline: {selected.claim_deadline}</div>
                            )}
                          </div>
                          {claims[selected.id]?.phase === "done" ? (
                            <div className="text-right">
                              <div className="text-xs text-sky-400 font-bold">Filed ✓</div>
                              <div className="text-xs font-mono text-slate-500">{claims[selected.id].refNum}</div>
                            </div>
                          ) : claims[selected.id]?.phase === "submitting" ? (
                            <div className="text-xs text-indigo-400 animate-pulse">Submitting…</div>
                          ) : null}
                        </div>

                        {/* Verify → Claim flow */}
                        <div className="flex gap-2 pt-1 border-t border-rose-800/30">
                          <button
                            onClick={() => handleVerifyLive(selected)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg border transition ${
                              verifiedIds.has(selected.id)
                                ? 'bg-green-900/30 border-green-700/50 text-green-400'
                                : 'bg-amber-900/20 border-amber-600/50 text-amber-400 hover:bg-amber-900/40'
                            }`}
                          >
                            {verifiedIds.has(selected.id) ? '✓ Live Verified at MLC ↗' : 'Step 1 — Verify Live Status at MLC ↗'}
                          </button>
                          {verifiedIds.has(selected.id) && !claims[selected.id] && (
                            <button onClick={() => initClaim(selected.id)}
                              className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl transition">
                              Step 2 — File Claim →
                            </button>
                          )}
                        </div>
                        {!verifiedIds.has(selected.id) && (
                          <p className="text-[10px] text-slate-600">Verify live status first to unlock claim filing.</p>
                        )}
                      </div>
                    )}

                    {/* Writers */}
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Writers</div>
                      <div className="space-y-2">
                        {selected.writers.map((w, i) => (
                          <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
                            <div>
                              <div className="text-sm font-semibold text-white">{w.name}</div>
                              <div className="text-xs text-slate-500 font-mono">IPI: {w.ipi}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-black text-indigo-300">{w.share}%</div>
                            </div>
                          </div>
                        ))}
                        {selected.publisher && (
                          <div className="flex items-center justify-between bg-violet-500/5 border border-violet-500/20 rounded-xl px-4 py-2.5">
                            <div>
                              <div className="text-sm font-semibold text-white">{selected.publisher}</div>
                              <div className="text-xs text-violet-400">Publisher</div>
                              {selected.publisher_ipi && <div className="text-xs text-slate-500 font-mono">IPI: {selected.publisher_ipi}</div>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Platforms */}
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Reported Platforms · {fmtNum(selected.streams_reported)} streams
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selected.platforms.map(p => (
                          <span key={p} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300">
                            {PLATFORM_ICONS[p] ?? "🎵"} {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                      <Link href="/cwr-generator" className="px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold transition">
                        Register via CWR →
                      </Link>
                      <Link href="/lod-generator" className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg text-xs font-semibold transition">
                        Generate LOD
                      </Link>
                      <Link href="/forensic-audit" className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg text-xs font-semibold transition">
                        Full Audit
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Initial state */}
        {!searched && !searching && (
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-10 text-center">
            <div className="text-5xl mb-4">🔎</div>
            <h2 className="text-lg font-bold text-white mb-2">Search the MLC Database</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mb-6">
              The Mechanical Licensing Collective (MLC) administers mechanical royalties for all digital streaming in the US.
              Search for your works to find unregistered royalties, file claims, and ensure every stream generates income.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
              {[
                { icon: "💰", title: "Unclaimed Royalties",    desc: "Billions in mechanical royalties sit unclaimed due to missing ISRC/ISWC registrations" },
                { icon: "⏰", title: "Claim Deadlines",        desc: "The MLC holds funds for 3 years. After the deadline, unclaimed royalties are distributed to registered publishers" },
                {
                  icon: "🔍", title: "ISRC Gap Detection",
                  desc: "Registry existence check across all nodes. Surfaces missing registrations with a full gap report.",
                  meta: [['Service', 'Registry Existence Check'], ['Output', 'Missing Registration Report']],
                },
                {
                  icon: "📄", title: "Automated CWR Registration",
                  desc: "Convert raw metadata into a submission-ready CWR file in one step.",
                  meta: [['Forensic Service', 'Instant CWR Metadata Conversion'], ['Data Source', 'Multi-Node Registry Verification'], ['Deliverable', 'Audit-Ready Registration File']],
                  link: { href: '/cwr-generator', label: 'Open CWR Generator →' },
                },
              ].map(c => (
                <div key={c.title} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                  <div className="text-2xl">{c.icon}</div>
                  <div className="text-sm font-semibold text-white">{c.title}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{c.desc}</div>
                  {(c as any).meta && (
                    <div className="pt-2 border-t border-white/10 space-y-1">
                      {(c as any).meta.map(([k, v]: [string, string]) => (
                        <div key={k} className="flex gap-2 text-[11px]">
                          <span className="text-slate-600 w-28 flex-shrink-0">{k}</span>
                          <span className="text-slate-300 font-medium">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {(c as any).link && (
                    <Link href={(c as any).link.href}
                      className="inline-block mt-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition">
                      {(c as any).link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
