// scripts/discover-business-intelligence-table.ts
// Script to discover fields in the Business Intelligence table

import Airtable from 'airtable';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Get configuration
const apiKey = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
const baseId = process.env.AIRTABLE_BASE_ID;
const tableName = 'Business Intelligence'; // Target table

if (!apiKey || !baseId) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

// Configure Airtable
const base = new Airtable({ apiKey }).base(baseId);

async function discoverBusinessIntelligenceFields() {
  console.log('🔍 Discovering Business Intelligence table fields...\n');
  
  try {
    // Get just a few records to see what fields exist
    const records = await base(tableName).select({
      maxRecords: 5,
      pageSize: 5
    }).firstPage();

    if (records.length === 0) {
      console.log('No records found in the Business Intelligence table.');
      console.log('The table might be empty or might not exist.');
      
      // Try to create a test record to see what fields are available
      console.log('\n📝 Attempting to create a test record to discover schema...');
      
      try {
        const testRecord = await base(tableName).create({
          'Name': 'Test Business',
          'Company': 'Test Company',
          'Email': 'test@example.com',
          'Source': 'Test'
        });
        
        console.log('✅ Successfully created test record:', testRecord.id);
        console.log('Available fields:', Object.keys(testRecord.fields));
        
        // Delete the test record
        await base(tableName).destroy(testRecord.id);
        console.log('🗑️  Test record deleted');
        
      } catch (createError: any) {
        console.error('Could not create test record:', createError.message);
        if (createError.error === 'TABLE_NOT_FOUND') {
          console.error('\n❌ Table "Business Intelligence" does not exist in this base.');
          console.error('Available tables might be different. Please check your Airtable base.');
        }
      }
      
      return;
    }

    // Collect all unique field names
    const allFields = new Set<string>();
    
    console.log('Found ' + records.length + ' records in Business Intelligence table:\n');
    
    records.forEach((record, index) => {
      console.log(`\nRecord ${index + 1} (ID: ${record.id}):`);
      console.log('Fields found:');
      
      Object.entries(record.fields).forEach(([fieldName, fieldValue]) => {
        allFields.add(fieldName);
        console.log(`  - ${fieldName}: ${typeof fieldValue === 'object' ? JSON.stringify(fieldValue) : fieldValue}`);
      });
    });

    console.log('\n📋 All unique fields in Business Intelligence table:');
    console.log('='.repeat(50));
    Array.from(allFields).sort().forEach(field => {
      console.log(`  - ${field}`);
    });

    // Compare with expected fields
    console.log('\n🔄 Field Compatibility Check:');
    console.log('='.repeat(50));
    const expectedFields = ['Name', 'Email', 'Company', 'Source', 'Source Type', 'Lead Score', 'Lead Quality', 'Service Interest', 'Company Size', 'Project Details'];
    
    expectedFields.forEach(field => {
      if (allFields.has(field)) {
        console.log(`✅ ${field} - Found`);
      } else {
        console.log(`❌ ${field} - Missing`);
      }
    });

  } catch (error: any) {
    console.error('❌ Error:', error);
    if (error.error === 'TABLE_NOT_FOUND') {
      console.error('\n❌ Table "Business Intelligence" does not exist in this base.');
      console.error('Please create the table in Airtable or use a different table name.');
    } else if (error.statusCode === 404) {
      console.error('\n❌ The specified table was not found.');
      console.error('Make sure "Business Intelligence" table exists in your Airtable base.');
    }
  }
}

// List all available tables
async function listAvailableTables() {
  console.log('\n📋 Attempting to discover available tables...');
  console.log('(Note: This requires schema access permissions)\n');
  
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('Available tables:');
      data.tables.forEach((table: any) => {
        console.log(`  - ${table.name} (ID: ${table.id})`);
      });
    } else {
      console.log('Could not list tables. You may need additional permissions.');
    }
  } catch (error) {
    console.log('Could not fetch table list:', error);
  }
}

// Main execution
async function main() {
  await discoverBusinessIntelligenceFields();
  await listAvailableTables();
}

main().catch(console.error);