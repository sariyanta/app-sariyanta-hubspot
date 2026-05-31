# Render published blog posts through a React module fed a pruned DTO

Blog posts render through a React `BlogArticle` module (featured image, title,
byline, tags, body) instead of plain HubL. The `blog-post` template forks: in
HubSpot's blog editor (`is_in_blog_post_editor`) it keeps the native HubL
`{{ content.post_body }}` node so inline rich-text editing still works; for
published visitors it mounts `BlogArticle`. Rather than passing the whole
HubSpot `content` object across the HubL→React boundary, the template builds a
small `article` DTO in HubL with only the render-relevant keys and passes that.
We accepted that the in-editor writing surface looks different from the
published layout, relying on HubSpot's Preview for fidelity.

## Considered Options

- **Render the whole article in HubL.** Simplest, full editor/published parity,
  but gives up React components/typing for the article layout — the reason we
  want React in the first place.
- **Pass the entire `content` object to React** (`content="{{content}}"`).
  One param, no DTO to maintain, but hublParameters serialize into the page as
  hydration JSON — so `post_body` would ship twice (rendered + JSON) plus all of
  HubSpot's plumbing (layoutSections, A/B variants, css, audit fields) as dead
  weight on every post.
- **Render `post_body` in HubL, React renders only the chrome.** Avoids the
  double-ship and gives body parity for free, but splits ownership of the
  article across two languages.

We chose the pruned DTO: React owns the whole article, the boundary stays small,
and the DTO's shape is the module's real contract (so `BlogPostContent`'s
catch-all index signature is dropped in favour of a tight `article` type).

## Consequences

- The DTO is a hand-maintained contract — adding a section to the article means
  adding its key in the HubL module tag _and_ the React type.
- Editor and published rendering are two code paths that can drift; Preview is
  the safety net, not the inline editor.
- Linked tags in the DTO point at HubSpot's default (unstyled) tag listing page
  until `blog-overview` / a tag template is themed.
