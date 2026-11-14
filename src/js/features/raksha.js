/* ===== Raksha AI: case assistant for station officers and the Commissioner ===== */
ui.rk = { open: false, q: "", msgs: [] };
const rkNorm = (s) => String(s || "").toUpperCase().replace(/[\s\-_/.]+/g, "");
/* Find a complaint or case by its code: CMP/2026/1001, cmp 2026 1001, 1001 or an old case number such as DEMO-205 */
function rkFind(q) {
  const n = rkNorm(q);
  if (n.length < 3) return null;
  const ids = C.map((c) => c.id).concat(S.records.filter((r) => r.status !== "draft").map((r) => r.id));
  let id = ids.find((x) => rkNorm(x) === n);
  if (!id && /^\d{3,6}$/.test(n)) { const m = ids.filter((x) => CODE_RE.test(x) && x.endsWith("/" + n)); if (m.length === 1) id = m[0]; }
  return id ? caseItem(id) : null;
}
const RK_STAT = { draft: "Draft, not submitted", pending: "Waiting for officer verification", verified: "Verified" };
function rkEsc(it) {
  if (!isCP()) return null;
  const rows = cpEscRows([it]);
  if (rows.length) return { text: escWhyText(rows[0]), to: mustAct(it), days: rows[0].days };
  const t = escItems().find((x) => x.kind === "task" && x.ref === it.id && x.level);
  return t ? { text: isKn() ? `"${t.title}" ಕಾರ್ಯದ ಮೇಲೆ ${t.idleDays} ದಿನಗಳಿಂದ ಕ್ರಮವಿಲ್ಲ` : `Task "${t.title}" has had no action for ${t.idleDays} days`, to: t.owner || "u-sho", days: t.idleDays } : null;
}
function rkPeople(it) {
  if (it.r) return (it.r.people || []).filter((p) => p.name);
  const c = it.c;
  return [{ name: c.person.name, role: "Complainant", idType: c.idp.type, idMasked: maskId(c.idp.type, c.idp.number), address: [c.addr.house, c.addr.street, c.addr.village, c.addr.pin].filter(Boolean).join(", ") }].concat(complaintAccused(c).map((n) => ({ name: n, role: "Accused" })));
}

/* Collect only the facts the briefing may use. No ID numbers, no phone numbers. */
function rkFacts(it) {
  const c = it.c, r = it.r;
  const tl = caseTimeline(it).filter((e) => e.by !== "system").slice(-8).map((e) => ({ when: fmtDT(e.at), event: e.title, detail: e.text || "", by: whoName(e.by) }));
  const esc = rkEsc(it);
  const lu = lastUpdate(it);
  return {
    code: it.id, source: SRC_LABEL[it.kind], category: it.cat, police_station: it.station, current_stage: stageLabel(it.stage),
    verification: c ? C_STATUS[c.status][0] : RK_STAT[r.status] || r.status, fir_number: it.fir || "", filed_on: fmtDT(it.filedAt),
    incident: { date: it.date ? fmtDate(it.date) : "", time: it.time || "", place: it.place || "" }, what_was_reported: it.summary || "",
    people: rkPeople(it).map((p) => ({ name: p.name, role: p.role, alias: p.alias || undefined })),
    property: c ? [c.incident.property, c.incident.value ? "about Rs " + c.incident.value : ""].filter(Boolean).join(", ") : "",
    sections_of_law: r ? (r.sections || []).map(lawOf).filter(Boolean).map((l) => `${l.en}: ${lawRef(l)}`) : [],
    handling_officer: it.officer ? whoName(it.officer) : "Not given yet",
    last_update: { when: fmtDT(lu.at), by: whoName(lu.by), title: lu.title, text: lu.text || "", what: [lu.title, lu.text].filter(Boolean).join(": ") },
    open_tasks: r ? S.tasks.filter((t) => t.recordId === r.id && t.status === "open").map((t) => ({ task: t.title, owner: t.assignee ? ownerName(t.assignee) : "No owner", due: fmtDate(t.due) })) : [],
    timeline: tl, recorded_next_step: nextStepOf(it), escalation: esc ? (isKn() ? `${esc.text}. ಆಯುಕ್ತರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ. ಕ್ರಮ ಕೈಗೊಳ್ಳಬೇಕಾದವರು: ${escToText(esc.to)}.` : `${esc.text}. Escalated to the Commissioner. Must act: ${escName(esc.to)}.`) : "",
    commissioner_remarks: it.track.filter((x) => x.kind === "remark").slice(-2).map((x) => x.text),
    connected_cases: connOf(it.id).slice(0, 4).map((x) => ({ code: x.id, reason: x.reasons.map((y) => KIND_TEXT[y.kind] + " " + y.value).join(", ") })),
  };
}

