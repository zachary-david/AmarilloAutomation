// app/demo/page.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import Navigation from '../components/Navigation'
import { ArrowRight, CheckCircle, Play, Star } from 'lucide-react'

export default function DemoPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    setError('')

    // Track demo request
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'demo_request_submitted',
        email_provided: true,
        conversion_value: 1
      })
    }

    try {
      // Submit to your API endpoint that handles AirTable integration
      const response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          source: 'demo_page',
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit demo request')
      }

      const data = await response.json()
      
      if (data.success) {
        setIsSubmitted(true)
        
        // Track successful submission
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            event: 'demo_request_success',
            email_domain: email.split('@')[1],
            conversion_value: 1
          })
        }
      } else {
        throw new Error(data.error || 'Submission failed')
      }

    } catch (error) {
      console.error('Demo request error:', error)
      setError('Something went wrong. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <div ref={vantaRef} className="fixed inset-0 z-0" />
        <div className="relative z-10">
          <Navigation />
          
          <div className="hero-mobile flex items-center justify-center mobile-container">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-8 backdrop-blur-sm">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
                <h1 className="mobile-heading-responsive font-bold text-green-400 mb-4">
                  Demo Request Received!
                </h1>
                <p className="mobile-subheading-responsive text-gray-300 mb-6">
                  We'll send you a personalized demo link within the next 24 hours. 
                  Check your email (including spam folder) for our demo invitation.
                </p>
                <div className="space-y-4">
                  <a 
                    href="/"
                    className="cta-mobile bg-green-600 hover:bg-green-700 text-white transition-all duration-300 inline-flex"
                  >
                    Return Home
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <p className="mobile-text-responsive text-gray-400">
                    Questions? Email us at{' '}
                    <a href="mailto:info@amarilloautomation.com" className="text-green-400 hover:underline">
                      info@amarilloautomation.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div ref={vantaRef} className="fixed inset-0 z-0" />
      
      <div className="relative z-10">
        <Navigation />
        
        {/* Hero Section */}
        <section className="hero-mobile flex items-center justify-center mobile-container">
          <div className="max-w-4xl mx-auto text-center content-spacing-mobile">
            <div className="flex justify-center mb-6">
              <Play className="w-16 h-16 text-green-400" />
            </div>
            
            <h1 className="hero-title-mobile font-bold text-white mb-6">
              See Automation in Action
            </h1>
            
            <p className="hero-subtitle-mobile text-gray-300 mb-12">
              Get instant access to a personalized demo showing exactly how we can automate your business workflows
            </p>

            {/* Demo Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="value-card-mobile">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="mobile-subheading-responsive font-bold text-white mb-3">
                  Real Examples
                </h3>
                <p className="mobile-text-responsive text-gray-300">
                  See actual automation workflows built for contractors like you
                </p>
              </div>
              <div className="value-card-mobile">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="mobile-subheading-responsive font-bold text-white mb-3">
                  Your Industry
                </h3>
                <p className="mobile-text-responsive text-gray-300">
                  Customized demo based on your specific business type and needs
                </p>
              </div>
              <div className="value-card-mobile">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="mobile-subheading-responsive font-bold text-white mb-3">
                  No Commitment
                </h3>
                <p className="mobile-text-responsive text-gray-300">
                  Free demo with no obligation - see the value before you decide
                </p>
              </div>
            </div>

            {/* Email Form */}
            <div className="max-w-md mx-auto">
              <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-8 backdrop-blur-sm">
                <h3 className="mobile-subheading-responsive font-bold text-white mb-6 text-center">
                  Get Your Free Demo
                </h3>
                
                <form onSubmit={handleSubmit} className="form-mobile">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input-mobile"
                      placeholder="your@email.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {error && (
                    <div className="text-red-400 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="cta-mobile bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white transition-all duration-300"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Me the Demo'}
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <p className="mobile-text-responsive text-gray-400 text-center mt-4">
                    We'll send you a personalized demo link within 24 hours. No spam, promise.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* What You'll See Section */}
        <section className="section-padding bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mobile-heading-responsive font-bold text-white mb-12">
              What You'll See in Your Demo
            </h2>
            
            <div className="case-study-mobile text-left">
              <div className="service-card-mobile">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <h3 className="mobile-subheading-responsive font-bold text-white">
                    Lead Automation
                  </h3>
                </div>
                <p className="mobile-text-responsive text-gray-300">
                  Watch how a new lead automatically gets logged, categorized, and receives instant follow-up
                </p>
              </div>
              
              <div className="service-card-mobile">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <h3 className="mobile-subheading-responsive font-bold text-white">
                    Customer Journey
                  </h3>
                </div>
                <p className="mobile-text-responsive text-gray-300">
                  See the complete automated workflow from initial contact to job completion and review requests
                </p>
              </div>
              
              <div className="service-card-mobile">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <h3 className="mobile-subheading-responsive font-bold text-white">
                    ROI Calculator
                  </h3>
                </div>
                <p className="mobile-text-responsive text-gray-300">
                  Get a personalized estimate of time saved and revenue gained with automation
                </p>
              </div>
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
              "The demo showed us exactly what we needed. Within 30 days of implementation, 
              we were saving 15 hours per week and closing 40% more deals."
            </p>
            
            <p className="mobile-text-responsive text-gray-400">
              - Local Amarillo Contractor
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}