// app/market-survey/page.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import AnimatedText from '../components/AnimatedText'
import { ChevronRight, ChevronLeft, Building2, Zap, Target, Brain, Users, Clock, DollarSign, TrendingUp, CheckCircle, ArrowRight, BarChart3, Phone, Lightbulb, AlertTriangle, Star } from 'lucide-react'

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    VANTA?: any;
  }
}

interface FormData {
  businessType: string
  businessSize: string
  currentProblem: string
  idealSolution: string
  email: string
  firstName: string
  lastName: string
  companyName: string
}

interface AutomationResult {
  score: number
  complexity: 'SIMPLE' | 'MODERATE' | 'COMPLEX'
  timeline: string
  investment: string
  whatsPossible: string[]
  nextSteps: string[]
}

export default function MarketSurvey() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [automationResult, setAutomationResult] = useState<AutomationResult | null>(null)

  const [formData, setFormData] = useState<FormData>({
    businessType: '',
    businessSize: '',
    currentProblem: '',
    idealSolution: '',
    email: '',
    firstName: '',
    lastName: '',
    companyName: ''
  })

  // Vanta.js background
  useEffect(() => {
    if (!vantaEffect.current && window.VANTA && vantaRef.current) {
      vantaEffect.current = window.VANTA.NET({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x3b82f6,
        backgroundColor: 0x0a1224,
        points: 10,
        maxDistance: 22,
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

  const steps = [
    {
      id: 'business-info',
      title: 'Your Business',
      question: 'Tell us about your business',
      description: 'Different industries have different automation opportunities'
    },
    {
      id: 'current-problem',
      title: 'Your Challenge',
      question: 'What business task takes up too much of your time?',
      description: 'The more specific you are, the better we can help'
    },
    {
      id: 'ideal-solution',
      title: 'Your Vision',
      question: 'If this problem was completely solved, what would your day look like?',
      description: 'Help us understand what success means to you'
    },
    {
      id: 'contact',
      title: 'Get Your Analysis',
      question: 'Where should we send your automation roadmap?',
      description: 'Receive a realistic plan for solving your specific challenge'
    }
  ]

  // Calculate automation feasibility
  const calculateAutomationResult = (data: FormData): AutomationResult => {
    let score = 30

    // Business size affects capacity for automation
    const sizeScores: { [key: string]: number } = {
      'solo': 20,
      'small': 30,
      'medium': 25,
      'large': 15
    }
    score += sizeScores[data.businessSize] || 20

    // Analyze problem complexity and automation potential
    const problemText = data.currentProblem.toLowerCase()
    const solutionText = data.idealSolution.toLowerCase()

    // High-automation potential keywords
    const highAutomationKeywords = [
      'follow up', 'follow-up', 'leads', 'email', 'scheduling', 'appointments',
      'data entry', 'reports', 'invoicing', 'billing', 'inventory', 'social media',
      'customer questions', 'responses', 'booking', 'calendar'
    ]

    // Medium-automation potential
    const mediumAutomationKeywords = [
      'communication', 'organize', 'track', 'manage', 'coordinate', 'remind',
      'notifications', 'updates', 'workflow', 'process'
    ]

    // Score based on automation potential
    let automationPotential = 0
    highAutomationKeywords.forEach(keyword => {
      if (problemText.includes(keyword) || solutionText.includes(keyword)) {
        automationPotential += 15
      }
    })

    mediumAutomationKeywords.forEach(keyword => {
      if (problemText.includes(keyword) || solutionText.includes(keyword)) {
        automationPotential += 10
      }
    })

    score += Math.min(automationPotential, 40)

    // Determine complexity and recommendations
    let complexity: 'SIMPLE' | 'MODERATE' | 'COMPLEX'
    let timeline: string
    let investment: string
    let whatsPossible: string[]
    let nextSteps: string[]

    if (score >= 75) {
      complexity = 'SIMPLE'
      timeline = '1-2 weeks'
      investment = '$800 - $2,500'
      whatsPossible = [
        'Immediate automation using existing tools',
        'Quick setup with minimal custom work',
        'Fast ROI and time savings',
        'Easy to maintain and update'
      ]
      nextSteps = [
        'We can start this week',
        'Most likely using existing automation platforms',
        'You\'ll see results within days of implementation'
      ]
    } else if (score >= 50) {
      complexity = 'MODERATE'
      timeline = '2-4 weeks'
      investment = '$1,500 - $5,000'
      whatsPossible = [
        'Custom automation workflows',
        'Integration between 2-3 business systems',
        'Some custom development required',
        'Significant time savings potential'
      ]
      nextSteps = [
        'We\'d start with a detailed workflow analysis',
        'Custom solution designed for your specific needs',
        'Implementation in phases for faster results'
      ]
    } else {
      complexity = 'COMPLEX'
      timeline = '4-8 weeks'
      investment = '$3,000 - $8,000'
      whatsPossible = [
        'Custom solution development',
        'Multiple system integrations',
        'Advanced workflow automation',
        'May require ongoing optimization'
      ]
      nextSteps = [
        'Detailed consultation to scope the project',
        'We\'ll break it into manageable phases',
        'Focus on highest-impact improvements first'
      ]
    }

    return {
      score: Math.min(score, 100),
      complexity,
      timeline,
      investment,
      whatsPossible,
      nextSteps
    }
  }

  // Track GTM events
  const trackGTMEvent = (eventName: string, parameters: any = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'Business Challenge Survey',
        ...parameters
      })
    }
  }

  useEffect(() => {
    trackGTMEvent('challenge_survey_started')
  }, [])

  const handleNext = () => {
    trackGTMEvent('challenge_survey_step_completed', { step: currentStep })
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Calculate automation feasibility
      const result = calculateAutomationResult(formData)
      setAutomationResult(result)

      // Create form data for Formspree submission
      const submissionData = new FormData()
      
      // Add all form fields
      submissionData.append('first_name', formData.firstName)
      submissionData.append('last_name', formData.lastName)
      submissionData.append('company_name', formData.companyName)
      submissionData.append('email', formData.email)
      submissionData.append('business_type', formData.businessType)
      submissionData.append('business_size', formData.businessSize)
      submissionData.append('current_problem', formData.currentProblem)
      submissionData.append('ideal_solution', formData.idealSolution)
      
      // Add analysis results
      submissionData.append('automation_score', result.score.toString())
      submissionData.append('complexity_level', result.complexity)
      submissionData.append('timeline_estimate', result.timeline)
      submissionData.append('investment_range', result.investment)
      
      // Add subject line
      submissionData.append('_subject', `Business Challenge Analysis - ${result.complexity} Solution (${formData.companyName})`)

      // Submit to Formspree
      const response = await fetch('https://formspree.io/f/xanjdybj', {
        method: 'POST',
        body: submissionData,
        headers: {
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        trackGTMEvent('challenge_survey_completed', {
          automation_score: result.score,
          complexity_level: result.complexity,
          business_type: formData.businessType
        })
        
        setIsSubmitting(false)
        setShowResults(true)
      } else {
        const errorText = await response.text()
        throw new Error(`Form submission failed: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('Survey submission error:', error)
      setIsSubmitting(false)
      alert('There was an error submitting your survey: ' + (error instanceof Error ? error.message : 'Unknown error') + '. Please try again or contact us directly at admin@amarilloautomation.com')
    }
  }

  const businessTypes = [
    { value: 'restaurant', label: 'Restaurant/Food Service' },
    { value: 'retail', label: 'Retail/E-commerce' },
    { value: 'healthcare', label: 'Healthcare/Medical' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'professional-services', label: 'Professional Services' },
    { value: 'construction', label: 'Construction/Contracting' },
    { value: 'automotive', label: 'Automotive Services' },
    { value: 'other', label: 'Other Industry' }
  ]

  const businessSizes = [
    { value: 'solo', label: 'Solo Entrepreneur', description: 'Just me running the business' },
    { value: 'small', label: '2-10 employees', description: 'Small team, growing business' },
    { value: 'medium', label: '11-50 employees', description: 'Established business with multiple departments' },
    { value: 'large', label: '50+ employees', description: 'Large organization with complex needs' }
  ]

  const commonProblems = [
    'Following up with leads takes hours every day',
    'Scheduling appointments back and forth via email/phone',
    'Manually entering data from one system to another',
    'Answering the same customer questions repeatedly',
    'Creating weekly/monthly reports from different sources',
    'Managing inventory across multiple platforms',
    'Sending invoices and tracking payments',
    'Coordinating team schedules and tasks',
    'Social media posting and engagement',
    'Lead qualification and routing'
  ]

  if (showResults && automationResult) {
    return (
      <div className="min-h-screen relative">
        <div ref={vantaRef} className="fixed inset-0 z-0" />
        <div className="relative z-10">
          <Navigation />
          <main className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              {/* Results Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm mb-6">
                  <CheckCircle className="w-4 h-4" />
                  Analysis Complete
                </div>
                
                <AnimatedText 
                  text={`Good News, ${formData.firstName}!`}
                  className="text-4xl md:text-5xl font-bold text-white mb-4"
                />
                <p className="text-xl text-gray-300 mb-2">
                  Your challenge is exactly the type automation solves well.
                </p>
                <p className="text-lg text-gray-400">
                  Here's what's realistic for {formData.companyName}
                </p>
              </div>

              {/* Problem Summary */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8 mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">Your Challenge</h2>
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-4">
                  <div className="flex items-start">
                    <AlertTriangle className="w-6 h-6 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 text-lg">"{formData.currentProblem}"</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-6">
                  <div className="flex items-start">
                    <Lightbulb className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-blue-300 font-medium mb-2">Your Vision:</p>
                      <p className="text-gray-300">"{formData.idealSolution}"</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Automation Assessment */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8 mb-8 text-center">
                <h2 className="text-2xl font-semibold text-white mb-4">Automation Potential</h2>
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="2"
                    />
                    <path
                      d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray={`${automationResult.score}, 100`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-blue-400">{automationResult.score}</span>
                  </div>
                </div>
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  automationResult.complexity === 'SIMPLE' ? 'bg-green-600/20 text-green-300 border border-green-500/30' :
                  automationResult.complexity === 'MODERATE' ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' :
                  'bg-orange-600/20 text-orange-300 border border-orange-500/30'
                }`}>
                  {automationResult.complexity} SOLUTION
                </div>
              </div>

              {/* Project Overview */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="w-6 h-6 text-blue-400 mr-3" />
                    <h3 className="text-lg font-semibold text-white">Timeline</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-400 mb-2">{automationResult.timeline}</p>
                  <p className="text-gray-400 text-sm">From start to working solution</p>
                </div>
                
                <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <DollarSign className="w-6 h-6 text-green-400 mr-3" />
                    <h3 className="text-lg font-semibold text-white">Investment</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-400 mb-2">{automationResult.investment}</p>
                  <p className="text-gray-400 text-sm">Typical range for this type of solution</p>
                </div>
              </div>

              {/* What's Possible */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8 mb-8">
                <h2 className="text-2xl font-semibold text-white mb-6">What We Can Realistically Do</h2>
                <div className="space-y-3">
                  {automationResult.whatsPossible.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8 mb-8">
                <h2 className="text-2xl font-semibold text-white mb-6">How We'd Approach This</h2>
                <div className="space-y-4">
                  {automationResult.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-300">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-blue-600/20 to-gray-700/20 border border-gray-700 rounded-xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Ready to Solve This Challenge?</h2>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  {formData.firstName}, we've helped dozens of Texas businesses solve similar challenges. 
                  Most see results within the first week of implementation.
                </p>
                <div className="flex justify-center">
                  <a
                    href="/"
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Return Home
                  </a>
                </div>
                <p className="text-gray-400 text-sm mt-4">
                  We'll email you a detailed roadmap within 24 hours
                </p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen relative">
      <div ref={vantaRef} className="fixed inset-0 z-0" />
      <div className="relative z-10">
        <Navigation />
        <main className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm mb-6">
                <Target className="w-4 h-4" />
                Business Challenge Assessment
              </div>
              <AnimatedText 
                text="What's Your Biggest Business Headache?"
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              />
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Most business challenges can be solved with smart automation. 
                <span className="text-blue-400 font-medium"> Let's see if yours is one of them.</span>
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span className="text-blue-400">⚡ Quick 2-minute assessment</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Current Step */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">{currentStepData.question}</h2>
                <p className="text-gray-400">{currentStepData.description}</p>
              </div>

              <form onSubmit={currentStep === steps.length - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
                {/* Step Content */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">Industry</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {businessTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => handleInputChange('businessType', type.value)}
                            className={`p-4 border rounded-lg text-left transition-all ${
                              formData.businessType === type.value
                                ? 'border-blue-500 bg-blue-600/10 text-white'
                                : 'border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white'
                            }`}
                          >
                            <span className="font-medium">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">Business Size</label>
                      <div className="space-y-3">
                        {businessSizes.map((size) => (
                          <button
                            key={size.value}
                            type="button"
                            onClick={() => handleInputChange('businessSize', size.value)}
                            className={`w-full p-4 border rounded-lg text-left transition-all ${
                              formData.businessSize === size.value
                                ? 'border-blue-500 bg-blue-600/10'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <div className="font-medium text-white">{size.label}</div>
                            <div className="text-sm text-gray-400 mt-1">{size.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <textarea
                        value={formData.currentProblem}
                        onChange={(e) => handleInputChange('currentProblem', e.target.value)}
                        className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors h-32 resize-none"
                        placeholder="Describe the task or process that's eating up your time. Be specific - the more detail you give us, the better we can help."
                      />
                      <p className="text-gray-400 text-sm mt-2">
                        {formData.currentProblem.length}/500 characters
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">Common Examples:</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {commonProblems.map((problem, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleInputChange('currentProblem', problem)}
                            className="p-3 text-left border border-gray-700 rounded-lg text-gray-300 hover:border-gray-600 hover:text-white transition-all text-sm"
                          >
                            {problem}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
                      <p className="text-blue-300 text-sm">
                        💡 <strong>Think about the end result:</strong> How would your workday change? 
                        What would you do with the extra time? What would be different?
                      </p>
                    </div>
                    <div>
                      <textarea
                        value={formData.idealSolution}
                        onChange={(e) => handleInputChange('idealSolution', e.target.value)}
                        className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors h-32 resize-none"
                        placeholder="If this problem was completely solved, what would your typical day look like? How would things be different?"
                      />
                      <p className="text-gray-400 text-sm mt-2">
                        {formData.idealSolution.length}/500 characters
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="First Name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="Last Name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="Your Company Name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
                      <p className="text-green-300 text-sm">
                        📧 <strong>Your automation roadmap will include:</strong> Realistic timeline, 
                        investment estimate, what tools we'd use, and specific steps to solve your challenge.
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      currentStep === 0
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      (currentStep === 0 && (!formData.businessType || !formData.businessSize)) ||
                      (currentStep === 1 && formData.currentProblem.length < 10) ||
                      (currentStep === 2 && formData.idealSolution.length < 10) ||
                      (currentStep === 3 && (!formData.firstName || !formData.lastName || !formData.companyName || !formData.email))
                    }
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      isSubmitting ||
                      (currentStep === 0 && (!formData.businessType || !formData.businessSize)) ||
                      (currentStep === 1 && formData.currentProblem.length < 10) ||
                      (currentStep === 2 && formData.idealSolution.length < 10) ||
                      (currentStep === 3 && (!formData.firstName || !formData.lastName || !formData.companyName || !formData.email))
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing Your Challenge...
                      </>
                    ) : currentStep === steps.length - 1 ? (
                      <>
                        Get My Automation Roadmap
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Continue
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 text-center">
              <p className="text-blue-200 text-sm mb-4">
                Join 47 Texas businesses who've solved their biggest challenges with automation
              </p>
              <div className="flex justify-center items-center space-x-8 opacity-60">
                <div className="text-blue-200 text-xs">🔒 Completely Confidential</div>
                <div className="text-blue-200 text-xs">⚡ Realistic Solutions</div>
                <div className="text-blue-200 text-xs">📧 Custom Roadmap</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}