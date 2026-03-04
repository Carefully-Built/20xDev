# Blueprint

> The AI-optimized starting point for building beautiful B2B SaaS products.

Blueprint is a production-ready template designed to help AI (and humans) build scalable B2B SaaS applications with clean, elegant code. It combines the best modern tools into a cohesive foundation that prioritizes code quality, developer experience, and enterprise-readiness.

## Why Blueprint?

Building a SaaS from scratch means making hundreds of decisions about tooling, architecture, and patterns. Blueprint makes those decisions for you, providing:

- **Clean, AI-friendly code** — Structured for AI assistants to understand and extend
- **Enterprise-ready auth** — Multi-tenant authentication out of the box
- **Real-time by default** — Live updates without complexity
- **Type-safe everything** — From database to UI, fully typed
- **Production patterns** — Battle-tested approaches to common problems

## Tech Stack

### Core Framework
| Tool | Purpose |
|------|---------|
| [Next.js 16](https://nextjs.org) | React framework with App Router & Turbopack |
| [TypeScript](https://typescriptlang.org) | Type-safe JavaScript |
| [Bun](https://bun.sh) | Fast JavaScript runtime & package manager |

### Backend & Data
| Tool | Purpose |
|------|---------|
| [Convex](https://convex.dev) | Real-time database & backend functions |
| [Zod](https://zod.dev) | Schema validation & type inference |

### Authentication & Enterprise
| Tool | Purpose |
|------|---------|
| [WorkOS](https://workos.com) | Enterprise SSO, SCIM, directory sync |
| [AuthKit](https://workos.com/authkit) | Beautiful, secure authentication UI |

### UI & Styling
| Tool | Purpose |
|------|---------|
| [shadcn/ui](https://ui.shadcn.com) | Beautiful, accessible components |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [Lucide](https://lucide.dev) | Clean, consistent icons |
| [Animate UI](https://animate-ui.com) | Smooth animations & micro-interactions |

### Payments & Email
| Tool | Purpose |
|------|---------|
| [Stripe](https://stripe.com) | Payments & billing (connected to Convex) |
| [Resend](https://resend.com) | Transactional emails |

### State & Data Fetching
| Tool | Purpose |
|------|---------|
| [TanStack Query](https://tanstack.com/query) | Server state management |
| [nuqs](https://nuqs.47ng.com) | Type-safe URL search params |

### AI & Intelligence
| Tool | Purpose |
|------|---------|
| [OpenAI](https://openai.com) | LLM integration for AI features |

### Internationalization
| Tool | Purpose |
|------|---------|
| [General Translation](https://generaltranslation.com) | AI-powered i18n |

### Content & Blog
| Tool | Purpose |
|------|---------|
| [Sanity](https://sanity.io) | Headless CMS for blog & content |

### Analytics
| Tool | Purpose |
|------|---------|
| [DataFast](https://datafa.st) | Simple, privacy-friendly analytics |

### Product Analytics & Logging
| Tool | Purpose |
|------|---------|
| [PostHog](https://posthog.com) | Product analytics, error tracking & session replay |

### Feedback & Support
| Tool | Purpose |
|------|---------|
| [Featurebase](https://featurebase.app) | Feature requests, changelog & documentation |

### Code Quality
| Tool | Purpose |
|------|---------|
| [ESLint](https://eslint.org) | Code linting (Airbnb config) |
| [Knip](https://knip.dev) | Find unused files & dependencies |
| [CodeRabbit](https://coderabbit.ai) | AI-powered code review |
| [SonarCloud](https://sonarcloud.io) | Code quality & security analysis |

## Getting Started

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local

# Start development server
bun dev
```

## Project Structure

```
src/
├── app/
│   ├── (landing)/        # Public marketing pages
│   ├── (auth)/           # Authentication flows
│   ├── dashboard/        # Authenticated app
│   └── api/              # API routes
├── components/
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities & helpers
├── providers/            # React context providers
└── config/               # App configuration

convex/
├── schema.ts             # Database schema
└── *.ts                  # Backend functions
```

## Scripts

```bash
bun dev          # Start dev server with Turbopack
bun build        # Production build
bun lint         # ESLint (strict, zero warnings)
bun typecheck    # TypeScript check
bun check        # Run typecheck + lint
bun format       # Format with Prettier
```

## Code Standards

Blueprint enforces strict code quality:

- **Zero `any` types** — Strict TypeScript with no exceptions
- **Airbnb ESLint** — Industry-standard linting rules
- **Prettier formatting** — Consistent code style
- **Type imports** — Always use `import type` for types
- **Small components** — Max 120 lines per file

## Roadmap

### ✅ Implemented
- [x] Authentication (WorkOS + AuthKit)
- [x] Real-time database (Convex)
- [x] Payments & billing (Stripe)
- [x] Transactional email (Resend)
- [x] Dashboard with settings
- [x] Code quality tools (ESLint, Prettier, Knip)
- [x] CI/CD with code review (CodeRabbit, SonarCloud)

### 🚧 In Progress
- [ ] Internationalization (General Translation)
- [ ] Animations (Animate UI)

### 📋 Planned
- [ ] Blog & CMS (Sanity)
- [ ] Analytics (Plausible)
- [ ] Product analytics (PostHog)
- [ ] Customer support (Intercom)
- [ ] Feature requests (Featurebase)
- [ ] About page
- [ ] Contact form
- [ ] Feature sections
- [ ] Pricing page

## Philosophy

Blueprint is built on a simple idea: **AI can build software faster when it starts with clean, well-structured code.**

Every decision in Blueprint — from folder structure to naming conventions — is made with AI assistance in mind. The result is a codebase that's easy for both humans and AI to understand, modify, and extend.

## License

MIT

---

Built with ♥ by [Carefully Built](https://github.com/Carefully-Built)
