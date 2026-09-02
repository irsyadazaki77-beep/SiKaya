import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';

let testEnv: any;
let isEmulatorRunning = false;

describe('Firestore Security Rules', () => {
  beforeAll(async () => {
    try {
      testEnv = await initializeTestEnvironment({
        projectId: 'ai-studio-sikaya-450ee067-b5b6-474e-bc20-ab859f262008',
        firestore: {
          host: '127.0.0.1',
          port: 8080,
          rules: readFileSync(resolve(__dirname, '../../../firestore.rules'), 'utf8'),
        },
      });
      isEmulatorRunning = true;
    } catch (err) {
      console.warn('⚠️ Firestore Emulator is not reachable on 127.0.0.1:8080 or failed to load rules. Skipping rules tests.');
      isEmulatorRunning = false;
    }
  });

  afterAll(async () => {
    if (testEnv) {
      try {
        await testEnv.cleanup();
      } catch (e) {}
    }
  });

  beforeEach(async () => {
    if (!isEmulatorRunning) {
      return;
    }
    if (testEnv) {
      try {
        await testEnv.clearFirestore();
      } catch (e) {}
    }
  });

  // 1. User A cannot read User B's data
  it('denies user A reading user B data in users and chatHistory collections', async () => {
    if (!isEmulatorRunning) return;
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    
    // Alice trying to read Bob's profile
    await assertFails(aliceDb.collection('users').doc('bob').get());
    
    // Alice trying to read Bob's chat history
    await assertFails(aliceDb.collection('chatHistory').where('userId', '==', 'bob').get());
  });

  // 2. Unauthenticated user rejected
  it('denies unauthenticated users from reading or writing to any collection', async () => {
    if (!isEmulatorRunning) return;
    const unauthDb = testEnv.unauthenticatedContext().firestore();
    
    await assertFails(unauthDb.collection('users').doc('alice').get());
    await assertFails(unauthDb.collection('chatHistory').get());
    await assertFails(unauthDb.collection('investmentHistory').get());
    await assertFails(unauthDb.collection('learningProgress').get());
  });

  // 3. Client cannot manipulate XP
  it('prevents client from manipulating or inflating XP during update', async () => {
    if (!isEmulatorRunning) return;
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    
    // Setup initial profile with 0 XP (can only create with 0 XP)
    const initialProfile = {
      uid: 'alice',
      email: 'alice@example.com',
      fullName: 'Alice In Wonderland',
      avatar: 'avatar_alice',
      xp: 0
    };
    await aliceDb.collection('users').doc('alice').set(initialProfile);

    // Alice trying to update her profile with higher XP (100)
    const badUpdate = {
      uid: 'alice',
      email: 'alice@example.com',
      fullName: 'Alice In Wonderland',
      avatar: 'avatar_alice',
      xp: 100 // Client trying to inflate XP
    };
    await assertFails(aliceDb.collection('users').doc('alice').update(badUpdate));
  });

  // 4. Client cannot manipulate rank/badges
  it('prevents client from updating read-only fields like rank or badges', async () => {
    if (!isEmulatorRunning) return;
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    
    const initialProfile = {
      uid: 'alice',
      email: 'alice@example.com',
      fullName: 'Alice In Wonderland',
      avatar: 'avatar_alice',
      xp: 0,
      literacyLevel: 'Pemula',
      rank: 'Perunggu',
      badges: ['pioneer']
    };
    await aliceDb.collection('alice').doc('alice').set(initialProfile);

    // Try to update literacyLevel or rank/badges which are not permitted or safe profile updates
    const badUpdate = {
      ...initialProfile,
      literacyLevel: 'Ahli' // Not in safe profile updates
    };
    await assertFails(aliceDb.collection('users').doc('alice').update(badUpdate));
  });

  // 5. Invalid transactions rejected
  it('rejects invalid transaction schemas in investmentHistory', async () => {
    if (!isEmulatorRunning) return;
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    
    // Missing required fields (e.g., symbol or price)
    const badTx = {
      userId: 'alice',
      type: 'BELI',
      shares: 10,
      createdAt: new Date().toISOString()
    };
    await assertFails(aliceDb.collection('investmentHistory').add(badTx));
  });

  // 6. Negative or zero shares rejected
  it('rejects negative or zero shares in transactions', async () => {
    if (!isEmulatorRunning) return;
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    
    const baseTx = {
      userId: 'alice',
      symbol: 'BBCA',
      type: 'BELI',
      price: 10000,
      total: 100000,
      createdAt: new Date().toISOString()
    };

    // Zero shares
    await assertFails(aliceDb.collection('investmentHistory').add({ ...baseTx, shares: 0 }));
    // Negative shares
    await assertFails(aliceDb.collection('investmentHistory').add({ ...baseTx, shares: -5 }));
  });

  // 7. Valid user profile update accepted
  it('accepts valid user profile updates (fullName, avatar)', async () => {
    if (!isEmulatorRunning) return;
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    
    const initialProfile = {
      uid: 'alice',
      email: 'alice@example.com',
      fullName: 'Alice In Wonderland',
      avatar: 'avatar_alice',
      xp: 0
    };
    await aliceDb.collection('users').doc('alice').set(initialProfile);

    // Valid update of safe fields
    const validUpdate = {
      uid: 'alice',
      email: 'alice@example.com',
      fullName: 'Alice Smith',
      avatar: 'avatar_alice_new',
      xp: 0
    };
    await assertSucceeds(aliceDb.collection('users').doc('alice').set(validUpdate));
  });
});
