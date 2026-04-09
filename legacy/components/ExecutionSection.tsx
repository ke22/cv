'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import SPTSiFlowChart from './SPTSiFlowChart'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ExecutionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const stepsRef = useRef<HTMLDivElement[]>([])
  const [activeStep, setActiveStep] = useState<string>('s')

  useEffect(() => {
    if (!sectionRef.current) return

    const steps = stepsRef.current

    // GSAP ScrollTrigger with pinning effect
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=3000',
      pin: sectionRef.current.querySelector('.sptsi-pipeline-container'),
      pinSpacing: true,
    })

    // Animate each step
    steps.forEach((step, index) => {
      const stepId = step.dataset.step || ''

      ScrollTrigger.create({
        trigger: step,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setActiveStep(stepId),
        onEnterBack: () => setActiveStep(stepId),
      })

      // Stagger animation
      gsap.from(step, {
        opacity: 0,
        x: -50,
        duration: 0.8,
        delay: index * 0.2,
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
    { id: 's', label: 'S', title: 'Strategic Choice', content: '你為何選擇主線 A/B' },
    { id: 'p', label: 'P', title: 'Key Path', content: '把 A/B 對準同一路徑' },
    { id: 't', label: 'T', title: 'Tactical Action', content: '把策略落成可做的動作' },
    { id: 'si', label: 'Si', title: 'Success Indicator', content: '每一步必須可驗收' },
  ]

  return (
    <section id="execution" ref={sectionRef} className="py-16 bg-base-light" data-scroll-section>
      <div className="container-custom">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          執行方法
        </motion.h2>

        {/* SPTSi Flow Chart */}
        <div className="mb-8">
          <SPTSiFlowChart />
        </div>

        <div className="sptsi-pipeline-container">
          <div className="bg-base p-4 rounded-xl shadow-sm mb-8">
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
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <motion.div
                      className="text-4xl font-bold text-accent mb-2"
                      animate={{
                        scale: activeStep === step.id ? 1.2 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.label}
                    </motion.div>
                    <div className="text-sm text-text-light">{step.title}</div>
                  </motion.div>
                  {index < steps.length - 1 && (
                    <motion.div
                      className="text-2xl text-text-light font-light"
                      animate={{
                        opacity: activeStep === step.id ? 1 : 0.3,
                        x: activeStep === step.id ? 0 : -10,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      →
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`card ${
                activeStep === step.id
                  ? 'opacity-100 border-l-4 border-accent shadow-md'
                  : 'opacity-60'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: activeStep === step.id ? 1 : 0.6, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-xl mb-2 text-text-dark">
                {step.label}（{step.title}）
              </h3>
              <p className="text-text-light leading-relaxed">{step.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
