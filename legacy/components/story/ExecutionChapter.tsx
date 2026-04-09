'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import SPTSiFlowChart from '@/components/SPTSiFlowChart'
import { TextReveal } from '@/components/KineticTypography'
import { PulsingIcon } from '@/components/MicroAnimations'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ExecutionChapter() {
  const containerRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState<'s' | 'p' | 't' | 'si' | null>(null)

  const steps = [
    {
      id: 's',
      label: 'S',
      title: 'Strategic Choice',
      subtitle: '策略軸線',
      content: '你為何選擇主線 A/B',
      bgColor: '#1a1a1a',
    },
    {
      id: 'p',
      label: 'P',
      title: 'Key Path',
      subtitle: '關鍵路徑',
      content: '把 A/B 對準同一路徑',
      bgColor: '#2d5016',
    },
    {
      id: 't',
      label: 'T',
      title: 'Tactical Action',
      subtitle: '戰術行動',
      content: '把策略落成可做的動作',
      bgColor: '#4a4a4a',
    },
    {
      id: 'si',
      label: 'Si',
      title: 'Success Indicator',
      subtitle: '成功指標',
      content: '每一步必須可驗收',
      bgColor: '#1a1a1a',
    },
  ]

  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return

    steps.forEach((step, index) => {
      const stepElement = containerRef.current?.querySelector(
        `[data-step="${step.id}"]`
      )
      if (!stepElement) return

      ScrollTrigger.create({
        trigger: stepElement,
        start: 'top top',
        end: '+=250%', // Scroll-Jacking
        pin: stickyRef.current, // Sticky Positioning
        pinSpacing: true,
        onEnter: () => setActiveStep(step.id as 's' | 'p' | 't' | 'si'),
        onEnterBack: () => setActiveStep(step.id as 's' | 'p' | 't' | 'si'),
        onUpdate: (self) => {
          const progress = self.progress
          // Parallax: 背景移動
          gsap.to(stepElement, {
            y: progress * 100,
            ease: 'none',
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
            <h2 className="text-4xl md:text-6xl font-bold mb-12 text-white">
              執行方法
            </h2>
          </TextReveal>

          {/* Step Display */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            {activeStep && (
              <>
                <PulsingIcon>
                  <div className="text-8xl font-bold text-white mb-4">
                    {steps.find((s) => s.id === activeStep)?.label}
                  </div>
                </PulsingIcon>
                <div className="text-2xl font-semibold text-white mb-2">
                  {steps.find((s) => s.id === activeStep)?.title}
                </div>
                <div className="text-lg text-white/80 mb-4">
                  {steps.find((s) => s.id === activeStep)?.subtitle}
                </div>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  {steps.find((s) => s.id === activeStep)?.content}
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scrollable Background Steps */}
      {steps.map((step, index) => (
        <div
          key={step.id}
          data-step={step.id}
          className="h-[250vh] relative"
          style={{ backgroundColor: step.bgColor }}
        >
          {/* 在特定步驟顯示 SPTSi 流程圖 */}
          {index === 0 && (
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="w-full max-w-4xl px-4">
                <SPTSiFlowChart />
              </div>
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
