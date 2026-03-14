'use client';

import { useState } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  XCircle,
  Download,
  Share2,
  Lock,
  FileText,
  Upload,
  Shield,
  ChevronDown,
  ChevronUp,
  Music
} from 'lucide-react';

interface Split {
  id: string;
  name: string;
  role: string;
  percentage: number;
  pro?: string;
  ipi?: string;
  verified: boolean;
}

interface Track {
  id: string;
  isrc: string;
  title: string;
  artist: string;
  splits: Split[];
  totalPercentage: number;
  status: 'complete' | 'incomplete' | 'not_set' | 'disputed';
  lastVerified?: Date;
}

export default function SplitValidator() {
  // Initialize with safe default data
  const [tracks, setTracks] = useState<Track[]>([
    {
      id: '1',
      isrc: 'US-TDE-24-00123',
      title: 'MIDNIGHT DRIVE',
      artist: 'Jay Rock',
      totalPercentage: 100,
      status: 'complete',
      splits: [
        { id: '1-1', name: 'Jay Rock', role: 'Artist/Writer', percentage: 50, pro: 'BMI', ipi: '123456789', verified: true },
        { id: '1-2', name: 'Dave Free', role: 'Producer', percentage: 25, pro: 'ASCAP', ipi: '987654321', verified: true },
        { id: '1-3', name: 'Top Dawg Ent.', role: 'Publisher', percentage: 25, pro: 'BMI', ipi: '456789123', verified: true }
      ]
    },
    {
      id: '2',
      isrc: 'US-TDE-24-00124',
      title: 'VICE CITY',
      artist: 'Jay Rock',
      totalPercentage: 85,
      status: 'incomplete',
      splits: [
        { id: '2-1', name: 'Jay Rock', role: 'Artist/Writer', percentage: 50, pro: 'BMI', ipi: '123456789', verified: false },
        { id: '2-2', name: 'Dave Free', role: 'Producer', percentage: 25, pro: 'ASCAP', ipi: '987654321', verified: false },
        { id: '2-3', name: 'Missing Publisher', role: 'Publisher', percentage: 10, pro: 'BMI', ipi: '000000000', verified: false }
      ]
    },
    {
      id: '3',
      isrc: 'US-TDE-24-00125',
      title: 'WEST COAST',
      artist: 'Schoolboy Q',
      totalPercentage: 110,
      status: 'disputed',
      splits: [
        { id: '3-1', name: 'Schoolboy Q', role: 'Artist/Writer', percentage: 50, pro: 'ASCAP', ipi: '789123456', verified: false },
        { id: '3-2', name: 'Sounwave', role: 'Producer', percentage: 30, pro: 'BMI', ipi: '321789654', verified: false },
        { id: '3-3', name: 'Top Dawg Ent.', role: 'Publisher', percentage: 30, pro: 'BMI', ipi: '456789123', verified: false }
      ]
    }
  ]);

  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [currentProof, setCurrentProof] = useState<{ proofHash: string; verifiedAt: Date } | null>(null);
  const [uploading, setUploading] = useState(false);

  // Safe function to get status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'incomplete':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'disputed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  // Safe function to get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'complete':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'incomplete':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'disputed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Safe function to get status text
  const getStatusText = (track: Track) => {
    if (!track) return 'Unknown';
    
    switch(track.status) {
      case 'complete':
        return '✅ 100% Complete';
      case 'incomplete':
        return `⚠️ ${track.totalPercentage || 0}% Needs ${100 - (track.totalPercentage || 0)}%`;
      case 'disputed':
        return `❌ ${track.totalPercentage || 0}% Over 100%`;
      default:
        return 'Not Set';
    }
  };

  const generateProof = (track: Track) => {
    if (!track) return;
    
    // Generate a mock proof hash
    const mockProofHash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    
    setCurrentProof({
      proofHash: mockProofHash,
      verifiedAt: new Date()
    });
    setShowProofModal(true);
    
    // Update track splits to verified
    setTracks(prev => prev.map(t => {
      if (t && t.id === track.id) {
        return {
          ...t,
          splits: (t.splits || []).map(s => ({ ...s, verified: true }))
        };
      }
      return t;
    }));
  };

  const generateShareLink = (trackId: string) => {
    const mockSlug = Math.random().toString(36).substring(2, 10);
    setShareLink(`${window.location.origin}/verify/${mockSlug}`);
    setShowShareModal(true);
  };

  const exportBundle = (track: Track) => {
    if (!track) return;
    
    alert(`Export bundle for ${track.title || 'Unknown'} - In production, this would download a ZIP file with:\n\n` +
      `• Original statement\n` +
      `• Verified splits\n` +
      `• Proof hash\n` +
      `• Timestamp\n` +
      `• Verification certificate`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      alert(`File "${file.name}" uploaded successfully! In production, this would parse the PDF and extract splits.`);
      setUploading(false);
    }, 2000);
  };

  const toggleExpand = (trackId: string) => {
    setExpandedTrack(expandedTrack === trackId ? null : trackId);
  };

  // Calculate stats safely
  const totalTracks = tracks?.length || 0;
  const completeTracks = tracks?.filter(t => t && t.status === 'complete').length || 0;
  const incompleteTracks = tracks?.filter(t => t && t.status === 'incomplete').length || 0;
  const disputedTracks = tracks?.filter(t => t && t.status === 'disputed').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Split Verification</h2>
              <p className="text-purple-100">Verify and lock royalty splits - 100% required</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <label className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium flex items-center space-x-2 cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>Upload Statement</span>
              <input 
                type="file" 
                accept=".pdf,.csv" 
                className="hidden" 
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Tracks</p>
          <p className="text-2xl font-bold">{totalTracks}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Complete</p>
          <p className="text-2xl font-bold text-green-600">{completeTracks}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Incomplete</p>
          <p className="text-2xl font-bold text-yellow-600">{incompleteTracks}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Disputed</p>
          <p className="text-2xl font-bold text-red-600">{disputedTracks}</p>
        </div>
      </div>

      {/* Track List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Track Splits</h3>
        </div>
        
        {tracks && tracks.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {tracks.map((track) => (
              track && (
                <div key={track.id} className="p-6 hover:bg-gray-50">
                  {/* Track Header - Always visible */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(track.status)}
                      <div>
                        <h4 className="font-medium">{track.title || 'Unknown Title'}</h4>
                        <p className="text-sm text-gray-500">
                          {track.artist || 'Unknown Artist'} • ISRC: {track.isrc || 'Not Available'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(track.status)}`}>
                        {getStatusText(track)}
                      </span>
                      
                      {/* Expand/Collapse Button */}
                      <button 
                        onClick={() => toggleExpand(track.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        {expandedTrack === track.id ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content - Shows splits and actions */}
                  {expandedTrack === track.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {/* Split Visualization */}
                      {track.splits && track.splits.length > 0 ? (
                        <>
                          <div className="mb-4">
                            <div className="flex h-2 rounded-full overflow-hidden">
                              {track.splits.map((split, idx) => (
                                split && (
                                  <div 
                                    key={split.id}
                                    className={`h-full ${
                                      split.verified ? 'opacity-100' : 'opacity-50'
                                    } ${
                                      idx === 0 ? 'bg-blue-500' :
                                      idx === 1 ? 'bg-green-500' :
                                      idx === 2 ? 'bg-purple-500' :
                                      'bg-orange-500'
                                    }`}
                                    style={{ width: `${split.percentage || 0}%` }}
                                    title={`${split.name || 'Unknown'}: ${split.percentage || 0}%`}
                                  />
                                )
                              ))}
                              {track.totalPercentage < 100 && (
                                <div 
                                  className="h-full bg-gray-200"
                                  style={{ width: `${100 - (track.totalPercentage || 0)}%` }}
                                  title={`Missing: ${100 - (track.totalPercentage || 0)}%`}
                                />
                              )}
                            </div>
                          </div>
                          
                          {/* Split Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                            {track.splits.map((split) => (
                              split && (
                                <div key={split.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                                  <div>
                                    <span className="font-medium">{split.name || 'Unknown'}</span>
                                    <span className="text-xs text-gray-500 ml-2">{split.role || 'Role'}</span>
                                    {split.pro && (
                                      <span className="text-xs text-gray-400 ml-1">• {split.pro}</span>
                                    )}
                                    {split.verified && (
                                      <CheckCircle className="h-3 w-3 text-green-500 inline ml-1" />
                                    )}
                                  </div>
                                  <span className="font-semibold">{split.percentage || 0}%</span>
                                </div>
                              )
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-3">
                            <button 
                              onClick={() => generateProof(track)}
                              className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={track.status !== 'complete'}
                            >
                              <Lock className="h-4 w-4 inline mr-2" />
                              Generate Proof
                            </button>
                            
                            <button 
                              onClick={() => generateShareLink(track.id)}
                              className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
                            >
                              <Share2 className="h-4 w-4 inline mr-2" />
                              Share
                            </button>
                            
                            <button 
                              onClick={() => exportBundle(track)}
                              className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
                            >
                              <Download className="h-4 w-4 inline mr-2" />
                              Export
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-500 text-center py-4">No split data available</p>
                      )}
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Music className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="mb-2">No tracks found</p>
            <p className="text-sm">Upload a statement to get started</p>
          </div>
        )}
      </div>

      {/* Proof Modal */}
      {showProofModal && currentProof && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold">Verification Proof Generated</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-500 mb-1">Proof Hash (SHA-256)</p>
                <p className="text-sm font-mono break-all bg-white p-2 rounded border border-gray-200">
                  {currentProof.proofHash}
                </p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs text-gray-500 mb-1">Verified At</p>
                <p className="text-sm">{currentProof.verifiedAt.toLocaleString()}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-2">
                  This proof is immutable and can be verified independently at any time.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button 
                onClick={() => setShowProofModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(currentProof.proofHash);
                  alert('Proof hash copied to clipboard!');
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Copy Hash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Share Verification</h3>
            <p className="text-sm text-gray-600 mb-4">
              Anyone with this link can view the verified splits. The proof is immutable.
            </p>
            <div className="flex items-center space-x-2 mb-4">
              <input 
                type="text" 
                value={shareLink}
                readOnly
                className="flex-1 p-2 border border-gray-200 rounded bg-gray-50 text-sm"
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  alert('Link copied to clipboard!');
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Copy
              </button>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 100% Rule Enforcement Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">The 100% Rule</p>
            <p className="text-sm text-blue-600">
              Splits cannot be locked until they total exactly 100%. Incomplete or disputed tracks
              will prevent final verification. This creates an immutable, tamper-evident record.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}