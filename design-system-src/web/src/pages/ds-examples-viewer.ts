// In-gallery example viewer. The left nav is split into SaaS and Docs sections,
// each led by an "About the … theme" intro that explains that surface's default
// theme (the rationale that used to crowd the builder panel). Selecting an intro
// shows the explanation; selecting a screen shows it in an iframe. Either way the
// builder's SURFACE auto-switches to match (SaaS vs Docs), so the chrome + the
// embedded screen are themed correctly.
import "../lib/ds-boot";
import { surfaceExplain } from "../lib/ds-theme";

const SCREENS = ["devcenter", "activity", "changelog", "docs-home", "docs-platform", "docs-article"];
const INTROS = ["saas", "docs"];
const BASE = import.meta.env.BASE_URL; // "/prototypes/design-system/" in prod, "/" in dev

const frame = document.getElementById("ex-frame") as HTMLIFrameElement;
const intro = document.getElementById("ex-intro") as HTMLElement;

const valid = (s: string | null) => (s && [...SCREENS, ...INTROS].includes(s) ? s : "saas");
const surfaceOf = (s: string): "saas" | "docs" => (s.startsWith("docs") ? "docs" : "saas");

function mark(s: string): void {
  document.querySelectorAll(".ds-sidenav a").forEach((a) => a.removeAttribute("aria-current"));
  document.querySelector(`.ds-sidenav a[data-screen="${s}"]`)?.setAttribute("aria-current", "page");
}

function render(s: string): void {
  const surface = surfaceOf(s);
  // tell the builder to switch surface (themes the chrome + broadcasts to the iframe)
  document.dispatchEvent(new CustomEvent("ds-set-surface", { detail: surface }));
  mark(s);
  if (INTROS.includes(s)) {
    frame.hidden = true;
    intro.hidden = false;
    intro.innerHTML =
      `<div class="ds-surface-intro-inner">` +
      `<div class="ds-eyebrow">${surface === "docs" ? "Docs" : "SaaS / Platform"} · default theme</div>` +
      surfaceExplain(surface) +
      `<p class="ds-sm ds-muted" style="margin-top:16px">Pick a screen on the left to see this theme applied. ` +
      `Use <b style="color:var(--ds-ink)">Theme</b> (top-right) to experiment — surface, colours and fonts re-theme live.</p>` +
      `</div>`;
    intro.scrollTop = 0;
  } else {
    intro.hidden = true;
    frame.hidden = false;
    frame.src = `${BASE}screens/${s}/`;
  }
}

render(valid(new URLSearchParams(location.search).get("s")));

document.querySelectorAll<HTMLAnchorElement>(".ds-sidenav a[data-screen]").forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const s = a.dataset.screen!;
    history.pushState({}, "", `${BASE}examples/?s=${s}`);
    render(s);
  });
});
window.addEventListener("popstate", () => render(valid(new URLSearchParams(location.search).get("s"))));
