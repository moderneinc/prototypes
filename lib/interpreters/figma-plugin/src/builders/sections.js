// ------- Sections ---------------------------------------------------------
// Section-level frames. Vertical auto-layout that designers fill with
// rows. v1 ships the most common sections; expand as patterns codify.

const SECTION_SPECS = [
  { key: "section/section-usage",      name: "USAGE section",            header: "USAGE",            sample: ["mod build [path] [--only-tool <tool>]"] },
  { key: "section/section-what-went-wrong", name: "WHAT WENT WRONG section", header: "WHAT WENT WRONG", marker: "danger", sample: ["No build tool found in /home/user/project."] },
  { key: "section/section-try",        name: "TRY section",              header: "TRY",              marker: "danger", sample: ["▶ Add a build config to the directory.", "▶ Point the CLI at a different directory that already has one."] },
  { key: "section/section-what-to-do-next", name: "WHAT TO DO NEXT section", header: "WHAT TO DO NEXT", sample: ["▶ mod study --last-recipe-run    — View results by repo."] },
  { key: "section/section-flags",      name: "FLAGS section",            header: "FLAGS",            sample: ["--only-tool <tool>    Build tool to use. One of: maven, gradle, bazel."] },
  { key: "section/section-examples",   name: "EXAMPLES section",         header: "EXAMPLES",         sample: ["$ mod build /home/user/project", "$ mod build . --only-tool maven"] },
  { key: "section/section-arguments",  name: "ARGUMENTS section",        header: "ARGUMENTS",        sample: ["[path]    Path to the project. Defaults to current directory."] },
  { key: "section/section-next-step",  name: "NEXT STEP section",        header: "NEXT STEP",        sample: ["▶ mod build /home/user/project    — Index your code."] },
  { key: "section/section-learn-more", name: "LEARN MORE section",       header: "LEARN MORE",       sample: ["docs.moderne.io"] },
];

function countExpectedSections() {
  return SECTION_SPECS.length;
}

// Sections land in column 2 of Construct / Components (x offset = 800)
const SECTION_COL_X = 800;

async function syncSections(index, seenKeys) {
  const page = await getOrCreatePage(PAGE_NAMES.component);
  const fontUsed = await loadMonoFont();
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  let yCursor = 0;
  const SECTION_WIDTH = 720;
  const GAP = 32;

  for (const spec of SECTION_SPECS) {
    seenKeys.add(spec.key);
    const fullName = "Construct / Components / Section / " + spec.name;
    const adopt = findOrAdopt(index, spec.key, fullName);
    let comp;
    let isNew = false;
    if (adopt.node && adopt.node.type === "COMPONENT") {
      comp = adopt.node;
      if (adopt.action === "found") STATS.updated++;
    } else {
      comp = figma.createComponent();
      comp.x = SECTION_COL_X;
      comp.y = yCursor;
      page.appendChild(comp);
      isNew = true;
      STATS.created++;
    }
    comp.name = spec.name;
    comp.setPluginData(KEY_CONSTRUCT, spec.key);
    comp.layoutMode = "VERTICAL";
    comp.primaryAxisSizingMode = "AUTO";
    comp.counterAxisSizingMode = "FIXED";
    comp.itemSpacing = 4;
    comp.paddingLeft = 16;
    comp.paddingRight = 16;
    comp.paddingTop = 12;
    comp.paddingBottom = 12;
    comp.resize(SECTION_WIDTH, comp.height);
    comp.fills = [{ type: "SOLID", color: hexToRgb(CANONICAL.color.background.terminal.$value) }];

    // Clear and rebuild
    while (comp.children.length > 0) comp.children[0].remove();

    // Header line (with optional ● marker)
    const headerLine = figma.createFrame();
    headerLine.layoutMode = "HORIZONTAL";
    headerLine.itemSpacing = 8;
    headerLine.fills = [];
    headerLine.primaryAxisSizingMode = "AUTO";
    headerLine.counterAxisSizingMode = "AUTO";
    if (spec.marker) {
      const m = figma.createText();
      m.fontName = fontUsed;
      m.fontSize = 14;
      m.characters = "●";
      m.fills = [{ type: "SOLID", color: hexToRgb(colorByPath("semantic." + spec.marker)) }];
      headerLine.appendChild(m);
    }
    const h = figma.createText();
    h.fontName = { family: "Inter", style: "Bold" };
    h.fontSize = 14;
    h.characters = spec.header;
    h.letterSpacing = { value: 4, unit: "PERCENT" };
    h.fills = [{ type: "SOLID", color: hexToRgb(colorByPath("text.primary")) }];
    headerLine.appendChild(h);
    comp.appendChild(headerLine);

    // Sample body lines (designers will replace these)
    for (const line of spec.sample) {
      const t = figma.createText();
      t.fontName = fontUsed;
      t.fontSize = 13;
      t.characters = "  " + line;
      const isCommand = line.startsWith("$") || line.startsWith("▶") || line.startsWith("mod ");
      const colorPath = isCommand ? "semantic.info" : "text.body";
      t.fills = [{ type: "SOLID", color: hexToRgb(colorByPath(colorPath)) }];
      comp.appendChild(t);
      t.textAutoResize = "HEIGHT";
      t.layoutSizingHorizontal = "FILL";
    }

    if (isNew) {
      yCursor += comp.height + GAP;
    }

    log("  " + (isNew ? "+" : "·") + " section: " + spec.name, isNew ? "ok" : "dim");
  }
}
