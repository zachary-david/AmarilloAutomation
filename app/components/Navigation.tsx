// app/components/Navigation.tsx - Simplified for home page only launch
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // SIMPLIFIED: Only showing Home for initial launch
  // TODO: Add back other pages when ready to expand
  const navItems = [
    { href: '/', label: 'Home' },
    // HIDDEN FOR LAUNCH:
    // { href: '/solutions', label: 'Solutions' },
    // { href: '/intro-offer', label: '⚡ Introductory Offer', isSpecial: true },
    // { href: '/contact', label: 'Contact' },
  ]

  // Contact info for header (since contact page is hidden)
  const contactInfo = {
    email: 'admin@amarilloautomation.com',
    phone: '+1 (806) 640-4586' // Replace with your actual phone number
  }

  return (
    <nav className="relative z-20 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Brand */}
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
            Amarillo Automation
          </Link>
          
          {/* Desktop Navigation - Simplified */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Items (currently just Home) */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-blue-400 bg-blue-900/20'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Contact Info */}
            <div className="flex items-center space-x-6 text-sm">
              <a 
                href={`mailto:${contactInfo.email}`}
                className="text-gray-300 hover:text-blue-400 transition-colors flex items-center space-x-2"
                onClick={() => {
                  // Track email clicks
                  if (typeof window !== 'undefined' && window.dataLayer) {
                    window.dataLayer.push({
                      event: 'contact_click',
                      contact_method: 'email',
                      click_location: 'header_navigation'
                    })
                  }
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{contactInfo.email}</span>
              </a>
              
              <a 
                href={`tel:${contactInfo.phone}`}
                className="text-gray-300 hover:text-green-400 transition-colors flex items-center space-x-2"
                onClick={() => {
                  // Track phone clicks
                  if (typeof window !== 'undefined' && window.dataLayer) {
                    window.dataLayer.push({
                      event: 'contact_click',
                      contact_method: 'phone',
                      click_location: 'header_navigation'
                    })
                  }
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{contactInfo.phone}</span>
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white p-2"
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-gray-800/95 backdrop-blur-sm rounded-lg mt-2 p-4">
            {/* Navigation Items */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-blue-400 bg-blue-900/20'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Contact Info */}
            <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
              <a 
                href={`mailto:${contactInfo.email}`}
                className="flex items-center px-3 py-2 text-gray-300 hover:text-blue-400 transition-colors"
                onClick={() => {
                  setIsOpen(false)
                  // Track mobile email clicks
                  if (typeof window !== 'undefined' && window.dataLayer) {
                    window.dataLayer.push({
                      event: 'contact_click',
                      contact_method: 'email',
                      click_location: 'mobile_navigation'
                    })
                  }
                }}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </a>
              
              <a 
                href={`tel:${contactInfo.phone}`}
                className="flex items-center px-3 py-2 text-gray-300 hover:text-green-400 transition-colors"
                onClick={() => {
                  setIsOpen(false)
                  // Track mobile phone clicks
                  if (typeof window !== 'undefined' && window.dataLayer) {
                    window.dataLayer.push({
                      event: 'contact_click',
                      contact_method: 'phone',
                      click_location: 'mobile_navigation'
                    })
                  }
                }}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Us
              </a>
            </div>
            
            {/* Coming Soon Notice */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm px-3">
                🚀 More pages coming soon! We're currently launching with our home page.
              </p>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

/* 
COMMENTED OUT FOR FUTURE USE:

When ready to expand, uncomment and add back these nav items:

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/solutions', label: 'Solutions' },
  { href: '/intro-offer', label: '⚡ Introductory Offer', isSpecial: true },
  { href: '/contact', label: 'Contact' },
]

Also consider adding:
- { href: '/_demo', label: 'Demo' }
- { href: '/about', label: 'About' }
- { href: '/case-studies', label: 'Case Studies' }
- { href: '/blog', label: 'Blog' }
*/