# Marmorani - Architecture

## Executive Summary

Marmorani is built as a modern full-stack web application using Next.js 15 with App Router, combining a sophisticated 3D product configurator with standard e-commerce functionality. The architecture prioritizes developer experience for a solo developer, leveraging managed services (Supabase, Vercel, Stripe, Resend) to minimize operational overhead while maintaining production-grade quality.

The core innovation is a real-time 3D marble cube configurator using React Three Fiber, integrated seamlessly with React state management for instant visual feedback as users customize dimensions, marble type, and finish.

## Project Initialization

First implementation story should execute:

```bash
npx create-next-app@latest marmorani --typescript --tailwind --eslint --app --src-dir
```

This establishes the base architecture with:
- Next.js 15 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- ESLint
- `src/` directory structure

Immediately after, add core dependencies:

```bash
# UI Components
npx shadcn@latest init

# 3D Rendering
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three

# Database & Auth
npm install @prisma/client @supabase/supabase-js
npm install -D prisma

# State Management
npm install zustand

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# Internationalization
npm install next-intl

# Payments
npm install stripe @stripe/stripe-js

# Email
npm install resend
npm install -D react-email @react-email/components

# PDF Generation
npm install @react-pdf/renderer

# Utilities
npm install date-fns clsx tailwind-merge
```

## Decision Summary

| Category | Decision | Version | Affects FRs | Rationale |
|----------|----------|---------|-------------|-----------|
| Framework | Next.js | 15.x | All | App Router, Server Components, optimal DX |
| Language | TypeScript | 5.x | All | Type safety, compile-time error detection |
| Styling | Tailwind CSS | 3.x | All | Utility-first, design token support |
| UI Components | shadcn/ui | Latest | All UI | Minimal, accessible, full control |
| 3D Engine | React Three Fiber + Drei | Latest | FR8-18 | React-native 3D, auto state sync |
| Database | Supabase (PostgreSQL) | Latest | All | Managed PostgreSQL + Auth + Storage |
| ORM | Prisma | 5.x | All data | Type-safe queries, migrations, studio |
| Authentication | Supabase Auth | Included | FR2-7 | Integrated with DB, RLS support |
| State Management | Zustand | 4.x | FR8-18 | Lightweight, persist middleware |
| Form Validation | Zod + React Hook Form | Latest | FR9-10, FR23-24 | Type-safe, shadcn compatible |
| Payment | Stripe | Latest | FR25-28 | PCI-DSS compliant, best DX |
| Email | Resend + React Email | Latest | FR27, FR37 | JSX templates, 3k/month free |
| PDF | @react-pdf/renderer | Latest | FR26, FR39 | JSX templates, server-side |
| i18n | next-intl | Latest | All UI | App Router native, type-safe |
| Deployment | Vercel | N/A | All | Native Next.js, zero config |
| Assets (Textures) | Static `/public` | N/A | FR11, FR17 | Simple, CDN via Vercel |

## Project Structure

