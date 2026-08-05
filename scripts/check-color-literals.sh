#!/usr/bin/env bash
#
# Colour-literal ratchet for morpheus-design-kit.html.
#
# Colours belong in the vendored token sheet, not in the page. Zero literals
# isn't reachable yet, so the count is pinned to a baseline instead.
#
# Exact match, not "no worse": a stale high baseline lets literals creep back.
# Counts rgb()/rgba() as well as hex — the kit's tints and hairlines are rgba(),
# so a hex-only check would miss half the palette.

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
  echo "OK: $count colour literals ($hex hex + $func rgb/rgba), matches baseline"
  exit 0
fi

if (( count > baseline )); then
  cat >&2 <<EOF
FAIL: $FILE gained colour literals ($baseline -> $count).

Use an existing alias (--bg, --text, --card, ...) or add one pointing at a
--mod-* token. If the value has no token yet, add it to the "Not yet tokenized"
block and raise the baseline in $BASELINE_FILE as part of that change.
EOF
  exit 1
fi

cat >&2 <<EOF
FAIL: fewer colour literals ($baseline -> $count) — good, but the baseline is
now stale. Update it:  echo $count > $BASELINE_FILE
EOF
exit 1
