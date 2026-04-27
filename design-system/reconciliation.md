# Reconciliation

For each category in `audit/cli-categorized.md` and each delta in `audit/cli-deltas.md`, this file records: what the CLI currently shows on screen, what the intended direction (synthesized in `intended-direction.md`) proposed showing, and what the visual system should codify.

**Scope note.** This reconciliation is **visual only**. Where a delta or category raises a question that would change CLI behavior, structure, command organization, or output contracts, that question is named and deferred to `gaps.md` Part B. Visual treatment is the only thing decided here.

The audit uses surface IDs like `BAN-002`, `ERR-002`, `PROG-003`. Those IDs are referenced inline so reviewers can trace any decision back to a specific surface in `cli-inventory.md`.

---

## Part 1 — Categories

Twenty emergent categories from `cli-categorized.md`. Each is a class of output the CLI produces today; the visual system needs a position on each.

### A — Success / completion

**Current CLI.** Four co-existing surfaces (`BAN-002`, `SUC-001`, `PROG-006`, `PROG-007`): the green-bold `MOD SUCCEEDED` close banner, the inline `✓` glyph, an implicit task counter, and a plain-text `finish(…)` summary sentence. No documented rule for which is appropriate where.

**Intended direction.** The artifacts use two of the four:

- The `MOD SUCCEEDED in (3m 24s)` close banner is preserved verbatim (Jayd's `mod run` frame).
- The inline `✓` glyph is used for sub-task success (`✓ 42 repositories modified`, `✓ 5 unchanged` in the same frame).

The implicit task counter and the plain-text `finish(…)` line are not shown, neither endorsed nor refused.

**System should codify.**

- Close banner stays as-is: green-bold `MOD SUCCEEDED in (<duration>)`, leading blank line, no glyph, all caps. Token: banner color → success-green.
- Sub-task success uses `✓` (green-bold glyph, neutral body text) followed by a single sentence describing what was done. Token: glyph color → success-green; body color → primary text.
- Two slots are sufficient: run-level (banner) and sub-task (glyph). The implicit task counter is internal accounting, not a visible surface; the plain-text `finish(…)` sentence is redundant with sub-task glyph treatment and gets folded into it as a visual matter (whether the codebase consolidates the API is behavioral and out of scope).

**Out-of-scope-for-now.** Whether `finish(…)` should remain a separate API call or migrate to the `✓` channel is a CLI engineering decision. → `gaps.md` Part B.

### B — Partial success

**Current CLI.** Yellow-bold `PARTIAL SUCCESS:` preface + full `convertError` block (with stack trace by default) + yellow-bold `MOD PARTIALLY SUCCEEDED` close banner. Exit code `-2`. Reachable only via two code paths (`MultiTaskCommand`, `Publish`).

**Intended direction.** Jayd's `mod search` card preserves the `MOD PARTIALLY SUCCEEDED in (3s)` banner verbatim (yellow). What changes is the **content** above it: replace `⚠ No search index on 47 repositories (skipped)` with the sharper `⚠ 0 repositories searched — all 47 skipped (no search index). Run mod postbuild search index <path> to build indexes from existing LSTs, then re-run this search.`

The artifact explicitly notes: scope is message content only, banner classification stays.

**System should codify.**

- Banner shape: `MOD PARTIALLY SUCCEEDED in (<duration>)`, yellow-bold, leading blank line. Token: banner color → warning-yellow.
- The body of the partial-success message uses the warning glyph `⚠` (yellow) prefixed onto a line that **leads with the failure count** (`0 of 47`, `12 of 47`) before the cause clause. Inlined recovery commands appear immediately after, in cyan.
- The `PARTIAL SUCCESS:` preface line that the current CLI emits before the body is preserved, but the text is recast in voice (see `voice.md`).

**Out-of-scope-for-now.** Whether 0-of-N "partial success" should reclassify as outright failure is a product call (Jayd's card explicitly flags this). → `gaps.md` Part B.

### C — Success-with-warnings

**Current CLI.** Yellow-bold preface (`WARNING: mod produced a warning, but the command continued to completion`), full error block via `convertError`, yellow-bold `MOD SUCCEEDED WITH WARNINGS` close banner. Exit code `0`. Triggered by deprecated `setWarning(Throwable)` API.

**Intended direction.** Not directly addressed by either artifact.

**System should codify.**

- Banner: `MOD SUCCEEDED WITH WARNINGS in (<duration>)`, yellow-bold, leading blank line. Token: banner color → warning-yellow (same as partial success).
- The yellow-on-yellow ambiguity between this banner and the partial-success banner is visually identical; differentiation comes from the banner phrase, not color. This is an accepted constraint of using yellow as the single attention-but-not-fatal token (see D-03).

**Out-of-scope-for-now.** The behavioral question of whether `setWarning` should be removed or replaced (`F-02`, `D-11`) is a CLI engineering decision. The visual system is silent on the API — only the resulting on-screen treatment is codified. → `gaps.md` Part B.

### D — Hard failure

**Current CLI.** Single template via `convertError` (`ERR-002`): red `FAILURE: …` preface, `● Where:` (stack trace, default on), `● Cause:` (optional), `● What went wrong:`, `● SSL connection details:` (conditional), `● Try:` (▶ items, then unconditional `Report to support@moderne.io` line), red-bold `MOD FAILED` close banner. Exit code `-1`. Two de-facto sub-categories: ~140 dead-end sites with no concrete `.suggest(…)` and ~60 actionable sites with at least one.

**Intended direction.** Jayd's three full-template cards (`mod build`, `mod study`, `mod git sync`) reshape the body into a five-element template:

```
FAILURE: mod failed with an exception          ← red preface

● WHAT WENT WRONG                                ← red bullet, white ALL-CAPS
  <one-line statement>

  ? Hint: <ambiguity-acknowledging cause(s)>     ← yellow inline, optional

● TRY                                            ← red bullet, white ALL-CAPS
  ▶ <recovery action>                            ← cyan command + em-dash + gloss
      <inlined command>
  ▶ Still stuck? Report to support@moderne.io   ← demoted to gray

MOD FAILED in (Xs)                               ← red close banner
```

Annie's wrong-command-path frame (mod-rewrites card 7) introduces a **second tier**: a compact inline error treatment for usage / command-not-found errors that has no preface/banner pair (`! Error: <statement>` + `Did you mean: <suggestion>` + `Available commands for <parent>:` listing).

**System should codify.**

- A two-tier error model:
  1. **Full template** — for runtime failures (build tool not found, no data table, sync failed). Five-element shape per Jayd's frames. Section headers in ALL CAPS (`WHAT WENT WRONG`, `TRY`) replacing the lowercase `What went wrong:` / `Try:`. Optional inline `? Hint:` block under WHAT WENT WRONG.
  2. **Inline / usage** — for input-not-recognized errors (typo'd subcommand, malformed flag). Compact: `! Error:` line, `Did you mean:` suggestion, `Available commands for <parent>:` list. No `FAILURE:` preface, no `MOD FAILED` close banner.
- The `Where:` (stack trace) and `Cause:` blocks are not part of either tier in the artifacts' proposed shape. The visual system codifies that they are not part of the user-facing error template; whether the framework continues to emit them by default is behavioral. → `gaps.md` Part B.
- The `SSL connection details:` block, where it appears, is treated as a sub-section under `WHAT WENT WRONG` rather than as a peer to `WHAT WENT WRONG` and `TRY` — its presence narrows the cause, not the recovery path. (Extrapolated; the artifacts don't address SSL specifically.)

**The full case is treated in detail in §D-02 and §D-10 below.**

### E — Warnings (non-fatal)

**Current CLI.** Three convergent surfaces: inline `⚠` glyph (`WARN-001`), yellow banners (deprecation `BAN-005`, success-with-warnings `BAN-003`, partial-success `BAN-004`), and `setWarning` API.

**Intended direction.** The artifacts use `⚠` only once (Jayd's `mod search` card). Yellow continues to mean "attention but not fatal" across hints (`? Hint:`), notes (`! Note:`), and warning glyph.

**System should codify.**

- Inline warning glyph: `⚠`, yellow, glyph-only colored, body in primary text. Token: warning-yellow.
- The same yellow token covers `? Hint:`, `! Note:`, `⚠`, deprecation banner, success-with-warnings banner, and partial-success banner. This is the system's accepted compromise: one yellow token, six expressions, disambiguated by glyph + leading word.
- Body grammar: gerund form for transient state ("Falling back to default…"), past-tense or present-perfect for already-determined warnings ("Skipped 5 repositories — no LST present"). See voice.md.

### F — Info / neutral status

**Current CLI.** Sparse and inconsistent. `Icons.INFO` (ℹ blue-bold) is rarely used in top-level command output. Most "what is happening" content is plain text via `intermediateResult`. Action headers (`ACT-001`, bold `● <action>`) are the closest the CLI has to a consistent info channel.

**Intended direction.** Not directly addressed by the artifacts. Their progress lines (`● Loading recipe`, `● Searching 47 repositories`) match the existing `printAction` shape — bold `●` + present-tense verb.

**System should codify.**

- No dedicated info-glyph treatment. Yellow `? Hint:` covers the "did-you-know" use case; `● <action>` covers section markers; sub-task prose without a glyph covers neutral progress text.
- Reserve `Icons.INFO` (`ℹ` blue) as a token but mark it underused — its current use site (`RichDiffRenderer` annotations) is specialized. The visual system documents it for completeness but doesn't promote it to top-level command output without a future use case.

**Out-of-scope-for-now.** Whether the CLI needs a new info channel for plain neutral-status messaging is a behavioral question. → `gaps.md` Part B.

### G — Progress (in-flight action)

**Current CLI.** `setExtraMessage(String)` via `AnimatedProgressBar` / `PlainProgressBar` / `NoopProgressBar`. Grey single-line message left-anchored under the bar; falls back to 10s polling in CI/Docker, silenced in machine-readable mode (`SKEL-004`).

**Intended direction.** The artifacts show the `● <action>` line above any progress, but **don't render an animated or plain progress bar at all** — they show static snapshots of what appears in the scrollback after the bar resolves. Progress UI itself is not redesigned.

**System should codify.**

- Existing progress shape is preserved: `setExtraMessage` text in the dim/supporting color (`#94a3b8`), no glyph, single line, left-anchored to the bar. Token: supporting-text.
- Action header above the bar (`● <action>`) uses the bold-white treatment with the `●` glyph in primary color. (Color of `●` is not separately tokenized in the artifacts; treated as inheriting the line's primary color.)

**Out-of-scope-for-now.** Whether progress should expose a render-mode flag (`--render=animated|plain|none`) instead of five environment heuristics (D-13) is behavioral. → `gaps.md` Part B.

### H — Persistent / determined status

**Current CLI.** `intermediateResult(String)` channel. Visually identical to in-progress messages but persists into scrollback. ~40% of sites violate the documented "already-determined only" rule (D-07).

**Intended direction.** The artifacts don't visually distinguish persistent from transient status. Both render as the same kind of line above the progress bar.

**System should codify.**

- Both channels render identically on screen. The visual system does not introduce a distinguishing token between transient and persistent status — they look the same.
- Persistent lines that *are* worth distinguishing get a glyph: `✓` for completed sub-task, `⚠` for warning, dim text without glyph for plain status. Glyph carries the disambiguation; the channel doesn't.

**Out-of-scope-for-now.** Whether the framework should make the two channels visually distinct (a more aggressive option than the artifacts considered) is behavioral / API-design. → `gaps.md` Part B.

### I — Help output

**Current CLI.** Single shared skeleton (`HELP-001`) with picocli-rendered sections (`Usage:`, `Description:`, `Parameters:`, `Options:`, `Commands:`). Bold + underlined section headers, no color, monospace. Inline picocli markup (`@|bold mod build|@`) for emphasis. Help text on individual commands varies in length and quality (`HELP-002`–`HELP-021`).

**Intended direction.** Annie's PDF redesigns ten help surfaces. The proposed shape per surface (full reconciliation in `intended-direction.md`):

- ALL-CAPS section headers (`USAGE`, `FLAGS`, `EXAMPLES`, `LEARN MORE`, `NEXT STEP`).
- Lead with one-line summary, then 2–3 lines of consequence prose.
- `? Hint:` blocks for anticipated questions.
- `EXAMPLES` with real values (not placeholder shapes).
- `NEXT STEP` and verify-line patterns.
- For top-level `mod`: numbered onboarding ladder grouped under `GET STARTED` / `CONFIGURE YOUR ENVIRONMENT` / `RUN RECIPES`.
- For `mod config -h`: triaged groupings (`SETUP (required)`, `AUTO-CONFIGURED`, `OPTIONAL`).
- Picocli's underline-bold treatment is replaced with bold-only ALL-CAPS + slight letter-spacing.
- Color appears in help: cyan for commands and links, yellow for hints/notes, dim for descriptions.

**System should codify.**

- ALL-CAPS, bold, slight letter-spacing for section headers. Drop underline. Token: section-header.
- The Annie-proposed section names supersede picocli defaults: `USAGE` (vs `Usage:`), `FLAGS` (vs `Options:`), `ARGUMENTS` (vs `Parameters:`), and so on.
- Color is permitted in help output (cyan commands, yellow hints, dim descriptions). This is a change from the current "no color in help" rule.
- The structure for leaf-command help is: summary → consequence → USAGE → ?Hint → FLAGS → EXAMPLES → NEXT STEP → LEARN MORE.
- The structure for subcommand listings is: summary → USAGE → triaged groups (where applicable) → LEARN MORE.
- The structure for top-level help is: banner → tagline → USAGE → numbered onboarding ladder → FLAGS → LEARN MORE.

**Out-of-scope-for-now.** Whether picocli should be replaced or extended to render this shape, vs. whether each `@Command` annotation gets re-authored, is a CLI engineering question. → `gaps.md` Part B.

### J — Deprecation

**Current CLI.** Two unlinked mechanisms (D-06):

- `@Deprecated` on a command class → yellow runtime banner.
- `(DEPRECATED) ` text prefix in `@Command` / `@Option` description → help-text-only.

Visual treatment of mechanism 1: `WARNING: This command is deprecated and may be removed in a future release` (`BAN-005`), yellow highlight.

**Intended direction.** Annie's PDF removes deprecated entries entirely from help text rather than tagging them (e.g., `--password (DEPRECATED)`, `--token (DEPRECATED)`, `--user (DEPRECATED)` in `mod config moderne edit -h` are gone in the proposed). The runtime banner is not addressed.

**System should codify.**

- Visual treatment of the runtime deprecation banner: keep current shape (`BAN-005`). Yellow, single sentence, between start banner and `run()`. Token: warning-yellow.
- Help text: deprecated flags / options are visually demoted (rendered in the `metadata` / dim-gray color) when shown, not tagged with an inline `(DEPRECATED) ` prefix. They sit in a separate sub-section near the end of the FLAGS block, never inline among active flags.
- The text-only `(DEPRECATED) ` prefix is retired in favor of demotion.
- Whether deprecated flags are shown at all is a behavioral choice; the visual system codifies *how* they appear when shown.

**Out-of-scope-for-now.** Whether option-level deprecation should fire a runtime warning when the option is passed (gap noted in D-06) is a CLI engineering decision. → `gaps.md` Part B.

### K — Incubation / experimental

**Current CLI.** `(INCUBATING) ` text prefix only. No runtime banner, applied unevenly (D-18).

**Intended direction.** Not directly addressed.

**System should codify.**

- Visual treatment: the `(INCUBATING) ` text prefix is replaced by a tag rendered in the cyan (`#67e8f9`) info color, prefixed to the command's `header` description in help output. Inline tag form: `[incubating]`. Distinct from deprecation (which is yellow + demotion).
- The tag is positional (immediately follows the command name in listings) and visually subordinate to the command name itself.

**Out-of-scope-for-now.** Whether incubation should also fire a runtime banner like deprecation (D-18) is a behavioral decision. → `gaps.md` Part B.

### L — Banners (start / close)

**Current CLI.** Five banners (`BAN-001` start; `BAN-002` succeeded; `BAN-003` succeeded with warnings; `BAN-004` partial-success and failed; `BAN-005` deprecation). Color encoding: green (success), yellow (warnings, partial, deprecation), red (failure).

**Intended direction.** All four close banners are preserved verbatim in the artifacts (`MOD SUCCEEDED`, `MOD FAILED`, `MOD PARTIALLY SUCCEEDED`). The start banner is not redesigned.

**System should codify.**

- Start banner (`BAN-001`): preserve as-is. Logo + version line, centered, no color, leading content. Two layouts: rich UTF-8 box-drawing and ASCII `@`-art fallback (D-22). Both retained as the only layout-level fallback in the system.
- Close banner shape: `\n<CAPS PHRASE> in (<duration>)`, leading blank line, no glyph, bold, color per state (success-green / warning-yellow / error-red).
- All close banners use the same shape and metric (`in (<duration>)`); only the phrase and color differ.

**Out-of-scope-for-now.** The spacing asymmetry on the failure path (`F-08`) is a framework-layer formatting bug that the visual system codifies *against* (banners should have symmetric leading whitespace) but does not direct how to fix in code. → `gaps.md` Part B.

### M — Action headers

**Current CLI.** `printAction(action)` and `FactoryOutput` both render bold `● <action>`. Indentation conventions for sub-content vary (2, 4, or 8 spaces) per emitter (D-20).

**Intended direction.** The artifacts use `● <action>` headers in error frames (`● WHAT WENT WRONG`, `● TRY`) and as section markers in success frames (`● Loading recipe`, `● Running recipe on 47 repositories`). All cases use the same bold `●` glyph.

**System should codify.**

- Action header: `●` (bullet glyph) + space + ALL-CAPS phrase or sentence-case verb. Bold treatment. Color of the `●` itself matches the section's semantic (red for error sections, primary white for neutral action headers, success-green where appropriate). Body text in primary white.
- Indentation under an action header: **two-space indent for content; four-space indent for sub-items inside an enumerated list within content**. This collapses the current 2/4/8-space drift to a single hierarchy: 2 (section content), 4 (list items), no other indents in use.

**Out-of-scope-for-now.** Migration of `FactoryOutput`'s 8-space convention is framework-engineering work. → `gaps.md` Part B.

### N — "What to do next" / next-steps

**Current CLI.** `suggestNextSteps(...)` (`NXT-001`) renders bold `● What to do next` header + 4-space-indented `> ` (yellow) per item.

**Intended direction.** Both authors redesign:

- Annie's success-side help screens use `NEXT STEP` (singular, ALL-CAPS) as a section header with a single recommended next command.
- Jayd's `mod run` success frame uses `WHAT TO DO NEXT` (plural, ALL-CAPS) with multiple `▶` bullets, each pairing a cyan command with a one-line gloss separated by an em-dash.

The success-list bullet is `▶`, matching the error-recovery bullet — not the legacy `>`.

**System should codify.**

- Section header: `WHAT TO DO NEXT` for run-time success forward-chains; `NEXT STEP` for help-screen single-action pointers.
- Bullet: `▶` (replaces `>`). Same glyph as the error-recovery bullet; semantic context disambiguates.
- Item shape: `▶ <command in cyan>` + spacing + em-dash + one-line gloss in supporting text. Indent: 2 spaces from the section header.
- The CLI's current `> ` bullet is retired in favor of `▶` (D-04).

### O — Prompts (interactive input)

**Current CLI.** Single `userInput(prompt)` helper. No punctuation convention, no `(y/n)` scheme, no password helper, no default-value display (D-21).

**Intended direction.** No artifact directly shows a prompt. Annie's `mod config moderne login` flow describes the browser flow but doesn't render an interactive prompt mid-command.

**System should codify.** (Extrapolated — see `gaps.md` Part A for the extrapolation note.)

- Prompt shape: `? <Imperative question> <[default-or-format-hint]> ` (trailing space for input). Yellow `?` glyph (matches the help-text `? Hint:` glyph; semantic context — prompt vs hint — is disambiguated by line position and following input cursor).
- Yes/no prompt: `? <Question> [Y/n] ` — capital letter is the default, lowercase is the alternative.
- Default-value display: `? <Question> [<default>] `.
- On invalid input: re-prompt with the same yellow `?` glyph + a corrective parenthetical, e.g. `? Try again (1–9): `. Do not throw `CommandException` for prompt-loop validation.

**Out-of-scope-for-now.** Whether to introduce a `--no-prompt` mode for non-interactive scripts, or a password helper (`O` notes this is missing entirely), or a re-prompt vs throw policy beyond the visual treatment — these are behavioral decisions. → `gaps.md` Part B.

### P — Tables / rows / lists

**Current CLI.** No shared table renderer. Six ad-hoc per-site formatters (D-08): `RichDiffRenderer`, `ListRepositories`, `RunHistory`, `CsvToExcel`, `Csv` (org sync), `FactoryOutput`. Each invents its own colors, alignment, headers, empty-state handling.

**Intended direction.** The artifacts include only one tabular surface — the journey-map's "Verified Command Paths" HTML table — which is reference material, not CLI output. They do not propose a CLI table primitive.

**System should codify.** (Extrapolated — see `gaps.md` Part A.)

- Default table primitive: column-aligned, no borders. Header row in section-header color (bold, primary-white, slight letter-spacing). Body rows in primary text color. Single blank line above and below. No horizontal rule.
- Column separator: two spaces minimum; right-pad each column to its widest cell.
- Row glyph (when one is needed for status — diff lines, success/fail per row): single character at column 0 (`✓`, `⚠`, `✗`), colored per semantic.
- Empty state: `<empty-statement>.` in supporting text under the table header. (E.g., `No repositories found.`) Optional follow-up `▶ <recovery>` bullet on a separate line.
- The `RichDiffRenderer` retains its specialized treatment (line numbers, gutter, content fill, annotations). The visual system codifies it as a dedicated pattern (`patterns/diff.md`) rather than the generic table primitive.

**Out-of-scope-for-now.** Migrating five existing per-site table renderers to a shared primitive is framework engineering. → `gaps.md` Part B.

### Q — Hyperlinks

**Current CLI.** OSC-8 hyperlinks via `AdvancedLinks.A` / `link`. Linked: log file paths, support email, data-table output paths, dashboard URLs. Not linked: repository paths, recipe IDs, tenant host URLs, stack-trace source references (D-15).

**Intended direction.** The artifacts use cyan for commands and links interchangeably — both render as cyan text. The journey-map's HTML uses `text-decoration` only on `td-wrong` (strikethrough on deprecated). Underline is not used in the proposed CLI output.

**System should codify.**

- Linkable content types are tokenized:
  - Log file paths → linked.
  - Support email (`support@moderne.io`) → linked.
  - Data-table output paths → linked.
  - Tenant / dashboard URLs → linked.
  - Repository paths → linked. (New; D-15 flagged this gap; the visual system promotes them.)
  - Recipe IDs → linked when the tenant has a public recipe page; plain-cyan text otherwise.
  - Stack-trace source references → not linked.
- Visual treatment: link content in cyan (`#67e8f9`); the underline is left to the terminal's link-rendering preference. The CLI does not impose underline.
- OSC-8 fallback: when not supported, emit plain cyan text (no `\u001B]8;;…` codes). No fallback bracket form.

**Out-of-scope-for-now.** Wiring `RepositorySpecFormatter` to emit OSC-8 links and similar code changes are framework engineering. → `gaps.md` Part B.

### R — Machine-readable output

**Current CLI.** `--csv` / `--json` / `--streaming` modes suppress banners, progress, action headers, next-steps, but **not** error rendering — `convertError` still emits free-form text on failure (D-14).

**Intended direction.** Not directly addressed. The artifacts target human-readable output.

**System should codify.** Visual layer only:

- In machine-readable modes, no glyphs, no color, no bold, no underline. Raw structured output.
- Errors in machine-readable modes are also visually neutral — no `●`, no `▶`, no color — rendered as a single-line plaintext message prefixed `error: ` (lowercase, ASCII). This is the visual fallback; whether errors should *additionally* be structured (JSON envelope) is a behavioral question.

**Out-of-scope-for-now.** Whether to introduce a JSON error envelope (`{error: {…}, suggestions: […]}`) and whether errors should write to stderr vs stdout in machine-readable modes — both behavioral. → `gaps.md` Part B.

### S — Terminal-capability fallbacks

**Current CLI.** Three independent fallback paths: `NO_COLOR` honored, UTF-8 fallback to ASCII glyphs, OSC-8 fallback to plain text, truecolor fallback to xterm-256, no-TTY fallback to `PlainProgressBar`. Logo has a layout-level fallback (D-22).

**Intended direction.** All artifacts assume color and Unicode rendering. The journey-map CSS doesn't acknowledge fallbacks.

**System should codify.**

- Glyph fallback table:
  - `●` → `*`
  - `✓` → `+`
  - `▶` → `>`
  - `└` → ASCII tree connector (`+--` or similar; preserve current ASCII variant)
  - `⚠` / `△` → `!`
  - `?` → `?` (already ASCII)
  - `!` → `!` (already ASCII)
- Color fallback: 24-bit truecolor → xterm-256 → `NO_COLOR` (no color codes at all). Glyphs continue to carry semantic when color is absent.
- The fallbacks are non-negotiable — every codified pattern must read in a `NO_COLOR + ASCII-only` terminal. Patterns that depend on color OR glyph for disambiguation (and not both) are flagged in `gaps.md` Part A.

### T — Exit codes

Not user-visible text. Not in the visual system's scope; noted only because exit codes encode state (`0` success or success-with-warnings, `-1` hard failure, `-2` partial success) that is otherwise carried by the close banner color.

---

## Part 2 — Deltas

Twenty-two deltas from `cli-deltas.md`. Each is a place where the same semantic state has multiple expressions; the visual system needs to pick (or accept multiplicity).

### D-01 — "Success" is signalled four different ways

Resolved under category A above. The visual system codifies two slots (close banner, sub-task glyph) and folds the four-way drift into them. Decision cost: medium → resolved.

### D-02 — Hard failure splits into actionable vs dead-end ⭐ **HIGH-LEVERAGE**

**Current CLI (visual reality).** ~140 throw sites with no concrete `.suggest(…)` calls render an error block whose `Try:` body contains only the unconditional support email. ~60 throw sites with at least one suggestion render a `Try:` body with the suggestion(s) followed by the support email. Both render through the same template — visually identical structure, materially different recovery utility.

**Intended direction (visual proposal).** Jayd's three full-template cards (`mod build`, `mod study`, `mod git sync`) are explicit demonstrations of how a dead-end error becomes an actionable error **without changing what the command does**. The visual mechanism is a structured `WHAT WENT WRONG` + optional `? Hint:` + `TRY` body containing two-or-three concrete `▶ <action>` lines, with the support email demoted to gray as the last item. Annie's wrong-command-path frame demonstrates the second tier (compact inline error for usage / command-not-found cases).

**What the visual system should codify.**

1. **The five-element full template** is the canonical visual treatment for runtime errors:
   ```
   FAILURE: mod failed with an exception
   
   ● WHAT WENT WRONG
     <one-line statement of the problem>
   
     ? Hint: <ambiguity-acknowledging cause(s)>      ← optional
   
   ● TRY
     ▶ <recovery action 1>
         <inlined command in cyan>
     ▶ <recovery action 2>
         <inlined command in cyan>
     ▶ Still stuck? Report to support@moderne.io   ← demoted to gray (see D-10)
   
   MOD FAILED in (<duration>)
   ```

2. **Tone in the `WHAT WENT WRONG` line is concrete, not generic.** Jayd's frames lead with what specifically failed: `No build tool found in /home/user/project.` (vs. current `No build tool found for directory /home/user/project`), `No data table matching "RewriteSources" in the last recipe run.` (vs. current `No data tables available`). The codification: the WHAT WENT WRONG line names the input that caused the failure (the path, the table name, the org name) when known.

3. **The `? Hint:` block is optional and used to acknowledge ambiguity.** When the CLI cannot tell distinct causes apart, the hint surfaces the alternatives without committing to one (Jayd's `mod git sync`: "A few things can cause this — the org name may not match, your login may have expired, or the CLI may not be reaching Moderne right now."). When the cause is known, the hint adds a concrete fact (Jayd's `mod study`: "The last run produced 0 data tables. The recipe may not emit tables, or the run failed before any were written.").

4. **Each `▶ <recovery action>` bullet** has two parts: an action verb in supporting text, and a concrete pasteable command in cyan immediately under or beside it. When the action involves a placeholder, the placeholder is rendered in dim text (e.g. `mod build <path> --only-tool gradle` — `<path>` dim, command body cyan).

5. **The compact inline tier** (Annie's wrong-command-path frame) is the canonical visual treatment for usage / command-not-found errors:
   ```
   ! Error: <terse statement that the input was wrong>
   
     Did you mean:
       <suggested correct command>
   
     Available commands for <parent>:
       <subcommand>  — <short description>
       <subcommand>  — <short description>
   ```
   No `FAILURE:` preface, no `MOD FAILED` close banner. Used when the error is the parser's, not the runtime's.

6. **The two-tier model is not interchangeable.** A runtime error never gets the inline treatment; a usage error never gets the full template. The visual system documents which surfaces map to which tier in `patterns/error.md`.

**Out-of-scope-for-now (behavioral / `gaps.md` Part B).**

- Whether every throw site should be required to supply at least one `.suggest(…)` call (the natural behavioral consequence of D-02).
- Whether the `convertError` framework should suppress the support line when concrete suggestions are present (the natural behavioral consequence of D-10) — see D-10 below.
- Whether the framework should classify exceptions into "user-side" vs "internal" to drive different rendering (e.g., an internal NPE gets the full template + stack trace; a user-side typo gets the inline tier).

### D-10 — `Report to support@moderne.io` is the hard-coded catch-all ⭐ **HIGH-LEVERAGE**

**Current CLI (visual reality).** `StandardCommand.java:342` unconditionally appends `Report to support@moderne.io` as the final `▶` bullet of every error's `Try:` block, regardless of whether other suggestions are present. The line is bold, OSC-8-linked, and the same color as actionable suggestions above it. From the user's perspective there is no visual distinction between *the only thing you can do* and *the last thing you should try*.

**Intended direction (visual proposal).** Jayd's frames demote the support line to gray (`t-gray`, `#64748b`) when concrete recovery suggestions precede it. Visually, it sits in the recovery list at the same column with the same `▶` glyph, but the color treatment de-emphasizes it. The phrasing also shifts from `Report to support@moderne.io` to `Still stuck? Report to support@moderne.io` — the question framing acknowledges that the user has tried other options.

**What the visual system should codify.**

1. **The support line is always last in the `TRY` block.** Position is invariant.

2. **Two visual states for the support line:**
   - When **no concrete suggestions precede it**: support line renders in supporting text color (not gray, not cyan), bullet `▶` matches. It is the only thing the user has, so it should be visible — not demoted.
   - When **at least one concrete suggestion precedes it**: support line renders in `metadata` / dim-gray color (`#64748b`). Bullet `▶` is also dimmed. The phrase is reworded to `Still stuck? Report to support@moderne.io`.

3. **The OSC-8 link on the email address is preserved in both states.** The link is functional regardless of color treatment.

4. **In the inline / usage error tier (D-02 second tier), the support line does not appear.** Compact errors don't have a recovery list; they have a corrective suggestion. Adding a support line would be incongruent.

5. **The phrase is configurable in voice.** "Report to support@moderne.io" reads as a directive when standalone but the question form ("Still stuck?") softens it appropriately when appended to a list. The system codifies both phrasings; voice.md addresses tone.

**Out-of-scope-for-now (behavioral / `gaps.md` Part B).**

- Whether the framework should automatically classify the no-suggestions-present case and demote the line accordingly. The visual system says "demote when other suggestions are present"; the framework decision is *how* to detect that. The visual rule is implementable either by introspecting the suggestions list or by a `showSupport` flag on `CommandException`.
- Whether `Report to support@moderne.io` should ever be entirely suppressed (e.g., for known user-side errors like typos where support cannot help — `F-04`'s observation). The visual system codifies the demoted shape but does not direct the framework to suppress.

### D-03 — "Warning yellow" carries six different semantics

**Current CLI.** Yellow color attaches to: inline `⚠` warning, deprecation banner, success-with-warnings banner, partial-success banner, next-step prefix, and `▶` step bullet inside `Try:`.

**Intended direction.** Yellow continues to be a single color carrying multiple meanings. The artifacts add `? Hint:` and `! Note:` to the yellow inventory but rely on glyph + leading word to disambiguate.

**System should codify.** Single yellow token, six expressions:

| Expression | Glyph | Leading word | Position |
|---|---|---|---|
| Inline warning | `⚠` | (none) | Mid-run |
| Hint | `?` | `Hint:` | Inline under a section header |
| Note | `!` | `Note:` | Inline under a section header |
| Deprecation banner | (none) | `WARNING:` | Top-of-run |
| Success-with-warnings banner | (none) | `WARNING:` | End-of-run preface |
| Partial-success banner | (none) | `PARTIAL SUCCESS:` | End-of-run preface |

The combination of glyph + leading word + position discriminates without splitting the color token. Decision cost: high → resolved by accepting the accumulated meaning of yellow rather than fragmenting it.

The legacy `> ` bullet on next-steps (D-04) is retired in favor of `▶`, removing one yellow expression.

**Out-of-scope-for-now.** Whether deprecation deserves its own non-yellow visual treatment. The system codifies yellow for now; a future iteration could split if the yellow channel becomes overloaded. → `gaps.md` Part B.

### D-04 — List item bullet uses three different glyphs

**Current CLI.** `▶` (Try: items), `> ` (next-steps items), `●` (section headers).

**Intended direction.** Both authors use `▶` for actionable items in both error-recovery and success-forward-chain. The legacy `> ` bullet does not appear in either artifact.

**System should codify.**

- `●` → section / action header (always).
- `▶` → actionable item bullet (recovery, next-step, recommendation).
- `> ` → retired.

Decision cost: low → resolved.

### D-05 — Empty state has six variants

**Current CLI.** Six expressions of "the thing you asked for has zero results" (D-05).

**Intended direction.** Not directly addressed. (`mod search` with 0 results is technically empty-state, but Jayd's frame treats it as the partial-success category, not the empty-state category. See category B.)

**System should codify (visual layer).**

- Empty-state line: supporting text, no glyph, single sentence ending with a period: `No <noun-phrase>.`
- When a recovery action is appropriate (the user can do something to populate the empty state), follow with a single `▶` line in cyan: `▶ <action>` + glossing prose.
- The empty-state line never throws when rendering as an empty list — that classification (empty-as-error vs empty-as-fact) is behavioral.

**Out-of-scope-for-now.** Choosing for each surface whether empty-as-error vs empty-as-fact applies (the audit cited 6 sites, 4 different classifications). The visual system codifies the rendering shape; the per-surface classification is product / CLI engineering. → `gaps.md` Part B.

### D-06 — Deprecation has two unlinked mechanisms

Resolved under category J above. Visual treatment of class-level deprecation banner: kept (`BAN-005` shape). Visual treatment of help-text deprecation: replace `(DEPRECATED)` text prefix with demotion (gray, in a sub-section). The behavioral question of whether to add an option-level runtime warning → `gaps.md` Part B.

### D-07 — `intermediateResult` vs `setExtraMessage` are misapplied

Largely behavioral (the misapplication is at the API level). Visual aspect: see category H — the system does not introduce a visual disambiguation between transient and persistent. Decision cost: high → mostly out-of-scope-for-now → `gaps.md` Part B.

### D-08 — Tables are rendered six ways

Resolved under category P above. The system codifies a default table primitive (column-aligned, no borders, header row in section-header color, no horizontal rule). Migrating existing tables → `gaps.md` Part B.

### D-09 — Stack-trace disclosure is inconsistent

**Current CLI.** `showStack` defaults to `true`, ~25 sites explicitly disable it. The `● Where:` block appears or doesn't with no consistent rule (D-09).

**Intended direction.** Jayd's full-template error frames **don't include a `● Where:` section at all**. The five-element shape is preface → WHAT WENT WRONG → ?Hint → TRY → close banner. Stack traces are absent.

**System should codify (visual layer).**

- The user-facing error template (full and inline tiers) does not include a stack trace.
- When the framework detects an internal exception (NullPointerException, IllegalStateException, anything not deliberately thrown by the CLI's own code), the error template gains a `● TECHNICAL DETAILS` section in `metadata` / dim-gray color, collapsed visually below the `TRY` block. The stack trace renders in this section.
- The default exit-code-and-banner shape doesn't change.

**Out-of-scope-for-now.** Whether `showStack` defaults to false (the natural CLI engineering consequence) and whether the `Where:` / `Cause:` blocks are migrated to the new `TECHNICAL DETAILS` section. → `gaps.md` Part B.

### D-11 — `setWarning(Throwable)` is deprecated but still used

Behavioral / API decision. The visual treatment of success-with-warnings (category C) is codified; how the framework gets there is `gaps.md` Part B.

### D-12 — Picocli markup usage for inline references is inconsistent

**Current CLI.** Bold for cross-references in `@Command(description=...)`; mixed in error suggestion strings; literal-rendered if used in `CommandException` message body (`F-03`).

**Intended direction.** The artifacts use **cyan, not bold**, for inline command references. `mod study --last-recipe-run` in Jayd's `mod run` success forward-chain is cyan-not-bold. Annie's help screens use cyan everywhere a command appears.

**System should codify.**

- Inline command references render in cyan (`#67e8f9`), not bold.
- Inline flag references render in cyan, not bold.
- Inline path references render in cyan, not bold.
- Bold is reserved for: section headers (which are also ALL-CAPS) and banners.
- The current bold-via-picocli-markup pattern is retired.

**Out-of-scope-for-now.** Migrating `@Command(description=...)` strings from `@|bold ...|@` to whatever cyan rendering the framework needs is CLI engineering. → `gaps.md` Part B.

### D-13 — Progress-bar selection is spread across five env/OS checks

Visual layer: the system codifies the existence of an animated and a plain progress-bar shape, both detailed in category G. The five env/OS triggers are framework heuristics; the visual system does not specify which trigger applies. Decision cost: low for visual layer.

### D-14 — Machine-readable modes still emit human error text

Resolved under category R above. Visual layer codifies plaintext fallback for errors in machine modes; structured error envelope is behavioral → `gaps.md` Part B.

### D-15 — Hyperlinks inconsistent

Resolved under category Q above.

### D-16 — Icon-in-color encoding is forgiving but inconsistent

**Current CLI.** Pre-wrapped constants (`Icons.WARNING`, `Icons.SUCCESS`) usually used; some sites manually re-color via `_NO_COLOR` glyphs.

**Intended direction.** Glyphs are colored; body text is in primary/supporting tone. No sites in the artifacts color the body text along with the glyph.

**System should codify.**

- Default rule: glyph carries the color; body text uses primary or supporting.
- Exceptions: banner text (which is colored uniformly), section headers (bold-white).
- The `_NO_COLOR` manual-recolor pattern is retired in the visual system; only the pre-wrapped constants are in scope.

Decision cost: low → resolved.

### D-17 — Heading-override boilerplate duplicated

Framework / boilerplate concern. Visual layer codifies one heading set (the ALL-CAPS proposed in category I); how each subcommand inherits it is `gaps.md` Part B.

### D-18 — Incubation has no runtime manifestation

Resolved under category K above. The visual system codifies the `[incubating]` cyan-tag treatment in help; runtime banner is `gaps.md` Part B.

### D-19 — Progress message grammar varies

**Current CLI.** Gerund dominant (`"Resolving dependencies"`), some imperative (`"Asking Maven to..."`), some bare paths, some fragments.

**Intended direction.** Jayd's frames use gerund consistently (`Loading recipe`, `Running recipe on 47 repositories`, `Searching 47 repositories`). Annie's help screens use imperative for next-step descriptions (`Connect to your Moderne tenant.`).

**System should codify (voice).**

- Progress messages: gerund, single phrase, no period (unless trailing token would orphan punctuation).
- Help / next-step descriptions: imperative present tense ("Connect to…", "Configure…"), period.
- Error WHAT WENT WRONG line: declarative past tense or noun phrase ("No build tool found in…", "Unable to sync…"), period.
- Error TRY action: imperative present tense ("Add a build config…", "Run a recipe that emits data first…"), period or colon (when followed by a code line).

Decision cost: low → resolved. (Voice details are codified in `voice.md`; this delta is the visual / surface manifestation.)

### D-20 — Action-header indents inconsistent (2/4/8 spaces)

Resolved under category M above. Single hierarchy: 2 spaces (section content), 4 spaces (sub-items inside enumerated list).

### D-21 — Prompts have no style convention

Resolved under category O above. Visual treatment extrapolated; flagged in `gaps.md` Part A as extrapolation.

### D-22 — Logo has a layout-level fallback

Informational. The system codifies both UTF-8 and ASCII logo variants as the only layout-level fallback.

---

## Cross-cutting visual decisions

Three decisions emerged repeatedly across the categories and deltas above; consolidating them here:

1. **Color carries semantic; glyph reinforces.** Every glyph in the system has a default color; every color is used only on tokens with semantic meaning. Decorative use of color is not codified. The single color overload is yellow (D-03), accepted as a constraint and disambiguated by glyph + leading word.

2. **Demotion replaces tagging.** Where the current CLI uses parenthetical text labels (`(DEPRECATED)`, `(INCUBATING)`) inline among active content, the visual system demotes deprecated content to dim-gray and tags incubating content with a cyan `[incubating]` label. The text-prefix patterns are retired.

3. **Two error tiers, not one.** The current CLI renders all errors through the same `convertError` template. The visual system codifies a two-tier model: full template for runtime failures, compact inline for usage / parser errors. This is the highest-leverage visual decision in this reconciliation and the one with the most behavioral consequences (which `gaps.md` Part B catalogues).

---

## Summary of the high-leverage pair

D-02 and D-10 together are the visual heart of the design system the brief is asking for:

- **D-02** says: when a hard failure happens, the user should see a structured `WHAT WENT WRONG → ? Hint (optional) → TRY` body with two-or-more concrete recovery actions, plus a demoted support fallback. This is a visual change that requires the framework to ensure recovery suggestions exist at every throw site (behavioral).
- **D-10** says: the `Report to support@moderne.io` line is **always last**, **demoted to gray when other suggestions are present**, and **promoted to supporting text when it's the only option**. This is a pure visual change that the framework can implement with one branch.

Together, these two decisions transform the user-facing experience of every error in the CLI without changing what any command does. They are the visual layer's leverage on the "CLI error quality" problem the artifacts were responding to.

The codified shape is in `patterns/error.md` (full template) and `patterns/error.md` second section (inline tier). The token reconciliation is in `tokens.json`. The voice for each section is in `voice.md`. The decision rationale is in `rationale.md`. The behavioral consequences not addressed here are in `gaps.md` Part B.
