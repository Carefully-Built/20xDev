import { withSentryConfig } from '@sentry/nextjs';
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
    ],
  },
};

export default withSentryConfig(withGTConfig(nextConfig), {
  // Sentry organization and project slugs (from env or hardcoded for template)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Suppress source map upload logs unless in CI
  silent: !process.env.CI,

  // Auth token for source map upload (build-time only, not exposed to client)
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Upload larger set of source maps for better stack traces
  widenClientFileUpload: true,

  // Route to tunnel Sentry events through to avoid ad blockers
  tunnelRoute: '/monitoring',
});
