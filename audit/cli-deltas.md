# CLI Deltas — where the same semantic state is expressed differently

> Highest-leverage deliverable for Phase 2. Deltas are the places where the design system must **decide** rather than codify — the CLI hasn't yet, and humans will. Each entry gives Phase 2 enough context to make that decision without re-auditing.

**Entry schema:**
- **Name** — a short handle for cross-referencing.
- **Semantic state** — the thing the code is trying to communicate.
- **Variants** — how the same state is expressed in different places today, each with examples + code refs.
- **What differs** — structure / tone / color / typography / glyph / API.
- **Intentional variation vs drift** — best-guess characterization with the reasoning, not a decision.
- **Phase-2 decision cost** — how consequential picking a single treatment will be.

---

## D-01 — "Success" is signalled four different ways

**Semantic state:** the command (or a step inside it) completed its intended work.

**Variants:**

| # | Surface | Example | Code ref | Typography |
|---|---------|---------|----------|------------|
| 1 | End-of-run banner (`MOD SUCCEEDED`) | `\nMOD SUCCEEDED in 2m 14s` | `StandardCommand.java:187,193` | Green, bold, all-caps, no glyph, leading blank line |
| 2 | Inline `✓` glyph | `✓ Added 1,234 rows` | `CsvToExcel.java:153`; `TaskProgressBar.java:69`; `FactoryOutput.java:53` | Green+bold glyph, plain body |
| 3 | `finish(...)` sentence | `Listed 3 partitions.` | `ListRepositories.java:77-80`; `RunHistory.java:184`; `Csv.java:356` | Plain text, no glyph, sentence with period |
| 4 | Implicit via task counter | `overallSuccessful++` visible in the progress-bar counter strip | `AnimatedProgressBar` multi-task overall line | Green count integer; no sentence |

**What differs:** presence/absence of glyph, presence/absence of colour on body text, presence/absence of a period, whether any narrative text is emitted at all. Surfaces #1 and #2 can co-occur in the same command run.

**Intentional vs drift:** **partly intentional, partly drift.** The end-of-run banner is plainly intentional (one per run, gate the duration). The `finish` sentence is a legitimate additional signal for "command-scoped summary". But the inline `✓` is adopted unevenly — some commands use it for sub-task completions, others use a different glyph or none at all, and there's no documented convention for when to use which.

**Phase-2 decision cost:** **medium.** Depending on the system, the four variants may reduce to two (a run-level banner + a sub-task success indicator) or stay at three (adding `finish` as a dedicated summary surface). Consolidating #2 and #3 would likely need a real call-graph review.

---

## D-02 — "Hard failure" splits into actionable vs dead-end

**Semantic state:** the command could not complete, with varying degrees of user-recoverability.

**Variants:**

| Flavour | Throw-site pattern | Example | Code ref |
|---------|-------------------|---------|----------|
| **Dead-end** (~140 sites) | `throw new CommandException("<message>")` with **no** `.suggest(...)` | `"The clone failed"`; `"Gradle build failed"`; `"Remote repository is empty"`; `"No data table rows produced"` | `RepositoryCloneTask.java:138,159,185,215`; `Bazel.java:116,209,214`; `DotNetBuildStep.java:277`; `JavaScriptBuildStep.java:277`; `Study.java:171,212,218,288,304,323,334,336` |
| **Actionable** (~60 sites) | Builder with one-or-more `.suggest(...)` | `"maven not found on PATH"` + `"Set MAVEN_HOME"`; `"No artifact store configured"` + ``"Run `mod config lsts artifacts`"`` | `Maven.java:145,155,250`; `Gradle.java:163,190,282`; `Publish.java:101`; `Run.java:793`; `OrganizationMapper.java:116`; `JavaRuntime.java:202` |

Both flavours render through the same `convertError` template and always end with the hard-coded `"Report to support@moderne.io"`.

**What differs:** whether `Try:` contains one-or-more concrete recovery suggestions above the support line. Structurally identical otherwise: same red banner, same `● Where / What went wrong / Try:` sections, same `▶` bullets.

