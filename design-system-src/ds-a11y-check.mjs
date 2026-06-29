#!/usr/bin/env node
// WCAG 2.1 contrast audit for the SaaS design-system tokens.
// Run: node .context/ds-a11y-check.mjs
// Reports contrast ratios for every foreground/background token pair that
// carries meaning, in both light and dark themes. AA thresholds:
//   normal text 4.5 · large/bold text & UI components/graphics 3.0
// Pairs flagged FAIL if below their required ratio.

const hex = (h) => {
  h = h.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
};
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const L = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const l1 = L(a), l2 = L(b); const hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + 0.05) / (lo + 0.05); };
// mix hexA over hexB at ratioA (mirrors color-mix used for the punchier soft tints)
const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, "0");
const mix = (a, b, ra) => { const A = hex(a), B = hex(b); return "#" + [0, 1, 2].map((i) => toHex(A[i] * ra + B[i] * (1 - ra))).join(""); };

// ── PROPOSED palette (violet primary; green = status only) ──────────────────
const LIGHT = {
  light: true,
  bg: "#f5f6f8", surface: "#ffffff", panel: "#ffffff", bgAlt: "#eaecf0",
  ink: "#18191c", inkDim: "#44464d", muted: "#696c74", muted2: "#7e818b",
  // primary (deep TEAL — brand & action; dark fill + white text on light)
  primary: "#0e4a45", primaryHover: "#12605a", primaryInk: "#0e4a45", onPrimary: "#ffffff",
  docsPrimary: "#1d5937", docsOn: "#ffffff", docsInk: "#1d5937",   // Docs surface: deep green on light

  // status (vivid fills + AA inks)
  greenInk: "#096540", green: "#15cf76", onGreen: "#08130d",
  redInk: "#b02a17", red: "#e5331f", danger: "#c4291a", onRed: "#ffffff",
  warnInk: "#8a5300", warn: "#e0a020", infoInk: "#1d5fb0", info: "#2f7fe0",
  // expanded rainbow inks (text on light)
  magenta: "#7a1e52", violet: "#3f1340", blue: "#16306b", teal: "#0e4a45", catGreen: "#1d5937", lime: "#4f5a12",
  pink: "#c5208a", indigo: "#4f46e5", cyan: "#0e7490", gold: "#8a6300", orange: "#b45309",
};
const DARK = {
  bg: "#0c0d10", surface: "#14161b", panel: "#181a20",
  ink: "#e8eaee", inkDim: "#b4bac3", muted: "#858c97", muted2: "#646b76",
  primary: "#25d0c8", primaryInk: "#5eecd0", onPrimary: "#06231d",
  docsPrimary: "#30f284", docsOn: "#04220f", docsInk: "#30f284",   // Docs surface: Digital Green
  greenInk: "#5fe6a8", green: "#33ff99", onGreen: "#10130d",
  redInk: "#ff9a8e", danger: "#d63420", onRed: "#ffffff", warnInk: "#f0c674", infoInk: "#8bb6ff",
  magenta: "#ff7ac9", violet: "#c4b5fd", blue: "#7cc0ff", teal: "#5eecd0", catGreen: "#5fe6a8", lime: "#c7e84b",
  pink: "#ff7ac9", indigo: "#a5b4fc", cyan: "#5fd6ff", gold: "#f0c674", orange: "#ffb066",
};

