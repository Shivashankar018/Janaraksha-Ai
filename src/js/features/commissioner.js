/* ===== Commissioner phase: all-station dashboard, escalations and progress tracking ===== */
const maskPhone = (p) => { const d = String(p || "").replace(/\D/g, "").slice(-10); return d.length === 10 ? "+91 XXXXX X" + d.slice(6) : p || ""; };
const cpSt = () => ui.cpSt || "all";
const byStation = (list, get) => (cpSt() === "all" ? list : list.filter((x) => get(x) === cpSt()));
function cpCounts(items, esc) {
  const n = (f) => items.filter(f).length;
  return {
    total: items.length, online: n((i) => i.kind === "online"), pending: n((i) => i.stage === "filed"),
    verified: n((i) => ["verified", "investigation", "action"].includes(i.stage)), investigation: n((i) => i.stage === "investigation"), action: n((i) => i.stage === "action"),
    resolved: n((i) => i.stage === "resolved"), rejected: n((i) => i.stage === "rejected"), escalated: esc.length,
  };
}
function stationSelect(id, bind, val, allLabel) {
  return `<select id="${id}" class="select" data-bind="${bind}"><option value="all">${h(allLabel || "All stations")}</option>${STATIONS.map((g) => `<optgroup label="${h(g.group)}">${g.list.map((s) => `<option value="${h(s)}" ${val === s ? "selected" : ""}>${h(s)}</option>`).join("")}</optgroup>`).join("")}</select>`;
}
const mustAct = (it) => it.officer || (it.station === homeStation() ? "u-sho" : "sho:" + it.station);
const mustActHTML = (it) => `<span data-notr>${h(escToText(mustAct(it)))}</span>`;
const daysTxt = (n) => `<b class="pd">${n}</b> <span class="small">${n === 1 ? "day" : "days"}</span>`;

