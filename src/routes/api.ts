import express from 'express';

export const apiRouter = express.Router();

apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default apiRouter;