**Intentional vs drift:** **drift.** There is no codebase convention (or documentation) for when a throw site must supply suggestions. Coverage correlates more with who last touched the area — build-tool integrations and SSL handling are well covered; study, bazel, the lower-level recipe parsers are not. The design brief's observation ("three dead-end failure messages ending with 'Try: Report to support@moderne.io'") maps 1:1 to this delta.

**Phase-2 decision cost:** **very high.** This is the defining weakness the design brief is reacting to, and fixing it in the system requires a Phase-2 decision on:
- Is the absence of `.suggest(...)` a failure of the call site or of the framework?
- Should the template ever render an empty `Try:` body? If not, is the catch-all "Report to support" acceptable or should it only appear after 0 concrete suggestions?
- Do we want a *visible* distinction in the close banner between "we know what you should do" and "we don't"?

---

## D-03 — "Warning yellow" carries four different semantics

**Semantic state:** depends on the site — but the colour is the same.

**Variants:**

| Semantic | Site | Example |
|----------|------|---------|
| Non-fatal warning during run | `WARN-001` inline `⚠` | `⚠ Dated snapshot 2025-04-10 not found, falling back...` |
| This command is deprecated | `BAN-005` banner | `WARNING: This command is deprecated and may be removed in a future release` |
| Command produced a warning but succeeded | `BAN-003` banner | `WARNING: mod produced a warning, but the command continued to completion` |
| Command partially succeeded | `BAN-004` preface | `PARTIAL SUCCESS: mod partially succeeded with an exception` |
| Next-step prefix in a successful run | `NXT-001` item bullet | `    > Run mod publish to share your LST` |
| Item bullet inside a `Try:` list | `ERR-002` STEP glyph | `    ▶ Examine the log at build.log` |

**What differs:** all are yellow, but each serves a distinctly different semantic. Distinguishing cues between them are (a) presence of the `WARNING:` / `PARTIAL SUCCESS:` prefix word, (b) whether they appear at top-of-run, inside-run, or end-of-run, and (c) whether they're preceded by a banner-style leading blank line.

**Intentional vs drift:** **intentional reuse of colour, drift in semantic.** Yellow clearly means "attention but not fatal" across all of them, so the colour is doing coherent work. What's drifted is that very different user experiences (a command being deprecated, a recoverable hiccup mid-run, a follow-up recommendation) have converged on the same visual language without deliberate differentiation.

**Phase-2 decision cost:** **high.** The system needs to decide whether to preserve "yellow = attention" as one token and rely on content + position to discriminate, or to split yellow into sub-tokens (e.g. deprecation-yellow vs warning-yellow vs advisory-yellow). Related: deprecation may deserve a non-yellow treatment entirely.

---

## D-04 — "List item bullet" uses three different glyphs

**Semantic state:** an item inside a list the user should scan.

**Variants:**

| List type | Bullet | Code ref |
|-----------|--------|----------|
| `Try:` items (error recovery steps) | `▶` (STEP, yellow bold) | `ERR-002`, `StandardCommand.java:340` |
| "What to do next" items (post-success) | `> ` (literal greater-than, yellow) | `NXT-001`, `StandardCommand.java:131` |
| Section headers inside an error | `●` (BULLET) | `ERR-002`, `StandardCommand.java:283,286,305,318,336` |

**What differs:** glyph shape. All three are yellow (or neutral). The distinction between "section header" (`●`) and "item within that section" (`▶` or `>`) is internally consistent, but the split between `▶` and `>` for item-level bullets is not.

**Intentional vs drift:** **mild drift.** It's plausible the author of `suggestNextSteps` wanted a softer, forward-leaning ASCII arrow for the success/post-run flow, while `convertError` used `▶` because the `Icons.STEP` constant was already defined and colour-wrapped. Neither choice is documented.

**Phase-2 decision cost:** **low.** Picking one glyph for list items has low reader-impact (`▶` and `>` read similarly) but high system-cleanliness dividend.

---

## D-05 — Empty state is handled four different ways

**Semantic state:** the thing the user asked to see is empty (zero rows, zero repos, zero runs, zero data tables, zero trace files, zero recipes found…).

**Variants:**

