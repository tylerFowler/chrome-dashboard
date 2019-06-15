// ExpireableCacheBucket is a simple data structure that can be used as a cache
// key to encode the time period it covers, with a simple method to determine
// if a cache's contents have expired based only on its bucket name.
export default class ExpirableCacheBucket {
  public key: string;
  private baseTime: Date;
  private maxAgeMs: number;

  constructor(key: string, maxAgeMs: number, date = new Date()) {
    this.key = key;
    this.baseTime = date;
    this.maxAgeMs = maxAgeMs;
  }

  // expired checks whether a given bucket has passed its expiry threshold in
  // milliseconds compared to a given reference time, or the current time if none
  // is given.
  public expired(checkTime: Date = new Date()): boolean {
    return Math.abs(checkTime.getTime() - this.baseTime.getTime()) > this.maxAgeMs;
  }

  public toString(): string {
    return `${this.key}_${this.baseTime.toISOString()}_${this.maxAgeMs}`;
  }

  public static fromString(src: string): ExpirableCacheBucket {
    const [ key, timeStr, maxAgeStr ] = src.split('_');
    if (!timeStr || !maxAgeStr) {
      return undefined;
    }

    return new ExpirableCacheBucket(key, parseInt(maxAgeStr, 10), new Date(timeStr));
  }
}
