const CACHE_NAME = 'portafolio-cache-v1';
const ASSETS = [
  // Archivos principales
  '../index.html',
  '../manifest.json',

  // Iconos y estilos
  '../assets/favicon.ico',
  '../assets/css/themify-icons.css',
  '../assets/css/bootstrap.css',
  '../assets/vendor/animate/animate.css',
  '../assets/vendor/owl-carousel/owl.carousel.css',
  '../assets/vendor/nice-select/css/nice-select.css',
  '../assets/vendor/fancybox/css/jquery.fancybox.min.css',
  '../assets/css/virtual.css',
  '../assets/css/minibar.virtual.css',

  // Recursos adicionales
  '../assets/vendor/perfect-scrollbar/js/perfect-scrollbar.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching assets...');
        return cache.addAll(ASSETS);
      })
      .catch((error) => {
        console.error('Error al almacenar en caché:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Eliminando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Retorna recurso desde la caché
        }
        return fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone()); // Almacena en caché
            return networkResponse; // Retorna recurso desde la red
          });
        });
      })
      .catch((error) => {
        console.error('Error en fetch:', error);
        return new Response('Recurso no encontrado y no disponible en caché.');
      })
  );
});
