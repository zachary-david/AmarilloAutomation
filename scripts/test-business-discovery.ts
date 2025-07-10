// scripts/test-business-discovery.ts
// Test the business discovery system

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testBusinessDiscovery() {
  console.log('🧪 Testing Business Discovery System\n');

  const testCases = [
    {
      name: 'Plumbers in Amarillo',
      params: {
        industry: 'plumber',
        location: 'Amarillo, TX',
        radius: 10000,
        maxResults: 5
      }
    },
    {
      name: 'HVAC Contractors nearby',
      params: {
        industry: 'HVAC contractor',
        location: 'Amarillo, TX',
        radius: 5000,
        maxResults: 3
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📍 Test: ${testCase.name}`);
    console.log('Parameters:', JSON.stringify(testCase.params, null, 2));
    
    try {
      const response = await fetch('http://localhost:3000/api/business-discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCase.params)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ API Error:', data.error || response.statusText);
        continue;
      }

      console.log('\n✅ Discovery Results:');
      console.log(`- Total found: ${data.totalFound}`);
      console.log(`- Businesses enriched: ${data.businesses.length}`);
      console.log(`- Saved to Airtable: ${data.savedToAirtable}`);

      if (data.businesses.length > 0) {
        console.log('\n📊 Sample Business Details:');
        const sample = data.businesses[0];
        console.log(`\nBusiness: ${sample.name}`);
        console.log(`Address: ${sample.address}`);
        console.log(`Phone: ${sample.phone || 'Not found'}`);
        console.log(`Website: ${sample.website || 'Not found'}`);
        console.log(`Email: ${sample.email || 'Not found'} ${sample.emailSource ? `(via ${sample.emailSource})` : ''}`);
        console.log(`Rating: ${sample.rating || 'N/A'} (${sample.reviewCount || 0} reviews)`);
        console.log(`Lead Score: ${sample.leadScore}%`);
        console.log(`Automation Score: ${sample.automationScore}%`);
        if (sample.painPoints && sample.painPoints.length > 0) {
          console.log(`Pain Points: ${sample.painPoints.join(', ')}`);
        }
      }

      if (data.errors && data.errors.length > 0) {
        console.log('\n⚠️  Errors encountered:');
        data.errors.forEach((err: string) => console.log(`  - ${err}`));
      }

    } catch (error) {
      console.error('❌ Test failed:', error);
    }
  }

  console.log('\n\n🎯 Testing Complete!');
  console.log('Check your Airtable to see the newly discovered leads.');
}

// Verify API keys are configured
function checkConfiguration() {
  const required = {
    'Google Places': process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API,
    'Hunter.io': process.env.HUNTER_API_KEY,
    'Airtable': process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN
  };

  let allConfigured = true;
  console.log('🔑 Checking API Configuration:\n');
  
  for (const [service, key] of Object.entries(required)) {
    if (key) {
      console.log(`✅ ${service}: Configured`);
    } else {
      console.log(`❌ ${service}: Missing`);
      allConfigured = false;
    }
  }

  return allConfigured;
}

// Main execution
async function main() {
  if (!checkConfiguration()) {
    console.log('\n⚠️  Some APIs are not configured. Discovery may have limited functionality.');
  }

  console.log('\n' + '='.repeat(60) + '\n');
  
  await testBusinessDiscovery();
}

main().catch(console.error);