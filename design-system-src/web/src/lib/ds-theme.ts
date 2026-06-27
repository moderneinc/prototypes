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
  { name: "Green",   fill: "#33ff99", ink: "#5fe6a8", on: "#10130d" },
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
// Default: Teal primary (brand strand, decoupled from success-green) + Violet
// accent, Inter for both UI and data (one typeface), on the dark ground.
const DEFAULTS = { primary: "Teal", secondary: "Violet", fontSans: "Inter", fontMono: "Inter", base: "cool" };
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

function persist(): void {
  try { localStorage.setItem(KEY, JSON.stringify(current)); } catch { /* ignore */ }
}
// push the active overrides into any embedded screen iframes (live theming)
function broadcast(): void {
  const css = document.documentElement.style.cssText;
  const base = document.documentElement.getAttribute("data-base") || "";
  document.querySelectorAll("iframe").forEach((f) => {
    try { (f as HTMLIFrameElement).contentWindow?.postMessage({ type: "ds-theme", css, base }, "*"); } catch { /* ignore */ }
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
  } catch { /* ignore */ }
}

function cssSnippet(): string {
  const p = hue(current.primary), s = hue(current.secondary);
  return `:root{\n  --ds-primary:${p.fill}; --ds-primary-ink:${p.ink}; --ds-on-primary:${p.on};\n  --ds-secondary:${s.fill}; --ds-secondary-ink:${s.ink}; --ds-on-secondary:${s.on};\n  --ds-font-sans:${sans(current.fontSans).stack};\n  --ds-font-mono:${mono(current.fontMono).stack};\n}`;
}

export function initDsTheme(): void {
  restore();
  // apply the active (or persisted) choice on every page, incl. example screens
  if (current.primary !== DEFAULTS.primary) applyColor("primary", hue(current.primary));
  if (current.secondary !== DEFAULTS.secondary) applyColor("secondary", hue(current.secondary));
  if (current.fontSans !== DEFAULTS.fontSans) applyFont("sans", sans(current.fontSans));
  if (current.fontMono !== DEFAULTS.fontMono) applyFont("mono", mono(current.fontMono));
  applyBase(current.base);

  // live-sync: an embedded screen receives the parent's overrides via postMessage
  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "ds-theme" && typeof e.data.css === "string") {
      document.documentElement.style.cssText = e.data.css;
      if (typeof e.data.base === "string") applyBase(e.data.base);
    }
  });

  const panel = document.querySelector<HTMLElement>(".ds-theme-panel");
  if (!panel) return; // example screens have no builder UI — they just inherit the theme

  const label = panel.querySelector<HTMLElement>("[data-theme-current]")!;
  const out = panel.querySelector<HTMLElement>(".ds-theme-out")!;
  const updateLabel = () => { label.textContent = `${current.primary} + ${current.secondary} · ${current.fontSans}`; };

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

  // font pills
  panel.querySelectorAll<HTMLElement>(".ds-font-row[data-font]").forEach((row) => {
    const which = row.dataset.font as "sans" | "mono";
    const opts = which === "sans" ? SANS : MONO;
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

  // base (ground) pills — cool / warm
  panel.querySelectorAll<HTMLElement>("[data-base-row] button[data-base]").forEach((b) => {
    const val = b.dataset.base!;
    b.setAttribute("aria-pressed", String(current.base === val));
    b.addEventListener("click", () => {
      current.base = val; applyBase(val); persist(); broadcast();
      b.closest("[data-base-row]")!.querySelectorAll("button").forEach((el) => el.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
    });
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
    Object.assign(current, DEFAULTS);
    applyBase(current.base);
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    broadcast();
    panel.querySelectorAll<HTMLElement>("[data-base-row] button[data-base]").forEach((el) =>
      el.setAttribute("aria-pressed", String(el.dataset.base === current.base)));
    panel.querySelectorAll<HTMLElement>(".ds-sw-row").forEach((row) => {
      const def = row.dataset.role === "primary" ? current.primary : current.secondary;
      row.querySelectorAll<HTMLElement>(".ds-sw").forEach((el) =>
        el.setAttribute("aria-pressed", String(el.title === def)));
    });
    panel.querySelectorAll<HTMLElement>(".ds-font-row").forEach((row) => {
      const def = row.dataset.font === "sans" ? current.fontSans : current.fontMono;
      row.querySelectorAll<HTMLElement>(".ds-fontpill").forEach((el) =>
        el.setAttribute("aria-pressed", String(el.textContent === def)));
    });
    out.classList.remove("show"); updateLabel();
  });

  panel.querySelector("[data-theme-copy]")!.addEventListener("click", async () => {
    const css = cssSnippet();
    out.textContent = css; out.classList.add("show");
    try { await navigator.clipboard.writeText(css); } catch { /* clipboard may be blocked; text is shown */ }
  });
}
