import React from "react";
import { RegistrationAlignment } from "../../../types/aiAttribution";

export const RegistrationAlignmentCard = ({ alignment, onGenerate }: { alignment: RegistrationAlignment; onGenerate: () => void }) => (
  <div className="rounded-2xl shadow p-5 bg-white flex flex-col gap-2">
    <h3 className="font-semibold text-lg mb-1">Registration Alignment</h3>
    <div className="text-sm text-gray-600">
      <div>CMO Support: <span className="font-medium">{alignment.cmoSupport ? "Yes" : "No"}</span></div>
      <div>Conflicts: <span className="font-medium">{alignment.conflicts.length ? alignment.conflicts.join(", ") : "None"}</span></div>
      <div>Required Corrections: <span className="font-medium">{alignment.requiredCorrections.length ? alignment.requiredCorrections.join(", ") : "None"}</span></div>
    </div>
    <button className="mt-3 bg-black text-white px-4 py-2 rounded font-medium" onClick={onGenerate}>
      Generate CMO‑Ready Update Package
    </button>
  </div>
);