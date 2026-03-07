/**
 * Test Plan — Issue #13: Contact Form (Web3Forms)
 *
 * Tests cover REQ-001 through REQ-UX-008 from the expanded spec.
 * Focus on structural verification, security, i18n, a11y, and UX compliance.
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
// TEST-001 | REQ-001 | unit | Contact page route exists
// ---------------------------------------------------------------------------
describe('Contact Route — #13', () => {
  it('TEST-001: contact page exists at src/app/(landing)/contact/page.tsx (REQ-001)', () => {
    expect(fs.existsSync(resolve('src/app/(landing)/contact/page.tsx'))).toBe(
      true,
    );
  });

  it('TEST-002: contact form component exists (REQ-001)', () => {
    expect(fs.existsSync(resolve('src/components/contact-form.tsx'))).toBe(
      true,
    );
  });

  it('TEST-003: web3forms helper exists (REQ-005)', () => {
    expect(fs.existsSync(resolve('src/lib/web3forms.ts'))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// TEST-004–006 | REQ-013 | unit | Server Component + Metadata
// ---------------------------------------------------------------------------
describe('SEO Metadata — #13', () => {
  it('TEST-004: contact page is a Server Component — no "use client" (REQ-013)', () => {
    const content = readFile('src/app/(landing)/contact/page.tsx');
    expect(content).not.toContain("'use client'");
    expect(content).not.toContain('"use client"');
  });

  it('TEST-005: contact page exports metadata with title (REQ-013)', () => {
    const content = readFile('src/app/(landing)/contact/page.tsx');
    expect(content).toContain('export const metadata');
    expect(content).toMatch(/title:\s*['"].*Contact.*['"]/);
  });

  it('TEST-006: metadata includes a description (REQ-013)', () => {
    const content = readFile('src/app/(landing)/contact/page.tsx');
    expect(content).toContain('description');
    expect(content).toMatch(/description:\s*['"\n]/);
  });
});

// ---------------------------------------------------------------------------
// TEST-007–010 | REQ-001, REQ-002 | unit | Form fields present
// ---------------------------------------------------------------------------
describe('Form Fields — #13', () => {
  const getContent = () => readFile('src/components/contact-form.tsx');

  it('TEST-007: form has name field with data-testid (REQ-001)', () => {
    const content = getContent();
    expect(content).toContain('data-testid="contact-name"');
    expect(content).toContain("register('name')");
  });

  it('TEST-008: form has email field with type="email" (REQ-001, REQ-003)', () => {
    const content = getContent();
    expect(content).toContain('data-testid="contact-email"');
    expect(content).toContain('type="email"');
    expect(content).toContain("register('email')");
  });

  it('TEST-009: form has subject field (REQ-001)', () => {
    const content = getContent();
    expect(content).toContain('data-testid="contact-subject"');
    expect(content).toContain("register('subject')");
  });

  it('TEST-010: form has message textarea (REQ-001)', () => {
    const content = getContent();
    expect(content).toContain('data-testid="contact-message"');
    expect(content).toContain("register('message')");
    expect(content).toContain('<Textarea');
  });

  it('TEST-011: form has submit button (REQ-001)', () => {
    const content = getContent();
    expect(content).toContain('data-testid="contact-submit"');
    expect(content).toContain('type="submit"');
  });
});

// ---------------------------------------------------------------------------
// TEST-012–015 | REQ-002, REQ-003, REQ-004 | unit | Zod validation
// ---------------------------------------------------------------------------
describe('Form Validation — #13', () => {
  const getContent = () => readFile('src/components/contact-form.tsx');

  it('TEST-012: name field is required via zod (REQ-002)', () => {
    const content = getContent();
    expect(content).toMatch(/name:\s*z\.string\(\)\.min\(1/);
  });

  it('TEST-013: email validates format via zod (REQ-003)', () => {
    const content = getContent();
    expect(content).toContain('.email(');
    expect(content).toContain('Please enter a valid email');
  });

  it('TEST-014: subject field is required via zod (REQ-002)', () => {
    const content = getContent();
    expect(content).toMatch(/subject:\s*z\.string\(\)\.min\(1/);
  });

  it('TEST-015: message enforces minimum 10 characters (REQ-004)', () => {
    const content = getContent();
    expect(content).toContain('.min(10,');
    expect(content).toContain('at least 10 characters');
  });

  it('TEST-016: form uses zodResolver with onBlur mode (REQ-002)', () => {
    const content = getContent();
    expect(content).toContain('zodResolver(');
    expect(content).toContain("mode: 'onBlur'");
  });
});

// ---------------------------------------------------------------------------
// TEST-017–018 | REQ-005 | unit | Web3Forms API integration
// ---------------------------------------------------------------------------
describe('Web3Forms API — #13', () => {
  it('TEST-017: submits to web3forms endpoint (REQ-005)', () => {
    const content = readFile('src/lib/web3forms.ts');
    expect(content).toContain('https://api.web3forms.com/submit');
    expect(content).toContain("method: 'POST'");
    expect(content).toContain("'Content-Type': 'application/json'");
  });

  it('TEST-018: sends all form fields plus access_key and botcheck (REQ-005, REQ-010)', () => {
    const content = readFile('src/lib/web3forms.ts');
    expect(content).toContain('access_key: accessKey');
    expect(content).toContain('name: data.name');
    expect(content).toContain('email: data.email');
    expect(content).toContain('subject: data.subject');
    expect(content).toContain('message: data.message');
    expect(content).toContain("botcheck: ''");
  });

  it('TEST-019: reads access key from env var (REQ-011)', () => {
    const content = readFile('src/lib/web3forms.ts');
    expect(content).toContain('process.env.NEXT_PUBLIC_WEB3FORMS_KEY');
  });

  it('TEST-020: throws if access key is missing (REQ-011)', () => {
    const content = readFile('src/lib/web3forms.ts');
    expect(content).toContain('if (!accessKey)');
    expect(content).toContain('throw new Error');
  });

  it('TEST-021: returns typed Web3FormsResponse (REQ-005)', () => {
    const content = readFile('src/lib/web3forms.ts');
    expect(content).toContain('Promise<Web3FormsResponse>');
    expect(content).toContain('as Web3FormsResponse');
  });
});

// ---------------------------------------------------------------------------
// TEST-022–024 | REQ-006, REQ-007, REQ-008 | unit | Form states
// ---------------------------------------------------------------------------
describe('Form States — #13', () => {
  const getContent = () => readFile('src/components/contact-form.tsx');

  it('TEST-022: success state shows CheckCircle and data-testid (REQ-006)', () => {
    const content = getContent();
    expect(content).toContain('data-testid="contact-success"');
    expect(content).toContain('<CheckCircle');
    expect(content).toContain('Message Sent');
  });

  it('TEST-023: success state has "Send Another Message" button that resets (REQ-006, REQ-009)', () => {
    const content = getContent();
    expect(content).toContain('Send Another Message');
    expect(content).toContain("setStatus('idle')");
  });

  it('TEST-024: error state shows AlertCircle and data-testid (REQ-007)', () => {
    const content = getContent();
    expect(content).toContain('data-testid="contact-error"');
    expect(content).toContain('<AlertCircle');
    expect(content).toContain('{errorMessage}');
  });

  it('TEST-025: loading state shows Loader2 spinner and disables button (REQ-008)', () => {
    const content = getContent();
    expect(content).toContain('animate-spin');
    expect(content).toContain('<Loader2');
    expect(content).toContain("disabled={status === 'submitting'}");
    expect(content).toContain('Sending...');
  });

  it('TEST-026: form resets after successful submission (REQ-009)', () => {
    const content = getContent();
    expect(content).toContain('reset()');
    expect(content).toContain("setStatus('success')");
  });
});

// ---------------------------------------------------------------------------
// TEST-027–028 | REQ-010 | unit | Honeypot spam prevention
// ---------------------------------------------------------------------------
describe('Honeypot — #13', () => {
  it('TEST-027: honeypot checkbox is hidden with correct attributes (REQ-010, REQ-SEC-004)', () => {
    const content = readFile('src/components/contact-form.tsx');
    expect(content).toContain('data-testid="contact-honeypot"');
    expect(content).toContain('name="botcheck"');
    expect(content).toContain('className="hidden"');
    expect(content).toContain('tabIndex={-1}');
    expect(content).toContain('autoComplete="off"');
  });

  it('TEST-028: honeypot value sent as empty string in API payload (REQ-010)', () => {
    const content = readFile('src/lib/web3forms.ts');
    expect(content).toContain("botcheck: ''");
  });
});

// ---------------------------------------------------------------------------
// TEST-029 | REQ-012 | unit | .env.example
// ---------------------------------------------------------------------------
describe('Environment — #13', () => {
  it('TEST-029: .env.example documents NEXT_PUBLIC_WEB3FORMS_KEY (REQ-012)', () => {
    const content = readFile('.env.example');
    expect(content).toContain('NEXT_PUBLIC_WEB3FORMS_KEY');
  });
});

// ---------------------------------------------------------------------------
// TEST-030–032 | REQ-SEC-001, REQ-SEC-002, REQ-SEC-003 | unit | Security
// ---------------------------------------------------------------------------
describe('Security — #13', () => {
  it('TEST-030: no hardcoded API keys (UUID pattern) in src/ (REQ-SEC-001)', () => {
    const contactForm = readFile('src/components/contact-form.tsx');
    const web3forms = readFile('src/lib/web3forms.ts');
    const page = readFile('src/app/(landing)/contact/page.tsx');
    const uuidPattern =
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
    expect(contactForm).not.toMatch(uuidPattern);
    expect(web3forms).not.toMatch(uuidPattern);
    expect(page).not.toMatch(uuidPattern);
  });

  it('TEST-031: form input validated via zod schema (REQ-SEC-002)', () => {
    const content = readFile('src/components/contact-form.tsx');
    // Zod schema uses both inline and multiline z.string() — match broadly
    const zStringCount = (content.match(/z\s*\.\s*string\s*\(\)/g) ?? [])
      .length;
    expect(zStringCount).toBeGreaterThanOrEqual(4);
  });

  it('TEST-032: error handling uses catch(err: unknown) with instanceof (REQ-SEC-003)', () => {
    const content = readFile('src/components/contact-form.tsx');
    expect(content).toContain('catch (err: unknown)');
    expect(content).toContain('err instanceof Error');
  });

  it('TEST-033: no dangerouslySetInnerHTML, eval, or @ts-ignore in contact files', () => {
    const files = [
      'src/components/contact-form.tsx',
      'src/lib/web3forms.ts',
      'src/app/(landing)/contact/page.tsx',
    ];
    for (const file of files) {
      const content = readFile(file);
      expect(content).not.toContain('dangerouslySetInnerHTML');
      expect(content).not.toContain('eval(');
      expect(content).not.toContain('new Function(');
      expect(content).not.toContain('@ts-ignore');
    }
  });
});

// ---------------------------------------------------------------------------
// TEST-034–037 | REQ-I18N-001, REQ-I18N-002, REQ-I18N-003 | unit | i18n
// ---------------------------------------------------------------------------
describe('Internationalization — #13', () => {
  it('TEST-034: contact form uses gt-next T components (REQ-I18N-001)', () => {
    const content = readFile('src/components/contact-form.tsx');
    expect(content).toContain("from 'gt-next'");
    const tTagCount = (content.match(/<T\s+id="contact\./g) ?? []).length;
    expect(tTagCount).toBeGreaterThanOrEqual(12);
  });

  it('TEST-035: subject field has i18n wrapper (REQ-I18N-002)', () => {
    const content = readFile('src/components/contact-form.tsx');
    expect(content).toContain('contact.subjectLabel');
  });

  it('TEST-036: zod error messages use English defaults (REQ-I18N-003)', () => {
    const content = readFile('src/components/contact-form.tsx');
    expect(content).toContain('is required');
    expect(content).toContain('valid email');
    expect(content).toContain('at least 10 characters');
  });
});

// ---------------------------------------------------------------------------
// TEST-037–042 | REQ-A11Y-001 through REQ-A11Y-005 | unit | Accessibility
// ---------------------------------------------------------------------------
describe('Accessibility — #13', () => {
  const getContent = () => readFile('src/components/contact-form.tsx');

  it('TEST-037: all form inputs have associated Label htmlFor (REQ-A11Y-001)', () => {
    const content = getContent();
    const htmlForCount = (content.match(/htmlFor="/g) ?? []).length;
    expect(htmlForCount).toBeGreaterThanOrEqual(4);
    expect(content).toContain('htmlFor="name"');
    expect(content).toContain('htmlFor="email"');
    expect(content).toContain('htmlFor="subject"');
    expect(content).toContain('htmlFor="message"');
  });

  it('TEST-038: required fields indicated with asterisk (REQ-A11Y-002)', () => {
    const content = getContent();
    const asteriskCount = (content.match(/text-destructive">?\*</g) ?? [])
      .length;
    expect(asteriskCount).toBeGreaterThanOrEqual(4);
  });

  it('TEST-039: error messages in same container as input (REQ-A11Y-003)', () => {
    const content = getContent();
    // Each field group uses space-y-2 container with Label, Input, and error p
    const spaceY2Count = (content.match(/className="space-y-2"/g) ?? []).length;
    expect(spaceY2Count).toBeGreaterThanOrEqual(4);
  });

  it('TEST-040: submit button has accessible text in all states (REQ-A11Y-004)', () => {
    const content = getContent();
    expect(content).toContain('Sending...');
    expect(content).toContain('Send Message');
  });

  it('TEST-041: honeypot hidden from screen readers with tabIndex={-1} (REQ-A11Y-005)', () => {
    const content = getContent();
    expect(content).toContain('tabIndex={-1}');
    expect(content).toContain('autoComplete="off"');
  });
});

// ---------------------------------------------------------------------------
// TEST-042–048 | REQ-UX-001 through REQ-UX-008 | unit | UX compliance
// ---------------------------------------------------------------------------
describe('UX Compliance — #13', () => {
  it('TEST-042: contact page uses (landing) route group (REQ-UX-001)', () => {
    expect(
      fs.existsSync(resolve('src/app/(landing)/contact/page.tsx')),
    ).toBe(true);
  });

  it('TEST-043: form wrapped in shadcn Card components (REQ-UX-002)', () => {
    const content = readFile('src/components/contact-form.tsx');
    expect(content).toContain('<Card');
    expect(content).toContain('<CardHeader');
    expect(content).toContain('<CardContent');
    expect(content).toContain('<CardTitle');
    expect(content).toContain('<CardDescription');
  });

  it('TEST-044: name + email side by side on sm+ breakpoints (REQ-UX-003)', () => {
    const content = readFile('src/components/contact-form.tsx');
    expect(content).toContain('sm:grid-cols-2');
  });

  it('TEST-045: all Input components use h-10 for touch targets (REQ-UX-004)', () => {
    const content = readFile('src/components/contact-form.tsx');
    const h10Count = (content.match(/className="h-10"/g) ?? []).length;
    expect(h10Count).toBeGreaterThanOrEqual(3);
  });

  it('TEST-046: form container has max-w-2xl with responsive padding (REQ-UX-005)', () => {
    const content = readFile('src/app/(landing)/contact/page.tsx');
    expect(content).toContain('max-w-2xl');
    expect(content).toMatch(/px-4\s+sm:px-6\s+lg:px-8/);
  });

  it('TEST-047: page section uses py-16 md:py-24 vertical padding (REQ-UX-006)', () => {
    const content = readFile('src/app/(landing)/contact/page.tsx');
    expect(content).toContain('py-16 md:py-24');
  });

  it('TEST-048: submit button is full width (REQ-UX-007)', () => {
    const content = readFile('src/components/contact-form.tsx');
    expect(content).toContain('className="w-full"');
  });
});

// ---------------------------------------------------------------------------
// TEST-049–050 | REQ-014, REQ-015 | unit | Navigation links
// ---------------------------------------------------------------------------
describe('Navigation Links — #13', () => {
  it('TEST-049: contact link in footer (REQ-014)', () => {
    const content = readFile('src/components/layout/Footer.tsx');
    expect(content.toLowerCase()).toContain('contact');
    expect(content).toContain('/contact');
  });

  it('TEST-050: contact link in main navigation (REQ-015)', () => {
    const content = readFile('src/config/site.ts');
    expect(content).toContain('Contact');
    expect(content).toContain('/contact');
  });
});

// ---------------------------------------------------------------------------
// TEST-051 | REQ-016 | unit | ContactForm is Client Component
// ---------------------------------------------------------------------------
describe('Component Architecture — #13', () => {
  it('TEST-051: ContactForm is a Client Component with "use client" directive', () => {
    const content = readFile('src/components/contact-form.tsx');
    expect(content.startsWith("'use client'")).toBe(true);
  });

  it('TEST-052: page imports ContactForm component', () => {
    const content = readFile('src/app/(landing)/contact/page.tsx');
    expect(content).toContain("from '@/components/contact-form'");
    expect(content).toContain('<ContactForm');
  });
});
