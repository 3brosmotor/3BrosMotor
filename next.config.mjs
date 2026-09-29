/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Completely disable X-Powered-By: Next.js header
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: [
    'ais-dev-7c6d27pxnyq652ze44iapi-302554631269.asia-southeast1.run.app',
    'ais-pre-7c6d27pxnyq652ze44iapi-302554631269.asia-southeast1.run.app'
  ],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'all',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Server',
            value: 'cloudflare',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
