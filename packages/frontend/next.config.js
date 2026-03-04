/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // API proxy rewrites - forward /api requests to backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', // Proxy to FastAPI backend
      },
    ];
  },
  
  // Optional: Add image domains if you're using Next.js Image component
  images: {
    domains: ['s3.eu-central-2.idrivee2.com', 's3.frankfurt.traproyaltiespro.com'],
  },
}

module.exports = nextConfig
