/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove any output: 'export' if present - this breaks API routes
  // output: 'export', // ← Remove this line if it exists
  
  // Ensure API routes are properly handled
  experimental: {
    runtime: 'nodejs',
  },
  
  // Cloudflare Pages specific settings
  images: {
    unoptimized: true
  },
  
  // Ensure proper routing
  trailingSlash: false,
  
  // Skip build static optimization that might interfere with API routes
  skipBuildStaticGeneration: false
}

module.exports = nextConfig