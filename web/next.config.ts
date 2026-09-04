import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['10.41.66.58', 'localhost:3000'],
    },
  },
  // allowedDevOrigins is newly introduced in recent Next.js updates and may not be in NextConfig types yet
  // @ts-ignore - Suppressing TS error since NextConfig type doesn't include allowedDevOrigins
  allowedDevOrigins: ['10.41.66.58', '192.168.56.1', '192.168.29.114'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/favicons/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'http://127.0.0.1:8000'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig as any as NextConfig;
