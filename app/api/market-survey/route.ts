// app/api/market-survey/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

// Types for the market survey
interface MarketSurveyData {
  businessType: string;
  businessSize: string;
  currentAIUsage: string;
  aiAwareness?: string;
  aiTools?: string[];
  painPoints: string[];
  leadSources?: string[];
  timeWasters?: string[];
  revenue?: string;
  growthGoals: string;
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
    company: string;
    urgency: string;
  };
  automationScore?: number;
  leadQuality?: string;
}

interface AirtableRecord {
  fields: {
    Name: string;
    Email: string;
    Phone?: string;
    Company: string;
    'Business Type': string;
    'Business Size': string;
    'Current Operations': string;
    'Pain Points': string;
    'Growth Goals': string;
    'Implementation Urgency': string;
    'Automation Score': number;
    'Lead Quality': string;
    'Submission Date': string;
    'Source': string;
    Status: string;
  };
}

// Calculate automation score based on survey responses
function calculateAutomationScore(data: MarketSurveyData): number {
  let score = 0;
  
  // Operational status scoring (0-25 points)
  const statusScores: Record<string, number> = { 
    'manual': 25, 
    'basic-tools': 20, 
    'some-automation': 15, 
    'integrated-systems': 10, 
    'advanced-automation': 5 
  };
  score += statusScores[data.currentAIUsage] || 0;
  
  // Pain points scoring (0-40 points) - more automatable pain points = higher score
  const automatablePains = [
    'lead-follow-up', 'manual-scheduling', 'data-entry', 'customer-questions',
    'inventory-tracking', 'marketing-tasks', 'billing-invoicing', 'lead-generation',
    'team-coordination', 'reporting-analytics'
  ];
  
  const userAutomatablePains = data.painPoints.filter(pain => 
    automatablePains.includes(pain)
  );
  score += Math.min(userAutomatablePains.length * 4, 40);
  
  // Business size scoring (0-20 points)
  const sizeScores: Record<string, number> = { 
    'solo': 10, 
    'small': 20, 
    'medium': 15, 
    'large': 10 
  };
  score += sizeScores[data.businessSize] || 0;
  
  // Urgency scoring (0-15 points)
  const urgencyScores: Record<string, number> = {
    'urgent': 15,
    'soon': 12,
    'planning': 8,
    'exploring': 3
  };
  score += urgencyScores[data.contactInfo.urgency] || 0;
  
  return Math.min(score, 100);
}

// Determine lead quality based on score and responses
function determineLeadQuality(score: number, data: MarketSurveyData): string {
  if (score > 70 || data.contactInfo.urgency === 'urgent') return 'high';
  if (score > 40 || data.painPoints.includes('lead-generation')) return 'medium';
  return 'low';
}

