# Story 1.5: Deployment Pipeline & Environment Configuration

Status: ready-for-dev

## Story

As a **developer**,
I want **the project deployed to Vercel with proper environment configuration**,
So that **changes are automatically deployed and the production environment is ready**.

## Acceptance Criteria

1. **AC1**: GitHub repository is connected to Vercel project
   - Vercel project created and linked to the marmorani GitHub repository
   - Automatic deployments triggered on push to main branch

2. **AC2**: All environment variables are configured in Vercel:
   - DATABASE_URL (Supabase PostgreSQL pooled connection)
   - DIRECT_URL (Supabase PostgreSQL direct connection)
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - STRIPE_SECRET_KEY
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   - STRIPE_WEBHOOK_SECRET
   - RESEND_API_KEY
   - NEXT_PUBLIC_APP_URL

3. **AC3**: Preview deployments work for pull requests
   - PR branches automatically trigger preview deployments
   - Preview URLs are accessible and functional
   - Environment variables are available in preview deployments

4. **AC4**: Prisma client generation runs during build
   - `postinstall` script configured in package.json with `prisma generate`
   - Build process successfully generates Prisma client
   - No Prisma-related build errors

5. **AC5**: Production URL is accessible and serves the base layout
   - Production deployment accessible via Vercel URL
   - Homepage loads with Header, Footer, and locale routing
   - All 5 locales (/en/, /fr/, /it/, /es/, /de/) work in production

6. **AC6**: Build completes without errors
   - `npm run build` succeeds on Vercel
   - No TypeScript errors
   - No ESLint errors

## Tasks / Subtasks

