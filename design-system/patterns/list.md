# Pattern — List / table

The visual treatment of tabular and list output — `mod config recipes artifacts show`, `mod config http trust-store show`, `ListRepositories`, `RunHistory`, etc. Replaces today's six per-site renderers (D-08).

## When this pattern applies

- A command's primary output is structured data: a list of items, a table of columns and rows, a verify-state dump.
- The data is for a human to scan — when the user wants the output for a script, they pass `--csv` or `--json` (machine-readable mode is out of scope here — see `tokens.json $machine_readable`).

## What the user sees

### List form (single-column items)

```
RECIPE ARTIFACT REPOSITORIES
  artifactory  https://artifactory.example.com/recipes
  central      https://repo.maven.apache.org/maven2

  Active: artifactory
```

### Table form (multi-column rows)

```
REPOSITORIES
  ✓  org/service-a       main      built 2h ago
  ✓  org/service-b       main      built 4h ago
  ⚠  org/service-c       main      no LST
  ✗  org/service-d       feature   build failed

  4 repositories — 2 ready, 1 missing LST, 1 failed build.
```

### Empty state

```
REPOSITORIES
  No repositories configured.

  ▶ Add a repository.
      mod config repos add <url>
```

## Visual anatomy

| Element | Token | Notes |
| --- | --- | --- |
| Section header (the "what list is this" header) | `typography.section_header` | ALL CAPS. Same shape as help-screen and error-frame section headers. |
| Row glyph (table form, when status applies) | `glyph.success_marker` (`✓`, green) / `glyph.warning_marker` (`⚠`, yellow) / `glyph.diff_failure` (`✗`, red) | Single character at column 0 within the indented row. Glyph carries the per-row semantic. |
| Row content | `typography.primary` | Body text. Columns are right-padded to the widest cell in each column; minimum two-space separator. No vertical or horizontal rules. |
| Column emphasis (the "key" column) | `typography.primary` (regular weight) | The first column after the glyph (the row's identifier — repo name, recipe name, file path) is regular weight, not bold. Bold is reserved for headers. |
| Trailing summary line | `typography.supporting` | One line below the table, separated by a blank line. Restates the count and (where applicable) the breakdown by status. |
| Empty-state line | `typography.supporting` | `No <noun-phrase>.` Sentence-case, period. No glyph. |
| Empty-state recovery (optional) | `glyph.actionable_bullet` (`▶`, cyan) + `typography.supporting` action verb + `color.semantic.info` (command on next line) | Single recovery action, same shape as a `▶` row in `error.md`'s TRY block. |

## Spacing

- Section header → first row: zero blank lines.
- Between rows: zero blank lines.
- Last row → trailing summary: one blank line.
- Section header → empty-state line: zero blank lines.
- Empty-state line → recovery `▶` block (when present): one blank line.
- All content under the section header is indented `spacing.indent.section_content` (2 spaces).

## Composition rules

- The section header is a single ALL-CAPS phrase naming the list contents (`REPOSITORIES`, `RECIPE ARTIFACT REPOSITORIES`, `RECENT RECIPE RUNS`).
- **No borders, no horizontal rules, no vertical separators.** Column alignment alone communicates structure.
- **Column separator**: minimum two spaces between columns. Each column is right-padded (within the column) to the widest cell in that column.
- The optional row glyph (`✓` / `⚠` / `✗`) is at column 0 within the indented row. When no per-row status applies (a plain list with no success/fail semantic), the glyph is omitted entirely and the row content starts at column 0.
- The trailing summary line is **encouraged** for tables with three or more rows. It restates the count (`4 repositories`) and any per-status breakdown when the row glyph was used.
- Empty state always renders the section header. The empty-state line names what's empty. When a recovery action exists, a single `▶` block follows; when no recovery is possible (the empty list is a fact), only the empty-state line appears.
- Linkable content (file paths, URLs, repo paths) renders in `color.semantic.info` and is OSC-8 wrapped where supported.

## When this is not the right pattern

- For **diff output** — `RichDiffRenderer` retains its specialized treatment (line numbers, gutter, content fill, annotations). It uses its own pattern, not this one. (Documented separately in `patterns/diff.md` if/when that file is added — out of scope for this initial pattern set.)
- For **CSV / JSON output** — machine-readable modes use the rules in `tokens.json $machine_readable`, not this pattern.
- For **partial-success summaries** that fit on one line — see `partial-success.md`. The list pattern takes over only when the per-row variance matters enough to warrant individual rows.

## Worked examples

**Extrapolated (entirely)** — Neither artifact renders a CLI list or table. The journey-map's "Verified Command Paths" table is HTML reference material, not CLI output. The `RECIPE ARTIFACT REPOSITORIES` example above is extrapolated from Annie's `mod config recipes artifacts show` "verify line" pattern (a `show` command exists, it must render *something*; Annie's PDF doesn't show what). The `REPOSITORIES` table form, the row glyphs, and the empty-state shape are extrapolated from category P's reconciliation. → flagged in `gaps.md` Part A.

## Out of scope (this pattern)

- Migrating the existing six per-site renderers (`RichDiffRenderer`, `ListRepositories`, `RunHistory`, `CsvToExcel`, `Csv` org-sync, `FactoryOutput`) to this pattern — framework engineering. The visual system codifies the target shape; the migration plan is `gaps.md` Part B.
- Choosing for each surface whether empty-as-error (TRY block) vs. empty-as-fact (empty-state line) applies — product decision per-surface (D-05). → `gaps.md` Part B.
- Pagination and scroll behavior for very long lists (Annie's `mod config -h --all` is referenced but not rendered) — interaction design. → `gaps.md` Part B.
- Sort order and column choice for any specific list — author / IA decision per-command.
