---
name: Figma reverse sync (pull) workflow
description: How to read designer changes from Figma and propose edits to canonical tokens — uses MCP get_figma_data + figma-expected.json
type: reference
---

## Figma pull workflow

When the user says "pull from Figma" or asks to sync designer changes back to code:

1. Run `npm run figma-pull:expected` to regenerate `tokens/figma-expected.json` from canonical
2. Read the Figma file overview: `get_figma_data(fileKey="twkYEkdg94dq5FQB6D9vDq", depth=2)`
3. For each component in `figma-expected.json`, find its node ID from the overview and read it at depth=3
4. Compare Figma fills (hex), text content, and textStyle against the expected values
5. Report differences as a structured diff
6. If the user approves, edit `design-system/tokens.json` (the authoring source, not canonical.json)
7. Run `npm run figma-plugin:rebuild` to regenerate canonical + plugin

### Key node mappings (from the Construct / Components page)

- Banners: `close / success`, `close / partial_success`, `close / success_with_warnings`, `close / failure`
- Rows: `section-header-row`, `sub-task-summary`, `recovery-action`, `hint-row`, etc.
- Text styles: `text-style/section-header`, `text-style/primary`, etc.
- Glyph sets: `glyph/section_marker`, `glyph/actionable_bullet`, etc.

### What's diffable (token-level)

- Fill colors → `tokens.json` color values
- Banner phrase text → `tokens.json` banner variant phrases
- Font weight/size → typography tokens
- Glyph characters → glyph.$value.char

### What's NOT diffable (requires human judgment)

- New components a designer created from scratch
- Structural changes (adding/removing children)
- Pattern composition changes
