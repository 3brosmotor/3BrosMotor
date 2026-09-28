/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  allowedDevOrigins: [
    'ais-dev-7c6d27pxnyq652ze44iapi-302554631269.asia-southeast1.run.app',
    'ais-pre-7c6d27pxnyq652ze44iapi-302554631269.asia-southeast1.run.app'
  ]
};

export default nextConfig;
