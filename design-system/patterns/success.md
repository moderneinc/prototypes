# Pattern — Success

The visual treatment of a command that did what was asked. Two surfaces — sub-task success during a run, and the close banner at the end.

## When this pattern applies

- A command completed all its sub-tasks without raising. Exit code is `0`.
- The command did *something* — there is at least one written artifact, mutated repo, or completed query. (Empty-list-as-success, when the empty list is itself the answer, is also covered here. The borderline case of "0 results found" — empty as failure vs empty as fact — is `gaps.md` Part B.)

## What the user sees

```
● Loading recipe
● Running recipe on 47 repositories
● Writing data tables to /home/user/.moderne/cli/recipes

✓ 42 repositories modified
✓ 5 unchanged

WHAT TO DO NEXT
  ▶ mod study --last-recipe-run        — View results by repo.
  ▶ mod git commit --last-recipe-run   — Commit changes across repos.
  ▶ mod git push --last-recipe-run     — Push to remotes.

MOD SUCCEEDED in (3m 24s)
```

## Visual anatomy

| Element | Token | Notes |
| --- | --- | --- |
| Action header (in-flight) | `glyph.section_marker` (`●`, primary white) + `typography.primary` action verb | One per phase of work. Used by `printAction(…)`. Body text is sentence case, gerund verb, no period. |
| Sub-task success row | `glyph.success_marker` (`✓`, green) + `typography.primary` body | One row per sub-task summary line. Body text leads with a count (`42 repositories modified`, `5 unchanged`) when one applies. |
| `WHAT TO DO NEXT` | `typography.section_header` | ALL CAPS. Used for run-time success forward-chains (multiple options). For help-screen single-action pointers, use `NEXT STEP` instead — see `help-command.md`. |
| `▶ <command> — <gloss>` | `glyph.actionable_bullet` (`▶`, cyan) + `color.semantic.info` (command) + `typography.supporting` (em-dash + gloss) | Each row pairs a runnable command with a one-line description of the outcome. The em-dash is `—` (U+2014). |
| `MOD SUCCEEDED in (Xs)` | `banner.close.variants.success` | Green, bold, leading blank line. |

## Spacing

- Each `● <action>` line stands alone, separated from the next by zero blank lines (they appear as the run progresses; the relationship is sequential).
- Action-header block → sub-task success rows: one blank line.
- Sub-task success rows: stacked, no inter-row blank lines.
- Sub-task block → `WHAT TO DO NEXT`: one blank line.
- Within `WHAT TO DO NEXT`: rows stacked, no blank lines, columns aligned by the widest command across the block.
- `WHAT TO DO NEXT` → close banner: one blank line.

## Composition rules

- `● <action>` headers narrate what the command is doing right now. Each is one line, gerund verb, no period.
- `✓ <count> <noun>` summary rows narrate what was completed. Past-tense / past-participle ("modified", "unchanged"). Numbers lead.
- The `WHAT TO DO NEXT` block is **optional but encouraged** for any command whose output is plausibly the start of a multi-step workflow. The block has two to four entries; each is a concrete runnable command.
- The em-dash + gloss is the system's convention for "command and what it does in one row." The em-dash sits at a column aligned across all rows (the column position is `widest_command + 3 spaces`).
- The close banner is the last visible content. No content follows.
- Forward-chain commands in `WHAT TO DO NEXT` are *concrete*, not exploratory: they reference real flags (`--last-recipe-run`) that mean what the user just did, not generic invitations to "try the help."

## Worked examples

**Derived** — Jayd's `mod run` success frame from `cli-error-states-ui-uplift.pdf` is the source for the `WHAT TO DO NEXT` block and the sub-task `✓` lines. The example above renders that frame in this system's tokens.

**Derived** — The `● <action>` headers come from the existing CLI's `printAction(…)` channel (audit `ACT-001`); the artifacts use the same shape.

## Extrapolations

- The exact wording of the action headers above (`Loading recipe`, `Running recipe on N repositories`, `Writing data tables to …`) is extrapolated. Jayd's frame condenses these for readability; real CLI runs may emit more or fewer phases. → flagged in `gaps.md` Part A.
- Sub-task success row count formatting (`42 repositories modified`) is the convention from Jayd's frame; whether this scales to non-repo-count contexts (e.g. `5 files generated`, `12 indexes built`) is extrapolated. → flagged in `gaps.md` Part A.

## Out of scope (this pattern)

- Whether each phase of work *should* emit its own `● <action>` header — author / framework decision. The visual system codifies the shape, not which surfaces emit it.
- The `WHAT TO DO NEXT` content per command — product / IA decision (which commands chain to which other commands). → `gaps.md` Part B.
- Whether the close banner should also report any non-fatal warnings that fired during the run — that's the `partial-success.md` and success-with-warnings boundary, behavioral. → `gaps.md` Part B.
