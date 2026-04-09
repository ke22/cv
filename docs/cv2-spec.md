# Project Spec: CV v2 Scrollytelling (Master)

**Version:** 4.0 (Merged — Contract + Reuse)  
**Role:** Senior Frontend Engineer / AI Architect / Designer Handoff  
**Objective:** Build a responsive, interactive, and reusable Scrollytelling CV template. Single source of truth for implementation and handoff.

---

## 1. Global Architecture

### 1.1 File Structure

```
/
├── index.html (or cv-v2.html)   Main entry
├── css/
│   ├── base.css                 Reset, typography
│   ├── cv-v2-layers.css         Layout, themes, component styles
└── js/
    ├── cv-v2-layers.js          Main controller
    └── StrategyTree.js          Standalone module
```

### 1.2 The "Sticky Stage" Layout

All narrative scenes MUST adhere to this DOM structure.

- **Wrapper (`.scene`):** Relative positioning.
- **Scroll track (`.scroll-container`):** Height defines scroll-driven animation duration (e.g. 150vh, 400vh).
- **Viewport (`.sticky-stage`):**
  - `position: sticky; top: 0;`
  - **CRITICAL:** `height: 100dvh;` (fix for iOS Safari bottom bar).
  - `overflow: hidden;`

### 1.3 Dependencies (Critical)

The output HTML MUST include GSAP via CDN before the closing `</body>` tag if not using a bundler.

- **GSAP Core:** `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`
- **ScrollTrigger:** `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js`

---

## 2. Design Tokens (CSS Variables)

Define in `:root` of `css/cv-v2-layers.css`.

```css
:root {
  /* Brand */
  --c-primary-red: #d32f2f;
  --c-dark-bg: #232323;
  --c-cream-bg: #F9F7F0;

  /* Strategy Tree */
  --c-tree-root: #631515;
  --c-tree-path: #923F3F;
  --c-tree-action: #D9D9D9;
  --c-tree-action-sub: #C8C8C8;
  --c-tree-line: #525252;

  /* Typography */
  --font-primary: "Helvetica Neue", Arial, sans-serif;
  --text-dark: #232323;
  --text-white: #FFFFFF;

  /* Circles (Future Outlook) */
  --circle-small: #D65D5D;
  --circle-medium: #C44646;
  --circle-large: #9F3030;

  /* Matrix legend */
  --color-h1: #4A2323;
  --color-h2: #8B4A4A;
  --color-h3: #D68C8C;
}
```

**From Reuse Plan:** Breakpoints 768px / 1024px. Z-index scale: overlay 9999, modal 1000, nav 100, sticky 10. Default ease `power2.out`; hover 0.2–0.3s. Focus: visible ring (e.g. `outline: 2px solid var(--c-primary-red); outline-offset: 2px`).

---

## 3. Browser Compatibility Rules

1. **3D Transforms:** Add `transform-style: preserve-3d; will-change: transform;` to flip cards (`#cards`) to prevent Safari flickering.
2. **Resizing:** All JS resize listeners MUST be **debounced** (e.g. 100ms) to prevent performance thrashing.
3. **prefers-reduced-motion:** When `matchMedia("(prefers-reduced-motion: reduce)").matches`, skip scene-blur and heavy staggers; use simple fade where appropriate.

---

## 4. HTML Patterns

### 4.1 Section Skeleton

```html
<section id="SECTION_ID" class="scene scene--SECTION_NAME" data-scene="N">
  <div class="scroll-container" style="height: Xvh;">
    <div class="sticky-stage">
      <!-- content -->
    </div>
  </div>
</section>
```

### 4.2 Nav Structure

```html
<nav class="nav" aria-label="Main Navigation">
  <div class="nav__pill">
    <button class="nav__dot-btn active" data-section="intro" aria-label="Intro">
      <span class="nav__label-wrap"><span class="nav__label">Intro</span></span>
      <span class="nav__dot"></span>
    </button>
    <!-- Repeat for: cards, problem, solution, growth, contact -->
  </div>
</nav>
```

### 4.3 Mobile Modal

```html
<div class="mobile-modal" role="dialog" aria-modal="true" aria-hidden="true">
  <div class="mobile-modal__content">
    <ul class="mobile-modal__list">
      <li><a href="#intro" class="mobile-modal__link">Intro</a></li>
      <!-- Repeat for all sections -->
    </ul>
  </div>
</div>
```

### 4.4 Effect Prerequisites

| Effect | HTML requirement |
|--------|------------------|
| Letter effects | Each character in `<span class="char">` |
| Word effects | Each word in `<span class="word">` (or SplitText) |
| Hover-scale (Resources) | Block has `data-target="book-1"`; image has `id="book-1"` |
| 3D flip | Card uses `transform-style: preserve-3d`, `backface-visibility: hidden` |

---

## 5. Section Map

