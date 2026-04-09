'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Kinetic Typography - 動態文字組件
 * 實作：文字移動、淡入、繪製效果
 */
export default function KineticTypography({ 
  text, 
  className = '' 
}: { 
  text: string
  className?: string 
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // 文字淡入和移動
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

  // 文字繪製效果（使用 GSAP）
  useEffect(() => {
    if (!containerRef.current) return

    const chars = containerRef.current.querySelectorAll('.char')
    
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 80%',
      onEnter: () => {
        // 每個字元依次出現
        gsap.from(chars, {
          opacity: 0,
          y: 20,
          duration: 0.3,
          stagger: 0.02, // 字元間延遲
          ease: 'power2.out',
        })
      },
    })
  }, [])

  return (
    <motion.div
      ref={containerRef}
      className={className}
      style={{ opacity, y, scale }}
    >
      <h1 className="text-6xl font-bold">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className="char inline-block"
            style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
    </motion.div>
  )
}

/**
 * Text Reveal - 文字揭示效果
 */
export function TextReveal({ 
  children, 
  direction = 'up' 
}: { 
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const directions = {
    up: { y: [50, 0] as [number, number], x: [0, 0] as [number, number] },
    down: { y: [-50, 0] as [number, number], x: [0, 0] as [number, number] },
    left: { y: [0, 0] as [number, number], x: [50, 0] as [number, number] },
    right: { y: [0, 0] as [number, number], x: [-50, 0] as [number, number] },
  }

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    directions[direction].y
  )
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    directions[direction].x
  )
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <motion.div ref={ref} style={{ opacity, x, y }}>
      {children}
    </motion.div>
  )
}
