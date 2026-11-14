/* ===== Case progress: complaint codes, FIR numbers, stages, timelines and connected cases ===== */
const STAGES = [
  { id: "filed", label: "Filed" },
  { id: "verified", label: "Verified" },
  { id: "investigation", label: "Under investigation" },
  { id: "action", label: "Action taken" },
  { id: "resolved", label: "Resolved" },
];
const stageIdx = (s) => STAGES.findIndex((x) => x.id === s);
const stageLabel = (s) => (s === "rejected" ? "Not accepted" : (STAGES.find((x) => x.id === s) || STAGES[0]).label);
const STAGE_CHIP = { filed: "warn", verified: "info", investigation: "accent", action: "violet", resolved: "ok", rejected: "" };
const stageChip = (s) => `<span class="chip ${STAGE_CHIP[s] || ""}">${h(stageLabel(s))}</span>`;
const HOME_STATION = "University Police Station";
const isCP = () => isAdmin() && SESSION.phase === "cp";
function homeStation() {
  if (SESSION && SESSION.kind === "admin" && SESSION.phase !== "cp" && SESSION.station && SESSION.station !== "all") return SESSION.station;
  return (S && S.homeStation) || HOME_STATION;
}

/* ---------- Complaint codes: CMP/2026/1001 ---------- */
const CODE_RE = /^CMP\/(\d{4})\/(\d+)$/;
function nextCaseCode() {
  const yr = todayIST().slice(0, 4);
  const ids = (loadComplaints() || C).map((c) => c.id).concat(C.map((c) => c.id)).concat(S ? S.records.map((r) => r.id) : []).concat(S && S.draft && S.draft.refMode !== "manual" && !S.draft.editingId && !codeTaken(S.draft.ref || "") ? [S.draft.ref] : []);
  let max = 1000;
  ids.forEach((id) => { const m = String(id).match(CODE_RE); if (m && m[1] === yr) max = Math.max(max, +m[2]); });
  return `CMP/${yr}/${max + 1}`;
}
const codeTaken = (id) => !!(getRec(id) || getC(id));

/* ---------- FIR numbers (one series per station) ---------- */
const FIR_TYPES = ["theft", "vehicle-theft", "cheating", "missing-person", "accident", "incident"];
function nextFir(station) {
  const yr = todayIST().slice(0, 4);
  const used = C.filter((c) => c.station === station && c.fir).map((c) => c.fir).concat(S.records.filter((r) => (r.station || HOME_STATION) === station && r.fir).map((r) => r.fir));
  const base = 40 + ((Math.max(0, ALL_STATIONS.indexOf(station)) * 29) % 160);
  const n = used.reduce((m, f) => { const x = String(f).match(/^(\d+)\/(\d{4})$/); return x && x[2] === yr ? Math.max(m, +x[1]) : m; }, base) + 1;
  return `${String(n).padStart(4, "0")}/${yr}`;
}

/* ---------- One list of complaints for every station ---------- */
const SIGNERS = ["Complainant", "Informant", "Petitioner", "Victim"];
function itemFromC(c) {
  const r = getRec(c.id);
  const stage = c.status === "verified" ? c.stage || "verified" : c.status === "rejected" ? "rejected" : "filed";
  return { id: c.id, kind: "online", c, r, station: c.station, cat: catOf(c.incident.category).label, name: c.person.name, phone: c.phone, place: c.incident.place, date: c.incident.date, time: c.incident.time,
    summary: c.incident.description, filedAt: c.createdAt, stage, status: c.status, fir: c.fir || (r && r.fir) || "", officer: c.officer || c.assignedTo || "", track: c.track || [], verifiedAt: c.verifiedAt || "" };
}
function itemFromR(r) {
  const p = (r.people || []).find((x) => SIGNERS.includes(x.role)) || (r.people || [])[0] || {};
  const stage = r.status === "pending" ? "filed" : r.caseStatus === "Closed" ? "resolved" : r.stage || "verified";
  return { id: r.id, kind: r.source === "scan" ? "scan" : "station", c: null, r, station: r.station || HOME_STATION, cat: typeOf(r.type).label, name: p.name || "", phone: p.contact || "", place: r.location, date: r.date, time: r.time,
    summary: r.summary, filedAt: r.submittedAt || r.createdAt, stage, status: r.status, fir: r.fir || "", officer: r.officer || r.verifiedBy || r.createdBy || "", track: r.track || [], verifiedAt: r.verifiedAt || "" };
}
function caseItems() {
  const out = C.map(itemFromC);
  S.records.filter((r) => r.status !== "draft" && r.category !== "admin" && !getC(r.id)).forEach((r) => out.push(itemFromR(r)));
  return out;
}
function caseItem(id) { const c = getC(id); if (c) return itemFromC(c); const r = getRec(id); return r && r.status !== "draft" ? itemFromR(r) : null; }
const SRC_LABEL = { online: "Online complaint", station: "Station entry", scan: "Digitised file" };

