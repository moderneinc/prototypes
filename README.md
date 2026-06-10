# prototypes

UX prototypes and design explorations for Moderne.

This repo holds standalone HTML prototypes used to explore product UX, validate flows, and align on design direction before engineering work begins. Each prototype is self-contained and published via GitHub Pages.

## Live previews

The `gh-pages` branch is deployed automatically. Once published, any prototype is viewable at:

```
https://moderneinc.github.io/prototypes/<file>.html
```

For example: `https://moderneinc.github.io/prototypes/results.html`

## Prototypes

| File | What it explores |
| --- | --- |
| [`moderne-dashboard.html`](https://moderneinc.github.io/prototypes/moderne-dashboard.html) | Moderne dashboard layout |
| [`day-zero.html`](https://moderneinc.github.io/prototypes/day-zero.html) | First-run / day-zero onboarding tour |
| [`day-zero-revised.html`](https://moderneinc.github.io/prototypes/day-zero-revised.html) | Revised day-zero tour variant |
| [`org-selector.html`](https://moderneinc.github.io/prototypes/org-selector.html) | Org selector with centered modal picker |
| [`moddy.html`](https://moderneinc.github.io/prototypes/moddy.html) | Moddy prompt input |
| [`moddy-help.html`](https://moderneinc.github.io/prototypes/moddy-help.html) | Moddy first-contact "by role" states |
| [`moddy-trigrep.html`](https://moderneinc.github.io/prototypes/moddy-trigrep.html) | Moddy × Trigrep exploration |
| [`moddy-trigrep-split.html`](https://moderneinc.github.io/prototypes/moddy-trigrep-split.html) | Moddy × Trigrep split layout |
| [`moddy-trigrep-combined.html`](https://moderneinc.github.io/prototypes/moddy-trigrep-combined.html) | Moddy × Trigrep combined layout |
| [`moddy-trigrep-revised.html`](https://moderneinc.github.io/prototypes/moddy-trigrep-revised.html) | Revised Moddy refine-search results |
| [`trigrep.html`](https://moderneinc.github.io/prototypes/trigrep.html) | Trigrep spec audit + parallel Moddy/Trigrep filter sync |
| [`results.html`](https://moderneinc.github.io/prototypes/results.html) | Recipe run Results tab |
| [`results-view-summary.html`](https://moderneinc.github.io/prototypes/results-view-summary.html) | Results Summary + options panel: show/hide + container-query responsiveness |
| [`results-hierarchical-selection.html`](https://moderneinc.github.io/prototypes/results-hierarchical-selection.html) | Results hierarchy: drill repo → package → file → class → method (tree vs group-by) |
| [`why-did-this-change-results-view.html`](https://moderneinc.github.io/prototypes/why-did-this-change-results-view.html) | Recipe attribution on Results + Moddy "why did this change?" chat |
| [`data-tables-download.html`](https://moderneinc.github.io/prototypes/data-tables-download.html) | Data tables with download + MVP vs AI-enhanced toggle |
| [`data-tables-download-v2.html`](https://moderneinc.github.io/prototypes/data-tables-download-v2.html) | Data tables download (v2) |
| [`visualizations-results-inline.html`](https://moderneinc.github.io/prototypes/visualizations-results-inline.html) | Inline-config visualizations demo |
| [`visualizations-tab-results-view.html`](https://moderneinc.github.io/prototypes/visualizations-tab-results-view.html) | Visualizations tab: master-detail picker with Configure panel |
| [`CLI-rewrites.html`](https://moderneinc.github.io/prototypes/CLI-rewrites.html) | CLI / terminal label rewrites |
| [`brand-guidelines.html`](https://moderneinc.github.io/prototypes/brand-guidelines.html) | Brand guidelines, including Product Symbols |

## Wireframe kit

A lo-fi sketch kit for quickly mocking up new prototypes. The showcase page lists every component, design token, and starter template.

- [`wireframes.html`](https://moderneinc.github.io/prototypes/wireframes.html) — kit showcase and getting-started reference
- `wireframe-kit/wireframe-kit.css` / `.js` / `.jsx` — drop-in styles and components (vanilla + React)
- `wireframe-kit/examples/` — page templates (`dashboard.html`, `recipe-detail.html`, `components.html`)

To use the kit in a new prototype:

```html
<link rel="stylesheet" href="wireframe-kit/wireframe-kit.css">
<script src="wireframe-kit/wireframe-kit.js"></script>
```

## Folders

- **`assets/moddy-spinner/`** — shared chrome and the Moddy spinner used across prototypes.

## Working in this repo

Prototypes are plain HTML, so they can be opened directly in a browser or previewed via GitHub Pages. Changes typically land through pull requests against `gh-pages`, which redeploys the site on merge.
