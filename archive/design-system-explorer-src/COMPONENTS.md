# SaaS Design System — component status board

Shared board for design ↔ front-end. This system is an **aesthetic exploration**:
the moderne.ai marketing language translated into SaaS application UI, light mode
first, dark mode mapping back to the shipped site palette. It is **not** a
replacement for the production `neo-design` / MUI system.

## Color model (revised)

- **Primary = green** (`--ds-primary`, light `#15cf76` / dark neon `#33ff99`) — the marketing
  hero. A **bright fill carrying dark text** (`--ds-on-primary`), like the site's CTA. Green
  **doubles as success** — green = brand = validated, exactly the marketing logic. The hue is
  swappable on the Foundations picker (a one-token change; candidates incl. cobalt/azure/magenta/violet).
- **Secondary** (`--ds-secondary*`, default violet) — a complementary accent (`.ds-btn--accent`, `.ds-badge--accent`). Primary + secondary are pickable live in the top-bar **Theme builder** (`src/lib/ds-theme.ts`), persisted across pages. It also themes TYPOGRAPHY — primary UI font (Poppins · Inter · Geist · System) + secondary mono (JetBrains · Geist Mono · IBM Plex · System), loaded on demand.
- **Status:** success = green · error = red (`--ds-danger` = AA white-text button fill) · warning = amber · info = blue.
- **Rainbow** = a 9-hue categorical palette (`--ds-cat-*` + `-ink`) for tags / wayfinding /
  data-viz. Never status.
- **Punchy, not pastel:** vivid fills + a colored primary glow (`--ds-primary-glow`), deepened
  soft tints, stronger hairlines.
- **Accessibility:** every meaningful pair passes WCAG AA in both themes (incl. colored text on the
  deeper tints) — audited by `.context/ds-a11y-check.mjs` (`node …` → 0 failures). See
  `/design-system/accessibility/`.

**Where things live**
- Tokens — `web/src/styles/ds-tokens.css` (dark is the default `:root`; a dormant `[data-theme="light"]` block remains)
- Base + gallery shell — `web/src/styles/ds-base.css`
- Component CSS — `web/src/styles/ds-components.css` (every class notes its MUI/moderne-ui map)
- Gallery pages — `web/design-system/*/index.html` (the static "Storybook")
- Shared partials — `web/partials/ds-*.html`
- Behavior — `web/src/lib/ds-chrome.ts` (active nav only; dark-only, no theme toggle)

**Status legend:** ✅ done (first pass) · ◐ draft · ☐ todo · ⏸ deferred (data/domain)

## First-pass primitives

