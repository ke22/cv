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
 * 三重地平線選擇布局矩陣圖
 * 兩個 2x2 矩陣：機會選擇矩陣 + 資源適配矩陣
 */
export default function SelectionMatrixChart() {
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

  // 機會選擇矩陣配置
  const opportunityMatrixOption = useMemo(() => {
    return {
      title: {
        text: '機會選擇矩陣',
        left: 'center',
        top: 10,
        textStyle: { fontSize: isMobile ? 16 : 18, fontWeight: 'bold' },
      },
      grid: {
        left: '10%',
        right: '10%',
        top: '20%',
        bottom: '10%',
      },
      xAxis: {
        type: 'category',
        data: ['低', '高'],
        name: '進入難度',
        nameLocation: 'middle',
        nameGap: 30,
        axisLine: { lineStyle: { color: '#666' } },
      },
      yAxis: {
        type: 'category',
        data: ['高', '低'],
        name: '市場潛力',
        nameLocation: 'middle',
        nameGap: 50,
        inverse: true,
        axisLine: { lineStyle: { color: '#666' } },
      },
      series: [
        {
          type: 'scatter',
          data: [
            // 象限 1: 高市場潛力、低進入難度（優先選擇）
            { value: [0, 0], symbolSize: 100, itemStyle: { color: '#FF9800' } },
          ],
          label: {
            show: true,
            formatter: '1',
            fontSize: 24,
            fontWeight: 'bold',
            color: '#fff',
          },
        },
        {
          type: 'scatter',
          data: [
            { value: [1, 0], symbolSize: 80, itemStyle: { color: '#2196F3' } }, // 象限 2
            { value: [0, 1], symbolSize: 60, itemStyle: { color: '#9E9E9E' } }, // 象限 3
            { value: [1, 1], symbolSize: 40, itemStyle: { color: '#E0E0E0' } }, // 象限 4
          ],
          label: {
            show: true,
            formatter: (params: any) => {
              const quadrants: Record<string, string> = {
                '0,0': '1',
                '1,0': '2',
                '0,1': '3',
                '1,1': '4',
              }
              return quadrants[`${params.value[0]},${params.value[1]}`] || ''
            },
            fontSize: 20,
            fontWeight: 'bold',
            color: '#1a1a1a',
          },
        },
      ],
      graphic: [
        // 成長布局選擇箭頭
        {
          type: 'polyline',
          shape: {
            points: [
              [200, 200],
              [280, 200],
            ],
          },
          style: {
            stroke: '#FF9800',
            lineWidth: 4,
          },
        },
        {
          type: 'polygon',
          shape: {
            points: [
              [280, 195],
              [300, 200],
              [280, 205],
            ],
          },
          style: {
            fill: '#FF9800',
          },
        },
        {
          type: 'text',
          left: 310,
          top: 190,
          style: {
            text: '成長布局選擇',
            fontSize: 12,
            fontWeight: 'bold',
            fill: '#FF9800',
          },
        },
      ],
      animation: isVisible,
      animationDuration: 1000,
    }
  }, [isVisible, isMobile])

  // 資源適配矩陣配置
  const resourceMatrixOption = useMemo(() => {
    return {
      title: {
        text: '資源適配矩陣',
        left: 'center',
        top: 10,
        textStyle: { fontSize: isMobile ? 16 : 18, fontWeight: 'bold' },
      },
      grid: {
        left: '10%',
        right: '10%',
        top: '20%',
        bottom: '10%',
      },
      xAxis: {
        type: 'category',
        data: ['低', '高'],
        name: '資源需求',
        nameLocation: 'middle',
        nameGap: 30,
        axisLine: { lineStyle: { color: '#666' } },
      },
      yAxis: {
        type: 'category',
        data: ['高', '低'],
        name: '內部綜效',
        nameLocation: 'middle',
        nameGap: 50,
        inverse: true,
        axisLine: { lineStyle: { color: '#666' } },
      },
      series: [
        {
          type: 'scatter',
          data: [
            { value: [0, 0], symbolSize: 100, itemStyle: { color: '#4CAF50' } }, // 象限 1
            { value: [1, 0], symbolSize: 80, itemStyle: { color: '#2196F3' } },   // 象限 2
            { value: [0, 1], symbolSize: 60, itemStyle: { color: '#9E9E9E' } },  // 象限 3
            { value: [1, 1], symbolSize: 40, itemStyle: { color: '#E0E0E0' } },   // 象限 4
          ],
          label: {
            show: true,
            formatter: (params: any) => {
              const quadrants: Record<string, string> = {
                '0,0': '1',
                '1,0': '2',
                '0,1': '3',
                '1,1': '4',
              }
              return quadrants[`${params.value[0]},${params.value[1]}`] || ''
            },
            fontSize: 20,
            fontWeight: 'bold',
            color: '#fff',
          },
        },
      ],
      animation: isVisible,
      animationDuration: 1000,
    }
  }, [isVisible, isMobile])

  return (
    <motion.div
      ref={containerRef}
      className="w-full bg-base-light p-4 md:p-6 rounded-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0.7 }}
      transition={{ duration: 0.8 }}
    >
      <h3 className="text-2xl font-bold text-center mb-6">
        三重地平線選擇布局矩陣圖
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 機會選擇矩陣 */}
        <div>
          <ReactECharts
            option={opportunityMatrixOption}
            style={{ height: '350px', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </div>

        {/* 資源適配矩陣 */}
        <div>
          <ReactECharts
            option={resourceMatrixOption}
            style={{ height: '350px', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </div>
      </div>

      {/* 說明文字 */}
      <div className="mt-6 text-center text-sm text-text-light">
        一樣在高低的分類底下
      </div>
    </motion.div>
  )
}
