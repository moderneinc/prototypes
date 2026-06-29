// Boot for an embedded example SCREEN (a recreated Moderne app / docs page,
// shown in an iframe inside the gallery). Loads the DS stylesheet chain plus the
// screen-specific styles, and applies the picked theme (read from localStorage,
// and live-synced from the parent gallery via postMessage — see ds-theme.ts).
import "../styles/ds-tokens.css";
import "../styles/ds-base.css";
import "../styles/ds-components.css";
import "../styles/ds-screens.css";
import { initDsTheme } from "./ds-theme";

document.documentElement.classList.add("ds-screen");
initDsTheme();

// Replay buttons on screen charts (e.g. DevCenter parliament fan): restart the
// chart's reveal animations by clearing animation, forcing a reflow, restoring.
document.querySelectorAll<HTMLButtonElement>("[data-replay]").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.closest(".ds-card")
      ?.querySelectorAll<HTMLElement>("[data-line],[data-area],[data-bar],.ds-donut,.pm-seat")
      .forEach((el) => { el.style.animation = "none"; void el.getBoundingClientRect(); el.style.animation = ""; });
  });
});
