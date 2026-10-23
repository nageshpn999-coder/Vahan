// హోమ్ పేజీ: దగ్గరలోని వాహనాల సెర్చ్
import * as geofire from "https://cdn.jsdelivr.net/npm/geofire-common@6.0.0/+esm";
import {
  DEMO, db, fb, t, getLang, applyI18n, renderHeader, cardHTML, catLabel, fuelLabel,
  haversine, isFeatured, isLive, savedLoc, saveLoc, gps, toast, distLabel, distName,
  parseQuery, haystack, priceVerdict, fmtPrice
} from "./common.js";
import { CATEGORIES, FUELS, DISTRICTS, SAMPLE } from "./data.js";

const PAGE = 20;
const RADII = [5, 10, 25, 50, 100, 0]; // 0 = తెలంగాణ మొత్తం
const $ = (id) => document.getElementById(id);

const state = {
  loc: savedLoc(),
  radius: savedLoc() ? 25 : 0,
  category: new URLSearchParams(location.search).get("cat") || "",
  q: "", fuel: "", yearFrom: 0, minPrice: 0, maxPrice: 0, evOnly: false,
  sort: "near", shown: PAGE
};
let raw = [];        // సర్వర్ నుంచి వచ్చిన వాహనాలు
let rawKey = "";     // ఏ లొకేషన్/దూరం కోసం తెచ్చామో

renderHeader("home");
applyI18n();
buildControls();
refresh();

function buildControls() {
  // దూరం చిప్స్
  $("radiusRow").innerHTML = `<span class="locname">${t("within")}:</span>` + RADII.map(r =>
    `<button class="chip" data-r="${r}">${r ? r + " " + t("km") : t("allTelangana")}</button>`).join("");
  $("radiusRow").onclick = (e) => {
    const b = e.target.closest("[data-r]"); if (!b) return;
    const r = Number(b.dataset.r);
    if (r && !state.loc) { toast(getLang() === "te" ? "ముందుగా లొకేషన్ ఎంచుకోండి" : "Choose a location first"); return; }
    state.radius = r; refresh();
  };

  // జిల్లాలు
  $("districtSel").innerHTML = `<option value="">${t("chooseDistrict")}</option>` +
    DISTRICTS.map(([n]) => `<option value="${n}">${distLabel(n)}</option>`).join("");
  $("districtSel").onchange = (e) => {
    const d = DISTRICTS.find(x => x[0] === e.target.value); if (!d) return;
    setLoc({ lat: d[1], lng: d[2], label: d[0] });
  };
  $("gpsBtn").onclick = async () => {
    $("gpsBtn").textContent = t("loading");
    try { setLoc(await gps()); }
    catch { toast(getLang() === "te" ? "GPS అనుమతి ఇవ్వలేదు. జిల్లా ఎంచుకోండి." : "GPS not allowed. Choose a district."); }
    $("gpsBtn").textContent = t("useGps");
  };

  // కేటగిరీలు
  $("cats").innerHTML = `<button class="cat" data-c=""><span class="ic">🔎</span>${t("all")}</button>` +
    CATEGORIES.map(c => `<button class="cat" data-c="${c.id}"><span class="ic">${c.icon}</span>${c[getLang()]}</button>`).join("");
  $("cats").onclick = (e) => {
    const b = e.target.closest("[data-c]"); if (!b) return;
    state.category = b.dataset.c; state.shown = PAGE; render();
  };

  // ఫిల్టర్లు
  $("fFuel").innerHTML = `<option value="">${t("all")}</option>` + FUELS.map(f => `<option value="${f.id}">${f[getLang()]}</option>`).join("");
  $("filterBtn").onclick = () => $("filters").classList.toggle("open");
  $("fApply").onclick = () => {
    state.fuel = $("fFuel").value; state.yearFrom = Number($("fYear").value) || 0;
    state.minPrice = Number($("fMin").value) || 0; state.maxPrice = Number($("fMax").value) || 0;
    state.shown = PAGE; render(); $("filters").classList.remove("open");
  };
  $("fReset").onclick = () => {
    ["fFuel", "fYear", "fMin", "fMax"].forEach(id => ($(id).value = ""));
    Object.assign(state, { fuel: "", yearFrom: 0, minPrice: 0, maxPrice: 0, evOnly: false });
    state.shown = PAGE; render();
  };
  $("evBtn").onclick = () => { state.evOnly = !state.evOnly; state.shown = PAGE; render(); };

  // సార్ట్
  $("sortSel").innerHTML = [["near", "sortNear"], ["new", "sortNew"], ["low", "sortLow"], ["high", "sortHigh"]]
    .map(([v, k]) => `<option value="${v}">${t(k)}</option>`).join("");
  $("sortSel").onchange = (e) => { state.sort = e.target.value; render(); };

  // సెర్చ్ (టైప్ చేస్తుంటే)
  let tm; $("q").oninput = (e) => { clearTimeout(tm); tm = setTimeout(() => { state.q = e.target.value.trim().toLowerCase(); state.shown = PAGE; render(); }, 250); };
  $("moreBtn").onclick = () => { state.shown += PAGE; render(); };
  setupVoice();
}

