# Pattern — Run History

The visual treatment of `mod log` output — a time-ordered list of past recipe runs with per-run status. A specialization of the `list.md` table form with status glyphs and a trailing summary.

## When this pattern applies

- `mod log` displays recent recipe runs.
- The output is a human-readable table of runs with timestamp, recipe name, status, and summary counts.
- Also applies to any future command that lists historical operations in a status-table format.

## What the user sees

```
RECENT RECIPE RUNS
  ✓  2026-05-12 14:32  UpgradeDependencyVersion       42 modified, 5 unchanged
  ✓  2026-05-11 09:15  CommonStaticAnalysis            38 modified, 9 unchanged
  ⚠  2026-05-10 16:44  MigrateToSpringBoot3            31 modified, 4 skipped
  ✗  2026-05-09 11:02  UpgradeToJava21                 0 modified — build failed

  4 runs — 2 succeeded, 1 partial, 1 failed.
```

### Empty state

```
RECENT RECIPE RUNS
  No recipe runs recorded.

  ▶ Run a recipe.
      mod run <path> --recipe <recipe-name>
```

## Visual anatomy

| Element | Token | Notes |
| --- | --- | --- |
| `RECENT RECIPE RUNS` header | `typography.section_header` | ALL CAPS. Names the list contents. |
| Row glyph | `glyph.success_marker` (`✓`, green) / `glyph.warning_marker` (`⚠`, yellow) / `glyph.diff_failure` (`✗`, red) | Single character at column 0 within the indented row. Carries per-run status. |
| Timestamp column | `typography.supporting` | Date + time in `YYYY-MM-DD HH:MM` format. Supporting color — the timestamp is reference metadata, not the primary content. |
| Recipe name column | `typography.primary` | The recipe's short name. Regular weight (bold is reserved for headers). This is the row's identifier. |
| Summary column | `typography.supporting` | Terse outcome: count + verb (`42 modified, 5 unchanged`). For failures: `0 modified — <cause>`. |
| Trailing summary | `typography.supporting` | One line below the table. Restates total count and per-status breakdown. |
| Empty-state line | `typography.supporting` | `No recipe runs recorded.` Sentence case, period, no glyph. |
| Empty-state recovery | `glyph.actionable_bullet` (`▶`, cyan) + `typography.supporting` action verb + `color.semantic.info` (command on next line) | Single recovery action. |

## Spacing

- Section header to first row: zero blank lines.
- Between rows: zero blank lines.
- Last row to trailing summary: one blank line.
- Section header to empty-state line (when empty): zero blank lines.
- Empty-state line to recovery `▶` block: one blank line.
- All content under the section header is indented 2 spaces (`spacing.indent.section_content`).

## Composition rules

- This pattern follows the `list.md` table form. The specialization is the fixed column set: glyph, timestamp, recipe name, summary.
- **Row glyph mapping**: `✓` for runs that succeeded (exit 0), `⚠` for partial success (exit -2, some repos skipped), `✗` for failures (exit non-zero, run aborted or all repos failed).
- **Column alignment**: columns are right-padded to the widest cell in each column, minimum two-space separator. No vertical rules.
- The trailing summary restates the total count and breaks down by status. Format: `N runs — X succeeded, Y partial, Z failed.` Omit categories with zero count except when it would leave fewer than two categories.
- The timestamp format is `YYYY-MM-DD HH:MM` (24-hour, local time). No seconds — the precision is not useful for run-level history.
- Runs are listed in reverse chronological order (most recent first).
- No close banner. `mod log` is an informational command — it reports history, it does not execute work.

## Extrapolations

- The entire example is extrapolated. Neither design artifact shows `mod log` output. The column set (timestamp, recipe name, summary) is inferred from what a run-history command would logically display.
- The trailing summary format (`N runs — X succeeded, Y partial, Z failed`) follows the `list.md` convention for tables with 3+ rows.
- Whether `mod log` should also show the run duration per row is extrapolated as "no" for the default view — duration adds a column that competes with the summary. A `--verbose` flag could add it.
- The timestamp rendering (local time vs. UTC, format) is extrapolated. The CLI may use a different format or offer `--utc`.

## Out of scope (this pattern)

- Whether `mod log` should support `--csv` / `--json` output — behavioral, uses `tokens.json $machine_readable` rules, not this pattern.
- Pagination for very long run histories — interaction design decision.
- Filtering by recipe, date range, or status — command design, not visual.
- The detail view for a single run (`mod log --run <id>` or similar) — would be a separate pattern or a deeper specialization.
