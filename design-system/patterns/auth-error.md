# Pattern — Auth Error

The visual treatment of a failed authentication attempt. The CLI tried to log in and could not obtain valid credentials — browser handoff timed out, server rejected the request, or the token was invalid.

## When this pattern applies

- `mod config moderne login` failed during execution (after parsing succeeded).
- The failure is in the auth flow itself: timeout, server error, invalid token, network unreachable.
- This pattern uses the full error template from `error.md` Tier 1, specialized for auth-specific causes and recovery actions.

## What the user sees

```
FAILURE: mod config moderne login failed with an exception

● WHAT WENT WRONG
  Authentication failed — the browser login did not complete.

  ? Hint: A few things can cause this — the browser may not have
    opened, the login page may have timed out, or the CLI may not
    be reaching app.moderne.io right now.

● TRY
  ▶ Re-run the login command and complete the browser flow within 60 seconds.
      mod config moderne login
  ▶ Use a personal access token instead of browser login.
      mod config moderne login --token <your-token>
  ▶ Check that app.moderne.io is reachable from this machine.
      curl -sI https://app.moderne.io/health
  ▶ Still stuck? Report to support@moderne.io

MOD FAILED in (62s)
```

## Visual anatomy

| Element | Token | Notes |
| --- | --- | --- |
| `FAILURE:` preface | `color.semantic.danger` + bold | First line. The phrase after the colon is regular weight. One blank line below. |
| `● WHAT WENT WRONG` | `glyph.section_marker` (`●`, red) + `typography.section_header` | Bullet is red; header text is white. |
| WHAT WENT WRONG body | `typography.primary` | One line. Names the concrete failure: what did not happen. |
| `? Hint:` | `glyph.hint_marker` (`?`, yellow) + leading word `Hint:` (yellow) + `typography.primary` body | Inside WHAT WENT WRONG, indented. Acknowledges ambiguity by listing possible causes. |
| `● TRY` | `glyph.section_marker` (`●`, red) + `typography.section_header` | Bullet red, header text white. |
| `▶ <recovery>` action | `glyph.actionable_bullet` (`▶`, cyan) + `typography.supporting` action verb + `color.semantic.info` runnable command on the next line | Two-line shape: action description on top, indented command below. Command line uses `spacing.indent.list_item_continuation` (4 spaces). |
| Demoted support line | `glyph.actionable_bullet` (`▶`, dim) + `typography.metadata` body | Last entry in TRY. Both the `▶` and text render in `color.text.metadata`. |
| `MOD FAILED in (Xs)` | `banner.close.variants.failure` | Red, bold, leading blank line. |

## Spacing

- Preface to `● WHAT WENT WRONG`: one blank line.
- WHAT WENT WRONG body to `? Hint:`: one blank line.
- `WHAT WENT WRONG` block to `● TRY`: one blank line.
- Within TRY: each `▶ <recovery>` block (two lines: verb + command) is followed by one blank line before the next `▶`. The demoted support line is a single line (no command below it).
- TRY to close banner: one blank line.

## Composition rules

- This pattern is a direct application of `error.md` Tier 1 (full template). The five-element shape is invariant: FAILURE preface, WHAT WENT WRONG, optional ? Hint, TRY, close banner.
- The `WHAT WENT WRONG` body is **one line** and names the auth-specific failure. For browser flow: "the browser login did not complete." For token: "the token was rejected by the server." For network: "unable to reach app.moderne.io."
- The `? Hint:` block is **always present** for auth errors because the CLI typically cannot distinguish between browser-didn't-open, user-didn't-complete, and server-timeout. The hint lists the plausible causes without committing to one.
- `TRY` lists recovery actions in most-likely-to-help order:
  1. Retry the same command (most common: user just didn't finish the browser flow in time).
  2. Alternative auth method (`--token`).
  3. Network diagnostic (verify the server is reachable).
  4. Demoted support line (last, always).
- The support line follows the D-10 demotion rule: when concrete suggestions precede it, it is demoted to `typography.metadata` and reworded as `Still stuck? Report to support@moderne.io`.

## Extrapolations

- The exact WHAT WENT WRONG phrasing per failure mode (browser timeout vs. invalid token vs. network) is extrapolated. The design artifacts do not show auth-specific error screens. The shape follows `error.md` conventions.
- The `curl` diagnostic suggestion in TRY is extrapolated as a plausible network check. The actual diagnostic command may differ.
- The 60-second timeout referenced in the example is extrapolated. The real browser-flow timeout is a framework/config decision.

## Out of scope (this pattern)

- Whether the CLI should automatically retry the browser flow before erroring — framework / product decision.
- Whether expired-token refresh should be silent (auto-refresh) or produce a visible error — behavioral decision.
- The specific HTTP error codes that map to "server rejected" vs. "server unreachable" — framework classification, not visual.
