'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function MP3TestPage() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('artist', e.target.artist.value);
    formData.append('title', e.target.title.value);
    formData.append('isrc', e.target.isrc.value);

    setUploading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/catalog/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Upload failed');
      }
      
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-indigo-600 hover:text-indigo-800 underline mb-4 inline-block">
          ← Back to Home
        </Link>
        
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-8 rounded-2xl mb-8">
          <h1 className="text-4xl font-bold mb-4">MP3 Upload & Digital Handshake</h1>
          <p className="text-xl text-indigo-100">Upload once, get legal protection + streaming forever</p>
        </div>

        {/* Educational Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">1. Upload to IDrive e2</h3>
            <p className="text-gray-600 text-sm">
              Your MP3 is stored in two places:
            </p>
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
              <li className="text-gray-700"><span className="font-medium text-indigo-900">Private bucket:</span> Original file + SHA-256 hash (legal evidence)</li>
              <li className="text-gray-700"><span className="font-medium text-indigo-900">Public bucket:</span> Preview version for streaming</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">2. Digital Handshake</h3>
            <p className="text-gray-600 text-sm">
              The SHA-256 hash creates a cryptographic fingerprint that:
            </p>
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
              <li className="text-gray-700">Proves the file hasn't been tampered with</li>
              <li className="text-gray-700">Creates court-admissible evidence of ownership</li>
              <li className="text-gray-700">Links to attorney portal for verification</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">3. Streaming Ready</h3>
            <p className="text-gray-600 text-sm">
              The public bucket gives you:
            </p>
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
              <li className="text-gray-700">Direct streaming URL with preview</li>
              <li className="text-gray-700">Temporary signed URLs for secure access</li>
              <li className="text-gray-700">Can be embedded in any player</li>
            </ul>
          </div>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Test the Flow</h2>
          
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Artist *</label>
                <input 
                  name="artist" 
                  required 
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter artist name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Title *</label>
                <input 
                  name="title" 
                  required 
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter track title"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">ISRC (optional)</label>
              <input 
                name="isrc" 
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g., US-TST-25-00001"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">MP3 File *</label>
              <input 
                type="file" 
                name="file" 
                accept=".mp3,audio/mpeg" 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <p className="text-xs text-gray-600 mt-2">Your file will be hashed with SHA-256 and stored in IDrive e2</p>
            </div>
            
            <button 
              type="submit" 
              disabled={uploading}
              className="w-full bg-indigo-900 text-white py-4 px-6 rounded-xl font-semibold hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg mt-4"
            >
              {uploading ? '⏳ Uploading & Generating Hash...' : '📤 Upload & Create Digital Handshake'}
            </button>
          </form>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 p-6 rounded-xl">
              <h3 className="font-bold text-red-800 text-lg mb-2">❌ Upload Failed</h3>
              <p className="text-red-700">{error}</p>
              <p className="text-sm text-red-600 mt-2">Check your IDrive credentials in the backend .env file</p>
            </div>
          )}

          {result && (
            <div className="mt-8 bg-green-50 border border-green-200 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-green-800 text-xl">Digital Handshake Created!</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* File Info */}
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">📁 File Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium text-gray-700">Track ID:</span> <span className="font-mono text-xs bg-gray-100 p-1 rounded">{result.track_id}</span></p>
                    <p><span className="font-medium text-gray-700">Artist:</span> {result.artist}</p>
                    <p><span className="font-medium text-gray-700">Title:</span> {result.title}</p>
                    <p><span className="font-medium text-gray-700">ISRC:</span> {result.isrc || 'N/A'}</p>
                  </div>
                </div>

                {/* Hash Info */}
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-indigo-900 mb-3">🔐 SHA-256 Hash (Digital Fingerprint)</h4>
                  <p className="font-mono text-xs bg-white p-2 rounded border border-indigo-200 break-all">{result.hash}</p>
                  <p className="text-xs text-indigo-700 mt-2">
                    This hash is stored with your file in the private bucket. Any modification to the file will change this hash, proving tampering.
                  </p>
                </div>
              </div>

              {result.public_url && (
                <div className="mt-6 bg-white p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">🎵 Streaming Preview (from IDrive e2 Public Bucket)</h4>
                  <audio controls src={result.public_url} className="w-full mb-3" />
                  
                  <div className="flex gap-4 mt-3">
                    <a 
                      href={result.public_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Open in IDrive e2
                    </a>
                    
                    <Link 
                      href={`/attorney-portal/digital-handshake/verify?track_id=${result.track_id}`}
                      className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Verify with Digital Handshake
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Why Use This Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Upload Here?</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-indigo-900 mb-3">⚖️ Legal Protection</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>SHA-256 hash creates court-admissible evidence of ownership</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Private bucket storage with timestamped metadata</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Digital Handshake verification for attorneys</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-indigo-900 mb-3">🎵 Streaming Ready</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Public bucket URL for instant streaming</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Can be embedded in any audio player</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Share preview links with clients</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg border border-indigo-200">
            <p className="text-sm text-gray-700">
              <span className="font-bold text-indigo-900">One upload, two benefits:</span> Your file is simultaneously stored for legal evidence (private bucket) and streaming (public bucket). The SHA-256 hash links both copies, proving the preview matches the original.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
