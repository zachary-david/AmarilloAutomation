'use client'

import { useEffect, useRef } from 'react'
import { ChevronRight, Star, CheckCircle, ArrowRight } from 'lucide-react'

export default function Homepage() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)

  useEffect(() => {
    const loadVanta = async () => {
      if (typeof window !== 'undefined' && !window.VANTA) {
        try {
          const threeScript = document.createElement('script')
          threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js'
          document.head.appendChild(threeScript)
          
          await new Promise(resolve => { threeScript.onload = resolve })
          
          const vantaScript = document.createElement('script')
          vantaScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.net.min.js'
          document.head.appendChild(vantaScript)
          
          await new Promise(resolve => { vantaScript.onload = resolve })
          if (vantaRef.current && window.VANTA) {
            vantaEffect.current = window.VANTA.NET({
              el: vantaRef.current,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              scale: 1.00,
              scaleMobile: 1.00,
              color: 0xffde59,
              backgroundColor: 0x000000,
              points: 8.00,
              maxDistance: 18.00,
              spacing: 16.00,
            })
          }
        } catch (error) {
          console.log('Vanta.js loading failed:', error)
        }
      }
    }
    
    loadVanta()
    
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
        vantaEffect.current = null
      }
    }
  }, [])

  const trackCTA = (action: string) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'cta_click', {
        event_category: 'conversion',
        event_label: action,
        value: 1
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div ref={vantaRef} className="fixed inset-0 z-0" />
      {/* Overlay to subdue Vanta effect */}
      <div className="fixed inset-0 z-[5] bg-gray-900/25 backdrop-blur-[0.5px]" />
      <div className="relative z-10">

        <nav className="w-full py-6 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-center text-center font-inter text-sm md:text-base">
              <a
                href="#digital-advertising"
                className="text-white/80 hover:text-white hover:underline transition-all duration-300 px-2"
              >
                Digital Advertising
              </a>
              <span className="text-white/60 mx-2">|</span>
              <a
                href="#tools"
                className="text-white/80 hover:text-white hover:underline transition-all duration-300 px-2"
              >
                Tools
              </a>
              <span className="text-white/60 mx-2">|</span>
              <a
                href="#about"
                className="text-white/80 hover:text-white hover:underline transition-all duration-300 px-2"
              >
                About
              </a>
            </div>
          </div>
        </nav>
        
        <section className="min-h-screen flex items-center justify-center px-4 pt-1">
          <div className="max-w-5xl mx-auto text-center">

            {/* Profile Image */}
            <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto mb-3 mt-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffde59] to-[#f4c542] rounded-full animate-pulse"></div>
              <div className="absolute inset-2 rounded-full overflow-hidden">
                <img 
                  src="/garrett.jpg" 
                  alt="Garrett Zamora"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Brand Name with Subtitle - Now under profile image */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-8 tracking-tight">
              <span className="block">
                <span className="align-middle">⚡</span> Garrett
              </span>
              <span className="block text-[#ffde59]">
                Freelance Digital Marketing 
              </span>
            </h1>

            {/* HIDDEN - Three Primary CTAs - May be used later
            <div className="grid md:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
              <a 
                href="mailto:garrett@amarilloautomation.com"
                onClick={() => trackCTA('get_a_quote')}
                className="px-6 py-4 bg-[#ffde59] hover:bg-[#f4c542] text-black font-bold text-lg rounded-lg transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Get a Quote
              </a>
              
              <a 
                href="/business-discovery"
                onClick={() => trackCTA('see_demo')}
                className="px-6 py-4 bg-[#ffde59] hover:bg-[#f4c542] text-black font-bold text-lg rounded-lg transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
              >
                See a Demo
              </a>
              
              <a 
                href="mailto:garrett@amarilloautomation.com"
                onClick={() => trackCTA('contact_us')}
                className="px-6 py-4 bg-[#ffde59] hover:bg-[#f4c542] text-black font-bold text-lg rounded-lg transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Contact Us
              </a>
            </div>
            */}

            {/* Main Value Proposition */}
            <div className="max-w-4xl mx-auto mb-12">
              <p className="text-xl md:text-2xl text-gray-300 mb-6">
                Put <span className="text-[#ffde59] font-semibold">Digital Marketing and Advertising</span> to work for your business!
              </p>
              
              <p className="text-lg md:text-xl text-gray-400 mb-8">
                I help contractors and small businesses grow through proven marketing strategies, 
                content creation, customer management systems, and workflow automations.
              </p>

              {/* Core Benefits */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">              
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-8 h-8 text-[#ffde59] mb-2" />
                  <h3 className="text-xl font-bold text-white">Save Time</h3>
                  <p className="text-gray-400 text-sm mt-1">Automate repetitive tasks</p>
                </div>
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-8 h-8 text-[#ffde59] mb-2" />
                  <h3 className="text-xl font-bold text-white">Make Money</h3>
                  <p className="text-gray-400 text-sm mt-1">Get more qualified leads</p>
                </div>
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-8 h-8 text-[#ffde59] mb-2" />
                  <h3 className="text-xl font-bold text-white">Keep It Simple</h3>
                  <p className="text-gray-400 text-sm mt-1">No complex software</p>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="space-y-2 text-center">
              <div className="text-[#ffde59] font-semibold">Google Ads Certified Partner</div>
              <div className="text-[#ffde59] font-semibold">Certified Meta Developer</div>
              <div className="text-[#ffde59] font-semibold">GoHighLevel Partner</div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4" id="digital-advertising">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-3xl font-bold text-white mb-6">You Don't Need to Overspend to Get New Customers</h3>
              <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
                The secret recipe for efficient and effective digital marketing <br /> isn't as complicated as it used to be.
                The most important part is finding the right marketing partner to handle the hard stuff for you.
              </p>
            </div>

            <div className="mb-16">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Google Ads",
                    description: "Get instant visibility when customers search for your services. We manage campaigns that pay for themselves."
                  },
                  {
                    title: "E-Commerce Integration", 
                    description: "Expand beyond local with online sales capabilities that integrate with your existing operations and inventory systems."
                  },
                  {
                    title: "Social Media Advertising",
                    description: "Facebook and Instagram campaigns that target your ideal customers in your service area and track real ROI, not just likes."
                  },
                  {
                    title: "Websites That Convert",
                    description: "Fast, mobile-optimized websites that turn visitors into leads with clear calls-to-action and professional credibility."
                  },
                  {
                    title: "Email Marketing",
                    description: "Automated email sequences that nurture leads, retain customers, and generate repeat business without manual work."
                  },
                  {
                    title: "Performance Analytics", 
                    description: "Custom dashboards that show exactly which marketing efforts are driving revenue."
                  },
                  {
                    title: "AI Search Optimization",
                    description: "Future-proof your business by optimizing for ChatGPT, voice search, and AI-powered search engines."
                  },
                  {
                    title: "Local SEO",
                    description: "We're sure you've heard of this by now and it is still important. We can help here, too."
                  }
                ].map((service, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-[#ffde59]/30 transition-all">
                    <h4 className="text-lg font-bold text-white mb-3">{service.title}</h4>
                    <p className="text-gray-300 text-sm">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 
        HIDDEN SECTION - High Dollar Software automation examples - May be used later
        This section included:
        - "You Don't Need High Dollar Software to Use Premium Features" header
        - Automation workflow examples (New Lead, Missed Call, etc.)
        - 6 automation cards with trigger/action flow diagrams
        - Closing message about customization and no software headaches
        */}

        <section className="py-20 px-4" id="tools">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-3xl font-bold text-white mb-6">Tools We Use</h2>
              <p className="text-xl text-gray-300 text-center mb-8 max-w-3xl mx-auto">
                We integrate with the platforms you already know and trust. No learning curve, no forced migrations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {[
                  'Google Ads', 'Facebook', 'Instagram', 'YouTube', 
                  'Google Workspace', 'Google Analytics', 'Google My Business', 'Gemini',
                  'Zapier', 'Make.com', 'GoHighLevel', 'AirTable',
                  'WordPress', 'WooCommerce', 'Wix Studio', 'TikTok',
                  'QuickBooks', 'Stripe', 'PayPal', 'Google Calendar',
                  'Mailchimp', 'HubSpot', 'JobNimbus', 'Pipedrive',
                  'Salesforce', 'Slack', 'Microsoft Teams', 'Shopify',
                  'ChatGPT', 'Claude', 'Midjourney', 'Canva AI',
                  'Twilio', 'Yelp',
                ].map((tool, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center hover:border-[#ffde59]/30 transition-all">
                    <span className="text-gray-300 font-medium text-sm">{tool}</span>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <p className="text-gray-400">And many more! If you use it, we can probably integrate with it.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4" id="about">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-center md:text-left">
                <h3 className="text-3xl md:text-3xl font-bold text-white mb-6 text-center md:text-left">Industry Expertise That Delivers Results</h3>
                <div className="space-y-4">
                  <div className="flex items-start justify-center md:justify-start">
                    <CheckCircle className="w-6 h-6 text-[#ffde59] mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-300 text-left">5+ years building and managing paid digital media campaigns across all categories</p>
                  </div>
                  <div className="flex items-start justify-center md:justify-start">
                    <CheckCircle className="w-6 h-6 text-[#ffde59] mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-300 text-left">5+ years automating workflows for contractors, roofers, HVAC, and plumbing companies</p>
                  </div>
                  <div className="flex items-start justify-center md:justify-start">
                    <CheckCircle className="w-6 h-6 text-[#ffde59] mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-300 text-left">Certifications in most listed tools and/or affiliate partnerships</p>
                  </div>
                  <div className="flex items-start justify-center md:justify-start">
                    <CheckCircle className="w-6 h-6 text-[#ffde59] mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-300 text-left">Deep understanding of home service business operations and pain points</p>
                  </div>
                  <div className="flex items-start justify-center md:justify-start">
                    <CheckCircle className="w-6 h-6 text-[#ffde59] mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-300 text-left">Proven track record with 40+ local businesses and $6M+ in additional revenue generated</p>
                  </div>
                  <div className="flex items-start justify-center md:justify-start">
                    <CheckCircle className="w-6 h-6 text-[#ffde59] mr-3 mt-1 flex-shrink-0" />
                    <p className="text-gray-300 text-left">Local support you can trust - we're your neighbors, not a distant corporation</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-lg p-8">
                <h4 className="text-xl font-bold text-white mb-4">What Sets Us Apart</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>• Same-day response to all inquiries</li>
                  <li>• Custom solutions, not cookie-cutter templates</li>
                  <li>• Ongoing support and optimization included</li>
                  <li>• ROI-focused approach -- If it doesn't pay for itself, it's not worth doing </li>
                  <li>• No long-term contracts or hidden fees</li>
                  <li>• We won't force solutions you don't need just to hit a budget or quota</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* HIDDEN SECTION - Reviews/Testimonials - May be used later
        <section className="py-20 px-4 bg-gray-900/50 backdrop-blur-sm" id="reviews">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-3xl font-bold text-white mb-6">Real Results from Real Businesses</h2>
              <p className="text-xl text-gray-300">
                See how we've helped local contractors save time, increase revenue, and grow their businesses.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  company: "Amarillo Roofing Company",
                  problem: "We were drowning in marketing costs, and we didn't even know if it was doing anything for us",
                  solution: "Trackable Marketing Performance and Campaign Management using existing assets",
                  result: "Generated more than $100,000 in revenue over 6-month period at 10% of original spend.",
                  rating: 5
                },
                {
                  company: "Amarillo HVAC Company",
                  problem: "Spending 2+ hours daily on manual scheduling and customer follow-ups",
                  solution: "Complete workflow automation for scheduling and customer communications",
                  result: "Saved 15 hours per week on admin work. Customer satisfaction scores up 35%.",
                  rating: 5
                },
                {
                  company: "Amarillo Plumbing Company",
                  problem: "Lost track of estimates and follow-ups, missing potential revenue",
                  solution: "Automated estimate tracking and follow-up sequences", 
                  result: "Estimate-to-sale conversion increased by 60%. Haven't lost a lead since.",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{testimonial.company}</h3>
                  <div className="space-y-3 text-sm text-gray-300">
                    <p><strong className="text-red-400">Problem:</strong> {testimonial.problem}</p>
                    <p><strong className="text-blue-400">Solution:</strong> {testimonial.solution}</p>
                    <p><strong className="text-green-400">Result:</strong> {testimonial.result}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        */}

        <section className="py-20 px-4 bg-black relative overflow-visible">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Want to Learn More?
            </h2>
            <a 
              href="mailto:garrett@amarilloautomation.com"
              onClick={() => trackCTA('final_email_cta')}
              className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-[#ffde59] hover:bg-[#f4c542] text-black font-bold rounded-lg transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl text-base md:text-lg"
            >
              Email us now
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}