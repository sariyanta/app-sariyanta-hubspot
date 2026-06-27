# PageArticle: a field-driven counterpart to BlogArticle, over a shared prose pipeline

The long-form reading experience (prose typography, server-side syntax
highlighting, sticky "On this page" sidebar) was locked inside `BlogArticle`,
which only renders blog-post content. To bring the same treatment to standalone
pages, we add `PageArticle`: a React module an editor drags into a page
`dnd_area`. It renders the _same_ layout — optional eyebrow, optional title,
prose body, TOC sidebar — but sources its content from its **own module fields**
(`eyebrow`, `title`, `post_body`) instead of from a blog post.

The two modules are a deliberate vocabulary pair with opposite content sources:

- **`BlogArticle`** is DTO-fed — content lives on the blog post and crosses the
  HubL→React boundary as the pruned `Article` DTO (ADR-0001). It _is_ the
  blog-post template body, and it carves its masthead out of the body with
  `extractHeader` (leading heading + lead paragraph).
- **`PageArticle`** is fields-driven — content lives on the module. Its masthead
  comes from the `eyebrow`/`title` fields, so it does **not** call
  `extractHeader`; the body is rendered as authored. `post_body` is required with
  default text (a dropped module is never empty); `eyebrow`/`title` are optional
  and guarded with `&&`.

To let neither module own the other's internals, the shared prose pipeline —
`buildTableOfContents`, `highlightCodeBlocks`, and the `toc` island (plus its
`useActiveHeading` hook) — was lifted out of `BlogArticle` into a theme-level
`common/` directory, importable via `@/common`. `BlogArticle` re-points its
imports there; `extract-header` and `get-initials` stay private to `BlogArticle`
because they are blog-DTO-specific, not shared prose. This extends ADR-0001
rather than overturning it: the DTO contract is unchanged.

## Considered Options

- **Generalize `BlogArticle` to also render fields.** One module, two content
  sources behind a branch. Rejected: it would weld the blog-DTO path and the
  fields path together and keep the blog-only helpers (`extractHeader`,
  `getInitials`, byline, tags, featured image) on the page path that never uses
  them.
- **Copy the prose pipeline into the new module.** Fast, but a fix to the TOC
  builder or highlighter would then have to land twice and could drift.
- **Name it `Article` or `ProseArticle`.** `Article` collides with the existing
  `Article` DTO interface; `ProseArticle` breaks the one-to-one parallel with
  `BlogArticle`. `PageArticle` keeps the pair legible.

We chose a separate, fields-driven `PageArticle` over a shared `common/`
pipeline: the asymmetry (DTO-fed vs fields-driven) is explicit, the shared
surface is only the genuinely shared prose code, and a pipeline fix lands once.

## Consequences

- A fix to `buildTableOfContents`, `highlightCodeBlocks`, or the TOC island now
  benefits both modules — and can break both, so their specs (relocated to
  `common/` unchanged) are the regression guard.
- `PageArticle`'s `fields`/`fields.type.ts` are a hand-or-tool-maintained
  contract, the same kind of drift risk as the DTO: adding a field means adding
  it in both places.
- The page template gains a `dnd_area`, so pages are now editor-composed; the
  template wiring is verified manually (no prior art for testing HubL here).
- No author, publish date, tags, featured image, or "hide TOC" toggle on
  `PageArticle` — those stay blog-only / explicitly deferred.
