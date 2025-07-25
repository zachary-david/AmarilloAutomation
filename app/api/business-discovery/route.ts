// app/api/business-discovery/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Types
interface BusinessSearchParams {
  industry: string
  location: string
  radius?: number // in miles
  maxResults?: number
}

interface DiscoveredBusiness {
  placeId: string
  name: string
  address: string
  phone?: string
  website?: string
  rating?: number
  reviewCount?: number
  types: string[]
  email?: string
  emailSource?: 'hunter' | 'manual' | 'none'
  automationScore?: number
  leadScore?: number
  painPoints?: string[]
  airtableId?: string
  // Parsed address components
  parsedAddress?: {
    streetNumber: string
    streetName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

interface DiscoveryResponse {
  success: boolean
  businesses: DiscoveredBusiness[]
  totalFound: number
  savedToAirtable: number
  errors?: string[]
}

// Google Places API integration
async function searchBusinesses(params: BusinessSearchParams): Promise<any[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API
  
  if (!apiKey) {
    throw new Error('Google Places API key not configured')
  }

  try {
    // Text search for businesses
    const query = `${params.industry} in ${params.location}`
    const radiusInMiles = params.radius || 5 // Default 5 miles
    const radiusInMeters = Math.round(radiusInMiles * 1609.344) // Convert miles to meters
    
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&radius=${radiusInMeters}&key=${apiKey}`
    
    const response = await fetch(searchUrl)
    const data = await response.json()
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status}`)
    }
    
    // Limit results (reduce for Vercel timeout constraints)
    const isVercel = process.env.VERCEL === '1'
    const defaultMax = isVercel ? 10 : 20 // Smaller default for Vercel
    const maxResults = Math.min(params.maxResults || defaultMax, isVercel ? 15 : 50)
    return data.results.slice(0, maxResults)
  } catch (error) {
    console.error('Error searching businesses:', error)
    throw error
  }
}

// Get detailed business information
async function getBusinessDetails(placeId: string): Promise<any> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API
  
  if (!apiKey) {
    throw new Error('Google Places API key not configured')
  }

  try {
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,address_components,formatted_phone_number,website,rating,user_ratings_total,types&key=${apiKey}`
    
    const response = await fetch(detailsUrl)
    const data = await response.json()
    
    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`)
    }
    
    return data.result
  } catch (error) {
    console.error('Error getting business details:', error)
    throw error
  }
}

// Parse address components from Google Places API
function parseAddressComponents(addressComponents: any[] = []): {
  streetNumber: string
  streetName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
} {
  const parsed = {
    streetNumber: '',
    streetName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  }

  if (!addressComponents || !Array.isArray(addressComponents)) {
    console.warn('⚠️ No address components provided for parsing')
    return parsed
  }

  addressComponents.forEach((component) => {
    const types = component.types || []
    
    if (types.includes('street_number')) {
      parsed.streetNumber = component.long_name || ''
    }
    if (types.includes('route')) {
      parsed.streetName = component.long_name || ''
    }
    if (types.includes('locality')) {
      parsed.city = component.long_name || ''
    }
    if (types.includes('administrative_area_level_1')) {
      parsed.state = component.short_name || component.long_name || ''
    }
    if (types.includes('postal_code')) {
      parsed.zipCode = component.long_name || ''
    }
    if (types.includes('country')) {
      parsed.country = component.long_name || ''
    }
  })

  // Construct full address
  const addressParts = [parsed.streetNumber, parsed.streetName].filter(Boolean)
  parsed.address = addressParts.join(' ')
  
  // Log parsing results for debugging
  console.log('📍 Parsed address:', {
    streetNumber: parsed.streetNumber,
    streetName: parsed.streetName,
    fullAddress: parsed.address,
    city: parsed.city,
    state: parsed.state,
    zipCode: parsed.zipCode
  })

  return parsed
}

