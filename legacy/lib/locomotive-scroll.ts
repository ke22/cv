// Locomotive Scroll setup utility
// 使用動態導入避免 SSR 問題

export async function initLocomotiveScroll(container?: HTMLElement) {
  // 確保只在瀏覽器環境中執行
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null
  }

  // 動態導入 LocomotiveScroll
  const LocomotiveScroll = (await import('locomotive-scroll')).default

  const scrollContainer = container || (document.querySelector('[data-scroll-container]') as HTMLElement)
  
  if (!scrollContainer) {
    return null
  }

  const scroll = new LocomotiveScroll({
    el: scrollContainer,
    smooth: true,
    multiplier: 1,
    class: 'is-revealed',
    scrollbarContainer: (document.querySelector('[data-scroll-container]') as HTMLElement) || undefined,
    scrollFromAnywhere: false,
    gestureDirection: 'vertical',
    reloadOnContextChange: true,
    resetNativeScroll: true,
  })

  return scroll
}

export function destroyLocomotiveScroll(scroll: any) {
  if (scroll && typeof scroll.destroy === 'function') {
    scroll.destroy()
  }
}
