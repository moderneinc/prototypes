# Intended Direction

A synthesis of the implicit visual system proposed by the UX team's Phase-1 artifacts in `context/`, articulated on its own terms — before reconciliation against current CLI reality.

## Sources

- `context/cli-help-text-rewrites.pdf` — Annie Rimbach. Current-vs-proposed help text across ten CLI surfaces (top-level `mod`, `mod config -h`, four config-subcommand help screens, one wrong-command-path bug, three setup-flow help screens). Primer-aligned, "string changes only."
- `context/error-states-ui-uplift.pdf` — Jayd Jackson. Current-vs-proposed error messages across five core workflow commands (`run`, `build`, `study`, `git sync`, `search`). Companion to Annie's "Quick Wins." Strings only.
- `context/cli-help-text-journey-map.partial.html` — Annie Rimbach. Interactive journey map (truncated in source). Provides the styling-system reference: CSS color tokens, terminal-class names (`.t-cyan`, `.t-header`, etc.), and a "Verified Command Paths" table illustrating correct vs deprecated routing.

The artifacts share a stated reference: GitHub's Primer CLI Design Guidelines.

## What this system is for

The artifacts are tuned for **explanatory density**: more text on screen, more concrete hints, more inlined next-step commands than the current CLI provides. The implied user is an enterprise developer onboarding intermittently — not a power-user driving the CLI by muscle memory. "Time-to-understanding" reads as the dominant metric over "time-to-keystroke."

This shapes every decision below.

## Section headers

Both authors structure output into named, ALL-CAPS sections.

Help screens (Annie):

