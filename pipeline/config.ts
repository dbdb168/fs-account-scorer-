// Target companies from the PRD
export interface CompanyConfig {
  id: string;
  name: string;
  ticker: string;
  sector: "bank" | "insurance";
  country: "US" | "CA";
  cik?: string; // SEC CIK number (US companies only)
  appStoreId?: string; // iOS App Store ID
  domain: string; // For Apollo.io executive search
}

export const COMPANIES: CompanyConfig[] = [
  // Banks (12)
  {
    id: "jpmorgan",
    name: "JPMorgan Chase",
    ticker: "JPM",
    sector: "bank",
    country: "US",
    cik: "0000019617",
    appStoreId: "298867247", // Chase Mobile
    domain: "jpmorganchase.com",
  },
  {
    id: "bofa",
    name: "Bank of America",
    ticker: "BAC",
    sector: "bank",
    country: "US",
    cik: "0000070858",
    appStoreId: "284847138", // Bank of America Mobile
    domain: "bankofamerica.com",
  },
  {
    id: "wellsfargo",
    name: "Wells Fargo",
    ticker: "WFC",
    sector: "bank",
    country: "US",
    cik: "0000072971",
    appStoreId: "311548709", // Wells Fargo Mobile
    domain: "wellsfargo.com",
  },
  {
    id: "citi",
    name: "Citigroup",
    ticker: "C",
    sector: "bank",
    country: "US",
    cik: "0000831001",
    appStoreId: "301724680", // Citi Mobile
    domain: "citi.com",
  },
  {
    id: "goldmansachs",
    name: "Goldman Sachs",
    ticker: "GS",
    sector: "bank",
    country: "US",
    cik: "0000886982",
    appStoreId: "1489511701", // Marcus by Goldman Sachs
    domain: "goldmansachs.com",
  },
  {
    id: "rbc",
    name: "Royal Bank of Canada",
    ticker: "RY",
    sector: "bank",
    country: "CA",
    appStoreId: "407597290", // RBC Mobile
    domain: "rbc.com",
  },
  {
    id: "td",
    name: "Toronto-Dominion Bank",
    ticker: "TD",
    sector: "bank",
    country: "CA",
    appStoreId: "382107453", // TD Bank (US) - more reviews available
    domain: "td.com",
  },
  {
    id: "bmo",
    name: "Bank of Montreal",
    ticker: "BMO",
    sector: "bank",
    country: "CA",
    appStoreId: "429080319", // BMO Mobile Banking
    domain: "bmo.com",
  },
  {
    id: "usbank",
    name: "U.S. Bancorp",
    ticker: "USB",
    sector: "bank",
    country: "US",
    cik: "0000036104",
    appStoreId: "458734623", // U.S. Bank Mobile Banking
    domain: "usbank.com",
  },
  {
    id: "pnc",
    name: "PNC Financial Services",
    ticker: "PNC",
    sector: "bank",
    country: "US",
    cik: "0000713676",
    appStoreId: "303113127", // PNC Mobile
    domain: "pnc.com",
  },
  {
    id: "truist",
    name: "Truist Financial",
    ticker: "TFC",
    sector: "bank",
    country: "US",
    cik: "0000092230",
    appStoreId: "1555389200", // Truist Mobile
    domain: "truist.com",
  },
  {
    id: "capitalone",
    name: "Capital One",
    ticker: "COF",
    sector: "bank",
    country: "US",
    cik: "0000927628",
    appStoreId: "407558537", // Capital One Mobile
    domain: "capitalone.com",
  },

  // Insurance (8)
  {
    id: "unitedhealth",
    name: "UnitedHealth Group",
    ticker: "UNH",
    sector: "insurance",
    country: "US",
    cik: "0000731766",
    appStoreId: "1348316600", // UnitedHealthcare
    domain: "unitedhealthgroup.com",
  },
  {
    id: "elevance",
    name: "Elevance Health",
    ticker: "ELV",
    sector: "insurance",
    country: "US",
    cik: "0001156039",
    appStoreId: "1463423283", // Sydney Health
    domain: "elevancehealth.com",
  },
  {
    id: "cigna",
    name: "Cigna",
    ticker: "CI",
    sector: "insurance",
    country: "US",
    cik: "0001739940",
    appStoreId: "569266174", // myCigna
    domain: "cigna.com",
  },
  {
    id: "humana",
    name: "Humana",
    ticker: "HUM",
    sector: "insurance",
    country: "US",
    cik: "0000049071",
    appStoreId: "779622024", // MyHumana
    domain: "humana.com",
  },
  {
    id: "manulife",
    name: "Manulife Financial",
    ticker: "MFC",
    sector: "insurance",
    country: "CA",
    appStoreId: "1214009312", // Manulife Mobile (Canada)
    domain: "manulife.com",
  },
  {
    id: "sunlife",
    name: "Sun Life Financial",
    ticker: "SLF",
    sector: "insurance",
    country: "CA",
    appStoreId: "453274313", // my Sun Life (Canada)
    domain: "sunlife.com",
  },
  {
    id: "metlife",
    name: "MetLife",
    ticker: "MET",
    sector: "insurance",
    country: "US",
    cik: "0001099219",
    appStoreId: "570085487", // MetLife US App
    domain: "metlife.com",
  },
  {
    id: "prudential",
    name: "Prudential Financial",
    ticker: "PRU",
    sector: "insurance",
    country: "US",
    cik: "0001137774",
    appStoreId: "6751651152", // Prudential - MyBenefits (US)
    domain: "prudential.com",
  },
];

// API Configuration
export const API_CONFIG = {
  financialModelingPrep: {
    baseUrl: "https://financialmodelingprep.com/api/v3",
    // Free tier: 250 calls/day
  },
  secEdgar: {
    baseUrl: "https://data.sec.gov",
    userAgent: "FSAccountScorer david@thisisluminary.co", // SEC requires valid contact
  },
  apollo: {
    baseUrl: "https://api.apollo.io/v1",
    // Free tier: people search doesn't consume credits
  },
};

// Scoring weights from PRD
export const SIGNAL_WEIGHTS = {
  aiCxInvestment: 0.3,
  newMarkets: 0.2,
  newProducts: 0.2,
  leadershipChanges: 0.15,
  cxIndicators: 0.15,
};
