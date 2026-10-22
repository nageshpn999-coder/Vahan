// అమ్మే పేజీ: లాగిన్ (OTP) + 3 దశల అప్‌లోడ్ ఫారం + ఎడిట్
import * as geofire from "https://cdn.jsdelivr.net/npm/geofire-common@6.0.0/+esm";
import {
  DEMO, site, auth, db, fb, t, getLang, applyI18n, renderHeader, fmtPrice, currentUser, gps, toast, esc
} from "./common.js";
import { cloudinary } from "./config.js";
import { CATEGORIES, FUELS, BRANDS, DISTRICTS } from "./data.js";

const te = getLang() === "te";
const L = te ? {
  login: "మొబైల్ నంబర్‌తో లాగిన్ అవ్వండి", loginNote: "మీ నంబర్‌కు OTP వస్తుంది. కొనేవారు ఇదే నంబర్‌కు కాల్/WhatsApp చేస్తారు.",
  sendOtp: "OTP పంపండి", verify: "వెరిఫై చేయండి", newT: "మీ వాహనం అమ్మండి — ఉచితం", editT: "లిస్టింగ్ ఎడిట్ చేయండి",
  cat: "వాహనం రకం", brand: "బ్రాండ్", brandOther: "బ్రాండ్ పేరు", other: "ఇతర", model: "మోడల్", year: "సంవత్సరం",
  km: "నడిచిన కి.మీ.", kmTractor: "ట్రాక్టర్‌కు నడిచిన గంటలు (hours) రాయండి", fuel: "ఇంధనం",
  ev: "⚡ ఎలక్ట్రిక్ వాహన వివరాలు (కొనేవారికి చాలా ముఖ్యం)", evHealth: "బ్యాటరీ హెల్త్ %", evRange: "రేంజ్ (కి.మీ.)",
  evWarranty: "బ్యాటరీ వారంటీ మిగిలింది (నెలలు)", evCharge: "ఛార్జింగ్ సమయం (గంటలు)", evCharger: "ఛార్జర్ కూడా ఇస్తాను",
  owners: "ఎన్నో ఓనర్", trans: "గేర్", photos: "ఫోటోలు", photoHint: `కనీసం 1, గరిష్టం ${site.maxPhotos}. ముందు, వెనుక, పక్కల నుంచి, మీటర్ ఫోటో తీయండి.`,
  addPhoto: "+ ఫోటో", price: "ధర (₹)", nego: "బేరం ఉంది", loc: "వాహనం ఎక్కడ ఉంది?", gps: "📍 నా ప్రస్తుత లొకేషన్",
  dist: "జిల్లా ఎంచుకోండి", place: "ఊరు / ఏరియా పేరు", desc: "వివరణ (కండిషన్, సర్వీస్, ఇన్సూరెన్స్…)", name: "మీ పేరు",
  back: "← వెనక్కి", next: "తర్వాత →", submit: "✓ పోస్ట్ చేయండి", save: "✓ సేవ్ చేయండి",
  need: "దయచేసి ఈ వివరాలు నింపండి: ", needPhoto: "కనీసం ఒక ఫోటో పెట్టండి", needLoc: "లొకేషన్ ఎంచుకోండి",
  uploading: "ఫోటోలు అప్‌లోడ్ అవుతున్నాయి…", saving: "సేవ్ అవుతోంది…",
  done: "పోస్ట్ అయింది! అడ్మిన్ చెక్ చేసిన తర్వాత అందరికీ కనిపిస్తుంది.", limit: `మీకు ఇప్పటికే ${site.maxActivePerUser} యాక్టివ్ లిస్టింగ్‌లు ఉన్నాయి. ఎక్కువ కావాలంటే డీలర్ ప్లాన్ కోసం WhatsApp చేయండి.`,
  locOk: "✓ లొకేషన్ సెట్ అయింది", demo: "DEMO మోడ్: Firebase సెటప్ తర్వాత పోస్ట్ సేవ్ అవుతుంది."
} : {
  login: "Login with your mobile number", loginNote: "You'll get an OTP. Buyers will call/WhatsApp this number.",
  sendOtp: "Send OTP", verify: "Verify", newT: "Sell your vehicle — free", editT: "Edit listing",
  cat: "Vehicle type", brand: "Brand", brandOther: "Brand name", other: "Other", model: "Model", year: "Year",
  km: "KM driven", kmTractor: "For tractors, enter hours used", fuel: "Fuel",
  ev: "⚡ Electric vehicle details (very important to buyers)", evHealth: "Battery health %", evRange: "Range (km)",
  evWarranty: "Battery warranty left (months)", evCharge: "Charging time (hours)", evCharger: "Charger included",
  owners: "Owner no.", trans: "Transmission", photos: "Photos", photoHint: `Min 1, max ${site.maxPhotos}. Front, back, sides and meter.`,
  addPhoto: "+ Photo", price: "Price (₹)", nego: "Negotiable", loc: "Where is the vehicle?", gps: "📍 My current location",
  dist: "Choose district", place: "Town / area name", desc: "Description (condition, service, insurance…)", name: "Your name",
  back: "← Back", next: "Next →", submit: "✓ Post", save: "✓ Save",
  need: "Please fill: ", needPhoto: "Add at least one photo", needLoc: "Choose the location",
  uploading: "Uploading photos…", saving: "Saving…",
  done: "Posted! It will be visible after admin review.", limit: `You already have ${site.maxActivePerUser} active listings. WhatsApp us for a dealer plan.`,
  locOk: "✓ Location set", demo: "DEMO mode: posts are saved after Firebase setup."
};
const $ = (id) => document.getElementById(id);
const setText = (map) => Object.entries(map).forEach(([id, k]) => { const el = $(id); if (el) el.textContent = L[k]; });

