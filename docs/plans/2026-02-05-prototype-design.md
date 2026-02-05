# FS Account Scorer — Prototype Design

**Date:** 2026-02-05
**Status:** Approved for implementation

## Scope

Build a working prototype with:
- 3 companies (JPMorgan Chase, Manulife, RBC) with static mock data
- Landing page: scored list view
- Company detail view: score breakdown, evidence, executives
- Dark mode, professional aesthetic

## Technical Decisions

| Decision | Choice |
|----------|--------|
| Framework | Vite + React + TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Typography | Geist (Sans + Mono) |
| Theme | Dark mode default |
| Routing | React Router |
| Data | Static JSON |

## Project Structure

```
fs-account-scorer/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui primitives
│   │   ├── CompanyCard.tsx
│   │   ├── CompanyDetail.tsx
│   │   ├── ScoreBreakdown.tsx
│   │   ├── EvidencePanel.tsx
│   │   └── ExecutiveList.tsx
│   ├── lib/
│   │   ├── scoring.ts
│   │   └── utils.ts
│   ├── data/
│   │   └── companies.json
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

## Data Schema

```typescript
interface Company {
  id: string;
  name: string;
  ticker: string;
  sector: "bank" | "insurance";
  country: "US" | "CA";
  score: number;
  tier: "high" | "medium" | "lower";
  signals: {
    aiCxInvestment: Signal;
    newMarkets: Signal;
    newProducts: Signal;
    leadershipChanges: Signal;
    cxIndicators: Signal;
  };
  executives: Executive[];
  lastUpdated: string;
}

interface Signal {
  score: number;
  weight: number;
  evidence: Evidence[];
}

interface Evidence {
  text: string;
  source: string;
  sourceUrl: string;
  date: string;
}

interface Executive {
  name: string;
  title: string;
  linkedIn: string;
  tenureMonths?: number;
  isNewHire?: boolean;
}
```

## Mock Data Tiers

| Company | Sector | Country | Score | Tier |
|---------|--------|---------|-------|------|
| JPMorgan Chase | Bank | US | 82 | High |
| Manulife | Insurance | CA | 61 | Medium |
| Royal Bank of Canada | Bank | CA | 45 | Lower |

## UI Views

### Landing Page
- Dark background, full viewport
- Header: "FS Account Scorer" + tagline
- Ranked list/table with: name, sector badge, country flag, score, signal tags
- Clickable rows → detail view
- Tier indicated by left border color

### Company Detail View
- Back link
- Company header with overall score
- Score breakdown (5 categories with bars)
- Evidence panel (accordion sections)
- Executive panel (C-suite only, medium/high tier)
- Last updated timestamp

## Out of Scope (Prototype)

- Methodology page
- About page
- Light mode toggle
- VP+ level contacts
- Real data pipeline
