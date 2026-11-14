# Changelog

All notable changes to JanaRaksha AI are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-11-14

First organised release of the Kalyan Karnataka Buildathon 2026 prototype.

### Added

- **Repository structure**: `src/` split into data, core, i18n, ui and feature modules; `scripts/build.py` with a documented module order and an optional syntax check; `dist/` as build output.
- **Documentation**: README, installation guide, demo guide, features (with built / demo-only / planned status), user workflows, architecture, data model, security and privacy, localization, roadmap, screenshot gallery.
- **Branding**: banner and badge artwork, screenshots of every main screen.
- **Quality**: 24 Playwright end-to-end tests; link checker for the Markdown files; GitHub Actions for CI and an optional GitHub Pages deployment; issue and pull-request templates; `.editorconfig`, `.gitattributes`, `.gitignore`.
- **Project files**: MIT License, contributing guide, code of conduct, security policy.

### Changed

- About page: the reset note now says that it restores all demo records and complaints (it said "15 records").
- Source file headers describe each module; the escalation header matches the current behaviour.
- `scripts/generate_sample_documents.py` (was `gen_docs.py`) documents its purpose and writes to `build/sample-documents/`.

### Removed

- Three unused names: the `MARK` icon constant, `ESC_ROLE_LABEL` and `escFind`.

## Prototype history (before 1.0.0)

The prototype was built in iterations during the buildathon. In order:

- Station modules: Direct Entry, Smart Document Scanner, Case Connection Finder, Progress Tracker, search, audit trail and pilot metrics.
- Citizen portal with OTP login, six-step complaint form, ID checks and masking, photos, acknowledgment slip; online complaints inbox with verification.
- Kannada interface; brand drawings, watermarks and the maroon and gold theme.
- Law-section reference list (BNS with the old IPC section).
- Admin login with the Commissioner and Police phases; complaint codes `CMP/<year>/<number>`; FIR numbers; five investigation stages with timelines; Commissioner dashboard and progress tracking with remarks.
- Raksha AI case assistant with live tracking.
- Escalation moved to the Commissioner phase; station officers see only instructions.
- Demo complaints for all 37 Kalaburagi police stations.

[1.0.0]: https://github.com/reyanftw/janaraksha-ai/releases/tag/v1.0.0
