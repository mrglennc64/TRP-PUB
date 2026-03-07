'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function LabelPortal() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedArtist, setSelectedArtist] = useState(null);

  // Mock data for demonstration
  const artists = [
    { id: 1, name: 'Drake', recouped: true, earnings: 1250000, expenses: 800000 },
    { id: 2, name: 'Travis Scott', recouped: false, earnings: 950000, expenses: 1200000 },
    { id: 3, name: '21 Savage', recouped: true, earnings: 750000, expenses: 450000 },
    { id: 4, name: 'Metro Boomin', recouped: false, earnings: 450000, expenses: 600000 },
  ];

  const stats = {
    totalArtists: artists.length,
    unrecoupedBalance: artists.filter(a => !a.recouped).reduce((sum, a) => sum + (a.expenses - a.earnings), 0),
    readyToPay: artists.filter(a => a.recouped).reduce((sum, a) => sum + (a.earnings - a.expenses), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-6 px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Label Operations Portal</h1>
            <p className="text-indigo-200 mt-1">Automate your catalog. Track recoupment. Pay artists instantly.</p>
          </div>
          <Link href="/" className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
            ← Back to Main Site
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-8">
        <nav className="flex gap-8">
          {['dashboard', 'catalog', 'recoupment', 'contracts', 'payouts'].map(view => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`py-4 px-2 capitalize font-medium transition ${
                activeView === view 
                  ? 'border-b-2 border-indigo-900 text-indigo-900' 
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              {view}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {activeView === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-600 mb-1">Total Artists</p>
                <p className="text-3xl font-bold text-indigo-900">{stats.totalArtists}</p>
                <p className="text-xs text-green-600 mt-2">+2 this month</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-600 mb-1">Unrecouped Balance</p>
                <p className="text-3xl font-bold text-yellow-600">
                  ${stats.unrecoupedBalance.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-2">Across {artists.filter(a => !a.recouped).length} artists</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-600 mb-1">Ready to Pay</p>
                <p className="text-3xl font-bold text-green-600">
                  ${stats.readyToPay.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-2">{artists.filter(a => a.recouped).length} artists recouped</p>
              </div>
            </div>

            {/* Recent Artists */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold mb-4">Artists</h3>
              <div className="space-y-3">
                {artists.map(artist => (
                  <div key={artist.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{artist.name}</p>
                      <p className="text-sm text-gray-500">
                        Earnings: ${artist.earnings.toLocaleString()} | Expenses: ${artist.expenses.toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      artist.recouped 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {artist.recouped ? '✅ Recouped' : '⏳ Not Recouped'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'recoupment' && (
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold mb-3">Artists</h3>
              <div className="space-y-2">
                {artists.map(artist => (
                  <button
                    key={artist.id}
                    onClick={() => setSelectedArtist(artist)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedArtist?.id === artist.id
                        ? 'bg-indigo-50 border-indigo-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-medium">{artist.name}</p>
                    <p className="text-xs text-gray-500">
                      {artist.recouped ? '✅ Recouped' : '💰 ' + (artist.expenses - artist.earnings).toLocaleString() + ' owed'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            <div className="col-span-3">
              {selectedArtist ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold mb-4">{selectedArtist.name}</h2>
                  
                  <div className={`p-6 rounded-xl mb-6 ${
                    selectedArtist.recouped ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Current Balance</p>
                        <p className={`text-3xl font-bold ${
                          selectedArtist.recouped ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          ${(selectedArtist.earnings - selectedArtist.expenses).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Status</p>
                        <p className={`text-xl font-semibold ${
                          selectedArtist.recouped ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {selectedArtist.recouped ? '✅ RECOUPED' : '⏳ NOT RECOUPED'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <p className="text-sm text-indigo-600">Total Earnings</p>
                      <p className="text-2xl font-bold text-indigo-900">
                        ${selectedArtist.earnings.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-600">Total Expenses</p>
                      <p className="text-2xl font-bold text-red-900">
                        ${selectedArtist.expenses.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Add Expense Form */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-semibold mb-3">Add Recoupable Expense</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Amount $"
                        className="p-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        className="p-2 border border-gray-300 rounded-lg"
                      />
                      <select className="p-2 border border-gray-300 rounded-lg">
                        <option>Select type</option>
                        <option>Advance</option>
                        <option>Music Video</option>
                        <option>Marketing</option>
                        <option>Studio Time</option>
                      </select>
                    </div>
                    <button className="mt-3 px-4 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800">
                      Add Expense
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                  <p className="text-gray-500">Select an artist to view recoupment details</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'contracts' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold mb-6">Upload Contract</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-indigo-500 transition cursor-pointer">
              <div className="text-4xl mb-4">📄</div>
              <p className="text-gray-600 mb-2">Drop your contract PDF here</p>
              <p className="text-sm text-gray-500 mb-4">or click to browse</p>
              <button className="px-6 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800">
                Select File
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              We'll automatically extract splits and apply them to the artist's catalog.
            </p>
          </div>
        )}

        {activeView === 'payouts' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold mb-6">One-Click Mass Payouts</h2>
            <div className="p-8 bg-indigo-50 rounded-xl text-center">
              <p className="text-lg mb-4">Pay {artists.filter(a => a.recouped).length} artists this month</p>
              <button className="px-8 py-4 bg-indigo-900 text-white rounded-xl font-bold hover:bg-indigo-800 text-lg">
                Distribute ${stats.readyToPay.toLocaleString()} to All Artists
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Artists receive funds via ACH, PayPal, or USDC
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
