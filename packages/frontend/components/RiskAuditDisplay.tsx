'use client';
import React, { useState } from 'react';

interface RiskAuditDisplayProps {
  auditResult: {
    score: number;
    status: string;
    risk_level: string;
    risk_color: string;
    summary: string;
    estimated_loss: string;
    flags: Array<{
      type: string;
      icon: string;
      title: string;
      description: string;
      impact: string;
      fix: string;
    }>;
    revenue_impact: {
      streaming: number;
      mechanical: number;
      performance: number;
      sync: number;
      total: number;
    };
    action_items: string[];
    song_title: string;
    artist: string;
    mbid?: string;
    recording_id?: string;
    streaming_stats: {
      total_listens: number;
      unique_listeners: number;
    };
    isrc: string;
  };
}

const RiskAuditDisplay: React.FC<RiskAuditDisplayProps> = ({ auditResult }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getScoreColor = () => {
    if (auditResult.score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (auditResult.score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreBg = () => {
    if (auditResult.score >= 90) return 'bg-green-600';
    if (auditResult.score >= 70) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getRiskBadgeColor = () => {
    switch(auditResult.risk_color) {
      case 'green': return 'bg-green-100 text-green-800 border-green-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'red': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header with Title and Risk Score */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white p-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold mb-2">Royalty Health Audit</h2>
            <p className="text-indigo-200 text-lg">{auditResult.song_title}</p>
            <p className="text-indigo-300 text-sm mt-1">by {auditResult.artist}</p>
            <p className="text-indigo-300 text-xs mt-2 font-mono">ISRC: {auditResult.isrc}</p>
          </div>
          <div className={`text-center px-6 py-3 rounded-xl ${getScoreColor()} border-2`}>
            <div className="text-4xl font-bold">{auditResult.score}</div>
            <div className="text-sm font-semibold">{auditResult.status}</div>
          </div>
        </div>
      </div>

      {/* Risk Level Banner */}
      <div className={`p-4 ${getRiskBadgeColor()} border-b flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">
            {auditResult.risk_color === 'green' ? '✅' : auditResult.risk_color === 'yellow' ? '⚠️' : '🚨'}
          </span>
          <span className="font-bold text-lg">{auditResult.risk_level}</span>
        </div>
        <span className="text-sm font-medium">Estimated Loss: {auditResult.estimated_loss}</span>
      </div>

      {/* Summary */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <p className="text-lg text-gray-800">{auditResult.summary}</p>
      </div>

      {/* Streaming Stats */}
      {auditResult.streaming_stats.total_listens > 0 && (
        <div className="grid grid-cols-2 gap-6 p-8 bg-indigo-50 border-b border-indigo-100">
          <div className="text-center">
            <p className="text-sm text-indigo-600 mb-2">Total Listens</p>
            <p className="text-4xl font-bold text-indigo-900">
              {auditResult.streaming_stats.total_listens.toLocaleString()}
            </p>
            <p className="text-xs text-indigo-500 mt-2">at risk of non-payment</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-indigo-600 mb-2">Unique Listeners</p>
            <p className="text-4xl font-bold text-indigo-900">
              {auditResult.streaming_stats.unique_listeners.toLocaleString()}
            </p>
            <p className="text-xs text-indigo-500 mt-2">monthly audience</p>
          </div>
        </div>
      )}

      {/* Revenue Impact Breakdown */}
      {auditResult.revenue_impact.total > 0 && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Impact by Category</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-gray-600">Streaming</div>
              <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600" 
                  style={{ width: `${auditResult.revenue_impact.streaming}%` }}
                ></div>
              </div>
              <div className="w-16 text-sm font-bold text-gray-900">{auditResult.revenue_impact.streaming}%</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-gray-600">Mechanical</div>
              <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600" 
                  style={{ width: `${auditResult.revenue_impact.mechanical}%` }}
                ></div>
              </div>
              <div className="w-16 text-sm font-bold text-gray-900">{auditResult.revenue_impact.mechanical}%</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-gray-600">Performance</div>
              <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600" 
                  style={{ width: `${auditResult.revenue_impact.performance}%` }}
                ></div>
              </div>
              <div className="w-16 text-sm font-bold text-gray-900">{auditResult.revenue_impact.performance}%</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-gray-600">Sync</div>
              <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-600" 
                  style={{ width: `${auditResult.revenue_impact.sync}%` }}
                ></div>
              </div>
              <div className="w-16 text-sm font-bold text-gray-900">{auditResult.revenue_impact.sync}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Detected Issues */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Issues</h3>
        <div className="space-y-4">
          {auditResult.flags.map((flag, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="text-2xl">{flag.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-900">{flag.title}</h4>
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    flag.type === 'critical' ? 'bg-red-100 text-red-700' :
                    flag.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                    flag.type === 'success' ? 'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {flag.impact}
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-2">{flag.description}</p>
                <p className="text-xs text-indigo-600 font-medium">Fix: {flag.fix}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      {auditResult.action_items.length > 0 && (
        <div className="p-6 bg-indigo-50 border-b border-indigo-100">
          <h3 className="text-lg font-semibold text-indigo-900 mb-4">Priority Actions</h3>
          <div className="space-y-2">
            {auditResult.action_items.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-800 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <p className="text-gray-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="p-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-100">
        <div className="flex items-start gap-6">
          <div className="text-5xl">💡</div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-indigo-900 mb-2">Ready to fix these issues?</h4>
            <p className="text-indigo-700 mb-4">
              Our Pro Portal automatically resolves metadata gaps and recovers lost revenue.
              Labels using our platform recover an average of 85% of previously lost royalties.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-indigo-900 text-white rounded-xl hover:bg-indigo-800 transition font-semibold">
                Fix Issues Now →
              </button>
              <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl hover:bg-indigo-50 transition font-semibold border border-indigo-200">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Details Toggle */}
      <div className="border-t border-gray-200">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full p-4 text-left text-sm text-gray-600 hover:bg-gray-50 transition flex justify-between items-center"
        >
          <span>🔍 Show technical audit details</span>
          <span>{showDetails ? '▲' : '▼'}</span>
        </button>
        
        {showDetails && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs font-mono text-gray-700">
            <p><span className="font-bold">SMPT ID:</span> {auditResult.mbid || 'N/A'}</p>
            <p><span className="font-bold">Recording ID:</span> {auditResult.recording_id || 'N/A'}</p>
            <p><span className="font-bold">Audit Timestamp:</span> {new Date().toLocaleString()}</p>
            <p><span className="font-bold">Data Sources:</span> SMPT, ListenBrainz</p>
            <p><span className="font-bold">Risk Calculation:</span> Based on metadata completeness and identifier presence</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskAuditDisplay;
