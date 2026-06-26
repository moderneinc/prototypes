// In-gallery example viewer: keeps the design-system chrome (left nav) and shows
// the recreated Moderne screen in an iframe, so you click through examples on the
// left without leaving the showcase. The picked theme is applied + live-synced.
import "../lib/ds-boot";

const SCREENS = ["devcenter", "activity", "changelog", "docs-home", "docs-platform", "docs-article"];
const valid = (s: string | null) => (s && SCREENS.includes(s) ? s : "devcenter");
const frame = document.getElementById("ex-frame") as HTMLIFrameElement;
const BASE = import.meta.env.BASE_URL; // "/prototypes/design-system/" in prod, "/" in dev

function mark(s: string): void {
  document.querySelectorAll(".ds-sidenav a").forEach((a) => a.removeAttribute("aria-current"));
  document.querySelector(`.ds-sidenav a[data-screen="${s}"]`)?.setAttribute("aria-current", "page");
}
function load(s: string): void {
  frame.src = `${BASE}screens/${s}/`;
  mark(s);
}

load(valid(new URLSearchParams(location.search).get("s")));

document.querySelectorAll<HTMLAnchorElement>(".ds-sidenav a[data-screen]").forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const s = a.dataset.screen!;
    history.pushState({}, "", `${BASE}examples/?s=${s}`);
    load(s);
  });
});
window.addEventListener("popstate", () => load(valid(new URLSearchParams(location.search).get("s"))));
