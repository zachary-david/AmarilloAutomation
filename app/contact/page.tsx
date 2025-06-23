// app/contact/page.tsx - Complete file with responsive Vanta.js
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
    message: ''
  })

  // Vanta.js background effect - Responsive configurations (Amber theme)
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
        color: 0xf59e0b, // Keeping amber theme
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
        color: 0xf59e0b, // Keeping amber theme
        backgroundColor: 0x0a1224,
        points: 10.00, // Updated desktop settings
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
            points: 10.00,
            maxDistance: 20.00,
            spacing: 15.00,
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
      'introductory-offer': 35,      // Your highest value service
      'general-consultation': 20,    // Discovery/planning
      'automations': 30,             // High-value automation service
      'digital-marketing': 25,       // Marketing automation
      'ai-integration': 30           // AI service integration
    }
    score += serviceScores[data.serviceType] || 10

    // Company size scoring
    const sizeScores: Record<string, number> = {
      'just-me': 15,        // Individual/freelancer
      'small-team': 25,     // Small team with growth potential
      'large-team': 30      // Large team with complex needs
    }
    score += sizeScores[data.companySize] || 10

    return Math.min(score, 100) // Cap at 100
  }

  // Track field interactions for engagement scoring
  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
    
    // Track important field completions
    if (value.length > 2 && ['serviceType', 'companySize'].includes(fieldName)) {
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
    const requiredFields = ['name', 'email', 'company', 'serviceType', 'companySize']
    const optionalFields = ['message']
    const allFields = [...requiredFields, ...optionalFields]
    
    const completedFields = allFields.filter(field => 
      formData[field as keyof ContactFormData]?.length > 0
    )
    return Math.round((completedFields.length / allFields.length) * 100)
  }

  // FIXED FORM SUBMISSION - Direct to Formspree
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    if (!formData.name || !formData.email || !formData.company || !formData.serviceType || !formData.companySize) {
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
      lead_score: leadScore,
      business_vertical: 'automation_consulting',
      conversion_value: leadScore
    })
    
    try {
      console.log('Submitting form data to Formspree:', formData)
      
      // DIRECT FORMSPREE SUBMISSION - No custom API
      const response = await fetch('https://formspree.io/f/xqabllkq', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Contact Information
          name: formData.name,
          email: formData.email,
          company: formData.company,
          serviceType: formData.serviceType,
          companySize: formData.companySize,
          message: formData.message || 'No additional details provided',
          
          // Lead Intelligence for Zapier processing
          leadScore: leadScore,
          leadQuality: leadScore > 70 ? 'High' : leadScore > 40 ? 'Medium' : 'Low',
          
          // Metadata
          submissionDate: new Date().toISOString(),
          formSource: 'Website Contact Form',
          pageUrl: window.location.href,
          leadSource: 'Direct Website',
          
          // Custom Formspree fields
          _subject: `New Contact Lead: ${formData.name} from ${formData.company || 'Unknown Company'} - Lead Score: ${leadScore}`,
          _replyto: formData.email,
          _format: 'json'
        }),
      })
      
      console.log('Formspree Response Status:', response.status)
      const responseData = await response.json().catch(() => null)
      console.log('Formspree Response Data:', responseData)
      
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
        if (formData.serviceType === 'introductory-offer') {
          window.dataLayer?.push({
            event: 'intro_offer_contact',
            contact_method: 'contact_form',
            service_type: formData.serviceType,
            conversion_value: 100
          })
        }

        // Reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          serviceType: '',
          companySize: '',
          message: ''
        })

      } else {
        throw new Error(`Formspree submission failed: ${response.status}`)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      
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
                        companySize: '', message: ''
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
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
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
                        Service Interest *
                      </label>
                      <select
                        id="serviceType"
                        name="serviceType"
                        required
                        value={formData.serviceType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
                      >
                        <option value="">Select a service</option>
                        <option value="introductory-offer">Introductory Offer</option>
                        <option value="general-consultation">General Consultation (any service)</option>
                        <option value="automations">Automations</option>
                        <option value="digital-marketing">Digital Marketing</option>
                        <option value="ai-integration">AI Integration</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="companySize" className="block text-sm font-medium text-gray-300 mb-2">
                        Company Size *
                      </label>
                      <select
                        id="companySize"
                        name="companySize"
                        required
                        value={formData.companySize}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
                      >
                        <option value="">Select company size</option>
                        <option value="just-me">Just Me</option>
                        <option value="small-team">Small Team</option>
                        <option value="large-team">Large Team (50+ employees)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Project Details
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
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
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* Direct Contact */}
                <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Direct Contact</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">Email</p>
                        <a 
                          href="mailto:admin@amarilloautomation.com" 
                          className="text-white font-semibold hover:text-amber-400 transition-colors"
                          onClick={() => handleContactMethodClick('email')}
                        >
                          admin@amarilloautomation.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">Emergency Support</p>
                        <a 
                          href="mailto:247@amarilloautomation.com" 
                          className="text-white font-semibold hover:text-amber-400 transition-colors"
                          onClick={handleEmergencyClick}
                        >
                          247@amarilloautomation.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Business Hours</h3>
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
                      <span>Emergency Support Only</span>
                    </div>
                  </div>
                </div>

                {/* Service Areas */}
                <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Service Areas</h3>
                  <div className="space-y-3 text-gray-300">
                    <p><strong className="text-white">Primary:</strong> Texas Panhandle</p>
                    <p><strong className="text-white">Remote Services:</strong> Nationwide</p>
                    <p><strong className="text-white">Specialties:</strong> Small to Medium Businesses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}