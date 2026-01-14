'use client'

export default function MetricsSection() {
  const metrics = [
    {
      id: 'mission',
      label: 'Mission',
      title: '任務目標',
      content: '優化編輯產出流程與品質',
    },
    {
      id: 'strategy',
      label: 'Strategy',
      title: '策略目標',
      content: '視覺創意組為核心 AI 流程轉型',
    },
    {
      id: 'idp',
      label: 'IDP',
      title: '個人發展',
      content: 'AI 工作流實戰 + 論文/研討會 + 心智提升',
    },
  ]

  const resources = [
    {
      title: 'Portfolio PDF',
      description: '作品集與案例',
      link: '#',
    },
    {
      title: 'Quartz/Obsidian Lab',
      description: '知識管理入口',
      link: '#',
    },
    {
      title: 'GitHub Repo',
      description: '程式碼倉庫',
      link: '#',
    },
    {
      title: 'Contact',
      description: '聯絡方式',
      link: '#',
    },
  ]

  return (
    <section id="metrics" className="py-16 bg-base-light">
      <div className="container-custom">
        <h2 className="section-title">指標與資源</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {metrics.map((metric) => (
            <div key={metric.id} className="card text-center">
              <div className="text-sm text-text-light mb-2 uppercase tracking-wide">
                {metric.label}
              </div>
              <div className="text-xl font-semibold text-text-dark">{metric.title}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {metrics.map((metric) => (
            <div key={metric.id} className="card">
              <h3 className="text-xl mb-2 text-text-dark">{metric.title}（{metric.label}）</h3>
              <p className="text-text-light leading-relaxed">{metric.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t-2 border-border">
          <h3 className="text-3xl mb-4 text-center">資源連結</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="card text-center hover:shadow-lg transition-all"
              >
                <h4 className="text-xl mb-2 text-text-dark">{resource.title}</h4>
                <p className="text-sm text-text-light mb-4">{resource.description}</p>
                <a
                  href={resource.link}
                  className="inline-block px-6 py-2 bg-primary text-white rounded text-sm no-underline hover:bg-primary-dark transition-colors"
                >
                  查看
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
