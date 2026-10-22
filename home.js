// హోమ్ పేజీ: దగ్గరలోని వాహనాల సెర్చ్
import * as geofire from "https://cdn.jsdelivr.net/npm/geofire-common@6.0.0/+esm";
import {
  DEMO, db, fb, t, getLang, applyI18n, renderHeader, cardHTML, catLabel, fuelLabel,
  haversine, isFeatured, isLive, savedLoc, saveLoc, gps, toast, distLabel, distName
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
  let list = raw.filter(isLive).map(v => ({ v, d: L && v.lat != null ? haversine(L.lat, L.lng, v.lat, v.lng) : null }));
  list = list.filter(({ v, d }) => {
    if (state.radius && d != null && d > state.radius) return false;
    if (state.category && v.category !== state.category) return false;
    if (state.evOnly && v.fuel !== "electric") return false;
    if (state.fuel && v.fuel !== state.fuel) return false;
    if (state.yearFrom && (v.year || 0) < state.yearFrom) return false;
    if (state.minPrice && v.price < state.minPrice) return false;
    if (state.maxPrice && v.price > state.maxPrice) return false;
    if (state.q) {
      const hay = `${v.brand} ${v.model} ${v.place} ${v.district} ${distName(v.district)} ${catLabel(v.category)} ${fuelLabel(v.fuel)}`.toLowerCase();
      if (!state.q.split(/\s+/).every(w => hay.includes(w))) return false;
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
  $("grid").innerHTML = list.slice(0, state.shown).map(({ v, d }) => cardHTML(v, d)).join("");
  $("empty").hidden = list.length > 0;
  $("empty").textContent = t("noResults");
  $("moreBtn").hidden = list.length <= state.shown;
}
