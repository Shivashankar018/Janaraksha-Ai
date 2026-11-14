/* ===== App: rendering, routing, actions and start-up (this file loads last) ===== */
function captureFocus() {
  const a = document.activeElement;
  if (!a || !a.id) return null;
  return { id: a.id, s: a.selectionStart, e: a.selectionEnd, scroll: a.scrollTop };
}
function restoreFocus(f) {
  if (!f) return;
  const el = document.getElementById(f.id);
  if (!el) return;
  el.focus({ preventScroll: true });
  try { if (f.s != null && el.setSelectionRange) el.setSelectionRange(f.s, f.e); } catch (e) {}
  if (f.scroll) el.scrollTop = f.scroll;
}
function paint(el, html) { if (!el) return; el.innerHTML = html; trDOM(el); initPads(el); }
function render() {
  const f = captureFocus();
  const y = window.scrollY;
  document.documentElement.lang = S.lang === "kn" ? "kn" : "en";
  paint($("#app"), !SESSION ? vGateway() : isCitizen() ? vCitizen() : shell());
  paint($("#overlay"), overlays());
  paintRaksha();
  window.scrollTo(0, y);
  restoreFocus(f);
}
function renderPage() {
  const f = captureFocus();
  paint($("#page"), pageHTML());
  restoreFocus(f);
}
function renderOverlays() { const f = captureFocus(); paint($("#overlay"), overlays()); restoreFocus(f); }

