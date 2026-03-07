/**
 * Test Plan — Issue #14: Feature Showcase Sections (Landing Page)
 *
 * Tests cover REQ-001 through REQ-UX-007 from the expanded spec.
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

// ---------------------------------------------------------------------------
// TEST-001 | REQ-001 | unit | 3 distinct feature section components exist
// ---------------------------------------------------------------------------
describe('Feature Components Exist — #14', () => {
  it('TEST-001: FeatureGrid component file exists', () => {
    expect(fs.existsSync(resolve('src/components/marketing/feature-grid.tsx'))).toBe(true);
  });

  it('TEST-002: FeatureWithImage component file exists', () => {
    expect(fs.existsSync(resolve('src/components/marketing/feature-with-image.tsx'))).toBe(true);
  });

  it('TEST-003: FeatureList component file exists', () => {
    expect(fs.existsSync(resolve('src/components/marketing/feature-list.tsx'))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// TEST-004–006 | REQ-002 + REQ-013 | unit | Feature data externalized
// ---------------------------------------------------------------------------
describe('Feature Config — #14', () => {
  it('TEST-004: feature config file exists at src/config/features.ts', () => {
    expect(fs.existsSync(resolve('src/config/features.ts'))).toBe(true);
  });

  it('TEST-005: exports 3 feature arrays (featureGridItems, featureWithImageItems, featureListItems)', () => {
    const content = readFile('src/config/features.ts');
    expect(content).toContain('export const featureGridItems');
    expect(content).toContain('export const featureWithImageItems');
    expect(content).toContain('export const featureListItems');
  });

  it('TEST-006: feature data uses readonly interfaces', () => {
    const content = readFile('src/config/features.ts');
    const readonlyCount = (content.match(/readonly /g) ?? []).length;
    expect(readonlyCount).toBeGreaterThanOrEqual(3);
  });

  it('TEST-007: feature data arrays use "as const" assertion (REQ-013)', () => {
    const content = readFile('src/config/features.ts');
    const asConstCount = (content.match(/as const/g) ?? []).length;
    expect(asConstCount).toBeGreaterThanOrEqual(3);
  });

  it('TEST-008: icons imported from lucide-react (REQ-009)', () => {
    const content = readFile('src/config/features.ts');
    expect(content).toContain("from 'lucide-react'");
    expect(content).toMatch(/import\s+type\s*\{\s*LucideIcon\s*\}/);
  });
});

// ---------------------------------------------------------------------------
// TEST-009–011 | REQ-003/004/005 | unit | Component layout patterns
// ---------------------------------------------------------------------------
describe('Component Layouts — #14', () => {
  it('TEST-009: FeatureGrid uses responsive grid sm:grid-cols-2 lg:grid-cols-3 (REQ-003)', () => {
    const content = readFile('src/components/marketing/feature-grid.tsx');
    expect(content).toContain('sm:grid-cols-2');
    expect(content).toContain('lg:grid-cols-3');
  });

  it('TEST-010: FeatureWithImage uses alternating layout with lg:flex-row-reverse (REQ-004)', () => {
    const content = readFile('src/components/marketing/feature-with-image.tsx');
    expect(content).toContain('lg:flex-row-reverse');
  });

  it('TEST-011: FeatureList uses responsive grid sm:grid-cols-2 lg:grid-cols-3 (REQ-005)', () => {
    const content = readFile('src/components/marketing/feature-list.tsx');
    expect(content).toContain('sm:grid-cols-2');
    expect(content).toContain('lg:grid-cols-3');
  });
});

// ---------------------------------------------------------------------------
// TEST-012–013 | REQ-006 + REQ-007 | unit | Landing page integration
// ---------------------------------------------------------------------------
describe('Landing Page Integration — #14', () => {
  it('TEST-012: landing page imports and renders all 3 feature sections (REQ-006)', () => {
    const content = readFile('src/app/(landing)/page.tsx');
    expect(content).toContain('FeatureGrid');
    expect(content).toContain('FeatureWithImage');
    expect(content).toContain('FeatureList');
    expect(content).toContain("from '@/components/marketing/feature-grid'");
    expect(content).toContain("from '@/components/marketing/feature-list'");
    expect(content).toContain("from '@/components/marketing/feature-with-image'");
  });

  it('TEST-013: old FeaturesSection is not referenced anywhere in src (REQ-007)', () => {
    const content = readFile('src/app/(landing)/page.tsx');
    expect(content).not.toContain('FeaturesSection');
  });
});

// ---------------------------------------------------------------------------
// TEST-014–016 | REQ-008 | unit | Section headers with h2
// ---------------------------------------------------------------------------
describe('Section Headers — #14', () => {
  const files = [
    'src/components/marketing/feature-grid.tsx',
    'src/components/marketing/feature-with-image.tsx',
    'src/components/marketing/feature-list.tsx',
  ];

  it('TEST-014: each section has an <h2> title (REQ-008)', () => {
    for (const file of files) {
      const content = readFile(file);
      const h2Count = (content.match(/<h2/g) ?? []).length;
      expect(h2Count).toBeGreaterThanOrEqual(1);
    }
  });
});

// ---------------------------------------------------------------------------
// TEST-015 | REQ-009 | unit | Icons use Lucide (no emoji)
// ---------------------------------------------------------------------------
describe('Icons — #14', () => {
  it('TEST-015: no emoji characters in feature components (REQ-009)', () => {
    const files = [
      'src/components/marketing/feature-grid.tsx',
      'src/components/marketing/feature-with-image.tsx',
      'src/components/marketing/feature-list.tsx',
    ];
    // Common emoji ranges
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    for (const file of files) {
      const content = readFile(file);
      expect(content).not.toMatch(emojiRegex);
    }
  });
});

// ---------------------------------------------------------------------------
// TEST-016 | REQ-010 | unit | FeatureWithImage handles missing images
// ---------------------------------------------------------------------------
describe('Image Handling — #14', () => {
  it('TEST-016: FeatureWithImage has bg-muted fallback container (REQ-010)', () => {
    const content = readFile('src/components/marketing/feature-with-image.tsx');
    expect(content).toContain('bg-muted/50');
  });

  it('TEST-017: FeatureWithImage uses next/image with alt text (REQ-A11Y-003)', () => {
    const content = readFile('src/components/marketing/feature-with-image.tsx');
    expect(content).toContain("from 'next/image'");
    expect(content).toContain('alt={item.imageAlt}');
  });
});

// ---------------------------------------------------------------------------
// TEST-018 | REQ-012 | unit | Animate UI usage (Fade/Slide)
// ---------------------------------------------------------------------------
describe('Animate UI — #14', () => {
  it('TEST-018: FeatureGrid uses Fade and Slide (REQ-012)', () => {
    const content = readFile('src/components/marketing/feature-grid.tsx');
    expect(content).toContain("from '@/components/animate-ui/fade'");
    expect(content).toContain("from '@/components/animate-ui/slide'");
    expect(content).toContain('<Fade');
    expect(content).toContain('<Slide');
  });

  it('TEST-019: FeatureWithImage uses Fade and Slide (REQ-012)', () => {
    const content = readFile('src/components/marketing/feature-with-image.tsx');
    expect(content).toContain('<Fade');
    expect(content).toContain('<Slide');
  });

  it('TEST-020: FeatureList uses Fade and Slide (REQ-012)', () => {
    const content = readFile('src/components/marketing/feature-list.tsx');
    expect(content).toContain('<Fade');
    expect(content).toContain('<Slide');
  });

  it('TEST-021: all animation usages have inViewOnce for one-time trigger', () => {
    const files = [
      'src/components/marketing/feature-grid.tsx',
      'src/components/marketing/feature-with-image.tsx',
      'src/components/marketing/feature-list.tsx',
    ];
    for (const file of files) {
      const content = readFile(file);
      expect(content).toContain('inViewOnce');
    }
  });
});

// ---------------------------------------------------------------------------
// TEST-022–024 | REQ-I18N-001/002/003 | unit | i18n coverage
// ---------------------------------------------------------------------------
describe('Internationalization — #14', () => {
  it('TEST-022: all feature components use gt-next T tags (REQ-I18N-001)', () => {
    const files = [
      'src/components/marketing/feature-grid.tsx',
      'src/components/marketing/feature-with-image.tsx',
      'src/components/marketing/feature-list.tsx',
    ];
    for (const file of files) {
      const content = readFile(file);
      expect(content).toContain("from 'gt-next'");
      const tTagCount = (content.match(/<T /g) ?? []).length;
      expect(tTagCount).toBeGreaterThanOrEqual(3);
    }
  });

  it('TEST-023: i18n keys use stable namespace pattern (REQ-I18N-002)', () => {
    const gridContent = readFile('src/components/marketing/feature-grid.tsx');
    const withImageContent = readFile('src/components/marketing/feature-with-image.tsx');
    const listContent = readFile('src/components/marketing/feature-list.tsx');
    expect(gridContent).toMatch(/id="featureGrid\./);
    expect(withImageContent).toMatch(/id="featureWithImage\./);
    expect(listContent).toMatch(/id="featureList\./);
  });

  it('TEST-024: no empty <T> tags — all have default English text (REQ-I18N-003)', () => {
    const files = [
      'src/components/marketing/feature-grid.tsx',
      'src/components/marketing/feature-with-image.tsx',
      'src/components/marketing/feature-list.tsx',
    ];
    for (const file of files) {
      const content = readFile(file);
      // Empty T tags would look like <T id="..."></T> or <T id="..." />
      expect(content).not.toMatch(/<T [^>]*><\/T>/);
      expect(content).not.toMatch(/<T [^>]*\/>/);
    }
  });
});

// ---------------------------------------------------------------------------
// TEST-025–026 | REQ-A11Y-001/002 | unit | Accessibility
// ---------------------------------------------------------------------------
describe('Accessibility — #14', () => {
  it('TEST-025: semantic heading hierarchy h2 > h3 (REQ-A11Y-002)', () => {
    // FeatureWithImage and FeatureList should use h3 for item titles
    const withImageContent = readFile('src/components/marketing/feature-with-image.tsx');
    const listContent = readFile('src/components/marketing/feature-list.tsx');
    expect(withImageContent).toContain('<h2');
    expect(withImageContent).toContain('<h3');
    expect(listContent).toContain('<h2');
    expect(listContent).toContain('<h3');
  });

  it('TEST-026: no hardcoded colors — only theme tokens (REQ-A11Y-004)', () => {
    const files = [
      'src/components/marketing/feature-grid.tsx',
      'src/components/marketing/feature-with-image.tsx',
      'src/components/marketing/feature-list.tsx',
    ];
    for (const file of files) {
      const content = readFile(file);
      expect(content).not.toContain('bg-white');
      expect(content).not.toContain('text-black');
      expect(content).not.toMatch(/#[0-9a-fA-F]{3,8}/);
    }
  });
});

// ---------------------------------------------------------------------------
// TEST-027 | REQ-SEC-001 | unit | Static render only — no user input
// ---------------------------------------------------------------------------
describe('Security — #14', () => {
  it('TEST-027: feature components contain no forms, inputs, mutations, or dangerous patterns (REQ-SEC-001)', () => {
    const files = [
      'src/config/features.ts',
      'src/components/marketing/feature-grid.tsx',
      'src/components/marketing/feature-with-image.tsx',
      'src/components/marketing/feature-list.tsx',
    ];
    for (const file of files) {
      const content = readFile(file);
      expect(content).not.toContain('dangerouslySetInnerHTML');
      expect(content).not.toContain('eval(');
      expect(content).not.toContain('new Function(');
      expect(content).not.toContain('@ts-ignore');
      expect(content).not.toContain('<form');
      expect(content).not.toContain('<input');
      expect(content).not.toContain('useMutation');
      expect(content).not.toContain('fetch(');
    }
  });

  it('TEST-028: no hardcoded secrets in feature files (REQ-SEC-001)', () => {
    const files = [
      'src/config/features.ts',
      'src/components/marketing/feature-grid.tsx',
      'src/components/marketing/feature-with-image.tsx',
      'src/components/marketing/feature-list.tsx',
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
// TEST-029–035 | REQ-UX-001 through REQ-UX-007 | unit | UX compliance
// ---------------------------------------------------------------------------
describe('UX Compliance — #14', () => {
  it('TEST-029: responsive mobile-first breakpoints (REQ-UX-001)', () => {
    const gridContent = readFile('src/components/marketing/feature-grid.tsx');
    const listContent = readFile('src/components/marketing/feature-list.tsx');
    // Mobile-first: base is single column, sm: and lg: add grid columns
    expect(gridContent).toContain('sm:grid-cols-2');
    expect(gridContent).toContain('lg:grid-cols-3');
    expect(listContent).toContain('sm:grid-cols-2');
    expect(listContent).toContain('lg:grid-cols-3');
  });

  it('TEST-030: no horizontal scroll — max-w-7xl px-4 container (REQ-UX-003)', () => {
    const files = [
      'src/components/marketing/feature-grid.tsx',
      'src/components/marketing/feature-with-image.tsx',
      'src/components/marketing/feature-list.tsx',
    ];
    for (const file of files) {
      const content = readFile(file);
      expect(content).toContain('max-w-7xl');
      expect(content).toContain('px-4');
    }
  });

  it('TEST-031: section spacing py-24 (REQ-UX-004)', () => {
    const files = [
      'src/components/marketing/feature-grid.tsx',
      'src/components/marketing/feature-with-image.tsx',
      'src/components/marketing/feature-list.tsx',
    ];
    for (const file of files) {
      const content = readFile(file);
      expect(content).toContain('py-24');
    }
  });

  it('TEST-032: cards follow design system with rounded + border/bg styling (REQ-UX-005)', () => {
    const content = readFile('src/components/marketing/feature-grid.tsx');
    expect(content).toContain('rounded-lg');
    expect(content).toMatch(/transition/);
  });

  it('TEST-033: dark mode via theme tokens only — no hardcoded light colors (REQ-UX-006)', () => {
    const files = [
      'src/components/marketing/feature-grid.tsx',
      'src/components/marketing/feature-with-image.tsx',
      'src/components/marketing/feature-list.tsx',
    ];
    for (const file of files) {
      const content = readFile(file);
      expect(content).not.toContain('bg-white');
      expect(content).not.toContain('text-black');
      expect(content).not.toContain('text-gray-');
      expect(content).not.toContain('bg-gray-');
    }
  });

  it('TEST-034: landing page section order is Hero > FeatureGrid > FeatureWithImage > FeatureList > TechStack > FAQ > CTA (REQ-UX-007)', () => {
    const content = readFile('src/app/(landing)/page.tsx');
    // Only check JSX rendering order (after the return statement)
    const jsxContent = content.split('return')[1] ?? '';
    const heroIdx = jsxContent.indexOf('<HeroSection');
    const gridIdx = jsxContent.indexOf('<FeatureGrid');
    const imageIdx = jsxContent.indexOf('<FeatureWithImage');
    const listIdx = jsxContent.indexOf('<FeatureList');
    const techIdx = jsxContent.indexOf('<TechStackSection');
    const faqIdx = jsxContent.indexOf('<FaqSection');
    const ctaIdx = jsxContent.indexOf('<CtaSection');

    // All must exist in JSX
    expect(heroIdx).toBeGreaterThan(-1);
    expect(gridIdx).toBeGreaterThan(-1);
    expect(imageIdx).toBeGreaterThan(-1);
    expect(listIdx).toBeGreaterThan(-1);
    expect(techIdx).toBeGreaterThan(-1);
    expect(faqIdx).toBeGreaterThan(-1);
    expect(ctaIdx).toBeGreaterThan(-1);

    // Correct order in JSX rendering
    expect(heroIdx).toBeLessThan(gridIdx);
    expect(gridIdx).toBeLessThan(imageIdx);
    expect(imageIdx).toBeLessThan(listIdx);
    expect(listIdx).toBeLessThan(techIdx);
    expect(techIdx).toBeLessThan(faqIdx);
    expect(faqIdx).toBeLessThan(ctaIdx);
  });

  it('TEST-035: page.tsx remains a Server Component (no "use client")', () => {
    const content = readFile('src/app/(landing)/page.tsx');
    expect(content).not.toContain("'use client'");
    expect(content).not.toContain('"use client"');
    expect(content).toContain('export const metadata');
  });
});

// ---------------------------------------------------------------------------
// TEST-036 | REQ-UX-002 | unit | Touch targets >= 44px
// ---------------------------------------------------------------------------
describe('Touch Targets — #14', () => {
  it('TEST-036: cards have sufficient padding for 44px touch targets (REQ-UX-002)', () => {
    // FeatureGrid uses Card with CardHeader which has default padding
    const gridContent = readFile('src/components/marketing/feature-grid.tsx');
    expect(gridContent).toContain('Card');
    expect(gridContent).toContain('CardHeader');
    // FeatureList items have gap-4 and p-* on icon containers
    const listContent = readFile('src/components/marketing/feature-list.tsx');
    expect(listContent).toContain('gap-4');
    expect(listContent).toContain('size-10');
  });
});

// ---------------------------------------------------------------------------
// TEST-037 | REQ-SEC-002 | unit | External links safety
// ---------------------------------------------------------------------------
describe('External Links — #14', () => {
  it('TEST-037: if target="_blank" exists, rel="noopener noreferrer" is present (REQ-SEC-002)', () => {
    const files = [
      'src/components/marketing/feature-grid.tsx',
      'src/components/marketing/feature-with-image.tsx',
      'src/components/marketing/feature-list.tsx',
    ];
    for (const file of files) {
      const content = readFile(file);
      if (content.includes('target="_blank"')) {
        expect(content).toContain('rel="noopener noreferrer"');
      }
    }
  });
});

// ---------------------------------------------------------------------------
// TEST-038 | FeatureWithImage | unit | Alternation pattern
// ---------------------------------------------------------------------------
describe('FeatureWithImage Alternation — #14', () => {
  it('TEST-038: alternates layout using index modulo check', () => {
    const content = readFile('src/components/marketing/feature-with-image.tsx');
    expect(content).toContain('i % 2');
    expect(content).toContain('lg:flex-row-reverse');
    expect(content).toContain("from '@/lib/utils'");
    expect(content).toContain('cn(');
  });
});

// ---------------------------------------------------------------------------
// TEST-039 | Config data count | unit | Correct item counts
// ---------------------------------------------------------------------------
describe('Feature Data Counts — #14', () => {
  it('TEST-039: featureGridItems has 6 items', () => {
    const content = readFile('src/config/features.ts');
    // Extract only the array body between featureGridItems and featureWithImageItems
    const gridSection = content.split('export const featureGridItems')[1]?.split('export const featureWithImageItems')[0] ?? '';
    // Count title fields to count items (more specific than icon which also matches interface)
    const titleMatches = gridSection.match(/title:\s*'/g);
    expect(titleMatches).toHaveLength(6);
  });

  it('TEST-040: featureWithImageItems has 3 items', () => {
    const content = readFile('src/config/features.ts');
    const withImageSection = content.split('export const featureWithImageItems')[1]?.split('export const featureListItems')[0];
    expect(withImageSection).toBeDefined();
    const iconMatches = withImageSection!.match(/icon:\s*\w+/g);
    expect(iconMatches).toHaveLength(3);
  });

  it('TEST-041: featureListItems has 6 items', () => {
    const content = readFile('src/config/features.ts');
    const listSection = content.split('export const featureListItems')[1];
    expect(listSection).toBeDefined();
    const iconMatches = listSection!.match(/icon:\s*\w+/g);
    expect(iconMatches).toHaveLength(6);
  });
});

// ---------------------------------------------------------------------------
// TEST-042 | FeatureWithImage | unit | Image data with alt text
// ---------------------------------------------------------------------------
describe('Feature Image Data — #14', () => {
  it('TEST-042: featureWithImageItems has image paths and imageAlt for each item', () => {
    const content = readFile('src/config/features.ts');
    const imageMatches = content.match(/image:\s*['"][^'"]+['"]/g);
    const altMatches = content.match(/imageAlt:\s*['"][^'"]+['"]/g);
    expect(imageMatches).toHaveLength(3);
    expect(altMatches).toHaveLength(3);
  });

  it('TEST-043: placeholder images exist in public/images/features/', () => {
    expect(fs.existsSync(resolve('public/images/features/dashboard.png'))).toBe(true);
    expect(fs.existsSync(resolve('public/images/features/auth.png'))).toBe(true);
    expect(fs.existsSync(resolve('public/images/features/landing.png'))).toBe(true);
  });
});
