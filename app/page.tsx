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
                text="Tomorrow's Tools. Today."
                className="text-4xl md:text-6xl font-bold text-white mb-6"
              />
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                Intelligent integrations and AI-powered automations to simplify your business and supercharge growth.
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
        </main>
      </div>
    </div>
  )
}