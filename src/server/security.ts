import helmet from 'helmet';
import express, { Express } from 'express';

export function configureSecurity(app: Express, isProduction: boolean): void {
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

  app.use(express.json({ limit: '50kb' }));
}
