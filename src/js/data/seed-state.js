/* ===== Reference data and fictional demo records ===== */
const STATION = { name: "Demo Police Station", place: "Kalaburagi, Karnataka", code: "DEMO-KLB" };

const USERS = [
  { id: "u-sho", name: "Insp. Vinod Hegde", role: "SHO", roleLabel: "Station House Officer" },
  { id: "u-si", name: "SI Kavya Rao", role: "SI", roleLabel: "Sub-Inspector" },
  { id: "u-hc", name: "HC Imran Shaikh", role: "HC", roleLabel: "Head Constable (Writer)" },
  { id: "u-clerk", name: "Lata Mane", role: "CLERK", roleLabel: "Records Clerk" },
  { id: "u-cp", name: "Shri R. K. Desai (demo)", role: "CP", roleLabel: "Commissioner of Police" },
];
const POLICE_USERS = () => USERS.filter((u) => u.role !== "CP");
const SYSTEM_USER = { id: "system", name: "System", role: "SYSTEM", roleLabel: "Connection engine" };

const PERMS = {
  verify: ["SHO", "SI"],
  reviewLink: ["SHO", "SI"],
  assignTask: ["SHO", "SI"],
  viewAudit: ["SHO", "SI", "CP"],
  caseStatus: ["SHO", "SI"],
};
const PERM_TEXT = {
  SHO: "Can enter, scan, verify records, review links, assign tasks and open the audit trail.",
  SI: "Can enter, scan, verify records, review links, assign tasks and open the audit trail.",
  HC: "Can enter and scan records, add updates. Cannot verify, review links or open the audit trail.",
  CLERK: "Can enter and scan records, add updates. Cannot verify, review links or open the audit trail.",
  CP: "Sees every station: complaint counts, escalations and progress. Can add remarks and open the audit trail.",
};

const RECORD_TYPES = [
  { id: "theft", label: "Theft", group: "Case record", hint: "Property taken from a person or place", color: "info" },
  { id: "vehicle-theft", label: "Vehicle theft", group: "Case record", hint: "Two-wheeler, car or other vehicle", color: "accent" },
  { id: "lost-property", label: "Lost property", group: "Case record", hint: "Item lost, no theft alleged", color: "info" },
  { id: "cheating", label: "Cheating / online fraud", group: "Case record", hint: "Calls, OTP, payment fraud", color: "violet" },
  { id: "missing-person", label: "Missing person", group: "Case record", hint: "Person not traced", color: "grey" },
  { id: "accident", label: "Road accident", group: "Case record", hint: "Collision or injury on road", color: "grey" },
  { id: "incident", label: "Incident report", group: "Case record", hint: "Other reported incident", color: "warn" },
  { id: "petition", label: "Petition", group: "Administrative", hint: "Request or grievance from public", color: "warn" },
  { id: "gd", label: "General diary entry", group: "Administrative", hint: "Station diary note", color: "warn" },
];
const PERSON_ROLES = ["Complainant", "Informant", "Petitioner", "Witness", "Victim", "Owner", "Accused", "Person mentioned"];
const ID_KINDS = [
  { id: "vehicle", label: "Vehicle registration" },
  { id: "phone", label: "Mobile number" },
  { id: "imei", label: "IMEI (phone)" },
  { id: "document", label: "Document number" },
  { id: "other", label: "Other reference" },
];
const PLACES = ["Super Market, near clock tower", "Station Bazaar main road", "Jewargi Road, near bus shelter", "Aland Road check post", "Sedam Road, near flyover", "Central Bus Stand", "Ram Mandir Circle", "Khuba Plot", "Brahmpur", "Shahabazar", "MSK Mill area", "Gulbarga University gate"];

