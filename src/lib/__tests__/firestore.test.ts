import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';

let testEnv: any;

describe.skip('Firestore Security Rules', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'ai-studio-sikaya-450ee067-b5b6-474e-bc20-ab859f262008',
      firestore: {
        rules: readFileSync(resolve(__dirname, '../../../firestore.rules'), 'utf8'),
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  it('allows user to read their own chat history', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    const query = aliceDb.collection('chatHistory').where('userId', '==', 'alice');
    await assertSucceeds(query.get());
  });

  it('denies user A reading user B data', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    const query = aliceDb.collection('chatHistory').where('userId', '==', 'bob');
    await assertFails(query.get());
  });

  it('denies unauthenticated users from reading data', async () => {
    const unauthDb = testEnv.unauthenticatedContext().firestore();
    const query = unauthDb.collection('chatHistory');
    await assertFails(query.get());
  });
});
