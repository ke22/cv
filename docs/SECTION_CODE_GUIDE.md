# CV-v2 Section Code Guide

> Reference for HTML, CSS, and JavaScript code in each cv-v2 section. Use when building a live-view dashboard or adjusting section properties.

## Overview

### Sticky Stage Layout Pattern

All sections use the same DOM structure:

```
.scene (wrapper)
└── .scroll-container (height: Xvh — controls scroll distance)
    └── .sticky-stage (position: sticky; height: 100dvh)
        └── section-specific content
```

- **Scroll height** (`style="height: Xvh;"` on `.scroll-container`): Determines how much scrolling before the next section.
- **`100dvh`**: Critical for iOS Safari bottom bar; see [cv2-spec.md](cv2-spec.md) Section 1.2.

### File Map

| File | Purpose |
|------|---------|
| [../cv-v2.html](../cv-v2.html) | Main HTML; all section markup |
| [../css/cv-v2-layers.css](../css/cv-v2-layers.css) | Layout, scene backgrounds, component styles |
| [../css/base.css](../css/base.css) | CSS variables (tokens) in `:root` |
| [../js/cv-v2-layers.js](../js/cv-v2-layers.js) | GSAP ScrollTrigger, effect init functions |
| [../js/StrategyTree.js](../js/StrategyTree.js) | Strategy tree SVG layout (Section 10) |

See [cv2-spec.md](cv2-spec.md) Section 5 for the full Section Map.

---

## Section 1: Intro

### HTML Structure

```html
<section id="intro" class="scene scene--intro" data-scene="1">
  <div class="scroll-container" style="height: 150vh;">
    <div class="sticky-stage">
      <div class="hero">
        <h1 class="hero__title hero__title--kinetic" aria-label="CV">
          <span class="char">C</span><span class="char">V</span><span class="char">C</span>...
        </h1>
        <p class="hero__desc">Yulin Cho</p>
        <a href="#contact" class="hero__cta">View the Guidelines</a>
      </div>
    </div>
  </div>
</section>
```

- **`.char`** spans: Each character wrapped for GSAP kinetic animation.
- **`hero__title--kinetic`**: Marks the title for character-by-character entrance.

### Key Classes

| Class | File | Purpose |
|-------|------|---------|
| `.scene--intro` | cv-v2-layers.css | Background `var(--bg-cream)` |
| `.hero` | cv-v2-layers.css | Flex column, centered |
| `.hero__title`, `.hero__desc`, `.hero__cta` | cv-v2-layers.css | Typography, CTA button |
| `.hero__title .char` | cv-v2-layers.css | `display: inline-block` for animation |

### CSS (excerpt)

```css
.scene--intro { background-color: var(--bg-cream); color: var(--text-dark); }
.hero { text-align: center; display: flex; flex-direction: column; align-items: center; gap: var(--space-md); }
.hero__title { font-size: clamp(3rem, 10vw, 8rem); line-height: 1; font-weight: 800; white-space: nowrap; }
.hero__cta { background: var(--red-primary); color: #fff; border-radius: var(--radius-pill); ... }
```

### JavaScript

Kinetic title entrance in `cv-v2-layers.js` (lines 70–86):

```javascript
gsap.from(titleChars, {
  y: 100, opacity: 0, rotate: 15,
  stagger: staggerDur, duration: 1, ease: "back.out(1.7)",
  scrollTrigger: { trigger: "#intro", start: "top 60%" }
});
```

- `staggerDur`: 0.05 (or 0 if `prefersReducedMotion`).
- `start: "top 60%"`: Animation starts when intro top reaches 60% of viewport.

### Tunable Properties

| Property | Location | Example |
|----------|----------|---------|
| Scroll height | HTML inline | `150vh` |
| Background | cv-v2-layers.css | `var(--bg-cream)` |
| Title size | cv-v2-layers.css | `clamp(3rem, 10vw, 8rem)` |
| CTA color | cv-v2-layers.css | `var(--red-primary)` |
| Entrance: y | cv-v2-layers.js | `100` |
| Entrance: stagger | cv-v2-layers.js | `staggerDur` (0.05) |
| Entrance: start | cv-v2-layers.js | `"top 60%"` |

