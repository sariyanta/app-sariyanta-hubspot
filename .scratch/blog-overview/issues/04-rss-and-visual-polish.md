# RSS link and visual fidelity polish

Status: needs-triage

## What to build

Final fidelity pass on the blog overview against the `vercel.com/press`
reference: an RSS link in the navigation row, hover/focus states on cells and
tabs, and the spacing/divider/`+`-crosshair details that make the grid match the
screenshot. This slice is HITL — it needs a human design eyeball to confirm the
match.

## Acceptance criteria

- [ ] An RSS link renders in the nav row, pointing at the blog's RSS feed
      (`<blog>/rss.xml`).
- [ ] Cells and tabs have hover and keyboard-focus states.
- [ ] Grid dividers, cell padding, and the `+` crosshair origin match the
      reference screenshot to a human reviewer's satisfaction.
- [ ] A human has reviewed the rendered overview against `vercel.com/press` and
      signed off.

## Blocked by

- 02-category-tabs-and-pagination.md
