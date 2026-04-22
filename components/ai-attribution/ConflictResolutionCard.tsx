import React from "react";

export const ConflictResolutionCard = ({ verseIQ, cmo, onGenerate }: { verseIQ: any; cmo: any; onGenerate: () => void }) => (
  <div className="rounded-2xl shadow p-5 bg-white flex flex-col md:flex-row gap-6">
    <div className="flex-1">
      <h4 className="font-semibold text-gray-700 mb-2">VerseIQ Attribution</h4>
      <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
        {verseIQ}
      </div>
    </div>
    <div className="flex-1">
      <h4 className="font-semibold text-gray-700 mb-2">CMO Registration</h4>
      <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
        {cmo}
      </div>
    </div>
    <div className="flex flex-col justify-center items-end gap-2">
      <button className="bg-black text-white px-4 py-2 rounded font-medium" onClick={onGenerate}>
        Generate Correction Package
      </button>
    </div>
  </div>
);