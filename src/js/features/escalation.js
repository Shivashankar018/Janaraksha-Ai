/* ===== Escalation: work not done in time is escalated to the Commissioner; station officers see only the instructions ===== */
const ESC_DAY_CHOICES = [3, 5, 6, 7, 10];
const ESC_UP = { CLERK: "u-si", HC: "u-si", SI: "u-sho", SHO: "acp" };
const DYSP_NAME = "ACP / DySP of the sub-division";

function escInit() {
  S.esc = S.esc || { days: 7 };
  S.escShift = S.escShift || 0;
  S.escNotes = S.escNotes || [];
  S.escSent = S.escSent || {};
  /* Older versions sent escalations to station officers. Escalation now goes only to the Commissioner. */
  if (!S.escV2) { S.escNotes = S.escNotes.filter((n) => !["escalated", "escalated-own", "response", "instruction-sent"].includes(n.kind)); S.escSent = {}; S.escV2 = true; }
}
const escDays = () => (S.esc && S.esc.days) || 7;
const escName = (id) => (id === "dysp" || id === "acp" ? DYSP_NAME : id && id.startsWith("sho:") ? "SHO, " + id.slice(4) : id ? ownerName(id) : "No officer");
const escRole = (id) => { const u = USERS.find((x) => x.id === id); return u ? u.role : null; };

/* Chain of seniors above the owner. Work with no officer, or with a person outside the list, goes to the SHO first. */
/* Chain: officer > SHO > ACP / DySP > Commissioner. Stations without demo users use "SHO, <station>". */
function escChain(ownerId, station) {
  const role = escRole(ownerId);
  const local = !station || station === homeStation();
  const chain = [];
  let cur = role && role !== "CP" ? ESC_UP[role] : local ? "u-sho" : "sho:" + station;
  while (cur) { chain.push(cur); cur = cur === "u-cp" ? null : cur === "acp" || cur === "dysp" ? "u-cp" : cur.startsWith("sho:") ? "acp" : ESC_UP[escRole(cur)]; }
  return chain;
}

/* All open work that has an officer clock: follow-up tasks and online complaints waiting for police action */
function escItems() {
  escInit();
  const L = escDays(), now = nowMs(), out = [];
  const add = (it) => {
    const idle = Math.max(0, (now - Date.parse(it.last)) / DAY);
    const chain = escChain(it.owner, it.station);
    const level = idle >= L ? Math.min(chain.length, 1 + Math.floor((idle - L) / L)) : 0;
    out.push(Object.assign(it, { idle, idleDays: Math.floor(idle), daysLeft: Math.max(0, Math.ceil(L - idle)), chain, level, escTo: level ? chain[level - 1] : null }));
  };
  S.tasks.filter((t) => t.status === "open").forEach((t) => {
    const e = t.esc || {};
    const st = (getRec(t.recordId) || {}).station || HOME_STATION;
    if (SESSION && !isCP() && SESSION.station !== "all" && st !== SESSION.station) return;
    add({ key: "task:" + t.id, kind: "task", id: t.id, ref: t.recordId, title: t.title, owner: t.assignee || "", last: t.lastActionAt || t.assignedAt || t.createdAt, obj: t, esc: e, station: st });
  });
  C.filter((c) => ["submitted", "review"].includes(c.status)).filter((c) => !SESSION || SESSION.station === "all" || c.station === SESSION.station).forEach((c) => {
    const e = c.esc || {};
    const times = [c.createdAt].concat((c.history || []).filter((x) => x.by && x.by !== "citizen").map((x) => x.at)).concat(e.lastAt ? [e.lastAt] : []);
    const last = times.sort().slice(-1)[0];
    add({ key: "cmp:" + c.id, kind: "complaint", id: c.id, ref: c.id, title: `${catOf(c.incident.category).label}: ${c.person.name}`, owner: c.status === "review" ? c.assignedTo || "" : "", last, obj: c, esc: e, station: c.station });
  });
  return out;
}
const CP_ID = "u-cp";
/* Escalation is a Commissioner view. Station officers see only the instructions the Commissioner sends. */
const ESC_POLICE_HIDE = ["escalated", "escalated-own", "instruction-sent", "response"];
const ESC_LOG_CP = ["Escalated to senior officer", "Escalated to the Commissioner", "Escalation time limit changed", "Demo clock moved"];
const auditVis = (a) => isCP() || !ESC_LOG_CP.includes(a.action);
const escMyNotes = () => (S.escNotes || []).filter((n) => n.to === S.userId && (isCP() ? n.kind !== "instruction-sent" : !ESC_POLICE_HIDE.includes(n.kind)));
const escMyUnread = () => escMyNotes().filter((n) => !n.read);
const bellCount = () => cUnread().length + (isAdmin() ? escMyUnread().length : 0);

