# Moderne SaaS / Docs design system (source)

Source for the dark-mode SaaS + Docs design-system gallery published at
**https://moderneinc.github.io/prototypes/design-system/**.

Unlike the single-file prototypes in this repo, the gallery is a small multi-page
app (shared tokens → base → components CSS + Handlebars partials), built exactly
like the Moderne marketing-site component library so the front-end team can read
it the same way. It was extracted from the marketing-site repo; this is now its
home (the marketing copy is frozen and may drift).

## Develop

```bash
cd design-system-src
npm install
npm run dev        # http://localhost:5173/prototypes/design-system/
```

## Build (regenerate the published site)

```bash
npm run build      # writes the self-contained site to ../design-system/
npm run a11y       # WCAG AA contrast audit — must report 0 failures
```

`npm run build` emits into `../design-system/` (the folder GitHub Pages serves).
Commit both this `design-system-src/` source and the regenerated `../design-system/`
output. The published base path is `/prototypes/design-system/` (set in
`vite.config.ts`); `npm run dev` serves under the same path.

## Layout

- `web/index.html`, `web/<page>/`, `web/screens/<screen>/` — the gallery pages
- `web/partials/ds-*.html` — canonical markup (the 1:1 reference for React/MUI)
- `web/src/styles/ds-*.css` — `ds-tokens` (dark `:root`) → `ds-base` → `ds-components` → `ds-screens`
- `web/src/lib`, `web/src/pages` — boot + per-page wiring (theme builder, chrome, charts)
- `ds-a11y-check.mjs` — standalone contrast audit
- `COMPONENTS.md` — coverage map + what's deferred
