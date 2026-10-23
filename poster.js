// WhatsApp పోస్టర్: వాహనం ఫోటో + ధర + వివరాలు + Vahan బ్రాండింగ్ ఉన్న రంగుల ఇమేజ్ తయారుచేసి షేర్ చేయడం
import { fmtPrice, fmtKm, fuelLabel, title, placeLabel, getLang, catIcon, catLabel, isFeatured, toast, site } from "./common.js";

const W = 1080, H = 1350;   // WhatsApp Status కు సరిపోయే 4:5 సైజ్
const FONT = '"Hind Guntur", "Noto Sans Telugu", sans-serif';

// వాహన రకాన్ని బట్టి రంగులు [పై రంగు, కింది రంగు]
const THEMES = {
  bike:       ["#ff512f", "#dd2476"],   // ఆరెంజ్ → పింక్
  scooter:    ["#a445ff", "#4a00e0"],   // పర్పుల్
  car:        ["#1fa2ff", "#1a2980"],   // నీలం
  auto:       ["#ffb300", "#e8501c"],   // పసుపు → ఆరెంజ్
  tractor:    ["#2ecc71", "#0b6e4f"],   // ఆకుపచ్చ
  commercial: ["#4286f4", "#26304a"],   // స్టీల్ బ్లూ
  other:      ["#7b4397", "#3a3f8f"],
  electric:   ["#00d2c6", "#0a7a5a"],   // EV: సియాన్ → పచ్చ
  featured:   ["#f9d423", "#e65c00"]    // ఫీచర్డ్: గోల్డ్
};
export function posterTheme(v) {
  if (isFeatured(v)) return { key: "featured", c: THEMES.featured };
  if (v.fuel === "electric") return { key: "electric", c: THEMES.electric };
  return { key: v.category, c: THEMES[v.category] || THEMES.other };
}