- [x] **Task 1: Set up Supabase project** (AC: #2)
  - [x] 1.1: Create Supabase project (or verify existing project)
  - [x] 1.2: Navigate to Project Settings → Database → Connection string
  - [x] 1.3: Copy DATABASE_URL (pooled connection - Transaction mode)
  - [x] 1.4: Copy DIRECT_URL (direct connection - Session mode)
  - [x] 1.5: Navigate to Project Settings → API → Copy Supabase URL
  - [x] 1.6: Copy anon/public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
  - [x] 1.7: Copy service_role key (SUPABASE_SERVICE_ROLE_KEY)
  - [x] 1.8: Document all connection strings securely

- [ ] **Task 2: Obtain Stripe API keys** (AC: #2) ⏳ *Deferred to Epic 5*
  - [ ] 2.1: Log into Stripe Dashboard (create account if needed)
  - [ ] 2.2: Use test mode for initial setup
  - [ ] 2.3: Navigate to Developers → API keys
  - [ ] 2.4: Copy Publishable key (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  - [ ] 2.5: Copy Secret key (STRIPE_SECRET_KEY)
  - [ ] 2.6: Navigate to Developers → Webhooks → Add endpoint (placeholder for now)
  - [ ] 2.7: Note: STRIPE_WEBHOOK_SECRET will be set up in Epic 5

- [x] **Task 3: Obtain Resend API key** (AC: #2)
  - [x] 3.1: Log into Resend Dashboard (create account if needed)
  - [x] 3.2: Navigate to API Keys section
  - [x] 3.3: Create new API key with appropriate permissions
  - [x] 3.4: Copy RESEND_API_KEY

- [x] **Task 4: Configure postinstall script for Prisma** (AC: #4)
  - [x] 4.1: Open package.json
  - [x] 4.2: Add "postinstall": "prisma generate" to scripts section
  - [x] 4.3: Verify prisma is in dependencies (not just devDependencies) for Vercel
  - [x] 4.4: Test locally: run `npm install` and verify Prisma client generates

- [x] **Task 5: Create/update .env.example** (AC: #2)
  - [x] 5.1: Ensure .env.example has all required keys documented
  - [x] 5.2: Add comments explaining each variable
  - [x] 5.3: Verify .env.local is in .gitignore

- [ ] **Task 6: Connect GitHub repo to Vercel** (AC: #1)
  - [ ] 6.1: Log into Vercel Dashboard
  - [ ] 6.2: Click "Add New..." → "Project"
  - [ ] 6.3: Import the marmorani GitHub repository
  - [ ] 6.4: Select Framework Preset: Next.js
  - [ ] 6.5: Configure Root Directory if needed (should be project root)
  - [ ] 6.6: Set Build Command: `npm run build` (default)
  - [ ] 6.7: Set Output Directory: `.next` (default)

- [ ] **Task 7: Configure environment variables in Vercel** (AC: #2)
  - [ ] 7.1: In Vercel Project Settings → Environment Variables
  - [ ] 7.2: Add DATABASE_URL (Production, Preview, Development)
  - [ ] 7.3: Add DIRECT_URL (Production, Preview, Development)
  - [ ] 7.4: Add NEXT_PUBLIC_SUPABASE_URL (all environments)
  - [ ] 7.5: Add NEXT_PUBLIC_SUPABASE_ANON_KEY (all environments)
  - [ ] 7.6: Add SUPABASE_SERVICE_ROLE_KEY (Production only for security)
  - [ ] 7.7: Add STRIPE_SECRET_KEY (Production, Preview)
  - [ ] 7.8: Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (all environments)
  - [ ] 7.9: Add STRIPE_WEBHOOK_SECRET (Production - placeholder or real if set up)
  - [ ] 7.10: Add RESEND_API_KEY (Production, Preview)
  - [ ] 7.11: Add NEXT_PUBLIC_APP_URL (Production: final domain, Preview: use VERCEL_URL)

- [ ] **Task 8: Deploy to production** (AC: #1, #5, #6)
  - [ ] 8.1: Push latest code to main branch (or trigger deploy from Vercel)
  - [ ] 8.2: Monitor build logs in Vercel Dashboard
  - [ ] 8.3: Verify build completes successfully
  - [ ] 8.4: Verify Prisma generate runs during postinstall
  - [ ] 8.5: Check deployment is marked as "Ready"

- [ ] **Task 9: Verify production deployment** (AC: #5)
  - [ ] 9.1: Access production URL from Vercel Dashboard
  - [ ] 9.2: Verify homepage loads with correct layout (Header, Footer)
  - [ ] 9.3: Test locale routing: /en/, /fr/, /it/, /es/, /de/
  - [ ] 9.4: Verify language switcher works in production
  - [ ] 9.5: Check browser console for errors

- [ ] **Task 10: Test preview deployments** (AC: #3)
  - [ ] 10.1: Create a test branch with a minor change
  - [ ] 10.2: Open a pull request to main
  - [ ] 10.3: Verify Vercel automatically creates preview deployment
  - [ ] 10.4: Access preview URL and verify it loads correctly
  - [ ] 10.5: Verify environment variables work in preview
  - [ ] 10.6: Close/merge the test PR

- [ ] **Task 11: Final verification** (AC: all)
  - [ ] 11.1: Run `npm run build` locally - no errors
  - [ ] 11.2: Run `npm run lint` locally - no errors
  - [ ] 11.3: Production site loads and functions correctly
  - [ ] 11.4: Document production URL in project README or docs

## Dev Notes

### Architecture Patterns & Constraints

This story implements the deployment layer of the Marmorani architecture. Key patterns from Architecture doc:

- **Vercel Deployment**: Native Next.js hosting with automatic CDN, serverless functions, and edge caching
- **Supabase Integration**: Managed PostgreSQL with connection pooling required for serverless environment
- **Environment Isolation**: All secrets via environment variables, never committed to repo
- **Prisma in Serverless**: Requires `postinstall` script to generate client during build

### Connection Pooling for Prisma + Supabase

Supabase provides two connection strings:
- **Pooled (Transaction mode)**: `DATABASE_URL` - Use for serverless functions (Prisma queries)
- **Direct (Session mode)**: `DIRECT_URL` - Use for migrations and `prisma db push`

The Prisma schema should already have:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### Vercel Build Process

1. `npm install` runs → triggers `postinstall` → `prisma generate` runs
2. `npm run build` runs → Next.js builds the application
3. Deployment serves static assets from CDN, API routes as serverless functions

### Environment Variables by Scope

| Variable | Production | Preview | Development |
|----------|------------|---------|-------------|
| DATABASE_URL | ✅ | ✅ | ✅ |
| DIRECT_URL | ✅ | ✅ | ✅ |
| NEXT_PUBLIC_SUPABASE_URL | ✅ | ✅ | ✅ |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | ✅ | ✅ | ✅ |
| SUPABASE_SERVICE_ROLE_KEY | ✅ | ❌ | ❌ |
| STRIPE_SECRET_KEY | ✅ | ✅ | ✅ |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | ✅ | ✅ | ✅ |
| STRIPE_WEBHOOK_SECRET | ✅ | ❌ | ❌ |
| RESEND_API_KEY | ✅ | ✅ | ❌ |
| NEXT_PUBLIC_APP_URL | Domain | VERCEL_URL | localhost:3000 |

### Project Structure Notes

Files to modify:
- `package.json` - Add postinstall script
- `.env.example` - Ensure all keys documented (may already exist from Story 1.1)

No new source files created in this story - primarily external service configuration.

### Learnings from Previous Story

**From Story 1-4-internationalization-setup (Status: done)**

- **i18n Fully Configured**: next-intl v4.5.8 with 5 locales working
- **Locale Routing Active**: `/[locale]/` dynamic segment pattern functional
- **Middleware Active**: Browser locale detection via `src/middleware.ts`
- **Build Verified**: `npm run build` passes without errors
- **Files to Verify in Production**:
  - `src/i18n/config.ts` - Locale configuration
  - `src/i18n/request.ts` - Server-side i18n
  - `src/middleware.ts` - Locale detection (Note: Next.js 16 deprecation warning - informational only)
  - `src/messages/*.json` - All 5 translation files
  - `src/app/[locale]/layout.tsx` - NextIntlClientProvider wrapper
- **Header/Footer**: Using useTranslations hook, all text localized
- **LocaleSwitcher**: Uses router.replace with useTransition for smooth navigation

**Advisory from Review:**
- Next.js 16 shows deprecation warning for middleware convention. This is informational and doesn't affect functionality. No action required for this story.

[Source: docs/sprint-artifacts/1-4-internationalization-setup.md#Dev-Agent-Record]
[Source: docs/sprint-artifacts/1-4-internationalization-setup.md#Senior-Developer-Review]

### References

- [Source: docs/architecture.md#Deployment-Architecture] - Vercel deployment diagram and environment variables
- [Source: docs/architecture.md#Environment-Variables] - Complete list of required env vars
- [Source: docs/architecture.md#ADR-002] - Supabase over separate DB + Auth decision
- [Source: docs/architecture.md#ADR-003] - Prisma with Supabase decision
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Story-1.5-Deployment] - AC1.5.1-6 acceptance criteria
- [Source: docs/epics.md#Story-1.5] - Story definition and technical notes
- [Source: docs/prd.md#Non-Functional-Requirements] - NFR22 (99.5% uptime), NFR24 (data persistence)

## Dev Agent Record

### Context Reference

- [Story Context XML](./1-5-deployment-pipeline-environment-configuration.context.xml)

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- Task 4: Added `"postinstall": "prisma generate"` to package.json scripts
- Task 4: Verified prisma stays in devDependencies (Vercel installs devDeps during build)
- Task 4: Tested `npm install` - Prisma client generates successfully
- Task 5: Enhanced .env.example with scope annotations [P], [P,V], [ALL] and detailed source comments
- Task 5: Verified .gitignore includes `.env*` pattern with `!.env.example` exception (lines 34-35)
- Build verified: `npm run build` passes (Next.js 16.0.7 Turbopack)
- Lint verified: `npm run lint` passes

### Completion Notes List

- ✅ Task 4 & 5 completed - code changes for Prisma postinstall and .env.example documentation
- ⏳ Tasks 1-3, 6-11 require manual user action in external dashboards (Supabase, Stripe, Resend, Vercel)

### File List

- `package.json` - Added postinstall script for Prisma generate
- `.env.example` - Enhanced with detailed comments, scope annotations, and source references

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-04 | Story drafted from epics, architecture, tech spec, and previous story learnings | SM Agent (Bob) |
| 2025-12-05 | Completed Task 4 (postinstall script) and Task 5 (.env.example enhancement) | Dev Agent (Amelia) |

