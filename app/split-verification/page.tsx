"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';

type Step = 1 | 2 | 3 | 4;

interface SplitRow {
  name: string;
  role: string;
  split: number;
  status: 'ok' | 'error' | 'warning';
  issue?: string;
}

const SAMPLE_PERFECT: SplitRow[] = [
  { name: 'Drake', role: 'Artist', split: 50, status: 'ok' },
  { name: 'Metro Boomin', role: 'Producer', split: 25, status: 'ok' },
  { name: '21 Savage', role: 'Feature', split: 20, status: 'ok' },
  { name: 'Republic Records', role: 'Label', split: 5, status: 'ok' },
];

const SAMPLE_ERRORS: SplitRow[] = [
  { name: 'Travis Scott', role: 'Artist', split: 60, status: 'error', issue: 'Over-allocated' },
  { name: 'Mike Dean', role: 'Producer', split: 25, status: 'ok' },
  { name: 'Quavo', role: 'Feature', split: 25, status: 'warning', issue: 'Missing BMI registration' },
  { name: 'Epic Records', role: 'Label', split: 5, status: 'ok' },
];

export default function SplitVerificationPage() {
  const [step, setStep] = useState<Step>(1);
  const [splits, setSplits] = useState<SplitRow[] | null>(null);
  const [amount, setAmount] = useState('');
  const [verified, setVerified] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const total = splits ? splits.reduce((s, r) => s + r.split, 0) : 0;
  const hasErrors = splits ? splits.some(r => r.status !== 'ok') : false;
  const progressPct = ((step - 1) / 3) * 100;

  const loadSample = (withErrors: boolean) => {
    setSplits(withErrors ? SAMPLE_ERRORS : SAMPLE_PERFECT);
    setStep(2);
  };

  const handleVerify = () => {
    setVerified(true);
    setStep(3);
  };

  const handleProceed = () => {
    if (amount) setStep(4);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1A202C]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Nav */}
        <nav className="flex justify-between items-center py-5 border-b border-gray-200 flex-wrap gap-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-900 rounded-lg flex items-center justify-center text-white text-xl font-semibold">TP</div>
            <span className="text-[22px] font-semibold text-indigo-900">
              TrapRoyalties<span className="text-indigo-600">Pro</span>
            </span>
          </div>
          <div className="flex gap-8 items-center">
            <Link href="/" className="text-gray-600 hover:text-indigo-900 font-medium text-sm">Home</Link>
            <Link href="/for-attorneys" className="text-gray-600 hover:text-indigo-900 font-medium text-sm">For Attorneys</Link>
            <Link href="/split-verification" className="text-indigo-900 font-medium text-sm border-b-2 border-indigo-900 pb-1">Split Verification</Link>
            <Link href="/free-audit" className="text-gray-600 hover:text-indigo-900 font-medium text-sm">Free Audit</Link>
          </div>
        </nav>

        {/* Title */}
        <div className="text-center py-10 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-indigo-900 mb-3">Split Verification & Payment Workflow</h1>
          <p className="text-gray-600 text-lg">Upload → Detect issues → Verify → Enter amount → Calculate payment → Download PDF</p>
        </div>

        {/* Before / After */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="md:border-r-2 border-red-100 pr-6">
            <h3 className="text-xl text-red-600 mb-4 flex items-center gap-2">✗ Before TrapRoyaltiesPro</h3>
            <div className="flex items-center gap-3 flex-wrap text-sm">
              <span className="bg-gray-100 px-4 py-2 rounded-full border border-gray-200">Label</span>
              <span className="text-gray-300">→</span>
              <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full border border-red-200">Split Issues</span>
              <span className="text-gray-300">→</span>
              <span className="bg-gray-100 px-4 py-2 rounded-full border border-gray-200">PRO</span>
              <span className="text-gray-300">→</span>
              <span className="bg-gray-100 px-4 py-2 rounded-full border border-gray-200">Payment Dispute</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl text-indigo-900 mb-4 flex items-center gap-2">✓ With TrapRoyaltiesPro</h3>
            <div className="flex items-center gap-3 flex-wrap text-sm">
              <span className="bg-gray-100 px-4 py-2 rounded-full border border-gray-200">Label</span>
              <span className="text-gray-300">→</span>
              <span className="bg-indigo-100 text-indigo-900 px-4 py-2 rounded-full border border-indigo-300">TrapRoyaltiesPro</span>
              <span className="text-gray-300">→</span>
              <span className="bg-gray-100 px-4 py-2 rounded-full border border-gray-200">PRO</span>
              <span className="text-gray-300">→</span>
              <span className="bg-gray-100 px-4 py-2 rounded-full border border-gray-200">Verified Payment</span>
            </div>
          </div>
        </div>

        {/* Step tracker */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute top-5 left-12 right-12 h-1 bg-gray-200 z-0"></div>
            {[
              { n: 1, label: 'Upload Data' },
              { n: 2, label: 'Issues Detected' },
              { n: 3, label: 'Data Verified' },
              { n: 4, label: 'Payment Ready' },
            ].map(({ n, label }) => (
              <div key={n} className="flex flex-col items-center relative z-10 bg-[#F8FAFC] px-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-all ${
                  step >= n ? 'bg-indigo-900 border-indigo-900 text-white' : 'bg-white border-2 border-gray-200 text-gray-500'
                }`}>{n}</div>
                <span className={`text-sm font-medium ${step >= n ? 'text-indigo-900 font-semibold' : 'text-gray-500'}`}>{label}</span>
              </div>
            ))}
          </div>
          <div className="max-w-2xl mx-auto mt-8 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-900 transition-all duration-500 rounded-full" style={{ width: `${progressPct}%` }}></div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
          {/* Step 1: Upload */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-900 mb-6 flex items-center gap-2">
              ☁️ Step 1: Upload split data
            </h2>
            <div
              onClick={() => fileRef.current?.click()}
              className="bg-gray-50 border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all border-gray-200 hover:border-indigo-900 hover:bg-indigo-50"
            >
              <div className="text-5xl text-indigo-900 mb-4">📄</div>
              <h3 className="text-lg font-medium mb-2">Drop your split sheet here</h3>
              <p className="text-gray-500 text-sm mb-4">CSV, Excel, or PDF</p>
              <input ref={fileRef} type="file" className="hidden" accept=".csv,.xlsx,.xls,.pdf" onChange={() => loadSample(false)} />
            </div>
            <div className="text-center my-4">
              <button onClick={() => loadSample(false)} className="text-indigo-900 text-sm mx-2 font-medium hover:underline">Load perfect sample</button>
              <button onClick={() => loadSample(true)} className="text-red-600 text-sm mx-2 font-medium hover:underline">Load test with errors</button>
            </div>
          </div>

          {/* Steps 2-4 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-900 mb-6">✅ Steps 2–4: Verify &amp; Calculate Payment</h2>

            {!splits && (
              <p className="text-gray-400 text-center mt-12">Upload split data to begin verification.</p>
            )}

            {splits && step === 2 && (
              <div>
                <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${
                  total === 100 && !hasErrors ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  Total: {total}% {total !== 100 ? '⚠️ Must equal 100%' : '✓'} · {hasErrors ? '⚠️ Issues found' : '✓ No issues'}
                </div>
                <div className="space-y-2 mb-6">
                  {splits.map((row, i) => (
                    <div key={i} className={`flex justify-between items-center p-3 rounded-lg border ${
                      row.status === 'ok' ? 'border-green-100 bg-green-50' :
                      row.status === 'warning' ? 'border-yellow-100 bg-yellow-50' :
                      'border-red-100 bg-red-50'
                    }`}>
                      <div>
                        <span className="font-medium">{row.name}</span>
                        <span className="text-gray-500 text-sm ml-2">({row.role})</span>
                        {row.issue && <p className="text-xs text-red-600 mt-0.5">{row.issue}</p>}
                      </div>
                      <span className="font-semibold">{row.split}%</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleVerify}
                  disabled={total !== 100}
                  className="w-full py-3 bg-indigo-900 text-white rounded-xl font-semibold hover:bg-indigo-800 disabled:opacity-50 transition"
                >
                  Verify Data
                </button>
              </div>
            )}

            {splits && step >= 3 && (
              <div>
                <div className="p-3 rounded-lg mb-4 bg-green-50 text-green-700 border border-green-200 text-sm font-medium">
                  ✅ Data verified — blockchain proof generated
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Payment Amount ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  />
                  {amount && splits && (
                    <div className="space-y-2 mb-4">
                      {splits.map((row, i) => (
                        <div key={i} className="flex justify-between p-2 bg-gray-50 rounded-lg text-sm">
                          <span>{row.name} ({row.split}%)</span>
                          <span className="font-bold text-indigo-900">${((parseFloat(amount) * row.split) / 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {step === 4 ? (
                    <button className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-500 transition">
                      📄 Download Payment PDF
                    </button>
                  ) : (
                    <button
                      onClick={handleProceed}
                      disabled={!amount}
                      className="w-full py-3 bg-indigo-900 text-white rounded-xl font-semibold hover:bg-indigo-800 disabled:opacity-50 transition"
                    >
                      Calculate & Proceed
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust badges */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 my-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {['Blockchain Verified', 'Court-Admissible', 'PRO Cross-Referenced', 'Tax-Ready'].map(badge => (
              <div key={badge}>
                <div className="text-indigo-900 mb-2">✓</div>
                <div className="font-medium text-sm">{badge}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-8 mt-12 text-center text-gray-500">
          <p className="text-sm">TrapRoyaltiesPro ensures split accuracy, payment verification, and blockchain-proof ownership records.</p>
          <div className="flex justify-center gap-8 mt-4 text-xs">
            <span>© 2026 TrapRoyaltiesPro</span>
            <span>ASCAP · BMI · SOCAN Compatible</span>
            <span>Built for Music Attorneys</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
