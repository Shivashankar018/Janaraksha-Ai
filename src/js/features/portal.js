/* ===== Login gateway, citizen portal and online complaints ===== */
const CKEY = "janaraksha-complaints-v2";
const LKEY = "janaraksha-lang";
const SKEY = "janaraksha-session";
const OFFICER_IDS = { "u-sho": "KLB-SHO-01", "u-si": "KLB-SI-02", "u-hc": "KLB-HC-03", "u-clerk": "KLB-CLK-04", "u-cp": "KLB-CP-01" };
const DEMO_PASSWORD = "demo1234";

/* Police stations of Kalaburagi (from public district police contact lists; confirm with Kalaburagi Police before real use) */
const STATIONS = [
  { group: "Kalaburagi City", list: ["Ashok Nagar Police Station", "Brahmpur Police Station", "Chowk Police Station", "M B Nagar Police Station", "Raghavendra Nagar Police Station", "Roza Police Station", "Station Bazaar Police Station", "University Police Station", "Women Police Station (City)"] },
  { group: "Rural sub-division", list: ["Mahagaon Police Station", "Kamalapur Police Station", "Jewargi Police Station", "Nelogi Police Station", "Yedrami Police Station", "Women Police Station (District)"] },
  { group: "Aland sub-division", list: ["Aland Police Station", "Nimbarga Police Station", "Madan Hipparga Police Station", "Narona Police Station", "Afzalpur Police Station", "Revoor Police Station", "Devalgangapur Police Station"] },
  { group: "Shahabad sub-division", list: ["Shahabad Town Police Station", "Kalagi Police Station", "Madbool Police Station", "Chittapur Police Station", "Wadi Police Station"] },
  { group: "Chincholi sub-division", list: ["Chincholi Police Station", "Kunchavaram Police Station", "Miriyan Police Station", "Sulepeth Police Station", "Ratkal Police Station", "Sedam Police Station", "Malkhed Police Station", "Kurkunta Police Station", "Mudhol Police Station"] },
  { group: "District units", list: ["Cyber, Economic and Narcotics Crime (CEN) Police Station"] },
];
const ALL_STATIONS = STATIONS.flatMap((g) => g.list);
const stationGroup = (s) => (STATIONS.find((g) => g.list.includes(s)) || { group: "" }).group;
const TALUKS = ["Kalaburagi", "Aland", "Afzalpur", "Chincholi", "Chittapur", "Jewargi", "Kalagi", "Kamalapur", "Sedam", "Shahabad", "Yedrami"];
const TALUK_STATION = { Aland: "Aland Police Station", Afzalpur: "Afzalpur Police Station", Chincholi: "Chincholi Police Station", Chittapur: "Chittapur Police Station", Jewargi: "Jewargi Police Station", Kalagi: "Kalagi Police Station", Kamalapur: "Kamalapur Police Station", Sedam: "Sedam Police Station", Shahabad: "Shahabad Town Police Station", Yedrami: "Yedrami Police Station" };
const CATEGORIES = [
  { id: "theft", label: "Theft", type: "theft" }, { id: "vehicle-theft", label: "Vehicle theft", type: "vehicle-theft" },
  { id: "mobile-lost", label: "Mobile phone lost", type: "lost-property" }, { id: "cyber-fraud", label: "Cyber / online fraud", type: "cheating" },
  { id: "cheating", label: "Cheating", type: "cheating" }, { id: "missing", label: "Missing person", type: "missing-person" },
  { id: "harassment", label: "Harassment or threat", type: "incident" }, { id: "accident", label: "Road accident", type: "accident" },
  { id: "property", label: "Property dispute", type: "petition" }, { id: "other", label: "Other", type: "incident" },
];
const catOf = (id) => CATEGORIES.find((c) => c.id === id) || { id, label: id || "Not set", type: "incident" };
const ID_TYPES = [
  { id: "aadhaar", label: "Aadhaar Card", hint: "12 digits, written as 3 groups of 4" },
  { id: "pan", label: "PAN Card", hint: "10 characters, for example ABCPE1234F" },
  { id: "voter", label: "Voter ID (EPIC)", hint: "3 letters and 7 digits, for example ABC1234567" },
  { id: "dl", label: "Driving Licence", hint: "State code, RTO code, year and number, for example KA32 20190001234" },
  { id: "passport", label: "Passport", hint: "1 letter and 7 digits, for example K1234567" },
];
const idTypeOf = (id) => ID_TYPES.find((t) => t.id === id) || { label: id };
const C_STATUS = { submitted: ["New", "info"], review: ["Under verification", "warn"], info: ["More information needed", "crit"], verified: ["Verified and registered", "ok"], rejected: ["Not accepted", ""] };
const cChip = (c) => `<span class="chip ${C_STATUS[c.status][1]}">${h(C_STATUS[c.status][0])}</span>`;
const RELATIONS = ["Parent", "Child", "Spouse", "Brother or sister", "Relative", "Friend", "Neighbour", "Other"];

/* ---------- ID checks ---------- */
const VD = [[0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],[3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],[6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],[9,8,7,6,5,4,3,2,1,0]];
const VP = [[0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],[8,9,1,6,0,4,3,5,2,7],[9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],[2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8]];
const VINV = [0,4,3,2,1,5,6,7,8,9];
function verhoeffOk(num) { let c = 0; const a = num.split("").reverse().map(Number); for (let i = 0; i < a.length; i++) c = VD[c][VP[i % 8][a[i]]]; return c === 0; }
function verhoeffDigit(num) { let c = 0; const a = num.split("").reverse().map(Number); for (let i = 0; i < a.length; i++) c = VD[c][VP[(i + 1) % 8][a[i]]]; return VINV[c]; }
const normIdNo = (type, v) => (type === "aadhaar" ? String(v || "").replace(/\D/g, "") : String(v || "").toUpperCase().replace(/[^A-Z0-9]/g, ""));
function maskId(type, v) {
  const n = normIdNo(type, v);
  if (!n) return "";
  if (type === "aadhaar") return "XXXX XXXX " + n.slice(-4);
  return n.slice(0, 2) + "X".repeat(Math.max(0, n.length - 4)) + n.slice(-2);
}
const nameTokens = (s) => String(s || "").toLowerCase().replace(/[^a-zಀ-೿ ]/g, " ").split(/\s+/).filter((x) => x.length > 1);
function namesMatch(a, b) {
  const x = nameTokens(a), y = nameTokens(b);
  if (!x.length || !y.length) return null;
  const [s, l] = x.length <= y.length ? [x, y] : [y, x];
  return s.every((t) => l.includes(t));
}
function idCheck(type, value, name) {
  const n = normIdNo(type, value);
  const checks = []; let ok = false; let error = "";
  if (!n) return { ok: false, n, checks, error: "Type the ID number." };
  if (type === "aadhaar") {
    const len = n.length === 12, first = /^[2-9]/.test(n);
    checks.push({ ok: len, text: "Has 12 digits" });
    checks.push({ ok: first, text: "Does not start with 0 or 1" });
    const vh = len && first && verhoeffOk(n);
    checks.push({ ok: vh, text: "Check digit (Verhoeff) is correct" });
    ok = len && first && vh;
    if (!ok) error = !len ? "An Aadhaar number has 12 digits." : !first ? "An Aadhaar number does not start with 0 or 1." : "This Aadhaar number is not valid. Check each digit.";
  } else if (type === "pan") {
    const fmt = /^[A-Z]{5}\d{4}[A-Z]$/.test(n);
    checks.push({ ok: fmt, text: "Format is 5 letters, 4 digits, 1 letter" });
    if (fmt) {
      checks.push({ ok: n[3] === "P", text: n[3] === "P" ? "4th letter P: card of an individual" : "4th letter is not P: not an individual's card", warn: n[3] !== "P" });
      const toks = nameTokens(name);
      if (toks.length > 1) { const sur = toks[toks.length - 1][0].toUpperCase(); checks.push({ ok: n[4] === sur || n[4] === toks[0][0].toUpperCase(), text: "5th letter matches the surname initial", warn: true }); }
    }
    ok = fmt;
    if (!ok) error = "A PAN has 5 letters, 4 digits and 1 letter, for example ABCPE1234F.";
  } else if (type === "voter") {
    ok = /^[A-Z]{3}\d{7}$/.test(n); checks.push({ ok, text: "Format is 3 letters and 7 digits" });
    if (!ok) error = "A Voter ID (EPIC) has 3 letters and 7 digits.";
  } else if (type === "dl") {
    ok = /^[A-Z]{2}\d{13}$/.test(n); checks.push({ ok, text: "Format is state code, RTO code, year and 7 digits" });
    if (ok) checks.push({ ok: n.startsWith("KA"), text: n.startsWith("KA") ? "Issued in Karnataka" : "Issued outside Karnataka", warn: true });
    if (!ok) error = "A driving licence number looks like KA32 20190001234.";
  } else if (type === "passport") {
    ok = /^[A-PR-WY][1-9]\d{5}[1-9]$/.test(n); checks.push({ ok, text: "Format is 1 letter and 7 digits" });
    if (!ok) error = "A passport number has 1 letter and 7 digits.";
  }
  return { ok, n, checks, error };
}

/* ---------- Complaints store (shared by tabs of this browser) ---------- */
let C = [];
function loadComplaints() { try { const v = JSON.parse(localStorage.getItem(CKEY) || "null"); return Array.isArray(v) ? v : null; } catch (e) { return null; } }
function writeComplaints(all) { try { localStorage.setItem(CKEY, JSON.stringify(all)); return true; } catch (e) { toast("This browser could not save the complaint. Storage is full or blocked.", "crit"); return false; } }
function saveComplaint(c) {
  const all = loadComplaints() || C.slice();
  const i = all.findIndex((x) => x.id === c.id);
  c.updatedAt = nowISO();
  if (i >= 0) all[i] = c; else all.push(c);
  writeComplaints(all);
  C = all;
}
const getC = (id) => C.find((c) => c.id === id);
function nextComplaintId() { return nextCaseCode(); }
const cHist = (c, by, kind, text) => { c.history = c.history || []; c.history.push({ at: nowISO(), by, kind, text }); };

