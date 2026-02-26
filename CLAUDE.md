# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Version Control

This repository uses **Jujutsu (jj)** as its version control system, not git. Always use `jj` commands instead of git commands.

Common commands:
```bash
jj status                    # Check status
jj diff                      # View changes
jj log                       # View commit history
jj new                       # Create new change
jj squash                    # Squash changes into parent
jj describe -m "message"     # Set change description
jj bookmark create <name>    # Create bookmark (like git branch)
```

**Important**: When the user asks to commit changes, use `jj` commands, not `git` commands.

### Conventional Commits

Always use **Conventional Commits** format for change descriptions:

```
<type>(<scope>): <subject>

<body>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `docs`: Documentation only changes
- `test`: Adding or updating tests
- `chore`: Changes to build process, dependencies, or tooling

**Examples**:
```bash
jj describe -m "feat(salary): add additional component to salary calculator"
jj describe -m "fix(rupiah): allow changing format between commas and dots"
jj describe -m "refactor(api): simplify fetchAPI error handling"
```

## Development Commands

```bash
# Development
npm run dev                    # Start dev server with Turbopack
npm run build                  # Build production bundle
npm start                      # Start production server

# Code Quality
npm run lint                   # Run ESLint
npm run format                 # Auto-fix with ESLint

# Other
npm run generate-pwa-icons     # Generate PWA icons
```

## Architecture Overview

This is a Next.js 15.5.2 dashboard application (apotek-dashboard) for pharmacy management with HR features, built using:

- **Next.js App Router** with React Server Components (RSC)
- **Turbopack** for faster development builds
- **NextAuth.js v5** (beta) for Google OAuth authentication
- **Role-Based Access Control** (RBAC) with four roles: ADMIN, STAFF, RESELLER, GUEST
- **Dual Backend Integration**: VMEDIS (pharmacy/sales) and HRIS (human resources) APIs
- **SWR** for client-side data fetching with caching
- **Zustand** for complex client state management with persistence
- **shadcn/ui** components built on Radix UI primitives

## Key Architectural Patterns

### Server/Client Component Split

The codebase follows a strict separation between server and client components:

**Server Components** (default):
- Fetch data directly using async functions
- Pass promises to client components (use React `use()` hook)
- Located in files like `app/[feature]/page.tsx`
- Handle authentication and initial data loading

**Client Components** (`"use client"`):
- Handle interactivity, mutations, and state
- Located in files like `app/[feature]/[feature]-page-client.tsx`
- Use SWR hooks for client-side data fetching
- Use Zustand for complex state management

Example pattern:
```typescript
// Server Component (page.tsx)
export default async function Page() {
  const session = await auth()
  const dataPromise = getDrugs(session)

  return (
    <Suspense fallback={<Fallback />}>
      <ClientPageComponent dataPromise={dataPromise} />
    </Suspense>
  )
}

