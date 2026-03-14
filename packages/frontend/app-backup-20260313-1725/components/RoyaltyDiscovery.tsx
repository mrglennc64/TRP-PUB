"use client";

import { useState } from "react";
import {
  Search,
  Music,
  User,
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from "lucide-react";

interface Artist {
  id: string;
  name: string;
  image?: string;
}

interface RoyaltyEstimate {
  trackId: string;
  trackName: string;
  estimatedAmount: number;
  confidence: 'high' | 'medium' | 'low';
}

export default function RoyaltyDiscovery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<Artist[]>([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setSearching(true);
    // Simulate API call
    setTimeout(() => {
      setResults([
        { id: "1", name: "Kendrick Lamar" },
        { id: "2", name: "Jay Rock" },
        { id: "3", name: "Schoolboy Q" }
      ]);
      setSearching(false);
    }, 1000);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Royalty Discovery</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for an artist..."
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button
          onClick={handleSearch}
          disabled={searching}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {searching ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
        </button>
      </div>
    </div>
  );
}