# Demo guide

Everything a judge, reviewer or new team member needs to try JanaRaksha AI in a few minutes. All data is fictional.

## Contents

- [Demo accounts](#demo-accounts)
- [Useful complaint codes](#useful-complaint-codes)
- [Five-minute walkthrough](#five-minute-walkthrough)
- [Two-tab demo: citizen and officer at the same time](#two-tab-demo-citizen-and-officer-at-the-same-time)
- [Show an escalation with the demo clock](#show-an-escalation-with-the-demo-clock)
- [Reset the demo](#reset-the-demo)

## Demo accounts

Admin password for every ID: **`demo1234`**

| Phase | ID | Name | What this role can do |
| --- | --- | --- | --- |
| Commissioner | `KLB-CP-01` | Shri R. K. Desai (demo) | See every station, escalations and progress; send instructions and remarks; open the audit trail |
| Police | `KLB-SHO-01` | Insp. Vinod Hegde | Station House Officer: enter, scan, verify, review links, assign tasks, change stages, audit trail |
| Police | `KLB-SI-02` | SI Kavya Rao | Sub-Inspector: the same as the SHO |
| Police | `KLB-HC-03` | HC Imran Shaikh | Head Constable: enter and scan records, add updates; cannot verify |
| Police | `KLB-CLK-04` | Lata Mane | Records Clerk: enter and scan records, add updates; cannot verify |

In the Police phase, choose the station on the login form. The richest demo station is **University Police Station**. Every one of the 37 stations has at least two demo complaints.

**Citizens** use any 10-digit mobile number. The OTP is shown on screen. These numbers already have complaints:

| Mobile | Complaint | Shows |
| --- | --- | --- |
| `9000000011` | `CMP/2026/1001` | Police asked for more information; the citizen can reply |
| `9000000033` | `CMP/2026/1003` | Registered complaint with FIR `0071/2026`, under investigation |
| `9000000044` | `CMP/2026/1004` | Action taken: accused arrested, chain recovered |

## Useful complaint codes

Type these into **Raksha AI** or search them in the Commissioner's progress tracking.

| Code | Station | Story | Good for showing |
| --- | --- | --- | --- |
| `CMP/2026/1001` | University | Handbag theft at a bus stop | More information requested |
| `CMP/2026/1002` | CEN (cyber) | OTP fraud call | New complaint; same phone as older cases |
| `CMP/2026/1003` | University | Scooter theft | FIR, investigation timeline, next step |
| `CMP/2026/1004` | Station Bazaar | Chain snatching by Ravi Jadhav | Action taken; Commissioner remark; connected cases |
| `CMP/2026/1008` | Jewargi | Tractor trailer theft | Fully resolved case |
| `CMP/2026/1010` | Ashok Nagar | House break-in | Escalated: station did not open it |
| `CMP/2026/1011` | Roza | Missing boy traced | Action taken, near the end |
| `CMP/2026/1012` | Sedam | Land boundary dispute | Not accepted (civil matter) |
| `CMP/2026/1013` | M B Nagar | Bank KYC fraud | Case connection through the phone `+91 00000 55821` |
| `DEMO-205` | University | Motorcycle theft (old paper file) | Digitised record; escalated follow-up task |
| `CMP/2026/9999` | | | "This case does not exist" |

## Five-minute walkthrough

**1. Citizen files a complaint (1 minute)**
1. Open the app and choose **Citizen**. Enter `9876500099`, then the OTP shown on screen.
2. Click **Fill sample data (demo)**, tick the declaration on the Review step and submit.
3. Note the complaint code on the acknowledgment. Try **Print acknowledgment**.

**2. The station verifies it (1 minute)**
1. Click **Log out**, choose **Admin login › Police phase**, sign in as `KLB-SI-02`, station *University Police Station*.
2. The bell shows the new complaint. Open it, read the automatic checks, tick the five checklist items, sign and click **Verify and register**. The complaint gets an FIR number.

**3. Station modules (1.5 minutes)**
1. **Direct Entry**: choose *Cheating*, type a summary that contains `+91 00000 55821`. Connected cases appear at once. Add a person, choose Aadhaar and type `9999 0000 7779` (a fictional number that passes the check digit). Only the masked form is kept.
2. **Document Scanner**: use the sample *paper complaint*, wait for OCR, then **Fill the Direct Entry form**. Ravi Jadhav links to older cases.
3. Open `CMP/2026/1003` from the dashboard and add a progress update that moves it to *Action taken*.

**4. The Commissioner (1 minute)**
1. Log out and sign in to the **Commissioner phase** as `KLB-CP-01`.
2. Read the dashboard counts and the escalation table, then open **Escalations**.
3. On the DEMO-205 task, click **Send instruction**. Sign in as `KLB-HC-03` to see the instruction and reply; the reply appears on the Commissioner's Escalations page.

**5. Raksha AI and Kannada (30 seconds)**
1. Click **Raksha AI**, type `CMP/2026/1004`, then a wrong code such as `CMP/2026/9999`.
2. Switch to **ಕನ್ನಡ** in the top bar.

## Two-tab demo: citizen and officer at the same time

Open the app in two tabs of the **same browser**. Sign in as a citizen in one tab and as `KLB-SI-02` in the other. When the citizen submits, the officer's tab shows the new complaint at once. When the officer asks for more information, the citizen's tab shows it. (🟡 This works between tabs of one browser only; a real system needs a server.)

## Show an escalation with the demo clock

1. Sign in as the Commissioner and open **Escalations**.
2. Click **Move 7 days forward**. More work passes the time limit, and the Commissioner gets a notification.
3. Click **Back to real time** when you finish.

## Reset the demo

*About and guardrails › Reset demo data* restores all demo records and complaints in this browser. Clearing the browser's site data has the same effect.
