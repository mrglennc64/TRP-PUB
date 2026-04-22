import React from "react";
import { AIInvolvement } from "../../../types/aiAttribution";

export const InvolvementCard = ({ involvement }: { involvement: AIInvolvement }) => (
  <div className="rounded-2xl shadow p-5 bg-white flex flex-col gap-2">
    <h3 className="font-semibold text-lg mb-1">AI Involvement</h3>
    <div className="text-sm text-gray-600">
      <div>Detected Models: <span className="font-medium">{involvement.detectedModels.join(", ") || "None"}</span></div>
      <div>Human vs AI Ratio: <span className="font-medium">{involvement.humanVsAI.human}% / {involvement.humanVsAI.ai}%</span></div>
      <div>Confidence Score: <span className="font-medium">{involvement.confidenceScore}%</span></div>
      <div>Missing Declarations: <span className="font-medium">{involvement.missingDeclarations.length ? involvement.missingDeclarations.join(", ") : "None"}</span></div>
    </div>
  </div>
);