function escNote(to, kind, it, extra) {
  if (!to || !USERS.some((u) => u.id === to)) return null;
  const n = Object.assign({ id: "EN-" + (S.escNotes.length + 1) + "-" + Math.random().toString(36).slice(2, 5), to, kind, key: it.key, ref: it.ref, title: it.title, at: nowISO(), read: false }, extra || {});
  S.escNotes.push(n);
  return n;
}

/* All escalated work, as the Commissioner sees it: online complaints and station follow-up tasks */
function cpEscAll() {
  const rows = cpEscRows().map((r) => ({
    key: (r.why === "noprogress" ? "prog:" : "cmp:") + r.it.id, kind: "complaint", ref: r.it.id, caseId: r.it.id, station: r.it.station, title: `${r.it.cat}: ${r.it.name}`,
    days: r.days, why: r.why, L: r.L, level: r.level, last: r.last, owner: r.it.officer || "", stage: r.it.stage, it: r.it, obj: r.it.c || r.it.r,
  }));
  escItems().filter((x) => x.kind === "task" && x.level).forEach((x) => {
    const it = caseItem(x.ref);
    rows.push({ key: x.key, kind: "task", ref: x.ref, caseId: x.ref, station: x.station, title: x.title, days: x.idleDays, why: "task", L: escDays(), level: x.level, last: x.last, owner: x.owner, stage: it ? it.stage : "", it, obj: x.obj });
  });
  return rows.sort((a, b) => b.days - a.days);
}
const cpRowFind = (key) => cpEscAll().find((r) => r.key === key);
/* The officer who must act: the responsible officer, or the SHO when nobody has opened the work yet */
const escResp = (r) => r.owner || (r.station === homeStation() ? "u-sho" : "sho:" + r.station);
const escTarget = (r) => { const o = escResp(r); return USERS.some((u) => u.id === o && u.role !== "CP") ? o : r.station === homeStation() ? "u-sho" : ""; };
function escLast(obj) { const a = (obj && obj.esc && obj.esc.instructions) || []; return a.length ? a[a.length - 1] : null; }
function escLastResp(obj) { const a = (obj && obj.esc && obj.esc.responses) || []; return a.length ? a[a.length - 1] : null; }

/* Look for work that passed the time limit and tell the Commissioner (once for each period without action) */
function escSweep() {
  escInit();
  const added = [];
  cpEscAll().forEach((r) => {
    const k = `${r.key}|${r.last}`;
    if (S.escSent[k]) return;
    S.escSent[k] = nowISO();
    const n = escNote(CP_ID, "escalated", r, { owner: r.owner, idleDays: r.days, station: r.station, why: r.why });
    if (n) added.push(n);
    logSys("Escalated to the Commissioner", r.ref, `${r.title}: ${escWhyEn(r)}. ${r.station}.`);
  });
  if (added.length) save();
  return added;
}
function escAnnounce() {
  if (!isAdmin()) return;
  const un = escMyUnread();
  if (isCP()) {
    const n = un.filter((x) => x.kind === "escalated").length, rep = un.filter((x) => x.kind === "response").length;
    if (n) toast(`${n} item${n > 1 ? "s" : ""} escalated to you. A station did not act in time.`, "warn", () => go("escalations"), "Review");
    if (rep) toast(`${rep} repl${rep > 1 ? "ies" : "y"} from stations to your instructions.`, "", () => go("escalations"), "Open");
    return;
  }
  const ins = un.filter((x) => ["instruction", "assigned"].includes(x.kind));
  if (ins.length) toast(`The Commissioner sent ${ins.length} instruction${ins.length > 1 ? "s" : ""}. Please act and reply.`, "warn", () => escOpenNoteObj(ins[0]), "Open");
}

