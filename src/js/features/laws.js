/* ===== Common offences and the law sections that apply (reference list for officers and citizens) =====
   BNS = Bharatiya Nyaya Sanhita, 2023 (in force from 1 July 2024). "Old IPC" is shown for offences before that date. */
const LAW_GROUPS = [
  { id: "body", en: "Offences against the body", kn: "ದೇಹದ ವಿರುದ್ಧದ ಅಪರಾಧಗಳು" },
  { id: "women", en: "Offences against women and children", kn: "ಮಹಿಳೆಯರು ಮತ್ತು ಮಕ್ಕಳ ವಿರುದ್ಧದ ಅಪರಾಧಗಳು" },
  { id: "property", en: "Offences against property", kn: "ಆಸ್ತಿಯ ವಿರುದ್ಧದ ಅಪರಾಧಗಳು" },
  { id: "cyber", en: "Cyber and online offences", kn: "ಸೈಬರ್ ಮತ್ತು ಆನ್‌ಲೈನ್ ಅಪರಾಧಗಳು" },
  { id: "order", en: "Threats, insult and public order", kn: "ಬೆದರಿಕೆ, ಅವಮಾನ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಶಾಂತಿ" },
  { id: "road", en: "Road, drugs and weapons", kn: "ರಸ್ತೆ, ಮಾದಕ ವಸ್ತು ಮತ್ತು ಆಯುಧಗಳು" },
  { id: "report", en: "Reports that are not offences by themselves", kn: "ಸ್ವತಃ ಅಪರಾಧವಲ್ಲದ ವರದಿಗಳು" },
];
const LAWS = [
  // body
  { id: "murder", g: "body", en: "Murder", kn: "ಕೊಲೆ", law: "BNS", sec: "103(1)", old: "IPC 302", kw: ["murder", "killed", "dead body"] },
  { id: "attempt", g: "body", en: "Attempt to murder", kn: "ಕೊಲೆ ಯತ್ನ", law: "BNS", sec: "109", old: "IPC 307", kw: ["attempt to kill", "tried to kill", "attempt to murder"] },
  { id: "culpable", g: "body", en: "Culpable homicide not amounting to murder", kn: "ಕೊಲೆಯಲ್ಲದ ನರಹತ್ಯೆ", law: "BNS", sec: "105", old: "IPC 304", kw: ["homicide"] },
  { id: "negdeath", g: "body", en: "Death by negligence", kn: "ನಿರ್ಲಕ್ಷ್ಯದಿಂದ ಸಾವು", law: "BNS", sec: "106(1)", old: "IPC 304A", kw: ["died", "death", "negligence"], types: ["accident"] },
  { id: "suicide", g: "body", en: "Abetment of suicide", kn: "ಆತ್ಮಹತ್ಯೆಗೆ ಪ್ರಚೋದನೆ", law: "BNS", sec: "108", old: "IPC 306", kw: ["suicide"] },
  { id: "hurt", g: "body", en: "Voluntarily causing hurt", kn: "ಸ್ವಇಚ್ಛೆಯಿಂದ ಗಾಯ ಉಂಟುಮಾಡುವುದು", law: "BNS", sec: "115(2)", old: "IPC 323", kw: ["beat", "beaten", "hit me", "slapped", "assault", "attacked", "injured", "punched"], cats: ["harassment"] },
  { id: "grievous", g: "body", en: "Grievous hurt", kn: "ತೀವ್ರ ಗಾಯ", law: "BNS", sec: "117(2)", old: "IPC 325", kw: ["fracture", "broken bone", "grievous"] },
  { id: "weapon", g: "body", en: "Hurt with a dangerous weapon", kn: "ಅಪಾಯಕಾರಿ ಆಯುಧದಿಂದ ಗಾಯ", law: "BNS", sec: "118(1)", old: "IPC 324", kw: ["knife", "rod", "sickle", "weapon", "stabbed"] },
  { id: "acid", g: "body", en: "Acid attack", kn: "ಆಸಿಡ್ ದಾಳಿ", law: "BNS", sec: "124(1)", old: "IPC 326A", kw: ["acid"] },
  { id: "rashhurt", g: "body", en: "Hurt by a rash or negligent act", kn: "ಅಜಾಗರೂಕ ಕೃತ್ಯದಿಂದ ಗಾಯ", law: "BNS", sec: "125(a)", old: "IPC 337", kw: ["injured in accident"], types: ["accident"], cats: ["accident"] },
  { id: "restraint", g: "body", en: "Wrongful restraint", kn: "ಅಕ್ರಮ ತಡೆ", law: "BNS", sec: "126(2)", old: "IPC 341", kw: ["stopped me", "blocked the way", "blocked my way"] },
  { id: "confine", g: "body", en: "Wrongful confinement", kn: "ಅಕ್ರಮ ಬಂಧನ", law: "BNS", sec: "127(2)", old: "IPC 342", kw: ["locked", "confined", "kept inside"] },
  { id: "kidnap", g: "body", en: "Kidnapping", kn: "ಅಪಹರಣ", law: "BNS", sec: "137(2)", old: "IPC 363", kw: ["kidnap", "abduct", "taken away"], types: ["missing-person"], cats: ["missing"] },
  { id: "rash", g: "body", en: "Rash driving on a public road", kn: "ಸಾರ್ವಜನಿಕ ರಸ್ತೆಯಲ್ಲಿ ಅಜಾಗರೂಕ ಚಾಲನೆ", law: "BNS", sec: "281", old: "IPC 279", kw: ["rash", "overspeed", "speeding", "collided", "hit by"], types: ["accident"], cats: ["accident"] },
  // women and children
  { id: "rape", g: "women", en: "Rape", kn: "ಅತ್ಯಾಚಾರ", law: "BNS", sec: "64", old: "IPC 376", kw: ["rape", "raped"] },
  { id: "gangrape", g: "women", en: "Gang rape", kn: "ಸಾಮೂಹಿಕ ಅತ್ಯಾಚಾರ", law: "BNS", sec: "70(1)", old: "IPC 376D", kw: ["gang rape"] },
  { id: "deceit", g: "women", en: "Sexual intercourse by deceit or false promise to marry", kn: "ಮೋಸ ಅಥವಾ ಮದುವೆಯ ಸುಳ್ಳು ಭರವಸೆಯಿಂದ ಲೈಂಗಿಕ ಸಂಪರ್ಕ", law: "BNS", sec: "69", old: "New in BNS", kw: ["promise to marry", "false promise"] },
  { id: "modesty", g: "women", en: "Assault on a woman to outrage her modesty", kn: "ಮಹಿಳೆಯ ಮಾನಭಂಗದ ಉದ್ದೇಶದಿಂದ ಹಲ್ಲೆ", law: "BNS", sec: "74", old: "IPC 354", kw: ["molest", "touched her", "pulled her"], cats: ["harassment"] },
  { id: "harass", g: "women", en: "Sexual harassment", kn: "ಲೈಂಗಿಕ ಕಿರುಕುಳ", law: "BNS", sec: "75", old: "IPC 354A", kw: ["sexual harassment", "sexual remarks", "harass"], cats: ["harassment"] },
  { id: "voyeur", g: "women", en: "Voyeurism (secret watching or filming)", kn: "ಗುಪ್ತವಾಗಿ ವೀಕ್ಷಣೆ ಅಥವಾ ಚಿತ್ರೀಕರಣ", law: "BNS", sec: "77", old: "IPC 354C", kw: ["secretly filmed", "hidden camera", "recorded her"] },
  { id: "stalking", g: "women", en: "Stalking", kn: "ಹಿಂಬಾಲಿಸುವುದು", law: "BNS", sec: "78", old: "IPC 354D", kw: ["follow", "following me", "stalk", "keeps calling", "repeated messages"], cats: ["harassment"] },
  { id: "insultw", g: "women", en: "Words or gestures to insult a woman's modesty", kn: "ಮಹಿಳೆಯ ಮಾನಕ್ಕೆ ಅವಮಾನಿಸುವ ಮಾತು ಅಥವಾ ಸನ್ನೆ", law: "BNS", sec: "79", old: "IPC 509", kw: ["eve teasing", "vulgar comments", "whistled", "obscene gesture"], cats: ["harassment"] },
  { id: "dowrydeath", g: "women", en: "Dowry death", kn: "ವರದಕ್ಷಿಣೆ ಸಾವು", law: "BNS", sec: "80", old: "IPC 304B", kw: ["dowry death"] },
  { id: "cruelty", g: "women", en: "Cruelty by husband or his relatives", kn: "ಪತಿ ಅಥವಾ ಅವರ ಸಂಬಂಧಿಕರಿಂದ ಕ್ರೌರ್ಯ", law: "BNS", sec: "85", old: "IPC 498A", kw: ["husband", "in-laws", "in laws", "mother-in-law", "domestic"] },
  { id: "dowry", g: "women", en: "Giving, taking or demanding dowry", kn: "ವರದಕ್ಷಿಣೆ ಕೊಡುವುದು, ಪಡೆಯುವುದು ಅಥವಾ ಕೇಳುವುದು", law: "Dowry Prohibition Act, 1961", sec: "Sec 3, 4", old: "", kw: ["dowry"] },
  { id: "pocso", g: "women", en: "Sexual offence against a child (under 18)", kn: "18 ವರ್ಷದೊಳಗಿನ ಮಗುವಿನ ಮೇಲೆ ಲೈಂಗಿಕ ಅಪರಾಧ", law: "POCSO Act, 2012", sec: "Sec 4, 8, 12", old: "", kw: ["minor girl", "minor boy", "child abuse", "pocso"] },
  { id: "dv", g: "women", en: "Domestic violence: protection order", kn: "ಕೌಟುಂಬಿಕ ಹಿಂಸೆ: ರಕ್ಷಣಾ ಆದೇಶ", law: "Domestic Violence Act, 2005", sec: "Sec 31 (breach of order)", old: "", kw: ["protection order"] },
  // property
  { id: "theft", g: "property", en: "Theft", kn: "ಕಳ್ಳತನ", law: "BNS", sec: "303(2)", old: "IPC 379", kw: ["stole", "stolen", "theft", "taken away my", "missing from"], types: ["theft", "vehicle-theft"], cats: ["theft", "vehicle-theft"] },
  { id: "snatch", g: "property", en: "Snatching (chain, phone, bag)", kn: "ಕಸಿದುಕೊಳ್ಳುವುದು (ಸರ, ಫೋನ್, ಚೀಲ)", law: "BNS", sec: "304", old: "New in BNS", kw: ["snatch", "pulled the phone", "pulled the chain", "grabbed"] },
  { id: "housetheft", g: "property", en: "Theft in a house or building", kn: "ಮನೆ ಅಥವಾ ಕಟ್ಟಡದಲ್ಲಿ ಕಳ್ಳತನ", law: "BNS", sec: "305", old: "IPC 380", kw: ["from the house", "from my house", "from the shop", "almirah"] },
  { id: "burglary", g: "property", en: "House-breaking (burglary)", kn: "ಮನೆ ಒಡೆದು ಕಳ್ಳತನ", law: "BNS", sec: "331", old: "IPC 454, 457", kw: ["lock broken", "broke into", "break-in", "burglary", "shutter"] },
  { id: "trespass", g: "property", en: "Criminal trespass", kn: "ಅಕ್ರಮ ಪ್ರವೇಶ", law: "BNS", sec: "329(3)", old: "IPC 447", kw: ["trespass", "entered my land", "entered the house"], cats: ["property"] },
  { id: "extort", g: "property", en: "Extortion", kn: "ಸುಲಿಗೆ", law: "BNS", sec: "308(2)", old: "IPC 384", kw: ["extort", "demanded money", "pay or"] },
  { id: "robbery", g: "property", en: "Robbery", kn: "ದರೋಡೆ", law: "BNS", sec: "309(4)", old: "IPC 392", kw: ["robbed", "robbery", "knifepoint", "at gunpoint"] },
  { id: "dacoity", g: "property", en: "Dacoity (five or more persons)", kn: "ಡಕಾಯಿತಿ (ಐದು ಅಥವಾ ಹೆಚ್ಚು ಜನ)", law: "BNS", sec: "310(2)", old: "IPC 395", kw: ["dacoity", "gang of"] },
  { id: "cbt", g: "property", en: "Criminal breach of trust", kn: "ನಂಬಿಕೆ ದ್ರೋಹ", law: "BNS", sec: "316(2)", old: "IPC 406", kw: ["entrusted", "did not return", "misused the money"], cats: ["cheating"] },
  { id: "stolenprop", g: "property", en: "Receiving stolen property", kn: "ಕದ್ದ ಆಸ್ತಿ ಸ್ವೀಕರಿಸುವುದು", law: "BNS", sec: "317(2)", old: "IPC 411", kw: ["stolen property", "recovered"], types: ["vehicle-theft"] },
  { id: "cheating", g: "property", en: "Cheating", kn: "ವಂಚನೆ", law: "BNS", sec: "318(4)", old: "IPC 420", kw: ["cheat", "fraud", "fake", "deceived", "debited"], types: ["cheating"], cats: ["cheating", "cyber-fraud"] },
  { id: "personate", g: "property", en: "Cheating by pretending to be someone else", kn: "ಬೇರೆಯವರಂತೆ ನಟಿಸಿ ವಂಚನೆ", law: "BNS", sec: "319(2)", old: "IPC 419", kw: ["pretended", "posing as", "said he was from", "claimed to be"] },
  { id: "mischief", g: "property", en: "Mischief (damage to property)", kn: "ಕಿಡಿಗೇಡಿತನ (ಆಸ್ತಿ ಹಾನಿ)", law: "BNS", sec: "324", old: "IPC 425 to 427", kw: ["damaged", "broke the", "set fire"], cats: ["property"] },
  { id: "forgery", g: "property", en: "Forgery for cheating", kn: "ವಂಚನೆಗಾಗಿ ನಕಲಿ ದಾಖಲೆ", law: "BNS", sec: "336(3)", old: "IPC 468", kw: ["forged", "fake document", "fake signature"] },
  // cyber
  { id: "it66d", g: "cyber", en: "Online cheating by personation (fake call, link or profile)", kn: "ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಬೇರೆಯವರಂತೆ ನಟಿಸಿ ವಂಚನೆ", law: "IT Act, 2000", sec: "Sec 66D", old: "", kw: ["otp", "upi", "online", "link", "kyc", "bank", "customer care"], types: ["cheating"], cats: ["cyber-fraud"] },
  { id: "it66c", g: "cyber", en: "Identity theft (password, OTP or account misuse)", kn: "ಗುರುತಿನ ಕಳ್ಳತನ (ಪಾಸ್‌ವರ್ಡ್, OTP ದುರ್ಬಳಕೆ)", law: "IT Act, 2000", sec: "Sec 66C", old: "", kw: ["otp", "password", "hacked", "account taken"], cats: ["cyber-fraud"] },
  { id: "it66e", g: "cyber", en: "Sharing private images without consent", kn: "ಒಪ್ಪಿಗೆ ಇಲ್ಲದೆ ಖಾಸಗಿ ಚಿತ್ರ ಹಂಚಿಕೆ", law: "IT Act, 2000", sec: "Sec 66E", old: "", kw: ["private photo", "private video", "morphed"] },
  { id: "it67", g: "cyber", en: "Publishing obscene or sexually explicit material online", kn: "ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಅಶ್ಲೀಲ ವಸ್ತು ಪ್ರಕಟಣೆ", law: "IT Act, 2000", sec: "Sec 67, 67A", old: "", kw: ["obscene", "explicit", "nude"] },
  // threats and public order
  { id: "intim", g: "order", en: "Criminal intimidation (threats)", kn: "ಕ್ರಿಮಿನಲ್ ಬೆದರಿಕೆ", law: "BNS", sec: "351(2)", old: "IPC 506", kw: ["threat", "threatened", "kill you", "will kill"], cats: ["harassment"] },
  { id: "insultp", g: "order", en: "Insult to provoke breach of peace", kn: "ಶಾಂತಿ ಭಂಗಕ್ಕೆ ಪ್ರಚೋದಿಸುವ ಅವಮಾನ", law: "BNS", sec: "352", old: "IPC 504", kw: ["abused", "abusive", "filthy language"], cats: ["harassment"] },
  { id: "defame", g: "order", en: "Defamation", kn: "ಮಾನನಷ್ಟ", law: "BNS", sec: "356(2)", old: "IPC 500", kw: ["defame", "false rumours", "spreading lies"] },
  { id: "assembly", g: "order", en: "Unlawful assembly", kn: "ಅಕ್ರಮ ಕೂಟ", law: "BNS", sec: "189(2)", old: "IPC 143", kw: ["unlawful assembly"] },
  { id: "riot", g: "order", en: "Rioting", kn: "ಗಲಭೆ", law: "BNS", sec: "191(2)", old: "IPC 147", kw: ["riot", "mob", "group attacked"] },
  { id: "atrocity", g: "order", en: "Atrocity against SC/ST persons", kn: "ಪರಿಶಿಷ್ಟ ಜಾತಿ ಅಥವಾ ಪಂಗಡದವರ ಮೇಲೆ ದೌರ್ಜನ್ಯ", law: "SC/ST (Prevention of Atrocities) Act, 1989", sec: "Sec 3", old: "", kw: ["caste"] },
  // road, drugs, weapons
  { id: "drunk", g: "road", en: "Drunken driving", kn: "ಮದ್ಯಪಾನ ಮಾಡಿ ಚಾಲನೆ", law: "Motor Vehicles Act, 1988", sec: "Sec 185", old: "", kw: ["drunk", "alcohol", "liquor"], types: ["accident"] },
  { id: "dangerous", g: "road", en: "Dangerous driving", kn: "ಅಪಾಯಕಾರಿ ಚಾಲನೆ", law: "Motor Vehicles Act, 1988", sec: "Sec 184", old: "", kw: ["wrong side", "dangerous driving"], types: ["accident"], cats: ["accident"] },
  { id: "nolicence", g: "road", en: "Driving without a licence", kn: "ಪರವಾನಗಿ ಇಲ್ಲದೆ ಚಾಲನೆ", law: "Motor Vehicles Act, 1988", sec: "Sec 181", old: "", kw: ["no licence", "without licence"] },
  { id: "hitrun", g: "road", en: "Driver did not help or report after an accident", kn: "ಅಪಘಾತದ ನಂತರ ಚಾಲಕ ಸಹಾಯ ಮಾಡದಿರುವುದು ಅಥವಾ ತಿಳಿಸದಿರುವುದು", law: "Motor Vehicles Act, 1988", sec: "Sec 134, 187", old: "", kw: ["fled", "ran away", "hit and run", "did not stop"], types: ["accident"] },
  { id: "ndps", g: "road", en: "Drugs (ganja and others)", kn: "ಮಾದಕ ವಸ್ತುಗಳು (ಗಾಂಜಾ ಇತ್ಯಾದಿ)", law: "NDPS Act, 1985", sec: "Sec 20, 21, 22", old: "", kw: ["ganja", "drugs", "narcotic", "smack"] },
  { id: "arms", g: "road", en: "Illegal possession of arms", kn: "ಅಕ್ರಮವಾಗಿ ಶಸ್ತ್ರಾಸ್ತ್ರ ಹೊಂದುವುದು", law: "Arms Act, 1959", sec: "Sec 25", old: "", kw: ["gun", "pistol", "firearm", "country-made"] },
  // reports
  { id: "missing", g: "report", en: "Missing person", kn: "ಕಾಣೆಯಾದ ವ್ಯಕ್ತಿ", law: "Missing person report", sec: "", old: "", note: { en: "Not an offence by itself. If the missing person is a child, register a case of kidnapping.", kn: "ಸ್ವತಃ ಅಪರಾಧವಲ್ಲ. ಕಾಣೆಯಾದವರು ಮಗುವಾಗಿದ್ದರೆ, ಅಪಹರಣ ಪ್ರಕರಣ ದಾಖಲಿಸಿ." }, kw: ["missing", "not returned home", "not traced"], types: ["missing-person"], cats: ["missing"] },
  { id: "lost", g: "report", en: "Lost property", kn: "ಕಳೆದುಹೋದ ವಸ್ತು", law: "Lost property report", sec: "", old: "", note: { en: "Not an offence by itself. If someone took it, treat it as theft.", kn: "ಸ್ವತಃ ಅಪರಾಧವಲ್ಲ. ಯಾರಾದರೂ ತೆಗೆದುಕೊಂಡಿದ್ದರೆ ಕಳ್ಳತನ ಎಂದು ಪರಿಗಣಿಸಿ." }, kw: ["lost", "misplaced", "fell"], types: ["lost-property"], cats: ["mobile-lost"] },
];
const lawOf = (id) => LAWS.find((l) => l.id === id);
const lawName = (l) => (isKn() ? l.kn : l.en);
const lawSec = (l) => (l.law === "BNS" ? `BNS ${l.sec}` : l.sec ? `${l.law}, ${l.sec}` : l.law);
const lawRef = (l) => `${lawSec(l)}${l.old && l.law === "BNS" ? ` (${l.old})` : ""}`;

