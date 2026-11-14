#!/usr/bin/env python3
"""Check the links in the repository's Markdown files.

For every Markdown link, image and HTML src/href that points inside the
repository, the script checks that the file exists and, for #anchors, that the
target heading exists (GitHub's heading-to-anchor rules). External http(s)
links are listed but not fetched, so the check works offline.

Usage:
    python3 scripts/check_links.py           # exit code 1 if a link is broken
    python3 scripts/check_links.py --list    # also print the external links
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {".git", "dist", "build", "node_modules", ".venv", "venv", ".pytest_cache"}

MD_LINK = re.compile(r"!?\[(?:[^\]\[]|\[[^\]]*\])*\]\(\s*<?([^)\s>]+)>?(?:\s+\"[^\"]*\")?\s*\)")
HTML_ATTR = re.compile(r"""\b(?:src|href)=["']([^"']+)["']""")
HEADING = re.compile(r"^(#{1,6})\s+(.*?)\s*#*\s*$")
CODE_FENCE = re.compile(r"^\s*(```|~~~)")


def slug(text: str) -> str:
    """GitHub-style anchor for a heading."""
    text = re.sub(r"<[^>]+>", "", text)                 # inline HTML
    text = re.sub(r"!?\[([^\]]*)\]\([^)]*\)", r"\1", text)  # links -> their text
    text = text.replace("`", "").strip().lower()
    text = re.sub(r"[^\w\- ]", "", text, flags=re.UNICODE)
    return text.replace(" ", "-")


def anchors_of(path: Path, cache: dict[Path, set[str]]) -> set[str]:
    if path not in cache:
        seen: dict[str, int] = {}
        found: set[str] = set()
        in_code = False
        for line in path.read_text(encoding="utf-8").splitlines():
            if CODE_FENCE.match(line):
                in_code = not in_code
                continue
            m = None if in_code else HEADING.match(line)
            if m:
                base = slug(m.group(2))
                n = seen.get(base, 0)
                seen[base] = n + 1
                found.add(base if n == 0 else f"{base}-{n}")
        cache[path] = found
    return cache[path]


def links_in(path: Path):
    in_code = False
    for no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if CODE_FENCE.match(line):
            in_code = not in_code
            continue
        if in_code:
            continue
        for rx in (MD_LINK, HTML_ATTR):
            for m in rx.finditer(line):
                yield no, m.group(1)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--list", action="store_true", help="print the external links too")
    args = parser.parse_args()

    md_files = sorted(p for p in ROOT.rglob("*.md") if not SKIP_DIRS.intersection(p.relative_to(ROOT).parts))
    cache: dict[Path, set[str]] = {}
    broken, external, checked = [], set(), 0
    for md in md_files:
        for no, target in links_in(md):
            if target.startswith(("http://", "https://")):
                external.add(target)
                continue
            if target.startswith(("mailto:", "data:")):
                continue
            checked += 1
            file_part, _, anchor = target.partition("#")
            dest = md if not file_part else (md.parent / file_part).resolve()
            where = f"{md.relative_to(ROOT)}:{no}"
            if not dest.exists():
                broken.append(f"{where}: missing file {target}")
            elif anchor and dest.suffix == ".md" and anchor not in anchors_of(dest, cache):
                broken.append(f"{where}: missing anchor #{anchor} in {dest.relative_to(ROOT)}")

    if args.list:
        print("External links (not fetched):")
        for url in sorted(external):
            print("  " + url)
    if broken:
        print(f"{len(broken)} broken link(s):")
        for b in broken:
            print("  " + b)
        return 1
    print(f"links: {checked} internal links in {len(md_files)} Markdown files are OK ({len(external)} external links not fetched)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
