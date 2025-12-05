# Marmorani - Epic Breakdown

**Author:** Sacha
**Date:** 2025-12-04
**Project Level:** MVP
**Target Scale:** E-commerce platform with 3D configurator

---

## Overview

This document provides the complete epic and story breakdown for Marmorani, decomposing the requirements from the [PRD](./prd.md) into implementable stories.

**Context Documents Incorporated:**
- ✅ PRD (45 Functional Requirements, 28 Non-Functional Requirements)
- ✅ UX Design Specification (Interaction patterns, Design System, User Journeys)
- ✅ Architecture (Next.js 15, React Three Fiber, Supabase, Prisma, Stripe)

### Epic Summary

| Epic | Title | Stories | FRs Covered | User Value |
|------|-------|---------|-------------|------------|
| 1 | Foundation & Project Setup | 5 | Infrastructure | Technical base for all features |
| 2 | Marble Catalog & Discovery | 6 | FR29-34 | Users can explore marbles and get inspired |
| 3 | 3D Configurator Core | 8 | FR8-18 | Users can create and visualize their cube in 3D |
| 4 | User Authentication & Profile | 6 | FR1-7 | Users can create accounts and manage profiles |
| 5 | Shopping Cart & Checkout | 8 | FR19-28 | Users can purchase their configured cube |
| 6 | Order Management | 5 | FR35-40 | Users can track their orders |
| 7 | Admin Dashboard | 5 | FR41-45 | Admins can manage catalog and orders |

---

## Functional Requirements Inventory

### User Account & Access
- FR1: Visitors can browse platform, explore gallery, use 3D configurator without account
- FR2: Users can create accounts using email registration
- FR3: Users can log in securely and maintain sessions across devices
- FR4: Users can reset passwords via email verification
- FR5: Users can update their profile information (name, contact details)
- FR6: Users can manage saved delivery addresses
- FR7: Users can view their complete order history

### 3D Configurator
- FR8: Users can access the 3D configurator from homepage or gallery
- FR9: Users can set cube dimensions (H, W, D) with real-time 3D updates
- FR10: System validates dimensions against manufacturing constraints (min/max)
- FR11: Users can select marble type from catalog with immediate texture change
- FR12: Users can select finish option (polished, honed, raw, etc.) with visual preview
- FR13: System auto-calculates and displays weight based on dimensions + density
- FR14: System auto-calculates and displays price based on config
- FR15: Users can rotate 3D cube view freely (360° H & V)
- FR16: Users can zoom in/out on 3D visualization
- FR17: 3D renders photo-realistic marble textures with accurate veining
- FR18: All configurator changes update 3D view in real-time (< 500ms)

### Shopping & Checkout
- FR19: Users can add configured cubes to shopping cart
- FR20: Users can view and modify cart contents (quantities, remove)
- FR21: Users can save cart and return later (if logged in)
- FR22: System displays order subtotal, shipping estimate, and total
- FR23: Users can enter/select delivery address with international support
- FR24: System validates delivery addresses for supported shipping regions
- FR25: Users can complete secure payment via integrated gateway
- FR26: System generates invoice automatically upon successful payment
- FR27: Users receive order confirmation email with invoice attachment
- FR28: System displays estimated delivery date (4 weeks from order)

### Content & Discovery
- FR29: Users can browse inspiration gallery with curated cube examples
- FR30: Users can filter gallery by marble type, finish, or use case
- FR31: Users can view detailed product pages for each marble type
- FR32: Product pages display marble specifications (origin, characteristics)
- FR33: Product pages show high-quality imagery of marble texture + samples
- FR34: Users can navigate from gallery item to configurator with marble pre-selected

### Order Management
- FR35: Users can access order dashboard showing all orders and statuses
- FR36: System displays order status (pending, in production, shipped, delivered)
- FR37: Users receive email notifications when order status changes
- FR38: Users can view order details (config, pricing, delivery info)
- FR39: Users can download invoices for any completed order
- FR40: Users can track shipment via provided tracking information

### Admin
- FR41: Administrators can add, edit, or remove marble types from catalog
- FR42: Administrators can update marble pricing and availability
- FR43: Administrators can manage inspiration gallery content
- FR44: Administrators can view and manage orders (status updates, notes)
- FR45: Administrators can access order reports and basic analytics

---

## FR Coverage Map

| Epic | FRs Covered |
|------|-------------|
| Epic 1 (Foundation) | Infrastructure for all FRs |
| Epic 2 (Catalog & Discovery) | FR29, FR30, FR31, FR32, FR33, FR34 |
| Epic 3 (3D Configurator) | FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18 |
| Epic 4 (Authentication) | FR1, FR2, FR3, FR4, FR5, FR6, FR7 |
| Epic 5 (Cart & Checkout) | FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR28 |
| Epic 6 (Order Management) | FR35, FR36, FR37, FR38, FR39, FR40 |
| Epic 7 (Admin) | FR41, FR42, FR43, FR44, FR45 |

---

## Epic 1: Foundation & Project Setup

**Goal:** Establish the technical infrastructure that will support all Marmorani features—project scaffolding, database schema, design system, and deployment pipeline.

**User Value:** Foundation epic (greenfield exception) — enables all subsequent user-facing features.

---

### Story 1.1: Project Initialization & Core Dependencies

As a **developer**,
I want **the Next.js 15 project scaffolded with all core dependencies installed**,
So that **I have a consistent, configured development environment to build upon**.

**Acceptance Criteria:**

**Given** no existing project structure
**When** the initialization script is run
**Then** a Next.js 15 App Router project is created with:
- TypeScript strict mode enabled
- Tailwind CSS configured
- ESLint configured
- `src/` directory structure
- All core dependencies installed (see list below)

**And** the following dependencies are installed and configured:
- shadcn/ui initialized with default configuration
- React Three Fiber + Drei for 3D rendering
- Prisma ORM
- Supabase client libraries
- Zustand for state management
- React Hook Form + Zod for validation
- next-intl for i18n
- Stripe libraries
- Resend + React Email
- @react-pdf/renderer

**And** environment variable template (.env.example) is created with all required keys documented

**Prerequisites:** None (first story)

**Technical Notes:**
- Execute: `npx create-next-app@latest marmorani --typescript --tailwind --eslint --app --src-dir`
- Follow Architecture doc section "Project Initialization" for exact dependency list
- Configure `next.config.ts` for image optimization and i18n
- Set up path aliases in `tsconfig.json` (@/components, @/lib, etc.)

---

### Story 1.2: Database Schema & Prisma Setup

As a **developer**,
I want **the complete database schema defined in Prisma**,
So that **all data models are ready for the application features**.

**Acceptance Criteria:**

**Given** Prisma is installed
**When** the schema is defined and migrated
**Then** the following models exist in the database:
- `User` (id, email, name, role, addresses, orders, timestamps)
- `Address` (id, userId, label, street, city, postalCode, country, isDefault)
- `Marble` (id, slug, name[JSON], description[JSON], density, basePricePerCm3, origin, available, textureFolder, finishes)
- `MarbleFinish` (id, marbleId, type, priceModifier)
- `Order` (id, userId, status, items, shippingAddress, subtotal, shippingCost, total, locale, stripePaymentId, timestamps)
- `OrderItem` (id, orderId, marbleId, dimensions, finish, weight, unitPrice, quantity)
- `GalleryItem` (id, marbleId, title[JSON], description[JSON], imageUrl, useCase, featured, order)

**And** enums are defined:
- `Role`: CUSTOMER, ADMIN
- `OrderStatus`: PENDING, PAID, IN_PRODUCTION, SHIPPED, DELIVERED, CANCELLED
- `FinishType`: POLISHED, HONED, RAW, BRUSHED

**And** `prisma generate` runs successfully
**And** Prisma client is properly typed

**Prerequisites:** Story 1.1

**Technical Notes:**
- Follow exact schema from Architecture doc "Data Architecture" section
- Use JSON fields for multilingual content (name, description)
- Configure connection pooling for Supabase
- Create `src/lib/prisma.ts` singleton for client instance

---

### Story 1.3: Design System & Layout Foundation

