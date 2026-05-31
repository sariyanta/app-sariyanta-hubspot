/*
 * Splits the article's header off the post body: a leading heading (if the body
 * opens with one) plus the first paragraph. Both are removed from the body so
 * the prose — and the "On this page" table of contents built from it — start at
 * the next section.
 *
 * HubSpot's `post_summary` is just the opening paragraph, so sourcing the lead
 * from the body here avoids rendering that text twice.
 */

const LEADING_HEADING_RE = /^\s*<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/i;
const LEADING_P_RE = /^\s*<p\b[^>]*>([\s\S]*?)<\/p>/i;

export function extractHeader(html: string): {
  heading: string | null;
  lead: string | null;
  body: string;
} {
  let body = html;

  let heading: string | null = null;
  const headingMatch = LEADING_HEADING_RE.exec(body);
  if (headingMatch) {
    heading = headingMatch[2].trim();
    body = body.slice(headingMatch[0].length);
  }

  let lead: string | null = null;
  const leadMatch = LEADING_P_RE.exec(body);
  if (leadMatch) {
    lead = leadMatch[1].trim();
    body = body.slice(leadMatch[0].length);
  }

  return { heading, lead, body };
}
