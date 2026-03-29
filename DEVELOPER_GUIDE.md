# 20xdev Developer Guide

Comprehensive guide to the 20xdev SaaS boilerplate architecture and component patterns.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Directory Structure](#3-directory-structure)
4. [Provider Hierarchy](#4-provider-hierarchy)
5. [Forms](#5-forms)
6. [Conventions](#6-conventions)

---

## 1. Project Overview

20xdev is a production-ready B2B SaaS boilerplate built with **Next.js 16** (App Router) and **Convex**. It provides pre-built foundations for:

- Marketing site with blog
- Email/password auth with WorkOS
- Multi-organization management
- Dashboard with CRUD operations
- Real-time data with Convex

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI Library | React 19 + TypeScript 5 |
| Components | shadcn/ui + Tailwind CSS 4 |
| Forms | React Hook Form 7 + Zod 4 |
| Server State | TanStack React Query 5 + Convex |
| Auth | WorkOS (AuthKit + Organizations) |
| Database | Convex (real-time, serverless) |
| CMS | Sanity Studio |
| Analytics | PostHog |
| Localization | General Translation (gt-next) |
| URL State | nuqs 2 |

---

## 3. Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth routes (sign-in, signup, etc.)
│   ├── (landing)/         # Marketing site
│   ├── dashboard/         # Protected dashboard
│   │   ├── _components/   # Dashboard-specific components
│   │   ├── items/         # Items CRUD page
│   │   ├── files/         # Files management
│   │   └── settings/      # Settings pages
│   ├── api/               # API routes
│   └── studio/            # Sanity Studio
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form field components
│   ├── layout/           # Layout components
│   └── workos/           # WorkOS components
├── providers/             # React Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities
├── types/                 # TypeScript types
├── schemas/               # Zod validation schemas
├── config/               # Site configuration
└── sanity/               # Sanity client and schemas

convex/
├── functions/            # Convex queries and mutations
│   ├── users/
│   ├── organizations/
│   ├── items/
│   └── files/
├── tables/               # Convex table definitions
├── auth.ts               # Convex auth configuration
└── schema.ts            # Combined schema
```

---

## 4. Provider Hierarchy

Providers are nested in the root layout:

```
ThemeProvider (next-themes)
 └─ PostHogProvider
    └─ NuqsAdapter
       └─ QueryProvider (TanStack)
          └─ WorkOsWidgets
             └─ ConvexClientProvider
```

| Provider | Hook | Purpose |
|---|---|---|
| `ConvexClientProvider` | `useQuery`, `useMutation` from `convex/react` | Convex data layer |
| `OrganizationProvider` | `useOrganization` | Current org state |
| `UserProvider` | `useUser` | Current user state |
| `QueryProvider` | `useQueryClient` | TanStack Query config |

---

## 5. Forms

### CustomForm Component

**Location:** `src/components/forms/CustomForm.tsx`

The form system is built on React Hook Form + Zod:

```typescript
import { CustomForm } from '@/components/forms/CustomForm';
import { CustomInputField } from '@/components/forms/CustomInputField';
import { CustomSelectField } from '@/components/forms/CustomSelectField';
import { DialogFormActions } from '@/components/ui/dialog';
import { ResponsiveDialog } from '@/components/ui/dialog';

export function AddItemDialog({ open, onClose }: Props) {
  const mutation = useMutation(api.items.create);

  return (
    <ResponsiveDialog
      open={open}
      onClose={onClose}
      title="Add Item"
      actions={
        <DialogFormActions
          onClose={onClose}
          mutation={mutation}
          formId="add-item-form"
        />
      }
    >
      <CustomForm
        schema={itemSchema}
        defaultValues={{ name: '', description: '' }}
        onSubmit={async (data) => {
          await mutation.mutateAsync(data);
          onClose();
        }}
        id="add-item-form"
      >
        <CustomInputField name="name" label="Name" />
        <CustomInputField name="description" label="Description" multiline />
      </CustomForm>
    </ResponsiveDialog>
  );
}
```

### Available Field Components

| Component | Purpose |
|---|---|
| `CustomInputField` | Text/textarea input |
| `CustomSelectField` | Dropdown selection |
| `CustomPasswordField` | Password input |

### Zod Schemas

Schemas live in `src/schemas/`:

```typescript
import { z } from 'zod';

export const itemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type ItemFormData = z.infer<typeof itemSchema>;
```

---

## 6. Conventions

### File Naming

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `AddItemDialog.tsx` |
| Hooks | camelCase with `use` prefix | `useItems.ts` |
| Utilities | camelCase | `format-date.ts` |
| Types | kebab-case | `user.ts` |
| Schemas | kebab-case | `auth-schema.ts` |

### Import Order

1. React/Next.js
2. External libraries
3. Internal aliases (`@/`)
4. Relative imports
5. Types (last)

### Convex Patterns

```typescript
// ✅ Use native Convex hooks
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';

const items = useQuery(api.items.list, { organizationId });
const createItem = useMutation(api.items.create);

// ✅ All queries/mutations include organizationId
export const list = query({
  args: { organizationId: v.string() },
  handler: async (ctx, { organizationId }) => {
    return ctx.db
      .query('items')
      .withIndex('by_organization', (q) => q.eq('organizationId', organizationId))
      .collect();
  },
});
```

### WorkOS Components

```typescript
// ✅ Use WorkOS built-in components
import { OrganizationSwitcher } from '@workos-inc/authkit-nextjs/components';

// ✅ Use WorkOS hooks for auth state
import { useOrganization, useUser } from '@workos-inc/authkit-nextjs';
```

### Pre-Commit Checklist

- [ ] ESLint passes (`bun run lint`)
- [ ] TypeScript compiles (`bun run typecheck`)
- [ ] No console.log (use console.warn/error only)
- [ ] Organization-scoped data access
- [ ] Proper error handling

### Testing Before Done

1. Run `bun run check`
2. Test in browser:
   - Sign in/up flow
   - Organization creation
   - Organization switching
   - CRUD operations (items page)
   - Settings pages

---

## License

MIT
