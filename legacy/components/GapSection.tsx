'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import StrategicFrameworkChart from './StrategicFrameworkChart'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function GapSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const stepsRef = useRef<HTMLDivElement[]>([])
  const [activeStep, setActiveStep] = useState<string>('as-is')

  useEffect(() => {
    if (!sectionRef.current) return

    const steps = stepsRef.current

    // GSAP ScrollTrigger for step highlighting
    steps.forEach((step, index) => {
      const stepId = step.dataset.step || ''
      
      ScrollTrigger.create({
        trigger: step,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setActiveStep(stepId),
        onEnterBack: () => setActiveStep(stepId),
        onLeave: () => {
          if (index < steps.length - 1) {
            setActiveStep(steps[index + 1]?.dataset.step || '')
          }
        },
        onLeaveBack: () => {
          if (index > 0) {
            setActiveStep(steps[index - 1]?.dataset.step || '')
          }
        },
      })

      // Animate step on enter
      gsap.from(step, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        scrollTrigger: {
          trigger: step,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const steps = [
    { id: 'as-is', label: 'As-Is', content: '現況描述' },
    { id: 'gap', label: 'Gap', content: '差距分析' },
    { id: 'path', label: 'Path', content: '路徑規劃' },
    { id: 'to-be', label: 'To-Be', content: '目標狀態' },
  ]

  const textBlocks = [
    {
      id: 'as-is',
      title: 'As-Is',
      content: '現況描述（用你自己的描述，不加新數據）',
    },
    {
      id: 'gap',
      title: 'Gap',
      content: '缺的不是工具，而是「規劃、執行、驗收」結構',
      highlight: true,
    },
    {
      id: 'to-be',
      title: 'To-Be',
      content: 'AI 核心流程化（可重複、可追溯、可驗收）',
    },
  ]

  return (
    <section
      id="gap"
      ref={sectionRef}
      className="py-16 bg-base-light"
      data-scroll-section
    >
      <div className="container-custom">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          現況與差距
        </motion.h2>

        {/* 策略思維框架圖 */}
        <div className="mb-8">
          <StrategicFrameworkChart />
        </div>

        <div className="bg-base p-8 rounded-xl shadow-sm mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-4 flex-1 min-w-[150px]">
                <motion.div
                  ref={(el) => {
                    if (el) stepsRef.current[index] = el
                  }}
                  data-step={step.id}
                  className={`flex-1 p-4 bg-base-light rounded-lg text-center transition-all ${
                    activeStep === step.id
                      ? 'border-2 border-accent bg-accent/10 scale-105'
                      : 'border-2 border-transparent'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="font-bold text-lg text-accent mb-2">{step.label}</div>
                  <div className="text-sm text-text-light">{step.content}</div>
                </motion.div>
                {index < steps.length - 1 && (
                  <motion.div
                    className="text-2xl text-text-light font-light"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeStep === step.id ? 1 : 0.3 }}
                    transition={{ duration: 0.3 }}
                  >
                    →
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {textBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              className={`card ${
                activeStep === block.id ? 'opacity-100 shadow-md -translate-y-1' : 'opacity-60'
              } ${block.highlight ? 'border-l-4 border-accent' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: activeStep === block.id ? 1 : 0.6, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-2xl mb-2 text-text-dark">{block.title}</h3>
              <p className="text-text-light leading-relaxed">{block.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
