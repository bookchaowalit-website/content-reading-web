---
name: Reading Shelf
description: A small shelf of books and essays in progress, on the shared Reader shell.
---

# Design System: Reading Shelf

Since 2026-11-19 the site uses the shared Reader shell (see `READER.md`): Geist via `next/font`, the
`--rs-*` tokens in `app/reader-shell.css` (light and dark, WCAG 2.2 AA), 44px targets, one h1 per page
and a forced-colors fallback. The forest-green index and cream page (hard-coded colours, 7–10px mono
labels, 28px filter buttons) are retired.

## Pages

- `/` — search (`?q=`) and type chips (`?type=Book|Essay`, counts follow the search), a result count,
  then one row per item (type and status first, then the title and summary) and two empty states.
- `/read/<id>` — one item: title, summary, status, its margin note, and previous / next in shelf order.
  This replaces the side panel that opened below the list on phones.

The list itself is `lib/reading.ts` (also served by `/api/mcp`); views live in
`components/reading-views.tsx` and take plain data so `tests/home.test.tsx` can render every state.
