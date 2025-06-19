// app/api/test-env/route.ts
// Simple test to verify environment variables are working
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test if environment variables are accessible (without exposing actual values)
    const envCheck = {
      airtableToken: !!process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
      airtableBase: !!process.env.AIRTABLE_BASE_ID,
      airtableTable: !!process.env.AIRTABLE_TABLE_NAME,
      resendKey: !!process.env.RESEND_API_KEY,
      // Show first 4 characters of base ID for verification
      baseIdPreview: process.env.AIRTABLE_BASE_ID?.substring(0, 4) + '...',
    };

    return NextResponse.json({
      success: true,
      message: 'Environment variables test',
      variables: envCheck,
      runtime: 'Cloudflare Pages'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      runtime: 'Unknown'
    });
  }
}