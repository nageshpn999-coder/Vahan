// అడ్మిన్ ప్యానెల్: అప్రూవ్/రిజెక్ట్, ఫీచర్డ్, డీలర్, రిపోర్ట్‌లు
import {
  DEMO, site, db, fb, getLang, applyI18n, renderHeader, esc, fmtPrice, title, timeAgo,
  isFeatured, currentUser, isAdmin, toast, catLabel, fuelLabel, catIcon
} from "./common.js";

const te = getLang() === "te";
const $ = (id) => document.getElementById(id);
renderHeader();
applyI18n();

const TABS = te
  ? [["pending", "చెక్ చేయాల్సినవి"], ["approved", "లైవ్"], ["reports", "రిపోర్ట్‌లు"], ["other", "అమ్ముడైనవి/తిరస్కరించినవి"]]
  : [["pending", "To review"], ["approved", "Live"], ["reports", "Reports"], ["other", "Sold/Rejected"]];
let tab = "pending", data = { pending: [], approved: [], reports: [], other: [] };

init();
async function init() {
  if (DEMO) { $("gate").innerHTML = `<p class="empty">DEMO mode — Firebase సెటప్ చేయండి (SETUP.md).</p>`; return; }
  const user = await currentUser();
  if (!user) { $("gate").innerHTML = `<div class="empty"><a class="btn" href="sell.html">Login</a></div>`; return; }
  if (!(await isAdmin(user))) {
    $("gate").innerHTML = `<div class="empty"><p>${te ? "మీకు అడ్మిన్ అనుమతి లేదు." : "You are not an admin."}</p><p class="note">UID: <code>${esc(user.uid)}</code></p></div>`;
    return;
  }
  $("gate").hidden = true; $("panel").hidden = false;
  $("tabs").onclick = (e) => { const b = e.target.closest("[data-t]"); if (b) { tab = b.dataset.t; render(); } };
  await load();
}

async function load() {
  const col = fb.collection(db, "vehicles");
  const [p, a, s, r, rep] = await Promise.all([
    fb.getDocs(fb.query(col, fb.where("status", "==", "pending"))),
    fb.getDocs(fb.query(col, fb.where("status", "==", "approved"), fb.orderBy("createdAt", "desc"), fb.limit(300))),
    fb.getDocs(fb.query(col, fb.where("status", "==", "sold"), fb.limit(100))),
    fb.getDocs(fb.query(col, fb.where("status", "==", "rejected"), fb.limit(100))),
    fb.getDocs(fb.collection(db, "reports"))
  ]);
  const m = (snap) => snap.docs.map(d => ({ id: d.id, ...d.data() }));
  data.pending = m(p).sort((x, y) => x.createdAt - y.createdAt);
  data.approved = m(a);
  data.other = [...m(s), ...m(r)].sort((x, y) => (y.updatedAt || 0) - (x.updatedAt || 0));
  data.reports = m(rep).filter(x => x.status === "open").sort((x, y) => y.createdAt - x.createdAt);
  render();
}

