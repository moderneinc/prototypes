# Morpheus Theme — Token Migration Plan

**Scope:** evolve the existing `@moderneinc/neo-design` → MUI token pipeline in `moderne-ui` so the application can render the Morpheus visual language (as prototyped in [`morpheus.html`](https://moderneinc.github.io/prototypes/morpheus.html)) **without replacing the token architecture**. No code changes are part of this document.

**Sources:** audit of `moderne-ui` (`themes/moderne-theme.ts`, `pages/_app.tsx`, `styles/global.css`, `constants/devcenter.ts`, `components/styled-components/*`, biome lint plugins, `.claude/rules/neo-design-system.md`) and the Morpheus token set in `morpheus.html` (WCAG 2.1 AA is baked into those values by default).

---

## 1. Executive summary

The app already has the right bones: an external primitive+semantic token package (`neo-design`), a thin MUI adapter (`moderne-theme.ts`), a component library (`neo-styled-components`) that consumes tokens internally, centralized chart scales, a **latent dark palette that has never been activated**, and lint rules that ban raw values. Morpheus is therefore a **re-valuing exercise, not a re-architecture**: ~80% of the theme lands by changing token *values* behind the existing semantic names, ~15% needs new semantic tokens (surface/border tiers, link pairing, data-viz category), and ~5% is targeted component-level change (button radius, side-nav elevation).

The five changes users will actually notice, in descending order of blast radius:

1. **Dark mode exists** — Morpheus is dual-mode; the app's latent `darkPalette` gets real values and a toggle.
2. **Buttons stop being pills** — `borderRadius.button` 999 → 4 (one token + one MUI override). Status badges/tags stay pill (`borderRadius.full` untouched).
3. **Fonts** — Inter → Geist Sans, JetBrains Mono → Geist Mono (two `next/font` lines + Neo `fontFamily` tokens), plus the Morpheus "mono for data" idiom.
4. **Warm neutrals** — cool grey-white surfaces → cream/ink in light, near-black elevation ramp in dark.
5. **Charts** — the categorical scale becomes the Morpheus "candy" ramp with mandatory deep boundary rings in light mode (that's what keeps SC 1.4.11 passing).

Accessibility is a constraint, not a follow-up: the Morpheus values were tuned so **every text pair ≥ 4.5:1 and every control boundary / chart mark ≥ 3:1 in both modes** (links use the Blue AAA pairing at 8.1:1 light / 6.4:1 dark). The migration must not regress those numbers, so the WCAG table in §9 is the release gate.

Because the primitives live in an external package, work splits into three tracks that can ship independently: **(a)** `neo-design` token additions/value changes (published under a `next` tag), **(b)** adapter mapping in `moderne-theme.ts`, **(c)** app-side cleanups (charts, deprecated ramps). Phases 1–2 are invisible-to-users; the visual flip happens in Phase 3.

---

## 2. Token audit (current system)

| Category | Where it lives today | Fit vs Morpheus |
|---|---|---|
| **Colors — primitives** | `neo-design` `colors.{grey, digitalBlue, digitalGreen, tealGreen, red, orange, gold, violet}[50–900]` + deprecated `moderneColors` ramps in `moderne-theme.ts` | Ramp *structure* fits; Morpheus needs two new hue families (ink `#232342`, warm-cream `#F2F0EA`) and a periwinkle (`#3E5BE8`/`#8CA0F5`). `digitalBlue` likely already contains the Blue AAA pair (`#1245AE`/`#7FA9F9` ≈ 700/300) — verify against installed package. Legacy `moderneColors` ramps are already `@deprecated`: accelerate removal. |
| **Colors — semantic** | `semanticColors.{status, typography, border, icons, surfaces, buttons, activity}` | Best interception point. `surfaces.{card, cardHeader, listHover}` and `border.{primary, secondary, focus}` map 1:1 onto Morpheus's card/card-head/row-hover and line/line2/line-strong. Gaps: **canvas vs card distinction** (Morpheus's dark elevation ramp), **link tokens** (Morpheus splits ink primary-action from Blue-AAA links), **warn/pending pills**, **data-viz category**. |
| **Typography** | Neo `typography.{fontFamily, fontSize, fontWeight, lineHeight}` + `semanticTypography.{body, titles}`; Inter/JetBrains Mono injected via `next/font` in `_app.tsx` | Scale structure fits (Morpheus runs a 14px body like `fontSize.default`). Family values change (Geist pair). New idiom to encode: **mono-for-data** (timestamps, hashes, counts, coordinates) with an 11.5px floor — best expressed as new `semanticTypography.data.*` styles rather than ad-hoc `fontFamilyMonospace` usage. |
| **Spacing** | Neo `spacing_1` = 8px base + fractions; MUI `theme.spacing` | **Reuse unchanged.** Morpheus was built on 4/8px rhythm; no changes required. |
| **Radius** | Neo `borderRadius.{xXS, xS, s, m, card:12, button:999, input:8, full}` + MUI default `shape.borderRadius` 4 + `MuiButton` override `borderRadius: 100` | `card:12` matches Morpheus exactly. **`button` changes 999 → 4** (the single most visible token flip). `input` 8 → 10. `full` stays for badges/pills/avatars. Add `control: 4` if `button` can't be re-valued safely upstream. |
| **Borders** | `semanticColors.border.{primary, secondary, focus}`; widths ad hoc | Morpheus formalizes three strengths: hairline (12% alpha), hairline-subtle (8%), **control-strong (50% light / 38% dark — the 3:1 AA tier)**. Needs a third semantic slot (`border.strong` or re-valued `primary`) plus a documented width rule (1px light / 0.5px dark hairlines). |
| **Shadows** | Neo `shadows.{card, dropdown, modal, drawer, neutral}` + MUI default 25-step array; one hard-coded card shadow in `cards.styled.tsx` | Morpheus is **flat**: `card` → none/hairline (biggest value change), `modal`/`dropdown` keep large soft shadows (`0 24px 64px` / `0 16px 44px` class). The hard-coded `ModerneCard` shadow gets deleted, not tokenized. |
| **Opacity** | Implicit (alpha baked into rgba tokens) | Keep alpha-in-token approach; document that contrast must be measured **composited over the backing surface** (that's how the Morpheus AA numbers were computed). |
| **Motion** | MUI defaults; no Neo motion tokens | Add three tokens: `motion.hover` 150ms ease, `motion.enter` 300–450ms ease (staged entrances), `motion.reduced` (respect `prefers-reduced-motion`). Low priority; Phase 4. |
| **Layout** | `constants/general.ts` (`NAVIGATION_RAIL_WIDTH` 98, `GLOBAL_NAV_HEIGHT` 65), zIndex in theme | Widths match the prototype already. Add Morpheus's **viewport-fit feed pattern** (card ends at viewport, internal scroll, sticky headers) as a layout recipe, not tokens. zIndex unchanged. |
| **Component tokens** | `diffAddition/diffRemoval/diffHeader` (theme), `pendingStatusTokens` (shim), `MODERNE_CHART_COLOR_SCALE` / `CHRONO_*` (constants), builder WebGL colors | Diff tokens get Morpheus values. `pendingStatusTokens` retires into proper Neo `status.{queued, active, canceled}` with Morpheus warn/pending values. Chart constants re-point to the new data-viz semantic tokens. Builder WebGL colors mapped by hand (tokens can't reach shaders) but *sourced* from the token sheet. |

**Redundant/obsolete:** the entire `moderneColors` legacy bag (already `@deprecated`), `CHRONO_MIGRATION_GRADIENT_COLORS` (hard-coded), the `ModerneCard` shadow, `body1/body2` deprecated variants, and the prototype's exploratory `--ds-*` OKLCH sheet in `design-system-explorer-src` (superseded by Morpheus — should be marked historical so it doesn't become a fourth naming system).

---

## 3. Token mapping table

Values shown as *light / dark*. "Neo" = change in `@moderneinc/neo-design`; "App" = change in `moderne-ui`.

### Surfaces & elevation

| Current token | New token (or new value) | Action | Reason |
|---|---|---|---|
| `palette.background.default` (`#F8F9FA` / `#1E1E1E`) | → `#F2F0EA` / `#141419` via `semanticColors.surfaces.canvasChrome` | **Update value + new semantic** | Morpheus separates chrome canvas (rail/topbar) from content canvas |
| — (gap) | `semanticColors.surfaces.canvasContent` = `#FBFAF6`* / `#1B1B21` | **Create new** | Dark mode needs the rail → canvas → card elevation ramp; light uses card tone |
| `semanticColors.surfaces.card` (`#FFFFFF` / `#121212`) | `#FBFAF6` / `#26262E` | **Update value** | Warm-white cards; dark cards read elevated above `#1B1B21` |
| `semanticColors.surfaces.cardHeader` | `#F2EFE7` / `#2D2D36` | **Update value** | Table heads / card heads |
| `semanticColors.surfaces.listHover` | `#F4F2EB` / `#2E2E38` | **Update value** | Row hover |
| — (gap) | `surfaces.sunken` = `#EDEBE2` / `#2A2A32`; `surfaces.sunken2` = `#E4E1D6` / `#33333D` | **Create new** | Morpheus `--surface`/`--surface2` (seg controls, code chips, kbd) |
| — (gap) | `surfaces.field` = `#FBFAF6` / `#222229` | **Create new** | Inputs/buttons sit one step off canvas in dark |
| `surfaces.scrim` | `rgba(35,35,66,.14)` / `rgba(15,15,20,.45)` | **Update value** | Mode-aware modal backdrop (light stays light) |

### Text & links

| Current token | New token (or new value) | Action | Reason |
|---|---|---|---|
| `text.primary` (`#343A40` / `#CED4DA`) → `semanticColors.typography.body` | `#232342` / `#F1F0EA` | **Update value** | Ink / cream body text (14.5:1 / 13.2:1 AAA) |
| `text.secondary` (= `indigo.main #00193D`) → `typography.bodySecondary` | `#62627A` / `#9C9CA8` | **Update value** | Muted tier tuned to clear 4.5:1 on card-head tones |
| — (gap) | `semanticColors.link.{default, hover}` = `#1245AE` / `#7FA9F9` | **Create new** | Morpheus splits links (Blue AAA pairing, 8.1:1 / 6.4:1) from the primary action color; today links ride `primary.main` |
| `primary.main` (= `digitalBlue[500]`) | keep for accent/info; **buttons re-map** (below) | **Reuse + re-scope** | Accent-blue remains for info states, focus, selection tints |

### Actions (buttons)

| Current token | New token (or new value) | Action | Reason |
|---|---|---|---|
| `semanticColors.buttons.primary.default` | `#232342` bg / `#FBFAF6` fg — dark mode: `#F1F0EA` bg / `#17171C` fg | **Update value** | Ink primary button is the Morpheus signature (14.5:1 / 15.6:1 labels) |
| `borderRadius.button` (999) + `MuiButton` override `borderRadius: 100` | `4` | **Update value (Neo) + delete override (App)** | 4px rectangles everywhere; the pill override in `moderne-theme.ts` is removed rather than re-valued |
| `borderRadius.full` | unchanged (999) | **Reuse** | Status pills, tags, avatars, count badges stay pill — explicit design rule |
| `buttons.secondary.hoverBackground` | `surfaces.sunken` | **Alias** | Secondary/ghost buttons hover to the sunken tone |

### Borders

| Current token | New token (or new value) | Action | Reason |
|---|---|---|---|
| `semanticColors.border.secondary` | `rgba(35,35,66,.12)` / `rgba(240,240,246,.12)` | **Update value** | Hairline separators (decorative; exempt from 3:1) |
| — (gap) | `border.subtle` = `.08` alpha pair | **Create new** | Second hairline tier (row dividers) |
| `semanticColors.border.primary` | `rgba(35,35,66,.50)` / `rgba(240,240,246,.38)` | **Update value** (rename to `border.strong` optional) | **The AA tier**: control boundaries at 3.1:1 / 3.2:1 composited |
| `border.focus` | `#1245AE` / `#7FA9F9` | **Update value** | Focus rings ride the link pairing (pairs with existing `focusRingStyles`) |

### Status & feedback

| Current token | New token (or new value) | Action | Reason |
|---|---|---|---|
| `status.success.{default,light,dark}` | text `#1D5937` / `#30F284`; tint `rgba(48,242,132,.15/.13)`; border `rgba(29,89,55,.65)` / `rgba(48,242,132,.55)` | **Update value** | Strand Green pair; pill text 7.4:1 AAA, borders 3.4–4:1 |
| `status.error.*` | text `#C9291C` / `#FA826F` + tint/border set | **Update value** | 5.3:1 / 6.1:1 |
| `status.warning.*` | text `#935B00` / `#FFA83D` + `rgba(255,168,61,.16/.12)` tints | **Update value** | Morpheus amber (Skipped / No LST pills) |
| `pendingStatusTokens` (app shim: `queued/active/canceled` purples) | Neo `status.{queued, active}` = periwinkle pair `#3E5BE8`/`#8CA0F5`; `status.neutral` = muted+sunken pill | **Replace + deprecate shim** | Closes the documented gap (moderne-ui#8435) with Morpheus hues instead of the temp purples |
| `activity.recipeRun` (`#9A25BB`-family) | `violet` primitives unchanged | **Reuse** | Recipe-run violet indicator carries over |

### Selection controls (checkbox / radio)

| Current token | New token (or new value) | Action | Reason |
|---|---|---|---|
| MUI Checkbox defaults via `themes/component-defaults/mod-mui-checkbox.tsx` (`theme.palette.grey` + solid accent fill / white glyph when checked) | `control.border` → alias `border.strong`; `control.borderSelected` + `control.glyph` → alias `link.default` (`#1245AE` / `#7FA9F9`); fill stays `surfaces.card` in **all** states | **Create new (aliases) + re-point component default** | Morpheus checkboxes are **outline-style**: checked/indeterminate render an accent border + accent glyph on the card fill instead of a solid fill — glyphs measure 8.1:1 / 6.4:1, borders ride the AA tier |
| — (gap: no indeterminate treatment) | indeterminate state = same `control.*` tokens with a minus glyph | **Create state** | Partially-selected tree roots (org rows) now show a true indeterminate mark; aligns with the in-flight results-tree work (`tree-component-update.html` prototype / `feat/update-results-view-tree`) which specifies checked / indeterminate / unchecked / no-checkbox rows |

### Progress, loading & empty states

| Current token | New token | Action | Reason |
|---|---|---|---|
| — (gap) | `progress.track` → alias `accent-tint`; `progress.fill` + `progress.label` → alias accent; percent text uses `semanticTypography.data.small` | **Create new (aliases)** | The Dev Center "Updating data — 0% Running" chip; generalizes to any inline progress |
| `NeoLoadingSpinner` internals | spinner = `buttons.primary` pair (bg circle + fg arc); `motion.spin` = 800ms linear infinite | **Create new** | The running-state spinner button; loading indicators are the accepted exception to entrance-motion reduction (state conveyance), which the plan records explicitly |
| Static empty-state illustrations (baked-color SVG assets, e.g. the DevCenter interstitial art) | `illustration.{panel: surfaces.card, stroke: border.strong, strokeMuted: icons.utility, inset: surfaces.sunken, accent: periwinkle[500/300], positive: status.success.default}` | **Create new (alias set) + replace assets** | Morpheus interstitials draw illustrations from semantic tokens (SVG `currentColor`/vars) so the art re-colors per mode — static assets with hard-coded fills can't follow a dual-mode theme |

### Data-viz (new category)

| Current token | New token | Action | Reason |
|---|---|---|---|
| `MODERNE_CHART_COLOR_SCALE` (Neo hues + `99` alpha suffix) | `semanticColors.dataviz.categorical[1..n]` = coral `#FF6F61`, orange `#FF8F52`, tangerine `#FFA83D`, gold `#FFD34D`, green `#30F284`, periwinkle `#3E5BE8`/`#8CA0F5`, teal `#25D0C0`, lilac `#B39DEB` | **Create new + re-point constant** | One palette across modes; solid fills (drop the alpha-suffix trick) |
| — (gap) | `dataviz.boundary.*` = deep rings: `#A63325`, `#A34E14`, `#935B00`, `#806A00`, `#1D5937`, `#82806F` | **Create new** | **Light-mode marks carry SC 1.4.11 via 3:1+ boundary rings** — this pairing is load-bearing, not decorative |
| `CHRONO_MIGRATION_GRADIENT_COLORS` (hard-coded 8 hexes) | `dataviz.severity[1..n]` (coral→gold→green ramp) | **Replace** | Removes the last hard-coded product palette |
| — (gap) | `dataviz.na` = `#DEDBD0`+ring / `#75757F`; `dataviz.grid` = 10–12% ink/paper | **Create new** | N/A marks and chart gridlines |

### Typography & radius & shadows

| Current token | New token (or new value) | Action | Reason |
|---|---|---|---|
| `typography.fontFamily.body` (Inter via `next/font`) | Geist Sans | **Update value** (App `_app.tsx` + Neo default) | |
| `typography.fontFamily.code` (JetBrains Mono) | Geist Mono | **Update value** | |
| — (gap) | `semanticTypography.data.{default, small}` (mono, 12 / 11.5px floor) | **Create new** | Codifies mono-for-data (hashes, timestamps, counts, coordinates) |
| `borderRadius.input` (8) | 10 | **Update value** | Inputs/selects/search |
| `borderRadius.s` (8) | unchanged | **Reuse** | Seg controls, menus’ inner items |
| `shadows.card` | `none` (hairline border instead) | **Update value** | Flat Morpheus surfaces |
| `shadows.modal` / `shadows.dropdown` | `0 24px 64px rgba(0,0,0,.35)` / `0 16px 44px rgba(10,10,25,.20)` | **Update value** | Only floating layers cast shadows |
| `ModerneCard` hard-coded `boxShadow` | — | **Deprecate/delete** | Superseded by flat card token |

\* Light mode uses the card tone for the content canvas; the ramp distinction matters most in dark mode.

---

## 4. New tokens to introduce (hierarchy placement)

**Primitive (in `neo-design` `colors`):**
- `ink[50–900]` ramp anchored on `#232342` (with `#17171C` low end) — new hue family, reused by text, buttons, scrims.
- `cream[50–900]` warm-neutral ramp anchored on `#F2F0EA`/`#FBFAF6`/`#F2EFE7`/`#EDEBE2`/`#E4E1D6`.
- `periwinkle[300, 500]` = `#8CA0F5`, `#3E5BE8` (rose charts, queued status, Moddy accents).
- Candy chart hues if absent from existing ramps: `coral #FF6F61`, `tangerine #FFA83D` (map orange/gold shades where possible first — prefer extending existing ramps over new families).
- *Why primitive:* raw hue material referenced by multiple semantics; no intent attached.

**Semantic (in `neo-design` `semanticColors` / `semanticTypography`):**
- `surfaces.{canvasChrome, canvasContent, field, sunken, sunken2}` (extends existing surfaces).
- `border.{subtle, strong}` (extends existing border).
- `link.{default, hover, visited?}`.
- `dataviz.{categorical[], boundary[], severity[], na, grid}`.
- `status.{queued, active}` re-homed from the app shim.
- `control.{border, borderSelected, glyph}` — selection controls (checkbox/radio), all three as aliases of `border.strong` / `link.default`.
- `progress.{track, fill, label}` — inline progress chips and bars (aliases of accent tint / accent).
- `illustration.{panel, stroke, strokeMuted, inset, accent, positive}` — empty-state artwork palette (pure alias set; see §8).
- `semanticTypography.data.{default, small}`.
- `motion.{hover, enter, spin}` (`spin` = 800ms linear infinite; loading indicators are the recorded exception to reduced-motion entrance suppression).
- *Why semantic:* each encodes intent that many components share; values differ per mode.

**Component (stay app-side or in `neo-styled-components`):**
- `diffAddition/diffRemoval/diffHeader` (already component-scoped in the theme — re-value only).
- DataGrid row/header heights (already deliberately component-scoped).
- Builder WebGL constants (documented as manually-synced derivatives of the token sheet).
- *Why component:* single-consumer values; promoting them to semantic would be false generality.

---

## 5. Existing tokens to update vs deprecate

**Update in place (value-only, name survives):** all `semanticColors.surfaces.*`, `border.*`, `typography.*`, `buttons.primary.*`, `status.{success,error,warning,info}`, `shadows.{card,modal,dropdown}`, `borderRadius.{button,input}`, `fontFamily.{body,code}`, MUI `palette.{background, text, primary, secondary}` mappings in the adapter, `diff*` tokens.

**Deprecate → remove:**
- `moderneColors` legacy ramps (`newGreys`, `grey`, `red`, `green`, `blue`, `indigo`, `violet`, `roseate`, `black` bags) — already `@deprecated`; Phase 5 removes after usage burn-down (helpers `textColor()`/`backgroundColor()` re-pointed first).
- `pendingStatusTokens` shim file.
- Baked-color empty-state illustration assets (replaced by token-driven SVGs; see §3 "Progress, loading & empty states").
- `mod-mui-checkbox.tsx` grey-palette defaults (re-pointed at `control.*`).
- `CHRONO_MIGRATION_GRADIENT_COLORS`.
- `MuiButton` `borderRadius: 100` override (function moves into the token).
- `body1`/`body2` deprecated variants (existing plan, unchanged).
- Prototype `--ds-*` OKLCH sheet: mark as historical exploration in its README.

---

## 6. Component impact analysis

| Component / area | Impact | Why |
|---|---|---|
| `NeoButton` / `NeoIconButton` (280+110 uses) | **High** | Radius 999→4 + ink primary — every screen, but changes ride two tokens; audit snapshot for layout shifts where pill width mattered |
| `NeoSideNav` + global nav | **High** | Dark chrome elevation ramp, near-black rail, active tints; dual-mode behavior is new |
| Charts (devcenter, chrono, x-charts, chart.js) | **High** | New categorical palette **plus** boundary-ring pattern in light mode (needs per-library stroke support; verify chart.js/x-charts APIs) |
| Dark mode debut (whole app) | **High** | Not a component, but the QA surface doubles; latent `darkPalette` was never exercised |
| `NeoDataGrid` / tables | **Medium** | Surface/hairline/typography value flips; sticky-header + viewport-fit pattern optional follow-on |
| `NeoModal` / `NeoMenu` / `NeoToast` / `NeoAlert` | **Medium** | Shadow re-values, scrim lightening, warn/pending status recolors |
| `NeoInputField` / `NeoSelect` / filters | **Medium** | Radius 8→10, `border.strong` at AA alpha, field surface token |
| `NeoCheckbox` / `NeoRadio` / DataGrid selection column + `mod-mui-checkbox.tsx` | **Medium** | Outline style replaces solid accent fill (checked/indeterminate = accent border + accent glyph on card fill); MUI `indeterminate` prop wired on tree/grid roots; coordinate with the in-flight `feat/update-results-view-tree` work |
| Empty states / interstitials (DevCenter no-runs, error pages, zero-result views) | **Medium** | Baked-color illustration assets replaced with token-driven SVGs (`illustration.*`); each empty state needs a per-mode render check |
| `NeoLoadingSpinner` / inline progress | **Low** | Re-colors via `progress.*` + `buttons.primary` pair; `motion.spin` token |
| Typography everywhere | **Medium** | Family swap is global but metric-similar (Geist ≈ Inter widths); spot-check truncation and dense tables |
| Diff viewer | **Medium** | `diff*` token re-values on new su/er tints |
| `NeoBadge` / `NeoTag` / status pills | **Low** | Stay pill; colors ride status token updates |
| Builder 3D graph | **Low–Medium** | Manual WebGL color sync; `builderTheme` already supports dark |
| Login / unauthenticated layout | **Low** | Two hard-coded hexes replaced; Morpheus login is a new composition |
| Marketplace / list pages | **Low** | Pure token consumers; readable max-width is a layout recipe |

---

## 7. Migration strategy (phased)

**Phase 0 — Baseline (no changes).** `npm install` and extract literal values from `neo-design/dist/*.css` to finalize this table against real current values (this plan flags every place that matters). Capture Storybook screenshot baselines for the components in §6.

**Phase 1 — Additive tokens (no visual change).**
Upstream in `neo-design@next`: add ink/cream/periwinkle primitives, new semantic slots (`surfaces.*`, `border.{subtle,strong}`, `link.*`, `dataviz.*`, `status.{queued,active}`, `control.*`, `progress.*`, `illustration.*`, `semanticTypography.data.*`, `motion.*`) with **current-look-compatible values or aliases** (e.g. `border.strong` initially aliases `border.primary`). App upgrades the dependency. Existing components render pixel-identical. *Exit gate: zero visual diffs.*

**Phase 2 — Light-mode value flip.**
Re-value the semantic tokens to Morpheus light in `neo-design@next`; swap fonts to Geist in `_app.tsx`; flip `borderRadius.button` → 4 and delete the `MuiButton` pill override; re-point links to `link.*`. One release train, feature-flagged if possible (`cssVariables: true` makes a runtime flag cheap). *Exit gate: Storybook diffs reviewed; WCAG checklist (§9) green in light mode; biome passes.*

**Phase 3 — Dark mode activation.**
Fill `darkPalette` from Morpheus dark tokens (the mapping table's second values); add `appTheme: 'light' | 'dark' | 'system'` to `stores/user-preference.store.ts` (precedent: `builderTheme`); surface a toggle in the account menu; default `system`. *Exit gate: full-app dark QA; WCAG checklist green in dark; elevation ramp (rail `#141419` → canvas `#1B1B21` → card `#26262E`) verified on the five table pages + Dev Center.*

**Phase 4 — Component & data-viz tokens.**
Re-point `MODERNE_CHART_COLOR_SCALE` and `CHRONO_*` at `dataviz.*`; implement light-mode boundary rings per chart library; retire `pendingStatusTokens` into `status.{queued,active,canceled}`; re-value `diff*`; re-point `mod-mui-checkbox.tsx` at `control.*` and wire the indeterminate state where trees/grids partially select (coordinate with `feat/update-results-view-tree`); replace baked-color empty-state illustrations with token-driven SVGs on `illustration.*`; re-color `NeoLoadingSpinner`/progress chips via `progress.*`; sync builder WebGL constants; add motion tokens to the entrance animations.

**Phase 5 — Cleanup.**
Delete `moderneColors` legacy ramps + helpers after usage burn-down, remove the `ModerneCard` shadow and remaining deprecated variants, tighten biome plugins (ban `theme.palette.<legacy-ramp>` access), archive the `--ds-*` prototype sheet.

---

## 8. Avoiding design debt

- **Do not add a fourth naming system.** Morpheus lands inside Neo's existing `semanticColors.*` dotted-path convention. The prototype's `--morpheus`/`--ds-*` CSS names die with the prototype.
- **Prefer re-valuing over renaming.** `surfaces.card` keeps its name with a new value; renames (e.g. `border.primary` → `border.strong`) only where the current name actively misleads, and always via a deprecation alias for one release.
- **Alpha borders are a contract.** Keep rgba border tokens (they adapt to any surface) but document that AA compliance is measured composited over the named backing surface; add that compositing step to the token package's contrast tests so a future value tweak can't silently break 3:1.
- **Chart rings are paired tokens.** `dataviz.categorical[n]` without its `boundary[n]` fails accessibility in light mode — publish them as pairs and lint for lone usage.
- **One-off exceptions stay component-scoped.** Resist promoting DataGrid heights, WebGL colors, or the diff palette into semantics; single-consumer tokens at the semantic layer are how bags like `moderneColors` happen.
- **Kill the `99`-alpha-suffix idiom** in chart constants (string-concatenated alpha is un-lintable and mode-blind); solid dataviz tokens replace it.
- **`control.*`, `progress.*` and `illustration.*` are alias-only sets.** They own no values — every entry points at an existing semantic (`border.strong`, `link.default`, accent tints, `surfaces.*`, `status.success`). If one ever needs its own value, that's a signal the underlying semantic is wrong, not a license to fork. This keeps the new categories from becoming maintenance surface.
- **Illustrations are code, not assets.** Empty-state art ships as inline SVG consuming tokens; exporting flattened SVGs/PNGs from design tools reintroduces baked colors that can't follow mode switches.

---

## 9. Risks & validation checklist

**Risks**
| Risk | Mitigation |
|---|---|
| External-package coordination (`neo-design` versioning vs app release) | Phase 1 is additive-only; app pins exact `next` versions; adapter tolerates both old/new via aliases |
| Pill→4px button radius reads as regression to some users | Ship with release notes + screenshots; it's one token to revert |
| Geist metric drift (truncation, dense tables) | Metric-similar to Inter; Storybook diff pass + `font-display` swap check |
| Dark mode doubles QA surface on debut | Phase-gated; `system` default only after a soak with manual toggle |
| Chart libraries can't stroke marks (rings) | Verified escape hatch: render ring as a second series/borderColor (chart.js `borderColor`, x-charts `stroke`); worst case keep deep-fill variants for light mode |
| Alpha tokens measured on wrong background | Composite-then-measure rule encoded in token tests (§8) |
| Latent dark `diff*`/status colors were never real — no baseline | Treat dark values as new work, not regressions; use the prototype as the reference render |

**Validation checklist (every phase)**
- [ ] WCAG 2.1 gates, both modes (from the prototype's live audit panel): body ≥ 13:1, muted ≥ 4.5:1, links ≥ 6:1 (Blue AAA pairing), button labels ≥ 14:1, status-pill text ≥ 7:1, control borders ≥ 3:1 composited, chart marks/rings ≥ 3:1 light, N/A marks ≥ 3:1.
- [ ] `npm run check:all` + biome token-lint plugins pass (no new raw hex/font-size/spacing/shadow).
- [ ] Storybook visual diffs reviewed for §6 High/Medium components.
- [ ] No `moderneColors.*` usage added (grep gate).
- [ ] Status pills still pill-shaped; buttons 4px (explicit both-direction check).
- [ ] `prefers-reduced-motion` honored on any animated entrance (loading spinners exempt as state indicators — recorded decision).
- [ ] Selection controls: checked/indeterminate glyph and border ≥ 3:1 in both modes (outline style has no fill to lean on); indeterminate renders where selection is partial.
- [ ] Empty-state illustrations render correctly in **both** modes (no baked colors; art follows the theme).
- [ ] Reference render parity spot-check against `morpheus.html` (Dev Center incl. `?dcempty=1` interstitial, Repositories table, Moddy, login) in both modes.

---

*Prepared as the productionization companion to the Morpheus v3 prototype. No code was modified.*
