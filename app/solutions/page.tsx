// app/solutions/page.tsx - Fixed and Complete
'use client'

import { useEffect, useRef } from 'react'
import Navigation from '../components/Navigation'
import AnimatedText from '../components/AnimatedText'
import Link from 'next/link'

export default function Solutions() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)

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
        color: 0xffde59,
        backgroundColor: 0x000000,
        points: 10.00,
        maxDistance: 20.00,
        spacing: 15.00,
      })
    }
    
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
        vantaEffect.current = null
      }
    }
  }, [])

  const solutions = [
    {
      title: "Workflow Automations",
      description: "Expert implementation of no-code automation platforms that connect your business tools and eliminate repetitive tasks.",
      features: ["Zapier Advanced Workflows", "Make.com Complex Scenarios", "n8n Custom Deployments", "Microsoft Power Automate"]
    },
    {
      title: "AI Consultation & Implementation", 
      description: "Let our AI consultants automate what slows you down — from marketing to admin to operations.",
      features: ["AI Process Discovery", "Workflow Mapping & Analysis", "Tech Stack Integration", "Ongoing Support & Optimization"]
    },
    {
      title: "Lead Generation Automation",
      description: "We build lead engines that run on autopilot — fueled by automated outreach, optimized funnels, and follow-up sequences.",
      features: ["Automated Lead Capture", "Email Sequence Automation", "CRM Workflow Setup", "Multi-Channel Follow-up"]
    },
    {
      title: "Smart Assistant & Chatbot Development",
      description: "Branded AI assistants trained on your business data to handle customer inquiries, qualify leads, and schedule appointments.",
      features: ["Custom GPT Training", "Voice Agent Integration", "Knowledge Base Automation", "Multi-Platform Deployment"]
    }
  ]

  return (
    <div className="min-h-screen relative">
      <div ref={vantaRef} className="fixed inset-0 z-0" />
      <div className="relative z-10">
        <Navigation />
        <main className="py-20 px-4">
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
                <Link
                  href="/"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold rounded-lg transition-all duration-300 active:scale-95 shadow-lg"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}