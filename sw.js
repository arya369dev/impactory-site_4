
/* IMPACTORY 3.0 — service worker v4 */
const CACHE_NAME = 'impactory-3-v4';
const APP_SHELL = ['./', './index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.allSettled(
      APP_SHELL.map((url) => cache.add(url))
    );
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) =>
          key.startsWith('impactory-3-') &&
          key !== CACHE_NAME
        )
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);

        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(
            './index.html',
            response.clone()
          ).catch(() => {});
        }

        return response;
      } catch (error) {
        return (
          (await caches.match('./index.html')) ||
          Response.error()
        );
      }
    })());

    return;
  }

  event.respondWith((async () => {
    try {
      const response = await fetch(request);

      if (response.ok && response.type === 'basic') {
        const cache = await caches.open(CACHE_NAME);
        cache.put(
          request,
          response.clone()
        ).catch(() => {});
      }

      return response;
    } catch (error) {
      return (
        (await caches.match(request)) ||
        Response.error()
      );
    }
  })());
});
