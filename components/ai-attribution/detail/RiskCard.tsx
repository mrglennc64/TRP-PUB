import React from "react";
import { RiskAssessment } from "../../../types/aiAttribution";

const riskColors = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
  unknown: "bg-gray-100 text-gray-700",
};

export const RiskCard = ({ risk }: { risk: RiskAssessment }) => (
  <div className="rounded-2xl shadow p-5 bg-white">
    <h3 className="font-semibold text-lg mb-3">Risk & Recommendations</h3>
    <div className={`inline-block px-3 py-1 rounded font-semibold text-xs mb-2 ${riskColors[risk.riskLevel]}`}>
      {risk.riskLevel.toUpperCase()} RISK
    </div>
    <div className="text-sm text-gray-700 mb-2">
      <div>Missing Metadata: <span className="font-medium">{risk.missingMetadata.length ? risk.missingMetadata.join(", ") : "None"}</span></div>
      <div>Jurisdiction Requirements: <span className="font-medium">{risk.jurisdictionRequirements.length ? risk.jurisdictionRequirements.join(", ") : "None"}</span></div>
    </div>
    <div className="mt-2">
      <h4 className="font-semibold text-sm mb-1">Recommended Next Actions</h4>
      <ul className="list-disc pl-5 text-sm text-gray-600">
        {risk.recommendations.map((rec, i) => (
          <li key={i}>{rec}</li>
        ))}
      </ul>
    </div>
  </div>
);