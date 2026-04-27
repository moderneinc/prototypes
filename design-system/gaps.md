# Gaps

A two-part document.

- **Part A — Extrapolations.** Patterns and tokens in this design system that are extrapolated rather than derived from real examples in the artifacts. Most likely to need revision later.
- **Part B — Out of scope for UI foundations.** Observations from the audit and reconciliation that raise questions the visual system can't answer on its own. They require product or technical leadership input. Logged here so they're ready for the next phase of conversation, not solved prematurely.

The boundary between the two: Part A is "we made this up but it follows from what we have"; Part B is "we deliberately did not answer this because it's not a visual question."

---

## Part A — Extrapolations

Each entry: where the extrapolation lives, what we extrapolated, what evidence (if any) it stands on, and the most likely revision risk.

### A-1 — `● TECHNICAL DETAILS` section in error template

**Where.** `patterns/error.md` Tier 1, `rationale.md` Decision 6.

**What we extrapolated.** A `● TECHNICAL DETAILS` sub-section that renders below `TRY` in `typography.metadata` (gray) when the framework detects an internal exception (NPE, ISE — anything not deliberately thrown by the CLI). Contains the stack trace.

**Evidence.** Jayd's frames omit stack traces from the user-facing error template entirely; the audit (D-09, F-09) notes inconsistent stack-trace disclosure today. The combination implies "stack traces should be demoted, not absent" — but no artifact shows the demoted form.

**Revision risk.** Medium. The first time engineering or support has to debug a real production issue under this system, they may push back on "demoted" being too demoted. The fix is straightforward (un-demote, or add a `--debug` flag — behavioral, B-3).

### A-2 — `● SSL connection details:` as a sub-section under `WHAT WENT WRONG`

**Where.** `patterns/error.md` Tier 1.

**What we extrapolated.** When `SslDiagnostics.generateReport(...)` produces output (audit `F-10`), it renders as a sub-section nested under `WHAT WENT WRONG` rather than as a peer to `WHAT WENT WRONG` and `TRY`. Treated as cause-narrowing detail, not a separate phase.

**Evidence.** The audit notes the SSL diagnostics block is conditional and runs on every error path. Neither artifact addresses SSL specifically. The choice to nest under `WHAT WENT WRONG` follows the system's hierarchy (cause goes near the cause statement, recovery goes in TRY).

**Revision risk.** Low. SSL errors are a small fraction of total errors; if the rendering is wrong, it's correctable in isolation.

### A-3 — Inline error tier variants beyond unknown-command

**Where.** `patterns/error.md` Tier 2.

**What we extrapolated.** Unknown-flag and missing-required-argument variants of the inline / usage error tier. Annie's wrong-command-path frame only shows the unknown-command variant.

**Evidence.** The general shape (`! Error: <terse>` + corrective suggestion + listing) extends naturally to other parser-side errors. But the specific phrasing of "Did you mean: --flag" or "Missing required: <arg>" is invented.

**Revision risk.** Low to medium. Real parser errors will surface edge cases (multi-word flags, positional arguments, mutual exclusivity violations) that the unknown-command shape may not cover gracefully.

### A-4 — Prompt visual treatment

