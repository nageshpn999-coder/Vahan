// RideKart యాప్ సర్వీస్ వర్కర్: ఇంటర్నెట్ ఉంటే ఎప్పుడూ తాజా వెర్షన్ (network-first),
// లేకపోతే చివరిసారి చూసిన పేజీలు కాష్ నుంచి. Firebase / Cloudinary లాంటి బయటి రిక్వెస్ట్‌లు ముట్టుకోదు.
const CACHE = "ridekart-v1";
const SHELL = ["./", "index.html", "sell.html", "my.html", "vehicle.html", "agreement.html",
  "style.css", "common.js", "config.js", "data.js", "home.js", "sell.js", "my.js", "vehicle.js",
  "poster.js", "agreement.js", "icon-192.png", "icon-512.png", "upi-qr.jpg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;          // బయటి సైట్లు — బ్రౌజర్‌కే వదిలేయి
  if (url.pathname.endsWith("admin.html") || url.pathname.endsWith("admin.js")) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true })
      .then(r => r || (req.mode === "navigate" ? caches.match("index.html") : Response.error())))
  );
});
