/*
 * Builds an "On this page" table of contents from a post body's headings, and
 * returns the body with stable `id`s injected onto those headings so the TOC
 * links can scroll to them.
 *
 * Regex-based on purpose: HubSpot renders this module server-side in a Node
 * runtime with no DOM, so DOMParser is unavailable. Post bodies come from
 * HubSpot's editor and use well-formed heading tags, which this handles.
 */

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

const HEADING_RE = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi;
const ID_ATTR_RE = /\bid=["']([^"']+)["']/;
const TAG_RE = /<[^>]+>/g;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(TAG_RE, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildTableOfContents(html: string): {
  html: string;
  toc: TocEntry[];
} {
  const toc: TocEntry[] = [];
  const seen = new Map<string, number>();

  const out = html.replace(
    HEADING_RE,
    (_match: string, level: string, attrs: string, inner: string) => {
      const text = inner.replace(TAG_RE, '').replace(/\s+/g, ' ').trim();

      const existing = ID_ATTR_RE.exec(attrs);
      let id: string;
      let attrsOut = attrs;

      if (existing) {
        id = existing[1];
      } else {
        const base = slugify(text);
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        id = count === 0 ? base : `${base}-${count}`;
        attrsOut = `${attrs} id="${id}"`;
      }

      toc.push({ id, text, level: Number(level) as 2 | 3 });
      return `<h${level}${attrsOut}>${inner}</h${level}>`;
    },
  );

  return { html: out, toc };
}