renderHeader("sell");
applyI18n();

const editId = new URLSearchParams(location.search).get("id");
const f = { category: "", fuel: "petrol", photos: [], lat: null, lng: null, district: "" };
// photos: [{url}] పాతవి లేదా [{file, preview}] కొత్తవి
let step = 1, user = null, existing = null, confirmRes = null;

init();

async function init() {
  setText({
    loginTitle: "login", loginNote: "loginNote", otpBtn: "sendOtp", formTitle: editId ? "editT" : "newT",
    lblCat: "cat", lblBrand: "brand", lblBrandOther: "brandOther", lblModel: "model", lblYear: "year", lblKm: "km",
    lblFuel: "fuel", lblEv: "ev", lblEvHealth: "evHealth", lblEvRange: "evRange", lblEvWarranty: "evWarranty",
    lblEvCharge: "evCharge", lblEvCharger: "evCharger", lblOwners: "owners", lblTrans: "trans", lblPhotos: "photos",
    photoHint: "photoHint", lblPrice: "price", lblNego: "nego", lblLoc: "loc", locGps: "gps", lblPlace: "place",
    lblDesc: "desc", lblName: "name", backBtn: "back"
  });
  $("trans").options[0].textContent = t("manual");
  $("trans").options[1].textContent = t("automatic");

  if (DEMO) { $("sellBox").hidden = false; $("status").textContent = L.demo; return buildForm(); }

  user = await currentUser();
  if (!user) return showLogin();
  await startForm();
}

// ---------- OTP లాగిన్ ----------
function showLogin() {
  $("loginBox").hidden = false;
  const verifier = new fb.RecaptchaVerifier(auth, "recaptcha", { size: "invisible" });
  $("otpBtn").onclick = async () => {
    $("otpBtn").disabled = true;
    try {
      if (!confirmRes) {
        const n = $("phone").value.replace(/\D/g, "");
        if (!/^[6-9]\d{9}$/.test(n)) { toast(te ? "సరైన 10 అంకెల నంబర్ ఇవ్వండి" : "Enter a valid 10-digit number"); return; }
        confirmRes = await fb.signInWithPhoneNumber(auth, "+91" + n, verifier);
        $("otpField").hidden = false; $("phoneField").hidden = true; $("otpBtn").textContent = L.verify; $("otp").focus();
      } else {
        const r = await confirmRes.confirm($("otp").value.trim());
        user = r.user; $("loginBox").hidden = true; await startForm();
      }
    } catch (e) {
      console.error(e); toast((te ? "లోపం: " : "Error: ") + (e.code || e.message), 4000);
    } finally { $("otpBtn").disabled = false; }
  };
}

