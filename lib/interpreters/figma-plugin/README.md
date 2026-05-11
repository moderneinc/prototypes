# Construct — Figma plugin

A Figma plugin that interprets `tokens/canonical.json` into Figma components, text styles, and frames inside a Figma file. Designers run it to bring the canonical design system into Figma; re-runs show a diff of what changed and apply only the delta.

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

5. The plugin opens showing the diff preview automatically. Click **Apply** to write changes.

## Workflow

The plugin follows a diff-first model: open Figma, run Sync, see what changed — then confirm.

**First sync** (no prior history for this file):
- Plugin shows "N entities will be created" and an Initialize button.
- Click Initialize to create all components.

**Subsequent syncs**:
- Plugin computes what changed since last sync: added, modified, removed, unchanged.
- Diff is shown per entity key (e.g. `token/glyph/section_marker`, `banner/close/success`).
- Click **Apply N changes** to write only the delta, or **Cancel** to dismiss.
- After apply, click **→ view** next to any entity to jump to it in the canvas.

## What it generates

| Layer | Figma page | Output |
| --- | --- | --- |
| Text styles | (global) | 6 styles named `Construct/<role>` |
| Tokens | `Construct / Tokens` | 9 glyph component sets with `color=<path>` variant property |
| Rows | `Construct / Rows` | 10 row components (`section-header-row`, `recovery-action`, `hint-row`, etc.) |
| Sections | `Construct / Sections` | 9 section frames (`USAGE`, `WHAT WENT WRONG`, `TRY`, etc.) |
| Banners | `Construct / Banners` | 4 close-banner variants (success, partial-success, success-with-warnings, failure) |
| Patterns | `Construct / Patterns` | 7 full-screen frames (help / error / progress / close screens) |

## Idempotency

Re-runnable safely. Each generated node carries a stable `construct.key` in pluginData. On every sync:

1. Plugin walks the file and indexes existing nodes by `construct.key` (primary) and by exact name (fallback).
2. For each node it would create, it first checks: (a) is there an existing node with this key? If so, update properties in place. (b) Is there a node with the matching name but no key? Adopt it (stamp the key) and update.
3. Any existing node carrying a `construct.key` not present in the new run gets moved to the `Construct / _orphans` page — never silently deleted. The user reviews before removal.
4. A manifest is written to `figma.root` pluginData (`construct.manifest`) recording the hash of every entity in this build. The next sync diffs against it.

**Property-level updates only.** The plugin sets `characters`, `fills`, `layoutMode`, `itemSpacing`, `padding`, etc. on existing nodes — no `remove()` then `createComponent()` for any node found by key. Designer instances stay linked across re-runs.

## Diff model

`CANONICAL_HASHES` is a map from entity key → content hash, baked into `code.js` at build time. The manifest stores the same map from the last sync. On the next sync, the plugin compares:

- **Added**: key present in canonical but not in stored manifest.
- **Modified**: key present in both, but hash differs.
- **Removed**: key present in stored manifest but not in canonical (these become orphans).
- **Unchanged**: key present in both with matching hash.

Hash inputs:
- For glyphs and banners: `stableHash(canonical.glyph[name])` — the actual canonical data.
- For rows, sections, and patterns: SHA-256 of the builder file content — any spec edit triggers "modified."
- For text styles: SHA-256 of `tokens.js` content.

`stableHash` serializes objects with keys sorted recursively before hashing (SHA-256). A build-time self-check shuffles 3 glyph entities and re-hashes, throwing if hashes differ, so key-order drift can't silently break the diff.

## Key migration

When upgrading from a file synced before the vocabulary rename (Atoms/Molecules/Organisms/Templates → Tokens/Rows/Sections/Patterns), the plugin automatically migrates old-prefix `construct.key` values on the first sync. No designer action needed.

## Patterns: open question

Patterns carry an extra pluginData field: `construct.review = "after-first-designer-use"`. Generated for v1 so designers have starting points, but the architectural question — *should patterns live in the plugin (system generates) or downstream of it (designer composes from sections)?* — is intentionally not decided here. Revisit after first round of designer feedback. The orphan/manifest mechanism makes either decision reversible.

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

## Architecture

```
design-system/tokens.json           ← human-edited authoring source
        │
        ▼  scripts/build-tokens.mjs
tokens/canonical.json               ← validated, normalized canonical
        │                              (also: dtcg.json, figma-map.json)
        ▼  lib/interpreters/figma-plugin/build.mjs
           (bakes canonical + CANONICAL_HASHES into code.js)
lib/interpreters/figma-plugin/code.js
        │
        ▼  Figma → Plugins → Development → Construct → Preview → Apply
[Figma file: components, styles, frames]
```

The plugin is a **runtime** interpreter. It does the same job as the build-time interpreter (`lib/interpreters/figma.mjs`) but on the canvas instead of in JSON. Both are downstream of canonical; both are versioned in the repo; both are regenerable.
