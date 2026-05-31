/*
 * Types for the `content` object of a HubSpot blog post, as passed to the
 * BlogArticle module at render time.
 *
 * Only the render-relevant keys are typed explicitly; the rest of HubSpot's
 * CMS plumbing is left to the index signature.
 */

export interface BlogAuthor {
  displayName: string;
  fullName: string;
  name: string;
  slug: string;
  avatar: string;
  bio: string;
  email: string | null;
  facebook: string;
  linkedin: string;
  twitter: string;
  twitterUsername: string;
  website: string;
  [key: string]: unknown;
}

export interface ParentBlog {
  absoluteUrl: string;
  rootUrl: string;
  name: string;
  label: string;
  slug: string;
  allowComments: boolean;
  commentFormGuid: string;
  [key: string]: unknown;
}

export interface BlogPostContent {
  // Core content
  postBody: string;
  postListContent: string;
  postSummary: string;
  title: string;
  htmlTitle: string;
  pageTitle: string;
  /** Wrapped in an `hs_cos_wrapper` span — strip before display. */
  name: string;
  /** Wrapped in an `hs_cos_wrapper` span — strip before display. */
  label: string;

  // Links
  slug: string;
  url: string;
  absoluteUrl: string;
  publishedUrl: string;

  // Featured image
  useFeaturedImage: boolean;
  featuredImage: string;
  featuredImageAltText: string;
  featuredImageWidth: number;
  featuredImageHeight: number;

  // Meta / SEO
  metaDescription: string;
  linkRelCanonicalUrl: string;
  language: string;
  isCrawlableByBots: boolean;

  // Author
  blogPostAuthor: BlogAuthor;

  // Taxonomy
  tagIds: number[];
  tagNames: string[];
  topicIds: number[];
  topicNames: string[];

  // Dates (epoch ms)
  publishDate: number;
  publishedAt: number;
  updated: number;

  // Navigation
  nextPostName: string | null;
  nextPostSlug: string | null;
  nextPostFeaturedImage: string | null;
  previousPostName: string | null;
  previousPostSlug: string | null;
  previousPostFeaturedImage: string | null;

  // Parent blog
  parentBlog: ParentBlog;

  // Comments
  areCommentsAllowed: boolean;

  // Everything else HubSpot ships (A/B testing, email/social tasks, audit
  // fields, css, layoutSections, meta mirror, analytics, perms, etc.)
  [key: string]: unknown;
}
