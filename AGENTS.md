# AGENTS.md — RCHS Storefront

Guidance for agentic coding agents working in this repository.

## Project Overview

RCHS (Richland County High School) merchandise storefront. A React 19 + TypeScript
single-page app built with Vite 8, styled with plain CSS + Tailwind CSS v4, with GSAP
available for animation and the React Compiler enabled via Babel.

Key entry points:
- `src/main.tsx` — React root (StrictMode)
- `src/App.tsx` — main storefront page + tiny history-based router (`/` vs `/designs`)
- `src/DesignsPage.tsx` — designs page
- `src/components/originkit/ui/` — vendored third-party UI components (e.g. `spinimage.tsx`)
- `DESIGN.md` — design system spec (colors, typography, spacing, components). Follow it
  when touching UI: Tiger Orange `#FF6B00` accents, Inter font, minimalist Apple-like
  aesthetic, rounded corners (0.5rem buttons / 1rem cards), no heavy shadows.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Type-check (tsc -b) then production build (vite build)
npm run lint      # Oxlint (fast linter; config in .oxlintrc.json)
npm run preview   # Preview the production build locally
```

- **Type checking:** `tsc -b` runs as part of `npm run build`. Run it alone to check
  types without emitting (`noEmit` is on). There are two project refs:
  `tsconfig.app.json` (src) and `tsconfig.node.json` (vite.config.ts).
- **Tests:** There is NO test framework configured (no vitest/jest/playwright).
  Do not invent test commands. Verification = `npm run lint` + `npm run build`
  passing, plus manual checks in the dev server.
- **Single test:** Not applicable — no test runner exists. If tests are added later,
  update this section.
- Package manager: npm (a `package-lock.json` is committed).

## Linting Rules

`.oxlintrc.json` enables plugins `react`, `typescript`, `oxc` with:

- `react/rules-of-hooks`: error — never call hooks conditionally
- `react/only-export-components`: warn (constant exports allowed) — keep fast-refresh
  boundaries clean; a component file should mostly export components/constants

## TypeScript Configuration Highlights

From `tsconfig.app.json` — code must comply with all of these:

- `target: es2023`, `lib: ["ES2023", "DOM"]`, modern ES modules
- `verbatimModuleSyntax: true` — use `import type { X }` for type-only imports;
  do not rely on elision
- `noUnusedLocals` / `noUnusedParameters`: true — remove dead code; prefix intentionally
  unused params with `_`
- `erasableSyntaxOnly: true` — no enums, no namespaces, no parameter properties
  (use union types / plain objects instead)
- `noFallthroughCasesInSwitch: true`
- `jsx: react-jsx` — do NOT import `React` just for JSX
- `moduleResolution: bundler`, `allowImportingTsExtensions` (imports may include `.tsx`)
- Path alias `@/*` → `src/*` exists for shadcn-generated components
  (`components.json`, registry `@eldoraui`); first-party code still uses relative
  imports (`./components/...`, `../ui/...`).

## Code Style

Observed conventions in `src/` (match them; do not reformat unrelated code):

### Formatting

- **No semicolons** at end of statements (ASI style) in first-party code.
  Note: vendored files under `src/components/originkit/` use double quotes,
  semicolons, and 4-space indent — leave their style intact, don't "fix" it.
- Single quotes for strings in first-party code.
- 2-space indentation in `.tsx`/`.ts`.
- No trailing commas required; follow surrounding code.

### Imports

Order seen in practice:
1. Framework/library imports (`import { useState } from 'react'`, `gsap`)
2. Side-effect CSS imports (`import './App.css'`) right after library imports
3. Local component/page imports (`./DesignsPage`, `./components/...`)
- Use named exports for pages/components where convenient; `App.tsx` uses
  `export default App`.

### Types & Naming

- Prefer `type` aliases over `interface` for data shapes
  (e.g. `type Product = { id: number; ... }`).
- PascalCase for components/types (`Storefront`, `CartItem`, `SpinImage`).
- camelCase for variables/functions (`activeProduct`, `addToCart`, `showNotice`).
- kebab-case for filenames (`DesignsPage.tsx`, `spinimage.tsx`).
- Inline prop types for small components: `function Icon({ name, size = 18 }: { name: IconName; size?: number })`.
- Union string literals over enums: `type IconName = 'bag' | 'menu' | ...`.
- CSS custom properties in JSX need a cast:
  `style={{ '--shirt-color': value } as React.CSSProperties}`.
- Event handler params named `event`; callbacks like `onClick={() => ...}` inline
  when short.

### React Patterns

- React Compiler is enabled — do not add manual `useMemo`/`useCallback`/`React.memo`
  except for genuinely expensive computations or values used in dependency arrays
  that must be stable (existing code uses `useMemo` sparingly, e.g. `formattedSubtotal`).
- Function declarations inside components for local handlers
  (`function addToCart() {...}`), defined before the return JSX.
- State updates are immutable: spread/map/flatMap/filter to derive new arrays
  (see `updateQuantity` using `flatMap` to drop zeroed items).
- Scroll/perf-sensitive listeners: wrap work in `requestAnimationFrame` with a frame
  guard, attach with `{ passive: true }`, and always clean up listeners/rAF in the
  effect's returned cleanup function.
- Use `ref`s for values that shouldn't trigger re-renders (e.g. `scrollProductRef`).
- Accessibility matters: every icon-only `<button>` gets an `aria-label`; toggles get
  `aria-expanded`/`aria-pressed`; status messages use `role="status"`; decorative SVGs
  get `aria-hidden`. Keep this up.

### Routing

No router library. `App.tsx` reads `window.location.pathname`, listens to `popstate`,
and pushes state via `window.history.pushState`. Add new pages by extending the
conditional render in `App()` and passing an `onNavigate(path)` callback down.

### Styling Approach

- Page-level styles live in sibling CSS files imported by the page
  (`App.css`, `DesignsPage.css`); global resets in `index.css`.
- Tailwind v4 utility classes are used selectively alongside semantic CSS classes
  (e.g. `className="sticky-product-section relative w-screen"`).
- Colors/design tokens come from `DESIGN.md`; reuse existing class names before
  creating new ones.

## Error Handling

- Client-side UI only: validate early and degrade gracefully rather than throwing
  (e.g. `products.find(...) ?? products[0]` fallback pattern).
- Guard nullable DOM refs and measurements (`if (!section) return`).
- User feedback goes through transient notices (the `notice` state +
  `window.setTimeout` reset), not `alert()`.
- Non-null assertions (`!`) are acceptable only for elements guaranteed by the HTML
  (like the `#root` mount point).

## Agent Etiquette

- Keep changes minimal and focused; match existing formatting exactly.
- After any change, run `npm run lint` and `npm run build` and fix failures before
  finishing.
- Never commit unless explicitly asked.
