/*
 * The render DTO passed from the `blog-post` HubL template into the
 * `BlogArticle` React module. This is the *pruned* boundary contract: the HubL
 * side builds it from HubSpot's full `content` object (see
 * `blog-post-content.interface.ts` for the source shape) and passes only these
 * render-relevant keys across, so the whole content object never crosses into
 * React. See docs/adr/0001-react-blog-article-with-pruned-dto.md.
 */

export interface ArticleTag {
  name: string;
  /** Pre-built absolute URL to the tag listing page (composed in HubL). */
  url: string;
}

export interface ArticleAuthor {
  displayName: string;
  /** May be an empty string — render initials as a fallback. */
  avatar: string;
}

export interface Article {
  title: string;
  /** Parent blog name — eyebrow fallback when the post has no tags. */
  blogName: string;

  // Featured image (hero)
  useFeaturedImage: boolean;
  featuredImage: string;
  featuredImageAltText: string;
  featuredImageWidth: number;
  featuredImageHeight: number;

  /** Optional — blog posts may have no assigned author. */
  author?: ArticleAuthor;

  /** Human-readable, formatted in HubL, e.g. "May 30, 2026". */
  publishDateFormatted: string;
  /** Machine-readable ISO date for `<time dateTime>`, e.g. "2026-05-30". */
  publishDateISO: string;

  tags: ArticleTag[];

  /** Raw HubSpot-rendered post body HTML, injected via dangerouslySetInnerHTML. */
  postBody: string;
}
