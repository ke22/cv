/**
 * CV Scrollytelling - Clean Rebuild
 * 
 * 核心體驗原則實作：
 * 1. 節奏感與滑動阻尼 - scrub: 1.2 (追蹤延遲時間)
 * 2. 留白呼吸感 - timeline 中的 hold 區間
 * 3. 視覺錨點的一致性 - 固定容器位置
 * 4. 避免捲動地獄 - 控制合理的滾動距離
 * 5. 進度回饋 - 進度條即時更新
 * 6. 標題淡出 - 確保只有一個主要標題清晰可讀
 * 7. 行動端適配與無障礙 - reduced-motion 支援
 */

(function() {
  'use strict';

  // ============================================
  // Check for reduced motion preference
  // ============================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Skip all scroll animations for accessibility
    document.querySelectorAll('.hero__title, .hero__desc, .hero__cta, .hero__panic-text, .hero__panic-sub').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.flip-card-wrapper').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.problem__title, .problem__subtitle').forEach(el => el.classList.add('visible'));
    // Future Outlook: show first title item
    const firstFutureTitle = document.querySelector('.future-outlook__title-item[data-title="1"]');
    if (firstFutureTitle) firstFutureTitle.classList.add('active');
    document.querySelectorAll('.solution-text__item').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.solution-matrix__visual, .solution-matrix__items').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.solution-resource-fit__title-wrap, .solution-resource-fit__visual').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.solution-opportunity__title-wrap, .solution-opportunity__visual').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.growth__title, .growth__svg').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.strategy__heading, .strategy__svg').forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.resources__heading, .resources__link-block, .resources__book').forEach(el => el.classList.add('visible'));
    return;
  }

  // ============================================
  // Register GSAP Plugins
  // ============================================
  gsap.registerPlugin(ScrollTrigger);

  // ============================================
  // Global Configuration
  // ============================================
  const CONFIG = {
    scrubDelay: 1.2,      // 追蹤延遲時間 (高級感來源)
    scrubDelayFast: 0.8,  // 較快的追蹤延遲
    breathingHold: 0.15,  // 呼吸感留白比例 (15% of timeline)
    debug: false          // Set to true to see ScrollTrigger markers
  };

  // Debug is OFF by default. Enable by either:
  // - setting CONFIG.debug = true, or
  // - adding `?debug=1` to the URL
  const DEBUG_ENABLED = CONFIG.debug || new URLSearchParams(window.location.search).get('debug') === '1';

  function debugLog(...args) {
    if (!DEBUG_ENABLED) return;
    // eslint-disable-next-line no-console
    console.log(...args);
  }

  // ============================================
  // Progress Bar (進度回饋)
  // ============================================
  function initProgressBar() {
    const progressFill = document.querySelector('.progress-bar__fill');
    if (!progressFill) return;

    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progressFill.style.transform = `scaleX(${self.progress})`;
      }
    });
  }

  // ============================================
  // Navigation Active State
  // ============================================
  function initNavigation() {
    const navButtons = document.querySelectorAll('.nav__dot-btn');
    const mobileLinks = document.querySelectorAll('.mobile-modal__link');
    const sections = ['intro', 'cards', 'problem', 'solution', 'growth', 'contact'];

    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => updateNavActive(sectionId),
        onEnterBack: () => updateNavActive(sectionId)
      });
    });

    function updateNavActive(activeId) {
      navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === activeId);
      });
      mobileLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
      });
      // Update mobile nav label
      const mobileLabel = document.querySelector('.mobile-nav__label');
      if (mobileLabel) {
        const activeBtn = document.querySelector(`.nav__dot-btn[data-section="${activeId}"]`);
        if (activeBtn) {
          mobileLabel.textContent = activeBtn.querySelector('.nav__label')?.textContent || 'CV Portfolio';
        }
      }
    }

    // Click handlers
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.section;
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Mobile menu toggle
    const mobileHeader = document.querySelector('.mobile-nav__header');
    const mobileModal = document.querySelector('.mobile-modal');
    const mobileClose = document.querySelector('.mobile-modal__close');
    const mobileModalContent = document.querySelector('.mobile-modal__content');

    function openMobileMenu() {
      if (!mobileHeader || !mobileModal) return;
      mobileHeader.setAttribute('aria-expanded', 'true');
      mobileModal.classList.add('active');
      mobileModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-modal-open');
      mobileClose?.focus();
    }

    function closeMobileMenu() {
      if (!mobileHeader || !mobileModal) return;
      mobileHeader.setAttribute('aria-expanded', 'false');
      mobileModal.classList.remove('active');
      mobileModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-modal-open');
      mobileHeader.focus();
    }

    if (mobileHeader && mobileModal) {
      // Ensure default a11y state
      if (!mobileModal.hasAttribute('aria-hidden')) mobileModal.setAttribute('aria-hidden', 'true');

      mobileHeader.addEventListener('click', () => {
        const isExpanded = mobileHeader.getAttribute('aria-expanded') === 'true';
        if (isExpanded) closeMobileMenu();
        else openMobileMenu();
      });

      mobileClose?.addEventListener('click', closeMobileMenu);

      // Close when clicking outside the panel
      mobileModal.addEventListener('click', (e) => {
        if (!mobileModalContent) return;
        const target = e.target;
        if (target instanceof Node && !mobileModalContent.contains(target)) {
          closeMobileMenu();
        }
      });

      // Close on ESC
      addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileHeader.getAttribute('aria-expanded') === 'true') {
          closeMobileMenu();
        }
      });

      mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
      });
    }
  }

  // ============================================
  // Optional: Sticky Trigger Monitor (debug only)
  // ============================================
  function initStickyMonitor() {
    if (!DEBUG_ENABLED) return;

    const cfg = {
      stickySelectors: ['.sticky-stage', '[class*="sticky-stage"]', '[class*="sticky"]', '[id*="sticky"]'],
      maxStickies: 60,
      hotkey: 'd',
    };

    let enabled = false;
    let stickies = [];
    let badges = [];
    let raf = 0;

    const panel = document.createElement('div');
    panel.style.cssText =
      'position:fixed;left:12px;bottom:12px;z-index:100000;background:rgba(0,0,0,.75);color:#fff;' +
      'padding:10px 12px;border-radius:10px;font:12px/1.25 ui-monospace,Menlo,Consolas,monospace;' +
      'border:1px solid rgba(0,255,255,.6);max-width:360px';
    document.body.appendChild(panel);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.style.cssText =
      'position:fixed;right:20px;bottom:90px;z-index:100001;background:rgba(0,0,0,.75);color:#fff;' +
      'padding:10px 14px;border-radius:10px;border:2px solid rgba(0,255,255,.8);cursor:pointer;' +
      'font:700 13px/1 system-ui,-apple-system,Segoe UI,Roboto,Arial;box-shadow:0 10px 25px rgba(0,0,0,.25)';
    document.body.appendChild(btn);

    function label(el) {
      const id = el.id ? `#${el.id}` : '';
      const cls = (el.className || '').toString().trim().split(/\s+/).filter(Boolean);
      const main = cls.find(c => c.includes('sticky-stage')) || cls.find(c => c.includes('sticky')) || cls[0] || 'sticky';
      return `${main}${id ? ' ' + id : ''}`;
    }

    function findStickies() {
      const nodes = Array.from(document.querySelectorAll(cfg.stickySelectors.join(',')));
      const computed = nodes.filter(el => {
        try { return getComputedStyle(el).position === 'sticky'; } catch { return false; }
      });

      const seen = new Set();
      stickies = [];
      for (const el of computed) {
        if (!el || seen.has(el)) continue;
        seen.add(el);
        stickies.push(el);
        if (stickies.length >= cfg.maxStickies) break;
      }
    }

    function findScrollContainer(stickyEl) {
      let node = stickyEl;
      while (node && node !== document.body) {
        if (node.classList) {
          for (const c of Array.from(node.classList)) {
            if (c.includes('scroll-container')) return node;
          }
        }
        node = node.parentElement;
      }
      return stickyEl.closest('section') || stickyEl.parentElement || document.body;
    }

    function compute(stickyEl) {
      const container = findScrollContainer(stickyEl);
      const rect = container.getBoundingClientRect();
      const top = rect.top + scrollY;
      const height = container.offsetHeight || rect.height || 0;

      const start = top;
      const end = top + Math.max(0, height - innerHeight);
      const range = Math.max(1, end - start);

      const p = Math.max(0, Math.min(1, (scrollY - start) / range));
      const active = scrollY >= start && scrollY <= end;
      return { start, end, p, active };
    }

    function clearBadges() {
      badges.forEach(b => b && b.remove());
      badges = [];
    }

    function ensureBadges() {
      clearBadges();
      stickies.forEach(el => {
        const b = document.createElement('div');
        b.style.cssText =
          'position:absolute;top:12px;left:12px;z-index:100002;pointer-events:none;' +
          'background:rgba(0,0,0,.70);color:rgba(255,255,255,.95);padding:8px 10px;border-radius:8px;' +
          'border:1px solid rgba(0,255,255,.6);font:11px/1.25 ui-monospace,Menlo,Consolas,monospace;' +
          'max-width:320px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';

        if (getComputedStyle(el).position === 'static') el.style.position = 'relative';

        el.appendChild(b);
        badges.push(b);
      });
    }

    function render() {
      if (!enabled) return;

      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const pagePct = Math.round((scrollY / max) * 1000) / 10;

      for (let i = 0; i < stickies.length; i++) {
        const el = stickies[i];
        const b = badges[i];
        if (!el || !b) continue;

        const { start, end, p, active } = compute(el);
        const pct = Math.round(p * 1000) / 10;

        b.style.borderColor = active ? 'rgba(0,255,0,.75)' : 'rgba(0,255,255,.6)';
        b.innerHTML =
          `<div style="font-weight:700;color:${active ? '#00ff00' : '#00ffff'}">${label(el)}</div>` +
          `<div>progress: <span style="color:#fff">${pct}%</span></div>` +
          `<div style="color:rgba(255,255,255,.8)">start: ${Math.round(start)}px · end: ${Math.round(end)}px</div>`;
      }

      panel.innerHTML =
        `<div style="font-weight:700;color:#00ffff">Sticky Monitor</div>` +
        `<div>enabled: ${enabled}</div>` +
        `<div>page: ${pagePct}% · y: ${Math.round(scrollY)}px</div>` +
        `<div>stickies found: ${stickies.length}</div>` +
        (stickies.length === 0
          ? `<div style="margin-top:6px;color:#ffcc00">No sticky elements detected. Check <code>position: sticky</code> + <code>top</code>.</div>`
          : '');

      raf = requestAnimationFrame(render);
    }

    function setEnabled(next) {
      enabled = next;
      btn.textContent = enabled ? 'Triggers: ON' : 'Triggers: OFF';
      btn.style.borderColor = enabled ? 'rgba(0,255,0,.9)' : 'rgba(0,255,255,.8)';

      cancelAnimationFrame(raf);
      clearBadges();

      findStickies();
      if (enabled) {
        ensureBadges();
        render();
      } else {
        panel.innerHTML =
          `<div style="font-weight:700;color:#00ffff">Sticky Monitor</div>` +
          `<div>enabled: false</div>` +
          `<div>stickies found: ${stickies.length}</div>` +
          `<div style="margin-top:6px;color:#bbb">Press "D" or click the button to toggle.</div>`;
      }
    }

    btn.addEventListener('click', () => setEnabled(!enabled));
    addEventListener('keydown', (e) => {
      if (e.key && e.key.toLowerCase() === cfg.hotkey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setEnabled(!enabled);
      }
    });
    addEventListener('resize', () => enabled && (findStickies(), ensureBadges()), { passive: true });

    setEnabled(false);
  }

  // ============================================
  // Section 1: Hero Intro
  // 
  // 節奏：Title → 呼吸 → Description → 呼吸 → CTA
  // ============================================
  function initHeroIntro() {
    const scrollContainer = document.querySelector('.scroll-container--intro');
    const heroTitle = document.querySelector('.hero__title');
    const heroDesc = document.querySelector('.hero__desc');
    const heroCta = document.querySelector('.hero__cta');

    if (!scrollContainer || !heroTitle) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: CONFIG.scrubDelay, // 滑動阻尼
        markers: CONFIG.debug
      }
    });

    const heroPanic = document.querySelector('.hero__panic');
    const heroPanicText = document.querySelector('.hero__panic-text');
    const heroPanicSub = document.querySelector('.hero__panic-sub');

    // Timeline with breathing holds
    tl.to(heroTitle, { opacity: 1, y: 0, duration: 0.2 }, 0)
      .to({}, { duration: CONFIG.breathingHold }) // 呼吸感留白
      .to(heroDesc, { opacity: 1, y: 0, duration: 0.2 })
      .to({}, { duration: CONFIG.breathingHold }) // 呼吸感留白
      .to(heroCta, { opacity: 1, y: 0, duration: 0.2 })
      .to({}, { duration: CONFIG.breathingHold }) // 呼吸感留白
      .to(heroPanicText, { opacity: 1, y: 0, duration: 0.2 }, '+=0.15')
      .to(heroPanicSub, { opacity: 1, y: 0, duration: 0.2 }, '-=0.15')
      .to({}, { duration: CONFIG.breathingHold }); // 呼吸感留白

    // Add visible classes for CSS transitions
    ScrollTrigger.create({
      trigger: scrollContainer,
      start: 'top 80%',
      onEnter: () => {
        heroTitle.classList.add('visible');
        heroDesc?.classList.add('visible');
        heroCta?.classList.add('visible');
        heroPanicText?.classList.add('visible');
        heroPanicSub?.classList.add('visible');
      },
      onLeaveBack: () => {
        heroTitle.classList.remove('visible');
        heroDesc?.classList.remove('visible');
        heroCta?.classList.remove('visible');
        heroPanicText?.classList.remove('visible');
        heroPanicSub?.classList.remove('visible');
      }
    });
  }

  // ============================================
  // Section 2: Flip Cards
  // 
  // 節奏：Card1 出現 → 翻轉 → 呼吸 → Card2 → ...
  // ============================================
  function initFlipCards() {
    const scrollContainer = document.querySelector('.scroll-container--cards');
    const cardWrappers = document.querySelectorAll('.flip-card-wrapper');
    const flipCards = document.querySelectorAll('.flip-card');

    if (!scrollContainer || cardWrappers.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: CONFIG.scrubDelay,
        markers: CONFIG.debug
      }
    });

    // Each card: show → breathe → flip → breathe
    cardWrappers.forEach((wrapper, index) => {
      const card = flipCards[index];
      const startTime = index * 0.25; // Stagger cards

      // Show card
      tl.to(wrapper, { 
        opacity: 1, 
        y: 0, 
        duration: 0.1,
        onStart: () => wrapper.classList.add('visible'),
        onReverseComplete: () => wrapper.classList.remove('visible')
      }, startTime);

      // Breathing hold
      tl.to({}, { duration: CONFIG.breathingHold }, startTime + 0.1);

      // Flip card
      if (card) {
        tl.to(card, { 
          duration: 0.1,
          onStart: () => card.classList.add('flipped'),
          onReverseComplete: () => card.classList.remove('flipped')
        }, startTime + 0.1 + CONFIG.breathingHold);
      }

      // Breathing hold after flip
      tl.to({}, { duration: CONFIG.breathingHold }, startTime + 0.2 + CONFIG.breathingHold);
    });
  }

  // ============================================
  // Section 3: Problem (現況)
  // 
  // 節奏：Title → 呼吸 → Subtitle
  // ============================================
  function initProblem() {
    const scrollContainer = document.querySelector('.scroll-container--problem');
    const title = document.querySelector('.problem__title');
    const subtitle = document.querySelector('.problem__subtitle');

    if (!scrollContainer || !title) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: CONFIG.scrubDelay,
        markers: CONFIG.debug
      }
    });

    // Show title
    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 0.2,
      onStart: () => title.classList.add('visible'),
      onReverseComplete: () => title.classList.remove('visible')
    }, 0);

    // Breathing hold
    tl.to({}, { duration: CONFIG.breathingHold }, 0.2);

    // Show subtitle
    tl.to(subtitle, {
      opacity: 1,
      y: 0,
      duration: 0.2,
      onStart: () => subtitle?.classList.add('visible'),
      onReverseComplete: () => subtitle?.classList.remove('visible')
    }, 0.2 + CONFIG.breathingHold);

    // Final breathing
    tl.to({}, { duration: CONFIG.breathingHold * 2 });
  }

  // ============================================
  // Section 3b: Future Outlook (未來展望)
  // Sequential reveal of three titles: Low Salary Levels → Insufficient → Future Outlook
  // Titles appear in sequence, stacking vertically (not overlapping)
  // ============================================
  function initFutureOutlook() {
    const scrollContainer = document.querySelector('.scroll-container--future-outlook');
    const titleItems = document.querySelectorAll('.future-outlook__title-item');
    const circleSmall = document.querySelector('.future-circle--small');
    const circleMedium = document.querySelector('.future-circle--medium');
    const circleLarge = document.querySelector('.future-circle--large');
    const circles = [circleSmall, circleMedium, circleLarge].filter(Boolean);

    if (!scrollContainer || titleItems.length === 0) return;

    // Set first title as active initially
    titleItems[0].classList.add('active');
    if (circles[0]) circles[0].classList.add('visible');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: CONFIG.scrubDelay,
        markers: CONFIG.debug
      }
    });

    // Each title appears sequentially and stays visible (stacking)
    let currentTime = 0;

    titleItems.forEach((item, index) => {
      // Show current title
      tl.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        onStart: () => item.classList.add('active'),
        onReverseComplete: () => {
          if (index > 0) item.classList.remove('active');
        }
      }, currentTime);

      // Show corresponding circle (cumulative stack: small -> medium -> large)
      const circle = circles[index];
      if (circle) {
        tl.to({}, {
          duration: 0.01,
          onStart: () => circle.classList.add('visible'),
          onReverseComplete: () => {
            if (index > 0) circle.classList.remove('visible');
          }
        }, currentTime);
      }

      // Breathing hold after each title appears
      currentTime += 0.3 + CONFIG.breathingHold;
      tl.to({}, { duration: CONFIG.breathingHold }, currentTime - CONFIG.breathingHold);
    });

    // Final breathing
    tl.to({}, { duration: CONFIG.breathingHold * 2 });
  }

  // ============================================
  // Section 4a: Solution Disintegrating Text
  // ============================================
  function initSolutionText() {
    const scrollContainer = document.querySelector('.scroll-container--solution-text');
    const textItem = document.querySelector('.solution-text__item');
    const title = document.querySelector('.solution-text__title--disintegrate');
    const chars = document.querySelectorAll('.solution-text__title--disintegrate .char');

    if (!scrollContainer || !textItem) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: CONFIG.scrubDelay,
        markers: CONFIG.debug
      }
    });

    // Show container
    tl.to(textItem, {
      opacity: 1,
      y: 0,
      duration: 0.1,
      onStart: () => textItem.classList.add('visible'),
      onReverseComplete: () => textItem.classList.remove('visible')
    }, 0);

    // Breathing hold
    tl.to({}, { duration: CONFIG.breathingHold }, 0.1);

    // Animate chars one by one
    if (chars.length > 0) {
      const charDelay = 0.5 / chars.length; // Spread across 50% of timeline
      chars.forEach((char, index) => {
        tl.to(char, {
          opacity: 1,
          y: 0,
          duration: charDelay
        }, 0.1 + CONFIG.breathingHold + (index * charDelay * 0.5));
      });

      // Also add class for CSS fallback
      tl.to(title, {
        duration: 0.01,
        onStart: () => title?.classList.add('animate'),
        onReverseComplete: () => title?.classList.remove('animate')
      }, 0.15);
    }

    // Final breathing hold
    tl.to({}, { duration: CONFIG.breathingHold * 2 });
  }

  // ============================================
  // Section 4b: Solution Matrix
  // 
  // 節奏：Visual 滑入 → Items 滑入 → H1 highlight → H2 → H3
  // ============================================
  function initSolutionMatrix() {
    const scrollContainer = document.querySelector('.scroll-container--solution-matrix');
    const visual = document.querySelector('.solution-matrix__visual');
    const items = document.querySelector('.solution-matrix__items');
    const matrixItems = document.querySelectorAll('.solution-matrix__item');
    const svgColored = document.querySelector('.solution-matrix__svg--colored');

    if (!scrollContainer || !visual) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: CONFIG.scrubDelay,
        markers: CONFIG.debug
      }
    });

    // Show visual
    tl.to(visual, {
      opacity: 1,
      x: 0,
      duration: 0.1,
      onStart: () => visual.classList.add('visible'),
      onReverseComplete: () => visual.classList.remove('visible')
    }, 0);

    // Show items
    tl.to(items, {
      opacity: 1,
      x: 0,
      duration: 0.1,
      onStart: () => items?.classList.add('visible'),
      onReverseComplete: () => items?.classList.remove('visible')
    }, 0.05);

    // Breathing hold
    tl.to({}, { duration: CONFIG.breathingHold }, 0.15);

    // H1 highlight
    const h1Start = 0.15 + CONFIG.breathingHold;
    tl.to(matrixItems[0], {
      duration: 0.05,
      onStart: () => {
        matrixItems[0]?.classList.add('highlighted');
        svgColored?.classList.add('highlight-h1');
      },
      onReverseComplete: () => {
        matrixItems[0]?.classList.remove('highlighted');
        svgColored?.classList.remove('highlight-h1');
      }
    }, h1Start);

    // Breathing
    tl.to({}, { duration: CONFIG.breathingHold }, h1Start + 0.05);

    // H2 highlight
    const h2Start = h1Start + 0.05 + CONFIG.breathingHold;
    tl.to(matrixItems[1], {
      duration: 0.05,
      onStart: () => {
        matrixItems[1]?.classList.add('highlighted');
        svgColored?.classList.remove('highlight-h1');
        svgColored?.classList.add('highlight-h1-h2');
      },
      onReverseComplete: () => {
        matrixItems[1]?.classList.remove('highlighted');
        svgColored?.classList.add('highlight-h1');
        svgColored?.classList.remove('highlight-h1-h2');
      }
    }, h2Start);

    // Breathing
    tl.to({}, { duration: CONFIG.breathingHold }, h2Start + 0.05);

    // H3 highlight
    const h3Start = h2Start + 0.05 + CONFIG.breathingHold;
    tl.to(matrixItems[2], {
      duration: 0.05,
      onStart: () => {
        matrixItems[2]?.classList.add('highlighted');
        svgColored?.classList.remove('highlight-h1-h2');
        svgColored?.classList.add('highlight-all');
      },
      onReverseComplete: () => {
        matrixItems[2]?.classList.remove('highlighted');
        svgColored?.classList.add('highlight-h1-h2');
        svgColored?.classList.remove('highlight-all');
      }
    }, h3Start);

    // Final breathing
    tl.to({}, { duration: CONFIG.breathingHold * 2 });
  }

  // ============================================
  // Section 4c: Solution Resource Fit Matrix (swapped: SVG left, Title right)
  // ============================================
  function initSolutionResourceFit() {
    const scrollContainer = document.querySelector('.scroll-container--solution-resource-fit');
    const titleWrap = document.querySelector('.solution-resource-fit__title-wrap');
    const visual = document.querySelector('.solution-resource-fit__visual');

    if (!scrollContainer) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: CONFIG.scrubDelay,
        markers: CONFIG.debug
      }
    });

    // Show visual (SVG on left)
    tl.to(visual, {
      opacity: 1,
      x: 0,
      duration: 0.15,
      onStart: () => visual?.classList.add('visible'),
      onReverseComplete: () => visual?.classList.remove('visible')
    }, 0);

    // Show title (on right)
    tl.to(titleWrap, {
      opacity: 1,
      x: 0,
      duration: 0.15,
      onStart: () => titleWrap?.classList.add('visible'),
      onReverseComplete: () => titleWrap?.classList.remove('visible')
    }, 0.1);

    // Breathing hold
    tl.to({}, { duration: CONFIG.breathingHold * 2 }, 0.25);

    // Final breathing
    tl.to({}, { duration: CONFIG.breathingHold * 2 });
  }

  // ============================================
  // Section 4d: Solution Opportunity Matrix
  // ============================================
  function initSolutionOpportunity() {
    const scrollContainer = document.querySelector('.scroll-container--solution-opportunity');
    const titleWrap = document.querySelector('.solution-opportunity__title-wrap');
    const visual = document.querySelector('.solution-opportunity__visual');
    const highlight = document.querySelector('.solution-opportunity__highlight');

    if (!scrollContainer) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: CONFIG.scrubDelay,
        markers: CONFIG.debug
      }
    });

    // Show visual
    tl.to(visual, {
      opacity: 1,
      x: 0,
      duration: 0.15,
      onStart: () => visual?.classList.add('visible'),
      onReverseComplete: () => visual?.classList.remove('visible')
    }, 0);

    // Show title
    tl.to(titleWrap, {
      opacity: 1,
      x: 0,
      duration: 0.15,
      onStart: () => titleWrap?.classList.add('visible'),
      onReverseComplete: () => titleWrap?.classList.remove('visible')
    }, 0.1);

    // Breathing hold
    tl.to({}, { duration: CONFIG.breathingHold * 2 }, 0.25);

    // Show highlight circle
    tl.to(highlight, {
      duration: 0.1,
      onStart: () => highlight?.classList.add('visible'),
      onReverseComplete: () => highlight?.classList.remove('visible')
    }, 0.5);

    // Final breathing
    tl.to({}, { duration: CONFIG.breathingHold * 2 });
  }

  // ============================================
  // Section 5: Growth Strategy
  // ============================================
  function initGrowthStrategy() {
    const scrollContainer = document.querySelector('.scroll-container--growth');
    const title = document.querySelector('.growth__title');
    const svg = document.querySelector('.growth__svg');

    if (!scrollContainer) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: CONFIG.scrubDelay,
        markers: CONFIG.debug
      }
    });

    // Show title
    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 0.2,
      onStart: () => title?.classList.add('visible'),
      onReverseComplete: () => title?.classList.remove('visible')
    }, 0);

    // Breathing hold
    tl.to({}, { duration: CONFIG.breathingHold }, 0.2);

    // Show SVG
    tl.to(svg, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.3,
      onStart: () => svg?.classList.add('visible'),
      onReverseComplete: () => svg?.classList.remove('visible')
    }, 0.2 + CONFIG.breathingHold);

    // Final breathing
    tl.to({}, { duration: CONFIG.breathingHold * 2 });
  }

  // ============================================
  // Section 6: Strategy Tree (Sticky)
  // ============================================
  function initStrategyTree() {
    const scrollContainer = document.querySelector('.scroll-container--strategy');
    const heading = document.querySelector('.strategy__heading');
    const svg = document.querySelector('.strategy__svg');

    if (!scrollContainer) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: CONFIG.scrubDelay,
        markers: CONFIG.debug
      }
    });

    // Show heading
    tl.to(heading, {
      opacity: 1,
      y: 0,
      duration: 0.2,
      onStart: () => heading?.classList.add('visible'),
      onReverseComplete: () => heading?.classList.remove('visible')
    }, 0);

    // Breathing hold
    tl.to({}, { duration: CONFIG.breathingHold }, 0.2);

    // Show SVG
    tl.to(svg, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.3,
      onStart: () => svg?.classList.add('visible'),
      onReverseComplete: () => svg?.classList.remove('visible')
    }, 0.2 + CONFIG.breathingHold);

    // Final breathing
    tl.to({}, { duration: CONFIG.breathingHold * 2 });
  }

  // ============================================
  // Section 7: Resources (Sticky)
  // ============================================
  function initResources() {
    const scrollContainer = document.querySelector('.scroll-container--resources');
    const heading = document.querySelector('.resources__heading');
    const linkBlocks = document.querySelectorAll('.resources__link-block');
    const books = document.querySelectorAll('.resources__book');

    if (!scrollContainer) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: CONFIG.scrubDelay,
        markers: CONFIG.debug
      }
    });

    // Show heading
    tl.to(heading, {
      opacity: 1,
      y: 0,
      duration: 0.2,
      onStart: () => heading?.classList.add('visible'),
      onReverseComplete: () => heading?.classList.remove('visible')
    }, 0);

    // Breathing hold
    tl.to({}, { duration: CONFIG.breathingHold }, 0.2);

    // Show link blocks sequentially
    const linkStart = 0.2 + CONFIG.breathingHold;
    linkBlocks.forEach((link, index) => {
      const startTime = linkStart + (index * (0.15 + CONFIG.breathingHold * 0.5));
      
      tl.to(link, {
        opacity: 1,
        x: 0,
        duration: 0.15,
        onStart: () => link.classList.add('visible'),
        onReverseComplete: () => link.classList.remove('visible')
      }, startTime);

      // Breathing between links
      tl.to({}, { duration: CONFIG.breathingHold * 0.5 }, startTime + 0.15);
    });

    // Show books sequentially (staggered)
    const bookStart = linkStart + (linkBlocks.length * (0.15 + CONFIG.breathingHold * 0.5));
    books.forEach((book, index) => {
      const startTime = bookStart + (index * 0.1);
      
      tl.to(book, {
        opacity: 1,
        y: 0,
        rotation: index === 1 ? 2 : 0,
        duration: 0.2,
        onStart: () => book.classList.add('visible'),
        onReverseComplete: () => book.classList.remove('visible')
      }, startTime);
    });

    // Final breathing
    tl.to({}, { duration: CONFIG.breathingHold * 2 });
  }

  // ============================================
  // Final Summary (視覺總結)
  // ============================================
  function initFinalSummary() {
    const finalSummary = document.querySelector('.final-summary');
    const footer = document.querySelector('.footer');

    if (!finalSummary || !footer) return;

    ScrollTrigger.create({
      trigger: footer,
      start: 'top 80%',
      onEnter: () => finalSummary.classList.add('visible'),
      onLeaveBack: () => finalSummary.classList.remove('visible')
    });

    // Auto-hide after 3 seconds
    let hideTimeout;
    ScrollTrigger.create({
      trigger: footer,
      start: 'top 80%',
      onEnter: () => {
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
          finalSummary.classList.remove('visible');
        }, 3000);
      }
    });
  }

  // ============================================
  // Initialize All
  // ============================================
  function init() {
    // Wait for DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    debugLog('[CV] Initializing scrollytelling...');

    // Core UI
    initProgressBar();
    initNavigation();
    initStickyMonitor();

    // Section animations
    initHeroIntro();
    initFlipCards();
    initProblem();
    initFutureOutlook();
    initSolutionText();
    initSolutionMatrix();
    initSolutionResourceFit();
    initSolutionOpportunity();
    initGrowthStrategy();
    initStrategyTree();
    initResources();
    initFinalSummary();

    debugLog('[CV] Scrollytelling initialized with:');
    debugLog(`  - scrub delay: ${CONFIG.scrubDelay}s (滑動阻尼)`);
    debugLog(`  - breathing hold: ${CONFIG.breathingHold * 100}% (呼吸感留白)`);
  }

  // Start
  init();
})();
