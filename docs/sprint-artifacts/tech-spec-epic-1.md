# Epic Technical Specification: Foundation & Project Setup

Date: 2025-12-04
Author: Sacha
Epic ID: 1
Status: Draft

---

## Overview

Epic 1 establishes the complete technical infrastructure required for Marmorani—a custom marble cube e-commerce platform with 3D visualization. This foundation epic creates the development environment, database schema, design system, internationalization layer, and deployment pipeline that all subsequent features will build upon.

This is a **greenfield exception** epic: while it doesn't deliver direct user value, it enables all user-facing features in Epics 2-7. The 5 stories follow a strict dependency chain, each building on the previous.

**Key Deliverables:**
- Next.js 15 App Router project with TypeScript strict mode
- Complete Prisma schema with Supabase PostgreSQL
- shadcn/ui design system implementing "Luxe Minimaliste Moderne" aesthetic
- 5-language i18n support (en, fr, it, es, de)
- Vercel deployment with all environment variables configured

## Objectives and Scope

### In Scope

- **Project Scaffolding**: Next.js 15 App Router + TypeScript + Tailwind CSS + ESLint
- **Core Dependencies**: All libraries per Architecture doc (React Three Fiber, Prisma, Supabase, Zustand, Stripe, Resend, etc.)
- **Database Schema**: Complete data model for Users, Marbles, Orders, Gallery
- **Design System**: Carrara Pure + Nero Marquina themes, typography, spacing tokens
- **Base Layout**: Header, Footer, LocaleSwitcher components
- **Internationalization**: 5 locales with next-intl routing
- **Deployment**: Vercel CI/CD with all environment variables

### Out of Scope

- 3D configurator implementation (Epic 3)
- Marble data seeding (Epic 2, Story 2.1)
- Authentication flows (Epic 4)
- Any user-facing features

### Success Criteria

- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes successfully
- [ ] Database schema deployed to Supabase
- [ ] All design tokens match UX spec exactly
- [ ] 5 locales routing functional (`/en/`, `/fr/`, `/it/`, `/es/`, `/de/`)
- [ ] Production URL accessible on Vercel

## System Architecture Alignment

This epic implements the foundation layer of the architecture:

```
┌─────────────────────────────────────────────────────┐
│                    Vercel Edge                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   CDN/Edge  │  │  Serverless │  │   Static    │ │
│  │   Caching   │  │  Functions  │  │   Assets    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘
           │                 │                │
           ▼                 ▼                ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │  Supabase   │   │   Stripe    │   │   Resend    │
    │ (PostgreSQL)│   │  (Payments) │   │  (Email)    │
    └─────────────┘   └─────────────┘   └─────────────┘
```

**Architecture Constraints Applied:**
- Next.js 15 App Router with Server Components by default
- TypeScript strict mode enabled
- Prisma ORM for type-safe database access
- Supabase for managed PostgreSQL + Auth
- shadcn/ui components copied to codebase (full control)
- Environment variables for all secrets (never committed)

**ADRs Referenced:**
- ADR-002: Supabase over separate DB + Auth
- ADR-003: Prisma with Supabase
- ADR-004: next-intl for i18n
- ADR-005: Server Actions over API Routes

## Detailed Design

### Services and Modules

| Module | Location | Responsibility | Dependencies |
|--------|----------|----------------|--------------|
| **Prisma Client** | `src/lib/prisma.ts` | Database singleton, connection pooling | `@prisma/client` |
| **Supabase Client** | `src/lib/supabase/client.ts` | Browser-side Supabase client | `@supabase/supabase-js` |
| **Supabase Server** | `src/lib/supabase/server.ts` | Server-side auth checks | `@supabase/supabase-js` |
| **Theme Provider** | `src/app/[locale]/layout.tsx` | CSS variables, font loading | `next/font` |
| **i18n Middleware** | `src/middleware.ts` | Locale detection, routing | `next-intl` |

### Data Models and Contracts

