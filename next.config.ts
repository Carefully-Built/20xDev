import { withGTConfig } from 'gt-next/config';

import type { NextConfig } from 'next';

const carefullyBuiltPackages = [
  '@carefully-built/agenda',
  '@carefully-built/app-shell',
  '@carefully-built/association-picker',
  '@carefully-built/auth-pages',
  '@carefully-built/automations',
  '@carefully-built/charts',
  '@carefully-built/convex-crud',
  '@carefully-built/convex-multitenant',
  '@carefully-built/convex-platform',
  '@carefully-built/convex-workos',
  '@carefully-built/crud',
  '@carefully-built/custom-fields',
  '@carefully-built/files',
  '@carefully-built/forms',
  '@carefully-built/import-export',
  '@carefully-built/kanban',
  '@carefully-built/legal-ui',
  '@carefully-built/maps-ui',
  '@carefully-built/notes',
  '@carefully-built/notifications',
  '@carefully-built/resource-kit',
  '@carefully-built/rich-text',
  '@carefully-built/search',
  '@carefully-built/settings-ui',
  '@carefully-built/superadmin',
  '@carefully-built/theme-ui',
  '@carefully-built/ui',
  '@carefully-built/user-picker',
  '@carefully-built/widgets',
  '@carefully-built/workos',
];

const nextConfig: NextConfig = {
  transpilePackages: carefullyBuiltPackages,
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
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

export default withGTConfig(nextConfig);
