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
 * 三重地平線的成長策略規劃概念圖
 * 時間軸上的三條 S 型成長曲線
 */
export default function ThreeHorizonsGrowthChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
    // 生成 S 型曲線數據
    const generateSCurve = (startX: number, peakY: number, length: number) => {
      const points = []
      for (let i = 0; i <= length; i++) {
        const x = startX + i
        // S 型曲線公式
        const t = i / length
        const y = peakY * (1 / (1 + Math.exp(-10 * (t - 0.5))))
        points.push([x, y])
      }
      return points
    }

    // H1: 既有核心（現在開始，先上升後下降）
    const h1Data = [
      ...generateSCurve(0, 100, 20).map(([x, y]) => [x, y]),
      ...Array.from({ length: 10 }, (_, i) => [20 + i, 100 - i * 3]),
    ]

    // H2: 新興事業（中期開始，持續上升）
    const h2Data = generateSCurve(10, 120, 25).map(([x, y]) => [x, y + 20])

    // H3: 未來機會（後期開始，初始上升）
    const h3Data = generateSCurve(20, 80, 15).map(([x, y]) => [x, y + 40])

    return {
      title: {
        text: '三重地平線的成長策略規劃概念',
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: isMobile ? 16 : 20,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const param = params[0]
          return `${param.seriesName}<br/>時間: ${param.value[0]}<br/>營業額: ${param.value[1].toFixed(0)}`
        },
      },
      legend: {
        data: ['H1: 既有核心', 'H2: 新興事業', 'H3: 未來機會'],
        bottom: 10,
      },
      grid: {
        left: '10%',
        right: '25%',
        top: '20%',
        bottom: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        name: '時間',
        nameLocation: 'middle',
        nameGap: 30,
        min: 0,
        max: 35,
        axisLabel: {
          formatter: (value: number) => {
            if (value === 0) return '現在'
            return `${value}年`
          },
        },
      },
      yAxis: {
        type: 'value',
        name: '營業額',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          formatter: '{value}',
        },
      },
      series: [
        {
          name: 'H1: 既有核心',
          type: 'line',
          data: h1Data,
          smooth: true,
          lineStyle: {
            color: '#4CAF50',
            width: 3,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(76, 175, 80, 0.3)' },
                { offset: 1, color: 'rgba(76, 175, 80, 0.1)' },
              ],
            },
          },
          itemStyle: {
            color: '#4CAF50',
          },
          emphasis: {
            focus: 'series',
          },
        },
        {
          name: 'H2: 新興事業',
          type: 'line',
          data: h2Data,
          smooth: true,
          lineStyle: {
            color: '#2196F3',
            width: 3,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(33, 150, 243, 0.3)' },
                { offset: 1, color: 'rgba(33, 150, 243, 0.1)' },
              ],
            },
          },
          itemStyle: {
            color: '#2196F3',
          },
          emphasis: {
            focus: 'series',
          },
        },
        {
          name: 'H3: 未來機會',
          type: 'line',
          data: h3Data,
          smooth: true,
          lineStyle: {
            color: '#FF9800',
            width: 3,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 152, 0, 0.3)' },
                { offset: 1, color: 'rgba(255, 152, 0, 0.1)' },
              ],
            },
          },
          itemStyle: {
            color: '#FF9800',
          },
          emphasis: {
            focus: 'series',
          },
        },
      ],
      graphic: [
        // 垂直分隔線
        {
          type: 'line',
          shape: {
            x1: '30%',
            y1: '20%',
            x2: '30%',
            y2: '80%',
          },
          style: {
            stroke: '#999',
            lineWidth: 1,
            lineDash: [5, 5],
          },
        },
        {
          type: 'line',
          shape: {
            x1: '60%',
            y1: '20%',
            x2: '60%',
            y2: '80%',
          },
          style: {
            stroke: '#999',
            lineWidth: 1,
            lineDash: [5, 5],
          },
        },
        // 策略說明框
        {
          type: 'group',
          right: 20,
          top: '25%',
          children: [
            {
              type: 'rect',
              shape: {
                width: 180,
                height: 80,
              },
              style: {
                fill: 'rgba(76, 175, 80, 0.1)',
                stroke: '#4CAF50',
                lineWidth: 2,
              },
            },
            {
              type: 'text',
              left: 10,
              top: 15,
              style: {
                text: '由外而內的成長邏輯\n機會基礎的成長策略',
                fontSize: 12,
                fill: '#1a1a1a',
                lineHeight: 20,
              },
            },
          ],
        },
        {
          type: 'group',
          right: 20,
          top: '55%',
          children: [
            {
              type: 'rect',
              shape: {
                width: 180,
                height: 80,
              },
              style: {
                fill: 'rgba(33, 150, 243, 0.1)',
                stroke: '#2196F3',
                lineWidth: 2,
              },
            },
            {
              type: 'text',
              left: 10,
              top: 15,
              style: {
                text: '由內而外的成長邏輯\n能力基礎的成長策略',
                fontSize: 12,
                fill: '#1a1a1a',
                lineHeight: 20,
              },
            },
          ],
        },
      ],
      animation: isVisible,
      animationDuration: 2000,
      animationEasing: 'cubicOut',
    }
  }, [isVisible, isMobile])

  return (
    <motion.div
      ref={containerRef}
      className="w-full bg-base-light p-4 md:p-6 rounded-xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isVisible ? 1 : 0.7, scale: isVisible ? 1 : 0.95 }}
      transition={{ duration: 0.8 }}
    >
      <ReactECharts
        option={chartOption}
        style={{ height: isMobile ? '400px' : '500px', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </motion.div>
  )
}
