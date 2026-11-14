# Features

This page lists every feature by user role and marks its status:

- ✅ **Built**: works in the prototype today.
- 🟡 **Demo only**: works, but in a simplified way that a real deployment must replace.
- ⏳ **Planned**: not built. Listed in the [roadmap](roadmap.md).

## Contents

- [Login gateway](#login-gateway)
- [Citizen portal](#citizen-portal)
- [Police phase](#police-phase)
- [Commissioner phase](#commissioner-phase)
- [Raksha AI case assistant](#raksha-ai-case-assistant)
- [Shared features](#shared-features)
- [Integrations](#integrations)

## Login gateway

| Feature | Status | Details |
| --- | --- | --- |
| Citizen or Admin choice | ✅ | The first page; a reload always returns here |
| Admin login with two phases | ✅ | **Commissioner phase** (all stations) and **Police phase** (one station). A Commissioner ID is refused in the Police phase and the reverse |
| Station choice for police | ✅ | The officer picks a station from the 37 Kalaburagi stations in the demo list |
| Officer authentication | 🟡 | Fixed demo IDs and one demo password (`demo1234`) |
| Citizen OTP | 🟡 | A random 6-digit OTP is shown on screen as a "demo SMS"; no SMS is sent |

## Citizen portal

| Feature | Status | Details |
| --- | --- | --- |
| Six-step complaint form | ✅ | Your details › ID proof › Address › Complaint › Police station › Review |
| Filing for someone else | ✅ | Name and relation of the person the complaint is for |
| ID proof checks | ✅ | Aadhaar format and Verhoeff check digit, PAN format, voter ID, driving licence and passport formats; name-on-ID match |
| ID masking | ✅ | Numbers are shown masked, for example `XXXX XXXX 1234` |
| Address checks | ✅ | Taluk list and a Kalaburagi district PIN check |
| Photos | ✅ | Complainant photo (camera or upload), ID card photo, up to 5 evidence photos |
| Law sections for information | ✅ | Shows which sections may apply to the text; the officer decides the final sections |
| Sample data button | ✅ | Fills the form with fictional details for a quick demo |
| Acknowledgment | ✅ | Complaint code, print (A4) and download as an HTML file; states that it is not an FIR |
| My complaints | ✅ | Status, stage, FIR number, progress updates, police questions and the citizen's replies |
| Saved draft | ✅ | The form is kept per mobile number until it is submitted |
| Emergency notice | ✅ | Tells the user to call 112 in an emergency |

## Police phase

### Station dashboard

| Feature | Status | Details |
| --- | --- | --- |
| Station counts | ✅ | Total, pending verification, in progress, resolved, FIRs registered, for the officer's station |
| Module shortcuts | ✅ | Direct Entry, Document Scanner, Case Connection, Progress Tracker |
| Complaints in progress | ✅ | With the five-stage progress bar and the last update |
| Needs attention list | ✅ | New complaints, records to verify, links to review, the officer's tasks, Commissioner instructions |
| Guided demo | ✅ | Five steps that walk through the main modules |

### Online complaints inbox

| Feature | Status | Details |
| --- | --- | --- |
| Tabs and filters | ✅ | Open, New, Info needed, Registered, Not accepted, All; station filter; search |
| Automatic checks | ✅ | OTP-confirmed mobile, ID format and check digit, name match, photos attached, PIN in district, enough detail |
| Verification checklist | ✅ | Five checks the officer ticks before registering |
| Full ID number | ✅ | SI and SHO can reveal it during verification; each reveal is written to the audit trail |
| Ask for more information | ✅ | A message to the citizen; the complaint waits for the reply |
| Not accept | ✅ | With a reason that the citizen sees |
| Verify and register | ✅ | Needs the officer's signature; creates the station record and, for case types, the next FIR number of the station |
| Print the acknowledgment | ✅ | Officers can reprint the citizen's slip |

### Direct Entry of Data (module 01)

| Feature | Status | Details |
| --- | --- | --- |
| Complaint code | ✅ | Next free `CMP/<year>/<number>`, or the station's own reference |
| Record types | ✅ | Case types (theft, vehicle theft, cheating, missing person, accident, incident) and administrative types (petition, general diary) |
| People | ✅ | Name, role (complainant, accused, witness, ...), mobile, alias, address, Aadhaar or PAN |
| Masked Aadhaar and PAN | ✅ | The number is checked, then only the masked form is kept |
| Police station | ✅ | Defaults to the officer's station |
| Identifiers | ✅ | Vehicle, phone, IMEI, document and other references; found in the summary text too |
| Quality check | ✅ | Rule checks list what is missing or unclear, with a completeness score |
| AI review of the wording | 🟡 | Only when the page runs inside Claude with AI allowed |
| Law sections | ✅ | Suggestions from the type and summary; search about 60 common offences; BNS with the old IPC section |
| Photos | ✅ | Up to 8 photos (camera or upload) |
| Signatures | ✅ | Complainant signature, thumb impression and officer signature on drawing pads |
| Officer review | ✅ | Clerks and head constables submit; SI and SHO verify; drafts can be saved |
| Live case connections | ✅ | Connected codes appear as the officer types |

### Document Scanner (module 02)

| Feature | Status | Details |
| --- | --- | --- |
| Upload or photograph | ✅ | Images and PDF files; sample paper records for the demo |
| OCR | ✅ / 🟡 | Tesseract.js in the browser; Claude vision when inside Claude; PDF text layer read with PDF.js |
| Field structuring | ✅ | Reference, type, date, time, place, station, people, Aadhaar (masked at once), identifiers, summary |
| Confidence | ✅ | Low-confidence fields must be checked and ticked before saving |
| Original kept | ✅ | The scanned page stays linked to the record |
| Fill the Direct Entry form | ✅ | One click moves the scanned complaint into the Direct Entry form |

### Case Connection (module 03)

| Feature | Status | Details |
| --- | --- | --- |
| Automatic links | ✅ | Same person, alias, phone, vehicle, IMEI, place or accused name |
| Explainable reasons | ✅ | Every link shows the field and value that matched |
| Officer decision | ✅ | Accept, dismiss or add a note; rate how useful a link was |
| Across stations | ✅ | Complaint connections compare all complaints in the demo data |

### Progress Tracker (module 04)

| Feature | Status | Details |
| --- | --- | --- |
| Five stages | ✅ | Filed › Verified › Under investigation › Action taken › Resolved |
| Progress updates | ✅ | What was done, the next step, the handling officer; only SI and SHO may move the stage |
| Case workspace | ✅ | Verified facts, source files, links, timeline, follow-up tasks with owner and due date, notes |
| Commissioner instructions | ✅ | Shown on the task or complaint with "Reply with action taken" |
| Timeline | ✅ | Every step with who did it and when (IST) |

### Search, audit and metrics

| Feature | Status | Details |
| --- | --- | --- |
| Search records | ✅ | Names, vehicles, phones, places; each result shows the field that matched |
| Audit trail | ✅ | Every login, entry, verification, decision and ID reveal; filters by user, action and text |
| Pilot metrics | ✅ | Retrieval time, entry completeness, link usefulness, task visibility, calculated from use |

## Commissioner phase

| Feature | Status | Details |
| --- | --- | --- |
| Commissioner dashboard | ✅ | Total, escalated, pending, verified-in-progress and resolved counts; progress bar by stage; station filter |
| Online complaint escalations table | ✅ | Complaint, station, pending days, escalation reason, officer who must act, stage |
| Station-wise view | ✅ | Every station with totals, pending, in progress, resolved and escalated |
| Latest updates feed | ✅ | Progress updates and remarks from all stations |
| Escalations page | ✅ | Late online complaints and station tasks; time limit (3, 5, 6, 7 or 10 days); replies from stations; due-soon list |
| Send instruction | ✅ | Goes to the responsible officer, or into the complaint timeline when the station has no demo account |
| Give to another officer | ✅ | For the demo station; the clock starts again |
| Demo clock | 🟡 | Moves time forward to show escalations without waiting |
| Progress tracking | ✅ | Every complaint with its stepper; filters by station, stage and text; detail with timeline and connected cases |
| Remarks | ✅ | A remark goes into the complaint timeline and to the station's notifications |

Station officers do **not** see escalations. They see only the instructions and remarks the Commissioner sends.

## Raksha AI case assistant

A floating **Raksha AI** button on every admin page opens a chat panel.

| Feature | Status | Details |
| --- | --- | --- |
| Code lookup | ✅ | Accepts `CMP/2026/1001`, `cmp 2026 1001`, the number alone (`1001`) and old case numbers such as `DEMO-205` |
| Unknown codes | ✅ | Answers "This case does not exist" with the correct format |
| Case details | ✅ | Category, station, complainant, place, date and time |
| What happened | ✅ | From the complaint text |
| Current status and FIR | ✅ | Stage, verification, FIR number and registration date |
| Live tracking | ✅ | Timeline of procedures and actions, handling officer, last update with date and time |
| Next step | ✅ | From the officer's recorded next step, or from the stage |
| Connected cases | ✅ | Codes with the matching reason |
| Escalation status | ✅ | Shown to the Commissioner only |
| AI-written summary | 🟡 | Only inside Claude; elsewhere the same sections are written by rules from the record |
| Audit | ✅ | Every lookup, including unknown codes, is logged |

## Shared features

| Feature | Status | Details |
| --- | --- | --- |
| English and Kannada | ✅ | One switch; records stay in the language they were written in |
| Phone layout | ✅ | Bottom-sheet Raksha panel, stacked tables and cards |
| Light and dark mode | ✅ | Follows the device setting |
| Notifications | ✅ | Bell panel, toasts and a count in the page title |
| Live updates between tabs | 🟡 | Tabs of one browser only |
| Accessibility basics | ✅ | Labels for screen readers, keyboard focus, Escape closes panels |
| Demo data reset | ✅ | About and guardrails › Reset demo data |

## Integrations

| Integration | Status | Notes |
| --- | --- | --- |
| Claude (Anthropic) | 🟡 Optional | Used only when the page runs inside Claude and AI is allowed; the app works fully without it |
| Tesseract.js, PDF.js | ✅ | Open-source libraries loaded from public CDNs when a new document is scanned |
| Google Fonts | ✅ | Archivo, Public Sans, IBM Plex Mono, Noto Sans Kannada |
| CCTNS / government systems | ⏳ | Not connected. Any integration needs government approval |
| SMS gateway | ⏳ | Not connected; OTP is a demo |
| Server and database | ⏳ | Not built; see the [roadmap](roadmap.md) |
