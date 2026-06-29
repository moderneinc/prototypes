// In-gallery example viewer. The left nav lists the recreated Moderne screens
// (Platform app + Docs pages). Selecting one shows it in an iframe; the embedded
// screen inherits the single global theme via postMessage, so colours and fonts
// re-theme live with the builder.
import "../lib/ds-boot";

const SCREENS = ["devcenter", "activity", "changelog", "docs-home", "docs-platform", "docs-article"];
const BASE = import.meta.env.BASE_URL; // "/prototypes/design-system-explorer/" in prod, "/" in dev

const frame = document.getElementById("ex-frame") as HTMLIFrameElement;
const note = document.getElementById("ex-note") as HTMLElement;

const valid = (s: string | null) => (s && SCREENS.includes(s) ? s : "devcenter");

function mark(s: string): void {
  document.querySelectorAll(".ds-sidenav a").forEach((a) => a.removeAttribute("aria-current"));
  document.querySelector(`.ds-sidenav a[data-screen="${s}"]`)?.setAttribute("aria-current", "page");
}

function render(s: string): void {
  mark(s);
  if (note) note.hidden = false;
  frame.hidden = false;
  frame.src = `${BASE}screens/${s}/`;
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
