/*
 * Note that, as of June 2019, there are no official typings for the Service Worker
 * events, so for now 'any' is used, along with ad hoc types where necessary.
 */

// the threshold at which a cache becomes expired, relative to the "current"
// time, in milliseconds.
const cacheExpirationThreshold = 5 * 60 * 1000; // 5 minutes

// ExpireableCacheBucket is a simple data structure that can be used as a cache
// key to encode the time period it covers, with a simple method to determine
// if a cache's contents have expired based only on its bucket name.
class ExpirableCacheBucket {
  private baseTime: Date;
  private maxAgeMs: number;

  constructor(maxAgeMs: number, date = new Date()) {
    this.baseTime = date;
    this.maxAgeMs = maxAgeMs;
  }

  public expired(checkTime: Date) {
    const s = Math.abs(checkTime.getTime() - this.baseTime.getTime()) > this.maxAgeMs;
    return s;
  }

  public toString(): string {
    return `${this.baseTime.toISOString()}_${this.maxAgeMs}`;
  }

  public static fromString(src: string): ExpirableCacheBucket {
    const [ timeStr, maxAgeStr ] = src.split('_');
    if (!timeStr || !maxAgeStr) {
      return undefined;
    }

    return new ExpirableCacheBucket(parseInt(maxAgeStr, 10), new Date(timeStr));
  }
}

// selectActiveCache iterates through all active caches, selecting the one that
// is not yet expired, if one exists. If multiple active caches exist, the first
// seen will be selected.
async function selectActiveCache(): Promise<string> {
  const curTime = new Date();
  const cacheList = await caches.keys();

  return cacheList
    .map(ExpirableCacheBucket.fromString)
    .filter(bucket => bucket && !bucket.expired(curTime))
    .map(bucket => bucket.toString())
    .find(() => true); // select the first remaining element
}

// the activation handler removes any caches that are not selected as the 'active'
// cache, leaving only one active cache behind even if multiple caches are technically
// active. If no cache is selected as being active then all will be removed. Finally
// the cache that will be used for the session is created, if it doesn't exist.
self.addEventListener('activate', (event: any) => event.waitUntil(
  selectActiveCache()
    .then(activeCache => {
      if (!activeCache) {
        activeCache = (new ExpirableCacheBucket(cacheExpirationThreshold).toString());
      }

      // ensure that the active cache is created on activation
      return caches.open(activeCache).then(() => activeCache);
    })
    .then((activeCache => caches.keys().then(openCaches =>
      Promise.all(openCaches
        .filter(c => activeCache && c !== activeCache.toString())
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

// cacheFeedResponse puts a given request/response into the Service Worker's
// cache.
async function cacheFeedResponse(request: Request, response: Response) {
  let activeCache = await selectActiveCache();
  if (!activeCache) {
    activeCache = (new ExpirableCacheBucket(cacheExpirationThreshold)).toString();
  }

  const cache = await caches.open(activeCache);

  cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (event: any) => {
  // TODO: select the active cache (or otherwise create it) then use match on that,
  // we never want to use caches.match for these as they are extremely time sensitive
  // TODO: right now each request that happens in parallel is going to create its
  // own cache, need to inline cacheFeedResponse here and ensure that the cache
  // populated is the one matched against, so it can be created right away.
  if (isFeedRequest(event.request)) {
    event.respondWith(caches.match(event.request).then(resp =>
      resp || fetch(event.request)
        .then(freshResponse => cacheFeedResponse(event.request, freshResponse)),
    ));
  }
});