As a **developer**,
I want **the design system configured with Marmorani's visual identity**,
So that **all UI components follow the "Luxe Minimaliste Moderne" aesthetic**.

**Acceptance Criteria:**

**Given** shadcn/ui is initialized
**When** the design tokens are configured
**Then** Tailwind config includes:
- Carrara Pure theme colors (bg: #FFFFFF, surface: #F8F8F8, border: #E5E5E5, text: #1A1A1A/#4A4A4A)
- Nero Marquina theme colors (bg: #0D0D0D, surface: #1A1A1A, accent: #C9A962)
- Semantic colors (success, warning, error, info) for both modes
- Typography: Cormorant Garamond (display), Inter (body), JetBrains Mono (mono)
- Spacing scale (xs:4px to 3xl:64px)

**And** base layout components exist:
- `RootLayout` with font loading and theme provider
- `Header` component (minimal top bar, charcoal text, hamburger on mobile)
- `Footer` component
- `LocaleSwitcher` component

**And** CSS variables are defined for runtime theme switching (light ↔ dark configurator)

**Prerequisites:** Story 1.1

**Technical Notes:**
- Reference UX spec section 3 (Visual Foundation) for exact values
- Import Google Fonts: Cormorant Garamond, Inter, JetBrains Mono
- Configure `next/font` for optimal loading
- Use CSS custom properties pattern from UX spec section 9.3
- Desktop: horizontal nav | Mobile: hamburger → fullscreen overlay

---

### Story 1.4: Internationalization Setup

As a **user**,
I want **the platform available in multiple languages**,
So that **I can browse and purchase in my preferred language**.

**Acceptance Criteria:**

**Given** next-intl is installed
**When** I visit the site
**Then** content is displayed in my browser's preferred language (if supported)

**And** the following locales are supported:
- English (en) - default
- French (fr)
- Italian (it)
- Spanish (es)
- German (de)

**And** locale routing works via `/[locale]/` URL prefix
**And** a language switcher is accessible from the header
**And** message files structure exists for all supported locales

**Prerequisites:** Story 1.3

**Technical Notes:**
- Configure `src/app/[locale]/layout.tsx` as locale root
- Create message files in `src/messages/{locale}.json`
- Set up `next-intl` middleware for automatic locale detection
- Use `useTranslations()` hook pattern throughout
- LocaleSwitcher shows language names in their native form (Français, Italiano, etc.)

---

### Story 1.5: Deployment Pipeline & Environment Configuration

As a **developer**,
I want **the project deployed to Vercel with proper environment configuration**,
So that **changes are automatically deployed and the production environment is ready**.

**Acceptance Criteria:**

**Given** the project is connected to a Git repository
**When** code is pushed to the main branch
**Then** Vercel automatically builds and deploys the application

**And** environment variables are configured in Vercel:
- DATABASE_URL and DIRECT_URL (Supabase PostgreSQL)
- NEXT_PUBLIC_SUPABASE_URL and keys
- STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- RESEND_API_KEY
- NEXT_PUBLIC_APP_URL

**And** preview deployments work for pull requests
**And** the production URL is accessible and serves the base layout

**Prerequisites:** Story 1.4

**Technical Notes:**
- Connect GitHub repo to Vercel project
- Configure environment variables in Vercel dashboard (not committed to repo)
- Set up Supabase project and obtain connection strings
- Verify Prisma migrations run on deploy (`prisma generate` in build script)
- Add `postinstall` script for Prisma generate

---

## Epic 2: Marble Catalog & Discovery

**Goal:** Enable users to explore the marble collection and get inspired before configuring their cube. This is the "Inspiration First" journey from the UX spec.

**User Value:** Users can browse beautiful marble types, learn about each variety, and find the perfect marble for their custom cube.

**FRs Covered:** FR29, FR30, FR31, FR32, FR33, FR34

---

### Story 2.1: Marble Data Seeding & Constants

As a **developer**,
I want **the initial marble catalog data seeded in the database**,
So that **the gallery and configurator have real marble data to display**.

**Acceptance Criteria:**

**Given** the Prisma schema is deployed
**When** the seed script runs
**Then** approximately 10 marble types are created with:
- Multilingual names (en, fr, it, es, de)
- Multilingual descriptions with origin story and characteristics
- Accurate density values (kg/m³) for weight calculation
- Base price per cm³ (in cents)
- Texture folder reference matching `/public/textures/{slug}/`
- Available finishes with price modifiers

**And** example marbles include:
- Carrara White (Italy) - classic white with gray veining
- Nero Marquina (Spain) - black with white veining
- Calacatta Gold (Italy) - white with golden veining
- Emperador Dark (Spain) - brown tones
- Statuario (Italy) - dramatic veining
- Verde Guatemala (Guatemala) - green marble
- Rosa Portogallo (Portugal) - pink tones
- Sahara Noir (Tunisia) - black with beige
- Bianco Sivec (North Macedonia) - pure white
- Travertino Romano (Italy) - classic travertine

**And** constants file defines manufacturing constraints:
- MIN_DIMENSION: 5 cm
- MAX_DIMENSION: 100 cm
- STANDARD_FINISHES: polished, honed, raw, brushed

**Prerequisites:** Story 1.2

**Technical Notes:**
- Create `prisma/seed.ts` with marble data
- Create `src/constants/marbles.ts` for frontend constants
- Density values: ~2700 kg/m³ for most marbles (adjust per type)
- Price structure: base price × volume × finish modifier
- Add seed script to package.json: `"db:seed": "prisma db seed"`

---

### Story 2.2: Marble Texture Assets

As a **user**,
I want **to see realistic marble textures throughout the platform**,
So that **I can appreciate each marble's unique characteristics**.

**Acceptance Criteria:**

**Given** a marble type exists in the database
**When** it's displayed anywhere on the platform
**Then** high-quality texture images are available from `/public/textures/{slug}/`:
- `diffuse.jpg` - base color/pattern (2K resolution minimum)
- `normal.jpg` - surface detail for 3D lighting
- `roughness.jpg` - finish variation map

**And** optimized preview thumbnails exist:
- `preview.jpg` - 400x400px for gallery cards
- `hero.jpg` - 1200x800px for detail pages

**And** images use appropriate compression (WebP where supported, JPEG fallback)

**Prerequisites:** Story 2.1

**Technical Notes:**
- Store in `/public/textures/{marble-slug}/` per Architecture spec
- Use `next/image` for automatic optimization
- Total texture budget: ~60MB for 10 marbles (per ADR-006)
- Ensure seamless tiling for 3D texture mapping
- Consider lazy loading for gallery performance

---

### Story 2.3: Inspiration Gallery Page

As a **user**,
I want **to browse an inspiration gallery showcasing marble cubes**,
So that **I can discover possibilities and find marbles that appeal to me**.

**Acceptance Criteria:**

**Given** I navigate to the gallery page (`/[locale]/gallery`)
**When** the page loads
**Then** I see a grid of curated marble examples displaying:
- High-quality lifestyle imagery showing cubes in real settings
- Marble type name on hover
- "From X €" starting price indicator
- Use case category (coffee table, side table, decorative column)

**And** the grid is responsive:
- Desktop: 3-column grid
- Mobile: 2-column grid

**And** featured items are visually distinguished (larger cards or special placement)
**And** smooth hover animations reveal marble name and price (per UX spec)
**And** clicking any item navigates to marble detail page

**Prerequisites:** Story 2.2, Story 1.3

**Technical Notes:**
- Route: `src/app/[locale]/gallery/page.tsx`
- Use `GalleryItem` model data
- Implement MarbleCard component with hover overlay (UX spec 6.1)
- Loading: skeleton shimmer states, no spinners
- Server Component for initial data fetch
- Image optimization via next/image with priority for above-fold

---

### Story 2.4: Gallery Filtering

As a **user**,
I want **to filter the gallery by marble type, finish, or use case**,
So that **I can quickly find items matching my preferences**.

**Acceptance Criteria:**

**Given** I am on the gallery page
**When** I interact with filter controls
**Then** I can filter by:
- Marble type (dropdown or chip selector)
- Finish type (polished, honed, raw, brushed)
- Use case (coffee table, side table, column, decorative)

**And** filters can be combined (AND logic)
**And** active filters are visually indicated
**And** results update without full page reload
**And** URL updates to reflect active filters (shareable/bookmarkable)
**And** "Clear filters" option resets to show all items
**And** empty state shows friendly message with suggestion to clear filters

**Prerequisites:** Story 2.3

**Technical Notes:**
- Use URL search params for filter state (`?marble=carrara&finish=polished`)
- Server-side filtering for SEO and performance
- Implement filter UI with shadcn/ui Select and Checkbox components
- Animate filter transitions smoothly
- Consider faceted search (show count per filter option)

---

### Story 2.5: Marble Detail Page

As a **user**,
I want **to view detailed information about a specific marble type**,
So that **I can learn about its characteristics before choosing it for my cube**.

**Acceptance Criteria:**

**Given** I click on a marble from the gallery or navigate to `/[locale]/marble/[slug]`
**When** the page loads
**Then** I see:
- Hero image showing the marble texture in high quality
- Marble name in elegant typography (Cormorant Garamond)
- Origin story and characteristics description
- Technical specifications (origin country, available finishes)
- Gallery of sample cube images in this marble
- "Create My Cube" CTA button (gold, prominent)

**And** specifications display includes:
- Country of origin with flag icon
- Available finishes as visual chips
- Density indicator (for weight context)
- Price range indicator ("From X € to Y €")

**And** the page follows Carrara Pure theme (white, elegant spacing)
**And** images are high-quality and zoomable on click

**Prerequisites:** Story 2.3

**Technical Notes:**
- Route: `src/app/[locale]/marble/[slug]/page.tsx`
- Dynamic route with `generateStaticParams` for static generation
- Use Prisma to fetch marble with finishes relation
- Hero image: consider parallax or subtle animation
- CTA navigates to configurator with marble pre-selected: `/configurator?marble={slug}`
- Implement image lightbox for zoom functionality

---

### Story 2.6: Gallery to Configurator Navigation

As a **user**,
I want **to start configuring a cube with a marble I discovered in the gallery**,
So that **my chosen marble is already selected when I reach the configurator**.

**Acceptance Criteria:**

**Given** I am viewing a marble detail page
**When** I click "Create My Cube" (Créer Mon Cube)
**Then** I am navigated to the configurator page
**And** the selected marble is pre-loaded in the 3D view
**And** the marble selector shows my choice as active
**And** I can immediately adjust dimensions and finish

**Given** I am on the gallery page
**When** I click a quick-configure action on a gallery card (if available)
**Then** the same pre-selection flow occurs

**And** the transition follows UX spec: smooth fade from Carrara Pure to Nero Marquina theme

**Prerequisites:** Story 2.5 (Marble Detail), Epic 3 Story 3.1 (Configurator base)

**Technical Notes:**
- Use URL parameter: `/[locale]/configurator?marble={slug}`
- Configurator reads URL param on mount and sets initial state
- Theme transition: CSS animation from light to dark (0.5s ease)
- Zustand store initialized with marble from URL if present
- Handle invalid/missing marble slug gracefully (default to first marble)

---

## Epic 3: 3D Configurator Core

**Goal:** Build the immersive 3D configurator that is the heart of Marmorani—where users sculpt their custom marble cube with real-time visualization and instant feedback.

**User Value:** Users can create their perfect marble cube in a stunning 3D environment, seeing exactly what they'll receive with photo-realistic textures, real-time price, and weight calculations.

**FRs Covered:** FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18

---

### Story 3.1: Configurator Page Shell & Theme

As a **user**,
I want **to enter an immersive dark-themed configurator environment**,
So that **the marble cube stands out beautifully and I feel like I'm in a private atelier**.

**Acceptance Criteria:**

**Given** I navigate to `/[locale]/configurator`
**When** the page loads
**Then** I see:
- Nero Marquina dark theme (bg: #0D0D0D)
- Full-viewport 3D canvas area (70%+ of screen on desktop)
- Minimal header with logo and back navigation
- Configuration controls area (side panel desktop, bottom sheet mobile)

**And** the theme transition from gallery is smooth (0.5s cinematic fade)
**And** the layout adapts responsively:
- Desktop: 3D view left (70%), config panel right (30%)
- Mobile: 3D view top (60%), bottom sheet below (swipeable)

**And** the page title updates to reflect configuration state

**Prerequisites:** Story 1.3, Story 1.4

**Technical Notes:**
- Route: `src/app/[locale]/configurator/page.tsx`
- Use CSS custom properties to switch to dark theme on this route
- Layout: CSS Grid for desktop, Flex column for mobile
- Mobile bottom sheet: use shadcn Sheet component or custom implementation
- Dynamic import for 3D components with `ssr: false`
- Add `aria-label` for accessibility per UX spec section 8.2

---

### Story 3.2: Zustand Configuration Store

As a **developer**,
I want **a centralized state store for cube configuration**,
So that **all components stay synchronized and state persists across sessions**.

**Acceptance Criteria:**

**Given** the configurator is loaded
**When** any configuration value changes
**Then** the Zustand store updates with:
- `marbleId`: string (selected marble slug)
- `width`: number (cm, 5-100)
- `height`: number (cm, 5-100)
- `depth`: number (cm, 5-100)
- `finish`: FinishType enum
- `calculatedWeight`: number (kg, derived)
- `calculatedPrice`: number (cents, derived)

**And** derived values (weight, price) recalculate automatically when inputs change
**And** state persists to localStorage (user can return and continue)
**And** URL parameter `?marble={slug}` initializes marbleId on first load
**And** store provides actions: `setDimensions`, `setMarble`, `setFinish`, `reset`

**Prerequisites:** Story 1.1

**Technical Notes:**
- Create `src/stores/configStore.ts`
- Use Zustand persist middleware for localStorage
- Weight formula: `(width × height × depth) × density / 1,000,000` (cm³ to kg)
- Price formula: `basePricePerCm3 × volume × finishModifier`
- Fetch marble data (density, price) from constants or API on marble change
- Debounce derived calculations for performance

---

### Story 3.3: 3D Cube Viewer Component

As a **user**,
I want **to see a photo-realistic 3D cube that responds to my configuration**,
So that **I can visualize exactly what my custom marble cube will look like**.

**Acceptance Criteria:**

**Given** the configurator is loaded
**When** I view the 3D canvas
**Then** I see a marble cube rendered with:
- Accurate dimensions matching my configuration
- Photo-realistic marble texture with veining patterns
- Realistic lighting (studio HDRI environment)
- Subtle shadow beneath the cube
- Smooth surface for polished, matte for honed, rough for raw finish

**And** the cube floats centered in the viewport
**And** the scene background matches Nero Marquina (#0D0D0D)
**And** performance targets are met:
- Initial load < 3 seconds (NFR1)
- 60fps rendering (NFR2)

**Prerequisites:** Story 3.1, Story 3.2, Story 2.2

**Technical Notes:**
- Create `src/components/3d/CubeViewer.tsx`
- Use React Three Fiber `Canvas` with `frameloop="demand"` for performance
- Use Drei `useTexture` for marble texture loading (diffuse, normal, roughness)
- Use Drei `Environment` with studio preset for realistic lighting
- Cube geometry: `BoxGeometry` with dimensions from store
- Material: `MeshStandardMaterial` with PBR textures
- Add `ContactShadow` from Drei for ground shadow
- Implement loading state with Suspense boundary

---

### Story 3.4: 3D Interaction Controls

As a **user**,
I want **to rotate and zoom the 3D cube with natural gestures**,
So that **I can examine my cube from every angle and build purchase confidence**.

**Acceptance Criteria:**

**Given** I am viewing the 3D cube
**When** I interact with mouse/touch
**Then** I can:
- Rotate 360° horizontally by dragging left/right
- Rotate vertically by dragging up/down (limited to prevent flip)
- Zoom in/out with scroll wheel (desktop) or pinch (mobile)
- Double-click/tap to reset view to default angle

**And** rotation is smooth and responsive (< 16ms input lag)
**And** there are sensible zoom limits (not too close, not too far)
**And** the cube auto-rotates slowly when idle (optional, stoppable)
**And** touch gestures work naturally on mobile devices

**Prerequisites:** Story 3.3

**Technical Notes:**
- Use Drei `OrbitControls` component
- Configure: `enablePan={false}`, `minDistance`, `maxDistance`
- Vertical rotation limits: `minPolarAngle`, `maxPolarAngle` (prevent seeing bottom)
- Auto-rotate: `autoRotate` prop, pause on user interaction
- Touch: OrbitControls handles touch automatically
- Add visual hint on first visit: "Drag to rotate"

---

### Story 3.5: Dimension Input Controls

As a **user**,
I want **to set my cube dimensions with intuitive controls**,
So that **I can create the exact size I need for my space**.

**Acceptance Criteria:**

**Given** I am in the configurator
**When** I adjust dimension inputs
**Then** I can set:
- Height (H): 5-100 cm
- Width (W): 5-100 cm
- Depth (D): 5-100 cm

**And** inputs provide:
- Numeric input fields with increment/decrement buttons
- Real-time validation with error messages for out-of-range values
- Visual feedback when approaching limits
- Unit display (cm)

**And** changes update the 3D view in real-time (< 500ms, NFR3)
**And** invalid values are rejected with inline error message
**And** dimensions display in monospace font (JetBrains Mono) per UX spec

**Prerequisites:** Story 3.2, Story 3.3

**Technical Notes:**
- Create `src/components/configurator/DimensionInputs.tsx`
- Use shadcn Input with type="number", min/max attributes
- Validation with Zod schema matching manufacturing constraints
- Connect to Zustand store via `setDimensions` action
- Debounce input to prevent excessive 3D updates (100ms)
- Error display: red border + inline message below field
- Consider optional slider alternative for quick adjustments

---

### Story 3.6: Marble Type Selector

As a **user**,
I want **to choose my marble type from visual swatches**,
So that **I can see the texture before selecting and compare options easily**.

**Acceptance Criteria:**

**Given** I am in the configurator
**When** I view the marble selector
**Then** I see:
- Grid of marble swatches (thumbnail textures)
- Marble name on hover/focus
- Currently selected marble highlighted (gold border)
- "View details" link to marble page (opens in new tab)

**When** I click/tap a swatch
**Then** the marble changes immediately in the 3D view
**And** the texture transition is smooth (crossfade)
**And** price and weight recalculate for the new marble density

**And** on mobile, swatches are horizontally scrollable
**And** keyboard navigation works (arrow keys, Enter to select)

**Prerequisites:** Story 3.2, Story 3.3, Story 2.1

**Technical Notes:**
- Create `src/components/configurator/MarbleSelector.tsx`
- Fetch marble list from Prisma or use seeded constants
- Use `preview.jpg` thumbnails for swatches (fast loading)
- Preload textures for adjacent marbles for faster switching
- Selected state stored in Zustand `marbleId`
- Implement `role="radiogroup"` for accessibility
- Transition: opacity crossfade on material textures

---

### Story 3.7: Finish Picker

As a **user**,
I want **to select the finish for my marble cube**,
So that **I can see how polished, honed, or raw surfaces look on my chosen marble**.

**Acceptance Criteria:**

**Given** I am in the configurator
**When** I view the finish options
**Then** I see available finishes for the selected marble:
- Polished (high gloss, mirror-like)
- Honed (matte, smooth)
- Raw (natural texture, rough)
- Brushed (linear texture, if available)

**And** each option shows:
- Finish name
- Visual indicator or icon
- Price modifier if different from base (+10%, etc.)

**When** I select a finish
**Then** the 3D material updates to reflect the finish:
- Polished: low roughness, high reflectivity
- Honed: medium roughness, no reflections
- Raw: high roughness, matte appearance
- Brushed: anisotropic roughness

**And** price recalculates with finish modifier
**And** selection is visually confirmed (gold highlight)

**Prerequisites:** Story 3.2, Story 3.3, Story 2.1

**Technical Notes:**
- Create `src/components/configurator/FinishPicker.tsx`
- Material roughness values: polished (0.1), honed (0.5), raw (0.9), brushed (0.7)
- Finish availability depends on marble (from MarbleFinish relation)
- Price modifier from `MarbleFinish.priceModifier` (e.g., 1.0, 1.1, 0.95)
- Use shadcn RadioGroup or custom styled buttons
- Update store via `setFinish` action

---

### Story 3.8: Price & Weight Display

As a **user**,
I want **to see the price and weight of my configured cube in real-time**,
So that **I have full transparency and can make informed decisions**.

**Acceptance Criteria:**

**Given** I am configuring my cube
**When** any configuration value changes
**Then** the display updates in real-time (< 200ms, NFR4) showing:
- Total price in user's currency (€) with gold accent color (#C9A962)
- Weight in kilograms (e.g., "≈ 45 kg")
- Visual indication that price is product only ("Shipping calculated at checkout")

**And** price formatting follows locale conventions (1 234,56 € for fr)
**And** weight helps user understand shipping will be significant
**And** price is prominently displayed near the "Add to Cart" CTA
**And** screen readers announce price changes (`aria-live="polite"`)

**Prerequisites:** Story 3.2, Story 3.5, Story 3.6, Story 3.7

**Technical Notes:**
- Create `src/components/configurator/PriceDisplay.tsx`
- Create `src/hooks/usePriceCalculation.ts` and `useWeightCalculation.ts`
- Use Intl.NumberFormat for locale-aware currency formatting
- Weight: `volume_cm3 × density_kg_m3 / 1,000,000`
- Price: `volume_cm3 × basePricePerCm3 × finishModifier / 100` (cents to euros)
- Add pulsing animation on value change for attention
- Typography: price in Cormorant Garamond, weight in Inter

---

## Epic 4: User Authentication & Profile

**Goal:** Enable users to create accounts, log in securely, and manage their profiles and addresses—while preserving the ability to browse and configure without an account.

**User Value:** Users can save their preferences, manage delivery addresses, and access their order history. Anonymous users can still explore and configure freely.

**FRs Covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7

---

### Story 4.1: Anonymous Browsing & Configuration

As a **visitor**,
I want **to browse the platform and use the 3D configurator without creating an account**,
So that **I can explore and design my cube before committing to registration**.

**Acceptance Criteria:**

**Given** I am not logged in
**When** I use the platform
**Then** I can:
- Browse the full inspiration gallery
- View all marble detail pages
- Use the 3D configurator with all features
- Save my configuration in localStorage (via Zustand persist)
- Add items to cart (stored locally)

**And** I see gentle prompts to create an account:
- When adding to cart: "Create an account to save your cart"
- At checkout: account required to complete purchase

**And** no features are blocked or hidden for anonymous users (except checkout completion)

**Prerequisites:** Epic 2, Epic 3

**Technical Notes:**
- Zustand persist middleware already handles local storage
- Cart store (`src/stores/cartStore.ts`) persists independently
- Auth check middleware only protects checkout and account routes
- Use Supabase `getUser()` to check auth state
- Show account creation benefits without being pushy

---

### Story 4.2: Email Registration

As a **visitor**,
I want **to create an account using my email**,
So that **I can save my cart, complete purchases, and track my orders**.

**Acceptance Criteria:**

**Given** I am not logged in
**When** I click "Create Account" (Créer un compte)
**Then** I see a registration form with:
- Email field (required, validated)
- Password field (required, 8+ chars, 1 uppercase, 1 number)
- Password confirmation field
- Name field (optional)
- Terms acceptance checkbox (required)

**When** I submit valid registration data
**Then**:
- Account is created in Supabase Auth
- User record is created in database (synced)
- I am automatically logged in
- My local cart is preserved
- I am redirected to my previous page or account dashboard
- Welcome email is sent

**And** validation errors display inline below each field
**And** password requirements are shown as checklist (updating as I type)
**And** submit button shows loading state during registration

**Prerequisites:** Story 1.2, Story 1.5

**Technical Notes:**
- Route: `src/app/[locale]/auth/register/page.tsx`
- Use Supabase Auth `signUp` with email/password
- Create User record in Prisma on successful auth (webhook or trigger)
- Password validation with Zod schema
- Use React Hook Form for form management
- Merge localStorage cart with any existing user cart on login
- Email via Resend: welcome template

---

### Story 4.3: Login & Session Management

As a **registered user**,
I want **to log in and stay logged in across sessions and devices**,
So that **I can access my account without repeated authentication**.

**Acceptance Criteria:**

**Given** I have an account
**When** I navigate to login (`/auth/login`)
**Then** I see a login form with:
- Email field
- Password field
- "Remember me" checkbox
- "Forgot password?" link
- "Create account" link for new users

**When** I submit valid credentials
**Then**:
- Session is created via Supabase Auth
- JWT token is stored in httpOnly cookie
- I am redirected to my previous page or dashboard
- My local cart is merged with server cart

**And** sessions persist across browser closes (if "Remember me")
**And** sessions work across devices (server-side session)
**And** failed login shows generic error: "Invalid email or password"
**And** rate limiting prevents brute force (5 attempts/hour/IP)

**Prerequisites:** Story 4.2

**Technical Notes:**
- Route: `src/app/[locale]/auth/login/page.tsx`
- Use Supabase Auth `signInWithPassword`
- Session token managed by Supabase (automatic refresh)
- Create auth middleware for protected routes
- Use `src/lib/supabase/server.ts` for server-side auth checks
- Implement rate limiting at Supabase level or custom middleware

---

### Story 4.4: Password Reset Flow

As a **user who forgot their password**,
I want **to reset my password via email**,
So that **I can regain access to my account**.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I click "Forgot password?"
**Then** I see a password reset form with:
- Email field
- Submit button "Send Reset Link"

**When** I submit a registered email
**Then**:
- Password reset email is sent (via Supabase + Resend)
- Success message shows: "Check your email for reset instructions"
- Email contains secure reset link (valid 1 hour)

**When** I click the reset link in email
**Then** I see a new password form with:
- New password field (same requirements as registration)
- Confirm password field

**When** I submit a valid new password
**Then**:
- Password is updated
- I am automatically logged in
- I am redirected to account dashboard
- Confirmation email is sent

**And** expired links show clear error with option to request new link
**And** already-used links are rejected

**Prerequisites:** Story 4.3

**Technical Notes:**
- Route: `src/app/[locale]/auth/reset-password/page.tsx`
- Use Supabase Auth `resetPasswordForEmail` and `updateUser`
- Reset token handled by Supabase magic link system
- Custom email template via Resend (branded)
- Handle token in URL query parameter

---

### Story 4.5: Profile Management

As a **logged-in user**,
I want **to update my profile information**,
So that **my name and contact details are correct for orders**.

**Acceptance Criteria:**

**Given** I am logged in
**When** I navigate to `/account/settings`
**Then** I see my profile with editable fields:
- Name (first and last)
- Email (read-only, shows current)
- Phone number (optional)

**When** I update fields and click "Save"
**Then**:
- Profile is updated in database
- Success toast notification appears
- Form shows saved state

**And** I can change my password from this page:
- Current password field
- New password field
- Confirm new password field

**And** validation errors display inline
**And** unsaved changes trigger warning if navigating away

**Prerequisites:** Story 4.3

**Technical Notes:**
- Route: `src/app/[locale]/account/settings/page.tsx`
- Use Server Action for profile update
- Prisma update on User model
- Password change via Supabase `updateUser`
- React Hook Form with isDirty detection for unsaved warning
- Toast notifications via shadcn Toast

---

### Story 4.6: Address Management

As a **logged-in user**,
I want **to save and manage multiple delivery addresses**,
So that **checkout is faster and I can ship to different locations**.

**Acceptance Criteria:**

**Given** I am logged in
**When** I navigate to `/account/settings` (addresses section)
**Then** I see:
- List of saved addresses (if any)
- "Add new address" button
- Default address indicator (star or badge)

**When** I add or edit an address
**Then** I can enter:
- Label (e.g., "Home", "Office")
- Street address
- City
- Postal code
- Country (dropdown with supported shipping regions)
- Set as default checkbox

**And** address is validated for required fields
**And** country must be in supported shipping list
**And** I can delete addresses (with confirmation)
**And** I can set any address as default
**And** default address is pre-selected at checkout

**Prerequisites:** Story 4.5

**Technical Notes:**
- Use Address model from Prisma schema
- Create `src/constants/shipping.ts` with supported countries
- Implement country dropdown with flags (optional)
- Address validation with Zod
- Server Actions: createAddress, updateAddress, deleteAddress, setDefault
- Dialog modal for add/edit form
- Confirmation dialog for delete

---

## Epic 5: Shopping Cart & Checkout

**Goal:** Enable users to purchase their configured marble cubes with a seamless, trustworthy checkout experience—from cart to payment to confirmation.

**User Value:** Users can review their configurations, complete secure payment, and receive immediate confirmation with invoice.

**FRs Covered:** FR19, FR20, FR21, FR22, FR23, FR24, FR25, FR26, FR27, FR28

---

### Story 5.1: Add to Cart from Configurator

As a **user**,
I want **to add my configured cube to the shopping cart**,
So that **I can proceed to purchase or continue browsing**.

**Acceptance Criteria:**

**Given** I have configured a cube in the 3D configurator
**When** I click "Add to Cart" (Ajouter au panier)
**Then**:
- The cube configuration is added to cart with:
  - Marble type
  - Dimensions (H × W × D)
  - Finish
  - Calculated weight
  - Calculated unit price
  - Quantity: 1
- Success toast appears: "Added to cart" with "View cart" action
- Cart icon in header shows updated item count

**And** if I add the same configuration again, quantity increments (or new item with note)
**And** cart persists in localStorage for anonymous users
**And** cart syncs to server for logged-in users
**And** "Add to Cart" button shows brief loading state then checkmark

**Prerequisites:** Story 3.8, Story 4.1

**Technical Notes:**
- Create `src/stores/cartStore.ts` with Zustand
- Cart item structure: `{ id, marbleId, dimensions, finish, weight, unitPrice, quantity }`
- Generate unique ID for each cart item
- For logged-in users, sync to server via Server Action
- Toast with action button using shadcn Toast
- Update header cart badge (use Zustand selector)

---

### Story 5.2: Cart Page & Item Management

As a **user**,
I want **to view and manage my cart contents**,
So that **I can review, modify quantities, or remove items before checkout**.

**Acceptance Criteria:**

**Given** I have items in my cart
**When** I navigate to `/cart`
**Then** I see:
- List of cart items, each showing:
  - Mini 3D preview or marble thumbnail
  - Marble name and finish
  - Dimensions (H × W × D cm)
  - Weight (kg)
  - Unit price
  - Quantity selector (1-10)
  - Remove button (trash icon)
  - Line total (price × quantity)
- Order subtotal
- Shipping notice: "Shipping calculated at next step"
- "Continue Shopping" link
- "Proceed to Checkout" CTA (gold button)

**When** I change quantity
**Then** line total and subtotal update in real-time

**When** I click remove
**Then** confirmation modal appears, item is removed on confirm

**And** empty cart shows friendly illustration with CTA to gallery

**Prerequisites:** Story 5.1

**Technical Notes:**
- Route: `src/app/[locale]/cart/page.tsx`
- Use cartStore for state
- Quantity selector: shadcn Select or custom increment/decrement
- Remove confirmation: shadcn AlertDialog
- Empty state per UX spec section 7.1
- Consider mini 3D canvas or static image for preview
- Price formatting with Intl.NumberFormat

---

### Story 5.3: Cart Persistence for Logged-In Users

As a **logged-in user**,
I want **my cart to be saved on the server**,
So that **I can access it from any device and not lose my items**.

**Acceptance Criteria:**

**Given** I am logged in
**When** I add, update, or remove cart items
**Then** changes are persisted to the server (database)

**Given** I log in on a new device
**When** I view my cart
**Then** I see all items I previously added

**Given** I had items in local cart before logging in
**When** I log in
**Then** local cart items are merged with server cart
**And** duplicates are handled gracefully (increase quantity or keep separate)

**And** cart operations work offline (queue and sync on reconnect)

**Prerequisites:** Story 5.2, Story 4.3

**Technical Notes:**
- Create Cart model in Prisma or use JSON field on User
- Server Actions: syncCart, getCart
- On login: merge localStorage cart with server cart
- Conflict resolution: prefer server version for existing items, add new local items
- Consider optimistic updates for better UX
- Clear localStorage cart after successful merge

---

### Story 5.4: Checkout - Address Selection

As a **user**,
I want **to select or enter my delivery address at checkout**,
So that **I can specify where to ship my marble cube**.

**Acceptance Criteria:**

**Given** I am logged in and proceed to checkout
**When** I reach the address step
**Then** I see:
- List of saved addresses (if any) with radio selection
- Default address pre-selected
- "Add new address" button
- Selected address summary

**When** I select an address
**Then** shipping cost is calculated based on destination country and total weight

**Given** I am a new user with no saved addresses
**When** I reach checkout
**Then** I see address form inline (same fields as Story 4.6)
**And** option to save address for future orders

**And** address validation shows errors inline
**And** unsupported countries are blocked with message

**Prerequisites:** Story 4.6, Story 5.2

**Technical Notes:**
- Route: `src/app/[locale]/checkout/page.tsx` (multi-step or single page)
- Step 1: Address selection/entry
- Use Address model, pre-populate from user's addresses
- Shipping calculation: weight-based formula per country zone
- Create `src/constants/shipping.ts` with country zones and rates
- Validate country against supported shipping regions (FR24)

---

### Story 5.5: Checkout - Shipping Calculation

As a **user**,
I want **to see the shipping cost before payment**,
So that **I know the total amount I'll pay with no hidden fees**.

**Acceptance Criteria:**

**Given** I have selected a delivery address
**When** shipping is calculated
**Then** I see:
- Shipping cost displayed clearly
- Breakdown: Product total + Shipping = Order Total
- Estimated delivery date (4 weeks from order)

**And** shipping cost is calculated based on:
- Total weight of all items
- Destination country (zone-based pricing)
- Any special handling requirements

**And** shipping estimate was shown in cart: "Shipping: €50-150 depending on destination"
**And** final shipping matches the estimate range

**Prerequisites:** Story 5.4

**Technical Notes:**
- Create shipping calculation logic in `src/lib/shipping.ts`
- Zone-based pricing: EU Zone 1, EU Zone 2, International, etc.
- Weight-based tiers: 0-20kg, 20-50kg, 50-100kg, 100kg+
- Consider using shipping carrier API for precise quotes (future)
- Display formula: base rate + (weight × rate per kg)
- Cache calculation to avoid recalculating on every render

---

### Story 5.6: Stripe Payment Integration

As a **user**,
I want **to pay securely for my order**,
So that **my payment information is protected and the transaction is reliable**.

**Acceptance Criteria:**

**Given** I have confirmed my address and reviewed the order
**When** I click "Pay Now" (Payer maintenant)
**Then**:
- Stripe Checkout Session is created
- I am redirected to Stripe's hosted payment page
- I can pay with: Credit/Debit card, Apple Pay, Google Pay

**When** payment succeeds
**Then**:
- I am redirected to order confirmation page
- Order is created in database with status PAID
- Stripe webhook confirms payment (server-side validation)

**When** payment fails or is cancelled
**Then**:
- I am redirected back to checkout with error message
- Cart is preserved, I can retry

**And** no credit card data is stored on Marmorani servers (PCI-DSS compliance)
**And** payment button shows loading state during redirect

**Prerequisites:** Story 5.5, Story 1.5 (Stripe keys configured)

**Technical Notes:**
- Use Stripe Checkout (hosted page) for simplicity and compliance
- Create Server Action: `createCheckoutSession`
- Configure Stripe with line items, shipping, customer email
- Webhook endpoint: `src/app/api/webhooks/stripe/route.ts`
- Handle `checkout.session.completed` event
- Store `stripePaymentId` on Order for reference
- Use Stripe test mode for development

---

### Story 5.7: Invoice Generation

As a **user**,
I want **to receive a professional invoice for my order**,
So that **I have documentation for my purchase**.

**Acceptance Criteria:**

**Given** my payment is successful
**When** the order is created
**Then** an invoice PDF is generated containing:
- Invoice number (sequential or order-based)
- Order date
- Customer name and address
- Marmorani company details
- Line items with description, quantity, unit price
- Subtotal, shipping, total
- VAT information (if applicable)
- Payment method indicator
- "Paid" stamp/status

**And** invoice is stored and associated with the order
**And** invoice is attached to confirmation email
**And** invoice follows professional formatting

**Prerequisites:** Story 5.6

**Technical Notes:**
- Use @react-pdf/renderer to generate PDF
- Create `src/pdf/Invoice.tsx` component
- Store PDF in Supabase Storage or generate on-demand
- Include in Order record: `invoiceUrl` or regenerate from order data
- Template in user's order locale (from Order.locale)
- Consider sequential invoice numbering for accounting

---

### Story 5.8: Order Confirmation

As a **user**,
I want **to receive confirmation that my order was placed successfully**,
So that **I have peace of mind and order details for reference**.

**Acceptance Criteria:**

**Given** my payment is successful
**When** I am redirected to confirmation page
**Then** I see:
- "Thank you for your order!" message
- Order number prominently displayed
- Order summary (items, totals)
- Delivery address
- Estimated delivery date (4 weeks)
- "View Order" link to order dashboard
- "Continue Shopping" link

**And** I receive confirmation email containing:
- Order number and date
- Order summary with configuration details
- Delivery address and estimated date
- Invoice PDF attached
- Link to track order status
- Contact information for questions

**And** confirmation page is shareable (unique URL with order reference)

**Prerequisites:** Story 5.7

**Technical Notes:**
- Route: `src/app/[locale]/checkout/confirmation/page.tsx`
- Pass order ID via URL: `/checkout/confirmation?order={id}`
- Email via Resend with React Email template
- Create `src/emails/OrderConfirmation.tsx`
- Attach invoice PDF to email
- Email sent from Stripe webhook handler after payment confirmation
- Estimated date: `order.createdAt + 4 weeks`

---

## Epic 6: Order Management

**Goal:** Enable users to track their orders from purchase to delivery, with clear status updates and access to all order information.

**User Value:** Users have visibility into their order status throughout the 4-week production and delivery process, reducing anxiety and building trust.

**FRs Covered:** FR35, FR36, FR37, FR38, FR39, FR40, FR7

---

### Story 6.1: Order Dashboard

As a **logged-in user**,
I want **to see all my orders in one dashboard**,
So that **I can quickly access any order's status and details**.

**Acceptance Criteria:**

**Given** I am logged in
**When** I navigate to `/account/orders`
**Then** I see:
- List of all my orders, newest first
- Each order shows:
  - Order number
  - Order date
  - Status badge (color-coded)
  - Number of items
  - Order total
  - "View Details" link
- Pagination if more than 10 orders

**And** orders are grouped or filterable by status (optional)
**And** empty state shows message: "No orders yet" with CTA to gallery
**And** recently placed order is highlighted

**Prerequisites:** Story 5.8, Story 4.3

**Technical Notes:**
- Route: `src/app/[locale]/account/orders/page.tsx`
- Query orders with Prisma, ordered by createdAt DESC
- Status badges with colors from UX spec semantic colors:
  - PENDING: blue (info)
  - PAID: green (success)
  - IN_PRODUCTION: yellow (warning)
  - SHIPPED: blue (info)
  - DELIVERED: green (success)
  - CANCELLED: red (error)
- Server Component for data fetching
- Consider loading skeleton states

---

### Story 6.2: Order Detail View

As a **user**,
I want **to see complete details of a specific order**,
So that **I can review my purchase configuration, pricing, and delivery information**.

**Acceptance Criteria:**

**Given** I click "View Details" on an order
**When** the order detail page loads
**Then** I see:
- Order number and date
- Current status with timeline (visual progress)
- List of items with:
  - Marble type and finish
  - Dimensions (H × W × D)
  - Weight
  - Quantity and unit price
  - Line total
- Price breakdown (subtotal, shipping, total)
- Delivery address
- Estimated delivery date (or actual if delivered)
- Tracking information (if shipped)
- "Download Invoice" button

**And** the page is printable (clean print styles)
**And** back navigation returns to order list

**Prerequisites:** Story 6.1

**Technical Notes:**
- Route: `src/app/[locale]/account/orders/[id]/page.tsx`
- Fetch order with items, marble details via Prisma includes
- Timeline component showing status progression
- Protect route: user can only view their own orders
- Generate invoice on-demand if not stored

---

### Story 6.3: Order Status Timeline

As a **user**,
I want **to see a visual timeline of my order's progress**,
So that **I understand exactly where my order is in the production/delivery process**.

**Acceptance Criteria:**

**Given** I am viewing an order
**When** I look at the status section
**Then** I see a timeline with stages:
1. **Order Placed** (PENDING/PAID) - with date
2. **In Production** (IN_PRODUCTION) - with date when started
3. **Shipped** (SHIPPED) - with date and tracking number
4. **Delivered** (DELIVERED) - with date

**And** completed stages show checkmark and date
**And** current stage is highlighted/animated
**And** future stages are grayed out
**And** each stage shows helpful description:
  - "Your order is confirmed"
  - "Your cube is being crafted"
  - "Your order is on its way"
  - "Your order has arrived"

**Prerequisites:** Story 6.2

**Technical Notes:**
- Create `src/components/orders/OrderTimeline.tsx`
- Use Order timestamps: createdAt, paidAt, shippedAt, deliveredAt
- Derive current stage from OrderStatus enum
- Animated pulse or glow on current stage
- Vertical layout on mobile, horizontal on desktop
- ARIA labels for accessibility

---

### Story 6.4: Order Status Email Notifications

As a **user**,
I want **to receive email notifications when my order status changes**,
So that **I stay informed without having to check the website**.

**Acceptance Criteria:**

**Given** my order status changes
**When** the status is updated to a new value
**Then** I receive an email notification containing:
- Order number
- New status with friendly message
- Brief order summary
- Link to view order details
- Estimated next step (if applicable)

**And** emails are sent for these status changes:
- PAID → IN_PRODUCTION: "Your cube is now being crafted!"
- IN_PRODUCTION → SHIPPED: "Your order is on its way!" (includes tracking)
- SHIPPED → DELIVERED: "Your order has arrived!"

**And** emails are branded with Marmorani visual identity
**And** emails are in the order's locale language
**And** user can unsubscribe from non-essential notifications (future)

**Prerequisites:** Story 6.3, Story 1.5 (Resend configured)

**Technical Notes:**
- Create `src/emails/OrderStatusUpdate.tsx` template
- Trigger email from admin status update action
- Use Order.locale for email language
- Include tracking URL when status = SHIPPED
- Email templates:
  - Production started
  - Shipped (with tracking link)
  - Delivered
- Consider queue for email sending (reliability)

---

### Story 6.5: Invoice Download & Shipment Tracking

As a **user**,
I want **to download my invoice and track my shipment**,
So that **I have documentation and can follow my delivery**.

**Acceptance Criteria:**

**Given** I am viewing an order with status PAID or later
**When** I click "Download Invoice"
**Then** the invoice PDF downloads to my device
**And** the invoice matches what was attached to confirmation email

**Given** my order has been shipped
**When** I view the order details
**Then** I see:
- Tracking number (copyable)
- Carrier name
- "Track Shipment" link that opens carrier website

**When** I click "Track Shipment"
**Then** I am taken to the carrier's tracking page with my tracking number pre-filled

**And** tracking information is visible in order dashboard (quick view)

**Prerequisites:** Story 6.2, Story 5.7

**Technical Notes:**
- Invoice: regenerate from order data or retrieve stored URL
- PDF download: use Content-Disposition header
- Tracking URL patterns per carrier:
  - DHL: `https://www.dhl.com/track?tracknumber={number}`
  - FedEx, UPS, etc. (configure per carrier)
- Store trackingNumber and carrier on Order model
- Copy-to-clipboard for tracking number (with toast feedback)

---

## Epic 7: Admin Dashboard

**Goal:** Provide administrators with tools to manage the marble catalog, gallery content, and customer orders efficiently.

**User Value:** Sacha (and future team members) can manage the business operations—update inventory, track orders, and maintain content—without developer intervention.

**FRs Covered:** FR41, FR42, FR43, FR44, FR45

---

### Story 7.1: Admin Authentication & Layout

As an **administrator**,
I want **secure access to the admin dashboard**,
So that **only authorized users can manage platform content and orders**.

**Acceptance Criteria:**

**Given** I am a user with ADMIN role
**When** I navigate to `/admin`
**Then** I see the admin dashboard with:
- Admin navigation sidebar (Orders, Marbles, Gallery, Analytics)
- Current section content area
- My name and logout option
- Quick stats overview (pending orders, total revenue today)

**Given** I am not logged in OR I am a CUSTOMER role user
**When** I try to access `/admin`
**Then** I am redirected to login (if not logged in)
**Or** I see "Access Denied" message (if wrong role)

**And** admin routes are protected via middleware
**And** admin layout uses a professional but simple design

**Prerequisites:** Story 4.3

**Technical Notes:**
- Route: `src/app/[locale]/admin/layout.tsx`
- Middleware check: verify user role = ADMIN
- Use Supabase RLS or middleware for protection
- Admin layout: sidebar + main content area
- First admin user created manually in database or via seed
- Consider separate admin-specific header (no public nav)

---

### Story 7.2: Marble Catalog Management

As an **administrator**,
I want **to add, edit, and remove marble types from the catalog**,
So that **I can keep the product offering current**.

**Acceptance Criteria:**

**Given** I am in the admin Marbles section
**When** I view the marble list
**Then** I see all marbles with:
- Thumbnail preview
- Name
- Origin
- Base price
- Available (yes/no toggle)
- Edit and Delete actions

**When** I click "Add Marble"
**Then** I see a form with:
- Name (multilingual: en, fr, it, es, de)
- Description (multilingual)
- Origin country
- Density (kg/m³)
- Base price per cm³ (cents)
- Texture folder name
- Available toggle
- Finishes with price modifiers

**When** I save a marble
**Then** it appears in the catalog (if available = true)
**And** textures must exist in `/public/textures/{folder}/`

**When** I toggle availability
**Then** the marble is hidden/shown in public catalog immediately

**When** I delete a marble
**Then** confirmation is required
**And** marble is soft-deleted (hidden, not removed from DB)
**And** existing orders referencing it are unaffected

**Prerequisites:** Story 7.1, Story 2.1

**Technical Notes:**
- Route: `src/app/[locale]/admin/marbles/page.tsx`
- CRUD Server Actions: createMarble, updateMarble, toggleAvailability, deleteMarble
- Form with tabs for each language (multilingual JSON fields)
- Validate texture folder exists before save
- Soft delete: set `available = false` and `deletedAt` timestamp
- Use shadcn DataTable for list view
- Image upload not in MVP (textures managed via deployment)

---

### Story 7.3: Marble Pricing Update

As an **administrator**,
I want **to update marble pricing and finish modifiers**,
So that **I can adjust prices based on market conditions**.

**Acceptance Criteria:**

**Given** I am editing a marble
**When** I update pricing fields
**Then** I can modify:
- Base price per cm³ (in cents)
- Finish price modifiers (e.g., polished = 1.0, honed = 0.95, raw = 0.9)

**When** I save pricing changes
**Then** new prices apply to new configurations immediately
**And** existing cart items retain their original quoted prices
**And** existing orders are not affected

**And** I see a preview of sample cube prices:
- 10×10×10 cm cube price
- 30×30×30 cm cube price
- 50×50×50 cm cube price

**Prerequisites:** Story 7.2

**Technical Notes:**
- Part of marble edit form (Story 7.2)
- Price stored in cents (integer) for precision
- Finish modifiers on MarbleFinish relation
- Cart items store calculated price at time of addition
- Price preview: quick calculation display in form
- Consider price history logging (future enhancement)

---

### Story 7.4: Gallery Content Management

As an **administrator**,
I want **to manage the inspiration gallery content**,
So that **I can curate what visitors see and keep content fresh**.

**Acceptance Criteria:**

**Given** I am in the admin Gallery section
**When** I view the gallery items
**Then** I see all items with:
- Thumbnail
- Title
- Associated marble (optional)
- Use case category
- Featured status
- Display order
- Edit and Delete actions

**When** I click "Add Gallery Item"
**Then** I can:
- Upload an image (or provide URL)
- Enter title (multilingual)
- Enter description (multilingual)
- Select associated marble (dropdown, optional)
- Select use case (coffee table, side table, column, decorative)
- Mark as featured (appears first/prominently)
- Set display order

**When** I reorder items
**Then** I can drag-and-drop to change display order
**And** order is saved automatically

**When** I delete an item
**Then** confirmation is required
**And** item is removed from public gallery

**Prerequisites:** Story 7.1, Story 2.3

**Technical Notes:**
- Route: `src/app/[locale]/admin/gallery/page.tsx`
- CRUD Server Actions for GalleryItem
- Image upload to Supabase Storage
- Drag-and-drop: use @dnd-kit or similar
- Display order: integer field, update on reorder
- Featured items: `featured = true`, shown first
- Delete is hard delete (gallery items are content, not transactional)

---

### Story 7.5: Order Management & Analytics

As an **administrator**,
I want **to view and manage all customer orders**,
So that **I can track business performance and update order statuses**.

**Acceptance Criteria:**

**Given** I am in the admin Orders section
**When** I view the orders list
**Then** I see all orders with:
- Order number
- Customer name/email
- Date
- Status (color-coded badge)
- Total amount
- Actions (View, Update Status)

**And** I can filter by:
- Status (dropdown)
- Date range
- Search by order number or customer email

**When** I click an order
**Then** I see full order details:
- Customer information
- Shipping address
- Items with configurations
- Payment information (Stripe reference)
- Status timeline
- Internal notes field

**When** I update order status
**Then** I can change to next logical status:
- PAID → IN_PRODUCTION
- IN_PRODUCTION → SHIPPED (requires tracking number + carrier)
- SHIPPED → DELIVERED

**And** status change triggers customer email notification
**And** I can add internal notes (not visible to customer)

**Given** I view the Analytics section
**Then** I see:
- Orders this month (count and total revenue)
- Orders by status breakdown
- Popular marble types
- Average order value
- Basic charts/graphs

**Prerequisites:** Story 7.1, Story 6.4

**Technical Notes:**
- Route: `src/app/[locale]/admin/orders/page.tsx`
- List with pagination, filters using URL params
- Status update Server Action with validation (logical flow)
- Trigger email on status change (reuse Story 6.4 logic)
- Tracking input modal for SHIPPED status
- Notes field: JSON or separate model
- Analytics: Prisma aggregations, simple charts (recharts or similar)
- Export to CSV (future enhancement)

---

## FR Coverage Matrix

| FR | Description | Epic | Story |
|----|-------------|------|-------|
| FR1 | Visitors can browse without account | Epic 4 | 4.1 |
| FR2 | Users can create accounts with email | Epic 4 | 4.2 |
| FR3 | Users can log in and maintain sessions | Epic 4 | 4.3 |
| FR4 | Users can reset passwords via email | Epic 4 | 4.4 |
| FR5 | Users can update profile information | Epic 4 | 4.5 |
| FR6 | Users can manage delivery addresses | Epic 4 | 4.6 |
| FR7 | Users can view order history | Epic 6 | 6.1 |
| FR8 | Users can access configurator from homepage/gallery | Epic 3 | 3.1 |
| FR9 | Users can set cube dimensions with real-time updates | Epic 3 | 3.5 |
| FR10 | System validates dimensions against constraints | Epic 3 | 3.5 |
| FR11 | Users can select marble type with immediate texture change | Epic 3 | 3.6 |
| FR12 | Users can select finish with visual preview | Epic 3 | 3.7 |
| FR13 | System auto-calculates weight | Epic 3 | 3.8 |
| FR14 | System auto-calculates price | Epic 3 | 3.8 |
| FR15 | Users can rotate 3D cube 360° | Epic 3 | 3.4 |
| FR16 | Users can zoom in/out on visualization | Epic 3 | 3.4 |
| FR17 | 3D renders photo-realistic marble textures | Epic 3 | 3.3 |
| FR18 | Configurator updates in real-time (< 500ms) | Epic 3 | 3.3, 3.5, 3.6, 3.7 |
| FR19 | Users can add cubes to cart | Epic 5 | 5.1 |
| FR20 | Users can view and modify cart | Epic 5 | 5.2 |
| FR21 | Users can save cart (logged in) | Epic 5 | 5.3 |
| FR22 | System displays subtotal, shipping, total | Epic 5 | 5.5 |
| FR23 | Users can enter delivery address | Epic 5 | 5.4 |
| FR24 | System validates shipping regions | Epic 5 | 5.4 |
| FR25 | Users can complete secure payment | Epic 5 | 5.6 |
| FR26 | System generates invoice | Epic 5 | 5.7 |
| FR27 | Users receive confirmation email with invoice | Epic 5 | 5.8 |
| FR28 | System displays estimated delivery (4 weeks) | Epic 5 | 5.5, 5.8 |
| FR29 | Users can browse inspiration gallery | Epic 2 | 2.3 |
| FR30 | Users can filter gallery | Epic 2 | 2.4 |
| FR31 | Users can view marble detail pages | Epic 2 | 2.5 |
| FR32 | Product pages display specifications | Epic 2 | 2.5 |
| FR33 | Product pages show high-quality imagery | Epic 2 | 2.2, 2.5 |
| FR34 | Users can navigate from gallery to configurator | Epic 2 | 2.6 |
| FR35 | Users can access order dashboard | Epic 6 | 6.1 |
| FR36 | System displays order status | Epic 6 | 6.3 |
| FR37 | Users receive email on status change | Epic 6 | 6.4 |
| FR38 | Users can view order details | Epic 6 | 6.2 |
| FR39 | Users can download invoices | Epic 6 | 6.5 |
| FR40 | Users can track shipment | Epic 6 | 6.5 |
| FR41 | Admins can add/edit/remove marbles | Epic 7 | 7.2 |
| FR42 | Admins can update pricing | Epic 7 | 7.3 |
| FR43 | Admins can manage gallery content | Epic 7 | 7.4 |
| FR44 | Admins can manage orders | Epic 7 | 7.5 |
| FR45 | Admins can access reports/analytics | Epic 7 | 7.5 |

---

## Summary

This epic breakdown transforms the Marmorani PRD into **43 implementable stories** across **7 epics**, ready for development.

### Statistics

| Metric | Count |
|--------|-------|
| Total Epics | 7 |
| Total Stories | 43 |
| Functional Requirements Covered | 45/45 (100%) |

### Epic Overview

| Epic | Stories | Primary Focus |
|------|---------|---------------|
| 1. Foundation | 5 | Next.js 15, Prisma, Design System, i18n, Deploy |
| 2. Catalog & Discovery | 6 | Marble data, Gallery, Detail pages, Navigation |
| 3. 3D Configurator | 8 | React Three Fiber, Controls, Inputs, Pricing |
| 4. Authentication | 6 | Supabase Auth, Profile, Addresses |
| 5. Cart & Checkout | 8 | Cart, Stripe, Invoice, Confirmation |
| 6. Order Management | 5 | Dashboard, Timeline, Notifications, Tracking |
| 7. Admin Dashboard | 5 | Catalog CRUD, Gallery, Order management |

### Context Incorporated

- ✅ **PRD:** All 45 FRs mapped to specific stories
- ✅ **UX Design:** Theme transitions, component patterns, responsive specs, accessibility
- ✅ **Architecture:** Tech stack, Prisma schema, API patterns, file structure

### Implementation Ready

Each story includes:
- User story format (As a... I want... So that...)
- BDD acceptance criteria (Given/When/Then)
- Prerequisites (dependency chain)
- Technical notes with implementation guidance

---

_For implementation: Use the `dev-story` workflow to generate detailed implementation plans from individual stories._

_This document was created through the BMad Method create-epics-and-stories workflow._


