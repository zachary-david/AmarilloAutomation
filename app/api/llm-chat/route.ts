import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

// System prompt that defines the AI's personality and knowledge
const SYSTEM_PROMPT = `You are an AI assistant for Amarillo Automation. You help local home service businesses (HVAC, plumbing, roofing, contractors) with automation, digital marketing, web development, and analytics.

PERSONALITY & TONE:
- Conversational and friendly, like talking to a local business expert
- Professional but not corporate - use "we" and "our clients"
- West Texas local references when appropriate
- Specific about time savings and ROI metrics
- Never pushy or salesy

SERVICES OVERVIEW:
1. AUTOMATION: Workflow automation using Zapier, Make.com, custom solutions. Focus on lead response, follow-up sequences, scheduling, paperwork automation. Typical savings: 15+ hours/week.

2. DIGITAL MARKETING: Facebook/Instagram ads for home services. Focus on actual customers, not just engagement. Typical ROI: $4-12 return per ad dollar depending on industry.

3. WEB DEVELOPMENT: Business websites with lead capture, booking systems, mobile-optimized for emergency services. No AI-generated content - requires existing business content.

4. ADVANCED ANALYTICS: Custom dashboards showing what actually drives business growth, lead source profitability, customer lifetime value analysis.

CONVERSATION FLOW:
- Answer questions naturally about services
- Ask qualifying questions about their business size, current challenges, urgency
- When appropriate, offer to schedule a consultation
- NEVER try to collect booking details yourself - always hand off to booking system

KEY PHRASES TO USE:
- "Most of our clients save..." 
- "We've helped local [industry] businesses..."
- "Our [industry] clients typically see..."
- "Here in West Texas..."

IMPORTANT: When user wants to schedule or seems ready for next steps, respond with exactly: "TRIGGER_BOOKING_FLOW" and I'll handle the transition.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationHistory = [] } = body

    // Initialize OpenAI client inside the request handler
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Build conversation context for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      max_tokens: 300, // Keep responses concise
      temperature: 0.7, // Natural but consistent responses
    })

    const aiResponse = completion.choices[0]?.message?.content || 
      "I'd be happy to help you learn more about our services. What specifically are you interested in?"

    // Check if AI wants to trigger booking flow
    const shouldTriggerBooking = aiResponse.includes('TRIGGER_BOOKING_FLOW')
    
    return NextResponse.json({ 
      response: shouldTriggerBooking ? 
        "Great! I can help you schedule a consultation with our team. How would you prefer to connect?" : 
        aiResponse,
      triggerBooking: shouldTriggerBooking
    })

  } catch (error) {
    console.error('LLM API error:', error)
    return NextResponse.json(
      { 
        response: "I'm having trouble connecting right now. Please email us at admin@amarilloautomation.com or try again in a moment.",
        error: true 
      },
      { status: 500 }
    )
  }
}