import React from "react";
import { AttributionMatrix } from "../../../types/aiAttribution";

const rowLabels = ["Human", "AI", "Hybrid"];
const colLabels = ["Composer", "Lyricist", "Producer"];

export const AttributionMatrixCard = ({ matrix }: { matrix: AttributionMatrix }) => (
  <div className="rounded-2xl shadow p-5 bg-white">
    <h3 className="font-semibold text-lg mb-3">Attribution Matrix</h3>
    <div className="grid grid-cols-4 gap-2 text-sm text-gray-700">
      <div></div>
      {colLabels.map(col => (
        <div key={col} className="font-semibold text-gray-500">{col}</div>
      ))}
      {rowLabels.map((row, i) => (
        <React.Fragment key={row}>
          <div className="font-semibold text-gray-500 py-2">{row}</div>
          {matrix[row.toLowerCase() as keyof AttributionMatrix].map((cell, j) => (
            <div key={j} className="border rounded p-2 flex flex-col gap-1 bg-gray-50">
              <span className="font-medium">{cell.nameOrModel}</span>
              <span className="text-xs">{cell.contributionPercent}% • {cell.confidence}%</span>
              <span className="text-xs text-gray-400">{cell.source}</span>
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  </div>
);