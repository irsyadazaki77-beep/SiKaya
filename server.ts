import { startup } from './src/server/startup.ts';

startup().catch((err) => {
  console.error('❌ Crash in server startup:', err);
  process.exit(1);
});
