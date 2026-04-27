# Pattern — Progress

The visual treatment of in-flight work — what the user sees while a long-running command is happening.

## When this pattern applies

- Any command whose primary work takes more than a few seconds.
- The framework has at least one of: a phase boundary to announce (`printAction`), a transient sub-status to display (`setExtraMessage`), a determined result to persist (`intermediateResult`).
- TTY is present and `--csv` / `--json` / `--streaming` is not active. (Machine-readable modes silence this pattern entirely — see `tokens.json $machine_readable`.)

## What the user sees

```
● Running recipe on 47 repositories
  Resolving dependencies for spring-boot ...
  [████████████████░░░░░░░░░░░░░░░░] 23/47 (49%)
```

After the bar resolves, the scrollback contains:

```
● Running recipe on 47 repositories
  ✓ 47 repositories processed
```

## Visual anatomy

| Element | Token | Notes |
| --- | --- | --- |
| Action header (phase boundary) | `glyph.section_marker` (`●`, primary white) + `typography.primary` action verb | One per phase. Sentence case, gerund verb (`Running recipe on N repositories`), no period. Persists in scrollback after the phase completes. |
| Transient sub-status | `typography.supporting` body, no glyph | One line, indented `spacing.indent.section_content` (2 spaces) under the action header. Updated in place while the bar is running. Does **not** persist after the phase completes. |
| Progress bar (animated) | Plain ASCII (`█`, `░`) at primary color; counter and percentage in `typography.supporting` | One line, indented under the action header. The bar's exact glyphs depend on terminal capability — in a non-truecolor or non-Unicode terminal the bar falls back to ASCII (`#`, `-`). |
| Progress bar (plain / 10s polling fallback) | Single-line text snapshot at the same indent | Used in CI / Docker / non-TTY contexts. No animation. Each snapshot prints on its own line. |
| Sub-task completion (post-bar) | `glyph.success_marker` (`✓`, green) + `typography.primary` body | Replaces the bar in the scrollback once the phase completes. Same indent as the bar was. |

## Spacing

- Action header → progress bar / sub-status: zero blank lines, but indented 2 spaces.
- Phase to phase: zero blank lines (the next `● <action>` immediately follows the previous phase's resolution line).
- A phase boundary that's only an announcement (no bar, no sub-status — just `● <action>` standing alone) is followed immediately by the next phase or content with no blank line.

## Composition rules

- The **action header is the persistent surface**. It stays in the scrollback as a record of what phase ran. Its body text is sentence-case gerund (`Running recipe on N repositories`), and after resolution the same line stays visible while sub-content beneath it updates.
- The **transient sub-status is ephemeral**. It updates in place while the bar runs. Once the phase resolves, the sub-status line is replaced by a `✓ <result>` line. The transient status never accumulates in the scrollback.
- The **progress bar** is a single line. No multi-line bars. No nested bars. When concurrent work is happening (e.g. parallel repo processing), the bar reflects aggregate progress; per-item status updates the transient sub-status, not the bar.
- **Grammar**: gerund for transient state (`Resolving dependencies`), past tense or noun phrase for the resolution (`✓ 47 repositories processed`). See `voice.md`.
- The visual system does not distinguish `intermediateResult` from `setExtraMessage` — both render as the transient sub-status line (D-07). Persistent state that *should* be visible after the phase resolves is rendered as a `✓` line, not as a transient sub-status.
- In machine-readable modes, none of this renders. The framework either suppresses entirely or substitutes a structured event stream (behavioral, not visual).

## Worked examples

**Derived (action header shape)** — The artifacts use `● <action>` headers in error frames (`● WHAT WENT WRONG`, `● TRY`) and as section markers in success frames. The same shape is reused here for in-flight phase boundaries, matching the existing CLI's `printAction(…)` channel (`ACT-001`).

**Extrapolated (everything else)** — Neither artifact renders an animated progress bar, transient sub-status updates, or a plain-fallback progress shape. The artifacts only render static snapshots of post-resolution scrollback. The bar shape, ASCII fallback, and transient-vs-persistent split here are extrapolated from the audit's category G + the existing `AnimatedProgressBar` / `PlainProgressBar` / `NoopProgressBar` triplet. → flagged in `gaps.md` Part A.

## Out of scope (this pattern)

- Which environment heuristics select animated vs. plain vs. noop progress bar (D-13 cites five env/OS checks today). The visual system codifies the existence of two visual modes — animated and plain — but does not specify the framework's selection logic. → `gaps.md` Part B.
- Whether `setExtraMessage` and `intermediateResult` should be merged into a single API at the framework level (D-07) — API engineering. → `gaps.md` Part B.
- Whether progress bars should expose a render-mode flag (`--render=animated|plain|none`) instead of inferring from environment (D-13). → `gaps.md` Part B.
- Whether a `% complete` ETA should be calculated and shown alongside the count — extrapolation, not in artifacts. → `gaps.md` Part A.
