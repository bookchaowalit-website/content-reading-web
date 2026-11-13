---
name: Reading Shelf
description: A forest-green shelf for finding the next book or essay to open.
---

# Design System: Reading Shelf

## Overview

Reading Shelf is a compact local queue for books and essays. Its world is a quiet library shelf: the dark index helps choose a piece, and the cream page opens a margin note about why it is still here. It is a reading tool, not an import service or social reading platform.

## Colors

- **Forest** `#17372f`: shelf room and primary ambient field.
- **Deep forest** `#102a24`: index surface.
- **Paper** `#eee9dc`: open page.
- **Gold** `#d3aa4b`: open shelf state and category selection.
- **Coral** `#c8634d`: page marks and reading boundary.
- **Blue** `#8bb4b0`: summary/annotation voice.
- **Rule** `#5d766c`: shelf structure.

Gold marks an open shelf choice; coral marks page indexing and limits. The paper is reserved for the active reading surface.

## Typography

Geist Sans carries book titles and navigation. Georgia italic provides the summary and margin-note reading voice. Geist Mono is used for categories, progress metadata, and explicit no-import/no-sync copy.

## Layout

The first viewport frames the shelf thesis and then opens an index/page split: search and category tabs on the left, the selected reading page on the right. On narrow screens the whole index comes before the page, preserving the act of choosing before reading.

## Elevation & Depth

Forest around deep forest around paper creates the depth stack. Rules and a selected shelf row provide state. There are no floating cards or shadows; the opened page is the only light surface.

## Shapes

Shelf rows and the open page are square editorial forms. The stamp is a small rotated shelf mark. Category controls use bordered rectangles, not pills.

## Components

- **Shelf index:** search, All/Book/Essay tabs, selectable rows, and no-match state.
- **Open page:** category/meta bar, page number, title, summary, margin note, and source boundary.
- **Local sample list:** authored reading records with no remote import, progress sync, or account.

## Do's and Don'ts

- Do make “what should I open next?” answerable within seconds.
- Do let the selected page feel calmer and lighter than the index.
- Do keep sample/progress limits visible.
- Don't imply library integration, synchronized progress, or recommendations.
- Don't turn the shelf into a repeated reading-card grid or generic productivity dashboard.


---

## Storybook

Storybook 10 (`@storybook/nextjs-vite`) shows this design system with the app's real CSS, tokens and fonts.

```bash
npm run storybook        # http://localhost:6006
npm run build-storybook  # static build in storybook-static/ (CI: .github/workflows/storybook.yml)
```

- **Foundations/Tokens** reads every CSS custom property the app defines at runtime, so it never drifts from the code.
- **Design/DESIGN.md** renders this file.
- **Components/**, **Sections/** and **Pages/** show the UI with mock data only (no network, analytics off).
- Toolbar: locale, theme (light / dark, when the app has a dark theme), viewports 320 / 375 / 768 / 1440. The a11y panel runs axe (WCAG 2.2 AA).
- Rule: a new shared component or page section ships with a story in `stories/`.
