// ------- Tokens ------------------------------------------------------------
// 1. Text styles (Figma TextStyle objects, idempotent by name).
// 2. Glyph variants — one COMPONENT per (glyph × valid_color), grouped under
//    a COMPONENT_SET so designers see them as a single component with variants.

const FONT_MONO = { family: "JetBrains Mono", style: "Regular" };
const FONT_MONO_FALLBACK = { family: "Roboto Mono", style: "Regular" };

async function loadMonoFont() {
  try {
    await figma.loadFontAsync(FONT_MONO);
    return FONT_MONO;
  } catch (e) {
    await figma.loadFontAsync(FONT_MONO_FALLBACK);
    return FONT_MONO_FALLBACK;
  }
}

const TEXT_STYLE_SPECS = [
  { key: "section-header", name: "Construct/Section header",  fontFamily: "Inter", fontStyle: "Bold",    size: 14, letterSpacingPercent: 2,  color: "text.primary"     },
  { key: "primary",        name: "Construct/Primary",        fontFamily: "Inter", fontStyle: "Regular", size: 14, letterSpacingPercent: 0,  color: "text.body"        },
  { key: "supporting",     name: "Construct/Supporting",     fontFamily: "Inter", fontStyle: "Regular", size: 14, letterSpacingPercent: 0,  color: "text.supporting"  },
  { key: "metadata",       name: "Construct/Metadata",       fontFamily: "Inter", fontStyle: "Regular", size: 14, letterSpacingPercent: 0,  color: "text.metadata"    },
  { key: "inline-command", name: "Construct/Inline command", fontFamily: "Inter", fontStyle: "Regular", size: 14, letterSpacingPercent: 0,  color: "semantic.info"    },
  { key: "banner-phrase",  name: "Construct/Banner phrase",  fontFamily: "Inter", fontStyle: "Bold",    size: 16, letterSpacingPercent: 4,  color: "text.primary"     },
];

async function syncTextStyles(seenKeys) {
  const all = await figma.getLocalTextStylesAsync();
  const byName = new Map(all.map((s) => [s.name, s]));
  for (const spec of TEXT_STYLE_SPECS) {
    let style = byName.get(spec.name);
    let isNew = false;
    if (!style) {
      style = figma.createTextStyle();
      style.name = spec.name;
      isNew = true;
    }
    await figma.loadFontAsync({ family: spec.fontFamily, style: spec.fontStyle });
    style.fontName = { family: spec.fontFamily, style: spec.fontStyle };
    style.fontSize = spec.size;
    style.letterSpacing = { value: spec.letterSpacingPercent, unit: "PERCENT" };
    const tagKey = "token/text-style/" + spec.key;
    seenKeys.add(tagKey);
    log("  " + (isNew ? "+" : "·") + " text-style: " + spec.name, isNew ? "ok" : "dim");
    if (isNew) STATS.created++;
    else STATS.updated++;
  }
}

function countExpectedTokens() {
  let n = TEXT_STYLE_SPECS.length;
  for (const name of Object.keys(CANONICAL.glyph)) {
    if (name.startsWith("$")) continue;
    const g = CANONICAL.glyph[name];
    n += (g.$value.validColors || []).length;
  }
  return n;
}

async function syncTokens(index, seenKeys) {
  const page = await getOrCreatePage(PAGE_NAMES.token);
  await loadMonoFont();
  let xCursor = 0;
  let yCursor = 0;
  const COMPONENT_SIZE = 64;
  const PAD = 24;

  for (const glyphName of Object.keys(CANONICAL.glyph)) {
    if (glyphName.startsWith("$")) continue;
    const g = CANONICAL.glyph[glyphName];
    const validColors = g.$value.validColors;
    if (!validColors || validColors.length === 0) {
      throw new Error("glyph." + glyphName + " missing validColors");
    }

    const setKey = "token/glyph/" + glyphName;
    const setName = "Construct / Tokens / Glyph / " + glyphName;
    seenKeys.add(setKey);

    // Build variants first, then combine into a ComponentSet.
    const variantNodes = [];
    for (const colorPath of validColors) {
      const variantKey = setKey + "/" + colorPath.replace(".", "-");
      seenKeys.add(variantKey);
      const variantName = "color=" + colorPath;
      const variantFullName = setName + " / " + variantName;
      const adopt = findOrAdopt(index, variantKey, variantFullName);
      let comp;
      if (adopt.node && adopt.node.type === "COMPONENT") {
        comp = adopt.node;
        if (adopt.action === "found") STATS.updated++;
        // adopted already counted
      } else {
        comp = figma.createComponent();
        page.appendChild(comp);
        STATS.created++;
        log("  + " + variantFullName, "ok");
      }
      comp.name = variantName;
      comp.setPluginData(KEY_CONSTRUCT, variantKey);
      comp.resize(COMPONENT_SIZE, COMPONENT_SIZE);

      // One text node containing the glyph char.
      let textNode = comp.findOne((n) => n.type === "TEXT");
      if (!textNode) {
        textNode = figma.createText();
        comp.appendChild(textNode);
      }
      const fontUsed = await loadMonoFont();
      textNode.fontName = fontUsed;
      textNode.fontSize = 32;
      textNode.characters = g.$value.char;
      textNode.x = (COMPONENT_SIZE - textNode.width) / 2;
      textNode.y = (COMPONENT_SIZE - textNode.height) / 2;

      const rgb = hexToRgb(colorByPath(colorPath));
      textNode.fills = [{ type: "SOLID", color: rgb }];

      // Transparent component bg
      comp.fills = [];

      variantNodes.push(comp);
    }

    // Combine into a ComponentSet (or update existing one)
    let setNode = index.byKey.get(setKey);
    if (!setNode) {
      // Position variants near each other before combining.
      variantNodes.forEach((v, i) => {
        v.x = i * (COMPONENT_SIZE + 8);
        v.y = 0;
      });
      try {
        setNode = figma.combineAsVariants(variantNodes, page);
      } catch (e) {
        throw new Error("combineAsVariants failed for glyph." + glyphName + ": " + e.message);
      }
      setNode.name = "glyph/" + glyphName;
      setNode.setPluginData(KEY_CONSTRUCT, setKey);
      setNode.x = xCursor;
      setNode.y = yCursor;
      xCursor += setNode.width + PAD;
      if (xCursor > 1200) { xCursor = 0; yCursor += setNode.height + PAD; }
      log("  + set: " + setName, "ok");
    } else {
      log("  · set: " + setName, "dim");
      for (const v of variantNodes) {
        if (v.parent !== setNode) {
          try {
            setNode.appendChild(v);
          } catch (e) {
            throw new Error("appendChild to existing set failed for glyph." + glyphName + ": " + e.message);
          }
        }
      }
    }
  }
}
