/**
 * Test Plan — Issue #12: About Page
 *
 * Tests cover REQ-001 through REQ-UX-006 from the expanded spec.
 * Structural verification via filesystem checks, matching existing test patterns.
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const resolve = (...segments: string[]) =>
  path.resolve(__dirname, '..', ...segments);

const readFile = (...segments: string[]) =>
  fs.readFileSync(resolve(...segments), 'utf-8');

const ABOUT_PAGE = 'src/app/(landing)/about/page.tsx';
const FOOTER = 'src/components/layout/Footer.tsx';
const SITE_CONFIG = 'src/config/site.ts';

// ---------------------------------------------------------------------------
// TEST-001 | REQ-001 | unit | About page route exists
// ---------------------------------------------------------------------------
describe('About Page Route — #12', () => {
  it('TEST-001: about page file exists at (landing)/about/page.tsx (REQ-001)', () => {
    expect(fs.existsSync(resolve(ABOUT_PAGE))).toBe(true);
  });

  it('TEST-002: about page is a Server Component — no "use client" (REQ-009)', () => {
    const content = readFile(ABOUT_PAGE);
    expect(content).not.toContain("'use client'");
    expect(content).not.toContain('"use client"');
  });
});

// ---------------------------------------------------------------------------
// TEST-003–005 | REQ-002–004 | unit | Metadata
// ---------------------------------------------------------------------------
describe('SEO Metadata — #12', () => {
  it('TEST-003: page exports metadata with title containing "About" (REQ-002)', () => {
    const content = readFile(ABOUT_PAGE);
    expect(content).toContain('export const metadata');
    expect(content).toMatch(/title:\s*['"].*About.*['"]/);
  });

  it('TEST-004: metadata includes a description string (REQ-003)', () => {
    const content = readFile(ABOUT_PAGE);
    expect(content).toContain('description');
    expect(content).toMatch(/description:\s*\n?\s*['"][^'"]+['"]/);
  });

  it('TEST-005: metadata has openGraph with title and description (REQ-004)', () => {
    const content = readFile(ABOUT_PAGE);
    expect(content).toContain('openGraph');
    // openGraph block should have both title and description
    const ogMatch = content.match(/openGraph:\s*\{[\s\S]*?\}/);
    expect(ogMatch).toBeTruthy();
    expect(ogMatch![0]).toContain('title');
    expect(ogMatch![0]).toContain('description');
  });
});

// ---------------------------------------------------------------------------
// TEST-006–008 | REQ-005–008 | unit | Page sections
// ---------------------------------------------------------------------------
describe('Page Sections — #12', () => {
  it('TEST-006: page renders mission and vision headings (REQ-005)', () => {
    const content = readFile(ABOUT_PAGE);
    expect(content).toMatch(/Mission/i);
    expect(content).toMatch(/Vision/i);
  });

  it('TEST-007: page renders values section with Lucide icons (REQ-006)', () => {
    const content = readFile(ABOUT_PAGE);
    expect(content).toContain('lucide-react');
    // Should have value cards with icons
    const iconImports = content.match(/import\s*\{[^}]*\}\s*from\s*['"]lucide-react['"]/);
    expect(iconImports).toBeTruthy();
    // At least 4 icons imported (one per value card)
    const icons = iconImports![0].match(/[A-Z][a-zA-Z]+/g);
    expect(icons!.length).toBeGreaterThanOrEqual(4);
  });

  it('TEST-008: page renders CTA with link to /login or /contact (REQ-008)', () => {
    const content = readFile(ABOUT_PAGE);
    const hasLogin = content.includes("href=\"/login\"") || content.includes("href='/login'");
    const hasContact = content.includes("href=\"/contact\"") || content.includes("href='/contact'");
    expect(hasLogin || hasContact).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// TEST-009 | REQ-010 | unit | Build verification (structural)
// ---------------------------------------------------------------------------
describe('Build Verification — #12', () => {
  it('TEST-009: page exports a default function component (REQ-010)', () => {
    const content = readFile(ABOUT_PAGE);
    expect(content).toMatch(/export\s+default\s+function\s+AboutPage/);
  });

  it('TEST-010: page returns valid JSX (has closing fragment or element)', () => {
    const content = readFile(ABOUT_PAGE);
    // Should have a fragment wrapper or main element
    const hasFragment = content.includes('<>') && content.includes('</>');
    const hasMain = content.includes('<main');
    expect(hasFragment || hasMain).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// TEST-011 | REQ-011 | unit | Footer About link
// ---------------------------------------------------------------------------
describe('Footer Navigation — #12', () => {
  it('TEST-011: footer contains About link to /about (REQ-011)', () => {
    const content = readFile(FOOTER);
    expect(content).toContain("'About'");
    expect(content).toContain("'/about'");
  });

  it('TEST-012: landingNav in site.ts includes About link', () => {
    const content = readFile(SITE_CONFIG);
    expect(content).toContain("'About'");
    expect(content).toContain("'/about'");
  });
});

// ---------------------------------------------------------------------------
// TEST-013–014 | REQ-SEC-001–002 | unit | Security
// ---------------------------------------------------------------------------
describe('Security — #12', () => {
  it('TEST-013: no user input, mutations, or API calls (REQ-SEC-001)', () => {
    const content = readFile(ABOUT_PAGE);
    expect(content).not.toContain('fetch(');
    expect(content).not.toContain('useMutation');
    expect(content).not.toContain('useAction');
    expect(content).not.toContain('api.');
    expect(content).not.toContain('dangerouslySetInnerHTML');
    expect(content).not.toContain('eval(');
    expect(content).not.toContain('new Function(');
    expect(content).not.toContain('@ts-ignore');
  });

  it('TEST-014: no PII or sensitive data exposed (REQ-SEC-002)', () => {
    const content = readFile(ABOUT_PAGE);
    expect(content).not.toMatch(/sk_live_/);
    expect(content).not.toMatch(/pk_live_/);
    expect(content).not.toMatch(/password/i);
    expect(content).not.toMatch(/secret/i);
    expect(content).not.toMatch(/NEXT_PUBLIC_.*=\s*['"][^'"]+['"]/);
  });
});

// ---------------------------------------------------------------------------
// TEST-015–017 | REQ-I18N-001–003 | unit | Internationalization
// ---------------------------------------------------------------------------
describe('Internationalization — #12', () => {
  it('TEST-015: all user-visible strings wrapped in <T> from gt-next (REQ-I18N-001)', () => {
    const content = readFile(ABOUT_PAGE);
    expect(content).toContain("from 'gt-next'");
    // Count T tags — should be >= 8 for all headings and body text
    const tTags = content.match(/<T /g);
    expect(tTags).not.toBeNull();
    expect(tTags!.length).toBeGreaterThanOrEqual(8);
  });

  it('TEST-016: each <T> has unique about.* ID (REQ-I18N-002)', () => {
    const content = readFile(ABOUT_PAGE);
    const ids = [...content.matchAll(/id=["']([^"']+)["']/g)]
      .map((m) => m[1])
      .filter((id) => id?.startsWith('about.'));
    // At least 8 unique IDs
    expect(ids.length).toBeGreaterThanOrEqual(8);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('TEST-017: footer About link uses i18n pattern (REQ-I18N-003)', () => {
    const content = readFile(FOOTER);
    // Footer uses dynamic T id pattern: footer.link.${link.id}
    expect(content).toContain('footer.link.');
    // About entry has id: 'about' which generates footer.link.about
    expect(content).toMatch(/id:\s*['"]about['"]/);
  });
});

// ---------------------------------------------------------------------------
// TEST-018–022 | REQ-A11Y-001–005 | unit | Accessibility
// ---------------------------------------------------------------------------
describe('Accessibility — #12', () => {
  it('TEST-018: exactly one <h1> element (REQ-A11Y-001)', () => {
    const content = readFile(ABOUT_PAGE);
    const h1Count = (content.match(/<h1/g) ?? []).length;
    expect(h1Count).toBe(1);
  });

  it('TEST-019: heading hierarchy is sequential h1 -> h2 -> h3 (REQ-A11Y-002)', () => {
    const content = readFile(ABOUT_PAGE);
    const headings = [...content.matchAll(/<h([1-6])/g)].map((m) =>
      parseInt(m[1], 10),
    );
    expect(headings.length).toBeGreaterThanOrEqual(3);
    // First heading should be h1
    expect(headings[0]).toBe(1);
    // No heading should skip more than 1 level
    for (let i = 1; i < headings.length; i++) {
      expect(headings[i] - headings[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  it('TEST-020: interactive elements have accessible text (REQ-A11Y-003)', () => {
    const content = readFile(ABOUT_PAGE);
    // Buttons with text content (not icon-only) are accessible
    const buttonMatches = content.match(/<Button[^>]*>[\s\S]*?<\/Button>/g);
    expect(buttonMatches).toBeTruthy();
    // Each button should contain text or aria-label
    for (const btn of buttonMatches!) {
      const hasText = btn.match(/>[\s\S]*\w+[\s\S]*</);
      const hasAriaLabel = btn.includes('aria-label');
      expect(hasText || hasAriaLabel).toBeTruthy();
    }
  });

  it('TEST-021: semantic HTML with <section> elements (REQ-A11Y-004)', () => {
    const content = readFile(ABOUT_PAGE);
    const sectionCount = (content.match(/<section/g) ?? []).length;
    expect(sectionCount).toBeGreaterThanOrEqual(3);
  });

  it('TEST-022: color contrast via theme tokens only (REQ-A11Y-005)', () => {
    const content = readFile(ABOUT_PAGE);
    // Should NOT use custom color classes — only theme tokens
    const customColors = content.match(
      /text-(?!foreground|muted-foreground|primary|sm|lg|xl|2xl|3xl|4xl|xs|center)\w+-\d{3}/g,
    );
    expect(customColors).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// TEST-023–025 | REQ-UX-001–006 | unit | UX / Responsive
// ---------------------------------------------------------------------------
describe('UX & Responsive Design — #12', () => {
  it('TEST-023: container uses max-w-* mx-auto px-4 sm:px-6 lg:px-8 (REQ-UX-001)', () => {
    const content = readFile(ABOUT_PAGE);
    expect(content).toMatch(/max-w-\d*xl/);
    expect(content).toContain('mx-auto');
    expect(content).toContain('px-4');
    expect(content).toContain('sm:px-6');
    expect(content).toContain('lg:px-8');
  });

  it('TEST-024: section spacing uses py-16 md:py-24 (REQ-UX-002)', () => {
    const content = readFile(ABOUT_PAGE);
    const pyMatches = content.match(/py-16\s+md:py-24/g);
    expect(pyMatches).not.toBeNull();
    expect(pyMatches!.length).toBeGreaterThanOrEqual(3);
  });

  it('TEST-025: mobile-first responsive grids (REQ-UX-003)', () => {
    const content = readFile(ABOUT_PAGE);
    // Should have responsive grid classes
    const hasResponsiveGrid =
      content.includes('md:grid-cols-') ||
      content.includes('lg:grid-cols-') ||
      content.includes('sm:grid-cols-');
    expect(hasResponsiveGrid).toBe(true);
  });

  it('TEST-026: touch targets >= 44px via button size="lg" (REQ-UX-005)', () => {
    const content = readFile(ABOUT_PAGE);
    // Buttons should use size="lg" for 44px touch targets
    expect(content).toContain('size="lg"');
  });

  it('TEST-027: typography follows design system scale (REQ-UX-006)', () => {
    const content = readFile(ABOUT_PAGE);
    // h1: text-3xl font-bold
    expect(content).toMatch(/text-3xl\s+font-bold/);
    // h2: text-2xl font-semibold
    expect(content).toMatch(/text-2xl\s+font-semibold/);
  });
});
