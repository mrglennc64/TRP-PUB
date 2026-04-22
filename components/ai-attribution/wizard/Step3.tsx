import React from "react";

export const Step3 = ({ sources, onChange, onNext, onBack }: { sources: string[]; onChange: (sources: string[]) => void; onNext: () => void; onBack: () => void }) => (
  <div className="rounded-2xl shadow p-6 bg-white flex flex-col gap-4 w-full max-w-xl mx-auto">
    <h2 className="text-xl font-semibold">Any source works used?</h2>
    <input
      className="border rounded px-3 py-2 mt-2"
      placeholder="List source works (comma separated)"
      value={sources.join(", ")}
      onChange={e => onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
    />
    <div className="flex gap-2 mt-6 self-end">
      <button className="px-4 py-2 rounded border" onClick={onBack}>Back</button>
      <button className="bg-black text-white px-5 py-3 rounded font-medium" onClick={onNext}>Next</button>
    </div>
  </div>
);