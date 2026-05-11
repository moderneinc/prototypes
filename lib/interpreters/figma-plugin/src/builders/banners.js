// ------- Banners ----------------------------------------------------------
// Close banners come straight from canonical.banner.close.variants — already
// structured. Start banners are deferred to v2 (need actual logo asset).

function countExpectedBanners() {
  const close = CANONICAL.banner.close.variants;
  return Object.keys(close).length;
}

// Banners land in column 3 of Construct / Components (x offset = 1600)
const BANNER_COL_X = 1600;

async function syncBanners(index, seenKeys) {
  const page = await getOrCreatePage(PAGE_NAMES.component);
  const fontUsed = await loadMonoFont();
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  const close = CANONICAL.banner.close.variants;
  let yCursor = 0;
  const W = 720;
  const GAP = 24;

  for (const variantName of Object.keys(close)) {
    const v = close[variantName];
    const key = "banner/close/" + variantName;
    seenKeys.add(key);
    const fullName = "Construct / Banners / close / " + variantName;
    const adopt = findOrAdopt(index, key, fullName);
    let comp;
    let isNew = false;
    if (adopt.node && adopt.node.type === "COMPONENT") {
      comp = adopt.node;
      if (adopt.action === "found") STATS.updated++;
    } else {
      comp = figma.createComponent();
      comp.x = BANNER_COL_X;
      comp.y = yCursor;
      page.appendChild(comp);
      isNew = true;
      STATS.created++;
    }
    comp.name = "close / " + variantName;
    comp.setPluginData(KEY_CONSTRUCT, key);
    comp.layoutMode = "HORIZONTAL";
    comp.primaryAxisSizingMode = "FIXED";
    comp.counterAxisSizingMode = "AUTO";
    comp.itemSpacing = 8;
    comp.paddingLeft = 16;
    comp.paddingRight = 16;
    comp.paddingTop = 16;
    comp.paddingBottom = 16;
    comp.resize(W, comp.height);
    comp.fills = [{ type: "SOLID", color: hexToRgb(CANONICAL.color.background.terminal.$value) }];

    while (comp.children.length > 0) comp.children[0].remove();

    const phrase = figma.createText();
    phrase.fontName = { family: "Inter", style: "Bold" };
    phrase.fontSize = 16;
    phrase.letterSpacing = { value: 4, unit: "PERCENT" };
    phrase.characters = v.$value.phrase;
    // v.$value.color = "color.semantic.success" — strip leading "color."
    const path = v.$value.color.replace(/^color\./, "");
    phrase.fills = [{ type: "SOLID", color: hexToRgb(colorByPath(path)) }];
    comp.appendChild(phrase);

    const dur = figma.createText();
    dur.fontName = fontUsed;
    dur.fontSize = 14;
    dur.characters = "in (3m 24s)";
    dur.fills = [{ type: "SOLID", color: hexToRgb(colorByPath("text.metadata")) }];
    comp.appendChild(dur);

    if (isNew) yCursor += comp.height + GAP;
    log("  " + (isNew ? "+" : "·") + " banner/close/" + variantName, isNew ? "ok" : "dim");
  }
}
