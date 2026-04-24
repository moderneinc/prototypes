# CLI Inventory — user-facing output surfaces

> Read-only audit of the Moderne CLI. Captures what is emitted today — no proposals, no editorializing. Cross-referenced from `cli-categorized.md` and `cli-deltas.md` by `entry id` (e.g. `ERR-001`, `HELP-014`).

**CLI commit SHA audited:** `290f08af81b33d25c7c124886ab62b4a1175bdb5` (see `audit-metadata.md`)

---

## How to read this file

Each entry has a stable **id** (surface-prefix + counter), a **code ref** (path relative to `moderne-cli/`), a **sample** (raw string as written in code, including `@|...|@` picocli markup and `%n` linebreaks), and an **emission API** (how the user ends up seeing it).

Surface prefixes:
- `PRIM-*` — UI primitives and renderers (the shared layer that every other entry composes over)
- `HELP-*` — help text emitted by picocli (command descriptions, option descriptions, headings, footers)
- `ERR-*` — error output (CommandException, direct stderr, SSL diagnostics)
- `PROG-*` — progress bar and in-task status
- `BAN-*` — banners (start-of-run, end-of-run, deprecation)
- `SUC-*` / `WARN-*` / `INFO-*` — inline status glyphs outside banners
- `ACT-*` — action headers emitted during command execution
- `NXT-*` — "what to do next" / suggested-next-step output
- `TAB-*` — table/list/row-oriented output (incl. diff, repo list, run history)
- `PROMPT-*` — interactive prompts
- `LINK-*` — OSC 8 hyperlink usage

Where a pattern repeats at N call sites, the entry lists a few representative call sites and a **`repeat count`** rather than enumerating all of them. Phase 2 reconciliation can walk the emission API to enumerate exhaustively if needed.

---

## 1. UI primitives (`PRIM-*`)

The primitive layer under `core/core/src/main/java/io/moderne/cli/ui/`. Every other entry in this doc composes over these.

### PRIM-001 — ModerneColors enum
- **Code ref:** `core/core/src/main/java/io/moderne/cli/ui/ModerneColors.java:8-63`
- **Values:** `Green`, `Blue`, `Purple`, `Red`, `Yellow`, `Grey` — each carries three palette definitions: an xterm-256 index, a dark-bg subtle index, a light-bg subtle index, and true-color RGB.
- **Brand RGB:** Green `#33ff99`, Blue `#2e42ff`, Purple `#99aaff`, Red `#ff1947`, Yellow `#f9a91b`, Grey `#737a84`.
- **Public API:** `.getAnsi(maxLength)`, `.highlight(text)`, `.boldHighlight(text)`. Selection between RGB and 256-color routed through `RichTerminalDetector.isTrueColorSupported()`.
- **Emission:** returned as `Ansi` / `String`, composed into any output.

### PRIM-002 — Icons
- **Code ref:** `core/core/src/main/java/io/moderne/cli/ui/Icons.java:6-59`
- **Glyphs (UTF-8 / ASCII fallback):**
  - `ACTION` — `●` / `>`
  - `BULLET` — `●` / `*`
  - `WARNING_NO_COLOR` — `⚠` / `!`
  - `SUCCESS_NO_COLOR` — `✓` / `+`
  - `FAILURE_NO_COLOR` — `✗` / `!`
  - `STEP_NO_COLOR` — `▶` / `>`
  - `INFO_NO_COLOR` — `ℹ` / `i`
- **Colored constants:** `WARNING` = Yellow bold, `SUCCESS` = Green bold, `FAILURE` = Red bold, `STEP` = Yellow bold, `INFO` = Blue bold.
- **Logo:** `getLogo()` returns a 5-line UTF-8 box-drawing / block logo or an 8-line ASCII `@`-art fallback.
- **Fallback trigger:** `RichTerminalDetector.isUtf8ExtendedSupported()` at class-load time.

### PRIM-003 — RichTerminalDetector
- **Code ref:** `core/core/src/main/java/io/moderne/cli/ui/RichTerminalDetector.java` (see also test at `core/core/src/test/java/io/moderne/cli/ui/RichTerminalDetectorTest.java`)
- **Capabilities probed:** truecolor support, UTF-8 extended chars, OSC 8 hyperlinks.
- **Affects:** color palette (RGB vs 256-color), glyph set (UTF-8 vs ASCII), whether `AdvancedLinks.link()` wraps in OSC 8.

### PRIM-004 — AnimatedProgressBar
- **Code ref:** `core/core/src/main/java/io/moderne/cli/ui/AnimatedProgressBar.java`
- **Render modes:** `MultiLine` (ANSI cursor movement, per-task bars), `SingleLine` (line erasure), `EventOnly` (no refresh timer).
- **Bar chars:** brackets `│` / `<>`, fill `[' ', '⠄', '⠆', '⠇', '⡇', '⡧', '⡷', '⣷', '⣿']` (Braille, 0–8 eighths) or ASCII `=`/`-`.
- **Indeterminate animation:** Gaussian bell curve scrolling left-right, 50ms debounce, 200ms refresh.
- **Colors (ANSI composed from PRIM-001):** Blue brackets, Green fill, Grey elapsed + extra message, Yellow skip count, Red fail count, Purple task IDs + running count.
- **Cursor control:** `\33[?25l` / `\33[?25h` (hide/show), `\33[?2026h` / `\33[?2026l` (DEC 2026 synchronized update) for atomic redraws.

### PRIM-005 — PlainProgressBar
- **Code ref:** `core/core/src/main/java/io/moderne/cli/ui/PlainProgressBar.java`
- **When used:** CI env (`BuildEnvironment.build() != null`), `/.dockerenv` exists, `CLAUDE_CODE` env var set, `NO_COLOR` set, or `System.console() == null`.
- **Render cadence:** 10-second polling; emits only if ≥10s since last emission.
- **Format:** `[NNN% (HH:MM:SS) ...]\n<message>` (plus `(N other updates not logged)` when throttled).
- **Styling:** plain text, no colors.

### PRIM-006 — IndentProgressBar
- **Code ref:** `core/core/src/main/java/io/moderne/cli/ui/IndentProgressBar.java`
- **Behavior:** wraps any `ProgressBar`; `indent()` / `unindent()` add/remove 2-space prefixes to `intermediateResult()` calls before delegating.
- **Task passthrough:** forwards `setMultiTask()`, `setConcurrentTasks()`, task-ID access to underlying `AnimatedProgressBar`.

### PRIM-007 — NoopProgressBar (external)
- **Code ref:** `org.openrewrite.polyglot.NoopProgressBar` (used via `StandardCommand:92-96`)
- **When used:** `hasBanner() == false` — i.e. CSV/JSON output commands suppress progress entirely.

### PRIM-008 — AdvancedLinks (OSC 8 hyperlinks)
- **Code ref:** `mod/src/main/java/io/moderne/cli/ui/AdvancedLinks.java`
- **API:** `AdvancedLinks.link(Object textWithOsc8, String fallbackText)` — returns OSC 8 sequence if detected, else fallback.
- **Helper:** inner class `A(text, href|URI|Path)` with `toString()` emitting `\u001B]8;;<href>\u001B\\<text>\u001B]8;;\u001B\\`.
- **Used for:** log file paths (build.log, run.log), data-table output paths, `support@moderne.io` in error footers, Moderne dashboard links.

