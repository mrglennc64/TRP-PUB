import React from "react";

export const Step4 = ({ summary, onBack, onSave }: { summary: any; onBack: () => void; onSave: () => void }) => (
  <div className="rounded-2xl shadow p-6 bg-white flex flex-col gap-4 w-full max-w-xl mx-auto">
    <h2 className="text-xl font-semibold">Confirm & Save</h2>
    <div className="text-sm text-gray-700">
      <div><strong>AI Used:</strong> {summary.aiUsed}</div>
      <div><strong>Models:</strong> {summary.models.join(", ") || "None"}</div>
      <div><strong>Source Works:</strong> {summary.sources.join(", ") || "None"}</div>
    </div>
    <div className="flex gap-2 mt-6 self-end">
      <button className="px-4 py-2 rounded border" onClick={onBack}>Back</button>
      <button className="bg-black text-white px-5 py-3 rounded font-medium" onClick={onSave}>Confirm & Save</button>
    </div>
  </div>
);