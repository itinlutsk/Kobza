# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Skinz — Жіночий одяг (artifacts/website)
- Preview path: /website/
- Stack: Vite + Vanilla JS + Bootstrap + CSS
- Multi-page clothing e-commerce website in Ukrainian

### Волинська аудіо-компанія (artifacts/audio)
- Preview path: /audio/
- Stack: React + Vite + Tailwind CSS + TypeScript + Wouter + Framer Motion
- Full multi-page B2B website for a professional AV/audio system integrator
- Pages: Home, Services, Work Stages, Portfolio, About, Contacts
- Features: exit-intent popup (15s + mouse leave), contact form with Zod validation, portfolio filter, animated counters
- Color scheme: Dark navy (#0D1B2A) with gold/amber accent (HSL 43 90% 55%)
- AI-generated images: hero, 6 portfolio photos, team photo
- All text in Ukrainian
