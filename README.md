# Wandr Frontend MVP

React + TypeScript + Vite scaffold for the first Wandr mobile MVP. The scope intentionally focuses on the product core:

- onboarding brief
- strand generation
- replan flow
- stop detail
- overlap discovery
- nod interaction

## Architecture

The app is structured so the UI does not depend on hardcoded HTML behavior:

- `src/app`: router, providers, layout shell, global styles
- `src/entities`: domain types for onboarding, itinerary and wandrers
- `src/features/demo`: typed mock catalog, service facade and local app state
- `src/features/onboarding`: onboarding UI
- `src/features/strand`: strand summary, DNA timeline and toast
- `src/pages`: route-level screens and bottom-sheet routes
- `src/shared`: small reusable UI and formatting helpers

## Why this shape

The original reference HTML is visually strong but monolithic. This repo turns it into:

1. Typed domain models that match the eventual backend contract.
2. Route-driven mobile sheets so detail/overlap states are navigable and testable.
3. A mock service boundary that can later swap to real Google Places + itinerary endpoints.
4. A mobile shell that preserves the editorial look without locking the app to one static page.

## Suggested next backend integration steps

1. Replace `mockWandrService` with real REST calls matching `/api/itineraries/generate`, `/regenerate`, `/overlaps` and `/nods`.
2. Add a `places_cache` ingestion strategy so the frontend stops depending on ad-hoc place objects.
3. Introduce route loaders or a query layer once the API exists.
4. Add Capacitor only after the web flow is stable and instrumented.

## Local environment

Create a local `.env` file with the Google Maps keys used by onboarding:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_browser_key
VITE_GOOGLE_MAPS_MAP_ID=DEMO_MAP_ID
GOOGLE_MAPS_SECRET_KEY=your_server_only_secret
```

Only `VITE_` variables are exposed to the browser bundle. Keep `GOOGLE_MAPS_SECRET_KEY`
for server-side signed requests or future backend integrations.
