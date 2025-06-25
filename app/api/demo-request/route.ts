// app/api/demo-request/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendDemoLeadToAirtable } from '../../../lib/airtable'

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Demo request API called')
    
    const body = await request.json()
    console.log('📋 Demo request data received:', {
      email: body.email,
      source: body.source,
      timestamp: body.timestamp
    })
    
    // Validate email
    if (!body.email) {
      console.error('❌ Missing email')
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      console.error('❌ Invalid email format')
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    console.log('✅ Validation passed, sending to AirTable...')

    // Send to AirTable using existing function
    const airtableResult = await sendDemoLeadToAirtable({
      email: body.email,
      source: body.source || 'demo_page',
      timestamp: body.timestamp || new Date().toISOString(),
      userAgent: body.user_agent
    })
    
    console.log('📊 AirTable result:', airtableResult)

    // Always return success to keep demo working
    return NextResponse.json({
      success: true,
      message: 'Demo request submitted successfully',
      integrations: {
        airtable: airtableResult.success ? 'saved' : 'failed'
      },
      details: {
        airtableError: airtableResult.error
      }
    })

  } catch (error) {
    console.error('💥 Demo request API error:', error)
    
    // Always return success to keep demo working
    return NextResponse.json({
      success: true,
      message: 'Demo request submitted successfully',
      note: 'Processed in fallback mode',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Demo Request API is working',
    timestamp: new Date().toISOString(),
    status: 'active'
  })
}