// వాహనం వివరాల పేజీ
import {
  DEMO, db, fb, t, getLang, applyI18n, renderHeader, esc, fmtPrice, fmtKm, fmtDist, timeAgo,
  catLabel, fuelLabel, title, waLink, haversine, savedLoc, isLive, currentUser, toast, placeLabel, priceVerdict
} from "./common.js";
import { SAMPLE } from "./data.js";
import { sharePoster } from "./poster.js";

renderHeader();
applyI18n();
const main = document.getElementById("main");
const id = new URLSearchParams(location.search).get("id");
const te = getLang() === "te";

load();

async function load() {
  if (!id) return notFound();
  let v = null;
  try {
    if (DEMO) v = SAMPLE.find(x => x.id === id) || null;
    else {
      const s = await fb.getDoc(fb.doc(db, "vehicles", id));
      if (s.exists()) v = { id: s.id, ...s.data() };
    }
  } catch (e) { console.error(e); }
  if (!v) return notFound();

  const user = await currentUser();
  const isOwner = user && user.uid === v.ownerUid;
  if (!isLive(v) && !isOwner) return notFound(v.status === "sold" ? (te ? "ఈ వాహనం అమ్ముడైపోయింది." : "This vehicle is sold.") : null);

  render(v, isOwner);
  showVerdict(v);

  // వ్యూస్ లెక్క (ఓనర్ కాకపోతే, ఒక సెషన్‌కు ఒకసారి)
  if (!DEMO && !isOwner && isLive(v)) {
    try {
      const k = "seen_" + id;
      if (!sessionStorage.getItem(k)) {
        sessionStorage.setItem(k, "1");
        await fb.updateDoc(fb.doc(db, "vehicles", id), { views: fb.increment(1) });
      }
    } catch {}
  }
}

