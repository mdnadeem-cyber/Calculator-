self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("calculator-cache-v1").then(cache => {
      return cache.addAll([
        "/Calculator-/",
        "/Calculator-/index.html",
        "/Calculator-/styles.css",
        "/Calculator-/script.js",
        "/Calculator-/manifest.json",
        "/Calculator-/icons/icon-192.png",
        "/Calculator-/icons/icon-512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