```
marmorani/
├── .env.local                    # Environment variables (secrets)
├── .env.example                  # Template for other developers
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind + design tokens
├── prisma/
│   ├── schema.prisma             # Database models
│   └── migrations/               # Migration history
├── public/
│   ├── textures/                 # Marble texture maps
│   │   ├── carrara/
│   │   │   ├── diffuse.jpg
│   │   │   ├── normal.jpg
│   │   │   └── roughness.jpg
│   │   ├── nero-marquina/
│   │   ├── calacatta/
│   │   └── ...                   # ~10 marble types
│   └── images/                   # Static images (logo, gallery)
├── src/
│   ├── app/
│   │   └── [locale]/             # i18n routes (en, fr, it, es, de)
│   │       ├── layout.tsx
│   │       ├── page.tsx          # Homepage (hero cube)
│   │       ├── gallery/
│   │       │   └── page.tsx
│   │       ├── marble/
│   │       │   └── [slug]/
│   │       │       └── page.tsx
│   │       ├── configurator/
│   │       │   └── page.tsx      # 3D Configurator
│   │       ├── cart/
│   │       │   └── page.tsx
│   │       ├── checkout/
│   │       │   └── page.tsx
│   │       ├── account/
│   │       │   ├── page.tsx
│   │       │   ├── orders/
│   │       │   │   └── page.tsx
│   │       │   └── settings/
│   │       │       └── page.tsx
│   │       ├── auth/
│   │       │   ├── login/
│   │       │   ├── register/
│   │       │   └── reset-password/
│   │       └── admin/
│   │           ├── layout.tsx    # Protected admin layout
│   │           ├── orders/
│   │           ├── marbles/
│   │           └── gallery/
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── 3d/                   # Three.js components
│   │   │   ├── CubeViewer.tsx
│   │   │   ├── MarbleMaterial.tsx
│   │   │   ├── SceneLighting.tsx
│   │   │   └── Controls.tsx
│   │   ├── configurator/
│   │   │   ├── DimensionInputs.tsx
│   │   │   ├── MarbleSelector.tsx
│   │   │   ├── FinishPicker.tsx
│   │   │   ├── PriceDisplay.tsx
│   │   │   └── ConfigBar.tsx
│   │   ├── cart/
│   │   ├── gallery/
│   │   ├── orders/
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── Navigation.tsx
│   │       └── LocaleSwitcher.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── stripe.ts
│   │   ├── resend.ts
│   │   └── utils.ts
│   ├── stores/
│   │   ├── configStore.ts
│   │   └── cartStore.ts
│   ├── hooks/
│   │   ├── useMarbleTextures.ts
│   │   ├── usePriceCalculation.ts
│   │   └── useWeightCalculation.ts
│   ├── actions/
│   │   ├── orders.ts
│   │   ├── cart.ts
│   │   └── auth.ts
│   ├── emails/
│   │   ├── OrderConfirmation.tsx
│   │   └── OrderStatusUpdate.tsx
│   ├── pdf/
│   │   └── Invoice.tsx
│   ├── messages/
│   │   ├── en.json
│   │   ├── fr.json
│   │   ├── it.json
│   │   ├── es.json
│   │   └── de.json
│   ├── types/
│   │   ├── marble.ts
│   │   ├── order.ts
│   │   └── config.ts
│   └── constants/
│       ├── marbles.ts
│       └── shipping.ts
└── tests/
    ├── unit/
    ├── components/
    └── e2e/
```

## FR Category to Architecture Mapping

| FR Category | Routes | Components | Modules |
|-------------|--------|------------|---------|
| User Account (FR1-7) | `/auth/*`, `/account/*` | `layout/`, auth forms | `lib/supabase/`, `actions/auth.ts` |
| 3D Configurator (FR8-18) | `/configurator` | `3d/`, `configurator/` | `stores/configStore.ts`, `hooks/` |
| Shopping (FR19-28) | `/cart`, `/checkout` | `cart/` | `stores/cartStore.ts`, `actions/orders.ts`, `lib/stripe.ts` |
| Content (FR29-34) | `/gallery`, `/marble/[slug]` | `gallery/` | `messages/`, Prisma queries |
| Order Management (FR35-40) | `/account/orders` | `orders/` | `emails/`, `pdf/`, `actions/orders.ts` |
| Admin (FR41-45) | `/admin/*` | Admin-specific | Protected routes, Prisma |

## Technology Stack Details

### Core Technologies

#### Next.js 15 (App Router)
- Server Components by default for optimal performance
- Server Actions for mutations (no separate API layer needed)
- Streaming and Suspense for loading states
- Dynamic imports for 3D components (`ssr: false`)

#### React Three Fiber + Drei
- Declarative Three.js rendering
- `useTexture` for marble texture loading with Suspense
- `OrbitControls` for camera manipulation
- `Environment` for realistic lighting (studio HDRI)
- `useFrame` for animation loop when needed

#### Supabase
- PostgreSQL database with Row Level Security
- Built-in authentication (email/password)
- Connection via Prisma for type-safe queries
- Auth tokens managed automatically

#### Prisma ORM
- Type-safe database client
- Schema-driven development
- Automatic migrations
- Prisma Studio for data management

### Integration Points

| Service | Integration Method | Webhook/Callback |
|---------|-------------------|------------------|
| Supabase Auth | `@supabase/supabase-js` | Auth state listener |
| Stripe | Stripe SDK + Checkout Session | `/api/webhooks/stripe` |
| Resend | REST API via SDK | N/A |
| Vercel | Git-based deployment | Deploy hooks |

## Implementation Patterns

These patterns ensure consistent implementation across all code:

### Naming Conventions

