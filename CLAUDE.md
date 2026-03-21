# ascott.io — Portfolio Site

## Overview
Personal portfolio for Andrew Scott, Senior Technical Product Manager at Arrive Logistics. Tagline: "Building Technology That Moves Freight." Positioned for Head of Product / senior PM roles in freight-tech.

## Stack
- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion (subtle, purposeful — not decorative)
- **Hosting:** Custom domain at ascott.io

## Design System

### Design Philosophy
The site follows an **editorial-minimal** aesthetic inspired by alexpikeas.com — clean, confident, warm, and human. Think Squarespace-quality polish but built custom. The design stays out of its own way and lets the work speak.

**Explicitly rejected:** Dark-mode-neon-accent developer aesthetic, "AI slop" gradients, Space Grotesk / Inter / generic SaaS styling, heavy animations, gamified UI, terminal/hacker themes.

### Color Palette (Earth Tones)
```
--color-bg:              #FAF6F1    /* warm off-white, almost parchment */
--color-bg-alt:          #F0EBE3    /* slightly deeper warm gray for cards/sections */
--color-text-primary:    #2C2C2C    /* near-black, warm */
--color-text-secondary:  #6B6560    /* warm medium gray for secondary text */
--color-accent:          #3B5F4A    /* forest green — primary accent */
--color-accent-light:    #4A7A5C    /* lighter green for hover states */
--color-accent-muted:    #E8EEEA    /* very light green wash for subtle backgrounds */
--color-sandstone:       #C4A882    /* warm tan/sandstone for borders, dividers */
--color-sandstone-light: #DDD0BE    /* lighter sandstone for subtle accents */
```

### Typography
- **Display / Headings:** DM Sans (medium/semibold weight)
- **Body:** DM Sans (regular, 400)
- **Code / Technical:** JetBrains Mono
- **Scale:** Large, confident headings with generous line-height. Body at 16-18px.

### Layout Principles
- **Whitespace-forward:** Generous padding and margins. Let content breathe.
- **Max-width container:** Content area ~1100-1200px, centered.
- **Simple top nav:** Name on left, links on right. No hamburger on desktop.
- **Card-based project grid:** Clean thumbnails, minimal text overlay. Similar to alexpikeas.com project grid.
- **Case study pages:** Narrative structure — Context → Approach → Outcome. Full-width images between text sections.

### Animation Guidelines (Framer Motion)
- Page load: gentle fade-in + slight upward translate (opacity 0→1, y 12→0, duration 0.5s)
- Staggered card reveals on scroll (staggerChildren: 0.1)
- Hover on project cards: subtle scale (1.01-1.02) + slight shadow lift
- No bouncy springs, no parallax, no scroll-jacking
- Everything should feel like a gentle exhale, not a circus

### Component Patterns
- **Material UI-inspired cards:** Subtle border-radius (8-12px), light shadow, clean padding
- **Section dividers:** Thin sandstone-colored lines or generous whitespace — never heavy borders
- **Buttons/CTAs:** Forest green background, warm white text, slight radius, no aggressive gradients
- **Tags/chips:** Muted green wash background, dark text, small radius

## Portfolio Projects
1. **Arrive Developer Portal** — Internal developer experience platform
2. **Bob / AGIS** — AI voice agent + Agent Integration Service for freight brokerage automation
3. **Spot Quoting Platform** — Real-time freight pricing engine

## Page Structure
- **Home:** Hero with name + tagline + subtitle, then project grid
- **Project pages:** Case study format (Context → Approach → Outcome)
- **About:** Brief personal narrative, professional background, photo

## Content Voice
- Slightly informal but professional — reads like a smart colleague explaining their work
- Business-readable, not overly technical
- First person where appropriate
- Confident without being boastful

## Code Standards
- Functional React components with hooks
- Tailwind utility classes; extract to component classes for repeated patterns
- Keep components small and focused
- Use TypeScript interfaces for props
- File structure: `src/components/`, `src/pages/`, `src/assets/`
