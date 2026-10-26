// WhatsApp పోస్టర్: వాహనం ఫోటో + ధర + వివరాలు + RideKart బ్రాండింగ్ ఉన్న రంగుల ఇమేజ్ తయారుచేసి షేర్ చేయడం
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
  const accent = c[0];
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");

  // 1) ముదురు, సాఫ్ట్ నేపథ్యం (వాహనం ఫోటో ప్రధానంగా కనిపించడానికి) + కొంచెం రంగు
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#151b2b"); bg.addColorStop(1, "#0b0f1a");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // ఫోటో వెనుక రంగు కాంతి (glow)
  const glow = ctx.createRadialGradient(W / 2, 520, 80, W / 2, 520, 720);
  glow.addColorStop(0, hexA(accent, 0.38)); glow.addColorStop(1, hexA(accent, 0));
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  // పైన సన్నని రంగు గీత
  const strip = ctx.createLinearGradient(0, 0, W, 0);
  strip.addColorStop(0, c[0]); strip.addColorStop(1, c[1]);
  ctx.fillStyle = strip; ctx.fillRect(0, 0, W, 10);

  // 2) లోగో + వాహన రకం
  ctx.fillStyle = "#ffffff"; rr(ctx, 48, 40, 76, 76, 20); ctx.fill();
  ctx.fillStyle = "#151b2b"; ctx.font = `800 54px ${FONT}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("R", 86, 80);
  ctx.textAlign = "left"; ctx.fillStyle = "#fff"; ctx.font = `800 50px ${FONT}`;
  ctx.fillText(site.name, 140, 80);
  ctx.font = `700 32px ${FONT}`;
  const tag = `${catIcon(v.category)} ${catLabel(v.category)}`;
  const tw = ctx.measureText(tag).width + 36;
  chip(ctx, W - 48 - tw, 52, tag, hexA(accent, 0.22), "#fff", 32);

  // 3) పెద్ద ఫోటో (హీరో) — రంగు అంచుతో
  const px = 36, py = 140, pw = W - 72, ph = 760;
  ctx.save();
  ctx.shadowColor = hexA(accent, 0.55); ctx.shadowBlur = 50;
  ctx.fillStyle = strip; rr(ctx, px - 6, py - 6, pw + 12, ph + 12, 40); ctx.fill();
  ctx.restore();
  ctx.save(); rr(ctx, px, py, pw, ph, 34); ctx.clip();
  let drew = false;
  if (v.photos && v.photos[0]) {
    try { cover(ctx, await loadImg(sized(v.photos[0], pw, ph)), px, py, pw, ph); drew = true; } catch {}
  }
  if (!drew) {
    const g2 = ctx.createLinearGradient(px, py, px, py + ph); g2.addColorStop(0, "#eef2f7"); g2.addColorStop(1, "#d9e1ec");
    ctx.fillStyle = g2; ctx.fillRect(px, py, pw, ph);
    ctx.font = `300px sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(catIcon(v.category), W / 2, py + ph / 2); ctx.textAlign = "left";
  }
  // ఫోటో కింద చిన్న నీడ (ధర స్టిక్కర్ స్పష్టంగా కనిపించడానికి)
  const sh = ctx.createLinearGradient(0, py + ph - 200, 0, py + ph);
  sh.addColorStop(0, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(0,0,0,.55)");
  ctx.fillStyle = sh; ctx.fillRect(px, py + ph - 200, pw, 200);
  ctx.restore();
  // ఫోటోపై బ్యాడ్జ్‌లు
  let bx = px + 22;
  if (key === "featured") bx += chip(ctx, bx, py + 22, te ? "★ ఫీచర్డ్" : "★ Featured", "#ffd60a", "#3b2a00", 34, 800) + 14;
  if (v.fuel === "electric") chip(ctx, bx, py + 22, "⚡ EV", "#16a34a", "#fff", 34, 800);

  // 4) ధర స్టిక్కర్ — ఫోటో కింది మూలలో
  ctx.font = `800 86px ${FONT}`;
  const price = fmtPrice(v.price);
  const prw = ctx.measureText(price).width + 64;
  ctx.save();
  ctx.translate(px + 24, py + ph - 150); ctx.rotate(-0.03);
  ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8;
  ctx.fillStyle = "#ffe14d"; rr(ctx, 0, 0, prw, 118, 26); ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#16130a"; ctx.textBaseline = "middle"; ctx.fillText(price, 32, 64);
  ctx.restore();
  if (v.negotiable) {
    ctx.save(); ctx.translate(px + prw + 40, py + ph - 108); ctx.rotate(-0.03);
    chip(ctx, 0, 0, te ? "🤝 బేరం ఉంది" : "🤝 Negotiable", "#ffffff", "#151b2b", 28, 800);
    ctx.restore();
  }

  // 5) పేరు
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic"; ctx.fillStyle = "#fff";
  ctx.font = `800 60px ${FONT}`;
  ctx.fillText(fit(ctx, `${title(v)}${v.year ? " · " + v.year : ""}`, W - 96), 48, py + ph + 92);

  // 6) వివరాల చిప్స్ (రంగు అంచుతో)
  const chips = [`🛣️ ${fmtKm(v.kmDriven)}`, `⛽ ${fuelLabel(v.fuel)}`];
  if (v.owners) chips.push(`👤 ${v.owners} ${te ? "ఓనర్" : "owner"}`);
  if (v.fuel === "electric" && v.ev?.batteryHealth) chips[1] = `🔋 ${v.ev.batteryHealth}%`;
  let cx = 48; const cy = py + ph + 120;
  for (const t of chips) {
    ctx.font = `700 30px ${FONT}`;
    if (cx + ctx.measureText(t).width + 40 > W - 48) break;
    cx += chip(ctx, cx, cy, t, hexA(accent, 0.2), "#fff", 30) + 12;
  }
  ctx.fillStyle = "#cbd5e1"; ctx.font = `700 38px ${FONT}`; ctx.textBaseline = "alphabetic";
  ctx.fillText(fit(ctx, `📍 ${placeLabel(v)}`, W - 96), 48, cy + 108);

  // 7) కింద CTA బార్ (వాహన రకం రంగు)
  const by = H - 118;
  ctx.fillStyle = strip; rr(ctx, 36, by, W - 72, 92, 46); ctx.fill();
  const ctaInk = key === "featured" || key === "auto" ? "#1a1300" : "#fff";
  ctx.fillStyle = ctaInk; ctx.textBaseline = "middle"; ctx.font = `800 38px ${FONT}`;
  ctx.fillText(te ? "👉 RideKart లో చూడండి" : "👉 See it on RideKart", 76, by + 32);
  ctx.fillStyle = ctaInk === "#fff" ? "rgba(255,255,255,.85)" : "rgba(26,19,0,.8)"; ctx.font = `600 26px ${FONT}`;
  ctx.fillText(fit(ctx, `${location.host}${location.pathname.replace(/[^/]*$/, "")}`, W - 160), 76, by + 66);

  return new Promise(res => cv.toBlob(res, "image/jpeg", 0.92));
}

// #rrggbb → rgba(…, a)
function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export async function sharePoster(v, link) {
  const te = getLang() === "te";
  toast(te ? "పోస్టర్ తయారవుతోంది…" : "Making poster…");
  const blob = await makePoster(v);
  if (!blob) { toast(te ? "పోస్టర్ తయారు కాలేదు" : "Could not make poster"); return; }
  const file = new File([blob], `ridekart-${v.id || "vehicle"}.jpg`, { type: "image/jpeg" });
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
