# Edictum Hub

Official website and community contract hub for [Edictum](https://github.com/acartag7/edictum) — safety contracts for AI agents.

**Live at [edictum.ai](https://edictum.ai)**

## What is Edictum?

Edictum enforces safety contracts at the tool-call boundary of AI agents. Write declarative YAML contracts that deny dangerous calls before execution, warn on suspicious output after, and cap session usage — all deterministic, no LLM in the loop.

## Features

- **Contract Hub** — Browse, search, download, and rate community YAML contracts
- **Playground** — Test contracts in your browser with a live Python runtime (Pyodide)
- **Guides** — Step-by-step learning resources for writing and deploying contracts
- **Auth** — Sign in with Clerk to submit contracts, rate, and comment

## Tech Stack

- **Next.js 16** — App Router, React 19, TypeScript
- **Tailwind CSS 4** — CSS-first configuration, dark theme
- **Convex** — Real-time backend database
- **Clerk** — Authentication
- **Pyodide** — In-browser Python runtime for the playground
- **Vercel** — Deployment

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+
- A [Convex](https://convex.dev) account
- A [Clerk](https://clerk.com) account

### Setup

1. Clone the repo:

   ```bash
   git clone https://github.com/acartag7/edictum-hub.git
   cd edictum-hub
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Copy the environment file:

   ```bash
   cp .env.local.example .env.local
   ```

4. Fill in the environment variables:
   - Create a Clerk application and add the keys
   - Run `npx convex dev` to set up Convex and get the URL
   - Add the Clerk JWT issuer domain in Convex dashboard

5. Start the development server:

   ```bash
   npx convex dev   # In one terminal
   pnpm dev         # In another terminal
   ```

6. Seed the database:

   ```bash
   npx convex run seed:seed
   ```

### Environment Variables

| Variable                            | Description                      |
| ----------------------------------- | -------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key            |
| `CLERK_SECRET_KEY`                  | Clerk secret key                 |
| `NEXT_PUBLIC_CONVEX_URL`            | Convex deployment URL            |
| `CLERK_JWT_ISSUER_DOMAIN`           | Clerk JWT issuer for Convex auth |

## Project Structure

```
app/
  page.tsx              — Landing page
  (app)/                — Route group with shared Nav + Footer
    hub/                — Contract browse, detail, submit, my-contracts
    playground/         — In-browser contract testing (Pyodide)
    guides/             — Learning guides
    about/              — About page
components/             — Shared React components
convex/                 — Schema, queries, mutations, seed data
lib/                    — Utility functions
```

## Scripts

```bash
pnpm dev            # Start dev server (Turbopack)
pnpm build          # Production build
pnpm lint           # ESLint
pnpm format         # Prettier
pnpm typecheck      # TypeScript check
npx convex dev      # Convex dev server
npx convex deploy   # Convex production deploy
```

## Deployment

Deployed to Vercel at `edictum.ai`. Convex backend runs on Convex Cloud.

## License

MIT
