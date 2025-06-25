// app/demo/page.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Navigation from '../components/Navigation'
import { ArrowRight, CheckCircle, Play, Star, DollarSign } from 'lucide-react'
import ExitIntentDemo from '../components/ExitIntentDemo'
import InteractiveLeadDemo from '../components/InteractiveLeadDemo'

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
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[6px] border-l-green-400 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>
            
            <h1 className="hero-title-mobile font-bold text-white mb-6">
              See Your <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Business Automation</span> in Action
            </h1>
            
            <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-lg p-4 mb-8">
              <p className="text-yellow-400 font-bold text-lg mb-2">
                LIVE DEMO: See 4-Second Lead Response
              </p>
              <p className="text-gray-300 text-sm">
                Watch what happens when a lead comes in while your competition is still checking email
              </p>
            </div>
            
            <p className="hero-subtitle-mobile text-gray-300 mb-12">
              Enter your info below and experience the automation that's helping West Texas contractors respond to leads in seconds, not hours
            </p>

            {/* Demo Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="value-card-mobile">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="mobile-subheading-responsive font-bold text-white mb-3">
                  Interactive Demo
                </h3>
                <p className="mobile-text-responsive text-gray-300">
                  See real automation working with your actual contact info
                </p>
              </div>
              <div className="value-card-mobile">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="mobile-subheading-responsive font-bold text-white mb-3">
                  4-Second Response Time
                </h3>
                <p className="mobile-text-responsive text-gray-300">
                  Watch leads get processed faster than competitors can read emails
                </p>
              </div>
              <div className="value-card-mobile">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="mobile-subheading-responsive font-bold text-white mb-3">
                  Immediate Results
                </h3>
                <p className="mobile-text-responsive text-gray-300">
                  See exactly how this automation would work for your business
                </p>
              </div>
            </div>

            {/* Interactive Demo Component */}
            <div className="max-w-md mx-auto" id="demo-form">
              <InteractiveLeadDemo />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="section-padding bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mobile-heading-responsive font-bold text-white mb-4">
              How Our Automation Wins Leads
            </h2>
            <p className="text-gray-300 mb-12">The system that's helping contractors close more deals</p>
            
            <div className="case-study-mobile text-left">
              <div className="service-card-mobile bg-green-900/20 border border-green-500/30">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <h3 className="mobile-subheading-responsive font-bold text-white">
                    Instant Lead Detection
                  </h3>
                </div>
                <p className="mobile-text-responsive text-gray-300">
                  System monitors ANGI, Google, and website forms 24/7. New leads trigger immediate action.
                </p>
              </div>
              
              <div className="service-card-mobile bg-green-900/20 border border-green-500/30">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <h3 className="mobile-subheading-responsive font-bold text-white">
                    Smart Response Generation
                  </h3>
                </div>
                <p className="mobile-text-responsive text-gray-300">
                  AI analyzes the lead and creates personalized responses. Emergency jobs get priority handling.
                </p>
              </div>
              
              <div className="service-card-mobile bg-green-900/20 border border-green-500/30">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <h3 className="mobile-subheading-responsive font-bold text-white">
                    Automatic Follow-up System
                  </h3>
                </div>
                <p className="mobile-text-responsive text-gray-300">
                  Multi-channel follow-up ensures no lead falls through cracks. You win more jobs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mobile-heading-responsive font-bold text-white mb-8">
              Join Amarillo Contractors Already Using This System
            </h2>
            
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
              ))}
            </div>
            
            <p className="mobile-subheading-responsive text-gray-300 mb-8">
              "The demo showed me exactly what I was missing. Now I respond to leads faster than anyone in town. 
              My conversion rate went from 8% to 23% in two months."
            </p>
          
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Ready to Stop Losing Leads to Faster Competitors?
              </h3>
              <a 
                href="https://calendly.com/amarilloautomation/strategy-call"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                🚀 Get This System For My Business
              </a>
              <p className="text-gray-400 text-sm mt-4">
                Free strategy call • No commitment • See if automation is right for you
              </p>
            </div>

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