// Hunter.io email discovery
async function findBusinessEmail(domain: string, companyName: string): Promise<{ email?: string, source?: string }> {
  const apiKey = process.env.HUNTER_API_KEY
  
  if (!apiKey) {
    return { email: undefined, source: 'none' }
  }

  try {
    // Try domain search first
    if (domain) {
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
      const domainSearchUrl = `https://api.hunter.io/v2/domain-search?domain=${cleanDomain}&api_key=${apiKey}`
      
      const response = await fetch(domainSearchUrl)
      const data = await response.json()
      
      if (data.data && data.data.emails && data.data.emails.length > 0) {
        // Prefer info@, contact@, or highest confidence email
        const emails = data.data.emails
        const preferredEmail = 
          emails.find((e: any) => e.value.startsWith('info@')) ||
          emails.find((e: any) => e.value.startsWith('contact@')) ||
          emails.find((e: any) => e.value.startsWith('hello@')) ||
          emails[0]
        
        return { email: preferredEmail.value, source: 'hunter' }
      }
    }
    
    // Fallback: Try company name search
    const companySearchUrl = `https://api.hunter.io/v2/email-finder?company=${encodeURIComponent(companyName)}&api_key=${apiKey}`
    
    const companyResponse = await fetch(companySearchUrl)
    const companyData = await companyResponse.json()
    
    if (companyData.data && companyData.data.email) {
      return { email: companyData.data.email, source: 'hunter' }
    }
    
    return { email: undefined, source: 'none' }
  } catch (error) {
    console.error('Error finding email:', error)
    return { email: undefined, source: 'none' }
  }
}

// Calculate automation potential score
function calculateAutomationScore(business: any): number {
  let score = 50 // Base score
  
  // Industry indicators (service businesses have high automation potential)
  const highPotentialTypes = [
    'contractor', 'plumber', 'electrician', 'roofer', 'painter',
    'hvac_contractor', 'locksmith', 'moving_company', 'home_goods_store',
    'real_estate_agency', 'insurance_agency', 'lawyer', 'accounting',
    'dentist', 'doctor', 'beauty_salon', 'hair_care', 'spa'
  ]
  
  if (business.types?.some((type: string) => highPotentialTypes.includes(type))) {
    score += 20
  }
  
  // No website = high automation potential
  if (!business.website) {
    score += 15
  }
  
  // Lower rating might indicate operational issues
  if (business.rating && business.rating < 4.0) {
    score += 10
  }
  
  // High review count = busy business that needs automation
  if (business.reviewCount && business.reviewCount > 50) {
    score += 10
  }
  
  return Math.min(score, 100)
}

// Identify potential pain points
function identifyPainPoints(business: any): string[] {
  const painPoints = []
  
  if (!business.website) {
    painPoints.push('no_website')
  }
  
  if (business.rating && business.rating < 4.0) {
    painPoints.push('reputation_management')
  }
  
  if (business.reviewCount && business.reviewCount > 100) {
    painPoints.push('high_volume_inquiries')
  }
  
  // Service businesses typically have these pain points
  if (business.types?.some((type: string) => type.includes('contractor') || type.includes('plumber'))) {
    painPoints.push('appointment_scheduling', 'lead_follow_up', 'quote_generation')
  }
  
  return painPoints
}

// Map industry to valid Airtable options
function mapToValidIndustry(industry: string): string {
  const industryLower = industry.toLowerCase()
  
  // Direct mappings to available options
  if (industryLower.includes('hvac') || industryLower.includes('heating') || industryLower.includes('cooling') || industryLower.includes('air condition')) {
    return 'HVAC'
  }
  if (industryLower.includes('plumb')) {
    return 'Plumbing'
  }
  if (industryLower.includes('roof')) {
    return 'Roofing'
  }
  
  // Default to HVAC if no match (since we need a valid option)
  // In production, you might want to handle this differently
  return 'HVAC'
}

// Calculate lead score
function calculateLeadScore(business: DiscoveredBusiness): number {
  let score = 30 // Base score for discovered lead
  
  // Has email = higher score
  if (business.email) {
    score += 20
  }
  
  // High automation potential
  if (business.automationScore && business.automationScore > 70) {
    score += 20
  }
  
  // Has website (easier to work with)
  if (business.website) {
    score += 10
  }
  
  // Good rating (quality business)
  if (business.rating && business.rating >= 4.0) {
    score += 10
  }
  
  // Multiple pain points
  if (business.painPoints && business.painPoints.length > 2) {
    score += 10
  }
  
  return Math.min(score, 100)
}