| Section | ID | Scroll height | Content |
|---------|-----|---------------|---------|
| Intro | `#intro` | 150vh | Hero title, desc, CTA |
| Cards | `#cards` | 400vh | 3 flip cards |
| Problem | `#problem` | 120vh | Title, subtitle |
| Future Outlook | `#future-outlook` | 400vh | 3 stats + circles |
| Solution | `#solution` | 150vh | Title, subtitle, body |
| Solution Matrix | `#solution-matrix` | 300vh | 4×4 grid, H1/H2/H3 |
| Resource Fit | `#resource-fit` | 300vh | Matrix SVG |
| Opportunity Matrix | `#opportunity-matrix` | 300vh | Matrix SVG |
| Growth | `#growth` | 150vh | Title, image |
| Strategy | `#strategy` | 250vh | Tree layout |
| Resources | `#resources` | 150vh | Text blocks + images |
| Contact | `#contact` | 100vh | Footer |

---

## 6. Component A: Strategy Tree (The Logic Engine)

**Goal:** A responsive node tree with "circuit board" style orthogonal connectors.

### 6.1 HTML Interface

Configuration passed via `data-*` attributes.

```html
<div class="tree-wrapper"
     data-line-color="#525252"
     data-line-width="1.5"
     data-turn-ratio="0.5"
     data-min-stem="20">
</div>
```

### 6.2 CSS Constraints (Functional)

- **Grid:** `grid-template-columns: 1fr 1fr 1.2fr 1.2fr`.
- **Gap:** `60px` (critical minimum).
- **Anchoring:** `.tree-col` must be `flex` + `align-items: center`.
- **Distribution:** `.col-path`, `.col-action`, `.col-indicator` use `justify-content: space-around`.
- **Card size:** `width: 100%`, `max-width: 282px`, `min-height: 94px`.

### 6.3 JS Logic (Algorithm)

Implement in `js/StrategyTree.js`.

1. **Coordinate acquisition:** Use `getBoundingClientRect()` relative to wrapper.
2. **Gap elimination:** Start `x1 - 4px`, End `x2 + 4px` (overlap).
3. **Snap-to-flat:** `IF abs(y1 - y2) < 3px THEN y2 = y1`.
4. **Smart turn:** `TurnX = x1 + Math.max(Gap * 0.5, 20px)`.
5. **Branch optimization:**
   - **Bottom branch:** Draw `M TurnX y1 L TurnX y2 L x2 y2` (no stem).
   - **Top branch:** Draw full path.

---

## 7. Component B: Resources Section (Interactive Gallery)

**Goal:** "Scroll to enter, hover to focus."

### 7.1 HTML Interface and Assets

- **Placeholder rule:** If actual book cover images are missing, MUST use `https://placehold.co/300x400` with appropriate text labels (e.g. `?text=Book+1`) so the layout is reviewable immediately.

```html
<div class="res-block" data-target="book-1">...</div>
<img id="book-1" class="res-book" src="https://placehold.co/300x400/631515/FFF?text=Design+Process" alt="Book 1">
```

### 7.2 Animation Specs (GSAP)

1. **Entrance:** ScrollTrigger at 70% viewport → staggered fly-in (`y: 200`, `rotation: 10`, `opacity: 0` → `1`).
2. **Hover:** Target scales to `1.15`, `zIndex` increases; **siblings fade** to `opacity: 0.3`.

---

## 8. Animation Registry

### 8.1 Standardized Effects (v3.1)

| Effect name | Parameters | Behavior | Target section |
|--------------|------------|----------|----------------|
| **fade-out-combo** | `target` | Scroll scrub: `y: -50`, `opacity: 0`, `blur: 10px` | Hero title exit |
| **circle-wipe** | `target`, `color` | Expand circle from center to fill screen | Future Outlook |
| **matrix-reveal** | `bg`, `bubbles` | Grid fades in 30%, bubbles `scale: 0` → `1` | Matrices |
| **tree-draw** | `paths` | `strokeDashoffset` from max to `0` | Strategy Tree |

### 8.2 Effect List (Reuse Plan, by section)

| Section | Element | Effect | Notes |
|---------|---------|--------|-------|
| Loading | Overlay | loading-green-3items | Green bg, 3 items to center |
| Intro | `.hero__title .char` | entrance-kinetic, fade-out-combo | Chars in, then move up + blur + zoom |
| Cards | `.flip-card` | 3d-flip-stagger | Flip one by one |
| Problem | `.problem__title` | fade-in | Simple fade |
| Future Outlook | `.curve-text` | running-number | 0 → 36.5, 2.99, 60.5 |
| Future Outlook | circles | circle-wipe | Numbers 0.5s fade, circles 2s expand; **simultaneous by design** (numbers disappear first) |
| Solution | `.solution-text__title .char`, `.solution-text__sub .char` | letter-highlight | Letter-by-letter on scroll |
| Solution | `.solution-text__body` | word-highlight | Word-by-word on scroll |
| Solution Matrix | #h1-group, etc. | matrix-reveal / reveal-stagger | H1 → H2 → H3 |
| Resources | `.resources__book` | fly-in-stagger | From below |
| Resources | `.resources__block` | hover-scale-target | Hover text → scale image + siblings fade |
| All sections | Boundary | scene-blur | Short blur between sections |

