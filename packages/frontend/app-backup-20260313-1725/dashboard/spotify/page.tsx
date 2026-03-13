"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SpotifyDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/spotify/stats').then(res => res.json()),
      fetch('/api/spotify/playlists').then(res => res.json())
    ])
    .then(([statsData, playlistsData]) => {
      console.log('Stats:', statsData);
      console.log('Playlists:', playlistsData);
      setStats(statsData);
      setPlaylists(playlistsData.playlists || []);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">🔄</div>
          <div className="text-purple-400">Loading Spotify data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/50 border border-red-500 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Data</h2>
            <p className="text-gray-300">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 px-4 py-2 rounded hover:bg-red-500"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black mb-8">
          <span className="text-green-400">🎵 Spotify</span>{" "}
          <span className="text-purple-400">Intelligence</span>
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-400">{stats?.total_playlists || 0}</div>
            <div className="text-gray-400">Tracked Playlists</div>
          </div>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-400">{stats?.total_tracks || 0}</div>
            <div className="text-gray-400">Total Tracks</div>
          </div>
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
            <div className="text-3xl font-bold text-purple-400">{stats?.avg_popularity || 0}</div>
            <div className="text-gray-400">Avg Popularity</div>
          </div>
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6">
            <div className="text-3xl font-bold text-yellow-400">{stats?.recent_adds || 0}</div>
            <div className="text-gray-400">Added (7d)</div>
          </div>
        </div>

        {/* Sample Playlists Preview */}
        {playlists.length > 0 && (
          <div className="mb-8 bg-gray-900/30 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-green-400">📋 Recent Playlists</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {playlists.slice(0, 4).map((p: any, i: number) => (
                <div key={i} className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-400">{p.type} • {p.followers?.toLocaleString()} followers</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="/dashboard/spotify/playlists">
            <div className="bg-gradient-to-br from-green-900 to-green-950 p-6 rounded-xl border border-green-500 hover:scale-105 transition-all cursor-pointer">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-bold mb-2">Playlist Tracker</h3>
              <p className="text-gray-300 text-sm">View all tracked playlists and their performance</p>
            </div>
          </Link>
          
          <Link href="/dashboard/spotify/tracks">
            <div className="bg-gradient-to-br from-blue-900 to-blue-950 p-6 rounded-xl border border-blue-500 hover:scale-105 transition-all cursor-pointer">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-bold mb-2">Track Popularity</h3>
              <p className="text-gray-300 text-sm">Monitor track popularity scores and trends</p>
            </div>
          </Link>
          
          <Link href="/dashboard/spotify/analytics">
            <div className="bg-gradient-to-br from-purple-900 to-purple-950 p-6 rounded-xl border border-purple-500 hover:scale-105 transition-all cursor-pointer">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Analytics</h3>
              <p className="text-gray-300 text-sm">Deep dive into playlist and track analytics</p>
            </div>
          </Link>
        </div>

        {/* Debug Info (remove in production) */}
        <div className="mt-8 p-4 bg-gray-900/30 rounded-xl">
          <details>
            <summary className="text-sm text-gray-400 cursor-pointer">Debug Info</summary>
            <pre className="mt-2 text-xs text-gray-500 overflow-auto">
              {JSON.stringify({stats, playlistsCount: playlists.length}, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
