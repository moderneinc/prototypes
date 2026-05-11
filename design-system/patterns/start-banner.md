# Pattern — Start banner

The visual treatment of the screen the user sees when they begin an authenticated session. The "shell within a shell" frame: product identity, session state, and a prompt — rendered in structured terminal-native UI rather than as decorative ASCII art.

## When this pattern applies

- The first screen of an interactive session (`moderne start` or equivalent shell-mode entry).
- Login / authentication confirmation: the user has just signed in and the CLI confirms identity and readiness.
- Re-display when the session is resumed in a way that benefits from a clear "you're here, you're authenticated" frame.

This pattern does **not** apply to:

- Top-level `mod` help — that's the onboarding ladder (`onboarding-sequence.md`).
- Per-command headers — those are `typography.section_header` inside the help screen, not framed.
- Close banners — `MOD SUCCEEDED` / `MOD FAILED` are post-run, single-line, no frame.

## What the user sees

```
─────────────────────────────────────────
/// MODERNE 3.0.1
─────────────────────────────────────────
  User       dev@moderne.io
  Status     Authenticated
─────────────────────────────────────────
Listening for commands...
>
```

## Visual anatomy

| Element | Token | Notes |
| --- | --- | --- |
| Horizontal rule | `typography.metadata` | A row of `─` (or `-` in ASCII mode). Spans the terminal width or a fixed inner width — the line is structural framing, not decoration. |
| Product identifier | `typography.section_header` + `///` prefix | `/// MODERNE 3.0.1`. Bold, ALL CAPS for the product name. The `///` prefix is a directional marker — it reads as "this is the header line of the frame" without needing a glyph. |
| Key/value row label | `typography.supporting` | Left column. `User`, `Status`, and any other session attributes that earn a row. Indented two spaces from the rule. |
| Key/value row value | `typography.primary` (default) or `color.semantic.*` (when stateful) | Right column. Aligned at a fixed column. Authenticated / connected / healthy states use `color.semantic.success`; degraded / warning states use `color.semantic.warning`; failed states use `color.semantic.danger`. |
| Ready line | `typography.primary` | Below the bottom rule, no indent. Single line describing the current state ("Listening for commands...", "Ready.", etc.). |
| Prompt | `glyph.shell_prompt` (`>` or `$`) + `typography.metadata` | Single character + space, on its own line below the ready line. Awaits input. |

## Spacing

- Exactly one blank line between the bottom horizontal rule and the ready line is **not** used — the rule itself provides the separation. Ready line sits directly under the rule.
- Exactly one blank line between the ready line and the prompt.
- No leading or trailing blank lines around the frame as a whole — the frame anchors the top of the session.

## Composition rules

- **No ASCII art.** The product is identified by typography and framing, not by a rendered logo. Box-drawing characters are used only for the structural rules — never to compose a glyph or letterform. This is the rule that supersedes the previous start-banner shape (which used UTF-8 box-drawing for a stylized logo and `@-art` as a non-UTF-8 fallback). The terminal is the brand; the framing is the visual statement.
- **The frame is three rules deep.** Top rule, identifier band, middle rule, info band, bottom rule. The two bands inside carry content; the three rules carry structure. Adding more rules dilutes the framing; removing any breaks the "shell within shell" effect.
- **Info rows are session attributes, not navigation.** What goes between the middle and bottom rules describes *who you are and where you stand* — identity, environment, connection state, version of something the session depends on. It does not describe what you can do (that belongs in help) or what just happened (that belongs in close banners).
- **Values that have state use semantic color; values that are just facts don't.** `dev@moderne.io` is a fact, rendered in `typography.primary`. `Authenticated` is a state, rendered in `color.semantic.success`. If a row's value could ever be in a non-OK state (`Status: Disconnected`, `Tenant: Unreachable`), the value column carries the semantic color; otherwise it stays neutral.
- **The `///` prefix is reserved for this pattern.** Don't reuse it as a generic sectionizer. Section headers elsewhere use `typography.section_header` directly (or `glyph.section_marker ●` when they carry danger).

## Worked examples

**Derived from the structured-UI start banner concept** — replaces the previous ASCII / box-drawing logo. The example above is the rendered shape; the screenshot in `.context/attachments/Screenshot 2026-05-11 at 2.50.26 PM.png` is the visual reference.

## Extrapolations

- **The exact set of info rows.** `User` and `Status` are the minimum. `Tenant`, `Environment`, `Version of <thing>`, etc. are plausible additions; the artifacts only show the two-row minimum. → flagged in `gaps.md` Part A only if a real session needs more rows than the pattern accommodates.
- **The "Listening for commands..." line wording** is illustrative. The actual phrasing should match the CLI's existing voice rules (`voice.md`). The pattern requires *a* ready line; it doesn't dictate the words.

## Out of scope (this pattern)

- The product decision about *whether* `moderne start` (or equivalent) is the entry point — IA / product, not visual.
- How the session is exited (`Ctrl-D`, `exit`, idle timeout, etc.) — interaction design, behavioral.
- Whether the frame should redraw on terminal resize — terminal-rendering concern, not visual treatment.
