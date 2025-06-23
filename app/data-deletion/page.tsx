// app/data-deletion/page.tsx - Data Deletion Policy page
'use client'

import { useEffect, useRef } from 'react'
import Navigation from '../components/Navigation'
import Link from 'next/link'

export default function DataDeletion() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)

  useEffect(() => {
    const initVanta = async () => {
      if (typeof window !== 'undefined' && vantaRef.current) {
        try {
          // Check if Vanta is available globally (loaded via CDN or other pages)
          if ((window as any).VANTA && (window as any).THREE) {
            vantaEffect.current = (window as any).VANTA.DOTS({
              el: vantaRef.current,
              THREE: (window as any).THREE,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              scale: 1.00,
              scaleMobile: 1.00,
              color: 0xf59e0b,
              color2: 0xd97706,
              backgroundColor: 0x0f172a,
              size: 3.0,
              spacing: 15.0
            })
          } else {
            // Fallback: Use eval to avoid TypeScript module resolution
            try {
              const THREE = await eval('import("three")')
              const VANTA = await eval('import("vanta/dist/vanta.dots.min.js")')
              
              if (THREE && VANTA && vantaRef.current) {
                vantaEffect.current = VANTA.default({
                  el: vantaRef.current,
                  THREE: THREE,
                  mouseControls: true,
                  touchControls: true,
                  gyroControls: false,
                  minHeight: 200.00,
                  minWidth: 200.00,
                  scale: 1.00,
                  scaleMobile: 1.00,
                  color: 0xf59e0b,
                  color2: 0xd97706,
                  backgroundColor: 0x0f172a,
                  size: 3.0,
                  spacing: 15.0
                })
              }
            } catch (evalError) {
              console.log('Vanta.js packages not available via dynamic import')
            }
          }
        } catch (error) {
          console.log('Vanta.js background not available:', error)
          // Gracefully continue without background animation
        }
      }
    }

    initVanta()

    return () => {
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy()
        } catch (error) {
          console.log('Error destroying Vanta effect:', error)
        }
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
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-8 md:p-12">

              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Data Deletion Policy</h1>
                <p className="text-gray-300 text-lg">Last updated: {new Date().toLocaleDateString()}</p>
                <div className="mt-6 p-4 bg-amber-900/20 border border-amber-600/30 rounded-lg">
                  <p className="text-amber-200 text-sm">
                    <strong>Your Right to Data Deletion:</strong> You have the right to request deletion of your personal data. 
                    This page explains how to exercise this right and what to expect from the process.
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-invert max-w-none">

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">What Data Can Be Deleted</h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  You may request deletion of the following types of personal data we collect:
                </p>
                
                <ul className="text-gray-300 space-y-2 mb-6 list-disc pl-6">
                  <li>Contact information (name, email, phone number)</li>
                  <li>Company information and business details</li>
                  <li>Communication history and service inquiries</li>
                  <li>Website usage analytics and cookies</li>
                  <li>Project files and documentation (with limitations)</li>
                  <li>Marketing preferences and subscription data</li>
                </ul>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">How to Request Data Deletion</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  To request deletion of your personal data, please follow these steps:
                </p>

                <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Step 1: Submit Your Request</h3>
                  <p className="text-gray-300 mb-4">
                    Send an email to <a href="mailto:privacy@amarilloautomation.com" className="text-amber-400 hover:text-amber-300 underline">privacy@amarilloautomation.com</a> with the subject line: "Data Deletion Request"
                  </p>
                  
                  <h4 className="text-lg font-semibold text-white mb-2">Include the following information:</h4>
                  <ul className="text-gray-300 space-y-1 list-disc pl-6">
                    <li>Full name as it appears in our records</li>
                    <li>Email address(es) associated with your account</li>
                    <li>Company name (if applicable)</li>
                    <li>Specific data you want deleted (or "all personal data")</li>
                    <li>Reason for deletion request (optional)</li>
                  </ul>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Step 2: Identity Verification</h3>
                  <p className="text-gray-300 mb-4">
                    To protect your privacy, we may need to verify your identity before processing your request. This may involve:
                  </p>
                  <ul className="text-gray-300 space-y-1 list-disc pl-6">
                    <li>Confirming details from your account or previous communications</li>
                    <li>Requesting additional identification if needed</li>
                    <li>Verification phone call for high-value accounts</li>
                  </ul>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Step 3: Processing & Confirmation</h3>
                  <p className="text-gray-300 mb-4">
                    Once verified, we will process your request and send confirmation when deletion is complete.
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">Processing Timeline</h2>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
                    <h4 className="text-amber-200 font-semibold mb-2">Acknowledgment</h4>
                    <p className="text-amber-100 text-sm">Within 2 business days of receiving your request</p>
                  </div>
                  <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
                    <h4 className="text-amber-200 font-semibold mb-2">Processing</h4>
                    <p className="text-amber-100 text-sm">Complete deletion within 30 days (most requests completed within 7 days)</p>
                  </div>
                  <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4">
                    <h4 className="text-amber-200 font-semibold mb-2">Confirmation</h4>
                    <p className="text-amber-100 text-sm">Written confirmation when deletion is complete</p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">Important Limitations</h2>
                <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-6 mb-6">
                  <h4 className="text-red-200 font-semibold mb-3">Data We May Need to Retain</h4>
                  <ul className="text-red-100 space-y-2 text-sm list-disc pl-6">
                    <li><strong>Active Service Contracts:</strong> Client data necessary for ongoing projects may be retained until project completion</li>
                    <li><strong>Legal Requirements:</strong> Financial records, contracts, and compliance data as required by law</li>
                    <li><strong>Security Logs:</strong> Anonymized security and access logs for up to 90 days</li>
                    <li><strong>Backup Systems:</strong> Data in encrypted backups may take up to 90 days to be fully purged</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">Third-Party Services</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use several third-party services that may have their own data deletion procedures:
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Google Services (Analytics, Ads)</h4>
                    <p className="text-gray-300 text-sm">
                      We will disable tracking for your data. For complete deletion from Google's systems, 
                      visit <a href="https://myaccount.google.com" className="text-blue-400 hover:text-blue-300 underline">Google My Account</a>
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Email Service Providers</h4>
                    <p className="text-gray-300 text-sm">
                      Email communications will be deleted from our systems, but may remain in your email provider's systems
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">CRM and Project Management Tools</h4>
                    <p className="text-gray-300 text-sm">
                      Client data will be removed from all connected business tools and databases
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">After Deletion</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Once your data has been deleted:
                </p>
                
                <ul className="text-gray-300 space-y-2 mb-6 list-disc pl-6">
                  <li>You will receive written confirmation of the deletion</li>
                  <li>We will no longer be able to provide personalized services</li>
                  <li>Any active service agreements may need to be renegotiated</li>
                  <li>You may re-engage our services in the future with fresh data collection</li>
                </ul>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact Information</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  For data deletion requests or questions about this policy:
                </p>
                
                <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
                  <h4 className="text-white font-semibold mb-3">Data Protection Officer</h4>
                  <ul className="text-gray-300 space-y-2">
                    <li>
                      <strong>Email:</strong>{' '}
                      <a href="mailto:privacy@amarilloautomation.com" className="text-amber-400 hover:text-amber-300 underline">
                        privacy@amarilloautomation.com
                      </a>
                    </li>
                    <li><strong>Subject Line:</strong> "Data Deletion Request"</li>
                    <li><strong>Response Time:</strong> Within 2 business days</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-white mt-8 mb-4">Changes to This Policy</h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  We may update this Data Deletion Policy from time to time. Any changes will be posted on this page 
                  with an updated "Last modified" date. Continued use of our services after policy changes constitutes 
                  acceptance of the revised policy.
                </p>

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
                      href="/terms-of-service"
                      className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
                    >
                      Terms of Service →
                    </Link>
                  </div>
                  <div className="mt-4 text-center">
                    <Link 
                      href="/"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Back to Home
                    </Link>
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