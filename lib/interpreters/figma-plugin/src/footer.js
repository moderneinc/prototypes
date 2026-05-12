// ------- Plugin entry -----------------------------------------------------
figma.showUI(__html__, { width: 380, height: 560, themeColors: false });

figma.ui.onmessage = async (msg) => {
  // preview: read manifest, compute diff, return to UI — no canvas writes.
  if (msg.type === "preview") {
    try {
      var manifest = readManifest();
      // Manifest exists but all nodes were deleted — reset to first-sync.
      if (manifest) {
        var nodesExist = await hasAnyConstructNodes();
        if (!nodesExist) {
          clearManifest();
          manifest = null;
        }
      }
      if (!manifest) {
        figma.ui.postMessage({
          type: "preview-result",
          firstSync: true,
          total: Object.keys(CANONICAL_HASHES).length,
        });
        return;
      }
      const diff = computeDiff(manifest.hashes, manifest.values || {});
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
        await figma.setCurrentPageAsync(foundPage);
        figma.viewport.scrollAndZoomIntoView([found]);
      }
    } catch (e) {
      figma.notify("Navigate failed: " + e.message, { error: true });
    }
    return;
  }

  // mirror-status: find all mirror nodes and return their approval state.
  if (msg.type === "mirror-status") {
    try {
      await figma.loadAllPagesAsync();
      var mirrorItems = [];
      for (var pi = 0; pi < figma.root.children.length; pi++) {
        var pg = figma.root.children[pi];
        if (pg.name !== PAGE_NAMES.mirror) continue;
        for (var ci = 0; ci < pg.children.length; ci++) {
          var node = pg.children[ci];
          var k = node.getPluginData(KEY_CONSTRUCT);
          if (k && k.indexOf("mirror/") === 0) {
            var nodeName = node.name;
            var status = "proposed";
            var reason = "";
            if (nodeName.indexOf("✓ APPROVED") !== -1) {
              status = "approved";
            } else if (nodeName.indexOf("✗ REJECTED") !== -1) {
              status = "rejected";
              var dashIdx = nodeName.indexOf("— ");
              if (dashIdx !== -1) {
                reason = nodeName.substring(dashIdx + 2);
              }
            }
            mirrorItems.push({ key: k, slug: k.replace("mirror/", ""), status: status, reason: reason });
          }
        }
      }
      figma.ui.postMessage({ type: "mirror-status-result", items: mirrorItems });
    } catch (e) {
      figma.ui.postMessage({ type: "mirror-status-result", items: [], error: e.message });
    }
    return;
  }

  // approve-mirror: mark a mirror item as approved — green border, ✓ badge, name suffix.
  if (msg.type === "approve-mirror") {
    try {
      await figma.loadAllPagesAsync();
      var approveKey = "mirror/" + msg.slug;
      var approveNode = null;
      for (var api = 0; api < figma.root.children.length; api++) {
        var ap = figma.root.children[api];
        approveNode = ap.findOne(function(n) { return n.getPluginData(KEY_CONSTRUCT) === approveKey; });
        if (approveNode) break;
      }
      if (approveNode) {
        approveNode.setPluginData("construct.mirror.status", "approved");
        approveNode.name = "mirror / " + msg.slug + " ✓ APPROVED";
        approveNode.strokes = [{ type: "SOLID", color: hexToRgb(CANONICAL.color.semantic.success.$value) }];
        // Update badge text (first child)
        if (approveNode.children && approveNode.children.length > 0) {
          var badgeNode = approveNode.children[0];
          if (badgeNode.type === "TEXT") {
            await figma.loadFontAsync({ family: "Inter", style: "Bold" });
            badgeNode.characters = "APPROVED";
            badgeNode.fills = [{ type: "SOLID", color: hexToRgb(CANONICAL.color.semantic.success.$value) }];
          }
        }
        figma.notify("✓ Approved: " + msg.slug);
        figma.ui.postMessage({ type: "approve-result", slug: msg.slug, status: "approved" });
      }
    } catch (e) {
      figma.notify("Approve failed: " + e.message, { error: true });
    }
    return;
  }

  // reject-mirror: mark a mirror item as rejected — red border, ✗ badge.
  if (msg.type === "reject-mirror") {
    try {
      await figma.loadAllPagesAsync();
      var rejectKey = "mirror/" + msg.slug;
      var rejectNode = null;
      for (var rpi = 0; rpi < figma.root.children.length; rpi++) {
        var rp = figma.root.children[rpi];
        rejectNode = rp.findOne(function(n) { return n.getPluginData(KEY_CONSTRUCT) === rejectKey; });
        if (rejectNode) break;
      }
      if (rejectNode) {
        var reason = msg.reason || "";
        rejectNode.setPluginData("construct.mirror.status", "rejected");
        rejectNode.setPluginData("construct.mirror.reason", reason);
        rejectNode.name = "mirror / " + msg.slug + " ✗ REJECTED" + (reason ? " — " + reason : "");
        rejectNode.strokes = [{ type: "SOLID", color: hexToRgb(CANONICAL.color.semantic.danger.$value) }];
        if (rejectNode.children && rejectNode.children.length > 0) {
          var rBadge = rejectNode.children[0];
          if (rBadge.type === "TEXT") {
            await figma.loadFontAsync({ family: "Inter", style: "Bold" });
            rBadge.characters = "REJECTED" + (reason ? ": " + reason : "");
            rBadge.fills = [{ type: "SOLID", color: hexToRgb(CANONICAL.color.semantic.danger.$value) }];
          }
        }
        figma.notify("✗ Rejected: " + msg.slug + (reason ? " — " + reason : ""));
        figma.ui.postMessage({ type: "reject-result", slug: msg.slug, status: "rejected" });
      }
    } catch (e) {
      figma.notify("Reject failed: " + e.message, { error: true });
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
