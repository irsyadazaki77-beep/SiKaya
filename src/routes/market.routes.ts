import express from 'express';
import { MarketBackendService } from '../services/market.service.ts';
import { MarketCache } from '../cache/marketCache.ts';
import { Logger } from '../utils/logger.ts';
import { MarketResponse } from '../types/api.ts';

export const marketRouter = express.Router();

marketRouter.get('/stock-prices', async (req, res, next) => {
  try {
    const now = Date.now();
    const marketCache = MarketCache.get();

    if (MarketCache.isFresh() && marketCache) {
      res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
      const responseBody: MarketResponse = {
        status: 'ok',
        source: 'Yahoo Finance (Server Cache)',
        lastUpdated: new Date(marketCache.timestamp).toISOString(),
        cacheAgeSeconds: Math.floor((now - marketCache.timestamp) / 1000),
        isRealtime: true,
        isStale: false,
        isSimulated: false,
        quoteResponse: {
          result: marketCache.data,
        },
      };
      return res.json(responseBody);
    }

    let inFlightMarketFetch = MarketCache.getInFlightFetch();
    if (!inFlightMarketFetch) {
      inFlightMarketFetch = MarketBackendService.fetchLiveMarketData()
        .then((result) => {
          if (result && Array.isArray(result) && result.length > 0) {
            MarketCache.set(result);
          }
          return result;
        })
        .finally(() => {
          MarketCache.setInFlightFetch(null);
        });
      MarketCache.setInFlightFetch(inFlightMarketFetch);
    }

    const rawResult = await inFlightMarketFetch;

    if (rawResult && Array.isArray(rawResult) && rawResult.length > 0) {
      res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
      const responseBody: MarketResponse = {
        status: 'ok',
        source: 'Yahoo Finance',
        lastUpdated: new Date().toISOString(),
        cacheAgeSeconds: 0,
        isRealtime: true,
        isStale: false,
        isSimulated: false,
        quoteResponse: {
          result: rawResult,
        },
      };
      return res.json(responseBody);
    }

    if (marketCache && MarketCache.isWithinStaleWindow()) {
      Logger.warn('[Market API] Serving stale cache data due to upstream unavailability.');
      res.setHeader('Cache-Control', 'public, max-age=10, stale-while-revalidate=30');
      const responseBody: MarketResponse = {
        status: 'ok',
        source: 'Yahoo Finance (Stale Cache)',
        lastUpdated: new Date(marketCache.timestamp).toISOString(),
        cacheAgeSeconds: Math.floor((now - marketCache.timestamp) / 1000),
        isRealtime: false,
        isStale: true,
        isSimulated: false,
        quoteResponse: {
          result: marketCache.data,
        },
      };
      return res.json(responseBody);
    }

    const isMockMode = process.env.MARKET_DATA_MODE === 'mock';

    if (isMockMode) {
      Logger.info('[Market API] MARKET_DATA_MODE=mock active. Returning explicitly tagged simulated dataset.');
      const simulatedMockResult = MarketBackendService.getMockMarketData();

      const responseBody: MarketResponse = {
        status: 'simulated',
        source: 'Simulation Engine (Mock)',
        lastUpdated: new Date().toISOString(),
        isRealtime: false,
        isStale: false,
        isSimulated: true,
        quoteResponse: {
          result: simulatedMockResult,
        },
      };
      return res.json(responseBody);
    }

    // Robust Fallback: When upstream live data provider is unreachable, seamlessly
    // provide the baseline simulation dataset so learners never get a blank trading simulator.
    Logger.warn('[Market API] Live Yahoo Finance provider unreachable. Seamlessly activating simulation fallback dataset.');
    const fallbackDataset = MarketBackendService.getMockMarketData();
    res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=30');
    const responseBody: MarketResponse = {
      status: 'simulated',
      source: 'Simulation Engine (Fallback)',
      lastUpdated: new Date().toISOString(),
      isRealtime: false,
      isStale: false,
      isSimulated: true,
      quoteResponse: {
        result: fallbackDataset,
      },
      message: 'Data pasar menggunakan dataset simulasi terintegrasi SiKaya.',
    };
    return res.json(responseBody);
  } catch (error) {
    next(error);
  }
});

export default marketRouter;
