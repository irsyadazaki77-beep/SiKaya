import { db } from '../lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc,
  limit
} from 'firebase/firestore';
import { User } from '../types/user';

export const firestoreService = {
  async getUserProfile(uid: string): Promise<User | null> {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        return {
          uid,
          fullName: data.fullName || 'User',
          email: data.email || '',
          avatar: data.avatar || '🦊',
          literacyLevel: data.literacyLevel || 'Pemula',
          xp: data.xp || 0,
          badges: data.badges || [],
          completedModules: []
        };
      }
      return null;
    } catch (err) {
      console.error('[firestoreService] Error getting user profile:', err);
      return null;
    }
  },

  async createUserProfile(uid: string, profile: Partial<User>): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, {
        uid,
        email: profile.email || '',
        fullName: profile.fullName || 'User',
        avatar: profile.avatar || '🦊',
        literacyLevel: profile.literacyLevel || 'Pemula',
        xp: profile.xp || 0,
        badges: profile.badges || [],
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error('[firestoreService] Error creating user profile:', err);
      throw err;
    }
  },

  async getCompletedModules(uid: string): Promise<string[]> {
    try {
      const progRef = collection(db, 'learningProgress');
      const q = query(progRef, where('userId', '==', uid), limit(50));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docSnap => docSnap.data().moduleId);
    } catch (err) {
      console.error('[firestoreService] Error fetching completed modules:', err);
      return [];
    }
  },

  async recordLearningProgress(userId: string, moduleId: string, score: number = 100): Promise<void> {
    try {
      const progressRef = collection(db, 'learningProgress');
      await addDoc(progressRef, {
        userId,
        moduleId,
        score,
        completedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('[firestoreService] Error recording learning progress:', err);
    }
  }
};
