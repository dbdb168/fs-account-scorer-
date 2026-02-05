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

export interface Signals {
  aiCxInvestment: Signal;
  newMarkets: Signal;
  newProducts: Signal;
  leadershipChanges: Signal;
  cxIndicators: Signal;
}

export interface Executive {
  name: string;
  title: string;
  linkedIn: string;
  tenureMonths?: number;
  isNewHire?: boolean;
}

export interface Company {
  id: string;
  name: string;
  ticker: string;
  sector: "bank" | "insurance";
  country: "US" | "CA";
  score: number;
  tier: "high" | "medium" | "lower";
  signals: Signals;
  executives: Executive[];
  lastUpdated: string;
}

export type SignalKey = keyof Signals;

export const SIGNAL_LABELS: Record<SignalKey, string> = {
  aiCxInvestment: "AI & CX Investment",
  newMarkets: "New Market Entry",
  newProducts: "New Products",
  leadershipChanges: "Leadership Changes",
  cxIndicators: "CX Indicators",
};

export const SIGNAL_WEIGHTS: Record<SignalKey, string> = {
  aiCxInvestment: "30%",
  newMarkets: "20%",
  newProducts: "20%",
  leadershipChanges: "15%",
  cxIndicators: "15%",
};
