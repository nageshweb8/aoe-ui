import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
};

export default nextConfig;
