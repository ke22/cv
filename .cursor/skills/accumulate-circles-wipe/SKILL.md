## Accumulate Circles + Wipe Transition (Future Outlook Pattern)

This skill documents the **Future Outlook** visual pattern in `cv-v2.html`:

- Three **quarter circles** in the bottom-right that **accumulate** as you scroll through three text items.
- A **wipe transition** where the circles expand to cover the screen and hand off to the next scene.
- **Curved labels** (percentages, scores) on inner arcs inside each quarter circle.

Use this pattern when you want to communicate **pressure building → release**, or stepwise future metrics that culminate in a strong transition.

---

### 1. HTML recipe

In your sticky section (e.g. `#future-outlook`), the essential structure is:

- A 2‑column layout:
  - **Left column**: stacked text items.
  - **Right column**: three circles with SVG curved labels.

Inside `cv-v2.html` this looks like:

- Left:
  - `.outlook-text-col`
    - Three `.outlook-text-item` elements with:
      - `.future-outlook__title`
      - `.future-outlook__stat` (main line with the metric)
      - `.future-outlook__sub` (supporting copy)
- Right:
  - `.outlook-visual-col`
    - `.future-circle.future-circle--small` (data-item="1")
      - `svg.curve-text-container`
        - `path#curve-s`
        - `text.curve-text > textPath`
    - `.future-circle.future-circle--medium` (data-item="2")
      - `svg` with `path#curve-m` and `textPath`
    - `.future-circle.future-circle--large` (data-item="3")
      - `svg` with `path#curve-l` and `textPath`

**Curved text path (inner arc)**  
Each SVG uses the same inner arc, shifted inside the quarter circle:

```html
<svg class="curve-text-container" viewBox="0 0 100 100">
  <path id="curve-s" d="M 25,100 A 75,75 0 0,1 100,25" fill="none" />
  <text class="curve-text">
    <textPath href="#curve-s" startOffset="50%" text-anchor="middle" dy="8">
      36.5%
    </textPath>
  </text>
</svg>
```

Key points:

- The arc `M 25,100 A 75,75 0 0,1 100,25` is a **smaller-radius quarter arc** that sits inside the visual quarter circle, leaving visual padding from the edge.
- `startOffset="50%"` + `text-anchor="middle"` centers the text on the arc.
- `dy` is tuned per circle (e.g. 8, 4, 3) to keep the label visually at a consistent distance from the arc.

To adapt this to a new dataset, you typically:

- Change the text content inside `<textPath>`.
- Optionally change the IDs (`curve-s`, `curve-m`, `curve-l`) if you duplicate the pattern.

---

### 2. CSS recipe

All styles referenced here live in `[css/cv-v2-layers.css](css/cv-v2-layers.css)`.

#### 2.1 Layout and sticky behavior

- The section uses a sticky scroll container pattern:
  - Outer section: `#future-outlook` with a `.scroll-container` of a large height (e.g. `400vh`).
  - `.sticky-stage` is `position: sticky; top: 0; height: 100vh;`.
- Inside the sticky stage, `.outlook-layout` is a 2‑column grid:

```css
.outlook-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
  width: min(1200px, 90vw);
  align-items: center;
  position: relative;
  height: 100%;
  min-height: 100vh;
}
```

#### 2.2 Left column (text)

```css
.outlook-text-col {
  position: relative;
  height: 100%;
  z-index: 50;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* Right spacing so text never touches circles */
  padding-right: 40px;
  /* Left padding so text doesn’t hug the viewport edge on large screens */
  padding-left: max(5vw, calc((100vw - 1200px) / 2));
}

.outlook-text-item {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  width: 100%;
  opacity: 0; /* driven by JS */
  text-align: left;
}
```

Each `.outlook-text-item` is absolutely positioned in the column; the JS timeline controls which one is visible.

#### 2.3 Right column (size container + circles)

The right column is declared as a **size container** so its children can use `cqmin`:

```css
.outlook-visual-col {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100%;
  pointer-events: none;
  z-index: 0;
  /* Key: allow circles to size based on the container’s shorter side */
  container-type: size;
}
```

