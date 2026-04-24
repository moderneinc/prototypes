# CLI Categorized — emergent semantic categories

> Second pass of the audit. Same facts as `cli-inventory.md`, regrouped by the *semantic output type* the CLI currently treats as a unit. Categories were allowed to emerge from the code rather than imposed from a target taxonomy — Phase 2 will map these onto the intended taxonomy and diff the two.

**Structure of each category:**
- **What the category covers** — scope in plain language
- **How the CLI currently treats it** — the structural, tonal, color, and typographic pattern(s) the CLI applies today
- **Representative inventory entries** — IDs from `cli-inventory.md`, not duplicated verbatim

Where a category has internally inconsistent treatments (and most of them do), that fact is named here and the consistency delta is documented in `cli-deltas.md`.

---

## A. Success / completion

### What it covers
Signals that a user-invoked command (or a step inside one) finished its intended work.

### How the CLI currently treats it
**Four distinct surfaces co-exist:**

1. **End-of-run success banner** (`BAN-002`). Rendered by `StandardCommand.call()` after a clean `run()`:
   - `ModerneColors.Green.boldHighlight("\nMOD SUCCEEDED")` followed by `" in <duration>"`.
   - Typography: bold, green, all-caps, no glyph, leading blank line.
   - Applies universally to every subcommand that `hasBanner() == true`.
2. **Inline success glyph** (`SUC-001`). Written mid-command via `Icons.SUCCESS` (`✓` in green bold; ASCII fallback `+`), concatenated into a single line of `intermediateResult()` output (e.g. `"✓ Added 1,234 rows"`).
   - Typography: glyph + space + sentence; green only on the glyph, not the body text.
3. **Implicit success via task counter** (`PROG-006`). The AnimatedProgressBar's overall line increments `overallSuccessful`; successful repos/tasks in a multi-task run are summarized numerically rather than each emitting a visible line.
   - Typography: green count in the counter strip, no narrative text.
4. **`finish(...)` summary line** (`PROG-007`). Emitted at the tail of a command's progress flow — `MessageFormat`-formatted sentence like `"Listed 3 partitions."` or `"Retrieved 17 runs from history."`.
   - Typography: plain text (no glyph, no color), single sentence ending with a period.

**Internally inconsistent**: same underlying outcome ("the thing worked") has four different typographic treatments. See delta `D-01`.

### Representative inventory entries
`BAN-002`, `SUC-001`, `PROG-006`, `PROG-007`, `ACT-001` (each printAction implicitly marks prior action as done), `NXT-001` (next-steps block only rendered on success path).

---

## B. Partial success

### What it covers
A command that accomplished some of its intended work but also failed some of it (typically multi-repo / multi-artifact flows).

### How the CLI currently treats it
A **distinct** banner pair, only reachable via two code paths:
- `MultiTaskCommand.java:97` — set `partialSuccess=true` when `errorCount < taskCount && taskCount > 0`.
- `Publish.java:287-288` — set on HTTP 401 / 403 during repos-lock upload.

Output (`BAN-004` branch `partialSuccess=true`):
- preface (yellow highlight): `"\nPARTIAL SUCCESS: mod partially succeeded with an exception\n"`
- error body: full `convertError()` output — including "What went wrong", the stack trace (unless `showStack=false`), and the `Try:` list.
- closing (yellow bold): `"\nMOD PARTIALLY SUCCEEDED"` + duration.
- exit code `-2`.

**Typography:** yellow (not red); the same multi-section error template as hard failure, just with a different banner colour and closing word.

**Narrow applicability:** only two call sites today. Many multi-task commands could conceivably be partial-success (e.g. batch git operations, multi-repo build) but do not opt in.

### Representative inventory entries
`ERR-008`, `ERR-003` (shared rendering path), `BAN-004`.

---

## C. Success-with-warnings

### What it covers
The command completed its primary work, but flagged one or more non-fatal conditions that deserve user attention.

