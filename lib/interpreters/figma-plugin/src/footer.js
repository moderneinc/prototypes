// ------- Plugin entry -----------------------------------------------------
figma.showUI(__html__, { width: 380, height: 560, themeColors: false });

figma.ui.onmessage = async (msg) => {
  // preview: read manifest, compute diff, return to UI — no canvas writes.
  if (msg.type === "preview") {
    try {
      const manifest = readManifest();
      if (!manifest) {
        figma.ui.postMessage({
          type: "preview-result",
          firstSync: true,
          total: Object.keys(CANONICAL_HASHES).length,
        });
        return;
      }
      const diff = computeDiff(manifest.hashes);
      figma.ui.postMessage({
        type: "preview-result",
        firstSync: false,
        diff: diff,
        manifest: {
          version: manifest.version,
          syncedAt: manifest.syncedAt,
          total: Object.keys(manifest.hashes).length,
        },
      });
    } catch (e) {
      figma.ui.postMessage({ type: "preview-result", error: e.message });
      figma.notify("Construct preview failed: " + e.message, { error: true });
    }
    return;
  }

  // apply: run full sync, then return diff result to UI.
  if (msg.type === "apply") {
    // Capture pre-sync diff using the diff passed from the UI (avoids re-reading manifest after write).
    const preDiff = msg.diff || null;
    setLog((line, cls) => figma.ui.postMessage({ type: "log", line: line, cls: cls }));
    try {
      await syncAll({});
      figma.ui.postMessage({
        type: "apply-result",
        diff: preDiff,
        stats: Object.assign({}, STATS),
      });
      const total = STATS.created + STATS.updated + STATS.adopted + STATS.orphaned;
      figma.notify("Construct sync: " + total + " components processed.");
    } catch (e) {
      log("ERROR: " + e.message, "err");
      figma.ui.postMessage({ type: "apply-result", error: e.message });
      figma.notify("Construct sync failed: " + e.message, { error: true });
    }
    return;
  }

  // navigate: scroll Figma viewport to the node with the given construct.key.
  if (msg.type === "navigate") {
    try {
      await figma.loadAllPagesAsync();
      let found = null;
      let foundPage = null;
      for (const page of figma.root.children) {
        const node = page.findOne((n) => n.getPluginData(KEY_CONSTRUCT) === msg.key);
        if (node) {
          found = node;
          foundPage = page;
          break;
        }
      }
      if (found && foundPage) {
        figma.currentPage = foundPage;
        figma.viewport.scrollAndZoomIntoView([found]);
      }
    } catch (e) {
      figma.notify("Navigate failed: " + e.message, { error: true });
    }
    return;
  }

  // Legacy sync message — kept for backward compat.
  if (msg.type === "sync") {
    setLog((line, cls) => figma.ui.postMessage({ type: "log", line: line, cls: cls }));
    try {
      await syncAll({});
      figma.ui.postMessage({
        type: "done",
        summary: Object.assign({}, STATS),
      });
      const total = STATS.created + STATS.updated + STATS.adopted + STATS.orphaned;
      figma.notify("Construct sync: " + total + " components processed.");
    } catch (e) {
      log("ERROR: " + e.message, "err");
      figma.ui.postMessage({ type: "done" });
      figma.notify("Construct sync failed: " + e.message, { error: true });
    }
  }
};
