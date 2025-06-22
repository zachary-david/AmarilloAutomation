// app/demo/page.tsx (Demo Page with GTM Integration + n8n)
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

export default function Demo() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)
  
  // Form state - n8n production integration
  const [formData, setFormData] = useState({
    product: '',
    productDescription: '',
    email: '',
    photo: null as File | null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error', message: string} | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [demoStarted, setDemoStarted] = useState(false)
  const [formProgress, setFormProgress] = useState(0)

  // Production n8n webhook URL
  const N8N_WEBHOOK_URL = 'https://howiedewitt.app.n8n.cloud/form/286bbe75-954f-46dd-9a8f-04ca1fa3894f'

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
        color: 0x10b981, // Green theme for demo
        backgroundColor: 0x0a1224,
        points: 15,
        maxDistance: 22,
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

  // Track demo page view and start
  useEffect(() => {
    // Track demo page access
    window.dataLayer?.push({
      event: 'page_view_enhanced',
      page_title: 'AI Product Video Generator Demo',
      page_section: 'demo',
      business_vertical: 'automation_consulting',
      service_offering: 'ai_agents'
    })

    // Track demo start after user lands
    const timer = setTimeout(() => {
      if (!demoStarted) {
        setDemoStarted(true)
        window.dataLayer?.push({
          event: 'demo_start',
          demo_type: 'ai_video_generator',
          service_category: 'ai_agents',
          page_section: 'demo_page'
        })
      }
    }, 3000) // Track after 3 seconds on page

    return () => clearTimeout(timer)
  }, [demoStarted])

  // Calculate form completion percentage
  const calculateFormProgress = () => {
    const fields = [formData.product, formData.productDescription, formData.email, formData.photo]
    const completedFields = fields.filter(field => field && field.toString().length > 0).length
    return Math.round((completedFields / fields.length) * 100)
  }

  // Update form progress when data changes
  useEffect(() => {
    const newProgress = calculateFormProgress()
    setFormProgress(newProgress)
    
    // Track progress milestones
    if (newProgress === 25 || newProgress === 50 || newProgress === 75) {
      window.dataLayer?.push({
        event: 'demo_form_progress',
        progress_percentage: newProgress,
        demo_type: 'ai_video_generator',
        engagement_level: newProgress > 50 ? 'high' : 'medium'
      })
    }
  }, [formData])

  // Track form start when user begins typing
  const handleFormStart = () => {
    if (!demoStarted) {
      setDemoStarted(true)
      window.dataLayer?.push({
        event: 'demo_interaction',
        interaction_type: 'form_start',
        demo_type: 'ai_video_generator',
        service_category: 'ai_agents'
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    handleFormStart()
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Track specific field completions
    if (value.length > 2) {
      window.dataLayer?.push({
        event: 'demo_field_completion',
        field_name: name,
        demo_type: 'ai_video_generator',
        form_progress: calculateFormProgress()
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    handleFormStart()
    
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!validTypes.includes(file.type)) {
        setSubmitStatus({
          type: 'error',
          message: 'Please select a JPG or PNG file only.'
        })
        e.target.value = ''
        
        // Track file upload error
        window.dataLayer?.push({
          event: 'demo_error',
          error_type: 'invalid_file_type',
          demo_type: 'ai_video_generator'
        })
        return
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        setSubmitStatus({
          type: 'error',
          message: 'File size must be less than 10MB.'
        })
        e.target.value = ''
        
        // Track file size error
        window.dataLayer?.push({
          event: 'demo_error',
          error_type: 'file_too_large',
          demo_type: 'ai_video_generator'
        })
        return
      }

      setFormData(prev => ({
        ...prev,
        photo: file
      }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => setFilePreview(e.target?.result as string)
      reader.readAsDataURL(file)
      
      // Clear any previous error messages
      setSubmitStatus(null)

      // Track successful file upload
      window.dataLayer?.push({
        event: 'demo_file_upload',
        file_type: file.type,
        file_size: file.size,
        demo_type: 'ai_video_generator',
        engagement_level: 'high'
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    // Track demo submission attempt
    window.dataLayer?.push({
      event: 'demo_submission',
      demo_type: 'ai_video_generator',
      service_category: 'ai_agents',
      product_name: formData.product,
      has_description: formData.productDescription.length > 10,
      engagement_level: 'high'
    })

    // Validation
    if (!formData.product.trim()) {
      setSubmitStatus({
        type: 'error',
        message: 'Please enter the product name.'
      })
      setIsSubmitting(false)
      return
    }

    if (!formData.productDescription.trim()) {
      setSubmitStatus({
        type: 'error',
        message: 'Please enter the product description.'
      })
      setIsSubmitting(false)
      return
    }

    if (!formData.email.trim()) {
      setSubmitStatus({
        type: 'error',
        message: 'Please enter your email.'
      })
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        type: 'error',
        message: 'Please enter a valid email address.'
      })
      setIsSubmitting(false)
      return
    }

    if (!formData.photo) {
      setSubmitStatus({
        type: 'error',
        message: 'Please select a photo.'
      })
      setIsSubmitting(false)
      return
    }

    try {
      // Create FormData object for multipart/form-data
      const submitData = new FormData()
      submitData.append('Product', formData.product)
      submitData.append('Product Description', formData.productDescription)
      submitData.append('E-Mail', formData.email)
      submitData.append('Photo(s)', formData.photo)

      // Production n8n webhook call
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        body: submitData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Parse response if needed
      const responseData = await response.json().catch(() => null)
      
      setSubmitStatus({
        type: 'success',
        message: 'Your product video request has been submitted successfully! Processing will begin shortly and you\'ll receive an email when ready.'
      })

      // Track successful demo completion
      window.dataLayer?.push({
        event: 'demo_completion',
        demo_type: 'ai_video_generator',
        service_category: 'ai_agents',
        success: true,
        conversion_value: 30 // AI demo lead value
      })

      // Track as high-value conversion
      window.dataLayer?.push({
        event: 'purchase', // Using ecommerce event for lead tracking
        ecommerce: {
          transaction_id: `demo_${Date.now()}`,
          value: 30,
          currency: 'USD',
          items: [{
            item_id: 'ai_demo_completion',
            item_name: 'AI Video Demo Completed',
            item_category: 'AI Agents',
            quantity: 1,
            price: 30
          }]
        }
      })
      
      // Reset form
      setFormData({
        product: '',
        productDescription: '',
        email: '',
        photo: null
      })
      setFilePreview(null)
      setFormProgress(0)
      
      // Reset file input
      const photoInput = document.getElementById('photo-input') as HTMLInputElement
      if (photoInput) photoInput.value = ''
        
    } catch (error) {
      console.error('Error submitting form:', error)
      
      // Track submission error
      window.dataLayer?.push({
        event: 'demo_error',
        error_type: 'submission_failed',
        demo_type: 'ai_video_generator'
      })
      
      // More specific error handling
      let errorMessage = 'There was an error submitting your request. Please try again.'
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again in a few minutes.'
        } else if (error.message.includes('400')) {
          errorMessage = 'Invalid request. Please check your form data and try again.'
        }
      }
      
      setSubmitStatus({
        type: 'error',
        message: errorMessage
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Track CTA clicks
  const handleCTAClick = (ctaType: string) => {
    window.dataLayer?.push({
      event: 'cta_click',
      cta_text: ctaType,
      cta_location: 'demo_page',
      demo_completion_status: submitStatus?.type === 'success' ? 'completed' : 'in_progress',
      lead_qualification: submitStatus?.type === 'success' ? 'high' : 'medium'
    })
  }

  return (
    <div className="min-h-screen relative">
      <div ref={vantaRef} className="fixed inset-0 z-0" />
      <div className="relative z-10">
        <Navigation />
        <main className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Hero Section */}
            <div className="text-center mb-16">
              <AnimatedText 
                text="Try Our Demo"
                className="text-4xl md:text-5xl font-bold text-white mb-6"
              />
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
                Experience our AI-powered product video generator. Upload a photo of your product 
                and get a professional marketing video sample in minutes. Perfect showcase of our AI agent capabilities.
              </p>
              
              {/* Demo Benefits */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Fast Processing</h3>
                  <p className="text-gray-400 text-sm">Get your video in under 5 minutes</p>
                </div>
                <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
                  <p className="text-gray-400 text-sm">Advanced AI creates professional content</p>
                </div>
                <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Email Delivery</h3>
                  <p className="text-gray-400 text-sm">Receive your video directly in your inbox</p>
                </div>
              </div>
            </div>

            {/* Demo Form */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">
                  Product Video Generator
                </h2>
                
                {/* Form Progress Indicator */}
                {demoStarted && (
                  <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-sm">Demo Progress</span>
                      <span className="text-green-400 text-sm font-medium">{formProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${formProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Product Name */}
                  <div>
                    <label htmlFor="product" className="block text-sm font-medium text-gray-300 mb-2">
                      Product Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="product"
                      name="product"
                      value={formData.product}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                      placeholder="e.g., Wireless Bluetooth Headphones"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  {/* Product Description */}
                  <div>
                    <label htmlFor="productDescription" className="block text-sm font-medium text-gray-300 mb-2">
                      Product Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="productDescription"
                      name="productDescription"
                      value={formData.productDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors resize-none"
                      placeholder="Describe how this product is used or what it does..."
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Your Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                      placeholder="your.email@company.com"
                      disabled={isSubmitting}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      We'll send your generated video to this email address
                    </p>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label htmlFor="photo-input" className="block text-sm font-medium text-gray-300 mb-2">
                      Product Photo <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="photo-input"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported: JPG, PNG • Max size: 10MB
                    </p>
                  </div>

                  {/* Photo Preview */}
                  {filePreview && (
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <p className="text-sm text-gray-300 mb-3">Photo Preview:</p>
                      <img 
                        src={filePreview} 
                        alt="Product Preview" 
                        className="max-w-full h-48 object-cover rounded-lg border border-gray-600 mx-auto"
                      />
                    </div>
                  )}

                  {/* Status Messages */}
                  {submitStatus && (
                    <div className={`p-4 rounded-lg border ${
                      submitStatus.type === 'success' 
                        ? 'bg-green-900/50 text-green-300 border-green-600' 
                        : 'bg-red-900/50 text-red-300 border-red-600'
                    }`}>
                      {submitStatus.message}
                      {submitStatus.type === 'success' && (
                        <div className="mt-4 space-y-2">
                          <button 
                            onClick={() => {
                              handleCTAClick('contact_for_ai_services')
                              window.location.href = '/contact'
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                          >
                            Get Custom AI Solutions
                          </button>
                        </div>
                      )}
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
                    . File uploads must be appropriate business content only.
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-lg text-white font-bold text-lg transition-all duration-300 ${
                      isSubmitting 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:scale-95 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : (
                      'Generate Product Video'
                    )}
                  </button>

                </form>
              </div>

              {/* Call-to-Action Section */}
              {submitStatus?.type === 'success' && (
                <div className="mt-12 text-center bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-gray-700 rounded-xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Impressed with Our AI Capabilities?
                  </h3>
                  <p className="text-gray-300 mb-6">
                    This demo showcases just one example of what our AI agents can do. 
                    We create custom workflow automation and AI integration solutions for businesses.
                  </p>
                  <button 
                    onClick={() => {
                      handleCTAClick('schedule_ai_consultation')
                      window.location.href = '/contact'
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
                  >
                    Schedule AI Consultation
                  </button>
                </div>
              )}

              {/* How It Works */}
              <div className="mt-16 bg-gray-900/60 border border-gray-800 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-8 text-center">How It Works</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">1</div>
                    <h4 className="text-white font-semibold mb-2">Upload Photo</h4>
                    <p className="text-gray-400 text-sm">Share a clear photo of your product</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">2</div>
                    <h4 className="text-white font-semibold mb-2">AI Processing</h4>
                    <p className="text-gray-400 text-sm">Our AI analyzes and creates your video</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">3</div>
                    <h4 className="text-white font-semibold mb-2">Video Generation</h4>
                    <p className="text-gray-400 text-sm">Professional marketing video sample is created</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">4</div>
                    <h4 className="text-white font-semibold mb-2">Email Delivery</h4>
                    <p className="text-gray-400 text-sm">Receive your video via email</p>
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