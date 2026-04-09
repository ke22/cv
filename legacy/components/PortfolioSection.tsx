'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import ReactECharts from 'echarts-for-react'
import * as d3 from 'd3'
import ThreeHorizonsPortfolioChart from './ThreeHorizonsPortfolioChart'
import SelectionMatrixChart from './SelectionMatrixChart'
import ThreeHorizonsGrowthChart from './ThreeHorizonsGrowthChart'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const [activeHorizon, setActiveHorizon] = useState<string>('h1')

  useEffect(() => {
    if (!sectionRef.current) return

    // GSAP ScrollTrigger for horizon highlighting
    const horizons = sectionRef.current.querySelectorAll('[data-horizon]')
    
    horizons.forEach((horizon) => {
      ScrollTrigger.create({
        trigger: horizon,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setActiveHorizon(horizon.getAttribute('data-horizon') || ''),
        onEnterBack: () => setActiveHorizon(horizon.getAttribute('data-horizon') || ''),
      })
    })

    // Animate chart on scroll
    if (chartRef.current) {
      gsap.from(chartRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        scrollTrigger: {
          trigger: chartRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const horizons = [
    {
      id: 'h1',
      label: 'H1',
      title: '既有核心',
      subtitle: '維持/優化',
      description: '對應主線 A（工作/組織）',
      track: 'A',
      position: { x: 0, y: 0 },
    },
    {
      id: 'h2',
      label: 'H2',
      title: '新興事業',
      subtitle: '擴展能力',
      description: '對應主線 A（工作/組織）',
      track: 'A',
      position: { x: 1, y: 1 },
    },
    {
      id: 'h3',
      label: 'H3',
      title: '未來機會',
      subtitle: '投資學習',
      description: '對應主線 B（研究/成長）',
      track: 'B',
      position: { x: 2, y: 2 },
    },
  ]

  // ECharts configuration for Three Horizons
  const chartOption = {
    title: {
      text: 'Three Horizons',
      left: 'center',
      textStyle: {
        fontSize: 20,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}',
    },
    xAxis: {
      type: 'value',
      name: '時間軸',
    },
    yAxis: {
      type: 'value',
      name: '影響力',
    },
    series: [
      {
        type: 'scatter',
        data: horizons.map((h, i) => [
          h.position.x * 50 + 25,
          h.position.y * 50 + 25,
          h.label,
        ]),
        symbolSize: (data: (number | string)[]) => {
          return activeHorizon === data[2] ? 80 : 50
        },
        itemStyle: {
          color: (params: any) => {
            const horizon = horizons.find((h) => h.label === params.data[2])
            return horizon?.track === 'A' ? '#2563eb' : '#7c3aed'
          },
          opacity: (params: any) => {
            return activeHorizon === params.data[2] ? 1 : 0.6
          },
        },
        label: {
          show: true,
          formatter: '{c}',
          position: 'inside',
          fontSize: 14,
          fontWeight: 'bold',
        },
      },
    ],
    animation: true,
    animationDuration: 1000,
  }

  return (
    <section id="portfolio" ref={sectionRef} className="py-16 bg-base" data-scroll-section>
      <div className="container-custom">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          成長布局
        </motion.h2>

        {/* ECharts Visualization */}
        <div ref={chartRef} className="mb-8 bg-base-light p-6 rounded-xl">
          <ReactECharts
            option={chartOption}
            style={{ height: '400px', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </div>

        <div className="flex gap-4 justify-center flex-wrap mb-8">
          {horizons.map((horizon) => (
            <motion.div
              key={horizon.id}
              data-horizon={horizon.id}
              className={`flex-1 min-w-[200px] max-w-[300px] p-4 bg-gradient-to-br from-base-light to-base rounded-xl text-center border-2 transition-all ${
                activeHorizon === horizon.id
                  ? 'border-accent shadow-lg -translate-y-1'
                  : 'border-border'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-3xl font-bold text-accent mb-2">{horizon.label}</div>
              <div className="text-xl font-semibold mb-2 text-text-dark">{horizon.title}</div>
              <div className="text-sm text-text-light">{horizon.subtitle}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {horizons.map((horizon, index) => (
            <motion.div
              key={horizon.id}
              className={`card-light ${
                activeHorizon === horizon.id
                  ? 'opacity-100 border-l-4 border-accent'
                  : 'opacity-60'
              }`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: activeHorizon === horizon.id ? 1 : 0.6, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-xl mb-2 text-text-dark">
                {horizon.label}：{horizon.title}
              </h3>
              <p className="text-text-light">{horizon.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Three Horizons Portfolio Chart */}
        <div className="mt-12 pt-8 border-t-2 border-border">
          <h3 className="text-3xl mb-4 text-center">三重地平線的事業組合規劃</h3>
          <ThreeHorizonsPortfolioChart />
        </div>

        {/* Selection Matrix Charts */}
        <div className="mt-12 pt-8 border-t-2 border-border">
          <SelectionMatrixChart />
        </div>

        {/* Three Horizons Growth Chart */}
        <div className="mt-12 pt-8 border-t-2 border-border">
          <h3 className="text-3xl mb-4 text-center">三重地平線的成長策略規劃概念</h3>
          <ThreeHorizonsGrowthChart />
        </div>

        {/* Priority Matrix with D3.js (保留原有) */}
        <div className="mt-12 pt-8 border-t-2 border-border">
          <h3 className="text-3xl mb-4 text-center">優先選擇矩陣</h3>
          <p className="text-center text-text-light mb-4">
            用「機會 vs 難度」與「內部效益 vs 資源需求」避免什麼都做
          </p>

          <MatrixVisualization activeHorizon={activeHorizon} />

          <div className="card-light text-center mt-4">
            <h4 className="mb-2 text-text-dark">成長布局選擇</h4>
            <p className="text-text-light">優先方向（1-3個，但不捏造專案名）</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// D3.js Matrix Visualization Component
function MatrixVisualization({ activeHorizon }: { activeHorizon: string }) {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 400
    const height = 400
    const margin = { top: 20, right: 20, bottom: 40, left: 40 }

    const xScale = d3.scaleLinear().domain([0, 1]).range([margin.left, width - margin.right])
    const yScale = d3.scaleLinear().domain([0, 1]).range([height - margin.bottom, margin.top])

    // Draw grid
    svg
      .append('g')
      .selectAll('line')
      .data([0.5])
      .enter()
      .append('line')
      .attr('x1', xScale(0))
      .attr('x2', xScale(1))
      .attr('y1', yScale(0.5))
      .attr('y2', yScale(0.5))
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 2)

    svg
      .append('g')
      .selectAll('line')
      .data([0.5])
      .enter()
      .append('line')
      .attr('x1', xScale(0.5))
      .attr('x2', xScale(0.5))
      .attr('y1', yScale(0))
      .attr('y2', yScale(1))
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 2)

    // Add labels
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#666')
      .text('機會')

    svg
      .append('text')
      .attr('x', 10)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#666')
      .attr('transform', `rotate(-90, 10, ${height / 2})`)
      .text('難度')

    // Add quadrants
    const quadrants = [
      { x: 0.25, y: 0.25, label: '高機會\n低難度', color: '#2d5016' },
      { x: 0.75, y: 0.25, label: '高機會\n高難度', color: '#4a7c2a' },
      { x: 0.25, y: 0.75, label: '低機會\n低難度', color: '#e0e0e0' },
      { x: 0.75, y: 0.75, label: '低機會\n高難度', color: '#f0f0f0' },
    ]

    quadrants.forEach((q) => {
      svg
        .append('rect')
        .attr('x', xScale(q.x - 0.2))
        .attr('y', yScale(q.y + 0.2))
        .attr('width', xScale(0.4) - xScale(0))
        .attr('height', yScale(0) - yScale(0.4))
        .attr('fill', q.color)
        .attr('opacity', 0.3)
        .attr('rx', 8)

      svg
        .append('text')
        .attr('x', xScale(q.x))
        .attr('y', yScale(q.y))
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('fill', '#1a1a1a')
        .text(q.label)
    })
  }, [activeHorizon])

  return (
    <div className="flex justify-center mb-4">
      <svg ref={svgRef} width={400} height={400} className="bg-base-light rounded-lg" />
    </div>
  )
}