function vCP() {
  const all = caseItems();
  const escAll = cpEscRows(all);
  const items = byStation(all, (i) => i.station);
  const esc = byStation(escAll, (r) => r.it.station);
  const k = cpCounts(items, esc);
  const L = escDays();
  const tile = (v, l, s, col, go) => `<button class="card kpi stripe cp-kpi" style="--k:${col}" data-act="cpGo" data-id="${go}"><span class="l">${l}</span><span class="v">${v}</span><span class="s muted">${s}</span></button>`;
  const seg = STAGES.map((s) => ({ id: s.id, label: s.label, n: items.filter((i) => i.stage === s.id).length })).concat([{ id: "rejected", label: "Not accepted", n: k.rejected }]);
  const tot = Math.max(1, items.length);
  const stats = ALL_STATIONS.map((st) => {
    const li = all.filter((i) => i.station === st);
    return { st, total: li.length, pending: li.filter((i) => i.stage === "filed").length, open: li.filter((i) => ["verified", "investigation", "action"].includes(i.stage)).length, resolved: li.filter((i) => i.stage === "resolved").length, esc: escAll.filter((r) => r.it.station === st).length };
  }).filter((x) => x.total).sort((a, b) => b.esc - a.esc || b.total - a.total);
  const feed = [];
  items.forEach((it) => it.track.forEach((e) => feed.push({ it, e })));
  feed.sort((a, b) => b.e.at.localeCompare(a.e.at));
  return `${intro()}
  <div class="row cp-filter"><label class="lbl" for="cpSt" style="margin:0">Police station</label>${stationSelect("cpSt", "cpSt", cpSt())}<span class="spacer"></span><span class="live"><span class="live-dot"></span>Live</span><span class="muted small">${h(fmtDT(nowISO()))}</span></div>
  ${esc.length ? `<div class="banner esc">${ICON.clock}<span style="flex:1"><b>${esc.length} complaint${esc.length > 1 ? "s" : ""} escalated.</b> <span>A station did not act within the time limit.</span></span><a class="btn sm primary" href="#escalations">Open escalations</a></div>` : ""}
  <section class="grid g5 cp-kpis" aria-label="Complaint counts">
    ${tile(k.total, "Total complaints", `${k.online} online · ${k.total - k.online} at station desks`, "var(--navy)", "all")}
    ${tile(k.escalated, "Escalated complaints", "Not acted on in time", "var(--crit)", "escp")}
    ${tile(k.pending, "Pending verification", "Filed, not verified yet", "var(--warn)", "filed")}
    ${tile(k.verified, "Verified, in progress", `${k.investigation} under investigation · ${k.action} action taken`, "var(--info)", "open")}
    ${tile(k.resolved, "Resolved", `${k.rejected} not accepted`, "var(--ok)", "resolved")}
  </section>
  <section class="card"><div class="card-h"><h2>Progress of all complaints</h2><span class="muted small">Filed › Verified › Under investigation › Action taken › Resolved</span></div>
    <div class="card-b stack"><div class="funnel" role="img" aria-label="Complaints by stage">${seg.filter((s) => s.n).map((s) => `<span class="fs ${s.id}" style="flex:${s.n}" title="${h(s.label)}: ${s.n}">${Math.round((s.n / tot) * 100) >= 7 ? s.n : ""}</span>`).join("")}</div>
      <div class="flegend">${seg.map((s) => `<button class="fl" data-act="cpGo" data-id="${s.id}"><span class="sw ${s.id}"></span><span>${h(s.label)}</span> <b>${s.n}</b></button>`).join("")}</div></div></section>
  <section class="card"><div class="card-h"><h2>Online complaint escalations</h2><span class="chip ${esc.length ? "crit" : "ok"} plain">${esc.length}</span><span class="muted small">Time limit for station action: ${L} days. Progress must be updated every ${L * 2} days.</span></div>
    ${esc.length ? `<div class="table-wrap"><table class="t rtable cp-esc"><thead><tr><th>Complaint</th><th>Police station</th><th>Pending days</th><th>Escalation reason</th><th>Must act</th><th>Stage</th><th><span class="sr">Open</span></th></tr></thead><tbody>
      ${esc.map((r) => `<tr class="${r.level >= 3 ? "sev" : ""}"><td data-l="${h(trStr("Complaint"))}"><div><button class="linkbtn mono" data-act="cpOpen" data-id="${h(r.it.id)}">${h(r.it.id)}</button><div class="small"><span>${h(r.it.cat)}</span> · <span data-notr>${h(r.it.name)}</span></div></div></td>
        <td data-l="${h(trStr("Police station"))}">${h(r.it.station)}</td><td data-l="${h(trStr("Pending days"))}"><span>${daysTxt(r.days)}</span></td><td data-l="${h(trStr("Escalation reason"))}" class="small">${h(escWhyText(r))}</td><td data-l="${h(trStr("Must act"))}" class="small"><span>${mustActHTML(r.it)}</span></td><td data-l="${h(trStr("Stage"))}">${stageChip(r.it.stage)}</td>
        <td><button class="btn sm" data-act="cpOpen" data-id="${h(r.it.id)}">Track</button></td></tr>`).join("")}</tbody></table></div>` : `<div class="card-b"><p class="muted small">No escalated complaints. Every station acted in time.</p></div>`}</section>
  <div class="split" style="align-items:start">
    <section class="card"><div class="card-h"><h2>Station-wise view</h2><span class="muted small">${stats.length} stations with complaints</span></div>
      <div class="table-wrap"><table class="t cp-st"><thead><tr><th>Police station</th><th>Total</th><th>Pending</th><th>In progress</th><th>Resolved</th><th>Escalated</th></tr></thead><tbody>
      ${stats.map((x) => `<tr class="${cpSt() === x.st ? "on" : ""}"><td data-l="${h(trStr("Police station"))}"><button class="linkbtn" data-act="cpPickSt" data-id="${h(x.st)}">${h(x.st)}</button></td><td data-l="${h(trStr("Total"))}">${x.total}</td><td data-l="${h(trStr("Pending"))}">${x.pending}</td><td data-l="${h(trStr("In progress"))}">${x.open}</td><td data-l="${h(trStr("Resolved"))}">${x.resolved}</td><td data-l="${h(trStr("Escalated"))}">${x.esc ? `<span class="chip crit plain">${x.esc}</span>` : "0"}</td></tr>`).join("")}</tbody></table></div></section>
    <section class="card"><div class="card-h"><h2>Latest updates from stations</h2></div>
      <div class="card-b feed">${feed.slice(0, 8).map(({ it, e }) => `<div class="fi ${e.kind === "remark" ? "sys" : ""}"><span class="d" style="background:var(--${e.kind === "remark" ? "violet" : "accent"})"></span><div><button class="linkbtn mono" data-act="cpOpen" data-id="${h(it.id)}">${h(it.id)}</button> · <span class="small">${h(it.station)}</span> ${e.kind === "remark" ? `<span class="chip violet plain">Remark from the Commissioner</span>` : e.stage ? stageChip(e.stage) : ""}<div class="small" data-notr>${h(e.text)}</div><div class="tiny muted"><span data-notr>${h(whoName(e.by))}</span> · ${h(ago(e.at))}</div></div></div>`).join("") || `<p class="muted small">No updates yet.</p>`}</div></section>
  </div>`;
}

