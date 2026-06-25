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
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.seeklogo.com',
      },
    ],
  },
};

// gt-next's withGTConfig force-enables Next's experimental `rootParams` on
// versions where it's experimental (Next 16.x). Disable it: not needed without a
// [locale] segment, and the experimental static-gen path is a build hazard.
const gtConfig = withGTConfig(nextConfig);
gtConfig.experimental = { ...(gtConfig.experimental ?? {}), rootParams: false };

export default gtConfig;
