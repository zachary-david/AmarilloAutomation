import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Amarillo Automation - AI Integration Solutions',
    template: '%s | Amarillo Automation'
  },
  description: 'Expert automation and tech integration services. 24/7 support, enterprise solutions, and cutting-edge technology for your business. Intelligent integrations and AI-powered automations to simplify your business and supercharge growth.',
  keywords: 'automation, AI, artificial intelligence, AI bots, chat bots, lead generation, marketing, agency, business automation, tech integration, product video generator',
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
    title: 'Amarillo Automation - AI Integration Solutions',
    description: 'Expert automation and tech integration services. 24/7 support, enterprise solutions, and cutting-edge technology for your business.',
    images: [
      {
        url: '/og-image.jpg', // You'll need to add this image to your public folder
        width: 1200,
        height: 630,
        alt: 'Amarillo Automation - AI Integration Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amarillo Automation - AI Integration Solutions',
    description: 'Expert automation and tech integration services. 24/7 support, enterprise solutions, and cutting-edge technology for your business.',
    images: ['/og-image.jpg'], // Same image as OpenGraph
  },
  verification: {
    // Add your verification codes here when you have them
    // google: 'google-verification-code',
    // yandex: 'yandex-verification-code',
    // yahoo: 'yahoo-verification-code',
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
        <Script 
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
          strategy="beforeInteractive"
        />
        <Script 
          src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-[#0a1224] font-inter relative overflow-x-hidden`}>
        {children}
        <Footer />
        <CookieBanner />
      </body>
    </html>
  )
}