// Client Component (*-page-client.tsx)
"use client"
export function ClientPageComponent({ dataPromise }) {
  const data = use(dataPromise)
  // Handle interactions, mutations, state
}
```

### Authentication Flow

1. User signs in with Google OAuth
2. JWT callback in `/lib/auth.ts` calls `postLogin()` to fetch user role from backend
3. Role stored in JWT token and session
4. Middleware (`middleware.ts`) enforces:
   - API route access control via rewrites
   - Page-level access control via redirects
5. Navigation menu filtered by role in `lib/navigation.ts`

**Important**: Session contains `user.role` property added via NextAuth callbacks.

### API Integration

**Two Backend Services**:
- **VMEDIS_PROXY_URL**: Pharmacy/sales/inventory (v1 and v2 APIs)
- **HRIS_PROXY_URL**: HR/employee/salary management (v1 API)

**HRIS OpenAPI Spec**: https://raw.githubusercontent.com/turfaa/apotek-hris/refs/heads/master/docs/openapi.yaml
- Always fetch this spec when working on HRIS-related features to check for the latest API contracts

**Middleware API Rewrites** (`middleware.ts`):
- Routes like `/api/drugs`, `/api/employees`, `/api/salary` are rewritten to backend services
- Each route has `allowedRoles` array for access control
- X-Email header automatically added from session

**Client API Functions** (`/lib/api/*.ts`):
- Centralized `fetchAPI()` function in `/lib/api/base.ts`
- Feature-specific modules export typed interfaces and async functions
- SWR hooks exported from `/lib/api/hooks.ts`
- Two routing modes:
  - Server-side: Uses `VMEDIS_PROXY_URL` or `HRIS_PROXY_URL` directly
  - Client-side: Uses `/api/*` routes (rewritten by middleware)

### State Management Strategies

**Zustand + LocalStorage** (`/lib/api/procurements.ts`):
- For complex state requiring persistence (purchase orders)
- Uses `superJSON` for serialization to handle complex types
- Wrapped with `devtools()` and `persist()` middleware

**React Context**:
- Rupiah format toggle (dots vs commas)
- Global settings that affect formatting across app

**URL Search Params** (nuqs library):
- Print mode: `?print=true`
- Drug selection: `?drug-code=XYZ`
- Month/employee selection in salary calculator
- Makes UI state bookmarkable and shareable

**SWR**:
- Standard data fetching with automatic caching/revalidation
- Hooks exported from `/lib/api/hooks.ts`
- Pattern: `export function useDrugs() { return useSWR("/v1/drugs", getDrugs) }`

### Role-Based Access Control

Four roles enforced at multiple layers:

1. **Middleware** (`middleware.ts`):
   - API route rewrites check `allowedRoles`
   - Page access via `isPageAllowed()` function
   - Unauthorized requests redirected to home

2. **Navigation** (`lib/navigation.ts`):
   - Navigation items have `allowedRoles` array
   - Menu automatically filtered based on current user role

3. **Component Level**:
   - Print mode only for ADMIN/STAFF
   - Conditional rendering based on session.user.role

## Directory Structure

```
/app                    # Next.js App Router pages
├── api/auth/          # NextAuth handlers
├── [feature]/         # Feature pages (salary, employees, etc.)
│   ├── page.tsx      # Server component (data fetching)
│   └── *-client.tsx  # Client component (interactivity)
└── layout.tsx        # Root layout with auth provider

/lib
├── api/              # API client functions (21 modules)
│   ├── base.ts      # Core fetchAPI function
│   ├── auth.ts      # Login and role management
│   ├── hooks.ts     # SWR hooks
│   └── [feature].ts # Feature-specific APIs
├── auth.ts          # NextAuth configuration
├── navigation.ts    # Role-based navigation routing
├── rupiah.ts        # Currency formatting utilities
└── utils.ts         # Tailwind cn() utility

/components
├── ui/              # shadcn/ui components (Radix-based)
├── drug-selector/   # Drug selection component
├── employee-picker/ # Employee selection
├── date-picker/     # Date selection
├── month-picker/    # Month selection
└── typography/      # Text components

/cui                 # Custom Internal UI
├── types/          # Table type definitions
└── components/     # Custom table component

middleware.ts        # Auth + API rewrites
next.config.js       # PWA plugin, output: standalone
components.json      # shadcn/ui configuration
```

## Important Files

- **middleware.ts**: Authentication, API rewrites, role-based access control
- **lib/auth.ts**: NextAuth configuration with Google OAuth, JWT/session callbacks
- **lib/api/base.ts**: Central `fetchAPI()` function, handles VMEDIS/HRIS routing
- **lib/navigation.ts**: Navigation structure with role-based filtering
- **app/layout.tsx**: Root layout, SessionProvider, theme provider
- **app/navbar.tsx**: Navigation menu with role filtering

## Environment Variables

Required environment variables:

```bash
# Backend APIs
VMEDIS_PROXY_URL       # Pharmacy/sales API
HRIS_PROXY_URL         # Human Resources API

# NextAuth
AUTH_SECRET            # Encryption secret
AUTH_GOOGLE_ID         # OAuth client ID
AUTH_GOOGLE_SECRET     # OAuth client secret
```

## Component Conventions

**Naming**:
- Server functions: Standard async functions
- Client hooks: Prefix with `use` (useDrugs, usePrintMode)
- Components with Fallback: Export `Component` + `ComponentFallback`
- API methods: `get*` for reads, `post*`/`put*` for writes

**File Organization**:
- `page.tsx`: Server component with data fetching
- `*-page-client.tsx`: Client component with interactivity
- `layout.tsx`: Nested layouts for shared UI

**shadcn/ui Components**:
- Style: "new-york"
- Base color: "slate"
- CSS variables enabled for theming
- Path aliases configured: `@/components`, `@/lib`, `@/components/ui`

## TypeScript Configuration

- Path alias: `@/*` maps to root directory
- Strict mode enabled
- Module resolution: "bundler" (Next.js 15)
- JSX: preserve (handled by Next.js)

## PWA Configuration

- Service worker generated with next-pwa
- Icons in `/public` (192x192, 512x512, apple-icon)
- Disabled in development mode
- Output: "standalone" for Docker deployments

## Key Implementation Details

**Currency Formatting**:
- Two formats supported: Indonesian (1.000.000,00) and US (1,000,000.00)
- Format toggle component in navbar
- Context-based state persisted across pages
- Helper functions in `lib/rupiah.ts`

**Print Mode**:
- Activated via `?print=true` URL parameter
- Only allowed for ADMIN and STAFF roles
- Conditional rendering of print-specific styles
- Managed by `usePrintMode()` hook

**Drug Selection**:
- Server component fetches drugs with Suspense
- Client component handles selection state
- URL parameter sync with nuqs: `?drug-code=ABC123`

**Salary Calculator**:
- Complex state with multiple inputs
- URL params for month and employee selection
- Real-time calculation with debouncing
- Server-side snapshots for historical data
