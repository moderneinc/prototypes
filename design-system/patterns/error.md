# Pattern — Error

The visual treatment of failures. Two tiers — full template for runtime exceptions, compact inline for usage / parser errors.

This pattern is the visual heart of the design system. See `reconciliation.md` D-02 and D-10 for the derivation; see `rationale.md` for the decision trail.

## Tier 1 — Full template (runtime failures)

### When this tier applies

- A command failed during execution after parsing succeeded.
- Examples (from the artifacts): build tool not found, no data table available, sync failed.
- Generally: anything that throws `CommandException` or any `Throwable` from inside `run()`.

### What the user sees

```
FAILURE: mod failed with an exception

● WHAT WENT WRONG
  No build tool found in /home/user/project.

  ? Hint: Add a Maven, Gradle, or Bazel build config — mod looks for
    pom.xml, build.gradle(.kts), build.bazel, or setup.py at the root
    of the directory you point it at.

● TRY
  ▶ Add a build config to the directory.
      mod build /home/user/project --only-tool maven
  ▶ Point the CLI at a different directory that already has one.
      mod build <path-to-built-project>
  ▶ Still stuck? Report to support@moderne.io

MOD FAILED in (2s)
```

### Visual anatomy

| Element | Token | Notes |
| --- | --- | --- |
| `FAILURE:` preface | `color.semantic.danger` + bold | First line. The phrase after is regular weight. One blank line below. |
| `● WHAT WENT WRONG` | `glyph.section_marker` (`●`, red) + `typography.section_header` | The bullet is red; the header text is white. |
| WHAT WENT WRONG body | `typography.primary` | One line. Names the input that caused the failure (path, name, org) when known. |
| `? Hint:` (optional) | `glyph.hint_marker` (`?`, yellow) + leading word `Hint:` (yellow) + `typography.primary` body | Sits inside `WHAT WENT WRONG`, indented. Used to acknowledge ambiguity ("A few things can cause this — …") or surface a concrete fact ("The last run produced 0 data tables."). |
| `● TRY` | `glyph.section_marker` (`●`, red) + `typography.section_header` | Bullet red, header text white. |
| `▶ <recovery>` action | `glyph.actionable_bullet` (`▶`, cyan) + `typography.supporting` action verb + `color.semantic.info` runnable command on the next line | Two-line shape: action verb on top, indented runnable command below. The command line uses `spacing.indent.list_item_continuation` (4 spaces). |
| Demoted support line | `glyph.actionable_bullet` (`▶`, dim) + `typography.metadata` body | Last `▶` in the `TRY` block when other suggestions precede it. The `▶` and the text both render in `color.text.metadata`. The OSC-8 link on the email is preserved (D-10). |
| `MOD FAILED in (Xs)` | `banner.close.variants.failure` | Red, bold, leading blank line. |

### Spacing

- Preface → `● WHAT WENT WRONG`: one blank line.
- WHAT WENT WRONG body → `? Hint:`: one blank line.
- `WHAT WENT WRONG` block → `● TRY`: one blank line.
- Within `TRY`: each `▶ <recovery>` block (two lines: verb + command) is followed by one blank line before the next `▶`.
- `TRY` → close banner: one blank line.

### Composition rules

- The five-element shape is invariant: preface → WHAT WENT WRONG → ? Hint (optional) → TRY → close banner.
- The `WHAT WENT WRONG` body is **one line**. Concrete; names the input. Multi-cause exposition belongs in `? Hint:`, not here.
- The `? Hint:` block acknowledges ambiguity. If the CLI cannot tell distinct causes apart, the hint surfaces alternatives without committing ("A few things can cause this — the org name may not match, your login may have expired, or the CLI may not be reaching Moderne right now."). If the cause *is* known, the hint adds a fact ("The last run produced 0 data tables.").
- `TRY` lists recovery actions in most-likely-to-help order. Each is a concrete action, not an exploration prompt.
- The support line is **always last** in `TRY` and follows the D-10 demotion rule:
  - When concrete suggestions precede it → demoted to `typography.metadata` (gray), reworded `Still stuck? Report to support@moderne.io`.
  - When it's the only entry → not demoted (`typography.supporting`), worded `Report to support@moderne.io` (no question framing).
