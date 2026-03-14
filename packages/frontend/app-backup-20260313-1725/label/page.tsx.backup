"use client";

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Track {
  rank: number;
  title: string;
  artist: string;
  streams?: number;
  revenue?: number;
}

interface Transaction {
  track: string;
  amount: number | null;
  status: 'completed' | 'pending' | 'flagged';
  time: string;
}

export default function LabelDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [showDemoPayment, setShowDemoPayment] = useState(false);
  const [demoTrack, setDemoTrack] = useState<any>(null);

  const topTracks: Track[] = [
    { rank: 1, title: 'DRIP TOO HARD', artist: 'Gunna / Lil Baby' },
    { rank: 2, title: 'MIDNIGHT DRIVE', artist: 'Jay Rock' },
    { rank: 3, title: 'STREET RUNNER', artist: 'Metro Boomin / Future' },
    { rank: 4, title: 'LATE NIGHT VIBES', artist: 'SZA' },
    { rank: 5, title: 'WEST COAST', artist: 'Schoolboy Q' },
  ];

  const recentTransactions: Transaction[] = [
    { track: 'MIDNIGHT DRIVE', amount: null, status: 'completed', time: '2h ago' },
    { track: 'DRIP TOO HARD', amount: null, status: 'pending', time: '5h ago' },
    { track: 'STREET RUNNER', amount: null, status: 'completed', time: '1d ago' },
    { track: 'LATE NIGHT VIBES', amount: null, status: 'flagged', time: '1d ago' },
  ];

  const handleDemoPayment = (track: Track) => {
    setDemoTrack(track);
    setShowDemoPayment(true);
  };

  const closeDemoPayment = () => {
    setShowDemoPayment(false);
    setDemoTrack(null);
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Demo Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 text-center text-base font-medium flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-4">
        <span>🎮 Demo Mode Active – No wallet needed. All data simulated for preview.</span>
        <button 
          onClick={() => handleDemoPayment(topTracks[0])}
          className="bg-white/20 hover:bg-white/30 px-5 py-2 rounded-full text-sm font-bold flex items-center space-x-2 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
          </svg>
          <span>Run Demo Payment</span>
        </button>
      </div>

      {/* Navbar / Header */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-900/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-3xl font-bold neon-purple">TrapRoyalties Pro</Link>
              <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full font-medium">LABEL PORTAL</span>
            </div>

            <div className="hidden md:flex items-center space-x-6 flex-1 max-w-2xl mx-12">
              <div className="relative flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" className="absolute left-4 top-1/2 -translate-y-1/2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search tracks, ISRC, artists..." 
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-purple-900/50 rounded-full focus:outline-none focus:border-purple-500 text-white placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-4 bg-gray-900/70 px-4 py-2 rounded-full border border-purple-800/50">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Demo Balance</p>
                  <p className="text-lg font-bold text-cyan-400">1,245 MON</p>
                </div>
                <div className="text-sm bg-purple-900/50 px-3 py-1 rounded-full">0x742d...f44e</div>
              </div>

              <button className="relative p-3 hover:bg-gray-800 rounded-full transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                </svg>
                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">TDE</div>
                <div className="hidden lg:block">
                  <p className="font-medium">Top Dawg Ent.</p>
                  <p className="text-xs text-gray-500">Demo Label</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard */}
      <main className="pt-10 pb-20 px-6 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-900/70 to-pink-900/70 rounded-3xl p-8 mb-12 border border-purple-800/50 backdrop-blur-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold neon-cyan mb-3">Label Portal</h1>
              <p className="text-xl text-purple-200">Verifiable royalties • On-chain splits • Missing bag recovery</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/royalty-finder" 
                className="px-6 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold flex items-center space-x-3 transition backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
                <span>Find Missing Royalties</span>
              </Link>
              <button className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold flex items-center space-x-3 hover:from-purple-500 hover:to-pink-500 transition shadow-lg shadow-purple-900/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/>
                </svg>
                <span>Export Full Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="flex flex-wrap gap-6 mb-10 border-b border-purple-900/30 pb-4">
          <button className="px-6 py-3 font-bold text-lg border-b-4 border-purple-600 text-purple-400">Dashboard</button>
          <Link 
            href="/split-verification" 
            className="px-6 py-3 font-bold text-lg text-gray-400 hover:text-purple-400 transition"
          >
            Split Verification
          </Link>
          <button className="px-6 py-3 font-bold text-lg text-gray-400 hover:text-purple-400 transition">Statements & Payouts</button>
          <button className="px-6 py-3 font-bold text-lg text-gray-400 hover:text-purple-400 transition">Catalog</button>
        </div>

        {/* Time Filter */}
        <div className="flex justify-end mb-8">
          <div className="bg-gray-900/70 rounded-full p-1.5 border border-purple-900/50 flex">
            {['day', 'week', 'month', 'quarter'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-2 text-sm font-medium rounded-full transition ${
                  selectedPeriod === period
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { title: 'Total Catalog Value', color: 'blue', icon: 'dollar' },
            { title: 'Monthly Royalties', color: 'green', icon: 'trending' },
            { title: 'Pending Payments', color: 'yellow', icon: 'clock' },
            { title: 'Risk Exposure', color: 'red', icon: 'alert' },
          ].map((card, idx) => (
            <div key={idx} className="bg-gray-900/70 rounded-2xl p-6 border border-purple-900/50 hover:border-purple-600 transition">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-4 bg-${card.color}-900/30 rounded-xl`}>
                  {card.icon === 'dollar' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2">
                      <line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  )}
                  {card.icon === 'trending' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
                    </svg>
                  )}
                  {card.icon === 'clock' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  )}
                  {card.icon === 'alert' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-400">Live Q3 2026</span>
              </div>
              <p className="text-lg text-gray-300 mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-gray-200 italic">--</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Top Tracks */}
          <div className="lg:col-span-2 bg-gray-900/70 rounded-3xl border border-purple-900/50 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold neon-purple">Top Performing Tracks</h2>
              <Link href="#" className="text-purple-400 hover:text-purple-300 font-medium flex items-center">
                View Full Catalog →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 border-b border-purple-900/30">
                    <th className="pb-4 font-medium">#</th>
                    <th className="pb-4 font-medium">Track</th>
                    <th className="pb-4 font-medium">Artist</th>
                    <th className="pb-4 font-medium text-right">Streams</th>
                    <th className="pb-4 font-medium text-right">Est. Revenue</th>
                    <th className="pb-4 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {topTracks.map((track) => (
                    <tr key={track.rank} className="border-b border-purple-900/20 hover:bg-gray-800/50 transition">
                      <td className="py-5 font-medium text-gray-300">{track.rank}</td>
                      <td className="py-5 font-medium">{track.title}</td>
                      <td className="py-5 text-gray-400">{track.artist}</td>
                      <td className="py-5 text-right text-gray-400 italic">--</td>
                      <td className="py-5 text-right font-medium text-gray-300 italic">--</td>
                      <td className="py-5 text-center">
                        <button 
                          onClick={() => handleDemoPayment(track)}
                          className="text-xs bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-full transition"
                        >
                          Demo Pay
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-8">
            {/* Demo Payment Widget */}
            <div className="bg-gray-900/70 rounded-3xl border border-purple-900/50 p-8">
              <h2 className="text-2xl font-bold neon-cyan mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" className="mr-4">
                  <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                </svg>
                Demo Royalty Payment
              </h2>
              <p className="text-gray-400 mb-6">Simulate a verified split payout — no wallet required.</p>
              <div className="bg-purple-900/30 rounded-2xl p-6 mb-6">
                <div className="flex justify-between mb-3">
                  <span className="font-medium">DRIP TOO HARD</span>
                  <span className="font-bold text-cyan-400">$18,750.00</span>
                </div>
                <div className="text-sm text-gray-400 mb-4">Gunna / Lil Baby • 4-way split</div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                  <div>50% Artist</div><div className="text-right">$9,375</div>
                  <div>20% Producer</div><div className="text-right">$3,750</div>
                  <div>20% Feature</div><div className="text-right">$3,750</div>
                  <div>10% Label</div><div className="text-right">$1,875</div>
                </div>
              </div>
              <button 
                onClick={() => handleDemoPayment(topTracks[0])}
                className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-xl hover:from-purple-500 hover:to-pink-500 transition shadow-lg shadow-purple-900/50"
              >
                Run Demo Payment
              </button>
            </div>

            {/* Recent Transactions */}
            <div className="bg-gray-900/70 rounded-3xl border border-purple-900/50 p-8">
              <h2 className="text-2xl font-bold neon-purple mb-6">Recent Transactions (Demo)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-purple-900/30">
                      <th className="pb-4">Track</th>
                      <th className="pb-4">Amount</th>
                      <th className="pb-4 text-center">Status</th>
                      <th className="pb-4">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx, idx) => (
                      <tr key={idx} className="border-b border-purple-900/20">
                        <td className="py-4 font-medium">{tx.track}</td>
                        <td className="py-4 text-gray-300 italic">--</td>
                        <td className="py-4 text-center">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            tx.status === 'completed' ? 'bg-green-900/50 text-green-300' :
                            tx.status === 'pending' ? 'bg-yellow-900/50 text-yellow-300' :
                            'bg-red-900/50 text-red-300'
                          }`}>
                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 text-gray-500">{tx.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links / CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-3xl p-10 border border-purple-800/50 text-center">
          <h2 className="text-4xl font-bold neon-cyan mb-6">Ready to Go Live?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Demo mode shows the power — connect your real catalog for live scans, verified splits, and on-chain royalty recovery.
          </p>
          <Link 
            href="/founding-member" 
            className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-6 px-12 rounded-full text-2xl shadow-2xl shadow-pink-900/50 transition transform hover:scale-105"
          >
            Join Royalty Accelerator – Limited Spots
          </Link>
        </div>
      </main>

      {/* Demo Payment Modal */}
      {showDemoPayment && demoTrack && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl border-2 border-purple-500 p-8 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold neon-cyan">Demo Payment</h3>
              <button 
                onClick={closeDemoPayment}
                className="p-2 hover:bg-gray-800 rounded-full transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="bg-purple-900/30 rounded-2xl p-6 mb-6">
              <div className="flex justify-between mb-4">
                <span className="text-xl font-bold">{demoTrack.title}</span>
                <span className="text-2xl font-bold text-cyan-400">$18,750.00</span>
              </div>
              <p className="text-gray-400 mb-4">{demoTrack.artist}</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
                  <div>
                    <p className="font-medium">Artist Share</p>
                    <p className="text-sm text-gray-400">Primary artist</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">$9,375</p>
                    <p className="text-xs text-gray-400">50%</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
                  <div>
                    <p className="font-medium">Producer Share</p>
                    <p className="text-sm text-gray-400">Beat production</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">$3,750</p>
                    <p className="text-xs text-gray-400">20%</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
                  <div>
                    <p className="font-medium">Feature Share</p>
                    <p className="text-sm text-gray-400">Guest artist</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">$3,750</p>
                    <p className="text-xs text-gray-400">20%</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
                  <div>
                    <p className="font-medium">Label Share</p>
                    <p className="text-sm text-gray-400">Administration</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">$1,875</p>
                    <p className="text-xs text-gray-400">10%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition">
                Process Demo Payment
              </button>
              <button 
                onClick={closeDemoPayment}
                className="w-full py-4 bg-gray-800 hover:bg-gray-700 rounded-full font-bold text-lg transition"
              >
                Cancel
              </button>
            </div>

            <p className="text-center text-gray-500 text-sm mt-4">
              Demo mode – no real transactions
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}