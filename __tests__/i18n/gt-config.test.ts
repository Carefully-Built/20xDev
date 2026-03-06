import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * TEST-001: GT config validation
 * REQ: AC-5 — grep -r "gt-next" returns config/usage files
 */
describe('GT Configuration', () => {
  const rootDir = path.resolve(__dirname, '../..');

  it('TEST-001: gt.config.json exists with required fields', () => {
    const configPath = path.join(rootDir, 'gt.config.json');
    expect(fs.existsSync(configPath)).toBe(true);

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    expect(config).toHaveProperty('projectId');
    expect(config).toHaveProperty('defaultLocale', 'en');
    expect(config).toHaveProperty('locales');
    expect(config.locales).toContain('en');
    expect(config.locales).toContain('it');
  });

  it('TEST-002: gt-next is listed as a dependency in package.json', () => {
    const pkgPath = path.join(rootDir, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    expect(pkg.dependencies).toHaveProperty('gt-next');
  });

  it('TEST-003: next.config.ts wraps with withGTConfig', () => {
    const configPath = path.join(rootDir, 'next.config.ts');
    const content = fs.readFileSync(configPath, 'utf-8');
    expect(content).toContain('withGTConfig');
    expect(content).toContain("gt-next/config");
  });
});
