# CLI Findings — bugs, dead code, broken output observed during the audit

> Logged only, not fixed. The audit is strictly read-only on the `moderne-cli` repo (per Phase-1 scope). Entries below describe defects observed in the current CLI; decisions about whether/how to fix them belong to a later CLI engineering effort, not to Construct.
>
> Each entry: **F-N** handle, a one-line summary, observed behaviour, code ref, and severity.

---

## F-01 — Warnings set via `setWarning(...)` are silently swallowed in machine-readable mode

**Observed:** Callers (`ListRepositories.java:105`, `config/moderne/Moderne.java:203,374`, `config/license/moderne/Moderne.java:59`, `git/Checkout.java:150`) stash a non-fatal warning via `setWarning(Throwable)` and continue. At `StandardCommand.java:176-181`, the warning is only rendered inside `if (hasBanner()) { ... }`.

In the `--csv` / `--json` / `--streaming` paths (where `hasBanner()` is overridden to `false`), the warning is set on the field but never printed, never logged, and the exit code is still `0`. The caller gets no signal that the condition fired.

**Code ref:** `StandardCommand.java:176-181` (render branch) vs `StandardCommand.java:68-69` (field) vs `StandardCommand.java:395-401` (setter).

**Severity:** medium. Machine consumers in `--csv`/`--json` mode lose warning information with no indicator. The call sites that rely on this behaviour (e.g. partial partition listing) effectively emit success-only output in machine modes while emitting success-with-warnings output in interactive mode.

**Related:** D-14 (machine-readable mode error suppression is incomplete), D-11 (`setWarning` API has ambiguous lifecycle).

---

## F-02 — `@Deprecated` on `setWarning` is misleading

**Observed:** `StandardCommand.java:394-401` marks `setWarning` as `@Deprecated` with Javadoc `"Throw an exception instead."`. But `setWarning` is the only mechanism for the `MOD SUCCEEDED WITH WARNINGS` state, and all five live callers have a legitimate need to continue execution after the warning (listing remaining partitions, finishing the config flow, etc.). "Throw an exception instead" would change exit code from `0` → `-1` / `-2` and abort early, which is not what any caller wants.

Either the deprecation is wrong and should be removed, or an actual replacement API should be introduced and the callers migrated.

**Code ref:** `StandardCommand.java:394-401`; callers listed in F-01.

**Severity:** low. Correctness-adjacent — no user impact, but the API is self-contradictory and new contributors will be confused about which path to use.

---

## F-03 — Picocli markup embedded in `CommandException` message is rendered literally

**Observed:** `RecipeRunFilter.java:112-114` constructs:

```java
throw new CommandException("Unable to find the search run to use for this command. " +
                           "Please specify a search run with --search-run or --last-search, " +
                           "or run @|bold mod search|@ first.");
```

`convertError` at `StandardCommand.java:309` appends `t.getMessage()` raw, without running it through `ansi().render(...)`. The resulting `What went wrong:` section will display the literal substring `@|bold mod search|@` instead of a bolded `mod search`. Only `fixSuggestions` (which go through `ansi().render(...)` at line 356) honour picocli markup.

Same footgun exists at any CommandException throw site where an author thought to bold an inline command hint inside the `message` (only one confirmed instance, but the API invites more).

**Code ref:** `RecipeRunFilter.java:112-114` (offender); `StandardCommand.java:309` (rendering); `CommandException.java:26-37` (two constructors, only one pre-renders via `Ansi.toString()`).

**Severity:** low. User-visible cosmetic defect: markup leaks into error output on a known path. The correct API — pass an `Ansi` object to the `CommandException(Ansi, ...)` constructor — exists but isn't used here.

---

## F-04 — "Report to support@moderne.io" is appended to every failure, including user errors

**Observed:** `StandardCommand.java:342` unconditionally appends `"Report to support@moderne.io"` as the final `Try:` bullet on every failure rendered through `convertError`. This fires for:

- User-side typos (`"Recipe not found: com.foo.Bar"`).
- Configuration that the user can fix (`"No artifact store configured"`).
- Environmental problems (`"maven not found on PATH"`).
- Genuine internal errors (`NullPointerException`).

In the first three categories, support cannot help the user and shouldn't be offered as a next step. Users reporting typos is a measurable support-load burden.

**Code ref:** `StandardCommand.java:342`.

**Severity:** medium. This is the single most-emitted defect-flavoured line in the CLI (fires on every failure). Any fix should likely gate the line on "zero actionable `.suggest()` calls present" or on some classification flag on `CommandException`.

**Related:** D-10 ("hard-coded support footer"), D-02 (dead-end vs actionable errors). Resolving this together with D-02 addresses a substantial fraction of the perceived "error quality" problem motivating the design brief.

---

## F-05 — Action headers and "what to do next" are dropped silently in machine-readable mode

**Observed:** `printAction` (`StandardCommand.java:111-120`) and `suggestNextSteps` (`StandardCommand.java:122-134`) both early-return when `!hasBanner()`. In `--csv` / `--json` / `--streaming` mode, commands that call these methods produce no indication of phase boundaries or follow-up guidance.

