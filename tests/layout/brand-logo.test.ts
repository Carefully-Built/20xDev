import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'bun:test';

const projectRoot = process.cwd();

function readSource(path: string): string {
  return readFileSync(join(projectRoot, path), 'utf8');
}

describe('brand logo wordmark fallback', () => {
  test('preserves sizing and style props on the text wordmark branch', () => {
    const source = readSource('src/components/shared/brand-logo.tsx');
    const wordmarkBranch = source.slice(
      source.indexOf("if (siteConfig.logo === 'wordmark')"),
      source.indexOf('  return (\n    <Image'),
    );

    expect(wordmarkBranch).toContain('width');
    expect(wordmarkBranch).toContain('height');
    expect(wordmarkBranch).toContain('style');
    expect(wordmarkBranch).toContain('...style');
  });
});
