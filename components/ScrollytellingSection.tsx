'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useScroll, useTransform } from 'framer-motion'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Scrollytelling Section - 滾動敘事組件
 * 實作：Scroll-Jacking, Sticky Positioning, Parallax
 */
export default function ScrollytellingSection() {
  const containerRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      id: 'step-1',
      title: 'S - Strategic Choice',
      content: '你為何選擇主線 A/B',
      bgColor: '#1a1a1a',
    },
    {
      id: 'step-2',
      title: 'P - Key Path',
      content: '把 A/B 對準同一路徑',
      bgColor: '#2d5016',
    },
    {
      id: 'step-3',
      title: 'T - Tactical Action',
      content: '把策略落成可做的動作',
      bgColor: '#4a4a4a',
    },
    {
      id: 'step-4',
      title: 'Si - Success Indicator',
      content: '每一步必須可驗收',
      bgColor: '#1a1a1a',
    },
  ]

  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return

    const container = containerRef.current
    const sticky = stickyRef.current

    // Scroll-Jacking: 控制滾動速度
    steps.forEach((step, index) => {
      const stepElement = container.querySelector(`[data-step="${step.id}"]`)
      if (!stepElement) return

      ScrollTrigger.create({
        trigger: stepElement,
        start: 'top top',
        end: '+=200%', // 延長滾動距離（Scroll-Jacking）
        pin: sticky, // Sticky Positioning
        pinSpacing: true,
        onEnter: () => setCurrentStep(index),
        onEnterBack: () => setCurrentStep(index),
        onUpdate: (self) => {
          // 根據滾動進度更新內容
          const progress = self.progress
          
          // Parallax Effect: 背景移動速度不同
          gsap.to(stepElement, {
            y: progress * 100, // 背景移動
            ease: 'none',
          })

          // 文字淡入
          gsap.to(sticky.querySelector('.step-content'), {
            opacity: progress > 0.3 ? 1 : progress * 2,
            y: (1 - progress) * 50,
            ease: 'power2.out',
          })
        },
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        const triggerElement = trigger.vars.trigger
        if (
          triggerElement &&
          typeof triggerElement !== 'string' &&
          'parentElement' in triggerElement &&
          triggerElement.parentElement === container
        ) {
          trigger.kill()
        }
      })
    }
  }, [])

  return (
    <section ref={containerRef} className="relative" data-scroll-section>
      {/* Sticky Content - 固定在螢幕中央 */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex items-center justify-center z-10"
      >
        <div className="text-center step-content">
          <motion.h2
            key={currentStep}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold mb-4 text-white"
          >
            {steps[currentStep]?.title}
          </motion.h2>
          <motion.p
            key={`${currentStep}-content`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-white/90"
          >
            {steps[currentStep]?.content}
          </motion.p>
        </div>
      </div>

      {/* Scrollable Background Steps */}
      {steps.map((step, index) => (
        <div
          key={step.id}
          data-step={step.id}
          className="h-[200vh] relative"
          style={{ backgroundColor: step.bgColor }}
        >
          {/* Parallax Background Layer */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at ${index * 25}% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            }}
          />
        </div>
      ))}
    </section>
  )
}