/* Plain briefing from the facts (shown at once, and when AI is off) */
const rkFirst = (t, n) => { const s = String(t || "").replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+/); return s.slice(0, n).join(" "); };
function rkRuleBrief(F) {
  const kn = isKn();
  const when = [F.incident.date, F.incident.time].filter(Boolean).join(", ");
  const overview = kn
    ? `${F.code} ಒಂದು ${trStr(F.category)} ದೂರು (${trStr(F.source)}), ${trStr(F.police_station)}. ಈಗಿನ ಹಂತ: ${trStr(F.current_stage)}.${F.fir_number ? ` FIR ಸಂಖ್ಯೆ ${F.fir_number}.` : " ಇನ್ನೂ FIR ಇಲ್ಲ."}`
    : `${F.code} is a ${F.category.toLowerCase()} complaint (${F.source.toLowerCase()}) at ${F.police_station}. Current stage: ${F.current_stage}.${F.fir_number ? ` FIR No. ${F.fir_number}.` : " No FIR yet."}`;
  const what = [when || F.incident.place ? (kn ? `${when}${F.incident.place ? (when ? ", " : "") + F.incident.place : ""}.` : `${when ? "On " + when : ""}${F.incident.place ? (when ? ", at " : "At ") + F.incident.place : ""}.`) : "", rkFirst(F.what_was_reported, 3)].filter(Boolean).join(" ");
  const pg = [];
  pg.push(kn ? `ಪರಿಶೀಲನೆ: ${trStr(F.verification)}. ನಿರ್ವಹಿಸುವ ಅಧಿಕಾರಿ: ${F.handling_officer}.` : `Verification: ${F.verification}. Handling officer: ${F.handling_officer}.`);
  pg.push(kn ? `ಕೊನೆಯ ಮಾಹಿತಿ ${F.last_update.when} (${F.last_update.by}): ${trStr(F.last_update.title)}${F.last_update.text ? ": " + F.last_update.text : ""}` : `Last update on ${F.last_update.when} by ${F.last_update.by}: ${F.last_update.what}${/[.!?]$/.test(F.last_update.what) ? "" : "."}`);
  if (F.open_tasks.length) pg.push(kn ? `${F.open_tasks.length} ಮುಂದಿನ ಕಾರ್ಯ(ಗಳು) ಬಾಕಿ.` : `${F.open_tasks.length} follow-up task${F.open_tasks.length > 1 ? "s" : ""} open.`);
  if (F.escalation) pg.push(F.escalation);
  if (F.commissioner_remarks.length && !/^Remark from the Commissioner/.test(F.last_update.what)) pg.push(kn ? `ಆಯುಕ್ತರ ಸೂಚನೆ: ${F.commissioner_remarks[F.commissioner_remarks.length - 1]}` : `Commissioner remark: ${F.commissioner_remarks[F.commissioner_remarks.length - 1]}`);
  return { overview, what_happened: what, progress: pg.join(" "), next_step: kn ? trStr(F.recorded_next_step) : F.recorded_next_step };
}

