# Tasks — Issue #13: feat: Contact Form (Web3Forms)

**Branch**: `feature/13`
**Dependency order**: Env Config -> API Helper -> Contact Form Component -> Page Refactor -> Verification

---

## Architecture Context

**Current state**: A monolithic `'use client'` contact page exists at `src/app/(landing)/contact/page.tsx` with inline form logic, hardcoded Web3Forms access key, no subject field, no honeypot, no metadata, and below-spec touch targets.

**Pattern to follow**: `src/app/(landing)/pricing/page.tsx` — Server Component with `export const metadata` that imports a child component. Form pattern: `src/components/forms/CustomForm.tsx` uses react-hook-form + zod.

**i18n**: Contact page already has `<T>` wrappers. New strings (subject label/placeholder) need `<T id="contact.*">` pattern.

**Touch targets**: shadcn Input uses `h-8` (32px). Must override to `h-10` (40px) for 44px touch target compliance (with padding).

---

## Tasks

- [x] **Task 1: Create `.env.example` with Web3Forms access key**
  - File: `.env.example` (CREATE)
  - Content:
    ```env
    # Web3Forms — Contact form submission
    # Get your access key at https://web3forms.com/
    NEXT_PUBLIC_WEB3FORMS_KEY=your_access_key_here

    # Convex
    CONVEX_DEPLOYMENT=
    NEXT_PUBLIC_CONVEX_URL=

    # WorkOS AuthKit
    WORKOS_API_KEY=
    WORKOS_CLIENT_ID=
    NEXT_PUBLIC_WORKOS_REDIRECT_URI=

    # Sanity
    NEXT_PUBLIC_SANITY_PROJECT_ID=
    NEXT_PUBLIC_SANITY_DATASET=

    # General Translation
    GT_API_KEY=
    GT_PROJECT_ID=
    ```
  - Include all env vars referenced in the codebase (grep for `process.env` to find them all)
  - Criterion: `grep "NEXT_PUBLIC_WEB3FORMS_KEY" .env.example` returns a match

- [x] **Task 2: Create `src/lib/web3forms.ts` API helper**
  - File: `src/lib/web3forms.ts` (CREATE)
  - Pattern: `src/lib/utils.ts` for file structure conventions
  - Imports: none (pure fetch helper)
  - Code:
    ```ts
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

    export async function submitContactForm(
      data: Web3FormsData
    ): Promise<Web3FormsResponse> {
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

      if (!accessKey) {
        throw new Error('NEXT_PUBLIC_WEB3FORMS_KEY environment variable is not set');
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          botcheck: '', // honeypot — must be empty for legitimate submissions
        }),
      });

      const result = (await response.json()) as Web3FormsResponse;
      return result;
    }
    ```
  - Criterion: `bun run typecheck` passes, `grep -r "web3forms" src/lib/` returns the file

- [x] **Task 3: Create `src/components/contact-form.tsx` Client Component**
  - File: `src/components/contact-form.tsx` (CREATE)
  - Pattern: `src/components/forms/CustomForm.tsx` for react-hook-form + zod pattern (lines 1-49)
  - Imports:
    ```ts
    'use client';

    import { T } from 'gt-next';
    import { zodResolver } from '@hookform/resolvers/zod';
    import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
    import { useState } from 'react';
    import { useForm } from 'react-hook-form';
    import { z } from 'zod';

    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { submitContactForm } from '@/lib/web3forms';
    ```
  - Define zod schema:
    ```ts
    const contactSchema = z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
      subject: z.string().min(1, 'Subject is required'),
      message: z.string().min(1, 'Message is required').min(10, 'Message must be at least 10 characters'),
    });

    type ContactFormData = z.infer<typeof contactSchema>;
    type FormStatus = 'idle' | 'submitting' | 'success' | 'error';
    ```
  - Component structure:
    ```tsx
    export function ContactForm(): React.ReactElement {
      const [status, setStatus] = useState<FormStatus>('idle');
      const [errorMessage, setErrorMessage] = useState('');

      const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
      } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        mode: 'onBlur',
      });

      const onSubmit = async (data: ContactFormData): Promise<void> => {
        setStatus('submitting');
        setErrorMessage('');

        try {
          const result = await submitContactForm(data);

          if (result.success) {
            setStatus('success');
            reset();
          } else {
            setStatus('error');
            setErrorMessage(result.message ?? 'Something went wrong. Please try again.');
          }
        } catch (err: unknown) {
          setStatus('error');
          const message = err instanceof Error ? err.message : 'Unknown error';
          setErrorMessage(message);
        }
      };

      // ... JSX below
    }
    ```
  - JSX requirements:
    - Wrap in `<Card>` with `<CardHeader>` (title + description) and `<CardContent>`
    - Success state: `<CheckCircle>` icon + message + "Send Another" button (resets to idle)
    - Form state: 4 fields in a form element
    - Name + Email: side by side in `grid gap-4 sm:grid-cols-2`
    - Subject: full width
    - Message: `<Textarea>` with `rows={5}`
    - All `<Input>` must have `className="h-10"` to override default `h-8` for 44px touch targets
    - Each field: `<Label>` with required asterisk + field + error message below
    - Error display per field: `{errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}`
    - Honeypot field: `<input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />`
    - General error banner: `<AlertCircle>` + message (same as existing pattern)
    - Submit button: full width, disabled during submitting, with Loader2 spinner
    - All visible text wrapped with `<T id="contact.*">` (reuse existing IDs from current page, add new ones for subject)
  - New i18n IDs needed:
    - `<T id="contact.subjectLabel">Subject</T>`
    - `<T id="contact.subjectPlaceholder">What is this about?</T>` — Note: placeholders can't use `<T>`, use hardcoded English string
  - Criterion: `bun run typecheck` passes, component exports `ContactForm`

