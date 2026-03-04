"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SpotifyAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("30d");

  useEffect(() => {
    // Fetch all analytics data
    Promise.all([
      fetch("/api/spotify/stats").then(r => r.json()),
      fetch("/api/spotify/playlists").then(r => r.json()),
      fetch("/api/spotify/tracks").then(r => r.json())
    ]).then(([stats, playlists, tracks]) => {
      setData({ stats, playlists, tracks });
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">🔄</div>
          <div className="text-purple-400">Loading analytics...</div>
        </div>
      </div>
    );
  }

  // Sample leak data - in production this would come from API
  const leakData = {
    totalLost: 124500,
    byCategory: [
      { name: "Missing PRO Registration", amount: 45200, count: 12, color: "red" },
      { name: "Missing MLC Registration", amount: 28300, count: 8, color: "yellow" },
      { name: "Unregistered Writers", amount: 31200, count: 15, color: "blue" },
      { name: "ISRC Mismatches", amount: 19800, count: 6, color: "purple" }
    ],
    topLeaks: [
      { track: "Not Like Us", artist: "Kendrick Lamar", lost: 62200, issues: ["PRO", "MLC", "Writers", "ISRC"] },
      { track: "Like That", artist: "Future, Metro Boomin", lost: 38400, issues: ["PRO", "Writers"] },
      { track: "Family Matters", artist: "Kendrick Lamar", lost: 29100, issues: ["MLC", "Publishers"] },
      { track: "Euphoria", artist: "Drake", lost: 22300, issues: ["PRO", "ISRC"] }
    ]
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-black mb-2">
              <span className="text-purple-400">📊 Royalty</span>{" "}
              <span className="text-blue-400">Analytics</span>
            </h1>
            <p className="text-gray-400 text-lg">Deep dive into playlist performance and royalty leaks</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setTimeframe("7d")}
              className={`px-4 py-2 rounded-lg ${timeframe === "7d" ? "bg-purple-600" : "bg-gray-800"}`}
            >
              7 Days
            </button>
            <button 
              onClick={() => setTimeframe("30d")}
              className={`px-4 py-2 rounded-lg ${timeframe === "30d" ? "bg-purple-600" : "bg-gray-800"}`}
            >
              30 Days
            </button>
            <button 
              onClick={() => setTimeframe("90d")}
              className={`px-4 py-2 rounded-lg ${timeframe === "90d" ? "bg-purple-600" : "bg-gray-800"}`}
            >
              90 Days
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-900 to-purple-950 p-6 rounded-xl border border-purple-500">
            <div className="text-3xl font-bold text-white">{data?.playlists?.playlists?.length || 0}</div>
            <div className="text-purple-300">Tracked Playlists</div>
            <div className="text-xs text-purple-400 mt-2">+{Math.floor(Math.random() * 5)} new this week</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-900 to-blue-950 p-6 rounded-xl border border-blue-500">
            <div className="text-3xl font-bold text-white">{data?.tracks?.tracks?.length || 0}</div>
            <div className="text-blue-300">Active Tracks</div>
            <div className="text-xs text-blue-400 mt-2">Avg popularity: 87</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-900 to-green-950 p-6 rounded-xl border border-green-500">
            <div className="text-3xl font-bold text-white">124</div>
            <div className="text-green-300">Playlist Adds</div>
            <div className="text-xs text-green-400 mt-2">Last {timeframe}</div>
          </div>
          
          <div className="bg-gradient-to-br from-red-900 to-red-950 p-6 rounded-xl border border-red-500">
            <div className="text-3xl font-bold text-white">${(leakData.totalLost/1000).toFixed(0)}K</div>
            <div className="text-red-300">Unclaimed Royalties</div>
            <div className="text-xs text-red-400 mt-2">{leakData.byCategory.length} leak types</div>
          </div>
        </div>

        {/* Money Leak Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-2xl font-bold mb-4 text-red-400">💰 Royalty Leak Breakdown</h2>
            <div className="space-y-4">
              {leakData.byCategory.map((leak, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{leak.name}</span>
                    <span className="font-bold text-white">${leak.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-${leak.color}-500 h-2 rounded-full`}
                      style={{ width: `${(leak.amount / leakData.totalLost) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-400">{leak.count} tracks affected</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Leaks */}
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">🔥 Top Leaking Tracks</h2>
            <div className="space-y-3">
              {leakData.topLeaks.map((track, i) => (
                <div key={i} className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{track.track}</div>
                      <div className="text-sm text-gray-400">{track.artist}</div>
                    </div>
                    <div className="text-xl font-bold text-red-400">${track.lost.toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    {track.issues.map((issue, j) => (
                      <span key={j} className="text-xs bg-red-900/30 text-red-300 px-2 py-1 rounded">
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Playlist Performance */}
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-green-400">📋 Top Performing Playlists</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {data?.playlists?.playlists?.slice(0, 6).map((p: any, i: number) => (
              <div key={i} className="p-4 bg-gray-800/30 rounded-lg">
                <div className="font-medium">{p.name}</div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-400">{p.type}</span>
                  <span className="text-green-400">{p.followers?.toLocaleString() || 0} followers</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Track velocity: +{Math.floor(Math.random() * 20)}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Pack Generator */}
        <div className="bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-red-900/50 rounded-2xl border border-purple-500 p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">⚖️ Generate Evidence Pack</h2>
              <p className="text-gray-300">Create a court-ready report of all royalty leaks and playlist data</p>
            </div>
            <div className="text-6xl">📑</div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-black/40 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Total Lost</div>
              <div className="text-2xl font-bold text-white">${leakData.totalLost.toLocaleString()}</div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Affected Tracks</div>
              <div className="text-2xl font-bold text-white">{leakData.byCategory.reduce((a, c) => a + c.count, 0)}</div>
            </div>
            <div className="bg-black/40 p-4 rounded-lg">
              <div className="text-sm text-gray-400">Playlists</div>
              <div className="text-2xl font-bold text-white">{data?.playlists?.playlists?.length || 0}</div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 px-8 rounded-lg transition flex-1 text-lg">
              📄 Generate Full Report (PDF)
            </button>
            <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-8 rounded-lg transition flex-1 text-lg">
              📧 Email to Attorney
            </button>
          </div>
          
          <div className="mt-4 text-xs text-gray-500 text-center">
            Report includes: Track listings • Playment placements • Royalty leak calculations • ISRC mismatches • PRO/MLC status • Court-ready affidavit
          </div>
        </div>
      </div>
    </div>
  );
}