---

## Section 2: Cards

### HTML Structure

```html
<section id="cards" class="scene scene--cards" data-scene="cards">
  <div class="scroll-container" style="height: 400vh;">
    <div class="sticky-stage">
      <div class="flip-cards-grid">
        <div class="flip-card-wrapper" data-card="1">
          <div class="flip-card">
            <div class="flip-card__front">...</div>
            <div class="flip-card__back">...</div>
          </div>
        </div>
        <!-- Card 2, Card 3 -->
      </div>
    </div>
  </div>
</section>
```

- **`data-card`**: Identifies card for potential pacing config.
- **`flip-card__front` / `flip-card__back`**: 3D flip requires `backface-visibility: hidden`, `transform-style: preserve-3d`.

### Key Classes

| Class | File | Purpose |
|-------|------|---------|
| `.scene--cards` | cv-v2-layers.css | Dark background |
| `.flip-cards-grid` | cv-v2-layers.css | 3-column grid, perspective 1000px |
| `.flip-card` | cv-v2-layers.css | `transform-style: preserve-3d` |
| `.flip-card__front`, `.flip-card__back` | cv-v2-layers.css | `rotateY(0deg)` / `rotateY(180deg)` |

### JavaScript

`initCardsScene` (lines 129–178):

- **Pin**: Section pinned for full scroll.
- **Reveal**: Wrappers `opacity: 1`, `y: 0`, stagger 0.1.
- **Flip**: Each card `rotateY: 180`, duration `flipDur` (default 2.5), `holdPerCard` (1.5), `finalHold` (4).

Pacing config keys: `C.cards.pin`, `C.cards.flipDuration`, `C.cards.holdPerCard`, `C.cards.finalHold`.

### Tunable Properties

| Property | Location | Example |
|----------|----------|---------|
| Scroll height | HTML inline | `400vh` |
| Background | cv-v2-layers.css | `var(--bg-dark)` |
| Flip duration | pacing-config / cv-v2-layers.js | `2.5` |
| Hold per card | pacing-config | `1.5` |
| Final hold | pacing-config | `4` |
| Stagger | cv-v2-layers.js | `0.1` |

---

## Section 3: Problem

### HTML Structure

```html
<section id="problem" class="scene scene--problem" data-scene="5">
  <div class="scroll-container" style="height: 200vh;">
    <div class="sticky-stage">
      <div class="problem-content">
        <h2 class="problem__title" aria-label="I'm so panic!">I'm so panic！</h2>
        <p class="problem__subtitle">我很驚恐</p>
      </div>
    </div>
  </div>
</section>
```

- **`aria-label`**: Source for letter-split; JS splits into `.problem__title-char` spans.

### Key Classes

| Class | File | Purpose |
|-------|------|---------|
| `.scene--problem` | cv-v2-layers.css | `var(--bg-problem)` |
| `.problem__title` | cv-v2-layers.css | Large title, gray by default |
| `.problem__title-char.highlight` | cv-v2-layers.css | White when highlighted |

### JavaScript

`initProblemScene` (lines 88–126):

- Splits title into chars; adds `.problem__title-char`.
- Timeline scrub: `start: "top 80%"`, `end: "top 0%"`.
- Each char gets `.highlight` in sequence; stagger from `C.problem.textStagger` (default 0.18).
- Height from `C.problem.heightVh` if set.

### Tunable Properties

| Property | Location | Example |
|----------|----------|---------|
| Scroll height | HTML inline / pacing | `200vh` |
| Background | cv-v2-layers.css | `var(--bg-problem)` |
| Text stagger | pacing-config | `0.18` |
| Scrub | pacing-config | `0.8` |
| heightVh | pacing-config | `200` |

---

## Section 4: Future Outlook