| Component | Class | Maps to (moderne-ui / MUI) | Status |
|---|---|---|---|
| Button (primary/secondary/subtle/danger/icon, sizes, group) | `.ds-btn*` | `Button` / `IconButton` / `ButtonGroup` | ✅ |
| Text field | `.ds-input` | `TextField` | ✅ |
| Textarea | `.ds-textarea` | `TextField multiline` | ✅ |
| Select | `.ds-select` | `Select` | ✅ |
| Input w/ adornment | `.ds-input-wrap` | `TextField InputAdornment` | ✅ |
| Checkbox | `.ds-check input[type=checkbox]` | `Checkbox` | ✅ |
| Radio | `.ds-check input[type=radio]` | `Radio` | ✅ |
| Switch | `.ds-switch` | `Switch` | ✅ |
| Label / help / error text | `.ds-label` `.ds-help` `.ds-error-text` | `FormControl` parts | ✅ |
| Badge | `.ds-badge*` | `Chip` (small) / `Badge` | ✅ |
| Chip (removable) | `.ds-chip` | `Chip` | ✅ |
| Status dot | `.ds-status*` | `StatusIcon` | ✅ |
| Avatar + group | `.ds-avatar*` | `Avatar` / `AvatarGroup` | ✅ |
| Card | `.ds-card*` | `Card` / `ModerneCard` | ✅ |
| Table (static) | `.ds-table*` | `Table` / `DataGrid` (display) | ✅ |
| Tabs | `.ds-tabs` `.ds-tab` | `Tabs` / `Tab` | ✅ |
| Breadcrumbs | `.ds-breadcrumbs` | `Breadcrumbs` | ✅ |
| Menu / dropdown | `.ds-menu*` | `Menu` / `MenuItem` | ✅ |
| Left nav rail (+ compact) | `.ds-rail` | `NeoSideNav` — mirrors moderne-ui PR #8378 | ✅ |
| Side-nav list (labelled variant) | `.ds-navlist` | `NeoNavigationItem` | ✅ |
| Global nav bar | `.ds-appbar` | mirrors `GlobalNavigationBar` (org selector · search · actions) | ✅ |
| Pagination | `.ds-pagination` | `Pagination` | ✅ |
| Alert / callout | `.ds-alert*` | `Alert` / `InformationBox` | ✅ |
| Toast / snackbar | `.ds-toast` | `Snackbar` | ✅ |
| Tooltip | `.ds-tooltip` | `Tooltip` | ◐ (static demo) |
| Popover | `.ds-popover` | `Popover` | ◐ (static demo) |
| Dialog / modal | `.ds-dialog*` | `Dialog` / `ConfirmationDialog` | ◐ (static demo) |
| Drawer | `.ds-drawer*` | `Drawer` | ◐ (static demo) |
| Progress / spinner / skeleton | `.ds-progress` `.ds-spinner` `.ds-skeleton` | `LinearProgress`/`CircularProgress`/`Skeleton` | ✅ |
| Empty state | `.ds-empty` | `utilities/EmptyState` | ✅ |
| Segmented control | `.ds-segment` | `NeoToggleButtonGroup` | ✅ |
| Tag (categorical) | `.ds-tag` | `NeoTag` | ✅ |
| Filter / search chip | `.ds-chip--filter` | `NeoFilterChip` / `NeoSearchChip` | ✅ |
| List / list item | `.ds-list` `.ds-list-item` | `NeoListItem` / `NeoListItemButton` | ✅ |
| Divider | `.ds-divider` | `NeoDivider` | ✅ |
| Banner | `.ds-banner` | `NeoBanner` | ✅ |
| Code snippet | `.ds-code` | `NeoCodeSnippet` | ◐ (static) |
| Tree (static) | `.ds-tree` | `NeoTree` / `NeoTreeItem` | ◐ (static) |
| Data-grid header (sort) | `.ds-table th.sortable` | `NeoDataGridHeaderCell` | ◐ (visual) |

## Deferred (later passes — data/domain-heavy, mostly need real data)

⏸ Data-grid behaviors (sort/filter/paginate) · Tree view · Date / date-range pickers ·
Command palette · Global search · Code & diff viewers (unified + split) · Markdown /
Mermaid renderers · Charts / visualizations · Moddy AI chat · Builder · Results ·
Audit-log / access-token / user tables · GraphQL explorer · Guided tour · Split button.

## How the front-end picks this up

1. Each component class is named for the MUI/moderne-ui component it maps to — porting is mechanical.
2. The gallery pages (`web/design-system/*`) are the living state matrix: every component in
   default / hover / focus / disabled / error, in both themes (toggle in the top bar).
3. Canonical markup snippets live in `web/partials/ds-c-*.html` with an intent comment
   (props / states / map). Design authors intent; FE fills the binding.
4. Token names mirror neo-design's semantic intent where sensible, so the values can later
   be wired to real theme variables rather than re-derived.

## Known open design questions

- **Primary = violet** (resolved this pass). Open: is the violet hue right, or do we want a
  deeper/indigo or warmer variant? A blue alternative (neo-aligned) is a one-token swap of
  `--ds-primary*`.
- **Coverage toward neo's 77 components.** Done: the foundational primitives + segment, tag,
  filter chip, list, divider, banner, code, tree, data-grid header. Still deferred (need real
  data): data-grid behaviors (sort/filter/paginate), date pickers, command palette, diff
  viewers, charts, Moddy, builder, results, audit/user/token tables, GraphQL explorer.
- **Type face:** we keep Poppins (marketing identity); neo uses Inter. Confirm.
- **Code surfaces in light mode** are light (`--ds-code-bg`); decide whether to keep code
  blocks dark in both themes for the "lab readout" identity.
- **Feedback hues** (info/warning) add blue + amber beyond the two-signal. Confirm the fenced
  exception is acceptable for app status.
