import express from 'express';
import { getApps } from 'firebase-admin/app';
import { adminDb } from '../lib/firebase-admin.ts';
import { validateEnvironment } from '../lib/env.ts';
import { ReadinessResponse } from '../types/api.ts';

export const healthRouter = express.Router();

healthRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    app: 'SiKaya',
    environment: process.env.NODE_ENV || 'development'
  });
});

healthRouter.get('/ready', (req, res) => {
  let isFirebaseOk: 'ok' | 'fail' = 'ok';
  let isEnvOk: 'ok' | 'fail' = 'ok';

  try {
    const env = validateEnvironment();
    if (!env.PORT) {
      isEnvOk = 'fail';
    }
  } catch (envError) {
    isEnvOk = 'fail';
  }

  try {
    const apps = getApps();
    if (apps.length === 0 || !adminDb) {
      isFirebaseOk = 'fail';
    }
  } catch (firebaseError) {
    isFirebaseOk = 'fail';
  }

  const response: ReadinessResponse = {
    status: (isFirebaseOk === 'ok' && isEnvOk === 'ok') ? 'ready' : 'not_ready',
    checks: {
      firebase: isFirebaseOk,
      environment: isEnvOk
    }
  };

  if (response.status === 'ready') {
    res.json(response);
  } else {
    res.status(503).json(response);
  }
});

export default healthRouter;
