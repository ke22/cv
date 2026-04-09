#!/usr/bin/env bash
# Bundle cv-v2 static assets for Azure Static Web Apps (no Node build).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${ROOT}/swa-output"

rm -rf "$OUT"
mkdir -p "$OUT/css" "$OUT/js" "$OUT/img" "$OUT/assets"

# Landing + deep link
cp "${ROOT}/cv-v2.html" "${OUT}/index.html"
cp "${ROOT}/cv-v2.html" "${OUT}/cv-v2.html"

for f in base.css sections.css components.css animations.css cv-v2-layers.css gsap-dashboard.css; do
  if [[ -f "${ROOT}/css/${f}" ]]; then
    cp "${ROOT}/css/${f}" "${OUT}/css/"
  fi
done

for f in StrategyTree.js pacing-config.js cv-v2-layers.js cv-gsap-dashboard.js pacing-panel.js; do
  if [[ -f "${ROOT}/js/${f}" ]]; then
    cp "${ROOT}/js/${f}" "${OUT}/js/"
  fi
done

if [[ -d "${ROOT}/img" ]]; then
  cp -R "${ROOT}/img/." "${OUT}/img/" 2>/dev/null || true
fi
if [[ -d "${ROOT}/assets" ]]; then
  cp -R "${ROOT}/assets/." "${OUT}/assets/" 2>/dev/null || true
fi

# Optional SWA config (safe defaults)
cat > "${OUT}/staticwebapp.config.json" << 'EOF'
{
  "mimeTypes": {
    ".json": "application/json"
  }
}
EOF

echo "Azure static bundle ready: ${OUT}"
