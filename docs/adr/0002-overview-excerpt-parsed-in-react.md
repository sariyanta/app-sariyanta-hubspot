# Overview excerpts are parsed in React, not pre-derived in HubL

The blog overview shows a plain-text excerpt per post: the post's
`meta_description` when set, otherwise the first sentence of the first
paragraph of the summary. ADR-0001 establishes the opposite default — derive
render-ready values in HubL so the React DTO carries no parsing logic and no raw
markup. We deliberately deviate here: the `BlogPostSummary` DTO carries the
post's `post_summary` HTML (bounded by `<!--more-->`) and the React module owns
excerpt extraction via a unit-tested `extractExcerpt` util that mirrors the
existing `BlogArticle/utils/extractHeader` family.

## Considered Options

- **Derive the excerpt in HubL** (ADR-0001 default). React gets a ready string,
  nothing extra crosses the boundary. But "first sentence of the first
  paragraph" in HubL means chaining `regex_replace` + `striptags` + a split on
  `. ` — fragile and untestable, against the repo's tested-utils culture.
- **Parse in React (chosen).** Reuses tested TS HTML-parsing utilities, so the
  rule is verified by unit tests. Costs a small impurity: `post_summary` HTML
  rides along in the DTO, and parsing runs client/render-side. `meta_description`
  (the common path) is still passed render-ready, so parsing only runs on
  fallback.

## Consequences

- `BlogPostSummary` is not fully render-ready — it carries `post_summary` so
  React can compute the fallback excerpt. This is the explicit exception to
  ADR-0001's "pass only render-ready keys".
- Excerpt behaviour is covered by `extractExcerpt` unit tests rather than being
  trusted to HubL.
