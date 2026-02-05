import type { Company, SignalKey, Signals } from "./types";

export function getTierColor(tier: Company["tier"]): string {
  switch (tier) {
    case "high":
      return "var(--color-high)";
    case "medium":
      return "var(--color-medium)";
    case "lower":
      return "var(--color-lower)";
    case "no-data":
      return "var(--color-muted)";
  }
}

export function getTierLabel(tier: Company["tier"]): string {
  switch (tier) {
    case "high":
      return "High Priority";
    case "medium":
      return "Medium Priority";
    case "lower":
      return "Lower Priority";
    case "no-data":
      return "Insufficient Data";
  }
}

export function getCountryFlag(country: Company["country"]): string {
  return country === "US" ? "🇺🇸" : "🇨🇦";
}

export function getSectorLabel(sector: Company["sector"]): string {
  return sector === "bank" ? "Bank" : "Insurance";
}

export function getTopSignals(signals: Signals, count: number = 2): SignalKey[] {
  const entries = Object.entries(signals) as [SignalKey, { score: number }][];
  return entries
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, count)
    .map(([key]) => key);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTenure(months: number): string {
  if (months < 12) {
    return `${months} month${months === 1 ? "" : "s"}`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) {
    return `${years} year${years === 1 ? "" : "s"}`;
  }
  return `${years}y ${remainingMonths}m`;
}

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
