export type MarketStatus = 'ok' | 'simulated' | 'unavailable' | 'not_ready';

export interface YahooMarketQuote {
  symbol: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  regularMarketChange?: number;
  regularMarketPreviousClose?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
  shortName?: string;
  symbolName?: string;
}

export interface MarketResponse {
  status: MarketStatus;
  source: string;
  lastUpdated: string;
  cacheAgeSeconds?: number;
  isRealtime: boolean;
  isStale: boolean;
  isSimulated: boolean;
  quoteResponse: {
    result: YahooMarketQuote[];
  };
  message?: string;
}

export interface MarketCacheEntry {
  data: YahooMarketQuote[];
  timestamp: number;
}

export interface ReadinessResponse {
  status: 'ready' | 'not_ready';
  checks: {
    firebase: 'ok' | 'fail';
    environment: 'ok' | 'fail';
  };
}
