/* ===== Core: helpers, state, domain rules, OCR, AI ===== */
const KEY = "janaraksha-ai-demo-v5";
const TZ = "Asia/Kolkata";
const $ = (s, r = document) => r.querySelector(s);
const h = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uniq = (a) => [...new Set(a)];
const DAY = 864e5;
/* Demo clock: S.escShift moves "now" forward by whole days so a time limit can be shown without waiting */
function nowMs() { return Date.now() + (S && S.escShift ? S.escShift * DAY : 0); }
const nowISO = () => new Date(nowMs()).toISOString();
const clone = (o) => JSON.parse(JSON.stringify(o));

function todayIST() { return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(nowMs())); }
const istDay = (iso) => (iso ? new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso)) : "");
function timeIST() { return new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(nowMs())); }
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_KN = ["ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಏಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್", "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟೆಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್"];
const isKn = () => !!(S && S.lang === "kn");
function fmtDate(d) {
  if (!d) return isKn() ? "ನಮೂದಿಸಿಲ್ಲ" : "Not set";
  const [y, m, dd] = d.split("-").map(Number);
  if (!y || !m || !dd) return d;
  return String(dd).padStart(2, "0") + " " + (isKn() ? MONTHS_KN : MONTHS_EN)[m - 1] + " " + y;
}
function fmtDT(iso) {
  if (!iso) return "";
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date(iso));
  const g = (t) => (p.find((x) => x.type === t) || {}).value;
  const mi = Number(g("month")) - 1;
  return `${g("day")} ${(isKn() ? MONTHS_KN : MONTHS_EN)[mi]} ${g("year")}, ${g("hour")}:${g("minute")} IST`;
}
function ago(iso) {
  const s = (nowMs() - new Date(iso).getTime()) / 1000;
  const kn = isKn();
  if (s < 60) return kn ? "ಈಗಷ್ಟೇ" : "just now";
  if (s < 3600) return Math.round(s / 60) + (kn ? " ನಿಮಿಷಗಳ ಹಿಂದೆ" : " min ago");
  if (s < 86400) return Math.round(s / 3600) + (kn ? " ಗಂಟೆಗಳ ಹಿಂದೆ" : " h ago");
  if (s < 86400 * 30) { const n = Math.round(s / 86400); return kn ? n + " ದಿನಗಳ ಹಿಂದೆ" : n === 1 ? "1 day ago" : n + " days ago"; }
  return fmtDT(iso);
}

/* ---------- State ---------- */
let S;
const ui = { page: "overview", toasts: [], work: {}, q: "", fStatus: "verified", fType: "all", fSource: "all", linkTab: "suggested", linkKey: null, caseId: "DEMO-205", docId: null, drawer: null, modal: null, viewer: null, aUser: "all", aAction: "all", aQ: "", aiReview: null, aiBusy: false, entryConfirm: false, searchT0: null, showDismissed: false, overNav: false };
let storageOK = true;
let saveTimer = null;
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const o = JSON.parse(raw); if (o && o.v === 5) { S = o; return; } }
  } catch (e) { storageOK = false; }
  S = seedState();
  computeLinks(true);
}
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(S)); storageOK = true; }
    catch (e) {
      try {
        const slim = clone(S);
        slim.docs.forEach((d) => { if (d.dataUrl) { d.dataUrl = null; d.pages = null; d.notPersisted = true; } });
        localStorage.setItem(KEY, JSON.stringify(slim)); storageOK = true;
      } catch (e2) { storageOK = false; }
    }
  }, 250);
}

/* ---------- Media store (photos, signatures, thumb impressions) in IndexedDB ---------- */
const MEDIA = {};
let idb = null;
const newMediaId = (p) => (p || "M") + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
function idbOpen() {
  return new Promise((res) => {
    try { const rq = indexedDB.open("janaraksha-media", 1); rq.onupgradeneeded = () => rq.result.createObjectStore("m"); rq.onsuccess = () => res(rq.result); rq.onerror = () => res(null); }
    catch (e) { res(null); }
  });
}
async function mediaLoad() {
  idb = await idbOpen();
  if (!idb) return;
  await new Promise((res) => {
    try {
      const rq = idb.transaction("m", "readonly").objectStore("m").openCursor();
      rq.onsuccess = () => { const c = rq.result; if (c) { MEDIA[c.key] = c.value; c.continue(); } else res(); };
      rq.onerror = () => res();
    } catch (e) { res(); }
  });
}
function mediaPut(id, url) { MEDIA[id] = url; if (!idb) return; try { idb.transaction("m", "readwrite").objectStore("m").put(url, id); } catch (e) {} }
function mediaDel(id) { if (!id) return; delete MEDIA[id]; if (!idb) return; try { idb.transaction("m", "readwrite").objectStore("m").delete(id); } catch (e) {} }
function mediaClear() { Object.keys(MEDIA).forEach((k) => delete MEDIA[k]); if (!idb) return; try { idb.transaction("m", "readwrite").objectStore("m").clear(); } catch (e) {} }

/* ---------- Users and permissions ---------- */
const me = () => USERS.find((u) => u.id === S.userId) || USERS[0];
const can = (p) => (PERMS[p] || []).includes(me().role);
const roleOf = (id) => (USERS.find((u) => u.id === id) || SYSTEM_USER).roleLabel;
const isOther = (a) => typeof a === "string" && a.startsWith("other:");
const ownerName = (a) => (!a ? "" : isOther(a) ? a.slice(6) : userName(a));