#### Files and Folders
| Type | Convention | Example |
|------|------------|---------|
| React Components | PascalCase | `MarbleSelector.tsx` |
| Pages/Routes | lowercase | `page.tsx`, `layout.tsx` |
| Hooks | camelCase with `use` | `usePriceCalculation.ts` |
| Stores | camelCase with `Store` | `configStore.ts` |
| Utilities | camelCase | `formatPrice.ts` |
| Types | PascalCase | `Order.ts` |

#### Variables and Functions
| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `marbleType`, `totalPrice` |
| Constants | SCREAMING_SNAKE | `MAX_CUBE_SIZE` |
| Functions | camelCase, verb | `calculatePrice()` |
| Event handlers | handle + Event | `handleSubmit` |

#### Database (Prisma)
| Type | Convention | Example |
|------|------------|---------|
| Tables | PascalCase singular | `Marble`, `Order` |
| Columns | camelCase | `marbleType`, `createdAt` |
| Enums | SCREAMING_SNAKE | `OrderStatus.PENDING` |

### Code Organization

#### Component Pattern
```tsx
interface ComponentProps {
  // Props interface
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks first
  const { t } = useTranslations();
  const store = useStore();
  
  // 2. Derived state
  const computed = useMemo(() => ..., [deps]);
  
  // 3. Event handlers
  const handleClick = () => { ... };
  
  // 4. Render
  return <div>...</div>;
}
```

#### Server Action Pattern
```tsx
'use server';

import { z } from 'zod';

const Schema = z.object({ ... });

export async function action(data: unknown) {
  const parsed = Schema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: { code: 'VALIDATION', message: '...' } };
  }
  
  try {
    const result = await prisma.model.create({ data: parsed.data });
    revalidatePath('/path');
    return { success: true, data: result };
  } catch (e) {
    return { success: false, error: { code: 'FAILED', message: '...' } };
  }
}
```

### Error Handling

#### API Response Format
```typescript
type ActionResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };
```

#### Error Codes
| Code | Meaning |
|------|---------|
| `VALIDATION_ERROR` | Input validation failed |
| `NOT_FOUND` | Resource doesn't exist |
| `UNAUTHORIZED` | Not authenticated |
| `FORBIDDEN` | Not authorized |
| `CONFLICT` | Resource conflict |
| `INTERNAL_ERROR` | Unexpected server error |

### Logging Strategy

```typescript
// Structured logging with pino
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});

logger.info({ orderId, userId }, 'Order created');
logger.error({ error, context }, 'Payment failed');
```

## Data Architecture

