# CLAUDE.md

Personal portfolio for Cayl Blasingame, electrical engineering student at Texas State University.
Full spec: `docs/spec.md`. Read it before starting any phase. This file holds the rules that apply to every session.

## Positioning
- One line: builds the hardware first, then the software that runs on it.
- Primary audience: semiconductor fab, process, and test recruiters (Austin corridor). Frame work around process, measurement, yield.
- Credibility: Texas State EE, Eagle Scout (Troop 333), high school salutatorian, full-ride scholarship.

## Design direction: Drawing Sheet, dark-first
- Every page is a drafting sheet: zone-marked frame (1–6, A–D), header strip (Drawn by / Project / Sheet / Date),
  5 mm grid (heavier every 25 mm), footer with signed line and title block (Title / DWG / Date / Rev / Scale / Sheet).
- Dark (drafting film) is the default. Light (vellum) is the alternate via toggle. Tokens live in `docs/spec.md` §4.
- Red (`--acc`) is reserved for redlines: revision notes, "what I'd change", active-state marks. Never decoration.
- Fonts: IBM Plex Sans Condensed (display), IBM Plex Sans (body), IBM Plex Mono (labels, data). Self-hosted.
- Reference mockup: https://claude.ai/artifact/2ZTdgUMQzTheH9AnYDRi1z (round 2).

## Hard rules: do not make it look AI-generated
- No gradients, glow, glassmorphism, blurred blobs, particles, typing effects, cursor trails.
- No emoji, no icon-in-rounded-square grids, no bento grids, no skill bars, no logo clouds, no "10+ projects" stat rows.
- No centered hero with a pill badge and two buttons. Layout is left-aligned and grid-based.
- No Inter, Geist, Space Grotesk, or Poppins. No default `rounded-lg` on everything; the sheet uses square corners.
- No fade-up-on-scroll applied to every element. Motion must carry information (see spec §6).
- Structure must be true: section numbers, sheet numbers, and revision letters encode real order, never decoration.

## Content rules
- Cayl writes all prose. Claude may draft structure and placeholders in `[brackets]`, never final bio or case-study copy.
- Banned phrases: "passionate", "crafting", "turning ideas into reality", "Hi, I'm", "journey", "leverage". Few em dashes.
- Use concrete nouns, part numbers, dates, measured numbers.
- Only render work with `status: shipped | active`. No "coming soon", no planned projects, no empty sections.
  Shelved ideas live in `docs/spec.md` §10 Backlog, not on the site.
- Every case study has a "Decisions" section in Cayl's words and states plainly where the work was AI-assisted.
- Every image has alt text. Photos are real (headshot, bench, projects). No stock, no generated images.

## Engineering rules
- Stack: Astro (latest) + Tailwind v4 via `@tailwindcss/vite` (tokens in CSS `@theme`) + MDX content collections
  (`src/content.config.ts`, `glob()` loader). Deployed on Vercel via Git integration. Package manager: pnpm.
- Single sources of truth; everything else derives from them:
  - `src/config/site.ts`: site URL, name, contact links.
  - `src/config/nav.ts`: pages, which drive dial detents, sheet numbers, and DWG numbers.
  - `src/config/taxonomy.ts`: work categories, which drive filters, `/work/[category]` routes, and BOM values.
- New project = new folder `src/content/projects/<slug>/index.mdx` with co-located images. No other edits needed.
- Sheet DATE and case-study revision rows come from git (`git log -1 --format=%cs -- <file>`) at build time.
- Budgets: ≤60 KB JS gzipped initial per page, ≤100 KB total. Lighthouse mobile: Performance ≥90,
  Accessibility / Best Practices / SEO = 100. WCAG AA contrast in both themes.
- Every page must read correctly with JS off and with `prefers-reduced-motion: reduce`. The dial nav is
  progressive enhancement over a plain `<nav><ul><a>`.

## Commands (once scaffolded in Phase 1)
- `pnpm dev` / `pnpm build` / `pnpm preview`
- `pnpm astro check` must pass before every commit.

## Workflow
- One roadmap phase per session (spec §11). Commit at the end of each phase with the phase name in the message.
- Update `docs/spec.md` when a decision changes; keep this file short.
