// AI Attribution Types for VerseIQ

export interface AIAttributionSummary {
  badge: 'AI‑Generated' | 'AI‑Assisted' | 'Human‑Only' | 'Unknown';
  provenanceCompleteness: number; // 0–100
  riskLevel: 'low' | 'medium' | 'high' | 'unknown';
}

export interface AIInvolvement {
  detectedModels: string[];
  humanVsAI: { human: number; ai: number };
  confidenceScore: number;
  missingDeclarations: string[];
}

export interface DerivativeLineage {
  sourceWorks: string[];
  similarityIndicators: string[];
  derivativeRelationships: string[];
  jurisdictionRelevance: string[];
}

export interface RegistrationAlignment {
  cmoSupport: boolean;
  conflicts: string[];
  requiredCorrections: string[];
}

export interface AttributionMatrixCell {
  nameOrModel: string;
  contributionPercent: number;
  confidence: number;
  source: 'manual' | 'inferred' | 'external';
}

export interface AttributionMatrix {
  human: AttributionMatrixCell[];
  ai: AttributionMatrixCell[];
  hybrid: AttributionMatrixCell[];
}

export interface ProvenanceEvent {
  type: 'creation' | 'ai-generation' | 'edit' | 'registration';
  timestamp: string;
  description: string;
}

export interface RiskAssessment {
  riskLevel: 'low' | 'medium' | 'high' | 'unknown';
  missingMetadata: string[];
  jurisdictionRequirements: string[];
  recommendations: string[];
}
