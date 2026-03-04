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
  projectId: process.env.GT_PROJECT_ID,
  locales: ['en', 'it'],
  defaultLocale: 'en',
});