function seedState() {
  const R = (o) => Object.assign({ people: [], identifiers: [], docIds: [], caseStatus: "Active", source: "direct", status: "verified", category: "case" }, o);
  const records = [
    R({ id: "DEMO-101", type: "theft", title: "Mobile phone theft", date: "2026-10-09", time: "20:15", location: "Super Market, near clock tower",
      summary: "Complainant reports that two persons on a motorcycle took his mobile phone from his hand while he was walking near the clock tower. A witness noted the motorcycle number as KA 00 DM 4471. No injury reported.",
      people: [{ name: "Ravi Kumar", role: "Complainant", contact: "+91 00000 11873" }, { name: "Suresh Patil", role: "Witness" }],
      identifiers: [{ kind: "imei", value: "350000001234567", context: "Stolen phone" }, { kind: "vehicle", value: "KA 00 DM 4471", context: "Motorcycle seen by witness" }],
      createdBy: "u-hc", createdAt: "2026-10-09T15:20:00Z", verifiedBy: "u-si", verifiedAt: "2026-10-10T05:10:00Z" }),
    R({ id: "DEMO-102", type: "theft", title: "Chain snatching", date: "2026-09-19", time: "07:05", location: "Station Bazaar main road",
      summary: "Complainant reports that an unknown person on foot pulled her gold chain near the vegetable market and ran towards the railway station side.",
      people: [{ name: "Savita Hiremath", role: "Complainant" }], createdBy: "u-hc", createdAt: "2026-09-19T03:00:00Z", verifiedBy: "u-si", verifiedAt: "2026-09-19T08:30:00Z" }),
    R({ id: "DEMO-103", type: "theft", title: "House break-in", date: "2026-09-22", time: "03:30", location: "Brahmpur, 4th cross",
      summary: "Complainant returned from travel and found the rear door lock broken. Two silver lamps and a television are missing.",
      people: [{ name: "Mallikarjun Biradar", role: "Complainant" }], createdBy: "u-hc", createdAt: "2026-09-22T06:00:00Z", verifiedBy: "u-sho", verifiedAt: "2026-09-22T09:40:00Z", caseStatus: "Under review" }),
    R({ id: "DEMO-104", type: "missing-person", title: "Missing person report (adult)", date: "2026-09-25", time: "18:00", location: "Shahabazar",
      summary: "Family reported that an adult family member did not return home from work. The person was located safe the next morning at a relative's house. Report closed after confirmation.",
      people: [{ name: "Shankar Rathod", role: "Complainant" }], createdBy: "u-hc", createdAt: "2026-09-25T13:00:00Z", verifiedBy: "u-sho", verifiedAt: "2026-09-26T05:00:00Z", caseStatus: "Closed" }),
    R({ id: "DEMO-106", type: "accident", title: "Two-wheeler accident", date: "2026-09-28", time: "21:40", location: "Sedam Road, near flyover",
      summary: "A motorcycle and an auto-rickshaw collided. One rider had minor injuries and was taken to the district hospital. Both vehicles were moved to the roadside.",
      people: [{ name: "Arif Pasha", role: "Victim" }, { name: "Nagaraj Kattimani", role: "Witness" }],
      identifiers: [{ kind: "vehicle", value: "KA 00 EF 2210", context: "Motorcycle involved" }, { kind: "vehicle", value: "KA 00 B 5532", context: "Auto-rickshaw involved" }],
      createdBy: "u-hc", createdAt: "2026-09-28T16:50:00Z", verifiedBy: "u-si", verifiedAt: "2026-09-29T04:00:00Z" }),
    R({ id: "DEMO-110", type: "lost-property", title: "Lost mobile phone", date: "2026-10-01", time: "12:30", location: "Ram Mandir Circle",
      summary: "Complainant states his mobile phone fell from his pocket while travelling by auto-rickshaw. No theft is alleged.",
      people: [{ name: "Vijay Kumar Sajjan", role: "Complainant" }], identifiers: [{ kind: "imei", value: "350000004455667", context: "Lost phone" }],
      createdBy: "u-clerk", createdAt: "2026-10-01T08:00:00Z", verifiedBy: "u-si", verifiedAt: "2026-10-01T10:15:00Z" }),
    R({ id: "DEMO-112", type: "cheating", title: "Online payment fraud", date: "2026-10-04", time: "16:20", location: "Khuba Plot",
      summary: "Complainant received a call from +91 00000 55821. The caller said he was from a bank and asked for an OTP to update the account. Complainant shared the OTP and Rs 18,500 was debited.",
      people: [{ name: "Geeta Kulkarni", role: "Complainant" }], identifiers: [{ kind: "phone", value: "+91 00000 55821", context: "Caller number" }],
      createdBy: "u-hc", createdAt: "2026-10-04T12:00:00Z", verifiedBy: "u-sho", verifiedAt: "2026-10-04T14:00:00Z" }),
    R({ id: "DEMO-118", type: "petition", category: "admin", title: "Petition: loud music at night", date: "2026-10-06", time: "22:30", location: "MSK Mill area",
      summary: "Residents request action on loud music from a function hall after 10 pm on weekdays.",
      people: [{ name: "Residents Welfare Association, MSK Mill", role: "Petitioner" }], createdBy: "u-clerk", createdAt: "2026-10-07T05:00:00Z", verifiedBy: "u-si", verifiedAt: "2026-10-07T07:00:00Z" }),
    R({ id: "DEMO-120", type: "theft", title: "Shop burglary", date: "2026-10-08", time: "02:00", location: "Super Market, Cloth Bazaar lane",
      summary: "Shop owner found the shutter lock cut in the morning. A cash box with about Rs 40,000 is missing. A private CCTV camera is fixed on the opposite shop.",
      people: [{ name: "Mohan Jain", role: "Complainant" }], createdBy: "u-hc", createdAt: "2026-10-08T03:30:00Z", verifiedBy: "u-si", verifiedAt: "2026-10-08T06:00:00Z" }),
    R({ id: "DEMO-205", type: "vehicle-theft", title: "Vehicle theft", date: "2026-10-02", time: "19:30", location: "Jewargi Road, near bus shelter", source: "scan",
      summary: "Complainant parked his motorcycle KA 00 DM 4471 near the Jewargi Road bus shelter at 19:30 hrs. At 21:45 hrs he found it missing. No witness at the spot.",
      people: [{ name: "Anil Deshmukh", role: "Complainant", contact: "+91 00000 48120" }],
      identifiers: [{ kind: "vehicle", value: "KA 00 DM 4471", context: "Stolen vehicle" }, { kind: "other", value: "DEMO-CH-55120", context: "Chassis reference" }],
      docIds: ["DOC-205A", "DOC-205B", "DOC-205C"], createdBy: "u-clerk", createdAt: "2026-10-02T16:45:00Z", verifiedBy: "u-si", verifiedAt: "2026-10-03T05:20:00Z" }),
    R({ id: "DEMO-207", type: "vehicle-theft", title: "Car theft", date: "2026-10-11", time: "23:00", location: "Aland Road, near petrol pump",
      summary: "Complainant parked his car outside his house at 23:00 hrs and found it missing at 06:00 hrs the next morning.",
      people: [{ name: "Basavaraj Malipatil", role: "Complainant" }], identifiers: [{ kind: "vehicle", value: "KA 00 GH 7781", context: "Stolen vehicle" }],
      createdBy: "u-hc", createdAt: "2026-10-12T01:30:00Z", verifiedBy: "u-sho", verifiedAt: "2026-10-12T04:00:00Z" }),
    R({ id: "DEMO-210", type: "theft", title: "Mobile phone theft at bus stand", date: "2026-10-14", time: "17:50", location: "Central Bus Stand, platform 2",
      summary: "Complainant reports his mobile phone was taken from his bag while boarding a bus. A passenger, Farhana Begum, saw a young man run towards the exit and gave her contact number.",
      people: [{ name: "Santosh Gowda", role: "Complainant" }, { name: "Farhana Begum", role: "Witness", contact: "+91 00000 31416" }],
      identifiers: [{ kind: "imei", value: "350000007788990", context: "Stolen phone" }],
      createdBy: "u-hc", createdAt: "2026-10-14T13:30:00Z", verifiedBy: "u-si", verifiedAt: "2026-10-14T15:00:00Z" }),
    R({ id: "DEMO-215", type: "cheating", title: "OTP fraud call", date: "2026-10-19", time: "11:45", location: "Aiwan-E-Shahi area",
      summary: "Complainant received a call from +91 00000 55821 asking for an OTP to stop a card from being blocked. Complainant shared one OTP and Rs 6,200 was debited.",
      people: [{ name: "Nirmala Hosamani", role: "Complainant" }], identifiers: [{ kind: "phone", value: "+91 00000 55821", context: "Caller number" }],
      createdBy: "u-hc", createdAt: "2026-10-19T07:00:00Z", verifiedBy: "u-sho", verifiedAt: "2026-10-19T09:30:00Z" }),
    R({ id: "DEMO-220", type: "theft", title: "Bicycle theft", date: "2026-11-10", time: "08:30", location: "Gulbarga University gate", status: "pending",
      summary: "Student reports his bicycle was taken from the cycle stand near the university gate between 08:30 hrs and 13:00 hrs.",
      people: [{ name: "Rahul Kamble", role: "Complainant" }], createdBy: "u-hc", createdAt: "2026-11-10T08:10:00Z", submittedAt: "2026-11-10T08:12:00Z" }),
    R({ id: "DEMO-NEW-013", type: "lost-property", title: "Lost purse", date: "2026-11-12", time: "", location: "Bus stop", status: "draft",
      summary: "Purse lost.", people: [], createdBy: "u-clerk", createdAt: "2026-11-12T10:40:00Z" }),
  ];

  /* Station, FIR number and progress of the station records (fictional) */
  const HS = "University Police Station";
  const P = (at, by, stage, text, next) => ({ at, by, kind: "progress", stage, text, next: next || "", officer: by });
  const PROG = {
    "DEMO-101": ["0061/2026", "investigation", [P("2026-10-12T06:00:00Z", "u-si", "investigation", "Statement of witness Suresh Patil recorded. IMEI sent to the service provider for tracing.", "Wait for the IMEI trace report")]],
    "DEMO-102": ["0048/2026", "investigation", [P("2026-09-21T05:00:00Z", "u-si", "investigation", "Spot visited. Shop owners near the vegetable market questioned.", "Check CCTV of the railway station road")]],
    "DEMO-103": ["0052/2026", "action", [P("2026-09-24T06:00:00Z", "u-sho", "investigation", "Fingerprint team visited. Neighbour statement recorded."), P("2026-10-30T07:30:00Z", "u-sho", "action", "Two suspects questioned. One silver lamp recovered from a scrap dealer and seized.", "Send the recovered lamp for identification by the complainant")]],
    "DEMO-104": ["0054/2026", "resolved", [P("2026-09-26T05:30:00Z", "u-sho", "resolved", "Person found safe at a relative's house. Family confirmed. Report closed.")]],
    "DEMO-106": ["0057/2026", "investigation", [P("2026-09-30T05:00:00Z", "u-si", "investigation", "Both drivers' statements recorded. Medical report of the injured rider collected.", "Get the vehicle inspection report")]],
    "DEMO-110": ["", "resolved", [P("2026-10-01T10:30:00Z", "u-si", "resolved", "Lost property acknowledgment issued to the complainant. IMEI shared with the service provider.")]],
    "DEMO-112": ["0059/2026", "investigation", [P("2026-10-06T06:00:00Z", "u-sho", "investigation", "Bank asked to freeze the receiving account. Call records of +91 00000 55821 requested.", "Collect the call detail records")]],
    "DEMO-120": ["0063/2026", "investigation", [P("2026-10-09T05:00:00Z", "u-hc", "investigation", "Spot mahazar done. Opposite shop has a private CCTV camera.", "Collect the CCTV footage of 07-08 Oct night")]],
    "DEMO-205": ["0058/2026", "investigation", [P("2026-10-05T06:00:00Z", "u-si", "investigation", "Vehicle details sent to all stations. Recovered vehicle register checked once.", "Check the recovered vehicle register again")]],
    "DEMO-207": ["0064/2026", "investigation", [P("2026-10-13T05:00:00Z", "u-sho", "investigation", "Petrol pump CCTV collected. Car seen going towards Aland at 23:40 hrs.", "Send an alert to Aland Police Station")]],
    "DEMO-210": ["0066/2026", "action", [P("2026-10-16T06:00:00Z", "u-si", "investigation", "Witness Farhana Begum shown photos of known offenders."), P("2026-11-06T09:00:00Z", "u-si", "action", "Phone traced by IMEI to a repair shop in Afzalpur. Phone seized.", "Return the phone to the complainant after the court order")]],
    "DEMO-215": ["0068/2026", "investigation", [P("2026-10-20T06:00:00Z", "u-sho", "investigation", "Same caller number as DEMO-112. Both cases sent to the cyber cell desk.", "Get the cyber cell report on the caller number")]],
  };
  records.forEach((r) => {
    r.station = HS;
    const p = PROG[r.id];
    if (p) { r.fir = p[0]; r.stage = p[1]; r.track = p[2]; r.officer = r.verifiedBy || r.createdBy; if (p[1] === "resolved") r.caseStatus = "Closed"; }
  });
  records.find((r) => r.id === "DEMO-102").people.push({ name: "Ravi Jadhav", role: "Accused", alias: "Kalia" });
  records.find((r) => r.id === "DEMO-102").summary += " A shopkeeper later named the person as Ravi Jadhav, also called Kalia.";
  /* A registered online complaint of this station (matches CMP/2026/1003 in the complaints store) */
  const ago = (d) => new Date(Date.now() - d * DAY).toISOString();
  const ago1003 = ago(12);
  records.push(R({ id: "CMP/2026/1003", type: "vehicle-theft", title: "Vehicle theft", date: ago1003.slice(0, 10), time: "21:00", location: "Aland Road, near petrol pump", source: "online", station: HS,
    summary: "I parked my scooter KA 00 EF 2290 near the petrol pump on Aland Road at 21:00 hrs and went to the medical shop. When I came back at 21:20 hrs the scooter was missing.",
    people: [{ name: "Mallikarjun Patil", role: "Complainant", contact: "+91 90000 00033", idType: "aadhaar", idMasked: "XXXX XXXX 2045", address: "5-21, Shahabazar, Kalaburagi 585101" }],
    identifiers: [{ kind: "vehicle", value: "KA 00 EF 2290", context: "Stolen scooter" }],
    createdBy: "u-si", createdAt: ago(11), submittedAt: ago1003, verifiedBy: "u-si", verifiedAt: ago(11), fir: "0071/2026", stage: "investigation", officer: "u-si", track: [] }));

  const docs = [
    { id: "DOC-205A", name: "DEMO-205 complaint copy.jpg", asset: "SRC-205-A", label: "Complaint copy", recordId: "DEMO-205", status: "verified", engine: "Tesseract OCR", uploadedBy: "u-clerk", uploadedAt: "2026-10-02T16:40:00Z", verifiedBy: "u-si", verifiedAt: "2026-10-03T05:20:00Z" },
    { id: "DOC-205B", name: "DEMO-205 vehicle details.jpg", asset: "SRC-205-B", label: "Vehicle details sheet", recordId: "DEMO-205", status: "verified", engine: "Tesseract OCR", uploadedBy: "u-clerk", uploadedAt: "2026-10-02T16:42:00Z", verifiedBy: "u-si", verifiedAt: "2026-10-03T05:20:00Z" },
    { id: "DOC-205C", name: "DEMO-205 site note.jpg", asset: "SRC-205-C", label: "Officer site note", recordId: "DEMO-205", status: "verified", engine: "Tesseract OCR", uploadedBy: "u-si", uploadedAt: "2026-10-03T04:00:00Z", verifiedBy: "u-si", verifiedAt: "2026-10-03T05:20:00Z" },
  ];
  docs.forEach((d) => { d.ocrText = (DOC_ASSETS[d.asset] || {}).ocr || ""; d.mime = "image/jpeg"; });

  const tasks = [
    { id: "T-1", recordId: "DEMO-205", title: "Check KA 00 DM 4471 against the recovered vehicle register", assignee: "u-hc", due: "2026-11-15", status: "open", createdBy: "u-si", createdAt: "2026-11-05T06:00:00Z" },
    { id: "T-2", recordId: "DEMO-215", title: "Send cross-reference note to the cyber cell desk", assignee: "u-si", due: "2026-11-14", status: "open", createdBy: "u-sho", createdAt: "2026-10-20T05:00:00Z" },
    { id: "T-3", recordId: "DEMO-120", title: "Ask the opposite shop owner for CCTV footage of 07-08 Oct night", assignee: "", due: "2026-11-16", status: "open", createdBy: "u-hc", createdAt: "2026-10-08T07:00:00Z" },
    { id: "T-4", recordId: "DEMO-103", title: "Record statement of neighbour", assignee: "u-hc", due: "2026-09-25", status: "done", createdBy: "u-sho", createdAt: "2026-09-22T10:00:00Z", doneBy: "u-hc", doneAt: "2026-09-24T09:00:00Z" },
  ];

  const notes = [
    { id: "N-1", recordId: "DEMO-205", by: "u-si", at: "2026-11-04T10:30:00Z", text: "Spoke to complainant. No new information. Vehicle not yet traced." },
    { id: "N-2", recordId: "DEMO-215", by: "u-sho", at: "2026-10-20T05:05:00Z", text: "Same caller number seen in DEMO-112. Cross-reference note to go to cyber cell desk." },
  ];

  const audit = [];
  const A = (at, userId, action, recordId, detail, extra) => audit.push(Object.assign({ id: "A-" + (audit.length + 1), at, userId, action, recordId, detail }, extra || {}));
  records.forEach((r) => {
    A(r.createdAt, r.createdBy, r.source === "scan" ? "Record created from scan" : "Record created", r.id, r.title);
    if (r.submittedAt) A(r.submittedAt, r.createdBy, "Submitted for verification", r.id, "Entry submitted by " + userName(r.createdBy));
    if (r.verifiedAt) A(r.verifiedAt, r.verifiedBy, "Record verified", r.id, "Officer verification recorded");
  });
  docs.forEach((d) => A(d.uploadedAt, d.uploadedBy, "Document uploaded", d.recordId, d.label + " (original kept)", { docId: d.id }));
  notes.forEach((n) => A(n.at, n.by, "Officer update added", n.recordId, n.text));
  tasks.forEach((t) => {
    A(t.createdAt, t.createdBy, "Follow-up task created", t.recordId, t.title + (t.assignee ? " (owner: " + userName(t.assignee) + ")" : " (no owner yet)"));
    if (t.status === "done") A(t.doneAt, t.doneBy, "Follow-up task completed", t.recordId, t.title);
  });
  A("2026-10-19T09:35:00Z", "system", "Link suggested", "DEMO-215", "DEMO-112 and DEMO-215 share caller number +91 00000 55821", { linkKey: "DEMO-112|DEMO-215" });
  A("2026-10-20T05:00:00Z", "u-sho", "Link accepted", "DEMO-215", "DEMO-112 and DEMO-215: same caller number. Shared with cyber desk.", { linkKey: "DEMO-112|DEMO-215" });
  A("2026-10-10T05:12:00Z", "system", "Link suggested", "DEMO-101", "DEMO-101 and DEMO-205 share vehicle reference KA 00 DM 4471", { linkKey: "DEMO-101|DEMO-205" });
  audit.sort((a, b) => a.at.localeCompare(b.at));
  audit.forEach((a, i) => (a.id = "A-" + String(i + 1).padStart(4, "0")));

  return {
    v: 5,
    userId: "u-sho",
    homeStation: HS,
    records, docs, tasks, notes, audit,
    links: [
      { key: "DEMO-112|DEMO-215", a: "DEMO-112", b: "DEMO-215", status: "accepted", createdAt: "2026-10-19T09:35:00Z", reviewedBy: "u-sho", reviewedAt: "2026-10-20T05:00:00Z", rating: "clear",
        notes: [{ by: "u-sho", at: "2026-10-20T05:00:00Z", text: "Same caller number in two fraud complaints. Shared with cyber desk." }] },
      { key: "DEMO-101|DEMO-205", a: "DEMO-101", b: "DEMO-205", status: "suggested", createdAt: "2026-10-10T05:12:00Z", notes: [] },
    ],
    metrics: { retrieval: [] },
    demo: { entry: false, scan: false, verify: false, link: false, task: false },
    seq: { entry: 14, doc: 1, task: 5, note: 3 },
  };
}
function userName(id) { const u = USERS.find((x) => x.id === id) || (id === "system" ? SYSTEM_USER : null); return u ? u.name : "Unknown user"; }
