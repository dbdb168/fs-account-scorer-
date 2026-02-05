/**
 * Financial Modeling Prep API
 * Free tier: 250 calls/day
 * - Earnings call transcripts
 * - Press releases
 */

import { CompanyConfig, API_CONFIG } from "../config.js";

export interface EarningsTranscript {
  symbol: string;
  quarter: number;
  year: number;
  date: string;
  content: string;
}

export interface PressRelease {
  symbol: string;
  date: string;
  title: string;
  text: string;
  url?: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchEarningsTranscripts(
  company: CompanyConfig,
  apiKey: string,
  quarters: number = 2
): Promise<EarningsTranscript[]> {
  const transcripts: EarningsTranscript[] = [];

  try {
    // Get the last N quarters
    const currentYear = new Date().getFullYear();
    const currentQuarter = Math.ceil((new Date().getMonth() + 1) / 3);

    for (let i = 0; i < quarters; i++) {
      let quarter = currentQuarter - i;
      let year = currentYear;

      if (quarter <= 0) {
        quarter += 4;
        year -= 1;
      }

      await delay(200); // Rate limiting

      const url = `${API_CONFIG.financialModelingPrep.baseUrl}/earning_call_transcript/${company.ticker}?quarter=${quarter}&year=${year}&apikey=${apiKey}`;

      const response = await fetch(url);

      if (!response.ok) {
        console.log(`No transcript for ${company.ticker} Q${quarter} ${year}`);
        continue;
      }

      const data = await response.json();

      if (data && data.length > 0) {
        transcripts.push({
          symbol: company.ticker,
          quarter,
          year,
          date: data[0].date || `${year}-Q${quarter}`,
          content: data[0].content || "",
        });
        console.log(`Found transcript for ${company.ticker} Q${quarter} ${year}`);
      }
    }

    return transcripts;
  } catch (error) {
    console.error(`Error fetching transcripts for ${company.name}:`, error);
    return transcripts;
  }
}

export async function fetchPressReleases(
  company: CompanyConfig,
  apiKey: string,
  limit: number = 50
): Promise<PressRelease[]> {
  try {
    await delay(200); // Rate limiting

    const url = `${API_CONFIG.financialModelingPrep.baseUrl}/press-releases/${company.ticker}?limit=${limit}&apikey=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`FMP API error for ${company.name}: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      console.log(`No press releases found for ${company.ticker}`);
      return [];
    }

    // Filter to last 12 months
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const releases: PressRelease[] = data
      .filter((item: any) => new Date(item.date) >= oneYearAgo)
      .map((item: any) => ({
        symbol: company.ticker,
        date: item.date,
        title: item.title,
        text: item.text,
        url: item.url,
      }));

    console.log(`Found ${releases.length} press releases for ${company.ticker} (last 12 months)`);
    return releases;
  } catch (error) {
    console.error(`Error fetching press releases for ${company.name}:`, error);
    return [];
  }
}
