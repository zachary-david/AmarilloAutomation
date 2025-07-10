// scripts/batch-discovery.ts
// Batch process multiple industries for business discovery

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

interface BatchConfig {
  industries: string[]
  location: string
  radius: number
  maxResultsPerIndustry: number
  delayBetweenRequests: number // milliseconds
}

interface BatchResults {
  totalBusinessesFound: number
  totalBusinessesEnriched: number
  totalSavedToAirtable: number
  industryResults: Record<string, any>
  errors: string[]
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function discoverBusinessesForIndustry(industry: string, location: string, radius: number, maxResults: number) {
  try {
    const response = await fetch('http://localhost:3000/api/business-discovery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ industry, location, radius, maxResults })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`Error discovering ${industry} businesses:`, error);
    throw error;
  }
}

async function runBatchDiscovery(config: BatchConfig): Promise<BatchResults> {
  console.log('🚀 Starting Batch Business Discovery\n');
  console.log(`Location: ${config.location}`);
  console.log(`Radius: ${config.radius}m`);
  console.log(`Industries: ${config.industries.join(', ')}`);
  console.log(`Max results per industry: ${config.maxResultsPerIndustry}`);
  console.log('\n' + '='.repeat(60) + '\n');

  const results: BatchResults = {
    totalBusinessesFound: 0,
    totalBusinessesEnriched: 0,
    totalSavedToAirtable: 0,
    industryResults: {},
    errors: []
  };

  for (let i = 0; i < config.industries.length; i++) {
    const industry = config.industries[i];
    console.log(`\n[${i + 1}/${config.industries.length}] Discovering ${industry} businesses...`);

    try {
      const discoveryResult = await discoverBusinessesForIndustry(
        industry,
        config.location,
        config.radius,
        config.maxResultsPerIndustry
      );

      results.industryResults[industry] = discoveryResult;
      results.totalBusinessesFound += discoveryResult.totalFound;
      results.totalBusinessesEnriched += discoveryResult.businesses.length;
      results.totalSavedToAirtable += discoveryResult.savedToAirtable;

      console.log(`✅ ${industry}: Found ${discoveryResult.totalFound}, Enriched ${discoveryResult.businesses.length}, Saved ${discoveryResult.savedToAirtable}`);

      // Show sample business
      if (discoveryResult.businesses.length > 0) {
        const sample = discoveryResult.businesses[0];
        console.log(`   Sample: ${sample.name} (Lead Score: ${sample.leadScore}%)`);
      }

      // Delay between requests to avoid rate limiting
      if (i < config.industries.length - 1) {
        console.log(`   Waiting ${config.delayBetweenRequests / 1000}s before next request...`);
        await sleep(config.delayBetweenRequests);
      }

    } catch (error) {
      const errorMsg = `Failed to process ${industry}: ${error}`;
      results.errors.push(errorMsg);
      console.error(`❌ ${errorMsg}`);
    }
  }

  return results;
}

// Main execution
async function main() {
  // Configuration for batch discovery
  const batchConfig: BatchConfig = {
    industries: [
      'Plumber',
      'Electrician',
      'HVAC Contractor',
      'Roofer',
      'General Contractor',
      'Landscaper',
      'Pest Control',
      'House Cleaner'
    ],
    location: 'Amarillo, TX',
    radius: 10000, // 10km
    maxResultsPerIndustry: 5,
    delayBetweenRequests: 2000 // 2 seconds
  };

  try {
    const startTime = Date.now();
    const results = await runBatchDiscovery(batchConfig);
    const duration = (Date.now() - startTime) / 1000;

    console.log('\n' + '='.repeat(60));
    console.log('\n📊 Batch Discovery Summary\n');
    console.log(`Total businesses found: ${results.totalBusinessesFound}`);
    console.log(`Total businesses enriched: ${results.totalBusinessesEnriched}`);
    console.log(`Total saved to Airtable: ${results.totalSavedToAirtable}`);
    console.log(`Time taken: ${duration.toFixed(1)}s`);

    if (results.errors.length > 0) {
      console.log(`\n⚠️  Errors encountered: ${results.errors.length}`);
      results.errors.forEach(err => console.log(`  - ${err}`));
    }

    console.log('\n✅ Batch discovery complete!');
    console.log('Check your Airtable for all the new leads.');

    // Save detailed results to file
    const resultsPath = path.join(process.cwd(), 'discovery-results.json');
    await import('fs').then(fs => {
      fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
      console.log(`\n📁 Detailed results saved to: ${resultsPath}`);
    });

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Check if dev server is running
async function checkDevServer() {
  try {
    const response = await fetch('http://localhost:3000/api/business-discovery');
    return response.ok;
  } catch {
    return false;
  }
}

// Entry point
(async () => {
  const serverRunning = await checkDevServer();
  if (!serverRunning) {
    console.error('❌ Dev server is not running. Please run "npm run dev" first.');
    process.exit(1);
  }

  await main();
})();