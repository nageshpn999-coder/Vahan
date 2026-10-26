// అన్ని పేజీలు వాడే కామన్ కోడ్: Firebase, భాష, హెల్పర్స్
import { firebaseConfig, site, DEMO } from "./config.js";
import { CATEGORIES, FUELS, DISTRICTS, VOICE_MAP, STOP_WORDS } from "./data.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber, signOut,
  GoogleAuthProvider, signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, doc, getDoc, getDocs, addDoc, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, startAt, endAt, limit, increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export { DEMO, site };
export let auth = null, db = null;
if (!DEMO) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  auth.languageCode = "te";
  db = getFirestore(app);
}
export const fb = {
  onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber, signOut, GoogleAuthProvider, signInWithPopup,
  collection, doc, getDoc, getDocs, addDoc, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, startAt, endAt, limit, increment
};

// ---------- భాష (తెలుగు / English) ----------
const DICT = {
  te: {
    tagline: "మీ దగ్గరలోని వాహనాలు — కొనండి, అమ్మండి",
    sell: "అమ్మండి", my: "నా వాహనాలు", home: "హోమ్", admin: "అడ్మిన్",
    login: "లాగిన్", logout: "లాగౌట్",
    searchPh: "బ్రాండ్ లేదా మోడల్ వెతకండి…",
    useGps: "📍 నా లొకేషన్", chooseDistrict: "జిల్లా ఎంచుకోండి",
    within: "దూరం", all: "అన్నీ", allTelangana: "తెలంగాణ మొత్తం",
    filters: "ఫిల్టర్లు", fuel: "ఇంధనం", minPrice: "కనిష్ట ధర", maxPrice: "గరిష్ట ధర",
    yearFrom: "సంవత్సరం నుండి", sort: "క్రమం", sortNear: "దగ్గరవి ముందు", sortNew: "కొత్తవి ముందు",
    sortLow: "తక్కువ ధర", sortHigh: "ఎక్కువ ధర", evOnly: "⚡ EV మాత్రమే", apply: "వర్తింపజేయి", reset: "రీసెట్",
    results: "వాహనాలు", noResults: "ఈ ప్రాంతంలో వాహనాలు లేవు. దూరం పెంచి చూడండి.",
    loadMore: "ఇంకా చూపించు", loading: "లోడ్ అవుతోంది…", featured: "ఫీచర్డ్",
    km: "కి.మీ.", away: "దూరంలో", negotiable: "బేరం ఉంది", fixed: "ఫిక్స్‌డ్ ధర",
    year: "సంవత్సరం", kmDriven: "నడిచిన కి.మీ.", owners: "ఓనర్లు", transmission: "గేర్",
    manual: "మాన్యువల్", automatic: "ఆటోమేటిక్", place: "ఊరు", district: "జిల్లా",
    batteryHealth: "బ్యాటరీ హెల్త్", range: "రేంజ్ (ఫుల్ ఛార్జ్)", batteryWarranty: "బ్యాటరీ వారంటీ మిగిలింది (నెలలు)",
    chargerIncluded: "ఛార్జర్ ఇస్తారు", chargeTime: "ఛార్జింగ్ సమయం (గంటలు)", yes: "అవును", no: "లేదు",
    evDetails: "⚡ EV వివరాలు", description: "వివరణ", seller: "అమ్మేవారు",
    whatsapp: "WhatsApp", call: "కాల్ చేయండి", share: "షేర్", report: "ఫిర్యాదు",
    safety: "జాగ్రత్త: వాహనం చూడకుండా, RC పేపర్లు చెక్ చేయకుండా ముందుగా డబ్బు పంపవద్దు.",
    demo: "DEMO మోడ్: ఇవి నమూనా వాహనాలు. Firebase సెటప్ చేశాక నిజమైన డేటా వస్తుంది.",
    views: "వ్యూస్", posted: "పోస్ట్ చేసింది"
  },
  en: {
    tagline: "Vehicles near you — buy & sell",
    sell: "Sell", my: "My vehicles", home: "Home", admin: "Admin",
    login: "Login", logout: "Logout",
    searchPh: "Search brand or model…",
    useGps: "📍 My location", chooseDistrict: "Choose district",
    within: "Distance", all: "All", allTelangana: "All Telangana",
    filters: "Filters", fuel: "Fuel", minPrice: "Min price", maxPrice: "Max price",
    yearFrom: "Year from", sort: "Sort", sortNear: "Nearest first", sortNew: "Newest first",
    sortLow: "Price: low", sortHigh: "Price: high", evOnly: "⚡ EV only", apply: "Apply", reset: "Reset",
    results: "vehicles", noResults: "No vehicles in this area. Try a larger distance.",
    loadMore: "Show more", loading: "Loading…", featured: "Featured",
    km: "km", away: "away", negotiable: "Negotiable", fixed: "Fixed price",
    year: "Year", kmDriven: "KM driven", owners: "Owners", transmission: "Transmission",
    manual: "Manual", automatic: "Automatic", place: "Town/Village", district: "District",
    batteryHealth: "Battery health", range: "Range (full charge)", batteryWarranty: "Battery warranty left (months)",
    chargerIncluded: "Charger included", chargeTime: "Charging time (hours)", yes: "Yes", no: "No",
    evDetails: "⚡ EV details", description: "Description", seller: "Seller",
    whatsapp: "WhatsApp", call: "Call", share: "Share", report: "Report",
    safety: "Safety: never pay in advance without seeing the vehicle and checking RC papers.",
    demo: "DEMO mode: these are sample vehicles. Real data appears after Firebase setup.",
    views: "views", posted: "Posted"
  }
};

