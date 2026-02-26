const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Performance optimizations
  swcMinify: true,
  ...(process.env.NODE_ENV === 'production' ? {
    compiler: {
      removeConsole: true,
    },
  } : {}),

  // Reduce bundle size
  productionBrowserSourceMaps: false,

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      '@radix-ui/react-icons',
      'date-fns',
      '@supabase/supabase-js',
    ],
  },

  // Enable compression
  compress: true,

  // Optimize CSS
  optimizeFonts: true,

  // React strict mode for better performance checks
  reactStrictMode: true,

  // Optimize page rendering
  poweredByHeader: false,
};

module.exports = withBundleAnalyzer(nextConfig);
