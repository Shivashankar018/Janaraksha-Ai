# Installation guide

JanaRaksha AI builds into one HTML file. You do not need Node.js, npm, a database or any API key to build or run it.

## Contents

- [Requirements](#requirements)
- [Build and run](#build-and-run)
- [Run the tests](#run-the-tests)
- [Make targets](#make-targets)
- [Environment variables](#environment-variables)
- [Deploy](#deploy)
- [Browser support](#browser-support)
- [Troubleshooting](#troubleshooting)

## Requirements

| Tool | Version | Needed for |
| --- | --- | --- |
| Python | 3.9 or later | The build script, the local web server, the tests |
| A modern browser | Chrome, Edge, Firefox or Safari (recent versions) | Running the app |
| Node.js | 18 or later (optional) | `--check`, the JavaScript syntax check |
| pytest, pytest-playwright | see `tests/requirements.txt` (optional) | The end-to-end tests |

An internet connection is used for the web fonts and, when a user scans a new document, for the OCR libraries. The app still works without it, with system fonts and stored sample OCR.

## Build and run

```bash
git clone https://github.com/reyanftw/janaraksha-ai.git
cd janaraksha-ai
python3 scripts/build.py
```

The build writes `dist/index.html` (about 1.2 MB, because the sample documents and the login photo are embedded).

**Open the file directly:** double-click `dist/index.html`, or open it from the browser's File menu.

**Or serve it** (recommended, closest to a real host):

```bash
python3 -m http.server 8000 --directory dist
```

Then open <http://localhost:8000>.

Build options:

```bash
python3 scripts/build.py --check            # also run `node --check` on the bundled JavaScript
python3 scripts/build.py --out /tmp/jr.html # write somewhere else
```

## Run the tests

```bash
python3 -m venv .venv && source .venv/bin/activate   # optional
pip install -r tests/requirements.txt
python3 -m playwright install chromium
python3 -m pytest
```

The suite builds the page, then runs 24 browser tests (gateway, citizen portal, police phase, Commissioner phase, Raksha, phone layout). To use an installed Chrome instead of the Playwright browser: `python3 -m pytest --browser-channel chrome`.

## Make targets

| Command | Does |
| --- | --- |
| `make build` | Build `dist/index.html` |
| `make check` | Build and run the JavaScript syntax check (needs Node.js) |
| `make serve` | Build and serve on <http://localhost:8000> |
| `make test` | Build and run the end-to-end tests |
| `make links` | Check the links in the Markdown files |
| `make clean` | Delete `dist/` and test output |

## Environment variables

None. The prototype has no server, no secrets and no configuration. For this reason the repository has no `.env.example`. A pilot deployment with a back end will add one; see the [roadmap](roadmap.md).

## Deploy

`dist/index.html` is a static file, so any static host works: GitHub Pages, Netlify, Vercel, an internal web server or a USB stick.

**GitHub Pages:** the workflow `.github/workflows/pages.yml` builds the page and publishes it. Enable it once under *Settings › Pages › Build and deployment › Source: GitHub Actions*, then run the workflow from the *Actions* tab. GitHub Pages on a private repository needs a paid GitHub plan.

> [!CAUTION]
> A public deployment is visible to anyone. Use only the fictional demo data. Do not enter real complaints, names, phone numbers or ID numbers into the prototype.

## Browser support

The app uses standard browser features: `localStorage`, `IndexedDB`, `<canvas>` for signatures, and the camera through file inputs. It is tested in Chromium. Recent Firefox and Safari versions are expected to work.

Data is stored per browser and per site. Opening the file from disk and from `localhost` gives two separate sets of demo data.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `build: missing source file ...` | A file under `src/` was moved or renamed. Update the `MODULES` list in `scripts/build.py` |
| The page is blank | Open the browser console. A module that runs before the names it needs are defined causes a load error; check the module order |
| Old demo data after an update | *About and guardrails › Reset demo data*, or clear the site data in the browser |
| The top bar says *AI off: rule-based mode* | This is expected outside Claude. All features work with the built-in rules |
| Scanning a new file is slow the first time | The browser downloads Tesseract.js and its English data once |
| Tests cannot find a browser | Run `python3 -m playwright install chromium`, or use `--browser-channel chrome` |
