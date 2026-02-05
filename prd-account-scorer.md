# Product Requirements Document
## FS Account Scorer (working title)

**Version:** 1.1  
**Author:** David Beath  
**Date:** February 2026  
**Status:** Draft for Review

---

### 1. Overview

**What it is:** A web-based intelligence tool that scores 20 North American financial services companies (banks and large insurers from the F2000) on their likelihood of needing digital product and customer experience consulting work.

**Why it exists:** To demonstrate David's ability to build useful BD tools with AI, and to provide a tangible artifact that shows TELUS Digital how he thinks about account targeting and qualification.

**Who it's for:** 
- Primary: TELUS Digital interviewers and hiring managers (to evaluate David's approach)
- Secondary: David himself, as a working tool for prioritizing outreach

**Where it lives:** `xxxxx.thisisluminary.co` (publicly accessible, reasonably polished)

---

### 2. User Stories

**As a viewer (interviewer/hiring manager), I want to:**
- See a scored list of 20 financial services target accounts at a glance
- Understand why each company scored the way it did (transparent methodology)
- Click into any company and see the underlying evidence
- For medium-to-high priority accounts, see key executives with CX buying power (CEO, CTO, CDO, CXO)
- Trust that the data is recent and from credible sources
- Be impressed that David built this without being asked to

**As David, I want to:**
- Have a working prototype I can share via link without walking someone through it
- Use this as an actual tool for prioritizing my own BD conversations
- See who the decision-makers are at priority accounts
- Update the target list or scoring criteria without rebuilding everything

---

### 3. Target Companies (Initial 20)

**Scope:** North American F2000 financial services — mix of mega-banks, large regional banks, and major insurers (US and Canada).

**Banks (12)**
1. JPMorgan Chase
2. Bank of America
3. Wells Fargo
4. Citigroup
5. Goldman Sachs
6. Royal Bank of Canada (RBC)
7. Toronto-Dominion Bank (TD)
8. Bank of Montreal (BMO)
9. U.S. Bancorp
10. PNC Financial Services
11. Truist Financial
12. Capital One

**Insurance (8)**
1. UnitedHealth Group
2. Elevance Health (Anthem)
3. Cigna
4. Humana
5. Manulife
6. Sun Life Financial
7. MetLife
8. Prudential Financial

*Note: List balances US and Canadian institutions. Can be adjusted based on TELUS Digital's actual target list if known.*

---

### 4. Scoring Model

**Buy Signal Categories (weighted)**

| Signal | Weight | Rationale |
|--------|--------|-----------|
| AI/CX Investment Signals | 30% | Direct indicator of budget and intent for digital experience work |
| New Market Entry | 20% | Expansion creates greenfield CX needs |
| New Product Development | 20% | New products require new digital experiences |
| Leadership Changes (CDO, CTO, CXO) | 15% | New leaders often bring new vendors |
| Negative CX Indicators | 15% | Poor app reviews, CFPB complaints = pain they need to solve |

**Data Sources & Recency Requirements**

| Source | Recency | What We Extract | API Option |
|--------|---------|-----------------|------------|
| Earnings call transcripts | Last 2 quarters | AI mentions, digital transformation language, CX investment signals | **Financial Modeling Prep** (free tier: 250 calls/day) or **Finnhub** (free tier available) |
| SEC filings (10-K, 10-Q) | Last 2 filings | Technology spend, digital strategy language, risk factors | **SEC EDGAR API** (free, no key required) |
| Press releases | Last 12 months | New product launches, market expansion, leadership changes | **Financial Modeling Prep** Press Releases API or web search |
| News (reliable sources) | Last 6 months | Strategic moves, partnerships, regulatory issues | Web search (WSJ, Reuters, Bloomberg, American Banker) |
| App store reviews | Last 6 months | Customer sentiment on digital products | **Apple RSS feed** (free, no auth) + **Google Play** (requires auth for owned apps only — may skip or use web scraping) |
| Leadership/Executive data | Current | CEO, CTO, CDO, CXO names and LinkedIn profiles | **Apollo.io** (free tier: 1200 credits/year, people search doesn't consume credits) |

**API Cost Estimate (Monthly)**
- Financial Modeling Prep: Free tier likely sufficient for 20 companies
- SEC EDGAR: Free
- Apollo.io: Free tier (1200 email credits/year; people search is free)
- App store: Free (Apple RSS)
- Claude API for processing: ~$5-15/month depending on refresh frequency

**Canadian Companies Note:** Canadian banks (RBC, TD, BMO) file with SEDAR+ not SEC. May need to supplement with press releases and earnings transcripts only, or use web search for regulatory filings.

**Scoring Scale**
- Each signal category scored 0-100
- Weighted composite produces overall "Readiness Score" (0-100)
- Companies ranked and categorized:
  - **High Priority (75-100):** Multiple strong buy signals, active investment
  - **Medium Priority (50-74):** Some signals present, worth monitoring
  - **Lower Priority (0-49):** Limited current signals, longer-term targets

---

### 5. Information Architecture

**Landing View: Scored List**
- All 20 companies in ranked order
- Each row shows: Company name, sector (bank/insurance), country flag (US/CA), Readiness Score, 2-3 key signals as tags
- Visual indicator of score tier (High/Medium/Lower)
- Click any row to expand to Company Detail

**Company Detail View**
- Company overview (basic firmographics)
- Overall Readiness Score with breakdown by category
- **Key Executives panel** (for Medium and High priority accounts only):
  - CEO, CTO, CDO, CXO, or equivalent CX-buying roles
  - Name, title, LinkedIn profile link
  - Tenure in role if available
- Evidence panel for each scoring category:
  - AI/CX Investment: Relevant quotes from earnings calls, press releases
  - New Markets: Expansion announcements with dates
  - New Products: Product launch news with dates
  - Leadership: Recent C-suite changes with dates
  - CX Indicators: App store rating trend, notable complaints
- Source links for all evidence (user can verify)
- "Last Updated" timestamp

**Methodology Page**
- Transparent explanation of scoring model
- Data sources listed with recency rules
- Acknowledgment of limitations

**About Page**
- Brief context: "I built this to prepare for conversations about financial services business development"
- Link to David's LinkedIn
- Link to GitHub repo with backlog of related tool ideas

---

### 6. Technical Approach

**Frontend**
- React single-page application
- Tailwind CSS for styling (following frontend-design skill guidelines)
- Hosted at `xxxxx.thisisluminary.co`
- Responsive but optimized for desktop (primary viewing context)
- No authentication required

**Data Layer**
- Pre-processed data stored as JSON (not live API calls on every page load)
- Data refresh process run manually or on schedule (weekly)
- Claude API for processing earnings transcripts, press releases, news into structured signals

**Data Collection Pipeline (background process)**

1. **Earnings Transcripts**
   - API: Financial Modeling Prep (`/v3/earning_call_transcript/{ticker}?quarter=X&year=Y`)
   - Pull last 2 quarters for each company
   - Free tier: 250 calls/day (sufficient for 20 companies × 2 quarters = 40 calls)

2. **SEC Filings** (US companies only)
   - API: SEC EDGAR (`data.sec.gov/submissions/CIK{cik}.json`)
   - No auth required
   - Pull 10-K and 10-Q filings
   
3. **Press Releases**
   - API: Financial Modeling Prep (`/v3/press-releases/{ticker}`)
   - Filter to last 12 months

4. **News**
   - Use web search via Claude's tools
   - Target reliable sources: WSJ, Reuters, Bloomberg, American Banker, Insurance Journal
   
5. **App Store Data**
   - Apple: RSS feed (`https://itunes.apple.com/{country}/rss/customerreviews/id={app_id}/json`)
   - Google Play: Consider skipping or basic web scrape (auth complexity)

6. **Executive Data** (for Medium/High priority accounts)
   - API: Apollo.io People Search (`/api/v1/mixed_people/api_search`)
   - Filter: company domain + titles (CEO, CTO, CDO, CXO, Chief Digital Officer, Chief Experience Officer)
   - Free tier: People search doesn't consume credits; enrichment uses 1 credit/person (1200/year)

7. **Process & Score**
   - Send collected data through Claude API to extract structured signals
   - Apply scoring model
   - Output as JSON for frontend consumption

**Hardening Requirements**
- Graceful handling if any data source is missing for a company
- Clear "data unavailable" states rather than errors
- All external links open in new tabs
- Works in Chrome, Safari, Firefox (modern versions)
- Loading states for any async operations
- No console errors in production

---

### 7. Design Direction

**Aesthetic:** Professional, editorial, confident. Not flashy. Should feel like a Bloomberg terminal meets a well-designed research report.

**Tone:** "This is a serious tool built by someone who understands the work."

**Key Principles:**
- Data density done well (lots of information, but scannable)
- Typography-forward (clear hierarchy, readable at scale)
- Minimal chrome (let the content breathe)
- Dark mode default (professional, distinctive)
- Subtle motion (page transitions, hover states) but nothing distracting

**Technical:**
- Tailwind CSS
- Follow frontend-design skill guidelines (distinctive fonts, bold aesthetic direction, avoid generic AI aesthetics)
- Neutral branding (no Luminary logo — this stands alone)

**Reference Points:**
- Bloomberg Terminal (information density)
- The Economist (editorial confidence)
- Linear.app (modern SaaS polish)

---

### 8. Out of Scope (v1)

- User accounts or saved preferences
- Real-time data updates (manual/scheduled refresh is fine)
- Comparison views (side-by-side companies)
- Export functionality (PDF, CSV)
- Historical scoring trends over time
- Integration with CRM systems
- Mobile-optimized experience (functional on mobile, optimized for desktop)
- Executive contact info beyond name/title/LinkedIn (no email, no phone)

---

### 9. Success Criteria

**For the Interview Context:**
- Viewer understands the tool's purpose within 10 seconds of landing
- Viewer can explore 2-3 companies in under 2 minutes
- Viewer leaves thinking "this person already does this work"
- No bugs or broken states encountered during typical exploration

**For David's Ongoing Use:**
- Actually useful for prioritizing outreach
- Executive contacts help identify who to target
- Easy to update target list or add new companies
- Maintainable codebase for future enhancements

---

### 10. Open Questions (Resolved)

| Question | Resolution |
|----------|------------|
| Data access for earnings transcripts | Use Financial Modeling Prep free tier (250 calls/day) |
| Update frequency | Weekly refresh |
| Branding | Neutral (give it a working name like "FS Account Scorer") |
| GitHub visibility | Public repo, shows the code |
| Style guide | Use Tailwind + frontend-design skill guidelines; David may provide example later |
| Canadian regulatory filings | Supplement with earnings transcripts and press releases; skip SEDAR+ for v1 |

---

### 11. Backlog Ideas (Future Versions)

- Add competitor intelligence (what are Accenture/Publicis Sapient doing with these accounts?)
- Integrate CFPB complaint data for deeper CX signal
- Add "trigger alerts" when a company's score changes significantly
- Build a simple CRM layer to track David's outreach to each account
- Expand beyond 20 companies to full F500 financial services
- Add "Why TELUS Digital" positioning notes per company

---

### 12. Next Steps

1. David reviews PRD and confirms/adjusts:
   - Target company list
   - Scoring weights
   - Design direction
   - Open questions

2. Finalize data source strategy (what's freely available vs. paid)

3. Build data pipeline prototype (single company end-to-end)

4. Build frontend prototype (list view + one company detail)

5. Expand to full 20 companies

6. Polish, test, deploy

---

*End of PRD*
