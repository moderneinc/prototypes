// ------- Templates --------------------------------------------------------
// Pre-composed full-screen frames designers can drop in and edit.
// All templates carry construct.review="after-first-designer-use" — open
// question whether these belong in the plugin or are downstream of it.

const TEMPLATE_SPECS = [
  {
    key: "template/help-screen-top-level",
    name: "Help screen / top-level",
    sections: [
      { header: "USAGE",         body: ["mod <command> [options]"] },
      { header: "GET STARTED",   body: ["1. mod config moderne tenant <url>", "  └ Connect the CLI to your tenant.", "2. mod build <path>", "  └ Index your code so recipes can run."] },
      { header: "LEARN MORE",    body: ["docs.moderne.io"] },
    ],
  },
  {
    key: "template/help-screen-leaf",
    name: "Help screen / leaf command",
    sections: [
      { header: "USAGE",      body: ["mod build [path] [--only-tool <tool>]"] },
      { header: "ARGUMENTS",  body: ["[path]    Path to the project. Defaults to current directory."] },
      { header: "FLAGS",      body: ["--only-tool <tool>    Build tool to use. One of: maven, gradle, bazel."] },
      { header: "EXAMPLES",   body: ["$ mod build /home/user/project", "$ mod build . --only-tool maven"] },
      { header: "NEXT STEP",  body: ["▶ mod study --last-recipe-run    — View results by repo."] },
    ],
  },
  {
    key: "template/error-screen-full",
    name: "Error screen / full template",
    sections: [
      { header: "WHAT WENT WRONG", marker: "danger", body: ["No build tool found in /home/user/project."] },
      { header: "TRY",             marker: "danger", body: ["▶ Add a build config to the directory.", "▶ Point the CLI at a different directory that already has one.", "  Still stuck? Report to support@moderne.io"] },
    ],
    closeBanner: "failure",
  },
  {
    key: "template/error-screen-compact",
    name: "Error screen / compact",
    sections: [
      { body: ["! Error: Unknown command 'confg'.", "  Did you mean 'config'?"] },
    ],
  },
  {
    key: "template/progress-screen",
    name: "Progress screen / in-flight",
    sections: [
      { body: ["● Loading recipe", "● Searching 47 repositories", "  ✓ 42 repositories modified", "  ⚠ 5 unchanged"] },
    ],
  },
  {
    key: "template/success-close",
    name: "Success close",
    sections: [
      { body: ["● Recipe complete", "  ✓ 42 repositories modified"] },
    ],
    closeBanner: "success",
  },
  {
    key: "template/failure-close",
    name: "Failure close",
    sections: [
      { header: "WHAT WENT WRONG", marker: "danger", body: ["Recipe execution failed on 3 repositories."] },
    ],
    closeBanner: "failure",
  },
];

function countExpectedTemplates() {
  return TEMPLATE_SPECS.length;
}

async function syncTemplates(index, seenKeys) {
  const page = await getOrCreatePage(PAGE_NAMES.template);
  const fontUsed = await loadMonoFont();
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  let xCursor = 0;
  let yCursor = 0;
  const TEMPLATE_W = 760;
  const GAP = 40;

  for (const spec of TEMPLATE_SPECS) {
    seenKeys.add(spec.key);
    const fullName = "Construct / Templates / " + spec.name;
    const adopt = findOrAdopt(index, spec.key, fullName);
    let comp;
    let isNew = false;
    if (adopt.node && adopt.node.type === "COMPONENT") {
      comp = adopt.node;
      if (adopt.action === "found") STATS.updated++;
    } else {
      comp = figma.createComponent();
      comp.x = xCursor;
      comp.y = yCursor;
      page.appendChild(comp);
      isNew = true;
      STATS.created++;
    }
    comp.name = spec.name;
    comp.setPluginData(KEY_CONSTRUCT, spec.key);
    comp.setPluginData(KEY_REVIEW, "after-first-designer-use");
    comp.layoutMode = "VERTICAL";
    comp.primaryAxisSizingMode = "AUTO";
    comp.counterAxisSizingMode = "FIXED";
    comp.itemSpacing = 16;
    comp.paddingLeft = 24;
    comp.paddingRight = 24;
    comp.paddingTop = 24;
    comp.paddingBottom = 24;
    comp.resize(TEMPLATE_W, comp.height);
    comp.fills = [{ type: "SOLID", color: hexToRgb(CANONICAL.color.background.terminal.$value) }];
    comp.cornerRadius = 8;

    while (comp.children.length > 0) comp.children[0].remove();

    for (const section of spec.sections) {
      const sec = figma.createFrame();
      sec.layoutMode = "VERTICAL";
      sec.itemSpacing = 4;
      sec.fills = [];
      sec.primaryAxisSizingMode = "AUTO";
      sec.counterAxisSizingMode = "AUTO";

      if (section.header) {
        const headerLine = figma.createFrame();
        headerLine.layoutMode = "HORIZONTAL";
        headerLine.itemSpacing = 8;
        headerLine.fills = [];
        if (section.marker) {
          const m = figma.createText();
          m.fontName = fontUsed;
          m.fontSize = 14;
          m.characters = "●";
          m.fills = [{ type: "SOLID", color: hexToRgb(colorByPath("semantic." + section.marker)) }];
          headerLine.appendChild(m);
        }
        const h = figma.createText();
        h.fontName = { family: "Inter", style: "Bold" };
        h.fontSize = 14;
        h.characters = section.header;
        h.letterSpacing = { value: 4, unit: "PERCENT" };
        h.fills = [{ type: "SOLID", color: hexToRgb(colorByPath("text.primary")) }];
        headerLine.appendChild(h);
        sec.appendChild(headerLine);
      }

      for (const line of section.body) {
        const t = figma.createText();
        t.fontName = fontUsed;
        t.fontSize = 13;
        t.characters = line;
        const isCommand = /^(\$|▶|mod )/.test(line.trim());
        const isWarning = /^(⚠|!)/.test(line.trim());
        const isSuccess = /^✓/.test(line.trim());
        let colorPath = "text.body";
        if (isCommand) colorPath = "semantic.info";
        if (isWarning) colorPath = "semantic.warning";
        if (isSuccess) colorPath = "semantic.success";
        if (line.trim().startsWith("Still stuck?")) colorPath = "text.metadata";
        t.fills = [{ type: "SOLID", color: hexToRgb(colorByPath(colorPath)) }];
        sec.appendChild(t);
      }
      comp.appendChild(sec);
    }

    if (spec.closeBanner) {
      const v = CANONICAL.banner.close.variants[spec.closeBanner];
      if (v) {
        const banner = figma.createText();
        banner.fontName = { family: "Inter", style: "Bold" };
        banner.fontSize = 16;
        banner.letterSpacing = { value: 4, unit: "PERCENT" };
        banner.characters = v.$value.phrase + "  in (3m 24s)";
        const path = v.$value.color.replace(/^color\./, "");
        banner.fills = [{ type: "SOLID", color: hexToRgb(colorByPath(path)) }];
        comp.appendChild(banner);
      }
    }

    if (isNew) {
      xCursor += TEMPLATE_W + GAP;
      if (xCursor > 2400) { xCursor = 0; yCursor += 800; }
    }

    log("  " + (isNew ? "+" : "·") + " template: " + spec.name + "  (review: after-first-designer-use)", isNew ? "ok" : "dim");
  }
}
