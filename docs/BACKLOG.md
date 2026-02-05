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
**Priority:** Low
**Status:** Complete

All 20 App Store IDs verified and working. Fixed:
- Prudential: Changed from Hong Kong app to US app (6751651152)
- U.S. Bancorp: Changed from invalid ID to correct app (458734623)

### Canadian Company Data (SEDAR+)
**Priority:** Medium
**Status:** Not implemented

Canadian companies (RBC, TD, BMO, Manulife, Sun Life) currently only have App Store data — no SEC filings available. These 5 companies show "Insufficient data" for most signal categories.

**Recommended solution: SEDAR+ API**
- SEDAR+ is Canada's equivalent to SEC EDGAR
- URL: https://www.sedarplus.ca/
- Contains: Annual reports, MD&A, material change reports
- Would provide same signal extraction capability as US companies

**Alternative options:**
- TMX Money API (Toronto Stock Exchange data)
- Web scraping investor relations pages
- Canadian news sources (Globe and Mail, Financial Post)

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
