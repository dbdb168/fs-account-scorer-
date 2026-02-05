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
    let eightKCount = 0;

    for (let i = 0; i < recent.form.length && (tenKCount < 1 || tenQCount < 2 || eightKCount < 5); i++) {
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
      } else if (form === "8-K" && eightKCount < 5) {
        // 8-K filings announce material events: leadership changes, acquisitions, etc.
        filings.push({
          company: company.name,
          ticker: company.ticker,
          filingType: "8-K",
          filingDate: recent.filingDate[i],
          url: buildFilingUrl(paddedCik, recent.accessionNumber[i], recent.primaryDocument[i]),
        });
        eightKCount++;
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
    await delay(200); // Rate limiting - be polite to SEC

    const response = await fetch(filing.url, {
      headers: {
        "User-Agent": API_CONFIG.secEdgar.userAgent,
      },
    });

    if (!response.ok) {
      console.error(`Error fetching filing content: ${response.status}`);
      return null;
    }

    const html = await response.text();

    // Extract text and find relevant sections
    const text = stripHtmlTags(html);
    const sections = extractRelevantSections(text, filing.filingType);

    if (sections) {
      console.log(`  Extracted ${sections.length} chars from ${filing.filingType}`);
      return sections;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching filing content:`, error);
    return null;
  }
}

function stripHtmlTags(html: string): string {
  // Remove script and style tags entirely
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // Replace common HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#\d+;/g, ' ');

  // Remove all HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

function extractRelevantSections(text: string, filingType: string): string | null {
  const sections: string[] = [];

  // Common section headers in 10-K/10-Q filings
  const mdaPatterns = [
    /MANAGEMENT['']?S DISCUSSION AND ANALYSIS/i,
    /MD&A/i,
    /ITEM 7[.\s]/i,
    /ITEM 2[.\s].*MANAGEMENT/i,
  ];

  const riskPatterns = [
    /RISK FACTORS/i,
    /ITEM 1A[.\s]/i,
  ];

  const digitalPatterns = [
    /DIGITAL TRANSFORMATION/i,
    /TECHNOLOGY STRATEGY/i,
    /ARTIFICIAL INTELLIGENCE/i,
    /CUSTOMER EXPERIENCE/i,
    /MOBILE BANKING/i,
    /DIGITAL CHANNELS/i,
    /MACHINE LEARNING/i,
    /AUTOMATION/i,
  ];

  const marketExpansionPatterns = [
    /EXPANSION INTO/i,
    /ENTERED THE .{1,30} MARKET/i,
    /NEW GEOGRAPHIC/i,
    /INTERNATIONAL EXPANSION/i,
    /ACQUIRED/i,
    /ACQUISITION OF/i,
    /STRATEGIC PARTNERSHIP/i,
    /NEW CUSTOMER SEGMENT/i,
    /MARKET ENTRY/i,
  ];

  const newProductPatterns = [
    /LAUNCHED/i,
    /NEW PRODUCT/i,
    /NEW SERVICE/i,
    /INTRODUCED/i,
    /PRODUCT LAUNCH/i,
    /NEW OFFERING/i,
    /RECENTLY RELEASED/i,
    /NEW FEATURE/i,
    /ENHANCED .{1,20} PLATFORM/i,
  ];

  const leadershipPatterns = [
    /APPOINTED/i,
    /NAMED .{1,30} AS/i,
    /NEW CEO/i,
    /NEW CFO/i,
    /NEW CTO/i,
    /NEW CHIEF/i,
    /JOINED .{1,30} AS/i,
    /EXECUTIVE .{1,20} CHANGE/i,
    /LEADERSHIP TRANSITION/i,
    /BOARD OF DIRECTORS/i,
  ];

  // Extract MD&A section (usually Item 7 in 10-K, Item 2 in 10-Q)
  const mdaSection = extractSection(text, mdaPatterns, 15000);
  if (mdaSection) {
    sections.push(`[MD&A SECTION]\n${mdaSection}`);
  }

  // Extract Risk Factors (Item 1A)
  const riskSection = extractSection(text, riskPatterns, 10000);
  if (riskSection) {
    sections.push(`[RISK FACTORS]\n${riskSection}`);
  }

  // Extract digital/technology mentions
  const digitalMentions = extractDigitalMentions(text, digitalPatterns, 5000);
  if (digitalMentions) {
    sections.push(`[DIGITAL/TECHNOLOGY MENTIONS]\n${digitalMentions}`);
  }

  // Extract market expansion mentions
  const marketMentions = extractDigitalMentions(text, marketExpansionPatterns, 4000);
  if (marketMentions) {
    sections.push(`[MARKET EXPANSION MENTIONS]\n${marketMentions}`);
  }

  // Extract new product mentions
  const productMentions = extractDigitalMentions(text, newProductPatterns, 4000);
  if (productMentions) {
    sections.push(`[NEW PRODUCT MENTIONS]\n${productMentions}`);
  }

  // Extract leadership change mentions
  const leadershipMentions = extractDigitalMentions(text, leadershipPatterns, 4000);
  if (leadershipMentions) {
    sections.push(`[LEADERSHIP MENTIONS]\n${leadershipMentions}`);
  }

  if (sections.length === 0) {
    // Fallback: just get first 10000 chars as sample
    return text.slice(0, 10000);
  }

  return sections.join('\n\n---\n\n');
}

function extractSection(text: string, patterns: RegExp[], maxLength: number): string | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match.index !== undefined) {
      // Get text starting from this section
      const start = match.index;
      const sectionText = text.slice(start, start + maxLength);

      // Try to find a natural end point (next major section)
      const endPatterns = [/ITEM \d/i, /PART [IV]+/i, /SIGNATURES/i];
      let endIndex = sectionText.length;

      for (const endPattern of endPatterns) {
        const endMatch = sectionText.slice(500).match(endPattern); // Skip first 500 chars
        if (endMatch && endMatch.index !== undefined) {
          endIndex = Math.min(endIndex, 500 + endMatch.index);
        }
      }

      return sectionText.slice(0, endIndex).trim();
    }
  }
  return null;
}

function extractDigitalMentions(text: string, patterns: RegExp[], maxLength: number): string | null {
  const mentions: string[] = [];
  let totalLength = 0;

  for (const pattern of patterns) {
    const regex = new RegExp(pattern.source, 'gi');
    let match;

    while ((match = regex.exec(text)) !== null && totalLength < maxLength) {
      // Get surrounding context (200 chars before and after)
      const start = Math.max(0, match.index - 200);
      const end = Math.min(text.length, match.index + match[0].length + 300);
      const context = text.slice(start, end).trim();

      if (!mentions.some(m => m.includes(context.slice(50, 150)))) {
        mentions.push(`...${context}...`);
        totalLength += context.length;
      }
    }
  }

  return mentions.length > 0 ? mentions.join('\n\n') : null;
}
