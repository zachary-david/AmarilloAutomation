// app/api/introductory-offer/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { sendToAirtable } from '../../../lib/airtable'

interface IntroOfferData {
  businessName: string
  name: string
  email: string
  phone: string
  contactPreference: 'call' | 'email'
  package: 'basic' | 'standard' | 'premium'
  source: string
  selectedPackage?: {
    name: string
    automations: number
    description: string
  }
}

// Calculate lead score for introductory offer leads
function calculateIntroOfferScore(data: IntroOfferData): number {
  let score = 70 // High base score for introductory offer leads

  // Package scoring
  const packageScores: Record<string, number> = {
    'basic': 10,
    'standard': 20,
    'premium': 30
  }
  score += packageScores[data.package] || 15

  // Business name provided (indicates serious business)
  if (data.businessName && data.businessName.length > 2) {
    score += 10
  }

  // Phone provided (higher intent)
  if (data.phone && data.phone.length > 9) {
    score += 15
  }

  // Contact preference (call shows higher intent)
  if (data.contactPreference === 'call') {
    score += 5
  }

  return Math.min(score, 100)
}

// Determine lead quality
function getLeadQuality(score: number): 'high' | 'medium' | 'low' {
  if (score > 85) return 'high'
  if (score > 70) return 'medium'
  return 'low'
}

// Get package value for conversion tracking
function getPackageValue(packageType: string): number {
  const values: Record<string, number> = {
    'basic': 297,
    'standard': 497,
    'premium': 697
  }
  return values[packageType] || 497
}

export async function POST(request: NextRequest) {
  try {
    const body: IntroOfferData = await request.json()
    
    // Validate required fields
    if (!body.businessName || !body.name || !body.package) {
      return NextResponse.json(
        { error: 'Missing required information' },
        { status: 400 }
      )
    }

    // Validate contact info based on preference
    if (body.contactPreference === 'call' && !body.phone) {
      return NextResponse.json(
        { error: 'Phone number required for call preference' },
        { status: 400 }
      )
    }

    if (body.contactPreference === 'email' && !body.email) {
      return NextResponse.json(
        { error: 'Email address required for email preference' },
        { status: 400 }
      )
    }
    
    // Calculate lead scoring
    const leadScore = calculateIntroOfferScore(body)
    const leadQuality = getLeadQuality(leadScore)
    const conversionValue = getPackageValue(body.package)
    
    // Prepare data for Airtable with intro offer specifics
    const introOfferData = {
      ...body,
      timestamp: new Date().toISOString(),
      leadScore,
      leadQuality,
      conversionValue,
      offerType: 'introductory_offer'
    }
    
    // Store in Airtable (will gracefully handle missing config in dev)
    const airtableResult = await sendToAirtable(introOfferData)
    
    if (!airtableResult.success) {
      console.error('❌ Airtable integration failed:', airtableResult.error)
      // Continue processing even if Airtable fails - don't break user experience
    } else {
      console.log('✅ Intro offer lead successfully processed')
    }
    
    return NextResponse.json({
      success: true,
      leadScore,
      leadQuality,
      packageValue: conversionValue,
      message: 'Introductory offer submission received successfully'
    })
    
  } catch (error) {
    console.error('Introductory offer API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process introductory offer submission',
        message: 'Please try again or contact us directly.'
      },
      { status: 500 }
    )
  }
}

// GET handler for testing
export async function GET() {
  return NextResponse.json({ 
    message: 'Introductory Offer API endpoint is working',
    timestamp: new Date().toISOString(),
    packages: ['basic', 'standard', 'premium'],
    status: 'healthy'
  })
}