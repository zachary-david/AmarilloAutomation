// app/intro-offer/page.tsx - Complete Fixed Version
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

  // Vanta.js background effect - Responsive configurations
  useEffect(() => {
    if (!vantaEffect.current && (window as any).VANTA && vantaRef.current) {
      // Check if mobile/tablet (768px and below)
      const isMobile = window.innerWidth <= 768
      
      const vantaConfig = isMobile ? {
        // Mobile Configuration - More subtle
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
        points: 2.00, // Even fewer points on mobile
        maxDistance: 15.00, // Shorter connections
        spacing: 14.00, // More spacing for cleaner look
      } : {
        // Desktop Configuration - More dynamic
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
        points: 10.00, // Your updated desktop settings
        maxDistance: 20.00,
        spacing: 15.00,
      }
      
      vantaEffect.current = (window as any).VANTA.NET(vantaConfig)
      
      // Handle window resize to update Vanta config
      const handleResize = () => {
        const newIsMobile = window.innerWidth <= 768
        if ((isMobile && !newIsMobile) || (!isMobile && newIsMobile)) {
          // Screen size category changed, reinitialize Vanta
          if (vantaEffect.current) {
            vantaEffect.current.destroy()
            vantaEffect.current = null
          }
          
          const newConfig = newIsMobile ? {
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
            points: 2.00,
            maxDistance: 15.00,
            spacing: 14.00,
          } : {
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
            points: 3.00,
            maxDistance: 18.00,
            spacing: 11.00,
          }
          
          if (vantaRef.current) {
            vantaEffect.current = (window as any).VANTA.NET(newConfig)
          }
        }
      }
      
      window.addEventListener('resize', handleResize)
      
      return () => {
        window.removeEventListener('resize', handleResize)
      }
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

  // Automation options with integrated descriptions
  const automationOptions = [
    {
      id: 'lead_logging',
      title: 'New Lead Received',
      effect: 'Log and organize into your existing database',
      description: 'Follow up with leads instantly',
      icon: '📝'
    },
    {
      id: 'missed_call_response',
      title: 'Missed Call',
      effect: 'Automatic Text Back',
      description: 'Never miss a potential customer again',
      icon: '📱'
    },
    {
      id: 'appointment_reminders',
      title: 'Upcoming Appointment',
      effect: 'Send Reminder Texts',
      description: 'Remind customers about appointments',
      icon: '⏰'
    },
    {
      id: 'job_completion',
      title: 'Job Completed',
      effect: 'Generate and Send Invoice',
      description: 'Send quotes automatically',
      icon: '💼'
    },
    {
      id: 'payment_received',
      title: 'Payment Received',
      effect: 'Request Google Review',
      description: 'Request reviews when work is done',
      icon: '⭐'
    },
    {
      id: 'custom_automation',
      title: 'Your Custom Trigger',
      effect: 'Your Biggest Lead Solution',
      description: 'Track jobs in Google Sheets or your CRM',
      icon: '⚡',
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
        <main className="py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Section 1: Hero Header - Improved Mobile */}
            <section className="text-center mb-16 md:mb-20">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
                  You don't need expensive software to automate your business.
                </h1>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-amber-400 mb-6 md:mb-8 leading-relaxed">
                  Get Premium Features at a Fraction of the Price
                </h2>
                <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-10 leading-relaxed">
                  Forget bloated CRMs and endless subscriptions. We build lean, powerful automations that save you time, 
                  close more leads, and work with the tools you already use.
                </p>
                <a 
                  href="#form" 
                  className="inline-block px-8 md:px-10 py-4 md:py-5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-lg md:text-xl rounded-lg transition-all duration-300 active:scale-95 shadow-xl"
                >
                  Start Now
                </a>
              </div>
            </section>

            {/* Section 2: Done-for-You Automations - Merged with Examples */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 md:mb-8">
                  Done-for-You Automations — Built for Busy Business Owners
                </h2>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                  We install custom automations that work with the tools you already use — no software headaches, just results.
                </p>
              </div>
              
              <div className="max-w-5xl mx-auto">
                {/* Mobile-First Grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {automationOptions.map((automation, index) => (
                    <div 
                      key={automation.id}
                      className={`bg-gray-900/80 border rounded-xl p-4 md:p-6 transition-all duration-300 hover:shadow-xl ${
                        automation.isCustom 
                          ? 'border-amber-500/50 bg-gradient-to-br from-amber-900/20 to-orange-900/20' 
                          : 'border-gray-800 hover:border-amber-500/30'
                      }`}
                    >
                      <div className="text-center">
                        {/* 1. Icon */}
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl md:text-3xl mb-3 md:mb-4 mx-auto ${
                          automation.isCustom 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
                            : 'bg-amber-600'
                        }`}>
                          {automation.icon}
                        </div>

                        {/* 2. Description - CENTERED, NO CHECKMARK */}
                        <div className="mb-3 md:mb-4">
                          <p className="text-xs md:text-sm text-gray-300 text-center">
                            {automation.description}
                          </p>
                        </div>

                        {/* 3. Title (Trigger) */}
                        <h3 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-3">
                          {automation.title}
                        </h3>

                        {/* Arrow */}
                        <div className="flex justify-center mb-2 md:mb-3">
                          <svg className="w-6 h-6 md:w-8 md:h-8 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>

                        {/* 4. Effect */}
                        <h4 className="text-sm md:text-base font-medium text-green-400">
                          {automation.effect}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom automation callout */}
                <div className="mt-8 md:mt-12 text-center">
                  <div className="bg-amber-900/20 border border-amber-600/30 rounded-xl p-4 md:p-6">
                    <p className="text-amber-200 text-base md:text-lg font-semibold">
                      ⚡ Everything's customized to <em>your</em> business. No extra software. No forced migration. No stress.
                    </p>
                    <p className="text-amber-400 text-lg md:text-xl font-semibold mt-2">
                      You get results — not software headaches.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: How It Works - Mobile Improved */}
            <section className="mb-16 md:mb-20">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-8 md:mb-12">
                  How It Works (Simple and Fast)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 md:p-8">
                    <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 md:mb-6">1</div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Tell us about your workflow</h3>
                    <p className="text-gray-300 text-sm md:text-base">What's wasting time, what you're manually repeating.</p>
                  </div>
                  <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 md:p-8">
                    <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 md:mb-6">2</div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">We map out 3 quick wins</h3>
                    <p className="text-gray-300 text-sm md:text-base">And show you exactly what we'd automate.</p>
                  </div>
                  <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 md:p-8">
                    <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 md:mb-6">3</div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">We build it all for you</h3>
                    <p className="text-gray-300 text-sm md:text-base">Typically in under a week.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Why Choose Us - Mobile Improved */}
            <section className="mb-16 md:mb-20">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-8 md:mb-12">
                  Why Business Owners Choose Us Over SaaS Tools
                </h2>
                <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-left">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-base md:text-lg text-white">No expensive subscriptions</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-base md:text-lg text-white">Built for your workflow</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-base md:text-lg text-white">No learning curve</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-base md:text-lg text-white">You own your system</span>
                    </div>
                    <div className="flex items-center md:col-span-2 justify-center">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-base md:text-lg text-white">Fast turnaround and real support</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Package Selection - Mobile Improved */}
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-8">
                  Choose Your Package
                </h2>
              </div>
              
              {/* Mobile: Stack vertically, Desktop: 3 columns */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {packages.map((pkg) => (
                  <div 
                    key={pkg.id}
                    className={`relative bg-gray-900/80 border rounded-xl p-6 md:p-8 cursor-pointer transition-all duration-300 ${
                      selectedPackage === pkg.id 
                        ? 'border-amber-500 bg-amber-500/10 shadow-xl lg:scale-105' 
                        : pkg.popular 
                          ? 'border-amber-500/50 bg-amber-500/5' 
                          : 'border-gray-800 hover:border-gray-700'
                    }`}
                    onClick={() => handlePackageSelect(pkg.id)}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 md:px-4 py-1 rounded-full text-sm font-semibold">
                          Most Popular
                        </div>
                      </div>
                    )}
                    
                    <div className="text-center mb-4 md:mb-6">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-4">{pkg.name}</h3>
                      <p className="text-gray-300 text-sm">{pkg.description}</p>
                    </div>

                    <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                      {pkg.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-gray-300 text-sm md:text-base">
                          <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500 mr-2 md:mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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

            {/* Section 6: CTA Form - Mobile Improved */}
            <section id="form" className="mb-16 md:mb-20">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8 md:mb-12">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
                    Let's Save You Time and Help You Close More Leads — Automatically
                  </h2>
                  <p className="text-lg md:text-xl text-gray-300">
                    Book your free 15-minute call and we'll identify your 3 biggest automation opportunities — no commitment, no tech overwhelm.
                  </p>
                </div>

                <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 md:p-8 backdrop-blur-sm">
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
                        <label className="block text-gray-300 mb-2 text-base md:text-lg">What's your business name?</label>
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
                        <label className="block text-gray-300 mb-4 text-base md:text-lg">Do you prefer call or email?</label>
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
                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
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
                            disabled={!formData.contactPreference}
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
                        <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Almost done! How can we reach you?</h3>
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
                            <label className="block text-gray-300 mb-2 text-sm md:text-base">Selected Package</label>
                            <input
                              type="text"
                              value={packages.find(p => p.id === selectedPackage)?.name || ''}
                              readOnly
                              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
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

                  <div className="text-xs text-gray-500 mt-4 text-center">
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

            {/* Section 7: FAQ - Mobile Improved */}
            <section className="mb-16 md:mb-20">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center mb-8 md:mb-12">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">
                      Do I need to switch to a new CRM or tool?
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base">
                      Nope. We work with whatever you're already using — Google Sheets, QuickBooks, Gmail, etc.
                    </p>
                  </div>
                  <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">
                      Is this a subscription or a one-time setup?
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base">
                      Pricing is done as a one-time fee for new automation setup. We offer monthly subscriptions 
                      to maintain and update automations, but they are not required. Just carry the cost of the 
                      automation software (usually $20-$30/month) to keep your automations running.
                    </p>
                  </div>
                  <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">
                      How quickly can you implement these automations?
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base">
                      Most automation setups are completed within 7-10 business days. We'll walk you through everything and provide training so you're confident using your new systems.
                    </p>
                  </div>
                  <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">
                      What if I need changes after implementation?
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base">
                      We include 30 days of free adjustments with every package. After that, small tweaks are usually quick and inexpensive, while major changes can be quoted separately.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Final CTA Section */}
            <section className="text-center">
              <div className="max-w-3xl mx-auto bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-600/30 rounded-xl p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Automate Your Business Growth?
                </h3>
                <p className="text-lg text-amber-200 mb-6">
                  Stop losing leads to slow follow-ups. Let's build you a system that works 24/7.
                </p>
                <a 
                  href="#form" 
                  className="inline-block px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-lg rounded-lg transition-all duration-300 active:scale-95 shadow-xl"
                >
                  Get Started Now
                </a>
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  )
}