# Pages Overview: Structure, Layout, Content, Effects

> **Scope:** The canonical live page is **`cv-v2.html`** at the repository root. The former Next.js app, `cv.html`, GSAP-only duplicate, dashboards, `learn-scrollstory/`, and build output **`dist/`** are archived under **`legacy/`** (see `legacy/README.md`).

---

## `cv-v2.html` (Scrollytelling v2 – GSAP)

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

**Global:** Progress bar, dot nav (Intro→Goals→Reality→Strategy→Growth→Contact), mobile nav + modal, GSAP ScrollTrigger, `cv-v2-layers.js`, `StrategyTree.js`, optional `?pacing=1` → `pacing-panel.js`.

**Assets:** `./css/*.css` (base, sections, components, animations, cv-v2-layers, gsap-dashboard); `./js/` modules listed in `cv-v2.html`; `./img/` (e.g. `Group%2029.svg`); `prepare-azure-static.sh` also copies `./assets/` for hosting parity.

---

## Archived routes & files (under `legacy/`)

| Item | Note |
|------|------|
| Next.js `app/`, `components/`, `package.json`, etc. | Full stack in `legacy/` |
| `cv.html`, `cv-gsap.html`, `content-dashboard.html`, `design-dashboard.html` | Older or tooling HTML |
| `learn-scrollstory/` | Scroll lab |
| `dist/` | Previous static build tree |
| `github-pages-deploy.yml` | Old GitHub Pages workflow |

---

## Effects reference

For historical effect notes see **`legacy/EFFECTS_LIST.md`**.
