// scripts/discover-airtable-fields.ts
// Script to discover available fields in Airtable

import Airtable from 'airtable';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Get configuration
const apiKey = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
const baseId = process.env.AIRTABLE_BASE_ID;
const tableName = 'Leads';

if (!apiKey || !baseId) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

// Configure Airtable
const base = new Airtable({ apiKey }).base(baseId);

async function discoverFields() {
  console.log('🔍 Discovering Airtable fields...\n');
  
  try {
    // Get just a few records to see what fields exist
    const records = await base(tableName).select({
      maxRecords: 5,
      pageSize: 5
    }).firstPage();

    if (records.length === 0) {
      console.log('No records found in the table.');
      return;
    }

    // Collect all unique field names
    const allFields = new Set<string>();
    
    records.forEach((record, index) => {
      console.log(`\nRecord ${index + 1} (ID: ${record.id}):`);
      console.log('Fields found:');
      
      Object.entries(record.fields).forEach(([fieldName, fieldValue]) => {
        allFields.add(fieldName);
        console.log(`  - ${fieldName}: ${typeof fieldValue === 'object' ? JSON.stringify(fieldValue) : fieldValue}`);
      });
    });

    console.log('\n📋 All unique fields found:');
    console.log('------------------------');
    Array.from(allFields).sort().forEach(field => {
      console.log(`  - ${field}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

discoverFields().catch(console.error);