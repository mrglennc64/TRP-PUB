import React from "react";
import { DerivativeLineage } from "../../../types/aiAttribution";

export const LineageCard = ({ lineage }: { lineage: DerivativeLineage }) => (
  <div className="rounded-2xl shadow p-5 bg-white flex flex-col gap-2">
    <h3 className="font-semibold text-lg mb-1">Derivative Lineage</h3>
    <div className="text-sm text-gray-600">
      <div>Source Works: <span className="font-medium">{lineage.sourceWorks.join(", ") || "None"}</span></div>
      <div>Similarity: <span className="font-medium">{lineage.similarityIndicators.join(", ") || "None"}</span></div>
      <div>Derivative Relationships: <span className="font-medium">{lineage.derivativeRelationships.join(", ") || "None"}</span></div>
      <div>Jurisdiction: <span className="font-medium">{lineage.jurisdictionRelevance.join(", ") || "None"}</span></div>
    </div>
  </div>
);