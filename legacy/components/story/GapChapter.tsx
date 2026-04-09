'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import StrategicFrameworkChart from '@/components/StrategicFrameworkChart'
import { TextReveal } from '@/components/KineticTypography'
import { ParallaxElement } from '@/components/ParallaxLayers'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function GapChapter() {
  const containerRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 80%',
      onEnter: () => setIsVisible(true),
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === containerRef.current) {
          trigger.kill()
        }
      })
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative py-32 bg-base-light"
      data-scroll-section
    >
      <div className="container mx-auto px-4">
        <TextReveal direction="up">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-text-dark">
            現況與差距
          </h2>
        </TextReveal>

        {/* 策略思維框架圖 */}
        <ParallaxElement speed={0.2}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
            transition={{ duration: 0.8 }}
          >
            <StrategicFrameworkChart />
          </motion.div>
        </ParallaxElement>

        {/* As-Is → Gap → To-Be 說明 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {[
            {
              title: 'As-Is',
              content: '現況描述（用你自己的描述，不加新數據）',
            },
            {
              title: 'Gap',
              content: '缺的不是工具，而是「規劃、執行、驗收」結構',
              highlight: true,
            },
            {
              title: 'To-Be',
              content: 'AI 核心流程化（可重複、可追溯、可驗收）',
            },
          ].map((block, index) => (
            <motion.div
              key={block.title}
              className={`p-6 rounded-xl bg-base border-2 ${
                block.highlight
                  ? 'border-accent shadow-lg'
                  : 'border-border'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-text-dark">
                {block.title}
              </h3>
              <p className="text-text-light">{block.content}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
