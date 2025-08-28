// app/api/demo-leads/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, email, business, source, timestamp } = body;

    console.log('Demo lead received:', { phone, email, business });

    // Prepare demo scenario data
    const demoData = {
      type: 'interactive_demo',
      phone: phone,
      email: email,
      business_type: business,
      lead_source: 'Interactive Demo',
      timestamp: timestamp || new Date().toISOString(),
      
      // Demo scenario details
      demo_scenario: {
        customer_name: 'Sarah Johnson',
        service_type: getServiceType(business),
        issue: getIssueByBusiness(business),
        estimated_value: '$8,500',
        urgency: 'HIGH',
        location: 'Amarillo, TX',
        time: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        })
      },
      
      // User info for personalization
      user_info: {
        phone_formatted: formatPhone(phone),
        business_name: `${business} Business`,
        demo_id: generateDemoId()
      }
    };

    // Trigger Zapier workflow
    const zapierWebhook = 'https://hooks.zapier.com/hooks/catch/22949842/ubt8zdx/';
    
    try {
      const zapierResponse = await fetch(zapierWebhook, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'GarrettZamora-Demo/1.0'
        },
        body: JSON.stringify(demoData)
      });

      if (zapierResponse.ok) {
        console.log('Zapier webhook triggered successfully');
        console.log('Demo ID:', demoData.user_info.demo_id);
      } else {
        const errorText = await zapierResponse.text();
        console.error('Zapier webhook failed:', errorText);
      }
    } catch (webhookError) {
      console.error('Webhook error:', webhookError);
    }

    // Optional: Also save to AirTable
    await saveToAirTable(demoData);

    return NextResponse.json({ 
      success: true, 
      message: 'Demo automation triggered successfully!',
      demo_id: demoData.user_info.demo_id
    });

  } catch (error) {
    console.error('Demo API error:', error);
    return NextResponse.json({ 
      success: true, 
      message: 'Demo processed' 
    });
  }
}

// Helper functions
function getServiceType(business: string): string {
  const serviceMap: { [key: string]: string } = {
    'Roofing': 'Emergency Roof Repair',
    'HVAC': 'AC System Failure',
    'Plumbing': 'Emergency Plumbing',
    'General': 'Emergency Repair',
    'Electrical': 'Electrical Emergency',
    'Other': 'Emergency Service'
  };
  return serviceMap[business] || 'Emergency Repair';
}

function getIssueByBusiness(business: string): string {
  const issueMap: { [key: string]: string } = {
    'Roofing': 'Water damage in kitchen from roof leak',
    'HVAC': 'AC failure - 98°F outside temperature',
    'Plumbing': 'Burst pipe causing water damage',
    'General': 'Emergency repair needed immediately',
    'Electrical': 'Power outage - electrical emergency',
    'Other': 'Urgent service request'
  };
  return issueMap[business] || 'Emergency service needed';
}

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

function generateDemoId(): string {
  return 'DEMO-' + Date.now().toString().slice(-6);
}

async function saveToAirTable(demoData: any): Promise<void> {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.log('AirTable credentials not available');
    return;
  }

  try {
    await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Demo%20Leads`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            'Phone': demoData.phone,
            'Email': demoData.email,
            'Business Type': demoData.business_type,
            'Lead Source': 'Interactive Demo - SMS',
            'Created Date': demoData.timestamp,
            'Status': 'Demo SMS Triggered',
            'Priority Score': 95,
            'Follow-up Required': true,
            'Demo ID': demoData.user_info.demo_id,
            'Demo Scenario': `${demoData.demo_scenario.service_type} - ${demoData.demo_scenario.estimated_value}`
          }
        })
      }
    );
    console.log('AirTable record created successfully');
  } catch (error) {
    console.error('AirTable save error:', error);
  }
}