export function getLang() {
  try { return localStorage.getItem("vahan_lang") || "te"; } catch { return "te"; }
}
export function setLang(l) {
  try { localStorage.setItem("vahan_lang", l); } catch {}
  location.reload();
}
export const t = (k) => (DICT[getLang()] || DICT.te)[k] ?? DICT.te[k] ?? k;
export function applyI18n(root = document) {
  root.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.documentElement.lang = getLang();
}
export const catLabel = (id) => { const c = CATEGORIES.find(x => x.id === id); return c ? c[getLang()] : id; };
export const catIcon = (id) => (CATEGORIES.find(x => x.id === id) || {}).icon || "🚘";
export const fuelLabel = (id) => { const f = FUELS.find(x => x.id === id); return f ? f[getLang()] : id; };
// జిల్లా పేరు: డేటాలో English గా సేవ్ అవుతుంది, చూపించేటప్పుడు తెలుగులో "నారాయణపేట జిల్లా"
export function distName(en) {
  const d = DISTRICTS.find(x => x[0] === en);
  if (!d) return en || "";
  return getLang() === "te" ? d[3] : d[0];
}
export function distLabel(en) {
  if (!en) return "";
  return getLang() === "te" ? `${distName(en)} జిల్లా` : `${distName(en)} district`;
}
export const placeLabel = (v) => [v.place, distName(v.district)].filter(Boolean).join(", ");

// ---------- సెర్చ్ / వాయిస్ పార్సర్ ----------
// "మక్తల్ దగ్గర 50 వేల లోపు స్ప్లెండర్ బైక్" →
//   { category:"bike", maxPrice:50000, terms:["makthal","splendor","bike"], rest:["makthal","splendor"], district:"" }
const TE = /[ఀ-౿]/;
const SUFFIXES = ["లోని", "లోపల", "దగ్గర", "లో", "కి", "కు", "ని", "ను"];
function lookup(tok) {
  if (VOICE_MAP[tok]) return VOICE_MAP[tok];
  for (const s of SUFFIXES) if (tok.length > s.length + 1 && tok.endsWith(s)) {
    const base = tok.slice(0, -s.length);
    if (VOICE_MAP[base]) return VOICE_MAP[base];
    const d = DISTRICTS.find(x => x[3] === base); if (d) return "dist:" + d[0];
  }
  return null;
}
export function parseQuery(text) {
  const out = { category: "", ev: false, district: "", minPrice: 0, maxPrice: 0, terms: [], rest: [], unknownTe: [] };
  let s = String(text || "").toLowerCase().replace(/(\d),(?=\d)/g, "$1").replace(/[,।?!₹]|\.(?!\d)/g, " ");
  // ధర: "50 వేల", "1.5 లక్షల", "50000", "50k", "2 lakh"
  const re = /(\d+(?:\.\d+)?)\s*(వేల|వేలు|వేయి|వెయ్యి|thousand|k|లక్షల|లక్షలు|లక్ష|lakhs?|l)?(?=\s|$)/g;
  const pm = [...s.matchAll(re)].find(m => m[2] || Number(m[1]) >= 1000);
  if (pm) {
    const unit = pm[2] || "";
    let amt = Number(pm[1]) * (/లక్ష|lakh|^l$/.test(unit) ? 100000 : unit ? 1000 : 1);
    if (/(పైన|పైగా|కంటే ఎక్కువ|above|over|more than)/.test(s)) out.minPrice = Math.round(amt);
    else out.maxPrice = Math.round(amt);
    s = s.replace(pm[0], " ").replace(/(లోపు|లోపల|కంటే తక్కువ|కంటే|తక్కువ|పైన|పైగా|ఎక్కువ|under|below|within|less than|above|over|more than|upto|up to)/g, " ");
  }
  // "జాన్ డీర్" లాంటి రెండు పదాల పేర్లు సరిగ్గా వస్తాయి (రెండూ నిఘంటువులో ఉన్నాయి)
  for (const tok of s.split(/\s+/).filter(Boolean)) {
    if (STOP_WORDS.has(tok)) continue;
    const dist = DISTRICTS.find(d => d[3] === tok || d[0].toLowerCase() === tok);
    const m = lookup(tok) || (dist ? "dist:" + dist[0] : null);
    if (m) {
      if (m.startsWith("cat:")) { out.category = m.slice(4); out.terms.push(m.slice(4)); }
      else if (m === "ev") { out.ev = true; out.terms.push("electric"); }
      else if (m.startsWith("dist:")) { out.district = m.slice(5); out.terms.push(m.slice(5).toLowerCase()); }
      else { out.terms.push(m); out.rest.push(m); }
    } else if (TE.test(tok)) {
      out.unknownTe.push(tok);
    } else if (tok.length > 1 && !/^\d+$/.test(tok)) {
      out.terms.push(tok); out.rest.push(tok);
    }
  }
  return out;
}
// ఒక వాహనంలో వెతికే టెక్స్ట్ (ఇంగ్లీష్ + తెలుగు పేర్లు)
export function haystack(v) {
  return `${v.brand} ${v.model} ${v.place} ${v.district} ${distName(v.district)} ${v.category} ${catLabel(v.category)} ${v.fuel} ${fuelLabel(v.fuel)}`.toLowerCase();
}