// ---------- 🎤 తెలుగు వాయిస్ సెర్చ్ ----------
function setupVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const btn = $("micBtn");
  if (!SR) { btn.hidden = true; return; }
  const te = getLang() === "te";
  let rec = null;
  btn.onclick = () => {
    if (rec) { rec.stop(); return; }
    rec = new SR();
    rec.lang = te ? "te-IN" : "en-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    btn.classList.add("listening");
    $("q").placeholder = te ? "🎤 చెప్పండి… ఉదా: మక్తల్ దగ్గర 50 వేల లోపు బైక్" : "🎤 Speak… e.g. bike under 50 thousand near Makthal";
    rec.onresult = (e) => applyVoice(e.results[0][0].transcript);
    rec.onerror = (e) => {
      if (e.error === "not-allowed") toast(te ? "మైక్ అనుమతి ఇవ్వండి (బ్రౌజర్ సెట్టింగ్స్)" : "Allow microphone in browser settings", 3500);
      else if (e.error === "no-speech") toast(te ? "ఏమీ వినిపించలేదు, మళ్లీ ప్రయత్నించండి" : "Didn't hear anything, try again");
      else toast((te ? "వాయిస్ లోపం: " : "Voice error: ") + e.error);
    };
    rec.onend = () => { btn.classList.remove("listening"); rec = null; $("q").placeholder = t("searchPh"); };
    try { rec.start(); } catch { rec = null; btn.classList.remove("listening"); }
  };
}

export function applyVoice(text) {
  const te = getLang() === "te";
  const p = parseQuery(text);
  // అర్థమైన వాటిని ఫిల్టర్లుగా పెట్టడం
  state.category = p.category || "";
  state.evOnly = p.ev;
  state.minPrice = p.minPrice; state.maxPrice = p.maxPrice;
  $("fMin").value = p.minPrice || ""; $("fMax").value = p.maxPrice || "";
  state.q = p.rest.join(" ");
  $("q").value = text;
  state.shown = PAGE;
  const parts = [];
  if (p.category) parts.push(catLabel(p.category));
  if (p.ev) parts.push("⚡ EV");
  if (p.rest.length) parts.push(p.rest.join(" "));
  if (p.maxPrice) parts.push(`${fmtPrice(p.maxPrice)} ${te ? "లోపు" : "max"}`);
  if (p.minPrice) parts.push(`${fmtPrice(p.minPrice)} ${te ? "పైన" : "min"}`);
  if (p.district) parts.push(distLabel(p.district));
  toast((te ? "🎤 అర్థమైంది: " : "🎤 Understood: ") + (parts.join(" · ") || text), 3500);
  if (p.district) {
    const d = DISTRICTS.find(x => x[0] === p.district);
    state.loc = { lat: d[1], lng: d[2], label: d[0] }; saveLoc(state.loc);
    state.radius = 50;
    refresh();
  } else render();
}

function setLoc(loc) {
  state.loc = loc; saveLoc(loc);
  if (!state.radius) state.radius = 25;
  refresh();
}

