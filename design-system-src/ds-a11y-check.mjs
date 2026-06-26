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
  // primary (vivid GREEN — brand & action, dark text; doubles as success)
  primary: "#15cf76", primaryHover: "#10b866", primaryInk: "#096540", onPrimary: "#08130d",
  // status (vivid fills + AA inks)
  greenInk: "#096540", green: "#15cf76", onGreen: "#08130d",
  redInk: "#b02a17", red: "#e5331f", danger: "#c4291a", onRed: "#ffffff",
  warnInk: "#8a5300", warn: "#e0a020", infoInk: "#1d5fb0", info: "#2f7fe0",
  // expanded rainbow inks (text on light)
  pink: "#c5208a", magenta: "#7a1e52", violet: "#7c3aed", indigo: "#4f46e5",
  blue: "#1f6fd6", cyan: "#0e7490", teal: "#0e4a45", gold: "#8a6300", orange: "#b45309",
};
const DARK = {
  bg: "#0c0d10", surface: "#14161b", panel: "#181a20",
  ink: "#e8eaee", inkDim: "#b4bac3", muted: "#858c97", muted2: "#646b76",
  primary: "#33ff99", primaryInk: "#5fe6a8", onPrimary: "#10130d",
  greenInk: "#5fe6a8", green: "#33ff99", onGreen: "#10130d",
  redInk: "#ff9a8e", danger: "#d63420", onRed: "#ffffff", warnInk: "#f0c674", infoInk: "#8bb6ff",
  pink: "#ff7ac9", magenta: "#ff7ac9", violet: "#c4b5fd", indigo: "#a5b4fc",
  blue: "#7cc0ff", cyan: "#5fd6ff", teal: "#5eecd0", gold: "#f0c674", orange: "#ffb066",
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
  ["green-ink / panel", P.greenInk, P.panel, T],
  ["green-ink / bg", P.greenInk, P.bg, T],
  ["on-green / green fill", P.onGreen, P.green, T],
  ["red-ink / panel", P.redInk, P.panel, T],
  ...(P.onRed ? [["on-red text / danger fill", P.onRed, P.danger, T]] : []),
  ["warn-ink / panel", P.warnInk, P.panel, T],
  ["info-ink / panel", P.infoInk, P.panel, T],
  // expanded rainbow inks as text on the lightest surface
  ["cat pink / panel", P.pink, P.panel, T],
  ["cat magenta / panel", P.magenta, P.panel, T],
  ["cat violet / panel", P.violet, P.panel, T],
  ["cat indigo / panel", P.indigo, P.panel, T],
  ["cat blue / panel", P.blue, P.panel, T],
  ["cat cyan / panel", P.cyan, P.panel, T],
  ["cat teal / panel", P.teal, P.panel, T],
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

const f1 = run("LIGHT theme", LIGHT);
const f2 = run("DARK theme", DARK);
console.log(`\nTOTAL: ${f1 + f2} failure(s).`);
process.exit(f1 + f2 === 0 ? 0 : 1);
