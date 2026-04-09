'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import ThreeHorizonsPortfolioChart from '@/components/ThreeHorizonsPortfolioChart'
import ThreeHorizonsGrowthChart from '@/components/ThreeHorizonsGrowthChart'
import SelectionMatrixChart from '@/components/SelectionMatrixChart'
import { TextReveal } from '@/components/KineticTypography'
import { PulsingIcon } from '@/components/MicroAnimations'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function PortfolioChapter() {
  const containerRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [activeHorizon, setActiveHorizon] = useState<'h1' | 'h2' | 'h3' | null>(null)

  const horizons = [
    {
      id: 'h1',
      label: 'H1',
      title: '既有核心',
      subtitle: '維持/優化',
      description: '對應主線 A（工作/組織）',
      bgColor: '#1a1a1a',
    },
    {
      id: 'h2',
      label: 'H2',
      title: '新興事業',
      subtitle: '擴展能力',
      description: '對應主線 A（工作/組織）',
      bgColor: '#2d5016',
    },
    {
      id: 'h3',
      label: 'H3',
      title: '未來機會',
      subtitle: '投資學習',
      description: '對應主線 B（研究/成長）',
      bgColor: '#4a4a4a',
    },
  ]

  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return

    horizons.forEach((horizon, index) => {
      const horizonElement = containerRef.current?.querySelector(
        `[data-horizon="${horizon.id}"]`
      )
      if (!horizonElement) return

      ScrollTrigger.create({
        trigger: horizonElement,
        start: 'top top',
        end: '+=200%', // Scroll-Jacking
        pin: stickyRef.current, // Sticky Positioning
        pinSpacing: true,
        onEnter: () => setActiveHorizon(horizon.id as 'h1' | 'h2' | 'h3'),
        onEnterBack: () => setActiveHorizon(horizon.id as 'h1' | 'h2' | 'h3'),
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        const triggerElement = trigger.vars.trigger
        if (
          triggerElement &&
          typeof triggerElement !== 'string' &&
          'parentElement' in triggerElement &&
          triggerElement.parentElement === containerRef.current
        ) {
          trigger.kill()
        }
      })
    }
  }, [])

  return (
    <section ref={containerRef} className="relative" data-scroll-section>
      {/* Sticky Content */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex items-center justify-center z-10"
      >
        <div className="container mx-auto px-4 text-center">
          <TextReveal direction="up">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
              成長布局
            </h2>
          </TextReveal>

          {/* Horizon Cards */}
          <div className="flex gap-4 justify-center flex-wrap mb-8">
            {horizons.map((horizon) => (
              <motion.div
                key={horizon.id}
                data-horizon={horizon.id}
                className={`p-6 rounded-xl border-2 transition-all ${
                  activeHorizon === horizon.id
                    ? 'scale-110 shadow-2xl border-white'
                    : 'scale-100 opacity-60 border-white/30'
                }`}
                style={{ backgroundColor: horizon.bgColor }}
                whileHover={{ scale: 1.05 }}
              >
                <PulsingIcon>
                  <div className="text-4xl font-bold text-white mb-2">
                    {horizon.label}
                  </div>
                </PulsingIcon>
                <div className="text-xl font-semibold text-white mb-2">
                  {horizon.title}
                </div>
                <div className="text-sm text-white/80">{horizon.subtitle}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Sections */}
      {horizons.map((horizon, index) => (
        <div
          key={horizon.id}
          data-horizon={horizon.id}
          className="h-[200vh] relative"
          style={{ backgroundColor: horizon.bgColor }}
        >
          {/* 在每個 horizon 顯示對應的圖表 */}
          {index === 0 && (
            <div className="absolute inset-0 flex items-center justify-center opacity-80">
              <div className="w-full max-w-6xl px-4">
                <ThreeHorizonsPortfolioChart />
              </div>
            </div>
          )}
          {index === 1 && (
            <div className="absolute inset-0 flex items-center justify-center opacity-80">
              <div className="w-full max-w-6xl px-4">
                <SelectionMatrixChart />
              </div>
            </div>
          )}
          {index === 2 && (
            <div className="absolute inset-0 flex items-center justify-center opacity-80">
              <div className="w-full max-w-6xl px-4">
                <ThreeHorizonsGrowthChart />
              </div>
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
