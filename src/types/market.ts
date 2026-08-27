export type MarketStatus = 'open' | 'closed' | 'mock' | 'unavailable';

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  currency: string;
  exchange: string;
  marketCap?: number;
  peRatio?: number;
  dividendYield?: number;
  roe?: number;
  der?: number;
  sector?: string;
  category?: string;
  updatedAt: string;
}

export interface MarketResponse {
  data: MarketQuote[];
  meta: {
    source: 'yahoo-finance' | 'mock-simulation' | 'cache' | 'unavailable';
    timestamp: string;
    isMock: boolean;
    disclaimer: string;
  };
}

export interface MarketNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url?: string;
  publishedAt: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NETRAL';
  sentimentScore: number; // -1.0 to 1.0
  relatedSymbols: string[];
  aiInsight?: string;
}
