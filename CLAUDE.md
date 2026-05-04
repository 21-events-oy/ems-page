# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Single-page event website for **EMS – European Mining Summit**, a Bitcoin mining and energy industry conference on **23 September 2026** in Helsinki, Finland. Built with Vite + vanilla HTML/CSS/JS (no frameworks). Live at **miningsummit.eu**.

## Commands

- `npm run dev` — Start Vite dev server (hot reload) at localhost:5173
- `npm run build` — Production build to `dist/`
- `npm run preview` — Serve production build locally

No linter, formatter, or test runner is configured.

## Deployment

- **Repo**: github.com/21-events-oy/ems-page (branch: master)
- **Hosting**: Cloudflare Pages — auto-deploys on push to master (~30s)
- **Domain**: miningsummit.eu (DNS managed by Cloudflare, Always Use HTTPS enabled)
- **Config**: `wrangler.jsonc` points assets to `./dist`
- **Deploy flow**: `npm run build` → `git add` → `git commit` → `git push origin master`
- **Git author**: Use `-c user.name="assistentti" -c user.email="assistentti@users.noreply.github.com"` for commits

## Workflow Rules

- **Do NOT push after every design change.** Iterate on localhost:5173. Push to live only when explicitly told.
- **Always optimize images** before adding to public/ — use ImageMagick (`convert -resize 1920x -quality 70`)
- **Always `npm run build`** before pushing — Cloudflare serves from `dist/`

## Architecture

Single-page static site:

- `index.html` — Full page: nav, hero, about, speakers, schedule, tickets, sponsors, footer
- `style.css` — All styles (BEM methodology, CSS custom properties)
- `main.js` — Nav scroll effect, mobile toggle, countdown timer, Tito callbacks, scroll-reveal (IntersectionObserver), sponsor form submission (Formspree)
- `favicon.svg` — Hexagon SVG favicon
- `wrangler.jsonc` — Cloudflare Pages config

### Public assets

- `public/ems-logo.svg` — EMS logo (white version, ~766KB SVG)
- `public/hero-bg.jpg` — Hero background (aurora borealis)
- `public/tickets-bg.jpg` — Tickets section background (aurora borealis 3)
- `public/whitegrid.jpg` — Light sections background (geometry)
- `public/speakers/*.jpg` — 6 speaker photos (optimized, ~160KB total)
- `public/sponsors/*.png|jpg|webp` — Sponsor logos (Nordblock, Minersloop, Terahash, EBEA, BTC HEL)
- `public/deck/index.html` — Unlisted partner deck page (noindex, nofollow)
- `public/deck/partner-deck.pdf` — Partner deck PDF (~11.5MB)

## Integrations

### Tito Ticketing
- **Event**: ti.to/ems/2026
- **Widget**: Inline mode, no default CSS (`v2/with/inline/without/widget-css`)
- **Config**: `allowedEvents: ["ems/2026"]`
- **Tickets**: 3 releases styled via `nth-child` — (1) Industry Pass (green), (2) VIP (white), (3) Supreme (black)
- **Gotcha**: Adding/removing tickets in Tito shifts `nth-child` ordering — must update CSS to match
- **Gotcha**: Tito requires HTTPS for real orders. Use `development_mode` plugin for localhost testing.

### Formspree (Sponsor Form)
- **Endpoint**: formspree.io/f/mreaepwd
- **Sends**: name, email, company, tier, message fields
- **Shows**: success message on 200, error text on failure

## Conventions

- **CSS naming**: BEM — block, block__element, block--modifier (e.g. `.hero__title`, `.btn--accent`)
- **HTML**: Semantic elements (`<nav>`, `<header>`, `<section>`, `<footer>`, `<form>`) with IDs for scroll targets
- **Responsive**: Mobile-first. Base targets mobile; `@media (max-width: 768px)` handles smaller screens
- **CSS custom properties**: All tokens in `:root`
- **Fonts**: Inter (body) + JetBrains Mono (monospace accents) via Google Fonts
- **Sections use background images** at 50% opacity via `::before` pseudo-elements
- **Dark sections** (#speakers, #tickets): Aurora borealis backgrounds, white text, text shadows
- **Light sections** (#about, #schedule, #sponsors): Geometry background, dark text, glass-effect cards

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--navy` | `#002F6C` | Brand colour, dark sections, nav |
| `--white` | `#FFFFFF` | Text on dark, light sections |
| `--green` | `#00C853` | Accent colour, CTAs, highlights |
| `--teal` | `#00BFA5` | Secondary accent |
| `--font` | Inter | Body text |
| `--mono` | JetBrains Mono | Tags, timestamps, badges |

## Common Tasks

### Add a new speaker
1. Optimize photo: `convert ~/Downloads/speakers/name.jpg -resize 500x -quality 75 public/speakers/name.jpg`
2. Add HTML block inside `.speakers-grid` in index.html (copy existing `.speaker` div)
3. Update speaker count in hero stats if needed

### Add a new sponsor
1. Copy/optimize logo to `public/sponsors/`
2. Add `<a><img></a>` inside the appropriate `.sponsors-logos` div (Main Sponsor or Pioneers)
3. Link to sponsor website with `target="_blank" rel="noopener"`

### Add/remove a Tito ticket
- Tickets are styled by position using `.tito-release:nth-child(N)`
- If order changes in Tito dashboard, CSS must be updated to match
- Industry Pass = green bg/white text, VIP = white bg/navy text, Supreme = black bg/green text

### Push to live
```bash
npm run build
git add <files>
git -c user.name="assistentti" -c user.email="assistentti@users.noreply.github.com" commit -m "message"
git push origin master
```

## Known Pitfalls

- **Button visibility**: `btn--outline` has white text — invisible on light sections. Use `btn--accent` (green) or `btn--navy` (blue) instead.
- **SVG files from Downloads** often have spaces in filenames — always quote paths
- **Logo SVG is ~766KB** — too large to inline, referenced as `<img>` tag
- **`::before` pseudo-elements** on sections are used for background images — use `::after` if you need another pseudo-element
- **`overflow: hidden`** is set on sections — elements cannot visually overflow section boundaries
