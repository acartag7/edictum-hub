# Edictum Hub

## Project Overview

Official website and community hub for Edictum — safety contracts for AI agents.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4 (CSS-based config)
- **Backend**: Convex (real-time database)
- **Auth**: Clerk + Convex integration
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm (always use pnpm, never npm or yarn)

## Commands

- `pnpm dev` — Start dev server with Turbopack
- `pnpm build` — Production build
- `pnpm lint` — Run ESLint
- `pnpm lint:fix` — Fix ESLint issues
- `pnpm format` — Format with Prettier
- `pnpm format:check` — Check formatting
- `pnpm typecheck` — TypeScript type check
- `npx convex dev` — Start Convex dev server
- `npx convex run seed:seed` — Seed the database

## Code Style

- Semi: false (no semicolons)
- Single quotes
- Trailing commas: es5
- Max line width: 80
- Arrow parens: avoid

## Git Conventions

- Atomic commits with clear messages
- No claude code mentions in commits
- Run pre-commit hooks (husky + lint-staged)

## Project Structure

```
app/           — Next.js pages (App Router)
components/    — Shared React components
convex/        — Convex schema, functions, seed data
lib/           — Utility functions
public/        — Static assets
```

## Key Files

- `convex/schema.ts` — Database schema
- `convex/seed.ts` — Seed script with official contracts
- `app/layout.tsx` — Root layout with Clerk + Convex providers
- `middleware.ts` — Clerk auth middleware
- `app/globals.css` — Tailwind v4 theme + design tokens

## Design Tokens

- Background: #0a0a0a
- Foreground: #e5e5e5
- Accent (green): #00ff88
- Danger (red): #ff4444
- Surface: #141414
- Border: #262626
- Font mono: Geist Mono
- Font sans: Geist

## Edictum Contract Format

Valid Edictum v0.5.3 YAML:

```yaml
apiVersion: edictum/v1
kind: ContractBundle
metadata:
  name: bundle-name
defaults:
  mode: enforce
contracts:
  - id: contract-id
    type: pre | post | session
    tool: tool_name
    when:
      # conditions
    then:
      effect: deny | warn
      message: 'Message'
      tags: [tag1, tag2]
```

## Testing

- No test framework set up yet (future: Vitest)
- Pre-commit: ESLint + Prettier + TypeScript check

## Deployment

- Vercel (edictum.ai domain)
- Convex cloud backend
