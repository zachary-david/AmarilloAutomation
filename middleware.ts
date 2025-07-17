import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // No password protection - allow all requests
  return NextResponse.next()
}

export const config = {
  matcher: ['/business-discovery/:path*']
}