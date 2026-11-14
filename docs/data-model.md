# Data model

The prototype keeps its data as JavaScript objects in browser storage (see [architecture › state and storage](architecture.md#state-and-storage)). This page describes those objects so that a future back end can use the same shapes. All demo values are fictional.

## Identifiers

| Identifier | Format | Example | Notes |
| --- | --- | --- | --- |
| Complaint code | `CMP/<year>/<number>` | `CMP/2026/1003` | Given to every online complaint and every new Direct Entry record. The next number is the highest used number plus one |
| Old station record | free text | `DEMO-205` | Records digitised from paper keep their own reference |
| FIR number | `<number>/<year>`, per station | `0071/2026` | Given when an SI or SHO registers a case type. Each station has its own series |
| Task | `T-<n>` | `T-1` | Follow-up task on a station record |

## Complaint

An online complaint filed by a citizen (`C` in the code, stored under `janaraksha-complaints-v2`).

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | Complaint code |
| `createdAt`, `updatedAt` | ISO time | Filed and last changed |
| `phone` | string | Mobile number confirmed by OTP |
| `status` | `submitted` · `review` · `info` · `verified` · `rejected` | Verification status |
| `stage` | see [stages](#stages) | Investigation stage after registration |
| `station` | string | Police station chosen by the citizen |
| `assignedTo`, `officer` | user id or `other:<name>` | Verifying officer and handling officer |
| `filing` | `{ as, otherName, relation }` | Filed for self or for someone else |
| `person` | `{ name, father, gender, age, occupation, email, altPhone, photo }` | Complainant |
| `idp` | `{ type, number, nameOnId, photo }` | ID proof. Shown masked; see [security](security-and-privacy.md) |
| `addr` | `{ house, street, village, taluk, district, state, pin }` | Address |
| `incident` | `{ category, date, time, place, description, involved, accused[], property, value, witnesses, photos[] }` | What happened |
| `vcheck` | `{ identity, phone, address, details, station }` | Officer's verification checklist |
| `messages` | `[{ at, from, by, text }]` | Questions from the police and the citizen's replies |
| `history` | `[{ at, by, kind, text }]` | Status events: submitted, opened, info, verified, rejected |
| `track` | `[{ at, by, kind, stage, text, next, officer, due }]` | Progress updates (`progress`), Commissioner remarks (`remark`) and instructions (`instruction`) |
| `fir`, `verifiedBy`, `verifiedAt`, `recordId` | | Set on registration |
| `closeReason`, `closedBy` | | Set when not accepted |
| `esc` | `{ lastAt, instructions[], responses[] }` | Escalation clock, Commissioner instructions and station replies |
| `adminUnread`, `citizenUnread` | boolean | Notification flags |

## Station record

A record entered at the station, digitised from paper, or created when an online complaint is registered (`S.records`).

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | Complaint code or old reference |
| `type`, `title`, `category` | string | Record type (case or administrative) |
| `date`, `time`, `location`, `summary` | string | Incident facts |
| `people` | `[{ name, role, contact, alias, idType, idMasked, address }]` | Only the masked ID is stored |
| `identifiers` | `[{ kind, value, context }]` | Vehicle, phone, IMEI, document or other references |
| `sections` | `string[]` | Law sections chosen by the officer |
| `docIds`, `photos` | | Linked source documents and photos |
| `source` | `direct` · `scan` · `online` | How the record was made |
| `status` | `draft` · `pending` · `verified` | Record verification |
| `caseStatus`, `stage`, `track`, `fir`, `officer`, `station` | | Case progress |
| `createdBy`, `createdAt`, `verifiedBy`, `verifiedAt` | | Who and when |

## Other objects

| Object | Fields | Meaning |
| --- | --- | --- |
| Task (`S.tasks`) | `id, recordId, title, assignee, due, status, createdBy, createdAt, assignedAt, lastActionAt, doneBy, doneAt, esc` | Follow-up work with an owner and a due date |
| Note (`S.notes`) | `id, recordId, by, at, text` | Officer update on a record |
| Link (`S.links`) | `key, a, b, reasons[{ kind, value }], status, notes, rating` | Suggested connection between two records and the officer's decision |
| Document (`S.docs`) | `id, name, label, recordId, status, engine, ocrText, pages, uploadedBy, verifiedBy, ...` | Scanned paper and its OCR result |
| Audit entry (`S.audit`) | `id, at, userId, action, recordId, detail` | One event in the audit trail |
| Notification (`S.escNotes`) | `id, to, kind, key, ref, title, at, read, by, text, due` | Escalations for the Commissioner; instructions and remarks for officers |

## Stages

| Stage id | Label | Set by |
| --- | --- | --- |
| `filed` | Filed | Citizen submission or station entry |
| `verified` | Verified | SI or SHO registration |
| `investigation` | Under investigation | Progress update by an SI or SHO |
| `action` | Action taken | Progress update by an SI or SHO |
| `resolved` | Resolved | Progress update by an SI or SHO |
| `rejected` | Not accepted | Officer decision with a reason |

## Demo data

| Set | Source file | Size |
| --- | --- | --- |
| Station records, tasks, documents | `src/js/data/seed-state.js` | 16 station records with scanned sources, tasks and links |
| Online complaints | `src/js/data/seed-complaints.js` | `CMP/2026/1001` to `1016` |
| Complaints for every station | `src/js/data/seed-complaints-stations.js` | 89 complaints, `CMP/2026/1101` onward, generated with a fixed random seed so they are the same in every browser |
| Law sections | `src/js/features/laws.js` | About 60 common offences, BNS with the old IPC reference |
| Police stations | `src/js/features/portal.js` (`STATIONS`) | 37 stations in 6 groups |
