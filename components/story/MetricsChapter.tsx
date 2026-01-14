'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { TextReveal } from '@/components/KineticTypography'
import { PulsingIcon, GlowingButton } from '@/components/MicroAnimations'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function MetricsChapter() {
  const containerRef = useRef<HTMLElement>(null)

  const metrics = [
    {
      label: 'Mission',
      title: '任務目標',
      content: '優化編輯產出流程與品質',
      icon: '🎯',
    },
    {
      label: 'Strategy',
      title: '策略目標',
      content: '視覺創意組為核心 AI 流程轉型',
      icon: '📊',
    },
    {
      label: 'IDP',
      title: '個人發展',
      content: 'AI 工作流實戰 + 論文/研討會 + 心智提升',
      icon: '🚀',
    },
  ]

  const resources = [
    {
      title: 'Portfolio PDF',
      description: '作品集與案例',
      link: '#',
    },
    {
      title: 'Quartz/Obsidian Lab',
      description: '知識管理入口',
      link: '#',
    },
    {
      title: 'GitHub Repo',
      description: '程式碼倉庫',
      link: '#',
    },
    {
      title: 'Contact',
      description: '聯絡方式',
      link: '#',
    },
  ]

  useEffect(() => {
    if (!containerRef.current) return

    // 數字動畫
    const metricElements = containerRef.current.querySelectorAll('.metric-item')
    metricElements.forEach((metric) => {
      ScrollTrigger.create({
        trigger: metric,
        start: 'top 80%',
        onEnter: () => {
          gsap.from(metric.querySelector('.metric-icon'), {
            scale: 0,
            rotation: 180,
            duration: 0.8,
            ease: 'back.out',
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
    <section
      ref={containerRef}
      className="relative py-32 bg-base-light"
      data-scroll-section
    >
      <div className="container mx-auto px-4">
        <TextReveal direction="up">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-text-dark">
            指標與資源
          </h2>
        </TextReveal>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="metric-item p-6 rounded-xl bg-base border-2 border-border text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <PulsingIcon>
                <div className="metric-icon text-5xl mb-4">{metric.icon}</div>
              </PulsingIcon>
              <div className="text-sm font-semibold text-accent mb-2">
                {metric.label}
              </div>
              <h3 className="text-xl font-bold mb-2 text-text-dark">
                {metric.title}
              </h3>
              <p className="text-text-light">{metric.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Resources */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-text-dark">
            資源連結
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                className="p-6 rounded-xl bg-base border-2 border-border"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <h4 className="text-lg font-bold mb-2 text-text-dark">
                  {resource.title}
                </h4>
                <p className="text-sm text-text-light mb-4">
                  {resource.description}
                </p>
                <GlowingButton>
                  查看
                </GlowingButton>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