/* Fictional sample ID card image (not a copy of any government card design) */
function sampleIdCard(name, typeLabel, masked) {
  const cv = document.createElement("canvas"); cv.width = 640; cv.height = 400;
  const x = cv.getContext("2d");
  const g = x.createLinearGradient(0, 0, 640, 400); g.addColorStop(0, "#eef4f8"); g.addColorStop(1, "#dbe8ef");
  x.fillStyle = g; x.fillRect(0, 0, 640, 400);
  x.strokeStyle = "#7a8fa3"; x.lineWidth = 4; x.strokeRect(10, 10, 620, 380);
  x.fillStyle = "#13233f"; x.font = "bold 28px Arial"; x.fillText("IDENTITY DOCUMENT (SAMPLE)", 34, 62);
  x.font = "18px Arial"; x.fillStyle = "#4a5d72"; x.fillText(typeLabel + " · fictional, for prototype testing", 34, 92);
  x.fillStyle = "#c9d6e2"; x.fillRect(34, 120, 140, 170);
  x.fillStyle = "#8ea3b8"; x.beginPath(); x.arc(104, 180, 34, 0, Math.PI * 2); x.fill(); x.fillRect(58, 222, 92, 60);
  x.fillStyle = "#13233f"; x.font = "bold 26px Arial"; x.fillText(name, 200, 160);
  x.font = "20px Arial"; x.fillText("Number: " + masked, 200, 205); x.fillText("Kalaburagi, Karnataka", 200, 245);
  x.save(); x.translate(320, 330); x.rotate(-0.12); x.font = "bold 46px Arial"; x.fillStyle = "rgba(184,56,47,.22)"; x.fillText("NOT A REAL ID", -180, 0); x.restore();
  return cv.toDataURL("image/jpeg", 0.85);
}
function samplePortrait(seed) {
  const cv = document.createElement("canvas"); cv.width = 360; cv.height = 450;
  const x = cv.getContext("2d");
  const hues = [[214, 196], [168, 150], [28, 12], [262, 240]];
  const hh = hues[[...String(seed || "")].reduce((a, ch) => a + ch.charCodeAt(0), 0) % hues.length];
  const g = x.createLinearGradient(0, 0, 0, 450); g.addColorStop(0, `hsl(${hh[0]},38%,88%)`); g.addColorStop(1, `hsl(${hh[1]},34%,76%)`);
  x.fillStyle = g; x.fillRect(0, 0, 360, 450);
  x.fillStyle = `hsl(${hh[0]},22%,48%)`;
  x.beginPath(); x.ellipse(180, 395, 140, 110, 0, Math.PI, 0); x.fill();
  x.beginPath(); x.arc(180, 175, 78, 0, Math.PI * 2); x.fill();
  x.fillRect(150, 235, 60, 50);
  x.fillStyle = "rgba(255,255,255,.88)"; x.fillRect(0, 410, 360, 40);
  x.fillStyle = "#13233f"; x.font = "bold 18px Arial"; x.textAlign = "center"; x.fillText("SAMPLE PHOTO · NOT A REAL PERSON", 180, 436);
  return cv.toDataURL("image/jpeg", 0.85);
}
function sampleAadhaar() { const base = "99990000" + String(100 + Math.floor(Math.random() * 800)); return base + verhoeffDigit(base); }

const SEED_MARK = CKEY + "-seed";
const markSeed = () => { try { localStorage.setItem(SEED_MARK, String(SEED_VER)); } catch (e) {} };
/* Demo complaints are logged once at the time they were filed, not as new arrivals */
function seedComplaintAudit(list) {
  if (!S) return;
  S.cSeen = S.cSeen || [];
  let n = 0;
  list.forEach((c) => {
    if (S.cSeen.includes(c.id)) return;
    S.cSeen.push(c.id); n++;
    S.audit.push({ id: "A-" + String(S.audit.length + 1).padStart(4, "0"), at: c.createdAt, userId: "system", action: "Online complaint received", recordId: c.id, detail: `${c.person.name} · ${catOf(c.incident.category).label} · ${c.station}` });
  });
  if (n) { S.audit.sort((a, b) => a.at.localeCompare(b.at)); save(); }
}
function loadAllComplaints() {
  const v = loadComplaints();
  if (v) {
    C = v;
    /* A browser that already has complaints gets the newer demo complaints added once. Nothing it holds is changed. */
    let sv = 0; try { sv = +localStorage.getItem(SEED_MARK) || 1; } catch (e) {}
    if (sv < SEED_VER) {
      const add = moreComplaints().filter((x) => !C.some((c) => c.id === x.id) && !(S && S.records.some((r) => r.id === x.id)));
      if (add.length) { C = C.concat(add); writeComplaints(C); seedComplaintAudit(add); }
      markSeed();
    }
    return;
  }
  C = seedComplaints();
  writeComplaints(C); markSeed(); seedComplaintAudit(C);
}

/* ---------- Session (one per browser tab) ---------- */
let SESSION = null;
/* Always start on the Citizen / Officer choice page. The login lives only while the page is open. */
function loadSession() { SESSION = null; ui.gw = "choose"; try { sessionStorage.removeItem(SKEY); } catch (e) {} }
function setSession(s) { SESSION = s; try { if (s) sessionStorage.setItem(SKEY, JSON.stringify(s)); else sessionStorage.removeItem(SKEY); } catch (e) {} }
const isAdmin = () => SESSION && SESSION.kind === "admin";
const isCitizen = () => SESSION && SESSION.kind === "citizen";
const CIT_PAGES = ["file-complaint", "my-complaints"];

/* ---------- Gateway (login page) ---------- */
function langToggle() {
  return `<div class="lang" role="group" aria-label="Language" data-notr><button class="${S.lang === "kn" ? "" : "on"}" data-act="setLang" data-id="en" aria-pressed="${S.lang !== "kn"}">English</button><button class="${S.lang === "kn" ? "on" : ""}" data-act="setLang" data-id="kn" aria-pressed="${S.lang === "kn"}" lang="kn">ಕನ್ನಡ</button></div>`;
}
function vGateway() {
  const mode = ui.gw || "choose";
  let right = "";
  if (mode === "citizen") {
    const o = ui.otp;
    right = `<button class="linkbtn small" data-act="gwBack">← Back</button>
      <h2>Citizen sign in</h2><p class="muted">Use your mobile number. We send a one-time password (OTP) to confirm it.</p>
      <form class="stack" data-form="citizenLogin" novalidate>
        <div class="field"><label for="cl-phone">Mobile number</label><div class="phone"><span>+91</span><input id="cl-phone" class="input mono" inputmode="numeric" maxlength="10" autocomplete="tel-national" value="${h(o ? o.phone : ui.clPhone || "")}" ${o ? "readonly" : ""} placeholder="10-digit mobile number" /></div>${ui.gwErr && !o ? `<span class="err">${h(ui.gwErr)}</span>` : ""}</div>
        ${o ? `<div class="banner accent"><span><b>Demo SMS</b> · <span>Your OTP:</span> <b class="mono" style="font-size:16px;letter-spacing:.12em">${h(o.code)}</b> · <span>In the real system this comes by SMS.</span></span></div>
          <div class="field"><label for="cl-otp">Enter the 6-digit OTP</label><input id="cl-otp" class="input mono otp" inputmode="numeric" maxlength="6" autocomplete="one-time-code" />${ui.gwErr ? `<span class="err">${h(ui.gwErr)}</span>` : ""}</div>
          <button class="btn primary big" type="submit">Verify and continue</button>
          <button class="linkbtn small" type="button" data-act="otpReset">Change mobile number</button>`
        : `<button class="btn primary big" type="submit">Send OTP</button>`}
      </form>`;
  } else if (mode === "admin") {
    const ph = ui.alPhase || "police";
    const ids = ph === "cp" ? ["u-cp"] : POLICE_USERS().map((u) => u.id);
    const st = ui.alSt || HOME_STATION;
    right = `<button class="linkbtn small" data-act="gwBack">← Back</button>
      <h2>Admin login</h2><p class="muted">For authorised police staff of Kalaburagi. Choose your phase.</p>
      <div class="ph-tabs" role="tablist" aria-label="Admin phase">
        <button role="tab" aria-selected="${ph === "cp"}" class="${ph === "cp" ? "on" : ""}" data-act="alPhase" data-id="cp">${ICON.chart}<b>Commissioner phase</b><span>All stations: counts, escalations and progress</span></button>
        <button role="tab" aria-selected="${ph === "police"}" class="${ph === "police" ? "on" : ""}" data-act="alPhase" data-id="police">${ICON.shield}<b>Police phase</b><span>Station dashboard, Direct Entry, Scanner, Case Connection</span></button>
      </div>
      <form class="stack" data-form="adminLogin" novalidate>
        <div class="field"><label for="al-id">${ph === "cp" ? "Commissioner ID" : "Officer ID"}</label><input id="al-id" class="input mono" list="al-ids" autocomplete="username" value="${h(ui.alId || "")}" placeholder="for example ${ph === "cp" ? "KLB-CP-01" : "KLB-SHO-01"}" /><datalist id="al-ids">${ids.map((u) => `<option value="${OFFICER_IDS[u]}"></option>`).join("")}</datalist></div>
        <div class="field"><label for="al-pw">Password</label><input id="al-pw" type="password" class="input" autocomplete="current-password" /></div>
        ${ph === "police" ? `<div class="field"><label for="al-st">Your police station</label><select id="al-st" class="select">${STATIONS.map((g) => `<optgroup label="${h(g.group)}">${g.list.map((s) => `<option value="${h(s)}" ${s === st ? "selected" : ""}>${h(s)}</option>`).join("")}</optgroup>`).join("")}</select><span class="help">Demo station records belong to ${h(HOME_STATION)}.</span></div>` : ""}
        ${ui.gwErr ? `<div class="banner warn small">${h(ui.gwErr)}</div>` : ""}
        <button class="btn primary big" type="submit">${ph === "cp" ? "Sign in as Commissioner" : "Sign in to the station"}</button>
      </form>
      <div class="democreds"><div class="lbl">${ph === "cp" ? "Demo Commissioner account" : "Demo officer accounts"}</div>
        <table class="t"><tbody>${ids.map((id) => { const u = USERS.find((x) => x.id === id); return `<tr><td class="mono"><button class="linkbtn mono" data-act="fillOfficer" data-id="${OFFICER_IDS[u.id]}">${OFFICER_IDS[u.id]}</button></td><td class="small"><span data-notr>${h(u.name)}</span><div class="muted tiny">${h(u.roleLabel)}</div></td></tr>`; }).join("")}</tbody></table>
        <p class="help">Password for all demo accounts: <b class="mono">${DEMO_PASSWORD}</b></p></div>`;
  } else {
    right = `<h2>Choose how you want to continue</h2>
      <div class="gw-cards">
        <button class="gw-card" data-act="gwCitizen"><span class="gw-ic">${ICON.user}</span><b>Citizen</b><span>File a police complaint online and track its status.</span><span class="btn primary">Continue as citizen</span></button>
        <button class="gw-card" data-act="gwAdmin"><span class="gw-ic dark">${ICON.shield}</span><b>Admin login</b><span>Commissioner phase for all stations. Police phase for station officers.</span><span class="btn">Admin login</span></button>
      </div>
      <div class="banner crit small"><b>Emergency?</b><span>Call 112 now. Do not use this form for emergencies.</span></div>
      <figure class="gw-photo"><img src="${GW_PHOTO}" alt="Police officers in uniform" /></figure>`;
  }
  return `<div class="gw">
    <section class="gw-left">
      <div class="brand" style="padding:0"><div class="brand-badge">${badgeSVG(76, true)}</div><div><div class="brand-name">JANARAKSHA <span>AI</span></div><div class="brand-sub">Paper-light police station</div></div></div>
      <div class="gw-hero"><h1>Kalaburagi police: online complaints and records</h1><p>Citizens file complaints from home. Officers verify the person, the ID and the details, then register the complaint as a trusted record.</p></div>
      <ol class="gw-steps"><li><b>File</b><span>Citizen enters the complaint, ID and address</span></li><li><b>Notify</b><span>The chosen station gets an alert at once</span></li><li><b>Verify</b><span>An officer checks the details and registers it</span></li></ol>
      <p class="gw-note">Prototype for Kalyan Karnataka Buildathon 2026. Fictional data only. Data stays in this browser.</p>
    </section>
    <section class="gw-right"><div class="gw-top">${langToggle()}${demoLogoSVG(64)}</div><div class="gw-box">${right}</div></div>
  </div>`;
}

