import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import Editor from '@/components/landing/Editor'
import Roadmap from '@/components/landing/Roadmap'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main style={{ minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <Features />
      <Editor />
      <Roadmap />
      <Footer />
    </main>
  )
}