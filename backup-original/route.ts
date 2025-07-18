// app/api/chat/route.ts - Clean Chat API Endpoint
import { NextRequest, NextResponse } from 'next/server'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const COMPANY_KNOWLEDGE = `
Amarillo Automation is a workflow automation company serving West Texas home service businesses.

SERVICES:
1. Workflow Automation - Automate repetitive tasks, lead management, scheduling, follow-ups
2. Lead Generation Systems - Automated lead capture, nurturing, and conversion
3. AI Agents & Chatbots - 24/7 customer service and lead qualification
4. Web Development - Professional websites with built-in automation
5. Meta Marketing - Facebook/Instagram advertising with ROI tracking
6. Advanced Analytics - Custom dashboards and reporting
7. Business Consultation - Strategic automation planning

TOOLS WE INTEGRATE: Zapier, Make.com, GoHighLevel, Airtable, Google Workspace, QuickBooks, Calendly, Mailchimp, HubSpot, Salesforce, Slack, Twilio, and more.

RESULTS:
- 40+ businesses automated
- $2M+ in additional revenue generated  
- Average 15 hours/week saved per business
- 40-60% improvement in lead conversion rates

DIFFERENTIATORS:
- Local West Texas experts (not distant corporation)
- Same-day response to inquiries
- Custom solutions (not templates)
- No long-term contracts
- ROI-focused approach
- Ongoing support included

PROCESS:
1. Free consultation to understand needs
2. Custom automation strategy development  
3. Implementation using existing tools (no forced software)
4. Training and ongoing optimization

Always encourage scheduling a free consultation for personalized advice.
Contact: info@amarilloautomation.com
`

export async function POST(request: NextRequest) {
  try {
    const { message, conversation_history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Create context from conversation history
    const context = conversation_history?.map((msg: ChatMessage) => 
      `${msg.role}: ${msg.content}`
    ).join('\n') || ''

    // Generate response using keyword matching
    const response = generateResponse(message, context)

    return NextResponse.json({ 
      response,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}

// Keyword-based response system
function generateResponse(message: string, context: string): string {
  const lowerMessage = message.toLowerCase()

  // Consultation requests
  if (lowerMessage.includes('consultation') || lowerMessage.includes('schedule') || lowerMessage.includes('meeting')) {
    return "I'd be happy to help you schedule a free consultation! Our team offers personalized 30-minute sessions where we'll discuss your specific business needs and show you exactly how automation can help. You can schedule directly through our calendar link, or I can have someone contact you. What works better for you?"
  }

  // Pricing questions
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
    return "Our automation solutions are customized for each business, so pricing varies based on your specific needs and complexity. Most of our clients see ROI within 30-60 days through time savings and increased conversions. I'd recommend scheduling a free consultation where we can discuss your situation and provide a personalized quote. Would you like me to help you set that up?"
  }

  // Lead generation
  if (lowerMessage.includes('lead') || lowerMessage.includes('customer') || lowerMessage.includes('sales')) {
    return "Great question about lead generation! We help businesses automate their entire lead lifecycle - from initial capture to conversion. This includes instant response systems (respond in under 2 minutes), automated follow-up sequences, and smart lead routing. Our clients typically see 40-60% improvements in conversion rates. What specific challenges are you facing with lead management?"
  }

  // Tools and integrations
  if (lowerMessage.includes('tool') || lowerMessage.includes('software') || lowerMessage.includes('integrate')) {
    return "We work with the tools you already use! We integrate with 18+ platforms including Zapier, Google Workspace, QuickBooks, Calendly, and more. The best part? No expensive new software to learn. We connect your existing tools to create powerful automations. What tools are you currently using for your business?"
  }

  // Time savings
  if (lowerMessage.includes('time') || lowerMessage.includes('save') || lowerMessage.includes('hours')) {
    return "Time savings is one of our biggest value propositions! Our clients typically save 10-20 hours per week on repetitive tasks like data entry, follow-ups, and scheduling. That's time you can spend growing your business instead of managing it. We automate everything from missed call responses to invoice generation. What tasks are taking up most of your time right now?"
  }

  // ROI and results
  if (lowerMessage.includes('roi') || lowerMessage.includes('return') || lowerMessage.includes('results') || lowerMessage.includes('revenue')) {
    return "Our clients see impressive results! We've helped generate over $2M in additional revenue across 40+ West Texas businesses. Most see ROI within 30-60 days through faster lead response (we get you responding in under 2 minutes), better follow-up systems, and reduced manual work. Would you like to see some specific case studies from businesses similar to yours?"
  }

  // Getting started
  if (lowerMessage.includes('start') || lowerMessage.includes('begin') || lowerMessage.includes('how do') || lowerMessage.includes('first step')) {
    return "Getting started is easy! We begin with a free 30-minute consultation where we'll review your current processes and identify your biggest automation opportunities. No pressure, no obligation - just valuable insights. From there, we create a custom strategy and can typically have your first automations running within a week. Ready to schedule your free consultation?"
  }

  // Local/Amarillo specific
  if (lowerMessage.includes('amarillo') || lowerMessage.includes('texas') || lowerMessage.includes('local')) {
    return "Yes, we're proudly based in Amarillo and serve businesses throughout West Texas! Being local means we understand the unique challenges of businesses in our area, and you get same-day responses instead of dealing with distant call centers. We've helped 40+ local contractors, HVAC companies, plumbers, and other home service businesses. There's something valuable about working with neighbors who truly understand your market!"
  }

  // Specific business types
  if (lowerMessage.includes('hvac') || lowerMessage.includes('plumbing') || lowerMessage.includes('roofing') || lowerMessage.includes('contractor')) {
    return "Perfect! We specialize in home service businesses like yours. We've automated workflows for HVAC companies, plumbers, roofers, and general contractors throughout West Texas. Common automations include instant lead responses, appointment reminders, invoice generation, and review requests. Each business is unique, so we'd love to discuss your specific challenges. What's your biggest operational headache right now?"
  }

  // Default response
  return "That's a great question! Amarillo Automation helps West Texas home service businesses save time and increase revenue through smart workflow automation. We connect your existing tools (no new expensive software!) to automate tasks like lead follow-up, scheduling, and customer communications. \n\nOur clients typically save 15+ hours per week and see 40-60% improvements in lead conversion. I'd love to learn more about your specific business challenges. What's the biggest time-waster in your daily operations? \n\nOr, if you'd prefer to speak with our team directly, I can help you schedule a free consultation!"
}