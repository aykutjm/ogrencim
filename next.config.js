/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Docker için gerekli
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizePackageImports: ['@supabase/supabase-js'],
  },
  // Image optimizasyonu
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },
  // Hız için
  swcMinify: true,
  reactStrictMode: false,
  // Dosya izleme optimizasyonu
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig
