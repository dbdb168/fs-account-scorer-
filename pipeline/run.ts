#!/usr/bin/env npx ts-node

/**
 * Main Pipeline Orchestrator
 * Fetches data from all sources and generates scored company data
 *
 * Usage:
 *   npx ts-node pipeline/run.ts
 *
 * Environment variables:
 *   FMP_API_KEY - Financial Modeling Prep API key
 *   ANTHROPIC_API_KEY - Anthropic API key for Claude
 *   APOLLO_API_KEY - Apollo.io API key (optional)
 */

import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { COMPANIES, SIGNAL_WEIGHTS, type CompanyConfig } from "./config.js";
import { fetchSECFilings, type FilingData } from "./sources/sec-edgar.js";
import {
  fetchEarningsTranscripts,
  fetchPressReleases,
  type EarningsTranscript,
  type PressRelease,
} from "./sources/financial-modeling-prep.js";
import { fetchAppStoreReviewsForCompany, type AppStoreData } from "./sources/app-store.js";
import { extractSignals, type ExtractedSignals } from "./processors/signal-extractor.js";

interface Executive {
  name: string;
  title: string;
  linkedIn: string;
  tenureMonths?: number;
  isNewHire?: boolean;
}

interface Company {
  id: string;
  name: string;
  ticker: string;
  sector: "bank" | "insurance";
  country: "US" | "CA";
  score: number;
  tier: "high" | "medium" | "lower";
  signals: ExtractedSignals;
  executives: Executive[];
  lastUpdated: string;
}

function calculateScore(signals: ExtractedSignals): number {
  let weightedSum = 0;
  for (const [key, signal] of Object.entries(signals)) {
    weightedSum += signal.score * signal.weight;
  }
  return Math.round(weightedSum);
}

function getTier(score: number): "high" | "medium" | "lower" {
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  return "lower";
}

async function processCompany(
  config: CompanyConfig,
  fmpApiKey: string,
  anthropicApiKey: string
): Promise<Company> {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`Processing: ${config.name} (${config.ticker})`);
  console.log("=".repeat(50));

  // Fetch data from all sources in parallel
  const [secFilings, transcripts, pressReleases, appStoreData] = await Promise.all([
    fetchSECFilings(config),
    fmpApiKey ? fetchEarningsTranscripts(config, fmpApiKey, 2) : Promise.resolve([]),
    fmpApiKey ? fetchPressReleases(config, fmpApiKey, 50) : Promise.resolve([]),
    fetchAppStoreReviewsForCompany(config),
  ]);

  console.log(`Data collected: ${secFilings.length} SEC filings, ${transcripts.length} transcripts, ${pressReleases.length} press releases`);

  // Extract signals using Claude
  const signals = await extractSignals(
    config.name,
    config.ticker,
    {
      transcripts,
      pressReleases,
      secFilings,
      appStoreData,
    },
    anthropicApiKey
  );

  const score = calculateScore(signals);
  const tier = getTier(score);

  console.log(`Score: ${score} (${tier} priority)`);

  return {
    id: config.id,
    name: config.name,
    ticker: config.ticker,
    sector: config.sector,
    country: config.country,
    score,
    tier,
    signals,
    executives: [], // TODO: Fetch from Apollo.io
    lastUpdated: new Date().toISOString().split("T")[0],
  };
}

async function main() {
  console.log("FS Account Scorer - Data Pipeline");
  console.log("==================================\n");

  // Check environment variables
  const fmpApiKey = process.env.FMP_API_KEY || "";
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY || "";

  if (!anthropicApiKey) {
    console.error("Error: ANTHROPIC_API_KEY environment variable is required");
    process.exit(1);
  }

  if (!fmpApiKey) {
    console.warn("Warning: FMP_API_KEY not set - skipping earnings transcripts and press releases");
  }

  // Process subset or all companies based on args
  const args = process.argv.slice(2);
  let companiesToProcess = COMPANIES;

  if (args.includes("--test")) {
    // Test mode: just process first 3 companies
    companiesToProcess = COMPANIES.slice(0, 3);
    console.log("Test mode: processing first 3 companies only\n");
  } else if (args.length > 0 && !args[0].startsWith("--")) {
    // Process specific tickers
    const tickers = args.map((t) => t.toUpperCase());
    companiesToProcess = COMPANIES.filter((c) => tickers.includes(c.ticker));
    console.log(`Processing specific companies: ${tickers.join(", ")}\n`);
  }

  const results: Company[] = [];

  for (const config of companiesToProcess) {
    try {
      const company = await processCompany(config, fmpApiKey, anthropicApiKey);
      results.push(company);

      // Add delay between companies to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error processing ${config.name}:`, error);
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  // Write output
  const outputPath = path.join(process.cwd(), "src", "data", "companies.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\n${"=".repeat(50)}`);
  console.log(`Pipeline complete!`);
  console.log(`Processed ${results.length} companies`);
  console.log(`Output written to: ${outputPath}`);
  console.log("=".repeat(50));

  // Print summary
  console.log("\nSummary:");
  console.log("-".repeat(40));
  for (const company of results) {
    console.log(`${company.score.toString().padStart(3)} | ${company.tier.padEnd(6)} | ${company.name}`);
  }
}

main().catch(console.error);
