# Pattern — Inline command reference

The visual treatment of a command, flag, or path mentioned inside other text. This is one of the most pervasive visual primitives in the system — it appears inside help screens, errors, success forward-chains, hints, notes, and prose almost anywhere.

## When this pattern applies

- The CLI is referencing a runnable command, a flag, or a filesystem path inside flowing text.
- Examples: "Run `mod study --last-recipe-run` to view results.", "Or try: `mod config http trust-store edit system`", "Verify: `mod config recipes artifacts show`", "Add a build config to `/home/user/project`."
- The reference is *typeable* — the user could copy-paste it and it would do something.

## What the user sees

> Inline within prose: Connect to your tenant with `mod config moderne edit <tenant-url>`, then authenticate with `mod config moderne login`.

Rendered:

```
  Connect to your tenant with mod config moderne edit <tenant-url>,
  then authenticate with mod config moderne login.
```

(Imagine `mod config moderne edit` and `mod config moderne login` as cyan; `<tenant-url>` as dim gray.)

## Visual anatomy

| Element | Token | Notes |
| --- | --- | --- |
| Command body | `color.semantic.info` (cyan), regular weight | The command itself — what the user would type literally. |
| Flag | `color.semantic.info` (cyan), regular weight | Same treatment as command body. `--last-recipe-run`, `--password`, `-h`. |
| Filesystem path | `color.semantic.info` (cyan), regular weight | `/home/user/project`, `pom.xml`, `build.gradle`. |
| Placeholder inside a command | `color.text.supporting` (dim) | `<tenant-url>`, `<recipe-name>`, `<path>`. The angle brackets are also dim. The reader can see what to type literally vs. what to substitute. |
| OSC-8 wrapping | When the reference is a hyperlinkable target (file path, URL, support email per `tokens.json $link.linkable_targets`), the cyan text is OSC-8 wrapped. | The CLI does not impose an underline; the terminal's link rendering is honored. |

## Composition rules

- **Cyan, not bold.** Bold is reserved for section headers (which are also ALL CAPS) and banners. Inline references are cyan only. The current CLI's bold-via-picocli-markup pattern (`@|bold mod build|@`) is retired (D-12).
- **Color is the only emphasis.** No backticks, no quotes, no brackets around the reference in the rendered output. The color carries the visual delta from surrounding prose.
- **Placeholders are dim.** When a command reference includes a placeholder (anything in angle brackets), the placeholder is dim gray. This split — cyan-literal vs. dim-substitute — is the system's typography for "this part you type, this part you replace."
- **Long references can wrap.** When a command reference exceeds the terminal width inside flowing prose, it wraps with the rest of the prose. There is no special continuation glyph; the reader follows the cyan color across the wrap.
- **Multi-token references stay together.** `mod config moderne edit` is rendered as a single contiguous cyan run, not four separate cyan tokens. Same for `mod build /path --only-tool gradle`.
- **Prose around the reference uses normal text tokens** (`typography.primary` or `typography.supporting`, depending on context). The cyan reference is the only color shift on the line.

## When this is *not* the right pattern

- For commands offered as **explicit recovery actions** in an error TRY block — those use the `▶ <command>` shape from `error.md`, where the `▶` glyph carries the actionability and the command is on its own line.
- For commands listed as **next-step entries** — those use `WHAT TO DO NEXT` / `NEXT STEP` from `success.md` and `help-command.md`, with em-dash gloss.
- For commands inside an **EXAMPLES block** — those use the `$ ` shell prompt convention from `help-command.md`.

The inline pattern is for the *passing mention inside other content*. When the command is the primary thing being offered, use one of the structured patterns above instead.

## Worked examples

**Derived** — Both artifacts use this pattern pervasively:

- Jayd's `mod run` success frame: "Run `mod study --last-recipe-run` to view results." (forward-chain inside prose).
- Jayd's `mod study` error frame: "The last run produced 0 data tables. The recipe may not emit tables, or the run failed before any were written." — followed by `▶ Run a recipe that emits data first.` + `mod run . --recipe <recipe-name>` (the `▶` block uses the structured pattern; the inline mention of `0 data tables` is plain text, not cyan, because it's a number not a runnable thing).
- Annie's leaf-command help: "Common locations are `/etc/ssl/certs/java/cacerts` (Linux), `/Library/Java/.../cacerts` (macOS), or whatever your platform team distributes via MDM." (path references inside a hint).
- Annie's verify-line pattern: "Verify: `mod config recipes artifacts show`" (close-the-loop verify).

**Derived** — The cyan-not-bold rule comes directly from the journey-map CSS (`.t-cyan` is the class applied to terminal commands; `.t-bold` is separately applied to headers). The PDFs render commands in a distinct color from prose without bolding them.

## Extrapolations

- The handling of *partial* references (e.g., a flag mentioned without its command, like "Pass `--last-recipe-run` to scope to your most recent run") is extrapolated. The artifacts always show flags in the context of their command. The flag-alone treatment uses the same cyan token. → flagged in `gaps.md` Part A.
- The treatment of references to commands the user *cannot run yet* (e.g., a deprecated command mentioned in a "this replaces X" note) is extrapolated. The system would render them in `typography.metadata` (dim gray), but no artifact shows the case. → flagged in `gaps.md` Part A.

## Out of scope (this pattern)

- Whether the framework should validate that every cyan-rendered string is a real command/flag/path — testing concern, not visual. → `gaps.md` Part B.
- The string-authoring policy of when to inline-mention a related command vs. structure it as a `NEXT STEP` block — author judgment, contextual. The visual system codifies the rendering of both; the choice between them is editorial.
- Auto-linking of recipe IDs vs. plain cyan rendering — depends on tenant-side recipe page existence (per `tokens.json $link.linkable_targets`). Detection is behavioral.