### PRIM-009 — Links (URI builder helper)
- **Code ref:** `core/core/src/main/java/io/moderne/cli/ui/Links.java`
- **API:** `Links.link(Path)` → `file://...` URI string; feeds into `AdvancedLinks.A`.

### PRIM-010 — RepositorySpecFormatter
- **Code ref:** `mod/src/main/java/io/moderne/cli/ui/RepositorySpecFormatter.java:12-37`
- **Formats:**
  - repo present: `Blue.highlight("<path>@<branch>")`
  - no LST: `Grey.highlight("<path> (no LST)")`
  - corrupted LST: `Red.highlight("<path>") + Grey.highlight(" (corrupted LST)")`
- **Constants exposed:** `PARTITION_HIGHLIGHTED`, `PARTITION_LST_STATUS_HIGHLIGHTED`, `PARTITION_GIT_STATUS_HIGHLIGHTED`.

### PRIM-011 — RichDiffRenderer
- **Code ref:** `core/core/src/main/java/io/moderne/cli/ui/diff/RichDiffRenderer.java:352-712`
- **Output shape:**
  - header: `● Operation(filename)` (BULLET prefix, bold filename)
  - body: `  <line#>  +content` / `-content` with Green/Red line numbers right-padded, subtle-background fill for context
  - annotations: `⛔ / ⚠ / ℹ / 🐛` + message (dark bg) + indented detail
  - truncation: `Grey.highlight("  ... (N more files not shown)")` / `"    ... (N more lines)"`
- **Marker types rendered:** `SearchResult`, `Error`, `Warn`, `Info`, `Debug` (see `renderMarkerAnnotation`, `RichDiffRenderer.java:619-712`).

### PRIM-012 — FactoryOutput (factory pipeline decorator)
- **Code ref:** `mod/src/main/java/io/moderne/cli/factory/FactoryOutput.java:35-85`
- **Line shapes (printed via `out.println(ansi().render(...))`):**
  - action header: `@|bold ● <message>|@`
  - success: `        ✓ <message>`
  - warning: `        ⚠ <message>`
  - failure: `        ✗ <message>`
  - info: (uses INFO icon, same indent)
