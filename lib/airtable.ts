// lib/airtable.ts - Complete Airtable CRM Integration
// Works without installing airtable package - graceful fallback

interface LeadRecord {
  name: string
  email: string
  phone?: string
  company: string
  source: string
  leadScore?: number
  notes?: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'
  automationScore?: number
  painPoints?: string[]
  urgency?: string
  timestamp: string
}

// Airtable record type with proper typing
interface AirtableRecord {
  [key: string]: any
  'Name': string
  'Email'?: string
  'Phone'?: string
  'Company': string
  'Source': string
  'Lead Score'?: number
  'Notes'?: string
  'Status': string
  'Created': string
}

// Utility function to safely get environment variables
function getAirtableConfig() {
  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID
  
  if (!apiKey || !baseId) {
    console.log('⚠️ Airtable not configured (missing API key or base ID)')
    return null
  }
  
  return { apiKey, baseId }
}

// Safe Airtable import function that handles missing package
async function getAirtableInstance() {
  try {
    // Use require instead of import to avoid TypeScript module resolution
    const AirtableModule = await eval('import("airtable")')
    return AirtableModule.default
  } catch (error) {
    console.log('⚠️ Airtable package not installed. Install with: npm install airtable')
    return null
  }
}

// Send data to Airtable
export async function sendToAirtable(leadData: any): Promise<{success: boolean, error?: string}> {
  try {
    const config = getAirtableConfig()
    if (!config) {
      console.log('📝 Development mode - would save lead:', leadData.contactInfo?.name || leadData.name || 'Unknown')
      return { success: true }
    }

    const Airtable = await getAirtableInstance()
    if (!Airtable) {
      console.log('📝 Airtable package not available - would save lead:', leadData.contactInfo?.name || leadData.name || 'Unknown')
      return { success: true }
    }
    
    const base = new Airtable({
      apiKey: config.apiKey
    }).base(config.baseId)

    // Safely extract data with fallbacks
    const contactInfo = leadData.contactInfo || {}
    const record: LeadRecord = {
      name: contactInfo.name || leadData.name || 'Unknown',
      email: contactInfo.email || leadData.email || '',
      phone: contactInfo.phone || leadData.phone || '',
      company: contactInfo.company || leadData.company || leadData.businessName || '',
      source: leadData.source || 'website_form',
      leadScore: leadData.automationScore || leadData.leadScore || 0,
      notes: generateNotes(leadData),
      status: 'new',
      automationScore: leadData.automationScore || 0,
      painPoints: leadData.painPoints || [],
      urgency: contactInfo.urgency || leadData.urgency || 'planning',
      timestamp: leadData.timestamp || new Date().toISOString()
    }

    // Create record with proper typing
    const airtableRecord: AirtableRecord = {
      'Name': record.name,
      'Company': record.company,
      'Source': record.source,
      'Lead Score': record.leadScore,
      'Notes': record.notes,
      'Status': record.status,
      'Created': record.timestamp
    }

    // Only add optional fields if they exist
    if (record.email) airtableRecord['Email'] = record.email
    if (record.phone) airtableRecord['Phone'] = record.phone
    if (record.automationScore) airtableRecord['Automation Score'] = record.automationScore
    if (record.painPoints && record.painPoints.length > 0) {
      airtableRecord['Pain Points'] = record.painPoints.join(', ')
    }
    if (record.urgency) airtableRecord['Urgency'] = record.urgency

    const result = await base('Leads').create([{ fields: airtableRecord }])

    console.log('✅ Lead saved to Airtable:', result[0].id)
    return { success: true }

  } catch (error) {
    console.error('❌ Airtable integration error:', error)
    
    // Return specific error information but don't fail the form
    const errorMessage = error instanceof Error ? error.message : 'Unknown Airtable error'
    console.log('📝 Form submission continues despite Airtable error')
    return { 
      success: true, // Keep form working
      error: errorMessage
    }
  }
}

// Generate notes with safe property access
function generateNotes(leadData: any): string {
  const notes = []
  
  if (leadData.businessType) notes.push(`Business Type: ${leadData.businessType}`)
  if (leadData.painPoints && leadData.painPoints.length > 0) {
    notes.push(`Pain Points: ${leadData.painPoints.join(', ')}`)
  }
  if (leadData.recommendations && leadData.recommendations.length > 0) {
    const recTitles = leadData.recommendations.map((r: any) => r.title || r).join(', ')
    notes.push(`Recommendations: ${recTitles}`)
  }
  if (leadData.contactPreference) notes.push(`Contact Preference: ${leadData.contactPreference}`)
  if (leadData.selectedPackage) {
    notes.push(`Package: ${leadData.selectedPackage.name || leadData.package}`)
  }
  
  return notes.length > 0 ? notes.join('\n') : 'Lead submission from website'
}

// Find existing lead by email
export async function findLeadByEmail(email: string): Promise<any | null> {
  try {
    const config = getAirtableConfig()
    if (!config) return null

    const Airtable = await getAirtableInstance()
    if (!Airtable) return null

    const base = new Airtable({
      apiKey: config.apiKey
    }).base(config.baseId)

    const records = await base('Leads').select({
      filterByFormula: `{Email} = "${email}"`,
      maxRecords: 1
    }).firstPage()

    return records.length > 0 ? records[0] : null
  } catch (error) {
    console.error('Error finding lead:', error)
    return null
  }
}

