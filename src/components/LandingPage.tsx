import type { Company } from "../lib/types";
import { CompanyCard } from "./CompanyCard";

interface LandingPageProps {
  companies: Company[];
}

export function LandingPage({ companies }: LandingPageProps) {
  // Sort by score descending
  const sortedCompanies = [...companies].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold mb-2">FS Account Scorer</h1>
          <p className="text-[var(--color-muted-foreground)]">
            Scoring North American financial services companies on their
            likelihood of needing digital product and CX consulting work.
          </p>
        </div>
      </header>

      {/* Legend */}
      <div className="border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-[var(--color-muted)]">Priority:</span>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "var(--color-high)" }}
              />
              <span className="text-[var(--color-muted-foreground)]">High (75-100)</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "var(--color-medium)" }}
              />
              <span className="text-[var(--color-muted-foreground)]">Medium (50-74)</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "var(--color-lower)" }}
              />
              <span className="text-[var(--color-muted-foreground)]">Lower (0-49)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Company List */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="space-y-3">
          {sortedCompanies.map((company, index) => (
            <CompanyCard key={company.id} company={company} rank={index + 1} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-sm text-[var(--color-muted)]">
            Data sources: Earnings calls, SEC filings, press releases, app store
            reviews. Scores weighted across 5 signal categories.
          </p>
        </div>
      </footer>
    </div>
  );
}