/* ---------- Citizen portal ---------- */
function citizenDraftKey() { return "janaraksha-cdraft-" + (SESSION ? SESSION.phone : ""); }
function blankForm() {
  return { filingAs: "self", otherName: "", relation: "", name: "", father: "", gender: "", age: "", email: "", occupation: "", altPhone: "",
    idType: "aadhaar", idNumber: "", nameOnId: "", idPhoto: "", selfie: "", house: "", street: "", village: "", taluk: "Kalaburagi", district: "Kalaburagi", state: "Karnataka", pin: "",
    category: "", date: "", time: "", place: "", description: "", involved: "", property: "", value: "", witnesses: "", photos: [], station: "", declare: false };
}
let CF = null;
function loadCForm() { try { CF = JSON.parse(localStorage.getItem(citizenDraftKey()) || "null"); } catch (e) { CF = null; } if (!CF) CF = blankForm(); ui.cstep = CF._step || 1; }
let cfTimer = null;
function saveCForm() { clearTimeout(cfTimer); cfTimer = setTimeout(() => { try { CF._step = ui.cstep; localStorage.setItem(citizenDraftKey(), JSON.stringify(CF)); } catch (e) {} }, 250); }
const CSTEPS = ["Your details", "ID proof", "Address", "Complaint", "Police station", "Review"];
function cErrors(step) {
  const F = CF, e = {};
  if (step === 1) {
    if (F.filingAs === "other") { if (F.otherName.trim().length < 3) e.otherName = "Type the name of the person you are filing for."; if (!F.relation) e.relation = "Choose how you are related."; }
    if (F.name.trim().length < 3) e.name = "Type your full name.";
    if (!F.gender) e.gender = "Choose your gender.";
    const ag = Number(F.age); if (!F.age || !(ag >= 1 && ag <= 120)) e.age = "Type your age in years.";
    if (F.altPhone && !/^[6-9]\d{9}$/.test(F.altPhone.replace(/\D/g, ""))) e.altPhone = "A mobile number has 10 digits and starts with 6, 7, 8 or 9.";
    if (F.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(F.email)) e.email = "Check the email address.";
  }
  if (step === 2) {
    const r = idCheck(F.idType, F.idNumber, F.name);
    if (!r.ok) e.idNumber = r.error;
    if (F.nameOnId.trim().length < 3) e.nameOnId = "Type your name as it is printed on the ID card.";
  }
  if (step === 3) {
    if (F.street.trim().length < 3) e.street = "Type the street or area.";
    if (F.village.trim().length < 2) e.village = "Type the village, town or city.";
    if (!F.taluk) e.taluk = "Choose the taluk.";
    if (F.district.trim().length < 3) e.district = "Type the district.";
    if (!/^\d{6}$/.test(F.pin)) e.pin = "A PIN code has 6 digits.";
  }
  if (step === 4) {
    if (!F.category) e.category = "Choose the type of complaint.";
    if (!F.date) e.date = "Choose the date of the incident."; else if (F.date > todayIST()) e.date = "The date cannot be in the future.";
    if (F.place.trim().length < 3) e.place = "Type where it happened.";
    if (F.description.trim().length < 50) e.description = "Write at least 50 characters: what happened, when and where.";
    if (F.value && !/^\d{1,9}$/.test(F.value.replace(/[, ]/g, ""))) e.value = "Type the value in rupees, using digits only.";
  }
  if (step === 5) { if (!F.station) e.station = "Choose the police station."; }
  if (step === 6) { if (!F.declare) e.declare = "Tick the declaration to submit."; }
  return e;
}
const ce = (f) => (ui.cShowErr && ui.cErr && ui.cErr[f] ? `<span class="err" id="er-${f}">${h(ui.cErr[f])}</span>` : "");
const ceCls = (f) => (ui.cShowErr && ui.cErr && ui.cErr[f] ? "flag" : "");
const cfIn = (f, attrs) => `<input id="cf-${f}" class="input ${ceCls(f)}" data-bind="cf" data-f="${f}" value="${h(CF[f] || "")}" ${attrs || ""} />`;
const cfFld = (f, label, ctrl, o) => `<div class="field ${(o && o.full) ? "full" : ""}"><label for="cf-${f}">${label}${o && o.req ? '<span class="req">*</span>' : ""}</label>${ctrl}${o && o.help ? `<span class="help">${o.help}</span>` : ""}${ce(f)}</div>`;
const cfSel = (f, opts, ph) => `<select id="cf-${f}" class="select ${ceCls(f)}" data-bind="cfs" data-f="${f}">${ph ? `<option value="">${ph}</option>` : ""}${opts.map((o) => { const v = typeof o === "string" ? o : o.v; const l = typeof o === "string" ? o : o.l; return `<option value="${h(v)}" ${CF[f] === v ? "selected" : ""}>${h(l)}</option>`; }).join("")}</select>`;

