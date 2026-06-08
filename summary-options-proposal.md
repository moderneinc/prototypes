# Proposal: Redesign the run "Summary + options" section on the Results page

**Type:** UX enhancement / front-end issue
**Area:** Recipe run → Results page → left panel (Options + Summary)
**Prototype:** https://moderneinc.github.io/prototypes/results.html
**Status:** Proposal — not yet implemented in the app

---

## Summary

The run **Summary + options** block on the Results page is taller and less
scannable than it needs to be, cannot be collapsed, and does not adapt when the
results pane is narrowed (split view, smaller screens).

We prototyped a tighter, **collapsible**, **responsive** treatment for this
section. **What is in the prototype is the target state we want in the app.**

> **Related:** surfacing the run's **completion state + headline stats**
> (Completed badge, repositories, time saved, etc.) next to the run title is
> tracked separately in
> [moderne-ui#8333](https://github.com/moderneinc/moderne-ui/issues/8333) and is
> **out of scope** for this issue.

---

## Current behavior (app today)

- **Options** and **Summary** render as a tall, single-column stack, consuming a
  lot of vertical space above the repository results list.
- The block is always expanded — there is no way to collapse it to get the
  results list higher on the page.
- The section does not respond to the **width of the results pane** — when the
  pane is narrowed (split diff view, smaller viewports) the layout doesn't
  reflow.

## Desired behavior (prototype)

1. A single bordered **"Summary + options ( if applicable)"** card containing the
   run options and the summary stats.
2. The block is **collapsible** — a small icon-only eye toggle in the card's
   top-right hides/shows the detail, keeping the header (and toggle) in place so
   the user can re-expand.
3. **Options** and **Summary** each lay out in **two columns** to cut vertical
   height roughly in half, collapsing back to one column when the pane is narrow.
4. The whole section is **responsive to the pane's own width** (not just the
   viewport), so it reflows correctly in split/diff view.

---

## Detailed changes to capture

### 1. Show / hide the Summary + options

- Wrap Options + Summary in one bordered, rounded card (`.rd`) with a header row.
- Header: **"Summary + options ( if applicable)"** (no disclosure chevron).
- **Icon-only eye toggle** pinned to the top-right of the card header
  (`Hide details` ⇄ `Show details`, tooltip + `aria-label` swap).
  - Collapsing hides only the **card bodies** (options list + summary), leaving
    the header + eye visible — so the control never disappears with its content.
- **Two-column layout**:
  - Options list: `display:grid; grid-template-columns:1fr 1fr`.
  - Summary stats: `display:grid; grid-template-columns:1fr 1fr`.
- Compact spacing throughout (reduced row padding, gaps, and card padding) so the
  card reads as a dense, single glanceable unit.
- Left-align: options items and summary rows share the same left edge.

### 2. Responsiveness (adapt to the pane, not the window)

- The left results pane is a **container query context**
  (`container-type: inline-size`).
- `@container (max-width: 470px)` → Summary and Options each drop to **one
  column**; the filter search goes full-width.
- `@container (max-width: 360px)` → the All / Has results / Errors segmented
  control goes full-width with equal-width buttons.
- `@media (max-width: 1100px)` → the right diff pane + divider hide and the
  layout becomes single-column.
- `@media (max-height: 760px)` → chrome tightens (nav labels hide, reduced
  top/section spacing) to preserve vertical room for results.

> The headline numeric stats stay inside the Summary card
> (*Files changed, Repositories with results, Files searched, Files examined*).
> Surfacing the **completion state + stats next to the run title** is tracked in
> [moderne-ui#8333](https://github.com/moderneinc/moderne-ui/issues/8333).

---

## Proposed implementation plan

**Phase 1 — Structure & collapse**
- Introduce the single bordered Summary + options card with the new header.
- Add the icon-only eye toggle; collapse hides bodies only (persist state in
  component/local state).

**Phase 2 — Two-column + compaction**
- Convert Options and Summary to two-column grids; apply compact spacing tokens;
  align left edges.

**Phase 3 — Responsiveness**
- Make the left results pane a container-query context; add the `@container`
  breakpoints (470px, 360px) and confirm behavior in split/diff view; verify the
  existing viewport `@media` rules still hold.

**Phase 4 — QA**
- Verify collapse/expand, keyboard focus + `aria-label` on the toggle, column
  reflow at each breakpoint, and split-view widths.

---

## Acceptance criteria

- [ ] Summary + options render as one bordered, compact card.
- [ ] Eye toggle collapses/expands only the bodies; header + toggle persist;
      tooltip/`aria-label` reflect state.
- [ ] Options and Summary show two columns on wide panes, one column when the
      pane is narrow (container-query driven, works in split view).
- [ ] No regressions to the existing viewport breakpoints (1100px, 760px).

---

## Notes

- Reference implementation lives in `results.html` (and the related
  `why-did-this-change-results-view.html`) in the prototypes repo; both share the
  same Summary + options panel CSS/markup.
- The "( if applicable)" qualifier in the header covers runs with no recipe
  options to show — the card then carries only the summary stats.