/* Find the work behind a key: task:ID, cmp:CODE or prog:CODE */
function escObj(key) {
  const i = key.indexOf(":"), pre = key.slice(0, i), id = key.slice(i + 1);
  if (pre === "task") { const t = S.tasks.find((x) => x.id === id); return t ? { key, kind: "task", obj: t, ref: t.recordId, caseId: t.recordId, title: t.title } : null; }
  const o = getC(id) || getRec(id); if (!o) return null;
  const it = caseItem(id);
  return { key, kind: "complaint", obj: o, ref: id, caseId: id, title: it ? `${it.cat}: ${it.name}` : id };
}
/* The station did something: the clock starts again and the Commissioner is told */
function escActed(key, text) {
  const e = escObj(key); if (!e) return;
  const obj = e.obj;
  obj.esc = obj.esc || {};
  obj.esc.lastAt = nowISO();
  if (e.kind === "task") obj.lastActionAt = obj.esc.lastAt;
  const told = (S.escNotes || []).filter((n) => n.key === key && ["escalated", "instruction-sent"].includes(n.kind)).map((n) => n.to).concat((obj.esc.instructions || []).map((x) => x.by));
  uniq(told).filter((s) => s !== S.userId).forEach((s) => escNote(s, "response", e, { by: S.userId, text }));
  if (getC(e.ref) && e.kind !== "task") saveComplaint(getC(e.ref));
}
const escActedCase = (id, text) => ["cmp:" + id, "prog:" + id].forEach((k) => { if ((S.escNotes || []).some((n) => n.key === k)) escActed(k, text); });

