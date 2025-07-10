// scripts/test-business-intelligence-create.ts
// Test creating a record in Business Intelligence table to discover schema

import Airtable from 'airtable';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const apiKey = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

async function testCreateRecord() {
  console.log('🧪 Testing Business Intelligence table schema...\n');

  // Try different field combinations
  const fieldTests = [
    // Test 1: Basic fields
    {
      'Business Name': 'Test Company 1',
      'Contact Name': 'Test Contact',
      'Email': 'test@example.com',
      'Phone': '123-456-7890',
      'Website': 'https://example.com',
      'Address': '123 Test St',
      'Industry': 'Test Industry',
      'Notes': 'Test notes'
    },
    // Test 2: Alternative field names
    {
      'Company': 'Test Company 2',
      'Name': 'Test Name',
      'Email Address': 'test2@example.com',
      'Phone Number': '987-654-3210',
      'URL': 'https://example2.com',
      'Location': '456 Test Ave',
      'Type': 'Test Type',
      'Description': 'Test description'
    },
    // Test 3: Minimal fields
    {
      'Title': 'Test Company 3',
      'Details': 'All test information here'
    }
  ];

  for (let i = 0; i < fieldTests.length; i++) {
    console.log(`\nTest ${i + 1}: Trying field set...`);
    console.log('Fields:', Object.keys(fieldTests[i]).join(', '));
    
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${baseId}/Business%20Intelligence`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: fieldTests[i]
          })
        }
      );
      
      const result = await response.json();
      
      if (response.ok) {
        console.log('✅ Success! Record created with ID:', result.id);
        console.log('Accepted fields:', Object.keys(result.fields));
        
        // Delete the test record
        await fetch(
          `https://api.airtable.com/v0/${baseId}/Business%20Intelligence/${result.id}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${apiKey}`
            }
          }
        );
        console.log('🗑️  Test record deleted');
        
        return result.fields;
      } else {
        console.log('❌ Failed:', result.error);
      }
    } catch (error) {
      console.log('❌ Error:', error);
    }
  }
  
  // If all tests fail, try to get the schema
  console.log('\n📋 Attempting to get table schema...');
  
  try {
    const schemaResponse = await fetch(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    if (schemaResponse.ok) {
      const schema = await schemaResponse.json();
      const biTable = schema.tables.find((t: any) => t.name === 'Business Intelligence');
      
      if (biTable) {
        console.log('\nBusiness Intelligence table fields:');
        biTable.fields.forEach((field: any) => {
          console.log(`  - ${field.name} (${field.type})`);
        });
      }
    }
  } catch (error) {
    console.log('Could not fetch schema:', error);
  }
}

testCreateRecord().catch(console.error);