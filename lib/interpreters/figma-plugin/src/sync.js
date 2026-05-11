// ------- Sync orchestrator ------------------------------------------------
// Idempotency model:
//   1. Each generated node carries node.setPluginData(KEY_CONSTRUCT, key).
//   2. We index every node in the file by that key on each run.
//   3. Resolution order: lookup by pluginData key, then by exact name fallback
//      (adopt: stamp the key for next time), else create fresh.
//   4. Property-level updates only — set characters, fills, layout — never
//      remove() then create() on a known key, so designer instances stay linked.
//   5. After the run, any node carrying a key not in the new run gets moved to
//      the orphan page (not deleted) and listed for the user to review.

const STATS = { created: 0, updated: 0, adopted: 0, orphaned: 0, unchanged: 0 };

function resetStats() {
  STATS.created = 0;
  STATS.updated = 0;
  STATS.adopted = 0;
  STATS.orphaned = 0;
  STATS.unchanged = 0;
}

async function indexExisting() {
  // Walk all pages, build map of construct.key -> node.
  await figma.loadAllPagesAsync();
  const byKey = new Map();
  const byName = new Map();
  for (const page of figma.root.children) {
    if (page.name === ORPHAN_PAGE_NAME) continue;
    walk(page, (n) => {
      const k = n.getPluginData(KEY_CONSTRUCT);
      if (k) byKey.set(k, n);
      byName.set(n.name, n);
    });
  }
  return { byKey, byName };
}

function walk(node, fn) {
  fn(node);
  if ("children" in node) {
    for (const c of node.children) walk(c, fn);
  }
}

function findOrAdopt(index, key, name) {
  // Resolution order: pluginData key, then exact name (adopt).
  if (index.byKey.has(key)) return { node: index.byKey.get(key), action: "found" };
  if (index.byName.has(name)) {
    const n = index.byName.get(name);
    n.setPluginData(KEY_CONSTRUCT, key);
    STATS.adopted++;
    return { node: n, action: "adopted" };
  }
  return { node: null, action: "missing" };
}

async function getOrCreatePage(name) {
  let p = figma.root.children.find((p) => p.name === name);
  if (p) return p;
  p = figma.createPage();
  p.name = name;
  return p;
}

async function moveOrphans(seenKeys, index) {
  const orphans = [];
  for (const [key, node] of index.byKey) {
    if (!seenKeys.has(key)) orphans.push({ key, node });
  }
  if (orphans.length === 0) return;
  const orphanPage = await getOrCreatePage(ORPHAN_PAGE_NAME);
  const moveFailures = [];
  for (const { key, node } of orphans) {
    try {
      orphanPage.appendChild(node);
      log("  orphan: " + key, "warn");
      STATS.orphaned++;
    } catch (e) {
      moveFailures.push(key + " (" + e.message + ")");
      log("  ! orphan move failed for " + key + ": " + e.message, "err");
    }
  }
  if (moveFailures.length > 0) {
    figma.notify("Orphan move failed for " + moveFailures.length + " node(s) — see plugin log", { error: true });
  }
}

function writeManifest(seenKeys) {
  const manifest = {
    version: CANONICAL.$meta && CANONICAL.$meta.version,
    builtAt: BUILT_AT,
    syncedAt: new Date().toISOString(),
    keys: Array.from(seenKeys).sort(),
  };
  figma.root.setPluginData(KEY_MANIFEST, JSON.stringify(manifest));
}

async function syncAll(opts) {
  resetStats();
  const dryRun = !!(opts && opts.dryRun);
  log(dryRun ? "DRY RUN — no writes" : "Sync starting", "dim");

  if (dryRun) {
    // Count expected without writing.
    const expected =
      countExpectedAtoms() +
      countExpectedMolecules() +
      countExpectedOrganisms() +
      countExpectedBanners() +
      countExpectedTemplates();
    log("Expected components: " + expected, "ok");
    return;
  }

  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "JetBrains Mono", style: "Regular" }).catch(async () => {
    await figma.loadFontAsync({ family: "Roboto Mono", style: "Regular" });
    log("  fallback: JetBrains Mono not available, using Roboto Mono", "warn");
  });

  const index = await indexExisting();
  const seenKeys = new Set();

  await syncTextStyles(seenKeys);
  await syncAtoms(index, seenKeys);
  await syncMolecules(index, seenKeys);
  await syncOrganisms(index, seenKeys);
  await syncBanners(index, seenKeys);
  await syncTemplates(index, seenKeys);

  await moveOrphans(seenKeys, index);
  writeManifest(seenKeys);

  log("Done.", "ok");
}
