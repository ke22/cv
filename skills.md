# Decision Tree / Strategy Tree Effect – Recap

Quick reference for the decision tree (strategy tree) effect in cv-v2: where it lives, how it works, and what to tune.

---

## 1. Title and purpose

- **Name:** Decision Tree / Strategy Tree effect
- **Where:** [cv-v2.html](cv-v2.html) Scene 14, section `#strategy`
- **What it does:** Four-column tree (Strategy / Path / Action / Indicator) with a scroll-pinned section, animated reveal of headers and cards, and **dynamically drawn SVG connector lines** between nodes that redraw on resize.

---

## 2. Architecture overview

**HTML**

- Semantic only; no inline SVG. Lines are created in JS.
- Four columns (`.tree-col`): root (1 card), path (2 cards), action (2 groups of 2 cards), indicator (2 groups of 2 text nodes).
- Each node has a stable `id`: `node-root`, `node-path-1`, `node-path-2`, `node-act-1` … `node-act-4`, `node-ind-1` … `node-ind-4`.

**CSS**

- File: [css/cv-v2-layers.css](css/cv-v2-layers.css), block “Scene 14: Strategy Tree”.
- Grid: 4 columns `1fr 1fr 1.2fr 1.2fr`, `gap: 60px`.
- Cards: `min-height: 94px`, `max-width: 282px`, flex centering.
- Colors: `.card-root` #631515, `.card-path` #923F3F, `.card-action` #D9D9D9, `.card-action-sub` #C8C8C8.
- Columns 2–4: `justify-content: space-around`.
- Mobile: stacked columns, `.tree-lines` hidden.

**JS**

- [js/StrategyTree.js](js/StrategyTree.js): IIFE, exposes `StrategyTree` on globalThis/window.
- [js/cv-v2-layers.js](js/cv-v2-layers.js): instantiates `new StrategyTree("#strategy")` after load.

---

## 3. How the lines work (drawPath recap)

- **Connections:** 10 pairs (root→path1/2, path1→act1/2, path2→act3/4, act1–4→ind1–4). Paths are created in JS and prepended to `.tree-wrapper` inside one shared SVG.
- **Coordinates:** Container-relative. Start = right-center of source card; end = left-center of target card.
- **Overlap:** Start X −4px, end X +4px so the stroke extends under the cards and avoids anti-aliasing gaps.
- **Turn (stem):** Fixed 40px from source card’s right edge: `turnX = (sRect.right - cRect.left) + 40`. Keeps same-level vertical stems aligned.
- **Bottom branches:** For root→path-2, path-1→act-2, path-2→act-4, the path is drawn only from `turnX` onward (no duplicate horizontal segment) to avoid double stroke.
- **Y snap:** If `|y1 - y2| < 3`, use same Y to avoid wobbly near-horizontal segments.

---

## 4. Animation (GSAP)

Timeline order: header → root card → level-1 lines (strokeDashoffset) → path cards → level-2 lines → action cards → level-3 lines → indicator text. ScrollTrigger pins the section, scrub; `onRefresh` calls `drawAll()` so lines stay correct after refresh.

---

## 5. Key tunables

| Tunable | Value | Location |
|--------|--------|----------|
| Line overlap | 4px | drawPath: x1 −4, x2 +4 |
| Turn distance | 40px | Fixed from source right in drawPath |
| Line color / width | #525252, 1.5 | StrategyTree constructor options |
| Grid gap | 60px | CSS: .strategy-headers, .tree-wrapper |
| Action/indicator group gap | 30px | CSS: .action-group, .indicator-group |

---

## 6. Related files

- [cv-v2.html](cv-v2.html) – Scene 14 block, script tag for StrategyTree.js
- [css/cv-v2-layers.css](css/cv-v2-layers.css) – Strategy Tree block + mobile
- [js/StrategyTree.js](js/StrategyTree.js) – createSVG, drawPath, drawAll, initAnimation
- [js/cv-v2-layers.js](js/cv-v2-layers.js) – StrategyTree init
- [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md) – section 7 references strategy tree
