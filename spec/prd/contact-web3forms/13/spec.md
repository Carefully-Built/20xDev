# Spec — Issue #13: feat: Contact Form (Web3Forms)

**Issue**: https://github.com/Carefully-Built/blueprint/issues/13
**Branch**: `feature/13`
**Labels**: `ink`, `P2`
**Milestone**: none
**Assignees**: none

---

## Context

Blueprint needs a contact form so visitors can reach out with inquiries. Web3Forms is the chosen backend — no server needed, just an API endpoint.

## Spec

- Create a contact page at `/contact`
- Build the form with fields: name, email, subject, message
- Integrate with Web3Forms API for form submission
- Add client-side validation (required fields, email format)
- Show success/error states after submission
- Add honeypot field for spam prevention
- Add proper metadata for SEO
- Link from footer/navigation

## AC (Acceptance Criteria)

- [ ] `bun run build` passes — REQ-001
- [ ] Page accessible at `/contact` and form renders correctly — REQ-002
- [ ] `grep -r "web3forms" src/` returns form integration files — REQ-003
- [ ] Form validates required fields before submission — REQ-004
- [ ] Success toast/message appears after successful submission — REQ-005
- [ ] Error state renders if submission fails — REQ-006
- [ ] Honeypot field is present but hidden (spam prevention) — REQ-SEC-001
- [ ] Environment variable `NEXT_PUBLIC_WEB3FORMS_KEY` is documented in `.env.example` — REQ-SEC-002
- [ ] Form is fully responsive on 375px viewport — REQ-UX-001
- [ ] All inputs meet 44px touch target minimum — REQ-A11Y-001

## Requirements Traceability

| ID | Category | Requirement | Verification |
|----|----------|-------------|-------------|
| REQ-001 | Build | `bun run build` passes with zero errors | Run `bun run build` |
| REQ-002 | Functional | Contact page at `/contact` renders form with name, email, subject, message fields | Visual + grep for 4 form fields |
| REQ-003 | Functional | Web3Forms integration via `src/lib/web3forms.ts` helper | `grep -r "web3forms" src/` returns files |
| REQ-004 | Functional | Client-side validation: required fields + email format via zod schema | Zod schema with min(1) + .email() |
| REQ-005 | Functional | Success state with CheckCircle icon + "Send Another" button after successful submit | data-testid="contact-success" |
| REQ-006 | Functional | Error state with AlertCircle icon + message after failed submit | data-testid="contact-error" |
| REQ-007 | Functional | Subject field present (missing from current implementation) | data-testid="contact-subject" |
| REQ-008 | Functional | Server Component page with `export const metadata` for SEO | grep for `export const metadata` |
| REQ-009 | Functional | ContactForm extracted as separate Client Component | File exists at `src/components/contact-form.tsx` |
| REQ-010 | Functional | No hardcoded API keys in source code | grep for old key returns 0 matches |
| REQ-SEC-001 | Security | Honeypot field (hidden checkbox name="botcheck") for spam prevention | `grep -r "botcheck" src/` |
| REQ-SEC-002 | Security | `NEXT_PUBLIC_WEB3FORMS_KEY` in `.env.example`, read from env at runtime | grep in .env.example |
| REQ-UX-001 | UX | Responsive layout: stacks on mobile (375px), grid on desktop | Mobile-first grid classes |
| REQ-UX-002 | UX | Name + Email side by side on desktop (`grid sm:grid-cols-2`) | grep for grid-cols-2 |
| REQ-A11Y-001 | A11Y | All inputs use `h-10` (40px) for 44px touch target with padding | grep for h-10 class |
| REQ-A11Y-002 | A11Y | Labels with required asterisk on all fields | Label + asterisk pattern |
| REQ-A11Y-003 | A11Y | Inline error messages below fields in text-destructive | formState.errors pattern |
| REQ-I18N-001 | i18n | All visible text wrapped with `<T>` components | grep for `<T` in contact-form |
| REQ-I18N-002 | i18n | Subject label/placeholder i18n IDs added | `<T id="contact.subject*">` |

