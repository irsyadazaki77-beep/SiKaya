export interface MarketQuote {
  symbol: string;
  name: string;
  category: 'IDX' | 'US' | 'CRYPTO' | 'COMMODITY';
  priceIdr: number;
  priceUsd: number;
  changePercent: number;
  changeAmount: number;
  high24h: number;
  low24h: number;
  volume: string;
  isRealTime: boolean;
  isSimulated: boolean;
  history24h: number[];
}

export interface MarketDataState {
  quotes: Record<string, MarketQuote>;
  source: string;
  lastUpdated: string | null;
  isRealtime: boolean;
  isStale: boolean;
  isSimulated: boolean;
  status: 'ok' | 'simulated' | 'unavailable' | 'loading' | 'error';
  errorMessage?: string;
}

const USD_TO_IDR = 16250;

export const DEFAULT_MARKET_SYMBOLS: Record<string, { name: string; category: 'IDX' | 'US' | 'CRYPTO' | 'COMMODITY'; basePriceUsd?: number; basePriceIdr?: number }> = {
  'BBRI': { name: 'Bank Rakyat Indonesia Tbk', category: 'IDX', basePriceIdr: 4580 },
  'BBCA': { name: 'Bank Central Asia Tbk', category: 'IDX', basePriceIdr: 9850 },
  'TLKM': { name: 'Telkom Indonesia Tbk', category: 'IDX', basePriceIdr: 3820 },
  'GOTO': { name: 'GoTo Gojek Tokopedia Tbk', category: 'IDX', basePriceIdr: 58 },
  'ASII': { name: 'Astra International Tbk', category: 'IDX', basePriceIdr: 5150 },
  'AMMN': { name: 'Amman Mineral Internasional', category: 'IDX', basePriceIdr: 8800 },
  'ANTM': { name: 'Aneka Tambang Tbk', category: 'IDX', basePriceIdr: 1620 },
  'AAPL': { name: 'Apple Inc.', category: 'US', basePriceUsd: 182.5 },
  'NVDA': { name: 'NVIDIA Corporation', category: 'US', basePriceUsd: 910.2 },
  'TSLA': { name: 'Tesla Inc.', category: 'US', basePriceUsd: 175.4 },
  'MSFT': { name: 'Microsoft Corp.', category: 'US', basePriceUsd: 420.5 },
  'BTC': { name: 'Bitcoin', category: 'CRYPTO', basePriceUsd: 65420 },
  'ETH': { name: 'Ethereum', category: 'CRYPTO', basePriceUsd: 3450 },
  'SOL': { name: 'Solana', category: 'CRYPTO', basePriceUsd: 145.2 },
  'GOLD': { name: 'Emas Murni 24K (Gram)', category: 'COMMODITY', basePriceIdr: 1350000 },
  'SBN019': { name: 'Sukuk Ritel SBR019', category: 'COMMODITY', basePriceIdr: 1000000 }
};

export async function fetchLiveMarketData(): Promise<MarketDataState> {
  try {
    const res = await fetch('/api/stock-prices');
    if (!res.ok) {
      return {
        quotes: {},
        source: 'Yahoo Finance',
        lastUpdated: null,
        isRealtime: false,
        isStale: true,
        isSimulated: false,
        status: 'unavailable',
        errorMessage: 'Data pasar sementara tidak tersedia.'
      };
    }

    const data = await res.json();
    const results = data?.quoteResponse?.result || [];
    const isSimulated = Boolean(data?.isSimulated);
    const isRealtime = Boolean(data?.isRealtime);
    const source = data?.source || 'Yahoo Finance';
    const lastUpdated = data?.lastUpdated || new Date().toISOString();
    const status = data?.status || (results.length > 0 ? 'ok' : 'unavailable');

    if (status === 'unavailable' || results.length === 0) {
      return {
        quotes: {},
        source,
        lastUpdated,
        isRealtime: false,
        isStale: true,
        isSimulated: false,
        status: 'unavailable',
        errorMessage: data?.message || 'Data pasar sementara tidak tersedia.'
      };
    }

    const quotes: Record<string, MarketQuote> = {};

    results.forEach((item: any) => {
      let symKey = item.symbol;
      if (symKey.endsWith('.JK')) symKey = symKey.replace('.JK', '');
      if (symKey === 'BTC-USD') symKey = 'BTC';
      if (symKey === 'GC=F') symKey = 'GOLD';

      const config = DEFAULT_MARKET_SYMBOLS[symKey];
      const isUsd = item.symbol.includes('AAPL') || item.symbol.includes('NVDA') || item.symbol.includes('TSLA') || item.symbol.includes('BTC') || item.symbol.includes('MSFT');

      const rawPrice = item.regularMarketPrice || 0;
      const changePct = item.regularMarketChangePercent || 0;
      const changeAmt = item.regularMarketChange || 0;

      const priceUsd = isUsd ? rawPrice : rawPrice / USD_TO_IDR;
      const priceIdr = isUsd ? rawPrice * USD_TO_IDR : rawPrice;

      quotes[symKey] = {
        symbol: symKey,
        name: config?.name || item.shortName || symKey,
        category: config?.category || (isUsd ? 'US' : 'IDX'),
        priceIdr: Math.round(priceIdr),
        priceUsd: parseFloat(priceUsd.toFixed(2)),
        changePercent: parseFloat(changePct.toFixed(2)),
        changeAmount: Math.round(isUsd ? changeAmt * USD_TO_IDR : changeAmt),
        high24h: item.regularMarketDayHigh ? (isUsd ? item.regularMarketDayHigh * USD_TO_IDR : item.regularMarketDayHigh) : Math.round(priceIdr * 1.02),
        low24h: item.regularMarketDayLow ? (isUsd ? item.regularMarketDayLow * USD_TO_IDR : item.regularMarketDayLow) : Math.round(priceIdr * 0.98),
        volume: item.regularMarketVolume ? (item.regularMarketVolume > 1e6 ? `${(item.regularMarketVolume / 1e6).toFixed(1)}M` : `${(item.regularMarketVolume / 1e3).toFixed(1)}K`) : '12.4M',
        isRealTime: isRealtime,
        isSimulated: isSimulated,
        history24h: [priceIdr * 0.99, priceIdr * 0.995, priceIdr * 1.002, priceIdr]
      };
    });

    return {
      quotes,
      source,
      lastUpdated,
      isRealtime,
      isStale: Boolean(data?.isStale),
      isSimulated,
      status: isSimulated ? 'simulated' : 'ok'
    };
  } catch (error) {
    console.warn("Market API fetch encountered an error:", error);
    return {
      quotes: {},
      source: 'Yahoo Finance',
      lastUpdated: null,
      isRealtime: false,
      isStale: true,
      isSimulated: false,
      status: 'unavailable',
      errorMessage: 'Data pasar sementara tidak tersedia.'
    };
  }
}

/**
 * Backward compatibility helper
 */
export async function fetchLiveMarketQuotes(): Promise<Record<string, MarketQuote>> {
  const data = await fetchLiveMarketData();
  return data.quotes;
}
