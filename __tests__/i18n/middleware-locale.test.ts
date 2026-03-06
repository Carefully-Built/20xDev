import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * TEST-011 through TEST-014: Middleware locale routing
 * REQ: AC-4 — URL changes to reflect locale (e.g., /it/, /en/)
 */
describe('Middleware Locale Routing', () => {
  const middlewarePath = path.resolve(__dirname, '../../src/middleware.ts');
  const content = fs.readFileSync(middlewarePath, 'utf-8');

  it('TEST-011: middleware imports GT middleware', () => {
    expect(content).toContain("import { createNextMiddleware } from 'gt-next/middleware'");
  });

  it('TEST-012: middleware enables locale routing', () => {
    expect(content).toContain('localeRouting: true');
  });

  it('TEST-013: middleware does not prefix default locale', () => {
    expect(content).toContain('prefixDefaultLocale: false');
  });

  it('TEST-014: stripLocalePrefix handles locale URL patterns', () => {
    expect(content).toContain('function stripLocalePrefix');
    // Regex handles both /en and /it prefixes
    expect(content).toMatch(/\/\(\?:en\|it\)/);
  });

  it('TEST-015: isPublicPath strips locale before matching', () => {
    expect(content).toContain('function isPublicPath');
    expect(content).toContain('stripLocalePrefix(pathname)');
  });

  it('TEST-016: middleware function runs GT middleware before auth check', () => {
    // Extract just the middleware function body to check call order
    const middlewareFnStart = content.indexOf('export async function middleware');
    expect(middlewareFnStart).toBeGreaterThan(-1);
    const fnBody = content.slice(middlewareFnStart);

    // gtMiddleware(request) is called first
    expect(fnBody).toContain('const gtResponse = gtMiddleware(request)');
    // Within the function body, GT redirect check comes before public path check
    const gtResponseIdx = fnBody.indexOf('gtResponse.headers.get');
    const isPublicIdx = fnBody.indexOf('isPublicPath(pathname)');
    const sessionIdx = fnBody.indexOf('getSessionFromRequest');
    expect(gtResponseIdx).toBeLessThan(isPublicIdx);
    expect(isPublicIdx).toBeLessThan(sessionIdx);
  });
});
