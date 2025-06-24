// app/layout.tsx - Updated Metadata & Schema with Facebook SDK
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import GoogleTagManager, { GTMNoScript } from './components/GoogleTagManager'
import CookieBanner from './components/CookieBanner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Amarillo Automation - AI-Powered Digital Marketing & Business Automation',
    template: '%s | Amarillo Automation'
  },
  description: 'AI-powered digital marketing agency specializing in workflow automation, tech integration, AI agents, lead generation, and web development. Transform your business with intelligent automation solutions.',
  keywords: [
    'workflow automation',
    'tech integration', 
    'AI agents chatbots',
    'lead generation systems',
    'web development',
    'business automation consulting',
    'AI marketing agency',
    'digital marketing automation',
    'automated marketing systems',
    'intelligent business solutions',
    'Amarillo digital marketing',
    'Texas AI agency',
    'SaaS automation',
    'marketing AI tools',
    'business process automation'
  ],
  authors: [{ name: 'Amarillo Automation' }],
  creator: 'Amarillo Automation',
  publisher: 'Amarillo Automation',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://amarilloautomation.com',
    siteName: 'Amarillo Automation',
    title: 'Amarillo Automation - AI-Powered Digital Marketing & Business Automation',
    description: 'Transform your business with AI-powered marketing automation, intelligent lead generation, and cutting-edge workflow solutions. Expert AI consultants serving Texas businesses.',
    images: [
      {
        url: '/og-image-ai-agency.jpg',
        width: 1200,
        height: 630,
        alt: 'Amarillo Automation - AI-Powered Digital Marketing Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amarillo Automation - AI Marketing & Business Automation',
    description: 'AI-powered digital marketing agency specializing in automated lead generation and intelligent business workflows.',
    images: ['/og-image-ai-agency.jpg'],
  },
  verification: {
    // Add your verification codes when available
    // google: 'google-verification-code',
  },
  category: 'Digital Marketing Technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <GoogleTagManager gtmId="GTM-KR6QDVHS" />
        
        {/* Facebook SDK for JavaScript */}
        <Script
          id="facebook-sdk"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.fbAsyncInit = function() {
                FB.init({
                  appId      : '1277149313746470',
                  cookie     : true,
                  xfbml      : true,
                  version    : 'v23.0'
                });
                  
                FB.AppEvents.logPageView();   
                  
              };
              (function(d, s, id){
                 var js, fjs = d.getElementsByTagName(s)[0];
                 if (d.getElementById(id)) {return;}
                 js = d.createElement(s); js.id = id;
                 js.src = "https://connect.facebook.net/en_US/sdk.js";
                 fjs.parentNode.insertBefore(js, fjs);
               }(document, 'script', 'facebook-jssdk'));
            `
          }}
        />
        
        {/* Google Analytics 4 Configuration */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', {
              page_title: document.title,
              page_location: window.location.href,
              custom_map: {
                'custom_parameter_1': 'business_vertical',
                'custom_parameter_2': 'service_offering',
                'custom_parameter_3': 'lead_quality'
              }
            });
          `}
        </Script>
        
        {/* Updated Structured Data for Digital Marketing + AI Agency */}
        <Script
          id="structured-data-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "DigitalMarketingAgency",
              "name": "Amarillo Automation",
              "alternateName": "Amarillo Automation AI Agency",
              "url": "https://amarilloautomation.com",
              "logo": "https://amarilloautomation.com/logo.png",
              "description": "AI-powered digital marketing agency specializing in business automation, intelligent lead generation, and workflow optimization for growing businesses.",
              "foundingDate": "2024",
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
                  "@type": "Place",
                  "name": "Texas Panhandle"
                },
                {
                  "@type": "Place",
                  "name": "Southwest United States"
                }
              ],
              "serviceType": [
                "Workflow Automation",
                "Tech Integration", 
                "AI Agents & Chatbots",
                "Lead Generation Systems",
                "Web Development",
                "Business Automation Consulting"
              ],
              "industry": [
                "Digital Marketing",
                "Artificial Intelligence",
                "Marketing Technology",
                "Business Automation",
                "SaaS Solutions"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "admin@amarilloautomation.com",
                "availableLanguage": "English",
                "serviceArea": {
                  "@type": "Place",
                  "name": "Texas"
                }
              },
              "sameAs": [
                // Add your social media profiles when available
                // "https://linkedin.com/company/amarillo-automation",
                // "https://twitter.com/amarilloauto"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "AI Marketing & Automation Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Workflow Automation",
                      "description": "Streamline your business operations with intelligent workflow automation that eliminates manual tasks and reduces errors"
                    }
                  },
                  {
                    "@type": "Offer", 
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Tech Integration",
                      "description": "Seamlessly connect your business systems and tools for improved efficiency and data flow"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service", 
                      "name": "AI Agents & Chatbots",
                      "description": "Custom AI assistants and chatbots that handle customer service, lead qualification, and business operations 24/7"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Lead Generation Systems",
                      "description": "Automated lead capture, nurturing, and conversion systems that consistently generate qualified prospects"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Web Development",
                      "description": "Professional websites with built-in automation, lead capture, and conversion optimization"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Business Automation Consulting",
                      "description": "Strategic consultation to identify automation opportunities and develop implementation roadmaps"
                    }
                  }
                ]
              }
            })
          }}
        />

        {/* Local Business Schema for Geographic Targeting */}
        <Script
          id="structured-data-local"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://amarilloautomation.com/#business",
              "name": "Amarillo Automation",
              "image": "https://amarilloautomation.com/logo.png",
              "telephone": "", // Add when available
              "email": "admin@amarilloautomation.com",
              "url": "https://amarilloautomation.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Amarillo",
                "addressRegion": "Texas",
                "addressCountry": "United States"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "35.2219971", // Amarillo coordinates
                "longitude": "-101.8312969"
              },
              "openingHours": "Mo-Fr 09:00-17:00",
              "priceRange": "$$",
              "currenciesAccepted": "USD",
              "paymentAccepted": [
                "Cash",
                "Credit Card", 
                "Check",
                "Invoice"
              ],
              "category": [
                "Digital Marketing Agency",
                "AI Consultancy",
                "Business Automation",
                "Marketing Technology"
              ]
            })
          }}
        />

        {/* Service Schema for SEO */}
        <Script
          id="structured-data-services"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Service",
                  "name": "Workflow Automation",
                  "provider": {
                    "@type": "Organization",
                    "name": "Amarillo Automation"
                  },
                  "description": "Intelligent workflow automation that eliminates repetitive tasks, reduces errors, and streamlines business operations for maximum efficiency.",
                  "serviceType": "Business Process Automation",
                  "areaServed": {
                    "@type": "State",
                    "name": "Texas"
                  }
                },
                {
                  "@type": "Service",
                  "name": "Tech Integration",
                  "provider": {
                    "@type": "Organization", 
                    "name": "Amarillo Automation"
                  },
                  "description": "Seamless integration of business systems, software, and tools to create unified workflows and improve data accessibility.",
                  "serviceType": "Technology Integration Services"
                },
                {
                  "@type": "Service",
                  "name": "AI Agents & Chatbots",
                  "provider": {
                    "@type": "Organization",
                    "name": "Amarillo Automation"
                  },
                  "description": "Custom AI assistants, chatbots, and virtual agents that handle customer service, lead qualification, and business operations around the clock.",
                  "serviceType": "AI Development Services"
                },
                {
                  "@type": "Service",
                  "name": "Lead Generation Systems", 
                  "provider": {
                    "@type": "Organization",
                    "name": "Amarillo Automation"
                  },
                  "description": "Automated lead capture, nurturing, and conversion systems that consistently generate qualified prospects and drive business growth.",
                  "serviceType": "Digital Marketing Automation"
                },
                {
                  "@type": "Service",
                  "name": "Web Development", 
                  "provider": {
                    "@type": "Organization",
                    "name": "Amarillo Automation"
                  },
                  "description": "Professional websites with built-in automation features, lead capture systems, and conversion optimization to maximize online presence.",
                  "serviceType": "Web Development Services"
                },
                {
                  "@type": "Service",
                  "name": "Business Automation Consulting", 
                  "provider": {
                    "@type": "Organization",
                    "name": "Amarillo Automation"
                  },
                  "description": "Strategic consultation to identify automation opportunities, develop implementation roadmaps, and optimize business processes.",
                  "serviceType": "Business Consulting Services"
                }
              ]
            })
          }}
        />

        {/* FAQ Schema for Common Questions */}
        <Script
          id="structured-data-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is workflow automation and how can it help my business?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Workflow automation uses technology to automatically handle repetitive business tasks like scheduling, data entry, follow-ups, and customer communications. It can save hours per week, reduce errors, and ensure consistent processes across your organization."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do AI agents and chatbots work for small businesses?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "AI agents are virtual assistants trained on your business information that can handle customer questions, qualify leads, schedule appointments, and provide support 24/7. They integrate with your existing systems and learn from your business data to provide accurate, helpful responses."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What types of systems can you integrate with my current business tools?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We specialize in connecting popular business tools like CRMs (Salesforce, HubSpot), accounting software (QuickBooks), email platforms (Gmail, Outlook), scheduling tools (Calendly), and e-commerce systems. Our integrations ensure data flows seamlessly between all your business applications."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How quickly can I see results from automated lead generation?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most clients see improved lead capture within 2-4 weeks of implementation. Automated follow-up systems typically increase response rates by 30-50%, while AI-powered lead qualification can identify high-value prospects 3x faster than manual processes."
                  }
                },
                {
                  "@type": "Question", 
                  "name": "Do I need technical expertise to manage these automation systems?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No technical expertise required. We design user-friendly systems with simple dashboards and provide complete training for your team. Our automation solutions are built to work in the background while giving you easy controls for monitoring and adjustments."
                  }
                },
                {
                  "@type": "Question", 
                  "name": "What's the difference between a consultation and full implementation?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A consultation involves analyzing your current processes, identifying automation opportunities, and creating an implementation roadmap. Full implementation includes building, testing, and deploying the automated systems, plus training and ongoing support to ensure success."
                  }
                }
              ]
            })
          }}
        />

        {/* Vanta.js Scripts */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} bg-slate-900`}>
        <GTMNoScript gtmId="GTM-KR6QDVHS" />
        <CookieBanner />
        {children}
      </body>
    </html>
  )
}