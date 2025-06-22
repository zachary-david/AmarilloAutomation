// app/contact/page.tsx - Fixed version with error resolution
'use client'

import { useState, useEffect, useRef } from 'react'
import Navigation from '../components/Navigation'
import AnimatedText from '../components/AnimatedText'

// GTM Event Tracking Functions
declare global {
  interface Window {
    dataLayer: any[]
  }
}

interface ContactFormData {
  name: string
  email: string
  company: string
  serviceType: string
  companySize: string
  projectUrgency: string
  message: string
}

export default function Contact() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    serviceType: '',
    companySize: '',
    projectUrgency: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formStarted, setFormStarted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

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
        points: 10,
        maxDistance: 20,
        spacing: 16,
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
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view_enhanced',
        page_title: 'Contact - Amarillo Automation',
        page_section: 'contact',
        business_vertical: 'automation_consulting',
        service_offering: 'workflow_automation'
      })
    }
  }, [])

  // Track form start when user begins typing
  const handleFormStart = () => {
    if (!formStarted) {
      setFormStarted(true)
      
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'form_start',
          form_name: 'main_contact_form',
          form_location: 'contact_page',
          lead_intent: 'service_inquiry',
          business_vertical: 'automation_consulting'
        })
      }
    }
  }

  // Calculate lead score based on form data
  const calculateLeadScore = (data: ContactFormData): number => {
    let score = 50 // Base score

    // Service type scoring based on your actual services
    const serviceScores: Record<string, number> = {
      'Workflow Automation': 30,        // Your primary high-value service
      'AI Services': 25,               // High-value AI service
      'Digital Marketing': 25,          // Direct ROI service
      'General Consultation': 20       // Discovery/planning phase
    }
    score += serviceScores[data.serviceType] || 10

    // Company size scoring
    const sizeScores: Record<string, number> = {
      'enterprise': 25,    // Large automation projects
      'large': 20,         // Multi-department workflow needs
      'medium': 20,        // Sweet spot for your services
      'small': 15,         // Still valuable, simpler projects
      'startup': 10        // Budget constraints but growth potential
    }
    score += sizeScores[data.companySize] || 10

    // Project urgency scoring
    const urgencyScores: Record<string, number> = {
      'urgent': 25,        // Rush project = premium pricing
      'soon': 20,          // Normal timeline
      'planning': 15,      // Future project pipeline
      'exploring': 10      // Early research phase
    }
    score += urgencyScores[data.projectUrgency] || 5

    return Math.min(score, 100) // Cap at 100
  }

  // Handle form submission with comprehensive tracking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('') // Clear any previous errors
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields (Name, Email, and Project Details).')
      setIsSubmitting(false)
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.')
      setIsSubmitting(false)
      return
    }

    try {
      // Calculate lead score
      const leadScore = calculateLeadScore(formData)
      
      // Track form submission with business context
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'contact_submission',
          form_name: 'main_contact_form',
          service_interest: formData.serviceType,
          company_size: formData.companySize,
          project_urgency: formData.projectUrgency,
          lead_score: leadScore,
          business_vertical: 'automation_consulting',
          conversion_value: leadScore
        })
      }
      
      console.log('Submitting form data:', {
        ...formData,
        leadScore,
        formType: 'contact_form'
      })

      // Submit to YOUR API route
      const response = await fetch('/api/contact', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.company.trim(),
          serviceType: formData.serviceType,
          companySize: formData.companySize,
          projectUrgency: formData.projectUrgency,
          message: formData.message.trim(),
          leadScore: leadScore,
          formType: 'contact_form'
        }),
      })
      
      console.log('API Response Status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.text()
        console.error('API Response Error:', errorData)
        throw new Error(`Server error: ${response.status}`)
      }

      const result = await response.json()
      console.log('Form submission result:', result)
      
      setSubmitted(true)
      
      // Track successful submission as conversion
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'purchase',
          ecommerce: {
            transaction_id: `contact_${Date.now()}`,
            value: leadScore,
            currency: 'USD',
            items: [{
              item_id: 'contact_submission',
              item_name: 'Service Inquiry Submitted',
              item_category: 'Lead Generation',
              item_variant: formData.serviceType || 'general',
              quantity: 1,
              price: leadScore
            }]
          }
        })

        // Track high-value urgent projects separately
        if (formData.projectUrgency === 'urgent') {
          window.dataLayer.push({
            event: 'urgent_project_contact',
            contact_method: 'contact_form',
            urgency: 'high',
            service_type: formData.serviceType,
            conversion_value: 100
          })
        }
      }

    } catch (error) {
      console.error('Form submission error:', error)
      
      // Track submission errors
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'form_error',
          error_type: 'submission_failed',
          form_name: 'main_contact_form'
        })
      }
      
      setErrorMessage('There was an error sending your message. Please try again or email us directly at admin@amarilloautomation.com')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    handleFormStart()
    setFormData({ ...formData, [e.target.name]: e.target.value })
    
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage('')
    }
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen relative">
        <div ref={vantaRef} className="fixed inset-0 z-0" />
        <div className="relative z-10">
          <Navigation />
          <main className="py-20 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-green-800/20 border border-green-600 rounded-xl p-8">
                <div className="text-4xl mb-4">✅</div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Thank You for Contacting Us!
                </h2>
                <p className="text-gray-300 mb-6">
                  We've received your inquiry and will respond within 24 hours. 
                  For urgent projects, we'll prioritize your request accordingly.
                </p>
                <p className="text-amber-400 font-semibold">
                  Check your email for a follow-up message from Garrett with next steps.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <div ref={vantaRef} className="fixed inset-0 z-0" />
      <div className="relative z-10">
        <Navigation />
        <main className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <AnimatedText 
                text="Let's Automate Your Business"
                className="text-4xl md:text-5xl font-bold text-white mb-6"
              />
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Ready to streamline your operations and scale your Texas contracting business? 
                Let's discuss how automation can transform your workflow.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6">Get Your Free Consultation</h2>
                
                {/* Error Message Display */}
                {errorMessage && (
                  <div className="mb-6 p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
                    <p className="text-red-400 text-sm">{errorMessage}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                        placeholder="your.email@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="Your company name"
                    />
                  </div>

                  {/* Business Context */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="serviceType" className="block text-sm font-medium text-gray-300 mb-2">
                        Service Interest
                      </label>
                      <select
                        id="serviceType"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
                      >
                        <option value="">Select a service</option>
                        <option value="General Consultation">General Consultation</option>
                        <option value="Workflow Automation">Workflow Automation</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="AI Services">AI Services</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="companySize" className="block text-sm font-medium text-gray-300 mb-2">
                        Company Size
                      </label>
                      <select
                        id="companySize"
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
                      >
                        <option value="">Select company size</option>
                        <option value="startup">Startup (1-10 employees)</option>
                        <option value="small">Small (11-50 employees)</option>
                        <option value="medium">Medium (51-200 employees)</option>
                        <option value="large">Large (201-1000 employees)</option>
                        <option value="enterprise">Enterprise (1000+ employees)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="projectUrgency" className="block text-sm font-medium text-gray-300 mb-2">
                      Project Timeline
                    </label>
                    <select
                      id="projectUrgency"
                      name="projectUrgency"
                      value={formData.projectUrgency}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
                    >
                      <option value="">Select timeline</option>
                      <option value="urgent">Urgent (Rush delivery needed)</option>
                      <option value="soon">Soon (Within 2-4 weeks)</option>
                      <option value="planning">Planning (1-3 months)</option>
                      <option value="exploring">Exploring (Research phase)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Project Details *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="Tell us about your current challenges and what you'd like to automate..."
                    />
                  </div>

                  <div className="text-xs text-gray-400 text-center">
                    Your information will be processed according to our privacy practices.
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 font-bold rounded-lg transition-all duration-300 active:scale-95 shadow-lg ${
                      isSubmitting
                        ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-white mb-4">Contact Information</h4>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-amber-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-300">admin@amarilloautomation.com</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-amber-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-300">Amarillo, TX</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-gray-700 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-white mb-4">Need Immediate Help?</h4>
                  <p className="text-gray-300 mb-4">
                    For urgent projects or critical automation needs, contact our priority support team.
                  </p>
                  <a
                    href="mailto:admin@amarilloautomation.com?subject=Emergency%20Support%20Request"
                    className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-all duration-300 active:scale-95 text-center no-underline"
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.dataLayer) {
                        window.dataLayer.push({
                          event: 'urgent_project_contact',
                          contact_method: 'emergency_email',
                          urgency: 'immediate',
                          conversion_value: 100,
                          business_vertical: 'automation_consulting'
                        })
                      }
                    }}
                  >
                    Rush Project Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}