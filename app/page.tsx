// app/page.tsx - Corrected formatting
'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronRight, Star, CheckCircle, ArrowRight, Play } from 'lucide-react'
import AIChatbot from './components/AIChatbot'
import { useRouter } from 'next/navigation'

export default function Homepage() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
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
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x10b981,
                backgroundColor: 0x0a1224,
                points: 3.00,
                maxDistance: 15.00,
                spacing: 18.00,
              }
            } else if (isTablet) {
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
                points: 6.00,
                maxDistance: 16.00,
                spacing: 16.00,
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
                points: 8.00,
                maxDistance: 18.00,
                spacing: 16.00,
              }
            }
            
            vantaEffect.current = window.VANTA.NET(vantaConfig)
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

  const trackCTA = (action: string) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'cta_click', {
        event_category: 'conversion',
        event_label: action,
        value: 1
      })
    }
  }

  // CTA Button Handlers
  const handleAskAnything = (source: string) => {
    trackCTA(`${source}_ask_anything`)
    setIsChatbotOpen(true)
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

            {/* Enhanced CTA Section with new functionality */}
            <div>
              <h2 className="mobile-heading-responsive font-bold text-white mb-8">
                Ready to Automate Your Business?
              </h2>
              <p className="mobile-subheading-responsive text-gray-300 mb-12">
                Join 40+ West Texas contractors who've streamlined their operations with our proven systems.
              </p>
              
              {/* Updated CTA buttons with functionality */}
              <div className="cta-container-mobile">
                <button 
                  onClick={() => handleAskAnything('hero')}
                  className="cta-mobile bg-green-600 hover:bg-green-700 text-white transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  Ask us Anything
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleTryDemo('hero')}
                  className="cta-mobile bg-green-600 hover:bg-green-700 text-white transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  Try a Demo
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Why Us - Fixed Desktop Layout */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto content-spacing-mobile">
            <div className="text-center mb-16">
              <h2 className="mobile-heading-responsive font-bold text-white mb-6">Why Choose Amarillo Automation</h2>
              <p className="mobile-subheading-responsive text-gray-300 max-w-3xl mx-auto">
                We're not just another tech company. We're local automation experts who understand the unique challenges of West Texas home service businesses.
              </p>
            </div>
            
            {/* Fixed: Center and stretch on desktop, stack on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="text-center lg:text-left">
                <h3 className="mobile-subheading-responsive font-bold text-white mb-6">Industry Expertise That Delivers Results</h3>
                <div className="space-y-4 max-w-2xl mx-auto lg:mx-0">
                  <div className="flex items-start justify-center lg:justify-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="mobile-text-responsive text-gray-300 text-left">5+ years automating workflows for contractors, roofers, HVAC, and plumbing companies</p>
                  </div>
                  <div className="flex items-start justify-center lg:justify-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="mobile-text-responsive text-gray-300 text-left">Deep understanding of home service business operations and pain points</p>
                  </div>
                  <div className="flex items-start justify-center lg:justify-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="mobile-text-responsive text-gray-300 text-left">Proven track record with 40+ local businesses and $2M+ in additional revenue generated</p>
                  </div>
                  <div className="flex items-start justify-center lg:justify-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="mobile-text-responsive text-gray-300 text-left">Local support you can trust - we're your neighbors, not a distant corporation</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center lg:text-left">
                <div className="service-card-mobile max-w-2xl mx-auto lg:mx-0">
                  <h4 className="mobile-subheading-responsive font-bold text-white mb-4">What Sets Us Apart</h4>
                  <ul className="space-y-3 mobile-text-responsive text-gray-300 text-left">
                    <li>• Same-day response to all inquiries</li>
                    <li>• Custom solutions, not cookie-cutter templates</li>
                    <li>• Ongoing support and optimization included</li>
                    <li>• ROI-focused approach - every automation pays for itself</li>
                    <li>• No long-term contracts or hidden fees</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Section 4: Reviews/Case Studies - Enhanced Mobile */}
        <section className="section-padding bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto content-spacing-mobile">
            <div className="text-center mb-16">
              <h2 className="mobile-heading-responsive font-bold text-white mb-6">Real Results from Real Businesses</h2>
              <p className="mobile-subheading-responsive text-gray-300">
                See how we've helped local contractors save time, increase revenue, and grow their businesses.
              </p>
            </div>
            
            <div className="case-study-mobile">
              {[
                {
                  company: "Amarillo Roofing Company",
                  problem: "Leads were falling through the cracks, taking hours to respond to new inquiries",
                  solution: "Automated lead routing and instant response system",
                  result: "Response time went from 4+ hours to under 2 minutes. Closed 40% more deals last quarter.",
                  rating: 5
                },
                {
                  company: "Amarillo HVAC Company",
                  problem: "Spending 2+ hours daily on manual scheduling and customer follow-ups",
                  solution: "Complete workflow automation for scheduling and customer communications",
                  result: "Saved 15 hours per week on admin work. Customer satisfaction scores up 35%.",
                  rating: 5
                },
                {
                  company: "Amarillo Plumbing Company",
                  problem: "Lost track of estimates and follow-ups, missing potential revenue",
                  solution: "Automated estimate tracking and follow-up sequences", 
                  result: "Estimate-to-sale conversion increased by 60%. Haven't lost a lead since.",
                  rating: 5
                }
              ].map((review, index) => (
                <div key={index} className="service-card-mobile">
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  
                  <h4 className="mobile-subheading-responsive font-bold text-white mb-4">{review.company}</h4>
                  
                  <div className="space-y-3 mobile-text-responsive">
                    <div>
                      <span className="text-red-400 font-semibold">Problem: </span>
                      <span className="text-gray-300">{review.problem}</span>
                    </div>
                    <div>
                      <span className="text-blue-400 font-semibold">Solution: </span>
                      <span className="text-gray-300">{review.solution}</span>
                    </div>
                    <div>
                      <span className="text-green-400 font-semibold">Result: </span>
                      <span className="text-gray-300">{review.result}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Services and Solutions - Enhanced Mobile */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto content-spacing-mobile">
            {/* Sales Hook */}
            <div className="text-center mb-16">
              <h2 className="mobile-heading-responsive font-bold text-white mb-6">
                You Don't Need High Dollar Software to Use Premium Features
              </h2>
              <p className="mobile-subheading-responsive text-gray-300 max-w-4xl mx-auto">
                We connect your existing tools and create powerful automations using platforms you already trust. No expensive enterprise software required.
              </p>
            </div>

            {/* Workflow Automations Examples - Mobile Optimized */}
            <div className="mb-16">
              <div className="max-w-5xl mx-auto mb-12">
                <div className="case-study-mobile">
                  {[
                    {
                      title: 'New Lead Received',
                      effect: 'Log and organize into your existing database',
                      description: 'Follow up with leads instantly'
                    },
                    {
                      title: 'Missed Call',
                      effect: 'Automatic Text Back',
                      description: 'Never miss a potential customer again'
                    },
                    {
                      title: 'Upcoming Appointment',
                      effect: 'Send Reminder Texts',
                      description: 'Remind customers about appointments'
                    },
                    {
                      title: 'Job Completed',
                      effect: 'Generate and Send Invoice',
                      description: 'Send quotes automatically'
                    },
                    {
                      title: 'Payment Received',
                      effect: 'Request Google Review',
                      description: 'Request reviews when work is done'
                    },
                    {
                      title: 'Your Custom Trigger',
                      effect: 'Your Biggest Lead Solution',
                      description: 'Track jobs in Google Sheets or your CRM',
                      isCustom: true
                    }
                  ].map((automation, index) => (
                    <div 
                      key={index}
                      className={`service-card-mobile transition-all duration-300 hover:shadow-xl backdrop-blur-sm ${
                        automation.isCustom 
                          ? 'border-green-500/50 bg-gradient-to-br from-green-900/20 to-blue-900/20' 
                          : 'hover:border-green-500/30'
                      }`}
                    >
                      <div className="text-center">
                        <div className="mb-4">
                          <p className="mobile-text-responsive text-gray-300 text-center">
                            {automation.description}
                          </p>
                        </div>
                        <h3 className="mobile-subheading-responsive font-semibold text-white mb-3">
                          {automation.title}
                        </h3>
                        <div className="flex justify-center mb-3">
                          <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h4 className="mobile-text-responsive font-medium text-green-400">
                          {automation.effect}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 text-center">
                  <div className="bg-green-900/20 border border-green-600/30 rounded-xl p-6 backdrop-blur-sm">
                    <p className="mobile-subheading-responsive text-green-200 font-semibold">
                      Everything's customized to your business. No extra software. No forced migration. No stress.
                    </p>
                    <p className="mobile-subheading-responsive text-green-400 font-semibold mt-2">
                      You get results — not software headaches.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tools We Use - Mobile Optimized */}
            <div className="mb-16">
              <h3 className="mobile-heading-responsive font-bold text-white mb-8 text-center">Tools We Use</h3>
              <p className="mobile-subheading-responsive text-gray-300 text-center mb-8 max-w-3xl mx-auto">
                We integrate with the platforms you already know and trust. No learning curve, no forced migrations.
              </p>
              
              <div className="tools-grid-mobile">
                {[
                  'Zapier', 'Make.com', 'GoHighLevel', 'Airtable', 
                  'Google Workspace', 'Facebook', 'Instagram', 'YouTube',
                  'QuickBooks', 'Calendly', 'Mailchimp', 'HubSpot',
                  'Salesforce', 'Slack', 'Twilio', 'Gmail',
                  'Google Sheets', 'Notion'
                ].map((tool, index) => (
                  <div key={index} className="tool-card-mobile hover:border-green-500/30 transition-all">
                    <span className="text-gray-300 font-medium text-sm">{tool}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <p className="mobile-text-responsive text-gray-400">And many more! If you use it, we can probably integrate with it.</p>
              </div>
            </div>

            {/* Additional Services - Fixed to 2x2 Grid */}
            <div>
              <h3 className="mobile-heading-responsive font-bold text-white mb-8 text-center">Additional Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {[
                  {
                    title: "Meta Marketing",
                    description: "Facebook and Instagram advertising campaigns that target your ideal customers and track real ROI"
                  },
                  {
                    title: "Advanced Analytics", 
                    description: "Custom dashboards and reporting systems that show exactly what's driving your business growth"
                  },
                  {
                    title: "Artificial Intelligence",
                    description: "AI-powered chatbots and smart tools that qualify leads and handle customer inquiries 24/7"
                  },
                  {
                    title: "General Consultation",
                    description: "Strategic business guidance to identify your biggest growth opportunities and operational improvements"
                  }
                ].map((service, index) => (
                  <div key={index} className="service-card-mobile">
                    <h4 className="mobile-subheading-responsive font-bold text-white mb-3">{service.title}</h4>
                    <p className="mobile-text-responsive text-gray-300">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA - Enhanced with both buttons */}
        <section className="section-padding bg-gray-900/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mobile-heading-responsive font-bold text-white mb-6">
              Stop Losing Leads. Start Growing Your Business.
            </h2>
            <p className="mobile-subheading-responsive text-gray-300 mb-8">
              Every day without automation is money left on the table. Let's change that.
            </p>
            
            {/* Repeat both CTA buttons in footer with functionality */}
            <div className="cta-container-mobile">
              <button 
                onClick={() => handleAskAnything('footer')}
                className="cta-mobile bg-green-600 hover:bg-green-700 text-white transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Ask us Anything
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleTryDemo('footer')}
                className="cta-mobile bg-green-600 hover:bg-green-700 text-white transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Try a Demo
                <Play className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* AI Chatbot */}
      <AIChatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
    </div>
  )
}