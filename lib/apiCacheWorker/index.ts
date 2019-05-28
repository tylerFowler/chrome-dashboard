/*
 * The API Cache Worker is a Service Worker that intercepts all requests to outside
 * APIs (such as feed data sources), caching their responses for a short amount
 * of time (5 minutes). This should drastically decrease the number of requests
 * made to these services as users may frequently open new tabs in very short
 * spans of time. Additionally this allows us to serve old stories when the user
 * is offline for a short period of time. This Service Worker also takes care to
 * remove caches that are expired to avoid taking up disk space.
 *
 * This TTL behavior is implemented by using dynamic cache names that encode their
 * creation time and max age, and are dynamically discovered via the CacheStorage
 * API.
 *
 * TODO: add a special 'offline' cache that gets updated with all incoming responses
 * and is used to serve to the user when no newer cache exists and new connections
 * are refused. The contents of this cache should have no time limit but should
 * be cleared after the user comes online, when this happens ideally the new results
 * are then pushed to the main app.
 *  Use case: user closes their laptop, two days later they open it and while the
 *  network driver is initializing their new tabs are populated with the last known
 *  responses when they shut their laptop.
 *
 * Note that, as of June 2019, there are no official typings for the Service Worker
 * events, so for now 'any' is used, along with ad hoc types where necessary.
 */

import ExpirableCacheBucket from './expirableCacheBucket';
import { cacheExpirationThreshold } from './constants';
import { isCachableRequest as isHNRequest } from 'lib/hn/api';
import { isCachableRequest as isDNRequest } from 'lib/dn/api';

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

function isFeedRequest(req: Request): boolean {
  return isHNRequest(req) || isDNRequest(req);
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
