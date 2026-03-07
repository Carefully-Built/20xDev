/**
 * Test Plan — Issue #9: Sentry Integration
 *
 * Tests cover AC-1 through AC-8 from the issue acceptance criteria.
 * Structural verification via filesystem checks, matching existing test patterns.
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const resolve = (...segments: string[]) =>
  path.resolve(__dirname, '..', ...segments);

const readFile = (...segments: string[]) =>
  fs.readFileSync(resolve(...segments), 'utf-8');

const SERVER_CONFIG = 'sentry.server.config.ts';
const EDGE_CONFIG = 'sentry.edge.config.ts';
const CLIENT_CONFIG = 'instrumentation-client.ts';
const INSTRUMENTATION = 'instrumentation.ts';
const NEXT_CONFIG = 'next.config.ts';
const GLOBAL_ERROR = 'src/app/global-error.tsx';
const ERROR_PAGE = 'src/app/error.tsx';
const MIDDLEWARE = 'src/middleware.ts';
const ENV_EXAMPLE = '.env.example';

// ---------------------------------------------------------------------------
// TEST-001 | AC-1 | unit | Build config exists (withSentryConfig)
// ---------------------------------------------------------------------------
describe('Sentry Integration — #9', () => {
  it('TEST-001: next.config.ts wraps config with withSentryConfig', () => {
    const config = readFile(NEXT_CONFIG);
    expect(config).toContain('withSentryConfig');
    expect(config).toContain("from '@sentry/nextjs'");
  });

  // TEST-002 | AC-2 | Config files exist (server, edge, client instrumentation)
  it('TEST-002: Sentry config files exist for all runtimes', () => {
    expect(fs.existsSync(resolve(SERVER_CONFIG))).toBe(true);
    expect(fs.existsSync(resolve(EDGE_CONFIG))).toBe(true);
    expect(fs.existsSync(resolve(CLIENT_CONFIG))).toBe(true);
  });

  // TEST-003 | AC-3 | @sentry/nextjs imported in src/ files
  it('TEST-003: @sentry/nextjs is imported in src/ error boundary files', () => {
    const globalError = readFile(GLOBAL_ERROR);
    const errorPage = readFile(ERROR_PAGE);
    expect(globalError).toContain("from '@sentry/nextjs'");
    expect(errorPage).toContain("from '@sentry/nextjs'");
  });

  // TEST-004 | AC-4 | Error boundaries call Sentry.captureException
  it('TEST-004: Error boundaries capture exceptions via Sentry.captureException', () => {
    const globalError = readFile(GLOBAL_ERROR);
    const errorPage = readFile(ERROR_PAGE);
    expect(globalError).toContain('Sentry.captureException(error)');
    expect(errorPage).toContain('Sentry.captureException(error)');
  });

  // TEST-005 | AC-5 | Source map upload config
  it('TEST-005: Source maps upload configured with authToken and widenClientFileUpload', () => {
    const config = readFile(NEXT_CONFIG);
    expect(config).toContain('authToken');
    expect(config).toContain('process.env.SENTRY_AUTH_TOKEN');
    expect(config).toContain('widenClientFileUpload: true');
  });

  // TEST-006 | AC-6 | SENTRY_DSN documented in .env.example
  it('TEST-006: .env.example documents all Sentry env vars', () => {
    const envExample = readFile(ENV_EXAMPLE);
    expect(envExample).toContain('NEXT_PUBLIC_SENTRY_DSN');
    expect(envExample).toContain('SENTRY_AUTH_TOKEN');
    expect(envExample).toContain('SENTRY_ORG');
    expect(envExample).toContain('SENTRY_PROJECT');
    // Should have descriptive comment
    expect(envExample).toMatch(/^#.*[Ss]entry/m);
  });

  // TEST-007 | AC-7 | global-error.tsx renders fallback UI
  it('TEST-007: global-error.tsx renders fallback UI with 500 heading and refresh button', () => {
    const globalError = readFile(GLOBAL_ERROR);
    expect(globalError).toContain("'use client'");
    expect(globalError).toContain('500');
    expect(globalError).toContain('Critical Error');
    expect(globalError).toContain('Refresh Page');
    expect(globalError).toContain('reset');
    // Shows error digest when available
    expect(globalError).toContain('error.digest');
  });

  // TEST-008 | AC-8 | Sentry DSN-gated (no explicit enabled in dev)
  it('TEST-008: Sentry init relies on DSN presence, no hardcoded DSN', () => {
    const serverConfig = readFile(SERVER_CONFIG);
    const edgeConfig = readFile(EDGE_CONFIG);
    const clientConfig = readFile(CLIENT_CONFIG);

    // All configs use env var for DSN, not hardcoded
    expect(serverConfig).toContain('process.env.NEXT_PUBLIC_SENTRY_DSN');
    expect(edgeConfig).toContain('process.env.NEXT_PUBLIC_SENTRY_DSN');
    expect(clientConfig).toContain('process.env.NEXT_PUBLIC_SENTRY_DSN');

    // No hardcoded DSN strings (https://...ingest.sentry.io)
    expect(serverConfig).not.toMatch(/https:\/\/[a-f0-9]+@.*\.ingest\.sentry\.io/);
    expect(edgeConfig).not.toMatch(/https:\/\/[a-f0-9]+@.*\.ingest\.sentry\.io/);
    expect(clientConfig).not.toMatch(/https:\/\/[a-f0-9]+@.*\.ingest\.sentry\.io/);
  });
});

// ---------------------------------------------------------------------------
// Security checks
// ---------------------------------------------------------------------------
describe('Sentry Security — #9', () => {
  // TEST-009 | SEC | sendDefaultPii: false in all configs
  it('TEST-009: sendDefaultPii is false in all runtime configs', () => {
    const serverConfig = readFile(SERVER_CONFIG);
    const edgeConfig = readFile(EDGE_CONFIG);
    const clientConfig = readFile(CLIENT_CONFIG);

    expect(serverConfig).toContain('sendDefaultPii: false');
    expect(edgeConfig).toContain('sendDefaultPii: false');
    expect(clientConfig).toContain('sendDefaultPii: false');
  });
});

// ---------------------------------------------------------------------------
// Infrastructure checks
// ---------------------------------------------------------------------------
describe('Sentry Infrastructure — #9', () => {
  // TEST-010 | INFRA | Tunnel route /monitoring excluded from middleware
  it('TEST-010: /monitoring route excluded from middleware matcher', () => {
    const middleware = readFile(MIDDLEWARE);
    expect(middleware).toContain('monitoring');
    // Verify it's in the matcher exclusion pattern
    expect(middleware).toMatch(/matcher.*monitoring/s);
  });

  // TEST-011 | INFRA | instrumentation.ts registers server+edge configs
  it('TEST-011: instrumentation.ts dynamically imports server and edge configs', () => {
    const instrumentation = readFile(INSTRUMENTATION);
    expect(instrumentation).toContain("import('./sentry.server.config')");
    expect(instrumentation).toContain("import('./sentry.edge.config')");
    expect(instrumentation).toContain("process.env.NEXT_RUNTIME === 'nodejs'");
    expect(instrumentation).toContain("process.env.NEXT_RUNTIME === 'edge'");
  });

  // TEST-012 | INFRA | Client exports captureRouterTransitionStart
  it('TEST-012: Client config exports captureRouterTransitionStart for router monitoring', () => {
    const clientConfig = readFile(CLIENT_CONFIG);
    expect(clientConfig).toContain('captureRouterTransitionStart');
    expect(clientConfig).toContain('onRouterTransitionStart');
  });

  // TEST-013 | INFRA | instrumentation.ts exports onRequestError
  it('TEST-013: instrumentation.ts exports Sentry.captureRequestError', () => {
    const instrumentation = readFile(INSTRUMENTATION);
    expect(instrumentation).toContain('onRequestError');
    expect(instrumentation).toContain('Sentry.captureRequestError');
  });

  // TEST-014 | INFRA | withSentryConfig has tunnelRoute
  it('TEST-014: withSentryConfig configures tunnelRoute for ad blocker bypass', () => {
    const config = readFile(NEXT_CONFIG);
    expect(config).toContain("tunnelRoute: '/monitoring'");
  });

  // TEST-015 | INFRA | Performance tracing sample rates configured
  it('TEST-015: Trace sample rates are env-aware (higher in dev, lower in prod)', () => {
    const serverConfig = readFile(SERVER_CONFIG);
    expect(serverConfig).toMatch(
      /tracesSampleRate:.*process\.env\.NODE_ENV\s*===\s*['"]development['"]\s*\?\s*1\.0\s*:\s*0\.1/,
    );
  });

  // TEST-016 | INFRA | Sentry org/project from env vars, not hardcoded
  it('TEST-016: Sentry org and project read from env vars', () => {
    const config = readFile(NEXT_CONFIG);
    expect(config).toContain('process.env.SENTRY_ORG');
    expect(config).toContain('process.env.SENTRY_PROJECT');
  });
});

// ---------------------------------------------------------------------------
// Error boundary component structure
// ---------------------------------------------------------------------------
describe('Error Boundary Components — #9', () => {
  it('global-error.tsx is a client component', () => {
    const globalError = readFile(GLOBAL_ERROR);
    expect(globalError).toMatch(/^['"]use client['"]/);
  });

  it('global-error.tsx wraps content in html+body tags (required for global error)', () => {
    const globalError = readFile(GLOBAL_ERROR);
    expect(globalError).toContain('<html');
    expect(globalError).toContain('<body');
  });

  it('error.tsx is a client component with Sentry integration', () => {
    const errorPage = readFile(ERROR_PAGE);
    expect(errorPage).toMatch(/^['"]use client['"]/);
    expect(errorPage).toContain('Sentry.captureException');
  });

  it('error.tsx has Try Again and Go Home actions', () => {
    const errorPage = readFile(ERROR_PAGE);
    expect(errorPage).toContain('Try Again');
    expect(errorPage).toContain('Go Home');
    expect(errorPage).toContain('reset');
  });

  it('error.tsx uses useEffect for error capture (not in render)', () => {
    const errorPage = readFile(ERROR_PAGE);
    expect(errorPage).toContain('useEffect');
    // captureException should be inside useEffect, not at render time
    const useEffectPos = errorPage.indexOf('useEffect');
    const capturePos = errorPage.indexOf('Sentry.captureException');
    expect(capturePos).toBeGreaterThan(useEffectPos);
  });

  it('global-error.tsx uses useEffect for error capture (not in render)', () => {
    const globalError = readFile(GLOBAL_ERROR);
    expect(globalError).toContain('useEffect');
    const useEffectPos = globalError.indexOf('useEffect');
    const capturePos = globalError.indexOf('Sentry.captureException');
    expect(capturePos).toBeGreaterThan(useEffectPos);
  });

  it('error.tsx has typed props with readonly fields', () => {
    const errorPage = readFile(ERROR_PAGE);
    expect(errorPage).toContain('readonly error:');
    expect(errorPage).toContain('readonly reset:');
  });

  it('global-error.tsx has typed props with readonly fields', () => {
    const globalError = readFile(GLOBAL_ERROR);
    expect(globalError).toContain('readonly error:');
    expect(globalError).toContain('readonly reset:');
  });
});