### How the CLI currently treats it
Orthogonal to A and B, signalled via the **deprecated `setWarning(Throwable)` API** (`StandardCommand.java:399-401`):
- During/before `run()`, something calls `setWarning(throwable)`.
- After `run()` returns, `call()` emits a **warning preface** (`BAN-003`): yellow `"\nWARNING: mod produced a warning, but the command continued to completion\n"`.
- Then the full error block (`handleError(warning)`) — same `convertError()` template as a real error.
- Then the success-with-warnings closing banner: yellow bold `"\nMOD SUCCEEDED WITH WARNINGS"` + duration.
- Exit code `0`.

**Live despite deprecation:** known callers include `ListRepositories.java:105` and the corrupted-LST path. Documented intended replacement is "throw an exception instead" — but without a matching *non-fatal exception type*, this collapses into C vs B.

### Representative inventory entries
`ERR-011`, `BAN-003`.

---

## D. Hard failure

### What it covers
A command that could not complete. The user's request was rejected.

### How the CLI currently treats it
**All failure output funnels through `StandardCommand.convertError(Throwable)`** (`ERR-002`). Every hard-failure invocation renders in the following template:

```
<failure preface, red>
FAILURE: mod failed with an exception

● Where:
  <sanitized stack trace>    (if showStack)

● Cause:
  <cause message>             (if showCause and cause exists)

● What went wrong:
  <exception message or fallback line>

● SSL connection details:    (only when SslConnectionException in chain)
  <SslDiagnostics.generateReport()>

● Try:
  ▶ suggestion 1
  ▶ suggestion 2
  ▶ Report to support@moderne.io    (always appended; bold; OSC-8 link)

<closing banner, red bold>
MOD FAILED in (<duration>)
```

**Typography:**
- Red for the preface and closing banner (bold on closing).
- BULLET glyph (`●`) prefixes **section headers** (`Where:`, `Cause:`, `What went wrong:`, `SSL connection details:`, `Try:`).
- STEP glyph (`▶`, yellow bold) prefixes **each item** inside `Try:`.
- Picocli markup inside fix suggestions is rendered via `ansi().render()`, so `@|bold mod config http proxy|@` shows up bold.
- Default `showStack=true` means most errors include a stack trace; a minority set `showStack=false` for user-facing validation errors.

**Controls per throw site (via `CommandException.Builder`):**
- `showStack` (default true) — suppresses `Where:` section if false.
- `showCause` (default false) — adds `Cause:` section if the exception has a chained cause with a message.
- `partialSuccess` (default false) — switches to the B branch.
- `suggest(...)` / `suggestIf(...)` — appends items to the `Try:` list. **Zero-to-three** suggestions per site is typical.

**Auto-augmented suggestions** (`ERR-004`) are added to `Try:` based on the exception type:
- `SslConnectionException` — trust-store tips.
- Network-failure exception types with no HTTP proxy configured — HTTP-proxy config tip.
- `RemoteException` — `getFixSuggestions()` merged verbatim.

**Exit code:** `-1`.

### Dead-end vs actionable
Two de-facto *sub-categories* exist within hard failure based on how many concrete fix suggestions the throw site provides. This is the highest-leverage delta for Phase 2 — treated separately under `D-02` in the deltas file.
- **"Dead-end" hard failures** (~140 sites): zero concrete `.suggest(...)` calls; the user is left with only the generic `Report to support@moderne.io` tail. Examples: `Bazel.java:116,209,214`, `DotNetBuildStep.java:277`, `JavaScriptBuildStep.java:277`, `RepositoryCloneTask.java:240,275`, all 7 sites in `Study.java`.
- **"Actionable" hard failures** (~60 sites): at least one concrete fix suggestion. Examples: `Maven.java:145,155,250`, `Gradle.java:163,190,282`, `RepositoryCloneTask.java:138,159,185,201,215`, `Run.java:793`, `Publish.java:101`, `OrganizationMapper.java:116`.

### Representative inventory entries
`ERR-001`, `ERR-002`, `ERR-003`, `ERR-004`, `ERR-005`, `ERR-006`, `ERR-007a`–`j`, `BAN-004`.

---

## E. Warnings (non-fatal)

