
/* Offline cache for the shell and today's paigham. Bump CACHE when files change. */
const CACHE = 'tajv2-v1';
const SHELL = ['./', 'index.html', 'admin.html', 'config.js', 'assets/css/app.css', 'assets/css/admin.css', 'assets/js/seed.js', 'assets/js/books.js', 'assets/js/icons.js', 'assets/js/store.js', 'assets/js/app.js', 'assets/js/admin.js', 'assets/img/hero.jpg', 'assets/img/icon-192.png', 'assets/img/icon-512.png', 'manifest.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // never cache backend calls
  if (u.hostname.indexOf('supabase') !== -1) return;
  if (u.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); return r; })
      .catch(() => caches.match(e.request).then(m => m || caches.match('index.html')))
  );
});
