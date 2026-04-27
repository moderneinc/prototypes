# Pattern — Top-level help (`mod`)

The visual treatment of `mod` invoked with no arguments — the screen the user sees first.

## When this pattern applies

- `mod` with no subcommand and no flags.
- (Not `mod -h` for individual commands — that's `help-command.md`.)
- (Not `mod <group> -h` for subcommand listings — that's `help-subcommand.md`.)

## What the user sees

```
   ▄█▀█▀█▀█▀█▀█▀█▀█▀█▀█▀█▄
   ▀█▄ M O D E R N E   C L I ▄█▀
   ▀█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█▀

   Moderne CLI 4.1.6 — Run, study, and ship recipes.

USAGE
  mod <command> [<subcommand>] [flags]

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

FLAGS
  -h, --help     Display this help message.
  -v, --version  Display version information.

LEARN MORE
  Run mod <command> -h for help with a specific command.
  Docs: https://docs.moderne.io
```

## Visual anatomy

| Element | Token | Notes |
| --- | --- | --- |
| Logo + version banner | `banner.start` | UTF-8 box-drawing rich variant; ASCII `@`-art fallback per `tokens.json $banner.start.ascii_fallback`. |
| Tagline | `typography.primary` | One line, body weight, follows the banner. |
| Section headers (`USAGE`, `GET STARTED`, …) | `typography.section_header` | ALL CAPS, bold, no underline. |
| Onboarding step number | `color.semantic.success` | Numbers are continuous 1–9 across the three setup groups. The numbering carries the "do these in order" semantic. |
| Step command | `color.semantic.info` (cyan) | Each step is a single line: `<n>. <command-in-cyan>`. Placeholders inside (`<tenant-url>`, `<recipe-name>`) drop to `color.text.supporting`. |
| Child connector | `glyph.child_connector` (`└`) + `typography.supporting` | Sub-description line beneath each step. |
| Resourcing hint | `typography.supporting` | The "Get these values from your platform team or admin:" line beneath `CONFIGURE YOUR ENVIRONMENT`. Plain prose, no glyph. |
| `FLAGS` body | `typography.primary` (flag name) + `typography.supporting` (description) | Two columns, aligned by the widest flag name. |
| `LEARN MORE` link | `color.semantic.info` | Cyan; OSC-8 wrapped if the terminal supports it. |

## Spacing

- Banner → tagline: no blank line.
- Tagline → first section header: one blank line.
- Section header → first content row: zero blank lines.
- Between sections: exactly one blank line.
- Content indent: `spacing.indent.section_content` (2 spaces).
- The `└` continuation under each numbered step is at `spacing.indent.section_content + 5` (aligns under the command, not under the number) — this is a render-side detail; the token is "indent until visually under the command name."

## Composition rules

- The `GET STARTED` / `CONFIGURE YOUR ENVIRONMENT` / `RUN RECIPES` headers are the canonical top-level groupings. Every step belongs in exactly one group.
- The numbering is the through-line. Numbers do not restart at each header.
- Each step is exactly one line of cyan command + one line of `└` sub-description. No third line per step.
- `FLAGS` lists global-only flags. Subcommand flags appear in the subcommand's help, not here.
- `LEARN MORE` is the last block. It includes both a "drill into a command" hint and a docs URL.

## Worked examples

**Derived** — Annie's `cli-help-text-rewrites.pdf` proposal for the top-level `mod` screen is the source. The example above renders the proposal in this system's tokens.

## Extrapolations

- The exact byte-shape of the start banner (rich vs ASCII fallback selection) is preserved from the current CLI's `BAN-001` — neither artifact redesigns the banner. → not extrapolated.
- The `FLAGS` column alignment scheme is extrapolated from the artifacts' general column-alignment convention (no horizontal rules, two-space minimum separator). The artifacts don't render a top-level `FLAGS` block in detail. → flagged in `gaps.md` Part A.

## Out of scope (this pattern)

- Whether the `mod` no-argument invocation should default to this help screen vs. a different landing experience — behavioral, not visual. → `gaps.md` Part B.
- The product-level decision about *which* commands belong in `RUN RECIPES` vs. elsewhere. → `gaps.md` Part B.
