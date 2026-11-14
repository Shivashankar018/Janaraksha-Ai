/* ===== Views: station shell, dashboards, Direct Entry, Document Scanner, Case Connections, workspace, audit and about pages ===== */
const I = (p, extra) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra || ""}>${p}</svg>`;
const ICON = {
  home: I('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>'),
  entry: I('<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>'),
  scan: I('<path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3"/><path d="M7 12h10"/>'),
  search: I('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>'),
  link: I('<circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="6" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="M8.4 10.8l7.2-3.6M8.4 13.2l7.2 3.6"/>'),
  track: I('<path d="M5 4v16"/><circle cx="5" cy="7" r="1.6" fill="currentColor"/><circle cx="5" cy="17" r="1.6" fill="currentColor"/><path d="M9 7h10M9 12h7M9 17h10"/>'),
  shield: I('<path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/>'),
  chart: I('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  info: I('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'),
  x: I('<path d="M6 6l12 12M18 6L6 18"/>'),
  check: I('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  upload: I('<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"/>'),
  lock: I('<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/>'),
  doc: I('<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>'),
  plus: I('<path d="M12 5v14M5 12h14"/>'),
  print: I('<path d="M6 9V3h12v6"/><rect x="6" y="14" width="12" height="7"/><path d="M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2"/>'),
  download: I('<path d="M12 4v11M7 10l5 5 5-5"/><path d="M5 20h14"/>'),
  trash: I('<path d="M5 7h14M10 11v6M14 11v6M7 7l1 13h8l1-13M9 7V4h6v3"/>'),
  spark: I('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>'),
  dl: I('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'),
  clock: I('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  user: I('<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5"/>'),
  camera: I('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),
  thumb: I('<path d="M12 3c-4 0-6.5 3-6.5 7v4"/><path d="M18.5 10c0-2-1-3.8-2.6-5"/><path d="M9 21c-.8-1.6-1-3.2-1-5v-5.5a4 4 0 018 0V14"/><path d="M12 10.5V16c0 2 .5 3.5 1.5 5"/><path d="M16 17.5c0 1 .2 2 .6 3"/>'),
  bell: I('<path d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 004 0"/>'),
  inbox: I('<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1.5 2.5h5L16 13h5"/>'),
  logout: I('<path d="M15 4h4v16h-4"/><path d="M10 8l-4 4 4 4M6 12h10"/>'),
  pen: I('<path d="M3 21c3-1 5-3 7-6l7-7-3-3-7 7c-3 2-5 4-6 7"/><path d="M14 5l3 3"/>'),
};

const PAGES = [
  { id: "cp", n: "", ph: "c", label: "Commissioner dashboard", icon: "chart", group: "Commissionerate", title: "Commissioner dashboard", eyebrow: "Kalaburagi police: all stations", intro: "Every police station in one view: complaint counts, escalated complaints and the progress of each complaint." },
  { id: "cp-progress", n: "", ph: "c", label: "Progress tracking", icon: "track", group: "Commissionerate", title: "Complaint progress tracking", eyebrow: "Commissionerate", intro: "Follow each complaint from Filed to Resolved. Open one to see its timeline and to add a remark for the station." },
  { id: "escalations", n: "", ph: "c", label: "Escalations", icon: "clock", group: "Commissionerate", title: "Escalations: work not done in time", eyebrow: "Commissionerate", intro: "Online complaints and station tasks that a station did not act on within the time limit. Send an instruction, give the work to another officer, or track the complaint." },
  { id: "overview", n: "", label: "Station dashboard", icon: "home", group: "Station", title: "Station dashboard", eyebrow: "JanaRaksha AI", intro: "One officer-reviewed workflow for new entries and old paper files. Start with the guided demo or open a module." },
  { id: "complaints", n: "", label: "Online complaints", icon: "inbox", group: "Station", title: "Online complaints", eyebrow: "Station inbox", intro: "Complaints filed by citizens online. Open one to check the person, the ID and the address, then verify and register it." },
  { id: "entry", n: "01", label: "Direct Entry Desk", icon: "entry", group: "Modules", title: "Direct Entry Desk", eyebrow: "Module 01", intro: "Make new information structured from day one. Staff fill guided fields; the AI check points out gaps; an officer reviews and saves." },
  { id: "scanner", n: "02", label: "Document Scanner", icon: "scan", group: "Modules", title: "Smart Document Scanner", eyebrow: "Module 02", intro: "Turn paper records into searchable information. The original file stays linked. OCR output is a draft until an authorised officer verifies it." },
  { id: "connections", n: "03", label: "Case Connections", icon: "link", group: "Modules", title: "Case Connection Finder", eyebrow: "Module 03", intro: "Surface clues, not conclusions. Verified records are compared, and every suggested link shows the exact field and source behind it." },
  { id: "workspace", n: "04", label: "Progress Tracker", icon: "track", group: "Modules", title: "Case workspace and progress", eyebrow: "Module 04", intro: "Verified facts, source files, suggested links and the next action with its owner, in one view." },
  { id: "records", ph: "b", n: "", label: "Search records", icon: "search", group: "Information layer", title: "Search verified records", eyebrow: "Information layer", intro: "Find verified information across direct entries and digitised files. Every result names the field that matched." },
  { id: "audit", ph: "b", n: "", label: "Audit trail", icon: "shield", group: "Trust", title: "Audit trail", eyebrow: "Trust", intro: "Every access, edit and decision, with who did it and when. Times are in IST." },
  { id: "metrics", n: "", label: "Pilot metrics", icon: "chart", group: "Trust", title: "Pilot metrics", eyebrow: "Trust", intro: "How the pilot is measured, calculated live from what people do in this prototype." },
  { id: "about", ph: "b", n: "", label: "About and guardrails", icon: "info", group: "Trust", title: "About JanaRaksha AI", eyebrow: "Team Smarties / Kalyan Karnataka Buildathon 2026", intro: "A paper-light police station ecosystem for structured records, explainable case connections and visible next actions." },
];

const pageOK = (p) => (p.ph === "b" ? true : isCP() ? p.ph === "c" : p.ph !== "c");
function navCounts() {
  if (isCP()) return { escalations: cpEscAll().length };
  return {
    complaints: cUnread().length,
    scanner: S.docs.filter((d) => ["review", "submitted", "manual"].includes(d.status)).length,
    connections: S.links.filter((l) => l.status === "suggested" && (l.reasons || []).length).length,
    workspace: S.tasks.filter((t) => t.status === "open" && t.due && t.due < todayIST()).length,
  };
}

function shell() {
  const pg = PAGES.find((p) => p.id === ui.page) || PAGES[0];
  const counts = navCounts();
  let groups = "", last = "";
  PAGES.filter(pageOK).forEach((p) => {
    if (p.group !== last) { groups += `<div class="nav-group">${h(p.group)}</div>`; last = p.group; }
    const c = counts[p.id];
    groups += `<a href="#${p.id}" class="${ui.page === p.id ? "on" : ""}" ${ui.page === p.id ? 'aria-current="page"' : ""}>${p.n ? `<span class="n">${p.n}</span>` : ICON[p.icon]}<span>${h(p.label)}</span>${c ? `<span class="count" title="Needs attention">${c}</span>` : ""}</a>`;
  });
  const u = me();
  const aiOn = !!AI;
  return `<div class="app">
  <aside class="side" aria-label="Main navigation">
    <div class="brand"><div class="brand-badge">${badgeSVG(46)}</div><div><div class="brand-name">JANARAKSHA <span>AI</span></div><div class="brand-sub">Paper-light police station</div></div></div>
    <div class="station"><b>${h(isCP() ? "Commissionerate: all stations" : SESSION && SESSION.station && SESSION.station !== "all" ? SESSION.station : HOME_STATION)}</b><span>${isCP() ? "Commissioner phase" : "Police phase"}</span> · Kalaburagi · prototype</div>
    <nav class="nav">${groups}</nav>
    <div class="side-foot">
      <div class="who">
        ${isCP() ? `<div class="lbl" style="color:var(--navy-ink)">Signed in as</div><b style="color:#fff" data-notr>${h(u.name)}</b>` : `<label for="userSel">Signed in as (demo users)</label>
        <select id="userSel" data-bind="user">${POLICE_USERS().map((x) => `<option value="${x.id}" ${x.id === u.id ? "selected" : ""}>${h(x.name)} (${h(x.role)})</option>`).join("")}</select>`}
        <div class="perm"><b style="color:#fff;font-weight:600">${h(u.roleLabel)}</b><br>${h(PERM_TEXT[u.role])}</div>
      </div>
      <button class="btn sm side-out" data-act="logout">${ICON.logout}Log out</button>
      <div class="proto"><b>Prototype.</b> Fictional demo records only. No live CCTNS connection.</div>
    </div>
  </aside>
  <div class="main">
    <header class="topbar">
      <div class="ttl"><div class="eyebrow">${h(pg.eyebrow)}</div><h1>${h(pg.title)}</h1></div>
      <form class="gsearch" data-form="gsearch" role="search"><label class="sr" for="gq">Search records</label>${ICON.search}<input id="gq" class="input" placeholder="Search name, vehicle, phone, place…" autocomplete="off" /></form>
      <button class="bellbtn" data-act="toggleBell" aria-label="Notifications" title="Notifications">${ICON.bell}${bellCount() ? `<span class="badge">${bellCount()}</span>` : ""}</button>
      ${langToggle()}
      <button class="btn sm top-out" data-act="logout" title="Log out and go back to the first page">${ICON.logout}Log out</button>
      <button class="ai-chip ${aiOn ? "on" : ""}" data-act="aiInfo" title="How AI works on this page"><span class="dot"></span>${aiOn ? (AI_IMAGES ? "AI on: checks + vision OCR" : "AI on: checks") : "AI off: rule-based mode"}</button>
      <span class="me-photo" title="${h(me().name)} · ${h(me().roleLabel)}">${officerSVG(me().id, { square: true, tag: "top" })}</span>
      ${demoLogoSVG(46)}
    </header>
    ${storageOK ? "" : `<div class="proto-strip"><b>Note:</b> This browser blocks storage, so changes last only until you close the page.</div>`}
    <main class="page" id="page">${pageHTML()}</main>
  </div>