async function startForm() {
  $("sellBox").hidden = false;
  if (editId) {
    const s = await fb.getDoc(fb.doc(db, "vehicles", editId));
    if (!s.exists() || s.data().ownerUid !== user.uid) { $("sellBox").innerHTML = `<p class="err">${te ? "ఈ లిస్టింగ్ మీది కాదు." : "Not your listing."}</p>`; return; }
    existing = { id: s.id, ...s.data() };
  } else {
    // యాక్టివ్ లిస్టింగ్ పరిమితి
    const s = await fb.getDocs(fb.query(fb.collection(db, "vehicles"), fb.where("ownerUid", "==", user.uid)));
    const active = s.docs.map(d => d.data()).filter(v => ["pending", "approved"].includes(v.status) && (!v.expiresAt || v.expiresAt > Date.now()));
    if (active.length >= site.maxActivePerUser && !active.some(v => v.dealer)) {
      $("sellBox").innerHTML = `<p>${esc(L.limit)}</p><a class="btn btn-wa" href="https://wa.me/${site.adminWhatsApp}?text=${encodeURIComponent("Vahan dealer plan")}">💬 WhatsApp</a>`;
      return;
    }
  }
  buildForm();
}

// ---------- ఫారం ----------
function buildForm() {
  $("catPick").innerHTML = CATEGORIES.map(c => `<button type="button" data-v="${c.id}">${c.icon} ${c[getLang()]}</button>`).join("");
  $("catPick").onclick = (e) => { const b = e.target.closest("button"); if (b) { f.category = b.dataset.v; syncCat(); } };
  $("fuelPick").innerHTML = FUELS.map(x => `<button type="button" data-v="${x.id}">${x.id === "electric" ? "⚡ " : ""}${x[getLang()]}</button>`).join("");
  $("fuelPick").onclick = (e) => { const b = e.target.closest("button"); if (b) { f.fuel = b.dataset.v; syncFuel(); } };
  const y = new Date().getFullYear();
  $("year").innerHTML = Array.from({ length: 36 }, (_, i) => `<option>${y - i}</option>`).join("");
  $("brand").onchange = syncBrand;
  $("locDist").innerHTML = `<option value="">${L.dist}</option>` + DISTRICTS.map(([n]) => `<option>${n}</option>`).join("");
  $("locDist").onchange = (e) => {
    const d = DISTRICTS.find(x => x[0] === e.target.value); if (!d) return;
    f.district = d[0];
    if (!f.gps) { f.lat = d[1]; f.lng = d[2]; }
    $("locStatus").textContent = L.locOk + (f.gps ? " (GPS)" : ""); $("locStatus").className = "ok";
  };
  $("locGps").onclick = async () => {
    try {
      const p = await gps(); f.lat = p.lat; f.lng = p.lng; f.gps = true;
      $("locStatus").textContent = L.locOk + " (GPS)"; $("locStatus").className = "ok";
      if (!f.district) { // దగ్గరలోని జిల్లా ఆటోమేటిక్‌గా
        let best = null, bd = 1e9;
        for (const d of DISTRICTS) { const dd = (d[1] - p.lat) ** 2 + (d[2] - p.lng) ** 2; if (dd < bd) { bd = dd; best = d[0]; } }
        f.district = best; $("locDist").value = best;
      }
    } catch { toast(te ? "GPS అనుమతి ఇవ్వలేదు. జిల్లా ఎంచుకోండి." : "GPS not allowed. Choose a district."); }
  };
  $("price").oninput = () => { const n = Number($("price").value); $("priceWords").textContent = n ? fmtPrice(n) : ""; };
  $("fileIn").onchange = addFiles;
  $("backBtn").onclick = () => go(step - 1);
  $("nextBtn").onclick = () => (step < 3 ? (validate(step) && go(step + 1)) : submit());
  try { $("oname").value = localStorage.getItem("vahan_name") || ""; } catch {}

  if (existing) prefill(existing);
  syncCat(); syncFuel(); renderPhotos(); go(1);
}

