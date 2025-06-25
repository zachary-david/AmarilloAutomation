// app/demo/page.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Navigation from '../components/Navigation'
import { ArrowRight, CheckCircle, Play, Star, DollarSign } from 'lucide-react'

export default function DemoPage() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)

  // Simplified Vanta effect for demo page
  useEffect(() => {
    const loadVanta = async () => {
      if (typeof window !== 'undefined' && !window.VANTA) {
        try {
          const threeScript = document.createElement('script')
          threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js'
          document.head.appendChild(threeScript)
          
          await new Promise(resolve => { threeScript.onload = resolve })
          
          const vantaScript = document.createElement('script')
          vantaScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.net.min.js'
          document.head.appendChild(vantaScript)
          
          await new Promise(resolve => { vantaScript.onload = resolve })
          
          if (vantaRef.current && window.VANTA) {
            vantaEffect.current = window.VANTA.NET({
              el: vantaRef.current,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              scale: 1.00,
              scaleMobile: 1.00,
              color: 0x10b981,
              backgroundColor: 0x0a1224,
              points: 6.00,
              maxDistance: 16.00,
              spacing: 16.00,
            })
          }
        } catch (error) {
          console.log('Vanta.js loading failed:', error)
        }
      }
    }
    
    loadVanta()
    
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
        vantaEffect.current = null
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div ref={vantaRef} className="fixed inset-0 z-0" />
      
      <div className="relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <section className="hero-mobile flex items-center justify-center mobile-container">
          <div className="max-w-4xl mx-auto text-center content-spacing-mobile">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Play className="w-16 h-16 text-green-400" />
                <DollarSign className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2" />
              </div>
            </div>
            
            <h1 className="hero-title-mobile font-bold text-white mb-6">
              See Your Business Automation in Action
            </h1>
            
            <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-lg p-4 mb-8">
              <p className="text-yellow-400 font-bold text-lg mb-2">
                🔥 LIMITED TIME: $25 Automation Starter
              </p>
              <p className="text-gray-300 text-sm">
                Choose 1 automation from our library of 10 proven templates + setup guide 
                <span className="text-yellow-400"> (Normally $75)</span>
              </p>
            </div>
            
            <p className="hero-subtitle-mobile text-gray-300 mb-12">
              Request your personalized demo and choose 1 automation from our library of 10 proven templates - delivered to your inbox within 5 minutes
            </p>

            {/* Demo Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="value-card-mobile">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="mobile-subheading-responsive font-bold text-white mb-3">
                  Instant Demo Access
                </h3>
                <p className="mobile-text-responsive text-gray-300">
                  See real automation workflows built for businesses like yours
                </p>
              </div>
              <div className="value-card-mobile">
                <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <h3 className="mobile-subheading-responsive font-bold text-white mb-3">
                  Choose Your Automation
                </h3>
                <p className="mobile-text-responsive text-gray-300">
                  Pick 1 from 10 proven templates + setup guide + 15-min call
                </p>
              </div>
              <div className="value-card-mobile">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="mobile-subheading-responsive font-bold text-white mb-3">
                  No Risk Trial
                </h3>
                <p className="mobile-text-responsive text-gray-300">
                  See the demo first, then decide if automation is right for you
                </p>
              </div>
            </div>

            {/* Google Form */}
            <div className="max-w-md mx-auto">
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-8 backdrop-blur-sm">
                <h3 className="mobile-subheading-responsive font-bold text-white mb-4 text-center">
                  Get Your Demo + Choose Your $25 Automation
                </h3>
                
                <p className="text-sm text-gray-400 mb-6 text-center">
                  Enter your email below to see 10 automation options and choose the one that fits your business
                </p>
                
                {/* Replace the entire form with Google Form iframe */}
                <div className="w-full">
                  <iframe 
                    src="https://docs.google.com/forms/d/e/1FAIpQLSdgo6c6REVyfndd0pKrQ6S0raHRk107l2R6X8ttJGjtDDBcMA/viewform?embedded=true" 
                    width="100%" 
                    height="300" 
                    frameBorder="0" 
                    marginHeight={0} 
                    marginWidth={0}
                    className="rounded-lg"
                    style={{ background: 'transparent' }}
                  >
                    Loading…
                  </iframe>
                </div>

                <p className="mobile-text-responsive text-gray-400 text-center mt-4">
                  🚀 See 10 automation options + claim your $25 starter in under 5 minutes
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What You Get Section */}
        <section className="section-padding bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mobile-heading-responsive font-bold text-white mb-4">
              Choose 1 Automation for $25
            </h2>
            <p className="text-gray-300 mb-12">Pick from 10 proven templates • Normally $75 each</p>
            
            <div className="case-study-mobile text-left">
              <div className="service-card-mobile bg-green-900/20 border border-green-500/30">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <h3 className="mobile-subheading-responsive font-bold text-white">
                    Your Choice of Automation
                  </h3>
                </div>
                <p className="mobile-text-responsive text-gray-300">
                  Pick 1 from: Contact alerts, lead tracking, follow-ups, review requests, appointment reminders, and 5 more proven templates
                </p>
              </div>
              
              <div className="service-card-mobile bg-green-900/20 border border-green-500/30">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <h3 className="mobile-subheading-responsive font-bold text-white">
                    Complete Setup Guide
                  </h3>
                </div>
                <p className="mobile-text-responsive text-gray-300">
                  Step-by-step instructions to get your chosen automation working in your business
                </p>
              </div>
              
              <div className="service-card-mobile bg-green-900/20 border border-green-500/30">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <h3 className="mobile-subheading-responsive font-bold text-white">
                    15-Minute Setup Call
                  </h3>
                </div>
                <p className="mobile-text-responsive text-gray-300">
                  Quick call to help you get your automation running if you need assistance
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-yellow-400/10 border border-yellow-400/30 rounded-xl">
              <p className="text-yellow-400 font-bold mb-2">⏰ This Offer Expires in 48 Hours</p>
              <p className="text-gray-300 text-sm">
                Complete the demo request above to see all 10 automation options and lock in your $25 starter before the price returns to $75
              </p>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mobile-heading-responsive font-bold text-white mb-8">
              Join 40+ West Texas Businesses
            </h2>
            
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
              ))}
            </div>
            
            <p className="mobile-subheading-responsive text-gray-300 mb-8">
              "Started with the $25 automation and within 2 weeks we were saving 5 hours per week 
              and never missing important leads. Perfect starter solution."
            </p>
            
            <p className="mobile-text-responsive text-gray-400">
              - Local Amarillo Contractor
            </p>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Questions? Email us at{' '}
                <a href="mailto:admin@amarilloautomation.com" className="text-green-400 hover:underline">
                  admin@amarilloautomation.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}