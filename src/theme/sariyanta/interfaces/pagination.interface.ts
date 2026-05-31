/*
 * Server-side pagination state for the blog overview, built in the
 * `blog-overview` HubL template from `current_page_num` / `last_page_num` and
 * `blog_page_link`. HubSpot paginates newest-first, so the *next* page holds
 * *older* posts: `nextUrl` drives the "Older" control and `prevUrl` the "Newer"
 * one. A boundary page has no link in that direction, hence the nullable URLs.
 */

export interface Pagination {
  /** 1-based index of the page currently rendered. */
  currentPage: number;
  /** Total number of pages; the controls are hidden entirely when this is 1. */
  lastPage: number;
  /** Link to the previous (newer) page, or null on the first page. */
  prevUrl: string | null;
  /** Link to the next (older) page, or null on the last page. */
  nextUrl: string | null;
}
