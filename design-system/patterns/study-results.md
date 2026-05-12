# Pattern — Study Results

The visual treatment of `mod study --last-recipe-run` output — a per-repository breakdown of what a recipe changed, with status glyphs and a trailing forward-chain. A specialization of the `list.md` table form combined with the `success.md` forward-chain block.

## When this pattern applies

- `mod study --last-recipe-run` displays per-repo results from the most recent recipe execution.
- The output is a human-readable table of repositories with change status and file-level summaries, followed by next-step actions.
- Also applies to `mod study --recipe-run <id>` when targeting a specific past run.

## What the user sees

```
STUDY: UpgradeDependencyVersion

  ✓  org/service-a       3 files changed
  ✓  org/service-b       1 file changed
  ✓  org/service-c       7 files changed
  ⚠  org/payments         0 files changed (no LST)
  ✗  org/legacy-api       build failed

  5 repositories — 3 modified, 1 skipped, 1 failed.

WHAT TO DO NEXT
  ▶ mod diff --last-recipe-run           — Review changes across all repos.
  ▶ mod git commit --last-recipe-run     — Commit changes across repos.
  ▶ mod git push --last-recipe-run       — Push to remotes.

MOD SUCCEEDED in (1s)
```

## Visual anatomy

| Element | Token | Notes |
| --- | --- | --- |
| `STUDY: <RecipeName>` header | `typography.section_header` | ALL CAPS prefix `STUDY:` followed by the recipe's short name in regular weight. |
| Row glyph | `glyph.success_marker` (`✓`, green) / `glyph.warning_marker` (`⚠`, yellow) / `glyph.diff_failure` (`✗`, red) | Single character at column 0 within the indented row. Carries per-repo status. |
| Repository name column | `typography.primary` | The repo's org/name path. Regular weight. This is the row's identifier. |
| Change summary column | `typography.supporting` | Terse outcome per repo. For success: `N files changed`. For warnings: `0 files changed (cause)`. For failures: terse cause (`build failed`). |
| Trailing summary | `typography.supporting` | One line below the table. Restates total count and per-status breakdown. |
| `WHAT TO DO NEXT` | `typography.section_header` | ALL CAPS. Forward-chain block with multiple options. |
| `▶ <command> — <gloss>` | `glyph.actionable_bullet` (`▶`, cyan) + `color.semantic.info` (command) + `typography.supporting` (em-dash + gloss) | Each row pairs a runnable command with a one-line description. The em-dash is U+2014. Columns aligned by the widest command. |
| `MOD SUCCEEDED in (Xs)` | `banner.close.variants.success` | Green, bold, leading blank line. |

## Spacing

- `STUDY:` header to first row: zero blank lines.
- Between rows: zero blank lines.
- Last row to trailing summary: one blank line.
- Trailing summary to `WHAT TO DO NEXT`: one blank line.
- Within `WHAT TO DO NEXT`: rows stacked, no blank lines. Columns aligned by widest command across the block.
- `WHAT TO DO NEXT` to close banner: one blank line.
- All table content under the header is indented 2 spaces (`spacing.indent.section_content`).

## Composition rules

- This pattern combines the `list.md` table form (per-repo rows with status glyphs) with the `success.md` forward-chain block (`WHAT TO DO NEXT`).
- **Row glyph mapping**: `✓` for repos where the recipe made changes, `⚠` for repos that were skipped or had no LST (non-fatal), `✗` for repos where the build or recipe application failed.
- **Column alignment**: repo name and change summary are right-padded to the widest cell in each column, minimum two-space separator. No vertical rules.
- The trailing summary follows the `list.md` convention: `N repositories — X modified, Y skipped, Z failed.` Omit categories with zero count except when it would leave fewer than two categories.
- The `WHAT TO DO NEXT` block lists the logical workflow continuation after studying results. The commands reference `--last-recipe-run` because the study output is always in the context of a specific run.
- The close banner is `MOD SUCCEEDED` because the study command itself succeeded (it read and displayed data). The per-repo failures are in the *recipe run* that was studied, not in the study command.
- If all repositories failed in the studied run, the `WHAT TO DO NEXT` block is omitted (there are no changes to diff, commit, or push) and the close banner remains `MOD SUCCEEDED` — the study command still did its job.

## Extrapolations

- The column set (repo name, change summary) is extrapolated from what a study command would logically display. The design artifacts reference `mod study --last-recipe-run` in success.md's forward-chain but do not show the study output itself.
- The `STUDY: <RecipeName>` header format is extrapolated. The CLI may use a different header shape (e.g. just the recipe name without the `STUDY:` prefix).
- Whether the change summary should show file names (not just counts) is extrapolated as "no" for the default view. A `--verbose` flag could expand each row to list individual files.
- The `mod diff --last-recipe-run` entry in `WHAT TO DO NEXT` is extrapolated. The actual diff command and flags may differ.

## Out of scope (this pattern)

- The diff view itself (`mod diff` output) — that would use a specialized diff pattern, not this one.
- Whether `mod study` should support `--csv` / `--json` for machine-readable output — behavioral, uses `tokens.json $machine_readable` rules.
- Per-file detail within each repository row — interaction design decision (expand inline vs. separate command).
- The data-table variant of study (`mod study --data-table`) — may need its own pattern if the output shape differs significantly.