/* ---------- Lookups ---------- */
const getRec = (id) => S.records.find((r) => r.id === id);
const getDoc = (id) => S.docs.find((d) => d.id === id);
const typeOf = (id) => RECORD_TYPES.find((t) => t.id === id) || { id, label: id || "Not set", group: "", color: "grey" };
const idKindLabel = (k) => (ID_KINDS.find((x) => x.id === k) || { label: "Reference" }).label;
const docSrc = (d) => (d.asset && DOC_ASSETS[d.asset] ? DOC_ASSETS[d.asset].src : d.pages && d.pages[0] ? d.pages[0] : d.dataUrl || "");
const typeColor = (t) => ({ info: "var(--info)", accent: "var(--accent)", violet: "var(--violet)", warn: "#d4881a", grey: "var(--muted)" }[typeOf(t).color] || "var(--info)");
const typeSoft = (t) => ({ info: "var(--info-soft)", accent: "var(--accent-soft)", violet: "var(--violet-soft)", warn: "var(--warn-soft)", grey: "var(--grey-soft)" }[typeOf(t).color] || "var(--surface-2)");

function log(action, recordId, detail, extra) {
  const e = Object.assign({ id: "A-" + String(S.audit.length + 1).padStart(4, "0"), at: nowISO(), userId: S.userId, action, recordId: recordId || "", detail: detail || "" }, extra || {});
  S.audit.push(e);
  return e;
}
function logSys(action, recordId, detail, extra) { return log(action, recordId, detail, Object.assign({ userId: "system" }, extra || {})); }

/* ---------- Identifiers ---------- */
const VEH_RE = /\b([A-Z]{2})[\s-]?(\d{1,2})[\s-]?([A-Z]{1,3})[\s-]?(\d{3,4})\b/g;
const PHONE_RE = /(?:\+91[\s-]?)?\b(\d{5})[\s-]?(\d{5})\b/g;
const IMEI_RE = /\b(\d{15})\b/g;
function normId(kind, v) {
  v = String(v || "");
  if (kind === "phone") { const d = v.replace(/\D/g, ""); return d.slice(-10); }
  if (kind === "imei") return v.replace(/\D/g, "");
  return v.toUpperCase().replace(/[^A-Z0-9]/g, "");
}
function prettyVehicle(v) { const m = String(v).toUpperCase().replace(/[^A-Z0-9]/g, "").match(/^([A-Z]{2})(\d{1,2})([A-Z]{1,3})(\d{3,4})$/); return m ? `${m[1]} ${m[2].padStart(2, "0")} ${m[3]} ${m[4]}` : v; }
function prettyPhone(v) { const d = String(v).replace(/\D/g, "").slice(-10); return d.length === 10 ? `+91 ${d.slice(0, 5)} ${d.slice(5)}` : v; }
function findIdsInText(text) {
  const out = [];
  const t = String(text || "");
  let m;
  VEH_RE.lastIndex = 0; while ((m = VEH_RE.exec(t.toUpperCase()))) out.push({ kind: "vehicle", value: prettyVehicle(m[0]) });
  PHONE_RE.lastIndex = 0; while ((m = PHONE_RE.exec(t))) { if (!/\d{15}/.test(t.slice(Math.max(0, m.index - 5), m.index + 20))) out.push({ kind: "phone", value: prettyPhone(m[0]) }); }
  IMEI_RE.lastIndex = 0; while ((m = IMEI_RE.exec(t))) out.push({ kind: "imei", value: m[1] });
  const seen = new Set();
  return out.filter((x) => { const k = x.kind + normId(x.kind, x.value); if (seen.has(k)) return false; seen.add(k); return true; });
}

