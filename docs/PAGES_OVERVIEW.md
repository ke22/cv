# Pages Overview: Structure, Layout, Content, Effects

## Next.js App (`/`)

| Route | Layout | Content | Effects |
|-------|--------|---------|---------|////////p[[m.c.c.,c   []]
| **`/`** (app/page.tsx) | `main` + Navbar/Footer | Hero, '///GapSection, PortfolioSection, ExecutionSection, LeadershipSection, MetricsSection, FixedCTA | Tailwind, standard React layout |
| **`/story`** (app/story/page.tsx) | `AtmosphericContainer` (fog, grain, flare) | StoryHero, DisintegratingTextSection, MissionChapter, GapChapter, PortfolioChapter, ExecutionChapter, LeadershipChapter, MetricsChapter | Scrollytelling, atmospheric overlays, disintegrating text |
| **`/test-mcp`** | Simple centered form | MCP/Figma connection test UI | Buttons, inputs, JSON output |

---

## HTML Pages (Root)

### 1. `cv-v2.html` (Scrollytelling v2 – GSAP)

| Section | ID | Scroll height | Content | Effects |
|---------|-----|---------------|---------|---------|
| Intro | `#intro` | 150vh | Hero, kinetic "CVCVCV…" title, Yulin Cho, CTA | Kinetic typography, parallax |
| Cards | `#cards` | 400vh | 3 flip cards (任務目標, 策略目標, 個人目標) | 3D flip, cumulative display |
| Problem | `#problem` | 120vh | "I'm so panic!" | Title fade-in |
| Future Outlook | `#future-outlook` | 400vh | Low Salary 36.5%, Insufficient 2.99, Future 60.5% + circles | Title switch, circle stack, concentric zoom |
| Solution Intro | `#solution` | 150vh | "Know What You Own First" | Character-by-character reveal |
| Solution Matrix | `#solution-matrix` | 300vh | H1/H2/H3 matrix (4×4 grid), legend | H1→H2→H3 highlight |
| Resource Fit | `#resource-fit` | 300vh | Resource Fit Matrix SVG | Title/visual slide-in |
| Opportunity Matrix | `#opportunity-matrix` | 300vh | Opportunity Matrix SVG | Title/visual slide-in, highlight scale |
| Growth | `#growth` | 150vh | Growth Strategy + SVG | Title fade, SVG fade + scale |
| Strategy | `#strategy` | 250vh | Strategy tree (root, paths, actions, indicators) | Tree reveal, JS-built SVG |
| Resources | `#resources` | 150vh | 3 links + 3 books | Sequential reveal |
| Contact | `#contact` | 100vh | Footer, social links | Basic |

**Global:** Progress bar, dot nav (Intro→Goals→Reality→Strategy→Growth→Contact), mobile nav + modal, GSAP ScrollTrigger, `cv-v2-layers.js`, `StrategyTree.js`

---

### 2. `cv-gsap.html` (GSAP Portfolio)

Same section structure as cv-v2; uses `js/cv-gsap-dashboard.js` and debug monitor (press D).

---

### 3. `cv.html` (Original Scrollytelling v2.0.3)

Same overall structure; no GSAP, vanilla scroll scrub; includes debug monitor. ~2200+ lines.

---

### 4. `content-dashboard.html`

| Section | Content |
|---------|---------|
| Header | CV v2 content structure dashboard |
| Grid | Step cards from `content/steps.json` (chapter, scene, step, content) |

**Layout:** Dark theme, card grid, hover states, `is-chapter-start` border accent.

---

### 5. `design-dashboard.html`

| Section | Content |
|---------|---------|
| Colors | Swatches (--bg-dark, --bg-solution, --red-primary, --circle-large) |
| Typography | Samples |
| Pills / hints | Link to `cv-gsap.html` for validation |

**Layout:** Card grid, `css/base.css` tokens, styleguide.

---

### 6. `learn-scrollstory/index.html`

| Section | Content |
|---------|---------|
| Header | Scrollstory Lab, nav |
| Hero | "Learn digital storytelling by scrolling" |
| Scrollstory | Sticky visual panel (updates per chapter) + 4 scrolling chapters |
| Chapters | 1–4: Set the scene, Introduce change, Show impact, Land takeaway |
| Outro | "Your next steps" |
| Footer | Back-to-top, sandbox note |

**Layout:** Text steps on one side, sticky graphic on the other. Updates via `data-step` and `script.js`.

---

## `dist/cv.html`

Build output; mirrors `cv.html` for deployment.

---

## Effects Reference (from EFFECTS_LIST.md)

| Block | Effects |
|-------|---------|
| Hero | Title/desc/CTA fade-in + parallax |
| Flip Cards | Appear, 3D flip, cumulative display |
| Problem | Title + subtitle fade-in |
| Future Outlook | Title switch, circle stack, concentric zoom, auto-advance |
| Solution Text | Fade-in, character-by-character reveal |
| Solution Matrix | Slide-in, H1/H2/H3 highlight |
| Resource Fit | Title/visual slide-in |
| Opportunity Matrix | Slide-in, highlight scale |
| Growth / Strategy | Title fade, SVG fade + scale |
| Resources | Books/links sequential reveal |
| Global | Progress bar, nav highlight, debug monitor |
