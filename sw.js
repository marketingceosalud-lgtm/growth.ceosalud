const CACHE_NAME = 'ceo-salud-compartido-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Intercepta el envío que hace el sistema operativo cuando alguien usa
// "Compartir" desde WhatsApp (u otra app) hacia este sitio.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (event.request.method === 'POST' && url.pathname.endsWith('/share-target')) {
    event.respondWith((async () => {
      try {
        const formData = await event.request.formData();
        const archivo = formData.get('imagen');
        if (archivo) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put('/imagen-compartida', new Response(archivo, {
            headers: { 'Content-Type': archivo.type || 'image/png' }
          }));
        }
      } catch (e) {
        console.error('Error guardando imagen compartida:', e);
      }
      // Redirige a la página principal, avisando que hay una imagen esperando
      return Response.redirect('./index.html?compartido=1', 303);
    })());
  }
});
