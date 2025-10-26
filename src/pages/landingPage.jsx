import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import HowItWorks from '../components/HowItWorks'
import BenefitsSection from '../components/BenefitsSection'
import Footer from '../components/Footer'

function LandingPage() {
  useEffect(() => {
    // Scroll animation observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.scroll-fade').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <HowItWorks />
      <BenefitsSection />
      <Footer />
    </div>
  )
}

export default LandingPage
