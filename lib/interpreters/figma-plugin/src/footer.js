// ------- Plugin entry -----------------------------------------------------
figma.showUI(__html__, { width: 360, height: 520, themeColors: false });

figma.ui.onmessage = async (msg) => {
  if (msg.type !== "sync") return;
  setLog((line, cls) => figma.ui.postMessage({ type: "log", line, cls }));
  try {
    await syncAll({ dryRun: !!msg.dryRun });
    figma.ui.postMessage({
      type: "done",
      summary: msg.dryRun ? null : Object.assign({}, STATS),
    });
    if (!msg.dryRun) {
      const total = STATS.created + STATS.updated + STATS.adopted + STATS.orphaned;
      figma.notify("Construct sync: " + total + " components processed.");
    }
  } catch (e) {
    log("ERROR: " + e.message, "err");
    figma.ui.postMessage({ type: "done" });
    figma.notify("Construct sync failed: " + e.message, { error: true });
  }
};
