import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, googleAuthProvider, db } from '../lib/firebase';
import { signInWithPopup, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

export interface User {
  fullName: string;
  email: string;
  avatar: string;
  literacyLevel: string;
  xp: number;
  completedModules: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => void;
  completeModule: (moduleId: string, xpReward?: number) => void;
  addXp: (amount: number) => void;
  updateProfile: (fullName: string, avatar: string, literacyLevel?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        setToken(idToken);
        try {
          // Fetch user doc directly from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          let userData: any;
          if (userDocSnap.exists()) {
            userData = userDocSnap.data();
          } else {
            userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              fullName: firebaseUser.displayName || 'User',
              avatar: '🦊',
              literacyLevel: 'Pemula',
              xp: 0,
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, userData);
          }

          // Fetch learning progress directly from Firestore
          let completedModules: string[] = [];
          try {
            const progRef = collection(db, 'learningProgress');
            const q = query(progRef, where('userId', '==', firebaseUser.uid));
            const querySnapshot = await getDocs(q);
            completedModules = querySnapshot.docs.map(doc => doc.data().moduleId);
          } catch (e) {
            console.error("Error fetching learning progress:", e);
          }

          setUser({
            fullName: userData.fullName || firebaseUser.displayName || 'User',
            email: userData.email || firebaseUser.email || '',
            avatar: userData.avatar || '🦊',
            literacyLevel: userData.literacyLevel || 'Pemula',
            xp: userData.xp || 0,
            completedModules
          });
        } catch (error) {
          console.error("Error fetching user data from Firestore", error);
          setUser({
            fullName: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            avatar: '🦊',
            literacyLevel: 'Pemula',
            xp: 0,
            completedModules: []
          });
        }
        setLoading(false);
      } else {
        // Fallback check for demo guest session
        const savedToken = localStorage.getItem('demo_token');
        if (savedToken === 'demo-token') {
          setToken('demo-token');
          const guestProfileStr = localStorage.getItem('guest_profile');
          const guestProfile = guestProfileStr ? JSON.parse(guestProfileStr) : {
            fullName: 'Siswa Tamu (Demo)',
            email: 'guest@sikaya.com',
            avatar: '🦊',
            literacyLevel: 'Pemula',
            xp: 150,
            completedModules: []
          };
          setUser(guestProfile);
          setLoading(false);
        } else {
          setUser(null);
          setToken(null);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      localStorage.removeItem('demo_token');
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const loginAsGuest = async () => {
    setLoading(true);
    localStorage.setItem('demo_token', 'demo-token');
    setToken('demo-token');
    try {
      const guestProfileStr = localStorage.getItem('guest_profile');
      const guestProfile = guestProfileStr ? JSON.parse(guestProfileStr) : {
        fullName: 'Siswa Tamu (Demo)',
        email: 'guest@sikaya.com',
        avatar: '🦊',
        literacyLevel: 'Pemula',
        xp: 150,
        completedModules: []
      };
      setUser(guestProfile);
    } catch (e) {
      setUser({
        fullName: 'Siswa Tamu (Demo)',
        email: 'guest@sikaya.com',
        avatar: '🦊',
        literacyLevel: 'Pemula',
        xp: 150,
        completedModules: []
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('demo_token');
    await signOut(auth);
  };

  const completeModule = async (moduleId: string, xpReward = 50) => {
    if (!user) return;
    if (user.completedModules.includes(moduleId)) return;
    
    const updatedModules = [...user.completedModules, moduleId];
    const updatedXp = user.xp + xpReward;

    setUser(prev => prev ? ({
      ...prev,
      completedModules: updatedModules,
      xp: updatedXp
    }) : prev);

    if (token && token !== 'demo-token' && auth.currentUser) {
      try {
        const uid = auth.currentUser.uid;
        // Save learning progress directly to Firestore
        await setDoc(doc(db, 'learningProgress', `${uid}_${moduleId}`), {
          userId: uid,
          moduleId,
          status: 'COMPLETED',
          completedAt: new Date().toISOString()
        }, { merge: true });

        // Update user XP directly to Firestore
        await updateDoc(doc(db, 'users', uid), {
          xp: updatedXp
        });
      } catch (err) {
        console.error("Error updating module completion:", err);
      }
    } else if (token === 'demo-token') {
      const updatedGuest = {
        ...user,
        completedModules: updatedModules,
        xp: updatedXp
      };
      localStorage.setItem('guest_profile', JSON.stringify(updatedGuest));
    }
  };

  const addXp = async (amount: number) => {
    if (!user) return;
    const updatedXp = user.xp + amount;

    setUser(prev => prev ? ({ ...prev, xp: updatedXp }) : prev);

    if (token && token !== 'demo-token' && auth.currentUser) {
      try {
        const uid = auth.currentUser.uid;
        await updateDoc(doc(db, 'users', uid), {
          xp: updatedXp
        });
      } catch (err) {
        console.error("Error updating XP:", err);
      }
    } else if (token === 'demo-token') {
      const updatedGuest = {
        ...user,
        xp: updatedXp
      };
      localStorage.setItem('guest_profile', JSON.stringify(updatedGuest));
    }
  };

  const updateProfile = async (fullName: string, avatar: string, literacyLevel?: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      fullName,
      avatar,
      ...(literacyLevel && { literacyLevel })
    };

    setUser(updatedUser);

    if (token && token !== 'demo-token' && auth.currentUser) {
      try {
        const uid = auth.currentUser.uid;
        await updateDoc(doc(db, 'users', uid), {
          fullName,
          avatar,
          ...(literacyLevel && { literacyLevel })
        });
      } catch (err) {
        console.error('Failed to sync profile to database', err);
      }
    } else if (token === 'demo-token') {
      localStorage.setItem('guest_profile', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, login, loginAsGuest, logout, completeModule, addXp, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
