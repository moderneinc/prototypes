# Pattern — [Name]

One sentence: what this screen shows and when the user sees it.

## When this pattern applies

- When [specific command or condition].
- When [another trigger].

This pattern does **not** apply to:

- [Thing that looks similar but uses a different pattern].

## What the user sees

```
(paste the terminal output here — this is what renders in Figma)
```

## Visual anatomy

| Element | Token | Notes |
| --- | --- | --- |
| [element name] | `glyph.[name]` + `color.semantic.[color]` | [how it's used] |
| [element name] | `typography.[style]` | [how it's used] |

## Composition rules

- **[Rule name].** [Why this rule exists and what it prevents.]
- **[Rule name].** [Why this rule exists and what it prevents.]

## Extrapolations

- **[What was extrapolated]** — [why, and what might change when real usage appears].

---

<!--
EXAMPLE: config-confirmation pattern (for reference)

# Pattern — Config confirmation

The visual treatment of a successful configuration change — what the
user sees after running `mod config <subcommand>` when the write succeeds.

## When this pattern applies

- After any `mod config ... edit` or `mod config ... add` command.
- After `mod config moderne login` when authentication succeeds.

This pattern does **not** apply to:

- `mod config ... show` — that's the list pattern, read-only.
- Configuration failures — those use the error pattern.

## What the user sees

```
✓ Trust store updated: /etc/pki/java/corp-truststore.jks

NEXT STEP
  Verify the trust store loaded:
    mod config http trust-store show
```

## Visual anatomy

| Element | Token | Notes |
| --- | --- | --- |
| Success marker | `glyph.success_marker` + `color.semantic.success` | ✓ at column 0, green. |
| Confirmation line | `typography.primary` | What changed + the value. One line. |
| NEXT STEP header | `typography.section_header` | Optional. Only when a verify command exists. |
| Verify command | Inline command reference (cyan) | How to confirm the change took effect. |

## Composition rules

- **One confirmation line, not a list.** Config writes are atomic.
- **No close banner.** Config writes are instant, not long-running.
- **NEXT STEP is optional** but encouraged when a `show` counterpart exists.
- **Verify command uses inline reference style** (cyan, not ▶).

## Extrapolations

- **Batch config changes** — the pattern shows one ✓ per value.
  Extrapolated — no evidence of batch config in current CLI.
-->