**Where.** `reconciliation.md` category O. (Pattern not authored as one of the 10 since prompts didn't appear in the deliverables list, but the visual treatment is documented in the reconciliation.)

**What we extrapolated.** The entire prompt pattern — yellow `?` glyph, `[Y/n]` default convention, `[<default>]` syntax, re-prompt-on-invalid-input behavior. No artifact shows a prompt.

**Evidence.** Annie's `mod config moderne login` flow describes a browser flow without rendering an in-CLI prompt. The audit category O notes the current `userInput(prompt)` helper has no convention. The extrapolation reuses the yellow `?` glyph from `? Hint:`.

**Revision risk.** Medium-high. Prompts are a discrete interaction surface and the extrapolated rules may conflict with how the existing CLI implements password input, multi-line input, or default selection. A pass with a UX designer specifically on prompts would resolve this.

### A-5 — Table primitive shape, row glyphs, empty-state recovery

**Where.** `patterns/list.md`, `reconciliation.md` category P.

**What we extrapolated.** The entire table primitive: column-aligned with no borders, header in section-header color, optional row glyphs (`✓` / `⚠` / `✗`) for per-row status, trailing summary line, empty-state line + optional `▶` recovery. Neither artifact renders a CLI table.

**Evidence.** The journey-map's "Verified Command Paths" HTML table is reference material, not CLI output. The category P reconciliation cites the existing six per-site renderers and proposes a unified shape; the unification is the system's call, not the artifacts'.

**Revision risk.** High. Tables are one of the most-used surfaces and the extrapolation has the most latitude. The first three commands migrated to the primitive will likely surface needed adjustments (column-width handling for very long values, multi-line cells, sort indicators).

### A-6 — Progress bar shape and ASCII fallback

**Where.** `patterns/progress.md`.

**What we extrapolated.** The animated progress bar shape (`[████████░░░░░░] 23/47 (49%)`), the plain-fallback shape, the persistent action header + transient sub-status split. Neither artifact renders a bar; both show only post-resolution scrollback.

**Evidence.** The existing `AnimatedProgressBar` / `PlainProgressBar` / `NoopProgressBar` triplet (audit category G) provides the framework foundation. The extrapolation tunes the visual treatment to match the rest of the system (action header style, dim sub-status).

**Revision risk.** Low. The current bar already works; the extrapolation mostly inherits the existing shape with refinements.

### A-7 — `% complete` ETA display

**Where.** `patterns/progress.md`.

**What we extrapolated.** Whether percentage and ETA are shown alongside the count is left open; the example shows percentage but doesn't define ETA.

**Evidence.** Neither artifact shows progress UI. The current bar does include count and percentage; ETA is not consistently emitted today.

**Revision risk.** Low. ETA is additive — adding it later doesn't break the codified shape.

### A-8 — Multi-row partial-success table form

**Where.** `patterns/partial-success.md`.

**What we extrapolated.** When per-row variance matters (different repos failed for different reasons), partial success transitions from the single-`⚠`-line shape to the table form (`patterns/list.md`). Jayd's `mod search` card only shows the single-line shape because all 47 skipped for the same reason.

**Evidence.** The single-line shape doesn't gracefully scale to "5 failed for build error, 3 failed for missing LST, 39 succeeded." The transition to table form is a system call, not an artifact decision.

**Revision risk.** Medium. The threshold for "single line vs table" is judgment; the first commands that need it will pressure-test where the line goes.

### A-9 — Onboarding ladder reuse beyond top-level `mod`

**Where.** `patterns/onboarding-sequence.md`.

**What we extrapolated.** That the numbered onboarding ladder pattern is reusable beyond the top-level `mod` screen — e.g., for any multi-step interactive flow. The artifacts only show one onboarding ladder (Annie's top-level).

**Evidence.** The pattern is well-scoped (3–12 steps in order, user is in a learning posture); applicability beyond top-level help is the system's call.

**Revision risk.** Low. The pattern is internally coherent; reuse will either fit or not, and the cost of a misuse is "use a different pattern."

### A-10 — Inline reference treatments for partial cases

**Where.** `patterns/inline-command-reference.md`.

**What we extrapolated.** How to render a flag mentioned without its command (`Pass --last-recipe-run to scope to your most recent run`); how to render references to commands the user can't run yet (deprecated commands mentioned in "this replaces X" notes). Neither variant appears in the artifacts.

**Evidence.** The flag-alone case follows naturally from the cyan token. The "can't run yet" case is conjectured to use `typography.metadata` (gray); evidence is the system's demotion-replaces-deletion rule (Decision 4 in `rationale.md`).

**Revision risk.** Low. These are minor corner cases.

### A-11 — Sub-task success row count formatting beyond repo-counts

**Where.** `patterns/success.md`.

**What we extrapolated.** That `✓ 42 repositories modified` scales to `✓ 5 files generated`, `✓ 12 indexes built`, etc. Jayd's `mod run` frame only shows repo-counts.

**Evidence.** The "leading number + past-participle verb + noun" structure is grammatical and reusable.

**Revision risk.** Low.

### A-12 — Sub-section / flag grouping in FLAGS

**Where.** `patterns/help-command.md`.

**What we extrapolated.** The "Authentication (pick one):" sub-header inside a `FLAGS` block is sentence-case, body weight, no glyph. Annie's `mod config moderne edit` proposed grouping flag choices but the exact visual shape of the sub-header is the system's call.

**Evidence.** Annie's PDF shows the grouping; the styling specifics (weight, glyph) are inferred from the surrounding pattern.

**Revision risk.** Low.

### A-13 — Triaged subcommand groups beyond `mod config`

**Where.** `patterns/help-subcommand.md`.

**What we extrapolated.** That the `SETUP (required) / AUTO-CONFIGURED / OPTIONAL` triage shape generalizes to other parent commands (`mod git`, `mod run`?). Annie only proposed it for `mod config`.

**Evidence.** The shape is well-defined (user-role groupings, not alphabetical bins); generalizability is the system's bet.

**Revision risk.** Medium. The triage may not match how other parent commands' subcommands cluster naturally.

### A-14 — `--all` ungrouped fallback shape

**Where.** `patterns/help-subcommand.md`.

**What we extrapolated.** That the `--all` flag (referenced in Annie's `mod config -h --all` `LEARN MORE`) renders as a flat alphabetical listing using the same row shape as the triaged groups. Annie only mentions the flag, doesn't render the screen.

**Evidence.** The alphabetical-listing fallback is the natural complement to triaged grouping; it's the system's call to define its shape.

**Revision risk.** Low.

### A-15 — Banner / preface symmetric whitespace

**Where.** `tokens.json $spacing.vertical.around_close_banner` and `around_failure_preface`.

**What we extrapolated.** That the spacing asymmetry on the failure path (`F-08`) gets resolved in favor of symmetry: one blank line above each banner, no extra blank line above the failure-path preface. The audit notes the asymmetry; the system's call is to codify symmetry.

**Evidence.** Symmetry is a defensible default; the artifacts don't render the asymmetry.

**Revision risk.** Very low. Cosmetic.

---

## Part B — Out of scope for UI foundations

Each entry: the question, why it's out of scope (visual system can't answer it), and where it surfaced (audit ID / category, or which decision in this system raised it).

These are catalogued *cleanly* — they should be reusable as the agenda for the next phase of conversation with product and technical leadership. They are not presented as recommendations or judgements; they are the open questions a complete CLI would need to answer.

### B-1 — Should every throw site be required to supply at least one `.suggest(…)` call?

**Source.** `reconciliation.md` D-02; `rationale.md` Decision 1; `patterns/error.md` Tier 1.

**Why out of scope.** The visual system codifies what an error with concrete recovery actions looks like. Whether the codebase enforces "every `CommandException` must have at least one suggestion" is a contributor / engineering rule, not a visual one. The natural consequence of D-02 is that this rule should exist; deciding it is engineering's call.

### B-2 — Should `convertError` automatically suppress the support line when concrete suggestions are present?

**Source.** `reconciliation.md` D-10; `rationale.md` Decision 2; `audit/cli-findings.md` F-04.

**Why out of scope.** The visual system says "demote when other suggestions are present." Whether the framework implements this by introspecting the suggestions list at render time, or by a `showSupport` flag on `CommandException`, is a framework architecture decision.

### B-3 — Should the framework classify exceptions as "user-side" vs. "internal" to drive Tier 1 vs. Tier 1+TECHNICAL DETAILS rendering?

**Source.** `rationale.md` Decisions 1 and 6; `patterns/error.md`.

**Why out of scope.** The visual system distinguishes the two cases visually but doesn't direct the framework on how to detect them. Classification depends on the exception type hierarchy, on whether throw-sites mark their exceptions, on whether the framework intercepts uncaught exceptions differently, etc. — all engineering decisions.

### B-4 — Should `Report to support@moderne.io` ever be entirely suppressed?

**Source.** `audit/cli-findings.md` F-04; `rationale.md` Decision 2.

**Why out of scope.** The visual system codifies the demoted shape but does not direct suppression. Whether known-user-side errors (typos, missing config) should suppress the support line entirely is a product-and-support decision: support cannot help with these errors, but suppressing the line means users hitting an edge case have no escalation path. Trade-off worth a real conversation.

### B-5 — Should partial success with 0 successes reclassify as outright failure?

**Source.** `reconciliation.md` category B; `audit/cli-deltas.md` mod search note; Jayd's `cli-error-states-ui-uplift.pdf` mod search card explicitly flags this.

**Why out of scope.** Pure product call. The visual system codifies both (`patterns/partial-success.md` and `patterns/error.md` Tier 1) and remains correct under either classification.

### B-6 — Should empty-result commands be classified as success, partial-success, or failure on a per-surface basis?

**Source.** `reconciliation.md` D-05.

**Why out of scope.** Per-surface product decision. The audit cites 6 sites with 4 different classifications today. The visual system codifies the empty-state line (`patterns/list.md`) and the empty-as-error TRY block (`patterns/error.md`) — picking which one applies per surface is product / IA.

### B-7 — Should the CLI introduce a JSON error envelope and stream errors to stderr in machine-readable modes?

**Source.** `reconciliation.md` D-14, category R.

**Why out of scope.** Output contract design. The visual system codifies the visual fallback (single-line `error: <message>` plaintext) but does not direct a structured envelope. Whether `--json --error-envelope` becomes the contract, whether errors land on stderr vs stdout, whether machine modes need exit-code parity with interactive modes — all behavioral.

### B-8 — Should `setWarning(Throwable)` be removed or replaced with a non-deprecated API?

**Source.** `audit/cli-findings.md` F-01, F-02; `audit/cli-deltas.md` D-11.

**Why out of scope.** API design. The visual system codifies how success-with-warnings looks (`patterns/partial-success.md` + category C); it does not direct the framework on how to get there.

### B-9 — Should warnings set via `setWarning(...)` be visible in machine-readable modes?

**Source.** `audit/cli-findings.md` F-01.

**Why out of scope.** Machine-readable contract. The audit notes warnings are silently swallowed in `--csv`/`--json` mode; the visual system has no machine-readable warning surface to codify because the artifacts don't address machine modes.

### B-10 — Should picocli be replaced or extended to render the new help shape?

**Source.** `reconciliation.md` category I; `rationale.md` Decision 5.

**Why out of scope.** Framework choice. The visual system codifies the target help shape (`patterns/help-*.md`). Whether picocli's `IHelpFactory` is extended, whether each `@Command(description=...)` is rewritten, whether a new help renderer replaces picocli entirely — engineering decisions.

### B-11 — Should the `(DEPRECATED) ` text-prefix authoring pattern be migrated to the demotion rendering?

**Source.** `reconciliation.md` D-06, category J; `rationale.md` Decision 4.

**Why out of scope.** String-rewrite migration. The visual system codifies the target (gray-demoted, no prefix); the migration is per-string code change.

### B-12 — Should the option-level `(DEPRECATED) ` text on a flag fire a runtime warning when the flag is passed?

**Source.** `reconciliation.md` D-06.

**Why out of scope.** Behavioral. The visual treatment of a runtime warning is codified (yellow inline `⚠`); whether option-level deprecation fires one is engineering.

### B-13 — Should incubation fire a runtime banner like deprecation does?

**Source.** `reconciliation.md` category K, D-18.

**Why out of scope.** Behavioral. The visual treatment of an incubation banner could be codified if the decision lands "yes"; until then, the system codifies only the help-text `[incubating]` tag.

### B-14 — Should `intermediateResult` and `setExtraMessage` merge into a single API?

**Source.** `reconciliation.md` D-07, category H.

**Why out of scope.** API design. The visual system says they should look identical (and they do today); whether the underlying API consolidates is engineering.

### B-15 — Should progress expose a `--render=animated|plain|none` flag instead of inferring from environment?

**Source.** `reconciliation.md` D-13, category G.

**Why out of scope.** Flag design. The visual system codifies the existence of two visual modes and their shapes; how the framework selects between them is engineering.

### B-16 — Should the framework introduce a `--debug` mode for showing stack traces?

**Source.** `rationale.md` Decision 6; `reconciliation.md` D-09.

**Why out of scope.** Flag design. The visual system codifies the demoted `● TECHNICAL DETAILS` section; whether a `--debug` flag promotes it back to default-on is engineering.

### B-17 — Should existing per-site table renderers migrate to the shared primitive?

**Source.** `reconciliation.md` D-08, category P.

**Why out of scope.** Framework migration. The visual system codifies the target primitive (`patterns/list.md`); the migration of `ListRepositories`, `RunHistory`, `CsvToExcel`, `Csv` (org sync), and `FactoryOutput` to it is engineering work.

### B-18 — Should `RepositorySpecFormatter` be wired to emit OSC-8 hyperlinks for repository paths?

**Source.** `reconciliation.md` D-15, category Q.

**Why out of scope.** Implementation detail. The visual system codifies "repository paths are linkable" (`tokens.json $link.linkable_targets`); the wiring is engineering.

### B-19 — Should `EXAMPLES` in help screens be machine-validated against real CLI behavior?

**Source.** `patterns/help-command.md`.

**Why out of scope.** Testing concern. Validating that example commands actually work (the values in them are real, the flags are valid) is build-time tooling, not a visual rule.

### B-20 — Should the CLI track which onboarding steps a user has completed?

**Source.** `patterns/onboarding-sequence.md`.

**Why out of scope.** State-tracking and interaction design. The visual system codifies the ladder shape; whether the CLI dims completed steps, auto-advances, or persists progress is interaction design.

### B-21 — Should there be a `--no-prompt` mode for non-interactive scripts?

**Source.** `reconciliation.md` category O.

**Why out of scope.** Flag design + interaction design. The visual system extrapolates a prompt shape (Part A-4); whether prompts can be opted-out of is behavioral.

### B-22 — Which subcommands belong to `SETUP (required)` vs. `AUTO-CONFIGURED` vs. `OPTIONAL` for any given parent command?

**Source.** `patterns/help-subcommand.md`.

**Why out of scope.** Per-command IA / product decision. The visual system codifies the triage shape; the per-command triage is product.

### B-23 — Should `--all` be the right flag name for the ungrouped fallback listing?

**Source.** `patterns/help-subcommand.md`.

**Why out of scope.** Flag design. Out of scope.

### B-24 — Whether `printAction` and `suggestNextSteps` should remain auto-suppressed in machine-readable mode

**Source.** `audit/cli-findings.md` F-05.

**Why out of scope.** Behavioral / API contract. The audit notes both methods early-return when `!hasBanner()`. Whether this is documented as intentional, made configurable, or changed is engineering.

### B-25 — Should the CLI introduce a new info channel for plain neutral-status messaging?

**Source.** `reconciliation.md` category F.

**Why out of scope.** API design. The visual system documents `Icons.INFO` (`ℹ` blue) as a token but doesn't promote it to top-level command output without a specific use case. Whether the framework should add an info channel is engineering.

### B-26 — How should `mod` (no arguments) behave — show help, drop into REPL, prompt for first-run setup?

**Source.** `patterns/help-top-level.md`.

**Why out of scope.** Pure interaction design. The visual system codifies what the help screen looks like *if* `mod` no-arg shows the help screen.

### B-27 — Whether the existing CLI's spacing asymmetry on failure (F-08) should be fixed in code

**Source.** `audit/cli-findings.md` F-08; `tokens.json` codifies symmetric whitespace.

**Why out of scope.** Bug fix in framework code. The visual system codifies the target symmetry; fixing the existing asymmetry is engineering.

### B-28 — Whether `drawBanner` should be migrated from `System.out` to `spec.commandLine().getOut()` (F-11)

**Source.** `audit/cli-findings.md` F-11.

**Why out of scope.** Implementation. The audit's findings-only convention applies; the visual system has no opinion.

### B-29 — Whether `SslDiagnostics.generateReport(original)` should be gated on "is this plausibly an SSL failure" (F-10)

**Source.** `audit/cli-findings.md` F-10.

**Why out of scope.** Performance / framework. Visual system documents that SSL details, when present, render as a sub-section under WHAT WENT WRONG (Part A-2); whether the diagnostic is run in the first place is engineering.

### B-30 — Whether the `siblingCmd` / `hasSibling` helpers (F-07) should be promoted, deprecated, or repurposed

**Source.** `audit/cli-findings.md` F-07.

**Why out of scope.** API design. Visual system doesn't depend on them.

### B-31 — How long should the prompt-validation re-prompt loop run before giving up?

**Source.** `reconciliation.md` category O.

**Why out of scope.** Interaction design / behavioral. Visual system says "re-prompt with the same yellow `?` glyph + a corrective parenthetical"; the policy on infinite vs bounded retries is interaction design.

### B-32 — Whether to introduce a password-input helper distinct from `userInput`

**Source.** `reconciliation.md` category O notes the gap.

**Why out of scope.** API design. Out of scope for visual layer.

### B-33 — Whether the audit's characterization of any specific surface is wrong

**Source.** Brief specifies the audit is read-only and not to be edited.

**Why out of scope.** The brief is explicit. Where the audit might be wrong about a specific surface, this design system has used the audit as the best available evidence and noted any disagreements only in passing within `rationale.md`. No audit edit is proposed.

---

## How to read this file

If you are starting Phase 3 (the next phase that takes up product and technical decisions):

- **Part B is your agenda.** Each entry is a discrete question with a single source. They can be triaged by stakeholder (product / engineering / IA), grouped by domain (errors / help / progress / etc.), or sequenced by leverage (B-1 / B-2 / B-3 are the highest-leverage entries — they cluster around the same change).
- **Part A is your audit.** Each entry is a place where the visual system made a call without strong evidence. Spot-check them as the patterns get used in real surfaces; the patterns will tell you which extrapolations were close to the mark and which were not.

If you are reviewing this Phase 2 work:

- **Part A is the work's known weak points.** Push back on any extrapolation that doesn't match your sense of what the artifacts implied.
- **Part B is the work's deferred questions.** None of these were skipped accidentally; each was identified during reconciliation and deliberately not solved here. The boundary is "visual treatment yes, behavioral / IA / architectural change no."
