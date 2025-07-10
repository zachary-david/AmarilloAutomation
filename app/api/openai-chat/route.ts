import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

// System prompt that defines the AI's personality and knowledge
const SYSTEM_PROMPT = `You are an AI assistant for Amarillo Automation, a West Texas automation company that helps local home service businesses (HVAC, plumbing, roofing, contractors) with automation, digital marketing, web development, and analytics.

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

IMPORTANT: When user wants to schedule or seems ready for next steps, respond with exactly: "TRIGGER_BOOKING_FLOW" and I'll handle the transition.

EXAMPLES:
User: "I'm an HVAC owner spending too much time on paperwork"
You: "That's exactly what we help HVAC businesses solve here in West Texas. Most of our HVAC clients save 15+ hours weekly by automating lead responses, estimate follow-ups, and seasonal maintenance reminders. What's eating up most of your time - customer follow-ups, scheduling, or something else?"

User: "How much does this cost?"
You: "Our pricing depends on which services you need and your business size. Most clients see ROI within 30 days through better lead conversion and time savings. What's your biggest challenge right now? We can discuss how our specific solutions would work for your situation."

User: "I want to learn more" or "Tell me about pricing" or "Can we schedule something?"
You: "TRIGGER_BOOKING_FLOW"`

export async function POST(request: NextRequest) {
  let requestBody: any = {}
  
  try {
    requestBody = await request.json()
    const { message, conversationHistory = [] } = requestBody

    // Initialize OpenAI client inside the request handler
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Build conversation context for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // or 'gpt-4-turbo' for faster/cheaper responses
      messages: messages,
      max_tokens: 300, // Keep responses concise
      temperature: 0.7, // Natural but consistent responses
    })

    const aiResponse = completion.choices[0]?.message?.content || 
      "I'd be happy to help you learn more about our services. What's your biggest operational challenge right now?"

    // Check if AI wants to trigger booking flow
    const shouldTriggerBooking = aiResponse.includes('TRIGGER_BOOKING_FLOW')
    
    // Calculate cost for tracking
    const usage = completion.usage
    const inputTokens = usage?.prompt_tokens || 0
    const outputTokens = usage?.completion_tokens || 0
    const totalTokens = usage?.total_tokens || 0
    
    // GPT-4 pricing (as of 2024)
    const costPerInputToken = 0.00003 // $0.03 per 1K tokens
    const costPerOutputToken = 0.00006 // $0.06 per 1K tokens
    const messageCost = (inputTokens * costPerInputToken) + (outputTokens * costPerOutputToken)

    return NextResponse.json({ 
      response: shouldTriggerBooking ? 
        "Great! I can help you schedule a consultation with our team. How would you prefer to connect?" : 
        aiResponse,
      triggerBooking: shouldTriggerBooking,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens,
        cost: messageCost
      }
    })

  } catch (error) {
    console.error('OpenAI API error:', error)
    
    // Fallback to mock response if OpenAI fails
    const fallbackResponse = getFallbackResponse(requestBody.message || '')
    
    return NextResponse.json(
      { 
        response: fallbackResponse.response,
        triggerBooking: fallbackResponse.triggerBooking,
        fallback: true
      },
      { status: 200 } // Return 200 so chatbot continues working
    )
  }
}

// Fallback responses if OpenAI API fails
function getFallbackResponse(message: string) {
  const input = message.toLowerCase()
  
  // Check for booking triggers
  const bookingTriggers = ['schedule', 'consultation', 'call', 'meeting', 'price', 'cost', 'interested', 'learn more']
  const shouldTriggerBooking = bookingTriggers.some(trigger => input.includes(trigger))

  if (shouldTriggerBooking) {
    return {
      response: "Great! I can help you schedule a consultation with our team. How would you prefer to connect?",
      triggerBooking: true
    }
  }

  // Service-specific fallbacks
  if (input.includes('automation')) {
    return {
      response: "Automation is where we really help West Texas businesses shine. We typically save our clients 15+ hours per week by automating lead responses, follow-up sequences, and administrative tasks. What kind of repetitive work is eating up your time?",
      triggerBooking: false
    }
  }
  
  if (input.includes('marketing') || input.includes('ads')) {
    return {
      response: "Our digital marketing focuses on getting you actual customers, not just likes and engagement. Our HVAC clients typically see $4-6 return for every $1 spent on ads. What's your main source of new customers right now?",
      triggerBooking: false
    }
  }
  
  if (input.includes('website') || input.includes('web')) {
    return {
      response: "We build websites that actually work for your business - automated lead capture, booking systems, everything connects to your workflow. Are you currently getting leads through your website, or is it just an online brochure?",
      triggerBooking: false
    }
  }
  
  if (input.includes('analytics') || input.includes('data')) {
    return {
      response: "Most business owners are flying blind on what actually drives growth. We set up dashboards that show which marketing channels bring in money, not just traffic. Do you currently track which lead sources are most profitable?",
      triggerBooking: false
    }
  }

  // Default fallback
  return {
    response: "That's a great question! Can you tell me more about your specific situation? What industry are you in, and what's your biggest challenge right now?",
    triggerBooking: false
  }
}