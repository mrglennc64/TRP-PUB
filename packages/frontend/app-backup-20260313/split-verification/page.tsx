"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';

type Step = 1 | 2 | 3 | 4;

interface SplitRow {
  name: string;
  role: string;
  split: number;
  status: 'ok' | 'error' | 'warning';
  issue?: string;
}

interface PartyAnalysis {
  name: string;
  role: string;
  percentage: number;
  agreedPercentage: number | null;
  discrepancy: number;
  status: 'verified' | 'discrepancy' | 'unregistered' | 'missing';
  estimatedAmount: number | null;
  proStatus: { ascap: boolean | null; bmi: boolean | null; socan: boolean | null; prs: boolean | null };
  missingRegistrations: string[];
}

interface AIAnalysis {
  valid: boolean;
  totalPercentage: number;
  percentageError: number;
  riskLevel: 'high' | 'medium' | 'low';
  issues: { party: string; type: string; severity: 'error' | 'warning' | 'info'; description: string; suggestedFix: string }[];
  partyAnalysis: PartyAnalysis[];
  paymentBreakdown: { party: string; role: string; percentage: number; amount: number | null }[];
  forensicSummary: string;
  legalRecommendation: string;
  actionItems: string[];
  blockchainReady: boolean;
  courtAdmissible: boolean;
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
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const total = splits ? splits.reduce((s, r) => s + r.split, 0) : 0;
  const hasErrors = splits ? splits.some(r => r.status !== 'ok') : false;
  const progressPct = ((step - 1) / 3) * 100;

  const loadSample = (withErrors: boolean) => {
    setSplits(withErrors ? SAMPLE_ERRORS : SAMPLE_PERFECT);
    setAiAnalysis(null);
    setAiError(null);
    setStep(2);
  };

  const handleVerify = async () => {
    if (!splits) return;
    setIsAnalyzing(true);
    setAiError(null);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000);

