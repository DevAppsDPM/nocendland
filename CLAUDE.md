# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nocendland** is a nutrition tracking PWA built with Angular 19, backed by Supabase (PostgreSQL). The UI is in Spanish.

## Commands

```bash
ng serve                   # Dev server at http://localhost:4200
ng build                   # Dev build
ng build --configuration=production  # Production build → dist/nocendland/
ng test                    # Run tests (Jasmine/Karma)
pnpm exec supabase gen types typescript --project-id hzwxzvupsctlyrqcdofi > ./src/app/data/types/database.ts  # Regenerate Supabase types
```

## Tech Stack

- **Angular 19** — standalone components, Signals, lazy-loaded feature modules
- **Supabase** — auth (OAuth + email OTP), PostgreSQL, file storage buckets
- **Angular Material 18** + **Tailwind CSS 3** for styling (SCSS)
- **ng2-charts / Chart.js** for nutrient visualization
- **PWA** via Angular Service Worker (production only)

## TypeScript Path Aliases

```
@app/*    → src/app/*
@api/*    → src/app/api/*
@core/*   → src/app/core/*
@data/*   → src/app/data/*
@layout/* → src/app/layout/*
@modules/* → src/app/modules/*
@shared/* → src/app/shared/*
```

## Architecture

### Layer Structure

```
src/app/
├── api/          # Supabase interaction only — no business logic
├── core/         # App-wide services and utilities
├── data/         # TypeScript types and constants
├── layout/       # Shell components (header, footer, side nav)
├── modules/      # Lazy-loaded feature modules (auth, nutrition)
└── shared/       # Reusable components and services
```

### Service Layers

1. **API Services** (`@api/services/`) — direct Supabase CRUD, no state
2. **Domain Services** (`@modules/*/services/`) — business logic + Signal-based state
3. **Core Services** (`@core/services/`) — app-wide utilities aggregated via `CoreService`

### State Management

No NgRx. State lives in service-level Angular Signals:

```typescript
@Injectable({ providedIn: 'root' })
export class NutritionService {
  ingredientList = signal<NUTRITION_INGREDIENT[]>([])
  loadingIngredientList = signal(false)
}
```

### Method Naming Conventions (from README)

| Prefix | Meaning |
|--------|---------|
| `readX` | Fetch from Supabase → returns Promise |
| `saveX` | Insert/update to database |
| `deleteX` | Delete from database |
| `getX` | Return data already in memory |
| `setX` | Store data in memory |
| `loadX` | `readX` + `setX` (fetch and store) |

### Routing

- Routes defined in `src/app/data/constants/ROUTES.ts`
- `NavigateService` (`@core/services`) provides type-safe navigation and persists last child route per module in localStorage
- `authGuard` protects all main routes; `/auth` is the unauthenticated entry point
- Feature modules are lazy-loaded via `loadChildren`

### Authentication

Supabase OAuth (GitHub, Google) + Email OTP. Token stored in localStorage under `nocendland-token`. User session accessible via `SupabaseService.user()` Signal.

### Data Types

- Auto-generated Supabase types at `src/app/data/types/database.ts` — regenerate after schema changes
- Domain types at `src/app/data/types/` (e.g., `llimbro.ts`, `supabase.ts`)
- All entities include `id_user` for user-scoped data isolation

## Key Notes

- The `llimbro` module is legacy and marked for removal
- Ingredient images are managed separately via `ApiBucketService` (Supabase storage)
- Production deployed to Railway: `nocendland-production.up.railway.app`

# Developer notes
Esto es una aplicación de Angular que creé para cubrir ciertas necesidades personales.
La idea es que la aplicación estuviera estructurada por módulos y yo iba desarrollando ahí los módulos necesarios.
Está integrado con supabase.
Tu tarea será retomar el desarrollo.
