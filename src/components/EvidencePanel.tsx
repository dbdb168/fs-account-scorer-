import { useState } from "react";
import type { Signals, SignalKey } from "../lib/types";
import { SIGNAL_LABELS } from "../lib/types";
import { formatDate } from "../lib/utils";

interface EvidencePanelProps {
  signals: Signals;
}

function isFilingOld(dateString: string): boolean {
  const filingDate = new Date(dateString);
  const now = new Date();
  const monthsDiff = (now.getFullYear() - filingDate.getFullYear()) * 12
    + (now.getMonth() - filingDate.getMonth());
  return monthsDiff >= 10;
}

function isSECFiling(source: string): boolean {
  const lower = source.toLowerCase();
  return lower.includes("10-k") || lower.includes("10-q") || lower.includes("sec");
}

export function EvidencePanel({ signals }: EvidencePanelProps) {
  const [expandedSection, setExpandedSection] = useState<SignalKey | null>(
    "aiCxInvestment"
  );

  const signalKeys: SignalKey[] = [
    "aiCxInvestment",
    "newMarkets",
    "newProducts",
    "leadershipChanges",
    "cxIndicators",
  ];

  const toggleSection = (key: SignalKey) => {
    setExpandedSection(expandedSection === key ? null : key);
  };

  return (
    <div className="bg-[var(--color-card)] rounded-lg overflow-hidden">
      <h3 className="text-sm font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wide p-6 pb-0">
        Evidence
      </h3>
      <div className="divide-y divide-[var(--color-border)]">
        {signalKeys.map((key) => {
          const signal = signals[key];
          const isExpanded = expandedSection === key;

          return (
            <div key={key}>
              <button
                onClick={() => toggleSection(key)}
                className="w-full flex items-center justify-between p-4 hover:bg-[var(--color-card-hover)] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[var(--color-foreground)]">
                    {SIGNAL_LABELS[key]}
                  </span>
                  <span className="text-xs text-[var(--color-muted)] bg-zinc-800 px-2 py-0.5 rounded">
                    {signal.evidence.length} source
                    {signal.evidence.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-[var(--color-muted)] transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  {signal.evidence.map((item, index) => (
                    <div
                      key={index}
                      className="pl-4 border-l-2 border-[var(--color-border)]"
                    >
                      <p className="text-sm text-[var(--color-foreground)] mb-2">
                        "{item.text}"
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[var(--color-accent)] transition-colors"
                        >
                          {item.source}
                        </a>
                        <span>•</span>
                        <span>{formatDate(item.date)}</span>
                        {isSECFiling(item.source) && isFilingOld(item.date) && (
                          <>
                            <span>•</span>
                            <span className="text-amber-500">
                              New 10-K expected late Feb/Mar 2026
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
