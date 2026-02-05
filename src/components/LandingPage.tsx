import type { Company } from "../lib/types";
import { CompanyCard } from "./CompanyCard";

interface LandingPageProps {
  companies: Company[];
}

export function LandingPage({ companies }: LandingPageProps) {
  // Separate companies with data from those without
  const companiesWithData = companies
    .filter((c) => c.tier !== "no-data")
    .sort((a, b) => b.score - a.score);

  const companiesNoData = companies.filter((c) => c.tier === "no-data");

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
          <div className="flex items-center gap-6 text-sm flex-wrap">
            <span className="text-[var(--color-muted)]">CX Opportunity:</span>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "var(--color-high)" }}
              />
              <span className="text-[var(--color-muted-foreground)]">High (65+) — Poor app ratings</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "var(--color-medium)" }}
              />
              <span className="text-[var(--color-muted-foreground)]">Medium (40-64)</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "var(--color-lower)" }}
              />
              <span className="text-[var(--color-muted-foreground)]">Lower (&lt;40) — Good app ratings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Company List */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="space-y-3">
          {companiesWithData.map((company, index) => (
            <CompanyCard key={company.id} company={company} rank={index + 1} />
          ))}
        </div>

        {/* No Data Section */}
        {companiesNoData.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-medium text-[var(--color-muted)] uppercase tracking-wide mb-4">
              Insufficient Data ({companiesNoData.length})
            </h2>
            <div className="space-y-3">
              {companiesNoData.map((company) => (
                <CompanyCard key={company.id} company={company} rank={0} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-sm text-[var(--color-muted)]">
            Scores based on App Store ratings. Higher score = more CX pain = greater consulting opportunity.
            Data from SEC EDGAR and Apple App Store.
          </p>
        </div>
      </footer>
    </div>
  );
}
