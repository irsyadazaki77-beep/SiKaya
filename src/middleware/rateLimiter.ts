import rateLimit, { type RateLimitRequestHandler } from 'express-rate-limit';
import type { Request, Response } from 'express';

/**
 * Rate limiter for general /api/* endpoints
 */
export const generalApiLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 300 : 99999, // Limit each IP to 300 requests in production, relax in dev
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Terlalu banyak permintaan ke server. Silakan coba beberapa saat lagi.',
    },
  },
  handler: (req: Request, res: Response, _next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * Rate limiter for /api/chat (AI Advisor endpoint).
 * Uses authenticated Firebase UID when available, preventing IP-sharing throttling for multi-user networks.
 * Falls back to proxy-safe IP address for unauthenticated requests.
 */
export const aiChatLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 30 : 9999, // Limit each user / IP to 30 AI prompts in production, relax in dev
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    // If request passed authentication middleware, use user's UID
    if (req.user && req.user.uid) {
      return `user_${req.user.uid}`;
    }
    // Otherwise fallback to IP
    return `ip_${req.ip || req.socket.remoteAddress || 'unknown'}`;
  },
  message: {
    error: {
      code: 'AI_RATE_LIMIT_EXCEEDED',
      message: 'Batas penggunaan asisten AI SiKaya tercapai (maks 30 pertanyaan per 15 menit). Silakan coba lagi nanti.',
    },
  },
  handler: (req: Request, res: Response, _next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * Rate limiter for authentication or login-sensitive endpoints
 */
export const authLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 20 : 9999, // Max 20 attempts in production, relax in dev
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Terlalu banyak percobaan autentikasi dari alamat ini. Silakan tunggu beberapa menit.',
    },
  },
  handler: (req: Request, res: Response, _next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});