// ---------- సరైన ధర బ్యాడ్జ్ ----------
// అదే రకం + కంపెనీ + మోడల్, సంవత్సరం ±2 ఉన్న వాహనాల మధ్యస్థ (median) ధరతో పోల్చడం.
// కనీసం 3 పోలిక వాహనాలు ఉంటేనే చూపిస్తాం (లేకపోతే అంచనా తప్పు కావచ్చు).
const normModel = (s) => String(s || "").toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]/g, "");
export function priceVerdict(v, pool) {
  if (!v || !(v.price > 0) || !Array.isArray(pool)) return null;
  const m = normModel(v.model), b = String(v.brand || "").toLowerCase();
  const comps = pool.filter(x => x.id !== v.id && x.price > 0 && x.category === v.category &&
    String(x.brand || "").toLowerCase() === b &&
    Math.abs((x.year || 0) - (v.year || 0)) <= 2 &&
    (normModel(x.model) === m || (m.length > 3 && (normModel(x.model).includes(m) || m.includes(normModel(x.model))))));
  if (comps.length < 3) return null;
  const ps = comps.map(x => x.price).sort((a, c) => a - c);
  const mid = ps.length % 2 ? ps[(ps.length - 1) / 2] : (ps[ps.length / 2 - 1] + ps[ps.length / 2]) / 2;
  const r = v.price / mid, te = getLang() === "te";
  const note = te ? `ఇలాంటి ${comps.length} వాహనాల సాధారణ ధర ${fmtPrice(mid)} తో పోల్చి` : `Compared with ${comps.length} similar vehicles (typical ${fmtPrice(mid)})`;
  if (r < 0.6) return { key: "low", label: te ? "🚩 మార్కెట్ కంటే చాలా తక్కువ — జాగ్రత్త" : "🚩 Far below market — be careful", note, mid, n: comps.length };
  if (r <= 0.92) return { key: "good", label: te ? "✅ మంచి ధర" : "✅ Good price", note, mid, n: comps.length };
  if (r <= 1.12) return { key: "fair", label: te ? "👍 సరైన ధర" : "👍 Fair price", note, mid, n: comps.length };
  return { key: "high", label: te ? "⚠️ మార్కెట్ కంటే ఎక్కువ" : "⚠️ Above market", note, mid, n: comps.length };
}

