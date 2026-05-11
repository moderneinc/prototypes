// ------- Patterns ---------------------------------------------------------
// One frame per canonical pattern, driven by CANONICAL_PATTERNS baked at
// build time from design-system/patterns/*.md. Each frame shows the pattern
// title and the "What the user sees" preview with basic colorization.

function countExpectedPatterns() {
  return CANONICAL_PATTERNS.length;
}

// Per-line colorization based on terminal content conventions.
function colorPathForLine(line) {
  const t = line.trim();
  if (!t || t === " ") return "text.body";
  if (/^─+$/.test(t) || /^-{4,}$/.test(t)) return "text.metadata";
  if (/^\/\/\//.test(t)) return "text.metadata";
  if (/^MOD SUCCEEDED|^MOD PARTIALLY SUCCEEDED/.test(t)) return "semantic.success";
  if (/^MOD FAILED/.test(t)) return "semantic.danger";
  if (/^FAILURE:/.test(t)) return "semantic.danger";
  if (/^✓/.test(t)) return "semantic.success";
  if (/^⚠/.test(t)) return "semantic.warning";
  if (/^\? /.test(t)) return "semantic.warning";
  if (/^! /.test(t)) return "semantic.warning";
  if (/^● (WHAT WENT WRONG|TRY)/.test(t)) return "semantic.danger";
  if (/^●/.test(t)) return "text.primary";
  if (/^[▶$]/.test(t)) return "semantic.info";
  // Section headers: ALL CAPS words, no lowercase, 3+ chars
  if (/^[A-Z][A-Z\s()\/\-:]+$/.test(t) && t.length >= 3 && !/[0-9]/.test(t)) return "text.primary";
  return "text.body";
}

function isSectionHeader(line) {
  const t = line.trim();
  return /^[A-Z][A-Z\s()\/\-:]+$/.test(t) && t.length >= 3 && !/[0-9]/.test(t) &&
    !/^(MOD |FAILURE:|─|PARTIAL)/.test(t);
}

async function syncPatterns(index, seenKeys) {
  const page = await getOrCreatePage(PAGE_NAMES.pattern);
  const fontUsed = await loadMonoFont();
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  const PATTERN_W = 720;
  const COL_GAP = 48;
  const ROW_GAP = 40;
  const COLS = 3;
  const colHeights = [0, 0, 0];

  for (let i = 0; i < CANONICAL_PATTERNS.length; i++) {
    const p = CANONICAL_PATTERNS[i];
    const col = i % COLS;
    const xPos = col * (PATTERN_W + COL_GAP);
    const yPos = colHeights[col];

    const key = "pattern/" + p.slug;
    seenKeys.add(key);
    const fullName = "Construct / Patterns / " + p.slug;
    const adopt = findOrAdopt(index, key, fullName);
    let comp;
    let isNew = false;
    if (adopt.node && adopt.node.type === "COMPONENT") {
      comp = adopt.node;
      if (adopt.action === "found") STATS.updated++;
    } else {
      comp = figma.createComponent();
      comp.x = xPos;
      comp.y = yPos;
      page.appendChild(comp);
      isNew = true;
      STATS.created++;
    }

    comp.name = p.slug;
    comp.setPluginData(KEY_CONSTRUCT, key);
    comp.layoutMode = "VERTICAL";
    comp.primaryAxisSizingMode = "AUTO";
    comp.counterAxisSizingMode = "FIXED";
    comp.itemSpacing = 2;
    comp.paddingLeft = 20;
    comp.paddingRight = 20;
    comp.paddingTop = 16;
    comp.paddingBottom = 20;
    comp.resize(PATTERN_W, comp.height);
    comp.fills = [{ type: "SOLID", color: hexToRgb(CANONICAL.color.background.terminal.$value) }];
    comp.cornerRadius = 4;

    while (comp.children.length > 0) comp.children[0].remove();

    // Title
    const titleNode = figma.createText();
    titleNode.fontName = { family: "Inter", style: "Bold" };
    titleNode.fontSize = 13;
    titleNode.letterSpacing = { value: 2, unit: "PERCENT" };
    titleNode.characters = p.title;
    titleNode.fills = [{ type: "SOLID", color: hexToRgb(colorByPath("text.primary")) }];
    comp.appendChild(titleNode);

    // Spacer before rule
    const spacer = figma.createText();
    spacer.fontName = fontUsed;
    spacer.fontSize = 5;
    spacer.characters = " ";
    spacer.fills = [{ type: "SOLID", color: hexToRgb(colorByPath("text.metadata")) }];
    comp.appendChild(spacer);

    // Horizontal rule
    const ruleNode = figma.createText();
    ruleNode.fontName = fontUsed;
    ruleNode.fontSize = 12;
    ruleNode.characters = "─────────────────────────────────────────────────";
    ruleNode.fills = [{ type: "SOLID", color: hexToRgb(colorByPath("text.metadata")) }];
    comp.appendChild(ruleNode);

    // Preview lines
    if (p.preview) {
      const lines = p.preview.split("\n");
      while (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop();

      for (const line of lines) {
        const t = figma.createText();
        const isHeader = isSectionHeader(line);
        if (isHeader) {
          t.fontName = { family: "Inter", style: "Bold" };
          t.fontSize = 12;
          t.letterSpacing = { value: 4, unit: "PERCENT" };
        } else {
          t.fontName = fontUsed;
          t.fontSize = 12;
        }
        t.characters = line || " ";
        t.fills = [{ type: "SOLID", color: hexToRgb(colorByPath(colorPathForLine(line))) }];
        comp.appendChild(t);
      }
    }

    if (isNew) {
      colHeights[col] += comp.height + ROW_GAP;
    }

    log("  " + (isNew ? "+" : "·") + " pattern: " + p.slug, isNew ? "ok" : "dim");
  }
}
