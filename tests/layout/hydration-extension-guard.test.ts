import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

const projectRoot = process.cwd();

function readSource(path: string): string {
  return readFileSync(join(projectRoot, path), 'utf8');
}

describe('hydration extension guard', () => {
  test('removes the Jam extension iframe before React hydrates', () => {
    const source = readSource('src/app/layout.tsx');

    expect(source).toContain('strategy="beforeInteractive"');
    expect(source).toContain("'jam-ui'");
    expect(source).toContain('remove()');
  });
});
