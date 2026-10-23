// నా వాహనాలు: ఎడిట్, అమ్ముడైంది, రెన్యూ, బూస్ట్, డిలీట్
import {
  DEMO, site, auth, db, fb, t, getLang, applyI18n, renderHeader, esc, fmtPrice, title, timeAgo,
  isFeatured, currentUser, isAdmin, toast, catIcon
} from "./common.js";
import { sharePoster } from "./poster.js";

const te = getLang() === "te";
const $ = (id) => document.getElementById(id);
renderHeader("my");
applyI18n();

const ST = te
  ? { pending: "చెకింగ్‌లో", approved: "లైవ్", rejected: "తిరస్కరించారు", sold: "అమ్ముడైంది", expired: "గడువు ముగిసింది" }
  : { pending: "In review", approved: "Live", rejected: "Rejected", sold: "Sold", expired: "Expired" };
let user = null, items = [];

init();
async function init() {
  if (DEMO) { $("list").innerHTML = `<p class="empty">${t("demo")}</p>`; return; }
  user = await currentUser();
  if (!user) {
    $("list").innerHTML = `<div class="empty"><p>${te ? "మీ వాహనాలు చూడడానికి లాగిన్ అవ్వండి." : "Login to see your vehicles."}</p><a class="btn" href="sell.html">${t("login")}</a></div>`;
    return;
  }
  $("logoutBtn").hidden = false;
  $("logoutBtn").onclick = async () => { await fb.signOut(auth); location.href = "index.html"; };
  if (await isAdmin(user)) $("adminLink").hidden = false;
  await load();
}

async function load() {
  const s = await fb.getDocs(fb.query(fb.collection(db, "vehicles"), fb.where("ownerUid", "==", user.uid)));
  items = s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.createdAt - a.createdAt);
  render();
}

function statusOf(v) {
  if (["pending", "approved"].includes(v.status) && v.expiresAt && v.expiresAt < Date.now()) return "expired";
  return v.status;
}

function render() {
  if (!items.length) {
    $("list").innerHTML = `<div class="empty"><p>${te ? "మీరు ఇంకా వాహనం పెట్టలేదు." : "You haven't listed a vehicle yet."}</p><a class="btn btn-sell" href="sell.html">+ ${t("sell")}</a></div>`;
    return;
  }
  $("list").innerHTML = items.map(v => {
    const st = statusOf(v);
    const daysLeft = v.expiresAt ? Math.ceil((v.expiresAt - Date.now()) / 86400000) : null;
    const canRenew = ["approved", "pending"].includes(v.status) && daysLeft != null && daysLeft <= 10;
    return `
    <div class="row">
      ${v.photos?.[0] ? `<img src="${esc(v.photos[0])}" alt="">` : `<span class="noimg-s">${catIcon(v.category)}</span>`}
      <div class="rinfo">
        <b>${fmtPrice(v.price)}</b> <span class="badge b-${st}">${ST[st]}</span>${isFeatured(v) ? `<span class="badge" style="background:#fef3c7">★ ${t("featured")}</span>` : ""}
        <div class="name">${esc(title(v))} · ${esc(v.year)}</div>
        <div class="meta">👁 ${v.views || 0} · ${timeAgo(v.createdAt)}${daysLeft != null && st !== "sold" && st !== "rejected" ? ` · ${daysLeft > 0 ? (te ? `${daysLeft} రోజులు మిగిలాయి` : `${daysLeft} days left`) : ""}` : ""}</div>
        ${v.status === "rejected" && v.rejectReason ? `<div class="meta err">${esc(v.rejectReason)}</div>` : ""}
        <div class="rbtns">
          <a class="btn btn-ghost btn-sm" href="vehicle.html?id=${v.id}">👁</a>
          ${v.status !== "sold" ? `<a class="btn btn-ghost btn-sm" href="sell.html?id=${v.id}">✎ ${te ? "ఎడిట్" : "Edit"}</a>` : ""}
          ${v.status === "approved" ? `<button class="btn btn-wa btn-sm" data-a="poster" data-id="${v.id}">📲 ${te ? "పోస్టర్" : "Poster"}</button>` : ""}
          ${v.status === "approved" ? `<button class="btn btn-ghost btn-sm" data-a="sold" data-id="${v.id}">✓ ${te ? "అమ్ముడైంది" : "Mark sold"}</button>` : ""}
          ${["approved", "sold"].includes(v.status) ? `<a class="btn btn-ghost btn-sm" href="agreement.html?id=${v.id}">📄 ${te ? "ఒప్పందం" : "Agreement"}</a>` : ""}
          ${canRenew || st === "expired" ? `<button class="btn btn-ghost btn-sm" data-a="renew" data-id="${v.id}">↻ ${te ? "రెన్యూ" : "Renew"}</button>` : ""}
          ${v.status === "approved" && !isFeatured(v) ? `<button class="btn btn-sell btn-sm" data-a="boost" data-id="${v.id}">★ ${te ? "బూస్ట్" : "Boost"} ₹${site.boostPrices[v.category] || 99}</button>` : ""}
          <button class="btn btn-ghost btn-sm" data-a="del" data-id="${v.id}" style="color:var(--danger)">🗑</button>
        </div>
      </div>
    </div>`;
  }).join("");
}

$("list").onclick = async (e) => {
  const b = e.target.closest("[data-a]"); if (!b) return;
  const v = items.find(x => x.id === b.dataset.id); if (!v) return;
  if (b.dataset.a === "poster") {
    const base = location.href.replace(/[^/]*$/, "");
    return sharePoster(v, `${base}vehicle.html?id=${encodeURIComponent(v.id)}`);
  }
  const ref = fb.doc(db, "vehicles", v.id);
  try {
    if (b.dataset.a === "sold") {
      if (!confirm(te ? "ఈ వాహనం అమ్ముడైందా?" : "Mark this vehicle as sold?")) return;
      await fb.updateDoc(ref, { status: "sold", updatedAt: Date.now() });
      toast(te ? "అభినందనలు! 🎉" : "Congrats! 🎉");
    } else if (b.dataset.a === "renew") {
      const upd = { expiresAt: Date.now() + site.listingDays * 86400000, updatedAt: Date.now() };
      await fb.updateDoc(ref, upd);
      toast(te ? `మరో ${site.listingDays} రోజులు పెంచాం` : `Extended by ${site.listingDays} days`);
    } else if (b.dataset.a === "boost") {
      const price = site.boostPrices[v.category] || 99;
      const msg = te
        ? `నమస్తే, నా వాహనం బూస్ట్ చేయాలి.\nవాహనం: ${title(v)}\nID: ${v.id}\nబూస్ట్ ఫీజు: ₹${price} (7 రోజులు)\nUPI QR పంపండి.`
        : `Hi, I want to boost my listing.\nVehicle: ${title(v)}\nID: ${v.id}\nBoost fee: ₹${price} (7 days)\nPlease send UPI QR.`;
      window.open(`https://wa.me/${site.adminWhatsApp}?text=${encodeURIComponent(msg)}`, "_blank");
      return;
    } else if (b.dataset.a === "del") {
      if (!confirm(te ? "శాశ్వతంగా తొలగించాలా?" : "Delete permanently?")) return;
      await fb.deleteDoc(ref);
      toast(te ? "తొలగించాం" : "Deleted");
    }
    await load();
  } catch (err) { console.error(err); toast("Error: " + (err.code || err.message)); }
};
