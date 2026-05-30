# web-sariyanta-hs

Personal developer blog of Sariyanta — writing about building with HubSpot.
This repo is the **HubSpot CMS React theme** (design, templates, modules).
The blog **posts themselves are written in HubSpot's blog editor** in the
production portal, not in this repo.

## Stack

React 18 · TypeScript · Tailwind v4 · shadcn/ui · Vite · Vitest ·
HubSpot CMS React (`@hubspot/cms-components`) · `hs` CLI (platformVersion 2026.03)

## Layout

A **pnpm workspace** (`pnpm-workspace.yaml`) with two packages:

- **root** (`app-hubspot-sariyanta`) — build/test/lint tooling. Compiles
  Tailwind (`src/styles/theme.css` → `src/theme/sariyanta/styles/theme.hubl.css`),
  runs tests, orchestrates uploads.
- **`src/theme/sariyanta/`** (`web-sariyanta-theme`) — the deployable theme.
  `hs project upload` installs this dir's deps **server-side from its own
  `package.json`**, so that file is the canonical dependency manifest for the
  deployed theme. The two packages don't depend on each other (no `workspace:*`),
  so this manifest stays standard and portable — HubSpot reads it unchanged.

No turborepo/nx: this is a small 2-package solo repo with no cross-package build
chain to orchestrate or cache, so a plain pnpm workspace is enough.

Package manager: **pnpm**.

## Setup

```bash
# one install at the root covers both workspace packages
pnpm install

# authenticate the HubSpot CLI against both portals (once)
hs auth   # dev/test account: 148579585
hs auth   # production portal: 24905799
```

## Develop

```bash
pnpm start   # watches Tailwind CSS + runs hs-cms-dev-server (serves on *.hslocal.net)
```

## Test / lint

```bash
pnpm test            # vitest run
pnpm test:watch
pnpm test:coverage
pnpm lint            # eslint --fix
pnpm typecheck       # tsc on the theme
pnpm format          # prettier --write
```

## Deploy

```bash
pnpm upload          # build CSS + upload to DEV/test account (148579585)
pnpm upload:prod     # build CSS + upload to PRODUCTION portal (24905799)
```

Posts are authored in the HubSpot blog tool in the production portal — this
repo only ships the theme they render with.