### HTML Structure

```html
<section id="future-outlook" class="scene scene--outlook" data-scene="outlook">
  <div class="scroll-container" style="height: 400vh;">
    <div class="sticky-stage">
      <div class="outlook-layout">
        <div class="outlook-text-col">
          <div class="outlook-text-item" data-item="1">...</div>
          <div class="outlook-text-item" data-item="2">...</div>
          <div class="outlook-text-item" data-item="3">...</div>
        </div>
        <div class="outlook-visual-col"></div>
      </div>
      <div class="outlook-circles-layer">
        <div class="future-circle future-circle--small" data-item="1">
          <svg class="curve-text-container">...</svg>
        </div>
        <div class="future-circle future-circle--medium" data-item="2">...</div>
        <div class="future-circle future-circle--large" data-item="3">...</div>
      </div>
    </div>
  </div>
</section>
```

- **`data-item`**: Links text item to circle (1, 2, 3).
- **`.curve-text` / `textPath`**: Curved numbers (36.5%, 2.99, 60.5%) inside each circle.

### Key Classes

| Class | File | Purpose |
|-------|------|---------|
| `.scene--outlook` | cv-v2-layers.css | `var(--bg-problem)` |
| `.outlook-layout` | cv-v2-layers.css | 2-column grid |
| `.future-circle--small/medium/large` | cv-v2-layers.css | Quarter circles; `--circle-small`, etc. |
| `.curve-text` | cv-v2-layers.css | SVG text styling |

### JavaScript

`initOutlookScene` (lines 180–248):

- **Stacking**: Text items fade in; circles scale from 0 to 1 with `back.out(1.2)`.
- **Running numbers**: `valueTargets = [36.5, 2.99, 60.5]`; counts up in sync with text and SVG.
- **Wipe**: Numbers fade; circles scale to 15, 25, 40 for wipe transition.
- **Config**: `C.outlook.endOffset`, `C.outlook.itemHold`, `C.outlook.pin`.

### Tunable Properties

| Property | Location | Example |
|----------|----------|---------|
| Scroll height | HTML inline | `400vh` |
| Circle colors | base.css, cv-v2-layers.css | `--circle-small`, `--circle-medium`, `--circle-large` |
| Value targets | cv-v2-layers.js | `[36.5, 2.99, 60.5]` |
| itemHold | pacing-config | `2` |
| endOffset | pacing-config | `"+=320%"` |

---

## Section 5: Solution

### HTML Structure

```html
<section id="solution" class="scene scene--solution" data-scene="9">
  <div class="scroll-container" style="height: 150vh;">
    <div class="sticky-stage">
      <div class="solution-text">
        <h3 class="solution-text__title solution-text__title--disintegrate">
          <span class="char">K</span><span class="char">n</span>...
        </h3>
        <p class="solution-text__sub">了解自己</p>
      </div>
    </div>
  </div>
</section>
```

### Key Classes

| Class | File | Purpose |
|-------|------|---------|
| `#solution` | cv-v2-layers.css | `z-index: 100` (above Future Outlook circles) |
| `.solution-text__title--disintegrate .char` | cv-v2-layers.css | Initial `opacity: 0`, `translateY(20px) scale(0.8)` |
| `.char--space` | cv-v2-layers.css | Space character; `width: 0.3em` |

### JavaScript

`initSolutionScene` (lines 261–306):

- Section fades in on scroll.
- Timeline pinned; chars stagger in with `back.out(1.7)`, stagger 0.05.
- Subtitle fades in; `finalHold` from `C.solutionIntro.finalHold` (1.5).

### Tunable Properties

| Property | Location | Example |
|----------|----------|---------|
| Scroll height | HTML inline | `150vh` |
| Background | cv-v2-layers.css | `var(--bg-beige)` |
| finalHold | pacing-config | `1.5` |
| Char stagger | cv-v2-layers.js | `0.05` |

---

## Section 6: Solution Matrix

### HTML Structure

