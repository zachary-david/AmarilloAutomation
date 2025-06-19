/// app/components/Navigation.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/solutions', label: 'Solutions' },
    { href: '/market-survey', label: 'Market Survey' }, // Updated from 'Demo'
    { href: '/contact', label: 'Contact' }
  ]

  const handleNavClick = (href: string, label: string) => {
    // Track navigation clicks
    window.dataLayer?.push({
      event: 'navigation_click',
      link_text: label,
      link_url: href,
      current_page: pathname
    })
    
    setIsOpen(false)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold text-white hover:text-amber-400 transition-colors"
            onClick={() => handleNavClick('/', 'Logo')}
          >
            Amarillo Automation
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavClick(item.href, item.label)}
                className={`px-3 py-2 text-sm font-medium transition-colors hover:text-amber-400 ${
                  pathname === item.href
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-gray-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/95 backdrop-blur-md rounded-lg mt-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.href, item.label)}
                  className={`block px-3 py-2 text-base font-medium transition-colors hover:text-amber-400 ${
                    pathname === item.href
                      ? 'text-amber-400 bg-amber-400/10'
                      : 'text-gray-300'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}