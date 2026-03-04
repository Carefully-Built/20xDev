#!/usr/bin/env node

import { execSync } from 'child_process';

const isProduction = process.env.VERCEL_ENV === 'production';
const hasDeployKey = !!process.env.CONVEX_DEPLOY_KEY;

console.log(`Build environment: ${process.env.VERCEL_ENV || 'local'}`);
console.log(`Convex deploy key: ${hasDeployKey ? 'present' : 'missing'}`);

// Only deploy Convex on production builds
if (isProduction && hasDeployKey) {
  console.log('🚀 Deploying Convex (production build)...');
  execSync('npx convex deploy', { stdio: 'inherit' });
} else if (!isProduction && hasDeployKey) {
  console.log('⏭️  Skipping Convex deploy (preview build)');
} else {
  console.log('⏭️  Skipping Convex deploy (no deploy key)');
}

// Always build Next.js
console.log('🔨 Building Next.js...');
execSync('bunx --bun next build', { stdio: 'inherit' });
