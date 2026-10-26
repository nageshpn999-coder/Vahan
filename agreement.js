// వాహన అమ్మకపు ఒప్పందం: ఫారం నింపితే తెలుగు / English లో ప్రింట్ చేయగల పత్రం తయారవుతుంది
import { DEMO, db, fb, getLang, applyI18n, renderHeader, esc, title, currentUser, toast, distName } from "./common.js";
import { SAMPLE } from "./data.js";

renderHeader();
applyI18n();
const ui = getLang();               // ఫారం భాష (సైట్ భాష)
let docLang = ui;                   // పత్రం భాష (వేరుగా ఎంచుకోవచ్చు)
const $ = (id) => document.getElementById(id);
const FIELDS = ["sName", "sFather", "sAddr", "sPhone", "bName", "bFather", "bAddr", "bPhone", "vMake", "vYear", "vReg", "vKm",
  "vChassis", "vEngine", "price", "advance", "payMode", "rcCost", "hDate", "hTime", "place"];

// ---------- ఫారం లేబుల్స్ ----------
const UI = {
  te: {
    title: "📄 వాహన అమ్మకపు ఒప్పందం", intro: "వివరాలు నింపండి — కింద పత్రం తయారవుతుంది. ప్రింట్ తీసి ఇద్దరూ, ఇద్దరు సాక్షులు సంతకం చేయండి. ఉచితం.",
    lang: "ఒప్పందం భాష", seller: "👤 అమ్మేవారు", buyer: "👤 కొనేవారు", vehicle: "🚗 వాహనం", deal: "💰 డీల్ వివరాలు",
    name: "పేరు", father: "తండ్రి / భర్త పేరు", addr: "చిరునామా", phone: "ఫోన్", make: "కంపెనీ & మోడల్", year: "తయారీ సంవత్సరం",
    reg: "రిజిస్ట్రేషన్ నంబర్", km: "నడిచిన కి.మీ.", chassis: "ఛాసిస్ నంబర్", engine: "ఇంజిన్ నంబర్", price: "మొత్తం ధర (₹)",
    advance: "ఇప్పుడు ఇచ్చిన మొత్తం (₹)", mode: "చెల్లింపు విధానం", rcCost: "RC బదిలీ ఖర్చు ఎవరిది?", hDate: "వాహనం అప్పగించిన తేదీ",
    hTime: "సమయం", place: "ఒప్పందం జరిగిన ఊరు", loan: "వాహనంపై ఇంకా బ్యాంక్ లోన్ ఉంది", back: "← హోమ్", print: "🖨️ ప్రింట్ / PDF సేవ్",
    help: "ప్రింట్ నొక్కాక 'Save as PDF' ఎంచుకుంటే PDF గా సేవ్ అవుతుంది. ఈ వివరాలు మీ ఫోన్‌లోనే ఉంటాయి, ఎక్కడికీ పంపబడవు.",
    preview: "👇 ఒప్పందం ప్రివ్యూ"
  },
  en: {
    title: "📄 Vehicle sale agreement", intro: "Fill in the details — the document is created below. Print it and sign it with two witnesses. Free.",
    lang: "Agreement language", seller: "👤 Seller", buyer: "👤 Buyer", vehicle: "🚗 Vehicle", deal: "💰 Deal details",
    name: "Name", father: "Father's / husband's name", addr: "Address", phone: "Phone", make: "Make & model", year: "Year of manufacture",
    reg: "Registration number", km: "KM driven", chassis: "Chassis number", engine: "Engine number", price: "Total price (₹)",
    advance: "Amount paid now (₹)", mode: "Payment mode", rcCost: "Who pays RC transfer cost?", hDate: "Handover date",
    hTime: "Time", place: "Place of agreement", loan: "Vehicle still has a bank loan", back: "← Home", print: "🖨️ Print / save PDF",
    help: "After tapping print, choose 'Save as PDF' to save it. These details stay on your phone and are not sent anywhere.",
    preview: "👇 Agreement preview"
  }
};
const OPTS = {
  payMode: { cash: { te: "నగదు", en: "Cash" }, upi: { te: "UPI", en: "UPI" }, bank: { te: "బ్యాంక్ ట్రాన్స్‌ఫర్", en: "Bank transfer" }, cheque: { te: "చెక్", en: "Cheque" } },
  rcCost: { buyer: { te: "కొనేవారు", en: "Buyer" }, seller: { te: "అమ్మేవారు", en: "Seller" }, both: { te: "ఇద్దరూ సగం సగం", en: "Shared equally" } }
};