/* ---------- Views (Commissioner) ---------- */
const escWhyEn = (r) => (r.why === "notopened" ? `Station did not open the complaint in ${r.L} days` : r.why === "notverified" ? `Verification not finished in ${r.L} days` : r.why === "task" ? `Follow-up task: no action for ${r.days} days` : `No progress update for ${r.days} days`);
const escRespHTML = (r) => `<span data-notr>${h(escToText(escResp(r)))}</span>`;
function escRowCP(r) {
  const ins = escLast(r.obj), rep = escLastResp(r.obj);
  const home = r.station === homeStation();
  const tgt = escTarget(r);
  return `<div class="esc-row late ${ui.escFocus === r.key ? "focus" : ""} ${r.level >= 3 ? "sev" : ""}" id="esc-${h(r.key.replace(/\W/g, "-"))}">
    <div class="esc-main">
      <div class="row" style="gap:6px">${r.kind === "task" ? `<span class="chip info plain">Follow-up task</span>` : `<span class="chip accent plain">Online complaint</span>`}<button class="linkbtn mono small" style="font-weight:700" data-act="cpOpen" data-id="${h(r.caseId)}">${h(r.ref)}</button>${r.stage ? stageChip(r.stage) : ""}</div>
      <b class="esc-title" data-notr>${h(r.title)}</b>
      <div class="esc-facts">
        <div><span class="k">Police station</span><span class="v">${h(r.station)}</span></div>
        <div><span class="k">Pending days</span><span class="v">${daysTxt(r.days)}</span></div>
        <div><span class="k">Escalation reason</span><span class="v small">${h(escWhyText(r))}</span></div>
        <div><span class="k">Must act</span><span class="v small">${escRespHTML(r)}</span></div>
      </div>
      ${ins ? `<div class="esc-ins"><b>Your instruction</b> · <span>Act by ${h(fmtDate(ins.due))}</span>${ins.to ? ` · <span>To</span> <span data-notr>${h(whoName(ins.to))}</span>` : ""}<div data-notr>${h(ins.text)}</div></div>` : ""}
      ${rep && (!ins || rep.at > ins.at) ? `<div class="esc-resp"><b>Reply from <span data-notr>${h(whoName(rep.by))}</span></b> · <span>${h(fmtDT(rep.at))}</span><div data-notr>${h(rep.text)}</div></div>` : ""}
    </div>
    <div class="esc-act"><button class="btn sm primary" data-act="escInstruct" data-key="${h(r.key)}">${ICON.pen}Send instruction</button>${home && tgt ? `<button class="btn sm" data-act="escReassign" data-key="${h(r.key)}">Give to another officer</button>` : ""}<button class="btn sm" data-act="cpOpen" data-id="${h(r.caseId)}">Track</button></div>
  </div>`;
}
function vCPEsc() {
  escInit();
  const all = cpEscAll();
  const rows = byStation(all, (r) => r.station);
  const L = escDays();
  const soon = byStation(escItems().filter((x) => !x.level && x.daysLeft <= 2), (x) => x.station).sort((a, b) => a.daysLeft - b.daysLeft);
  const sts = uniq(rows.map((r) => r.station));
  const replies = escMyNotes().filter((n) => n.kind === "response").slice(-5).reverse();
  return `${intro()}
  <div class="row cp-filter"><label class="lbl" for="cpSt3" style="margin:0">Police station</label>${stationSelect("cpSt3", "cpSt", cpSt())}<span class="spacer"></span><span class="live"><span class="live-dot"></span>Live</span></div>
  <section class="grid g4 cp-kpis" aria-label="Escalation summary">
    <div class="card kpi stripe" style="--k:var(--crit)"><span class="l">Escalated now</span><span class="v">${rows.length}</span><span class="s muted">${sts.length} station${sts.length === 1 ? "" : "s"}</span></div>
    <div class="card kpi stripe" style="--k:var(--accent)"><span class="l">Online complaints</span><span class="v">${rows.filter((r) => r.kind === "complaint").length}</span><span class="s muted">Not opened, not verified or no progress</span></div>
    <div class="card kpi stripe" style="--k:var(--info)"><span class="l">Station follow-up tasks</span><span class="v">${rows.filter((r) => r.kind === "task").length}</span><span class="s muted">No action within ${L} days</span></div>
    <div class="card kpi stripe" style="--k:var(--warn)"><span class="l">Due soon</span><span class="v">${soon.length}</span><span class="s muted">Escalates in 2 days or less</span></div>
  </section>
  <section class="card esc-rules"><div class="card-h"><h3>Time limit for station action</h3></div>
    <div class="card-b stack">
      <p>If a station does not open or verify an online complaint within ${L} days, or a follow-up task has no action for ${L} days, the work comes to you here. A registered complaint with no progress update for ${L * 2} days also comes here. Station officers do not see escalations. They see only the instructions you send.</p>
      <div class="row"><span class="lbl" style="margin:0">Time limit</span><div class="seg" role="radiogroup" aria-label="Time limit in days">${ESC_DAY_CHOICES.map((d) => `<button role="radio" aria-checked="${d === L}" class="${d === L ? "on" : ""}" data-act="escSetDays" data-v="${d}">${d} days</button>`).join("")}</div></div>
      <div class="esc-clock"><span><b>Demo clock</b> · <span>${S.escShift ? `Today + ${S.escShift} day${S.escShift > 1 ? "s" : ""}` : "Real time"}</span> · <span>${h(fmtDate(todayIST()))}</span></span><span class="spacer"></span>
        <button class="btn sm" data-act="escShift" data-v="1">Move 1 day forward</button><button class="btn sm" data-act="escShift" data-v="${L}">Move ${L} days forward</button>${S.escShift ? `<button class="btn sm ghost" data-act="escShift" data-v="0">Back to real time</button>` : ""}</div>
      <p class="help">The demo clock lets you show an escalation without waiting. Real use has no such button.</p>
    </div></section>
  <section class="card"><div class="card-h"><h2>Escalated work</h2><span class="chip ${rows.length ? "crit" : "ok"} plain">${rows.length}</span><span class="muted small">Longest pending first</span></div>
    <div class="card-b stack" style="gap:10px">${rows.length ? rows.map(escRowCP).join("") : `<p class="muted small">No escalated work. Every station acted in time.</p>`}</div></section>
  ${replies.length ? `<section class="card"><div class="card-h"><h3>Replies from stations</h3></div><div class="card-b feed">${replies.map((n) => `<div class="fi"><span class="d" style="background:var(--ok)"></span><div><button class="linkbtn mono" data-act="cpOpen" data-id="${h(n.ref)}">${h(n.ref)}</button> · <span data-notr>${h(whoName(n.by))}</span><div class="small" data-notr>${h(n.text || "")}</div><div class="tiny muted">${h(ago(n.at))}</div></div></div>`).join("")}</div></section>` : ""}
  ${soon.length ? `<section class="card"><div class="card-h"><h3>Due soon</h3><span class="muted small">Not escalated yet</span></div><div class="card-b stack" style="gap:6px">${soon.map((x) => `<div class="row small" style="gap:8px"><span class="chip warn plain">${x.daysLeft === 0 ? "Escalates today" : `Escalates in ${x.daysLeft} day${x.daysLeft === 1 ? "" : "s"}`}</span><button class="linkbtn mono" data-act="cpOpen" data-id="${h(x.ref)}">${h(x.ref)}</button><span data-notr>${h(x.title)}</span><span class="muted">${h(x.station)}</span></div>`).join("")}</div></section>` : ""}`;
}

