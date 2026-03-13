"use client";

import { useEffect, useState } from "react";

export default function AdminSpotify() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    fetch("/api/admin/playlists")
      .then(res => res.json())
      .then(setPlaylists);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          <span className="text-red-400">⚙️</span> Spotify Admin
        </h1>
        
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
          <h2 className="text-xl font-bold mb-4">Tracked Playlists</h2>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="pb-2">Name</th>
                <th className="pb-2">ID</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Active</th>
              </tr>
            </thead>
            <tbody>
              {playlists.map((p: any) => (
                <tr key={p.playlist_id} className="border-t border-gray-800">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2 font-mono text-sm">{p.playlist_id}</td>
                  <td className="py-2">{p.type}</td>
                  <td className="py-2">{p.active ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
