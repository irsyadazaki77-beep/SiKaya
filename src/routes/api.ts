import express from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '../lib/firebase-admin.ts';
import { authenticate } from '../middleware/authenticate.ts';
import { AppError } from '../middleware/errorHandler.ts';
import { rewardLimiter, profileMutationLimiter } from '../middleware/rateLimiter.ts';
import {
  CompleteModuleSchema,
  UserProfileUpdateSchema,
  CreateInvestmentSchema,
  ClaimEventSchema,
  SaveManualAssetsSchema,
  PurchaseItemSchema
} from '../lib/schemas.ts';

export const apiRouter = express.Router();

export const OFFICIAL_MODULE_REGISTRY: Record<string, { title: string; xpReward: number }> = {
  budgeting: { title: 'Aturan 50/30/20', xpReward: 100 },
  debt: { title: 'Anti-FOMO & Pinjol', xpReward: 100 },
  compound: { title: 'Compound Interest', xpReward: 100 },
  investing: { title: 'Profil Risiko & Aset', xpReward: 100 },
  emergency: { title: 'Dana Darurat & Uji Stres', xpReward: 100 },
  crypto: { title: 'Crypto & Web3', xpReward: 100 },
  reksadana: { title: 'Reksa Dana & SBN', xpReward: 100 },
  saham: { title: 'Dasar Analisis Saham', xpReward: 100 },
  career: { title: 'Peta Jalan Karir Baru', xpReward: 100 },
  portfolio: { title: 'Rebalancing Portofolio', xpReward: 100 },
};

export const EVENT_REWARD_REGISTRY: Record<string, { xpReward: number; maxPerDay: number }> = {
  QUIZ_COMPLETED: { xpReward: 20, maxPerDay: 10 },
  DAILY_MISSION: { xpReward: 25, maxPerDay: 5 },
  POMODORO_COMPLETED: { xpReward: 30, maxPerDay: 5 },
  SIMULATOR_CHALLENGE: { xpReward: 30, maxPerDay: 5 },
  CALCULATOR_ANALYSIS: { xpReward: 10, maxPerDay: 5 },
  LESSON_READ: { xpReward: 25, maxPerDay: 10 },
  CHEST_REWARD: { xpReward: 150, maxPerDay: 2 },
  DAILY_QUIZ: { xpReward: 50, maxPerDay: 5 },
};