### What it covers
Information the user should notice but that does not abort the command.

### How the CLI currently treats it
**Three unrelated surfaces converge under the label "warning":**

1. **Inline `⚠` warning glyph** (`WARN-001`). Emitted mid-run via `intermediateResult()`. Typography: yellow bold glyph + space + sentence. Used in dozens of sites — the dominant treatment.
2. **Yellow banner**: either the deprecation banner (`BAN-005`, see category J) or the success-with-warnings preface (`BAN-003`, category C).
3. **Partial-success preface** (`BAN-004` when `partialSuccess=true`) — the same yellow colour as warnings is re-used for a different semantic.

**Typography principles observed:**
- Yellow is the shared semantic colour for "attention but not fatal".
- Glyph is always `⚠` for inline use.
- Body text style varies wildly site-to-site: some end with a period, some don't; some are sentence-case, some start with a noun (`"Dated snapshot 2025-..."`); some embed a path as the trailing token, some quote it.

### Representative inventory entries
`WARN-001`, `BAN-003`, `BAN-004`, `BAN-005`, and roughly 30 `intermediateResult` call sites listed under `PROG-004`.

---

## F. Info / neutral status

### What it covers
Messages that aren't success, aren't failure, aren't warnings — they just update the user on what is happening.

### How the CLI currently treats it
**Sparse and underdeveloped.** Three sub-surfaces:

1. **`Icons.INFO` (ℹ, blue bold)** — almost never used as a stand-alone prefix. Found inside `RichDiffRenderer` as a marker-annotation icon; not in top-level command output outside of `TaskProgressBar.printInfo()` calls which themselves internally forward as `Icons.STEP + ...` (not `Icons.INFO`) (`PRIM-013`).
2. **Plain-text `intermediateResult`** — most "what is happening" messages are raw strings without an info glyph. Examples: `"After substitution, the command is ..."` (`Exec.java:205`), `"  L<line>: <content>"` (`Search.java:173`), `"Adding organization <name>"` (`Csv.java:223` — these also sometimes use `boldHighlight`, so the colour leaks into info territory).
3. **Action headers** (`ACT-001`) — bold `● <action>` preface for a section of work. These are *structural* info, not glyph-info. Single most-consistent info-like treatment in the CLI.

**Typography:**
- No reserved colour for info.
- Blue is not consistently used; when blue appears it's almost always the `RepositorySpecFormatter` repo-name highlight, not an info signal.
- The CLI's effective info channel is "plain text in the progress bar".

### Representative inventory entries
`INFO-001`, `ACT-001`, `ACT-002`, `PROG-004`, `PROG-003`.

---

## G. Progress (in-flight action)

### What it covers
State updates *while* a long-running action is executing — not yet determined, not yet complete.

### How the CLI currently treats it
Channel: `setExtraMessage(String)` on the current progress bar (`PRIM-004`–`PRIM-007`).

**Structural rules (documented in README.md:95-108):**
- `setExtraMessage` = in-flight; `intermediateResult` = already-determined. In practice these are mixed up at many sites (see `D-07`).
- Full-sentence style. Period at the end unless trailing text is a GAV coordinate, a build-tool task, or a URL (anywhere a trailing period would be hard to copy).

**Render shape:**
- `AnimatedProgressBar` (rich): grey extra-message text trailing the bar, truncated to remaining width; 50ms debounced refresh.
- `PlainProgressBar` (CI): single line `[NNN% (HH:MM:SS) ...]\n<message>` at most once per 10s.
- `NoopProgressBar`: silenced entirely.

**Typography:** grey, no glyph, single line, left-anchored to the bar.

### Representative inventory entries
`PROG-001`, `PROG-002`, `PROG-003`, `PRIM-004`, `PRIM-005`, `PRIM-006`.

---

## H. Persistent / determined status (during a run)

### What it covers
Facts established mid-run that the user should see persist in the scrollback even after the progress bar moves on — e.g. "this build chose Java 17", "this repo is being skipped because X", "the LST being built is at path Y".