function sized(url, w, h) {
  return /res\.cloudinary\.com\/.+\/upload\//.test(url)
    ? url.replace("/upload/", `/upload/c_fill,g_auto,w_${w},h_${h},q_auto/`) : url;
}
function loadImg(src) {
  return new Promise((res, rej) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => res(im); im.onerror = rej; im.src = src;
  });
}
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) { ctx.roundRect(x, y, w, h, r); return; }
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function cover(ctx, im, x, y, w, h) {
  const s = Math.max(w / im.width, h / im.height), iw = im.width * s, ih = im.height * s;
  ctx.drawImage(im, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
}
function fit(ctx, text, max) {
  if (ctx.measureText(text).width <= max) return text;
  while (text.length > 1 && ctx.measureText(text + "…").width > max) text = text.slice(0, -1);
  return text + "…";
}
// గుండ్రని బ్యాడ్జ్ (చిప్); వెడల్పు తిరిగి ఇస్తుంది
function chip(ctx, x, y, text, bg, fg, size = 34, weight = 700) {
  ctx.font = `${weight} ${size}px ${FONT}`;
  const w = ctx.measureText(text).width + size * 1.1, h = size * 1.75;
  ctx.fillStyle = bg; rr(ctx, x, y, w, h, h / 2); ctx.fill();
  ctx.fillStyle = fg; ctx.textBaseline = "middle"; ctx.textAlign = "left";
  ctx.fillText(text, x + size * 0.55, y + h / 2 + 2);
  return w;
}

export async function makePoster(v) {
  const te = getLang() === "te";
  try { await Promise.all([document.fonts.load(`800 80px ${FONT}`), document.fonts.load(`500 40px ${FONT}`)]); } catch {}
  const { key, c } = posterTheme(v);
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");

  // 1) రంగుల గ్రేడియంట్ నేపథ్యం + అలంకార వృత్తాలు
  const bg = ctx.createLinearGradient(0, 0, W * 0.4, H);
  bg.addColorStop(0, c[0]); bg.addColorStop(1, c[1]);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(255,255,255,.10)";
  ctx.beginPath(); ctx.arc(W - 60, 120, 260, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(80, H - 330, 200, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,.06)";
  ctx.beginPath(); ctx.arc(W * 0.55, H * 0.62, 420, 0, Math.PI * 2); ctx.fill();

  // 2) పైన లోగో + వాహన రకం
  ctx.fillStyle = "#fff"; rr(ctx, 56, 44, 88, 88, 22); ctx.fill();
  ctx.fillStyle = c[1]; ctx.font = `800 62px ${FONT}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("V", 100, 92);
  ctx.textAlign = "left"; ctx.fillStyle = "#fff"; ctx.font = `800 56px ${FONT}`;
  ctx.fillText(site.name, 162, 92);
  ctx.font = `700 34px ${FONT}`;
  const tag = `${catIcon(v.category)} ${catLabel(v.category)}`;
  const tw = ctx.measureText(tag).width + 40;
  chip(ctx, W - 56 - tw, 58, tag, "rgba(255,255,255,.22)", "#fff", 34);

  // 3) తెల్ల ఫ్రేమ్‌లో ఫోటో
  const px = 56, py = 160, pw = W - 112, ph = 640;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 16;
  ctx.fillStyle = "#fff"; rr(ctx, px - 12, py - 12, pw + 24, ph + 24, 46); ctx.fill();
  ctx.restore();
  ctx.save(); rr(ctx, px, py, pw, ph, 36); ctx.clip();
  let drew = false;
  if (v.photos && v.photos[0]) {
    try { cover(ctx, await loadImg(sized(v.photos[0], pw, ph)), px, py, pw, ph); drew = true; } catch {}
  }
  if (!drew) {
    const g2 = ctx.createLinearGradient(px, py, px, py + ph); g2.addColorStop(0, "#eef2f7"); g2.addColorStop(1, "#d9e1ec");
    ctx.fillStyle = g2; ctx.fillRect(px, py, pw, ph);
    ctx.font = `280px sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(catIcon(v.category), W / 2, py + ph / 2); ctx.textAlign = "left";
  }
  ctx.restore();
  // ఫోటోపై బ్యాడ్జ్‌లు
  let bx = px + 22;
  if (key === "featured") bx += chip(ctx, bx, py + 22, te ? "★ ఫీచర్డ్" : "★ Featured", "#ffd60a", "#3b2a00", 34, 800) + 14;
  if (v.fuel === "electric") chip(ctx, bx, py + 22, "⚡ EV", "#16a34a", "#fff", 34, 800);

  // 4) ధర స్టిక్కర్ (కొంచెం వంగి, ఫోటో అంచుపై)
  ctx.save();
  ctx.translate(px + 10, py + ph - 40); ctx.rotate(-0.045);
  ctx.font = `800 92px ${FONT}`;
  const price = fmtPrice(v.price);
  const prw = ctx.measureText(price).width + 70;
  ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
  ctx.fillStyle = key === "featured" ? "#ffffff" : "#ffe14d"; rr(ctx, 0, 0, prw, 128, 28); ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#16130a"; ctx.textBaseline = "middle"; ctx.fillText(price, 35, 70);
  ctx.restore();
  if (v.negotiable) {
    ctx.save(); ctx.translate(px + prw + 34, py + ph + 6); ctx.rotate(-0.045);
    chip(ctx, 0, 0, te ? "🤝 బేరం ఉంది" : "🤝 Negotiable", "#ffffff", c[1], 30, 800);
    ctx.restore();
  }

  // 5) పేరు
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.fillStyle = "#fff";
  ctx.font = `800 64px ${FONT}`;
  ctx.shadowColor = "rgba(0,0,0,.25)"; ctx.shadowBlur = 10;
  ctx.fillText(fit(ctx, `${title(v)}${v.year ? " · " + v.year : ""}`, W - 112), 56, py + ph + 190);
  ctx.shadowBlur = 0;

  // 6) వివరాల చిప్స్
  const chips = [`🛣️ ${fmtKm(v.kmDriven)}`, `⛽ ${fuelLabel(v.fuel)}`];
  if (v.owners) chips.push(`👤 ${v.owners} ${te ? "ఓనర్" : "owner"}`);
  if (v.fuel === "electric" && v.ev?.batteryHealth) chips[1] = `🔋 ${v.ev.batteryHealth}%`;
  let cx = 56; const cy = py + ph + 222;
  for (const t of chips) {
    ctx.font = `700 32px ${FONT}`;
    if (cx + ctx.measureText(t).width + 40 > W - 56) break;
    cx += chip(ctx, cx, cy, t, "rgba(255,255,255,.2)", "#fff", 32) + 14;
  }
  // ఊరు
  ctx.fillStyle = "#fff"; ctx.font = `700 40px ${FONT}`; ctx.textBaseline = "alphabetic";
  ctx.fillText(fit(ctx, `📍 ${placeLabel(v)}`, W - 112), 56, cy + 122);

  // 7) కింద తెల్ల CTA బార్
  const by = H - 132;
  ctx.fillStyle = "#fff"; rr(ctx, 40, by, W - 80, 104, 52); ctx.fill();
  ctx.fillStyle = c[1]; ctx.textBaseline = "middle"; ctx.font = `800 40px ${FONT}`;
  ctx.fillText(te ? "👉 Vahan లో చూడండి" : "👉 See it on Vahan", 84, by + 38);
  ctx.fillStyle = "#475569"; ctx.font = `600 28px ${FONT}`;
  ctx.fillText(fit(ctx, `${location.host}${location.pathname.replace(/[^/]*$/, "")}`, W - 170), 84, by + 76);

  return new Promise(res => cv.toBlob(res, "image/jpeg", 0.92));
}

export async function sharePoster(v, link) {
  const te = getLang() === "te";
  toast(te ? "పోస్టర్ తయారవుతోంది…" : "Making poster…");
  const blob = await makePoster(v);
  if (!blob) { toast(te ? "పోస్టర్ తయారు కాలేదు" : "Could not make poster"); return; }
  const file = new File([blob], `vahan-${v.id || "vehicle"}.jpg`, { type: "image/jpeg" });
  const text = `${title(v)} ${v.year || ""} — ${fmtPrice(v.price)}\n📍 ${placeLabel(v)}\n${te ? "వివరాలు, ఫోటోలు:" : "Details & photos:"} ${link}`;
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text }); return; }
  } catch (e) { if (e && e.name === "AbortError") return; }
  // షేర్ సపోర్ట్ లేకపోతే డౌన్‌లోడ్
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = file.name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  try { await navigator.clipboard.writeText(text); } catch {}
  toast(te ? "పోస్టర్ డౌన్‌లోడ్ అయింది. WhatsApp లో పెట్టండి (లింక్ కాపీ అయింది)" : "Poster downloaded. Post it on WhatsApp (link copied)", 4000);
}
