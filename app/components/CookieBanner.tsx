'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// GTM and Consent Mode helper functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookie-consent')
    
    // Initialize consent mode for GTM
    initializeConsentMode()
    
    if (!hasConsented) {
      // Show banner after a brief delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    } else if (hasConsented === 'accepted') {
      // If previously accepted, grant consent
      updateConsent('granted', 'granted')
    } else if (hasConsented === 'declined') {
      // If previously declined, keep consent denied
      updateConsent('denied', 'denied')
    }
  }, [])

  const initializeConsentMode = () => {
    // Initialize dataLayer if not exists
    window.dataLayer = window.dataLayer || []
    
    // Define gtag function
    window.gtag = function() {
      window.dataLayer.push(arguments)
    }
    
    // Set default consent state (denied until user chooses)
    window.gtag('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'functionality_storage': 'granted', // Essential cookies
      'security_storage': 'granted', // Essential cookies
      'wait_for_update': 500
    })

    console.log('GTM Consent Mode initialized for Amarillo Automation')
  }

  const updateConsent = (analyticsStorage: string, adStorage: string) => {
    window.gtag?.('consent', 'update', {
      'analytics_storage': analyticsStorage,
      'ad_storage': adStorage,
      'ad_user_data': adStorage,
      'ad_personalization': adStorage
    })

    // Push consent event to dataLayer for GTM tracking
    window.dataLayer?.push({
      'event': 'consent_update',
      'consent_analytics': analyticsStorage,
      'consent_ads': adStorage,
      'consent_timestamp': new Date().toISOString(),
      'business_type': 'AI and automation'
    })

    console.log(`Consent updated: Analytics=${analyticsStorage}, Ads=${adStorage}`)
  }

  const clearTrackingCookies = () => {
    // Clear GA and GTM cookies
    const trackingCookies = document.cookie.split(';').filter(cookie => 
      cookie.trim().startsWith('_ga') || 
      cookie.trim().startsWith('_gid') ||
      cookie.trim().startsWith('_gat') ||
      cookie.trim().startsWith('_gtm')
    )
    
    trackingCookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim()
      // Clear for current domain
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      // Clear for parent domain
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.amarilloautomation.com`
    })

    console.log('Tracking cookies cleared')
  }

  const acceptCookies = async () => {
    setIsLoading(true)
    
    try {
      // Save consent with business context
      localStorage.setItem('cookie-consent', 'accepted')
      localStorage.setItem('cookie-consent-date', new Date().toISOString())
      localStorage.setItem('consent-business-type', 'ai_automation')
      
      // Update consent for GTM
      updateConsent('granted', 'granted')
      
      // Track the consent event via GTM with business context
      setTimeout(() => {
        window.dataLayer?.push({
          'event': 'cookie_consent_granted',
          'consent_method': 'banner_accept',
          'business_type': 'technology_company',
          'service_focus': 'automation_solutions'
        })
      }, 500)
      
      setShowBanner(false)
    } catch (error) {
      console.error('Error accepting cookies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const declineCookies = () => {
    setIsLoading(true)
    
    try {
      // Save decline with timestamp
      localStorage.setItem('cookie-consent', 'declined')
      localStorage.setItem('cookie-consent-date', new Date().toISOString())
      
      // Keep consent denied
      updateConsent('denied', 'denied')
      
      // Clear any existing tracking cookies
      clearTrackingCookies()
      
      // Track decline event via GTM (essential functionality still works)
      setTimeout(() => {
        window.dataLayer?.push({
          'event': 'cookie_consent_denied',
          'consent_method': 'banner_decline',
          'business_type': 'technology_company'
        })
      }, 500)
      
      setShowBanner(false)
    } catch (error) {
      console.error('Error declining cookies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to reset consent (for testing or user preference changes)
  const resetConsent = () => {
    localStorage.removeItem('cookie-consent')
    localStorage.removeItem('cookie-consent-date')
    localStorage.removeItem('consent-business-type')
    clearTrackingCookies()
    setShowBanner(true)
  }

  // Add reset function to window for testing
  useEffect(() => {
    ;(window as any).resetCookieConsent = resetConsent
  }, [])

  if (!showBanner) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
      
      {/* Cookie Banner */}
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-lg mx-auto md:left-8 md:right-auto md:max-w-md">
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl animate-slide-in-bottom">
          
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="text-2xl flex-shrink-0">🍪</div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">We Value Your Privacy</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                We use cookies to enhance your experience, analyze site traffic, and understand how our 
                automation solutions can best serve your business needs.
              </p>
            </div>
          </div>

          {/* Cookie Types Info */}
          <div className="mb-4 text-xs text-gray-400 bg-gray-800/50 rounded-lg p-3">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Essential cookies
                </span>
                <span className="text-green-400 font-medium">Always active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Analytics cookies
                </span>
                <span className="text-gray-300">Help us improve</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Marketing cookies
                </span>
                <span className="text-gray-300">Better targeting</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={acceptCookies}
              disabled={isLoading}
              className={`flex-1 font-medium py-3 px-4 rounded-lg transition-all text-sm ${
                isLoading 
                  ? 'bg-gray-600 cursor-not-allowed' 
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

          {/* Links - Updated to include Data Deletion Policy */}
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
    </>
  )
}