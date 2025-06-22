// lib/email.ts - Email Integration via n8n Webhooks
interface EmailTemplateData {
  name: string
  email: string
  company?: string
  serviceType?: string
  message?: string
  isIntroductoryOffer?: boolean
}

// Email templates for n8n processing
export const generateGeneralFollowUpTemplate = (data: EmailTemplateData): object => {
  const serviceText = data.serviceType ? 
    getServiceDisplayName(data.serviceType) : 'your automation needs'
  
  return {
    to: data.email,
    subject: `Re: Your inquiry about ${serviceText}`,
    templateType: 'general_followup',
    personalData: {
      name: data.name,
      serviceType: serviceText,
      company: data.company || '',
      hasCompany: !!data.company
    },
    emailContent: {
      greeting: `Hey ${data.name},`,
      mainMessage: `Thanks for reaching out on the website. Happy to answer any questions related to ${serviceText}.`,
      companyMessage: data.company ? `I'd love to learn more about how automation could help ${data.company}.` : '',
      closing: "Feel free to reply with any specific questions or if you'd like to hop on a quick call to discuss your project.",
      signature: {
        name: "⚡ Garrett",
        company: "Amarillo Automation", 
        email: "garrett@amarilloautomation.com",
        website: "amarilloautomation.com"
      }
    }
  }
}

// Introductory offer follow-up template for n8n
export const generateIntroOfferFollowUpTemplate = (data: EmailTemplateData): object => {
  return {
    to: data.email,
    subject: 'Ready to get started with your automation bundle?',
    templateType: 'intro_offer_followup',
    personalData: {
      name: data.name,
      company: data.company || '',
      hasCompany: !!data.company
    },
    emailContent: {
      greeting: `Hey ${data.name},`,
      mainMessage: "Thanks for reaching out about the introductory offer. If you're ready to get started, I can send over an agreement and a quick questionnaire about the tech you're currently using.",
      companyMessage: data.company ? `For ${data.company}, I'm thinking we could probably knock out some solid time-saving automations that'll make a real difference in your day-to-day operations.` : '',
      beforeClosing: "Of course, happy to answer any questions beforehand.",
      closing: "Thanks,\nGarrett",
      automationBundle: {
        title: "🚀 Reminder: Done-For-You Automation Bundle",
        subtitle: "Up to 5 automations delivered in 10 days:",
        features: [
          "✅ Missed Call → Auto Text Back",
          "✅ New Lead → CRM Auto-Entry", 
          "✅ Auto Quote/Invoice Generator",
          "✅ Customer Onboarding Sequence",
          "✅ Google Review Request Flow"
        ]
      },
      signature: {
        name: "⚡ Garrett",
        company: "Amarillo Automation",
        email: "garrett@amarilloautomation.com", 
        website: "amarilloautomation.com"
      }
    }
  }
}

// Service type display names
function getServiceDisplayName(serviceType: string): string {
  const serviceMap: Record<string, string> = {
    'Workflow Automation': 'Workflow Automation',
    'Digital Marketing': 'Digital Marketing',
    'AI Services': 'AI Services', 
    'General Consultation': 'General Consultation'
  }
  return serviceMap[serviceType] || serviceType
}

// Send follow-up email via n8n webhook
export async function sendFollowUpEmail(data: EmailTemplateData): Promise<{success: boolean, error?: string}> {
  try {
    // Choose template based on submission type
    const emailTemplate = data.isIntroductoryOffer ? 
      generateIntroOfferFollowUpTemplate(data) : 
      generateGeneralFollowUpTemplate(data)
    
    // Send to n8n webhook for email processing
    const webhookUrl = process.env.NODE_ENV === 'production' ? 
      process.env.N8N_WEBHOOK_PROD : 
      process.env.N8N_WEBHOOK_TEST
    
    if (!webhookUrl) {
      throw new Error('N8N webhook URL not configured')
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'send_followup_email',
        emailData: emailTemplate,
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'website_contact_form',
          leadType: data.isIntroductoryOffer ? 'intro_offer' : 'general_inquiry'
        }
      })
    })

    if (!response.ok) {
      throw new Error(`N8N webhook failed: ${response.status}`)
    }

    console.log('✅ Follow-up email sent via n8n webhook')
    return { success: true }
    
  } catch (error) {
    console.error('❌ N8N email webhook failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown email error' 
    }
  }
}