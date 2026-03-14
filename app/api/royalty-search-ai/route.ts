import { NextResponse } from 'next/server';

// Ollama runs locally (or on VPS) — no external API calls, no per-request charges
const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b';

const SYSTEM_PROMPT = `You are a forensic royalty investigator specializing in finding unclaimed and black box royalties.

You help music rights owners discover money owed from:
- MLC (Mechanical Licensing Collective) — US mechanical royalties
- SoundExchange — Digital performance royalties
- ASCAP, BMI, SOCAN, PRS, GEMA, APRA — Performing rights
- Black box royalties — Unmatched international collections
- YouTube Content ID, neighboring rights

Return ONLY valid JSON. No markdown, no explanation.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, type, isrc, iswc, artistName, trackTitle, territory } = body;

    if (!query && !isrc && !artistName && !trackTitle) {
      return NextResponse.json({ error: 'Provide at least one search parameter' }, { status: 400 });
    }

    const prompt = `Based on these search parameters, analyze potential unclaimed royalties and return this JSON structure:
{
  "searchSummary": {
    "query": string,
    "type": string,
    "territoriesAnalyzed": [string],
    "estimatedTotalUnclaimed": number,
    "confidenceLevel": "high" | "medium" | "low",
    "timeframeAnalyzed": string
  },
  "unclaimedSources": [
    {
      "source": string,
      "type": "mechanical" | "performance" | "digital_performance" | "neighboring_rights" | "sync" | "black_box",
      "organization": string,
      "territory": string,
      "estimatedAmount": number,
      "currency": "USD",
      "period": string,
      "status": "likely_unclaimed" | "possibly_unclaimed" | "registration_gap" | "requires_registration",
      "confidence": "high" | "medium" | "low",
      "reason": string,
      "claimDeadline": null,
      "actionRequired": string
    }
  ],
  "registrationGaps": [
    {
      "organization": string,
      "type": string,
      "territory": string,
      "impact": string,
      "estimatedLoss": number,
      "registrationUrl": null,
      "priority": "urgent" | "high" | "medium" | "low"
    }
  ],
  "mlcSearch": {
    "eligibleForMLC": boolean,
    "estimatedMechanicals": number,
    "registrationStatus": "registered" | "unregistered" | "unknown",
    "claimProcess": string,
    "deadline": null
  },
  "soundExchangeSearch": {
    "eligibleForSoundExchange": boolean,
    "estimatedDigitalPerformance": number,
    "claimProcess": string,
    "requiredIdentifiers": [string]
  },
  "blackBoxAnalysis": {
    "hasBlackBoxRisk": boolean,
    "estimatedBlackBox": number,
    "primarySocieties": [string],
    "recoveryStrategy": string
  },
  "priorityActions": [
    {
      "action": string,
      "priority": "urgent" | "high" | "medium" | "low",
      "estimatedRecovery": number,
      "timeToComplete": string,
      "resources": [string]
    }
  ],
  "letterOfDirection": {
    "recommended": boolean,
    "recipient": null,
    "basis": null
  },
  "totalRecoveryPotential": {
    "conservative": number,
    "optimistic": number,
    "currency": "USD"
  }
}

Search parameters:
${JSON.stringify({ query, type, isrc, iswc, artistName, trackTitle, territory }, null, 2)}`;

    const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        options: { temperature: 0.1 },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!ollamaRes.ok) {
      throw new Error(`Ollama error: ${ollamaRes.status} — is Ollama running at ${OLLAMA_URL}?`);
    }

    const ollamaData = await ollamaRes.json();
    const raw = ollamaData.message?.content || '';

    let result;
    try {
      const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
      result = JSON.parse(cleaned);
    } catch {
      throw new Error('Model returned invalid JSON');
    }

    return NextResponse.json({ success: true, result, model: OLLAMA_MODEL });
  } catch (error) {
    console.error('Royalty search error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
