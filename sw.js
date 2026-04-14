/* ============================================
   VYTAL — Service Worker (Offline-First PWA)
   ============================================ */

var CACHE_NAME = 'vytal-v1';
var STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/vytal.css',
  '/js/svg-exercises.js',
  '/js/supabase-client.js',
  '/assets/training-plan.json',
  '/assets/nutrition-plan.json',
  '/manifest.json'
];

var FONT_CACHE = 'vytal-fonts-v1';

/* --- Install: cache static assets --- */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(STATIC_ASSETS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

/* --- Activate: clean old caches --- */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return key !== CACHE_NAME && key !== FONT_CACHE;
        }).map(function(key) {
          return caches.delete(key);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

/* --- Fetch strategy --- */
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);

  // Google Fonts: cache-first
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONT_CACHE).then(function(cache) {
        return cache.match(event.request).then(function(response) {
          if (response) return response;
          return fetch(event.request).then(function(networkResponse) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Supabase API calls: network-first
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request).catch(function() {
        return new Response(JSON.stringify({ error: 'offline' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Static assets: cache-first, network fallback
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) return response;
      return fetch(event.request).then(function(networkResponse) {
        // Cache successful responses for same-origin
        if (networkResponse && networkResponse.status === 200 && url.origin === self.location.origin) {
          var cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, cloned);
          });
        }
        return networkResponse;
      }).catch(function() {
        // Fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
