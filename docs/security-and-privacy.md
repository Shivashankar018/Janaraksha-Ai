# Security and privacy

JanaRaksha AI handles the kind of information that police work depends on: names, phone numbers, ID numbers and descriptions of crimes. The prototype is built to show safe habits, but it is **not** a secure system. This page states plainly what it does and what a real deployment must add.

## Prototype boundary

- **Fictional data only.** Every person, number and record in the demo is invented. Do not type real complaints, names, phone numbers or ID numbers into the prototype.
- **No government connection.** There is no link to CCTNS or any other police or government system. Any future integration needs government approval.
- **Not an official product.** The app is a buildathon prototype. It is not made or endorsed by the Karnataka State Police or the Kalaburagi City Police.

## What the prototype does to protect data

| Practice | How it shows in the app |
| --- | --- |
| Masking | Aadhaar and PAN numbers are shown as `XXXX XXXX 1234`. Direct Entry and scanned records keep **only** the masked number |
| Logged access | When an SI or SHO reveals a complaint's full ID number, the audit trail records who and when |
| Least privilege | Only an SI or SHO can verify records, review links, change stages and open the audit trail. Escalations are visible only to the Commissioner |
| Human decision | OCR output and AI text are drafts. Nothing becomes a trusted record until an officer verifies it |
| Audit trail | Logins, entries, verifications, link decisions, ID reveals, Raksha lookups and instructions are logged with the user and the time |
| Original kept | A scanned page stays linked to the record made from it |
| Careful AI use | AI runs only inside Claude. Prompts allow only the facts given, forbid ID numbers and legal opinions, and the officer sees the facts beside the AI text |
| No tracking | No analytics, cookies or advertising scripts |

## Known limits of the prototype

| Limit | Why it is acceptable for the demo | What a pilot needs |
| --- | --- | --- |
| Data is stored in the browser (`localStorage`, `IndexedDB`) in plain form | Demo data is fictional and stays on the viewer's device | Central database with encryption at rest and in transit, backups and retention rules |
| Citizen complaints keep the full ID number in the browser so an officer can reveal it | Shows the verification step with fictional numbers | Store the full number encrypted on the server; reveal through a logged, permission-checked server call |
| Fixed demo IDs, one password, OTP shown on screen | Lets reviewers try every role | Department identity system, strong authentication, real SMS OTP with rate limits |
| Permissions are checked in the browser | Shows the workflow rules | Every permission enforced by the server |
| The audit log can be cleared with the browser data | Shows what is logged | Append-only central audit log |
| Third-party scripts from public CDNs (fonts, OCR libraries) | Convenient for a demo | Self-host approved libraries; set a Content Security Policy |

## External services

| Service | When it is used | What it receives |
| --- | --- | --- |
| Google Fonts | Every page load | A normal font request (no app data) |
| jsDelivr (Tesseract.js) and cdnjs (PDF.js) | Only when a user scans a new image or PDF | Library downloads; the scanned page is processed in the browser |
| Claude (Anthropic) | Only when the page runs inside Claude and AI is allowed | The facts of the record or the scanned page needed for the task |

## Reporting a vulnerability

See [SECURITY.md](../SECURITY.md).