function setupForm() {
  const L = UI[ui];
  $("agTitle").textContent = L.title; $("agIntro").textContent = L.intro; $("lLang").textContent = L.lang;
  $("hSeller").textContent = L.seller; $("hBuyer").textContent = L.buyer; $("hVehicle").textContent = L.vehicle; $("hDeal").textContent = L.deal;
  document.querySelectorAll("[data-l]").forEach(el => (el.textContent = L[el.dataset.l]));
  $("printBtn").textContent = L.print; $("printHelp").textContent = L.help; $("prevH").textContent = L.preview;
  for (const k of ["payMode", "rcCost"]) $(k).innerHTML = Object.entries(OPTS[k]).map(([v, o]) => `<option value="${v}">${o[ui]}</option>`).join("");
  $("hDate").value = new Date().toISOString().slice(0, 10);
  $("hTime").value = new Date().toTimeString().slice(0, 5);
  $("docLang").onclick = (e) => { const b = e.target.closest("button"); if (b) { docLang = b.dataset.v; syncLang(); render(); } };
  syncLang();
  // ఫోన్‌లో డ్రాఫ్ట్ సేవ్ (మళ్లీ ఓపెన్ చేస్తే వివరాలు ఉంటాయి)
  try {
    const d = JSON.parse(localStorage.getItem("vahan_agreement") || "{}");
    FIELDS.forEach(k => { if (d[k] != null && d[k] !== "") $(k).value = d[k]; });
    if (d.loan) $("loan").checked = true;
  } catch {}
  document.getElementById("agForm").addEventListener("input", () => { saveDraft(); render(); });
  document.getElementById("agForm").addEventListener("change", () => { saveDraft(); render(); });
  $("printBtn").onclick = () => { render(); window.print(); };
}
function syncLang() { document.querySelectorAll("#docLang button").forEach(b => b.classList.toggle("on", b.dataset.v === docLang)); }
function saveDraft() {
  try {
    const d = {}; FIELDS.forEach(k => (d[k] = $(k).value)); d.loan = $("loan").checked;
    localStorage.setItem("vahan_agreement", JSON.stringify(d));
  } catch {}
}

// వాహనం ID ఉంటే వివరాలు ముందే నింపడం
async function prefill() {
  const id = new URLSearchParams(location.search).get("id");
  if (!id) return;
  let v = null;
  try {
    if (DEMO) v = SAMPLE.find(x => x.id === id);
    else { const s = await fb.getDoc(fb.doc(db, "vehicles", id)); if (s.exists()) v = { id: s.id, ...s.data() }; }
  } catch { /* అనుమతి లేకపోతే ఖాళీగానే */ }
  if (!v) return;
  const set = (k, val) => { if (val != null && val !== "") $(k).value = val; };
  set("vMake", title(v)); set("vYear", v.year); set("vKm", v.kmDriven); set("price", v.price);
  set("place", v.place || distName(v.district));
  const user = await currentUser();
  if (DEMO || (user && user.uid === v.ownerUid)) { set("sName", v.ownerName); set("sPhone", v.ownerPhone); }
  saveDraft();
}

// ---------- పత్రం ----------
const BL = "________________";
const val = (k) => esc(($(k).value || "").trim()) || BL;
const inr = (n) => Number(n || 0).toLocaleString("en-IN");
function dmy(iso) { if (!iso) return BL; const [y, m, d] = iso.split("-"); return `${d}-${m}-${y}`; }

// English లో అంకెలను పదాలుగా (భారతీయ పద్ధతి: lakh, crore)
function words(n) {
  n = Math.floor(Number(n) || 0); if (!n) return "Zero";
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const two = (x) => x < 20 ? a[x] : b[Math.floor(x / 10)] + (x % 10 ? " " + a[x % 10] : "");
  const three = (x) => (x >= 100 ? a[Math.floor(x / 100)] + " Hundred" + (x % 100 ? " " : "") : "") + (x % 100 ? two(x % 100) : "");
  const parts = [];
  const cr = Math.floor(n / 1e7); n %= 1e7; if (cr) parts.push(three(cr) + " Crore");
  const lk = Math.floor(n / 1e5); n %= 1e5; if (lk) parts.push(two(lk) + " Lakh");
  const th = Math.floor(n / 1e3); n %= 1e3; if (th) parts.push(two(th) + " Thousand");
  if (n) parts.push(three(n));
  return parts.join(" ");
}

