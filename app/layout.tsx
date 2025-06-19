import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import GoogleTagManager, { GTMNoScript } from './components/GoogleTagManager'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Amarillo Automation - Workflow Automation & AI Integration | Texas',
    template: '%s | Amarillo Automation'
  },
  description: 'Expert workflow automation, tech integration, and AI agents for business growth. Custom web development and lead generation solutions in Amarillo, Texas.',
  keywords: 'workflow automation, tech integration, AI agents, lead generation, web development, business automation, Amarillo Texas, digital transformation',
  authors: [{ name: 'Amarillo Automation' }],
  creator: 'Amarillo Automation',
  publisher: 'Amarillo Automation',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://amarilloautomation.com',
    siteName: 'Amarillo Automation',
    title: 'Amarillo Automation - Workflow Automation & AI Integration',
    description: 'Expert workflow automation, tech integration, and AI agents for business growth. Custom solutions in Amarillo, Texas.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Amarillo Automation - Industrial AI & Automation Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amarillo Automation - Workflow Automation & AI Integration',
    description: 'Expert workflow automation, tech integration, and AI agents for business growth. Custom solutions in Amarillo, Texas.',
    images: ['/og-image.jpg'],
  },
  verification: {
    // Add your verification codes when you have them
    // google: 'google-verification-code',
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager - Replace with your actual GTM ID */}
        <GoogleTagManager gtmId="GTM-KR6QDVHS" />
        
        {/* Structured Data for Local Business */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TechnologyCompany",
              "name": "Amarillo Automation",
              "url": "https://amarilloautomation.com",
              "logo": "https://amarilloautomation.com/logo.png",
              "description": "Workflow automation, tech integration, and AI agents for business growth in Amarillo, Texas.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Amarillo",
                "addressRegion": "TX",
                "addressCountry": "US"
              },
              "areaServed": [
                {
                  "@type": "State",
                  "name": "Texas"
                },
                {
                  "@type": "City", 
                  "name": "Amarillo"
                },
                {
                  "@type": "City",
                  "name": "Lubbock"
                }
              ],
              "serviceType": [
                "Workflow Automation",
                "Tech Integration", 
                "AI Agents",
                "Lead Generation",
                "Web Development"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "admin@amarilloautomation.com",
                "availableLanguage": "English"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Automation Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Workflow Automation Solutions"
                    }
                  },
                  {
                    "@type": "Offer", 
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Tech Integration Services"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service", 
                      "name": "AI Agents & Chatbots"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service", 
                      "name": "Lead Generation Systems"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service", 
                      "name": "Custom Web Development"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-[#0a1224] font-inter relative overflow-x-hidden`}>
        {/* GTM NoScript Fallback */}
        <GTMNoScript gtmId="GTM-KR6QDVHS" />

        {/* Three.js and Vanta scripts - Load after GTM */}
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
          strategy="beforeInteractive"
        />
        <Script 
          src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"
          strategy="beforeInteractive"
        />
        
        {children}
        <Footer />
        <CookieBanner />
      </body>
    </html>
  )
}