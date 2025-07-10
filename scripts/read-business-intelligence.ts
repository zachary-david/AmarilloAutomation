// scripts/read-business-intelligence.ts
// Script to read records from Business Intelligence table

import Airtable from 'airtable';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Get configuration
const apiKey = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
const baseId = process.env.AIRTABLE_BASE_ID;
const tableName = 'Business Intelligence';

if (!apiKey || !baseId) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

// Configure Airtable
const base = new Airtable({ apiKey }).base(baseId);

async function readBusinessIntelligence() {
  console.log('📖 Reading Business Intelligence records...\n');
  
  try {
    const records: any[] = [];
    
    // Fetch all records
    await base(tableName).select({
      sort: [{ field: 'Discovery Date', direction: 'desc' }],
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
      
      // Display key fields
      if (fields['Business Name']) console.log(`  Business Name: ${fields['Business Name']}`);
      if (fields['Industry']) console.log(`  Industry: ${fields['Industry']}`);
      if (fields['Address']) console.log(`  Address: ${fields['Address']}`);
      if (fields['Phone']) console.log(`  Phone: ${fields['Phone']}`);
      if (fields['Website']) console.log(`  Website: ${fields['Website']}`);
      if (fields['Primary Email']) console.log(`  Primary Email: ${fields['Primary Email']}`);
      if (fields['Google Rating']) console.log(`  Google Rating: ${fields['Google Rating']} stars`);
      if (fields['Review Count']) console.log(`  Review Count: ${fields['Review Count']}`);
      if (fields['Lead Score']) console.log(`  Lead Score: ${fields['Lead Score']}`);
      if (fields['Revenue Potential']) console.log(`  Revenue Potential: ${fields['Revenue Potential']}`);
      if (fields['Outreach Status']) console.log(`  Outreach Status: ${fields['Outreach Status']}`);
      if (fields['Discovery Date']) console.log(`  Discovery Date: ${fields['Discovery Date']}`);
      
      console.log('\n');
    });

    // Summary statistics
    console.log('📊 Summary Statistics:');
    console.log('------------------------');
    
    // Count by industry
    const industryCounts: Record<string, number> = {};
    records.forEach(record => {
      const industry = record.fields['Industry'] || 'Unknown';
      industryCounts[industry] = (industryCounts[industry] || 0) + 1;
    });
    
    console.log('By Industry:');
    Object.entries(industryCounts).forEach(([industry, count]) => {
      console.log(`  ${industry}: ${count}`);
    });
    
    // Count by outreach status
    const statusCounts: Record<string, number> = {};
    records.forEach(record => {
      const status = record.fields['Outreach Status'] || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    console.log('\nBy Outreach Status:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });

    // Count by revenue potential
    const revenueCounts: Record<string, number> = {};
    records.forEach(record => {
      const revenue = record.fields['Revenue Potential'] || 'Unknown';
      revenueCounts[revenue] = (revenueCounts[revenue] || 0) + 1;
    });
    
    console.log('\nBy Revenue Potential:');
    Object.entries(revenueCounts).forEach(([revenue, count]) => {
      console.log(`  ${revenue}: ${count}`);
    });

  } catch (error) {
    console.error('❌ Error reading records:', error);
  }
}

readBusinessIntelligence().catch(console.error);