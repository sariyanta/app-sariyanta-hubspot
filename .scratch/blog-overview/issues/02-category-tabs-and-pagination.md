# Category tabs and server-side pagination

Status: needs-triage

## What to build

The navigation chrome around the grid: a **category tab** row above it and
**server-side pagination** below it. Both are thin additions to the same
`blog-overview` template + `BlogOverview` module.

**Category tabs:** the HubL template builds a `categories[]` list — every blog
tag becomes a tab (auto-listed, no curation) plus a leading "All Posts" — each
with a label, the tag listing URL, and an `isActive` flag derived from the
current tag. React renders this as a styled link row (shadcn-style nav, not a
client-side `Tabs` widget) with the active tab highlighted. Because HubSpot
routes tag pages through the same `blog_listing` template, clicking a tab lands
on a tag-filtered grid that renders through this very module.

**Pagination:** the HubL template builds a `pagination` DTO (`currentPage`,
`lastPage`, `prevUrl`, `nextUrl` via `blog_page_link`) and React renders
Older/Newer controls below the grid, hidden when there is only one page.

## Acceptance criteria

- [ ] HubL builds `categories[]` (`{ label, url, isActive }`) from all blog tags
      plus an "All Posts" entry, and passes it into the module.
- [ ] A `Category` interface is added under `interfaces/` and exported.
- [ ] `CategoryTabs` renders the row with the active tab visually distinguished;
      "All Posts" is active on the un-filtered blog root.
- [ ] Visiting a tag listing URL renders the grid filtered to that tag through
      the same `BlogOverview` module with the matching tab active.
- [ ] HubL builds a `pagination` DTO using `blog_page_link` / `current_page_num`
      / `last_page_num`; exact variable names verified against HubSpot docs at
      implementation time.
- [ ] React renders Older/Newer pagination controls below the grid, omitted when
      `lastPage` is 1.
- [ ] `CategoryTabs` has a render test covering active/inactive states.

## Blocked by

- 01-blog-overview-grid.md
