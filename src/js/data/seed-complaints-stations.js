/* ===== More fictional complaints: 2 to 3 for every police station (demo data only) ===== */
const SEED_VER = 2;
const STATION_PLACE = {
  "Ashok Nagar Police Station": ["Ashok Nagar", "Kalaburagi", "585103"], "Brahmpur Police Station": ["Brahmpur", "Kalaburagi", "585103"], "Chowk Police Station": ["Chowk", "Kalaburagi", "585101"],
  "M B Nagar Police Station": ["M B Nagar", "Kalaburagi", "585105"], "Raghavendra Nagar Police Station": ["Raghavendra Nagar", "Kalaburagi", "585102"], "Roza Police Station": ["Roza", "Kalaburagi", "585104"],
  "Station Bazaar Police Station": ["Station Bazaar", "Kalaburagi", "585102"], "University Police Station": ["University road", "Kalaburagi", "585106"], "Women Police Station (City)": ["Jagat", "Kalaburagi", "585101"],
  "Mahagaon Police Station": ["Mahagaon", "Kalaburagi", "585316"], "Kamalapur Police Station": ["Kamalapur", "Kamalapur", "585313"], "Jewargi Police Station": ["Jewargi", "Jewargi", "585310"],
  "Nelogi Police Station": ["Nelogi", "Jewargi", "585310"], "Yedrami Police Station": ["Yedrami", "Yedrami", "585310"], "Women Police Station (District)": ["Shahabad road", "Kalaburagi", "585102"],
  "Aland Police Station": ["Aland", "Aland", "585302"], "Nimbarga Police Station": ["Nimbarga", "Aland", "585302"], "Madan Hipparga Police Station": ["Madan Hipparga", "Aland", "585302"],
  "Narona Police Station": ["Narona", "Aland", "585302"], "Afzalpur Police Station": ["Afzalpur", "Afzalpur", "585301"], "Revoor Police Station": ["Revoor", "Afzalpur", "585301"],
  "Devalgangapur Police Station": ["Devalgangapur", "Afzalpur", "585301"], "Shahabad Town Police Station": ["Shahabad", "Shahabad", "585228"], "Kalagi Police Station": ["Kalagi", "Kalagi", "585312"],
  "Madbool Police Station": ["Madbool", "Chittapur", "585211"], "Chittapur Police Station": ["Chittapur", "Chittapur", "585211"], "Wadi Police Station": ["Wadi", "Chittapur", "585225"],
  "Chincholi Police Station": ["Chincholi", "Chincholi", "585307"], "Kunchavaram Police Station": ["Kunchavaram", "Chincholi", "585307"], "Miriyan Police Station": ["Miriyan", "Chincholi", "585307"],
  "Sulepeth Police Station": ["Sulepeth", "Chincholi", "585307"], "Ratkal Police Station": ["Ratkal", "Kalagi", "585312"], "Sedam Police Station": ["Sedam", "Sedam", "585222"],
  "Malkhed Police Station": ["Malkhed", "Sedam", "585317"], "Kurkunta Police Station": ["Kurkunta", "Sedam", "585222"], "Mudhol Police Station": ["Mudhol", "Sedam", "585222"],
  "Cyber, Economic and Narcotics Crime (CEN) Police Station": ["Kalaburagi", "Kalaburagi", "585101"],
};

