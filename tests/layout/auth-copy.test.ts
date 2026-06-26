import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

const projectRoot = process.cwd();

const expectedAuthCopyByPath = {
  'src/app/(auth)/login/page.tsx': ['Sign in', 'Continue with email'],
  'src/app/(auth)/login/email/page.tsx': [
    'Sign in with email',
    "Don't have an account?",
    'Sign up',
  ],
  'src/app/(auth)/login/select-organization/page.tsx': [
    'Choose organization',
    'Your account has access to multiple organizations.',
    'Search organizations...',
    'No organizations found',
    'Try searching for a different name.',
    'Continue with this organization',
    'No organizations available',
    'There are no organizations connected to this account.',
    'Go to dashboard',
    'Back to login',
  ],
  'src/app/(auth)/signup/email/page.tsx': [
    'Sign up with email',
    'Already have an account?',
    'Sign in',
  ],
};

function readSource(path: string): string {
  return readFileSync(join(projectRoot, path), 'utf8');
}

describe('auth page copy', () => {
  test('keeps auth pages in English', () => {
    for (const [path, expectedCopy] of Object.entries(expectedAuthCopyByPath)) {
      const source = readSource(path);

      for (const copy of expectedCopy) {
        expect(source).toContain(copy);
      }
    }
  });
});
