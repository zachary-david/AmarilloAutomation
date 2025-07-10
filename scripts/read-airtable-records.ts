// scripts/read-airtable-records.ts
// Script to read existing records from Airtable

import Airtable from 'airtable';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Get configuration
const apiKey = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
const baseId = process.env.AIRTABLE_BASE_ID;
const tableName = 'Leads'; // Based on the lib/airtable.ts file

if (!apiKey || !baseId) {
  console.error('❌ Missing required environment variables:');
  if (!apiKey) console.error('  - AIRTABLE_PERSONAL_ACCESS_TOKEN');
  if (!baseId) console.error('  - AIRTABLE_BASE_ID');
  process.exit(1);
}

// Configure Airtable
const base = new Airtable({ apiKey }).base(baseId);

// Function to read all records
async function readAllRecords() {
  console.log('📖 Reading records from Airtable...\n');
  
  try {
    const records: any[] = [];
    
    // Fetch all records with pagination
    await base(tableName).select({
      // You can add filters here if needed
      // filterByFormula: '{Lead Quality} = "High"',
      sort: [{ field: 'Last Modified Time', direction: 'desc' }],
      pageSize: 100
    }).eachPage((pageRecords, fetchNextPage) => {
      records.push(...pageRecords);
      fetchNextPage();
    });

    console.log(`✅ Found ${records.length} records\n`);

    // Display records
    records.forEach((record, index) => {
      console.log(`Record ${index + 1} (ID: ${record.id}):`);
      console.log('------------------------');
      const fields = record.fields;
      
      // Display common fields
      if (fields['Name']) console.log(`  Name: ${fields['Name']}`);
      if (fields['Email']) console.log(`  Email: ${fields['Email']}`);
      if (fields['Company']) console.log(`  Company: ${fields['Company']}`);
      if (fields['Service Interest']) console.log(`  Service Interest: ${fields['Service Interest']}`);
      if (fields['Project Details']) console.log(`  Project Details: ${fields['Project Details']}`);
      if (fields['Company Size']) console.log(`  Company Size: ${fields['Company Size']}`);
      if (fields['Lead Score']) console.log(`  Lead Score: ${fields['Lead Score']}`);
      if (fields['Lead Quality']) console.log(`  Lead Quality: ${fields['Lead Quality']}`);
      if (fields['Source']) console.log(`  Source: ${fields['Source']}`);
      if (fields['Source Type']) console.log(`  Source Type: ${fields['Source Type']}`);
      if (fields['Last Modified Time']) console.log(`  Last Modified: ${fields['Last Modified Time']}`);
      
      console.log('\n');
    });

    // Summary statistics
    console.log('📊 Summary Statistics:');
    console.log('------------------------');
    
    // Count by lead quality
    const qualityCounts: Record<string, number> = {};
    records.forEach(record => {
      const quality = record.fields['Lead Quality'] || 'unknown';
      qualityCounts[quality] = (qualityCounts[quality] || 0) + 1;
    });
    
    console.log('By Lead Quality:');
    Object.entries(qualityCounts).forEach(([quality, count]) => {
      console.log(`  ${quality}: ${count}`);
    });
    
    // Count by source
    const sourceCounts: Record<string, number> = {};
    records.forEach(record => {
      const source = record.fields['Source'] || 'unknown';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });
    
    console.log('\nBy Source:');
    Object.entries(sourceCounts).forEach(([source, count]) => {
      console.log(`  ${source}: ${count}`);
    });

  } catch (error) {
    console.error('❌ Error reading records:', error);
    if (error instanceof Error && error.message.includes('401')) {
      console.error('\n🔑 Authentication error. Please check your AIRTABLE_PERSONAL_ACCESS_TOKEN');
    }
  }
}

// Function to read records with specific filters
async function readFilteredRecords(filterFormula: string) {
  console.log(`📖 Reading filtered records: ${filterFormula}\n`);
  
  try {
    const records: any[] = [];
    
    await base(tableName).select({
      filterByFormula: filterFormula,
      sort: [{ field: 'Last Modified Time', direction: 'desc' }],
      pageSize: 100
    }).eachPage((pageRecords, fetchNextPage) => {
      records.push(...pageRecords);
      fetchNextPage();
    });

    console.log(`✅ Found ${records.length} matching records\n`);

    records.forEach((record, index) => {
      console.log(`Record ${index + 1} (ID: ${record.id}):`);
      const fields = record.fields;
      if (fields['Name']) console.log(`  Name: ${fields['Name']}`);
      if (fields['Email']) console.log(`  Email: ${fields['Email']}`);
      if (fields['Lead Quality']) console.log(`  Lead Quality: ${fields['Lead Quality']}`);
      if (fields['Last Modified Time']) console.log(`  Last Modified: ${fields['Last Modified Time']}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error reading filtered records:', error);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length > 0 && args[0] === '--filter') {
    // Example: npm run read-airtable -- --filter "{Status} = 'new'"
    const filterFormula = args.slice(1).join(' ');
    await readFilteredRecords(filterFormula);
  } else {
    await readAllRecords();
  }
}

// Run the script
main().catch(console.error);