function vIdCheck() {
  const r = idCheck(CF.idType, CF.idNumber, CF.name);
  if (!CF.idNumber) return `<p class="help">${h(idTypeOf(CF.idType).hint)}</p>`;
  return `<div class="idchk">${r.checks.map((c) => `<div class="${c.ok ? "ok" : c.warn ? "warn" : "bad"}"><span>${c.ok ? "✓" : "!"}</span>${h(c.text)}</div>`).join("")}${r.ok ? `<div class="ok"><span>✓</span><span>Officers see it as <b class="mono">${h(maskId(CF.idType, CF.idNumber))}</b></span></div>` : ""}</div>`;
}
function vSelfie(big) {
  const id = CF.selfie, src = id && MEDIA[id];
  return `<div class="selfie ${big ? "big" : ""}">${src ? `<img src="${src}" alt="Your photo" data-act="viewMedia" data-id="${id}" />` : `<div class="selfie-ph">${ICON.camera}<span>No photo added</span></div>`}</div>`;
}
function vSelfieBtns() {
  return `<div class="row" style="gap:8px"><button class="btn sm" data-act="pickFile" data-for="sf-cam">${ICON.camera}Take photo</button><button class="btn sm" data-act="pickFile" data-for="sf-file">${ICON.upload}Upload</button>${CF.selfie ? `<button class="btn sm ghost" data-act="cfClearSelfie">Remove</button>` : ""}</div>
    <input id="sf-cam" type="file" accept="image/*" capture="user" class="sr" data-bind="cSelfie" tabindex="-1" aria-hidden="true" /><input id="sf-file" type="file" accept="image/*" class="sr" data-bind="cSelfie" tabindex="-1" aria-hidden="true" />`;
}
function vCStep() {
  const F = CF, s = ui.cstep;
  if (s === 1) return `<div class="stack">
    <div class="field"><span class="lbl">Who is filing this complaint?<span class="req">*</span></span><div class="opt2" role="radiogroup">
      <button type="button" role="radio" aria-checked="${F.filingAs === "self"}" class="type ${F.filingAs === "self" ? "on" : ""}" data-act="cfSet" data-f="filingAs" data-v="self"><b>For myself</b><span>I am the person affected</span></button>
      <button type="button" role="radio" aria-checked="${F.filingAs === "other"}" class="type ${F.filingAs === "other" ? "on" : ""}" data-act="cfSet" data-f="filingAs" data-v="other"><b>For someone else</b><span>A family member, friend or other person</span></button></div></div>
    ${F.filingAs === "other" ? `<div class="fgrid">${cfFld("otherName", "Name of the person affected", cfIn("otherName"), { req: 1 })}${cfFld("relation", "Your relation to the person", cfSel("relation", RELATIONS, "Choose"), { req: 1 })}</div>` : ""}
    <div class="fgrid">
      ${cfFld("name", "Your full name", cfIn("name", 'autocomplete="name"'), { req: 1 })}
      ${cfFld("father", "Father's or husband's name", cfIn("father"))}
      ${cfFld("gender", "Gender", cfSel("gender", ["Female", "Male", "Other", "Prefer not to say"], "Choose"), { req: 1 })}
      ${cfFld("age", "Age (years)", cfIn("age", 'inputmode="numeric" maxlength="3"'), { req: 1 })}
      <div class="field"><label for="cf-phone">Mobile number</label><div class="phone"><span>+91</span><input id="cf-phone" class="input mono" value="${h(SESSION.phone)}" readonly /></div><span class="help"><span class="chip ok">OTP verified</span></span></div>
      ${cfFld("altPhone", "Other phone number", cfIn("altPhone", 'inputmode="numeric" maxlength="10"'))}
      ${cfFld("email", "Email", cfIn("email", 'type="email" autocomplete="email"'))}
      ${cfFld("occupation", "Occupation", cfIn("occupation"))}
    </div>
    <div class="field"><span class="lbl">Your photo</span>
      <div class="selfie-row">${vSelfie()}<div class="stack" style="gap:8px">${vSelfieBtns()}<span class="help">Optional. A clear photo of your face helps the officer match you with your ID card.</span></div></div></div>
    </div>`;
  if (s === 2) return `<div class="stack">
    <div class="banner info small"><span>Your ID number is shown to officers in masked form. Only an SI or SHO can see the full number, and each view is recorded.</span></div>
    <div class="field"><span class="lbl">ID card type<span class="req">*</span></span><div class="idtypes" role="radiogroup">${ID_TYPES.map((t) => `<button type="button" role="radio" aria-checked="${F.idType === t.id}" class="type ${F.idType === t.id ? "on" : ""}" data-act="cfSet" data-f="idType" data-v="${t.id}"><b>${h(t.label)}</b></button>`).join("")}</div></div>
    <div class="fgrid">
      ${cfFld("idNumber", "ID number", cfIn("idNumber", `class="input mono" autocomplete="off" spellcheck="false" placeholder="${h(idTypeOf(F.idType).hint)}"`), { req: 1 })}
      ${cfFld("nameOnId", "Name as printed on the ID card", cfIn("nameOnId"), { req: 1 })}
    </div>
    <div id="idcheck">${vIdCheck()}</div>
    <div class="field"><span class="lbl">Photo of the ID card (front side)</span>
      <div class="row">${F.idPhoto && MEDIA[F.idPhoto] ? `<img class="idthumb" src="${MEDIA[F.idPhoto]}" alt="ID card photo" data-act="viewMedia" data-id="${F.idPhoto}" />` : ""}
        <button class="btn" data-act="pickFile" data-for="id-cam">${ICON.camera}Take photo</button><button class="btn" data-act="pickFile" data-for="id-file">${ICON.upload}Upload</button>${F.idPhoto ? `<button class="btn ghost" data-act="cfClearIdPhoto">Remove</button>` : ""}</div>
      <input id="id-cam" type="file" accept="image/*" capture="environment" class="sr" data-bind="cIdPhoto" tabindex="-1" aria-hidden="true" /><input id="id-file" type="file" accept="image/*" class="sr" data-bind="cIdPhoto" tabindex="-1" aria-hidden="true" />
      <span class="help">Optional, but it helps the officer verify you faster. Make sure the number and name are readable.</span></div>
    <p class="help"><b>Prototype:</b> use the sample data or a test number. Do not enter your real Aadhaar number here.</p></div>`;
  if (s === 3) return `<div class="fgrid">
      ${cfFld("house", "House or building number", cfIn("house"))}
      ${cfFld("street", "Street or area", cfIn("street", 'autocomplete="address-line1"'), { req: 1 })}
      ${cfFld("village", "Village, town or city", cfIn("village"), { req: 1 })}
      ${cfFld("taluk", "Taluk", cfSel("taluk", TALUKS, "Choose"), { req: 1 })}
      ${cfFld("district", "District", cfIn("district"), { req: 1 })}
      ${cfFld("state", "State", cfIn("state"))}
      ${cfFld("pin", "PIN code", cfIn("pin", 'inputmode="numeric" maxlength="6" autocomplete="postal-code"'), { req: 1, help: CF.pin && /^\d{6}$/.test(CF.pin) && !CF.pin.startsWith("585") ? "This PIN is outside Kalaburagi district (585xxx). You can still file." : "" })}
    </div>`;
  if (s === 4) return `<div class="stack">
    <div class="fgrid">
      ${cfFld("category", "Type of complaint", cfSel("category", CATEGORIES.map((c) => ({ v: c.id, l: c.label })), "Choose"), { req: 1 })}
      <div class="row" style="gap:10px;align-items:start">${cfFld("date", "Date of incident", `<input id="cf-date" type="date" class="input ${ceCls("date")}" data-bind="cf" data-f="date" value="${h(F.date)}" max="${todayIST()}" />`, { req: 1 })}${cfFld("time", "Time (about)", `<input id="cf-time" type="time" class="input" data-bind="cf" data-f="time" value="${h(F.time)}" />`)}</div>
      ${cfFld("place", "Place of incident", cfIn("place", 'placeholder="Road, landmark, area or village"'), { req: 1, full: 1 })}
      ${cfFld("description", "What happened? Give full details", `<textarea id="cf-description" class="textarea ${ceCls("description")}" style="min-height:150px" data-bind="cf" data-f="description" placeholder="Write what happened, in order. Include the time, the place, what was lost or damaged, and anything you saw or heard.">${h(F.description)}</textarea><span class="help" id="cf-desc-n">${F.description.trim().length} characters. Write at least 50.</span>`, { req: 1, full: 1 })}
      <div class="full" id="law-cit">${vLawCitizen(F)}</div>
      ${cfFld("involved", "Persons involved (if known)", cfIn("involved", 'placeholder="Name, description or phone number"'), { full: 1 })}
      ${cfFld("property", "Property lost or damaged", cfIn("property", 'placeholder="for example Mobile phone, IMEI 35..."'))}
      ${cfFld("value", "Approximate value (Rs)", cfIn("value", 'inputmode="numeric"'))}
      ${cfFld("witnesses", "Witnesses (name and phone)", cfIn("witnesses"), { full: 1 })}
    </div>
    <div class="field"><span class="lbl">Photos or documents as evidence (up to 5)</span>
      <div class="row"><button class="btn" data-act="pickFile" data-for="ev-cam" ${F.photos.length >= 5 ? "disabled" : ""}>${ICON.camera}Take photo</button><button class="btn" data-act="pickFile" data-for="ev-file" ${F.photos.length >= 5 ? "disabled" : ""}>${ICON.upload}Add files</button></div>
      <input id="ev-cam" type="file" accept="image/*" capture="environment" class="sr" data-bind="cEvidence" tabindex="-1" aria-hidden="true" /><input id="ev-file" type="file" accept="image/*" multiple class="sr" data-bind="cEvidence" tabindex="-1" aria-hidden="true" />
      ${F.photos.length ? `<div class="photos">${F.photos.map((p, i) => `<figure class="ph">${MEDIA[p] ? `<img src="${MEDIA[p]}" alt="Evidence ${i + 1}" data-act="viewMedia" data-id="${p}" />` : `<div class="ph-miss">Photo not available</div>`}<button class="btn ghost sm" data-act="cfDelPhoto" data-i="${i}">${ICON.trash}Remove</button></figure>`).join("")}</div>` : ""}</div></div>`;
  if (s === 5) {
    const sug = TALUK_STATION[F.taluk];
    return `<div class="stack">
      <p class="muted">Choose the station nearest to the place of the incident. The police can move it to the right station if needed.</p>
      ${sug && F.station !== sug ? `<div class="banner accent small"><span style="flex:1">Your address is in ${h(F.taluk)} taluk. Suggested: <b>${h(sug)}</b></span><button class="btn sm" data-act="cfSet" data-f="station" data-v="${h(sug)}">Use this station</button></div>` : ""}
      ${cfFld("station", "Police station in Kalaburagi", `<select id="cf-station" class="select ${ceCls("station")}" data-bind="cfs" data-f="station"><option value="">Choose a police station</option>${STATIONS.map((g) => `<optgroup label="${h(g.group)}">${g.list.map((x) => `<option value="${h(x)}" ${F.station === x ? "selected" : ""}>${h(x)}</option>`).join("")}</optgroup>`).join("")}</select>`, { req: 1 })}
      ${F.station ? `<div class="stcard">${ICON.shield}<div><b>${h(F.station)}</b><span class="muted small">${h(stationGroup(F.station))} · Kalaburagi</span></div></div>` : ""}
    </div>`;
  }
  const idr = idCheck(F.idType, F.idNumber, F.name);
  const row = (k, v) => `<div class="rv"><span class="k">${k}</span><span class="v" data-notr>${h(v || "")}</span></div>`;
  const sec = (n, title, body) => `<section class="rvs"><div class="row"><h3 style="flex:1">${title}</h3><button class="btn sm ghost" data-act="cGo" data-step="${n}">Edit</button></div>${body}</section>`;
  const ev = F.photos.length ? `<div class="rvimgs">${F.photos.map((p, i) => MEDIA[p] ? `<img src="${MEDIA[p]}" alt="Evidence ${i + 1}" data-act="viewMedia" data-id="${p}" />` : `<div class="ph-miss">Photo not available</div>`).join("")}</div>` : `<span class="muted small">No evidence photos added.</span>`;
  const idImg = F.idPhoto && MEDIA[F.idPhoto] ? `<div class="rvimgs"><img class="wide" src="${MEDIA[F.idPhoto]}" alt="ID card photo" data-act="viewMedia" data-id="${F.idPhoto}" /></div>` : `<span class="muted small">No ID card photo added.</span>`;
  return `<div class="stack">
    <section class="rvs rvhead">${vSelfie(true)}<div class="stack" style="gap:6px;flex:1;min-width:0">
      <div class="lbl">Your photo</div>
      <b class="rvname" data-notr>${h(F.name || "")}</b>
      <span class="muted small"><span class="mono">+91 ${h(SESSION.phone)}</span> · ${F.filingAs === "other" ? "For someone else" : "For myself"}</span>
      ${vSelfieBtns()}
      <span class="help">${F.selfie ? "Check that your face is clear. The officer compares this photo with your ID card." : "Optional. A clear photo of your face helps the officer match you with your ID card."}</span>
    </div></section>
    ${sec(1, "Your details", (F.filingAs === "other" ? row("Filing for", `${F.otherName} (${F.relation})`) : "") + row("Name", F.name) + row("Father or husband", F.father) + row("Gender and age", `${F.gender}, ${F.age}`) + row("Mobile", "+91 " + SESSION.phone) + (F.email ? row("Email", F.email) : ""))}
    ${sec(2, "ID proof", row("ID type", idTypeOf(F.idType).label) + row("ID number", idr.ok ? maskId(F.idType, F.idNumber) : F.idNumber) + row("Name on ID", F.nameOnId) + `<div class="lbl" style="margin-top:6px">ID card photo</div>` + idImg)}
    ${sec(3, "Address", row("Address", [F.house, F.street, F.village].filter(Boolean).join(", ")) + row("Taluk and district", `${F.taluk}, ${F.district}`) + row("PIN code", F.pin))}
    ${sec(4, "Complaint", row("Type", catOf(F.category).label) + row("Date and time", `${fmtDate(F.date)}${F.time ? ", " + F.time : ""}`) + row("Place", F.place) + `<p class="rvtext" data-notr>${h(F.description)}</p>` + (F.involved ? row("Persons involved", F.involved) : "") + (F.property ? row("Property", `${F.property}${F.value ? " (Rs " + F.value + ")" : ""}`) : "") + `<div class="lbl" style="margin-top:6px">Evidence photos</div>` + ev)}
    ${sec(5, "Police station", row("Station", F.station))}
    <label class="cbx ${ceCls("declare")}" style="padding:12px;border-radius:10px;background:var(--surface-2)"><input type="checkbox" id="cf-declare" data-bind="cfc" data-f="declare" ${F.declare ? "checked" : ""} /><span>I declare that the information above is true to the best of my knowledge. I understand that giving false information to the police is a punishable offence.</span></label>${ce("declare")}
  </div>`;
}
function vFile() {
  if (ui.cAck) {
    const c = getC(ui.cAck);
    if (c) return `<section class="card ack"><div class="ack-ic">${ICON.check}</div><h2>Complaint submitted</h2>
      <p class="muted">Keep this number to track your complaint.</p><div class="ackno mono">${h(c.id)}</div>
      <div class="facts" style="text-align:left"><div class="fact"><div class="k">Submitted</div><div class="v">${h(fmtDT(c.createdAt))}</div></div><div class="fact"><div class="k">Police station</div><div class="v">${h(c.station)}</div></div><div class="fact"><div class="k">Status</div><div class="v">${cChip(c)}</div></div></div>
      <div class="stack" style="text-align:left;gap:8px"><h3>What happens next</h3><ol class="next"><li>An officer at ${h(c.station)} checks your details and your ID.</li><li>You may get a call on +91 ${h(c.phone)} to confirm.</li><li>You can see the status and any messages under My complaints.</li></ol>
      <p class="help">This number tracks your online complaint. When an officer verifies it, the station gives it a record number.</p></div>
      <div class="row ack-print" style="justify-content:center"><button class="btn primary" data-act="cPrintAck" data-id="${h(c.id)}">${ICON.print}Print acknowledgment</button><button class="btn" data-act="cDownloadAck" data-id="${h(c.id)}">${ICON.download}Download acknowledgment</button></div>
      <div class="row" style="justify-content:center"><a class="btn" href="#my-complaints">View my complaints</a><button class="btn" data-act="cNew">File another complaint</button></div></section>`;
  }
  const s = ui.cstep;
  const errN = ui.cShowErr && ui.cErr ? Object.keys(ui.cErr).length : 0;
  return `<div class="banner crit small"><b>Emergency?</b><span>If someone is in danger now, call 112. Do not wait for this form.</span></div>
  <div class="row"><h1 style="flex:1">File a complaint</h1><button class="btn sm" data-act="cSample">${ICON.spark}Fill sample data (demo)</button></div>
  <ol class="wiz" aria-label="Form steps">${CSTEPS.map((t, i) => `<li class="${i + 1 < s ? "done" : i + 1 === s ? "on" : ""}"><button ${i + 1 < s ? `data-act="cGo" data-step="${i + 1}"` : "disabled"} ${i + 1 === s ? 'aria-current="step"' : ""}><span class="n">${i + 1 < s ? "✓" : i + 1}</span><span class="t">${h(t)}</span></button></li>`).join("")}</ol>
  <section class="card"><div class="card-h"><span class="eyebrow">Step ${s} of 6</span><h2>${h(CSTEPS[s - 1])}</h2></div>
    <div class="card-b" id="cstep">${errN ? `<div class="banner warn small" role="alert"><span>Please fix the highlighted fields below.</span></div>` : ""}${vCStep()}</div>
    <div class="cnav">${s > 1 ? `<button class="btn" data-act="cBack">Back</button>` : "<span></span>"}<span class="muted tiny">Your answers are saved on this device as you type.</span>${s < 6 ? `<button class="btn primary" data-act="cNext">Next</button>` : `<button class="btn primary" data-act="cSubmit">${ICON.check}Submit complaint</button>`}</div>
  </section>`;
}
function vMine() {
  const mine = C.filter((c) => c.phone === SESSION.phone).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (!mine.length) return `<h1>My complaints</h1><section class="card empty"><p>You have not filed a complaint with this mobile number yet.</p><p style="margin-top:10px"><a class="btn primary" href="#file-complaint">File a complaint</a></p></section>`;
  return `<h1>My complaints</h1><p class="muted">Complaints filed with +91 ${h(SESSION.phone)}.</p>
  <div class="stack">${mine.map((c) => {
    const open = ui.cOpen === c.id || mine.length === 1;
    return `<section class="card mc ${c.citizenUnread ? "unread" : ""}">
      <button class="mc-h" data-act="cToggle" data-id="${c.id}" aria-expanded="${open}"><span class="mono" style="font-weight:600">${h(c.id)}</span>${cChip(c)}${c.citizenUnread ? `<span class="chip accent">New update</span>` : ""}<span class="spacer"></span><span class="muted small">${h(catOf(c.incident.category).label)} · ${h(fmtDate(istDay(c.createdAt)))}</span></button>
      ${open ? `<div class="card-b stack">
        <div class="facts"><div class="fact"><div class="k">Police station</div><div class="v">${h(c.station)}</div></div><div class="fact"><div class="k">Place</div><div class="v" data-notr>${h(c.incident.place)}</div></div><div class="fact"><div class="k">ID used</div><div class="v"><span>${h(idTypeOf(c.idp.type).label)}</span> <span class="mono">${h(maskId(c.idp.type, c.idp.number))}</span></div></div></div>
        <div class="row"><button class="btn sm" data-act="cPrintAck" data-id="${h(c.id)}">${ICON.print}Print acknowledgment</button><button class="btn sm" data-act="cDownloadAck" data-id="${h(c.id)}">${ICON.download}Download acknowledgment</button></div>
        ${(() => { const it = itemFromC(c); const pg = it.track.filter((x) => x.kind === "progress").slice(-3).reverse(); return it.stage === "rejected" ? "" : `<div class="stack" style="gap:8px"><h3>Progress of your complaint</h3>${stepperHTML(it, true)}
          ${c.status === "verified" ? `<div class="banner accent"><span><span>Your complaint is verified and registered.</span>${c.fir ? ` <span>FIR No.</span> <b class="mono">${h(c.fir)}</b>` : ""} · <span>Complaint code:</span> <b class="mono">${h(c.id)}</b></span></div>` : ""}
          ${pg.map((x) => `<div class="note"><div class="by">${x.stage ? `${stageChip(x.stage)} ` : ""}${h(fmtDT(x.at))}</div><span data-notr>${h(x.text)}</span>${x.next ? `<div class="tiny muted"><span>Next step</span>: <span data-notr>${h(x.next)}</span></div>` : ""}</div>`).join("")}</div>`; })()}
        ${c.status === "rejected" ? `<div class="banner info"><span>The station closed this online complaint. You can visit the station or call 112 if you need help.</span></div>` : ""}
        ${(c.messages || []).length ? `<div class="stack" style="gap:8px"><h3>Messages</h3>${c.messages.map((m) => `<div class="msg ${m.from}"><div class="by">${m.from === "police" ? h(c.station) : "You"} · ${h(fmtDT(m.at))}</div><div data-notr>${h(m.text)}</div></div>`).join("")}</div>` : ""}
        ${c.status === "info" ? `<div class="stack" style="gap:8px"><label class="lbl" for="rp-${c.id}">Your reply to the police</label><textarea id="rp-${c.id}" class="textarea" placeholder="Answer the questions above"></textarea><div class="row"><button class="btn primary" data-act="cReply" data-id="${c.id}">Send reply</button></div></div>` : ""}
        <div class="stack" style="gap:6px"><h3>Status history</h3><div class="tl">${(c.history || []).slice().reverse().map((x) => `<div class="tli done"><span class="o">${ICON.check}</span><div><b>${h(x.text)}</b><span>${h(fmtDT(x.at))}</span></div><span></span></div>`).join("")}</div></div>
      </div>` : ""}</section>`;
  }).join("")}</div>`;
}
function vCitizen() {
  const unread = C.filter((c) => c.phone === SESSION.phone && c.citizenUnread).length;
  return `<div class="cit">
    <header class="cit-top"><div class="brand" style="padding:0"><div class="brand-badge">${badgeSVG(46)}</div><div><div class="brand-name">JANARAKSHA <span>AI</span></div><div class="brand-sub">Citizen portal · Kalaburagi</div></div></div>
      <span class="spacer"></span>${langToggle()}<span class="cit-user">${ICON.user}<span class="mono">+91 ${h(SESSION.phone)}</span></span><button class="btn sm" data-act="logout">Log out</button>${demoLogoSVG(46)}</header>
    <nav class="cit-tabs"><a href="#file-complaint" class="${ui.page === "file-complaint" ? "on" : ""}">${ICON.entry}File a complaint</a><a href="#my-complaints" class="${ui.page === "my-complaints" ? "on" : ""}">${ICON.doc}My complaints${unread ? `<span class="count">${unread}</span>` : ""}</a></nav>
    <main class="cit-main" id="page">${pageHTML()}</main>
    <footer class="cit-foot">Prototype. Fictional data only. Your data stays in this browser. In an emergency call 112.</footer>
  </div>`;
}