// ---------- ఫార్మాట్ హెల్పర్స్ ----------
export function fmtPrice(n) {
  n = Number(n) || 0;
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2).replace(/\.?0+$/, "") + " Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(2).replace(/\.?0+$/, "") + " L";
  return "₹" + n.toLocaleString("en-IN");
}
export const fmtKm = (n) => (Number(n) || 0).toLocaleString("en-IN") + " " + t("km");
export function fmtDist(km) {
  if (km == null || isNaN(km)) return "";
  return (km < 1 ? "<1" : km < 10 ? km.toFixed(1) : Math.round(km)) + " " + t("km") + " " + t("away");
}
export function timeAgo(ms) {
  const d = Math.floor((Date.now() - ms) / 86400000);
  const te = getLang() === "te";
  if (d <= 0) return te ? "ఈ రోజు" : "today";
  if (d === 1) return te ? "నిన్న" : "yesterday";
  return te ? `${d} రోజుల క్రితం` : `${d} days ago`;
}
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// ---------- లిస్టింగ్ ఫీజు (UPI) ----------
export function listingFee(category) {
  const p = site.payment;
  if (!p || !p.enabled) return 0;
  return p.launchOffer ? p.launchPrice : (p.fees[category] ?? p.fees.other);
}
export function upiLink(amount, note) {
  const p = site.payment;
  return `upi://pay?pa=${p.upiId}&pn=${encodeURIComponent(p.payeeName)}&am=${Number(amount).toFixed(2)}&cu=INR&tn=${encodeURIComponent(note)}`;
}
// చెల్లింపు అవసరమా? (పాత లిస్టింగ్‌లకు payStatus ఉండదు → అవసరం లేదు)
export const needsPayment = (v) => v.payStatus === "unpaid";
export const isFeatured = (v) => (v.featuredUntil || 0) > Date.now();
export const isLive = (v) => v.status === "approved" && (!v.expiresAt || v.expiresAt > Date.now());
export const title = (v) => `${v.brand || ""} ${v.model || ""}`.trim();
export const waLink = (phone, text) => `https://wa.me/${String(phone).replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

export function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371, r = Math.PI / 180;
  const a = Math.sin((lat2 - lat1) * r / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin((lng2 - lng1) * r / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// ---------- లొకేషన్ ----------
export function savedLoc() {
  try { return JSON.parse(localStorage.getItem("vahan_loc") || "null"); } catch { return null; }
}
export function saveLoc(loc) {
  try { localStorage.setItem("vahan_loc", JSON.stringify(loc)); } catch {}
}
export function gps() {
  return new Promise((res, rej) => {
    if (!navigator.geolocation) return rej(new Error("no-gps"));
    navigator.geolocation.getCurrentPosition(
      p => res({ lat: p.coords.latitude, lng: p.coords.longitude, label: "GPS" }),
      e => rej(e), { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 });
  });
}

// ---------- UI ----------
export function toast(msg, ms = 2600) {
  let el = document.getElementById("toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; document.body.appendChild(el); }
  el.textContent = msg; el.className = "show";
  clearTimeout(el._t); el._t = setTimeout(() => (el.className = ""), ms);
}

export function renderHeader(active) {
  const h = document.getElementById("header");
  if (!h) return;
  const other = getLang() === "te" ? "EN" : "తె";
  h.innerHTML = `
    <div class="bar">
      <a class="logo" href="index.html"><span class="logo-mark">R</span><span>${site.name}</span></a>
      <nav>
        <a href="my.html" class="${active === "my" ? "on" : ""}" data-i18n="my"></a>
        <button class="lang" id="langBtn" aria-label="Language">${other}</button>
        <a href="sell.html" class="btn btn-sell" data-i18n="sell"></a>
      </nav>
    </div>`;
  document.getElementById("langBtn").onclick = () => setLang(getLang() === "te" ? "en" : "te");
  if (DEMO) {
    const b = document.createElement("div");
    b.className = "demo-bar"; b.textContent = t("demo");
    h.after(b);
  }
  applyI18n(h);
}

export function cardHTML(v, distKm, verdict) {
  const ph = (v.photos && v.photos[0]) || "";
  const ev = v.fuel === "electric";
  return `
  <a class="card" href="vehicle.html?id=${encodeURIComponent(v.id)}">
    <div class="thumb">${ph ? `<img src="${esc(ph)}" alt="${esc(title(v))}" loading="lazy">` : `<span class="noimg">${catIcon(v.category)}</span>`}
      ${isFeatured(v) ? `<span class="tag tag-feat">★ ${t("featured")}</span>` : ""}
      ${ev ? `<span class="tag tag-ev">⚡ EV</span>` : ""}
    </div>
    <div class="info">
      <div class="price">${fmtPrice(v.price)}${verdict && (verdict.key === "good" || verdict.key === "low") ? ` <span class="vtag v-${verdict.key}">${verdict.key === "good" ? (getLang() === "te" ? "మంచి ధర" : "Good price") : "🚩"}</span>` : ""}</div>
      <div class="name">${esc(title(v))}</div>
      <div class="meta">${esc(v.year || "")} · ${fmtKm(v.kmDriven)} · ${esc(fuelLabel(v.fuel))}${ev && v.ev?.batteryHealth ? ` · 🔋${esc(v.ev.batteryHealth)}%` : ""}</div>
      <div class="loc">📍 ${esc(v.place || distName(v.district) || "")}${distKm != null ? ` · ${fmtDist(distKm)}` : ""}</div>
    </div>
  </a>`;
}

// లాగిన్ అయిన యూజర్ కోసం వేచి ఉండడం
export function currentUser() {
  return new Promise(res => {
    if (DEMO) return res(null);
    const un = onAuthStateChanged(auth, u => { un(); res(u); });
  });
}
export async function isAdmin(user) {
  if (!user || DEMO) return false;
  try { return (await getDoc(doc(db, "admins", user.uid))).exists(); } catch { return false; }
}
