'use client'

export default function FixedCTA() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 px-8 py-4 bg-primary text-white rounded-lg font-semibold shadow-lg hover:bg-primary-dark hover:-translate-y-1 hover:shadow-xl transition-all z-50"
    >
      開始探索
    </button>
  )
}