/* ---------- Officer side: online complaints ---------- */
const cUnread = () => (isCP() ? [] : C.filter((c) => c.adminUnread && (!SESSION || SESSION.station === "all" || c.station === SESSION.station)));
function cAutoChecks(c) {
  const r = idCheck(c.idp.type, c.idp.number, c.person.name);
  const out = [{ ok: true, text: "Mobile number confirmed by OTP when filing" }];
  out.push({ ok: r.ok, text: r.ok ? `${idTypeOf(c.idp.type).label} number passes the format check${c.idp.type === "aadhaar" ? " and check digit" : ""}` : `${idTypeOf(c.idp.type).label} number fails the format check` });
  r.checks.filter((x) => x.warn).forEach((x) => out.push({ ok: x.ok, warn: !x.ok, text: x.text }));
  const nm = namesMatch(c.person.name, c.idp.nameOnId);
  out.push({ ok: nm !== false, warn: nm === false, text: nm === false ? "Name on the ID differs from the name given" : "Name on the ID matches the name given" });
  out.push({ ok: !!c.idp.photo, warn: !c.idp.photo, text: c.idp.photo ? "ID card photo attached" : "No ID card photo. Call the person to confirm." });
  out.push({ ok: !!c.person.photo, warn: !c.person.photo, text: c.person.photo ? "Complainant photo attached. Compare it with the ID card." : "No complainant photo. Confirm the person by a call or at the station." });
  const pinOk = /^585\d{3}$/.test(c.addr.pin);
  out.push({ ok: pinOk, warn: !pinOk, text: pinOk ? "PIN code is in Kalaburagi district" : "PIN code is outside Kalaburagi district" });
  out.push({ ok: (c.incident.description || "").length >= 80, warn: (c.incident.description || "").length < 80, text: (c.incident.description || "").length >= 80 ? "Complaint text has enough detail" : "Complaint text is short" });
  return out;
}
const VCHECKS = [["identity", "I compared the ID card with the details given"], ["phone", "I called the complainant and confirmed the details"], ["address", "The address is complete"], ["details", "The complaint details are clear"], ["station", "The complaint belongs to this station"]];
function vComplaints() {
  const st = ui.cStation || (SESSION && SESSION.station) || "all";
  const q = (ui.cq || "").trim().toLowerCase();
  const tab = ui.cTab || "open";
  let list = C.filter((c) => st === "all" || c.station === st);
  const counts = { open: 0, submitted: 0, review: 0, info: 0, verified: 0, rejected: 0 };
  list.forEach((c) => { counts[c.status]++; if (["submitted", "review", "info"].includes(c.status)) counts.open++; });
  list = list.filter((c) => (tab === "open" ? ["submitted", "review", "info"].includes(c.status) : tab === "all" ? true : c.status === tab));
  if (q) list = list.filter((c) => [c.id, c.person.name, c.phone, c.incident.place, c.incident.description, c.station].join(" ").toLowerCase().includes(q));
  list.sort((a, b) => (b.adminUnread - a.adminUnread) || b.updatedAt.localeCompare(a.updatedAt));
  const sel = ui.cid && getC(ui.cid) ? getC(ui.cid) : null;
  return `${intro()}
  <div class="row"><div class="tabs" role="tablist" style="flex:1;min-width:280px">${[["open", "Open"], ["submitted", "New"], ["info", "Info needed"], ["verified", "Registered"], ["rejected", "Not accepted"], ["all", "All"]].map(([k, t]) => `<button role="tab" aria-selected="${tab === k}" class="${tab === k ? "on" : ""}" data-act="cTab" data-id="${k}">${t} (${k === "all" ? C.filter((c) => st === "all" || c.station === st).length : counts[k]})</button>`).join("")}</div>
    <label class="sr" for="cStation">Station</label><select id="cStation" class="select" style="width:auto;max-width:300px" data-bind="cStation"><option value="all">All stations</option>${STATIONS.map((g) => `<optgroup label="${h(g.group)}">${g.list.map((s) => `<option value="${h(s)}" ${st === s ? "selected" : ""}>${h(s)}</option>`).join("")}</optgroup>`).join("")}</select>
    <label class="sr" for="cq">Search complaints</label><input id="cq" class="input" style="width:220px" placeholder="Search name, number, place" data-bind="cq" value="${h(ui.cq || "")}" /></div>
  <div class="split-l">
    <div class="stack" style="gap:8px" id="clist">${list.length ? list.map((c) => `<button class="ci ${sel && sel.id === c.id ? "on" : ""} ${c.adminUnread ? "unread" : ""}" data-act="openComplaint" data-id="${c.id}">
        <span class="row" style="gap:6px">${c.adminUnread ? `<span class="dotnew" title="New"></span>` : ""}<span class="mono small" style="font-weight:600">${h(c.id)}</span><span class="spacer"></span>${c.esc && (c.esc.instructions || []).length && !((c.esc.responses || []).slice(-1)[0] || {}).at ? `<span class="chip warn plain">Instruction</span>` : ""}${cChip(c)}</span>
        <b data-notr>${h(c.person.name)}</b><span class="small">${h(catOf(c.incident.category).label)}</span>
        <span class="muted tiny">${h(c.station)} · ${h(ago(c.createdAt))}</span></button>`).join("") : `<div class="card empty">No complaints here.</div>`}</div>
    <div>${sel ? vComplaintDetail(sel) : `<section class="card empty" style="padding:50px 20px">${ICON.inbox.replace("<svg", '<svg style="width:40px;height:40px;color:var(--accent)"')}<p style="margin-top:10px"><b>Choose a complaint to verify.</b></p><p class="small">New complaints have a dot. Opening one starts verification.</p></section>`}</div>
  </div>`;
}
function vComplaintDetail(c) {
  const P = c.person, I = c.idp, A = c.addr, N = c.incident;
  const revealed = ui.revealed && ui.revealed[c.id];
  const row = (k, v, notr) => `<div class="rv"><span class="k">${k}</span><span class="v" ${notr === false ? "" : "data-notr"}>${v}</span></div>`;
  const auto = cAutoChecks(c);
  const vc = c.vcheck || {};
  const allChecked = VCHECKS.every(([k]) => vc[k]);
  const closed = ["verified", "rejected"].includes(c.status);
  return `<div class="stack">
  ${c.status !== "verified" ? escInsHTML(c, "cmp:" + c.id) : ""}
  <section class="card"><div class="card-h"><div style="flex:1;min-width:0"><div class="eyebrow">Online complaint</div><h2 class="mono">${h(c.id)}</h2></div>${cChip(c)}</div>
    <div class="card-b row small muted" style="gap:14px"><span>Submitted ${h(fmtDT(c.createdAt))}</span><span>${h(c.station)}</span><button class="linkbtn small" data-act="cPrintAck" data-id="${h(c.id)}">Print citizen acknowledgment</button>${c.assignedTo ? `<span>Officer: <span data-notr>${h(whoName(c.officer || c.assignedTo))}</span></span>` : ""}${c.fir ? `<span class="chip ok plain">FIR No. <span class="mono" data-notr>${h(c.fir)}</span></span>` : ""}${c.recordId && getRec(c.recordId) ? `<span>Record: ${recLink(c.recordId)}</span>` : ""}</div></section>
  ${vProgressCard(c.id)}
  <section class="card"><div class="card-h"><h3>Connected cases</h3><span class="muted small">Same person, mobile number, place or accused name</span></div><div class="card-b">${connHTML(connOf(c.id), 6)}</div></section>
  <div class="grid g2" style="align-items:start">
    <div class="stack">
      <section class="card"><div class="card-h"><h3>Complainant</h3></div><div class="card-b">
        <div class="cwho"><div class="selfie">${P.photo ? (MEDIA[P.photo] ? `<img src="${MEDIA[P.photo]}" alt="Photo of the complainant" data-act="viewMedia" data-id="${P.photo}" />` : `<div class="selfie-ph"><span>Loading…</span></div>`) : `<div class="selfie-ph">${ICON.camera}<span>No photo</span></div>`}</div>
          <div class="stack" style="gap:4px;min-width:0"><div class="lbl">Photo of the complainant</div><b data-notr>${h(P.name)}</b><span class="help">${P.photo ? "Compare this photo with the ID card photo." : "No complainant photo. Confirm the person by a call or at the station."}</span></div></div><div>
        ${c.filing.as === "other" ? row("Filing for", h(`${c.filing.otherName} (${c.filing.relation})`)) : row("Filing for", "Self", false)}
        ${row("Name", h(P.name))}${P.father ? row("Father or husband", h(P.father)) : ""}${row("Gender and age", h(`${P.gender}, ${P.age}`), false)}
        ${row("Mobile", `<span class="mono">+91 ${h(c.phone)}</span> <span class="chip ok">OTP verified</span>`, false)}${P.altPhone ? row("Other phone", `<span class="mono">${h(P.altPhone)}</span>`) : ""}${P.email ? row("Email", h(P.email)) : ""}${P.occupation ? row("Occupation", h(P.occupation)) : ""}
      </div></div></section>
      <section class="card"><div class="card-h"><h3>ID proof</h3><span class="chip plain">${h(idTypeOf(I.type).label)}</span></div><div class="card-b stack" style="gap:8px">
        ${row("ID number", `<span class="mono">${h(revealed ? I.number : maskId(I.type, I.number))}</span> ${can("verify") ? `<button class="linkbtn small" data-act="cReveal" data-id="${c.id}">${revealed ? "Hide" : "Show full number"}</button>` : ""}`, false)}
        ${row("Name on ID", h(I.nameOnId))}
        ${I.photo ? (MEDIA[I.photo] ? `<img class="idphoto" src="${MEDIA[I.photo]}" alt="ID card photo" data-act="viewMedia" data-id="${I.photo}" />` : `<div class="ph-miss">Loading the ID photo…</div>`) : `<div class="ph-miss">No ID card photo was attached.</div>`}
        ${revealed ? `<p class="help">Full number view was recorded in the audit trail.</p>` : ""}
      </div></section>
      <section class="card"><div class="card-h"><h3>Address</h3></div><div class="card-b">${row("Address", h([A.house, A.street, A.village].filter(Boolean).join(", ")))}${row("Taluk and district", h(`${A.taluk}, ${A.district}`))}${row("State", h(A.state))}${row("PIN code", `<span class="mono">${h(A.pin)}</span>`)}</div></section>
    </div>
    <div class="stack">
      <section class="card"><div class="card-h"><h3>Complaint</h3><span class="chip plain">${h(catOf(N.category).label)}</span></div><div class="card-b stack" style="gap:6px">
        ${row("Date and time", h(`${fmtDate(N.date)}${N.time ? ", " + N.time : ""}`), false)}${row("Place", h(N.place))}
        <p class="rvtext" data-notr>${h(N.description)}</p>
        ${N.involved ? row("Persons involved", h(N.involved)) : ""}${N.property ? row("Property", h(`${N.property}${N.value ? " (Rs " + N.value + ")" : ""}`)) : ""}${N.witnesses ? row("Witnesses", h(N.witnesses)) : ""}
        ${(() => { const sg = lawSuggest(N.description, catOf(N.category).type, N.category).filter((l) => l.sec); return sg.length ? `<div class="stack" style="gap:4px"><span class="lbl">Sections that may apply (reference)</span><div class="law-chips">${sg.slice(0, 4).map((l) => `<span class="law-chip"><span>${h(lawName(l))}</span> <b class="mono" data-notr>${h(lawSec(l))}</b></span>`).join("")}</div></div>` : ""; })()}
        ${(N.photos || []).length ? `<div class="photos">${N.photos.map((p, i) => MEDIA[p] ? `<figure class="ph"><img src="${MEDIA[p]}" alt="Evidence ${i + 1}" data-act="viewMedia" data-id="${p}" /></figure>` : `<div class="ph-miss">Loading…</div>`).join("")}</div>` : `<span class="muted small">No evidence photos.</span>`}
      </div></section>
      <section class="card"><div class="card-h"><h3>Messages and history</h3></div><div class="card-b stack" style="gap:8px">
        ${(c.messages || []).map((m) => `<div class="msg ${m.from}"><div class="by">${m.from === "police" ? `<span data-notr>${h(whoName(m.by))}</span>` : "Citizen"} · ${h(fmtDT(m.at))}</div><div data-notr>${h(m.text)}</div></div>`).join("") || `<span class="muted small">No messages yet.</span>`}
        <div class="tl">${(c.history || []).slice().reverse().map((x) => `<div class="tli done"><span class="o">${ICON.check}</span><div><b>${h(x.text)}</b><span>${x.by === "citizen" ? "Citizen" : `<span data-notr>${h(whoName(x.by))}</span>`} · ${h(fmtDT(x.at))}</span></div><span></span></div>`).join("")}</div>
      </div></section>
    </div>
  </div>
  <section class="card vpanel"><div class="card-h"><h2>Verify the complaint</h2>${closed ? cChip(c) : ""}</div><div class="card-b stack">
    <div><div class="lbl" style="margin-bottom:6px">Automatic checks</div><div class="idchk">${auto.map((x) => `<div class="${x.ok ? "ok" : x.warn ? "warn" : "bad"}"><span>${x.ok ? "✓" : "!"}</span>${h(x.text)}</div>`).join("")}</div>
      <p class="help">Automatic checks look at format only. They do not confirm the ID with UIDAI or the Income Tax department.</p></div>
    ${closed ? `${c.status === "verified" ? `<div class="banner accent"><span><span>Verified and registered</span>${c.fir ? ` · <span>FIR No.</span> <b class="mono" data-notr>${h(c.fir)}</b>` : ""} · <span data-notr>${h(whoName(c.verifiedBy))}</span> · ${h(fmtDT(c.verifiedAt))}</span></div>` : `<div class="banner info"><span>Not accepted by <span data-notr>${h(whoName(c.closedBy))}</span>: <span data-notr>${h(c.closeReason || "")}</span></span></div>`}` : `
    <div><div class="lbl" style="margin-bottom:6px">Officer checklist</div><div class="stack" style="gap:6px">${VCHECKS.map(([k, t]) => `<label class="cbx"><input type="checkbox" data-bind="vcheck" data-id="${c.id}" data-k="${k}" ${vc[k] ? "checked" : ""} /><span>${t}</span></label>`).join("")}</div></div>
    <div class="field"><label for="cNote">Call-back number</label><div class="row"><span class="mono">+91 ${h(c.phone)}</span><a class="btn sm" href="tel:+91${h(c.phone)}">Call</a></div></div>
    ${can("verify") ? `<div class="stack sigbox"><div class="lbl">Signature of verifying officer: ${h(me().name)}</div>${padHTML("cverify", "Signature pad for the verifying officer")}<div class="row tiny"><span class="muted">${ui.cSign ? "Signed." : "Sign to enable Verify and register."}</span><span class="spacer"></span><button class="btn sm ghost" data-act="clearPad" data-pad="cverify">Clear</button></div></div>` : ""}
    <div class="row">
      ${can("verify") ? `<button class="btn ok" data-act="cVerify" data-id="${c.id}" ${allChecked && ui.cSign ? "" : "disabled"}>${ICON.check}Verify and register</button>` : `<button class="btn" disabled title="Only SI or SHO can do this">${ICON.lock}Verify and register</button>`}
      <button class="btn" data-act="cAskInfo" data-id="${c.id}">Ask for more information</button>
      <button class="btn" data-act="cTransfer" data-id="${c.id}">Move to another station</button>
      ${can("caseStatus") ? `<button class="btn danger" data-act="cReject" data-id="${c.id}">Not accepted</button>` : ""}
    </div>
    ${!allChecked ? `<p class="help">Tick all five checklist items to verify. ${can("verify") ? "" : "Only an SI or SHO can register the complaint."}</p>` : ""}
    <p class="help">Verifying creates a trusted record from this complaint. It is then searched and compared with other records.</p>`}
  </div></section></div>`;
}

