# Construct — Figma plugin

A Figma plugin that interprets `tokens/canonical.json` into Figma components, text styles, and frames inside a Figma file. Designers run it to bring the canonical design system into Figma; re-runs reconcile what's there with what canonical now says.

This is the **Figma interpreter** for the Construct system — a peer to `lib/interpreters/figma.mjs` (build-time DTCG projection). The build-time interpreter projects tokens for Tokens Studio import; this plugin projects components for designer use.

## Install

1. Build the plugin from canonical (run after every canonical change):

   ```
   npm run figma-plugin:rebuild
   ```

   This regenerates `tokens/canonical.json` from `design-system/tokens.json`, then bakes it into `lib/interpreters/figma-plugin/code.js`.

2. In Figma desktop, open the target file and go to **Plugins → Development → Import plugin from manifest…**

3. Select `lib/interpreters/figma-plugin/manifest.json`.

4. Run the plugin: **Plugins → Development → Construct**.

5. In the plugin window, click **Sync from canonical** (or **Dry run** to preview).

## What it generates

| Layer | Output |
| --- | --- |
| Text styles | 6 styles named `Construct/<role>` (section header, primary, supporting, metadata, inline command, banner phrase) |
| Atoms | 9 glyph component sets, 12 variants total — `glyph/<name>` with `color=<path>` variant property |
| Molecules | 10 row components (`section-header-row`, `recovery-action`, `hint-row`, etc.) |
| Organisms | 9 section frames (`USAGE`, `WHAT WENT WRONG`, `TRY`, etc.) |
| Banners | 4 close-banner variants (success, partial-success, success-with-warnings, failure) |
| Templates | 7 full-screen frames (help / error / progress / close screens) |

Components are organized onto pages: `Construct / Atoms`, `Construct / Molecules`, `Construct / Organisms`, `Construct / Banners`, `Construct / Templates`.

## Idempotency

Re-runnable safely. Each generated node carries a stable `construct.key` in pluginData. On every sync:

1. Plugin walks the file and indexes existing nodes by `construct.key` (primary) and by exact name (fallback).
2. For each node it would create, it first checks: (a) is there an existing node with this key? If so, update properties in place. (b) Is there a node with the matching name but no key? Adopt it (stamp the key) and update.
3. Any existing node carrying a `construct.key` not present in the new run gets moved to the `Construct / _orphans` page — never silently deleted. The user reviews before removal.
4. A manifest is written to `figma.root` pluginData (`construct.manifest`) listing all keys the plugin owns.

**Property-level updates only.** The plugin sets `characters`, `fills`, `layoutMode`, `itemSpacing`, `padding`, etc. on existing nodes. It does not call `node.remove()` followed by `figma.createComponent()` for any node found by key — designer instances stay linked across re-runs.

**Children of molecules and templates are rebuilt deterministically.** Their composition is fully derived from canonical, so the plugin clears child arrays before re-populating. The component identity is preserved (so `Component → Instance` references survive); only the children inside change. If you need to override a row inside a molecule, do it on the instance, not the main component.

## Templates: open question

Templates carry an extra pluginData field: `construct.review = "after-first-designer-use"`. Generated for v1 so designers have starting points, but the architectural question — *should templates live in the plugin (system generates) or downstream of it (designer composes from organisms)?* — is intentionally not decided here. Revisit after first round of designer feedback. The orphan/manifest mechanism makes either decision reversible.

## valid_colors — evidence trace

The plugin reads `glyph.<name>.$value.validColors` from canonical to determine glyph variants. All 9 entries trace back to existing `color_default` prose in `design-system/tokens.json`:

