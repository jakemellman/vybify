# Project: Vybify

## Collaboration rules (READ FIRST)

This repo is worked on by two people, each using Claude Code. To avoid
breaking each other's work, follow these rules WITHOUT EXCEPTION.

### Branching
- NEVER commit directly to `main`. Always work on a feature branch.
- Branch naming: `jake/feature-name` or `charlie/feature-name` so it's
  obvious whose work is whose.
- Before starting new work, ALWAYS run:
    git checkout main
    git pull origin main
    git checkout -b jake/whatever-im-doing
- Before pushing, ALWAYS run:
    git pull origin main --rebase
  Resolve any conflicts before pushing.

### Pushing to main
- Small, isolated changes to YOUR lane: push directly to main is OK.
- Anything that touches shared files (see below) or spans multiple
  features: open a PR and ping the other person before merging.
- NEVER force push to main. NEVER delete main.
- If git refuses a push, STOP and ask the user. Do not "fix" with --force.

### Lane ownership
- **Jake owns**:
  - `src/content/projects/` (curated project entries — `.md` files)
  - `src/content/skills/` (curated skill entries — `.md` files)
  - Curation calls (which entries to add, edit, remove, feature)
- **Charlie owns**:
  - Feature work in `src/components/`, `src/pages/`
  - New site features and UI changes
- **Shared (touch only with coordination)**:
  - `src/content/config.ts` (schema — changes affect every entry)
  - `src/layouts/Layout.astro` (header, footer, GA, meta tags)
  - `src/styles/global.css` (palette, prose styles)
  - `src/lib/github.ts` (star fetcher)
  - `astro.config.mjs`, `package.json`, `tsconfig.json`
  - `.github/workflows/*` (CI: deploy-on-push, refresh-stars, ingest-skills-sh)
  - `scripts/*` (ingest, prefetch, migration scripts)
  - `.env`, anything in the project root, anything in `public/`

### Don'ts (these have broken things before)
- Don't run `git push --force` or `git push -f`. Ever.
- Don't run `git reset --hard` on shared branches.
- Don't commit `.env`, GitHub PATs, Cloudflare API tokens, deploy hook URLs,
  or anything that looks like a credential.
- Don't modify files outside your lane without explicit instruction.
- Don't auto-merge PRs.
- If you're unsure whether a change is safe, ASK THE USER first.

### Before any destructive operation
Confirm with the user before running:
- Anything with --force or -f
- git reset --hard
- git clean -fd
- Deleting branches (git branch -D, git push --delete)
- rm -rf on anything tracked by git
- Bulk edits across many content files (`sed -i`, find-and-replace scripts)

## Project context

### Stack
- **Framework**: Astro 5 (static-site generator)
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/vite`)
- **Content**: Content Collections — both `projects` and `skills` are
  loaded from `src/content/{type}/*.{md,mdx}`. Schema is enforced in
  `src/content/config.ts` (Zod). Each entry has YAML frontmatter +
  optional markdown body.
- **Search**: Client-side with Fuse.js, in `src/components/SearchableGrid.astro`
- **Hosting**: Cloudflare Pages, custom domain `vybify.com`
- **DNS**: Cloudflare (zone managed in Cloudflare account)
- **Analytics**: Google Analytics (GA4 — id `G-8VB77KW60J`) wired in
  Layout.astro

### Build pipeline
- `npm run build` runs:
  1. `node scripts/prefetch-stars.mjs` — sequentially fetches GitHub stars
     for every entry's `github` field, writes to `.cache/github-stars.json`.
     ~70s for ~80 unique repos. 800ms delay between requests to stay under
     GitHub's secondary rate limit.
  2. `astro build` — generates static pages, reads stars from `.cache`.
- The cache is gitignored. Cloudflare preserves it between builds.
- `process.env.GITHUB_TOKEN` must be set on Cloudflare for the prefetch
  to authenticate (otherwise we hit the 60/hr unauth limit fast).

### Deploy
- Auto-deploy on push to `main` via Cloudflare's GitHub integration.
- Backup deploy trigger: `.github/workflows/deploy-on-push.yml` curls a
  Cloudflare deploy hook on every push (in case the GitHub integration
  flakes). Both run; Cloudflare dedupes.
- Daily 07:00 UTC: `.github/workflows/refresh-stars.yml` triggers a
  rebuild so star counts refresh.
- Sundays 09:00 UTC: `.github/workflows/ingest-skills-sh.yml` runs
  `scripts/ingest-skills-sh.mjs` to scrape the top of skills.sh and
  open a PR with new candidates.

### Content shape
- **Projects** live in `src/content/projects/*.md` — finished products
  (apps, tools, agents, frameworks) built with AI tools.
- **Skills** live in `src/content/skills/*.md` — installable extensions
  for AI coding agents (Claude Code skills, MCP servers, Cursor rules).
- Schema: see `src/content/config.ts`. Required: `name`, `tagline` (max
  160), `url`, `tags[]`, `addedAt` (YYYY-MM-DD). Skills also need `kind`
  and an optional `install` command.
- Markdown body (optional) renders on detail pages as the "How it was
  built" / "How to use this skill" section.

### Detail page URLs
- `/projects/<slug>` — slug = filename without extension
- `/skills/<slug>` — same
- Renaming a content file = breaking the URL. Use git mv if you must
  change it, and consider whether anything links there.

### Design system
- Palette in `src/styles/global.css` under `@theme`:
  - bg `#f5f6f8` (light gray)
  - card `#ffffff`
  - accent `#1f6fff` (blue)
  - positive `#18a558` (green, used for star delta)
- Fonts: system stack (`-apple-system`, etc.), no custom font loading
- Components are Astro `.astro` files in `src/components/`
- Prose styles for markdown bodies live in `global.css` under `.prose`

### Tagline rules
- Max 160 chars (enforced by schema)
- End with sentence-terminal punctuation (`.` `!` `?` `…` `。`)
- Avoid mid-word truncation — use `scripts/cleanup-taglines.mjs` if
  bulk-fixing