- Stack traces do **not** appear in this template. When the framework detects an internal exception (NPE, ISE — anything not deliberately thrown), an optional `● TECHNICAL DETAILS` section can render below `TRY` in `typography.metadata`. (Extrapolated — see Tier 1 extrapolation note below.)

### Worked examples

**Derived** — Jayd's `cli-error-states-ui-uplift.pdf` provides three full-template cards:

- `mod build` (no build tool found) — rendered above.
- `mod study` (no data table) — `WHAT WENT WRONG: No data table matching "RewriteSources" in the last recipe run.` + ambiguity-acknowledging hint + two `▶` recovery actions.
- `mod git sync` (sync failed) — `WHAT WENT WRONG: Unable to sync repositories from <org>.` + ambiguity-acknowledging hint listing three possible causes + three `▶` recovery actions.

### Tier 1 extrapolations

- The `● TECHNICAL DETAILS` section for internal exceptions is **extrapolated** from category D's "stack trace doesn't belong in user-facing output" position plus D-09's "stack trace disclosure is inconsistent today." Neither artifact shows it. → flagged in `gaps.md` Part A.
- The `● SSL connection details:` block (when present) is treated as a sub-section under `WHAT WENT WRONG` rather than as a peer section. → extrapolated; flagged.

## Tier 2 — Inline / usage error

### When this tier applies

- A command was malformed at the parser level — typo'd subcommand, unknown flag, missing required argument.
- The error is *what the user typed*, not *what happened during execution*.
- No close banner is appropriate because the run never started.

### What the user sees

```
! Error: Unknown command 'confg'.

  Did you mean:
    mod config

  Available commands for mod:
    config   Configure mod.
    build    Build LSTs for a project.
    run      Run a recipe.
    study    Inspect recipe results.
    git      Source-control operations across repos.
```

### Visual anatomy

| Element | Token | Notes |
| --- | --- | --- |
| `! Error:` marker | `glyph.note_marker` (`!`, red) + leading word `Error:` (red) + `typography.primary` body | Single line. Terse statement of what was wrong. |
| `Did you mean:` block | `typography.supporting` (label) + `color.semantic.info` (suggestion command) | Indented 2 spaces from the `! Error:` line. The suggestion is a single cyan command. |
| `Available commands for <parent>:` listing | `typography.supporting` (label) + `color.semantic.info` (subcommand name) + `typography.supporting` (description after 2-space gap) | Same shape as the subcommand listing in `help-subcommand.md`, but un-triaged. |
| (no close banner) | — | The compact tier has no `MOD FAILED` banner. The error is a usage correction, not a runtime failure. |

### Spacing

- `! Error:` → `Did you mean:`: one blank line.
- `Did you mean:` → `Available commands for <parent>:`: one blank line.

### Composition rules

- No `FAILURE:` preface.
- No `MOD FAILED` close banner.
- No support line (the support team can't help with a typo).
- `Did you mean:` is omitted when the CLI has no plausible suggestion — only the error line and the `Available commands for <parent>:` listing render.
- `Available commands for <parent>:` lists the immediate children of the parent the user typed (not the full recursive tree).

### Worked examples

**Derived** — Annie's `cli-help-text-rewrites.pdf` "wrong command path" frame (mod-rewrites card 7) is the source. The example above renders that proposal.

### Tier 2 extrapolations

- Unknown-flag and missing-required-argument variants of the inline tier are extrapolated. The artifacts only show the unknown-command variant. → flagged in `gaps.md` Part A.

## Out of scope (this pattern)

- Whether every throw site should be required to supply at least one `.suggest(…)` call (the natural framework rule for ensuring Tier 1 errors always have actionable recovery actions). → `gaps.md` Part B.
- Whether the `convertError` framework should automatically classify exceptions into "user-side" (Tier 2) vs. "internal" (Tier 1 + TECHNICAL DETAILS) — D-09. → `gaps.md` Part B.
- Whether `Report to support@moderne.io` should ever be entirely suppressed for known user-side errors (`F-04`'s observation). The visual system codifies the demoted shape but does not direct suppression. → `gaps.md` Part B.
- The behavioral distinction between "the CLI raised this" vs "an internal exception leaked" — required to drive Tier 1 vs. Tier 1+TECHNICAL DETAILS. → `gaps.md` Part B.
