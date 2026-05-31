/*
 * A category tab in the blog overview chrome. Built in the `blog-overview` HubL
 * template from the blog's tag list (one tab per tag, auto-listed) plus a
 * leading "All Posts" entry, and passed into the `BlogOverview` module. Because
 * HubSpot routes tag pages through the same `blog_listing` template, each tab is
 * a plain link back into this module with a tag-filtered `contents`.
 */

export interface Category {
  /** Tab label — a tag name, or "All Posts" for the un-filtered root. */
  label: string;
  /** Listing URL the tab links to (tag listing, or the blog root). */
  url: string;
  /** True for the tab matching the current listing; highlighted in the row. */
  isActive: boolean;
}
