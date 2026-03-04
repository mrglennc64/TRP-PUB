'use client';

interface RiskAuditDisplayProps {
  auditResult: {
    isrc: string;
    track_title?: string;
    artist_name?: string;
    album_name?: string | null;
    work_id?: string | null;
    composers?: string | null;
    publishers?: string | null;
    source: string;
    confidence: number;
    verified: boolean;
    found: boolean;
    message: string;
  };
}

export default function RiskAuditDisplay({ auditResult }: RiskAuditDisplayProps) {
  if (!auditResult || !auditResult.found) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-yellow-800 mb-2">No Results Found</h3>
        <p className="text-yellow-700">{auditResult?.message || 'ISRC not found in any database'}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Audit Results</h2>
      
      {/* Track Info Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{auditResult.track_title || 'Unknown Track'}</h3>
            <p className="text-xl text-gray-700 mt-1">{auditResult.artist_name || 'Unknown Artist'}</p>
          </div>
          <div className="bg-indigo-900 text-white px-4 py-2 rounded-full text-sm font-medium">
            Confidence: {auditResult.confidence}%
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4">ISRC: {auditResult.isrc}</p>
        <p className="text-sm text-gray-600">Source: {auditResult.source}</p>
      </div>

      {/* Metadata Status */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Composers</p>
          <p className="font-medium text-gray-900">{auditResult.composers || 'Not registered'}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Publishers</p>
          <p className="font-medium text-gray-900">{auditResult.publishers || 'Not registered'}</p>
        </div>
      </div>

      {/* Message */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <p className="text-green-800">{auditResult.message}</p>
      </div>
    </div>
  );
}