const CP_STAGE_F = [["all", "All"], ["esc", "Escalated"], ["filed", "Filed"], ["verified", "Verified"], ["investigation", "Under investigation"], ["action", "Action taken"], ["resolved", "Resolved"], ["rejected", "Not accepted"]];
function vCPProgress() {
  const all = caseItems();
  const escAll = cpEscRows(all);
  const escIds = new Map(escAll.map((r) => [r.it.id, r]));
  const f = ui.cpStage || "all", q = (ui.cpQ || "").trim().toLowerCase();
  let list = byStation(all, (i) => i.station);
  if (f === "esc") list = list.filter((i) => escIds.has(i.id));
  else if (f === "open") list = list.filter((i) => ["verified", "investigation", "action"].includes(i.stage));
  else if (f !== "all") list = list.filter((i) => i.stage === f);
  if (q) list = list.filter((i) => [i.id, i.name, i.place, i.station, i.cat, i.fir].join(" ").toLowerCase().includes(q));
  list = list.map((i) => ({ i, lu: lastUpdate(i).at })).sort((a, b) => (escIds.has(b.i.id) - escIds.has(a.i.id)) || b.lu.localeCompare(a.lu));
  const sel = ui.cpSel ? caseItem(ui.cpSel) : null;
  return `${intro()}
  <div class="row cp-filter"><label class="sr" for="cpSt2">Police station</label>${stationSelect("cpSt2", "cpSt", cpSt())}
    <label class="sr" for="cpStage">Stage</label><select id="cpStage" class="select" style="width:auto" data-bind="cpStage">${CP_STAGE_F.concat([["open", "Verified, in progress"]]).map(([k, t]) => `<option value="${k}" ${f === k ? "selected" : ""}>${h(t)}</option>`).join("")}</select>
    <label class="sr" for="cpQ">Search complaints</label><input id="cpQ" class="input" style="width:230px" data-bind="cpq" value="${h(ui.cpQ || "")}" placeholder="Search code, name, place or FIR" /></div>
  <div class="cp-split ${sel ? "has-sel" : ""}">
    <div class="cp-list stack" style="gap:8px" id="cp-list"><div class="muted small">${list.length} complaint${list.length === 1 ? "" : "s"}</div>${list.map(({ i, lu }) => { const e = escIds.get(i.id); return `<button class="cp-i ${sel && sel.id === i.id ? "on" : ""} ${e ? "late" : ""}" data-act="cpOpen" data-id="${h(i.id)}">
        <span class="row" style="gap:6px"><span class="mono small" style="font-weight:700">${h(i.id)}</span><span class="spacer"></span>${e ? `<span class="chip crit plain">Escalated</span>` : ""}${stageChip(i.stage)}</span>
        <span class="small"><span>${h(i.cat)}</span> · <b data-notr>${h(i.name)}</b></span><span class="tiny muted">${h(i.station)}</span>
        ${stepperHTML(i)}<span class="tiny muted">${i.fir ? `FIR No. <span class="mono" data-notr>${h(i.fir)}</span> · ` : ""}<span>Updated ${h(ago(lu))}</span></span></button>`; }).join("") || `<div class="card empty">No complaints match.</div>`}</div>
    <div class="cp-detail">${sel ? vCPDetail(sel, escIds.get(sel.id)) : `<section class="card empty" style="padding:50px 20px">${ICON.track.replace("<svg", '<svg style="width:40px;height:40px;color:var(--accent)"')}<p style="margin-top:10px"><b>Choose a complaint to see its progress.</b></p><p class="small">Escalated complaints are at the top of the list.</p></section>`}</div>
  </div>`;
}
function vCPDetail(it, esc) {
  const lu = lastUpdate(it);
  const f = (k, v) => `<div class="fact"><div class="k">${k}</div><div class="v">${v}</div></div>`;
  const c = it.c;
  return `<section class="card cp-det" id="cp-det"><div class="card-h"><button class="btn sm ghost cp-back" data-act="cpBack">← Back to list</button><div style="flex:1;min-width:0"><div class="eyebrow">${h(SRC_LABEL[it.kind])}</div><h2 class="mono">${h(it.id)}</h2></div>${esc ? `<span class="chip crit">Escalated</span>` : ""}${stageChip(it.stage)}</div>
    <div class="card-b stack">
      ${stepperHTML(it, true)}
      ${esc ? `<div class="banner esc">${ICON.clock}<span style="flex:1"><b>${h(escWhyText(esc))}.</b> <span>Pending for ${esc.days} days.</span> <span>Must act:</span> ${mustActHTML(it)}</span><button class="btn sm primary" data-act="escInstruct" data-key="${h((esc.why === "noprogress" ? "prog:" : "cmp:") + it.id)}">${ICON.pen}Send instruction</button></div>` : ""}
      ${escInsHTML(it.c || it.r, "")}
      <div class="facts">
        ${f("Police station", h(it.station))}${f("Category", h(it.cat))}${f("Complainant", `<span data-notr>${h(it.name)}</span>`)}${f("Mobile", `<span class="mono">${h(maskPhone(it.phone))}</span>`)}
        ${f("Filed on", h(fmtDT(it.filedAt)))}${f("FIR number", it.fir ? `<span class="mono" data-notr>${h(it.fir)}</span>` : `<span class="muted">${it.stage === "filed" ? "Not registered yet" : "No FIR"}</span>`)}
        ${f("Handling officer", it.officer ? `<span data-notr>${h(whoName(it.officer))}</span>` : `<span class="muted">Not given yet</span>`)}${f("Last update", h(fmtDT(lu.at)))}
      </div>
      <div><div class="lbl" style="margin-bottom:4px">What happened</div><p class="small" data-notr>${h([it.date ? fmtDate(it.date) + (it.time ? ", " + it.time : "") : "", it.place].filter(Boolean).join(" · "))}</p><p data-notr>${h(it.summary)}</p>${c && c.status === "rejected" ? `<p class="small"><b>Reason not accepted:</b> <span data-notr>${h(c.closeReason || "")}</span></p>` : ""}</div>
      <div><div class="lbl" style="margin-bottom:6px">Connected cases</div>${connHTML(connOf(it.id), 5)}</div>
      <div><div class="lbl" style="margin-bottom:6px">Live tracking timeline</div>${timelineHTML(it)}</div>
      <div class="stack cp-rm" style="gap:8px"><label class="lbl" for="cp-remark">Add a remark for the station</label><textarea id="cp-remark" class="textarea" style="min-height:70px" placeholder="for example Finish the verification today and send me a report."></textarea>
        <div class="row"><button class="btn primary" data-act="cpRemark" data-id="${h(it.id)}">${ICON.pen}Add remark</button><span class="help">The station officers see the remark in the complaint and in notifications.</span></div></div>
    </div></section>`;
}

