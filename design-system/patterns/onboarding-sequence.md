# Pattern — Onboarding sequence

The visual treatment of a numbered ladder of setup steps. The user sees this when they're getting started — most prominently in `mod` (top-level help) but the pattern is reusable wherever a "do these in order" sequence applies.

## When this pattern applies

- A sequence of commands that must (or strongly should) be run in order.
- The user is in a learning posture, not a referencing posture — they are figuring out *what* to do, not *how* to invoke a specific command they already know.
- Length is small to medium: 3 to 12 steps. Beyond 12, split into named groups (which the top-level `mod` example does) or fall back to a list (`list.md`).

## What the user sees

```
GET STARTED
  1. mod config moderne edit <tenant-url>
     └ Connect to your Moderne tenant.
  2. mod config moderne login
     └ Authenticate with your account.

CONFIGURE YOUR ENVIRONMENT
  Get these values from your platform team or admin:

  3. mod config http trust-store edit
     └ SSL trust store for HTTPS connections.
  4. mod config recipes artifacts artifactory add
     └ Recipe artifact repository.
  5. mod config lsts artifacts artifactory add
     └ LST artifact repository.
  6. mod config build maven settings edit
     └ Maven settings file.

RUN RECIPES
  7. mod config recipes moderne sync
     └ Download recipes from Moderne.
  8. mod build .
     └ Build LSTs for your project.
  9. mod run . --recipe <recipe-name>
     └ Run a recipe.
```

## Visual anatomy

| Element | Token | Notes |
| --- | --- | --- |
| Group header | `typography.section_header` | ALL CAPS. Names a phase of the sequence. |
| Optional resourcing line (under a group header) | `typography.supporting` | Plain prose, no glyph, single line. Used for "where you'll get the values" or similar contextual info. Sits between the group header and the first numbered step. |
| Step number | `color.semantic.success` (green) + bold | Continuous numbering across all groups (1–9, not restart). Followed by `. ` (period + space). The numbering is the through-line; it carries the "do these in order" semantic. |
| Step command | `color.semantic.info` (cyan) | Single line. Placeholders inside (`<tenant-url>`, `<recipe-name>`) drop to `color.text.supporting`. |
| Child connector | `glyph.child_connector` (`└`) + `typography.supporting` | Sub-description line beneath each step. Aligned under the command (not under the number). |

## Spacing

- Between groups: one blank line above each group header.
- Between resourcing line and the first step in its group: one blank line.
- Between steps within a group: zero blank lines.
- Each step occupies exactly two lines: the numbered command line and the `└ <description>` line.

## Composition rules

- **Numbering is continuous across groups.** The reader sees `1, 2, 3, 4, 5, 6, 7, 8, 9` from top to bottom regardless of group boundaries. Restarting numbering at each group would suggest "do any one of these"; continuous numbering enforces "do these in order."
- **Number color is green.** This is one of the few visual uses of green outside the success banner and `✓` glyph. The color reinforces that completing the step is a forward-progress motion. (Per `tokens.json $color.semantic.success.applies_to`.)
- **Each step is exactly one command + one description line.** No extended prose under a step. If a step needs more explanation, that explanation belongs in the help screen for that specific subcommand (`help-command.md`), not inline in the ladder.
- **The `└` is aligned under the command name, not under the step number.** This visually subordinates the description to the command and keeps the eye on the cyan command column.
- **Groups are user-role groupings, not arbitrary bins.** "GET STARTED" / "CONFIGURE YOUR ENVIRONMENT" / "RUN RECIPES" each name a phase the user is in. Same convention as the triage groups in `help-subcommand.md`.
- **The resourcing line is optional.** Use it only when there's something the user needs to know *before* they start the steps in that group ("Get these values from your platform team or admin:"). Don't use it as a generic header gloss.

## Worked examples

**Derived** — Annie's top-level `mod` help in `cli-help-text-rewrites.pdf` is the source. The example above is a direct rendering.

## Extrapolations

- The pattern's reuse beyond the top-level `mod` screen is extrapolated. The artifacts only show one onboarding ladder. If `mod config moderne login` had a multi-step interactive flow, it could plausibly use this pattern, but the artifacts don't show it. → flagged in `gaps.md` Part A.
- Whether numbering can run beyond ~12 (and what the visual breakdown is) is extrapolated. The artifacts only show 9 steps. → flagged in `gaps.md` Part A.

## Out of scope (this pattern)

- The product decision about *which* steps belong in the top-level onboarding (whether `mod build .` should be step 8 vs elsewhere, whether some steps should be optional) — IA / product, not visual. → `gaps.md` Part B.
- Whether the CLI should track which onboarding steps the user has already completed (e.g. dim already-done steps) — behavioral / state-tracking, not visual. → `gaps.md` Part B.
- Whether the ladder should ever auto-advance the user to the next incomplete step — interaction design, out of scope.