| Glyph | valid_colors | Source prose |
| --- | --- | --- |
| `section_marker` | `["semantic.danger", "text.primary"]` | "color.semantic.danger for error sections; color.text.primary for neutral action headers" |
| `actionable_bullet` | `["semantic.info", "text.metadata"]` | "color.semantic.info when the bullet leads a command; color.text.metadata when the entire row is demoted" |
| `success_marker` | `["semantic.success"]` | "color.semantic.success on the glyph" |
| `warning_marker` | `["semantic.warning"]` | "color.semantic.warning on the glyph" |
| `hint_marker` | `["semantic.warning"]` | "color.semantic.warning on the glyph + the leading word 'Hint:'" |
| `note_marker` | `["semantic.warning", "semantic.danger"]` | "color.semantic.warning when leading word is 'Note:'; color.semantic.danger when leading word is 'Error:' (per D-02)" |
| `child_connector` | `["text.supporting"]` | "color.text.supporting" |
| `shell_prompt` | `["text.metadata"]` | "color.text.metadata (dim gray)" |
| `diff_failure` | `["semantic.danger"]` | "color.semantic.danger" (extrapolated glyph; color choice unambiguous) |

**No judgment calls.** Every entry is grounded in existing prose. If canonical evolves, edit `design-system/tokens.json` and re-run `npm run figma-plugin:rebuild`.

## Sample run output

**First run** against an empty Figma file:

```
Sync starting
  + text-style: Construct/Section header
  + text-style: Construct/Primary
  ... (6 styles)
  + Construct / Atoms / Glyph / section_marker / color=semantic.danger
  + Construct / Atoms / Glyph / section_marker / color=text.primary
  ... (12 glyph variants in 9 sets)
  + molecule: section-header-row
  ... (10 molecules)
  + organism: USAGE section
  ... (9 organisms)
  + banner/close/success
  ... (4 banners)
  + template: Help screen / top-level  (review: after-first-designer-use)
  ... (7 templates)
Done.

Sync complete.
  57 created
  0 updated
  0 adopted
  0 orphaned
  0 unchanged
```

**Second run** against the same file with no canonical change, no manual edits:

```
Sync starting
  · text-style: Construct/Section header
  · text-style: Construct/Primary
  ...
  · Construct / Atoms / Glyph / section_marker / color=semantic.danger
  ...
  · molecule: section-header-row
  ...
  · template: Help screen / top-level  (review: after-first-designer-use)
Done.

Sync complete.
  0 created
  57 updated
  0 adopted
  0 orphaned
  0 unchanged
```

**Adoption case** — designer manually created `Construct / Molecules / hint-row` before first run; one of the 57 expected names matches:

```
Sync complete.
  56 created
  0 updated
  1 adopted
  0 orphaned
  0 unchanged
```

**Orphan case** — canonical evolved (e.g. one glyph variant removed); existing components carrying that key get moved to the `Construct / _orphans` page for review:

```
Sync complete.
  0 created
  56 updated
  0 adopted
  1 orphaned
  0 unchanged
```

## Alternative export paths

The plugin is the primary path: it writes variables, styles, and components directly into the open Figma file. For teams that prefer Tokens Studio's import workflow (or for sharing tokens with files where the plugin isn't installed), the build pipeline also emits `tokens/dtcg.json` (W3C DTCG format). Tokens Studio can ingest that file. The two paths are not mutually exclusive — both read from the same canonical and produce equivalent variables. Choose by team preference.

## Architecture

```
design-system/tokens.json           ← human-edited authoring source
        │
        ▼  scripts/build-tokens.mjs
tokens/canonical.json               ← validated, normalized canonical
        │                              (also: dtcg.json, figma-map.json)
        ▼  lib/interpreters/figma-plugin/build.mjs (bakes canonical in)
lib/interpreters/figma-plugin/code.js
        │
        ▼  Figma → Plugins → Development → Construct → Sync
[Figma file: components, styles, frames]
```

The plugin is a **runtime** interpreter. It does the same job as the build-time interpreter (`lib/interpreters/figma.mjs`) but on the canvas instead of in JSON. Both are downstream of canonical; both are versioned in the repo; both are regenerable.
