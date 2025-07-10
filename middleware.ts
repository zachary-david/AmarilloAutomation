import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple password protection for admin routes
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'amarillo2024'

export function middleware(request: NextRequest) {
  // Check if the request is for a protected route
  if (request.nextUrl.pathname.startsWith('/business-discovery')) {
    // Check for password in cookie
    const passwordCookie = request.cookies.get('admin-password')
    
    if (passwordCookie?.value !== ADMIN_PASSWORD) {
      // Redirect to password page
      return NextResponse.redirect(new URL('/admin-login?redirect=/business-discovery', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/business-discovery/:path*']
}