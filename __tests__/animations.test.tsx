/**
 * Test Plan — Issue #7: Animations (Animate UI)
 *
 * Tests cover REQ-001 through REQ-UX-005 from the expanded spec.
 * Focus on structural/integration verification since animations
 * are presentational and require browser for visual confirmation.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// TEST-001 | REQ-007 | unit | Fade primitive exists
// ---------------------------------------------------------------------------
describe('Animation Primitives — #7', () => {
  it('TEST-001: Fade primitive file exists (REQ-007)', () => {
    const fadePath = path.resolve(
      __dirname,
      '../src/components/animate-ui/fade.tsx',
    );
    expect(fs.existsSync(fadePath)).toBe(true);
  });

  // TEST-002 | REQ-008 | unit | Slide primitive exists
  it('TEST-002: Slide primitive file exists (REQ-008)', () => {
    const slidePath = path.resolve(
      __dirname,
      '../src/components/animate-ui/slide.tsx',
    );
    expect(fs.existsSync(slidePath)).toBe(true);
  });

  // TEST-003 | REQ-009 | unit | Animate UI registry configured
  it('TEST-003: Animate UI registry in components.json (REQ-009)', () => {
    const componentsJson = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, '../components.json'),
        'utf-8',
      ),
    );
    expect(componentsJson.registries).toBeDefined();
    expect(componentsJson.registries['animate-ui']).toBeDefined();
    expect(componentsJson.registries['animate-ui'].url).toBe(
      'https://animate-ui.com/r',
    );
  });

  // TEST-004 | REQ-010 | unit | motion package in dependencies
  it('TEST-004: motion package in dependencies (REQ-010)', () => {
    const packageJson = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, '../package.json'),
        'utf-8',
      ),
    );
    expect(packageJson.dependencies.motion).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// TEST-005 | REQ-012 | unit | Animate UI usage in components
// ---------------------------------------------------------------------------
describe('Animate UI Integration — #7', () => {
  it('TEST-005: Animate UI imported in landing components (REQ-012)', () => {
    const landingDir = path.resolve(
      __dirname,
      '../src/app/(landing)/_components',
    );
    const files = fs.readdirSync(landingDir);
    const filesWithAnimateUi = files.filter((f) => {
      const content = fs.readFileSync(path.join(landingDir, f), 'utf-8');
      return content.includes('animate-ui');
    });
    expect(filesWithAnimateUi.length).toBeGreaterThanOrEqual(4);
  });

  // TEST-006 | REQ-013 | unit | At least 3 scroll-triggered sections
  it('TEST-006: At least 3 sections with inView scroll trigger (REQ-013)', () => {
    const landingDir = path.resolve(
      __dirname,
      '../src/app/(landing)/_components',
    );
    const files = fs.readdirSync(landingDir);
    const filesWithInView = files.filter((f) => {
      const content = fs.readFileSync(path.join(landingDir, f), 'utf-8');
      return content.includes('inView') && content.includes('inViewOnce');
    });
    expect(filesWithInView.length).toBeGreaterThanOrEqual(3);
  });

  // TEST-007 | REQ-006 | unit | All scroll animations fire once
  it('TEST-007: All scroll animations use inViewOnce=true (REQ-006)', () => {
    const componentsWithInView = [
      'features-section.tsx',
      'tech-stack-section.tsx',
      'faq-section.tsx',
      'cta-section.tsx',
    ];
    const landingDir = path.resolve(
      __dirname,
      '../src/app/(landing)/_components',
    );
    for (const file of componentsWithInView) {
      const content = fs.readFileSync(
        path.join(landingDir, file),
        'utf-8',
      );
      if (content.includes('inView')) {
        expect(content).toContain('inViewOnce');
      }
    }
  });
});

// ---------------------------------------------------------------------------
// TEST-008 | REQ-016 | unit | page.tsx retains metadata export
// ---------------------------------------------------------------------------
describe('Server Component Preservation — #7', () => {
  it('TEST-008: page.tsx retains metadata export (REQ-016)', () => {
    const pageContent = fs.readFileSync(
      path.resolve(__dirname, '../src/app/(landing)/page.tsx'),
      'utf-8',
    );
    expect(pageContent).toContain('export const metadata');
    // Server Component: must NOT have 'use client' directive
    expect(pageContent).not.toContain("'use client'");
    expect(pageContent).not.toContain('"use client"');
  });

  it('TEST-009: page.tsx imports client components (not animation primitives directly)', () => {
    const pageContent = fs.readFileSync(
      path.resolve(__dirname, '../src/app/(landing)/page.tsx'),
      'utf-8',
    );
    // page.tsx should import from _components, not from animate-ui directly
    expect(pageContent).not.toContain('animate-ui');
    expect(pageContent).toContain('HeroSection');
    expect(pageContent).toContain('CtaSection');
  });
});

// ---------------------------------------------------------------------------
// TEST-010 | REQ-A11Y-001 | unit | MotionConfig reducedMotion
// ---------------------------------------------------------------------------
describe('Accessibility — #7', () => {
  it('TEST-010: MotionConfig wraps landing layout with reducedMotion="user" (REQ-A11Y-001)', () => {
    const layoutClient = fs.readFileSync(
      path.resolve(
        __dirname,
        '../src/app/(landing)/_components/landing-layout-client.tsx',
      ),
      'utf-8',
    );
    expect(layoutClient).toContain('MotionConfig');
    expect(layoutClient).toContain('reducedMotion="user"');
  });

  it('TEST-011: Layout uses LandingLayoutClient wrapper (REQ-A11Y-001)', () => {
    const layout = fs.readFileSync(
      path.resolve(__dirname, '../src/app/(landing)/layout.tsx'),
      'utf-8',
    );
    expect(layout).toContain('LandingLayoutClient');
  });

  // TEST-012 | REQ-A11Y-003 | unit | No aria-hidden on animation wrappers
  it('TEST-012: No aria-hidden on animation wrappers (REQ-A11Y-003)', () => {
    const animationFiles = [
      'hero-section.tsx',
      'features-section.tsx',
      'tech-stack-section.tsx',
      'faq-section.tsx',
      'cta-section.tsx',
    ];
    const landingDir = path.resolve(
      __dirname,
      '../src/app/(landing)/_components',
    );
    for (const file of animationFiles) {
      const content = fs.readFileSync(
        path.join(landingDir, file),
        'utf-8',
      );
      // These files should not have aria-hidden on Fade/Slide wrappers
      expect(content).not.toContain('aria-hidden');
    }
  });
});

// ---------------------------------------------------------------------------
// TEST-013 | REQ-UX-001 | unit | Hero animates on mount, not scroll
// ---------------------------------------------------------------------------
describe('UX Behavior — #7', () => {
  it('TEST-013: Hero uses Fade/Slide without inView (mount trigger) (REQ-UX-001)', () => {
    const hero = fs.readFileSync(
      path.resolve(
        __dirname,
        '../src/app/(landing)/_components/hero-section.tsx',
      ),
      'utf-8',
    );
    expect(hero).toContain('Fade');
    expect(hero).toContain('Slide');
    // Hero should NOT use inView — it triggers on mount
    // Check that there's no `inView` prop on the Fade/Slide usage
    const fadeUsage = hero.match(/<Fade[^>]*>/);
    expect(fadeUsage).toBeTruthy();
    expect(fadeUsage![0]).not.toContain('inView');
  });

  // TEST-014 | REQ-UX-002 | unit | inViewMargin for early trigger
  it('TEST-014: Scroll sections use inViewMargin for early trigger (REQ-UX-002)', () => {
    const scrollFiles = [
      'features-section.tsx',
      'tech-stack-section.tsx',
      'faq-section.tsx',
      'cta-section.tsx',
    ];
    const landingDir = path.resolve(
      __dirname,
      '../src/app/(landing)/_components',
    );
    let filesWithMargin = 0;
    for (const file of scrollFiles) {
      const content = fs.readFileSync(
        path.join(landingDir, file),
        'utf-8',
      );
      if (content.includes('inViewMargin')) {
        filesWithMargin++;
      }
    }
    expect(filesWithMargin).toBeGreaterThanOrEqual(3);
  });

  // TEST-015 | REQ-UX-003 | unit | Feature card stagger delay
  it('TEST-015: Feature cards have stagger delay 100-200ms (REQ-UX-003)', () => {
    const features = fs.readFileSync(
      path.resolve(
        __dirname,
        '../src/app/(landing)/_components/features-section.tsx',
      ),
      'utf-8',
    );
    // Look for delay pattern like delay={i * 150}
    const delayMatch = features.match(/delay=\{i\s*\*\s*(\d+)\}/);
    expect(delayMatch).toBeTruthy();
    const delayMs = parseInt(delayMatch![1]!, 10);
    expect(delayMs).toBeGreaterThanOrEqual(100);
    expect(delayMs).toBeLessThanOrEqual(200);
  });

  // TEST-016 | REQ-014 | unit | No duration exceeds 500ms
  it('TEST-016: No animation duration exceeds 500ms (REQ-014)', () => {
    const files = [
      '../src/components/animate-ui/fade.tsx',
      '../src/components/animate-ui/slide.tsx',
    ];
    for (const file of files) {
      const content = fs.readFileSync(
        path.resolve(__dirname, file),
        'utf-8',
      );
      // Check for explicit duration values
      const durationMatches = content.matchAll(/duration:\s*([\d.]+)/g);
      for (const match of durationMatches) {
        const val = parseFloat(match[1]!);
        // Motion uses seconds, so 0.5s = 500ms
        expect(val).toBeLessThanOrEqual(0.5);
      }
    }
  });

  // TEST-017 | REQ-015/REQ-UX-005 | unit | GPU-accelerated only
  it('TEST-017: Fade uses opacity only, Slide uses transform only (REQ-015, REQ-UX-005)', () => {
    const fade = fs.readFileSync(
      path.resolve(__dirname, '../src/components/animate-ui/fade.tsx'),
      'utf-8',
    );
    const slide = fs.readFileSync(
      path.resolve(__dirname, '../src/components/animate-ui/slide.tsx'),
      'utf-8',
    );
    // Fade variants should only animate opacity
    expect(fade).toContain('opacity: initialOpacity');
    expect(fade).toContain('opacity');
    // Fade should NOT animate layout properties
    expect(fade).not.toMatch(/variants:\s*\{[^}]*width/);
    expect(fade).not.toMatch(/variants:\s*\{[^}]*height/);
    expect(fade).not.toMatch(/variants:\s*\{[^}]*margin/);

    // Slide uses x/y (translateX/translateY via motion)
    expect(slide).toContain("'y' : 'x'");
    // Slide should NOT animate layout properties
    expect(slide).not.toMatch(/variants:\s*\{[^}]*width/);
    expect(slide).not.toMatch(/variants:\s*\{[^}]*height/);
  });
});

// ---------------------------------------------------------------------------
// TEST-018 | REQ-SEC-001 | unit | No new API routes from animations
// ---------------------------------------------------------------------------
describe('Security — #7', () => {
  it('TEST-018: Animation components contain no data fetching or API calls (REQ-SEC-001)', () => {
    const animFiles = [
      '../src/components/animate-ui/fade.tsx',
      '../src/components/animate-ui/slide.tsx',
      '../src/components/animate-ui/hooks/use-is-in-view.tsx',
      '../src/components/animate-ui/primitives/slot.tsx',
      '../src/app/(landing)/_components/hero-section.tsx',
      '../src/app/(landing)/_components/cta-section.tsx',
    ];
    for (const file of animFiles) {
      const content = fs.readFileSync(
        path.resolve(__dirname, file),
        'utf-8',
      );
      expect(content).not.toContain('fetch(');
      expect(content).not.toContain('axios');
      expect(content).not.toMatch(/useQuery|useMutation/);
    }
  });
});

// ---------------------------------------------------------------------------
// TEST-019 | REQ-001 | unit | Hero section renders with animation wrappers
// ---------------------------------------------------------------------------
describe('Component Rendering — #7', () => {
  it('TEST-019: HeroSection is a client component with Fade+Slide (REQ-001)', () => {
    const hero = fs.readFileSync(
      path.resolve(
        __dirname,
        '../src/app/(landing)/_components/hero-section.tsx',
      ),
      'utf-8',
    );
    expect(hero).toContain("'use client'");
    expect(hero).toContain('<Fade>');
    expect(hero).toContain('<Slide');
    expect(hero).toContain('direction="up"');
  });

  // TEST-020 | REQ-002 | unit | Features section has staggered animation
  it('TEST-020: FeaturesSection uses staggered Slide per card (REQ-002)', () => {
    const features = fs.readFileSync(
      path.resolve(
        __dirname,
        '../src/app/(landing)/_components/features-section.tsx',
      ),
      'utf-8',
    );
    expect(features).toContain("'use client'");
    expect(features).toContain('<Slide');
    expect(features).toContain('inView');
    expect(features).toContain('inViewOnce');
  });

  // TEST-021 | REQ-003 | unit | Tech Stack section slides up
  it('TEST-021: TechStackSection uses Slide direction="up" per category (REQ-003)', () => {
    const techStack = fs.readFileSync(
      path.resolve(
        __dirname,
        '../src/app/(landing)/_components/tech-stack-section.tsx',
      ),
      'utf-8',
    );
    expect(techStack).toContain("'use client'");
    expect(techStack).toContain('<Slide');
    expect(techStack).toContain('direction="up"');
    expect(techStack).toContain('inView');
  });

  // TEST-022 | REQ-004 | unit | FAQ section fades in
  it('TEST-022: FaqSection uses Fade with inView (REQ-004)', () => {
    const faq = fs.readFileSync(
      path.resolve(
        __dirname,
        '../src/app/(landing)/_components/faq-section.tsx',
      ),
      'utf-8',
    );
    expect(faq).toContain("'use client'");
    expect(faq).toContain('<Fade');
    expect(faq).toContain('inView');
    expect(faq).toContain('inViewOnce');
  });

  // TEST-023 | REQ-005 | unit | CTA section animates on scroll
  it('TEST-023: CtaSection uses Fade+Slide with inView (REQ-005)', () => {
    const cta = fs.readFileSync(
      path.resolve(
        __dirname,
        '../src/app/(landing)/_components/cta-section.tsx',
      ),
      'utf-8',
    );
    expect(cta).toContain("'use client'");
    expect(cta).toContain('<Fade');
    expect(cta).toContain('<Slide');
    expect(cta).toContain('inView');
    expect(cta).toContain('inViewOnce');
  });
});

// ---------------------------------------------------------------------------
// TEST-024 | REQ-UX-004 | unit | Spring transition defaults
// ---------------------------------------------------------------------------
describe('Animation Defaults — #7', () => {
  it('TEST-024: Spring transition defaults are within 150-300ms range (REQ-UX-004)', () => {
    // Spring with stiffness=200, damping=20 settles in ~250ms
    // Verify the defaults are set correctly
    const fade = fs.readFileSync(
      path.resolve(__dirname, '../src/components/animate-ui/fade.tsx'),
      'utf-8',
    );
    const slide = fs.readFileSync(
      path.resolve(__dirname, '../src/components/animate-ui/slide.tsx'),
      'utf-8',
    );

    for (const content of [fade, slide]) {
      expect(content).toContain("type: 'spring'");
      expect(content).toContain('stiffness: 200');
      expect(content).toContain('damping: 20');
    }
  });

  // TEST-025 | REQ-007/008 | unit | Fade and Slide export correctly
  it('TEST-025: Fade exports Fade and Fades, Slide exports Slide and Slides', () => {
    const fade = fs.readFileSync(
      path.resolve(__dirname, '../src/components/animate-ui/fade.tsx'),
      'utf-8',
    );
    const slide = fs.readFileSync(
      path.resolve(__dirname, '../src/components/animate-ui/slide.tsx'),
      'utf-8',
    );

    expect(fade).toContain('export { Fade, Fades');
    expect(slide).toContain('Slide,');
    expect(slide).toContain('Slides,');
  });
});
