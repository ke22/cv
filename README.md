# CV — Scrollytelling v2 (static)

Primary site: **`cv-v2.html`** at the repo root — GSAP ScrollTrigger, flip cards, matrices, strategy tree; styles under `css/`, behavior under `js/`, media under `img/` and `assets/`.

## Run locally

- Open `cv-v2.html` in the browser (paths are relative), or use any static server on the repo root.
- Optional debug pacing UI: append `?pacing=1` to the URL (loads Tweakpane + `js/pacing-panel.js`).

## Deploy (Azure Static Web Apps)

```bash
bash scripts/prepare-azure-static.sh
# Upload contents of swa-output/ (see DEPLOYMENT.md)
```

CI builds the same bundle on push (see `.github/workflows/ci.yml` and `azure-static-web-apps.yml`).

## Docs

- [docs/AI_INDEX.md](docs/AI_INDEX.md) — entry map  
- [docs/SECTION_CODE_GUIDE.md](docs/SECTION_CODE_GUIDE.md) — sections ↔ HTML/CSS/JS  

## Legacy tree

Older Next.js app, `cv.html` / dashboards / `dist/`, and related guides live under **`legacy/`** (see `legacy/README.md`).
