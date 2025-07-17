import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // Always return success - no password required
  return NextResponse.json({ success: true })
}