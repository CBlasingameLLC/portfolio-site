# Portfolio site spec

Owner: Cayl Blasingame · Started 2026-10-03 · Reference mockup: https://claude.ai/artifact/2ZTdgUMQzTheH9AnYDRi1z

## 1. Goals
- Land a semiconductor fab / process / test internship or co-op. Secondary: embedded and hardware roles.
- Read as a hardware-first engineer who also ships software, not as a web developer.
- Personal and hand-built: real photos, real signature, Cayl's own words. Nothing that reads as template or AI output.
- Grow with Cayl: new projects and pages slot in without redesign.

## 2. Sitemap
| Route | Sheet | Content |
|---|---|---|
| `/` | 1 Index | Positioning line, CTAs (Resume, Work, Contact), 3 featured projects (Drawing view) or all work (BOM view), credentials as drawing notes |
| `/work` | 2 Work | All work, category filter, Drawing/BOM toggle |
| `/work/[category]` | 2 Work | Same, pre-filtered. Static route per taxonomy entry; no JS needed |
| `/work/[slug]` | 2.n | Case study (template §5) |
| `/about` | 3 About | Headshot, 150–250 word bio, Eagle Scout, interests, key-value facts, contact block |
| `/resume` | 4 Resume | HTML resume: experience, leadership, education, coursework, certifications (dates + verify links), PDF download |
| `/colophon` | 5 Colophon | Stack, fonts, how it's built, plain AI-assisted workflow statement |
| `/404` | — | "Open circuit": broken trace drawing, link back to Index. The one EE joke on the site |
| `/log` | later | Dated lab-log entries. Route is generated only once the first entry exists |

Contact (email, GitHub, LinkedIn) lives in every sheet's footer and on About. No phone number, no address. `mailto:` only, no form.

## 3. Content model (`src/content.config.ts`)
```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORY_KEYS } from './config/taxonomy';

const projects = defineCollection({
  loader: glob({ pattern: '**/index.mdx', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    summary: z.string().max(140),
    category: z.enum(CATEGORY_KEYS),          // engineering | software | ventures
    status: z.enum(['shipped', 'active']),    // nothing else renders, by design
    role: z.string(),
    stack: z.array(z.string()),
    started: z.coerce.date(),
    ended: z.coerce.date().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(100),           // featured sort; lower first
    cover: image().optional(),
    coverAlt: z.string().optional(),
    links: z.object({ live: z.string().url().optional(), source: z.string().url().optional() }).default({}),
    revisions: z.array(z.object({ rev: z.string(), date: z.coerce.date(), note: z.string() })).default([]),
    draft: z.boolean().default(false),        // drafts excluded from production builds
  }),
});

const log = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/log' }),
  schema: z.object({ title: z.string(), date: z.coerce.date(), tags: z.array(z.string()).default([]) }),
});

export const collections = { projects, log };
```
- Taxonomy (`src/config/taxonomy.ts`): `{ engineering: 'Engineering', software: 'Software', ventures: 'Ventures' }`.
  Adding a category = one line; filters, routes, and BOM pick it up.
- Nav (`src/config/nav.ts`): ordered list of `{ key, label, href }`. Sheet number = index + 1; DWG = `CB-00n`.
  Case studies get DWG `CB-002-A`, `-B`, ... in featured/order sequence.
- Initial projects (placeholders until Cayl writes them): 3D print farm (ventures, active), bench MCU builds
  (engineering, active), Junto Press (software, shipped), ministry website (software, shipped),
  web design service (ventures, active), app projects (software, active).
- Eagle Scout project and leadership go on `/resume`, not in `/work`, unless written up as a full case study.

## 4. Design system
### Tokens (Tailwind v4 `@theme` + CSS custom properties)
| Token | Dark (default, drafting film) | Light (vellum) | Use |
|---|---|---|---|
| `--paper` | `#0F1A26` | `#E9ECE8` | Sheet ground |
| `--ink` | `#D9E3EC` | `#14181C` | Text, frame, linework |
| `--pm` | `#8899A8` | `#535B61` | Secondary text, labels |
| `--rule` | `#34475A` | `#9AA3A6` | Hairlines, table rules |
| `--grid` | `#162536` | `#DCE1DD` | 5 mm grid |
| `--grid2` | `#1E3247` | `#C9D0CC` | 25 mm grid |
| `--acc` | `#FF7A66` | `#C2271B` | Redlines only |
- Theme: dark unless the visitor picks light (stored in `localStorage`, applied by a tiny inline head script before paint).
  Verify every pair meets WCAG AA in both themes.

### Type
- Display: IBM Plex Sans Condensed 600. Body: IBM Plex Sans 400/500. Labels and data: IBM Plex Mono 400/500.
- Scale (px): 11 label · 13 data · 15 small body · 17 body · 22 h3 · 32 h2 · clamp(28, 4.4cqi, 56) h1.
- Labels: uppercase, letter-spacing 0.08–0.1em. Body measure ≤68ch. `text-wrap: balance` on headings.

