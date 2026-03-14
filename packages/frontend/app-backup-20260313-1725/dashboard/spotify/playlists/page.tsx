"use client";

import { useEffect, useState } from "react";

export default function PlaylistTracker() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/spotify/playlists")
      .then(res => res.json())
      .then(data => {
        setPlaylists(data.playlists || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          <span className="text-green-400">📋</span> Playlist Tracker
        </h1>

        {loading ? (
          <div className="text-center py-12">Loading playlists...</div>
        ) : (
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-4 text-left">Playlist Name</th>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Followers</th>
                  <th className="p-4 text-left">Tracks</th>
                  <th className="p-4 text-left">Last Updated</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {playlists.map((p: any, i: number) => (
                  <tr key={i} className="border-t border-gray-800 hover:bg-gray-800/30">
                    <td className="p-4 font-medium">{p.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        p.type === 'editorial' ? 'bg-purple-600/20 text-purple-400' :
                        p.type === 'algorithmic' ? 'bg-blue-600/20 text-blue-400' :
                        'bg-gray-600/20 text-gray-400'
                      }`}>
                        {p.type}
                      </span>
                    </td>
                    <td className="p-4">{p.followers?.toLocaleString() || 0}</td>
                    <td className="p-4">{p.track_count || 0}</td>
                    <td className="p-4">{p.last_seen || 'N/A'}</td>
                    <td className="p-4">
                      <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
