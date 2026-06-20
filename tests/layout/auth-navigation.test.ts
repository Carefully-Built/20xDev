import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

const projectRoot = process.cwd();

function readSource(path: string): string {
  return readFileSync(join(projectRoot, path), 'utf8');
}

describe('auth navigation CTAs', () => {
  test('desktop auth button sends visitors through the protected dashboard route', () => {
    const source = readSource('src/components/layout/auth-button.tsx');

    expect(source).toContain("<Link href=\"/dashboard\">");
    expect(source).not.toContain("href={isLoggedIn ? '/dashboard' : '/login'}");
  });

  test('mobile menu auth CTA sends visitors through the protected dashboard route', () => {
    const source = readSource('src/components/layout/mobile-nav.tsx');

    expect(source).toContain('<Link href="/dashboard">');
    expect(source).toContain("isLoggedIn ? 'Dashboard' : 'Sign In'");
    expect(source).not.toContain('<Link href="/login">');
  });
});
