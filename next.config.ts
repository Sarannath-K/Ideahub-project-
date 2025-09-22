import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // This will disable ESLint errors during the build process on Vercel
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;