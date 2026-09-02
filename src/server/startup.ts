import { validateEnvironment } from '../lib/env.ts';
import { adminDb } from '../lib/firebase-admin.ts';
import { createApp } from './app.ts';
import { Logger } from '../utils/logger.ts';

export async function startup(): Promise<void> {
  try {
    const envConfig = validateEnvironment();
    const isProduction = envConfig.NODE_ENV === 'production';
    const PORT = envConfig.PORT;

    if (!adminDb) {
      throw new Error('Firebase Admin database initialization failed');
    }
    Logger.info('🔥 Firebase Admin successfully initialized');

    const app = await createApp(isProduction);

    app.listen(PORT, '0.0.0.0', () => {
      Logger.info(`✅ SiKaya Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (err: unknown) {
    const error = err as Error;
    Logger.error('❌ Fatal Error starting SiKaya server:', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}
