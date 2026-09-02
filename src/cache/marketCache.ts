import { MarketCacheEntry, YahooMarketQuote } from '../types/api.ts';

export class MarketCache {
  private static cache: MarketCacheEntry | null = null;
  private static inFlightFetch: Promise<YahooMarketQuote[] | null> | null = null;
  
  static readonly TTL_MS = 30_000; // 30 seconds
  static readonly MAX_STALE_MS = 300_000; // 5 minutes

  static get(): MarketCacheEntry | null {
    return this.cache;
  }

  static set(data: YahooMarketQuote[]): void {
    this.cache = {
      data,
      timestamp: Date.now()
    };
  }

  static isFresh(): boolean {
    if (!this.cache) return false;
    return Date.now() - this.cache.timestamp < this.TTL_MS;
  }

  static isWithinStaleWindow(): boolean {
    if (!this.cache) return false;
    return Date.now() - this.cache.timestamp < this.MAX_STALE_MS;
  }

  static getInFlightFetch(): Promise<YahooMarketQuote[] | null> | null {
    return this.inFlightFetch;
  }

  static setInFlightFetch(promise: Promise<YahooMarketQuote[] | null> | null): void {
    this.inFlightFetch = promise;
  }
}