// Main discovery handler
export async function POST(req: NextRequest) {
  try {
    // Check critical environment variables first
    const missingVars = []
    if (!process.env.GOOGLE_PLACES_API_KEY && !process.env.GOOGLE_PLACES_API) {
      missingVars.push('GOOGLE_PLACES_API_KEY or GOOGLE_PLACES_API')
    }
    if (!process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN) {
      missingVars.push('AIRTABLE_PERSONAL_ACCESS_TOKEN')
    }
    if (!process.env.AIRTABLE_BASE_ID) {
      missingVars.push('AIRTABLE_BASE_ID')
    }
    
    if (missingVars.length > 0) {
      console.error('Missing required environment variables:', missingVars)
      return NextResponse.json(
        { 
          error: 'Service configuration error',
          details: process.env.NODE_ENV === 'development' 
            ? `Missing environment variables: ${missingVars.join(', ')}`
            : 'The business discovery service is not properly configured. Please contact support.'
        },
        { status: 500 }
      )
    }
    
    const body = await req.json()
    const { industry, location, radius, maxResults } = body as BusinessSearchParams
    
    if (!industry || !location) {
      return NextResponse.json(
        { error: 'Industry and location are required' },
        { status: 400 }
      )
    }
    
    const response: DiscoveryResponse = {
      success: false,
      businesses: [],
      totalFound: 0,
      savedToAirtable: 0,
      errors: []
    }
    
    // Step 1: Search for businesses
    console.log(`🔍 Searching for ${industry} businesses in ${location}...`)
    let searchResults
    try {
      searchResults = await searchBusinesses({ industry, location, radius, maxResults })
    } catch (searchError) {
      console.error('Failed to search businesses:', searchError)
      return NextResponse.json(
        { 
          error: 'Failed to search businesses',
          details: searchError instanceof Error ? searchError.message : 'Unknown search error'
        },
        { status: 500 }
      )
    }
    response.totalFound = searchResults.length
    
    // Step 2: Enrich each business
    // Process in parallel to avoid Vercel timeout (10s on hobby plan)
    const enrichmentPromises = searchResults.map(async (place) => {
      try {
        // Get detailed information
        const details = await getBusinessDetails(place.place_id)
        
        // Find email if website exists
        let emailInfo: { email?: string, source?: string } = { email: undefined, source: 'none' }
        if (details.website) {
          emailInfo = await findBusinessEmail(details.website, details.name)
        }
        
        // Parse address components with error handling
        let addressParsed
        try {
          addressParsed = parseAddressComponents(details.address_components)
        } catch (error) {
          console.error('Error parsing address components:', error)
          // Fallback to empty parsed address
          addressParsed = {
            streetNumber: '',
            streetName: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          }
        }
        
        // Calculate scores and identify pain points
        const automationScore = calculateAutomationScore(details)
        const painPoints = identifyPainPoints(details)
        
        // Build enriched business object
        const enrichedBusiness: DiscoveredBusiness = {
          placeId: place.place_id,
          name: details.name,
          address: details.formatted_address,
          phone: details.formatted_phone_number,
          website: details.website,
          rating: details.rating,
          reviewCount: details.user_ratings_total,
          types: details.types || [],
          email: emailInfo.email,
          emailSource: emailInfo.source as any,
          automationScore,
          painPoints,
          leadScore: 0, // Will calculate after
          parsedAddress: addressParsed
        }
        
        // Calculate lead score with all data
        enrichedBusiness.leadScore = calculateLeadScore(enrichedBusiness)
        
        response.businesses.push(enrichedBusiness)
        
        // Step 3: Save to Airtable (all leads regardless of score)
        if (true) {
          // Generate notes as a string
          const notesArray = [
            `Business Discovery - ${industry} in ${location}`,
            `Industry Searched: ${industry}`,
            `Full Address: ${enrichedBusiness.address}`,
            `Parsed Address: ${enrichedBusiness.parsedAddress?.address || 'N/A'}, ${enrichedBusiness.parsedAddress?.city || 'N/A'}, ${enrichedBusiness.parsedAddress?.state || 'N/A'} ${enrichedBusiness.parsedAddress?.zipCode || 'N/A'}`,
            enrichedBusiness.website ? `Website: ${enrichedBusiness.website}` : 'No website',
            `Rating: ${enrichedBusiness.rating || 'N/A'} (${enrichedBusiness.reviewCount || 0} reviews)`,
            `Automation Score: ${enrichedBusiness.automationScore}%`,
            enrichedBusiness.email ? `Email: ${enrichedBusiness.email} (${enrichedBusiness.emailSource})` : 'No email found',
            enrichedBusiness.painPoints && enrichedBusiness.painPoints.length > 0 
              ? `Pain Points: ${enrichedBusiness.painPoints.join(', ')}` 
              : '',
            `Google Place ID: ${enrichedBusiness.placeId}`
          ].filter(Boolean).join('\n')
          
          // Create Airtable-compatible data for Business Intelligence table
          const airtableData = {
            fields: {
              'Business Name': enrichedBusiness.name,
              'Industry': mapToValidIndustry(industry),
              'Address': enrichedBusiness.parsedAddress?.address || enrichedBusiness.address?.split(',')[0] || enrichedBusiness.address || '',
              'City': enrichedBusiness.parsedAddress?.city || '',
              'State': enrichedBusiness.parsedAddress?.state || '',
              'Zip Code': enrichedBusiness.parsedAddress?.zipCode || '',
              'Phone': enrichedBusiness.phone || '',
              'Website': enrichedBusiness.website || '',
              'Google Rating': enrichedBusiness.rating ? Math.round(enrichedBusiness.rating) : undefined,
              'Review Count': enrichedBusiness.reviewCount || 0,
              'Business Status': 'Operational',
              'Discovery Date': new Date().toISOString().split('T')[0], // YYYY-MM-DD format
              'Google Place ID': enrichedBusiness.placeId,
              'Primary Email': enrichedBusiness.email || '',
              'Email Confidence Score': enrichedBusiness.email ? (enrichedBusiness.emailSource === 'hunter' ? 85 : 50) : 0,
              'Outreach Status': 'Not Contacted',
              'Notes': notesArray,
              'AI Analysis': `Automation Score: ${enrichedBusiness.automationScore}%\n` +
                           `Pain Points: ${enrichedBusiness.painPoints?.join(', ') || 'None identified'}\n` +
                           `Email Source: ${enrichedBusiness.emailSource || 'Not found'}`,
              'Lead Score': enrichedBusiness.leadScore,
              'Revenue Potential': enrichedBusiness.leadScore >= 80 ? 'High' : 
                                 enrichedBusiness.leadScore >= 65 ? 'Medium' : 'Low'
            }
          }
          
          try {
            // Direct Airtable API call for better error handling
            const apiKey = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN
            const baseId = process.env.AIRTABLE_BASE_ID
            
            if (!apiKey || !baseId) {
              console.error('❌ Airtable not configured')
              response.errors?.push(`Airtable not configured for ${enrichedBusiness.name}`)
              return enrichedBusiness
            }
            
            const airtableResponse = await fetch(
              `https://api.airtable.com/v0/${baseId}/Business%20Intelligence`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${apiKey}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(airtableData)
              }
            )
            
            const airtableResult = await airtableResponse.json()
            
            if (airtableResponse.ok) {
              console.log(`✅ Saved ${enrichedBusiness.name} to Airtable:`, airtableResult.id)
              enrichedBusiness.airtableId = airtableResult.id
            } else {
              console.error(`❌ Failed to save ${enrichedBusiness.name} to Airtable:`, airtableResult)
              console.error('Airtable request data:', JSON.stringify(airtableData, null, 2))
              response.errors?.push(`Airtable error for ${enrichedBusiness.name}: ${JSON.stringify(airtableResult.error)}`)
            }
          } catch (saveError) {
            console.error(`❌ Error saving ${enrichedBusiness.name} to Airtable:`, saveError)
            response.errors?.push(`Failed to save ${enrichedBusiness.name}: ${saveError}`)
          }
        }
        
        return enrichedBusiness
      } catch (error) {
        console.error(`Error processing business ${place.name}:`, error)
        response.errors?.push(`Failed to process ${place.name}`)
        return null
      }
    })
    
    // Wait for all enrichments to complete (with timeout for Vercel)
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Enrichment timeout - Vercel limit approaching')), 8000)
    )
    
    try {
      const enrichmentResults = await Promise.race([
        Promise.all(enrichmentPromises),
        timeoutPromise
      ])
      
      // Filter out failed enrichments
      response.businesses = enrichmentResults.filter(business => business !== null) as DiscoveredBusiness[]
    } catch (timeoutError) {
      console.warn('⚠️ Enrichment timeout reached, returning partial results')
      // Get whatever results completed before timeout
      const settledResults = await Promise.allSettled(enrichmentPromises)
      response.businesses = settledResults
        .filter(result => result.status === 'fulfilled' && result.value !== null)
        .map(result => (result as PromiseFulfilledResult<DiscoveredBusiness>).value)
      response.errors?.push('Some businesses could not be processed due to timeout')
    }
    
    response.success = true
    response.savedToAirtable = response.businesses.filter(b => b.airtableId).length
    
    console.log(`✅ Discovery complete: Found ${response.totalFound} businesses, enriched ${response.businesses.length}, saved ${response.savedToAirtable} to Airtable`)
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Business discovery error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to discover businesses', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

// GET endpoint for testing
export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'Business Discovery API',
    endpoints: {
      POST: {
        description: 'Discover and enrich local businesses',
        parameters: {
          industry: 'Business type to search for (e.g., "plumber", "restaurant")',
          location: 'Location to search in (e.g., "Amarillo, TX")',
          radius: 'Search radius in miles (optional, default: 5)',
          maxResults: 'Maximum number of results (optional, default: 20)'
        },
        example: {
          industry: 'plumber',
          location: 'Amarillo, TX',
          radius: 25,
          maxResults: 10
        }
      }
    }
  })
}