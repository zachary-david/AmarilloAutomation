// app/market-survey/page.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import AnimatedText from '../components/AnimatedText'
import { BarChart3, TrendingUp, Clock, Users, Zap, CheckCircle, ArrowRight, Star } from 'lucide-react'

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

interface FormData {
  businessType: string
  businessSize: string
  currentOperations: string
  implementationTimeline: string
  painPoints: string[]
  primaryGoal: string
  email: string
  phone: string
  businessName: string
}

interface AutomationResult {
  score: number
  leadQuality: 'LOW' | 'MEDIUM' | 'HIGH'
  priority: 'LOW_PRIORITY' | 'MEDIUM_PRIORITY' | 'IMMEDIATE_FOLLOW_UP'
  recommendations: string[]
}

export default function MarketSurvey() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [automationResult, setAutomationResult] = useState<AutomationResult | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [formData, setFormData] = useState<FormData>({
    businessType: '',
    businessSize: '',
    currentOperations: '',
    implementationTimeline: '',
    painPoints: [],
    primaryGoal: '',
    email: '',
    phone: '',
    businessName: ''
  })

  // Calculate automation score client-side
  const calculateAutomationScore = (data: FormData): AutomationResult => {
    let score = 30 // Base score

    // Business type scoring
    const businessTypeScores: { [key: string]: number } = {
      'restaurant': 15,
      'retail': 12,
      'healthcare': 18,
      'real-estate': 20,
      'professional-services': 16,
      'construction': 10,
      'automotive': 14,
      'other': 8
    }
    score += businessTypeScores[data.businessType] || 8

    // Business size scoring
    const sizeScores: { [key: string]: number } = {
      'small': 20,
      'medium': 15,
      'large': 10
    }
    score += sizeScores[data.businessSize] || 10

    // Current operations scoring
    const operationsScores: { [key: string]: number } = {
      'manual': 25,
      'partially-automated': 15,
      'mostly-automated': 5
    }
    score += operationsScores[data.currentOperations] || 15

    // Timeline urgency scoring
    const timelineScores: { [key: string]: number } = {
      'urgent': 20,
      'soon': 15,
      'eventually': 10,
      'exploring': 5
    }
    score += timelineScores[data.implementationTimeline] || 10

    // Pain points scoring (high-value pain points)
    const painPointValues: { [key: string]: number } = {
      'lead-follow-up': 8,
      'appointment-scheduling': 6,
      'customer-communication': 7,
      'inventory-management': 5,
      'social-media': 4,
      'email-marketing': 6,
      'data-entry': 5,
      'reporting': 4,
      'manual-scheduling': 7,
      'customer-service': 6
    }
    
    data.painPoints.forEach(painPoint => {
      score += painPointValues[painPoint] || 3
    })

    // Ensure score doesn't exceed 100
    score = Math.min(score, 100)

    // Determine lead quality and priority
    let leadQuality: 'LOW' | 'MEDIUM' | 'HIGH'
    let priority: 'LOW_PRIORITY' | 'MEDIUM_PRIORITY' | 'IMMEDIATE_FOLLOW_UP'

    if (score >= 75) {
      leadQuality = 'HIGH'
      priority = 'IMMEDIATE_FOLLOW_UP'
    } else if (score >= 55) {
      leadQuality = 'MEDIUM'
      priority = 'MEDIUM_PRIORITY'
    } else {
      leadQuality = 'LOW'
      priority = 'LOW_PRIORITY'
    }

    // Generate recommendations based on pain points and business type
    const recommendations: string[] = []
    
    if (data.painPoints.includes('lead-follow-up')) {
      recommendations.push('Automated lead nurturing sequences')
    }
    if (data.painPoints.includes('appointment-scheduling')) {
      recommendations.push('Online booking and scheduling system')
    }
    if (data.painPoints.includes('customer-communication')) {
      recommendations.push('Automated customer communication workflows')
    }
    if (data.painPoints.includes('social-media')) {
      recommendations.push('Social media automation and scheduling')
    }
    if (data.painPoints.includes('email-marketing')) {
      recommendations.push('Email marketing automation campaigns')
    }

    // Business-specific recommendations
    if (data.businessType === 'restaurant') {
      recommendations.push('Online ordering and delivery integration')
    } else if (data.businessType === 'real-estate') {
      recommendations.push('CRM automation for property management')
    } else if (data.businessType === 'healthcare') {
      recommendations.push('Patient appointment and reminder systems')
    }

    return {
      score,
      leadQuality,
      priority,
      recommendations: recommendations.slice(0, 4) // Limit to top 4 recommendations
    }
  }

  // Track GTM events
  const trackGTMEvent = (eventName: string, parameters: any = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'Market Survey',
        ...parameters
      })
    }
  }

  useEffect(() => {
    trackGTMEvent('survey_started')
  }, [])

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePainPointChange = (painPoint: string) => {
    setFormData(prev => ({
      ...prev,
      painPoints: prev.painPoints.includes(painPoint)
        ? prev.painPoints.filter(p => p !== painPoint)
        : [...prev.painPoints, painPoint]
    }))
  }

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
      trackGTMEvent('survey_step_completed', { step: currentStep })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Calculate automation score client-side
      const result = calculateAutomationScore(formData)
      setAutomationResult(result)

      // Create form data for Formspree submission
      const submissionData = new FormData()
      
      // Add all form fields with proper names for Formspree
      submissionData.append('business_name', formData.businessName)
      submissionData.append('email', formData.email)
      submissionData.append('phone', formData.phone)
      submissionData.append('business_type', formData.businessType)
      submissionData.append('business_size', formData.businessSize)
      submissionData.append('current_operations', formData.currentOperations)
      submissionData.append('implementation_timeline', formData.implementationTimeline)
      submissionData.append('pain_points', formData.painPoints.join(', '))
      submissionData.append('primary_goal', formData.primaryGoal)
      
      // Add automation analysis results
      submissionData.append('automation_score', result.score.toString())
      submissionData.append('lead_quality', result.leadQuality)
      submissionData.append('priority', result.priority)
      submissionData.append('recommendations', result.recommendations.join(', '))
      
      // Add subject line for better email organization
      submissionData.append('_subject', `New Market Survey - ${result.leadQuality} Quality Lead (Score: ${result.score}/100)`)

      // Submit to Formspree using standard form submission
      const response = await fetch('https://formspree.io/f/xanjdybj', {
        method: 'POST',
        body: submissionData,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        // Track successful submission
        trackGTMEvent('survey_completed', {
          automation_score: result.score,
          lead_quality: result.leadQuality,
          business_type: formData.businessType
        })
        
        setIsSubmitting(false)
        setShowResults(true)
      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      console.error('Survey submission error:', error)
      setIsSubmitting(false)
      alert('There was an error submitting your survey. Please try again or contact us directly at admin@amarilloautomation.com')
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What type of business do you operate?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'restaurant', label: 'Restaurant/Food Service', icon: '🍽️' },
                { value: 'retail', label: 'Retail/E-commerce', icon: '🛍️' },
                { value: 'healthcare', label: 'Healthcare/Medical', icon: '🏥' },
                { value: 'real-estate', label: 'Real Estate', icon: '🏠' },
                { value: 'professional-services', label: 'Professional Services', icon: '💼' },
                { value: 'construction', label: 'Construction/Contracting', icon: '🔨' },
                { value: 'automotive', label: 'Automotive', icon: '🚗' },
                { value: 'other', label: 'Other', icon: '📋' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('businessType', option.value)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    formData.businessType === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl mr-3">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What's your business size?</h3>
            <div className="space-y-4">
              {[
                { value: 'small', label: 'Small (1-10 employees)', description: 'Solo entrepreneur or small team' },
                { value: 'medium', label: 'Medium (11-50 employees)', description: 'Growing business with multiple departments' },
                { value: 'large', label: 'Large (50+ employees)', description: 'Established enterprise' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('businessSize', option.value)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    formData.businessSize === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">How would you describe your current operations?</h3>
            <div className="space-y-4">
              {[
                { value: 'manual', label: 'Mostly Manual', description: 'Most tasks done by hand, minimal automation' },
                { value: 'partially-automated', label: 'Partially Automated', description: 'Some automated processes, but many manual tasks remain' },
                { value: 'mostly-automated', label: 'Mostly Automated', description: 'Most processes automated, looking to optimize further' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('currentOperations', option.value)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    formData.currentOperations === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What are your biggest operational challenges? (Select all that apply)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'lead-follow-up', label: 'Lead Follow-up & Nurturing' },
                { value: 'appointment-scheduling', label: 'Appointment Scheduling' },
                { value: 'customer-communication', label: 'Customer Communication' },
                { value: 'inventory-management', label: 'Inventory Management' },
                { value: 'social-media', label: 'Social Media Management' },
                { value: 'email-marketing', label: 'Email Marketing' },
                { value: 'data-entry', label: 'Data Entry & Management' },
                { value: 'reporting', label: 'Reporting & Analytics' },
                { value: 'manual-scheduling', label: 'Staff Scheduling' },
                { value: 'customer-service', label: 'Customer Service' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handlePainPointChange(option.value)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    formData.painPoints.includes(option.value)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    {formData.painPoints.includes(option.value) && (
                      <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
                    )}
                    <span className="font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What's your primary goal with automation?</h3>
            <div className="space-y-4">
              {[
                { value: 'save-time', label: 'Save Time & Reduce Manual Work', icon: <Clock className="w-6 h-6" /> },
                { value: 'increase-revenue', label: 'Increase Revenue & Sales', icon: <TrendingUp className="w-6 h-6" /> },
                { value: 'improve-customer-experience', label: 'Improve Customer Experience', icon: <Star className="w-6 h-6" /> },
                { value: 'scale-business', label: 'Scale Business Operations', icon: <Users className="w-6 h-6" /> },
                { value: 'reduce-costs', label: 'Reduce Operational Costs', icon: <BarChart3 className="w-6 h-6" /> },
                { value: 'competitive-advantage', label: 'Gain Competitive Advantage', icon: <Zap className="w-6 h-6" /> }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('primaryGoal', option.value)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    formData.primaryGoal === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="text-blue-500 mr-3">{option.icon}</div>
                    <span className="font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">When are you looking to implement automation?</h3>
            <div className="space-y-4 mb-8">
              {[
                { value: 'urgent', label: 'ASAP (Within 1 month)', description: 'Ready to start immediately' },
                { value: 'soon', label: 'Soon (1-3 months)', description: 'Planning to implement in the near future' },
                { value: 'eventually', label: 'Eventually (3-6 months)', description: 'Considering for later implementation' },
                { value: 'exploring', label: 'Just Exploring', description: 'Researching options and possibilities' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('implementationTimeline', option.value)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    formData.implementationTimeline === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                </button>
              ))}
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
              <div className="space-y-4">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="business_name"
                    required
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Business Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(806) 555-0123"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (showResults && automationResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Your Automation Analysis Results
              </h1>
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl font-bold text-blue-600 mb-2">
                    {automationResult.score}/100
                  </div>
                  <div className="text-xl text-gray-600">Automation Opportunity Score</div>
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mt-4 ${
                    automationResult.leadQuality === 'HIGH' ? 'bg-green-100 text-green-800' :
                    automationResult.leadQuality === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {automationResult.leadQuality} POTENTIAL
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Recommended Solutions:</h3>
                    <ul className="space-y-2">
                      {automationResult.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Next Steps:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <ArrowRight className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">We'll contact you within 24 hours</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Free consultation and strategy session</span>
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Custom automation roadmap for your business</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-lg text-gray-600 mb-6">
                    Thank you for completing our market survey! We're excited to help you transform your business with automation.
                  </p>
                  <div className="space-y-4">
                    <a
                      href="tel:+18065551234"
                      className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors mr-4"
                    >
                      Call Now: (806) 555-1234
                    </a>
                    <a
                      href="/"
                      className="inline-block bg-gray-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                      Return Home
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <Navigation />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <BarChart3 className="w-4 h-4" />
              <span className="text-blue-200 text-sm font-medium ml-2">Texas Panhandle Business Market Survey</span>
            </div>
            <AnimatedText 
              text="Discover Your Automation Opportunities"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 break-words hyphens-auto"
            />
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Take our 2-minute survey to get a personalized automation score and discover how much time and money you could save.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-gray-100 px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Step {currentStep} of 6
                </span>
                <span className="text-sm font-medium text-gray-600">
                  {Math.round((currentStep / 6) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 6) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="p-6 md:p-8">
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
                
                <div className="ml-auto">
                  {currentStep < 6 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={
                        (currentStep === 1 && !formData.businessType) ||
                        (currentStep === 2 && !formData.businessSize) ||
                        (currentStep === 3 && !formData.currentOperations) ||
                        (currentStep === 4 && formData.painPoints.length === 0) ||
                        (currentStep === 5 && !formData.primaryGoal)
                      }
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !formData.implementationTimeline ||
                        !formData.businessName ||
                        !formData.email ||
                        !formData.phone
                      }
                      className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Get My Results
                          <CheckCircle className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <p className="text-blue-200 text-sm mb-4">
              Join 100+ Texas Panhandle businesses that have discovered their automation potential
            </p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-blue-200 text-xs">🔒 Secure & Confidential</div>
              <div className="text-blue-200 text-xs">⚡ 2-Minute Survey</div>
              <div className="text-blue-200 text-xs">📧 Instant Results</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}