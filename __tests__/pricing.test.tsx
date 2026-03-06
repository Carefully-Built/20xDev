/**
 * Test Plan — Issue #15: Pricing Page
 *
 * Tests cover acceptance criteria from the issue spec.
 * Focus on structural verification, data-driven config,
 * component architecture, SEO, accessibility, and security.
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

// ---------------------------------------------------------------------------
// TEST-001 | AC-ROUTE | unit | /pricing route exists
// ---------------------------------------------------------------------------
describe('Pricing Route — #15', () => {
  it('TEST-001: pricing page route exists at src/app/(landing)/pricing/page.tsx', () => {
    expect(fs.existsSync(resolve('src/app/(landing)/pricing/page.tsx'))).toBe(true);
  });

  it('TEST-002: pricing page is a Server Component (no "use client")', () => {
    const content = readFile('src/app/(landing)/pricing/page.tsx');
    expect(content).not.toContain("'use client'");
    expect(content).not.toContain('"use client"');
  });
});

// ---------------------------------------------------------------------------
// TEST-003–005 | AC-SEO | unit | Metadata
// ---------------------------------------------------------------------------
describe('SEO Metadata — #15', () => {
  it('TEST-003: page exports metadata with title', () => {
    const content = readFile('src/app/(landing)/pricing/page.tsx');
    expect(content).toContain('export const metadata');
    expect(content).toContain('title');
  });

  it('TEST-004: metadata includes a description', () => {
    const content = readFile('src/app/(landing)/pricing/page.tsx');
    expect(content).toContain('description');
    expect(content).toMatch(/description:\s*['"][^'"]+['"]/);
  });

  it('TEST-005: title contains "Pricing"', () => {
    const content = readFile('src/app/(landing)/pricing/page.tsx');
    expect(content).toMatch(/title:\s*['"].*Pricing.*['"]/);
  });
});

// ---------------------------------------------------------------------------
// TEST-006–010 | AC-CONFIG | unit | Data-driven pricing config
// ---------------------------------------------------------------------------
describe('Pricing Config — #15', () => {
  it('TEST-006: pricing config file exists', () => {
    expect(fs.existsSync(resolve('src/config/pricing.ts'))).toBe(true);
  });

  it('TEST-007: exports pricingTiers array with 3 tiers', () => {
    const content = readFile('src/config/pricing.ts');
    expect(content).toContain('export const pricingTiers');
    // Count tier objects by id field
    const tierIds = content.match(/id:\s*['"]\w+['"]/g);
    expect(tierIds).toHaveLength(3);
  });

  it('TEST-008: each tier has required fields (name, price, features, cta)', () => {
    const content = readFile('src/config/pricing.ts');
    const requiredFields = [
      'name', 'description', 'monthlyPrice', 'annualPrice',
      'features', 'cta', 'ctaHref', 'recommended',
    ];
    for (const field of requiredFields) {
      // Each field should appear in the interface
      expect(content).toContain(field);
    }
  });

  it('TEST-009: exports pricingFaqs array with at least 5 items', () => {
    const content = readFile('src/config/pricing.ts');
    expect(content).toContain('export const pricingFaqs');
    const questions = content.match(/question:\s*['"]/g);
    expect(questions).not.toBeNull();
    expect(questions!.length).toBeGreaterThanOrEqual(5);
  });

  it('TEST-010: exactly one tier is marked as recommended', () => {
    const content = readFile('src/config/pricing.ts');
    const recommendedTrue = content.match(/recommended:\s*true/g);
    const recommendedFalse = content.match(/recommended:\s*false/g);
    expect(recommendedTrue).toHaveLength(1);
    expect(recommendedFalse).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// TEST-011–013 | AC-TOGGLE | unit | Monthly/annual toggle
// ---------------------------------------------------------------------------
describe('Pricing Toggle — #15', () => {
  it('TEST-011: toggle component exists and is a Client Component', () => {
    const content = readFile('src/components/marketing/pricing-toggle.tsx');
    expect(content).toContain("'use client'");
  });

  it('TEST-012: toggle uses role="switch" for accessibility', () => {
    const content = readFile('src/components/marketing/pricing-toggle.tsx');
    expect(content).toContain('role="switch"');
    expect(content).toContain('aria-checked');
    expect(content).toContain('aria-label');
  });

  it('TEST-013: toggle has focus-visible ring for keyboard accessibility', () => {
    const content = readFile('src/components/marketing/pricing-toggle.tsx');
    expect(content).toContain('focus-visible:ring-2');
    expect(content).toContain('focus-visible:ring-ring');
  });
});

// ---------------------------------------------------------------------------
// TEST-014–017 | AC-CARD | unit | Pricing card component
// ---------------------------------------------------------------------------
describe('Pricing Card — #15', () => {
  it('TEST-014: pricing card component exists', () => {
    expect(fs.existsSync(resolve('src/components/marketing/pricing-card.tsx'))).toBe(true);
  });

  it('TEST-015: card shows price based on isAnnual prop', () => {
    const content = readFile('src/components/marketing/pricing-card.tsx');
    expect(content).toContain('tier.annualPrice');
    expect(content).toContain('tier.monthlyPrice');
    expect(content).toMatch(/isAnnual\s*\?\s*tier\.annualPrice\s*:\s*tier\.monthlyPrice/);
  });

  it('TEST-016: recommended tier has ring-2 ring-primary highlight', () => {
    const content = readFile('src/components/marketing/pricing-card.tsx');
    expect(content).toContain('ring-2 ring-primary');
    expect(content).toContain('tier.recommended');
  });

  it('TEST-017: card has CTA button with link', () => {
    const content = readFile('src/components/marketing/pricing-card.tsx');
    expect(content).toContain('<Button');
    expect(content).toContain('<Link');
    expect(content).toContain('tier.ctaHref');
    expect(content).toContain('tier.cta');
  });
});

// ---------------------------------------------------------------------------
// TEST-018–019 | AC-FAQ | unit | FAQ section
// ---------------------------------------------------------------------------
describe('Pricing FAQ — #15', () => {
  it('TEST-018: FAQ component exists and is a Client Component', () => {
    const content = readFile('src/components/marketing/pricing-faq.tsx');
    expect(content).toContain("'use client'");
  });

  it('TEST-019: FAQ reuses GenericFaqSection', () => {
    const content = readFile('src/components/marketing/pricing-faq.tsx');
    expect(content).toContain('GenericFaqSection');
  });
});

// ---------------------------------------------------------------------------
// TEST-020–021 | AC-SECTION | unit | PricingSection orchestrator
// ---------------------------------------------------------------------------
describe('Pricing Section — #15', () => {
  it('TEST-020: PricingSection is a Client Component with useState', () => {
    const content = readFile('src/app/(landing)/pricing/_components/pricing-section.tsx');
    expect(content).toContain("'use client'");
    expect(content).toContain('useState');
  });

  it('TEST-021: PricingSection renders toggle, cards grid, and FAQ', () => {
    const content = readFile('src/app/(landing)/pricing/_components/pricing-section.tsx');
    expect(content).toContain('PricingToggle');
    expect(content).toContain('PricingCard');
    expect(content).toContain('PricingFaq');
  });
});

// ---------------------------------------------------------------------------
// TEST-022 | AC-RESPONSIVE | unit | Responsive grid layout
// ---------------------------------------------------------------------------
describe('Responsive Layout — #15', () => {
  it('TEST-022: pricing cards use responsive grid (md:grid-cols-3)', () => {
    const content = readFile('src/app/(landing)/pricing/_components/pricing-section.tsx');
    expect(content).toContain('md:grid-cols-3');
    // Must have responsive padding
    expect(content).toMatch(/px-4.*sm:px-6.*lg:px-8/);
  });
});

// ---------------------------------------------------------------------------
// TEST-023 | AC-NAV | unit | Nav link updated to /pricing
// ---------------------------------------------------------------------------
describe('Navigation — #15', () => {
  it('TEST-023: landing nav links to /pricing (not /#pricing)', () => {
    const content = readFile('src/config/site.ts');
    expect(content).toContain("href: '/pricing'");
    expect(content).not.toContain("href: '/#pricing'");
  });
});

// ---------------------------------------------------------------------------
// TEST-024 | AC-I18N | unit | i18n T tags present
// ---------------------------------------------------------------------------
describe('Internationalization — #15', () => {
  it('TEST-024: pricing components use gt-next T tags', () => {
    const files = [
      'src/components/marketing/pricing-card.tsx',
      'src/components/marketing/pricing-toggle.tsx',
      'src/components/marketing/pricing-faq.tsx',
      'src/app/(landing)/pricing/_components/pricing-section.tsx',
    ];
    for (const file of files) {
      const content = readFile(file);
      expect(content).toContain("from 'gt-next'");
      expect(content).toContain('<T ');
    }
  });
});

// ---------------------------------------------------------------------------
// TEST-025 | AC-CARD-DESIGN | unit | Card follows design system
// ---------------------------------------------------------------------------
describe('Design System Compliance — #15', () => {
  it('TEST-025: pricing card follows design system (rounded-lg, border, shadow-sm)', () => {
    const content = readFile('src/components/marketing/pricing-card.tsx');
    expect(content).toContain('rounded-lg');
    expect(content).toContain('border');
    expect(content).toContain('shadow-sm');
    expect(content).toContain('hover:shadow-md');
  });
});

// ---------------------------------------------------------------------------
// TEST-026 | AC-A11Y | unit | Icons have aria-hidden
// ---------------------------------------------------------------------------
describe('Accessibility — #15', () => {
  it('TEST-026: check/x icons in pricing card have aria-hidden="true"', () => {
    const content = readFile('src/components/marketing/pricing-card.tsx');
    // Lucide icons should have aria-hidden for decorative use
    const checkIcon = content.match(/<Check[^>]*>/);
    const xIcon = content.match(/<X[^>]*>/);
    expect(checkIcon).toBeTruthy();
    expect(xIcon).toBeTruthy();
    expect(checkIcon![0]).toContain('aria-hidden="true"');
    expect(xIcon![0]).toContain('aria-hidden="true"');
  });

  it('TEST-027: toggle button has aria-label', () => {
    const content = readFile('src/components/marketing/pricing-toggle.tsx');
    expect(content).toContain('aria-label=');
  });
});

// ---------------------------------------------------------------------------
// TEST-028 | AC-SEC | unit | No security issues in pricing code
// ---------------------------------------------------------------------------
describe('Security — #15', () => {
  it('TEST-028: pricing components contain no data fetching, eval, or dangerouslySetInnerHTML', () => {
    const files = [
      'src/config/pricing.ts',
      'src/components/marketing/pricing-card.tsx',
      'src/components/marketing/pricing-toggle.tsx',
      'src/components/marketing/pricing-faq.tsx',
      'src/app/(landing)/pricing/_components/pricing-section.tsx',
      'src/app/(landing)/pricing/page.tsx',
    ];
    for (const file of files) {
      const content = readFile(file);
      expect(content).not.toContain('dangerouslySetInnerHTML');
      expect(content).not.toContain('eval(');
      expect(content).not.toContain('new Function(');
      expect(content).not.toContain('@ts-ignore');
    }
  });

  it('TEST-029: no hardcoded API keys or secrets in pricing files', () => {
    const files = [
      'src/config/pricing.ts',
      'src/components/marketing/pricing-card.tsx',
      'src/components/marketing/pricing-toggle.tsx',
      'src/components/marketing/pricing-faq.tsx',
      'src/app/(landing)/pricing/_components/pricing-section.tsx',
    ];
    for (const file of files) {
      const content = readFile(file);
      expect(content).not.toMatch(/sk_live_/);
      expect(content).not.toMatch(/pk_live_/);
      expect(content).not.toMatch(/NEXT_PUBLIC_.*=\s*['"][^'"]+['"]/);
    }
  });
});

// ---------------------------------------------------------------------------
// TEST-030 | AC-TYPESCRIPT | unit | TypeScript strict compliance
// ---------------------------------------------------------------------------
describe('TypeScript — #15', () => {
  it('TEST-030: interfaces use readonly modifiers', () => {
    const content = readFile('src/config/pricing.ts');
    // All interface fields should be readonly
    expect(content).toContain('readonly text: string');
    expect(content).toContain('readonly included: boolean');
    expect(content).toContain('readonly id: string');
    expect(content).toContain('readonly name: string');
    expect(content).toContain('readonly monthlyPrice: number');
    expect(content).toContain('readonly annualPrice: number');
  });

  it('TEST-031: component props use readonly modifier', () => {
    const cardContent = readFile('src/components/marketing/pricing-card.tsx');
    const toggleContent = readFile('src/components/marketing/pricing-toggle.tsx');
    const faqContent = readFile('src/components/marketing/pricing-faq.tsx');
    expect(cardContent).toContain('readonly tier');
    expect(cardContent).toContain('readonly isAnnual');
    expect(toggleContent).toContain('readonly isAnnual');
    expect(toggleContent).toContain('readonly onToggle');
    expect(faqContent).toContain('readonly items');
  });
});

// ---------------------------------------------------------------------------
// TEST-032 | AC-ANNUAL-DISCOUNT | unit | Annual pricing shows savings
// ---------------------------------------------------------------------------
describe('Annual Pricing Discount — #15', () => {
  it('TEST-032: annual prices are lower than monthly for all tiers', () => {
    const content = readFile('src/config/pricing.ts');
    // Extract monthly and annual prices
    const monthlyPrices = [...content.matchAll(/monthlyPrice:\s*(\d+)/g)].map(m => parseInt(m[1], 10));
    const annualPrices = [...content.matchAll(/annualPrice:\s*(\d+)/g)].map(m => parseInt(m[1], 10));
    expect(monthlyPrices).toHaveLength(3);
    expect(annualPrices).toHaveLength(3);
    for (let i = 0; i < 3; i++) {
      expect(annualPrices[i]).toBeLessThan(monthlyPrices[i]);
    }
  });

  it('TEST-033: "Save 20%" badge shown in toggle', () => {
    const content = readFile('src/components/marketing/pricing-toggle.tsx');
    expect(content).toContain('Save 20%');
  });

  it('TEST-034: "Billed annually" text shown when annual is selected', () => {
    const content = readFile('src/components/marketing/pricing-card.tsx');
    expect(content).toContain('Billed annually');
  });
});
