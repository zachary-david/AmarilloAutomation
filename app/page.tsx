// app/page.tsx (Home Page)
'use client'

import { useEffect, useRef } from 'react'
import Navigation from './components/Navigation'
import AnimatedText from './components/AnimatedText'
import FeatureCard from './components/FeatureCard'
import Link from 'next/link'

export default function Home() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)

  useEffect(() => {
    if (!vantaEffect.current && (window as any).VANTA && vantaRef.current) {
      vantaEffect.current = (window as any).VANTA.NET({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x60a5fa,
        backgroundColor: 0x0a1224,
        points: 10,
        maxDistance: 20,
        spacing: 18,
      })
    }
    
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
        vantaEffect.current = null
      }
    }
  }, [])

  return (
    <div className="min-h-screen relative">
      <div ref={vantaRef} className="fixed inset-0 z-0" />
      <div className="relative z-10">
        <Navigation />
        <main>
          {/* Hero Section */}
          <section className="flex-1 flex items-center justify-center px-4 py-20 min-h-screen">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedText 
                text="Welcome to the Future"
                className="text-4xl md:text-6xl font-bold text-white mb-6"
              />
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                Visualize your secure, real-time infrastructure with cutting-edge technology. 
                Experience the power of modern web development.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/solutions"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  Explore Solutions
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 font-bold rounded-lg transition-all duration-300 active:scale-95"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-white text-center mb-4">
                How It Works
              </h2>
              <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
                Get started in three simple steps and transform your infrastructure management experience.
              </p>
              
              <div className="grid gap-6 md:gap-8">
                <FeatureCard
                  number="1"
                  title="Connect Your Network"
                  description="Seamlessly integrate your accounts and data streams with enterprise-grade security. Our platform supports all major cloud providers and on-premise solutions."
                  delay={0}
                />
                <FeatureCard
                  number="2"
                  title="View Real-Time Insights"
                  description="Access comprehensive dashboards with live network status, performance metrics, and predictive analytics. Make informed decisions with actionable intelligence."
                  delay={200}
                />
                <FeatureCard
                  number="3"
                  title="Take Intelligent Action"
                  description="Automate responses, manage alerts, and optimize settings with AI-powered recommendations. Scale your operations efficiently and reliably."
                  delay={400}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}