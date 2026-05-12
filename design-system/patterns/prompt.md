# Pattern — Prompt

The visual treatment of an interactive confirmation prompt. The CLI pauses and waits for the user to type a response before continuing.

## When this pattern applies

- A command requires explicit user confirmation before performing a destructive or irreversible action.
- The CLI blocks on stdin, waiting for a keypress or typed response.
- Examples: `mod git push` asking to confirm push to N repositories, `mod config moderne login` confirming a credential overwrite, any `--confirm` gate.

## What the user sees

```
? Do you want to push changes to 12 repositories? [Y/n]
```

### With context line

```
  This will push to 12 repositories on the main branch.
  3 repositories have uncommitted changes that will NOT be included.

? Push changes? [Y/n]
```

## Visual anatomy

| Element | Token | Notes |
| --- | --- | --- |
| `?` glyph | `glyph.hint_marker` (`?`, yellow) | Single character at column 0. Yellow per `glyph_color_pairs`. Same glyph as inline hints, but here it marks a question rather than supplementary information. |
| Prompt text | `typography.primary` | The question itself. Sentence case. Phrased as a yes/no question. |
| `[Y/n]` default indicator | `typography.supporting` | Brackets with the default option capitalized. `[Y/n]` means yes is default; `[y/N]` means no is default. Always at the end of the prompt line, separated by one space. |
| Context lines (optional) | `typography.supporting` | One to three lines of supporting detail above the prompt. Indented 2 spaces. Describe what will happen and any caveats. |

## Spacing

- Context lines (when present) to `?` prompt line: one blank line.
- Between context lines: zero blank lines (they stack).
- The prompt line is the last visible content before the cursor. No blank line after — the cursor sits at the end of the `[Y/n]` line waiting for input.

## Composition rules

- The `?` glyph is **always yellow**. It reuses `glyph.hint_marker` from the composition rules. In the prompt context it asks a question; in error context it gives a hint. The glyph is the same, the surrounding pattern disambiguates.
- The prompt text is a **complete yes/no question**. It must be answerable with Y or N. Never open-ended ("What do you want to do?") and never a statement ("Pushing changes.").
- The default indicator `[Y/n]` or `[y/N]` is **always present**. The capitalized letter is the default. When neither answer is safe to default, use `[y/n]` (both lowercase) — but this is discouraged; most prompts should have a safe default.
- Context lines are **optional** and appear when the prompt alone does not convey enough information to make an informed decision. They name the scope (how many repos, which branch) and any exclusions or caveats.
- No close banner. The prompt is mid-flow, not an exit point. The command that follows the prompt will produce its own success/failure/partial-success output.
- No `●` section headers. The prompt is a single interaction beat, not a structured output frame.
- Semantic colors used: `semantic.warning` (the `?` glyph only). Body text and supporting text use `text.primary` and `text.supporting` respectively. This is a one-semantic-color screen.

## Extrapolations

- The exact phrasing conventions ("Do you want to...", "Push changes?") are extrapolated. The design artifacts reference the `?` glyph and `[Y/n]` convention but do not show full prompt screens.
- Whether context lines should use `⚠` glyphs for warnings (e.g. "3 repositories have uncommitted changes") is extrapolated as "no" — the context lines are informational, not warning rows. The `?` glyph on the prompt line carries the "pay attention" semantic.
- Multi-choice prompts (e.g. `[1/2/3]`) are extrapolated as out of scope. The current CLI uses only yes/no confirmation. If multi-choice is needed, a separate pattern (`multi-prompt.md`) should be created.

## Out of scope (this pattern)

- Whether a command should prompt at all vs. requiring `--yes` / `--no-prompt` — product / safety decision per command.
- The `--yes` flag that skips the prompt entirely — behavioral, not visual.
- Free-text input prompts (e.g. "Enter your email:") — different interaction model, would need its own pattern if it exists in the CLI.
- Progress output that follows after the user confirms — that transitions to `progress.md` and then `success.md` / `error.md`.
