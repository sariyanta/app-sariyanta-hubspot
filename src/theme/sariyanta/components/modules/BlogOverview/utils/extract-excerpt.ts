/*
 * Derives the plain-text excerpt shown under each overview cell. Prefers the
 * post's hand-written `metaDescription`; when that is empty, falls back to the
 * first sentence of the first paragraph of the post summary, with any leading
 * heading discarded and all HTML stripped. See
 * docs/adr/0002-overview-excerpt-parsed-in-react.md.
 */

const LEADING_HEADING_RE = /^\s*<h([1-6])\b[^>]*>[\s\S]*?<\/h\1>/i;
const FIRST_P_RE = /<p\b[^>]*>([\s\S]*?)<\/p>/i;

export function extractExcerpt(
  metaDescription: string,
  postSummary: string,
): string {
  const meta = metaDescription.trim();
  if (meta) return meta;

  let html = postSummary;
  const headingMatch = LEADING_HEADING_RE.exec(html);
  if (headingMatch) html = html.slice(headingMatch[0].length);

  const paragraphMatch = FIRST_P_RE.exec(html);
  const paragraph = paragraphMatch ? paragraphMatch[1] : html;

  const text = paragraph
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return '';

  const sentenceEnd = text.indexOf('. ');
  return sentenceEnd === -1 ? text : text.slice(0, sentenceEnd + 1);
}