function moreComplaints() {
  let sd = 20261114;
  const rnd = () => { sd = (sd + 0x6d2b79f5) | 0; let t = Math.imul(sd ^ (sd >>> 15), 1 | sd); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const num = (a, b) => Math.floor(a + rnd() * (b - a + 1));
  const btw = (a, b) => a + rnd() * (b - a);
  const T = (d) => new Date(Date.now() - d * 864e5).toISOString();
  const dateAgo = (d) => new Date(Date.now() - d * 864e5).toISOString().slice(0, 10);
  const hhmm = () => `${String(num(6, 22)).padStart(2, "0")}:${pick(["00", "10", "15", "20", "30", "40", "45", "50"])}`;
  const money = (n) => n.toLocaleString("en-IN");
  const ph5 = () => String(num(10000, 99999));

  const MF = ["Ramesh", "Suresh", "Mahantesh", "Basavaraj", "Shivakumar", "Anand", "Nagaraj", "Irfan", "Sharanappa", "Mallappa", "Siddaram", "Santosh", "Vijaykumar", "Raju", "Gururaj", "Shankar", "Javeed", "Rafiq", "Imtiyaz", "Salim", "Ameer", "Chandrakant", "Sangamesh", "Bhimashankar", "Prabhu", "Ningappa", "Revansiddappa", "Yusuf", "Kashinath", "Dattatreya"];
  const FF = ["Savitri", "Shobha", "Anitha", "Rekha", "Kavitha", "Jyoti", "Shaheen", "Nazia", "Sunanda", "Parvati", "Bhagyashree", "Asma", "Laxmi", "Renuka", "Sharada", "Mahadevi", "Sunita", "Rukhsana", "Geeta", "Neelamma"];
  const SN = ["Patil", "Kulkarni", "Biradar", "Hiremath", "Jadhav", "Rathod", "Pujari", "Shaikh", "Inamdar", "Kamble", "Teli", "Naik", "Hosamani", "Mali", "Gouda", "Mulla", "Chavan", "Kumbar", "Sajjan", "Pawar", "Talwar", "Malipatil", "Bagwan", "Swamy", "Konda", "Wadi", "Bhosale", "Mirza", "Angadi", "Hadimani"];
  const OCC_M = ["Farmer", "Driver", "Shop keeper", "Mechanic", "Mason", "Teacher", "Daily wage worker", "Auto driver", "Electrician", "Tailor", "Clerk", "Student"];
  const OCC_F = ["Homemaker", "Teacher", "Tailor", "Nurse", "Anganwadi worker", "Student", "Shop keeper", "Farmer"];
  const used = new Set();
  const person = (g, sur) => { let n; do n = `${pick(g === "F" ? FF : MF)} ${sur || pick(SN)}`; while (used.has(n)); used.add(n); return n; };
  const officers = {};
  const officerOf = (st) => officers[st] || (officers[st] = `other:${/^Women/.test(st) ? "WPSI" : "PSI"} ${pick(/^Women/.test(st) ? FF : MF)} ${pick(SN)}`);
  let aad = 3000, imeiN = 4000, vehN = 1200;
  const AAD = () => { const b = "9999" + String(1000000 + aad++).slice(-7); return b + verhoeffDigit(b); };
  const PAN = (nm) => `${"ABCDEFGHJK"[num(0, 9)]}${"KLMNPQRS"[num(0, 7)]}${"ABCDE"[num(0, 4)]}P${nm[0].toUpperCase()}${num(1000, 9999)}${"ABCDEFGHJK"[num(0, 9)]}`;
  const veh = (kind) => `KA 00 ${pick(["AB", "CD", "EF", "GH", "JK", "LM", "MN", "PQ"])} ${vehN++}` + (kind ? "" : "");
  const imei = () => `35000000${String(imeiN++).padStart(7, "0")}`;
  const rels = [["son", "M"], ["daughter", "F"], ["brother", "M"], ["husband", "M"]];

  /* ---------- Incident templates: what happened, then what the police did at each stage ---------- */
  const TPL = {
    chain: (x) => ({ category: "theft", g: "F", place: `${x.town} bus stand`, desc: `While I was waiting for the bus at ${x.town} bus stand, two young men on a black motorcycle came close, pulled my gold chain and rode away fast.`, involved: "Two unknown men on a motorcycle", property: `Gold chain, about ${num(8, 20)} grams`, value: String(num(45, 120) * 1000),
      inv: "CCTV footage of the shops near the bus stand collected. Part of the motorcycle number is seen.", act: "Two suspects caught at a check post. The gold chain was recovered and seized.", res: "Gold chain returned to the complainant after the court order. Charge sheet filed.", next: ["Trace the motorcycle from the CCTV footage", "File the charge sheet"] }),
    breakin: (x) => { const cash = num(10, 60) * 1000; return { category: "theft", g: pick(["M", "F"]), place: `${x.town}, ${pick(["2nd cross", "3rd cross", "near the water tank", "behind the temple", "new layout"])}`, desc: `When we came back from a ${pick(["wedding", "village fair", "relative's house"])}, the lock of the main door was broken. Gold ornaments and Rs ${money(cash)} cash were missing from the cupboard.`, involved: "Not known", property: "Gold ornaments and cash", value: String(cash + num(60, 200) * 1000),
      inv: "Fingerprint team visited the house. Neighbours questioned. Dog squad used.", act: "A known house-breaking offender was arrested. Part of the ornaments was recovered.", res: "Recovered ornaments returned after the court order. Case closed with charge sheet.", next: ["Check the fingerprints with the records bureau", "Recover the rest of the ornaments"] }; },
    bike: (x) => { const v = veh(); return { category: "vehicle-theft", g: "M", place: `${x.town} ${pick(["market", "main road", "APMC yard", "hospital road"])}`, desc: `I parked my motorcycle ${v} at ${x.town} at about ${hhmm()} hrs and went to buy things. When I came back after one hour, the motorcycle was not there.`, involved: "Not known", property: `Motorcycle ${v}`, value: String(num(35, 90) * 1000),
      inv: `Vehicle details of ${v} sent to all stations and toll plazas. CCTV of the area checked.`, act: `Motorcycle ${v} found abandoned near the highway. Taken into police custody.`, res: "Motorcycle handed back to the owner after the court order. Case closed.", next: ["Check the recovered vehicle register", "Get the court order to return the vehicle"] }; },
    phone: (x) => { const i = imei(); return { category: "mobile-lost", g: pick(["M", "F"]), place: `${x.town} ${pick(["weekly market", "bus stand", "vegetable market"])}`, desc: `My mobile phone fell from my pocket in the crowd at the ${x.town} market. When I called, it was switched off. IMEI ${i}.`, involved: "", property: "Mobile phone", value: String(num(8, 25) * 1000),
      inv: `IMEI ${i} blocked through the CEIR portal. Request sent to trace the phone.`, act: "The phone became active in Solapur. The user was contacted.", res: "Phone recovered and returned to the owner.", next: ["Wait for the CEIR trace result", "Collect the phone from the user"] }; },
    upi: (x) => { const amt = num(4, 40) * 1000 + num(0, 9) * 100; const no = x.fraud || `+91 00000 ${ph5()}`; return { category: "cyber-fraud", g: pick(["M", "F"]), place: `At home, ${x.town}`, desc: `I got a message that my electricity connection would be cut tonight. I called ${no} and installed an app they told me to install. Rs ${money(amt)} was taken from my bank account in three transactions.`, involved: `Caller using ${no}`, property: "Money debited from bank account", value: String(amt),
      inv: `Bank asked to hold the money in the receiving account. Details of ${no} requested from the service provider.`, act: `Rs ${money(Math.round(amt * 0.6))} held by the bank. The account holder was identified in Jharkhand.`, res: "Held money returned to the complainant after the court order.", next: ["Send the notice to the bank", "Get the court order to release the held money"] }; },
    job: (x) => { const amt = num(1, 4) * 100000 + num(0, 9) * 10000; const acc = x.accused || `${pick(MF)} ${pick(SN)}`; const no = x.accPhone || `+91 00000 ${ph5()}`; return { category: "cheating", g: "M", place: `${x.town} bus stand`, desc: `${acc} took Rs ${money(amt)} from me for a government job and gave me a false order letter. Now his phone ${no} is switched off.`, involved: `${acc}, ${no}`, accused: [acc], property: "Cash paid for a job", value: String(amt),
      inv: `Statement recorded. The false order letter was seized. Bank details of ${acc} collected.`, act: `${acc} was arrested. He cheated two more persons in the same way.`, res: "Charge sheet filed in the court. Case closed at the station.", next: [`Find and arrest ${acc}`, "File the charge sheet"] }; },
    goats: (x) => { const n = num(3, 9); return { category: "theft", g: "M", place: `${x.town}, farm shed near the village`, desc: `${n} goats were taken from the shed behind my house at night. I heard a vehicle at about 2 am.`, involved: "Not known", property: `${n} goats`, value: String(n * num(7, 12) * 1000),
      inv: "Weekly animal markets of the taluk checked. Vehicle owners of the village questioned.", act: "Goats found with a trader at a weekly market. The seller was questioned and arrested.", res: "Goats returned to the owner. Case closed.", next: ["Check the next weekly animal market", "Return the goats after the court order"] }; },
    pump: (x) => ({ category: "theft", g: "M", place: `${x.town}, farm near the canal`, desc: "The submersible pump set and 60 metres of cable of my farm borewell were cut and taken at night.", involved: "Not known", property: "Pump set and cable", value: String(num(25, 60) * 1000),
      inv: "Scrap shops of the taluk checked. Two scrap dealers questioned.", act: "Cable recovered from a scrap shop. Two persons arrested.", res: "Recovered items returned to the farmer. Case closed.", next: ["Check the scrap shops again", "Return the items after the court order"] }),
    missing: (x) => { const [rel, g2] = pick(rels); const nm = `${pick(g2 === "F" ? FF : MF)} ${x.sur}`; const age = g2 === "F" ? num(19, 28) : num(18, 45); return { category: "missing", g: rel === "husband" ? "F" : pick(["M", "F"]), place: `${x.town} bus stand`, desc: `My ${rel} ${nm}, ${age} years, went to ${x.town} bus stand to go to work and did not come back home. The phone is switched off.`, involved: "Not known", other: nm,
      inv: "Photo shared with all stations and the railway police. Friends and the last call details checked.", act: `${nm} traced in Pune. A team has gone to bring ${g2 === "F" ? "her" : "him"} back.`, res: `${nm} found safe and handed over to the family.`, next: ["Check the last location of the phone", "Bring the person back and record the statement"] }; },
    threat: (x) => { const acc = x.accused || `${pick(MF)} ${pick(SN)}`; const amt = num(20, 80) * 1000; return { category: "harassment", g: pick(["M", "F"]), place: `${x.town}, ${pick(["2nd cross", "near the school", "main road"])}`, desc: `${acc}, who lives on my street, abuses me and says he will beat me when I ask him to pay back the Rs ${money(amt)} he borrowed.`, involved: acc, accused: [acc],
      inv: `Statements of the complainant and two neighbours recorded. ${acc} was called to the station.`, act: `${acc} was warned and a security case was opened against him.`, res: "Both parties settled the money matter. No further threats. Case closed.", next: [`Call ${acc} to the station`, "Watch for any more threats"] }; },
    accident: (x) => ({ category: "accident", g: "M", place: `${x.town} main road, near the bridge`, desc: `A tractor hit my son's motorcycle near the bridge at ${x.town} and the driver ran away. My son is in the government hospital with a leg injury.`, involved: "Tractor driver, not known",
      inv: "Spot visited and spot mahazar done. Medical report collected from the hospital.", act: "Tractor and driver traced in the next village. Driver arrested and tractor seized.", res: "Charge sheet filed against the driver. Case closed at the station.", next: ["Trace the tractor from the eyewitness statements", "File the charge sheet"] }),
    shop: (x) => { const cash = num(15, 70) * 1000; return { category: "theft", g: "M", place: `${x.town}, ${pick(["main road", "market area", "bus stand road"])}`, desc: `The shutter lock of my kirana shop was broken at night. Rs ${money(cash)} cash and goods were taken.`, involved: "Not known", property: "Cash and shop goods", value: String(cash + 12000),
      inv: "CCTV of nearby shops checked. Two persons seen at 3 am.", act: "Both persons arrested. Part of the cash recovered.", res: "Recovered cash returned after the court order. Charge sheet filed.", next: ["Identify the two persons in the CCTV footage", "File the charge sheet"] }; },
    dowry: (x) => { const acc = x.accused || `${pick(MF)} ${x.sur}`; return { category: "harassment", g: "F", place: `${x.town}, husband's house`, desc: `My husband ${acc} and his mother ask me to bring Rs 2 lakh from my parents. When I say no, they beat me and send me out of the house.`, involved: `${acc} and his mother`, accused: [acc],
      inv: "Statement of the complainant recorded. Medical examination done. Counselling given to both families.", act: `${acc} was arrested and produced before the court.`, res: "Charge sheet filed. The complainant now lives with her parents with protection.", next: ["Record the statements of the parents", "File the charge sheet"] }; },
    loanapp: (x) => ({ category: "cyber-fraud", g: pick(["M", "F"]), place: `At home, ${x.town}`, desc: "I took a small loan through a mobile app. Now they send changed photos of me to my contacts and ask for Rs 30,000 more.", involved: "Loan app operators", property: "Money demanded by a loan app", value: "30000",
      inv: "Screenshots and phone numbers collected. Request sent to remove the app and the numbers.", act: "Two numbers used by the app blocked. The app removed from the store.", res: "No more messages. Case closed after the report to the court.", next: ["Get the details of the app operators", "Send the report to the court"] }),
    land: (x) => ({ category: "property", g: "M", place: `${x.town}, survey number ${num(40, 300)}`, desc: "My cousin closed the cart road to my field with stones and does not allow my bullock cart to go.", involved: "Cousin",
      inv: "Both parties called to the station for talks.", act: "Talks held in front of village elders.", res: "Cart road opened after the talks.", next: ["Call both parties for talks"] }),
  };
  const SET = { city: ["chain", "breakin", "bike", "upi", "shop", "threat", "accident", "phone"], rural: ["breakin", "bike", "goats", "pump", "missing", "accident", "job", "threat", "land"], women: ["dowry", "threat", "missing"], cen: ["upi", "loanapp", "job"] };
  const PLAN = [["resolved", "investigation"], ["action", "filed"], ["investigation", "verified", "resolved"], ["filed", "action"], ["resolved", "investigation", "review"], ["verified", "action"], ["investigation", "resolved", "filed"]];
  const SPECIAL = {
    "Mahagaon Police Station": ["old"], "Revoor Police Station": ["old"], "Kunchavaram Police Station": ["old"],
    "Yedrami Police Station": ["noprogress"], "Madbool Police Station": ["noprogress"],
    "Narona Police Station": ["soon"], "Miriyan Police Station": ["soon"],
    "Nelogi Police Station": ["info"], "Wadi Police Station": ["rejected"],
    "University Police Station": ["soon", "filed"],
  };
  const FORCE = {
    "Chowk Police Station": { tpl: "chain", accused: "Ravi Jadhav", desc: "While I was going to the vegetable market, a young man pulled my gold chain near the clock tower and ran. The fruit seller said he is Ravi Jadhav, also called Kalia." },
    "Cyber, Economic and Narcotics Crime (CEN) Police Station": { tpl: "upi", fraud: "+91 00000 55821" },
    "Kalagi Police Station": { tpl: "job", accused: "Mahesh Gaikwad", accPhone: "+91 00000 64410" },
    "Afzalpur Police Station": { tpl: "upi", fraud: "+91 00000 55821" },
  };

  const out = [];
  ALL_STATIONS.forEach((st, s) => {
    const [town, taluk, pin] = STATION_PLACE[st] || [st.replace(/ Police Station.*$/, ""), "Kalaburagi", "585101"];
    const kind = st === "Cyber, Economic and Narcotics Crime (CEN) Police Station" ? "cen" : /^Women/.test(st) ? "women" : STATIONS[0].list.includes(st) ? "city" : "rural";
    let stages = (SPECIAL[st] && st === "University Police Station") ? SPECIAL[st] : PLAN[s % PLAN.length].slice();
    if (SPECIAL[st] && st !== "University Police Station") stages[0] = SPECIAL[st][0];
    const off = officerOf(st);
    const tplList = SET[kind].slice();
    stages.forEach((stage, k) => {
      const force = k === 0 ? FORCE[st] : null;
      let tname = force ? force.tpl : stage === "rejected" ? "land" : tplList[(s + k * 3) % tplList.length];
      if (tname === "land" && stage !== "rejected") tname = "breakin";
      const sur = pick(SN);
      const x = { town, sur, fraud: force && force.fraud, accused: force && force.accused, accPhone: force && force.accPhone };
      const I = TPL[tname](x);
      if (force && force.desc) { I.desc = force.desc; I.involved = `${force.accused} (Kalia)`; I.accused = [force.accused]; I.property = "Gold chain, about 10 grams"; }
      const name = person(I.g === "F" ? "F" : "M", ["missing", "dowry"].includes(tname) ? sur : "");
      const fam = name.split(" ").slice(-1)[0];
      /* Dates for each stage */
      const created = { filed: btw(0.3, 3), review: btw(1, 3.5), soon: btw(5.1, 5.8), old: btw(9, 12), info: btw(3, 5), verified: btw(2, 6), investigation: btw(8, 28), noprogress: btw(26, 32), action: btw(15, 45), resolved: btw(30, 85), rejected: btw(10, 20) }[stage];
      const vAt = created - btw(0.3, 1);
      const reg = ["verified", "investigation", "noprogress", "action", "resolved"].includes(stage);
      const track = [];
      const pr = (d, st2, text, next) => track.push({ at: T(d), by: off, kind: "progress", stage: st2, text, next: next || "", officer: off });
      if (stage === "investigation") pr(btw(1, Math.min(9, vAt - 0.5)), "investigation", I.inv, I.next[0]);
      if (stage === "noprogress") pr(btw(18, 22), "investigation", I.inv, I.next[0]);
      if (stage === "action") { const a = btw(1, 8); pr(btw(a + 2, vAt - 0.5), "investigation", I.inv, I.next[0]); pr(a, "action", I.act, I.next[1] || ""); }
      if (stage === "resolved") { const r = btw(2, 20); const a = btw(r + 2, Math.max(r + 3, vAt - 4)); pr(btw(a + 1, vAt - 0.5), "investigation", I.inv, I.next[0]); pr(a, "action", I.act, I.next[1] || ""); pr(r, "resolved", I.res); }
      const hist = [{ at: T(created), by: "citizen", kind: "submitted", text: "Complaint submitted online" }];
      if (stage !== "filed" && stage !== "soon" && stage !== "old") hist.push({ at: T(created - 0.4), by: off, kind: "opened", text: "Verification started" });
      if (reg) hist.push({ at: T(vAt), by: off, kind: "verified", text: "Verified and registered" });
      const status = { filed: "submitted", soon: "submitted", old: "submitted", review: "review", info: "info", rejected: "rejected" }[stage] || "verified";
      const st2 = stage === "noprogress" ? "investigation" : stage;
      const noFir = ["mobile-lost", "property"].includes(I.category);
      const g = I.g === "F" ? "Female" : "Male";
      const occ = pick(g === "Female" ? OCC_F : OCC_M);
      const idType = pick(["aadhaar", "aadhaar", "aadhaar", "pan", "voter"]);
      const idNum = idType === "aadhaar" ? AAD() : idType === "pan" ? PAN(fam) : `KAB${num(1000000, 9999999)}`;
      const c = {
        id: "", createdAt: T(created), updatedAt: T(Math.min(created, track.length ? Math.min(...track.map((e) => (Date.now() - Date.parse(e.at)) / 864e5)) : created)), phone: String(9000000200 + out.length),
        status, station: st, assignedTo: status === "submitted" ? "" : off, filing: { as: "self", otherName: "", relation: "" },
        adminUnread: status === "submitted", citizenUnread: false, vcheck: reg ? { identity: true, phone: true, address: true, details: true, station: true } : status === "review" || status === "info" ? { identity: true } : {}, messages: [], track,
        person: { name, father: `${pick(MF)} ${fam}`, gender: g, age: String(num(22, 68)), email: "", occupation: occ, altPhone: "" },
        idp: { type: idType, number: idNum, nameOnId: name },
        addr: { house: `${num(1, 9)}-${num(10, 240)}`, street: pick(["Main road", "2nd cross", "Near the temple", "School road", "New layout"]), village: town, taluk, district: "Kalaburagi", state: "Karnataka", pin },
        incident: { category: I.category, date: dateAgo(created + btw(0.2, 1.5)), time: hhmm(), place: I.place, description: I.desc, involved: I.involved || "", property: I.property || "", value: I.value || "", witnesses: "", photos: [], accused: I.accused || [] },
        history: hist,
      };
      if (reg) Object.assign(c, { verifiedBy: off, verifiedAt: T(vAt), officer: off, stage: st2 === "verified" ? "verified" : st2, _fir: !noFir });
      if (stage === "review") c.officer = off;
      if (stage === "info") { c.messages.push({ at: T(created - 1), from: "police", by: off, text: "Please send a clear photo of your ID card and the exact place of the incident." }); hist.push({ at: T(created - 1), by: off, kind: "info", text: "More information requested" }); c.citizenUnread = true; }
      if (stage === "rejected") { c.closedBy = off; c.closeReason = "Civil matter about a cart road. Both parties were advised to settle it before the village elders or go to the civil court."; hist.push({ at: T(created - 2), by: off, kind: "rejected", text: "Not accepted: civil matter" }); }
      out.push(c);
    });
  });
  /* A few remarks from the Commissioner */
  out.filter((c) => c.stage === "action").slice(0, 3).forEach((c, i) => c.track.push({ at: T(0.5 + i), by: "u-cp", kind: "remark", text: ["Good work. Finish the charge sheet this week.", "Inform the complainant about the next step.", "Check if the same persons are in other cases of the district."][i] }));
  /* Codes in date order: CMP/2026/1101 onward; FIR numbers per station */
  out.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const firN = {};
  out.forEach((c, i) => {
    c.id = `CMP/${todayIST().slice(0, 4)}/${1101 + i}`;
    if (c._fir) { const si = ALL_STATIONS.indexOf(c.station); firN[c.station] = (firN[c.station] || 150 + si * 3) + 1; c.fir = `${String(firN[c.station]).padStart(4, "0")}/${todayIST().slice(0, 4)}`; }
    if (c.status === "verified") c.recordId = c.id;
    c.updatedAt = c.history.map((x) => x.at).concat(c.track.map((x) => x.at)).concat(c.messages.map((x) => x.at)).sort().slice(-1)[0];
    delete c._fir;
  });
  return out;
}
