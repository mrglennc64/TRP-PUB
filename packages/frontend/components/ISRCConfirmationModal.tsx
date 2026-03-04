'use client';

import React, { useState } from 'react';

interface ISRCConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  originalIsrc: string;
  suggestedTrack: {
    title: string;
    artist: string;
    isrc: string;
    mbid?: string;
    recording_id?: string;
    confidence?: string;
  };
}

const ISRCConfirmationModal: React.FC<ISRCConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  originalIsrc,
  suggestedTrack
}) => {
  const [confirming, setConfirming] = useState(false);
  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setConfirming(true);
    setError(null);
    
    try {
      const response = await fetch('/api/royalty-finder/confirm-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_isrc: originalIsrc,
          resolved_isrc: suggestedTrack.isrc,
          artist: suggestedTrack.artist,
          title: suggestedTrack.title,
          mbid: suggestedTrack.mbid,
          recording_id: suggestedTrack.recording_id,
          confidence: suggestedTrack.confidence || 'user_confirmed',
          user_id: localStorage.getItem('userId') || 'anonymous' // Simple user tracking
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to save mapping');
      }
      
      // Success!
      setConfirmSuccess(true);
      
      // Store in localStorage to show we've contributed
      const contributed = JSON.parse(localStorage.getItem('confirmedMappings') || '[]');
      contributed.push({
        originalIsrc,
        resolvedIsrc: suggestedTrack.isrc,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('confirmedMappings', JSON.stringify(contributed));
      
      // Wait a moment to show success message, then close and refresh
      setTimeout(() => {
        onConfirm(); // This will trigger a refresh
        setConfirmSuccess(false);
        onClose();
      }, 1500);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setConfirming(false);
    }
  };

  // Confidence badge color
  const getConfidenceColor = (confidence?: string) => {
    switch(confidence) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-orange-600 bg-orange-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
        {confirmSuccess ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4 animate-bounce">✅</div>
            <h3 className="text-xl font-bold text-green-700 mb-2">Mapping Saved Forever!</h3>
            <p className="text-gray-600 mb-4">
              This ISRC will now work instantly for all future searches.
            </p>
            <div className="text-sm text-gray-500">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {originalIsrc} → {suggestedTrack.isrc}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">🤔</span> 
                ISRC Not Found in Global Database
              </h3>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-600 text-xl transition"
                disabled={confirming}
              >
                ✕
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 mb-3">
                <span className="font-mono bg-yellow-100 px-2 py-1 rounded font-bold">
                  {originalIsrc}
                </span> 
                {' '}was not found in MusicBrainz, but we found a potential match:
              </p>
              
              <div className="bg-white p-4 rounded-lg border border-yellow-200 mt-3">
                <p className="font-bold text-lg text-indigo-900">{suggestedTrack.title}</p>
                <p className="text-gray-700">by <span className="font-medium">{suggestedTrack.artist}</span></p>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Working ISRC:</span>
                    <span className="font-mono ml-2 text-xs bg-gray-100 px-1 py-0.5 rounded">
                      {suggestedTrack.isrc}
                    </span>
                  </div>
                  
                  {suggestedTrack.confidence && (
                    <div>
                      <span className="text-gray-500">Confidence:</span>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(suggestedTrack.confidence)}`}>
                        {suggestedTrack.confidence}
                      </span>
                    </div>
                  )}
                </div>
                
                {suggestedTrack.mbid && (
                  <p className="text-xs text-gray-400 mt-2 font-mono">
                    MBID: {suggestedTrack.mbid.substring(0, 8)}...
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">❌ {error}</p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800 flex items-start gap-2">
                <span className="text-lg">💡</span>
                <span>
                  <span className="font-bold">Once confirmed, this mapping is saved forever.</span> 
                  {' '}Future searches with this ISRC will work instantly, even if MusicBrainz doesn't have it.
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2 transition"
              >
                {confirming ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  '✅ Yes, that\'s the right track'
                )}
              </button>
              <button
                onClick={onClose}
                disabled={confirming}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 font-medium transition"
              >
                ✕ No, try again
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-4 text-center">
              This helps us build a cleaner database. Thank you for contributing! 🙏
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ISRCConfirmationModal;