/* ---------- Timeline ---------- */
const TL_ACTIONS = ["Record created", "Record created from scan", "Submitted for verification", "Record verified", "Follow-up task created", "Follow-up task completed", "Officer update added", "Case status changed", "Link accepted", "Escalated to the Commissioner", "Work given to another officer"];
function caseTimeline(it) {
  const ev = [];
  if (it.c) (it.c.history || []).forEach((x) => ev.push({ at: x.at, by: x.by, kind: "history", title: x.text, text: "", stage: x.kind === "submitted" ? "filed" : x.kind === "verified" ? "verified" : "" }));
  if (it.r) S.audit.filter((a) => a.recordId === it.id && TL_ACTIONS.includes(a.action) && auditVis(a)).forEach((a) => ev.push({ at: a.at, by: a.userId, kind: "audit", title: a.action, text: a.detail, stage: a.action === "Record verified" ? "verified" : a.action.startsWith("Record created") || a.action === "Submitted for verification" ? "filed" : "" }));
  if (it.c && it.c.status === "verified" && it.fir) { const v = ev.find((e) => e.stage === "verified"); if (v) v.fir = it.fir; }
  it.track.forEach((x) => ev.push({ at: x.at, by: x.by, kind: x.kind, title: x.kind === "remark" ? "Remark from the Commissioner" : x.kind === "instruction" ? "Instruction from the Commissioner" : x.stage ? stageLabel(x.stage) : "Progress update", text: x.text, due: x.due, next: x.next, stage: x.stage || "", officer: x.officer }));
  return ev.filter((e) => e.at).sort((a, b) => a.at.localeCompare(b.at));
}
function lastUpdate(it) { const tl = caseTimeline(it).filter((e) => e.by !== "system"); return tl[tl.length - 1] || { at: it.filedAt, by: "citizen", title: "Complaint filed" }; }
function lastProgressAt(it) {
  const t = it.track.filter((x) => x.kind === "progress").map((x) => x.at).concat(it.verifiedAt ? [it.verifiedAt] : []).concat(it.r ? S.audit.filter((a) => a.recordId === it.id && ["Officer update added", "Follow-up task completed", "Reply to senior officer", "Reply to the Commissioner"].includes(a.action)).map((a) => a.at) : []);
  return t.sort().slice(-1)[0] || it.filedAt;
}
function stageDates(it) {
  const d = { filed: it.filedAt };
  if (it.verifiedAt) d.verified = it.verifiedAt;
  it.track.forEach((x) => { if (x.stage && !d[x.stage]) d[x.stage] = x.at; });
  return d;
}
function nextStepOf(it) {
  const p = it.track.filter((x) => x.kind === "progress" && x.next).slice(-1)[0];
  if (p && it.stage !== "resolved") return p.next;
  if (it.stage === "filed") return it.status === "info" ? "Wait for the citizen to send the missing details, then finish verification." : it.status === "submitted" ? "The station must open the complaint and start verification." : "Finish the verification checklist and register the complaint.";
  if (it.stage === "verified") return "Start the investigation: visit the spot and record statements.";
  if (it.stage === "investigation") return "Collect evidence and record the next action taken.";
  if (it.stage === "action") return "Finish the legal steps and close the case when the matter is settled.";
  if (it.stage === "resolved") return "No further action. The case is closed.";
  return "";
}
const whoName = (id) => (id === "citizen" ? trStr("Citizen") : id === "system" ? trStr("System") : ownerName(id) || "Unknown user");
const escToText = (to) => (isKn() ? (to && to.startsWith("sho:") ? `${trStr(to.slice(4))} ಠಾಣಾಧಿಕಾರಿ` : trStr(escName(to))) : escName(to));

