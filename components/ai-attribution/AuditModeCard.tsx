import React from "react";

export const AuditModeCard = ({ missingAI, derivativeAmbiguity, cmoConflicts, onReview }: { missingAI: number; derivativeAmbiguity: number; cmoConflicts: number; onReview: () => void }) => (
  <div className="rounded-2xl shadow p-5 bg-white flex flex-col md:flex-row justify-between items-center gap-6">
    <div>
      <h3 className="text-lg font-semibold mb-2">Audit Mode</h3>
      <div className="text-sm text-gray-700">
        <div><strong>{missingAI}</strong> works missing AI declarations</div>
        <div><strong>{derivativeAmbiguity}</strong> works with derivative ambiguity</div>
        <div><strong>{cmoConflicts}</strong> works with CMO conflicts</div>
      </div>
    </div>
    <button className="bg-black text-white px-5 py-3 rounded font-medium" onClick={onReview}>
      Review All
    </button>
  </div>
);