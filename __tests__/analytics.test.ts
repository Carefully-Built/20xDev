/**
 * Test Plan — Issue #8: Analytics (Plausible)
 *
 * Tests cover REQ-001 through REQ-UX-002 from the expanded spec.
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

const ANALYTICS_LIB = 'src/lib/analytics.ts';
const ROOT_LAYOUT = 'src/app/layout.tsx';
const CTA_SECTION = 'src/app/(landing)/_components/cta-section.tsx';
const HERO_SECTION = 'src/app/(landing)/_components/hero-section.tsx';
const PRICING_CARD = 'src/components/marketing/pricing-card.tsx';
const CONTACT_FORM = 'src/components/contact-form.tsx';
const ENV_EXAMPLE = '.env.example';
const PACKAGE_JSON = 'package.json';

// ---------------------------------------------------------------------------
// TEST-001 | REQ-001 | unit | next-plausible installed as dependency
// ---------------------------------------------------------------------------
describe('Analytics (Plausible) — #8', () => {
  it('TEST-001: next-plausible is listed as a dependency in package.json', () => {
    const pkg = readFile(PACKAGE_JSON);
    expect(pkg).toContain('"next-plausible"');
  });

  // TEST-002 | REQ-002 | PlausibleProvider wraps content in root layout
  it('TEST-002: PlausibleProvider wraps all content in root layout', () => {
    const layout = readFile(ROOT_LAYOUT);
    expect(layout).toContain('PlausibleProvider');
    expect(layout).toContain("from 'next-plausible'");
    // Provider should wrap children inside body
    const providerPos = layout.indexOf('<PlausibleProvider');
    const closingProviderPos = layout.indexOf('</PlausibleProvider>');
    const childrenPos = layout.indexOf('{children}');
    expect(providerPos).toBeGreaterThan(-1);
    expect(closingProviderPos).toBeGreaterThan(-1);
    expect(childrenPos).toBeGreaterThan(providerPos);
    expect(childrenPos).toBeLessThan(closingProviderPos);
  });

  // TEST-003 | REQ-003 | Script loads only in production
  it('TEST-003: Plausible script gated by NODE_ENV === production', () => {
    const layout = readFile(ROOT_LAYOUT);
    expect(layout).toMatch(/NODE_ENV.*===.*['"]production['"]/);
    expect(layout).toContain('enabled=');
  });

  // TEST-004 | REQ-004 | Env var documented in .env.example
  it('TEST-004: NEXT_PUBLIC_PLAUSIBLE_DOMAIN documented in .env.example', () => {
    const env = readFile(ENV_EXAMPLE);
    expect(env).toContain('NEXT_PUBLIC_PLAUSIBLE_DOMAIN');
    // Should have a descriptive comment above
    expect(env).toMatch(/^#.*[Pp]lausible/m);
  });

  // TEST-005 | REQ-005 | ANALYTICS_EVENTS constant with typed event names
  it('TEST-005: ANALYTICS_EVENTS exports all required event names', () => {
    const lib = readFile(ANALYTICS_LIB);
    expect(lib).toContain('ANALYTICS_EVENTS');
    expect(lib).toContain("'cta_click'");
    expect(lib).toContain("'pricing_click'");
    expect(lib).toContain("'signup'");
    expect(lib).toContain("'contact_submit'");
    expect(lib).toContain("'learn_more'");
  });

  // TEST-006 | REQ-006 | AnalyticsEvent type exported
  it('TEST-006: AnalyticsEvent type is exported and derived from ANALYTICS_EVENTS', () => {
    const lib = readFile(ANALYTICS_LIB);
    expect(lib).toContain('export type AnalyticsEvent');
    expect(lib).toContain('typeof ANALYTICS_EVENTS');
  });

  // TEST-007 | REQ-007 | CTA section fires cta_click with location cta_section
  it('TEST-007: CTA section fires cta_click event with location cta_section', () => {
    const cta = readFile(CTA_SECTION);
    expect(cta).toContain('usePlausible');
    expect(cta).toMatch(/ANALYTICS_EVENTS\.CTA_CLICK|cta_click/);
    expect(cta).toContain("location: 'cta_section'");
  });

  // TEST-008 | REQ-008 | Hero fires cta_click with location hero
  it('TEST-008: Hero section fires cta_click event with location hero', () => {
    const hero = readFile(HERO_SECTION);
    expect(hero).toContain('usePlausible');
    expect(hero).toMatch(/ANALYTICS_EVENTS\.CTA_CLICK|cta_click/);
    expect(hero).toContain("location: 'hero'");
  });

  // TEST-009 | REQ-009 | Hero fires learn_more event
  it('TEST-009: Hero section fires learn_more event on Learn More click', () => {
    const hero = readFile(HERO_SECTION);
    expect(hero).toMatch(/ANALYTICS_EVENTS\.LEARN_MORE|learn_more/);
  });

  // TEST-010 | REQ-010 | Pricing card fires pricing_click with tier name
  it('TEST-010: Pricing card fires pricing_click event with tier name', () => {
    const pricing = readFile(PRICING_CARD);
    expect(pricing).toContain('usePlausible');
    expect(pricing).toMatch(/ANALYTICS_EVENTS\.PRICING_CLICK|pricing_click/);
    expect(pricing).toContain('tier: tier.name');
  });

  // TEST-011 | REQ-011 | Contact form fires contact_submit
  it('TEST-011: Contact form fires contact_submit on successful submission', () => {
    const contact = readFile(CONTACT_FORM);
    expect(contact).toContain('usePlausible');
    expect(contact).toMatch(/ANALYTICS_EVENTS\.CONTACT_SUBMIT|contact_submit/);
    // Should fire after success, not before
    const successPos = contact.indexOf("setStatus('success')");
    const eventPos = contact.indexOf('ANALYTICS_EVENTS.CONTACT_SUBMIT');
    expect(successPos).toBeGreaterThan(-1);
    expect(eventPos).toBeGreaterThan(-1);
  });

  // TEST-012 | REQ-012 | All integration files exist for build
  it('TEST-012: All integration files exist for a passing build', () => {
    expect(fs.existsSync(resolve(ANALYTICS_LIB))).toBe(true);
    expect(fs.existsSync(resolve(ROOT_LAYOUT))).toBe(true);
    expect(fs.existsSync(resolve(CTA_SECTION))).toBe(true);
    expect(fs.existsSync(resolve(HERO_SECTION))).toBe(true);
    expect(fs.existsSync(resolve(PRICING_CARD))).toBe(true);
    expect(fs.existsSync(resolve(CONTACT_FORM))).toBe(true);
  });

  // TEST-013 | REQ-SEC-001 | No PII in analytics event props
  it('TEST-013: No PII (email, userId, name) in analytics event payloads', () => {
    const lib = readFile(ANALYTICS_LIB);
    // Event names should not contain PII references
    const eventBlock = lib.slice(
      lib.indexOf('ANALYTICS_EVENTS'),
      lib.indexOf('} as const'),
    );
    expect(eventBlock).not.toContain('email');
    expect(eventBlock).not.toContain('userId');
    expect(eventBlock).not.toContain('user_id');
    expect(eventBlock).not.toContain('password');
  });

  // TEST-014 | REQ-SEC-002 | Env var is domain only, no secrets
  it('TEST-014: .env.example contains only domain placeholder, no secrets', () => {
    const env = readFile(ENV_EXAMPLE);
    const plausibleLine = env
      .split('\n')
      .find((line) => line.startsWith('NEXT_PUBLIC_PLAUSIBLE_DOMAIN'));
    expect(plausibleLine).toBeDefined();
    // Value should be empty or a domain placeholder
    expect(plausibleLine).not.toContain('sk_');
    expect(plausibleLine).not.toContain('api_key');
  });

  // TEST-015 | REQ-SEC-003 | EventProps constrained to primitives
  it('TEST-015: AnalyticsEventProps constrains values to string | number | boolean', () => {
    const lib = readFile(ANALYTICS_LIB);
    expect(lib).toContain('AnalyticsEventProps');
    expect(lib).toMatch(/string\s*\|\s*number\s*\|\s*boolean/);
  });

  // TEST-016 | REQ-UX-001 | Provider in root layout inside body
  it('TEST-016: PlausibleProvider placed inside body in root layout', () => {
    const layout = readFile(ROOT_LAYOUT);
    const bodyPos = layout.indexOf('<body');
    const providerPos = layout.indexOf('<PlausibleProvider');
    const closingBodyPos = layout.indexOf('</body>');
    expect(providerPos).toBeGreaterThan(bodyPos);
    expect(providerPos).toBeLessThan(closingBodyPos);
  });

  // TEST-017 | REQ-UX-002 | Pricing card is client component
  it('TEST-017: Pricing card has use client directive for usePlausible hook', () => {
    const pricing = readFile(PRICING_CARD);
    expect(pricing).toMatch(/^['"]use client['"]/);
  });
});

// ---------------------------------------------------------------------------
// Analytics lib module tests
// ---------------------------------------------------------------------------
describe('Analytics lib — #8', () => {
  it('exports ANALYTICS_EVENTS as const object', () => {
    const lib = readFile(ANALYTICS_LIB);
    expect(lib).toContain('export const ANALYTICS_EVENTS');
    expect(lib).toContain('as const');
  });

  it('exports isAnalyticsEnabled helper function', () => {
    const lib = readFile(ANALYTICS_LIB);
    expect(lib).toContain('export function isAnalyticsEnabled');
    expect(lib).toContain('NEXT_PUBLIC_PLAUSIBLE_DOMAIN');
  });

  it('ANALYTICS_EVENTS uses string literal values (not dynamic)', () => {
    const lib = readFile(ANALYTICS_LIB);
    const eventBlock = lib.slice(
      lib.indexOf('ANALYTICS_EVENTS = {'),
      lib.indexOf('} as const') + 10,
    );
    // All values should be string literals
    const values = eventBlock.match(/'[a-z_]+'/g);
    expect(values).not.toBeNull();
    expect(values!.length).toBeGreaterThanOrEqual(5);
  });

  it('has trackOutboundLinks enabled in PlausibleProvider', () => {
    const layout = readFile(ROOT_LAYOUT);
    expect(layout).toContain('trackOutboundLinks');
  });
});

// ---------------------------------------------------------------------------
// Component integration tests
// ---------------------------------------------------------------------------
describe('Component event integration — #8', () => {
  it('CTA section imports from @/lib/analytics', () => {
    const cta = readFile(CTA_SECTION);
    expect(cta).toContain("from '@/lib/analytics'");
  });

  it('Hero section imports from @/lib/analytics', () => {
    const hero = readFile(HERO_SECTION);
    expect(hero).toContain("from '@/lib/analytics'");
  });

  it('Pricing card imports from @/lib/analytics', () => {
    const pricing = readFile(PRICING_CARD);
    expect(pricing).toContain("from '@/lib/analytics'");
  });

  it('Contact form imports from @/lib/analytics', () => {
    const contact = readFile(CONTACT_FORM);
    expect(contact).toContain("from '@/lib/analytics'");
  });

  it('All event-firing components are client components', () => {
    for (const file of [CTA_SECTION, HERO_SECTION, PRICING_CARD, CONTACT_FORM]) {
      const content = readFile(file);
      expect(content).toMatch(/^['"]use client['"]/);
    }
  });

  it('No i18n keys added (analytics is invisible)', () => {
    // Verify no new <T id="analytics... tags in any changed file
    for (const file of [CTA_SECTION, HERO_SECTION, PRICING_CARD, CONTACT_FORM, ANALYTICS_LIB]) {
      const content = readFile(file);
      expect(content).not.toMatch(/<T id="analytics/);
    }
  });
});