function render() {
  const te = docLang === "te";
  const price = Number($("price").value) || 0, adv = Math.min(Number($("advance").value) || 0, price);
  const bal = price - adv;
  const mode = OPTS.payMode[$("payMode").value]?.[docLang] || BL;
  const rc = OPTS.rcCost[$("rcCost").value]?.[docLang] || BL;
  const loan = $("loan").checked;
  $("priceW").textContent = price ? (ui === "te" ? `₹${inr(price)}` : `Rupees ${words(price)} only`) : "";
  const amt = price ? `₹${inr(price)}/-` : `₹${BL}`;
  const amtWords = price ? (te ? `(అక్షరాలా: ${BL}${BL} రూపాయలు మాత్రమే)` : `(Rupees ${words(price)} only)`) : "";
  const person = (p) => te
    ? `శ్రీ/శ్రీమతి <b>${val(p + "Name")}</b>, తండ్రి/భర్త: ${val(p + "Father")}, చిరునామా: ${val(p + "Addr")}, ఫోన్: ${val(p + "Phone")}`
    : `Mr./Ms. <b>${val(p + "Name")}</b>, S/o, D/o or W/o ${val(p + "Father")}, residing at ${val(p + "Addr")}, phone ${val(p + "Phone")}`;
  const row = (k, l) => `<tr><td>${l}</td><td><b>${k === "vReg" || k === "vChassis" || k === "vEngine" ? val(k).toUpperCase() : val(k)}</b></td></tr>`;
  const L = UI[docLang];

  const clauses = te ? [
    `పై వాహనానికి అమ్మేవారే చట్టబద్ధమైన యజమాని. ${loan ? "వాహనంపై ఉన్న బ్యాంక్ లోన్ మొత్తాన్ని అమ్మేవారు పూర్తిగా చెల్లించి, బ్యాంక్ నుంచి NOC (నో అబ్జెక్షన్ సర్టిఫికెట్) కొనేవారికి ఇవ్వాలి." : "వాహనంపై ఎలాంటి బ్యాంక్ లోన్, తాకట్టు (hypothecation), కోర్టు కేసులు లేవని అమ్మేవారు హామీ ఇస్తున్నారు."}`,
    `మొత్తం అమ్మకపు ధర <b>${amt}</b> ${amtWords}. ఇందులో <b>₹${inr(adv)}/-</b> ఈ రోజు ${mode} ద్వారా అమ్మేవారికి అందింది. మిగతా <b>₹${inr(bal)}/-</b> వాహనం అప్పగించే సమయానికి చెల్లించాలి.`,
    `వాహనాన్ని <b>${dmy($("hDate").value)}</b> న <b>${val("hTime")}</b> గంటలకు కొనేవారికి అప్పగించారు. ఈ సమయానికి ముందు జరిగిన ప్రమాదాలు, ట్రాఫిక్ చలాన్‌లు, పన్నులు, చట్టపరమైన బాధ్యతలు అన్నీ అమ్మేవారివే; ఆ తర్వాత జరిగేవన్నీ కొనేవారివే.`,
    `కొనేవారు వాహనాన్ని స్వయంగా చూసి, నడిపి, ప్రస్తుతం ఉన్న స్థితిలో (as is) సంతృప్తితో కొంటున్నారు.`,
    `అసలు RC, ఇన్సూరెన్స్, పొల్యూషన్ సర్టిఫికెట్, సర్వీస్ బుక్ (ఉంటే), అన్ని తాళాలు అమ్మేవారు కొనేవారికి అప్పగించాలి. RC బదిలీ కోసం Form 29, Form 30 పై అమ్మేవారు సంతకం చేయాలి.`,
    `RC బదిలీ వీలైనంత త్వరగా పూర్తయ్యేలా ఇద్దరూ RTO వద్ద సహకరించాలి. RC బదిలీ ఖర్చులు: <b>${rc}</b>. బదిలీ పూర్తయ్యే వరకు కొనేవారు ఈ వాహనాన్ని చట్టవిరుద్ధమైన పనులకు వాడకూడదు.`,
    `ఈ ఒప్పందాన్ని ఇద్దరూ పూర్తిగా చదివి, అర్థం చేసుకుని, ఎవరి ఒత్తిడి లేకుండా ఇష్టపూర్వకంగా సంతకాలు చేస్తున్నాము.`
  ] : [
    `The Seller is the lawful owner of the above vehicle. ${loan ? "The Seller shall fully repay the existing bank loan on the vehicle and hand over the bank's NOC (No Objection Certificate) to the Buyer." : "The Seller declares that the vehicle is free from any bank loan, hypothecation or court case."}`,
    `The total sale price is <b>${amt}</b> ${amtWords}. Of this, <b>₹${inr(adv)}/-</b> has been received by the Seller today by ${mode}. The balance of <b>₹${inr(bal)}/-</b> shall be paid at the time of handover.`,
    `The vehicle was handed over to the Buyer on <b>${dmy($("hDate").value)}</b> at <b>${val("hTime")}</b>. All accidents, traffic challans, taxes and legal liabilities before this time are the Seller's responsibility; all after it are the Buyer's.`,
    `The Buyer has personally inspected and test-driven the vehicle and is buying it in its present condition (as is), to their satisfaction.`,
    `The Seller shall hand over the original RC, insurance, pollution certificate, service book (if any) and all keys, and shall sign Form 29 and Form 30 for the RC transfer.`,
    `Both parties shall cooperate at the RTO to complete the RC transfer as early as possible. RC transfer cost: <b>${rc}</b>. Until the transfer is complete, the Buyer shall not use the vehicle for any unlawful purpose.`,
    `Both parties have read and understood this agreement fully and sign it of their own free will, without any pressure.`
  ];

  const T = te ? {
    h: "వాహన అమ్మకపు ఒప్పంద పత్రం", sub: "Vehicle Sale Agreement",
    open: `ఈ ఒప్పందం <b>${dmy($("hDate").value)}</b> న <b>${val("place")}</b> లో క్రింది ఇద్దరి మధ్య జరిగింది:`,
    seller: "అమ్మేవారు (Seller)", buyer: "కొనేవారు (Buyer)", veh: "వాహన వివరాలు", terms: "షరతులు",
    sS: "అమ్మేవారి సంతకం", sB: "కొనేవారి సంతకం", w: "సాక్షి", wn: "పేరు & సంతకం",
    foot: "RideKart ద్వారా తయారైన నమూనా పత్రం. ఇది న్యాయ సలహా కాదు — అవసరమైతే న్యాయవాదిని సంప్రదించండి. కావాలంటే స్టాంప్ పేపర్‌పై ప్రింట్ చేసుకోవచ్చు."
  } : {
    h: "Vehicle Sale Agreement", sub: "వాహన అమ్మకపు ఒప్పంద పత్రం",
    open: `This agreement is made on <b>${dmy($("hDate").value)}</b> at <b>${val("place")}</b> between:`,
    seller: "Seller", buyer: "Buyer", veh: "Vehicle details", terms: "Terms",
    sS: "Seller's signature", sB: "Buyer's signature", w: "Witness", wn: "Name & signature",
    foot: "Sample document generated by RideKart. This is not legal advice — consult a lawyer if needed. You may print it on stamp paper."
  };

  $("doc").innerHTML = `
    <div class="ag-top"><span class="ag-logo">R</span><span>RideKart</span></div>
    <h1>${T.h}</h1><p class="ag-sub">${T.sub}</p>
    <p>${T.open}</p>
    <p><b>1. ${T.seller}:</b> ${person("s")}</p>
    <p><b>2. ${T.buyer}:</b> ${person("b")}</p>
    <h4>${T.veh}</h4>
    <table>
      ${row("vMake", L.make)}${row("vYear", L.year)}${row("vReg", L.reg)}
      ${row("vChassis", L.chassis)}${row("vEngine", L.engine)}${row("vKm", L.km)}
    </table>
    <h4>${T.terms}</h4>
    <ol>${clauses.map(c => `<li>${c}</li>`).join("")}</ol>
    <div class="ag-sign">
      <div><div class="ag-line"></div>${T.sS}<br><small>${val("sName")}</small></div>
      <div><div class="ag-line"></div>${T.sB}<br><small>${val("bName")}</small></div>
      <div><div class="ag-line"></div>${T.w} 1 — ${T.wn}</div>
      <div><div class="ag-line"></div>${T.w} 2 — ${T.wn}</div>
    </div>
    <p class="ag-foot">${T.foot}</p>`;
}

setupForm();
render();
prefill().then(render);
if (new URLSearchParams(location.search).get("print") === "1") setTimeout(() => window.print(), 600);
