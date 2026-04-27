# Rationale

The decision trail for the visual system. For every significant reconciliation call between the audit (current CLI reality) and the artifacts (intended visual direction), one entry: what visual treatment we chose, what the current CLI shows, what the artifacts proposed, why we chose what we chose.

This file is the medium-scope deliverable that makes the rest of the design system defensible. If a later reviewer questions a token, pattern, or voice rule, the answer should be here.

## What this visual system is tuned for

The artifacts privilege **explanatory density**: more sections per screen, more concrete hints, more inlined next-step suggestions, more example values, more named things. Each line is shorter than the current CLI; each screen is longer.

This is a deliberate product fit for Moderne's user base — enterprise developers onboarding to a new tool and running commands intermittently. They are not power users driving the CLI by muscle memory; they are intelligent professionals coming back to the tool after weeks of doing other work, in a context where each round-trip to docs or to Slack costs real time.

The dominant metric this visual system optimizes is **time-to-understanding**, not time-to-keystroke. Every choice below tilts toward "the user reading this for the first time today understands what just happened and what to do next" rather than "the user can finish this in two fewer characters."

If Moderne's product shape changes — if the user base shifts to power users, if the CLI becomes a constant-use tool, if "time-to-keystroke" becomes the dominant metric — the visual system's assumptions will need revisiting. The patterns and tokens are tuned for who Moderne serves now, not in the abstract.

## High-leverage decisions

### Decision 1 — Two-tier error model (D-02)

**What we chose.** Two distinct error patterns: a five-element full template for runtime failures, a compact inline shape for usage / parser errors. Each has its own anatomy in `patterns/error.md`.

**What the current CLI shows.** A single template via `convertError`. Every error — from a typo'd subcommand to a runtime NPE — renders through the same `FAILURE: …` preface, `● Where:` (stack trace), `● Cause:`, `● What went wrong:`, `● Try:` (with mandatory support footer), `MOD FAILED` close banner. ~140 throw sites have no concrete suggestion in the `Try:` block; ~60 have at least one. The structural shape doesn't distinguish them.

**What the artifacts proposed.** Jayd's three full-template cards (`mod build`, `mod study`, `mod git sync`) restructure runtime errors into a five-element shape: preface → `WHAT WENT WRONG` → optional `? Hint:` → `TRY` (with concrete `▶` recovery actions) → close banner. Annie's wrong-command-path frame introduces a separate compact shape for usage errors (no preface, no banner, just `! Error:` + `Did you mean:` + `Available commands for <parent>:`).

**Why we chose the two-tier model.**

- A typo and a build failure are not the same kind of event. Treating them with the same visual weight (`FAILURE:` preface + `MOD FAILED` close banner + four sections) over-dramatizes typos and under-structures runtime failures.
- The artifacts' two frames *converge* on the distinction implicitly — Annie's compact shape and Jayd's full template are obviously different in shape, even though neither author explicitly named the split. Codifying the distinction makes the implicit explicit.
- The two tiers can coexist in the codebase without re-architecting: the framework already has enough to classify a usage error vs. a runtime error (parser-side vs. `run()`-side throws). The visual system doesn't require new behavior to render the right tier for the right case — it requires the framework to choose.

**Trade-off.** The framework now has to make a Tier 1 vs. Tier 2 choice. If it gets the choice wrong (renders a runtime failure as Tier 2, or a typo as Tier 1), the visual experience is jarring. The behavioral question of *how* to make that choice is deferred to `gaps.md` Part B; the visual system documents the target state.

### Decision 2 — Demote the support footer when other suggestions exist (D-10)

**What we chose.** The `Report to support@moderne.io` line is **always last** in the `TRY` block. Two visual states:

- When other concrete suggestions precede it → demoted to `typography.metadata` (gray), reworded `Still stuck? Report to support@moderne.io`.
- When it's the only entry → not demoted (`typography.supporting`), worded `Report to support@moderne.io` (no question framing).

In the inline / usage tier, the support line does not appear at all.

**What the current CLI shows.** `StandardCommand.java:342` unconditionally appends `Report to support@moderne.io` as the final `Try:` bullet on every failure. Same color, same weight, same `▶` glyph as actionable suggestions above it. Visually, "the only thing you can do" looks identical to "the last thing you should try after the others."

**What the artifacts proposed.** Jayd's frames demote the support line to gray (`#64748b`), put it last under concrete recovery actions, and reword to the question form. The phrasing shift acknowledges the user has already tried the other options — it's not a directive, it's an exit ramp.

**Why we chose this rule.**

