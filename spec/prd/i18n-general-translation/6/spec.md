# Spec — Issue #6: feat: Internationalization (General Translation)

**Issue**: https://github.com/Carefully-Built/blueprint/issues/6
**Branch**: `feature/6`
**Labels**: `ink`, `P1`
**Milestone**: none
**Assignees**: none

---

## Context

Blueprint needs AI-powered internationalization to support multiple languages out of the box. General Translation is the chosen provider, offering AI-driven translations that integrate with Next.js.

## Spec

- Install and configure the General Translation SDK (`gt-next` or equivalent)
- Set up the GT provider/wrapper in the app layout
- Configure supported locales (EN primary, additional languages TBD)
- Wrap translatable strings with the GT translation function/component
- Set up locale detection (browser preference + URL-based routing)
- Add language switcher component in the navbar/footer
- Ensure all existing static text on landing pages uses the translation system

## AC (Acceptance Criteria)

- [ ] `bun run build` passes with GT integration
- [ ] Language switcher renders and toggles between at least 2 locales
- [ ] All user-facing strings on landing pages are wrapped with GT translation
- [ ] URL changes to reflect locale (e.g., `/it/`, `/en/`)
- [ ] `grep -r "gt-next\|general-translation" src/` returns config/usage files
- [ ] No hardcoded user-facing strings outside the translation system

## Files da modificare

- `package.json` — add GT dependency
- `src/app/layout.tsx` — wrap with GT provider
- `src/components/` — language switcher component
- `src/i18n/` or `src/gt/` — translation config and dictionaries
- `next.config.ts` — i18n/locale config if needed

## Out of Scope

- Translating blog/CMS content (Sanity handles that separately)
- Right-to-left (RTL) language support
- Translation of user-generated content

## Technical Notes

- Stack: Next.js 16 + Bun
- General Translation docs: https://generaltranslation.com/docs
- Must work with App Router (not Pages Router)
- Consider server-side translation for SEO

---

## Architecture Analysis

### Current State

GT integration is **partially done**:
- `gt-next` v6.13.1 already in `package.json` dependencies
- `gt.config.json` configured with `defaultLocale: "en"`, `locales: ["en", "it"]`
- `next.config.ts` already wrapped with `withGTConfig()`
- `<GTProvider>` already wraps the app in `src/app/layout.tsx`
- Dashboard settings has a working `LanguageSection` with `useLocale`/`useSetLocale`
- Blog components already use `<T id="blog.*">` pattern

**What's missing:**
- Landing page strings are all hardcoded (hero, features, FAQ, tech stack, CTA)
- Contact page strings are hardcoded
- Layout components (header, footer, nav) have hardcoded strings
- Auth pages have hardcoded strings
- No language switcher on public pages (only in dashboard settings)
- No `<LocaleSelector>` component used anywhere
- GT uses **cookie-based locale** (not URL prefix routing) — AC item about `/it/` `/en/` URLs may need clarification

### Files to Create

- `src/components/layout/locale-switcher.tsx` — Public-facing locale switcher for header/footer

### Files to Modify

- `src/app/(landing)/page.tsx` — Wrap hero strings with `<T>`
- `src/app/(landing)/_components/features-section.tsx` — Wrap feature titles/descriptions
- `src/app/(landing)/_components/tech-stack-section.tsx` — Wrap section headings (tech item data is template showcase, skip)
- `src/app/(landing)/_components/faq-section.tsx` — Wrap FAQ Q&A strings
- `src/app/(landing)/_components/generic-faq-section.tsx` — Wrap "Still have questions?" text
- `src/app/(landing)/contact/page.tsx` — Wrap form labels, buttons, status messages
- `src/components/layout/site-header.tsx` — Add locale switcher
- `src/components/layout/Footer.tsx` — Wrap footer text, add locale switcher or use existing
- `src/config/site.ts` — Nav items need translation approach (render `<T>` at use site)
- `src/components/layout/main-nav.tsx` — Wrap nav item titles with `<T>`
- `src/components/layout/mobile-nav.tsx` — Wrap nav item titles with `<T>`

### Assumptions Made

1. **GT uses cookie-based locale switching**, not URL prefix routing. The AC item "URL changes to reflect locale" may not be achievable with GT's architecture without custom middleware. We will implement GT's native cookie-based approach and note this in the issue.
2. **Tech stack section content** (tech names, descriptions, "why" text) is product showcase data — translating it would alter the meaning of what each tech tool does. We will wrap only the section headings, not the tech item data.
3. **Privacy/Terms pages** contain Lorem ipsum placeholder text — we will wrap only page titles, not placeholder content.
4. **`<LocaleSelector>`** from gt-next will be used for the public-facing switcher since it integrates with GTProvider automatically.
5. **Auth pages** are out of scope for this PR since they use WorkOS widgets/redirects and have minimal custom strings.