| Variant | Example | Code ref |
|---------|---------|----------|
| Inline warning line | `⚠ No repositories found. You may need to run mod git clone first` | `OrganizationWalkingCommand.java:94-95` |
| Plain text inside a row | `      No data tables produced` | `RunHistory.java:153` |
| Throw `CommandException` | `"No trace found for build <id>"` | `Log.java:81` |
| Silent (render 0 rows, no message) | `ListRepositories --json` with no repos → `[]` | `ListRepositories` flow |
| Actionable `CommandException` with suggestion | `"No artifact store configured"` → ``"Run `mod config lsts artifacts`"`` | `Publish.java:101` |
| Warning + fallback (`⚠` + continue) | `⚠ Dated snapshot X not found, falling back...` | `InstallMavenRecipeBundle.java:61-62` |

**What differs:** whether the empty result is an error, a warning, a neutral fact, or silent. Tone varies (`No repositories found`, `You may need to...`, `must be provided`). Some have recovery guidance; most don't.

**Intentional vs drift:** **drift at the edges, intent at the core.** Clear intent: "user asked for X that doesn't exist yet" is sometimes a hard error (e.g. no artifact store configured), sometimes a soft note (e.g. no data tables produced by this run — probably because the recipe didn't emit any). But the *spelling* of each of those decisions is inconsistent and reveals no taxonomy.

**Phase-2 decision cost:** **high.** Empty state is one of the most frequently encountered surfaces. Needs a taxonomy: (a) "empty but nothing is wrong" (zero rows), (b) "empty because you haven't done the prerequisite" (no repos configured), (c) "empty and it may indicate a problem" (no data tables produced when one was expected). Each deserves a distinct treatment.

---

## D-06 — Deprecation has two unlinked mechanisms

**Semantic state:** this command / flag should not be used.

**Variants:**

| Mechanism | Trigger | Effect |
|-----------|---------|--------|
| `@Deprecated` on command class | runtime, fires every invocation | Yellow banner `WARNING: This command is deprecated and may be removed in a future release` (`BAN-005`) |
| `"(DEPRECATED) "` text prefix in `@Command(header=...)` or `@Option(description=...)` | help-time only | Shown inside the help output; no runtime warning banner |

**Examples of each:**
- Class-only: `Config.Java.Jdk.java` is annotated `@Deprecated`; the banner fires when the command runs.
- Text-only: `Run.java` `--jvm-debug` description begins `"(DEPRECATED) Start a JDWP server..."`; no runtime banner because the *option* is deprecated, not the command.
- Both: `git/sync/Moderne.java` parameter `organizationNameOrId` has `"(DEPRECATED) The name of an organization in Moderne..."`; no class-level @Deprecated.

**What differs:** runtime-visible vs help-visible. There is no hybrid (e.g. an option-level deprecation that warns at runtime when the option is passed).

**Intentional vs drift:** **partial intent.** Class-level `@Deprecated` → banner is a deliberate implementation. Option/parameter-level text tagging exists because picocli has no equivalent mechanism. The lack of an option-level runtime warning is a gap, not a decision.

**Phase-2 decision cost:** **medium.** System needs one canonical deprecation surface with variants for command vs option vs parameter, and may want a shared visual treatment that reads "deprecated" faster than `(DEPRECATED)` inline text does.

---

## D-07 — `intermediateResult` vs `setExtraMessage` are misapplied ~40% / ~50% of the time

**Semantic state:** the README style guide (§`PROG-002`) explicitly distinguishes:
- `intermediateResult` = already-determined, long-lasting info.
- `setExtraMessage` = in-progress, full-sentence-with-period (unless trailing token).

**Variants (violations observed):**

| Rule | Violation pattern | Examples | Code ref |
|------|-------------------|----------|----------|
| `intermediateResult` must be already-determined | In-progress phrasing piped through `intermediateResult` | `"Processing JavaScript project: X"`; `"Selected .NET X"`; `"Processing Python project: X"` | `JavaScriptBuildStep.java:162,270`; `DotNetBuildStep.java:186,203`; `PythonBuildStep.java:197,221` |
| `intermediateResult` must be already-determined | In-progress target info | Bazel uses `intermediateResult(info.getTarget())` during build loop | `Bazel.java:233` |
| `setExtraMessage` should end with period unless trailing token | No period on full sentences | `"Checking for a compatible version of Java"`, `"Loading recipe"`, `"Validating recipe"`, `"Running recipe"`, `"Writing results"`, `"Resolving dependencies"`, `"Detecting missing @types packages"` | `JavaRuntime.java:198,230`; `RunTask.java:359,446,453,524`; `Maven.java:207`; `JavaScriptBuildStep.java:134` |
| Both channels should carry structured content, not raw dump | Raw output piped through `intermediateResult` with no glyph | `"  L<line>: <content>"`, bare `file.getFileName()`, bare `line` | `Search.java:170,173,287` |
| Both channels should carry structured content, not raw dump | `Exec.java` pipes raw command output through `intermediateResult` | `output + "\n"` | `Exec.java:213` |

**What differs:** adherence to the documented style guide. The rules exist in the README but are not enforced. Consumers of the API treat the two channels as interchangeable.

**Intentional vs drift:** **drift.** The rules are documented; individual contributors have drifted. The misapplication has real reader-impact — readers of the terminal cannot tell "the build has started compiling module X" (in-progress, transient) from "the build chose Java 17" (determined, persistent) because both end up in `intermediateResult` without structural differentiation.

**Phase-2 decision cost:** **high.** Every build-tool integration is implicated. The fix is mostly string-and-API review, but the design decision is whether the system makes the two channels visually distinct at render time (e.g. inline-persistent vs inline-transient), which would give readers a structural cue regardless of which API the contributor reached for.

---

## D-08 — Tables are rendered by six ad-hoc per-site formatters

**Semantic state:** show the user a set of records with columns / facets.

**Variants:**

| Site | Approach | Code ref |
|------|----------|----------|
| File diff | Dedicated renderer with line numbers, content fill, annotations | `RichDiffRenderer` — `PRIM-011` |
| Repository list | Per-row single-cell formatter, rows `println`'d | `RepositorySpecFormatter` + `ListRepositories` — `TAB-002` |
| Run history | Manual bold-index + nested indented table names | `RunHistory.java:145-184` — `TAB-003` |
| CSV→XLSX conversion | Stream of `⚠ / ✓ ` progress lines, no table shape | `CsvToExcel.java` — `TAB-004` |
| Organization sync changelog | `"Adding X"`, `"Moving Y"` lines via progress bar | `Csv.java:223-296` — `TAB-006` |
| Factory pipeline | Action header + 8-space-indented status lines | `FactoryOutput.java:35-85` — `TAB-005` |

**What differs:** whether there's column alignment, whether there are headers, whether colours are used, whether rows are counted at the end, whether truncation is handled, whether empty state is rendered. Zero shared infrastructure; every new list-like surface invents its own layout.

**Intentional vs drift:** **partly intentional** — the diff renderer is a specialised component and has earned that specialisation. Everything else is drift: the three "list of repos / runs / orgs" surfaces could share infrastructure but don't.

**Phase-2 decision cost:** **medium-high.** If the system wants consistent list/table primitives, every site except the diff renderer needs to migrate to them. The scope of that is bounded (six surfaces) but non-trivial.

---

## D-09 — Stack-trace disclosure is inconsistent across error sites

**Semantic state:** when an error is shown to the user, whether the stack trace is also shown.

**Variants:**

| Decision | Typical call site style | Count | Representative |
|----------|-------------------------|-------|----------------|
| `showStack=true` (default) | `throw new CommandException(msg)` or `throw new CommandException(msg, cause)` | ~120 | Most throws — build tool failures, file I/O, config directory |
| `showStack=false` (explicit) | Builder with `.showStack(false)` | ~25 | `Publish.java:288,450,488,498,502`; `TaskProgressBar.java:118`; `MultiTaskCommand.java:102`; `GraphqlRequest.java:142-147` |
| `showCause=true` (explicit) | Builder with `.showCause(true)` | ~5 | `Publish.java:180`; `MultiTaskCommand` completion |

**What differs:** whether the user sees a Java stack trace in the `Where:` section of the error output. There's no pattern tying it to error severity or user-facing-ness — `Publish.java` sometimes suppresses stack traces (correctly, for business-logic errors like "version format invalid") and sometimes does not (for HTTP response errors that would benefit users less).

**Intentional vs drift:** **partly intentional, partly drift.** Recent code (`Publish.java`, `GraphqlRequest.java`) clearly sets `showStack=false` deliberately for user-facing validation. Older code didn't bother — the default (`true`) wasn't reconsidered. Many user-facing validation errors still fall back to showing Java stack traces the user cannot act on.

**Phase-2 decision cost:** **medium.** Design decision: is the error template the right place to differentiate "here is a stack trace because you (the developer) need to report this" from "here is a plain message because you (the user) should just fix the input"? Either split the template into two variants, or flip the default and opt in to stack traces for crash cases only.

---

## D-10 — `"Report to support@moderne.io"` is hard-coded as the catch-all fallback

**Semantic state:** the last item of every error's `Try:` list.

**Variants:** **one.** Every error ends with this line, every time. There is no way for a throw site to suppress it.

**Code ref:** `StandardCommand.java:342` — unconditional append inside `convertError`.

**What differs:** nothing, at emission time. But the user-visible effect varies:
- When the error provides no other suggestions, it is **the only** recovery guidance.
- When the error provides a concrete fix, it is **redundant noise** tailing the actionable suggestion.

**Intentional vs drift:** **intentional.** The line is deliberately appended in every case. But the pattern that emerged — ~140 sites where this line is the *only* guidance — was not planned; it's a consequence of D-02.

**Phase-2 decision cost:** **medium.** The design decision is not whether to keep the support link, but whether to render it differently based on whether any concrete suggestions precede it (e.g. dim, separated, collapsed under "Other options"). Also links back to D-02: ideally the list of dead-end sites that *only* emit this line shrinks to near-zero.

---

## D-11 — `setWarning(Throwable)` is deprecated but still used

**Semantic state:** I want to note a non-fatal problem without aborting the command.

**Variants:**

| Mechanism | Status | Site examples |
|-----------|--------|---------------|
| `cmd.setWarning(throwable)` | `@Deprecated`, Javadoc says "Throw an exception instead" | `ListRepositories.java:105`; corrupted-LST code path via `LstJarFile` |
| Throw a `CommandException` with `partialSuccess=true` | New path, but only wired in two sites (`MultiTaskCommand`, `Publish`) | See D-02 |
| Inline `⚠` glyph via `intermediateResult` | Non-abortive informational variant | See WARN-001 |

**What differs:** the recommendation in Javadoc is to throw instead of `setWarning`, but throwing implies abort-unless-partial-success, and most of the non-fatal-warning use cases aren't multi-task so `partialSuccess=true` doesn't apply. So callers are stuck between a deprecated API and a non-applicable alternative.

**Intentional vs drift:** **half-finished migration.** Evidence that someone tried to deprecate the API but didn't supply the replacement for the single-task case.

**Phase-2 decision cost:** **low-to-medium.** Design decision: does the system want a dedicated "completed with warnings" output shape for single-task commands, or do we fold those cases into success with an inline `⚠` and call it done?

---

## D-12 — Picocli markup is used in commands-as-inline-references but not consistently

**Semantic state:** referring to another CLI command, flag, or path inside body text.

**Variants:**

| Pattern | Example | Code ref |
|---------|---------|----------|
| Bold command reference | `@|bold mod build|@` | `Build.java:98-113`; `Run.java:74-79`; `Publish.java:62-69`; many others |
| Bold flag reference | `@|bold --no-download|@` | `Build.java` option descriptions |
| Bold path reference | `@|bold .moderne/build|@` | `Build.java` |
| Plain text command reference | `"Run mod build first"` | sporadic in error messages and descriptions — e.g. some suggestion strings |
| Suggestion line rendered through `ansi().render()` | `"Set a trust store configuration with @|bold mod config http trust-store edit|@"` | `StandardCommand.java:361-362` |

**What differs:** whether references are bold. Within `@Command(description=...)` bold is the dominant pattern. Within error messages and suggestion strings it's mixed — some go through `ansi().render()` (markup honoured), some pass raw strings through `.getMessage()` (markup shows up literally if anyone wrote it there).

**Intentional vs drift:** **partly drift.** The convention for `@Command` descriptions is strong. The convention for error messages is weaker, and there's a subtle footgun: `CommandException` messages go through `.getMessage()` and are **not** rendered through `ansi().render()`, so writing `@|bold mod build|@` inside a CommandException message text would literally print the markup. Suggestions avoid this because they *are* rendered.

**Phase-2 decision cost:** **low-medium.** Design decision: codify the convention for when to bold references; either extend markup rendering to message bodies, or forbid markup in message bodies (only suggestions get markup).

---

## D-13 — Progress-bar selection criteria are spread across five env/OS checks

**Semantic state:** pick the right progress-bar implementation for the environment.

**Variants (all route to `PlainProgressBar`):**
- `BuildEnvironment.build(System::getenv) != null` (CI detected)
- `new File("/.dockerenv").exists()` (inside a Docker container)
- `System.getenv("CLAUDE_CODE") != null` (Claude Code runner)
- `NO_COLOR` env var set
- `System.console() == null` (no TTY)

**Route to `NoopProgressBar`:** `hasBanner() == false` (CSV / JSON output commands).

**What differs:** each check is OR-combined, so any one triggers the downgrade. There's no single "this is a machine" detector — the list has grown over time as new environments were encountered.

**Intentional vs drift:** **intentional but cumulative.** Each check was added for a good reason (CI, Docker, Claude Code is a recent addition), but there's no central abstraction the system can point to. Future environments will grow this list.

**Phase-2 decision cost:** **low for the design system itself** — the five triggers all downgrade to the same output shape, so the design system just needs to know the "plain" shape exists. **Medium** if the system wants to expose this as a documented flag or env-var ("render mode: animated / plain / none") rather than five internal heuristics.

---

## D-14 — Machine-readable output modes still emit human error text on failure

**Semantic state:** the user invoked `--csv` / `--json` / `--streaming` expecting machine-parseable output.

**Variants (on failure):**
- The banners are suppressed (intended behaviour).
- The progress bar is `NoopProgressBar` (intended behaviour).
- But `convertError(...)` still runs on the failure path — which prints `● Where:`, stack traces, `● What went wrong:`, `● Try:`, and `▶ Report to support@moderne.io` to the same stream.

**Code ref:** `StandardCommand.java:198-222` — `catch (Throwable)` branch is not aware of whether the command was in machine-readable mode.

**What differs:** machine consumers will sometimes receive valid CSV/JSON (success case) and sometimes receive free-form text (failure case). The difference in stream content is not signalled except by exit code.

**Intentional vs drift:** **drift.** The authors of `--csv` / `--json` supports suppressed banners and progress, but didn't wire error-path suppression. No documented convention for what machine consumers should expect on failure.

**Phase-2 decision cost:** **medium.** Design decision: should failures in machine-readable mode emit a structured error envelope (JSON `{error: {...}, suggestions: [...]}`)? Or should `--json`/`--csv` always succeed and emit machine-readable results only to stdout, with errors going to stderr in a machine-readable format?

---

## D-15 — Hyperlinks are applied to some content types but not others

**Semantic state:** which spans of terminal output are clickable.

**Variants:**

| Content type | Linked? | Why / code ref |
|--------------|--------|----------------|
| Log-file paths in error output | Yes | `RepositoryCloneTask.java:138` et al. via `AdvancedLinks.A` |
| `support@moderne.io` in `Try:` footer | Yes | `StandardCommand.java:342` |
| Data-table output paths | Yes | `Study.java` output via `-o/--output-file` |
| Dashboard / tenant URLs | Yes | post-publish / post-sync output |
| Repository paths | **No** | `RepositorySpecFormatter` returns plain-colored text |
| Recipe IDs | **No** | rendered as plain text |
| Moderne tenant host URL in `mod config moderne show` | **No** | |
| Stack-trace source references | **No** | framework-rendered |

**What differs:** whether the content is wrapped via `AdvancedLinks.link(...)`. No documented convention for which content types are linkable.

**Intentional vs drift:** **drift.** It's a reasonable guess that log files and data tables were linked because they're the most common "I want to open this next" targets, but there's no principled rule. Repository paths would be a natural candidate for linking (open a file manager / editor).

**Phase-2 decision cost:** **low.** Design decision: a catalogue of "these content types are linkable, with these href conventions" — then a utility that every table/formatter/error renderer calls through.

---

## D-16 — Icon-in-colour encoding is forgiving but inconsistent

**Semantic state:** the coloured constants in `Icons.java` (`WARNING`, `SUCCESS`, `FAILURE`, `STEP`, `INFO`) are snapshots of "glyph + colour" captured at class-load time. Callers sometimes use these pre-wrapped constants, sometimes wrap the `_NO_COLOR` glyph manually with `ModerneColors.Yellow.boldHighlight(...)`, sometimes mix.

**Variants:**

| Pattern | Example |
|---------|---------|
| Pre-wrapped constant | `Icons.WARNING + " " + msg` (most common) |
| Manual wrapping | `ModerneColors.Yellow.highlight(Icons.WARNING_NO_COLOR + " " + msg)` — rare |
| Constant + secondary highlight on body | `Icons.SUCCESS + " " + ModerneColors.Green.highlight(" rows added: ")` — very rare |
| Constant in a picocli markup call | `ansi().render("@|bold %s %s|@", Icons.ACTION, text)` — `printAction` |

**What differs:** whether colour applies to glyph only, glyph+body, or neither. Different sites for the same surface type make different choices.

**Intentional vs drift:** **drift.** The pre-wrapped constants were designed to make "glyph + colour" a one-liner. That worked. But when a caller wants "glyph + differently coloured body" they reach for the `_NO_COLOR` glyph and re-colour manually, and both styles end up in the codebase side by side.

**Phase-2 decision cost:** **low.** Design decision: lock "icon coloured, body neutral" as the default, and if the system wants body-colour support, define a separate primitive.

---

## D-17 — Heading-override boilerplate is duplicated across the command tree

**Semantic state:** every subcommand wants the same Usage/Description/Parameters/Options/Commands section headings.

**Variants:**

| Site | What it does | Code ref |
|------|--------------|----------|
| `StandardCommand` | Declares the canonical heading set once | `StandardCommand.java:38-43` |
| `Mod` (root) | Redeclares `commandListHeading` (without leading `%n`, because it's the first section) | `Mod.java:30-33` |
| `git/sync/Moderne.java` | Redeclares `headerHeading` identically to StandardCommand | `Moderne.java:26-32` |
| `config/build/Build.java` | Sets `descriptionHeading = " "` because the description is empty | `Build.java:12-27` |
| `git/Git.java` | Sets `descriptionHeading = " "` same reason | `Git.java:9-27` |
| `config/.../Installation.java` | Sets `descriptionHeading = "%n"` same reason | multiple config subcommands |

**What differs:** how each subcommand deals with empty description bodies, and which commands feel the need to redeclare the standard headings. No single convention.

**Intentional vs drift:** **drift.** `StandardCommand` supplies the skeleton, but commands that want to suppress an empty heading have three different ways to do it (`"%n"`, `" "`, or nothing and tolerate the visual gap).

**Phase-2 decision cost:** **low.** Design decision: handle empty-description suppression in the framework (e.g. via picocli's conditional rendering), not in each command.

---

## D-18 — "INCUBATING" feature-flagging has no runtime manifestation

**Semantic state:** this feature is not yet stable; users should expect it to change.

**Variants:**

| Mechanism | Trigger | Effect |
|-----------|---------|--------|
| `"(INCUBATING) "` text prefix | Help output only | Inline tag |
| (no runtime banner) | — | — |

Applied to: `Audit.java` entire command; `Build.java --streaming`, `--no-patch`; `Run.java --streaming`; `Audit.Builds.ListBuilds --streaming`.

**What differs:** vs deprecation (D-06), incubation has no runtime mechanism at all. And it's applied unevenly — `Study.java` is behaviourally experimental (per domain context from the README style guide) but isn't tagged.

**Intentional vs drift:** **both.** Intentional that incubation is text-only (it wasn't considered worth a runtime banner). Drift that the tag is applied unevenly.

**Phase-2 decision cost:** **low.** Design decision: does incubation deserve a runtime indicator? If yes, add one similar to `BAN-005`; if no, codify the text tag as the single canonical mechanism.

---

## D-19 — Per-progress-bar `setExtraMessage` grammar varies (gerund, imperative, noun phrase)

**Semantic state:** a label describing the in-flight action.

**Variants:**

| Grammar | Example | Code ref |
|---------|---------|----------|
| Gerund | `"Resolving dependencies"`, `"Loading recipe"`, `"Running recipe"`, `"Building <target>"` | most `setExtraMessage` sites |
| Imperative / infinitive | `"Asking Maven to build an LST"`, `"Asking Gradle to build an LST"` | `Maven.java:228`, `Gradle.java:276` |
| Noun phrase | `"Dated snapshot <date>"` (via `intermediateResult` but same channel) | `InstallMavenRecipeBundle.java:61-62` |
| Bare path | `"<dir-path>"` as the entire message | `OrganizationDirectoryReader.java:171` |
| Fragment | `"Retrying " + <token>` | `JavaScriptBuildStep.java` |

**What differs:** grammar and completeness. Bare-path messages leave the user guessing what phase they're in; "Asking Maven..." messages are distinctive but inconsistent with the rest of the gerund-dominated set.

**Intentional vs drift:** **drift.** Gerund is the dominant pattern but not enforced.

**Phase-2 decision cost:** **low.** Design decision: pick one grammar (gerund is the common-case incumbent and reads well), document it, and let Phase-2+N catch up via review.

---

## D-20 — Action-header glyph consistency is strong; indent-convention consistency is weak

**Semantic state:** emphasise a section boundary inside a run.

**Variants (consistent part):** `StandardCommand.printAction` and `FactoryOutput` both render `@|bold ● <action>|@`. Same glyph, same bold treatment.

**Variants (inconsistent part):**
- `StandardCommand.printAction` prepends a blank line between actions (after the first).
- `FactoryOutput` renders with no leading blank line but indents subsequent status lines by 8 spaces (`PRIM-012`).
- `IndentProgressBar` uses 2-space indentation levels (`PRIM-006`).
- `suggestNextSteps` uses 4-space indentation.

**What differs:** the indentation unit the subsequent sub-content sits at. Three different indents (2, 4, 8) co-exist depending on which composer emitted the heading.

**Intentional vs drift:** **drift.** No documented rule for indentation units.

**Phase-2 decision cost:** **low.** Design decision: pick one indentation unit (2 or 4 space) and migrate Factory to it.

---

## D-21 — Prompts have no style convention

**Semantic state:** the CLI asks the user for a value.

**Variants:** effectively one surface (`userInput` — `PROMPT-001`) with **no shared convention** for:
- Punctuation at the end of the prompt.
- Whether to include `(y/n)` / `[Y/n]` for yes/no.
- Whether to show the default value in brackets.
- Whether to show an example / format hint.
- What to do on invalid input (re-prompt vs throw).

**Code ref:** `StandardCommand.java:136-150` simply concatenates `prompt + " "` and reads one line.

**Intentional vs drift:** **drift by absence.** Prompts are rare enough that no convention was ever needed. Now that there's a handful of them, each authored their own style.

**Phase-2 decision cost:** **low-medium.** Design decision: the system needs a documented prompt grammar (verb + subject + punctuation convention) and companions for yes/no, default-value display, and invalid-input handling (re-prompt vs error).

---

## D-22 — Logo surface has a two-weight fallback, most other surfaces do not

**Semantic state:** render visual "this is the Moderne CLI".

**Variants:**
- `Icons.getLogo()` returns a rich 5-line UTF-8 logo or an 8-line ASCII `@`-art fallback (`Icons.java:37-59`).
- No other content emits an ASCII-art surface.

**What differs:** most surfaces have either "coloured or not" and "Unicode glyph or ASCII letter" as their fallbacks. Only the logo has a whole *layout* fallback. This is not inconsistent per se, but Phase-2 should know the logo is the single surface with layout-level degradation.

**Intentional vs drift:** **intentional.** The two logos were designed as a pair. Noted as a delta only for Phase-2 awareness.

**Phase-2 decision cost:** **very low.** Informational.

---

## Cross-cutting observation (useful for Phase 2)

If D-02 and D-10 are resolved together (i.e. the "dead-end" pattern is addressed by (a) demanding suggestions at every throw site and (b) treating the support footer as a fallback shown only when zero concrete suggestions exist), that single pair of decisions resolves a large fraction of the perceived "CLI error quality" problem that motivated the design brief. Most other deltas here are lower-leverage and can be tackled in later passes.
