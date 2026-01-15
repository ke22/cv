/**
 * Section Handlers - All scrollytelling section animations
 * 
 * Each section exports an object with:
 * - init(element): Initialize the section
 * - animate(progress): Update based on scroll progress (0-1)
 */

import { lerp, clamp, mapRange } from './scroll-controller.js';

// ============================================
// Section 1: Hero
// ============================================
export const hero = {
  element: null,
  title: null,
  desc: null,
  cta: null,

  init(el) {
    this.element = el;
    this.title = el.querySelector('.hero__title');
    this.desc = el.querySelector('.hero__desc');
    this.cta = el.querySelector('.hero__cta');
    
    // Initial animation on load
    setTimeout(() => {
      if (this.title) this.title.classList.add('visible');
      setTimeout(() => {
        if (this.desc) this.desc.classList.add('visible');
        setTimeout(() => {
          if (this.cta) this.cta.classList.add('visible');
        }, 200);
      }, 200);
    }, 300);
  },

  animate(progress) {
    if (!this.element) return;
    
    // Parallax effect: hero moves up as user scrolls
    const heroContent = this.element.querySelector('.hero');
    if (heroContent) {
      const y = -progress * 75;
      const opacity = 1 - progress * 0.7;
      heroContent.style.transform = `translateY(${y}px)`;
      heroContent.style.opacity = Math.max(0.3, opacity);
    }
  }
};

// ============================================
// Section 2: Flip Cards
// ============================================
export const flipCards = {
  element: null,
  cards: [],
  wrappers: [],

  init(el) {
    this.element = el;
    this.wrappers = Array.from(el.querySelectorAll('.flip-card-wrapper'));
    this.cards = Array.from(el.querySelectorAll('.flip-card'));
  },

  animate(progress) {
    if (!this.element) return;
    
    // Show wrappers sequentially
    this.wrappers.forEach((wrapper, i) => {
      const showAt = i * 0.2; // 0%, 20%, 40%
      if (progress >= showAt) {
        wrapper.classList.add('visible');
      }
    });
    
    // Flip cards sequentially: 0-25%, 25-50%, 50-75%
    this.cards.forEach((card, i) => {
      const flipStart = i * 0.25;
      const flipEnd = flipStart + 0.25;
      
      if (progress >= flipStart && progress < 0.75) {
        // Card should flip when we're past its start threshold
        if (progress >= flipEnd || i < Math.floor(progress / 0.25)) {
          card.classList.add('flipped');
        }
      }
    });
    
    // Hold all flipped at 75-100%
    if (progress >= 0.75) {
      this.cards.forEach(card => card.classList.add('flipped'));
    }
  }
};

// ============================================
// Section 3: Problem
// ============================================
export const problem = {
  element: null,
  title: null,
  subtitle: null,

  init(el) {
    this.element = el;
    this.title = el.querySelector('.problem__title');
    this.subtitle = el.querySelector('.problem__subtitle');
  },

  animate(progress) {
    if (!this.element) return;
    
    // Title visible: 0-40% assembles, then holds
    if (progress >= 0.1) {
      if (this.title) this.title.classList.add('visible');
    }
    
    // Subtitle visible: 60-100%
    if (progress >= 0.6) {
      if (this.subtitle) this.subtitle.classList.add('visible');
    }
  }
};

// ============================================
// Section 3b: Future Outlook
// ============================================
export const futureOutlook = {
  element: null,
  titleItems: [],
  circles: [],

  init(el) {
    this.element = el;
    this.titleItems = Array.from(el.querySelectorAll('.future-outlook__title-item'));
    this.circles = Array.from(el.querySelectorAll('.future-circle'));
  },

  animate(progress) {
    if (!this.element) return;
    
    // Three phases: 0-35%, 35-70%, 70-100%
    const phase1End = 0.35;
    const phase2End = 0.70;
    
    // Determine active title and circles
    let activeTitle = 0;
    let visibleCircles = 0;
    
    if (progress < phase1End) {
      // Phase 1: Title 1 + Small circle
      activeTitle = 0;
      visibleCircles = progress >= 0.15 ? 1 : 0;
    } else if (progress < phase2End) {
      // Phase 2: Title 2 + Medium circle
      activeTitle = 1;
      visibleCircles = 2;
    } else {
      // Phase 3: Title 3 + Large circle
      activeTitle = 2;
      visibleCircles = 3;
    }
    
    // Update title visibility
    this.titleItems.forEach((item, i) => {
      item.classList.remove('active', 'exiting');
      if (i === activeTitle) {
        item.classList.add('active');
      } else if (i < activeTitle) {
        item.classList.add('exiting');
      }
    });
    
    // Update circle visibility (cumulative)
    this.circles.forEach((circle, i) => {
      if (i < visibleCircles) {
        circle.classList.add('visible');
      } else {
        circle.classList.remove('visible');
      }
    });
  }
};

