import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * TEST-017 through TEST-020: Locale switcher component
 * REQ: AC-2 — Language switcher renders and toggles between at least 2 locales
 */
describe('Locale Switcher Component', () => {
  const componentPath = path.resolve(
    __dirname,
    '../../src/components/layout/locale-switcher.tsx'
  );
  const content = fs.readFileSync(componentPath, 'utf-8');

  it('TEST-017: locale switcher exists', () => {
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  it('TEST-018: defines at least 2 locales (EN and IT)', () => {
    expect(content).toContain("code: 'en'");
    expect(content).toContain("code: 'it'");
    expect(content).toContain("label: 'English'");
    expect(content).toContain("label: 'Italiano'");
  });

  it('TEST-019: uses GT client hooks for locale management', () => {
    expect(content).toContain("useLocale");
    expect(content).toContain("useSetLocale");
    expect(content).toContain("from 'gt-next/client'");
  });

  it('TEST-020: has data-testid for testing', () => {
    expect(content).toContain('data-testid="locale-switcher"');
  });

  it('TEST-021: is a client component', () => {
    expect(content.trimStart()).toMatch(/^['"]use client['"]/);
  });

  it('TEST-022: is integrated in site header', () => {
    const headerPath = path.resolve(
      __dirname,
      '../../src/components/layout/site-header.tsx'
    );
    const headerContent = fs.readFileSync(headerPath, 'utf-8');
    expect(headerContent).toContain('LocaleSwitcher');
    expect(headerContent).toContain("from './locale-switcher'");
    // Present in both desktop and mobile layouts
    const switcherCount = (headerContent.match(/<LocaleSwitcher/g) ?? []).length;
    expect(switcherCount).toBeGreaterThanOrEqual(2);
  });

  it('TEST-023: has accessibility label', () => {
    expect(content).toContain('sr-only');
    expect(content).toContain('Change language');
  });
});
