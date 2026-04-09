'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Micro Animations - 微動畫組件集合
 * 實作：按鈕發光、圖標脈衝、懸停效果
 */

// 脈衝動畫
export function PulsingIcon({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

// 發光按鈕
export function GlowingButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      className="relative px-8 py-4 bg-primary text-white rounded-lg font-semibold overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* 發光效果 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

// 呼吸效果
export function BreathingElement({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

// 懸浮效果
export function FloatingElement({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

// 打字機效果
export function TypewriterText({
  text,
  speed = 50,
}: {
  text: string
  speed?: number
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  return (
    <span>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        |
      </motion.span>
    </span>
  )
}

// 磁鐵效果（滑鼠靠近時被吸引）
export function MagneticButton({
  children,
  strength = 0.3,
}: {
  children: React.ReactNode
  strength?: number
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    setPosition({
      x: x * strength,
      y: y * strength,
    })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="px-6 py-3 bg-accent text-white rounded-lg"
    >
      {children}
    </motion.button>
  )
}