### 8.3 Future Outlook Wipe (Design Note)

Numbers (`.curve-text`) and circle expansion start **simultaneously** (timeline position `"<"`). Numbers fade in 0.5s, circles expand in 2s, so numbers disappear first and are not stretched. For sequential (numbers gone then circles), remove `"<"`.

---

## 9. Effect Prerequisites and Config

### 9.1 Init Order

1. `gsap.registerPlugin(ScrollTrigger)`.
2. If loading overlay: run it; onComplete → remove overlay, `ScrollTrigger.refresh()`.
3. Progress bar, nav active state, mobile modal handlers.
4. Effect assignments (from config).
5. `ScrollTrigger.refresh()` after any dynamic content.

### 9.2 Config Array Format

```javascript
[
  { effect: "loading-green-3items", selector: ".loading-overlay" },
  { effect: "fade-out-combo", selector: "#intro .hero__title .char", section: "#intro" },
  { effect: "3d-flip-stagger", selector: "#cards .flip-card", section: "#cards" },
  { effect: "running-number", selector: "#future-outlook .curve-text", values: [36.5, 2.99, 60.5] },
  { effect: "letter-highlight", selector: "#solution .solution-text__title .char" },
  { effect: "letter-highlight", selector: "#solution .solution-text__sub .char" },
  { effect: "word-highlight", selector: "#solution .solution-text__body" },
  { effect: "fly-in-stagger", selector: "#resources .resources__book" },
  { effect: "hover-scale-target", selector: "#resources .resources__block", targetAttr: "data-target" },
  { effect: "scene-blur", global: true },
]
```

### 9.3 Fallbacks

- Check `document.querySelectorAll(selector).length` before binding effects.
- No-op when section or element is missing.

---

## 10. SEO and AEO Strategy

1. **JSON-LD:** Inject `script type="application/ld+json"` with `Person` schema.
2. **Alt text:** Ensure all placeholder images have descriptive `alt` tags.

---

## 11. Assets

### 11.1 Placeholder Rule (v3.1)

Resources section: when no real image, MUST use `placehold.co` (see Component B).

### 11.2 [PLACEHOLDER — replace] Loading Overlay

Three elements (e.g. circles or icons) on green background; animate to center then fade out. Replace with final design.

### 11.3 [PLACEHOLDER — replace] Growth Section Image

Use `./img/Group%2029.svg` or equivalent. If missing, use minimal SVG or placeholder until asset exists.

### 11.4 [PLACEHOLDER — replace] Resource Fit / Opportunity Matrix SVGs

Copy full inline SVGs from existing cv-v2.html or export from design tool. Minimal placeholder acceptable for layout review only.

---

## 12. Implementation Checklist (For Cursor)

**Step 1: Setup and CSS refactor**

- [ ] Create project structure.
- [ ] **Critical:** Add GSAP CDN links to HTML.
- [ ] Define CSS variables and replace `100vh` with `100dvh` for sticky viewport.

**Step 2: Strategy Tree module**

- [ ] Create `js/StrategyTree.js` implementing the 4px overlap + half-half turn logic.

**Step 3: Interaction logic**

- [ ] Use placeholder images (placehold.co) for Resources section when assets missing.
- [ ] Implement hover + ScrollTrigger logic in `js/cv-v2-layers.js`.

**Step 4: Final polish**

- [ ] Add JSON-LD block.
- [ ] Verify mobile stack (e.g. 1024px / 768px).

### Testing Checklist

- [ ] Scroll through all sections smoothly.
- [ ] Progress bar fills with scroll.
- [ ] Nav dot highlights correct section.
- [ ] Mobile modal opens and closes.
- [ ] All effects run without console errors.
- [ ] Test at 768px width.
- [ ] Test with prefers-reduced-motion enabled.
- [ ] Keyboard navigation (Tab, Enter).

### Designer Handoff Checklist

- [ ] Replace all [ADJUST] and [PLACEHOLDER] items.
- [ ] Update colors, typography, spacing to brand.
- [ ] Replace copy and final assets.
- [ ] Adjust effect assignments if needed.

---

## 13. Senior Review Summary

**Strengths:** Single spec for contract and reuse; MUST/CRITICAL rules explicit; full section map and effect list; Strategy Tree algorithm implementable; placehold.co and 100dvh close common gaps.

**Risks and mitigations:** SplitText (word highlight) optional — document manual `.word` spans or build-time split. Large SVGs — reference copy-from cv-v2 or external asset. Resize debounce and prefers-reduced-motion reduce thrash and respect a11y.

**Verdict:** Approved for handoff. Document is self-contained and usable by Cursor or a designer to implement or adapt the cv-v2 page.

---

**End of Spec**
