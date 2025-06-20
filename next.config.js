/** @type {import('next').NextConfig} */
const nextConfig = {
  // DO NOT use output: 'export' - this breaks API routes
  
  // Cloudflare Pages specific settings
  images: {
    unoptimized: true
  },
  
  // Ensure proper routing
  trailingSlash: false,

  // Add redirects for legal pages
  async redirects() {
    return [
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
      {
        source: '/terms-conditions',
        destination: '/terms-of-service',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig