import { Link, useParams } from "react-router-dom";
import type { Company } from "../lib/types";
import {
  getTierColor,
  getTierLabel,
  getCountryFlag,
  getSectorLabel,
  formatDate,
} from "../lib/utils";
import { ScoreBadge } from "./ScoreBadge";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { EvidencePanel } from "./EvidencePanel";
import { ExecutiveList } from "./ExecutiveList";

interface CompanyDetailProps {
  companies: Company[];
}

export function CompanyDetail({ companies }: CompanyDetailProps) {
  const { id } = useParams<{ id: string }>();
  const company = companies.find((c) => c.id === id);

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Company not found</h1>
          <Link
            to="/"
            className="text-[var(--color-accent)] hover:underline"
          >
            Back to list
          </Link>
        </div>
      </div>
    );
  }

  const showExecutives = company.tier === "high" || company.tier === "medium";

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors mb-8"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to list
        </Link>

        {/* Header */}
        <header className="flex items-start gap-6 mb-8">
          <ScoreBadge score={company.score} tier={company.tier} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{company.name}</h1>
              <span className="text-[var(--color-muted)] font-mono">
                {company.ticker}
              </span>
            </div>
            <div className="flex items-center gap-4 text-[var(--color-muted-foreground)]">
              <span className="text-lg">{getCountryFlag(company.country)}</span>
              <span className="px-2 py-1 rounded bg-zinc-800 text-sm">
                {getSectorLabel(company.sector)}
              </span>
              <span
                className="px-2 py-1 rounded text-sm font-medium"
                style={{
                  backgroundColor: `color-mix(in srgb, ${getTierColor(company.tier)} 15%, transparent)`,
                  color: getTierColor(company.tier),
                }}
              >
                {getTierLabel(company.tier)}
              </span>
            </div>
          </div>
        </header>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column - Score breakdown & Executives */}
          <div className="lg:col-span-2 space-y-6">
            <ScoreBreakdown signals={company.signals} />
            {showExecutives && <ExecutiveList executives={company.executives} />}
          </div>

          {/* Right column - Evidence */}
          <div className="lg:col-span-3">
            <EvidencePanel signals={company.signals} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-[var(--color-border)] text-sm text-[var(--color-muted)]">
          Last updated: {formatDate(company.lastUpdated)}
        </footer>
      </div>
    </div>
  );
}
