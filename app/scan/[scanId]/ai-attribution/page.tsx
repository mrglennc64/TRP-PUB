import { useEffect } from "react";
// External Attribution Sources UI
function ExternalAttributionSources({ isrc, artist, title }: { isrc: string; artist: string; title: string }) {
  const [musicbrainz, setMusicbrainz] = useState<any>(null);
  const [discogs, setDiscogs] = useState<any>(null);
  const [listenbrainz, setListenbrainz] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isrc && !artist && !title) return;
    setLoading(true);
    // MusicBrainz ISRC lookup
    fetch(`https://musicbrainz.org/ws/2/isrc/${isrc}?fmt=json&inc=artist-credits+releases`)
      .then(r => r.json())
      .then(data => setMusicbrainz(data.recordings?.[0] || null))
      .catch(() => setMusicbrainz(null));
    // Discogs search (no ISRC search in public API, so use title/artist)
    fetch(`https://api.discogs.com/database/search?artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(title)}&type=release&per_page=1`)
      .then(r => r.json())
      .then(data => setDiscogs(data.results?.[0] || null))
      .catch(() => setDiscogs(null));
    // ListenBrainz popularity (artist MBID required, so stubbed for now)
    setListenbrainz(null); // Could fetch if MBID is known
    setLoading(false);
  }, [isrc, artist, title]);

  return (
    <div className="rounded-2xl shadow p-5 bg-white mt-6">
      <h2 className="font-semibold mb-2">External Attribution Sources</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <h3 className="font-semibold text-sm mb-1">MusicBrainz</h3>
          {musicbrainz ? (
            <div className="text-xs text-gray-700">
              <div>Title: {musicbrainz.title}</div>
              <div>Artist: {musicbrainz["artist-credit"]?.[0]?.name}</div>
              <div>ISRC: {musicbrainz.isrcs?.[0]}</div>
              <div>Release: {musicbrainz.releases?.[0]?.title}</div>
            </div>
          ) : <div className="text-xs text-gray-400">No data</div>}
        </div>
        <div>
          <h3 className="font-semibold text-sm mb-1">Discogs</h3>
          {discogs ? (
            <div className="text-xs text-gray-700">
              <div>Title: {discogs.title}</div>
              <div>Artist: {discogs.artist}</div>
              <div>Year: {discogs.year}</div>
              <div>Label: {discogs.label?.[0]}</div>
            </div>
          ) : <div className="text-xs text-gray-400">No data</div>}
        </div>
        <div>
          <h3 className="font-semibold text-sm mb-1">ListenBrainz</h3>
          <div className="text-xs text-gray-400">Integration requires artist MBID</div>
        </div>
        <div>
          <h3 className="font-semibold text-sm mb-1">Deezer</h3>
          <div className="text-xs text-gray-400">API key required (stub only)</div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { HeroCard } from "../../../../components/ai-attribution/HeroCard";
import { InvolvementCard } from "../../../../components/ai-attribution/breakdown/InvolvementCard";
import { LineageCard } from "../../../../components/ai-attribution/breakdown/LineageCard";
import { RegistrationAlignmentCard } from "../../../../components/ai-attribution/breakdown/RegistrationAlignmentCard";
import { AttributionMatrixCard } from "../../../../components/ai-attribution/detail/AttributionMatrixCard";
import { ProvenanceTimelineCard } from "../../../../components/ai-attribution/detail/ProvenanceTimelineCard";
import { RiskCard } from "../../../../components/ai-attribution/detail/RiskCard";
import { AuditModeCard } from "../../../../components/ai-attribution/AuditModeCard";
import { ConflictResolutionCard } from "../../../../components/ai-attribution/ConflictResolutionCard";
import { Step1 } from "../../../../components/ai-attribution/wizard/Step1";
import { Step2 } from "../../../../components/ai-attribution/wizard/Step2";
import { Step3 } from "../../../../components/ai-attribution/wizard/Step3";
import { Step4 } from "../../../../components/ai-attribution/wizard/Step4";
import type {
  AIAttributionSummary,
  AIInvolvement,
  DerivativeLineage,
  RegistrationAlignment,
  AttributionMatrix,
  ProvenanceEvent,
  RiskAssessment,
} from "../../../../types/aiAttribution";

// Placeholder/mock data
const summary: AIAttributionSummary = {
  badge: "AI‑Assisted",
  provenanceCompleteness: 72,
  riskLevel: "medium",
};
const involvement: AIInvolvement = {
  detectedModels: ["ChatGPT", "Stable Diffusion"],
  humanVsAI: { human: 60, ai: 40 },
  confidenceScore: 87,
  missingDeclarations: ["Producer"],
};
const lineage: DerivativeLineage = {
  sourceWorks: ["Original Song A"],
  similarityIndicators: ["Melody"],
  derivativeRelationships: ["Remix"],
  jurisdictionRelevance: ["US", "EU"],
};
const alignment: RegistrationAlignment = {
  cmoSupport: true,
  conflicts: ["Composer mismatch"],
  requiredCorrections: ["Update lyricist attribution"],
};
const matrix: AttributionMatrix = {
  human: [
    { nameOrModel: "Alice", contributionPercent: 50, confidence: 90, source: "manual" },
    { nameOrModel: "Bob", contributionPercent: 10, confidence: 80, source: "manual" },
    { nameOrModel: "", contributionPercent: 0, confidence: 0, source: "manual" },
  ],
  ai: [
    { nameOrModel: "ChatGPT", contributionPercent: 20, confidence: 95, source: "inferred" },
    { nameOrModel: "Stable Diffusion", contributionPercent: 20, confidence: 90, source: "inferred" },
    { nameOrModel: "", contributionPercent: 0, confidence: 0, source: "inferred" },
  ],
  hybrid: [
    { nameOrModel: "HybridX", contributionPercent: 0, confidence: 0, source: "external" },
    { nameOrModel: "", contributionPercent: 0, confidence: 0, source: "external" },
    { nameOrModel: "", contributionPercent: 0, confidence: 0, source: "external" },
  ],
};
const events: ProvenanceEvent[] = [
  { type: "creation", timestamp: "2026-04-01", description: "Work created" },
  { type: "ai-generation", timestamp: "2026-04-02", description: "AI-generated lyrics" },
  { type: "edit", timestamp: "2026-04-03", description: "Manual edits" },
  { type: "registration", timestamp: "2026-04-04", description: "Registered with CMO" },
];
const risk: RiskAssessment = {
  riskLevel: "medium",
  missingMetadata: ["Producer"],
  jurisdictionRequirements: ["EU AI declaration"],
  recommendations: ["Add missing producer", "Review EU requirements"],
};

  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [aiUsed, setAiUsed] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [savedSummary, setSavedSummary] = useState<any>(null);

  const handleWizardClose = () => {
    setShowWizard(false);
    setWizardStep(1);
    setAiUsed("");
    setModels([]);
    setSources([]);
  };

  return (
    <div className="p-6 space-y-6">
      <HeroCard summary={summary} onViewDetails={() => setShowWizard(true)} />
      <div className="grid md:grid-cols-3 gap-4">
        <InvolvementCard involvement={involvement} />
        <LineageCard lineage={lineage} />
        <RegistrationAlignmentCard alignment={alignment} onGenerate={() => alert("CMO Package")}/>
      </div>
      <div className="space-y-4">
        <AttributionMatrixCard matrix={matrix} />
        <ProvenanceTimelineCard events={events} />
        <RiskCard risk={risk} />
      </div>
      <AuditModeCard missingAI={2} derivativeAmbiguity={1} cmoConflicts={1} onReview={() => alert("Review All")}/>
      <ConflictResolutionCard verseIQ="Alice: 50% (manual)" cmo="Alice: 40% (CMO)" onGenerate={() => alert("Correction Package")}/>
      {/* External Attribution Sources UI: sample ISRC/artist/title shown */}
      <ExternalAttributionSources isrc="USRC17607839" artist="Daft Punk" title="Get Lucky" />
      {showWizard && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Guided Attribution Wizard</h2>
            {wizardStep === 1 && (
              <Step1
                value={aiUsed}
                onChange={setAiUsed}
                onNext={() => setWizardStep(2)}
              />
            )}
            {wizardStep === 2 && (
              <Step2
                models={models}
                onChange={setModels}
                onNext={() => setWizardStep(3)}
                onBack={() => setWizardStep(1)}
              />
            )}
            {wizardStep === 3 && (
              <Step3
                sources={sources}
                onChange={setSources}
                onNext={() => setWizardStep(4)}
                onBack={() => setWizardStep(2)}
              />
            )}
            {wizardStep === 4 && (
              <Step4
                summary={{ aiUsed, models, sources }}
                onBack={() => setWizardStep(3)}
                onSave={() => {
                  setSavedSummary({ aiUsed, models, sources });
                  handleWizardClose();
                }}
              />
            )}
            <button className="mt-4 bg-gray-200 text-gray-700 px-5 py-2 rounded font-medium" onClick={handleWizardClose}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
