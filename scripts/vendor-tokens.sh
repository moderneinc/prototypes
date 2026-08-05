#!/usr/bin/env bash
#
# Regenerates the vendored token sheet from the pinned published package.
#
# CI runs this and fails if the result differs from what's committed, so the
# vendored copy can't be hand-edited or silently drift from the package.
#
# To bump: edit scripts/tokens-version.txt, run this, commit the result.

set -euo pipefail

cd "$(dirname "$0")/.."

VERSION="$(tr -d '[:space:]' < scripts/tokens-version.txt)"

# Must be an exact version. A dist-tag like "latest" would make the page's
# appearance depend on when CI last ran rather than on what's committed.
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$ ]]; then
  echo "error: scripts/tokens-version.txt must be an exact version, got '$VERSION'" >&2
  exit 1
fi

PKG="@moderneinc/design-system-tokens@${VERSION}"
OUT="assets/design-system-tokens/semantic-colors.css"

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

( cd "$tmp" && npm pack "$PKG" --silent >/dev/null )
tar -xzf "$tmp"/*.tgz -C "$tmp" package/dist/semantic-colors.css

mkdir -p "$(dirname "$OUT")"
{
  printf '/* Vendored from %s — do not edit.\n' "$PKG"
  printf '   Regenerate with scripts/vendor-tokens.sh\n'
  printf '   https://github.com/moderneinc/design-system */\n'
  cat "$tmp/package/dist/semantic-colors.css"
} > "$OUT"

echo "vendored $PKG -> $OUT"
