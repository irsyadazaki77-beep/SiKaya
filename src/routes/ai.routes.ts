import express from 'express';
import { authenticate } from '../middleware/authenticate.ts';
import { aiChatLimiter } from '../middleware/rateLimiter.ts';
import { ChatRequestSchema } from '../lib/schemas.ts';
import { GeminiService } from '../services/gemini.service.ts';

export const aiRouter = express.Router();

const activeAiUsers = new Set<string>();

aiRouter.post('/chat', authenticate, aiChatLimiter, async (req, res, next) => {
  const userUid = req.user?.uid || 'unknown';

  if (activeAiUsers.has(userUid)) {
    return res.status(429).json({
      status: 'error',
      error: {
        code: 'CONCURRENT_REQUEST_LIMIT',
        message: 'Permintaan Anda sebelumnya masih diproses. Mohon tunggu beberapa saat sebelum mengirim pertanyaan baru.'
      }
    });
  }

  activeAiUsers.add(userUid);

  try {
    const validatedBody = ChatRequestSchema.parse(req.body);
    const { profile, question, mood } = validatedBody;

    const result = await GeminiService.generateChatReply({ profile, question, mood }, userUid);

    res.json(result);
  } catch (error) {
    next(error);
  } finally {
    activeAiUsers.delete(userUid);
  }
});

export default aiRouter;
