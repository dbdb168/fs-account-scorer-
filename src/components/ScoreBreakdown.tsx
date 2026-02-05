import type { Signals, SignalKey } from "../lib/types";
import { SIGNAL_LABELS, SIGNAL_WEIGHTS } from "../lib/types";

interface ScoreBreakdownProps {
  signals: Signals;
}

export function ScoreBreakdown({ signals }: ScoreBreakdownProps) {
  const signalKeys: SignalKey[] = [
    "aiCxInvestment",
    "newMarkets",
    "newProducts",
    "leadershipChanges",
    "cxIndicators",
  ];

  const getBarColor = (score: number) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-zinc-500";
  };

  return (
    <div className="bg-[var(--color-card)] rounded-lg p-6">
      <h3 className="text-sm font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wide mb-4">
        Score Breakdown
      </h3>
      <div className="space-y-4">
        {signalKeys.map((key) => {
          const signal = signals[key];
          return (
            <div key={key}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-[var(--color-foreground)]">
                  {SIGNAL_LABELS[key]}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--color-muted)]">
                    {SIGNAL_WEIGHTS[key]}
                  </span>
                  <span className="font-mono text-sm font-semibold w-8 text-right">
                    {signal.score}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getBarColor(signal.score)} transition-all duration-500`}
                  style={{ width: `${signal.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
