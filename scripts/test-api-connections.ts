// scripts/test-api-connections.ts
// Test all API connections

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

interface APITestResult {
  service: string;
  status: 'working' | 'broken' | 'not configured';
  message: string;
  error?: any;
}

const results: APITestResult[] = [];

// Test 1: Airtable API
async function testAirtable(): Promise<APITestResult> {
  console.log('🧪 Testing Airtable API...');
  
  const apiKey = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  
  if (!apiKey || !baseId) {
    return {
      service: 'Airtable',
      status: 'not configured',
      message: 'Missing AIRTABLE_PERSONAL_ACCESS_TOKEN or AIRTABLE_BASE_ID'
    };
  }

  try {
    const Airtable = await import('airtable');
    const base = new Airtable.default({ apiKey }).base(baseId);
    
    // Try to fetch one record
    const records = await base('Leads').select({
      maxRecords: 1
    }).firstPage();
    
    return {
      service: 'Airtable',
      status: 'working',
      message: `Connected successfully. Found ${records.length} record(s) in Leads table.`
    };
  } catch (error: any) {
    return {
      service: 'Airtable',
      status: 'broken',
      message: error.message || 'Unknown error',
      error
    };
  }
}

// Test 2: Google Places API
async function testGooglePlaces(): Promise<APITestResult> {
  console.log('🧪 Testing Google Places API...');
  
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_PLACES_API;
  
  if (!apiKey) {
    return {
      service: 'Google Places',
      status: 'not configured',
      message: 'Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACES_API'
    };
  }

  try {
    // Test with a simple place search
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Amarillo+TX&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK') {
      return {
        service: 'Google Places',
        status: 'working',
        message: `Connected successfully. Found ${data.results?.length || 0} places.`
      };
    } else {
      return {
        service: 'Google Places',
        status: 'broken',
        message: `API returned status: ${data.status}. ${data.error_message || ''}`,
        error: data
      };
    }
  } catch (error: any) {
    return {
      service: 'Google Places',
      status: 'broken',
      message: error.message || 'Unknown error',
      error
    };
  }
}

// Test 3: Hunter.io API
async function testHunterIO(): Promise<APITestResult> {
  console.log('🧪 Testing Hunter.io API...');
  
  const apiKey = process.env.HUNTER_API_KEY;
  
  if (!apiKey) {
    return {
      service: 'Hunter.io',
      status: 'not configured',
      message: 'Missing HUNTER_API_KEY'
    };
  }

  try {
    // Test with account information endpoint
    const response = await fetch(
      `https://api.hunter.io/v2/account?api_key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (response.ok && data.data) {
      return {
        service: 'Hunter.io',
        status: 'working',
        message: `Connected successfully. Account: ${data.data.email || 'Unknown'}. Requests available: ${data.data.requests?.available || 'Unknown'}`
      };
    } else {
      return {
        service: 'Hunter.io',
        status: 'broken',
        message: `API error: ${data.errors?.[0]?.details || 'Unknown error'}`,
        error: data
      };
    }
  } catch (error: any) {
    return {
      service: 'Hunter.io',
      status: 'broken',
      message: error.message || 'Unknown error',
      error
    };
  }
}

// Main execution
async function runTests() {
  console.log('🔍 API Connection Test Suite\n');
  console.log('Testing all configured APIs...\n');
  
  // Run all tests
  results.push(await testAirtable());
  console.log('');
  
  results.push(await testGooglePlaces());
  console.log('');
  
  results.push(await testHunterIO());
  console.log('');
  
  // Summary report
  console.log('📊 Test Results Summary');
  console.log('=' .repeat(60));
  
  const working = results.filter(r => r.status === 'working');
  const broken = results.filter(r => r.status === 'broken');
  const notConfigured = results.filter(r => r.status === 'not configured');
  
  console.log(`\n✅ Working: ${working.length}`);
  working.forEach(r => {
    console.log(`   - ${r.service}: ${r.message}`);
  });
  
  console.log(`\n❌ Broken: ${broken.length}`);
  broken.forEach(r => {
    console.log(`   - ${r.service}: ${r.message}`);
  });
  
  console.log(`\n⚠️  Not Configured: ${notConfigured.length}`);
  notConfigured.forEach(r => {
    console.log(`   - ${r.service}: ${r.message}`);
  });
  
  // Detailed error information
  if (broken.length > 0) {
    console.log('\n📋 Detailed Error Information:');
    console.log('-' .repeat(60));
    broken.forEach(r => {
      console.log(`\n${r.service}:`);
      if (r.error) {
        console.log(JSON.stringify(r.error, null, 2));
      }
    });
  }
}

// Run the tests
runTests().catch(console.error);