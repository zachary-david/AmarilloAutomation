// app/page.tsx - Chatbot Removed, Direct Contact CTAs
'use client'

import { useEffect, useRef } from 'react'
import { ChevronRight, Star, CheckCircle, ArrowRight, Play, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Homepage() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)
  const router = useRouter()

  // Enhanced Vanta.js effect with mobile optimization
  useEffect(() => {
    const loadVanta = async () => {
      if (typeof window !== 'undefined' && !window.VANTA) {
        try {
          // Load Three.js first
          const threeScript = document.createElement('script')
          threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js'
          document.head.appendChild(threeScript)
          
          await new Promise(resolve => { threeScript.onload = resolve })
          
          // Then load Vanta.js
          const vantaScript = document.createElement('script')
          vantaScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.net.min.js'
          document.head.appendChild(vantaScript)
          
          await new Promise(resolve => { vantaScript.onload = resolve })
          
          // Initialize Vanta effect with mobile optimization
          if (vantaRef.current && window.VANTA) {
            const isMobile = window.innerWidth <= 768
            const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768
            
            let vantaConfig
            
            if (isMobile) {
              vantaConfig = {
                el: vantaRef.current,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.0,
                scaleMobile: 1.0,
                color: 0x10b981,
                backgroundColor: 0x0a1224,
                points: 6.00,
                maxDistance: 15.00,
                spacing: 12.00
              }
            } else if (isTablet) {
              vantaConfig = {
                el: vantaRef.current,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 0.9,
                scaleMobile: 0.8,
                color: 0x10b981,
                backgroundColor: 0x0a1224,
                points: 8.00,
                maxDistance: 18.00,
                spacing: 14.00
              }
            } else {
              vantaConfig = {
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
                points: 10.00,
                maxDistance: 20.00,
                spacing: 15.00
              }
            }
            
            vantaEffect.current = window.VANTA.NET(vantaConfig)
          }
        } catch (error) {
          console.error('Failed to load Vanta.js:', error)
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

  // Google Analytics tracking
  const trackCTA = (action: string) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'cta_click', {
        event_category: 'conversion',
        event_label: action,
        value: 1
      })
    }
  }

  // Updated CTA Button Handlers - Direct Contact Methods
  const handleCallNow = (source: string) => {
    trackCTA(`${source}_call_now`)
    // Replace with your actual phone number
    window.location.href = 'tel:+18066404586'
  }

  const handleGetConsultation = (source: string) => {
    trackCTA(`${source}_consultation`)
    // You can either redirect to a contact page or use a scheduling link
    // Option 1: Redirect to contact page
    router.push('/contact')
    
    // Option 2: Direct to scheduling tool (uncomment and replace with your actual link)
    // window.open('https://cal.com/amarilloautomation/consultation', '_blank')
  }

  const handleTryDemo = (source: string) => {
    trackCTA(`${source}_demo`)
    router.push('/demo')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Vanta Background */}
      <div ref={vantaRef} className="fixed inset-0 z-0" />
      
      {/* Content */}
      <div className="relative z-10">
        
        {/* Section 1: Hero - Enhanced Mobile */}
        <section className="hero-mobile flex items-center justify-center mobile-container">
          <div className="max-w-4xl mx-auto text-center content-spacing-mobile">
            {/* Company Name with mobile responsive sizing */}
            <h1 className="hero-title-mobile font-bold text-white mb-6 tracking-tight">
              AMARILLO AUTOMATION
            </h1>
            
            {/* Subheader with responsive sizing */}
            <h2 className="hero-subtitle-mobile text-gray-300 mb-12 font-light">
              Workflow automation experts for local home services
            </h2>
            
            {/* Value Proposition with mobile-first layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="value-card-mobile">
                <h3 className="mobile-subheading-responsive font-bold text-white mb-3">Save Time</h3>
                <p className="mobile-text-responsive text-gray-300 leading-relaxed">
                  Automate repetitive tasks and eliminate manual data entry. Focus on what matters - growing your business.
                </p>
              </div>
              <div className="value-card-mobile">
                <h3 className="mobile-subheading-responsive font-bold text-white mb-3">Make Money</h3>
                <p className="mobile-text-responsive text-gray-300 leading-relaxed">
                  Faster lead response times and better follow-up systems mean more customers and higher conversion rates.
                </p>
              </div>
              <div className="value-card-mobile">
                <h3 className="mobile-subheading-responsive font-bold text-white mb-3">Simplify Operations</h3>
                <p className="mobile-text-responsive text-gray-300 leading-relaxed">
                  Streamline your workload and lead management with systems that work while you sleep.
                </p>
              </div>
            </div>

            {/* CTA Buttons - Updated for Direct Contact */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center cta-container-mobile">
              <button 
                onClick={() => handleCallNow('hero')}
                className="cta-mobile bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-3 transition-all duration-300 w-full sm:w-auto"
              >
                <Phone className="w-5 h-5" />
                Call for Free Consultation
              </button>
              
              <button 
                onClick={() => handleTryDemo('hero')}
                className="cta-secondary-mobile border-2 border-green-600 text-green-400 hover:bg-green-600 hover:text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-3 transition-all duration-300 w-full sm:w-auto"
              >
                <Play className="w-5 h-5" />
                Try Demo
              </button>
            </div>
          </div>
        </section>

        {/* Section 2: Social Proof */}
        <section className="section-padding bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-300 font-medium">5.0 from local contractors</span>
            </div>
            
            <blockquote className="mobile-text-responsive text-gray-300 italic mb-8 max-w-3xl mx-auto leading-relaxed">
              "Since implementing Amarillo Automation's lead system, we've doubled our response time and increased our close rate by 40%. The automated follow-up alone has brought in $50K in additional revenue this quarter."
            </blockquote>
            <cite className="text-green-400 font-semibold">— Sarah M., Roofing Contractor</cite>
          </div>
        </section>

        {/* Section 3: Problem/Solution */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="mobile-heading-responsive font-bold text-white mb-4">
                Stop Losing Leads to Competitors
              </h2>
              <p className="mobile-text-responsive text-gray-300 max-w-2xl mx-auto leading-relaxed">
                The average contractor loses 67% of leads due to slow response times. 
                Our automation ensures you're first to respond, every time.
              </p>
            </div>
            
            <div className="case-study-mobile">
              <div className="service-card-mobile bg-red-900/20 border border-red-500/30">
                <h3 className="mobile-subheading-responsive font-bold text-red-400 mb-4">❌ Without Automation</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="mobile-text-responsive">• Leads wait hours for responses</li>
                  <li className="mobile-text-responsive">• Manual follow-up gets forgotten</li>
                  <li className="mobile-text-responsive">• Competitors respond faster</li>
                  <li className="mobile-text-responsive">• Revenue lost to slow processes</li>
                </ul>
              </div>
              
              <div className="service-card-mobile bg-green-900/20 border border-green-500/30">
                <h3 className="mobile-subheading-responsive font-bold text-green-400 mb-4">✅ With Our System</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="mobile-text-responsive">• Instant automated responses</li>
                  <li className="mobile-text-responsive">• Smart follow-up sequences</li>
                  <li className="mobile-text-responsive">• Beat competitors every time</li>
                  <li className="mobile-text-responsive">• 40%+ more qualified appointments</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Services Grid */}
        <section className="section-padding bg-gray-900/30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="mobile-heading-responsive font-bold text-white mb-4">
                Complete Business Automation Suite
              </h2>
              <p className="mobile-text-responsive text-gray-300 max-w-3xl mx-auto leading-relaxed">
                From lead capture to customer management, we automate the entire customer journey for home service businesses.
              </p>
            </div>
            
            <div className="service-grid-mobile">
              <div className="service-card-mobile">
                <h3 className="mobile-subheading-responsive font-bold text-white mb-4">Lead Automation</h3>
                <p className="mobile-text-responsive text-gray-300 mb-6 leading-relaxed">
                  Capture leads from ANGI, Google, Facebook, and your website. Instant responses and smart routing to your team.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="mobile-text-responsive text-gray-300">2-minute response guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="mobile-text-responsive text-gray-300">Multi-platform integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="mobile-text-responsive text-gray-300">Smart lead scoring</span>
                  </div>
                </div>
              </div>
              
              <div className="service-card-mobile">
                <h3 className="mobile-subheading-responsive font-bold text-white mb-4">CRM & Follow-up</h3>
                <p className="mobile-text-responsive text-gray-300 mb-6 leading-relaxed">
                  Automated customer relationship management with intelligent follow-up sequences that convert prospects to customers.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="mobile-text-responsive text-gray-300">Automated appointment booking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="mobile-text-responsive text-gray-300">Smart follow-up sequences</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="mobile-text-responsive text-gray-300">Customer lifecycle management</span>
                  </div>
                </div>
              </div>
              
              <div className="service-card-mobile">
                <h3 className="mobile-subheading-responsive font-bold text-white mb-4">Marketing Automation</h3>
                <p className="mobile-text-responsive text-gray-300 mb-6 leading-relaxed">
                  Multi-channel marketing campaigns that run automatically, nurturing leads from first contact to conversion.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="mobile-text-responsive text-gray-300">Email & SMS campaigns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="mobile-text-responsive text-gray-300">Social media automation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="mobile-text-responsive text-gray-300">Review request automation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: CTA */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mobile-heading-responsive font-bold text-white mb-6">
              Ready to Automate Your Business Growth?
            </h2>
            <p className="mobile-text-responsive text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join West Texas contractors who've automated their way to 40% more leads and 10+ hours saved weekly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center cta-container-mobile">
              <button 
                onClick={() => handleGetConsultation('bottom')}
                className="cta-mobile bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-3 transition-all duration-300 w-full sm:w-auto"
              >
                Get Your Free Automation Plan
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => handleTryDemo('bottom')}
                className="cta-secondary-mobile border-2 border-green-600 text-green-400 hover:bg-green-600 hover:text-white px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-3 transition-all duration-300 w-full sm:w-auto"
              >
                <Play className="w-5 h-5" />
                See Demo First
              </button>
            </div>

            {/* Additional Contact Info */}
            <div className="mt-12 pt-8 border-t border-gray-700">
              <p className="text-gray-400 mb-4">Prefer to talk directly?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

                <span className="hidden sm:block text-gray-600">|</span>
                <a 
                  href="mailto:admin@amarilloautomation.com"
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  admin@amarilloautomation.com
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}