```html
<section id="solution-matrix" class="scene scene--solution" data-scene="10">
  <div class="scroll-container" style="height: 300vh;">
    <div class="sticky-stage">
      <div class="solution-matrix">
        <div class="solution-matrix__visual">
          <svg>...<g id="h1-group">...</g><g id="h2-group">...</g><g id="h3-group">...</g></svg>
        </div>
        <div class="solution-matrix__items">
          <div id="item-h1" class="solution-matrix__item">...</div>
          <div id="item-h2">...</div>
          <div id="item-h3">...</div>
        </div>
      </div>
    </div>
  </div>
</section>
```

- **`#h1-group`, `#h2-group`, `#h3-group`**: SVG groups revealed in sequence.
- **`#item-h1`, `#item-h2`, `#item-h3`**: Legend items; opacity synced with groups.

### Key Classes

| Class | File | Purpose |
|-------|------|---------|
| `.solution-matrix` | cv-v2-layers.css | Flex row, beige background |
| `.legend-circle--h1/h2/h3` | cv-v2-layers.css | `--color-h1`, `--color-h2`, `--color-h3` |

### JavaScript

`initSolutionScene` matrix block (lines 307–350):

- Timeline pinned; visual and list slide in from sides.
- H1, H2, H3 groups and legend items fade in with staggered labels.
- Scrub 0.8; end `+=200%`.

### Tunable Properties

| Property | Location | Example |
|----------|----------|---------|
| Scroll height | HTML inline | `300vh` |
| H1/H2/H3 colors | cv-v2-layers.css | `--color-h1`, `--color-h2`, `--color-h3` |
| Pin end | cv-v2-layers.js | `+=200%` |

---

## Section 7: Resource Fit Matrix

### HTML Structure

```html
<section id="resource-fit" class="scene scene--solution" data-scene="11">
  <div class="scroll-container" style="height: 300vh;">
    <div class="sticky-stage">
      <div class="matrix-layout matrix-layout--text-left">
        <div class="matrix-col-text anim-text">...</div>
        <div class="matrix-col-visual anim-visual">
          <svg>...<g id="rf-h2-bubble" opacity="0.2">...</g></svg>
        </div>
      </div>
    </div>
  </div>
</section>
```

- **`anim-text`, `anim-visual`**: Fade/slide in from GSAP.
- **`#rf-h2-bubble`**: Target bubble for scale/highlight effect.

### Key Classes

| Class | File | Purpose |
|-------|------|---------|
| `.matrix-layout--text-left` | cv-v2-layers.css | Text left, visual right |
| `.matrix-title`, `.matrix-subtitle` | cv-v2-layers.css | Title typography |
| `.matrix-svg` | cv-v2-layers.css | SVG sizing |

### JavaScript

`createMatrixTimeline("#resource-fit", "#rf-h2-bubble")` (lines 382–417):

- Text and visual fade in; bubble scales to 1.15, opacity 1.
- Pin `+=200%`, scrub 1.

### Tunable Properties

| Property | Location | Example |
|----------|----------|---------|
| Scroll height | HTML inline | `300vh` |
| Pin end | cv-v2-layers.js | `+=200%` |
| Bubble scale | cv-v2-layers.js | `1.15` |

---

## Section 8: Opportunity Matrix

### HTML Structure

```html
<section id="opportunity-matrix" class="scene scene--solution" data-scene="12">
  <div class="scroll-container" style="height: 300vh;">
    <div class="sticky-stage">
      <div class="matrix-layout matrix-layout--visual-left">
        <div class="matrix-col-visual anim-visual">...<g id="om-h2-bubble">...</g></div>
        <div class="matrix-col-text anim-text">...</div>
      </div>
    </div>
  </div>
</section>
```

- **`matrix-layout--visual-left`**: Visual left, text right (opposite of Resource Fit).
- **`#om-h2-bubble`**: Target for `createMatrixTimeline`.

### JavaScript

Same pattern as Resource Fit: `createMatrixTimeline("#opportunity-matrix", "#om-h2-bubble")`.

