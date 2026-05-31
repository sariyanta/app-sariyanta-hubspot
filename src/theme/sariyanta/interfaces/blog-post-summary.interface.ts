/*
 * The render DTO passed from the `blog-overview` HubL template into the
 * `BlogOverview` React module — one entry per published post. Like `Article`
 * (see `article.interface.ts`) it is a pruned boundary contract built in HubL
 * from HubSpot's `contents` array, so the raw content objects never cross into
 * React.
 *
 * Exception to ADR-0001's "pass only render-ready keys": `postSummary` carries
 * the post summary HTML so React can compute the fallback excerpt. See
 * docs/adr/0002-overview-excerpt-parsed-in-react.md.
 */

export interface BlogPostSummary {
  title: string;
  /** Internal URL of the post; the whole cell links here. */
  url: string;

  /** Parent blog name — eyebrow fallback when the post has no tags. */
  blogName: string;
  /** Tag names; the eyebrow is the first one, else `blogName`. */
  tags: string[];

  /** Human-readable, formatted in HubL, e.g. "May 30, 2026". */
  dateFormatted: string;
  /** Machine-readable ISO date for `<time dateTime>`, e.g. "2026-05-30". */
  dateISO: string;

  /** Hand-written SEO description; the preferred excerpt when non-empty. */
  metaDescription: string;
  /** Post summary HTML; source for the fallback excerpt (ADR-0002). */
  postSummary: string;
}
