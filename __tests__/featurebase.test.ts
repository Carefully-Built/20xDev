/**
 * Test Plan — Issue #11: Featurebase Integration
 *
 * Tests cover REQ-001 through REQ-UX-003 from the expanded spec.
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

const WIDGET_FILE = 'src/components/featurebase/featurebase-widget.tsx';
const LIB_FILE = 'src/lib/featurebase.ts';
const SIDEBAR_FILE = 'src/app/dashboard/_components/app-sidebar.tsx';
const SHELL_FILE = 'src/app/dashboard/_components/dashboard-shell.tsx';
const ENV_EXAMPLE = '.env.example';

// ---------------------------------------------------------------------------
// TEST-001 | REQ-001 | unit | SDK loads lazily via next/script lazyOnload
// ---------------------------------------------------------------------------
describe('Featurebase — #11', () => {
  it('TEST-001: SDK loads lazily via next/script strategy lazyOnload', () => {
    const content = readFile(WIDGET_FILE);
    expect(content).toContain('lazyOnload');
    expect(content).toContain("from \"next/script\"");
  });

  // TEST-002 | REQ-002 | Widget uses org ID from env var
  it('TEST-002: Widget uses org ID from NEXT_PUBLIC_FEATUREBASE_ORG env var', () => {
    const widget = readFile(WIDGET_FILE);
    expect(widget).toContain('FEATUREBASE_ORG');

    const lib = readFile(LIB_FILE);
    expect(lib).toContain('process.env.NEXT_PUBLIC_FEATUREBASE_ORG');
  });

  // TEST-003 | REQ-003 | Sidebar has data-featurebase-feedback attribute
  it('TEST-003: Widget opens via sidebar data-featurebase-feedback attribute', () => {
    const sidebar = readFile(SIDEBAR_FILE);
    expect(sidebar).toContain('data-featurebase-feedback');
  });

  // TEST-004 | REQ-004 | User identification with email/name/userId
  it('TEST-004: Authenticated users are auto-identified (email, name, userId)', () => {
    const widget = readFile(WIDGET_FILE);
    expect(widget).toContain('identify');
    expect(widget).toContain('email');
    expect(widget).toContain('name');
    expect(widget).toContain('userId');
  });

  // TEST-005 | REQ-005 | Widget returns null if env var missing
  it('TEST-005: Widget returns null if FEATUREBASE_ORG is missing', () => {
    const widget = readFile(WIDGET_FILE);
    expect(widget).toContain('if (!FEATUREBASE_ORG)');
    expect(widget).toContain('return null');
  });

  // TEST-006 | REQ-006 | Widget respects theme via useTheme
  it('TEST-006: Widget respects app theme via useTheme hook', () => {
    const widget = readFile(WIDGET_FILE);
    expect(widget).toContain('useTheme');
    expect(widget).toContain('resolvedTheme');
    expect(widget).toMatch(/resolvedTheme\s*===\s*["']dark["']/);
  });

  // TEST-007 | REQ-007 | No floating button placement
  it('TEST-007: No floating button — no placement config in widget init', () => {
    const widget = readFile(WIDGET_FILE);
    // The initialize_feedback_widget call should NOT have a placement property
    const initBlock = widget.slice(
      widget.indexOf('initialize_feedback_widget'),
      widget.indexOf('initialize_feedback_widget') + 300,
    );
    expect(initBlock).not.toContain('placement');
  });

  // TEST-008 | REQ-008 | Build passes (verified externally, assert files exist)
  it('TEST-008: All integration files exist for a passing build', () => {
    expect(fs.existsSync(resolve(WIDGET_FILE))).toBe(true);
    expect(fs.existsSync(resolve(LIB_FILE))).toBe(true);
    expect(fs.existsSync(resolve(SIDEBAR_FILE))).toBe(true);
    expect(fs.existsSync(resolve(SHELL_FILE))).toBe(true);
  });

  // TEST-009 | REQ-009 | Integration files exist in src
  it('TEST-009: Featurebase integration files exist in src/', () => {
    expect(fs.existsSync(resolve(WIDGET_FILE))).toBe(true);
    expect(fs.existsSync(resolve(LIB_FILE))).toBe(true);
  });

  // TEST-010 | REQ-010 | Feedback nav before Settings in sidebar bottom
  it('TEST-010: Feedback nav item appears before Settings in bottom nav', () => {
    const sidebar = readFile(SIDEBAR_FILE);
    const feedbackPos = sidebar.indexOf('data-featurebase-feedback');
    const bottomNavPos = sidebar.indexOf('bottomNavItems.map');
    expect(feedbackPos).toBeGreaterThan(-1);
    expect(bottomNavPos).toBeGreaterThan(-1);
    expect(feedbackPos).toBeLessThan(bottomNavPos);
  });

  // TEST-011 | REQ-SEC-001 | No PII leakage
  it('TEST-011: No PII leaked beyond what Featurebase needs', () => {
    const widget = readFile(WIDGET_FILE);
    expect(widget).not.toContain('accessToken');
    expect(widget).not.toContain('refreshToken');
    expect(widget).not.toContain('password');
  });

  // TEST-012 | REQ-SEC-002 | Widget only in dashboard
  it('TEST-012: Widget rendered only in dashboard, not landing pages', () => {
    const shell = readFile(SHELL_FILE);
    expect(shell).toContain('FeaturebaseWidget');

    // Verify widget is NOT referenced in landing layouts
    const landingLayoutPath = resolve('src/app/(landing)/layout.tsx');
    if (fs.existsSync(landingLayoutPath)) {
      const landingLayout = readFile('src/app/(landing)/layout.tsx');
      expect(landingLayout).not.toContain('FeaturebaseWidget');
    }

    const rootLayoutPath = resolve('src/app/layout.tsx');
    if (fs.existsSync(rootLayoutPath)) {
      const rootLayout = readFile('src/app/layout.tsx');
      expect(rootLayout).not.toContain('FeaturebaseWidget');
    }
  });

  // TEST-013 | REQ-SEC-003 | Org ID from env var, not hardcoded
  it('TEST-013: Org ID read from env var, not hardcoded', () => {
    const lib = readFile(LIB_FILE);
    expect(lib).toContain('process.env.NEXT_PUBLIC_FEATUREBASE_ORG');

    // Ensure no hardcoded org strings (no literal org name in widget)
    const widget = readFile(WIDGET_FILE);
    expect(widget).not.toMatch(/organization:\s*["'][a-z]/);
  });

  // TEST-014 | REQ-I18N-001 | Locale set to en
  it('TEST-014: Widget locale set to "en"', () => {
    const widget = readFile(WIDGET_FILE);
    expect(widget).toMatch(/locale:\s*["']en["']/);
  });

  // TEST-015 | REQ-A11Y-001 | Feedback nav item has accessible label/tooltip
  it('TEST-015: Feedback nav item has accessible label and tooltip', () => {
    const sidebar = readFile(SIDEBAR_FILE);
    // Collapsed state should have tooltip
    expect(sidebar).toContain('TooltipContent');
    expect(sidebar).toContain('Feedback');
    // Expanded state should show label text
    expect(sidebar).toMatch(/<span>Feedback<\/span>/);
  });

  // TEST-016 | REQ-A11Y-002 | Touch target meets 44px
  it('TEST-016: Feedback button uses consistent nav padding for touch targets', () => {
    const sidebar = readFile(SIDEBAR_FILE);
    // Same py-1.5 px-2.5 pattern as other nav items
    expect(sidebar).toContain('py-1.5');
    expect(sidebar).toContain('px-2.5');
  });

  // TEST-017 | REQ-UX-001 | Feedback in bottom nav before Settings
  it('TEST-017: Feedback placed in bottom section before Settings', () => {
    // Settings is defined in bottomNavItems array which is rendered AFTER
    // the inline Feedback button in the bottom nav section.
    const sidebar = readFile(SIDEBAR_FILE);
    expect(sidebar).toMatch(/bottomNavItems.*Settings/s);
    // Verify Feedback button comes before bottomNavItems.map in the JSX
    const feedbackPos = sidebar.indexOf('data-featurebase-feedback');
    const bottomNavMapPos = sidebar.indexOf('bottomNavItems.map');
    expect(feedbackPos).toBeGreaterThan(-1);
    expect(bottomNavMapPos).toBeGreaterThan(-1);
    expect(feedbackPos).toBeLessThan(bottomNavMapPos);
  });

  // TEST-018 | REQ-UX-002 | Uses MessageSquarePlus icon
  it('TEST-018: Uses MessageSquarePlus icon from lucide-react', () => {
    const sidebar = readFile(SIDEBAR_FILE);
    expect(sidebar).toContain('MessageSquarePlus');
    expect(sidebar).toContain('lucide-react');
  });

  // TEST-019 | REQ-UX-003 | .env.example documents env var
  it('TEST-019: .env.example documents NEXT_PUBLIC_FEATUREBASE_ORG', () => {
    const envExample = readFile(ENV_EXAMPLE);
    expect(envExample).toContain('NEXT_PUBLIC_FEATUREBASE_ORG');
    // Should have a descriptive comment
    expect(envExample).toMatch(/^#.*[Ff]eaturebase/m);
  });
});

// ---------------------------------------------------------------------------
// Featurebase lib module tests
// ---------------------------------------------------------------------------
describe('Featurebase lib — #11', () => {
  it('exports FEATUREBASE_ORG constant', () => {
    const lib = readFile(LIB_FILE);
    expect(lib).toContain('export const FEATUREBASE_ORG');
  });

  it('exports ensureFeaturebase function', () => {
    const lib = readFile(LIB_FILE);
    expect(lib).toContain('export function ensureFeaturebase');
  });

  it('declares global Window.Featurebase type', () => {
    const lib = readFile(LIB_FILE);
    expect(lib).toContain('interface Window');
    expect(lib).toContain('Featurebase');
  });

  it('ensureFeaturebase guards against SSR (typeof window)', () => {
    const lib = readFile(LIB_FILE);
    expect(lib).toContain("typeof window");
  });

  it('has typed FeaturebaseWidgetConfig interface', () => {
    const lib = readFile(LIB_FILE);
    expect(lib).toContain('FeaturebaseWidgetConfig');
    expect(lib).toContain('organization: string');
    expect(lib).toContain('theme:');
  });

  it('has typed FeaturebaseIdentifyConfig interface', () => {
    const lib = readFile(LIB_FILE);
    expect(lib).toContain('FeaturebaseIdentifyConfig');
    expect(lib).toContain('email: string');
    expect(lib).toContain('name: string');
  });
});

// ---------------------------------------------------------------------------
// Widget component structure tests
// ---------------------------------------------------------------------------
describe('FeaturebaseWidget component — #11', () => {
  it('is a client component', () => {
    const widget = readFile(WIDGET_FILE);
    expect(widget).toMatch(/^["']use client["']/);
  });

  it('has typed props interface with readonly fields', () => {
    const widget = readFile(WIDGET_FILE);
    expect(widget).toContain('readonly email?: string');
    expect(widget).toContain('readonly name?: string');
    expect(widget).toContain('readonly userId?: string');
    expect(widget).toContain('readonly profilePicture?: string');
  });

  it('uses useCallback for initWidget to prevent unnecessary re-renders', () => {
    const widget = readFile(WIDGET_FILE);
    expect(widget).toContain('useCallback');
    expect(widget).toContain('initWidget');
  });

  it('handles script onLoad callback', () => {
    const widget = readFile(WIDGET_FILE);
    expect(widget).toContain('onLoad={initWidget}');
  });

  it('calls ensureFeaturebase before widget initialization', () => {
    const widget = readFile(WIDGET_FILE);
    const ensurePos = widget.indexOf('ensureFeaturebase()');
    const initPos = widget.indexOf('initialize_feedback_widget');
    expect(ensurePos).toBeGreaterThan(-1);
    expect(initPos).toBeGreaterThan(-1);
    expect(ensurePos).toBeLessThan(initPos);
  });

  it('logs identification errors to console', () => {
    const widget = readFile(WIDGET_FILE);
    expect(widget).toContain('console.error');
    expect(widget).toContain('Featurebase identification failed');
  });

  it('defaults theme to light when resolvedTheme is not dark', () => {
    const widget = readFile(WIDGET_FILE);
    // Pattern: resolvedTheme === "dark" ? "dark" : "light"
    expect(widget).toMatch(/resolvedTheme\s*===\s*["']dark["']\s*\?\s*["']dark["']\s*:\s*["']light["']/);
  });
});

// ---------------------------------------------------------------------------
// Dashboard shell integration tests
// ---------------------------------------------------------------------------
describe('DashboardShell integration — #11', () => {
  it('imports FeaturebaseWidget', () => {
    const shell = readFile(SHELL_FILE);
    expect(shell).toContain("from '@/components/featurebase/featurebase-widget'");
  });

  it('passes user data props to FeaturebaseWidget', () => {
    const shell = readFile(SHELL_FILE);
    expect(shell).toContain('email={userData.email}');
    expect(shell).toContain('name={userData.name}');
    expect(shell).toContain('userId={userData.id}');
    expect(shell).toContain('profilePicture={userData.imageUrl}');
  });

  it('renders FeaturebaseWidget inside SidebarProvider', () => {
    const shell = readFile(SHELL_FILE);
    const sidebarProviderPos = shell.indexOf('SidebarProvider');
    const widgetPos = shell.indexOf('FeaturebaseWidget');
    const closingSidebarPos = shell.indexOf('</SidebarProvider>');
    expect(widgetPos).toBeGreaterThan(sidebarProviderPos);
    expect(widgetPos).toBeLessThan(closingSidebarPos);
  });
});

// ---------------------------------------------------------------------------
// Sidebar Feedback button tests
// ---------------------------------------------------------------------------
describe('Sidebar Feedback button — #11', () => {
  it('renders as <button> element (not Link)', () => {
    const sidebar = readFile(SIDEBAR_FILE);
    // Feedback items use <button type="button"> not <Link>
    const feedbackSection = sidebar.slice(
      sidebar.indexOf('Feedback button'),
      sidebar.indexOf('bottomNavItems.map'),
    );
    expect(feedbackSection).toContain('<button');
    expect(feedbackSection).toContain('type="button"');
  });

  it('has full width styling', () => {
    const sidebar = readFile(SIDEBAR_FILE);
    const feedbackSection = sidebar.slice(
      sidebar.indexOf('Feedback button'),
      sidebar.indexOf('bottomNavItems.map'),
    );
    expect(feedbackSection).toContain('w-full');
  });

  it('handles collapsed state with tooltip', () => {
    const sidebar = readFile(SIDEBAR_FILE);
    const feedbackSection = sidebar.slice(
      sidebar.indexOf('Feedback button'),
      sidebar.indexOf('bottomNavItems.map'),
    );
    expect(feedbackSection).toContain('isCollapsed');
    expect(feedbackSection).toContain('Tooltip');
    expect(feedbackSection).toContain('TooltipContent');
  });

  it('shows text label in expanded state', () => {
    const sidebar = readFile(SIDEBAR_FILE);
    const feedbackSection = sidebar.slice(
      sidebar.indexOf('Feedback button'),
      sidebar.indexOf('bottomNavItems.map'),
    );
    expect(feedbackSection).toContain('<span>Feedback</span>');
  });
});
