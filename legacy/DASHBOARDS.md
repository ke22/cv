# Dashboards

This repo includes helper dashboards for designing, debugging, and managing content for the CV scrollytelling project.

It supports `cv-v2.html` (three-layer scrollytelling: Canvas/Stage/Text).

## 1) Content Dashboard (Structure & Narrative)

- **File**: `content-dashboard.html`
- **Purpose**: Visualize the 16-step narrative flow, bilingual content, and technical mapping.

### How to use
- Open `content-dashboard.html` to see a card-based view of all 16 steps.
- Each card shows:
  - **Step Number & Nav Section**
  - **Content**: Eyebrow, Title, Lead text (English + Chinese)
  - **Configuration**: Which Visual Stage and Variant is active for this step.
- Use this to plan content rearrangements or verify the flow.

## 2) Dev overlay (ScrollTrigger monitor)

- **File**: `cv-gsap.html`, `cv-v2.html`
- **CSS**: `css/gsap-dashboard.css`
- **JS**: `js/cv-gsap-dashboard.js`

### How to use

- Click the top-right `🔍` button, or press `D` to toggle the monitor.
- Press `Esc` to close.

What it shows:
- Global scroll values (Y / viewport / doc height / overall progress)
- Section in-view status
- All pinned ScrollTrigger instances and their progress (mainly `cv-gsap.html`)
- `cv-v2.html`: the 16 step triggers (`cvv2-step-01` … `cvv2-step-16`) and their progress

## 3) Design dashboard (styleguide)

- **File**: `design-dashboard.html`

### How to use

- Open `design-dashboard.html` to review tokens and component look/feel.
- Adjust tokens in `css/base.css` and component styles in `css/components.css`, then refresh the dashboard.
- Validate the result in `cv-gsap.html`.

### Notes for `cv-v2.html`

- The page is step-based (16 × 100vh). The sticky visuals live in the Stage layer and swap when each step hits **top 80%** of the viewport.
- If you want to tune pacing, change the step height in `css/cv-v2-layers.css` (and keep visuals in `cv-v2.html` Stage).
