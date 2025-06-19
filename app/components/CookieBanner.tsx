// app/components/CookieBanner.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Google Analytics helper functions
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
    
    // Always initialize GA with consent mode
    initializeGoogleAnalytics()
    
    if (!hasConsented) {
      // Show banner after a brief delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    } else if (hasConsented === 'accepted') {
      // If previously accepted, grant consent
      setTimeout(() => {
        window.gtag?.('consent', 'update', {
          'analytics_storage': 'granted',
          'ad_storage': 'granted'
        })
      }, 500)
    } else if (hasConsented === 'declined') {
      // If previously declined, keep consent denied
      setTimeout(() => {
        window.gtag?.('consent', 'update', {
          'analytics_storage': 'denied',
          'ad_storage': 'denied'
        })
      }, 500)
    }
  }, [])

  const initializeGoogleAnalytics = () => {
    const GA_MEASUREMENT_ID = 'G-8KX0BFBD36'
    
    // Load Google Analytics script
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script1)

    // Initialize gtag with consent mode
    window.dataLayer = window.dataLayer || []
    window.gtag = function() {
      window.dataLayer.push(arguments)
    }
    
    // Configure consent mode first
    window.gtag('consent', 'default', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied',
      'wait_for_update': 500
    })
    
    window.gtag('js', new Date())
    window.gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true, // GDPR compliance
      cookie_flags: 'secure;samesite=strict' // Enhanced security
    })

    console.log('Google Analytics initialized with consent mode')
  }

  const disableAllTracking = () => {
    // Disable Google Analytics tracking
    window.gtag?.('consent', 'update', {
      'analytics_storage': 'denied'
    })
    
    // Clear any existing GA cookies
    const gaCookies = document.cookie.split(';').filter(cookie => 
      cookie.trim().startsWith('_ga') || cookie.trim().startsWith('_gid')
    )
    
    gaCookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim()
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    })

    console.log('Tracking disabled and cookies cleared')
  }

  const acceptCookies = async () => {
    setIsLoading(true)
    
    try {
      // Save consent
      localStorage.setItem('cookie-consent', 'accepted')
      localStorage.setItem('cookie-consent-date', new Date().toISOString())
      
      // Initialize Google Analytics if not already done
      if (!window.gtag) {
        initializeGoogleAnalytics()
      }
      
      // Update GTM consent - grant analytics and ad storage
      window.gtag?.('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted'
      })
      
      // Track the consent event
      setTimeout(() => {
        window.gtag?.('event', 'cookie_consent', {
          event_category: 'engagement',
          event_label: 'accepted',
          consent_analytics: 'granted',
          consent_ads: 'granted'
        })
      }, 1000)
      
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
      // Save decline
      localStorage.setItem('cookie-consent', 'declined')
      localStorage.setItem('cookie-consent-date', new Date().toISOString())
      
      // Initialize GA with consent mode (if not already initialized)
      if (!window.gtag) {
        initializeGoogleAnalytics()
      }
      
      // Keep GTM consent denied for analytics and ads
      window.gtag?.('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied'
      })
      
      // Disable additional tracking
      disableAllTracking()
      
      // Track decline event (this will still work with essential cookies)
      setTimeout(() => {
        window.gtag?.('event', 'cookie_consent', {
          event_category: 'engagement',
          event_label: 'declined',
          consent_analytics: 'denied',
          consent_ads: 'denied'
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
                We use cookies to enhance your browsing experience, analyze site traffic, and provide analytics. 
                By clicking "Accept All", you consent to our use of cookies including Google Analytics.
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
                  Analytics cookies (Google Analytics)
                </span>
                <span className="text-gray-300">Your choice</span>
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

          {/* Links */}
          <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3 text-center">
            <Link 
              href="/privacy-policy" 
              className="text-blue-400 hover:text-blue-300 text-xs transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms-conditions" 
              className="text-blue-400 hover:text-blue-300 text-xs transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>

          {/* Debug info (remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-500">
              <p>Debug: Run <code>resetCookieConsent()</code> in console to test banner</p>
            </div>
          )}

        </div>
      </div>
    </>
  )
}