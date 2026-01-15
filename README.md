# Apotek Dashboard

A modern, full-featured pharmacy management dashboard with integrated HR capabilities. Built with Next.js 16, this application provides comprehensive tools for managing pharmacy operations, inventory, sales, employee management, and payroll.

## Features

### Pharmacy Management
- **Inventory Management**: Track drug stock levels, expiration dates, and stock opname
- **Sales Analytics**: Real-time sales statistics and reporting with interactive charts
- **Price Lists**: Manage and update drug pricing
- **Procurement**: Purchase order management with invoice calculator
- **Drug Catalog**: Comprehensive drug database with search and filtering

### Human Resources
- **Employee Management**: Complete employee profiles and records
- **Attendance Tracking**: Monthly attendance with overtime hours and benefits calculation
- **Salary Calculator**: Comprehensive payroll system with:
  - Static and additional salary components
  - Extra information fields (BPJS, tax, etc.)
  - Salary snapshots for historical records
- **Work Logs**: Track employee work activities and shifts
- **Shift Management**: Configure and assign work shifts

### VMEDIS Integration
- **Token Management**: Secure VMEDIS API token administration

### Technical Features
- **Role-Based Access Control (RBAC)**: Four user roles (ADMIN, STAFF, RESELLER, GUEST)
- **Google OAuth Authentication**: Secure login via Google accounts
- **Progressive Web App (PWA)**: Installable with offline capabilities
- **Responsive Design**: Optimized for desktop and mobile devices
- **Print Mode**: Special print layouts for reports and documents
- **Dark Mode**: Theme switching support
- **Currency Formatting**: Toggle between Indonesian (Rp 1.000.000,00) and US (Rp 1,000,000.00) formats

## Tech Stack

### Core Framework
- **Next.js 16.1.2** - React framework with App Router and Server Components
- **React 19.2.3** - UI library with latest concurrent features
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Turbopack** - Next-generation bundler for fast development

### Authentication & Authorization
- **NextAuth.js 5.0** (beta) - Google OAuth integration
- Custom JWT/session callbacks for role management
- Middleware-based route protection

### UI Components
- **shadcn/ui** - Accessible component library built on Radix UI
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Geist** - Modern font family

### Data Management
- **SWR** - React Hooks for data fetching with caching
- **Zustand** - Lightweight state management with persistence
- **SuperJSON** - JSON serialization for complex types
- **React Hook Form** - Performant form validation
- **Zod** - TypeScript-first schema validation

### Charts & Visualization
- **Chart.js** - Interactive charts and graphs
- **React ChartJS 2** - React wrapper for Chart.js

### Additional Libraries
- **date-fns** - Modern date utility library
- **nuqs** - Type-safe URL search params
- **Maskito** - Input masking for currency and numbers
- **Sonner** - Beautiful toast notifications

## Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Jujutsu (jj)** - Version control system (replaces git in this project)

## Installation

1. Clone the repository using Jujutsu:
```bash
jj clone <repository-url>
cd apotek-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Backend APIs
VMEDIS_PROXY_URL=https://your-vmedis-api.com
HRIS_PROXY_URL=https://your-hris-api.com

# NextAuth Configuration
AUTH_SECRET=your-secret-key-here
AUTH_GOOGLE_ID=your-google-oauth-client-id
AUTH_GOOGLE_SECRET=your-google-oauth-secret

# Optional
NODE_ENV=development
```

## Development

Start the development server with Turbopack:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Development Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run format       # Auto-fix with ESLint
npm run generate-pwa-icons  # Generate PWA icons
```

## Build

Build the production bundle:
```bash
npm run build
```

The build output will be in the `.next` directory with standalone mode enabled for Docker deployments.

## Version Control

This project uses **Jujutsu (jj)** instead of Git. Always use `jj` commands for version control operations.

### Common Jujutsu Commands

```bash
jj status                    # Check status
jj diff                      # View changes
jj log                       # View commit history
jj new                       # Create new change (always work in empty change)
jj describe -m "message"     # Set change description
jj squash                    # Squash changes into parent
jj bookmark create <name>    # Create bookmark (like git branch)
```

### Commit Convention

Use **Conventional Commits** format:
```
<type>(<scope>): <subject>

<body>
```

**Types**: `feat`, `fix`, `refactor`, `perf`, `style`, `docs`, `test`, `chore`

**Examples**:
```bash
jj describe -m "feat(salary): add additional component to salary calculator"
jj describe -m "fix(rupiah): allow changing format between commas and dots"
jj describe -m "refactor(api): simplify fetchAPI error handling"
```

## Project Structure

```
apotek-dashboard/
├── app/                    # Next.js App Router pages
│   ├── api/auth/          # NextAuth handlers
│   ├── attendances/       # Attendance management
│   ├── employees/         # Employee management
│   ├── procurements/      # Procurement tools
│   ├── salary/            # Salary & payroll
│   ├── vmedis/            # VMEDIS integration
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── drug-selector/    # Drug selection
│   ├── employee-picker/  # Employee selection
│   └── ...
├── cui/                   # Custom Internal UI
│   ├── types/            # Table type definitions
│   └── components/       # Custom table component
├── lib/                   # Utility functions
│   ├── api/              # API client functions
│   │   ├── base.ts      # Core fetchAPI function
│   │   ├── hooks.ts     # SWR hooks
│   │   └── *.ts         # Feature-specific APIs
│   ├── auth.ts           # NextAuth configuration
│   ├── navigation.ts     # Role-based navigation
│   └── rupiah.ts         # Currency formatting
├── public/               # Static assets
├── proxy.ts              # Middleware (authentication + API rewrites)
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## Architecture

### Server/Client Component Split
- **Server Components** (default): Data fetching, authentication, initial loads
- **Client Components** (`"use client"`): Interactivity, mutations, state management

### API Integration
The application integrates with two backend services:
- **VMEDIS API** (v1 & v2): Pharmacy/sales/inventory operations
- **HRIS API** (v1): Human resources/employee/salary management

API routes are rewritten in `proxy.ts` middleware with automatic role-based access control.

### Role-Based Access Control
Four user roles with different permissions:
- **ADMIN**: Full access to all features
- **STAFF**: Standard operational access
- **RESELLER**: Limited access for resellers
- **GUEST**: Read-only access

Access control is enforced at multiple layers:
1. Middleware (route protection)
2. Navigation menu (filtered by role)
3. Component level (conditional rendering)

## Deployment

The application is configured for standalone deployment (Docker-friendly):

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

## Contributing

1. Create a new empty change before starting work:
```bash
jj new
```

2. Make your changes and test thoroughly

3. Describe your change with conventional commit format:
```bash
jj describe -m "type(scope): description"
```

4. Ensure all checks pass:
```bash
npm run lint
npm run build
```

For more details, see [CLAUDE.md](./CLAUDE.md).

## License

This project is proprietary software. All rights reserved.

## Support

For issues and feature requests, please contact the development team or open an issue in the project repository.
