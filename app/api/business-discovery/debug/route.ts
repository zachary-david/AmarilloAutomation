// Diagnostic endpoint for business-discovery
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Check environment variables
  const envCheck = {
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL ? 'Yes' : 'No',
    hasGoogleAPI: !!process.env.GOOGLE_PLACES_API || !!process.env.GOOGLE_PLACES_API_KEY,
    hasAirtableToken: !!process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
    hasAirtableBase: !!process.env.AIRTABLE_BASE_ID,
    hasHunterAPI: !!process.env.HUNTER_API_KEY,
  }

  // Test Google Places API
  let googleAPITest = { status: 'Not tested', error: null }
  const googleAPIKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API
  
  if (googleAPIKey) {
    try {
      const testUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurant+in+Amarillo&key=${googleAPIKey}`
      const response = await fetch(testUrl)
      const data = await response.json()
      googleAPITest = {
        status: data.status,
        error: data.error_message || null,
        resultsFound: data.results ? data.results.length : 0
      }
    } catch (error) {
      googleAPITest = {
        status: 'Failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        resultsFound: 0
      }
    }
  }

  // Test Airtable connection
  let airtableTest = { status: 'Not tested', error: null }
  if (process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN && process.env.AIRTABLE_BASE_ID) {
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Business%20Intelligence?maxRecords=1`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN}`
          }
        }
      )
      
      if (response.ok) {
        airtableTest = { status: 'Connected', error: null }
      } else {
        const error = await response.json()
        airtableTest = { status: 'Failed', error: error.error || response.statusText }
      }
    } catch (error) {
      airtableTest = {
        status: 'Failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Function runtime info
  const runtimeInfo = {
    platform: process.platform,
    nodeVersion: process.version,
    memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
    uptime: Math.round(process.uptime()) + ' seconds'
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    envCheck,
    googleAPITest,
    airtableTest,
    runtimeInfo,
    recommendation: getRecommendation(envCheck, googleAPITest, airtableTest)
  })
}

function getRecommendation(envCheck: any, googleAPITest: any, airtableTest: any): string[] {
  const recommendations = []
  
  if (!envCheck.hasGoogleAPI) {
    recommendations.push('Add GOOGLE_PLACES_API or GOOGLE_PLACES_API_KEY to Vercel environment variables')
  }
  
  if (!envCheck.hasAirtableToken || !envCheck.hasAirtableBase) {
    recommendations.push('Add AIRTABLE_PERSONAL_ACCESS_TOKEN and AIRTABLE_BASE_ID to Vercel environment variables')
  }
  
  if (googleAPITest.status === 'REQUEST_DENIED') {
    recommendations.push('Google API key has restrictions. Check IP restrictions in Google Cloud Console')
  }
  
  if (googleAPITest.status === 'OVER_QUERY_LIMIT') {
    recommendations.push('Google Places API quota exceeded. Check usage in Google Cloud Console')
  }
  
  if (airtableTest.status === 'Failed') {
    recommendations.push('Airtable connection failed. Verify access token and base ID are correct')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('All systems operational!')
  }
  
  return recommendations
}