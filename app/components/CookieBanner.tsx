// app/components/CookieBanner.tsx - Fixed version
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Delay showing banner slightly for better UX
      setTimeout(() => setShowBanner(true), 1000)
    }

    // Global function to reset consent (for testing)
    if (typeof window !== 'undefined') {
      (window as any).resetCookieConsent = () => {
        localStorage.removeItem('cookie-consent')
        setShowBanner(true)
      }
    }
  }, [])

  const acceptCookies = async () => {
    setIsLoading(true)
    
    try {
      // Set consent
      localStorage.setItem('cookie-consent', 'accepted')
      
      // Enable GTM/GA4 tracking
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'cookie_consent_update',
          consent_status: 'granted',
          analytics_storage: 'granted',
          ad_storage: 'granted',
          functionality_storage: 'granted',
          personalization_storage: 'granted'
        })
      }

      // Simulate loading for UX
      await new Promise(resolve => setTimeout(resolve, 500))
      setShowBanner(false)
      
    } catch (error) {
      console.error('Cookie consent error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const declineCookies = async () => {
    setIsLoading(true)
    
    try {
      // Set minimal consent
      localStorage.setItem('cookie-consent', 'essential-only')
      
      // Update GTM with minimal consent
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'cookie_consent_update',
          consent_status: 'denied',
          analytics_storage: 'denied',
          ad_storage: 'denied',
          functionality_storage: 'granted', // Keep essential functionality
          personalization_storage: 'denied'
        })
      }

      await new Promise(resolve => setTimeout(resolve, 500))
      setShowBanner(false)
      
    } catch (error) {
      console.error('Cookie consent error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!showBanner) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
      
      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <div className="max-w-4xl mx-auto bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl">
          <div className="p-6">
            
            {/* Header */}
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Cookie Preferences</h3>
            </div>

            {/* Content */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, 
              and provide personalized content. By clicking "Accept All," you consent to our use of cookies for 
              analytics, marketing, and functionality purposes.
            </p>

            {/* Essential cookies info */}
            <div className="bg-gray-800/50 rounded-lg p-3 mb-6">
              <h4 className="text-white font-medium text-sm mb-1">Essential Cookies</h4>
              <p className="text-gray-400 text-xs">
                Required for basic website functionality. These cannot be disabled and include session management, 
                security features, and accessibility preferences.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <button
                onClick={acceptCookies}
                disabled={isLoading}
                className={`flex-1 font-medium py-3 px-4 rounded-lg transition-all text-sm ${
                  isLoading 
                    ? 'bg-blue-600/50 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                } text-white`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Loading...
                  </span>
                ) : (
                  'Accept All Cookies'
                )}
              </button>
              
              <button
                onClick={declineCookies}
                disabled={isLoading}
                className={`flex-1 font-medium py-3 px-4 rounded-lg transition-all text-sm ${
                  isLoading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gray-700 hover:bg-gray-600 active:scale-95'
                } text-white`}
              >
                Essential Only
              </button>
            </div>

            {/* Links - Fixed version */}
            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-center">
              <Link 
                href="/privacy-policy" 
                className="text-blue-400 hover:text-blue-300 text-xs transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms-of-service" 
                className="text-blue-400 hover:text-blue-300 text-xs transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                href="/data-deletion" 
                className="text-amber-400 hover:text-amber-300 text-xs transition-colors"
              >
                Data Deletion
              </Link>
            </div>

            {/* Debug info (remove in production) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-500">
                <p>Debug: Run <code>resetCookieConsent()</code> in console to test banner</p>
                <p>GTM Container: GTM-KR6QDVHS</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  )
}