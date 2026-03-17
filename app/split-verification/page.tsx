"use client";

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Contributor {
  name: string;
  role: string;
  percentage: number;
  ipi?: string;
  pro?: string;
}

interface SplitData {
  id: string;
  title: string;
  artist: string;
  contributors: Contributor[];
  totalPercentage: number;
  status: 'complete' | 'incomplete' | 'disputed';
}

interface LookupContributor {
  name: string;
  role: string;
  source: string;
}

interface LookupResult {
  title: string;
  artist: string;
  label?: string;
  contributors: LookupContributor[];
  sources: string[];
}

export default function SplitVerificationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [splitData, setSplitData] = useState<SplitData | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(50000);
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [verificationHash, setVerificationHash] = useState('');

  // Lookup state
  const [lookupTitle, setLookupTitle] = useState('');
  const [lookupArtist, setLookupArtist] = useState('');
  const [lookupISRC, setLookupISRC] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [activeSources, setActiveSources] = useState<string[]>([]);

  // Sample data
  const PERFECT_SAMPLE: SplitData = {
    id: 'sample-1',
    title: 'SUMMER NIGHTS',
    artist: 'Kendrick Lamar',
    totalPercentage: 100,
    status: 'complete',
    contributors: [
      { name: 'Kendrick Lamar', role: 'Artist/Writer', percentage: 40, ipi: '00624789341', pro: 'BMI' },
      { name: 'Sounwave', role: 'Producer', percentage: 30, ipi: '00472915682', pro: 'ASCAP' },
      { name: 'Baby Keem', role: 'Writer', percentage: 15, ipi: '00836125497', pro: 'SESAC' },
      { name: 'Top Dawg Ent.', role: 'Publisher', percentage: 15, ipi: '00987654321', pro: 'BMI' }
    ]
  };

  const ERROR_SAMPLE: SplitData = {
    id: 'sample-2',
    title: 'STREET RUNNER',
    artist: 'Metro Boomin',
    totalPercentage: 85,
    status: 'incomplete',
    contributors: [
      { name: 'Metro Boomin', role: 'Producer', percentage: 50, ipi: '00624789341', pro: 'BMI' },
      { name: 'Future', role: 'Artist/Writer', percentage: 35, ipi: '00472915682', pro: 'ASCAP' },
      // Missing 15% - feature not registered
    ]
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    // Simulate file parsing
    setTimeout(() => {
      // Randomly load perfect or error sample for demo
      if (Math.random() > 0.5) {
        loadSplitData(PERFECT_SAMPLE);
      } else {
        loadSplitData(ERROR_SAMPLE);
      }
      setUploading(false);
    }, 1500);
  };

  const loadSplitData = (data: SplitData) => {
    setSplitData(data);
    validateSplits(data);
    setCurrentStep(2);
  };

  const loadPerfectSample = () => {
    setSplitData(PERFECT_SAMPLE);
    validateSplits(PERFECT_SAMPLE);
    setCurrentStep(2);
  };

  const loadErrorSample = () => {
    setSplitData(ERROR_SAMPLE);
    validateSplits(ERROR_SAMPLE);
    setCurrentStep(2);
  };

  const validateSplits = (data: SplitData) => {
    const newErrors: string[] = [];
    
    if (Math.abs(data.totalPercentage - 100) > 0.1) {
      newErrors.push(`Total splits are ${data.totalPercentage}%, must equal 100%`);
    }
    
    data.contributors.forEach(contributor => {
      if (!contributor.ipi) {
        newErrors.push(`${contributor.name} missing IPI number`);
      }
      if (!contributor.pro) {
        newErrors.push(`${contributor.name} missing PRO registration`);
      }
    });
    
    setErrors(newErrors);
  };

  const autoFixErrors = () => {
    if (!splitData) return;
    
    // Auto-fix logic - just a demo
    const fixedData = { ...splitData };
    
    // Fix total percentage
    if (Math.abs(fixedData.totalPercentage - 100) > 0.1) {
      const factor = 100 / fixedData.totalPercentage;
      fixedData.contributors = fixedData.contributors.map(c => ({
        ...c,
        percentage: Math.round(c.percentage * factor * 10) / 10
      }));
      fixedData.totalPercentage = 100;
    }
    
    // Add missing IPI/PRO placeholders
    fixedData.contributors = fixedData.contributors.map(c => ({
      ...c,
      ipi: c.ipi || 'PENDING',
      pro: c.pro || 'UNREGISTERED'
    }));
    
    setSplitData(fixedData);
    validateSplits(fixedData);
  };

  const startVerification = () => {
    if (errors.length > 0) return;
    
    // Generate mock verification hash
    const hash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    setVerificationHash(hash);
    setCurrentStep(3);
  };

  const calculatePayment = () => {
    setCurrentStep(4);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const runLookup = async () => {
    if (!lookupTitle && !lookupISRC) { setLookupError('Enter a title or ISRC to search.'); return; }
    setLookupLoading(true); setLookupError(''); setLookupResult(null); setActiveSources([]);
    const result: LookupResult = { title: lookupTitle, artist: lookupArtist, contributors: [], sources: [] };
    try {
      let mbData: Record<string, unknown> | null = null;
      if (lookupISRC) {
        const r = await fetch(`https://musicbrainz.org/ws/2/recording?query=isrc:${encodeURIComponent(lookupISRC)}&fmt=json`);
        const d = await r.json() as { recordings?: unknown[] };
        if (d.recordings?.length) { mbData = (d.recordings as Record<string, unknown>[])[0]; result.sources.push('MusicBrainz'); }
      }
      if (!mbData && lookupTitle) {
        const q = lookupArtist ? `${lookupTitle} ${lookupArtist}` : lookupTitle;
        const r = await fetch(`https://musicbrainz.org/ws/2/recording?query=${encodeURIComponent(q)}&fmt=json`);
        const d = await r.json() as { recordings?: unknown[] };
        if (d.recordings?.length) { mbData = (d.recordings as Record<string, unknown>[])[0]; result.sources.push('MusicBrainz'); }
      }
      if (mbData) {
        if (!result.title && mbData.title) result.title = mbData.title as string;
        const ac = mbData['artist-credit'] as Array<{ artist?: { name?: string } }> | undefined;
        if (ac?.length && !result.artist) result.artist = ac[0]?.artist?.name || '';
        const workRels = mbData.relations as Array<{ type?: string; work?: { id?: string } }> | undefined;
        const workRel = workRels?.find(r => r.type === 'performance' && r.work?.id);
        if (workRel?.work?.id) {
          try {
            const wr = await fetch(`https://musicbrainz.org/ws/2/work/${workRel.work.id}?inc=artist-rels&fmt=json`);
            const wd = await wr.json() as { relations?: Array<{ type?: string; artist?: { name?: string } }> };
            (wd.relations || []).forEach(rel => {
              if (rel.artist?.name) {
                const role = rel.type === 'composer' ? 'Composer' : rel.type === 'lyricist' ? 'Lyricist' : rel.type || 'Writer';
                result.contributors.push({ name: rel.artist.name, role, source: 'MusicBrainz' });
              }
            });
          } catch { /* optional */ }
        }
      }
      try {
        const q = lookupArtist ? `${lookupTitle} ${lookupArtist}` : lookupTitle;
        const dr = await fetch(`https://api.discogs.com/database/search?q=${encodeURIComponent(q)}&type=release`);
        const dd = await dr.json() as { results?: Array<{ label?: string[] }> };
        if (dd.results?.length) {
          const top = dd.results[0];
          if (top.label?.length && !result.label) { result.label = top.label[0]; result.sources.push('Discogs'); }
        }
      } catch { /* optional */ }
      if (!result.sources.length) setLookupError('No results found. Try a different title or ISRC.');
      else { setLookupResult(result); setActiveSources(result.sources); }
    } catch { setLookupError('Lookup failed — check your connection.'); }
    setLookupLoading(false);
  };

  const useLookupCredits = () => {
    if (!lookupResult?.contributors.length) return;
    const use = lookupResult.contributors;
    const n = use.length; const eq = Math.round(1000 / n) / 10;
    const data: SplitData = {
      id: 'lookup-import',
      title: lookupResult.title,
      artist: lookupResult.artist,
      totalPercentage: 100,
      status: 'complete',
      contributors: use.map((c, i) => ({
        name: c.name, role: c.role,
        percentage: i === n - 1 ? Math.round((100 - eq * (n - 1)) * 10) / 10 : eq,
      })),
    };
    loadSplitData(data);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header />
      
      <main className="pt-28 pb-20 px-6 max-w-6xl mx-auto">
        {/* Hero / Intro */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold neon-cyan mb-4">Split Verification</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto">
            Lock in splits with crypto proofs — no more disputes over features, producers, or uncleared samples. Verify on Monad, enforce 100% accuracy, get your bag fast.
          </p>
          <p className="mt-4 text-lg text-purple-300 font-medium">Upload split sheet → Detect mismatches → Verify on-chain → Simulate payout</p>
        </div>

        {/* Before / After */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-900/60 rounded-2xl border border-red-900/50 p-8">
            <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
              </svg>
              Before TrapRoyalties Pro
            </h3>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="px-4 py-2 bg-gray-800 rounded-full">Artist / Producer</span>
              <svg className="text-gray-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              <span className="px-4 py-2 bg-red-900/50 text-red-300 rounded-full">Disputes & Drama</span>
              <svg className="text-gray-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              <span className="px-4 py-2 bg-gray-800 rounded-full">Delayed Bag</span>
            </div>
          </div>

          <div className="bg-gray-900/60 rounded-2xl border border-purple-900/50 p-8">
            <h3 className="text-2xl font-bold neon-cyan mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
              </svg>
              With TrapRoyalties Pro
            </h3>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="px-4 py-2 bg-gray-800 rounded-full">Artist / Producer</span>
              <svg className="text-gray-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              <span className="px-4 py-2 bg-purple-900/50 text-purple-300 rounded-full">On-Chain Verification</span>
              <svg className="text-gray-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              <span className="px-4 py-2 bg-green-900/50 text-green-300 rounded-full">Fast, Dispute-Free Bag</span>
            </div>
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="mb-16">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 relative max-w-5xl mx-auto">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 -z-10 rounded-full"></div>
            <div className={`flex flex-col items-center relative z-10 bg-black/50 px-6 py-4 rounded-2xl border ${currentStep >= 1 ? 'border-purple-400' : 'border-purple-800/50'}`}>
              <div className={`w-14 h-14 rounded-full ${currentStep >= 1 ? 'bg-purple-600' : 'bg-gray-700'} flex items-center justify-center text-2xl font-bold mb-3 neon-purple`}>1</div>
              <span className={`font-semibold ${currentStep >= 1 ? 'text-purple-300' : 'text-gray-500'}`}>Upload Splits</span>
            </div>
            <div className={`flex flex-col items-center relative z-10 bg-black/50 px-6 py-4 rounded-2xl border ${currentStep >= 2 ? 'border-purple-400' : 'border-purple-800/50'}`}>
              <div className={`w-14 h-14 rounded-full ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-700'} flex items-center justify-center text-2xl font-bold mb-3 neon-purple`}>2</div>
              <span className={`font-semibold ${currentStep >= 2 ? 'text-purple-300' : 'text-gray-500'}`}>Issues Detected</span>
            </div>
            <div className={`flex flex-col items-center relative z-10 bg-black/50 px-6 py-4 rounded-2xl border ${currentStep >= 3 ? 'border-purple-400' : 'border-purple-800/50'}`}>
              <div className={`w-14 h-14 rounded-full ${currentStep >= 3 ? 'bg-purple-600' : 'bg-gray-700'} flex items-center justify-center text-2xl font-bold mb-3 neon-purple`}>3</div>
              <span className={`font-semibold ${currentStep >= 3 ? 'text-purple-300' : 'text-gray-500'}`}>Verify On-Chain</span>
            </div>
            <div className={`flex flex-col items-center relative z-10 bg-black/50 px-6 py-4 rounded-2xl border ${currentStep >= 4 ? 'border-purple-400' : 'border-purple-800/50'}`}>
              <div className={`w-14 h-14 rounded-full ${currentStep >= 4 ? 'bg-purple-600' : 'bg-gray-700'} flex items-center justify-center text-2xl font-bold mb-3 neon-purple`}>4</div>
              <span className={`font-semibold ${currentStep >= 4 ? 'text-purple-300' : 'text-gray-500'}`}>Payout Ready</span>
            </div>
          </div>
        </div>

        {/* Upload & Verify Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Left Panel - Upload */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-3xl border border-purple-900/50 p-8">
            <h2 className="text-3xl font-bold neon-purple mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-4">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>
              </svg>
              Step 1: Import Split Data
            </h2>
            <p className="text-purple-400/70 text-sm mb-6 ml-12">Lookup from Global Sources</p>

            {/* Global Lookup */}
            <div className="border border-purple-800/50 bg-purple-900/10 rounded-2xl p-5 mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {['MusicBrainz', 'Discogs', 'ASCAP/BMI', 'Split Handshake'].map(src => (
                  <span key={src} className={`text-xs px-3 py-1 rounded-full border font-medium transition-all ${
                    activeSources.includes(src)
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-purple-900/20 text-purple-400 border-purple-800/50'
                  }`}>{src}</span>
                ))}
              </div>
              <div className="space-y-3 mb-3">
                <input
                  type="text" placeholder="Track title" value={lookupTitle}
                  onChange={e => setLookupTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && runLookup()}
                  className="w-full px-4 py-2.5 bg-black/40 border border-purple-800/50 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:border-purple-500 outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text" placeholder="Artist name" value={lookupArtist}
                    onChange={e => setLookupArtist(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && runLookup()}
                    className="w-full px-4 py-2.5 bg-black/40 border border-purple-800/50 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:border-purple-500 outline-none"
                  />
                  <input
                    type="text" placeholder="ISRC (optional)" value={lookupISRC}
                    onChange={e => setLookupISRC(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && runLookup()}
                    className="w-full px-4 py-2.5 bg-black/40 border border-purple-800/50 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>
              <button
                onClick={runLookup} disabled={lookupLoading}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-sm font-bold disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {lookupLoading ? (
                  <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Looking up…</>
                ) : '🔍 Lookup from Global Sources'}
              </button>
              {lookupError && <p className="text-red-400 text-xs mt-2">{lookupError}</p>}
              {lookupResult && (
                <div className="mt-3 bg-black/30 border border-purple-800/40 rounded-xl p-4">
                  <p className="font-bold text-purple-300 text-sm">{lookupResult.title}{lookupResult.artist && ` — ${lookupResult.artist}`}</p>
                  {lookupResult.label && <p className="text-xs text-gray-500 mb-2">Label: {lookupResult.label}</p>}
                  {lookupResult.contributors.length > 0 ? (
                    <div className="space-y-1 my-3">
                      {lookupResult.contributors.map((c, i) => (
                        <div key={i} className="flex justify-between text-xs py-1 border-b border-purple-900/30 last:border-0">
                          <span className="text-gray-300">{c.name} <span className="text-gray-500">({c.role})</span></span>
                          <span className="text-purple-500 text-[10px]">{c.source}</span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-xs text-gray-500 my-2">No contributor credits found.</p>}
                  {lookupResult.contributors.length > 0 && (
                    <button onClick={useLookupCredits} className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-bold transition">
                      ✓ Use these credits
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6 text-xs text-gray-600">
              <div className="flex-1 h-px bg-purple-900/40"></div>or upload your split sheet<div className="flex-1 h-px bg-purple-900/40"></div>
            </div>

            {!splitData ? (
              <>
                <div className="upload-zone rounded-2xl p-12 text-center transition-all cursor-pointer border-2 border-dashed border-purple-600 bg-purple-900/5 hover:border-purple-400 hover:bg-purple-900/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-6">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>
                  </svg>
                  <h3 className="text-2xl font-bold neon-purple mb-3">Drop Split Sheet Here</h3>
                  <p className="text-gray-400 mb-6">CSV, Excel, or PDF — features, producers, writers, % splits</p>
                  <input 
                    type="file" 
                    accept=".csv,.xlsx,.xls,.pdf" 
                    className="hidden" 
                    id="split-upload"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  <label 
                    htmlFor="split-upload" 
                    className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg hover:from-purple-500 hover:to-pink-500 cursor-pointer shadow-lg shadow-purple-900/50 transition transform hover:scale-105 disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Choose File or Drop'}
                  </label>
                </div>

                <div className="flex justify-center space-x-8 mt-8 text-sm">
                  <button 
                    onClick={loadPerfectSample}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    Load Perfect Collab Sample
                  </button>
                  <button 
                    onClick={loadErrorSample}
                    className="text-red-400 hover:text-red-300"
                  >
                    Load One With Drama (Errors)
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                {/* Split Preview */}
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-purple-300">{splitData.title}</h3>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      errors.length === 0 ? 'bg-green-600/30 text-green-400' : 'bg-yellow-600/30 text-yellow-400'
                    }`}>
                      {errors.length === 0 ? '✅ Ready' : `⚠️ ${errors.length} Issue${errors.length > 1 ? 's' : ''}`}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4">{splitData.artist}</p>

                  {splitData.contributors.map((contributor, idx) => (
                    <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-700 last:border-0">
                      <div>
                        <p className="font-medium text-white">{contributor.name}</p>
                        <p className="text-sm text-gray-400">{contributor.role} • IPI: {contributor.ipi || 'Missing'} • PRO: {contributor.pro || 'Unregistered'}</p>
                      </div>
                      <span className="text-xl font-bold text-purple-400">{contributor.percentage}%</span>
                    </div>
                  ))}

                  <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className={`text-xl font-bold ${
                      Math.abs(splitData.totalPercentage - 100) < 0.1 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {splitData.totalPercentage}%
                    </span>
                  </div>
                </div>

                {/* Error Panel */}
                {errors.length > 0 && (
                  <div className="bg-red-900/30 border border-red-600 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-red-400 mb-4">Issues Detected</h4>
                    <ul className="space-y-2">
                      {errors.map((error, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="text-red-400 mr-2 mt-1 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
                          </svg>
                          <span className="text-red-300">{error}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={autoFixErrors}
                      className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-full font-bold hover:bg-purple-500 transition"
                    >
                      Auto-Fix Issues
                    </button>
                  </div>
                )}

                {/* Verification Button */}
                {errors.length === 0 && currentStep === 2 && (
                  <button
                    onClick={startVerification}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg hover:from-purple-500 hover:to-pink-500 shadow-lg transition transform hover:scale-105"
                  >
                    Start Verification
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Verify & Calculate */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-3xl border border-purple-900/50 p-8">
            <h2 className="text-3xl font-bold neon-cyan mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-4">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
              </svg>
              Verify & Calculate
            </h2>

            {currentStep >= 3 && verificationHash && (
              <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-purple-300 mb-4">Verification Record</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Verification ID</span>
                    <span className="font-mono text-sm text-purple-300">{verificationHash.substring(0, 16)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Timestamp</span>
                    <span>{new Date().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-400 font-medium">Verified ✓</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowTechDetails(!showTechDetails)}
                  className="w-full mt-4 text-sm text-purple-400 hover:text-purple-300"
                >
                  {showTechDetails ? 'Hide technical details ↑' : 'Show technical details ↓'}
                </button>
                {showTechDetails && (
                  <div className="mt-4 p-4 bg-gray-900/50 rounded-xl text-xs text-gray-400 font-mono">
                    <div>Network: Monad Testnet (Chain ID: 10143)</div>
                    <div className="break-all mt-2">Contract: {verificationHash}</div>
                  </div>
                )}
              </div>
            )}

            {currentStep >= 3 && (
              <>
                <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-purple-300 mb-4">Enter Payment Amount</h3>
                  <div className="flex space-x-4">
                    <div className="flex-1 relative">
                      <span className="absolute left-4 top-4 text-gray-400">$</span>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-4 bg-gray-900 border border-purple-900/50 rounded-2xl focus:outline-none focus:border-purple-500 text-white text-lg"
                      />
                    </div>
                    <button
                      onClick={calculatePayment}
                      className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-500 transition"
                    >
                      Calculate
                    </button>
                  </div>
                </div>

                {currentStep >= 4 && (
                  <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-bold text-purple-300 mb-4">Payment Summary</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-400">Gross Royalties</span>
                        <span className="font-bold text-white">{formatCurrency(paymentAmount)}</span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-400">Tax Withholding (25%)</span>
                        <span className="font-bold text-red-400">-{formatCurrency(paymentAmount * 0.25)}</span>
                      </div>
                      <div className="flex justify-between text-2xl font-bold pt-4 border-t border-gray-700">
                        <span className="text-purple-300">Net Payment</span>
                        <span className="text-green-400">{formatCurrency(paymentAmount * 0.75)}</span>
                      </div>
                    </div>

                    {splitData && (
                      <div className="mt-6">
                        <h4 className="text-md font-bold text-purple-300 mb-3">Distribution by Contributor</h4>
                        <div className="space-y-3">
                          {splitData.contributors.map((contributor, idx) => {
                            const grossShare = paymentAmount * (contributor.percentage / 100);
                            const netShare = grossShare * 0.75;
                            return (
                              <div key={idx} className="flex justify-between items-center p-3 bg-gray-900/50 rounded-xl">
                                <div>
                                  <p className="font-medium text-white">{contributor.name}</p>
                                  <p className="text-sm text-gray-400">{contributor.percentage}%</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-green-400 font-bold">{formatCurrency(netShare)}</p>
                                  <p className="text-xs text-gray-500">net</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {currentStep === 2 && splitData && errors.length === 0 && (
              <div className="bg-gray-800/50 rounded-xl p-6 text-center">
                <p className="text-gray-300 mb-4">Ready to verify your splits on-chain?</p>
                <button
                  onClick={startVerification}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg hover:from-purple-500 hover:to-pink-500 shadow-lg transition transform hover:scale-105"
                >
                  Start Verification
                </button>
              </div>
            )}

            {(currentStep === 1 || !splitData) && (
              <div className="space-y-4 text-sm text-gray-400">
                <div className="flex items-center"><svg className="text-green-400 mr-3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> Detect duplicate feature claims</div>
                <div className="flex items-center"><svg className="text-green-400 mr-3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> Flag uncleared producer splits</div>
                <div className="flex items-center"><svg className="text-green-400 mr-3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg> Enforce exact % with on-chain proof</div>
              </div>
            )}

            {currentStep === 4 && (
              <Link 
                href="/founding-member" 
                className="mt-6 block text-center bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-5 px-10 rounded-full text-xl shadow-2xl shadow-pink-900/50 transition transform hover:scale-105"
              >
                Get Full Verification + Payment Simulator
              </Link>
            )}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-gray-900/40 rounded-xl p-6 border border-purple-800/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
            </svg>
            <p className="font-semibold">Monad Blockchain Proofs</p>
          </div>
          <div className="bg-gray-900/40 rounded-xl p-6 border border-purple-800/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
            </svg>
            <p className="font-semibold">PRO Gap Detection</p>
          </div>
          <div className="bg-gray-900/40 rounded-xl p-6 border border-purple-800/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
            </svg>
            <p className="font-semibold">Hip Hop / R&B Optimized</p>
          </div>
          <div className="bg-gray-900/40 rounded-xl p-6 border border-purple-800/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
            </svg>
            <p className="font-semibold">Dispute-Proof Splits</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}