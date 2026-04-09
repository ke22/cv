// js/StrategyTree.js – Robust strategy tree: SVG created by JS, gap-ratio turn, debounced resize
(function() {

  class StrategyTree {
    constructor(selector, options = {}) {
      this.container = document.querySelector(selector);
      if (!this.container) {
        console.warn("StrategyTree: Container " + selector + " not found.");
        return;
      }

      this.wrapper = this.container.querySelector(".tree-wrapper");
      if (!this.wrapper) return;

      /* Read data-* config from wrapper (spec 6.1) */
      const ds = this.wrapper.dataset;
      const lineWidthVal = options.lineWidth ?? (ds.lineWidth ? Number.parseFloat(ds.lineWidth) : 1.5);
      const turnRatioVal = options.turnRatio ?? (ds.turnRatio ? Number.parseFloat(ds.turnRatio) : 0.5);
      const minStemVal = options.minStem ?? (ds.minStem ? Number.parseInt(ds.minStem, 10) : 20);
      this.options = {
        lineColor: options.lineColor || ds.lineColor || "#525252",
        lineWidth: lineWidthVal,
        turnRatio: turnRatioVal,
        minStem: minStemVal,
        ...options
      };

      this.connections = [
        ["node-root", "node-path-1"],
        ["node-root", "node-path-2"],
        ["node-path-1", "node-act-1"],
        ["node-path-1", "node-act-2"],
        ["node-path-2", "node-act-3"],
        ["node-path-2", "node-act-4"],
        ["node-act-1", "node-ind-1"],
        ["node-act-2", "node-ind-2"],
        ["node-act-3", "node-ind-3"],
        ["node-act-4", "node-ind-4"]
      ];

      this.resizeTimer = null;
      this.init();
    }

    init() {
      this.createSVG();

      document.fonts.ready.then(() => {
        this.drawAll();
        this.initAnimation();
      });

      window.addEventListener("resize", () => {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
          this.drawAll();
          if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
        }, 100);
      });
    }

    createSVG() {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.classList.add("tree-lines");
      svg.setAttribute("aria-hidden", "true");
      svg.style.cssText = "width:100%; height:100%; position:absolute; top:0; left:0; overflow:visible; pointer-events:none; z-index:1;";

      this.connections.forEach(([start, end], index) => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("id", "line-" + start + "-" + end);
        let level = 1;
        if (index >= 2) level = 2;
        if (index >= 6) level = 3;
        path.setAttribute("class", "line-path level-" + level);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", this.options.lineColor);
        path.setAttribute("stroke-width", String(this.options.lineWidth));
        svg.appendChild(path);
      });

      this.wrapper.prepend(svg);
    }

    drawPath(startId, endId) {
      const startElem = document.getElementById(startId);
      const endElem = document.getElementById(endId);
      const lineElem = document.getElementById("line-" + startId + "-" + endId);

      if (!startElem || !endElem || !lineElem) return;

      const cRect = this.wrapper.getBoundingClientRect();
      const sRect = startElem.getBoundingClientRect();
      const eRect = endElem.getBoundingClientRect();

      // [修正 1] 加大重疊量 4px，確保線條插入卡片背後，消除反鋸齒縫隙
      const x1 = (sRect.right - cRect.left) - 4;
      const y1 = sRect.top - cRect.top + (sRect.height / 2);
      const x2 = (eRect.left - cRect.left) + 4;
      const y2 = eRect.top - cRect.top + (eRect.height / 2);

      const finalY2 = Math.abs(y1 - y2) < 3 ? y1 : y2;
      // Turn distance from config (data-turn-ratio, data-min-stem) or default 40px (spec 6.3)
      const gap = 60;
      const turnDistance = Math.max(gap * (this.options.turnRatio ?? 0.5), this.options.minStem ?? 20);
      const turnX = (sRect.right - cRect.left) + turnDistance;

      // [修正 3] 解決線條重疊：下方分支只畫後半段
      const isBottomBranch =
        (startId === "node-root" && endId === "node-path-2") ||
        (startId === "node-path-1" && endId === "node-act-2") ||
        (startId === "node-path-2" && endId === "node-act-4");

      let d;
      if (isBottomBranch) {
        d = "M " + turnX + " " + y1 + " L " + turnX + " " + finalY2 + " L " + x2 + " " + finalY2;
      } else {
        d = "M " + x1 + " " + y1 + " L " + turnX + " " + y1 + " L " + turnX + " " + finalY2 + " L " + x2 + " " + finalY2;
      }

      lineElem.setAttribute("d", d);
    }

    drawAll() {
      this.connections.forEach((pair) => this.drawPath(pair[0], pair[1]));
    }

    initAnimation() {
      if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

      const paths = this.wrapper.querySelectorAll("path");
      paths.forEach((path) => {
        const len = path.getTotalLength() || 1000;
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: this.container,
          start: "top top",
          end: "+=260%",
          pin: true,
          scrub: 1,
          onRefresh: () => this.drawAll()
        }
      });

      tl.to(".anim-header", { opacity: 1, duration: 1 })
        .fromTo(".anim-root", { opacity: 0, x: -30 }, { opacity: 1, x: 0 }, "<0.2")
        // Pause briefly on root card before paths
        .to({}, { duration: 0.5 })
        .fromTo([".anim-path-1", ".anim-path-2"], { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, stagger: 0.1 }, ">0.5")
        .to(".level-1", { strokeDashoffset: 0, duration: 1.5, ease: "none" }, "<0.2")
        // Pause on paths + level-1 lines before showing actions
        .to({}, { duration: 0.5 })
        .to(".level-2", { strokeDashoffset: 0, duration: 1.5, ease: "none" })
        .fromTo(".card-action, .card-action-sub", { opacity: 0, x: -10 }, { opacity: 1, x: 0, stagger: 0.1 }, "<0.5")
        // Pause on actions before indicators
        .to({}, { duration: 0.5 })
        .to(".level-3", { strokeDashoffset: 0, duration: 1.5, ease: "none" })
        .fromTo(".indicator-text", { opacity: 0 }, { opacity: 1, stagger: 0.1 }, "<0.5");

      tl.to({}, { duration: 1 });
    }
  }

  if (typeof globalThis !== "undefined") {
    globalThis.StrategyTree = StrategyTree;
  }

})();