function prefill(v) {
  f.category = v.category; f.fuel = v.fuel; f.lat = v.lat; f.lng = v.lng; f.district = v.district || ""; f.gps = true;
  f.photos = (v.photos || []).map(url => ({ url }));
  syncCat();
  const brands = Object.keys(BRANDS[v.category] || {});
  if (brands.includes(v.brand)) $("brand").value = v.brand; else { $("brand").value = "__other"; $("brandOther").value = v.brand || ""; }
  syncBrand();
  $("model").value = v.model || ""; $("year").value = v.year; $("km").value = v.kmDriven ?? "";
  $("owners").value = String(Math.min(4, v.owners || 1)); if (v.transmission) $("trans").value = v.transmission;
  if (v.ev) { $("evHealth").value = v.ev.batteryHealth ?? ""; $("evRange").value = v.ev.rangeKm ?? ""; $("evWarranty").value = v.ev.batteryWarrantyMonths ?? ""; $("evCharge").value = v.ev.chargeTimeHrs ?? ""; $("evCharger").checked = !!v.ev.chargerIncluded; }
  $("price").value = v.price; $("price").oninput(); $("nego").checked = !!v.negotiable;
  $("locDist").value = v.district || ""; $("place").value = v.place || ""; $("desc").value = v.description || ""; $("oname").value = v.ownerName || "";
  $("locStatus").textContent = L.locOk; $("locStatus").className = "ok";
}

function syncCat() {
  document.querySelectorAll("#catPick button").forEach(b => b.classList.toggle("on", b.dataset.v === f.category));
  const brands = Object.keys(BRANDS[f.category] || {});
  const cur = $("brand").value;
  $("brand").innerHTML = brands.map(b => `<option>${esc(b)}</option>`).join("") + `<option value="__other">${L.other}</option>`;
  if (brands.includes(cur)) $("brand").value = cur;
  else if (!brands.length) $("brand").value = "__other";
  $("transF").hidden = f.category !== "car";
  $("kmHint").textContent = f.category === "tractor" ? L.kmTractor : "";
  syncBrand();
}
function syncBrand() {
  const other = $("brand").value === "__other";
  $("brandOtherF").hidden = !other;
  const models = other ? [] : (BRANDS[f.category] || {})[$("brand").value] || [];
  $("modelList").innerHTML = models.map(m => `<option value="${esc(m)}">`).join("");
}
function syncFuel() {
  document.querySelectorAll("#fuelPick button").forEach(b => b.classList.toggle("on", b.dataset.v === f.fuel));
  $("evBox").hidden = f.fuel !== "electric";
}

function go(n) {
  step = Math.max(1, Math.min(3, n));
  document.querySelectorAll("[data-step]").forEach(s => (s.hidden = Number(s.dataset.step) !== step));
  document.querySelectorAll(".steps i").forEach((s, i) => s.classList.toggle("on", i < step));
  $("backBtn").style.visibility = step === 1 ? "hidden" : "visible";
  $("nextBtn").textContent = step < 3 ? L.next : (existing ? L.save : L.submit);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function validate(s) {
  const miss = [];
  if (s === 1) {
    if (!f.category) miss.push(L.cat);
    if ($("brand").value === "__other" && !$("brandOther").value.trim()) miss.push(L.brandOther);
    if (!$("model").value.trim()) miss.push(L.model);
    if ($("km").value === "") miss.push(L.km);
  }
  if (s === 2 && !f.photos.length) { toast(L.needPhoto); return false; }
  if (s === 3) {
    const p = Number($("price").value);
    if (!(p >= 1000)) miss.push(L.price);
    if (f.lat == null) { toast(L.needLoc); return false; }
    if (!$("oname").value.trim()) miss.push(L.name);
  }
  if (miss.length) { toast(L.need + miss.join(", "), 3500); return false; }
  return true;
}

// ---------- ఫోటోలు ----------
async function addFiles(e) {
  const files = [...e.target.files].slice(0, site.maxPhotos - f.photos.length);
  for (const file of files) {
    try { const blob = await compress(file); f.photos.push({ file: blob, preview: URL.createObjectURL(blob) }); }
    catch { toast((te ? "ఫోటో చదవలేకపోయాం: " : "Could not read photo: ") + file.name); }
  }
  e.target.value = ""; renderPhotos();
}
function renderPhotos() {
  $("photos").innerHTML = f.photos.map((p, i) => `<div class="ph"><img src="${esc(p.url || p.preview)}" alt=""><button type="button" data-del="${i}" aria-label="Remove">×</button></div>`).join("") +
    (f.photos.length < site.maxPhotos ? `<div class="add" id="addPh">📷<br>${L.addPhoto}</div>` : "");
  $("photos").onclick = (e) => {
    if (e.target.dataset.del) { f.photos.splice(Number(e.target.dataset.del), 1); renderPhotos(); }
    else if (e.target.closest("#addPh")) $("fileIn").click();
  };
}
// పెద్ద ఫోటోలను 1280px కి తగ్గించి JPEG గా మార్చడం (వేగంగా లోడ్ అవుతాయి)
function compress(file, max = 1280, q = 0.75) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      c.toBlob(b => (b ? res(b) : rej(new Error("blob"))), "image/jpeg", q);
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}
async function uploadPhoto(blob) {
  if (cloudinary.cloudName.startsWith("YOUR_")) throw new Error("Cloudinary config missing (js/config.js)");
  const fd = new FormData();
  fd.append("file", blob); fd.append("upload_preset", cloudinary.uploadPreset); fd.append("folder", "vahan");
  const r = await fetch(`https://api.cloudinary.com/v1_1/${cloudinary.cloudName}/image/upload`, { method: "POST", body: fd });
  if (!r.ok) throw new Error("Photo upload failed (" + r.status + ")");
  return (await r.json()).secure_url;
}