- **Indent:** 8 spaces (distinct from IndentProgressBar's 2-space nesting).

### PRIM-013 — TaskProgressBar
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/task/TaskProgressBar.java:57-177`
- **Wraps a ProgressBar with semantic methods:**
  - `printInfo(info)` → `Icons.STEP + " " + info`
  - `printStep(step)` → `Icons.STEP + " " + step`
  - `printWarning(warning)` → `Icons.WARNING + " " + warning`
  - `printSuccess(success)` → `Icons.SUCCESS + " " + success`
  - `printFailed(failure)` → `Icons.FAILURE + " " + failure`
- **Also records CommandException internals:** `recordFailed(...)` captures message / suggestions / showStack / showCause / partialSuccess for later aggregation in `MultiTaskCommand.Completion`.

### PRIM-014 — ParallelTaskProgressBar
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/task/ParallelTaskProgressBar.java:45-112`
- **Behavior:** queues events from concurrent tasks, emits through delegate with debouncing.
- **Event types:** `IntermediateResult`, `Step` (subset of underlying API).

### PRIM-015 — StandardCommand base class
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/StandardCommand.java:38-421`
- **Exposes to every subcommand:**
  - `hasBanner()` (default `true`) — if `false`, progress is Noop and start/end banners are suppressed (CSV/JSON modes).
  - `drawBanner()` — logo + "Moderne CLI X.Y.Z".
  - `progressBar()` — returns `IndentProgressBar` wrapping one of `Animated/Plain/Noop`.
  - `printAction(String)` — section header (see ACT-001).
  - `suggestNextSteps(...)` — next-steps block (see NXT-001).
  - `userInput(prompt)` — interactive prompt (see PROMPT-001).
  - `setWarning(Throwable)` — deprecated but still referenced.
  - `convertError(Throwable)` / `handleError` — error renderer (see ERR-001 through ERR-005).
  - heading overrides for picocli usage help (see HELP-001).
- **Reusable constant:** `PATH_PARAMETER_DESCRIPTION` (4-sentence description of a disk path, used across commands — see HELP-009).

---

## 2. Help text (`HELP-*`)

Framework is picocli. All user-facing help strings live in `@Command`, `@Option`, `@Parameters` annotations in `mod/src/main/java/io/moderne/cli/commands/` and subpackages. No i18n hooks found; all strings hard-coded English.

### HELP-001 — StandardCommand heading overrides (applies to ~all subcommands)
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/StandardCommand.java:38-43`
- **Strings:**
  - `headerHeading = "@|bold,underline Usage|@:%n%n"`
  - `descriptionHeading = "%n@|bold,underline Description|@:%n%n"`
  - `parameterListHeading = "%n@|bold,underline Parameters|@:%n%n"`
  - `commandListHeading = "%n@|bold,underline Commands|@:%n%n"`
  - `optionListHeading = "%n@|bold,underline Options|@:%n%n"`
- **Applies to:** every class extending `StandardCommand` (≈131 command files).

### HELP-002 — Root `mod` command
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/Mod.java:27-57`
- **Strings:**
  - `description = "Automated code remediation."`
  - `synopsisHeading = ""` (override: empty — no synopsis on root help)
  - `commandListHeading = "@|bold,underline Commands|@:%n%n"` (re-declared without leading `%n`)
- **Subcommand list:** Audit, Batch, Build, Clean, Config, GenerateDevCenter, Exec, Factory, ModGenerateCompletion, Git, Log, ListRepositories, Mcp, Monitor, Postbuild, Publish, Run, RunHistory, Search, Study, Trace, Tray, Wrapper.

### HELP-003 — `--version` / `-h` / `--help`
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/Mod.java:61` (`--version` description: `"Display version info."`), `StandardCommand.java:77` (`-h, --help` description: `"Display this help message."`).
- **Scope:** `-h, --help` inherited by every subcommand.

### HELP-004 — `mod build`
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/build/Build.java:98-113`
- **Header:** `"Generates LST artifacts for one or more repositories."`
- **Description:** multi-line with markup — references `@|bold mod build|@`, `@|bold moderneinc/mass-ingest-example|@`, `@|bold repository-*|@`, `@|bold .moderne/build|@`, `@|bold mod config moderne|@`, `@|bold --no-download|@`, `@|bold --download-only|@`.
- **Option descriptions:**
  - `--offline`: `"When an underlying build tool has an offline mode, enable it."`
  - `--no-download`: `"Do not attempt to download LSTs from Moderne."`
  - `--download-only`: `"Only download LSTs from Moderne. If no download is available, do not build the LST from source. Downloads the LSTs in parallel by default."`
  - `--streaming`: `"(INCUBATING) Stream results from the build to the console as they are produced. This is intended to be machine readable for the creation of incremental experiences like in the IDE."`
  - `--dry-run`: `"Do not actually build the LST(s), but list the steps that would be required to do so."`
  - `--only-tool`: hidden, `"Only execute the specified step."`

### HELP-005 — `mod run`
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/Run.java:74-79` and option blocks below
- **Header:** `"Runs an OpenRewrite recipe locally on pre-built LSTs."`
- **Description:** `"You must run the @|bold mod build|@ command before this command will work. You also must set up a connection to moderne (@|bold mod config moderne|@) and install recipes (@|bold mod config recipes|@) for this command to work."`
- **Options:** `-P/--recipe-option`, `--recipe`, `--active-recipe`, `--jvm-debug` (hidden, `"(DEPRECATED)"`), `--streaming` (`"(INCUBATING)"`), `--no-patch` (`"(INCUBATING)"`).

### HELP-006 — `mod study`
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/study/Study.java:36-41`
- **Header:** `"Produces studies from OpenRewrite recipe data tables locally."`
- **Description:** `"Data tables are an important part of performing large scale impact analyses on source code."`
- **Options:** `--data-table`, `--group`, `--json` (`"Output the data table in JSON format with the specified fields. If no value is provided, all columns from the data table will be kept."`), `--csv` (`"Output in CSV format"` — no trailing period), `-o/--output-file`.

### HELP-007 — `mod git` (group)
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/git/Git.java:9-27`
- **Header:** `"Multi-repository git operations."`
- **Description:** `""` (empty) — `descriptionHeading = " "` override to suppress the "Description" heading for an empty body.

### HELP-008 — `mod git sync` (group) and `mod git sync moderne`
- **Code refs:**
  - `mod/src/main/java/io/moderne/cli/commands/git/sync/Sync.java:6-14` — header `"Synchronizing the state of an organization on disk."`, description `"Synchronizes the set of repositories on disk to a source of repositories and at what branch and changeset they should be."`
  - `mod/src/main/java/io/moderne/cli/commands/git/sync/Moderne.java:26-32` — `headerHeading = "@|bold,underline Usage|@:%n%n"` (redeclared), header `"Synchronizes the state of an organization with Moderne."`, multi-line description referencing `@|bold mod build|@`.
- **Parameters:**
  - `path` (index 0): uses the shared `PATH_PARAMETER_DESCRIPTION` constant (HELP-009).
  - `organizationNameOrId` (index 1): `"(DEPRECATED) The name of an organization in Moderne..."`.

### HELP-009 — Shared path-parameter description
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/StandardCommand.java:45-51`
- **Value:** `"The absolute or relative path on disk to a directory containing one or more checked-out Git repositories that you want to operate on. This typically takes the form of targeting a single, checked-out copy of a Git repository or it can be a folder containing a collection of Git repositories that will be discovered by recursively scanning the initial provided directory."`
- **Reused by:** git-sync, log, and several top-level commands. Many config subcommands take a `path` positional arg without using this description.

### HELP-010 — `mod git add` / `mod git commit`
- **Code refs:**
  - `mod/src/main/java/io/moderne/cli/commands/git/Add.java:35-39` — header `"Performs the equivalent of @|bold git add|@ on multiple repositories."`, description `"Rather than applying @|bold git add|@ one at a time, this operates on multiple repositories."`.
  - `mod/src/main/java/io/moderne/cli/commands/git/Commit.java:43-47` — header `"Performs the equivalent of @|bold git commit|@ on multiple repositories."`, description `"Rather than applying one commit at a time, this operates on multiple repositories."`.
- **Commit options:** `-m/--message`, `--allow-empty` (`"Whether or not to allow making empty commits."`), `-S/--gpg-sign`, `--no-gpg-sign`, `--gpg-private-key-path`, `--gpg-passphrase-path` — all reference `@|bold --flag-name|@` style cross-links.

### HELP-011 — `mod config` (group) and key subgroups
- **Config.java:** `mod/src/main/java/io/moderne/cli/commands/config/Config.java:25-53` — header `"Global configuration options that are required by some CLI commands."`, description `"Configuration set here is used as needed in all subsequent commands."`.
- **Config.Java.java:** header `"Configures Java options used for building LSTs and running recipes."`.
- **Config.Java.Jdk.java** (`config/java/Jdk.java:9-17`): `@Deprecated` annotation; header starts with `"(DEPRECATED) Use `installation` instead. Configures locations of JDKs that can be used by build tools."`.
- **Config.Build.Build.java** (`config/build/Build.java:12-27`): header `"Configures build tools used to produce LSTs."`, description `""` with `descriptionHeading = " "` suppression.
- **Config.Build.Parsers.java** (`config/build/Parsers.java:18-28, 33-34`): header `"Configure custom file-extension-to-parser mappings."`, a detailed description, and the **only dynamic footer** in the codebase — `usageMessage().footer()` is set at `run()` time to `"%nSupported types: <comma-separated>"`.
- **Config.Moderne.java** (`config/moderne/Moderne.java:41-52`): `optionListHeading` re-declared as `"@|bold,underline Options|@:%n%n"`, header `"Configures the connection to Moderne. Must be configured before you can install and run recipes."`, description `"All subsequent commands will use this Moderne tenant."`.

### HELP-012 — `mod audit` (group)
- **Code refs:**
  - `mod/src/main/java/io/moderne/cli/commands/audit/Audit.java:6-16` — header `"(INCUBATING) Perform an audit of recent activity."`, description `"Sources information from the activity log kept locally to provide reports in various forms."`.
  - `mod/src/main/java/io/moderne/cli/commands/audit/Builds.java:22-30` — header `"(INCUBATING) Perform an audit of recent build activity."`; nested `ListBuilds` subcommand adds `"(INCUBATING) Stream results from the audit to the console..."` on its `--streaming` option.

### HELP-013 — `mod publish`
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/Publish.java:62-69`
- **Header:** `"Publishes the LST artifacts for one or more projects."`
- **Description:** references `@|bold mod build|@` and `@|bold mod config lsts artifacts|@`.

### HELP-014 — `mod trace` and `mod log`
- **Code refs:**
  - `mod/src/main/java/io/moderne/cli/commands/trace/Trace.java` — header `"Manages trace analysis tools."`; description mentions build/run traces, failure classification.
  - `mod/src/main/java/io/moderne/cli/commands/trace/Log.java` — header `"Manages a log aggregate."`.

### HELP-015 — `mod clean`
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/Clean.java`
- **Header:** `"Clean build and run artifacts produced by the CLI."`
- **Description:** `"Can be filtered to only clean certain artifacts."`
- **Subcommand `builds`:** matching header + description.

### HELP-016 — `mod wrapper`
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/Wrapper.java`
- **Header:** `"Create or configure a Moderne wrapper."`
- **Description:** multi-line with examples (inline picocli markup).
- **Options:** `--version`, `--url-template`, `--username`, `--auto-update`, `--auto-update-snapshot`.

### HELP-017 — `mod search`
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/Search.java`
- Header + description present; `license-required` error at `Search.java:111` thrown if license invalid (see ERR-030).

### HELP-018 — `mod mcp` (hidden)
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/Mcp.java`
- **`hidden = true`** — not listed in root `mod --help`.
- **Header:** `"Starts an MCP server for code intelligence."`

### HELP-019 — Hidden options
- **Sites (non-exhaustive):**
  - `Run.java` `--jvm-debug` — `"(DEPRECATED) Start a JDWP server on this port and pause for a remote debug connection."`, `hidden = true`.
  - `Build.java` `--only-tool` — `"Only execute the specified step."`, `hidden = true`.
  - `git/sync/Moderne.java` `--yes` — `hidden = true`.

### HELP-020 — Dynamic footer (one site only)
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/config/build/Parsers.java:33-34`
- **Injected in `run()`:** `spec.usageMessage().footer("%nSupported types: " + comma-separated list)`.
- **Notable:** the only command in the codebase that dynamically customizes its usage footer. No other footers observed.

### HELP-021 — Repeat-pattern commands (summarized)
- **Count:** ≈131 command files under `commands/`. Of these, **the vast majority** inherit `StandardCommand` and rely on HELP-001 heading overrides unchanged.
- **Representative echo commands (Config.java subtree):** `Go.java`, `Python.Installation.java`, `Dotnet.java`, `LLM`, `Comms`, `Java.Jdk`, `Lsts.Artifacts`, `Moderne.license`, `Node`, `Recipes.Artifacts`, `Recipes.Moderne`, `Scm`, `Skills`, `Build.Maven`, `Build.Style`, `Build.Gradle`, `Build.Dotnet`, `Build.Bazel`, `Build.Javascript`, `Clone.protocol`, `Http.proxy`, `Http.trust-store`, `Metrics.Atlas`, `Metrics.Prometheus` — each a group with leaf `edit` / `show` / `delete` / `list` subcommands. Most leaf subcommands have a terse header and an empty description (suppressed via `descriptionHeading = " "` or `"%n"`).

---

## 3. Errors (`ERR-*`)

Primary delivery: `CommandException` → `StandardCommand.convertError(Throwable)` → rendered as a multi-section block between the closing "FAILURE" / "PARTIAL SUCCESS" banner and the exit code.

### ERR-001 — CommandException class
- **Code ref:** `core/core/src/main/java/io/moderne/cli/CommandException.java:14-105`
- **Fields:** `message` (String), `fixSuggestions` (List<String>), `showStack` (default `true`), `showCause` (default `false`), `partialSuccess` (default `false`).
- **Builder API:** `.cause(t)`, `.suggest(String...)`, `.suggest(Ansi)`, `.suggestIf(condition, ...)`, `.showStack(bool)`, `.showCause(bool)`, `.partialSuccess(bool)`.
- **Throw count across repo:** ≈200 sites.

### ERR-002 — Error rendering (`convertError`)
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/StandardCommand.java:259-344`
- **Output shape (verbatim from the code, with bracketed slots):**
  ```
  ● Where:
    [sanitized stack trace if showStack=true]

  ● Cause:
    [cause message if showCause=true and cause has a message]

  ● What went wrong:
    [exception.getMessage(), or a fallback line if null]

  ● SSL connection details:
    [SslDiagnostics.generateReport(...) if SslConnectionException in chain]

  ● Try:
    ▶ suggestion-1
    ▶ suggestion-2
    ▶ Report to support@moderne.io
  ```
- **`BULLET` (●)** prefixes section headers; **`Icons.STEP` (▶)** prefixes each `Try:` item; final `Report to support@moderne.io` is always appended (StandardCommand.java:342) and renders the email as `bold` text, wrapped via `AdvancedLinks` where supported.

### ERR-003 — Closing status banners (failure branch)
- **Code ref:** `StandardCommand.java:213-220`
- **Strings:**
  - `ModerneColors.Yellow.highlight("\nPARTIAL SUCCESS: mod partially succeeded with an exception\n")` or `ModerneColors.Red.highlight("\nFAILURE: mod failed with an exception\n")`
  - closing: `ModerneColors.Yellow.boldHighlight("\nMOD PARTIALLY SUCCEEDED")` or `ModerneColors.Red.boldHighlight("\nMOD FAILED")` + `" in (" + formatCommandDuration(...) + ")"`
- **Exit codes:** partial → `-2`, hard failure → `-1`.

### ERR-004 — Fix-suggestion auto-augmentation (`getSuggestions`)
- **Code ref:** `StandardCommand.java:346-388`
- **Augmentations based on throwable chain:**
  - `RemoteException` → includes `re.getFixSuggestions()` verbatim.
  - `CommandException` → includes `ce.getFixSuggestions()` rendered through `ansi().render()` (so markup is honored).
  - `SslConnectionException` + trust store unset → `"Set a trust store configuration with @|bold mod config http trust-store edit|@"`.
  - `SslConnectionException` + trust store set → `"Verify your trust store configuration with @|bold mod config http trust-store show|@"`.
  - `HttpHostConnectException` / `ConnectTimeoutException` / `SocketTimeoutException` / `UnknownHostException` + no proxy configured → `"Set an HTTP proxy configuration with @|bold mod config http proxy|@"`.
- **Terminal line (always):** `"Report to support@moderne.io"` (appended in `convertError`, not in `getSuggestions`).

### ERR-005 — SslDiagnostics report
- **Code ref:** `mod/src/main/java/io/moderne/cli/diagnostics/SslDiagnostics.java` (≈263 lines)
- **Report sections:**
  - Host, request method, request path
  - Root-cause translation (cert expired, untrusted, SAN mismatch, handshake failure, protocol version, cipher suite)
  - Trust store info: path, source (default / `-Djavax.net.ssl.trustStore` / configured), provider, password-status, access permissions
  - Proxy info: direct vs configured, hostname, port, credentials status
  - Server certificate chain: Subject, SANs, Issuer, Serial, validity dates, SHA-256 fingerprint — for leaf + all CAs
- **Attached to error output only when `SslConnectionException` detected in cause chain.**

### ERR-006 — RemoteException handling
- **Code ref:** `StandardCommand.java:207-211, 311-313, 350-351`
- **Source:** `org.openrewrite.polyglot.RemoteException` (external).
- **Rendered with:** `re.getSanitizedStackTrace()` (in place of the normal `Where:` body) + `re.getFixSuggestions()` (merged into `Try:` list).
- **Trigger sites:** recipe resolution failures, remote LST compilation errors from engine services.

### ERR-007 — CommandException throw-site survey (representative)

> Full enumeration is ≈200 sites. Each entry below is one **representative** site; repeat-count across the package is in parentheses.

**ERR-007a — Build / build-tool integrations (≈60 sites)**
- `mod/src/main/java/io/moderne/cli/commands/config/build/maven/Maven.java:145`: `"maven not found on PATH"` → suggestion `"Set MAVEN_HOME"`.
- `…/maven/Maven.java:155`: `"Maven version <v> not compatible"` → `"Upgrade Maven to <minVersion>"`.
- `…/maven/Maven.java:250`: `"The Maven build failed"` → 3 suggestions (examine log, reproduce command, …).
- `…/gradle/Gradle.java:163`: `"gradle not found on PATH"` → suggests `gradle.org/install`.
- `…/gradle/Gradle.java:190`: `"Gradle wrapper version incompatible"` → `"Upgrade Gradle to <version>"`.
- `…/gradle/Gradle.java:282`: `"The Gradle build failed"` → examine-log + reproduce suggestions.
- `…/bazel/Bazel.java:116,209,214`: `"bazel not found"`, `"The Bazel build failed"` — **no suggestions**.
- `…/build/step/resource/DotNetBuildStep.java:277`: `"dotnet restore failed"` — **no suggestions**.
- `…/build/step/resource/JavaScriptBuildStep.java:277`: `"<command> failed"` — **no suggestions**.
- `…/build/step/resource/PythonBuildStep.java:167`: Python install failure — **no suggestions**.
- `mod/src/main/java/io/moderne/cli/build/JavaRuntime.java:202`: `"No JDK found on the system"` → `"Install a JDK satisfying requirements"`.

**ERR-007b — Git operations (≈20 sites)**
- `mod/src/main/java/io/moderne/cli/commands/git/clone/RepositoryCloneTask.java:138,159,185,215`: `"The clone failed"` (4 call sites, all ending the same) → `"Examine the log at <link>"`.
- `…/RepositoryCloneTask.java:201`: `"Branch does not exist on remote"` → `"Verify branch name in repos.csv is correct"`.
- `…/RepositoryCloneTask.java:240`: `"Remote repository is empty"` — **no suggestions**.
- `…/RepositoryCloneTask.java:275`: `"Failed to get remote default branch"` — **no suggestions**.
- `mod/src/main/java/io/moderne/cli/commands/git/Commit.java:167,178,188,198`: `"No staged changes"`, `"GPG signing failed"`, `"Git metadata missing"` — various, with `showStack=false` where user-facing.

**ERR-007c — Recipe management (≈10 sites)**
- `mod/src/main/java/io/moderne/cli/recipe/YamlRecipeParser.java:43`: `"No recipes found in <file>"`.
- `…/YamlRecipeParser.java:50`: `"Failed to read YAML file: <file>"`.
- `…/YamlRecipeParser.java:70`: `"Recipe '<name>' not found in <file>"`.
- `…/JavaRecipeParser.java:34,44`: `"Could not find class declaration"`, `"Failed to read Java file"`.
- `mod/src/main/java/io/moderne/cli/commands/Run.java:529`: `"License validation failed"` → partial-success in completion builder.
- `Run.java:793`: `"Unable to find recipe <name>"` → suggests `Search` and `Export`.

**ERR-007d — Study / analysis (≈15 sites)**
- `mod/src/main/java/io/moderne/cli/commands/study/Study.java:171`: `"No data tables available"`.
- `…/Study.java:212`: `"Data table name must be provided"`.
- `…/Study.java:218`: `"Select a data table in range"`.
- `…/Study.java:288,304`: `"No data table rows produced"`, cause-chained exec errors.
- `…/Study.java:323,334,336`: `"Failed to write JSON"`, `"Failed to parse template"`, `"Failed to execute template"`.

**ERR-007e — Trace / log (≈8 sites)**
- `mod/src/main/java/io/moderne/cli/commands/trace/Log.java:81`: `"No trace found for <command> <id>"`.
- `…/Log.java:149`: `"Unable to create log aggregate"`.
- `mod/src/main/java/io/moderne/cli/commands/trace/AnalyzeCommand.java:31,40,86`: `"Trace file not found"`, `"Failed to launch analyzer"`, `"Node.js not found for trace analysis"` (last one with suggestion).

**ERR-007f — Publish (≈12 sites)**
- `mod/src/main/java/io/moderne/cli/commands/Publish.java:101`: `"No artifact store configured"` → `"Run `mod config lsts artifacts`"`.
- `Publish.java:178`: `"Failed to update central effective repos.csv"` → `showCause=true`, `showStack=false`.
- `Publish.java:287`: HTTP 401/403 → `partialSuccess=true`.
- `Publish.java:321`: `"Request to download failed with HTTP <code>"` (response body inlined).
- `Publish.java:498`: `"The group ID cannot be empty for publishing"` → `showStack=false`.
- `Publish.java:501`: `"Invalid version format for publishing '<version>'"` → `showStack=false`.

**ERR-007g — Factory / pipeline (≈6 sites)**
- `mod/src/main/java/io/moderne/cli/factory/FactoryPipeline.java:96`: `"No repositories found in <path>"`.
- `…/FactoryPipeline.java:354`: `"Failed to read state for run <id>"`.
- `mod/src/main/java/io/moderne/cli/commands/factory/FactoryRun.java:80`: `"Node.js (npx) required for factory agent"` → `"Install Node.js"`.

**ERR-007h — Config / directory / file (≈15 sites)**
- `mod/src/main/java/io/moderne/cli/config/ClasspathResource.java`: multiple `"Unable to extract/assemble JAR"` errors.
- `mod/src/main/java/io/moderne/cli/config/RepositoryDirectory.java:108`: `"Unable to add .moderne folder to .git/info/exclude"`.
- `mod/src/main/java/io/moderne/cli/FileUtils.java:39`: `"Unable to create directory <dir>"`.
- `…/FileUtils.java:106`: `"Unable to delete <dir>"` → `"Manually remove repository directory"`.
- `mod/src/main/java/io/moderne/cli/config/ConfigurationDirectory.java:53`: `"Unable to create CLI config directory"` + cause.
- `mod/src/main/java/io/moderne/cli/version/Versions.java:23`: `"Failed to load moderne-cli.properties"`.

**ERR-007i — GraphQL / API (≈8 sites)**
- `mod/src/main/java/io/moderne/cli/graphql/GraphqlRequest.java:139`: `"Error calling <url>: <body>"`.
- `…/GraphqlRequest.java:142-147`: `"Invalid Moderne API token"` — builder with `showStack=false`.
- `…/GraphqlRequest.java:245`: `"Response is not a collection"`.
- `mod/src/main/java/io/moderne/cli/graphql/OrganizationClient.java:83`: `"Select organization in range [1-<N>]"`.
- `…/OrganizationClient.java:123`: `"Request to <url> failed with status code <code>"`.
- `…/OrganizationClient.java:159`: `"Failed to fetch organizations"` + cause.
- `…/OrganizationMapper.java:116`: `"No clone protocol configured"` → `"Use @|bold mod config clone protocol edit|@"`.
- `…/OrganizationMapper.java:302`: `"Unable to build clone URL with origin: <o> and protocol: <p>"`.

**ERR-007j — License & Moderne config (≈6 sites)**
- `mod/src/main/java/io/moderne/cli/commands/Search.java:111`: `"A valid license is required to use mod search"`.
- `mod/src/main/java/io/moderne/cli/commands/config/license/License.java:145`: `"Failed to serialize license to JSON"`.
- `mod/src/main/java/io/moderne/cli/commands/config/license/moderne/Moderne.java:39`: `"License sync not supported by Moderne instance"`.

### ERR-008 — Partial-success sites (only two found)
- **Code refs:**
  - `mod/src/main/java/io/moderne/cli/commands/task/MultiTaskCommand.java:97` — set when `errorCount < taskCount && taskCount > 0` (some repos succeeded, some failed).
  - `mod/src/main/java/io/moderne/cli/commands/Publish.java:287-288` — HTTP 401/403 (some content uploaded).
- **User sees:** Yellow `"PARTIAL SUCCESS: mod partially succeeded with an exception"` banner + yellow `"MOD PARTIALLY SUCCEEDED"` closing banner; exit `-2`.

### ERR-009 — Direct stderr / non-CommandException error prints
- **Sites:**
  - `mod/src/main/java/io/moderne/cli/launcher/ModerneLauncher.java:51` — `"WARNING: Failed to extract CLI dependencies. Attempting direct launch."` (bootstrap fallback, raw stderr).
  - `mod/src/main/java/io/moderne/cli/commands/Wrapper.java:68` — `"Error: --version, --auto-update, --auto-update-snapshot are mutually exclusive."` (option validation, raw stderr).
  - `mod/src/main/java/io/moderne/cli/commands/Mcp.java:541-542` — `"Background initialization failed: <e>"` + `printStackTrace` to stderr.
  - `mod/src/main/java/io/moderne/cli/recipe/RecipeRunner.java:187-427` — `"[RecipeRunner] <timing/validation output>"` — debug-oriented stderr prints, prefixed.
  - `mod/src/main/java/io/moderne/cli/commands/Mod.java:79-82` — bootstrap exception path: `drawBanner()` then `System.err.println(convertError(ex))`.

### ERR-010 — CommandCanceledException
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/CommandCanceledException.java`
- **Purpose:** thrown on user cancellation (e.g. during interactive prompt).
- **Display:** same path as CommandException since it is-a RuntimeException; message supplied by caller.

### ERR-011 — `setWarning()` (deprecated but live)
- **Code ref:** `StandardCommand.java:399-401` (`@Deprecated public void setWarning(Throwable)`)
- **Behavior:** attaches a `warning` Throwable; after a successful `run()`, `call()` emits the Yellow banner `"\nWARNING: mod produced a warning, but the command continued to completion\n"` followed by `handleError(warning)` output, then a `"MOD SUCCEEDED WITH WARNINGS"` closing banner.
- **Known callers:** `mod/src/main/java/io/moderne/cli/commands/ListRepositories.java:105`; corrupted-LST path (`LstJarFile` + `CorruptedLstException`).

---

## 4. Progress / status (`PROG-*`)

Progress output flows through `StandardCommand.progressBar()` → `IndentProgressBar` → one of `AnimatedProgressBar` / `PlainProgressBar` / `NoopProgressBar`.

### PROG-001 — `progressBar()` selection logic
- **Code ref:** `StandardCommand.java:91-109`
- **Branches:**
  - `!hasBanner()` → `NoopProgressBar` (CSV/JSON output, silent).
  - CI env / `/.dockerenv` / `CLAUDE_CODE` env / `NO_COLOR` / no console → `PlainProgressBar`.
  - else → `AnimatedProgressBar`.
- **Wrapper:** always returns `new IndentProgressBar(delegate)`.

### PROG-002 — README style guide (canonical, internal)
- **Code ref:** `README.md:95-108`
- **Rules:**
  1. `intermediateMessage` (`intermediateResult`) — already-determined info, long-lasting importance. **Never** for in-progress actions like "Analyzing files" / "Uploading files".
  2. `setExtraMessage` — in-progress actions, full or approximately-full sentence, ends with a period **unless** the trailing text is a GAV coordinate, a build tool task, or a URL where a trailing period would be hard to copy.
  3. Build tools append to `build.log` for the run (not separate files / not the CLI output stream).
  4. Verbose modes and boolean-flag-triggered verbosity are a measure of last resort; existing verbose options have been removed.

### PROG-003 — `setExtraMessage` call-site sampler
- **File:** `mod/src/main/java/io/moderne/cli/build/JavaRuntime.java:198, 230`
- **String:** `"Checking for a compatible version of Java"` — no period.
- **Other representative sites:**
  - `mod/src/main/java/io/moderne/cli/commands/build/steps/maven/Maven.java:200`: `"Installing Maven plugin for LST compilation"`
  - `…/maven/Maven.java:207`: `"Resolving dependencies"`
  - `…/maven/Maven.java:228`: `"Asking Maven to build an LST"`
  - `…/gradle/Gradle.java:231`: `"Installing Gradle plugin for LST compilation"`
  - `…/gradle/Gradle.java:276`: `"Asking Gradle to build an LST"`
  - `…/bazel/Bazel.java:158`: `"Building " + target`
  - `…/bazel/Bazel.java:202`: `"Asking Bazel to build an LST"`
  - `…/sbt/Sbt.java:80`: `"Parsing SBT project: " + projectName`
  - `mod/src/main/java/io/moderne/cli/commands/run/RunTask.java:359`: `"Loading recipe"`
  - `…/run/RunTask.java:446`: `"Validating recipe"` (three call sites)
  - `…/run/RunTask.java:453`: `"Running recipe"`
  - `…/run/RunTask.java:524`: `"Writing results"`
  - `mod/src/main/java/io/moderne/cli/commands/Run.java:361,376`: `"Checking if LST is up to date"`, `"Starting recipe execution"`
  - `mod/src/main/java/io/moderne/cli/commands/build/Build.java:731`: `"Making a plan"`
  - `Build.java:1086`: `"Downloading LST from Moderne"`
  - `mod/src/main/java/io/moderne/cli/commands/git/sync/Csv.java:149`: `"Reading " + csv`
  - `mod/src/main/java/io/moderne/cli/OrganizationDirectoryReader.java:171`: `"<path>"` (bare path token)
  - `mod/src/main/java/io/moderne/cli/recipe/MavenRecipeBundleResolverFactory.java:188,297`: `"Resolving " + gav`, `"Resolving recipe dependencies"`

### PROG-004 — `intermediateResult` call-site sampler
- **File:** `mod/src/main/java/io/moderne/cli/commands/run/RunTask.java:378-380,484-486,492-494,533-535,608-610,653-655,672-674`
- **Shape:** `Icons.WARNING + " Found N errors..."`, `Icons.WARNING + " Dated snapshot <ts>..."`, etc.
- **Other representative sites:**
  - `mod/src/main/java/io/moderne/cli/commands/CsvToExcel.java:56,109,132,150`: warnings + a final `Icons.SUCCESS + " Added <N> rows"`.
  - `mod/src/main/java/io/moderne/cli/commands/git/sync/Csv.java:223,234,244,261,274,296`: `"Adding organization ..."`, `"Changing organization ..."`, `"Deleting organization ..."`, `"Moving repository ..."` — raw strings mixed with `boldHighlight` colors.
  - `mod/src/main/java/io/moderne/cli/recipe/InstallMavenRecipeBundle.java:61-62,70-71`: `Icons.WARNING + " Dated snapshot X not found, falling back..."`.
  - `mod/src/main/java/io/moderne/cli/commands/run/Run.java:181`: `Icons.WARNING + " No valid LST found"` / `"No LST found"`.
  - `mod/src/main/java/io/moderne/cli/commands/task/OrganizationWalkingCommand.java:90,94-95`: `Icons.WARNING + " Unable to read git metadata in directory ..."`, `Icons.WARNING + " No repositories found. You may need to run mod git clone first..."`.
  - `mod/src/main/java/io/moderne/cli/commands/exec/Exec.java:205,213,269`: `"After substitution, the command is ..."`, raw `output + "\n"`, `"Execution output will be written to " + link`.
  - `mod/src/main/java/io/moderne/cli/commands/Search.java:170,173,287`: `file.getFileName()`, `"  L" + lineNumber + ": " + content`, raw `line` — no icons, raw output as progress side-channel.
  - `mod/src/main/java/io/moderne/cli/commands/build/Build.java:1230`: `Icons.WARNING + " Unknown build tool " + ...`.

### PROG-005 — `TaskProgressBar` semantic wrappers (see PRIM-013)
- **Used by:** `MultiTaskCommand` subtree (every per-repo task flow).
- **String shape:** `Icons.<STEP|WARNING|SUCCESS|FAILURE> + " " + <text>`; emitted through underlying `intermediateResult`.

### PROG-006 — `setMultiTask` / `setConcurrentTasks`
- **Driver:** `Action.java:80,107,122` (`registerTask`, `completeTask`, `printAction`).
- **Visible effect:** multi-line AnimatedProgressBar with one bar per task, purple task ID prefix, grey elapsed time, counters (running / successful / skipped / failed) on the overall line.

### PROG-007 — `finish(...)` messages (summary line)
- **Sites:**
  - `mod/src/main/java/io/moderne/cli/commands/ListRepositories.java:77-80` — `"Listed {0,choice,0#0 partitions|1#1 partition|1<{0} partitions}."` (MessageFormat plural form).
  - `mod/src/main/java/io/moderne/cli/commands/RunHistory.java:184`: `"Retrieved <N> run(s) from history."`.
  - `mod/src/main/java/io/moderne/cli/commands/build/Build.java:363`: build summary counts.
  - `mod/src/main/java/io/moderne/cli/commands/git/sync/Csv.java:356` — sync completion summary.

---

## 5. Banners (`BAN-*`)

### BAN-001 — Start-of-run banner (logo + version)
- **Code ref:** `StandardCommand.java:164-166` (dispatches to `drawBanner()`); `StandardCommand.java:235-252` (implementation); `Icons.java:28-59` (logo definitions).
- **Output:**
  ```
  <centered logo — 5 lines UTF-8 block-art, or 8 lines ASCII @-art>
  Moderne CLI <version>[ (from Maven local ~/.m2)]
  ```
- **Suppressed when:** `hasBanner() == false` (CSV/JSON output commands).

### BAN-002 — End-of-run "succeeded" banner (clean)
- **Code ref:** `StandardCommand.java:187-195`
- **Strings:** `ModerneColors.Green.boldHighlight("\nMOD SUCCEEDED")` + `" in " + <duration>`.

### BAN-003 — End-of-run "succeeded with warnings" banner
- **Code ref:** `StandardCommand.java:190`, preceded by warning block at `StandardCommand.java:179-181`.
- **Strings:**
  - preface (yellow highlight): `"\nWARNING: mod produced a warning, but the command continued to completion\n"`
  - closing (yellow bold): `"\nMOD SUCCEEDED WITH WARNINGS"` + duration.

### BAN-004 — End-of-run failure banners
- **Code ref:** `StandardCommand.java:213-220`
- See ERR-003.

### BAN-005 — Deprecation banner
- **Code ref:** `StandardCommand.java:167-170`
- **String (yellow highlight):** `"\nWARNING: This command is deprecated and may be removed in a future release\n"`
- **Trigger:** any command class with `@Deprecated` annotation (or whose parent command is deprecated).

---

## 6. Action headers (`ACT-*`)

### ACT-001 — `printAction` (bold ACTION glyph + text)
- **Code ref:** `StandardCommand.java:111-120`
- **Template:** `ansi().render("@|bold %s %s|@\n", ACTION, action)` — i.e. bold `● <action text>`, preceded by a blank line after the first action.
- **Representative call sites:** `mod/src/main/java/io/moderne/cli/commands/task/Action.java:122`; also called directly from many config subcommand run methods (e.g. `"Configuring Node.js version"`, `"Retrieving the configured LST cache directory"`, `"Reading organization"`, `"Listing partitions"`, `"Retrieving recipe run history"`, etc.).

### ACT-002 — Factory action header (PRIM-012)
- **Code ref:** `mod/src/main/java/io/moderne/cli/factory/FactoryOutput.java:35`
- **Template:** `ansi().render("@|bold %s %s|@", Icons.ACTION, message)` — same shape as ACT-001, but prints directly to `out` without the leading blank line.

---

## 7. Next-steps block (`NXT-*`)

### NXT-001 — `suggestNextSteps`
- **Code ref:** `StandardCommand.java:122-134`
- **Output shape:**
  ```
  <blank line>
  ● What to do next   (bold, BULLET glyph)
      > step 1        (leading 4-space indent, Yellow "> " prefix)
      > step 2
  ```
- **Per-item rendering:** `ModerneColors.Yellow.highlight("    > ") + <text>`. Steps are arbitrary objects; rendered via `toString()`.
- **Call sites (non-exhaustive):** `mod/src/main/java/io/moderne/cli/commands/git/sync/Csv.java:356` flow, post-build recommendations, post-publish guidance, post-run suggestions.

---

## 8. Inline status glyphs (`SUC-*` / `WARN-*` / `INFO-*`)

### SUC-001 — Inline success glyph (`Icons.SUCCESS` = `✓`, green bold)
- **Sites:**
  - `mod/src/main/java/io/moderne/cli/commands/CsvToExcel.java:153`: `progressBar.intermediateResult(Icons.SUCCESS + " Added " + rowCount.get() + " rows")`.
  - `mod/src/main/java/io/moderne/cli/commands/task/TaskProgressBar.java:69`: `printSuccess()`.
  - `mod/src/main/java/io/moderne/cli/factory/FactoryOutput.java:53`: `"        ✓ <message>"` (8-space indent).

### WARN-001 — Inline warning glyph (`Icons.WARNING` = `⚠`, yellow bold)
- **Sites (non-exhaustive):**
  - `mod/src/main/java/io/moderne/cli/commands/CsvToExcel.java:56,109,132,150`
  - `mod/src/main/java/io/moderne/cli/commands/run/RunTask.java:378-380,484-486,492-494,533-535,608-610,653-655,672-674`
  - `mod/src/main/java/io/moderne/cli/commands/Run.java:181`
  - `mod/src/main/java/io/moderne/cli/commands/task/TaskProgressBar.java:65`
  - `mod/src/main/java/io/moderne/cli/commands/task/OrganizationWalkingCommand.java:90-95`
  - `mod/src/main/java/io/moderne/cli/OrganizationDirectoryReader.java:474`
  - `mod/src/main/java/io/moderne/cli/recipe/InstallMavenRecipeBundle.java:61-62,70-71`

### INFO-001 — Inline info glyph (`Icons.INFO` = `ℹ`, blue bold)
- **Sites:** Rare in main output. Used mainly as a marker-annotation icon inside `RichDiffRenderer` (PRIM-011). No direct `printInfo` calls outside the `TaskProgressBar` wrapper.

### FAIL-001 — Inline failure glyph (`Icons.FAILURE` = `✗`, red bold)
- **Sites:**
  - `mod/src/main/java/io/moderne/cli/commands/task/TaskProgressBar.java:177`: `printFailed()`.
  - `mod/src/main/java/io/moderne/cli/LstJarFile.java:244`: appended to corrupted-LST error message.
  - `mod/src/main/java/io/moderne/cli/factory/FactoryOutput.java:69`: 8-space-indented factory line.

---

## 9. Tables / lists / row output (`TAB-*`)

### TAB-001 — Rich diff output (PRIM-011)
- **Surface type:** file-change table.
- **Shape:** see PRIM-011.

### TAB-002 — Repository list (`ListRepositories`)
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/ListRepositories.java`
- **Output format:** per-repo line via `RepositorySpecFormatter` (PRIM-010); or JSON when `--json` flag set (NoopProgressBar path).
- **Finish line:** MessageFormat plural (`"Listed 0 partitions." / "Listed 1 partition." / "Listed N partitions."`).

### TAB-003 — Run history (`RunHistory`)
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/RunHistory.java:145-184`
- **Shape:**
  ```
  [1] <run-id> <recipe-id> -Poption=value
         Data tables produced:
             <data-table-name>
  ```
- **Empty state per-run:** `"      No data tables produced"` (plain text, no icon).
- **Finish line:** `"Retrieved <N> run(s) from history."`.

### TAB-004 — CSV-to-XLSX conversion report (`CsvToExcel`)
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/CsvToExcel.java`
- **Shape:** progress-bar intermediate results: `⚠ The file does not exist: <p>` / `⚠ The file is empty: <p>` / `⚠ Truncated <N> rows...` / `⚠ Unable to auto-size...` / `✓ Added <N> rows`.

### TAB-005 — Factory output surface (PRIM-012)
- **Shape:** one action header + indented `✓ / ⚠ / ✗ / ℹ` status lines.

### TAB-006 — Organization-sync changelog (`Csv`)
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/git/sync/Csv.java:223,234,244,261,274,296,356`
- **Shape:** `intermediateResult("Adding organization <name>")`, `"Changing organization <name>"`, `"Deleting organization <name>"`, `"Moving repository <spec>"` — mixed with bold-highlighted colors. Plus a final `finish(...)` summary.

### TAB-007 — CSV / JSON machine-readable output
- **Commands affected:** `Study --csv` / `--json`, `Audit builds list --streaming`, `ListRepositories --json`, `RunHistory --json` (where present), `Run --streaming` / `Build --streaming`.
- **Suppression:** `hasBanner() == false` → no start banner, no end banner, no progress.
- **Output style:** raw CSV / NDJSON / JSON to stdout.

---

## 10. Prompts (`PROMPT-*`)

### PROMPT-001 — `userInput(prompt)`
- **Code ref:** `StandardCommand.java:136-150`
- **Template:** `System.console().readLine(prompt + " ")` (or Scanner fallback that prints `prompt + " "` and flushes).
- **Style:** caller-supplied text + one trailing space; no punctuation enforced; no `(y/n)` convention.
- **Non-interactive environment:** throws `CommandException("Running in a terminal that cannot accept user input")`.
- **Call sites:** config-setup-style flows; interactive selection of organization / data-table; license activation.

### PROMPT-002 — Selection prompts (out-of-range errors)
- **Code refs:**
  - `mod/src/main/java/io/moderne/cli/commands/run/Run.java:809`: `"Select a recipe in the range [1-<N>]"`
  - `mod/src/main/java/io/moderne/cli/commands/study/Study.java:218`: `"Select a data table in the range [1-<N>]"`
  - `mod/src/main/java/io/moderne/cli/graphql/OrganizationClient.java:83`: `"Select organization in range [1-<N>]"`
- **Note:** these are thrown as `CommandException` rather than re-prompted.

### PROMPT-003 — Password / secret input
- **Not observed** — no `Console.readPassword()` call sites in the surveyed output surfaces.

---

## 11. Hyperlinks (`LINK-*`)

### LINK-001 — Log-file links in error output
- **Source:** `RepositoryCloneTask.java:138` et al. suggest `"Examine the log at " + AdvancedLinks.link(new AdvancedLinks.A("build.log", logPath), "build.log")`.

### LINK-002 — Support email
- **Code ref:** `StandardCommand.java:342` — `"Report to support@moderne.io"` with email wrapped bold + OSC 8 where supported.

### LINK-003 — Data-table output paths
- **Source:** `mod/src/main/java/io/moderne/cli/commands/study/Study.java` — `-o/--output-file` result line links to the written file.

### LINK-004 — Dashboard / browser URLs
- **Source:** Moderne tenant link emitted post-publish / post-sync where applicable.

### LINK-005 — Commands *not* linked
- Repository names (rendered plain via `RepositorySpecFormatter`).
- Recipe IDs.
- Moderne host URLs printed in `mod config moderne show`.
- Stack-trace class/file references.

---

## 12. Structural / framework-level (`SKEL-*`)

### SKEL-001 — NO_COLOR environment honoring
- **Code ref:** `StandardCommand.java:54` (`NO_COLOR = System.getenv("NO_COLOR") != null`), `StandardCommand.java:154-158` (disables `Ansi.setEnabled` when set).
- **Effect:** ANSI codes fully stripped; progress path downgrades to `PlainProgressBar`; icon fallbacks (ASCII) kick in via `Icons` class initialization.

### SKEL-002 — Jenkins CI detection
- **Code ref:** `mod/src/main/java/io/moderne/cli/commands/Mod.java:72-73`
- **Effect:** `Ansi.Detector` is installed so that Jenkins build environments also suppress ANSI, regardless of tty detection.

### SKEL-003 — Windows ANSI enablement
- **Code ref:** `StandardCommand.java:157-158` — `AnsiConsole.systemInstall()` so raw ANSI (including OSC 8) is honored on Windows terminals.

### SKEL-004 — CI / Docker / Claude Code detection for progress downgrade
- **Code ref:** `StandardCommand.java:97-101` — any of `BuildEnvironment != null`, `/.dockerenv` exists, `CLAUDE_CODE` env set, `NO_COLOR` set, or no console.

### SKEL-005 — Exit codes
- **Code refs:** `StandardCommand.java:197, 222, 95` — `0` (success / success with warnings), `-1` (hard failure), `-2` (partial success).

---

## Not represented in this inventory (see `audit-metadata.md` §exclusions)

- Cron / scheduled-task output (if any) — no evidence found.
- Telemetry / metrics endpoints (`io/moderne/cli/metrics/*`) — internal wiring, not a user-facing *output* surface.
- MCP stdio protocol messages (`io/moderne/cli/mcp/*`) — machine-to-machine JSON-RPC, not user-facing text.
- GraphQL payload strings — server-controlled, not CLI output.
- Test-only fixtures under `src/test/resources`.
- The tray subcommand (`commands/tray/*`) — desktop tray integration, not terminal output; inspection was skipped.
