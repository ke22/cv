'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import KineticTypography from '@/components/KineticTypography'
import { ParallaxElement } from '@/components/ParallaxLayers'
import { AtmosphericContainer, LightFlare, DigitalFog } from '@/components/AtmosphericOverlays'
import { GlowingButton, FloatingElement } from '@/components/MicroAnimations'

export default function StoryHero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  
  // 根據滾動改變背景
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5],
    ['#1a1a1a', '#2d5016']
  )
  
  // 標題淡出
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const titleScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <motion.section
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor }}
      data-scroll-section
    >
      <AtmosphericContainer fog grain flare>
        {/* 背景光暈 */}
        <LightFlare x="20%" y="30%" size={500} />
        <LightFlare x="80%" y="70%" size={400} />
        
        {/* 數位霧 */}
        <DigitalFog intensity={0.3} />

        {/* 主標題 - Kinetic Typography */}
        <motion.div
          className="relative z-10 text-center px-4"
          style={{ opacity: titleOpacity, scale: titleScale }}
        >
          <ParallaxElement speed={-0.3}>
            <KineticTypography
              text="AI 核心流程化"
              className="text-white text-6xl md:text-8xl font-bold mb-8"
            />
          </ParallaxElement>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
          >
            推進編輯產出流程與品質到 AI 核心流程化
          </motion.p>

          <FloatingElement>
            <GlowingButton>
              開始探索
            </GlowingButton>
          </FloatingElement>
        </motion.div>

        {/* 滾動提示 */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="text-sm">向下滾動</div>
        </motion.div>
      </AtmosphericContainer>
    </motion.section>
  )
}
