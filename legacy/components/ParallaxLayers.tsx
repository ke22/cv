'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

/**
 * Parallax Layers - 視差圖層組件
 * 實作：多層視差效果，創造深度感
 */
export default function ParallaxLayers() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // 不同層移動速度不同（創造視差）
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const middleY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const foregroundY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])

  return (
    <div ref={containerRef} className="relative h-[200vh] overflow-hidden">
      {/* Background Layer - 移動最慢 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-accent/20 to-transparent"
        style={{ y: backgroundY }}
      />

      {/* Middle Layer */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ y: middleY }}
      >
        <div className="text-4xl font-bold text-white/50">Middle Layer</div>
      </motion.div>

      {/* Foreground Layer - 移動最快 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ y: foregroundY }}
      >
        <div className="text-6xl font-bold text-white">Foreground</div>
      </motion.div>
    </div>
  )
}

/**
 * Parallax Element - 單一視差元素
 */
export function ParallaxElement({
  children,
  speed = 0.5,
  className = '',
}: {
  children: React.ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100])

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  )
}
