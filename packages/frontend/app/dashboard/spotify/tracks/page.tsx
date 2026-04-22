"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TrackAnalytics() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leakSummary, setLeakSummary] = useState({
    totalLost: 0,
    missingPro: 0,
    missingMlc: 0,
    missingWriters: 0,
    missingPublishers: 0,
    isrcMismatches: 0
  });

  useEffect(() => {
    fetch("/api/spotify/tracks")
      .then(res => res.json())
      .then(data => {
        console.log("Tracks data:", data);
        setTracks(data.tracks || []);
        
        // Calculate leak summary
        const summary = {
          totalLost: 62200, // Sample data - will come from real calculation
          missingPro: 12400,
          missingMlc: 8200,
          missingWriters: 15000,
          missingPublishers: 21000,
          isrcMismatches: 5600
        };
        setLeakSummary(summary);
        setLoading(false);
      });
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">🔄</div>
          <div className="text-purple-400">Loading royalty intelligence...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-black mb-2">
              <span className="text-rose-400">💰 Royalty Leak</span>{" "}
              <span className="text-purple-400">Detection</span>
            </h1>
            <p className="text-gray-400 text-lg">Find unclaimed money across your catalog</p>
          </div>
          <Link href="/dashboard/spotify/analytics">
            <button className="bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-500 transition font-bold">
              📊 View Full Analytics
            </button>
          </Link>
        </div>

        {/* Money Leak Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-rose-900 to-rose-950 p-6 rounded-xl border border-rose-500">
            <div className="text-sm text-rose-300 mb-1">TOTAL UNPAID</div>
            <div className="text-4xl font-bold text-white">{formatCurrency(leakSummary.totalLost)}</div>
            <div className="text-xs text-rose-400 mt-2">Estimated recoverable royalties</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-900 to-yellow-950 p-6 rounded-xl border border-yellow-500">
            <div className="text-sm text-yellow-300 mb-1">PRO MISSING</div>
            <div className="text-3xl font-bold text-white">{formatCurrency(leakSummary.missingPro)}</div>
            <div className="text-xs text-yellow-400 mt-2">ASCAP/BMI/SOCAN unregistered</div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-6 rounded-xl border border-indigo-500">
            <div className="text-sm text-indigo-300 mb-1">MLC MISSING</div>
            <div className="text-3xl font-bold text-white">{formatCurrency(leakSummary.missingMlc)}</div>
            <div className="text-xs text-indigo-400 mt-2">Mechanical royalties unclaimed</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900 to-purple-950 p-6 rounded-xl border border-purple-500">
            <div className="text-sm text-purple-300 mb-1">ISRC MISMATCHES</div>
            <div className="text-3xl font-bold text-white">{formatCurrency(leakSummary.isrcMismatches)}</div>
            <div className="text-xs text-purple-400 mt-2">Neighboring rights lost</div>
          </div>
        </div>

        {/* Featured Track - "Not Like Us" Example */}
        <div className="mb-8 bg-gradient-to-r from-purple-900/50 via-rose-900/50 to-rose-900/50 rounded-2xl border border-purple-500 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-6xl">🎵</div>
            <div>
              <h2 className="text-3xl font-bold text-white">"Not Like Us" - Kendrick Lamar</h2>
              <div className="flex gap-4 mt-2 text-sm">
                <span className="bg-emerald-600/20 text-emerald-400 px-3 py-1 rounded-full">✓ On Spotify</span>
                <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full">42M monthly listeners</span>
                <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full">8.2M streams (30d)</span>
              </div>
            </div>
          </div>

          {/* Money Leak Details */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-rose-400">🚨 MONEY LEAK DETECTED</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-rose-900/20 rounded-lg border border-rose-800">
                  <div>
                    <div className="font-medium">❌ MISSING: ASCAP Registration</div>
                    <div className="text-sm text-gray-400">Performance royalties unpaid</div>
                  </div>
                  <div className="text-2xl font-bold text-rose-400">$12,400</div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-yellow-900/20 rounded-lg border border-yellow-800">
                  <div>
                    <div className="font-medium">❌ MISSING: MLC Registration</div>
                    <div className="text-sm text-gray-400">Mechanical royalties unpaid</div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">$8,200</div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-indigo-900/20 rounded-lg border border-indigo-800">
                  <div>
                    <div className="font-medium">❌ MISSING: Writers (2 unregistered)</div>
                    <div className="text-sm text-gray-400">Publishing royalties lost</div>
                  </div>
                  <div className="text-2xl font-bold text-indigo-400">$15,000</div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-purple-900/20 rounded-lg border border-purple-800">
                  <div>
                    <div className="font-medium">❌ MISSING: Publishers (3 unregistered)</div>
                    <div className="text-sm text-gray-400">Publishing share unclaimed</div>
                  </div>
                  <div className="text-2xl font-bold text-purple-400">$21,000</div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-rose-900/20 rounded-lg border border-rose-800">
                  <div>
                    <div className="font-medium">❌ ISRC MISMATCH</div>
                    <div className="text-sm text-gray-400">Neighboring rights lost</div>
                  </div>
                  <div className="text-2xl font-bold text-rose-400">$5,600</div>
                </div>
              </div>
              
              <div className="mt-6 p-6 bg-gradient-to-r from-emerald-900 to-emerald-950 rounded-xl border border-emerald-500">
                <div className="text-sm text-emerald-300 mb-1">💰 TOTAL UNPAID</div>
                <div className="text-4xl font-bold text-white">$62,200</div>
                <div className="text-sm text-emerald-400 mt-2">Recoverable royalties identified</div>
              </div>
            </div>

            {/* Evidence Pack */}
            <div className="bg-black/60 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold mb-4 text-amber-400">⚖️ EVIDENCE PACK</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-emerald-400">📸</span>
                  <span>Playlist placement screenshots (RapCaviar, Most Necessary)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-emerald-400">📋</span>
                  <span>PRO registration status report</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-emerald-400">📊</span>
                  <span>Stream count verification (8.2M last 30 days)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-emerald-400">🧮</span>
                  <span>Loss calculation methodology</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-emerald-400">⚖️</span>
                  <span>Court-ready affidavit template</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-lg transition">
                  📄 Generate PDF Report
                </button>
                <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-lg transition">
                  📧 Email to Attorney
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Track List */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
          <h2 className="text-2xl font-bold mb-4">📋 All Tracks</h2>
          <div className="space-y-2">
            {tracks.map((track: any, i: number) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 cursor-pointer transition"
                onClick={() => setSelectedTrack(track)}
              >
                <div>
                  <div className="font-medium">{track.name || `Track ${i+1}`}</div>
                  <div className="text-sm text-gray-400">{track.artist || 'Unknown'}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Popularity</div>
                    <div className="font-bold text-emerald-400">{track.popularity || 50}</div>
                  </div>
                  <div className="text-rose-400">🔍</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-8 text-xs text-gray-600 text-center">
          * Loss calculations are estimates based on industry standard rates and stream counts.
          Final amounts may vary based on PRO/MLC audits and royalty statements.
        </div>
      </div>
    </div>
  );
}
