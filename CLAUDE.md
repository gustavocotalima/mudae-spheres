# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Next.js dev server (http://localhost:3000)
- `npm run build` — Production build
- `npm run start` — Run production build
- `npm run lint` — ESLint (flat config via `eslint.config.mjs`, extends `next/core-web-vitals` + `next/typescript`)

No test framework is configured.

## Architecture

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4. Client-side only — no backend, no database, no API routes. The app is a practice simulator for three Mudae Discord bot sphere minigames.

### Game structure

Each minigame is an independent App Router page that owns its own game state via `useState`/`useEffect` and calls a pure logic module:

- `src/app/oh/page.tsx` ↔ `src/lib/oh-logic.ts` — **$oh Orb Harvest**: click random spheres, blue/cyan spheres reveal adjacent neighbors.
- `src/app/oc/page.tsx` ↔ `src/lib/oc-logic.ts` — **$oc Orb Chest**: find the red sphere using color-distance clues (orange = adjacent, yellow = diagonal, etc.).
- `src/app/oq/page.tsx` ↔ `src/lib/oq-logic.ts` — **$oq Orb Quest**: minesweeper variant; finding 3 of 4 purples transforms the 4th into red.
- `src/app/ot/page.tsx` ↔ `src/lib/ot-logic.ts` — **$ot Orb Trace**: non-blue clicks are free; blue clicks cost from a 4-click budget. Same-colored spheres form contiguous runs on a row or column.

The `*-logic.ts` modules are the source of truth for game rules — grid generation, click resolution, reveal logic, scoring. Keep them pure and framework-free; pages handle rendering and timers only.

### Shared pieces

- `src/lib/types.ts` — `Sphere`, `GameState`, per-game state extensions (`OcGameState`, `OqGameState`), `SphereColor` union.
- `src/lib/constants.ts` — sphere color hex values, radial-gradient CSS strings, per-game sphere value tables and spawn weights (e.g. `OH_SPHERE_VALUES`, `OH_SPHERE_WEIGHTS`). Game balance lives here.
- `src/components/` — presentational components shared across games: `SphereGrid`, `SphereButton`, `GameHeader`, `RewardLog`.
- `src/app/page.tsx` — landing page with cards linking to each `/oh`, `/oc`, `/oq` route.

Path alias `@/*` maps to `src/*` (see `tsconfig.json`).

### Conventions

- UI text is in Portuguese (pt-BR) without accents — match the existing style when editing.
- Sphere visuals use the `SPHERE_GRADIENTS` map for consistency; don't hardcode colors.
- When adding a new minigame, follow the page ↔ logic module split and reuse shared components/types.
