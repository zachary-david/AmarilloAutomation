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
  skipBuildStaticGeneration: false,

  // Add redirects for legal pages
  async redirects() {
    return [
      // Redirect common URL variations to your new legal pages
      {
        source: '/terms',
        destination: '/terms-of-service',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/tos',
        destination: '/terms-of-service',
        permanent: true,
      },
      {
        source: '/pp',
        destination: '/privacy-policy',
        permanent: true,
      },
      // This redirect is now more important since you renamed the folder
      {
        source: '/terms-conditions',
        destination: '/terms-of-service',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig