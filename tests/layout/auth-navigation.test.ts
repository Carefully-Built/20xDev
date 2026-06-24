import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

const projectRoot = process.cwd();

function readSource(path: string): string {
  return readFileSync(join(projectRoot, path), 'utf8');
}

describe('auth navigation CTAs', () => {
  test('desktop auth button sends logged-out visitors to login and users to dashboard', () => {
    const source = readSource('src/components/layout/auth-button.tsx');

    expect(source).toContain("href={isLoggedIn ? '/dashboard' : '/login'}");
    expect(source).toContain('isLoggedIn ? <T>Dashboard</T> : <T>Sign In</T>');
  });

  test('mobile menu auth CTA sends logged-out visitors to login and users to dashboard', () => {
    const source = readSource('src/components/layout/mobile-nav.tsx');

    expect(source).toContain("href={isLoggedIn ? '/dashboard' : '/login'}");
    expect(source).toContain("isLoggedIn ? 'Dashboard' : 'Sign In'");
  });
});
