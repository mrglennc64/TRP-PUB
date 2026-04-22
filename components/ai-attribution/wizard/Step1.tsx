import React from "react";

export const Step1 = ({ value, onChange, onNext }: { value: string; onChange: (v: string) => void; onNext: () => void }) => (
  <div className="rounded-2xl shadow p-6 bg-white flex flex-col gap-4 w-full max-w-xl mx-auto">
    <h2 className="text-xl font-semibold">Was AI used in this work?</h2>
    <div className="flex gap-4 mt-2">
      <button className={`px-4 py-2 rounded border ${value === 'yes' ? 'bg-black text-white' : ''}`} onClick={() => onChange('yes')}>Yes</button>
      <button className={`px-4 py-2 rounded border ${value === 'no' ? 'bg-black text-white' : ''}`} onClick={() => onChange('no')}>No</button>
      <button className={`px-4 py-2 rounded border ${value === 'unknown' ? 'bg-black text-white' : ''}`} onClick={() => onChange('unknown')}>Unknown</button>
    </div>
    <button className="mt-6 bg-black text-white px-5 py-3 rounded font-medium self-end" onClick={onNext} disabled={!value}>Next</button>
  </div>
);