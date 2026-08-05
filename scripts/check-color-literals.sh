#!/usr/bin/env bash
#
# Colour-literal ratchet for morpheus-design-kit.html.
#
# The kit gets its colour values from the vendored design-system token sheet
# (assets/design-system-tokens/semantic-colors.css) through the alias block near
# the top of the file. Colour literals written directly into the page bypass
# that, and are how the kit silently drifted from the design system before.
#
# Both spellings count -- hex (#RGB / #RRGGBB / #RRGGBBAA) and functional
# rgb()/rgba(). Counting only hex would leave an obvious hole: the kit's
# hairlines and tints are all rgba(), so half the palette could be re-hardcoded
# without tripping the check.
#
# A "zero literals" gate cannot pass today: conversion is incremental and
# literals remain in component rules, in swatch label text, and in the tracked
# "Not yet tokenized" block. So this is a ratchet against a recorded baseline.
#
#   * count went UP   -> a literal was added. Use a var(--mod-*) alias instead.
#   * count went DOWN -> good, you tokenised something. Lower the baseline.
#
# Exact match is required rather than "no worse". A stale, too-high baseline
# would silently allow literals to creep back in up to the old number.

set -euo pipefail

cd "$(dirname "$0")/.."

FILE="morpheus-design-kit.html"
BASELINE_FILE="scripts/color-literal-baseline.txt"

for f in "$FILE" "$BASELINE_FILE"; do
  if [[ ! -f "$f" ]]; then
    echo "error: $f not found" >&2
    exit 1
  fi
done

hex="$(grep -oE '#[0-9A-Fa-f]{3,8}\b' "$FILE" | wc -l | tr -d '[:space:]')"
func="$(grep -oE 'rgba?\(\s*[0-9]' "$FILE" | wc -l | tr -d '[:space:]')"
count=$(( hex + func ))
baseline="$(tr -d '[:space:]' < "$BASELINE_FILE")"

if [[ "$count" == "$baseline" ]]; then
  echo "OK: $count colour literals in $FILE ($hex hex + $func rgb/rgba), matches baseline"
  exit 0
fi

if (( count > baseline )); then
  cat >&2 <<EOF
FAIL: $FILE gained colour literals ($baseline -> $count).
      ($hex hex + $func rgb/rgba)

Colour values belong in the design system, not in this page. Use an existing
alias (--bg, --text, --card, ...) or add one pointing at a --mod-* token from
assets/design-system-tokens/semantic-colors.css.

If the value genuinely has no token yet, put it in the "Not yet tokenized"
block so it stays visible, and raise the baseline in $BASELINE_FILE
deliberately as part of that change.
EOF
  exit 1
fi

cat >&2 <<EOF
FAIL: $FILE has fewer colour literals ($baseline -> $count) -- good, but the
baseline is now stale and would allow them to creep back.

Update it:

  echo $count > $BASELINE_FILE
EOF
exit 1