## Files da modificare

- `src/app/(landing)/contact/page.tsx` — the contact page
- `src/components/contact-form.tsx` — the form component (Client Component)
- `src/lib/web3forms.ts` — API integration helper
- `.env.example` — add Web3Forms access key var
- `src/components/layout/footer.tsx` — add contact link

## Out of Scope

- File upload in contact form
- Contact form on dashboard (this is public-facing only)
- Auto-reply emails
- CRM integration

## Technical Notes

- Stack: Next.js 16 + Bun + shadcn/ui + Tailwind
- Web3Forms API: https://web3forms.com/
- Form component must be Client Component (uses useState/form handling)
- Use shadcn Input, Textarea, Button components
- Consider using react-hook-form or native form validation

---

## Architecture Analysis

*Updated by write-spec on 2026-03-07*

### Current State

A basic contact page already exists at `src/app/(landing)/contact/page.tsx`:
- It is a monolithic `'use client'` page with inline form logic
- Has name, email, message fields (missing **subject** field)
- Integrates with Web3Forms via `fetch()` directly in the component
- **Hardcodes** the access key (`fe250ae9-b11c-4b8f-9c9d-ab204ce80687`) instead of using env var
- Has success/error states with useState
- Already has i18n `<T>` wrappers from issue #6
- No honeypot field for spam prevention
- No SEO metadata export (page is `'use client'` so cannot export `metadata`)
- No separate form component or API helper extracted
- Input uses `h-8` (32px) which is below the 44px touch target minimum

### Files to Create

| File | Purpose | Pattern Reference |
|------|---------|-------------------|
| `src/lib/web3forms.ts` | Typed fetch helper for Web3Forms API — accepts form data, appends access key, returns typed response | Like `src/lib/utils.ts` for file conventions |
| `src/components/contact-form.tsx` | Client Component with react-hook-form + zod validation, success/error/loading states, honeypot field | Like `src/components/forms/CustomForm.tsx:1-49` for rhf+zod pattern |
| `.env.example` | Documents all environment variables including `NEXT_PUBLIC_WEB3FORMS_KEY` | New file |

### Files to Modify

| File | Section/Lines | Change |
|------|--------------|--------|
| `src/app/(landing)/contact/page.tsx` | Full file (lines 1-144) | Complete rewrite: remove `'use client'`, remove all inline form logic, convert to Server Component with `export const metadata` + `<ContactForm />` import (13 lines total) |

### Files Already Done (no changes needed)

- `src/components/layout/Footer.tsx` — Already has `{ label: 'Contact', href: '/contact', id: 'contact' }` at line 13
- `src/config/site.ts` — Already has `{ title: 'Contact', href: '/contact' }` at line 28

### Interfaces & Signatures

```ts
// src/lib/web3forms.ts
interface Web3FormsData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface Web3FormsResponse {
  success: boolean;
  message?: string;
}

export async function submitContactForm(data: Web3FormsData): Promise<Web3FormsResponse>
// Reads NEXT_PUBLIC_WEB3FORMS_KEY from process.env, throws if missing
// POST JSON to https://api.web3forms.com/submit with access_key + botcheck honeypot
// Returns typed response

// src/components/contact-form.tsx
// 'use client' — uses react-hook-form, useState
const contactSchema: z.ZodObject<{
  name: z.ZodString;      // min(1, 'Name is required')
  email: z.ZodString;     // min(1).email('Please enter a valid email')
  subject: z.ZodString;   // min(1, 'Subject is required')
  message: z.ZodString;   // min(1).min(10, 'Message must be at least 10 characters')
}>

type ContactFormData = z.infer<typeof contactSchema>
type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function ContactForm(): React.ReactElement
// Self-contained form with heading, card, validation, submission, all states

// src/app/(landing)/contact/page.tsx
export const metadata: Metadata  // { title: 'Contact - Blueprint', description: '...' }
export default function ContactPage(): React.ReactElement  // Server Component wrapper
```

