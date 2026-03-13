#!/usr/bin/env node

import { execSync } from 'child_process';

// Debug info
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('NEXT_PUBLIC_SANITY_PROJECT_ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'not set');
console.log('NEXT_PUBLIC_SANITY_DATASET:', process.env.NEXT_PUBLIC_SANITY_DATASET || 'not set');

try {
  const bunVersion = execSync('bun --version', { encoding: 'utf8' }).trim();
  console.log('Bun version:', bunVersion);
} catch {
  console.log('Bun version: not available');
}

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
try {
  execSync('bunx --bun next build', { stdio: 'inherit' });
  console.log('✅ Next.js build completed successfully');
} catch (error) {
  console.error('❌ Next.js build failed');
  console.error('Exit code:', error.status);
  console.error('Signal:', error.signal);
  if (error.stdout) console.error('stdout:', error.stdout.toString());
  if (error.stderr) console.error('stderr:', error.stderr.toString());
  process.exit(1);
}
