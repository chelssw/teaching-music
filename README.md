# Music App Workspace

Monorepo for the virtual music lessons platform.

## Stack

- `apps/web`: Angular 20 + TypeScript
- `apps/api`: NestJS + PostgreSQL + Prisma
- `packages/contracts`: Shared TypeScript contracts between web and API

## Workspace layout

```text
Music-App/
  apps/
    web/
    api/
  packages/
    contracts/
```

## Environment

Copy `.env.example` values into app-specific `.env` files as needed.

## Run locally

1. Install dependencies for each package as needed.
2. Start web: `npm run web:start`
3. Start api: `npm run api:start`
