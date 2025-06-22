// app/intro-offer/page.tsx - 10-Day Introductory Offer Page
'use client'

import { useState, useEffect, useRef } from 'react'
import Navigation from '../components/Navigation'
import AnimatedText from '../components/AnimatedText'
import Link from 'next/link'

interface FormData {
  businessName: string
  contactPreference: 'call' | 'email' | ''
  name: string
  phone: string
  email: string
  package: 'basic' | 'standard' | 'premium'
}

export default function IntroOffer() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)
  
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'standard' | 'premium'>('standard')
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    contactPreference: '',
    name: '',
    phone: '',
    email: '',
    package: 'standard'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error', message: string} | null>(null)

  // Vanta.js background effect
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
        color: 0xf59e0b,
        backgroundColor: 0x0a1224,
        points: 15,
        maxDistance: 25,
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

  // Track page view
  useEffect(() => {
    window.dataLayer?.push({
      event: 'page_view_enhanced',
      page_title: '10-Day Introductory Offer',
      page_section: 'introductory_offer',
      business_vertical: 'automation_consulting',
      offer_type: 'limited_time_promo'
    })
  }, [])

  // Update form package when selection changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, package: selectedPackage }))
  }, [selectedPackage])

  // Automation options simplified
  const automationOptions = [
    {
      id: 'lead_logging',
      title: 'New Lead Received',
      effect: 'Log and organize into your existing database'
    },
    {
      id: 'missed_call_response',
      title: 'Missed Call',
      effect: 'Automatic Text Back'
    },
    {
      id: 'appointment_reminders',
      title: 'Upcoming Appointment',
      effect: 'Send Reminder Texts'
    },
    {
      id: 'job_completion',
      title: 'Job Completed',
      effect: 'Generate and Send Invoice'
    },
    {
      id: 'payment_received',
      title: 'Payment Received',
      effect: 'Request Google Review'
    },
    {
      id: 'custom_automation',
      title: 'Your Custom Trigger',
      effect: 'Your Biggest Lead Solution',
      isCustom: true
    }
  ]

  const packages = [
    {
      id: 'basic' as const,
      name: 'Starter',
      automations: 2,
      description: 'Perfect for getting started with automation',
      features: [
        '2 Custom Automations',
        'Basic CRM Setup',
        '10-Day Implementation',
        'Email Support'
      ]
    },
    {
      id: 'standard' as const,
      name: 'Professional',
      automations: 3,
      description: 'Most popular choice for growing businesses',
      features: [
        '3 Custom Automations',
        'Advanced CRM Integration',
        '10-Day Implementation',
        'Priority Support',
        'Training Session Included'
      ],
      popular: true
    },
    {
      id: 'premium' as const,
      name: 'Complete',
      automations: 5,
      description: 'Comprehensive automation solution',
      features: [
        '5 Custom Automations',
        'Full CRM Optimization',
        '10-Day Implementation',
        'Priority Support',
        'Training & Documentation',
        'Monthly Check-in Call'
      ]
    }
  ]

  const handlePackageSelect = (packageId: 'basic' | 'standard' | 'premium') => {
    setSelectedPackage(packageId)
    
    window.dataLayer?.push({
      event: 'package_selection',
      package_type: packageId,
      conversion_value: packageId === 'basic' ? 297 : packageId === 'standard' ? 497 : 697
    })
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/introductory-offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'introductory_offer',
          selectedPackage: packages.find(p => p.id === selectedPackage)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      setSubmitStatus({
        type: 'success',
        message: 'Thank you! We\'ll contact you within 24 hours to schedule your free consultation.'
      })

      window.dataLayer?.push({
        event: 'conversion',
        conversion_type: 'introductory_offer_submission',
        package_selected: selectedPackage,
        conversion_value: selectedPackage === 'basic' ? 297 : selectedPackage === 'standard' ? 497 : 697,
        lead_quality: 'high'
      })

    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Something went wrong. Please try again or call us directly.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      <div ref={vantaRef} className="fixed inset-0 z-0" />
      <div className="relative z-10">
        <Navigation />
        <main className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Section 1: Hero Header */}
            <section className="text-center mb-20">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  You don't need expensive software to automate your business.
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-amber-400 mb-8 leading-relaxed">
                  We give you the power of enterprise systems — customized to your workflow — at a fraction of the cost.
                </h2>
                <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                  Forget bloated CRMs and endless subscriptions. We build lean, powerful automations that save you time, 
                  close more leads, and work with the tools you already use.
                </p>
                <a 
                  href="#form" 
                  className="inline-block px-10 py-5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xl rounded-lg transition-all duration-300 active:scale-95 shadow-xl"
                >
                  Start Now
                </a>
              </div>
            </section>

            {/* Section 2: Done-for-You Automations */}
            <section className="mb-20">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                  Done-for-You Automations — Built for Busy Business Owners
                </h2>
                <div className="text-left bg-gray-900/80 border border-gray-800 rounded-xl p-8">
                  <p className="text-xl text-gray-300 mb-6">We install custom automations that:</p>
                  <ul className="space-y-4 text-lg text-gray-300">
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Follow up with leads instantly
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Send quotes automatically
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Remind customers about appointments
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Track jobs in Google Sheets or your CRM
                    </li>
                    <li className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Request reviews when work is done
                    </li>
                  </ul>
                  <p className="text-xl text-amber-400 font-semibold mt-6">
                    You get results — not software headaches.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: What We Automate */}
            <section className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                  What We Automate
                </h2>
              </div>
              
              <div className="max-w-5xl mx-auto">
                <div className="space-y-6">
                  {automationOptions.map((automation, index) => (
                    <div 
                      key={automation.id}
                      className={`bg-gray-900/80 border rounded-xl p-6 transition-all duration-300 hover:shadow-xl ${
                        automation.isCustom 
                          ? 'border-amber-500/50 bg-gradient-to-r from-amber-900/20 to-orange-900/20' 
                          : 'border-gray-800 hover:border-amber-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-8 ${
                          automation.isCustom 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                            : 'bg-amber-600'
                        }`}>
                          {automation.isCustom ? '6' : index + 1}
                        </div>

                        <div className="flex-1 text-left">
                          <h3 className="text-xl font-semibold text-white">{automation.title}</h3>
                        </div>

                        <div className="flex-shrink-0 mx-8">
                          <svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>

                        <div className="flex-1 text-left">
                          <h4 className="text-xl font-semibold text-green-400">{automation.effect}</h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 text-center">
                  <div className="bg-amber-900/20 border border-amber-600/30 rounded-xl p-6">
                    <p className="text-amber-200 text-lg font-semibold">
                      ⚡ Everything's customized to <em>your</em> business. No extra software. No forced migration. No stress.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: How It Works */}
            <section className="mb-20">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
                  How It Works (Simple and Fast)
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8">
                    <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">1</div>
                    <h3 className="text-xl font-bold text-white mb-4">Tell us about your workflow</h3>
                    <p className="text-gray-300">What's wasting time, what you're manually repeating.</p>
                  </div>
                  <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8">
                    <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">2</div>
                    <h3 className="text-xl font-bold text-white mb-4">We map out 3 quick wins</h3>
                    <p className="text-gray-300">And show you exactly what we'd automate.</p>
                  </div>
                  <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8">
                    <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">3</div>
                    <h3 className="text-xl font-bold text-white mb-4">We build it all for you</h3>
                    <p className="text-gray-300">Typically in under a week.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Why Choose Us */}
            <section className="mb-20">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
                  Why Business Owners Choose Us Over SaaS Tools
                </h2>
                <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8">
                  <div className="grid md:grid-cols-2 gap-6 text-left">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-lg text-white">No expensive subscriptions</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-lg text-white">Built for your workflow — not a generic template</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-lg text-white">No learning curve — we handle everything</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-lg text-white">You own your automation system</span>
                    </div>
                    <div className="flex items-center md:col-span-2 justify-center">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-lg text-white">Fast turnaround and real support</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6: Package Selection */}
            <section className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                  Choose Your Package
                </h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                  <div 
                    key={pkg.id}
                    className={`relative bg-gray-900/80 border rounded-xl p-8 cursor-pointer transition-all duration-300 ${
                      selectedPackage === pkg.id 
                        ? 'border-amber-500 bg-amber-500/10 shadow-xl scale-105' 
                        : pkg.popular 
                          ? 'border-amber-500/50 bg-amber-500/5' 
                          : 'border-gray-800 hover:border-gray-700'
                    }`}
                    onClick={() => handlePackageSelect(pkg.id)}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Most Popular
                        </div>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-white mb-4">{pkg.name}</h3>
                      <p className="text-gray-300 text-sm">{pkg.description}</p>
                    </div>

                    <div className="space-y-3 mb-6">
                      {pkg.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-gray-300">
                          <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className={`text-center py-3 rounded-lg font-semibold transition-colors ${
                      selectedPackage === pkg.id 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}>
                      {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 7: CTA Form */}
            <section id="form" className="mb-20">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    Let's Save You Time and Help You Close More Leads — Automatically
                  </h2>
                  <p className="text-xl text-gray-300">
                    Book your free 15-minute call and we'll identify your 3 biggest automation opportunities — no commitment, no tech overwhelm.
                  </p>
                </div>

                <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8 backdrop-blur-sm">
                  {submitStatus && (
                    <div className={`p-4 rounded-lg mb-6 ${
                      submitStatus.type === 'success' 
                        ? 'bg-green-900/50 text-green-300 border border-green-600/30' 
                        : 'bg-red-900/50 text-red-300 border border-red-600/30'
                    }`}>
                      {submitStatus.message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Business Name */}
                    {currentStep === 1 && (
                      <div>
                        <label className="block text-gray-300 mb-2 text-lg">What's your business name?</label>
                        <input
                          type="text"
                          placeholder="Your Business Name"
                          value={formData.businessName}
                          onChange={(e) => setFormData(prev => ({...prev, businessName: e.target.value}))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={handleNext}
                          disabled={!formData.businessName}
                          className="w-full mt-4 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}

                    {/* Step 2: Contact Preference */}
                    {currentStep === 2 && (
                      <div>
                        <label className="block text-gray-300 mb-4 text-lg">Do you prefer call or email?</label>
                        <div className="space-y-3">
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({...prev, contactPreference: 'call'}))}
                            className={`w-full p-4 rounded-lg border text-left transition-all ${
                              formData.contactPreference === 'call'
                                ? 'border-amber-500 bg-amber-900/30 text-amber-300'
                                : 'border-gray-700 text-gray-300 hover:border-gray-600'
                            }`}
                          >
                            📞 Call me - I prefer talking through details
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({...prev, contactPreference: 'email'}))}
                            className={`w-full p-4 rounded-lg border text-left transition-all ${
                              formData.contactPreference === 'email'
                                ? 'border-amber-500 bg-amber-900/30 text-amber-300'
                                : 'border-gray-700 text-gray-300 hover:border-gray-600'
                            }`}
                          >
                            ✉️ Email me - I prefer written communication
                          </button>
                        </div>
                        <div className="flex gap-4 mt-6">
                          <button
                            type="button"
                            onClick={handleBack}
                            className="flex-1 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={handleNext}
                            className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Final Contact Info */}
                    {currentStep === 3 && (
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-6">Almost done! How can we reach you?</h3>
                        <div className="space-y-4">
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
                            required
                          />
                          
                          {formData.contactPreference === 'call' ? (
                            <input
                              type="tel"
                              placeholder="Phone Number"
                              value={formData.phone}
                              onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
                              required
                            />
                          ) : (
                            <input
                              type="email"
                              placeholder="Email Address"
                              value={formData.email}
                              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500"
                              required
                            />
                          )}

                          <div>
                            <label className="block text-gray-300 mb-2">Selected Package</label>
                            <input
                              type="text"
                              value={packages.find(p => p.id === selectedPackage)?.name || ''}
                              readOnly
                              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                            />
                          </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                          <button
                            type="button"
                            onClick={handleBack}
                            className="flex-1 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting || !formData.name || 
                              (formData.contactPreference === 'call' && !formData.phone) ||
                              (formData.contactPreference === 'email' && !formData.email)}
                            className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                          </button>
                        </div>
                      </div>
                    )}
                  </form>

                  <div className="text-xs text-gray-500 mt-4">
                    By submitting this form, you agree to our{' '}
                    <Link href="/privacy-policy" className="text-amber-400 hover:underline">
                      Privacy Policy
                    </Link>{' '}
                    and{' '}
                    <Link href="/terms-conditions" className="text-amber-400 hover:underline">
                      Terms & Conditions
                    </Link>.
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8: FAQ */}
            <section className="mb-20">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Do I need to switch to a new CRM or tool?
                    </h3>
                    <p className="text-gray-300">
                      Nope. We work with whatever you're already using — Google Sheets, QuickBooks, Gmail, etc.
                    </p>
                  </div>
                  <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Is this a subscription or a one-time setup?
                    </h3>
                    <p className="text-gray-300">
                      Pricing is done as a one-time fee for new automation setup. We offer monthly subscriptions 
                      to maintain and update automations, but they are not required. Just carry the cost of the 
                      automation software (usually $20-$30/month) to keep your automations running.
                    </p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  )
}