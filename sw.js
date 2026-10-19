// Offline support when the app is served over https (phone install).
// Everything lives in index.html plus the script sheet PDF.
// Bump VERSION on every release so phones pick up the new build.
const VERSION = 'grimoire-4136706250';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon.svg', './trouble-brewing.pdf'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
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