// సరైన ధర బ్యాడ్జ్: అదే కంపెనీ వాహనాలను తెచ్చి పోల్చడం
async function showVerdict(v) {
  let pool = [];
  try {
    if (DEMO) pool = SAMPLE;
    else {
      const s = await fb.getDocs(fb.query(fb.collection(db, "vehicles"),
        fb.where("status", "==", "approved"), fb.where("brand", "==", v.brand), fb.limit(100)));
      pool = s.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (e) { console.warn(e); return; }
  const r = priceVerdict(v, pool);
  const box = document.getElementById("verdict");
  if (!r || !box) return;
  box.className = `verdict v-${r.key}`;
  box.innerHTML = `<b>${r.label}</b><span>${esc(r.note)}</span>`;
  box.hidden = false;
}

function notFound(msg) {
  main.innerHTML = `<div class="empty"><p>${esc(msg || (te ? "ఈ వాహనం దొరకలేదు లేదా తొలగించబడింది." : "Vehicle not found or removed."))}</p>
    <a class="btn" href="index.html">${t("home")}</a></div>`;
}

function render(v, isOwner) {
  const name = title(v);
  document.title = `${name} ${v.year || ""} — ${fmtPrice(v.price)} | Vahan`;
  const L = savedLoc();
  const dist = L && v.lat != null ? haversine(L.lat, L.lng, v.lat, v.lng) : null;
  const photos = v.photos || [];
  const ev = v.fuel === "electric" && v.ev ? v.ev : null;
  const statusNote = !isLive(v) ? `<div class="safety">${te ? "స్థితి" : "Status"}: <b>${esc(v.status)}</b> — ${te ? "ఇది ఇంకా పబ్లిక్‌గా కనిపించడం లేదు." : "not visible to the public yet."}</div>` : "";

  const spec = (k, val) => val === undefined || val === null || val === "" ? "" : `<div><span>${t(k)}</span><b>${esc(val)}</b></div>`;

  main.innerHTML = `
    ${statusNote}
    <div class="gallery" id="gal">
      ${photos.length ? `<img id="gimg" src="${esc(photos[0])}" alt="${esc(name)}">` : `<div style="height:100%;display:grid;place-items:center;font-size:60px">🚘</div>`}
      ${photos.length > 1 ? `<button class="gnav gprev" id="gprev" aria-label="Previous">‹</button><button class="gnav gnext" id="gnext" aria-label="Next">›</button><span class="gcount" id="gcount">1/${photos.length}</span>` : ""}
    </div>
    ${photos.length > 1 ? `<div class="thumbs" id="thumbs">${photos.map((p, i) => `<img src="${esc(p)}" data-i="${i}" class="${i ? "" : "on"}" alt="">`).join("")}</div>` : ""}

    <div class="panel">
      <div class="dprice">${fmtPrice(v.price)} <span class="note">${v.negotiable ? t("negotiable") : t("fixed")}</span></div>
      <div class="dtitle">${esc(name)}</div>
      <div id="verdict" hidden></div>
      <div class="note">📍 ${esc(placeLabel(v))}${dist != null ? " · " + fmtDist(dist) : ""} · ${t("posted")} ${timeAgo(v.createdAt)} · 👁 ${v.views || 0}</div>
      <div class="specs" style="margin-top:12px">
        ${spec("year", v.year)}
        ${spec("kmDriven", v.kmDriven != null ? fmtKm(v.kmDriven) : "")}
        <div><span>${t("fuel")}</span><b>${esc(fuelLabel(v.fuel))}</b></div>
        <div><span>${te ? "రకం" : "Type"}</span><b>${esc(catLabel(v.category))}</b></div>
        ${spec("owners", v.owners)}
        ${v.transmission ? spec("transmission", t(v.transmission)) : ""}
      </div>
    </div>

    ${ev ? `
    <div class="panel ev-panel">
      <h3>${t("evDetails")}</h3>
      ${ev.batteryHealth ? `<div class="note">${t("batteryHealth")}: <b>${esc(ev.batteryHealth)}%</b></div><div class="battery"><i style="width:${Math.min(100, Number(ev.batteryHealth) || 0)}%"></i></div>` : ""}
      <div class="specs">
        ${spec("range", ev.rangeKm ? ev.rangeKm + " " + t("km") : "")}
        ${spec("chargeTime", ev.chargeTimeHrs)}
        ${spec("batteryWarranty", ev.batteryWarrantyMonths)}
        ${spec("chargerIncluded", ev.chargerIncluded ? t("yes") : t("no"))}
      </div>
    </div>` : ""}

    ${v.description ? `<div class="panel"><h3>${t("description")}</h3><div class="desc">${esc(v.description)}</div></div>` : ""}

    <div class="panel">
      <h3>${t("seller")}</h3>
      <div>${esc(v.ownerName || "")} ${v.dealer ? `<span class="badge b-approved">✓ ${te ? "డీలర్" : "Dealer"}</span>` : ""}</div>
      <div class="subactions" style="flex-wrap:wrap">
        <button class="btn btn-wa btn-sm" id="posterBtn">📲 ${te ? "WhatsApp పోస్టర్" : "WhatsApp poster"}</button>
        <a class="btn btn-ghost btn-sm" href="agreement.html?id=${encodeURIComponent(v.id)}">📄 ${te ? "అమ్మకపు ఒప్పందం" : "Sale agreement"}</a>
        <button class="btn btn-ghost btn-sm" id="shareBtn">🔗 ${t("share")}</button>
        <button class="btn btn-ghost btn-sm" id="reportBtn">⚑ ${t("report")}</button>
        ${isOwner ? `<a class="btn btn-ghost btn-sm" href="sell.html?id=${encodeURIComponent(v.id)}">✎ ${te ? "ఎడిట్" : "Edit"}</a>` : ""}
      </div>
      <div class="safety">⚠️ ${t("safety")}</div>
    </div>

    <div class="actions">
      <a class="btn btn-wa" target="_blank" rel="noopener" href="${waLink(v.ownerPhone, `${te ? "నమస్తే, Vahan లో మీ" : "Hi, I saw your"} ${name} (${fmtPrice(v.price)}) ${te ? "చూశాను. ఇంకా అందుబాటులో ఉందా?" : "on Vahan. Is it still available?"} ${location.href}`)}">💬 ${t("whatsapp")}</a>
      <a class="btn" href="tel:${esc(v.ownerPhone)}">📞 ${t("call")}</a>
    </div>`;

  // గ్యాలరీ
  if (photos.length > 1) {
    let i = 0;
    const show = (n) => {
      i = (n + photos.length) % photos.length;
      document.getElementById("gimg").src = photos[i];
      document.getElementById("gcount").textContent = `${i + 1}/${photos.length}`;
      document.querySelectorAll("#thumbs img").forEach((im, j) => im.classList.toggle("on", j === i));
    };
    document.getElementById("gprev").onclick = () => show(i - 1);
    document.getElementById("gnext").onclick = () => show(i + 1);
    document.getElementById("thumbs").onclick = (e) => { if (e.target.dataset.i) show(Number(e.target.dataset.i)); };
    let x0 = null;
    const g = document.getElementById("gal");
    g.addEventListener("touchstart", e => (x0 = e.touches[0].clientX), { passive: true });
    g.addEventListener("touchend", e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1)); x0 = null; });
  }

  document.getElementById("posterBtn").onclick = () => sharePoster(v, location.href);

  document.getElementById("shareBtn").onclick = async () => {
    const data = { title: name, text: `${name} — ${fmtPrice(v.price)} | Vahan`, url: location.href };
    try { if (navigator.share) await navigator.share(data); else { await navigator.clipboard.writeText(location.href); toast(te ? "లింక్ కాపీ అయింది" : "Link copied"); } } catch {}
  };

  document.getElementById("reportBtn").onclick = async () => {
    const reason = prompt(te ? "సమస్య ఏమిటి? (మోసం / తప్పు సమాచారం / అమ్ముడైపోయింది / ఇతర)" : "What's wrong? (fraud / wrong info / already sold / other)");
    if (!reason) return;
    if (DEMO) return toast(te ? "DEMO: రిపోర్ట్ సేవ్ కాదు" : "DEMO: report not saved");
    try {
      await fb.addDoc(fb.collection(db, "reports"), { vehicleId: v.id, reason: reason.slice(0, 300), createdAt: Date.now(), status: "open" });
      toast(te ? "ధన్యవాదాలు! అడ్మిన్ చెక్ చేస్తారు." : "Thanks! Admin will review.");
    } catch (e) { toast("Error: " + (e.code || e.message)); }
  };
}