- The audit's Finding F-04 documents that the support line fires on every failure, including user errors that support cannot help with (typos, missing config). It is "the single most-emitted defect-flavoured line in the CLI."
- Demotion (rather than deletion) preserves the escalation path. The user can still see the email; it just doesn't compete with the actionable suggestions above it.
- Two states (demoted vs. not demoted) handle the "this is the only thing you can do" case correctly. When the user has *no* other recovery, the support line is the answer — it should be visible, not receded.
- The OSC-8 link on the email stays in both states. The link is functional regardless of color treatment.

**Trade-off.** The framework needs to know whether other concrete suggestions exist before rendering the support line. This is doable either by introspecting the `CommandException`'s suggestions list at render time or by a `showSupport` flag on the exception. Both are framework decisions, not visual ones — `gaps.md` Part B carries the question.

### Decision 3 — Single yellow token, six expressions (D-03)

**What we chose.** One yellow color (`#fbbf24`) covers six surface expressions: inline `⚠` warning, `? Hint:`, `! Note:`, deprecation banner, success-with-warnings banner, partial-success preface. Disambiguation is by glyph + leading word + position, not by additional color.

**What the current CLI shows.** Yellow attaches to: inline `⚠` warning, deprecation banner, success-with-warnings banner, partial-success banner, next-step prefix, `▶` step bullet inside `Try:`. Six expressions. Same color, accumulated meaning.

**What the artifacts proposed.** Yellow continues to be a single color carrying multiple meanings. The artifacts add `? Hint:` and `! Note:` to the yellow inventory but rely on glyph + leading word to disambiguate. Neither author proposed splitting the yellow token.

**Why we chose to accept rather than split.**

- The artifacts converged on this implicitly. Both authors used yellow for new things (hints, notes) without proposing a new color. That alignment is a signal: in their mental model, the unifying meaning of "attention but not fatal" justifies a single color.
- Splitting yellow into (say) "warning" and "advisory" creates a false precision. A `? Hint:` ("where would I find this?") and a `! Note:` ("needs read AND write access") are both advisory; an inline `⚠` is a warning; the partial-success banner is a result. The categories blur at the edges.
- Glyph + leading word + position discriminate without adding a token. `?` says "Hint:", `!` says "Note:" or "Error:", `⚠` says itself, banner-position + leading word ("WARNING:", "PARTIAL SUCCESS:") says the rest.
- The existing CLI is already operating with this overload and users are not visibly confused. The audit category E doesn't flag user complaints about yellow ambiguity — it flags multi-expression of the same color, which is what the artifacts also produce.

**Trade-off.** The yellow channel is now overloaded by design. If a future surface needs a *seventh* yellow expression, the system either accepts further overload or splits the token. That decision is deferred to a future iteration.

### Decision 4 — Demotion replaces tagging (D-06, D-18)

**What we chose.** The current CLI's text-prefix tags (`(DEPRECATED)`, `(INCUBATING)`) are retired in favor of:

- **Deprecated content** → demoted to `typography.metadata` (gray), placed in a sub-section near the end of the FLAGS block. No inline `(DEPRECATED) ` prefix.
- **Incubating content** → tagged with a cyan `[incubating]` label positionally adjacent to the command name. Distinct from deprecation.

**What the current CLI shows.** Inline text prefixes: `--password (DEPRECATED)`, `--token (DEPRECATED)`, etc. Visually identical to active flags except for the tag text. Inconsistently applied across commands (D-06).

**What the artifacts proposed.** Annie's PDF *removes deprecated entries entirely* from her proposed help screens (not in the FLAGS list at all). She did not propose a "demoted but still visible" treatment. Incubation is not addressed.

**Why we chose demotion rather than deletion.**

- Annie's removal is a per-screen authoring choice, not a system rule. She removed the deprecated flags because they were visual noise in a redesigned screen; the system can't take that as a rule because some screens may legitimately need to surface a deprecated flag (e.g., a user has a script that uses it).
- Demotion preserves discoverability — the user can still find the deprecated flag if they need to — without making it compete with active flags for attention.
- Demotion reuses the same visual token already established for the support line (`typography.metadata`, gray). One demotion mechanism, two applications.
- Incubation is its own thing: cyan tag (signaling "interactive content," same color family as commands and flags) marks experimental features as opt-in rather than as warnings. Yellow would conflate with deprecation; gray would suggest deprecation; red would imply danger. Cyan distinguishes.

**Trade-off.** The current `(DEPRECATED) ` text-prefix authoring pattern is widespread. Migrating to the demotion pattern is a per-string code change. Out of scope here; → `gaps.md` Part B.

### Decision 5 — Cyan-not-bold for inline command references (D-12)

**What we chose.** Inline command, flag, and path references render in `color.semantic.info` (cyan), regular weight. Bold is reserved for section headers and banners. The current CLI's bold-via-picocli-markup pattern (`@|bold mod build|@`) is retired.

**What the current CLI shows.** Inline references use bold (via `@|bold ...|@` picocli markup), no color. The same markup syntax can leak into error messages (`F-03`), where it renders literally as `@|bold mod search|@` instead of formatted output.