/* ---------- Shared pieces of view ---------- */
function stepperHTML(it, big) {
  if (it.stage === "rejected") return `<div class="pstep-rej">${ICON.x}<span>Not accepted by the station</span></div>`;
  const at = stageIdx(it.stage), dates = big ? stageDates(it) : {};
  return `<ol class="pstep ${big ? "big" : ""}" aria-label="Progress">${STAGES.map((s, i) => `<li class="${i < at ? "done" : i === at ? "on" : ""}"><span class="d">${i < at || (i === at && s.id === "resolved") ? "✓" : i + 1}</span><span class="l">${h(s.label)}</span>${big ? `<span class="t">${dates[s.id] ? h(fmtDate(istDay(dates[s.id]))) : ""}</span>` : ""}</li>`).join("")}</ol>`;
}
function timelineHTML(it, max, noNext) {
  const tl = caseTimeline(it);
  const show = max ? tl.slice(-max) : tl;
  const next = nextStepOf(it);
  return `<div class="ptl">${tl.length > show.length ? `<div class="ptl-more tiny muted">${tl.length - show.length === 1 ? "1 earlier event" : `${tl.length - show.length} earlier events`}</div>` : ""}${show.map((e, i) => `<div class="pti ${e.kind === "remark" || e.kind === "instruction" ? "remark" : ""} ${e.stage ? "stage" : ""} ${i === show.length - 1 ? "last" : ""}">
      <span class="o"></span><div><div class="row" style="gap:6px"><b>${h(e.title)}</b>${e.fir ? `<span class="chip ok plain">FIR No. <span data-notr>${h(e.fir)}</span></span>` : ""}${e.due ? `<span class="chip warn plain">Act by ${h(fmtDate(e.due))}</span>` : ""}</div>
      ${e.text ? `<div class="small" data-notr>${h(e.text)}</div>` : ""}
      <div class="tiny muted"><span data-notr>${h(whoName(e.by))}</span> · ${h(fmtDT(e.at))}</div></div></div>`).join("")}
    ${!noNext && next && it.stage !== "resolved" && it.stage !== "rejected" ? `<div class="pti next"><span class="o"></span><div><b>Next step</b><div class="small" data-notr>${h(trStr(next))}</div></div></div>` : ""}</div>`;
}
const caseLink = (id) => (isCP() ? `<button class="linkbtn mono" data-act="cpOpen" data-id="${h(id)}">${h(id)}</button>` : getRec(id) && !getC(id) ? recLink(id) : `<button class="linkbtn mono" data-act="openComplaint" data-id="${h(id)}">${h(id)}</button>`);

/* ---------- Progress card for station officers ---------- */
function vProgressCard(id) {
  const it = caseItem(id);
  if (!it || ["filed", "rejected"].includes(it.stage)) return "";
  const canStage = can("caseStatus");
  const later = STAGES.filter((s, i) => i > stageIdx(it.stage));
  const lu = lastUpdate(it);
  const remarks = it.track.filter((x) => x.kind === "remark").slice(-2).reverse();
  const insObj = it.c || it.r;
  const offs = POLICE_USERS().map((u) => u.id).concat(it.officer && isOther(it.officer) ? [it.officer] : []);
  return `<section class="card prog" id="prog-card"><div class="card-h"><h3>Investigation progress</h3>${stageChip(it.stage)}</div><div class="card-b stack">
    ${stepperHTML(it, true)}
    <div class="facts"><div class="fact"><div class="k">FIR number</div><div class="v">${it.fir ? `<span class="mono" data-notr>${h(it.fir)}</span>` : `<span class="muted">No FIR for this type</span>`}</div></div>
      <div class="fact"><div class="k">Handling officer</div><div class="v" data-notr>${h(whoName(it.officer))}</div></div>
      <div class="fact"><div class="k">Last update</div><div class="v small">${h(fmtDT(lu.at))}</div></div></div>
    ${escInsHTML(insObj, (it.c && it.c.status !== "verified" ? "cmp:" : "prog:") + it.id)}
    ${remarks.map((x) => `<div class="cp-remark">${ICON.pen}<div><b>Remark from the Commissioner</b> <span class="tiny muted">${h(fmtDT(x.at))}</span><div data-notr>${h(x.text)}</div></div></div>`).join("")}
    <details class="pg-tl"><summary>Show the full timeline</summary>${timelineHTML(it)}</details>
    <div class="pg-form stack" style="gap:10px">
      <div class="lbl">Add a progress update</div>
      ${it.stage !== "resolved" ? `<div class="field"><label for="pg-stage">Stage</label><select id="pg-stage" class="select" ${canStage ? "" : "disabled"}><option value="">Keep the stage: ${h(stageLabel(it.stage))}</option>${later.map((s) => `<option value="${s.id}">Move to: ${h(s.label)}</option>`).join("")}</select>${canStage ? "" : `<span class="help">Only an SI or SHO can change the stage. You can still add an update.</span>`}</div>` : ""}
      <div class="field"><label for="pg-text">Procedure and action taken</label><textarea id="pg-text" class="textarea" style="min-height:80px" placeholder="for example Spot visited. Statements of two witnesses recorded. CCTV footage collected."></textarea></div>
      <div class="sub2"><div class="field"><label for="pg-next">Next step</label><input id="pg-next" class="input" placeholder="for example Send the footage for review" /></div>
        <div class="field"><label for="pg-off">Handling officer</label><select id="pg-off" class="select">${offs.map((o) => `<option value="${h(o)}" ${o === it.officer ? "selected" : ""}>${h(whoName(o))}</option>`).join("")}</select></div></div>
      <div class="row"><button class="btn primary" data-act="progSave" data-id="${h(it.id)}">${ICON.check}Save progress</button><span class="help">The citizen, the Commissioner and Raksha AI see this update. It also counts as your reply to an instruction.</span></div>
    </div>
  </div></section>`;
}

