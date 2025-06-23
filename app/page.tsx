// app/page.tsx (Combined Home + Solutions + Contact with Scroll-Based Vanta Colors)
'use client'

import { useState, useEffect, useRef } from 'react'
import Navigation from './components/Navigation'
import AnimatedText from './components/AnimatedText'
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

export default function Home() {
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

  // Color interpolation function
  const interpolateColor = (color1: number, color2: number, factor: number) => {
    const r1 = (color1 >> 16) & 255
    const g1 = (color1 >> 8) & 255  
    const b1 = color1 & 255
    
    const r2 = (color2 >> 16) & 255
    const g2 = (color2 >> 8) & 255
    const b2 = color2 & 255
    
    const r = Math.round(r1 + (r2 - r1) * factor)
    const g = Math.round(g1 + (g2 - g1) * factor)
    const b = Math.round(b1 + (b2 - b1) * factor)
    
    return (r << 16) | (g << 8) | b
  }

  // Vanta.js with scroll-based color changes
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
        color: 0x60a5fa, // Start with blue
        backgroundColor: 0x0a1224,
        points: 10.00,
        maxDistance: 20.00,
        spacing: 14.00,
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
        color: 0x60a5fa, // Start with blue
        backgroundColor: 0x0a1224,
        points: 10.00,
        maxDistance: 20.00,
        spacing: 15.00,
      }
      
      vantaEffect.current = (window as any).VANTA.NET(vantaConfig)
      
      // Scroll-based color changes - FIXED VERSION
      const handleScroll = () => {
        if (!vantaEffect.current) return
        
        const scrollTop = window.scrollY
        const windowHeight = window.innerHeight
        const docHeight = document.documentElement.scrollHeight
        
        // Calculate scroll progress (0 to 1)
        const scrollPercent = scrollTop / (docHeight - windowHeight)
        
        let newColor
        
        if (scrollPercent <= 0.33) {
          // First third: Stay blue
          newColor = 0x60a5fa
        } else if (scrollPercent <= 0.66) {
          // Second third: Blue to Green transition
          const localProgress = (scrollPercent - 0.33) / 0.33
          newColor = interpolateColor(0x60a5fa, 0x10b981, localProgress)
        } else {
          // Final third: Green to Amber transition
          const localProgress = (scrollPercent - 0.66) / 0.34
          newColor = interpolateColor(0x10b981, 0xf59e0b, localProgress)
        }
        
        // Force update the Vanta color
        try {
          vantaEffect.current.setOptions({ color: newColor })
        } catch (error) {
          console.log('Vanta color update error:', error)
        }
      }
      
      // Add scroll listener with throttling for performance
      let ticking = false
      const throttledScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll()
            ticking = false
          })
          ticking = true
        }
      }
      
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
            color: 0x60a5fa,
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
            color: 0x60a5fa,
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
      
      window.addEventListener('scroll', throttledScroll, { passive: true })
      window.addEventListener('resize', handleResize)
      
      // Initial color set
      handleScroll()
      
      return () => {
        window.removeEventListener('scroll', throttledScroll)
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
      page_title: 'Home - Amarillo Automation',
      page_section: 'combined_home',
      business_vertical: 'automation_consulting'
    })
  }, [])

  const solutions = [
    {
      title: "AI Consultation",
      description: "Let our real AI consultants automate what slows you down -- from marketing to admin to operations.",
      features: ["Use Case Discovery", "Workflow Mapping", "Tech Stack Integration", "Ongoing Support and Fine-Tuning"]
    },
    {
      title: "Lead Generation",
      description: "We build lead engines that run on autopilot — fueled by paid ads, optimized websites, and follow-up automation that converts clicks to contracts.",
      features: ["Social Media Ads", "Conversion Funnels", "CRM Setup & Follow-Up", "Custom Outreach Tools"]
    },
    {
      title: "Web Development and Optimization",
      description: "We build sites that drive SEO traffic, capture leads, and run smart automations under the hood.",
      features: ["Sales-First Design", "SEO & Structured Data", "Forms & Automations", "Analytics & Heatmaps"]
    },
    {
      title: "Smart Assistant Buildouts",
      description: "Branded AI assistants trained on your services, FAQs, and sales workflows to handle leads, scheduling, and more -- 24/7.",
      features: ["Custom GPT Shells", "VAPI Voice Agents", "Knowledge Base Integration", "Lead Tagging and CRM Sync"]
    }
  ]

  // Form handling functions
  const handleFormStart = () => {
    if (!formStarted) {
      setFormStarted(true)
      window.dataLayer?.push({
        event: 'form_start',
        form_name: 'combined_contact_form',
        form_location: 'home_page',
        lead_intent: 'service_inquiry'
      })
    }
  }

  const calculateLeadScore = (data: ContactFormData): number => {
    let score = 50
    const serviceScores: Record<string, number> = {
      'introductory-offer': 35,
      'general-consultation': 20,
      'automations': 30,
      'digital-marketing': 25,
      'ai-integration': 30
    }
    score += serviceScores[data.serviceType] || 10

    const sizeScores: Record<string, number> = {
      'just-me': 15,
      'small-team': 25,
      'large-team': 30
    }
    score += sizeScores[data.companySize] || 10

    return Math.min(score, 100)
  }

  const calculateFormProgress = () => {
    const requiredFields = ['name', 'email', 'company', 'serviceType', 'companySize']
    const optionalFields = ['message']
    const allFields = [...requiredFields, ...optionalFields]
    
    const completedFields = allFields.filter(field => 
      formData[field as keyof ContactFormData]?.length > 0
    )
    return Math.round((completedFields.length / allFields.length) * 100)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    if (!formData.name || !formData.email || !formData.company || !formData.serviceType || !formData.companySize) {
      alert('Please fill in all required fields.')
      setIsSubmitting(false)
      return
    }

    const leadScore = calculateLeadScore(formData)
    
    try {
      const response = await fetch('https://formspree.io/f/xqabllkq', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          leadScore: leadScore,
          leadQuality: leadScore > 70 ? 'High' : leadScore > 40 ? 'Medium' : 'Low',
          submissionDate: new Date().toISOString(),
          formSource: 'Combined Home Page',
          _subject: `New Lead: ${formData.name} from ${formData.company} - Score: ${leadScore}`,
          _replyto: formData.email
        }),
      })
      
      if (response.ok) {
        setSubmitted(true)
        window.dataLayer?.push({
          event: 'contact_submission',
          form_name: 'combined_contact_form',
          service_interest: formData.serviceType,
          lead_score: leadScore
        })
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      alert('Error sending message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    handleFormStart()
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen relative">
      <div ref={vantaRef} className="fixed inset-0 z-0" />
      <div className="relative z-10">
        <Navigation />
        <main>
          {/* Section 1: Hero */}
          <section id="home" className="flex-1 flex items-center justify-center px-4 py-20 min-h-screen">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedText 
                text="Tomorrow's tools, today."
                className="text-4xl md:text-6xl font-bold text-white mb-6"
              />
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                Intelligent integrations and AI-powered automations to simplify your business and supercharge growth.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#solutions"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  Explore Solutions
                </a>
                <a
                  href="#contact"
                  className="px-8 py-4 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 font-bold rounded-lg transition-all duration-300 active:scale-95"
                >
                  Get in Touch
                </a>
              </div>
            </div>
          </section>

          {/* Section 2: Solutions */}
          <section id="solutions" className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <AnimatedText 
                  text="Our Solutions"
                  className="text-4xl md:text-5xl font-bold text-white mb-6"
                />
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Powerful, scalable solutions designed to meet the demands of modern business infrastructure. 
                  From startups to enterprise, we've got you covered.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {solutions.map((solution, index) => (
                  <div
                    key={index}
                    className="bg-gray-900/80 border border-gray-800 rounded-xl p-8 hover:border-green-500/30 transition-all duration-300 hover:shadow-xl"
                  >
                    <h3 className="text-2xl font-bold text-white mb-4">{solution.title}</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">{solution.description}</p>
                    
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-white mb-3">Key Features:</h4>
                      <ul className="space-y-2">
                        {solution.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-gray-300">
                            <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-16">
                <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 border border-gray-700 rounded-xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
                  <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                    Contact our team to discuss your specific requirements and learn how our solutions can transform your operations.
                  </p>
                  <a
                    href="#contact"
                    className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold rounded-lg transition-all duration-300 active:scale-95 shadow-lg"
                  >
                    Get in Touch Below
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Contact */}
          <section id="contact" className="py-20 px-4">
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

              {submitted ? (
                <div className="max-w-2xl mx-auto text-center">
                  <div className="bg-green-800/20 border border-green-600 rounded-xl p-8">
                    <div className="text-4xl mb-4">✅</div>
                    <h2 className="text-3xl font-bold text-white mb-4">Thank You!</h2>
                    <p className="text-gray-300 mb-6">
                      We've received your inquiry and will respond within 24 hours.
                    </p>
                    <button 
                      onClick={() => {
                        setSubmitted(false)
                        setFormData({ name: '', email: '', company: '', serviceType: '', companySize: '', message: '' })
                        setFormStarted(false)
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-12">
                  {/* Contact Form */}
                  <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-6">Tell us about your project</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            <option value="general-consultation">General Consultation</option>
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
                          placeholder="Tell us about your automation needs..."
                        ></textarea>
                      </div>

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

                  {/* Contact Info */}
                  <div className="space-y-8">
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
                            <a href="mailto:admin@amarilloautomation.com" className="text-white font-semibold hover:text-amber-400 transition-colors">
                              admin@amarilloautomation.com
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-gray-300 text-sm">Response Time</p>
                            <p className="text-white font-semibold">Within 24 hours</p>
                          </div>
                        </div>
                      </div>
                    </div>

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
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}