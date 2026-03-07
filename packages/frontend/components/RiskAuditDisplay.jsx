'use client';
import { useState } from 'react';

const RiskLevelBadge = ({ score, status }) => {
  const getColor = () => {
    if (score >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-full border ${getColor()}`}>
      <span className="text-2xl font-bold mr-2">{score}</span>
      <span className="font-medium">{status}</span>
    </div>
  );
};

const RiskFlag = ({ flag, index }) => (
  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition">
    <div className="text-red-500 mt-0.5">⚠️</div>
    <p className="text-sm text-gray-700">{flag}</p>
  </div>
);

export default function RiskAuditDisplay({ auditResult }) {
  const [showFullReport, setShowFullReport] = useState(false);

  if (!auditResult) return null;

  const getScoreColor = () => {
    if (auditResult.score >= 90) return 'text-green-600';
    if (auditResult.score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">Royalty Health Audit</h2>
            <p className="text-indigo-200">{auditResult.song_title}</p>
          </div>
          <RiskLevelBadge score={auditResult.score} status={auditResult.status} />
        </div>
      </div>

      {/* Streaming Stats */}
      {auditResult.streaming_stats && (
        <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 border-b border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Listens</p>
            <p className="text-3xl font-bold text-indigo-900">
              {auditResult.streaming_stats.total_listens.toLocaleString()}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Unique Listeners</p>
            <p className="text-3xl font-bold text-indigo-900">
              {auditResult.streaming_stats.unique_listeners.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Risk Flags */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Detected Issues</h3>
          <span className="text-sm text-gray-500">{auditResult.flags.length} flags</span>
        </div>

        <div className="space-y-2 mb-6">
          {auditResult.flags.map((flag, idx) => (
            <RiskFlag key={idx} flag={flag} index={idx} />
          ))}
        </div>

        {/* Call to Action */}
        <div className={`p-4 rounded-lg ${auditResult.score < 70 ? 'bg-red-50 border border-red-200' : 'bg-indigo-50 border border-indigo-200'}`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{auditResult.score < 70 ? '🚨' : '💡'}</span>
            <div>
              <p className={`font-medium ${auditResult.score < 70 ? 'text-red-800' : 'text-indigo-800'}`}>
                {auditResult.score < 70 
                  ? 'You are currently losing money on every play.'
                  : 'Your metadata looks good, but we can help you track every dollar.'}
              </p>
              <p className={`text-sm mt-1 ${auditResult.score < 70 ? 'text-red-600' : 'text-indigo-600'}`}>
                Upgrade to the Pro Portal to fix these issues and recover lost revenue.
              </p>
              <button className="mt-3 px-4 py-2 bg-indigo-900 text-white rounded-lg hover:bg-indigo-800 text-sm transition">
                View Pro Audit Report →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Technical Details */}
      <div className="border-t border-gray-200">
        <button
          onClick={() => setShowFullReport(!showFullReport)}
          className="w-full p-4 text-left text-sm text-gray-600 hover:bg-gray-50 transition flex justify-between items-center"
        >
          <span>🔍 Show technical audit details</span>
          <span>{showFullReport ? '▲' : '▼'}</span>
        </button>
        
        {showFullReport && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs font-mono text-gray-700">
            <p><span className="font-bold">MBID:</span> {auditResult.mbid}</p>
            <p><span className="font-bold">Score Calculation:</span> 100 - {100 - auditResult.score} points deducted</p>
            <p><span className="font-bold">ListenBrainz Cache:</span> Data updated daily</p>
            <p><span className="font-bold">MusicBrainz Lookup:</span> {new Date().toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
