// ------- Rows -------------------------------------------------------------
// Composed rows. Each is a single COMPONENT (no variants for v1) with
// auto-layout and slot text nodes designers can override.

const ROW_SPECS = [
  {
    key: "row/section-header-row",
    name: "section-header-row",
    description: "● + ALL CAPS section phrase. Glyph color depends on section semantic.",
    glyph: { char: "●", colorPath: "semantic.danger" },
    text: { content: "WHAT WENT WRONG", style: "section-header" },
    gap: 8,
  },
  {
    key: "row/sub-task-summary",
    name: "sub-task-summary",
    description: "✓ + count + body. Used in sub-task summaries (e.g. 42 repositories modified).",
    glyph: { char: "✓", colorPath: "semantic.success" },
    text: { content: "42 repositories modified", style: "primary" },
    gap: 8,
  },
  {
    key: "row/recovery-action",
    name: "recovery-action",
    description: "▶ + imperative verb. Used in TRY blocks and WHAT TO DO NEXT lists.",
    glyph: { char: "▶", colorPath: "semantic.info" },
    text: { content: "Add a build config to the directory.", style: "primary" },
    gap: 8,
  },
  {
    key: "row/inlined-command",
    name: "inlined-command",
    description: "▶ + cyan command. Sits beneath a recovery-action; 4-space indent.",
    glyph: { char: "▶", colorPath: "semantic.info" },
    text: { content: "mod build /home/user/project --only-tool maven", style: "inline-command" },
    gap: 8,
  },
  {
    key: "row/hint-row",
    name: "hint-row",
    description: "? Hint: + body. Surfaces ambiguity or anticipates a question.",
    glyph: { char: "?", colorPath: "semantic.warning" },
    text: { content: "Hint: The recipe may not emit tables.", style: "primary" },
    gap: 8,
  },
  {
    key: "row/note-row",
    name: "note-row",
    description: "! Note: + body. Inline note; warning color, supportive tone.",
    glyph: { char: "!", colorPath: "semantic.warning" },
    text: { content: "Note: Needs read AND write access.", style: "primary" },
    gap: 8,
  },
  {
    key: "row/error-row",
    name: "error-row",
    description: "! Error: + body. Compact / usage error tier; danger color.",
    glyph: { char: "!", colorPath: "semantic.danger" },
    text: { content: "Error: Unknown command 'confg'.", style: "primary" },
    gap: 8,
  },
  {
    key: "row/warning-row",
    name: "warning-row",
    description: "⚠ + count + body. Inline warning state; count leads.",
    glyph: { char: "⚠", colorPath: "semantic.warning" },
    text: { content: "0 repositories searched — all 47 skipped (no search index).", style: "primary" },
    gap: 8,
  },
  {
    key: "row/empty-state-row",
    name: "empty-state-row",
    description: "No glyph. Supporting color. Used for empty-state lines (No <noun-phrase>.).",
    glyph: null,
    text: { content: "No repositories configured.", style: "supporting" },
    gap: 0,
  },
  {
    key: "row/example-row",
    name: "example-row",
    description: "$ prompt + cyan command. Used inside EXAMPLES blocks.",
    glyph: { char: "$", colorPath: "text.metadata" },
    text: { content: "mod build /home/user/project", style: "inline-command" },
    gap: 8,
  },
];

function countExpectedRows() {
  return ROW_SPECS.length;
}

async function syncRows(index, seenKeys) {
  const page = await getOrCreatePage(PAGE_NAMES.component);
  const fontUsed = await loadMonoFont();
  let yCursor = 0;
  const ROW_GAP = 24;
  const ROW_WIDTH = 720;

  for (const spec of ROW_SPECS) {
    seenKeys.add(spec.key);
    const fullName = "Construct / Components / Row / " + spec.name;
    const adopt = findOrAdopt(index, spec.key, fullName);
    let comp;
    let isNew = false;
    if (adopt.node && adopt.node.type === "COMPONENT") {
      comp = adopt.node;
      if (adopt.action === "found") STATS.updated++;
    } else {
      comp = figma.createComponent();
      comp.x = 0;
      comp.y = yCursor;
      page.appendChild(comp);
      isNew = true;
      STATS.created++;
    }
    comp.name = spec.name;
    comp.setPluginData(KEY_CONSTRUCT, spec.key);
    comp.layoutMode = "HORIZONTAL";
    comp.primaryAxisSizingMode = "FIXED";
    comp.counterAxisSizingMode = "AUTO";
    comp.itemSpacing = spec.gap;
    comp.paddingLeft = 16;
    comp.paddingRight = 16;
    comp.paddingTop = 8;
    comp.paddingBottom = 8;
    comp.resize(ROW_WIDTH, comp.height);
    comp.fills = [];

    // Clear and rebuild children deterministically (children are simple).
    while (comp.children.length > 0) comp.children[0].remove();

    if (spec.glyph) {
      const glyphNode = figma.createText();
      glyphNode.fontName = fontUsed;
      glyphNode.fontSize = 14;
      glyphNode.characters = spec.glyph.char;
      glyphNode.fills = [{ type: "SOLID", color: hexToRgb(colorByPath(spec.glyph.colorPath)) }];
      comp.appendChild(glyphNode);
    }

    const textNode = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    textNode.fontName = { family: "Inter", style: "Regular" };
    textNode.fontSize = 14;
    textNode.characters = spec.text.content;
    const textColorPath = TEXT_STYLE_SPECS.find((s) => s.key === spec.text.style).color;
    textNode.fills = [{ type: "SOLID", color: hexToRgb(colorByPath(textColorPath)) }];
    comp.appendChild(textNode);

    if (yCursor === 0 || isNew) {
      yCursor += comp.height + ROW_GAP;
    }

    log("  " + (isNew ? "+" : "·") + " row: " + spec.name, isNew ? "ok" : "dim");
  }
}
