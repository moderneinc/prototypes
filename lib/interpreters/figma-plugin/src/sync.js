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
  for (const kv of index.byKey) {
    const key = kv[0];
    const node = kv[1];
    if (!seenKeys.has(key)) orphans.push({ key: key, node: node });
  }
  if (orphans.length === 0) return;
  const orphanPage = await getOrCreatePage(ORPHAN_PAGE_NAME);
  const moveFailures = [];
  for (const item of orphans) {
    const key = item.key;
    const node = item.node;
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

// ------- Manifest ----------------------------------------------------------

// Check if any construct.key nodes exist in the file. If the manifest says
// "28 unchanged" but the user deleted all Construct pages, the manifest is
// stale and we should treat the file as a first-sync.
async function hasAnyConstructNodes() {
  await figma.loadAllPagesAsync();
  for (var i = 0; i < figma.root.children.length; i++) {
    var page = figma.root.children[i];
    if (page.name === ORPHAN_PAGE_NAME) continue;
    var found = page.findOne(function(n) { return n.getPluginData(KEY_CONSTRUCT) !== ""; });
    if (found) return true;
  }
  return false;
}

function clearManifest() {
  figma.root.setPluginData(KEY_MANIFEST, "");
}

function readManifest() {
  const raw = figma.root.getPluginData(KEY_MANIFEST);
  if (!raw) return null;
  try {
    const m = JSON.parse(raw);
    // Old format had keys:[] instead of hashes:{} — treat as first-sync.
    if (!m.hashes || Array.isArray(m.hashes)) return null;
    return m;
  } catch (e) {
    return null;
  }
}

function writeManifest(hashes) {
  const manifest = {
    version: CANONICAL.$meta && CANONICAL.$meta.version,
    builtAt: BUILT_AT,
    syncedAt: new Date().toISOString(),
    hashes: hashes,
    values: CANONICAL_VALUES || {},
  };
  figma.root.setPluginData(KEY_MANIFEST, JSON.stringify(manifest));
}

// ------- Migration ---------------------------------------------------------
// One-shot: rewrites old-prefix keys (atom/, molecule/, organism/, template/)
// to new-prefix keys (token/, row/, section/, pattern/). Runs before diff
// so the stored manifest hashes stay coherent with new keys.

async function migrateKeys(index) {
  await figma.loadAllPagesAsync();
  let count = 0;
  const entries = Array.from(index.byKey.entries());
  for (const entry of entries) {
    const key = entry[0];
    const node = entry[1];
    let newKey = key;
    const prefixes = Object.keys(MIGRATION_MAP);
    for (let i = 0; i < prefixes.length; i++) {
      const oldPrefix = prefixes[i];
      if (key.indexOf(oldPrefix) === 0) {
        newKey = MIGRATION_MAP[oldPrefix] + key.slice(oldPrefix.length);
        break;
      }
    }
    if (newKey !== key) {
      node.setPluginData(KEY_CONSTRUCT, newKey);
      index.byKey.delete(key);
      index.byKey.set(newKey, node);
      count++;
    }
  }
  if (count > 0) log("  migrated " + count + " node(s) to new prefix scheme", "dim");
}

// ------- Diff --------------------------------------------------------------

function computeDiff(storedHashes, storedValues) {
  const added = [];
  const modified = [];
  const removed = [];
  const unchanged = [];
  var details = {};
  var newValues = CANONICAL_VALUES || {};
  var oldValues = storedValues || {};

  const canonicalKeys = Object.keys(CANONICAL_HASHES);
  for (let i = 0; i < canonicalKeys.length; i++) {
    const key = canonicalKeys[i];
    if (!storedHashes[key]) {
      added.push(key);
      if (newValues[key]) details[key] = { now: newValues[key] };
    } else if (storedHashes[key] !== CANONICAL_HASHES[key]) {
      modified.push(key);
      var d = {};
      if (oldValues[key]) d.was = oldValues[key];
      if (newValues[key]) d.now = newValues[key];
      if (d.was || d.now) details[key] = d;
    } else {
      unchanged.push(key);
    }
  }

  const storedKeys = Object.keys(storedHashes);
  for (let i = 0; i < storedKeys.length; i++) {
    const key = storedKeys[i];
    if (!CANONICAL_HASHES[key]) removed.push(key);
  }

  return { added: added, modified: modified, removed: removed, unchanged: unchanged, details: details };
}

// ------- Main sync ---------------------------------------------------------

async function syncAll(opts) {
  resetStats();
  log("Sync starting", "dim");

  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  await figma.loadFontAsync({ family: "JetBrains Mono", style: "Regular" }).catch(async (e) => {
    await figma.loadFontAsync({ family: "Roboto Mono", style: "Regular" });
    log("  fallback: JetBrains Mono not available, using Roboto Mono", "warn");
  });

  const index = await indexExisting();
  await migrateKeys(index);
  const seenKeys = new Set();

  await syncTextStyles(seenKeys);
  await syncTokens(index, seenKeys);
  await syncRows(index, seenKeys);
  await syncSections(index, seenKeys);
  await syncBanners(index, seenKeys);
  await syncPatterns(index, seenKeys);
  await syncMirror(index, seenKeys);

  await moveOrphans(seenKeys, index);
  writeManifest(CANONICAL_HASHES);

  log("Done.", "ok");
}
