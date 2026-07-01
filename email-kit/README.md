# Moderne email template kit

A generic, on-brand Moderne email template in light and dark, hosted on GitHub Pages so the images render in real inboxes.

Live gallery: <https://moderneinc.github.io/prototypes/email-kit/>

## Files

- `index.html` — gallery: light and dark side-by-side in iframes, with links to the raw source.
- `email/light.html`, `email/dark.html` — view-in-browser web copies (relative image paths; work on any domain).
- `templates/moderne-email-template.html`, `templates/moderne-email-template-dark.html` — **send-ready**. Image `src`s point at the absolute GitHub Pages URL so Gmail/Outlook can fetch them.
- `email-assets/` — the seven PNGs (wordmarks black + white, spectral bar, four social icons). Served as public URLs.

## How to send

1. Open a send-ready file: `templates/moderne-email-template.html` (light) or `templates/moderne-email-template-dark.html` (dark).
2. Fill every `[BRACKETED]` placeholder and the `[BUTTON-URL]` / `[CARD-URL]` links.
3. Make the merge field `{{Recipient.FirstName}}` match your tool:
   - GMass → `{FirstName}`
   - Mailmeteor / YAMM → `{{First Name}}`
   - Pardot → leave as `{{Recipient.FirstName}}`
4. Paste the whole HTML into your mail-merge tool with your recipient sheet.

The images and the "View in Browser" link are already wired to `https://moderneinc.github.io/prototypes/email-kit/…`, so nothing else needs to change.

## Caveats

- The repo must stay **public** or recipients' mail clients can't fetch the images.
- Gmail strips the single `<style>` block (mobile media query) and any embedded data-URI images — the send-ready files use hosted URLs by design. Do not "clean up" the inline styles.
- Emails are inline-styled `<table>` layouts on purpose. Don't convert to flexbox/grid, don't extract CSS, don't add a build step. The `index.html` gallery is separate and may use modern CSS freely.
- Bracketed `[...]` placeholders are intentional and filled per-send. Merge fields (`{{…}}`) are intentional too.

## Design tokens

See the shipped [`design-tokens.md`](https://github.com/moderneinc/prototypes/blob/gh-pages/email-kit/design-tokens.md) reference in the source kit for the exact brand values, type scale, and AA contrast notes.
