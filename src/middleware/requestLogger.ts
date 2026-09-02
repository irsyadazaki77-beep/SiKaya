import type { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../utils/logger.ts';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();
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
}