// ---------- సబ్మిట్ ----------
async function submit() {
  if (![1, 2, 3].every(s => validate(s))) return;
  if (DEMO) return toast(L.demo, 3500);
  $("nextBtn").disabled = true; $("backBtn").disabled = true;
  try {
    $("status").textContent = L.uploading;
    const urls = [];
    for (const p of f.photos) urls.push(p.url || await uploadPhoto(p.file));
    $("status").textContent = L.saving;

    const name = $("oname").value.trim();
    try { localStorage.setItem("vahan_name", name); } catch {}
    const brand = $("brand").value === "__other" ? $("brandOther").value.trim() : $("brand").value;
    const data = {
      category: f.category, brand, model: $("model").value.trim(), year: Number($("year").value),
      kmDriven: Number($("km").value) || 0, fuel: f.fuel, owners: Number($("owners").value) || 1,
      transmission: f.category === "car" ? $("trans").value : null,
      ev: f.fuel === "electric" ? {
        batteryHealth: Number($("evHealth").value) || null, rangeKm: Number($("evRange").value) || null,
        batteryWarrantyMonths: Number($("evWarranty").value) || 0, chargeTimeHrs: Number($("evCharge").value) || null,
        chargerIncluded: $("evCharger").checked
      } : null,
      price: Number($("price").value), negotiable: $("nego").checked,
      description: $("desc").value.trim(), ownerName: name,
      photos: urls, lat: f.lat, lng: f.lng, geohash: geofire.geohashForLocation([f.lat, f.lng]),
      place: $("place").value.trim(), district: f.district || "",
      status: "pending", updatedAt: Date.now()
    };

    if (existing) {
      await fb.updateDoc(fb.doc(db, "vehicles", existing.id), data);
      toast(te ? "సేవ్ అయింది. మళ్లీ అడ్మిన్ చెక్ చేస్తారు." : "Saved. It will be reviewed again.");
    } else {
      const now = Date.now();
      Object.assign(data, {
        ownerUid: user.uid, ownerPhone: user.phoneNumber, createdAt: now,
        expiresAt: now + site.listingDays * 86400000, views: 0
      });
      await fb.addDoc(fb.collection(db, "vehicles"), data);
      toast(L.done, 4000);
    }
    setTimeout(() => (location.href = "my.html"), 1500);
  } catch (e) {
    console.error(e);
    $("status").textContent = (te ? "లోపం: " : "Error: ") + (e.code || e.message);
    $("status").className = "err";
    $("nextBtn").disabled = false; $("backBtn").disabled = false;
  }
}
