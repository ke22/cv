declare module 'locomotive-scroll' {
  export interface LocomotiveScrollOptions {
    el?: HTMLElement | string
    name?: string
    offset?: number | [number, number]
    repeat?: boolean
    smooth?: boolean
    smoothMobile?: boolean
    direction?: 'vertical' | 'horizontal'
    inertia?: number
    class?: string
    multiplier?: number
    scrollbarContainer?: HTMLElement | string
    scrollbarClass?: string
    scrollingClass?: string
    draggingClass?: string
    smoothClass?: string
    initClass?: string
    getSpeed?: boolean
    getDirection?: boolean
    reloadOnContextChange?: boolean
    resetNativeScroll?: boolean
    scrollFromAnywhere?: boolean
    gestureDirection?: 'vertical' | 'horizontal'
    tablet?: {
      smooth?: boolean
      breakpoint?: number
    }
    smartphone?: {
      smooth?: boolean
    }
  }

  export default class LocomotiveScroll {
    constructor(options?: LocomotiveScrollOptions)
    el: HTMLElement
    scroll: {
      x: number
      y: number
    }
    limit: {
      x: number
      y: number
    }
    on(event: string, callback: (args?: any) => void): void
    off(event: string, callback?: (args?: any) => void): void
    update(): void
    start(): void
    stop(): void
    scrollTo(target: string | number | HTMLElement, options?: { offset?: number; duration?: number; easing?: string }): void
    setScroll(x: number, y: number): void
    destroy(): void
  }
}