/* ---------- Connected cases (same person, phone, place or accused) ---------- */
const PLACE_STOP = ["kalaburagi", "gulbarga", "bus stop", "at home", "home", "market", "main road", "road", "village", "house"];
function placeKey(s) {
  let t = String(s || "").toLowerCase().replace(/\b(near|opp|opposite|behind|beside|at|the|in front of)\b/g, " ").replace(/[^a-z0-9, ]/g, " ");
  t = t.split(",")[0].replace(/\bkalaburagi\b|\bgulbarga\b/g, " ").replace(/\s+/g, " ").trim();
  return t.length >= 6 && !PLACE_STOP.includes(t) ? t : "";
}
const placeMatch = (a, b) => { const x = placeKey(a), y = placeKey(b); return !!(x && y && (x === y || x.includes(y) || y.includes(x))); };
function complaintAccused(c) {
  const a = c.incident.accused;
  if (Array.isArray(a) && a.length) return a;
  const t = c.incident.involved || "";
  if (/not known|unknown/i.test(t)) return [];
  return (t.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}\b/g) || []).filter((n) => !/^(Not|Caller|Two|One|The|Persons?|Young)\b/.test(n));
}
function complaintAsRec(c) {
  const N = c.incident;
  const people = [{ name: c.person.name, role: "Complainant", contact: c.phone }];
  if (c.filing && c.filing.as === "other" && c.filing.otherName) people.push({ name: c.filing.otherName, role: "Victim" });
  complaintAccused(c).forEach((n) => people.push({ name: n, role: "Accused" }));
  const ids = findIdsInText([N.description, N.involved, N.property].filter(Boolean).join("\n")).filter((x) => !(x.kind === "phone" && normId("phone", x.value) === normId("phone", c.phone)));
  return { id: c.id, people, identifiers: ids, location: N.place };
}
const CONN_W = { phone: 3, vehicle: 3, imei: 3, ref: 2, accused: 2, alias: 1, name: 1, place: 1 };
function matchCases(probe, selfId) {
  const pe = new Map(indexRecord(probe).map((e) => [e.key, e]));
  const cands = S.records.filter((r) => r.status !== "draft" && r.id !== selfId).map((r) => ({ id: r.id, rec: r }))
    .concat(C.filter((c) => c.id !== selfId && c.status !== "rejected" && !getRec(c.id)).map((c) => ({ id: c.id, rec: complaintAsRec(c) })));
  const out = [];
  cands.forEach(({ id, rec }) => {
    const reasons = [];
    indexRecord(rec).forEach((e) => {
      const p = pe.get(e.key); if (!p || reasons.some((x) => x.key === e.key)) return;
      const kind = p.kind === "accused" || e.kind === "accused" ? "accused" : p.kind === "alias" || e.kind === "alias" ? "alias" : p.kind;
      reasons.push({ key: e.key, kind, value: p.value });
    });
    if (placeMatch(probe.location, rec.location)) reasons.push({ key: "place", kind: "place", value: rec.location });
    if (reasons.length) out.push({ id, reasons, score: reasons.reduce((s, r) => s + (CONN_W[r.kind] || 1), 0) });
  });
  return out.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}
