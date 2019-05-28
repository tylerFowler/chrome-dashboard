// ExpireableCacheBucket is a simple data structure that can be used as a cache
// key to encode the time period it covers, with a simple method to determine
// if a cache's contents have expired based only on its bucket name.
export default class ExpirableCacheBucket {
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
