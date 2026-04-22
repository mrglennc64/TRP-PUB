import React from "react";

export const Step2 = ({ models, onChange, onNext, onBack }: { models: string[]; onChange: (models: string[]) => void; onNext: () => void; onBack: () => void }) => {
  const allModels = ["ChatGPT", "Stable Diffusion", "Other"];
  return (
    <div className="rounded-2xl shadow p-6 bg-white flex flex-col gap-4 w-full max-w-xl mx-auto">
      <h2 className="text-xl font-semibold">Which model(s) were used?</h2>
      <div className="flex gap-4 mt-2">
        {allModels.map(model => (
          <button
            key={model}
            className={`px-4 py-2 rounded border ${models.includes(model) ? 'bg-black text-white' : ''}`}
            onClick={() => onChange(models.includes(model) ? models.filter(m => m !== model) : [...models, model])}
          >
            {model}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mt-6 self-end">
        <button className="px-4 py-2 rounded border" onClick={onBack}>Back</button>
        <button className="bg-black text-white px-5 py-3 rounded font-medium" onClick={onNext} disabled={models.length === 0}>Next</button>
      </div>
    </div>
  );
};