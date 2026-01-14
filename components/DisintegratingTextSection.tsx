'use client'

import DisintegratingText from './DisintegratingText'

export default function DisintegratingTextSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black py-20 px-4" data-scroll-section>
      <div className="container-custom text-center">
        <DisintegratingText 
          text="God helps those\nwho help themselves."
          className="text-4xl md:text-6xl font-bold text-white mb-12"
          delay={30}
        />
        <DisintegratingText 
          text="Know What You Own First"
          className="text-5xl md:text-7xl font-bold text-white"
          delay={40}
        />
      </div>
    </section>
  )
}
