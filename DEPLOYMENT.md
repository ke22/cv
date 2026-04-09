# Deployment Guide

Main shipping target is the **static `cv-v2` bundle**: `cv-v2.html` plus `css/`, `js/`, `img/`, `assets/`. There is **no** `npm run build` for this site.

## Microsoft Azure (Static Web Apps) — recommended

1. **Repo secret:** `AZURE_STATIC_WEB_APPS_API_TOKEN` (from Azure → your Static Web App → deployment token).
2. **Workflow:** `.github/workflows/azure-static-web-apps.yml` runs `scripts/prepare-azure-static.sh`, which writes **`swa-output/`** (`index.html` is a copy of `cv-v2.html`), then uploads that folder.
3. **Local dry run:**

   ```bash
   bash scripts/prepare-azure-static.sh
   npx --yes serve swa-output
   ```

`swa-output/` is gitignored — do not commit it.

## Netlify / Vercel / any static host

Point the publish directory at the **`swa-output`** folder after running `bash scripts/prepare-azure-static.sh`, or upload the same set of paths as the script copies (`cv-v2.html` as `index.html` if you need `/`).

## GitHub Pages (previous `dist/` pipeline)

The old workflow that published **`dist/`** is kept for reference only: **`legacy/github-pages-deploy.yml`**. It is **not** active under `.github/workflows/`. To revive GitHub Pages, either restore that workflow and a `dist` build, or add a Pages workflow that uploads `swa-output` after `prepare-azure-static.sh`.

## Checklist before go-live

- [ ] `bash scripts/prepare-azure-static.sh` completes without errors  
- [ ] `swa-output/index.html` and `swa-output/cv-v2.html` exist  
- [ ] Open `swa-output/index.html` locally; spot-check sections and console for 404s  
- [ ] Azure token secret set (if using the Azure workflow)