// Update lead status
export async function updateLeadStatus(recordId: string, status: string, notes?: string): Promise<boolean> {
  try {
    const config = getAirtableConfig()
    if (!config) return false

    const Airtable = await getAirtableInstance()
    if (!Airtable) return false

    const base = new Airtable({
      apiKey: config.apiKey
    }).base(config.baseId)

    const updateFields: AirtableRecord = { 
      'Name': '', // Required field but we're only updating
      'Company': '',
      'Source': '',
      'Status': status,
      'Created': ''
    }
    if (notes) updateFields['Notes'] = notes

    await base('Leads').update([{ id: recordId, fields: updateFields }])
    return true
  } catch (error) {
    console.error('Error updating lead:', error)
    return false
  }
}

// Demo form integration
export async function sendDemoLeadToAirtable(demoData: any): Promise<{success: boolean, error?: string}> {
  try {
    const config = getAirtableConfig()
    if (!config) {
      console.log('📝 Demo lead captured (dev mode):', demoData.email || 'Unknown email')
      return { success: true }
    }

    const Airtable = await getAirtableInstance()
    if (!Airtable) {
      console.log('📝 Demo lead captured (no Airtable):', demoData.email || 'Unknown email')
      return { success: true }
    }

    const base = new Airtable({
      apiKey: config.apiKey
    }).base(config.baseId)

    const airtableRecord: AirtableRecord = {
      'Name': demoData.email ? demoData.email.split('@')[0] : 'Demo User',
      'Email': demoData.email || '',
      'Company': demoData.product || 'Demo User',
      'Source': 'ai_demo',
      'Lead Score': 85,
      'Notes': `AI Demo Submission\nProduct: ${demoData.product || 'Not specified'}\nDescription: ${demoData.productDescription || 'Not specified'}`,
      'Status': 'new',
      'Created': new Date().toISOString()
    }

    const result = await base('Leads').create([{ fields: airtableRecord }])

    console.log('✅ Demo lead saved to Airtable:', result[0].id)
    return { success: true }

  } catch (error) {
    console.error('❌ Demo Airtable integration error:', error)
    return { 
      success: true, // Keep demo working
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Introductory Offer form integration - EXPORTED FUNCTION
export async function sendIntroOfferToAirtable(offerData: any): Promise<{success: boolean, error?: string}> {
  try {
    const config = getAirtableConfig()
    if (!config) {
      console.log('📝 Intro offer captured (dev mode):', {
        business: offerData.businessName || 'Unknown business',
        name: offerData.name || 'Unknown name',
        package: offerData.package || 'Unknown package'
      })
      return { success: true }
    }

    const Airtable = await getAirtableInstance()
    if (!Airtable) {
      console.log('📝 Intro offer captured (no Airtable):', {
        business: offerData.businessName || 'Unknown business',
        name: offerData.name || 'Unknown name',
        package: offerData.package || 'Unknown package'
      })
      return { success: true }
    }

    const base = new Airtable({
      apiKey: config.apiKey
    }).base(config.baseId)

    // Prepare record with safe property access and proper typing
    const airtableRecord: AirtableRecord = {
      'Name': offerData.name || 'Unknown',
      'Company': offerData.businessName || offerData.company || 'Unknown',
      'Source': 'introductory_offer',
      'Lead Score': offerData.leadScore || 80,
      'Notes': generateIntroOfferNotes(offerData),
      'Status': 'new',
      'Package Type': offerData.package || 'unknown',
      'Offer Type': 'introductory_offer',
      'Created': offerData.timestamp || new Date().toISOString()
    }

    // Add contact info based on preference
    if (offerData.email) airtableRecord['Email'] = offerData.email
    if (offerData.phone) airtableRecord['Phone'] = offerData.phone
    if (offerData.conversionValue) airtableRecord['Conversion Value'] = offerData.conversionValue

    const result = await base('Leads').create([{ fields: airtableRecord }])

    console.log('✅ Introductory offer lead saved to Airtable:', result[0].id)
    return { success: true }

  } catch (error) {
    console.error('❌ Introductory offer Airtable integration error:', error)
    return { 
      success: true, // Keep form working
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Generate notes for intro offer with safe property access
function generateIntroOfferNotes(offerData: any): string {
  const notes = ['Introductory Offer Submission']
  
  if (offerData.businessName) notes.push(`Business: ${offerData.businessName}`)
  if (offerData.selectedPackage?.name) {
    notes.push(`Package: ${offerData.selectedPackage.name}`)
  } else if (offerData.package) {
    notes.push(`Package Type: ${offerData.package}`)
  }
  if (offerData.contactPreference) notes.push(`Contact Preference: ${offerData.contactPreference}`)
  if (offerData.selectedPackage?.automations) {
    notes.push(`Automations: ${offerData.selectedPackage.automations}`)
  }
  
  return notes.join('\n')
}