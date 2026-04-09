/* CV v2 - Sequential Sticky Sections Controller */
(function () {
  "use strict";

  gsap.registerPlugin(ScrollTrigger);

  // Pacing backend: track scene timelines/triggers so we can rebuild from window.PACING.
  let activeTriggers = [];
  let activeTimelines = [];

  function registerTimeline(tl) {
    if (!tl) return;
    activeTimelines.push(tl);
    if (tl.scrollTrigger) activeTriggers.push(tl.scrollTrigger);
  }

  function registerTrigger(tr) {
    if (!tr) return;
    activeTriggers.push(tr);
  }

  function killScenes() {
    activeTriggers.forEach(t => t.kill && t.kill());
    activeTimelines.forEach(t => t.kill && t.kill());
    activeTriggers = [];
    activeTimelines = [];
  }

  /* prefers-reduced-motion (spec 3): skip heavy staggers and scene-blur */
  const prefersReducedMotion = typeof window !== "undefined" &&
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const staggerDur = prefersReducedMotion ? 0 : 0.05;
  const scrubDur = prefersReducedMotion ? 0 : 0.5;

  // 1. Progress Bar
  gsap.to(".progress-bar__fill", {
    scaleX: 1,
    transformOrigin: "left center",
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: true
    }
  });

  // 2. Navigation Active State
  const sections = document.querySelectorAll("section[id]");
  const navBtns = document.querySelectorAll(".nav__dot-btn");
  const mobileLinks = document.querySelectorAll(".mobile-modal__link");

  function setActiveNav(id) {
    navBtns.forEach(btn => btn.classList.toggle("active", btn.dataset.section === id));
    mobileLinks.forEach(link => {
      const href = link.getAttribute("href").substring(1);
      link.classList.toggle("active", href === id);
    });
  }

  sections.forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onEnter: () => setActiveNav(section.id),
      onEnterBack: () => setActiveNav(section.id)
    });
  });

  // 3. Kinetic Title (Intro)
  const titleChars = document.querySelectorAll(".hero__title .char");
  if (titleChars.length && !prefersReducedMotion) {
    gsap.from(titleChars, {
      y: 100,
      opacity: 0,
      rotate: 15,
      stagger: staggerDur,
      duration: 1,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: "#intro",
        start: "top 60%"
      }
    });
  }

  // 3b. Problem: "I'm so panic!" gray text, highlight letter-by-letter in white
  function initProblemScene(C) {
    if (prefersReducedMotion) return;
    const problemTitle = document.querySelector("#problem .problem__title");
    const scrollContainer = document.querySelector("#problem .scroll-container");
    if (!problemTitle) return;

    // Apply dynamic height from pacing config (vh)
    if (scrollContainer && C.problem && typeof C.problem.heightVh === "number") {
      scrollContainer.style.height = C.problem.heightVh + "vh";
    }

    // Reset text from aria-label or existing text, then split into chars
    const baseText = problemTitle.getAttribute("aria-label") || problemTitle.textContent || "";
    problemTitle.textContent = "";
    for (let i = 0; i < baseText.length; i++) {
      const span = document.createElement("span");
      span.className = "problem__title-char";
      span.textContent = baseText[i];
      span.setAttribute("aria-hidden", "true");
      problemTitle.appendChild(span);
    }
    const chars = problemTitle.querySelectorAll(".problem__title-char");
    const tlProblem = gsap.timeline({
      scrollTrigger: {
        trigger: "#problem",
        start: "top 80%",
        end: "top 0%",
        scrub: C.global ? C.global.scrubSmooth : 0.8
      }
    });
    const stagger = (C.problem && typeof C.problem.textStagger === "number") ? C.problem.textStagger : 0.18;
    chars.forEach((char, i) => {
      tlProblem.to(char, {
        duration: 0.2,
        ease: "none",
        onStart: function () { char.classList.add("highlight"); }
      }, i * stagger);
    });
    registerTimeline(tlProblem);
  }

  // 4. Cards Sequence (Consolidated)
  function initCardsScene(C) {
    const cardsSection = document.querySelector("#cards");
    if (!cardsSection || prefersReducedMotion || !C.cards || !C.cards.pin) return;
    const wrappers = cardsSection.querySelectorAll(".flip-card-wrapper");
    const cards = cardsSection.querySelectorAll(".flip-card");
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardsSection,
        start: "top top",
        end: "bottom bottom",
        scrub: C.global ? C.global.scrubSmooth : scrubDur,
        pin: true
      }
    });

    tl.to(wrappers, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: prefersReducedMotion ? 0 : 0.1
    });

    const flipDur = C.cards.flipDuration || 2.5;
    const holdPerCard = C.cards.holdPerCard || 1.5;
    const finalHold = C.cards.finalHold || 4;

    tl.to(cards[0], {
      rotateY: 180,
      duration: flipDur,
      ease: "power1.inOut"
    }, "+=0.5");
    tl.to({}, { duration: holdPerCard });

    tl.to(cards[1], {
      rotateY: 180,
      duration: flipDur,
      ease: "power1.inOut"
    }, "+=0.5");
    tl.to({}, { duration: holdPerCard });

    tl.to(cards[2], {
      rotateY: 180,
      duration: flipDur,
      ease: "power1.inOut"
    }, "+=0.5");
    tl.to({}, { duration: finalHold });

    registerTimeline(tl);
  }

  function initOutlookScene(C) {
    const outlookSection = document.querySelector("#future-outlook");
    if (!outlookSection) return;
    const textItems = outlookSection.querySelectorAll(".outlook-text-item");
    const circleS = outlookSection.querySelector(".future-circle--small");
    const circleM = outlookSection.querySelector(".future-circle--medium");
    const circleL = outlookSection.querySelector(".future-circle--large");
    const circles = [circleS, circleM, circleL];
    gsap.set(circles, { scale: 0, opacity: 1 });
    gsap.set(textItems, { opacity: 0, y: 40 });
    /* Running number targets per item: 36.5, 2.99, 60.5 (spec 8.2) */
    const valueTargets = [36.5, 2.99, 60.5];
    const cfg = C.outlook || {};
    const st = {
      trigger: outlookSection,
      start: "top top",
      end: cfg.endOffset || "+=320%",
      pin: cfg.pin !== false,
      scrub: C.global ? C.global.scrubSmooth : 1
    };
    st.onEnter = function () { outlookSection.classList.add("outlook-pinned"); };
    st.onLeaveBack = st.onLeave = function () { outlookSection.classList.remove("outlook-pinned"); };
    const mainTl = gsap.timeline({ scrollTrigger: st });
    /* Curve text (SVG textPath) – one per circle, same order as valueTargets */
    const curveTextEls = circles.map((c) => c && c.querySelector("textPath"));
    const stackingTl = gsap.timeline();
    textItems.forEach((text, i) => {
      stackingTl
        .to(text, { opacity: 1, y: 0, duration: 1 })
        .to(circles[i], { scale: 1, duration: 1, ease: "back.out(1.2)" }, "<");
      /* Running number: text column + curved SVG numbers count up together */
      const valElsInItem = text.querySelectorAll(".future-outlook__value");
      const curveEl = curveTextEls[i];
      if ((valElsInItem.length || curveEl) && valueTargets[i] != null) {
        const endVal = valueTargets[i];
        const fmt = (v) => (endVal >= 10 ? v.toFixed(1) : v.toFixed(2)) + (endVal >= 10 ? "%" : "");
        valElsInItem.forEach(el => gsap.set(el, { textContent: fmt(0) }));
        if (curveEl) curveEl.textContent = fmt(0);
        const obj = { v: 0 };
        stackingTl.to(obj, {
          v: endVal,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () => {
            const s = fmt(obj.v);
            valElsInItem.forEach(el => { el.textContent = s; });
            if (curveEl) curveEl.textContent = s;
          }
        }, "<");
      }
      /* Keep title + curve text visible longer before next (reader can read) */
      if (i < textItems.length - 1) {
        const hold = cfg.itemHold || 2;
        stackingTl.to(text, { opacity: 0, y: -30, duration: 0.8 }, "+=" + hold);
      }
    });
    const leftCol = outlookSection.querySelector(".outlook-text-col");
    const wipeTl = gsap.timeline();
    wipeTl.to(".curve-text", { opacity: 0, duration: 0.5 });
    if (leftCol) wipeTl.to(leftCol, { opacity: 0, duration: 0.6, ease: "power2.in" }, "<");
    wipeTl.to(circleL, { scale: 15, duration: 2, ease: "power2.in" }, "<")
          .to(circleM, { scale: 25, duration: 2, ease: "power2.in" }, "-=1.8")
          .to(circleS, { scale: 40, duration: 2, ease: "power2.in" }, "-=1.8");
    mainTl.add(stackingTl).add(wipeTl, "+=0.5");
    /* Fade circles and section so next scene pre-shows during fade */
    mainTl.to([circles, outlookSection], { opacity: 0, duration: 1.2, ease: "power2.inOut" }, "+=0.3");

    registerTimeline(mainTl);
  }

  /* Problem section fade when circles effect triggers (Future Outlook at top) */
  const problemContent = document.querySelector("#problem .problem-content");
  if (problemContent) {
    ScrollTrigger.create({
      trigger: "#future-outlook",
      start: "top top",
      onEnter: () => gsap.to(problemContent, { opacity: 0, duration: 0.5 }),
      onLeaveBack: () => gsap.to(problemContent, { opacity: 1, duration: 0.3 })
    });
  }

  function initSolutionScene(C) {
    const solutionSection = document.querySelector("#solution");
    if (solutionSection) {
      const chars = solutionSection.querySelectorAll(".solution-text__title--disintegrate .char");
      const subText = solutionSection.querySelector(".solution-text__sub");
      gsap.fromTo(solutionSection,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: solutionSection,
            start: "top 85%",
            end: "top 20%",
            scrub: true
          }
        }
      );
      const tlText = gsap.timeline({
        scrollTrigger: {
          trigger: solutionSection,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 1
        }
      });
      if (chars.length > 0) {
        tlText.to(chars, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          stagger: 0.05,
          duration: 1,
          ease: "back.out(1.7)"
        });
      }
      tlText.to(subText, { opacity: 1, y: 0, duration: 1 }, ">-0.5");
      const hold = (C.solutionIntro && C.solutionIntro.finalHold) || 1.5;
      tlText.to({}, { duration: hold });

      registerTimeline(tlText);
    }
    const matrixSection = document.querySelector("#solution-matrix");
    if (matrixSection) {
      const matrixVisual = matrixSection.querySelector(".solution-matrix__visual");
      const matrixList = matrixSection.querySelector(".solution-matrix__items");
      const h1Group = matrixSection.querySelector("#h1-group");
      const h2Group = matrixSection.querySelector("#h2-group");
      const h3Group = matrixSection.querySelector("#h3-group");
      const itemH1 = matrixSection.querySelector("#item-h1");
      const itemH2 = matrixSection.querySelector("#item-h2");
      const itemH3 = matrixSection.querySelector("#item-h3");
      if (matrixVisual && matrixList) {
        const tlMatrix = gsap.timeline({
          scrollTrigger: {
            trigger: matrixSection,
            start: "top top",
            end: "+=200%",
            pin: true,
            scrub: 0.8
          }
        });
        tlMatrix.from(matrixVisual, { x: -50, opacity: 0, duration: 2 })
          .from(matrixList, { x: 50, opacity: 0, duration: 2 }, "<");
        if (h1Group && itemH1) {
          tlMatrix.addLabel("h1_start")
            .to(h1Group, { opacity: 1, duration: 1 }, "h1_start+=0.5")
            .to(itemH1, { opacity: 1, duration: 1 }, "<");
        }
        if (h2Group && itemH2) {
          tlMatrix.addLabel("h2_start")
            .to(h2Group, { opacity: 1, duration: 1 }, "h2_start+=1.5")
            .to(itemH2, { opacity: 1, duration: 1 }, "<");
        }
        if (h3Group && itemH3) {
          tlMatrix.addLabel("h3_start")
            .to(h3Group, { opacity: 1, duration: 1 }, "h3_start+=1.5")
            .to(itemH3, { opacity: 1, duration: 1 }, "<");
        }
        tlMatrix.to({}, { duration: 2 });

        registerTimeline(tlMatrix);
      }
    }
  }

  function initResourcesScene(C) {
    const resourcesSection = document.querySelector("#resources");
    if (!resourcesSection || prefersReducedMotion) return;
    const cfg = C.resources || {};
    const tr = ScrollTrigger.create({
      trigger: resourcesSection,
      start: "top top",
      end: cfg.pinEnd || "+=130%",
      pin: cfg.pin !== false,
      pinSpacing: true
    });
    registerTrigger(tr);
  }

  function initScenes() {
    killScenes();
    const C = window.PACING || {};
    initProblemScene(C);
    initCardsScene(C);
    initOutlookScene(C);
    initSolutionScene(C);
    initMatrices();
    initResourcesScene(C);
    ScrollTrigger.refresh();
  }

  // 5–9. Initialize all pacing-controlled scenes once on load
  initScenes();
  // Expose rebuild hook for pacing-panel.js
  window.rebuildScenes = initScenes;

  // 6b. Growth Strategy – no sticky; extra scroll height so reader can stop and read
  // (Pin removed; scroll-container height in HTML gives read time.)

  function initMatrices() {
    function createMatrixTimeline(sectionSelector, bubbleSelector) {
      const section = document.querySelector(sectionSelector);
      if (!section) return;
      const animElements = section.querySelectorAll(".anim-text, .anim-visual");
      const targetBubble = section.querySelector(bubbleSelector);
      if (!targetBubble) return;
      gsap.set(animElements, { opacity: 0, y: 50 });
      gsap.set(targetBubble, { opacity: 0.2, scale: 1 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1
        }
      });
      tl.to(animElements, {
        opacity: 1,
        y: 0,
        duration: 2,
        stagger: 0.2
      }, 0);
      tl.to(targetBubble, {
        opacity: 1,
        scale: 1.15,
        transformOrigin: "center center",
        duration: 2,
        ease: "power2.out"
      }, 0);
      tl.to({}, { duration: 4 });
    }
    createMatrixTimeline("#resource-fit", "#rf-h2-bubble");
    createMatrixTimeline("#opportunity-matrix", "#om-h2-bubble");
  }

  // 8. Strategy Tree (Scene 14) – robust module: SVG by JS, gap-ratio turn, debounced resize
  if (typeof window.StrategyTree !== "undefined") {
    new window.StrategyTree("#strategy");
  }

  // 9. Resources Books – separate fly-in per book (each at different scroll position)
  const books = document.querySelectorAll(".resources__book");
  const resourcesSectionForBooks = document.querySelector("#resources");
  if (books.length && resourcesSectionForBooks && !prefersReducedMotion) {
    books.forEach((book, i) => {
      gsap.set(book, { y: -180 - i * 20, opacity: 0 });
      gsap.to(book, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: resourcesSectionForBooks,
          start: "top " + (75 - i * 12) + "%",
          end: "top 30%",
          scrub: 0.8
        }
      });
    });
  }

  // 10. Resources hover: same z-order, target zooms slightly, siblings zoom out a little (no jump to front)
  const resourceBlocks = document.querySelectorAll("#resources .resources__link-block[data-target]");
  resourceBlocks.forEach(block => {
    const targetId = block.getAttribute("data-target");
    const targetImg = targetId ? document.getElementById(targetId) : null;
    if (!targetImg) return;
    block.addEventListener("mouseenter", () => {
      gsap.to(targetImg, { scale: 1.05, duration: 0.3, ease: "power2.out" });
    });
    block.addEventListener("mouseleave", () => {
      gsap.to(books, { scale: 1, duration: 0.3 });
    });
  });

  // Mobile Nav Toggle
  const mobileHeader = document.querySelector(".mobile-nav__header");
  const mobileModal = document.querySelector(".mobile-modal");
  const closeBtn = document.querySelector(".mobile-modal__close");
  
  if (mobileHeader && mobileModal) {
    mobileHeader.addEventListener("click", () => {
      mobileModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
    closeBtn.addEventListener("click", () => {
      mobileModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    });
    mobileModal.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      });
    });
  }

})();
