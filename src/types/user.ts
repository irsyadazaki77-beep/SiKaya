export interface User {
  uid?: string;
  email: string;
  fullName: string;
  avatar: string;
  xp: number;
  literacyLevel: string;
  badges?: string[];
  completedModules: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile extends User {
  phoneNumber?: string;
  bio?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    language?: 'id' | 'en' | 'ja' | 'zh';
    notificationsEnabled?: boolean;
    dailyReminder?: boolean;
  };
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => void;
  updateUserXP?: (amount: number, reason?: string) => Promise<void>;
  completeModule: (moduleId: string, xpReward?: number) => Promise<void>;
  addXp?: (amount: number) => Promise<void>;
  updateProfile?: (fullName: string, avatar: string, literacyLevel?: string) => Promise<void>;
  unlockBadge?: (badgeId: string) => Promise<void>;
}
