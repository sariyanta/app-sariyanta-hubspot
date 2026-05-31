# Blog search

Status: needs-triage

## What to build

A search field in the overview's navigation row that searches the blog. The
field lives alongside the category tabs and submits to HubSpot's built-in search
results endpoint scoped to blog posts (`/_hcms/search?type=BLOG_POST`).

This slice captures the deferred search plan: wire up real search against the
default results page now; a themed `search-results` template is explicitly a
later follow-up (see Out of scope below).

## Acceptance criteria

- [ ] A search input renders in the overview nav row, styled to match the tabs.
- [ ] Submitting a query navigates to HubSpot's blog search results scoped to
      blog posts.
- [ ] Component covered by a render test.

## Out of scope

- Theming the search **results** page (a separate `search-results` template
  type). This slice points at HubSpot's default results page only.

## Blocked by

- 02-category-tabs-and-pagination.md
