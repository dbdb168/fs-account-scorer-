import type { Executive } from "../lib/types";
import { formatTenure } from "../lib/utils";

interface ExecutiveListProps {
  executives: Executive[];
}

export function ExecutiveList({ executives }: ExecutiveListProps) {
  if (executives.length === 0) {
    return null;
  }

  return (
    <div className="bg-[var(--color-card)] rounded-lg p-6">
      <h3 className="text-sm font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wide mb-5">
        Key Executives
      </h3>
      <div className="space-y-3">
        {executives.map((exec, index) => (
          <a
            key={index}
            href={exec.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors group"
          >
            <div className="flex items-start gap-4">
              {/* Avatar placeholder */}
              <div className="w-11 h-11 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-medium text-zinc-400 shrink-0">
                {exec.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              {/* Name and title */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[var(--color-foreground)] font-medium group-hover:text-[var(--color-accent)] transition-colors">
                    {exec.name}
                  </span>
                  {exec.isNewHire && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded shrink-0">
                      New
                    </span>
                  )}
                </div>
                <div className="text-sm text-[var(--color-muted)]">
                  {exec.title}
                </div>
              </div>

              {/* Tenure and LinkedIn */}
              <div className="flex items-center gap-4 shrink-0">
                {exec.tenureMonths !== undefined && (
                  <span className="text-xs text-[var(--color-muted)] whitespace-nowrap">
                    {formatTenure(exec.tenureMonths)}
                  </span>
                )}
                <svg
                  className="w-5 h-5 text-[var(--color-muted)] group-hover:text-[var(--color-accent)]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
