// app/components/GoogleTagManager.tsx
'use client'

import { useEffect } from 'react'
import Script from 'next/script'

interface GTMProps {
  gtmId: string
}

// Main GTM Component
export default function GoogleTagManager({ gtmId }: GTMProps) {
  return (
    <Script
      id="gtm-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');`,
      }}
    />
  )
}

// NoScript Fallback Component
export function GTMNoScript({ gtmId }: GTMProps) {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}

// Event Tracking Helper Functions
export const GTMEvents = {
  // AI Demo Service Tracking (Product Video Generator)
  trackDemoStart: () => {
    window.dataLayer?.push({
      event: 'demo_start',
      demo_type: 'ai_video_generator',
      service_category: 'ai_agents',
      page_section: 'demo_page'
    })
  },

  trackDemoSubmission: (formData: any) => {
    window.dataLayer?.push({
      event: 'demo_submission',
      demo_type: 'ai_video_generator',
      service_category: 'ai_agents',
      file_type: formData.fileType,
      engagement_level: 'high'
    })
  },

  trackDemoCompletion: (videoData: any) => {
    window.dataLayer?.push({
      event: 'demo_completion',
      demo_type: 'ai_video_generator',
      service_category: 'ai_agents',
      video_duration: videoData.duration,
      success: true,
      conversion_value: 30 // AI demo value
    })
  },

  // Contact & Lead Tracking for Business Services
  trackContactFormStart: (formType: string) => {
    window.dataLayer?.push({
      event: 'form_start',
      form_name: formType,
      form_location: window.location.pathname,
      lead_intent: 'service_inquiry',
      business_type: 'workflow_automation'
    })
  },

  trackContactSubmission: (formData: any) => {
    window.dataLayer?.push({
      event: 'contact_submission',
      form_name: formData.formType,
      service_interest: formData.serviceType,
      company_size: formData.companySize,
      project_urgency: formData.urgency,
      conversion_value: 60 // Business service inquiry value
    })
  },

  // Emergency/Urgent Project Support Tracking
  trackUrgentProject: (contactMethod: string) => {
    window.dataLayer?.push({
      event: 'urgent_project_contact',
      contact_method: contactMethod,
      urgency: 'high',
      service_type: 'consulting',
      conversion_value: 100 // High-value urgent project
    })
  },

  // Service Interest Tracking for Your 5 Core Services
  trackServiceInterest: (serviceName: string, engagementType: string) => {
    window.dataLayer?.push({
      event: 'service_interest',
      service_type: serviceName, // workflow_automation, tech_integration, ai_agents, lead_generation, web_development
      engagement_type: engagementType,
      page_location: window.location.pathname,
      business_vertical: 'automation_consulting'
    })
  },

  // Scroll & Engagement Tracking
  trackScrollDepth: (scrollPercent: number) => {
    window.dataLayer?.push({
      event: 'scroll',
      scroll_depth: scrollPercent,
      page_title: document.title,
      engagement_level: scrollPercent > 75 ? 'high' : scrollPercent > 50 ? 'medium' : 'low'
    })
  },

  // CTA Button Tracking
  trackCTAClick: (ctaText: string, ctaLocation: string) => {
    window.dataLayer?.push({
      event: 'cta_click',
      cta_text: ctaText,
      cta_location: ctaLocation,
      page_section: ctaLocation
    })
  },

  // Geographic Tracking (for local business focus)
  trackLocationInterest: (locationType: string) => {
    window.dataLayer?.push({
      event: 'location_interest',
      location_type: locationType, // 'local', 'regional', 'texas'
      service_area: 'west_texas'
    })
  }
}

// Scroll depth tracking hook
export function useScrollTracking() {
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    const trackedDepths = new Set<number>()

    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        )

        // Track at 25%, 50%, 75%, 100% milestones
        const milestones = [25, 50, 75, 100]
        const milestone = milestones.find(m => scrollPercent >= m && !trackedDepths.has(m))

        if (milestone) {
          trackedDepths.add(milestone)
          GTMEvents.trackScrollDepth(milestone)
        }
      }, 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])
}