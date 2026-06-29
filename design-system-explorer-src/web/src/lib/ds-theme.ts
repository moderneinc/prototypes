// Interactive theme builder for the design-system showcase.
// Pick a PRIMARY + SECONDARY color AND a primary (UI) + secondary (mono) FONT
// from curated, competition-informed options. Choices live-apply to the whole
// site (the showcase is itself built with the system tokens), persist in
// localStorage across every gallery page AND the example screens, and can be
// shared via "Copy CSS".
//
// Color values are AA-validated for the dark theme (see .context/ds-a11y-check.mjs).

// `fillL` = the AA-deep version used on LIGHT (carries white text; also reads as
// ink/links on white). Dark uses fill/ink/on. Light uses fillL + white text.
type Hue = { name: string; fill: string; ink: string; on: string; fillL: string };

const PALETTE: Hue[] = [
  { name: "Green",   fill: "#30f284", ink: "#5fe6a8", on: "#04220f", fillL: "#1d5937" },   /* Digital Green — brand accent (kit) */
  { name: "Emerald", fill: "#19e085", ink: "#5fe6a8", on: "#08130d", fillL: "#0d7948" },
  { name: "Teal",    fill: "#25d0c8", ink: "#5eecd0", on: "#06231d", fillL: "#0e4a45" },
  { name: "Cyan",    fill: "#38bdf8", ink: "#7dd3fc", on: "#06202b", fillL: "#227195" },
  { name: "Blue",    fill: "#4f8ff5", ink: "#93c5fd", on: "#071426", fillL: "#3a6ab5" },
  { name: "Cobalt",  fill: "#3a6df0", ink: "#93b9ff", on: "#ffffff", fillL: "#3564dd" },
  { name: "Indigo",  fill: "#5b50e6", ink: "#b0b0fb", on: "#ffffff", fillL: "#4e44c9" },
  { name: "Violet",  fill: "#7b4fe0", ink: "#c4b5fd", on: "#ffffff", fillL: "#6d28d9" },
  { name: "Magenta", fill: "#ff5ba3", ink: "#ff7ac9", on: "#10130d", fillL: "#b24072" },
  { name: "Crimson", fill: "#d62f44", ink: "#fca5a5", on: "#ffffff", fillL: "#c92c40" },
  { name: "Amber",   fill: "#f5b528", ink: "#f0c674", on: "#241a02", fillL: "#896516" },
  { name: "Orange",  fill: "#fb923c", ink: "#ffb066", on: "#1f1203", fillL: "#9c5b25" },
];

// Fonts. `g` = Google Fonts family spec (loaded on demand); null = native stack.
// UI sans: Poppins is the marketing face; Inter is the dev-tool SaaS standard
// (Linear/GitHub/Figma); Geist is Vercel's modern take; System loads nothing.
type Font = { name: string; stack: string; g: string | null };
const SANS: Font[] = [
  { name: "Inter",   stack: '"Inter",ui-sans-serif,system-ui,sans-serif',   g: "Inter:wght@400;500;600;700" },
  { name: "Poppins", stack: '"Poppins",ui-sans-serif,system-ui,sans-serif', g: "Poppins:wght@400;500;600;700" },
  { name: "Geist",   stack: '"Geist",ui-sans-serif,system-ui,sans-serif',   g: "Geist:wght@400;500;600;700" },
];
const MONO: Font[] = [
  // Default: keep the body face (Inter) for data too — one typeface everywhere.
  // Inter's tabular figures (tnum, applied via --ds-num) keep numerals aligned.
  { name: "Inter", stack: '"Inter",ui-sans-serif,system-ui,sans-serif', g: "Inter:wght@400;500;600;700" },
  { name: "JetBrains", stack: '"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace', g: "JetBrains+Mono:wght@400;500;700" },
  { name: "Geist Mono", stack: '"Geist Mono",ui-monospace,SFMono-Regular,Menlo,monospace', g: "Geist+Mono:wght@400;500;700" },
  { name: "Space Mono", stack: '"Space Mono",ui-monospace,SFMono-Regular,Menlo,monospace', g: "Space+Mono:wght@400;700" },
  { name: "IBM Plex", stack: '"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace', g: "IBM+Plex+Mono:wght@400;500;600" },
];