</div>`;
}

function pageHTML() {
  switch (ui.page) {
    case "cp": return vCP();
    case "cp-progress": return vCPProgress();
    case "complaints": return vComplaints();
    case "escalations": return vCPEsc();
    case "file-complaint": return vFile();
    case "my-complaints": return vMine();
    case "entry": return vEntry();
    case "scanner": return vScanner();
    case "records": return vRecords();
    case "connections": return vConnections();
    case "workspace": return vWorkspace();
    case "audit": return vAudit();
    case "metrics": return vMetrics();
    case "about": return vAbout();
    default: return vOverview();
  }
}
const intro = () => { const pg = PAGES.find((p) => p.id === ui.page) || PAGES[0]; return `<p class="page-intro">${h(pg.intro)}</p>`; };

/* ---------- Shared pieces ---------- */
function statusChip(r) {
  if (r.status === "verified") return `<span class="chip ok">Verified</span>`;
  if (r.status === "pending") return `<span class="chip warn">Awaiting verification</span>`;
  return `<span class="chip">Draft</span>`;
}
function docChip(d) {
  return { verified: `<span class="chip ok">Verified</span>`, review: `<span class="chip warn">OCR draft: needs checking</span>`, submitted: `<span class="chip warn">Awaiting officer</span>`, manual: `<span class="chip crit">Needs typed text</span>`, uploaded: `<span class="chip info">Uploaded</span>` }[d.status] || `<span class="chip">${h(d.status)}</span>`;
}
function linkChip(l) {
  return { suggested: `<span class="chip info">To review</span>`, accepted: `<span class="chip ok">Accepted</span>`, dismissed: `<span class="chip">Dismissed</span>` }[l.status];
}
function caseChip(r) { const s = r.caseStatus || "Active"; return `<span class="chip ${s === "Active" ? "accent" : s === "Closed" ? "" : "warn"}">${h(s)}</span>`; }
const recLink = (id, from) => (/^CMP[-\/]/.test(id) && !getRec(id) ? `<button class="linkbtn mono" data-act="openComplaint" data-id="${h(id)}">${h(id)}</button>` : `<button class="linkbtn mono" data-act="openRecord" data-id="${h(id)}" ${from ? `data-from="${from}"` : ""}>${h(id)}</button>`);
const srcLabel = (r) => (r.source === "scan" ? "Digitised file" : r.source === "online" ? "Online complaint" : "Direct entry");
const lockBtn = (label, perm) => `<button class="btn" disabled title="Only SI or SHO can do this">${ICON.lock}${h(label)}</button>`;
const confBadge = (v) => `<span class="conf ${confClass(v)}" title="OCR confidence ${Math.round(v * 100)}%"><i style="--w:${Math.round(v * 100)}%"></i>${confText(v)}</span>`;

/* ---------- Overview ---------- */
function vOverview() {
  const verified = S.records.filter((r) => r.status === "verified").length;
  const pendRec = S.records.filter((r) => r.status === "pending");
  const pendDocs = S.docs.filter((d) => ["review", "submitted", "manual"].includes(d.status));
  const sugg = S.links.filter((l) => l.status === "suggested" && (l.reasons || []).length);
  const open = S.tasks.filter((t) => t.status === "open");
  const noOwner = open.filter((t) => !t.assignee).length;
  const overdue = open.filter((t) => t.due && t.due < todayIST()).length;
  const steps = [
    { k: "entry", t: "Create a new direct entry", d: "Pick a type, fill the guided fields, read the AI check, then save.", go: "entry" },
    { k: "scan", t: "Scan a paper record", d: "Use sample DEMO-309, a historical incident report.", go: "scanner" },
    { k: "verify", t: "Verify the extracted fields", d: "Check low-confidence fields and add the record to search.", go: "scanner" },
    { k: "link", t: "Review an explainable link", d: "See why a link appears, then accept, dismiss or annotate.", go: "connections" },
    { k: "task", t: "Add a follow-up task", d: "Give the next action an owner and a due date.", go: "workspace" },
  ];
  const doneN = steps.filter((s) => S.demo[s.k]).length;
  const queue = cUnread().map((c) => ({ t: `New online complaint ${c.id}`, d: `${catOf(c.incident.category).label} · ${c.station}`, act: `data-act="openComplaint" data-id="${c.id}"`, c: "accent" }));
  if (can("verify")) pendRec.forEach((r) => queue.push({ t: `Verify entry ${r.id}`, d: `${typeOf(r.type).label}, submitted by ${userName(r.createdBy)}`, act: `data-act="openRecord" data-id="${r.id}"`, c: "warn" }));
  pendDocs.forEach((d) => queue.push({ t: `Check scanned file: ${d.name}`, d: d.status === "submitted" ? "Sent to an officer for verification" : d.status === "manual" ? "OCR could not read it. Type the text." : "OCR draft waiting for field checks", act: `data-act="openDoc" data-id="${d.id}"`, c: "warn" }));
  sugg.forEach((l) => queue.push({ t: `Review link ${l.a} and ${l.b}`, d: (l.reasons || []).map((r) => KIND_TEXT[r.kind] + " " + r.value).join(", "), act: `data-act="openLink" data-key="${l.key}"`, c: "info" }));
  open.filter((t) => t.assignee === S.userId).forEach((t) => queue.push({ t: `Your task: ${t.title}`, d: `${t.recordId} · due ${fmtDate(t.due)}`, act: `data-act="openCase" data-id="${t.recordId}"`, c: t.due < todayIST() ? "crit" : "accent" }));
  const newC = cUnread();
  const escIns = escMyUnread().filter((n) => ["instruction", "assigned"].includes(n.kind));
  escIns.forEach((n) => queue.unshift({ t: `${n.kind === "assigned" ? "Work given to you by the Commissioner" : "Instruction from the Commissioner"}: ${n.title}`, d: `${n.ref}${n.due ? " · act by " + fmtDate(n.due) : ""}`, act: `data-act="escOpenNote" data-id="${h(n.id)}"`, c: "crit" }));
  return `${intro()}
  ${vStationDash()}
  ${escIns.length ? `<div class="banner esc">${ICON.pen}<span style="flex:1"><b>The Commissioner sent ${escIns.length} instruction${escIns.length > 1 ? "s" : ""}.</b> <span>Please act and reply.</span></span><button class="btn sm primary" data-act="escOpenNote" data-id="${h(escIns[0].id)}">Open</button></div>` : ""}
  ${newC.length ? `<div class="banner newc">${ICON.bell}<span style="flex:1"><b>${newC.length} new online complaint${newC.length > 1 ? "s" : ""} registered.</b> <span>Check the details and verify.</span></span><a class="btn sm primary" href="#complaints">Verify now</a></div>` : ""}
  <h2 class="sec-h">Records workflow</h2>
  <section class="grid g4" aria-label="Records workflow summary">
    <div class="card kpi stripe" style="--k:var(--ok)"><span class="l">Verified records</span><span class="v">${verified}</span><span class="s muted">${S.records.filter((r) => r.source === "scan" && r.status === "verified").length} from scanned paper files</span></div>
    <div class="card kpi stripe" style="--k:var(--warn)"><span class="l">Waiting for verification</span><span class="v">${pendRec.length + pendDocs.length}</span><span class="s muted">${pendRec.length} ${pendRec.length === 1 ? "entry" : "entries"} · ${pendDocs.length} scanned ${pendDocs.length === 1 ? "file" : "files"}</span></div>
    <div class="card kpi stripe" style="--k:var(--info)"><span class="l">Suggested links to review</span><span class="v">${sugg.length}</span><span class="s muted">${S.links.filter((l) => l.status === "accepted").length} accepted so far</span></div>
    <div class="card kpi stripe" style="--k:${overdue ? "var(--crit)" : "var(--accent)"}"><span class="l">Open follow-up tasks</span><span class="v">${open.length}</span><span class="s ${noOwner || overdue ? "" : "muted"}" style="${noOwner || overdue ? "color:var(--warn)" : ""}">${noOwner} without an owner · ${overdue} overdue</span></div>
  </section>
  <section class="split">
    <div class="card">
      <div class="card-h"><h2>Guided demo</h2><span class="chip ${doneN === 5 ? "ok" : "accent"} plain">${doneN} of 5 done</span></div>
      <div class="card-b demo-steps">
        ${steps.map((s, i) => `<div class="ds ${S.demo[s.k] ? "done" : ""}"><span class="n">${S.demo[s.k] ? "✓" : "0" + (i + 1)}</span><div><b>${h(s.t)}</b><span>${h(s.d)}</span></div><a class="btn sm" href="#${s.go}">${S.demo[s.k] ? "Open again" : "Start"}</a></div>`).join("")}
      </div>
    </div>
    <div class="card">
      <div class="card-h"><h2>Needs attention</h2><span class="muted small">For ${h(me().roleLabel)}</span></div>
      <div class="card-b">${queue.length ? `<div class="feed">${queue.slice(0, 7).map((q) => `<div class="fi"><span class="d" style="background:var(--${q.c})"></span><div><button class="linkbtn" ${q.act}>${h(q.t)}</button><div class="muted small">${h(q.d)}</div></div></div>`).join("")}</div>${queue.length > 7 ? `<p class="muted small" style="margin-top:8px">${queue.length - 7} more items in the modules.</p>` : ""}` : `<div class="empty">Nothing is waiting for you right now.</div>`}</div>
    </div>
  </section>

  <div class="banner dark"><b>Shared foundation</b><span>Authorised access · Original source preserved · Human verification · Audit trail. New entries and digitised documents feed the same verified information layer.</span></div>
  <section class="card">
    <div class="card-h"><h2>Recent activity</h2>${can("viewAudit") ? `<a class="btn sm" href="#audit">Open audit trail</a>` : ""}</div>
    <div class="card-b feed">${S.audit.filter(auditVis).slice(-8).reverse().map((a) => `<div class="fi ${a.userId === "system" ? "sys" : ""}"><span class="d"></span><div><b>${h(a.action)}</b>${a.recordId ? ` · ${recLink(a.recordId)}` : ""} <span class="muted small">by ${h(userName(a.userId))} · ${h(ago(a.at))}</span><div class="muted small" data-notr>${h(a.detail)}</div></div></div>`).join("")}</div>
  </section>`;
}

function vStationDash() {
  const st = homeStation();
  const items = caseItems().filter((i) => i.station === st);
  const k = cpCounts(items, []);
  const act = items.filter((i) => !["resolved", "rejected"].includes(i.stage)).map((i) => ({ i, lu: lastUpdate(i).at })).sort((a, b) => b.lu.localeCompare(a.lu)).slice(0, 6);
  const tile = (v, l, s, col, href) => `<a class="card kpi stripe cp-kpi" style="--k:${col}" href="#${href}"><span class="l">${l}</span><span class="v">${v}</span><span class="s muted">${s}</span></a>`;
  const open = (i) => (i.kind === "online" ? `data-act="openComplaint" data-id="${h(i.id)}"` : i.status === "verified" ? `data-act="openCase" data-id="${h(i.id)}"` : `data-act="openRecord" data-id="${h(i.id)}"`);
  const feats = [["01", "Direct Entry of Data", "Type a complaint: name, masked Aadhaar or PAN, address, phone, case details and station.", "entry", "entry"], ["02", "Document Scanner", "Upload or scan a paper complaint. The form fills itself from the page.", "scanner", "scan"], ["03", "Case Connection", "Links a new complaint to old ones by person, phone, place or accused name.", "connections", "link"], ["04", "Progress Tracker", "Filed, Verified, Under investigation, Action taken, Resolved. With the handling officer.", "workspace", "track"]];
  return `<section class="card st-dash"><div class="card-h"><div style="flex:1;min-width:0"><div class="eyebrow">Police phase · station dashboard</div><h2>${h(st)}</h2></div><span class="live"><span class="live-dot"></span>Live</span></div>
    <div class="card-b stack">
      <div class="grid g5 cp-kpis">
        ${tile(k.total, "Total complaints", `${k.online} online · ${k.total - k.online} at the desk`, "var(--navy)", "complaints")}
        ${tile(k.pending, "Pending verification", "Filed, not verified yet", "var(--warn)", "complaints")}
        ${tile(k.verified, "In progress", `${k.investigation} under investigation · ${k.action} action taken`, "var(--info)", "workspace")}
        ${tile(k.resolved, "Resolved", `${k.rejected} not accepted`, "var(--ok)", "workspace")}
        ${(() => { const f = items.filter((i) => i.fir); return tile(f.length, "FIRs registered", `${f.filter((i) => i.stage === "resolved").length} resolved`, "var(--violet)", "workspace"); })()}
      </div>
      <div class="grid g4 st-feat">${feats.map((m) => `<a class="st-f" href="#${m[3]}"><span class="ic">${ICON[m[4]]}</span><span><span class="k">${m[0]}</span><b>${h(m[1])}</b><span class="small muted">${h(m[2])}</span></span></a>`).join("")}</div>
      <div><div class="lbl" style="margin-bottom:6px">Complaints in progress</div>${act.length ? `<div class="st-list">${act.map(({ i, lu }) => `<button class="st-i" ${open(i)}><span class="mono small" style="font-weight:700">${h(i.id)}</span><span class="small"><span>${h(i.cat)}</span> · <b data-notr>${h(i.name)}</b></span>${stepperHTML(i)}<span class="tiny muted">${i.fir ? `FIR No. <span data-notr>${h(i.fir)}</span> · ` : ""}<span>Updated ${h(ago(lu))}</span></span></button>`).join("")}</div>` : `<p class="muted small">No open complaints at this station.</p>`}</div>
    </div></section>`;
}

/* ---------- Direct Entry ---------- */
function vEntry() {
  if (!S.draft) S.draft = newDraft();
  const d = S.draft;
  if (d.refMode !== "manual" && !d.editingId && (codeTaken(d.ref) || !CODE_RE.test(d.ref || ""))) { d.ref = ""; d.ref = nextCaseCode(); save(); }
  const comp = completeness(d);
  const drafts = S.records.filter((r) => r.status === "draft");
  return `${intro()}
  ${drafts.length && !d.editingId ? `<div class="banner info">${ICON.doc}<span>${drafts.length} saved draft${drafts.length > 1 ? "s" : ""}: ${drafts.map((r) => `<button class="linkbtn" data-act="continueDraft" data-id="${r.id}">${h(r.id)} (${h(r.title || typeOf(r.type).label)})</button>`).join(", ")}</span></div>` : ""}
  ${d.fromDoc && getDoc(d.fromDoc) ? `<div class="banner accent">${ICON.scan}<span style="flex:1">This form was filled from the scanned page <b data-notr>${h(getDoc(d.fromDoc).name)}</b>. Check each field against the original before you save.</span><button class="btn sm" data-act="viewImg" data-doc="${h(d.fromDoc)}" data-src="0">View original</button></div>` : ""}
  ${d.editingId ? `<div class="banner info">${ICON.entry}<span>You are editing draft <b class="mono">${h(d.editingId)}</b>. <button class="linkbtn" data-act="newEntry">Start a new entry instead</button></span></div>` : ""}
  <div class="split">
    <div class="stack">
      <section class="card">
        <div class="card-h"><span class="eyebrow">01</span><h2>Select record type</h2>${d.type ? `<span class="chip ok">${h(typeOf(d.type).label)}</span>` : `<span class="chip crit">Not chosen</span>`}</div>
        <div class="card-b stack">
          ${["Case record", "Administrative"].map((g) => `<div class="stack" style="gap:8px"><div class="lbl">${g}</div><div class="types" role="radiogroup" aria-label="${g}">${RECORD_TYPES.filter((t) => t.group === g).map((t) => `<button type="button" role="radio" aria-checked="${d.type === t.id}" class="type ${d.type === t.id ? "on" : ""}" data-act="setType" data-id="${t.id}"><b>${h(t.label)}</b><span>${h(t.hint)}</span></button>`).join("")}</div></div>`).join("")}
        </div>
      </section>
      <section class="card">
        <div class="card-h"><span class="eyebrow">02</span><h2>Complete guided fields</h2><span class="muted small">Required fields are marked *</span></div>
        <div class="card-b stack" style="gap:16px">
          <div class="fgrid">
            <div class="field"><label for="e-ref">Record reference<span class="req">*</span></label><input id="e-ref" class="input mono" data-bind="eref" value="${h(d.ref)}" ${d.refMode !== "manual" || d.editingId ? "readonly" : ""} placeholder="FIR 112/2026" aria-describedby="e-ref-h" />
              <label class="cbx small"><input type="checkbox" id="e-refmode" data-bind="refMode" ${d.refMode === "manual" ? "checked" : ""} ${d.editingId ? "disabled" : ""} /><span>Type my own reference number</span></label>
              <span class="help" id="e-ref-h">${d.editingId ? "The reference is fixed after the first save." : d.refMode === "manual" ? "Use the station's own number, for example FIR 112/2026." : "Complaint code given by the system. Tick the box to type your own."}</span></div>
            <div class="field"><label for="e-st">Police station<span class="req">*</span></label><select id="e-st" class="select" data-bind="e" data-f="station">${STATIONS.map((g) => `<optgroup label="${h(g.group)}">${g.list.map((s) => `<option value="${h(s)}" ${d.station === s ? "selected" : ""}>${h(s)}</option>`).join("")}</optgroup>`).join("")}</select><span class="help">The station that registers this complaint.</span></div>
            <div class="row" style="gap:10px;align-items:start">
              <div class="field" style="flex:1.3"><label for="e-date">Date<span class="req">*</span></label><input id="e-date" type="date" class="input" data-bind="e" data-f="date" value="${h(d.date)}" max="${todayIST()}" /></div>
              <div class="field" style="flex:1"><label for="e-time">Time</label><input id="e-time" type="time" class="input" data-bind="e" data-f="time" value="${h(d.time)}" /></div>
            </div>
            <div class="field full"><label for="e-locsel">Location<span class="req">*</span></label>
              <select id="e-locsel" class="select" data-bind="locSel"><option value="" ${d.locMode !== "other" && !d.location ? "selected" : ""}>Choose a place</option>${PLACES.map((p) => `<option value="${h(p)}" ${d.locMode !== "other" && d.location === p ? "selected" : ""}>${h(p)}</option>`).join("")}<option value="__other" ${d.locMode === "other" ? "selected" : ""}>Other (type the location)</option></select>
              ${d.locMode === "other" ? `<label class="sr" for="e-loc">Exact location</label><input id="e-loc" class="input" data-bind="e" data-f="location" value="${h(d.location)}" placeholder="Type the exact place: road, landmark, area or village" /><span class="help">Example: Near Govt. School, Kotnoor village, Kalaburagi taluk</span>` : ""}</div>
            <div class="field full"><label for="e-sum">Incident summary<span class="req">*</span></label><textarea id="e-sum" class="textarea" data-bind="e" data-f="summary" placeholder="What was reported, when and where. Use short sentences and neutral words.">${h(d.summary)}</textarea><span class="help" id="e-sum-n">${(d.summary || "").trim().length} characters. Aim for 40 or more.</span></div>
            ${vLawPanel(d)}
          </div>
          <div class="stack" style="gap:8px">
            <div class="row"><h3 style="flex:1">People<span class="req" style="color:var(--crit)">*</span></h3><button class="btn sm" data-act="addPerson">${ICON.plus}Add person</button></div>
            <div class="rep">${d.people.length ? d.people.map((p, i) => `<div class="rep-row p">
              <div class="field"><label for="pn${i}">Name</label><input id="pn${i}" class="input" data-bind="ep" data-i="${i}" data-f="name" value="${h(p.name)}" /></div>
              <div class="field"><label for="pr${i}">Role</label><select id="pr${i}" class="select" data-bind="ep" data-i="${i}" data-f="role"><option value="">Choose</option>${PERSON_ROLES.map((r) => `<option value="${r}" ${p.role === r ? "selected" : ""}>${r}</option>`).join("")}</select></div>
              <button class="btn ghost sm" data-act="delPerson" data-i="${i}" aria-label="Remove person ${i + 1}">${ICON.trash}</button>
              <div class="field"><label for="pa${i}">Alias (if any)</label><input id="pa${i}" class="input" data-bind="ep" data-i="${i}" data-f="alias" value="${h(p.alias || "")}" /></div>
              <div class="field"><label for="pc${i}">Mobile number</label><input id="pc${i}" class="input mono" inputmode="tel" data-bind="ep" data-i="${i}" data-f="contact" value="${h(p.contact || "")}" placeholder="+91 00000 00000" /></div>
              <div class="field"><label for="pt${i}">ID proof</label><select id="pt${i}" class="select" data-bind="epidt" data-i="${i}"><option value="" ${!p.idType ? "selected" : ""}>None</option><option value="aadhaar" ${p.idType === "aadhaar" ? "selected" : ""}>Aadhaar Card</option><option value="pan" ${p.idType === "pan" ? "selected" : ""}>PAN Card</option></select></div>
              <div class="field"><label for="px${i}">ID number (saved masked)</label><input id="px${i}" class="input mono" data-bind="epid" data-i="${i}" value="${h(p.idMasked || "")}" ${p.idType ? "" : "disabled"} placeholder="${p.idType === "pan" ? "ABCPE1234F" : p.idType === "aadhaar" ? "12 digits" : "Choose the ID proof first"}" autocomplete="off" /><span class="help" id="pxh${i}">${p.idMasked ? "Saved masked. The full number is not stored." : p.idType ? "Type the full number. Only the masked number is saved." : ""}</span></div>
              <div class="field w2"><label for="pd${i}">Address</label><input id="pd${i}" class="input" data-bind="ep" data-i="${i}" data-f="address" value="${h(p.address || "")}" placeholder="House, street, area, town and PIN code" /></div>
              </div>`).join("") : `<div class="empty">No people added yet.</div>`}</div>
          </div>
          <div class="stack" style="gap:8px">
            <div class="row"><h3 style="flex:1">Identifiers</h3><button class="btn sm" data-act="addId">${ICON.plus}Add identifier</button></div>
            <p class="help">Vehicle numbers, mobile numbers, IMEI and document numbers. These make the record searchable and let the connection finder compare it.</p>
            <div class="rep">${d.identifiers.length ? d.identifiers.map((x, i) => `<div class="rep-row i">
              <div class="field"><label for="ik${i}">Type</label><select id="ik${i}" class="select" data-bind="ei" data-i="${i}" data-f="kind">${ID_KINDS.map((k) => `<option value="${k.id}" ${x.kind === k.id ? "selected" : ""}>${k.label}</option>`).join("")}</select></div>
              <div class="field"><label for="iv${i}">Value</label><input id="iv${i}" class="input mono" data-bind="ei" data-i="${i}" data-f="value" value="${h(x.value)}" /></div>
              <button class="btn ghost sm" data-act="delId" data-i="${i}" aria-label="Remove identifier ${i + 1}">${ICON.trash}</button>
              <div class="field w2"><label for="ic${i}">Context</label><input id="ic${i}" class="input" data-bind="ei" data-i="${i}" data-f="context" value="${h(x.context || "")}" placeholder="for example Stolen vehicle, Caller number" /></div>
              </div>`).join("") : `<div class="empty">No identifiers yet.</div>`}</div>
          </div>
        </div>
      </section>
      <section class="card" id="entry-photos">${vEntryPhotos()}</section>
      <section class="card" id="entry-sign">${vEntrySign()}</section>
    </div>
    <div class="stack">
      <section class="card" id="entry-checks">${vEntryChecks()}</section>
      <section class="card" id="entry-conn">${vEntryConn()}</section>
      <section class="card" id="entry-save">${vEntrySave()}</section>
    </div>
  </div>
  <div class="banner warn"><b style="letter-spacing:.1em;text-transform:uppercase;font-size:12px">Boundary</b><span>This is structured staff entry. It is not an automated FIR decision, registration or complaint rejection.</span></div>`;
}
function entryProbe(d) {
  const people = (d.people || []).filter((p) => (p.name || "").trim() || p.contact).map((p) => ({ name: (p.name || "").trim(), role: p.role, contact: p.contact || "", alias: p.alias || "" }));
  const ids = (d.identifiers || []).filter((x) => (x.value || "").trim()).concat(findIdsInText(d.summary || ""));
  return { people, identifiers: ids, location: d.location || "" };
}
function vEntryConn() {
  const d = S.draft;
  const list = matchCases(entryProbe(d), d.editingId || "");
  return `<div class="card-h"><h3>Connected cases</h3><span class="chip ${list.length ? "accent" : ""} plain">${list.length}</span></div><div class="card-b stack" style="gap:8px"><p class="help">Checked as you type. Same person, mobile number, vehicle, IMEI, place or accused name in older cases and complaints.</p>${connHTML(list, 6)}</div>`;
}
const padHTML = (kind, label) => `<div class="pad-wrap"><canvas class="pad" data-pad="${kind}" aria-label="${h(label || "Signature pad")}"></canvas><span class="pad-x" aria-hidden="true">✕</span><span class="pad-line" aria-hidden="true"></span></div>`;
function vEntryPhotos() {
  const d = S.draft;
  return `<div class="card-h"><span class="eyebrow">02</span><h2>Photos</h2><span class="muted small">${d.photos.length} / 8</span></div>
  <div class="card-b stack">
    <p class="help">Photos of the scene, damaged property or documents shown by the complainant. Each photo is saved with the record, your name and the time.</p>
    <div class="row">
      <button class="btn" data-act="pickFile" data-for="ph-cam" ${d.photos.length >= 8 ? "disabled" : ""}>${ICON.camera}Take photo</button>
      <button class="btn" data-act="pickFile" data-for="ph-file" ${d.photos.length >= 8 ? "disabled" : ""}>${ICON.upload}Add from files</button>
      <input id="ph-cam" type="file" accept="image/*" capture="environment" class="sr" data-bind="photoFile" tabindex="-1" aria-hidden="true" />
      <input id="ph-file" type="file" accept="image/*" multiple class="sr" data-bind="photoFile" tabindex="-1" aria-hidden="true" />
    </div>
    ${d.photos.length ? `<div class="photos">${d.photos.map((p, i) => `<figure class="ph">${MEDIA[p.id] ? `<img src="${MEDIA[p.id]}" alt="Photo ${i + 1}" data-act="viewMedia" data-id="${p.id}" />` : `<div class="ph-miss">Photo not available</div>`}<div class="row" style="gap:6px;flex-wrap:nowrap"><label class="sr" for="phc${i}">Caption for photo ${i + 1}</label><input id="phc${i}" class="input" data-bind="photoCap" data-i="${i}" value="${h(p.caption || "")}" placeholder="Caption, for example Broken lock" /><button class="btn ghost sm" data-act="delPhoto" data-i="${i}" aria-label="Remove photo ${i + 1}">${ICON.trash}</button></div></figure>`).join("")}</div>` : `<div class="empty">No photos added.</div>`}
  </div>`;
}
function vEntrySign() {
  const d = S.draft; const sg = signer(d); const sn = d.sign || {};
  return `<div class="card-h"><span class="eyebrow">02</span><h2>Complainant signature and thumb impression</h2>${sg ? (sn.complainant || sn.thumb ? `<span class="chip ok">Done</span>` : `<span class="chip crit">Needed</span>`) : ""}</div>
  <div class="card-b stack">
  ${sg ? `<p class="small"><span class="muted">Signer:</span> <b data-notr>${h(sg.name)}</b> <span class="chip plain">${h(sg.role)}</span></p>
    <p class="help">One of the two is needed. Use the thumb impression if the person cannot sign.</p>
    <div class="grid g2" style="align-items:start">
      <div class="stack sigbox"><div class="lbl">${ICON.pen.replace("<svg", '<svg style="width:15px;height:15px;vertical-align:-2px"')} Electronic signature</div>${padHTML("complainant", "Signature pad for the complainant")}
        <div class="row tiny"><span class="muted">${sn.complainant ? "Signed " + h(fmtDT(sn.complainant.at)) : "Sign with a finger, stylus or mouse"}</span><span class="spacer"></span><button class="btn sm ghost" data-act="clearPad" data-pad="complainant">Clear</button></div></div>
      <div class="stack sigbox"><div class="lbl">${ICON.thumb.replace("<svg", '<svg style="width:15px;height:15px;vertical-align:-2px"')} Thumb impression</div>
        ${sn.thumb && MEDIA[sn.thumb.id] ? `<div class="thumb"><img src="${MEDIA[sn.thumb.id]}" alt="Thumb impression" data-act="viewMedia" data-id="${sn.thumb.id}" /></div><div class="row tiny"><span class="muted">${h(sn.thumb.hand)} · ${h(fmtDT(sn.thumb.at))}</span><span class="spacer"></span><button class="btn sm ghost" data-act="clearThumb">Remove</button></div>`
          : `<div class="thumb empty">${ICON.thumb}<span>No impression yet</span></div>`}
        <div class="row" style="gap:6px"><label class="sr" for="th-hand">Which thumb</label><select id="th-hand" class="select" style="width:auto" data-bind="thumbHand"><option value="Left thumb" ${sn.thumbHand !== "Right thumb" ? "selected" : ""}>Left thumb</option><option value="Right thumb" ${sn.thumbHand === "Right thumb" ? "selected" : ""}>Right thumb</option></select>
          <button class="btn sm" data-act="pickFile" data-for="th-cam">${ICON.camera}Take photo</button><button class="btn sm" data-act="pickFile" data-for="th-file">${ICON.upload}Upload scan</button></div>
        <input id="th-cam" type="file" accept="image/*" capture="environment" class="sr" data-bind="thumbFile" tabindex="-1" aria-hidden="true" /><input id="th-file" type="file" accept="image/*" class="sr" data-bind="thumbFile" tabindex="-1" aria-hidden="true" />
        <p class="help">Take the inked impression on paper, then photograph or scan it. A fingerprint scanner can be connected in the full system.</p></div>
    </div>` : `<div class="empty">Add a complainant, informant or petitioner under People. Then the signature and thumb impression boxes appear here.</div>`}
  </div>`;
}
function vEntryChecks() {
  const d = S.draft; const comp = completeness(d); const items = entryChecks(d);
  const pct = Math.round((comp.done / comp.total) * 100);
  const icon = { missing: "!", warn: "!", tip: "i", good: "✓" };
  const ai = ui.aiReview;
  return `<div class="card-h"><span class="eyebrow">03</span><h2>AI-assisted quality check</h2></div>
  <div class="card-b stack">
    <div class="stack" style="gap:6px"><div class="row"><b class="small" style="flex:1">Required details</b><span class="num small">${comp.done} of ${comp.total}</span></div><div class="meter ${pct === 100 ? "ok" : pct < 60 ? "warn" : ""}"><i style="width:${pct}%"></i></div></div>
    <div class="checks" aria-live="polite">${items.map((c) => `<div class="ck ${c.level}"><span class="ic">${icon[c.level]}</span><span>${h(c.msg)}</span>${c.fix ? `<button class="btn sm" data-act="fixAddId" data-kind="${c.fix.kind}" data-value="${h(c.fix.value)}">Add</button>` : c.field && c.level !== "good" ? `<button class="linkbtn small" data-act="focusField" data-f="${c.field}">Go</button>` : "<span></span>"}</div>`).join("")}</div>
    ${AI ? `<div class="stack" style="gap:8px;border-top:1px solid var(--line);padding-top:12px">
      <div class="row"><b class="small" style="flex:1">Deeper AI review (Claude)</b><button class="btn sm" data-act="aiReview" ${ui.aiBusy ? "disabled" : ""}>${ui.aiBusy ? '<span class="spin"></span>Reviewing' : ICON.spark + "Review wording"}</button></div>
      ${ai ? `${(ai.issues || []).length ? `<div class="checks">${ai.issues.slice(0, 5).map((x) => `<div class="ck tip"><span class="ic">i</span><span>${h(x.message)}</span><span></span></div>`).join("")}</div>` : ""}
        ${ai.suggested_summary ? `<div class="stack" style="gap:6px"><span class="lbl">Suggested clearer summary (uses only your facts)</span><div class="note" data-notr>${h(ai.suggested_summary)}</div><div class="row"><button class="btn sm primary" data-act="useAiSummary">Use this wording</button><button class="btn sm" data-act="dropAi">Keep mine</button></div></div>` : ""}
        ${(ai.questions || []).length ? `<div class="stack" style="gap:4px"><span class="lbl">Questions to ask the complainant</span>${ai.questions.slice(0, 3).map((q) => `<span class="small">• ${h(q)}</span>`).join("")}</div>` : ""}` : `<p class="help">Claude reads the draft and suggests clearer wording. It never adds facts and never decides on registration.</p>`}
    </div>` : `<p class="help">Rule-based checks run as you type. ${h(AI_OFF_REASON)}</p>`}
  </div>`;
}
function vEntrySave() {
  const d = S.draft; const comp = completeness(d);
  const missing = comp.list.filter((x) => !x.ok).map((x) => x.label).concat(signNeeds(d));
  const t = typeOf(d.type);
  const os = d.sign.officer;
  if (os && os.userId !== S.userId) missing.push("Officer signature");
  return `<div class="card-h"><span class="eyebrow">04</span><h2>Officer review and save</h2></div>
  <div class="card-b stack">
    <div class="preview">
      <div class="ph"><span>Direct entry / ${d.editingId ? "Edit draft" : "New record"}</span><span class="chip warn plain" style="background:#f5b13d26;color:#f5b13d">Draft</span></div>
      <div class="pb">
        <div><div class="pk">Record reference</div><div class="pv mono">${h(d.ref)}</div></div>
        <div><div class="pk">Date / time</div><div class="pv">${h(fmtDate(d.date))}${d.time ? " · " + h(d.time) : ""}</div></div>
        <div class="full"><div class="pk">Type and location</div><div class="pv">${d.type ? h(t.label) : '<span class="muted">Type not chosen</span>'} · ${d.location ? h(d.location) : '<span class="muted">Location not set</span>'}</div></div>
        <div class="full"><div class="pk">Incident summary</div><div class="pv">${d.summary ? h(d.summary.length > 180 ? d.summary.slice(0, 180) + "…" : d.summary) : '<span class="muted">Not written yet</span>'}</div></div>
        <div class="full"><div class="pk">Sections of law</div><div class="pv">${(d.sections || []).length ? `<span data-notr>${h(d.sections.map(lawOf).filter(Boolean).map(lawSec).join(", "))}</span>` : "None added"}</div></div>
        <div class="full"><div class="pk">Photos and signatures</div><div class="pv">${d.photos.length} photo${d.photos.length === 1 ? "" : "s"} · ${d.sign.complainant ? "Complainant signed" : d.sign.thumb ? "Thumb impression taken" : "Complainant not signed"} · ${os ? "Officer signed" : "Officer not signed"}</div></div>
        <div class="full"><div class="pk">People and identifiers</div><div class="pv">${d.people.filter((p) => p.name).map((p) => `${h(p.name)} <span class="muted">(${h(p.role || "no role")})</span>`).join(", ") || '<span class="muted">None</span>'}${d.identifiers.filter((x) => x.value).length ? " · " + d.identifiers.filter((x) => x.value).map((x) => `<span class="mono">${h(x.value)}</span>`).join(", ") : ""}</div></div>
      </div>
    </div>
    ${missing.length ? `<div class="banner warn small"><span><b>Still needed:</b> ${missing.map((m) => `<span class="need">${h(m)}</span>`).join(" ")}</span></div>` : ""}
    <div class="stack sigbox"><div class="lbl">${ICON.pen.replace("<svg", '<svg style="width:15px;height:15px;vertical-align:-2px"')} Signature of recording officer</div>${padHTML("officer", "Signature pad for the recording officer")}
      <div class="row tiny"><span class="muted">${os ? `Signed by ${h(userName(os.userId))} · ${h(fmtDT(os.at))}` : `Sign as ${h(me().name)}, ${h(me().roleLabel)}`}</span><span class="spacer"></span><button class="btn sm ghost" data-act="clearPad" data-pad="officer">Clear</button></div>
      ${os && os.userId !== S.userId ? `<div class="banner warn small">This signature belongs to ${h(userName(os.userId))}. Clear it and sign again as ${h(me().name)}.</div>` : ""}</div>
    <label class="cbx"><input type="checkbox" id="e-confirm" data-bind="confirm" ${ui.entryConfirm ? "checked" : ""} /><span>I have read this entry. It records what was reported, in the reporter's words where possible.</span></label>
    ${can("verify") ? `<button class="btn primary" style="width:100%" data-act="verifyEntry" ${missing.length ? "disabled" : ""}>${ICON.check}Verify and save</button>
    <div class="row"><button class="btn" style="flex:1" data-act="submitEntry" ${missing.length ? "disabled" : ""}>Submit for verification</button><button class="btn" style="flex:1" data-act="saveDraft">Save draft</button></div>` : `<button class="btn primary" style="width:100%" data-act="submitEntry" ${missing.length ? "disabled" : ""}>Submit for verification</button>
    <div class="row"><button class="btn" style="flex:1" data-act="saveDraft">Save draft</button></div>`}
    <p class="help"><span>${h(`Saved as ${me().name} (${me().roleLabel}) with the time.`)}</span> <span>${can("verify") ? "As an officer you can verify now." : "An SI or SHO verifies it before it becomes trusted."}</span></p>
  </div>`;
}

/* ---------- Scanner ---------- */
function vScanner() {
  const d = ui.docId ? getDoc(ui.docId) : null;
  const w = d ? ui.work[d.id] : null;
  const stage = !d ? 0 : w ? (w.step === "extract" ? 1 : 2) : d.status === "manual" ? 1 : d.status === "verified" ? 5 : 3;
  const P = [["01", "Upload", "PDF, photograph or scanned page"], ["02", "Extract", "OCR reads printed or handwritten text where supported"], ["03", "Structure", "Dates, places, references, names and roles"], ["04", "Verify", "Officer checks uncertain or low-confidence fields"], ["05", "Search", "Verified information joins the search layer"]];
  const queue = S.docs.slice().reverse();
  return `${intro()}
  <div class="pipe" aria-label="Scanner steps">${P.map((p, i) => `<div class="p ${i < stage ? "done" : i === stage ? "on" : ""}"><span class="k">${p[0]}${i < stage ? " · done" : i === stage ? " · now" : ""}</span><b>${p[1]}</b><span>${p[2]}</span></div>`).join("")}</div>
  <div class="split-l">
    <div class="stack">
      <section class="card">
        <div class="card-h"><h2>Add a document</h2></div>
        <div class="card-b stack">
          <label class="drop" id="drop" data-drop="1" for="file">${ICON.upload}<b>Drop a file here or choose one</b><span class="help">JPG, PNG or PDF. The original file is kept with the record.</span></label>
          <input id="file" type="file" accept="image/*,application/pdf" class="sr" data-bind="file" />
          <div class="lbl">Or try a sample paper record</div>
          <div class="samples">${["PAPER-COMPLAINT", "DEMO-309", "DEMO-312", "DEMO-318"].filter((k) => DOC_ASSETS[k]).map((k) => `<button class="sample" data-act="useSample" data-id="${k}" title="Scan sample ${k}"><img src="${DOC_ASSETS[k].src}" alt="Sample paper record ${k}" /><span class="mono">${k}</span></button>`).join("")}</div>
          <p class="help">Samples are fictional paper records: a written complaint with ID proof and accused name, an incident report, a lost property report and a diary extract with handwriting.</p>
        </div>
      </section>
      <section class="card">
        <div class="card-h"><h2>Document queue</h2><span class="muted small">${S.docs.length} files</span></div>
        <div class="card-b queue">${queue.map((x) => `<button class="qi ${ui.docId === x.id ? "on" : ""}" data-act="openDoc" data-id="${x.id}"><span class="th" style="${docSrc(x) ? `background-image:url('${docSrc(x)}')` : ""}">${docSrc(x) ? "" : x.mime === "application/pdf" ? "PDF" : "FILE"}</span><span style="min-width:0"><b>${h(x.name)}</b><span class="row" style="gap:6px;margin-top:3px">${ui.work[x.id] ? '<span class="chip info">Processing</span>' : docChip(x)}${x.recordId ? `<span class="mono tiny muted">${h(x.recordId)}</span>` : ""}</span></span></button>`).join("")}</div>
      </section>
    </div>
    <div class="stack">${d ? vDocDetail(d) : `<section class="card"><div class="empty" style="padding:60px 20px">${ICON.scan.replace("<svg", '<svg style="width:40px;height:40px;color:var(--accent)"')}<p style="margin-top:10px"><b>Choose a sample or upload a file to begin.</b></p><p class="small">The page will extract the text, find the key fields and show its confidence for each one.</p></div></section>`}
      <div class="grid g2">
        <div class="card card-b"><div class="eyebrow">Source preservation</div><p style="margin-top:6px">Original document, extracted text and verified fields stay linked to one record.</p></div>
        <div class="card card-b"><div class="eyebrow" style="color:var(--warn)">Draft rule</div><p style="margin-top:6px">OCR output is a draft until an authorised officer reviews it. Only verified records are searched and compared.</p></div>
      </div>
    </div>
  </div>`;
}
function vDocDetail(d) {
  const w = ui.work[d.id];
  const img = docSrc(d);
  const orig = `<div class="orig"><div class="row"><span class="lbl" style="flex:1">Original (preserved)</span>${d.mime === "application/pdf" && d.numPages ? `<span class="muted tiny">${d.numPages} page PDF, first ${Math.min(3, d.numPages)} shown</span>` : ""}</div>
    ${img ? (d.pages && d.pages.length ? d.pages : [img]).map((src, i) => `<img src="${src}" alt="Original page ${i + 1} of ${h(d.name)}" data-act="viewImg" data-src="${i}" data-doc="${d.id}" />`).join("") : d.notPersisted ? `<div class="empty">The original was kept for the earlier session only. Browser storage was full. In the full system originals are stored on the station server.</div>` : `<div class="empty">${d.mime === "application/pdf" ? "PDF pages appear after processing." : "No preview."}</div>`}
    <div class="muted tiny">${h(d.name)} · uploaded by ${h(userName(d.uploadedBy))} · ${h(fmtDT(d.uploadedAt))}</div></div>`;
  let right = "";
  if (w) {
    const order = ["extract", "structure"];
    const at = order.indexOf(w.step);
    right = `<div class="working" aria-live="polite">
      <div class="wl done">${ICON.check.replace("<svg", '<svg style="width:18px;height:18px"')}File received and original stored</div>
      <div class="wl ${at > 0 ? "done" : ""}">${at > 0 ? ICON.check.replace("<svg", '<svg style="width:18px;height:18px"') : '<span class="spin"></span>'}Extract text${at === 0 ? ": " + h(w.msg) : ""}</div>
      <div class="wl ${at === 1 ? "" : "wait"}">${at === 1 ? '<span class="spin"></span>' : '<span style="width:18px"></span>'}Structure fields${at === 1 ? ": " + h(w.msg) : ""}</div>
      <div class="wl wait"><span style="width:18px"></span>Officer verification</div></div>`;
  } else if (d.status === "manual") {
    right = `<div class="stack"><div class="banner warn">OCR is not available in this view, so the text could not be read automatically. Type or paste the text from the page. The rules will then find the fields.</div>
      <div class="field"><label for="manualText">Text from the document</label><textarea id="manualText" class="textarea" style="min-height:220px" placeholder="Date: 18/10/2026  Time: 07:40 hrs&#10;Place: …&#10;Complainant: …&#10;Details: …">${h(d.manualText || "")}</textarea></div>
      <div class="row"><button class="btn primary" data-act="manualStructure" data-id="${d.id}">Find the fields</button><button class="btn" data-act="retryDoc" data-id="${d.id}">Try OCR again</button></div></div>`;
  } else if (d.x || d.status === "verified") {
    right = vVerify(d);
  } else {
    right = `<div class="row"><button class="btn primary" data-act="retryDoc" data-id="${d.id}">Extract text</button></div>`;
  }
  return `<section class="card">
    <div class="card-h"><h2 style="min-width:0;overflow-wrap:anywhere">${h(d.name)}</h2>${w ? '<span class="chip info">Processing</span>' : docChip(d)}</div>
    <div class="docview">${orig}<div class="ext">${right}</div></div>
  </section>`;
}
function vVerify(d) {
  const x = d.x;
  if (!x) {
    return `<div class="stack"><div class="row"><span class="chip ok">Verified</span><span class="muted small">${h(`Verified by ${userName(d.verifiedBy)} · ${fmtDT(d.verifiedAt)}`)}</span></div>
    ${d.recordId ? `<div class="row"><span>Linked record:</span>${recLink(d.recordId)}</div>` : ""}
    <div><div class="lbl" style="margin-bottom:6px">Extracted text (${h(d.engine || "OCR")})</div><div data-notr class="ocrtext">${h(d.ocrText || "No text stored.")}</div></div></div>`;
  }
  const rows = docRows(d);
  const left = rows.filter((r) => !r.ok).length;
  const low = rows.filter((r) => r.conf < 0.75 && !r.ok).length;
  const ro = d.status === "verified";
  const cell = (k, label, control, conf, ok) => `<tr class="${conf < 0.75 ? "lowconf" : ""}"><td class="c"><input type="checkbox" aria-label="Checked: ${h(label)}" data-bind="dxc" data-k="${k}" ${ok ? "checked" : ""} ${ro ? "disabled" : ""} /></td><td style="width:118px"><b class="small">${h(label)}</b><div>${confBadge(conf)}</div></td><td>${control}</td></tr>`;
  const inp = (k, v, extra) => `<input class="input ${extra || ""}" id="dx-${k}" data-bind="dx" data-k="${k}" value="${h(v)}" ${ro ? "readonly" : ""} aria-label="${k}" />`;
  return `<div class="row" style="gap:8px"><span class="chip accent plain">${h(d.engine || "OCR")}</span>${d.meanConf ? `<span class="muted small">Average OCR confidence ${Math.round(d.meanConf)}%</span>` : ""}</div>
  ${(d.uncertain || []).length ? `<div class="banner warn small"><span><b>Reader notes:</b> ${h(d.uncertain.join(" "))}</span></div>` : ""}
  <details><summary class="lbl" style="cursor:pointer">Extracted text (OCR draft)</summary><div data-notr class="ocrtext" style="margin-top:8px">${h(d.ocrText)}</div></details>
  <div>
    <div class="row" style="margin-bottom:8px"><h3 style="flex:1">Structured fields</h3>${ro ? "" : `<button class="btn sm" data-act="tickHigh" data-id="${d.id}">Tick all high-confidence fields</button>`}</div>
    <p class="help" style="margin-bottom:8px">Read each field against the original. Fix anything wrong, then tick it. Rows in amber have low confidence.</p>
    <div class="table-wrap"><table class="t vtable"><tbody>
      ${cell("reference", "Case reference", inp("reference", x.reference, "mono"), x.conf.reference, x.ok.reference)}
      ${cell("type", "Record type", `<select class="select" id="dx-type" data-bind="dx" data-k="type" ${ro ? "disabled" : ""}><option value="">Choose</option>${RECORD_TYPES.map((t) => `<option value="${t.id}" ${x.type === t.id ? "selected" : ""}>${t.label}</option>`).join("")}</select>`, x.conf.type, x.ok.type)}
      ${cell("date", "Date", `<input type="date" class="input" id="dx-date" data-bind="dx" data-k="date" value="${h(x.date)}" ${ro ? "readonly" : ""} />`, x.conf.date, x.ok.date)}
      ${cell("time", "Time", `<input type="time" class="input" id="dx-time" data-bind="dx" data-k="time" value="${h(x.time)}" ${ro ? "readonly" : ""} />`, x.conf.time, x.ok.time)}
      ${cell("location", "Location", inp("location", x.location), x.conf.location, x.ok.location)}
      ${cell("summary", "Summary", `<textarea class="textarea" id="dx-summary" data-bind="dx" data-k="summary" ${ro ? "readonly" : ""}>${h(x.summary)}</textarea>`, x.conf.summary, x.ok.summary)}
      ${x.people.map((p, i) => cell("p" + i, "Person " + (i + 1), `<div class="sub2"><input class="input w" id="dxp-n${i}" aria-label="Name" data-bind="dxp" data-i="${i}" data-f="name" value="${h(p.name)}" ${ro ? "readonly" : ""} /><select class="select" id="dxp-r${i}" aria-label="Role" data-bind="dxp" data-i="${i}" data-f="role" ${ro ? "disabled" : ""}>${PERSON_ROLES.map((r) => `<option value="${r}" ${p.role === r ? "selected" : ""}>${r}</option>`).join("")}</select><input class="input mono" id="dxp-c${i}" aria-label="Contact" placeholder="Contact" data-bind="dxp" data-i="${i}" data-f="contact" value="${h(p.contact)}" ${ro ? "readonly" : ""} /></div>${p.alias || p.idMasked || p.address ? `<div class="tiny muted dx-more">${p.alias ? `<span>Alias</span> <span data-notr>${h(p.alias)}</span>` : ""}${p.idMasked ? ` · <span>${p.idType === "pan" ? "PAN" : "Aadhaar"}</span> <span class="mono">${h(p.idMasked)}</span>` : ""}${p.address ? ` · <span>Address</span> <span data-notr>${h(p.address)}</span>` : ""}</div>` : ""}`, p.conf, p.ok)).join("")}
      ${x.identifiers.map((p, i) => cell("i" + i, "Identifier " + (i + 1), `<div class="sub2"><select class="select" id="dxi-k${i}" aria-label="Identifier type" data-bind="dxi" data-i="${i}" data-f="kind" ${ro ? "disabled" : ""}>${ID_KINDS.map((k) => `<option value="${k.id}" ${p.kind === k.id ? "selected" : ""}>${k.label}</option>`).join("")}</select><input class="input mono" id="dxi-v${i}" aria-label="Value" data-bind="dxi" data-i="${i}" data-f="value" value="${h(p.value)}" ${ro ? "readonly" : ""} /><input class="input w" id="dxi-c${i}" aria-label="Context" placeholder="Context" data-bind="dxi" data-i="${i}" data-f="context" value="${h(p.context)}" ${ro ? "readonly" : ""} /></div>`, p.conf, p.ok)).join("")}
    </tbody></table></div>
    ${ro ? "" : `<div class="row" style="margin-top:8px"><button class="btn sm" data-act="dxAddPerson" data-id="${d.id}">${ICON.plus}Add person</button><button class="btn sm" data-act="dxAddId" data-id="${d.id}">${ICON.plus}Add identifier</button></div>`}
  </div>
  ${ro ? `<div class="banner accent"><span>${h(`Verified by ${userName(d.verifiedBy)} · ${fmtDT(d.verifiedAt)}`)}</span>${d.recordId ? ` ${recLink(d.recordId)} <span>is now searchable.</span>` : ""}</div>` : `
  <div class="stack" style="gap:8px;border-top:1px solid var(--line);padding-top:12px">
    <div class="banner info small fill-entry">${ICON.entry}<span style="flex:1"><b>Paper complaint?</b> <span>Fill the Direct Entry form with these details. You check them, add signatures and save. Connected cases show at once.</span>${x.station ? ` <span>Police station on the page:</span> <b data-notr>${h(x.station)}</b>` : ""}</span><button class="btn sm primary" data-act="docToEntry" data-id="${d.id}">Fill the Direct Entry form</button></div>
    <div class="row small">${left ? `<b>${left} ${left > 1 ? "fields" : "field"} left to check.</b>${low ? ` <b style="color:var(--warn)">${low} with low confidence.</b>` : ""}` : `<b style="color:var(--ok)">All fields checked.</b>`}</div>
    <div class="row">${can("verify") ? `<button class="btn primary" data-act="verifyDoc" data-id="${d.id}" ${left ? "disabled" : ""}>${ICON.check}Verify and add to records</button>` : d.status === "submitted" ? `<span class="chip warn">Sent to an officer. Waiting for verification.</span>` : `<button class="btn primary" data-act="submitDoc" data-id="${d.id}" ${left ? "disabled" : ""}>Send to officer for verification</button>`}</div>
    ${can("verify") ? "" : `<p class="help">Your role can check fields. Only an SI or SHO can make the record trusted.</p>`}
  </div>`}`;
}

/* ---------- Records & search ---------- */
function searchRecords() {
  const q = ui.q.trim();
  let list = S.records.filter((r) => (ui.fStatus === "verified" ? r.status === "verified" : r.status !== "draft"));
  if (ui.fType !== "all") list = list.filter((r) => r.type === ui.fType);
  if (ui.fSource !== "all") list = list.filter((r) => r.source === ui.fSource);
  if (!q) return list.sort((a, b) => (b.date || "").localeCompare(a.date || "")).map((r) => ({ r, hits: [] }));
  const toks = q.toLowerCase().split(/\s+/).filter(Boolean);
  const out = [];
  list.forEach((r) => {
    const docsText = (r.docIds || []).map((id) => (getDoc(id) || {}).ocrText || "").join(" \n ");
    const fields = [
      { f: "Reference", t: r.id }, { f: "Type", t: typeOf(r.type).label + " " + (r.title || "") }, { f: "Location", t: r.location }, { f: "Summary", t: r.summary },
      { f: "People", t: r.people.map((p) => `${p.name} (${p.role})${p.alias ? " alias " + p.alias : ""}${p.contact ? " " + p.contact : ""}`).join("; ") },
      { f: "Identifiers", t: r.identifiers.map((x) => `${idKindLabel(x.kind)} ${x.value} ${x.context || ""}`).join("; ") },
      { f: "Date", t: fmtDate(r.date) + " " + r.date }, { f: "Source document text", t: docsText },
    ];
    const hits = []; let all = true;
    toks.forEach((tk) => {
      const nt = tk.replace(/[^a-z0-9]/g, "");
      let found = false;
      fields.forEach((fd) => {
        const low = (fd.t || "").toLowerCase();
        const flat = low.replace(/[^a-z0-9]/g, "");
        if (low.includes(tk) || (nt.length >= 4 && flat.includes(nt))) { found = true; if (!hits.some((x) => x.f === fd.f)) hits.push({ f: fd.f, t: fd.t }); }
      });
      if (!found) all = false;
    });
    if (all) out.push({ r, hits, score: hits.length });
  });
  return out.sort((a, b) => b.score - a.score);
}
function snippet(text, toks) {
  const t = String(text || "").replace(/\s+/g, " ");
  const low = t.toLowerCase();
  let i = -1;
  for (const tk of toks) { i = low.indexOf(tk); if (i >= 0) break; }
  const start = Math.max(0, i - 50);
  let s = (start > 0 ? "…" : "") + t.slice(start, start + 170) + (start + 170 < t.length ? "…" : "");
  let html = h(s);
  toks.forEach((tk) => { if (tk.length < 2) return; const re = new RegExp("(" + tk.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"); html = html.replace(re, "<mark>$1</mark>"); });
  return html;
}
function vResults() {
  const res = searchRecords();
  const toks = ui.q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const hidden = ui.fStatus === "verified" ? S.records.filter((r) => r.status === "pending").length : 0;
  return `<div class="row" style="margin-bottom:10px"><span class="small">${ui.q.trim() ? h(`${res.length} ${res.length === 1 ? "record matches" : "records match"} "${ui.q.trim()}"`) : h(`${res.length} ${res.length === 1 ? "record" : "records"}`)}</span><span class="spacer"></span>${hidden ? `<span class="muted small">${hidden} unverified ${hidden === 1 ? "entry is" : "entries are"} hidden.</span>` : ""}</div>
  <div class="res">${res.length ? res.map(({ r, hits }) => {
    const first = hits.find((x) => x.f !== "Reference") || hits[0];
    return `<button class="ri" data-act="openRecord" data-id="${r.id}" data-from="search" style="--k:${typeColor(r.type)}"><span class="bar"></span><span class="bd">
      <span class="top"><span class="mono" style="color:${typeColor(r.type)};font-weight:600">${h(r.id)}</span><b>${h(r.title || typeOf(r.type).label)}</b>${statusChip(r)}<span class="chip plain">${srcLabel(r)}</span></span>
      <span class="meta"><span>${h(fmtDate(r.date))}${r.time ? " · " + h(r.time) : ""}</span><span>${h(r.location)}</span><span>${r.people.length} ${r.people.length === 1 ? "person" : "people"} · ${r.identifiers.length} ${r.identifiers.length === 1 ? "identifier" : "identifiers"}</span></span>
      <span class="snip" data-notr>${first ? snippet(first.t, toks) : h((r.summary || "").slice(0, 170)) + ((r.summary || "").length > 170 ? "…" : "")}</span>
      ${hits.length ? `<span class="row" style="gap:6px">${hits.map((x) => `<span class="mf">Matched in ${h(x.f)}</span>`).join("")}</span>` : ""}
    </span></button>`;
  }).join("") : `<div class="card empty">No records match. Try a shorter word, part of a vehicle number like 4471, or switch on unverified entries.</div>`}</div>`;
}
function vRecords() {
  return `${intro()}
  <section class="card card-b stack">
    <form class="sbar" data-form="search" role="search"><div class="big">${ICON.search}<label class="sr" for="q">Search records</label><input id="q" class="input" data-bind="q" value="${h(ui.q)}" placeholder="Try: KA 00 DM 4471, Farhana, 55821, Jewargi, OTP" autocomplete="off" /></div>
      <select class="select" style="width:auto" id="fType" data-bind="fType" aria-label="Record type"><option value="all">All types</option>${RECORD_TYPES.map((t) => `<option value="${t.id}" ${ui.fType === t.id ? "selected" : ""}>${t.label}</option>`).join("")}</select>
      <select class="select" style="width:auto" id="fSource" data-bind="fSource" aria-label="Source"><option value="all">All sources</option><option value="direct" ${ui.fSource === "direct" ? "selected" : ""}>Direct entry</option><option value="scan" ${ui.fSource === "scan" ? "selected" : ""}>Digitised files</option><option value="online" ${ui.fSource === "online" ? "selected" : ""}>Online complaints</option></select>
      <select class="select" style="width:auto" id="fStatus" data-bind="fStatus" aria-label="Status"><option value="verified" ${ui.fStatus === "verified" ? "selected" : ""}>Verified only</option><option value="all" ${ui.fStatus === "all" ? "selected" : ""}>Include awaiting verification</option></select>
    </form>
    <p class="help">Search time is measured from your first key press to opening a record, for the pilot metric "time to locate a target field".</p>
  </section>
  <section id="results">${vResults()}</section>`;
}

/* ---------- Record drawer ---------- */
function vDrawer(id) {
  const r = getRec(id);
  if (!r) return "";
  const docs = (r.docIds || []).map(getDoc).filter(Boolean);
  const links = S.links.filter((l) => (l.a === id || l.b === id) && (l.reasons || []).length);
  const tasks = S.tasks.filter((t) => t.recordId === id);
  return `<div class="scrim" data-act="closeDrawer" data-self="1"><aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="dr-t">
    <div class="drawer-h"><div style="flex:1;min-width:0"><div class="eyebrow" style="color:var(--gold)">${h(typeOf(r.type).group)} · ${h(srcLabel(r))}</div><h2 id="dr-t"><span class="mono">${h(r.id)}</span> / <span>${h(r.title || typeOf(r.type).label)}</span></h2><div class="row" style="margin-top:8px">${statusChip(r)}${caseChip(r)}</div></div><button class="x" data-act="closeDrawer" aria-label="Close">${ICON.x}</button></div>
    <div class="drawer-b">
      ${r.status === "pending" ? `<div class="banner warn"><span style="flex:1">This entry is awaiting officer verification. It is not searched or compared yet.</span>${can("verify") ? `<button class="btn sm ok" data-act="verifyRecord" data-id="${r.id}">Verify record</button>` : ""}</div>` : ""}
      ${r.status === "draft" ? `<div class="banner info"><span style="flex:1">This is a draft. It is not submitted yet.</span><button class="btn sm" data-act="continueDraft" data-id="${r.id}">Continue in Direct Entry</button></div>` : ""}
      <div class="facts">
        <div class="fact"><div class="k">Type</div><div class="v">${h(typeOf(r.type).label)}</div></div>
        <div class="fact"><div class="k">Date / time</div><div class="v">${h(fmtDate(r.date))}${r.time ? " · " + h(r.time) : ""}</div></div>
        <div class="fact"><div class="k">Location</div><div class="v">${h(r.location || "Not set")}</div></div>
        <div class="fact"><div class="k">Police station</div><div class="v">${h(r.station || HOME_STATION)}</div></div>
        <div class="fact"><div class="k">FIR number</div><div class="v">${r.fir ? `<span class="mono" data-notr>${h(r.fir)}</span>` : `<span class="muted">Not given</span>`}</div></div>
        <div class="fact"><div class="k">Progress</div><div class="v">${(() => { const it = caseItem(r.id); return it ? stageChip(it.stage) : ""; })()}</div></div>
      </div>
      ${r.status === "verified" ? `<section class="card"><div class="card-h"><h3>Connected cases</h3></div><div class="card-b">${connHTML(connOf(r.id), 6)}</div></section>` : ""}
      <section class="card card-b"><div class="lbl" style="margin-bottom:6px">Summary</div><p data-notr>${h(r.summary || "")}</p></section>
      ${(r.sections || []).length ? `<section class="card card-b"><div class="lbl" style="margin-bottom:6px">Sections of law</div><div class="law-chips">${r.sections.map(lawOf).filter(Boolean).map((l) => `<span class="law-chip"><span>${h(lawName(l))}</span> <b class="mono" data-notr>${h(lawRef(l))}</b></span>`).join("")}</div></section>` : ""}
      <section class="card"><div class="card-h"><h3>People</h3></div><div class="table-wrap"><table class="t"><thead><tr><th>Name</th><th>Role</th><th>Alias</th><th>Contact</th><th>ID proof</th><th>Address</th></tr></thead><tbody>${r.people.length ? r.people.map((p) => `<tr><td data-notr>${h(p.name)}</td><td><span class="chip plain">${h(p.role)}</span></td><td data-notr>${h(p.alias || "")}</td><td class="mono">${h(p.contact || "")}</td><td>${p.idMasked ? `<span class="small">${h(p.idType === "pan" ? "PAN" : "Aadhaar")}</span> <span class="mono small">${h(p.idMasked)}</span>` : ""}</td><td class="small" data-notr>${h(p.address || "")}</td></tr>`).join("") : `<tr><td colspan="6" class="muted">None recorded</td></tr>`}</tbody></table></div></section>
      <section class="card"><div class="card-h"><h3>Identifiers</h3></div><div class="table-wrap"><table class="t"><thead><tr><th>Type</th><th>Value</th><th>Context</th></tr></thead><tbody>${r.identifiers.length ? r.identifiers.map((x) => `<tr><td>${h(idKindLabel(x.kind))}</td><td class="mono">${h(x.value)}</td><td>${h(x.context || "")}</td></tr>`).join("") : `<tr><td colspan="3" class="muted">None recorded</td></tr>`}</tbody></table></div></section>
      <section class="card"><div class="card-h"><h3>Photos</h3><span class="muted small">${(r.photos || []).length}</span>
          <button class="btn sm" data-act="pickFile" data-for="rp-cam">${ICON.camera}Take photo</button><button class="btn sm" data-act="pickFile" data-for="rp-file">${ICON.upload}Add photo</button>
          <input id="rp-cam" type="file" accept="image/*" capture="environment" class="sr" data-bind="recPhoto" data-id="${r.id}" tabindex="-1" aria-hidden="true" /><input id="rp-file" type="file" accept="image/*" multiple class="sr" data-bind="recPhoto" data-id="${r.id}" tabindex="-1" aria-hidden="true" /></div>
        <div class="card-b">${(r.photos || []).length ? `<div class="photos">${r.photos.map((p, i) => `<figure class="ph">${MEDIA[p.id] ? `<img src="${MEDIA[p.id]}" alt="Photo ${i + 1}" data-act="viewMedia" data-id="${p.id}" />` : `<div class="ph-miss">Photo not available in this browser</div>`}<figcaption class="small"><span data-notr>${h(p.caption || "")}</span><span class="muted tiny" style="display:block">${h(userName(p.by))} · ${h(fmtDT(p.at))}</span></figcaption></figure>`).join("")}</div>` : `<p class="muted small">No photos yet.</p>`}</div></section>
      <section class="card"><div class="card-h"><h3>Signatures</h3></div><div class="card-b">${vSignatures(r)}</div></section>
      <section class="card"><div class="card-h"><h3>Source documents</h3><span class="muted small">${docs.length} file${docs.length === 1 ? "" : "s"}, originals preserved</span></div><div class="card-b">${docs.length ? `<div class="grid g3">${docs.map((d) => `<div class="stack" style="gap:6px"><img src="${docSrc(d)}" alt="${h(d.label || d.name)}" style="border-radius:6px;border:1px solid var(--line);cursor:zoom-in;aspect-ratio:4/3;object-fit:cover;object-position:top" data-act="viewImg" data-doc="${d.id}" data-src="0" /><b class="small">${h(d.label || d.name)}</b><span class="muted tiny">${h(d.engine || "")}</span></div>`).join("")}</div>` : `<p class="muted small">${r.source === "online" ? "Filed online by the citizen. ID proof: " + h(idTypeOf((r.idProof || {}).type).label) + " " + h((r.idProof || {}).masked || "") : "Direct entry. No paper source."}</p>`}</div></section>
      <section class="card"><div class="card-h"><h3>Suggested links</h3></div><div class="card-b stack" style="gap:8px">${links.length ? links.map((l) => { const other = l.a === id ? l.b : l.a; return `<div class="row"><span style="flex:1">${recLink(other)} · ${h((l.reasons || []).map((x) => KIND_TEXT[x.kind] + " " + x.value).join(", "))}</span>${linkChip(l)}<button class="btn sm" data-act="openLink" data-key="${l.key}">Why?</button></div>`; }).join("") : `<p class="muted small">${r.status === "verified" ? "No matching details with other verified records." : "Links are suggested only after verification."}</p>`}</div></section>
      <section class="card"><div class="card-h"><h3>Follow-up tasks</h3><button class="btn sm" data-act="openCase" data-id="${r.id}">Open case workspace</button></div><div class="card-b">${tasks.length ? tasks.map((t) => `<div class="row small" style="padding:4px 0"><span class="chip ${t.status === "done" ? "ok" : t.due < todayIST() ? "crit" : "warn"}">${t.status === "done" ? "Done" : t.due < todayIST() ? "Overdue" : "Pending"}</span><span style="flex:1" data-notr>${h(t.title)}</span><span class="muted">${t.assignee ? h(ownerName(t.assignee)) : "No owner"}</span></div>`).join("") : `<p class="muted small">No tasks.</p>`}</div></section>
      <section class="card card-b small stack" style="gap:4px"><div class="lbl">Record history</div>
        <span>Created by ${h(userName(r.createdBy))} · ${h(fmtDT(r.createdAt))}</span>
        ${r.submittedAt ? `<span>Submitted for verification · ${h(fmtDT(r.submittedAt))}</span>` : ""}
        ${r.verifiedAt ? `<span>Verified by ${h(userName(r.verifiedBy))} (${h(roleOf(r.verifiedBy))}) · ${h(fmtDT(r.verifiedAt))}</span>` : ""}
        <span class="muted tiny">Opening this record was written to the audit trail.</span>
      </section>
    </div></aside></div>`;
}

function vSignatures(r) {
  const sg = r.sign || {};
  const box = (label, m, sub) => `<div class="sigview"><div class="lbl">${label}</div>${m && MEDIA[m.id] ? `<div class="sigimg"><img src="${MEDIA[m.id]}" alt="${h(label)}" data-act="viewMedia" data-id="${m.id}" /></div>` : `<div class="sigimg empty">Image not available in this browser</div>`}<span class="tiny muted">${sub}</span></div>`;
  const items = [];
  if (sg.complainant) items.push(box("Complainant signature", sg.complainant, `<span data-notr>${h(sg.complainant.name || "")}</span> · ${h(fmtDT(sg.complainant.at))}`));
  if (sg.thumb) items.push(box("Thumb impression", sg.thumb, `<span data-notr>${h(sg.thumb.name || "")}</span> · ${h(sg.thumb.hand)} · ${h(fmtDT(sg.thumb.at))}`));
  if (sg.officer) items.push(box("Recording officer", sg.officer, `${h(userName(sg.officer.userId))} · ${h(fmtDT(sg.officer.at))}`));
  if (sg.verifier) items.push(box("Verifying officer", sg.verifier, `${h(userName(sg.verifier.userId))} · ${h(fmtDT(sg.verifier.at))}`));
  return items.length ? `<div class="sigs">${items.join("")}</div>` : `<p class="muted small">No electronic signatures stored for this record.</p>`;
}

/* ---------- Connections ---------- */
function layoutGraph(nodes, edges, W, H) {
  const n = nodes.length;
  nodes.forEach((nd, i) => { const a = (2 * Math.PI * i) / Math.max(1, n) - Math.PI / 2; nd.x = W / 2 + Math.cos(a) * W * 0.33; nd.y = H / 2 + Math.sin(a) * H * 0.3; });
  const idx = Object.fromEntries(nodes.map((nd, i) => [nd.id, i]));
  for (let it = 0; it < 320; it++) {
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const A = nodes[i], B = nodes[j];
      let dx = B.x - A.x, dy = (B.y - A.y) * 1.6; const d2 = Math.max(dx * dx + dy * dy, 400);
      const f = 26000 / d2; const d = Math.sqrt(d2);
      A.x -= (dx / d) * f; A.y -= (dy / d) * f * 0.6; B.x += (dx / d) * f; B.y += (dy / d) * f * 0.6;
    }
    edges.forEach((e) => {
      const A = nodes[idx[e.a]], B = nodes[idx[e.b]]; if (!A || !B) return;
      const dx = B.x - A.x, dy = B.y - A.y; const d = Math.max(1, Math.hypot(dx, dy)); const f = (d - 230) * 0.03;
      A.x += (dx / d) * f; A.y += (dy / d) * f; B.x -= (dx / d) * f; B.y -= (dy / d) * f;
    });
    nodes.forEach((nd) => { nd.x += (W / 2 - nd.x) * 0.01; nd.y += (H / 2 - nd.y) * 0.02; nd.x = Math.max(70, Math.min(W - 70, nd.x)); nd.y = Math.max(32, Math.min(H - 32, nd.y)); });
  }
}
function vGraph(sel) {
  const links = S.links.filter((l) => (l.reasons || []).length && (ui.showDismissed || l.status !== "dismissed" || l.key === sel));
  if (!links.length) return `<div class="empty">No suggested links yet. Verify records with shared identifiers to see them here.</div>`;
  const ids = uniq(links.flatMap((l) => [l.a, l.b]));
  const nodes = ids.map((id) => ({ id }));
  const W = 680, H = 360;
  layoutGraph(nodes, links, W, H);
  const P = Object.fromEntries(nodes.map((n) => [n.id, n]));
  let labels = "";
  const edges = links.map((l) => {
    const A = P[l.a], B = P[l.b]; const cls = l.status === "accepted" ? "acc" : l.status === "dismissed" ? "dis" : "sug";
    const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
    const lab = (l.reasons || []).map((r) => KIND_TEXT[r.kind]).filter((v, i, a) => a.indexOf(v) === i).join(" + ");
    if (l.key === sel) labels += `<text class="elabel" x="${mx}" y="${my + 4}" text-anchor="middle">${h(lab)}</text>`;
    return `<g><path class="edge ${cls} ${l.key === sel ? "sel" : ""}" d="M${A.x},${A.y} L${B.x},${B.y}"/><path class="hit" d="M${A.x},${A.y} L${B.x},${B.y}" data-act="openLink" data-key="${l.key}"><title>${h(l.a + " and " + l.b + ": " + lab)}</title></path></g>`;
  }).join("");
  const nds = nodes.map((nd) => {
    const r = getRec(nd.id); const c = typeColor(r ? r.type : ""); const soft = typeSoft(r ? r.type : "");
    const on = sel && sel.split("|").includes(nd.id);
    return `<g class="node" data-act="openRecord" data-id="${nd.id}" transform="translate(${nd.x - 62},${nd.y - 23})"><title>${h(nd.id)}: ${h(r ? r.title : "")}</title><rect width="124" height="46" rx="9" fill="${soft}" stroke="${c}" stroke-width="${on ? 3 : 1.5}"/><text x="10" y="19" style="fill:${c}">${h(nd.id)}</text><text class="sub" x="10" y="35">${h((r ? r.title || typeOf(r.type).label : "").slice(0, 20))}</text></g>`;
  }).join("");
  return `<svg class="graph" viewBox="0 0 ${W} ${H}" role="img" aria-label="Map of suggested links between records">${edges}${nds}${labels}</svg>`;
}
function vConnections() {
  const list = S.links.filter((l) => l.status === ui.linkTab && (l.reasons || []).length);
  const counts = { suggested: 0, accepted: 0, dismissed: 0 };
  S.links.forEach((l) => { if ((l.reasons || []).length) counts[l.status]++; });
  const sel = ui.linkKey && S.links.find((l) => l.key === ui.linkKey && (l.reasons || []).length) ? ui.linkKey : list[0] ? list[0].key : null;
  const L = sel ? S.links.find((l) => l.key === sel) : null;
  const verifiedN = S.records.filter((r) => r.status === "verified").length;
  const notN = S.records.filter((r) => r.status === "pending").length + S.docs.filter((d) => ["review", "submitted"].includes(d.status)).length;
  return `${intro()}
  <div class="banner dark"><b>No automated guilt determination</b><span>Every suggested connection needs source-record review by an authorised officer. A match is not proof of guilt.</span></div>
  <div class="split-l">
    <div class="stack">
      <div class="tabs" role="tablist">${[["suggested", "To review"], ["accepted", "Accepted"], ["dismissed", "Dismissed"]].map(([k, t]) => `<button role="tab" aria-selected="${ui.linkTab === k}" class="${ui.linkTab === k ? "on" : ""}" data-act="linkTab" data-id="${k}">${t} (${counts[k]})</button>`).join("")}</div>
      <div class="stack" style="gap:8px">${list.length ? list.map((l) => `<button class="lk ${l.key === sel ? "on" : ""}" data-act="openLink" data-key="${l.key}"><span class="pair">${h(l.a)} <span class="muted">and</span> ${h(l.b)}</span><span class="row" style="gap:6px">${(l.reasons || []).map((r) => `<span class="chip ${["name", "alias"].includes(r.kind) ? "warn" : "info"} plain">${h(KIND_TEXT[r.kind])}</span>`).join("")}</span><span class="muted tiny">${h(linkStrength(l))} · found ${h(ago(l.createdAt))}</span></button>`).join("") : `<div class="card empty">Nothing here.</div>`}</div>
      <div class="card card-b stack" style="gap:8px"><span class="small"><span>Compared ${verifiedN} verified records.</span>${notN ? ` <span>${notN} ${notN === 1 ? "item awaiting verification is" : "items awaiting verification are"} not compared.</span>` : ""}</span><button class="btn sm" data-act="rescan">${ICON.link}Run connection check again</button></div>
    </div>
    <div class="stack">
      <section class="card"><div class="card-h"><h2>Connection map</h2><label class="row small" style="gap:6px"><input type="checkbox" data-bind="showDismissed" ${ui.showDismissed ? "checked" : ""} style="accent-color:var(--accent)" />Show dismissed</label></div>
        <div class="card-b">${vGraph(sel)}<div class="row small muted" style="gap:14px;margin-top:6px"><span><svg width="26" height="6"><path d="M0 3H26" stroke="var(--info)" stroke-width="2.5" stroke-dasharray="6 5"/></svg> To review</span><span><svg width="26" height="6"><path d="M0 3H26" stroke="var(--ok)" stroke-width="2.5"/></svg> Accepted</span><span>Click a line to see why it appears.</span></div></div></section>
      ${L ? vLinkDetail(L) : ""}
    </div>
  </div>`;
}
function vLinkDetail(L) {
  const A = getRec(L.a), B = getRec(L.b);
  const groups = sharedGroups().filter((g) => g.recs.includes(L.a) && g.recs.includes(L.b));
  const chainIds = groups.length ? groups[0].recs : [L.a, L.b];
  const chain = chainIds.map((id) => { const r = getRec(id); return `<div class="cn" style="--k:${typeColor(r.type)};--k-soft:${typeSoft(r.type)}"><span class="mono">${h(id)}</span><b>${h(r.title || typeOf(r.type).label)}</b></div>`; }).join('<span class="cl"></span>');
  const srcBox = (r, side) => `<div class="src"><div class="r"><span>${recLink(r.id)}</span>${statusChip(r)}</div><span class="muted small">${h(typeOf(r.type).label)} · ${h(fmtDate(r.date))} · ${h(r.location)}</span>
    ${(L.reasons || []).map((x) => `<div class="small"><span class="lbl">Field:</span> <span>${h(x[side].field)}</span><br><span class="lbl">Value:</span> <span class="mono">${h(x.value)}</span><br><span class="lbl">Role in this record:</span> <b>${h(x[side].role)}</b></div>`).join('<hr class="sep">')}
    <span class="tiny muted">${r.source === "scan" ? "Source: digitised paper file" : r.source === "online" ? "Source: online complaint" : "Source: direct entry"}${(r.docIds || []).length ? ` · ${(r.docIds || []).length} original file(s)` : ""}</span></div>`;
  const decided = L.status !== "suggested";
  return `<section class="card">
    <div class="card-h"><h2>Why this link appears</h2>${linkChip(L)}</div>
    <div class="card-b stack">
      <div class="chain">${chain}</div>
      ${groups.length ? `<p class="small" style="text-align:center"><span>${h("The same recorded " + KIND_TEXT[groups[0].kind].toLowerCase())}</span> <span class="mono">${h(groups[0].value)}</span> <span>${h(`appears in ${groups[0].recs.slice(0, -1).join(", ")} and ${groups[0].recs.slice(-1)[0]}.`)}</span></p>` : ""}
      <div class="found">${(L.reasons || []).map((x) => `<span>Match: ${h(KIND_TEXT[x.kind])}</span> <span class="mono" style="text-transform:none;letter-spacing:0">${h(x.value)}</span>`).join("<i>·</i>")}</div>
      <div class="ticks">
        <div>${ICON.check}<span><b>${(L.reasons || []).length > 1 ? "Matching details:" : "Matching detail:"}</b> ${(L.reasons || []).map((x) => `<span>${h(KIND_TEXT[x.kind])}</span> <span class="mono">${h(x.value)}</span>`).join("; ")} ${linkStrength(L) === "Name match only" ? "<span>Same name can belong to different people.</span>" : ""}</span></div>
        <div>${ICON.check}<span>Source record and field are shown below for both records.</span></div>
        <div>${ICON.check}<span><b>Person roles stay distinct.</b> A witness in one record is not treated as a suspect in another.</span></div>
        <div>${ICON.check}<span><b>Officer decides:</b> accept, dismiss or add a note.</span></div>
      </div>
      <div class="why">${srcBox(A, "a")}${srcBox(B, "b")}</div>
      <div class="notproof">A match is not proof of guilt.</div>
      ${decided ? `<div class="banner ${L.status === "accepted" ? "accent" : "info"}">${h(`${L.status === "accepted" ? "Accepted" : "Dismissed"} by ${userName(L.reviewedBy)} · ${fmtDT(L.reviewedAt)}`)}</div>
        ${L.status !== "suggested" && !L.rating && L.reviewedBy === S.userId ? `<div class="row small"><span style="flex:1">Was the reason for this suggestion clear?</span><button class="btn sm" data-act="rate" data-key="${L.key}" data-v="clear">Yes, clear</button><button class="btn sm" data-act="rate" data-key="${L.key}" data-v="partly">Partly</button><button class="btn sm" data-act="rate" data-key="${L.key}" data-v="unclear">Not clear</button></div>` : L.rating ? `<span class="muted small"><span>Officer rating of the reason:</span> <span>${h({ clear: "Yes, clear", partly: "Partly clear", unclear: "Not clear" }[L.rating])}</span></span>` : ""}` : ""}
      <div class="row">
        ${can("reviewLink") ? `<button class="btn ok" data-act="decide" data-key="${L.key}" data-v="accepted" ${L.status === "accepted" ? "disabled" : ""}>${ICON.check}Accept link</button><button class="btn" data-act="decide" data-key="${L.key}" data-v="dismissed" ${L.status === "dismissed" ? "disabled" : ""}>Dismiss</button>${decided ? `<button class="btn ghost" data-act="decide" data-key="${L.key}" data-v="suggested">Move back to review</button>` : ""}` : `${lockBtn("Accept link")}${lockBtn("Dismiss")}<span class="muted small">Only an SI or SHO can accept or dismiss. You can add a note.</span>`}
      </div>
      <div class="stack" style="gap:8px">
        <div class="lbl">Notes</div>
        ${(L.notes || []).map((n) => `<div class="note" data-notr><div class="by">${h(userName(n.by))} · ${h(fmtDT(n.at))}</div>${h(n.text)}</div>`).join("") || `<span class="muted small">No notes yet.</span>`}
        <div class="row"><label class="sr" for="linkNote">Add a note</label><input id="linkNote" class="input" style="flex:1" placeholder="Add a note for other officers" /><button class="btn" data-act="annotate" data-key="${L.key}">Add note</button></div>
      </div>
    </div>
  </section>`;
}

/* ---------- Workspace ---------- */
const TL = {
  "Record created": ["Record created", "Administrative record opened"],
  "Record created from scan": ["Record created", "Created from a digitised paper file"],
  "Draft saved": ["Draft saved", "Entry saved as a draft"],
  "Submitted for verification": ["Submitted for verification", "Waiting for an officer"],
  "Document uploaded": ["Documents uploaded", "Original sources preserved"],
  "Document attached": ["Document attached", "Original source linked to this record"],
  "Record verified": ["Information reviewed", "Officer verification recorded"],
  "Link suggested": ["Possible link found", "Shown with its reason"],
  "Link accepted": ["Link accepted", "Officer decision recorded"],
  "Link dismissed": ["Link dismissed", "Officer decision recorded"],
  "Link note added": ["Note on a link", ""],
  "Officer update added": ["Officer update added", "Latest authorised note"],
  "Follow-up task created": ["Follow-up created", ""],
  "Follow-up task completed": ["Follow-up completed", ""],
  "Task owner set": ["Task owner set", ""],
  "Case status changed": ["Case status changed", ""],
};
function vWorkspace() {
  const cases = S.records.filter((r) => r.status !== "draft").sort((a, b) => {
    const la = Math.max(...S.audit.filter((x) => x.recordId === a.id).map((x) => +new Date(x.at)), 0);
    const lb = Math.max(...S.audit.filter((x) => x.recordId === b.id).map((x) => +new Date(x.at)), 0);
    return lb - la;
  });
  if (!getRec(ui.caseId)) ui.caseId = cases[0] ? cases[0].id : null;
  const r = getRec(ui.caseId);
  if (!r) return `${intro()}<div class="card empty">No cases yet.</div>`;
  const docs = (r.docIds || []).length;
  const vf = r.status === "verified" ? 1 + [r.type, r.date, r.time, r.location, r.summary].filter(Boolean).length + r.people.reduce((n, p) => n + 2 + (p.contact ? 1 : 0) + (p.alias ? 1 : 0), 0) + r.identifiers.length : 0;
  const links = S.links.filter((l) => (l.a === r.id || l.b === r.id) && (l.reasons || []).length && l.status !== "dismissed").length;
  const tasks = S.tasks.filter((t) => t.recordId === r.id);
  const open = tasks.filter((t) => t.status === "open");
  const evAll = S.audit.filter((a) => a.recordId === r.id && TL[a.action]);
  const hiddenN = ui.tlAll ? 0 : Math.max(0, evAll.length - 6);
  const ev = evAll.slice(hiddenN);
  const tl = (hiddenN ? `<button class="btn sm ghost" style="align-self:flex-start;margin-bottom:4px" data-act="tlAll">Show ${hiddenN} earlier event${hiddenN > 1 ? "s" : ""}</button>` : "") + ev.map((a) => { const m = TL[a.action]; return `<div class="tli done"><span class="o">${ICON.check}</span><div><b>${h(m[0])}</b><span>${h(a.action === "Officer update added" || !m[1] ? a.detail : m[1])} · ${h(userName(a.userId))} · ${h(fmtDT(a.at))}</span></div><span class="chip ok plain">Done</span></div>`; }).join("")
    + open.map((t) => `<div class="tli next"><span class="o">${ICON.clock}</span><div><b>Follow-up pending</b><span>${h(t.title)} · ${t.assignee ? "Owner: " + h(ownerName(t.assignee)) : '<b style="color:var(--warn)">No owner yet</b>'} · due ${h(fmtDate(t.due))}</span></div><span class="chip ${t.due < todayIST() ? "crit" : "warn"} plain">${t.due < todayIST() ? "Overdue" : "Next"}</span></div>`).join("");
  return `${intro()}
  <div class="split-l">
    <section class="card"><div class="card-h"><h3>Cases</h3><span class="muted small">${cases.length}</span></div>
      <div class="card-b caselist">${cases.map((c) => { const o = S.tasks.filter((t) => t.recordId === c.id && t.status === "open").length; return `<button class="cl-i ${c.id === r.id ? "on" : ""}" data-act="openCase" data-id="${c.id}"><span class="t"><span class="mono small" style="font-weight:600">${h(c.id)}</span>${c.status === "pending" ? '<span class="chip warn plain">Unverified</span>' : caseChip(c)}</span><span class="small">${h(c.title || typeOf(c.type).label)}</span>${o ? `<span class="tiny muted">${o} open task${o > 1 ? "s" : ""}</span>` : ""}</button>`; }).join("")}</div></section>
    <div class="grid g2" style="align-items:start">
      <div class="stack">
        <section class="card" style="overflow:hidden">
          <div class="card-dark ws-head"><span class="eyebrow">Case workspace</span>${caseChip(r)}</div>
          <div class="card-b stack">
            <div><h2><span class="mono">${h(r.id)}</span> / <span>${h(r.title || typeOf(r.type).label)}</span></h2><span class="muted small">${r.status === "verified" ? "Verified record snapshot" : "Not verified yet. Snapshot counts start after verification."}</span></div>
            <div class="tiles"><div class="tile"><div class="k">Source files</div><div class="v">${String(docs).padStart(2, "0")}</div></div><div class="tile"><div class="k">Verified fields</div><div class="v">${String(vf).padStart(2, "0")}</div></div><div class="tile"><div class="k">Potential links</div><div class="v">${String(links).padStart(2, "0")}</div></div><div class="tile"><div class="k">Pending tasks</div><div class="v">${String(open.length).padStart(2, "0")}</div></div></div>
            <div class="row"><button class="btn sm" data-act="openRecord" data-id="${r.id}">View full record</button>${links ? `<a class="btn sm" href="#connections" data-act="caseLinks" data-id="${r.id}">See links</a>` : ""}<span class="spacer"></span>
              ${can("caseStatus") ? `<label class="sr" for="cstat">Case status</label><select class="select" style="width:auto" id="cstat" data-bind="caseStatus" data-id="${r.id}">${["Active", "Under review", "Closed"].map((s) => `<option value="${s}" ${r.caseStatus === s ? "selected" : ""}>${s}</option>`).join("")}</select>` : ""}</div>
          </div>
        </section>
        <section class="card"><div class="card-h"><h3>Follow-up tasks</h3><span class="muted small">${open.length} open</span></div>
          <div class="card-b">${tasks.length ? tasks.map((t) => `<div class="task ${t.status === "done" ? "done" : ""}"><input type="checkbox" aria-label="Mark done: ${h(t.title)}" data-bind="taskDone" data-id="${t.id}" ${t.status === "done" ? "checked" : ""} ${t.status === "done" || !(can("assignTask") || t.assignee === S.userId) ? "disabled" : ""} /><div><b class="small" data-notr>${h(t.title)}</b><div class="tiny muted">${t.status === "done" ? `Done by ${h(userName(t.doneBy))} · ${h(fmtDT(t.doneAt))}` : `Due ${h(fmtDate(t.due))}${t.due < todayIST() ? ' · <b style="color:var(--crit)">overdue</b>' : ""}`}</div>${t.status === "open" ? escTaskBits(t) : ""}</div>
            <div>${t.status === "open" && can("assignTask") ? `<label class="sr" for="ow-${t.id}">Task owner</label><select class="select" id="ow-${t.id}" style="width:auto;padding:5px 8px;font-size:13px" data-bind="taskOwner" data-id="${t.id}"><option value="">No owner</option>${USERS.map((u) => `<option value="${u.id}" ${t.assignee === u.id ? "selected" : ""}>${h(u.name)}</option>`).join("")}${otherOwners().map((o) => `<option value="${h(o)}" ${t.assignee === o ? "selected" : ""}>${h(o.slice(6))}</option>`).join("")}<option value="__other">Other (type a name)</option></select>` : `<span class="small ${t.assignee ? "" : "muted"}">${t.assignee ? h(ownerName(t.assignee)) : "No owner"}</span>`}</div></div>`).join("") : `<p class="muted small">No tasks yet.</p>`}
            <form class="stack" data-form="task" style="gap:8px;border-top:1px solid var(--line);padding-top:12px;margin-top:6px">
              <div class="field"><label for="t-title">New follow-up</label><input id="t-title" class="input" placeholder="Next action, for example: Visit the spot and note nearby cameras" required /></div>
              <div class="sub2" style="align-items:end">
                <div class="field"><label for="t-owner">Responsible user</label><select id="t-owner" class="select" data-bind="ownerSel">${can("assignTask") ? USERS.map((u) => `<option value="${u.id}" ${u.id === S.userId ? "selected" : ""}>${h(u.name)}</option>`).join("") + otherOwners().map((o) => `<option value="${h(o)}">${h(o.slice(6))}</option>`).join("") + `<option value="__other">Other (type a name)</option>` : `<option value="${S.userId}">${h(me().name)} (you)</option>`}</select></div>
                <div class="field"><label for="t-due">Due date</label><input id="t-due" type="date" class="input" value="${h(addDays(todayIST(), 3))}" min="${todayIST()}" /></div>
                <div class="field w hidden" id="t-other-wrap"><label for="t-other">Name of the responsible person</label><input id="t-other" class="input" placeholder="for example ASI Ramesh, Traffic wing" /><span class="help">Use this for a person who is not in the user list.</span></div>
              </div>
              <button class="btn primary" type="submit" style="align-self:flex-start">${ICON.plus}Add task</button>
            </form>
          </div></section>
      </div>
      <div class="stack">
        ${vProgressCard(r.id)}
        <section class="card"><div class="card-h"><h3>Case activity timeline</h3></div><div class="card-b"><div class="tl">${tl || '<span class="muted small">No activity yet.</span>'}</div><p class="tiny muted" style="margin-top:8px;font-style:italic">Illustrative workflow status. Not a live police-system connection.</p></div></section>
        <section class="card"><div class="card-h"><h3>Officer update</h3></div>
          <div class="card-b stack">
            <div class="field"><label for="noteText">Add an update to this case</label><textarea id="noteText" class="textarea" style="min-height:90px" placeholder="What was done, who was contacted, what changed."></textarea></div>
            <div class="row"><button class="btn primary" data-act="addNote" data-id="${r.id}">Add update</button><span class="help">Saved with your name and the time.</span></div>
            ${S.notes.filter((n) => n.recordId === r.id).slice(-3).reverse().map((n) => `<div class="note" data-notr><div class="by">${h(userName(n.by))} · ${h(fmtDT(n.at))}</div>${h(n.text)}</div>`).join("")}
          </div></section>
      </div>
    </div>
  </div>`;
}
function escTaskBits(t) { return escInsHTML(t, "task:" + t.id); }
function otherOwners() { return uniq(S.tasks.map((t) => t.assignee).filter(isOther)); }
function addDays(iso, n) { const d = new Date(iso + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }

/* ---------- Audit ---------- */
function auditRows() {
  const q = ui.aQ.trim().toLowerCase();
  return S.audit.filter(auditVis).reverse().filter((a) => (ui.aUser === "all" || a.userId === ui.aUser) && (ui.aAction === "all" || a.action === ui.aAction) && (!q || (a.action + " " + a.detail + " " + a.recordId + " " + userName(a.userId)).toLowerCase().includes(q)));
}
function vAudit() {
  if (!can("viewAudit")) return `${intro()}<section class="card lock">${ICON.lock}<h2>Your role cannot open the audit trail</h2><p class="muted">${h(me().roleLabel)} accounts can enter and scan records. The audit trail is open to SI and SHO accounts. Switch the demo user in the sidebar to see it.</p></section>`;
  const actions = uniq(S.audit.filter(auditVis).map((a) => a.action)).sort();
  const rows = auditRows();
  return `${intro()}
  <section class="card">
    <div class="card-h"><h2>${rows.length} events</h2>
      <label class="sr" for="aQ">Filter text</label><input id="aQ" class="input" style="width:200px" placeholder="Filter text" data-bind="aQ" value="${h(ui.aQ)}" />
      <label class="sr" for="aUser">User</label><select id="aUser" class="select" style="width:auto" data-bind="aUser"><option value="all">All users</option>${USERS.concat([SYSTEM_USER]).map((u) => `<option value="${u.id}" ${ui.aUser === u.id ? "selected" : ""}>${h(u.name)}</option>`).join("")}</select>
      <label class="sr" for="aAction">Action</label><select id="aAction" class="select" style="width:auto" data-bind="aAction"><option value="all">All actions</option>${actions.map((x) => `<option value="${h(x)}" ${ui.aAction === x ? "selected" : ""}>${h(x)}</option>`).join("")}</select>
      <button class="btn" data-act="exportAudit">${ICON.dl}Export CSV</button>
    </div>
    <div class="table-wrap" id="auditTable">${vAuditTable(rows)}</div>
  </section>`;
}
function vAuditTable(rows) {
  return `<table class="t"><thead><tr><th>Time (IST)</th><th>User</th><th>Action</th><th>Record</th><th>Detail</th></tr></thead><tbody>${rows.slice(0, 300).map((a) => `<tr><td class="num small" style="white-space:nowrap">${h(fmtDT(a.at).replace(" IST", ""))}</td><td class="small"><b>${h(userName(a.userId))}</b><div class="muted tiny">${h(roleOf(a.userId))}</div></td><td class="small">${h(a.action)}</td><td>${a.recordId ? recLink(a.recordId) : ""}</td><td class="small" data-notr>${h(a.detail)}</td></tr>`).join("")}</tbody></table>${rows.length > 300 ? `<p class="muted small" style="padding:10px 12px">Showing the latest 300. Export to see all.</p>` : ""}`;
}

/* ---------- Metrics ---------- */
const pct = (v) => (v == null ? "No data" : Math.round(v * 100) + "%");
function vMetrics() {
  const m = metrics();
  const last = S.metrics.retrieval.slice(-12);
  const maxMs = Math.max(1, ...last.map((x) => x.ms));
  const scope = [
    ["10 to 20 fictional records", S.records.filter((r) => r.status !== "draft").length, (n) => (n >= 10 && n <= 20 ? "ok" : "warn"), (n) => n + " records"],
    ["03 sample documents", 3, () => "ok", () => "3 samples ready"],
    ["01 new direct entry", S.demo.entry ? 1 : 0, (n) => (n ? "ok" : "warn"), (n) => (n ? "Done in this demo" : "Not yet")],
    ["01 explainable link", S.demo.link ? 1 : 0, (n) => (n ? "ok" : "warn"), (n) => (n ? "Reviewed in this demo" : "Not yet")],
    ["01 follow-up task", S.demo.task ? 1 : 0, (n) => (n ? "ok" : "warn"), (n) => (n ? "Added in this demo" : "Not yet")],
  ];  return `${intro()}
  <div class="grid g4">
    <div class="card kpi stripe" style="--k:var(--info)"><span class="l">Retrieval time</span><span class="v">${m.retrievalAvg == null ? "–" : (m.retrievalAvg / 1000).toFixed(1) + " s"}</span><span class="s muted">Time to locate a target record. ${m.retrievalN} search${m.retrievalN === 1 ? "" : "es"} measured.</span>${m.retrievalN ? "" : `<a class="btn sm" href="#records">Try a search</a>`}</div>
    <div class="card kpi stripe" style="--k:var(--accent)"><span class="l">Entry completeness</span><span class="v">${pct(m.completeness)}</span><span class="s muted">Required fields completed across ${m.completenessN} direct entries. ${m.fullyComplete} fully complete.</span></div>
    <div class="card kpi stripe" style="--k:var(--violet)"><span class="l">Review usefulness</span><span class="v">${pct(m.usefulness)}</span><span class="s muted">Officer rating of how clear the link reasons were. ${m.usefulnessN} rated.</span></div>
    <div class="card kpi stripe" style="--k:var(--warn)"><span class="l">Task visibility</span><span class="v">${pct(m.taskVis)}</span><span class="s muted">${m.ownedTasks} of ${m.openTasks} open actions have an owner.</span></div>
  </div>
  <div class="grid g2" style="align-items:start">
    <section class="card"><div class="card-h"><h3>Recent search times</h3><span class="muted small">seconds, latest on the right</span></div><div class="card-b">${last.length ? `<div class="bars" aria-label="Bar chart of recent search times">${last.map((x) => `<div style="height:${Math.max(4, (x.ms / maxMs) * 100)}%" title="${(x.ms / 1000).toFixed(1)} s to open ${h(x.recordId)} for '${h(x.query)}'"></div>`).join("")}</div><div class="row tiny muted" style="margin-top:6px"><span style="flex:1">Longest ${(maxMs / 1000).toFixed(1)} s</span><span>Latest ${(last[last.length - 1].ms / 1000).toFixed(1)} s for "${h(last[last.length - 1].query)}"</span></div>` : `<div class="empty stack" style="align-items:center"><span>No searches measured yet.</span><span>Search for a name or number, then open a result.</span><a class="btn sm" href="#records">Try a search</a></div>`}</div></section>
    <section class="card"><div class="card-h"><h3>Buildathon demo scope</h3></div><div class="card-b checks">${scope.map(([t, n, c, txt]) => `<div class="ck ${c(n) === "ok" ? "good" : "warn"}"><span class="ic">${c(n) === "ok" ? "✓" : "!"}</span><span><b>${h(t)}</b></span><span class="small muted">${h(txt(n))}</span></div>`).join("")}</div></section>
  </div>
  <p class="help">Figures come from actions in this browser session: searches, entries, link reviews and tasks. They reset with the demo data.</p>`;
}

/* ---------- About ---------- */
function vAbout() {
  return `${intro()}
  <section class="card card-b stack">
    <div class="eyebrow">The challenge</div>
    <h2>The information exists. Finding and using it is the challenge.</h2>
    <div class="grid g4">${[["Manual file search", "Locating a detail in older files can require repeated physical browsing."], ["Fragmented information", "Names, identifiers, dates and locations may sit in different documents."], ["Repeated data entry", "New information needs a consistent structure to become searchable."], ["Limited progress visibility", "Updates and next actions can be difficult to track in one view."]].map((x) => `<div class="tile"><b>${x[0]}</b><p class="small muted" style="margin-top:4px">${x[1]}</p></div>`).join("")}</div>
    <div class="banner accent"><span><b>The opportunity:</b> connect new entries and legacy records in one officer-reviewed workflow. The platform complements authorised procedures and existing government systems. It does not replace them.</span></div>
  </section>
  <div class="grid g2" style="align-items:start">
    <section class="card"><div class="card-h"><h3>Trust guardrails</h3></div><div class="card-b ticks">${["Role-based access for authorised users", "Original source files retained with extracted data", "Officer verification before records become trusted", "Audit trail for access, edits and decisions"].map((t) => `<div>${ICON.check}<span>${t}</span></div>`).join("")}</div></section>
    <section class="card"><div class="card-h"><h3>How the pilot is measured</h3><a class="btn sm" href="#metrics">Open metrics</a></div><div class="card-b"><table class="t"><tbody>${[["Retrieval time", "Time to locate a target field"], ["Entry completeness", "Required fields completed"], ["Review usefulness", "Officer-rated clarity of matches"], ["Task visibility", "Pending actions with an owner"]].map((x) => `<tr><td><b>${x[0]}</b></td><td class="muted">${x[1]}</td></tr>`).join("")}</tbody></table></div></section>
  </div>
  <section class="card"><div class="card-h"><h3>Proposed architecture for the pilot</h3><span class="muted small">Choices can be adapted to approved environments</span></div><div class="card-b stack">
    <div class="arch">${[["Front end", "React / Next.js", "Officer workspace"], ["Backend", "Python FastAPI", "Rules, roles, workflow"], ["OCR + AI", "Tesseract / document AI", "+ approved language model"], ["Data layer", "PostgreSQL", "+ relationship indexing"], ["Security", "Roles · encryption", "Audit logging"]].map((a) => `<div class="a"><div class="k">${a[0]}</div><b>${a[1]}</b><span>${a[2]}</span></div>`).join("")}</div>
    <p class="help">This prototype runs in one web page: rule checks, OCR structuring and the connection engine run in the browser. Where the page runs inside Claude, AI review and vision OCR use Claude. Demo data, photos, signatures and thumb impressions stay in each viewer's browser.</p>
  </div></section>
  <div class="banner dark"><b>Prototype boundary</b><span>Fictional demo records only. No live CCTNS integration. Any future integration requires government approval.</span></div>
  <section class="card card-b row" style="gap:24px;align-items:flex-start">
    <div style="flex:1;min-width:240px"><div class="eyebrow">Team Smarties</div><p style="margin-top:6px"><b>Team leader:</b> Shaik Mohammad Umar Farooq</p><p><b>Members:</b> Sameer Ahmed · Mohammad Osman Ghori · Asif Ahmed</p><p class="muted small" style="margin-top:6px">Kalyan Karnataka Buildathon 2026</p></div>
    <div class="stack" style="gap:8px"><span class="lbl">Demo data</span><button class="btn danger" data-act="resetDemo">Reset demo data</button><span class="help">Restores all fictional demo records and complaints and clears your changes in this browser.</span></div>
  </section>`;
}

/* ---------- Overlays ---------- */
function overlays() {
  let o = "";
  if (ui.bell && isAdmin()) o += vBell();
  if (ui.drawer) o += vDrawer(ui.drawer);
  if (ui.viewer) o += `<div class="modal-scrim" data-act="closeViewer" data-self="1"><div class="modal wide" role="dialog" aria-modal="true" aria-label="Original document"><div class="modal-h"><h2>${h(ui.viewer.title)}</h2><button class="x" data-act="closeViewer" aria-label="Close">${ICON.x}</button></div><div class="modal-b" style="background:var(--surface-2)"><img src="${ui.viewer.src}" alt="${h(ui.viewer.title)}" style="margin:0 auto;border-radius:6px;box-shadow:var(--shadow)" /></div></div></div>`;
  if (ui.modal) o += `<div class="modal-scrim"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="m-t"><div class="modal-h"><h2 id="m-t">${h(ui.modal.title)}</h2><button class="x" data-act="closeModal" aria-label="Close">${ICON.x}</button></div><div class="modal-b">${typeof ui.modal.body === "function" ? ui.modal.body() : ui.modal.body}</div><div class="modal-f">${(ui.modal.actions || []).map((a) => `<button class="btn ${a.cls || ""}" data-act="${a.act}" ${a.data || ""} ${a.need && !ui[a.need] ? "disabled" : ""}>${h(a.label)}</button>`).join("")}</div></div></div>`;
  return o;
}
function renderToasts() {
  const el = $("#toasts");
  if (el) { el.innerHTML = ui.toasts.map((t) => `<div class="toast ${t.kind || ""}" role="status"><span>${h(trStr(t.msg))}</span>${t.go ? `<button class="ta" data-act="toastGo" data-id="${t.id}">${h(t.goLabel || "Open")}</button>` : ""}</div>`).join(""); trDOM(el); }
}