- [x] **Task 4: Refactor `src/app/(landing)/contact/page.tsx` to Server Component**
  - File: `src/app/(landing)/contact/page.tsx` (MODIFY — full rewrite)
  - Remove `'use client'` directive
  - Remove all inline form logic, useState, imports for form components
  - Pattern: `src/app/(landing)/pricing/page.tsx` (lines 1-13) — Server Component with metadata + child import
  - New content:
    ```tsx
    import type { Metadata } from 'next';

    import { ContactForm } from '@/components/contact-form';

    export const metadata: Metadata = {
      title: 'Contact - Blueprint',
      description:
        'Get in touch with us. Send us a message and we will get back to you as soon as possible.',
    };

    export default function ContactPage(): React.ReactElement {
      return (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <ContactForm />
          </div>
        </section>
      );
    }
    ```
  - Note: The heading (h1 + description) can either stay in the page or move into `ContactForm`. Since the current page has them with `<T>` wrappers and they are part of the form card UX, move them into `ContactForm` component for self-containment.
  - Criterion: `bun run build` passes, page is a Server Component (no `'use client'`), `export const metadata` is present

- [x] **Task 5: Verify all AC items**
  - Run: `bun run build` — must pass
  - Run: `grep -r "web3forms" src/` — returns `src/lib/web3forms.ts` and `src/components/contact-form.tsx`
  - Run: `grep -r "botcheck" src/` — returns honeypot field in `contact-form.tsx`
  - Run: `grep "NEXT_PUBLIC_WEB3FORMS_KEY" .env.example` — returns the env var
  - Run: `grep "export const metadata" src/app/\(landing\)/contact/page.tsx` — confirms SEO metadata
  - Visual check: verify `h-10` class on all Input components in contact-form.tsx:
    `grep -c "h-10" src/components/contact-form.tsx` — returns >= 3 (name, email, subject inputs)
  - Verify no hardcoded access key:
    `grep -r "fe250ae9" src/` — returns 0 matches (old hardcoded key removed)
  - Criterion: all grep checks pass, build succeeds

- [x] **Task 6: Comment on issue with status**
  - Run:
    ```bash
    gh issue comment 13 --body "Spec initialized — branch: \`feature/13\`, tasks: 6

    ### Assumptions Made
    1. Used react-hook-form + zod for validation (project already uses these via CustomForm pattern)
    2. Used JSON submission to Web3Forms (not FormData) for cleaner honeypot integration
    3. Moved heading/description into ContactForm component for self-containment
    4. Footer link and nav link already exist — no changes needed
    5. Input height overridden to h-10 for 44px touch target compliance (default shadcn h-8 is 32px)
    6. Subject field added as required field per issue spec (existing page was missing it)
    7. .env.example created with all project env vars (not just Web3Forms)"
    ```
  - Criterion: comment visible on https://github.com/Carefully-Built/blueprint/issues/13