This is arguably intentional (machine-parseable streams shouldn't contain decorative content). But it's not documented anywhere that `printAction` is a no-op under those modes, and authors adding action headers may be surprised.

**Code ref:** `StandardCommand.java:111-120`, `StandardCommand.java:122-134`.

**Severity:** low. Design-decision adjacent rather than a bug. Listed so Phase 2 knows both methods are auto-suppressed by the same condition that controls banners (i.e. machine-mode parity across four surfaces is already partly wired, just not documented).

---

## F-06 — `Study.java --csv` / `--json` option descriptions lack terminal punctuation

**Observed:** `Study.java:70` declares `description = "Output in CSV format"` — no period. Elsewhere in the same file, `description = "Output in JSON format"` same pattern. Most options in other commands terminate with a period (e.g. `"Display this help message."` at `StandardCommand.java:77`).

**Code ref:** `Study.java:70` and adjacent option declarations.

**Severity:** very low. Cosmetic; flagged because it's emblematic of the absence of a documented punctuation rule across option `description` values (see D-08 if Phase 2 wants to codify one).

---

## F-07 — `@Deprecated` in `siblingCmd` / `hasSibling` not enforced consistently (suspected dead code)

**Observed:** `StandardCommand.hasSibling` and `siblingCmd` (`StandardCommand.java:403-409`) are helpers for a pattern where a subcommand suggests a sibling. A grep across `mod/` shows only a couple of callers (none inside `Mod.java` or the root help path). Some subcommands that *could* benefit (e.g. `git/Checkout` suggesting `git/clone`) don't use them and instead hand-assemble command strings.

Not obviously dead code, but possibly under-used vs intent.

**Code ref:** `StandardCommand.java:403-409`.

**Severity:** very low. Inform-only. Phase 2 should confirm with a CLI author whether this helper is deprecated-in-spirit before relying on it in new design-system patterns.

---

## F-08 — End-of-run banner spacing asymmetry

**Observed:** `StandardCommand.java:193` emits `MOD SUCCEEDED` with a leading `\n`. `StandardCommand.java:218` emits `MOD PARTIALLY SUCCEEDED` similarly. But `StandardCommand.java:219` emits `MOD FAILED` with the same leading `\n`. All three close banners share the leading blank line (consistent), but the failure path additionally prints the `FAILURE: ...` pre-banner at `StandardCommand.java:215` with its own trailing newline — producing two blank lines before `● Where:` on failure runs and one blank line before `MOD FAILED`.

Visual inspection shows this as a visible asymmetry between success and failure runs (failure runs have more vertical whitespace).

**Code ref:** `StandardCommand.java:213-222`.

**Severity:** very low. Cosmetic spacing. Listed so Phase 2 knows the asymmetry is in the framework layer, not the subcommand layer.

---

## F-09 — `convertError` emits `Where:` twice for some non-CommandException throwables when stack-trace message is long

**Observed:** For a plain `Throwable` (not a `CommandException`), `convertError` prints:

1. `● Where:` with the sanitized stack trace (`StandardCommand.java:315-316`).
2. A blank line.
3. `● What went wrong:` with the message — but **only if** the message is ≤ 3 lines; otherwise the block prints `"See the stack trace above"` (`StandardCommand.java:318-327`).

For `CommandException`, the equivalent "stack above" fallback doesn't exist — `convertError` always prints the full `getMessage()` content. So the formatting contract is different between the two throwable classes.

**Code ref:** `StandardCommand.java:259-328`.

**Severity:** low. Behaviour-visible inconsistency; not a bug in either branch, but the asymmetry means two throwables with the same message content render differently depending on which class carries them.

---

## F-10 — SSL diagnostics block always runs on every error path

**Observed:** `convertError` unconditionally calls `SslDiagnostics.generateReport(original)` on every error, regardless of whether the underlying exception is SSL-related (`StandardCommand.java:268-273`). The result is only emitted when present (line 331), so the user-visible output is correct — but the diagnostic code runs (and could be expensive) on every failure.

**Code ref:** `StandardCommand.java:268-273`.

**Severity:** very low. Performance nit on the error path. Caught by the `try/catch (Exception _)` so it can't cascade, but it's also not gated on "is this plausibly an SSL failure?".

---

## F-11 — `drawBanner` uses `System.out.println` directly rather than the spec's `out`

**Observed:** `drawBanner` (`StandardCommand.java:235-252`) prints to `System.out` directly. Every other surface goes through `spec.commandLine().getOut()`. If a test or an embedding context replaces the picocli output stream, the banner won't be redirected with the rest of the output.

**Code ref:** `StandardCommand.java:249,251`.

**Severity:** very low. Observable only under test-embedding scenarios; no interactive-user impact.

---

## Excluded from this findings list

Per the Phase-1 brief, the audit excludes:

- **Taxonomy drift** (same semantic state expressed different ways) — belongs in `cli-deltas.md`.
- **Style inconsistency that isn't obviously wrong** — belongs in `cli-categorized.md` per-category notes.
- **Fix recommendations** — every finding above is observation-only. Phase 2 (and beyond) decides what to do.

The counts of throw sites, banner variants, progress-bar implementations, etc. are in the inventory and categorized files and are not duplicated here.
