// app/layout.tsx - Updated Metadata & Schema with Dual-Track Strategy
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import GoogleTagManager, { GTMNoScript } from './components/GoogleTagManager'
import CookieBanner from './components/CookieBanner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Amarillo Automation - Marketing Profit Optimization + AI Search Domination',
    template: '%s | Amarillo Automation'
  },
  description: 'The only West Texas marketing consultancy that guarantees profitable campaigns within 90 days AND positions you to dominate AI search before competitors know it exists. We transform contractors from "lead buyers" into "profit generators" while securing tomorrow\'s market position.',
  
  keywords: [
    'marketing profit optimization',
    'guaranteed marketing ROI',
    'marketing waste elimination',
    'lead conversion improvement',
    '90 day profit guarantee',
    'stop wasting marketing dollars',
      'marketing intelligence system',
    'automated lead tracking',
    'revenue attribution mapping',
    'marketing automation consultant',
    'CRM integration specialist',
    'workflow automation expert',
    'AI search optimization',
    'ChatGPT business visibility',
    'future-proof marketing strategy',
    'AI search positioning',
    'LLM content optimization',
    'AI search domination',
    'traditional and AI search marketing',
    'dual-channel marketing strategy',
    'current profit future positioning',
    'marketing profit and AI visibility',
    'today and tomorrow marketing',
    'Amarillo marketing consultant',
    'West Texas automation specialist',
    'contractor marketing optimization',
    'home services lead generation',
    'plumber marketing systems',
    'HVAC marketing automation',
    'marketing consultant with guarantee',
    'profit within 90 days',
    'AI search within 60 days',
    'marketing profit and future protection',
    'eliminate marketing waste today'
  ],
  
  authors: [{ name: 'Amarillo Automation - Marketing Profit Specialists' }],
  creator: 'Amarillo Automation',
  publisher: 'Amarillo Automation',
  
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
    googleBot: {
      index: true,
      follow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
    },
  },
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://amarilloautomation.com',
    siteName: 'Amarillo Automation',
    title: 'Stop Wasting Marketing Dollars + Dominate AI Search | Amarillo Automation',
    description: 'We guarantee your marketing will be profitable within 90 days AND position you to dominate AI search before competitors know it exists. The only consultancy solving today\'s problems while securing tomorrow\'s market.',
    images: [
      {
        url: '/og-image-ai-agency.jpg',
        width: 1200,
        height: 630,
        alt: 'Amarillo Automation - Marketing Profit Optimization and AI Search Domination',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Guaranteed Profitable Marketing + AI Search Domination | Amarillo Automation',
    description: 'Transform from "lead buyer" to "profit generator" in 90 days. Plus: AI search positioning before competitors catch up. The dual-track advantage.',
    images: ['/og-image-ai-agency.jpg'],
  },
  
  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
    // bing: 'your-bing-verification-code',
  },
  
  category: 'Marketing Profit Optimization & Future Strategy',
  
  alternates: {
    canonical: 'https://amarilloautomation.com',
  },
  
  applicationName: 'Amarillo Automation',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'dark',
  themeColor: '#10b981',
  
  other: {
    'business-model': 'dual-track-marketing-consultancy',
    'unique-value-proposition': 'guaranteed-profit-plus-ai-positioning',
    'service-guarantee': '90-day-profit-60-day-ai-visibility',
    'target-market': 'home-services-contractors-3k-plus-monthly-spend',
    'competitive-advantage': 'only-consultancy-guaranteeing-both-channels',
    'service-area': 'west-texas-primary-regional-expansion-planned',
    'revenue-model': 'diversified-traditional-plus-ai-services'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <GoogleTagManager gtmId="GTM-KR6QDVHS" />
        
        <Script
          id="facebook-sdk"
          strategy="afterInteractive"
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
        
        <Script
          id="structured-data-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MarketingConsultancy",
              "name": "Amarillo Automation",
              "alternateName": "Amarillo Automation - Marketing Profit Optimization",
              "url": "https://amarilloautomation.com",
              "logo": "https://amarilloautomation.com/logo.png",
              "description": "The only West Texas marketing consultancy that guarantees profitable campaigns within 90 days AND positions businesses to dominate AI search before competitors know it exists.",
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
                "Marketing Profit Optimization",
                "AI Search Positioning", 
                "Marketing Waste Elimination",
                "Lead Conversion Improvement",
                "Dual-Channel Marketing Strategy",
                "Revenue Attribution Mapping"
              ],
              "industry": [
                "Marketing Consulting",
                "AI Search Optimization",
                "Marketing Technology",
                "Business Automation",
                "Profit Optimization"
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
                "name": "Dual-Track Marketing Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Marketing Profit Audit",
                      "description": "Complete marketing health check plus AI search readiness assessment. Find the $10K+ you're losing every month.",
                      "offers": {
                        "@type": "Offer",
                        "price": "1497",
                        "priceCurrency": "USD"
                      }
                    }
                  },
                  {
                    "@type": "Offer", 
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Marketing Intelligence System",
                      "description": "Your marketing profit dashboard plus AI search monitoring across 5 platforms.",
                      "offers": {
                        "@type": "Offer",
                        "price": "397",
                        "priceCurrency": "USD",
                        "billingDuration": "P1M"
                      }
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service", 
                      "name": "Managed Marketing Operations",
                      "description": "Your outsourced marketing department plus AI search strategy. We manage your marketing like it's our own money.",
                      "offers": {
                        "@type": "Offer",
                        "price": "2497",
                        "priceCurrency": "USD",
                        "billingDuration": "P1M"
                      }
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "AI Search Domination",
                      "description": "Complete AI search management plus traditional search protection. Own your market in the AI search era.",
                      "offers": {
                        "@type": "Offer",
                        "price": "1297",
                        "priceCurrency": "USD",
                        "billingDuration": "P1M"
                      }
                    }
                  }
                ]
              }
            })
          }}
        />

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
              "telephone": "",
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
                "latitude": "35.2219971",
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
                "Marketing Consultant",
                "AI Search Specialist",
                "Profit Optimization",
                "Dual-Channel Marketing"
              ]
            })
          }}
        />

        <Script
          id="structured-data-services"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Service",
                  "name": "Marketing Profit Optimization",
                  "provider": {
                    "@type": "Organization",
                    "name": "Amarillo Automation"
                  },
                  "description": "Guaranteed profitable marketing within 90 days. We eliminate waste, optimize conversions, and track every dollar of ROI.",
                  "serviceType": "Marketing Consulting",
                  "areaServed": {
                    "@type": "State",
                    "name": "Texas"
                  }
                },
                {
                  "@type": "Service",
                  "name": "AI Search Positioning",
                  "provider": {
                    "@type": "Organization", 
                    "name": "Amarillo Automation"
                  },
                  "description": "Position your business to dominate AI search results before competitors know it exists. Future-proof your market visibility.",
                  "serviceType": "AI Search Optimization"
                },
                {
                  "@type": "Service",
                  "name": "Dual-Channel Marketing Strategy",
                  "provider": {
                    "@type": "Organization",
                    "name": "Amarillo Automation"
                  },
                  "description": "The only consultancy that guarantees success across both traditional marketing and AI search channels.",
                  "serviceType": "Strategic Marketing Consulting"
                },
                {
                  "@type": "Service",
                  "name": "Marketing Intelligence Systems", 
                  "provider": {
                    "@type": "Organization",
                    "name": "Amarillo Automation"
                  },
                  "description": "Automated tracking and attribution systems that show exactly which marketing dollars make you money.",
                  "serviceType": "Marketing Technology Implementation"
                }
              ]
            })
          }}
        />

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
                  "name": "How can you guarantee profitable marketing within 90 days?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We start with a complete marketing audit to identify waste and optimization opportunities. Most contractors are losing $10K+ monthly on ineffective campaigns. We eliminate the waste, improve conversions, and track every dollar. If you're not profitable within 90 days, we work for free until you are."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is AI search and why should I care about it now?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "58% of consumers now use AI tools like ChatGPT for recommendations instead of Google. When someone asks AI 'who's the best plumber near me,' you want to be the answer. We position you in AI search results before your competitors even know this shift is happening."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can you help with both traditional marketing AND AI search?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes - we're the only consultancy offering both. We optimize your current marketing for immediate profit while positioning you for AI search domination. You get results today plus protection for tomorrow's market changes."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How quickly will I see AI search results?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "AI search visibility typically improves within 60 days. We track your mentions across ChatGPT, Perplexity, Google AI, and other platforms. Most clients see 50%+ increase in AI mentions within the first 2 months."
                  }
                },
                {
                  "@type": "Question", 
                  "name": "What if my competitors start doing AI search optimization too?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "That's exactly why we're moving now. We have a 12-18 month window before most competitors recognize this shift. Early movers in AI search will dominate their local markets for years, just like early Google SEO adopters did."
                  }
                },
                {
                  "@type": "Question", 
                  "name": "Do I need to choose between traditional marketing and AI search?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely not. Traditional marketing still drives most leads today. AI search is growing rapidly but isn't replacing traditional channels yet. Our dual-track approach ensures you capture both markets as they develop."
                  }
                }
              ]
            })
          }}
        />

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