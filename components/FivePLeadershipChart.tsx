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
 * 發展領導力的 5P 架構圖
 * 圍繞中心人物的流程圖
 */
export default function FivePLeadershipChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeP, setActiveP] = useState<string | null>(null)
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
      {
        name: 'purpose',
        label: 'Purpose\n以終為始',
        x: 400,
        y: 100,
        category: 0,
      },
      {
        name: 'vision',
        label: 'Vision\n設定願景',
        x: 400,
        y: 200,
        category: 0,
      },
      {
        name: 'path',
        label: 'Path\n建構路徑',
        x: 200,
        y: 200,
        category: 1,
      },
      {
        name: 'pinnacle',
        label: 'Pinnacle\n以身作則',
        x: 600,
        y: 200,
        category: 1,
      },
      {
        name: 'align',
        label: 'Align\n溝通對焦',
        x: 200,
        y: 350,
        category: 2,
      },
      {
        name: 'motivate',
        label: 'Motivate\n激勵成員',
        x: 600,
        y: 350,
        category: 2,
      },
      {
        name: 'priority',
        label: 'Priority\n要事第一',
        x: 200,
        y: 450,
        category: 3,
      },
      {
        name: 'people',
        label: 'People\n發展他人',
        x: 600,
        y: 450,
        category: 3,
      },
      {
        name: 'leader',
        label: 'Leader',
        x: 400,
        y: 300,
        category: 4,
        symbolSize: 120,
      },
    ]

    // 連線定義
    const links = [
      { source: 'purpose', target: 'vision' },
      { source: 'vision', target: 'path' },
      { source: 'vision', target: 'pinnacle' },
      { source: 'path', target: 'align' },
      { source: 'pinnacle', target: 'motivate' },
      { source: 'align', target: 'priority' },
      { source: 'motivate', target: 'people' },
      { source: 'leader', target: 'path' },
      { source: 'leader', target: 'pinnacle' },
      { source: 'leader', target: 'align' },
      { source: 'leader', target: 'motivate' },
    ]

    return {
      title: {
        text: '發展領導力的 5P 架構',
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 20,
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
              color: node.name === 'leader' 
                ? '#1a1a1a' 
                : activeP && node.name.includes(activeP.toLowerCase())
                ? '#2d5016'
                : '#4CAF50',
              borderColor: '#1a1a1a',
              borderWidth: node.name === 'leader' ? 3 : 2,
            },
            label: {
              show: true,
              formatter: node.label,
              fontSize: node.name === 'leader' ? 16 : 12,
              fontWeight: 'bold',
              color: node.name === 'leader' ? '#fff' : '#1a1a1a',
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
            label: {
              show: false,
            },
          })),
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 4,
            },
          },
          categories: [
            { name: 'top', itemStyle: { color: '#4CAF50' } },
            { name: 'middle', itemStyle: { color: '#2196F3' } },
            { name: 'lower', itemStyle: { color: '#FF9800' } },
            { name: 'bottom', itemStyle: { color: '#9E9E9E' } },
            { name: 'center', itemStyle: { color: '#1a1a1a' } },
          ],
          roam: true,
          animation: isVisible,
          animationDuration: 1500,
          animationEasing: 'cubicOut',
        },
      ],
    }
  }, [activeP, isVisible])

  const pItems = [
    { id: 'purpose', label: 'Purpose', title: '以終為始' },
    { id: 'vision', label: 'Vision', title: '設定願景' },
    { id: 'path', label: 'Path', title: '建構路徑' },
    { id: 'pinnacle', label: 'Pinnacle', title: '以身作則' },
    { id: 'align', label: 'Align', title: '溝通對焦' },
    { id: 'motivate', label: 'Motivate', title: '激勵成員' },
    { id: 'priority', label: 'Priority', title: '要事第一' },
    { id: 'people', label: 'People', title: '發展他人' },
  ]

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
              setActiveP(activeP === params.name ? null : params.name)
            }
          },
        }}
      />

      {/* 5P 說明 */}
      <div className="mt-6 text-center text-sm text-text-light">
        這五個P分別代表不同的行為內容
      </div>
    </motion.div>
  )
}
