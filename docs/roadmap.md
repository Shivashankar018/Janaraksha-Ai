# Roadmap

Everything on this page is **planned and not built**. For what works today, see [features](features.md).

## Proposed pilot architecture

This is the architecture the team proposes for a supervised pilot. It is also shown on the *About and guardrails* page of the app. The choices can change to fit the environments the department approves.

| Layer | Proposal |
| --- | --- |
| Front end | React / Next.js officer workspace and citizen portal |
| Back end | Python FastAPI for rules, roles and workflow |
| OCR and AI | Tesseract or an approved document-AI service, plus an approved language model |
| Data | PostgreSQL with relationship indexing for case connections |
| Security | Roles enforced by the server, encryption, central audit logging |

## Phase 1: pilot readiness

- [ ] Server back end and central database, using the shapes in the [data model](data-model.md)
- [ ] Real authentication for officers through the department's identity system
- [ ] Real SMS OTP for citizens, with rate limits
- [ ] Permissions enforced on the server for every request
- [ ] Encrypted storage of ID numbers; logged, permission-checked reveal
- [ ] Append-only central audit log
- [ ] Notifications to officers' devices (not only between browser tabs)
- [ ] Self-hosted fonts and OCR libraries, with a Content Security Policy

## Phase 2: supervised pilot at selected stations

- [ ] Pilot with real users at a few stations, under supervision and with approved data handling
- [ ] Measure the pilot metrics already shown in the app: retrieval time, entry completeness, link usefulness, task visibility
- [ ] Review of the Kannada text by native speakers and station staff
- [ ] Accessibility review with screen-reader users

## Phase 3: integration (only with approval)

- [ ] Any connection to CCTNS or other government systems, only after government approval and under its rules

## How to suggest an item

Open a feature request with the template in `.github/ISSUE_TEMPLATE/feature_request.md`. Describe the problem first, then the idea.
