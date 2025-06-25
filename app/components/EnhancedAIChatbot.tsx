'use client'

import React, { useState, useRef, useEffect } from 'react'  
import { Bot, X, Send, Calendar, Phone, Video, Mail, Clock } from 'lucide-react'

interface Message {  
  id: string  
  role: 'user' | 'assistant'  
  content: string  
  timestamp: Date  
  type?: 'text' | 'selection' | 'booking' | 'followup'  
  options?: string[]  
  timeSlot?: {  
    date: string  
    time: string  
    type: 'video' | 'phone'  
  }  
  followupContext?: {  
    topic: string  
    industry: string  
    questionType: 'qualification' | 'engagement' | 'urgency'  
    context?: string  
  }  
}

interface BookingDetails {  
  name?: string  
  company?: string  
  email?: string  
  meetingType: 'video' | 'phone'  
  timeSlot: string  
}

interface Props {  
  isOpen: boolean  
  onClose: () => void  
}

// Analytics tracking interface  
interface ConversationAnalytics {  
  sessionId: string  
  startTime: Date  
  topicSelections: Array<{  
    topic: string  
    timestamp: Date  
    industry: string  
  }>  
  followupResponses: Array<{  
    question: string  
    response: string  
    timestamp: Date  
    questionType: 'qualification' | 'engagement' | 'urgency'  
  }>  
  dropOffPoint?: string  
  leadQualification: {  
    businessSize?: string  
    currentChallenges?: string[]  
    urgency?: 'high' | 'medium' | 'low'  
    budget?: string  
    timeframe?: string  
  }  
  engagementScore: number  
}

// Industry detection and conversation context  
interface ConversationContext {  
  detectedIndustry: 'hvac' | 'plumbing' | 'roofing' | 'contractor' | 'general'  
  confidence: number  
  mentionedServices: string[]  
  painPoints: string[]  
  currentTopic?: string  
  followupStage: number  
}

// Simulated available time slots (replace with actual Cal.com integration)  
const generateAvailableSlots = (): Array<{date: string, time: string}> => {  
  const slots: Array<{date: string, time: string}> = []  
  const now = new Date()  
    
  // Generate slots for the next 14 days  
  for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {  
    const date = new Date(now)  
    date.setDate(date.getDate() + dayOffset)  
      
    // Skip weekends  
    if (date.getDay() === 0 || date.getDay() === 6) continue  
      
    // Morning slots: 10 AM - 12 PM CST  
    const morningSlots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM']  
      
    // Afternoon slots: 1 PM - 3 PM CST  
    const afternoonSlots = ['1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM']  
      
    // Randomly select 2-3 available slots per day (simulating booked slots)  
    const allSlots = [...morningSlots, ...afternoonSlots]  
    const availableSlots = allSlots.filter(() => Math.random() > 0.4) // 60% availability  
      
    availableSlots.forEach(time => {  
      slots.push({  
        date: date.toISOString().split('T')[0],  
        time: time  
      })  
    })  
  }  
    
  return slots.slice(0, 10) // Return first 10 available slots  
}

