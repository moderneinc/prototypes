# Moderne email — design tokens (as used in these templates)

Dual-mode system on one brand spine. Digital Green is the single accent; mono
(IBM Plex Mono) carries all systematic labels; sans (Poppins) for headings/body.
Web fonts fall back to Arial / Courier in clients that block them (e.g. Gmail).

## Shared

| Role | Value |
|---|---|
| Accent (Digital Green) | `#30F284` |
| Ink on accent (button text) | `#04220F` |
| Spectral gradient | `#E6399B → #9D5BE8 → #3E7BF6 → #25D0C0 → #30F284 → #C7E84B` |
| Sans font stack | `'Poppins', Arial, Helvetica, sans-serif` |
| Mono font stack | `'IBM Plex Mono', 'Courier New', monospace` |

## Light email (default file)

| Role | Value |
|---|---|
| Page canvas | `#F6F7FA` |
| Card / body surface | `#ffffff` |
| Card (secondary) surface | `#ECEEF3` |
| Hairline / border / divider | `#DCDDE2` |
| Headline + section headline ink | `#1B2230` |
| Body copy + card links | `#5D626D` |
| Muted mono eyebrows | `#666B74` |
| Footer background | `#100C0A` |
| Footer text + social + links | `#8A857D` |
| Wordmark asset | `moderne-wordmark.png` (black) |

## Dark email (`-dark` files)

| Role | Value |
|---|---|
| Page canvas | `#100C0A` |
| Card / body surface | `#1C1714` |
| Card (secondary) surface | `#241D18` |
| Hairline / border / divider | `#322C27` |
| Headline + section headline ink | `#F2EDE4` |
| Body copy + card links | `#AAA59E` |
| Muted mono eyebrows | `#948F86` |
| Footer background | `#100C0A` |
| Footer text + social + links | `#8A857D` |
| Wordmark asset | `moderne-wordmark-white.png` |

## Accessibility (WCAG AA — all text ≥ 4.5:1)

Every text/background pair in both modes was verified at or above 4.5:1. If you
change any color, re-check contrast. Notable minimums: light muted eyebrow 4.6:1,
footer text 5.3:1; dark muted eyebrow 5.2:1, dark body 6.8:1. The green button is
identified by its label (11.4:1), not its edge.

## Type scale (both modes)

| Element | Size / weight |
|---|---|
| Headline (primary message) | 28px / 500, line-height 1.2, letter-spacing -0.3px |
| Section headline | 19px / 500 |
| Body / greeting / list | 16px / 400, line-height 1.55 |
| Card title | 16px / 500 |
| Card body | 14px / 400 |
| Mono eyebrows / labels | 11–12px, uppercase, letter-spacing 2–2.5px |
| Button label | 15px / 600 |

## Layout notes

- Container width 600px; content padding 40px horizontal (24px on mobile via the media query).
- Modules are marked with HTML comments (`MODULE:` / `OPTION A/B`) and can be kept,
  edited, or deleted. The section label and section headline are either/or.
- Primary message is a headline placed ABOVE the recipient greeting on purpose.
