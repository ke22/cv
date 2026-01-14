// GSAP ScrollTrigger utility functions
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }

// Helper function to create scroll-triggered animations
export function createScrollAnimation(
  element: string | HTMLElement,
  animation: gsap.TweenVars,
  scrollConfig?: ScrollTrigger.Vars
) {
  return gsap.to(element, {
    ...animation,
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
      ...scrollConfig,
    },
  })
}

// Helper for pinning elements during scroll
export function pinElement(
  element: string | HTMLElement,
  config?: ScrollTrigger.Vars
) {
  return ScrollTrigger.create({
    trigger: element,
    pin: true,
    start: 'top top',
    endTrigger: element,
    end: 'bottom bottom',
    ...config,
  })
}

// Helper for scroll progress animations
export function createProgressAnimation(
  element: string | HTMLElement,
  progressCallback: (progress: number) => void,
  config?: ScrollTrigger.Vars
) {
  return ScrollTrigger.create({
    trigger: element,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      progressCallback(self.progress)
    },
    ...config,
  })
}