// 1. Authoritative Module Completion Endpoint
apiRouter.post('/complete-module', authenticate, rewardLimiter, async (req, res, next) => {
  try {
    const uid = req.user!.uid;
    const body = CompleteModuleSchema.parse(req.body);

    const moduleMeta = OFFICIAL_MODULE_REGISTRY[body.moduleId];
    if (!moduleMeta) {
      throw new AppError(
        `Modul ID '${body.moduleId}' tidak terdaftar dalam silabus resmi SiKaya.`,
        400,
        'INVALID_MODULE_ID'
      );
    }

    const progressRef = adminDb.collection('learningProgress').doc(`${uid}_${body.moduleId}`);
    const progressSnap = await progressRef.get();

    if (progressSnap.exists) {
      return res.json({
        success: true,
        message: 'Modul ini sudah diselesaikan sebelumnya.',
        alreadyCompleted: true,
        xpEarned: 0,
      });
    }

    const xpReward = moduleMeta.xpReward;

    // Atomic batch write to guarantee consistency
    const batch = adminDb.batch();
    batch.set(progressRef, {
      userId: uid,
      moduleId: body.moduleId,
      status: 'COMPLETED',
      score: body.score ?? 100,
      xpEarned: xpReward,
      completedAt: new Date().toISOString(),
      createdAt: FieldValue.serverTimestamp(),
    });

    const userRef = adminDb.collection('users').doc(uid);
    batch.set(
      userRef,
      {
        xp: FieldValue.increment(xpReward),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    await batch.commit();

    // Fetch updated user to return authoritative latest state
    const userDoc = await userRef.get();
    const updatedUser = userDoc.data();

    res.json({
      success: true,
      message: `Modul '${moduleMeta.title}' berhasil diselesaikan! +${xpReward} XP diperoleh.`,
      xpEarned: xpReward,
      currentXp: updatedUser?.xp || xpReward,
    });
  } catch (error) {
    next(error);
  }
});

// 2. Authoritative Event-Based Gamification Reward Claim Endpoint
apiRouter.post('/claim-event', authenticate, rewardLimiter, async (req, res, next) => {
  try {
    const uid = req.user!.uid;
    const body = ClaimEventSchema.parse(req.body);

    const rewardConfig = EVENT_REWARD_REGISTRY[body.eventType];
    if (!rewardConfig) {
      throw new AppError('Tipe event tidak valid.', 400, 'INVALID_EVENT_TYPE');
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const eventClaimRef = adminDb.collection('eventClaims').doc(`${uid}_${body.eventType}_${body.eventId}_${todayStr}`);
    const claimSnap = await eventClaimRef.get();

    if (claimSnap.exists) {
      return res.status(409).json({
        status: 'error',
        error: {
          code: 'EVENT_ALREADY_CLAIMED',
          message: 'Reward untuk aktivitas edukasi ini sudah diklaim hari ini.'
        }
      });
    }

    const xpReward = rewardConfig.xpReward;

    const batch = adminDb.batch();
    batch.set(eventClaimRef, {
      userId: uid,
      eventType: body.eventType,
      eventId: body.eventId,
      xpReward,
      claimedAt: new Date().toISOString(),
      dateKey: todayStr,
      metadata: body.metadata || {},
      createdAt: FieldValue.serverTimestamp(),
    });

    const userRef = adminDb.collection('users').doc(uid);
    batch.set(
      userRef,
      {
        xp: FieldValue.increment(xpReward),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    await batch.commit();

    const userDoc = await userRef.get();
    const updatedUser = userDoc.data();

    res.json({
      success: true,
      message: `Aktivitas berhasil diverifikasi! +${xpReward} XP diperoleh.`,
      xpEarned: xpReward,
      currentXp: updatedUser?.xp || xpReward,
    });
  } catch (error) {
    next(error);
  }
});

// 3. User Profile Update Endpoint (Client-editable fields only)
apiRouter.patch('/profile', authenticate, profileMutationLimiter, async (req, res, next) => {
  try {
    const uid = req.user!.uid;
    const validatedData = UserProfileUpdateSchema.parse(req.body);

    const updatePayload: Record<string, unknown> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (validatedData.fullName !== undefined) updatePayload.fullName = validatedData.fullName;
    if (validatedData.avatar !== undefined) updatePayload.avatar = validatedData.avatar;
    if (validatedData.language !== undefined) updatePayload.language = validatedData.language;
    if (validatedData.preferences !== undefined) updatePayload.preferences = validatedData.preferences;

    const userRef = adminDb.collection('users').doc(uid);
    await userRef.set(updatePayload, { merge: true });

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui.',
      data: updatePayload,
    });
  } catch (error) {
    next(error);
  }
});

// 4. Secure Investment Transaction Logging
apiRouter.post('/transactions', authenticate, profileMutationLimiter, async (req, res, next) => {
  try {
    const uid = req.user!.uid;
    const validated = CreateInvestmentSchema.parse(req.body);

    // Authoritative Server-side calculation
    const calculatedTotal = Number((validated.shares * validated.price).toFixed(2));

    const historyRef = adminDb.collection('investmentHistory').doc();
    const docData = {
      userId: uid,
      symbol: validated.symbol.toUpperCase(),
      type: validated.type,
      shares: validated.shares,
      price: validated.price,
      total: calculatedTotal,
      createdAt: new Date().toISOString(),
      serverTimestamp: FieldValue.serverTimestamp(),
    };

    await historyRef.set(docData);

    res.json({
      success: true,
      id: historyRef.id,
      transaction: docData,
    });
  } catch (error) {
    next(error);
  }
});

// 5. User Manual Portfolio Assets Sync (Cloud Persistence)
apiRouter.get('/manual-assets', authenticate, async (req, res, next) => {
  try {
    const uid = req.user!.uid;
    const docRef = adminDb.collection('userPortfolios').doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.json({ success: true, assets: [] });
    }

    const data = docSnap.data();
    res.json({ success: true, assets: data?.manualAssets || [] });
  } catch (error) {
    next(error);
  }
});

apiRouter.put('/manual-assets', authenticate, profileMutationLimiter, async (req, res, next) => {
  try {
    const uid = req.user!.uid;
    const validated = SaveManualAssetsSchema.parse(req.body);

    const docRef = adminDb.collection('userPortfolios').doc(uid);
    await docRef.set(
      {
        userId: uid,
        manualAssets: validated.assets,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    res.json({
      success: true,
      message: 'Aset manual berhasil disinkronkan ke cloud.',
      assets: validated.assets,
    });
  } catch (error) {
    next(error);
  }
});

// 6. Authoritative Shop Item Purchase (deducts XP safely)
apiRouter.post('/purchase-item', authenticate, profileMutationLimiter, async (req, res, next) => {
  try {
    const uid = req.user!.uid;
    const body = PurchaseItemSchema.parse(req.body);

    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new AppError('Pengguna tidak ditemukan.', 404, 'USER_NOT_FOUND');
    }

    const userData = userDoc.data();
    const currentXp = Number(userData?.xp) || 0;

    if (currentXp < body.cost) {
      throw new AppError(
        `Koin XP tidak mencukupi. Anda membutuhkan ${body.cost} XP, namun saat ini hanya memiliki ${currentXp} XP.`,
        400,
        'INSUFFICIENT_XP'
      );
    }

    const newXp = Math.max(0, currentXp - body.cost);

    await userRef.set(
      {
        xp: newXp,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    res.json({
      success: true,
      message: `Berhasil membeli ${body.itemType} '${body.itemId}'. -${body.cost} XP`,
      deductedXp: body.cost,
      currentXp: newXp,
    });
  } catch (error) {
    next(error);
  }
});

const BENCHMARK_LEADERBOARD_PLAYERS = [
  { id: 'p1', name: 'Rian Pratama', xp: 4850, avatar: '🦁', level: 'Diamond', title: 'Master Compounder 💎', rank: 1, change: 'same' as const },
  { id: 'p2', name: 'Nadia Salsabila', xp: 4320, avatar: '👩‍💼', level: 'Diamond', title: 'Valuation Analyst 📊', rank: 2, change: 'up' as const },
  { id: 'p3', name: 'Budi Santoso', xp: 3950, avatar: '👨‍💼', level: 'Diamond', title: 'SBN Specialist 🇮🇩', rank: 3, change: 'down' as const },
  { id: 'p4', name: 'Siti Aminah', xp: 3200, avatar: '🧕', level: 'Diamond', title: 'RDPU Syariah Pro 🌙', rank: 4, change: 'same' as const },
  { id: 'p5', name: 'Alex Chandra', xp: 2890, avatar: '👨‍💻', level: 'Diamond', title: 'Swing Trader 📈', rank: 5, change: 'up' as const },
];

// 7. Global Leaderboard Endpoint (Realtime Learner Rankings with Graceful Fallback)
apiRouter.get('/leaderboard', async (req, res, next) => {
  try {
    const usersSnap = await adminDb
      .collection('users')
      .orderBy('xp', 'desc')
      .limit(30)
      .get();

    if (usersSnap.empty) {
      return res.json({ success: true, players: BENCHMARK_LEADERBOARD_PLAYERS });
    }

    const players = usersSnap.docs.map((docSnap, index) => {
      const data = docSnap.data();
      const xp = Number(data.xp) || 0;
      let level = 'Pemula';
      if (xp >= 10000) level = 'Grandmaster';
      else if (xp >= 5000) level = 'Master';
      else if (xp >= 2500) level = 'Diamond';
      else if (xp >= 1000) level = 'Gold';
      else if (xp >= 500) level = 'Silver';

      return {
        id: docSnap.id,
        name: data.fullName || 'Warga SiKaya',
        xp,
        avatar: data.avatar || '🦊',
        level,
        title: data.title || 'Investor Cerdas 🎓',
        rank: index + 1,
        change: 'same' as const
      };
    });

    res.json({ success: true, players });
  } catch (error) {
    // Graceful fallback to avoid 500 in preview/offline mode
    res.json({ success: true, players: BENCHMARK_LEADERBOARD_PLAYERS, fallback: true });
  }
});

export default apiRouter;
