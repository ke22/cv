/* Dev dashboard for cv-gsap.html (and cv-v2.html)
   - Toggle with the 🔍 button or press "D"
   - Shows global scroll + per-section ScrollTrigger progress
*/
(function () {
  "use strict";

  function $(sel) {
    return document.querySelector(sel);
  }

  const monitor = $("#debug-monitor");
  const toggleBtn = $("#debug-toggle");
  const closeBtn = $("#debug-monitor-close");

  if (!monitor || !toggleBtn) return;

  const elScrollY = $("#debug-scroll-y");
  const elViewportH = $("#debug-viewport-h");
  const elDocH = $("#debug-doc-h");
  const elGlobalProgress = $("#debug-global-progress");
  const elSectionsList = $("#debug-sections-list");
  const elTriggersList = $("#debug-triggers-list");

  let visible = false;

  function setVisible(next) {
    visible = next;
    monitor.classList.toggle("is-visible", visible);
    monitor.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  function toggleVisible() {
    setVisible(!visible);
  }

  toggleBtn.addEventListener("click", toggleVisible);
  if (closeBtn) closeBtn.addEventListener("click", () => setVisible(false));

  window.addEventListener("keydown", (e) => {
    if (e.key === "d" || e.key === "D") toggleVisible();
    if (e.key === "Escape") setVisible(false);
  });

  function clamp01(n) {
    return Math.max(0, Math.min(1, n));
  }

  function getGlobalProgress() {
    const scrollY = window.scrollY || 0;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    return clamp01(scrollY / maxScroll);
  }

  function formatNum(n) {
    return typeof n === "number" && Number.isFinite(n) ? String(Math.round(n)) : "—";
  }

  function formatProgress(p) {
    return typeof p === "number" && Number.isFinite(p) ? p.toFixed(3) : "—";
  }

  function hasCvV2() {
    return Boolean(document.querySelector(".scene"));
  }

  function renderTriggers() {
    if (!window.ScrollTrigger) return;

    const all = window.ScrollTrigger.getAll();
    const pinTriggers = all
      .filter((t) => t && t.vars && t.vars.pin)
      .map((t) => {
        const trigger = t.vars.trigger;
        const sel =
          typeof trigger === "string"
            ? trigger
            : trigger && trigger.className
              ? "." + String(trigger.className).split(" ").join(".")
              : "[element]";
        const progress = typeof t.progress === "number" ? t.progress : 0;
        const start = typeof t.start === "number" ? t.start : NaN;
        const end = typeof t.end === "number" ? t.end : NaN;
        const status =
          window.scrollY < start ? "pending" : window.scrollY > end ? "exited" : "active";
        return { label: sel, progress, start, end, status };
      });

    const cvv2StepTriggers = all
      .filter((t) => {
        const id = t && t.vars && typeof t.vars.id === "string" ? t.vars.id : "";
        if (id.startsWith("cvv2-step-")) return true;
        const trigger = t && t.vars ? t.vars.trigger : null;
        return Boolean(trigger && trigger.classList && (trigger.classList.contains("cvv2-step") || trigger.classList.contains("scene")));
      })
      .map((t) => {
        const id = t && t.vars && typeof t.vars.id === "string" ? t.vars.id : "cvv2-step";
        const progress = typeof t.progress === "number" ? t.progress : 0;
        const start = typeof t.start === "number" ? t.start : NaN;
        const end = typeof t.end === "number" ? t.end : NaN;
        const status =
          window.scrollY < start ? "pending" : window.scrollY > end ? "exited" : "active";
        return { label: id, progress, start, end, status };
      });

    function rowHtml(t) {
      const statusClass =
        t.status === "active"
          ? "debug-trigger--active"
          : t.status === "pending"
            ? "debug-trigger--pending"
            : "debug-trigger--exited";

      return (
        `<div class="debug-monitor__item ${statusClass}">` +
        `<span><strong>${t.label}</strong></span>` +
        `<span>${formatProgress(t.progress)}</span>` +
        `</div>`
      );
    }

    if (elTriggersList) {
      const parts = [];

      if (hasCvV2()) {
        parts.push(
          `<div class="debug-monitor__item"><span><strong>cv-v2 steps</strong></span><span>progress</span></div>`
        );
        parts.push((cvv2StepTriggers.length ? cvv2StepTriggers : [{ label: "—", progress: NaN, status: "pending" }]).map(rowHtml).join(""));
      }

      parts.push(
        `<div class="debug-monitor__item"><span><strong>pinned triggers</strong></span><span>progress</span></div>`
      );
      parts.push((pinTriggers.length ? pinTriggers : [{ label: "—", progress: NaN, status: "pending" }]).map(rowHtml).join(""));

      elTriggersList.innerHTML = parts.join("");
    }
  }

  function renderSections() {
    if (!window.ScrollTrigger) return;

    let rows = [];

    if (hasCvV2()) {
      const steps = Array.from(document.querySelectorAll(".scene"));
      rows = steps.map((el, idx) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        const id = el.id ? `#${el.id}` : "";
        const label = `Scene ${String(idx + 1).padStart(2, "0")} ${id}`.trim();
        return { label, inView, top: rect.top, bottom: rect.bottom };
      });
    } else {
      const sectionIds = [
        "intro",
        "cards",
        "problem",
        "future-outlook",
        "solution",
        "growth",
        "strategy",
        "resources",
        "contact",
      ];

      rows = sectionIds
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const inView = rect.top < window.innerHeight && rect.bottom > 0;
          return { label: `#${id}`, inView, top: rect.top, bottom: rect.bottom };
        })
        .filter(Boolean);
    }

    if (elSectionsList) {
      elSectionsList.innerHTML = rows
        .map((r) => {
          const statusClass = r.inView ? "debug-trigger--active" : "debug-trigger--pending";
          return (
            `<div class="debug-monitor__item ${statusClass}">` +
            `<span><strong>${r.label}</strong></span>` +
            `<span>${r.inView ? "in-view" : "off"}</span>` +
            `</div>`
          );
        })
        .join("");
    }
  }

  function tick() {
    if (!visible) return;

    if (elScrollY) elScrollY.textContent = formatNum(window.scrollY || 0);
    if (elViewportH) elViewportH.textContent = formatNum(window.innerHeight || 0);
    if (elDocH) elDocH.textContent = formatNum(document.documentElement.scrollHeight || 0);
    if (elGlobalProgress) elGlobalProgress.textContent = formatProgress(getGlobalProgress());

    renderSections();
    renderTriggers();
  }

  // Update ~10fps when visible (cheap + readable)
  setInterval(tick, 100);

  // Default: hidden (same as original cv.html)
  setVisible(false);
})();

