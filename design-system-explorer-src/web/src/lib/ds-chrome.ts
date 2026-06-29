// Gallery chrome behavior for the SaaS design-system showcase.
// Dark-only now — no theme toggle. The only job left is marking the current
// side-nav link with aria-current by pathname. No data, no framework.

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
}