Complete Prisma schema as specified in Architecture:

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id        String    @id @default(uuid())
  email     String    @unique
  name      String?
  role      Role      @default(CUSTOMER)
  addresses Address[]
  orders    Order[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Address {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  label      String?
  street     String
  city       String
  postalCode String
  country    String
  isDefault  Boolean  @default(false)
  createdAt  DateTime @default(now())
}

model Marble {
  id              String         @id @default(uuid())
  slug            String         @unique
  name            Json           // { en: "Carrara", fr: "Carrare", ... }
  description     Json           // Multilingual
  density         Float          // kg/m³
  basePricePerCm3 Int            // cents
  origin          String
  available       Boolean        @default(true)
  textureFolder   String
  finishes        MarbleFinish[]
  orderItems      OrderItem[]
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

model MarbleFinish {
  id            String     @id @default(uuid())
  marbleId      String
  marble        Marble     @relation(fields: [marbleId], references: [id])
  type          FinishType
  priceModifier Float      @default(1.0)
}

model Order {
  id              String      @id @default(uuid())
  userId          String
  user            User        @relation(fields: [userId], references: [id])
  status          OrderStatus @default(PENDING)
  items           OrderItem[]
  shippingAddress Json
  subtotal        Int         // cents
  shippingCost    Int         // cents
  total           Int         // cents
  locale          String
  stripePaymentId String?
  paidAt          DateTime?
  shippedAt       DateTime?
  deliveredAt     DateTime?
  trackingNumber  String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model OrderItem {
  id        String     @id @default(uuid())
  orderId   String
  order     Order      @relation(fields: [orderId], references: [id])
  marbleId  String
  marble    Marble     @relation(fields: [marbleId], references: [id])
  width     Int        // cm
  height    Int        // cm
  depth     Int        // cm
  finish    FinishType
  weight    Float      // kg
  unitPrice Int        // cents
  quantity  Int        @default(1)
}

model GalleryItem {
  id          String   @id @default(uuid())
  marbleId    String?
  title       Json     // Multilingual
  description Json     // Multilingual
  imageUrl    String
  useCase     String?
  featured    Boolean  @default(false)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
}

enum Role {
  CUSTOMER
  ADMIN
}

enum OrderStatus {
  PENDING
  PAID
  IN_PRODUCTION
  SHIPPED
  DELIVERED
  CANCELLED
}

enum FinishType {
  POLISHED
  HONED
  RAW
  BRUSHED
}
```

### APIs and Interfaces

Epic 1 establishes no API endpoints—only infrastructure. Future epics will use:

| Pattern | Usage | Example |
|---------|-------|---------|
| **Server Actions** | All mutations | `createOrder()`, `addToCart()` |
| **Server Components** | Data fetching | `page.tsx` with Prisma queries |
| **Route Handlers** | Webhooks only | `/api/webhooks/stripe` |

**Action Response Contract:**

```typescript
type ActionResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };
```

### Workflows and Sequencing

**Story Dependency Chain:**

```
Story 1.1: Project Initialization
    ↓
Story 1.2: Database Schema ──→ Story 1.3: Design System
    ↓                              ↓
Story 1.4: i18n Setup ←────────────┘
    ↓
Story 1.5: Deployment Pipeline
```

**Initialization Sequence:**

1. **Developer runs** `npx create-next-app@latest marmorani --typescript --tailwind --eslint --app --src-dir`
2. **Install dependencies** per Architecture doc
3. **Configure** `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`
4. **Create** `.env.example` with all required keys
5. **Initialize** Prisma with `npx prisma init`
6. **Define** schema.prisma with all models
7. **Push** schema to Supabase `npx prisma db push`
8. **Initialize** shadcn/ui with `npx shadcn@latest init`
9. **Configure** design tokens in Tailwind config
10. **Create** base layout components
11. **Set up** next-intl middleware and message files
12. **Deploy** to Vercel with environment variables

## Non-Functional Requirements

### Performance

| NFR | Target | Epic 1 Implementation |
|-----|--------|----------------------|
| NFR5 | Page load < 2s | Server Components, next/font, Turbopack |
| - | Build time | Turbopack development, incremental builds |
| - | Cold start | Vercel serverless optimization |

**Design Decisions:**
- Use `next/font` for zero layout shift font loading
- Configure `next.config.ts` for image optimization
- Enable Turbopack for development (`next dev --turbo`)

### Security

| NFR | Target | Epic 1 Implementation |
|-----|--------|----------------------|
| NFR7 | HTTPS only | Vercel auto-SSL |
| NFR9 | Password hashing | Supabase Auth (bcrypt) |
| - | Secrets management | Environment variables only |

**Environment Variables (All Required):**

```bash
# Database (Supabase)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Stripe (for later epics)
STRIPE_SECRET_KEY="sk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend (for later epics)
RESEND_API_KEY="re_..."

# App
NEXT_PUBLIC_APP_URL="https://marmorani.com"
```

### Reliability/Availability

| NFR | Target | Epic 1 Implementation |
|-----|--------|----------------------|
| NFR22 | 99.5% uptime | Vercel managed infrastructure |
| NFR24 | Data persistence | Supabase automatic backups |

### Observability

| Signal | Implementation |
|--------|----------------|
| **Error Logging** | Console.error → Vercel logs |
| **Build Logs** | Vercel deployment logs |
| **Database** | Supabase Dashboard |

**Future Enhancement (not in Epic 1):** Add structured logging with pino.

## Dependencies and Integrations

### NPM Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 15.x | Framework |
| `react`, `react-dom` | 19.x | UI Library |
| `typescript` | 5.x | Type safety |
| `tailwindcss` | 3.x | Styling |
| `@prisma/client` | 5.x | Database ORM |
| `prisma` | 5.x | Schema & migrations |
| `@supabase/supabase-js` | Latest | Auth & realtime |
| `next-intl` | Latest | i18n |
| `zustand` | 4.x | State management |
| `react-hook-form` | Latest | Form handling |
| `@hookform/resolvers` | Latest | Zod integration |
| `zod` | Latest | Validation |
| `three` | Latest | 3D engine |
| `@react-three/fiber` | Latest | React Three.js |
| `@react-three/drei` | Latest | Three.js helpers |
| `stripe` | Latest | Payment backend |
| `@stripe/stripe-js` | Latest | Payment frontend |
| `resend` | Latest | Email API |
| `react-email` | Latest | Email templates |
| `@react-email/components` | Latest | Email components |
| `@react-pdf/renderer` | Latest | PDF generation |
| `date-fns` | Latest | Date utilities |
| `clsx` | Latest | Class names |
| `tailwind-merge` | Latest | Tailwind utilities |

### External Services

| Service | Purpose | Setup Required |
|---------|---------|----------------|
| **Supabase** | PostgreSQL + Auth + Storage | Create project, get connection strings |
| **Vercel** | Hosting + CDN + Serverless | Connect GitHub repo |
| **Stripe** | Payments (future) | Create account, get API keys |
| **Resend** | Email (future) | Create account, get API key |

## Acceptance Criteria (Authoritative)

### Story 1.1: Project Initialization

- [ ] AC1.1.1: Next.js 15 App Router project created with `src/` structure
- [ ] AC1.1.2: TypeScript strict mode enabled in `tsconfig.json`
- [ ] AC1.1.3: Tailwind CSS configured with custom design tokens
- [ ] AC1.1.4: ESLint configured and passing
- [ ] AC1.1.5: All core dependencies installed per Architecture doc
- [ ] AC1.1.6: shadcn/ui initialized with default configuration
- [ ] AC1.1.7: `.env.example` created with all required keys documented
- [ ] AC1.1.8: Path aliases configured (`@/components`, `@/lib`, etc.)
- [ ] AC1.1.9: `npm run dev` starts without errors

### Story 1.2: Database Schema

- [ ] AC1.2.1: Prisma initialized with Supabase PostgreSQL
- [ ] AC1.2.2: All models defined per Architecture schema (User, Address, Marble, MarbleFinish, Order, OrderItem, GalleryItem)
- [ ] AC1.2.3: All enums defined (Role, OrderStatus, FinishType)
- [ ] AC1.2.4: `prisma generate` runs successfully
- [ ] AC1.2.5: `prisma db push` applies schema to Supabase
- [ ] AC1.2.6: `src/lib/prisma.ts` singleton created
- [ ] AC1.2.7: Prisma client properly typed

### Story 1.3: Design System

- [ ] AC1.3.1: Carrara Pure theme colors defined in Tailwind config
- [ ] AC1.3.2: Nero Marquina theme colors defined in Tailwind config
- [ ] AC1.3.3: Semantic colors defined for both modes
- [ ] AC1.3.4: Cormorant Garamond, Inter, JetBrains Mono fonts loaded via `next/font`
- [ ] AC1.3.5: Spacing scale (xs:4px to 3xl:64px) configured
- [ ] AC1.3.6: CSS variables defined for runtime theme switching
- [ ] AC1.3.7: `RootLayout` with font loading and theme provider created
- [ ] AC1.3.8: `Header` component (minimal, hamburger on mobile) created
- [ ] AC1.3.9: `Footer` component created
- [ ] AC1.3.10: `LocaleSwitcher` component created

### Story 1.4: Internationalization

- [ ] AC1.4.1: next-intl installed and configured
- [ ] AC1.4.2: 5 locales supported: en (default), fr, it, es, de
- [ ] AC1.4.3: Locale routing via `/[locale]/` URL prefix working
- [ ] AC1.4.4: Language switcher accessible from header
- [ ] AC1.4.5: Message files structure exists for all locales (`src/messages/{locale}.json`)
- [ ] AC1.4.6: Middleware detects browser locale
- [ ] AC1.4.7: `useTranslations()` hook works in components

### Story 1.5: Deployment

- [ ] AC1.5.1: GitHub repo connected to Vercel
- [ ] AC1.5.2: All environment variables configured in Vercel
- [ ] AC1.5.3: Preview deployments work for PRs
- [ ] AC1.5.4: `prisma generate` runs in build (`postinstall` script)
- [ ] AC1.5.5: Production URL accessible and serves base layout
- [ ] AC1.5.6: Build completes without errors

## Traceability Mapping

| AC | Spec Section | Component/File | Test Idea |
|----|--------------|----------------|-----------|
| AC1.1.1 | Project Structure | `src/app/` | Directory exists, page.tsx present |
| AC1.1.2 | Implementation Patterns | `tsconfig.json` | `strict: true` verified |
| AC1.1.5 | Decision Summary | `package.json` | All deps listed, versions correct |
| AC1.2.1-7 | Data Architecture | `prisma/schema.prisma` | `prisma validate` passes |
| AC1.3.1-6 | Visual Foundation (UX) | `tailwind.config.ts` | Color tokens match UX spec |
| AC1.3.7-10 | Project Structure | `src/components/layout/` | Components render without error |
| AC1.4.1-7 | i18n Decision | `src/middleware.ts`, `src/messages/` | Route /fr/ serves French content |
| AC1.5.1-6 | Deployment Architecture | Vercel Dashboard | Production URL loads |

## Risks, Assumptions, Open Questions

### Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **R1**: Supabase connection issues | High | Low | Test locally with Supabase CLI first |
| **R2**: Font loading performance | Medium | Medium | Use `next/font` with `display: swap` |
| **R3**: Prisma cold start latency | Medium | Medium | Use connection pooling, warm functions |

### Assumptions

| ID | Assumption | Validation |
|----|------------|------------|
| **A1** | Supabase free tier sufficient for MVP | Monitor usage, upgrade if needed |
| **A2** | Vercel Hobby plan adequate | ~10 team members, limited builds |
| **A3** | Developer has Node.js 20+ installed | Document in README |

### Open Questions

| ID | Question | Owner | Due |
|----|----------|-------|-----|
| **Q1** | Exact Supabase project region? | Sacha | Before Story 1.2 |
| **Q2** | Custom domain for production? | Sacha | Before Story 1.5 |
| **Q3** | Vercel team or personal account? | Sacha | Before Story 1.5 |

## Test Strategy Summary

### Unit Tests (Future - Not in Epic 1)

- Utility functions in `src/lib/`
- Price/weight calculation hooks

### Integration Tests

| Test | Tool | Scope |
|------|------|-------|
| Database connection | Prisma | `prisma db push` succeeds |
| Build | Next.js | `npm run build` passes |
| Type check | TypeScript | `npx tsc --noEmit` passes |

### Manual Verification Checklist

- [ ] `npm run dev` starts on localhost:3000
- [ ] Navigate to `/en/`, `/fr/`, `/it/`, `/es/`, `/de/` - all work
- [ ] Language switcher changes URL and content
- [ ] Header and Footer render correctly
- [ ] Mobile: hamburger menu works
- [ ] Vercel preview deployment loads
- [ ] Production deployment loads

---

_Generated by BMAD Sprint Planning Workflow_
_Epic 1 of 7 - Foundation & Project Setup_