**What the artifacts proposed.** Both authors render inline command references in cyan, regular weight. No bold. The journey-map CSS confirms it: `.t-cyan` is applied to terminal-class commands; `.t-bold` is separately applied to headers; the two classes are not stacked on inline references in any rendered surface.

**Why we chose cyan-not-bold.**

- Two emphasis channels (color and weight) doing the same job is redundant. Reserving bold for structural emphasis (headers, banners) and color for semantic emphasis (commands are interactive content) gives each channel a clear job.
- Cyan signals "this is interactive" — same color as flags, paths, and hyperlinks. The reader learns once that cyan = "you can type or click this" and the rule applies everywhere.
- Bold + color stacks badly in some terminals. Cyan-only is more portable.
- Eliminates the `F-03` markup-leaks-into-errors footgun by removing the convention that authors should bold commands inside `CommandException` messages.

**Trade-off.** Existing `@|bold ...|@` strings in `@Command` annotations and elsewhere need rewriting to whatever the new framework rendering uses (likely a styled-string helper that emits cyan). Framework engineering, → `gaps.md` Part B.

### Decision 6 — Stack traces leave the user-facing template (D-09)

**What we chose.** The user-facing error template (full and inline tiers) does not include a stack trace. When the framework detects an internal exception, an optional `● TECHNICAL DETAILS` section can render below `TRY` in `typography.metadata` (gray). This section is **extrapolated** — the artifacts don't show it.

**What the current CLI shows.** `convertError` emits `● Where:` with a sanitized stack trace by default. `showStack` is `true` by default; ~25 sites explicitly disable it. The stack trace is in the same visual weight as everything else in the error template.

**What the artifacts proposed.** Jayd's three full-template error cards have no `● Where:` block. The five-element shape is preface → `WHAT WENT WRONG` → `? Hint` → `TRY` → close banner. Stack traces are absent.

**Why we chose to remove from the primary template.**

- The artifacts deliberately omitted stack traces from the user-facing error template. That's the strongest signal: trained UX eyes saw the stack trace and decided it shouldn't be there for the kinds of errors users actually encounter.
- For runtime errors that *are* user-fixable (build tool not found, no data table), the stack trace is noise — it doesn't help the user understand the problem or do anything about it.
- For genuinely internal exceptions (NPE, ISE), the stack trace is useful — to support, to engineering. But it's debugging information, not user-facing primary content. Demoting it to a `● TECHNICAL DETAILS` section in gray puts it where engineers and support can find it without crowding the user's recovery path.

