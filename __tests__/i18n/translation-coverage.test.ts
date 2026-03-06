import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * TEST-004 through TEST-008: Translation coverage
 * REQ: AC-3 — All user-facing strings on landing pages are wrapped with GT translation
 * REQ: AC-5 — grep -r "gt-next" src/ returns config/usage files
 * REQ: AC-6 — No hardcoded user-facing strings outside the translation system
 */
describe('Translation Coverage', () => {
  const srcDir = path.resolve(__dirname, '../../src');

  it('TEST-004: landing page hero and CTA components use <T> components', () => {
    const hero = fs.readFileSync(
      path.join(srcDir, 'app/(landing)/_components/hero-section.tsx'),
      'utf-8'
    );
    const cta = fs.readFileSync(
      path.join(srcDir, 'app/(landing)/_components/cta-section.tsx'),
      'utf-8'
    );
    expect(hero).toContain("import { T } from 'gt-next'");
    expect(hero).toContain('landing.heroTitle');
    expect(hero).toContain('landing.heroDescription');
    expect(hero).toContain('landing.getStarted');
    expect(cta).toContain("import { T } from 'gt-next'");
    expect(cta).toContain('landing.ctaTitle');
  });

  it('TEST-005: features section uses <T> components', () => {
    const content = fs.readFileSync(
      path.join(srcDir, 'app/(landing)/_components/features-section.tsx'),
      'utf-8'
    );
    expect(content).toContain("import { T } from 'gt-next'");
    expect(content).toContain('features.title');
    expect(content).toContain('features.description');
    // Feature card titles and descriptions use dynamic ids
    expect(content).toMatch(/features\.\$\{featureKeys\[i\]\}\.title/);
    expect(content).toMatch(/features\.\$\{featureKeys\[i\]\}\.desc/);
  });

  it('TEST-006: FAQ section uses <T> components', () => {
    const content = fs.readFileSync(
      path.join(srcDir, 'app/(landing)/_components/faq-section.tsx'),
      'utf-8'
    );
    expect(content).toContain("import { T } from 'gt-next'");
    expect(content).toContain('faq.title');
    expect(content).toContain('faq.q1');
    expect(content).toContain('faq.a1');
    expect(content).toContain('faq.q8');
    expect(content).toContain('faq.a8');
  });

  it('TEST-007: navigation components use <T> components', () => {
    const mainNav = fs.readFileSync(
      path.join(srcDir, 'components/layout/main-nav.tsx'),
      'utf-8'
    );
    const mobileNav = fs.readFileSync(
      path.join(srcDir, 'components/layout/mobile-nav.tsx'),
      'utf-8'
    );
    const footer = fs.readFileSync(
      path.join(srcDir, 'components/layout/Footer.tsx'),
      'utf-8'
    );
    const authButton = fs.readFileSync(
      path.join(srcDir, 'components/layout/auth-button.tsx'),
      'utf-8'
    );

    for (const content of [mainNav, mobileNav, footer, authButton]) {
      expect(content).toContain("from 'gt-next'");
    }

    expect(footer).toContain('footer.description');
    expect(footer).toContain('footer.product');
    expect(footer).toContain('footer.legal');
    expect(footer).toContain('footer.copyright');
  });

  it('TEST-008: contact page uses <T> components', () => {
    const content = fs.readFileSync(
      path.join(srcDir, 'app/(landing)/contact/page.tsx'),
      'utf-8'
    );
    expect(content).toContain("import { T } from 'gt-next'");
    expect(content).toContain('contact.title');
    expect(content).toContain('contact.nameLabel');
    expect(content).toContain('contact.emailLabel');
    expect(content).toContain('contact.messageLabel');
    expect(content).toContain('contact.sendMessage');
  });

  it('TEST-009: not-found page uses <T> components', () => {
    const content = fs.readFileSync(
      path.join(srcDir, 'app/not-found.tsx'),
      'utf-8'
    );
    expect(content).toContain("import { T } from 'gt-next'");
    expect(content).toContain('notFound.title');
    expect(content).toContain('notFound.goHome');
  });

  it('TEST-010: gt-next is imported in multiple source files', () => {
    const result = execSync(
      'grep -rl "gt-next" src/ --include="*.tsx" --include="*.ts" | wc -l',
      { cwd: path.resolve(__dirname, '../..'), encoding: 'utf-8' }
    );
    const fileCount = parseInt(result.trim(), 10);
    // At least 10 files should import gt-next
    expect(fileCount).toBeGreaterThanOrEqual(10);
  });
});