### Core Models (Prisma Schema)

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  role          Role      @default(CUSTOMER)
  addresses     Address[]
  orders        Order[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Address {
  id            String   @id @default(uuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  label         String?
  street        String
  city          String
  postalCode    String
  country       String
  isDefault     Boolean  @default(false)
  createdAt     DateTime @default(now())
}

model Marble {
  id            String      @id @default(uuid())
  slug          String      @unique
  name          Json        // { en: "Carrara", fr: "Carrare", ... }
  description   Json        // Multilingual
  density       Float       // kg/m³
  basePricePerCm3  Int      // cents
  origin        String
  available     Boolean     @default(true)
  textureFolder String      // e.g., "carrara"
  finishes      MarbleFinish[]
  orderItems    OrderItem[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model MarbleFinish {
  id            String   @id @default(uuid())
  marbleId      String
  marble        Marble   @relation(fields: [marbleId], references: [id])
  type          FinishType
  priceModifier Float    @default(1.0) // multiplier
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
  locale          String      // Order language for emails/invoice
  stripePaymentId String?
  paidAt          DateTime?
  shippedAt       DateTime?
  deliveredAt     DateTime?
  trackingNumber  String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model OrderItem {
  id          String   @id @default(uuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id])
  marbleId    String
  marble      Marble   @relation(fields: [marbleId], references: [id])
  width       Int      // cm
  height      Int      // cm
  depth       Int      // cm
  finish      FinishType
  weight      Float    // kg (calculated)
  unitPrice   Int      // cents
  quantity    Int      @default(1)
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

## API Contracts

### Server Actions (Primary API)

All mutations use Next.js Server Actions. No REST API layer needed.

```typescript
// Order Creation
createOrder(data: {
  items: Array<{
    marbleId: string;
    width: number;
    height: number;
    depth: number;
    finish: FinishType;
    quantity: number;
  }>;
  shippingAddressId: string;
  locale: string;
}) => ActionResponse<{ order: Order; checkoutUrl: string }>

// Cart Operations
addToCart(item: CartItem) => ActionResponse<{ cart: Cart }>
removeFromCart(itemId: string) => ActionResponse<{ cart: Cart }>
updateQuantity(itemId: string, quantity: number) => ActionResponse<{ cart: Cart }>
```

### Stripe Webhook Events

| Event | Handler Action |
|-------|---------------|
| `checkout.session.completed` | Update order to PAID, send confirmation email |
| `payment_intent.payment_failed` | Log failure, notify admin |

## Security Architecture

### Authentication
- Supabase Auth handles all auth flows
- JWT tokens stored in httpOnly cookies
- Automatic token refresh
- Row Level Security (RLS) on database

### Authorization
| Role | Permissions |
|------|------------|
| Anonymous | Browse, configure, add to cart |
| Customer | + Checkout, view orders, manage profile |
| Admin | + Manage orders, marbles, gallery |

### Data Protection
- All traffic over HTTPS (Vercel auto-SSL)
- No card data stored (Stripe handles PCI-DSS)
- Passwords hashed via Supabase (bcrypt)
- Environment variables for all secrets

### Input Validation
- Zod schemas on all Server Actions
- Prisma parameterized queries (SQL injection prevention)
- Next.js CSRF protection built-in

## Performance Considerations

### 3D Performance (NFR1-6)
- Texture compression (WebP/AVIF for previews, JPG for 3D)
- Progressive texture loading (low-res → high-res)
- Geometry instancing for multiple cubes
- `requestAnimationFrame` throttling on idle
- Dynamic import with `ssr: false` for 3D components

### Page Performance (NFR5)
- Server Components (zero JS for static content)
- Streaming with Suspense
- Image optimization via `next/image`
- Edge caching via Vercel CDN

### Database Performance
- Prisma connection pooling
- Strategic indexes on frequently queried fields
- Pagination for lists

## Deployment Architecture

### Vercel Deployment
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

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Stripe
STRIPE_SECRET_KEY="sk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Resend
RESEND_API_KEY="re_..."

# App
NEXT_PUBLIC_APP_URL="https://marmorani.com"
```

## Development Environment

### Prerequisites
- Node.js 20+
- npm or pnpm
- Git
- Supabase CLI (optional, for local dev)

### Setup Commands
```bash
# Clone and install
git clone <repo>
cd marmorani
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your keys

# Setup database
npx prisma generate
npx prisma db push

# Run development
npm run dev
```

### Development Scripts
```json
{
  "dev": "next dev --turbo",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "db:push": "prisma db push",
  "db:studio": "prisma studio",
  "db:generate": "prisma generate",
  "test": "vitest",
  "test:e2e": "playwright test"
}
```

## Architecture Decision Records (ADRs)

### ADR-001: React Three Fiber over vanilla Three.js
**Context:** Need 3D rendering with frequent React state updates.
**Decision:** Use React Three Fiber + Drei.
**Rationale:** Native React integration, automatic state sync, cleaner code for solo developer.

### ADR-002: Supabase over separate DB + Auth
**Context:** Need database and authentication with minimal DevOps.
**Decision:** Use Supabase as all-in-one backend.
**Rationale:** Managed PostgreSQL + Auth + Storage in one service, generous free tier, excellent DX.

### ADR-003: Prisma with Supabase
**Context:** Need type-safe database queries.
**Decision:** Use Prisma ORM connected to Supabase PostgreSQL.
**Rationale:** Best TypeScript integration, migrations, works perfectly with Supabase.

### ADR-004: next-intl for i18n
**Context:** Need 5-language support with App Router.
**Decision:** Use next-intl.
**Rationale:** Designed for App Router, type-safe, automatic fallbacks.

### ADR-005: Server Actions over API Routes
**Context:** Need backend logic for mutations.
**Decision:** Use Server Actions exclusively, no API routes.
**Rationale:** Simpler mental model, automatic revalidation, type-safe end-to-end.

### ADR-006: Static textures over CDN storage
**Context:** Need to serve ~60MB of marble textures.
**Decision:** Store in `/public/textures/` for MVP.
**Rationale:** Simplest solution, Vercel CDN serves automatically, migrate later if catalog grows.

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: 2025-12-04_
_For: Sacha_