/* Suggest offences from the record type, the citizen category and the words in the summary */
function lawSuggest(text, type, cat) {
  const t = " " + String(text || "").toLowerCase().replace(/\s+/g, " ") + " ";
  const out = [];
  LAWS.forEach((l) => {
    let score = 0;
    if (type && (l.types || []).includes(type)) score += 2;
    if (cat && (l.cats || []).includes(cat)) score += 2;
    (l.kw || []).forEach((k) => { if (t.includes(k)) score += 3; });
    if (score) out.push([score, l]);
  });
  return out.sort((a, b) => b[0] - a[0]).slice(0, 6).map((x) => x[1]);
}
function lawSearch(q) {
  const s = String(q || "").trim().toLowerCase();
  if (!s) return LAWS;
  return LAWS.filter((l) => (l.en + " " + l.kn + " " + lawSec(l) + " " + l.old + " " + (l.kw || []).join(" ")).toLowerCase().includes(s));
}
function lawRowHTML(l, mode, chosen) {
  const on = chosen && chosen.includes(l.id);
  const btn = mode === "pick" ? `<button class="btn sm ${on ? "" : "primary"}" data-act="${on ? "lawDel" : "lawAdd"}" data-id="${l.id}">${on ? "Added" : "Add"}</button>` : "";
  return `<div class="law-row ${on ? "on" : ""}"><div style="min-width:0"><b>${h(lawName(l))}</b>${l.note ? `<span class="tiny muted">${h(isKn() ? l.note.kn : l.note.en)}</span>` : ""}</div>
    <div class="law-sec">${l.sec || l.law !== "BNS" ? `<span class="mono" data-notr>${h(lawSec(l))}</span>` : ""}${l.old ? `<span class="tiny muted">${l.old === "New in BNS" ? "New in BNS" : `<span>Old</span> <span data-notr>${h(l.old)}</span>`}</span>` : ""}</div>${btn}</div>`;
}
function lawListHTML(q, mode, chosen) {
  const list = lawSearch(q);
  if (!list.length) return `<p class="muted small">No match. Try another word, for example theft, threat or cheating.</p>`;
  return LAW_GROUPS.map((g) => { const items = list.filter((l) => l.g === g.id); return items.length ? `<div class="law-g"><div class="lbl">${h(isKn() ? g.kn : g.en)}</div>${items.map((l) => lawRowHTML(l, mode, chosen)).join("")}</div>` : ""; }).join("");
}
const LAW_NOTE = "Reference only. The officer decides the sections after reading the facts. BNS applies to offences from 1 July 2024. For offences before that date, use the old IPC section.";