// ============================================
// Section 4: Solution (Multi-stage)
// ============================================
export const solution = {
  element: null,
  
  // Stage 1: Disintegrating text
  textItem: null,
  chars: [],
  textSub: null,
  
  // Stage 2: Matrix
  matrixVisual: null,
  matrixItems: null,
  matrixSvgColored: null,
  hItems: [],
  
  // Stage 3: Resource Fit
  resourceFitTitle: null,
  resourceFitVisual: null,
  
  // Stage 4: Opportunity
  opportunityTitle: null,
  opportunityVisual: null,
  opportunityHighlight: null,

  init(el) {
    this.element = el;
    
    // Stage 1
    this.textItem = el.querySelector('.solution-text__item');
    this.chars = Array.from(el.querySelectorAll('.solution-text__title--disintegrate .char'));
    this.textSub = el.querySelector('.solution-text__sub');
    
    // Stage 2
    this.matrixVisual = el.querySelector('.solution-matrix__visual');
    this.matrixItems = el.querySelector('.solution-matrix__items');
    this.matrixSvgColored = el.querySelector('.solution-matrix__svg--colored');
    this.hItems = Array.from(el.querySelectorAll('.solution-matrix__item'));
    
    // Stage 3
    this.resourceFitTitle = el.querySelector('.solution-resource-fit__title-wrap');
    this.resourceFitVisual = el.querySelector('.solution-resource-fit__visual');
    
    // Stage 4
    this.opportunityTitle = el.querySelector('.solution-opportunity__title-wrap');
    this.opportunityVisual = el.querySelector('.solution-opportunity__visual');
    this.opportunityHighlight = el.querySelector('.solution-opportunity__highlight');
  },

  animate(progress) {
    if (!this.element) return;
    
    // The solution section has multiple scroll containers
    // We need to determine which sub-section we're in based on scroll position
    // For now, we'll use a simplified approach based on overall progress
    
    // Calculate sub-section progress
    // Stage 1 (text): ~0-15% of total
    // Stage 2 (matrix): ~15-45% of total
    // Stage 3 (resource fit): ~45-70% of total
    // Stage 4 (opportunity): ~70-100% of total
    
    this.animateStage1(progress);
    this.animateStage2(progress);
    this.animateStage3(progress);
    this.animateStage4(progress);
  },

  animateStage1(progress) {
    // Text item visibility
    if (progress >= 0.02 && this.textItem) {
      this.textItem.classList.add('visible');
    }
    
    // Character animation (staggered)
    const charStart = 0.02;
    const charEnd = 0.12;
    
    if (progress >= charStart) {
      const charProgress = clamp((progress - charStart) / (charEnd - charStart), 0, 1);
      
      this.chars.forEach((char, i) => {
        const delay = i * 0.03;
        const charVisible = charProgress >= delay;
        
        if (charVisible) {
          char.style.opacity = '1';
          char.style.transform = 'translateY(0)';
        }
      });
      
      // Add animate class to trigger CSS transitions
      const title = this.element.querySelector('.solution-text__title--disintegrate');
      if (title && charProgress > 0.5) {
        title.classList.add('animate');
      }
    }
  },

  animateStage2(progress) {
    // Matrix visual and items visibility
    if (progress >= 0.15) {
      if (this.matrixVisual) this.matrixVisual.classList.add('visible');
      if (this.matrixItems) this.matrixItems.classList.add('visible');
    }
    
    // H1, H2, H3 highlight sequence within stage 2 (15-45%)
    const stage2Start = 0.15;
    const stage2End = 0.45;
    const stage2Progress = clamp((progress - stage2Start) / (stage2End - stage2Start), 0, 1);
    
    // H1: 0-15%, H1+H2: 15-35%, H1+H2+H3: 35-100% of stage 2
    let highlightedCount = 0;
    if (stage2Progress >= 0) highlightedCount = 1;
    if (stage2Progress >= 0.15) highlightedCount = 2;
    if (stage2Progress >= 0.35) highlightedCount = 3;
    
    this.hItems.forEach((item, i) => {
      if (i < highlightedCount) {
        item.classList.add('highlighted');
      } else {
        item.classList.remove('highlighted');
      }
    });
    
    // Update matrix SVG clip-path
    if (this.matrixSvgColored) {
      this.matrixSvgColored.classList.remove('highlight-h1', 'highlight-h1-h2', 'highlight-all');
      
      if (highlightedCount === 1) {
        this.matrixSvgColored.classList.add('highlight-h1');
      } else if (highlightedCount === 2) {
        this.matrixSvgColored.classList.add('highlight-h1-h2');
      } else if (highlightedCount === 3) {
        this.matrixSvgColored.classList.add('highlight-all');
      }
    }
  },

  animateStage3(progress) {
    // Resource Fit Matrix: 45-70%
    const stage3Start = 0.45;
    const stage3Mid = 0.55;
    
    if (progress >= stage3Start) {
      if (this.resourceFitTitle) this.resourceFitTitle.classList.add('visible');
    }
    
    if (progress >= stage3Mid) {
      if (this.resourceFitVisual) this.resourceFitVisual.classList.add('visible');
    }
  },

  animateStage4(progress) {
    // Opportunity Matrix: 70-100%
    const stage4Start = 0.70;
    const stage4Mid = 0.80;
    const stage4Highlight = 0.90;
    
    if (progress >= stage4Start) {
      if (this.opportunityTitle) this.opportunityTitle.classList.add('visible');
    }
    
    if (progress >= stage4Mid) {
      if (this.opportunityVisual) this.opportunityVisual.classList.add('visible');
    }
    
    if (progress >= stage4Highlight) {
      if (this.opportunityHighlight) this.opportunityHighlight.classList.add('visible');
    }
  }
};

