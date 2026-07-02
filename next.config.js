/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // 既存コードにESLint設定不備由来のエラーが多数残っており、ビルドを
    // ブロックしないようにする。lintは `pnpm lint` で個別に実行する。
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'date-fns',
      'recharts',
      'react-markdown',
    ],
  },
};

export default nextConfig;
