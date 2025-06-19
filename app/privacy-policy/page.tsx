// app/privacy-policy/page.tsx
'use client'

import { useEffect, useRef } from 'react'
import Navigation from '../components/Navigation'
import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy - Amarillo Automation',
  description: 'Privacy Policy for Amarillo Automation - Learn how we collect, use, and protect your personal information.',
}

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
        color: 0x6366f1, // Purple theme for legal pages
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
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
              <p className="text-gray-300 text-lg">Last updated: June 18, 2025</p>
              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                <p className="text-blue-200 text-sm">
                  <strong>Quick Summary:</strong> We respect your privacy and only collect information necessary to provide our services. 
                  We never sell your personal data and use industry-standard security measures to protect your information.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-8 backdrop-blur-sm prose prose-invert max-w-none">
              
              <p className="text-gray-300 leading-relaxed mb-6">
                This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
              </p>
              
              <p className="text-gray-300 leading-relaxed mb-8">
                We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Personal Data</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. This may include:
              </p>
              
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>• Email address</li>
                <li>• First name and last name</li>
                <li>• Company information</li>
                <li>• Usage data and analytics</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">Google Analytics</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use Google Analytics to analyze how visitors use our website. Google Analytics uses cookies to collect information about your use of our website. The information collected includes:
              </p>

              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• Pages visited and time spent on each page</li>
                <li>• How you arrived at our website</li>
                <li>• Your approximate geographic location</li>
                <li>• Your device and browser information</li>
              </ul>

              <p className="text-gray-300 leading-relaxed mb-6">
                This information is transmitted to and stored by Google. You can opt-out of Google Analytics by declining cookies in our cookie banner or by installing the Google Analytics Opt-out Browser Add-on.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">We may use Personal Data for the following purposes:</p>
              
              <ul className="text-gray-300 space-y-3 mb-6">
                <li><strong className="text-white">To provide and maintain our Service</strong>, including to monitor the usage of our Service.</li>
                <li><strong className="text-white">To contact You:</strong> To respond to your inquiries and provide customer support.</li>
                <li><strong className="text-white">To provide You</strong> with news, special offers and general information about our services.</li>
                <li><strong className="text-white">To manage Your requests:</strong> To attend and manage Your requests to Us.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Cookie Management</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                You can manage your cookie preferences at any time. If you have JavaScript enabled, you can run <code className="bg-gray-800 px-2 py-1 rounded text-sm">resetCookieConsent()</code> in your browser console to change your cookie preferences, or clear your browser's stored data.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Data Security</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
              </p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">If you have any questions about this Privacy Policy, You can contact us:</p>
              
              <ul className="text-gray-300 space-y-2 mb-8">
                <li>• By email: <a href="mailto:admin@amarilloautomation.com" className="text-blue-400 hover:underline">admin@amarilloautomation.com</a></li>
                <li>• By visiting this page on our website: <a href="/privacy-policy" className="text-blue-400 hover:underline">Privacy Policy</a></li>
              </ul>

              {/* Navigation Links */}
              <div className="mt-12 pt-8 border-t border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <Link 
                    href="/"
                    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
                  >
                    ← Back to Home
                  </Link>
                  <Link 
                    href="/contact"
                    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
                  >
                    Questions? Contact Us →
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