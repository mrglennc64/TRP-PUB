"use client";

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';

interface Contributor {
  name: string;
  role: string;
  percentage: number;
  email: string;
  phone?: string;
}

export default function StudioModePage() {
  const [step, setStep] = useState(1);
  const [matter, setMatter] = useState('');
  const [trackName, setTrackName] = useState('');
  const [contributors, setContributors] = useState<Contributor[]>([
    { name: '', role: 'Producer', percentage: 0, email: '' }
  ]);
  const [generatedLink, setGeneratedLink] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [sending, setSending] = useState(false);

  const matters = [
    { id: '1', name: 'Metro Boomin – Creepin\' Dispute', case: '2026-CV-0123' },
    { id: '2', name: 'Future – Publishing Rights', case: '2026-CV-0789' },
  ];

  const addContributor = () => {
    setContributors([
      ...contributors,
      { name: '', role: 'Feature', percentage: 0, email: '' }
    ]);
  };

  const updateContributor = (index: number, field: keyof Contributor, value: string | number) => {
    const updated = [...contributors];
    updated[index] = { ...updated[index], [field]: value };
    setContributors(updated);
  };

  const calculateTotal = () => {
    return contributors.reduce((sum, c) => sum + (Number(c.percentage) || 0), 0);
  };

  const generateHandshakeLink = async () => {
    setSending(true);
    
    // Generate a unique verification ID
    const vId = `HANDSHAKE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setVerificationId(vId);
    
    // Create the handshake data
    const handshakeData = {
      id: vId,
      matter,
      trackName,
      contributors,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      status: 'pending'
    };

    // In production, save to database
    localStorage.setItem(`handshake-${vId}`, JSON.stringify(handshakeData));
    
    // Generate the signing link
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/studio-mode/${vId}`;
    setGeneratedLink(link);
    setSending(false);
    setStep(2);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    alert('Link copied to clipboard!');
  };

  const sendViaSMS = () => {
    // In production, integrate with SMS API (Twilio, etc.)
    const phoneNumbers = contributors.map(c => c.phone).filter(Boolean);
    alert(`SMS would be sent to: ${phoneNumbers.join(', ')}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Studio Mode - Biometric Handshake"
        subtitle="Send secure signing links for biometric verification"
      />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= i ? 'bg-indigo-900 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i}
              </div>
              {i < 3 && <div className={`w-20 h-1 ${step > i ? 'bg-indigo-900' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Handshake Agreement</h2>
            
            <div className="space-y-6">
              {/* Matter Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link to Matter <span className="text-red-500">*</span>
                </label>
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={matter}
                  onChange={(e) => setMatter(e.target.value)}
                >
                  <option value="">Select a matter...</option>
                  {matters.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.case})</option>
                  ))}
                </select>
              </div>

              {/* Track Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Track/Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Creepin' (Remix)"
                  value={trackName}
                  onChange={(e) => setTrackName(e.target.value)}
                />
              </div>

              {/* Contributors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Contributors <span className="text-red-500">*</span>
                </label>
                
                {contributors.map((contributor, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="col-span-3">
                      <input
                        type="text"
                        placeholder="Name"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        value={contributor.name}
                        onChange={(e) => updateContributor(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <select
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        value={contributor.role}
                        onChange={(e) => updateContributor(index, 'role', e.target.value)}
                      >
                        <option>Producer</option>
                        <option>Feature</option>
                        <option>Writer</option>
                        <option>Label</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="%"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        value={contributor.percentage}
                        onChange={(e) => updateContributor(index, 'percentage', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        value={contributor.email}
                        onChange={(e) => updateContributor(index, 'email', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="tel"
                        placeholder="Phone (optional)"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        value={contributor.phone || ''}
                        onChange={(e) => updateContributor(index, 'phone', e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={addContributor}
                  className="text-indigo-900 text-sm font-medium hover:text-indigo-700"
                >
                  + Add Another Contributor
                </button>

                {/* Split Total */}
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Split:</span>
                    <span className={`text-xl font-bold ${
                      calculateTotal() === 100 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {calculateTotal()}%
                    </span>
                  </div>
                  {calculateTotal() !== 100 && (
                    <p className="text-sm text-red-600 mt-2">
                      ⚠️ Split must total 100% before sending for signing
                    </p>
                  )}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateHandshakeLink}
                disabled={!matter || !trackName || contributors.some(c => !c.name || !c.email) || calculateTotal() !== 100}
                className="w-full py-4 bg-indigo-900 text-white rounded-lg font-medium hover:bg-indigo-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Biometric Signing Link
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Handshake Link Generated!</h2>
              <p className="text-gray-600 mt-2">Share this link with contributors for biometric signing</p>
            </div>

            {/* Link Display */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Signing Link (expires in 7 days):</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Sharing Options */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => window.location.href = `mailto:?subject=Sign Split Sheet&body=Please sign using this link: ${generatedLink}`}
                className="flex items-center justify-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
              >
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-blue-700 font-medium">Send via Email</span>
              </button>
              
              <button
                onClick={sendViaSMS}
                className="flex items-center justify-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition"
              >
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-green-700 font-medium">Send via SMS</span>
              </button>
            </div>

            {/* QR Code for mobile */}
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-4">Scan with phone camera to sign:</p>
              <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg mx-auto flex items-center justify-center">
                <span className="text-xs text-gray-400">QR Code</span>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-4 bg-indigo-900 text-white rounded-lg font-medium hover:bg-indigo-800 transition"
              >
                View Signing Status
              </button>
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Create Another
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Signing Status</h2>
            
            <div className="space-y-4 mb-8">
              {contributors.map((contributor, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{contributor.name}</p>
                    <p className="text-sm text-gray-500">{contributor.role} • {contributor.percentage}%</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">Not signed</span>
                    <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
              <p className="text-sm text-indigo-800">
                <span className="font-bold">Pending:</span> Waiting for all parties to sign. 
                Once complete, the e-seal will be generated on Monad blockchain.
              </p>
            </div>

            <button
              onClick={() => window.location.href = `/studio-mode/${verificationId}`}
              className="w-full mt-6 py-4 bg-indigo-900 text-white rounded-lg font-medium hover:bg-indigo-800 transition"
            >
              Preview Signing Page
            </button>
          </div>
        )}
      </main>
    </div>
  );
}