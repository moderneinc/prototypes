# Pattern — Config confirmation

The visual treatment of a successful configuration change — what the user sees after running `mod config <subcommand>` when the write succeeds.

## When this pattern applies

- After any `mod config ... edit` or `mod config ... add` command that writes a value.
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
| Success marker | `glyph.success_marker` + `color.semantic.success` | `✓` at column 0, green. |
| Confirmation line | `typography.primary` | What was changed + the concrete value that was written. One line. |
| NEXT STEP header | `typography.section_header` | Optional. Only when a verify command exists. |
| Verify command | Inline command reference (cyan) | The command to run to confirm the change took effect. |

## Composition rules

- **One confirmation line, not a list.** Config writes are atomic — one value changed. The confirmation names both the setting and the new value.
- **No close banner.** Config writes are instant, not long-running. No `MOD SUCCEEDED` needed.
- **NEXT STEP is optional** but encouraged when a `show` counterpart exists.
- **Verify command uses inline reference style** (cyan, not ▶). It's informational ("here's how to check"), not a recovery action.

## Extrapolations

- **Batch config changes** (e.g., `mod config moderne edit` sets multiple values). The pattern shows one ✓ per value written, stacked vertically. Extrapolated — no evidence of batch config in current CLI.
