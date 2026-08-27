import { auth, googleAuthProvider } from '../lib/firebase';
import { signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';

export const authService = {
  async loginWithGoogle(): Promise<FirebaseUser> {
    const result = await signInWithPopup(auth, googleAuthProvider);
    return result.user;
  },

  async logout(): Promise<void> {
    await signOut(auth);
    localStorage.removeItem('demo_token');
    localStorage.removeItem('guest_profile');
  },

  async getIdToken(): Promise<string | null> {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    const demoToken = localStorage.getItem('demo_token');
    return demoToken || null;
  },

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }
};
