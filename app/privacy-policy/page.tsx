'use client'

import { useEffect, useRef } from 'react'
import Navigation from '../components/Navigation'
import Link from 'next/link'

export default function PrivacyPolicy() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)

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
        color: 0x6366f1,
        backgroundColor: 0x0a1224,
        points: 3,
        maxDistance: 18,
        spacing: 11,
      })
    }
    
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
        vantaEffect.current = null
      }
    }
  }, [])

  return (
    <div className="min-h-screen relative">
      <div ref={vantaRef} className="fixed inset-0 z-0" />
      <div className="relative z-10">
        <Navigation />
        <main className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
              <p className="text-gray-300 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                <p className="text-blue-200 text-sm">
                  <strong>Quick Summary:</strong> We respect your privacy and only collect information necessary to provide our automation services. 
                  We never sell your personal data and use industry-standard security measures to protect your information.
                </p>
              </div>
            </div>

            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8 backdrop-blur-sm prose prose-invert max-w-none">
              
              <h2 className="text-2xl font-bold text-white mt-0 mb-4">Information We Collect</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We collect information you provide directly to us when you contact us through our website forms, including:
              </p>
              <ul className="text-gray-300 mb-6">
                <li>Name and email address</li>
                <li>Company name and size</li>
                <li>Service interests and project details</li>
                <li>Communication preferences</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="text-gray-300 mb-6">
                <li>Respond to your inquiries and provide requested services</li>
                <li>Communicate about our automation and digital marketing services</li>
                <li>Improve our website and service offerings</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Data Retention</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Website analytics are stored for continual website improvements. Business sensitive data of partner clients 
                are not kept unless otherwise requested by the client for ongoing service provision.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Third-Party Services</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use several trusted third-party services to provide our automation and business intelligence solutions:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Google Analytics</h3>
                  <p className="text-gray-300 text-sm">
                    <strong>Used for:</strong> Website analytics and user behavior insights<br/>
                    <strong>Why:</strong> To understand how visitors use our site and improve user experience
                  </p>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Meta Business Tools</h3>
                  <p className="text-gray-300 text-sm">
                    <strong>Used for:</strong> Facebook and Instagram business analytics<br/>
                    <strong>Why:</strong> To provide social media performance insights to our clients
                  </p>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">QuickBooks</h3>
                  <p className="text-gray-300 text-sm">
                    <strong>Used for:</strong> Financial management and invoicing<br/>
                    <strong>Why:</strong> Professional accounting and billing for client services
                  </p>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Amazon Web Services</h3>
                  <p className="text-gray-300 text-sm">
                    <strong>Used for:</strong> Cloud hosting and automation infrastructure<br/>
                    <strong>Why:</strong> Reliable, scalable hosting for client automation solutions
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Cookies and Tracking</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to improve your browsing experience and analyze website traffic. 
                You can control cookie preferences through our cookie consent banner.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Data Security</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                We implement appropriate technical and organizational security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Your Rights</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="text-gray-300 mb-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt out of marketing communications</li>
              </ul>

              {/* Updated Data Deletion Reference */}
              <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4 mb-6">
                <h3 className="text-amber-200 font-semibold mb-2">🗑️ Data Deletion Rights</h3>
                <p className="text-amber-100 text-sm mb-2">
                  You have the right to request deletion of your personal data. For detailed information about our data deletion process, timelines, and procedures, please visit our comprehensive{' '}
                  <Link href="/data-deletion" className="text-amber-400 hover:text-amber-300 underline font-medium">
                    Data Deletion Policy
                  </Link>.
                </p>
                <p className="text-amber-100 text-sm">
                  This includes step-by-step instructions on how to submit deletion requests and what data can be removed.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have questions about this Privacy Policy or wish to exercise your rights, please contact us at:
              </p>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-white font-semibold">Amarillo Automation</p>
                <p className="text-gray-300">Email: <a href="mailto:admin@amarilloautomation.com" className="text-blue-400 hover:underline">admin@amarilloautomation.com</a></p>
                <p className="text-gray-300 text-sm mt-2">
                  For privacy policy inquiries, please send all correspondence to the email address above.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last updated" date.
              </p>

              {/* Updated Navigation Links */}
              <div className="mt-8 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                <p className="text-blue-200 text-center">
                  <Link href="/terms-of-service" className="text-blue-400 hover:text-blue-300 underline">
                    Terms of Service
                  </Link>
                  {" | "}
                  <Link href="/data-deletion" className="text-amber-400 hover:text-amber-300 underline">
                    Data Deletion Policy
                  </Link>
                  {" | "}
                  <Link href="/contact" className="text-blue-400 hover:text-blue-300 underline">
                    Contact Us
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}