'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import FivePLeadershipChart from '@/components/FivePLeadershipChart'
import { TextReveal } from '@/components/KineticTypography'
import { FloatingElement } from '@/components/MicroAnimations'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function LeadershipChapter() {
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
      className="relative py-32 bg-base"
      data-scroll-section
    >
      <div className="container mx-auto px-4">
        <TextReveal direction="up">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-text-dark">
            領導能力地圖
          </h2>
        </TextReveal>

        <FloatingElement>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
            transition={{ duration: 0.8 }}
          >
            <FivePLeadershipChart />
          </motion.div>
        </FloatingElement>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-xl mb-4 text-text-dark">
            5P 是我推動變革所需的能力地圖
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <div className="px-4 py-2 bg-base-light rounded-lg text-text-light">
              對應主線 A 的「AI 工作流規劃實戰」
            </div>
            <div className="px-4 py-2 bg-base-light rounded-lg text-text-light">
              對應主線 B 的「心智提升」
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