The circles themselves:

```css
.future-circle {
  position: absolute;
  bottom: 0;
  right: 0;

  /* Quarter circle shape in bottom-right */
  border-radius: 100% 0 0 0;

  /* Always a perfect square: critical for a true 1/4 circle */
  aspect-ratio: 1 / 1;

  transform-origin: bottom right;
  transform: scale(0);  /* JS animates this */
  will-change: transform;
  opacity: 1 !important; /* override legacy opacity: 0; */
  max-width: none;
  max-height: none;
}
```

Circle size levels (using the container’s shortest dimension via `cqmin`):

```css
.future-circle--small {
  width: 30cqmin;
  height: 30cqmin;
  z-index: 30;
  background: var(--circle-small, #D65D5D);
}
.future-circle--medium {
  width: 60cqmin;
  height: 60cqmin;
  z-index: 20;
  background: var(--circle-medium, #C44646);
}
.future-circle--large {
  width: 90cqmin;
  height: 90cqmin;
  z-index: 10;
  background: var(--circle-large, #9F3030);
}
```

This ensures:

- 1:2:3 concentric ratio (30, 60, 90).
- The shape remains a **perfect 1/4 circle** regardless of container aspect ratio.

#### 2.4 Curved text

```css
.curve-text-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

.curve-text {
  fill: rgba(255, 255, 255, 0.95);
  font-family: var(--font-primary, sans-serif);
  font-weight: 800;
  font-size: 28px; /* base */
  letter-spacing: 1px;
}

/* Inverse scaling: container bigger ⇒ font smaller, so visual size matches */
.future-circle--small .curve-text {
  font-size: 28px;
}
.future-circle--medium .curve-text {
  font-size: 14px;   /* 28 / 2 */
}
.future-circle--large .curve-text {
  font-size: 9.33px; /* 28 / 3 */
}
```

This keeps the **visual size** of “36.5%”, “2.99”, “60.5%” roughly equal even though their circles are 1×, 2×, 3× larger.

---

### 3. JS recipe (GSAP)

All logic lives in `[js/cv-v2-layers.js](js/cv-v2-layers.js)` under **“6. Future Outlook Sequence (Consolidated)”**.

Setup:

```js
gsap.registerPlugin(ScrollTrigger);

const outlookSection = document.querySelector("#future-outlook");
if (outlookSection) {
  const textItems = outlookSection.querySelectorAll(".outlook-text-item");
  const circleS = outlookSection.querySelector(".future-circle--small");
  const circleM = outlookSection.querySelector(".future-circle--medium");
  const circleL = outlookSection.querySelector(".future-circle--large");
  const circles = [circleS, circleM, circleL];

  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: outlookSection,
      start: "top top",
      end: "+=600%",
      pin: true,
      scrub: 1.2,
    }
  });
```

#### 3.1 Phase 1 – Accumulate (stacking)

```js
  const stackingTl = gsap.timeline();

  textItems.forEach((text, i) => {
    stackingTl
      .to(text, { opacity: 1, y: 0, duration: 1 })
      .to(circles[i], { scale: 1, duration: 1, ease: "back.out(1.2)" }, "<");

    if (i < textItems.length - 1) {
      stackingTl.to(text, { opacity: 0, y: -30, duration: 0.8 }, "+=0.5");
    }
  });
```

Behavior:

- For each index `i`:
  - Fade in the corresponding text item and bring it to `y: 0`.
  - At the same time (`"<"`), scale circle `circles[i]` from 0 → 1 with a playful `back.out(1.2)` ease.
- For the first two text items, fade and move them out after a short hold; the last one stays.
- Circles **do not shrink back**, so small, then medium, then large accumulate.

#### 3.2 Phase 2 – Wipe transition