/* Officer panel in the Direct Entry Desk */
function vLawPanel(d) {
  const chosen = d.sections || [];
  return `<div class="field full lawbox"><span class="lbl">Sections of law</span>
    <div id="law-chosen">${vLawChosen(d)}</div>
    <div id="law-sug">${vLawSug(d)}</div>
    <details class="law-browse" ${ui.lawOpen ? "open" : ""}><summary data-act="lawToggle">${ICON.search}<span>Browse common offences and laws</span></summary>
      <div class="stack" style="gap:8px;margin-top:8px"><label class="sr" for="lawq">Search offences</label><input id="lawq" class="input" data-bind="lawq" value="${h(ui.lawQ || "")}" placeholder="Search: theft, rape, threat, cheating, 420…" />
      <div id="law-list" class="law-list">${lawListHTML(ui.lawQ, "pick", chosen)}</div></div></details>
    <span class="help">${LAW_NOTE}</span></div>`;
}
function vLawChosen(d) {
  const chosen = (d.sections || []).map(lawOf).filter(Boolean);
  return chosen.length ? `<div class="law-chips">${chosen.map((l) => `<span class="law-chip"><span>${h(lawName(l))}</span> <b class="mono" data-notr>${h(lawSec(l))}</b><button class="x" data-act="lawDel" data-id="${l.id}" aria-label="Remove ${h(l.en)}">${ICON.x}</button></span>`).join("")}</div>` : `<p class="muted small" style="margin:0">No sections added yet.</p>`;
}
function vLawSug(d) {
  const chosen = d.sections || [];
  const sug = lawSuggest(d.summary, d.type).filter((l) => !chosen.includes(l.id));
  return sug.length ? `<div class="law-sug"><span class="tiny muted">Suggested from the type and the summary:</span>${sug.map((l) => `<button class="law-pill" data-act="lawAdd" data-id="${l.id}">${ICON.plus}<span>${h(lawName(l))}</span> <b class="mono" data-notr>${h(lawSec(l))}</b></button>`).join("")}</div>` : "";
}
/* Citizen reference (read-only) */
function vLawCitizen(F) {
  const sug = lawSuggest(F.description, catOf(F.category).type, F.category);
  return `<details class="law-browse cit" ${ui.lawOpen ? "open" : ""}><summary data-act="lawToggle">${ICON.info}<span>Which law may apply? (for your information)</span></summary>
    <div class="stack" style="gap:8px;margin-top:8px">
      ${sug.length ? `<div class="law-g"><div class="lbl">May apply to what you wrote</div>${sug.map((l) => lawRowHTML(l, "view")).join("")}</div>` : `<p class="small muted">Choose the type of complaint and write what happened. Matching laws show here.</p>`}
      <label class="sr" for="lawq">Search offences</label><input id="lawq" class="input" data-bind="lawq" value="${h(ui.lawQ || "")}" placeholder="Search: theft, threat, cheating…" />
      <div id="law-list" class="law-list">${lawListHTML(ui.lawQ, "view")}</div>
      <p class="help">The police officer decides the final sections. You do not need to choose them.</p></div></details>`;
}
const LACT = {
  lawAdd(el) { const d = S.draft; d.sections = d.sections || []; if (!d.sections.includes(el.dataset.id)) d.sections.push(el.dataset.id); save(); lawRepaint(); refreshEntrySide(); },
  lawDel(el) { const d = S.draft; d.sections = (d.sections || []).filter((x) => x !== el.dataset.id); save(); lawRepaint(); refreshEntrySide(); },
  lawToggle(el, e) { if (e) e.preventDefault(); ui.lawOpen = !ui.lawOpen; const det = el.closest("details"); if (det) det.open = ui.lawOpen; },
};
const LBIND = {
  lawq(el) { ui.lawQ = el.value; const box = $("#law-list"); if (!box) return; const mode = ui.page === "entry" ? "pick" : "view"; paint(box, lawListHTML(ui.lawQ, mode, mode === "pick" ? S.draft.sections || [] : null)); },
};
function lawRepaint() {
  if (ui.page !== "entry") return;
  const d = S.draft;
  const a = $("#law-chosen"), b = $("#law-sug"), c = $("#law-list");
  if (a) paint(a, vLawChosen(d)); if (b) paint(b, vLawSug(d)); if (c) paint(c, lawListHTML(ui.lawQ, "pick", d.sections || []));
}
