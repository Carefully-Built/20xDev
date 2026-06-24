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
    const wordmarkStart = source.indexOf("if (siteConfig.logo === 'wordmark')");
    const imageReturnStart = source.indexOf('  return (\n    <Image');

    expect(wordmarkStart).toBeGreaterThanOrEqual(0);
    expect(imageReturnStart).toBeGreaterThan(wordmarkStart);

    const wordmarkBranch = source.slice(wordmarkStart, imageReturnStart);

    expect(wordmarkBranch).toContain('width');
    expect(wordmarkBranch).toContain('height');
    expect(wordmarkBranch).toContain('style');
    expect(wordmarkBranch).toContain('...style');
  });
});
