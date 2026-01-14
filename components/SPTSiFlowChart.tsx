'use client'

import ReactECharts from 'echarts-for-react'
import { useMemo, useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * SPTSi 架構流程圖
 * 包含分支和詳細步驟的完整流程
 */
export default function SPTSiFlowChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 80%',
      onEnter: () => setIsVisible(true),
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === containerRef.current) {
          trigger.kill()
        }
      })
    }
  }, [])

  const chartOption = useMemo(() => {
    // 節點定義
    const nodes = [
      // 主流程
      {
        name: 'strategic-choice',
        label: 'Strategic Choice\n策略軸線',
        x: 100,
        y: 300,
        category: 0,
      },
      {
        name: 'key-path',
        label: 'Key Path\n關鍵路徑',
        x: 300,
        y: 300,
        category: 0,
      },
      {
        name: 'tactical-action',
        label: 'Tactical Action\n戰術行動',
        x: 500,
        y: 300,
        category: 0,
      },
      {
        name: 'success-indicator',
        label: 'Success Indicator\n成功指標',
        x: 700,
        y: 300,
        category: 0,
      },
      // Key Path 分支
      {
        name: 's-product',
        label: 'S: 將內容轉化為時尚流行主題的學習產品',
        x: 300,
        y: 150,
        category: 1,
        symbolSize: 120,
      },
      {
        name: 'p1',
        label: 'P1: 課程規劃',
        x: 450,
        y: 100,
        category: 2,
      },
      {
        name: 'p2',
        label: 'P2: 引流轉化',
        x: 500,
        y: 100,
        category: 2,
      },
      {
        name: 'p3',
        label: 'P3: 客群經營',
        x: 550,
        y: 100,
        category: 2,
      },
      // Tactical Actions
      {
        name: 't1',
        label: 'T1: 開發時尚主題學習方案',
        x: 500,
        y: 200,
        category: 3,
      },
      {
        name: 't2',
        label: 'T2',
        x: 550,
        y: 200,
        category: 3,
      },
      {
        name: 't3',
        label: 'T3',
        x: 600,
        y: 200,
        category: 3,
      },
      // Success Indicators
      {
        name: 'si1-1',
        label: 'Si1-1: 完成相關市場的調研',
        x: 700,
        y: 200,
        category: 4,
      },
      {
        name: 'si1-2',
        label: 'Si1-2: 完成第一個課程企劃',
        x: 700,
        y: 250,
        category: 4,
      },
      {
        name: 'si1-3',
        label: 'Si1-3: 完成產品原型',
        x: 700,
        y: 300,
        category: 4,
      },
      {
        name: 'si1-4',
        label: 'Si1-4: 完成產品原型的測試修正',
        x: 700,
        y: 350,
        category: 4,
      },
    ]

    // 連線定義
    const links = [
      // 主流程
      { source: 'strategic-choice', target: 'key-path' },
      { source: 'key-path', target: 'tactical-action' },
      { source: 'tactical-action', target: 'success-indicator' },
      // Key Path 分支
      { source: 'key-path', target: 's-product' },
      { source: 's-product', target: 'p1' },
      { source: 's-product', target: 'p2' },
      { source: 's-product', target: 'p3' },
      // P 到 T
      { source: 'p1', target: 't1' },
      { source: 'p2', target: 't2' },
      { source: 'p3', target: 't3' },
      // T 到 Si
      { source: 't1', target: 'si1-1' },
      { source: 't1', target: 'si1-2' },
      { source: 't1', target: 'si1-3' },
      { source: 't1', target: 'si1-4' },
    ]

    return {
      title: {
        text: 'SPTSi架構: 人物誌案例',
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.dataType === 'node') {
            return params.data.label || params.name
          }
          return ''
        },
      },
      series: [
        {
          type: 'graph',
          layout: 'none',
          data: nodes.map(node => ({
            ...node,
            itemStyle: {
              color: activeStep && node.name.includes(activeStep.toLowerCase())
                ? '#2d5016'
                : '#4CAF50',
              borderColor: '#1a1a1a',
              borderWidth: 2,
            },
            label: {
              show: true,
              formatter: node.label,
              fontSize: (node.symbolSize ?? 50) > 100 ? 11 : 10,
              fontWeight: 'bold',
              color: '#1a1a1a',
              backgroundColor: 'rgba(255,255,255,0.8)',
              padding: [4, 6],
              borderRadius: 4,
            },
            symbolSize: node.symbolSize || 80,
          })),
          links: links.map(link => ({
            ...link,
            lineStyle: {
              color: '#2d5016',
              width: 2,
              curveness: 0.1,
            },
          })),
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 4,
            },
          },
          roam: true,
          animation: isVisible,
          animationDuration: 2000,
          animationEasing: 'cubicOut',
        },
      ],
    }
  }, [activeStep, isVisible])

  return (
    <motion.div
      ref={containerRef}
      className="w-full bg-base-light p-4 md:p-6 rounded-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0.7 }}
      transition={{ duration: 0.8 }}
    >
      <ReactECharts
        option={chartOption}
        style={{ height: '600px', width: '100%' }}
        opts={{ renderer: 'svg' }}
        onEvents={{
          click: (params: any) => {
            if (params.dataType === 'node') {
              setActiveStep(activeStep === params.name ? null : params.name)
            }
          },
        }}
      />

      {/* 說明文字 */}
      <div className="mt-4 text-sm text-text-light">
        <p>例如完成相關課程市場的調研</p>
      </div>
    </motion.div>
  )
}
