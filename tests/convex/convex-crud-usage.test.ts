import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

const projectRoot = process.cwd();

function readSource(path: string): string {
  return readFileSync(join(projectRoot, path), 'utf8');
}

describe('Convex CRUD helpers', () => {
  test('scoped record helpers delegate organization checks to convex-crud', () => {
    for (const path of [
      'convex/functions/contacts/helpers.ts',
      'convex/functions/items/helpers.ts',
      'convex/functions/notes/helpers.ts',
    ]) {
      const source = readSource(path);

      expect(source).toContain('@carefully-built/saas-kit');
      expect(source).toContain('getActiveOrgRecord');
    }
  });
});
