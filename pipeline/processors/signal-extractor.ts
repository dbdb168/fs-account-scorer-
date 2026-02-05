/**
 * Signal Extractor - Uses Claude API to analyze raw data
 * and extract structured buy signals
 */

import Anthropic from "@anthropic-ai/sdk";
import type { EarningsTranscript, PressRelease } from "../sources/financial-modeling-prep.js";
import type { FilingData } from "../sources/sec-edgar.js";
import type { AppStoreData } from "../sources/app-store.js";

export interface Evidence {
  text: string;
  source: string;
  sourceUrl: string;
  date: string;
}

export interface Signal {
  score: number;
  weight: number;
  evidence: Evidence[];
}

export interface ExtractedSignals {
  aiCxInvestment: Signal;
  newMarkets: Signal;
  newProducts: Signal;
  leadershipChanges: Signal;
  cxIndicators: Signal;
}

interface RawData {
  transcripts: EarningsTranscript[];
  pressReleases: PressRelease[];
  secFilings: FilingData[];
  appStoreData: AppStoreData | null;
}

const EXTRACTION_PROMPT = `You are analyzing financial data to score a company's likelihood of needing digital product and customer experience (CX) consulting work.

TODAY'S DATE: 2026-02-05

CRITICAL RULES:
- ONLY use evidence from the data provided below. Do NOT invent or assume information.
- For dates, use the actual date from the source. If a review or filing doesn't have a date, use "2026-02-01" (recent).
- If no relevant data exists for a category, score it 50 and provide one evidence item: {"text": "Insufficient data available", "source": "N/A", "date": "2026-02-05"}

Analyze the provided data and extract signals for each category. For each category, provide:
1. A score from 0-100 (higher = stronger buy signal)
2. 2-4 pieces of evidence with exact quotes or data points from the provided data

SCORING GUIDELINES:

**AI & CX Investment (weight: 30%)**
- 80-100: Explicit mentions of large AI/digital investments, hiring AI talent, digital transformation initiatives
- 50-79: General technology investment mentions, some digital focus
- 0-49: Minimal or no digital/AI investment signals

**New Market Entry (weight: 20%)**
- 80-100: Announced expansion into new geographic markets or customer segments
- 50-79: Exploring new markets, partnerships for expansion
- 0-49: Focused on existing markets only

**New Products (weight: 20%)**
- 80-100: Launching new digital products, apps, or major feature updates
- 50-79: Incremental product updates, planned launches
- 0-49: Maintenance mode, no significant new products

**Leadership Changes (weight: 15%)**
- 80-100: New CTO, CDO, CIO, or CXO within last 12 months
- 50-79: Leadership changes in digital/tech-adjacent roles
- 0-49: Stable leadership, no recent changes

**CX Indicators (weight: 15%)**
- HIGH SCORE = MORE PAIN (opportunity for consultants)
- 80-100: Poor app ratings (<4.0), significant complaints, regulatory issues
- 50-79: Mixed reviews, some complaints
- 0-49: Strong ratings (>4.5), positive customer sentiment (less opportunity)

Respond in this exact JSON format:
{
  "aiCxInvestment": {
    "score": <number>,
    "evidence": [
      {"text": "<exact quote or data point>", "source": "<source name>", "date": "<YYYY-MM-DD>"}
    ]
  },
  "newMarkets": {
    "score": <number>,
    "evidence": [...]
  },
  "newProducts": {
    "score": <number>,
    "evidence": [...]
  },
  "leadershipChanges": {
    "score": <number>,
    "evidence": [...]
  },
  "cxIndicators": {
    "score": <number>,
    "evidence": [...]
  }
}`;

