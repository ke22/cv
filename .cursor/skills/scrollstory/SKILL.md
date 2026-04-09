---
name: scrollstory
description: Build narrative-driven scroll pages (scroll story / scrollytelling). Covers sticky sections, scroll-triggered content, IntersectionObserver or GSAP ScrollTrigger, and performance. Use when the user asks for scroll story, scrollytelling, vertical scroll timeline, sticky scroll panels, or GSAP ScrollTrigger animations.
---

# Scroll Story / Scrollytelling

Guide the agent to build **narrative-driven** scroll pages: fixed/sticky panels with content that updates or animates as the user scrolls.

## When to Use This Skill

- User wants a "scroll story", "scrollytelling", or "vertical scroll timeline"
- User wants sticky panels that change content on scroll
- User mentions GSAP ScrollTrigger, scroll-jacking, or scroll-driven animations
- User wants learn-scrollstory–style or cv.html–style scroll layout

## Core Architecture

### 1. Structure Pattern

- **Sticky area**: One panel stays fixed (or sticky) while the user scrolls.
- **Scroll steps**: Sections (chapters/cards) that scroll past; when a step enters the viewport, update the sticky panel or run an animation.
- **Flow**: `header` → `hero` → `main layout` (sticky panel + scroll steps) → `outro` → `footer`.

### 2. Two Implementation Paths

| Approach | When to Use | Scroll Driver |
|----------|-------------|---------------|
| **Vanilla** | Single HTML/CSS/JS, no build, simple steps | `IntersectionObserver` on step elements, `threshold` e.g. 0.5–0.6 |
| **GSAP** | Complex timelines, scrub, pin, precise control | GSAP + ScrollTrigger (use GSAP MCP if available) |

### 3. Vanilla Quick Spec (No GSAP)

- **Observer**: `IntersectionObserver` on each step (e.g. `.story-step`), `threshold: 0.6`.
- **On intersect**: Set "active" step; update sticky panel title/body (e.g. `data-graphic-title`, `data-graphic-text`); update progress dots.
- **Sticky panel**: `position: sticky`; `top` e.g. `calc(var(--space-xl) * 1.6)`.
- **Layout**: Desktop two-column grid (sticky left, steps right); mobile single column, sticky on top (`order: -1`).

### 4. Performance

- Use **`will-change: transform`** (or `opacity`) sparingly on animated elements; remove when idle to avoid excess compositing.
- Prefer **`transform` and `opacity`** for scroll-driven animation; avoid animating `width`/`height`/`top`/`left` in hot paths.
- Throttle scroll handlers with `requestAnimationFrame` or passive listeners.

### 5. Frameworks

- **React**: Sticky + scroll steps work the same; use `useEffect` + `IntersectionObserver` or Framer Motion + GSAP.
- **Vue**: Same idea; refs + IntersectionObserver or GSAP.
- **GSAP**: Prefer ScrollTrigger for pin, scrub, and timeline; if the project has the **GSAP Master MCP** server, use it for API-accurate Timeline/ScrollTrigger code.

## Key Classes / Data (Vanilla Pattern)

- Sticky panel: `.story-graphic`, `.story-graphic__card`; content targets `[data-graphic-title]`, `[data-graphic-text]`; progress `.story-graphic__dot`, modifier `--active`.
- Steps: `.story-step`, modifier `--active`; step IDs `#chapter-1` … for anchor links.
- Back to top: `.back-to-top`, visible when `scrollY > innerHeight * 0.85`; add class e.g. `back-to-top--visible`.

## Project References

- **Vanilla example**: `learn-scrollstory/` — `index.html`, `styles.css`, `script.js`; full spec in `learn-scrollstory/PLAN.md`.
- **Full scrollytelling**: `cv.html` — multiple sections, scroll-scrub, modular CSS; `SCROLLYTELLING_GUIDE.md`, `SCROLLYTELLING_COMPONENTS.md` for React/Next patterns.

## Checklist for New Scroll Story

- [ ] Sticky panel + scroll steps structure in place
- [ ] Scroll driver: IntersectionObserver (vanilla) or GSAP ScrollTrigger
- [ ] Active step updates sticky content and progress indicators
- [ ] Responsive: two-column → single column, sticky order on small screens
- [ ] Performance: will-change/transform/opacity where needed; no layout thrashing

## Additional Resources

- GSAP MCP setup and project file index: [reference.md](reference.md)