const probeOf = (id) => { const r = getRec(id); if (r) return r; const c = getC(id); return c ? complaintAsRec(c) : null; };
const connOf = (id) => { const p = probeOf(id); return p ? matchCases(p, id) : []; };
function connHTML(list, max) {
  if (!list.length) return `<p class="muted small">No connected cases found.</p>`;
  const m = max || 6;
  return `<div class="conn">${list.slice(0, m).map((x) => `<div class="conn-i">${caseLink(x.id)}<span class="conn-r">${x.reasons.map((r) => `<span class="cnk ${r.kind}">${h(KIND_TEXT[r.kind] || r.kind)}</span> <span class="small" data-notr>${h(r.value)}</span>`).join(" ")}</span></div>`).join("")}${list.length > m ? `<p class="tiny muted">${list.length - m} more connected cases</p>` : ""}</div>`;
}

/* ---------- Escalations seen by the Commissioner ---------- */
function cpEscRows(items) {
  const L = escDays(), now = nowMs();
  const emap = new Map(escItems().filter((x) => x.kind === "complaint").map((x) => [x.id, x]));
  const rows = [];
  (items || caseItems()).forEach((it) => {
    if (it.kind === "online" && ["submitted", "review"].includes(it.status)) {
      const e = emap.get(it.id);
      if (e && e.level) rows.push({ it, days: e.idleDays, why: it.status === "submitted" ? "notopened" : "notverified", L, to: e.escTo, level: e.level, last: e.last });
    } else if (it.kind === "online" && ["verified", "investigation", "action"].includes(it.stage)) {
      const idle = (now - Date.parse(lastProgressAt(it))) / DAY;
      if (idle >= L * 2) { const lv = Math.min(3, Math.floor(idle / (L * 2))); rows.push({ it, days: Math.floor(idle), why: "noprogress", L, to: lv >= 3 ? "u-cp" : lv === 2 ? "acp" : "sho:" + it.station, level: lv, last: lastProgressAt(it) }); }
    }
  });
  return rows.sort((a, b) => b.days - a.days);
}
function escWhyText(r) {
  const kn = isKn();
  if (r.why === "notopened") return kn ? `ಠಾಣೆ ${r.L} ದಿನಗಳಲ್ಲಿ ದೂರನ್ನು ತೆರೆಯಲಿಲ್ಲ` : `Station did not open the complaint in ${r.L} days`;
  if (r.why === "notverified") return kn ? `${r.L} ದಿನಗಳಲ್ಲಿ ಪರಿಶೀಲನೆ ಮುಗಿದಿಲ್ಲ` : `Verification not finished in ${r.L} days`;
  if (r.why === "task") return kn ? `ಅನುಸರಣಾ ಕಾರ್ಯ: ${r.days} ದಿನಗಳಿಂದ ಕ್ರಮವಿಲ್ಲ` : `Follow-up task: no action for ${r.days} days`;
  return kn ? `${r.days} ದಿನಗಳಿಂದ ತನಿಖೆಯ ಪ್ರಗತಿ ನವೀಕರಣ ಇಲ್ಲ (${trStr(stageLabel(r.it.stage))})` : `No progress update for ${r.days} days (${stageLabel(r.it.stage)})`;
}