async function rkAskAI(F) {
  const lang = isKn() ? "Kannada" : "English";
  const prompt = `You are Raksha, the case assistant inside JanaRaksha AI, a police records prototype for Kalaburagi. All data is fictional test data.
Using ONLY the facts in the JSON below, write a short, clear briefing for a police officer. Write in ${lang}. Use simple words and short sentences.
Rules: do not add any fact, name, date or guess that is not in the JSON. Do not give legal opinions or say who is guilty. Do not write ID numbers or phone numbers. Keep the complaint code, FIR number and dates exactly as given.
Return only JSON: {"overview":"1 to 2 sentences: what the case is, the station, the stage and the FIR number if any","what_happened":"2 to 4 sentences: what happened, when and where","progress":"2 to 4 sentences: current status, what was done last, by whom and when, and any escalation or remark","next_step":"1 sentence: the next action, based only on recorded_next_step, open tasks or missing steps"}

FACTS:
${JSON.stringify(F)}`;
  const v = await askJSON(prompt, { max_tokens: 800 });
  if (!v || typeof v.overview !== "string") throw { code: "bad_output" };
  return { overview: v.overview, what_happened: v.what_happened || "", progress: v.progress || "", next_step: v.next_step || "" };
}

/* ---------- Views ---------- */
function rkDetails(it) {
  const c = it.c, ppl = rkPeople(it);
  const comp = ppl.find((p) => SIGNERS.includes(p.role)) || ppl[0] || {};
  const acc = ppl.filter((p) => p.role === "Accused").map((p) => p.name + (p.alias ? ` (${p.alias})` : ""));
  const row = (k, v) => (v ? `<div class="rk-f"><span class="k">${k}</span><span class="v">${v}</span></div>` : "");
  return `<div class="rk-facts">
    ${row("Complainant", `<span data-notr>${h(comp.name || "")}</span>`)}
    ${row("ID proof", comp.idMasked ? `<span>${h(comp.idType === "pan" ? "PAN Card" : idTypeOf(comp.idType).label)}</span> <span class="mono">${h(comp.idMasked)}</span>` : "")}
    ${row("Mobile", it.phone ? `<span class="mono">${h(maskPhone(it.phone))}</span>` : "")}
    ${row("Address", comp.address ? `<span data-notr>${h(comp.address)}</span>` : "")}
    ${row("Accused", acc.length ? `<span data-notr>${h(acc.join(", "))}</span>` : "")}
    ${row("Property", c && c.incident.property ? `<span data-notr>${h(c.incident.property + (c.incident.value ? " (Rs " + c.incident.value + ")" : ""))}</span>` : "")}
    ${row("Place", it.place ? `<span data-notr>${h(it.place)}</span>` : "")}
    ${row("Police station", h(it.station))}
    ${row("Filed on", h(fmtDT(it.filedAt)))}
    ${row("Handling officer", `<span data-notr>${h(it.officer ? whoName(it.officer) : "Not given yet")}</span>`)}
  </div>`;
}
function rkAnswerHTML(m) {
  if (m.kind === "notfound") {
    const q = `<b class="mono">${h(m.q)}</b>`;
    return `<div class="rk-msg bot"><div class="rk-nf">${ICON.x}<div data-notr>${isKn()
      ? `<b>ಈ ಪ್ರಕರಣ ಅಸ್ತಿತ್ವದಲ್ಲಿಲ್ಲ.</b><span>${q} ಸಂಖ್ಯೆಯ ಯಾವುದೇ ಪ್ರಕರಣ ಅಥವಾ ದೂರು ಇಲ್ಲ. ಸಂಖ್ಯೆಯನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.</span><span class="tiny muted">ದೂರು ಕೋಡ್ ಉದಾಹರಣೆ: CMP/2026/1001. ಹಳೆಯ ಪ್ರಕರಣ ಸಂಖ್ಯೆ ಉದಾಹರಣೆ: DEMO-205.</span>`
      : `<b>This case does not exist.</b><span>No case or complaint has the code ${q}. Check the code and try again.</span><span class="tiny muted">Complaint codes look like CMP/2026/1001. Old case numbers look like DEMO-205.</span>`}</div></div></div>`;
  }
  if (m.kind === "hello") return `<div class="rk-msg bot"><p>Hello, I am Raksha. Type a complaint code, for example CMP/2026/1001. I will show the case details, what happened, the current status, the FIR number and the live progress.</p></div>`;
  const it = caseItem(m.id); if (!it) return "";
  const B = m.brief || {};
  const esc = rkEsc(it);
  const lu = lastUpdate(it);
  const open = isCP() ? `<button class="btn sm primary" data-act="rkOpenCP" data-id="${h(it.id)}">Open in progress tracking</button>`
    : it.c ? `<button class="btn sm primary" data-act="rkOpenCmp" data-id="${h(it.id)}">Open complaint</button>` : `<button class="btn sm primary" data-act="rkOpenCase" data-id="${h(it.id)}">Open case</button>`;
  return `<div class="rk-msg bot rk-card">
    <div class="rk-h"><span class="mono" style="font-weight:700">${h(it.id)}</span><span class="spacer"></span><span class="chip info plain">${h(it.cat)}</span>${stageChip(it.stage)}${esc ? `<span class="chip crit plain">Escalated</span>` : ""}</div>
    ${stepperHTML(it, true)}
    <div class="rk-src ${m.ai ? "ai" : ""}">${m.busy ? `<span class="spin" aria-hidden="true"></span><span>Raksha AI is writing a summary…</span>` : m.ai ? `${ICON.spark}<span>AI summary from the record. Check the facts below.</span>` : `<span>Summary from the record.</span>`}</div>
    <div class="rk-sec"><b>What the case is</b><p data-notr>${h(B.overview)}</p></div>
    ${B.what_happened ? `<div class="rk-sec"><b>What happened</b><p data-notr>${h(B.what_happened)}</p></div>` : ""}
    <div class="rk-sec"><b>Current status</b><p data-notr>${h(B.progress)}</p></div>
    <div class="rk-fir ${it.fir ? "" : "none"}"><span class="lbl">FIR number</span>${it.fir ? `<b class="mono" data-notr>${h(it.fir)}</b><span class="small">${h(it.station)}${it.verifiedAt ? " · " + h(fmtDate(istDay(it.verifiedAt))) : ""}</span>` : `<b>${it.stage === "filed" ? "Not registered yet" : it.stage === "rejected" ? "Not registered (not accepted)" : "No FIR for this type of complaint"}</b>`}</div>
    <details class="rk-more" open><summary>Case details</summary>${rkDetails(it)}</details>
    <div class="rk-sec rk-live"><b>Live tracking <span class="live"><span class="live-dot"></span>Live</span></b>
      <div class="small rk-lu"><span>Handling officer:</span> <b data-notr>${h(it.officer ? whoName(it.officer) : "Not given yet")}</b> · <span>Last update:</span> <b>${h(fmtDT(lu.at))}</b> · <span data-notr>${h(whoName(lu.by))}</span></div>
      ${esc ? `<div class="rk-esc">${ICON.clock}<span><span data-notr>${h(esc.text)}.</span> <span>Must act:</span> <span data-notr>${h(escToText(esc.to))}</span></span></div>` : ""}
      ${timelineHTML(it, 6, true)}</div>
    ${B.next_step ? `<div class="rk-sec next"><b>Next step</b><p data-notr>${h(B.next_step)}</p></div>` : ""}
    <details class="rk-more"><summary>Connected cases (${connOf(it.id).length})</summary>${connHTML(connOf(it.id), 5)}</details>
    <div class="row" style="gap:6px;margin-top:8px">${open}</div>
  </div>`;
}
function rkSuggest() {
  const out = [];
  const add = (x) => { if (x && !out.includes(x) && caseItem(x)) out.push(x); };
  if (isCP()) { const e = cpEscRows(caseItems().filter((i) => i.kind === "online"))[0]; if (e) add(e.it.id); }
  ["CMP/2026/1001", "CMP/2026/1004", "CMP/2026/1003", "DEMO-205"].forEach(add);
  return out.slice(0, 4);
}
function vRaksha() {
  if (!isAdmin()) return "";
  const R = ui.rk;
  if (!R.open) return `<button class="rk-fab" data-act="rkToggle" aria-label="Open Raksha AI case assistant">${rkIcon()}<span><b>Raksha AI</b><span>Ask about a case</span></span></button>`;
  const msgs = R.msgs.length ? R.msgs : [{ kind: "hello" }];
  return `<section class="rk-panel" role="dialog" aria-label="Raksha AI case assistant">
    <header class="rk-top">${rkIcon()}<div style="flex:1;min-width:0"><b>Raksha AI</b><span>Case and complaint assistant</span></div><button class="x" data-act="rkToggle" aria-label="Close">${ICON.x}</button></header>
    <div class="rk-body" id="rk-body">${msgs.map((m) => (m.kind === "q" ? `<div class="rk-msg me" data-notr>${h(m.q)}</div>` : rkAnswerHTML(m))).join("")}</div>
    <div class="rk-chipsrow"><span class="tiny muted">Try:</span>${rkSuggest().map((x) => `<button class="law-pill" data-act="rkAskId" data-id="${h(x)}"><span class="mono" data-notr>${h(x)}</span></button>`).join("")}</div>
    <form class="rk-in" data-form="rkAsk"><label class="sr" for="rk-q">Complaint code</label><input id="rk-q" class="input mono" data-bind="rkq" value="${h(R.q)}" placeholder="Complaint code, for example CMP/2026/1001" autocomplete="off" /><button class="btn primary" type="submit">Ask</button></form>
  </section>`;
}
function rkIcon() { return `<span class="rk-ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z"/><path d="M12 8.5l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z" fill="currentColor"/></svg></span>`; }
function paintRaksha() {
  const box = $("#raksha"); if (!box) return;
  const old = $("#rk-body"), keep = old ? old.scrollTop : null;
  paint(box, vRaksha());
  document.body.classList.toggle("has-raksha", isAdmin());
  document.body.classList.toggle("rk-open", isAdmin() && ui.rk.open);
  const b = $("#rk-body"); if (!b) return;
  if (ui.rk.jump) { ui.rk.jump = false; const q = b.querySelectorAll(".rk-msg.me"); const m = q[q.length - 1]; b.scrollTop = m ? m.offsetTop - 10 : b.scrollHeight; }
  else b.scrollTop = keep == null ? b.scrollHeight : keep;
}
function renderRaksha() { const f = captureFocus(); paintRaksha(); restoreFocus(f); }

