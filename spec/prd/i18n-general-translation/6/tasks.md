# Tasks — Issue #6: feat: Internationalization (General Translation)

**Branch**: `feature/6`
**Dependency order**: Config/Setup -> Landing Page Strings -> Layout/Nav Strings -> Contact Page -> Language Switcher -> Verification

---

## Architecture Context

**GT integration status**: `gt-next` is installed and configured. `GTProvider`, `withGTConfig`, and `gt.config.json` are all in place. Dashboard settings already uses `<T>` and `useLocale`/`useSetLocale`. Blog pages already use `<T id="blog.*">`.

**Pattern to follow**: `src/app/(landing)/blog/_components/blog-header.tsx` — uses `import { T } from 'gt-next'` then `<T id="ns.key">Default text</T>`.

**Locale switching**: GT uses cookie-based locale (`generaltranslation.locale` cookie), not URL prefix routing. `<LocaleSelector>` from `gt-next` provides a built-in dropdown.

---

## Tasks

- [x] **Task 1: Wrap landing hero page strings with `<T>`**
  - File: `src/app/(landing)/page.tsx` (MODIFY)
  - Add import: `import { T } from 'gt-next';`
  - Wrap each user-facing string with `<T id="landing.xxx">`:
    ```tsx
    // Badge text (line 33)
    <T id="landing.badge">Now in public beta</T>

    // h1 (lines 36-39)
    <T id="landing.heroTitle">Ship beautiful B2B SaaS</T>
    <T id="landing.heroHighlight">in hours, not months</T>

    // Description (lines 41-43)
    <T id="landing.heroDescription">Production-ready foundation with auth, payments, real-time data, and stunning UI. Stop rebuilding the same infrastructure. Start shipping what matters.</T>

    // Buttons (lines 48, 50)
    <T id="landing.getStarted">Get Started</T>
    <T id="landing.learnMore">Learn More</T>

    // Social proof (line 57)
    <T id="landing.socialProof">Trusted by developers building the next generation of SaaS</T>
    ```
  - CTA section at bottom (lines 76-87):
    ```tsx
    <T id="landing.ctaTitle">Ready to ship faster?</T>
    <T id="landing.ctaDescription">Get started with Blueprint today and launch your SaaS in record time.</T>
    <T id="landing.startBuilding">Start Building</T>
    ```
  - Pattern: `src/app/(landing)/blog/_components/blog-header.tsx:1-20`
  - Criterion: `bun run build` passes, `grep -c '<T' src/app/\(landing\)/page.tsx` returns >= 8

- [x] **Task 2: Wrap features section strings with `<T>`**
  - File: `src/app/(landing)/_components/features-section.tsx` (MODIFY)
  - Add import: `import { T } from 'gt-next';`
  - Wrap section headings:
    ```tsx
    // h2 (line 33-34)
    <T id="features.title">Everything you need to ship</T>

    // Description (lines 36-37)
    <T id="features.description">Stop rebuilding the same infrastructure. Start with a foundation that scales.</T>
    ```
  - For the `features` array items: move the `<T>` wrapping into the JSX render, not the data definition. Replace lines 48-49:
    ```tsx
    <CardTitle className="text-lg">
      <T id={`features.${feature.title.toLowerCase().replace(/[^a-z]/g, '')}.title`}>
        {feature.title}
      </T>
    </CardTitle>
    <CardDescription className="text-sm leading-relaxed">
      <T id={`features.${feature.title.toLowerCase().replace(/[^a-z]/g, '')}.description`}>
        {feature.description}
      </T>
    </CardDescription>
    ```
  - Alternatively, use simpler static IDs by index or slug:
    ```tsx
    // Define feature keys for stable IDs
    const featureKeys = ['productionReady', 'aiOptimized', 'b2bReady', 'modernStack'] as const;
    ```
    Then in JSX:
    ```tsx
    {features.map((feature, index) => (
      ...
      <CardTitle className="text-lg">
        <T id={`features.${featureKeys[index]}.title`}>{feature.title}</T>
      </CardTitle>
      <CardDescription className="text-sm leading-relaxed">
        <T id={`features.${featureKeys[index]}.desc`}>{feature.description}</T>
      </CardDescription>
    ))}
    ```
  - Criterion: `bun run build` passes