/* ---------- Register a verified complaint as a record ---------- */
function complaintToRecord(c, sign) {
  const N = c.incident;
  const people = [{ name: c.person.name, role: "Complainant", contact: prettyPhone(c.phone) }];
  if (c.filing.as === "other" && c.filing.otherName) people.push({ name: c.filing.otherName, role: "Victim" });
  const text = [N.description, N.property, N.involved].filter(Boolean).join(" \n ");
  const ids = findIdsInText(text).filter((x) => !(x.kind === "phone" && normId("phone", x.value) === c.phone)).map((x) => ({ kind: x.kind, value: x.value, context: x.kind === "phone" && /call/i.test(N.description) ? "Caller number" : "From online complaint" }));
  const summary = N.description + (N.involved ? ` Persons involved (as reported): ${N.involved}.` : "") + (N.property ? ` Property: ${N.property}${N.value ? " (about Rs " + N.value + ")" : ""}.` : "");
  return {
    id: c.id, type: catOf(N.category).type, category: "case", title: catOf(N.category).label, date: N.date, time: N.time, location: N.place, summary,
    people, identifiers: ids, docIds: [], photos: (c.person.photo ? [{ id: c.person.photo, caption: "Photo of the complainant", at: c.createdAt, by: "u-clerk" }] : []).concat((N.photos || []).map((p) => ({ id: p, caption: "Evidence from the complainant", at: c.createdAt, by: "u-clerk" }))),
    sign: sign ? { verifier: sign } : {}, caseStatus: "Active", source: "online", status: "verified", station: c.station,
    idProof: { type: c.idp.type, masked: maskId(c.idp.type, c.idp.number) },
    createdBy: S.userId, createdAt: nowISO(), submittedAt: c.createdAt, verifiedBy: S.userId, verifiedAt: nowISO(),
  };
}

