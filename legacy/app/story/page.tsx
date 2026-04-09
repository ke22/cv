'use client'

import { useEffect, useState } from 'react'
import StoryHero from '@/components/story/StoryHero'
import MissionChapter from '@/components/story/MissionChapter'
import GapChapter from '@/components/story/GapChapter'
import PortfolioChapter from '@/components/story/PortfolioChapter'
import ExecutionChapter from '@/components/story/ExecutionChapter'
import LeadershipChapter from '@/components/story/LeadershipChapter'
import MetricsChapter from '@/components/story/MetricsChapter'
import DisintegratingTextSection from '@/components/DisintegratingTextSection'
import { AtmosphericContainer } from '@/components/AtmosphericOverlays'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// 禁用靜態生成，強制動態渲染
export const dynamic = 'force-dynamic'

export default function StoryPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">載入中...</div>
      </div>
    )
  }
  return (
    <AtmosphericContainer fog grain flare>
      <main className="relative">
        <Navbar />
        
        {/* Chapter 1: Hero - 沉浸式開場 */}
        <StoryHero />
        
        {/* Disintegrating Text Section */}
        <DisintegratingTextSection />
        
        {/* Chapter 2: Mission - 主線 A/B Scrollytelling */}
        <MissionChapter />
        
        {/* Chapter 3: Gap - 現況與差距 */}
        <GapChapter />
        
        {/* Chapter 4: Portfolio - 成長布局 Scrollytelling */}
        <PortfolioChapter />
        
        {/* Chapter 5: Execution - 執行方法 Scrollytelling */}
        <ExecutionChapter />
        
        {/* Chapter 6: Leadership - 領導能力 */}
        <LeadershipChapter />
        
        {/* Chapter 7: Metrics - 指標與資源 */}
        <MetricsChapter />
        
        <Footer />
      </main>
    </AtmosphericContainer>
  )
}