```js
  const wipeTl = gsap.timeline();

  // Step A: fade out labels
  wipeTl.to(".curve-text", { opacity: 0, duration: 0.5 });

  // Step B: circles scale up (large -> medium -> small)
  wipeTl.to(circleL, { scale: 15, duration: 2.5, ease: "power2.in" }, "<")
        .to(circleM, { scale: 25, duration: 2.0, ease: "power3.in" }, "-=2.2")
        .to(circleS, { scale: 40, duration: 1.5, ease: "expo.in" }, "-=1.8");

  mainTl.add(stackingTl)
        .add(wipeTl, "+=0.5");
}
```

Behavior:

- First, all `.curve-text` labels (36.5%, 2.99, 60.5%) fade out to clean the shapes.
- Then the circles expand from the bottom-right:
  - Large → Medium → Small, with overlapping timings, until the screen is filled.

---

### 4. Customization notes

- **Change the metrics:**  
  Edit only the text inside `<textPath>`; keep the structure and IDs unless you intentionally duplicate the pattern.

- **Adjust visual size of labels:**  
  Change the base size in `.curve-text` (e.g. 28px) and recompute medium/large as base ÷2 and base ÷3.  
  You may need to tweak `dy` on the `<textPath>` to maintain spacing from the arc.

- **Change the arc position or tightness:**  
  - Reduce radius in the arc path to move text further inside the wedge (currently `75` in `A 75,75`).
  - Shift the start/end coordinates (e.g. `25,100` and `100,25`) to fine-tune where along the quarter circle the labels live.

- **Scroll range and timing:**  
  - `end: "+=600%"` spreads the whole sequence over a long scroll window.  
  - Use a smaller or larger `end` to compress or stretch the effect.  
  - Adjust eases (`back.out`, `power2.in`, etc.) to change the feel of accumulation and wipe.

---

### 5. Troubleshooting & pitfalls (based on this project)

These are issues you already hit and solved; they’re included here so you don’t repeat the same debugging.

1. **Circles invisible despite GSAP scales**
   - **Cause:** Legacy CSS (`sections.css`) had `.future-circle { opacity: 0; }`.  
   - **Fix:** In the v2 layer CSS, explicitly set `opacity: 1 !important;` on `.future-circle` and/or scope legacy rules so they don’t apply to the v2 page.

2. **Circles/visual column not filling the stage**
   - **Cause:** Grid/sticky layout without a reliable height on the right column.  
   - **Fix:** Ensure `.outlook-layout` has `min-height: 100vh` and `.outlook-visual-col` has `height/min-height: 100%` so the circles always have a full column to occupy.

3. **Circles overlapping the left text**
   - **Cause:** The visual column was initially a full overlay (`position: absolute; width/height: 100%`) and circles were large in `vh`.  
   - **Fix:**  
     - Make `.outlook-visual-col` the right grid column (`position: relative`) instead of a full overlay.  
     - Use `cqmin` sizing (30/60/90) so the circles respect the right column’s bounds.  
     - Add `padding-right` to `.outlook-text-col` to create breathing room.

4. **Quarter circles turning into quarter ellipses**
   - **Cause:** Using `max-width: 100%` / `max-height: 100%` independently on circles in a non-square column.  
   - **Fix:**  
     - Force a square with `aspect-ratio: 1 / 1`.  
     - Size using `cqmin` so both width and height derive from the same scalar.

5. **Curved text too small or hugging the edge**
   - **Causes:**  
     - Initial font-size was small (e.g. 14px).  
     - Arc used the full-radius path (`M 0,100 A 100,100 ...`), so text sat on the outer edge.  
   - **Fix:**  
     - Increase base font-size and use inverse scaling per circle.  
     - Use a smaller-radius arc (`A 75,75`) and shift the path to sit inside the wedge.  
     - Tune `dy` per circle so the text is clearly “inside” the color shape.

6. **ScrollTrigger range confusion**
   - **Cause:** Mismatch between section height and `end: "+=600%"`.  
   - **Fix:** Ensure the pinned range is intentional; test scroll behavior and, if necessary, adjust `end` or the scroll-container height so both the accumulation and wipe phases fully play out.

If you follow this skill’s HTML, CSS, and JS recipes and keep these pitfalls in mind, you can reliably reproduce the accumulate-circles + wipe effect in new sections or projects without re-doing the low-level debugging.