const KEY = "ds-colors";
// Default surface is SaaS: Teal primary (decoupled from success-green) + Violet
// accent, Inter for UI and data, on the dark ground. (Docs surface overrides
// these — see SURFACES below.)
const DEFAULTS = { primary: "Teal", secondary: "Violet", fontSans: "Inter", fontMono: "Inter", base: "cool", surface: "saas", mode: "dark" };
const current = { ...DEFAULTS };

const toRGB = (h: string) => h.replace("#", "").match(/../g)!.map((v) => parseInt(v, 16));
const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
const mix = (a: string, b: string, t: number) => {
  const A = toRGB(a), B = toRGB(b);
  return "#" + [0, 1, 2].map((i) => toHex(A[i] * (1 - t) + B[i] * t)).join("");
};

const loaded = new Set<string>();
function ensureFont(g: string | null): void {
  if (!g || loaded.has(g)) return;
  loaded.add(g);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${g}&display=swap`;
  document.head.appendChild(link);
}

function applyColor(role: "primary" | "secondary", h: Hue): void {
  const s = document.documentElement.style;
  const light = current.mode === "light";
  // LIGHT: deep fill + white text + deep ink, hover darkens. DARK: bright fill +
  // dark text + light ink, hover lightens.
  const fill = light ? h.fillL : h.fill;
  s.setProperty(`--ds-${role}`, fill);
  s.setProperty(`--ds-${role}-hover`, mix(fill, light ? "#000000" : "#ffffff", light ? 0.12 : 0.14));
  s.setProperty(`--ds-${role}-ink`, light ? h.fillL : h.ink);
  s.setProperty(`--ds-on-${role}`, light ? "#ffffff" : h.on);
  if (role === "primary") s.setProperty("--ds-primary-pressed", mix(fill, "#000000", 0.15));
}
// mode = light / dark; dark is the default :root (no attribute)
function applyMode(m: string): void {
  if (m === "light") document.documentElement.setAttribute("data-theme", "light");
  else document.documentElement.removeAttribute("data-theme");
}
function applyFont(which: "sans" | "mono", f: Font): void {
  ensureFont(f.g);
  document.documentElement.style.setProperty(`--ds-font-${which}`, f.stack);
}
// base = the SaaS ground register: "cool" (default — product/tool register) or "warm" (matches moderne.ai)
function applyBase(base: string): void {
  if (base === "warm") document.documentElement.setAttribute("data-base", "warm");
  else document.documentElement.removeAttribute("data-base");
}

const hue = (name: string) => PALETTE.find((h) => h.name === name)!;
const sans = (name: string) => SANS.find((f) => f.name === name)!;
const mono = (name: string) => MONO.find((f) => f.name === name)!;

// Two surface profiles — the SaaS/Platform app vs the public-facing Docs site —
// over ONE shared brand spine. Each carries its own recommended defaults, a
// reduced (curated) font menu, and an explanation that states what was chosen,
// why, and which brand-rollout epic items it addresses.
type Surface = "saas" | "docs";
type SurfaceCfg = { label: string; primary: string; secondary: string; fontSans: string; fontMono: string; base: string; sans: string[]; mono: string[]; explain: string };
const SURFACES: Record<Surface, SurfaceCfg> = {
  saas: {
    label: "SaaS / Platform", primary: "Teal", secondary: "Violet", fontSans: "Inter", fontMono: "Inter", base: "cool",
    sans: ["Inter", "Geist"], mono: ["Inter", "JetBrains"],
    explain:
      "<p>The product surface — dense application UI.</p>" +
      "<ul>" +
      "<li><b>Recommended colour — Teal (default).</b> Teal is the action colour, kept deliberately distinct from brand-green so &ldquo;do it&rdquo; reads differently from &ldquo;on brand.&rdquo; Success stays green; magenta is reserved for marketing.</li>" +
      "<li><b>Recommended type — Inter (default, UI + data).</b> Built for dense, small-size legibility (the dev-tool standard); its tabular figures keep numerals aligned, so one typeface covers both UI and data. Geist / JetBrains are offered as alternates.</li>" +
      "<li><b>Cool ground by default — the product/tool register.</b> A cool neutral near-black, deliberately distinct from the brand-warm Docs surface, so the app reads as the tool. A warm tone matching <b>moderne.ai</b> is one click away. Either way it stays <b>flat — no glow</b> — engineered and calm for dense, long-session app use.</li>" +
      "<li><b>Full categorical palette.</b> The 6 brand strands <i>plus</i> extra hues (pink, indigo, cyan, gold, orange), because data-viz needs more categories. All on the shared brand spine.</li>" +
      "</ul>" +
      "<span class=\"ds-explain-epic\">Epic — addresses: Shared token source &middot; Apply dark theme to the Platform site &middot; Brand QA (Product &rarr; Docs &rarr; Platform).</span>",
  },
  docs: {
    label: "Docs", primary: "Green", secondary: "Violet", fontSans: "Poppins", fontMono: "IBM Plex", base: "cool",
    sans: ["Poppins", "Inter"], mono: ["IBM Plex", "JetBrains"],
    explain:
      "<p>Public-facing, so it must read as the brand.</p>" +
      "<ul>" +
      "<li><b>Recommended colour — Digital Green #30F284 (default).</b> The kit assigns Docs no separate hue, so it holds the brand accent and is differentiated by restraint, not palette. On light it deepens to #1D5937; Midnight #041834 is reserved as the secondary / light-mode brand blue.</li>" +
      "<li><b>Recommended type — Poppins + IBM Plex Mono (default).</b> Poppins is the production stand-in for the brand face Beausite; IBM Plex Mono is the kit&rsquo;s canon for code and technical text.</li>" +
      "<li><b>Warm brand ground + glow.</b> Docs uses the kit&rsquo;s canonical warm canvas (#100C0A, cream ink) and the one sanctioned soft green hero glow — it is the brand-facing surface.</li>" +
      "<li><b>Restrained palette — the 6 strands only.</b> Just the formalized 6-strand spectrum (no extra hues): less colour, more brand discipline. Same shared spine as SaaS otherwise.</li>" +
      "</ul>" +
      "<span class=\"ds-explain-epic\">Epic — addresses: Extract &amp; document tokens (colour, type) &middot; Shared token source &middot; Apply dark theme to Docs &middot; Brand QA.</span>",
  },
};
const surfSans = () => SURFACES[current.surface as Surface].sans.map(sans);
const surfMono = () => SURFACES[current.surface as Surface].mono.map(mono);
// The per-surface rationale now lives in the SaaS / Docs intro views (not the
// cramped builder panel); the examples viewer pulls it from here.
export function surfaceExplain(s: "saas" | "docs"): string { return SURFACES[s].explain; }

// The tuning state that round-trips to localStorage AND the shareable URL hash.
const HASH_KEYS = ["mode", "surface", "primary", "secondary", "fontSans", "fontMono", "base"] as const;
let hashReady = false; // don't write the URL until init has applied the incoming state

// validate + apply a loose {key:value} object (from localStorage or the URL hash)
function assignState(s: Record<string, string | null | undefined>): void {
  if (s.primary && PALETTE.some((h) => h.name === s.primary)) current.primary = s.primary;
  if (s.secondary && PALETTE.some((h) => h.name === s.secondary)) current.secondary = s.secondary;
  if (s.fontSans && SANS.some((f) => f.name === s.fontSans)) current.fontSans = s.fontSans;
  if (s.fontMono && MONO.some((f) => f.name === s.fontMono)) current.fontMono = s.fontMono;
  if (s.base === "cool" || s.base === "warm") current.base = s.base;
  if (s.surface === "saas" || s.surface === "docs") current.surface = s.surface;
  if (s.mode === "light" || s.mode === "dark") current.mode = s.mode;
}

function persist(): void {
  try { localStorage.setItem(KEY, JSON.stringify(current)); } catch { /* ignore */ }
  syncHash(); updateCustomFlag();
}

// "Custom" = the tuning deviates from THIS surface's recommended defaults (i.e. the
// page's default look). The surface itself is page-driven, so it isn't a customization.
const SURF_KEYS = ["primary", "secondary", "fontSans", "fontMono", "base"] as const;
function isCustom(): boolean {
  const d = SURFACES[current.surface as Surface] as unknown as Record<string, string>;
  return SURF_KEYS.some((k) => (current as Record<string, string>)[k] !== d[k]);
}
function updateCustomFlag(): void {
  const el = document.querySelector<HTMLElement>("[data-customflag]");
  if (el) el.hidden = !isCustom();
}

// Shareable link: serialise the NON-default tuning values into the location hash
// (#primary=Teal&fontSans=Geist…). replaceState → live URL, no scroll, no history spam.
function syncHash(): void {
  if (!hashReady) return;
  const p = new URLSearchParams();
  for (const k of HASH_KEYS) {
    const v = (current as Record<string, string>)[k];
    if (v !== (DEFAULTS as Record<string, string>)[k]) p.set(k, v);
  }
  const q = p.toString();
  try { history.replaceState(null, "", q ? "#" + q : location.pathname + location.search); } catch { /* ignore */ }
}
// Rehydrate from a shared link's hash. Returns true if anything was applied.
function readHash(): boolean {
  const raw = location.hash.replace(/^#/, "");
  if (!raw) return false;
  const p = new URLSearchParams(raw);
  const obj: Record<string, string> = {}; let any = false;
  HASH_KEYS.forEach((k) => { const v = p.get(k); if (v) { obj[k] = v; any = true; } });
  if (any) assignState(obj);
  return any;
}
// push the active overrides into any embedded screen iframes (live theming)
function broadcast(): void {
  const css = document.documentElement.style.cssText;
  const base = document.documentElement.getAttribute("data-base") || "";
  const surface = document.documentElement.getAttribute("data-surface") || "saas";
  const mode = document.documentElement.getAttribute("data-theme") || "dark";
  document.querySelectorAll("iframe").forEach((f) => {
    try { (f as HTMLIFrameElement).contentWindow?.postMessage({ type: "ds-theme", css, base, surface, mode }, "*"); } catch { /* ignore */ }
  });
}
function restore(): void {
  try { assignState(JSON.parse(localStorage.getItem(KEY) || "null") || {}); } catch { /* ignore */ }
  // a shared link's #hash wins — and starts from the defaults so it rehydrates
  // EXACTLY (absent keys = default, not the opener's saved prefs)
  if (location.hash.replace(/^#/, "")) { Object.assign(current, DEFAULTS); readHash(); }
}

function cssSnippet(): string {
  const p = hue(current.primary), s = hue(current.secondary);
  return `:root{\n  --ds-primary:${p.fill}; --ds-primary-ink:${p.ink}; --ds-on-primary:${p.on};\n  --ds-secondary:${s.fill}; --ds-secondary-ink:${s.ink}; --ds-on-secondary:${s.on};\n  --ds-font-sans:${sans(current.fontSans).stack};\n  --ds-font-mono:${mono(current.fontMono).stack};\n}`;
}

export function initDsTheme(): void {
  restore();
  // establish the surface, then apply the active (or persisted) choice on every
  // page, incl. example screens. (We apply unconditionally now: the surface can
  // move the baseline away from the CSS :root defaults.)
  applyMode(current.mode); // before applyColor — it picks light/dark variants
  document.documentElement.setAttribute("data-surface", current.surface);
  applyColor("primary", hue(current.primary));
  applyColor("secondary", hue(current.secondary));
  applyFont("sans", sans(current.fontSans));
  applyFont("mono", mono(current.fontMono));
  applyBase(current.base);

  // live-sync: an embedded screen receives the parent's overrides via postMessage
  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "ds-theme" && typeof e.data.css === "string") {
      document.documentElement.style.cssText = e.data.css;
      if (typeof e.data.base === "string") applyBase(e.data.base);
      if (e.data.surface === "saas" || e.data.surface === "docs") document.documentElement.setAttribute("data-surface", e.data.surface);
      if (e.data.mode === "light" || e.data.mode === "dark") applyMode(e.data.mode);
    }
  });

  const panel = document.querySelector<HTMLElement>(".ds-theme-panel");
  if (!panel) return; // example screens have no builder UI — they just inherit the theme

  const label = panel.querySelector<HTMLElement>("[data-theme-current]")!;
  const out = panel.querySelector<HTMLElement>(".ds-theme-out")!;
  const updateLabel = () => { label.textContent = `${SURFACES[current.surface as Surface].label} · ${current.primary} · ${current.fontSans}`; };

  // color swatches
  panel.querySelectorAll<HTMLElement>(".ds-sw-row").forEach((row) => {
    const role = row.dataset.role as "primary" | "secondary";
    row.innerHTML = "";
    for (const h of PALETTE) {
      const b = document.createElement("button");
      b.className = "ds-sw"; b.style.background = h.fill; b.title = h.name;
      b.setAttribute("aria-label", `${role} ${h.name}`);
      b.setAttribute("aria-pressed", String(current[role] === h.name));
      b.addEventListener("click", () => {
        current[role] = h.name; applyColor(role, h); persist(); broadcast();
        row.querySelectorAll(".ds-sw").forEach((el) => el.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true"); updateLabel();
      });
      row.appendChild(b);
    }
  });

  // font pills — rendered from the ACTIVE surface's curated (reduced) menu;
  // re-rendered when the surface changes.
  const renderFonts = () => {
    panel.querySelectorAll<HTMLElement>(".ds-font-row[data-font]").forEach((row) => {
      const which = row.dataset.font as "sans" | "mono";
      const opts = which === "sans" ? surfSans() : surfMono();
      const key = which === "sans" ? "fontSans" : "fontMono";
      row.innerHTML = "";
      for (const f of opts) {
        const b = document.createElement("button");
        b.className = "ds-fontpill"; b.textContent = f.name; b.style.fontFamily = f.stack;
        b.setAttribute("aria-pressed", String(current[key as "fontSans" | "fontMono"] === f.name));
        b.addEventListener("click", () => {
          (current as Record<string, string>)[key] = f.name; applyFont(which, f); persist(); broadcast();
          row.querySelectorAll(".ds-fontpill").forEach((el) => el.setAttribute("aria-pressed", "false"));
          b.setAttribute("aria-pressed", "true"); updateLabel();
        });
        row.appendChild(b);
      }
    });
  };
  renderFonts();

  const syncSwatchAria = () => {
    panel.querySelectorAll<HTMLElement>(".ds-sw-row").forEach((row) => {
      const def = row.dataset.role === "primary" ? current.primary : current.secondary;
      row.querySelectorAll<HTMLElement>(".ds-sw").forEach((el) => el.setAttribute("aria-pressed", String(el.title === def)));
    });
  };
  const syncSurfaceAria = () => panel.querySelectorAll<HTMLElement>("[data-surface-row] button[data-surface]")
    .forEach((el) => el.setAttribute("aria-pressed", String(el.dataset.surface === current.surface)));

  // switching surface resets colour + fonts to that surface's recommended
  // defaults and swaps in its reduced font menu. (The rationale lives in the
  // SaaS / Docs intro views, not here.)
  const applySurface = (s: Surface) => {
    if (current.surface === s) { syncSurfaceAria(); return; } // already here — keep any tweaks
    const cfg = SURFACES[s];
    current.surface = s;
    current.primary = cfg.primary; current.secondary = cfg.secondary;
    current.fontSans = cfg.fontSans; current.fontMono = cfg.fontMono;
    current.base = cfg.base; // entering a surface resets to its default base tone (SaaS → cool)
    document.documentElement.setAttribute("data-surface", s);
    applyColor("primary", hue(cfg.primary)); applyColor("secondary", hue(cfg.secondary));
    applyFont("sans", sans(cfg.fontSans)); applyFont("mono", mono(cfg.fontMono));
    applyBase(cfg.base);
    renderFonts(); syncSwatchAria(); syncSurfaceAria(); syncBaseLock(); persist(); broadcast(); updateLabel();
  };
  // click is a no-op on a locked (aria-disabled) pill; aria-disabled keeps the
  // element hoverable so its explanatory title tooltip shows (a real `disabled`
  // button would suppress the tooltip).
  panel.querySelectorAll<HTMLButtonElement>("[data-surface-row] button[data-surface]").forEach((b) => {
    b.addEventListener("click", () => {
      if (b.getAttribute("aria-disabled") === "true") return;
      applySurface(b.dataset.surface as Surface);
    });
  });
  syncSurfaceAria();

  // base tone (ground) pills — SaaS only; the WARM tone matches moderne.ai. On
  // Docs the pills are disabled (with a tooltip): Docs' warm brand ground is fixed.
  const baseBtns = panel.querySelectorAll<HTMLButtonElement>("[data-base-row] button[data-base]");
  const syncBaseLock = () => {
    const locked = current.surface === "docs";
    baseBtns.forEach((b) => {
      b.setAttribute("aria-disabled", String(locked));
      if (locked) b.title = "Base tone is fixed for Docs — it uses the brand's warm canvas. Switch to a SaaS section to choose.";
      else b.removeAttribute("title");
      b.setAttribute("aria-pressed", String(b.dataset.base === current.base));
    });
  };
  baseBtns.forEach((b) => {
    b.addEventListener("click", () => {
      if (b.getAttribute("aria-disabled") === "true") return;
      current.base = b.dataset.base!; applyBase(current.base); persist(); broadcast();
      baseBtns.forEach((el) => el.setAttribute("aria-pressed", String(el === b)));
    });
  });
  syncBaseLock();

  // mode pills — light / dark. Switching re-applies the colours so custom picks
  // use the right (light vs dark) variant.
  const modeBtns = panel.querySelectorAll<HTMLButtonElement>("[data-mode-row] button[data-mode]");
  const applyModeFull = (m: string) => {
    current.mode = m; applyMode(m);
    applyColor("primary", hue(current.primary)); applyColor("secondary", hue(current.secondary));
    modeBtns.forEach((el) => el.setAttribute("aria-pressed", String(el.dataset.mode === m)));
    persist(); broadcast(); updateCustomFlag();
  };
  modeBtns.forEach((b) => b.addEventListener("click", () => applyModeFull(b.dataset.mode!)));
  modeBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === current.mode)));

  // Section lock — you can't cross-theme: inside SaaS sections the Docs pill is
  // disabled and vice-versa; neutral pages (intro/foundations/accessibility)
  // allow both. The section is derived from the page; the examples viewer locks
  // per-screen via the ds-set-surface event. Locked pills carry a tooltip saying
  // why and where to switch.
  const LABEL: Record<Surface, string> = { saas: "SaaS", docs: "Docs" };
  const pillOf = (s: Surface) => panel.querySelector<HTMLButtonElement>(`[data-surface-row] button[data-surface="${s}"]`);
  const lock = (allowed: "saas" | "docs" | "both") => {
    (["saas", "docs"] as Surface[]).forEach((s) => {
      const pill = pillOf(s);
      if (!pill) return;
      const locked = allowed !== "both" && allowed !== s;
      pill.setAttribute("aria-disabled", String(locked));
      if (locked) {
        const here = LABEL[allowed as Surface];
        pill.title = `${LABEL[s]} theme is locked while you're in a ${here} section — open a ${LABEL[s]} page to preview it.`;
      } else {
        pill.removeAttribute("title");
      }
    });
  };
  const sectionOf = (): "saas" | "docs" | "examples" | "neutral" => {
    const p = location.pathname;
    if (p.includes("/examples")) return "examples";
    if (/\/(forms|navigation|data-display|feedback|dataviz)\//.test(p)) return "saas";
    return "neutral"; // intro, foundations, accessibility
  };
  const section = sectionOf();
  const hashSurface = new URLSearchParams(location.hash.replace(/^#/, "")).get("surface");
  if (section === "saas") { applySurface("saas"); lock("saas"); }
  // Overview (intro / foundations / accessibility) is brand/public-facing, so it
  // defaults to the Docs theme — UNLESS a shared link specified a surface (honour it).
  // Both toggles stay enabled for exploration.
  else if (section === "neutral") { if (!hashSurface) applySurface("docs"); lock("both"); }

  // the examples viewer auto-selects the surface when you open a screen / intro
  document.addEventListener("ds-set-surface", (e) => {
    const s = (e as CustomEvent).detail;
    if (s === "saas" || s === "docs") { applySurface(s); if (section === "examples") lock(s); }
  });

  // Shareable URL: rehydrate live if the hash changes (shared link, back/forward,
  // manual edit). Our own replaceState() doesn't fire hashchange, so no loop.
  window.addEventListener("hashchange", () => {
    if (!readHash()) return;
    applyMode(current.mode);
    document.documentElement.setAttribute("data-surface", current.surface);
    applyColor("primary", hue(current.primary)); applyColor("secondary", hue(current.secondary));
    applyFont("sans", sans(current.fontSans)); applyFont("mono", mono(current.fontMono));
    applyBase(current.base);
    broadcast(); renderFonts(); syncSwatchAria(); syncSurfaceAria(); syncBaseLock();
    modeBtns.forEach((el) => el.setAttribute("aria-pressed", String(el.dataset.mode === current.mode)));
    updateCustomFlag(); updateLabel();
  });
  hashReady = true; // init done — user changes now write the URL live
  updateCustomFlag(); // reflect whether we loaded a custom (shared) theme

  updateLabel();

  const trigger = document.querySelector<HTMLButtonElement>(".ds-theme-trigger")!;
  let fontsEnsured = false;
  const setOpen = (open: boolean) => {
    panel.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
    if (open && !fontsEnsured) { // load preview fonts only when the panel is first opened
      fontsEnsured = true;
      [...SANS, ...MONO].forEach((f) => ensureFont(f.g));
    }
  };
  trigger.addEventListener("click", (e) => { e.stopPropagation(); setOpen(panel.hidden); });
  panel.addEventListener("click", (e) => e.stopPropagation());
  document.addEventListener("click", () => setOpen(false));

  // First-visit coachmark: auto-open the builder once and explain it.
  const COACH_KEY = "ds-coach-seen";
  let coachSeen = true;
  try { coachSeen = localStorage.getItem(COACH_KEY) === "1"; } catch { /* storage blocked → skip */ }
  if (!coachSeen) {
    setOpen(true);
    const coach = document.createElement("div");
    coach.className = "ds-coach";
    coach.innerHTML =
      "<b>Build a theme — live</b>" +
      "<p>This whole site is themed by these controls. Pick a <b>primary</b> and <b>accent</b> colour, swap the " +
      "<b>fonts</b>, or switch the <b>base ground</b> (cool or warm). Everything re-themes instantly and follows you across pages.</p>" +
      '<button type="button" class="ds-btn ds-btn--primary ds-btn--sm" data-coach-dismiss>Got it — let me play</button>';
    panel.insertBefore(coach, panel.firstChild);
    const dismiss = () => {
      coach.remove();
      try { localStorage.setItem(COACH_KEY, "1"); } catch { /* ignore */ }
    };
    coach.querySelector<HTMLButtonElement>("[data-coach-dismiss]")!
      .addEventListener("click", (e) => { e.stopPropagation(); dismiss(); });
  }

  // Reset to default = this PAGE's default look (the surface its section lands on),
  // not the global default — so resetting on a Docs/Overview page gives the Docs
  // default, not SaaS. Clears the saved theme + the shareable hash.
  const resetTheme = () => {
    const def: Surface = section === "saas" ? "saas" : section === "neutral" ? "docs" : (current.surface as Surface);
    const cfg = SURFACES[def];
    current.surface = def; current.primary = cfg.primary; current.secondary = cfg.secondary;
    current.fontSans = cfg.fontSans; current.fontMono = cfg.fontMono; current.base = cfg.base;
    document.documentElement.setAttribute("data-surface", def);
    applyColor("primary", hue(cfg.primary)); applyColor("secondary", hue(cfg.secondary));
    applyFont("sans", sans(cfg.fontSans)); applyFont("mono", mono(cfg.fontMono));
    applyBase(cfg.base);
    // keep the current light/dark mode; persist() rewrites storage + the share
    // hash (now just #mode=light if in light, else clean) and refreshes the flag.
    panel.querySelectorAll<HTMLElement>("[data-surface-row] button[data-surface]").forEach((el) =>
      el.setAttribute("aria-pressed", String(el.dataset.surface === current.surface)));
    persist(); broadcast(); renderFonts(); syncSwatchAria(); syncSurfaceAria(); syncBaseLock(); updateCustomFlag();
    out.classList.remove("show"); updateLabel();
  };
  // the reset button now lives in the top bar (outside the panel), so bind all
  document.querySelectorAll<HTMLElement>("[data-theme-reset]").forEach((b) =>
    b.addEventListener("click", (e) => { e.stopPropagation(); resetTheme(); }));

  panel.querySelector("[data-theme-copy]")!.addEventListener("click", async () => {
    const css = cssSnippet();
    out.textContent = css; out.classList.add("show");
    try { await navigator.clipboard.writeText(css); } catch { /* clipboard may be blocked; text is shown */ }
  });
}
