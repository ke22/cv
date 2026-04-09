/**
 * Main Entry Point - Scrollytelling Portfolio
 * 
 * Imports all modules and initializes the application
 */

import ScrollController from './scroll-controller.js';
import * as Sections from './sections.js';
import * as Components from './components.js';

// ============================================
// Application State
// ============================================
const app = {
  controller: null,
  initialized: false
};

// ============================================
// Section Configuration
// ============================================
const sectionConfig = {
  hero: {
    handler: Sections.hero,
    selector: '#intro'
  },
  flipCards: {
    handler: Sections.flipCards,
    selector: '#cards'
  },
  problem: {
    handler: Sections.problem,
    selector: '#problem'
  },
  futureOutlook: {
    handler: Sections.futureOutlook,
    selector: '#future-outlook'
  },
  solution: {
    handler: Sections.solution,
    selector: '#solution'
  },
  growth: {
    handler: Sections.growth,
    selector: '#growth'
  },
  strategy: {
    handler: Sections.strategy,
    selector: '#strategy'
  },
  resources: {
    handler: Sections.resources,
    selector: '#resources'
  }
};

// ============================================
// Initialization
// ============================================
function init() {
  if (app.initialized) return;
  
  console.log('[Scrollytelling] Initializing...');
  
  // Create scroll controller
  app.controller = new ScrollController();
  
  // Register sections
  Object.entries(sectionConfig).forEach(([id, config]) => {
    const element = document.querySelector(config.selector);
    
    if (element) {
      // Add data attribute for scroll controller
      element.dataset.scrollSection = id;
      
      // Initialize handler
      config.handler.init(element);
      
      // Register with controller
      app.controller.register(id, config.handler);
      
      console.log(`[Scrollytelling] Registered section: ${id}`);
    } else {
      console.warn(`[Scrollytelling] Section not found: ${config.selector}`);
    }
  });
  
  // Initialize components
  Components.progressDots.init(app.controller);
  Components.skipButtons.init(app.controller);
  Components.circleTransition.init();
  Components.mobileNav.init();
  Components.finalSummary.init();
  
  // Start scroll controller
  app.controller.start();
  
  // Setup circle transition trigger (connected to futureOutlook section)
  setupCircleTransition();
  
  // Setup final summary trigger
  setupFinalSummary();
  
  app.initialized = true;
  console.log('[Scrollytelling] Ready!');
}

// ============================================
// Circle Transition Setup
// ============================================
function setupCircleTransition() {
  const futureOutlookSection = document.querySelector('#future-outlook');
  if (!futureOutlookSection) return;
  
  // Override the futureOutlook animate to include circle transition
  const originalAnimate = Sections.futureOutlook.animate.bind(Sections.futureOutlook);
  
  Sections.futureOutlook.animate = function(progress) {
    // Call original animation
    originalAnimate(progress);
    
    // Trigger circle transition at end of section (85-100%)
    if (progress >= 0.85) {
      const transitionProgress = (progress - 0.85) / 0.15;
      Components.circleTransition.animate(transitionProgress);
    } else {
      Components.circleTransition.reset();
    }
  };
}

// ============================================
// Final Summary Setup
// ============================================
function setupFinalSummary() {
  // Show final summary when user reaches the footer
  const footer = document.querySelector('#contact');
  if (!footer) return;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          Components.finalSummary.show();
        } else {
          Components.finalSummary.hide();
        }
      });
    },
    { threshold: 0.5 }
  );
  
  observer.observe(footer);
}

// ============================================
// DOM Ready
// ============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for debugging
window.__scrollytellingApp = app;
