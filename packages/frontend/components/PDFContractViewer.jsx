'use client';
import { useState } from 'react';

// PDF Preview Modal Component (Option 1: Fast & Native Way)
const PDFPreviewModal = ({ secureUrl, isOpen, onClose, documentTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 h-5/6 rounded-lg overflow-hidden flex flex-col">
        <div className="p-4 flex justify-between items-center border-b">
          <div>
            <h3 className="font-bold text-lg text-gray-900">Review Split Agreement</h3>
            <p className="text-sm text-gray-600">{documentTitle || 'Signed Document'}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-red-600 hover:text-red-800 font-bold text-xl px-3 py-1 hover:bg-red-50 rounded transition"
          >
            ✕ Close
          </button>
        </div>
        
        {/* iframe loads the Presigned URL directly from S3 */}
        {/* #toolbar=0 hides download/print buttons for security */}
        <iframe 
          src={`${secureUrl}#toolbar=0`} 
          width="100%" 
          height="100%" 
          title="PDF Preview"
          className="border-none"
        />
        
        {/* Optional footer with lawyer actions */}
        <div className="p-3 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={() => window.open(secureUrl, '_blank')}
            className="px-4 py-2 text-sm bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200 transition"
          >
            📤 Open in New Tab
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
};

export default function PDFContractViewer({ agreementId, trackData, participants }) {
  const [generating, setGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [loadingContracts, setLoadingContracts] = useState(false);

  // Load existing contracts for this agreement
  const loadContracts = async () => {
    setLoadingContracts(true);
    try {
      const response = await fetch(`/api/lawyer-pdf/document/${agreementId}`);
      if (response.ok) {
        const data = await response.json();
        setContracts([data]);
      }
    } catch (err) {
      console.error('Failed to load contracts:', err);
    } finally {
      setLoadingContracts(false);
    }
  };

  const generatePDF = async () => {
    setGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/lawyer-pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          track_id: agreementId,
          title: trackData?.title || 'Unknown Track',
          artist: trackData?.artist || 'Unknown Artist',
          isrc: trackData?.isrc || '',
          contributors: participants || []
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to generate PDF');
      }
      
      setPdfUrl(data.url);
      setShowPreview(true); // Automatically show preview after generation
      
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const getContract = async () => {
    try {
      const response = await fetch(`/api/lawyer-pdf/document/${agreementId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to get contract');
      }
      
      setPdfUrl(data.url);
      setShowPreview(true); // Show preview instead of opening new tab
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Split Agreement Contract
        </h3>
        
        {/* Contract Info Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-gray-500">Track:</span>
              <span className="ml-2 font-medium">{trackData?.title || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">Artist:</span>
              <span className="ml-2 font-medium">{trackData?.artist || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">ISRC:</span>
              <span className="ml-2 font-medium">{trackData?.isrc || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">Agreement ID:</span>
              <span className="ml-2 font-mono text-xs">{agreementId}</span>
            </div>
          </div>
        </div>
        
        {/* Participant Summary */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Participants ({participants?.length || 0})</p>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {participants?.map((p, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span className="text-gray-600">{p.name} ({p.role})</span>
                <span className="font-semibold text-indigo-900">{p.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={generatePDF}
            disabled={generating}
            className="flex-1 bg-indigo-900 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-800 disabled:opacity-50 transition font-medium text-sm flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Contract
              </>
            )}
          </button>
          
          <button
            onClick={getContract}
            disabled={loadingContracts}
            className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Latest
          </button>
        </div>
        
        {/* Generated PDF Link (as backup) */}
        {pdfUrl && !showPreview && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 mb-2">✓ Contract ready</p>
            <button
              onClick={() => setShowPreview(true)}
              className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview Document
            </button>
          </div>
        )}
        
        {/* Legal Notice */}
        <div className="mt-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
          <p>⚖️ This contract includes SHA-256 hash verification. All actions are logged with IP address and timestamp.</p>
        </div>
      </div>

      {/* PDF Preview Modal */}
      <PDFPreviewModal 
        secureUrl={pdfUrl}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        documentTitle={`${trackData?.title} - Split Agreement`}
      />
    </>
  );
}