**Trade-off.** Hiding the stack trace by default may hurt support workflows in the short term (users won't paste stack traces by default). The mitigation is the support line itself: when a user *does* hit Tier 1 + TECHNICAL DETAILS, the demoted-but-present support line tells them where to send the report. The framework can also expose a `--debug` flag (behavioral, → `gaps.md` Part B) to opt back into stack-trace-by-default for diagnostic runs.

The TECHNICAL DETAILS section itself is an extrapolation; it's flagged in `gaps.md` Part A and `patterns/error.md`. A future iteration (with engineering input on internal-vs-user error classification) may revisit.

### Decision 7 — `▶` for actionable bullets, `●` for sections, `>` retired (D-04)

**What we chose.** `▶` is the actionable item bullet (recovery actions, next-step rows, recommendations). `●` is the section / action header marker. The legacy `>` next-step bullet is retired.

**What the current CLI shows.** Three bullets: `▶` (Try: items), `> ` (next-steps items), `●` (section headers). Three glyphs, two-and-a-half overlapping uses.

**What the artifacts proposed.** Both authors use `▶` for actionable items in both error-recovery (`▶ Add a build config`) and success-forward-chain (`▶ mod study --last-recipe-run — View results …`). The legacy `> ` bullet does not appear in either artifact.

**Why we chose to retire `>` rather than keep two bullets.**

- The visual difference between `>` (recovery suggestion) and `▶` (next-step) was not communicating different semantics — both are "actionable item bullet." The split was historical, not meaningful.
- Reusing `▶` across error TRY blocks and success WHAT TO DO NEXT blocks reinforces "▶ means do this." The reader learns the glyph once.
- `●` retains its single use as section / phase marker. Three-glyph inventory becomes two for actionable content (`●` for sections, `▶` for items inside sections).

**Trade-off.** Existing `> ` bullet sites need migration. Trivial code change.

### Decision 8 — Two error tiers don't include behavioral changes (scope)

**What we chose.** The visual system codifies the *target* shape of every visual surface. It does not direct the framework on *how* to detect which tier an error is, *whether* to suppress the support line for known user errors, *whether* to require every throw site to have a `.suggest(…)` call, or *whether* to add a `--debug` flag for stack traces.

**Why this scope discipline matters.**

- The brief is explicit: visual layer only. Behavioral and architectural questions are deliberately deferred to product and technical leadership in a future phase.
- Codifying the visual target separately from the behavioral mechanics means the framework has freedom to implement the target however fits its architecture. The visual system doesn't say "use a `showSupport` flag on `CommandException`"; it says "demote when other suggestions are present." The framework can detect that condition however it likes.
- Mixing behavioral prescriptions into the visual system would either over-constrain (the framework gets no choice) or be ignored (behavioral teams make their own calls and the visual rules drift). Keeping the layers separate is the cleanest way to land both stably.

The behavioral consequences of every visual decision above are catalogued in `gaps.md` Part B.

## Smaller decisions, briefly

For decisions that are less load-bearing but still worth noting on the record. Each is a single sentence on what we chose, with the audit / artifact reference for traceability.

- **ALL-CAPS section headers replace picocli's bold-underline** (category I). The two emphasis channels (case and weight) communicate "header" without the underline, which conflicts with terminal link-rendering and looks heavy in dense screens. Drawn from both artifacts uniformly.
- **Numbered onboarding steps are continuous across groups** (`patterns/onboarding-sequence.md`). Annie's top-level `mod` numbers run 1–9 across `GET STARTED` / `CONFIGURE YOUR ENVIRONMENT` / `RUN RECIPES`. Restarting at each group would suggest "do any one of these"; continuous numbering enforces "do these in order."
- **The `└` child connector is aligned under the command, not under the number** (`patterns/onboarding-sequence.md`). Aligning under the command keeps the cyan column dominant; aligning under the number would draw the eye to the number column.
- **Indent collapses to two values: 2 (section content), 4 (list-item continuation)** (D-20). The current 2/4/8-space drift is a symptom of multiple emitters not coordinating; a single hierarchy resolves it.
- **Empty-state line uses no glyph; recovery action uses `▶`** (`patterns/list.md`). The empty state itself is a fact, not an action — no glyph. The recovery action is an action — `▶`.
- **Banner shape standardizes on `\n<CAPS PHRASE> in (<duration>)`** (category L). Same shape and metric across all four close banners (success, partial, success-with-warnings, failure); only the phrase and color differ.
- **Hyperlink content tokenized by target type** (category Q). Log paths, support email, dashboard URLs, repo paths all link. Stack-trace source references don't. The list is in `tokens.json $link.linkable_targets`.
- **Machine-readable mode emits no glyphs, no color, no bold** (`tokens.json $machine_readable`). Errors render as `error: <message>` (lowercase, ASCII) — visual fallback only. The structured-envelope question is behavioral and deferred.

## Rejected alternatives

A few alternatives that came up during reconciliation and were *not* chosen, with the reason for rejection. Listed so future reviewers can see what was considered.

- **Splitting yellow into separate "warning" and "advisory" tokens** (alt to Decision 3). Rejected because the artifacts converged on a single yellow; splitting creates false precision; glyph + word + position discriminate without a new color.
- **Removing the support line entirely from errors with concrete suggestions** (alt to Decision 2). Rejected because the support line is the escalation path — users who try the suggestions and still fail need to know where to go next. Demotion preserves the path without competing for attention.
- **Single error template with optional `WHAT WENT WRONG` shape** (alt to Decision 1). Rejected because a typo and a runtime failure are not the same event; treating them with the same visual weight (preface + close banner) over-dramatizes the typo.
- **`(DEPRECATED) ` prefix in dim color** (alt to Decision 4 — keep tagging, color the tag). Rejected because the tag itself is the redundancy; demoting the whole row in gray says "this is receded" without needing a label.
- **Bold + cyan stacked for inline commands** (alt to Decision 5). Rejected because two emphasis channels doing the same job is redundant; cyan alone is sufficient and more portable across terminals.

## Open editorial questions (not rejected, deferred)

These are voice / authoring questions the system surfaces but does not resolve, because they are downstream of the visual system and depend on per-string context:

- **When to use `? Hint:` vs. `! Note:`.** `? Hint:` answers a question the user is asking; `! Note:` warns about a constraint the user might miss. The visual system distinguishes the two glyphs but the editorial choice is per-string. Voice.md gives examples; the per-command authoring guidance lives where the strings are written.
- **Whether a TRY block should have one, two, or three `▶` actions.** Visual system says "list recovery actions in most-likely-to-help order"; editorial choice is how many. Two-to-three is the artifact convention; the system doesn't impose a count.
- **Whether the `WHAT TO DO NEXT` block appears after every successful run.** Visual system says "encouraged for any command whose output is plausibly the start of a multi-step workflow"; per-command authoring decides.

These are listed not because the system fails to address them, but because they are deliberately out of scope for the visual layer.