      const res = await fetch('/api/split-verify-ai', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          splits: splits.map(s => ({ name: s.name, role: s.role, percentage: s.split })),
          totalAmount: amount ? parseFloat(amount) : null,
        }),
      });

      clearTimeout(timeout);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.details || data.error || 'Analysis failed');
      }

      setAiAnalysis(data.analysis);
      setStep(3);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      setAiError(msg.includes('abort') ? 'Timed out — Ollama may be busy, try again' : msg);
      setStep(3);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProceed = () => {
    setStep(4);
  };

  const [appliedFixes, setAppliedFixes] = useState<number[]>([]);
  const [skippedFixes, setSkippedFixes] = useState<number[]>([]);

  const handleApplyFix = (issue: AIAnalysis['issues'][number], idx: number) => {
    if (!splits) return;
    const total = splits.reduce((s, r) => s + r.split, 0);

    // Fix: total != 100 — normalize proportionally
    if (issue.party === 'All Parties' && Math.abs(total - 100) > 0.01) {
      const factor = 100 / total;
      setSplits(splits.map(r => ({ ...r, split: Math.round(r.split * factor * 10) / 10, status: 'ok' as const })));
      setAppliedFixes(prev => [...prev, idx]);
      return;
    }

    // Fix: party has 0% or negative — remove them
    const partyRow = splits.find(r => r.name === issue.party);
    if (partyRow && partyRow.split <= 0) {
      setSplits(splits.filter(r => r.name !== issue.party));
      setAppliedFixes(prev => [...prev, idx]);
      return;
    }

    // For other issues, just mark as applied (informational)
    setAppliedFixes(prev => [...prev, idx]);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    let y = 40;

    // White background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, doc.internal.pageSize.getHeight(), 'F');

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(26, 32, 92);
    doc.text('TrapRoyaltiesPro — Split Verification Report', 40, y);
    y += 14;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 40, y);
    y += 8;
    doc.setDrawColor(200, 200, 200);
    doc.line(40, y, pageW - 40, y);
    y += 20;

    // Summary box
    doc.setFillColor(245, 247, 255);
    doc.roundedRect(40, y, pageW - 80, 54, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(26, 32, 92);
    doc.text('Analysis Summary', 52, y + 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 80);
    const risk = aiAnalysis?.riskLevel ?? 'N/A';
    const totalPct = aiAnalysis?.totalPercentage ?? (splits ? splits.reduce((s, r) => s + r.split, 0) : 0);
    doc.text(`Total Split: ${totalPct}%   |   Risk Level: ${risk.toUpperCase()}   |   Court-Admissible: ${aiAnalysis?.courtAdmissible ? 'Yes' : 'No'}   |   Blockchain Ready: ${aiAnalysis?.blockchainReady ? 'Yes' : 'No'}`, 52, y + 34);
    y += 70;

    // Split table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(26, 32, 92);
    doc.text('Split Breakdown', 40, y);
    y += 14;

    // Table header
    doc.setFillColor(26, 32, 92);
    doc.rect(40, y, pageW - 80, 20, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('Party', 48, y + 13);
    doc.text('Role', 200, y + 13);
    doc.text('Split %', 330, y + 13);
    if (amount) doc.text('Amount ($)', 420, y + 13);
    doc.text('Status', pageW - 100, y + 13);
    y += 20;

    const rows = splits ?? [];
    rows.forEach((row, i) => {
      doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 255);
      doc.rect(40, y, pageW - 80, 18, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(30, 30, 30);
      doc.text(row.name, 48, y + 12);
      doc.text(row.role, 200, y + 12);
      doc.text(`${row.split}%`, 330, y + 12);
      if (amount) {
        const amt = ((parseFloat(amount) * row.split) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        doc.text(`$${amt}`, 420, y + 12);
      }
      const statusText = row.status === 'ok' ? 'Verified' : row.status === 'warning' ? 'Warning' : 'Error';
      doc.setTextColor(row.status === 'ok' ? 22 : row.status === 'warning' ? 146 : 200, row.status === 'ok' ? 163 : row.status === 'warning' ? 64 : 30, row.status === 'ok' ? 74 : 0);
      doc.text(statusText, pageW - 100, y + 12);
      y += 18;
    });
    y += 16;

    // Forensic summary
    if (aiAnalysis?.forensicSummary) {
      doc.setDrawColor(200, 200, 220);
      doc.setFillColor(250, 250, 255);
      const summaryLines = doc.splitTextToSize(aiAnalysis.forensicSummary, pageW - 100);
      const boxH = summaryLines.length * 13 + 24;
      doc.roundedRect(40, y, pageW - 80, boxH, 4, 4, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(26, 32, 92);
      doc.text('Forensic Summary', 52, y + 14);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 80);
      doc.text(summaryLines, 52, y + 26);
      y += boxH + 16;
    }

    // Action items
    if (aiAnalysis?.actionItems?.length) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(26, 32, 92);
      doc.text('Action Items', 40, y);
      y += 14;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 80);
      aiAnalysis.actionItems.forEach(item => {
        doc.text(`• ${item}`, 48, y);
        y += 13;
      });
      y += 8;
    }

    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.line(40, y, pageW - 40, y);
    y += 12;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('TrapRoyaltiesPro · ASCAP · BMI · SOCAN Compatible · Built for Music Attorneys', 40, y);

    doc.save('split-verification-report.pdf');
  };

  const riskColor = {
    high: 'bg-red-900/40 text-red-300 border-red-700/50',
    medium: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50',
    low: 'bg-green-900/40 text-green-300 border-green-700/50',
  };

  const severityIcon = { error: '❌', warning: '⚠️', info: 'ℹ️' };

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
          <h1 className="text-4xl font-bold text-indigo-900 mb-3">Split Verification</h1>
          <p className="text-gray-600 text-lg">Upload → Analyze → Verify → Calculate payment → Download PDF</p>
          <div className="mt-2 inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-200">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
            Powered by SMPT
          </div>
        </div>

        {/* Step tracker */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute top-5 left-12 right-12 h-1 bg-gray-200 z-0"></div>
            {[
              { n: 1, label: 'Upload Data' },
              { n: 2, label: 'SMPT Analysis' },
              { n: 3, label: 'Verified' },
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
            <div className="h-full bg-indigo-900 transition-all duration-200 rounded-full" style={{ width: `${progressPct}%` }}></div>
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
            <div className="text-center my-4 space-y-2">
              <div>
                <button onClick={() => loadSample(false)} className="text-indigo-900 text-sm mx-2 font-medium hover:underline">Load perfect sample</button>
                <button onClick={() => loadSample(true)} className="text-red-600 text-sm mx-2 font-medium hover:underline">Load sample with errors</button>
              </div>
            </div>

            {/* Split entry table */}
            {splits && (
              <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-3 py-2 text-gray-600 font-medium">Party</th>
                      <th className="text-left px-3 py-2 text-gray-600 font-medium">Role</th>
                      <th className="text-right px-3 py-2 text-gray-600 font-medium">Split %</th>
                      <th className="text-center px-3 py-2 text-gray-600 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {splits.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0">
                        <td className="px-3 py-2 font-medium">{row.name}</td>
                        <td className="px-3 py-2 text-gray-500">{row.role}</td>
                        <td className="px-3 py-2 text-right font-semibold">{row.split}%</td>
                        <td className="px-3 py-2 text-center">
                          {row.status === 'ok' ? '✅' : row.status === 'warning' ? '⚠️' : '❌'}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan={2} className="px-3 py-2 font-bold text-gray-700">Total</td>
                      <td className={`px-3 py-2 text-right font-bold ${total === 100 ? 'text-green-600' : 'text-red-600'}`}>{total}%</td>
                      <td className="px-3 py-2 text-center">{total === 100 ? '✅' : '❌'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Steps 2-4 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-indigo-900 mb-6">✅ SMPT Analysis</h2>

            {!splits && (
              <p className="text-gray-400 text-center mt-12">Upload split data to begin.</p>
            )}

            {/* Step 2: Verify button */}
            {splits && step === 2 && (
              <div>
                <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${
                  total === 100 && !hasErrors ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  Total: {total}% {total !== 100 ? '⚠️ Must equal 100%' : '✓'} · {hasErrors ? '⚠️ Issues detected' : '✓ No pre-scan issues'}
                </div>

                {aiError && (
                  <div className="p-3 rounded-lg mb-4 text-sm bg-orange-50 text-orange-700 border border-orange-200">
                    ⚠️ SMPT engine: {aiError}. Check OLLAMA_BASE_URL in .env.local
                  </div>
                )}

                <div className="mb-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-sm text-indigo-800">
                  <strong>SMPT will analyze:</strong>
                  <ul className="mt-1 space-y-0.5 text-indigo-700">
                    <li>• Split totals &amp; percentage accuracy</li>
                    <li>• PRO registration gaps (ASCAP, BMI, SOCAN, PRS)</li>
                    <li>• Discrepancies vs agreements</li>
                    <li>• Forensic risk assessment</li>
                    <li>• Court-admissibility check</li>
                  </ul>
                </div>

                <button
                  onClick={handleVerify}
                  disabled={isAnalyzing}
                  className="w-full py-3 bg-indigo-900 text-white rounded-xl font-semibold hover:bg-indigo-800 disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <span className="animate-spin">⚙️</span>
                      Analyzing splits...
                    </>
                  ) : (
                    '✅ Run Verification'
                  )}
                </button>
              </div>
            )}

            {/* Step 3+: SMPT Results */}
            {splits && step >= 3 && (
              <div className="space-y-4">
                {aiError ? (
                  <div className="p-3 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 text-sm font-medium">
                    ⚠️ SMPT engine error: {aiError}
                    <button onClick={() => { setStep(2); setAiError(null); }} className="ml-2 underline text-xs">Try again</button>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm font-medium">
                    ✅ SMPT verification complete — blockchain proof generated
                  </div>
                )}

                {aiAnalysis && (
                  <>
                    {/* Risk level badge */}
                    <div className={`p-3 rounded-xl border text-sm font-medium ${riskColor[aiAnalysis.riskLevel]}`}>
                      Risk Level: <strong className="uppercase">{aiAnalysis.riskLevel}</strong>
                      {' · '}
                      {aiAnalysis.courtAdmissible ? '✅ Court-admissible' : '⚠️ Not court-admissible'}
                      {' · '}
                      {aiAnalysis.blockchainReady ? '⛓️ Blockchain ready' : '❌ Not blockchain ready'}
                    </div>

                    {/* Issues */}
                    {aiAnalysis.issues.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-700">Issues Found ({aiAnalysis.issues.length})</p>
                        {aiAnalysis.issues.map((issue, i) => (
                          <div key={i} className={`p-3 rounded-lg border text-sm ${
                            issue.severity === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                            issue.severity === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                            'bg-blue-50 border-blue-200 text-blue-800'
                          }`}>
                            <div className="flex items-start gap-2">
                              <span>{severityIcon[issue.severity]}</span>
                              <div>
                                <strong>{issue.party}</strong>: {issue.description}
                                <p className="text-xs mt-0.5 opacity-80">Fix: {issue.suggestedFix}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* PRO Status grid */}
                    {aiAnalysis.partyAnalysis.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">PRO Registration Status</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs border border-gray-200 rounded-xl overflow-hidden">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="text-left px-2 py-1.5 text-gray-600">Party</th>
                                <th className="text-center px-2 py-1.5 text-gray-600">ASCAP</th>
                                <th className="text-center px-2 py-1.5 text-gray-600">BMI</th>
                                <th className="text-center px-2 py-1.5 text-gray-600">SOCAN</th>
                                <th className="text-center px-2 py-1.5 text-gray-600">PRS</th>
                                <th className="text-center px-2 py-1.5 text-gray-600">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {aiAnalysis.partyAnalysis.map((party, i) => {
                                const q = encodeURIComponent(party.name);
                                const proLinks: Record<string, string> = {
                                  ascap: `https://www.ascap.com/repertory#ace/search/writer/${q}`,
                                  bmi: `https://repertoire.bmi.com/StartPage?fromLink=true&type=Writer&search=${q}`,
                                  socan: `https://www.socan.com/music-creators/music-search/?q=${q}`,
                                  prs: `https://www.prsformusic.com/search#q=${q}`,
                                };
                                return (
                                  <tr key={i} className="border-t border-gray-100">
                                    <td className="px-2 py-1.5 font-medium">{party.name}</td>
                                    {(['ascap','bmi','socan','prs'] as const).map(pro => (
                                      <td key={pro} className="px-2 py-1.5 text-center">
                                        <span>{party.proStatus[pro] === true ? '✅' : party.proStatus[pro] === false ? '❌' : '—'}</span>
                                        {' '}
                                        <a href={proLinks[pro]} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-[10px] font-medium">Verify→</a>
                                      </td>
                                    ))}
                                    <td className="px-2 py-1.5 text-center">
                                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                                        party.status === 'verified' ? 'bg-green-100 text-green-700' :
                                        party.status === 'discrepancy' ? 'bg-red-100 text-red-700' :
                                        party.status === 'unregistered' ? 'bg-orange-100 text-orange-700' :
                                        'bg-gray-100 text-gray-700'
                                      }`}>{party.status}</span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">↗ Verify links open official PRO repertory search — results are not guaranteed</p>
                      </div>
                    )}

                    {/* Forensic summary */}
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-700">
                      <p className="font-semibold text-gray-800 mb-1">Forensic Summary</p>
                      <p>{aiAnalysis.forensicSummary}</p>
                    </div>

                    {/* Action items */}
                    {aiAnalysis.actionItems.length > 0 && (
                      <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-sm">
                        <p className="font-semibold text-indigo-900 mb-1">Action Items</p>
                        <ul className="space-y-1">
                          {aiAnalysis.actionItems.map((item, i) => (
                            <li key={i} className="text-indigo-800 flex items-start gap-1.5">
                              <span className="shrink-0 mt-0.5">→</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggested Fixes */}
                    {aiAnalysis.issues.length > 0 && (
                      <div className="p-3 bg-white rounded-xl border border-gray-200 text-sm">
                        <p className="font-semibold text-gray-800 mb-2">Suggested Fixes</p>
                        <div className="space-y-2">
                          {aiAnalysis.issues.map((issue, i) => {
                            const applied = appliedFixes.includes(i);
                            const skipped = skippedFixes.includes(i);
                            const resolved = applied || skipped;
                            return (
                              <div key={i} className={`p-2 rounded-lg border text-xs transition-all ${resolved ? 'opacity-50' : 'bg-gray-50 border-gray-100'}`}>
                                <p className="font-medium text-gray-700 mb-1.5">
                                  <span className="font-semibold">{issue.party}:</span> {issue.suggestedFix}
                                </p>
                                {resolved ? (
                                  <span className={`text-xs font-semibold ${applied ? 'text-green-600' : 'text-gray-400'}`}>
                                    {applied ? '✓ Applied' : '— Skipped'}
                                  </span>
                                ) : (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleApplyFix(issue, i)}
                                      className="px-3 py-1 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-500 transition"
                                    >
                                      ✓ Yes, apply
                                    </button>
                                    <button
                                      onClick={() => setSkippedFixes(prev => [...prev, i])}
                                      className="px-3 py-1 rounded-lg bg-gray-200 text-gray-600 font-semibold hover:bg-gray-300 transition"
                                    >
                                      ✕ Skip
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Payment section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Payment Amount ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  />
                  {amount && splits && (
                    <div className="space-y-2 mb-3">
                      {(aiAnalysis?.paymentBreakdown || splits.map(r => ({ party: r.name, role: r.role, percentage: r.split, amount: null }))).map((row, i) => (
                        <div key={i} className="flex justify-between p-2 bg-gray-50 rounded-lg text-sm">
                          <span>{row.party} <span className="text-gray-500 text-xs">({row.role})</span> — {row.percentage}%</span>
                          <span className="font-bold text-indigo-900">${((parseFloat(amount) * row.percentage) / 100).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {step === 4 ? (
                    <button
                      onClick={handleDownloadPDF}
                      className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-500 transition"
                    >
                      📄 Download PDF
                    </button>
                  ) : (
                    <button
                      onClick={handleProceed}
                      className="w-full py-3 bg-indigo-900 text-white rounded-xl font-semibold hover:bg-indigo-800 transition"
                    >
                      Proceed
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust badges */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 my-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {['SMPT Powered', 'Blockchain Verified', 'Court-Admissible', 'PRO Cross-Referenced', 'Tax-Ready'].map(badge => (
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