/* ---------- Signature pads ---------- */
function padSrc(kind) {
  if (kind === "verifier") return ui.verifySign;
  if (kind === "cverify") return ui.cSign;
  const m = S.draft && S.draft.sign && S.draft.sign[kind];
  return m ? MEDIA[m.id] : null;
}
function initPads(root) {
  (root || document).querySelectorAll("canvas[data-pad]").forEach((c) => {
    if (c._init) return; c._init = true;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth || 300, hh = c.clientHeight || 140;
    c.width = Math.round(w * dpr); c.height = Math.round(hh * dpr);
    const ctx = c.getContext("2d"); ctx.scale(dpr, dpr);
    ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#3a0a12"; ctx.fillStyle = "#3a0a12";
    const src = padSrc(c.dataset.pad);
    if (src) { const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0, w, hh); img.src = src; c.classList.add("signed"); }
    let drawing = false, last = null, moved = false;
    const pos = (e) => { const r = c.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    c.addEventListener("pointerdown", (e) => { e.preventDefault(); try { c.setPointerCapture(e.pointerId); } catch (x) {} drawing = true; moved = false; last = pos(e); ctx.beginPath(); ctx.arc(last.x, last.y, 1.1, 0, Math.PI * 2); ctx.fill(); });
    c.addEventListener("pointermove", (e) => {
      if (!drawing) return;
      const p = pos(e);
      ctx.lineWidth = e.pointerType === "pen" && e.pressure ? 1 + e.pressure * 2.6 : 2.3;
      ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      last = p; moved = true;
    });
    const end = () => { if (!drawing) return; drawing = false; padSaved(c.dataset.pad, c.toDataURL("image/png")); };
    c.addEventListener("pointerup", end);
    c.addEventListener("pointercancel", end);
  });
}
function mediaInUse(id) { return S.records.some((r) => (r.photos || []).some((p) => p.id === id) || Object.values(r.sign || {}).some((m) => m && m.id === id)); }
function padSaved(kind, url) {
  if (kind === "verifier") { ui.verifySign = url; renderOverlays(); return; }
  if (kind === "cverify") { ui.cSign = url; renderPage(); return; }
  const d = S.draft; const cur = d.sign[kind];
  const id = cur && !mediaInUse(cur.id) ? cur.id : newMediaId("SIG");
  mediaPut(id, url);
  if (kind === "complainant") { const sg = signer(d); d.sign.complainant = { id, at: nowISO(), name: sg ? sg.name : "" }; }
  else d.sign.officer = { id, at: nowISO(), userId: S.userId };
  save(); refreshEntrySide(true);
}
async function toJpeg(dataUrl, max, q) {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => {
      const sc = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas"); c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
      const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL("image/jpeg", q || 0.82));
    };
    img.onerror = () => res(null);
    img.src = dataUrl;
  });
}
async function readImages(files, room, max) {
  const out = [];
  for (const f of [...(files || [])]) {
    if (out.length >= room) { toast("Only 8 photos can be added to one entry.", "warn"); break; }
    if (!/^image\//.test(f.type)) { toast("Use an image file (JPG or PNG).", "warn"); continue; }
    if (f.size > 25 * 1024 * 1024) { toast("The photo is larger than 25 MB.", "warn"); continue; }
    const u = await toJpeg(await fileToDataUrl(f), max || 1400);
    if (u) out.push(u);
  }
  return out;
}

function route() {
  const id = (location.hash || "").replace("#", "");
  let next;
  if (!SESSION) next = "login";
  else if (isCitizen()) next = CIT_PAGES.includes(id) ? id : (C.some((c) => c.phone === SESSION.phone) ? "my-complaints" : "file-complaint");
  else next = PAGES.some((p) => p.id === id && pageOK(p)) ? id : isCP() ? "cp" : "overview";
  if (next !== ui.page) { ui.page = next; ui.lawOpen = false; ui.lawQ = ""; window.scrollTo(0, 0); if (next === "file-complaint") ui.cAck = null; }
  render();
  if (isCitizen() && ui.page === "my-complaints") C.filter((c) => c.phone === SESSION.phone && c.citizenUnread).forEach((c) => { c.citizenUnread = false; saveComplaint(c); });
  updateTitle();
}

let toastN = 0;
function toast(msg, kind, go, goLabel) {
  const t = { id: ++toastN, msg, kind, go, goLabel };
  ui.toasts.push(t);
  renderToasts();
  setTimeout(() => { ui.toasts = ui.toasts.filter((x) => x.id !== t.id); renderToasts(); }, go ? 8000 : 4500);
}
function openModal(title, body, actions) { ui.modal = { title, body, actions }; renderOverlays(); }
function closeModal() { ui.modal = null; renderOverlays(); }
function go(page) { if (location.hash !== "#" + page) location.hash = page; else route(); }

/* ---------- Entry helpers ---------- */
function refreshEntrySide(withSign) {
  const f = captureFocus();
  paint($("#entry-checks"), vEntryChecks());
  paint($("#entry-conn"), vEntryConn());
  paint($("#entry-save"), vEntrySave());
  if (withSign) paint($("#entry-sign"), vEntrySign());
  const n = $("#e-sum-n"); if (n) { n.textContent = `${(S.draft.summary || "").trim().length} characters. Aim for 40 or more.`; trDOM(n.parentElement); }
  restoreFocus(f);
}
function draftToRecord(d, status) {
  const t = typeOf(d.type);
  const sg = signer(d);
  const sign = {};
  if (d.sign.complainant) sign.complainant = Object.assign({}, d.sign.complainant, { name: sg ? sg.name : d.sign.complainant.name });
  if (d.sign.thumb) sign.thumb = Object.assign({}, d.sign.thumb, { name: sg ? sg.name : d.sign.thumb.name });
  if (d.sign.officer) sign.officer = Object.assign({}, d.sign.officer);
  return {
    id: d.editingId || (d.refMode === "manual" ? normRef(d.ref) : d.ref), type: d.type, photos: clone(d.photos || []), sign, category: t.group === "Administrative" ? "admin" : "case", title: t.label, date: d.date, time: d.time, location: d.location.trim(), summary: d.summary.trim(), sections: (d.sections || []).slice(),
    people: d.people.filter((p) => p.name.trim()).map((p) => ({ name: p.name.trim(), role: p.role, alias: (p.alias || "").trim(), contact: p.contact ? prettyPhone(p.contact) : "", idType: p.idMasked ? p.idType : "", idMasked: p.idMasked || "", address: (p.address || "").trim() })), station: d.station || homeStation(),
    identifiers: d.identifiers.filter((x) => x.value.trim()).map((x) => ({ kind: x.kind, value: x.kind === "vehicle" ? prettyVehicle(x.value) : x.kind === "phone" ? prettyPhone(x.value) : x.value.trim(), context: (x.context || "").trim() })),
    docIds: [], caseStatus: "Active", source: "direct", status,
  };
}
function saveEntry(status) {
  const d = S.draft;
  if (!d.editingId && d.refMode !== "manual" && codeTaken(d.ref)) d.ref = nextCaseCode();
  const rec = draftToRecord(d, status);
  const existing = getRec(rec.id);
  if (existing) { Object.assign(existing, rec, { createdBy: existing.createdBy, createdAt: existing.createdAt }); }
  else { rec.createdBy = S.userId; rec.createdAt = nowISO(); S.records.push(rec); }
  const r = getRec(rec.id);
  if (d.fromDoc && status !== "draft") {
    const doc = getDoc(d.fromDoc);
    if (doc) { r.docIds = uniq((r.docIds || []).concat(doc.id)); doc.recordId = r.id; doc.status = "verified"; doc.verifiedBy = S.userId; doc.verifiedAt = nowISO(); log("Document attached", r.id, `${doc.name} filled the Direct Entry form and is kept with the record`, { docId: doc.id }); }
  }
  return r;
}
function logSignatures(r) {
  if ((r.photos || []).length) log("Photos attached", r.id, `${r.photos.length} photo(s) saved with the record`);
  if (r.sign.complainant) log("Complainant signed", r.id, `Electronic signature of ${r.sign.complainant.name || "complainant"}`);
  if (r.sign.thumb) log("Thumb impression added", r.id, `${r.sign.thumb.hand} of ${r.sign.thumb.name || "complainant"}`);
  if (r.sign.officer) log("Officer signed", r.id, `Electronic signature of ${userName(r.sign.officer.userId)}`);
}
function entryBlocked() {
  const d = S.draft;
  const comp = completeness(d);
  const miss = comp.list.filter((x) => !x.ok).map((x) => x.label).concat(signNeeds(d));
  if (d.sign.officer && d.sign.officer.userId !== S.userId) miss.push("Officer signature");
  if (miss.length) { toast("Still needed: " + miss.join(", ") + ".", "warn"); return true; }
  if (!ui.entryConfirm) { toast("Tick the box to confirm you read the entry.", "warn"); $("#e-confirm") && $("#e-confirm").focus(); return true; }
  return false;
}

/* ---------- Scanner helpers ---------- */
function newDocId() { return "DOC-" + String(S.seq.doc++).padStart(4, "0"); }
async function addFile(file) {
  if (!file) return;
  const okType = /^image\//.test(file.type) || file.type === "application/pdf";
  if (!okType) { toast("Use a JPG, PNG or PDF file.", "warn"); return; }
  if (file.size > 15 * 1024 * 1024) { toast("The file is larger than 15 MB. Use a smaller scan.", "warn"); return; }
  let dataUrl = await fileToDataUrl(file);
  if (/^image\//.test(file.type)) dataUrl = await shrinkImage(dataUrl, 2000);
  const d = { id: newDocId(), name: file.name, mime: file.type, dataUrl, status: "uploaded", uploadedBy: S.userId, uploadedAt: nowISO(), size: file.size };
  S.docs.push(d);
  log("Document uploaded", "", `${file.name} (${Math.round(file.size / 1024)} KB). Original kept.`, { docId: d.id });
  ui.docId = d.id;
  save(); render();
  processDoc(d.id);
}
function useSample(key) {
  const exist = S.docs.find((d) => d.asset === key && d.status !== "verified");
  if (exist) { ui.docId = exist.id; render(); toast(`Sample ${key} is already in the queue.`); return; }
  const done = S.docs.find((d) => d.asset === key && d.status === "verified");
  if (done) { ui.docId = done.id; render(); toast(`Sample ${key} was already verified. Reset the demo data to scan it again.`, "warn"); return; }
  const d = { id: newDocId(), name: `${key} paper record.jpg`, asset: key, mime: "image/jpeg", status: "uploaded", uploadedBy: S.userId, uploadedAt: nowISO(), label: "Scanned paper record" };
  S.docs.push(d);
  log("Document uploaded", "", `${d.name} (sample). Original kept.`, { docId: d.id });
  ui.docId = d.id;
  save(); render();
  processDoc(d.id);
}
function verifyDocNow(d) {
  const x = d.x;
  const ref = (x.reference || "").toUpperCase().replace(/\s+/g, "");
  let r = ref ? getRec(ref) : null;
  const people = x.people.filter((p) => p.name.trim()).map((p) => ({ name: p.name.trim(), role: p.role, contact: p.contact ? prettyPhone(p.contact) : "", alias: p.alias || "", idType: p.idMasked ? p.idType : "", idMasked: p.idMasked || "", address: p.address || "" }));
  const ids = x.identifiers.filter((i) => i.value.trim()).map((i) => ({ kind: i.kind, value: i.kind === "vehicle" ? prettyVehicle(i.value) : i.kind === "phone" ? prettyPhone(i.value) : i.value.trim(), context: i.context }));
  if (r) {
    r.docIds = uniq((r.docIds || []).concat(d.id));
    log("Document attached", r.id, `${d.name} linked to the existing record`, { docId: d.id });
  } else {
    const id = ref || "DEMO-SCAN-" + String(S.seq.doc).padStart(3, "0");
    r = { id, type: x.type || "incident", category: typeOf(x.type).group === "Administrative" ? "admin" : "case", title: typeOf(x.type || "incident").label, date: x.date, time: x.time, location: x.location, summary: x.summary, people, identifiers: ids, docIds: [d.id], caseStatus: "Active", source: "scan", status: "verified", createdBy: d.uploadedBy, createdAt: nowISO(), station: x.station || homeStation(), stage: "verified", officer: S.userId };
    S.records.push(r);
    log("Record created from scan", r.id, `${r.title} from ${d.name}`, { docId: d.id });
  }
  r.status = "verified"; r.verifiedBy = S.userId; r.verifiedAt = nowISO();
  d.recordId = r.id; d.status = "verified"; d.verifiedBy = S.userId; d.verifiedAt = r.verifiedAt;
  d.verifiedFields = clone(x); d.x = null;
  log("Record verified", r.id, `Officer checked ${docRows({ x: d.verifiedFields }).length} fields against the original`);
  S.demo.verify = true;
  const added = computeLinks();
  save();
  return { r, added };
}

/* ---------- Downloads ---------- */
async function offerDownload(filename, text, mime) {
  if (DL) {
    try { await DL.save({ filename, data: new Blob([text], { type: mime }) }); toast("Download offered: " + filename); return; }
    catch (e) { try { await DL.save({ filename, data: text }); toast("Download offered: " + filename); return; } catch (e2) { if (e2 && e2.code === "declined") return; } }
  }
  if (!inArtifact()) {
    const url = URL.createObjectURL(new Blob([text], { type: mime }));
    const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000); return;
  }
  try { await navigator.clipboard.writeText(text); toast("Downloads are not available here, so the CSV was copied to your clipboard."); }
  catch (e) { toast("This view cannot download or copy files.", "warn"); }
}

/* ---------- Click actions ---------- */
const ACT = {
  aiInfo() {
    openModal("How AI works on this page", `<p>${AI ? `AI is on. Claude reviews draft wording in the Direct Entry Desk${AI_IMAGES ? " and reads scanned pages (vision OCR) in the Document Scanner" : ""}. The first AI action asks for your permission.` : h(AI_OFF_REASON || "AI is off.")}</p>
      <p>Built-in rules always run: required-field checks, format checks for vehicle numbers, mobile numbers and IMEI, field extraction from OCR text, and the connection engine.</p>
      <p class="muted small">AI only assists. It never registers, rejects or decides anything. Every record and every link needs an officer's review.</p>`, [{ label: "Close", act: "closeModal", cls: "primary" }]);
  },
  closeModal,
  toastGo(el) { const t = ui.toasts.find((x) => x.id === +el.dataset.id); if (t && t.go) t.go(); ui.toasts = ui.toasts.filter((x) => x !== t); renderToasts(); },

  /* records */
  openRecord(el) {
    const id = el.dataset.id; const r = getRec(id); if (!r) return;
    if (el.dataset.from === "search" && ui.searchT0) {
      const ms = Math.round(performance.now() - ui.searchT0);
      S.metrics.retrieval.push({ ms, query: ui.q.trim().slice(0, 40), recordId: id, at: nowISO() });
      ui.searchT0 = null;
      toast(`Found in ${(ms / 1000).toFixed(1)} s. Logged for the pilot metric.`);
    }
    ui.drawer = id;
    log("Viewed record", id, "Record opened by " + me().name);
    save(); renderOverlays();
  },
  closeDrawer(el, e) { if (el.dataset.self && e.target !== el) return; ui.drawer = null; renderOverlays(); },
  verifyRecord(el) {
    const r = getRec(el.dataset.id);
    ui.verifySign = null;
    openModal("Verify " + r.id + "?", () => `<p>You confirm that you reviewed this entry against what was reported. The record becomes trusted, searchable and part of connection checks.</p>
      <div class="stack sigbox"><div class="lbl">Signature of verifying officer: ${h(me().name)}</div>${padHTML("verifier", "Signature pad for the verifying officer")}<div class="row tiny"><span class="muted">${ui.verifySign ? "Signed. You can verify now." : "Sign to enable the Verify button."}</span><span class="spacer"></span><button class="btn sm ghost" data-act="clearPad" data-pad="verifier">Clear</button></div></div>
      <p class="muted small">Your name, role, signature and the time will be recorded.</p>`, [{ label: "Cancel", act: "closeModal" }, { label: "Verify record", act: "doVerifyRecord", cls: "ok", data: `data-id="${r.id}"`, need: "verifySign" }]);
  },
  doVerifyRecord(el) {
    const r = getRec(el.dataset.id); if (!r || !can("verify") || !ui.verifySign) return;
    r.status = "verified"; r.verifiedBy = S.userId; r.verifiedAt = nowISO();
    r.station = r.station || homeStation(); r.stage = r.stage || "verified"; r.officer = r.officer || S.userId;
    if (!r.fir && FIR_TYPES.includes(r.type) && r.source !== "scan") r.fir = nextFir(r.station);
    const sid = newMediaId("SIG"); mediaPut(sid, ui.verifySign); r.sign = r.sign || {}; r.sign.verifier = { id: sid, at: r.verifiedAt, userId: S.userId }; ui.verifySign = null;
    log("Officer signed", r.id, `Verification signature of ${me().name}`);
    log("Record verified", r.id, "Officer verification recorded");
    const added = computeLinks();
    ui.modal = null; save(); render();
    toast(`${r.id} verified.${added.length ? ` ${added.length} possible link${added.length > 1 ? "s" : ""} found.` : ""}`, "", added.length ? () => { ui.linkKey = added[0].key; ui.linkTab = "suggested"; ui.drawer = null; go("connections"); } : null, "Review links");
  },
  viewImg(el) {
    const d = getDoc(el.dataset.doc); if (!d) return;
    const i = +el.dataset.src || 0;
    const src = d.pages && d.pages[i] ? d.pages[i] : docSrc(d);
    ui.viewer = { src, title: (d.label || d.name) + (d.pages && d.pages.length > 1 ? ` (page ${i + 1})` : "") };
    renderOverlays();
  },
  closeViewer(el, e) { if (el.dataset.self && e.target !== el) return; ui.viewer = null; renderOverlays(); },

  /* language */
  setLang(el) {
    S.lang = el.dataset.id === "kn" ? "kn" : "en";
    try { localStorage.setItem(LKEY, S.lang); } catch (e) {}
    if (isAdmin()) save();
    render();
    toast(S.lang === "kn" ? "ಭಾಷೆ ಕನ್ನಡಕ್ಕೆ ಬದಲಾಗಿದೆ. ದಾಖಲೆಗಳು ಬರೆದ ಭಾಷೆಯಲ್ಲೇ ಉಳಿಯುತ್ತವೆ." : "Language set to English.");
  },
  /* files, photos, signatures */
  pickFile(el) { const i = document.getElementById(el.dataset.for); if (i) i.click(); },
  viewMedia(el) { const src = MEDIA[el.dataset.id]; if (!src) return; ui.viewer = { src, title: el.getAttribute("alt") || "Image" }; renderOverlays(); },
  delPhoto(el) { const p = S.draft.photos.splice(+el.dataset.i, 1)[0]; if (p && !mediaInUse(p.id)) mediaDel(p.id); save(); paint($("#entry-photos"), vEntryPhotos()); refreshEntrySide(); },
  clearPad(el) {
    const k = el.dataset.pad;
    if (k === "verifier") { ui.verifySign = null; renderOverlays(); return; }
    if (k === "cverify") { ui.cSign = null; renderPage(); return; }
    const m = S.draft.sign[k]; if (m && !mediaInUse(m.id)) mediaDel(m.id);
    delete S.draft.sign[k]; save(); refreshEntrySide(true);
  },
  clearThumb() { const m = S.draft.sign.thumb; if (m && !mediaInUse(m.id)) mediaDel(m.id); delete S.draft.sign.thumb; save(); refreshEntrySide(true); },
  saveOtherOwner(el) {
    const t = S.tasks.find((x) => x.id === el.dataset.id); const v = ($("#ownerOtherName").value || "").trim();
    if (!v) { toast("Type the name of the responsible person.", "warn"); $("#ownerOtherName").focus(); return; }
    t.assignee = "other:" + v.slice(0, 60); t.assignedAt = t.lastActionAt = nowISO();
    log("Task owner set", t.recordId, `${t.title}: ${v} (other)`);
    ui.modal = null; save(); render(); toast("Responsible person set.");
  },
  cancelOther() { ui.modal = null; render(); },

  /* entry */
  setType(el) { S.draft.type = el.dataset.id; ui.aiReview = null; save(); renderPage(); },
  docToEntry(el) {
    const d = getDoc(el.dataset.id); if (!d || !d.x) return;
    const x = d.x;
    S.draft = normDraft({ ref: autoRef(), refMode: "auto", type: x.type || "", date: x.date || todayIST(), time: x.time || "", locMode: PLACES.includes(x.location) ? "list" : "other", location: x.location || "", summary: x.summary || "", station: x.station || homeStation(),
      people: x.people.filter((p) => p.name.trim()).map((p) => ({ name: p.name.trim(), role: p.role, contact: p.contact || "", alias: p.alias || "", idType: p.idMasked ? p.idType : "", idMasked: p.idMasked || "", address: p.address || "" })),
      identifiers: x.identifiers.filter((i) => i.value.trim()).map((i) => ({ kind: i.kind, value: i.value, context: i.context || "" })), photos: [], sign: {}, editingId: null, fromDoc: d.id });
    if (!S.draft.people.length) S.draft.people.push({ name: "", role: "Complainant", contact: "", alias: "" });
    log("Scanned document sent to Direct Entry", "", `${d.name}: the form was filled from the page. Staff check it and save.`, { docId: d.id });
    ui.entryConfirm = false; ui.aiReview = null; save(); go("entry");
    toast("The Direct Entry form is filled from the scanned page. Check each field, add signatures, then save.");
  },
  addPerson() { S.draft.people.push({ name: "", role: "", contact: "", alias: "" }); save(); renderPage(); const i = S.draft.people.length - 1; setTimeout(() => { const f = $("#pn" + i); if (f) f.focus(); }, 0); },
  delPerson(el) { S.draft.people.splice(+el.dataset.i, 1); save(); renderPage(); },
  addId() { S.draft.identifiers.push({ kind: "vehicle", value: "", context: "" }); save(); renderPage(); const i = S.draft.identifiers.length - 1; setTimeout(() => { const f = $("#iv" + i); if (f) f.focus(); }, 0); },
  delId(el) { S.draft.identifiers.splice(+el.dataset.i, 1); save(); renderPage(); },
  fixAddId(el) { S.draft.identifiers.push({ kind: el.dataset.kind, value: el.dataset.value, context: "Mentioned in summary" }); save(); renderPage(); toast("Identifier added. Add a short context if you can."); },
  focusField(el) {
    const map = { type: ".type", date: "#e-date", time: "#e-time", location: "#e-loc", summary: "#e-sum", people: "#pn0", identifiers: "#iv0" };
    let t = $(map[el.dataset.f] || "#e-sum");
    if (!t && el.dataset.f === "people") { ACT.addPerson(); return; }
    if (!t && el.dataset.f === "identifiers") { ACT.addId(); return; }
    if (t) { t.scrollIntoView({ behavior: "smooth", block: "center" }); t.focus({ preventScroll: true }); }
  },
  async aiReview() {
    if (!AI) return;
    ui.aiBusy = true; refreshEntrySide();
    try { ui.aiReview = await aiReviewEntry(S.draft); }
    catch (e) { aiFail(e); ui.aiReview = null; }
    ui.aiBusy = false; refreshEntrySide();
  },
  useAiSummary() { if (ui.aiReview && ui.aiReview.suggested_summary) { S.draft.summary = ui.aiReview.suggested_summary; ui.aiReview.suggested_summary = ""; log("AI wording applied", S.draft.ref, "Staff accepted a clearer summary suggested by AI"); save(); renderPage(); toast("Summary updated. Read it once more before saving."); } },
  dropAi() { ui.aiReview = null; refreshEntrySide(); },
  newEntry() { dropDraftMedia(); S.draft = newDraft(); ui.aiReview = null; ui.entryConfirm = false; save(); renderPage(); },
  continueDraft(el) {
    const r = getRec(el.dataset.id); if (!r) return;
    S.draft = normDraft({ ref: r.id, refMode: "auto", type: r.type, date: r.date, time: r.time, location: r.location, summary: r.summary, people: r.people.length ? clone(r.people) : [{ name: "", role: "Complainant", contact: "", alias: "" }], identifiers: clone(r.identifiers), photos: clone(r.photos || []), sign: clone(r.sign || {}), sections: (r.sections || []).slice(), editingId: r.id });
    ui.drawer = null; ui.aiReview = null; ui.entryConfirm = false; save();
    go("entry");
  },
  saveDraft() {
    if (S.draft.refMode === "manual" && refProblem(S.draft)) { toast(refProblem(S.draft), "warn"); $("#e-ref") && $("#e-ref").focus(); return; }
    const r = saveEntry("draft");
    log("Draft saved", r.id, "Entry saved as a draft");
    S.draft.editingId = r.id; save(); render();
    toast(`Draft ${r.id} saved. You can finish it later.`);
  },
  submitEntry() {
    if (entryBlocked()) return;
    const r = saveEntry("pending"); r.submittedAt = nowISO();
    if (!S.audit.some((a) => a.recordId === r.id && a.action === "Record created")) log("Record created", r.id, r.title + " (direct entry)");
    logSignatures(r);
    log("Submitted for verification", r.id, `Entry submitted by ${me().name}. Completeness ${completeness(r).done} of ${completeness(r).total}.`);
    S.demo.entry = true; S.draft = newDraft(); ui.aiReview = null; ui.entryConfirm = false;
    save(); render();
    toast(`${r.id} submitted. An SI or SHO will verify it.`, "", () => { ui.drawer = r.id; renderOverlays(); }, "Open record");
  },
  verifyEntry() {
    if (!can("verify")) return;
    if (entryBlocked()) return;
    const r = saveEntry("verified"); r.submittedAt = nowISO(); r.verifiedBy = S.userId; r.verifiedAt = nowISO();
    r.stage = "verified"; r.officer = S.userId; if (!r.fir && FIR_TYPES.includes(r.type)) r.fir = nextFir(r.station || homeStation());
    if (r.sign.officer) r.sign.verifier = Object.assign({}, r.sign.officer);
    if (!S.audit.some((a) => a.recordId === r.id && a.action === "Record created")) log("Record created", r.id, r.title + " (direct entry)");
    logSignatures(r);
    log("Record verified", r.id, "Officer reviewed and saved the entry");
    const added = computeLinks();
    S.demo.entry = true; S.draft = newDraft(); ui.aiReview = null; ui.entryConfirm = false;
    save(); render();
    toast(`${r.id} verified and saved.${added.length ? ` ${added.length} possible link${added.length > 1 ? "s" : ""} found.` : ""}`, "", added.length ? () => { ui.linkKey = added[0].key; ui.linkTab = "suggested"; go("connections"); } : () => { ui.drawer = r.id; renderOverlays(); }, added.length ? "Review links" : "Open record");
  },

  /* scanner */
  useSample(el) { useSample(el.dataset.id); },
  openDoc(el) { ui.docId = el.dataset.id; ui.drawer = null; if (ui.page !== "scanner") go("scanner"); else render(); },
  retryDoc(el) { const d = getDoc(el.dataset.id); d.status = "uploaded"; processDoc(d.id); },
  manualStructure(el) {
    const d = getDoc(el.dataset.id); const t = ($("#manualText") || {}).value || "";
    if (t.trim().length < 20) { toast("Type more of the document text first.", "warn"); return; }
    d.manualText = t;
    applyExtract(d, structureText(t, null), "Typed by staff + rules");
    log("OCR draft created", "", `${d.name}: text typed by staff`, { docId: d.id });
    S.demo.scan = true; save(); render();
  },
  tickHigh(el) {
    const d = getDoc(el.dataset.id); const x = d.x;
    Object.keys(x.ok).forEach((k) => { if (x.conf[k] >= 0.85 && x[k]) x.ok[k] = true; });
    x.people.forEach((p) => { if (p.conf >= 0.85) p.ok = true; });
    x.identifiers.forEach((p) => { if (p.conf >= 0.85) p.ok = true; });
    save(); renderPage();
  },
  dxAddPerson(el) { const d = getDoc(el.dataset.id); d.x.people.push({ name: "", role: "Person mentioned", contact: "", conf: 1, ok: false }); save(); renderPage(); },
  dxAddId(el) { const d = getDoc(el.dataset.id); d.x.identifiers.push({ kind: "vehicle", value: "", context: "", conf: 1, ok: false }); save(); renderPage(); },
  submitDoc(el) {
    const d = getDoc(el.dataset.id); d.status = "submitted";
    log("Sent for officer verification", "", `${d.name}: fields checked by ${me().name}`, { docId: d.id });
    save(); render(); toast("Sent to an officer. Switch to SI or SHO to verify it.");
  },
  verifyDoc(el) {
    const d = getDoc(el.dataset.id); if (!can("verify") || !d.x) return;
    if (docRows(d).some((r) => !r.ok)) { toast("Tick every field after you check it.", "warn"); return; }
    const { r, added } = verifyDocNow(d);
    render();
    toast(`${r.id} verified and added to search.${added.length ? ` ${added.length} possible link${added.length > 1 ? "s" : ""} found.` : " No new links."}`, "", added.length ? () => { ui.linkKey = added[0].key; ui.linkTab = "suggested"; go("connections"); } : () => { ui.drawer = r.id; renderOverlays(); }, added.length ? "Review links" : "Open record");
  },

  /* connections */
  linkTab(el) { ui.linkTab = el.dataset.id; ui.linkKey = null; renderPage(); },
  openLink(el) {
    const L = S.links.find((l) => l.key === el.dataset.key); if (!L) return;
    ui.linkKey = L.key; ui.linkTab = L.status; ui.drawer = null;
    if (ui.page !== "connections") go("connections"); else render();
  },
  caseLinks(el, e) { const L = S.links.find((l) => (l.a === el.dataset.id || l.b === el.dataset.id) && (l.reasons || []).length && l.status !== "dismissed"); if (L) { ui.linkKey = L.key; ui.linkTab = L.status; } go("connections"); },
  rescan() { const added = computeLinks(); save(); render(); toast(added.length ? `${added.length} new possible link${added.length > 1 ? "s" : ""} found.` : "No new links. Existing suggestions are up to date."); },
  decide(el) {
    if (!can("reviewLink")) return;
    const L = S.links.find((l) => l.key === el.dataset.key); const v = el.dataset.v;
    L.status = v; L.reviewedBy = v === "suggested" ? null : S.userId; L.reviewedAt = v === "suggested" ? null : nowISO(); if (v !== "suggested") L.rating = null;
    log(v === "accepted" ? "Link accepted" : v === "dismissed" ? "Link dismissed" : "Link moved back to review", L.b, `${L.a} and ${L.b}: ${(L.reasons || []).map((r) => KIND_TEXT[r.kind] + " " + r.value).join(", ")}`, { linkKey: L.key });
    if (L.a !== L.b && v !== "suggested") log(v === "accepted" ? "Link accepted" : "Link dismissed", L.a, `${L.a} and ${L.b}`, { linkKey: L.key });
    if (v !== "suggested") S.demo.link = true;
    ui.linkTab = v; ui.linkKey = L.key;
    save(); render();
    toast(v === "accepted" ? "Link accepted. It stays a clue for officers, not a conclusion." : v === "dismissed" ? "Link dismissed. It stays in the audit trail." : "Link moved back to review.");
  },
  rate(el) { const L = S.links.find((l) => l.key === el.dataset.key); L.rating = el.dataset.v; log("Link reason rated", L.b, `${L.a} and ${L.b}: ${el.dataset.v}`, { linkKey: L.key }); save(); renderPage(); toast("Thanks. Counted in the review usefulness metric."); },
  annotate(el) {
    const L = S.links.find((l) => l.key === el.dataset.key); const inp = $("#linkNote");
    const t = (inp && inp.value || "").trim(); if (!t) { toast("Write a note first.", "warn"); inp && inp.focus(); return; }
    L.notes = L.notes || []; L.notes.push({ by: S.userId, at: nowISO(), text: t });
    log("Link note added", L.b, `${L.a} and ${L.b}: ${t}`, { linkKey: L.key });
    S.demo.link = true; save(); renderPage(); toast("Note added.");
  },

  /* workspace */
  tlAll() { ui.tlAll = true; renderPage(); },
  openCase(el) { ui.caseId = el.dataset.id; ui.tlAll = false; ui.drawer = null; if (ui.page !== "workspace") go("workspace"); else render(); },
  addNote(el) {
    const t = ($("#noteText").value || "").trim(); if (!t) { toast("Write the update first.", "warn"); $("#noteText").focus(); return; }
    S.notes.push({ id: "N-" + S.seq.note++, recordId: el.dataset.id, by: S.userId, at: nowISO(), text: t });
    log("Officer update added", el.dataset.id, t);
    S.tasks.filter((x) => x.recordId === el.dataset.id && x.status === "open" && x.assignee === S.userId).forEach((x) => escActed("task:" + x.id, t));
    save(); renderPage(); toast("Update added to the timeline.");
  },

  /* audit + misc */
  exportAudit() {
    const rows = auditRows();
    const esc = (v) => '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
    const csv = ["Time (IST),User,Role,Action,Record,Detail"].concat(rows.map((a) => [fmtDT(a.at), userName(a.userId), roleOf(a.userId), a.action, a.recordId, a.detail].map(esc).join(","))).join("\n");
    log("Audit trail exported", "", `${rows.length} events exported as CSV`);
    save();
    offerDownload("janaraksha-audit-trail.csv", csv, "text/csv");
  },
  resetDemo() { openModal("Reset demo data?", "<p>This restores the 15 fictional records and the 2 sample online complaints. It removes scans, entries, complaints, photos and signatures you added in this browser, and clears the metrics.</p>", [{ label: "Cancel", act: "closeModal" }, { label: "Reset", act: "doReset", cls: "primary" }]); },
  doReset() { const uid = S.userId, lang = S.lang; mediaClear(); S = seedState(); S.userId = uid; S.lang = lang; C = seedComplaints(); writeComplaints(C); markSeed(); seedComplaintAudit(C); ui.cid = null; computeLinks(true); ui.modal = null; ui.docId = null; ui.linkKey = null; ui.caseId = "DEMO-205"; ui.aiReview = null; save(); render(); toast("Demo data restored."); },
};

/* ---------- Input bindings ---------- */
const BIND = {
  user(el) { const prev = me().name; S.userId = el.value; log("Signed in", "", `Demo user switched from ${prev} to ${me().name} (${me().roleLabel})`); escSweep(); save(); render(); toast(`Signed in as ${me().name}, ${me().roleLabel}.`); setTimeout(escAnnounce, 300); },
  e(el) { S.draft[el.dataset.f] = el.value; save(); refreshEntrySide(); if (el.dataset.f === "summary") { const b = $("#law-sug"); if (b) paint(b, vLawSug(S.draft)); } },
  ep(el) { S.draft.people[+el.dataset.i][el.dataset.f] = el.value; save(); refreshEntrySide(true); },
  epidt(el) { const p = S.draft.people[+el.dataset.i]; p.idType = el.value; p.idMasked = ""; save(); renderPage(); setTimeout(() => { const i = $("#px" + el.dataset.i); if (i && !i.disabled) i.focus(); }, 0); },
  epid(el) {
    const i = +el.dataset.i, p = S.draft.people[i], hint = $("#pxh" + i);
    const v = (el.value || "").trim();
    if (!v) { p.idMasked = ""; save(); if (hint) { hint.textContent = trStr("Type the full number. Only the masked number is saved."); hint.classList.remove("bad"); } return; }
    if (/X/.test(v) && v === p.idMasked) return;
    const n = normIdNo(p.idType, v);
    const ok = p.idType === "aadhaar" ? /^[2-9]\d{11}$/.test(n) && verhoeffOk(n) : /^[A-Z]{5}\d{4}[A-Z]$/.test(n);
    if (!ok) { p.idMasked = ""; save(); if (hint) { hint.textContent = trStr(p.idType === "aadhaar" ? "This Aadhaar number is not valid. Check the 12 digits." : "This PAN is not valid. Example: ABCPE1234F."); hint.classList.add("bad"); } return; }
    p.idMasked = maskId(p.idType, n); el.value = p.idMasked; save();
    if (hint) { hint.textContent = trStr("Saved masked. The full number is not stored."); hint.classList.remove("bad"); }
  },
  ei(el) { S.draft.identifiers[+el.dataset.i][el.dataset.f] = el.value; save(); refreshEntrySide(); },
  confirm(el) { ui.entryConfirm = el.checked; },
  eref(el) { S.draft.ref = el.value; save(); refreshEntrySide(); },
  refMode(el) { const d = S.draft; d.refMode = el.checked ? "manual" : "auto"; if (!el.checked) d.ref = autoRef(); save(); renderPage(); if (el.checked) setTimeout(() => { const i = $("#e-ref"); if (i) { i.focus(); i.select(); } }, 0); },
  locSel(el) {
    const d = S.draft;
    if (el.value === "__other") { d.locMode = "other"; if (PLACES.includes(d.location)) d.location = ""; save(); renderPage(); setTimeout(() => { const i = $("#e-loc"); if (i) i.focus(); }, 0); }
    else { d.locMode = "list"; d.location = el.value; save(); renderPage(); }
  },
  async photoFile(el) {
    const files = el.files; const d = S.draft;
    const urls = await readImages(files, 8 - d.photos.length, 1400); el.value = "";
    urls.forEach((u) => { const id = newMediaId("PH"); mediaPut(id, u); d.photos.push({ id, caption: "", at: nowISO(), by: S.userId }); });
    save(); paint($("#entry-photos"), vEntryPhotos()); refreshEntrySide();
    if (urls.length) toast(`${urls.length} photo${urls.length > 1 ? "s" : ""} added. Add a caption to each.`);
  },
  photoCap(el) { const p = S.draft.photos[+el.dataset.i]; if (p) { p.caption = el.value; save(); } },
  async thumbFile(el) {
    const urls = await readImages(el.files, 1, 900); el.value = "";
    if (!urls.length) return;
    const d = S.draft; const old = d.sign.thumb; if (old && !mediaInUse(old.id)) mediaDel(old.id);
    const id = newMediaId("TH"); mediaPut(id, urls[0]);
    const sg = signer(d);
    d.sign.thumb = { id, at: nowISO(), hand: d.sign.thumbHand || "Left thumb", name: sg ? sg.name : "" };
    save(); refreshEntrySide(true); toast("Thumb impression added.");
  },
  thumbHand(el) { const d = S.draft; d.sign.thumbHand = el.value; if (d.sign.thumb) d.sign.thumb.hand = el.value; save(); refreshEntrySide(true); },
  async recPhoto(el) {
    const r = getRec(el.dataset.id); if (!r) return;
    const urls = await readImages(el.files, 12, 1400); el.value = "";
    r.photos = r.photos || [];
    urls.forEach((u) => { const id = newMediaId("PH"); mediaPut(id, u); r.photos.push({ id, caption: "", at: nowISO(), by: S.userId }); });
    if (urls.length) { log("Photos attached", r.id, `${urls.length} photo(s) added by ${me().name}`); save(); renderOverlays(); toast(`${urls.length} photo${urls.length > 1 ? "s" : ""} added to ${r.id}.`); }
  },
  ownerSel(el) { const w = $("#t-other-wrap"); if (!w) return; w.classList.toggle("hidden", el.value !== "__other"); if (el.value === "__other") { const i = $("#t-other"); if (i) i.focus(); } },
  q(el) { if (el.value && !ui.searchT0) ui.searchT0 = performance.now(); ui.q = el.value; paint($("#results"), vResults()); },
  fType(el) { ui.fType = el.value; paint($("#results"), vResults()); },
  fSource(el) { ui.fSource = el.value; paint($("#results"), vResults()); },
  fStatus(el) { ui.fStatus = el.value; paint($("#results"), vResults()); },
  file(el) { const f = el.files && el.files[0]; el.value = ""; addFile(f); },
  dx(el) { const d = getDoc(ui.docId); if (!d || !d.x) return; d.x[el.dataset.k] = el.value; save(); },
  dxc(el) {
    const d = getDoc(ui.docId); if (!d || !d.x) return; const k = el.dataset.k;
    if (k[0] === "p" && /^p\d+$/.test(k)) d.x.people[+k.slice(1)].ok = el.checked;
    else if (/^i\d+$/.test(k)) d.x.identifiers[+k.slice(1)].ok = el.checked;
    else d.x.ok[k] = el.checked;
    save(); renderPage();
  },
  dxp(el) { const d = getDoc(ui.docId); if (!d || !d.x) return; d.x.people[+el.dataset.i][el.dataset.f] = el.value; save(); },
  dxi(el) { const d = getDoc(ui.docId); if (!d || !d.x) return; d.x.identifiers[+el.dataset.i][el.dataset.f] = el.value; save(); },
  showDismissed(el) { ui.showDismissed = el.checked; renderPage(); },
  caseStatus(el) { const r = getRec(el.dataset.id); const prev = r.caseStatus; r.caseStatus = el.value; log("Case status changed", r.id, `${prev} to ${el.value}`); save(); renderPage(); toast(`${r.id} is now ${el.value}.`); },
  taskDone(el) {
    const t = S.tasks.find((x) => x.id === el.dataset.id); if (!el.checked) return;
    t.status = "done"; t.doneBy = S.userId; t.doneAt = nowISO();
    escActed("task:" + t.id, "Task marked done");
    log("Follow-up task completed", t.recordId, t.title); save(); render(); toast("Task marked done.");
  },
  taskOwner(el) {
    const t = S.tasks.find((x) => x.id === el.dataset.id);
    if (el.value === "__other") {
      openModal("Responsible person", `<div class="field"><label for="ownerOtherName">Name of the person responsible for this task</label><input id="ownerOtherName" class="input" placeholder="for example ASI Ramesh, Traffic wing" /><span class="help">Use this for a person who is not in the user list. The name is saved with the task.</span></div><p class="small muted" data-notr>${h(t.title)}</p>`, [{ label: "Cancel", act: "cancelOther" }, { label: "Save", act: "saveOtherOwner", cls: "primary", data: `data-id="${t.id}"` }]);
      setTimeout(() => { const i = $("#ownerOtherName"); if (i) i.focus(); }, 0);
      return;
    }
    t.assignee = el.value; t.assignedAt = t.lastActionAt = nowISO(); log("Task owner set", t.recordId, `${t.title}: ${el.value ? ownerName(el.value) : "no owner"}`); save(); render();
  },
  aQ(el) { ui.aQ = el.value; paint($("#auditTable"), vAuditTable(auditRows())); const hd = el.closest(".card").querySelector("h2"); if (hd) { hd.textContent = auditRows().length + " events"; trDOM(hd); } },
  aUser(el) { ui.aUser = el.value; renderPage(); },
  aAction(el) { ui.aAction = el.value; renderPage(); },
};
const LIVE = new Set(["e", "ep", "ei", "q", "dx", "dxp", "dxi", "aQ", "eref", "photoCap"]);

/* ---------- Forms ---------- */
const FORMS = {
  gsearch(form) {
    const v = form.querySelector("input").value.trim();
    ui.q = v; ui.searchT0 = performance.now(); ui.fStatus = "verified";
    go("records");
  },
  search() { const first = $("#results .ri"); if (first) first.click(); },
  task(form) {
    const title = $("#t-title").value.trim(); if (!title) { toast("Write the next action first.", "warn"); return; }
    let owner = $("#t-owner").value;
    if (owner === "__other") {
      const nm = ($("#t-other").value || "").trim();
      if (!nm) { toast("Type the name of the responsible person.", "warn"); $("#t-other").focus(); return; }
      owner = "other:" + nm.slice(0, 60);
    }
    const t = { id: "T-" + S.seq.task++, recordId: ui.caseId, title, assignee: owner, due: $("#t-due").value || addDays(todayIST(), 3), status: "open", createdBy: S.userId, createdAt: nowISO() };
    S.tasks.push(t);
    log("Follow-up task created", t.recordId, `${title} (owner: ${t.assignee ? ownerName(t.assignee) : "no owner"}, due ${t.due})`);
    S.demo.task = true; save(); render(); toast("Follow-up added with an owner and due date.");
  },
};

Object.assign(ACT, PACT, EACT, LACT, AACT, RKACT, PGACT, CPACT);
Object.assign(BIND, PBIND, LBIND, RKBIND, CPBIND);
Object.assign(FORMS, PFORMS, RKFORMS);
LIVE.add("cf"); LIVE.add("cq"); LIVE.add("lawq"); LIVE.add("rkq"); LIVE.add("cpq");

/* ---------- Wiring ---------- */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]");
  if (!el) return;
  const fn = ACT[el.dataset.act];
  if (!fn) return;
  if (el.tagName === "A") e.preventDefault();
  fn(el, e);
});
document.addEventListener("input", (e) => { const el = e.target; const b = el.dataset && el.dataset.bind; if (b && LIVE.has(b) && BIND[b]) BIND[b](el); });
document.addEventListener("change", (e) => { const el = e.target; const b = el.dataset && el.dataset.bind; if (b && !LIVE.has(b) && BIND[b]) BIND[b](el); });
document.addEventListener("submit", (e) => { const f = e.target.closest("[data-form]"); if (!f) return; e.preventDefault(); const fn = FORMS[f.dataset.form]; if (fn) fn(f); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && ui.rk.open && !ui.modal && !ui.viewer && !ui.drawer && !ui.bell) { ui.rk.open = false; renderRaksha(); const b = $(".rk-fab"); if (b) b.focus(); return; }
  if (e.key === "Escape" && ui.bell) { ui.bell = false; renderOverlays(); return; }
  if (e.key === "Escape") { if (ui.viewer) { ui.viewer = null; renderOverlays(); } else if (ui.modal) closeModal(); else if (ui.drawer) { ui.drawer = null; renderOverlays(); } }
  if (e.key === "Enter" && e.target.id === "ownerOtherName") { e.preventDefault(); const b = $('[data-act="saveOtherOwner"]'); if (b) b.click(); }
  if (e.key === "Enter" && e.target.id === "linkNote") { e.preventDefault(); const b = e.target.parentElement.querySelector('[data-act="annotate"]'); if (b) b.click(); }
});
document.addEventListener("dragover", (e) => { const d = e.target.closest && e.target.closest("[data-drop]"); if (d) { e.preventDefault(); d.classList.add("over"); } });
document.addEventListener("dragleave", (e) => { const d = e.target.closest && e.target.closest("[data-drop]"); if (d) d.classList.remove("over"); });
document.addEventListener("drop", (e) => { const d = e.target.closest && e.target.closest("[data-drop]"); if (!d) return; e.preventDefault(); d.classList.remove("over"); const f = e.dataTransfer.files && e.dataTransfer.files[0]; addFile(f); });
window.addEventListener("hashchange", route);
window.addEventListener("storage", (e) => {
  if (e.key === CKEY) onComplaintsChanged();
  if (e.key === KEY && isAdmin() && e.newValue) { try { const o = JSON.parse(e.newValue); if (o && o.v === 5) { const lang = S.lang; S = o; S.lang = lang; render(); } } catch (x) {} }
});

