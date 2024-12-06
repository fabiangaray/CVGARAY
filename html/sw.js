// Nombre del caché
const CACHE_NAME = 'mi-app-cache-v1';
// Archivos que serán almacenados en caché
const urlsToCache = [
    './',
    './manifest.json',
      // Otros archivos
    './sw.js',
    // Puedes incluir otros archivos estáticos necesarios aquí.
];
// Código de instalación, activación y manejo de solicitudes para el Service Worker
self.addEventListener('install', e => {
    e.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          return cache.addAll(urlsToCache)
            .then(() => self.skipWaiting())
        })
        .catch(err => console.log('Falló registro de cache', err))
    )
  });
  
  self.addEventListener('activate', e => {
    const cacheWhitelist = [CACHE_NAME];
    e.waitUntil(
      caches.keys()
        .then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
              }
            })
          );
        })
        .then(() => self.clients.claim())
    );
  });
  
  self.addEventListener('fetch', e => {
    e.respondWith(
      caches.match(e.request)
        .then(res => {
          if (res) {
            return res;
          }
          return fetch(e.request);
        })
    );
  })