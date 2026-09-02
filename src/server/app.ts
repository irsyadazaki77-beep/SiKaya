import express, { Express } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { configureSecurity } from './security.ts';
import { requestLogger } from '../middleware/requestLogger.ts';
import { generalApiLimiter, authLimiter } from '../middleware/rateLimiter.ts';
import {
  globalErrorHandler,
  notFoundHandler,
} from '../middleware/errorHandler.ts';

import { healthRouter } from '../routes/health.routes.ts';
import { userRouter } from '../routes/user.routes.ts';
import { aiRouter } from '../routes/ai.routes.ts';
import { marketRouter } from '../routes/market.routes.ts';

export async function createApp(isProduction: boolean): Promise<Express> {
  const app = express();

  app.set('trust proxy', 1);

  app.use(requestLogger);

  configureSecurity(app, isProduction);

  app.use('/api', generalApiLimiter);

  app.use('/api', healthRouter);
  app.use('/api/user', authLimiter, userRouter);
  app.use('/api', aiRouter);
  app.use('/api', marketRouter);

  app.all('/api/*', notFoundHandler);

  app.use(globalErrorHandler);

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}
