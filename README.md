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

> Most prototypes are single self-contained `.html` files. Dates are maintained automatically.

### SaaS platform

Product UX for the Moderne platform — results, Moddy, visualizations, statuses, and the Builder phase work.

| File | What it explores | Added | Last changed |
| --- | --- | --- | --- |
| [`day-zero-revised.html`](https://moderneinc.github.io/prototypes/day-zero-revised.html) | Revised day-zero tour variant | 2026-04-29 | 2026-07-06 |
| [`moddy-help.html`](https://moderneinc.github.io/prototypes/moddy-help.html) | Moddy first-contact "by role" states | 2026-05-27 | 2026-07-06 |
| [`moddy-trigrep-revised.html`](https://moderneinc.github.io/prototypes/moddy-trigrep-revised.html) | Revised Moddy refine-search results | 2026-05-28 | 2026-07-06 |
| [`results.html`](https://moderneinc.github.io/prototypes/results.html) | Recipe run Results tab | 2026-06-08 | 2026-07-13 |
| [`results-hierarchical-selection-v2.html`](https://moderneinc.github.io/prototypes/results-hierarchical-selection-v2.html) | Hierarchy v2: roll up above repo to VCS org / Moderne org (nested sub-orgs, shared repos) | 2026-06-08 | 2026-07-07 |
| [`tree-component-update.html`](https://moderneinc.github.io/prototypes/tree-component-update.html) | Results tree component update — no static org header (tree stays expanded); checkbox states shown across the board: checked / **indeterminate** (partial) / unchecked, and **no checkbox** on rows with nothing to commit (no-results / error repos) | 2026-06-08 | 2026-07-08 |
| [`results-focus-view.html`](https://moderneinc.github.io/prototypes/results-focus-view.html) | Focus modes + **similar results**: full-screen the results tree or the diff; group by similar results (IntelliJ Find-Usages style) — type-of-change clusters → repositories → exemplar usage; repos roll up under VCS orgs; per-repo "N similar" opens the diff with Show / Back-to-search-results navigation | 2026-06-08 | 2026-07-06 |
| [`org-level-error.html`](https://moderneinc.github.io/prototypes/org-level-error.html) | Org-level run error no longer bricks the page: partial runs stay committable (dismissible banner + error popover); full-screen panel only on total failure | 2026-06-08 | 2026-07-21 |
| [`why-did-this-change-results-view.html`](https://moderneinc.github.io/prototypes/why-did-this-change-results-view.html) | Recipe attribution on Results + Moddy "why did this change?" chat | 2026-06-08 | 2026-07-13 |
| [`visualizations-results-inline.html`](https://moderneinc.github.io/prototypes/visualizations-results-inline.html) | Inline-config visualizations demo | 2026-06-02 | 2026-07-13 |
| [`visualizations-tab-results-view.html`](https://moderneinc.github.io/prototypes/visualizations-tab-results-view.html) | Visualizations tab: master-detail picker with Configure panel | 2026-06-02 | 2026-07-06 |
| [`CLI-rewrites.html`](https://moderneinc.github.io/prototypes/CLI-rewrites.html) | CLI / terminal label rewrites | 2026-04-24 | 2026-07-16 |
| [`proposed-statuses.html`](https://moderneinc.github.io/prototypes/proposed-statuses.html) | Proposed status palette stress test — six page mockups (Run results · Commits · Visualizations · Orgs · Activity · Auth strips) exercising every status under the new violet/warm-grey palette, plus a coverage gallery showing each status in all three display modes | 2026-06-25 | 2026-07-06 |
| [`8529-builder-1-morpheus-ui-uplift.html`](https://moderneinc.github.io/prototypes/8529-builder-1-morpheus-ui-uplift.html) | **Builder — Morpheus (Phase 1: UI uplift)** — the recipe Builder re-skinned in Morpheus, ported from the moderne-ui Builder and running on a sample dataset: recipe graph canvas (star clusters, selected-node halo, tool rail) beside the recipe list panel (run bar, tabs with counts, nested recipe tree with preconditions, Options footer); light/dark toggle, click-to-select, expand/collapse, ink primary buttons; `?recipe=large` previews a ~2,000-step recipe. First slice of the Builder enhancement work (moderne-ui#8528). | 2026-07-16 | 2026-07-20 |
| [`8530-builder-2-common-actions-discoverability.html`](https://moderneinc.github.io/prototypes/8530-builder-2-common-actions-discoverability.html) | **Builder — Common actions & discoverability (Phase 2)** — Morpheus recreation of the header / recipe-actions reshuffle (moderne-ui PR #8500): `Builder` title opens the full **Builder recipe actions** modal (Open existing / Import / Create new / Manage / From V1); recipe toolbar with inline rename + `⋮` menu; tree header with expand-collapse, counts, Undo (⌘Z) and a save indicator. On top of that, **Add / Download YAML / Copy YAML are pulled out of the overflow into a clear, distinct action cluster** so they are unmistakable and Download vs Copy is unambiguous. The **Open existing** tab uses the same **harmonized recipe finder** as the Phase 4 Add-a-recipe picker — ranked search (exact matches first, highlighted), **Mine / Team / Marketplace** source chips, and rich name·ID·description rows — with the modal's mode tabs acting as an optional header on top; picking a recipe opens it. Empty-state hero (`?state=empty`). For moderne-ui#8530. | 2026-07-16 | 2026-07-21 |
| [`8531-builder-3-scalable-navigation.html`](https://moderneinc.github.io/prototypes/8531-builder-3-scalable-navigation.html) | **Builder — Scalable navigation (Phase 3)** — tree-first layout (working list left, graph right). Defaults to a **deep ~2,000-step recipe** (Spring Boot 3 migration: phases → sets → groups → steps). Groups **collapse by default with step counts**; the list is **windowed** (only ~20 rows render, even fully expanded) so it stays smooth; an **omnipresent location bar** shows where you are (recipe at the top, deepest group as you scroll), and in deeply nested recipes a **levels icon** reveals the full parent path with per-level counts (click a level to jump). The **Builder ▾** title opens the shared **Builder recipe actions** modal (Open existing / Import / Create new / Manage / From V1) whose Open-existing tab uses the harmonized recipe finder — carried forward from Phase 2. Morpheus light/dark. `?recipe=small` for a shallow sample. For moderne-ui#8531. | 2026-07-16 | 2026-07-21 |
| [`8532-builder-4-search-discovery.html`](https://moderneinc.github.io/prototypes/8532-builder-4-search-discovery.html) | **Builder — Search & discovery (Phase 4)** — builds on the Phase 3 list and adds a recipe **finder**: click **Add recipe** (tree header) or a row's **Add recipe to node** to open a ranked search where **exact name/ID matches jump to the top** (with an *Exact match* badge and highlighted matches). Converts the old source **tabs into filter chips** — **Mine / Team / Marketplace** — so authored recipes are easy to grab, and each result is a **rich row** showing name, ID, and description. Keyboard-navigable (↑/↓/Enter); picking a recipe adds it to the tree with Undo. The **Builder ▾** title also opens the shared **Builder recipe actions** modal with the same harmonized finder in its Open-existing tab, so the search pattern is consistent across every entry point. Morpheus light/dark. `?recipe=small` for a shallow sample. For moderne-ui#8532. | 2026-07-16 | 2026-07-21 |
| [`8533-builder-5-focus-mode.html`](https://moderneinc.github.io/prototypes/8533-builder-5-focus-mode.html) | **Builder — Focus mode (Phase 5)** — builds on Phases 1–4 (topology, recipe finder, and the shared Builder recipe actions modal all carried forward). Open any group’s **⋮** menu and choose **Focus on this subtree** to narrow the windowed list to just that branch; a distinct **focus bar** shows what you’re focused on with a step count and a one-click **Exit focus** that returns you exactly where you left off (scroll preserved). The 3D graph **fades unrelated nodes to grey** so the focused subtree stands out. Undo, options, search and the view switcher all keep working while focused. Morpheus light/dark. `?recipe=small` for a shallow sample. For moderne-ui#8533. | 2026-07-16 | 2026-07-21 |
| [`turtle-icons.html`](https://moderneinc.github.io/prototypes/turtle-icons.html) | Turtle icon options — design crit comparing filled / ornate / pixel / emoji styles for row-context use | 2026-07-08 | 2026-07-08 |
| [`LST-status-lifecycle.html`](https://moderneinc.github.io/prototypes/LST-status-lifecycle.html) | LST service blueprint — lifecycle by layer, proposed status colour model, and user flow | 2026-06-18 | 2026-07-08 |
| [`activity-page-redesign.html`](https://moderneinc.github.io/prototypes/activity-page-redesign.html) | Activity page redesign — recent-activity feed layout | 2026-06-18 | 2026-07-06 |
| [`error-audit-summary.html`](https://moderneinc.github.io/prototypes/error-audit-summary.html) | Error-handling audit — message rewrites and component fixes by location (global alerts, error pages, SCM authorization) | 2026-07-14 | 2026-07-14 |
| [`results-repository-status.html`](https://moderneinc.github.io/prototypes/results-repository-status.html) | Results — per-repository status treatment within a run | 2026-07-09 | 2026-07-09 |
| [`results-summary-update.html`](https://moderneinc.github.io/prototypes/results-summary-update.html) | Results summary update on the hierarchical-selection v2 base (DevCenter org roll-up) | 2026-06-08 | 2026-07-09 |

### Morpheus rebrand & design system

The Morpheus visual language: theme explorations, the canonical theme, and the design kit. **New to the rebrand? Start with [`morpheus-design-kit.html`](https://moderneinc.github.io/prototypes/morpheus-design-kit.html)** — it shows every token and component and how to use them.

| File | What it explores | Added | Last changed |
| --- | --- | --- | --- |
| [`morpheus-design-kit.html`](https://moderneinc.github.io/prototypes/morpheus-design-kit.html) | **⭐ Start here — the Morpheus design kit.** The reference component library for the rebrand: color tokens, type, radius & spacing, icons, buttons, controls — the canonical how-to-use-it page for anyone picking up the Morpheus visual language | 2026-07-11 | 2026-07-24 |
| [`platform-light-dark.html`](https://moderneinc.github.io/prototypes/platform-light-dark.html) | **Re-theming the platform** — the full app (Moddy, Marketplace, Results, Activity) rebuilt from current Moderne UI source and rendered simultaneously in light + dark: draggable vertical divider plus a Dark / Compare / Light switch. Rail/rows are clickable; deep-links via `#moddy` / `#marketplace` / `#results` / `#activity` | 2026-07-06 | 2026-07-07 |
| [`ui-explorations.html`](https://moderneinc.github.io/prototypes/ui-explorations.html) | **UI explorations beyond theming (v2)** — starts from `platform-light-dark.html` (clickable app, light/dark compare, tones + primary + colorblind + WCAG demo controls) as the base for explorations past the re-theming work; seven switchable skins (`?skin=technical` / `technical2` / `glass` / `editorial` / `outline` / `morpheus`) plus a font selector (`?font=`), all composable with the color/tones/CVD controls | 2026-07-06 | 2026-07-13 |
| [`morpheus.html`](https://moderneinc.github.io/prototypes/morpheus.html) | **Morpheus theme (v3)** — the skin from `ui-explorations.html` baked in as the sole theme (på() × kron: warm cream / ink-navy light mode, near-black desaturated dark mode, strand-spectrum gradient moments), WCAG 2.1 AA by default; adds a **Dev Center** page (`#devcenter`): ownership stat cards, change-campaign waffle-arch charts, and an OWASP top-ten rose chart with a selectable remediation list; a **Changelog** page (`#changelog`): PR/commit feed with filters, type icons, chip metadata, checks/review status and diff bars; a **Repositories** page (`#repositories`): ingested-repo index with search + include-not-ingested toggle, mono changesets and LST availability pills; a **Deploy artifacts** page (`#deploy`): artifact queue with ecosystem glyphs (Npm/Go/Maven), mono versions, Filters/Columns toolbar and Redeploy/Add actions; and a **Builder** page (`#builder`): recipe graph canvas (star clusters, selected-node halo, floating label, tool rail) beside the recipe list panel (run bar, tabs with counts, nested recipe tree, Options footer) | 2026-07-06 | 2026-07-24 |
| [`morpheus-viz-thumbnails.html`](https://moderneinc.github.io/prototypes/morpheus-viz-thumbnails.html) | **Morpheus · visualization thumbnails** — variant of `morpheus.html` exploring real Figma **visualization thumbnails** in the Results → Visualizations preview (high-res source images, preview pinned to 4:3, thumbnail swaps per viz). Also carries the recipe-search **language filter** and **logo tags** experiments. | 2026-07-06 | 2026-07-16 |
| [`moderne-design-kit-preview.html`](https://moderneinc.github.io/prototypes/moderne-design-kit-preview.html) | Moderne Design Kit preview — dual-mode (dark/light) visual language: palette, type, logo, components, in-situation surfaces, embedded product-overview deck | 2026-06-24 | 2026-07-27 |
| [`moderne-design-kit-changelog.html`](https://moderneinc.github.io/prototypes/moderne-design-kit-changelog.html) | Design-kit changelog — running log of kit updates, linked from the design-kit preview | 2026-07-24 | 2026-07-24 |
| [`moderne-palette.html`](https://moderneinc.github.io/prototypes/moderne-palette.html) | Palette reference — strand-spectrum brand colors on a recreated hero, with a light/dark mode toggle (warm-black ↔ cool-grey neutrals); companion `moderne-palette-tokens.css` / `moderne-palette.json` | 2026-06-26 | 2026-07-26 |

### Code Genome Project

Everything for the Code Genome Project site and gateway.

| File | What it explores | Added | Last changed |
| --- | --- | --- | --- |
| [`code-genome-project.html`](https://moderneinc.github.io/prototypes/code-genome-project.html) | **Code Genome Project — Morpheus base** — the canonical design base for Code Genome Project work: the full [codegenomeproject](https://github.com/moderneinc/codegenomeproject) site rebuilt in the Morpheus visual language (warm-black / cool-white tokens lifted from `morpheus.html`, Geist, the real spectral-helix mark, warm design-system text). Covers all four views the live app ships: **Search** (`#search`) hero + narrative (What is / Sequencing / Searching / Splicing / Surfacing) + example-query columns; **Search results** (`#results?q=…`) GAV-grouped file cards with line numbers, match highlighting and hidden-line expanders; **Recipes** (`#recipes`) a filterable catalog (license segmented control + artifact select) and a full **recipe detail** (`#recipes/<id>`) with access badge, code chips, `mod` usage blocks, options table and composite definition list; and **MCP** (`#mcp`) connect snippets (Claude Code / `.mcp.json` tabs + one-click installs) and the seven MCP tool cards with **verbatim** signatures/descriptions and a live-style Run → JSON result. Moderne + Code Genome Project brand lockup, helix favicon, dark/light toggle. | 2026-07-21 | 2026-07-22 |
| [`code-genome-morpheus.html`](https://moderneinc.github.io/prototypes/code-genome-morpheus.html) | **Code Genome Project — Morpheus theme** — the codegenomeproject landing page rebuilt in the Morpheus visual language (strand-spectrum helix + gradient headline, Geist, ink buttons, light/dark toggle) | 2026-07-14 | 2026-07-24 |
| [`codegenome-auth/`](https://moderneinc.github.io/prototypes/codegenome-auth/) | **Code Genome Project sign-in & download-token flow.** Morpheus reskin of the gateway auth pages (sign-in, consent, download token, customer token management) rendered in light + dark (following the OS preference). Two-path flow view (social login / customer account) plus a side-by-side [light + dark comparison](https://moderneinc.github.io/prototypes/codegenome-auth/compare.html). Real gateway output; backs [codegenomeproject](https://github.com/moderneinc/codegenomeproject) #14 (token setup) and #32 (login). | 2026-07-22 | 2026-07-24 |
| [`codegenome-token-copy.html`](https://moderneinc.github.io/prototypes/codegenome-token-copy.html) | **Code Genome Project — token setup pages (copy-button + Morpheus polish).** Standalone reference snapshot of the gateway sign-in, download-token, and maven-index pages, light + dark side by side. Highlights the token page's per-snippet **copy icon buttons** (opaque, copied-check, code gutter), the subtle back link, and token-scale radii. Real gateway output; backs [codegenomeproject](https://github.com/moderneinc/codegenomeproject) #76 (copy-button clarity) and #33 (Morpheus restyle). | 2026-07-23 | 2026-07-23 |

### Docs & training

Documentation and course experiences.

| File | What it explores | Added | Last changed |
| --- | --- | --- | --- |
| [`docs-morpheus.html`](https://moderneinc.github.io/prototypes/docs-morpheus.html) | **Moderne Docs — Morpheus theme** — the docs site re-themed in the Morpheus visual language (Geist, cream/ink light + ink dark, official Documentation lockup): home with Browse-by-area tiles, video row and full "More about Moderne" prose; Training and right-pinned Releases nav dropdowns; releases and quickstart article views | 2026-07-23 | 2026-07-24 |
| [`intro-to-openrewrite.html`](https://moderneinc.github.io/prototypes/intro-to-openrewrite.html) | **Intro to OpenRewrite course** — the Articulate Rise course ("Introduction to OpenRewrite") rebuilt in the Morpheus visual language (`morpheus.html` palette/type, dark + light toggle). Sticky lesson TOC + scrollspy, self-hosted lesson videos (native `<video>` with poster frames) + images under `assets/intro-to-openrewrite/`, and every Rise block type rethemed: statement callouts, numbered lists, accordions, tabs, flip flashcards, a numbered process/workflow widget, an origins timeline, and interactive knowledge checks + a 10-question quiz with correct/incorrect reveal | 2026-07-10 | 2026-07-13 |

### Marketing & brand

Brand assets, marketing tools, and outbound material.

| File | What it explores | Added | Last changed |
| --- | --- | --- | --- |
| [`moderne-marketing-kit.html`](https://moderneinc.github.io/prototypes/moderne-marketing-kit.html) | **⭐ Start here — the marketing kit.** Gallery of all marketing collateral: the Practical Agentic Coding Playbook (PDF), event speaker-lineup graphics (light + dark PNG), the lower-thirds editor, chromosome generator, and links to every marketing page below. Light/dark, Morpheus tokens | ?? | ?? |
| [`brand-guidelines.html`](https://moderneinc.github.io/prototypes/brand-guidelines.html) | Brand guidelines, including Product Symbols | 2026-05-01 | 2026-07-06 |
| [`moderne-product-overview-deck.html`](https://moderneinc.github.io/prototypes/moderne-product-overview-deck.html) | Product overview slide deck — 16 slides across the product line (arrow-key / fullscreen navigation) | 2026-06-24 | 2026-07-06 |
| [`chromosome-generator.html`](https://moderneinc.github.io/prototypes/chromosome-generator.html) | Chromosome SVG generator — same drawing routine as the moderne.ai karyotype hero (curved spine, centromere pinch, banded strokes). Marketing tool for producing on-brand chromosome SVGs: **pair or single** mode, **8 site hues** as swatches, deviant-band overrides (accent / red / green / none), background + height controls, **karyotype presets** (the 18 site pairs), and **sets** that bundle multiple chromosomes into one exportable SVG. State persists in the URL for shareable links. Full keyboard + screen-reader support (radiogroups with arrow-key nav, focus indicators, live regions) | 2026-07-08 | 2026-07-09 |
| [`email-kit/`](https://moderneinc.github.io/prototypes/email-kit/) | Moderne email template kit — light + dark send-ready HTML emails, gallery with iframe previews, hosted image assets so emails render in Gmail/Outlook | 2026-07-01 | 2026-07-06 |
| [`moderne-lower-thirds/`](https://moderneinc.github.io/prototypes/moderne-lower-thirds/) | **Animated title graphics & lower thirds** — browser-based editor for video overlay graphics (name/title + topic/callout, panel/bare, dark/light, strand-spectrum accents, motion presets, in-browser PNG/WebM export); fonts embedded so renders match everywhere; batch render script in `export/` | 2026-07-27 | 2026-07-27 |
| [`moderne-newsletter.html`](https://moderneinc.github.io/prototypes/moderne-newsletter.html) | **Technical bulletin / newsletter** — send-ready monthly bulletin (June 2026 issue): security lead story, LST mass-ingest, migration guide, recipe authoring, MCP and SaaS v2 updates | 2026-06-25 | 2026-07-06 |
| [`mythos-onepager.html`](https://moderneinc.github.io/prototypes/mythos-onepager.html) | **"Mythos finds. Moderne fixes." one-pager** — positioning page pairing Mythos-class scanning with Moderne remediation: scanning-is-solved narrative, Mythos alone vs. with Moderne comparison, objection-handling FAQ | 2026-06-30 | 2026-07-06 |
| [`moderne-vs-openrewrite-onepager.html`](https://moderneinc.github.io/prototypes/moderne-vs-openrewrite-onepager.html) | **Moderne vs. OpenRewrite one-pager** — print-style comparison table: the open-source engine vs. the commercial platform for large multi-repo codebases | 2026-06-30 | 2026-07-06 |

## Archived

Older prototypes kept for reference; not linked from the main table above.

| File | Notes | Added | Last changed |
| --- | --- | --- | --- |
| [`nordic.html`](https://moderneinc.github.io/prototypes/nordic.html) | Redirect stub — the Nordic theme was renamed; forwards to [`morpheus.html`](https://moderneinc.github.io/prototypes/morpheus.html). Kept at the top level so old links keep working | 2026-07-06 | 2026-07-10 |
| [`archive/activity-page.html`](https://moderneinc.github.io/prototypes/archive/activity-page.html) | Activity page (earlier iteration) | 2026-07-06 | 2026-07-10 |
| [`archive/results-view-summary.html`](https://moderneinc.github.io/prototypes/archive/results-view-summary.html) | Results Summary + options panel: show/hide + container-query responsiveness | 2026-06-08 | 2026-07-13 |
| [`archive/results-hierarchical-selection.html`](https://moderneinc.github.io/prototypes/archive/results-hierarchical-selection.html) | Results hierarchy: drill repo → package → file → class → method (tree vs group-by) | 2026-06-08 | 2026-07-13 |
| [`archive/results-faceted-filter.html`](https://moderneinc.github.io/prototypes/archive/results-faceted-filter.html) | Faceted filter bar (org/vcs/branch/status chips + free text) applied across the hierarchy & roll-ups | 2026-06-08 | 2026-07-13 |
| [`archive/data-tables-download.html`](https://moderneinc.github.io/prototypes/archive/data-tables-download.html) | Data tables with download + MVP vs AI-enhanced toggle | 2026-06-01 | 2026-07-13 |
| [`archive/data-tables-download-v2.html`](https://moderneinc.github.io/prototypes/archive/data-tables-download-v2.html) | Data tables download (v2) | 2026-06-01 | 2026-07-13 |
| [`archive/day-zero.html`](https://moderneinc.github.io/prototypes/archive/day-zero.html) | Superseded by [`day-zero-revised.html`](https://moderneinc.github.io/prototypes/day-zero-revised.html) | 2026-04-29 | 2026-07-10 |
| [`archive/moddy.html`](https://moderneinc.github.io/prototypes/archive/moddy.html) | Moddy prompt input | 2026-05-20 | 2026-07-10 |
| [`archive/moddy-trigrep.html`](https://moderneinc.github.io/prototypes/archive/moddy-trigrep.html) | Superseded by [`moddy-trigrep-revised.html`](https://moderneinc.github.io/prototypes/moddy-trigrep-revised.html) | 2026-05-20 | 2026-07-10 |
| [`archive/moddy-trigrep-split.html`](https://moderneinc.github.io/prototypes/archive/moddy-trigrep-split.html) | Superseded by [`moddy-trigrep-revised.html`](https://moderneinc.github.io/prototypes/moddy-trigrep-revised.html) | 2026-05-28 | 2026-07-10 |
| [`archive/moddy-trigrep-combined.html`](https://moderneinc.github.io/prototypes/archive/moddy-trigrep-combined.html) | Superseded by [`moddy-trigrep-revised.html`](https://moderneinc.github.io/prototypes/moddy-trigrep-revised.html) | 2026-05-28 | 2026-07-10 |
| [`archive/moderne-dashboard.html`](https://moderneinc.github.io/prototypes/archive/moderne-dashboard.html) | Moderne dashboard layout | 2026-05-01 | 2026-07-10 |
| [`archive/org-selector.html`](https://moderneinc.github.io/prototypes/archive/org-selector.html) | Org selector with centered modal picker | 2026-06-02 | 2026-07-10 |
| [`archive/status-audit.html`](https://moderneinc.github.io/prototypes/archive/status-audit.html) | Status reference by artifact — every repository status with SaaS chip (label + where) and CLI trigger side by side | 2026-06-12 | 2026-07-10 |
| [`archive/statuses-update.html`](https://moderneinc.github.io/prototypes/archive/statuses-update.html) | Status palette update | 2026-06-12 | 2026-07-10 |
| [`archive/trigrep.html`](https://moderneinc.github.io/prototypes/archive/trigrep.html) | Superseded by `trigrep-revised.html` | 2026-05-28 | 2026-07-10 |
| [`archive/trigrep-activity.html`](https://moderneinc.github.io/prototypes/archive/trigrep-activity.html) | Trigrep + activity page combined view | 2026-06-12 | 2026-07-10 |
| [`archive/trigrep-revised-rebrand.html`](https://moderneinc.github.io/prototypes/archive/trigrep-revised-rebrand.html) | Trigrep revised with warm-dark 2026 rebrand | 2026-06-12 | 2026-07-10 |
| [`archive/design-system-explorer/`](https://moderneinc.github.io/prototypes/archive/design-system-explorer/) | **Dark-mode SaaS + Docs design system** — live theme builder, foundations, components, data-viz, and recreated Moderne screens. Built multi-page app; source in [`archive/design-system-explorer-src/`](archive/design-system-explorer-src/) (`npm run build`) | 2026-07-10 | 2026-07-10 |
| [`archive/left-nav-design-vs-shipped.html`](https://moderneinc.github.io/prototypes/archive/left-nav-design-vs-shipped.html) | Left-nav rail **design vs. shipped** — real renders of the `left-nav-compact` prototype next to the shipped `NeoSideNav` (`#8439`), expanded/collapsed, with a breakdown of what actually differs | 2026-07-07 | 2026-07-10 |
| [`archive/design-system/`](https://moderneinc.github.io/prototypes/archive/design-system/) | Early design-system reference page | 2026-07-10 | 2026-07-10 |
| [`archive/recipe-detail-preview/`](https://moderneinc.github.io/prototypes/archive/recipe-detail-preview/) | Recipe-detail preview explorations (master template, single/multi-language, composite, look-alike variants) | 2026-07-10 | 2026-07-10 |

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