export async function extractSignals(
  companyName: string,
  ticker: string,
  rawData: RawData,
  anthropicApiKey: string
): Promise<ExtractedSignals> {
  const client = new Anthropic({ apiKey: anthropicApiKey });

  // Prepare data summary for Claude
  const dataSummary = prepareDataSummary(companyName, ticker, rawData);

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `${EXTRACTION_PROMPT}\n\n---\n\nCOMPANY: ${companyName} (${ticker})\n\n${dataSummary}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    // Parse JSON from response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Build full signal objects with weights and source URLs
    return buildSignals(parsed, rawData);
  } catch (error) {
    console.error(`Error extracting signals for ${companyName}:`, error);
    // Return default low scores on error
    return getDefaultSignals();
  }
}

function prepareDataSummary(companyName: string, ticker: string, rawData: RawData): string {
  const sections: string[] = [];

  // Earnings transcripts
  if (rawData.transcripts.length > 0) {
    sections.push("## EARNINGS CALL TRANSCRIPTS\n");
    for (const t of rawData.transcripts) {
      // Truncate long transcripts
      const content = t.content.length > 15000 ? t.content.slice(0, 15000) + "...[truncated]" : t.content;
      sections.push(`### Q${t.quarter} ${t.year} (${t.date})\n${content}\n`);
    }
  }

  // Press releases
  if (rawData.pressReleases.length > 0) {
    sections.push("## PRESS RELEASES (Last 12 months)\n");
    for (const pr of rawData.pressReleases.slice(0, 20)) {
      sections.push(`### ${pr.date}: ${pr.title}\n${pr.text.slice(0, 2000)}\n`);
    }
  }

  // SEC filings (just metadata, content is too large)
  if (rawData.secFilings.length > 0) {
    sections.push("## SEC FILINGS\n");
    for (const f of rawData.secFilings) {
      sections.push(`- ${f.filingType} filed ${f.filingDate}: ${f.url}\n`);
    }
  }

  // App Store data
  if (rawData.appStoreData) {
    const app = rawData.appStoreData;
    sections.push(`## APP STORE DATA\n`);
    sections.push(`App: ${app.appName}\n`);
    sections.push(`Average Rating: ${app.averageRating}/5 (${app.reviewCount} recent reviews)\n\n`);
    sections.push("Recent Reviews:\n");
    for (const review of app.reviews.slice(0, 20)) {
      sections.push(`- [${review.rating}/5] "${review.title}": ${review.content.slice(0, 300)}\n`);
    }
  }

  return sections.join("\n");
}

function buildSignals(
  parsed: any,
  rawData: RawData
): ExtractedSignals {
  const weights = {
    aiCxInvestment: 0.3,
    newMarkets: 0.2,
    newProducts: 0.2,
    leadershipChanges: 0.15,
    cxIndicators: 0.15,
  };

  const buildEvidence = (evidenceList: any[], category: string): Evidence[] => {
    return (evidenceList || []).map((e: any) => ({
      text: e.text || "",
      source: e.source || "Unknown",
      sourceUrl: getSourceUrl(e.source, rawData),
      date: e.date || new Date().toISOString().split("T")[0],
    }));
  };

  return {
    aiCxInvestment: {
      score: parsed.aiCxInvestment?.score || 50,
      weight: weights.aiCxInvestment,
      evidence: buildEvidence(parsed.aiCxInvestment?.evidence, "aiCxInvestment"),
    },
    newMarkets: {
      score: parsed.newMarkets?.score || 50,
      weight: weights.newMarkets,
      evidence: buildEvidence(parsed.newMarkets?.evidence, "newMarkets"),
    },
    newProducts: {
      score: parsed.newProducts?.score || 50,
      weight: weights.newProducts,
      evidence: buildEvidence(parsed.newProducts?.evidence, "newProducts"),
    },
    leadershipChanges: {
      score: parsed.leadershipChanges?.score || 50,
      weight: weights.leadershipChanges,
      evidence: buildEvidence(parsed.leadershipChanges?.evidence, "leadershipChanges"),
    },
    cxIndicators: {
      score: parsed.cxIndicators?.score || 50,
      weight: weights.cxIndicators,
      evidence: buildEvidence(parsed.cxIndicators?.evidence, "cxIndicators"),
    },
  };
}

function getSourceUrl(sourceName: string, rawData: RawData): string {
  // Try to match source to actual URL
  const lowerSource = (sourceName || "").toLowerCase();

  if (lowerSource.includes("earnings") || lowerSource.includes("q1") || lowerSource.includes("q2") || lowerSource.includes("q3") || lowerSource.includes("q4")) {
    return "https://investor.relations"; // Placeholder
  }

  if (lowerSource.includes("press") || lowerSource.includes("release")) {
    const pr = rawData.pressReleases.find((p) => p.url);
    return pr?.url || "https://company.com/news";
  }

  if (lowerSource.includes("app store") || lowerSource.includes("review")) {
    return "https://apps.apple.com";
  }

  if (lowerSource.includes("sec") || lowerSource.includes("10-k") || lowerSource.includes("10-q")) {
    const filing = rawData.secFilings[0];
    return filing?.url || "https://sec.gov";
  }

  return "#";
}

function getDefaultSignals(): ExtractedSignals {
  const defaultSignal = (weight: number): Signal => ({
    score: 50,
    weight,
    evidence: [{ text: "Data unavailable", source: "N/A", sourceUrl: "#", date: new Date().toISOString().split("T")[0] }],
  });

  return {
    aiCxInvestment: defaultSignal(0.3),
    newMarkets: defaultSignal(0.2),
    newProducts: defaultSignal(0.2),
    leadershipChanges: defaultSignal(0.15),
    cxIndicators: defaultSignal(0.15),
  };
}