/* ---------- Actions ---------- */
function progSaveObj(id, stage, text, next, officer, by, kind) {
  const c = getC(id), r = getRec(id);
  const it = caseItem(id); if (!it) return null;
  const entry = { at: nowISO(), by, kind: kind || "progress", stage: stage && stage !== it.stage ? stage : "", text, next: next || "", officer: officer || it.officer };
  const o = c || r;
  o.track = (o.track || []).concat([entry]);
  const note = kind === "remark" || kind === "instruction";
  if (note) entry.stage = "";
  if (!note) {
    if (entry.stage) o.stage = entry.stage;
    if (officer) o.officer = officer;
    if (r) { if (entry.stage) r.stage = entry.stage; if (officer) r.officer = officer; if (entry.stage === "resolved") r.caseStatus = "Closed"; else if (entry.stage && r.caseStatus === "Closed") r.caseStatus = "Active"; }
  }
  if (c) { c.citizenUnread = !note ? true : c.citizenUnread; saveComplaint(c); }
  return entry;
}
const PGACT = {
  progSave(el) {
    const id = el.dataset.id;
    const st = ($("#pg-stage") || {}).value || "";
    const text = ($("#pg-text").value || "").trim(), next = ($("#pg-next").value || "").trim(), off = ($("#pg-off") || {}).value || "";
    if (text.length < 5) { toast("Write what was done first.", "warn"); $("#pg-text").focus(); return; }
    if (st && !can("caseStatus")) { toast("Only an SI or SHO can change the stage.", "warn"); return; }
    const e = progSaveObj(id, st, text, next, off, S.userId);
    if (!e) return;
    log("Progress updated", id, `${e.stage ? stageLabel(e.stage) + ": " : ""}${text}${next ? " Next: " + next : ""}`);
    const ob = getC(id) || getRec(id);
    if (ob && ob.esc && (ob.esc.instructions || []).length) { ob.esc.responses = (ob.esc.responses || []).concat([{ by: S.userId, at: nowISO(), text }]); }
    escActedCase(id, text);
    S.escNotes.filter((n) => n.to === S.userId && n.ref === id).forEach((n) => (n.read = true));
    save(); render();
    toast(e.stage ? `${id} moved to ${stageLabel(e.stage)}.` : `Progress update saved for ${id}.`);
  },
};

/* ---------- Sample paper complaint for the scanner (drawn in the browser, fictional) ---------- */
(function addPaperSample() {
  try {
    const base = "99990000412"; const aad = base + verhoeffDigit(base);
    const lines = ["DEMO POLICE STATION, KALABURAGI", "(Fictional record for prototype use only)", "WRITTEN COMPLAINT", "Police Station: Station Bazaar Police Station", "Date: 11/11/2026 Time: 21:15 hrs", "Place: Central Bus Stand, platform 2, Kalaburagi",
      "Complainant: Shabana Begum", `Aadhaar: ${aad.slice(0, 4)} ${aad.slice(4, 8)} ${aad.slice(8)}`, "Address: 3-44, Mominpura, Kalaburagi 585104", "Contact: +91 00000 73310", "Accused: Ravi Jadhav (alias Kalia)", "Details:",
      "While I was boarding the Afzalpur bus at platform 2,", "a young man snatched my gold chain and ran towards", "the exit. The tea stall owner said the man is Ravi", "Jadhav, also called Kalia. The chain weighs about", "10 grams.", "Action: Complaint received at the station desk.", "Recorded by: HC 118 (Demo)"];
    const cv = document.createElement("canvas"); cv.width = 900; cv.height = 1180;
    const x = cv.getContext("2d");
    x.fillStyle = "#fbf7ec"; x.fillRect(0, 0, 900, 1180);
    x.strokeStyle = "#c9bfa6"; x.lineWidth = 2; x.strokeRect(24, 24, 852, 1132);
    x.fillStyle = "#e9e1cc"; for (let y = 300; y < 1120; y += 44) x.fillRect(50, y + 14, 800, 1);
    let y = 80;
    lines.forEach((l, i) => {
      x.fillStyle = i < 3 ? "#1b2a44" : "#20242c";
      x.font = i === 0 ? "bold 34px Arial" : i === 1 ? "italic 20px Arial" : i === 2 ? "bold 30px Arial" : "27px 'Courier New', monospace";
      x.fillText(l, 60, y); y += i < 3 ? 52 : 44;
    });
    x.save(); x.translate(640, 1080); x.rotate(-0.12); x.strokeStyle = "rgba(160,40,40,.55)"; x.lineWidth = 4; x.strokeRect(-120, -42, 240, 74); x.fillStyle = "rgba(160,40,40,.6)"; x.font = "bold 24px Arial"; x.fillText("RECEIVED", -62, 4); x.restore();
    DOC_ASSETS["PAPER-COMPLAINT"] = { src: cv.toDataURL("image/jpeg", 0.85), ocr: lines.join("\n"), lowWords: {}, meanConf: 91 };
  } catch (e) {}
})();
