#!/usr/bin/env python3
"""Build JanaRaksha AI into one self-contained HTML file.

The app is plain HTML, CSS and JavaScript with no framework and no package
dependencies. The build inlines the stylesheet and the JavaScript modules into
src/index.html and writes the result to dist/index.html.

The modules share one global scope, so their ORDER MATTERS: a file may only run
code at load time that uses names defined in files listed above it. Functions
may call each other in any order once the page has loaded. Keep app.js last,
because it starts the app.

Usage:
    python3 scripts/build.py            # writes dist/index.html
    python3 scripts/build.py --check    # also runs `node --check` on the bundled JavaScript
    python3 scripts/build.py --out path/to/file.html
"""
from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

STYLES = ["styles/main.css"]

# Load order of the JavaScript modules (see the note above).
MODULES = [
    "assets/sample-documents.js",          # fictional scanned papers used by the Document Scanner demo
    "js/data/seed-state.js",               # users, roles, stations data, fictional station records and tasks
    "js/core/core.js",                     # helpers, state, storage, rule checks, OCR, AI hooks, link engine
    "js/i18n/i18n.js",                     # translation engine (English and Kannada)
    "js/i18n/kn-dictionary.js",            # Kannada text: officer workspace
    "js/i18n/kn-dictionary-portal.js",     # Kannada text: login, citizen portal, Commissioner, Raksha
    "js/features/laws.js",                 # common offences and law sections (BNS with old IPC reference)
    "assets/gateway-photo.js",             # login page photo
    "js/ui/brand.js",                      # badge, demo logo, watermarks, avatars (original drawings)
    "js/ui/views.js",                      # station shell and module pages
    "js/features/portal.js",               # login gateway, citizen portal, online complaints inbox
    "js/data/seed-complaints.js",          # fictional online complaints (CMP/2026/1001 to 1016)
    "js/data/seed-complaints-stations.js", # fictional complaints for every station (CMP/2026/1101 onward)
    "js/features/progress.js",             # complaint codes, FIR numbers, stages, timelines, case connections
    "js/features/commissioner.js",         # Commissioner dashboard and progress tracking
    "js/features/escalation.js",           # escalation to the Commissioner and instructions to stations
    "js/features/raksha.js",               # Raksha AI case assistant
    "js/features/acknowledgment.js",       # printable acknowledgment slip for citizens
    "js/app.js",                           # rendering, routing, actions and start-up (must stay last)
]


def read(rel: str) -> str:
    path = SRC / rel
    if not path.is_file():
        sys.exit(f"build: missing source file src/{rel}")
    return path.read_text(encoding="utf-8")


def build() -> str:
    template = read("index.html")
    for marker in ("<!-- @styles -->", "<!-- @scripts -->"):
        if template.count(marker) != 1:
            sys.exit(f"build: src/index.html must contain {marker} exactly once")
    css = "\n".join(read(f) for f in STYLES)
    js = "\n".join(read(f) for f in MODULES)
    return template.replace("<!-- @styles -->", css).replace("<!-- @scripts -->", js)


def node_check(html: str) -> None:
    node = shutil.which("node")
    if not node:
        sys.exit("build: --check needs Node.js on the PATH")
    start, end = html.index("<script>\n") + len("<script>\n"), html.rindex("\n</script>")
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as tmp:
        tmp.write(html[start:end])
    result = subprocess.run([node, "--check", tmp.name], capture_output=True, text=True)
    Path(tmp.name).unlink(missing_ok=True)
    if result.returncode:
        sys.exit("build: JavaScript syntax check failed\n" + result.stderr)
    print("build: JavaScript syntax check passed")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--out", default=str(ROOT / "dist" / "index.html"), help="output file (default: dist/index.html)")
    parser.add_argument("--check", action="store_true", help="run `node --check` on the bundled JavaScript")
    args = parser.parse_args()

    html = build()
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print(f"build: wrote {out.relative_to(ROOT) if out.is_relative_to(ROOT) else out} ({len(html.encode('utf-8')) // 1024} KB, {len(MODULES)} modules)")
    if args.check:
        node_check(html)


if __name__ == "__main__":
    main()