### How the CLI currently treats it
Channel: `intermediateResult(String)` on the current progress bar. In the `AnimatedProgressBar` this literally means "clear the live status lines, print this string + `\n`, then reassert the status lines below it". The printed line then stays in the terminal's scrollback.

**Typographic sub-patterns seen:**
- `Icons.WARNING + " …"` (by far the most common decoration).
- `Icons.SUCCESS + " …"` (rare; typically at end of sub-task).
- `Icons.STEP + " …"` (used inside `TaskProgressBar.printStep`).
- No glyph at all — raw strings, sometimes with embedded `ModerneColors` calls.

**Consistency problems:**
- The README rule that `intermediateResult` is for "already-determined" info is violated by ≈40% of call sites — many pass in-progress phrasing through the `intermediateResult` channel (e.g. `"Processing JavaScript project: X"`, `"Selected Python X"`). This is tracked as `D-07`.

### Representative inventory entries
`PROG-004`, `PROG-005`, `PRIM-013`, `PRIM-014`, most of `WARN-001`/`SUC-001` sites (they ride this channel).

---

## I. Help output (help, usage, description)

### What it covers
Output emitted by picocli when a user runs `--help` or passes arguments that fail validation.

### How the CLI currently treats it
**Single shared skeleton** defined on `StandardCommand` (`HELP-001`):

```
<banner — logo + version, unless hasBanner() is overridden>

Usage:
  <picocli-generated synopsis>

Description:
  <command description string>

Parameters:
  <picocli-generated parameter list>

Options:
  <picocli-generated option list>

Commands:
  <picocli-generated subcommand list, for group commands>
```

Each section header is rendered as `@|bold,underline <Label>|@` (bold + underline, no colour).

**Command-level content (`HELP-002`–`HELP-021`):**
- `@Command(header=...)` — terse one-liner shown at top.
- `@Command(description=...)` — longer narrative, supports picocli `@|bold ...|@` markup for inline emphasis, `%n` for linebreaks.
- `@Option(description=...)`, `@Parameters(description=...)` — one-line-or-wrapped help text per flag / positional arg.
- The shared **`PATH_PARAMETER_DESCRIPTION` constant** (`HELP-009`) is the only reused string of any length.
- Only **one dynamic footer** in the codebase: `Parsers.java:33-34` injects `"%nSupported types: ..."` at run time.

**Patterns within descriptions:**
- Inline cross-reference: `"Run @|bold mod build|@ first"`.
- Flag reference: `"@|bold --no-download|@"`.
- Path reference: `"@|bold .moderne/build|@"`.
- Feature flags in prose: `"(INCUBATING) ..."`, `"(DEPRECATED) ..."`.

**Typography:**
- Monospace (terminal-default).
- Bold + underline for section headers.
- Bold for inline cross-references.
- No colour used in help output.

### Representative inventory entries
All of `HELP-001` through `HELP-021`.

---

## J. Deprecation

### What it covers
Signals that a command or option is deprecated.

### How the CLI currently treats it
Two mechanisms that can apply independently or together:

1. **Class-level / command-level** (`BAN-005`): the `@Deprecated` annotation on a command class causes `StandardCommand.call()` to emit a yellow banner **after the start banner, before `run()`**: `"\nWARNING: This command is deprecated and may be removed in a future release\n"`. Applies recursively — deprecation is inherited from the parent command as well.
2. **Prose tagging** — `"(DEPRECATED) "` prefixes inside `@Command(header=...)` or `@Option(description=...)` strings. Examples: `Config.Java.Jdk.java` command header, `Run.java` `--jvm-debug` option, `git/sync/Moderne.java` `organizationNameOrId` parameter. This is *text only*, no runtime warning banner.

**Typography (mechanism 1):** yellow highlight, sentence form, `WARNING: <body>`.
**Typography (mechanism 2):** plain parenthetical, uppercase label, prepended to whatever description text exists.

The two mechanisms are not cross-linked in code: `@Deprecated` does not auto-insert `(DEPRECATED)` into help text, and `(DEPRECATED)` in help text does not fire the runtime banner.

