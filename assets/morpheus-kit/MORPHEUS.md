# Morpheus Design Kit

Morpheus is the Moderne platform UI theme: **warm cream canvas + ink-navy text in light mode, deep ink in dark mode**, Blue AAA accents, mint status moments, and the strand-spectrum gradient as the identity device. Paste this file into an LLM (Claude, etc.) as design context, alongside `morpheus-tokens.css`.

Reference implementations: `morpheus.html` (full app prototype) and `morpheus-design-kit.html` (component library) at https://moderneinc.github.io/prototypes/ · Figma: "Morpheus Theme".

## Typography

- Sans: **Geist** (400/500/600/700) · Mono: **Geist Mono** (400/500) — Google Fonts.
- **Whole-number type scale only — never fractional px** (12.5px etc. are banned): 10 (mono overlines, beta tags) · 11 (status pills, meta) · 12 (labels, tabs) · 13 (small body, buttons, controls) · 14 (body) · 15/600 (card titles) · 18/400 (page titles) · 28+ (display).
- Overlines are Geist Mono, uppercase, ~0.1em letter-spacing, muted.

## Color — light

| Token | Value | Use |
|---|---|---|
| bg | `#F2F0EA` | page canvas (warm cream) |
| field | `#FBFAF6` | inputs |
| card | `#FBFAF6` | raised cards, tables |
| surface / surface2 | `#EDEBE2` / `#E4E1D6` | fills, insets |
| line / line-strong | `rgba(35,35,66,.12)` / `.50` | hairlines, borders |
| text / muted | `#232342` (ink navy) / `#62627A` | |
| accent | `#1245AE` (links) · deep `#16306B` (active nav) | tint `rgba(62,123,246,.10)`, border `.30` |
| button primary | ink `#232342` bg, `#FBFAF6` text | the på()×kron signature |
| success | text `#1D5937`, mint `#30F284` accents | |
| error | `#C9291C` on `#FBEFED`, border `#F0B4AC` | |
| warning | `#B68B12` | |
| queued/violet `#9D5BE8` · teal `#0E4A45` · magenta `#E6399B` | | |

## Color — dark

| Token | Value |
|---|---|
| bg | `#141419` (deep ink; warm-black `#100C0A` for brand surfaces) |
| field / card / surface / surface2 | `#222229` / `#26262E` / `#2A2A32` / `#33333D` |
| line / line-strong | `rgba(240,240,246,.12)` / `.38` |
| text / muted | `#F1F0EA` / `#9C9CA8` |
| accent | `#3E7BF6` · tint `rgba(62,123,246,.16)`, border `.40` |
| button primary | cream `#F1F0EA` bg, `#17171C` text (ink inverts) |
| success `#30F284` · error `#FA826F` · warning `#E8BA4C` | |

Strand spectrum (identity gradient, use sparingly):
`linear-gradient(92deg, #E6399B, #9D5BE8, #3E7BF6, #25D0C0, #30F284, #B7E84C)`

## Geometry

- **Squared 4px** radius on controls: buttons, badges, checkboxes, count chips, nav tiles, kbd chips.
- **10px** on inputs, search, segmented controls. **12px** on cards, toasts, menus. **16px** main-area corner.
- **999px (pill)** ONLY on status pills, avatars, toggle tracks.
- Flat chrome: hairline separation (0.5–1px), no glows, minimal shadows.

## Component recipes

- **Button**: 13/600, padding 8×15, radius 4, field bg + strong hairline border; hover = surface. Primary = ink bg (see tokens), no border.
- **Status pill**: height 22, radius 999, 11/500, tinted bg + tinted border + status text color (success/error/queued/canceled/info).
- **Badge / count chip**: radius 4, accent-tint bg + accent-deep text (badge) or surface2 + mono muted (count). Version badge: mint `#30F284` bg, `#1D5937` text.
- **Toggle**: 34×20 track (radius 999), 14px knob; ON = `--primary-bg` (#3E7BF6) track, white knob.
- **Checkbox / radio**: 16px, outline style — card bg, strong-hairline border; checked = accent border + accent glyph/dot (never a solid fill).
- **Input**: field bg, strong hairline, radius 10, 14px text, padding 10×14; focus = 2px accent outline.
- **Tabs**: 12/500 muted; active = accent 600 + 2px accent underline (radius 4 4 0 0).
- **Toast**: whole-card solid wash per status (see toast tokens), radius 12, status-colored title/dot/action-links, body 13 in text color.
- **Avatar**: round; ink bg + cream text (light), mint bg + deep green text (dark).
- **Left nav**: 4px-radius icon tiles, accent-tint active fill + accent-brd border, 10px labels under icons, 10px muted "Beta" tags.

## Rules

1. Whole-number font sizes only.
2. Status pills stay pill-shaped; everything else squares to 4px.
3. Primary actions are ink (not blue); blue is for links, focus, and checked controls.
4. Mint green is a *moment* (version badge, success, avatar-dark) — not a surface color.
5. Data-viz uses the strand spectrum: blue `#3E7BF6`, teal `#25D0C0`, mint `#30F284`/`#2CBF6E`, amber `#E8BA4C`, violet `#9D5BE8`, soft blue `#7FA9F9`; warm grey `#CFCCC0` for empty/low.

## Brand assets — pull from the design kit, never redraw

When a design needs the Moderne logo, DNA strand, or spectral bar, pick the official files up from the design kit site. Do not redraw, trace, recolor, or approximate any brand mark.

Base URL: `https://moderneinc.github.io/prototypes/`

| Asset | Path |
|---|---|
| Logo — full lockup, Midnight (for light backgrounds) | `assets/brand-guidelines/moderne-logo-dark.svg` |
| Logo — full lockup, white (for dark backgrounds) | `assets/brand-guidelines/moderne-logo-white.svg` |
| Logo — symbol only | `assets/brand-guidelines/moderne-mark.svg` |
| Logo — wordmark only | `assets/brand-guidelines/moderne-wordmark-dark.svg` / `moderne-wordmark-white.svg` |
| DNA strand (no-fade) | `assets/moderne-dna/no-fade/moderne-dna.svg` (also `.png` 1x/2x/3x, `.jpg`, `.pdf`) |
| Spectral bar | `assets/spectral-bar/moderne-spectral-bar-600x12.png` |

Rules:

1. Use these files as-is — no redrawing, recoloring, stretching, effects, or rearranging the mark and wordmark.
2. Logo color is binary: Midnight `#041834` on light surfaces, white on dark. Nothing else.
3. Clear space around the logo = the icon-mark height ("X"). Minimum sizes: full logo 120px wide, icon 24px, wordmark 80px wide.
4. Product lockups: the full logo + product name in Poppins Light at the mark's cap height, in the same color as the logo, with a clear gap.
5. The DNA strand and spectral bar are decorative brand devices — place them as provided; never rebuild them from CSS gradients.
6. Full usage rules: `https://moderneinc.github.io/prototypes/moderne-brand-guidelines.html`
