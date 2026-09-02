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
  ClaimEventSchema
} from '../lib/schemas.ts';

export const apiRouter = express.Router();

export const OFFICIAL_MODULE_REGISTRY: Record<string, { title: string; xpReward: number }> = {
  budgeting: { title: 'Aturan 50/30/20', xpReward: 50 },
  debt: { title: 'Anti-FOMO & Pinjol', xpReward: 50 },
  compound: { title: 'Compound Interest', xpReward: 50 },
  investing: { title: 'Profil Risiko & Aset', xpReward: 50 },
  emergency: { title: 'Dana Darurat & Uji Stres', xpReward: 50 },
  crypto: { title: 'Crypto & Web3', xpReward: 50 },
  reksadana: { title: 'Reksa Dana & SBN', xpReward: 50 },
  saham: { title: 'Dasar Analisis Saham', xpReward: 50 },
  career: { title: 'Peta Jalan Karir Baru', xpReward: 50 },
  portfolio: { title: 'Rebalancing Portofolio', xpReward: 50 },
};

export const EVENT_REWARD_REGISTRY = {
  QUIZ_COMPLETED: { xpReward: 20, maxPerDay: 5 },
  DAILY_MISSION: { xpReward: 25, maxPerDay: 3 },
  POMODORO_COMPLETED: { xpReward: 15, maxPerDay: 4 },
  SIMULATOR_CHALLENGE: { xpReward: 30, maxPerDay: 3 },
  CALCULATOR_ANALYSIS: { xpReward: 10, maxPerDay: 5 },
} as const;

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

export default apiRouter;

