import { withLogtail } from '@logtail/next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/**
 * @type {import('next').NextConfig}
 */
const config = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        hostname: 'img.logo.dev',
        protocol: 'https',
      },
    ],
  },
  staticPageGenerationTimeout: 180,
};

let nextConfig = withMDX(withLogtail({ ...config }));

if (process.env.ANALYZE === 'true') {
  nextConfig = withBundleAnalyzer()(config);
}

export default nextConfig;
