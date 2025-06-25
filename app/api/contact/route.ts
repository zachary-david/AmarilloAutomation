// app/api/contact/route.ts - Fixed date format and N8N URL issues
import { NextRequest, NextResponse } from 'next/server'

async function sendToAirtable(formData: any): Promise<{success: boolean, error?: string}> {
  try {
    console.log('🔧 Starting Airtable integration...')
    
    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      console.log('❌ Airtable credentials missing')
      return { success: false, error: 'Airtable credentials not configured' }
    }

    // Calculate lead score
    let score = 50
    const serviceScores: Record<string, number> = {
      'Workflow Automation': 30,
      'AI Services': 25,
      'Digital Marketing': 25,
      'General Consultation': 20
    }
    score += serviceScores[formData.serviceType] || 10

    const urgencyScores: Record<string, number> = {
      'urgent': 25,
      'soon': 20,
      'planning': 15,
      'exploring': 10
    }
    score += urgencyScores[formData.projectUrgency] || 5

    const sizeScores: Record<string, number> = {
      'enterprise': 25,
      'large': 20,
      'medium': 20,
      'small': 15,
      'startup': 10
    }
    score += sizeScores[formData.companySize] || 10

    const leadScore = Math.min(score, 100)
    const priority = leadScore >= 80 ? 'Hot Lead' : leadScore >= 65 ? 'Warm Lead' : leadScore >= 50 ? 'Qualified Lead' : 'Cold Lead'

    // Fix date format - Airtable expects YYYY-MM-DD format for date fields
    const submissionDate = new Date().toISOString().split('T')[0] // Gets YYYY-MM-DD

    const airtableData = {
  fields: {
    'Name': formData.name || 'Demo User',
    'Email': formData.email,
    'Company': formData.company || 'Demo Request',
    'Source': 'Website Contact Form'
  }
}

    console.log('🔧 Airtable payload with fixed date:')
    console.log('  - Submission Date:', submissionDate)
    console.log('  - Full payload:', JSON.stringify(airtableData, null, 2))

    const airtableUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Leads`
    
    const response = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(airtableData)
    })

    console.log('🔧 Airtable Response Status:', response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('❌ Airtable API Error:', errorData)
      return { success: false, error: `Airtable API error: ${response.status} - ${errorData}` }
    }

    const result = await response.json()
    console.log('✅ Lead saved to Airtable with ID:', result.id)
    return { success: true }

  } catch (error) {
    console.error('❌ Airtable integration failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown Airtable error' }
  }
}

async function sendFollowUpEmail(formData: any): Promise<{success: boolean, error?: string}> {
  try {
    console.log('🔧 Starting email automation...')
    
    const serviceMap: Record<string, string> = {
      'Workflow Automation': 'Workflow Automation',
      'Digital Marketing': 'Digital Marketing',
      'AI Services': 'AI Services',
      'General Consultation': 'General Consultation'
    }
    
    const serviceText = serviceMap[formData.serviceType] || formData.serviceType || 'your automation needs'
    const isIntroductoryOffer = formData.formType === 'introductory_offer'

     const firstName = formData.name.split(' ')[0] // "Garrett Zamora" → "Garrett"

    const emailTemplate = {
      to: formData.email,
      subject: isIntroductoryOffer ? 
        'Ready to get started with your automation bundle?' : 
        `Re: Your inquiry about ${serviceText}`,
      templateType: isIntroductoryOffer ? 'intro_offer_followup' : 'general_followup',
      personalData: {
        name: firstName, // 🎯 Use first name only
        fullName: formData.name, // Keep full name available if needed
        serviceType: serviceText,
        company: formData.company || '',
        hasCompany: !!formData.company
      },
      emailContent: {
        greeting: `Hey ${firstName},`, 
        mainMessage: isIntroductoryOffer ? 
          "Thanks for reaching out about the introductory offer. If you're ready to get started, I can send over an agreement and a quick questionnaire about the tech you're currently using." :
          `Thanks for reaching out on the website. Happy to answer any questions related to ${serviceText}.`,
        companyMessage: formData.company ? 
          `I see you're with ${formData.company} - I'd love to learn more about how automation could help streamline your operations.` : '',
        closing: isIntroductoryOffer ? "Thanks,\nGarrett" : "Feel free to reply with any specific questions or if you'd like to hop on a quick call to discuss your project.",
        signature: {
          name: "Garrett",
          company: "Amarillo Automation",
          email: "garrett@amarilloautomation.com",
          website: "amarilloautomation.com"
        }
      }
    }

    // Get webhook URL
    const webhookUrl = process.env.NODE_ENV === 'production' ? 
      process.env.N8N_WEBHOOK_PROD : 
      process.env.N8N_WEBHOOK_TEST

    console.log('🔧 N8N Debug Info:')
    console.log('  - NODE_ENV:', process.env.NODE_ENV)
    console.log('  - Using webhook URL:', webhookUrl)

    if (!webhookUrl) {
      console.log('❌ N8N webhook URL not configured')
      return { success: false, error: 'N8N webhook URL not configured' }
    }

    // Test if webhook is reachable first
    console.log('🔧 Testing N8N webhook connectivity...')
    
    const webhookPayload = {
      action: 'send_followup_email',
      emailData: emailTemplate,
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'website_contact_form',
        leadType: isIntroductoryOffer ? 'intro_offer' : 'general_inquiry'
      }
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload)
    })

    console.log('🔧 N8N Response:')
    console.log('  - Status:', response.status)
    console.log('  - StatusText:', response.statusText)
    console.log('  - OK:', response.ok)

    if (!response.ok) {
      const responseText = await response.text()
      console.error('❌ N8N webhook failed:')
      console.error('  - Status:', response.status)
      console.error('  - Response:', responseText)
      
      // Provide helpful error messages
      if (response.status === 404) {
        console.error('💡 404 Error suggests the webhook path is incorrect.')
        console.error('💡 Double-check your n8n webhook URL in the workflow.')
        console.error('💡 Current URL being used:', webhookUrl)
      }
      
      return { success: false, error: `N8N webhook failed: ${response.status} - ${responseText}` }
    }

    const responseData = await response.text()
    console.log('✅ N8N webhook successful, response:', responseData)
    return { success: true }

  } catch (error) {
    console.error('❌ N8N email webhook failed:', error)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('💡 Network error - is n8n running on localhost:5678?')
    }
    return { success: false, error: error instanceof Error ? error.message : 'Unknown email error' }
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📨 Contact API called')
    
    const body = await request.json()
    console.log('📋 Form data received:', {
      name: body.name,
      email: body.email,
      serviceType: body.serviceType,
      companySize: body.companySize,
      projectUrgency: body.projectUrgency
    })
    
    if (!body.name || !body.email || !body.message) {
      console.error('❌ Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message' },
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

    console.log('✅ Validation passed, processing integrations...')

    // Process Airtable integration
    const airtableResult = await sendToAirtable(body)
    console.log('📊 Airtable final result:', airtableResult)
    
    // Process email automation
    const emailResult = await sendFollowUpEmail(body)
    console.log('📧 Email final result:', emailResult)

    // Formspree backup
    let formspreeResult = { success: false }
    if (process.env.FORMSPREE_ENDPOINT) {
      try {
        const formspreeResponse = await fetch(process.env.FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...body,
            leadScore: body.leadScore,
            _subject: 'New Contact Form Submission - Amarillo Automation',
          }),
        })

        if (formspreeResponse.ok) {
          formspreeResult = { success: true }
          console.log('✅ Formspree backup successful')
        }
      } catch (error) {
        console.log('⚠️ Formspree backup error:', error)
      }
    }

    const response = {
      success: true,
      message: 'Contact form submitted successfully',
      integrations: {
        airtable: airtableResult.success ? 'saved' : 'failed',
        email: emailResult.success ? 'sent' : 'failed',
        formspree: formspreeResult.success ? 'sent' : 'skipped'
      },
      details: {
        airtableError: airtableResult.error,
        emailError: emailResult.error
      }
    }

    console.log('🎉 Contact form processing complete:', response)
    return NextResponse.json(response)

  } catch (error) {
    console.error('💥 Contact API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process contact form',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Contact API is working',
    timestamp: new Date().toISOString(),
    env: {
      hasAirtableKey: !!process.env.AIRTABLE_API_KEY,
      hasAirtableBase: !!process.env.AIRTABLE_BASE_ID,
      hasN8NWebhook: !!(process.env.N8N_WEBHOOK_TEST || process.env.N8N_WEBHOOK_PROD),
      hasFormspree: !!process.env.FORMSPREE_ENDPOINT,
      nodeEnv: process.env.NODE_ENV,
      n8nUrls: {
        test: process.env.N8N_WEBHOOK_TEST,
        prod: process.env.N8N_WEBHOOK_PROD,
        using: process.env.NODE_ENV === 'production' ? process.env.N8N_WEBHOOK_PROD : process.env.N8N_WEBHOOK_TEST
      }
    }
  })
}