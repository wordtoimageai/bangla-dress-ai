/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel-optimized settings
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },

  // Image optimization — allow all AI/storage domains
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.replicate.delivery' },
      { protocol: 'https', hostname: '**.replicate.com' },
      { protocol: 'https', hostname: 'huggingface.co' },
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'pbxt.replicate.delivery' },
    ],
    // Use Vercel's built-in image optimization
    formats: ['image/avif', 'image/webp'],
  },

  // Required for SSLCommerz IPN callbacks — allow cross-origin POSTs
  async headers() {
    return [
      {
        source: '/api/payments/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },

  // Redirect root /admin to login if not authenticated (handled by middleware)
  async redirects() {
    return [];
  },

  // Vercel build: skip type errors to avoid CI failures during early dev
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },

  // PWA / compression
  compress: true,
  poweredByHeader: false,

  // Environment-based logging
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
};

export default nextConfig;
