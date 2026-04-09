'use client'

import ReactECharts from 'echarts-for-react'
import { useMemo, useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface NodeData {
  name: string
  label: string
  x: number
  y: number
  color: string
  description?: string
}

export default function StrategicFrameworkChart() {
  const chartRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [highlightedLinks, setHighlightedLinks] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // 響應式檢測
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 滾動觸發動畫
  useEffect(() => {
    if (!containerRef.current) return

    // GSAP ScrollTrigger 動畫
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 80%',
      onEnter: () => {
        setIsVisible(true)
        // 觸發圖表動畫
        if (chartRef.current) {
          chartRef.current.getEchartsInstance().dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: 0
          })
        }
      },
      onLeaveBack: () => {
        setIsVisible(false)
        setActiveNode(null)
        setHighlightedLinks([])
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === containerRef.current) {
          trigger.kill()
        }
      })
    }
  }, [])

  // 節點資料
  const nodes: NodeData[] = useMemo(() => {
    const baseNodes: NodeData[] = [
      { 
        name: 'as-is', 
        label: '現狀\nAs-is', 
        x: isMobile ? 100 : 150, 
        y: isMobile ? 350 : 400, 
        color: '#4CAF50',
        description: '現況描述'
      },
      { 
        name: 'gap', 
        label: '差距\nGap', 
        x: isMobile ? 100 : 150, 
        y: isMobile ? 250 : 280, 
        color: '#FF9800',
        description: '缺的不是工具，而是「規劃、執行、驗收」結構'
      },
      { 
        name: 'to-be', 
        label: '期望目標\nTo-Be', 
        x: isMobile ? 250 : 300, 
        y: isMobile ? 120 : 150, 
        color: '#4CAF50',
        description: 'AI 核心流程化（可重複、可追溯、可驗收）'
      },
      { 
        name: 'path', 
        label: '關鍵路徑\nPath', 
        x: isMobile ? 250 : 300, 
        y: isMobile ? 280 : 320, 
        color: '#4CAF50',
        description: '路徑規劃'
      },
      { 
        name: 'value', 
        label: '價值觀\nValue', 
        x: isMobile ? 450 : 600, 
        y: isMobile ? 80 : 100, 
        color: '#4CAF50',
        description: '價值觀'
      },
      { 
        name: 'mission', 
        label: '使命\nMission', 
        x: isMobile ? 450 : 600, 
        y: isMobile ? 160 : 200, 
        color: '#4CAF50',
        description: '使命'
      },
      { 
        name: 'vision', 
        label: '願景\nVision', 
        x: isMobile ? 450 : 600, 
        y: isMobile ? 240 : 300, 
        color: '#4CAF50',
        description: '願景'
      }
    ]
    return baseNodes
  }, [isMobile])

  // 連線資料
  const links = useMemo(() => {
    const baseLinks = [
      { source: 'as-is', target: 'gap', type: 'main' },
      { source: 'gap', target: 'to-be', type: 'main' },
      { source: 'to-be', target: 'path', type: 'main', curveness: 0.3 },
      { source: 'path', target: 'as-is', type: 'main', curveness: 0.3 },
      { source: 'to-be', target: 'vision', type: 'connection' },
      { source: 'value', target: 'mission', type: 'cluster', curveness: 0.2 },
      { source: 'value', target: 'vision', type: 'cluster', curveness: 0.2 },
      { source: 'mission', target: 'vision', type: 'cluster', curveness: 0.2 }
    ]
    return baseLinks
  }, [])

  // 高亮相關連線
  const getHighlightedLinks = (nodeName: string): string[] => {
    return links
      .filter(link => link.source === nodeName || link.target === nodeName)
      .map(link => `${link.source}-${link.target}`)
  }

  // ECharts 配置
  const chartOption = useMemo(() => {
    const activeNodeData = nodes.find(n => n.name === activeNode)
    
    return {
      title: {
        text: '發展策略思維的三要素架構',
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: isMobile ? 18 : 22,
          fontWeight: 'bold',
          color: '#1a1a1a'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.dataType === 'node') {
            const node = nodes.find(n => n.name === params.data.name)
            return `${node?.label || params.name}<br/>${node?.description || ''}`
          }
          return ''
        },
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderColor: '#2d5016',
        borderWidth: 2,
        textStyle: {
          color: '#fff'
        }
      },
      series: [
        {
          type: 'graph',
          layout: 'none',
          data: nodes.map(node => {
            const isActive = activeNode === node.name
            const isHighlighted = highlightedLinks.some(link => 
              link.includes(node.name)
            )
            
            return {
              name: node.name,
              x: node.x,
              y: node.y,
              symbolSize: isActive ? (isMobile ? 90 : 110) : (isMobile ? 60 : 80),
              itemStyle: {
                color: node.color,
                borderColor: isActive ? '#1a1a1a' : '#2d5016',
                borderWidth: isActive ? 4 : 2,
                shadowBlur: isActive ? 15 : (isHighlighted ? 8 : 0),
                shadowColor: 'rgba(0,0,0,0.3)'
              },
              label: {
                show: true,
                formatter: node.label,
                fontSize: isMobile ? 11 : 13,
                fontWeight: 'bold',
                color: '#1a1a1a',
                backgroundColor: 'rgba(255,255,255,0.8)',
                padding: [4, 8],
                borderRadius: 4
              }
            }
          }),
          links: links.map(link => {
            const linkId = `${link.source}-${link.target}`
            const isHighlighted = highlightedLinks.includes(linkId) || 
                                 (activeNode && (link.source === activeNode || link.target === activeNode))
            
            return {
              source: link.source,
              target: link.target,
              lineStyle: {
                color: isHighlighted ? '#1a1a1a' : '#2d5016',
                width: isHighlighted ? 5 : (link.type === 'main' ? 3 : 2),
                type: 'solid',
                curveness: link.curveness || 0,
                opacity: isHighlighted ? 1 : (activeNode ? 0.3 : 0.8)
              },
              label: {
                show: false
              }
            }
          }),
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 6
            },
            itemStyle: {
              borderWidth: 4
            }
          },
          roam: true,
          draggable: true,
          animation: isVisible,
          animationDuration: 1500,
          animationEasing: 'cubicOut',
          animationDelay: (idx: number) => idx * 150, // 節點依次出現
          categories: [
            { name: 'main', itemStyle: { color: '#4CAF50' } },
            { name: 'gap', itemStyle: { color: '#FF9800' } },
            { name: 'cluster', itemStyle: { color: '#4CAF50' } }
          ]
        }
      ],
      // 虛線標記（使用 markLine）
      graphic: [
        // Gap 水平虛線
        {
          type: 'line',
          shape: {
            x1: isMobile ? 30 : 50,
            y1: isMobile ? 250 : 280,
            x2: isMobile ? 520 : 700,
            y2: isMobile ? 250 : 280
          },
          style: {
            stroke: '#999',
            lineDash: [5, 5],
            lineWidth: 1
          },
          z: 0
        },
        // Path/As-is 水平虛線
        {
          type: 'line',
          shape: {
            x1: isMobile ? 30 : 50,
            y1: isMobile ? 350 : 400,
            x2: isMobile ? 520 : 700,
            y2: isMobile ? 350 : 400
          },
          style: {
            stroke: '#999',
            lineDash: [5, 5],
            lineWidth: 1
          },
          z: 0
        }
      ]
    }
  }, [nodes, links, activeNode, highlightedLinks, isVisible, isMobile])

  // 處理節點點擊
  const handleChartClick = (params: any) => {
    if (params.dataType === 'node') {
      const nodeName = params.data.name
      
      if (activeNode === nodeName) {
        // 再次點擊取消選擇
        setActiveNode(null)
        setHighlightedLinks([])
      } else {
        // 選擇新節點並高亮相關連線
        setActiveNode(nodeName)
        setHighlightedLinks(getHighlightedLinks(nodeName))
      }
    } else {
      // 點擊空白處取消選擇
      setActiveNode(null)
      setHighlightedLinks([])
    }
  }

  // 更新圖表
  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = chartRef.current.getEchartsInstance()
      chartInstance.setOption(chartOption, true)
    }
  }, [chartOption])

  return (
    <motion.div
      ref={containerRef}
      className="w-full bg-base-light p-4 md:p-6 rounded-xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isVisible ? 1 : 0.7,
        scale: isVisible ? 1 : 0.95
      }}
      transition={{ duration: 0.8 }}
    >
      <ReactECharts
        ref={chartRef}
        option={chartOption}
        style={{ 
          height: isMobile ? '400px' : '500px', 
          width: '100%' 
        }}
        opts={{ renderer: 'svg' }}
        onEvents={{
          click: handleChartClick,
          mouseover: (params: any) => {
            if (params.dataType === 'node') {
              // 滑鼠懸停時預覽高亮
              const nodeName = params.data.name
              if (!activeNode) {
                setHighlightedLinks(getHighlightedLinks(nodeName))
              }
            }
          },
          mouseout: () => {
            if (!activeNode) {
              setHighlightedLinks([])
            }
          }
        }}
      />
      
      {/* 節點說明 */}
      {activeNode && (
        <motion.div
          className="mt-4 p-4 bg-base rounded-lg border-l-4 border-accent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <h4 className="font-bold text-lg mb-2 text-text-dark">
            {nodes.find(n => n.name === activeNode)?.label}
          </h4>
          <p className="text-text-light">
            {nodes.find(n => n.name === activeNode)?.description}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
