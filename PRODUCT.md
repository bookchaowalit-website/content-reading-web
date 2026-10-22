# Reading List — Product truth

> Inferred from the code and copy (no user interview). Checked against the portfolio card claims review
> (`portfolio-site-web/docs/audits/CARD-CLAIMS-REVIEW-2026-10.md`, row `reading`, evidence Prototype) on 2026-10-22.

## What it is

A client-only demo of a reading shelf over four hard-coded sample items (two books, two essays).

## Who it is for

A portfolio visitor who wants to see a small, calm list UI: search, a category filter and one open item.

## What works today

1. Search title, summary or category (case-insensitive) and filter by All, Book or Essay.
2. Select an item to read its summary, status line and margin note. If a search hides the selected item, the first
   visible one opens instead.
3. `/api/mcp` answers JSON-RPC with `get_all`, `get_by_id` and `search` over the same list.
4. Front-end and server errors go to Sentry (errors only, personal data stripped) when `NEXT_PUBLIC_SENTRY_DSN` is set.

## What does not work (and must not be claimed)

- No book logging, progress percentages, yearly goals, genre stats or contributions chart (claims removed from the
  portfolio card in the 2026-10 review).
- The progress text on each item ("In progress / 24%") is fixed sample copy, not tracked progress.
- No import, account, storage or sync; nothing survives a reload. No product analytics beyond Vercel Analytics.

## Live URL and deploy state

- Live: https://reading.bookchaowalit.com (HTTP 200 on 2026-10-22).
- The Vercel project `bookchaowalit-reading-frontend` is deployed only by CLI (last production 2026-10-08, commit
  5b68f06) and its Git link names the old repository, so a push to `main` does not deploy. The live site lags `main`
  (no Sentry, old template MCP route) until the owner reconnects Vercel Git to this repository (owner action D9).
  `NEXT_PUBLIC_SENTRY_DSN` is already set on the Vercel project (Sentry project `content-reading-web`, org
  `personal-yu0`).

## Boundaries

- Browser-only apart from the stateless `/api/mcp` route.