### Sheet anatomy (every page, one `SheetLayout.astro`)
1. Zone row 1–6 top and bottom, zone column A–D left and right (hidden under 640 px).
2. Frame: 1.5 px ink border; grid background (5 mm / 25 mm).
3. Header strip: Drawn by · Project · Sheet `n OF N` · Date (page's last git commit date).
4. Body.
5. Footer: signed line (Cayl's signature SVG + date) and contact links, title block (Title, DWG, Date, Rev = short
   commit hash, Scale 1:1, Sheet).

### Components
`SheetLayout`, `HeaderStrip`, `TitleBlock`, `SignedLine`, `DialNav`, `ViewToggle` (Drawing/BOM), `BomTable`,
`DetailCard`, `Redline` (revision-triangle note), `DimensionLine`, `Figure` (numbered, captioned SVG/image),
`DecisionList`, `RevisionTable`, `CrosshairReadout`.

## 5. Case-study template (`/work/[slug]`)
1. Back link to Work · Detail letter · category · title · one-line summary.
2. Fields table: Role, Stack, Status, Started/Ended, Links.
3. Sections, numbered: 1 Problem · 2 System (numbered figure: diagram exported from KiCad or draw.io as SVG) ·
   3 Decisions (D1, D2, ... each "chose X over Y because"; one entry states where AI assistance was used) ·
   4 Outcome (measured numbers only) · 5 Redlines ("what I'd change", in red) · 6 Revisions (table from frontmatter + git).
4. Screenshots and photos as numbered figures with captions.

## 6. Navigation and motion
### Dial nav (rotary selector switch)
- Desktop: 30 px rail on the left edge with detent ticks and the current sheet name. Hover/focus opens a half-dial.
  Labels fixed on the faceplate at 32° detents; the knob pointer follows the pointer angle and snaps to the nearest
  detent with a critically damped spring (k≈420, c=2√k; settles <250 ms, no overshoot). Click navigates.
- Phone (<640 px): bar at the bottom; tap opens an upward half-dial; drag and release to select.
- Keyboard: Tab to rail, Enter/arrow opens, arrows step, Enter selects, Escape closes.
- Underlying markup is `<nav><ul><li><a>`; the dial is a progressive enhancement (`client:idle` island).
- Persists across navigations with `<ClientRouter />` and `transition:persist`.
- No glow, blur, sound, or elastic bounce.

### Motion inventory
| Effect | Where | Implementation |
|---|---|---|
| Plotter draw-in | Frame lines, dimension line, figures, signature on sheet load (once per session) | CSS `scaleX/Y` + SVG `stroke-dashoffset` with `pathLength=1` |
| Sheet change | Page navigation | View Transitions (slide 24–32 px + fade) |
| Drawing ↔ BOM morph | Index, Work | Shared `view-transition-name` per project |
| BOM sort / filter | Work | View transitions reorder rows |
| CAD crosshair + mm readout | Desktop, fine pointer | Small script, `pointermove`, rAF-throttled |
| Figure highlights | Case studies | CSS scroll-driven `animation-timeline: view()` |
- Library: Motion (motion.dev) only where springs are needed (dial). Everything else is CSS. GSAP only if a specific
  case-study sequence requires it, and it must fit the JS budget.
- `prefers-reduced-motion: reduce` disables all of the above except instant state changes.

## 7. SEO, sharing, analytics
- `@astrojs/sitemap`, `robots.txt`, canonical URLs on the custom domain.
- JSON-LD `Person` (name, alumniOf/affiliation Texas State, sameAs GitHub/LinkedIn) on Index and About.
- Per-page OG images generated at build (Satori + resvg) in the title-block style.
- Vercel Web Analytics (free tier).

## 8. Hosting and domain
- Vercel Git integration: production on the default branch, preview deploys per branch.
- Domain: GitHub Student Developer Pack free domain. Before claiming, check the current Pack offers and renewal price
  (as of 2026: `.me` via Namecheap renews ~$20/yr; `.tech` ~$50/yr). Set a renewal reminder 11 months out.
- Add the apex in Vercel → set the registrar's A/CNAME records → redirect `www` to apex.
- Projects on `*.vercel.app` get subdomains: add `app.<domain>` to that Vercel project, CNAME to `cname.vercel-dns.com`.
- Site URL lives only in `src/config/site.ts` and `astro.config.mjs` `site`.

## 9. Assets from Cayl
- Headshot: natural light, plain background, shoulders up, 4:5 crop, ≥1600 px tall.
- Bench / project photos: breadboards, MCU builds, soldering, meter or scope screens, finished parts. Landscape 3:2.
- Signature: black ink on white paper, scanned at 600 dpi; converted to a single-path SVG.
- Print farm (still needed): wide shot of the farm, a printer mid-job, a failed print, the job log or dashboard.
- Resume PDF: `public/resume.pdf`, same content as `/resume`.

## 10. Backlog (not on the site until started)
- I-V curve tracer: MCU-driven parametric tester for diodes/BJTs/MOSFETs with a web plot UI.
- Print farm SPC: per-job yield, failure Pareto, control charts, Cpk on measured dimensions.
- Automated test fixture: small PCB plus pogo-pin fixture with go/no-go reporting.
- `/log` lab-log entries.

## 11. Roadmap
| Phase | Scope | Done when |
|---|---|---|
| 1 Scaffold | Astro + Tailwind v4 + MDX, tokens, `SheetLayout`, header strip, title block, dial nav, empty pages, theme toggle, Vercel project, domain | Live domain serves the empty sheets over HTTPS; `astro check` clean |
| 2 Content | Index, Work (filters + BOM), About, case-study template, 3 case studies from existing projects | Cayl has written all copy on those pages; real photos in place |
| 3 Polish | Resume (HTML + PDF), Colophon, 404, OG images, sitemap, JSON-LD, analytics, responsive and accessibility QA | Lighthouse targets met on mobile; keyboard-only and screen-reader pass |
| 4 Launch | URL on LinkedIn, GitHub profile README, resume header, email signature | Links live |
