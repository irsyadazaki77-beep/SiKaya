import express from 'express';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '../lib/firebase-admin.ts';
import { authenticate } from '../middleware/authenticate.ts';
import { AppError } from '../middleware/errorHandler.ts';
import {
  CompleteModuleSchema,
  UserProfileUpdateSchema,
  CreateInvestmentSchema
} from '../lib/schemas.ts';

export const apiRouter = express.Router();

// 1. Module Completion Endpoint (Authoritative XP reward)
apiRouter.post('/complete-module', authenticate, async (req, res, next) => {
  try {
    const uid = req.user!.uid;
    const body = CompleteModuleSchema.parse(req.body);

    const progressRef = adminDb.collection('learningProgress').doc(`${uid}_${body.moduleId}`);
    const progressSnap = await progressRef.get();

    if (progressSnap.exists) {
      return res.json({
        success: true,
        message: 'Modul ini sudah diselesaikan sebelumnya.',
        alreadyCompleted: true,
      });
    }

    const xpReward = 50; // System-controlled reward

    // Atomic batch write
    const batch = adminDb.batch();
    batch.set(progressRef, {
      userId: uid,
      moduleId: body.moduleId,
      status: 'COMPLETED',
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

    // Fetch updated user to return latest state
    const userDoc = await userRef.get();
    const updatedUser = userDoc.data();

    res.json({
      success: true,
      message: `Modul berhasil diselesaikan! +${xpReward} XP diperoleh.`,
      xpEarned: xpReward,
      currentXp: updatedUser?.xp || xpReward,
    });
  } catch (error) {
    next(error);
  }
});

// 2. Safe XP Award Endpoint (e.g. Daily Quiz / Quest)
apiRouter.post('/add-xp', authenticate, async (req, res, next) => {
  try {
    const uid = req.user!.uid;
    const rawAmount = Number(req.body.amount);

    if (isNaN(rawAmount) || rawAmount <= 0 || rawAmount > 100) {
      throw new AppError('Jumlah XP tidak valid (maksimal 100 XP per aksi edukasi).', 400, 'INVALID_XP_AMOUNT');
    }

    const userRef = adminDb.collection('users').doc(uid);
    await userRef.set(
      {
        xp: FieldValue.increment(rawAmount),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    const userDoc = await userRef.get();
    const updatedUser = userDoc.data();

    res.json({
      success: true,
      addedXp: rawAmount,
      currentXp: updatedUser?.xp || rawAmount,
    });
  } catch (error) {
    next(error);
  }
});

// 3. User Profile Update Endpoint (Client-editable fields only)
apiRouter.patch('/profile', authenticate, async (req, res, next) => {
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
apiRouter.post('/transactions', authenticate, async (req, res, next) => {
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