// ============================================
// Section 5: Growth
// ============================================
export const growth = {
  element: null,
  title: null,
  svg: null,

  init(el) {
    this.element = el;
    this.title = el.querySelector('.growth__title');
    this.svg = el.querySelector('.growth__svg');
  },

  animate(progress) {
    if (!this.element) return;
    
    // Title: 0-30%
    if (progress >= 0.1) {
      if (this.title) this.title.classList.add('visible');
    }
    
    // SVG: 30-70%
    if (progress >= 0.3) {
      if (this.svg) this.svg.classList.add('visible');
    }
  }
};

// ============================================
// Section 6: Strategy
// ============================================
export const strategy = {
  element: null,
  heading: null,
  svg: null,

  init(el) {
    this.element = el;
    this.heading = el.querySelector('.strategy__heading');
    this.svg = el.querySelector('.strategy__svg');
  },

  animate(progress) {
    if (!this.element) return;
    
    // Heading: 0-30%
    if (progress >= 0.1) {
      if (this.heading) this.heading.classList.add('visible');
    }
    
    // SVG: 30-70%
    if (progress >= 0.3) {
      if (this.svg) this.svg.classList.add('visible');
    }
  }
};

// ============================================
// Section 7: Resources
// ============================================
export const resources = {
  element: null,
  heading: null,
  links: [],
  books: [],

  init(el) {
    this.element = el;
    this.heading = el.querySelector('.resources__heading');
    this.links = Array.from(el.querySelectorAll('.resources__link-block'));
    this.books = Array.from(el.querySelectorAll('.resources__book'));
  },

  animate(progress) {
    if (!this.element) return;
    
    // Heading: 0-10%
    if (progress >= 0.05) {
      if (this.heading) this.heading.classList.add('visible');
    }
    
    // Book 1 + Link 1: 0-30%
    // Book 2 + Link 2: 30-60%
    // Book 3 + Link 3: 60-90%
    const phases = [
      { start: 0.1, end: 0.3 },
      { start: 0.3, end: 0.6 },
      { start: 0.6, end: 0.9 }
    ];
    
    phases.forEach((phase, i) => {
      if (progress >= phase.start) {
        // Show book
        if (this.books[i]) {
          this.books[i].classList.add('visible');
        }
        // Show and highlight link
        if (this.links[i]) {
          this.links[i].classList.add('visible');
        }
      }
      
      // Highlight current link, remove highlight from previous
      if (progress >= phase.start && progress < phase.end) {
        if (this.links[i]) {
          this.links[i].classList.add('highlighted');
        }
      } else {
        if (this.links[i]) {
          this.links[i].classList.remove('highlighted');
        }
      }
    });
    
    // After 90%, all visible, last link highlighted
    if (progress >= 0.9) {
      this.links.forEach((link, i) => {
        link.classList.add('visible');
        link.classList.toggle('highlighted', i === 2);
      });
      this.books.forEach(book => book.classList.add('visible'));
    }
  }
};
