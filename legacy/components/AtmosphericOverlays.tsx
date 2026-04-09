'use client'

import { motion } from 'framer-motion'
import { useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

/**
 * Atmospheric Overlays - 大氣層疊效果
 * 實作：數位霧、光暈、顆粒質感
 */

// 數位霧效果
export function DigitalFog({ intensity = 0.3 }: { intensity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,${intensity}) 0%, transparent 70%)`,
        mixBlendMode: 'overlay',
      }}
    />
  )
}

// 光暈效果
export function LightFlare({
  x = '50%',
  y = '50%',
  size = 200,
}: {
  x?: string | number
  y?: string | number
  size?: number
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        mixBlendMode: 'screen',
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

// 顆粒質感
export function GrainTexture({ opacity = 0.1 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity,
        mixBlendMode: 'overlay',
      }}
    />
  )
}

// 漸變遮罩
export function GradientOverlay({
  direction = 'to bottom',
  colors = ['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)'],
}: {
  direction?: string
  colors?: string[]
}) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `linear-gradient(${direction}, ${colors.join(', ')})`,
      }}
    />
  )
}

// 掃描線效果（CRT 風格）
export function Scanlines({ opacity = 0.1 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, ${opacity}) 2px,
          rgba(0, 0, 0, ${opacity}) 4px
        )`,
        mixBlendMode: 'overlay',
      }}
    />
  )
}

// 組合大氣效果
export function AtmosphericContainer({
  children,
  fog = true,
  grain = true,
  flare = true,
}: {
  children: React.ReactNode
  fog?: boolean
  grain?: boolean
  flare?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const fogOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.3, 0.1])

  return (
    <div ref={ref} className="relative">
      {children}
      {fog && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)`,
            mixBlendMode: 'overlay',
            opacity: fogOpacity,
          }}
        />
      )}
      {grain && <GrainTexture opacity={0.05} />}
      {flare && <LightFlare x="30%" y="20%" size={300} />}
      <Scanlines opacity={0.05} />
    </div>
  )
}