// Airtable integration
async function createAirtableRecord(data: MarketSurveyData, score: number, leadQuality: string) {
  const airtableData: AirtableRecord = {
    fields: {
      'Name': data.contactInfo.name,
      'Email': data.contactInfo.email,
      'Phone': data.contactInfo.phone || '',
      'Company': data.contactInfo.company,
      'Business Type': data.businessType,
      'Business Size': data.businessSize,
      'Current Operations': data.currentAIUsage,
      'Pain Points': data.painPoints.join(', '),
      'Growth Goals': data.growthGoals,
      'Implementation Urgency': data.contactInfo.urgency,
      'Automation Score': score,
      'Lead Quality': leadQuality,
      'Submission Date': new Date().toISOString(),
      'Source': 'Market Survey',
      'Status': 'New Lead'
    }
  };

  const response = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(process.env.AIRTABLE_TABLE_NAME!)}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(airtableData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Gmail integration with OAuth2
async function sendEmailNotification(data: MarketSurveyData, score: number, leadQuality: string) {
  // Alternative transporter configuration
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_FROM_EMAIL,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
  } as any);

  // Generate business recommendations based on survey data
  const getRecommendations = () => {
    const recs = [];
    if (data.painPoints.includes('lead-generation') || data.painPoints.includes('lead-follow-up')) {
      recs.push('🚀 Lead Generation Automation System');
    }
    if (data.painPoints.includes('manual-scheduling')) {
      recs.push('📅 Appointment Scheduling Automation');
    }
    if (data.painPoints.includes('data-entry') || data.painPoints.includes('billing-invoicing')) {
      recs.push('⚡ Business Process Automation');
    }
    if (data.painPoints.includes('customer-questions')) {
      recs.push('🤖 Customer Service Automation');
    }
    return recs.length > 0 ? recs : ['📊 Comprehensive Business Operations Assessment'];
  };

  const recommendations = getRecommendations();

  // Email to you (business notification)
  const adminEmailOptions = {
    from: `${process.env.GMAIL_FROM_NAME} <${process.env.GMAIL_FROM_EMAIL}>`,
    to: process.env.GMAIL_FROM_EMAIL,
    subject: `🎯 Market Survey Lead: ${data.contactInfo.name} - ${data.businessType} (Score: ${score}/100)`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d97706; border-bottom: 2px solid #d97706; padding-bottom: 10px;">
          🎯 New Market Survey Response
        </h2>
        
        <div style="background-color: ${leadQuality === 'high' ? '#dc2626' : leadQuality === 'medium' ? '#f59e0b' : '#6b7280'}; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="margin: 0; color: white;">Automation Score: ${score}/100</h3>
          <p style="margin: 5px 0 0 0;">Lead Quality: ${leadQuality.toUpperCase()}</p>
        </div>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${data.contactInfo.name}</p>
          <p><strong>Email:</strong> ${data.contactInfo.email}</p>
          <p><strong>Phone:</strong> ${data.contactInfo.phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${data.contactInfo.company}</p>
        </div>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Business Profile</h3>
          <p><strong>Business Type:</strong> ${data.businessType}</p>
          <p><strong>Business Size:</strong> ${data.businessSize}</p>
          <p><strong>Current Operations:</strong> ${data.currentAIUsage}</p>
          <p><strong>Implementation Timeline:</strong> ${data.contactInfo.urgency}</p>
        </div>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Pain Points & Opportunities</h3>
          <p><strong>Main Challenges:</strong> ${data.painPoints.join(', ')}</p>
          <p><strong>Primary Goal:</strong> ${data.growthGoals}</p>
          <p><strong>Recommended Solutions:</strong></p>
          <ul>
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>

        ${data.contactInfo.urgency === 'urgent' ? `
        <div style="background-color: #dc2626; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <p style="margin: 0;"><strong>🚨 URGENT LEAD:</strong> Client needs immediate implementation - Priority follow-up required!</p>
        </div>
        ` : ''}

        <div style="background-color: #d97706; color: white; padding: 15px; border-radius: 8px; text-align: center;">
          <p style="margin: 0;"><strong>Next Steps:</strong> Follow up within ${leadQuality === 'high' ? '2 hours' : leadQuality === 'medium' ? '4 hours' : '24 hours'} to maximize conversion!</p>
        </div>
      </div>
    `,
  };

  // Email to customer (survey results)
  const customerEmailOptions = {
    from: `${process.env.GMAIL_FROM_NAME} <${process.env.GMAIL_FROM_EMAIL}>`,
    to: data.contactInfo.email,
    subject: `Your Business Automation Assessment Results - ${data.contactInfo.company}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d97706; border-bottom: 2px solid #d97706; padding-bottom: 10px;">
          Thanks for Your Survey Response, ${data.contactInfo.name}! 🎯
        </h2>
        
        <p>We've analyzed your responses and identified some exciting automation opportunities for ${data.contactInfo.company}!</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="color: #374151; margin-top: 0;">Your Automation Opportunity Score</h3>
          <div style="font-size: 48px; font-weight: bold; color: #3b82f6; margin: 20px 0;">${score}</div>
          <p style="color: #374151; margin: 0;">
            ${score > 70 ? 'High automation potential - significant ROI opportunities!' :
              score > 40 ? 'Moderate automation potential - good efficiency gains possible!' :
              'Basic automation potential - foundational improvements available!'}
          </p>
        </div>

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">🚀 Recommended Next Steps</h3>
          <ul style="color: #374151; line-height: 1.8;">
            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>

        ${data.contactInfo.urgency === 'urgent' ? `
        <div style="background-color: #f59e0b; color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>🚨 Fast-Track Available:</strong> We'll prioritize your automation needs and contact you within 2 hours!</p>
        </div>
        ` : ''}

        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">📅 Schedule Your Strategy Session</h3>
          <p>Ready to discuss how automation can transform your business? Let's dive deeper into your specific needs:</p>
          <a href="https://cal.com/${process.env.CALCOM_USERNAME}" 
             style="display: inline-block; background-color: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0;">
            🎯 Book Your Free Automation Consultation
          </a>
          <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">
            Perfect for ${data.businessType} businesses looking to streamline operations and increase efficiency.
          </p>
        </div>

        <div style="background-color: #e5f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <h3 style="color: #1e40af; margin-top: 0;">💡 Market Insight</h3>
          <p style="color: #1e40af; margin: 0;">Based on our survey data, ${data.businessType} businesses typically see 15-30% efficiency gains within the first 3 months of implementing targeted automation solutions!</p>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; color: #6b7280;">
          <p>We're excited to help ${data.contactInfo.company} achieve greater efficiency and growth through smart automation!</p>
          <p><strong>The Amarillo Automation Team</strong><br>
          Transforming Texas Panhandle businesses with AI and automation<br>
          📧 admin@amarilloautomation.com</p>
        </div>
      </div>
    `,
  };

  // Send both emails
  await Promise.all([
    transporter.sendMail(adminEmailOptions),
    transporter.sendMail(customerEmailOptions)
  ]);
}

// Main API handler
export async function POST(request: NextRequest) {
  try {
    const surveyData: MarketSurveyData = await request.json();

    // Validate required fields
    if (!surveyData.contactInfo.name || !surveyData.contactInfo.email || !surveyData.contactInfo.company) {
      return NextResponse.json(
        { error: 'Missing required contact information' },
        { status: 400 }
      );
    }

    // Calculate automation score and lead quality
    const automationScore = calculateAutomationScore(surveyData);
    const leadQuality = determineLeadQuality(automationScore, surveyData);

    // Run integrations in parallel for speed
    const [airtableResult, emailResult] = await Promise.allSettled([
      createAirtableRecord(surveyData, automationScore, leadQuality),
      sendEmailNotification(surveyData, automationScore, leadQuality)
    ]);

    // Check if critical operations succeeded
    if (airtableResult.status === 'rejected') {
      console.error('Airtable error:', airtableResult.reason);
    }

    if (emailResult.status === 'rejected') {
      console.error('Email error:', emailResult.reason);
    }

    // Return success response with calculated values
    return NextResponse.json({
      success: true,
      automationScore,
      leadQuality,
      message: 'Survey submitted successfully',
      integrations: {
        airtable: airtableResult.status === 'fulfilled',
        email: emailResult.status === 'fulfilled'
      }
    });

  } catch (error) {
    console.error('Market Survey API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}