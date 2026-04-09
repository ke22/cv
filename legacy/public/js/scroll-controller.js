/**
 * ScrollController - Core scroll engine for scrollytelling
 * 
 * Features:
 * - Single scroll listener with requestAnimationFrame
 * - Section registry with progress calculation
 * - IntersectionObserver for section activation
 * - Event dispatch for section changes
 */

export default class ScrollController {
  constructor() {
    this.sections = new Map();
    this.activeSections = new Set();
    this.observer = null;
    this.ticking = false;
    this.currentSection = null;
    this.scrollY = 0;
    this.viewportHeight = window.innerHeight;
    
    // Bind methods
    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
    this.update = this.update.bind(this);
  }

  /**
   * Register a section with its handler
   * @param {string} id - Section identifier
   * @param {Object} handler - Handler object with init() and animate(progress) methods
   */
  register(id, handler) {
    this.sections.set(id, {
      handler,
      element: null,
      bounds: null,
      active: false
    });
  }

  /**
   * Initialize the scroll controller
   */
  start() {
    // Find all section elements and calculate bounds
    this.sections.forEach((section, id) => {
      const element = document.querySelector(`[data-scroll-section="${id}"]`);
      if (element) {
        section.element = element;
        this.calculateBounds(id);
      }
    });

    // Setup IntersectionObserver for section activation
    this.setupObserver();

    // Add event listeners
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });

    // Initial update
    this.scrollY = window.scrollY;
    this.update();

    // Dispatch ready event
    window.dispatchEvent(new CustomEvent('scrollcontroller:ready'));
  }

  /**
   * Calculate bounds for a section
   */
  calculateBounds(id) {
    const section = this.sections.get(id);
    if (!section || !section.element) return;

    const rect = section.element.getBoundingClientRect();
    const scrollY = window.scrollY;
    
    // Get scroll height from data attribute or element height
    const scrollHeight = section.element.dataset.scrollHeight 
      ? this.parseScrollHeight(section.element.dataset.scrollHeight)
      : section.element.offsetHeight;

    section.bounds = {
      top: rect.top + scrollY,
      bottom: rect.top + scrollY + scrollHeight,
      height: scrollHeight
    };
  }

  /**
   * Parse scroll height (e.g., "200vh" -> pixels)
   */
  parseScrollHeight(value) {
    if (value.endsWith('vh')) {
      return parseFloat(value) / 100 * this.viewportHeight;
    }
    if (value.endsWith('px')) {
      return parseFloat(value);
    }
    return parseFloat(value);
  }

  /**
   * Setup IntersectionObserver
   */
  setupObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const id = entry.target.dataset.scrollSection;
          const section = this.sections.get(id);
          
          if (section) {
            if (entry.isIntersecting) {
              this.activeSections.add(id);
              section.active = true;
            } else {
              this.activeSections.delete(id);
              section.active = false;
            }
          }
        });
      },
      { 
        rootMargin: '100px 0px',
        threshold: [0, 0.1, 0.5, 0.9, 1]
      }
    );

    // Observe all section elements
    this.sections.forEach((section) => {
      if (section.element) {
        this.observer.observe(section.element);
      }
    });
  }

  /**
   * Scroll event handler
   */
  onScroll() {
    this.scrollY = window.scrollY;
    
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(this.update);
    }
  }

  /**
   * Resize event handler
   */
  onResize() {
    this.viewportHeight = window.innerHeight;
    
    // Recalculate all bounds
    this.sections.forEach((_, id) => {
      this.calculateBounds(id);
    });
  }

  /**
   * Update loop - calculate progress and call handlers
   */
  update() {
    this.ticking = false;
    
    const viewportCenter = this.scrollY + this.viewportHeight / 2;
    let newCurrentSection = null;
    
    // Only update active sections (visible via IntersectionObserver)
    this.activeSections.forEach(id => {
      const section = this.sections.get(id);
      if (!section || !section.bounds) return;
      
      // Calculate progress (0-1) within section
      const progress = this.calculateProgress(section.bounds);
      
      // Call handler's animate method
      if (section.handler && typeof section.handler.animate === 'function') {
        section.handler.animate(progress, this.scrollY);
      }
      
      // Determine current section (for navigation highlight)
      if (viewportCenter >= section.bounds.top && viewportCenter < section.bounds.bottom) {
        newCurrentSection = id;
      }
    });

    // Dispatch section change event if changed
    if (newCurrentSection !== this.currentSection) {
      this.currentSection = newCurrentSection;
      window.dispatchEvent(new CustomEvent('scrollcontroller:sectionchange', {
        detail: { section: newCurrentSection }
      }));
    }

    // Update progress bar
    this.updateProgressBar();
  }

  /**
   * Calculate progress within a section's bounds
   */
  calculateProgress(bounds) {
    const scrollTop = this.scrollY;
    const start = bounds.top;
    const end = bounds.bottom - this.viewportHeight;
    
    if (scrollTop <= start) return 0;
    if (scrollTop >= end) return 1;
    
    return (scrollTop - start) / (end - start);
  }

  /**
   * Update the global progress bar
   */
  updateProgressBar() {
    const fill = document.querySelector('.progress-bar__fill');
    if (!fill) return;

    const docHeight = document.documentElement.scrollHeight - this.viewportHeight;
    const progress = Math.min(1, this.scrollY / docHeight);
    fill.style.transform = `scaleX(${progress})`;
  }

  /**
   * Smooth scroll to a section
   */
  scrollToSection(id) {
    const section = this.sections.get(id);
    if (section && section.bounds) {
      window.scrollTo({
        top: section.bounds.top,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Get current section ID
   */
  getCurrentSection() {
    return this.currentSection;
  }

  /**
   * Get all registered section IDs
   */
  getSectionIds() {
    return Array.from(this.sections.keys());
  }

  /**
   * Cleanup
   */
  destroy() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
    
    if (this.observer) {
      this.observer.disconnect();
    }
    
    this.sections.clear();
    this.activeSections.clear();
  }
}

// Utility functions
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function mapRange(value, inMin, inMax, outMin, outMax) {
  return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
}