/* ---------- Actions ---------- */
async function rkAsk(q) {
  q = String(q || "").trim(); if (!q) { toast("Type a complaint code.", "warn"); return; }
  const R = ui.rk; R.q = "";
  R.msgs.push({ kind: "q", q }); R.jump = true;
  const f = rkFind(q);
  if (!f) {
    R.msgs.push({ kind: "notfound", q });
    log("Raksha AI lookup", "", `No case found for "${q.slice(0, 40)}"`); save(); renderRaksha(); return;
  }
  const facts = rkFacts(f);
  const m = { kind: "answer", id: f.id, facts, brief: rkRuleBrief(facts), ai: false, busy: !!AI };
  R.msgs.push(m);
  log("Raksha AI lookup", f.id, `${me().name} asked Raksha about ${f.id}`); save();
  renderRaksha();
  if (!AI) return;
  try { m.brief = await rkAskAI(facts); m.ai = true; }
  catch (e) { if (e && (e.code === "not_granted" || e.code === "rate_limited")) aiFail(e); }
  m.busy = false; R.jump = R.msgs[R.msgs.length - 1] === m; renderRaksha();
}
const RKACT = {
  rkToggle() { ui.rk.open = !ui.rk.open; renderRaksha(); if (ui.rk.open) setTimeout(() => { const i = $("#rk-q"); if (i) i.focus(); }, 0); },
  rkAskId(el) { rkAsk(el.dataset.id); },
  rkOpenCase(el) { const r = getRec(el.dataset.id); if (!r) return; if (rkSmall()) ui.rk.open = false; if (r.status === "verified") ACT.openCase(el); else ACT.openRecord(el); },
  rkOpenCmp(el) { if (rkSmall()) ui.rk.open = false; openComplaintById(el.dataset.id); },
  rkOpenCP(el) { if (rkSmall()) ui.rk.open = false; ACT.cpOpen(el); },
};
const rkSmall = () => window.innerWidth < 700;
const RKBIND = { rkq(el) { ui.rk.q = el.value; } };
const RKFORMS = { rkAsk() { const i = $("#rk-q"); rkAsk(i ? i.value : ui.rk.q); } };
