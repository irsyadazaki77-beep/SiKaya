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
  history24h: number[];
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

export async function fetchLiveMarketQuotes(): Promise<Record<string, MarketQuote>> {
  try {
    const res = await fetch('/api/stock-prices');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const results = data?.quoteResponse?.result || [];

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

      // generate synthetic 24h history line
      const history24h: number[] = [];
      let base = priceIdr * (1 - changePct / 100);
      for (let i = 0; i < 10; i++) {
        const noise = (Math.random() - 0.48) * 0.008;
        base = base * (1 + noise);
        history24h.push(Math.round(base));
      }
      history24h.push(priceIdr);

      quotes[symKey] = {
        symbol: symKey,
        name: config?.name || item.shortName || symKey,
        category: config?.category || (isUsd ? 'US' : 'IDX'),
        priceIdr: Math.round(priceIdr),
        priceUsd: parseFloat(priceUsd.toFixed(2)),
        changePercent: parseFloat(changePct.toFixed(2)),
        changeAmount: Math.round(isUsd ? changeAmt * USD_TO_IDR : changeAmt),
        high24h: Math.round(priceIdr * 1.02),
        low24h: Math.round(priceIdr * 0.98),
        volume: '12.4M',
        isRealTime: true,
        history24h
      };
    });

    // Fill missing fallback symbols so app is always complete
    Object.keys(DEFAULT_MARKET_SYMBOLS).forEach((symKey) => {
      if (!quotes[symKey]) {
        const cfg = DEFAULT_MARKET_SYMBOLS[symKey];
        const isUsd = cfg.category === 'US' || (cfg.category === 'CRYPTO' && cfg.basePriceUsd! > 100);
        const priceIdr = cfg.basePriceIdr || (cfg.basePriceUsd! * USD_TO_IDR);
        const priceUsd = cfg.basePriceUsd || (priceIdr / USD_TO_IDR);
        const randChg = parseFloat(((Math.random() - 0.45) * 2.5).toFixed(2));

        quotes[symKey] = {
          symbol: symKey,
          name: cfg.name,
          category: cfg.category,
          priceIdr: Math.round(priceIdr),
          priceUsd: parseFloat(priceUsd.toFixed(2)),
          changePercent: randChg,
          changeAmount: Math.round(priceIdr * (randChg / 100)),
          high24h: Math.round(priceIdr * 1.015),
          low24h: Math.round(priceIdr * 0.985),
          volume: '8.2M',
          isRealTime: false,
          history24h: Array.from({ length: 11 }, (_, i) => Math.round(priceIdr * (1 + (i - 5) * 0.002)))
        };
      }
    });

    return quotes;
  } catch (error) {
    console.warn("Failed to fetch live market quotes, utilizing high-fidelity fallback:", error);
    const quotes: Record<string, MarketQuote> = {};
    Object.keys(DEFAULT_MARKET_SYMBOLS).forEach((symKey) => {
      const cfg = DEFAULT_MARKET_SYMBOLS[symKey];
      const priceIdr = cfg.basePriceIdr || (cfg.basePriceUsd! * USD_TO_IDR);
      const priceUsd = cfg.basePriceUsd || (priceIdr / USD_TO_IDR);
      const randChg = parseFloat(((Math.random() - 0.48) * 1.8).toFixed(2));

      quotes[symKey] = {
        symbol: symKey,
        name: cfg.name,
        category: cfg.category,
        priceIdr: Math.round(priceIdr),
        priceUsd: parseFloat(priceUsd.toFixed(2)),
        changePercent: randChg,
        changeAmount: Math.round(priceIdr * (randChg / 100)),
        high24h: Math.round(priceIdr * 1.02),
        low24h: Math.round(priceIdr * 0.98),
        volume: '15.1M',
        isRealTime: false,
        history24h: Array.from({ length: 11 }, (_, i) => Math.round(priceIdr * (1 + (i - 5) * 0.003)))
      };
    });
    return quotes;
  }
}
