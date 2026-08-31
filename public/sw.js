/* AP Fashion Mart Service Worker
 *
 * IMPORTANT: HTML navigations (/, /shop, ...) are NEVER precached/pre-stored as
 * navigations use a network-first strategy so users always get the latest build.
 * Only immutable static assets (manifest, icons) and the offline page are cached
 * for offline fallback. Precaching HTML shells caused stale builds to be served,
 * which produced blank white pages after redeploys.
 */
const CACHE_VERSION = "apfashion-v2";
// Static (immutable) assets only - never the HTML shell of routed pages.
const STATIC_ASSETS = [
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/icons/apple-touch-icon.png",
  "/offline",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // HTML navigations: network-first ONLY. We deliberately do NOT cache the
  // response so users never get a stale HTML shell referencing old hashed
  // JS/CSS bundles (which caused blank white pages). Fall back to cache/offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        return caches.match("/offline");
      })
    );
    return;
  }

  // Static assets & API: stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