/* ---------- Notifications ---------- */
function escNoteTitle(n) {
  if (n.kind === "escalated") return `<b>Escalated to you:</b> <span>work not done in time</span>`;
  if (n.kind === "response") return `<b><span data-notr>${h(whoName(n.by))}</span> replied:</b> <span>action taken</span>`;
  if (n.kind === "instruction") return `<b>Instruction from the Commissioner</b>`;
  if (n.kind === "assigned") return `<b>Work given to you by the Commissioner</b>`;
  if (n.kind === "cp-remark") return `<b>Remark from the Commissioner</b> <span data-notr>${h(n.text || "")}</span>`;
  return `<b>Update</b>`;
}
function escBellItems() {
  return escMyNotes().slice().sort((a, b) => b.at.localeCompare(a.at)).slice(0, 6).map((n) => `<button class="bi esc ${n.read ? "" : "unread"}" data-act="escOpenNote" data-id="${h(n.id)}"><span class="d"></span><span style="min-width:0"><span class="small">${escNoteTitle(n)}</span><span class="small" data-notr>${h(n.title)}</span>${n.kind === "instruction" && n.text ? `<span class="small" data-notr>“${h(n.text)}”</span>` : ""}<span class="tiny muted"><span class="mono">${h(n.ref)}</span> · ${h(ago(n.at))}</span></span></button>`).join("");
}
function escOpenNoteObj(n) {
  n.read = true; ui.bell = false; save();
  if (isCP()) { ui.escFocus = n.key; if (ui.page !== "escalations") go("escalations"); else render(); setTimeout(() => { const r = document.getElementById("esc-" + n.key.replace(/\W/g, "-")); if (r) r.scrollIntoView({ block: "center", behavior: "smooth" }); else { ui.cpSel = n.ref; go("cp-progress"); } }, 80); return; }
  if (getC(n.ref)) openComplaintById(n.ref);
  else { const r = getRec(n.ref); if (r && r.status === "verified") { ui.caseId = n.ref; ui.drawer = null; if (ui.page !== "workspace") go("workspace"); else render(); } else if (r) ACT.openRecord({ dataset: { id: n.ref } }); }
}
/* Instruction from the Commissioner, shown to the station on a task, complaint or case */
function escInsHTML(obj, key) {
  const ins = escLast(obj); if (!ins) return "";
  const rep = escLastResp(obj);
  const answered = rep && rep.at > ins.at;
  return `<div class="esc-ins"><div class="row" style="gap:6px"><b>Instruction from the Commissioner</b><span class="tiny muted">${h(fmtDT(ins.at))}</span>${answered ? `<span class="chip ok plain">Replied</span>` : `<span class="chip warn plain">Act by ${h(fmtDate(ins.due))}</span>`}</div><div data-notr>${h(ins.text)}</div>
    ${answered ? `<div class="tiny muted" style="margin-top:4px"><span>${isCP() ? "Reply from the station" : "Your reply"}</span>: <span data-notr>${h(rep.text)}</span></div>` : isCP() ? "" : `<button class="btn sm" style="margin-top:6px" data-act="escRespond" data-key="${h(ins.key || key)}">${ICON.check}Reply with action taken</button>`}</div>`;
}

