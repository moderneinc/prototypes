// Gallery chrome behavior for the design-system showcase: mark the active
// side-nav link by pathname, and drive the mobile menu (off-canvas nav drawer).
// No data, no framework.

export function initDsChrome(): void {
  // active side-nav link (longest matching href wins, like the marketing chrome)
  const root = import.meta.env.BASE_URL; // "/prototypes/design-system-explorer/" in prod, "/" in dev
  const here = location.pathname.replace(/index\.html$/, "");
  let best: HTMLAnchorElement | null = null;
  document.querySelectorAll<HTMLAnchorElement>(".ds-sidenav a").forEach((a) => {
    const href = new URL(a.href).pathname;
    if (here === href || (href !== root && here.startsWith(href))) {
      if (!best || href.length > new URL(best.href).pathname.length) best = a;
    }
  });
  if (best) (best as HTMLAnchorElement).setAttribute("aria-current", "page");

  // ── mobile menu ──────────────────────────────────────────────────────────
  const shell = document.querySelector<HTMLElement>(".ds-shell");
  const toggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const sidenav = document.querySelector<HTMLElement>(".ds-sidenav");
  if (!shell || !toggle || !sidenav) return;
  if (!sidenav.id) sidenav.id = "ds-sidenav"; // resolve the button's aria-controls

  // backdrop (created once; only visible when the drawer is open via CSS)
  const backdrop = document.createElement("button");
  backdrop.className = "ds-nav-backdrop";
  backdrop.setAttribute("aria-label", "Close navigation");
  backdrop.tabIndex = -1;
  shell.appendChild(backdrop);

  const setOpen = (open: boolean) => {
    shell.toggleAttribute("data-nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => setOpen(!shell.hasAttribute("data-nav-open")));
  backdrop.addEventListener("click", () => setOpen(false));
  // tapping a destination or hitting Escape closes the drawer
  sidenav.addEventListener("click", (e) => { if ((e.target as HTMLElement).closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
}
