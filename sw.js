// Rovaniemi Essentials Map — Service Worker
// Caches the app shell for offline use, and opportunistically caches
// map tiles / CDN assets as they're fetched so previously-viewed areas
// keep working without internet.

const APP_CACHE = "rovaniemi-app-v8";
const TILE_CACHE = "rovaniemi-tiles-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

// ---- Install: pre-cache the app shell -------------------------------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// ---- Activate: clean up old cache versions ---------------------------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== APP_CACHE && key !== TILE_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Domains it's safe/useful to cache at runtime (map tiles + CDN libs)
const RUNTIME_CACHE_HOSTS = [
  "tile.openstreetmap.org",
  "tile.opentopomap.org",
  "cdnjs.cloudflare.com",
  "unpkg.com",
  "cdn.jsdelivr.net",
];

function isRuntimeCacheable(url) {
  try {
    const { hostname } = new URL(url);
    return RUNTIME_CACHE_HOSTS.some((h) => hostname.includes(h));
  } catch (e) {
    return false;
  }
}

// ---- Fetch strategy ----------------------------------------------------
// App shell: cache-first (fast, works offline immediately)
// Map tiles / CDN assets: stale-while-revalidate (show cached copy instantly,
//   refresh in the background when online)
// Everything else: network-first, falling back to cache if offline
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = request.url;

  if (APP_SHELL.some((path) => url.endsWith(path.replace("./", "")))) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
    return;
  }

  if (isRuntimeCacheable(url)) {
    event.respondWith(
      caches.open(TILE_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const fetchPromise = fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
