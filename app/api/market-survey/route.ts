// app/api/market-survey/route.ts
// Cloudflare Pages compatible version (no nodemailer)
import { NextRequest, NextResponse } from 'next/server';

// Types for the market survey
interface MarketSurveyData {
  businessType: string;
  businessSize: string;
  currentAIUsage: string;
  painPoints: string[];
  growthGoals: string;
  contactInfo: {
    name: string;
    email: string;
    phone?: string;
    company: string;
    urgency: string;
  };
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
  
  // Pain points scoring (0-40 points)
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

// Airtable integration only (no email for now)
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

// Simple email notification using fetch (no nodemailer)
async function sendSimpleEmailNotification(data: MarketSurveyData, score: number, leadQuality: string) {
  // For now, we'll log the email data and skip sending
  // You can add Resend API here later, or use your existing contact form for notifications
  
  console.log('Survey submitted:', {
    name: data.contactInfo.name,
    company: data.contactInfo.company,
    score: score,
    quality: leadQuality,
    urgency: data.contactInfo.urgency
  });
  
  // You can add Resend API integration here later
  // For now, just return success
  return { success: true, message: 'Email logging successful' };
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
      sendSimpleEmailNotification(surveyData, automationScore, leadQuality)
    ]);

    // Check results
    const airtableSuccess = airtableResult.status === 'fulfilled';
    const emailSuccess = emailResult.status === 'fulfilled';

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
        airtable: airtableSuccess,
        email: emailSuccess
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

// Handle GET requests for testing
export async function GET() {
  return NextResponse.json({
    message: 'Market Survey API is running',
    methods: ['POST'],
    status: 'active'
  });
}