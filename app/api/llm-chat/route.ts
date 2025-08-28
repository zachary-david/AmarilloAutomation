import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

// System prompt that defines the AI's personality and knowledge
const SYSTEM_PROMPT = `You are an AI assistant for Garrett Zamora, a freelance automation consultant and developer. You help businesses with automation, digital marketing, web development, and analytics.

PERSONALITY & TONE:
- Conversational and friendly, like talking to a business automation expert
- Professional but personal - use "I" and "my clients" (first person as Garrett)
- Personal service references when appropriate
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
- "Most of my clients save..." 
- "I've helped [industry] businesses..."
- "My [industry] clients typically see..."
- "Working directly with me means..."

IMPORTANT: When user wants to schedule or seems ready for next steps, respond naturally about helping them schedule, and include "BOOKING_FLOW_TRIGGER" somewhere in your response (it will be hidden from the user).`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationHistory = [] } = body

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set')
      throw new Error('OpenAI API key is not configured')
    }

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
      model: 'gpt-3.5-turbo', // Changed from gpt-4 to ensure compatibility
      messages: messages,
      max_tokens: 300, // Keep responses concise
      temperature: 0.7, // Natural but consistent responses
    })

    const aiResponse = completion.choices[0]?.message?.content || 
      "I'd be happy to help you learn more about our services. What specifically are you interested in?"

    // Check if AI wants to trigger booking flow
    const shouldTriggerBooking = aiResponse.includes('BOOKING_FLOW_TRIGGER')
    
    // Remove the trigger text from the response
    const cleanedResponse = aiResponse.replace('BOOKING_FLOW_TRIGGER', '').trim()
    
    return NextResponse.json({ 
      response: cleanedResponse,
      triggerBooking: shouldTriggerBooking
    })

  } catch (error) {
    console.error('LLM API error:', error)
    return NextResponse.json(
      { 
        response: "I'm having trouble connecting right now. Please email me at garrett@garrettzamora.com or try again in a moment.",
        error: true 
      },
      { status: 500 }
    )
  }
}