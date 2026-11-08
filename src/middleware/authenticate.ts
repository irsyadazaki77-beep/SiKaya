import type { Request, Response, NextFunction } from 'express';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { adminAuth } from '../lib/firebase-admin.ts';
import { AppError } from './errorHandler.ts';

// Type augmentation for Express Request
declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: DecodedIdToken;
}

/**
 * Reusable Firebase Authentication Middleware.
 * Extracts and verifies Firebase ID token from the Authorization header.
 * Attaches decoded token to `req.user` on success.
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new AppError(
        'Token autentikasi tidak ditemukan atau format header Authorization tidak valid.',
        401,
        'UNAUTHORIZED'
      )
    );
  }

  const token = authHeader.substring(7).trim();

  if (!token) {
    return next(
      new AppError(
        'Token autentikasi kosong. Silakan sertakan token yang valid.',
        401,
        'MISSING_TOKEN'
      )
    );
  }

  // Allow isolated demo token in non-production environments for guest access & automated testing
  if (token === 'demo-token' && process.env.NODE_ENV !== 'production') {
    req.user = {
      uid: 'demo-user-123',
      email: 'guest@sikaya.com',
      name: 'Siswa Tamu (Demo)',
      auth_time: Math.floor(Date.now() / 1000),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      aud: 'demo-project',
      iss: 'https://securetoken.google.com/demo-project',
      sub: 'demo-user-123',
      firebase: { identities: {}, sign_in_provider: 'anonymous' }
    } as DecodedIdToken;
    return next();
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token, true);
    req.user = decodedToken;
    return next();
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    
    // Check token expiration
    if (err?.code === 'auth/id-token-expired' || err?.message?.includes('expired')) {
      return next(
        new AppError(
          'Sesi autentikasi telah kedaluwarsa. Silakan muat ulang atau login kembali.',
          401,
          'TOKEN_EXPIRED'
        )
      );
    }

    // Check token revocation
    if (err?.code === 'auth/id-token-revoked') {
      return next(
        new AppError(
          'Sesi autentikasi telah dicabut. Silakan login kembali.',
          401,
          'TOKEN_REVOKED'
        )
      );
    }

    // Invalid token
    return next(
      new AppError(
        'Token autentikasi tidak valid atau gagal diverifikasi.',
        401,
        'INVALID_TOKEN'
      )
    );
  }
}

/**
 * Require authentication alias.
 */
export const requireAuth = authenticate;
export default authenticate;
