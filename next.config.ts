import { withGTConfig } from 'gt-next/config';

import { createRequire } from 'node:module';

import type { NextConfig } from 'next';

const require = createRequire(import.meta.url);

const carefullyBuiltPackages = ['@carefully-built/saas-kit'];

const nextConfig: NextConfig = {
  transpilePackages: carefullyBuiltPackages,
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      'lucide-react$': require.resolve('lucide-react'),
      'react$': require.resolve('react'),
      'react-dom$': require.resolve('react-dom'),
    };
    config.resolve.symlinks = false;
    return config;
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