### Representative inventory entries
`BAN-005`, `HELP-011` (Jdk), `HELP-005` (`--jvm-debug`), `HELP-008` (`organizationNameOrId`).

---

## K. Incubation / experimental flag

### What it covers
Commands or flags that exist but are explicitly marked as unstable.

### How the CLI currently treats it
**Text tagging only** — `"(INCUBATING) "` prepended to `@Command(header=...)` or `@Option(description=...)` strings. No runtime banner, no distinct colour, no metadata in `@Command`. Examples:
- `Audit.java:6-16` — entire audit command group tagged `"(INCUBATING) Perform an audit of recent activity."`.
- `Build.java --streaming`, `Build.java --no-patch`, `Run.java --streaming`, `Audit.Builds.ListBuilds --streaming`.

**Not applied consistently:** `Study.java` is experimental per domain knowledge but carries no `(INCUBATING)` tag.

### Representative inventory entries
`HELP-004`, `HELP-005`, `HELP-012`.

---

## L. Banners (start / close)

### What it covers
Fixed-content output that marks the beginning and end of every CLI invocation that opted in (`hasBanner() == true`).

### How the CLI currently treats it
Four discrete banners, one at start, three possible at end (see categories A, B, C, D).

**Start banner (`BAN-001`):** centered multi-line logo (UTF-8 box-drawing or ASCII `@`-art) + `"Moderne CLI <version>"` line, with an optional `"(from Maven local ~/.m2)"` source tag. Typography: default foreground, no colour, centred on the width of the version string.

**Close banners — enumerated:**
- `MOD SUCCEEDED` — green bold (`BAN-002`).
- `MOD SUCCEEDED WITH WARNINGS` — yellow bold (`BAN-003`).
- `MOD PARTIALLY SUCCEEDED` — yellow bold (`BAN-004`, partial branch).
- `MOD FAILED` — red bold (`BAN-004`, hard-failure branch).

All close banners share a shape: `\n<CAPS PHRASE> in [(]<duration>[)]`.

**Suppression:** `hasBanner() == false` suppresses both start and close banners and forces `NoopProgressBar` — used by CSV/JSON output flows.

### Representative inventory entries
`BAN-001` through `BAN-005`.

---

## M. Action headers (section markers inside a run)

### What it covers
Titles for discrete sub-sections inside a command run — e.g. `● Reading organization`, `● Building LST`, `● Committing changes`.

### How the CLI currently treats it
`StandardCommand.printAction(action)` (`ACT-001`):
- Renders `@|bold ● <action>|@\n` to `out`.
- Prepends a blank line before every action after the first (tracked via `actionCount`).
- Suppressed when `hasBanner() == false`.

`FactoryOutput` has a near-identical shape (`ACT-002`) but prints directly to stdout without the leading-blank convention.

**Typography:** bold, BULLET glyph (`●`), no colour on the text itself.

### Representative inventory entries
`ACT-001`, `ACT-002`.

---

## N. "What to do next" / next-steps

### What it covers
Actionable follow-up guidance shown at the tail of a successful command.

### How the CLI currently treats it
`StandardCommand.suggestNextSteps(...)` (`NXT-001`):
- Section header: `@|bold ● What to do next|@` (bold, BULLET glyph).
- Each item: `ModerneColors.Yellow.highlight("    > ") + <item toString()>` — 4-space indent + yellow `> ` prefix + arbitrary text.
- Only rendered if `hasBanner() == true` and the caller passed a non-empty list.

**Typography:** yellow indicator, left-anchored at 4-space indent, bold header.

**Structural contrast with "Try:" (`ERR-002`):**
- "What to do next" uses `Yellow > ` per item.
- "Try:" uses `STEP ▶` (yellow bold) per item.
- Same section-header glyph (`●`), different item bullet.

### Representative inventory entries
`NXT-001`.

---

## O. Prompts (interactive input)

### What it covers
Places where the CLI asks the user for a value.

