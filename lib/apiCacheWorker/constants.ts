// the threshold at which a cache becomes expired, relative to the "current"
// time, in milliseconds.
export const defaultCacheExpirationThreshold = 5 * 60 * 1000; // 5 minutes

export const feedBucketKey = 'feeds' as const;
export const weatherBucketKey = 'weather' as const;
