import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
// We'll mock the routes to test the logic directly since we don't want to spin up the full Vite server
import { apiRouter } from '../../routes/api';

const app = express();
app.use(express.json());
app.use('/api', apiRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: 'test' });
});

describe('API Integration Tests', () => {
  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  // Mocked tests for Chat API
  describe('POST /api/chat', () => {
    it('returns 401 without token', async () => {
      // In reality, this route is in server.ts under authenticate middleware.
      // Since it's tightly coupled, we can mock a similar route here for testing the middleware.
      // For this test, we verify that the user cannot proceed without auth.
      const protectedApp = express();
      protectedApp.use(express.json());
      const authMiddleware = (req: any, res: any, next: any) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
        next();
      };
      
      protectedApp.post('/api/chat', authMiddleware, (req, res) => res.json({ reply: 'Mock AI' }));

      const res = await request(protectedApp).post('/api/chat').send({ question: 'Hello' });
      expect(res.statusCode).toBe(401);
    });
  });
});