// pair = [label, fg, bg, requiredRatio]
const T = 4.5, U = 3.0;
const pairs = (P, on) => [
  ["ink / panel", P.ink, P.panel, T],
  ["ink / surface", P.ink, P.surface, T],
  ["ink / bg", P.ink, P.bg, T],
  ["inkDim / panel (body)", P.inkDim, P.panel, T],
  ["inkDim / bg (body)", P.inkDim, P.bg, T],
  ["muted / panel (labels)", P.muted, P.panel, T],
  ["muted / bg (labels)", P.muted, P.bg, T],
  ["muted2 / bg (caption→large only)", P.muted2 || P.muted, P.bg, U],
  ["primary-ink link / panel", P.primaryInk, P.panel, T],
  ["primary-ink link / bg", P.primaryInk, P.bg, T],
  ["on-primary text / primary fill", P.onPrimary, P.primary, T],
  ["docs on-primary / green fill", P.docsOn, P.docsPrimary, T],
  ["docs green-ink / panel", P.docsInk, P.panel, T],
  ["green-ink / panel", P.greenInk, P.panel, T],
  ["green-ink / bg", P.greenInk, P.bg, T],
  ["on-green / green fill", P.onGreen, P.green, T],
  ["red-ink / panel", P.redInk, P.panel, T],
  ...(P.onRed ? [["on-red text / danger fill", P.onRed, P.danger, T]] : []),
  ["warn-ink / panel", P.warnInk, P.panel, T],
  ["info-ink / panel", P.infoInk, P.panel, T],
  // 6 kit strands (shared) + SaaS-only extras — inks as text on the lightest surface
  ["cat magenta / panel", P.magenta, P.panel, T],
  ["cat violet / panel", P.violet, P.panel, T],
  ["cat blue / panel", P.blue, P.panel, T],
  ["cat teal / panel", P.teal, P.panel, T],
  ["cat green / panel", P.catGreen, P.panel, T],
  ["cat lime / panel", P.lime, P.panel, T],
  ["cat pink / panel", P.pink, P.panel, T],
  ["cat indigo / panel", P.indigo, P.panel, T],
  ["cat cyan / panel", P.cyan, P.panel, T],
  ["cat gold / panel", P.gold, P.panel, T],
  ["cat orange / panel", P.orange, P.panel, T],
  // colored text on the PUNCHIER (deeper) soft tints — badges / alerts. Light only;
  // dark soft tints are low-alpha over a dark panel, so light ink keeps high contrast.
  ...(P.light ? [
    ["primary-ink / primary-soft (badge)", P.primaryInk, mix(P.primary, P.panel, 0.20), T],
    ["green-ink / green-soft (badge)", P.greenInk, mix(P.green, P.panel, 0.22), T],
    ["red-ink / red-soft (badge)", P.redInk, mix(P.red, P.panel, 0.18), T],
    ["warn-ink / warn-soft (badge)", P.warnInk, mix(P.warn, P.panel, 0.28), T],
    ["info-ink / info-soft (badge)", P.infoInk, mix(P.info, P.panel, 0.20), T],
  ] : []),
];

function run(name, P) {
  console.log(`\n══ ${name} ${"═".repeat(40 - name.length)}`);
  let fails = 0;
  for (const [label, fg, bg, req] of pairs(P)) {
    const r = ratio(fg, bg);
    const ok = r >= req;
    if (!ok) fails++;
    const tag = ok ? "PASS" : "FAIL";
    console.log(`  ${tag}  ${r.toFixed(2).padStart(5)}:1  (≥${req})  ${label}   ${fg} on ${bg}`);
  }
  console.log(`  → ${fails === 0 ? "ALL PASS" : fails + " FAIL(S)"}`);
  return fails;
}

// SaaS WARM base tone = the moderne.ai marketing ground; same vivid fills/inks
// as DARK, just the warm canvas/ink. Verify body/muted text still clears AA.
const WARM = { ...DARK, bg: "#0c0a08", surface: "#13100d", panel: "#191510",
  ink: "#f1ece0", inkDim: "#c9bfa6", muted: "#9c927e", muted2: "#6f6757" };

// DOCS ground = the design-kit warm canvas (#100C0A) + cream ink; green primary.
// Verify ink / body / muted text + the green primary clear AA on the warm cards.
const DOCS = { ...DARK, bg: "#100c0a", surface: "#1c1714", panel: "#241d18",
  ink: "#f2ede4", inkDim: "#aaa59e", muted: "#8a857d", muted2: "#6a655d",
  primary: "#30f284", primaryInk: "#30f284", onPrimary: "#04220f" };

const f1 = run("LIGHT theme", LIGHT);
const f2 = run("DARK theme (SaaS cool)", DARK);
const f3 = run("DARK theme (SaaS warm · moderne.ai)", WARM);
const f4 = run("DARK theme (Docs · warm kit #100C0A)", DOCS);
console.log(`\nTOTAL: ${f1 + f2 + f3 + f4} failure(s).`);
process.exit(f1 + f2 + f3 + f4 === 0 ? 0 : 1);
