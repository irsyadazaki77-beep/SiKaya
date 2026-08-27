import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Standard API error response envelope
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Global Express Error Handling Middleware.
 * Catches all errors from synchronous and asynchronous route handlers.
 * Ensures no sensitive information, internal stack traces, or credentials are leaked in production.
 */
export function globalErrorHandler(
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  const isProduction = process.env.NODE_ENV === 'production';
  const statusCode = (err as AppError).statusCode || (err instanceof ZodError ? 400 : 500);
  const errorCode = (err as AppError).code || (err instanceof ZodError ? 'VALIDATION_ERROR' : statusCode === 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR');

  // Securely log error detail to server console
  console.error(`[Express Error] [${req.method}] ${req.originalUrl} | Status: ${statusCode} | Code: ${errorCode}`);
  console.error(err.stack || err);

  // Handle Zod Schema Validation Error
  if (err instanceof ZodError) {
    const firstIssue = err.issues[0];
    const pathPrefix = firstIssue?.path?.length ? `[${firstIssue.path.join('.')}] ` : '';
    const userMessage = `${pathPrefix}${firstIssue?.message || 'Data input tidak valid.'}`;

    const response: ApiErrorResponse = {
      error: {
        code: 'VALIDATION_ERROR',
        message: userMessage,
        details: isProduction ? undefined : err.format(),
      },
    };
    return res.status(400).json(response);
  }

  // If client-safe operational error
  if (err instanceof AppError && err.isOperational) {
    const response: ApiErrorResponse = {
      error: {
        code: err.code,
        message: err.message,
      },
    };
    return res.status(statusCode).json(response);
  }

  // Handle Firebase Admin Auth specific errors gracefully without leaking internals
  const errorMessage = err.message || '';
  if (errorMessage.includes('auth/id-token-expired')) {
    return res.status(401).json({
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Sesi autentikasi telah kedaluwarsa. Silakan login kembali.',
      },
    });
  }

  if (
    errorMessage.includes('auth/invalid-id-token') ||
    errorMessage.includes('auth/argument-error') ||
    errorMessage.includes('Decoding Firebase ID token failed')
  ) {
    return res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Token autentikasi tidak valid.',
      },
    });
  }

  // Handle generic 500 internal errors
  const clientMessage = isProduction
    ? 'Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.'
    : err.message || 'Terjadi kesalahan internal pada server.';

  const response: ApiErrorResponse = {
    error: {
      code: isProduction ? 'INTERNAL_ERROR' : errorCode,
      message: clientMessage,
    },
  };

  return res.status(statusCode).json(response);
}

/**
 * 404 handler for undefined API routes
 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.`,
    },
  });
}
