/*
 * Note that, as of June 2019, there are no official typings for the Service Worker
 * events, so for now 'any' is used, along with ad hoc types where necessary.
 */

import ExpirableCacheBucket from './expirableCacheBucket';
import { cacheExpirationThreshold } from './constants';

// selectActiveCache iterates through all active caches, selecting the one that
// is not yet expired, if one exists. If multiple active caches exist, the first
// seen will be selected. If none exist, one will be created.
async function selectOrCreateActiveCache(): Promise<string> {
  const curTime = new Date();
  const cacheList = await caches.keys();

  const activeCache = cacheList
    .map(ExpirableCacheBucket.fromString)
    .filter(bucket => bucket && !bucket.expired(curTime))
    .map(bucket => bucket.toString())
    .find(() => true); // select the first remaining element

  if (activeCache) {
    return activeCache;
  }

  // TODO: look into overriding .valueOf to avoid haivng to do the .toString conv everywhere
  const newActiveCache = (new ExpirableCacheBucket(cacheExpirationThreshold).toString());
  await caches.open(newActiveCache);

  return newActiveCache;
}

// the activation handler removes any caches that are not selected as the 'active'
// cache, leaving only one active cache behind even if multiple caches are technically
// active. If no cache is selected as being active then all will be removed. Finally
// the cache that will be used for the session is created, if it doesn't exist.
self.addEventListener('activate', (event: any) => event.waitUntil(
  selectOrCreateActiveCache()
    .then((activeCache => caches.keys().then(openCaches =>
      Promise.all(openCaches
        .filter(c => activeCache && c !== activeCache)
        .map(c => caches.delete(c)),
      ),
    ))),
));

// TODO: I don't think we need this if we're not going to pre-populate the cache
self.addEventListener('install', () => {});

// TODO: these individual checks should be delegated to the appropriate modules,
// especially since only certain types of requests will be cacheable, as opposed
// to the entire thing, wholesale
function isFeedRequest(req: Request): boolean {
  return (
    req.url.startsWith('https://hacker-news.firebaseio.com/v0')
    || req.url.startsWith('https://api.designernews.co/api/v2')
  );
}

self.addEventListener('fetch', (event: any) => {
  // TODO: active runs so sparsely that it might be worth it to delete old caches
  // every time we create a new one (i.e. selection returns undefined).
  if (isFeedRequest(event.request)) {
    event.respondWith(Promise.resolve().then(async () => {
      const cache = await caches.open(await selectOrCreateActiveCache()); // IDEA: can we cache this choice in a HOF?

      const response = await cache.match(event.request).then(resp => resp || fetch(event.request));
      cache.put(event.request, response.clone());

      return response;
    }));
  }
});
