# Syntax-highlight post-body code blocks server-side with highlight.js/lowlight

Blog post bodies sometimes contain code blocks. HubSpot's rich-text editor emits
them as **bare `<pre><code>…</code></pre>` with no language class**, so they
render as unstyled monospace. We add syntax highlighting as a **synchronous
`rehype` pass at render time**, inside the SSR-only `BlogArticle` module: a
`highlightCodeBlocks(html)` util runs `rehype-parse → rehype-highlight →
rehype-stringify` via `processSync` over the body string returned by
`buildTableOfContents`, baking `hljs` token spans into the static HTML. Because
the blocks carry no language, `rehype-highlight` runs with `detect: true` over a
curated `subset: ['typescript','json','bash']` (TSX highlights under the
`typescript` grammar — highlight.js has no `tsx`). Colors come from a single
dark highlight.js theme stylesheet; the site is dark-only, so no light variant.

## Considered Options

- **Shiki.** Best-looking output, ships inline styles (no theme CSS to manage).
  Rejected: it is **async and WASM-backed**, and our module renders in a
  synchronous React SSR pass — `codeToHtml` returning a Promise can't be awaited
  in a sync render. Architecturally incompatible here.
- **Prism.** Lightweight, popular. Rejected: **no automatic language detection**
  and it needs per-language grammars pre-registered. Our blocks are bare, so
  Prism would highlight nothing without authors hand-tagging every block.
- **highlight.js client-side** (`hljs.highlightAll()` after hydrate). Would need
  a new Island wrapping the body and ships a highlighter bundle + risks FOUC on
  every post. Rejected: the body is already static SSR HTML; highlighting it in
  the browser adds runtime JS for a purely visual, non-interactive result.
- **highlight.js via `lowlight`, server-side (chosen).** `lowlight` is
  highlight.js wrapped to produce a **hast tree synchronously with no DOM** — the
  only constraint our SSR runtime imposes (Node, no `DOMParser`; see the
  `buildTableOfContents` note). Auto-detection covers the missing language
  classes. Output is plain class names, so client cost is one CSS file, zero JS.

We also chose to land it as an **isolated final pass** rather than migrating the
existing regex-based `extractHeader` / `buildTableOfContents` onto the same
`rehype` pipeline. Unifying would mean one parse and hast-native heading/id
handling, but it touches working, well-tested utils for no user-visible gain
today; the rehype-unification is left as a future refactor.

## Consequences

- A new `highlightCodeBlocks` util (mirroring the `BlogArticle/utils` family,
  unit-tested) plus deps `rehype-parse`, `rehype-highlight`, `rehype-stringify`,
  `unified` — all **server-side only**, not shipped to the browser.
- `rehype` parses and re-stringifies the **whole body**, so HubSpot's HTML is
  lightly normalized (attribute quoting, void-tag form, whitespace). Cosmetic,
  but it is a real change to the served markup.
- Auto-detection is best-effort over a 3-language subset; a short ambiguous
  snippet (e.g. a one-line shell command) can still be mis-detected. Widening the
  subset would _worsen_ accuracy, so the set is kept tight.
- A highlight.js dark theme stylesheet is added to the Vite CSS entry, and
  `@tailwindcss/typography` `prose` styling for `pre`/`code` must be neutralized
  (e.g. `prose-pre:bg-transparent`) so the hljs theme owns block colors. Inline
  `<code>` keeps its prose styling.
- If interactive code features are wanted later (copy button, line highlight),
  they layer on as a small Island over the already-highlighted markup — the
  server-side decision doesn't preclude them.
