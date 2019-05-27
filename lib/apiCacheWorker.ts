import console = require('console');

/*
 * Note that, as of June 2019, there are no official typings for the Service Worker
 * events, so for now 'any' is used, along with ad hoc types where necessary.
 */

const CACHE_VERSION = 'v1' as const;

self.addEventListener('install', (event: any) => event.waitUntil(
  caches.open(CACHE_VERSION)
    .then(cache => cache.add('*'))
    .catch(console.warn),
));

// TODO: these individual checks should be delegated to the appropriate modules,
// especially since only certain types of requests will be cacheable, as opposed
// to the entire thing, wholesale
function isFeedRequest(req: Request): boolean {
  return (
    req.url.startsWith('https://hacker-news.firebaseio.com/v0')
    || req.url.startsWith('https://api.designernews.co/api/v2')
  );
}

// cacheFeedResponse puts a given request/response into the Service Worker's
// cache.
function cacheFeedResponse(request: Request, response: Response) {
  return caches.open(CACHE_VERSION).then(cache => {
    cache.put(request, response.clone());

    return response;
  });
}

self.addEventListener('fetch', (event: any) => {
  if (isFeedRequest(event.request)) {
    event.respondWith(caches.match(event.request).then(resp =>
      resp || fetch(event.request)
        .then(freshResponse => cacheFeedResponse(event.request, freshResponse)),
    ));
  }
});