function render() {
  const live = data.approved.filter(v => !v.expiresAt || v.expiresAt > Date.now());
  const stat = (n, l) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`;
  $("stats").innerHTML =
    stat(data.pending.length, te ? "చెక్ చేయాలి" : "To review") +
    stat(live.length, te ? "లైవ్ వాహనాలు" : "Live") +
    stat(live.filter(isFeatured).length, te ? "ఫీచర్డ్ (ఆదాయం)" : "Featured (paid)") +
    stat(live.filter(v => v.fuel === "electric").length, "⚡ EV");
  $("tabs").innerHTML = TABS.map(([k, l]) => `<button data-t="${k}" class="${k === tab ? "on" : ""}">${l} (${data[k].length})</button>`).join("");

  if (tab === "reports") {
    $("list").innerHTML = data.reports.length ? data.reports.map(r => `
      <div class="row"><div class="rinfo">
        <b>⚑ ${esc(r.reason)}</b><div class="meta">${timeAgo(r.createdAt)} · ID: ${esc(r.vehicleId)}</div>
        <div class="rbtns">
          <a class="btn btn-ghost btn-sm" target="_blank" href="vehicle.html?id=${encodeURIComponent(r.vehicleId)}">👁 ${te ? "చూడండి" : "View"}</a>
          <button class="btn btn-danger btn-sm" data-a="takedown" data-id="${esc(r.vehicleId)}" data-r="${r.id}">${te ? "వాహనం తీసేయండి" : "Take down"}</button>
          <button class="btn btn-ghost btn-sm" data-a="resolve" data-r="${r.id}">✓ ${te ? "పరిష్కరించాం" : "Resolve"}</button>
        </div></div></div>`).join("") : `<p class="empty">✓</p>`;
    return;
  }

  const list = data[tab];
  $("list").innerHTML = list.length ? list.map(v => `
    <div class="row">
      ${v.photos?.[0] ? `<a href="vehicle.html?id=${v.id}" target="_blank"><img src="${esc(v.photos[0])}" alt=""></a>` : `<span class="noimg-s">${catIcon(v.category)}</span>`}
      <div class="rinfo">
        <b>${fmtPrice(v.price)}</b> · ${esc(title(v))} · ${esc(v.year)}
        ${isFeatured(v) ? `<span class="badge" style="background:#fef3c7">★</span>` : ""}${v.dealer ? `<span class="badge b-approved">Dealer</span>` : ""}
        <div class="meta">${esc(catLabel(v.category))} · ${esc(fuelLabel(v.fuel))} · ${(v.kmDriven || 0).toLocaleString("en-IN")} km · ${v.photos?.length || 0} 📷</div>
        <div class="meta">📍 ${esc(v.place || "")}, ${esc(v.district || "")} · 👤 ${esc(v.ownerName)} <a href="tel:${esc(v.ownerPhone)}">${esc(v.ownerPhone)}</a> · ${timeAgo(v.createdAt)}</div>
        ${v.description ? `<div class="meta" style="white-space:normal">${esc(v.description).slice(0, 160)}</div>` : ""}
        <div class="rbtns">
          ${v.status !== "approved" ? `<button class="btn btn-sm" data-a="approve" data-id="${v.id}">✓ ${te ? "అప్రూవ్" : "Approve"}</button>` : ""}
          ${v.status === "pending" ? `<button class="btn btn-danger btn-sm" data-a="reject" data-id="${v.id}">✕ ${te ? "రిజెక్ట్" : "Reject"}</button>` : ""}
          ${v.status === "approved" ? `<button class="btn btn-sell btn-sm" data-a="feature" data-id="${v.id}">★ ${isFeatured(v) ? (te ? "ఫీచర్ తీసేయి" : "Unfeature") : (te ? "7 రోజులు ఫీచర్" : "Feature 7d")}</button>` : ""}
          <button class="btn btn-ghost btn-sm" data-a="dealer" data-id="${v.id}">${v.dealer ? "− Dealer" : "+ Dealer"}</button>
          <a class="btn btn-wa btn-sm" target="_blank" href="https://wa.me/${esc(String(v.ownerPhone).replace(/\D/g, ""))}">💬</a>
          <button class="btn btn-ghost btn-sm" data-a="del" data-id="${v.id}" style="color:var(--danger)">🗑</button>
        </div>
      </div>
    </div>`).join("") : `<p class="empty">✓</p>`;
}

$("list").onclick = async (e) => {
  const b = e.target.closest("[data-a]"); if (!b) return;
  const a = b.dataset.a, id = b.dataset.id;
  const all = [...data.pending, ...data.approved, ...data.other];
  const v = all.find(x => x.id === id);
  const ref = id ? fb.doc(db, "vehicles", id) : null;
  const now = Date.now();
  b.disabled = true;
  try {
    if (a === "approve") await fb.updateDoc(ref, { status: "approved", approvedAt: now, updatedAt: now, rejectReason: null, expiresAt: Math.max(v?.expiresAt || 0, now + site.listingDays * 86400000) });
    else if (a === "reject") {
      const reason = prompt(te ? "కారణం (యూజర్‌కు కనిపిస్తుంది):" : "Reason (shown to user):", te ? "ఫోటోలు స్పష్టంగా లేవు" : "Photos not clear");
      if (reason === null) { b.disabled = false; return; }
      await fb.updateDoc(ref, { status: "rejected", rejectReason: reason.slice(0, 200), updatedAt: now });
    }
    else if (a === "feature") await fb.updateDoc(ref, { featuredUntil: isFeatured(v) ? 0 : now + 7 * 86400000, updatedAt: now });
    else if (a === "dealer") await fb.updateDoc(ref, { dealer: !v?.dealer });
    else if (a === "del") { if (!confirm(te ? "శాశ్వతంగా తొలగించాలా?" : "Delete permanently?")) { b.disabled = false; return; } await fb.deleteDoc(ref); }
    else if (a === "takedown") {
      if (!confirm(te ? "ఈ వాహనాన్ని తిరస్కరించాలా?" : "Reject this vehicle?")) { b.disabled = false; return; }
      await fb.updateDoc(ref, { status: "rejected", rejectReason: te ? "రిపోర్ట్ ఆధారంగా తీసేశాం" : "Removed after report", updatedAt: now });
      await fb.updateDoc(fb.doc(db, "reports", b.dataset.r), { status: "resolved" });
    }
    else if (a === "resolve") await fb.updateDoc(fb.doc(db, "reports", b.dataset.r), { status: "resolved" });
    toast("✓");
    await load();
  } catch (err) { console.error(err); toast("Error: " + (err.code || err.message)); b.disabled = false; }
};