### How the CLI currently treats it
A single shared helper `StandardCommand.userInput(prompt)` (`PROMPT-001`):
- Prints `prompt + " "` and reads one line.
- No punctuation convention; no `(y/n)` / `[Y/n]` / `(yes/no)` scheme.
- No password / secret variant anywhere in the codebase.
- Non-interactive environment → throws `CommandException("Running in a terminal that cannot accept user input")`.

Related but **not** interactive: out-of-range selection is reported via `CommandException` messages like `"Select a recipe in the range [1-N]"` (`PROMPT-002`) rather than re-prompting.

**Typography:** whatever text the caller passes, plus one trailing space. No colour, no glyph.

### Representative inventory entries
`PROMPT-001`, `PROMPT-002`, `PROMPT-003`.

---

## P. Tables / rows / lists

### What it covers
Row-oriented content: repository lists, run histories, diff output, organization changelog, CSV→XLSX conversion summary.

### How the CLI currently treats it
**No shared table renderer.** Each "table-like" surface uses its own ad-hoc concatenation:

- **`RichDiffRenderer`** (`PRIM-011`, `TAB-001`) — the only genuinely styled table in the CLI. Bold filenames behind `●` headers, Green/Red line numbers right-padded, subtle-background context fill, inline annotations (`⛔ ⚠ ℹ 🐛`), truncation strings `"  ... (N more files not shown)"`.
- **`ListRepositories`** (`TAB-002`) — per-row formatting via `RepositorySpecFormatter` (`PRIM-010`) which returns a coloured single-cell string; the rows are just `println`'d.
- **`RunHistory`** (`TAB-003`) — manually formatted `"[<n>] <id> <recipe-id> -Popt=val"` with indented data-table names under each.
- **`CsvToExcel`** (`TAB-004`) — no explicit table at all; a sequence of `intermediateResult(⚠ ...)` + a final `✓ Added <N> rows` line.
- **`Csv` (org sync)** (`TAB-006`) — `"Adding organization <name>"`, `"Changing organization <name>"`, `"Moving repository <spec>"` — a changelog rendered through `intermediateResult`.
- **`FactoryOutput`** (`TAB-005`, `PRIM-012`) — action header + 8-space-indented `✓ / ⚠ / ✗ / ℹ` status lines.
- **CSV / JSON output modes** (`TAB-007`) — raw machine-readable data to stdout; suppresses banners and progress.

**Typography:**
- No unified column framework, no unified header style, no unified border characters (nothing boxed except banners-adjacent).
- Colour choices vary per table: diff uses green/red/yellow; repo list uses blue/grey/red; run history uses bold; org-sync uses bold-highlighted colours mixed with plain strings.

**Empty state handled per-site:** `"No repositories found"` (with `⚠`) vs `"No data tables produced"` (plain) vs throwing `CommandException` vs rendering empty JSON array.

### Representative inventory entries
`TAB-001` through `TAB-007`, `PRIM-010`, `PRIM-011`, `PRIM-012`.

---

## Q. Hyperlinks

### What it covers
Clickable terminal links emitted via OSC 8.

### How the CLI currently treats it
`AdvancedLinks.A(text, href|URI|Path)` + `AdvancedLinks.link(osc8text, fallback)` (`PRIM-008`, `PRIM-009`):
- Renders `\u001B]8;;<href>\u001B\\<text>\u001B]8;;\u001B\\` when `RichTerminalDetector.isOsc8HyperlinkSupported()` is true; else plain `text`.
- Used for: log-file paths in error output (`LINK-001`), the `support@moderne.io` address in the always-appended `Try:` line (`LINK-002`), data-table output paths (`LINK-003`), dashboard URLs post-publish / post-sync (`LINK-004`).
- **Not linked** even when content supports it: repository paths (rendered plain), recipe IDs, Moderne host URLs in `mod config moderne show`, stack-trace source locations.

**Typography:** identical to the underlying text; terminal applies underline/colour per its own preferences.

### Representative inventory entries
`LINK-001` through `LINK-005`, `PRIM-008`, `PRIM-009`.

---

## R. Machine-readable output (CSV / JSON / streaming)

### What it covers
Output explicitly intended to be piped/parsed, not read by a human in a terminal.