/* ---------- Live updates between tabs ---------- */
function onComplaintsChanged() {
  const before = new Map(C.map((c) => [c.id, c]));
  const now = loadComplaints() || C;
  C = now;
  if (isAdmin()) {
    const fresh = now.filter((c) => c.adminUnread && (!before.has(c.id) || !before.get(c.id).adminUnread || before.get(c.id).updatedAt !== c.updatedAt) && (SESSION.station === "all" || c.station === SESSION.station));
    fresh.forEach((c) => {
      const isNew = !before.has(c.id);
      logComplaintReceived(c);
      toast(isNew ? `New complaint registered: ${c.id} · ${catOf(c.incident.category).label} · ${c.station}` : `Citizen sent more information: ${c.id}`, "", () => openComplaintById(c.id), "Verify");
    });
    if (fresh.length) save();
  }
  if (isCitizen()) {
    now.filter((c) => { const b = before.get(c.id); return c.phone === SESSION.phone && b && (b.status !== c.status || (b.messages || []).length !== (c.messages || []).length) && c.citizenUnread; }).forEach((c) => toast(`Update on ${c.id}: ${C_STATUS[c.status][0]}`, "", () => { ui.cOpen = c.id; go("my-complaints"); }, "Open"));
  }
  updateTitle();
  render();
}
function logComplaintReceived(c) {
  S.cSeen = S.cSeen || [];
  if (S.cSeen.includes(c.id)) return;
  S.cSeen.push(c.id);
  logSys("Online complaint received", c.id, `${c.person.name} · ${catOf(c.incident.category).label} · ${c.station}`);
}
function updateTitle() {
  const n = isAdmin() ? bellCount() : isCitizen() ? C.filter((c) => c.phone === SESSION.phone && c.citizenUnread).length : 0;
  document.title = (n ? `(${n}) ` : "") + "JanaRaksha AI";
}
function openComplaintById(id) {
  const c = getC(id); if (!c) return;
  ui.cid = id; ui.cSign = null; ui.bell = false;
  if (c.adminUnread) c.adminUnread = false;
  if (c.status === "submitted") { c.status = "review"; c.assignedTo = S.userId; cHist(c, S.userId, "opened", "Verification started"); c.citizenUnread = true; log("Online complaint opened", c.id, "Verification started by " + me().name); save(); }
  saveComplaint(c);
  if (ui.page !== "complaints") go("complaints"); else render();
  updateTitle();
}

/* ---------- Bell panel ---------- */
function vBell() {
  const items = C.filter((c) => c.adminUnread || (c.history || []).length).filter((c) => SESSION.station === "all" || c.station === SESSION.station).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 8);
  return `<div class="bell-scrim" data-act="closeBell" data-self="1"><div class="bellp" role="dialog" aria-label="Notifications">
    <div class="row" style="padding:12px 14px;border-bottom:1px solid var(--line)"><b style="flex:1">Notifications</b>${bellCount() ? `<button class="linkbtn small" data-act="bellReadAll">Mark all as read</button>` : ""}</div>
    ${escBellItems()}
    ${items.length ? items.map((c) => { const last = (c.history || [])[c.history.length - 1] || {}; const reply = last.kind === "citizen_reply"; return `<button class="bi ${c.adminUnread ? "unread" : ""}" data-act="openComplaint" data-id="${c.id}"><span class="d"></span><span style="min-width:0"><b>${c.adminUnread ? (reply ? "Citizen sent more information" : "New complaint registered") : h(C_STATUS[c.status][0])}</b><span class="small"><span class="mono">${h(c.id)}</span> · <span data-notr>${h(c.person.name)}</span></span><span class="tiny muted">${h(c.station)} · ${h(ago(c.updatedAt))}</span></span></button>`; }).join("") : `<div class="empty">No notifications.</div>`}
    <div style="padding:10px 14px;border-top:1px solid var(--line)"><a class="btn sm" href="#complaints" data-act="closeBell">Open all online complaints</a></div></div></div>`;
}

