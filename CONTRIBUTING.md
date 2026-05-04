# EMS Website Development Guide

Comprehensive documentation for contributors and AI agents working on the **European Mining Summit** website.

**Live site**: https://miningsummit.eu
**Repository**: https://github.com/21-events-oy/ems-page
**Event date**: 23 September 2026, Helsinki, Finland

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack & Architecture](#tech-stack--architecture)
3. [Local Development](#local-development)
4. [Design System](#design-system)
5. [Page Sections](#page-sections)
6. [Adding Speakers](#adding-speakers)
7. [Managing Sponsors](#managing-sponsors)
8. [Tito Ticketing Integration](#tito-ticketing-integration)
9. [Sub-pages (Deck & FAQ)](#sub-pages-deck--faq)
10. [Testing Checklist](#testing-checklist)
11. [Deployment Workflow](#deployment-workflow)
12. [Git Commit Guidelines](#git-commit-guidelines)
13. [Known Pitfalls](#known-pitfalls)

---

## Project Overview

EMS is a single-page static website for a Bitcoin mining and energy industry conference. The site features:

- Event information and countdown timer
- Speaker profiles
- Schedule with expandable themes
- Tito-powered ticket sales
- Sponsor showcase with inquiry form
- Embedded Canva presentations for /deck and /faq

---

## Tech Stack & Architecture

| Component | Technology |
|-----------|------------|
| Build tool | Vite 7.x |
| Languages | Vanilla HTML, CSS, JavaScript (ES modules) |
| Fonts | Inter (body), JetBrains Mono (monospace) via Google Fonts |
| Ticketing | Tito (inline widget, custom styled) |
| Forms | Formspree |
| Hosting | Cloudflare Pages |
| Domain | miningsummit.eu (Cloudflare DNS) |

### File Structure

```
ems-page/
├── index.html          # Main page (all sections)
├── style.css           # All styles (BEM methodology)
├── main.js             # JavaScript functionality
├── favicon.svg         # SVG favicon
├── wrangler.jsonc      # Cloudflare Pages config
├── package.json        # npm scripts
├── CLAUDE.md           # AI agent instructions
├── CONTRIBUTING.md     # This file
├── public/             # Static assets (copied to dist/)
│   ├── ems-logo.svg    # Main logo (~766KB)
│   ├── hero-bg.jpg     # Hero aurora background
│   ├── tickets-bg.jpg  # Tickets section background
│   ├── whitegrid.jpg   # Light sections background
│   ├── favicon.png     # PNG favicon
│   ├── speakers/       # Speaker photos (*.jpg)
│   ├── sponsors/       # Sponsor logos (*.png, *.jpg, *.webp)
│   ├── deck/           # Partner deck page
│   │   └── index.html  # Canva embed
│   └── faq/            # FAQ page
│       └── index.html  # Canva embed
└── dist/               # Production build output
```

---

## Local Development

### Setup

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev
# Opens at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Rules

1. **Iterate locally** — Do NOT push after every change. Test thoroughly at localhost:5173
2. **Always build before pushing** — Run `npm run build` before any push
3. **Optimize images** — Use ImageMagick before adding to public/:
   ```bash
   # For backgrounds (max 1920px wide)
   convert ~/Downloads/image.jpg -resize 1920x -quality 70 public/image.jpg

   # For speaker photos (500px wide)
   convert ~/Downloads/speaker.jpg -resize 500x -quality 75 public/speakers/name.jpg

   # For sponsor logos (preserve aspect, max 300px)
   convert ~/Downloads/logo.png -resize 300x300\> public/sponsors/name.png
   ```

---

## Design System

### Color Palette

| Token | Hex Value | CSS Variable | Usage |
|-------|-----------|--------------|-------|
| Navy | `#002F6C` | `--navy` | Primary brand, dark sections, navigation |
| Navy Dark | `#001F4A` | `--navy-dark` | Footer, darker accents |
| Navy Light | `#003D8F` | `--navy-light` | Hover states |
| White | `#FFFFFF` | `--white` | Text on dark, light section backgrounds |
| Off-white | `#F4F7FA` | `--off-white` | Subtle backgrounds |
| Green | `#00C853` | `--green` | Primary accent, CTAs, highlights, countdown |
| Green Dark | `#00A843` | `--green-dark` | Hover states for green buttons |
| Teal | `#00BFA5` | `--teal` | Secondary accent, glow effects |
| Gray 100 | `#E8ECF1` | `--gray-100` | Borders, dividers |
| Gray 200 | `#C5CDD8` | `--gray-200` | Input borders |
| Gray 400 | `#7B8CA3` | `--gray-400` | Muted text, labels |
| Gray 600 | `#4A5568` | `--gray-600` | Body text on light |

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Body text | Inter | 400 | 1rem (16px base) |
| Headings | Inter | 700-800 | clamp() responsive |
| Tags/Labels | JetBrains Mono | 500 | 0.8-0.85rem |
| Countdown | JetBrains Mono | 700 | 2rem |

### Spacing & Layout

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | 8px | Buttons, inputs, small cards |
| `--radius-lg` | 16px | Cards, sections |
| Container | max-width: 1120px | Content wrapper |
| Section padding | 100px (64px mobile) | Vertical rhythm |

### Button Variants

```css
.btn--accent    /* Green background, dark text — PRIMARY CTA */
.btn--navy      /* Navy background, white text — secondary on light sections */
.btn--outline   /* Transparent, white border — dark sections ONLY */
.btn--sm        /* Smaller padding for nav/footer */
.btn--lg        /* Larger padding for hero CTAs */
.btn--full      /* Full width */
```

**Important**: `btn--outline` has white text and is INVISIBLE on light sections. Use `btn--accent` or `btn--navy` instead.

### Section Types

| Section | Background | Text Color | CSS Class |
|---------|------------|------------|-----------|
| Hero | Navy gradient + aurora bg | White | `.hero` |
| About | White + geometry bg | Navy | `.section` |
| Speakers | Navy + aurora bg | White | `.section.section--dark` |
| Schedule | White + geometry bg | Navy | `.section` |
| Tickets | Navy + aurora bg | White | `.section.section--dark` |
| Sponsors | White + geometry bg | Navy | `.section` |
| Footer | Navy dark | White (50% opacity) | `.footer` |

---

## Page Sections

### Navigation (`#nav`)

- Fixed position, transparent initially
- Scrolls 40px: becomes `.nav--scrolled` (pill shape, blurred background)
- Mobile: hamburger menu toggles `.nav__links.open`
- Links: About, Speakers, Schedule, Sponsors, FAQ, Pitch Deck, Get Tickets

### Hero (`#hero`)

- Full viewport height
- Aurora borealis background image (50% opacity)
- Animated green glow orbs
- EMS logo (large)
- Event date tag (JetBrains Mono, green)
- Title: "European Mining Summit"
- Subtitle: Event description
- EBEA partner logo
- **Countdown timer** — counts down to `2026-09-23T08:00:00+03:00` (Helsinki time)
- CTA buttons: "Get Your Tickets" + "Pitch Deck"
- Stats: Attendees (200), Speakers (21), Days (1), Connections (∞)

### About (`#about`)

- Light section with geometry background
- 4 feature cards (glass effect):
  - Sustainable Hashpower
  - European Advantage
  - Industry Network
  - Data-Driven Insights
- Event details card: Date, Location, Format, Audience

### Speakers (`#speakers`)

- Dark section with aurora background
- Grid of speaker cards (3 columns desktop, 2 mobile)
- Each card: photo (3:4 aspect ratio), gradient overlay, name + role
- Green accent bar above name
- Note text with link to tickets

**Current speakers** (in order):
1. Rachel Geyer — Chairman, European Bitcoin Energy Association
2. Robert Schulman — Chairman, Minersloop
3. Jaakko Kaijala — Co-founder, Nordblock
4. Kasimir Kaitue — Co-founder, Nordblock
5. Thomas Brand — Chief Research Officer, Coinmotion
6. Roni Karjalainen — CEO, Minersloop

### Schedule (`#schedule`)

- Light section
- Three expandable theme accordions:
  1. Grid Stabilisation
  2. Decarbonized Heat
  3. Monetizing Surplus Energy
- Each accordion shows "Speaking schedule will be released soon"
- "Full schedule will be released soon" note

### Tickets (`#tickets`)

- Dark section with aurora background
- Tito widget (`ems/2026` event)
- Two ticket types styled by position:
  - **1st child (Industry Pass)**: White background, navy text, navy border
  - **2nd child (VIP)**: Black background, white text
- Classic ticket shape with notch cutouts (CSS mask)
- Completion message shown after purchase

### Sponsors (`#sponsors`)

- Light section
- Two tiers:
  - **Main Sponsor**: Minersloop (larger logo)
  - **Pioneers**: Nordblock, Terahash, EBEA
- "Become a Sponsor" form (Formspree):
  - Fields: Name, Email, Company, Tier (dropdown), Message
  - Tiers: Pioneer, Early Adopter, Early Majority, Custom Partnership
- Success overlay on submission

### Footer

- Navy dark background
- EMS logo
- Event date
- FAQ + Pitch Deck buttons
- Copyright
- BTC HEL organizer credit + logo

---

## Adding Speakers

### Step 1: Prepare the photo

```bash
# Optimize to 500px width, 75% quality
convert ~/Downloads/speakers/firstname-lastname.jpg \
  -resize 500x -quality 75 \
  public/speakers/firstnamelastname.jpg
```

Naming convention: `firstnamelastname.jpg` (lowercase, no spaces or hyphens)

### Step 2: Add HTML block

In `index.html`, inside `.speakers-grid` (after the last `.speaker` div):

```html
<div class="speaker">
  <img src="/speakers/firstnamelastname.jpg" alt="First Last" class="speaker__photo" />
  <div class="speaker__info">
    <h3 class="speaker__name">First Last</h3>
    <p class="speaker__role">Title, Company</p>
  </div>
</div>
```

### Step 3: Update hero stats

If speaker count changes, update the hero stats:

```html
<span class="hero__stat-value">22</span>  <!-- was 21 -->
```

---

## Managing Sponsors

### Adding a new sponsor

#### Step 1: Prepare the logo

```bash
# Optimize logo (preserve aspect ratio, max 300px)
convert ~/Downloads/sponsor-logo.png \
  -resize 300x300\> -quality 85 \
  public/sponsors/sponsorname.png
```

Accepted formats: `.png`, `.jpg`, `.webp`

#### Step 2: Add to appropriate tier

**Main Sponsor** (in `index.html`):
```html
<div class="sponsor-category">
  <h3 class="sponsor-category__title">Main Sponsor</h3>
  <div class="sponsors-logos">
    <a href="https://sponsorwebsite.com" target="_blank" rel="noopener">
      <img src="/sponsors/sponsorname.png" alt="Sponsor Name" class="sponsors-logos__img sponsors-logos__img--main" />
    </a>
  </div>
</div>
```

**Pioneers tier**:
```html
<div class="sponsors-logos">
  <!-- existing sponsors -->
  <a href="https://newsponsorswebsite.com" target="_blank" rel="noopener">
    <img src="/sponsors/newsponsor.png" alt="New Sponsor" class="sponsors-logos__img" />
  </a>
</div>
```

### Current sponsors

| Sponsor | Tier | Logo file | Website |
|---------|------|-----------|---------|
| Minersloop | Main | minersloop.jpg | minersloop.com |
| Nordblock | Pioneer | nordblock.png | nordblock.fi |
| Terahash | Pioneer | terahash.jpg | terahash.com |
| EBEA | Pioneer | ebea.webp | ebea.work |
| BTC HEL | Organizer (footer) | btchel.png | btchel.com |

---

## Tito Ticketing Integration

### Configuration

Tito is loaded in `index.html` head:

```html
<script src='https://js.tito.io/v2/with/inline/without/widget-css' async></script>
<script>
  window.tito = window.tito || function() {
    (tito.q = tito.q || []).push(arguments);
  };
  tito("config.set", {
    allowedEvents: ["ems/2026"]
  });
</script>
```

### Event callbacks (in `main.js`)

```javascript
tito('on:widget:loaded', function() {
  console.log('[tito] Widget loaded successfully');
});

tito('on:registration:finished', function(data) {
  // Show completion message
  document.getElementById('tito-completion').classList.add('show');
});
```

### Ticket styling

Tickets are styled by CSS position using `.tito-release:nth-child(N)`:

| Position | Ticket | Background | Text | Border |
|----------|--------|------------|------|--------|
| 1st | Industry Pass | White `#ffffff` | Navy | Gray `#e0e0e0` |
| 2nd | VIP | Black `#1a1a1a` | White | Dark `#333` |

**Critical**: If tickets are added/removed in Tito dashboard, the CSS `nth-child` selectors must be updated to match the new order.

### Testing tickets locally

Tito requires HTTPS for real transactions. For local testing:

1. Add `development_mode` plugin in Tito dashboard, OR
2. Test on deployed site (Cloudflare provides HTTPS)

### Tito dashboard

- **Event URL**: https://ti.to/ems/2026
- **Manage tickets**: ti.to dashboard → ems/2026 → Tickets

---

## Sub-pages (Deck & FAQ)

Both pages are Canva embeds served from `public/`:

| Page | Path | Canva ID |
|------|------|----------|
| Pitch Deck | `/deck` | `DAG_y8C7FsU` |
| FAQ | `/faq` | `DAHC_PNO608` |

### Structure

```html
<!-- public/deck/index.html or public/faq/index.html -->
<div style="...container styles...">
  <div style="...16:9 aspect ratio wrapper...">
    <iframe src="https://www.canva.com/design/[CANVA_ID]/view?embed" ...></iframe>
  </div>
</div>
```

### Updating Canva presentations

1. Edit the presentation in Canva
2. Get the new embed code from Canva (Share → Embed)
3. Replace the `src` URL in the respective `index.html`

---

## Testing Checklist

Before pushing any changes, verify the following:

### Visual/Layout Tests

- [ ] **Responsive design**: Test at 320px, 768px, 1024px, 1440px widths
- [ ] **Navigation**: Links scroll to correct sections
- [ ] **Mobile menu**: Hamburger opens/closes, links close menu
- [ ] **Nav scroll effect**: Background appears after 40px scroll
- [ ] **Images load**: All speaker photos, sponsor logos, backgrounds visible
- [ ] **No horizontal scroll**: Body doesn't overflow on any viewport

### Functional Tests

- [ ] **Countdown timer**: Shows correct time remaining to event
- [ ] **Schedule accordions**: Each theme expands/collapses independently
- [ ] **Tito widget loads**: Ticket options appear (may take 1-2 seconds)
- [ ] **Sponsor form submits**: Shows success message on valid submission
- [ ] **External links**: Open in new tab (`target="_blank"`)

### Link Tests

Run these checks:

| Link | Expected destination |
|------|---------------------|
| `#about` | Scrolls to About section |
| `#speakers` | Scrolls to Speakers section |
| `#schedule` | Scrolls to Schedule section |
| `#sponsors` | Scrolls to Sponsors section |
| `#tickets` | Scrolls to Tickets section |
| `/deck` | Opens pitch deck Canva embed |
| `/faq` | Opens FAQ Canva embed |
| Sponsor logos | Open sponsor websites in new tab |
| EBEA hero logo | Opens ebea.work in new tab |
| BTC HEL footer logo | Opens btchel.com in new tab |

### Media Tests

| Element | Check |
|---------|-------|
| Speaker photos | 3:4 aspect ratio, no distortion |
| Sponsor logos | Centered, proper max-width, hover scale works |
| Hero background | Covers section, no tiling |
| Section backgrounds | 50% opacity, no overlap issues |

### Browser Tests

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if available)
- [ ] Mobile Safari / Chrome on phone

---

## Deployment Workflow

### Standard deploy

```bash
# 1. Build production assets
npm run build

# 2. Stage changed files (be specific)
git add index.html style.css main.js public/

# 3. Commit with descriptive message
git -c user.name="assistentti" \
    -c user.email="assistentti@users.noreply.github.com" \
    commit -m "Add new speaker: John Doe

- Added speaker photo (public/speakers/johndoe.jpg)
- Added speaker card to speakers grid
- Updated speaker count in hero stats (21 → 22)"

# 4. Push to trigger deploy
git push origin master
```

Cloudflare Pages auto-deploys in ~30 seconds.

### Verify deployment

1. Check https://miningsummit.eu
2. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R) to bypass cache
3. Verify changes appear correctly

---

## Git Commit Guidelines

### Commit message format

```
<type>: <short summary>

<detailed description if needed>

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

### Types

| Type | Usage |
|------|-------|
| `feat` | New feature (speaker, sponsor, section) |
| `fix` | Bug fix |
| `style` | CSS/visual changes only |
| `content` | Text/copy changes |
| `refactor` | Code restructuring (no behavior change) |
| `chore` | Maintenance (deps, config) |

### Examples

```bash
# Adding a speaker
git commit -m "feat: Add Thomas Brand as speaker

- Added optimized photo (39KB)
- Added to speakers grid with role: Chief Research Officer, Coinmotion

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

# Fixing styling issue
git commit -m "fix: Correct mobile nav menu z-index

Menu was appearing behind hero section on iOS Safari.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

# Updating sponsor
git commit -m "feat: Add Acme Corp as Pioneer sponsor

- Logo optimized to 45KB PNG
- Links to acmecorp.com

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

### GitHub comment on changes

When pushing changes, you can add detailed PR-style comments using:

```bash
# For significant changes, create a detailed commit body
git commit -m "$(cat <<'EOF'
feat: Redesign tickets section with classic ticket shape

## Changes
- Added CSS mask for ticket notch cutouts
- Implemented dashed inner border
- Updated color scheme: Industry Pass (white), VIP (black)

## Testing
- Verified on Chrome, Firefox, Safari
- Tested responsive at 320px, 768px, 1024px
- Confirmed Tito widget still functional

## Screenshots
See PR for before/after comparison

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Known Pitfalls

### CSS Issues

| Issue | Solution |
|-------|----------|
| `btn--outline` invisible on light sections | Use `btn--accent` or `btn--navy` instead |
| Elements overflow sections | `overflow: hidden` is set on sections — design within bounds |
| Need additional pseudo-element | `::before` is used for backgrounds — use `::after` instead |
| Tito ticket styling breaks | If Tito ticket order changes, update CSS `nth-child` selectors |

### Asset Issues

| Issue | Solution |
|-------|----------|
| Large images slow page | Always optimize with ImageMagick before adding |
| SVG files have spaces in name | Quote all file paths when using command line |
| Logo too large to inline | ems-logo.svg is ~766KB — always use as `<img>` tag |

### Development Issues

| Issue | Solution |
|-------|----------|
| Changes not appearing | Run `npm run build` before pushing |
| Tito not working locally | Requires HTTPS — test on deployed site |
| Formspree not working locally | CORS may block — test on deployed site |

### Git Issues

| Issue | Solution |
|-------|----------|
| Wrong git author | Use `-c user.name="assistentti" -c user.email="..."` flags |
| Forgot to build | Always run `npm run build` before `git add` |
| Pushed broken changes | Fix immediately and push again (no force push needed) |

---

## Quick Reference

### Important URLs

| Resource | URL |
|----------|-----|
| Live site | https://miningsummit.eu |
| GitHub repo | https://github.com/21-events-oy/ems-page |
| Tito event | https://ti.to/ems/2026 |
| Formspree endpoint | https://formspree.io/f/mreaepwd |
| Cloudflare dashboard | https://dash.cloudflare.com |

### Key CSS selectors

```css
.section              /* Light section base */
.section--dark        /* Dark (navy) section */
.btn--accent          /* Green CTA button */
.btn--navy            /* Navy button for light sections */
.btn--outline         /* Outline button (dark sections only!) */
.speaker              /* Speaker card */
.sponsors-logos__img  /* Sponsor logo */
.sponsors-logos__img--main  /* Main sponsor (larger) */
.tito-release:nth-child(1)  /* First ticket type */
.tito-release:nth-child(2)  /* Second ticket type */
```

### Event details

- **Date**: Wednesday, 23 September 2026
- **Time**: 08:00 EEST (Europe/Helsinki)
- **Location**: Helsinki, Finland
- **Capacity**: 200 attendees
- **Organizer**: BTC HEL Crew
- **Partner**: EBEA (European Bitcoin Energy Association)
