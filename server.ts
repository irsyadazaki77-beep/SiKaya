import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import helmet from "helmet";
import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from "uuid";

import { validateEnvironment } from "./src/lib/env.ts";
import { apiRouter } from "./src/routes/api.ts";
import { authenticate } from "./src/middleware/authenticate.ts";
import {
  generalApiLimiter,
  aiChatLimiter,
  authLimiter,
} from "./src/middleware/rateLimiter.ts";
import {
  globalErrorHandler,
  notFoundHandler,
  AppError,
} from "./src/middleware/errorHandler.ts";
import { ChatRequestSchema } from "./src/lib/schemas.ts";
import { Logger } from "./src/utils/logger.ts";

async function startServer() {
  // 1. Validate Environment Variables at Startup
  const envConfig = validateEnvironment();
  const isProduction = envConfig.NODE_ENV === "production";
  const PORT = envConfig.PORT;

  const app = express();

  // Trust first proxy in Google Cloud Run to get genuine client IP for rate limiting and security logs
  app.set("trust proxy", 1);

  // Request Tracing & Logging Middleware
  app.use((req, res, next) => {
    const requestId = req.headers['x-request-id'] as string || uuidv4();
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-ID', requestId);
    
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      const isApi = req.originalUrl.startsWith('/api');
      
      if (isApi) {
        Logger.info(`API Request`, {
          requestId,
          method: req.method,
          endpoint: req.originalUrl,
          status: res.statusCode,
          duration,
          ip: req.ip
        });
      }
    });
    next();
  });

  // 2. Configure Production-Grade Helmet Security Headers
  // Tailored for full security while keeping AI Studio preview & Firebase popup auth functional
  const allowedFrameAncestors = isProduction
    ? ["'none'"]
    : [
        "'self'", 
        "https://*.google.com", 
        "https://*.sandbox.google.com", 
        "https://ai.studio", 
        "https://*.aistudio.google.com", 
        "https://*.run.app", 
        "http://localhost:*"
      ];

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            "https://apis.google.com",
            "https://*.firebaseapp.com",
            "https://s3.tradingview.com",
            "https://*.tradingview.com",
          ],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
          imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
          connectSrc: [
            "'self'",
            "ws://localhost:*",
            "wss://localhost:*",
            "https://*.googleapis.com",
            "https://*.google.com",
            "https://*.firebaseio.com",
            "https://identitytoolkit.googleapis.com",
            "https://securetoken.googleapis.com",
            "https://firestore.googleapis.com",
            "https://query1.finance.yahoo.com",
            "https://query2.finance.yahoo.com",
            "https://fc.yahoo.com",
            "https://*.tradingview.com",
            "wss://*.tradingview.com",
            "blob:",
          ],
          frameSrc: [
            "'self'",
            "https://*.firebaseapp.com",
            "https://*.google.com",
            "https://*.tradingview.com",
            "https://s.tradingview.com",
          ],
          frameAncestors: allowedFrameAncestors,
          objectSrc: ["'none'"],
          upgradeInsecureRequests: isProduction ? [] : null,
        },
      },
      frameguard: false,
      noSniff: true,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      hsts: isProduction
        ? {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
          }
        : false,
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
      dnsPrefetchControl: { allow: false },
    })
  );

  // Limit body payload to prevent Denial of Service (DoS) attacks
  app.use(express.json({ limit: "50kb" }));

  // Apply general rate limiter across all /api/* routes
  app.use("/api", generalApiLimiter);

  // Cache for Yahoo Finance credentials
  let cachedCookie: string | null = null;
  let cachedCrumb: string | null = null;
  let lastFetchedTime = 0;

  async function getYahooCredentials() {
    const now = Date.now();
    // Cache credentials for 30 minutes
    if (cachedCookie && cachedCrumb && now - lastFetchedTime < 1800000) {
      return { cookie: cachedCookie, crumb: cachedCrumb };
    }

    const userAgent =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

    // 1. Fetch cookie from fc.yahoo.com
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

    // 2. Fetch crumb
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

    cachedCookie = cookieHeader;
    cachedCrumb = crumb.trim();
    lastFetchedTime = now;

    return { cookie: cookieHeader, crumb: cachedCrumb };
  }

  // Track active AI requests per user to prevent duplicate spamming
  const activeAiUsers = new Set<string>();

  // Market Data Cache State
  interface MarketCacheEntry {
    data: any[];
    timestamp: number;
  }
  let marketCache: MarketCacheEntry | null = null;
  const MARKET_CACHE_TTL_MS = 30_000; // 30 seconds
  const MARKET_CACHE_MAX_STALE_MS = 300_000; // 5 minutes
  let inFlightMarketFetch: Promise<any[] | null> | null = null;

  // Mount authenticated user and transaction routes with rate limit
  app.use("/api/user", authLimiter, apiRouter);

  // Public Health check endpoint with security metadata
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      app: "SiKaya",
      environment: envConfig.NODE_ENV
    });
  });

  // Readiness Probe
  app.get("/api/ready", (req, res) => {
    // Check if critical dependencies are initialized (e.g. Firebase Admin)
    const isFirebaseReady = process.env.FIREBASE_PROJECT_ID !== undefined;
    if (isFirebaseReady) {
      res.json({ status: "ready" });
    } else {
      res.status(503).json({ status: "not_ready", reason: "Firebase config missing" });
    }
  });

  // 3. Protected Gemini AI Chat Route with Zod Schema Validation & Concurrency Protection
  app.post(
    "/api/chat",
    authenticate,
    aiChatLimiter,
    async (req, res, next) => {
      const userUid = req.user?.uid || "unknown";

      // Prevent concurrent duplicate requests from the same user
      if (activeAiUsers.has(userUid)) {
        return res.status(429).json({
          status: "error",
          error: {
            code: "CONCURRENT_REQUEST_LIMIT",
            message: "Permintaan Anda sebelumnya masih diproses. Mohon tunggu beberapa saat sebelum mengirim pertanyaan baru."
          }
        });
      }

      activeAiUsers.add(userUid);

      try {
        if (!process.env.GEMINI_API_KEY) {
          throw new AppError(
            "API Key Gemini belum dikonfigurasi pada server.",
            500,
            "GEMINI_CONFIG_ERROR"
          );
        }

        // Validate complete body with Zod Schema
        const validatedBody = ChatRequestSchema.parse(req.body);
        const { profile, question, mood } = validatedBody;

        Logger.info(`[AI Advisor] Processing query for authenticated user`, { userUid });

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `Anda adalah SiKaya AI Financial Advisor - Perencana Keuangan Terakreditasi dan Tutor Pintar Keuangan Indonesia.
Gunakan profil data keuangan riil pengguna di bawah ini untuk memberikan nasihat terpersonalisasi, konkret, dan berbasis angka yang matematis & praktis.

PROFIL KEUANGAN LENGKAP PENGGUNA:
- Pemasukan Bulanan: Rp ${Number(profile.income).toLocaleString("id-ID")}
- Pengeluaran Bulanan: Rp ${Number(profile.expenses).toLocaleString("id-ID")}
- Dana Darurat Tersedia: Rp ${Number(profile.emergencyFund ?? profile.savings ?? 0).toLocaleString("id-ID")}
- Saldo Kas Likuid: Rp ${Number(profile.cash).toLocaleString("id-ID")}
- Total Investasi: Rp ${Number(profile.investments).toLocaleString("id-ID")}
- Total Utang: Rp ${Number(profile.totalDebt).toLocaleString("id-ID")}
- Cicilan Utang Bulanan: Rp ${Number(profile.monthlyDebt).toLocaleString("id-ID")}
- Financial Health Score: ${profile.healthScore} / 100 (${profile.healthGrade || "C"})
- Toleransi Risiko: ${profile.riskTolerance}
- Tujuan Keuangan: ${profile.goals}

GAYA BICARA / TONE OF VOICE: ${mood}
(Jika 'Profesional': Bahasa sopan, obyektif, terstruktur, berbasis analisis finansial.
 Jika 'Savage': Tegas, blak-blakan, realistis tanpa basa-basi, menyentil kebiasaan boros secara cerdas & lucu.
 Jika 'Empathetic': Ramah, hangat, memotivasi, dan menenangkan kekhawatiran finansial pengguna).

PERTANYAAN PENGGUNA: "${question}"

INSTRUKSI JAWABAN:
1. Hubungkan secara langsung dengan angka riil pengguna di atas (seperti rasio utang, ketahanan dana darurat, atau cashflow bulanan).
2. Berikan 2-3 langkah taktis dan konkret yang dapat dieksekusi hari ini.
3. Sertakan angka perhitungan atau simulasi singkat jika relevan.
4. Gunakan format Markdown yang rapi dengan poin-poin dan penekanan cetak tebal.
5. Cantumkan catatan penutup singkat bahwa seluruh analisis bersifat edukasi finansial.`;

        // Timeout wrapper for Gemini API (max 25s)
        const generatePromise = ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new AppError("Permintaan ke AI melebihi batas waktu (timeout). Silakan coba lagi.", 504, "AI_TIMEOUT")), 25000);
        });

        const response: any = await Promise.race([generatePromise, timeoutPromise]);

        res.json({
          reply: response.text,
          disclaimer: "Informasi yang diberikan bersifat edukasi dan bukan rekomendasi investasi profesional.",
          generatedAt: new Date().toISOString(),
        });
      } catch (error) {
        next(error);
      } finally {
        activeAiUsers.delete(userUid);
      }
    }
  );

  // Helper to execute live upstream fetch for Market API
  async function fetchLiveMarketData(): Promise<any[] | null> {
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
      const creds = await getYahooCredentials();
      cookie = creds.cookie;
      crumb = creds.crumb;
      } catch (credError: any) {
      Logger.warn("Could not fetch Yahoo credentials, attempting request without crumb:", { error: credError?.message });
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

        const data = await response.json();
        if (data?.quoteResponse?.result && Array.isArray(data.quoteResponse.result) && data.quoteResponse.result.length > 0) {
          return data.quoteResponse.result;
        }
      } catch (hostError: any) {
        Logger.warn(`Yahoo Finance host ${host} attempt failed:`, { error: hostError?.message });
      }
    }
    return null;
  }

  // 4. Clean Market Data Endpoint with High-Performance In-Memory Cache & Request Coalescing
  app.get("/api/stock-prices", async (req, res, next) => {
    try {
      const now = Date.now();

      // Check fresh cache
      if (marketCache && now - marketCache.timestamp < MARKET_CACHE_TTL_MS) {
        res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
        return res.json({
          status: "ok",
          source: "Yahoo Finance (Server Cache)",
          lastUpdated: new Date(marketCache.timestamp).toISOString(),
          cacheAgeSeconds: Math.floor((now - marketCache.timestamp) / 1000),
          isRealtime: true,
          isStale: false,
          isSimulated: false,
          quoteResponse: {
            result: marketCache.data,
          },
        });
      }

      // Fetch or coalesce concurrent requests
      if (!inFlightMarketFetch) {
        inFlightMarketFetch = fetchLiveMarketData()
          .then((result) => {
            if (result && Array.isArray(result) && result.length > 0) {
              marketCache = {
                data: result,
                timestamp: Date.now(),
              };
            }
            return result;
          })
          .finally(() => {
            inFlightMarketFetch = null;
          });
      }

      const rawResult = await inFlightMarketFetch;

      // Fresh data retrieved successfully
      if (rawResult && Array.isArray(rawResult) && rawResult.length > 0) {
        res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
        return res.json({
          status: "ok",
          source: "Yahoo Finance",
          lastUpdated: new Date().toISOString(),
          cacheAgeSeconds: 0,
          isRealtime: true,
          isStale: false,
          isSimulated: false,
          quoteResponse: {
            result: rawResult,
          },
        });
      }

      // Stale cache fallback if available within max stale window
      if (marketCache && now - marketCache.timestamp < MARKET_CACHE_MAX_STALE_MS) {
        Logger.warn("[Market API] Serving stale cache data due to upstream unavailability.");
        res.setHeader("Cache-Control", "public, max-age=10, stale-while-revalidate=30");
        return res.json({
          status: "ok",
          source: "Yahoo Finance (Stale Cache)",
          lastUpdated: new Date(marketCache.timestamp).toISOString(),
          cacheAgeSeconds: Math.floor((now - marketCache.timestamp) / 1000),
          isRealtime: false,
          isStale: true,
          isSimulated: false,
          quoteResponse: {
            result: marketCache.data,
          },
        });
      }

      const isMockMode = process.env.MARKET_DATA_MODE === "mock";

      // If live market provider failed, check if explicit mock mode is requested for testing
      if (isMockMode) {
        Logger.info("[Market API] MARKET_DATA_MODE=mock active. Returning explicitly tagged simulated dataset.");
        const simulatedMockResult = [
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

        return res.json({
          status: "simulated",
          source: "Simulation Engine (Mock)",
          lastUpdated: new Date().toISOString(),
          isRealtime: false,
          isStale: false,
          isSimulated: true,
          quoteResponse: {
            result: simulatedMockResult,
          },
        });
      }

      // Live provider failed and NOT in mock mode -> Return truthful unavailable response
      Logger.warn("[Market API] Live Yahoo Finance provider is unavailable. Returning structured unavailable state.");
      return res.json({
        status: "unavailable",
        source: "Yahoo Finance",
        lastUpdated: new Date().toISOString(),
        isRealtime: false,
        isStale: true,
        isSimulated: false,
        quoteResponse: {
          result: [],
        },
        message: "Data pasar sementara tidak tersedia.",
      });
    } catch (error) {
      next(error);
    }
  });

  // Catch-all 404 for undefined API routes
  app.all("/api/*", notFoundHandler);

  // Global Error Handler for API routes
  app.use(globalErrorHandler);

  // Vite middleware for development / Static file serving for production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    Logger.info(`✅ SiKaya Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  Logger.error("❌ Fatal Error starting SiKaya server:", { error: err });
  process.exit(1);
});