- [x] **Task 3: Wrap FAQ section strings with `<T>`**
  - File: `src/app/(landing)/_components/faq-section.tsx` (MODIFY)
  - Add import: `import { T } from 'gt-next';`
  - Wrap FAQ title and description props:
    ```tsx
    <GenericFaqSection
      title={<T id="faq.title">Frequently asked questions</T>}
      description={<T id="faq.description">Everything you need to know about Blueprint.</T>}
      items={faqs}
    />
    ```
  - Note: This requires updating `GenericFaqSectionProps` to accept `ReactNode` for `title` and `description` instead of `string`.
  - File: `src/app/(landing)/_components/generic-faq-section.tsx` (MODIFY)
  - Change prop types:
    ```tsx
    import type { ReactNode } from 'react';
    import { T } from 'gt-next';

    interface GenericFaqSectionProps {
      readonly title: ReactNode;
      readonly description: ReactNode;
      // ... rest unchanged
    }
    ```
  - Wrap "Still have questions?" and "Contact us" text (line 35-37):
    ```tsx
    <p className="text-muted-foreground">
      <T id="faq.stillHaveQuestions">Still have questions?</T>{' '}
      <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
        <T id="faq.contactUs">Contact us</T>
      </a>
    </p>
    ```
  - For FAQ items (question/answer strings): wrap at render site in `faq-item.tsx`:
    - File: `src/app/(landing)/_components/faq-item.tsx` (MODIFY)
    - Change `FaqItemProps` to accept `ReactNode`:
      ```tsx
      import type { ReactNode } from 'react';

      export interface FaqItemProps {
        readonly question: ReactNode;
        readonly answer: ReactNode;
      }
      ```
    - Back in `faq-section.tsx`, wrap each FAQ item:
      ```tsx
      const faqs: readonly FaqItemProps[] = [
        {
          question: <T id="faq.q1">What is Blueprint?</T>,
          answer: <T id="faq.a1">Blueprint is a production-ready B2B SaaS starter kit...</T>,
        },
        // ... repeat for all 8 items with ids faq.q2/a2 through faq.q8/a8
      ];
      ```
  - Criterion: `bun run build` passes, FAQ section renders correctly

- [x] **Task 4: Wrap tech stack section headings with `<T>`**
  - File: `src/app/(landing)/_components/tech-stack-section.tsx` (MODIFY)
  - Add import: `import { T } from 'gt-next';`
  - Wrap section headings only (not tech item data — those are product names/descriptions):
    ```tsx
    // Line 259
    <T id="techStack.subtitle">Built with the best</T>

    // Lines 262-263
    <T id="techStack.title">The perfect stack for AI-generated B2B SaaS</T>

    // Lines 265-266
    <T id="techStack.description">Every tool carefully chosen for a reason. Modern, scalable, and designed to work together beautifully.</T>
    ```
  - Do NOT wrap tech item names, descriptions, or "why" text — these are product showcase data.
  - Criterion: `bun run build` passes

- [x] **Task 5: Wrap contact page strings with `<T>`**
  - File: `src/app/(landing)/contact/page.tsx` (MODIFY)
  - This is a `'use client'` component, so `<T>` works fine.
  - Add import: `import { T } from 'gt-next';`
  - Wrap all user-facing strings:
    ```tsx
    // Page heading (lines 51-52)
    <T id="contact.title">Get in Touch</T>
    <T id="contact.description">Have a question or want to work together? We'd love to hear from you.</T>

    // Card header (lines 61-63)
    <T id="contact.formTitle">Send us a message</T>
    <T id="contact.formDescription">Fill out the form below and we'll get back to you as soon as possible.</T>

    // Success state (lines 69-76)
    <T id="contact.successTitle">Message Sent!</T>
    <T id="contact.successDescription">Thank you for reaching out. We'll get back to you soon.</T>
    <T id="contact.sendAnother">Send Another Message</T>

    // Form labels (lines 82, 92)
    <T id="contact.nameLabel">Name</T>
    <T id="contact.emailLabel">Email</T>
    <T id="contact.messageLabel">Message</T>

    // Submit button (lines 127, 132)
    <T id="contact.sending">Sending...</T>
    <T id="contact.sendMessage">Send Message</T>
    ```
  - Note: `placeholder` attributes cannot use `<T>` (they need string values). Leave placeholders in English or use `useGT()` hook for them.
  - Criterion: `bun run build` passes

- [x] **Task 6: Wrap layout nav/header strings with `<T>`**
  - File: `src/components/layout/main-nav.tsx` (MODIFY)
  - Add import: `import { T } from 'gt-next';`
  - Wrap nav item titles at render site:
    ```tsx
    {items.map((item) => (
      <Link key={item.href} href={item.href} ...>
        <T id={`nav.${item.title.toLowerCase()}`}>{item.title}</T>
      </Link>
    ))}
    ```
  - File: `src/components/layout/mobile-nav.tsx` (MODIFY)
  - Add import: `import { T } from 'gt-next';`
  - Same pattern for nav item titles in mobile nav (line 48):
    ```tsx
    <T id={`nav.${item.title.toLowerCase()}`}>{item.title}</T>
    ```
  - Wrap "Sign In" button text (line 58):
    ```tsx
    <T id="nav.signIn">Sign In</T>
    ```
  - Wrap "Toggle menu" sr-only text (line 30):
    ```tsx
    <T id="nav.toggleMenu">Toggle menu</T>
    ```
  - Wrap SheetTitle "Blueprint" (line 35):
    ```tsx
    <T id="nav.brand">Blueprint</T>
    ```
  - Criterion: `bun run build` passes