### Tunable Properties

Same as Section 7; swap `#om-h2-bubble` for target.

---

## Section 9: Growth

### HTML Structure

```html
<section id="growth" class="scene scene--growth" data-scene="13">
  <div class="scroll-container" style="height: 220vh;">
    <div class="sticky-stage">
      <div class="growth-content">
        <h2 class="growth__title">Growth Strategy</h2>
        <img src="./img/Group%2029.svg" class="growth__svg">
      </div>
    </div>
  </div>
</section>
```

- No GSAP pin or effects; scroll height controls read time.

### Key Classes

| Class | File | Purpose |
|-------|------|---------|
| `.scene--growth` | cv-v2-layers.css | `#631515` (deep red) |
| `.growth__title` | cv-v2-layers.css | 4rem, font-weight 800 |
| `.growth__svg` | cv-v2-layers.css | Full width |

### Tunable Properties

| Property | Location | Example |
|----------|----------|---------|
| Scroll height | HTML inline | `220vh` |
| Background | cv-v2-layers.css | `#631515` |
| Image | HTML | `./img/Group%2029.svg` |

---

## Section 10: Strategy Tree

### HTML Structure

```html
<section id="strategy" class="scene scene--strategy" data-scene="14">
  <div class="scroll-container" style="height: 250vh;">
    <div class="sticky-stage">
      <div class="strategy-container">
        <div class="strategy-headers anim-header">...</div>
        <div class="tree-wrapper"
             data-line-color="#525252"
             data-line-width="1.5"
             data-turn-ratio="0.5"
             data-min-stem="20">
          <div class="tree-col col-root"><div id="node-root" class="tree-card card-root">...</div></div>
          <div class="tree-col col-path">...</div>
          <div class="tree-col col-action">...</div>
          <div class="tree-col col-indicator">...</div>
        </div>
      </div>
    </div>
  </div>
</section>
```

- **`data-*` on `.tree-wrapper`**: StrategyTree reads `lineColor`, `lineWidth`, `turnRatio`, `minStem`.
- **Node IDs**: `node-root`, `node-path-1`, `node-act-1`, `node-ind-1`, etc.; connections defined in StrategyTree.

### Key Classes

| Class | File | Purpose |
|-------|------|---------|
| `.tree-wrapper` | cv-v2-layers.css | Grid 1fr 1fr 1.2fr 1.2fr, gap 60px |
| `.card-root`, `.card-path`, `.card-action`, `.card-action-sub` | cv-v2-layers.css | Card background colors |
| `.line-path` | cv-v2-layers.css, StrategyTree.js | SVG paths; stroke from options |

### JavaScript

`new window.StrategyTree("#strategy")` (line 423):

- Creates SVG, draws orthogonal paths between nodes.
- Algorithm: 4px overlap, turn at `turnX`, bottom-branch shortcut.
- Resize debounced 100ms; ScrollTrigger.refresh() after redraw.
- `initAnimation()`: GSAP ScrollTrigger for node reveal.

### Tunable Properties

| Property | Location | Example |
|----------|----------|---------|
| Scroll height | HTML inline | `250vh` |
| data-line-color | HTML | `#525252` |
| data-line-width | HTML | `1.5` |
| data-turn-ratio | HTML | `0.5` |
| data-min-stem | HTML | `20` |
| Card colors | cv-v2-layers.css | `.card-root`, `.card-path`, etc. |

---

## Section 11: Resources

### HTML Structure

```html
<section id="resources" class="scene scene--resources" data-scene="15">
  <div class="scroll-container" style="height: 220vh;">
    <div class="sticky-stage">
      <div class="resources-layout">
        <h2 class="resources__title">Portfolio</h2>
        <div class="resources__links">
          <a href="#" class="resources__link-block" data-target="book-1">Link Name 1</a>
          ...
        </div>
        <div class="resources__books">
          <img id="book-1" class="resources__book" src="..." alt="Book 1">
          <img id="book-2" ...>
          <img id="book-3" ...>
        </div>
      </div>
    </div>
  </div>
</section>
```

