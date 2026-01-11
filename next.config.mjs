/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // اختياري لكنه مفيد
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    },
  },
  images: {
    domains: [
      'cnn-arabic-images.cnn.io',
      'backend.bishahcc.org',
      'bishahcc.org',
      'localhost',
      'bisha.runasp.net'
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**', // لو عايز تسمح بكل host ممكن تستخدم remotePatterns بحذر
      },
      {
        protocol: 'https',
        hostname: '**',
      }
    ], unoptimized: true, // بدل ما تعمل override
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.pdf$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/[hash][ext]',
      },
    });
    return config;
  },
};

export default nextConfig;