- [x] **Task 7: Wrap footer strings with `<T>`**
  - File: `src/components/layout/Footer.tsx` (MODIFY)
  - Add import: `import { T } from 'gt-next';`
  - Wrap footer text:
    ```tsx
    // Brand description (lines 41-43)
    <T id="footer.description">Production-ready foundation for B2B SaaS. Ship faster with pre-built auth, payments, and real-time data.</T>

    // Section headings (lines 49, 66)
    <T id="footer.product">Product</T>
    <T id="footer.legal">Legal</T>

    // Link labels — wrap at render site:
    <T id={`footer.link.${link.label.toLowerCase().replace(/\s+/g, '')}`}>{link.label}</T>

    // Copyright (line 85)
    <T id="footer.copyright">All rights reserved.</T>
    // Keep the dynamic year outside <T>
    ```
  - Criterion: `bun run build` passes

- [x] **Task 8: Add locale switcher to public header**
  - File: `src/components/layout/locale-switcher.tsx` (CREATE)
  - Create a thin wrapper around GT's `<LocaleSelector>` with styling:
    ```tsx
    'use client';

    import { LocaleSelector } from 'gt-next';

    const localeNames: Record<string, string> = {
      en: 'EN',
      it: 'IT',
    };

    export function LocaleSwitcher(): React.ReactElement {
      return (
        <LocaleSelector customNames={localeNames} />
      );
    }
    ```
  - If `<LocaleSelector>` doesn't accept className for styling, wrap in a div with appropriate classes. Test rendering first.
  - Pattern: `src/app/dashboard/settings/_components/language-section.tsx` for how locale APIs are used
  - File: `src/components/layout/site-header.tsx` (MODIFY)
  - Add import: `import { LocaleSwitcher } from './locale-switcher';`
  - Add `<LocaleSwitcher />` in the desktop nav area (after `<AuthButton />`, line 31):
    ```tsx
    <div className="hidden items-center gap-4 md:flex">
      <MainNav items={landingNav} />
      <LocaleSwitcher />
      <AuthButton />
    </div>
    ```
  - Add `<LocaleSwitcher />` in the mobile area too (before `<AuthButton />`, line 34):
    ```tsx
    <div className="flex items-center gap-2 md:hidden">
      <LocaleSwitcher />
      <AuthButton />
    </div>
    ```
  - File: `src/components/layout/index.ts` (MODIFY if exists)
  - Add export: `export { LocaleSwitcher } from './locale-switcher';`
  - Criterion: `bun run build` passes, locale switcher visible in header, clicking toggles locale

- [x] **Task 9: Verify build and run grep checks**
  - Run: `bun run build`
  - Run: `grep -rn 'gt-next\|general-translation' src/` — verify config/usage files found
  - Run manual check: all landing page components import `T` from `gt-next`:
    ```bash
    for f in src/app/\(landing\)/page.tsx src/app/\(landing\)/_components/features-section.tsx src/app/\(landing\)/_components/tech-stack-section.tsx src/app/\(landing\)/_components/faq-section.tsx src/app/\(landing\)/_components/generic-faq-section.tsx src/app/\(landing\)/contact/page.tsx; do
      grep -l "from 'gt-next'" "$f" || echo "MISSING: $f"
    done
    ```
  - Verify no hardcoded user-facing strings remain in landing pages (spot check major files)
  - Criterion: build passes, all checks return expected results

- [x] **Task 10: Comment on issue with status**
  - Run:
    ```bash
    gh issue comment 6 --body "Spec initialized — branch: \`feature/6\`, tasks: 10

    ### Assumptions Made
    1. GT uses cookie-based locale switching (not URL prefix routing). The \`/it/\`, \`/en/\` URL pattern is not natively supported by gt-next — locale is stored in a cookie (\`generaltranslation.locale\`).
    2. Tech stack item data (names, descriptions) left untranslated — these are product showcase content.
    3. Privacy/Terms placeholder Lorem ipsum content not wrapped — only page titles.
    4. Auth pages (login/signup) deferred — they use WorkOS widgets with minimal custom text.
    5. \`<LocaleSelector>\` from gt-next used for the public language switcher."
    ```
  - Criterion: comment visible on https://github.com/Carefully-Built/blueprint/issues/6
