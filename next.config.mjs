/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cnn-arabic-images.cnn.io', 'backend.bishahcc.org', 'bishahcc.org', 'localhost', 'bisha.runasp.net'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'backend.bishahcc.org',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'backend.bishahcc.org',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cnn-arabic-images.cnn.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bisha.runasp.net',
        port: '',
        pathname: '/uploads/**',
      },
    ],
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