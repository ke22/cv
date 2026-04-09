'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { TextReveal } from '@/components/KineticTypography'
import { PulsingIcon } from '@/components/MicroAnimations'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function MissionChapter() {
  const containerRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [activeTrack, setActiveTrack] = useState<'A' | 'B' | null>(null)

  const tracks = [
    {
      id: 'A',
      label: '主線 A',
      title: '工作/組織',
      description: '流程與品質、AI 轉型、AI 工作流實戰',
      color: '#2563eb',
      bgColor: 'rgba(37, 99, 235, 0.1)',
    },
    {
      id: 'B',
      label: '主線 B',
      title: '研究/成長',
      description: '論文研討會、創新場域、心智提升',
      color: '#7c3aed',
      bgColor: 'rgba(124, 58, 237, 0.1)',
    },
  ]

  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return

    // Scroll-Jacking: 每個 track 延長滾動距離
    tracks.forEach((track, index) => {
      const trackElement = containerRef.current?.querySelector(`[data-track="${track.id}"]`)
      if (!trackElement) return

      ScrollTrigger.create({
        trigger: trackElement,
        start: 'top top',
        end: '+=250%', // Scroll-Jacking
        pin: stickyRef.current, // Sticky Positioning
        pinSpacing: true,
        onEnter: () => setActiveTrack(track.id as 'A' | 'B'),
        onEnterBack: () => setActiveTrack(track.id as 'A' | 'B'),
        onUpdate: (self) => {
          const progress = self.progress
          // Parallax: 背景移動
          gsap.to(trackElement, {
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
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
              我設定主線 A/B，不是個人願望
            </h2>
          </TextReveal>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: activeTrack ? 1 : 0.7 }}
            className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12"
          >
            而是為了把「編輯產出流程與品質」推進到「AI 核心流程化」，
            同時把實作沉澱成「論文/研討會」的可驗證成果。
          </motion.p>

          {/* Track Badges */}
          <div className="flex gap-6 justify-center flex-wrap">
            {tracks.map((track) => (
              <motion.div
                key={track.id}
                data-track={track.id}
                className={`p-6 rounded-xl border-2 transition-all ${
                  activeTrack === track.id
                    ? 'scale-110 shadow-2xl'
                    : 'scale-100 opacity-60'
                }`}
                style={{
                  borderColor: track.color,
                  backgroundColor: track.bgColor,
                }}
                whileHover={{ scale: 1.05 }}
              >
                <PulsingIcon>
                  <div
                    className="text-3xl font-bold mb-2"
                    style={{ color: track.color }}
                  >
                    {track.label}
                  </div>
                </PulsingIcon>
                <div className="text-lg font-semibold text-white mb-2">
                  {track.title}
                </div>
                <div className="text-sm text-white/80">{track.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Background */}
      {tracks.map((track, index) => (
        <div
          key={track.id}
          data-track={track.id}
          className="h-[250vh] relative"
          style={{
            backgroundColor: index === 0 ? '#1a1a1a' : '#2d5016',
          }}
        >
          {/* Parallax Background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at ${index * 50}% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            }}
          />
        </div>
      ))}
    </section>
  )
}
