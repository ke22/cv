/**
 * Components - UI components for scrollytelling
 * 
 * - progressDots: Navigation dots that highlight active section
 * - skipButtons: Skip to next section buttons
 * - circleTransition: Three circle zoom-out transition effect
 */

import { lerp, clamp } from './scroll-controller.js';

// ============================================
// Progress Dots Navigation
// ============================================
export const progressDots = {
  controller: null,
  dots: [],
  
  init(controller) {
    this.controller = controller;
    this.dots = Array.from(document.querySelectorAll('.nav__dot-btn'));
    
    // Add click handlers
    this.dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const sectionId = dot.dataset.section;
        if (sectionId && controller) {
          controller.scrollToSection(sectionId);
        }
      });
    });
    
    // Listen for section changes
    window.addEventListener('scrollcontroller:sectionchange', (e) => {
      this.update(e.detail.section);
    });
  },
  
  update(activeSection) {
    this.dots.forEach(dot => {
      const isActive = dot.dataset.section === activeSection;
      dot.classList.toggle('active', isActive);
    });
    
    // Also update mobile nav if present
    const mobileLinks = document.querySelectorAll('.mobile-modal__link');
    mobileLinks.forEach(link => {
      const href = link.getAttribute('href');
      const sectionId = href ? href.replace('#', '') : '';
      link.classList.toggle('active', sectionId === activeSection);
    });
  }
};

// ============================================
// Skip Buttons
// ============================================
export const skipButtons = {
  controller: null,
  buttons: [],
  
  init(controller) {
    this.controller = controller;
    this.buttons = Array.from(document.querySelectorAll('.skip-section'));
    
    this.buttons.forEach(button => {
      button.addEventListener('click', () => {
        this.skipToNext();
      });
      
      // Keyboard support
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.skipToNext();
        }
      });
    });
    
    // Global keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && e.altKey) {
        e.preventDefault();
        this.skipToNext();
      }
      if (e.key === 'ArrowUp' && e.altKey) {
        e.preventDefault();
        this.skipToPrevious();
      }
    });
  },
  
  skipToNext() {
    if (!this.controller) return;
    
    const currentId = this.controller.getCurrentSection();
    const sectionIds = this.controller.getSectionIds();
    const currentIndex = sectionIds.indexOf(currentId);
    
    if (currentIndex < sectionIds.length - 1) {
      this.controller.scrollToSection(sectionIds[currentIndex + 1]);
    }
  },
  
  skipToPrevious() {
    if (!this.controller) return;
    
    const currentId = this.controller.getCurrentSection();
    const sectionIds = this.controller.getSectionIds();
    const currentIndex = sectionIds.indexOf(currentId);
    
    if (currentIndex > 0) {
      this.controller.scrollToSection(sectionIds[currentIndex - 1]);
    }
  }
};

// ============================================
// Circle Transition (Three Circle Zoom-Out)
// ============================================
export const circleTransition = {
  container: null,
  circles: [],
  isActive: false,
  progress: 0,
  
  init() {
    // Create transition container if it doesn't exist
    this.container = document.querySelector('.circle-transition');
    if (!this.container) {
      this.createContainer();
    }
    
    this.circles = Array.from(this.container.querySelectorAll('.circle-transition__circle'));
  },
  
  createContainer() {
    this.container = document.createElement('div');
    this.container.className = 'circle-transition';
    this.container.setAttribute('aria-hidden', 'true');
    
    // Create three circles
    const sizes = ['small', 'medium', 'large'];
    sizes.forEach(size => {
      const circle = document.createElement('div');
      circle.className = `circle-transition__circle circle-transition__circle--${size}`;
      this.container.appendChild(circle);
    });
    
    document.body.appendChild(this.container);
  },
  
  /**
   * Animate the circle transition
   * @param {number} progress - 0 to 1, where 0 = circles in corner, 1 = fully zoomed out
   */
  animate(progress) {
    if (!this.container) return;
    
    this.progress = clamp(progress, 0, 1);
    
    // Activate container when transition starts
    if (progress > 0 && !this.isActive) {
      this.isActive = true;
      this.container.classList.add('active');
    }
    
    // Deactivate when complete
    if (progress <= 0 || progress >= 1) {
      if (progress >= 1) {
        this.container.classList.add('complete');
      }
      if (progress <= 0) {
        this.isActive = false;
        this.container.classList.remove('active', 'complete');
      }
    }
    
    // Calculate viewport diagonal for max scale
    const viewportDiagonal = Math.sqrt(
      window.innerWidth ** 2 + window.innerHeight ** 2
    );
    const maxScale = (viewportDiagonal * 2.5) / 350; // Based on small circle size
    
    // Staggered scaling for each circle
    const smallProgress = clamp((progress - 0) / 0.5, 0, 1);
    const mediumProgress = clamp((progress - 0.15) / 0.5, 0, 1);
    const largeProgress = clamp((progress - 0.30) / 0.5, 0, 1);
    
    // Apply transforms
    if (this.circles[0]) {
      const scale = lerp(1, maxScale, smallProgress);
      this.circles[0].style.transform = `scale(${scale})`;
    }
    
    if (this.circles[1]) {
      const scale = lerp(1, maxScale * 0.7, mediumProgress);
      this.circles[1].style.transform = `scale(${scale})`;
    }
    
    if (this.circles[2]) {
      const scale = lerp(1, maxScale * 0.54, largeProgress);
      this.circles[2].style.transform = `scale(${scale})`;
    }
    
    // Fade out at end (70-100%)
    const fadeProgress = clamp((progress - 0.70) / 0.30, 0, 1);
    this.container.style.opacity = 1 - fadeProgress;
  },
  
  /**
   * Reset the transition
   */
  reset() {
    this.progress = 0;
    this.isActive = false;
    
    if (this.container) {
      this.container.classList.remove('active', 'complete');
      this.container.style.opacity = '';
      
      this.circles.forEach(circle => {
        circle.style.transform = '';
      });
    }
  }
};

// ============================================
// Mobile Navigation
// ============================================
export const mobileNav = {
  header: null,
  modal: null,
  closeBtn: null,
  
  init() {
    this.header = document.querySelector('.mobile-nav__header');
    this.modal = document.querySelector('.mobile-modal');
    this.closeBtn = document.querySelector('.mobile-modal__close');
    
    if (this.header) {
      this.header.addEventListener('click', () => this.toggle());
    }
    
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    
    // Close on link click
    const links = document.querySelectorAll('.mobile-modal__link');
    links.forEach(link => {
      link.addEventListener('click', () => this.close());
    });
    
    // Close on backdrop click
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });
    }
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  },
  
  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  },
  
  open() {
    if (this.header) {
      this.header.setAttribute('aria-expanded', 'true');
    }
    if (this.modal) {
      this.modal.classList.add('active');
      this.modal.setAttribute('aria-hidden', 'false');
    }
    document.body.classList.add('is-modal-open');
  },
  
  close() {
    if (this.header) {
      this.header.setAttribute('aria-expanded', 'false');
    }
    if (this.modal) {
      this.modal.classList.remove('active');
      this.modal.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('is-modal-open');
  },
  
  isOpen() {
    return this.modal && this.modal.classList.contains('active');
  }
};

// ============================================
// Final Summary Badge
// ============================================
export const finalSummary = {
  element: null,
  
  init() {
    this.element = document.querySelector('.final-summary');
  },
  
  show() {
    if (this.element) {
      this.element.classList.add('visible');
    }
  },
  
  hide() {
    if (this.element) {
      this.element.classList.remove('visible');
    }
  }
};
