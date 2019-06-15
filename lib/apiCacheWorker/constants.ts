// the threshold at which a cache becomes expired, relative to the "current"
// time, in milliseconds.
export const cacheExpirationThreshold = 5 * 60 * 1000; // 5 minutes

export const feedBucketKey = 'feed' as const;
export const weatherBucketKey = 'weather' as const;
