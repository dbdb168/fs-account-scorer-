import { Link } from "react-router-dom";
import type { Company, SignalKey } from "../lib/types";
import {
  getTierColor,
  getCountryFlag,
  getSectorLabel,
  getTopSignals,
} from "../lib/utils";
import { ScoreBadge } from "./ScoreBadge";
import { SignalTag } from "./SignalTag";

interface CompanyCardProps {
  company: Company;
  rank: number;
}

export function CompanyCard({ company, rank }: CompanyCardProps) {
  const isNoData = company.tier === "no-data";
  const topSignals = isNoData ? [] : getTopSignals(company.signals, 3);

  const content = (
    <div
      className={`flex items-center gap-6 p-4 rounded-lg transition-colors border-l-4 ${
        isNoData
          ? "bg-zinc-900/50 opacity-60 cursor-not-allowed"
          : "bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] group"
      }`}
      style={{ borderLeftColor: getTierColor(company.tier) }}
    >
      {/* Rank */}
      <div className="w-8 text-center text-[var(--color-muted)] font-mono text-sm">
        {isNoData ? "—" : rank}
      </div>

      {/* Score */}
      {isNoData ? (
        <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-zinc-700 text-zinc-500 text-xs font-medium">
          N/A
        </div>
      ) : (
        <ScoreBadge score={company.score} tier={company.tier} size="md" />
      )}

      {/* Company Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3 className={`text-lg font-semibold ${
            isNoData
              ? "text-[var(--color-muted)]"
              : "text-[var(--color-foreground)] group-hover:text-[var(--color-accent)]"
          } transition-colors`}>
            {company.name}
          </h3>
          <span className="text-[var(--color-muted)] font-mono text-sm">
            {company.ticker}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
          <span>{getCountryFlag(company.country)}</span>
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-xs">
            {getSectorLabel(company.sector)}
          </span>
          {isNoData && (
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 text-xs">
              No App Store Data
            </span>
          )}
        </div>
      </div>

      {/* Signal Tags or No Data message */}
      <div className="flex gap-2 flex-wrap justify-end">
        {isNoData ? (
          <span className="text-sm text-zinc-500 italic">Insufficient data</span>
        ) : (
          topSignals.map((signalKey: SignalKey) => (
            <SignalTag
              key={signalKey}
              signalKey={signalKey}
              score={company.signals[signalKey].score}
            />
          ))
        )}
      </div>

      {/* Arrow (only for companies with data) */}
      {!isNoData && (
        <div className="text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      )}
    </div>
  );

  // Don't make no-data companies clickable
  if (isNoData) {
    return <div className="block">{content}</div>;
  }

  return (
    <Link to={`/company/${company.id}`} className="block">
      {content}
    </Link>
  );
}
