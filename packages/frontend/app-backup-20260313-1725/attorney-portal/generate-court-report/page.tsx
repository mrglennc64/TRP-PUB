"use client";

import Header from '../components/Header';
import { useState } from 'react';

export default function CourtReportPage() {
  const [selectedSections, setSelectedSections] = useState([
    'Ownership Breakdown',
    'Split Inconsistencies',
    'Black Box Leakage Analysis',
    'Statutory Interest'
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Generate Court-Ready Audit Report"
        subtitle="Create Bates-stamped, hash-sealed reports for litigation"
      />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Configuration */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Matter</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Metro Boomin – Creepin' Dispute (#2026-CV-0123)</option>
                  <option>B.o.B Estate – 360 Deal Audit (#2026-CV-0456)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Include Sections</label>
                <div className="space-y-3">
                  {[
                    'Ownership Breakdown',
                    'Split Inconsistencies',
                    'Registration Status (PROs)',
                    'Collaborator Conflicts',
                    'Black Box Analysis',
                    '360 Revenue Gaps',
                    'Statutory Interest (GA 7% auto-calc)'
                  ].map((item) => (
                    <label key={item} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-indigo-900 rounded"
                        defaultChecked={selectedSections.includes(item)}
                      />
                      <span className="text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full py-4 bg-indigo-900 text-white rounded-lg font-medium hover:bg-indigo-800 transition shadow-lg">
                Generate Report
              </button>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Report Preview</h2>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">Monad Verified</span>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="font-bold text-indigo-900">Confidential Audit Report</p>
                <p className="text-sm text-gray-500">Matter ID: MB-2026-0123 • Feb 22, 2026</p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Unclaimed Royalties</p>
                  <p className="text-2xl font-bold text-green-600">$187,200</p>
                  <p className="text-xs text-gray-500">across 14 tracks</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Black Box Leakage</p>
                  <p className="text-lg font-bold text-red-600">31% ($112K unreported)</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Split Inconsistencies</p>
                  <p className="text-lg font-bold text-yellow-600">5 issues detected</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-mono text-gray-500 break-all">
                    Hash: 0x7f3a...8e9d
                  </p>
                  <p className="text-xs text-green-600 mt-2 flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    Blockchain Verified
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button className="flex-1 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition">
                Customize
              </button>
              <button className="flex-1 py-3 bg-indigo-900 text-white rounded-lg font-medium hover:bg-indigo-800 transition">
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}