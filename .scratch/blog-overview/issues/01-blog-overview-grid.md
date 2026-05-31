# Blog overview grid

Status: needs-triage

## What to build

The core **blog overview**: a two-column, text-only bordered grid of published
posts, modelled on `vercel.com/press`. The `blog-overview` HubL template stops
passing the raw `contents` array and instead builds a pruned `BlogPostSummary[]`
(per ADR-0001) and passes that into the `BlogOverview` React module, which
renders the grid end-to-end.

Each cell shows: a category eyebrow (first tag name, else blog name) and the
publish date on the top row with a plain corner arrow; a large bold title; and a
muted plain-text excerpt. The whole cell is an internal link to the post.

The excerpt follows the rule in ADR-0002: use `meta_description` when non-empty,
otherwise the first sentence of the first paragraph of the post summary (HTML
stripped, leading `<h2>` discarded). This is computed in React by a dedicated
`extractExcerpt` util, mirroring the existing `extractHeader` family.

## Acceptance criteria

- [ ] `blog-overview.hubl.html` builds a `BlogPostSummary[]` (eyebrow, title,
      url, dateFormatted, dateISO, metaDescription, postSummary) from `contents`
      and passes it as a single prop — the raw `contents` object no longer
      crosses into React.
- [ ] A `BlogPostSummary` interface is added under `interfaces/` and exported.
- [ ] `BlogOverview` renders a responsive grid: two columns on desktop with 1px
      cell dividers and a `+` crosshair at the grid origin; single column on
      mobile.
- [ ] Each cell renders eyebrow + formatted date + corner arrow, title, and
      excerpt, and links to the post's internal URL.
- [ ] Dates are formatted in HubL (no date library ships client-side); `<time>`
      carries the ISO date.
- [ ] `extractExcerpt` returns `meta_description` when present, else the first
      sentence of the first paragraph with HTML stripped and any leading heading
      discarded; it is covered by unit tests (prior art:
      `BlogArticle/utils/extract-header.test.ts`).
- [ ] `BlogOverview` has a render test covering populated and empty states
      (prior art: `BlogArticle/component.test.tsx`).
- [ ] An empty `contents` page renders a clear empty state ("No posts yet").

## Blocked by

None - can start immediately
