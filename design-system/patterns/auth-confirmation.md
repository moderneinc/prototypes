# Pattern — Auth Confirmation

The visual treatment of a successful authentication handshake. The CLI opened a browser, the user logged in, and the CLI received valid credentials back.

## When this pattern applies

- `mod config moderne login` completed successfully.
- The CLI exchanged a browser-based OAuth flow for a stored credential and can confirm the authenticated identity.
- Also applies to any future credential-exchange command that stores a token and confirms success (e.g. `mod config moderne login --token`).

## What the user sees

```
● Authenticating with Moderne
● Opening browser for login

✓ Authenticated as user@example.com

NEXT STEP
  ▶ mod config recipes moderne sync — Sync recipe catalog from Moderne.

MOD SUCCEEDED in (4s)
```

## Visual anatomy

| Element | Token | Notes |
| --- | --- | --- |
| Action header (in-flight) | `glyph.section_marker` (`●`, primary white) + `typography.primary` action verb | One per phase. Gerund verb, no period. |
| `✓ Authenticated as <identity>` | `glyph.success_marker` (`✓`, green) + `typography.primary` body | Single result row. The identity (email, username) is the concrete proof that the handshake worked. Renders in `color.text.body`. |
| `NEXT STEP` | `typography.section_header` | ALL CAPS. Used for single-action forward-chains; contrast with `WHAT TO DO NEXT` which offers multiple options. |
| `▶ <command> — <gloss>` | `glyph.actionable_bullet` (`▶`, cyan) + `color.semantic.info` (command) + `typography.supporting` (em-dash + gloss) | One entry. The em-dash is U+2014. |
| `MOD SUCCEEDED in (Xs)` | `banner.close.variants.success` | Green, bold, leading blank line. |

## Spacing

- Each `● <action>` line stands alone, no blank line between sequential action headers.
- Action-header block to `✓` result row: one blank line.
- `✓` row to `NEXT STEP`: one blank line.
- Within `NEXT STEP`: command row stacked directly below the header (zero blank lines).
- `NEXT STEP` to close banner: one blank line.

## Composition rules

- This pattern is a specialization of the `success` pattern shape. The key difference: auth confirmation always shows exactly **one** `✓` row (the identity line), never a count.
- The `✓` row body always follows the form `Authenticated as <identity>`, where `<identity>` is the email or username the server returned. No count prefix — this is a singleton confirmation, not a batch result.
- `NEXT STEP` (singular) is used instead of `WHAT TO DO NEXT` because the logical next action after login is always one thing: sync the recipe catalog. If a future auth command has multiple follow-ups, switch to `WHAT TO DO NEXT`.
- The close banner is always `MOD SUCCEEDED`. Auth failures route to `auth-error.md`, not this pattern.
- The action headers narrate the two-phase flow: (1) initiating, (2) browser handoff. Real CLI runs may add or skip phases (e.g. `--token` skips the browser phase). The visual shape is the same either way — just fewer `●` lines.

## Extrapolations

- The exact wording of the action headers (`Authenticating with Moderne`, `Opening browser for login`) is extrapolated. The CLI's current output for `mod config moderne login` is not documented in the design artifacts. The shape (gerund verb, no period) follows the `success.md` convention.
- Whether `--token` mode (non-interactive login) should emit `Opening browser for login` is extrapolated as "no" — that phase header would be skipped, leaving only `Authenticating with Moderne` followed by the `✓` row.
- The `NEXT STEP` content (`mod config recipes moderne sync`) is extrapolated from the typical post-login workflow. The actual forward-chain may differ per environment.

## Out of scope (this pattern)

- Whether re-authentication (credential refresh) should emit the same visual or a quieter one — product decision.
- Whether multiple identity providers (SSO, token, API key) should each have distinct action-header wording — author / framework decision.
- The browser handoff UX itself (what happens in the browser) — out of CLI scope entirely.
