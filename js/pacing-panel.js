// js/pacing-panel.js
// Dev-only Tweakpane panel for adjusting window.PACING and rebuilding scenes.

(function () {
  if (typeof Tweakpane === "undefined" || !globalThis.PACING || !globalThis.rebuildScenes) return;

  // Explicit host container so the panel is always visible and on top
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.top = "16px";
  host.style.right = "16px";
  host.style.zIndex = "9999";
  document.body.appendChild(host);

  const pane = new Tweakpane.Pane({ title: "CV v2 Pacing", container: host });
  const C = globalThis.PACING;
  let refreshTimeout;

  function scheduleRefresh() {
    clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(() => {
      globalThis.rebuildScenes();
    }, 120);
  }

  const fGlobal = pane.addFolder({ title: "Global" });
  fGlobal.addInput(C.global, "scrubSmooth", { min: 0, max: 2, step: 0.1 }).on("change", scheduleRefresh);

  const fProblem = pane.addFolder({ title: "Problem" });
  fProblem.addInput(C.problem, "pin").on("change", scheduleRefresh);
  fProblem.addInput(C.problem, "heightVh", { min: 100, max: 400, step: 20 }).on("change", scheduleRefresh);
  fProblem.addInput(C.problem, "textStagger", { min: 0.05, max: 0.3, step: 0.01 }).on("change", scheduleRefresh);

  const fCards = pane.addFolder({ title: "Cards" });
  fCards.addInput(C.cards, "heightVh", { min: 300, max: 600, step: 20 }).on("change", scheduleRefresh);
  fCards.addInput(C.cards, "flipDuration", { min: 1, max: 3, step: 0.1 }).on("change", scheduleRefresh);
  fCards.addInput(C.cards, "holdPerCard", { min: 0.5, max: 3, step: 0.1 }).on("change", scheduleRefresh);
  fCards.addInput(C.cards, "finalHold", { min: 2, max: 8, step: 0.5 }).on("change", scheduleRefresh);

  const fOutlook = pane.addFolder({ title: "Outlook" });
  fOutlook.addInput(C.outlook, "itemHold", { min: 1, max: 4, step: 0.25 }).on("change", scheduleRefresh);

  const fSolution = pane.addFolder({ title: "Solution Intro" });
  fSolution.addInput(C.solutionIntro, "finalHold", { min: 0.5, max: 3, step: 0.25 }).on("change", scheduleRefresh);

  const fStrategy = pane.addFolder({ title: "Strategy" });
  fStrategy.addInput(C.strategy, "endOffset", {
    options: { "220%": "+=220%", "260%": "+=260%", "300%": "+=300%" }
  }).on("change", scheduleRefresh);

  const fResources = pane.addFolder({ title: "Resources" });
  fResources.addInput(C.resources, "pinEnd", {
    options: { "100%": "+=100%", "130%": "+=130%", "160%": "+=160%" }
  }).on("change", scheduleRefresh);

  pane.addButton({ title: "Export Pacing JSON" }).on("click", () => {
    console.log(String.raw`PACING config:\n`, JSON.stringify(globalThis.PACING, null, 2));
    alert("PACING 已輸出到 Console (F12)。請複製備份。");
  });
})();