// Analytics helper functions  
const generateSessionId = (): string => {  
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`  
}

const trackEvent = (analytics: ConversationAnalytics, eventType: string, data: any) => {  
  console.log(`[Analytics] ${eventType}:`, data)  
  // In production, send to your analytics service  
  // Example: amplitude.track(eventType, { sessionId: analytics.sessionId, ...data })  
}

const calculateEngagementScore = (analytics: ConversationAnalytics): number => {  
  let score = 0  
    
  // Topic selections (10 points each)  
  score += analytics.topicSelections.length * 10  
    
  // Follow-up responses (15 points each)  
  score += analytics.followupResponses.length * 15  
    
  // Qualification data (bonus points)  
  if (analytics.leadQualification.businessSize) score += 10  
  if (analytics.leadQualification.currentChallenges?.length) score += analytics.leadQualification.currentChallenges.length * 5  
  if (analytics.leadQualification.urgency) score += 20  
    
  // Time spent (1 point per minute, max 30)  
  const minutesSpent = Math.min(30, (Date.now() - analytics.startTime.getTime()) / 60000)  
  score += Math.round(minutesSpent)  
    
  return Math.min(100, score) // Cap at 100  
}

// Industry detection helper function  
const detectIndustry = (conversationText: string): 'hvac' | 'plumbing' | 'roofing' | 'contractor' | 'general' => {  
  const text = conversationText.toLowerCase()  
    
  if (text.includes('hvac') || text.includes('air conditioning') || text.includes('heating') ||   
      text.includes('ac repair') || text.includes('furnace') || text.includes('thermostat')) {  
    return 'hvac'  
  }  
  if (text.includes('plumb') || text.includes('pipe') || text.includes('drain') ||   
      text.includes('water heater') || text.includes('leak') || text.includes('sewer')) {  
    return 'plumbing'  
  }  
  if (text.includes('roof') || text.includes('shingle') || text.includes('gutter') ||   
      text.includes('storm damage') || text.includes('hail') || text.includes('leak')) {  
    return 'roofing'  
  }  
  if (text.includes('contractor') || text.includes('construction') || text.includes('remodel') ||   
      text.includes('repair') || text.includes('handyman') || text.includes('maintenance')) {  
    return 'contractor'  
  }  
  return 'general'  
}

// Enhanced follow-up question generation  
const getFollowUpQuestions = (topic: string, industry: string, stage: number): Array<{  
  question: string  
  type: 'qualification' | 'engagement' | 'urgency'  
  context: string  
}> => {  
  const followUps = {  
    Automation: {  
      hvac: [  
        { question: "What's eating up most of your time right now - customer follow-ups, scheduling, or something else?", type: 'qualification' as const, context: 'time_wasters' },  
        { question: "How many service calls are you handling per week right now?", type: 'qualification' as const, context: 'business_size' },  
        { question: "Are you losing leads because you can't respond fast enough, or is it more about follow-up?", type: 'urgency' as const, context: 'lead_issues' }  
      ],  
      plumbing: [  
        { question: "What percentage of your calls are emergencies versus planned maintenance?", type: 'qualification' as const, context: 'service_mix' },  
        { question: "How long does it typically take you to follow up on estimates right now?", type: 'engagement' as const, context: 'follow_up_time' },  
        { question: "Are you losing money on missed callbacks or is it more about new lead response?", type: 'urgency' as const, context: 'revenue_leaks' }  
      ],  
      roofing: [  
        { question: "What's your biggest challenge - managing storm leads or building consistent work between weather events?", type: 'qualification' as const, context: 'seasonal_challenges' },  
        { question: "How many estimates do you typically send out per month?", type: 'qualification' as const, context: 'business_volume' },  
        { question: "Are you struggling more with insurance paperwork or just staying organized with multiple projects?", type: 'engagement' as const, context: 'operational_pain' }  
      ],  
      contractor: [  
        { question: "What type of projects do you focus on - remodels, repairs, new construction, or a mix?", type: 'qualification' as const, context: 'project_types' },  
        { question: "How do you currently manage project updates and customer communication?", type: 'engagement' as const, context: 'communication_methods' },  
        { question: "Are you losing potential work because estimates take too long to follow up on?", type: 'urgency' as const, context: 'estimate_conversion' }  
      ],  
      general: [  
        { question: "What industry are you in, and what's the biggest time-waster in your daily operations?", type: 'qualification' as const, context: 'industry_pain' },  
        { question: "How many employees do you have, and are they spending too much time on administrative tasks?", type: 'qualification' as const, context: 'team_size' },  
        { question: "What's the one manual process that drives you crazy every week?", type: 'engagement' as const, context: 'manual_pain' }  
      ]  
    },  
    'Digital Marketing': {  
      hvac: [  
        { question: "What's your main source of new customers right now - referrals, Google, Facebook, or word of mouth?", type: 'qualification' as const, context: 'lead_sources' },  
        { question: "Do you have any idea what you're spending to get a new customer, or is that a mystery?", type: 'engagement' as const, context: 'customer_acquisition' },  
        { question: "Are you booked out, or do you need more consistent leads to keep busy?", type: 'urgency' as const, context: 'capacity_needs' }  
      ],  
      plumbing: [  
        { question: "How are people finding you when they have plumbing emergencies - Google search, your website, or referrals?", type: 'qualification' as const, context: 'emergency_discovery' },  
        { question: "What's your average job value, and are you attracting the right type of customers?", type: 'qualification' as const, context: 'customer_quality' },  
        { question: "Are you getting enough maintenance work, or is it mostly emergency calls?", type: 'engagement' as const, context: 'service_balance' }  
      ],  
      roofing: [  
        { question: "What's your average project value - are you doing mostly repairs or full replacements?", type: 'qualification' as const, context: 'project_value' },  
        { question: "How are you currently reaching homeowners who need roofing work?", type: 'engagement' as const, context: 'marketing_channels' },  
        { question: "Do you have enough qualified leads coming in, or are you spending too much time chasing low-quality prospects?", type: 'urgency' as const, context: 'lead_quality' }  
      ],  
      contractor: [  
        { question: "What's your average project size, and are you getting the type of work you want?", type: 'qualification' as const, context: 'project_preferences' },  
        { question: "How do most of your customers find you - referrals, online, or traditional advertising?", type: 'engagement' as const, context: 'discovery_methods' },  
        { question: "Are you booked out with work, or do you need more consistent leads?", type: 'urgency' as const, context: 'pipeline_health' }  
      ],  
      general: [  
        { question: "What's your main way of getting new customers right now, and is it working well enough?", type: 'qualification' as const, context: 'current_marketing' },  
        { question: "Do you know what it costs you to acquire a new customer, or is that unclear?", type: 'engagement' as const, context: 'marketing_metrics' },  
        { question: "Are you getting enough quality leads, or are you mostly competing on price?", type: 'urgency' as const, context: 'competitive_position' }  
      ]  
    },  
    'Web Development': {  
      hvac: [  
        { question: "How many service requests do you currently get through your website versus phone calls?", type: 'qualification' as const, context: 'web_conversion' },  
        { question: "When people have an AC emergency, can they easily request service through your website on mobile?", type: 'urgency' as const, context: 'emergency_booking' },  
        { question: "Are you happy with how your website represents your expertise, or does it need work?", type: 'engagement' as const, context: 'brand_representation' }  
      ],  
      plumbing: [  
        { question: "Do customers trust your website enough to call you for emergency plumbing, or are they going elsewhere?", type: 'urgency' as const, context: 'trust_factors' },  
        { question: "How well does your current website showcase why people should choose you over other plumbers?", type: 'engagement' as const, context: 'differentiation' },  
        { question: "Are you capturing leads effectively when people visit your site, or are they just browsing and leaving?", type: 'qualification' as const, context: 'lead_capture' }  
      ],  
      roofing: [  
        { question: "Does your website effectively showcase your work quality and help with insurance claims?", type: 'engagement' as const, context: 'portfolio_insurance' },  
        { question: "How many estimate requests do you get through your website per month?", type: 'qualification' as const, context: 'estimate_volume' },  
        { question: "Are you losing potential customers because your website doesn't build enough trust for high-value roofing projects?", type: 'urgency' as const, context: 'trust_conversion' }  
      ],  
      contractor: [  
        { question: "Does your website effectively show the quality of your work and help people understand your services?", type: 'engagement' as const, context: 'service_clarity' },  
        { question: "How many project inquiries do you typically get through your website?", type: 'qualification' as const, context: 'inquiry_volume' },  
        { question: "Are potential customers able to easily request estimates through your site, or is the process complicated?", type: 'urgency' as const, context: 'estimate_process' }  
      ],  
      general: [  
        { question: "Is your current website generating leads for your business, or is it just an online brochure?", type: 'qualification' as const, context: 'website_purpose' },  
        { question: "How important is online lead generation for your business growth?", type: 'engagement' as const, context: 'digital_priority' },  
        { question: "Are you losing potential customers because your website doesn't work well on mobile devices?", type: 'urgency' as const, context: 'mobile_issues' }  
      ]  
    },  
    'Advanced Analytics': {  
      hvac: [  
        { question: "Do you know which of your services are most profitable, or are you just tracking total revenue?", type: 'qualification' as const, context: 'profit_awareness' },  
        { question: "Can you tell which marketing efforts actually bring in your best customers?", type: 'engagement' as const, context: 'marketing_attribution' },  
        { question: "Are you making business decisions based on gut feel, or do you have solid data?", type: 'urgency' as const, context: 'decision_making' }  
      ],  
      plumbing: [  
        { question: "Do you know the lifetime value of your customers, or just what they pay per job?", type: 'qualification' as const, context: 'customer_value' },  
        { question: "Can you identify which types of jobs are most profitable when you factor in time and complexity?", type: 'engagement' as const, context: 'job_profitability' },  
        { question: "Are you flying blind on what actually drives your business growth?", type: 'urgency' as const, context: 'growth_insights' }  
      ],  
      roofing: [  
        { question: "Do you know which lead sources bring you customers who actually close versus just tire-kickers?", type: 'qualification' as const, context: 'lead_quality_sources' },  
        { question: "Can you track the profitability of different project types, or just overall revenue?", type: 'engagement' as const, context: 'project_profitability' },  
        { question: "Are you missing opportunities because you don't have visibility into your business patterns?", type: 'urgency' as const, context: 'pattern_visibility' }  
      ],  
      contractor: [  
        { question: "Do you know which types of projects generate the most referrals and repeat business?", type: 'qualification' as const, context: 'referral_drivers' },  
        { question: "Can you identify your most profitable customers and how to get more like them?", type: 'engagement' as const, context: 'customer_profiling' },  
        { question: "Are you leaving money on the table because you don't understand your business patterns?", type: 'urgency' as const, context: 'revenue_optimization' }  
      ],  
      general: [  
        { question: "What business metrics do you currently track, and are they actually helpful for making decisions?", type: 'qualification' as const, context: 'current_metrics' },  
        { question: "Do you know which aspects of your business are most profitable and which are just keeping you busy?", type: 'engagement' as const, context: 'profit_vs_busy' },  
        { question: "Are you confident in your business decisions, or do you wish you had better data?", type: 'urgency' as const, context: 'decision_confidence' }  
      ]  
    }  
  }  
    
  const topicFollowUps = followUps[topic as keyof typeof followUps]  
  if (!topicFollowUps) return []  
    
  const industryFollowUps = topicFollowUps[industry as keyof typeof topicFollowUps] || topicFollowUps.general  
  return industryFollowUps || []  
}

// Response analysis for lead qualification  
const analyzeResponse = (response: string, questionContext: string): {  
  businessSize?: string  
  urgency?: 'high' | 'medium' | 'low'  
  challenges?: string[]  
  budget?: string  
  timeframe?: string  
} => {  
  const lowerResponse = response.toLowerCase()  
  const analysis: any = {}  
    
  // Business size indicators  
  if (lowerResponse.includes('employee') || lowerResponse.includes('team') || lowerResponse.includes('staff')) {  
    if (lowerResponse.match(/\b(1|2|3|4|5|one|two|three|four|five)\b/)) {  
      analysis.businessSize = 'small'  
    } else if (lowerResponse.match(/\b(6|7|8|9|10|six|seven|eight|nine|ten)\b/)) {  
      analysis.businessSize = 'medium'  
    } else if (lowerResponse.match(/\b(15|20|25|30|fifteen|twenty|thirty)\b/)) {  
      analysis.businessSize = 'large'  
    }  
  }  
    
  // Urgency indicators  
  if (lowerResponse.includes('asap') || lowerResponse.includes('urgent') || lowerResponse.includes('immediately') ||   
      lowerResponse.includes('losing money') || lowerResponse.includes('crisis') || lowerResponse.includes('desperate')) {  
    analysis.urgency = 'high'  
  } else if (lowerResponse.includes('soon') || lowerResponse.includes('next month') || lowerResponse.includes('planning') ||  
             lowerResponse.includes('considering') || lowerResponse.includes('looking into')) {  
    analysis.urgency = 'medium'  
  } else {  
    analysis.urgency = 'low'  
  }  
    
  // Challenge extraction  
  const challenges = []  
  if (lowerResponse.includes('follow') && lowerResponse.includes('up')) challenges.push('follow-up')  
  if (lowerResponse.includes('scheduling') || lowerResponse.includes('calendar')) challenges.push('scheduling')  
  if (lowerResponse.includes('lead') || lowerResponse.includes('customer')) challenges.push('lead management')  
  if (lowerResponse.includes('time') || lowerResponse.includes('hours')) challenges.push('time management')  
  if (lowerResponse.includes('manual') || lowerResponse.includes('paperwork')) challenges.push('manual processes')  
    
  if (challenges.length > 0) analysis.challenges = challenges  
    
  return analysis  
}

// AUTOMATION responses by industry (keeping existing responses)  
const getAutomationResponse = (industry: 'hvac' | 'plumbing' | 'roofing' | 'contractor' | 'general'): string => {  
  const responses: Record<'hvac' | 'plumbing' | 'roofing' | 'contractor' | 'general', string[]> = {  
    hvac: [  
      "Nice! HVAC automation is where we really shine. We help companies like yours automate seasonal reminders (think spring tune-ups, fall maintenance), emergency dispatch routing, and follow-up sequences that turn one-time emergency calls into annual maintenance contracts. Our HVAC clients typically see 40% better customer retention and save 12+ hours weekly on admin work.",  
      "Sweet! So HVAC automation is basically our bread and butter here in West Texas. We set up systems that automatically send maintenance reminders before peak summer heat, route emergency calls to the right techs based on location and expertise, and follow up with customers about preventative services. One local HVAC company went from 30% callback rate to 85% just by automating their seasonal outreach.",  
      "Awesome! HVAC businesses love our automation because it handles the stuff that drives you crazy - like remembering to follow up on estimates, sending seasonal maintenance reminders, and routing emergency calls efficiently. We've helped local companies increase their maintenance contract sales by 60% through automated follow-up sequences.",  
      "Perfect! HVAC automation is huge out here. We automate everything from initial lead response (under 2 minutes!), to seasonal campaign management, to emergency dispatch workflows that get the right tech to the right job faster. Our clients typically see 50% improvement in converting estimates to jobs and save about 15 hours per week on admin tasks."  
    ],  
    plumbing: [  
      "Nice! Plumbing automation is perfect because y'all deal with so many emergencies mixed with routine work. We automate emergency dispatch (gets the right plumber to urgent calls faster), follow-up sequences for maintenance services, and review requests that help you get found online. Our plumbing clients see 45% better emergency response times and convert 35% more emergency calls into ongoing customers.",  
      "Sweet! Plumbing businesses have some of the best automation opportunities. We set up systems that instantly route emergency calls, automatically follow up on estimates (plumbing has notoriously low estimate conversion), and send maintenance reminders for things like water heater flushes and drain cleaning. One local plumber increased their repeat customer rate from 20% to 60% just through automated follow-up.",  
      "Awesome! Plumbing automation helps with both the emergency side and the planned maintenance side. We automate emergency dispatch workflows, estimate follow-up sequences (since plumbing estimates often get delayed), and customer education campaigns about preventative maintenance. Our plumbing clients typically see 40% improvement in estimate-to-job conversion and save 10+ hours weekly on admin work.",  
      "Perfect! Plumbing automation is huge because you're dealing with both urgent emergencies and planned work. We automate emergency call routing, follow-up sequences for estimates and maintenance, and educational campaigns that turn emergency customers into maintenance customers. Local plumbers using our system see 50% better conversion on estimates and 30% increase in maintenance contracts."  
    ],  
    roofing: [  
      "Nice! Roofing automation is especially powerful because of how seasonal and weather-dependent your business is. We automate storm damage follow-up sequences, insurance claim support workflows, and maintenance reminder campaigns that keep customers engaged between major jobs. Our roofing clients see 65% better conversion on storm leads and 40% increase in maintenance work during slow seasons.",  
      "Sweet! Roofing is perfect for automation because there's so much follow-up involved - insurance claims, inspection schedules, maintenance reminders. We set up systems that automatically nurture storm leads, manage inspection workflows, and send seasonal maintenance reminders (gutter cleaning, inspection after storms). One local roofer went from converting 25% of storm leads to 70% just through automated follow-up sequences.",  
      "Awesome! Roofing automation helps with the long sales cycles and seasonal nature of your business. We automate insurance claim workflows, multi-touch follow-up for big jobs, and maintenance campaigns that generate revenue during slow periods. Our roofing clients typically see 50% improvement in storm lead conversion and 35% increase in maintenance/repair work.",  
      "Perfect! Roofing has some unique automation opportunities because of insurance work and seasonal patterns. We automate storm response workflows, insurance documentation processes, and maintenance reminder sequences that keep you busy year-round. Local roofers using our system see 60% better conversion on insurance jobs and consistent revenue through automated maintenance programs."  
    ],  
    contractor: [  
      "Nice! General contractor automation is powerful because you're juggling so many different types of projects and customers. We automate estimate follow-up (contractors lose tons of money here), project milestone communications, and referral request sequences. Our contractor clients see 45% better estimate conversion and 40% increase in referral business.",  
      "Sweet! Contractor automation helps with the complexity of managing multiple projects and maintaining relationships. We set up systems that automatically follow up on estimates, send project updates to customers, and request reviews/referrals at completion. One local contractor increased their estimate-to-job conversion from 30% to 60% through automated follow-up sequences.",  
      "Awesome! General contractors have great automation opportunities because of all the touchpoints - estimates, project updates, completion follow-up, referral requests. We automate estimate nurturing, project communication workflows, and post-completion sequences that generate repeat business and referrals. Our contractor clients typically save 12+ hours weekly on admin work and see 50% improvement in customer satisfaction scores.",  
      "Perfect! Contractor automation handles the relationship management that's so crucial for your business. We automate estimate follow-up sequences, project milestone communications, and post-completion workflows that generate reviews and referrals. Local contractors using our system see 40% better estimate conversion and 55% increase in referral business."  
    ],  
    general: [  
      "Nice! So automation is basically our bread and butter. We help local businesses like HVAC companies, contractors, and plumbers automate all the boring stuff - like follow-ups, scheduling, invoice generation, you name it. Most of our clients save like 15+ hours a week and see way better lead conversion.",  
      "Sweet! Automation is where we really help West Texas businesses shine. We connect your existing tools to automate tasks like lead follow-up, appointment scheduling, and customer communications. Our clients typically see 40-60% improvement in lead conversion and save 15+ hours weekly on admin work.",  
      "Awesome! We specialize in automating workflows for home service businesses throughout West Texas. Things like instant lead responses, appointment reminders, follow-up sequences, and review requests. Most clients see ROI within 30 days through better lead conversion and time savings.",  
      "Perfect! Automation helps local businesses compete with the big guys by making sure nothing falls through the cracks. We automate lead responses, customer follow-up, scheduling, and all the administrative stuff that eats up your day. Our clients typically save 10-20 hours weekly and see significant improvements in customer retention."  
    ]  
  }  
    
  const industryResponses = responses[industry as keyof typeof responses] || responses.general  
  return industryResponses[Math.floor(Math.random() * industryResponses.length)]  
}

// DIGITAL MARKETING responses by industry (abbreviated for space - use your existing responses)  
const getDigitalMarketingResponse = (industry: 'hvac' | 'plumbing' | 'roofing' | 'contractor' | 'general'): string => {  
  const responses: Record<'hvac' | 'plumbing' | 'roofing' | 'contractor' | 'general', string[]> = {  
    hvac: ["Sweet! HVAC digital marketing is all about seasonal timing and emergency response. We run Facebook and Instagram ads for pre-season maintenance (huge ROI before summer hits), emergency service campaigns, and educational content that builds trust. Our HVAC clients typically see $4-6 return for every $1 spent on ads, plus we track actual service calls, not just clicks."],  
    plumbing: ["Sweet! Plumbing digital marketing is amazing because when people need a plumber, they need one NOW. We run emergency response campaigns, maintenance service ads, and educational content about preventing problems. Our plumbing clients see $5-8 return per ad dollar and get higher-quality customers who become long-term clients."],  
    roofing: ["Sweet! Roofing digital marketing is incredibly powerful because of the high transaction values and seasonal patterns. We run storm response campaigns, seasonal maintenance ads, and educational content about roof care. Our roofing clients see $8-12 return per ad dollar (higher margins help!) and better-qualified leads."],  
    contractor: ["Sweet! General contractor marketing is all about showcasing your work quality and building trust before people choose you for big projects. We run campaigns for different service areas, before/after showcases, and educational content about home improvements. Our contractor clients see $6-10 return per ad dollar and attract higher-value projects."],  
    general: ["Sweet! Yeah, we do Facebook and Instagram ads for local home service businesses. The cool thing is we actually track real ROI - not just 'engagement' or whatever. We focus on getting you actual customers, not just likes. Plus we tie it all into your automation so leads don't fall through the cracks."]  
  }  
    
  const industryResponses = responses[industry as keyof typeof responses] || responses.general  
  return industryResponses[Math.floor(Math.random() * industryResponses.length)]  
}

// WEB DEVELOPMENT responses by industry (abbreviated for space - use your existing responses)  
const getWebDevelopmentResponse = (industry: 'hvac' | 'plumbing' | 'roofing' | 'contractor' | 'general'): string => {  
  const responses: Record<'hvac' | 'plumbing' | 'roofing' | 'contractor' | 'general', string[]> = {  
    hvac: ["Awesome! HVAC websites need to work for both emergency situations and planned services. We build sites with instant service request forms, seasonal service booking, emergency contact features that actually work on mobile, and integration with your dispatch system. Our HVAC clients see 50% more online bookings and way better lead quality."],  
    plumbing: ["Awesome! Plumbing websites need to handle both emergency calls and planned services effectively. We build sites with emergency service forms, maintenance booking systems, educational content about plumbing care, and mobile-optimized design for people in crisis. Our plumbing clients see 60% more online bookings and higher-value service calls."],  
    roofing: ["Awesome! Roofing websites need to handle both emergency storm work and planned replacement projects. We build sites with storm damage assessment forms, insurance claim support resources, project galleries, and mobile-optimized design for homeowners dealing with roof issues. Our roofing clients see 70% more qualified leads and higher-value projects."],  
    contractor: ["Awesome! Contractor websites need to showcase your work quality and make it easy for people to understand your services. We build sites with project portfolios, service area pages, estimate request systems, and trust-building content that converts visitors into customers. Our contractor clients see 50% more qualified leads and higher-value projects."],  
    general: ["Awesome! We build websites that actually work for your business - not just pretty pictures. Think automated lead capture, built-in booking systems, and everything connects to your workflow. No more leads sitting in some random contact form."]  
  }  
    
  const industryResponses = responses[industry as keyof typeof responses] || responses.general  
  return industryResponses[Math.floor(Math.random() * industryResponses.length)]  
}

// ADVANCED ANALYTICS responses by industry (abbreviated for space - use your existing responses)  
const getAdvancedAnalyticsResponse = (industry: 'hvac' | 'plumbing' | 'roofing' | 'contractor' | 'general'): string => {  
  const responses: Record<'hvac' | 'plumbing' | 'roofing' | 'contractor' | 'general', string[]> = {  
    hvac: ["Oh this is cool stuff! For HVAC businesses, we track metrics that actually matter - like seasonal conversion rates, emergency vs maintenance revenue, customer lifetime value, and which marketing channels bring in the highest-value customers. Most HVAC owners don't know that emergency customers convert to maintenance contracts at different rates depending on how you follow up."],  
    plumbing: ["Oh this is cool stuff! Plumbing analytics help you understand the difference between profitable customers and unprofitable ones. We track metrics like emergency vs planned service ratios, customer lifetime value, conversion rates from emergency to maintenance, and which marketing brings the best customers. Most plumbers don't realize that some customers are worth 10x others."],  
    roofing: ["Oh this is cool stuff! Roofing analytics are powerful because of the high transaction values and long sales cycles. We track lead source profitability, conversion rates from estimate to job, project profitability by type, and customer lifetime value (repeat customers and referrals are gold!). Most roofers don't know which marketing channels bring customers who actually close versus just tire-kickers."],  
    contractor: ["Oh this is cool stuff! Contractor analytics help you understand which projects, customers, and marketing channels actually drive profitable growth. We track project margins by type, customer lifetime value, referral patterns, and conversion rates from estimate to job. Most contractors don't know that some project types are 3x more profitable than others when you factor in time, complexity, and follow-on work."],  
    general: ["Oh this is cool stuff! We set up custom dashboards that show you exactly what's driving your business growth. Like, which marketing channels actually bring in money, not just traffic. Most business owners are flying blind - this gives you the real numbers."]  
  }  
    
  const industryResponses = responses[industry as keyof typeof responses] || responses.general  
  return industryResponses[Math.floor(Math.random() * industryResponses.length)]  
}

function EnhancedAIChatbot({ isOpen, onClose }: Props) {  
  const [messages, setMessages] = useState<Message[]>([  
    {  
      id: '1',  
      role: 'assistant',  
      content: "Hey thanks for visiting the website. Is there anything you'd like to know more about?",  
      timestamp: new Date(),  
      type: 'selection',  
      options: ['Automation', 'Digital Marketing', 'Web Development', 'Advanced Analytics', 'Schedule a Consultation']  
    }  
  ])  
    
  const [inputValue, setInputValue] = useState('')  
  const [isLoading, setIsLoading] = useState(false)  
  const [currentFlow, setCurrentFlow] = useState<'general' | 'scheduling' | 'booking' | 'name' | 'company' | 'email' | 'emailOnly' | 'followup'>('general')  
  const [bookingDetails, setBookingDetails] = useState<Partial<BookingDetails>>({})  
  const [availableSlots, setAvailableSlots] = useState<Array<{date: string, time: string}>>([])  
    
  // Enhanced state for analytics and follow-ups  
  const [conversationContext, setConversationContext] = useState<ConversationContext>({  
    detectedIndustry: 'general',  
    confidence: 0,  
    mentionedServices: [],  
    painPoints: [],  
    followupStage: 0  
  })  
    
  const [analytics, setAnalytics] = useState<ConversationAnalytics>(() => ({  
    sessionId: generateSessionId(),  
    startTime: new Date(),  
    topicSelections: [],  
    followupResponses: [],  
    leadQualification: {},  
    engagementScore: 0  
  }))  
    
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {  
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })  
  }

  useEffect(() => {  
    scrollToBottom()  
  }, [messages])

  // Track analytics when component unmounts or chat closes  
  useEffect(() => {  
    return () => {  
      const finalScore = calculateEngagementScore(analytics)  
      trackEvent(analytics, 'conversation_ended', {  
        engagementScore: finalScore,  
        messageCount: messages.length,  
        topicCount: analytics.topicSelections.length,  
        followupCount: analytics.followupResponses.length,  
        leadQualification: analytics.leadQualification  
      })  
    }  
  }, [analytics, messages])

  // Handle Schedule Free Consultation button click  
  const handleScheduleConsultation = () => {  
    const newMessage: Message = {  
      id: Date.now().toString(),  
      role: 'assistant',  
      content: "Sweet! So do you want to hop on a video call or would you prefer I just give you a ring?",  
      timestamp: new Date(),  
      type: 'selection',  
      options: ['Video call works', 'Just call me', 'Actually, let me email you instead']  
    }  
      
    setMessages(prev => [...prev, newMessage])  
    setCurrentFlow('scheduling')  
      
    // Track scheduling initiation  
    trackEvent(analytics, 'scheduling_initiated', {  
      fromTopic: conversationContext.currentTopic,  
      industry: conversationContext.detectedIndustry  
    })  
  }

  // Handle meeting type selection
  const handleMeetingTypeSelection = async (selection: string) => {
    // Add user selection message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: selection,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    if (selection === 'Actually, let me email you instead') {
      // Start email collection flow
      setTimeout(() => {
        const emailFlowMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Okay no problem. Let me go ahead and get a thread started. What is your email address?",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, emailFlowMessage])
        setCurrentFlow('emailOnly') // New flow state
        setIsLoading(false)
      }, 1500)
      return
    }

    // Set booking type  
    setBookingDetails(prev => ({
      ...prev,
      meetingType: selection === 'Video call works' ? 'video' : 'phone'
    }))

    // Show "thinking" message with delay
    setTimeout(() => {
      const thinkingMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Okay... Let me find the next available time.",
        timestamp: new Date()  
      }  
      setMessages(prev => [...prev, thinkingMessage])

      // Simulate thinking delay  
      setIsLoading(true)  
        
      setTimeout(async () => {  
        // Generate available slots  
        const slots: Array<{date: string, time: string}> = generateAvailableSlots()  
        setAvailableSlots(slots)  
          
        // Pick a random slot from the first few available  
        const randomSlot = slots[Math.floor(Math.random() * Math.min(3, slots.length))]  
          
        if (randomSlot) {  
          const date = new Date(randomSlot.date)  
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })  
          const formattedDate = date.toLocaleDateString('en-US', {   
            month: 'long',   
            day: 'numeric'   
          })  
            
          const timeSlotMessage: Message = {  
            id: (Date.now() + 2).toString(),  
            role: 'assistant',  
            content: `How is ${dayName}, ${formattedDate} at ${randomSlot.time} CST?`,  
            timestamp: new Date(),  
            type: 'selection',  
            options: ['Sounds great!', 'Actually, let me just email you'],  
            timeSlot: {  
              date: randomSlot.date,  
              time: randomSlot.time,  
              type: selection === 'Video call works' ? 'video' : 'phone'  
            }  
          }  
            
          setMessages(prev => [...prev, timeSlotMessage])  
          setCurrentFlow('booking')  
        }  
          
        setIsLoading(false)  
      }, 3000) // 3 second thinking delay  
    }, 1000) // 1 second delay before thinking message  
  }

  // Handle time slot confirmation  
  const handleTimeSlotConfirmation = (selection: string, timeSlot?: any) => {  
    const userMessage: Message = {  
      id: Date.now().toString(),  
      role: 'user',  
      content: selection,  
      timestamp: new Date()  
    }  
    setMessages(prev => [...prev, userMessage])

    if (selection === 'Actually, let me just email you') {  
      setTimeout(() => {  
        const emailMessage: Message = {  
          id: (Date.now() + 1).toString(),  
          role: 'assistant',  
          content: "No worries! Just shoot us an email at admin@amarilloautomation.com. Toss in your name and company name and we'll get back to you super quick - usually within a few hours.",  
          timestamp: new Date()  
        }  
        setMessages(prev => [...prev, emailMessage])  
      }, 1500)  
      return  
    }

    // Request booking details with natural delay  
    setTimeout(() => {  
      const detailsMessage: Message = {  
        id: (Date.now() + 1).toString(),  
        role: 'assistant',  
        content: "Awesome! What's your name?",  
        timestamp: new Date()  
      }  
      setMessages(prev => [...prev, detailsMessage])  
      setCurrentFlow('name')  
        
      // Store selected time slot  
      if (timeSlot) {  
        setBookingDetails(prev => ({  
          ...prev,  
          timeSlot: `${timeSlot.date} at ${timeSlot.time}`  
        }))  
      }  
    }, 1500) // 1.5 second delay  
  }

  // Enhanced sendMessage with follow-up handling  
  const sendMessage = async () => {  
    if (!inputValue.trim()) return

    const userMessage: Message = {  
      id: Date.now().toString(),  
      role: 'user',  
      content: inputValue,  
      timestamp: new Date()  
    }

    setMessages(prev => [...prev, userMessage])  
    const currentInput = inputValue  
    setInputValue('')  
    setIsLoading(true)

    try {  
      // Handle follow-up responses  
      if (currentFlow === 'followup') {  
        // Analyze the response for lead qualification  
        const lastMessage = messages[messages.length - 1]  
        const questionContext = lastMessage.followupContext?.context || ''  
        const responseAnalysis = analyzeResponse(currentInput, questionContext)  
          
        // Update analytics with follow-up response  
        setAnalytics(prev => ({  
          ...prev,  
          followupResponses: [...prev.followupResponses, {  
            question: lastMessage.content,  
            response: currentInput,  
            timestamp: new Date(),  
            questionType: lastMessage.followupContext?.questionType || 'engagement'  
          }],  
          leadQualification: { ...prev.leadQualification, ...responseAnalysis },  
          engagementScore: calculateEngagementScore({  
            ...prev,  
            followupResponses: [...prev.followupResponses, {  
              question: lastMessage.content,  
              response: currentInput,  
              timestamp: new Date(),  
              questionType: lastMessage.followupContext?.questionType || 'engagement'  
            }]  
          })  
        }))

        // Generate intelligent follow-up or transition  
        setTimeout(() => {  
          let response = ""  
            
          if (conversationContext.followupStage < 2) {  
            // Continue with more follow-ups  
            const followUps = getFollowUpQuestions(  
              conversationContext.currentTopic || 'Automation',  
              conversationContext.detectedIndustry,  
              conversationContext.followupStage + 1  
            )  
              
            if (followUps.length > 0) {  
              const nextFollowUp = followUps[Math.floor(Math.random() * followUps.length)]  
              response = nextFollowUp.question  
                
              const followUpMessage: Message = {  
                id: (Date.now() + 1).toString(),  
                role: 'assistant',  
                content: response,  
                timestamp: new Date(),  
                type: 'followup',  
                followupContext: {  
                  topic: conversationContext.currentTopic || 'Automation',  
                  industry: conversationContext.detectedIndustry,  
                  questionType: nextFollowUp.type,  
                  context: nextFollowUp.context  
                }  
              }  
                
              setMessages(prev => [...prev, followUpMessage])  
              setConversationContext(prev => ({ ...prev, followupStage: prev.followupStage + 1 }))  
            }  
          } else {  
            // Transition to consultation offer  
            response = responseAnalysis.urgency === 'high' ?   
              "Sounds like you've got some real opportunities to improve things! Want to hop on a quick call to see how we can help? I can get you set up with a free consultation." :  
              "That's helpful context! Based on what you're telling me, I think we could definitely help streamline some of those processes. Want to schedule a free consultation to dive deeper into your specific situation?"  
              
            const consultationMessage: Message = {  
              id: (Date.now() + 1).toString(),  
              role: 'assistant',  
              content: response,  
              timestamp: new Date(),  
              type: 'selection',  
              options: ['Yeah, let\'s schedule something', 'Let me think about it', 'Send me some info instead']  
            }  
              
            setMessages(prev => [...prev, consultationMessage])  
            setCurrentFlow('general')  
          }  
            
          setIsLoading(false)  
        }, 1500)  
        return  
      }

      // Handle booking flow step by step (existing code)  
      if (currentFlow === 'name') {  
        const name = currentInput.trim()  
        setBookingDetails(prev => ({ ...prev, name }))  
          
        setTimeout(() => {  
          const companyMessage: Message = {  
            id: (Date.now() + 1).toString(),  
            role: 'assistant',  
            content: "Cool! And what company are you with?",  
            timestamp: new Date()  
          }  
          setMessages(prev => [...prev, companyMessage])  
          setCurrentFlow('company')  
          setIsLoading(false)  
        }, 1500)  
        return  
      }

      if (currentFlow === 'company') {  
        const company = currentInput.trim()  
        setBookingDetails(prev => ({ ...prev, company }))  
          
        setTimeout(() => {  
          const emailMessage: Message = {  
            id: (Date.now() + 1).toString(),  
            role: 'assistant',  
            content: "Perfect! And what's your email so I can send you the meeting details?",  
            timestamp: new Date()  
          }  
          setMessages(prev => [...prev, emailMessage])  
          setCurrentFlow('email')  
          setIsLoading(false)  
        }, 2000)  
        return  
      }

      if (currentFlow === 'email') {  
        const email = currentInput.trim()  
        setBookingDetails(prev => ({ ...prev, email }))  
          
        setTimeout(() => {  
          const bookingMessage: Message = {  
            id: (Date.now() + 1).toString(),  
            role: 'assistant',  
            content: "Sweet! I'm getting this set up for you right now. You should get a confirmation email in just a minute.",  
            timestamp: new Date()  
          }  
          setMessages(prev => [...prev, bookingMessage])  
            
          setTimeout(async () => {  
            try {  
              const bookingData = {  
                name: bookingDetails.name,  
                company: bookingDetails.company,  
                email: email,  
                meetingType: bookingDetails.meetingType,  
                timeSlot: bookingDetails.timeSlot,  
                timestamp: new Date().toISOString(),  
                analytics: analytics  
              }  
                
              const response = await fetch('/api/chat-booking', {  
                method: 'POST',  
                headers: {  
                  'Content-Type': 'application/json',  
                },  
                body: JSON.stringify({  
                  action: 'create_booking',  
                  bookingData: bookingData  
                })  
              })  
                
              if (!response.ok) {  
                console.error('Booking API failed:', response.status)  
              } else {  
                console.log('Booking created successfully')  
              }  
                
              // Track successful booking  
              trackEvent(analytics, 'booking_completed', {  
                industry: conversationContext.detectedIndustry,  
                engagementScore: calculateEngagementScore(analytics)  
              })  
                
            } catch (error) {  
              console.error('Booking process error:', error)  
            }  
              
            setTimeout(() => {  
              const helpMessage: Message = {  
                id: (Date.now() + 2).toString(),  
                role: 'assistant',  
                content: "Anything else I can help you with while you're here?",  
                timestamp: new Date()  
              }  
              setMessages(prev => [...prev, helpMessage])  
              setCurrentFlow('general')  
              setIsLoading(false)  
            }, 3000)  
              
          }, 2000)  
            
        }, 2500)  
        return  
      }

      // Handle emailOnly flow - NEW ADDITION
      if (currentFlow === 'emailOnly') {
        const email = currentInput.trim()
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          setTimeout(() => {
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: "Hmm, that doesn't look like a valid email address. Could you try again?",
              timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
            setIsLoading(false)
          }, 1500)
          return
        }

        // Process email and send to Zapier webhook
        try {
          const emailData = {
            email: email,
            source: 'website_chatbot_email_request',
            timestamp: new Date().toISOString(),
            requestType: 'email_communication',
            triggerType: 'email_request'
          }

          // Send directly to your Zapier webhook
          const response = await fetch('https://hooks.zapier.com/hooks/catch/22949842/ub41u30/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
          })

          if (!response.ok) {
            throw new Error('Webhook failed')
          }

          // Show success message and return to service options
          setTimeout(() => {
            const confirmMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: "I am sending you an email now. We look forward to talking soon. Feel free to ask us anything else in the meantime",
              timestamp: new Date(),
              type: 'selection',
              options: ['Automation', 'Digital Marketing', 'Web Development', 'Advanced Analytics', 'Schedule a Consultation']
            }
            setMessages(prev => [...prev, confirmMessage])
            setCurrentFlow('general') // Return to general flow
            setIsLoading(false)
          }, 2000)
          
        } catch (error) {
          console.error('Email webhook error:', error)
          // Handle error gracefully
          setTimeout(() => {
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: "Sorry, there was an issue setting that up. You can reach us directly at admin@amarilloautomation.com",
              timestamp: new Date(),
              type: 'selection',
              options: ['Automation', 'Digital Marketing', 'Web Development', 'Advanced Analytics', 'Schedule a Consultation']
            }
            setMessages(prev => [...prev, errorMessage])
            setCurrentFlow('general')
            setIsLoading(false)
          }, 1500)
        }
        return
      }

      // Regular chat API call for general conversation  
      const response = await fetch('/api/chat', {  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify({  
          message: currentInput,  
          conversation_history: messages.map(msg => ({  
            role: msg.role,  
            content: msg.content  
          }))  
        })  
      })

      if (!response.ok) {  
        throw new Error('Failed to send message')  
      }

      const data = await response.json()  
        
      const assistantMessage: Message = {  
        id: (Date.now() + 1).toString(),  
        role: 'assistant',  
        content: data.response,  
        timestamp: new Date()  
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {  
      const errorMessage: Message = {  
        id: (Date.now() + 1).toString(),  
        role: 'assistant',  
        content: "I'm sorry, I'm having trouble connecting right now. Please feel free to contact us directly at admin@amarilloautomation.com or try again in a moment.",  
        timestamp: new Date()  
      }  
      setMessages(prev => [...prev, errorMessage])  
    } finally {  
      setIsLoading(false)  
    }  
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {  
    if (e.key === 'Enter' && !e.shiftKey) {  
      e.preventDefault()  
      sendMessage()  
    }  
  }

  const handleOptionSelect = (option: string, message: Message) => {  
    if (currentFlow === 'general' && message.options?.includes(option)) {  
      handleTopicSelection(option)  
    } else if (currentFlow === 'scheduling') {  
      handleMeetingTypeSelection(option)  
    } else if (currentFlow === 'booking' && message.timeSlot) {  
      handleTimeSlotConfirmation(option, message.timeSlot)  
    } else if (option.includes('schedule')) {  
      handleScheduleConsultation()  
    } else if (option.includes('info')) {  
      // Handle "Send me some info" option  
      const userMessage: Message = {  
        id: Date.now().toString(),  
        role: 'user',  
        content: option,  
        timestamp: new Date()  
      }  
      setMessages(prev => [...prev, userMessage])  
        
      setTimeout(() => {  
        const infoMessage: Message = {  
          id: (Date.now() + 1).toString(),  
          role: 'assistant',  
          content: "Perfect! Just shoot us an email at admin@amarilloautomation.com and mention what you're most interested in. We'll send you some case studies and examples specific to your industry. Usually get back to people within a couple hours!",  
          timestamp: new Date()  
        }  
        setMessages(prev => [...prev, infoMessage])  
      }, 1500)  
    }  
  }

  // Enhanced topic selection with follow-up questions  
  const handleTopicSelection = (topic: string) => {  
    const userMessage: Message = {  
      id: Date.now().toString(),  
      role: 'user',  
      content: topic,  
      timestamp: new Date()  
    }  
    setMessages(prev => [...prev, userMessage])

    if (topic === 'Schedule a Consultation') {  
      handleScheduleConsultation()  
      return  
    }

    // Industry detection from conversation context  
    const conversationText = messages.map(m => m.content.toLowerCase()).join(' ')  
    const detectedIndustry = detectIndustry(conversationText)  
      
    // Update analytics  
    setAnalytics(prev => ({  
      ...prev,  
      topicSelections: [...prev.topicSelections, {  
        topic,  
        timestamp: new Date(),  
        industry: detectedIndustry  
      }]  
    }))  
      
    // Update conversation context  
    setConversationContext(prev => ({  
      ...prev,  
      detectedIndustry,  
      currentTopic: topic,  
      followupStage: 0  
    }))

    // Track topic selection  
    trackEvent(analytics, 'topic_selected', {  
      topic,  
      industry: detectedIndustry,  
      messageCount: messages.length  
    })

    // Generate industry-specific response with human-like delay  
    setTimeout(() => {  
      let response = ""  
        
      switch (topic) {  
        case 'Automation':  
          response = getAutomationResponse(detectedIndustry)  
          break  
        case 'Digital Marketing':  
          response = getDigitalMarketingResponse(detectedIndustry)  
          break  
        case 'Web Development':  
          response = getWebDevelopmentResponse(detectedIndustry)  
          break  
        case 'Advanced Analytics':  
          response = getAdvancedAnalyticsResponse(detectedIndustry)  
          break  
        default:  
          response = "That's a great question! I'd love to learn more about your specific situation."  
      }

      const assistantMessage: Message = {  
        id: (Date.now() + 1).toString(),  
        role: 'assistant',  
        content: response,  
        timestamp: new Date()  
      }  
      setMessages(prev => [...prev, assistantMessage])  
        
      // Add follow-up question after a short delay  
      setTimeout(() => {  
        const followUps = getFollowUpQuestions(topic, detectedIndustry, 0)  
        if (followUps.length > 0) {  
          const selectedFollowUp = followUps[Math.floor(Math.random() * followUps.length)]  
            
          const followUpMessage: Message = {  
            id: (Date.now() + 2).toString(),  
            role: 'assistant',  
            content: selectedFollowUp.question,  
            timestamp: new Date(),  
            type: 'followup',  
            followupContext: {  
              topic,  
              industry: detectedIndustry,  
              questionType: selectedFollowUp.type,  
              context: selectedFollowUp.context  
            }  
          }  
            
          setMessages(prev => [...prev, followUpMessage])  
          setCurrentFlow('followup')  
          setConversationContext(prev => ({ ...prev, followupStage: 1 }))  
            
          // Track follow-up question  
          trackEvent(analytics, 'followup_question_asked', {  
            topic,  
            industry: detectedIndustry,  
            questionType: selectedFollowUp.type,  
            context: selectedFollowUp.context  
          })  
        }  
      }, 2000) // 2 second delay for follow-up  
        
    }, 1500) // 1.5 second delay for natural feel  
  }

  if (!isOpen) return null

  return (  
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">  
      {/* Backdrop */}  
      <div   
        className="absolute inset-0 bg-black bg-opacity-50 pointer-events-auto"  
        onClick={onClose}  
      />  
        
      {/* Chatbot Window */}  
      <div className="relative bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-full max-w-md h-96 sm:h-[500px] pointer-events-auto flex flex-col">  
        {/* Header */}  
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-green-600 rounded-t-lg">  
          <div className="flex items-center gap-3">  
            <Bot className="w-6 h-6 text-white" />  
            <div>  
              <h3 className="font-semibold text-white">Amarillo Automation AI</h3>  
              <p className="text-xs text-green-100">Ask me anything about our services</p>  
            </div>  
          </div>  
          <button  
            onClick={onClose}  
            className="text-white hover:text-gray-300 transition-colors p-1"  
          >  
            <X className="w-5 h-5" />  
          </button>  
        </div>

        {/* Schedule Free Consultation Button */}  
        <div className="p-4 border-b border-gray-700 bg-gray-800">  
          <button  
            onClick={handleScheduleConsultation}  
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"  
          >  
            <Calendar className="w-4 h-4" />  
            Schedule Free Consultation  
          </button>  
        </div>

        {/* Messages */}  
        <div className="flex-1 overflow-y-auto p-4 space-y-4">  
          {messages.map((message) => (  
            <div  
              key={message.id}  
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}  
            >  
              {message.role === 'assistant' && (  
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">  
                  <Bot className="w-4 h-4 text-white" />  
                </div>  
              )}  
                
              <div className={`flex flex-col max-w-xs lg:max-w-md`}>  
                <div  
                  className={`px-4 py-2 rounded-lg ${  
                    message.role === 'user'  
                      ? 'bg-green-600 text-white ml-auto'  
                      : message.type === 'followup'  
                      ? 'bg-blue-700 text-blue-100'  
                      : 'bg-gray-700 text-gray-100'  
                  }`}  
                >  
                  {message.content}  
                </div>  
                  
                {/* Selection Options */}  
                {message.type === 'selection' && message.options && (  
                  <div className="mt-2 space-y-2">  
                    {message.options.map((option, index) => (  
                      <button  
                        key={index}  
                        onClick={() => handleOptionSelect(option, message)}  
                        className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${  
                          option.includes('Email')   
                            ? 'border-blue-500 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'  
                            : 'border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20'  
                        }`}  
                      >  
                        <div className="flex items-center gap-2">  
                          {option.includes('Video') && <Video className="w-4 h-4" />}  
                          {option.includes('Phone') && <Phone className="w-4 h-4" />}  
                          {option.includes('Email') && <Mail className="w-4 h-4" />}  
                          {option.includes('Sounds great') && <Calendar className="w-4 h-4" />}  
                          {option}  
                        </div>  
                      </button>  
                    ))}  
                  </div>  
                )}  
              </div>  
            </div>  
          ))}  
            
          {/* Loading indicator */}  
          {isLoading && (  
            <div className="flex gap-3 justify-start">  
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">  
                <Clock className="w-4 h-4 text-white animate-spin" />  
              </div>  
              <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">  
                <div className="flex space-x-1">  
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>  
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>  
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>  
                </div>  
              </div>  
            </div>  
          )}  
            
          <div ref={messagesEndRef} />  
        </div>

        {/* Input */}  
        <div className="border-t border-gray-700 p-4">  
          <div className="flex gap-2">  
            <input  
              type="text"  
              value={inputValue}  
              onChange={(e) => setInputValue(e.target.value)}  
              onKeyPress={handleKeyPress}  
              placeholder={  
                currentFlow === 'name' ? "Your name..." :  
                currentFlow === 'company' ? "Company name..." :  
                currentFlow === 'email' ? "Your email address..." :
                currentFlow === 'emailOnly' ? "Your email address..." :
                currentFlow === 'followup' ? "Tell me more..." :  
                currentFlow === 'booking' ? "Enter your name and company..." :  
                "Type your message..."  
              }  
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-green-500"  
              disabled={isLoading}  
            />  
            <button  
              onClick={sendMessage}  
              disabled={isLoading || !inputValue.trim()}  
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white p-2 rounded-lg transition-colors"  
            >  
              <Send className="w-4 h-4" />  
            </button>  
          </div>  
        </div>  
      </div>  
    </div>  
  )  
}

export default EnhancedAIChatbot