/* ---------- Actions ---------- */
const EACT = {
  escSetDays(el) {
    if (!isCP()) return;
    const d = +el.dataset.v; const prev = escDays(); S.esc.days = d;
    log("Escalation time limit changed", "", `${prev} days to ${d} days`);
    escSweep(); save(); render(); toast(`Time limit set to ${d} days.`);
  },
  escShift(el) {
    if (!isCP()) return;
    const v = +el.dataset.v; S.escShift = v === 0 ? 0 : (S.escShift || 0) + v;
    log("Demo clock moved", "", S.escShift ? `Demo clock set to today + ${S.escShift} days` : "Demo clock back to real time");
    const added = escSweep(); save(); render();
    toast(S.escShift ? `Demo clock: today + ${S.escShift} days.` : "Demo clock is back to real time.");
    if (added.length) setTimeout(escAnnounce, 200);
  },
  escOpenNote(el) { const n = (S.escNotes || []).find((x) => x.id === el.dataset.id); if (n) escOpenNoteObj(n); },
  escInstruct(el) {
    const r = cpRowFind(el.dataset.key); if (!r) return;
    ui.escKey = r.key;
    const tgt = escTarget(r);
    openModal("Send an instruction to the station", `${tgt ? `<p class="small"><span>The instruction goes to:</span> <b data-notr>${h(whoName(tgt))}</b></p><p class="small">The officer sees it at once in notifications and in the complaint.</p>` : `<p class="small"><span>Police station:</span> <b>${h(r.station)}</b></p><p class="small">This station has no demo officer account. The station sees the instruction in the complaint timeline.</p>`}
      <p class="small muted" data-notr>${h(r.ref)} · ${h(r.title)} · ${h(r.station)}</p>
      <div class="field"><label for="escText">Instruction</label><textarea id="escText" class="textarea">${isKn() ? "ದಯವಿಟ್ಟು ಇದರ ಮೇಲೆ ಕ್ರಮ ಕೈಗೊಂಡು ನನಗೆ ಮಾಹಿತಿ ನೀಡಿ." : "Please take action on this and send me an update."}</textarea></div>
      <div class="field"><label for="escDue">Act by</label><input id="escDue" type="date" class="input" value="${h(addDays(todayIST(), 2))}" min="${h(todayIST())}" /></div>`,
      [{ label: "Cancel", act: "closeModal" }, { label: "Send instruction", act: "escInstructSend", cls: "primary" }]);
    setTimeout(() => { const t = $("#escText"); if (t) { t.focus(); t.select(); } }, 0);
  },
  escInstructSend() {
    const r = cpRowFind(ui.escKey); if (!r) { closeModal(); return; }
    const text = ($("#escText").value || "").trim(); const due = $("#escDue").value || addDays(todayIST(), 2);
    if (text.length < 3) { toast("Write the instruction first.", "warn"); return; }
    const tgt = escTarget(r);
    const obj = r.obj; obj.esc = obj.esc || {}; obj.esc.instructions = obj.esc.instructions || [];
    obj.esc.instructions.push({ key: r.key, by: S.userId, to: tgt, at: nowISO(), text, due });
    const e = progSaveObj(r.caseId, "", text, "", "", S.userId, "instruction"); if (e) e.due = due;
    if (tgt) escNote(tgt, "instruction", r, { by: S.userId, text, due });
    S.escNotes.push({ id: "EN-s" + Date.now().toString(36), to: S.userId, kind: "instruction-sent", key: r.key, ref: r.ref, title: r.title, at: nowISO(), read: true });
    log("Commissioner instruction sent", r.ref, `To ${tgt ? whoName(tgt) : r.station}: ${text} (act by ${due})`);
    if (getC(r.caseId)) saveComplaint(getC(r.caseId));
    save(); ui.modal = null; render(); toast(tgt ? `Instruction sent to ${whoName(tgt)}.` : `Instruction saved for ${r.station}.`);
  },
  escReassign(el) {
    const r = cpRowFind(el.dataset.key); if (!r) return;
    ui.escKey = r.key;
    const opts = POLICE_USERS().filter((u) => u.id !== r.owner).map((u) => `<option value="${u.id}">${h(u.name)} (${h(u.roleLabel || u.role)})</option>`).join("");
    openModal("Give the work to another officer", `<p class="small muted" data-notr>${h(r.ref)} · ${h(r.title)} · ${h(r.station)}</p>
      <div class="field"><label for="escTo">New responsible officer</label><select id="escTo" class="select">${opts}</select></div>
      <div class="field"><label for="escWhy">Note to the officer</label><input id="escWhy" class="input" value="${isKn() ? "ದಯವಿಟ್ಟು ಇದನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ. ಇದು ಸಮಯಕ್ಕೆ ಮುಗಿದಿಲ್ಲ." : "Please complete this. It was not done in time."}" /></div>
      <p class="help">The time limit starts again for the new officer.</p>`,
      [{ label: "Cancel", act: "closeModal" }, { label: "Give the work", act: "escReassignDo", cls: "primary" }]);
  },
  escReassignDo() {
    const r = cpRowFind(ui.escKey); if (!r) { closeModal(); return; }
    const to = $("#escTo").value; const why = ($("#escWhy").value || "").trim();
    const obj = r.obj; obj.esc = obj.esc || {}; obj.esc.lastAt = nowISO();
    if (r.kind === "task") { obj.assignee = to; obj.assignedAt = obj.lastActionAt = nowISO(); }
    else if (r.why !== "noprogress") { obj.assignedTo = to; if (obj.status === "submitted") { obj.status = "review"; obj.adminUnread = false; } cHist(obj, S.userId, "reassigned", "Officer changed by the Commissioner"); saveComplaint(obj); }
    else progSaveObj(r.caseId, "", `Work given to ${whoName(to)} by the Commissioner.${why ? " " + why : ""}`, "", to, S.userId);
    escNote(to, "assigned", r, { by: S.userId, text: why });
    log("Work given to another officer", r.ref, `${r.title}: from ${whoName(escResp(r))} to ${whoName(to)}. ${why}`);
    save(); ui.modal = null; render(); toast(`Work given to ${whoName(to)}. The time limit starts again.`);
  },
  escRespond(el) {
    const e = escObj(el.dataset.key); if (!e) return;
    ui.escKey = e.key;
    const ins = escLast(e.obj);
    openModal("Reply with the action taken", `${ins ? `<div class="esc-ins" style="margin-bottom:10px"><b>Instruction from the Commissioner</b><div data-notr>${h(ins.text)}</div></div>` : ""}
      <p class="small muted" data-notr>${h(e.ref)} · ${h(e.title)}</p>
      <div class="field"><label for="escReply">What did you do?</label><textarea id="escReply" class="textarea" placeholder="for example Visited the bus stand and collected CCTV footage. Statement recorded."></textarea></div>
      <p class="help">Your reply goes to the Commissioner and into the case timeline.</p>`,
      [{ label: "Cancel", act: "closeModal" }, { label: "Send reply", act: "escRespondSend", cls: "primary" }]);
    setTimeout(() => { const t = $("#escReply"); if (t) t.focus(); }, 0);
  },
  escRespondSend() {
    const e = escObj(ui.escKey); if (!e) { closeModal(); return; }
    const text = ($("#escReply").value || "").trim();
    if (text.length < 5) { toast("Write what you did first.", "warn"); return; }
    const obj = e.obj; obj.esc = obj.esc || {}; obj.esc.responses = obj.esc.responses || [];
    obj.esc.responses.push({ by: S.userId, at: nowISO(), text });
    if (e.kind === "task") { S.notes.push({ id: "N-" + S.seq.note++, recordId: e.ref, by: S.userId, at: nowISO(), text }); log("Officer update added", e.ref, text); }
    else progSaveObj(e.caseId, "", text, "", "", S.userId);
    escActed(e.key, text);
    log("Reply to the Commissioner", e.ref, `${e.title}: ${text}`);
    S.escNotes.filter((n) => n.to === S.userId && n.ref === e.ref).forEach((n) => (n.read = true));
    save(); ui.modal = null; render(); toast("Reply sent. The Commissioner can see it.");
  },
};
