import { withGTConfig } from 'gt-next/config';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.convex.cloud',
      },
      {
        protocol: 'https',
        hostname: '*.convex.site',
      },
    ],
  },
};

export default withGTConfig(nextConfig, {
  projectId: 'prj_w5sqtudsdsqp4e64955k2aab',
  locales: ['en', 'it'],
  defaultLocale: 'en',
});
