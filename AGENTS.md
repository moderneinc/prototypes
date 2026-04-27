# AGENTS.md

This file is addressed to AI agents working in this repository. Read it before
making changes — it will save you and the user time.

## What this repo is

A visual playground for the **Construct** design system, the visual layer of
the Moderne CLI. Production-first: tokens live in code, not in Figma. Figma
is one of several downstream consumers — the canonical model in this repo is
the source of truth.

The primary consumer of the design system is **you** (an AI agent). Semantic
richness is the product. Provenance fields (`role`, `evidence`, `applies_to`,
`note`, `extrapolated`, `disambiguation`) exist so you can decide *why* a
token applies in a new context, not just *that* it applies.

## The three layers

```
design-system/tokens.json         layer 1 — authoring (human-edited)
        │
        ▼
tokens/canonical.json             layer 2 — canonical (preserves all provenance)
tokens/canonical.schema.json      layer 2 — schema, validated at build time
        │
        ▼
tokens/dtcg.json                  layer 3 — projection for Tokens Studio / Figma
tokens/figma-map.json             layer 3 — editable projection rules
```

**Edit layer 1 only.** Run `npm run tokens:build` to regenerate layers 2 and 3.
Never hand-edit `tokens/*.json` — the build will overwrite your changes.

## What the Next.js app reads

The app reads `tokens/canonical.json` directly. **Not** the authoring source,
**not** `dtcg.json`. Canonical preserves provenance; the app surfaces that
provenance on the token reference pages alongside each value.

## Terminal-native types

These types are deliberate — they preserve meaning that lossy projections
would discard:

- `terminal.spacing` — `{count, unit, axis, context}`. Stays semantic in
  canonical. The Figma interpreter projects it to pixels using
  `tokens/figma-map.json`. The CLI interpreter (stub) will resolve it
  directly into terminal output.
- `terminal.glyph` — `{char, asciiFallback, role, color}`. Flattens to a
  plain string only in `dtcg.json`. The semantic structure (color pairing,
  ASCII fallback, role) is canonical.
- `terminal.banner.start` / `terminal.banner.close` — banner shapes and
  variants. The four close-banner variants encode state (success / partial /
  success-with-warnings / failure).

## Interpreters

`lib/interpreters/figma.mjs` is functional. `lib/interpreters/cli.mjs` is a
stub — its eventual job is documented inside the file.

The interpreters are `.mjs` rather than `.ts` so the build script can import
them without TypeScript compilation. They are build-time-only; the app reads
canonical directly.

## Components

`components/*.tsx` are primitives only — `Button`, `Card`, `Banner`, `Link`,
`TextField`, `Heading`, `Body`. Named exports. JSDoc headers cite which tokens
they read. No component library; build new surfaces from these primitives.

## Conventions

- No inline color overrides. Colors come from CSS custom properties in
  `app/globals.css`, which mirror canonical. If a value isn't there, add it
  to canonical first.
- Tailwind is used for layout/utility only. Token values do not flow through
  `tailwind.config`.
- Colors are semantic, never decorative. There is one yellow token covering
  six expressions; disambiguation is by glyph + leading word + position.

## What's not here yet

Figma Code Connect is the next phase — components have stable named exports
in preparation. The CLI interpreter is a stub. Behavioral / API tokens are
deliberately out of scope (see `design-system/gaps.md` Part B).
