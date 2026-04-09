'use client'

import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section id="mission" className="min-h-screen flex items-center justify-center bg-base pt-20" data-scroll-section>
      <div className="container-custom">
        <div className="max-w-4xl">
          <motion.h1
            className="text-4xl md:text-5xl font-bold leading-tight mb-8 text-text-dark"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            我設定主線 A/B，不是個人願望，而是為了把「編輯產出流程與品質」推進到「AI 核心流程化」，同時把實作沉澱成「論文/研討會」的可驗證成果。
          </motion.h1>
          
          <div className="flex gap-4 mt-8 flex-wrap">
            <motion.div
              className="flex-1 min-w-[200px] p-4 rounded-lg border-2 border-track-a bg-blue-50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="font-bold text-lg text-track-a mb-2">主線 A</div>
              <div className="text-sm text-text-light">
                工作/組織（流程與品質、AI 轉型、AI 工作流實戰）
              </div>
            </motion.div>
            <motion.div
              className="flex-1 min-w-[200px] p-4 rounded-lg border-2 border-track-b bg-purple-50"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="font-bold text-lg text-track-b mb-2">主線 B</div>
              <div className="text-sm text-text-light">
                研究/成長（論文研討會、創新場域、心智提升）
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
