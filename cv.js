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

      // Show card - once visible, stay visible (no reverse removal)
      tl.to(wrapper, { 
        opacity: 1, 
        y: 0, 
        duration: 0.1,
        onStart: () => wrapper.classList.add('visible')
        // Removed onReverseComplete - cards stay visible once shown
      }, startTime);

      // Breathing hold
      tl.to({}, { duration: CONFIG.breathingHold }, startTime + 0.1);

      // Flip card - once flipped, stay flipped (no reverse removal)
      if (card) {
        tl.to(card, { 
          duration: 0.1,
          onStart: () => card.classList.add('flipped')
          // Removed onReverseComplete - cards stay flipped once flipped
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
  // 工作流程：
  // 1. 當 scroll 進入區段時，title 和 matrix 變為 sticky
  // 2. Layout 滑入顯示（時間可配置）
  // 3. Layout 完成後開始 scrub highlight
  // 4. Highlight 為即時切換（無動畫）
  // 5. 結尾留 10% 空間
  // 
  // Scroll Progress Timeline:
  // - 0-10%: Layout 滑入
  // - 10-20%: 等待
  // - 20-43%: H1 highlight (stage 長度可調整)
  // - 43-66%: H1 + H2 highlight (stage 長度可調整)
  // - 66-90%: All highlight (stage 長度可調整)
  // - 90-100%: 結尾留白，保持 All highlighted
  // 
  // 配置選項：
  // - layoutRevealEnd: Layout 滑入完成的進度
  // - highlightStart: Highlight 開始的進度
  // - highlightEnd: Highlight 結束的進度（結尾留 10%）
  // - h1StageLength, h2StageLength, h3StageLength: 各 stage 長度（可調整）
  // ============================================
  function initSolutionMatrix() {
    console.log('[SolutionMatrix] ========== FUNCTION START ==========');
    console.log('[SolutionMatrix] Function called, searching for elements...');
    
    const scrollContainer = document.querySelector('.scroll-container--solution-matrix');
    const visual = document.querySelector('.solution-matrix__visual');
    const items = document.querySelector('.solution-matrix__items');
    const coloredSvg = document.querySelector('.solution-matrix__svg--colored');
    
    // Get H1, H2, H3 items for .highlighted class toggle
    const h1Item = document.querySelector('.solution-matrix__item[data-h="1"]');
    const h2Item = document.querySelector('.solution-matrix__item[data-h="2"]');
    const h3Item = document.querySelector('.solution-matrix__item[data-h="3"]');

    console.log('[SolutionMatrix] Elements found:', {
      scrollContainer: !!scrollContainer,
      visual: !!visual,
      items: !!items,
      coloredSvg: !!coloredSvg,
      h1Item: !!h1Item,
      h2Item: !!h2Item,
      h3Item: !!h3Item
    });

    if (!scrollContainer || !visual) {
      console.warn('[SolutionMatrix] Container or visual not found, skipping initialization');
      console.warn('[SolutionMatrix] scrollContainer:', scrollContainer);
      console.warn('[SolutionMatrix] visual:', visual);
      return;
    }

    console.log('[SolutionMatrix] Initialized', {
      container: !!scrollContainer,
      visual: !!visual,
      items: !!items,
      coloredSvg: !!coloredSvg,
      h1Item: !!h1Item,
      h2Item: !!h2Item,
      h3Item: !!h3Item
    });

    // 配置參數（可調整）
    const config = {
      layoutRevealEnd: 0.10,      // Layout 滑入完成的進度 (10%)
      highlightStart: 0.20,        // Highlight 開始的進度 (20%，直接套色，無動畫)
      highlightEnd: 0.90,          // Highlight 結束的進度 (90%，結尾留 10%)
      // Stage 長度（可調整，總和建議 = highlightEnd - highlightStart = 0.70）
      h1StageLength: 0.23,         // H1 stage 長度 (23% of total)
      h2StageLength: 0.23,         // H2 stage 長度 (23% of total)
      h3StageLength: 0.24          // H3 stage 長度 (24% of total, 填滿剩餘空間)
    };
    
    // 計算實際的進度點（基於 stage 長度）
    const highlightRange = config.highlightEnd - config.highlightStart;
    const h1End = config.highlightStart + config.h1StageLength;
    const h2End = h1End + config.h2StageLength;
    const h3End = config.highlightEnd; // H3 結束在 highlightEnd

    console.log('[SolutionMatrix] Config:', {
      layoutRevealEnd: config.layoutRevealEnd,
      highlightStart: config.highlightStart,
      highlightEnd: config.highlightEnd,
      thresholds: {
        h1End: h1End.toFixed(2),
        h2End: h2End.toFixed(2),
        h3End: h3End.toFixed(2)
      },
      stageLengths: {
        h1: config.h1StageLength,
        h2: config.h2StageLength,
        h3: config.h3StageLength
      }
    });

    // Clip-path values for matrix highlighting
    const CLIP_PATHS = {
      none: 'circle(0% at 0% 0%)',
      h1: 'circle(7.2% at 28.4% 74.4%)',           // H1 only (bottom-left)
      h1h2: 'inset(41.6% 35.4% 18.6% 21.2%)',      // H1 + H2
      all: 'inset(15.9% 6.2% 18.6% 21.2%)'         // All circles
    };

    // Track current highlight state to avoid unnecessary DOM updates
    let currentState = -1; // -1=uninitialized, 0=none, 1=H1, 2=H1+H2, 3=all

    // Function to set highlight state (INSTANT, no animation)
    function setHighlightState(state) {
      if (state === currentState) return;
      
      const stateNames = ['None', 'H1', 'H1+H2', 'All'];
      console.log(`[SolutionMatrix] State change: ${stateNames[currentState]} → ${stateNames[state]}`);
      currentState = state;

      if (!coloredSvg) return;

      // Instant state changes - no transitions
      if (state === 0) {
        // No highlights
        coloredSvg.style.opacity = '0';
        coloredSvg.style.clipPath = CLIP_PATHS.none;
        coloredSvg.style.webkitClipPath = CLIP_PATHS.none;
        h1Item?.classList.remove('highlighted');
        h2Item?.classList.remove('highlighted');
        h3Item?.classList.remove('highlighted');
      } else if (state === 1) {
        // H1 only (instant)
        coloredSvg.style.opacity = '1';
        coloredSvg.style.clipPath = CLIP_PATHS.h1;
        coloredSvg.style.webkitClipPath = CLIP_PATHS.h1;
        h1Item?.classList.add('highlighted');
        h2Item?.classList.remove('highlighted');
        h3Item?.classList.remove('highlighted');
      } else if (state === 2) {
        // H1 + H2 (instant)
        coloredSvg.style.opacity = '1';
        coloredSvg.style.clipPath = CLIP_PATHS.h1h2;
        coloredSvg.style.webkitClipPath = CLIP_PATHS.h1h2;
        h1Item?.classList.add('highlighted');
        h2Item?.classList.add('highlighted');
        h3Item?.classList.remove('highlighted');
      } else {
        // All (H1 + H2 + H3) (instant)
        coloredSvg.style.opacity = '1';
        coloredSvg.style.clipPath = CLIP_PATHS.all;
        coloredSvg.style.webkitClipPath = CLIP_PATHS.all;
        h1Item?.classList.add('highlighted');
        h2Item?.classList.add('highlighted');
        h3Item?.classList.add('highlighted');
      }
    }

    // Timeline for layout reveal (with scrub)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainer,
        start: 'top top',
        end: 'bottom bottom',
        scrub: CONFIG.scrubDelay,
        markers: CONFIG.debug
      }
    });

    // Phase 1: Show visual and items (0 到 layoutRevealEnd)
    tl.to(visual, {
      opacity: 1,
      x: 0,
      duration: config.layoutRevealEnd,
      onStart: () => visual.classList.add('visible'),
      onReverseComplete: () => visual.classList.remove('visible')
    }, 0);

    tl.to(items, {
      opacity: 1,
      x: 0,
      duration: config.layoutRevealEnd,
      onStart: () => items?.classList.add('visible'),
      onReverseComplete: () => items?.classList.remove('visible')
    }, 0);

    // Extend timeline to full duration
    tl.to({}, { duration: 1 - config.layoutRevealEnd }, config.layoutRevealEnd);

    // ScrollTrigger for instant highlight state changes
    // Highlights start AFTER layout is visible, end at 90% (結尾留 10%)
    ScrollTrigger.create({
      trigger: scrollContainer,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Thresholds for INSTANT highlight changes
        // 0 - highlightStart: Layout appearing, no highlights
        // highlightStart - h1End: H1 highlighted
        // h1End - h2End: H1 + H2 highlighted  
        // h2End - highlightEnd: All highlighted (H1 + H2 + H3)
        // highlightEnd - 100%: 結尾留白，保持 All highlighted
        
        // Debug log (only log when state might change to reduce noise)
        const debugInterval = 0.05; // Log every 5% progress
        if (progress % debugInterval < 0.01 || progress > 0.19 && progress < 0.21) {
          console.log(`[SolutionMatrix] Progress: ${(progress * 100).toFixed(1)}% | State: ${currentState}`);
        }
        
        if (progress < config.highlightStart) {
          setHighlightState(0);
        } else if (progress < h1End) {
          setHighlightState(1);
        } else if (progress < h2End) {
          setHighlightState(2);
        } else if (progress < config.highlightEnd) {
          setHighlightState(3);
        } else {
          // 90% 之後保持 All highlighted（結尾留白）
          setHighlightState(3);
        }
      }
    });

    console.log('[SolutionMatrix] ========== FUNCTION COMPLETE ==========');
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
