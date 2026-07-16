# prototypes

UX prototypes and design explorations for Moderne.

This repo holds standalone HTML prototypes used to explore product UX, validate flows, and align on design direction before engineering work begins. Each prototype is self-contained and published via GitHub Pages.

## Live previews

The `gh-pages` branch is deployed automatically. Once published, any prototype is viewable at:

```
https://moderneinc.github.io/prototypes/<file>.html
```

For example: `https://moderneinc.github.io/prototypes/morpheus.html`

## Prototypes

> Most prototypes are single self-contained `.html` files.

| File | What it explores |
| --- | --- |
| [`day-zero-revised.html`](https://moderneinc.github.io/prototypes/day-zero-revised.html) | Revised day-zero tour variant |
| [`moddy-help.html`](https://moderneinc.github.io/prototypes/moddy-help.html) | Moddy first-contact "by role" states |
| [`moddy-trigrep-revised.html`](https://moderneinc.github.io/prototypes/moddy-trigrep-revised.html) | Revised Moddy refine-search results |
| [`results.html`](https://moderneinc.github.io/prototypes/results.html) | Recipe run Results tab |
| [`results-hierarchical-selection-v2.html`](https://moderneinc.github.io/prototypes/results-hierarchical-selection-v2.html) | Hierarchy v2: roll up above repo to VCS org / Moderne org (nested sub-orgs, shared repos) |
| [`tree-component-update.html`](https://moderneinc.github.io/prototypes/tree-component-update.html) | Results tree component update — no static org header (tree stays expanded); checkbox states shown across the board: checked / **indeterminate** (partial) / unchecked, and **no checkbox** on rows with nothing to commit (no-results / error repos) |
| [`results-focus-view.html`](https://moderneinc.github.io/prototypes/results-focus-view.html) | Focus modes + **similar results**: full-screen the results tree or the diff; group by similar results (IntelliJ Find-Usages style) — type-of-change clusters → repositories → exemplar usage; repos roll up under VCS orgs; per-repo "N similar" opens the diff with Show / Back-to-search-results navigation |
| [`org-level-error.html`](https://moderneinc.github.io/prototypes/org-level-error.html) | Org-level run error no longer bricks the page: partial runs stay committable (dismissible banner + error popover); full-screen panel only on total failure |
| [`why-did-this-change-results-view.html`](https://moderneinc.github.io/prototypes/why-did-this-change-results-view.html) | Recipe attribution on Results + Moddy "why did this change?" chat |
| [`visualizations-results-inline.html`](https://moderneinc.github.io/prototypes/visualizations-results-inline.html) | Inline-config visualizations demo |
| [`visualizations-tab-results-view.html`](https://moderneinc.github.io/prototypes/visualizations-tab-results-view.html) | Visualizations tab: master-detail picker with Configure panel |
| [`CLI-rewrites.html`](https://moderneinc.github.io/prototypes/CLI-rewrites.html) | CLI / terminal label rewrites |
| [`proposed-statuses.html`](https://moderneinc.github.io/prototypes/proposed-statuses.html) | Proposed status palette stress test — six page mockups (Run results · Commits · Visualizations · Orgs · Activity · Auth strips) exercising every status under the new violet/warm-grey palette, plus a coverage gallery showing each status in all three display modes |
| [`brand-guidelines.html`](https://moderneinc.github.io/prototypes/brand-guidelines.html) | Brand guidelines, including Product Symbols |
| [`platform-light-dark.html`](https://moderneinc.github.io/prototypes/platform-light-dark.html) | **Re-theming the platform** — the full app (Moddy, Marketplace, Results, Activity) rebuilt from current Moderne UI source and rendered simultaneously in light + dark: draggable vertical divider plus a Dark / Compare / Light switch. Rail/rows are clickable; deep-links via `#moddy` / `#marketplace` / `#results` / `#activity` |
| [`ui-explorations.html`](https://moderneinc.github.io/prototypes/ui-explorations.html) | **UI explorations beyond theming (v2)** — starts from `platform-light-dark.html` (clickable app, light/dark compare, tones + primary + colorblind + WCAG demo controls) as the base for explorations past the re-theming work; seven switchable skins (`?skin=technical` / `technical2` / `glass` / `editorial` / `outline` / `morpheus`) plus a font selector (`?font=`), all composable with the color/tones/CVD controls |
| [`morpheus.html`](https://moderneinc.github.io/prototypes/morpheus.html) | **Morpheus theme (v3)** — the skin from `ui-explorations.html` baked in as the sole theme (på() × kron: warm cream / ink-navy light mode, near-black desaturated dark mode, strand-spectrum gradient moments), WCAG 2.1 AA by default; adds a **Dev Center** page (`#devcenter`): ownership stat cards, change-campaign waffle-arch charts, and an OWASP top-ten rose chart with a selectable remediation list; a **Changelog** page (`#changelog`): PR/commit feed with filters, type icons, chip metadata, checks/review status and diff bars; a **Repositories** page (`#repositories`): ingested-repo index with search + include-not-ingested toggle, mono changesets and LST availability pills; a **Deploy artifacts** page (`#deploy`): artifact queue with ecosystem glyphs (Npm/Go/Maven), mono versions, Filters/Columns toolbar and Redeploy/Add actions; and a **Builder** page (`#builder`): recipe graph canvas (star clusters, selected-node halo, floating label, tool rail) beside the recipe list panel (run bar, tabs with counts, nested recipe tree, Options footer) |
| [`morpheus-viz-thumbnails.html`](https://moderneinc.github.io/prototypes/morpheus-viz-thumbnails.html) | **Morpheus · visualization thumbnails** — variant of `morpheus.html` exploring real Figma **visualization thumbnails** in the Results → Visualizations preview (high-res source images, preview pinned to 4:3, thumbnail swaps per viz). Also carries the recipe-search **language filter** and **logo tags** experiments. |
| [`8529-builder-1-morpheus-ui-uplift.html`](https://moderneinc.github.io/prototypes/8529-builder-1-morpheus-ui-uplift.html) | **Builder — Morpheus (Phase 1: UI uplift)** — the recipe Builder re-skinned in Morpheus, ported from the moderne-ui Builder and running on a sample dataset: recipe graph canvas (star clusters, selected-node halo, tool rail) beside the recipe list panel (run bar, tabs with counts, nested recipe tree with preconditions, Options footer); light/dark toggle, click-to-select, expand/collapse, ink primary buttons; `?recipe=large` previews a ~2,000-step recipe. First slice of the Builder enhancement work (moderne-ui#8528). |
| [`8530-builder-2-common-actions-discoverability.html`](https://moderneinc.github.io/prototypes/8530-builder-2-common-actions-discoverability.html) | **Builder — Common actions & discoverability (Phase 2)** — Morpheus recreation of the header / recipe-actions reshuffle (moderne-ui PR #8500): `Builder` title opens the full **Builder recipe actions** modal (Open existing / Import / Create new / Manage / From V1); recipe toolbar with inline rename + `⋮` menu; tree header with expand-collapse, counts, Undo (⌘Z) and a save indicator. On top of that, **Add / Download YAML / Copy YAML are pulled out of the overflow into a clear, distinct action cluster** so they are unmistakable and Download vs Copy is unambiguous. Empty-state hero (`?state=empty`). For moderne-ui#8530. |
| [`8531-builder-3-scalable-navigation.html`](https://moderneinc.github.io/prototypes/8531-builder-3-scalable-navigation.html) | **Builder — Scalable navigation (Phase 3)** — tree-first layout (working list left, graph right). Defaults to a **deep ~2,000-step recipe** (Spring Boot 3 migration: phases → sets → groups → steps). Groups **collapse by default with step counts**; the list is **windowed** (only ~20 rows render, even fully expanded) so it stays smooth; an **omnipresent location bar** shows where you are (recipe at the top, deepest group as you scroll), and in deeply nested recipes a **levels icon** reveals the full parent path with per-level counts (click a level to jump). Morpheus light/dark. `?recipe=small` for a shallow sample. For moderne-ui#8531. |
| [`code-genome-morpheus.html`](https://moderneinc.github.io/prototypes/code-genome-morpheus.html) | **Code Genome Project — Morpheus theme** — the codegenomeproject landing page rebuilt in the Morpheus visual language (strand-spectrum helix + gradient headline, Geist, ink buttons, light/dark toggle) |
| [`intro-to-openrewrite.html`](https://moderneinc.github.io/prototypes/intro-to-openrewrite.html) | **Intro to OpenRewrite course** — the Articulate Rise course ("Introduction to OpenRewrite") rebuilt in the Morpheus visual language (`morpheus.html` palette/type, dark + light toggle). Sticky lesson TOC + scrollspy, self-hosted lesson videos (native `<video>` with poster frames) + images under `assets/intro-to-openrewrite/`, and every Rise block type rethemed: statement callouts, numbered lists, accordions, tabs, flip flashcards, a numbered process/workflow widget, an origins timeline, and interactive knowledge checks + a 10-question quiz with correct/incorrect reveal |
| [`moderne-design-kit-preview.html`](https://moderneinc.github.io/prototypes/moderne-design-kit-preview.html) | Moderne Design Kit preview — dual-mode (dark/light) visual language: palette, type, logo, components, in-situation surfaces, embedded product-overview deck |
| [`moderne-product-overview-deck.html`](https://moderneinc.github.io/prototypes/moderne-product-overview-deck.html) | Product overview slide deck — 16 slides across the product line (arrow-key / fullscreen navigation) |
| [`moderne-palette.html`](https://moderneinc.github.io/prototypes/moderne-palette.html) | Palette reference — strand-spectrum brand colors on a recreated hero, with a light/dark mode toggle (warm-black ↔ cool-grey neutrals); companion `moderne-palette-tokens.css` / `moderne-palette.json` |
| [`chromosome-generator.html`](https://moderneinc.github.io/prototypes/chromosome-generator.html) | Chromosome SVG generator — same drawing routine as the moderne.ai karyotype hero (curved spine, centromere pinch, banded strokes). Marketing tool for producing on-brand chromosome SVGs: **pair or single** mode, **8 site hues** as swatches, deviant-band overrides (accent / red / green / none), background + height controls, **karyotype presets** (the 18 site pairs), and **sets** that bundle multiple chromosomes into one exportable SVG. State persists in the URL for shareable links. Full keyboard + screen-reader support (radiogroups with arrow-key nav, focus indicators, live regions) |
| [`email-kit/`](https://moderneinc.github.io/prototypes/email-kit/) | Moderne email template kit — light + dark send-ready HTML emails, gallery with iframe previews, hosted image assets so emails render in Gmail/Outlook |

## Archived

Older prototypes kept for reference; not linked from the main table above.

| File | Notes |
| --- | --- |
| [`archive/activity-page.html`](https://moderneinc.github.io/prototypes/archive/activity-page.html) | Activity page (earlier iteration) |
| [`archive/results-view-summary.html`](https://moderneinc.github.io/prototypes/archive/results-view-summary.html) | Results Summary + options panel: show/hide + container-query responsiveness |
| [`archive/results-hierarchical-selection.html`](https://moderneinc.github.io/prototypes/archive/results-hierarchical-selection.html) | Results hierarchy: drill repo → package → file → class → method (tree vs group-by) |
| [`archive/results-faceted-filter.html`](https://moderneinc.github.io/prototypes/archive/results-faceted-filter.html) | Faceted filter bar (org/vcs/branch/status chips + free text) applied across the hierarchy & roll-ups |
| [`archive/data-tables-download.html`](https://moderneinc.github.io/prototypes/archive/data-tables-download.html) | Data tables with download + MVP vs AI-enhanced toggle |
| [`archive/data-tables-download-v2.html`](https://moderneinc.github.io/prototypes/archive/data-tables-download-v2.html) | Data tables download (v2) |
| [`archive/day-zero.html`](https://moderneinc.github.io/prototypes/archive/day-zero.html) | Superseded by [`day-zero-revised.html`](https://moderneinc.github.io/prototypes/day-zero-revised.html) |
| [`archive/moddy.html`](https://moderneinc.github.io/prototypes/archive/moddy.html) | Moddy prompt input |
| [`archive/moddy-trigrep.html`](https://moderneinc.github.io/prototypes/archive/moddy-trigrep.html) | Superseded by [`moddy-trigrep-revised.html`](https://moderneinc.github.io/prototypes/moddy-trigrep-revised.html) |
| [`archive/moddy-trigrep-split.html`](https://moderneinc.github.io/prototypes/archive/moddy-trigrep-split.html) | Superseded by [`moddy-trigrep-revised.html`](https://moderneinc.github.io/prototypes/moddy-trigrep-revised.html) |
| [`archive/moddy-trigrep-combined.html`](https://moderneinc.github.io/prototypes/archive/moddy-trigrep-combined.html) | Superseded by [`moddy-trigrep-revised.html`](https://moderneinc.github.io/prototypes/moddy-trigrep-revised.html) |
| [`archive/moderne-dashboard.html`](https://moderneinc.github.io/prototypes/archive/moderne-dashboard.html) | Moderne dashboard layout |
| [`archive/org-selector.html`](https://moderneinc.github.io/prototypes/archive/org-selector.html) | Org selector with centered modal picker |
| [`archive/status-audit.html`](https://moderneinc.github.io/prototypes/archive/status-audit.html) | Status reference by artifact — every repository status with SaaS chip (label + where) and CLI trigger side by side |
| [`archive/statuses-update.html`](https://moderneinc.github.io/prototypes/archive/statuses-update.html) | Status palette update |
| [`archive/trigrep.html`](https://moderneinc.github.io/prototypes/archive/trigrep.html) | Superseded by `trigrep-revised.html` |
| [`archive/trigrep-activity.html`](https://moderneinc.github.io/prototypes/archive/trigrep-activity.html) | Trigrep + activity page combined view |
| [`archive/trigrep-revised-rebrand.html`](https://moderneinc.github.io/prototypes/archive/trigrep-revised-rebrand.html) | Trigrep revised with warm-dark 2026 rebrand |
| [`archive/design-system-explorer/`](https://moderneinc.github.io/prototypes/archive/design-system-explorer/) | **Dark-mode SaaS + Docs design system** — live theme builder, foundations, components, data-viz, and recreated Moderne screens. Built multi-page app; source in [`archive/design-system-explorer-src/`](archive/design-system-explorer-src/) (`npm run build`) |
| [`archive/left-nav-design-vs-shipped.html`](https://moderneinc.github.io/prototypes/archive/left-nav-design-vs-shipped.html) | Left-nav rail **design vs. shipped** — real renders of the `left-nav-compact` prototype next to the shipped `NeoSideNav` (`#8439`), expanded/collapsed, with a breakdown of what actually differs |
| [`archive/design-system/`](https://moderneinc.github.io/prototypes/archive/design-system/) | Early design-system reference page |
| [`archive/recipe-detail-preview/`](https://moderneinc.github.io/prototypes/archive/recipe-detail-preview/) | Recipe-detail preview explorations (master template, single/multi-language, composite, look-alike variants) |

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
