// app/contact/page.tsx (Contact Page with GTM Integration)
'use client'

import { useState, useEffect, useRef } from 'react'
import Navigation from '../components/Navigation'
import AnimatedText from '../components/AnimatedText'
import Link from 'next/link'

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
  const [formStarted, setFormStarted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    serviceType: '',
    companySize: '',
    projectUrgency: '',
    message: ''
  })

  // Vanta.js initialization
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
        points: 12,
        maxDistance: 18,
        spacing: 20,
      })
    }
    
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
        vantaEffect.current = null
      }
    }
  }, [])

  // Track contact page view
  useEffect(() => {
    window.dataLayer?.push({
      event: 'page_view_enhanced',
      page_title: 'Contact - Amarillo Automation',
      page_section: 'contact',
      business_vertical: 'automation_consulting',
      service_offering: 'workflow_automation'
    })
  }, [])

  // Track form start when user begins typing
  const handleFormStart = () => {
    if (!formStarted) {
      setFormStarted(true)
      
      window.dataLayer?.push({
        event: 'form_start',
        form_name: 'main_contact_form',
        form_location: 'contact_page',
        lead_intent: 'service_inquiry',
        business_vertical: 'automation_consulting'
      })
    }
  }

  // Calculate lead score based on form data
  const calculateLeadScore = (data: ContactFormData): number => {
    let score = 50 // Base score

    // Service type scoring based on your actual services
    const serviceScores: Record<string, number> = {
      'workflow_automation': 30,     // Your primary high-value service
      'ai_agents': 25,              // High-value AI service
      'tech_integration': 20,        // Complex integration = value
      'lead_generation': 25,         // Direct ROI service
      'web_development': 15,         // Standard web work
      'consultation': 20             // Discovery/planning
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

  // Track field interactions for engagement scoring
  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
    
    // Track important field completions
    if (value.length > 2 && ['serviceType', 'companySize', 'projectUrgency'].includes(fieldName)) {
      window.dataLayer?.push({
        event: 'form_field_completion',
        field_name: fieldName,
        field_value: value,
        form_progress: calculateFormProgress()
      })
    }
  }

  // Calculate form completion percentage
  const calculateFormProgress = () => {
    const requiredFields = ['name', 'email', 'message']
    const optionalFields = ['company', 'serviceType', 'companySize', 'projectUrgency']
    const allFields = [...requiredFields, ...optionalFields]
    
    const completedFields = allFields.filter(field => 
      formData[field as keyof ContactFormData]?.length > 0
    )
    return Math.round((completedFields.length / allFields.length) * 100)
  }

  // Handle form submission with comprehensive tracking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all required fields.')
      setIsSubmitting(false)
      return
    }

    // Calculate lead score
    const leadScore = calculateLeadScore(formData)
    
    // Track form submission with business context
    window.dataLayer?.push({
      event: 'contact_submission',
      form_name: 'main_contact_form',
      service_interest: formData.serviceType,
      company_size: formData.companySize,
      project_urgency: formData.projectUrgency,
      lead_score: leadScore,
      business_vertical: 'automation_consulting',
      conversion_value: leadScore
    })
    
    try {
      const response = await fetch('https://formspree.io/f/xqabllkq', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          serviceType: formData.serviceType,
          companySize: formData.companySize,
          projectUrgency: formData.projectUrgency,
          message: formData.message,
          leadScore: leadScore,
          _subject: 'New Contact Form Submission - Amarillo Automation',
        }),
      })
      
      if (response.ok) {
        setSubmitted(true)
        
        // Track successful submission as conversion
        window.dataLayer?.push({
          event: 'purchase', // Using ecommerce event for lead tracking
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
          window.dataLayer?.push({
            event: 'urgent_project_contact',
            contact_method: 'contact_form',
            urgency: 'high',
            service_type: formData.serviceType,
            conversion_value: 100
          })
        }

      } else {
        throw new Error('Form submission failed')
      }
    } catch (error) {
      console.error('Error:', error)
      
      // Track submission errors
      window.dataLayer?.push({
        event: 'form_error',
        error_type: 'submission_failed',
        form_name: 'main_contact_form'
      })
      
      alert('There was an error sending your message. Please try again or email us directly at admin@amarilloautomation.com')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Track emergency support clicks
  const handleEmergencyClick = () => {
    window.dataLayer?.push({
      event: 'urgent_project_contact',
      contact_method: 'emergency_email',
      urgency: 'immediate',
      conversion_value: 100,
      business_vertical: 'automation_consulting'
    })
  }

  // Track direct contact method clicks
  const handleContactMethodClick = (method: string) => {
    window.dataLayer?.push({
      event: 'contact_method_click',
      method: method,
      location: 'contact_page',
      business_vertical: 'automation_consulting'
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    handleFormStart()
    handleFieldChange(e.target.name, e.target.value)
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
                <div className="space-y-4">
                  <button 
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({
                        name: '', email: '', company: '', serviceType: '',
                        companySize: '', projectUrgency: '', message: ''
                      })
                      setFormStarted(false)
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <AnimatedText 
                text="Get In Touch"
                className="text-4xl md:text-5xl font-bold text-white mb-6"
              />
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Ready to automate your workflows? We'd love to hear from you. 
                Send us a message and we'll respond within 24 hours.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Tell us about your project</h3>
                
                {/* Rush Project Banner */}
                <div className="bg-orange-800/20 border border-orange-600 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-orange-400 font-semibold mb-1">Need Rush Delivery?</h4>
                      <p className="text-gray-300 text-sm">Fast-track workflow automation and AI integration</p>
                    </div>
                    <div className="text-orange-400 text-2xl">⚡</div>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
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
                        <option value="workflow_automation">Workflow Automation</option>
                        <option value="tech_integration">Tech Integration</option>
                        <option value="ai_agents">AI Agents & Chatbots</option>
                        <option value="lead_generation">Lead Generation Systems</option>
                        <option value="web_development">Web Development</option>
                        <option value="consultation">General Consultation</option>
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
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                      placeholder="Tell us about your workflow automation needs, tech integration requirements, or AI agent project..."
                    ></textarea>
                  </div>

                  {/* Form Progress Indicator */}
                  {formStarted && (
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm">Form Progress</span>
                        <span className="text-amber-400 text-sm font-medium">{calculateFormProgress()}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateFormProgress()}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Privacy Notice */}
                  <div className="text-xs text-gray-500 leading-relaxed">
                    By submitting this form, you agree to our{' '}
                    <Link href="/privacy-policy" className="text-blue-400 hover:underline">
                      Privacy Policy
                    </Link>{' '}
                    and{' '}
                    <Link href="/terms-conditions" className="text-blue-400 hover:underline">
                      Terms & Conditions
                    </Link>
                    . Your information will be processed according to our privacy practices.
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
                    <div 
                      className="flex items-center cursor-pointer hover:text-amber-400 transition-colors"
                      onClick={() => handleContactMethodClick('email')}
                    >
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

                <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-white mb-4">Office Hours</h4>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>8:00 AM - 5:00 PM CST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM CST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-gray-700 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-white mb-4">Need Immediate Help?</h4>
                  <p className="text-gray-300 mb-4">
                    For urgent projects or critical automation needs, contact our priority support team.
                  </p>
                  <a
                    href="mailto:247@amarilloautomation.com?subject=Urgent%20Project%20Request"
                    onClick={handleEmergencyClick}
                    className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-all duration-300 active:scale-95 text-center no-underline"
                    role="button"
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