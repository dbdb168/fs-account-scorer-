import type { Company } from "../lib/types";
import { getTierColor } from "../lib/utils";

interface ScoreBadgeProps {
  score: number;
  tier: Company["tier"];
  size?: "sm" | "md" | "lg";
}

export function ScoreBadge({ score, tier, size = "md" }: ScoreBadgeProps) {
  const sizeClasses = {
    sm: "text-sm w-10 h-10",
    md: "text-xl w-14 h-14",
    lg: "text-3xl w-20 h-20",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-mono font-semibold`}
      style={{
        backgroundColor: `color-mix(in srgb, ${getTierColor(tier)} 15%, transparent)`,
        color: getTierColor(tier),
        border: `2px solid ${getTierColor(tier)}`,
      }}
    >
      {score}
    </div>
  );
}
