import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test if environment variables are accessible (without exposing actual values)
    const envCheck = {
      airtableToken: !!process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
      airtableApiKey: !!process.env.AIRTABLE_API_KEY, // Check both token types
      airtableBase: !!process.env.AIRTABLE_BASE_ID,
      airtableTable: !!process.env.AIRTABLE_TABLE_NAME,
      resendKey: !!process.env.RESEND_API_KEY,
      // Show first 4 characters of base ID for verification
      baseIdPreview: process.env.AIRTABLE_BASE_ID?.substring(0, 4) + '...',
      nodeEnv: process.env.NODE_ENV,
    };

    // Try to detect actual runtime
    let runtime = 'Unknown';
    if (process.env.VERCEL) {
      runtime = 'Vercel';
    } else if (process.env.CF_PAGES) {
      runtime = 'Cloudflare Pages';
    } else if (process.env.NETLIFY) {
      runtime = 'Netlify';
    }

    return NextResponse.json({
      success: true,
      message: 'Environment variables test',
      variables: envCheck,
      runtime: runtime,
      debug: {
        hasVercelEnv: !!process.env.VERCEL,
        hasCfEnv: !!process.env.CF_PAGES,
        hasNetlifyEnv: !!process.env.NETLIFY,
        envVarCount: Object.keys(process.env).length
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      runtime: 'Unknown'
    });
  }
}