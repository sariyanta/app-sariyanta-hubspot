# Context

Domain language for the Sariyanta HubSpot theme.

## Glossary

### BlogArticle / PageArticle

A vocabulary pair: two React modules that render the **same** long-form layout
(optional eyebrow, optional title, prose body, sticky "On this page" sidebar)
from **opposite** content sources.

- **`BlogArticle`** is _DTO-fed_: content lives on the blog post and crosses the
  HubL→React boundary as the [[pruned-dto]] `Article` (docs/adr/0001). It is the
  blog-post template body, and carves its masthead out of the body
  (`extractHeader`).
- **`PageArticle`** is _fields-driven_: content lives on the module's own fields
  (`eyebrow`, `title`, `post_body`), authored inline and dragged into a page
  `dnd_area`. Its masthead comes from the fields, so it does **not** call
  `extractHeader`. `post_body` is required with default text; `eyebrow`/`title`
  are optional.

Both share one prose pipeline — `buildTableOfContents`, `highlightCodeBlocks`,
and the TOC island — lifted into the theme's `common/` directory (`@/common`)
so a fix lands once for both. Blog-only helpers (`extract-header`,
`get-initials`) stay private to `BlogArticle`. See
docs/adr/0004-page-article-field-driven-counterpart.md.

### Blog overview

The blog **listing** page — HubSpot's `blog_listing` template type. Renders the
collection of published posts for a blog, as opposed to a single post (the
**blog article**, see `BlogArticle`). Rendered by the `BlogOverview` React
module. Visual target: a **two-column, text-only bordered grid** modelled on
`vercel.com/press` — cells framed by 1px dividers (a `+` crosshair at the grid
origin). Each cell: top row of category eyebrow + publish date (left) and a
link icon (top-right); a large bold title; a muted excerpt. No thumbnails, even
though posts carry featured images. Whole cell is a link to the post.

### Excerpt (overview)

The short plain-text blurb shown under each title in the blog overview. Rule:
use the post's `meta_description` when non-empty; otherwise the **first sentence
of the first paragraph** of the post summary, with HTML stripped. Never the
leading `<h2>` heading that HubSpot puts at the top of `post_summary`.

### Pruned DTO

The small, hand-built data object passed across the HubL→React boundary instead
of HubSpot's full `content`/`contents` object. The HubL template builds it with
only render-relevant keys (dates pre-formatted, tag URLs pre-composed) so the
whole CMS object never crosses into React. Established for the blog article in
docs/adr/0001; the blog overview follows the same contract with a
`BlogPostSummary[]` list.

### BlogPostSummary

The per-post pruned DTO for the blog overview: `eyebrow` (first tag name, else
blog name), `title`, `url` (internal post URL), `dateFormatted`, `dateISO`,
`metaDescription`, and `postSummary` (carried so React can compute the fallback
[[excerpt-overview]]). One per post in the current `contents` page.

### Category tabs

The filter row above the grid (Vercel: "All Posts / Engineering / …"). Backed by
the blog's **tags** — **every** blog tag becomes a tab (auto-listed, no
curation). Each tab links to that tag's listing page, which renders through the
_same_ `BlogOverview` module (HubSpot filters `contents` by tag). The active tab
reflects the current tag. "All Posts" links to the blog root. Tabs are page
links (server nav), styled like shadcn nav — not a client-side `Tabs` widget.
