'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import KineticTypography from './KineticTypography'
import { ParallaxElement } from './ParallaxLayers'
import { AtmosphericContainer, DigitalFog, LightFlare } from './AtmosphericOverlays'
import { GlowingButton, PulsingIcon, FloatingElement } from './MicroAnimations'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Immersive Section - 沉浸式環境組件
 * 組合所有效果創造沉浸式體驗
 */
export default function ImmersiveSection() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // 根據滾動進度改變背景
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['#1a1a1a', '#2d5016', '#1a1a1a']
  )

  // 視角變化
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 5])
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, -5])

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-[300vh] overflow-hidden"
      style={{ backgroundColor }}
      data-scroll-section
    >
      {/* 大氣層疊 */}
      <AtmosphericContainer fog grain flare>
        {/* 背景光暈 */}
        <LightFlare x="20%" y="30%" size={400} />
        <LightFlare x="80%" y="70%" size={300} />

        {/* 動態文字 */}
        <div className="sticky top-0 h-screen flex items-center justify-center z-10">
          <ParallaxElement speed={-0.2}>
            <KineticTypography
              text="AI 核心流程化"
              className="text-white"
            />
          </ParallaxElement>
        </div>

        {/* 內容層 */}
        <div className="relative z-20 px-8 py-32">
          <motion.div
            style={{ rotateX, rotateY }}
            className="perspective-1000"
          >
            {/* 浮動元素 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[1, 2, 3].map((i) => (
                <FloatingElement key={i}>
                  <motion.div
                    className="card bg-white/10 backdrop-blur-md"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                  >
                    <PulsingIcon>
                      <div className="text-4xl mb-4">✨</div>
                    </PulsingIcon>
                    <h3 className="text-xl font-bold mb-2 text-white">
                      功能 {i}
                    </h3>
                    <p className="text-white/80">
                      描述內容
                    </p>
                  </motion.div>
                </FloatingElement>
              ))}
            </div>

            {/* 發光按鈕 */}
            <div className="flex justify-center">
              <GlowingButton onClick={() => console.log('Clicked')}>
                開始探索
              </GlowingButton>
            </div>
          </motion.div>
        </div>

        {/* 數位霧 */}
        <DigitalFog intensity={0.2} />
      </AtmosphericContainer>
    </motion.section>
  )
}