/* ---------- Direct entry: quality check ---------- */
/* Reuse the code a replaced draft had reserved, so codes do not skip numbers */
function autoRef() { const d = S && S.draft; return d && d.refMode !== "manual" && !d.editingId && CODE_RE.test(d.ref || "") && !codeTaken(d.ref) ? d.ref : nextCaseCode(); }
function newDraft() {
  return normDraft({ ref: autoRef(), refMode: "auto", type: "", date: todayIST(), time: timeIST(), locMode: "list", location: "", summary: "", station: homeStation(), people: [{ name: "", role: "Complainant", contact: "", alias: "", idType: "", idMasked: "", address: "" }], identifiers: [], photos: [], sign: {}, editingId: null });
}
function normDraft(d) {
  d.refMode = d.refMode || "auto";
  d.station = d.station || homeStation();
  d.photos = d.photos || [];
  d.sign = d.sign || {};
  if (!d.locMode) d.locMode = d.location && !PLACES.includes(d.location) ? "other" : "list";
  return d;
}
const normRef = (v) => String(v || "").trim().replace(/\s+/g, " ").toUpperCase();
function refProblem(d) {
  if (d.editingId) return "";
  const r = normRef(d.ref);
  if (!r) return "Type the record reference.";
  if (/[|<>"]/.test(r)) return "Do not use | < > or quote marks in the reference.";
  if (r.length > 40) return "The reference is too long. Use 40 characters or less.";
  if (getRec(r)) return `Reference ${r} is already used by another record.`;
  return "";
}
const SIGNER_ROLES = ["Complainant", "Informant", "Petitioner"];
const signer = (d) => (d.people || []).find((p) => p.name.trim() && SIGNER_ROLES.includes(p.role));
function signNeeds(d) {
  const out = [];
  if (signer(d) && !(d.sign.complainant || d.sign.thumb)) out.push("Complainant signature or thumb impression");
  if (!d.sign.officer) out.push("Officer signature");
  return out;
}
function requiredList(d) {
  const req = [
    { k: "ref", label: "Record reference", ok: d.refMode !== "manual" || !refProblem(d) },
    { k: "type", label: "Record type", ok: !!d.type },
    { k: "date", label: "Date", ok: !!d.date },
    { k: "location", label: "Location", ok: (d.location || "").trim().length >= 4 },
    { k: "summary", label: "Incident summary", ok: (d.summary || "").trim().length >= 40 },
    { k: "people", label: "At least one person with a role", ok: (d.people || []).some((p) => p.name.trim() && p.role) },
  ];
  if (d.type === "vehicle-theft") req.push({ k: "identifiers", label: "Vehicle registration", ok: (d.identifiers || []).some((x) => x.kind === "vehicle" && x.value.trim()) });
  return req;
}
function completeness(d) { const r = requiredList(d); return { done: r.filter((x) => x.ok).length, total: r.length, list: r }; }
function entryChecks(d) {
  const items = [];
  const add = (level, field, msg, fix) => items.push({ level, field, msg, fix });
  const sum = (d.summary || "").trim();
  if (d.refMode === "manual" && refProblem(d)) add("missing", "ref", refProblem(d));
  if (!d.type) add("missing", "type", "Choose a record type first.");
  if (!d.date) add("missing", "date", "Add the date of the incident.");
  else if (d.date > todayIST()) add("warn", "date", "The date is in the future. Check the date.");
  if (!d.time) add("tip", "time", "Add the time if known. Write the nearest time the complainant can give.");
  if (!(d.location || "").trim()) add("missing", "location", d.locMode === "other" ? "Type the exact location in the box under Location." : "Choose the location, or choose Other and type it.");
  else if ((d.location || "").trim().length < 10 || /^(bus stop|road|market|near house|home)$/i.test(d.location.trim())) add("warn", "location", "The location is general. Add a road name or a landmark.");
  if (!sum) add("missing", "summary", "Write a short summary of what was reported.");
  else if (sum.length < 40) add("missing", "summary", "The summary is too short. Say what happened, when and where.");
  if (sum && /(culprit|is guilty|criminal|accused (is|has) )/i.test(sum)) add("warn", "summary", "Use neutral words. Write what was reported, not a conclusion about guilt.");
  if (sum && sum.length > 30 && sum === sum.toUpperCase()) add("warn", "summary", "Do not write in all capital letters. It is harder to read.");
  if (sum) { const longS = sum.split(/(?<=[.!?])\s+/).filter((s) => s.split(/\s+/).length > 35); if (longS.length) add("tip", "summary", "One sentence is very long. Split it into short sentences."); }
  const people = d.people || [];
  if (!people.some((p) => p.name.trim())) add("missing", "people", "Add at least one person (for example, the complainant).");
  people.forEach((p, i) => {
    if (p.name.trim() && !p.role) add("missing", "people", `Select a role for ${p.name.trim()}.`);
    if (p.contact && normId("phone", p.contact).length !== 10) add("warn", "people", `Check the mobile number for ${p.name || "person " + (i + 1)}. It must have 10 digits.`);
  });
  const ids = d.identifiers || [];
  if (d.type === "vehicle-theft" && !ids.some((x) => x.kind === "vehicle" && x.value.trim())) add("missing", "identifiers", "Add the vehicle registration number as an identifier.");
  ids.forEach((x) => {
    if (!x.value.trim()) return;
    if (x.kind === "vehicle" && !/^[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{3,4}$/.test(normId("vehicle", x.value))) add("warn", "identifiers", `Check the vehicle number "${x.value}". Example format: KA 00 AB 1234.`);
    if (x.kind === "imei" && normId("imei", x.value).length !== 15) add("warn", "identifiers", `IMEI "${x.value}" must have 15 digits.`);
    if (x.kind === "phone" && normId("phone", x.value).length !== 10) add("warn", "identifiers", `Mobile number "${x.value}" must have 10 digits.`);
  });
  const have = new Set(ids.map((x) => x.kind + normId(x.kind, x.value)).concat(people.filter((p) => p.contact).map((p) => "phone" + normId("phone", p.contact))));
  findIdsInText(sum).forEach((f) => { if (!have.has(f.kind + normId(f.kind, f.value))) add("tip", "identifiers", `The summary has ${idKindLabel(f.kind).toLowerCase()} ${f.value}. Add it as an identifier so it can be searched and linked.`, { kind: f.kind, value: f.value }); });
  if (/\b(mobile|phone)\b/i.test(sum) && ["theft", "lost-property"].includes(d.type) && !ids.some((x) => x.kind === "imei")) add("tip", "identifiers", "The summary mentions a phone. Add its IMEI if the complainant has it.");
  if (/\b(motorcycle|bike|scooter|car|vehicle|auto)\b/i.test(sum) && !ids.some((x) => x.kind === "vehicle") && !findIdsInText(sum).some((f) => f.kind === "vehicle")) add("tip", "identifiers", "The summary mentions a vehicle. Add its registration number if known.");
  if (d.sign) {
    if (signer(d) && !(d.sign.complainant || d.sign.thumb)) add("missing", "sign", "The complainant has not signed. Take a signature or a thumb impression.");
    if (!d.sign.officer) add("missing", "officerSign", "Sign as the recording officer in step 04.");
  }
  if (d.photos && !d.photos.length && ["theft", "vehicle-theft", "accident", "incident"].includes(d.type)) add("tip", "photos", "Add photos of the scene or the property if you have them.");
  if (!items.some((i) => i.level === "missing" || i.level === "warn")) add("good", "", "Required details are present. Read the entry once more, then save.");
  return items;
}

/* ---------- Scanner: rule-based structuring of OCR text ---------- */
function matchStation(s) {
  const k = String(s || "").toLowerCase().replace(/police station.*$|\bp\.?s\.?\b.*$/, "").replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim();
  if (k.length < 3) return "";
  return ALL_STATIONS.find((x) => x.toLowerCase().startsWith(k)) || ALL_STATIONS.find((x) => x.toLowerCase().includes(k)) || "";
}
/* Mask Aadhaar and PAN numbers in stored text. Only masked numbers are kept. */
function maskIdsInText(t) {
  return String(t || "").replace(/\b(\d{4})[ -]?(\d{4})[ -]?(\d{4})\b/g, (m, a, b, c2) => "XXXX XXXX " + c2).replace(/\b([A-Z]{5})(\d{4})([A-Z])\b/g, (m) => maskId("pan", m));
}
const TYPE_HINTS = [
  [/lost property|lost item|left on|fell from/i, "lost-property"],
  [/general diary|\bG\.?D\.?\b extract/i, "gd"],
  [/petition|petitioner|request(s)? that/i, "petition"],
  [/\bOTP\b|bank|fraud|debited/i, "cheating"],
  [/(motorcycle|vehicle|two-wheeler|car|scooter).{0,80}(missing|stolen|theft)|(missing|stolen|theft).{0,80}(motorcycle|vehicle|two-wheeler|car|scooter)/i, "vehicle-theft"],
  [/accident|collided|collision/i, "accident"],
  [/missing person|did not return/i, "missing-person"],
  [/stolen|snatch|theft|took (his|her)/i, "theft"],
  [/incident report|found parked|unattended/i, "incident"],
];
function confFromWords(value, lowWords) {
  if (!value || !lowWords) return 1;
  let c = 1;
  String(value).split(/\s+/).forEach((w) => { if (lowWords[w] != null) c = Math.min(c, lowWords[w] / 100); });
  return c;
}
function structureText(text, lowWords) {
  const t = String(text || "").replace(/\r/g, "");
  const lines = t.split("\n").map((l) => l.trim()).filter(Boolean);
  const out = { text: t, reference: "", type: "", date: "", time: "", location: "", summary: "", people: [], identifiers: [], confidence: { people: [], identifiers: [] }, uncertain: [] };
  const cf = out.confidence;
  let m;
  if ((m = t.match(/\bRef(?:erence)?\.?\s*(?:No\.?)?\s*[:#]?\s*([A-Z]{2,6}-[A-Z]{0,4}-?\d{2,5})/i)) || (m = t.match(/\b(DEMO-(?:NEW-)?\d{3,4})\b/))) { out.reference = m[1].toUpperCase(); cf.reference = 0.92 * confFromWords(m[1], lowWords); }
  const head = lines.slice(0, 6).join(" ");
  const TITLE_HINTS = [[/LOST PROPERTY/i, "lost-property"], [/GENERAL DIARY/i, "gd"], [/PETITION/i, "petition"], [/INCIDENT REPORT/i, "incident"], [/MISSING PERSON/i, "missing-person"], [/ACCIDENT/i, "accident"]];
  for (const [re, ty] of TITLE_HINTS) { if (re.test(head)) { out.type = ty; cf.type = 0.9; break; } }
  if (!out.type) for (const [re, ty] of TYPE_HINTS) { if (re.test(t)) { out.type = ty; cf.type = 0.72; break; } }
  if ((m = t.match(/Date\s*[:\-]?\s*(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})/i))) {
    const y = m[3].length === 2 ? "20" + m[3] : m[3];
    out.date = `${y}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
    cf.date = 0.9 * confFromWords(m[0].split(/\s+/).pop(), lowWords);
  } else { cf.date = 0; out.uncertain.push("No readable date found. Check the page."); }
  if ((m = t.match(/Time\s*[:\-]?\s*(\d{1,2})[:.](\d{2})/i))) { out.time = `${m[1].padStart(2, "0")}:${m[2]}`; cf.time = 0.9 * confFromWords(`${m[1]}:${m[2]}`, lowWords); } else cf.time = 0;
  if ((m = t.match(/(?:Place|Location|Spot)\s*[:\-]\s*(.+)/i))) { out.location = m[1].trim(); cf.location = 0.9 * confFromWords(out.location, lowWords); } else cf.location = 0;
  // Summary: block after Details:/Subject: until Action:/Recorded by
  const idx = lines.findIndex((l) => /^(Details|Subject)\s*:/i.test(l));
  if (idx >= 0) {
    const buf = [];
    for (let i = idx; i < lines.length; i++) {
      if (i > idx && /^(Action|Recorded by|Noted by)\s*:/i.test(lines[i])) break;
      buf.push(lines[i].replace(/^(Details|Subject)\s*:\s*/i, ""));
    }
    out.summary = buf.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
    cf.summary = 0.85 * Math.min(1, ...out.summary.split(" ").map((w) => (lowWords && lowWords[w] != null ? lowWords[w] / 100 : 1)));
  } else { out.summary = lines.slice(3, 9).join(" "); cf.summary = 0.5; out.uncertain.push("No 'Details' section found. The summary is a guess from the page text."); }
  const act = t.match(/Action\s*:\s*([\s\S]*?)(?:\n\s*\n|Recorded by|$)/i);
  if (act && out.summary) out.summary += " Action noted: " + act[1].replace(/\s+/g, " ").trim();
  // People
  const roleMap = { complainant: "Complainant", informant: "Informant", petitioner: "Petitioner", witness: "Witness", victim: "Victim", owner: "Owner", accused: "Accused", "reported by": "Informant" };
  const pre = /(Complainant|Informant|Petitioner|Witness|Victim|Owner|Accused|Reported by)[ \t]*:[ \t]*([A-Z][A-Za-z.]+(?:[ \t]+[A-Z][A-Za-z.]+){0,3})(?:[ \t]*\(([^)]+)\))?/g;
  while ((m = pre.exec(t))) {
    let role = roleMap[m[1].toLowerCase()], alias = "";
    if (m[3] && roleMap[m[3].toLowerCase()]) role = roleMap[m[3].toLowerCase()];
    if (m[3] && /^(alias|also called|a\.?k\.?a\.?)\s+/i.test(m[3])) alias = m[3].replace(/^(alias|also called|a\.?k\.?a\.?)\s+/i, "").trim();
    const name = m[2].trim();
    if (!out.people.some((p) => p.name === name)) { out.people.push({ name, role, contact: "", alias, address: "", idType: "", idMasked: "" }); cf.people.push(0.88 * confFromWords(name, lowWords)); }
  }
  // Address and ID proof go to the nearest person above
  lines.forEach((l, i) => {
    const am = l.match(/^Address\s*[:\-]\s*(.+)/i);
    const im = l.match(/\b(Aadhaar|Aadhar|PAN)(?:\s*(?:No\.?|Number|Card))?\s*[:\-]\s*([A-Z0-9][A-Z0-9 ]{7,15})/i);
    if (!am && !im) return;
    let who = null;
    for (let j = i; j >= 0 && !who; j--) who = out.people.find((p) => lines[j].includes(p.name)) || null;
    if (!who) return;
    if (am && !who.address) who.address = am[1].trim();
    if (im && !who.idMasked) {
      const type = /pan/i.test(im[1]) ? "pan" : "aadhaar", n = normIdNo(type, im[2]);
      if ((type === "aadhaar" && /^\d{12}$/.test(n)) || (type === "pan" && /^[A-Z]{5}\d{4}[A-Z]$/.test(n))) { who.idType = type; who.idMasked = maskId(type, n); }
    }
  });
  if ((m = t.match(/(?:Police Station|P\.\s?S\.)\s*[:\-]\s*(.+)/i))) out.station = matchStation(m[1]);
  // Contacts to the nearest person above
  lines.forEach((l, i) => {
    const cm = l.match(/contact\s*:?\s*((?:\+91[\s-]?)?\d{5}[\s-]?\d{5})/i);
    if (!cm) return;
    let who = null;
    for (let j = i; j >= 0 && !who; j--) who = out.people.find((p) => lines[j].includes(p.name)) || null;
    if (!who && out.people.length) who = out.people[out.people.length - 1];
    if (who && !who.contact) who.contact = prettyPhone(cm[1]);
  });
  // Identifiers from the narrative
  const contacts = new Set(out.people.map((p) => normId("phone", p.contact)).filter(Boolean));
  findIdsInText(out.summary + "\n" + t).forEach((x) => {
    if (x.kind === "phone" && contacts.has(normId("phone", x.value))) return;
    const ctx = x.kind === "vehicle" ? "Vehicle in record text" : x.kind === "phone" ? (/call/i.test(out.summary) ? "Caller number" : "Number in record text") : x.kind === "imei" ? "Phone IMEI" : "";
    out.identifiers.push({ kind: x.kind, value: x.value, context: ctx });
    cf.identifiers.push(0.9 * confFromWords(x.value.split(" ").pop(), lowWords));
  });
  if (!out.reference) { cf.reference = 0; out.uncertain.push("No record reference found."); }
  return out;
}

/* ---------- Connection engine ---------- */
function indexRecord(r) {
  const out = [];
  const seen = new Set();
  const push = (e) => { if (seen.has(e.key)) return; seen.add(e.key); out.push(e); };
  (r.identifiers || []).forEach((x) => {
    const n = normId(x.kind, x.value);
    if (n.length < 5) return;
    const g = ["vehicle", "phone", "imei"].includes(x.kind) ? x.kind : "ref";
    push({ key: g + ":" + n, kind: x.kind, value: x.value, field: "Identifiers / " + idKindLabel(x.kind), role: x.context || "Context not stated" });
  });
  (r.people || []).forEach((p) => {
    if (p.contact) { const n = normId("phone", p.contact); if (n.length === 10) push({ key: "phone:" + n, kind: "phone", value: prettyPhone(p.contact), field: "People / contact of " + p.name, role: (p.role || "Role not set") + ": " + p.name }); }
    const nm = (p.name || "").toLowerCase().replace(/[^a-z ]/g, "").replace(/\s+/g, " ").trim();
    if (nm.split(" ").length >= 2) push({ key: "name:" + nm, kind: p.role === "Accused" ? "accused" : "name", value: p.name, field: p.role === "Accused" ? "People / accused name" : "People / name", role: p.role || "Role not set" });
    if (p.alias) { const al = p.alias.toLowerCase().replace(/[^a-z ]/g, "").trim(); if (al.length > 2) push({ key: "name:" + al, kind: "alias", value: p.alias, field: "People / alias of " + p.name, role: p.role || "Role not set" }); }
  });
  return out;
}
const KIND_TEXT = { vehicle: "Vehicle reference", phone: "Mobile number", imei: "IMEI", name: "Same person", alias: "Alias", accused: "Accused name", place: "Same place", ref: "Reference", document: "Document number", other: "Reference" };
function computeLinks(silent) {
  const verified = S.records.filter((r) => r.status === "verified");
  const byKey = new Map();
  verified.forEach((r) => indexRecord(r).forEach((e) => { if (!byKey.has(e.key)) byKey.set(e.key, []); byKey.get(e.key).push(Object.assign({ rec: r.id }, e)); }));
  const pairs = new Map();
  for (const [key, arr] of byKey) {
    const recs = [];
    arr.forEach((e) => { if (!recs.some((x) => x.rec === e.rec)) recs.push(e); });
    if (recs.length < 2) continue;
    for (let i = 0; i < recs.length; i++) for (let j = i + 1; j < recs.length; j++) {
      const [x, y] = [recs[i], recs[j]].sort((p, q) => p.rec.localeCompare(q.rec));
      const pk = x.rec + "|" + y.rec;
      if (!pairs.has(pk)) pairs.set(pk, []);
      pairs.get(pk).push({ key, kind: x.kind === "accused" || y.kind === "accused" ? "accused" : x.kind === "alias" || y.kind === "alias" ? "alias" : x.kind, value: x.value, a: { id: x.rec, field: x.field, role: x.role }, b: { id: y.rec, field: y.field, role: y.role } });
    }
  }
  /* Same place of incident (a weaker clue) */
  for (let i = 0; i < verified.length; i++) for (let j = i + 1; j < verified.length; j++) {
    const [x, y] = [verified[i], verified[j]].sort((p, q) => p.id.localeCompare(q.id));
    if (!placeMatch(x.location, y.location)) continue;
    const pk = x.id + "|" + y.id;
    if (!pairs.has(pk)) pairs.set(pk, []);
    pairs.get(pk).push({ key: "place:" + placeKey(x.location), kind: "place", value: x.location, a: { id: x.id, field: "Location", role: x.location }, b: { id: y.id, field: "Location", role: y.location } });
  }
  const added = [];
  for (const [pk, reasons] of pairs) {
    let L = S.links.find((l) => l.key === pk);
    if (!L) {
      const [a, b] = pk.split("|");
      L = { key: pk, a, b, status: "suggested", createdAt: nowISO(), notes: [] };
      S.links.push(L); added.push(L);
      if (!silent) logSys("Link suggested", b, `${a} and ${b}: ${reasons.map((r) => KIND_TEXT[r.kind] + " " + r.value).join(", ")}`, { linkKey: pk });
    }
    L.reasons = reasons;
  }
  S.links.forEach((l) => { if (!pairs.has(l.key)) l.reasons = []; });
  return added;
}
const linkStrength = (l) => ((l.reasons || []).some((r) => !["name", "alias", "place"].includes(r.kind)) ? "Identifier match" : (l.reasons || []).some((r) => r.kind === "place") && !(l.reasons || []).some((r) => r.kind !== "place") ? "Place match only" : "Name match only");
function sharedGroups() {
  const verified = S.records.filter((r) => r.status === "verified");
  const byKey = new Map();
  verified.forEach((r) => indexRecord(r).forEach((e) => { if (["name", "alias"].includes(e.kind)) return; if (!byKey.has(e.key)) byKey.set(e.key, { kind: e.kind, value: e.value, recs: [] }); const g = byKey.get(e.key); if (!g.recs.includes(r.id)) g.recs.push(r.id); }));
  return [...byKey.values()].filter((g) => g.recs.length >= 3);
}

/* ---------- Metrics ---------- */
function metrics() {
  const ret = S.metrics.retrieval;
  const avg = ret.length ? ret.reduce((a, b) => a + b.ms, 0) / ret.length : null;
  const direct = S.records.filter((r) => r.source === "direct" && r.status !== "draft");
  const comp = direct.map((r) => { const c = completeness(r); return c.done / c.total; });
  const reviewed = S.links.filter((l) => l.rating);
  const clear = reviewed.filter((l) => l.rating === "clear").length + 0.5 * reviewed.filter((l) => l.rating === "partly").length;
  const open = S.tasks.filter((t) => t.status === "open");
  const owned = open.filter((t) => t.assignee);
  return {
    retrievalAvg: avg, retrievalN: ret.length,
    completeness: comp.length ? comp.reduce((a, b) => a + b, 0) / comp.length : null, completenessN: comp.length, fullyComplete: comp.filter((x) => x === 1).length,
    usefulness: reviewed.length ? clear / reviewed.length : null, usefulnessN: reviewed.length,
    taskVis: open.length ? owned.length / open.length : null, openTasks: open.length, ownedTasks: owned.length,
  };
}

/* ---------- AI (Claude via the page's sample capability) ---------- */
let AI = null, AI_IMAGES = false, DL = null, AI_OFF_REASON = "";
const inArtifact = () => !!(window.claude && typeof window.claude.use === "function");
async function initCapabilities() {
  if (!inArtifact()) { AI_OFF_REASON = "This copy of the page runs outside Claude, so it uses the built-in rule checks and in-browser OCR."; render(); return; }
  try {
    AI = await window.claude.use("sample");
    if (AI) { try { const lim = AI.limits ? await AI.limits() : null; AI_IMAGES = !!(lim && lim.images); } catch (e) { AI_IMAGES = false; } }
    else AI_OFF_REASON = "AI is not turned on for this page view. The built-in rule checks still run.";
  } catch (e) { AI = null; AI_OFF_REASON = "AI could not start. The built-in rule checks still run."; }
  try { DL = await window.claude.use("downloads"); } catch (e) { DL = null; }
  render();
}
async function askJSON(prompt, opts) {
  const fn = AI.json ? AI.json : null;
  if (fn) {
    try { const v = await AI.json(prompt, opts || {}); if (v && typeof v === "object") return v; } catch (e) { if (e && (e.code === "not_granted" || e.code === "rate_limited")) throw e; }
  }
  const r = await AI(prompt, opts || {});
  const txt = (r && r.text) || "";
  const m = txt.match(/\{[\s\S]*\}/);
  if (!m) throw { code: "bad_output", message: "AI answer was not JSON" };
  return JSON.parse(m[0]);
}
function aiFail(e) {
  if (e && e.code === "not_granted") { AI = null; AI_OFF_REASON = "AI permission was not given. The built-in rule checks still run."; toast("AI permission was not given. Using the built-in rules.", "warn"); }
  else if (e && e.code === "rate_limited") toast("AI is busy. Wait a minute and try again. Built-in rules used for now.", "warn");
  else toast("AI step failed. Built-in rules used instead.", "warn");
}
async function aiExtract(blobs, pdfText) {
  const prompt = `You are the OCR and structuring step in JanaRaksha AI, a records prototype for a police station. The attached image(s) show one scanned paper record. All records are fictional test data.

Do two things:
1. Transcribe all readable text exactly as written, line by line, into "text".
2. Fill the structured fields using only that text. Never guess. If a field is not on the page, use "".

Return only JSON in this shape:
{"text":"","reference":"","type":"one of: ${RECORD_TYPES.map((t) => t.id).join(", ")}","date":"YYYY-MM-DD","time":"HH:MM 24h","location":"","summary":"the main narrative from the page, joined into clean sentences, plus any action noted","station":"police station name if written, else empty","people":[{"name":"","role":"one of: ${PERSON_ROLES.join(", ")}","contact":"","alias":"","address":"","id_type":"aadhaar|pan|","id_number":"as written"}],"identifiers":[{"kind":"vehicle|phone|imei|document|other","value":"as written","context":"short phrase such as Stolen vehicle or Caller number"}],"confidence":{"reference":0.0,"type":0.0,"date":0.0,"time":0.0,"location":0.0,"summary":0.0,"people":[0.0],"identifiers":[0.0]},"uncertain":["short notes on anything hard to read"]}

Confidence is how sure you are of the reading, from 0 to 1. Use a value below 0.75 for handwriting, blur, stamps over text, or partly hidden words. Do not give opinions about guilt. Do not add facts that are not on the page.${pdfText ? "\n\nThe file also had this text layer, which may help:\n" + pdfText.slice(0, 4000) : ""}`;
  return askJSON(prompt, { images: blobs, modelTier: "default" });
}
async function aiReviewEntry(d) {
  const draft = { type: typeOf(d.type).label, date: d.date, time: d.time, location: d.location, summary: d.summary, people: d.people, identifiers: d.identifiers.map((x) => ({ kind: idKindLabel(x.kind), value: x.value, context: x.context })) };
  const prompt = `You review a draft record typed by police station staff in JanaRaksha AI. This is fictional test data. You only help with completeness and clarity. You never decide on registration, guilt or rejection.

Draft:
${JSON.stringify(draft, null, 1)}

Return only JSON:
${isKn() ? "Write every issue message and question in Kannada. Keep the suggested summary in the same language as the draft summary.\n\n" : ""}{"issues":[{"field":"type|date|time|location|summary|people|identifiers","message":"one short sentence in simple ${isKn() ? "Kannada" : "English"}"}],"suggested_summary":"a clearer version of the summary using only facts in the draft. Short sentences, past tense, neutral words, no conclusions about guilt, no new facts","questions":["up to 3 short questions staff could ask the complainant to complete the record"]}`;
  return askJSON(prompt, { modelTier: "quick" });
}

/* ---------- Files, PDF and OCR fallbacks ---------- */
function loadScript(src, ms) {
  return new Promise((res, rej) => {
    if ([...document.scripts].some((s) => s.src === src)) return res();
    const s = document.createElement("script");
    const t = setTimeout(() => rej(new Error("timeout")), ms || 20000);
    s.src = src; s.async = true;
    s.onload = () => { clearTimeout(t); res(); };
    s.onerror = () => { clearTimeout(t); rej(new Error("load failed")); };
    document.head.appendChild(s);
  });
}
const PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
async function readPdf(blob) {
  await loadScript(PDFJS); await loadScript(PDFJS_WORKER);
  const lib = window.pdfjsLib;
  lib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
  const pdf = await lib.getDocument({ data: new Uint8Array(await blob.arrayBuffer()), isEvalSupported: false, disableFontFace: false }).promise;
  const pages = [], blobs = []; let text = "";
  for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) {
    const page = await pdf.getPage(i);
    const tc = await page.getTextContent();
    text += tc.items.map((it) => it.str + (it.hasEOL ? "\n" : " ")).join("") + "\n";
    const vp = page.getViewport({ scale: 1.6 });
    const c = document.createElement("canvas"); c.width = vp.width; c.height = vp.height;
    await page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
    pages.push(c.toDataURL("image/jpeg", 0.82));
    blobs.push(await new Promise((r) => c.toBlob(r, "image/jpeg", 0.85)));
  }
  return { pages, blobs, text, numPages: pdf.numPages };
}
async function tesseractOCR(blob) {
  await loadScript("https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js", 15000);
  const worker = await window.Tesseract.createWorker("eng");
  const { data } = await worker.recognize(blob);
  await worker.terminate();
  const low = {};
  (data.words || []).forEach((w) => { if (w.confidence < 88) low[w.text] = Math.round(w.confidence); });
  return { text: data.text, low, mean: data.confidence };
}
function dataUrlToBlob(u) {
  const [head, b64] = u.split(",");
  const mime = (head.match(/data:([^;]+)/) || [])[1] || "application/octet-stream";
  const bin = atob(b64); const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}
function fileToDataUrl(file) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); }); }
async function shrinkImage(dataUrl, max) {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      if (s >= 1 && dataUrl.length < 2.5e6) return res(dataUrl);
      const c = document.createElement("canvas"); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL("image/jpeg", 0.86));
    };
    img.onerror = () => res(dataUrl);
    img.src = dataUrl;
  });
}

/* Run the scanner pipeline on one document */
async function processDoc(docId) {
  const d = getDoc(docId);
  if (!d) return;
  const setW = (step, msg) => { ui.work[docId] = { step, msg }; if (ui.page === "scanner") renderPage(); };
  setW("extract", "Preparing the page");
  let result = null, engine = "";
  try {
    let blobs = [], pdfText = "";
    if (d.mime === "application/pdf") {
      setW("extract", "Opening the PDF and rendering pages");
      const pdf = await readPdf(dataUrlToBlob(d.dataUrl));
      d.pages = pdf.pages; blobs = pdf.blobs; pdfText = pdf.text; d.numPages = pdf.numPages;
    } else {
      blobs = [dataUrlToBlob(d.asset ? DOC_ASSETS[d.asset].src : d.dataUrl)];
    }
    if (AI && AI_IMAGES && blobs.length) {
      setW("extract", "AI is reading the page (vision OCR)");
      try { const r = await aiExtract(blobs, pdfText); if (r && (r.text || r.summary)) { result = r; engine = "Claude vision OCR"; } } catch (e) { aiFail(e); }
    }
    if (!result && pdfText.replace(/\s/g, "").length > 80) { setW("structure", "Reading the PDF text layer"); result = structureText(pdfText, null); engine = "PDF text layer + rules"; }
    if (!result && !inArtifact()) {
      setW("extract", "Running OCR in this browser (Tesseract)");
      try { const o = await tesseractOCR(blobs[0]); if (o.text.trim()) { result = structureText(o.text, o.low); engine = "Tesseract OCR (in browser) + rules"; d.meanConf = Math.round(o.mean); } } catch (e) { /* fall through */ }
    }
    if (!result && d.asset && DOC_ASSETS[d.asset]) {
      setW("structure", "Using the stored OCR result for this sample");
      const a = DOC_ASSETS[d.asset];
      result = structureText(a.ocr, a.lowWords); engine = "Tesseract OCR (pre-run on sample) + rules"; d.meanConf = a.meanConf;
    }
  } catch (e) { console.warn(e); }
  if (!result) {
    d.status = "manual"; delete ui.work[docId];
    log("OCR not available", "", d.name + ": text to be typed by staff", { docId: d.id });
    save(); render(); return;
  }
  setW("structure", "Finding dates, places, names and identifiers");
  await new Promise((r) => setTimeout(r, 350));
  applyExtract(d, result, engine);
  delete ui.work[docId];
  log("OCR draft created", "", `${d.name}: ${engine}. Draft until an officer verifies it.`, { docId: d.id });
  S.demo.scan = true;
  save(); render();
}
function clamp01(v, dflt) { const n = Number(v); return isFinite(n) ? Math.max(0, Math.min(1, n)) : dflt; }
function applyExtract(d, r, engine) {
  const c = r.confidence || {};
  const validType = RECORD_TYPES.some((t) => t.id === r.type) ? r.type : "";
  d.engine = engine;
  d.ocrText = maskIdsInText(String(r.text || "").trim());
  d.uncertain = Array.isArray(r.uncertain) ? r.uncertain.filter(Boolean).slice(0, 6) : [];
  d.x = {
    reference: (r.reference || "").toUpperCase().trim(), type: validType, date: /^\d{4}-\d{2}-\d{2}$/.test(r.date || "") ? r.date : "", time: /^\d{2}:\d{2}$/.test(r.time || "") ? r.time : "",
    location: r.location || "", summary: r.summary || "",
    people: (r.people || []).filter((p) => p && p.name).map((p, i) => {
      let idType = p.idType || "", idMasked = p.idMasked || "";
      if (!idMasked && p.id_number) { const ty = /pan/i.test(p.id_type || "") ? "pan" : "aadhaar", n = normIdNo(ty, p.id_number); if ((ty === "aadhaar" && /^\d{12}$/.test(n)) || (ty === "pan" && /^[A-Z]{5}\d{4}[A-Z]$/.test(n))) { idType = ty; idMasked = maskId(ty, n); } }
      return { name: p.name, role: PERSON_ROLES.includes(p.role) ? p.role : "Person mentioned", contact: p.contact || "", alias: p.alias || "", address: p.address || "", idType, idMasked, conf: clamp01((c.people || [])[i], 0.8), ok: false };
    }),
    station: matchStation(r.station || "") || "",
    identifiers: (r.identifiers || []).filter((x) => x && x.value).map((x, i) => ({ kind: ["vehicle", "phone", "imei", "document", "other"].includes(x.kind) ? x.kind : "other", value: x.kind === "vehicle" ? prettyVehicle(x.value) : x.value, context: x.context || "", conf: clamp01((c.identifiers || [])[i], 0.8), ok: false })),
    conf: { reference: clamp01(c.reference, 0.8), type: clamp01(c.type, 0.7), date: clamp01(c.date, 0.8), time: clamp01(c.time, 0.8), location: clamp01(c.location, 0.8), summary: clamp01(c.summary, 0.8) },
    ok: { reference: false, type: false, date: false, time: false, location: false, summary: false },
  };
  ["reference", "type", "date", "time", "location", "summary"].forEach((k) => { if (!d.x[k]) d.x.conf[k] = 0; });
  d.status = "review";
}
const confClass = (v) => (v >= 0.85 ? "hi" : v >= 0.7 ? "md" : "lo");
const confText = (v) => (v >= 0.85 ? "High" : v >= 0.7 ? "Medium" : v > 0 ? "Low" : "Not found");
function docRows(d) {
  const x = d.x; const rows = [];
  ["reference", "type", "date", "time", "location", "summary"].forEach((k) => rows.push({ k, conf: x.conf[k], ok: x.ok[k] }));
  x.people.forEach((p, i) => rows.push({ k: "p" + i, conf: p.conf, ok: p.ok }));
  x.identifiers.forEach((p, i) => rows.push({ k: "i" + i, conf: p.conf, ok: p.ok }));
  return rows;
}
