import "../lib/ds-boot";

// Replay buttons: restart a chart card's draw-on / grow-in / spin-in animations
// (set animation:none, force a reflow, then clear it so the CSS animation re-runs).
function restart(el: Element): void {
  const e = el as HTMLElement;
  e.style.animation = "none";
  void e.getBoundingClientRect(); // force reflow
  e.style.animation = "";
}

document.querySelectorAll<HTMLButtonElement>("[data-replay]").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.closest(".ds-card")
      ?.querySelectorAll("[data-line],[data-area],[data-bar],.ds-donut,.pm-seat")
      .forEach(restart);
  });
});
