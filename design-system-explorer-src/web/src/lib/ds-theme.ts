// Live theme builder for the design-system explorer. ONE global theme across the
// whole site (no Docs/SaaS split): light/dark mode + primary/secondary colour +
// UI/mono fonts + cool/warm base. Persisted to localStorage AND a shareable URL
// hash. This site is built with the system, so it themes itself live.

// `fillL` = the AA-deep version used on LIGHT (carries white text; also reads as
// ink/links on white). Dark uses fill/ink/on; light uses fillL + white text.
type Hue = { name: string; fill: string; ink: string; on: string; fillL: string };

const PALETTE: Hue[] = [
  { name: "Green",   fill: "#30f284", ink: "#5fe6a8", on: "#04220f", fillL: "#1d5937" },
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

type Font = { name: string; stack: string; g: string | null };
const SANS: Font[] = [
  { name: "Inter",   stack: '"Inter",ui-sans-serif,system-ui,sans-serif',   g: "Inter:wght@400;500;600;700" },
  { name: "Poppins", stack: '"Poppins",ui-sans-serif,system-ui,sans-serif', g: "Poppins:wght@400;500;600;700" },
  { name: "Geist",   stack: '"Geist",ui-sans-serif,system-ui,sans-serif',   g: "Geist:wght@400;500;600;700" },
];
const MONO: Font[] = [
  { name: "Inter", stack: '"Inter",ui-sans-serif,system-ui,sans-serif', g: "Inter:wght@400;500;600;700" },
  { name: "JetBrains", stack: '"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace', g: "JetBrains+Mono:wght@400;500;700" },
  { name: "Geist Mono", stack: '"Geist Mono",ui-monospace,SFMono-Regular,Menlo,monospace', g: "Geist+Mono:wght@400;500;700" },
  { name: "Space Mono", stack: '"Space Mono",ui-monospace,SFMono-Regular,Menlo,monospace', g: "Space+Mono:wght@400;700" },
  { name: "IBM Plex", stack: '"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace', g: "IBM+Plex+Mono:wght@400;500;600" },
];

const KEY = "ds-colors";
// Per-mode default accent pair. Dark (the polished default load) leads with brand
// teal; light reads better with a brighter cyan primary + purple accent. Fonts and
// base ground are shared. `defaultsFor` is the per-mode default used by the Reset
// chip + the "custom?" check; the share hash always diffs against the canonical
// dark DEFAULTS so a link round-trips unambiguously.
const MODE_ACCENTS: Record<string, { primary: string; secondary: string }> = {
  dark: { primary: "Teal", secondary: "Violet" },
  light: { primary: "Cyan", secondary: "Violet" },
};
const DEFAULTS = { mode: "dark", primary: "Teal", secondary: "Violet", fontSans: "Inter", fontMono: "Inter", base: "cool" };
const defaultsFor = (mode: string) => ({ ...DEFAULTS, mode, ...(MODE_ACCENTS[mode] || {}) });
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

// LIGHT: deep fill + white text + deep ink, hover darkens. DARK: bright fill +
// dark text + light ink, hover lightens.
function applyColor(role: "primary" | "secondary", h: Hue): void {
  const s = document.documentElement.style;
  const light = current.mode === "light";
  const fill = light ? h.fillL : h.fill;
  s.setProperty(`--ds-${role}`, fill);
  s.setProperty(`--ds-${role}-hover`, mix(fill, light ? "#000000" : "#ffffff", light ? 0.12 : 0.14));
  s.setProperty(`--ds-${role}-ink`, light ? h.fillL : h.ink);
  s.setProperty(`--ds-on-${role}`, light ? "#ffffff" : h.on);
  if (role === "primary") s.setProperty("--ds-primary-pressed", mix(fill, "#000000", 0.15));
}
function applyMode(m: string): void {
  if (m === "light") document.documentElement.setAttribute("data-theme", "light");
  else document.documentElement.removeAttribute("data-theme");
}
function applyFont(which: "sans" | "mono", f: Font): void {
  ensureFont(f.g);
  document.documentElement.style.setProperty(`--ds-font-${which}`, f.stack);
}
function applyBase(base: string): void {
  if (base === "warm") document.documentElement.setAttribute("data-base", "warm");
  else document.documentElement.removeAttribute("data-base");
}

const hue = (name: string) => PALETTE.find((h) => h.name === name)!;
const sans = (name: string) => SANS.find((f) => f.name === name)!;
const mono = (name: string) => MONO.find((f) => f.name === name)!;

// ── state: localStorage + the shareable URL hash ──────────────────────────────
const HASH_KEYS = ["mode", "primary", "secondary", "fontSans", "fontMono", "base"] as const;
let hashReady = false; // don't write the URL until init has applied the incoming state

function assignState(s: Record<string, string | null | undefined>): void {
  if (s.primary && PALETTE.some((h) => h.name === s.primary)) current.primary = s.primary;
  if (s.secondary && PALETTE.some((h) => h.name === s.secondary)) current.secondary = s.secondary;
  if (s.fontSans && SANS.some((f) => f.name === s.fontSans)) current.fontSans = s.fontSans;
  if (s.fontMono && MONO.some((f) => f.name === s.fontMono)) current.fontMono = s.fontMono;
  if (s.base === "cool" || s.base === "warm") current.base = s.base;
  if (s.mode === "light" || s.mode === "dark") current.mode = s.mode;
}

// "Custom" = differs from THIS MODE's default theme (mode itself excluded — its
// toggle is always shown).
function isCustom(): boolean {
  const d = defaultsFor(current.mode) as Record<string, string>;
  return (["primary", "secondary", "fontSans", "fontMono", "base"] as const)
    .some((k) => (current as Record<string, string>)[k] !== d[k]);
}
function updateCustomFlag(): void {
  const el = document.querySelector<HTMLElement>("[data-customflag]");
  if (el) el.hidden = !isCustom();
}

function persist(): void {
  try { localStorage.setItem(KEY, JSON.stringify(current)); } catch { /* ignore */ }
  syncHash(); updateCustomFlag();
}
// Serialise the non-default state to the hash. replaceState → live URL, no scroll/history spam.
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
function readHash(): boolean {
  const raw = location.hash.replace(/^#/, "");
  if (!raw) return false;
  const p = new URLSearchParams(raw);
  const obj: Record<string, string> = {}; let any = false;
  HASH_KEYS.forEach((k) => { const v = p.get(k); if (v) { obj[k] = v; any = true; } });
  if (any) assignState(obj);
  return any;
}
function broadcast(): void {
  const css = document.documentElement.style.cssText;
  const base = document.documentElement.getAttribute("data-base") || "";
  const mode = document.documentElement.getAttribute("data-theme") || "dark";
  document.querySelectorAll("iframe").forEach((f) => {
    try { (f as HTMLIFrameElement).contentWindow?.postMessage({ type: "ds-theme", css, base, mode }, "*"); } catch { /* ignore */ }
  });
}
function restore(): void {
  try { assignState(JSON.parse(localStorage.getItem(KEY) || "null") || {}); } catch { /* ignore */ }
  // a shared link's #hash wins, starting from defaults so absent keys = default (exact rehydration)
  if (location.hash.replace(/^#/, "")) { Object.assign(current, DEFAULTS); readHash(); }
}

function cssSnippet(): string {
  const p = hue(current.primary), s = hue(current.secondary), light = current.mode === "light";
  return `:root{\n  --ds-primary:${light ? p.fillL : p.fill}; --ds-secondary:${light ? s.fillL : s.fill};\n  --ds-font-sans:${sans(current.fontSans).stack};\n  --ds-font-mono:${mono(current.fontMono).stack};\n}`;
}

function applyAll(): void {
  applyMode(current.mode); // before applyColor — it picks light/dark variants
  applyColor("primary", hue(current.primary));
  applyColor("secondary", hue(current.secondary));
  applyFont("sans", sans(current.fontSans));
  applyFont("mono", mono(current.fontMono));
  applyBase(current.base);
}

export function initDsTheme(): void {
  restore();
  applyAll();

  // live-sync: an embedded screen receives the parent's overrides via postMessage
  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "ds-theme" && typeof e.data.css === "string") {
      document.documentElement.style.cssText = e.data.css;
      if (typeof e.data.base === "string") applyBase(e.data.base);
      if (e.data.mode === "light" || e.data.mode === "dark") applyMode(e.data.mode);
    }
  });

  const panel = document.querySelector<HTMLElement>(".ds-theme-panel");
  if (!panel) return; // example screens have no builder UI — they just inherit the theme

  const label = panel.querySelector<HTMLElement>("[data-theme-current]")!;
  const out = panel.querySelector<HTMLElement>(".ds-theme-out")!;
  const updateLabel = () => { label.textContent = `${current.mode === "light" ? "Light" : "Dark"} · ${current.primary} · ${current.fontSans}`; };

  // color swatches (chip shows the active mode's variant)
  panel.querySelectorAll<HTMLElement>(".ds-sw-row").forEach((row) => {
    const role = row.dataset.role as "primary" | "secondary";
    row.innerHTML = "";
    for (const h of PALETTE) {
      const b = document.createElement("button");
      b.className = "ds-sw"; b.style.background = current.mode === "light" ? h.fillL : h.fill; b.title = h.name;
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
  const syncSwatchAria = () => {
    panel.querySelectorAll<HTMLElement>(".ds-sw-row").forEach((row) => {
      const def = row.dataset.role === "primary" ? current.primary : current.secondary;
      row.querySelectorAll<HTMLElement>(".ds-sw").forEach((el) => el.setAttribute("aria-pressed", String(el.title === def)));
    });
  };
  const retintSwatches = () => panel.querySelectorAll<HTMLElement>(".ds-sw").forEach((el) => {
    const h = hue(el.title); if (h) el.style.background = current.mode === "light" ? h.fillL : h.fill;
  });

  // font pills (full menu — no per-surface variants)
  const renderFonts = () => {
    panel.querySelectorAll<HTMLElement>(".ds-font-row[data-font]").forEach((row) => {
      const which = row.dataset.font as "sans" | "mono";
      const opts = which === "sans" ? SANS : MONO;
      const k = which === "sans" ? "fontSans" : "fontMono";
      row.innerHTML = "";
      for (const f of opts) {
        const b = document.createElement("button");
        b.className = "ds-fontpill"; b.textContent = f.name; b.style.fontFamily = f.stack;
        b.setAttribute("aria-pressed", String((current as Record<string, string>)[k] === f.name));
        b.addEventListener("click", () => {
          (current as Record<string, string>)[k] = f.name; applyFont(which, f); persist(); broadcast();
          row.querySelectorAll(".ds-fontpill").forEach((el) => el.setAttribute("aria-pressed", "false"));
          b.setAttribute("aria-pressed", "true"); updateLabel();
        });
        row.appendChild(b);
      }
    });
  };
  renderFonts();

  const syncBasePills = () => panel.querySelectorAll<HTMLElement>("[data-base-row] button[data-base]")
    .forEach((el) => el.setAttribute("aria-pressed", String(el.dataset.base === current.base)));
  panel.querySelectorAll<HTMLButtonElement>("[data-base-row] button[data-base]").forEach((b) => {
    b.addEventListener("click", () => {
      current.base = b.dataset.base!; applyBase(current.base); persist(); broadcast(); syncBasePills();
    });
  });
  syncBasePills();

  // mode pills — light / dark. Re-applies colours so picks use the right variant.
  const modeBtns = panel.querySelectorAll<HTMLButtonElement>("[data-mode-row] button[data-mode]");
  const syncModePills = () => modeBtns.forEach((el) => el.setAttribute("aria-pressed", String(el.dataset.mode === current.mode)));
  modeBtns.forEach((b) => b.addEventListener("click", () => {
    const next = b.dataset.mode!;
    // if the accents are still at the OLD mode's defaults (untouched), move them to
    // the NEW mode's defaults so light lands on cyan/purple and dark on teal/violet.
    // A user's explicit colour pick is preserved across the toggle.
    const prev = MODE_ACCENTS[current.mode];
    if (prev && current.primary === prev.primary && current.secondary === prev.secondary) {
      const nd = MODE_ACCENTS[next]; if (nd) { current.primary = nd.primary; current.secondary = nd.secondary; }
    }
    current.mode = next; applyMode(current.mode);
    applyColor("primary", hue(current.primary)); applyColor("secondary", hue(current.secondary));
    retintSwatches(); syncSwatchAria(); syncModePills(); persist(); broadcast(); updateCustomFlag(); updateLabel();
  }));
  syncModePills();

  // rehydrate live when the URL hash changes (shared link, back/forward, manual edit)
  window.addEventListener("hashchange", () => {
    if (!readHash()) return;
    applyAll(); retintSwatches();
    broadcast(); renderFonts(); syncSwatchAria(); syncBasePills(); syncModePills();
    updateCustomFlag(); updateLabel();
  });
  hashReady = true;
  updateCustomFlag();
  updateLabel();

  const trigger = document.querySelector<HTMLButtonElement>(".ds-theme-trigger")!;
  let fontsEnsured = false;
  const setOpen = (open: boolean) => {
    panel.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));
    if (open && !fontsEnsured) { fontsEnsured = true; [...SANS, ...MONO].forEach((f) => ensureFont(f.g)); }
  };
  trigger.addEventListener("click", (e) => { e.stopPropagation(); setOpen(panel.hidden); });
  panel.addEventListener("click", (e) => e.stopPropagation());
  document.addEventListener("click", () => setOpen(false));

  // First-visit coachmark
  const COACH_KEY = "ds-coach-seen";
  let coachSeen = true;
  try { coachSeen = localStorage.getItem(COACH_KEY) === "1"; } catch { /* skip */ }
  if (!coachSeen) {
    setOpen(true);
    const coach = document.createElement("div");
    coach.className = "ds-coach";
    coach.innerHTML =
      "<b>Build a theme — live</b>" +
      "<p>The whole site is themed by these controls. Switch <b>light / dark</b>, pick a <b>primary</b> and <b>accent</b> colour, swap the " +
      "<b>fonts</b> or the <b>base ground</b>. Everything re-themes instantly, follows you across pages, and is shareable by URL.</p>" +
      '<button type="button" class="ds-btn ds-btn--primary ds-btn--sm" data-coach-dismiss>Got it — let me play</button>';
    panel.insertBefore(coach, panel.firstChild);
    const dismiss = () => { coach.remove(); try { localStorage.setItem(COACH_KEY, "1"); } catch { /* ignore */ } };
    coach.querySelector<HTMLButtonElement>("[data-coach-dismiss]")!.addEventListener("click", (e) => { e.stopPropagation(); dismiss(); });
  }

  // Reset to default (keeps the chosen light/dark mode). The button lives in the
  // top bar and only shows when the theme is custom.
  const resetTheme = () => {
    const d = defaultsFor(current.mode); // reset to THIS mode's default accents
    current.primary = d.primary; current.secondary = d.secondary;
    current.fontSans = d.fontSans; current.fontMono = d.fontMono; current.base = d.base;
    applyColor("primary", hue(current.primary)); applyColor("secondary", hue(current.secondary));
    applyFont("sans", sans(current.fontSans)); applyFont("mono", mono(current.fontMono)); applyBase(current.base);
    persist(); broadcast(); syncSwatchAria(); renderFonts(); syncBasePills();
    updateCustomFlag(); out.classList.remove("show"); updateLabel();
  };
  document.querySelectorAll<HTMLElement>("[data-theme-reset]").forEach((b) =>
    b.addEventListener("click", (e) => { e.stopPropagation(); resetTheme(); }));

  panel.querySelector("[data-theme-copy]")!.addEventListener("click", async () => {
    const css = cssSnippet();
    out.textContent = css; out.classList.add("show");
    try { await navigator.clipboard.writeText(css); } catch { /* clipboard blocked; text shown */ }
  });
}
