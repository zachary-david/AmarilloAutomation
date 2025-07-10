// scripts/check-industry-options.ts
// Check valid Industry options in Business Intelligence table

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const apiKey = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
const baseId = process.env.AIRTABLE_BASE_ID;

async function checkIndustryOptions() {
  console.log('🔍 Checking Industry field options...\n');

  try {
    // Get table schema
    const response = await fetch(
      `https://api.airtable.com/v0/meta/bases/${baseId}/tables`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    if (response.ok) {
      const schema = await response.json();
      const biTable = schema.tables.find((t: any) => t.name === 'Business Intelligence');
      
      if (biTable) {
        const industryField = biTable.fields.find((f: any) => f.name === 'Industry');
        
        if (industryField && industryField.options) {
          console.log('Valid Industry options:');
          industryField.options.choices.forEach((choice: any) => {
            console.log(`  - "${choice.name}"${choice.color ? ` (${choice.color})` : ''}`);
          });
        } else {
          console.log('Industry field not found or has no predefined options');
        }
        
        // Also check Business Status options
        const statusField = biTable.fields.find((f: any) => f.name === 'Business Status');
        if (statusField && statusField.options) {
          console.log('\nValid Business Status options:');
          statusField.options.choices.forEach((choice: any) => {
            console.log(`  - "${choice.name}"`);
          });
        }
        
        // Check Outreach Status options
        const outreachField = biTable.fields.find((f: any) => f.name === 'Outreach Status');
        if (outreachField && outreachField.options) {
          console.log('\nValid Outreach Status options:');
          outreachField.options.choices.forEach((choice: any) => {
            console.log(`  - "${choice.name}"`);
          });
        }
        
        // Check Revenue Potential options
        const revenueField = biTable.fields.find((f: any) => f.name === 'Revenue Potential');
        if (revenueField && revenueField.options) {
          console.log('\nValid Revenue Potential options:');
          revenueField.options.choices.forEach((choice: any) => {
            console.log(`  - "${choice.name}"`);
          });
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

checkIndustryOptions().catch(console.error);