import type { IncomingMessage, ServerResponse } from 'http';
import { createApp } from '../src/server/app.ts';

let appPromise: Promise<any> | null = null;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!appPromise) {
    appPromise = createApp(true);
  }
  const app = await appPromise;
  return app(req, res);
}