/* ---------- Start ---------- */
function dropDraftMedia() {
  const d = S.draft; if (!d) return;
  (d.photos || []).forEach((p) => { if (!mediaInUse(p.id)) mediaDel(p.id); });
  Object.values(d.sign || {}).forEach((m) => { if (m && m.id && !mediaInUse(m.id)) mediaDel(m.id); });
}
document.body.insertAdjacentHTML("beforeend", flagHTML() + wmarkHTML());
load();
try { S.lang = localStorage.getItem(LKEY) || S.lang || "en"; } catch (e) { S.lang = S.lang || "en"; }
S.draft = S.draft ? normDraft(S.draft) : newDraft();
loadSession();
loadAllComplaints();
escInit();
if (isCitizen()) loadCForm();
if (isAdmin()) S.userId = SESSION.userId;
route();
mediaLoad().then(() => { if (Object.keys(MEDIA).length) render(); });
setInterval(() => { if (!document.hidden) { const missing = C.flatMap((c) => [c.idp.photo, c.person.photo].concat(c.incident.photos || [])).filter((id) => id && !MEDIA[id]); if (missing.length) mediaLoad().then(() => { if (missing.some((id) => MEDIA[id])) render(); }); } }, 2500);
setTimeout(initCapabilities, 0);
/* every minute: look for work that passed the time limit */
setInterval(() => { if (document.hidden || !isAdmin()) return; const added = escSweep(); if (added.some((n) => n.to === S.userId)) { render(); escAnnounce(); } }, 60000);
