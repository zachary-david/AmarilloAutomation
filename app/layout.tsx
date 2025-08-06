// app/layout.tsx - Updated Metadata & Schema with Dual-Track Strategy
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import GoogleTagManager, { GTMNoScript } from './components/GoogleTagManager'
import CookieBanner from './components/CookieBanner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Amarillo Automation - Advanced Digital Advertising and Programmatic Solutions',
    template: '%s | Amarillo Automation'
  },
  description: 'Using tomorrow\'s tools today to help local businesses create simple solutions and digital marketing strategies.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  
  keywords: [
    'marketing profit optimization',
    'guaranteed marketing ROI',
    'marketing waste elimination',
    'lead conversion improvement',
    'Shopify Storefront',
    'Retail Inventory Management',
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
    'AI search',
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
    'marketing profit and future protection',
    'eliminate marketing waste today',
    'SEO',
    'search engine optimization',
    'local SEO',
    'Google My Business optimization',
    'website development',
    'web design',
    'responsive website design',
    'e-commerce website',
    'Shopify development',
    'WordPress development',
    'Google Ads',
    'Google AdWords',
    'Facebook Ads',
    'Instagram advertising',
    'social media advertising',
    'PPC management',
    'pay per click advertising',
    'display advertising',
    'retargeting ads',
    'remarketing campaigns',
    'Yelp optimization',
    'online directory listings',
    'business directory submission',
    'review management',
    'reputation management',
    'online reviews',
    'Google reviews',
    'customer review management',
    'social media marketing',
    'social media management',
    'Facebook marketing',
    'Instagram marketing',
    'LinkedIn marketing',
    'social media strategy',
    'content marketing',
    'social media posting',
    'email marketing',
    'email campaigns',
    'marketing automation',
    'CRM integration',
    'lead nurturing',
    'automated workflows',
    'customer relationship management',
    'sales funnel optimization',
    'Google Analytics',
    'conversion tracking',
    'website analytics',
    'marketing analytics',
    'ROI tracking',
    'performance monitoring',
    'lead tracking',
    'call tracking',
    'local business marketing',
    'small business marketing',
    'contractor marketing',
    'service business marketing',
    'local advertising',
    'neighborhood marketing',
    'community business promotion',
    'AI marketing',
    'AI search optimization',
    'ChatGPT visibility',
    'voice search optimization',
    'mobile marketing',
    'app development',
    'Amarillo marketing',
    'Texas marketing agency',
    'West Texas advertising',
    'Panhandle marketing services',
    'HVAC marketing',
    'plumbing marketing',
    'roofing marketing',
    'construction marketing',
    'home services marketing',
    'professional services marketing',
    'retail marketing',
    'restaurant marketing',
    'Zapier automation',
    'Make.com integration',
    'GoHighLevel setup',
    'HubSpot integration',
    'Salesforce automation',
    'QuickBooks integration',
    'Mailchimp automation',
    'Calendly integration',
    'Stripe payment integration',
    'PayPal integration',
    'ChatGPT for business',
    'Claude AI integration',
    'AI marketing tools',
    'AI automation',
    'Midjourney for marketing',
    'Canva AI design',
    'AI content creation',
    'AI customer service',
  ],
  
  authors: [{ name: 'Amarillo Automation' }],
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
    title: 'Advanced Digital Advertising and Programmatic Solutions',
    description: 'Using tomorrow\'s tools today to help local businesses create simple solutions and digital marketing strategies.',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Advanced Digital Advertising and Programmatic Solutions | Amarillo Automation',
    description: 'Using tomorrow\'s tools today to help local businesses create simple solutions and digital marketing strategies.',
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

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#10b981',
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
                  appId      : '577226632129353',
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
              "alternateName": "Amarillo Automation - Advanced Digital Marketing and Programmatic Solutions",
              "url": "https://amarilloautomation.com",
              "description": "Using tomorrow\'s tools today to help local businesses create simple solutions and digital marketing strategies.",
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
                    "text": "We start with a complete marketing audit to identify optimization opportunities. Most contractors are overpsending on ineffective advertising campaigns. We treat your business, brand, and marketing spend like our own."
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
                    "text": "Yes - We optimize your current marketing for immediate profit while positioning you for AI LLM visibility. You get results today plus protection for tomorrow's market changes."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How quickly will I see AI search results?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "AI search visibility typically improves within 60 days. It is important to note that this is still a changing landscape and results are not guaranteed -- But we feel good enough about our process and current results to offer it as a service."
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