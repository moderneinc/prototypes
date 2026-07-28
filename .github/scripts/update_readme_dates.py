"""Regenerate git-derived dates in the README tables and page date badges.

README: each table row links a prototype file or directory:
    | [`file.html`](https://...) | description | 2026-04-29 | 2026-07-06 |
For every such row this script recomputes:
  - Added        — date of the first commit touching the path (rename-tracked)
  - Last changed — date of the most recent commit touching the path
Rows without trailing date columns (e.g. freshly added by hand) get them
appended, so authors can add a row without filling the dates in.

Badges: any page listed in BADGE_PAGES may carry
    <span class="when" data-path="some/file-or-dir">…</span>
elements; their text is rewritten to "Updated <last-changed date>".
"""

import re
import subprocess

README = "README.md"
BADGE_PAGES = ["moderne-marketing-kit.html"]
ROW = re.compile(r"^\| \[`(?P<path>[^`]+)`\]")
TRAILING_DATES = re.compile(r" \d{4}-\d{2}-\d{2} \| (\d{4}-\d{2}-\d{2}|\?\?) \|$")
BADGE = re.compile(r'(<span class="when" data-path="(?P<path>[^"]+)"[^>]*>)[^<]*(</span>)')


def commit_dates(path: str) -> tuple[str, str]:
    target = path.rstrip("/")
    out = subprocess.run(
        ["git", "log", "--follow", "--format=%as", "--", target],
        capture_output=True,
        text=True,
        check=True,
    ).stdout.split()
    if not out:
        return "??", "??"
    return out[-1], out[0]


def update_badges() -> None:
    for page in BADGE_PAGES:
        try:
            with open(page) as f:
                html = f.read()
        except FileNotFoundError:
            continue

        def fill(match: re.Match) -> str:
            _, last = commit_dates(match.group("path"))
            return f"{match.group(1)}Updated {last}{match.group(3)}"

        new_html, count = BADGE.subn(fill, html)
        if new_html != html:
            with open(page, "w") as f:
                f.write(new_html)
        print(f"{page}: {count} badge(s) refreshed")


def main() -> None:
    with open(README) as f:
        lines = f.read().splitlines()

    result = []
    changed = 0
    for line in lines:
        match = ROW.match(line)
        if not match:
            result.append(line)
            continue
        base = TRAILING_DATES.sub("", line).rstrip()
        first, last = commit_dates(match.group("path"))
        new_line = f"{base} {first} | {last} |"
        if new_line != line:
            changed += 1
        result.append(new_line)

    with open(README, "w") as f:
        f.write("\n".join(result) + "\n")
    print(f"{changed} row(s) updated")
    update_badges()


if __name__ == "__main__":
    main()