### Import Map

| Consumer | Imports From | What |
|----------|-------------|------|
| `src/lib/web3forms.ts` | (none) | Pure fetch helper, no external imports |
| `src/components/contact-form.tsx` | `gt-next` | `T` |
| `src/components/contact-form.tsx` | `@hookform/resolvers/zod` | `zodResolver` |
| `src/components/contact-form.tsx` | `lucide-react` | `Send`, `CheckCircle`, `AlertCircle`, `Loader2` |
| `src/components/contact-form.tsx` | `react` | `useState` |
| `src/components/contact-form.tsx` | `react-hook-form` | `useForm` |
| `src/components/contact-form.tsx` | `zod` | `z` |
| `src/components/contact-form.tsx` | `@/components/ui/button` | `Button` |
| `src/components/contact-form.tsx` | `@/components/ui/card` | `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle` |
| `src/components/contact-form.tsx` | `@/components/ui/input` | `Input` |
| `src/components/contact-form.tsx` | `@/components/ui/label` | `Label` |
| `src/components/contact-form.tsx` | `@/components/ui/textarea` | `Textarea` |
| `src/components/contact-form.tsx` | `@/lib/web3forms` | `submitContactForm` |
| `src/app/(landing)/contact/page.tsx` | `next` | `Metadata` (type) |
| `src/app/(landing)/contact/page.tsx` | `@/components/contact-form` | `ContactForm` |

### Data Flow

```
User fills form (name, email, subject, message)
  -> react-hook-form validates via zod schema (onBlur + onSubmit)
  -> on valid submit: onSubmit(data) called
    -> setStatus('submitting')
    -> submitContactForm(data)
      -> reads NEXT_PUBLIC_WEB3FORMS_KEY from process.env
      -> POST https://api.web3forms.com/submit
        body: { access_key, name, email, subject, message, botcheck: '' }
      -> parse JSON response as Web3FormsResponse
    -> if result.success:
      -> setStatus('success'), reset() form fields
      -> render success state with CheckCircle + "Send Another" button
    -> if result.success === false:
      -> setStatus('error'), setErrorMessage(result.message)
      -> render error banner with AlertCircle
    -> if network error (catch):
      -> setStatus('error'), setErrorMessage(err.message)
```

### Error Handling

| Operation | Failure Mode | Handling |
|-----------|-------------|----------|
| Zod validation | Empty/invalid fields | Inline error below each field via `formState.errors.fieldName.message` |
| Zod validation | Email format invalid | Inline error "Please enter a valid email" |
| Zod validation | Message < 10 chars | Inline error "Message must be at least 10 characters" |
| submitContactForm | `NEXT_PUBLIC_WEB3FORMS_KEY` missing | `throw new Error(...)` caught in onSubmit, displayed in error banner |
| submitContactForm | Network failure (fetch throws) | `catch (err: unknown)` with `instanceof Error` narrowing, message in error banner |
| submitContactForm | API returns `{ success: false }` | `result.message` displayed in error banner, fallback "Something went wrong" |
| submitContactForm | Non-JSON response | `response.json()` throws, caught as network error |

### Test Requirements

| Test | data-testid | Assertion |
|------|-------------|-----------|
| Form renders all fields | `contact-form` | Contains 3 Input elements + 1 Textarea |
| Name field present | `contact-name` | Input with `name="name"` exists |
| Email field present | `contact-email` | Input with `name="email"` and `type="email"` exists |
| Subject field present | `contact-subject` | Input with `name="subject"` exists |
| Message field present | `contact-message` | Textarea with `name="message"` exists |
| Submit button | `contact-submit` | Button with type="submit" exists |
| Success state | `contact-success` | Visible after successful submission |
| Error state | `contact-error` | Visible after failed submission |
| Honeypot field | `contact-honeypot` | Hidden checkbox with `name="botcheck"` exists |
| Touch targets | (all inputs) | All Input elements have `h-10` class |
