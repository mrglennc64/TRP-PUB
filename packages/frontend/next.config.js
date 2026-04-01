/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  async redirects() {
    return [
      {
        source: '/graph-demo',
        destination: 'https://usesmpt.com/atl-identity-graph-demo.html',
        permanent: false,
      },
    ];
  },

  // API proxy rewrites - only proxy specific FastAPI routes, NOT Next.js API routes
  async rewrites() {
    return [
      { source: '/catalog/:path*', destination: 'http://localhost:8000/catalog/:path*' },
      { source: '/api/health-audit', destination: 'http://localhost:8000/api/health-audit' },
      { source: '/api/identifier-gap', destination: 'http://localhost:8000/api/identifier-gap' },
      { source: '/api/reconcile', destination: 'http://localhost:8000/api/reconcile' },
      { source: '/api/splits', destination: 'http://localhost:8000/api/splits' },
      { source: '/api/rights-ready', destination: 'http://localhost:8000/api/rights-ready' },
    ];
  },

  images: {
    domains: ['s3.eu-central-2.idrivee2.com', 's3.frankfurt.traproyaltiespro.com'],
  },
}

module.exports = nextConfig
