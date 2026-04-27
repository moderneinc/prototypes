# Pattern — Subcommand listing help

The visual treatment of help for a non-leaf command — i.e., a command whose primary purpose is to host other commands. Examples: `mod config -h`, `mod git -h`.

## When this pattern applies

- A command whose `@Command` registration includes `subcommands = { … }` and whose own behavior is mostly delegation.
- The user has invoked it with `-h`, `--help`, or no arguments expecting to see what's underneath.

## What the user sees

```
Configure how mod connects to Moderne, your repos, and your build tools.

USAGE
  mod config <subcommand> [flags]

SETUP (required)
  moderne   Connect to Moderne and authenticate.
  http      Configure SSL trust store for HTTPS.
  recipes   Configure where the CLI fetches recipes from.
  lsts      Configure where the CLI stores LSTs.
  build     Configure how the CLI invokes Maven and Gradle.

AUTO-CONFIGURED
  cli       CLI runtime defaults (usually fine as-is).
  log       Logging level and rotation.

OPTIONAL
  user      User-level identity (overrides per-repo defaults).

LEARN MORE
  Run mod config <subcommand> -h for details.
  Show all subcommands: mod config -h --all
```

## Visual anatomy

| Element | Token | Notes |
| --- | --- | --- |
| One-line summary | `typography.supporting` | Sentence-case, period. Sits at the top with no header above it. |
| `USAGE` block | `typography.section_header` + `typography.primary` | Standard. Placeholders inside in `typography.supporting`. |
| Triaged group headers (`SETUP (required)`, `AUTO-CONFIGURED`, `OPTIONAL`) | `typography.section_header` | ALL CAPS. The parenthetical (e.g. `(required)`) is part of the header text, same weight and casing. |
| Subcommand row | `color.semantic.info` (cyan, command) + `typography.supporting` (description after two-space gap) | Single line per subcommand. Description is a sentence ending in a period. |
| `LEARN MORE` block | `color.semantic.info` for the drill-into hint command; `typography.supporting` for surrounding prose | Last block. |

## Spacing

- One-line summary → `USAGE`: one blank line.
- Each triaged group: one blank line above its header.
- Within a group: rows are stacked with no inter-row blank lines; columns are aligned by the widest subcommand name across that group.
- Description column begins at `(widest_subcommand_name + 3 spaces)` from the start of the subcommand column.

## Composition rules

- Triaged groups are user-role groupings, not alphabetical bins. The order within a group is meaningful (`SETUP` is in roughly the order a new user would touch them); the order across groups is `(required) → AUTO-CONFIGURED → OPTIONAL`.
- A subcommand appears in exactly one group.
- The `LEARN MORE` block always offers two paths: drill into one subcommand (`mod <group> <subcommand> -h`) and see the full unfiltered listing (`mod <group> -h --all`).
- The unfiltered `--all` listing is the same pattern as this one but renders every subcommand alphabetically without grouping. (This is the "fall-back when triage doesn't apply" shape.)

## Worked examples

**Derived** — Annie's `cli-help-text-rewrites.pdf` proposal for `mod config -h` introduces the `SETUP (required) / AUTO-CONFIGURED / OPTIONAL` triage explicitly. The example above renders that proposal.

**Extrapolated** — `mod git -h`, `mod run -h` (subcommand-listing variants of these), and the `--all` ungrouped fallback are not in the artifacts. They are extrapolated from `mod config -h`. → flagged in `gaps.md` Part A.

## Out of scope (this pattern)

- Which specific subcommands belong to `SETUP` vs. `AUTO-CONFIGURED` vs. `OPTIONAL` for any given parent command — product / IA call. The visual system codifies the *triage shape*; the per-command triage is `gaps.md` Part B.
- Whether the triage groups should be applied to other parent commands at all (`mod git`, `mod run`?) — IA, not visual. → `gaps.md` Part B.
- Whether `--all` is the right flag name for the un-triaged listing — flag design is out of scope.