/* ---------- Actions ---------- */
const PACT = {
  alPhase(el) { ui.alPhase = el.dataset.id; ui.gwErr = ""; ui.alId = ""; render(); setTimeout(() => { const i = $("#al-id"); if (i) i.focus(); }, 0); },
  gwCitizen() { ui.gw = "citizen"; ui.gwErr = ""; ui.otp = null; render(); setTimeout(() => { const i = $("#cl-phone"); if (i) i.focus(); }, 0); },
  gwAdmin() { ui.gw = "admin"; ui.gwErr = ""; render(); setTimeout(() => { const i = $("#al-id"); if (i) i.focus(); }, 0); },
  gwBack() { ui.gw = "choose"; ui.gwErr = ""; ui.otp = null; render(); },
  otpReset() { ui.otp = null; ui.gwErr = ""; render(); },
  fillOfficer(el) { ui.alId = el.dataset.id; render(); const p = $("#al-pw"); if (p) { p.value = DEMO_PASSWORD; p.focus(); } },
  logout() {
    if (isAdmin()) log("Officer logout", "", me().name + " signed out");
    if (isAdmin()) save();
    setSession(null); ui.toasts = []; renderToasts(); ui.gw = "choose"; ui.otp = null; ui.cid = null; ui.cAck = null; ui.drawer = null; ui.modal = null; ui.bell = false; ui.rk = { open: false, q: "", msgs: [] }; ui.cpSel = null;
    history.replaceState(null, "", location.pathname + location.search);
    route(); updateTitle();
  },
  toggleBell() { ui.bell = !ui.bell; renderOverlays(); },
  closeBell(el, e) { if (el.dataset.self && e.target !== el) return; ui.bell = false; renderOverlays(); },
  bellReadAll() { cUnread().forEach((c) => { c.adminUnread = false; saveComplaint(c); }); escMyUnread().forEach((n) => (n.read = true)); save(); ui.bell = false; render(); updateTitle(); },
  openComplaint(el) { openComplaintById(el.dataset.id); },
  cTab(el) { ui.cTab = el.dataset.id; renderPage(); },
  cReveal(el) {
    if (!can("verify")) return;
    ui.revealed = ui.revealed || {};
    const id = el.dataset.id;
    if (!ui.revealed[id]) { ui.revealed[id] = true; log("ID number viewed", id, `${me().name} viewed the full ${idTypeOf(getC(id).idp.type).label} number`); save(); }
    else delete ui.revealed[id];
    renderPage();
  },
  cVerify(el) {
    const c = getC(el.dataset.id); if (!c || !can("verify") || !ui.cSign) return;
    if (!VCHECKS.every(([k]) => (c.vcheck || {})[k])) { toast("Tick all five checklist items first.", "warn"); return; }
    const sid = newMediaId("SIG"); mediaPut(sid, ui.cSign);
    const sign = { id: sid, at: nowISO(), userId: S.userId };
    const r = complaintToRecord(c, sign);
    const fir = FIR_TYPES.includes(r.type) ? c.fir || nextFir(c.station) : "";
    Object.assign(r, { fir, stage: "verified", officer: S.userId });
    if (getRec(r.id)) Object.assign(getRec(r.id), r); else S.records.push(r);
    c.status = "verified"; c.recordId = r.id; c.verifiedBy = S.userId; c.verifiedAt = r.verifiedAt; c.citizenUnread = true; c.adminUnread = false; c.fir = fir; c.stage = "verified"; c.officer = S.userId;
    c.messages = c.messages || []; c.messages.push({ at: nowISO(), from: "police", by: S.userId, text: fir ? `Your complaint is verified and registered. FIR No. ${fir}, ${c.station}. Officer: ${me().name}.` : `Your complaint is verified and registered as ${r.id}. Officer: ${me().name}.` });
    cHist(c, S.userId, "verified", "Verified and registered");
    log("Online complaint verified", c.id, `Registered${fir ? " as FIR No. " + fir : ""} by ${me().name}`);
    log("Officer signed", c.id, `Verification signature of ${me().name}`);
    const added = computeLinks();
    ui.cSign = null;
    saveComplaint(c); save(); render();
    toast(`${c.id} verified and registered.${added.length ? ` ${added.length} possible link${added.length > 1 ? "s" : ""} found.` : ""}`, "", added.length ? () => { ui.linkKey = added[0].key; ui.linkTab = "suggested"; go("connections"); } : () => { ui.drawer = r.id; renderOverlays(); }, added.length ? "Review links" : "Open record");
  },
  cAskInfo(el) {
    const c = getC(el.dataset.id);
    openModal("Ask for more information", `<p class="small">The citizen sees this message under My complaints and can reply.</p><div class="field"><label for="askText">Message to the citizen</label><textarea id="askText" class="textarea" placeholder="for example Please share the bus number and the colour of the bag."></textarea></div>`, [{ label: "Cancel", act: "closeModal" }, { label: "Send message", act: "cAskSend", cls: "primary", data: `data-id="${c.id}"` }]);
    setTimeout(() => { const t = $("#askText"); if (t) t.focus(); }, 0);
  },
  cAskSend(el) {
    const c = getC(el.dataset.id); const t = ($("#askText").value || "").trim();
    if (t.length < 5) { toast("Write the message first.", "warn"); return; }
    c.status = "info"; c.messages = c.messages || []; c.messages.push({ at: nowISO(), from: "police", by: S.userId, text: t }); c.citizenUnread = true;
    cHist(c, S.userId, "info", "More information requested");
    log("More information requested", c.id, t);
    ui.modal = null; saveComplaint(c); save(); render(); toast("Message sent to the citizen.");
  },
  cTransfer(el) {
    const c = getC(el.dataset.id);
    openModal("Move to another station", `<div class="field"><label for="trSt">New police station</label><select id="trSt" class="select">${STATIONS.map((g) => `<optgroup label="${h(g.group)}">${g.list.filter((s) => s !== c.station).map((s) => `<option value="${h(s)}">${h(s)}</option>`).join("")}</optgroup>`).join("")}</select></div><div class="field"><label for="trWhy">Reason</label><input id="trWhy" class="input" placeholder="for example Place of incident is in Aland taluk" /></div>`, [{ label: "Cancel", act: "closeModal" }, { label: "Move complaint", act: "cTransferDo", cls: "primary", data: `data-id="${c.id}"` }]);
  },
  cTransferDo(el) {
    const c = getC(el.dataset.id); const ns = $("#trSt").value; const why = ($("#trWhy").value || "").trim();
    if (!why) { toast("Type the reason.", "warn"); $("#trWhy").focus(); return; }
    const old = c.station; c.station = ns; c.adminUnread = true; c.citizenUnread = true; c.vcheck = {};
    cHist(c, S.userId, "transfer", `Moved from ${old} to ${ns}`);
    c.messages = c.messages || []; c.messages.push({ at: nowISO(), from: "police", by: S.userId, text: `Your complaint was moved to ${ns}. Reason: ${why}` });
    log("Online complaint moved", c.id, `${old} to ${ns}: ${why}`);
    ui.modal = null; saveComplaint(c); save(); render(); toast(`Moved to ${ns}.`);
  },
  cReject(el) {
    const c = getC(el.dataset.id);
    openModal("Close as not accepted", `<div class="banner warn small"><span>A complaint about a cognizable offence must be registered. Use this only for duplicate, test or non-police matters.</span></div>
      <div class="field"><label for="rjWhy">Reason</label><select id="rjWhy" class="select"><option value="Duplicate of another complaint">Duplicate of another complaint</option><option value="Test or incomplete entry">Test or incomplete entry</option><option value="Not a police matter">Not a police matter</option><option value="Other">Other</option></select></div>
      <div class="field"><label for="rjNote">Note to the citizen</label><textarea id="rjNote" class="textarea" placeholder="Explain the reason and what the person can do next."></textarea></div>`, [{ label: "Cancel", act: "closeModal" }, { label: "Close complaint", act: "cRejectDo", cls: "primary", data: `data-id="${c.id}"` }]);
  },
  cRejectDo(el) {
    const c = getC(el.dataset.id); const why = $("#rjWhy").value; const note = ($("#rjNote").value || "").trim();
    if (note.length < 5) { toast("Write a note to the citizen.", "warn"); $("#rjNote").focus(); return; }
    c.status = "rejected"; c.closedBy = S.userId; c.closeReason = why; c.citizenUnread = true; c.adminUnread = false;
    c.messages = c.messages || []; c.messages.push({ at: nowISO(), from: "police", by: S.userId, text: note });
    cHist(c, S.userId, "rejected", "Closed: " + why);
    log("Online complaint not accepted", c.id, `${why}. ${note}`);
    ui.modal = null; saveComplaint(c); save(); render(); toast("Complaint closed. The citizen sees your note.");
  },

  /* citizen */
  cfSet(el) {
    CF[el.dataset.f] = el.dataset.v;
    if (el.dataset.f === "idType") { CF.idNumber = ""; }
    saveCForm(); if (ui.cShowErr) ui.cErr = cErrors(ui.cstep); renderPage();
  },
  cNext() {
    const e = cErrors(ui.cstep);
    if (Object.keys(e).length) { ui.cErr = e; ui.cShowErr = true; renderPage(); const f = $(".flag") || $(".err"); if (f) { f.scrollIntoView({ block: "center", behavior: "smooth" }); if (f.focus) f.focus({ preventScroll: true }); } return; }
    ui.cShowErr = false; ui.cErr = null; ui.cstep = Math.min(6, ui.cstep + 1); saveCForm(); renderPage(); window.scrollTo(0, 0);
  },
  cBack() { ui.cShowErr = false; ui.cErr = null; ui.cstep = Math.max(1, ui.cstep - 1); saveCForm(); renderPage(); window.scrollTo(0, 0); },
  cGo(el) { ui.cShowErr = false; ui.cErr = null; ui.cstep = +el.dataset.step; saveCForm(); renderPage(); window.scrollTo(0, 0); },
  cfClearSelfie() { CF.selfie = ""; saveCForm(); renderPage(); },
  cfClearIdPhoto() { CF.idPhoto = ""; saveCForm(); renderPage(); },
  cfDelPhoto(el) { CF.photos.splice(+el.dataset.i, 1); saveCForm(); renderPage(); },
  cSample() {
    const a = sampleAadhaar();
    Object.assign(CF, { filingAs: "self", otherName: "", relation: "", name: "Sharanappa Patil", father: "Mallappa Patil", gender: "Male", age: "34", email: "", occupation: "Auto-rickshaw driver", altPhone: "",
      idType: "aadhaar", idNumber: a.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3"), nameOnId: "Sharanappa M Patil",
      house: "5-2-31", street: "Mominpura, near water tank", village: "Kalaburagi", taluk: "Kalaburagi", district: "Kalaburagi", state: "Karnataka", pin: "585104",
      category: "theft", date: addDays(todayIST(), -1), time: "20:30", place: "Ram Mandir Circle, Kalaburagi",
      description: "I was standing near Ram Mandir Circle at about 8:30 pm and talking on my phone. Two persons on a motorcycle came close and the pillion rider pulled the phone from my hand. They went towards Super Market. I noted the number plate as KA 00 DM 4471.",
      involved: "Two young men on a black motorcycle", property: "Mobile phone, IMEI 350000005550001", value: "14000", witnesses: "Tea stall owner near the circle", station: "Station Bazaar Police Station" });
    const id = newMediaId("IDP"); mediaPut(id, sampleIdCard(CF.name, "Aadhaar Card", maskId("aadhaar", a))); CF.idPhoto = id;
    const sf = newMediaId("SLF"); mediaPut(sf, samplePortrait(CF.name)); CF.selfie = sf;
    ui.cstep = 6; saveCForm(); ui.cShowErr = false; renderPage(); window.scrollTo(0, 0); toast("Sample data filled. It is fictional. Review it, tick the declaration and submit.");
  },
  cSubmit() {
    const all = [1, 2, 3, 4, 5, 6].map((s) => [s, cErrors(s)]).find(([, e]) => Object.keys(e).length);
    if (all) { ui.cstep = all[0]; ui.cErr = all[1]; ui.cShowErr = true; renderPage(); toast("Some details are missing. Please check this step.", "warn"); return; }
    const F = CF;
    const c = {
      id: nextComplaintId(), createdAt: nowISO(), updatedAt: nowISO(), phone: SESSION.phone, status: "submitted",
      filing: { as: F.filingAs, otherName: F.otherName.trim(), relation: F.relation },
      person: { name: F.name.trim(), father: F.father.trim(), gender: F.gender, age: F.age, email: F.email.trim(), occupation: F.occupation.trim(), altPhone: F.altPhone.trim(), photo: F.selfie || "" },
      idp: { type: F.idType, number: normIdNo(F.idType, F.idNumber), nameOnId: F.nameOnId.trim(), photo: F.idPhoto || "" },
      addr: { house: F.house.trim(), street: F.street.trim(), village: F.village.trim(), taluk: F.taluk, district: F.district.trim(), state: F.state.trim(), pin: F.pin },
      incident: { category: F.category, date: F.date, time: F.time, place: F.place.trim(), description: F.description.trim(), involved: F.involved.trim(), property: F.property.trim(), value: F.value.replace(/[, ]/g, ""), witnesses: F.witnesses.trim(), photos: F.photos.slice() },
      station: F.station, assignedTo: "", adminUnread: true, citizenUnread: false, vcheck: {}, messages: [],
      history: [{ at: nowISO(), by: "citizen", kind: "submitted", text: "Complaint submitted online" }],
    };
    saveComplaint(c);
    CF = blankForm(); ui.cstep = 1; try { localStorage.removeItem(citizenDraftKey()); } catch (e) {}
    ui.cAck = c.id; renderPage(); window.scrollTo(0, 0);
  },
  cNew() { ui.cAck = null; ui.cstep = 1; renderPage(); },
  cToggle(el) { ui.cOpen = ui.cOpen === el.dataset.id ? null : el.dataset.id; renderPage(); },
  cReply(el) {
    const c = getC(el.dataset.id); const t = ($("#rp-" + CSS.escape(c.id)).value || "").trim();
    if (t.length < 3) { toast("Write your reply first.", "warn"); return; }
    c.messages = c.messages || []; c.messages.push({ at: nowISO(), from: "citizen", text: t });
    c.status = "review"; c.adminUnread = true; c.citizenUnread = false;
    cHist(c, "citizen", "citizen_reply", "Citizen sent more information");
    saveComplaint(c); renderPage(); toast("Reply sent to the police station.");
  },
};
const PBIND = {
  cf(el) {
    CF[el.dataset.f] = el.value; saveCForm();
    if (ui.cShowErr) { ui.cErr = cErrors(ui.cstep); }
    if (["idNumber", "name"].includes(el.dataset.f)) { const b = $("#idcheck"); if (b) paint(b, vIdCheck()); }
    if (el.dataset.f === "description") { const n = $("#cf-desc-n"); if (n) { n.textContent = `${CF.description.trim().length} characters. Write at least 50.`; trDOM(n.parentElement); } const w = $("#law-cit"); if (w) paint(w, vLawCitizen(CF)); }
  },
  cfs(el) { CF[el.dataset.f] = el.value; saveCForm(); if (ui.cShowErr) ui.cErr = cErrors(ui.cstep); renderPage(); },
  cfc(el) { CF[el.dataset.f] = el.checked; saveCForm(); if (ui.cShowErr) { ui.cErr = cErrors(ui.cstep); renderPage(); } },
  async cSelfie(el) { const u = await readImages(el.files, 1, 900); el.value = ""; if (!u.length) return; const id = newMediaId("SLF"); mediaPut(id, u[0]); CF.selfie = id; saveCForm(); renderPage(); },
  async cIdPhoto(el) { const u = await readImages(el.files, 1, 1400); el.value = ""; if (!u.length) return; const id = newMediaId("IDP"); mediaPut(id, u[0]); CF.idPhoto = id; saveCForm(); renderPage(); },
  async cEvidence(el) { const u = await readImages(el.files, 5 - CF.photos.length, 1400); el.value = ""; u.forEach((x) => { const id = newMediaId("EV"); mediaPut(id, x); CF.photos.push(id); }); saveCForm(); renderPage(); },
  cStation(el) { ui.cStation = el.value; ui.cid = null; renderPage(); },
  cq(el) { ui.cq = el.value; const f = captureFocus(); renderPage(); restoreFocus(f); },
  vcheck(el) { const c = getC(el.dataset.id); c.vcheck = c.vcheck || {}; c.vcheck[el.dataset.k] = el.checked; saveComplaint(c); renderPage(); },
};
const PFORMS = {
  citizenLogin(form) {
    if (!ui.otp) {
      const p = ($("#cl-phone").value || "").replace(/\D/g, "");
      ui.clPhone = p;
      if (!/^[6-9]\d{9}$/.test(p)) { ui.gwErr = "Type a 10-digit mobile number that starts with 6, 7, 8 or 9."; render(); $("#cl-phone").focus(); return; }
      ui.gwErr = ""; ui.otp = { phone: p, code: String(Math.floor(100000 + Math.random() * 900000)), at: Date.now() };
      render(); setTimeout(() => { const i = $("#cl-otp"); if (i) i.focus(); }, 0); return;
    }
    const v = ($("#cl-otp").value || "").replace(/\D/g, "");
    if (v !== ui.otp.code) { ui.gwErr = "The OTP is wrong. Check the demo SMS above and try again."; render(); setTimeout(() => { const i = $("#cl-otp"); if (i) i.focus(); }, 0); return; }
    setSession({ kind: "citizen", phone: ui.otp.phone, at: nowISO() });
    ui.otp = null; ui.gwErr = ""; ui.cAck = null; loadCForm();
    const has = C.some((c) => c.phone === SESSION.phone);
    location.hash = has ? "my-complaints" : "file-complaint"; route(); updateTitle();
  },
  adminLogin() {
    const ph = ui.alPhase || "police";
    const id = ($("#al-id").value || "").trim().toUpperCase(); const pw = $("#al-pw").value || "";
    const st = ph === "cp" ? "all" : ($("#al-st") || {}).value || HOME_STATION;
    ui.alId = id; if (ph === "police") ui.alSt = st;
    const uid = Object.keys(OFFICER_IDS).find((k) => OFFICER_IDS[k] === id);
    if (!uid || pw !== DEMO_PASSWORD) { ui.gwErr = "Officer ID or password is wrong."; render(); $("#al-pw").focus(); return; }
    if (ph === "cp" && uid !== "u-cp") { ui.gwErr = "This ID is a station officer ID. Use the Police phase tab."; render(); return; }
    if (ph === "police" && uid === "u-cp") { ui.gwErr = "This is the Commissioner ID. Use the Commissioner phase tab."; render(); return; }
    setSession({ kind: "admin", phase: ph, userId: uid, station: st, at: nowISO() });
    S.userId = uid; ui.gwErr = ""; ui.cStation = st; ui.cid = null; ui.cpSel = null;
    if (ph === "police") S.homeStation = st;
    log(ph === "cp" ? "Commissioner login" : "Officer login", "", ph === "cp" ? `${me().name} signed in to the Commissioner phase (all stations)` : `${me().name} signed in. Station: ${st}`);
    C.forEach((c) => { if (c.adminUnread && (ph === "cp" || c.station === st)) logComplaintReceived(c); });
    save();
    location.hash = ph === "cp" ? "cp" : "overview"; route(); updateTitle();
    const n = cUnread().length;
    if (n) setTimeout(() => toast(`${n} new complaint${n > 1 ? "s" : ""} registered. Please verify.`, "", () => { ui.cTab = "open"; go("complaints"); }, "Verify"), 300);
    escSweep(); render(); setTimeout(escAnnounce, 450);
  },
};
