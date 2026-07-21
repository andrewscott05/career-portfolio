# ascott.io — Portfolio Site

## Overview
Personal portfolio for Andrew Scott, Senior Technical Product Manager focused on AI & automation in freight-tech. Single scrolling home page plus case-study pages. Positioned for Head of Product / senior PM roles.

## Stack
- **Framework:** React 19 + Vite 7
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (`@theme` in `src/index.css`)
- **Animation:** Framer Motion (subtle, purposeful — not decorative)
- **Routing:** react-router-dom v7
- **Hosting:** Custom domain at ascott.io

## Design System — "Grawlix Refined" (neo-brutalist, earth-toned)

### Design Philosophy
Confident neo-brutalist editorial: heavy display type, hard offset shadows, thick black borders, zero border-radius, on a warm cream ground. The layout is bold and structural — type and hard-edged blocks do the work; no gradients, no soft glassmorphism, no decoration for its own sake. Warm, human, and direct.

**Explicitly rejected:** soft Material-UI rounded cards, blurred drop-shadows, dark-mode-neon, "AI slop" gradients, generic SaaS styling (Inter/Roboto/Space Grotesk), bouncy/parallax animation.

### Color Palette (Earth Tones)
```
--color-bg:            #F5F2EA   /* cream page ground */
--color-surface:       #FFFFFF   /* card white */
--color-ink:           #191713   /* near-black — text, borders, dark blocks */
--color-text:          #191713   /* primary text */
--color-text-secondary:#4A463C   /* muted body text */
--color-text-muted:    #A09A8C   /* mono metadata / faint labels */
--color-primary:       #2C5138   /* forest green — primary accent */
--color-secondary:     #B07D3F   /* warm ochre — secondary accent */
--color-ink-subtext:   #C9C3B4   /* subtext on dark ink blocks */
--color-hairline:      #E0DCD0   /* card-chrome hairline */
```

### Typography
- **Display / Headings:** **Archivo Black** (single weight 400), used UPPERCASE with tight tracking (-0.02em).
- **Running prose / body:** **Newsreader** (serif, 400 / 500 + italic 400) via the `font-serif` utility — the warm, human counter to the bold display type. This is the default `body` font.
- **Labels / metadata / mono detail:** **IBM Plex Mono** (400 / 500 / 600) via `font-mono` — kicker `//` labels, nav, tags, eyebrows, Role/Team values, dates, skills tokens. Mono is kept only for small technical detail, never for running prose.
- Google Fonts: `Archivo+Black`, `IBM+Plex+Mono:wght@400;500;600`, and `Newsreader:ital,opsz,wght`.
- Scale (px): hero H1 ~88 / line-height 0.98; contact H2 ~38; case-study H3 ~30; metric numbers ~44; kicker labels 12 (letter-spacing 0.12em, uppercase); serif body 15–18 / line-height 1.6–1.7; mono labels 11–13.
- **Punctuation:** no em dashes anywhere in copy — use colons, commas, or full stops.

### Structure & Effects (the signature look)
- **Borders:** `3px solid #191713` on cards and blocks.
- **Shadows — hard offset, NO blur:** `6px 6px 0`, `8px 8px 0`, `10px 10px 0`. Shadow color varies by element: `#191713` default, `#2C5138` on the hero CTA, `#B07D3F` on case-study cards.
- **Border-radius: 0** everywhere. No rounding.
- **Kicker labels:** IBM Plex Mono, 12px, uppercase, forest-green (e.g. `BUILT & SHIPPED`). No `//` prefix, it read as a code comment.
- **Container:** ~1100px max content width, ~56px side padding, ~84px vertical rhythm between sections.

### Animation Guidelines (Framer Motion) — optional, keep minimal
- Gentle fade-in + slight upward translate on load (opacity 0→1, y 12→0, ~0.5s).
- Offset-shadow "press" on button hover: translate element +2px/+2px and shrink shadow to `4px 4px 0`.
- No springs, no parallax, no scroll-jacking.

## Page Structure (build to match `Portfolio Redesign.dc.html`, section `#3a`)
Single scrolling home page, top to bottom:
1. **Nav** — `border-bottom: 3px solid #191713`. Left: wordmark `A. SCOTT` with a green `*`. Right: Work / Experience / About links (IBM Plex Mono 13px) + solid ink "Resume ↓" button.
2. **Hero** — mono kicker (`ANDREW SCOTT · TECHNICAL PRODUCT LEADER · AUSTIN, TX`); H1 "Manual ops is a `#$%&!` mess." with the grawlix span in green; supporting paragraph; two buttons — "Download resume" (ink fill, green offset shadow) + "LinkedIn" (cream fill, ink offset shadow).
3. **By the numbers** — `// BY THE NUMBERS`; 3-up grid of white cards (ink border, ink offset shadow), green metric numbers: 20K+, $227M, 40%.
4. **Built & shipped** — `// BUILT & SHIPPED`; two case-study cards (white, ink border, **ochre** offset shadow) each with problem/build/result in a 3-col grid + ochre "Read the case study →"; then a dark ink strip for the Developer Portal secondary project with an ochre "Visit →".
5. **About** — `// ABOUT`; 2-col grid, two mono paragraphs of voice.
6. **Experience** — `// EXPERIENCE`; 3 rows (Arrive Logistics, Global Resale, General Motors) separated by `3px solid #191713` rules; company in Archivo Black, role/dates in mono.
7. **Contact** — full forest-green block, ink border, `10px 10px 0 #191713` shadow; H2 "Let's build something people rely on." (ochre on second phrase); paragraph; ochre email button (`ascott1296@gmail.com`).

Existing components in `src/components/` (Hero, About, Experience, Contact, WhatImBuilding, Skills, Writing) should be re-skinned to this system; `Skills`/`Writing` can be dropped if not represented in 3a. Data stays in `src/data/`.

## Content Voice
Confident, plain, and direct — one signature bit of edge (the hero grawlix), otherwise no gimmicks. Business-readable, first person where natural, confident without boasting. All final copy lives in `#3a` of `Portfolio Redesign.dc.html` — lift verbatim.

## Assets
None — no images/icons. All weight comes from type, color, borders, and hard shadows. Grawlix `#$%&!` is plain text. Supply a real resume PDF and LinkedIn URL at implementation.

## Code Standards
- Functional React components with hooks; TypeScript interfaces for props.
- Tailwind v4 utilities driven by the `@theme` tokens in `src/index.css` (see `index.css.snippet` in this folder for the replacement `@theme` block).
- Keep components small and focused. File structure: `src/components/`, `src/pages/`, `src/data/`.
