/**
 * SEC EDGAR API - Free, no authentication required
 * Fetches 10-K and 10-Q filings for US companies
 */

import { CompanyConfig, API_CONFIG } from "../config.js";

interface SECFiling {
  accessionNumber: string;
  filingDate: string;
  form: string;
  primaryDocument: string;
  primaryDocDescription: string;
}

interface SECSubmissions {
  cik: string;
  name: string;
  filings: {
    recent: {
      accessionNumber: string[];
      filingDate: string[];
      form: string[];
      primaryDocument: string[];
      primaryDocDescription: string[];
    };
  };
}

export interface FilingData {
  company: string;
  ticker: string;
  filingType: string;
  filingDate: string;
  url: string;
  content?: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchSECFilings(
  company: CompanyConfig
): Promise<FilingData[]> {
  if (!company.cik) {
    console.log(`Skipping ${company.name} - no CIK (non-US company)`);
    return [];
  }

  const cik = company.cik.replace(/^0+/, ""); // Remove leading zeros for API
  const paddedCik = company.cik; // Keep padded for URL

  try {
    // SEC requires rate limiting - be polite
    await delay(100);

    const response = await fetch(
      `${API_CONFIG.secEdgar.baseUrl}/submissions/CIK${paddedCik}.json`,
      {
        headers: {
          "User-Agent": API_CONFIG.secEdgar.userAgent,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(`SEC API error for ${company.name}: ${response.status}`);
      return [];
    }

    const data: SECSubmissions = await response.json();

    // Get recent 10-K and 10-Q filings (last 2 of each)
    const filings: FilingData[] = [];
    const recent = data.filings.recent;

    let tenKCount = 0;
    let tenQCount = 0;

    for (let i = 0; i < recent.form.length && (tenKCount < 1 || tenQCount < 2); i++) {
      const form = recent.form[i];

      if (form === "10-K" && tenKCount < 1) {
        filings.push({
          company: company.name,
          ticker: company.ticker,
          filingType: "10-K",
          filingDate: recent.filingDate[i],
          url: buildFilingUrl(paddedCik, recent.accessionNumber[i], recent.primaryDocument[i]),
        });
        tenKCount++;
      } else if (form === "10-Q" && tenQCount < 2) {
        filings.push({
          company: company.name,
          ticker: company.ticker,
          filingType: "10-Q",
          filingDate: recent.filingDate[i],
          url: buildFilingUrl(paddedCik, recent.accessionNumber[i], recent.primaryDocument[i]),
        });
        tenQCount++;
      }
    }

    console.log(`Found ${filings.length} filings for ${company.name}`);
    return filings;
  } catch (error) {
    console.error(`Error fetching SEC filings for ${company.name}:`, error);
    return [];
  }
}

function buildFilingUrl(cik: string, accessionNumber: string, primaryDocument: string): string {
  const accessionFormatted = accessionNumber.replace(/-/g, "");
  return `https://www.sec.gov/Archives/edgar/data/${cik.replace(/^0+/, "")}/${accessionFormatted}/${primaryDocument}`;
}

export async function fetchFilingContent(filing: FilingData): Promise<string | null> {
  try {
    await delay(100); // Rate limiting

    const response = await fetch(filing.url, {
      headers: {
        "User-Agent": API_CONFIG.secEdgar.userAgent,
      },
    });

    if (!response.ok) {
      console.error(`Error fetching filing content: ${response.status}`);
      return null;
    }

    const content = await response.text();

    // Extract text content (strip HTML if present)
    // For 10-K/10-Q, we want the MD&A and Risk Factors sections
    return content;
  } catch (error) {
    console.error(`Error fetching filing content:`, error);
    return null;
  }
}
