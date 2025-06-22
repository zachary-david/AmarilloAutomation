// lib/airtable.ts - Airtable CRM Integration
interface ContactFormData {
  name: string
  email: string
  company?: string
  serviceType?: string
  companySize?: string
  projectUrgency?: string
  message: string
  leadScore?: number
}

interface AirtableRecord {
  fields: {
    Name: string
    Email: string
    Company?: string
    'Service Type'?: string
    'Company Size'?: string
    'Project Urgency'?: string
    Message: string
    'Lead Score'?: number
    'Lead Priority'?: string
    'Submission Date': string
    Source: string
    Status: string
  }
}

// Lead scoring based on urgency (as requested)
export function calculateLeadScore(formData: ContactFormData): number {
  let score = 50 // Base score

  // Primary scoring based on urgency
  const urgencyScores: Record<string, number> = {
    'urgent': 40,        // Rush delivery = highest priority
    'soon': 30,          // 2-4 weeks = high priority  
    'planning': 20,      // 1-3 months = medium priority
    'exploring': 10      // Research phase = lower priority
  }
  score += urgencyScores[formData.projectUrgency || ''] || 0

  // Secondary scoring factors
  const serviceScores: Record<string, number> = {
    'Workflow Automation': 15,        // High-value service
    'AI Services': 15,               // High-value AI service
    'Digital Marketing': 12,          // Direct ROI service
    'General Consultation': 5        // Discovery phase
  }
  score += serviceScores[formData.serviceType || ''] || 0

  // Company size bonus
  const sizeScores: Record<string, number> = {
    'enterprise': 15,
    'large': 12,
    'medium': 10,
    'small': 8,
    'startup': 5
  }
  score += sizeScores[formData.companySize || ''] || 0

  return Math.min(score, 100) // Cap at 100
}

// Determine lead priority based on score
export function getLeadPriority(score: number): string {
  if (score >= 80) return 'Hot Lead'
  if (score >= 65) return 'Warm Lead'
  if (score >= 50) return 'Qualified Lead'
  return 'Cold Lead'
}

// Send data to Airtable
export async function sendToAirtable(formData: ContactFormData): Promise<{success: boolean, error?: string}> {
  try {
    const score = calculateLeadScore(formData)
    const priority = getLeadPriority(score)

    const airtableData: AirtableRecord = {
      fields: {
        'Name': formData.name,
        'Email': formData.email,
        'Company': formData.company || '',
        'Service Type': formData.serviceType || '',
        'Company Size': formData.companySize || '',
        'Project Urgency': formData.projectUrgency || '',
        'Message': formData.message,
        'Lead Score': score,
        'Lead Priority': priority,
        'Submission Date': new Date().toISOString(),
        'Source': 'Website Contact Form',
        'Status': 'New'
      }
    }

    const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(airtableData)
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Airtable API Error:', errorData)
      return { success: false, error: `Airtable API error: ${response.status}` }
    }

    const result = await response.json()
    console.log('✅ Lead saved to Airtable:', result.id)
    return { success: true }

  } catch (error) {
    console.error('❌ Airtable integration failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}