// app/terms-of-service/page.tsx
'use client'

import { useEffect, useRef } from 'react'
import Navigation from '../components/Navigation'
import Link from 'next/link'

export default function TermsConditions() {
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
        color: 0x7c3aed, // Different purple for terms
        backgroundColor: 0x0a1224,
        points: 8,
        maxDistance: 15,
        spacing: 14,
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
            
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms and Conditions</h1>
              <p className="text-gray-300 text-lg">Last updated: June 18, 2025</p>
              <div className="mt-6 p-4 bg-purple-900/20 border border-purple-600/30 rounded-lg">
                <p className="text-purple-200 text-sm">
                  <strong>Quick Summary:</strong> These terms govern your use of our website and services. 
                  By using our site, you agree to these terms. Please read them carefully.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8 backdrop-blur-sm prose prose-invert max-w-none">
              
              <p className="text-gray-300 leading-relaxed mb-8">
                Please read these terms and conditions carefully before using Our Service.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.
              </p>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.
              </p>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Please read Our <Link href="/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy</Link> carefully before using Our Service.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Service Usage</h2>
              <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 mb-6">
                <h4 className="text-blue-200 font-semibold mb-2">Demo Service Terms</h4>
                <ul className="text-blue-200 text-sm space-y-1">
                  <li>• Our product video generation demo is provided for evaluation purposes</li>
                  <li>• File uploads are limited to 10MB and must be appropriate business content</li>
                  <li>• We reserve the right to refuse or remove inappropriate submissions</li>
                  <li>• Generated videos are for your business use only</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">User Responsibilities</h2>
              <p className="text-gray-300 leading-relaxed mb-4">You agree to:</p>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>• Provide accurate and complete information in forms</li>
                <li>• Use the service only for lawful business purposes</li>
                <li>• Not upload inappropriate, offensive, or copyrighted content</li>
                <li>• Respect our intellectual property and that of others</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even if the Company or any supplier has been advised of the possibility of such damages.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Service Availability</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. While We strive to provide reliable service, We cannot guarantee uninterrupted access or error-free operation.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Governing Law</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                The laws of Texas, United States, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Service may also be subject to other local, state, national, or international laws.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">If you have any questions about these Terms and Conditions, You can contact us:</p>
              
              <ul className="text-gray-300 space-y-2 mb-8">
                <li>• By email: <a href="mailto:admin@amarilloautomation.com" className="text-blue-400 hover:underline">admin@amarilloautomation.com</a></li>
                <li>• By visiting this page on our website: <a href="/terms-conditions" className="text-blue-400 hover:underline">Terms and Conditions</a></li>
              </ul>

              {/* Navigation Links */}
              <div className="mt-12 pt-8 border-t border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <Link 
                    href="/privacy-policy"
                    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
                  >
                    ← Privacy Policy
                  </Link>
                  <Link 
                    href="/"
                    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
                  >
                    Back to Home →
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}