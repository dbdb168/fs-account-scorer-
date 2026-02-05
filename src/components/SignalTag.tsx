import type { SignalKey } from "../lib/types";
import { SIGNAL_LABELS } from "../lib/types";

interface SignalTagProps {
  signalKey: SignalKey;
  score: number;
}

export function SignalTag({ signalKey, score }: SignalTagProps) {
  const label = SIGNAL_LABELS[signalKey];

  // Shorten labels for tags
  const shortLabels: Record<SignalKey, string> = {
    aiCxInvestment: "AI/CX",
    newMarkets: "New Markets",
    newProducts: "New Products",
    leadershipChanges: "Leadership",
    cxIndicators: "CX Issues",
  };

  const getTagColor = () => {
    if (score >= 75) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (score >= 50) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getTagColor()}`}
      title={`${label}: ${score}/100`}
    >
      {shortLabels[signalKey]}
    </span>
  );
}
