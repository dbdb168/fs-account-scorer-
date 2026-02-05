# FS Account Scorer — Backlog

## Data Pipeline Enhancements

### Earnings Transcripts & Press Releases
**Priority:** High
**Status:** Blocked (requires paid API)

Current FMP free tier no longer includes earnings transcripts or press releases. Options:

| Option | Cost | Coverage |
|--------|------|----------|
| **Financial Modeling Prep (paid)** | ~$19/month | Transcripts, press releases, 8000+ companies |
| **Alpha Vantage** | Free tier limited | News sentiment, some company data |
| **Finnhub** | Free tier available | Earnings, news, some transcripts |
| **SEC EDGAR full text parsing** | Free | Parse MD&A sections from 10-K/10-Q (complex) |
| **Google News RSS** | Free | News articles (requires NLP parsing) |

### Executive Data (Apollo.io)
**Priority:** Medium
**Status:** Not implemented

- Apollo.io free tier: people search doesn't consume credits
- Endpoint: `/api/v1/mixed_people/search`
- Filter by: company domain + titles (CEO, CTO, CDO, CXO)
- Would populate the empty `executives` array in company data

### App Store ID Fixes
**Priority:** Medium
**Status:** Partial

Some companies returned no reviews — need to verify/update App Store IDs:
- Goldman Sachs (Marcus app ID may be wrong)
- Toronto-Dominion Bank (TD app)
- Truist Financial
- Elevance Health (Sydney Health app)
- Humana (MyHumana)
- Manulife
- Sun Life
- MetLife
- Prudential

### Canadian Company Data
**Priority:** Low
**Status:** Limited

Canadian companies (RBC, TD, BMO, Manulife, Sun Life) have no SEC filings. Options:
- SEDAR+ API (Canadian regulatory filings)
- Web scraping investor relations pages
- Rely on press releases + app reviews only

---

## UI/UX Enhancements

### Methodology Page
**Priority:** Medium
Per PRD: transparent explanation of scoring model, data sources, limitations.

### About Page
**Priority:** Low
Per PRD: context about the tool, link to LinkedIn, link to GitHub.

### Light Mode Toggle
**Priority:** Low
Currently dark mode only.

### Mobile Optimization
**Priority:** Low
Works on mobile but optimized for desktop per PRD.

---

## Future Features (from PRD)

- Competitor intelligence (Accenture/Publicis Sapient activity)
- CFPB complaint data integration
- Trigger alerts for score changes
- Simple CRM layer for tracking outreach
- Expand beyond 20 companies
- "Why TELUS Digital" positioning notes per company
