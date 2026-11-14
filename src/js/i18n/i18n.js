/* ===== Kannada interface text ===== */
/* Records, names, places and audit details stay in the language they were written in. Only the interface is translated. */
let KN = {};
let KN_PAT = [];
function trWord(w) { const k = String(w).trim(); return KN[k] != null ? KN[k] : trStr(w); }
function trStr(s) {
  if (!S || S.lang !== "kn" || s == null) return s;
  const str = String(s);
  const core = str.trim();
  if (!core) return str;
  let out = KN[core];
  if (out == null && core.includes(" · ")) {
    const parts = core.split(" · ");
    const tr = parts.map((x) => trStr(x));
    if (tr.some((x, i) => x !== parts[i])) out = tr.join(" · ");
  }
  if (out == null) {
    for (const [re, rep] of KN_PAT) {
      const m = core.match(re);
      if (m) { out = typeof rep === "function" ? rep(m) : rep.replace(/\$(\d)/g, (_, i) => trWord(m[+i] || "")); break; }
    }
  }
  if (out == null) return str;
  return str.replace(core, out);
}
function trDOM(root) {
  if (!S || S.lang !== "kn" || !root) return;
  const skip = "textarea,script,style,[data-notr],.mono";
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => { const p = n.parentElement; if (!p || p.closest(skip)) return NodeFilter.FILTER_REJECT; return /[A-Za-z]/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; },
  });
  const nodes = [];
  while (tw.nextNode()) nodes.push(tw.currentNode);
  nodes.forEach((n) => { const v = trStr(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; });
  const els = root.querySelectorAll ? root.querySelectorAll("[placeholder],[title],[aria-label],[alt]") : [];
  (root.querySelectorAll ? root.querySelectorAll("optgroup[label]") : []).forEach((el) => { const v = el.getAttribute("label"); const t = trStr(v); if (t !== v) el.setAttribute("label", t); });
  els.forEach((el) => {
    if (el.closest("[data-notr]")) return;
    ["placeholder", "title", "aria-label", "alt"].forEach((a) => { const v = el.getAttribute(a); if (v && /[A-Za-z]/.test(v)) { const t = trStr(v); if (t !== v) el.setAttribute(a, t); } });
  });
}
