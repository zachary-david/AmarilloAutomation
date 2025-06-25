'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronRight, Clock, DollarSign, Settings, Star, CheckCircle, ArrowRight } from 'lucide-react'

export default function Homepage() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)

  // Load Vanta.js effect
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
          
          // Initialize Vanta effect
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
              points: 8.00,
              maxDistance: 18.00,
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

  const trackCTA = (action: string) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'cta_click', {
        event_category: 'conversion',
        event_label: action,
        value: 1
      })
    }
  }

  const valueProps = [
    {
      icon: Clock,
      title: "Save Time",
      description: "Automate repetitive tasks and eliminate manual data entry. Focus on what matters - growing your business."
    },
    {
      icon: DollarSign,
      title: "Make Money", 
      description: "Faster lead response times and better follow-up systems mean more customers and higher conversion rates."
    },
    {
      icon: Settings,
      title: "Simplify Operations",
      description: "Streamline your workload and lead management with systems that work while you sleep."
    }
  ]

  const reviews = [
    {
      company: "Panhandle Roofing",
      reviewer: "Mike Johnson, Owner",
      problem: "Leads were falling through the cracks, taking hours to respond to new inquiries",
      solution: "Automated lead routing and instant response system",
      result: "Response time went from 4+ hours to under 2 minutes. Closed 40% more deals last quarter.",
      rating: 5
    },
    {
      company: "Amarillo HVAC Pro",
      reviewer: "Sarah Martinez, Operations Manager", 
      problem: "Spending 2+ hours daily on manual scheduling and customer follow-ups",
      solution: "Complete workflow automation for scheduling and customer communications",
      result: "Saved 15 hours per week on admin work. Customer satisfaction scores up 35%.",
      rating: 5
    },
    {
      company: "West Texas Plumbing",
      reviewer: "David Rodriguez, Owner",
      problem: "Lost track of estimates and follow-ups, missing potential revenue",
      solution: "Automated estimate tracking and follow-up sequences", 
      result: "Estimate-to-sale conversion increased by 60%. Haven't lost a lead since.",
      rating: 5
    }
  ]

  const services = [
    {
      title: "Lead Management Automation",
      description: "Instant lead capture, routing, and response systems that work 24/7"
    },
    {
      title: "Customer Communication Workflows", 
      description: "Automated follow-ups, appointment reminders, and customer satisfaction surveys"
    },
    {
      title: "Scheduling & Calendar Integration",
      description: "Seamless booking systems that sync with your existing calendar and tools"
    },
    {
      title: "Reporting & Analytics",
      description: "Track your business performance with automated reports and insights"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Vanta Background */}
      <div ref={vantaRef} className="fixed inset-0 z-0" />
      
      {/* Content */}
      <div className="relative z-10">
        
        {/* Section 1: Hero */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* 1.01 Company Name */}
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
              AMARILLO AUTOMATION
            </h1>
            
            {/* 1.02 Subheader */}
            <h2 className="text-2xl md:text-3xl text-gray-300 mb-12 font-light">
              Workflow automation experts for local home services
            </h2>
            
            {/* 1.03 Value Proposition */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {valueProps.map((prop, index) => (
                <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
                  <prop.icon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{prop.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{prop.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Call to Action */}
        <section className="py-20 px-4 bg-gray-900/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Ready to Automate Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Join 40+ West Texas contractors who've streamlined their operations with our proven systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => trackCTA('primary_consultation')}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Schedule Free Consultation
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
              <button 
                onClick={() => trackCTA('secondary_demo')}
                className="px-8 py-4 border border-gray-600 text-white hover:bg-gray-800 font-bold rounded-lg transition-all duration-300 active:scale-95"
              >
                See Demo
                <ChevronRight className="w-5 h-5 ml-2 inline" />
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: Why Us */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Choose Amarillo Automation</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We're not just another tech company. We're local automation experts who understand the unique challenges of West Texas home service businesses.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Industry Expertise That Delivers Results</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">5+ years automating workflows for contractors, roofers, HVAC, and plumbing companies</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">Deep understanding of home service business operations and pain points</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">Proven track record with 40+ local businesses and $2M+ in additional revenue generated</p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-300">Local support you can trust - we're your neighbors, not a distant corporation</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
                <h4 className="text-xl font-bold text-white mb-4">What Sets Us Apart</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>• Same-day response to all inquiries</li>
                  <li>• Custom solutions, not cookie-cutter templates</li>
                  <li>• Ongoing support and optimization included</li>
                  <li>• ROI-focused approach - every automation pays for itself</li>
                  <li>• No long-term contracts or hidden fees</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Reviews/Case Studies */}
        <section className="py-20 px-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Real Results from Real Businesses</h2>
              <p className="text-xl text-gray-300">
                See how we've helped local contractors save time, increase revenue, and grow their businesses.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  
                  <h4 className="text-lg font-bold text-white mb-2">{review.company}</h4>
                  <p className="text-sm text-gray-400 mb-4">{review.reviewer}</p>
                  
                  <div className="space-y-3 text-sm">
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

        {/* Section 5: Services and Solutions */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            {/* 5.1 Sales Hook */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                You Don't Need High Dollar Software to Use Premium Features
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                We connect your existing tools and create powerful automations using platforms you already trust. No expensive enterprise software required.
              </p>
            </div>

            {/* 5.2 Core Service Offering - Workflow Automations */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">Core Service: Workflow Automations</h3>
              
              {/* Real Automation Examples - Mobile-First Grid */}
              <div className="max-w-5xl mx-auto mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[
                    {
                      icon: '📝',
                      title: 'New Lead Received',
                      effect: 'Log and organize into your existing database',
                      description: 'Follow up with leads instantly'
                    },
                    {
                      icon: '📱',
                      title: 'Missed Call',
                      effect: 'Automatic Text Back',
                      description: 'Never miss a potential customer again'
                    },
                    {
                      icon: '⏰',
                      title: 'Upcoming Appointment',
                      effect: 'Send Reminder Texts',
                      description: 'Remind customers about appointments'
                    },
                    {
                      icon: '💼',
                      title: 'Job Completed',
                      effect: 'Generate and Send Invoice',
                      description: 'Send quotes automatically'
                    },
                    {
                      icon: '⭐',
                      title: 'Payment Received',
                      effect: 'Request Google Review',
                      description: 'Request reviews when work is done'
                    },
                    {
                      icon: '⚡',
                      title: 'Your Custom Trigger',
                      effect: 'Your Biggest Lead Solution',
                      description: 'Track jobs in Google Sheets or your CRM',
                      isCustom: true
                    }
                  ].map((automation, index) => (
                    <div 
                      key={index}
                      className={`bg-gray-900/50 border rounded-xl p-6 transition-all duration-300 hover:shadow-xl backdrop-blur-sm ${
                        automation.isCustom 
                          ? 'border-green-500/50 bg-gradient-to-br from-green-900/20 to-blue-900/20' 
                          : 'border-gray-700 hover:border-green-500/30'
                      }`}
                    >
                      <div className="text-center">
                        {/* Icon */}
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto ${
                          automation.isCustom 
                            ? 'bg-gradient-to-r from-green-500 to-blue-600' 
                            : 'bg-green-600'
                        }`}>
                          {automation.icon}
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                          <p className="text-sm text-gray-300 text-center">
                            {automation.description}
                          </p>
                        </div>

                        {/* Title (Trigger) */}
                        <h3 className="text-lg font-semibold text-white mb-3">
                          {automation.title}
                        </h3>

                        {/* Arrow */}
                        <div className="flex justify-center mb-3">
                          <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>

                        {/* Effect */}
                        <h4 className="text-base font-medium text-green-400">
                          {automation.effect}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom automation callout */}
                <div className="mt-12 text-center">
                  <div className="bg-green-900/20 border border-green-600/30 rounded-xl p-6 backdrop-blur-sm">
                    <p className="text-green-200 text-lg font-semibold">
                      Everything's customized to your business. No extra software. No forced migration. No stress.
                    </p>
                    <p className="text-green-400 text-xl font-semibold mt-2">
                      You get results — not software headaches.
                    </p>
                  </div>
                </div>
              </div>

              {/* Simple Process Flow */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
                <h4 className="text-xl font-bold text-white mb-6 text-center">How It Works</h4>
                <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Lead Comes In</h4>
                    <p className="text-sm text-gray-300">Phone, web form, or referral</p>
                  </div>
                  
                  <ArrowRight className="w-8 h-8 text-gray-500 hidden md:block" />
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Instant Response</h4>
                    <p className="text-sm text-gray-300">Automated acknowledgment and routing</p>
                  </div>
                  
                  <ArrowRight className="w-8 h-8 text-gray-500 hidden md:block" />
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Follow-Up Sequence</h4>
                    <p className="text-sm text-gray-300">Automated nurturing until close</p>
                  </div>
                  
                  <ArrowRight className="w-8 h-8 text-gray-500 hidden md:block" />
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Customer for Life</h4>
                    <p className="text-sm text-gray-300">Ongoing service and referrals</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 5.3 Other Services */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8 text-center">Additional Services</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {services.map((service, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-white mb-3">{service.title}</h4>
                    <p className="text-gray-300">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 bg-gray-900/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Stop Losing Leads. Start Growing Your Business.
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Every day without automation is money left on the table. Let's change that.
            </p>
            <button 
              onClick={() => trackCTA('final_cta')}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl text-lg"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}