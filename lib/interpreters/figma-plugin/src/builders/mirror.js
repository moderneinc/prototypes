// ------- Mirror -----------------------------------------------------------
// Renders proposed patterns from design-system/mirror/*.md onto the
// Construct / Mirror page. Each item is a FRAME (not a component) with:
//   - Status badge (PROPOSED / LINT WARNING / LINT FAIL)
//   - Pattern title and description
//   - Terminal preview with colorization
//   - Lint results (if any warnings/errors)
//
// Items on the Mirror page are for review. To promote one to canonical:
// move the .md file from mirror/ to patterns/, rebuild, re-sync.

async function syncMirror(index, seenKeys) {
  if (!MIRROR_ITEMS || MIRROR_ITEMS.length === 0) return;

  var page = await getOrCreatePage(PAGE_NAMES.mirror);
  var fontUsed = await loadMonoFont();
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  var MIRROR_W = 720;
  var COL_GAP = 48;
  var ROW_GAP = 40;
  var COLS = 2;
  var colHeights = [0, 0];

  // Scan existing children to prevent column overlap
  for (var ei = 0; ei < page.children.length; ei++) {
    var existing = page.children[ei];
    var col = 0;
    for (var ci = 1; ci < COLS; ci++) {
      if (Math.abs(existing.x - ci * (MIRROR_W + COL_GAP)) < Math.abs(existing.x - col * (MIRROR_W + COL_GAP))) {
        col = ci;
      }
    }
    var bottom = existing.y + existing.height + ROW_GAP;
    if (bottom > colHeights[col]) {
      colHeights[col] = bottom;
    }
  }

  for (var i = 0; i < MIRROR_ITEMS.length; i++) {
    var item = MIRROR_ITEMS[i];
    var col = i % COLS;
    var xPos = col * (MIRROR_W + COL_GAP);
    var yPos = colHeights[col];

    var key = "mirror/" + item.slug;
    seenKeys.add(key);

    var adopt = findOrAdopt(index, key, "Construct / Mirror / " + item.slug);
    var frame;
    var isNew = false;
    if (adopt.node) {
      frame = adopt.node;
      if (adopt.action === "found") STATS.updated++;
    } else {
      frame = figma.createFrame();
      frame.x = xPos;
      frame.y = yPos;
      page.appendChild(frame);
      isNew = true;
      STATS.created++;
    }

    frame.name = "mirror / " + item.slug;
    frame.setPluginData(KEY_CONSTRUCT, key);
    frame.setPluginData("construct.mirror.status", "proposed");
    frame.setPluginData("construct.mirror.reason", "");
    frame.layoutMode = "VERTICAL";
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "FIXED";
    frame.itemSpacing = 4;
    frame.paddingLeft = 20;
    frame.paddingRight = 20;
    frame.paddingTop = 16;
    frame.paddingBottom = 20;
    frame.resize(MIRROR_W, frame.height);
    frame.fills = [{ type: "SOLID", color: hexToRgb(CANONICAL.color.background.terminal.$value) }];
    frame.cornerRadius = 4;
    frame.strokeWeight = 2;

    // Border color based on lint status
    var borderColor;
    if (item.lint && item.lint.errors && item.lint.errors.length > 0) {
      borderColor = hexToRgb(CANONICAL.color.semantic.danger.$value);
    } else if (item.lint && item.lint.warnings && item.lint.warnings.length > 0) {
      borderColor = hexToRgb(CANONICAL.color.semantic.warning.$value);
    } else {
      borderColor = hexToRgb(CANONICAL.color.semantic.info.$value);
    }
    frame.strokes = [{ type: "SOLID", color: borderColor }];

    while (frame.children.length > 0) frame.children[0].remove();

    // Status badge
    var badgeText;
    var badgeColor;
    if (item.lint && item.lint.errors && item.lint.errors.length > 0) {
      badgeText = "LINT FAIL";
      badgeColor = CANONICAL.color.semantic.danger.$value;
    } else if (item.lint && item.lint.warnings && item.lint.warnings.length > 0) {
      badgeText = "PROPOSED · " + item.lint.warnings.length + " warning(s)";
      badgeColor = CANONICAL.color.semantic.warning.$value;
    } else {
      badgeText = "PROPOSED · lint pass";
      badgeColor = CANONICAL.color.semantic.info.$value;
    }

    var badge = figma.createText();
    badge.fontName = { family: "Inter", style: "Bold" };
    badge.fontSize = 10;
    badge.letterSpacing = { value: 6, unit: "PERCENT" };
    badge.characters = badgeText;
    badge.fills = [{ type: "SOLID", color: hexToRgb(badgeColor) }];
    frame.appendChild(badge);

    // Title
    var titleNode = figma.createText();
    titleNode.fontName = { family: "Inter", style: "Bold" };
    titleNode.fontSize = 13;
    titleNode.letterSpacing = { value: 2, unit: "PERCENT" };
    titleNode.characters = item.title;
    titleNode.fills = [{ type: "SOLID", color: hexToRgb(colorByPath("text.primary")) }];
    frame.appendChild(titleNode);
    titleNode.textAutoResize = "HEIGHT";
    titleNode.layoutSizingHorizontal = "FILL";

    // Description
    if (item.description) {
      var descNode = figma.createText();
      descNode.fontName = { family: "Inter", style: "Regular" };
      descNode.fontSize = 11;
      descNode.characters = item.description;
      descNode.fills = [{ type: "SOLID", color: hexToRgb(colorByPath("text.supporting")) }];
      frame.appendChild(descNode);
      descNode.textAutoResize = "HEIGHT";
      descNode.layoutSizingHorizontal = "FILL";
    }

    // Spacer + rule
    var spacer = figma.createText();
    spacer.fontName = fontUsed;
    spacer.fontSize = 5;
    spacer.characters = " ";
    spacer.fills = [{ type: "SOLID", color: hexToRgb(colorByPath("text.metadata")) }];
    frame.appendChild(spacer);

    var ruleNode = figma.createText();
    ruleNode.fontName = fontUsed;
    ruleNode.fontSize = 12;
    ruleNode.characters = "─────────────────────────────────────────────────";
    ruleNode.fills = [{ type: "SOLID", color: hexToRgb(colorByPath("text.metadata")) }];
    frame.appendChild(ruleNode);

    // Preview lines
    if (item.preview) {
      var lines = item.preview.split("\n");
      while (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop();

      for (var li = 0; li < lines.length; li++) {
        var line = lines[li];
        var t = figma.createText();
        var isHeader = isSectionHeader(line);
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
        frame.appendChild(t);
        t.textAutoResize = "HEIGHT";
        t.layoutSizingHorizontal = "FILL";
      }
    }

    // Lint warnings/errors at bottom
    var lintMessages = [];
    if (item.lint) {
      if (item.lint.errors) {
        for (var ei = 0; ei < item.lint.errors.length; ei++) lintMessages.push("✗ " + item.lint.errors[ei]);
      }
      if (item.lint.warnings) {
        for (var wi = 0; wi < item.lint.warnings.length; wi++) lintMessages.push("? " + item.lint.warnings[wi]);
      }
    }
    if (lintMessages.length > 0) {
      var lintSpacer = figma.createText();
      lintSpacer.fontName = fontUsed;
      lintSpacer.fontSize = 5;
      lintSpacer.characters = " ";
      lintSpacer.fills = [{ type: "SOLID", color: hexToRgb(colorByPath("text.metadata")) }];
      frame.appendChild(lintSpacer);

      for (var mi = 0; mi < lintMessages.length; mi++) {
        var lintLine = figma.createText();
        lintLine.fontName = fontUsed;
        lintLine.fontSize = 10;
        lintLine.characters = lintMessages[mi];
        var lintColor = lintMessages[mi].startsWith("✗") ? CANONICAL.color.semantic.danger.$value : CANONICAL.color.semantic.warning.$value;
        lintLine.fills = [{ type: "SOLID", color: hexToRgb(lintColor) }];
        frame.appendChild(lintLine);
      }
    }

    if (isNew) {
      colHeights[col] += frame.height + ROW_GAP;
    }

    log("  " + (isNew ? "+" : "·") + " mirror: " + item.slug + " [" + badgeText + "]", isNew ? "ok" : "dim");
  }

  // Reflow columns to prevent overlap after content changes.
  var reflowCols = [[], []];
  for (var ri = 0; ri < page.children.length; ri++) {
    var rChild = page.children[ri];
    var rcol = Math.round(rChild.x / (MIRROR_W + COL_GAP));
    if (rcol >= 0 && rcol < COLS) reflowCols[rcol].push(rChild);
  }
  for (var c = 0; c < COLS; c++) {
    reflowCols[c].sort(function(a, b) { return a.y - b.y; });
    var yy = 0;
    for (var j = 0; j < reflowCols[c].length; j++) {
      reflowCols[c][j].y = yy;
      yy += reflowCols[c][j].height + ROW_GAP;
    }
  }
}
