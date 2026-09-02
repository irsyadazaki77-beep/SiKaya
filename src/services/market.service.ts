import { YahooMarketQuote } from '../types/api.ts';
import { Logger } from '../utils/logger.ts';

export class MarketBackendService {
  private static cachedCookie: string | null = null;
  private static cachedCrumb: string | null = null;
  private static lastFetchedTime = 0;

  private static async getYahooCredentials(): Promise<{ cookie: string; crumb: string }> {
    const now = Date.now();
    // Cache credentials for 30 minutes (1800000 ms)
    if (this.cachedCookie && this.cachedCrumb && now - this.lastFetchedTime < 1800000) {
      return { cookie: this.cachedCookie, crumb: this.cachedCrumb };
    }

    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    const fcRes = await fetch("https://fc.yahoo.com", {
      headers: { "User-Agent": userAgent },
    });

    let setCookies: string[] = [];
    if (typeof fcRes.headers.getSetCookie === "function") {
      setCookies = fcRes.headers.getSetCookie();
    } else {
      const rawCookie = fcRes.headers.get("set-cookie");
      if (rawCookie) {
        setCookies = [rawCookie];
      }
    }

    if (setCookies.length === 0) {
      throw new Error("No set-cookie headers returned from fc.yahoo.com");
    }

    const cookieHeader = setCookies.map((c) => c.split(";")[0]).join("; ");

    const crumbRes = await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb", {
      headers: {
        Cookie: cookieHeader,
        "User-Agent": userAgent,
      },
    });

    if (!crumbRes.ok) {
      throw new Error(`Failed to fetch crumb: ${crumbRes.status} ${crumbRes.statusText}`);
    }

    const crumb = await crumbRes.text();
    if (!crumb || crumb.trim() === "") {
      throw new Error("Empty crumb returned from Yahoo");
    }

    this.cachedCookie = cookieHeader;
    this.cachedCrumb = crumb.trim();
    this.lastFetchedTime = now;

    return { cookie: cookieHeader, crumb: this.cachedCrumb };
  }

  static async fetchLiveMarketData(): Promise<YahooMarketQuote[] | null> {
    const symbols = [
      "BBRI.JK",
      "TLKM.JK",
      "GOTO.JK",
      "BBCA.JK",
      "AAPL",
      "NVDA",
      "TSLA",
      "BTC-USD",
      "GC=F",
    ].join(",");

    let cookie: string | null = null;
    let crumb: string | null = null;

    try {
      const creds = await this.getYahooCredentials();
      cookie = creds.cookie;
      crumb = creds.crumb;
    } catch (credError: unknown) {
      const err = credError as { message?: string };
      Logger.warn("Could not fetch Yahoo credentials, attempting request without crumb:", { error: err?.message });
    }

    const hosts = ["query1.finance.yahoo.com", "query2.finance.yahoo.com"];

    for (const host of hosts) {
      try {
        const url = crumb
          ? `https://${host}/v7/finance/quote?symbols=${symbols}&crumb=${crumb}`
          : `https://${host}/v7/finance/quote?symbols=${symbols}`;

        const headers: Record<string, string> = {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        };
        if (cookie) {
          headers["Cookie"] = cookie;
        }

        const response = await fetch(url, { headers });

        if (!response.ok) {
          throw new Error(`Yahoo Finance host ${host} responded with status ${response.status}`);
        }

        const data = await response.json() as { quoteResponse?: { result?: YahooMarketQuote[] } };
        if (data?.quoteResponse?.result && Array.isArray(data.quoteResponse.result) && data.quoteResponse.result.length > 0) {
          return data.quoteResponse.result;
        }
      } catch (hostError: unknown) {
        const err = hostError as { message?: string };
        Logger.warn(`Yahoo Finance host ${host} attempt failed:`, { error: err?.message });
      }
    }
    return null;
  }

  static getMockMarketData(): YahooMarketQuote[] {
    return [
      {
        symbol: "BBRI.JK",
        regularMarketPrice: 4580,
        regularMarketChangePercent: 1.1,
        regularMarketChange: 50,
        regularMarketPreviousClose: 4530,
        shortName: "Bank Rakyat Indonesia",
      },
      {
        symbol: "TLKM.JK",
        regularMarketPrice: 3820,
        regularMarketChangePercent: -0.52,
        regularMarketChange: -20,
        regularMarketPreviousClose: 3840,
        shortName: "Telkom Indonesia",
      },
      {
        symbol: "GOTO.JK",
        regularMarketPrice: 58,
        regularMarketChangePercent: 1.75,
        regularMarketChange: 1,
        regularMarketPreviousClose: 57,
        shortName: "GoTo Gojek Tokopedia",
      },
      {
        symbol: "BBCA.JK",
        regularMarketPrice: 9850,
        regularMarketChangePercent: 0.77,
        regularMarketChange: 75,
        regularMarketPreviousClose: 9775,
        shortName: "Bank Central Asia",
      },
      {
        symbol: "AAPL",
        regularMarketPrice: 182.5,
        regularMarketChangePercent: 0.45,
        regularMarketChange: 0.82,
        regularMarketPreviousClose: 181.68,
        shortName: "Apple Inc.",
      },
      {
        symbol: "NVDA",
        regularMarketPrice: 910.2,
        regularMarketChangePercent: 2.85,
        regularMarketChange: 25.2,
        regularMarketPreviousClose: 885.0,
        shortName: "NVIDIA Corporation",
      },
      {
        symbol: "TSLA",
        regularMarketPrice: 175.4,
        regularMarketChangePercent: -1.25,
        regularMarketChange: -2.22,
        regularMarketPreviousClose: 177.62,
        shortName: "Tesla, Inc.",
      },
      {
        symbol: "BTC-USD",
        symbolName: "Bitcoin USD",
        regularMarketPrice: 65420.0,
        regularMarketChangePercent: 1.88,
        regularMarketChange: 1210.0,
        regularMarketPreviousClose: 64210.0,
        shortName: "Bitcoin USD",
      },
      {
        symbol: "GC=F",
        regularMarketPrice: 2320.5,
        regularMarketChangePercent: 0.35,
        regularMarketChange: 8.1,
        regularMarketPreviousClose: 2312.4,
        shortName: "Gold",
      },
    ];
  }
}
