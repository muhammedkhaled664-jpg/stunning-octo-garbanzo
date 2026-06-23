/* =====================================================================
   LogiSync Service Worker
   Caches ONLY the static app shell so the UI loads offline / fast.

   Deliberately does NOT cache:
     - Supabase API requests (live data must always be fresh)
     - CDN scripts loaded on demand (SheetJS, Chart.js, supabase-js)
   Those are handled network-only; if the network is down the app's
   throttled connection toast informs the user.
   ===================================================================== */

const CACHE = 'logisync-shell-v3';

// The static shell — same-origin assets that make up the UI.
const SHELL = [
  './',
  './index.html',
  './config.js',
  './tailwind.build.css',
  './logo.svg',
  './logo.png',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // addAll is atomic; ignore individual failures so install still succeeds
      .then((cache) => Promise.all(SHELL.map((url) =>
        cache.add(url).catch((err) => console.warn('[sw] skip caching', url, err))
      )))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle same-origin GET requests; everything else (Supabase API,
  // CDNs, POST/PATCH, etc.) goes straight to the network.
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // The HTML document (navigations + index.html) is served NETWORK-FIRST so a
  // new deploy shows up immediately when online; the cache is only a fallback
  // for offline. Without this, cache-first kept serving a stale UI one deploy
  // behind.
  const isHTML = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html') ||
    url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match('./index.html')))
    );
    return;
  }

  // Other static assets (CSS, images, manifest): stale-while-revalidate —
  // fast from cache, refreshed in the background for next time.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