- **`data-target`**: Links block to image `id`; hover scales target image.
- **Placeholder images**: `placehold.co` per cv2-spec Section 7.1.

### Key Classes

| Class | File | Purpose |
|-------|------|---------|
| `.resources-layout` | cv-v2-layers.css | 2-column grid |
| `.resources__link-block` | cv-v2-layers.css | Link blocks, hover translateX |
| `.resources__book` | cv-v2-layers.css | Stacked, rotated; positioned by nth-child |

### JavaScript

- **initResourcesScene** (lines 349–359): Pin section; `C.resources.pinEnd` (default `+=130%`).
- **Books fly-in** (lines 425–342): Each book animates from `y: -180 - i*20`, scrub by viewport %.
- **Hover** (lines 447–457): `data-target` → `getElementById`; scale 1.05 on enter, reset on leave.

### Tunable Properties

| Property | Location | Example |
|----------|----------|---------|
| Scroll height | HTML inline | `220vh` |
| pinEnd | pacing-config | `+=130%` |
| Fly-in start % | cv-v2-layers.js | `75 - i*12` |
| Hover scale | cv-v2-layers.js | `1.05` |

---

## Section 12: Contact

### HTML Structure

```html
<section id="contact" class="scene scene--footer" data-scene="16">
  <div class="scroll-container" style="height: 100vh;">
    <div class="sticky-stage">
      <footer class="footer-content">
        <h3 class="footer__title">Yulin Cho CV</h3>
        <p class="footer__text">...</p>
        <div class="footer__social">...</div>
      </footer>
    </div>
  </div>
</section>
```

- No GSAP effects; static footer.

### Key Classes

| Class | File | Purpose |
|-------|------|---------|
| `.scene--footer` | cv-v2-layers.css | `var(--bg-dark)` |
| `.footer__title`, `.footer__text`, `.footer__social-link` | cv-v2-layers.css | Typography, links |

### Tunable Properties

| Property | Location | Example |
|----------|----------|---------|
| Scroll height | HTML inline | `100vh` |
| Background | cv-v2-layers.css | `var(--bg-dark)` |

---

## Cross-Section Dependencies

- **Problem fade when Future Outlook enters**: `problemContent` fades out when `#future-outlook` hits top; fades back when scrolling up (cv-v2-layers.js lines 251–259).
- **Nav active state**: Shared `sections.forEach` + `setActiveNav`; each section triggers on `top center` (lines 48–67).
- **prefers-reduced-motion**: Global; when set, `staggerDur` = 0, and several init functions skip (Problem, Cards, Outlook, Resources, etc.). CSS disables animations on `.hero__title .char`, `.flip-card`, `.problem__title`, etc. (cv-v2-layers.css lines 806–816).

---

## Quick Reference Table

| Section | ID | Scroll Height | Main Effect |
|---------|-----|---------------|-------------|
| 1 Intro | `#intro` | 150vh | Kinetic title entrance |
| 2 Cards | `#cards` | 400vh | 3D flip, pin |
| 3 Problem | `#problem` | 200vh | Letter highlight scrub |
| 4 Future Outlook | `#future-outlook` | 400vh | Running numbers, circles, wipe |
| 5 Solution | `#solution` | 150vh | Char stagger, pin |
| 6 Solution Matrix | `#solution-matrix` | 300vh | H1/H2/H3 reveal |
| 7 Resource Fit | `#resource-fit` | 300vh | Text/visual + bubble |
| 8 Opportunity Matrix | `#opportunity-matrix` | 300vh | Text/visual + bubble |
| 9 Growth | `#growth` | 220vh | Static |
| 10 Strategy | `#strategy` | 250vh | StrategyTree SVG |
| 11 Resources | `#resources` | 220vh | Pin, books fly-in, hover |
| 12 Contact | `#contact` | 100vh | Static |