const CPACT = {
  cpOpen(el) {
    ui.cpSel = el.dataset.id;
    if (ui.page !== "cp-progress") go("cp-progress"); else render();
    setTimeout(() => { const d = $("#cp-det"); if (d && window.innerWidth < 1000) d.scrollIntoView({ block: "start" }); }, 60);
  },
  cpBack() { ui.cpSel = null; render(); },
  cpGo(el) { const v = el.dataset.id; if (v === "escp") { go("escalations"); return; } ui.cpStage = v === "all" ? "all" : v; ui.cpSel = null; go("cp-progress"); },
  cpPickSt(el) { ui.cpSt = el.dataset.id; render(); window.scrollTo(0, 0); },
  cpRemark(el) {
    const id = el.dataset.id; const t = ($("#cp-remark").value || "").trim();
    if (t.length < 5) { toast("Write the remark first.", "warn"); $("#cp-remark").focus(); return; }
    const it = caseItem(id); if (!it) return;
    progSaveObj(id, "", t, "", "", S.userId, "remark");
    if (it.station === (S.homeStation || HOME_STATION)) { escInit(); escNote("u-sho", "cp-remark", { key: "cp:" + id, ref: id, title: id }, { by: S.userId, text: t }); }
    log("Commissioner remark", id, t);
    save(); render(); toast(`Remark added to ${id}. The station can see it.`);
  },
};
const CPBIND = {
  cpSt(el) { ui.cpSt = el.value; ui.cpSel = null; render(); },

  cpStage(el) { ui.cpStage = el.value; render(); },
  cpq(el) { ui.cpQ = el.value; const f = captureFocus(); paint($("#page"), pageHTML()); restoreFocus(f); },
};
