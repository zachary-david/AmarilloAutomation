// app/market-survey/page.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import AnimatedText from '../components/AnimatedText'
// Using individual icon imports to avoid lucide-react module issues
import { 
  ChevronRight, 
  ChevronLeft, 
  Building2, 
  Zap, 
  Target, 
  Brain, 
  Users, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  BarChart3, 
  Phone, 
  Mail, 
  MapPin 
} from 'lucide-react'

// GTM Event Tracking Functions
declare global {
  interface Window {
    dataLayer: any[]
    VANTA?: any
  }
}

// Define proper types for the form data
interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  company: string;
  urgency: string;
}

interface FormData {
  businessType: string;
  businessSize: string;
  currentAIUsage: string;
  aiAwareness: string;
  aiTools: string[];
  painPoints: string[];
  leadSources: string[];
  timeWasters: string[];
  revenue: string;
  growthGoals: string;
  contactInfo: ContactInfo;
}

const MarketSurvey = () => {
  // Check if lucide-react icons are available, provide fallbacks if needed
  const IconFallback = ({ children }: { children: React.ReactNode }) => children || <div>📊</div>
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    businessType: '',
    businessSize: '',
    currentAIUsage: '',
    aiAwareness: '',
    aiTools: [],
    painPoints: [],
    leadSources: [],
    timeWasters: [],
    revenue: '',
    growthGoals: '',
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      company: '',
      urgency: ''
    }
  })
  const [showResults, setShowResults] = useState(false)
  const [automationScore, setAutomationScore] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [surveyStarted, setSurveyStarted] = useState(false)

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
        color: 0x3b82f6, // Blue theme for assessment
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

  // GTM Tracking - Page View
  useEffect(() => {
    window.dataLayer?.push({
      event: 'page_view_enhanced',
      page_title: 'Market Survey - Amarillo Automation',
      page_section: 'market_survey',
      business_vertical: 'automation_consulting',
      service_offering: 'business_assessment'
    })
  }, [])

  // GTM Tracking - Survey Start
  const handleSurveyStart = () => {
    if (!surveyStarted) {
      setSurveyStarted(true)
      window.dataLayer?.push({
        event: 'survey_start',
        form_type: 'market_survey',
        lead_source: 'website',
        qualification_level: 'high_intent',
        business_vertical: 'automation_consulting'
      })
    }
  }

  const steps = [
    {
      id: 'business-basics',
      title: 'Business Information',
      icon: Building2,
      question: 'Tell us about your business',
      description: 'Help us understand your business to provide relevant automation insights'
    },
    {
      id: 'current-operations',
      title: 'Current Operations',
      icon: Brain,
      question: 'How do you currently handle business processes?',
      description: 'Understanding your current workflow and technology usage'
    },
    {
      id: 'pain-points',
      title: 'Operational Challenges',
      icon: Target,
      question: 'What challenges slow down your business?',
      description: 'Identify areas where automation could provide the most value'
    },
    {
      id: 'growth-goals',
      title: 'Business Goals',
      icon: TrendingUp,
      question: 'What are your primary growth objectives?',
      description: 'Align automation solutions with your business priorities'
    },
    {
      id: 'contact',
      title: 'Survey Results',
      icon: BarChart3,
      question: 'Where should we send your automation analysis?',
      description: 'Receive detailed recommendations specific to your business needs'
    }
  ]

  const businessTypes = [
    { value: 'restaurant', label: 'Restaurant/Food Service', icon: Building2 },
    { value: 'contractor', label: 'Contractor/Construction', icon: Building2 },
    { value: 'professional', label: 'Professional Services', icon: Building2 },
    { value: 'retail', label: 'Retail/E-commerce', icon: Building2 },
    { value: 'healthcare', label: 'Healthcare/Medical', icon: Building2 },
    { value: 'real-estate', label: 'Real Estate', icon: Building2 },
    { value: 'automotive', label: 'Automotive Services', icon: Building2 },
    { value: 'beauty', label: 'Beauty/Wellness', icon: Building2 },
    { value: 'other', label: 'Other', icon: Building2 }
  ]

  const operationalStatus = [
    { value: 'manual', label: 'Mostly manual processes', description: 'We handle everything by hand or basic tools' },
    { value: 'basic-tools', label: 'Using basic business software', description: 'QuickBooks, basic CRM, standard office tools' },
    { value: 'some-automation', label: 'Some automated processes', description: 'A few automated workflows but mostly manual' },
    { value: 'integrated-systems', label: 'Integrated business systems', description: 'Multiple systems working together with some automation' },
    { value: 'advanced-automation', label: 'Advanced automation in place', description: 'Sophisticated workflows and business process automation' }
  ]

  const painPointOptions = [
    { value: 'lead-follow-up', label: 'Following up with potential customers takes too long', impact: 'high', automatable: true },
    { value: 'manual-scheduling', label: 'Scheduling appointments is time-consuming', impact: 'high', automatable: true },
    { value: 'data-entry', label: 'Too much manual data entry and paperwork', impact: 'medium', automatable: true },
    { value: 'customer-questions', label: 'Answering repetitive customer questions', impact: 'medium', automatable: true },
    { value: 'inventory-tracking', label: 'Managing inventory and supplies manually', impact: 'high', automatable: true },
    { value: 'marketing-tasks', label: 'Social media and marketing takes too much time', impact: 'medium', automatable: true },
    { value: 'billing-invoicing', label: 'Creating and managing invoices', impact: 'high', automatable: true },
    { value: 'lead-generation', label: 'Not generating enough qualified leads', impact: 'critical', automatable: true },
    { value: 'team-coordination', label: 'Coordinating team schedules and tasks', impact: 'medium', automatable: true },
    { value: 'reporting-analytics', label: 'Creating business reports and tracking performance', impact: 'medium', automatable: true }
  ]

  const getRecommendations = () => {
    const recommendations = []
    
    // Lead generation recommendations
    if (formData.painPoints.includes('lead-generation' as any) || formData.painPoints.includes('lead-follow-up' as any)) {
      recommendations.push({
        title: 'Lead Generation Automation System',
        description: 'Automated lead capture, qualification, and follow-up processes',
        impact: 'Critical',
        timeline: '2-3 weeks implementation',
        investment: '$1,500 setup + $499/month management'
      })
    }
    
    // Scheduling automation
    if (formData.painPoints.includes('manual-scheduling' as any)) {
      recommendations.push({
        title: 'Appointment Scheduling Automation',
        description: 'Online booking system with automated confirmations and reminders',
        impact: 'High',
        timeline: '1-2 weeks implementation',
        investment: '$800 setup + $199/month'
      })
    }
    
    // Administrative automation
    if (formData.painPoints.includes('data-entry' as any) || formData.painPoints.includes('billing-invoicing' as any)) {
      recommendations.push({
        title: 'Business Process Automation',
        description: 'Streamline data entry, invoicing, and administrative workflows',
        impact: 'High',
        timeline: '1-2 weeks implementation',
        investment: '$1,200 setup + $299/month'
      })
    }
    
    // Customer service automation
    if (formData.painPoints.includes('customer-questions' as any)) {
      recommendations.push({
        title: 'Customer Service Automation',
        description: 'Automated responses to common inquiries and support tickets',
        impact: 'Medium',
        timeline: '2-3 weeks implementation',
        investment: '$2,000 setup + $399/month'
      })
    }
    
    // Default recommendation if no specific pain points
    if (recommendations.length === 0) {
      recommendations.push({
        title: 'Business Operations Assessment',
        description: 'Comprehensive analysis of automation opportunities in your business',
        impact: 'High',
        timeline: '1 week analysis',
        investment: '$500 consultation fee'
      })
    }
    
    return recommendations
  }

  const handleNext = () => {
    handleSurveyStart()
    
    // Track step completion
    window.dataLayer?.push({
      event: 'survey_step_complete',
      step_number: currentStep + 1,
      step_name: steps[currentStep].id,
      form_progress: Math.round(((currentStep + 1) / steps.length) * 100),
      business_vertical: 'automation_consulting'
    })

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Track survey submission attempt
    window.dataLayer?.push({
      event: 'survey_submission',
      form_name: 'market_survey',
      business_type: formData.businessType,
      operational_status: formData.currentAIUsage,
      pain_points: formData.painPoints.length,
      implementation_urgency: formData.contactInfo.urgency,
      business_vertical: 'automation_consulting'
    })
    
    try {
      // Submit to our new API
      const response = await fetch('/api/market-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessType: formData.businessType,
          businessSize: formData.businessSize,
          currentAIUsage: formData.currentAIUsage,
          painPoints: formData.painPoints,
          growthGoals: formData.growthGoals,
          contactInfo: formData.contactInfo
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit survey')
      }

      const result = await response.json()
      
      // Use API response data
      setAutomationScore(result.automationScore)
      setShowResults(true)

      // Track successful survey completion
      window.dataLayer?.push({
        event: 'survey_complete',
        automation_score: result.automationScore,
        business_type: formData.businessType,
        operational_status: formData.currentAIUsage,
        pain_points: formData.painPoints.length,
        lead_quality: result.leadQuality,
        conversion_value: result.automationScore > 70 ? 150 : result.automationScore > 40 ? 75 : 25,
        business_vertical: 'automation_consulting'
      })

      // Track as conversion event
      window.dataLayer?.push({
        event: 'purchase', // Using ecommerce event for lead tracking
        ecommerce: {
          transaction_id: `survey_${Date.now()}`,
          value: result.automationScore > 70 ? 150 : result.automationScore > 40 ? 75 : 25,
          currency: 'USD',
          items: [{
            item_id: 'market_survey_completion',
            item_name: 'Business Automation Survey Completed',
            item_category: 'Lead Generation',
            item_variant: formData.businessType,
            quantity: 1,
            price: result.automationScore > 70 ? 150 : result.automationScore > 40 ? 75 : 25
          }]
        }
      })

    } catch (error) {
      console.error('Survey submission error:', error)
      
      // Track error
      window.dataLayer?.push({
        event: 'survey_error',
        error_type: 'submission_failed',
        business_vertical: 'automation_consulting'
      })
      
      alert('There was an error submitting your survey. Please try again or contact us directly at admin@amarilloautomation.com')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMultiSelect = (field: keyof Pick<FormData, 'aiTools' | 'painPoints' | 'leadSources' | 'timeWasters'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value) 
        ? (prev[field] as string[]).filter((item: string) => item !== value)
        : [...(prev[field] as string[]), value]
    }))
  }

  const handleCTAClick = (ctaType: string) => {
    window.dataLayer?.push({
      event: 'survey_cta_click',
      cta_type: ctaType,
      automation_score: automationScore,
      lead_quality: automationScore > 70 ? 'high' : automationScore > 40 ? 'medium' : 'low',
      business_vertical: 'automation_consulting'
    })
    
    if (ctaType === 'schedule_call') {
      window.location.href = '/contact'
    }
  }

  if (showResults) {
    const recommendations = getRecommendations()
    
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
                  Survey Complete
                </div>
                
                <AnimatedText 
                  text="Your Business Automation Analysis"
                  className="text-4xl md:text-5xl font-bold text-white mb-6"
                />
                <p className="text-xl text-gray-300">
                  Based on your responses, here are our findings for {formData.contactInfo.company}
                </p>
              </div>

              {/* Automation Score */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8 mb-8 text-center">
                <h2 className="text-2xl font-semibold text-white mb-4">Automation Opportunity Score</h2>
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
                      strokeDasharray={`${automationScore}, 100`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-blue-400">{automationScore}</span>
                  </div>
                </div>
                <p className="text-gray-300">
                  {automationScore > 70 ? 'High automation potential - significant opportunities identified' :
                   automationScore > 40 ? 'Moderate automation potential - several opportunities available' :
                   'Basic automation potential - foundational improvements recommended'}
                </p>
              </div>

              {/* Recommendations */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-6">Recommended Solutions</h2>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-blue-400">{rec.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm border ${
                          rec.impact === 'Critical' ? 'bg-red-600/20 text-red-300 border-red-500/30' :
                          rec.impact === 'High' ? 'bg-blue-600/20 text-blue-300 border-blue-500/30' :
                          'bg-gray-600/20 text-gray-300 border-gray-500/30'
                        }`}>
                          {rec.impact} Impact
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">{rec.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400">Timeline:</span>
                          <span className="text-white">{rec.timeline}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400">Investment:</span>
                          <span className="text-white">{rec.investment}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8 mb-8">
                <h2 className="text-2xl font-semibold text-white mb-6">Next Steps</h2>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <Phone className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-white mb-2">Schedule a Call</h3>
                    <p className="text-gray-300 text-sm">Discuss your specific needs and get detailed recommendations</p>
                  </div>
                  <div className="text-center">
                    <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-white mb-2">Custom Analysis</h3>
                    <p className="text-gray-300 text-sm">Receive a detailed automation plan tailored to your business</p>
                  </div>
                  <div className="text-center">
                    <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <h3 className="font-semibold text-white mb-2">Implementation</h3>
                    <p className="text-gray-300 text-sm">Start seeing results within 2-3 weeks of implementation</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-blue-600/20 to-gray-700/20 border border-gray-700 rounded-xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Ready to Automate Your Business Operations?</h2>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Based on your survey, automation could save your business significant time and increase efficiency. 
                  Let's discuss how to implement these solutions for your specific needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => handleCTAClick('schedule_call')}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-300 active:scale-95 shadow-lg"
                  >
                    Schedule Strategy Session
                  </button>
                  <button 
                    onClick={() => handleCTAClick('download_report')}
                    className="px-8 py-4 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 font-bold rounded-lg transition-all duration-300 active:scale-95"
                  >
                    Download Full Report
                  </button>
                </div>
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
                <BarChart3 className="w-4 h-4" />
                Business Market Survey
              </div>
              <AnimatedText 
                text="Try It Now"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 break-words hyphens-auto"
              />
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Help us understand your business to get specific integration opportunities
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Current Step */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-blue-600/20 rounded-lg flex items-center justify-center mr-4">
                  <currentStepData.icon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{currentStepData.question}</h2>
                  <p className="text-gray-400">{currentStepData.description}</p>
                </div>
              </div>

              <form onSubmit={currentStep === steps.length - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
                {/* Step Content */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">What type of business do you operate?</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {businessTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, businessType: type.value }))}
                            className={`p-4 border rounded-lg text-left transition-all flex items-center gap-3 ${
                              formData.businessType === type.value
                                ? 'border-blue-500 bg-blue-600/10'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <type.icon className="w-5 h-5 text-blue-400" />
                            <span className="font-medium">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">How many people work in your business?</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { value: 'solo', label: 'Just me' },
                          { value: 'small', label: '2-10 people' },
                          { value: 'medium', label: '11-50 people' },
                          { value: 'large', label: '50+ people' }
                        ].map((size) => (
                          <button
                            key={size.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, businessSize: size.value }))}
                            className={`p-4 border rounded-lg text-center transition-all ${
                              formData.businessSize === size.value
                                ? 'border-blue-500 bg-blue-600/10'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <span className="font-medium">{size.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">
                        Which statement best describes your current business operations?
                      </label>
                      <div className="space-y-3">
                        {operationalStatus.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, currentAIUsage: option.value }))}
                            className={`w-full p-4 border rounded-lg text-left transition-all ${
                              formData.currentAIUsage === option.value
                                ? 'border-blue-500 bg-blue-600/10'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <div className="font-medium text-white mb-1">{option.label}</div>
                            <div className="text-sm text-gray-400">{option.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">
                        What are your biggest operational challenges? (Select all that apply)
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {painPointOptions.map((pain) => (
                          <button
                            key={pain.value}
                            type="button"
                            onClick={() => handleMultiSelect('painPoints', pain.value)}
                            className={`p-4 border rounded-lg text-left transition-all ${
                              formData.painPoints.includes(pain.value)
                                ? 'border-blue-500 bg-blue-600/10'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-white">{pain.label}</span>
                              {pain.automatable && (
                                <Zap className="h-4 w-4 text-blue-400" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">
                        What is your primary business goal for the next 12 months?
                      </label>
                      <div className="space-y-3">
                        {[
                          { value: 'more-leads', label: 'Generate more qualified leads', icon: TrendingUp },
                          { value: 'save-time', label: 'Reduce time spent on administrative tasks', icon: Clock },
                          { value: 'increase-revenue', label: 'Increase revenue per customer', icon: DollarSign },
                          { value: 'improve-service', label: 'Improve customer service quality', icon: Users },
                          { value: 'expand-business', label: 'Expand operations or market reach', icon: Building2 }
                        ].map((goal) => (
                          <button
                            key={goal.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, growthGoals: goal.value }))}
                            className={`w-full p-4 border rounded-lg text-left transition-all flex items-center ${
                              formData.growthGoals === goal.value
                                ? 'border-blue-500 bg-blue-600/10'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <goal.icon className="h-5 w-5 text-blue-400 mr-3" />
                            <span className="font-medium text-white">{goal.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.contactInfo.name}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, name: e.target.value }
                          }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.contactInfo.company}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, company: e.target.value }
                          }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="Your business name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.contactInfo.email}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, email: e.target.value }
                          }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="your.email@company.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.contactInfo.phone}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, phone: e.target.value }
                          }))}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="(806) 555-0123"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-4">
                        When would you like to implement automation solutions?
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { value: 'urgent', label: 'Immediately - We need solutions now' },
                          { value: 'soon', label: 'Within the next 4 weeks' },
                          { value: 'planning', label: 'Next 2-3 months' },
                          { value: 'exploring', label: 'Currently researching options' }
                        ].map((urgency) => (
                          <button
                            key={urgency.value}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              contactInfo: { ...prev.contactInfo, urgency: urgency.value }
                            }))}
                            className={`p-4 border rounded-lg text-left transition-all ${
                              formData.contactInfo.urgency === urgency.value
                                ? 'border-blue-500 bg-blue-600/10'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <span className="font-medium text-white">{urgency.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Survey Privacy Notice */}
                    <div className="text-xs text-gray-500 leading-relaxed">
                      By participating in this market survey, you agree to receive your personalized automation analysis and occasional updates about business automation trends in the area. We respect your privacy and will never share your information.
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
                      (currentStep === 1 && !formData.currentAIUsage) ||
                      (currentStep === 2 && formData.painPoints.length === 0) ||
                      (currentStep === 3 && !formData.growthGoals) ||
                      (currentStep === 4 && (!formData.contactInfo.name || !formData.contactInfo.email || !formData.contactInfo.company))
                    }
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      isSubmitting ||
                      (currentStep === 0 && (!formData.businessType || !formData.businessSize)) ||
                      (currentStep === 1 && !formData.currentAIUsage) ||
                      (currentStep === 2 && formData.painPoints.length === 0) ||
                      (currentStep === 3 && !formData.growthGoals) ||
                      (currentStep === 4 && (!formData.contactInfo.name || !formData.contactInfo.email || !formData.contactInfo.company))
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : currentStep === steps.length - 1 ? (
                      'Get My Assessment Results'
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
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default MarketSurvey