// Interactive theme builder for the design-system showcase.
// Pick a PRIMARY + SECONDARY color AND a primary (UI) + secondary (mono) FONT
// from curated, competition-informed options. Choices live-apply to the whole
// site (the showcase is itself built with the system tokens), persist in
// localStorage across every gallery page AND the example screens, and can be
// shared via "Copy CSS".
//
// Color values are AA-validated for the dark theme (see .context/ds-a11y-check.mjs).

type Hue = { name: string; fill: string; ink: string; on: string };

const PALETTE: Hue[] = [
  { name: "Green",   fill: "#30f284", ink: "#5fe6a8", on: "#04220f" },   /* Digital Green — brand accent (kit) */
  { name: "Emerald", fill: "#19e085", ink: "#5fe6a8", on: "#08130d" },
  { name: "Teal",    fill: "#25d0c8", ink: "#5eecd0", on: "#06231d" },
  { name: "Cyan",    fill: "#38bdf8", ink: "#7dd3fc", on: "#06202b" },
  { name: "Blue",    fill: "#4f8ff5", ink: "#93c5fd", on: "#071426" },
  { name: "Cobalt",  fill: "#3a6df0", ink: "#93b9ff", on: "#ffffff" },
  { name: "Indigo",  fill: "#5b50e6", ink: "#b0b0fb", on: "#ffffff" },
  { name: "Violet",  fill: "#7b4fe0", ink: "#c4b5fd", on: "#ffffff" },
  { name: "Magenta", fill: "#ff5ba3", ink: "#ff7ac9", on: "#10130d" },
  { name: "Crimson", fill: "#d62f44", ink: "#fca5a5", on: "#ffffff" },
  { name: "Amber",   fill: "#f5b528", ink: "#f0c674", on: "#241a02" },
  { name: "Orange",  fill: "#fb923c", ink: "#ffb066", on: "#1f1203" },
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
const DEFAULTS = { primary: "Teal", secondary: "Violet", fontSans: "Inter", fontMono: "Inter", base: "warm", surface: "saas" };
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
  s.setProperty(`--ds-${role}`, h.fill);
  s.setProperty(`--ds-${role}-hover`, mix(h.fill, "#ffffff", 0.14));
  s.setProperty(`--ds-${role}-ink`, h.ink);
  s.setProperty(`--ds-on-${role}`, h.on);
  if (role === "primary") s.setProperty("--ds-primary-pressed", mix(h.fill, "#000000", 0.15));
}
function applyFont(which: "sans" | "mono", f: Font): void {
  ensureFont(f.g);
  document.documentElement.style.setProperty(`--ds-font-${which}`, f.stack);
}
// base = the ground register: "cool" (default) or "warm" (marketing black/brown + gold nav)
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
type SurfaceCfg = { label: string; primary: string; secondary: string; fontSans: string; fontMono: string; sans: string[]; mono: string[]; explain: string };
const SURFACES: Record<Surface, SurfaceCfg> = {
  saas: {
    label: "SaaS / Platform", primary: "Teal", secondary: "Violet", fontSans: "Inter", fontMono: "Inter",
    sans: ["Inter", "Geist"], mono: ["Inter", "JetBrains"],
    explain:
      "<p>The product surface — dense application UI.</p>" +
      "<ul>" +
      "<li><b>Recommended colour — Teal (default).</b> Teal is the action colour, kept deliberately distinct from brand-green so &ldquo;do it&rdquo; reads differently from &ldquo;on brand.&rdquo; Success stays green; magenta is reserved for marketing.</li>" +
      "<li><b>Recommended type — Inter (default, UI + data).</b> Built for dense, small-size legibility (the dev-tool standard); its tabular figures keep numerals aligned, so one typeface covers both UI and data. Geist / JetBrains are offered as alternates.</li>" +
      "<li><b>Cool, flat ground.</b> SaaS keeps the cool near-black and stays flat — no ambient glow — engineered and calm for dense, long-session app use.</li>" +
      "<li><b>Full categorical palette.</b> The 6 brand strands <i>plus</i> extra hues (pink, indigo, cyan, gold, orange), because data-viz needs more categories. All on the shared brand spine.</li>" +
      "</ul>" +
      "<span class=\"ds-explain-epic\">Epic — addresses: Shared token source &middot; Apply dark theme to the Platform site &middot; Brand QA (Product &rarr; Docs &rarr; Platform).</span>",
  },
  docs: {
    label: "Docs", primary: "Green", secondary: "Violet", fontSans: "Poppins", fontMono: "IBM Plex",
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

function persist(): void {
  try { localStorage.setItem(KEY, JSON.stringify(current)); } catch { /* ignore */ }
}
// push the active overrides into any embedded screen iframes (live theming)
function broadcast(): void {
  const css = document.documentElement.style.cssText;
  const base = document.documentElement.getAttribute("data-base") || "";
  const surface = document.documentElement.getAttribute("data-surface") || "saas";
  document.querySelectorAll("iframe").forEach((f) => {
    try { (f as HTMLIFrameElement).contentWindow?.postMessage({ type: "ds-theme", css, base, surface }, "*"); } catch { /* ignore */ }
  });
}
function restore(): void {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "null");
    if (s?.primary && PALETTE.some((h) => h.name === s.primary)) current.primary = s.primary;
    if (s?.secondary && PALETTE.some((h) => h.name === s.secondary)) current.secondary = s.secondary;
    if (s?.fontSans && SANS.some((f) => f.name === s.fontSans)) current.fontSans = s.fontSans;   // stale "System" → keep default
    if (s?.fontMono && MONO.some((f) => f.name === s.fontMono)) current.fontMono = s.fontMono;
    if (s?.base === "cool" || s?.base === "warm") current.base = s.base;
    if (s?.surface === "saas" || s?.surface === "docs") current.surface = s.surface;
  } catch { /* ignore */ }
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
    document.documentElement.setAttribute("data-surface", s);
    applyColor("primary", hue(cfg.primary)); applyColor("secondary", hue(cfg.secondary));
    applyFont("sans", sans(cfg.fontSans)); applyFont("mono", mono(cfg.fontMono));
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
  if (section === "saas") { applySurface("saas"); lock("saas"); }
  else if (section === "neutral") lock("both");

  // the examples viewer auto-selects the surface when you open a screen / intro
  document.addEventListener("ds-set-surface", (e) => {
    const s = (e as CustomEvent).detail;
    if (s === "saas" || s === "docs") { applySurface(s); if (section === "examples") lock(s); }
  });

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

  panel.querySelector("[data-theme-reset]")!.addEventListener("click", () => {
    const s = document.documentElement.style;
    ["primary", "secondary"].forEach((r) => {
      s.removeProperty(`--ds-${r}`); s.removeProperty(`--ds-${r}-hover`);
      s.removeProperty(`--ds-${r}-ink`); s.removeProperty(`--ds-on-${r}`);
    });
    s.removeProperty("--ds-primary-pressed");
    s.removeProperty("--ds-font-sans"); s.removeProperty("--ds-font-mono");
    Object.assign(current, DEFAULTS); // back to the SaaS surface + its defaults
    document.documentElement.setAttribute("data-surface", current.surface);
    applyBase(current.base);
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    broadcast();
    panel.querySelectorAll<HTMLElement>("[data-surface-row] button[data-surface]").forEach((el) =>
      el.setAttribute("aria-pressed", String(el.dataset.surface === current.surface)));
    renderFonts(); syncSwatchAria(); syncSurfaceAria(); syncBaseLock();
    out.classList.remove("show"); updateLabel();
  });

  panel.querySelector("[data-theme-copy]")!.addEventListener("click", async () => {
    const css = cssSnippet();
    out.textContent = css; out.classList.add("show");
    try { await navigator.clipboard.writeText(css); } catch { /* clipboard may be blocked; text is shown */ }
  });
}
