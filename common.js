// అన్ని పేజీలు వాడే కామన్ కోడ్: Firebase, భాష, హెల్పర్స్
import { firebaseConfig, site, DEMO } from "./config.js";
import { CATEGORIES, FUELS, DISTRICTS } from "./data.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber, signOut
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
  onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber, signOut,
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
    whatsapp: "WhatsApp", call: "కాల్ చేయండి", share: "షేర్", report: "రిపోర్ట్",
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
      <a class="logo" href="index.html"><span class="logo-mark">V</span><span>${site.name}</span></a>
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

export function cardHTML(v, distKm) {
  const ph = (v.photos && v.photos[0]) || "";
  const ev = v.fuel === "electric";
  return `
  <a class="card" href="vehicle.html?id=${encodeURIComponent(v.id)}">
    <div class="thumb">${ph ? `<img src="${esc(ph)}" alt="${esc(title(v))}" loading="lazy">` : `<span class="noimg">${catIcon(v.category)}</span>`}
      ${isFeatured(v) ? `<span class="tag tag-feat">★ ${t("featured")}</span>` : ""}
      ${ev ? `<span class="tag tag-ev">⚡ EV</span>` : ""}
    </div>
    <div class="info">
      <div class="price">${fmtPrice(v.price)}</div>
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