async function refresh() {
  const key = `${state.radius}|${state.loc ? state.loc.lat.toFixed(3) + "," + state.loc.lng.toFixed(3) : "-"}`;
  if (key !== rawKey) {
    $("grid").innerHTML = ""; $("count").textContent = t("loading");
    try { raw = await fetchVehicles(); rawKey = key; }
    catch (e) { console.error(e); raw = []; toast("Error: " + (e.code || e.message)); }
  }
  state.shown = PAGE;
  render();
}

async function fetchVehicles() {
  if (DEMO) return SAMPLE.slice();
  const col = fb.collection(db, "vehicles");
  if (state.radius && state.loc) {
    // geohash పరిధుల్లో వెతకడం — దగ్గరలోనివి మాత్రమే, వేగంగా
    const bounds = geofire.geohashQueryBounds([state.loc.lat, state.loc.lng], state.radius * 1000);
    const snaps = await Promise.all(bounds.map(b => fb.getDocs(fb.query(col,
      fb.where("status", "==", "approved"), fb.orderBy("geohash"), fb.startAt(b[0]), fb.endAt(b[1]), fb.limit(300)))));
    const map = new Map();
    snaps.forEach(s => s.forEach(d => map.set(d.id, { id: d.id, ...d.data() })));
    return [...map.values()];
  }
  const s = await fb.getDocs(fb.query(col, fb.where("status", "==", "approved"), fb.orderBy("createdAt", "desc"), fb.limit(300)));
  return s.docs.map(d => ({ id: d.id, ...d.data() }));
}

function render() {
  // UI స్టేట్
  document.querySelectorAll("#radiusRow [data-r]").forEach(b => b.classList.toggle("on", Number(b.dataset.r) === state.radius));
  document.querySelectorAll("#cats [data-c]").forEach(b => b.classList.toggle("on", b.dataset.c === state.category));
  $("evBtn").classList.toggle("on", state.evOnly);
  $("locName").textContent = state.loc ? "📍 " + (state.loc.label === "GPS" ? t("useGps").replace("📍 ", "") : distLabel(state.loc.label)) : "";
  if (state.loc && state.loc.label !== "GPS") $("districtSel").value = state.loc.label;

  // ఫిల్టర్ + దూరం
  const L = state.loc;
  // టైప్ చేసిన పదాలు: తెలుగు పేర్లను ఇంగ్లీష్‌లోకి మార్చి వెతకడం ("స్ప్లెండర్" → "splendor")
  const pq = state.q ? parseQuery(state.q) : null;
  const qWords = pq ? [...pq.terms, ...pq.unknownTe] : [];
  let list = raw.filter(isLive).map(v => ({ v, d: L && v.lat != null ? haversine(L.lat, L.lng, v.lat, v.lng) : null }));
  list = list.filter(({ v, d }) => {
    if (state.radius && d != null && d > state.radius) return false;
    if (state.category && v.category !== state.category) return false;
    if (state.evOnly && v.fuel !== "electric") return false;
    if (state.fuel && v.fuel !== state.fuel) return false;
    if (state.yearFrom && (v.year || 0) < state.yearFrom) return false;
    if (state.minPrice && v.price < state.minPrice) return false;
    if (state.maxPrice && v.price > state.maxPrice) return false;
    if (qWords.length) {
      const hay = haystack(v);
      if (!qWords.every(w => hay.includes(w))) return false;
    }
    return true;
  });

  const cmp = {
    near: (a, b) => (a.d ?? 1e9) - (b.d ?? 1e9) || b.v.createdAt - a.v.createdAt,
    new: (a, b) => b.v.createdAt - a.v.createdAt,
    low: (a, b) => a.v.price - b.v.price,
    high: (a, b) => b.v.price - a.v.price
  }[state.sort];
  // ఫీచర్డ్ వాహనాలు ఎప్పుడూ ముందు
  list.sort((a, b) => (isFeatured(b.v) - isFeatured(a.v)) || cmp(a, b));

  $("count").textContent = `${list.length} ${t("results")}`;
  const pool = raw.filter(isLive);
  $("grid").innerHTML = list.slice(0, state.shown).map(({ v, d }) => cardHTML(v, d, priceVerdict(v, pool))).join("");
  $("empty").hidden = list.length > 0;
  $("empty").textContent = t("noResults");
  $("moreBtn").hidden = list.length <= state.shown;
}
