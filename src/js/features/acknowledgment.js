/* ===== Printable acknowledgment for an online complaint ===== */
function ackSlipHTML(c) {
  const P = c.person, A = c.addr, N = c.incident, I = c.idp;
  const row = (k, v, notr) => `<tr><th>${k}</th><td ${notr ? "data-notr" : ""}>${v}</td></tr>`;
  const addr = [A.house, A.street, A.village, A.taluk + " taluk", A.district, A.state, A.pin].filter(Boolean).join(", ");
  const sug = lawSuggest(N.description, catOf(N.category).type, N.category).filter((l) => l.sec).slice(0, 3);
  return `<div class="slip">
    <div class="slip-h">${badgeSVG(64)}<div class="slip-t"><div class="slip-k">JanaRaksha AI · Kalaburagi</div><h1>Acknowledgment of online complaint</h1><div class="slip-s">Citizen copy</div></div>
      <div class="slip-no"><span>Complaint number</span><b class="mono">${h(c.id)}</b></div></div>
    <table class="slip-tb"><tbody>
      ${row("Submitted on", h(fmtDT(c.createdAt)))}
      ${row("Police station", h(c.station))}
      ${row("Status", h(C_STATUS[c.status][0]))}
    </tbody></table>
    <h2>Complainant</h2>
    <table class="slip-tb"><tbody>
      ${row("Name", h(P.name), 1)}
      ${P.father ? row("Father or husband", h(P.father), 1) : ""}
      ${row("Gender and age", `<span>${h(P.gender)}</span>, ${h(P.age)}`)}
      ${row("Mobile", `<span class="mono">+91 ${h(c.phone)}</span> <span>(OTP verified)</span>`)}
      ${row("Address", h(addr), 1)}
      ${row("ID proof", `<span>${h(idTypeOf(I.type).label)}</span> <span class="mono">${h(maskId(I.type, I.number))}</span>`)}
      ${c.filing.as === "other" ? row("Filing for", h(`${c.filing.otherName} (${c.filing.relation})`), 1) : ""}
    </tbody></table>
    <h2>Complaint</h2>
    <table class="slip-tb"><tbody>
      ${row("Type", h(catOf(N.category).label))}
      ${row("Date and time of incident", h(fmtDate(N.date) + (N.time ? ", " + N.time : "")))}
      ${row("Place of incident", h(N.place), 1)}
      ${N.involved ? row("Persons involved", h(N.involved), 1) : ""}
      ${N.property ? row("Property", h(N.property + (N.value ? " (Rs " + N.value + ")" : "")), 1) : ""}
      ${row("What happened", h(N.description), 1)}
      ${(N.photos || []).length ? row("Evidence", `${N.photos.length} photo(s)`) : ""}
      ${sug.length ? row("Sections that may apply", `${sug.map((l) => `<span>${h(lawName(l))}</span>: <span class="mono" data-notr>${h(lawSec(l))}</span>`).join("; ")}<div class="slip-note">For information only. The police officer decides the final sections.</div>`) : ""}
    </tbody></table>
    <div class="slip-box"><b>What happens next</b><ol><li>An officer at the police station checks your details and your ID.</li><li>You may get a call on your mobile number to confirm.</li><li>Use the complaint number to see the status under My complaints.</li></ol></div>
    <p class="slip-warn">This acknowledgment shows that your complaint was received online. It is not an FIR. The station gives a record number after an officer verifies and registers the complaint.</p>
    <div class="slip-f"><span>Printed on ${h(fmtDT(nowISO()))}</span><span>Prototype for Kalyan Karnataka Buildathon 2026. Fictional data only.</span></div>
  </div>`;
}
const ACK_CSS = `
.slip { font: 13px/1.45 "Public Sans", "Noto Sans Kannada", Arial, sans-serif; color: #1a1a1a; max-width: 760px; margin: 0 auto; padding: 22px 26px; border: 1.5px solid #4a0e19; border-radius: 6px; background: #fff; }
.slip-h { display: flex; gap: 14px; align-items: center; border-bottom: 2px solid #4a0e19; padding-bottom: 12px; margin-bottom: 12px; }
.slip-h svg { width: 64px; height: 64px; flex: none; }
.slip-t { flex: 1; } .slip-t h1 { font-size: 19px; margin: 2px 0; color: #4a0e19; }
.slip-k { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: #7a5a10; font-weight: 700; }
.slip-s { font-size: 11.5px; color: #555; }
.slip-no { text-align: right; border: 1.5px dashed #b08a2e; padding: 8px 10px; border-radius: 6px; }
.slip-no span { display: block; font-size: 10.5px; text-transform: uppercase; letter-spacing: .08em; color: #555; }
.slip-no b { font-size: 16px; font-family: "IBM Plex Mono", monospace; }
.slip h2 { font-size: 13.5px; margin: 14px 0 6px; color: #4a0e19; text-transform: uppercase; letter-spacing: .06em; }
.slip-tb { width: 100%; border-collapse: collapse; }
.slip-tb th, .slip-tb td { text-align: left; vertical-align: top; padding: 5px 8px; border: 1px solid #ddd; }
.slip-tb th { width: 34%; background: #f7f3ea; font-weight: 600; }
.slip .mono { font-family: "IBM Plex Mono", monospace; }
.slip-note { font-size: 11px; color: #666; margin-top: 3px; }
.slip-box { margin-top: 14px; padding: 10px 12px; background: #f7f3ea; border-left: 3px solid #b08a2e; }
.slip-box ol { margin: 6px 0 0 18px; padding: 0; }
.slip-warn { margin-top: 12px; font-weight: 600; color: #4a0e19; }
.slip-f { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-top: 14px; padding-top: 8px; border-top: 1px solid #ddd; font-size: 11px; color: #666; }
`;
function ackBuild(c) {
  const box = document.createElement("div");
  box.innerHTML = ackSlipHTML(c);
  trDOM(box);
  return box.innerHTML;
}
function ackPrint(id) {
  const c = getC(id); if (!c) return;
  let area = $("#print-area");
  if (!area) { area = document.createElement("div"); area.id = "print-area"; document.body.appendChild(area); }
  area.innerHTML = `<style>${ACK_CSS}</style>${ackBuild(c)}`;
  document.body.classList.add("printing-ack");
  const done = () => { document.body.classList.remove("printing-ack"); window.removeEventListener("afterprint", done); };
  window.addEventListener("afterprint", done);
  try { window.print(); } catch (e) { done(); toast("Printing is blocked here. Use Download acknowledgment instead.", "warn"); return; }
  setTimeout(done, 1500);
}
function ackDownload(id) {
  const c = getC(id); if (!c) return;
  const html = `<!DOCTYPE html><html lang="${isKn() ? "kn" : "en"}"><head><meta charset="utf-8"><title>Acknowledgment ${c.id}</title><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:20px;background:#f2efe8}${ACK_CSS}.pbtn{display:block;margin:0 auto 14px;padding:8px 16px;font:600 14px Arial;background:#c9a446;color:#3a0a12;border:0;border-radius:8px;cursor:pointer}@media print{body{margin:0;background:#fff}.pbtn{display:none}.slip{border:0}}</style></head><body><button class="pbtn" onclick="window.print()">Print</button>${ackBuild(c)}</body></html>`;
  offerDownload(`acknowledgment-${c.id}.html`, html, "text/html");
}
const AACT = {
  cPrintAck(el) { ackPrint(el.dataset.id); },
  cDownloadAck(el) { ackDownload(el.dataset.id); },
};
