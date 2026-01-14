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
 * 三重地平線的事業組合規劃圖
 * 2x2 矩陣：資源適配優先度 vs 機會選擇優先度
 */
export default function ThreeHorizonsPortfolioChart() {
  const chartRef = useRef<any>(null)
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
    // 矩陣數據點
    const data = [
      // H1: 低資源、低機會
      { name: 'H1', value: [1.5, 1.5], horizon: 'H1', size: 60 },
      // H2: 中低資源、中機會 和 中高資源、中高機會
      { name: 'H2', value: [1.8, 2.5], horizon: 'H2', size: 70 },
      { name: 'H2', value: [3.2, 2.8], horizon: 'H2', size: 70 },
      // H3: 高機會、低資源 和 低機會、高資源
      { name: 'H3', value: [1.2, 3.5], horizon: 'H3', size: 80 },
      { name: 'H3', value: [3.5, 1.2], horizon: 'H3', size: 80 },
    ]

    return {
      title: {
        text: '三重地平線的事業組合規劃',
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: isMobile ? 18 : 22,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const horizonLabels: Record<string, string> = {
            H1: 'H1: 既有核心',
            H2: 'H2: 新興事業',
            H3: 'H3: 未來機會',
          }
          return `${horizonLabels[params.data.horizon] || params.name}<br/>位置: (${params.value[0]}, ${params.value[1]})`
        },
      },
      grid: {
        left: '15%',
        right: '15%',
        top: '20%',
        bottom: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        name: '資源適配優先度',
        nameLocation: 'middle',
        nameGap: 30,
        min: 0.5,
        max: 4.5,
        interval: 1,
        axisLabel: {
          formatter: '{value}',
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#e0e0e0',
          },
        },
      },
      yAxis: {
        type: 'value',
        name: '機會選擇優先度',
        nameLocation: 'middle',
        nameGap: 50,
        min: 0.5,
        max: 4.5,
        interval: 1,
        axisLabel: {
          formatter: '{value}',
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#e0e0e0',
          },
        },
      },
      series: [
        {
          type: 'scatter',
          data: data.map(item => ({
            ...item,
            symbolSize: item.size,
            itemStyle: {
              color: item.horizon === 'H1' ? '#4CAF50' : item.horizon === 'H2' ? '#2196F3' : '#FF9800',
              borderColor: '#1a1a1a',
              borderWidth: 2,
            },
            label: {
              show: true,
              formatter: item.horizon,
              fontSize: 16,
              fontWeight: 'bold',
              color: '#1a1a1a',
            },
          })),
          emphasis: {
            scale: true,
            scaleSize: 20,
          },
        },
        // 成長布局選擇箭頭（使用 markLine）
        {
          type: 'graph',
          data: [],
          links: [
            {
              source: [2.5, 2.5],
              target: [3.8, 2.5],
              lineStyle: {
                color: '#FF9800',
                width: 4,
                type: 'solid',
              },
            },
          ],
        },
      ],
      graphic: [
        // 成長布局選擇標籤
        {
          type: 'text',
          left: '65%',
          top: '45%',
          style: {
            text: '成長布局\n選擇',
            fontSize: 14,
            fontWeight: 'bold',
            fill: '#FF9800',
            textAlign: 'left',
          },
        },
        // 象限分隔線
        {
          type: 'line',
          shape: {
            x1: '50%',
            y1: '20%',
            x2: '50%',
            y2: '80%',
          },
          style: {
            stroke: '#999',
            lineWidth: 2,
            lineDash: [5, 5],
          },
        },
        {
          type: 'line',
          shape: {
            x1: '15%',
            y1: '50%',
            x2: '85%',
            y2: '50%',
          },
          style: {
            stroke: '#999',
            lineWidth: 2,
            lineDash: [5, 5],
          },
        },
      ],
      legend: {
        data: ['H1: 既有核心', 'H2: 新興事業', 'H3: 未來機會'],
        bottom: 10,
        itemGap: 20,
      },
      animation: isVisible,
      animationDuration: 1500,
      animationEasing: 'cubicOut',
    }
  }, [isVisible, isMobile])

  const legendData = [
    {
      horizon: 'H3',
      title: '未來事業',
      description: '需中長期投資新能力、成為未來成長動能',
    },
    {
      horizon: 'H2',
      title: '新興事業',
      description: '需再投資、中期可產生結果的事業選擇',
    },
    {
      horizon: 'H1',
      title: '既有核心',
      description: '既有主力事業的直接或低成本延伸',
    },
  ]

  return (
    <motion.div
      ref={containerRef}
      className="w-full bg-base-light p-4 md:p-6 rounded-xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isVisible ? 1 : 0.7, scale: isVisible ? 1 : 0.95 }}
      transition={{ duration: 0.8 }}
    >
      <ReactECharts
        ref={chartRef}
        option={chartOption}
        style={{ height: isMobile ? '400px' : '500px', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />

      {/* 圖例說明 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {legendData.map((item, index) => (
          <motion.div
            key={item.horizon}
            className="p-4 bg-base rounded-lg border-l-4"
            style={{
              borderLeftColor: item.horizon === 'H1' ? '#4CAF50' : item.horizon === 'H2' ? '#2196F3' : '#FF9800',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: index * 0.1 }}
          >
            <h4 className="font-bold text-lg mb-2">
              {item.horizon}: {item.title}
            </h4>
            <p className="text-sm text-text-light">{item.description}</p>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-text-light mt-4 text-sm">
        做資源的配置跟管理的安排
      </p>
    </motion.div>
  )
}
