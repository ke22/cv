'use client'

import { useState } from 'react'
import FivePLeadershipChart from './FivePLeadershipChart'

export default function LeadershipSection() {
  const [activeP, setActiveP] = useState<string | null>(null)

  const pItems = [
    { id: 'purpose', label: 'Purpose', title: '目的' },
    { id: 'vision', label: 'Vision', title: '願景' },
    { id: 'path', label: 'Path', title: '路徑' },
    { id: 'priority', label: 'Priority', title: '優先級' },
    { id: 'people', label: 'People', title: '人員' },
  ]

  return (
    <section id="leadership" className="py-16 bg-base">
      <div className="container-custom">
        <h2 className="section-title">領導能力地圖</h2>

        {/* 5P Leadership Chart */}
        <div className="mb-8">
          <FivePLeadershipChart />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {pItems.map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => setActiveP(item.id)}
              onMouseLeave={() => setActiveP(null)}
              className={`p-4 bg-base-light rounded-xl text-center border-2 transition-all cursor-pointer ${
                activeP === item.id
                  ? 'border-accent bg-accent/10 -translate-y-1 shadow-lg'
                  : 'border-border'
              }`}
            >
              <div className="text-lg font-semibold text-accent mb-2">{item.label}</div>
              <div className="text-base text-text-dark">{item.title}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xl mb-4 text-text-dark">
            5P 是我推動變革所需的能力地圖
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <p className="px-4 py-2 bg-base-light rounded-lg text-text-light">
              對應主線 A 的「AI 工作流規劃實戰」
            </p>
            <p className="px-4 py-2 bg-base-light rounded-lg text-text-light">
              對應主線 B 的「心智提升」
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
