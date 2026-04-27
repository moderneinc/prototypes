# Pattern — Partial success

The visual treatment of a command that completed but with incomplete results — some sub-tasks succeeded, some did not, the overall outcome is mixed. Exit code is `-2` per the current CLI.

## When this pattern applies

- A command finished without raising, but its result is *not* what the user asked for in full.
- Examples (from the artifacts): `mod search` ran across 47 repositories but 47 of them lacked a search index, so 0 were actually searched.
- Generally: any command that today is reachable through `MultiTaskCommand` or `Publish` and lands in the partial-success exit path.

## What the user sees

```
PARTIAL SUCCESS:

  ⚠ 0 repositories searched — all 47 skipped (no search index).

  Run mod postbuild search index <path> to build indexes from
  existing LSTs, then re-run this search.

MOD PARTIALLY SUCCEEDED in (3s)
```

## Visual anatomy

| Element | Token | Notes |
| --- | --- | --- |
| `PARTIAL SUCCESS:` preface | `color.semantic.warning` (yellow) + bold | Single line. Trailing colon. One blank line below. |
| `⚠` lead glyph + count line | `glyph.warning_marker` (`⚠`, yellow) + `typography.primary` body | One line. **Leads with the failure count** (`0 of 47`, `12 of 47`) before the cause clause. The count is in body text color, not yellow — only the glyph is yellow. |
| Recovery prose | `typography.primary` body + `color.semantic.info` for any inline command reference | One or two sentences. Names the concrete next step. Inline command references render in cyan. |
| `MOD PARTIALLY SUCCEEDED in (Xs)` | `banner.close.variants.partial_success` | Yellow, bold, leading blank line. |

## Spacing

- Preface → `⚠` line: one blank line; the `⚠` line is indented `spacing.indent.section_content` (2 spaces).
- `⚠` line → recovery prose: one blank line.
- Recovery prose → close banner: one blank line.

## Composition rules

- Three-element shape: preface → `⚠` count + cause line → recovery prose → close banner. (Four if you count the close banner separately from the body.)
- The `⚠` line **always leads with a count**: `0 of 47`, `12 of 47`. Numbers communicate the partial-ness at a glance.
- The cause clause is in parentheses on the same line, terse: `(no search index)`, `(skipped — repo unavailable)`.
- Recovery prose is one or two sentences. It names the concrete recovery command inline (in cyan) — not in a separate `▶` block. The visual difference from the full-template error is deliberate: partial success is not a failure to recover from with a list of options; it's a "here's what you'd do next" pointer.
- The preface `PARTIAL SUCCESS:` is preserved verbatim from the current CLI (`BAN-004` partial variant) — only the body content is restructured.
- The yellow-on-yellow boundary with `success-with-warnings` is accepted: same banner color, different banner phrase. Per D-03, color is a single token, the phrase disambiguates.

## Worked examples

**Derived** — Jayd's `cli-error-states-ui-uplift.pdf` `mod search` card is the source. The current CLI emits `⚠ No search index on 47 repositories (skipped)`; Jayd's proposal sharpens it to `⚠ 0 repositories searched — all 47 skipped (no search index). Run mod postbuild search index <path> to build indexes from existing LSTs, then re-run this search.` The example above renders that proposal.

## Extrapolations

- The single-`⚠`-line shape (vs. multi-row breakdown) is extrapolated for cases beyond `mod search`. For example, a `mod run` against 47 repos with 5 failures could be either:
  - Single line: `⚠ 42 of 47 repositories modified — 5 skipped (build failed).`
  - Or table form (see `list.md`).

  The visual system favors the single-line form when the count fits on one line and the cause is uniform. When per-row variance matters (different repos failed for different reasons), the table form takes over. → flagged in `gaps.md` Part A.

## Out of scope (this pattern)

- Whether 0-of-N "partial success" should reclassify as outright failure — Jayd's card explicitly flags this as a product call. → `gaps.md` Part B.
- Whether `--csv` / `--json` partial-success output should include the cause clause structurally — behavioral, not visual. → `gaps.md` Part B.
- Whether commands should emit a per-row breakdown when partial-success applies (e.g. `mod run`) — author / framework decision. → `gaps.md` Part B.
