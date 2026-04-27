# Pattern — Leaf-command help

The visual treatment of help for a command that does work — i.e., a command the user actually invokes to perform an action. Examples: `mod build -h`, `mod run -h`, `mod config http trust-store edit file -h`.

## When this pattern applies

- A command that runs logic itself (not pure delegation to subcommands).
- The user wants to know what the command does, what flags it takes, and how to invoke it.

## What the user sees

```
Configure the SSL trust store mod uses for HTTPS connections.

Without it, commands fail with PKIX path building errors when
connecting to your tenant or artifact repos.

USAGE
  mod config http trust-store edit file <path> [flags]

  ? Hint: Common locations are /etc/ssl/certs/java/cacerts (Linux),
    /Library/Java/.../cacerts (macOS), or whatever your platform team
    distributes via MDM.

FLAGS
  --password <password>   Trust store password. Often changeit.

  Authentication (pick one):
    --token <token>       Use a CI-friendly token.
    --user <user>         Use username + interactive password prompt.

EXAMPLES
  $ mod config http trust-store edit file /etc/pki/java/corp-truststore.jks \
      --password ****

  $ mod config http trust-store edit file /Library/Java/.../cacerts \
      --token ****

NEXT STEP
  Verify the trust store loaded:
    mod config http trust-store show

LEARN MORE
  Docs: https://docs.moderne.io/cli/config/http
```

## Visual anatomy

| Element | Token | Notes |
| --- | --- | --- |
| One-line summary | `typography.supporting` | First line. Sentence-case, period. |
| Consequence prose | `typography.supporting` | Two to three lines. Concrete: names the failure mode the user will hit if they skip this. |
| `USAGE` | `typography.section_header` + `typography.primary` | Placeholder names (`<path>`) in `typography.supporting`. |
| `? Hint:` block | `glyph.hint_marker` (`?`, yellow) + leading word `Hint:` (yellow) + `typography.primary` body | Sits inside the `USAGE` section, indented 2 more spaces than the usage line. Used for "where would I find this" anticipated questions. |
| `FLAGS` | `typography.section_header` | `--flag-name` in `typography.primary`; description in `typography.supporting`; default-value cue (e.g. "Often `changeit`.") in `typography.primary` body color. |
| Flag groupings | `typography.primary` (sub-header text) + 2-space additional indent for grouped flags | The "Authentication (pick one):" sub-header is sentence-case, body weight, no glyph. It marks an exclusive-choice subset within `FLAGS`. |
| `EXAMPLES` | `typography.section_header` + `glyph.shell_prompt` (`$`, dim) + `color.semantic.info` for the command body | Each example begins with a dim `$ `. Continuation lines (after `\`) are indented 4 spaces from the prompt position. Sensitive values are masked (`****`) but not omitted. |
| `NEXT STEP` | `typography.section_header` + `typography.supporting` (gloss) + `color.semantic.info` (verify command) | Verify-line pattern — the `show` partner of the configure verb. |
| `LEARN MORE` | `color.semantic.info` link | Cyan; OSC-8 if supported. |

## Spacing

- Summary → consequence prose: no blank line.
- Consequence prose → `USAGE`: one blank line.
- `USAGE` → `? Hint:` (when present): one blank line.
- Section to section: one blank line.
- Within `FLAGS`: flag rows are stacked; a flag grouping (sub-header) is preceded by one blank line.
- Within `EXAMPLES`: examples are separated by one blank line; continuation lines within an example have no blank line.
- Within `NEXT STEP`: the gloss line and the runnable command are stacked with no blank line between them.

## Composition rules

- The summary + consequence prose pair is mandatory. The summary says what the command does; the consequence prose says what happens if the user doesn't run it. This pair is the "explanatory density" promise — see `rationale.md`.
- `? Hint:` is optional but encouraged when the command's first argument is something the user is likely to need help locating (a file path, an artifact URL, a tenant URL).
- `FLAGS` order: ungrouped flags first, then grouped sub-blocks. Within a sub-block, the most common choice goes first.
- `EXAMPLES` always uses real values (real-shaped paths, real product names like `changeit`), not placeholder shapes like `<path>` or `<password>`. Placeholders go in `USAGE`; real values go in `EXAMPLES`.
- `NEXT STEP` is the verify-line pattern when the command writes state (every `edit` / `add` has a `show` partner). When no verify partner exists, the block is omitted.
- `LEARN MORE` is a docs URL and (when applicable) a pointer to a related help screen. It's the last block.

## Worked examples

**Derived** — Annie's `cli-help-text-rewrites.pdf` redesigns the leaf-command help for `mod config http trust-store edit file`, `mod config recipes artifacts artifactory add`, `mod config lsts artifacts artifactory add`, `mod config build maven settings edit`, and `mod config moderne edit`. The example above renders the trust-store edit screen in this system's tokens.

**Extrapolated** — Leaf-command help for `mod build`, `mod study`, `mod run`, etc. (the action commands, not the configuration commands) is not redesigned in the artifacts. The pattern as defined here applies to them by extrapolation. → flagged in `gaps.md` Part A.

## Out of scope (this pattern)

- Whether the consequence-prose paragraph is mandatory in code (a per-command authoring rule) — author guidance, not visual.
- Whether the verify-line `NEXT STEP` should be auto-generated from the `show` partner's existence — framework engineering. → `gaps.md` Part B.
- Whether `EXAMPLES` should ever be machine-validated against real CLI behavior — testing concern. → `gaps.md` Part B.