- `USAGE`
- `GET STARTED`
- `CONFIGURE YOUR ENVIRONMENT`
- `SETUP`, `AUTO-CONFIGURED`, `OPTIONAL` — used in `mod config -h` to triage subcommands by user-facing role
- `RUN RECIPES`
- `ARGUMENTS`
- `FLAGS` (preferred over the current CLI's `Options:`)
- `EXAMPLES`
- `NEXT STEP`
- `LEARN MORE`

Error frames (Jayd):

- `WHAT WENT WRONG`
- `TRY`

Treatment is consistent across both authors:

- ALL-CAPS, weight 700, slight letter-spacing (`0.02em` per the journey-map CSS).
- One blank line between sections.
- Bullet `●` (filled circle) prefixes major sections in error frames; help sections sit flush-left without a bullet.
- Sections nest content with a 2-space indent.

Annie's pattern is to **rename `Options:` to `FLAGS`** consistently. Jayd's pattern is to **rename `What went wrong:` / `Try:`** to bold ALL-CAPS variants and group recovery actions under `TRY`.

## Glyph inventory

| Glyph | Meaning | Used by |
| --- | --- | --- |
| `●` | Section / status marker. Color carries semantic. | Both |
| `✓` | Success indicator (green). | Both |
| `⚠` / `△` | Warning (yellow). The journey map CSS shows triangle styling; Jayd uses `⚠` in the search frame. | Jayd |
| `▶` | Actionable next-step or recovery bullet. Always paired with a runnable command or imperative verb. | Both |
| `└` | Sub-description / child item under a numbered step. | Annie (top-level `mod`) |
| `?` | Hint marker (yellow). Inline below the section it qualifies. | Both |
| `!` | Note / caution / inline-error marker. Yellow for `! Note:`, red for `! Error:`. | Both |
| `$` | Shell prompt (dim). Precedes example commands. | Both |

Glyphs do double duty: they prefix the line **and** their color encodes the semantic of that line. There is no glyph-without-color and no color-without-glyph in the artifacts — the two channels reinforce each other.

## Color semantics

Drawn from the journey-map CSS terminal classes, which the PDFs render in print but are clearly the source colors.

| Role | Hex | Class | Where it appears |
| --- | --- | --- | --- |
| Background — page | `#0F172A` | (body) | Outer frame in mockups |
| Background — terminal | `#020617` | (terminal) | Code-block background |
| Border / panel chrome | `#334155` | (border) | Box outlines |
| Text — primary / bold | `#f8fafc` | `t-bold`, `t-header` | Section headers, banners |
| Text — body | `#e2e8f0` | `t-white` | Default body text |
| Text — supporting | `#94a3b8` | `t-dim` | Descriptions, prose under headers |
| Text — metadata / fallback | `#64748b` | `t-gray` | Footer, demoted support line, gutter |
| Cyan | `#67e8f9` | `t-cyan` | Runnable commands, links, "verify" cues |
| Green | `#4ade80` | `t-green` | Success state, numbered onboarding steps, success banner text |
| Red | `#f87171` | `t-red` | Errors, FAILURE banner, `! Error:` |
| Yellow | `#fbbf24` | `t-yellow` | `? Hint:`, `! Note:`, warning markers |

Colors are used **semantically, not decoratively**. Cyan never appears on prose; it only appears on commands the user could type or paths they could click. Green never appears on a non-success state. Red is reserved for failure or error-correction guidance. Yellow tags advisory inline content (hints, notes, warnings).

The "demoted" treatment for fallback content — most visibly the `support@moderne.io` line in error TRY blocks — uses `t-gray` (`#64748b`). It stays visible but recedes; users see it last.

## Typography roles

The artifacts imply four roles, distinguishable by weight and color:

1. **Section header** — bold, white, ALL CAPS, slight letter-spacing. Used for `USAGE`, `WHAT WENT WRONG`, etc.
2. **Primary** — body weight, light slate (`#e2e8f0`). Default reading text. Banner lines like `Moderne CLI 4.1.6` are bold-white in this role.
3. **Supporting** — body weight, dim slate (`#94a3b8`). Descriptions, glosses, paragraph prose under headers.
4. **Metadata / demoted** — body weight, gray (`#64748b`). Footers, the "Still stuck? Report to support" line, the `$` prompt.

Monospace is used everywhere inside terminal frames; the journey-map's `.mono` class names San-Serif fallbacks (`SF Mono`, `Fira Code`, `Menlo`, `Consolas`) for surrounding chrome.

## Spacing

Vertical rhythm is consistent across both authors:

- Section header → one line of leading prose (optional) → one blank line → indented section body.
- Two-space indent inside a section.
- Four- or six-space indent for nested examples within a section (Annie's authentication-flag groupings, Jayd's `mod build <path> --only-tool gradle` continuation).
- Single blank line between sections; no blank line between a section header and its first content line.
- Banners (`MOD FAILED in (2s)`) appear flush-left, separated from the body by a blank line.

## Help text anatomy

The proposed help screen is a sequence of named sections. Order is not arbitrary — it tracks user attention from "what is this" to "what next."

Top-level command (`mod` with no args):

1. Banner — name + version, then a one-line tagline.
2. `USAGE` — abstracted invocation pattern.
3. Workflow sections — `GET STARTED`, `CONFIGURE YOUR ENVIRONMENT`, `RUN RECIPES`, presented as numbered onboarding (see *Onboarding sequence* below).
4. `FLAGS` — global flags only.
5. `LEARN MORE` — link to the docs site, plus a hint that `<command> -h` exists.

Subcommand listing (`mod config -h`):

1. One-line description.
2. `USAGE`.
3. **Triaged groups** — `SETUP (required)`, `AUTO-CONFIGURED`, `OPTIONAL`. Each lists subcommands grouped by user role rather than alphabetically.
4. `LEARN MORE` — pointer to a fuller listing (`mod config -h --all`).

Leaf-command help (e.g. `mod config http trust-store edit file -h`):

1. One-line summary.
2. Two-to-three-line elaboration of consequence ("Without it, commands fail with PKIX path building errors.").
3. `USAGE` — invocation with placeholders.
4. `? Hint:` block — anticipated user question with a concrete answer (e.g., common file paths, where to ask).
5. `FLAGS` — flags grouped if related (e.g., authentication: pick one).
6. `EXAMPLES` — at least one real, runnable command with real-shaped values.
7. `NEXT STEP` (where applicable) — what command to run after this one succeeds.
8. `LEARN MORE` — pointer to a `show` verb to verify what was set.

## Error anatomy — full template

Used for runtime exceptions (Jayd's `build`, `study`, `git sync` cards):

```
FAILURE: mod failed with an exception            ← red banner, top

● WHAT WENT WRONG                                  ← red bullet, white header
  <one-line statement of the problem>              ← supporting text

  ? Hint: <likely cause(s) or anticipated          ← yellow inline, optional
    follow-up question, with a concrete answer>

● TRY                                              ← red bullet, white header
  ▶ <recovery action 1>                            ← supporting text + cyan command
      <inlined command>
  ▶ <recovery action 2>
      <inlined command>
  ▶ Still stuck? Report to support@moderne.io     ← demoted to gray

MOD FAILED in (Xs)                                 ← red banner, bottom
```

Key properties:

- The structure is **stable**. Every full-template error has the same five-element shape: opening banner, WHAT WENT WRONG, optional Hint, TRY, closing banner.
- The hint **acknowledges ambiguity** when the CLI can't tell distinct causes apart ("A few things can cause this — ..."). It does not commit to a single root cause it can't verify.
- Recovery actions are **ordered most-likely-to-help-first**. Support is the demoted last option, never the lead.
- Each `▶` line pairs an action verb with a concrete pasteable command on the next line.
- Banner color (`MOD FAILED`) matches the failure color (red). For partial success (Jayd's `mod search` card), the banner reads `MOD PARTIALLY SUCCEEDED` in yellow; the underlying message is sharpened but the banner classification is preserved.

## Error anatomy — inline / usage variant

Annie's wrong-command-path frame (mod-rewrites card 7) shows a different shape, used for usage-class errors that aren't full runtime exceptions:

```
! Error: <terse statement that the input was wrong>     ← red inline

  Did you mean:                                          ← cyan command
    <suggested correct command>

  Available commands for <parent>:                       ← supporting prose
    <subcommand>  — <short description>
    <subcommand>  — <short description>
```

No `FAILURE:` banner, no `MOD FAILED` banner, no four-section template. The diagnosis is quick, the correction is offered, the alternatives are listed. This is appropriate for *the input is malformed* errors — distinct from *something failed during execution* errors.

The two authors did not coordinate this distinction explicitly, but their two frames imply a two-tier error treatment: **lightweight inline for usage errors, full template for runtime failures.**

## Onboarding sequence (top-level `mod`)

Annie's proposed top-level help is a numbered onboarding ladder:

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

Anatomy:

- Three named groups, separated by a blank line and an ALL-CAPS header.
- Numbers are **green** and continuous across groups (1–9), not restarted per group. The numbering carries the "do these in order" semantic.
- Each step is a single line: `<number>. <command-in-cyan>`.
- A child line beneath each step uses the `└` corner glyph and dim text to describe what the step does.
- One group has a leading hint line ("Get these values from your platform team or admin:") in dim text — provides resourcing context without breaking the numbered sequence.

This is a distinct visual pattern from a generic command listing. It sequences setup as a path, not a menu.

## Inline command reference

Embedded throughout: when the prose names a command, the command is rendered in cyan and is exact-typeable. Examples:

- "Run `mod study --last-recipe-run` to view results." (success forward-chain)
- "Or try: `mod config http trust-store edit system`" (alternate path inside a hint)
- "Verify: `mod config recipes artifacts show`" (close-the-loop verify line)
- "  mod build <path> --only-tool gradle" (recovery command in error TRY block)

Convention: command itself is `t-cyan` (`#67e8f9`). Placeholders within the command (`<path>`, `<recipe-name>`, `<tenant-url>`) appear in the dim color (`#94a3b8`). The reader can see what to type literally vs. what to substitute.

## Forward-chain pattern

Jayd's `mod run` frame is the canonical example: after success, the CLI offers **multiple** common next steps rather than one.

```
WHAT TO DO NEXT
  ▶ mod study --last-recipe-run        — View results by repo.
  ▶ mod git commit --last-recipe-run   — Commit changes across repos.
  ▶ mod git push --last-recipe-run     — Push to remotes.
```

Each row is a `▶` glyph + cyan command + an em-dash + a one-line gloss describing the outcome. The list is short (two to four entries) and concrete; it is not a tutorial.

The same shape recurs in help screens as `NEXT STEP` blocks (e.g., `mod config moderne edit` → "Log in: `mod config moderne login`"). It is the system's primary mechanism for keeping users in motion across multi-step workflows.

## Verify pattern

Almost every leaf-command help screen ends with a `LEARN MORE` block whose anchor is a corresponding `show` command:

- `mod config http trust-store show`
- `mod config recipes artifacts show`
- `mod config lsts artifacts show`
- `...maven settings show`
- `mod config moderne show`

The pattern: configured → verify what got set. This is a soft contract that every `edit` / `add` command has a `show` partner. The system surfaces the `show` partner so users don't have to remember the syntax.

## Examples convention

- `EXAMPLES` block uses real values, not placeholder shapes — `https://app.moderne.io`, `/etc/pki/java/corp-truststore.jks`, `--password changeit`.
- Each example begins with the `$ ` prompt in dim color.
- When a command wraps, the continuation is indented under the first line.
- Where multiple modes apply, examples are labeled (Annie's login: `Browser flow:` and `Token flow (CI):`).
- Sensitive values are masked (`****`) but not omitted — preserves the shape of the command.

## Hint and Note convention

Two distinct inline tags, both yellow:

- `? Hint:` — answers a question the user is likely to be asking right now. Used heavily for "where do I find X" questions (path of trust store, URL of artifact repo, default Maven settings location).
- `! Note:` — surfaces a constraint or caveat the user needs to know but might miss. Used for "needs read AND write access" (LST repo) and "this replaces your current local recipes" (sync).

The convention: `Hint` answers, `Note` warns. They appear inline immediately under the line that motivates them, not in a separate "tips" section.

## Voice

Common across both authors:

- **Direct and second-person.** "Connect to your Moderne tenant." "Configure where the CLI stores LSTs."
- **Action-oriented imperatives.** "Run...", "Add...", "Refresh...", "Point the CLI at...".
- **Concrete over abstract.** Annie replaces "the password used to access the truststore" with "Often `changeit`." Jayd replaces "or that the recipe produced results" with "The last run produced **0** data tables."
- **No blame, ambiguity acknowledged.** Jayd's `git sync` hint says "A few things can cause this — the org name may not match, your login may have expired, or the CLI may not be reaching Moderne right now." It does not assert a cause it cannot verify.
- **Lower density of jargon, higher density of named things.** Concrete file names (`pom.xml`, `build.gradle`, `setup.py`), concrete URL shapes, concrete error phrases (`PKIX path building errors`).
- **Removed: filler prose.** "Configures the artifact repository to resolve recipes from. All subsequent recipe installation commands will use this." → "Connect to your artifact repo for recipes."

The prose **shrinks** at the line level (every line is shorter) but **expands** at the screen level (more sections, more hints, more examples). The proposed surfaces are net longer than current ones, but each individual line is denser and more directly useful.

## What is consistent across the two authors

- Section headers in ALL CAPS with weight 700.
- Cyan for commands, green for success, red for error, yellow for hints/notes/warnings, gray for demoted/metadata.
- `▶` for actionable bullets in both error recovery and success forward-chain.
- `? Hint:` / `! Note:` inline tags.
- Forward-chaining: every screen points the user to a useful next thing.
- Concrete examples and real values.
- Demotion (rather than removal) of escalation paths — support stays present, but at the bottom and in gray.
- Both adopt Primer CLI Design Guidelines as the reference frame.

## Where the authors diverge

- **Two error tiers.** Annie's wrong-command-path frame is compact, with no `FAILURE:` / `MOD FAILED` banners. Jayd's runtime errors use the full five-element template with banners. Neither author explicitly distinguishes the two, but their cards together imply a usage-error vs. runtime-error split. The visual system needs to codify this distinction.
- **Numbered vs. listed steps.** Annie's top-level `mod` uses a continuous-numbered onboarding ladder (1–9). Jayd's success forward-chain uses an unnumbered `▶` list. Both are valid; the system needs to say when each applies.
- **`mod config -h` triage groups.** Annie introduces user-role groupings (`SETUP (required)`, `AUTO-CONFIGURED`, `OPTIONAL`) that don't appear elsewhere. This is a specific pattern for the config-listing surface; whether it generalizes (e.g., to `mod -h --all`) isn't shown.
- **Verify-line wording.** Annie sometimes writes `Verify: <command>`, sometimes truncates to `...settings show`. Treatment isn't fully uniform.
- **Note severity color.** Annie's `! Note:` is yellow ("Note: Needs read AND write access"). Jayd uses `! Error:` in red for command-not-found. Same `!` glyph, different color/severity. The system should specify when `!` is yellow vs red.

## Gaps the artifacts do not address (visual layer only)

These are visual surfaces the artifacts proposed visual treatment for, where the proposals are partial or absent. They are not behavioral questions (those go to `gaps.md` Part B in step 7), only places where the intended visual system is incomplete.

- **Progress indicators.** Both PDFs show `●` followed by a present-tense verb (`● Loading recipe`, `● Searching 47 repositories`) but neither shows a spinner, percentage, ETA, or completion marker beyond the `✓` glyph. Whether progress is animated or static, single-line or multi-line, isn't specified.
- **Tables.** The journey map's "Verified Command Paths" table is the only tabular treatment shown. It's HTML, not terminal output. How tabular data renders in the CLI proper isn't proposed.
- **Banners (success / partial success).** `MOD SUCCEEDED in (3m 24s)` and `MOD PARTIALLY SUCCEEDED in (3s)` appear once each. Their colors aren't explicitly named in the journey-map CSS terminal classes — green and yellow are inferred from context.
- **Prompts / interactive input.** No artifact shows a `?` prompt for user input mid-command. Whether the existing CLI's prompt style is kept, replaced, or styled differently isn't addressed.
- **Long output / pagination.** Annie's `mod config -h --all` is referenced but not rendered. Whether long lists scroll, paginate, or get categorized isn't shown.
- **Banners on non-failure exit.** The current CLI emits `MOD SUCCEEDED in (Xs)`. The intended direction keeps it (Jayd's `mod run` frame), but the visual treatment of zero-result success vs. modified-output success isn't differentiated visually beyond text.
- **Color in non-color terminals.** All artifacts assume color rendering. The system needs a position on `NO_COLOR` / dumb terminals — whether glyphs alone carry the semantic, or fallback prefixes (`[ERROR]`, `[OK]`) appear.

## Summary — the implicit visual system

Reading the artifacts as a coherent proposal, the intended visual system is:

- **Sectioned**: every screen is a sequence of named ALL-CAPS blocks.
- **Glyph-and-color-paired**: semantic markers (`●`, `▶`, `✓`, `?`, `!`) always carry a color that reinforces meaning.
- **Forward-chained**: every screen points outward to one or more concrete next commands.
- **Verify-loop closed**: every configuration verb has a paired `show` verb surfaced in `LEARN MORE`.
- **Voiced for the intermittent expert**: dense in concrete answers, light in jargon, ambiguity acknowledged when present.
- **Tiered for severity**: usage errors get a compact inline treatment; runtime failures get the full five-element template; partial success gets sharpened text inside the existing yellow banner.
- **Demotion over deletion**: escalation paths (support email, deprecated flags) stay visible but recede in gray.
- **Tuned for time-to-understanding**: more text on screen than the current CLI shows, in service of fewer round-trips to docs and Slack.

This is the direction. Step 2 reconciles it against the audit (current CLI reality) before any tokens, patterns, or rationale are codified.
