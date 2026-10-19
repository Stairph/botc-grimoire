// Offline support when the app is served over https (phone install).
// Everything lives in index.html plus the script sheet PDF.
// Bump VERSION on every release so phones pick up the new build.
const VERSION = 'grimoire-d28f6cc0cf';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon.svg', './trouble-brewing.pdf'];

self.addEventListener('install', (e) => {
  // cache: 'reload' skips the browser's HTTP cache, so a new version never
  // stores an old copy of a file under its new name.
  const fresh = FILES.map((f) => new Request(f, { cache: 'reload' }));
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(fresh)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Cache first: the app must open with no signal.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request)));
});
