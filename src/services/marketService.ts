import { fetchLiveMarketData, MarketDataState, MarketQuote } from '../lib/marketApi';

export const marketService = {
  async getMarketData(): Promise<MarketDataState> {
    try {
      const result = await fetchLiveMarketData();
      return result;
    } catch (err) {
      console.error('[marketService] Failed to fetch market data:', err);
      return {
        quotes: {},
        source: 'unavailable',
        lastUpdated: null,
        isRealtime: false,
        isStale: true,
        isSimulated: false,
        status: 'unavailable',
        errorMessage: 'Data pasar tidak dapat diakses saat ini.'
      };
    }
  },

  async getQuoteForSymbol(symbol: string): Promise<MarketQuote | null> {
    try {
      const data = await fetchLiveMarketData();
      return data.quotes[symbol] || null;
    } catch (err) {
      console.error(`[marketService] Failed to fetch quote for ${symbol}:`, err);
      return null;
    }
  }
};
