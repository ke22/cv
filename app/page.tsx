import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import GapSection from '@/components/GapSection'
import PortfolioSection from '@/components/PortfolioSection'
import ExecutionSection from '@/components/ExecutionSection'
import LeadershipSection from '@/components/LeadershipSection'
import MetricsSection from '@/components/MetricsSection'
import Footer from '@/components/Footer'
import FixedCTA from '@/components/FixedCTA'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <GapSection />
      <PortfolioSection />
      <ExecutionSection />
      <LeadershipSection />
      <MetricsSection />
      <Footer />
      <FixedCTA />
    </main>
  )
}
