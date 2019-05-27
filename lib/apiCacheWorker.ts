/*
 * Note that, as of June 2019, there are no official typings for the Service Worker
 * events, so for now 'any' is used, along with ad hoc types where possible.
 */

self.addEventListener('install', (event: any) => event.waitUntil(
  caches.open('v1')
    .then(cache => cache.add('*'))
    .catch(console.warn),
));

self.addEventListener('fetch', (event: any) => {
  console.log('Intercepting fetch event', event.request.url);

  if (event.request.url.startsWith('https://hacker-news')) {
    event.respondWith(new Response('Hijack error', { status: 500 }));
  }
});