### How the CLI currently treats it
Opt-in per command. Driven by either a dedicated flag (`--csv`, `--json`, `--streaming`) or by the caller setting `hasBanner() == false`. When active:
- Start banner suppressed.
- Close banner suppressed.
- Progress bar becomes `NoopProgressBar`.
- Action headers suppressed.
- `convertError` output is still rendered on failure (so CSV / JSON consumers will see free-form text on the failure path — see `D-14`).

**Commands with this mode:** `Study --csv`, `Study --json`, `ListRepositories --json`, `Run --streaming`, `Build --streaming`, `Audit builds list --streaming`.

**Typography:** raw — no colour, no glyphs, no bold, no underline.

### Representative inventory entries
`TAB-007`, `SKEL-004`, `PRIM-007`.

---

## S. Terminal-capability fallbacks

### What it covers
The degraded output shapes emitted when colour / UTF-8 / OSC 8 / TTY are unavailable.

### How the CLI currently treats it
Three independent fallback paths, all decided at class-load / program-start time:

1. **`NO_COLOR` honoured** (`SKEL-001`) — `Ansi.setEnabled(false)`. All colour codes stripped. Glyphs still UTF-8 unless overridden by the UTF-8 detector.
2. **Jenkins env detected** (`SKEL-002`) — colour also suppressed.
3. **UTF-8 not detected** (`Icons.java`) — ASCII glyph set kicks in: `>`, `*`, `!`, `+`, `!`, `>`, `i`. The logo swaps to its ASCII `@`-art variant.
4. **Truecolor not detected** (`ModerneColors.java`) — xterm-256 palette is used instead of RGB.
5. **No TTY / Docker / CI / `CLAUDE_CODE` set** (`SKEL-004`) — progress downgrades to `PlainProgressBar` (10s polling, no animation).
6. **OSC 8 not supported** — `AdvancedLinks.link()` returns the fallback text.
7. **Windows** — `AnsiConsole.systemInstall()` so raw ANSI (incl. OSC 8) is honoured (`SKEL-003`).

**Typography fallback summary:**
- Glyphs: Unicode → ASCII.
- Colour: 24-bit → 256-index → none.
- Animation: per-frame → 10s poll → nothing.

### Representative inventory entries
`SKEL-001` through `SKEL-005`, `PRIM-002`, `PRIM-003`, `PRIM-004`, `PRIM-005`, `PRIM-007`, `PRIM-008`.

---

## T. Exit codes

### What it covers
The integer status returned to the shell.

### How the CLI currently treats it
Three values, set in `StandardCommand.call()`:
- `0` — success (including success-with-warnings).
- `-1` — hard failure.
- `-2` — partial success.

**Not user-visible as text.** Included here because exit codes *are* output (to the shell) and their mapping to categories A/C/D/B is a design decision visible in the emission surfaces.

### Representative inventory entries
`SKEL-005`.

---

## Cross-category observations

- **Colour semantics the codebase has converged on:**
  - Green — success.
  - Red — hard failure.
  - Yellow — anything attention-worthy that is not a hard failure (warning, deprecation, partial success, next-step prefix, STEP glyph inside Try: list).
  - Blue — identifiers (repositories, links).
  - Purple — commands / task IDs.
  - Grey — secondary / supplementary.
- **Glyph semantics the codebase has converged on:**
  - `●` — headers (actions, what-to-do-next, error sections).
  - `▶` — items inside an actionable list (Try: suggestions).
  - `>` — items inside a next-steps list (semantically similar to `▶` but visually distinct).
  - `⚠ ✓ ✗ ℹ` — inline status glyphs inside a single line.
- **Where typography is *missing*:** no shared table framework, no consistent info (blue) treatment, no password-prompt helper, no y/n-confirmation helper, no consistent empty-state convention, no feature-flag runtime indicator (incubation is text-only).
- **The single strongest typographic contract:** the `convertError` template — every hard failure reads identically in structure, which is both an asset (predictability) and a liability (every dead-end error looks identical even though they vary wildly in how recoverable they are).
