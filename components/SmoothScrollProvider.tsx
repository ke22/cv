'use client'

import { useEffect, useRef } from 'react'
import { initLocomotiveScroll, destroyLocomotiveScroll } from '@/lib/locomotive-scroll'

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const scrollRef = useRef<any>(null)

  useEffect(() => {
    // Initialize Locomotive Scroll (動態導入)
    initLocomotiveScroll().then((scroll) => {
      scrollRef.current = scroll

      // Update ScrollTrigger on Locomotive Scroll update
      if (scrollRef.current) {
        scrollRef.current.on('scroll', () => {
          if (typeof window !== 'undefined') {
            const { ScrollTrigger } = require('gsap/ScrollTrigger')
            ScrollTrigger.update()
          }
        })
      }
    })

    return () => {
      destroyLocomotiveScroll(scrollRef.current)
    }
  }, [])

  return <div data-scroll-container>{children}</div>
}
