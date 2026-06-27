/*
 * Syntax-highlights fenced code blocks in a post body. HubSpot's rich-text
 * editor emits them as a bare `<pre>` (NO `<code>` child), with lines split by
 * `<br>` and indentation as `&nbsp;` — not the `<pre><code>` shape highlighters
 * expect. We normalize that into `<pre><code>…</code></pre>` (br → newline) and
 * highlight server-side at render time, baking the `hljs` token spans into the
 * static HTML — no client-side JS, just a theme stylesheet. See
 * docs/adr/0003-syntax-highlight-code-blocks-server-side-with-lowlight.md
 *
 * Runs through a synchronous, DOM-free `rehype` pipeline (the module renders in
 * a Node SSR runtime with no DOMParser, same constraint as buildTableOfContents).
 * `detect: true` is required because the blocks carry no language; the `subset`
 * is kept tight so short snippets disambiguate well (TSX highlights under the
 * `typescript` grammar — highlight.js has no `tsx`).
 */

import type { ElementContent, Root } from 'hast';
import rehypeHighlight from 'rehype-highlight';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

// Normalize the inline children of a HubSpot `<pre>` into the plain source text
// a highlighter expects: `<br>` elements become newlines, everything else keeps
// its text. `&nbsp;` indentation is already decoded to U+00A0 by the parser;
// fold it back to a regular space so highlight.js sees real whitespace.
function normalizePreChildren(children: ElementContent[]): ElementContent[] {
  return children.map((child): ElementContent => {
    if (child.type === 'element' && child.tagName === 'br') {
      return { type: 'text', value: '\n' };
    }
    if (child.type === 'text') {
      return { type: 'text', value: child.value.replace(/\u00A0/g, ' ') };
    }
    return child;
  });
}

// rehype-highlight only acts on `<code>` elements, but HubSpot emits a lone
// `<pre>`. Wrap such blocks' content in a `<code>` so the highlighter can see
// them; blocks that already have a `<code>` child are left for it to handle.
function rehypeWrapBarePre() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'pre') return;

      const hasCode = node.children.some(
        (child) => child.type === 'element' && child.tagName === 'code',
      );
      if (hasCode) return;

      node.children = [
        {
          type: 'element',
          tagName: 'code',
          properties: {},
          children: normalizePreChildren(node.children),
        },
      ];
    });
  };
}

const processor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeWrapBarePre)
  .use(rehypeHighlight, {
    detect: true,
    subset: ['typescript', 'json', 'bash'],
  })
  .use(rehypeStringify);

export function highlightCodeBlocks(html: string): string {
  return String(processor.processSync(html));
}
