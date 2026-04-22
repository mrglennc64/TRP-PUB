import React from "react";
import { AIAttributionSummary } from "../../types/aiAttribution";

const riskColors = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
  unknown: "bg-gray-100 text-gray-700",
};

export const HeroCard = ({
  summary,
  onViewDetails,
}: {
  summary: AIAttributionSummary;
  onViewDetails: () => void;
}) => (
  <div className="rounded-2xl shadow p-6 bg-white flex flex-col md:flex-row justify-between gap-6">
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="px-2 py-1 rounded bg-gray-900 text-white text-xs font-semibold">
          {summary.badge}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${riskColors[summary.riskLevel]}`}>
          {summary.riskLevel.toUpperCase()} RISK
        </span>
      </div>
      <h1 className="text-2xl font-semibold">AI Attribution Overview</h1>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${summary.provenanceCompleteness}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Provenance completeness: {summary.provenanceCompleteness}%
      </p>
    </div>
    <div className="flex flex-col justify-center items-end gap-2">
      <button
        className="bg-black text-white px-5 py-3 rounded font-medium"
        onClick={onViewDetails}
      >
        View Attribution Details
      </button>
    </div>
  </div>
);
