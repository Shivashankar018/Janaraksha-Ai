# Contributing to JanaRaksha AI

Thank you for helping. This guide explains how to set up the project, how the code is organised and what we check before a change is merged.

## Ground rules

- **Fictional data only.** Never add real complaints, names, phone numbers, ID numbers, photos of real people or real case records, not even in tests or screenshots.
- **Do not overstate.** If a feature is partly built or demo only, say so in the code, the UI and the docs ([features.md](docs/features.md) uses ✅ / 🟡 / ⏳).
- **Officers decide.** Automation suggests; it must not register, reject or close anything without an officer's action.
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Set up

```bash
git clone https://github.com/reyanftw/janaraksha-ai.git
cd janaraksha-ai
python3 scripts/build.py            # dist/index.html
pip install -r tests/requirements.txt
python3 -m playwright install chromium
python3 -m pytest                   # end-to-end tests
```

See the [installation guide](docs/installation.md) for details.

## Workflow

1. Open an issue first for anything larger than a small fix, so we can agree on the approach.
2. Create a branch from `main`: `feat/short-name`, `fix/short-name` or `docs/short-name`.
3. Make the change in `src/` (never edit `dist/`; it is build output and is not committed).
4. Build, test and check the links:
   ```bash
   make check && make test && make links
   ```
5. Commit with a clear message. We use [Conventional Commits](https://www.conventionalcommits.org/):
   `feat: add station filter to escalations`, `fix: keep Raksha scroll position`, `docs: update demo guide`.
6. Open a pull request and fill in the template.

## How the code is organised

- The app is **plain HTML, CSS and JavaScript**, with no framework and no runtime dependencies. Please keep it that way unless the team agrees otherwise in an issue.
- `scripts/build.py` joins the modules **in a fixed order** into one page. If you add a module, add it to `MODULES` in the right place. A module may only run code at load time that uses names from modules above it. `src/js/app.js` stays last.
- Views return HTML strings. Escape every value that comes from data with `h()`.
- User actions use attributes, not inline handlers:
  - `data-act="name"` → `ACT.name(el, event)` (click)
  - `data-bind="name"` → `BIND.name(el)` (change, or input for names in `LIVE`)
  - `data-form="name"` → `FORMS.name(form)` (submit)
  Put new handlers in the feature module's own object (for example `CPACT`) and merge it in `app.js`.
- Write to the audit trail with `log(action, recordId, detail)` for every decision an officer makes.
- Save state with `save()` (station state) or `saveComplaint(c)` (online complaints).

## Code style

- 2-space indentation, double quotes, semicolons, `const` and `let` (no `var`). See [.editorconfig](.editorconfig).
- Names: `camelCase` for functions and variables, `UPPER_SNAKE_CASE` for constant tables, kebab-case for file names.
- Start every source file with a one-line `/* ===== ... ===== */` comment that says what it contains.
- Keep functions small and comment the *why*, not the *what*.
- Interface text: plain, short English sentences. Avoid jargon.

## Interface text and Kannada

Every new English string that users see needs a Kannada entry. See [localization](docs/localization.md). Mark user-written data with `data-notr` so it is not translated.

## Tests

- Add or update an end-to-end test in `tests/e2e/` for every behaviour you add or change.
- Tests must not depend on the order they run in; each test starts with fresh demo data.
- Tests fail on any JavaScript error in the page, so fix errors instead of ignoring them.

## Screenshots

If you change a screen that appears in `docs/assets/screenshots/`, replace the image. Use the demo data, a 1440 × 900 window, and save it as a JPEG of about 1280 px width.

## Pull request checklist

- [ ] `make check` passes (build and JavaScript syntax check)
- [ ] `make test` passes
- [ ] `make links` passes
- [ ] New interface text has Kannada text
- [ ] Docs updated (features status, workflows, screenshots) where needed
- [ ] Only fictional data
